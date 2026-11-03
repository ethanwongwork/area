/**
 * Accents at any hue (owner, 2026-10-23: "a user creating a completely custom palette based on what they like ... a
 * specific hue and chroma that the current palette doesnt have"; research: docs/research/palette-customization-2026-10-23).
 *
 * The palette's eleven chromatic families sit at 91–100% of the chroma sRGB can show at every rung, and their lightness
 * ladder depends only on hue, in two groups (the white-label hues around L 0.58 at 500, the black-label ones around 0.66).
 * So a family at any hue is the two nearest families' ladder, interpolated by hue:
 *
 *   L  the two neighbours' lightness at that rung, mixed by how far the hue sits between them
 *   C  the neighbours' share of the room (chroma ÷ the most sRGB shows there), mixed the same way, times the room at the
 *      new lightness and hue, so the new family is as vivid for its hue as its neighbours are for theirs
 *   h  the hue itself, at every rung
 *
 * The result has the palette's own shape (23 rungs, hex and OKLCH), so `scale.ts` builds it exactly as it builds a named
 * family: the same light-end trim (the neighbours' trims, mixed), dark-end lift and cap, solid, tonal, vivid and indicator
 * walks. `palette.json` is read, never written; the named families stay as they are, and a hue's generated family is only
 * used where a hue is chosen. Accent strength (axes/accent.ts) quiets either live in CSS (below).
 */
import PALETTE from "./palette.json" with { type: "json" };
import { SRGB, clampRgb, oklabToRgb, oklchToRgb, parseHex, rgbToOklab, toHex } from "./oklab.ts";
import { maxChromaAt } from "./gamut.ts";
import { CHROMA_TRIM, LEVELS } from "./curves.ts";
import type { ScaleSpec } from "./scale.ts";

/** One rung of a palette family: its hex and OKLCH, as palette.json writes it. */
export interface PaletteRung { hex: string; oklch: { L: number; C: number; H: number } }
const FAMILIES = PALETTE.families as unknown as Record<string, Record<string, PaletteRung>>;

/** The named families the generator reads, with the label their solid carries (presets.ts `solidForeground`). */
const ANCHORS: ReadonlyArray<{ id: string; foreground: "light" | "dark" }> = [
  { id: "red", foreground: "light" }, { id: "orange", foreground: "dark" }, { id: "yellow", foreground: "dark" },
  { id: "lime", foreground: "dark" }, { id: "green", foreground: "light" }, { id: "teal", foreground: "light" },
  { id: "cyan", foreground: "light" }, { id: "blue", foreground: "light" }, { id: "indigo", foreground: "light" },
  { id: "purple", foreground: "light" }, { id: "pink", foreground: "light" },
];

/** Every hue an accent can take, in 5° steps (the Tint hue grid: half a step is ΔE_OK 0.010 at the most vivid accent). */
export const ACCENT_HUES: readonly number[] = Array.from({ length: 72 }, (_, i) => i * 5);

/** A generated family's scale id. */
export const hueScaleId = (hue: number) => `hue-${hue}`;
const HUE_ID = /^hue-(\d+)$/;
export const isHueScale = (id: string) => HUE_ID.test(id);

/** A named family's hue: its 500 rung's. */
export const anchorHue = (id: string) => FAMILIES[id]!["500"]!.oklch.H;

/** The two anchors around a hue and how far it sits from the first, 0 to 1, going up the wheel. */
function neighbours(hue: number): { lo: (typeof ANCHORS)[number]; hi: (typeof ANCHORS)[number]; t: number } {
  const sorted = [...ANCHORS].sort((a, b) => anchorHue(a.id) - anchorHue(b.id));
  for (let i = 0; i < sorted.length; i++) {
    const lo = sorted[i]!, hi = sorted[(i + 1) % sorted.length]!;
    const span = (anchorHue(hi.id) - anchorHue(lo.id) + 360) % 360;
    const off = (hue - anchorHue(lo.id) + 360) % 360;
    if (off <= span) return { lo, hi, t: span === 0 ? 0 : off / span };
  }
  throw new Error(`No palette families around hue ${hue}.`);
}

const room = (L: number, h: number) => maxChromaAt(L, h, SRGB);
const share = (rung: PaletteRung) => Math.min(1, rung.oklch.C / Math.max(1e-6, room(rung.oklch.L, rung.oklch.H)));

const cache = new Map<number, Record<string, PaletteRung>>();

/** A family at this hue, in the palette's own shape: every rung's hex and OKLCH. */
export function generatedFamily(hue: number): Record<string, PaletteRung> {
  const cached = cache.get(hue);
  if (cached) return cached;
  const { lo, hi, t } = neighbours(hue);
  const out: Record<string, PaletteRung> = {};
  for (const level of LEVELS) {
    const a = FAMILIES[lo.id]![String(level)]!, b = FAMILIES[hi.id]![String(level)]!;
    const L = a.oklch.L + (b.oklch.L - a.oklch.L) * t;
    const C = (share(a) + (share(b) - share(a)) * t) * room(L, hue);
    const hex = toHex(clampRgb(oklchToRgb({ L, C, h: hue }, SRGB)));
    out[String(level)] = { hex, oklch: { L: round(L), C: round(C), H: hue } };
  }
  cache.set(hue, out);
  return out;
}

