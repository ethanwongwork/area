/**
 * The gaps the data-visualisation work found, measured.
 *   1. Reference colours (OpenAI gradients, Cursor's dashboard, round 11's series): OKLCH, share of the sRGB room at
 *      their L and h ("saturation" in OKHSL's sense), and the nearest rung Area has (any family, as built), ΔE_OK.
 *   2. Step evenness: ΔE_OK between neighbouring rungs, 100→900, per family.
 *   3. Cross-hue lightness at a rung.
 *   4. Heat ramps mixed toward white: the share of the room the mix keeps, in OKLab and in sRGB.
 *   node docs/research/color-system-2026-11-01/measure-gaps.ts
 */
import { buildScale } from "../../../packages/tokens/src/color/scale.ts";
import { CHROMATIC_SCALES, MUTED_SCALES } from "../../../packages/tokens/src/color/presets.ts";
import { maxChromaAt } from "../../../packages/tokens/src/color/gamut.ts";
import { SRGB, parseHex, rgbToOklab, labToLch, oklabToRgb, clampRgb, toHex } from "../../../packages/tokens/src/color/oklab.ts";
import { wcagContrastHex } from "../../../packages/tokens/src/color/contrast.ts";

const lab = (hex: string) => rgbToOklab(parseHex(hex), SRGB);
const lch = (hex: string) => labToLch(lab(hex));
const de = (a: string, b: string) => { const x = lab(a), y = lab(b); return Math.hypot(x.L - y.L, x.a - y.a, x.b - y.b); };
const share = (hex: string) => { const c = lch(hex); const r = maxChromaAt(c.L, c.h, SRGB); return r > 0.002 ? c.C / r : 0; };
const f = (n: number, d = 3) => n.toFixed(d);

const families = [...CHROMATIC_SCALES, ...MUTED_SCALES].map(s => buildScale(s, "light"));
const rungs = families.flatMap(s => s.steps.map(st => ({ name: `${s.id}-${st.level}`, hex: st.hex })));

const REFS: Record<string, Record<string, string>> = {
  "OpenAI gradients (sampled from the owner's images)": {
    "sky": "#6bc4fd", "sky pale": "#96d6f5", "aqua": "#79dbf6", "mint": "#6acbad", "periwinkle": "#8e9bef", "periwinkle pale": "#9bb0f7",
    "lilac": "#d0a1f5", "lilac pale": "#d4abf8", "pink": "#ff9ed3", "rose pink": "#ffabc5", "peach": "#fe9da3", "peach orange": "#ef9365",
    "orange": "#fb7c07", "yellow-green": "#d6c607", "olive yellow": "#bfc022", "violet": "#997ffe", "deep violet": "#3a2cec",
  },
  "Cursor dashboard (sampled, data-views round 11)": { "band 1": "#b2d4dc", "band 2": "#aec1d3", "band 3": "#99adc6", "line 1": "#7e9cbe", "line 2": "#7390b5", "today tag": "#fff7a8" },
  "Round 11 series (literal OKLCH, data-views)": { "slate": "#5e82b3", "mist": "#8cc1d1", "lavender": "#8d83b9", "sand": "#d7b986", "rose": "#b6706e", "sage": "#81ba9b", "teal": "#4e9493", "plum": "#c393b7" },
};
console.log("## 1. Reference colours against Area's ladder\n");
console.log("| Set | Name | Hex | L | C | h | Share | On white | Nearest Area rung | ΔE_OK |");
console.log("|---|---|---|---|---|---|---|---|---|---|");
for (const [set, refs] of Object.entries(REFS)) for (const [name, hex] of Object.entries(refs)) {
  const c = lch(hex);
  const near = rungs.reduce((a, r) => de(hex, r.hex) < de(hex, a.hex) ? r : a);
  console.log(`| ${set.split(" (")[0]} | ${name} | ${hex} | ${f(c.L, 2)} | ${f(c.C)} | ${f(c.h, 0)} | ${f(share(hex), 2)} | ${f(wcagContrastHex(hex, "#ffffff"), 2)} | ${near.name} ${near.hex} | ${f(de(hex, near.hex))} |`);
}

console.log("\n## 2. Step evenness, ΔE_OK between neighbouring rungs (100 to 900)\n");
const mid = [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900];
console.log(`| Family | ${mid.slice(0, -1).map((l, i) => `${l}→${mid[i + 1]}`).join(" | ")} | max ÷ min |`);
console.log(`|---|${mid.slice(0, -1).map(() => "---").join("|")}|---|`);
for (const s of families) {
  const by = new Map(s.steps.map(st => [st.level as number, st.hex]));
  const d = mid.slice(0, -1).map((l, i) => de(by.get(l)!, by.get(mid[i + 1]!)!));
  console.log(`| ${s.id} | ${d.map(x => f(x * 100, 1)).join(" | ")} | ${f(Math.max(...d) / Math.min(...d), 1)} |`);
}

console.log("\n## 3. Lightness at a rung, across the eleven chromatic families\n");
console.log("| Rung | min L | max L | spread | darkest | lightest |\n|---|---|---|---|---|---|");
for (const level of [200, 300, 400, 500, 600, 700]) {
  const ls = families.filter(s => s.id !== "brown").map(s => ({ id: s.id, L: s.steps.find(st => st.level === level)!.oklch.L }));
  const lo = ls.reduce((a, b) => b.L < a.L ? b : a), hi = ls.reduce((a, b) => b.L > a.L ? b : a);
  console.log(`| ${level} | ${f(lo.L)} | ${f(hi.L)} | ${f(hi.L - lo.L)} | ${lo.id} | ${hi.id} |`);
}

console.log("\n## 4. A heat ramp mixed toward white: share of the room kept at each mix (500 → white)\n");
const mixLab = (a: string, b: string, t: number) => { const x = lab(a), y = lab(b); return toHex(clampRgb(oklabToRgb({ L: x.L + (y.L - x.L) * t, a: x.a + (y.a - x.a) * t, b: x.b + (y.b - x.b) * t }, SRGB))); };
const lin = (c: number) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const mixSrgb = (a: string, b: string, t: number) => { const x = parseHex(a), y = parseHex(b); return toHex(x.map((c, i) => c + (y[i]! - c) * t) as [number, number, number]); };
console.log("| Family (500) | oklab 25% white | 50% | 75% | srgb 25% | 50% | 75% | ladder rung at the 50% mix's L, its share |");
console.log("|---|---|---|---|---|---|---|---|");
for (const s of families.filter(x => x.id !== "brown")) {
  const base = s.steps.find(st => st.level === 500)!.hex;
  const ok = [0.25, 0.5, 0.75].map(t => share(mixLab(base, "#ffffff", t)));
  const sr = [0.25, 0.5, 0.75].map(t => share(mixSrgb(base, "#ffffff", t)));
  const half = lch(mixLab(base, "#ffffff", 0.5));
  const near = s.steps.reduce((a, st) => Math.abs(st.oklch.L - half.L) < Math.abs(a.oklch.L - half.L) ? st : a);
  console.log(`| ${s.id} | ${ok.map(x => f(x, 2)).join(" | ")} | ${sr.map(x => f(x, 2)).join(" | ")} | ${near.level} (L ${f(near.oklch.L, 2)}), ${f(share(near.hex), 2)} |`);
}
void lin;
