// Behaviour harness: renders a fixture page from the built packages (packages/react/dist, packages/styles/dist) in a
// headless Microsoft Edge and drives it over the DevTools protocol with real input (Input.dispatch*), so focus, hover,
// outside presses and typing behave as in the app. No dependency beyond esbuild (already in the workspace).
//
//   const page = await open("menu");           // bundles fixtures/menu.jsx, serves it, opens it
//   await page.press("ArrowDown"); await page.click("#save"); await page.clock.tick(1000);
//   await page.close();
//
// Time: every page runs on the fixture clock (CLOCK_SCRIPT below). Date.now and every setTimeout / setInterval of 50 ms
// or more are virtual and move only when a test calls page.clock.tick(ms), so a typeahead window or a tooltip delay is
// asserted exactly, never raced. Shorter timers, promises, animation frames, CSS transitions and performance.now run on
// real time. Set AREA_BEHAVIOUR_EDGE to another Chromium binary; AREA_BEHAVIOUR_HEADED=1 shows the window.
import { build } from "esbuild";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../..");
const EDGE = process.env.AREA_BEHAVIOUR_EDGE || "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge";
export const VIEWPORT = { width: 1200, height: 800 };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Installed before any fixture script. Virtual time: `now` starts at a fixed date and moves only on tick().
export const CLOCK_SCRIPT = `(() => {
  const g = globalThis, real = { setTimeout: g.setTimeout.bind(g), clearTimeout: g.clearTimeout.bind(g), setInterval: g.setInterval.bind(g), clearInterval: g.clearInterval.bind(g) };
  const MIN = 50;
  let now = Date.UTC(2026, 10, 11, 9, 0, 0), seq = 1e9;
  const timers = new Map();
  const RealDate = Date;
  class FixtureDate extends RealDate { constructor(...a) { super(...(a.length ? a : [now])); } static now() { return now; } }
  globalThis.Date = FixtureDate;
  const add = (fn, ms, args, every) => { const id = ++seq; timers.set(id, { fn, args, at: now + ms, every }); return id; };
  globalThis.setTimeout = (fn, ms = 0, ...args) => (+ms >= MIN ? add(fn, +ms, args, 0) : real.setTimeout(fn, ms, ...args));
  globalThis.setInterval = (fn, ms = 0, ...args) => (+ms >= MIN ? add(fn, +ms, args, +ms) : real.setInterval(fn, ms, ...args));
  globalThis.clearTimeout = id => (timers.has(id) ? timers.delete(id) : real.clearTimeout(id));
  globalThis.clearInterval = id => (timers.has(id) ? timers.delete(id) : real.clearInterval(id));
  globalThis.__clock = {
    now: () => now,
    pending: () => [...timers.values()].map(t => t.at - now),
    tick(ms) {
      const end = now + ms;
      for (;;) {
        let next = null;
        for (const [id, t] of timers) if (t.at <= end && (!next || t.at < next[1].at)) next = [id, t];
        if (!next) break;
        const [id, t] = next;
        now = t.at;
        if (t.every) t.at += t.every; else timers.delete(id);
        try { typeof t.fn === "function" ? t.fn(...t.args) : (0, eval)(t.fn); } catch (e) { console.error(e); }
      }
      now = end;
    },
  };
})();`;

