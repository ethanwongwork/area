// Round 12 (owner, 2026-10-11: "still concerned about all numbers and letters in icons, as well as the filled icons and
// how the ones that fill the outline or 1 shape look next to negative space stroke icons"). Rebuilds the review page's
// data from the published data.js (groups, references, earlier notes) with every drawing re-rendered from the current
// sources, then reopens the letters-and-numbers icons (their earlier verdicts stop counting) and tags every icon with its
// filled treatment for the page's side-by-side view. From the repository root, after `npm run icons:pilot`:
//   node docs/research/icon-review/2026-10-11/round12-data.mjs <published data.js> <treatments.html> out/data.js [fixes.json]
// With fixes.json ({ name: { change, verdict, notes, library } }, round 12b on 2026-10-12) only the icons redrawn since the
// published data are reopened, each with its fix and the note it answers; the type tiers stay tagged for the strips.
// BEFORE_TSX=<emitted pilot icons> (gen-pilot-icons --only … --emit, run on a copy of the sources holding older drawings)
// reopens every icon in fixes.json with that drawing as its Before, even when the published page already shows the
// current drawing (round 12d: the 43 icons redrawn in round 11 and never reviewed since).
// treatments.html: the filled-treatments page (https://claude.ai/artifact/1oCSG2MmsfkpxcNAtDnpBY), whose ITEMS give the
// recorded treatment of the 375 icons reviewed by round 10; the rest are classed from their filled drawing.
import { build } from "esbuild"; import { writeFileSync, readFileSync } from "node:fs";
const [prevPath, treatPath, out, fixesPath] = process.argv.slice(2);
const fixes = fixesPath ? JSON.parse(readFileSync(fixesPath, "utf8")) : null;
const root = process.cwd(), cache = root + "/apps/docs/.cache";
// The drawings come from the generated components, so refuse to build from a stale generation (2026-10-12: a page went
// out showing 13 redraws as their old drawings because the sources changed after the last full `npm run icons:pilot`).
{ const { statSync, readdirSync } = await import("node:fs"); const src = "apps/docs/assets/area-icons-pilot";
  const newest = Math.max(...readdirSync(src).filter(f => f.endsWith(".svg")).map(f => statSync(src + "/" + f).mtimeMs));
  if (newest > statSync("apps/docs/src/pilot-icons.tsx").mtimeMs) { console.error("pilot-icons.tsx is older than the sources: run npm run icons:pilot first"); process.exit(1); } }

