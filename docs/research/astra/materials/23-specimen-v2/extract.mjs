// Extracts the specimen's component markup from a built gallery (npm run build:docs), so the specimen renders Area's
// real server-rendered markup. node docs/research/astra/materials/23-specimen-v2/extract.mjs
import { readFileSync, writeFileSync } from "node:fs";
const here = new URL(".", import.meta.url).pathname;
const html = readFileSync(new URL("../../../../../apps/docs/dist/index.html", import.meta.url), "utf8");
function block(src, start, tag) {
  const re = new RegExp(`<${tag}[\\s>]|</${tag}>`, "g"); re.lastIndex = start + 1; let depth = 1, m;
  while ((m = re.exec(src))) { depth += m[0].startsWith("</") ? -1 : 1; if (!depth) return src.slice(start, m.index + m[0].length); }
  throw new Error("unbalanced " + tag);
}
const IDS = ["button-tone-neutral-variant-solid", "button-tone-neutral-variant-soft", "button-tone-neutral-variant-outline", "button-action-accent",
  "input-soft", "input-outline", "switch-default", "switch-checked", "segmented-default", "slider-default", "checkbox-selected",
  "card-default", "menu-default", "menu-selected", "nav-sidebar", "toast-neutral", "tabs-track", "progress-default", "badge-default", "toggle-group-default"];
const out = {};
for (const id of IDS) {
  const at = html.indexOf(`<article class="gallery-tile" id="gallery-${id}"`);
  if (at < 0) { console.warn("missing", id); continue; }
  const tile = block(html, at, "article"), s = tile.indexOf('<div class="gallery-tile__stage">'), stage = block(tile, s, "div");
  out[id] = stage.slice(stage.indexOf(">") + 1, -"</div>".length).replaceAll('"/images/', '"images/');
}
writeFileSync(here + "specimens.json", JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, "specimens");
