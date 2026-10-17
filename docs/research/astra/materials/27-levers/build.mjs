// Builds the Material levers page: every lever separately, a live editor with bundles, and each lever alone at 0, 4
// and 8. Research only.
//   node docs/research/astra/materials/27-levers/gen-levers.mjs
//   node docs/research/astra/materials/27-levers/build.mjs <out-dir>
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
const here = new URL(".", import.meta.url).pathname;
const repo = new URL("../../../../../", import.meta.url).pathname;
const out = process.argv[2];
if (!out) throw new Error("usage: node build.mjs <out-dir>");
const spec = JSON.parse(readFileSync(here + "../23-specimen-v2/specimens.json", "utf8"));
const css = readFileSync(here + "levers.css", "utf8");

const strip = html => html.replace(/^<div data-[a-z]+-demo="[^"]+" style="[^"]*">/, "").replace(/<\/div>$/, "");
const uniq = (html, key) => html.replaceAll(/(id|aria-labelledby)="([^"]+)"/g, (_, a, x) => `${a}="${x}-${key}"`).replaceAll('tabindex="0"', 'tabindex="-1"');
const switchOn = k => uniq(strip(spec["switch-checked"]).replace('class="area-switch__track"', 'class="area-switch__track" data-checked=""'), k + "on").replace("Label", "Sync");
const switchOff = k => uniq(strip(spec["switch-default"]), k + "off").replace("Label", "Notify");
const segmented = k => uniq(strip(spec["segmented-default"]), k).replace("One", "Day").replace("Two", "Week");
const slider = k => uniq(strip(spec["slider-default"]), k);
const menu = k => uniq(strip(spec["menu-selected"]).replace('aria-checked="true" class="area-menu__item"', 'aria-checked="true" class="area-menu__item" data-selected=""'), k)
  .replaceAll('type="button"', 'type="button" tabindex="-1"').replace("Label</span>", "Sort by</span>").replace("Option one", "Last edited").replace("Option two", "Created").replace("Option three", "Name");
const toast = spec["toast-neutral"].replace("Body text", "Draft saved");
const btn = (variant, label, action) => {
  const b = `<button type="button" tabindex="-1" class="area-button area-button--${variant} area-button--neutral area-button--md"><span class="area-button__label">${label}</span></button>`;
  return action ? `<span data-area-action="accent" style="display:contents">${b}</span>` : b;
};
const input = (variant, ph) => `<div class="area-input area-input--${variant} area-input--md"><input class="area-input__control" placeholder="${ph}" aria-label="${ph}" tabindex="-1"/></div>`;
const card = `<div class="area-card area-card--vertical area-card--md"><div class="area-card__content"><h3 class="area-card__title">Launch plan</h3><div class="area-card__description">Owned by David Tee</div>${input("soft", "Add a note")}<div class="area-card__footer">${btn("outline", "Later")}${btn("solid", "Share", true)}</div></div></div>`;

const scene = (theme, key) => `<div class="scene area-scope" data-area-theme="${theme}" data-lv data-live>
  <div class="scene__grid">
    <div class="stack">${card}<div class="row">${btn("solid", "Save")}${btn("soft", "Edit")}${btn("outline", "Cancel")}</div>
      <div class="row">${input("outline", "Search")}</div>
      <div class="row">${switchOn(key)}${switchOff(key)}${segmented(key)}</div>
      <div class="row row--fill">${slider(key)}</div>
    </div>
    <div class="stack">${menu(key)}${toast}</div>
  </div></div>`;

