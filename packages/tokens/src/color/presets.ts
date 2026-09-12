/**
 * The scales Area ships.
 *
 * Twelve chromatic hues and six neutrals. The colour axis points the accent role at any
 * chromatic scale and the neutral role at any neutral, so these are the granular ramps the
 * axis chooses between.
 *
 * Hue angles are OKLCh degrees and are constant down each scale -- `red-99` and `red-17`
 * are both hue 25. There is no drift table; `curves.ts` records why.
 *
 * The semantic roles are: danger 25, warning 55, caution 100, success 150, info/accent 258,
 * discovery 300. Three warm roles is more than hue separation alone can carry -- danger to
 * warning is 30 degrees, short of the 50 that keeps two tones from reading as the same
 * signal. What separates them now is where each one's solid fill lands on the ladder: red
 * can stay saturated at L 0.55 and carry white text, while yellow cannot be both saturated
 * and dark, so its fill sits at L 0.90 with black text. A red button and a caution button
 * differ in weight, not only in hue. That is the real cost of shipping eight tones, and it
 * is recorded here rather than discovered later.
 */
import type { ScaleSpec } from "./scale.ts";

/**
 * `solidForeground: "dark"` marks the hues whose solid fill carries black text -- the
 * intrinsically light ones, the same exception list Radix maintains. A hue whose gamut cusp
 * sits above roughly L 0.8 cannot be simultaneously saturated and dark enough for white
 * text; forcing it down the ladder until white passes is what turned the old yellow and
 * lime solids into mud.
 */
export const CHROMATIC_SCALES: readonly ScaleSpec[] = [
  { id: "red", kind: "chromatic", hue: 25 },
  { id: "orange", kind: "chromatic", hue: 55, solidForeground: "dark" },
  { id: "amber", kind: "chromatic", hue: 75, solidForeground: "dark" },
  { id: "yellow", kind: "chromatic", hue: 100, solidForeground: "dark" },
  { id: "lime", kind: "chromatic", hue: 130, solidForeground: "dark" },
  { id: "green", kind: "chromatic", hue: 150 },
  { id: "teal", kind: "chromatic", hue: 178 },
  { id: "cyan", kind: "chromatic", hue: 205 },
  { id: "blue", kind: "chromatic", hue: 258 },
  { id: "indigo", kind: "chromatic", hue: 275 },
  { id: "violet", kind: "chromatic", hue: 300 },
  { id: "pink", kind: "chromatic", hue: 350 },
];

/**
 * Neutrals differ only in chroma and hue, never in lightness -- so swapping grey for slate
 * changes the temperature of an interface without moving a single contrast ratio. Every
 * neutral shares the ladder, so every one of them also shares its entire contrast table.
 *
 * Six rather than three, so a neutral can be chosen to sit *under* the accent rather than
 * beside it: a violet accent on a mauve page reads as one considered palette, where the
 * same accent on a blue-tinted slate reads as two. That pairing is the whole reason Radix
 * ships six, and three was not enough to cover the twelve accents this system offers.
 *
 * Chroma caps differ by hue because equal chroma is not equal tint: a blue cast at C 0.011
 * is barely visible where a green one at the same chroma reads clearly, so the cool hues
 * carry more to land at the same apparent strength.
 */
export const NEUTRAL_SCALES: readonly ScaleSpec[] = [
  { id: "gray", kind: "neutral", hue: 0, neutralChroma: 0 },
  { id: "slate", kind: "neutral", hue: 258, neutralChroma: 0.015 },
  { id: "mauve", kind: "neutral", hue: 310, neutralChroma: 0.014 },
  { id: "sage", kind: "neutral", hue: 175, neutralChroma: 0.011 },
  { id: "olive", kind: "neutral", hue: 130, neutralChroma: 0.011 },
  { id: "sand", kind: "neutral", hue: 75, neutralChroma: 0.012 },
];

export const ALL_SCALES: readonly ScaleSpec[] = [...NEUTRAL_SCALES, ...CHROMATIC_SCALES];

/** One sentence per scale, rendered above its ramp in the documentation. */
export const SCALE_DESCRIPTIONS: Record<string, string> = {
  gray: "A true neutral with no chroma at all. Works with any accent.",
  slate: "Cool, tinted toward blue. Pairs with blue, indigo, and cyan accents.",
  mauve: "Cool, tinted toward violet. Pairs with violet, pink, and red accents.",
  sage: "Quiet, tinted toward teal. Pairs with teal, green, and cyan accents.",
  olive: "Quiet, tinted toward green. Pairs with green and lime accents.",
  sand: "Warm, tinted toward amber. Pairs with amber, orange, and yellow accents.",
  red: "The danger tone. Errors, destructive actions, and failed states.",
  orange: "The warning tone. Conditions that need attention but are not failures.",
  amber: "Between warning and caution. Not bound to a semantic role.",
  yellow: "The caution tone. The lightest solid in the system, so it takes dark text.",
  lime: "A bright green-yellow. Not bound to a semantic role.",
  green: "The success tone. Completion, health, and positive confirmation.",
  teal: "A blue-green, distinct from both success and info.",
  cyan: "A light blue, distinct from the accent and info tones.",
  blue: "The default accent, and the fixed info tone.",
  indigo: "A deep blue-violet, between the accent and discovery tones.",
  violet: "The discovery tone. Marks AI features and newly-introduced surfaces.",
  pink: "A warm magenta. Not bound to a semantic role.",
};

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
