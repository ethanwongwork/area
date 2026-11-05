// Runs one expression in screen.html and prints it. Usage: electron probe.cjs <screen.html> <expression> [query]
const { app, BrowserWindow } = require("electron");
const [file, expr, query = ""] = process.argv.slice(process.argv.findIndex(a => a.endsWith("probe.cjs")) + 1);
app.setPath("userData", require("node:path").join(require("node:os").tmpdir(), "area-fidelity"));
app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1920, height: 1080, show: false, paintWhenInitiallyHidden: true, useContentSize: true });
  await win.loadURL("file://" + file + (query ? "?" + query : ""));
  await new Promise(r => setTimeout(r, 2500));
  console.log(await win.webContents.executeJavaScript(expr));
  app.quit();
}).catch(e => { console.error(e); app.exit(1); });
