// Counts type scopes (elements carrying data-area-type) under the Canvas body on each page, for one built renderer.
const { app, BrowserWindow } = require("electron");
const { join } = require("node:path");
const [label, dir] = process.argv.slice(2).find(a => a.includes("=")).split("=");
const HASHES = ["#system/area/typography", "#system/area/colors", "#system/area/patterns", "#system/area/themes", "#system/area/components", "#system/area/components/button", "#home"];
app.whenReady().then(async () => {
  const w = new BrowserWindow({ show: false, width: 1440, height: 900, webPreferences: { partition: `scopes-${label}`, backgroundThrottling: false } });
  await w.loadFile(join(dir, "index.html"), { hash: "home" }).catch(() => {});
  const r = await w.webContents.executeJavaScript(`(async () => { for (let i = 0; i < 400 && !document.querySelector('.studio'); i++) await new Promise(r => setTimeout(r, 25)); await new Promise(r => setTimeout(r, 1500)); const out = {}; for (const h of ${JSON.stringify(HASHES)}) { location.hash = h; await new Promise(r => setTimeout(r, 1800)); const b = document.querySelector('.studio-canvas__body'); out[h] = [b ? b.querySelectorAll('[data-area-type]').length : -1, document.querySelectorAll('[data-area-type]').length]; } return out; })()`);
  console.log(label); for (const [h, [canvas, all]] of Object.entries(r)) console.log(`  ${h.padEnd(34)} canvas ${String(canvas).padStart(4)}   window ${all}`);
  app.quit();
});