const PAGE = (title, css) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title>
<link rel="stylesheet" href="/app.css"><style>${css}</style></head><body><div id="root"></div><script type="module" src="/app.js"></script></body></html>`;

// The fixture's own layout: a plain page at the system's defaults, a classic 15 px scrollbar so a scroll lock that
// drops the scrollbar's room shows as a width change (as on platforms that keep scrollbars).
const BASE_CSS = `html{scrollbar-width:auto}::-webkit-scrollbar{width:15px;height:15px;background:#eee}::-webkit-scrollbar-thumb{background:#999}
body{margin:0;padding:24px;font:13px system-ui}#root{display:flex;flex-direction:column;align-items:flex-start;gap:16px}`;

/** Bundles fixtures/<name>.jsx against the built packages; returns { js, css }. */
export async function bundle(name) {
  const entry = join(here, "fixtures", `${name}.jsx`);
  if (!existsSync(join(repo, "packages/react/dist/modules/index.js")) || !existsSync(join(repo, "packages/styles/dist/area.css")))
    throw new Error("Build the packages first: npm run build");
  const result = await build({
    entryPoints: [entry], bundle: true, write: false, format: "esm", platform: "browser", outdir: "/out",
    jsx: "automatic", loader: { ".jsx": "jsx" }, define: { "process.env.NODE_ENV": '"production"' },
    absWorkingDir: repo, logLevel: "silent", legalComments: "none",
  });
  let js = result.outputFiles.find(f => f.path.endsWith(".js")).text;
  // AREA_BEHAVIOUR_MUTATE='[["from","to"], …]' breaks the bundled code on purpose, to check a suite fails when the
  // behaviour it guards breaks (README, "Check that a suite bites").
  if (process.env.AREA_BEHAVIOUR_MUTATE) for (const [from, to] of JSON.parse(process.env.AREA_BEHAVIOUR_MUTATE)) {
    if (!js.includes(from)) throw new Error(`AREA_BEHAVIOUR_MUTATE: ${JSON.stringify(from)} is not in the ${name} bundle`);
    js = js.split(from).join(to);
  }
  const css = result.outputFiles.find(f => f.path.endsWith(".css"))?.text ?? "";
  return { js, css };
}

function serve(files) {
  const server = createServer((req, res) => {
    const path = new URL(req.url, "http://x").pathname;
    const file = files[path === "/" ? "/index.html" : path];
    if (!file) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "content-type": file.type, "cache-control": "no-store" });
    res.end(file.body);
  });
  return new Promise(r => server.listen(0, "127.0.0.1", () => r(server)));
}

// How long a launch may take to open its DevTools port (ms): a cold first start on a 2-core CI runner is slower than a
// laptop's. A launch that fails names the command and Edge's last stderr lines, and kills what it started.
const LAUNCH_MS = Number(process.env.AREA_BEHAVIOUR_LAUNCH_TIMEOUT) || 60000;

async function launchEdge() {
  if (!existsSync(EDGE)) throw new Error(`No browser at ${EDGE}: set AREA_BEHAVIOUR_EDGE to a Chromium binary`);
  const profile = await mkdtemp(join(tmpdir(), "area-behaviour-"));
  // A guest profile that never signs in (an Edge profile would sign into the owner's account), on a free port.
  const args = ["--guest", "--disable-features=msImplicitSignin", `--user-data-dir=${profile}`, "--remote-debugging-port=0",
    "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--disable-sync", "--disable-background-networking",
    "--disable-component-update", "--disable-breakpad", "--disable-crash-reporter", "--disable-renderer-backgrounding", "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows", "--force-device-scale-factor=1", "--lang=en-US", "--font-render-hinting=none",
    `--window-size=${VIEWPORT.width},${VIEWPORT.height}`, "about:blank"];
  if (!process.env.AREA_BEHAVIOUR_HEADED) args.unshift("--headless=new");
  const command = [EDGE, ...args].map(a => /\s/.test(a) ? JSON.stringify(a) : a).join(" ");
  const t0 = Date.now();
  const proc = spawn(EDGE, args, { stdio: ["ignore", "ignore", "pipe"] });
  let stderr = ""; proc.stderr.on("data", d => { stderr = (stderr + d).slice(-4000); });
  let exited = null;
  proc.once("error", error => { exited ??= error.message; });
  proc.once("exit", (code, signal) => { exited = `code ${code}, signal ${signal}`; });
  const fail = async what => {
    try { proc.kill("SIGKILL"); } catch {}
    proc.stderr.destroy();
    await rm(profile, { recursive: true, force: true }).catch(() => {});
    return new Error(`${what}\n  command: ${command}\n  stderr (last lines):\n${stderr.trim().split("\n").filter(Boolean).slice(-25).map(l => "    " + l).join("\n") || "    (none)"}`);
  };
  const portFile = join(profile, "DevToolsActivePort");
  while (!existsSync(portFile) && Date.now() - t0 < LAUNCH_MS) {
    if (exited) throw await fail(`Edge exited at launch (${exited}) after ${Date.now() - t0} ms`);
    await sleep(50);
  }
  if (!existsSync(portFile)) throw await fail(`Edge did not open a DevTools port in ${LAUNCH_MS / 1000} s (AREA_BEHAVIOUR_LAUNCH_TIMEOUT)`);
  let text = "";
  for (let i = 0; i < 50 && !text.includes("\n"); i++) { text = await readFile(portFile, "utf8"); if (!text.includes("\n")) await sleep(20); }
  const [port, path] = text.trim().split("\n");
  // Edge's helpers (the crash handler among them) inherit the stderr pipe and can outlive the browser, which would keep
  // this process alive: stop listening once the port is open.
  proc.stderr.destroy();
  return { proc, profile, url: `ws://127.0.0.1:${port}${path}`, command, ms: Date.now() - t0 };
}

