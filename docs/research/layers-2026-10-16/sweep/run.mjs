// node run.mjs <outdir> <theme> <ground> <layers> [port] [slugs,...]
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const [outdir, theme, ground, layers, portArg = "9333", slugArg] = process.argv.slice(2);
const REPO = join(here, "../../../..");
const { COMPLETE_COMPONENTS, REVIEW_COMPONENTS } = await import(join(REPO, "apps/desktop/src/content/component-status.mjs"));
// Every family with a status (Complete and In review); SLUGS narrows a whole run (all.mjs passes the environment on).
const slugs = slugArg ? slugArg.split(",") : process.env.SLUGS ? process.env.SLUGS.split(",") : [...COMPLETE_COMPONENTS, ...REVIEW_COMPONENTS];
const BASE = process.env.BASE ?? "http://127.0.0.1:4410/";
const port = +portArg;
const CHECK = readFileSync(join(here, "check.js"), "utf8");
const sleep = ms => new Promise(r => setTimeout(r, ms));

const profile = mkdtempSync(join(tmpdir(), "edge-sweep-"));
const edge = spawn("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", [
  "--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu",
  "--window-size=1600,1200", "--force-device-scale-factor=1", "about:blank",
], { stdio: "ignore" });
let ws;
try {
  let list;
  for (let i = 0; i < 50; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (list.some(t => t.type === "page")) break; } catch {} await sleep(200); }
  const target = list.find(t => t.type === "page");
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map();
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const evaluate = async expr => { const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 400)); return r.result?.result?.value; };
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 1200, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: BASE + `?theme=${theme}` }); await sleep(1500);
  const axis = theme === "dark" ? "ground-dark" : "ground-light";
  await evaluate(`(() => { const all = JSON.parse(localStorage.getItem("area-desktop") || "{}"); all.theme = ${JSON.stringify(theme)}; all.canvas = { ...(all.canvas || {}), ${JSON.stringify(axis)}: ${JSON.stringify(ground)}, "layers-light": ${JSON.stringify(layers)}, "layers-dark": ${JSON.stringify(layers)} }; localStorage.setItem("area-desktop", JSON.stringify(all)); })()`);
  await evaluate(`location.hash = "components"`); await send("Page.reload", { ignoreCache: true }); await sleep(2500);
  await evaluate(`(() => { const s = document.createElement("style"); s.textContent = "*,*::before,*::after{transition:none!important;animation-play-state:paused!important}"; document.head.append(s); })()`);
  const attrs = await evaluate(`(() => { const b = document.querySelector(".studio-canvas__body"); return b && Object.fromEntries([...b.attributes].filter(a => a.name.startsWith("data-area")).map(a => [a.name, a.value])); })()`);
  const results = { theme, ground, layers, attrs, families: {} };
  for (const slug of slugs) {
    try {
      const r = await Promise.race([
        (async () => {
          await evaluate(`location.hash = ${JSON.stringify("components/" + slug)}`);
          for (let i = 0; i < 30; i++) { await sleep(150); const n = await evaluate(`document.querySelectorAll(".studio-canvas__body .gallery-tile").length`); if (n > 0) break; }
          await sleep(400);
          if (process.env.SHOT) {
            const tile = process.env.TILE;
            const rect = await evaluate(`(() => { const ts=[...document.querySelectorAll('.studio-canvas__body .gallery-tile')]; const t = ts.find(t => (t.querySelector('.gallery-tile__label,.gallery-tile__title')?.textContent||'').trim() === ${JSON.stringify(process.env.TILE ?? '')}) ?? ts[0]; t.scrollIntoView({block:'center'}); const s=t.querySelector('.gallery-tile__stage'); if (s) s.style.zoom='1'; const r=t.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; })()`);
            await sleep(200);
            const shot = await send("Page.captureScreenshot", { format: "png", clip: { ...rect, scale: 2 }, captureBeyondViewport: true });
            mkdirSync(outdir, { recursive: true });
            writeFileSync(join(outdir, `${slug}-${theme}-${ground}-${layers}.png`), Buffer.from(shot.result.data, "base64"));
            return { findings: [] };
          }
          return evaluate(CHECK);
        })(),
        sleep(20000).then(() => ({ error: "timeout" })),
      ]);
      results.families[slug] = r;
      process.stdout.write(`${theme}/${ground}/${layers} ${slug}: ${r?.error ?? (r.findings.filter(f => f.kind === "text").length + " text")}\n`);
    } catch (e) { results.families[slug] = { error: String(e).slice(0, 300) }; process.stdout.write(`${slug}: ERR\n`); }
  }
  mkdirSync(outdir, { recursive: true });
  if (!process.env.SHOT) writeFileSync(join(outdir, `${theme}-${ground}-${layers}.json`), JSON.stringify(results, null, 1));
} finally {
  try { ws?.close(); } catch {}
  edge.kill("SIGKILL");
  await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
