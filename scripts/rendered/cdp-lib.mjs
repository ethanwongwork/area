// Headless Microsoft Edge (or Chrome) over the DevTools protocol, for the rendered captures and checks. The same
// approach as the interaction pass's driver (.claude/skills/area-interaction-pass/scripts/cdp.mjs), with Node's own
// WebSocket and no dependency: one browser per run, in a fresh profile that is deleted afterwards, headless, so it never
// touches an open Area window or the owner's browser profile. Its DevTools port is whatever the OS gives it.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CANDIDATES = [
  process.env.AREA_RENDERED_BROWSER,
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/microsoft-edge", "/usr/bin/google-chrome", "/usr/bin/chromium",
].filter(Boolean);

export function browserPath() {
  const found = CANDIDATES.find(path => existsSync(path));
  if (!found) throw new Error("No Edge or Chrome found; set AREA_RENDERED_BROWSER to a Chromium binary.");
  return found;
}

const wait = ms => new Promise(done => setTimeout(done, ms));

/**
 * Never without these: Edge signs a fresh profile into the owner's account unless it runs as a guest with implicit
 * sign-in off (2026-10). launch() refuses to start a browser whose arguments lack either.
 */
export const REQUIRED_FLAGS = ["--guest", "--disable-features=msImplicitSignin"];
const assertSafe = args => {
  if (!args.includes("--guest") || !args.some(arg => /^--disable-features=(.*,)?msImplicitSignin(,|$)/.test(arg))) throw new Error(`Refusing to launch Edge without ${REQUIRED_FLAGS.join(" ")}`);
  return args;
};

// How long a launch may take to open its DevTools port, and one protocol call to answer (ms). A cold first start on a
// 2-core CI runner is slower than a laptop's; a call with no answer (a hung or crashed renderer) fails the run with the
// call's name instead of waiting for the job's time limit (CI run 44583214909 hung 32 minutes on one).
const LAUNCH_MS = Number(process.env.AREA_RENDERED_LAUNCH_TIMEOUT) || 60000;
const CALL_MS = Number(process.env.AREA_RENDERED_CALL_TIMEOUT) || 120000;
let announced = false;

