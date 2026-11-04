// node drive.mjs <script.mjs>: runs the script's default export with { evaluate, shot, wait, size }
import { writeFileSync } from "node:fs";
const port = process.env.CDP_PORT || 9461;
const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const page = targets.find(t => t.type === "page" && !t.url.startsWith("devtools"));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener("open", r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener("message", ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, m => m.error ? rej(new Error(method + JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Page.bringToFront").catch(() => {});
const evaluate = async expression => { const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
const wait = ms => new Promise(r => setTimeout(r, ms));
const shot = async (file, clip) => { const r = await send("Page.captureScreenshot", { format: "png", clip: { scale: 1, ...clip } }); writeFileSync(file, Buffer.from(r.data, "base64")); console.log("saved", file); };
const size = (width, height) => send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
const mouse = async (type, x, y) => send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1 });
const { default: run } = await import(process.argv[2]);
try { await run({ evaluate, shot, wait, size, mouse, send }); } catch (e) { console.log("ERR", e.message); }
ws.close(); process.exit(0);
