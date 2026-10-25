// The review page for Area figures (2026-10-24, round 5: a gallery in the screens' style): node build.mjs →
// page/index.html + page/area.css. Every figure comes from the skill (renderFigures: Area's real components and the
// app's demos rendered to markup, drawn by engine/abstract.css and staged by engine/stage.js).
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { AREA_CSS, DEFAULTS, assets, renderFigures } from "../../../.claude/skills/area-illustration/build.mjs";

const HERE = import.meta.dirname;
const OUT = join(HERE, "page");
mkdirSync(OUT, { recursive: true });
copyFileSync(AREA_CSS, join(OUT, "area.css"));

const figures = await renderFigures();
if (figures.errors.length) throw new Error(figures.errors.join("\n"));
const { css, js } = assets();
const safe = (s) => s.replace(/<\//g, "<\\/");
writeFileSync(join(OUT, "index.html"), readFileSync(join(HERE, "page.html"), "utf8")
  .replace("/*FIGURE_CSS*/", () => css)
  .replace("/*FIGURE_JS*/", () => js)
  .replace("/*FIGURES*/", () => safe(JSON.stringify(figures)))
  .replace("/*DEFAULTS*/", () => JSON.stringify(DEFAULTS)));
console.log(join(OUT, "index.html"));