/** A generated family's spec: chromatic, its neighbours' light-end trim mixed, and the nearer neighbour's label. */
export function generatedSpec(id: string): ScaleSpec | undefined {
  const match = HUE_ID.exec(id);
  if (!match) return undefined;
  const hue = Number(match[1]);
  const { lo, hi, t } = neighbours(hue);
  const trim = (CHROMA_TRIM[lo.id] ?? 1) + ((CHROMA_TRIM[hi.id] ?? 1) - (CHROMA_TRIM[lo.id] ?? 1)) * t;
  const foreground = t < 0.5 ? lo.foreground : hi.foreground;
  return { id, kind: "chromatic", trim: round(trim), ...(foreground === "dark" ? { solidForeground: "dark" as const } : {}) };
}

/**
 * The data families (presets.ts DATA_SCALES; data views round 18, 2026-11-02): the palette's recipe at the data colours'
 * hues the palette lacked, named so they sit in it as hues.
 */
export const DATA_HUES: Readonly<Record<string, number>> = { chartreuse: 105, mint: 170, sky: 250, violet: 305 };

/** A palette family, named, data or generated. */
export function familyFor(id: string): Record<string, PaletteRung> | undefined {
  const match = HUE_ID.exec(id);
  return match ? generatedFamily(Number(match[1])) : id in DATA_HUES ? generatedFamily(DATA_HUES[id]!) : FAMILIES[id];
}

// ---------------------------------------------------------------------------
// Accent strength: how much of its own colour an accent keeps. Not chroma scaled at a held OKLCH lightness: contrast
// follows luminance, and at one lightness a quieter colour has a different luminance (blue's 500 loses 0.3:1 against white
// by 30%), so every solved step (the solid's label, the indicator's 3:1, tonal ink's 4.5:1) would have to be solved again
// per strength. Instead each colour mixes in OKLab toward the gray of its own luminance: hue held exactly, luminance held
// at both ends and within 0.09:1 of WCAG between (docs/research/palette-customization-2026-10-23). emit/base.ts writes
// the same mix in CSS; the solvers walk with the mix at every strength, so every step clears at every strength.
// ---------------------------------------------------------------------------

/** Strength in percent of the accent's own colour: 100 (the palette, the default) down to 30 (dusty). */
export const ACCENT_STRENGTHS = [100, 90, 80, 70, 60, 50, 40, 30] as const;
export const DEFAULT_ACCENT_STRENGTH = 100;

const linear = (c: number) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const encode = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.max(0, c) ** (1 / 2.4) - 0.055;
/** WCAG's luminance weights, as base.ts writes them over `srgb-linear` channels. */
export const LUMINANCE = [0.2126, 0.7152, 0.0722] as const;

/** A colour at a strength: `color-mix(in oklab, colour strength%, the gray of its luminance)`, the CSS base.ts writes. */
export function withStrength(hex: string, strength: number): string {
  if (strength >= 100) return hex;
  const alpha = hex.length === 9 ? hex.slice(7) : "";
  const rgb = parseHex(hex.slice(0, 7));
  const Y = rgb.reduce((sum, c, i) => sum + linear(c) * LUMINANCE[i]!, 0);
  const gray = encode(Y);
  const a = rgbToOklab(rgb, SRGB), g = rgbToOklab([gray, gray, gray], SRGB);
  const t = strength / 100;
  return toHex(clampRgb(oklabToRgb({ L: a.L * t + g.L * (1 - t), a: a.a * t + g.a * (1 - t), b: a.b * t + g.b * (1 - t) }, SRGB))) + alpha;
}

/** Two colours mixed in OKLab, `share` of the way to the second: what CSS's `color-mix(in oklab, a, b share%)` paints. */
export function mixOklab(a: string, b: string, share: number): string {
  if (share <= 0) return a;
  const x = rgbToOklab(parseHex(a), SRGB), y = rgbToOklab(parseHex(b), SRGB);
  return toHex(clampRgb(oklabToRgb({ L: x.L + (y.L - x.L) * share, a: x.a + (y.a - x.a) * share, b: x.b + (y.b - x.b) * share }, SRGB)));
}

/** Label tint (axes/accent.ts): 0 (the measured black or white) to 4 (Label tint's end, `tintedLabel`), in quarters. */
export const LABEL_TINT_STEPS = [0, 1, 2, 3, 4] as const;

/**
 * Solid (axes/accent.ts): the accent step solid fills sit on, per mode. Auto is the solver's own step (`chooseSolid`);
 * a step from 200 to 850 is that step under whichever label clears on it, black or white, or where neither does the
 * nearest step toward the accent's own label's side that carries it (scale.ts `solidAt`). From 200 since 2026-10-25
 * (owner: "Shade runs from light to deep for every colour"): 200 is the lightest step every hue carries black on at every
 * strength; 400 was the lightest when the label never flipped.
 */
export const SOLID_STEPS = [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850] as const;
export type SolidStep = (typeof SOLID_STEPS)[number];
export type SolidPick = SolidStep | "auto";

function round(value: number, places = 4): number {
  return Number(value.toFixed(places));
}
