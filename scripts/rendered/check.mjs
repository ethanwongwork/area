// check:rendered — renders the Components Overview at the shipped defaults, light and dark, measures every tile and
// asserts the rule tables in scripts/rendered/rules/*.mjs. Lengths are CSS px from the DOM (pixels only for the dark
// floating edge), never picture diffs.
//
//   npm run check:rendered                       capture (about 10 min) and check
//   npm run check:rendered -- --reuse            check the last capture again, no browser (seconds)
//   npm run check:rendered -- --update <rule>    rewrite that snapshot rule's snapshots/<rule>.json from this run
//   npm run check:rendered -- --prune-known      drop known failures that no longer fail (after a fix lands)
//   npm run check:rendered -- --rule <id>        check one rule only (repeatable)
//   npm run check:rendered -- --verbose          list every violation, not the first few
//
// Two kinds of rule. An assert rule lists violations; the ones in known-failures.json (each with the plan item that
// will fix it) are expected, so the check passes today, fails on any new violation, and fails when a listed one no
// longer fails (so the list shrinks as fixes land: remove the line, or run --prune-known). A snapshot rule records
// values today (header bar heights, marks, corners, the dark edge) in snapshots/<rule>.json and fails when any value
// changes; a deliberate change is accepted with --update <rule>.
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { capture, OUT } from "./capture.mjs";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const KNOWN = join(HERE, "known-failures.json");
const SNAPSHOTS = join(HERE, "snapshots");
const CAPTURE = join(OUT, "check");

function parse(argv) {
  const options = { reuse: false, update: [], prune: false, rules: [], verbose: false, out: CAPTURE };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--reuse") options.reuse = true;
    else if (arg === "--update") options.update.push(argv[++i]);
    else if (arg === "--prune-known") options.prune = true;
    else if (arg === "--seed-known") options.seed = true;
    else if (arg === "--rule") options.rules.push(argv[++i]);
    else if (arg === "--verbose") options.verbose = true;
    else if (arg === "--out") options.out = resolve(argv[++i]);
    else throw new Error(`Unknown option ${arg}`);
  }
  return options;
}

/** Every family's light and dark measures: [{ slug, name, light, dark }]. */
export function load(out) {
  const families = [];
  for (const slug of readdirSync(out).sort()) {
    const read = theme => { const file = join(out, slug, `${theme}.json`); return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null; };
    const light = read("light"), dark = read("dark");
    if (light || dark) families.push({ slug, name: (light ?? dark).name, light, dark });
  }
  return families;
}

export async function loadRules() {
  const rules = [];
  for (const file of readdirSync(join(HERE, "rules")).filter(name => name.endsWith(".mjs")).sort()) {
    const mod = await import(pathToFileURL(join(HERE, "rules", file)).href);
    for (const rule of mod.rules ?? []) rules.push({ ...rule, file });
  }
  return rules;
}

// known-failures.json keeps one entry per line, so a fix that lands is one deleted line.
function writeKnown(entries) {
  const lines = entries.map(entry => "  " + JSON.stringify(entry));
  writeFileSync(KNOWN, `{\n "about": "Violations of assert rules that fail today, each with the plan item and finding that will fix it. check:rendered fails on any violation not listed here and on any listed one that no longer fails. One entry per line.",\n "known": [\n${lines.join(",\n")}\n ]\n}\n`);
}
const readKnown = () => existsSync(KNOWN) ? JSON.parse(readFileSync(KNOWN, "utf8")).known : [];
const keyOf = v => [v.family, v.tile, v.theme, v.part].filter(x => x !== undefined && x !== "").join(" · ");