/**
 * Starts Edge once, reads its version and closes it: run.mjs calls this before any suite, so a browser that cannot start
 * fails the run once, with the cause, instead of failing every test in every suite. Resolves to { version, command, ms }.
 */
export async function probeEdge() {
  const edge = await launchEdge();
  const ws = new WebSocket(edge.url);
  try {
    await new Promise((r, j) => { ws.addEventListener("open", r, { once: true }); ws.addEventListener("error", () => j(new Error(`Edge's DevTools socket did not open\n  command: ${edge.command}`)), { once: true }); });
    const conn = new Connection(ws);
    const { product } = await conn.send("Browser.getVersion");
    await Promise.race([conn.send("Browser.close").catch(() => {}), sleep(2000)]);
    return { version: product, command: edge.command, ms: edge.ms };
  } finally {
    ws.close();
    await new Promise(r => {
      if (edge.proc.exitCode !== null || edge.proc.signalCode !== null) return r();
      const t = setTimeout(() => { edge.proc.kill("SIGKILL"); r(); }, 3000);
      edge.proc.once("exit", () => { clearTimeout(t); r(); });
    });
    await rm(edge.profile, { recursive: true, force: true }).catch(() => {});
  }
}

class Connection {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.listeners = new Set();
    ws.addEventListener("message", ev => {
      const m = JSON.parse(ev.data);
      if (m.id && this.pending.has(m.id)) { const p = this.pending.get(m.id); this.pending.delete(m.id); m.error ? p.reject(new Error(`${p.method}: ${m.error.message}`)) : p.resolve(m.result); }
      else if (m.method) for (const l of this.listeners) l(m);
    });
  }
  // A call that gets no answer in 15 s fails (a hung page fails its test instead of the run).
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`${method}: no answer in 15 s`)); }, 15000);
      this.pending.set(id, { resolve: v => { clearTimeout(timer); resolve(v); }, reject: e => { clearTimeout(timer); reject(e); }, method });
      this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }
}

const KEYS = {
  Enter: [13, "Enter", "\r"], Tab: [9, "Tab"], Escape: [27, "Escape"], Backspace: [8, "Backspace"], Delete: [46, "Delete"],
  ArrowDown: [40, "ArrowDown"], ArrowUp: [38, "ArrowUp"], ArrowLeft: [37, "ArrowLeft"], ArrowRight: [39, "ArrowRight"],
  Home: [36, "Home"], End: [35, "End"], PageUp: [33, "PageUp"], PageDown: [34, "PageDown"], " ": [32, "Space", " "],
  F8: [119, "F8"], F10: [121, "F10"], ContextMenu: [93, "ContextMenu"],
};
const MODS = { Alt: 1, Control: 2, Meta: 4, Shift: 8 };

/** A step that fails names itself and prints the page's accessibility tree. */
export class StepError extends Error {}

export class Page {
  constructor(conn, sessionId, ctx) { this.conn = conn; this.session = sessionId; this.ctx = ctx; this.mouse = { x: 0, y: 0 }; this.steps = []; this.console = []; }
  send(method, params) { return this.conn.send(method, params, this.session); }

