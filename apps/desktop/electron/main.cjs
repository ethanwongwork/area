/**
 * Area's desktop shell: one window that loads the built app (dist/index.html).
 *
 * On macOS the window has no title bar of its own: the app's Titlebar is the drag region and the
 * traffic lights sit inside it as Cursor places them (owner, 2026-10-12: "i like cursors top bar"):
 * centred in the bar and as far from the side as from the top, plus one. Cursor's main process
 * (out/main.js, 3.23): s = floor((height - 14) / 2), at { x: s + 1, y: s }; for the 41 bar (40 and
 * the rule) that is 14, 13, centred on the controls' line at 20. Was 16, 14 (a pixel low), then 20, 19
 * in a 52 bar.
 * --dev reloads the window when the renderer rebuilds; --capture=<file.png> saves one frame and
 * quits, for checking the window without looking at it (--theme=dark, --hash=icons/arrows,
 * --store='{"canvas":{"ui":"compact"}}' for saved settings).
 */
const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron");
const { existsSync, watch, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const dist = join(__dirname, "..", "dist");
const dev = process.argv.includes("--dev");
const capture = process.argv.find(arg => arg.startsWith("--capture="))?.slice("--capture=".length);
const themeArg = process.argv.find(arg => arg.startsWith("--theme="))?.slice("--theme=".length);
const hashArg = process.argv.find(arg => arg.startsWith("--hash="))?.slice("--hash=".length);
/* --store=<json>: saved settings for a capture, e.g. {"canvas":{"ui":"compact"}}. */
const storeArg = process.argv.find(arg => arg.startsWith("--store="))?.slice("--store=".length);
/* Neutral 975 and white: the app's page ground in each theme, so a resize never shows a flash. */
const GROUND = { dark: "#020202", light: "#ffffff" };

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    title: "Area",
    show: false,
    backgroundColor: nativeTheme.shouldUseDarkColors ? GROUND.dark : GROUND.light,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    trafficLightPosition: { x: 14, y: 13 },
    webPreferences: {
      preload: join(__dirname, "preload.cjs"),
      // A capture runs in its own in-memory session, so it never reads or changes the saved
      // settings of the window you use.
      ...(capture ? { partition: "capture" } : {}),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });
  window.loadFile(join(dist, "index.html"), { ...(themeArg ? { query: { theme: themeArg } } : {}), ...(hashArg ? { hash: hashArg } : {}) });
  window.once("ready-to-show", () => { if (!capture) window.show(); });
  // Links that leave the app open in the browser, never inside the window.
  window.webContents.setWindowOpenHandler(({ url }) => { require("electron").shell.openExternal(url); return { action: "deny" }; });
  window.webContents.on("will-navigate", (event, url) => { if (!url.startsWith("file:")) event.preventDefault(); });

  // Page errors reach the terminal, so a blank window says why.
  window.webContents.on("console-message", event => { if (event.level === "error") console.error(`[renderer] ${event.message}`); });
  window.webContents.on("render-process-gone", (_event, details) => console.error(`[renderer] gone: ${details.reason}`));

  if (capture) {
    // Wait until the app has rendered and its fonts have settled, then one more frame.
    window.webContents.once("did-finish-load", async () => {
      if (storeArg) {
        await window.webContents.executeJavaScript(`localStorage.setItem("area-desktop", ${JSON.stringify(storeArg)}); location.reload();`);
        await new Promise(resolve => window.webContents.once("did-finish-load", resolve));
      }
      for (let tries = 0; tries < 100; tries++) {
        const ready = await window.webContents.executeJavaScript("Boolean(document.querySelector('.studio')) && document.fonts.status === 'loaded' && !document.querySelector('[data-fit]:not([data-fitted]) .gallery-tile')").catch(() => false);
        if (ready) break;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      await new Promise(resolve => setTimeout(resolve, 800));
      const image = await window.webContents.capturePage();
      writeFileSync(capture, image.toPNG());
      app.quit();
    });
  }
  if (dev && existsSync(dist)) {
    let timer;
    // Logged, so the dev terminal shows each reload (and a missing one is noticed).
    watch(dist, () => { clearTimeout(timer); timer = setTimeout(() => { window.webContents.reloadIgnoringCache(); console.log(`[electron] reloaded ${new Date().toLocaleTimeString()}`); }, 120); });
  }
  return window;
}

ipcMain.on("area:theme", (event, theme) => {
  nativeTheme.themeSource = theme === "dark" ? "dark" : "light";
  BrowserWindow.fromWebContents(event.sender)?.setBackgroundColor(GROUND[nativeTheme.themeSource]);
});

app.setName("Area");
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
