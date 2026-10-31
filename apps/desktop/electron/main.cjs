/**
 * Area's desktop shell: one window that loads the built app (dist/index.html).
 *
 * On macOS the window has no title bar of its own: the app's Titlebar is the drag region and the
 * traffic lights sit inside it as Cursor places them (owner, 2026-10-12: "i like cursors top bar"):
 * centred in the bar and as far from the side as from the top, plus one. Cursor's main process
 * (out/main.js, 3.23): s = floor((height - 14) / 2), at { x: s + 1, y: s }; for the 39 bar the app's
 * type 13 / Compact scale gives (src/studio.css --_studio-bar) that is 13, 12, centred on the
 * controls' line at 19. Was 14, 13 for the 41 bar at type 12.
 * --dev reloads the window when the renderer rebuilds; --capture=<file.png> saves one frame and
 * quits, for checking the window without looking at it (--theme=dark, --hash=icons/arrows,
 * --store='{"canvas":{"ui":"compact"}}' for saved settings, --width=1024 for a narrow window, --run='<js>' to act
 * on the page first, as opening Settings, which no hash names).
 */
const { app, BrowserWindow, ipcMain, Menu, nativeTheme, net, protocol, screen, session, shell } = require("electron");
const { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, watch, writeFileSync } = require("node:fs");
const { join, normalize, sep } = require("node:path");
const { pathToFileURL } = require("node:url");

const dist = join(__dirname, "..", "dist");
const dev = process.argv.includes("--dev");
const capture = process.argv.find(arg => arg.startsWith("--capture="))?.slice("--capture=".length);
const themeArg = process.argv.find(arg => arg.startsWith("--theme="))?.slice("--theme=".length);
const hashArg = process.argv.find(arg => arg.startsWith("--hash="))?.slice("--hash=".length);
/* --store=<json>: saved settings for a capture, e.g. {"canvas":{"ui":"compact"}}. */
const storeArg = process.argv.find(arg => arg.startsWith("--store="))?.slice("--store=".length);
/* --width=<px>: the window's width for a capture (the setup's narrow Canvas was found in a 1024 window, 2026-10-23). */
/* --run=<js>: run in the page once it has rendered, before the frame is saved (an awaited expression). */
const runArg = process.argv.find(arg => arg.startsWith("--run="))?.slice("--run=".length);
const widthArg = Number(process.argv.find(arg => arg.startsWith("--width="))?.slice("--width=".length)) || 0;
/* Neutral 975 and white: the app's page ground in each theme, so a resize never shows a flash. */
const GROUND = { dark: "#020202", light: "#ffffff" };

/*
 * Where the window opens (owner, 2026-10-31: "doesnt open to the full width of the screen"): the first time, the whole work
 * area of the display under the pointer (the screen less the menu bar and Dock, as a double-click on the title bar zooms it);
 * after that, where it was last left (~/Library/Application Support/Area/window.json), as Cursor and Figma reopen, unless that
 * place is no longer on any display. A capture keeps 1440 × 900 (or --width), so its frames stay comparable.
 */
const MIN = { width: 960, height: 600 };
const placeFile = () => join(app.getPath("userData"), "window.json");
function openingPlace() {
  if (capture) return { width: widthArg ? Math.max(MIN.width, widthArg) : 1440, height: 900 };
  const area = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea;
  try {
    const saved = JSON.parse(readFileSync(placeFile(), "utf8"));
    const shown = screen.getAllDisplays().some(({ workArea: d }) => saved.x < d.x + d.width - 100 && saved.x + saved.width > d.x + 100 && saved.y >= d.y - 10 && saved.y < d.y + d.height - 100);
    if (shown && saved.width >= MIN.width && saved.height >= MIN.height) return saved;
  } catch {}
  return { ...area, width: widthArg ? Math.max(MIN.width, widthArg) : area.width };
}
function keepPlace(window) {
  if (capture) return;
  let timer;
  const write = () => {
    if (window.isDestroyed() || window.isMinimized() || window.isFullScreen()) return;
    try { writeFileSync(placeFile(), JSON.stringify({ ...window.getNormalBounds(), maximized: window.isMaximized() })); } catch {}
  };
  const save = () => { clearTimeout(timer); timer = setTimeout(write, 400); };
  window.on("resize", save);
  window.on("move", save);
  window.on("close", () => { clearTimeout(timer); write(); });
}

