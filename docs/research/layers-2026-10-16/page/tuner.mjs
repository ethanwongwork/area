// Builds the Layers tuner: one light and one dark scene in Area's own CSS, every layer tone a live OKLCH lightness.
import { readFileSync, writeFileSync } from "node:fs";
const here = new URL(".", import.meta.url).pathname;
const spec = JSON.parse(readFileSync(here + "specimens.json", "utf8"));

const nav = `<nav class="area-nav" aria-label="Pages" style="--area-nav-inline-size:100%"><a class="area-nav__item" aria-current="page" href="#"><span class="area-nav__text">Home</span></a><a class="area-nav__item" href="#"><span class="area-nav__text">Library</span></a><a class="area-nav__item scene__hover" href="#"><span class="area-nav__text">Projects</span></a><a class="area-nav__item" href="#"><span class="area-nav__text">Settings</span></a></nav>`;
const card = `<div class="area-card area-card--vertical area-card--md"><div class="area-card__content"><h3 class="area-card__title">Launch plan</h3><div class="area-card__description">Draft for the design review</div><div class="area-input area-input--soft area-input--md"><input class="area-input__control" placeholder="Add a note" aria-label="Note" tabindex="-1"/></div><div class="area-card__footer"><button type="button" tabindex="-1" class="area-button area-button--solid area-button--neutral area-button--md"><span class="area-button__label">Share</span></button></div></div></div>`;
const scene = theme => `<div class="scene area-scope" data-area-theme="${theme}" id="scene-${theme}">
  <aside class="scene__side"><div class="scene__brand">Area</div>${nav}</aside>
  <main class="scene__main"><div class="scene__bar"><div class="area-input area-input--soft area-input--md"><input class="area-input__control" placeholder="Search" aria-label="Search" tabindex="-1"/></div></div>
    <div class="scene__row"><div class="scene__raised">${card}</div><div class="scene__raised scene__menu">${spec["menu-default"].replaceAll('type="button"', 'type="button" tabindex="-1"')}</div></div>
    <div class="scene__table">${spec["table-default"]}</div></main></div>`;

const page = readFileSync(here + "tuner-template.html", "utf8")
  .replace("<!--SCENE_LIGHT-->", scene("light"))
  .replace("<!--SCENE_DARK-->", scene("dark"));
writeFileSync(here + "index.html", page);
console.log("ok", page.length);
