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
 *   solid-dark       carries its label) or 400 to 850. A step whose label cannot clear moves toward the label's side to
 *                    the first that can (scale.ts `solidAt`), so a step never fails. Chosen per mode: a navy fill on the
 *                    near-black page measures 1.66:1, so dark's Auto stays the solver's own step whatever light picks.
 *
 * Each writes numbers only; emit/base.ts derives the accent's paint from them and the accent's `-full` tokens, live.
 */
import { type AxisDefinition, tokens } from "./schema.ts";
import { ACCENT_STRENGTHS, DEFAULT_ACCENT_STRENGTH, LUMINANCE, SOLID_STEPS } from "../color/generate.ts";
import { ACCENT_AXIS } from "./color.ts";

export const ACCENT_STRENGTH_AXIS: AxisDefinition = {
  id: "accent-strength",
  label: "Accent strength",
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
  label: theme === "light" ? "Light solid" : "Dark solid",
  description: `In ${theme}: the accent step solid fills (accent buttons, checked marks) sit on. Auto, or 400 (lighter) to 850 (deeper).`,
  defaultPreset: "auto",
  namespaces: [`--area-solid-${theme}-`],
  presets: [
    { id: "auto", label: "Auto", description: "The accent's own solid: its most vivid step that carries its label.", tokens: tokens(Object.fromEntries(SOLID_STEPS.map(step => [`solid-${theme}-${step}`, 0]))) },
    ...SOLID_STEPS.map(pick => ({
      id: String(pick),
      label: String(pick),
      description: `The accent's ${pick} step, or the nearest that carries its label.`,
      tokens: tokens(Object.fromEntries(SOLID_STEPS.map(step => [`solid-${theme}-${step}`, step === pick ? 1 : 0]))),
    })),
  ],
});
export const SOLID_LIGHT_AXIS = solidAxis("light");
export const SOLID_DARK_AXIS = solidAxis("dark");

// ---------------------------------------------------------------------------
// The paint (emit/base.ts derives these on every element that carries a setting)
// ---------------------------------------------------------------------------

const v = (name: string) => `var(--area-${name})`;
/** WCAG's luminance of a colour's linear channels, as a calc() inside a relative `color(from … srgb-linear …)`. */
const LUMA = `calc(${LUMINANCE[0]} * r + ${LUMINANCE[1]} * g + ${LUMINANCE[2]} * b)`;
/** A colour at the Accent strength: mixed in OKLab toward the gray of its own luminance (color/generate.ts `withStrength`). */
export const atStrength = (colour: string) =>
  `color-mix(in oklab, ${colour} calc(${v("strength-accent")} * 1%), color(from ${colour} srgb-linear ${LUMA} ${LUMA} ${LUMA}))`;

/** The Solid step's colour of one kind (the fill or its hover) in one mode: Auto's, or the one step whose switch is on. */
const solidChain = (theme: "light" | "dark", kind: "solid" | "solid-hover") => SOLID_STEPS.reduce(
  (paint, step) => `color-mix(in srgb, ${paint}, ${v(`accent-${kind}-${step}-full`)} calc(${v(`solid-${theme}-${step}`)} * 100%))`,
  v(`accent-${kind}-full`),
);

/** The accent's public paint: every `-full` token at the strength; the solid and its hover at the Solid step first. */
export function accentDerived(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const kind of ["solid", "solid-hover"] as const) {
    out[`--area-accent-${kind}-pick`] = `light-dark(${solidChain("light", kind)}, ${solidChain("dark", kind)})`;
    out[`--area-accent-${kind}`] = atStrength(v(`accent-${kind}-pick`));
  }
  const candidate = /^--area-accent-solid(-hover)?-\d+-full$/;
  for (const name of Object.keys(ACCENT_AXIS.presets[0]!.tokens)) {
    if (!name.endsWith("-full") || candidate.test(name) || name === "--area-accent-solid-full" || name === "--area-accent-solid-hover-full") continue;
    const base = name.slice("--area-".length, -"-full".length);
    out[`--area-${base}`] = atStrength(v(`${base}-full`));
  }
  return out;
}