  /** Evaluates a function (or an expression string) in the page with JSON arguments; returns its value. */
  async eval(fn, ...args) {
    const expression = typeof fn === "function" ? `(${fn})(...${JSON.stringify(args)})` : fn;
    const r = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, userGesture: true });
    if (r.exceptionDetails) throw new Error("In page: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    return r.result.value;
  }
  /** Waits until the function returns a truthy value (or the selector matches); real time, default 2 s. */
  async waitFor(what, { timeout = 2000, args = [] } = {}) {
    const fn = typeof what === "string" ? sel => document.querySelector(sel) !== null : what;
    const fnArgs = typeof what === "string" ? [what] : args;
    const until = Date.now() + timeout;
    for (;;) {
      const v = await this.eval(fn, ...fnArgs);
      if (v) return v;
      if (Date.now() > until) throw new Error(`Timed out waiting for ${typeof what === "string" ? what : what.toString().slice(0, 120)}`);
      await sleep(16);
    }
  }
  /** Two animation frames, so React commits, effects and placement have run. */
  frames(n = 2) { return this.eval(n => new Promise(r => { const f = k => (k ? requestAnimationFrame(() => f(k - 1)) : r(true)); f(n); }), n); }
  /** Waits for every running finite CSS transition and animation to finish (real time); loops (a caret blink, a
   *  spinner) are skipped, and the wait gives up after 2 s. */
  settle() {
    return this.eval(() => Promise.race([
      Promise.all(document.getAnimations().filter(a => a.effect?.getComputedTiming().endTime !== Infinity).map(a => a.finished.catch(() => {}))),
      new Promise(r => { const t0 = performance.now(); const f = () => (performance.now() - t0 > 2000 ? r() : requestAnimationFrame(f)); f(); }),
    ])).then(() => this.frames());
  }

  /** The element's border box in viewport CSS px: { x, y, width, height, cx, cy }. */
  async rect(selector) {
    const r = await this.eval(sel => { const el = document.querySelector(sel); if (!el) return null; el.scrollIntoView?.({ block: "nearest", inline: "nearest" }); const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height }; }, selector);
    if (!r) throw new Error(`No element for ${selector}`);
    return { ...r, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
  }
  /** Moves the mouse in `steps` straight segments, so enter, leave and move fire along the way. */
  async move(x, y, { steps = 6 } = {}) {
    const from = this.mouse;
    for (let s = 1; s <= steps; s++) await this.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: from.x + (x - from.x) * s / steps, y: from.y + (y - from.y) * s / steps, button: "none", pointerType: "mouse" });
    this.mouse = { x, y };
  }
  /** Walks the mouse through each point in turn (a path such as a diagonal toward a submenu). */
  async path(points, { steps = 4 } = {}) { for (const [x, y] of points) await this.move(x, y, { steps }); }
  async hover(selector, opts) { const r = await this.rect(selector); await this.move(r.cx, r.cy, opts); return r; }
  async down(button = "left") { await this.send("Input.dispatchMouseEvent", { type: "mousePressed", ...this.mouse, button, buttons: button === "right" ? 2 : 1, clickCount: 1, pointerType: "mouse" }); }
  async up(button = "left") { await this.send("Input.dispatchMouseEvent", { type: "mouseReleased", ...this.mouse, button, buttons: 0, clickCount: 1, pointerType: "mouse" }); }
  /** A real press and release at the element's centre (or at { x, y }), after moving there. */
  async click(target, { button = "left", offset } = {}) {
    let x, y;
    if (typeof target === "string") { const r = await this.rect(target); x = r.cx + (offset?.[0] ?? 0); y = r.cy + (offset?.[1] ?? 0); } else ({ x, y } = target);
    await this.move(x, y, { steps: 2 });
    await this.down(button); await this.up(button);
    await this.frames();
  }
  /** A key press with real keydown / keypress / keyup. `modifiers`: ["Shift", "Alt", "Control", "Meta"]. */
  async press(key, { modifiers = [], keyCode } = {}) {
    const m = modifiers.reduce((a, k) => a | MODS[k], 0);
    const known = KEYS[key];
    const char = key.length === 1 ? key : null;
    const vk = keyCode ?? (known ? known[0] : char ? char.toUpperCase().charCodeAt(0) : 0);
    const code = known ? known[1] : char && /[a-z]/i.test(char) ? "Key" + char.toUpperCase() : char && /\d/.test(char) ? "Digit" + char : undefined;
    const text = known ? known[2] : char;
    const printable = text && !(m & (MODS.Control | MODS.Meta));
    await this.send("Input.dispatchKeyEvent", { type: printable ? "keyDown" : "rawKeyDown", key, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk, modifiers: m, ...(printable ? { text, unmodifiedText: text } : {}) });
    await this.send("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk, modifiers: m });
    await this.frames(1);
  }
  /** Types each character as a real key press. */
  async type(text) { for (const ch of text) await this.press(ch); await this.frames(); }
  /** An input method composition: shows `text` as composing (no commit). */
  async compose(text) { await this.send("Input.imeSetComposition", { text, selectionStart: text.length, selectionEnd: text.length }); await this.frames(1); }
  /** Commits the composition (compositionend) with `text`. */
  async commitComposition(text) { await this.send("Input.insertText", { text }); await this.frames(1); }

  /** document.activeElement (through open shadow roots) as the accessibility tree computes it: { role, name, tag, id, text }. */
  async active() {
    const { result } = await this.send("Runtime.evaluate", { expression: "(() => { let a = document.activeElement; while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement; return a; })()" });
    if (!result.objectId) return null;
    const { node } = await this.send("DOM.describeNode", { objectId: result.objectId });
    const ax = await this.send("Accessibility.getPartialAXTree", { backendNodeId: node.backendNodeId, fetchRelatives: false }).catch(() => ({ nodes: [] }));
    const n = ax.nodes[0];
    const facts = await this.send("Runtime.callFunctionOn", { objectId: result.objectId, functionDeclaration: "function () { return { tag: this.localName, id: this.id, text: (this.textContent || '').trim().slice(0, 80) }; }", returnByValue: true });
    await this.send("Runtime.releaseObject", { objectId: result.objectId });
    return { role: n?.role?.value ?? null, name: n?.name?.value ?? "", ...facts.result.value };
  }
  /** The accessibility tree's focused node: { role, name }, or null. */
  async focusedNode() {
    const { nodes } = await this.send("Accessibility.getFullAXTree");
    // The document reports focused too while a descendant has focus: the deepest focused node is the one.
    const n = nodes.filter(n => !n.ignored && n.properties?.some(p => p.name === "focused" && p.value.value)).at(-1);
    return n ? { role: n.role?.value, name: n.name?.value ?? "" } : null;
  }
  /** A computed style property of the first match. */
  style(selector, prop) { return this.eval((s, p) => { const el = document.querySelector(s); return el ? getComputedStyle(el).getPropertyValue(p) : null; }, selector, prop); }
  /** The topmost element at a viewport point, as a selector-like description and whether `selector` contains it. */
  hit(x, y, selector) { return this.eval((x, y, s) => { const el = document.elementFromPoint(x, y); const owner = s ? document.querySelector(s) : null; return { inside: !!(el && owner && (owner === el || owner.contains(el))), tag: el ? el.localName + (el.id ? "#" + el.id : "") + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).join(".") : "") : null }; }, x, y, selector); }

  /** The non-ignored accessibility tree as indented text (role "name" [focused] …). */
  async axTree() {
    const { nodes } = await this.send("Accessibility.getFullAXTree");
    const byId = new Map(nodes.map(n => [n.nodeId, n]));
    const lines = [];
    const walk = (n, depth) => {
      const shown = !n.ignored && !["generic", "none", "InlineTextBox", "StaticText", "LineBreak"].includes(n.role?.value);
      const props = (n.properties ?? []).filter(p => ["focused", "expanded", "selected", "checked", "disabled", "modal", "hasPopup", "activedescendant"].includes(p.name) && p.value.value !== false)
        .map(p => (p.value.value === true ? p.name : `${p.name}=${p.value.value ?? p.value.relatedNodes?.length}`));
      if (shown) lines.push(`${"  ".repeat(depth)}${n.role?.value} ${JSON.stringify(n.name?.value ?? "")}${props.length ? " [" + props.join(", ") + "]" : ""}`);
      for (const c of n.childIds ?? []) { const child = byId.get(c); if (child) walk(child, shown ? depth + 1 : depth); }
    };
    if (nodes[0]) walk(nodes[0], 0);
    return lines.join("\n");
  }

  /** Runs one named step; a failure names the step, the steps before it, and dumps the accessibility tree. */
  async step(name, fn) {
    this.steps.push(name);
    try { return await fn(); }
    catch (error) {
      if (error instanceof StepError) throw error;
      let tree = ""; let focused = null;
      try { tree = await this.axTree(); focused = await this.active(); } catch {}
      const err = new StepError(`Step failed: ${name}\n  ${error.message}\n  steps: ${this.steps.join(" → ")}\n  focused: ${JSON.stringify(focused)}\n  console: ${this.console.slice(-5).join(" | ") || "none"}\n--- accessibility tree ---\n${tree}\n---`);
      err.cause = error;
      throw err;
    }
  }

  /** Reloads the fixture (fresh state, fresh clock). `query` reaches the fixture as location.search. */
  async reload(query = "") {
    this.steps = []; this.console = []; this.mouse = { x: 0, y: 0 };
    await this.send("Page.navigate", { url: this.ctx.origin + "/" + query });
    await this.waitFor(() => document.readyState === "complete" && window.__ready === true, { timeout: 5000 });
    await this.frames();
  }
  get clock() {
    return { tick: async ms => { await this.eval(ms => window.__clock.tick(ms), ms); await this.frames(); }, now: () => this.eval(() => window.__clock.now()) };
  }
  async close() { await this.ctx.close(); }
}

