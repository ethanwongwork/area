// Line illustrations (ln.css): each axis type as a component and as a layout, three values, master and card size.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { TYPES, DEFAULTS, attrs, scopeOf } from "../ladder/build.mjs";

const REPO = join(import.meta.dirname, "../../../..");
const u = n => `calc(${n}px * var(--_k))`;
const tok = (name, n = 1) => `calc(var(${name}) * var(--_k)${n === 1 ? "" : ` * ${n}`})`;
const t = (w, title = false) => `<i class="ln-t ${title ? "ln-t--title" : ""}" style="inline-size:${u(w)}"></i>`;
const col = (gap, inner, extra = "") => `<span style="display:flex;flex-direction:column;gap:${u(gap)};${extra}">${inner}</span>`;
const window_ = (w, h, inner, radius = tok("--area-radius-container")) =>
  `<div class="ln-box" style="inline-size:${u(w)};block-size:${u(h)};border-radius:${radius};overflow:hidden"><div class="ln-chrome"><i></i><i></i><i></i></div><div style="display:flex;flex:1;min-block-size:0">${inner}</div></div>`;
const side = (w, inner, extra = "") => `<div class="ln-wash" style="inline-size:${u(w)};flex:none;border-inline-end:var(--_w) solid var(--_ink);padding:${u(10)} ${u(8)};display:flex;flex-direction:column;gap:${u(8)};${extra}">${inner}</div>`;
const main = (inner, extra = "") => `<div style="flex:1;min-inline-size:0;padding:${u(12)};display:flex;flex-direction:column;gap:${u(8)};${extra}">${inner}</div>`;
const btn = (w, h, cls = "", radius = tok("--area-radius-control-md")) => `<span class="ln-btn ${cls}" style="inline-size:${u(w)};block-size:${u(h)};border-radius:${radius}">${t(w * 0.45)}</span>`;
const row = (h, w, cls = "", glyph = true) => `<span class="ln-row ${cls}" style="block-size:${h}">${glyph ? `<i class="ln-glyph"></i>` : ""}${t(w)}</span>`;
const list = (w, rows, extra = "") => `<span class="ln-box" style="inline-size:${u(w)};padding:${u(4)};gap:${u(1)};border-radius:${tok("--area-radius-list")};${extra}">${rows}</span>`;
const CURSOR = `<svg class="ln-cursor" viewBox="0 0 11 15" aria-hidden="true"><path d="M1 1v11.2l2.9-2.7 2 4.2 2-.95-2-4.15h4.1z"/></svg>`;
const field = (w, h, cls = "") => `<span class="ln-field ${cls}" style="inline-size:${u(w)};block-size:${h};border-radius:${tok("--area-radius-control-md")}">${t(w * 0.3)}<i class="ln-caret"></i></span>`;
const realButton = label => `<span style="display:inline-block;zoom:var(--_k)"><span class="area-button area-button--solid area-button--neutral area-button--md"><span class="area-button__label">${label}</span></span></span>`;

