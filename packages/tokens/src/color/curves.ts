/**
 * The shape of every Area colour scale.
 *
 * Twelve steps, with the role of each step fixed across every scale and both themes.
 * A component asks for "step 4" and gets a hover background whether the scale is gray,
 * blue, or amber -- that invariance is what lets the colour axis swap a whole palette
 * without touching a single component rule.
 *
 * Role map (shared with Radix's scale, which is the de facto vocabulary):
 *
 *    1  page background            7  border, default
 *    2  subtle background          8  border, strong / focus ring
 *    3  component background       9  solid fill
 *    4  component background hover 10  solid fill hover
 *    5  component background active 11 text, secondary
 *    6  border, subtle             12 text, primary
 */

export type Twelve<T> = readonly [T, T, T, T, T, T, T, T, T, T, T, T];

export const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type Step = (typeof STEPS)[number];

/** What each step is for. Rendered into the docs so the contract is visible, not folklore. */
export const STEP_ROLES: Twelve<string> = [
  "Page background",
  "Subtle background",
  "Component background",
  "Component background, hover",
  "Component background, active",
  "Border, subtle",
  "Border, default",
  "Border, strong and focus ring",
  "Solid fill",
  "Solid fill, hover",
  "Text, secondary",
  "Text, primary",
];

/**
 * Lightness curves.
 *
 * Deliberately not a formula. The step spacing encodes where UI needs resolution:
 * an even, quiet 2.4-point cadence through the background band (3 -> 5) so hover and
 * active read as equal increments, widening through the borders, then a large jump at
 * 8 -> 9 because that is where the scale stops being chrome and becomes a fill.
 *
 * Neutrals and chromatics need different curves. A chromatic tint at a given lightness
 * reads lighter than a grey at the same lightness, so the chromatic light-end steps sit
 * slightly lower to keep apparent weight matched across scales.
 *
 * Step 9 is a placeholder here: `buildScale` replaces it with a value snapped toward the
 * hue's own gamut cusp, which is what puts peak chroma in the right place per hue.
 */
export const L_LIGHT_NEUTRAL: Twelve<number> = [
  0.9925, 0.98, 0.956, 0.932, 0.908, 0.882, 0.846, 0.782, 0.615, 0.565, 0.492, 0.24,
];

export const L_LIGHT_CHROMATIC: Twelve<number> = [
  0.9915, 0.978, 0.951, 0.925, 0.899, 0.871, 0.833, 0.766, 0.64, 0.595, 0.52, 0.286,
];

/**
 * Dark curves are not inversions. Step 9 holds the same lightness as in light mode --
 * the brand fill stays recognisably the same colour across themes -- while the text and
 * background ends are re-derived, because the eye needs more separation near black than
 * near white to read the same contrast.
 */
export const L_DARK_NEUTRAL: Twelve<number> = [
  0.1755, 0.2125, 0.2515, 0.2825, 0.3115, 0.348, 0.408, 0.51, 0.665, 0.72, 0.806, 0.949,
];

export const L_DARK_CHROMATIC: Twelve<number> = [
  0.1885, 0.2245, 0.2695, 0.3045, 0.3375, 0.3775, 0.4395, 0.539, 0.64, 0.694, 0.806, 0.951,
];

/**
 * Chroma shape: a 0..1 multiplier against the scale's peak chroma, peaking at step 9.
 *
 * The peak itself is supplied per scale -- for a chromatic scale it is the hue's own
 * gamut cusp chroma, for a neutral it is a small absolute cap (0 for a true grey, ~0.014
 * for a tinted one). Keeping the *shape* separate from the *peak* is what lets one curve
 * serve both a pure grey and a saturated amber.
 *
 * The taper is a skewed bell -- rising steeply, falling gently -- because a solid fill and
 * its hover (9, 10) must stay saturated while page and component backgrounds (1-3) must
 * stay near-neutral or they tint the entire interface.
 */
export const C_SHAPE_NEUTRAL: Twelve<number> = [
  0.3, 0.45, 0.62, 0.72, 0.82, 0.9, 0.96, 1.0, 1.0, 1.0, 0.86, 0.55,
];

export const C_SHAPE_CHROMATIC_LIGHT: Twelve<number> = [
  0.05, 0.09, 0.16, 0.23, 0.3, 0.38, 0.48, 0.63, 1.0, 0.97, 0.82, 0.45,
];

export const C_SHAPE_CHROMATIC_DARK: Twelve<number> = [
  0.09, 0.13, 0.2, 0.27, 0.33, 0.4, 0.5, 0.64, 1.0, 0.95, 0.72, 0.32,
];

/**
 * Hue drift, expressed as degrees of rotation per unit of lightness distance from step 9.
 *
 * A constant hue angle does not read as a constant hue across a lightness range -- the
 * Abney effect. Every serious palette compensates; Tailwind v4's shipped values drift
 * amber by 49.6 degrees, yellow by 48.4, orange by 37.4, blue by 13.3, while green and
 * violet move less than 3.
 *
 * Anchoring at step 9 rather than tabulating per step matters: step 9 is the hue the user
 * actually chose, and the drift stays correct if the lightness curve is later retuned.
 */
export interface HueDrift {
  /** Total degrees of rotation accumulated from step 9 to the darkest step in the scale. */
  darkward: number;
  /** Total degrees of rotation accumulated from step 9 to the lightest step in the scale. */
  lightward: number;
}

export const NO_DRIFT: HueDrift = { darkward: 0, lightward: 0 };

/**
 * Hue at one step, given how far it sits from step 9 as a fraction of the scale's span.
 *
 * Normalising by the span rather than by raw lightness is load-bearing. Step 9 does not sit
 * at a fixed lightness -- a dark-foreground hue such as yellow puts it near L 0.91 while
 * blue puts it near L 0.57 -- so a raw degrees-per-lightness rate over-rotates badly for
 * exactly the hues that need drift most. Normalised, `darkward` means "degrees of rotation
 * by the darkest step", which is directly comparable to the measured end-to-end drift in
 * shipping palettes and cannot be thrown off by retuning a lightness curve.
 */
export function driftedHue(
  baseHue: number,
  L: number,
  L9: number,
  drift: HueDrift,
  span: { darkest: number; lightest: number },
): number {
  const dL = L9 - L;
  let rotation = 0;

  if (dL > 0) {
    const range = L9 - span.darkest;
    if (range > 1e-6) rotation = drift.darkward * (dL / range);
  } else if (dL < 0) {
    const range = span.lightest - L9;
    if (range > 1e-6) rotation = drift.lightward * (-dL / range);
  }

  return (((baseHue + rotation) % 360) + 360) % 360;
}
