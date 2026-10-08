// Data for the icon review page, round 7 (2026-10-07): every Area icon in the icon browser's
// categories (outline and filled, large and at 16 / 24 / 32), the drawing as it was before this pass for
// the icons it changed, the spec's one-line description of each change, the owner's last note from the
// earlier rounds, and the new-icon candidates (candidates.json) with Lucide, Phosphor, Material Symbols
// and Fluent references. From the repository root, after `npm run icons:pilot` and
// `node apps/docs/scripts/icon-refs.mjs fetch` (Material Symbols: `npm pack @material-symbols/svg-400`
// unpacked into apps/docs/.cache/refs/material-symbols-svg-400):
//   node docs/research/icon-review/2026-10-07/review-data.mjs out/data.js [notes.json]
// notes.json: the earlier rounds' decisions, { name: [{ round, verdict, notes, library }] } (ArtifactData).
import { build } from "esbuild"; import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process"; import { createRequire } from "node:module"; import { dirname, join } from "node:path";
const [out, notesPath] = process.argv.slice(2);
const root = process.cwd(), cache = root + "/apps/docs/.cache", HERE = "docs/research/icon-review/2026-10-07";
const BEFORE = cache + "/before-2026-10-07.tsx";
writeFileSync(cache + "/rv7.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server";
import { PILOT_ICONS as A } from "../src/pilot-icons.tsx"; import { PILOT_ICONS as B } from "${BEFORE}"; import { ICON_CATEGORIES } from "../src/icon-categories.ts";
const r = (C, p) => renderToStaticMarkup(h(C, { weight: 1.125, ...p })).replace(/ aria-hidden="true"| focusable="false"/g, "");
const draw = p => ({ o: r(p.Icon, { width: 16, height: 16 }), f: r(p.Filled, { width: 16, height: 16 }),
  os: [16, 24, 32].map(s => r(p.Icon, { size: s })), fs: [16, 24, 32].map(s => r(p.Filled, { size: s })) });
export const cats = ICON_CATEGORIES.map(c => ({ name: c.name, icons: c.icons }));
export const draws = name => { const a = A.find(p => p.name === name); return a && !a.derivedFrom ? { fill: a.fill, ...draw(a) } : null; };
export const before = name => { const b = B.find(p => p.name === name); return b ? draw(b) : null; };`);
await build({ entryPoints: [cache + "/rv7.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/rv7.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { cats, draws, before } = await import(cache + "/rv7.out.mjs?" + Date.now());

// Changed this pass: the sources that differ from the branch's base.
const changed = new Set(execFileSync("git", ["diff", "--name-only", "origin/main", "--", "apps/docs/assets/area-icons-pilot/"], { encoding: "utf8" })
  .split("\n").map(f => f.match(/area-icons-pilot\/([a-z0-9-]+)\.svg$/)?.[1]).filter(Boolean));

// The spec's description of each change ("Quality and consistency pass, 2026-10-07" tables).
const spec = readFileSync("docs/specs/icons.md", "utf8"), sec = spec.slice(spec.indexOf("## Quality and consistency pass, 2026-10-07"));
const change = {};
for (const line of sec.split("\n")) {
  const cells = line.match(/^\| (.+) \|$/)?.[1].split(" | "); if (!cells || cells.length < 2 || /^-+$|^name$/.test(cells[0])) continue;
  const names = cells[0].split(", "); let stem = names[0].split("-")[0];
  const text = cells.length === 3 ? `${cells[1]}: ${cells[2]}` : cells[1];
  for (const n of names) { const name = n.startsWith("-") ? stem + n : n; change[name] = change[name] ? change[name] + " · " + text : text; }
}

// The owner's last note on each icon from the earlier rounds.
const prior = {};
if (notesPath && existsSync(notesPath)) for (const [name, rows] of Object.entries(JSON.parse(readFileSync(notesPath, "utf8")))) {
  const last = [...rows].reverse().find(r => r.notes || r.note || (r.verdict && r.verdict !== "approve")); if (!last) continue;
  prior[name] = { round: last.round, verdict: last.verdict, library: last.library ?? null, notes: last.notes ?? last.note ?? "" };
}

// Reference readers (Lucide, Phosphor, Material Symbols, Fluent).
const read = p => existsSync(p) ? readFileSync(p, "utf8").replace(/<!--[\s\S]*?-->/g, "").replace(/<\?xml[^>]*>/, "").trim() : "";
const FLUENT = join(dirname(createRequire(import.meta.url).resolve("@fluentui/svg-icons/package.json")), "icons"), REFS = "apps/docs/.cache/refs";
const lib = {
  lucide: n => ({ o: read(join(REFS, "lucide-static/package/icons", n + ".svg")) }),
  phosphor: n => ({ o: read(join(REFS, "phosphor-icons-core/package/assets/regular", n + ".svg")), f: read(join(REFS, "phosphor-icons-core/package/assets/fill", n + "-fill.svg")) }),
  material: n => ({ o: read(join(REFS, "material-symbols-svg-400/package/outlined", n + ".svg")).replace("<svg ", '<svg fill="currentColor" '), f: read(join(REFS, "material-symbols-svg-400/package/outlined", n + "-fill.svg")).replace("<svg ", '<svg fill="currentColor" ') }),
  fluent: n => { for (const s of [16, 20, 24]) { const o = read(join(FLUENT, `${n}_${s}_regular.svg`)); if (o) return { o: o.replace("<svg ", '<svg fill="currentColor" '), f: read(join(FLUENT, `${n}_${s}_filled.svg`)).replace("<svg ", '<svg fill="currentColor" ') }; } return { o: "" }; },
};
// References for each icon (Fluent, Lucide, Phosphor), as the earlier rounds showed them.
const map = JSON.parse(readFileSync("docs/research/icon-audit/area-map.json", "utf8"));
const iconRefs = name => { const m = map[name] ?? {}, refs = {};
  if (m.fluent) { const r = lib.fluent(m.fluent); if (r.o) refs.Fluent = { name: m.fluent, ...r }; }
  if (m.lucide) { const r = lib.lucide(m.lucide); if (r.o) refs.Lucide = { name: m.lucide, ...r }; }
  if (m.phosphor) { const r = lib.phosphor(m.phosphor); if (r.o) refs.Phosphor = { name: m.phosphor, ...r }; }
  return refs; };
const ICONS = [], seen = new Set();
for (const c of cats) for (const name of c.icons) {
  if (seen.has(name)) continue; const d = draws(name); if (!d) continue; seen.add(name);
  const row = { name, group: c.name, ...d, refs: iconRefs(name) };
  if (changed.has(name)) { row.changed = true; row.change = change[name] ?? ""; const b = before(name); if (b) row.before = b; }
  if (prior[name]) row.prior = prior[name];
  ICONS.push(row);
}

const CANDIDATES = JSON.parse(readFileSync(HERE + "/candidates.json", "utf8")).map(c => {
  const refs = {};
  for (const [k, n] of Object.entries(c.refs)) { const r = lib[k](n); if (!r.o) { console.error(`missing ${k} ${n} for ${c.name}`); continue; } refs[k] = { name: n, ...r }; }
  return { ...c, refs };
});
writeFileSync(out, "window.ICONS = " + JSON.stringify(ICONS) + ";\nwindow.CANDIDATES = " + JSON.stringify(CANDIDATES) + ";\n");
console.log(out, ICONS.length, "icons,", ICONS.filter(i => i.changed).length, "changed,", Object.keys(prior).length, "with earlier notes,", CANDIDATES.length, "candidates");
