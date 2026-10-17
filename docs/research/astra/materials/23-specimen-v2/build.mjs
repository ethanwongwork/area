// Builds the materials specimen (task 23): None, Glass, Tactile and Soft on Area's real component markup, the
// reference-board items beside their printed recipes, and live controls. Research only.
//
//   npm run build -w @area/tokens && npm run build -w @area/styles && npm run build:docs   (the gallery, for markup)
//   node docs/research/astra/materials/23-specimen-v2/extract.mjs
//   node docs/research/astra/materials/23-specimen-v2/build.mjs <out-dir>
//
// Writes <out-dir>/index.html (materials.css inlined) and copies area.css beside it; publish both.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const here = new URL(".", import.meta.url).pathname;
const repo = new URL("../../../../../", import.meta.url).pathname;
const out = process.argv[2];
if (!out) throw new Error("usage: node build.mjs <out-dir>");
const spec = JSON.parse(readFileSync(here + "specimens.json", "utf8"));
const css = readFileSync(here + "materials.css", "utf8");

// Static markup lacks the state attributes React sets; add them so the checked and selected states paint.
const strip = html => html.replace(/^<div data-[a-z]+-demo="[^"]+" style="[^"]*">/, "").replace(/<\/div>$/, "");
const uniq = (html, key) => html.replaceAll(/(id|aria-labelledby)="([^"]+)"/g, (_, a, v) => `${a}="${v}-${key}"`).replaceAll('tabindex="0"', 'tabindex="-1"');
const switchOn = key => uniq(strip(spec["switch-checked"]).replace('class="area-switch__track"', 'class="area-switch__track" data-checked=""'), key + "on").replace("Label", "Sync");
const switchOff = key => uniq(strip(spec["switch-default"]), key + "off").replace("Label", "Notify");
const segmented = key => uniq(strip(spec["segmented-default"]), key).replace("One", "Day").replace("Two", "Week");
const slider = key => uniq(strip(spec["slider-default"]), key);
const menu = key => uniq(strip(spec["menu-selected"]).replace('aria-checked="true" class="area-menu__item"', 'aria-checked="true" class="area-menu__item" data-selected=""'), key)
  .replaceAll('type="button"', 'type="button" tabindex="-1"').replace("Label</span>", "Sort by</span>").replace("Option one", "Last edited").replace("Option two", "Created").replace("Option three", "Name");
const toast = spec["toast-neutral"].replace("Body text", "Draft saved");
const progress = spec["progress-default"];
const btn = (variant, label, action) => {
  const b = `<button type="button" class="area-button area-button--${variant} area-button--neutral area-button--md"><span class="area-button__label">${label}</span></button>`;
  return action ? `<span data-area-action="accent" style="display:contents">${b}</span>` : b;
};
const input = (variant, ph) => `<div class="area-input area-input--${variant} area-input--md"><input class="area-input__control" placeholder="${ph}" aria-label="${ph}" tabindex="-1"/></div>`;
const nav = `<nav class="area-nav" aria-label="Pages" style="--area-nav-inline-size:100%"><a class="area-nav__item" aria-current="page" href="#" tabindex="-1"><span class="area-nav__text">Home</span></a><a class="area-nav__item" href="#" tabindex="-1"><span class="area-nav__text">Projects</span></a><a class="area-nav__item" href="#" tabindex="-1"><span class="area-nav__text">Settings</span></a></nav>`;
const card = key => `<div class="area-card area-card--vertical area-card--md"><div class="area-card__content"><h3 class="area-card__title">Launch plan</h3><div class="area-card__description">Owned by David Tee</div>${input("soft", "Add a note")}<div class="area-card__footer">${btn("outline", "Later")}${btn("solid", "Share", true)}</div></div></div>`;

