#!/usr/bin/env node
// Record a batch of Area icons in every place the review needs, from one JSON file:
// batches.json (the gallery's review groups and owner status), the batch's construction
// section in docs/specs/icons.md, the demo label and Fluent comparison plate
// (apps/desktop/src/content/demos/icons.tsx, scripts/gen-icons.mjs), then regenerate the icon modules.
//   node apps/docs/scripts/icon-batch.mjs batch.json            # record (idempotent)
//   node apps/docs/scripts/icon-batch.mjs batch.json --review a,b  # set changed icons back to review
//   node apps/docs/scripts/icon-batch.mjs --fluent contact_card    # resolve a Fluent stem
// batch.json:
//   { "id": "batch-44", "title": "Batch 44 · Topic", "date": "2026-09-28",
//     "note": "One paragraph for the gallery.",
//     "icons": [{ "name": "id-card", "label": "Profile card", "fluent": "contact_card",
//                 "spec": "Construction line for the spec table." }],
//     "extra": "Optional paragraph after the table (dropped ideas and why)." }
// fluent: a Fluent icon stem (contact_card), or a sized stem (contact_card_20), or "" for none;
// the 16px cut is preferred, then 20, 24, 28, 32 and 48, with its filled twin.
// New icons are marked "review"; icons already in the batch keep their status unless named
// with --review (the owner marks approvals; a changed icon goes back to review).
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url)), ROOT = join(HERE, "../../..");
const PILOT = join(HERE, "../assets/area-icons-pilot");
const FLUENT = join(dirname(createRequire(import.meta.url).resolve("@fluentui/svg-icons/package.json")), "icons");
const SIZES = [16, 20, 24, 28, 32, 48];

/** The first Fluent cut that exists for a stem, as [regular, filled] ids, or null. */
export function resolveFluent(stem) {
  if (!stem) return null;
  const base = stem.replace(/_(regular|filled)$/, ""), sized = base.match(/_(\d+)$/);
  const candidates = sized ? [base] : SIZES.map(size => `${base}_${size}`);
  for (const id of candidates) if (existsSync(join(FLUENT, `${id}_regular.svg`)) && existsSync(join(FLUENT, `${id}_filled.svg`))) return [`${id}_regular`, `${id}_filled`];
  return null;
}

const args = process.argv.slice(2);
if (args[0] === "--fluent") {
  const r = resolveFluent(args[1]);
  console.log(r ? r.join("  ") : `no Fluent cut for "${args[1]}"; try: ls node_modules/@fluentui/svg-icons/icons | grep ${args[1]}`);
  process.exit(r ? 0 : 1);
}
if (!args[0] || !existsSync(args[0])) { console.log("usage: icon-batch.mjs batch.json [--review name,name] | --fluent stem"); process.exit(1); }
const batch = JSON.parse(readFileSync(args[0], "utf8"));
const review = new Set((args[args.indexOf("--review") + 1] ?? "").split(",").filter(Boolean));
const problems = [];
if (!/^batch-\d+$/.test(batch.id ?? "")) problems.push(`id must look like batch-44, not ${batch.id}`);
for (const key of ["title", "date", "note"]) if (!batch[key]) problems.push(`missing "${key}"`);
for (const icon of batch.icons ?? []) {
  if (!existsSync(join(PILOT, `${icon.name}.svg`))) problems.push(`${icon.name}: no source at assets/area-icons-pilot/${icon.name}.svg`);
  if (!icon.label) problems.push(`${icon.name}: missing "label" (the demo's concept name)`);
  if (!icon.spec) problems.push(`${icon.name}: missing "spec" (its construction line)`);
  if (icon.fluent && !resolveFluent(icon.fluent)) problems.push(`${icon.name}: no Fluent cut for "${icon.fluent}"`);
}
if (problems.length) { console.error(problems.map(p => "✗ " + p).join("\n")); process.exit(1); }

