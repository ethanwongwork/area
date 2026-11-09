// Electron half of scripts/fidelity.mjs: loads each case's two pages hidden and reads their computed styles.
const { app, BrowserWindow } = require("electron");
const { readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const work = process.argv[process.argv.length - 1];
const { cases, tokenNames } = JSON.parse(readFileSync(join(work, "job.json"), "utf8"));
const PAINT = ["background-color", "color", "border-top-color", "border-top-width", "border-top-left-radius", "padding-top", "padding-left", "height", "box-shadow", "font-size", "line-height", "font-weight", "letter-spacing", "outline-color", "backdrop-filter", "background-image"];

const read = `(() => {
  const names = ${JSON.stringify(tokenNames)};
  const props = el => { const cs = getComputedStyle(el); const out = {}; for (const n of names) out[n] = cs.getPropertyValue(n).trim(); return out; };
  const paint = () => { const out = {}; document.querySelectorAll("body > *:not(#scope), #scope > *").forEach((el, i) => { const cs = getComputedStyle(el); for (const p of ${JSON.stringify(PAINT)}) out[(el.closest("#scope") ? "scope " : "") + i + " " + el.className.split(" ")[0] + " " + p] = cs.getPropertyValue(p); }); return out; };
  return { root: props(document.documentElement), scope: props(document.getElementById("scope")), samples: paint() };
})()`;

app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, width: 1200, height: 900, webPreferences: { offscreen: true } });
  const results = [];
  for (const c of cases) {
    const result = { name: c.name, area: {}, written: {} };
    for (const page of ["area", "written"]) {
      await win.loadFile(join(c.dir, `${page}.html`));
      for (const mode of ["light", "dark"]) {
        await win.webContents.executeJavaScript(`document.documentElement.setAttribute("data-area-theme", "${mode}"); new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`);
        result[page][mode] = await win.webContents.executeJavaScript(read);
      }
    }
    results.push(result);
  }
  writeFileSync(join(work, "result.json"), JSON.stringify(results));
  app.quit();
});
