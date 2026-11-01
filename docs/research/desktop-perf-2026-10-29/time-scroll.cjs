// Scrolls a page's Canvas to its end in 900px steps, two frames each, and times it (tiles draw as they near the view).
const { app, BrowserWindow } = require("electron");
const { join } = require("node:path");
const [label, dir] = process.argv.slice(2).find(a => a.includes("=")).split("=");
const HASHES = ["#system/area/components", "#system/area/colors", "#system/area/typography"];
app.whenReady().then(async () => {
  const w = new BrowserWindow({ show: false, width: 1440, height: 900, webPreferences: { partition: `scroll-${label}-${Date.now()}`, backgroundThrottling: false } });
  await w.loadFile(join(dir, "index.html"), { hash: "home" }).catch(() => {});
  const r = await w.webContents.executeJavaScript(`(async () => {
    const frame = () => new Promise(r => requestAnimationFrame(() => r()));
    for (let i = 0; i < 400 && !document.querySelector('.studio'); i++) await new Promise(r => setTimeout(r, 25));
    await new Promise(r => setTimeout(r, 1500)); const out = {};
    for (const h of ${JSON.stringify(HASHES)}) { const runs = [];
      for (let round = 0; round < 3; round++) {
        location.hash = h; await new Promise(r => setTimeout(r, 1500));
        const s = document.querySelector('.studio-canvas__body'); s.scrollTop = 0; await new Promise(r => setTimeout(r, 300));
        let worst = 0; const t0 = performance.now(); let steps = 0;
        while (s.scrollTop + s.clientHeight < s.scrollHeight - 2 && steps < 60) { const a = performance.now(); s.scrollTop += 900; await frame(); await frame(); void s.offsetHeight; worst = Math.max(worst, performance.now() - a); steps++; }
        runs.push([Math.round(performance.now() - t0), Math.round(worst), steps]);
        location.hash = '#home'; await new Promise(r => setTimeout(r, 600));
      }
      out[h] = runs; }
    return out; })()`);
  console.log(label); for (const [h, runs] of Object.entries(r)) console.log(`  ${h.padEnd(26)} total/worst step/steps ${runs.map(x => x.join("/")).join("   ")}`);
  app.quit();
});
