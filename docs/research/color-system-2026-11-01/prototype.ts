/**
 * Prototype of the proposed colour model (README, proposals 2–5), computed beside Area's ladder without changing it.
 *
 * One function places any colour: `colourAt(h, L, s)`, hue h, OKLab lightness L, and s, the share of the chroma sRGB
 * holds at that L and h (OKHSL's saturation, in OKLab lightness). Every chromatic rung of palette.json is already
 * s ≈ 0.95–1.0 (measure-ladder.ts), so the ladder is this function at s = 1 along each family's own L curve; the
 * proposals add L between rungs and pick data colours by L rather than by rung (and s < 1, soft and dusty, which the
 * owner turned down for data on 2026-11-01: OpenAI's colours, not Cursor's).
 *
 *   node docs/research/color-system-2026-11-01/prototype.ts          # tables
 *   node docs/research/color-system-2026-11-01/prototype.ts --json   # data for the review page (prototype.json)
 */
import { buildScale } from "../../../packages/tokens/src/color/scale.ts";
import { CHROMATIC_SCALES, MUTED_SCALES } from "../../../packages/tokens/src/color/presets.ts";
import { generatedFamily, withStrength } from "../../../packages/tokens/src/color/generate.ts";
import { maxChromaAt } from "../../../packages/tokens/src/color/gamut.ts";
import { gamutMap } from "../../../packages/tokens/src/color/gamut.ts";
import { SRGB, parseHex, rgbToOklab, labToLch, toHex, oklabToRgb, clampRgb } from "../../../packages/tokens/src/color/oklab.ts";
import { wcagContrastHex, apcaContrast } from "../../../packages/tokens/src/color/contrast.ts";
import { LEVELS } from "../../../packages/tokens/src/color/curves.ts";

const lab = (hex: string) => rgbToOklab(parseHex(hex), SRGB);
const lch = (hex: string) => labToLch(lab(hex));
const room = (L: number, h: number) => maxChromaAt(L, h, SRGB);
export const colourAt = (h: number, L: number, s: number, cap = Infinity) => toHex(gamutMap({ L, C: Math.min(cap, s * room(L, h)), h }, SRGB).rgb);
const share = (hex: string) => { const c = lch(hex); const r = room(c.L, c.h); return r > 0.002 ? c.C / r : 0; };
const r2 = (n: number, d = 3) => Number(n.toFixed(d));

const PAGE = { light: "#ffffff", dark: "#020202" }, CARD = { light: "#f9f9f9", dark: "#161616" };

// --- Current: the ladder as built, eight families -----------------------------------------------------------------
const FAMS = ["red", "orange", "yellow", "lime", "green", "teal", "cyan", "blue", "indigo", "purple", "pink"] as const;
const built = Object.fromEntries([...CHROMATIC_SCALES, ...MUTED_SCALES].map(s => [s.id, buildScale(s, "light")]));
const ladder = (id: string) => built[id]!.steps.map(st => ({ level: st.level, hex: st.hex }));

// --- Proposed tiers on the same L ladder: strength 100 (today), 65 (soft), 35 (dusty) --------------------------------
// Strength is Accent strength's own mix (generate.ts withStrength: OKLab toward the gray of the colour's luminance), so
// a tier keeps every rung's luminance, and so its contrast, and its hue. Brown is orange at 35% chroma already.
const TIERS = [100, 65, 35] as const;
const tiers = (id: string) => Object.fromEntries(TIERS.map(t => [t, ladder(id).map(r => ({ level: r.level, hex: withStrength(r.hex, t) }))]));

