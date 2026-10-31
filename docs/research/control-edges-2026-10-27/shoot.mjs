// Captures each [data-look] section of the Stroke groups scene, light and dark, at 2x in a clean headless Edge.
//   node shoot.mjs <base url> <out dir> [extra query]
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const [BASE, OUT, EXTRA = ""] = process.argv.slice(2);
mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const port = 9900 + Math.floor(Math.random() * 90);
const profile = mkdtempSync(join(process.env.TMPDIR || tmpdir(), "edge-stroke-"));
const edge = spawn("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", [
  "--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--guest",
  "--disable-features=msImplicitSignin", "--disable-sync", "--disable-extensions", "--no-first-run", "--hide-scrollbars", "about:blank",
], { stdio: "ignore" });
try {
  let list;
  for (let i = 0; i < 50; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (list.length) break; } catch {} await sleep(200); }
  const page = list.find(t => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener("open", r, { once: true }));
  let id = 0; const waiting = new Map();
  ws.addEventListener("message", e => { const m = JSON.parse(e.data); if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); } });
  const send = (method, params = {}) => new Promise(r => { const n = ++id; waiting.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
  const evaluate = async expr => (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value;
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1680, height: 7200, deviceScaleFactor: 2, mobile: false });
  for (const theme of ["light", "dark"]) {
    await send("Page.navigate", { url: `${BASE}?theme=${theme}${EXTRA}#system/area/patterns/stroke-groups` });
    await sleep(5000);
    // Let the scene take its natural width, with no transitions mid-capture.
    await evaluate(`(() => { const s = document.createElement("style"); s.textContent = "*,*::before,*::after{transition:none!important;animation:none!important}.ex-canvas{min-inline-size:0!important}"; document.head.append(s); return 1; })()`);
    await sleep(500);
    const rects = await evaluate(`[...document.querySelectorAll("[data-look]")].map(el => { const r = el.getBoundingClientRect(); return { id: el.dataset.look, x: r.x, y: r.y, w: r.width, h: r.height }; })`);
    if (!rects?.length) throw new Error("no [data-look] sections: " + JSON.stringify(rects));
    for (const r of rects) {
      const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 } });
      const file = join(OUT, `${r.id}-${theme}.png`);
      writeFileSync(file, Buffer.from(shot.result.data, "base64"));
      console.log(file, Math.round(r.w), "x", Math.round(r.h));
    }
  }
  ws.close();
} finally {
  edge.kill();
}