// batches.json: the gallery's review groups.
const batchesPath = join(PILOT, "batches.json"), all = JSON.parse(readFileSync(batchesPath, "utf8"));
const before = all.batches.find(b => b.id === batch.id)?.icons ?? {};
const entry = { id: batch.id, title: batch.title, note: batch.note, icons: Object.fromEntries(batch.icons.map(i => [i.name, review.has(i.name) ? "review" : before[i.name] ?? "review"])) };
const at = all.batches.findIndex(b => b.id === batch.id);
if (at >= 0) all.batches[at] = entry; else all.batches.push(entry);
writeFileSync(batchesPath, JSON.stringify(all, null, 2) + "\n");

// The spec: one section per batch, replaced in place when re-recorded.
const specPath = join(ROOT, "docs/specs/icons.md"); let spec = readFileSync(specPath, "utf8");
const heading = `## ${batch.title.replace(" · ", ": ")}, ${batch.date}`;
const section = `${heading}\n\n| Icon | Construction |\n|---|---|\n${batch.icons.map(i => `| ${i.name} | ${i.spec} |`).join("\n")}\n${batch.extra ? `\n${batch.extra}\n` : ""}`;
const start = spec.indexOf(heading);
if (start >= 0) { const next = spec.indexOf("\n## ", start + heading.length); spec = spec.slice(0, start) + section + (next >= 0 ? spec.slice(next) : ""); }
else spec = spec.trimEnd() + "\n\n" + section;
writeFileSync(specPath, spec);

// Demo labels and the Fluent comparison plates.
const demosPath = join(ROOT, "apps/desktop/src/content/demos/icons.tsx"); let demos = readFileSync(demosPath, "utf8");
const labelsStart = demos.indexOf("const LABELS"), labelsEnd = demos.indexOf("\n};", labelsStart);
const labels = demos.slice(labelsStart, labelsEnd);
const newLabels = batch.icons.filter(i => !labels.includes(`"${i.name}": `)).map(i => `"${i.name}": ${JSON.stringify(i.label)}`);
if (newLabels.length) demos = demos.slice(0, labelsEnd) + `\n  ${newLabels.join(", ")},` + demos.slice(labelsEnd);
const refs = demos.match(/const REF_NAMES = \[([^\]]*)\];/);
const known = new Set([...refs[1].matchAll(/"([^"]+)"/g)].map(m => m[1]));
const newRefs = batch.icons.filter(i => i.fluent && !known.has(i.name)).map(i => `"${i.name}"`);
if (newRefs.length) demos = demos.replace(refs[0], `const REF_NAMES = [${refs[1]}, ${newRefs.join(", ")}];`);
writeFileSync(demosPath, demos);

const genPath = join(HERE, "gen-icons.mjs"); let gen = readFileSync(genPath, "utf8");
const marker = "  // icon-batch.mjs adds Fluent references for new batches above this line.\n";
if (!gen.includes(marker)) { console.error("✗ gen-icons.mjs lost its icon-batch marker line"); process.exit(1); }
const camel = n => n.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const newMap = batch.icons.filter(i => i.fluent && !gen.includes(`FluentRef${camel(i.name)}Icon:`)).map(i => {
  const [regular, filled] = resolveFluent(i.fluent);
  return `  FluentRef${camel(i.name)}Icon: "${regular}",\n  FluentRef${camel(i.name)}FilledIcon: "${filled}",\n`;
});
if (newMap.length) gen = gen.replace(marker, newMap.join("") + marker);
writeFileSync(genPath, gen);

console.log(`recorded ${batch.id}: ${batch.icons.length} icons (${Object.values(entry.icons).filter(s => s === "review").length} in review), ${newLabels.length} labels, ${newRefs.length} Fluent plates`);
execFileSync("node", [join(HERE, "gen-icons.mjs")], { stdio: "inherit" });
execFileSync("node", [join(HERE, "gen-pilot-icons.mjs"), "--only", batch.icons.map(i => i.name).join(",")], { stdio: "inherit" });
console.log(`next: npm run icons:pilot (full lint + generate), then review on gallery-icons.html or
  node apps/docs/scripts/icon-sheet.mjs compare out.png ${batch.id}`);
