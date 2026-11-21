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
//   npm run check:rendered -- --set type=16 --set density=36   at other settings (registry ids and values; an unknown
//                                                one fails before the browser opens)
//   npm run check:rendered -- --corner <id>      a named corner of corners.json (its settings and its baseline)
//   npm run check:rendered -- --families a,b,c   only these families; --fast for corners.json's fast subset
//   npm run check:rendered:corners               every corner, one after another (corners.mjs)
//
// At settings other than the defaults the snapshot rules are skipped (they record the defaults' lengths, which a setting
// is meant to move) and the assert rules, which are invariants, run against that corner's own baseline:
// known-failures/<corner id>.json (an unnamed set of settings gets an id from its pairs). The defaults keep
// known-failures.json and snapshots/. On a family subset only those families' known failures and per-family snapshot
// values are compared.
//
// Two kinds of rule. An assert rule lists violations; the ones in known-failures.json (each with the plan item that
// will fix it) are expected, so the check passes today, fails on any new violation, and fails when a listed one no
// longer fails (so the list shrinks as fixes land: remove the line, or run --prune-known). A snapshot rule records
// values today (header bar heights, marks, corners, the dark edge) in snapshots/<rule>.json and fails when any value
// changes; a deliberate change is accepted with --update <rule>.
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { capture, OUT } from "./capture.mjs";
import { describe, idOf, moved, readCorners, validateSet } from "./settings.mjs";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const CAPTURE = join(OUT, "check");

// Baselines per platform. Text metrics differ between the platforms' font stacks (macOS rounds a face's ascent and
// descent differently from Linux, and the ink ascent of "H" comes from each rasteriser), so the same build measures a
// quarter pixel apart on the CI runner (run 44583214909: cap centring offsets -0.25 on Linux in tiles that are exact on
// macOS). macOS, where the owner judges the app, keeps the baselines at the top of scripts/rendered/; another platform
// keeps its own under platforms/<platform>/, with the same layout. The rules and their tolerances are the same
// everywhere. AREA_RENDERED_PLATFORM overrides the platform's name.
export const HOME_PLATFORM = "darwin";
export const PLATFORM = process.env.AREA_RENDERED_PLATFORM || process.platform;
export const baselineRoot = (platform = PLATFORM) => platform === HOME_PLATFORM ? HERE : join(HERE, "platforms", platform);
const KNOWN = join(baselineRoot(), "known-failures.json");
const KNOWN_DIR = join(baselineRoot(), "known-failures");
const SNAPSHOTS = join(baselineRoot(), "snapshots");
const HOME = { known: join(HERE, "known-failures.json"), knownDir: join(HERE, "known-failures"), snapshots: join(HERE, "snapshots") };
// Where a run on a platform with no baseline yet writes the one it would record (uploaded by CI), never into the tree.
const PROPOSED = "proposed-baseline";

