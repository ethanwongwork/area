// The open icon decisions as one sheet: each option at 16px (true size) and 56px (true 16px line).
// Image sun options are temporary pilot icons (zz-*), the rest explore candidates.
// node docs/research/icon-review/2026-10-02/open-items.mjs out.png
import { build } from "esbuild"; import { writeFileSync } from "node:fs"; import { execFileSync } from "node:child_process";
const out = process.argv[2], cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/oi2.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server";
import { PILOT_ICONS } from "../src/pilot-icons.tsx"; import { EXPLORE } from "../src/pilot-explore.tsx";
const P = n => PILOT_ICONS.find(p => p.name === n), X = (g, l) => EXPLORE.find(e => e.group === g && e.label.startsWith(l));
const cells = (I, F) => [h("span", { className: "s" }, h(I, { size: 16 })), h(I, { weight: 1.125, width: 56, height: 56 }), F ? h("span", { className: "s" }, h(F, { size: 16 })) : null, F ? h(F, { weight: 1.125, width: 56, height: 56 }) : null];
const opt = (label, I, F, rec) => h("div", { className: "o" + (rec ? " rec" : "") }, h("div", { className: "row" }, ...cells(I, F)), h("div", { className: "lab" }, label, rec ? h("b", null, " · recommended") : null));
const sec = (title, note, ...opts) => h("section", null, h("h2", null, title), h("p", null, note), h("div", { className: "opts" }, ...opts));
export const html = renderToStaticMarkup(h("div", null,
  h("h1", null, "Open icon items · round 2"),
  sec("1 · The picture family follows image", "image now has Fluent's pyramid (peak on the diagonal) and the sun top right. images and gallery still peak left, file-image right. B gives all three the pyramid; images and gallery keep the ⌀1.5 detail dot (their pictures are too small for ⌀2), file-image keeps its sun left of the fold.",
    opt("A · now", X("picture-family", "A · images").Icon), opt("B · pyramid", X("picture-family", "B · images").Icon, null, true),
    opt("A · now", X("picture-family", "A · gallery").Icon), opt("B · pyramid", X("picture-family", "B · gallery").Icon, null, true),
    opt("A · now", X("picture-family", "A · file-image").Icon), opt("B · pyramid", X("picture-family", "B · file-image").Icon, null, true)),
  sec("2 · bot-lead's height", "Without the dots the bot sits 0.24 low. B raises the crown 0.5 more, which centres it and gives the scallops more room.",
    opt("A · now", X("bot-lead-centre", "A").Icon), opt("B · crown 0.5 taller", X("bot-lead-centre", "B").Icon, null, true)),
  sec("3 · voicemail", "Reads 27% small: the tape is as wide as the keyline allows but only 4.5 tall. Fluent frames it, which is why theirs reads larger.",
    opt("A · now", X("voicemail", "A").Icon), opt("B · framed", X("voicemail", "B").Icon, null, true)),
  sec("4 · Also noticed (no candidates yet)", "file-code: since the chevrons moved onto the bottom edge, the outline page has no bottom line. vault: the dial's spokes read as ¤ at 16px. circuit-board: the traces read as §§. call-end: 26% small. flask-off: the thin taper where the slash crosses the side is back (kept at your call).",
    ...["file-code", "vault", "circuit-board", "call-end", "flask-off"].map(n => opt(n, P(n).Icon, P(n).Filled)))));`);
await build({ entryPoints: [cache + "/oi2.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/oi2.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { html } = await import(cache + "/oi2.out.mjs?" + Date.now());
writeFileSync(cache + "/oi2.html", `<!doctype html><style>body{font:13px system-ui;margin:20px;color:#1a1a1a;--area-weight-icon:1.125px;width:1100px}h1{font-size:20px;margin:0 0 8px}h2{font-size:15px;margin:18px 0 2px}p{margin:0 0 8px;color:#555;max-width:900px}.opts{display:flex;gap:14px;flex-wrap:wrap}.o{border:1px solid #e5e5e5;border-radius:10px;padding:10px 12px}.o.rec{border-color:#1a1a1a}.row{display:flex;align-items:center;gap:12px;margin-bottom:6px}.s svg{display:block}.lab{color:#333}.lab b{font-weight:600}</style>${html}`);
execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", "--window-size=1140,1260", "--screenshot=" + out, "file://" + cache + "/oi2.html"], { stdio: "ignore" });
