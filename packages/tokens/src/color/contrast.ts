/**
 * Contrast measurement: WCAG 2.2 relative-luminance ratio and APCA Lc.
 *
 * Area gates on both, at different strengths:
 *
 *   WCAG 2.2 is the hard gate everywhere. It is the legally operative standard
 *   (EN 301 549, Section 508, and the European Accessibility Act, enforceable since
 *   June 2025). APCA is explicitly not normative -- it was removed from the WCAG 3
 *   draft in July 2023, and WCAG 3 still reads "contrast measure to be determined".
 *
 *   APCA is additionally a hard gate in dark themes, because the WCAG 2.x formula
 *   demonstrably overstates contrast near black. Vercel's own shipping dark secondary
 *   text measures 8.03:1 under WCAG -- comfortably AA -- and Lc -50.9 under APCA, below
 *   the readable minimum for body text. Certifying in WCAG alone would pass that.
 *
 * The WCAG formula is six lines and has not changed since 2008, so it is implemented
 * here rather than taken as a dependency. APCA is not: its constants have changed
 * between revisions, so `apca-w3` is pinned to an exact version and locked by a
 * known-value test.
 */
// @ts-expect-error -- apca-w3 ships no type declarations.
import { APCAcontrast, sRGBtoY } from "apca-w3";
import { type Rgb, parseHex } from "./oklab.ts";

/** WCAG 2.x relative luminance. https://www.w3.org/WAI/WCAG22/Techniques/general/G17 */
export function relativeLuminance([r, g, b]: Rgb): number {
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/**
 * WCAG 2.2 contrast ratio, 1..21. Order-independent.
 *
 * Note there is no rounding allowance: 4.499:1 does not meet a 4.5:1 threshold.
 */
export function wcagContrast(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export function wcagContrastHex(a: string, b: string): number {
  return wcagContrast(parseHex(a), parseHex(b));
}

/**
 * APCA lightness contrast, reported as Lc.
 *
 * Polarity matters and the argument order is not symmetric: a negative Lc means light
 * text on a dark background. `apca.test.ts` locks this against the canonical anchors.
 */
export function apcaContrast(textHex: string, backgroundHex: string): number {
  const value = APCAcontrast(sRGBtoY(hexToBytes(textHex)), sRGBtoY(hexToBytes(backgroundHex)));
  return typeof value === "number" ? value : Number(value);
}

/** Absolute Lc, for threshold comparisons where polarity is not the question. */
export function apcaMagnitude(textHex: string, backgroundHex: string): number {
  return Math.abs(apcaContrast(textHex, backgroundHex));
}

function hexToBytes(hex: string): [number, number, number] {
  const [r, g, b] = parseHex(hex);
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * APCA readability levels, from the published "APCA in a Nutshell" table.
 * Area's scale roles map onto these: step 12 to BODY, step 11 to CONTENT, borders to NON_TEXT.
 */
export const APCA = {
  /** Preferred for fluent body text. */
  FLUENT: 90,
  /** Minimum for columns of body text. */
  BODY: 75,
  /** Minimum for content text that is not body copy. */
  CONTENT: 60,
  /** Minimum for large or heavy text. */
  LARGE: 45,
  /** The level the APCA table names for placeholder text specifically. */
  PLACEHOLDER: 30,
  /** Minimum for non-text that must be discernible. */
  NON_TEXT: 15,
} as const;

/** WCAG 2.2 thresholds. */
export const WCAG = {
  /** SC 1.4.3, normal text. */
  TEXT: 4.5,
  /** SC 1.4.3, large text (>=24px, or >=18.66px bold). */
  LARGE_TEXT: 3,
  /** SC 1.4.11, non-text contrast. */
  NON_TEXT: 3,
  /** SC 1.4.6, enhanced. */
  ENHANCED: 7,
} as const;
