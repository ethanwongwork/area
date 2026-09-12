/**
 * OKLab / OKLCh <-> RGB conversions.
 *
 * Implemented directly rather than taken from a library so that every constant is
 * auditable and pinned. Correctness is not assumed: `oklab.oracle.test.ts` proves
 * this module against colorjs.io (the CSS Color 4 reference implementation) across
 * a dense sweep of the space.
 *
 * Pipeline: OKLab <-> LMS <-> XYZ(D65) <-> linear RGB <-> gamma-encoded RGB.
 * Routing through XYZ keeps a single code path for every RGB gamut; the sRGB leg is
 * additionally cross-checked against Ottosson's published direct matrix.
 *
 * References:
 *   https://bottosson.github.io/posts/oklab/
 *   https://www.w3.org/TR/css-color-4/#color-conversion-code
 */

import {
  type Matrix3,
  type Vec3,
  D65,
  invert,
  multiplyMatrixVector as mul,
  rgbToXyzMatrix,
} from "./matrix.ts";

export type { Matrix3, Vec3 };
/** OKLCh: L in 0..1, C in 0..~0.4, h in degrees 0..360. */
export type Oklch = { L: number; C: number; h: number };
/** OKLab: L in 0..1, a/b roughly -0.4..0.4. */
export type Oklab = { L: number; a: number; b: number };
/** Gamma-encoded or linear RGB, each channel nominally 0..1. */
export type Rgb = Vec3;

// ---------------------------------------------------------------------------
// OKLab <-> XYZ(D65)
//
// Two authoritative constants, both from the CSS Color 4 conversion appendix.
// Their inverses are computed, never transcribed -- that is what makes the
// round-trip exact rather than merely close.
// ---------------------------------------------------------------------------

const XYZ_TO_LMS: Matrix3 = [
  [0.819022437996703, 0.3619062600528904, -0.1288737815209879],
  [0.0329836539323885, 0.9292868615863434, 0.0361446663506424],
  [0.0481771893596242, 0.2642395317527308, 0.6335478284694309],
];

const LMS_NONLINEAR_TO_OKLAB: Matrix3 = [
  [0.210454268309314, 0.7936177747023054, -0.0040720430116193],
  [1.9779985324311684, -2.4285922420485799, 0.450593709617411],
  [0.0259040424655478, 0.7827717124575296, -0.8086757549230774],
];

const LMS_TO_XYZ = invert(XYZ_TO_LMS);
const OKLAB_TO_LMS_NONLINEAR = invert(LMS_NONLINEAR_TO_OKLAB);

export function oklabToXyz(lab: Oklab): Vec3 {
  const lms = mul(OKLAB_TO_LMS_NONLINEAR, [lab.L, lab.a, lab.b]);
  return mul(LMS_TO_XYZ, [lms[0] ** 3, lms[1] ** 3, lms[2] ** 3]);
}

export function xyzToOklab(xyz: Vec3): Oklab {
  const lms = mul(XYZ_TO_LMS, xyz);
  const nl = mul(LMS_NONLINEAR_TO_OKLAB, [Math.cbrt(lms[0]), Math.cbrt(lms[1]), Math.cbrt(lms[2])]);
  return { L: nl[0], a: nl[1], b: nl[2] };
}

// ---------------------------------------------------------------------------
// RGB gamuts
//
// Each gamut is defined by its chromaticity primaries; both matrices are derived.
// Adding a gamut (rec2020, a4) is a two-line change with no new constants.
// ---------------------------------------------------------------------------

export interface Gamut {
  readonly id: "srgb" | "display-p3";
  /** CSS color-function name, for emitting `color(<id> r g b)`. */
  readonly cssId: string;
  readonly xyzToLinear: Matrix3;
  readonly linearToXyz: Matrix3;
  /** Linear-light -> gamma-encoded. */
  readonly encode: (x: number) => number;
  /** Gamma-encoded -> linear-light. */
  readonly decode: (x: number) => number;
}

/** The sRGB transfer function. Display P3 shares this curve and differs only in primaries. */
function srgbEncode(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const a = Math.abs(x);
  return a <= 0.0031308 ? 12.92 * x : sign * (1.055 * a ** (1 / 2.4) - 0.055);
}

function srgbDecode(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const a = Math.abs(x);
  return a <= 0.04045 ? x / 12.92 : sign * ((a + 0.055) / 1.055) ** 2.4;
}

function makeGamut(
  id: Gamut["id"],
  cssId: string,
  red: { x: number; y: number },
  green: { x: number; y: number },
  blue: { x: number; y: number },
): Gamut {
  const linearToXyz = rgbToXyzMatrix(red, green, blue, D65);
  return {
    id,
    cssId,
    linearToXyz,
    xyzToLinear: invert(linearToXyz),
    encode: srgbEncode,
    decode: srgbDecode,
  };
}

export const SRGB: Gamut = makeGamut(
  "srgb",
  "srgb",
  { x: 0.64, y: 0.33 },
  { x: 0.3, y: 0.6 },
  { x: 0.15, y: 0.06 },
);

export const DISPLAY_P3: Gamut = makeGamut(
  "display-p3",
  "display-p3",
  { x: 0.68, y: 0.32 },
  { x: 0.265, y: 0.69 },
  { x: 0.15, y: 0.06 },
);

