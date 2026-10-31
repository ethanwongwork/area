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
  await send("Page.navigate", { url: `${BASE}?theme=light#system/area/patterns/stroke-groups` });
  await sleep(6000);
  const html = await evaluate(`(() => { const lab = document.querySelector(".stroke-lab"); const scope = lab.closest("[data-area-type]:not(html)") || document.documentElement;
    const attrs = [...scope.attributes].filter(a => a.name.startsWith("data-area-") && a.name !== "data-area-theme").map(a => a.name + '="' + a.value + '"').join(" ");
    return '<div class="scene-root" data-area-theme="light" ' + attrs + '>' + lab.outerHTML + '</div>'; })()`);
  writeFileSync(join(OUT, "scene.html"), html);
  console.log("scene.html", html.length);
  ws.close();
} finally {
  edge.kill();
}
