// The whole Area set by group: each icon outline and filled at 16 / 24 / 32 / 48 through the real size
// prop. From the repository root, after `npm run icons:pilot`:
//   node docs/research/icon-review/2026-10-03/grouped.mjs <out-dir> [group-index…]
// Writes <out-dir>/NN-<group>.png per group; ungrouped icons land in "Other".
import { build } from "esbuild"; import { writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs"; import { execFileSync } from "node:child_process";
import { GROUPS } from "./groups.mjs";
const LARGE = process.argv.includes("--large"); const [outDir, ...pick] = process.argv.slice(2).filter(a => a !== "--large"); mkdirSync(outDir, { recursive: true });
const cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/gr.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server"; import { PILOT_ICONS } from "../src/pilot-icons.tsx";
export const names = PILOT_ICONS.filter(p => !p.derivedFrom).map(p => p.name);
const g = n => PILOT_ICONS.find(p => p.name === n);
const set = (C, sizes) => sizes.map(s => h(C, { size: s }));
export const large = (title, list) => renderToStaticMarkup(h("div", null, h("h1", null, title), h("div", { className: "grid" },
  ...list.filter(g).map(n => h("div", { className: "cell" }, h("div", { className: "l" }, n), h("div", { className: "row" }, h("span", { className: "big" }, h(g(n).Icon, { size: 96 })), h("span", { className: "big" }, h(g(n).Filled, { size: 96 }))))))));
export const html = (title, list) => renderToStaticMarkup(h("div", null, h("h1", null, title), h("div", { className: "grid" },
  ...list.map(n => { const p = g(n); if (!p) return h("div", { className: "cell miss" }, n + " (missing)");
    return h("div", { className: "cell" }, h("div", { className: "l" }, n + (p.fill ? " · " + p.fill : "")),
      h("div", { className: "row" }, ...set(p.Icon, [16, 24, 32]), h("span", { className: "big" }, h(p.Icon, { size: 48 })), h("span", { className: "sep" }), ...set(p.Filled, [16, 24, 32]), h("span", { className: "big" }, h(p.Filled, { size: 48 })))); }))));`);
await build({ entryPoints: [cache + "/gr.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/gr.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { html, large, names } = await import(cache + "/gr.out.mjs?" + Date.now());
const listed = new Set(Object.values(GROUPS).flatMap(s => s.split(/\s+/)));
const groups = Object.entries(GROUPS).map(([k, v]) => [k, v.split(/\s+/)]);
const other = names.filter(n => !listed.has(n)); if (other.length) groups.push(["Other", other]);
const COLS = LARGE ? 5 : 4, W = LARGE ? 220 : 360, H = LARGE ? 130 : 86;
groups.forEach(([title, list], i) => {
  if (pick.length && !pick.includes(String(i))) return;
  const file = `${outDir}/${String(i).padStart(2, "0")}-${title.toLowerCase().replace(/[^a-z]+/g, "-")}${LARGE ? "-large" : ""}.png`;
  writeFileSync(cache + "/gr.html", `<!doctype html><style>body{font:12px system-ui;margin:12px;color:#111;background:#fff;--area-weight-icon:1.125px}h1{font-size:16px;margin:0 0 8px}.grid{display:grid;grid-template-columns:repeat(${COLS},${W}px);gap:6px}.cell{border:1px solid #e6e6e6;border-radius:6px;padding:6px}.l{color:#555;margin-bottom:4px;white-space:nowrap;overflow:hidden}.row{display:flex;align-items:center;gap:8px}.big{flex:none;background:repeating-linear-gradient(0deg,transparent 0 2.95px,#f2f2f2 2.95px 3px),repeating-linear-gradient(90deg,transparent 0 2.95px,#f2f2f2 2.95px 3px)}.sep{width:1px;height:40px;background:#ddd}svg{display:block}</style>${(LARGE ? large : html)(title, list)}`);
  rmSync(file, { force: true });
  const rows = Math.ceil(list.length / COLS);
  try { execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--user-data-dir=" + cache + "/edge-gr", "--force-device-scale-factor=2", `--window-size=${COLS * (W + 6) + 24},${50 + rows * H}`, "--screenshot=" + file, "file://" + cache + "/gr.html"], { stdio: "ignore", timeout: 8000, killSignal: "SIGKILL" }); } catch (e) { if (!existsSync(file)) throw e; }
  console.log(file, list.length);
});
