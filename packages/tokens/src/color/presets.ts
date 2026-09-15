/**
 * The scales Area ships: the Area palette's fourteen families, unchanged.
 *
 * Eleven hues and three casts of one grey. The colour axis points the accent role at any
 * hue and the neutral role at any cast.
 *
 * The neutral trio is the part worth understanding. `neutral` is chroma 0 at every rung;
 * `cool` carries hue ~248 and `warm` is cool mirrored -- +180 degrees in OKLCh, which is
 * negating a and b in OKLab -- so the two casts are exactly equal and opposite and neither
 * can drift from the other. Only chroma differs between the three, never lightness, so
 * every contrast pairing that passes on one passes on all three. That is a stronger
 * guarantee than the six hand-tinted neutrals this replaced, which held lightness equal by
 * construction but had no structural reason to stay that way.
 *
 * The tint runs 0.004 to 0.019 across the ladder: a tone should read as a temperature, not
 * as a decision.
 */
import type { ScaleSpec } from "./scale.ts";

/**
 * `solidForeground: "dark"` marks the hues whose solid fill carries black text.
 *
 * These are the six on the palette's *glyph* wall -- the ones whose 500 rung is pinned to
 * 3:1 rather than 4.6:1, because they are intrinsically light and cannot be both saturated
 * and dark enough for white. Left to find white, each would walk down to 600 and arrive
 * somewhere muddy: yellow-600 is #936b02, an olive-brown that no longer reads as yellow.
 * Black at the chromatic peak keeps the hue legible and clears AA comfortably.
 *
 * Three of the six glyph-wall hues go the other way. green, teal and cyan are light enough
 * to be pinned at 3:1 but still dark enough at 600 to carry white without turning muddy --
 * green-600 is #01823a, within a shade of Primer's success green -- and a success button
 * reads better as a solid green with a white label than as the neon #03ec6f its chromatic
 * peak would give. The split is therefore not "glyph wall takes black": it is that the
 * warm three have no readable dark end and the cool three do.
 *
 * Orange is the judgement call. It reaches white-on-AA at 600 (#b65902) and would be a
 * defensible warning button either way; black on its peak is chosen so warning and caution
 * stay siblings rather than one reading as a dark red-brown.
 */
export const CHROMATIC_SCALES: readonly ScaleSpec[] = [
  { id: "red", kind: "chromatic" },
  { id: "orange", kind: "chromatic", solidForeground: "dark" },
  { id: "yellow", kind: "chromatic", solidForeground: "dark" },
  { id: "lime", kind: "chromatic", solidForeground: "dark" },
  { id: "green", kind: "chromatic" },
  { id: "teal", kind: "chromatic" },
  { id: "cyan", kind: "chromatic" },
  { id: "blue", kind: "chromatic" },
  { id: "indigo", kind: "chromatic" },
  { id: "purple", kind: "chromatic" },
  { id: "pink", kind: "chromatic" },
];

/** The three casts of one grey. Identical lightness, so contrast is invariant across them. */
export const NEUTRAL_SCALES: readonly ScaleSpec[] = [
  { id: "neutral", kind: "neutral" },
  { id: "cool", kind: "neutral" },
  { id: "warm", kind: "neutral" },
];

export const ALL_SCALES: readonly ScaleSpec[] = [...NEUTRAL_SCALES, ...CHROMATIC_SCALES];

/** One sentence per scale, rendered above its ramp in the documentation. */
export const SCALE_DESCRIPTIONS: Record<string, string> = {
  neutral: "A true grey with no chroma at all. Works with any accent hue.",
  cool: "The same grey carrying a trace of blue, for cooler interfaces.",
  warm: "Cool mirrored exactly: the same grey, tinted the opposite way.",
  red: "The danger tone. Errors, destructive actions, and failed states.",
  orange: "The warning tone. Conditions that need attention but are not failures.",
  yellow: "The caution tone. Intrinsically light, so its fill takes dark text.",
  lime: "A bright green-yellow. Not bound to a semantic role.",
  green: "The success tone. Completion, health, and positive confirmation.",
  teal: "A blue-green, distinct from both success and info.",
  cyan: "A light blue, distinct from the accent and info tones.",
  blue: "The fixed info tone. Links and the focus ring draw from it.",
  indigo: "The default accent hue. A blue-violet, set apart from the fixed blue of info.",
  purple: "The discovery tone. Marks AI features and newly-introduced surfaces.",
  pink: "A warm magenta. Not bound to a semantic role.",
};

export type ChromaticScaleId = (typeof CHROMATIC_SCALES)[number]["id"];
export type NeutralScaleId = (typeof NEUTRAL_SCALES)[number]["id"];

/**
 * Semantic role -> scale. The colour axis repoints `accent`; the rest are fixed.
 *
 * Accent defaults to indigo rather than blue so it does not ship identical to `info`, which
 * is pinned to blue. OpenAI never has this collision because they have no accent hue at all:
 * their accent is the neutral near-black button, and blue is reserved for info, links and the
 * focus ring. Area does have one, because the accent is an axis a consumer chooses -- and a
 * default that happens to equal a fixed tone makes the axis look like it does nothing.
 *
 * The separation is real but modest: indigo's solid sits 17 degrees from blue's at a
 * measured OKLab distance of 0.068, about three and a half times the 0.02 JND. Purple
 * separates twice as well and is the obvious alternative, but it is already `discovery`, so
 * taking it for accent would move the collision rather than remove it.
 */
export const ROLE_SCALES = {
  accent: "indigo",
  danger: "red",
  warning: "orange",
  caution: "yellow",
  success: "green",
  info: "blue",
  discovery: "purple",
} as const;
