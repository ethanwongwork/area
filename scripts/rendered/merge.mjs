// Joins each family's light and dark measures into <out>/<slug>/measure.json (the light tree, every node and text with
// the dark theme's colours matched by position in the tree) and writes <out>/index.json (every family's slug, name,
// kind, status, tiles, files and layout; `notCaptured` lists documented families this capture holds no measures for).
//   node scripts/rendered/merge.mjs [--out <dir>]
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { OUT } from "./capture.mjs";
import { DOCUMENTATION_GROUPS } from "../../apps/desktop/src/content/documentation.mjs";
import { componentStatus, statusLabel } from "../../apps/desktop/src/content/component-status.mjs";

export const kindOf = slug => Object.keys(DOCUMENTATION_GROUPS).find(kind => slug in DOCUMENTATION_GROUPS[kind]) ?? "other";

/** The dark colours of `dark` on `light`, matched by position; resolves to the number of nodes that did not match. */
function joinDark(light, dark) {
  let missed = 0;
  const byId = new Map(dark.tiles.map(tile => [tile.id, tile]));
  for (const tile of light.tiles) {
    const other = byId.get(tile.id);
    if (!other || !tile.nodes) { missed += tile.nodes?.length ?? 0; continue; }
    tile.nodes.forEach((node, i) => {
      const twin = other.nodes?.[i];
      if (!twin || twin.tag !== node.tag || twin.cls !== node.cls) { missed++; return; }
      node.dark = { color: twin.color, bg: twin.bg, border: twin.border.map(side => side[2]), shadow: twin.shadow };
    });
    (tile.texts ?? []).forEach((text, i) => { const twin = other.texts?.[i]; if (twin && twin.node === text.node) text.darkColor = twin.color; });
  }
  return missed;
}

export function merge(out = join(OUT, "capture")) {
  const families = [];
  for (const slug of readdirSync(out).sort()) {
    const dir = join(out, slug);
    if (!statSync(dir).isDirectory()) continue;
    const read = theme => existsSync(join(dir, `${theme}.json`)) ? JSON.parse(readFileSync(join(dir, `${theme}.json`), "utf8")) : null;
    const light = read("light"), dark = read("dark");
    const base = light ?? dark;
    if (!base) continue;
    let darkMismatchedNodes;
    if (light && dark) {
      darkMismatchedNodes = joinDark(light, dark);
      light.darkEdges = dark.edges;
    }
    const measure = { ...base, themes: [light && "light", dark && "dark"].filter(Boolean), ...(darkMismatchedNodes !== undefined ? { darkMismatchedNodes } : {}) };
    writeFileSync(join(dir, "measure.json"), JSON.stringify(measure));
    const status = componentStatus(slug);
    families.push({
      slug, name: base.name, kind: kindOf(slug), status: statusLabel(status),
      tiles: base.tiles.map(tile => ({ id: tile.id, label: tile.label, group: tile.group })),
      files: readdirSync(dir).filter(file => !file.startsWith(".")).sort(),
      layout: base.layout ?? {}, settings: base.settings ?? {}, darkMismatchedNodes,
    });
  }
  const pages = Object.values(DOCUMENTATION_GROUPS).flatMap(group => Object.keys(group));
  const rendered = new Set(families.map(family => family.slug));
  const index = {
    families, tiles: families.reduce((sum, family) => sum + family.tiles.length, 0),
    notCaptured: pages.filter(slug => !rendered.has(slug)),
  };
  writeFileSync(join(out, "index.json"), JSON.stringify(index, null, 1));
  return index;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const at = process.argv.indexOf("--out");
  const out = at > 0 ? resolve(process.argv[at + 1]) : join(OUT, "capture");
  const index = merge(out);
  console.log(`${index.families.length} families, ${index.tiles} tiles → ${join(out, "index.json")}${index.notCaptured.length ? `; not captured: ${index.notCaptured.length} families` : ""}`);
}
