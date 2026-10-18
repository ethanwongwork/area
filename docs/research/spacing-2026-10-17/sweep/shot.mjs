// node shot.mjs <outdir> <hash> <selector,...> [canvas-json] [port]
// Headless Edge screenshots of elements on an app page (2x), for checking compositions when the browser pane is hidden.
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [outdir, hash, selectors, canvasJson = "{}", portArg = "9601"] = process.argv.slice(2);
const BASE = process.env.BASE ?? "http://127.0.0.1:4410/";
const port = +portArg;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), "edge-shot-"));
const edge = spawn("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", [
  "--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu",
  "--window-size=1600,1200", "about:blank",
], { stdio: "ignore" });
let ws;
try {
  let list;
  for (let i = 0; i < 50; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (list.some(t => t.type === "page")) break; } catch {} await sleep(200); }
  ws = new WebSocket(list.find(t => t.type === "page").webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map();
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const evaluate = async expr => (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value;
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 1200, deviceScaleFactor: 2, mobile: false });
  await send("Page.navigate", { url: BASE }); await sleep(1200);
  await evaluate(`(() => { const all = JSON.parse(localStorage.getItem("area-desktop") || "{}"); all.canvas = ${canvasJson}; all.theme = ${JSON.stringify(process.env.THEME ?? "light")}; all.material = { bundle: "none", overrides: {} }; localStorage.setItem("area-desktop", JSON.stringify(all)); })()`);
  await evaluate(`location.hash = ${JSON.stringify(hash)}`); await send("Page.reload", {}); await sleep(2500);
  mkdirSync(outdir, { recursive: true });
  for (const sel of selectors.split(",")) {
    const rect = await evaluate(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; e.scrollIntoView({ block: "start" }); const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 1100) }; })()`);
    if (!rect) { console.log("missing", sel); continue; }
    await sleep(300);
    const shot = await send("Page.captureScreenshot", { format: "png", clip: { ...rect, scale: 1 } });
    const file = join(outdir, sel.replace(/[^a-z0-9-]+/gi, "_") + ".png");
    writeFileSync(file, Buffer.from(shot.result.data, "base64"));
    console.log(file);
  }
} finally {
  try { ws?.close(); } catch {}
  edge.kill("SIGKILL"); await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
