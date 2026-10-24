// Refined ladder: one illustration language (il.css), each rung a zoom through the same scene.
// node build.mjs → ladder.html (+ ladder.json); cap.mjs shoots each [data-cap] cell in light and dark.
import { writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { TYPES, DEFAULTS, attrs, scopeOf, today, ink, real } from "../ladder/build.mjs";

const REPO = join(import.meta.dirname, "../../../..");
const SHOTS = resolve(import.meta.dirname, "r12-screens"); // round-12 stage captures, light and dark
const bar = (w, cls = "") => `<i class="il-bar ${cls}" style="inline-size:${w}"></i>`;
const plate = (type, v, inner, extra = {}) => `<span class="il-plate"><span class="il" ${attrs({ ...scopeOf(type, v), ...extra })}>${inner}</span></span>`;

/* The object: the icon's shape grown, in Folder's look, alone. Each type's object is the same element in its scene. */
const OBJECT = {
  shape: () => `<span class="il-field" style="inline-size:64cqw;block-size:26cqh">${bar("40%")}</span>`,
  size: () => `<span class="il-btn" style="inline-size:56cqw;block-size:var(--area-control-md)">${bar("46%")}</span>`,
  line: () => `<span class="il-card" style="inline-size:58cqw;block-size:50cqh">${bar("70%", "il-bar--strong")}${bar("48%")}</span>`,
  lift: () => `<span class="il-list" style="inline-size:52cqw;box-shadow:var(--area-shadow-float)">${[64, 50, 58].map((w, i) => `<span class="il-item ${i === 1 ? "il-item--hover" : ""}">${bar(w + "%")}</span>`).join("")}</span>`,
  fill: () => `<span class="il-item il-item--hover" style="inline-size:64cqw;block-size:20cqh">${bar("54%")}</span>`,
  ring: () => `<span class="il-field il-focus" style="inline-size:64cqw;block-size:24cqh">${bar("40%")}</span>`,
  layers: () => `<span class="il-planes"><span class="il-planes__side"></span><span class="il-planes__main"><span class="il-planes__card"></span></span></span>`,
  colour: () => `<span class="il-swatch" style="inline-size:40cqh;block-size:40cqh"></span>`,
  motion: v => `<span class="il-dial" style="--_share:${(Number(v) / 300) * 100}%"></span>`,
  material: () => `<span class="area-button area-button--solid area-button--neutral area-button--md"><span class="area-button__label">Button</span></span>`,
};
/* The scene: the same object, same size and place, with its context a step quieter around it. */
const SCENE = {
  shape: () => `<span class="il-card" style="inline-size:82cqw;gap:7cqh"><span class="il-ctx">${bar("44%", "il-bar--strong")}</span><span class="il-field" style="block-size:26cqh">${bar("40%")}</span><span class="il-ctx" style="display:flex;justify-content:flex-end"><span class="il-btn il-btn--solid" style="inline-size:30cqw;block-size:20cqh;border-radius:var(--area-radius-control-sm)">${bar("50%")}</span></span></span>`,
  size: () => `<span class="il-col" style="inline-size:82cqw"><span class="il-ctx">${bar("40%", "il-bar--strong")}</span><span class="il-row-flex"><span class="il-field il-ctx" style="flex:1;block-size:var(--area-control-md)">${bar("50%")}</span><span class="il-btn" style="inline-size:34cqw;block-size:var(--area-control-md)">${bar("46%")}</span></span></span>`,
  line: () => `<span class="il-abs il-ctx" style="inset:0 auto 0 0;inline-size:16cqw;background:var(--area-bg-subtle);border-inline-end:var(--area-border-width) solid var(--area-border-divider)"></span><span class="il-card" style="inline-size:58cqw;block-size:62cqh;margin-inline-start:14cqw">${bar("70%", "il-bar--strong")}${bar("48%")}<i class="il-ctx" style="display:block;block-size:0;border-block-start:var(--area-stroke-width) solid var(--area-border-divider)"></i><span class="il-field il-ctx" style="block-size:18cqh">${bar("40%")}</span></span>`,
  lift: () => `<span class="il-abs il-ctx" style="inset:auto 10cqw 9cqh;display:grid;gap:6cqh">${bar("80%")}${bar("64%")}</span><span class="il-abs il-field il-ctx" style="inset-block-start:9cqh;inset-inline-start:24cqw;inline-size:52cqw;block-size:16cqh">${bar("40%")}</span><span class="il-abs il-list" style="inset-block-start:29cqh;inset-inline-start:24cqw;inline-size:52cqw;box-shadow:var(--area-shadow-float)">${[64, 50, 58].map((w, i) => `<span class="il-item ${i === 1 ? "il-item--hover" : ""}">${bar(w + "%")}</span>`).join("")}</span>`,
  fill: () => `<span class="il-list" style="inline-size:72cqw">${[["", 58], ["hover", 54], ["active", 50], ["pressed", 44]].map(([s, w]) => `<span class="il-item ${s ? `il-item--${s}` : ""} ${s === "hover" ? "" : "il-ctx"}" style="block-size:17cqh">${bar(w + "%")}</span>`).join("")}</span>`,
  ring: () => `<span class="il-col" style="inline-size:72cqw;gap:5cqh"><span class="il-ctx">${bar("30%")}</span><span class="il-field il-focus" style="block-size:20cqh">${bar("40%")}</span><span class="il-ctx">${bar("26%")}</span><span class="il-field il-ctx" style="block-size:20cqh">${bar("30%")}</span></span>`,
  layers: () => `<span class="il-planes"><span class="il-planes__side" style="display:grid;align-content:start;gap:7cqh;padding:12cqh 12%"><span class="il-ctx">${bar("80%")}</span><span class="il-ctx">${bar("60%")}</span><span class="il-ctx">${bar("70%")}</span></span><span class="il-planes__main"><span class="il-planes__card" style="display:grid;align-content:center;gap:7cqh;padding:0 10%"><span class="il-ctx">${bar("70%", "il-bar--strong")}</span><span class="il-ctx">${bar("50%")}</span></span></span></span>`,
  colour: () => `<span class="il-col" style="inline-size:76cqw"><span class="il-row-flex"><span class="il-check"></span><span class="il-ctx" style="flex:1">${bar("70%")}</span></span><span class="il-row-flex"><span class="il-switch il-switch--on" style="--_at:calc(100% - 13cqh)"><b></b></span><span class="il-ctx" style="flex:1">${bar("60%")}</span></span><span class="il-row-flex" style="justify-content:flex-end"><span class="il-btn" style="inline-size:36cqw;block-size:20cqh;background:var(--area-accent-solid);border-color:transparent">${bar("50%", "il-bar--on")}</span></span></span>`,
  motion: v => { const at = (Number(v) / 300); return `<span class="il-col" style="inline-size:78cqw"><span class="il-row-flex"><span class="il-ctx" style="flex:1">${bar("70%")}</span><span class="il-switch il-switch--on" style="--_at:calc(2px + ${at} * (100% - 13cqh - 4px))">${[0.25, 0.5, 0.75].map(f => `<s style="inset-inline-start:calc(2px + ${f * at} * (100% - 13cqh - 4px))"></s>`).join("")}<b></b></span></span><span class="il-row-flex il-ctx"><span style="flex:1">${bar("56%")}</span><span class="il-switch"><b></b></span></span></span>`; },
  material: () => `<span class="il-col" style="align-items:center;gap:8cqh"><span class="area-button area-button--solid area-button--neutral area-button--md"><span class="area-button__label">Button</span></span><span class="il-ctx" style="display:flex;gap:8px;align-items:center"><span class="area-button area-button--outline area-button--neutral area-button--sm"><span class="area-button__label">Cancel</span></span></span></span>`,
};
/* The close-up: the same object magnified at its measure, the measure marked. Lengths are tokens times the zoom. */
const CLOSEUP = {
  shape: v => `<span class="il-abs" style="--_z:3;inset-block-start:16cqh;inset-inline-start:14cqw;inline-size:160cqw;block-size:160cqh;border-radius:calc(var(--area-radius-control-md) * var(--_z));background:var(--area-bg-surface);box-shadow:inset 0 0 0 1.5px var(--_mark)"><span class="il-circle" style="inset-block-start:0;inset-inline-start:0;inline-size:calc(var(--area-radius-control-md) * var(--_z) * 2);aspect-ratio:1"></span>${v === "0" ? "" : `<span class="il-tag" style="inset-block-start:calc(var(--area-radius-control-md) * var(--_z) * .6 - 7px);inset-inline-start:calc(var(--area-radius-control-md) * var(--_z) * .6 - 7px)">${v === "pill" ? "Pill" : v}</span>`}</span>`,
  size: v => `<span class="il-btn" style="--_z:1.6;inline-size:120cqw;block-size:calc(var(--area-control-md) * var(--_z));margin-inline-start:30cqw;justify-content:flex-start;padding-inline:8cqw">${bar("26%")}</span><span class="il-guide" style="inset-inline-start:8cqw;inset-block:calc(50% - var(--area-control-md) * .8) calc(50% - var(--area-control-md) * .8);inline-size:5px;border-width:1.5px 0 1.5px 1.5px"></span><span class="il-tag" style="inset-inline-start:13cqw;inset-block-start:calc(50% - 7px)">${v}</span>`,
  line: v => `<span class="il-abs" style="inset-block-start:22cqh;inset-inline-start:18cqw;inline-size:140cqw;block-size:140cqh;border-radius:18px;background:var(--area-bg-surface);box-shadow:inset 0 0 0 calc(var(--area-border-width) * 6) var(--area-border-card)"></span><span class="il-guide" style="inset-block-start:22cqh;inset-inline-start:calc(18cqw + 30px);inline-size:22px;block-size:calc(var(--area-border-width) * 6);border-width:1px 0"></span><span class="il-tag" style="inset-block-start:calc(22cqh + var(--area-border-width) * 6 + 4px);inset-inline-start:calc(18cqw + 28px)">${v} px × 6</span>`,
  lift: v => `<span class="il-abs" style="inset-block-start:14cqh;inset-inline-start:20cqw;inline-size:44px;block-size:26px;border-radius:var(--area-radius-list);background:var(--area-bg-surface);border:var(--area-border-width) solid var(--area-border-card);box-shadow:var(--area-shadow-float);scale:1.9;transform-origin:0 0"></span><span class="il-guide" style="inset-inline:8cqw;inset-block-end:16cqh;border-block-start-width:1px;border-style:dashed"></span><span class="il-tag" style="inset-block-end:6px;inset-inline-end:6px">${v === "0" ? "0 · flat" : v}</span>`,
  fill: v => `<span style="display:grid;grid-template-columns:1fr 1fr;gap:4px;inline-size:86cqw">${[["rest", ""], ["hover", "il-item--hover"], ["selected", "il-item--active"], ["pressed", "il-item--pressed"]].map(([n, c]) => `<span class="il-item ${c} ${n === "hover" ? "il-outline" : ""}" style="block-size:36cqh;align-items:flex-start;padding:4px 6px;box-shadow:inset 0 0 0 var(--area-stroke-width) var(--area-border-decorative)"><i style="font:500 8px/10px var(--area-font-mono);font-style:normal;color:${n === "hover" ? "var(--_mark)" : "var(--area-fg-muted)"}">${n}</i></span>`).join("")}</span>`,
  ring: v => `<span class="il-field il-focus" style="--_z:2.6;inline-size:68cqw;block-size:24cqh;scale:var(--_z);transform-origin:20% 40%;margin-inline-start:26cqw;margin-block-start:10cqh"></span><span class="il-tag" style="inset-block-end:6px;inset-inline-end:6px">${{ hug: "on the edge", gap: "edge · gap · ring", halo: "halo" }[v]}</span>`,
  layers: () => `<span class="il-abs" style="inset:8% 30% 30% 8%;border-radius:6px;background:var(--area-bg-page);box-shadow:0 0 0 var(--area-border-width) var(--area-border-card)"></span><span class="il-abs" style="inset:22% 44% 16% 20%;border-radius:6px;background:var(--area-bg-subtle);box-shadow:0 0 0 var(--area-border-width) var(--area-border-card)"></span><span class="il-abs" style="inset:40% 8% 6% 40%;border-radius:6px;background:var(--area-bg-card, var(--area-bg-surface));box-shadow:0 0 0 var(--area-border-width) var(--area-border-card)"></span><span class="il-tag" style="inset-block-start:4%;inset-inline-start:6%">page</span><span class="il-tag" style="inset-block-start:18%;inset-inline-start:24%">sidebar</span><span class="il-tag" style="inset-block-start:36%;inset-inline-start:58%">card</span>`,
  colour: () => `<span style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;inline-size:86cqw">${[["solid", "background:var(--area-accent-solid)"], ["surface", "background:var(--area-accent-surface)"], ["text", "background:var(--area-bg-surface);box-shadow:inset 0 0 0 var(--area-stroke-width) var(--area-border-decorative);color:var(--area-accent-text, var(--area-accent-solid))"]].map(([n, st]) => `<span style="position:relative;display:grid;place-items:center;block-size:48cqh;border-radius:6px;${st}">${n === "text" ? `<b style="font:500 15px/1 var(--area-font-sans)">Aa</b>` : ""}<i style="position:absolute;inset-block-start:calc(100% + 3px);inset-inline:0;text-align:center;font:500 8px/10px var(--area-font-mono);font-style:normal;color:var(--area-fg-muted)">${n}</i></span>`).join("")}</span>`,
  motion: v => `<span class="il-abs" style="inset-inline:10cqw;inset-block-start:58cqh;border-block-start:1px solid var(--area-border-divider)">${[0, 100, 200, 300].map(t => `<span class="il-abs" style="inset-inline-start:${(t / 300) * 100}%;inset-block-start:-3px;block-size:6px;border-inline-start:1px solid var(--area-border-divider)"><i style="position:absolute;inset-block-start:7px;inset-inline-start:-8px;inline-size:16px;text-align:center;font:500 8px/10px var(--area-font-mono);font-style:normal;color:var(--area-fg-muted)">${t}</i></span>`).join("")}</span><span class="il-abs" style="inset-inline-start:10cqw;inset-block-start:calc(58cqh - 9px);inline-size:${(Number(v) / 300) * 80}cqw;block-size:5px;border-radius:3px;background:var(--_mark)"></span><span class="il-tag" style="inset-block-start:16cqh;inset-inline-end:8cqw">${v} ms</span>`,
  material: () => `<span class="il-abs" style="inset-block-start:24cqh;inset-inline-start:14cqw;scale:2.4;transform-origin:0 0"><span class="area-button area-button--solid area-button--neutral area-button--md"><span class="area-button__label">Button</span></span></span>`,
};
const screen = (type, k) => type.id === "material" ? `<span class="il-screen"><span style="font:500 9px/12px var(--area-font-mono);color:var(--area-fg-muted);text-align:center;padding:0 12px">Round 12 had no Material screen</span></span>`
  : `<span class="il-screen"><img src="__SHOT__/${type.id}-${k}.png" alt=""></span>`;
const material = (type, v) => type.id === "material" ? { "data-area-material": v } : {};

const RUNGS = [
  ["icon-today", "Icon · today", "The mark in the 16 slot, painted by the option's token", (t, v) => `<span class="lab-row"><span class="area-menu__icon">${today(t, v) || `<span class="lab-none">—</span>`}</span></span>`],
  ["icon-ink", "Icon · one idea", "The same slot: one shape and the one thing that changes, exaggerated", (t, v) => `<span class="lab-row"><span class="area-menu__icon">${ink(t, v)}</span></span>`],
  ["object", "Object", "The icon's shape grown into Folder's look, alone", (t, v) => plate(t, v, OBJECT[t.id](v), material(t, v))],
  ["scene", "Scene", "The same object, same size, with its context quieter around it", (t, v) => plate(t, v, SCENE[t.id](v), material(t, v))],
  ["closeup", "Close-up", "The same object magnified at its measure, the measure marked", (t, v) => plate(t, v, CLOSEUP[t.id](v), material(t, v))],
  ["screen", "Screen", "The setting across a whole app (round 12, semi-abstract)", (t, v, k) => plate(t, v, screen(t, k))],
  ["real", "Real", "Area's components under the option", (t, v) => real(t, v).replace('class="lab-frame lab-frame--real"', 'class="il-plate lab-real"')],
];

for (const theme of ["light", "dark"]) {
  const cells = [];
  for (const type of TYPES) for (const [rid, , , draw] of RUNGS) {
    const opts = type.values.map(([v, label], k) => `<span class="lab-opt">${draw(type, v, k)}<span class="lab-label">${label}</span></span>`).join("");
    cells.push(`<div class="lab-cap" data-cap="${type.id}-${rid}">${opts.replaceAll("__SHOT__", `file://${SHOTS}/r12stage-${theme}`)}</div>`);
  }
  const html = `<!doctype html><html lang="en" ${attrs(DEFAULTS)} data-area-theme="${theme}"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="${REPO}/packages/styles/dist/area.css">
<link rel="stylesheet" href="../lab2/today.css">
<link rel="stylesheet" href="../lab2/ladder.css">
<link rel="stylesheet" href="il.css">
<style>.lab-real .rl { background: var(--area-bg-page); } .lab-real::after { content: ""; position: absolute; inset: 0; z-index: 3; border-radius: inherit; box-shadow: inset 0 0 0 var(--area-stroke-width) var(--area-border); }</style>
</head><body class="lab">${cells.join("\n")}</body></html>`;
  writeFileSync(join(import.meta.dirname, `ladder-${theme}.html`), html);
}
writeFileSync(join(import.meta.dirname, "ladder.json"), JSON.stringify({ types: TYPES.map(({ id, name, setting, also, values }) => ({ id, name, setting, also, values })), rungs: RUNGS.map(([id, name, note]) => ({ id, name, note })) }, null, 1));
console.log("built");
