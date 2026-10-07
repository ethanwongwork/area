// Before (the committed pilot-icons.tsx) and after (the working tree), outline and filled at 16 / 24 / 32 / 48
// and 96px through the real size prop. From the repository root, after `npm run icons:pilot`:
//   git show HEAD:apps/docs/src/pilot-icons.tsx > apps/docs/.cache/pilot-before.tsx
//   node docs/research/icon-review/2026-10-06/before-after.mjs out.png name…
import { build } from "esbuild"; import { writeFileSync } from "node:fs"; import { execFileSync } from "node:child_process";
const [out, ...names] = process.argv.slice(2);
const cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/ba.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server";
import { PILOT_ICONS as AFTER } from "../src/pilot-icons.tsx"; import { PILOT_ICONS as BEFORE } from "./pilot-before.tsx";
const set = (C, label) => h("div", { className: "set" }, h("span", { className: "t" }, label), ...[16, 24, 32, 48].map(s => h(C, { size: s })), h(C, { size: 96 }));
const side = (list, n, label) => { const p = list.find(p => p.name === n); return h("div", { className: "side" }, set(p.Icon, label), set(p.Filled, "")); };
export const html = names => renderToStaticMarkup(h("div", null, ...names.map(n => h("div", { className: "r", key: n }, h("div", { className: "l" }, n), side(BEFORE, n, "before"), side(AFTER, n, "after")))));`);
await build({ entryPoints: [cache + "/ba.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/ba.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { html } = await import(cache + "/ba.out.mjs?" + Date.now());
writeFileSync(cache + "/ba.html", `<!doctype html><style>body{font:12px system-ui;margin:12px;color:#111;background:#fff;--area-weight-icon:1.125px;--_icon-overlap:4.5px}.r{display:flex;align-items:center;gap:16px;border-bottom:1px solid #eee;padding:6px 0}.l{width:110px;font-weight:600}.side{display:grid;gap:4px;padding:0 12px;border-left:1px solid #ddd}.set{display:flex;align-items:center;gap:10px}.t{width:40px;color:#888}svg{display:block}</style>${html(names)}`);
execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", "--window-size=1060," + (24 + 222 * names.length), "--screenshot=" + out, "file://" + cache + "/ba.html"], { stdio: "ignore" });
console.log(out);