/** Starts a headless browser in a fresh profile. Resolves to { newPage, close, version, command }. */
export async function launch({ profileRoot = process.env.AREA_RENDERED_PROFILE_ROOT || tmpdir() } = {}) {
  const profile = mkdtempSync(join(profileRoot, "area-rendered-edge-"));
  const binary = browserPath();
  const args = assertSafe([
    "--headless=new", "--guest", "--disable-features=msImplicitSignin,Translate,MediaRouter", "--disable-sync",
    "--disable-extensions", "--no-first-run", "--no-default-browser-check", "--disable-background-networking",
    "--disable-component-update", "--hide-scrollbars", "--mute-audio", "--force-color-profile=srgb",
    "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--disable-backgrounding-occluded-windows",
    "--font-render-hinting=none", `--user-data-dir=${profile}`, "--remote-debugging-port=0", "about:blank",
    // Only where the sandbox cannot work (as root in a container); CI's runner keeps the sandbox (its sysctl allows it).
    ...(process.env.AREA_RENDERED_NO_SANDBOX ? ["--no-sandbox"] : []),
  ]);
  const command = [binary, ...args].map(arg => /\s/.test(arg) ? JSON.stringify(arg) : arg).join(" ");
  const t0 = Date.now();
  // stderr is kept (its tail goes into a launch error) until the port opens, then let go: Edge's helpers inherit the
  // pipe and can outlive the browser, which would keep this process alive.
  const proc = spawn(binary, args, { stdio: ["ignore", "ignore", "pipe"] });
  let stderr = "";
  proc.stderr.on("data", chunk => { stderr = (stderr + chunk).slice(-4000); });
  let exited = null;
  const killOnExit = () => { try { proc.kill("SIGKILL"); } catch {} };
  process.once("exit", killOnExit);
  proc.once("error", error => { exited ??= { error }; });
  proc.once("exit", (code, signal) => { exited = { code, signal }; process.off("exit", killOnExit); });
  const fail = what => {
    try { proc.kill("SIGKILL"); } catch {}
    proc.stderr.destroy();
    return new Error(`${what}\n  command: ${command}\n  stderr (last lines):\n${stderr.trim().split("\n").filter(Boolean).slice(-25).map(line => "    " + line).join("\n") || "    (none)"}`);
  };
  const portFile = join(profile, "DevToolsActivePort");
  let port;
  while (!port && Date.now() - t0 < LAUNCH_MS) {
    if (exited) throw fail(`The browser exited at launch (${exited.error ? exited.error.message : `code ${exited.code}, signal ${exited.signal}`}) after ${Date.now() - t0} ms.`);
    if (existsSync(portFile)) port = Number(readFileSync(portFile, "utf8").split("\n")[0]) || undefined;
    if (!port) await wait(100);
  }
  if (!port) throw fail(`The browser did not open its DevTools port in ${LAUNCH_MS / 1000} s (AREA_RENDERED_LAUNCH_TIMEOUT).`);
  proc.stderr.destroy();
  const info = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  if (process.env.CI && !announced) {
    announced = true;
    process.stderr.write(`browser: ${info.Browser} at ${binary}, DevTools port open after ${Date.now() - t0} ms\n  command: ${command}\n`);
  }
  const ws = new WebSocket(info.webSocketDebuggerUrl);
  await new Promise((ok, fail) => { ws.addEventListener("open", ok, { once: true }); ws.addEventListener("error", fail, { once: true }); });
  let id = 0;
  const pending = new Map(); // id → { settle(message), method, timer }
  const listeners = new Map(); // sessionId → Set of (method, params) => void
  // Every waiting call fails at once, naming why, when the browser goes away or a page's renderer crashes.
  const failAll = reason => { for (const [key, call] of pending) { pending.delete(key); clearTimeout(call.timer); call.settle({ error: { message: `${reason} (while waiting for ${call.method})` } }); } };
  let gone = null;
  proc.once("exit", (code, signal) => { gone = `the browser exited (code ${code}, signal ${signal})`; failAll(gone); });
  ws.addEventListener("close", () => { gone ??= "the DevTools connection closed"; failAll(gone); });
  ws.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) { const call = pending.get(message.id); pending.delete(message.id); clearTimeout(call.timer); call.settle(message); return; }
    if (message.method === "Target.targetCrashed") failAll(`a page's renderer crashed (status ${message.params.status}, error code ${message.params.errorCode})`);
    if (message.method) for (const fn of listeners.get(message.sessionId ?? "") ?? []) fn(message.method, message.params);
  });
  const send = (method, params = {}, sessionId) => new Promise((ok, fail) => {
    if (gone) { fail(new Error(`${method}: ${gone}`)); return; }
    const key = ++id;
    const timer = setTimeout(() => { pending.delete(key); fail(new Error(`${method}: no answer in ${CALL_MS / 1000} s (a hung page; AREA_RENDERED_CALL_TIMEOUT)`)); }, CALL_MS);
    pending.set(key, { method, timer, settle: message => message.error ? fail(new Error(`${method}: ${JSON.stringify(message.error)}`)) : ok(message.result) });
    ws.send(JSON.stringify({ id: key, method, params, ...(sessionId ? { sessionId } : {}) }));
  });

  // Target events (a renderer crash among them) reach the browser connection.
  await send("Target.setDiscoverTargets", { discover: true });
  const { targetInfos } = await send("Target.getTargets");
  const unused = targetInfos.filter(info => info.type === "page").map(info => info.targetId);

  /** A new page (its own target) at `width` × `height` CSS px and device scale `scale`. */
  async function newPage({ width = 1440, height = 900, scale = 2 } = {}) {
    // The first page reuses the blank tab the browser opened (a guest profile can refuse a new tab before one exists).
    let targetId;
    const blank = unused.shift();
    if (blank) targetId = blank;
    else {
      // A guest profile refuses a second tab; a fresh browser context (its own storage, like an incognito window) works.
      const { browserContextId } = await send("Target.createBrowserContext", { disposeOnDetach: true });
      ({ targetId } = await send("Target.createTarget", { url: "about:blank", browserContextId }));
    }
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
    const own = new Set();
    listeners.set(sessionId, own);
    const call = (method, params) => send(method, params, sessionId);
    await call("Page.enable");
    await call("Runtime.enable");
    await call("Emulation.setFocusEmulationEnabled", { enabled: true });
    const page = {
      call,
      on(fn) { own.add(fn); return () => own.delete(fn); },
      width, height, scale,
      async size(w, h, s = page.scale) {
        page.width = w; page.height = h; page.scale = s;
        await call("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: s, mobile: false });
      },
      async eval(expression) {
        const result = await call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, userGesture: true });
        if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
        return result.result.value;
      },
      /** Navigates and waits for the load event. */
      async goto(url) {
        let timer;
        const loaded = new Promise((done, fail) => {
          const off = page.on(method => { if (method === "Page.loadEventFired") { off(); clearTimeout(timer); done(); } });
          timer = setTimeout(() => { off(); fail(new Error(`${url}: no load event in ${CALL_MS / 1000} s`)); }, CALL_MS);
        });
        await call("Page.navigate", { url });
        await loaded;
      },
      /** A PNG of a clip in CSS px at the page's device scale (or the whole viewport). */
      async shot(clip) {
        const result = await call("Page.captureScreenshot", {
          format: "png", captureBeyondViewport: false, fromSurface: true,
          ...(clip ? { clip: { ...clip, scale: 1 } } : {}),
        });
        return Buffer.from(result.data, "base64");
      },
      async mouse(type, x, y, extra = {}) { await call("Input.dispatchMouseEvent", { type, x, y, button: "none", ...extra }); },
      async close() { listeners.delete(sessionId); await send("Target.closeTarget", { targetId }).catch(() => {}); },
    };
    await page.size(width, height, scale);
    return page;
  }

  async function close() {
    try { await send("Browser.close"); } catch {}
    for (let tries = 0; tries < 50 && !exited; tries++) await wait(100);
    if (!exited) proc.kill("SIGKILL");
    ws.close();
    for (let tries = 0; tries < 5; tries++) { try { rmSync(profile, { recursive: true, force: true }); break; } catch { await wait(200); } }
  }
  return { newPage, close, version: info.Browser, command };
}
