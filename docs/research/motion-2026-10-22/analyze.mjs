// Reads sweep.mjs output and lists every departure from MOTION.md, grouped by rule and family.
//   node analyze.mjs <motion.json>
import { readFileSync } from "node:fs";

const r = JSON.parse(readFileSync(process.argv[2], "utf8"));
const SNAPPY = new Set(["cubic-bezier(0.19, 1, 0.22, 1)", "cubic-bezier(0.6, 0, 0.2, 1)", "cubic-bezier(0.6, 0, 0.8, 0.6)"]);
const OK_CURVE = c => SNAPPY.has(c) || c === "linear" || c.startsWith("steps(");
const out = { hoverIn: [], noLeave: [], leaveOff: [], easing: [], zero: [], willChange: [] };
const push = (k, slug, what) => { const key = slug + " " + what; if (!out[k].includes(key)) out[k].push(key); };

for (const [slug, f] of Object.entries(r.families)) {
  const tok = f.standard?.tok; if (!tok) { push("zero", slug, "no data " + (f.error || "")); continue; }
  for (const h of f.hover) {
    for (const part of ["self", "before"]) {
      const colourIn = h.enter[part].filter(([p]) => /color|background|border|shadow|outline|fill|stroke|^all$/.test(p));
      if (colourIn.length) push("hoverIn", slug, `${h.el}${part === "before" ? "::before" : ""} enters over ${colourIn.map(x => x[0] + " " + x[1]).join(", ")}`);
      for (const [p, d, c] of h.leave[part]) {
        if (!/color|background|border|outline|fill|stroke|^all$/.test(p)) continue;
        if (d !== 140 || c !== tok.out) push("leaveOff", slug, `${h.el}${part === "before" ? "::before" : ""} leaves ${p} on ${d}ms ${c === tok.out ? "ease-out" : c}`);
      }
    }
    if (h.changes && !h.leave.self.length && !h.leave.before.length) push("noLeave", slug, `${h.el} (${h.tile}) changes on hover with no fade out`);
  }
  for (const x of f.snappy.rows) if ((x.kind === "transition" || x.kind === "animation") && !OK_CURVE(x.curve)) push("easing", slug, `${x.el} ${x.kind} ${x.prop} keeps ${x.curve}`);
  for (const x of f.zero.rows) if ((x.kind === "transition" || x.kind === "animation") && x.dur > 0) push("zero", slug, `${x.el} ${x.kind} ${x.prop} ${x.dur}ms at Motion 0`);
  for (const x of f.standard.rows) if (x.kind === "will-change") push("willChange", slug, `${x.el} will-change: ${x.prop}`);
}
for (const [k, v] of Object.entries(out)) { console.log(`\n## ${k} (${v.length})`); for (const line of v) console.log("- " + line); }
