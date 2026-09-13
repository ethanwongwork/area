/**
 * The shape of every Area colour scale.
 *
 * Area no longer generates its own ramps. The colours are the Stadium palette, vendored
 * verbatim as `palette.json` -- 14 families x 23 rungs, exported from the system that
 * shipped them. `scale.ts` reads that table; nothing here computes a colour.
 *
 * That is a deliberate reversal of the previous model, in which a level name *was* its
 * lightness and `assertLadder()` enforced it. Stadium is anchored to contrast instead:
 * every family's 500 rung is pinned so a label clears AA on white, which means the hues
 * deliberately do *not* share a lightness at a shared rung -- yellow's 500 sits at L 0.68
 * where indigo's sits at L 0.56, because matching them would push one of the two below
 * its wall. Measured across the ladder, the cross-hue lightness spread peaks at 0.217 at
 * rung 350 and closes to 0.007 at the ends.
 *
 * Both anchors are defensible and they are mutually exclusive. Contrast is the one that is
 * externally binding -- it is what WCAG measures and what the build gate asserts -- so
 * anchoring to it makes the ramp's guarantee the same guarantee the gate checks. The cost
 * is that two tones at the same rung no longer weigh the same, so swapping a tone can
 * change the weight of a layout by a little. `ladder.test.ts` measures that cost rather
 * than leaving it as a claim.
 */

/**
 * The ladder: 25 · 50 · 75 · 100 · 150 … 900 · 925 · 950 · 975.
 *
 * Finer at the ends than through the middle, because that is where a UI spends its steps:
 * 25/50/75 are three distinguishable page grounds and 925/950/975 three distinguishable
 * dark ones, while the middle -- where text and fills live -- runs in 50s because a
 * half-step there buys nothing.
 *
 * A rung is an ordinal position, not a measurement. Higher is darker, which is the
 * direction Tailwind, Material and Radix all read, and the opposite of the lightness-named
 * ladder this replaced.
 */
export const LEVELS = [
  25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850,
  900, 925, 950, 975,
] as const;

export type Level = (typeof LEVELS)[number];

/** A value per level, in ladder order (lightest first). */
export type Ramp<T> = readonly T[];

/**
 * Where each semantic slot sits in light and in dark.
 *
 * This is the inversion, stated once. It is close to a mirror but deliberately not an
 * exact one: the dark column is compressed at the background end because separation near
 * black needs more lightness distance to read as the same visual step.
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
  page: { light: 25, dark: 900 },
  surface: { light: 25, dark: 850 },
  subtle: { light: 50, dark: 800 },
  /** A control's own fill, at rest, hover, and active. */
  component: { light: 75, dark: 800 },
  componentHover: { light: 100, dark: 750 },
  componentActive: { light: 150, dark: 700 },
  /** Neutral strokes, quietest to loudest. */
  borderSubtle: { light: 200, dark: 750 },
  border: { light: 250, dark: 650 },
  borderStrong: { light: 350, dark: 550 },
  /**
   * Tonal strokes, which sit deeper on the ladder than neutral ones.
   *
   * Not a preference -- a luminance fact. A stroke has to clear a ratio against the page,
   * and at a shared rung a luminous hue carries far more luminance than a grey: green-250
   * measures 1.35:1 on the light page where neutral-250 measures 1.57. One slot for both
   * forces a choice between an invisible green border and a neutral border heavy enough to
   * look like a focus ring, so tonal strokes get their own rungs.
   */
  tonalBorder: { light: 400, dark: 600 },
  tonalBorderStrong: { light: 500, dark: 500 },
  /** Text, from the least emphatic that is still content to the most. */
  textDisabled: { light: 350, dark: 550 },
  textPlaceholder: { light: 450, dark: 450 },
  textSubtle: { light: 500, dark: 350 },
  textMuted: { light: 550, dark: 250 },
  textTonal: { light: 650, dark: 200 },
  textTonalStrong: { light: 750, dark: 100 },
  textDefault: { light: 800, dark: 100 },
  /** A filled neutral that carries inverted text: tooltip, toast, primary button. */
  inverseFill: { light: 800, dark: 75 },
  inverseFillHover: { light: 850, dark: 25 },
  inverseText: { light: 25, dark: 900 },
  secondaryFill: { light: 700, dark: 200 },
  secondaryFillHover: { light: 750, dark: 100 },
  /** The level a translucent scrim is solved from. */
  scrim: { light: 600, dark: 950 },
} as const satisfies Record<string, Inversion>;

export type Slot = keyof typeof INVERSION;
