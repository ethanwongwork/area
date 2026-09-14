/**
 * The shape of every Area colour scale.
 *
 * Area no longer generates its own ramps. The colours are the Area palette, vendored
 * verbatim as `palette.json` -- 14 families x 23 rungs, exported from the system that
 * shipped them. `scale.ts` reads that table; nothing here computes a colour.
 *
 * That is a deliberate reversal of the previous model, in which a level name *was* its
 * lightness and `assertLadder()` enforced it. Area is anchored to contrast instead:
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

/**
 * A position on the ladder, or pure white.
 *
 * The rungs stop at 25 (#fafafa), which is why the palette ships white as a constant
 * alongside them rather than as a rung. One surface needs it: a code block, whose syntax
 * colours are the palette's 500 rungs, and 500 is pinned to clear AA against *white*
 * specifically. On #fafafa the same colours measure 4.42 and on #f7f7f7 they measure 4.30
 * -- under the bar by a margin small enough to be invisible and large enough to fail.
 */
export type Position = Level | "white";

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
  light: Position;
  dark: Position;
}

export const INVERSION = {
  /** The page, and panels raised off it. */
  page: { light: "white", dark: 900 },
  surface: { light: "white", dark: 850 },
  subtle: { light: 50, dark: 800 },
  /**
   * A control's own fill, at rest, hover, and active.
   *
   * These sit on the softest rungs the ladder has. A tinted surface is a whisper -- it
   * marks a region without competing with what is written on it -- and the palette's
   * 25/50/75 exist precisely so three of them can stack and stay separable.
   */
  component: { light: 50, dark: 800 },
  componentHover: { light: 75, dark: 750 },
  componentActive: { light: 100, dark: 700 },
  /**
   * Neutral strokes, quietest to loudest.
   *
   * The light 75/100/150 progression is a visual trial requested on 2026-09-14.
   * Existing contrast thresholds remain unchanged so the audit exposes the cost of
   * the quieter edges. See docs/SYSTEM_AUDIT.md before treating it as release-ready.
   */
  borderSubtle: { light: 150, dark: 750 },
  /**
   * Decorative dividers and container seams. The light theme deliberately uses rung 75
   * for a quiet but visible rule; dark uses 800 so the rule stays close to its ground.
   * Never use this token to identify an input, a selected state, or keyboard focus.
   */
  borderDecorative: { light: 75, dark: 800 },
  border: { light: 250, dark: 650 },
  /**
   * Floating container frames, token badges and segmented tracks. Lighter than
   * `borderSubtle`, stronger than purely decorative seams. Dark keeps its existing
   * rung: 800 would disappear against the subtle surface itself.
   */
  borderFaint: { light: 100, dark: 750 },
  borderStrong: { light: 300, dark: 600 },
  /**
   * Tonal strokes, which sit deeper on the ladder than neutral ones.
   *
   * Not a preference -- a luminance fact. A stroke has to clear a ratio against the page,
   * and at a shared rung a luminous hue carries far more luminance than a grey: green-250
   * measures 1.35:1 on the light page where neutral-250 measures 1.57. One slot for both
   * forces a choice between an invisible green border and a neutral border heavy enough to
   * look like a focus ring, so tonal strokes get their own rungs.
   */
  tonalBorder: { light: 400, dark: 650 },
  tonalBorderStrong: { light: 450, dark: 600 },
  /**
   * Text, from the least emphatic that is still content to the most.
   *
   * Four neutral foregrounds, not five. `textSubtle` sat at 500 between placeholder at 450
   * and muted at 550 -- one rung from each, which is the smallest step this ladder can
   * express. Measured on the light page that put three tokens inside a 1.9:1 band (3.63,
   * 4.48, 5.50), and the middle one earned 0.85:1 of separation from the token below it.
   * Its consumers -- field affixes, syntax punctuation, a nav's trailing slot, group
   * headings -- all wanted "quieter than body copy", which is what muted already means.
   */
  textDisabled: { light: 350, dark: 550 },
  textPlaceholder: { light: 450, dark: 450 },
  textMuted: { light: 550, dark: 250 },
  /** Tonal text, and the most saturated rung of a family that is still readable as it. */
  textTonal: { light: 650, dark: 200 },
  textTonalStrong: { light: 750, dark: 100 },
  textDefault: { light: 800, dark: 100 },
  /** A filled neutral that carries inverted text: tooltip, toast, primary button. */
  inverseFill: { light: 800, dark: 75 },
  inverseFillHover: { light: 850, dark: 25 },
  inverseText: { light: 25, dark: 900 },
  secondaryFill: { light: 700, dark: 200 },
  secondaryFillHover: { light: 750, dark: 100 },
  /**
   * A code block: the code and anything riding on it.
   *
   * One rung back from the page, which is now white, so the block reads as a block without
   * needing a stroke to say so. It costs a little contrast -- the palette pins its 500 rung
   * against white specifically, and syntax is set in 500, so on neutral-25 the label-wall
   * hues land just under AA. That is recorded in `contrast/exceptions.ts` rather than
   * absorbed, and it is the price of the block having a ground of its own.
   */
  code: { light: 25, dark: 800 },
  /** The level a translucent scrim is solved from. */
  scrim: { light: 600, dark: 950 },
} as const satisfies Record<string, Inversion>;

