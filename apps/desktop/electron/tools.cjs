/**
 * Technical tools (owner, 2026-11-10: "a code editor … plus terminal access … options to toggle on for more technical
 * users"; docs/research/desktop-app-analysis-2026-11-10, T6), off until Settings › Coding apps › Technical tools is on:
 * a project folder's files read and written, and its own commands run in it.
 *
 *   area:file-read     a file in the folder as text (a binary or a file over LIMIT is refused, in words)
 *   area:file-write    a file in the folder written whole (only one that is there already, or new beside them)
 *   area:term-run      run a command line in the folder with the person's shell; output streams as area:term-out,
 *                      its end as area:term-exit
 *   area:term-input    a line for the running command's input
 *   area:term-stop     stop it (the whole process group)
 *
 * Every path is resolved inside the folder, links followed (electron/links.cjs `inside`). The terminal runs what the
 * person types, outside the Chat agent's approvals, as Terminal would: that is why it is a separate tool and off by
 * default. It has no screen of its own (no full-screen programs, no colors), and says so.
 */
const { spawn } = require("node:child_process");
const { existsSync, lstatSync, readFileSync, realpathSync, renameSync, statSync, writeFileSync } = require("node:fs");
const { dirname, isAbsolute, join, relative, resolve, sep } = require("node:path");
const { inside } = require("./links.cjs");

const LIMIT = 1024 * 1024;
/** Escape sequences a terminal would act on (colors, cursor moves), which plain output shows as noise. */
const ANSI = /\u001b\[[0-9;?]*[ -/]*[@-~]|\u001b\][^\u0007]*(\u0007|\u001b\\)|\u001b[()][A-Z0-9]|\r(?!\n)/g;
const plainOutput = text => String(text).replace(ANSI, "");

/** A path in the folder to write: an existing file inside it, or a new one whose folder is inside it. */
function writable(folder, path) {
  const there = inside(folder, path);
  if (there) return statSync(there).isFile() ? there : null;
  if (typeof folder !== "string" || typeof path !== "string" || !isAbsolute(folder)) return null;
  const target = isAbsolute(path) ? path : resolve(folder, path);
  // Something already there that didn't resolve inside (a link out of the folder) is never written through.
  try { lstatSync(target); return null; } catch {}
  const parent = inside(folder, dirname(target));
  return parent ? join(parent, target.slice(dirname(target).length + 1)) : null;
}

function readText(folder, path) {
  const file = inside(folder, path);
  if (!file || !statSync(file).isFile()) return { error: "That file isn't in the project's folder." };
  const size = statSync(file).size;
  if (size > LIMIT) return { error: "This file is too large to open here. Open it in your editor." };
  const bytes = readFileSync(file);
  if (bytes.includes(0)) return { error: "This file isn't text. Open it in the app it belongs to." };
  return { path: relative(realpathSync(folder), file).split(sep).join("/"), text: bytes.toString("utf8"), at: statSync(file).mtimeMs };
}

/** Write a file whole; `at` (when the page read it) refuses to overwrite a change made since in another app. */
function writeText(folder, path, text, at) {
  const file = writable(folder, path);
  if (!file) return { error: "That file isn't in the project's folder." };
  if (typeof text !== "string" || text.length > LIMIT) return { error: "That's more than this editor can save." };
  if (typeof at === "number" && existsSync(file) && Math.abs(statSync(file).mtimeMs - at) > 1) return { error: "This file changed in another app since you opened it. Open it again to see that change." };
  writeFileSync(`${file}.area-tmp`, text);
  renameSync(`${file}.area-tmp`, file);
  return { ok: true, at: statSync(file).mtimeMs };
}

function createTerminal({ send, shell = process.env.SHELL || "/bin/zsh", env = process.env }) {
  const runs = new Map();
  function run(id, folder, command) {
    const cwd = inside(folder, folder);
    if (!cwd) { send("area:term-exit", id, { code: null, error: "The project's folder isn't there any more." }); return; }
    if (runs.has(id)) stop(id);
    const child = spawn(shell, ["-lc", String(command)], { cwd, env: { ...env, TERM: "dumb", NO_COLOR: "1", FORCE_COLOR: "0", CLICOLOR: "0" }, detached: true });
    runs.set(id, child);
    child.stdout.on("data", chunk => send("area:term-out", id, plainOutput(chunk), "out"));
    child.stderr.on("data", chunk => send("area:term-out", id, plainOutput(chunk), "err"));
    child.on("error", error => send("area:term-out", id, `${error.message}\n`, "err"));
    child.on("close", (code, signal) => { if (runs.get(id) === child) runs.delete(id); send("area:term-exit", id, { code, signal }); });
  }
  function input(id, text) { const child = runs.get(id); if (child?.stdin.writable) child.stdin.write(`${String(text)}\n`); }
  function stop(id) {
    const child = runs.get(id);
    if (!child) return;
    try { process.kill(-child.pid, "SIGTERM"); } catch { child.kill("SIGTERM"); }
    setTimeout(() => { if (runs.get(id) === child) { try { process.kill(-child.pid, "SIGKILL"); } catch {} } }, 2000);
  }
  const stopAll = () => { for (const id of [...runs.keys()]) stop(id); };
  return { run, input, stop, stopAll };
}

function register(getWindow) {
  const { app, ipcMain } = require("electron");
  const terminal = createTerminal({ send: (channel, ...args) => { const window = getWindow(); if (window && !window.isDestroyed()) window.webContents.send(channel, ...args); } });
  ipcMain.handle("area:file-read", (_event, folder, path) => { try { return readText(folder, path); } catch (error) { return { error: String(error?.message ?? error) }; } });
  ipcMain.handle("area:file-write", (_event, folder, path, text, at) => { try { return writeText(folder, path, text, at); } catch (error) { return { error: String(error?.message ?? error) }; } });
  ipcMain.on("area:term-run", (_event, id, folder, command) => terminal.run(String(id), folder, command));
  ipcMain.on("area:term-input", (_event, id, text) => terminal.input(String(id), text));
  ipcMain.on("area:term-stop", (_event, id) => terminal.stop(String(id)));
  app.on("before-quit", () => terminal.stopAll());
}

module.exports = { register, readText, writeText, createTerminal, plainOutput };