writeFileSync(cache + "/rv12.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server";
import { PILOT_ICONS as A } from "../src/pilot-icons.tsx";
const r = (C, p) => renderToStaticMarkup(h(C, { weight: 1.125, ...p })).replace(/ aria-hidden="true"| focusable="false"/g, "");
export const draws = name => { const p = A.find(x => x.name === name); return p ? { fill: p.fill,
  o: r(p.Icon, { width: 16, height: 16 }), f: r(p.Filled, { width: 16, height: 16 }),
  os: [16, 24, 32].map(s => r(p.Icon, { size: s })), fs: [16, 24, 32].map(s => r(p.Filled, { size: s })) } : null; };
${process.env.BEFORE_TSX ? `import { PILOT_ICONS as B } from "${process.env.BEFORE_TSX}";
export const before = name => { const p = B.find(x => x.name === name); return p ? { o: r(p.Icon, { width: 16, height: 16 }), f: r(p.Filled, { width: 16, height: 16 }),
  os: [16, 24, 32].map(s => r(p.Icon, { size: s })), fs: [16, 24, 32].map(s => r(p.Filled, { size: s })) } : null; };` : "export const before = () => null;"}`);
await build({ entryPoints: [cache + "/rv12.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/rv12.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { draws, before } = await import(cache + "/rv12.out.mjs?" + Date.now());

const w = {}; new Function("window", readFileSync(prevPath, "utf8"))(w);
const treat = Object.fromEntries(JSON.parse(readFileSync(treatPath, "utf8").match(/const ITEMS = (\[.*?\]);\s*\n/s)[1]).map(i => [i.n, i.c]));

// Letters, digits and typographic signs, in the type audit's tiers (round 10).
const TYPE = {
  "Display letters": ["text", "text-size", "text-color", "bold", "italic", "underline", "strikethrough", "remove-formatting", "line-height", "letter-spacing", "square-text", "text-cursor", "square-text-cursor", "sigma", "function", "currency-euro", "pilcrow", "pilcrow-left", "pilcrow-right", "quote"],
  "Headings": ["heading", "heading-1", "heading-2", "heading-3", "heading-4", "heading-5", "heading-6"],
  "Word pairs": ["case-upper", "case-lower", "case-sensitive", "whole-word", "translate", "spell-check", "superscript", "subscript"],
  "Badge text": ["gif", "file-pdf", "markdown", "captions", "captions-off"],
  "Small glyphs and digits": ["list-numbered", "sort-alpha", "sort-numeric", "binary", "regex", "variable"],
  "Signs": ["dollar", "circle-dollar", "copyright", "discount", "percent", "hash", "at"],
};
const tierOf = {}; for (const [t, ns] of Object.entries(TYPE)) for (const n of ns) tierOf[n] = t;

// A filled drawing's treatment, when round 10 didn't record one: strokes only, a solid with knockouts, or a solid with
// parts left as lines.
const classify = d => d.fill === "weight" ? "weight" : /<mask/.test(d.f) ? (/<\/g><(path|circle|rect)/.test(d.f) ? "lines" : "knockout") : /stroke="currentColor"[^>]*fill="none"|fill="none"[^>]*stroke="currentColor"/.test(d.f) ? "lines" : "solid";

const now = new Date().toISOString(), ICONS = [];
for (const p of w.ICONS) {
  const d = draws(p.name); if (!d) { console.error("no source for " + p.name); continue; }
  const row = { name: p.name, group: p.group, ...d, refs: p.refs, treat: treat[p.name] ?? classify(d) };
  if (p.prior) row.prior = p.prior;
  if (tierOf[p.name]) row.type = tierOf[p.name];
  if (tierOf[p.name] && !fixes) {
    row.changed = true; row.reopened = true; row.staleAt = now;
    row.change = `Round 12: every letter and number again (${tierOf[p.name]}). Judge it beside the other type icons in the row under the stage, outline and filled.`;
  }
  const old = fixes?.[p.name] && before(p.name);
  if (p.o !== d.o || p.f !== d.f || old) { // redrawn since the page was published, or an older drawing was supplied
    row.changed = true; row.reopened = true; row.staleAt = now; row.before = old || { o: p.o, f: p.f, os: p.os, fs: p.fs };
    row.change = (row.change ? row.change + " " : "") + "Redrawn since the last round (Before shows the published drawing).";
    const f = fixes?.[p.name]; if (f) { row.redrawn = true; row.change = (f.optical ? "" : "Redrawn on your note: ") + f.change;
      if (!f.optical && f.verdict !== "approve") row.prior = { round: "reviews7", verdict: f.verdict, library: f.library ?? null, notes: f.notes ?? "" }; }
  }
  ICONS.push(row);
}
for (const n of Object.keys(tierOf)) if (!ICONS.find(i => i.name === n)) console.error("type icon not on the page: " + n);
writeFileSync(out, "window.REDRAWN_AT = " + JSON.stringify(now) + ";\nwindow.TYPE_TIERS = " + JSON.stringify(TYPE) + ";\nwindow.ICONS = " + JSON.stringify(ICONS) + ";\nwindow.CANDIDATES = " + JSON.stringify(w.CANDIDATES ?? []) + ";\n");
const c = {}; ICONS.forEach(i => c[i.treat] = (c[i.treat] || 0) + 1);
console.log(out, ICONS.length, "icons;", ICONS.filter(i => i.changed).length, "to review (", ICONS.filter(i => i.type).length, "type,", ICONS.filter(i => i.before).length, "redrawn:", ICONS.filter(i => i.before).map(i => i.name).join(" "), ")", c);
