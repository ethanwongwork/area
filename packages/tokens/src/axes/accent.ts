/**
 * Accent strength and Solid (owner, 2026-10-23: "a darker navy color as the button color ... a specific hue and chroma that
 * the current palette doesnt have"; research and the measured examples: docs/research/palette-customization-2026-10-23).
 * With Accent (axes/color.ts: the palette's eleven, or any hue in 5° steps) they make the accent any colour, and every
 * accent paint stays solved:
 *
 *   accent-strength  how much of its own colour the accent keeps, 100 (the palette) to 30 (dusty), one for both modes so
 *                    a theme keeps one identity. Each accent colour mixes in OKLab toward the gray of its own luminance
 *                    (color/generate.ts `withStrength`), so hue holds and contrast stays within 0.09:1; the solvers walk at
 *                    every strength, so each solved step clears at each.
 *   solid-light      the accent step solid fills sit on in light: Auto (the solver's own, the palette's peak step that
 *   solid-dark       carries its label) or 200 to 850. A step carries black or white, whichever clears on it (2026-10-25,
 *                    owner: "let the accent's label flip … so Shade runs from light to deep for every colour"); where
 *                    neither does, it moves toward its own label's side to the first that can (scale.ts `solidAt`). Chosen per mode: a navy fill on the
 *                    near-black page measures 1.66:1, so dark's Auto stays the solver's own step whatever light picks.
 *
 * Each writes numbers only; emit/base.ts derives the accent's paint from them and the accent's `-full` tokens, live.
 */
import { type AxisDefinition, tokens } from "./schema.ts";
import { ACCENT_STRENGTHS, DEFAULT_ACCENT_STRENGTH, LUMINANCE, SOLID_STEPS } from "../color/generate.ts";
import { POSITIONS } from "../color/layers.ts";
import { ACCENT_AXIS, THEME_AXIS } from "./color.ts";

export const ACCENT_STRENGTH_AXIS: AxisDefinition = {
  id: "accent-strength",
  label: "Saturation",
  description: "How much of its own colour the accent keeps, 100 (the palette) to 30 (dusty). Hue and contrast hold.",
  defaultPreset: String(DEFAULT_ACCENT_STRENGTH),
  namespaces: ["--area-strength-accent:"],
  presets: ACCENT_STRENGTHS.map(strength => ({
    id: String(strength),
    label: strength === 100 ? "100 (Full)" : strength === 30 ? "30 (Dusty)" : String(strength),
    description: strength === 100 ? "The accent as the palette draws it." : `${strength}% of the accent's colour, toward the gray of its own lightness.`,
    tokens: tokens({ "strength-accent": strength }),
  })),
};

const solidAxis = (theme: "light" | "dark"): AxisDefinition => ({
  id: `solid-${theme}`,
  // Named for what it sets, the accent's shade, beside its colour and Saturation (owner, 2026-10-25: "choose just a basic
  // color first … then from there choose how dark or saturated or light"); was "Button shade".
  label: theme === "light" ? "Light shade" : "Dark shade",
  description: `In ${theme}: the accent step solid fills (accent buttons, checked marks) sit on. Auto, or 200 (lightest) to 850 (deepest); the label turns black or white to stay readable.`,
  defaultPreset: "auto",
  namespaces: [`--area-solid-${theme}-`],
  presets: [
    { id: "auto", label: "Auto", description: "The accent's own solid: its most vivid step that carries its label.", tokens: tokens(Object.fromEntries(SOLID_STEPS.map(step => [`solid-${theme}-${step}`, 0]))) },
    ...SOLID_STEPS.map(pick => ({
      id: String(pick),
      label: String(pick),
      description: `The accent's ${pick} step under a black or white label, whichever reads, or the nearest step that carries its own.`,
      tokens: tokens(Object.fromEntries(SOLID_STEPS.map(step => [`solid-${theme}-${step}`, step === pick ? 1 : 0]))),
    })),
  ],
});
export const SOLID_LIGHT_AXIS = solidAxis("light");
export const SOLID_DARK_AXIS = solidAxis("dark");

/**
 * Label tint (owner, 2026-10-23: "if i choose a dark navy as the accent i can also toggle on the foreground being a lighter
 * version of that color with some slight hue, while still being accessible"): how far the label on an accent solid moves
 * from its measured black or white toward the most coloured rung that still carries it (scale.ts `tintedLabel`), 0 (None)
 * to 100, every whole number (0 to 4 in quarters until 2026-10-26, so 2 is now 50), one for both modes as Text tint is.
 * Every position sits between two colours that clear the label's contract, and the gate checks each (contrast/accent-gate.ts).
 * On a bright fill no rung clears, and the label stays.
 */
export const LABEL_TINT_AXIS: AxisDefinition = {
  id: "label-tint",
  label: "Label tint",
  description: "How much of the accent's own hue the label on an accent button takes, 0 (None) to 100 (Full); every position stays readable.",
  defaultPreset: "0",
  namespaces: ["--area-label-tint:"],
  // The token stays in quarters (emit/base.ts mixes `label-tint * 25%`), so a position writes a quarter's share of it.
  presets: POSITIONS.map(position => ({
    id: String(position),
    label: position === 0 ? "0 (None)" : position === 100 ? "100 (Full)" : String(position),
    description: position === 0 ? "The measured black or white." : position === 100 ? "The most coloured label that stays readable on the fill." : `${position}% of the way to the most coloured readable label.`,
    tokens: tokens({ "label-tint": position / 25 }),
  })),
};