/**
 * Opens fixtures/<name>.jsx in a fresh headless Edge. The fixture sets window.__ready = true once rendered.
 * One browser per suite file; reload() between tests for fresh state.
 */
export async function open(name, { query = "" } = {}) {
  const { js, css } = await bundle(name);
  const server = await serve({
    "/index.html": { type: "text/html", body: PAGE(name, BASE_CSS) },
    "/app.js": { type: "text/javascript", body: js },
    "/app.css": { type: "text/css", body: css },
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  // A launch that fails closes the fixture server too: a server left listening keeps the suite's process alive, and
  // node --test then waits on it until the job's time limit (CI run 44583214909, 40 minutes).
  let edge;
  try { edge = await launchEdge(); } catch (e) { server.closeAllConnections(); server.close(); throw e; }
  const ws = new WebSocket(edge.url);
  try { await new Promise((r, j) => { ws.addEventListener("open", r, { once: true }); ws.addEventListener("error", () => j(new Error("Edge's DevTools socket did not open")), { once: true }); }); }
  catch (e) { edge.proc.kill("SIGKILL"); server.closeAllConnections(); server.close(); throw e; }
  const conn = new Connection(ws);
  // A guest window can't open a second tab over the protocol: drive the tab it started with.
  let targetId;
  for (let i = 0; i < 100 && !targetId; i++) {
    const { targetInfos } = await conn.send("Target.getTargets");
    targetId = targetInfos.find(t => t.type === "page")?.targetId;
    if (!targetId) await sleep(50);
  }
  if (!targetId) { ws.close(); edge.proc.kill(); server.close(); throw new Error("Edge opened no page"); }
  const { sessionId } = await conn.send("Target.attachToTarget", { targetId, flatten: true });
  let closed = false;
  const ctx = {
    origin,
    async close() {
      if (closed) return; closed = true;
      await Promise.race([conn.send("Browser.close").catch(() => {}), sleep(2000)]);
      ws.close();
      await new Promise(r => {
        if (edge.proc.exitCode !== null) return r();
        const t = setTimeout(() => { edge.proc.kill("SIGKILL"); r(); }, 3000);
        edge.proc.once("exit", () => { clearTimeout(t); r(); });
      });
      server.closeAllConnections(); server.close();
      await rm(edge.profile, { recursive: true, force: true }).catch(() => {});
    },
  };
  const page = new Page(conn, sessionId, ctx);
  conn.listeners.add(m => {
    if (m.sessionId !== sessionId) return;
    if (m.method === "Runtime.consoleAPICalled" && (m.params.type === "error" || m.params.type === "warning")) page.console.push(m.params.args.map(a => a.value ?? a.description).join(" "));
    if (m.method === "Runtime.exceptionThrown") page.console.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
  });
  try {
    await page.send("Page.enable"); await page.send("Runtime.enable"); await page.send("DOM.enable"); await page.send("Accessibility.enable");
    await page.send("Emulation.setDeviceMetricsOverride", { width: VIEWPORT.width, height: VIEWPORT.height, deviceScaleFactor: 1, mobile: false });
    await page.send("Emulation.setFocusEmulationEnabled", { enabled: true });
    await page.send("Page.addScriptToEvaluateOnNewDocument", { source: CLOCK_SCRIPT });
    await page.reload(query);
  } catch (e) { await ctx.close(); throw e; }
  process.once("exit", () => { try { edge.proc.kill("SIGKILL"); } catch {} });
  return page;
}
