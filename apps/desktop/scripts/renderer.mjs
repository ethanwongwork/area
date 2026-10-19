/**
 * The renderer build shared by build.mjs and dev.mjs: src/main.tsx bundled to dist/app.js (a
 * classic script, since Chromium will not load module scripts from file://), with the page, the
 * app's stylesheet, the theme restore script, Area's stylesheet and the demos' images copied beside it.
 * Demos name images relative to the page ("images/david-tee.jpg"): Electron loads it from file://, where
 * "/images" is the disk's root.
 */
import { copyFileSync, cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { demoFiles, extractSnippets } from "./snippets.mjs";
import { readSources, sourceFiles } from "./sources.mjs";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const repo = resolve(root, "..", "..");
export const dist = join(root, "dist");
export const areaCss = join(repo, "packages/styles/dist/area.css");
const STATIC = ["index.html", "studio.css", "theme.js"];
// The demos' sample images (David Tee's photo, the chip images). They still sit in the archived site's public folder.
const images = join(repo, "apps/docs/public/images");

/** The workspace packages the app imports are built (their dist/ exists). */
export const packagesBuilt = () => [areaCss, join(repo, "packages/react/dist/modules/index.js"), join(repo, "packages/tokens/dist/tokens.json")].every(existsSync);

export function copyStatic() {
  mkdirSync(dist, { recursive: true });
  for (const file of STATIC) copyFileSync(join(root, "src", file), join(dist, file));
  copyFileSync(areaCss, join(dist, "area.css"));
  cpSync(images, join(dist, "images"), { recursive: true });
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
  plugins: [
    { name: "static", setup(build) { build.onEnd(result => { if (!result.errors.length) copyStatic(); }); } },
    // `virtual:demo-snippets`: every demo's code from its source file (scripts/snippets.mjs), rebuilt
    // when a demo file changes.
    { name: "snippets", setup(build) {
      build.onResolve({ filter: /^virtual:demo-snippets$/ }, () => ({ path: "demo-snippets", namespace: "snippets" }));
      build.onLoad({ filter: /.*/, namespace: "snippets" }, () => {
        const files = demoFiles(join(root, "src/content/demos"));
        return { contents: JSON.stringify(extractSnippets(files)), loader: "json", watchFiles: files };
      });
    } },
    // `virtual:component-sources`: every component's spec, stylesheet, React source and prop docs (scripts/sources.mjs),
    // for a family's API, Code and Spec tabs; rebuilt when any of them changes.
    { name: "sources", setup(build) {
      build.onResolve({ filter: /^virtual:component-sources$/ }, () => ({ path: "component-sources", namespace: "sources" }));
      build.onLoad({ filter: /.*/, namespace: "sources" }, () => ({ contents: JSON.stringify(readSources(repo)), loader: "json", watchFiles: sourceFiles(repo) }));
    } },
  ],
});
