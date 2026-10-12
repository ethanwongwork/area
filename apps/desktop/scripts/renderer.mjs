/**
 * The renderer build shared by build.mjs and dev.mjs: src/main.tsx bundled to dist/app.js (a
 * classic script, since Chromium will not load module scripts from file://), with the page, the
 * app's stylesheet, the theme restore script and Area's stylesheet copied beside it.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const repo = resolve(root, "..", "..");
export const dist = join(root, "dist");
export const areaCss = join(repo, "packages/styles/dist/area.css");
const STATIC = ["index.html", "studio.css", "theme.js"];

/** The workspace packages the app imports are built (their dist/ exists). */
export const packagesBuilt = () => [areaCss, join(repo, "packages/react/dist/modules/index.js"), join(repo, "packages/tokens/dist/tokens.json")].every(existsSync);

export function copyStatic() {
  mkdirSync(dist, { recursive: true });
  for (const file of STATIC) copyFileSync(join(root, "src", file), join(dist, file));
  copyFileSync(areaCss, join(dist, "area.css"));
}

export const options = ({ production }) => ({
  entryPoints: [join(root, "src/main.tsx")],
  outfile: join(dist, "app.js"),
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "chrome130",
  jsx: "automatic",
  minify: production,
  sourcemap: production ? false : "inline",
  define: { "process.env.NODE_ENV": JSON.stringify(production ? "production" : "development") },
  logLevel: "warning",
  plugins: [{ name: "static", setup(build) { build.onEnd(result => { if (!result.errors.length) copyStatic(); }); } }],
});