function parse(argv) {
  const options = { reuse: false, update: [], prune: false, rules: [], verbose: false, out: undefined, set: {}, families: [], corner: undefined, fast: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--reuse") options.reuse = true;
    else if (arg === "--update") options.update.push(argv[++i]);
    else if (arg === "--prune-known") options.prune = true;
    else if (arg === "--seed-known") options.seed = true;
    else if (arg === "--rule") options.rules.push(argv[++i]);
    else if (arg === "--verbose") options.verbose = true;
    else if (arg === "--out") options.out = resolve(argv[++i]);
    else if (arg === "--set") { const pair = argv[++i] ?? ""; const at = pair.indexOf("="); options.set[at < 0 ? pair : pair.slice(0, at)] = at < 0 ? undefined : pair.slice(at + 1); }
    else if (arg === "--families") options.families.push(...(argv[++i] ?? "").split(",").map(slug => slug.trim()).filter(Boolean));
    else if (arg === "--fast") options.fast = true;
    else if (arg === "--corner") options.corner = argv[++i];
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
const ABOUT = "Violations of assert rules that fail today, each with the plan item and finding that will fix it. check:rendered fails on any violation not listed here and on any listed one that no longer fails. One entry per line.";
function writeKnown(entries, file = KNOWN, about = ABOUT, extra = {}) {
  const lines = entries.map(entry => "  " + JSON.stringify(entry));
  mkdirSync(join(file, ".."), { recursive: true });
  const head = Object.entries(extra).map(([k, v]) => `\n ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join("");
  writeFileSync(file, `{\n "about": ${JSON.stringify(about)},${head}\n "known": [\n${lines.join(",\n")}\n ]\n}\n`);
}
const readKnown = (file = KNOWN) => existsSync(file) ? JSON.parse(readFileSync(file, "utf8")).known : [];
const familyOfKey = key => key.split(" · ")[0];

/**
 * What a run is: its settings (a --corner's, or --set's), whether they are the defaults, its baseline file and its
 * capture folder. Validates the settings and the corner name.
 */
export async function resolveRun(options) {
  const { corners, fast } = readCorners();
  let set = { ...options.set };
  let corner;
  if (options.corner) {
    corner = corners.find(c => c.id === options.corner);
    if (!corner) throw new Error(`No corner ${options.corner} in corners.json (corners: ${corners.map(c => c.id).join(", ")})`);
    set = { ...corner.set, ...set };
  }
  await validateSet(set);
  const changed = await moved(set);
  const defaults = Object.keys(changed).length === 0;
  // A set of settings equal to a named corner's is that corner, so its baseline is found however it was asked for.
  const same = (a, b) => JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());
  if (!corner && !defaults) corner = corners.find(c => same(c.set, changed));
  const id = defaults ? "defaults" : corner?.id ?? idOf(changed);
  const families = [...options.families, ...(options.fast ? fast : [])];
  const subset = families.length > 0;
  const out = options.out ?? (defaults && !subset ? CAPTURE : join(OUT, "corners", `${id}${subset ? (options.fast && !options.families.length ? "-fast" : "-subset") : ""}`));
  const known = defaults ? KNOWN : join(KNOWN_DIR, `${id}.json`);
  const homeKnown = defaults ? HOME.known : join(HOME.knownDir, `${id}.json`);
  return { set, changed, defaults, id, families: [...new Set(families)], subset, out, known, homeKnown, about: corner?.about };
}
const keyOf = v => [v.family, v.tile, v.theme, v.part].filter(x => x !== undefined && x !== "").join(" · ");

export async function check(options) {
  const started = Date.now();
  const run = await resolveRun(options);
  options.out = run.out;
  const lines = [];
  lines.push(`settings: ${run.defaults ? "defaults" : `${run.id} (${describe(run.changed)})`}${run.subset ? `; families: ${run.families.join(", ")}` : ""}; baseline: ${run.known.slice(HERE.length)}`);
  if (!options.reuse) {
    process.stderr.write(`capturing ${run.subset ? `${run.families.length} families` : "every family"} at ${run.defaults ? "the defaults" : describe(run.changed)} → ${run.out}\n`);
    await capture({ theme: "both", set: run.set, png: false, layout: "shipped", out: run.out, edges: false, cap: 700, slugs: run.families, strict: true, dist: undefined, verbose: true },
      line => process.stderr.write(`${line}\n`));
  }
  let families = load(run.out);
  if (run.subset) families = families.filter(family => run.families.includes(family.slug));
  if (!families.length) throw new Error(`No captured families in ${run.out}${options.reuse ? " (run without --reuse first)" : ""}`);
  // Never a pass with a family missing: every family checked was captured in both themes.
  const half = families.filter(family => !family.light || !family.dark);
  if (half.length) throw new Error(`Not captured in both themes: ${half.map(family => `${family.slug} (${family.light ? "no dark" : "no light"})`).join(", ")}`);
  if (run.subset) { const absent = run.families.filter(slug => !families.some(family => family.slug === slug)); if (absent.length) throw new Error(`Not captured: ${absent.join(", ")}`); }
  // A capture made at other settings than asked for (a --reuse of the wrong folder) would check the wrong baseline.
  const capturedAt = families[0].light?.settings ?? families[0].dark?.settings ?? {};
  const at = await moved(capturedAt);
  const sortedPairs = set => JSON.stringify(Object.entries(set).sort());
  if (sortedPairs(at) !== sortedPairs(run.changed)) throw new Error(`${run.out} was captured at ${describe(at)}, not ${describe(run.changed)}`);
  const slugs = new Set(families.map(family => family.slug));
  const rules = (await loadRules()).filter(rule => !options.rules.length || options.rules.includes(rule.id));
  const knownFile = run.known;
  // A platform with no baseline for this run yet is compared with macOS's (so the run shows exactly how the platform
  // differs) and fails; the baseline it would record is written under <out>/proposed-baseline for review.
  const unrecorded = PLATFORM !== HOME_PLATFORM && !options.seed && !existsSync(knownFile);
  const proposedDir = join(run.out, PROPOSED);
  rmSync(proposedDir, { recursive: true, force: true });
  const proposedPath = file => join(proposedDir, relative(HERE, file));
  let known = readKnown(unrecorded ? run.homeKnown : knownFile);
  const report = { ms: 0, platform: PLATFORM, browser: families[0].light?.browser ?? families[0].dark?.browser, settings: run.changed, corner: run.id, baseline: knownFile, unrecorded: [], families: families.length, tiles: families.reduce((n, f) => n + (f.light?.tiles.length ?? 0), 0), rules: [] };
  if (unrecorded) {
    report.unrecorded.push(relative(HERE, knownFile));
    lines.push(`✗ no ${PLATFORM} baseline at ${relative(HERE, knownFile)}: compared with macOS's ${relative(HERE, run.homeKnown)}; the baseline this run would record is in ${proposedPath(knownFile)}`);
  }
  let failed = unrecorded;
  for (const rule of rules) {
    const entry = { id: rule.id, item: rule.item, expectedToday: rule.expectedToday, kind: rule.kind, title: rule.title };
    if (rule.kind === "snapshot" && !run.defaults) {
      entry.skipped = "settings";
      lines.push(`- ${rule.id} (${rule.item}, snapshot): skipped, it records the defaults' values and these settings are meant to move them`);
      report.rules.push(entry);
      continue;
    }
    if (rule.kind === "snapshot" && run.subset && !rule.perFamily) {
      entry.skipped = "subset";
      lines.push(`- ${rule.id} (${rule.item}, snapshot): skipped on a family subset (one table across every family)`);
      report.rules.push(entry);
      continue;
    }
    const result = rule.run(families);
    if (rule.kind === "snapshot") {
      let file = join(SNAPSHOTS, `${rule.id}.json`);
      const values = result.values;
      entry.count = Object.keys(values).length;
      entry.summary = result.summary;
      if (run.subset && options.update.includes(rule.id)) throw new Error(`--update ${rule.id} needs a run over every family`);
      // No snapshot on this platform yet: propose this run's, fail, and compare with macOS's.
      if (PLATFORM !== HOME_PLATFORM && !existsSync(file) && !options.update.includes(rule.id)) {
        const proposed = proposedPath(file);
        mkdirSync(join(proposed, ".."), { recursive: true });
        writeFileSync(proposed, JSON.stringify({ rule: rule.id, item: rule.item, about: rule.title, values }, null, 1) + "\n");
        entry.unrecorded = proposed;
        report.unrecorded.push(relative(HERE, file));
        failed = true;
        lines.push(`✗ ${rule.id} (${rule.item}, snapshot): no ${PLATFORM} snapshot at ${relative(HERE, file)}; this run's is in ${proposed}`);
        file = join(HOME.snapshots, `${rule.id}.json`);
        if (!existsSync(file)) { report.rules.push(entry); continue; }
      }
      if (options.update.includes(rule.id) || !existsSync(file)) {
        mkdirSync(SNAPSHOTS, { recursive: true });
        writeFileSync(file, JSON.stringify({ rule: rule.id, item: rule.item, about: rule.title, values }, null, 1) + "\n");
        entry.written = true;
        lines.push(`  ${rule.id} (${rule.item}): snapshot written, ${entry.count} values`);
      } else {
        const before = JSON.parse(readFileSync(file, "utf8")).values;
        const changed = [];
        const inRun = key => !run.subset || slugs.has(familyOfKey(key));
        for (const key of new Set([...Object.keys(before), ...Object.keys(values)].filter(inRun))) {
          if (JSON.stringify(before[key]) !== JSON.stringify(values[key])) changed.push({ key, was: before[key], now: values[key] });
        }
        entry.changed = changed;
        if (changed.length) failed = true;
        lines.push(`${changed.length ? "✗" : "✓"} ${rule.id} (${rule.item}, snapshot${entry.unrecorded ? ", against macOS" : ""}): ${entry.count} values${changed.length ? `, ${changed.length} changed` : ", unchanged"}${result.summary ? ` — ${result.summary}` : ""}`);
        for (const c of changed.slice(0, options.verbose ? Infinity : 8)) lines.push(`    ${c.key}: ${JSON.stringify(c.was)} → ${JSON.stringify(c.now)}`);
        if (changed.length) lines.push(`    a deliberate change: npm run check:rendered -- --reuse --update ${rule.id}`);
      }
    } else {
      // One violation per key (two identical parts in one tile are one finding).
      const violations = [...new Map(result.violations.map(v => [keyOf(v), { ...v, key: keyOf(v) }])).values()];
      const listed = known.filter(k => k.rule === rule.id && slugs.has(familyOfKey(k.key)));
      const listedKeys = new Set(listed.map(k => k.key));
      const now = new Set(violations.map(v => v.key));
      const fresh = violations.filter(v => !listedKeys.has(v.key));
      const fixed = listed.filter(k => !now.has(k.key));
      Object.assign(entry, { checked: result.checked, violations: violations.length, known: violations.length - fresh.length, new: fresh, fixedButListed: fixed.map(k => k.key), summary: result.summary, all: violations });
      if (options.prune && fixed.length) { const gone = new Set(fixed.map(k => k.key)); known = known.filter(k => !(k.rule === rule.id && gone.has(k.key))); entry.pruned = fixed.length; }
      const bad = fresh.length || (fixed.length && !options.prune);
      if (bad) failed = true;
      lines.push(`${bad ? "✗" : "✓"} ${rule.id} (${rule.item}${run.defaults ? "" : ", invariant"}${unrecorded ? ", against macOS" : ""}): ${result.checked} checked, ${violations.length} violations (${violations.length - fresh.length} known, ${fresh.length} new)${fixed.length ? `, ${fixed.length} listed but fixed${options.prune ? " (pruned)" : ""}` : ""}${result.summary ? ` — ${result.summary}` : ""}`);
      for (const v of fresh.slice(0, options.verbose ? Infinity : 8)) lines.push(`    new: ${v.key}: ${v.detail ?? JSON.stringify(v.value)}`);
      for (const k of fixed.slice(0, options.verbose ? Infinity : 8)) lines.push(`    fixed, remove from ${relative(HERE, unrecorded ? run.homeKnown : knownFile)}: ${k.key}`);
    }
    report.rules.push(entry);
  }
  // --seed-known (once, when a rule is added): every current violation becomes known, with the plan item and finding
  // the rule attributes to it.
  // On a family subset (or one rule) the entries of the families (rules) not in the run are kept as they were.
  // A corner's baseline is a new file: a seed there is how a corner is first recorded, after reading every violation.
  const write = entries => run.defaults ? writeKnown(entries, knownFile)
    : writeKnown(entries, knownFile, `Violations of assert rules at the ${run.id} corner (${describe(run.changed)}) that fail today: the baseline check:rendered compares against at these settings, as known-failures.json is at the defaults. Each entry's note says whether it is a component defect or a rule still to be scaled.`, { settings: run.changed });
  if (options.seed) {
    const checkedRules = new Set(report.rules.filter(entry => entry.all).map(entry => entry.id));
    // An entry already listed keeps its note; one the defaults list too (the same cause at other settings) starts from
    // the defaults' entry, noted as such.
    const old = new Map(known.map(k => [`${k.rule}|${k.key}`, k]));
    const atDefaults = new Map(run.defaults ? [] : readKnown(KNOWN).map(k => [`${k.rule}|${k.key}`, k]));
    known = known.filter(k => !(checkedRules.has(k.rule) && slugs.has(familyOfKey(k.key))));
    for (const entry of report.rules) for (const v of entry.all ?? []) {
      const rule = rules.find(r => r.id === entry.id);
      const id = `${entry.id}|${v.key}`;
      const base = atDefaults.get(id);
      known.push(old.get(id) ?? (base ? { ...base, value: v.detail ?? v.value, note: `also at the defaults: ${base.note ?? ""}` }
        : { rule: entry.id, key: v.key, ...(rule.attribute?.(v) ?? { item: "?", finding: "?" }), value: v.detail ?? v.value, note: "NEW at this corner: read it and say whether it is a component defect (with its plan item) or a rule to scale" }));
    }
    write(known);
  } else if (options.prune) write(known);
  // The baseline an unrecorded platform would start from: every violation of this run, each keeping macOS's entry
  // (plan item, finding, note) where macOS lists the same key, else marked new on this platform to be read.
  if (unrecorded) {
    const home = new Map(readKnown(run.homeKnown).map(k => [`${k.rule}|${k.key}`, k]));
    const entries = [];
    for (const entry of report.rules) for (const v of entry.all ?? []) {
      const rule = rules.find(r => r.id === entry.id);
      const base = home.get(`${entry.id}|${v.key}`);
      entries.push(base ? { ...base, value: v.detail ?? v.value }
        : { rule: entry.id, key: v.key, ...(rule.attribute?.(v) ?? { item: "?", finding: "?" }), value: v.detail ?? v.value, note: `NEW on ${PLATFORM}: not listed on macOS; read it and say whether it is a component defect or a platform difference in text metrics` });
    }
    writeKnown(entries, proposedPath(knownFile), `Violations of assert rules on ${PLATFORM} (${report.browser ?? "the browser"}) at ${run.defaults ? "the defaults" : `the ${run.id} corner (${describe(run.changed)})`} that fail today, proposed by a run with no ${PLATFORM} baseline. Read each before committing it to ${relative(HERE, knownFile)}.`, run.defaults ? {} : { settings: run.changed });
    report.proposed = proposedDir;
  }
  report.ms = Date.now() - started;
  report.failed = failed;
  mkdirSync(run.out, { recursive: true });
  writeFileSync(join(run.out, "report.json"), JSON.stringify(report, null, 1));
  return { failed, lines, report };
}

export { writeKnown, readKnown };

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let result;
  const options = parse(process.argv.slice(2));
  try { result = await check(options); } catch (error) { console.error(`check:rendered: ${error.message}`); process.exit(2); }
  const { failed, lines, report } = result;
  console.log(lines.join("\n"));
  console.log(`${report.families} families, ${report.tiles} tiles, ${(report.ms / 1000).toFixed(1)} s; report: ${join(options.out, "report.json")}`);
  process.exit(failed ? 1 : 0);
}
