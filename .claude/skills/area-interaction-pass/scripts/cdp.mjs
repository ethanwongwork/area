// A small DevTools-protocol driver for the Area Electron window (area-interaction-pass skill). Start the window with a
// debugging port (CDP_PORT, default 9333; check the port is free first, a headless Edge may hold it):
//   node_modules/electron/dist/Electron.app/Contents/MacOS/Electron apps/desktop --dev --remote-debugging-port=9461
// usage: CDP_PORT=9461 node cdp.mjs <cmd> [...args] -- <cmd> ...   (commands run in order in one session)
//   eval <js>                 evaluate in the page, print the value
//   shot <file> [x y w h [s]] a PNG of the viewport at CSS-pixel scale, or of a clip at scale s
//   move x y | click x y | dbl x y | down x y | up x y    real mouse events (move walks in steps, so enter/leave fire)
//   key <key> [alt+meta+shift+ctrl]                       a key with modifiers ("b alt+meta" is ⌥⌘B)
//   wheel x y dy | wait ms
//   size w h                  emulates a window size for the rest of this session (cleared when it ends)
// It drives the renderer, not the OS: a window drag region, the traffic lights and app switching are not reached.
import { writeFileSync } from "node:fs";
const port = process.env.CDP_PORT || 9333;
const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const page = targets.find(t => t.type === "page" && !t.url.startsWith("devtools"));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener("open", r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener("message", ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, m => m.error ? rej(new Error(method + ": " + JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: i, method, params })); });
// An occluded window reports document.hidden and runs no frames (no ResizeObserver, rAF or transitions), so measurements
// go stale: bring it to the front first (AREA_CDP_BACKGROUND=1 leaves it where it is).
if (!process.env.AREA_CDP_BACKGROUND) await send("Page.bringToFront").catch(() => {});
const args = process.argv.slice(2);
const cmds = []; let cur = [];
for (const a of args) { if (a === "--") { cmds.push(cur); cur = []; } else cur.push(a); }
if (cur.length) cmds.push(cur);
let lastX = 0, lastY = 0;
const mods = s => (s || "").split("+").reduce((m, k) => m | ({ alt: 1, ctrl: 2, meta: 4, cmd: 4, shift: 8 }[k] || 0), 0);
for (const [cmd, ...a] of cmds) {
  if (cmd === "eval") {
    const r = await send("Runtime.evaluate", { expression: a.join(" "), awaitPromise: true, returnByValue: true, userGesture: true });
    if (r.exceptionDetails) console.log("ERR", r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    else console.log(typeof r.result.value === "string" ? r.result.value : JSON.stringify(r.result.value, null, 1));
  } else if (cmd === "shot") {
    const p = { format: "png" };
    const vp = await send("Runtime.evaluate", { expression: "[innerWidth, innerHeight]", returnByValue: true });
    const [vw, vh] = vp.result.value;
    p.clip = a[1] ? { x: +a[1], y: +a[2], width: +a[3], height: +a[4], scale: +(a[5] || 1) } : { x: 0, y: 0, width: vw, height: vh, scale: 1 / (await send("Runtime.evaluate", { expression: "devicePixelRatio", returnByValue: true })).result.value };
    const r = await send("Page.captureScreenshot", p);
    writeFileSync(a[0], Buffer.from(r.data, "base64")); console.log("saved", a[0]);
  } else if (cmd === "move" || cmd === "click" || cmd === "down" || cmd === "up") {
    const x = +a[0], y = +a[1];
    // move in a few steps so enter/leave fire along the way
    const steps = cmd === "move" ? 6 : 1;
    for (let s = 1; s <= steps; s++) await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: lastX + (x - lastX) * s / steps, y: lastY + (y - lastY) * s / steps });
    lastX = x; lastY = y;
    if (cmd === "click" || cmd === "down") await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
    if (cmd === "click" || cmd === "up") await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
  } else if (cmd === "dbl") {
    const x = +a[0], y = +a[1];
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y }); lastX = x; lastY = y;
    for (const n of [1, 2]) { await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: n }); await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: n }); }
  } else if (cmd === "wheel") {
    await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: +a[0], y: +a[1], deltaX: 0, deltaY: +a[2] });
  } else if (cmd === "key") {
    const key = a[0]; const m = mods(a[1]);
    const codes = { Escape: 27, Enter: 13, Tab: 9, ArrowDown: 40, ArrowUp: 38, ArrowLeft: 37, ArrowRight: 39, " ": 32, Backspace: 8 };
    const kc = codes[key] ?? key.toUpperCase().charCodeAt(0);
    const code = key.length === 1 ? (/[a-z]/i.test(key) ? "Key" + key.toUpperCase() : key === "," ? "Comma" : key === "[" ? "BracketLeft" : key === "]" ? "BracketRight" : "Digit" + key) : key;
    await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key, code, windowsVirtualKeyCode: kc, modifiers: m });
    if (key.length === 1 && !(m & 6)) await send("Input.dispatchKeyEvent", { type: "char", text: key, key, modifiers: m });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: kc, modifiers: m });
  } else if (cmd === "wait") {
    await new Promise(r => setTimeout(r, +a[0]));
  } else if (cmd === "size") {
    const { windowId } = await send("Browser.getWindowForTarget").catch(() => ({}));
    if (windowId) await send("Browser.setWindowBounds", { windowId, bounds: { width: +a[0], height: +a[1] } });
    else await send("Emulation.setDeviceMetricsOverride", { width: +a[0], height: +a[1], deviceScaleFactor: 0, mobile: false });
  }
}
ws.close();
