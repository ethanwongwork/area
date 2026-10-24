// Ladder: each axis type drawn at six rungs, from the 16 px icon to real components, with Area's CSS.
// node build.mjs → ladder.html; capture.mjs shoots each [data-cap] cell in light and dark.
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const REPO = join(import.meta.dirname, "../../../..");
export const DEFAULTS = { "data-area-type": "14", "data-area-density": "32", "data-area-neutral": "neutral", "data-area-tint-hue": "auto", "data-area-tint-light": "auto", "data-area-tint-dark": "auto", "data-area-ink-tint": "2", "data-area-accent": "blue", "data-area-ground-light": "100", "data-area-ground-dark": "8", "data-area-layers-light": "4", "data-area-layers-dark": "4", "data-area-card-tone-light": "auto", "data-area-card-tone-dark": "auto", "data-area-action": "neutral", "data-area-selection": "accent", "data-area-radius": "8", "data-area-surface": "1", "data-area-shadow-rest": "0", "data-area-elevation": "3", "data-area-stroke": "4", "data-area-shadow-resting": "3", "data-area-shadow-field": "0", "data-area-shadow-size": "4", "data-area-shadow-softness": "2", "data-area-shadow-light": "0", "data-area-shadow-color": "black", "data-area-stroke-hover": "2", "data-area-selected-stroke": "2", "data-area-focus-ring": "hug", "data-area-shadow-hover": "3", "data-area-fill-hover": "2", "data-area-fill-selected": "1", "data-area-fill-pressed": "4", "data-area-selected-tint": "none", "data-area-motion": "210", "data-area-easing": "standard", "data-area-pills": "chip badge count switch avatar" };
export const attrs = o => Object.entries(o).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}="${v}"`).join(" ");
const W = "var(--area-weight-icon)";
const svg = body => `<svg class="g" viewBox="0 0 16 16" aria-hidden="true">${body}</svg>`;
let uid = 0;

/* The ten axis types, each with one representative setting at three values. */
export const TYPES = [
  { id: "shape", name: "Shape", setting: "Radius", attr: "radius", values: [["0", "0 (Sharp)"], ["8", "8"], ["pill", "Pill"]], also: "Pills" },
  { id: "size", name: "Size", setting: "Density", attr: "density", values: [["28", "28"], ["32", "32"], ["36", "36"]], also: "Type" },
  { id: "line", name: "Line", setting: "Stroke width", attr: "surface", values: [["0.5", "0.5"], ["1", "1"], ["2", "2"]], also: "Strength, Hover stroke, Contrast, Rest shadow" },
  { id: "lift", name: "Lift", setting: "Floating shadow", attr: "elevation", values: [["0", "0 (Flat)"], ["3", "3"], ["8", "8"]], also: "Resting, Hover, Field shadow; Size, Softness, Light, Colour" },
  { id: "fill", name: "Fill", setting: "Hover fill", attr: "fill-hover", values: [["1", "1"], ["2", "2"], ["4", "4"]], also: "Selected fill, Pressed fill, Selected tint, Danger hover" },
  { id: "ring", name: "Ring", setting: "Focus ring", attr: "focus-ring", values: [["hug", "Hug"], ["gap", "Gap"], ["halo", "Halo"]], also: "Selected stroke" },
  { id: "layers", name: "Layers", setting: "Light layers", attr: "layers-light", values: [["0", "0 (Flat)"], ["4", "4"], ["8", "8"]], also: "Ground, Card tone, Tint, Neutral", theme: "light" },
  { id: "colour", name: "Colour", setting: "Accent", attr: "accent", values: [["red", "Red"], ["blue", "Blue"], ["green", "Green"]], also: "Action, Selection, Tint hue, Text tint" },
  { id: "motion", name: "Motion", setting: "Motion", attr: "motion", values: [["60", "60"], ["210", "210"], ["300", "300"]], also: "Easing" },
  { id: "material", name: "Material", setting: "Material", attr: "material", values: [["none", "None"], ["glass", "Glass"], ["jelly", "Jelly"]], also: "the 14 Material levers" },
];
export const scopeOf = (type, v) => {
  const s = { [`data-area-${type.attr}`]: v };
  if (type.theme) s["data-area-theme"] = type.theme;
  return s;
};

/* Rung 1: today's marks (git HEAD option-marks.tsx), token-true in the 16 slot. */
export function today(type, v) {
  switch (type.id) {
    case "shape": return svg(`<rect x="1.5" y="3" width="13" height="10" rx="${v === "pill" ? 5 : (Number(v) * 10) / 32}"/>`);
    case "size": { const h = (Number(v) / 36) * 10; return svg(`<rect x="1.5" y="${8 - h / 2}" width="13" height="${h}" rx="2.5"/>`); }
    case "line": return `<span class="studio-mark studio-mark--frame" data-area-surface="${v}"></span>`;
    case "lift": return `<span class="studio-mark studio-mark--lift" style="--_lift:${v}"></span>`;
    case "fill": return `<span class="studio-mark studio-mark--plate" data-area-fill-hover="${v}" style="--_plate:var(--area-bg-hover)"></span>`;
    case "ring": return `<span class="studio-mark studio-mark--edge studio-mark--focus" data-area-focus-ring="${v}"></span>`;
    case "layers": return `<span class="studio-mark studio-mark--host"><span class="studio-mark studio-mark--layers" data-area-theme="light" data-area-layers-light="${v}"><span class="studio-mark__recessed"></span><span class="studio-mark__raised"></span></span></span>`;
    case "colour": return `<span class="studio-mark studio-mark--host"><span class="lab-swatch" data-area-accent="${v}"></span></span>`;
    case "motion": return `<span class="studio-mark studio-mark--duration" style="--_share:${(Number(v) / 300) * 100}%"></span>`;
    case "material": return "";
  }
}
/* Rung 2: one shape and the one thing that changes, exaggerated (the branch's option-marks.tsx). */
function lift(dy, ink) {
  const id = `c${++uid}`;
  const out = "M4.5 1.5H9.5A2.5 2.5 0 0 1 12 4V9A2.5 2.5 0 0 1 9.5 11.5H4.5A2.5 2.5 0 0 1 2 9V4A2.5 2.5 0 0 1 4.5 1.5Z";
  return svg(`<defs><clipPath id="${id}"><path clip-rule="evenodd" d="M-4 -4H20V20H-4Z ${out}"/></clipPath></defs>${ink ? `<g clip-path="url(#${id})"><rect x="${2 + dy * 0.45}" y="${1.5 + dy}" width="10" height="10" rx="2.5" fill="currentColor" fill-opacity="${ink}" stroke="none"/></g>` : ""}<path d="${out}"/>`);
}
export function ink(type, v) {
  const t = { shape: 0, size: 0 }[type.id];
  switch (type.id) {
    case "shape": case "size": return today(type, v);
    case "line": return svg(`<rect x="2.5" y="2.5" width="11" height="11" rx="2.5" style="stroke-width:${v}px"/>`);
    case "lift": { const n = Number(v), t = n / 8; return n ? lift(0.9 + 3.4 * t, 0.26 + 0.26 * t) : lift(0, 0); }
    case "fill": return svg(`<rect x="1.5" y="4.5" width="13" height="7" rx="2" fill="currentColor" fill-opacity="${0.06 + 0.07 * Number(v)}" stroke="none"/>`);
    case "ring": { const [gap, w, halo] = { hug: [0, 1.25, 0], gap: [1.5, 1.25, 0], halo: [0, 1, 2.5] }[v]; const g = gap + 0.6; return svg(`<rect x="3.5" y="4.5" width="9" height="7" rx="2" stroke-opacity=".45"/>${halo ? `<rect x="${3.5 - halo}" y="${4.5 - halo}" width="${9 + 2 * halo}" height="${7 + 2 * halo}" rx="${2 + halo}" style="stroke:var(--area-focus-color);stroke-opacity:.3;stroke-width:${halo}px"/>` : ""}<rect x="${3.5 - g}" y="${4.5 - g}" width="${9 + 2 * g}" height="${7 + 2 * g}" rx="${2 + g}" style="stroke:var(--area-focus-color);stroke-width:${w}px"/>`); }
    case "layers": return svg(`<rect x="1.5" y="3" width="13" height="10" rx="2"/><path d="M2.1 3.6H6V12.4H2.1Z" fill="currentColor" fill-opacity="${0.34 * Number(v) / 8}" stroke="none"/>`);
    case "colour": return today(type, v);
    case "motion": return today(type, v);
    case "material": return { none: svg(`<rect x="2.5" y="2.5" width="11" height="11" rx="2.5"/>`), glass: svg(`<rect x="2.5" y="2.5" width="11" height="11" rx="2.5" fill="currentColor" fill-opacity=".07" stroke-opacity=".6"/><path d="M5 12 12 5" stroke-opacity=".55"/>`), jelly: svg(`<rect x="2.5" y="2.5" width="11" height="11" rx="4.5"/><ellipse cx="8" cy="5.6" rx="3.4" ry="1.4" fill="currentColor" fill-opacity=".22" stroke="none"/>`) }[v];
  }
}
/* Rung 3: today's mark drawn large on a plate, its tokens at true value. */
const large = (type, v) => `<span class="lab-big">${type.id === "material" ? `<span class="lab-big__btn" data-area-material="${v}"><span class="area-button area-button--solid area-button--neutral area-button--sm"><span class="area-button__label">Aa</span></span></span>` : today(type, v)}</span>`;

/* Rung 4: the Folder-style figure (choice-figures.tsx). */
const bars = ws => ws.map(w => `<i class="cf-bar" style="inline-size:${w}%"></i>`).join("");
function figure(type, v) {
  const body = {
    shape: `<div class="cf-corner"><div class="cf-corner__outer"><span class="cf-corner__circle cf-corner__circle--outer"></span><div class="cf-corner__inner"><span class="cf-corner__circle"></span></div></div></div>`,
    size: `<div class="cf-center"><div class="cf-list">${[56, 44, 50].map((w, i) => `<div class="cf-row cf-row--dense ${i === 0 ? "cf-row--active" : ""}"><i class="cf-dot"></i><i class="cf-bar" style="inline-size:${w}%"></i></div>`).join("")}</div></div>`,
    line: `<div class="cf-page cf-center"><div class="cf-card cf-card--line" style="inline-size:64%;block-size:58%">${bars([60, 40])}</div></div>`,
    lift: `<div class="cf-page cf-center"><div class="cf-menu cf-menu--float">${[60, 48, 54].map((w, i) => `<div class="cf-row ${i === 1 ? "cf-row--hover" : ""}"><i class="cf-bar" style="inline-size:${w}%"></i></div>`).join("")}</div></div>`,
    fill: `<div class="cf-page cf-center"><div class="cf-menu">${[["rest", 58], ["hover", 46], ["active", 52], ["pressed", 40]].map(([s, w]) => `<div class="cf-row cf-row--${s} ${s === "hover" ? "cf-row--mine" : ""}"><i class="cf-bar" style="inline-size:${w}%"></i></div>`).join("")}</div></div>`,
    ring: `<div class="cf-page cf-center"><span class="cf-field cf-field--edge cf-field--focus" style="inline-size:68%;block-size:28%"></span></div>`,
    layers: `<div class="cf-window"><div class="cf-side">${bars([70, 54, 62])}</div><div class="cf-main"><i class="cf-bar cf-bar--strong" style="inline-size:46%"></i><div class="cf-card">${bars([64, 44])}<span class="cf-field cf-field--mini"></span></div></div></div>`,
    colour: `<div class="cf-page cf-center cf-stack"><span class="cf-btn cf-btn--accent"></span>${`<span class="cf-switch"><b></b></span>`}</div>`,
    motion: `<div class="cf-center"><div class="cf-track" style="inline-size:76%"><i style="inline-size:${(Number(v) / 300) * 100}%"></i><b style="inset-inline-start:calc(${(Number(v) / 300) * 100}% - 7px)"></b></div></div>`,
    material: `<div class="cf-page cf-center"><span class="area-button area-button--solid area-button--neutral area-button--sm"><span class="area-button__label">Button</span></span></div>`,
  }[type.id];
  return `<span class="lab-frame"><span class="cf" ${attrs({ ...scopeOf(type, v), ...(type.id === "material" ? { "data-area-material": v } : {}) })}>${body}</span></span>`;
}

/* Rung 5: an annotated close-up (Practical UI's corner diagrams; a corner-radius panel's circles): the part magnified,
   its measure marked. Every length is the token, times the zoom. */
function annotated(type, v, label) {
  const tag = text => `<span class="an-tag">${text}</span>`;
  const body = {
    shape: `<div class="cf-corner an-corner"><div class="cf-corner__outer"><span class="cf-corner__circle cf-corner__circle--outer"></span><div class="cf-corner__inner"><span class="cf-corner__circle"></span>${v === "0" ? "" : `<span class="an-r">${v === "pill" ? "Pill" : v}</span>`}</div></div><span class="an-pad"></span></div>`,
    size: `<div class="an-rows">${[0, 1].map(i => `<div class="an-row ${i === 0 ? "an-row--on" : ""}"><i class="cf-dot"></i><i class="cf-bar" style="inline-size:50%"></i></div>`).join("")}<span class="an-bracket"></span>${tag(label)}</div>`,
    line: `<div class="an-edge"><div class="an-edge__card"></div><span class="an-dim"></span>${tag(`${v} px`)}</div>`,
    lift: `<div class="cf-page an-lift"><div class="an-lift__card"></div><span class="an-lift__base"></span>${tag(label)}</div>`,
    fill: `<div class="cf-page an-fill">${["rest", "hover", "active", "pressed"].map(s => `<span class="an-fill__plate an-fill__plate--${s} ${s === "hover" ? "is-mine" : ""}"><i>${s === "active" ? "selected" : s}</i></span>`).join("")}</div>`,
    ring: `<div class="cf-page an-ring"><span class="an-ring__field"></span>${tag({ hug: "ring on the edge", gap: "ring, then a gap", halo: "halo" }[v])}</div>`,
    layers: `<div class="an-stack"><span class="an-pane an-pane--page"><i>page</i></span><span class="an-pane an-pane--side"><i>sidebar</i></span><span class="an-pane an-pane--card"><i>card</i></span></div>`,
    colour: `<div class="cf-page an-colour"><span class="an-chip an-chip--solid"><i>solid</i></span><span class="an-chip an-chip--surface"><i>surface</i></span><span class="an-chip an-chip--text"><i>text</i></span></div>`,
    motion: `<div class="an-time"><div class="an-time__axis">${[0, 100, 200, 300].map(t => `<span style="inset-inline-start:${(t / 300) * 100}%"><i>${t}</i></span>`).join("")}</div><div class="an-time__bar" style="inline-size:${(Number(v) / 300) * 76}%"></div>${tag(`${v} ms`)}</div>`,
    material: `<div class="cf-page an-mat" data-area-material="${v}"><span class="an-mat__zoom"><span class="area-button area-button--solid area-button--neutral area-button--md"><span class="area-button__label">Button</span></span></span></div>`,
  }[type.id];
  return `<span class="lab-frame lab-frame--an"><span class="cf" ${attrs(scopeOf(type, v))}>${body}</span></span>`;
}

/* Rung 6: real components, scaled down whole. */
export function real(type, v) {
  const btn = (cls = "solid", label = "Button") => `<button type="button" class="area-button area-button--${cls} area-button--neutral area-button--md" tabindex="-1"><span class="area-button__label">${label}</span></button>`;
  const input = `<div class="area-input area-input--outline area-input--md"><input class="area-input__control" placeholder="Placeholder" tabindex="-1"></div>`;
  const nav = `<nav class="area-nav"><a class="area-nav__item" aria-current="page"><span class="area-nav__text">Item one</span></a><a class="area-nav__item"><span class="area-nav__text">Item two</span></a><a class="area-nav__item"><span class="area-nav__text">Item three</span></a></nav>`;
  const card = `<div class="area-card area-card--vertical area-card--md" style="inline-size:200px"><div class="area-card__content"><h3 class="area-card__title">Title</h3><div class="area-card__description">Description</div></div></div>`;
  const menu = rows => `<div class="area-scroll-area area-menu lab-pop" role="listbox"><div class="area-scroll-area__viewport"><div class="area-scroll-area__content">${rows.map((r, i) => `<div role="option" class="area-menu__item" ${i === 1 ? 'data-highlighted=""' : ""}><span class="area-menu__text">${r}</span></div>`).join("")}</div></div></div>`;
  const sw = on => `<label class="area-switch area-switch--md area-switch--end"><input class="area-switch__control" role="switch" type="checkbox" ${on ? "checked" : ""} tabindex="-1"><span class="area-switch__track"><span class="area-switch__thumb"></span></span><span class="area-switch__label">Label</span></label>`;
  const body = {
    shape: `<div class="rl-col">${input}${btn()}</div>`,
    size: nav,
    line: card,
    lift: menu(["Item one", "Item two", "Item three"]),
    fill: menu(["Item one", "Item two", "Item three"]),
    ring: `<div class="rl-col">${input.replace('area-input area-input--outline', 'area-input area-input--outline rl-focus')}</div>`,
    layers: `<div class="rl-window"><div class="rl-side">${nav}</div><div class="rl-main">${card}</div></div>`,
    colour: `<div class="rl-col" data-area-action="accent">${btn()}${sw(true)}</div>`,
    motion: `<div class="rl-col">${sw(true)}<span class="rl-note">moves at ${v} ms</span></div>`,
    material: `<div class="rl-col">${btn()}${sw(true)}</div>`,
  }[type.id];
  return `<span class="lab-frame lab-frame--real"><span class="rl" ${attrs(scopeOf(type, v))}><span class="rl-scale">${body}</span></span></span>`;
}

const RUNGS = [
  ["icon-today", "Icon · today", "The mark in the 16 slot, painted by the option's token", (t, v) => `<span class="lab-row"><span class="area-menu__icon">${today(t, v) || `<span class="lab-none">—</span>`}</span></span>`],
  ["icon-ink", "Icon · one idea", "The same slot, one shape and the one thing that changes, exaggerated", (t, v) => `<span class="lab-row"><span class="area-menu__icon">${ink(t, v)}</span></span>`],
  ["mark", "Mark · large", "Today's mark at 40 on a plate: the token at a size where it reads", large],
  ["figure", "Figure · abstract", "Folder's outline look, the region the setting moves", figure],
  ["annotated", "Illustration · annotated", "The part close up, its measure marked", annotated],
  ["real", "Real · components", "Area's own components under the option, scaled down whole", real],
];

const cells = [];
for (const type of TYPES) for (const [rid, , , draw] of RUNGS) {
  const opts = type.values.map(([v, label]) => `<span class="lab-opt">${draw(type, v, label)}<span class="lab-label">${label}</span></span>`).join("");
  cells.push(`<div class="lab-cap lab-cell lab-cell--${rid}" data-cap="${type.id}-${rid}">${opts}</div>`);
}
const html = `<!doctype html><html lang="en" ${attrs(DEFAULTS)} data-area-theme="light"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="${REPO}/packages/styles/dist/area.css">
<link rel="stylesheet" href="${REPO}/apps/desktop/src/styles/choice-figures.css">
<link rel="stylesheet" href="today.css">
<link rel="stylesheet" href="ladder.css">
</head><body class="lab">${cells.join("\n")}</body></html>`;
if (process.argv[1]?.endsWith("lab2/build.mjs")) writeFileSync(join(import.meta.dirname, "ladder.html"), html);
if (process.argv[1]?.endsWith("lab2/build.mjs")) writeFileSync(join(import.meta.dirname, "ladder.json"), JSON.stringify({ types: TYPES.map(({ id, name, setting, also, values }) => ({ id, name, setting, also, values })), rungs: RUNGS.map(([id, name, note]) => ({ id, name, note })) }, null, 1));

