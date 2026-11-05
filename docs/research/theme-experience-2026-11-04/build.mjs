// Builds the Theme Experience artifact: entry.tsx bundled with Area's real components and the app's Setup questions, in
// Area's own CSS (area.css and the app's styles, fonts embedded). Usage:
//   node build.mjs <tree> <out.html> [snapshot.json]
// [snapshot.json]: a kit capture (../feed-kit-2026-11-01/capture.cjs); its <html> settings (the app's look) go on this page's
// root, as the kits' do.
// <tree> is a checkout whose packages and apps/desktop/dist are built (npm run build, then the desktop build).
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [tree, outFile, snapshot] = process.argv.slice(2);
const here = new URL(".", import.meta.url).pathname;
const dist = join(tree, "apps/desktop/dist");
const src = join(tree, "apps/desktop/src");

const bundle = await build({
  entryPoints: [join(here, "entry.tsx")],
  bundle: true, write: false, format: "iife", platform: "browser", target: "chrome120", jsx: "automatic", minify: true,
  define: { "process.env.NODE_ENV": '"production"' },
  loader: { ".json": "json" },
  nodePaths: [join(tree, "node_modules")],
  logLevel: "warning",
  plugins: [{ name: "tree", setup(b) {
    b.onResolve({ filter: /^@src\// }, args => ({ path: join(src, args.path.slice(5)) }));
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
const look = snapshot ? JSON.parse(readFileSync(snapshot, "utf8")).html.filter(([name]) => name.startsWith("data-area-") && name !== "data-area-theme") : [];

const html = `<title>Theme Setup Flow</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>${area}</style>
<style>${studio}</style>
<style>${page}</style>
<script>
(() => { const root = document.documentElement; for (const [n, v] of ${JSON.stringify(look)}) root.setAttribute(n, v); let t = null; try { t = localStorage.getItem("tx-theme"); } catch (e) {}
  root.dataset.theme = t || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); root.setAttribute("data-area-theme", root.dataset.theme); })();
</script>
<div id="tx-root"></div>
<script>${js}</script>
`;
writeFileSync(outFile, html);
console.log("wrote", outFile, (html.length / 1e6).toFixed(2), "MB");
