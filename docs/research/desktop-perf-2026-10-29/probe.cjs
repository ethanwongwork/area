// Opens the desktop app at a hash in a hidden Electron window and runs a script file there, printing its result:
//   electron probe.cjs <dist dir> <hash> <script.js>   (STORE=<json> starts from saved settings)
const { app, BrowserWindow } = require("electron");
const { join } = require("node:path");
const { readFileSync } = require("node:fs");

const [dir, hash, script] = process.argv.slice(2).filter(arg => !arg.startsWith("--"));
app.on("window-all-closed", () => {});
app.whenReady().then(async () => {
  const window = new BrowserWindow({ show: false, width: 1440, height: 900, webPreferences: { partition: "probe", backgroundThrottling: false, contextIsolation: true, sandbox: true } });
  await window.loadFile(join(dir, "index.html"), { hash: hash.slice(1) }).catch(() => {});
  // STORE: saved settings to start from (the app's localStorage), then a reload.
  if (process.env.STORE) {
    await window.webContents.executeJavaScript(`localStorage.setItem("area-desktop", ${JSON.stringify(process.env.STORE)}); true`);
    await window.loadFile(join(dir, "index.html"), { hash: hash.slice(1) }).catch(() => {});
    await window.webContents.executeJavaScript("location.reload(); true").catch(() => {});
    await new Promise(resolve => window.webContents.once("did-finish-load", resolve));
  }
  await window.webContents.executeJavaScript(`(async () => { for (let i = 0; i < 400 && !document.querySelector('.studio'); i++) await new Promise(r => setTimeout(r, 25)); await new Promise(r => setTimeout(r, 2500)); })()`);
  const result = await window.webContents.executeJavaScript(readFileSync(script, "utf8")).catch(error => String(error));
  console.log(typeof result === "string" ? result : JSON.stringify(result, null, 2));
  app.quit();
});
