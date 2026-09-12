/**
 * The shape of every Area colour scale.
 *
 * Nineteen steps, named by their own lightness. `blue-55` is the blue at OKLCh L 0.55, in
 * every theme, for every scale. That is the same reasoning spacing uses -- `--area-space-16`
 * is sixteen pixels -- and it buys three things an ordinal 1..12 cannot:
 *
 *   The name is checkable. `assertLadder()` re-reads the emitted lightness and compares it
 *   to the name, so a scale whose generator drifts fails the build instead of shipping a
 *   token that lies about itself.
 *
 *   Lightness is consistent across hues by construction. `yellow-55` and `blue-55` are the
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
 * The ladder: every five points of lightness, from white to near-black.
 *
 * Uniform on purpose. An earlier version tightened the ends -- 99, 97, 94, 90, 85, 79 --
 * on the reasoning that interfaces stack many near-white surfaces. The rungs were right
 * and the *names* were not: nothing distinguished 99 from 98, the gaps carried all the
 * meaning, and the numbers implied a 1% resolution that was never real. You could not
 * name a neighbour without consulting the list.
 *
 * A round grid fixes that without giving up the property that makes the name worth having.
 * `WGHT_RAMP` is the same shape of decision: 100, 200, 300 are real font weights on a round
 * grid, not indices. Five points is also roughly the smallest lightness step that stays
 * reliably distinguishable as a flat surface, so the grid is not merely tidy.
 *
 * The cost is subtlety at the top: page to subtle is now 100 -> 95 rather than 99 -> 97.
 * That is GitHub's gap (#ffffff to #f6f8fa) and Notion's, so it is a normal amount of
 * separation rather than a compromise. The number of usable near-white rungs is unchanged
 * at four, and level 100 buys a pure white page, which the old ladder could not reach.
 */
export const LEVELS = [
  100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10,
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
  0.85, 0.88, 0.9, 0.92, 0.93, 0.94, 0.95, 0.95, 0.95, 0.95, 0.94, 0.93, 0.91, 0.89, 0.86, 0.83,
  0.79, 0.75, 0.7,
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
  0.3, 0.42, 0.55, 0.68, 0.78, 0.86, 0.93, 0.97, 1.0, 1.0, 1.0, 0.97, 0.93, 0.86, 0.78, 0.68,
  0.55, 0.42, 0.3,
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
 * It also broke a promise the scale ought to keep. With drift, `yellow-30` was not the same
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
  page: { light: 100, dark: 15 },
  surface: { light: 100, dark: 20 },
  subtle: { light: 95, dark: 25 },
  /** A control's own fill, at rest, hover, and active. */
  component: { light: 95, dark: 25 },
  componentHover: { light: 90, dark: 30 },
  componentActive: { light: 85, dark: 35 },
  /** Strokes, quietest to loudest. */
  borderSubtle: { light: 90, dark: 35 },
  border: { light: 80, dark: 45 },
  borderStrong: { light: 70, dark: 50 },
  /** Text, from the least emphatic that is still content to the most. */
  textDisabled: { light: 70, dark: 50 },
  textPlaceholder: { light: 60, dark: 65 },
  textSubtle: { light: 50, dark: 70 },
  textMuted: { light: 45, dark: 80 },
  textTonal: { light: 45, dark: 85 },
  textTonalStrong: { light: 35, dark: 90 },
  textDefault: { light: 25, dark: 95 },
  /** A filled neutral that carries inverted text: tooltip, toast, primary button. */
  inverseFill: { light: 20, dark: 95 },
  inverseFillHover: { light: 15, dark: 100 },
  inverseText: { light: 100, dark: 15 },
  secondaryFill: { light: 30, dark: 90 },
  secondaryFillHover: { light: 25, dark: 95 },
  /** The level a translucent scrim is solved from. */
  scrim: { light: 45, dark: 20 },
} as const satisfies Record<string, Inversion>;

export type Slot = keyof typeof INVERSION;
