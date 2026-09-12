/**
 * The shape of every Area colour scale.
 *
 * Sixteen steps, named by their own lightness. `blue-58` is the blue at OKLCh L 0.58, in
 * every theme, for every scale. That is the same reasoning spacing uses -- `--area-space-16`
 * is sixteen pixels -- and it buys three things an ordinal 1..12 cannot:
 *
 *   The name is checkable. `assertLadder()` re-reads the emitted lightness and compares it
 *   to the name, so a scale whose generator drifts fails the build instead of shipping a
 *   token that lies about itself.
 *
 *   Lightness is consistent across hues by construction. `yellow-58` and `blue-58` are the
 *   same lightness, so two tones can be swapped without changing the weight of a layout.
 *   The previous ordinal scale could not promise this and did not deliver it: its step 9
 *   ranged from L 0.548 to L 0.910 across the twelve hues.
 *
 *   Dark mode is the same ramp read from the other end. There is one set of colours, not
 *   two; `semantic/aliases.ts` points each token at one level for light and another for
 *   dark. See `INVERSION` below.
 *
 * What the name does *not* encode is role. A step is a colour, not a job. Which level is a
 * background and which is a border is a decision the semantic layer makes, per theme, and
 * it is written down in one table rather than implied by an ordinal.
 */

/**
 * The ladder.
 *
 * Spacing is even through the middle at 7 points of lightness and tightens toward both
 * ends -- 2 points at the top, 4 at the bottom. That is not decoration. Interfaces stack
 * many near-white surfaces (page, card, table header, input) and many near-black ones in
 * dark mode, and those need to be separable; the middle of the ramp holds one or two
 * colours per interface and can afford to move in bigger jumps.
 *
 * The ratio between the largest and smallest gap is 3.5. The ordinal scale this replaced
 * ran to 20.2, with a single 0.252 cliff between its last two steps.
 */
export const LEVELS = [
  99, 97, 94, 90, 85, 79, 72, 65, 58, 51, 44, 37, 31, 26, 21, 17,
] as const;

export type Level = (typeof LEVELS)[number];

/** A value per level, in ladder order (lightest first). */
export type Ramp<T> = readonly T[];

/** Lightness of a level, as OKLCh L. The name *is* the value; this is the decoder. */
export const levelLightness = (level: Level): number => level / 100;

/**
 * How much of the reachable chroma each level claims.
 *
 * This is deliberately flat. The sRGB gamut already has a strong shape -- at L 0.95 a
 * yellow can reach C 0.107 while a blue can reach only 0.024 -- so multiplying by a second
 * bell curve, as the previous generator did, desaturates twice and is what made the old
 * teal and cyan peak at C 0.09 against violet's 0.24.
 *
 * Holding the fraction near the ceiling instead means every hue is as vivid as the gamut
 * permits at every lightness, which is the only definition of "as bright as possible" that
 * survives contact with a gamut boundary. The ends ease off: the top because a page
 * background should be a tint and not a wash, the bottom harder because a very dark,
 * very saturated colour quantises badly in 8 bits and reads as muddy rather than rich.
 */
export const CHROMA_FRACTION: Ramp<number> = [
  0.85, 0.88, 0.9, 0.92, 0.93, 0.94, 0.95, 0.95, 0.95, 0.94, 0.92, 0.9, 0.87, 0.84, 0.8, 0.74,
];

/**
 * Chroma shape for the neutrals, as a fraction of the scale's absolute tint cap.
 *
 * Neutrals cannot use the gamut ceiling -- at L 0.5 that would be a fully saturated colour,
 * not a grey -- so they carry an absolute cap and this shape distributes it. The tint peaks
 * through the middle and eases at both ends, because a near-white and a near-black read as
 * colour-cast far more readily than a mid grey does.
 */
export const NEUTRAL_CHROMA_SHAPE: Ramp<number> = [
  0.34, 0.45, 0.6, 0.72, 0.82, 0.9, 0.96, 1.0, 1.0, 1.0, 0.96, 0.9, 0.82, 0.72, 0.6, 0.45,
];

/**
 * Hue is constant down a scale. There is no drift table.
 *
 * The previous generator rotated hue with lightness, carrying Tailwind's measured
 * end-to-end drift (amber -49.6 degrees, yellow -48.4). That compensates for the Abney
 * effect, which is real -- but it was built for palettes defined in CIELCh, where the
 * uncorrected error is large. OKLab was fit specifically to hold perceived hue constant
 * under lightness change, and it is the reason this system chose OKLCh in the first place;
 * layering a CIELCh-era correction on top of it double-corrects.
 *
 * It also broke a promise the scale ought to keep. With drift, `yellow-31` was not the same
 * hue as `yellow-85`, so dark yellow text on a light yellow ground was two different
 * colours that happened to share a token prefix. Constant hue means any two steps of a
 * scale harmonise by construction.
 *
 * The honest cost: a dark yellow is olive, because a dark yellow *is* olive. Rotating it
 * toward orange would make it a dark orange wearing a yellow name.
 */
export const HUE_IS_CONSTANT = true;

/**
 * Where each semantic slot sits in light and in dark.
 *
 * This is the inversion, stated once. It is close to a mirror but deliberately not an exact
 * one: the dark column is compressed at the background end (17 -> 21 -> 26 -> 31 spans 14
 * points where light's 99 -> 97 -> 94 -> 90 spans 9) because separation near black needs
 * more lightness distance to read as the same visual step.
 *
 * `semantic/aliases.ts` consumes this; it is exported here so the documentation can render
 * the two columns side by side rather than describing them.
 */
export interface Inversion {
  light: Level;
  dark: Level;
}

export const INVERSION = {
  /** The page, and panels raised off it. */
  page: { light: 99, dark: 17 },
  surface: { light: 99, dark: 21 },
  subtle: { light: 97, dark: 26 },
  /** A control's own fill, at rest, hover, and active. */
  component: { light: 97, dark: 26 },
  componentHover: { light: 94, dark: 31 },
  componentActive: { light: 90, dark: 37 },
  /** Strokes, quietest to loudest. */
  borderSubtle: { light: 90, dark: 37 },
  border: { light: 79, dark: 44 },
  borderStrong: { light: 72, dark: 51 },
  /** Text, from the least emphatic that is still content to the most. */
  textDisabled: { light: 72, dark: 51 },
  textPlaceholder: { light: 58, dark: 65 },
  textSubtle: { light: 51, dark: 72 },
  textMuted: { light: 44, dark: 79 },
  textTonal: { light: 44, dark: 85 },
  textTonalStrong: { light: 37, dark: 90 },
  textDefault: { light: 26, dark: 94 },
  /** A filled neutral that carries inverted text: tooltip, toast, primary button. */
  inverseFill: { light: 21, dark: 97 },
  inverseFillHover: { light: 17, dark: 99 },
  inverseText: { light: 99, dark: 17 },
  secondaryFill: { light: 31, dark: 90 },
  secondaryFillHover: { light: 26, dark: 94 },
  /** The level a translucent scrim is solved from. */
  scrim: { light: 44, dark: 21 },
} as const satisfies Record<string, Inversion>;

export type Slot = keyof typeof INVERSION;