function createWindow() {
  const { maximized, ...place } = openingPlace();
  const window = new BrowserWindow({
    ...place,
    minWidth: MIN.width,
    minHeight: MIN.height,
    title: "Area",
    show: false,
    backgroundColor: nativeTheme.shouldUseDarkColors ? GROUND.dark : GROUND.light,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    trafficLightPosition: { x: 13, y: 12 },
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
  if (maximized) window.maximize();
  keepPlace(window);
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
      if (runArg) await window.webContents.executeJavaScript(`(async () => { ${runArg} })()`).catch(error => console.error(`[capture] --run: ${error}`));
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

/*
 * The Brand library (the Brand tab): the owner's saved inspiration, downloaded to the app's own data folder
 * (~/Library/Application Support/Area/Brand: library.json, originals/, thumbs/), never into the repository. The page reads
 * it as area-brand://library/<path>; nothing outside that folder is served.
 */
protocol.registerSchemesAsPrivileged([{ scheme: "area-brand", privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } }]);
const brandFolder = () => join(app.getPath("userData"), "Brand");
async function serveBrand(request) {
  const root = brandFolder();
  const file = normalize(join(root, decodeURIComponent(new URL(request.url).pathname)));
  if (!file.startsWith(root + sep) || !existsSync(file)) return new Response("Not found", { status: 404 });
  // The page is file://, so its fetch of library.json is cross-origin: allow it.
  const response = await net.fetch(pathToFileURL(file).toString());
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(response.body, { status: response.status, headers });
}
ipcMain.on("area:brand-reveal", (_event, path) => {
  const file = normalize(join(brandFolder(), String(path)));
  if (file.startsWith(brandFolder() + sep) && existsSync(file)) shell.showItemInFolder(file);
});

/*
 * The workspace's systems (src/systems.ts; app structure Phase 2): one folder each in the app's own data,
 * ~/Library/Application Support/Area/Systems/<id>/system.json, never in the repository. The page reads them all once at
 * launch (sync, so its first render has them), writes a system when it changes (to a temporary file, then renamed over the
 * old one, so a crash never leaves half a file), and moves a deleted system's folder to the Trash, where it can be put back.
 * A capture never reads or writes them: it answers null, and the page keeps its systems in the capture's own storage.
 * Systems were brands until 2026-10-29 (Brands/<id>/brand.json): the first read moves that folder and its files over, once.
 */
const systemsFolder = () => join(app.getPath("userData"), "Systems");
const systemId = id => typeof id === "string" && /^[a-z0-9-]{1,64}$/.test(id) ? id : null;
function moveBrands() {
  const old = join(app.getPath("userData"), "Brands");
  if (existsSync(systemsFolder()) || !existsSync(old)) return;
  try {
    renameSync(old, systemsFolder());
    for (const entry of readdirSync(systemsFolder(), { withFileTypes: true })) {
      const from = join(systemsFolder(), entry.name, "brand.json"), to = join(systemsFolder(), entry.name, "system.json");
      if (entry.isDirectory() && existsSync(from) && !existsSync(to)) renameSync(from, to);
    }
  } catch (error) { console.error(`[systems] moving Brands: ${error}`); }
}
ipcMain.on("area:systems-read", event => {
  if (capture) { event.returnValue = null; return; }
  moveBrands();
  const root = systemsFolder();
  const systems = [];
  try {
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory() || !systemId(entry.name)) continue;
      try { systems.push(JSON.parse(readFileSync(join(root, entry.name, "system.json"), "utf8"))); } catch {}
    }
  } catch {}
  event.returnValue = systems;
});
ipcMain.on("area:system-write", (_event, id, text) => {
  if (capture || !systemId(id) || typeof text !== "string") return;
  try { JSON.parse(text); } catch { return; }
  const folder = join(systemsFolder(), id);
  try {
    mkdirSync(folder, { recursive: true });
    const file = join(folder, "system.json");
    writeFileSync(`${file}.tmp`, text);
    renameSync(`${file}.tmp`, file);
  } catch (error) { console.error(`[systems] ${id}: ${error}`); }
});
ipcMain.on("area:system-trash", (_event, id) => {
  const folder = systemId(id) && id !== "area" ? join(systemsFolder(), id) : null;
  if (!capture && folder && existsSync(folder)) shell.trashItem(folder).catch(error => console.error(`[systems] ${id}: ${error}`));
});

/*
 * The workspace's projects (src/projects.ts; the IA of 2026-10-29): as the systems, one folder each,
 * ~/Library/Application Support/Area/Projects/<id>/project.json, read once at launch, written on change (a temporary file
 * renamed over the old one), and moved to the Trash when deleted. A capture never reads or writes them.
 */
const projectsFolder = () => join(app.getPath("userData"), "Projects");
ipcMain.on("area:projects-read", event => {
  if (capture) { event.returnValue = null; return; }
  const projects = [];
  try {
    for (const entry of readdirSync(projectsFolder(), { withFileTypes: true })) {
      if (!entry.isDirectory() || !systemId(entry.name)) continue;
      try { projects.push(JSON.parse(readFileSync(join(projectsFolder(), entry.name, "project.json"), "utf8"))); } catch {}
    }
  } catch {}
  event.returnValue = projects;
});
ipcMain.on("area:project-write", (_event, id, text) => {
  if (capture || !systemId(id) || typeof text !== "string") return;
  try { JSON.parse(text); } catch { return; }
  const folder = join(projectsFolder(), id);
  try {
    mkdirSync(folder, { recursive: true });
    const file = join(folder, "project.json");
    writeFileSync(`${file}.tmp`, text);
    renameSync(`${file}.tmp`, file);
  } catch (error) { console.error(`[projects] ${id}: ${error}`); }
});
ipcMain.on("area:project-trash", (_event, id) => {
  const folder = systemId(id) ? join(projectsFolder(), id) : null;
  if (!capture && folder && existsSync(folder)) shell.trashItem(folder).catch(error => console.error(`[projects] ${id}: ${error}`));
});