export async function check(options) {
  const started = Date.now();
  if (!options.reuse) {
    await capture({ theme: "both", set: {}, png: false, layout: "shipped", out: options.out, edges: false, cap: 700, slugs: [], dist: undefined, verbose: true },
      line => process.stderr.write(`${line}\n`));
  }
  const families = load(options.out);
  const rules = (await loadRules()).filter(rule => !options.rules.length || options.rules.includes(rule.id));
  let known = readKnown();
  const report = { ms: 0, families: families.length, tiles: families.reduce((n, f) => n + (f.light?.tiles.length ?? 0), 0), rules: [] };
  let failed = false;
  const lines = [];
  for (const rule of rules) {
    const result = rule.run(families);
    const entry = { id: rule.id, item: rule.item, expectedToday: rule.expectedToday, kind: rule.kind, title: rule.title };
    if (rule.kind === "snapshot") {
      const file = join(SNAPSHOTS, `${rule.id}.json`);
      const values = result.values;
      entry.count = Object.keys(values).length;
      entry.summary = result.summary;
      if (options.update.includes(rule.id) || !existsSync(file)) {
        mkdirSync(SNAPSHOTS, { recursive: true });
        writeFileSync(file, JSON.stringify({ rule: rule.id, item: rule.item, about: rule.title, values }, null, 1) + "\n");
        entry.written = true;
        lines.push(`  ${rule.id} (${rule.item}): snapshot written, ${entry.count} values`);
      } else {
        const before = JSON.parse(readFileSync(file, "utf8")).values;
        const changed = [];
        for (const key of new Set([...Object.keys(before), ...Object.keys(values)])) {
          if (JSON.stringify(before[key]) !== JSON.stringify(values[key])) changed.push({ key, was: before[key], now: values[key] });
        }
        entry.changed = changed;
        if (changed.length) failed = true;
        lines.push(`${changed.length ? "✗" : "✓"} ${rule.id} (${rule.item}, snapshot): ${entry.count} values${changed.length ? `, ${changed.length} changed` : ", unchanged"}${result.summary ? ` — ${result.summary}` : ""}`);
        for (const c of changed.slice(0, options.verbose ? Infinity : 8)) lines.push(`    ${c.key}: ${JSON.stringify(c.was)} → ${JSON.stringify(c.now)}`);
        if (changed.length) lines.push(`    a deliberate change: npm run check:rendered -- --reuse --update ${rule.id}`);
      }
    } else {
      // One violation per key (two identical parts in one tile are one finding).
      const violations = [...new Map(result.violations.map(v => [keyOf(v), { ...v, key: keyOf(v) }])).values()];
      const listed = known.filter(k => k.rule === rule.id);
      const listedKeys = new Set(listed.map(k => k.key));
      const now = new Set(violations.map(v => v.key));
      const fresh = violations.filter(v => !listedKeys.has(v.key));
      const fixed = listed.filter(k => !now.has(k.key));
      Object.assign(entry, { checked: result.checked, violations: violations.length, known: violations.length - fresh.length, new: fresh, fixedButListed: fixed.map(k => k.key), summary: result.summary, all: violations });
      if (options.prune && fixed.length) { known = known.filter(k => !(k.rule === rule.id && !now.has(k.key))); entry.pruned = fixed.length; }
      const bad = fresh.length || (fixed.length && !options.prune);
      if (bad) failed = true;
      lines.push(`${bad ? "✗" : "✓"} ${rule.id} (${rule.item}): ${result.checked} checked, ${violations.length} violations (${violations.length - fresh.length} known, ${fresh.length} new)${fixed.length ? `, ${fixed.length} listed but fixed${options.prune ? " (pruned)" : ""}` : ""}${result.summary ? ` — ${result.summary}` : ""}`);
      for (const v of fresh.slice(0, options.verbose ? Infinity : 8)) lines.push(`    new: ${v.key}: ${v.detail ?? JSON.stringify(v.value)}`);
      for (const k of fixed.slice(0, options.verbose ? Infinity : 8)) lines.push(`    fixed, remove from known-failures.json: ${k.key}`);
    }
    report.rules.push(entry);
  }
  // --seed-known (once, when a rule is added): every current violation becomes known, with the plan item and finding
  // the rule attributes to it.
  if (options.seed) {
    known = [];
    for (const entry of report.rules) for (const v of entry.all ?? []) {
      const rule = rules.find(r => r.id === entry.id);
      known.push({ rule: entry.id, key: v.key, ...(rule.attribute?.(v) ?? { item: "?", finding: "?" }) });
    }
    writeKnown(known);
  } else if (options.prune) writeKnown(known);
  report.ms = Date.now() - started;
  report.failed = failed;
  mkdirSync(options.out, { recursive: true });
  writeFileSync(join(options.out, "report.json"), JSON.stringify(report, null, 1));
  return { failed, lines, report };
}

export { writeKnown, readKnown };

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = parse(process.argv.slice(2));
  const { failed, lines, report } = await check(options);
  console.log(lines.join("\n"));
  console.log(`${report.families} families, ${report.tiles} tiles, ${(report.ms / 1000).toFixed(1)} s; report: ${join(options.out, "report.json")}`);
  process.exit(failed ? 1 : 0);
}
