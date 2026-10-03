// The open icon decisions as one sheet: each option at 16px (true size) and 56px (true 16px line).
// Image sun options are temporary pilot icons (zz-*), the rest explore candidates.
// node docs/research/icon-review/2026-10-02/open-items.mjs out.png
import { build } from "esbuild"; import { writeFileSync } from "node:fs"; import { execFileSync } from "node:child_process";
const out = process.argv[2], cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/oi3.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server";
import { PILOT_ICONS } from "../src/pilot-icons.tsx"; import { EXPLORE } from "../src/pilot-explore.tsx";
const P = n => PILOT_ICONS.find(p => p.name === n), X = (g, l) => EXPLORE.find(e => e.group === g && e.label.startsWith(l));
const cells = (I, F) => [h("span", { className: "s" }, h(I, { size: 16 })), h(I, { weight: 1.125, width: 56, height: 56 }), F ? h("span", { className: "s" }, h(F, { size: 16 })) : null, F ? h(F, { weight: 1.125, width: 56, height: 56 }) : null];
const opt = (label, I, F, rec) => h("div", { className: "o" + (rec ? " rec" : "") }, h("div", { className: "row" }, ...cells(I, F)), h("div", { className: "lab" }, label, rec ? h("b", null, " · recommended") : null));
const sec = (title, note, ...opts) => h("section", null, h("h2", null, title), h("p", null, note), h("div", { className: "opts" }, ...opts));
export const html = renderToStaticMarkup(h("div", null,
  h("h1", null, "images and gallery"),
  sec("Two drawings of one idea", "Both are labelled Gallery. images was built on copy's old layering and missed the multiples update; gallery follows your reference (back copy down and left, the more layered look). Both options give the picture image's pyramid.",
    h("div", { className: "o rec" }, h("div", { className: "row" }, ...cells(X("images-gallery", "A").Icon)), h("div", { className: "lab" }, "A · one icon: gallery's layering; images becomes its alias", h("b", null, " · recommended"))),
    h("div", { className: "o" }, h("div", { className: "row" }, ...cells(X("images-gallery", "B").Icon), ...cells(X("images-gallery", "A").Icon)), h("div", { className: "lab" }, "B · two icons: images on copy's layering (left), gallery (right)")))));`);
await build({ entryPoints: [cache + "/oi3.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/oi3.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { html } = await import(cache + "/oi3.out.mjs?" + Date.now());
writeFileSync(cache + "/oi3.html", `<!doctype html><style>body{font:13px system-ui;margin:20px;color:#1a1a1a;--area-weight-icon:1.125px;width:1100px}h1{font-size:20px;margin:0 0 8px}h2{font-size:15px;margin:18px 0 2px}p{margin:0 0 8px;color:#555;max-width:900px}.opts{display:flex;gap:14px;flex-wrap:wrap}.o{border:1px solid #e5e5e5;border-radius:10px;padding:10px 12px}.o.rec{border-color:#1a1a1a}.row{display:flex;align-items:center;gap:12px;margin-bottom:6px}.s svg{display:block}.lab{color:#333}.lab b{font-weight:600}</style>${html}`);
execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", "--window-size=1140,330", "--screenshot=" + out, "file://" + cache + "/oi3.html"], { stdio: "ignore" });
