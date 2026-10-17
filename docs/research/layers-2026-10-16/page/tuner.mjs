// Builds the Layers review page on the shipped scale: light ground 100 to 90, dark ground 0 / 8 / 12 to 24, layer
// contrast 0 (Flat) to 8 for each theme. The scenes are Area's built CSS driven by the real settings
// (data-area-ground-light, -ground-dark, -layers-light, -layers-dark, -neutral), so they show what ships. The swatches, readouts and the matrix come from the shipped
// model (packages/tokens/src/color/layers.ts), checked with the same rules as layers.test.ts.
//
//   npm run build -w @area/tokens && npm run build -w @area/styles
//   node docs/research/layers-2026-10-16/page/tuner.mjs <out-dir>
//
// Writes <out-dir>/index.html and copies area.css beside it; publish both.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import {
  DARK_FILL_FLOOR, DEFAULT_GROUND_DARK, DEFAULT_GROUND_LIGHT, DEFAULT_LAYERS, GROUND_DARK_STEPS, GROUND_LIGHT_STEPS, LAYER_STEPS,
  castOf, layerHex, layerLightness, layerTokens,
} from "../../../../packages/tokens/src/color/layers.ts";
import { wcagContrastHex } from "../../../../packages/tokens/src/color/contrast.ts";
import { NEUTRAL_SCALES } from "../../../../packages/tokens/src/color/presets.ts";
import { scaleFor } from "../../../../packages/tokens/src/semantic/resolve.ts";

const here = new URL(".", import.meta.url).pathname;
const repo = new URL("../../../../", import.meta.url).pathname;
const out = process.argv[2];
if (!out) throw new Error("usage: node tuner.mjs <out-dir>");
const spec = JSON.parse(readFileSync(here + "specimens.json", "utf8"));

// The checks in layers.test.ts, with the numbers kept for the readout.
const MIN = { light: { fill: 0.017, hover: 0.009, selected: 0.035, frame: 0.03 }, dark: { fill: 0.035, hover: 0.035, selected: 0.07, frame: 0.06 } };
const markOver = (theme, hex, keep = theme === "light" ? 0.94 : 0.9) => {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(x => theme === "light" ? x * keep : x * keep + (1 - keep));
  return "#" + c.map(x => Math.round(x * 255).toString(16).padStart(2, "0")).join("");
};
function check(theme, g, n, cast) {
  const m = layerLightness(theme, g, n), hx = L => layerHex(theme, L, cast), mm = MIN[theme], issues = [];
  const body = hx(m.ink.body), muted = hx(m.ink.muted), edge = hx(m.ink.edge);
  let worstMuted = Infinity, worstEdge = Infinity;
  for (const [name, ground] of [["page", m.page], ["card", m.raised], ["sidebar", m.recessed]]) {
    const key = name === "card" ? "raised" : name === "sidebar" ? "recessed" : "page";
    const [rest, hover, selected] = m.fill[key];
    for (const [what, bg] of [[name, ground], [`a field on the ${name}`, rest], [`a hovered row on the ${name}`, hover], [`a selected row on the ${name}`, selected]]) {
      const r = wcagContrastHex(muted, hx(bg)); worstMuted = Math.min(worstMuted, r);
      if (r < 4.5) issues.push(`muted text on ${what} ${r.toFixed(2)}:1`);
    }
    const mark = wcagContrastHex(muted, markOver(theme, hx(ground))); worstMuted = Math.min(worstMuted, mark);
    if (mark < 4.5) issues.push(`muted text on a soft badge on the ${name}`);
    if (wcagContrastHex(body, hx(selected)) < 4.5) issues.push(`text on a selected row on the ${name}`);
    for (const bg of [ground, rest]) { const r = wcagContrastHex(edge, hx(bg)); worstEdge = Math.min(worstEdge, r); if (r < 3) issues.push(`control edge on the ${name} ${r.toFixed(2)}:1`); }
    if (Math.abs(rest - ground) < mm.fill) issues.push(`a field on the ${name} barely shows`);
    if (Math.abs(hover - rest) < mm.hover) issues.push(`hover on the ${name} barely changes`);
    if (Math.abs(selected - ground) < mm.selected) issues.push(`a selected row on the ${name} barely shows`);
    if (theme === "dark" && rest < DARK_FILL_FLOOR - 1e-9) issues.push(`a field on the ${name} is under the dark floor`);
  }
  if (Math.abs(m.edge.card - m.page) < mm.frame) issues.push("the card frame barely shows");
  if (Math.abs(m.edge.float - m.raised) < mm.frame) issues.push("the menu frame barely shows");
  return { issues, muted: Number(worstMuted.toFixed(2)), edge: Number(worstEdge.toFixed(2)) };
}

