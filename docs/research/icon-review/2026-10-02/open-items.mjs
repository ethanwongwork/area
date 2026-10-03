// The open icon decisions as one sheet: each option at 16px (true size) and 56px (true 16px line).
// Image sun options are temporary pilot icons (zz-*), the rest explore candidates.
// node docs/research/icon-review/2026-10-02/open-items.mjs out.png
import { build } from "esbuild"; import { writeFileSync } from "node:fs"; import { execFileSync } from "node:child_process";
const out = process.argv[2], cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/oi.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server";
import { PILOT_ICONS } from "../src/pilot-icons.tsx"; import { EXPLORE } from "../src/pilot-explore.tsx";
const P = n => PILOT_ICONS.find(p => p.name === n), X = (g, l) => EXPLORE.find(e => e.group === g && e.label.startsWith(l));
const cells = (I, F) => [h("span", { className: "s" }, h(I, { size: 16 })), h(I, { weight: 1.125, width: 56, height: 56 }), F ? h("span", { className: "s" }, h(F, { size: 16 })) : null, F ? h(F, { weight: 1.125, width: 56, height: 56 }) : null];
const opt = (label, I, F, rec) => h("div", { className: "o" + (rec ? " rec" : "") }, h("div", { className: "row" }, ...cells(I, F)), h("div", { className: "lab" }, label, rec ? h("b", null, " · recommended") : null));
const sec = (title, note, ...opts) => h("section", null, h("h2", null, title), h("p", null, note), h("div", { className: "opts" }, ...opts));
export const html = renderToStaticMarkup(h("div", null,
  h("h1", null, "Open icon items"),
  sec("1 · Image sun: dot size", "The sun is now a dot top right. ⌀1.5 is the family's detail dot (gallery, images, file-image); ⌀2 is the mark dot (Fluent's sun); ⌀2.5 needs a recorded exception. At ⌀2 image-plus's + sits a near miss from it (2.25), fixed by moving the dot up 1.",
    ...[["⌀1.5 (now)", "15"], ["⌀2", "20"], ["⌀2.5", "25"]].map(([l, n], i) => h("div", { className: "o" + (i === 1 ? " rec" : "") }, h("div", { className: "row" }, ...cells(P("zz-image-sun-" + n).Icon, P("zz-image-sun-" + n).Filled)), h("div", { className: "row" }, ...cells(P("zz-image-off-sun-" + n).Icon, P("zz-image-off-sun-" + n).Filled)), h("div", { className: "lab" }, l, i === 1 ? h("b", null, " · recommended") : null)))),
  sec("2 · bot-lead's crown", "The crown is too thin for its scallops: hairlines of space inside it in the outline (filled is fine).",
    opt("A · now", X("bot-lead-crown", "A").Icon), opt("B · solid crown", X("bot-lead-crown", "B").Icon, null, true), opt("C · taller crown, face lower (leaves the shared bot head)", X("bot-lead-crown", "C").Icon)),
  sec("3 · handshake", "Reads busy beside Fluent's and Hugeicons'. B is Hugeicons' two clasping arms scaled straight to 16px; it would be redrawn on the grid if chosen.",
    opt("A · now", X("handshake", "A").Icon), opt("B · two arms clasping", X("handshake", "B").Icon, null, true)),
  sec("4 · webhook", "Reads light beside its neighbours: small loops on a wide triangle.",
    opt("A · now (r 2)", X("webhook", "A").Icon), opt("B · r 2.5 loops", X("webhook", "B").Icon, null, true), opt("C · loops wrapped further", X("webhook", "C").Icon)),
  sec("Done · flask-off", "Restored: the part beyond the slash is back; only the slash and its gap cut the flask.", opt("now", P("flask-off").Icon, P("flask-off").Filled))));`);
await build({ entryPoints: [cache + "/oi.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/oi.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { html } = await import(cache + "/oi.out.mjs?" + Date.now());
writeFileSync(cache + "/oi.html", `<!doctype html><style>body{font:13px system-ui;margin:20px;color:#1a1a1a;--area-weight-icon:1.125px;width:1100px}h1{font-size:20px;margin:0 0 8px}h2{font-size:15px;margin:18px 0 2px}p{margin:0 0 8px;color:#555;max-width:900px}.opts{display:flex;gap:14px;flex-wrap:wrap}.o{border:1px solid #e5e5e5;border-radius:10px;padding:10px 12px}.o.rec{border-color:#1a1a1a}.row{display:flex;align-items:center;gap:12px;margin-bottom:6px}.s svg{display:block}.lab{color:#333}.lab b{font-weight:600}</style>${html}`);
execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", "--window-size=1140,1080", "--screenshot=" + out, "file://" + cache + "/oi.html"], { stdio: "ignore" });
