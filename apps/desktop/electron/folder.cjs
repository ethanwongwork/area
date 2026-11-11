/**
 * A project's folder and its chats (owner, 2026-11-10: "a folder for every project, and chat works there";
 * docs/research/desktop-app-analysis-2026-11-10, T1 and U4).
 *
 * The folder is where the project's code lives on this Mac; the project's file records its path (src/projects.ts
 * `folder`) and the Chat's agent works there (electron/agent.cjs). Area only reads it here: what it is, and its files'
 * names for the composer's @ menu.
 *
 *   area:folder-choose   a folder picker ("Use this folder"); answers a path or null
 *   area:folder-state    what a path is now: there or not, its name, whether git tracks it, whether a system was written
 *   area:folder-files    its files' paths from the folder (git's list when it has one, a walk otherwise), at most LIMIT
 *   area:folder-reveal   shows it in Finder
 *
 * Chats are kept beside what they belong to, one file each, so none is lost when the list grows:
 * `Projects/<id>/chats/<chat>.json`, `Systems/<id>/chats/<chat>.json`, or `Chats/<chat>.json` for a chat started
 * anywhere else. Read when a place's chat list is first shown, written when a reply finishes, moved to the Trash when
 * deleted. Never in a capture.
 */
const { app, dialog, ipcMain, shell } = require("electron");
const { execFile } = require("node:child_process");
const { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } = require("node:fs");
const { basename, isAbsolute, join, relative, resolve } = require("node:path");

/** The most file names the @ menu is given. */
const LIMIT = 5000;
/** Folders a walk never enters: dependencies, build output, caches. */
const SKIP = new Set(["node_modules", "dist", "build", "out", "target", "vendor", "coverage", "DerivedData", "Pods", "__pycache__"]);

/** An existing directory at an absolute path, or null. */
function folderAt(path) {
  if (typeof path !== "string" || !isAbsolute(path)) return null;
  try { const at = resolve(path); return statSync(at).isDirectory() ? at : null; } catch { return null; }
}

/** What a folder is now, as the project's Overview says it. */
function folderState(path) {
  const at = folderAt(path);
  if (!at) return { exists: false, name: typeof path === "string" ? basename(path) : "" };
  return { exists: true, name: basename(at), git: existsSync(join(at, ".git")), system: existsSync(join(at, ".area", "system.json")) };
}

/** A walk for a folder git doesn't track: files' paths, breadth first, hidden and dependency folders left out. */
function walk(root) {
  const files = [];
  const queue = [root];
  while (queue.length && files.length < LIMIT) {
    const dir = queue.shift();
    let entries = [];
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.name.startsWith(".")) continue;
      if (entry.isDirectory()) { if (!SKIP.has(entry.name)) queue.push(join(dir, entry.name)); }
      else if (entry.isFile() && files.length < LIMIT) files.push(relative(root, join(dir, entry.name)));
    }
  }
  return files;
}

/** A folder's files: what git tracks plus what is new and not ignored, or a walk when git has nothing to say. */
function folderFiles(path) {
  const at = folderAt(path);
  if (!at) return Promise.resolve([]);
  if (!existsSync(join(at, ".git"))) return Promise.resolve(walk(at));
  return new Promise(done => {
    execFile("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { cwd: at, maxBuffer: 32 * 1024 * 1024 }, (error, stdout) => {
      if (error) { done(walk(at)); return; }
      done(String(stdout).split("\n").filter(Boolean).slice(0, LIMIT));
    });
  });
}

const safeId = id => typeof id === "string" && /^[a-z0-9-]{1,64}$/.test(id) ? id : null;
/** Where a place's chats are kept: beside its project or its system, or the app's own for anywhere else. */
function chatsFolder(base, kind, id) {
  if (kind === "project" && safeId(id)) return join(base, "Projects", id, "chats");
  if (kind === "system" && safeId(id)) return join(base, "Systems", id, "chats");
  return kind === "app" ? join(base, "Chats") : null;
}

/** The kept chats of a place, as their files hold them; a file that doesn't read is left out. */
function readChats(base, kind, id) {
  const folder = chatsFolder(base, kind, id);
  const chats = [];
  if (!folder) return chats;
  try {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      try { chats.push(JSON.parse(readFileSync(join(folder, entry.name), "utf8"))); } catch {}
    }
  } catch {}
  return chats;
}

/** Keep a chat: its file written whole (a temporary file renamed over the old one). */
function writeChat(base, kind, id, chat, text) {
  const folder = chatsFolder(base, kind, id);
  if (!folder || !safeId(chat) || typeof text !== "string") return false;
  try { JSON.parse(text); } catch { return false; }
  mkdirSync(folder, { recursive: true });
  const file = join(folder, `${chat}.json`);
  writeFileSync(`${file}.tmp`, text);
  renameSync(`${file}.tmp`, file);
  return true;
}

function register(window) {
  const base = () => app.getPath("userData");
  ipcMain.handle("area:folder-choose", async (_event, suggested) => {
    const result = await dialog.showOpenDialog(window(), {
      title: "Choose folder", buttonLabel: "Use this folder",
      message: "Choose the folder that holds this project's code. Claude reads it, follows its own rules, and asks before each change.",
      properties: ["openDirectory", "createDirectory"],
      ...(folderAt(suggested) ? { defaultPath: folderAt(suggested) } : {}),
    });
    return result.canceled || !result.filePaths[0] ? null : result.filePaths[0];
  });
  ipcMain.handle("area:folder-state", (_event, path) => folderState(path));
  ipcMain.handle("area:folder-files", (_event, path) => folderFiles(path));
  ipcMain.on("area:folder-reveal", (_event, path) => { const at = folderAt(path); if (at) shell.openPath(at); });
  ipcMain.handle("area:chats-read", (_event, kind, id) => readChats(base(), kind, id));
  ipcMain.on("area:chat-write", (_event, kind, id, chat, text) => {
    try { writeChat(base(), kind, id, chat, text); } catch (error) { console.error(`[chats] ${chat}: ${error}`); }
  });
  ipcMain.on("area:chat-trash", (_event, kind, id, chat) => {
    const folder = chatsFolder(base(), kind, id);
    const file = folder && safeId(chat) ? join(folder, `${chat}.json`) : null;
    if (file && existsSync(file)) shell.trashItem(file).catch(error => console.error(`[chats] ${chat}: ${error}`));
  });
}

module.exports = { register, folderAt, folderState, folderFiles, chatsFolder, readChats, writeChat };