const PRESETS = [
  { id: "none", name: "None", note: "Area as it is today. Adds no paint: the identity every other material starts from." },
  { id: "glass", name: "Glass", note: "Frosted surfaces over what is behind them, with a light rim and sheen. Opacity never drops below the reading floor." },
  { id: "tactile", name: "Tactile", note: "Crisp molded controls and recessed wells, a lit top edge and a hairline ring, from the board's annotated buttons." },
  { id: "soft", name: "Soft", note: "Soft relief: convex controls and concave wells lit from the top left, on a same-tone gray ground (a bundle that sets Layers)." },
];
// Soft is a bundle (D16): it sets Layers to a same-tone gray ground so the relief has a tone to model.
const bundle = id => id === "soft" ? ' data-area-ground-light="95" data-area-layers-light="0" data-area-ground-dark="24" data-area-layers-dark="0"' : "";
const column = (p, theme) => `<section class="col" aria-label="${p.name}, ${theme}">
  <header class="col__head"><h3>${p.name}</h3><p>${p.note}</p></header>
  <div class="scene area-scope" data-area-theme="${theme}" data-area-material="${p.id}"${bundle(p.id)} data-preset="${p.id}">
    <div class="scene__grid">
      <div class="scene__stack">${card(p.id + theme)}<div class="row">${btn("solid", "Save")}${btn("soft", "Edit")}${btn("outline", "Cancel")}</div>
        <div class="row">${input("outline", "Search")}</div>
        <div class="row">${switchOn(p.id + theme)}${switchOff(p.id + theme)}</div>
        <div class="row">${segmented(p.id + theme)}</div>
        <div class="row row--fill">${slider(p.id + theme)}</div>
        <div class="row row--fill">${progress}</div>
      </div>
      <div class="scene__stack">${menu(p.id + theme)}<div class="navbox" data-area-ground="recessed">${nav}</div>${toast}</div>
    </div>
  </div>
</section>`;
const columns = theme => PRESETS.map(p => column(p, theme)).join("\n");

// The reference board (materials/README.md, items 4, 5, 6, 10, 11, 12, 13, 16). 5 and 6 print their values, so the
// printed recipe is drawn in plain CSS beside Area's Button in Tactile; the rest show Area plus a material only.
const board = `
<div class="board">
  <figure class="bitem"><figcaption><b>5</b> Light "Reject" button. Printed: fill #E3E3E3 80%, stroke #FDFDFD → #F1F1F1 0%, shadows 0 2 4 10% and a 1px 16% ring.</figcaption>
    <div class="pair"><div class="cell cell--light"><span class="tag">Printed recipe</span><button type="button" class="raw raw5" tabindex="-1">Reject</button></div>
    <div class="cell area-scope" data-area-theme="light" data-area-material="tactile" data-preset="tactile"><span class="tag">Area + Tactile</span>${btn("soft", "Reject")}</div></div></figure>
  <figure class="bitem"><figcaption><b>6</b> Dark "Button Label". Printed: #1D1F23 under white 15% → 0, top stroke 15% 1.5px, shadows 0 4 7 20% and a 1.5px black ring, label shadow 0 4 4 40%.</figcaption>
    <div class="pair"><div class="cell cell--dark"><span class="tag">Printed recipe</span><button type="button" class="raw raw6" tabindex="-1">Button Label</button></div>
    <div class="cell area-scope" data-area-theme="dark" data-area-material="tactile" data-preset="tactile" style="--m-label:1"><span class="tag">Area + Tactile, label relief on</span>${btn("soft", "Button Label")}</div></div></figure>
  <figure class="bitem"><figcaption><b>10, 11</b> Dark segmented control and settings toggles: recessed tracks, raised glossy thumbs, grain.</figcaption>
    <div class="cell area-scope scene" data-area-theme="dark" data-area-material="tactile" data-preset="tactile"><div class="row">${segmented("b10")}</div><div class="row">${switchOn("b11")}${switchOff("b11")}</div></div></figure>
  <figure class="bitem"><figcaption><b>4</b> Blue action on a dark page with an outer glow (Tactile, glow raised to 1).</figcaption>
    <div class="cell area-scope scene" data-area-theme="dark" data-area-material="tactile" data-preset="tactile" style="--m-glow:1"><div class="row">${btn("solid", "Add to calendar", true)}${btn("soft", "Later")}</div></div></figure>
  <figure class="bitem"><figcaption><b>12, 13</b> Glass menu and frosted card over a picture.</figcaption>
    <div class="cell area-scope scene scene--photo" data-area-theme="light" data-area-material="glass" data-preset="glass"><div class="row row--top">${menu("b12")}${card("b13")}</div></div></figure>
  <figure class="bitem"><figcaption><b>16</b> Glossy "jelly" action in a light tray (Tactile, gloss raised to 0.6, success tone).</figcaption>
    <div class="cell area-scope scene" data-area-theme="light" data-area-material="tactile" data-preset="tactile" style="--m-gloss:0.6"><div class="row"><span data-area-action="accent" data-area-accent="green" style="display:contents">${btn("solid", "Continue")}</span></div></div></figure>
</div>`;

mkdirSync(out, { recursive: true });
const page = readFileSync(here + "template.html", "utf8")
  .replace("/*MATERIALS_CSS*/", css)
  .replace("<!--COLUMNS_LIGHT-->", columns("light"))
  .replace("<!--COLUMNS_DARK-->", columns("dark"))
  .replace("<!--BOARD-->", board);
writeFileSync(out + "/index.html", page);
copyFileSync(repo + "packages/styles/dist/area.css", out + "/area.css");
console.log("ok", page.length);