// --- Series: OpenAI's luminous colours, as pairs ------------------------------------------------------------------
// Owner, 2026-11-01: "i dont like cursors colors, i like openais colors form the references i sent". Hues are the hue
// clusters sampled from those images (sample-references.mjs): sky, periwinkle, lilac, pink, peach, peach orange,
// yellow-green, mint. The fill is one lightness for every hue at the full room, chroma capped: fitted to nine luminous
// samples (sky, aqua, mint, periwinkle, lilac, pink, peach, peach orange, yellow-green), the best single setting is
// L 0.79, share 1.0, C ≤ 0.13 (mean ΔE_OK 3.3 × 100). So OpenAI's colours are Area's own ladder at L 0.79, chroma capped.
export const OPENAI: Record<string, string> = {
  sky: "#6bc4fd", "sky pale": "#96d6f5", aqua: "#79dbf6", mint: "#6acbad", periwinkle: "#8e9bef", "periwinkle pale": "#9bb0f7",
  lilac: "#d0a1f5", "lilac pale": "#d4abf8", pink: "#ff9ed3", "rose pink": "#ffabc5", peach: "#fe9da3", "peach orange": "#ef9365",
  orange: "#fb7c07", "yellow-green": "#d6c607", violet: "#997ffe",
};
export const SERIES_HUES: Record<string, number> = { sky: 239, "peach orange": 47, lilac: 309, "yellow-green": 104, pink: 346, periwinkle: 276, mint: 171, peach: 16 };
/** Lightest L along h (at share s) whose colour clears `ratio` on every ground: the emphasis mark. */
function lightestClearing(h: number, s: number, grounds: string[], ratio: number, from: number, to: number) {
  const step = from < to ? 0.002 : -0.002;
  for (let L = from; from < to ? L <= to : L >= to; L += step) {
    const hex = colourAt(h, L, s);
    if (grounds.every(g => wcagContrastHex(hex, g) >= ratio)) return hex;
  }
  return colourAt(h, to, s);
}
/** The luminous colour (both modes: marks in dark, fills in light) and the dark area fill under a dark line. */
const LUMINOUS = { L: 0.79, s: 1, cap: 0.13 };
const DARK_AREA = { L: 0.40, s: 0.7, cap: 0.09 };
export const series = Object.fromEntries(Object.entries(SERIES_HUES).map(([name, h]) => {
  const luminous = colourAt(h, LUMINOUS.L, LUMINOUS.s, LUMINOUS.cap);
  // Light: the luminous colour fills; the emphasis (lines, dots, edges) is the lightest point on the hue at 3.1:1 on the
  // page and the control fill. Dark: the luminous colour is the mark itself (≥ 9:1 on #020202); areas under it are deep.
  const emphasis = { light: lightestClearing(h, 1, [PAGE.light, CARD.light], 3.1, 0.8, 0.4), dark: luminous };
  const fill = { light: luminous, dark: colourAt(h, DARK_AREA.L, DARK_AREA.s, DARK_AREA.cap) };
  // A number inside a light fill: the lightest point on the hue clearing 4.6:1 on it.
  const ink = { light: lightestClearing(h, 1, [luminous], 4.6, 0.6, 0.2), dark: lightestClearing(h, 0.5, [fill.dark], 4.6, 0.8, 0.98) };
  return [name, { h, emphasis, fill, ink }];
}));
const de = (a: string, b: string) => { const x = lab(a), y = lab(b); return Math.hypot(x.L - y.L, x.a - y.a, x.b - y.b); };
const allRungs = [...FAMS, "brown"].flatMap(id => ladder(id).map(r => ({ name: `${id}-${r.level}`, hex: r.hex })));
/** Each OpenAI sample: its nearest Area rung today, and the proposed luminous colour at its own hue. */
export const openai = Object.entries(OPENAI).map(([name, hex]) => {
  const c = lch(hex), near = allRungs.reduce((a, r) => de(hex, r.hex) < de(hex, a.hex) ? r : a);
  const proposed = colourAt(c.h, LUMINOUS.L, LUMINOUS.s, LUMINOUS.cap);
  return { name, hex, L: r2(c.L, 3), C: r2(c.C), h: r2(c.h, 0), share: r2(share(hex), 2), near: near.name, nearHex: near.hex, nearDE: r2(de(hex, near.hex)), proposed, proposedDE: r2(de(hex, proposed)) };
});

// --- Sequential: today's heat (mix toward white) vs the ladder walk (hold share) ------------------------------------
const mixLab = (a: string, b: string, t: number) => { const x = lab(a), y = lab(b); return toHex(clampRgb(oklabToRgb({ L: x.L + (y.L - x.L) * t, a: x.a + (y.a - x.a) * t, b: x.b + (y.b - x.b) * t }, SRGB))); };
function sequential(h: number, end: string) {
  const e = lch(end), n = 7;
  const mixed = Array.from({ length: n }, (_, i) => mixLab(end, "#ffffff", 1 - (i + 1) / n));
  // Hold the end's share; lightness even from L 0.96 to the end's.
  const s = share(end);
  const walked = Array.from({ length: n }, (_, i) => colourAt(h, 0.96 + (e.L - 0.96) * (i + 1) / n, s));
  return { mixed, walked };
}
export const seq = Object.fromEntries(["teal", "lime", "blue", "orange"].map(id => {
  const h = built[id]!.steps.find(st => st.level === 500)!.oklch.h;
  const end = ladder(id).find(r => r.level === 500)!.hex;
  return [id, sequential(h, end)];
}));

