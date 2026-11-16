/**
 * Links in and out (docs/research/desktop-app-analysis-2026-11-10, U9).
 *
 * In: an `area://` link (src/links.ts) opens its place in the window. macOS gives a running app its links through
 * `open-url`; a link Area is started with comes in its arguments, and one given to a second copy goes to the first
 * through the single-instance lock, after which the second copy quits. A copy started without a link keeps running as
 * before even when another holds the lock. The page is sent each link's hash (`area:open-link`), once it has loaded.
 * macOS sends `area://` links from other apps only to an app whose bundle declares the scheme, so from outside Area
 * they need the packaged app; the app run from this checkout is plain Electron and declares nothing.
 *
 * Out: Open in editor. The editors installed are those that answer their own link scheme (asked of macOS, never
 * guessed from folders); each opens a file at a line through that scheme. Default app opens the file with whatever
 * macOS opens it with; Finder shows it. Only a file or folder inside a project's folder opens (the page says which
 * folder): a chat's or a page's path never reaches past it.
 *
 *   area:editors        the editors installed: [{ id, name }]
 *   area:open-in        open a path (at a line) in an editor, "default" or "finder"; answers "ok" or why not
 *   area:copy-link      put a link on the clipboard (Copy Link): from here, so it works when the menu took focus
 */
const { app, clipboard, ipcMain, shell } = require("electron");
const { existsSync, realpathSync, statSync } = require("node:fs");
const { isAbsolute, resolve, sep } = require("node:path");

/** The hash an `area://` link names, or null: the same rule as src/links.ts `hashOfLink`. */
function hashOfLink(url) {
  if (typeof url !== "string") return null;
  const match = /^area:(?:\/\/)?([^?#\s]*)$/i.exec(url.trim());
  if (!match) return null;
  const path = match[1].replace(/^\/+|\/+$/g, "");
  if (!path || !/^[A-Za-z0-9._~%/-]+$/.test(path)) return null;
  return `#${path}`;
}
const linkIn = argv => (argv || []).find(arg => typeof arg === "string" && /^area:/i.test(arg));

/** The editors Area knows how to open a file at a line in: each by the link scheme it answers. */
const EDITORS = [
  { id: "cursor", name: "Cursor", scheme: "cursor", url: (file, line) => `cursor://file${encodeURI(file)}${line ? `:${line}` : ""}` },
  { id: "vscode", name: "VS Code", scheme: "vscode", url: (file, line) => `vscode://file${encodeURI(file)}${line ? `:${line}` : ""}` },
  { id: "windsurf", name: "Windsurf", scheme: "windsurf", url: (file, line) => `windsurf://file${encodeURI(file)}${line ? `:${line}` : ""}` },
  { id: "zed", name: "Zed", scheme: "zed", url: (file, line) => `zed://file${encodeURI(file)}${line ? `:${line}` : ""}` },
];

/** A path inside a folder, both real (links followed), or null. */
function inside(folder, path) {
  if (typeof folder !== "string" || typeof path !== "string" || !isAbsolute(folder)) return null;
  try {
    const root = realpathSync(folder);
    const target = realpathSync(isAbsolute(path) ? path : resolve(root, path));
    return target === root || target.startsWith(root + sep) ? target : null;
  } catch { return null; }
}

function installed() {
  return EDITORS.filter(editor => { try { return Boolean(app.getApplicationNameForProtocol(`${editor.scheme}://`)); } catch { return false; } })
    .map(({ id, name }) => ({ id, name }));
}

/**
 * Before the app is ready: take the lock, and listen for links. `capture` (a picture or a test frame) does neither.
 * Answers false when this copy should quit (it was started with a link another copy now has).
 */
function claim({ capture, getWindow }) {
  if (capture) return true;
  const first = linkIn(process.argv);
  const holder = app.requestSingleInstanceLock({ link: first ?? null });
  if (!holder && first) return false;
  const waiting = [];
  const send = url => {
    const hash = hashOfLink(url);
    if (!hash) return;
    const window = getWindow();
    if (!window || window.isDestroyed() || window.webContents.isLoading()) { waiting.push(hash); return; }
    window.webContents.send("area:open-link", hash);
    if (window.isMinimized()) window.restore();
    window.focus();
  };
  app.on("open-url", (event, url) => { event.preventDefault(); send(url); });
  app.on("second-instance", (_event, argv, _cwd, data) => { const url = data?.link ?? linkIn(argv); if (url) send(url); else getWindow()?.focus(); });
  if (first) waiting.push(hashOfLink(first));
  app.on("browser-window-created", (_event, window) => {
    window.webContents.on("did-finish-load", () => { for (const hash of waiting.splice(0)) if (hash) window.webContents.send("area:open-link", hash); });
  });
  // Only an app whose bundle declares the scheme can be given links by macOS (see above).
  if (app.isPackaged) app.setAsDefaultProtocolClient("area");
  return true;
}

function register() {
  ipcMain.handle("area:editors", () => installed());
  ipcMain.handle("area:copy-link", (_event, link) => { if (typeof link !== "string" || !hashOfLink(link)) return false; clipboard.writeText(link); return true; });
  ipcMain.handle("area:open-in", async (_event, how, folder, path, line) => {
    const target = inside(folder, path);
    if (!target) return "That file isn't in the project's folder.";
    if (!existsSync(target)) return "That file isn't there any more.";
    if (how === "finder") { shell.showItemInFolder(target); return "ok"; }
    if (how === "default") { const error = await shell.openPath(target); return error || "ok"; }
    const editor = EDITORS.find(entry => entry.id === how);
    if (!editor || !installed().some(entry => entry.id === editor.id)) return "That editor isn't installed.";
    const at = Number.isInteger(line) && line > 0 && statSync(target).isFile() ? line : undefined;
    try { await shell.openExternal(editor.url(target, at)); return "ok"; } catch (error) { return String(error?.message ?? error); }
  });
}

/** A link the window was asked to open itself (a chat's link, opened in a new window): the page's place instead. */
const routeOpen = (url, window) => { const hash = hashOfLink(url); if (hash && window && !window.isDestroyed()) window.webContents.send("area:open-link", hash); return Boolean(hash); };

module.exports = { claim, register, routeOpen, hashOfLink, EDITORS, inside };
