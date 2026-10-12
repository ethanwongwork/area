/**
 * Development: rebuilds the renderer on every change and reloads the window.
 *
 *   npm run dev -w @area/desktop              Electron window, reloading on change
 *   npm run preview -w @area/desktop          the same app in a browser (http://localhost:4400)
 *
 * A change under packages/<name>/src rebuilds the workspace packages first (npm run build at the
 * root), which the renderer bundle then picks up.
 */
import { context } from "esbuild";
import { spawn } from "node:child_process";
import { createReadStream, existsSync, statSync, watch } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { copyStatic, dist, options, packagesBuilt, repo, root } from "./renderer.mjs";

const browser = process.argv.includes("--browser");
const run = (command, args, cwd) => new Promise((resolveRun, reject) => {
  const child = spawn(command, args, { cwd, stdio: "inherit" });
  child.once("exit", code => code === 0 ? resolveRun() : reject(new Error(`${command} ${args.join(" ")} exited ${code}`)));
});

if (!packagesBuilt()) await run("npm", ["run", "build"], repo);
const renderer = await context(options({ production: false }));
await renderer.rebuild().catch(() => {});
await renderer.watch();

// Package sources: rebuild the packages, then copy the new area.css (the bundle follows on its own).
let pending, building = false, again = false;
const rebuildPackages = async () => {
  if (building) { again = true; return; }
  building = true;
  try { await run("npm", ["run", "build"], repo); copyStatic(); console.log("Packages rebuilt."); }
  catch (error) { console.error(error.message); }
  building = false;
  if (again) { again = false; rebuildPackages(); }
};
for (const name of ["tokens", "styles", "react"]) {
  watch(join(repo, "packages", name, "src"), { recursive: true }, () => { clearTimeout(pending); pending = setTimeout(rebuildPackages, 200); });
}
// The page, stylesheet and theme script are copied, not bundled.
watch(join(root, "src"), (_, file) => { if (file && /\.(html|css)$|^theme\.js$/.test(file)) copyStatic(); });

if (browser) {
  const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };
  const port = Number(process.env.PORT ?? 4400);
  createServer((request, response) => {
    const path = normalize(decodeURIComponent(new URL(request.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
    let file = join(dist, path);
    if (!file.startsWith(dist) || !existsSync(file) || statSync(file).isDirectory()) file = join(dist, "index.html");
    response.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream", "cache-control": "no-store" });
    createReadStream(file).pipe(response);
  }).listen(port, "127.0.0.1", () => console.log(`Area desktop (browser) → http://localhost:${port}`));
} else {
  const electron = (await import("electron")).default;
  const child = spawn(electron, [root, "--dev"], { stdio: "inherit" });
  child.once("exit", code => { renderer.dispose(); process.exit(code ?? 0); });
}