// --- In-between rungs: where the ladder jumps, the continuous ladder places a step at the midpoint L -------------------
const between = Object.fromEntries(["blue", "teal", "yellow"].map(id => {
  const steps = built[id]!.steps;
  const out: { level: number | string; hex: string }[] = [];
  for (let i = 0; i < steps.length; i++) {
    const st = steps[i]!; out.push({ level: st.level, hex: st.hex });
    const nx = steps[i + 1];
    if (nx && st.level >= 100 && nx.level <= 600) {
      const d = Math.hypot(lab(st.hex).L - lab(nx.hex).L, lab(st.hex).a - lab(nx.hex).a, lab(st.hex).b - lab(nx.hex).b);
      if (d > 0.06) out.push({ level: `${(st.level + nx.level) / 2}`, hex: colourAt((st.oklch.h + nx.oklch.h) / 2, (st.oklch.L + nx.oklch.L) / 2, 1) });
    }
  }
  return [id, out];
}));

// --- Report -----------------------------------------------------------------------------------------------------------
const METER = { light: ["blue-500", "orange-500", "teal-500", "yellow-450", "pink-300", "green-600", "purple-550", "red-450"], dark: ["blue-400", "orange-550", "teal-550", "yellow-550", "pink-450", "green-600", "purple-350", "red-400"] };
const rung = (name: string) => { const [id, l] = name.split("-"); return ladder(id!).find(r => String(r.level) === l)!.hex; };
const current = { light: METER.light.map(rung), dark: METER.dark.map(rung) };

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({
    levels: LEVELS, series, seq, between, current, openai, luminous: LUMINOUS,
  }));
} else {
  console.log("## OpenAI samples: nearest Area rung today vs the proposed luminous colour at the sample's hue\n");
  console.log("| Sample | Hex | L | C | h | Share | Nearest rung | ΔE | Proposed | ΔE |\n|---|---|---|---|---|---|---|---|---|---|");
  for (const o of openai) console.log(`| ${o.name} | ${o.hex} | ${o.L} | ${o.C} | ${o.h} | ${o.share} | ${o.near} ${o.nearHex} | ${r2(o.nearDE * 100, 1)} | ${o.proposed} | ${r2(o.proposedDE * 100, 1)} |`);
  console.log("\n## Series (proposed)\n");
  console.log("| Series | h | luminous (fill light, mark dark) | on white | on #020202 | emphasis light | on white | ink in fill | dark area fill |");
  console.log("|---|---|---|---|---|---|---|---|---|");
  for (const [n, v] of Object.entries(series)) {
    console.log(`| ${n} | ${v.h} | ${v.fill.light} | ${r2(wcagContrastHex(v.fill.light, PAGE.light), 2)} | ${r2(wcagContrastHex(v.fill.light, PAGE.dark), 2)} | ${v.emphasis.light} (L ${r2(lch(v.emphasis.light).L, 2)}) | ${r2(wcagContrastHex(v.emphasis.light, PAGE.light), 2)} | ${v.ink.light} ${r2(wcagContrastHex(v.ink.light, v.fill.light), 2)} | ${v.fill.dark} |`);
  }
  console.log("\n## Sequential: share of the room at each step, mixed toward white vs walked along the hue\n");
  for (const [id, v] of Object.entries(seq)) console.log(`| ${id} | mixed ${v.mixed.map(x => r2(share(x), 2)).join(" ")} | walked ${v.walked.map(x => r2(share(x), 2)).join(" ")} |`);
  console.log("\n## Dusty tier vs Cursor (ΔE_OK to the nearest dusty-tier rung, any family)\n");
  const dusty = [...FAMS].flatMap(id => tiers(id)[35]!.map(r => ({ name: `${id}-${r.level}@35`, hex: r.hex })));
  const soft = [...FAMS].flatMap(id => tiers(id)[65]!.map(r => ({ name: `${id}-${r.level}@65`, hex: r.hex })));
  const de = (a: string, b: string) => { const x = lab(a), y = lab(b); return Math.hypot(x.L - y.L, x.a - y.a, x.b - y.b); };
  for (const hex of ["#b2d4dc", "#aec1d3", "#99adc6", "#7e9cbe", "#7390b5", "#5e82b3", "#8cc1d1", "#8d83b9", "#d7b986", "#b6706e", "#81ba9b", "#4e9493", "#c393b7"]) {
    const pool = [...dusty, ...soft];
    const near = pool.reduce((a, r) => de(hex, r.hex) < de(hex, a.hex) ? r : a);
    console.log(`| ${hex} | ${near.name} ${near.hex} | ${r2(de(hex, near.hex))} |`);
  }
  console.log("\ncurrent Meter light", current.light.join(","), "\ncurrent Meter dark", current.dark.join(","));
  console.log("proposed emphasis light", Object.values(series).map(v => v.emphasis.light).join(","));
  console.log("proposed luminous", Object.values(series).map(v => v.fill.light).join(","));
  void apcaContrast;
}
