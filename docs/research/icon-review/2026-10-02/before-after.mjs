// Before | after (outline and filled) at 16px and at 64px with the true 16px line.
// The before copies sit beside the sources as <name>-was.svg while the generator and this run
// (from the repository root): node docs/research/icon-review/2026-10-02/before-after.mjs out.png name…
import { build } from "esbuild"; import { writeFileSync } from "node:fs"; import { execFileSync } from "node:child_process";
const [out, ...names] = process.argv.slice(2);
const cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/ba.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server"; import { PILOT_ICONS } from "../src/pilot-icons.tsx";
const g = n => PILOT_ICONS.find(p => p.name === n);
const cell = (C, big) => h("span", { className: big ? "b" : "s" }, big ? h(C, { weight: 1.125, width: 64, height: 64 }) : h(C, { size: 16 }));
export const html = names => renderToStaticMarkup(h("div", null,
  h("div", { className: "r hd" }, h("span", { className: "l" }), ...["Before", "Before, filled", "After", "After, filled"].map(t => h("span", { className: "c" }, t))),
  ...names.map(n => { const a = g(n + "-was"), b = g(n); return h("div", { className: "r", key: n }, h("span", { className: "l" }, n),
    ...[a.Icon, a.Filled, b.Icon, b.Filled].map(C => h("span", { className: "c" }, cell(C), cell(C, true)))); })));`);
await build({ entryPoints: [cache + "/ba.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/ba.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { html } = await import(cache + "/ba.out.mjs?" + Date.now());
writeFileSync(cache + "/ba.html", `<!doctype html><style>body{font:14px system-ui;margin:16px;color:#1a1a1a;--area-weight-icon:1.125px}.r{display:flex;align-items:center;gap:8px;border-bottom:1px solid #eee;padding:6px 0}.hd{color:#777;font-weight:600}.l{width:150px}.c{width:150px;display:flex;align-items:center;gap:16px}.c:nth-child(4){border-left:1px solid #ddd;padding-left:12px}.s svg{display:block}</style>${html(names)}`);
execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", "--window-size=820," + (70 + 79 * names.length), "--screenshot=" + out, "file://" + cache + "/ba.html"], { stdio: "ignore" });
