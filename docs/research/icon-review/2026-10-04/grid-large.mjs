// Outline and filled at 40px (the size curve), six icons a row. From the repository root, after
// `npm run icons:pilot`: node docs/research/icon-review/2026-10-04/grid.mjs out.png name,name,…
import { build } from "esbuild"; import { writeFileSync } from "node:fs"; import { execFileSync } from "node:child_process";
const [out, list] = process.argv.slice(2); const names = list.split(",");
const cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/gr.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server"; import { PILOT_ICONS } from "../src/pilot-icons.tsx";
export const html = names => renderToStaticMarkup(h("div", { className: "g" }, ...names.map(n => { const p = PILOT_ICONS.find(p => p.name === n); return h("div", { className: "t", key: n }, h("div", { className: "i" }, h(p.Icon, { size: 96 }), h(p.Filled, { size: 96 })), h("div", { className: "n" }, n)); })));`);
await build({ entryPoints: [cache + "/gr.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/gr.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { html } = await import(cache + "/gr.out.mjs?" + Date.now());
writeFileSync(cache + "/gr.html", `<!doctype html><style>body{font:13px system-ui;margin:12px;color:#1a1a1a;--area-weight-icon:1.125px;--_icon-overlap:4.5px}.g{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.t{border:1px solid #eee;border-radius:8px;padding:8px}.i{display:flex;gap:14px}.n{margin-top:4px}svg{display:block}</style>${html(names)}`);
const rows = Math.ceil(names.length / 4);
execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1.5", "--window-size=1100," + (30 + 150 * rows), "--screenshot=" + out, "file://" + cache + "/gr.html"], { stdio: "ignore" });
console.log(out);
