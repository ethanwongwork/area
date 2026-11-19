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

/** Starts a headless browser in a fresh profile. Resolves to { newPage, close, version }. */
export async function launch({ profileRoot = process.env.AREA_RENDERED_PROFILE_ROOT || tmpdir() } = {}) {
  const profile = mkdtempSync(join(profileRoot, "area-rendered-edge-"));
  const proc = spawn(browserPath(), assertSafe([
    "--headless=new", "--guest", "--disable-features=msImplicitSignin,Translate,MediaRouter", "--disable-sync",
    "--disable-extensions", "--no-first-run", "--no-default-browser-check", "--disable-background-networking",
    "--disable-component-update", "--hide-scrollbars", "--mute-audio", "--force-color-profile=srgb",
    "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--disable-backgrounding-occluded-windows",
    "--font-render-hinting=none", `--user-data-dir=${profile}`, "--remote-debugging-port=0", "about:blank",
    // CI's Linux runner (as root in a container, no user namespace sandbox) sets AREA_RENDERED_NO_SANDBOX=1.
    ...(process.env.AREA_RENDERED_NO_SANDBOX ? ["--no-sandbox"] : []),
  ]), { stdio: "ignore" });
  let exited = false;
  const killOnExit = () => { try { proc.kill("SIGKILL"); } catch {} };
  process.once("exit", killOnExit);
  proc.once("exit", () => { exited = true; process.off("exit", killOnExit); });
  const portFile = join(profile, "DevToolsActivePort");
  let port;
  for (let tries = 0; tries < 200 && !port; tries++) {
    if (exited) throw new Error("The browser exited at launch.");
    if (existsSync(portFile)) port = Number(readFileSync(portFile, "utf8").split("\n")[0]) || undefined;
    if (!port) await wait(100);
  }
  if (!port) { proc.kill(); throw new Error("The browser did not open its DevTools port."); }
  const info = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  const ws = new WebSocket(info.webSocketDebuggerUrl);
  await new Promise((ok, fail) => { ws.addEventListener("open", ok, { once: true }); ws.addEventListener("error", fail, { once: true }); });
  let id = 0;
  const pending = new Map();
  const listeners = new Map(); // sessionId → Set of (method, params) => void
  ws.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id); return; }
    if (message.method) for (const fn of listeners.get(message.sessionId ?? "") ?? []) fn(message.method, message.params);
  });
  const send = (method, params = {}, sessionId) => new Promise((ok, fail) => {
    const key = ++id;
    pending.set(key, message => message.error ? fail(new Error(`${method}: ${JSON.stringify(message.error)}`)) : ok(message.result));
    ws.send(JSON.stringify({ id: key, method, params, ...(sessionId ? { sessionId } : {}) }));
  });

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
        const loaded = new Promise(done => { const off = page.on(method => { if (method === "Page.loadEventFired") { off(); done(); } }); });
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
  return { newPage, close, version: info.Browser };
}