// Each lever alone: what it adds, at 0, 4 and 8, on the parts it applies to by default.
const ALONE = [
  ["gradient", "Gradient fill (linear)", "--lv-gradient", "", "Tone-on-tone: the part's own Layers tone, lighter toward the light and darker away from it."],
  ["radial", "Gradient fill (radial)", "--lv-gradient", "--lv-gradient-radial:1;", "The same, as a highlight centred toward the light."],
  ["accent", "Gradient tinted by accent", "--lv-gradient", "--lv-gradient-accent:1;", "The lit end takes the accent (D5: decorative colour comes from accent and tones)."],
  ["sheen", "Sheen (soft)", "--lv-sheen", "", "A specular wash on the lit half."],
  ["band", "Sheen (band)", "--lv-sheen", "--lv-sheen-band:1;", "A hard-edged gloss band to the midline, as Aqua."],
  ["transparency", "Transparency", "--lv-transparency", "--lv-transparency-surfaces:1;", "Card and menu fills become see-through, never below the reading floor. Over a picture."],
  ["frost", "Frost", "--lv-frost", "--lv-transparency:8;--lv-frost-surfaces:1;--lv-transparency-surfaces:1;", "Backdrop blur behind see-through parts (shown at transparency 8). Over a picture."],
  ["lit", "Stroke: lit edge", "--lv-stroke", "--lv-stroke-lit:1;", "A 1px highlight on the edge facing the light."],
  ["gstroke", "Stroke: gradient", "--lv-stroke", "--lv-stroke-gradient:1;", "The frame itself, lit toward the light and shaded away."],
  ["double", "Stroke: double rim", "--lv-stroke", "--lv-stroke-double:1;", "An outer ring and an inner light rim (bevel)."],
  ["away", "Gradient (radial, away from the light)", "--lv-gradient", "--lv-gradient-radial:1;--lv-gradient-away:1;--lv-gradient-accent:1;", "A glow rising from the far side, as Aero's bottom glow."],
  ["tone", "Stroke: tone ring", "--lv-stroke", "--lv-stroke-solid:1;", "A ring in the part's own colour, darker (references 1, 2, 4)."],
  ["neutral", "Stroke: neutral ring", "--lv-stroke", "--lv-stroke-solid:1;--lv-stroke-neutral:1;", "A black ring at an alpha (the board's dark button)."],
  ["inner", "Inner shadow (crisp)", "--lv-inner", "", "Controls bulge (lit edge in, shade out); wells sink (shade toward the light)."],
  ["catch", "Catch-light", "--lv-catch", "", "A bright inner edge away from the light: light through a jelly, or the lip of a bowl (references 4, 5, 6)."],
  ["innersoft", "Inner shadow (soft)", "--lv-inner", "--lv-softness:8;", "The same with softness 8."],
  ["emboss", "Emboss", "--lv-emboss", "", "An outer light and dark pair: the part rises from the ground (neumorphism). Best on a gray ground."],
  ["contact", "Contact shadow", "--lv-contact", "", "A small shadow under raised controls; 4 is the board's annotated button."],
  ["glow", "Glow", "--lv-glow", "", "Accent light from solid actions and on-states."],
];
const mini = (k, theme) => `<div class="row">${btn("solid", "Save", true)}${btn("soft", "Edit")}</div><div class="row">${input("outline", "Search")}</div><div class="row">${switchOn(k)}${segmented(k)}</div>`;
const alone = ALONE.map(([id, name, prop, extra, note]) => {
  const photo = id === "transparency" || id === "frost";
  const soft = id === "emboss" ? ' data-area-ground-light="95" data-area-layers-light="0"' : "";
  const content = k => photo ? `<div class="mini-card">${card}</div>` : mini(k, "light");
  return `<figure class="lever"><figcaption><b>${name}</b><span>${note}</span></figcaption><div class="steps">${[0, 4, 8].map(n =>
    `<div class="step"><span class="tag">${n}</span><div class="scene scene--mini area-scope${photo ? " scene--photo" : ""}" data-area-theme="light" data-lv${soft} style="${prop}:${n};${extra}">${content(id + n)}</div></div>`).join("")}</div></figure>`;
}).join("\n");

mkdirSync(out, { recursive: true });
const page = readFileSync(here + "template.html", "utf8")
  .replace("/*LEVERS_CSS*/", css)
  .replace("<!--SCENE_LIGHT-->", scene("light", "l"))
  .replace("<!--SCENE_DARK-->", scene("dark", "d"))
  .replace("<!--ALONE-->", alone);
writeFileSync(out + "/index.html", page);
copyFileSync(repo + "packages/styles/dist/area.css", out + "/area.css");
console.log("ok", page.length);
