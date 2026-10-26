/**
 * Brand families (owner, 2026-10-26: "can an entire color palette be created/generated based on the input/choice of 1
 * specific color"; picks on the review page: an exact colour, up to three, harmonised status, eight supporting colours,
 * brand surfaces; research and prototype: docs/research/brand-palette-2026-10-26). Area's palette stays the default:
 * these families exist only where a brand is set, and never enter palette.json or the shared scale cache.
 *
 *   brandFamily       an exact colour on Area's ladder: its hue's generated family (generate.ts), the nearest rung moved
 *                     onto the colour with the lightness offset tapering to nothing at the ladder's ends, and every
 *                     rung's chroma at the colour's *character*, its share of the chroma sRGB allows against the
 *                     palette's at that hue and rung (Material's Fidelity: the seed exact)
 *   harmonisedFamily  a palette family turned toward the brand by half the hue difference, at most 15° (Material's
 *                     Blend.harmonize), at the brand's character but never under HARMONY_FLOOR of the palette's, so a
 *                     status keeps reading as itself
 *   supportingFamilies  SUPPORT_COUNT hues stepped round the wheel from the brand, at its character (the categorical
 *                     palette: tags, avatars, chart series, events, folders)
 */
import { generatedFamily, type PaletteRung } from "./generate.ts";
import { LEVELS, type Level } from "./curves.ts";
import { SRGB, clampRgb, labToLch, oklchToRgb, parseHex, rgbToOklab, toHex } from "./oklab.ts";
import { maxChromaAt } from "./gamut.ts";
import { wcagContrastHex } from "./contrast.ts";
import PALETTE from "./palette.json" with { type: "json" };

export type Family = Readonly<Record<string, PaletteRung>>;
const FAMILIES = PALETTE.families as unknown as Record<string, Family>;

/** The least share of the palette's chroma a harmonised or supporting colour keeps, so a red still reads as red. */
export const HARMONY_FLOOR = 0.45;
/** The most a status hue turns toward the brand (Material's harmonize cap), and the share of the difference it turns. */
export const HARMONY_MAX_TURN = 15;
export const HARMONY_SHARE = 0.5;
/** How many supporting colours a brand gets (owner's pick, 2026-10-26). */
export const SUPPORT_COUNT = 8;
/** Below this chroma a colour has no hue worth keeping: its family is drawn at the palette's blue, nearly grey. */
const GREY_CHROMA = 0.012;

const room = (L: number, h: number) => maxChromaAt(L, h, SRGB);
const shareOf = (rung: PaletteRung) => Math.min(1, rung.oklch.C / Math.max(1e-6, room(rung.oklch.L, rung.oklch.H)));
const round = (n: number) => Math.round(n * 1e4) / 1e4;
const rungAt = (L: number, C: number, h: number): PaletteRung => ({
  hex: toHex(clampRgb(oklchToRgb({ L, C, h }, SRGB))),
  oklch: { L: round(L), C: round(C), H: round(h) },
});

/** A colour's OKLCH, its hue held at the palette's blue where it has too little chroma to have one. */
export function brandLch(hex: string): { L: number; C: number; h: number } {
  const c = labToLch(rgbToOklab(parseHex(hex), SRGB));
  return c.C < GREY_CHROMA || !Number.isFinite(c.h) ? { L: c.L, C: c.C, h: FAMILIES.blue!["500"]!.oklch.H } : c;
}

/** The rung of a family whose lightness is nearest. */
const nearestLevel = (family: Family, L: number): Level =>
  LEVELS.reduce((a, l) => Math.abs(family[String(l)]!.oklch.L - L) < Math.abs(family[String(a)]!.oklch.L - L) ? l : a, LEVELS[0]!);

/** How vivid a colour is for its hue and lightness, against the palette at that hue and rung: 1 is the palette's own. */
export function character(hex: string): number {
  const c = brandLch(hex), base = generatedFamily(c.h);
  const own = Math.min(1, c.C / Math.max(1e-6, room(c.L, c.h)));
  return own / Math.max(1e-6, shareOf(base[String(nearestLevel(base, c.L))]!));
}

/** A family at a hue with every rung's chroma share scaled by `k` (at most the room sRGB allows). */
function atCharacter(hue: number, k: number): Record<string, PaletteRung> {
  const base = generatedFamily(hue);
  return Object.fromEntries(LEVELS.map(level => {
    const rung = base[String(level)]!;
    return [String(level), rungAt(rung.oklch.L, Math.min(1, shareOf(rung) * k) * room(rung.oklch.L, hue), hue)];
  }));
}

export interface BrandFamily {
  family: Family;
  /** The rung the brand colour sits on, exactly. */
  anchor: Level;
  hue: number;
  character: number;
  /** The label that reads better on the brand colour itself: a family's solid starts from it. */
  label: "#ffffff" | "#000000";
}

/** An exact colour on Area's ladder. */
export function brandFamily(hex: string): BrandFamily {
  const colour = hex.toLowerCase(), c = brandLch(colour), base = generatedFamily(c.h);
  const anchor = nearestLevel(base, c.L), ai = LEVELS.indexOf(anchor), last = LEVELS.length - 1;
  const dL = c.L - base[String(anchor)]!.oklch.L, k = character(colour);
  const family: Record<string, PaletteRung> = {};
  LEVELS.forEach((level, i) => {
    if (level === anchor) { family[String(level)] = { hex: colour, oklch: { L: round(c.L), C: round(c.C), H: round(c.h) } }; return; }
    // The offset that puts the brand on its rung, fading to nothing at either end of the ladder.
    const w = i < ai ? i / ai : (last - i) / (last - ai);
    const rung = base[String(level)]!, L = rung.oklch.L + dL * w;
    family[String(level)] = rungAt(L, Math.min(1, shareOf(rung) * k) * room(L, c.h), c.h);
  });
  const label = wcagContrastHex("#ffffff", colour) >= wcagContrastHex("#000000", colour) ? "#ffffff" : "#000000";
  return { family, anchor, hue: c.h, character: k, label };
}

/** A palette family (a status role's) turned toward the brand, at the brand's character. */
export function harmonisedFamily(familyId: string, brandHex: string): Family {
  const from = FAMILIES[familyId]!["500"]!.oklch.H, to = brandLch(brandHex).h;
  const diff = ((to - from + 540) % 360) - 180;
  const hue = (from + Math.sign(diff) * Math.min(Math.abs(diff) * HARMONY_SHARE, HARMONY_MAX_TURN) + 360) % 360;
  return atCharacter(hue, Math.max(HARMONY_FLOOR, Math.min(1, character(brandHex))));
}

/** The supporting palette's families: hues stepped round the wheel from the brand, at its character. */
export function supportingFamilies(brandHex: string, count = SUPPORT_COUNT): Array<{ hue: number; family: Family }> {
  const c = brandLch(brandHex), k = Math.max(HARMONY_FLOOR, Math.min(1, character(brandHex)));
  return Array.from({ length: count }, (_, i) => {
    const hue = (c.h + (360 / count) * i) % 360;
    return { hue: Math.round(hue), family: atCharacter(hue, k) };
  });
}

/** Area's own supporting palette, with no brand: eight of the palette's families, round the wheel. */
export const PALETTE_SUPPORT = ["red", "orange", "yellow", "green", "teal", "blue", "purple", "pink"] as const;
export const paletteFamily = (id: string): Family => FAMILIES[id]!;
