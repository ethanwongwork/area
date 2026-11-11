// Screenshots pages in a guest headless Edge.  node shoot.mjs <outDir> <width> <height> <scale> name=url [name=url ...]
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
const [outDir, w, h, scale, ...pages] = process.argv.slice(2);
const port = 9351;
const edge = spawn("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--guest", "--disable-features=msImplicitSignin", "--disable-sync", "--disable-extensions", "--no-first-run",
  `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "edge-shoot-"))}`, "--allow-file-access-from-files", "--force-color-profile=srgb", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let target;
for (let i = 0; i < 60 && !target; i++) { await sleep(250); try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === "page"); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener("open", r));
let seq = 0; const pending = new Map();
ws.addEventListener("message", e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: +w, height: +h, deviceScaleFactor: +scale, mobile: false });
for (const p of pages) {
  const i = p.indexOf("="), name = p.slice(0, i); let url = p.slice(i + 1), js = "";
  if (url.includes("@@")) [url, js] = url.split("@@");
  await send("Page.navigate", { url: "about:blank" }); await sleep(200);
  await send("Page.navigate", { url }); await sleep(2500);
  if (js) { const r = await send("Runtime.evaluate", { expression: js, awaitPromise: true, returnByValue: true }); if (r.result?.result?.value !== undefined) console.log(name, JSON.stringify(r.result.result.value)); await sleep(600); }
  const shot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(join(outDir, name + ".png"), Buffer.from(shot.result.data, "base64"));
}
ws.close(); edge.kill();