// ---------------------------------------------------------------------------
// OKLab <-> RGB
// ---------------------------------------------------------------------------

/** OKLab -> linear-light RGB in the given gamut. Values may fall outside 0..1. */
export function oklabToLinearRgb(lab: Oklab, gamut: Gamut): Rgb {
  return mul(gamut.xyzToLinear, oklabToXyz(lab));
}

/** OKLab -> gamma-encoded RGB. Values may fall outside 0..1 (i.e. out of gamut). */
export function oklabToRgb(lab: Oklab, gamut: Gamut): Rgb {
  const lin = oklabToLinearRgb(lab, gamut);
  return [gamut.encode(lin[0]), gamut.encode(lin[1]), gamut.encode(lin[2])];
}

/** Gamma-encoded RGB -> OKLab. */
export function rgbToOklab(rgb: Rgb, gamut: Gamut): Oklab {
  const lin: Vec3 = [gamut.decode(rgb[0]), gamut.decode(rgb[1]), gamut.decode(rgb[2])];
  return xyzToOklab(mul(gamut.linearToXyz, lin));
}

// ---------------------------------------------------------------------------
// OKLCh <-> OKLab
// ---------------------------------------------------------------------------

export function lchToLab({ L, C, h }: Oklch): Oklab {
  const rad = (h * Math.PI) / 180;
  return { L, a: C * Math.cos(rad), b: C * Math.sin(rad) };
}

export function labToLch({ L, a, b }: Oklab): Oklch {
  const C = Math.hypot(a, b);
  // Hue is meaningless at C ~ 0; report 0 rather than a numerical artefact.
  const h = C < 1e-7 ? 0 : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  return { L, C, h };
}

export function oklchToRgb(c: Oklch, gamut: Gamut): Rgb {
  return oklabToRgb(lchToLab(c), gamut);
}

// ---------------------------------------------------------------------------
// Gamut membership & formatting
// ---------------------------------------------------------------------------

/**
 * Tolerance for "is this channel inside 0..1". 1/512 is half an 8-bit step; it
 * absorbs float noise without admitting a visibly clipped colour.
 */
export const GAMUT_EPSILON = 1 / 512;

export function rgbInGamut(rgb: Rgb, epsilon = GAMUT_EPSILON): boolean {
  return rgb.every((v) => v >= -epsilon && v <= 1 + epsilon);
}

export function inGamut(c: Oklch, gamut: Gamut, epsilon = GAMUT_EPSILON): boolean {
  return rgbInGamut(oklchToRgb(c, gamut), epsilon);
}

export function clampRgb(rgb: Rgb): Rgb {
  return [
    Math.min(1, Math.max(0, rgb[0])),
    Math.min(1, Math.max(0, rgb[1])),
    Math.min(1, Math.max(0, rgb[2])),
  ];
}

/** Quantise to 8-bit and format as #rrggbb. Input is clamped first. */
export function toHex(rgb: Rgb): string {
  const [r, g, b] = clampRgb(rgb);
  const h = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** Quantise to 8-bit and format as #rrggbbaa. */
export function toHex8(rgb: Rgb, alpha: number): string {
  const a = Math.min(1, Math.max(0, alpha));
  const h = Math.round(a * 255)
    .toString(16)
    .padStart(2, "0");
  return `${toHex(rgb)}${h}`;
}

/** Format as a CSS `color(display-p3 r g b)` string with 4-decimal channels. */
export function toP3Css(rgb: Rgb): string {
  const [r, g, b] = clampRgb(rgb);
  const f = (v: number) => Number(v.toFixed(4)).toString();
  return `color(display-p3 ${f(r)} ${f(g)} ${f(b)})`;
}

/** Format as a CSS `oklch()` string. Documentation and debugging only — never a token value. */
export function toOklchCss({ L, C, h }: Oklch): string {
  return `oklch(${(L * 100).toFixed(2)}% ${C.toFixed(4)} ${h.toFixed(2)})`;
}

export function parseHex(hex: string): Rgb {
  const s = hex.replace("#", "");
  const full = s.length === 3 ? s.split("").map((ch) => ch + ch).join("") : s;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`parseHex: not a 6-digit hex colour: "${hex}"`);
  return [
    parseInt(full.slice(0, 2), 16) / 255,
    parseInt(full.slice(2, 4), 16) / 255,
    parseInt(full.slice(4, 6), 16) / 255,
  ];
}

// ---------------------------------------------------------------------------
// Difference
// ---------------------------------------------------------------------------

/**
 * Euclidean distance in OKLab. CSS Color 4 §14.2.1: one JND is an OkLCh difference
 * of 0.02, because OKLab's lightness range is 0..1 rather than CIE Lab's 0..100.
 */
export function deltaEOk(a: Oklab, b: Oklab): number {
  return Math.hypot(a.L - b.L, a.a - b.a, a.b - b.b);
}

export function deltaEOkLch(a: Oklch, b: Oklch): number {
  return deltaEOk(lchToLab(a), lchToLab(b));
}

/** One just-noticeable difference in OKLab, per CSS Color 4 §14.2.1. */
export const JND = 0.02;