const NAMES = { neutral: "Neutral", cool: "Cool", warm: "Warm" };
const casts = NEUTRAL_SCALES.map(s => ({ id: s.id, cast: castOf(scaleFor(s.id, "light").steps.find(x => x.level === 50).hex, scaleFor(s.id, "dark").steps.find(x => x.level === 900).hex) }));
const KEYS = { page: "bg-page", card: "bg-surface", side: "bg-subtle", field: "bg-component", fieldH: "bg-component-hover", sel: "bg-component-active",
  cField: "bg-component-raised", cHover: "bg-component-raised-hover", cSel: "bg-component-raised-active",
  sField: "bg-component-recessed", sHover: "bg-component-recessed-hover", sSel: "bg-component-recessed-active",
  text: "fg-default", muted: "fg-muted", edge: "stroke-control", cardEdge: "border-card", menuEdge: "border-float", rule: "border-decorative" };
const DATA = {};
let total = 0, passing = 0;
for (const { id, cast } of casts) for (const theme of ["light", "dark"]) {
  const grounds = theme === "light" ? GROUND_LIGHT_STEPS : GROUND_DARK_STEPS;
  for (const g of grounds) for (const n of LAYER_STEPS) {
    const sel = { groundLight: theme === "light" ? g : DEFAULT_GROUND_LIGHT, groundDark: theme === "dark" ? g : DEFAULT_GROUND_DARK, layersLight: n, layersDark: n };
    const t = layerTokens(theme, sel, cast[theme]), m = layerLightness(theme, g, n), c = check(theme, g, n, cast[theme]);
    total++; if (!c.issues.length) passing++;
    ((DATA[id] ??= {})[theme] ??= {})[`${g}/${n}`] = {
      ...Object.fromEntries(Object.entries(KEYS).map(([k, tok]) => [k, t[tok]])),
      L: [m.page, m.raised, m.recessed].map(x => Number(x.toFixed(3))), ...c,
    };
  }
}

const nav = `<nav class="area-nav" aria-label="Pages" style="--area-nav-inline-size:100%"><a class="area-nav__item" aria-current="page" href="#" tabindex="-1"><span class="area-nav__text">Home</span></a><a class="area-nav__item" href="#" tabindex="-1"><span class="area-nav__text">Library</span></a><a class="area-nav__item scene__hover" href="#" tabindex="-1"><span class="area-nav__text">Projects</span></a><a class="area-nav__item" href="#" tabindex="-1"><span class="area-nav__text">Settings</span></a></nav>`;
const card = `<div class="area-card area-card--vertical area-card--md"><div class="area-card__content"><h3 class="area-card__title">Launch plan</h3><div class="area-card__description">Draft for the design review</div><div class="area-input area-input--soft area-input--md"><input class="area-input__control" placeholder="Add a note" aria-label="Note" tabindex="-1"/></div><div class="area-card__footer"><button type="button" tabindex="-1" class="area-button area-button--solid area-button--neutral area-button--md"><span class="area-button__label">Share</span></button></div></div></div>`;
const menu = spec["menu-default"].replaceAll('type="button"', 'type="button" tabindex="-1"');
const table = spec["table-default"];
const scene = theme => `<div class="scene area-scope" id="scene-${theme}" data-area-theme="${theme}" data-area-ground-light="${DEFAULT_GROUND_LIGHT}" data-area-ground-dark="${DEFAULT_GROUND_DARK}" data-area-layers-light="${DEFAULT_LAYERS}" data-area-layers-dark="${DEFAULT_LAYERS}" data-area-neutral="neutral" aria-label="${theme === "light" ? "Light" : "Dark"} preview">
  <aside class="scene__side" data-area-ground="recessed"><div class="scene__brand">Area</div>${nav}</aside>
  <main class="scene__main"><div class="scene__bar"><div class="area-input area-input--soft area-input--md"><input class="area-input__control" placeholder="Search" aria-label="Search" tabindex="-1"/></div></div>
    <div class="scene__row"><div>${card}</div><div class="scene__menu">${menu}</div></div>
    <div class="scene__table">${table}</div></main></div>`;

mkdirSync(out, { recursive: true });
const page = readFileSync(here + "tuner-template.html", "utf8")
  .replace("<!--SCENE_LIGHT-->", scene("light"))
  .replace("<!--SCENE_DARK-->", scene("dark"))
  .replace("/*DATA*/", `const DATA = ${JSON.stringify(DATA)};\nconst NEUTRALS = ${JSON.stringify(casts.map(c => ({ id: c.id, label: NAMES[c.id] ?? c.id })))};\nconst GROUNDS = ${JSON.stringify({ light: GROUND_LIGHT_STEPS, dark: GROUND_DARK_STEPS })};\nconst LAYERS = ${JSON.stringify(LAYER_STEPS)};\nconst DEFAULTS = ${JSON.stringify({ light: DEFAULT_GROUND_LIGHT, dark: DEFAULT_GROUND_DARK, layers: DEFAULT_LAYERS })};`)
  .replaceAll("<!--TOTAL-->", String(total / casts.length)).replaceAll("<!--PASSING-->", String(passing === total ? total / casts.length : `${passing} / ${casts.length}`));
writeFileSync(out + "/index.html", page);
copyFileSync(repo + "packages/styles/dist/area.css", out + "/area.css");
console.log(`ok: ${page.length} bytes, ${passing} of ${total} combinations pass`);