export type Slot = keyof typeof INVERSION;

/**
 * Area's own hue adjustment, in OKLCh degrees, applied per family where the palette loads.
 *
 * The exported L and C anchors stay fixed; this table tunes hue at load time.
 * Gamut mapping may then change chroma and lightness. Green at +14 costs up to 0.043
 * chroma and moves L by 0.009, so measure every adjustment against the base palette.
 *
 * Rotations are deliberately small and are checked against adjacent-hue separation, not
 * copied from a reference. The obvious move -- matching OpenAI, which sits at red +10 and
 * orange -11 -- would have pulled red and orange to 14 degrees apart, half the roughly 30
 * that keeps danger and warning from reading as one signal.
 *
 * Red carried -4 for a while -- a crimson rather than a pillarbox red -- and was reverted.
 * The measurement is kept here because it is the trade to weigh if it is tried again: -4
 * widens red to orange from 35 degrees to 39, and narrows red to pink from 20 to 16.
 */
export const HUE_ROTATION: Record<string, number> = {
  /**
   * Toward teal, to an emerald rather than a pure green. Area's green is pinned flat at
   * hue 150 across the whole family; the reference this matches sits at 164 at its solid
   * rung, and +14 lands Area's 500 on that number exactly.
   *
   * The reference's own ramp sweeps its hue from 156 at the light end to 190 at the dark,
   * which is a different technique than this one -- a family here carries one hue and one
   * rotation, because two rungs of one family at different hues is what makes a tonal
   * stroke and its fill stop looking related. The mid rungs are what a green button and a
   * success badge actually render, so those are what this is fitted to.
   *
   * The cost is separation, and it lands on the right side: green to lime widens from 22
   * degrees to 36, green to teal narrows from 33 to 19. Green is the success tone and both
   * neighbours are bound to no role at all, so the pair that narrowed carries no meaning
   * between them -- the same trade, in the same direction, that -4 on red did not.
   */
  green: 14,
};

/**
 * Area's chroma trim, per family, applied to the light end of a ramp.
 *
 * **This is the one place Area touches chroma, and it exists because Area's anchor and
 * this one are answering different questions.** The export pins each rung to a contrast
 * wall, which is a statement about a family against *white* -- it says nothing about that
 * family against its eleven siblings at the same rung. At the dark end that does not
 * matter, because the gamut squeezes every hue toward the same narrow band. At the light
 * end it does: sRGB will hold far more chroma in a pale green than in a pale blue, so the
 * families that can be bright, are.
 *
 * Measured across the eleven chromatic families at rung 150, chroma runs 0.051 (orange) to
 * 0.138 (lime) around a mean of 0.079 -- lime and green nearly twice their peers, which is
 * what makes a green tint read as a wash where a blue one reads as a tint.
 *
 * The trim is a multiplier on chroma alone. L is never touched, so the wall each rung is
 * pinned against is not moved, and the contrast gate measures the result either way.
 *
 * It tapers rather than applying flat, because the divergence is a light-end effect: full
 * strength at rung 200 and below, gone by 400, linear between. Trimming the mid rungs would
 * take the fill and the solid down with the tint, and those are the rungs the palette
 * anchored deliberately.
 */
export const CHROMA_TRIM: Record<string, number> = {
  /** 0.138 at rung 150 against a 0.079 mean -- the widest divergence in the palette. */
  lime: 0.72,
  /** 0.130 at 150. Trimmed a little less than lime, which starts higher still. */
  green: 0.78,
  /** +0.021 at 150. Third and much milder; included so the warm light end matches too. */
  yellow: 0.88,
};

/** Full strength at 200 and below, none from 400 up, linear between. */
export function chromaTrimWeight(level: number): number {
  if (level <= 200) return 1;
  if (level >= 400) return 0;
  return (400 - level) / 200;
}
