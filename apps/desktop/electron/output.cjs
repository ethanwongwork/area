/**
 * Write to folder (docs/research/system-output-2026-11-08): a system's published version written into a folder on this
 * Mac as code the folder's project owns, through @area/output (packages/output), the same core as the `area` command.
 * The page sends the system's file and a version; main picks the folder, plans, then writes. Local folders only: the
 * GitHub path (sign in, a branch, a pull request) will take the same plan through another destination, so `where`
 * carries a kind already ("folder").
 *
 *   area:output-choose   a folder picker ("Write here"), the last folder for the system first; answers a path or null
 *   area:output-plan     what writing would do, file by file, writing nothing
 *   area:output-write    writes it: files, then .area/ (the choices, the lock, the base copies)
 *   area:output-reveal   shows the folder in Finder
 *   area:output-command  where the `area` command is on this Mac, for Settings › Coding apps (src/coding-apps.ts)
 *
 * The library is this checkout's packages (the app is run from the repository); AREA_LIBRARY overrides it. The core is
 * TypeScript, which Electron's Node runs as it is (type stripping). Never in a capture.
 */
const { dialog, ipcMain, shell } = require("electron");
const { existsSync, statSync } = require("node:fs");
const { join, resolve } = require("node:path");
const { pathToFileURL } = require("node:url");

const libraryRoot = () => process.env.AREA_LIBRARY || resolve(__dirname, "..", "..", "..");
let core = null;
const load = async () => core ??= await import(pathToFileURL(join(libraryRoot(), "packages", "output", "src", "index.ts")).href);
// The library is read again for every plan (about a second), so a library change in this checkout is seen at once.
const library = async () => (await load()).loadLibrary(libraryRoot());

/** A folder the page may write into: an absolute path to an existing directory. */
function folderOf(where) {
  if (!where || where.kind !== "folder" || typeof where.path !== "string") return null;
  const path = resolve(where.path);
  return existsSync(path) && statSync(path).isDirectory() ? path : null;
}

/** A plan as the page reads it: no file contents, only what happens to each file. */
const shown = result => ({
  definition: { system: result.definition.system, version: result.definition.release.version, dir: result.definition.output.dir },
  steps: result.steps.map(step => ({ path: step.path, action: step.action, ...(step.conflicts ? { conflicts: step.conflicts } : {}) })),
  summary: result.summary,
  notes: result.notes,
  library: result.plan.lock.library.version,
});

function register(window) {
  ipcMain.handle("area:output-command", () => join(libraryRoot(), "packages", "output", "bin", "area.mjs"));
  ipcMain.handle("area:output-choose", async (_event, suggested) => {
    const result = await dialog.showOpenDialog(window(), {
      title: "Write to folder", buttonLabel: "Write here", message: "Choose the folder of the project the system is for.",
      properties: ["openDirectory", "createDirectory"],
      ...(typeof suggested === "string" && existsSync(suggested) ? { defaultPath: suggested } : {}),
    });
    return result.canceled || !result.filePaths[0] ? null : result.filePaths[0];
  });
  const run = async (where, systemText, version, commit) => {
    const path = folderOf(where);
    if (!path) return { error: "That folder isn't there any more." };
    try {
      const out = await load();
      const result = out.writeRelease(out.folder(path), await library(), { system: JSON.parse(systemText), version }, commit);
      return shown(result);
    } catch (error) {
      console.error(`[output] ${error?.stack ?? error}`);
      return { error: String(error?.message ?? error) };
    }
  };
  ipcMain.handle("area:output-plan", (_event, where, systemText, version) => run(where, systemText, version));
  ipcMain.handle("area:output-write", (_event, where, systemText, version, prefer) => run(where, systemText, version, { prefer: ["markers", "yours", "area"].includes(prefer) ? prefer : "markers" }));
  ipcMain.on("area:output-reveal", (_event, where) => { const path = folderOf(where); if (path) shell.openPath(path); });
}

module.exports = { register };
