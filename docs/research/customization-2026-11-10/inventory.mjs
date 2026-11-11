// Inventory of every axis: what it sets, what derives from it, which component families read it.
// Run from the repo root after `npm run build`: node docs/research/customization-2026-11-10/inventory.mjs
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { AXES, SETTING_GROUPS, SCOPED_SETTINGS } from "../../../packages/tokens/src/axes/registry.ts";

const root = new URL("../../../", import.meta.url).pathname;
const tokensCss = readFileSync(root + "packages/tokens/dist/css/tokens.css", "utf8") + readFileSync(root + "packages/tokens/dist/css/axes.css", "utf8");
const baseCss = readFileSync(root + "packages/styles/src/base.css", "utf8");

// property -> set of properties its value reads (from the emitted token CSS and base.css)
const reads = new Map();
for (const css of [tokensCss, baseCss]) {
  for (const m of css.matchAll(/(--area-[a-z0-9-]+)\s*:\s*([^;{}]+)[;}]/g)) {
    const deps = [...m[2].matchAll(/var\((--area-[a-z0-9-]+)/g)].map(d => d[1]);
    if (!reads.has(m[1])) reads.set(m[1], new Set());
    for (const d of deps) reads.get(m[1]).add(d);
  }
}
// invert: property -> properties that read it
const readers = new Map();
for (const [p, ds] of reads) for (const d of ds) { if (!readers.has(d)) readers.set(d, new Set()); readers.get(d).add(p); }
const closure = (seeds) => { const out = new Set(seeds); const q = [...seeds]; while (q.length) { const p = q.pop(); for (const r of readers.get(p) ?? []) if (!out.has(r)) { out.add(r); q.push(r); } } return out; };

const dir = root + "packages/styles/src/components/";
const families = readdirSync(dir).filter(f => f.endsWith(".css")).map(f => ({ id: f.replace(".css", ""), vars: new Set([...readFileSync(dir + f, "utf8").matchAll(/var\((--area-[a-z0-9-]+)/g)].map(m => m[1])) }));
const global = new Set([...baseCss.matchAll(/var\((--area-[a-z0-9-]+)/g)].map(m => m[1]));

const heading = new Map(); for (const g of SETTING_GROUPS) for (const s of g.settings) heading.set(s, g.heading);
const rows = AXES.map(a => {
  const own = new Set(a.presets.flatMap(p => [...Object.keys(p.tokens), ...Object.keys(p.darkTokens ?? {})]));
  const all = closure(own);
  const direct = families.filter(f => [...own].some(t => f.vars.has(t))).map(f => f.id);
  const reach = families.filter(f => [...all].some(t => f.vars.has(t))).map(f => f.id);
  return { id: a.id, label: a.label, heading: heading.get(a.id) ?? "(none)", description: a.description, presets: a.presets.length, presetIds: a.presets.map(p => p.id), def: a.defaultPreset,
    tokens: own.size, derived: all.size - own.size, direct, reach: reach.length, reachList: reach, base: [...all].some(t => global.has(t)), darkSplit: a.presets.some(p => p.darkTokens) };
});
writeFileSync(new URL("./inventory.json", import.meta.url), JSON.stringify({ families: families.length, rows, scoped: SCOPED_SETTINGS }, null, 1));
console.log(`axes ${rows.length}, families ${families.length}, presets ${rows.reduce((n, r) => n + r.presets, 0)}`);
for (const r of rows) console.log([r.heading, r.id, r.label, r.presets, `def ${r.def}`, `tok ${r.tokens}+${r.derived}`, `direct ${r.direct.length}`, `reach ${r.reach}`, r.reach <= 8 ? r.reachList.join(",") : ""].join(" | "));