// ---------------------------------------------------------------------------
// The paint (emit/base.ts derives these on every element that carries a setting)
// ---------------------------------------------------------------------------

const v = (name: string) => `var(--area-${name})`;
/** WCAG's luminance of a colour's linear channels, as a calc() inside a relative `color(from … srgb-linear …)`. */
const LUMA = `calc(${LUMINANCE[0]} * r + ${LUMINANCE[1]} * g + ${LUMINANCE[2]} * b)`;
/** A colour at a strength (the Accent strength unless given): mixed in OKLab toward the gray of its own luminance
 * (color/generate.ts `withStrength`). */
export const atStrength = (colour: string, strength = v("strength-accent")) =>
  `color-mix(in oklab, ${colour} calc(${strength} * 1%), color(from ${colour} srgb-linear ${LUMA} ${LUMA} ${LUMA}))`;

/** The Solid step's colour of one kind (the fill, its hover, its label or Label tint's end) in one mode: Auto's, or the
 * one step whose switch is on. */
const solidChain = (theme: "light" | "dark", kind: "solid" | "solid-hover" | "label" | "on") => SOLID_STEPS.reduce(
  (paint, step) => `color-mix(in srgb, ${paint}, ${v(`accent-${kind}-${step}-full`)} calc(${v(`solid-${theme}-${step}`)} * 100%))`,
  kind === "on" ? v("fg-on-accent-full") : v(`accent-${kind}-full`),
);

/** The accent's public paint: every `-full` token at the strength; the solid and its hover at the Solid step first. */
export function accentDerived(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const kind of ["solid", "solid-hover"] as const) {
    out[`--area-accent-${kind}-pick`] = `light-dark(${solidChain("light", kind)}, ${solidChain("dark", kind)})`;
    out[`--area-accent-${kind}`] = atStrength(v(`accent-${kind}-pick`));
  }
  // The label: the Solid step's black or white (Auto's is the accent's own; a step's flips with its shade, 2026-10-25),
  // mixed toward Label tint's end on that fill, a quarter a step.
  out["--area-accent-on-pick"] = `light-dark(${solidChain("light", "on")}, ${solidChain("dark", "on")})`;
  out["--area-accent-label-pick"] = `light-dark(${solidChain("light", "label")}, ${solidChain("dark", "label")})`;
  out["--area-fg-on-accent"] = `color-mix(in oklab, ${v("accent-on-pick")}, ${atStrength(v("accent-label-pick"))} calc(${v("label-tint")} * 25%))`;
  const own = /^--area-(accent-(solid|solid-hover|label|on)(-\d+)?-full|fg-on-accent-full)$/;
  for (const name of Object.keys(ACCENT_AXIS.presets[0]!.tokens)) {
    if (!name.endsWith("-full") || own.test(name)) continue;
    const base = name.slice("--area-".length, -"-full".length);
    out[`--area-${base}`] = atStrength(v(`${base}-full`));
  }
  return out;
}

/**
 * Status colours (owner, 2026-10-23: "will a full set be generated too, to provide colors for semantic colors? based on
 * the chosen hues/chroma?"): Fixed (the default) keeps danger, warning, caution, success, info and discovery as the
 * palette draws them; Match quiets them with the accent, to its strength, so a dusty palette has dusty statuses. Their hue
 * never moves (a red stays red: rotating status hues toward the accent, Material's harmonize, can make danger read as
 * warning), and the same mix as Accent strength keeps their contrast; their solvers walk at every strength. Tag colours
 * (pink, gray, brown) are categories, not statuses, and stay. One for both modes, as Accent strength is.
 */
export const STATUS_COLOURS_AXIS: AxisDefinition = {
  id: "status-colours",
  // "Status" (owner 2026-10-27: "avoid long phrases"; was "Status colours", which wrapped beside its info button).
  label: "Status",
  description: "Danger, warning, success and info as the palette draws them, or quieted to the Accent strength. Their hues never move.",
  defaultPreset: "fixed",
  namespaces: ["--area-status-match:"],
  presets: [
    { id: "fixed", label: "Fixed", description: "Status colours as the palette draws them, whatever the accent.", tokens: tokens({ "status-match": 0 }) },
    { id: "match", label: "Match strength", description: "Status colours quieted to the Accent strength; their hues stay.", tokens: tokens({ "status-match": 1 }) },
  ],
};

/** The status tones' public colours: each `-full` token at its strength, the Accent strength under Match, else 100. */
export function statusDerived(): Record<string, string> {
  const strength = `calc(100 - ${v("status-match")} * (100 - ${v("strength-accent")}))`;
  const out: Record<string, string> = {};
  const theme = THEME_AXIS.presets[0]!.tokens;
  for (const name of Object.keys(theme)) {
    if (!name.endsWith("-full")) continue;
    const base = name.slice("--area-".length, -"-full".length);
    out[`--area-${base}`] = atStrength(v(`${base}-full`), strength);
  }
  return out;
}
