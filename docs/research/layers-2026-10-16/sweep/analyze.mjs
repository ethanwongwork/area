// node analyze.mjs out > report.json ; prints a summary
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const dir = process.argv[2] ?? "out";
const runs = Object.fromEntries(readdirSync(dir).filter(f => f.endsWith(".json")).map(f => [f.replace(".json", ""), JSON.parse(readFileSync(join(dir, f), "utf8"))]));
const DEF = { light: "light-100-4", dark: "dark-8-4" };
const TH = { light: { state: 0.035, field: 0.017 }, dark: { state: 0.07, field: 0.035 } };
const key = f => `${f.tile}|${f.el}|${f.text ?? f.state ?? ""}`;
const summary = { errors: [], text: {}, state: {}, field: {}, layer: {}, literal: {} };
const push = (bucket, fam, item) => ((bucket[fam] ??= []).push(item));

for (const [combo, r] of Object.entries(runs)) {
  const theme = r.theme;
  for (const [fam, res] of Object.entries(r.families)) {
    if (res.error) { summary.errors.push(`${combo} ${fam}: ${res.error}`); continue; }
    for (const f of res.findings) {
      if (f.kind === "text") push(summary.text, fam, { combo, ...f });
      if (f.kind === "state") {
        const weakEdge = f.border < 1.5 && !f.outline;
        if (f.dL < TH[theme].state && weakEdge) push(summary.state, fam, { combo, ...f });
      }
      if (f.kind === "field") {
        if (f.dL < 0.006 && f.edge < 1.3 && !f.shadow) push(summary.field, fam, { combo, ...f });
      }
      if (f.kind === "layer") {
        if (f.dL < 0.006 && f.edge < 1.15 && !f.shadow) push(summary.layer, fam, { combo, ...f });
      }
    }
  }
}

// Literal colours: an element whose background is the same at every ground of a theme (layers 4) while the canvas
// ground moved, i.e. a colour that ignores the Layers settings.
for (const theme of ["light", "dark"]) {
  const combos = Object.keys(runs).filter(c => c.startsWith(theme) && c.endsWith("-4"));
  const fams = Object.keys(runs[DEF[theme]]?.families ?? {});
  for (const fam of fams) {
    const maps = combos.map(c => runs[c].families[fam]).filter(x => x && !x.error);
    if (maps.length < 2) continue;
    const grounds = new Set(maps.map(m => m.canvasBg));
    if (grounds.size < 2) continue;
    for (const el of Object.keys(maps[0].bgs)) {
      const vals = maps.map(m => m.bgs[el]);
      if (vals.every(v => v && v === vals[0])) push(summary.literal, fam, { theme, el, value: vals[0] });
    }
  }
}
writeFileSync("report.json", JSON.stringify(summary, null, 1));
const count = b => Object.entries(b).map(([k, v]) => `${k}:${v.length}`).join(" ");
console.log("errors", summary.errors.length, summary.errors.slice(0, 10));
for (const k of ["text", "state", "field", "layer", "literal"]) console.log(`\n== ${k}\n${count(summary[k])}`);
