// Area icons by themselves, outline and filled, at 16, 24, 32 and 48px through the real size
// curve (the `size` prop), so the sheet shows what a product renders at each size.
// From the repository root, after `npm run icons:pilot`:
//   node docs/research/icon-review/2026-10-02/sizes.mjs out.png name…
import { build } from "esbuild"; import { writeFileSync } from "node:fs"; import { execFileSync } from "node:child_process";
const [out, ...names] = process.argv.slice(2);
const SIZES = [16, 24, 32, 48];
const cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/sz.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server"; import { PILOT_ICONS } from "../src/pilot-icons.tsx";
const g = n => { const p = PILOT_ICONS.find(p => p.name === n); if (!p) throw new Error("no icon " + n); return p; };
const sizes = ${JSON.stringify(SIZES)};
const set = C => h("span", { className: "c" }, ...sizes.map(s => h(C, { size: s })));
export const html = names => renderToStaticMarkup(h("div", null,
  h("div", { className: "r hd" }, h("span", { className: "l" }), h("span", { className: "c" }, "Outline · " + sizes.join(" / ")), h("span", { className: "c" }, "Filled · " + sizes.join(" / "))),
  ...names.map(n => h("div", { className: "r", key: n }, h("span", { className: "l" }, n), set(g(n).Icon), set(g(n).Filled)))));`);
await build({ entryPoints: [cache + "/sz.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/sz.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { html } = await import(cache + "/sz.out.mjs?" + Date.now());
writeFileSync(cache + "/sz.html", `<!doctype html><style>body{font:14px system-ui;margin:16px;color:#1a1a1a;--area-weight-icon:1.125px;--_icon-overlap:4.5px}.r{display:flex;align-items:center;gap:8px;border-bottom:1px solid #eee;padding:8px 0}.hd{color:#777;font-weight:600}.l{width:160px}.c{width:220px;display:flex;align-items:center;gap:14px}.c+.c{border-left:1px solid #ddd;padding-left:14px}svg{display:block}</style>${html(names)}`);
execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=" + (process.env.DPR || 2) + "", "--window-size=680," + (60 + 66 * names.length), "--screenshot=" + out, "file://" + cache + "/sz.html"], { stdio: "ignore" });
console.log(out);
