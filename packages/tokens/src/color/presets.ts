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
import { DATA_HUES, generatedFamily, generatedSpec, hueScaleId } from "./generate.ts";

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

/**
 * Muted hues: chromatic, but deliberately low in chroma, so they are not accent candidates and
 * stay out of the cross-family chroma balance the accent hues are held to. Built and emitted in
 * both themes like every family.
 *
 * brown (added 2026-10-06, owner; docs/specs/tag.md): orange's lightness at every rung, hue +2,
 * chroma x 0.35 -- Notion's brown tag (ink oklch 0.40 0.035 55) sits at a third of orange's chroma.
 */
export const MUTED_SCALES: readonly ScaleSpec[] = [
  { id: "brown", kind: "chromatic" },
];

/** The three casts of one grey. Identical lightness, so contrast is invariant across them. */
export const NEUTRAL_SCALES: readonly ScaleSpec[] = [
  { id: "neutral", kind: "neutral" },
  { id: "cool", kind: "neutral" },
  { id: "warm", kind: "neutral" },
];

/**
 * Families the data colours needed and the palette lacked (data views round 18; owner, 2026-11-02: "can you add the series
 * colors to the palette ... i like the hue of the series better but just want a more cohesive overall palette"). Each is
 * the palette's own recipe at its hue (generate.ts `generatedFamily`: the neighbours' lightness ladder and share of
 * sRGB's room), so it sits in the palette as one more hue: sky between cyan and blue, chartreuse between yellow and lime,
 * mint short of teal, violet past purple. A series hue within 8° of a named family uses that family instead (indigo,
 * orange, pink, red). Like brown, not accent candidates: they stay out of the accent list and its contrast gates.
 */
export const DATA_SCALES: readonly ScaleSpec[] = Object.entries(DATA_HUES).map(([id, hue]) =>
  // Without the neighbours' hue drift (curves.ts HUE_DRIFT, 2026-11-02): the series steps were approved before it.
  ({ ...generatedSpec(hueScaleId(hue))!, drift: undefined, id, family: generatedFamily(hue) }));

/** Every family, neutrals first, then the hues around the wheel with the data families in their places, then brown. */
const HUE_ORDER = ["red", "orange", "yellow", "chartreuse", "lime", "green", "mint", "teal", "cyan", "sky", "blue", "indigo", "purple", "violet", "pink"];
export const ALL_SCALES: readonly ScaleSpec[] = [
  ...NEUTRAL_SCALES,
  ...HUE_ORDER.map(id => [...CHROMATIC_SCALES, ...DATA_SCALES].find(spec => spec.id === id)!),
  ...MUTED_SCALES,
];

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
  blue: "The default accent hue, and the fixed info tone. The focus ring follows the accent.",
  indigo: "A blue-violet, set apart from the blue of info and the default accent.",
  purple: "The discovery tone. Marks AI features and newly-introduced surfaces.",
  pink: "A warm magenta. The pink tag tone.",
  chartreuse: "A yellow-green between yellow and lime. Data series 3.",
  mint: "A green-blue short of teal. Data series 6.",
  sky: "A clear blue between cyan and blue. Data series 1.",
  violet: "A purple leaning to magenta. Data series 7.",
  brown: "Orange at a third of its chroma: an earth tone for tags. The brown tag tone.",
};

export type ChromaticScaleId = (typeof CHROMATIC_SCALES)[number]["id"];
export type NeutralScaleId = (typeof NEUTRAL_SCALES)[number]["id"];

/**
 * Semantic role -> scale. The colour axis repoints `accent`; the rest are fixed.
 *
 * Accent defaults to blue (owner, 2026-09-29). Since the emphasis roles, action and selection
 * are neutral by default, so the accent's main default use is the focus ring, which reads blue
 * as it does in ChatGPT and Notion. Blue is also `info`: the collision the earlier indigo default
 * avoided is accepted, because a consumer who turns the roles to accent picks their own hue.
 * (Indigo was the default until then: 17 degrees from blue, OKLab distance 0.068.)
 */
/** The tones Status colours can quiet with the accent (axes/accent.ts): the status meanings, not the tag colours. */
export const STATUS_TONES: readonly string[] = ["danger", "warning", "caution", "success", "info", "discovery"];

export const ROLE_SCALES = {
  accent: "blue",
  danger: "red",
  warning: "orange",
  caution: "yellow",
  success: "green",
  info: "blue",
  discovery: "purple",
  /* Tag tones (owner 2026-10-06; docs/specs/tag.md): Notion's pink and gray. Gray is the warm
     cast of the neutral grey (Notion's gray is warm, hue ~70), so it reads apart from neutral. */
  pink: "pink",
  gray: "warm",
  brown: "brown",
} as const;
