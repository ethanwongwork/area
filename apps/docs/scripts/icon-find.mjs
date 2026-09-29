#!/usr/bin/env node
// Does Area already have an icon for this? Search before drawing: names (with turns and
// mirrors), demo labels (the concept each icon stands for), the Fluent cut it is compared
// with, its construction line in docs/specs/icons.md, batch notes, and the planned and
// dropped concepts in docs/research/icon-inventory.md.
//   node apps/docs/scripts/icon-find.mjs brain            # one concept
//   node apps/docs/scripts/icon-find.mjs "paper plane" agent send
//   node apps/docs/scripts/icon-find.mjs --missing concepts.txt   # which of a list have no icon
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url)), ROOT = join(HERE, "../../..");
const PILOT = join(HERE, "../assets/area-icons-pilot");
const read = p => existsSync(p) ? readFileSync(p, "utf8") : "";

// Every icon, its derived turns and mirrors, and what it is known by.
const icons = new Map();
const add = (name, from) => { if (!icons.has(name)) icons.set(name, { name, from, label: "", fluent: "", spec: "", batch: "", status: "" }); return icons.get(name); };
for (const file of readdirSync(PILOT).filter(f => f.endsWith(".svg"))) {
  const name = file.slice(0, -4), svg = read(join(PILOT, file));
  add(name);
  for (const spec of (svg.match(/data-rotations="([^"]*)"/)?.[1] ?? "").split(/\s+/).filter(Boolean)) add(spec.split(":")[0], name);
}
const labels = read(join(ROOT, "apps/docs/src/demos/icons.tsx")).split("const REF_NAMES")[0];
for (const [, name, label] of labels.matchAll(/"([a-z0-9-]+)": "([^"]+)"/g)) if (icons.has(name)) icons.get(name).label = label;
const camel = n => n.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const gen = read(join(HERE, "gen-icons.mjs"));
for (const icon of icons.values()) icon.fluent = gen.match(new RegExp(`FluentRef${camel(icon.name)}Icon: "([a-z0-9_]+)"`))?.[1]?.replace(/_\d+_regular$/, "") ?? "";
const spec = read(join(ROOT, "docs/specs/icons.md"));
for (const [, name, text] of spec.matchAll(/^\| ([a-z0-9-]+) \| (.+) \|$/gm)) if (icons.has(name)) icons.get(name).spec = text;  // the latest row wins
for (const batch of JSON.parse(read(join(PILOT, "batches.json"))).batches)
  for (const [name, status] of Object.entries(batch.icons)) if (icons.has(name)) Object.assign(icons.get(name), { batch: batch.title, status, note: batch.note });
// Planned and dropped concepts: rows of the inventory's tables whose status is not "exists".
const inventory = read(join(ROOT, "docs/research/icon-inventory.md"));
const planned = [...inventory.matchAll(/^\| ([a-z0-9-]+) \| ([^|]+) \| ([^|]+) \| ([^|]*) \| ([^|]*) \|/gm)].map(([, concept, plan, what, refs, uses]) => ({ concept, plan: plan.trim(), what: what.trim(), refs: refs.trim(), uses: uses.trim() }));

const words = q => q.toLowerCase().split(/[\s_-]+/).filter(Boolean);
function find(query) {
  const q = words(query), phrase = q.join("-");
  const score = icon => {
    const name = icon.name, label = icon.label.toLowerCase(), fluent = icon.fluent.replaceAll("_", "-");
    if (name === phrase) return [100, "name"];
    if (q.every(w => name.split("-").includes(w))) return [80, "name"];
    if (label && q.every(w => words(label).includes(w))) return [70, `label "${icon.label}"`];
    if (fluent && q.every(w => fluent.split("-").includes(w))) return [60, `Fluent ${icon.fluent}`];
    if (q.every(w => name.includes(w))) return [50, "name"];
    if (icon.spec && q.every(w => icon.spec.toLowerCase().includes(w))) return [30, "construction"];
    return [0];
  };
  const hits = [...icons.values()].map(icon => [icon, ...score(icon)]).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1] || a[0].name.localeCompare(b[0].name)).slice(0, 8);
  const plans = planned.filter(p => q.every(w => `${p.concept} ${p.what} ${p.refs} ${p.uses}`.toLowerCase().includes(w))).slice(0, 5);
  return { hits, plans };
}

const args = process.argv.slice(2);
if (!args.length) { console.log("usage: icon-find.mjs <concept> [<concept> …] | --missing list.txt"); process.exit(1); }
if (args[0] === "--missing") {
  const list = read(args[1]).split("\n").map(s => s.trim()).filter(Boolean);
  for (const concept of list) { const { hits, plans } = find(concept); if (!hits.length || hits[0][1] < 60) console.log(`${concept}${plans.length ? `  (planned: ${plans.map(p => `${p.concept} — ${p.plan}`).join("; ")})` : ""}`); }
  process.exit(0);
}
for (const query of args) {
  const { hits, plans } = find(query);
  console.log(`\n${query}`);
  if (!hits.length && !plans.length) console.log("  nothing yet — check Lucide and Fluent for references, then add it to docs/research/icon-inventory.md");
  for (const [icon, , why] of hits) console.log(`  ${icon.name.padEnd(22)} ${(icon.status || (icon.from ? "turn of " + icon.from : "unrecorded")).padEnd(10)} ${why}${icon.label && !why.startsWith("label") ? ` · "${icon.label}"` : ""}`);
  for (const p of plans) console.log(`  planned: ${p.concept.padEnd(13)} ${p.plan} · ${p.what}${p.refs && p.refs !== "—" ? ` · ${p.refs}` : ""}${p.uses && p.uses !== "—" ? ` · for ${p.uses}` : ""}`);
}
