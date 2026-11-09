// Builds the Direct Editing review page: entry.tsx bundled with Area's real components and the app's design viewer,
// in Area's own CSS (area.css and the app's styles, fonts embedded) and page.css. Adapted from the Design Containers
// build. Usage:
//   node build.mjs <tree> <out.html>
// <tree> is a checkout whose packages and apps/desktop/dist are built (npm run build, then the desktop build).
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [tree, outFile] = process.argv.slice(2);
const here = new URL(".", import.meta.url).pathname;
const dist = join(tree, "apps/desktop/dist");
const src = join(tree, "apps/desktop/src");

const bundle = await build({
  entryPoints: [join(here, "entry.tsx")],
  bundle: true, write: false, format: "iife", platform: "browser", target: "chrome120", jsx: "automatic", minify: true,
  define: { "process.env.NODE_ENV": '"production"' },
  loader: { ".json": "json", ".js": "jsx" },
  nodePaths: [join(tree, "node_modules")],
  logLevel: "warning",
  plugins: [{ name: "tree", setup(b) {
    b.onResolve({ filter: /^@src\// }, args => ({ path: join(src, args.path.slice(5)) }));
    b.onResolve({ filter: /^\.\/stage\.tsx$/ }, args => args.importer.endsWith("design-viewer.tsx") ? { path: join(here, "../design-containers-2026-11-05/stage-keys.ts") } : undefined);
    // The app's build-time modules (component sources, demo snippets) aren't used by anything this page draws.
    b.onResolve({ filter: /^virtual:/ }, args => ({ path: args.path, namespace: "virtual" }));
    b.onLoad({ filter: /.*/, namespace: "virtual" }, () => ({ contents: "export default {};", loader: "js" }));
    // Entry's own bare imports resolve in the tree (its React, its packages), never a second copy.
    b.onResolve({ filter: /^(react|react-dom|@area\/)/ }, args => args.importer.startsWith(here) ? b.resolve(args.path, { resolveDir: src, kind: args.kind }) : undefined);
  } }],
});
const js = bundle.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
console.log("js", (js.length / 1e6).toFixed(2), "MB");

const dataUri = (file, type) => `data:${type};base64,${readFileSync(file).toString("base64")}`;
const area = readFileSync(join(dist, "area.css"), "utf8")
  .replace(/url\("https:\/\/cdn\.jsdelivr\.net\/npm\/geist@[^"]*\/Geist-Variable\.woff2"\)/, `url("${dataUri(join(dist, "fonts/geist/Geist-Variable.woff2"), "font/woff2")}")`)
  .replace(/url\("https:\/\/cdn\.jsdelivr\.net\/npm\/geist@[^"]*\/GeistMono-Variable\.woff2"\)/, `url("${dataUri(join(dist, "fonts/geist-mono/GeistMono-Variable.woff2"), "font/woff2")}")`);
if (/cdn\.jsdelivr/.test(area)) throw new Error("a font URL was left");
let studio = "";
for (const line of readFileSync(join(dist, "studio.css"), "utf8").split("\n")) {
  const m = line.match(/^@import url\("([^"]+)"\)( layer\(studio\))?;/);
  if (!m) { if (/^@layer/.test(line)) studio += line + "\n"; continue; }
  if (m[1].includes("typefaces.css")) continue;
  const css = readFileSync(join(dist, m[1]), "utf8");
  studio += m[2] ? `@layer studio {\n${css}\n}\n` : css + "\n";
}
studio = studio.replace(/url\("images\/[^"]+"\)/g, "none");
const page = readFileSync(join(here, "page.css"), "utf8");

const html = `<title>Direct Editing</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>${area}</style>
<style>${studio}</style>
<style>${page}</style>
<script>
(() => { const root = document.documentElement; const t = root.getAttribute("data-theme");
  root.setAttribute("data-area-theme", t === "dark" || t === "light" ? t : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); })();
</script>
<div id="root"></div>
<script>${js}</script>
`;
writeFileSync(outFile, html);
console.log("wrote", outFile, (html.length / 1e6).toFixed(2), "MB");
