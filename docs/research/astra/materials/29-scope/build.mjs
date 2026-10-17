// Builds the Material scope page: which Area families take a material and how strongly, from platforms, libraries and
// historic styles, with one app screen painted two ways (scoped by the evidence, and every part at full strength).
//   node docs/research/astra/materials/27-levers/gen-levers.mjs
//   node docs/research/astra/materials/29-scope/build.mjs <out-dir>
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
const here = new URL(".", import.meta.url).pathname;
const repo = new URL("../../../../../", import.meta.url).pathname;
const out = process.argv[2];
if (!out) throw new Error("usage: node build.mjs <out-dir>");
const spec = JSON.parse(readFileSync(here + "../23-specimen-v2/specimens.json", "utf8"));
const layersSpec = JSON.parse(readFileSync(repo + "docs/research/layers-2026-10-16/page/specimens.json", "utf8"));
const families = JSON.parse(readFileSync(here + "families.json", "utf8"));
const css = readFileSync(here + "../27-levers/levers.css", "utf8");

const strip = html => html.replace(/^<div data-[a-z]+-demo="[^"]+" style="[^"]*">/, "").replace(/<\/div>$/, "");
const uniq = (html, key) => html.replaceAll(/(id|aria-labelledby|for)="([^"]+)"/g, (_, a, x) => `${a}="${x}-${key}"`).replaceAll('tabindex="0"', 'tabindex="-1"');
const btn = (variant, label, accent) => {
  const b = `<button type="button" tabindex="-1" class="area-button area-button--${variant} area-button--neutral area-button--md"><span class="area-button__label">${label}</span></button>`;
  return accent ? `<span data-area-action="accent" style="display:contents">${b}</span>` : b;
};
const input = (variant, ph) => `<div class="area-input area-input--${variant} area-input--md"><input class="area-input__control" placeholder="${ph}" aria-label="${ph}" tabindex="-1"/></div>`;
const badge = (tone, label) => `<span class="area-badge area-badge--solid area-badge--${tone} area-badge--md"><span class="area-badge__label">${label}</span></span>`;
const checkbox = (k, label, checked) => uniq(spec["checkbox-selected"], k).replace(' checked=""', checked ? ' checked=""' : "").replace(/>Label</, `>${label}<`).replace("<input ", '<input tabindex="-1" ');
const app = key => `<div class="app">
  <aside class="app__side" data-area-ground="recessed" data-lv-chrome><div class="app__brand">Area</div>
    <nav class="area-nav" aria-label="Pages" style="--area-nav-inline-size:100%"><a class="area-nav__item" aria-current="page" href="#" tabindex="-1"><span class="area-nav__text">Projects</span></a><a class="area-nav__item" href="#" tabindex="-1"><span class="area-nav__text">Reviews</span></a><a class="area-nav__item" href="#" tabindex="-1"><span class="area-nav__text">Team</span></a><a class="area-nav__item" href="#" tabindex="-1"><span class="area-nav__text">Settings</span></a></nav></aside>
  <header class="app__top" data-lv-chrome><div class="app__bar">${input("outline", "Search projects")}<span class="app__grow"></span>${btn("ghost", "Filter")}${btn("outline", "Share")}${btn("solid", "New project", true)}</div></header>
  <main class="app__main">
    <div class="app__grid">
      <div class="area-card area-card--vertical area-card--md"><div class="area-card__content"><div class="app__row"><h3 class="area-card__title">Launch plan</h3>${badge("success", "Live")}</div><div class="area-card__description">Owned by David Tee · due Friday</div>${spec["progress-default"]}<div class="area-card__footer">${btn("soft", "Open")}${btn("solid", "Publish")}</div></div></div>
      <div class="area-card area-card--vertical area-card--md"><div class="area-card__content"><h3 class="area-card__title">Settings</h3>${input("soft", "Project name")}
        <div class="app__row">${uniq(strip(spec["switch-checked"]).replace('class="area-switch__track"', 'class="area-switch__track" data-checked=""'), key + "s").replace("Label", "Notify")}${uniq(strip(spec["segmented-default"]), key + "g").replace("One", "Day").replace("Two", "Week")}</div>
        <div class="app__row">${checkbox(key + "c1", "Public", true)}${checkbox(key + "c2", "Archive", false)}</div>
        ${uniq(strip(spec["slider-default"]), key + "r")}</div></div>
    </div>
    ${layersSpec["table-default"]}
    <div class="app__float">${uniq(strip(spec["menu-selected"]).replace('aria-checked="true" class="area-menu__item"', 'aria-checked="true" class="area-menu__item" data-selected=""'), key + "m").replaceAll('type="button"', 'type="button" tabindex="-1"').replace("Label</span>", "Sort by</span>").replace("Option one", "Last edited").replace("Option two", "Created").replace("Option three", "Name")}</div>
    <div class="app__toast">${spec["toast-neutral"].replace("Body text", "Draft saved")}</div>
  </main></div>`;

const TIER = { carries: "Carries", echoes: "Echoes", overlay: "Overlay", chrome: "Chrome", none: "None" };
const order = ["carries", "echoes", "overlay", "chrome", "none"];
const tierTable = order.map(t => {
  const rows = families.filter(f => f[1] === t);
  return `<details class="tier tier--${t}"${t === "carries" ? " open" : ""}><summary><b>${TIER[t]}</b> <span>${rows.length} families</span></summary><div class="tbl"><table class="data"><thead><tr><th>Family</th><th>What takes the material</th><th>Evidence</th></tr></thead><tbody>${rows.map(([f, , what, ev]) => `<tr><td class="n">${f}</td><td>${what}</td><td class="ev">${ev}</td></tr>`).join("")}</tbody></table></div></details>`;
}).join("");

mkdirSync(out, { recursive: true });
const page = readFileSync(here + "template.html", "utf8")
  .replace("/*LEVERS_CSS*/", css)
  .replace("<!--APP_SCOPED-->", app("a")).replace("<!--APP_EVERY-->", app("b"))
  .replace("<!--TIERS-->", tierTable)
  .replace("<!--COUNTS-->", order.map(t => `<span class="count count--${t}"><b>${families.filter(f => f[1] === t).length}</b> ${TIER[t].toLowerCase()}</span>`).join(""));
writeFileSync(out + "/index.html", page);
copyFileSync(repo + "packages/styles/dist/area.css", out + "/area.css");
console.log("ok", page.length);