const DRAW = {
  shape: {
    component: () => `<div class="ln-box" style="inline-size:${u(150)};block-size:${u(104)};border-radius:${tok("--area-radius-container")};padding:${u(14)};gap:${u(8)}">${t(64, true)}${t(112)}${t(92)}<span style="flex:1"></span>${btn(56, 22)}</div>`,
    layout: () => window_(212, 132, side(56, t(36) + t(28) + t(32)) + main(`${t(70, true)}<span class="ln-media" style="block-size:${u(36)};border-radius:${tok("--area-radius-control-md")}"></span>${t(100)}<span style="flex:1"></span>${btn(52, 20)}`)),
  },
  size: {
    component: () => list(150, row(tok("--area-ui-row"), 72, "ln-row--on") + row(tok("--area-ui-row"), 56) + row(tok("--area-ui-row"), 64)),
    layout: () => window_(212, 132, side(76, row(tok("--area-ui-row", 0.8), 34, "ln-row--on") + row(tok("--area-ui-row", 0.8), 28) + row(tok("--area-ui-row", 0.8), 32), `padding:${u(6)};gap:${u(1)}`) + main(`${t(64, true)}${t(96)}${t(84)}${t(90)}`)),
  },
  line: {
    component: () => `<div class="ln-box" style="inline-size:${u(150)};block-size:${u(104)};border-width:${tok("--area-border-width", 1.5)};border-radius:${u(10)};padding:${u(10)};gap:${u(8)}"><span class="ln-media" style="block-size:${u(40)}"></span>${t(70, true)}${t(96)}</div>`,
    layout: () => window_(212, 132, main(`${t(60, true)}<span style="display:flex;gap:${u(8)};flex:1">${[0, 1, 2].map(() => `<span class="ln-box" style="flex:1;border-width:${tok("--area-border-width", 1.5)};border-radius:${u(6)};padding:${u(6)};gap:${u(5)}"><span class="ln-media" style="block-size:${u(26)}"></span>${t(30)}${t(22)}</span>`).join("")}</span>`)),
  },
  lift: {
    component: () => `<div style="position:relative;inline-size:${u(170)};block-size:${u(116)}"><div class="ln-box" style="position:absolute;inset:0 ${u(40)} ${u(30)} 0;border-radius:${u(10)};padding:${u(12)};gap:${u(8)}">${t(60, true)}${t(96)}${t(80)}</div>${list(92, row(u(16), 40, "", false) + row(u(16), 48, "ln-row--on", false) + row(u(16), 36, "", false), `position:absolute;inset-inline-end:0;inset-block-end:0;box-shadow:var(--area-shadow-float)`)}</div>`,
    layout: () => window_(212, 132, main(`${t(56, true)}<span class="ln-field" style="inline-size:${u(110)};block-size:${u(20)};border-radius:${u(6)}">${t(40)}</span>${t(120)}${t(100)}`) + list(96, row(u(16), 44, "", false) + row(u(16), 52, "ln-row--on", false) + row(u(16), 40, "", false), `position:absolute;inset-inline-start:calc(50% - ${u(70)});inset-block-start:calc(50% - ${u(8)});box-shadow:var(--area-shadow-float)`)),
  },
  fill: {
    component: () => `<div style="position:relative">${list(150, row(tok("--area-ui-row", 0.8), 64) + row(tok("--area-ui-row", 0.8), 52, "ln-row--hover") + row(tok("--area-ui-row", 0.8), 70) + row(tok("--area-ui-row", 0.8), 48))}<span style="position:absolute;inset-inline-end:${u(26)};inset-block-start:calc(${tok("--area-ui-row", 1.2)} + ${u(4)})">${CURSOR}</span></div>`,
    layout: () => window_(212, 132, side(80, row(tok("--area-ui-row", 0.7), 34) + row(tok("--area-ui-row", 0.7), 28, "ln-row--hover") + row(tok("--area-ui-row", 0.7), 32), `padding:${u(6)};gap:${u(1)};position:relative`) + main(`${t(64, true)}${t(96)}${t(84)}${t(90)}`) + `<span style="position:absolute;inset-inline-start:${u(58)};inset-block-start:calc(${u(14)} + ${u(6)} + ${tok("--area-ui-row", 1.05)})">${CURSOR}</span>`),
  },
  ring: {
    component: () => col(7, `${t(40, true)}${field(160, u(30), "ln-focus")}${t(80)}`),
    layout: () => window_(212, 132, main(`${t(48, true)}${field(150, u(22), "ln-focus")}${t(40)}${field(150, u(22))}`, `gap:${u(7)}`)),
  },
  layers: {
    component: () => `<div class="ln-box" style="inline-size:${u(170)};block-size:${u(110)};border-radius:${u(10)};flex-direction:row;overflow:hidden;background:var(--area-bg-page)"><span style="inline-size:${u(52)};background:var(--area-bg-subtle);border-inline-end:var(--_w) solid var(--_ink)"></span><span style="flex:1;display:grid;place-items:center"><span class="ln-box" style="inline-size:${u(80)};block-size:${u(56)};border-radius:${u(6)};background:var(--area-bg-card, var(--area-bg-surface));padding:${u(8)};gap:${u(6)}">${t(40, true)}${t(56)}</span></span></div>`,
    layout: () => window_(212, 132, `<div style="inline-size:${u(60)};flex:none;background:var(--area-bg-subtle);border-inline-end:var(--_w) solid var(--_ink);padding:${u(10)} ${u(8)};display:flex;flex-direction:column;gap:${u(8)}">${t(36)}${t(28)}${t(32)}</div><div style="flex:1;background:var(--area-bg-page);padding:${u(12)};display:flex;flex-direction:column;gap:${u(8)}">${t(60, true)}<span style="display:flex;gap:${u(8)}">${[0, 1].map(() => `<span class="ln-box" style="flex:1;block-size:${u(50)};border-radius:${u(6)};background:var(--area-bg-card, var(--area-bg-surface));padding:${u(6)};gap:${u(5)}">${t(30)}${t(22)}</span>`).join("")}</span></div>`),
  },
  colour: {
    component: () => `<div class="ln-box" style="inline-size:${u(160)};block-size:${u(100)};border-radius:${u(10)};padding:${u(14)};gap:${u(8)}">${t(70, true)}${t(118)}${t(96)}<span style="flex:1"></span><span style="display:flex;justify-content:flex-end">${btn(56, 22, "ln-btn--accent", u(6))}</span></div>`,
    layout: () => window_(212, 132, main(`<span style="display:flex;justify-content:space-between;align-items:center">${t(56, true)}${btn(48, 18, "ln-btn--accent", u(5))}</span><span class="ln-media" style="block-size:${u(40)}"></span>${t(120)}${t(96)}`)),
  },
  motion: {
    component: v => { const n = Math.round(Number(v) / 75); const knob = (pos, ghost) => `<i class="ln-knob ${ghost ? "ln-knob--ghost" : ""}" style="inline-size:${u(42)};block-size:${u(42)};inset-block-start:${u(4)};inset-inline-start:${u(pos)}"></i>`; return `<span class="ln-switch ln-switch--on" style="inline-size:${u(104)};block-size:${u(52)}">${Array.from({ length: n }, (_, i) => knob(4 + ((i + 1) / (n + 1)) * 54, true)).join("")}${knob(58, false)}</span>`; },
    layout: v => { const n = Math.round(Number(v) / 75); return window_(212, 132, main([0, 1, 2].map(i => `<span style="display:flex;align-items:center;justify-content:space-between;gap:${u(8)}">${col(4, t(60 - i * 8, true) + t(80 - i * 10))}<span class="ln-switch ${i === 0 ? "ln-switch--on" : ""}" style="inline-size:${u(32)};block-size:${u(18)}">${i === 0 ? Array.from({ length: n }, (_, j) => `<i class="ln-knob ln-knob--ghost" style="inline-size:${u(13)};block-size:${u(13)};inset-block-start:${u(1.5)};inset-inline-start:calc(${u(1.5)} + ${(j + 1) / (n + 1)} * ${u(14)})"></i>`).join("") : ""}<i class="ln-knob" style="inline-size:${u(13)};block-size:${u(13)};inset-block-start:${u(1.5)};${i === 0 ? `inset-inline-end:${u(1.5)}` : `inset-inline-start:${u(1.5)}`}"></i></span></span>`).join(""), `gap:${u(12)};justify-content:center`)); },
  },
  material: {
    component: () => `<div class="ln-box" style="inline-size:${u(160)};block-size:${u(100)};border-radius:${u(10)};padding:${u(14)};gap:${u(8)}">${t(70, true)}${t(110)}<span style="flex:1"></span><span>${realButton("Button")}</span></div>`,
    layout: () => window_(212, 132, main(`<span style="display:flex;justify-content:space-between;align-items:center">${t(56, true)}${realButton("Save")}</span><span class="ln-media" style="block-size:${u(40)}"></span>${t(120)}${t(96)}`)),
  },
};

