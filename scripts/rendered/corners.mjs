// check:rendered:corners — runs check:rendered at each named corner of corners.json, one after another (never side by
// side: parallel captures starve the machine), light and dark, and prints one line per corner.
//
//   npm run check:rendered:corners                    every corner, every family (about 5 minutes a corner, idle machine)
//   npm run check:rendered:corners -- --fast          every corner, the fast family subset (about 1 minute a corner)
//   npm run check:rendered:corners -- --only a,b      only these corners
//   npm run check:rendered:corners -- --skip defaults leave these corners out (CI runs the defaults in full on its own)
//   … -- --reuse | --verbose | --seed-known | --prune-known   passed to each corner's check
//
// Exits 1 when any corner fails. A corner's report is in its capture folder (.cache/rendered/corners/<id>[-fast]).
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { check } from "./check.mjs";
import { readCorners } from "./settings.mjs";

const argv = process.argv.slice(2);
const pass = { reuse: false, verbose: false, seed: false, prune: false };
let only = null, skip = [], fast = false;
for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (arg === "--fast") fast = true;
  else if (arg === "--only") only = argv[++i].split(",");
  else if (arg === "--skip") skip = argv[++i].split(",");
  else if (arg === "--reuse") pass.reuse = true;
  else if (arg === "--verbose") pass.verbose = true;
  else if (arg === "--seed-known") pass.seed = true;
  else if (arg === "--prune-known") pass.prune = true;
  else throw new Error(`Unknown option ${arg}`);
}

const { corners } = readCorners();
const unknown = [...(only ?? []), ...skip].filter(id => !corners.some(c => c.id === id));
if (unknown.length) throw new Error(`No corner ${unknown.join(", ")} in corners.json (corners: ${corners.map(c => c.id).join(", ")})`);
const chosen = corners.filter(c => (!only || only.includes(c.id)) && !skip.includes(c.id));

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const started = Date.now();
  const summary = [];
  let failed = false;
  console.log(`${chosen.length} corners${fast ? ", fast subset" : ", every family"}, one at a time: ${chosen.map(c => c.id).join(", ")}`);
  for (const corner of chosen) {
    const t0 = Date.now();
    console.log(`\n== ${corner.id}: ${corner.about}`);
    try {
      const result = await check({ ...pass, update: [], rules: [], set: {}, families: [], corner: corner.id, fast });
      console.log(result.lines.join("\n"));
      const counts = result.report.rules.filter(r => r.violations !== undefined);
      const fresh = counts.reduce((n, r) => n + r.new.length, 0), fixed = counts.reduce((n, r) => n + r.fixedButListed.length, 0);
      const skipped = result.report.rules.filter(r => r.skipped).map(r => r.id);
      summary.push(`${result.failed ? "✗" : "✓"} ${corner.id}: ${result.report.families} families, ${fresh} new, ${fixed} listed but fixed${skipped.length ? `, skipped ${skipped.join(" ")}` : ""} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
      if (result.failed) failed = true;
    } catch (error) {
      failed = true;
      summary.push(`✗ ${corner.id}: ${error.message.split("\n")[0]}`);
      console.log(`  error: ${error.message}`);
    }
  }
  console.log(`\n${summary.join("\n")}\n${chosen.length} corners in ${((Date.now() - started) / 60000).toFixed(1)} min`);
  process.exit(failed ? 1 : 0);
}
