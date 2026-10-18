// node tiles.mjs <outdir> <shots.json> [port]   (BASE=http://127.0.0.1:4410/ by default)
// Captures named gallery tiles at 1:1 (2x device pixels) in one headless Edge session, for Before / After review sheets.
// shots.json: [{ "name": "card-header", "hash": "components/card", "tile": "headerAction", "canvas": {} }, ...]
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [outdir, shotsFile, portArg = "9611"] = process.argv.slice(2);
const shots = JSON.parse(readFileSync(shotsFile, "utf8"));
const BASE = process.env.BASE ?? "http://127.0.0.1:4410/";
const port = +portArg;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), "edge-tiles-"));
const edge = spawn("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", [
  "--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu", "--window-size=1600,1200", "about:blank",
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
  mkdirSync(outdir, { recursive: true });
  let lastCanvas = null;
  for (const shot of shots) {
    const canvas = JSON.stringify(shot.canvas ?? {});
    if (canvas !== lastCanvas) {
      await evaluate(`(() => { const all = JSON.parse(localStorage.getItem("area-desktop") || "{}"); all.canvas = ${canvas}; all.theme = "light"; all.material = { bundle: "none", overrides: {} }; localStorage.setItem("area-desktop", JSON.stringify(all)); })()`);
      await evaluate(`location.hash = ${JSON.stringify(shot.hash)}`); await send("Page.reload", {}); await sleep(2500);
      lastCanvas = canvas;
    } else { await evaluate(`location.hash = ${JSON.stringify(shot.hash)}`); await sleep(1500); }
    // An optional style to try an alternative (shot.css), replaced per shot.
    await evaluate(`(() => { let s = document.getElementById("tiles-try"); if (!s) { s = document.createElement("style"); s.id = "tiles-try"; document.head.append(s); } s.textContent = ${JSON.stringify(shot.css ?? "")}; })()`);
    await sleep(100);
    // One task: 1:1 zoom, scroll, measure (the fit's observer restores the zoom after any await), then capture.
    const rect = await evaluate(`(() => {
      const tiles = [...document.querySelectorAll(".studio-canvas__body .gallery-tile")];
      const t = ${shot.selector ? `document.querySelector(${JSON.stringify(shot.selector)})` : `tiles.find(t => (t.querySelector(".gallery-tile__label, .gallery-tile__title")?.textContent || "").trim() === ${JSON.stringify(shot.tile ?? "")})`};
      if (!t) return null;
      for (const s of document.querySelectorAll(".gallery-tile__stage")) s.style.zoom = "1";
      t.scrollIntoView({ block: "center" });
      const target = ${shot.selector ? "t" : `t.querySelector(".gallery-tile__stage")?.firstElementChild ?? t`};
      const r = target.getBoundingClientRect(); const pad = 16;
      return { x: Math.max(0, r.x - pad), y: Math.max(0, r.y - pad), width: r.width + pad * 2, height: Math.min(r.height + pad * 2, 1100) };
    })()`);
    if (!rect) { console.log("missing", shot.name); continue; }
    const img = await send("Page.captureScreenshot", { format: "png", clip: { ...rect, scale: 1 } });
    writeFileSync(join(outdir, shot.name + ".png"), Buffer.from(img.result.data, "base64"));
    console.log(shot.name);
  }
} finally {
  try { ws?.close(); } catch {}
  edge.kill("SIGKILL"); await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
