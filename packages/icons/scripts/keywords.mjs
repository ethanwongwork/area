#!/usr/bin/env node
// Search keywords and other libraries' names for every Area icon (production gap 4, docs/specs/icons.md
// "Keywords and names"). Writes sources/keywords.json, which generate.mjs reads into
// @area/icons/meta. Run after `refs.mjs fetch` (Lucide, Phosphor and Material Symbols metadata in the
// ignored cache) and `npm run generate -w @area/icons` (the icon list):
//   node packages/icons/scripts/keywords.mjs
// Names: the reference map's counterparts (docs/research/icon-audit/area-map.json, the icons each drawing was
// compared with), else the library's icon of the same name, or of the name with a word swapped for the library's
// ($words in keywords-area.json: person-search → Lucide's user-search). Material Symbols has no counterpart map:
// its name is the first of the Area, Fluent or Lucide names it publishes. Keywords: the counterparts' Lucide and
// Phosphor tags and their names' words, the concept the component demos label it with, the name with its words
// swapped, plus Area's own (keywords-area.json, for drawings no library has and words a library misses). A tag
// that is another icon's name, in Area or any library, is dropped ("redo" on undo, "target" on add), and so is
// one already in the icon's own name or in keywords-area.json's $drop.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url)), ROOT = join(HERE, "../../..");
const PILOT = join(HERE, "../sources"), REFS = join(HERE, "../.cache/refs");
const json = path => JSON.parse(readFileSync(path, "utf8"));
const version = dir => json(join(dir, "package.json")).version;

const META = join(ROOT, "packages/icons/src/generated/meta.ts");
const icons = JSON.parse(readFileSync(META, "utf8").match(/export const icons: readonly IconMeta\[\] = (\[[\s\S]*?\n\]);/)[1]);
const map = json(join(ROOT, "docs/research/icon-audit/area-map.json"));
const area = json(join(PILOT, "keywords-area.json"));

const LUCIDE = join(REFS, "lucide-static/package"), PHOSPHOR = join(REFS, "phosphor-icons-core/package");
const MATERIAL = join(REFS, "material-symbols-metadata/package");
const FLUENT = dirname(createRequire(import.meta.url).resolve("@fluentui/svg-icons/package.json"));
const lucide = json(join(LUCIDE, "tags.json"));
const phosphor = new Map((await import(join(PHOSPHOR, "dist/index.mjs"))).icons.map(icon => [icon.name, icon.tags]));
const material = new Set(Object.keys(json(join(MATERIAL, "versions.json"))));
const fluent = new Set(readdirSync(join(FLUENT, "icons")).map(file => file.replace(/_\d+_(regular|filled|light|color)\.svg$/, "")));