for (const theme of ["light", "dark"]) {
  const cells = [];
  for (const type of TYPES) for (const variant of ["component", "layout"]) for (const size of ["master", "card"]) {
    const opts = type.values.map(([v, label]) => `<span class="lab-opt"><span class="ln ${size === "card" ? "ln--card" : ""}" ${attrs({ ...scopeOf(type, v), ...(type.id === "material" ? { "data-area-material": v } : {}) })}>${DRAW[type.id][variant](v)}</span><span class="lab-label">${label}</span></span>`).join("");
    cells.push(`<div class="lab-cap" data-cap="${type.id}-${variant}-${size}">${opts}</div>`);
  }
  writeFileSync(join(import.meta.dirname, `line-${theme}.html`), `<!doctype html><html lang="en" ${attrs(DEFAULTS)} data-area-theme="${theme}"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap">
<link rel="stylesheet" href="${REPO}/packages/styles/dist/area.css">
<link rel="stylesheet" href="../lab2/ladder.css">
<link rel="stylesheet" href="ln.css">
<style>.lab-cap { gap: 16px; } .ln { border-radius: 8px; box-shadow: inset 0 0 0 1px var(--area-border-decorative); }</style>
</head><body class="lab">${cells.join("\n")}</body></html>`);
}
console.log("built");
