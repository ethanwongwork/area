// Outline | filled now | filled, prototype, at 16px and enlarged at the true 16px line
import { build } from "esbuild"; import { writeFileSync } from "node:fs"; import { execFileSync } from "node:child_process";
const [out, suffix, ...names] = process.argv.slice(2);
const cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/cmp3.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server"; import { PILOT_ICONS } from "../src/pilot-icons.tsx";
const g = n => PILOT_ICONS.find(p => p.name === n);
const cell = (C, big) => h("span", { className: big ? "b" : "s" }, big ? h(C, { weight: 1.125, width: 96, height: 96 }) : h(C, { size: 16 }));
export const html = (names, suffix) => renderToStaticMarkup(h("div", null,
  h("div", { className: "r hd" }, h("span", { className: "l" }), ...["Outline", "Filled now", "Filled: more ink (prototype)"].map(t => h("span", { className: "c" }, t))),
  ...names.map(n => { const a = g(n), b = g(n + suffix); return h("div", { className: "r", key: n }, h("span", { className: "l" }, "#61 " + n),
    ...[a.Icon, a.Filled, b.Filled].map(C => h("span", { className: "c" }, cell(C), cell(C, true)))); })));`);
await build({ entryPoints: [cache + "/cmp3.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/cmp3.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { html } = await import(cache + "/cmp3.out.mjs?" + Date.now());
writeFileSync(cache + "/cmp3.html", `<!doctype html><style>body{font:14px system-ui;margin:16px;color:#1a1a1a;--area-weight-icon:1.125px}.r{display:flex;align-items:center;gap:8px;border-bottom:1px solid #eee;padding:8px 0}.hd{color:#777;font-weight:600}.l{width:170px}.c{width:220px;display:flex;align-items:center;gap:18px}.s svg{display:block}</style>${html(names, suffix)}`);
execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", "--window-size=880," + (70 + 114 * names.length), "--screenshot=" + out, "file://" + cache + "/cmp3.html"], { stdio: "ignore" });
