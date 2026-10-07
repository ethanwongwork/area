// Filled-consistency audit (owner, 2026-10-06): every icon by browser category (src/icon-categories.ts),
// each cell outline 32 · filled 32 · filled 16 through the real size prop, so siblings sit together.
// From the repository root, after `npm run icons:pilot`:
//   node docs/research/icon-review/2026-10-06/audit.mjs <out-dir> [category-slug…] [--names a,b]
import { build } from "esbuild"; import { writeFileSync, mkdirSync } from "node:fs"; import { execFileSync } from "node:child_process";
const args = process.argv.slice(2); const outDir = args[0]; mkdirSync(outDir, { recursive: true });
const namesAt = args.indexOf("--names"); const only = namesAt > 0 ? args[namesAt + 1].split(",") : null;
const pick = args.slice(1).filter((a, i) => !a.startsWith("--") && args[i] !== "--names");
const cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/au.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server"; import { PILOT_ICONS } from "../src/pilot-icons.tsx"; import { ICON_CATEGORIES } from "../src/icon-categories.ts";
export const cats = ICON_CATEGORIES.map(c => ({ slug: c.slug, name: c.name, icons: c.icons.filter(n => !PILOT_ICONS.find(p => p.name === n).derivedFrom) }));
const g = n => PILOT_ICONS.find(p => p.name === n);
export const html = (title, list) => renderToStaticMarkup(h("div", null, h("h1", null, title), h("div", { className: "grid" },
  ...list.map(n => { const p = g(n); return h("div", { className: "cell" }, h("div", { className: "l" }, n), h("div", { className: "row" }, h(p.Icon, { size: 32 }), h(p.Filled, { size: 32 }), h(p.Filled, { size: 16 }))); }))));`);
await build({ entryPoints: [cache + "/au.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/au.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { html, cats } = await import(cache + "/au.out.mjs?" + Date.now());
const COLS = 8;
const pages = only ? [{ slug: "picked", name: "Picked", icons: only }] : cats.filter(c => !pick.length || pick.includes(c.slug));
for (const [i, c] of pages.entries()) {
  const file = `${outDir}/${String(i).padStart(2, "0")}-${c.slug}.png`;
  writeFileSync(cache + "/au.html", `<!doctype html><style>body{font:11px system-ui;margin:10px;color:#111;background:#fff;--area-weight-icon:1.125px;--_icon-overlap:4.5px}h1{font-size:14px;margin:0 0 6px}.grid{display:grid;grid-template-columns:repeat(${COLS},150px);gap:4px}.cell{border:1px solid #e6e6e6;border-radius:5px;padding:4px 6px}.l{color:#555;white-space:nowrap;overflow:hidden;margin-bottom:2px}.row{display:flex;align-items:center;gap:10px}svg{display:block}</style>${html(c.name, c.icons)}`);
  const rows = Math.ceil(c.icons.length / COLS);
  execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=${COLS * 154 + 20},${40 + rows * 62}`, "--screenshot=" + file, "file://" + cache + "/au.html"], { stdio: "ignore" });
  console.log(file);
}
