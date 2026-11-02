/**
 * Runs the dataviz skill's palette validator (validate_palette.js, Machado 2009 CVD, OKLab ΔE×100, WCAG vs surface) on
 * the current and proposed series, and picks the proposed order: sky first (OpenAI's blue), then the order of the other seven that
 * maximises the worst adjacent CVD ΔE across light and dark, and the first four's all-pairs CVD ΔE, (the skill's "derive an order" method).
 *   node docs/research/color-system-2026-11-01/validate-series.mjs <path to validate_palette.js>
 */
import { execFileSync } from "node:child_process";
const VALIDATOR = process.argv[2];
if (!VALIDATOR) throw new Error("Pass the path to the dataviz skill's validate_palette.js.");
const { validate } = await import(VALIDATOR);
const proto = JSON.parse(execFileSync("node", [new URL("./prototype.ts", import.meta.url).pathname, "--json"], { encoding: "utf8" }));

const num = (row) => Number(/ΔE (\d+(\.\d+)?)/.exec(row[2])?.[1] ?? 99);
const score = (pal, mode, surface, pairs = "adjacent") => {
  const { report } = validate(pal, { mode, surface, pairs });
  return { cvd: num(report[2]), normal: num(report[3]), report };
};
const SURF = { light: "#ffffff", dark: "#020202" };
const names = Object.keys(proto.series);
const pick = (part, mode, order) => order.map(n => proto.series[n][part][mode]);

function* perms(a) { if (a.length <= 1) { yield a; return; } for (let i = 0; i < a.length; i++) for (const p of perms([...a.slice(0, i), ...a.slice(i + 1)])) yield [a[i], ...p]; }
// Hard gates first (neighbour CVD ≥ 8 and normal-vision ≥ 15 for the marks, both modes, scored as their worst share of
// the target), then the worst of the luminous fills' gates and the first four's all-pairs CVD (floor 6).
let best;
for (const rest of perms(names.slice(1))) {
  const order = [names[0], ...rest];
  const marks = ["light", "dark"].map(m => score(pick("emphasis", m, order), m, SURF[m]));
  const gate = Math.min(...marks.flatMap(r => [r.cvd / 8, r.normal / 15]));
  const fills = score(pick("fill", "light", order), "light", SURF.light);
  const all4 = Math.min(...["light", "dark"].map(m => score(pick("emphasis", m, order).slice(0, 4), m, SURF[m], "all").cvd));
  const total = Math.min(gate, 1) * 1000 + Math.min(fills.cvd / 8, fills.normal / 15, all4 / 6) * 10;
  if (!best || total > best.total) best = { order, total };
}
console.log("Proposed order:", best.order.join(", "), "\n");

const SETS = {
  "Current Meter (shared series today)": { light: proto.current.light, dark: proto.current.dark },
  "Round 10 (ladder peaks)": { light: ["#2a80ff", "#ea7401", "#00a797", "#fc3b5a", "#9b65ff", "#01aa4e", "#6b77ff", "#f84294"], dark: ["#2a80ff", "#ea7401", "#00a797", "#fc3b5a", "#9b65ff", "#01aa4e", "#6b77ff", "#f84294"] },
  "Proposed marks (light: emphasis; dark: luminous)": { light: pick("emphasis", "light", best.order), dark: pick("emphasis", "dark", best.order) },
  "Proposed luminous fills (light)": { light: pick("fill", "light", best.order), dark: pick("fill", "dark", best.order) },
};
const rows = [];
console.log("| Set | Mode | Band | Chroma ≥ 0.10 | Adjacent CVD ΔE | Normal ΔE | All-pairs CVD (first 4) | vs page |");
console.log("|---|---|---|---|---|---|---|---|");
for (const [name, set] of Object.entries(SETS)) for (const mode of ["light", "dark"]) {
  const r = score(set[mode], mode, SURF[mode]);
  const all4 = score(set[mode].slice(0, 4), mode, SURF[mode], "all");
  const cell = (row) => row[1] === true ? "pass" : row[1] === false ? "fail" : row[1];
  rows.push([name, mode, cell(r.report[0]), cell(r.report[1]), `${r.cvd.toFixed(1)} (${r.report[2][1]})`, `${r.normal.toFixed(1)} (${r.report[3][1]})`, all4.cvd.toFixed(1), r.report[4][1]]);
  console.log(`| ${name} | ${mode} | ${cell(r.report[0])} | ${cell(r.report[1])} | ${r.cvd.toFixed(1)} (${r.report[2][1]}) | ${r.normal.toFixed(1)} (${r.report[3][1]}) | ${all4.cvd.toFixed(1)} | ${r.report[4][1]} |`);
}
console.log("\nVALIDATION_JSON", JSON.stringify({ order: best.order, rows }));