const NAMES = new Set(icons.map(icon => icon.name));
for (const name of Object.keys(area)) if (!NAMES.has(name) && !name.startsWith("$")) throw new Error(`keywords-area.json: ${name} is not an icon`);
const snake = name => name.replaceAll("-", "_");
const words = name => name.split(/[-_ ]+/);
// The name with each of its words swapped for another library's word (person-search → user-search).
const swaps = name => words(name).flatMap((word, i, all) => (area.$words[word] ?? []).map(other => [...all.slice(0, i), other, ...all.slice(i + 1)].join("-")));
// The concept each icon stands for in the component demos ("Find people" for person-search).
const LABELS = Object.fromEntries([...readFileSync(join(ROOT, "apps/desktop/src/content/demos/icons.tsx"), "utf8").split("const REF_NAMES")[0]
  .matchAll(/"([a-z0-9-]+)": "([^"]+)"/g)].map(([, name, label]) => [name, label.toLowerCase()]));

// Tags are lower case; Phosphor's release markers (*new*, *updated*) and emoji go; "cancel. unavailable" is two tags.
const clean = tags => tags.flatMap(tag => tag.toLowerCase().split(/\.\s+/)).map(tag => tag.trim())
  .filter(tag => tag && !/^\*.*\*$/.test(tag) && !/\p{Extended_Pictographic}/u.test(tag));

// Each icon's names in the other libraries, first, so a tag that is another icon's name in any library is known.
const namesOf = icon => {
  const ref = map[icon.name] ?? {};
  const swapped = swaps(icon.name);
  const names = {
    lucide: ref.lucide ?? [icon.name, ...swapped].find(name => lucide[name]),
    phosphor: ref.phosphor ?? [icon.name, ...swapped].find(name => phosphor.has(name)),
    fluent: ref.fluent ?? [icon.name, ...swapped].map(snake).find(name => fluent.has(name)),
  };
  names.material = [snake(icon.name), names.fluent, names.lucide && snake(names.lucide)].find(name => name && material.has(name));
  for (const key of Object.keys(names)) if (!names[key]) delete names[key];
  return { names, swapped };
};
const NAMED = new Map(icons.map(icon => [icon.name, namesOf(icon)]));
const KNOWN = new Map();  // a name in Area or any library → the Area icons it names
for (const icon of icons) for (const name of [icon.name, ...Object.values(NAMED.get(icon.name).names).map(n => n.replaceAll("_", "-"))])
  KNOWN.set(name, [...(KNOWN.get(name) ?? []), icon.name]);

const out = {};
let missing = [];
for (const icon of icons) {
  const { names, swapped } = NAMED.get(icon.name);
  const own = new Set(words(icon.name));
  const others = tag => { const of = KNOWN.get(tag) ?? []; return of.length > 0 && !of.includes(icon.name) && !of.includes(icon.aliasOf); };
  // Area's own words stay even when they name another icon (issue: bug); a library's tag that does is dropped.
  const hand = area[icon.name] ?? [];
  const found = [
    ...(LABELS[icon.name] && LABELS[icon.name] !== words(icon.name).join(" ") ? [LABELS[icon.name]] : []),
    ...swapped.map(name => name.replaceAll("-", " ")),
    ...Object.entries(names).filter(([, name]) => name.replaceAll("_", "-") !== icon.name).map(([, name]) => name.replaceAll(/[-_]/g, " ")),
    ...clean([...(names.lucide ? lucide[names.lucide] ?? [] : []), ...(names.phosphor ? phosphor.get(names.phosphor) ?? [] : [])]),
  ];
  const drop = new Set(area.$drop[icon.name] ?? []);
  const keywords = [...new Set([...hand, ...found.filter(tag => !others(tag.replaceAll(" ", "-")) && !drop.has(tag))])].filter(tag => !own.has(tag) && tag.replaceAll(" ", "-") !== icon.name);
  if (!keywords.length) missing.push(icon.name);
  out[icon.name] = { ...(Object.keys(names).length ? { names } : {}), keywords };
}
if (missing.length) { console.error(`no keywords for ${missing.length} icons (add them to keywords-area.json): ${missing.join(" ")}`); process.exit(1); }

writeFileSync(join(PILOT, "keywords.json"), JSON.stringify({
  $comment: "Generated by packages/icons/scripts/keywords.mjs. Do not edit by hand: Area's own words are in keywords-area.json. Record: docs/specs/icons.md, \"Keywords and names\".",
  sources: { lucide: `lucide-static@${version(LUCIDE)}`, phosphor: `@phosphor-icons/core@${version(PHOSPHOR)}`,
    fluent: `@fluentui/svg-icons@${version(FLUENT)}`, material: `@material-symbols/metadata@${version(MATERIAL)}` },
  icons: out,
}, null, 1) + "\n");
const count = key => Object.values(out).filter(entry => entry.names?.[key]).length;
console.log(`wrote keywords.json: ${icons.length} icons; names: lucide ${count("lucide")}, phosphor ${count("phosphor")}, fluent ${count("fluent")}, material ${count("material")}`);
