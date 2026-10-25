// Random all-axis combinations: every registry axis (except theme) takes a random preset, plus Contrast and Pills.
// Seeded, so a combination can be reproduced by name.  node random.mjs <count> <seed>  → writes rand-combos.json
import { writeFileSync } from "node:fs";
const { AXIS_PRESETS, PILL_SHAPES } = await import(new URL("../../../packages/tokens/dist/config.js", import.meta.url).href);
const [count = "30", seed = "7"] = process.argv.slice(2);
let s = Number(seed) >>> 0;
const rnd = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = list => list[Math.floor(rnd() * list.length)];
const combos = {};
for (let i = 0; i < Number(count); i++) {
  const c = {};
  for (const [axis, presets] of Object.entries(AXIS_PRESETS)) if (axis !== "theme") c[axis] = pick(presets);
  c.contrast = pick(["system", "0", "0", "0", "2", "4", "6", "8"]);
  c.pills = PILL_SHAPES.map(p => p.id ?? p).filter(() => rnd() < 0.5).join(" ");
  combos[`r${String(i).padStart(2, "0")}`] = c;
}
writeFileSync(new URL("./rand-combos.json", import.meta.url), JSON.stringify(combos, null, 1));
console.log(Object.keys(combos).length, "combos;", Object.keys(Object.values(combos)[0]).length, "settings each");
