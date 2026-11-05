// Captures screen.html at the display's ratio, optionally with extra CSS. Usage: electron shot.cjs <screen.html> <out.png> [css] [query]
const { app, BrowserWindow } = require("electron");
const { writeFileSync } = require("node:fs");
const [file, out, css = "", query = ""] = process.argv.slice(process.argv.findIndex(a => a.endsWith("shot.cjs")) + 1);
app.setPath("userData", require("node:path").join(require("node:os").tmpdir(), "area-fidelity"));
app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1920, height: 1080, show: false, paintWhenInitiallyHidden: true, useContentSize: true });
  await win.loadURL("file://" + file + (query ? "?" + query : ""));
  if (css) await win.webContents.insertCSS(css);
  await new Promise(r => setTimeout(r, 2500));
  writeFileSync(out, (await win.webContents.capturePage()).toPNG());
  app.quit();
}).catch(e => { console.error(e); app.exit(1); });
