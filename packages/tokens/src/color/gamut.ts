/**
 * Gamut boundary search and gamut mapping.
 *
 * Two distinct jobs:
 *
 *   1. `maxChromaAt` / `findCusp` -- where the gamut boundary *is*. The scale
 *      generator uses this to place peak chroma at each hue's own cusp, which is why
 *      a single lightness curve can work across hues whose cusps differ by 40 points
 *      of lightness (blue ~0.45, yellow ~0.87).
 *
 *   2. `gamutMap` -- pulling an out-of-gamut colour back in. Implements CSS Color 4
 *      section 14.2.1 exactly, including the local-MINDE clip comparison that naive
 *      reimplementations drop (and which makes results noticeably duller when missed).
 *
 * Never clip naively: the spec measures a 69-degree hue shift from clipping a single
 * colour, because clipping changes the ratio between primaries.
 */
import {
  type Gamut,
  type Oklch,
  type Rgb,
  JND,
  clampRgb,
  deltaEOkLch,
  labToLch,
  oklchToRgb,
  rgbInGamut,
  rgbToOklab,
} from "./oklab.ts";

/** Chroma beyond this is outside every real display gamut; used to bound searches. */
const CHROMA_CEILING = 0.5;

/**
 * Largest chroma that stays inside `gamut` at the given lightness and hue.
 *
 * Binary search rather than an analytic solution: Ottosson's fast `compute_max_saturation`
 * polynomial is fitted to sRGB specifically and would need a second fit for P3. One
 * numeric routine is correct for every gamut, and this runs at build time where the
 * cost is irrelevant.
 */
export function maxChromaAt(L: number, h: number, gamut: Gamut, epsilon = 1e-6): number {
  if (L <= 0 || L >= 1) return 0;
  if (!isInGamut({ L, C: epsilon, h }, gamut)) return 0;

  let lo = 0;
  let hi = CHROMA_CEILING;
  while (hi - lo > epsilon) {
    const mid = (lo + hi) / 2;
    if (isInGamut({ L, C: mid, h }, gamut)) lo = mid;
    else hi = mid;
  }
  return lo;
}

function isInGamut(c: Oklch, gamut: Gamut): boolean {
  // Exact boundary test -- no epsilon slack, or the cusp drifts outside the gamut.
  return rgbInGamut(oklchToRgb(c, gamut), 0);
}

export interface Cusp {
  /** Lightness at which this hue reaches its maximum chroma. */
  L: number;
  /** That maximum chroma. */
  C: number;
}

/**
 * The gamut cusp for a hue: the (L, C) at which chroma is greatest.
 *
 * `maxChromaAt` is unimodal in L for an RGB gamut -- it rises to the cusp and falls
 * away -- so a coarse scan to bracket the peak followed by golden-section refinement
 * converges reliably without depending on a derivative.
 */
export function findCusp(h: number, gamut: Gamut, epsilon = 1e-5): Cusp {
  const STEPS = 64;
  let bestL = 0.5;
  let bestC = -1;
  for (let i = 1; i < STEPS; i++) {
    const L = i / STEPS;
    const C = maxChromaAt(L, h, gamut, 1e-5);
    if (C > bestC) {
      bestC = C;
      bestL = L;
    }
  }

  // Golden-section search inside the bracket either side of the coarse peak.
  const invPhi = (Math.sqrt(5) - 1) / 2;
  let lo = Math.max(0, bestL - 1 / STEPS);
  let hi = Math.min(1, bestL + 1 / STEPS);
  let c = hi - invPhi * (hi - lo);
  let d = lo + invPhi * (hi - lo);
  let fc = maxChromaAt(c, h, gamut, 1e-7);
  let fd = maxChromaAt(d, h, gamut, 1e-7);

  while (hi - lo > epsilon) {
    if (fc > fd) {
      hi = d;
      d = c;
      fd = fc;
      c = hi - invPhi * (hi - lo);
      fc = maxChromaAt(c, h, gamut, 1e-7);
    } else {
      lo = c;
      c = d;
      fc = fd;
      d = lo + invPhi * (hi - lo);
      fd = maxChromaAt(d, h, gamut, 1e-7);
    }
  }

  const L = (lo + hi) / 2;
  return { L, C: maxChromaAt(L, h, gamut, 1e-7) };
}

export interface GamutMapResult {
  /** The in-gamut colour, in OKLCh. */
  oklch: Oklch;
  /** Its gamma-encoded RGB, guaranteed within 0..1. */
  rgb: Rgb;
  /** OKLab distance from the requested colour. 0 when it was already in gamut. */
  deltaE: number;
  /** True when the requested colour needed mapping at all. */
  mapped: boolean;
}

/**
 * CSS Color 4 section 14.2.1: constant lightness, constant hue, binary-search chroma
 * reduction with local MINDE.
 *
 * The `deltaE < JND` branch inside the loop is the part that matters and the part most
 * often omitted: at each step it compares the *clipped* colour against the
 * chroma-reduced one and accepts the clipped one when they are perceptually
 * indistinguishable. Dropping it yields colours measurably duller than the browser's.
 */
export function gamutMap(color: Oklch, gamut: Gamut): GamutMapResult {
  const direct = oklchToRgb(color, gamut);
  if (rgbInGamut(direct, 0)) {
    return { oklch: color, rgb: direct, deltaE: 0, mapped: false };
  }

  if (color.L >= 1) {
    return { oklch: { L: 1, C: 0, h: color.h }, rgb: [1, 1, 1], deltaE: 0, mapped: true };
  }
  if (color.L <= 0) {
    return { oklch: { L: 0, C: 0, h: color.h }, rgb: [0, 0, 0], deltaE: 0, mapped: true };
  }

  const EPSILON = 0.0001;
  const current: Oklch = { ...color };
  let clipped = clampRgb(direct);

  const clippedLch = (rgb: Rgb) => labToLch(rgbToOklab(rgb, gamut));
  let error = deltaEOkLch(clippedLch(clipped), current);
  if (error < JND) {
    return finish(clipped, color, gamut);
  }

  let min = 0;
  let max = color.C;
  let minInGamut = true;

  while (max - min > EPSILON) {
    const chroma = (min + max) / 2;
    current.C = chroma;

    if (minInGamut && rgbInGamut(oklchToRgb(current, gamut), 0)) {
      min = chroma;
      continue;
    }

    clipped = clampRgb(oklchToRgb(current, gamut));
    error = deltaEOkLch(clippedLch(clipped), current);

    if (error < JND) {
      if (JND - error < EPSILON) return finish(clipped, color, gamut);
      minInGamut = false;
      min = chroma;
    } else {
      max = chroma;
    }
  }

  return finish(clipped, color, gamut);
}

function finish(rgb: Rgb, requested: Oklch, gamut: Gamut): GamutMapResult {
  const safe = clampRgb(rgb);
  const oklch = labToLch(rgbToOklab(safe, gamut));
  return { oklch, rgb: safe, deltaE: deltaEOkLch(oklch, requested), mapped: true };
}

/** Convenience: map into gamut and return only the resulting colour. */
export function toGamut(color: Oklch, gamut: Gamut): Oklch {
  return gamutMap(color, gamut).oklch;
}
