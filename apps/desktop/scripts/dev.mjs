/**
 * Development: rebuilds the renderer on every change and reloads the window.
 *
 *   npm run dev -w @area/desktop              Electron window, reloading on change
 *   npm run preview -w @area/desktop          the same, plus the app in a browser (http://localhost:4400)
 *   … --no-electron                           the browser alone (CI, a machine without a display)
 *
 * The Electron window always shows this checkout (owner, 2026-10-12: "make sure the electron is
 * always updated and reloaded"):
 *   - starting replaces any other Area dev window, so a window left open from another worktree
 *     never passes for the current one;
 *   - a renderer rebuild reloads the window (electron/main.cjs watches dist/), and so does the
 *     browser page (a reload stream injected into index.html);
 *   - a change under electron/ restarts the window;
 *   - a change under packages/<name>/src rebuilds that package and the ones after it
 *     (tokens → styles → react), then the bundle and area.css follow.
 */
import { context } from "esbuild";
import { execFileSync, spawn } from "node:child_process";
import { createReadStream, existsSync, readFileSync, statSync, watch } from "node:fs";
import { createServer } from "node:http";
import { homedir } from "node:os";
import { extname, join, normalize } from "node:path";
import { copyStatic, dist, options, packagesBuilt, repo, root } from "./renderer.mjs";

const browser = process.argv.includes("--browser");
const withElectron = !process.argv.includes("--no-electron");
const run = (command, args, cwd) => new Promise((resolveRun, reject) => {
  const child = spawn(command, args, { cwd, stdio: "inherit" });
  child.once("exit", code => code === 0 ? resolveRun() : reject(new Error(`${command} ${args.join(" ")} exited ${code}`)));
});

if (!packagesBuilt()) await run("npm", ["run", "build"], repo);
const renderer = await context(options({ production: false }));
await renderer.rebuild().catch(() => {});
await renderer.watch();

// Package sources: rebuild the changed package and every package after it, then copy the new
// area.css (the bundle follows on its own). Icons are not watched: their source is generated.
const PACKAGES = ["tokens", "styles", "react"];
let pending, building = false, from = PACKAGES.length, queued = PACKAGES.length;
const rebuildPackages = async () => {
  if (building) return;
  building = true;
  while (from < PACKAGES.length) {
    const names = PACKAGES.slice(from);
    from = PACKAGES.length;
    try {
      for (const name of names) await run("npm", ["run", "build", "-w", `@area/${name}`], repo);
      // The watch may give up while a package's dist/ is briefly missing; rebuild once it is back.
      await renderer.rebuild().catch(() => {});
      copyStatic();
      console.log(`Rebuilt ${names.join(", ")}.`);
    } catch (error) { console.error(error.message); }
  }
  building = false;
};
for (const [index, name] of PACKAGES.entries()) {
  watch(join(repo, "packages", name, "src"), { recursive: true }, () => {
    queued = Math.min(queued, index);
    clearTimeout(pending);
    pending = setTimeout(() => { from = Math.min(from, queued); queued = PACKAGES.length; rebuildPackages(); }, 200);
  });
}
// The page, stylesheet and theme script are copied, not bundled.
watch(join(root, "src"), { recursive: true }, (_, file) => { if (file && /\.(html|css)$|^theme\.js$/.test(file)) copyStatic(); });

if (browser) {
  const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp" };
  const port = Number(process.env.PORT ?? 4400);
  // Live reload: the page listens on /__reload and reloads when dist/ changes.
  const listeners = new Set();
  let reloadTimer;
  watch(dist, () => { clearTimeout(reloadTimer); reloadTimer = setTimeout(() => { for (const response of listeners) response.write("data: reload\n\n"); }, 120); });
  // A same-origin script, not an inline one: the page's CSP allows only script-src 'self'.
  const RELOAD = `<script src="/__reload.js"></script>`;
  createServer((request, response) => {
    const path = normalize(decodeURIComponent(new URL(request.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
    if (path === "/__reload") {
      response.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store", connection: "keep-alive" });
      response.write(": open\n\n");
      listeners.add(response);
      request.once("close", () => listeners.delete(response));
      return;
    }
    if (path === "/__reload.js") {
      response.writeHead(200, { "content-type": "text/javascript", "cache-control": "no-store" });
      response.end(`new EventSource("/__reload").onmessage = () => location.reload();`);
      return;
    }
    // The Brand library, for the browser preview (Electron serves it as area-brand://library/, electron/main.cjs).
    if (path.startsWith("/__brand/")) {
      const brand = join(homedir(), "Library", "Application Support", "Area", "Brand");
      const asset = normalize(join(brand, path.slice("/__brand/".length)));
      if (!asset.startsWith(brand) || !existsSync(asset)) { response.writeHead(404); response.end(); return; }
      response.writeHead(200, { "content-type": TYPES[extname(asset)] ?? "application/octet-stream", "cache-control": "max-age=3600" });
      createReadStream(asset).pipe(response);
      return;
    }
    let file = join(dist, path);
    if (!file.startsWith(dist) || !existsSync(file) || statSync(file).isDirectory()) file = join(dist, "index.html");
    response.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream", "cache-control": "no-store" });
    if (file.endsWith("index.html")) response.end(readFileSync(file, "utf8").replace("</body>", `${RELOAD}</body>`));
    else createReadStream(file).pipe(response);
  }).listen(port, "127.0.0.1", () => console.log(`Area desktop (browser) → http://localhost:${port}`));
}

if (withElectron) {
  const electron = (await import("electron")).default;
  /** Other Area dev windows (this checkout's or another worktree's), by their `apps/desktop --dev` arguments. */
  const otherWindows = () => {
    if (process.platform === "win32") return [];
    try { return execFileSync("pgrep", ["-f", "Electron.*apps/desktop --dev"], { encoding: "utf8" }).split("\n").map(Number).filter(Boolean); }
    catch { return []; }
  };
  for (const pid of otherWindows()) {
    try { process.kill(pid); console.log(`Closed an older Area dev window (pid ${pid}).`); } catch {}
  }
  let child, restarting = false;
  const start = () => {
    child = spawn(electron, [root, "--dev"], { stdio: "inherit" });
    child.once("exit", (code, signal) => {
      if (restarting) { restarting = false; start(); return; }
      console.log(`[electron] window closed (${signal ?? `code ${code}`})`);
      // A crash or a kill from outside reopens the window; quitting it (code 0) does not.
      if (code !== 0) { start(); return; }
      // Quitting the window ends `npm run dev`; with the browser preview the server keeps running.
      if (!browser) { renderer.dispose(); process.exit(0); }
    });
  };
  start();
  // The main process and preload are not bundled: a change restarts the window.
  let restartTimer;
  watch(join(root, "electron"), () => {
    clearTimeout(restartTimer);
    restartTimer = setTimeout(() => { if (child.exitCode === null) { restarting = true; child.kill(); } else start(); }, 200);
  });
  const stop = () => { child?.kill(); process.exit(0); };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
}
