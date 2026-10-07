// Icons large on a 16-grid (each grid cell one drawing unit), outline and filled at 128px, plus 16 / 24 / 32.
//   node docs/research/icon-review/2026-10-06/large.mjs out.png name…   (after `npm run icons:pilot`)
import { build } from "esbuild"; import { writeFileSync } from "node:fs"; import { execFileSync } from "node:child_process";
const [out, ...names] = process.argv.slice(2);
const cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/lg.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server"; import { PILOT_ICONS } from "../src/pilot-icons.tsx";
const g = n => { const p = PILOT_ICONS.find(p => p.name === n); if (!p) throw new Error("no icon " + n); return p; };
const small = C => h("span", { className: "s" }, ...[16, 24, 32].map(s => h(C, { size: s })));
export const html = names => renderToStaticMarkup(h("div", null, ...names.map(n => h("div", { className: "r", key: n }, h("span", { className: "l" }, n),
  h("span", { className: "big" }, h(g(n).Icon, { size: 128 })), h("span", { className: "big" }, h(g(n).Filled, { size: 128 })), small(g(n).Icon), small(g(n).Filled)))));`);
await build({ entryPoints: [cache + "/lg.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/lg.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { html } = await import(cache + "/lg.out.mjs?" + Date.now());
writeFileSync(cache + "/lg.html", `<!doctype html><style>body{font:13px system-ui;margin:12px;color:#111;background:#fff;--area-weight-icon:1.125px;--_icon-overlap:4.5px}.r{display:flex;align-items:center;gap:18px;border-bottom:1px solid #eee;padding:8px 0}.l{width:120px}.big{background:repeating-linear-gradient(0deg,transparent 0 7.6px,#eee 7.6px 8px),repeating-linear-gradient(90deg,transparent 0 7.6px,#eee 7.6px 8px)}.s{display:flex;gap:10px;align-items:center;width:120px}svg{display:block}</style>${html(names)}`);
execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", "--window-size=700," + (24 + 146 * names.length), "--screenshot=" + out, "file://" + cache + "/lg.html"], { stdio: "ignore" });
console.log(out);
