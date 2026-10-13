// 12px cuts sheet: each icon that components show at 12px, three ways — the 16px drawing at 12 (the size
// curve's 0.99px line, as Glyph and @area/icons draw it today), Area's 12px cut, and Fluent's 12px regular cut —
// at device scale 1 (magnified 8×, pixelated: what a 1× screen shows), at 2× and at actual size, light and dark.
//   node docs/research/icon-review/2026-10-13/cuts12.mjs out.png [name,name…]
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { edgeShot } from "../2026-10-07/edge.mjs";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "../../../..");
const SRC = join(REPO, "packages/icons/sources");
const FLUENT = join(REPO, "node_modules/@fluentui/svg-icons/icons");
const FLUENT_NAME = { dismiss: "dismiss", "chevron-down": "chevron_down", check: "checkmark", add: "add", info: "info", open: "open", link: "link", bell: "alert", "arrow-up": "arrow_up", globe: "globe", book: "book" };
const [outArg, only] = process.argv.slice(2);
const out = resolve(outArg ?? "cuts12.png");
const names = only ? only.split(",") : readdirSync(join(SRC, "12")).map(f => f.replace(/\.svg$/, "")).sort();
const LINE = 1.125 * Math.pow(12 / 16, 0.45); // the size curve at 12: 0.988px

const body = svg => svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
// The 16px drawing as the outline draws it: filled-only parts dropped, the line in drawing units.
const at16 = n => body(readFileSync(join(SRC, n.split("~")[0] + ".svg"), "utf8")).split("\n").filter(l => !/data-filled="(gap|fill|stroke|halo|inset)"/.test(l)).join("\n")
  .replace(/stroke-width="1.25"/g, `stroke-width="${(LINE * 16 / 12).toFixed(4)}"`);
const cut = n => body(readFileSync(join(SRC, "12", n + ".svg"), "utf8")).replace(/stroke-width="1"/g, `stroke-width="${LINE.toFixed(4)}"`);
const fluent = n => { n = n.split("~")[0]; try { return body(readFileSync(join(FLUENT, `${FLUENT_NAME[n] ?? n.replace(/-/g, "_")}_12_regular.svg`), "utf8")).replace(/<path /g, '<path fill="currentColor" '); } catch { return ""; } };
const svg = (vb, inner) => `<svg width="12" height="12" viewBox="0 0 ${vb} ${vb}" fill="none" style="display:block;color:inherit">${inner}</svg>`;
const KINDS = [["16 at 12", n => svg(16, at16(n))], ["12 cut", n => svg(12, cut(n))], ["Fluent 12", n => { const f = fluent(n); return f ? svg(12, f) : ""; }]];

// Stage 1: every icon at 12px on a 16px pitch, light row then dark row, at device scale 1 and 2.
const tmp = out.replace(/\.png$/, "");
mkdirSync(dirname(out), { recursive: true });
const cell = (x, y, s, fg, bg) => `<div style="position:absolute;left:${x}px;top:${y}px;width:16px;height:16px;background:${bg};color:${fg}"><div style="position:absolute;left:2px;top:2px">${s}</div></div>`;
const THEMES = [["#1a1a1a", "#ffffff"], ["#ececec", "#0a0a0a"]];
const raster = names.flatMap((n, r) => KINDS.flatMap(([, f], k) => THEMES.map(([fg, bg], t) => cell((k * 2 + t) * 16, r * 16, f(n), fg, bg)))).join("");
writeFileSync(tmp + "-raster.html", `<!doctype html><body style="margin:0;background:#888">${raster}</body>`);
const W = KINDS.length * 2 * 16, H = names.length * 16;
for (const dpr of [1, 2]) await edgeShot([`--user-data-dir=${tmp}-prof${dpr}`, "--no-first-run", "--disable-gpu", "--hide-scrollbars", `--force-device-scale-factor=${dpr}`, `--window-size=${W},${H}`], `${tmp}-${dpr}x.png`, `file://${tmp}-raster.html`);

// Stage 2: the sheet. 1× magnified 8× (pixelated), then 2× and 1× at their own scale.
const Z = 8;
const crop = (dpr, col, row, scale) => `<div style="width:${16 * scale}px;height:${16 * scale}px;background:url(${tmp}-${dpr}x.png) -${col * 16 * scale}px -${row * 16 * scale}px / ${W * scale}px ${H * scale}px no-repeat;image-rendering:pixelated"></div>`;
const head = `<div class="row head"><div class="label"></div>${KINDS.map(([l]) => `<div class="group"><b>${l}</b><span>1× · 8×, light / dark</span></div>`).join("")}<div class="group small"><b>2×</b><span>16 · cut · Fluent</span></div><div class="group small"><b>1×</b><span>actual</span></div></div>`;
const rows = names.map((n, r) => `<div class="row"><div class="label">${n}</div>${KINDS.map((_, k) => `<div class="group">${crop(1, k * 2, r, Z)}${crop(1, k * 2 + 1, r, Z)}</div>`).join("")}
  <div class="group small">${KINDS.map((_, k) => `<div style="width:32px;height:32px;overflow:hidden">${crop(2, k * 2, r, 2)}</div>`).join("")}</div>
  <div class="group small">${KINDS.map((_, k) => crop(1, k * 2, r, 1)).join("")}</div></div>`).join("");
writeFileSync(tmp + "-sheet.html", `<!doctype html><style>
body{margin:16px;font:12px/16px system-ui;color:#222;background:#fff}
.row{display:flex;flex:none;align-items:center;gap:20px;margin-bottom:10px}.label{width:96px;flex:none;font-weight:600}
.group{display:flex;flex:none;gap:4px;align-items:center}.group>div{outline:1px solid #e4e4e4}
.head .group{flex-direction:column;align-items:flex-start;width:260px;gap:0}.head .group.small{width:auto}.head span{color:#888}
.small{gap:8px}.small>div{outline:none}
</style><h3 style="margin:0 0 12px">12px cuts — ${names.length} icons</h3>${head}${rows}`);
await edgeShot([`--user-data-dir=${tmp}-prof3`, "--no-first-run", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=1200,${names.length * 138 + 90}`], out, `file://${tmp}-sheet.html`);
console.log(out);