ipcMain.on("area:theme", (event, theme) => {
  nativeTheme.themeSource = theme === "dark" ? "dark" : "light";
  BrowserWindow.fromWebContents(event.sender)?.setBackgroundColor(GROUND[nativeTheme.themeSource]);
});

/* The chosen ground (Light ground, Dark ground), as the page paints it, so a resize shows the app's own page. */
ipcMain.on("area:ground", (event, color) => {
  if (/^#[0-9a-f]{6}$/i.test(String(color))) BrowserWindow.fromWebContents(event.sender)?.setBackgroundColor(String(color));
});

/* The traffic lights centred on the Titlebar, whatever type and density make its height: Cursor's y = floor((bar - 14) / 2)
   (12 at the 39 of 13 Compact). x stays 13, the start Titlebar's macOS reserve (83 = 13 + 54 + 16) is measured from. */
ipcMain.on("area:titlebar", (event, height) => {
  const bar = Number(height);
  if (process.platform !== "darwin" || !(bar >= 14 && bar <= 200)) return;
  BrowserWindow.fromWebContents(event.sender)?.setWindowButtonPosition({ x: 13, y: Math.floor((bar - 14) / 2) });
});

/*
 * The app's menu: the standard menus, with the tab commands a browser's tabs have (owner, 2026-10-29: "⌘W closes the tab
 * (plus ⌘⇧T, ⌃Tab, ⌘1–9)"). Without it Electron's default menu took ⌘W and closed the whole window. Each command goes to
 * the focused window's page (preload.cjs onCommand); ⌘1 to ⌘8 open that tab and ⌘9 the last, as Chrome's do.
 */
function tabMenu() {
  const send = (command, index) => (_item, window) => (window ?? BrowserWindow.getFocusedWindow())?.webContents.send("area:command", command, index);
  const mac = process.platform === "darwin";
  return Menu.buildFromTemplate([
    // The app menu, with Settings… (⌘,) where every Mac app has it: it opens Settings over the current tab (src/pages/settings.tsx).
    ...(mac ? [{ label: app.name, submenu: [
      { role: "about" },
      { type: "separator" },
      { label: "Settings…", accelerator: "CmdOrCtrl+,", click: send("settings") },
      { type: "separator" },
      { role: "services" },
      { type: "separator" },
      { role: "hide" },
      { role: "hideOthers" },
      { role: "unhide" },
      { type: "separator" },
      { role: "quit" },
    ] }] : [{ label: "Settings", submenu: [{ label: "Settings…", accelerator: "CmdOrCtrl+,", click: send("settings") }] }]),
    { label: "File", submenu: [
      { label: "New Tab", accelerator: "CmdOrCtrl+T", click: send("new-tab") },
      { label: "Reopen Closed Tab", accelerator: "CmdOrCtrl+Shift+T", click: send("reopen-tab") },
      // Home, the fixed first tab (Finder's Go › Home is ⌘⇧H).
      { label: "Home", accelerator: "CmdOrCtrl+Shift+H", click: send("home") },
      { type: "separator" },
      { label: "Close Tab", accelerator: "CmdOrCtrl+W", click: send("close-tab") },
      { label: "Close Window", accelerator: "CmdOrCtrl+Shift+W", role: "close" },
    ] },
    { role: "editMenu" },
    { role: "viewMenu" },
    { label: "Window", submenu: [
      { role: "minimize" },
      { role: "zoom" },
      { type: "separator" },
      { label: "Show Next Tab", accelerator: "Ctrl+Tab", click: send("next-tab") },
      { label: "Show Previous Tab", accelerator: "Ctrl+Shift+Tab", click: send("previous-tab") },
      // ⌘1–9 work without crowding the menu, as Chrome's do; they count the tabs after Home, which is ⌘⇧H.
      ...Array.from({ length: 9 }, (_, at) => ({ label: at === 8 ? "Last Tab" : `Tab ${at + 1}`, accelerator: `CmdOrCtrl+${at + 1}`, click: send("tab", at + 1), visible: false, acceleratorWorksWhenHidden: true })),
      ...(mac ? [{ type: "separator" }, { role: "front" }] : []),
    ] },
  ]);
}

app.setName("Area");
app.whenReady().then(() => {
  Menu.setApplicationMenu(tabMenu());
  protocol.handle("area-brand", serveBrand);
  session.fromPartition("capture").protocol.handle("area-brand", serveBrand);
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
