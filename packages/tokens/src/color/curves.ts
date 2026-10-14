/**
 * The shape of every Area colour scale.
 *
 * Area starts from the Area palette, vendored verbatim as `palette.json` -- 15 families (brown added
 * 2026-10-06 by the owner, generated from orange; docs/specs/tag.md) x
 * 23 rungs, exported from the system that shipped them. `scale.ts` reads that table and
 * applies the bounded, documented refinements below without changing the source file.
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
  /**
   * The page, and panels raised off it. Dark sits on 975 (#020202), as close to black as the
   * ramp goes (owner 2026-10-01: "a darker dark mode … as close to #000000 as possible"); ChatGPT's
   * dark theme is built on #000000 (its Appearance setting, 2026-10-01). Was 900 (#121212).
   */
  page: { light: "white", dark: 975 },
  surface: { light: "white", dark: 850 },
  subtle: { light: 50, dark: 800 },
  stripe: { light: 25, dark: 800 },
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
  /** Supplementary strokes: keep decoration quiet; required controls have separate slots. */
  borderSubtle: { light: 200, dark: 750 },
  /**
   * Decorative dividers and container seams. The light theme deliberately uses rung 75
   * for a quiet but visible rule; dark uses 800 so the rule stays close to its ground.
   * Never use this token to identify an input, a selected state, or keyboard focus.
   */
  borderDecorative: { light: 75, dark: 800 },
  /**
   * The frame of a floating surface (Popover, Menu, Dialog, Toast, Command palette, a surface
   * Calendar or ColorPicker). It carries the separation: the floating lift is barely there (minimal
   * elevation, owner 2026-10-13). Light is 100, #eee, the nearest rung to Notion's popover ring,
   * rgba(42,28,0,.07) over white (#efeeec, capture 2026-10-13; was 75, which leaned on the deeper
   * shadow). Dark needs a firmer one, because a floating surface often sits on another surface where
   * the lift vanishes: 650 is ChatGPT's dark menu hairline, white 20% over its #212121 menu (audit
   * S21c, 2026-10-01).
   */
  borderFloat: { light: 100, dark: 650 },
  border: { light: 250, dark: 650 },
  /**
   * Floating container frames, token badges and segmented tracks. Lighter than
   * `borderSubtle`, stronger than purely decorative seams. Dark keeps its existing
   * rung: 800 would disappear against the subtle surface itself.
   */
  borderFaint: { light: 150, dark: 750 },
  /** Required editable-control and glyph boundaries, across neutral surfaces. */
  strokeControl: { light: 450, dark: 400 },
  strokeControlHover: { light: 500, dark: 350 },
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
  /** Text roles. Placeholder now shares the readable muted rung in each polarity. */
  textDisabled: { light: 350, dark: 550 },
  textPlaceholder: { light: 550, dark: 250 },
  textMuted: { light: 550, dark: 250 },
  /** Tonal text, and the most saturated rung of a family that is still readable as it. */
  textTonal: { light: 650, dark: 150 },
  textTonalStrong: { light: 750, dark: 100 },
  textDefault: { light: 800, dark: 100 },
  /** A filled neutral that carries inverted text: tooltip, toast, primary button. */
  inverseFill: { light: 800, dark: 75 },
  inverseFillHover: { light: 850, dark: 25 },
  inverseText: { light: 25, dark: 900 },
  secondaryFill: { light: 700, dark: 200 },
  secondaryFillHover: { light: 750, dark: 100 },
  /**
   * A code block's ground; vivid syntax text is measured against it. Light is the page itself
   * (owner 2026-09-28: "can you lighten the background at all? … make the colors more
   * vibrant/lighter"), so each syntax family clears 4.6:1 one rung lighter, at its most
   * saturated legible rung; was 25. The block keeps its seam and header rule. Inline code keeps
   * the 25 rung through `bg-stripe`. Dark mirrors light: the ground is the surface rung, so
   * the seam and header rule (`border-decorative`, 800) stay visible on it; at 800 they
   * matched the fill and vanished (audit G-3).
   */
  code: { light: "white", dark: 850 },
  /** The level a translucent scrim is solved from. */
  scrim: { light: 600, dark: 950 },
} as const satisfies Record<string, Inversion>;

export type Slot = keyof typeof INVERSION;

/**
 * Area's own hue adjustment, in OKLCh degrees, applied per family where the palette loads.
 *
 * The table is intentionally neutral today. Keeping green here documents the decision not
 * to rotate it toward teal: the former +14 degree rotation cost roughly 23% of the chroma
 * available to green's dark rungs and crowded teal without improving semantic separation.
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
  green: 0,
};

/**
 * Area's chroma trim, per family, applied to the light end of a ramp.
 *
 * This exists because Area's anchor and this table answer different questions. The export
 * pins each rung to a contrast wall, which is a statement about a family against *white* --
 * it says nothing about that family against its eleven siblings at the same rung. At the
 * light end that matters: sRGB will hold far more chroma in a pale green than in a pale
 * blue, so the families that can be bright, are. The separate dark-end cap below solves a
 * different imbalance after the gamut has narrowed.
 *
 * Measured across the eleven chromatic families at rung 150, chroma runs 0.051 (orange) to
 * 0.138 (lime) around a mean of 0.079 -- lime and green nearly twice their peers, which is
 * what makes a green tint read as a wash where a blue one reads as a tint.
 *
 * The trim is a multiplier on chroma alone. It does not interact with the bounded dark-end
 * lightness lift below.
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

/**
 * A bounded lightness lift for the readable/dark end of chromatic ramps.
 *
 * Most dark rungs are already on the sRGB boundary, where additional chroma is impossible
 * without more lightness. The lift starts after the solid wall, peaks at 850, and returns
 * to the vendored 975 endpoint. Neutral families do not use it, so page and surface grounds
 * remain unchanged.
 */
export const DARK_LIGHTNESS_LIFT: Partial<Record<Level, number>> = {
  600: 0.01,
  650: 0.02,
  700: 0.035,
  750: 0.045,
  800: 0.055,
  850: 0.06,
  900: 0.055,
  925: 0.045,
  950: 0.03,
};

/**
 * Dark-end chroma ceiling expressed as a fraction of adjusted lightness.
 *
 * Most hues are already limited by the sRGB boundary. Indigo and purple are not, so an
 * explicit ceiling keeps those two from becoming disproportionately saturated as the
 * ladder darkens. Rung 600 takes the boundary without an additional ceiling; 975 remains
 * the vendored near-black endpoint.
 */
export const DARK_CHROMA_CAP: Partial<Record<Level, number>> = {
  650: 0.52,
  700: 0.46,
  750: 0.42,
  800: 0.4,
  850: 0.4,
  900: 0.4,
  925: 0.4,
  950: 0.4,
};
