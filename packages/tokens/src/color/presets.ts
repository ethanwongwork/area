/**
 * The scales Area ships.
 *
 * Twelve chromatic hues and three neutrals. The colour axis lets a consumer point the
 * accent role at any chromatic scale and the neutral role at any of the three, so these
 * are the granular ramps the axis chooses between.
 *
 * Hue angles are OKLCh degrees, chosen for even perceptual spacing.
 *
 * The semantic roles are: danger 25, warning 55, caution 100, success 150, info/accent 258,
 * discovery 300. Three warm roles is more than hue separation alone can carry -- danger to
 * warning is 30 degrees, short of the 50 that keeps two tones from reading as the same
 * signal. They stay distinguishable because their solid fills differ sharply in lightness
 * as well as hue (orange L 0.77, yellow L 0.91), and because caution's fill is far lighter
 * than anything else in the set. This is the real cost of shipping eight tones, and it is
 * recorded here rather than discovered later.
 *
 * Drift values are total degrees of hue rotation from step 9 to the end of the scale, taken
 * from the measured end-to-end drift of the shipped Tailwind v4 palette: amber -49.6,
 * yellow -48.4, orange -37.4, cyan +28.8, blue +13.3, red +8.7, green -2.9, violet -2.7.
 * Yellows swing hard toward orange as they darken because a dark yellow at constant hue
 * reads as olive; greens and violets are hue-stable and are left alone.
 */
import type { ScaleSpec } from "./scale.ts";

/**
 * `solidForeground: "dark"` marks the hues whose solid fill carries black text. These are
 * the intrinsically light hues -- the same exception list Radix maintains -- which cannot
 * be both saturated and dark enough for white text at once.
 */
export const CHROMATIC_SCALES: readonly ScaleSpec[] = [
  { id: "red", kind: "chromatic", hue: 25, drift: { darkward: 9, lightward: 3 } },
  { solidForeground: "dark", id: "orange", kind: "chromatic", hue: 55, drift: { darkward: -37, lightward: -6 } },
  { solidForeground: "dark", id: "amber", kind: "chromatic", hue: 75, drift: { darkward: -50, lightward: -8 } },
  { solidForeground: "dark", id: "yellow", kind: "chromatic", hue: 100, drift: { darkward: -48, lightward: -8 } },
  { solidForeground: "dark", id: "lime", kind: "chromatic", hue: 130, drift: { darkward: -30, lightward: -5 } },
  { id: "green", kind: "chromatic", hue: 150, drift: { darkward: -3, lightward: 0 } },
  { id: "teal", kind: "chromatic", hue: 178, drift: { darkward: 10, lightward: 0 } },
  { id: "cyan", kind: "chromatic", hue: 205, drift: { darkward: 29, lightward: 0 } },
  { id: "blue", kind: "chromatic", hue: 258, drift: { darkward: 13, lightward: -3 } },
  { id: "indigo", kind: "chromatic", hue: 275, drift: { darkward: 8, lightward: -2 } },
  { id: "violet", kind: "chromatic", hue: 300, drift: { darkward: -3, lightward: 0 } },
  { id: "pink", kind: "chromatic", hue: 350, drift: { darkward: 6, lightward: 2 } },
];

/**
 * Neutrals differ only in chroma and hue, never in lightness -- so swapping grey for slate
 * changes the temperature of an interface without moving a single contrast ratio.
 */
export const NEUTRAL_SCALES: readonly ScaleSpec[] = [
  { id: "gray", kind: "neutral", hue: 0, neutralChroma: 0 },
  { id: "slate", kind: "neutral", hue: 258, neutralChroma: 0.014 },
  { id: "sand", kind: "neutral", hue: 75, neutralChroma: 0.012 },
];

export const ALL_SCALES: readonly ScaleSpec[] = [...NEUTRAL_SCALES, ...CHROMATIC_SCALES];

export type ChromaticScaleId = (typeof CHROMATIC_SCALES)[number]["id"];
export type NeutralScaleId = (typeof NEUTRAL_SCALES)[number]["id"];

/** Semantic role -> scale. The colour axis repoints `accent`; the rest are fixed. */
export const ROLE_SCALES = {
  accent: "blue",
  danger: "red",
  warning: "orange",
  caution: "yellow",
  success: "green",
  info: "blue",
  discovery: "violet",
} as const;
