/**
 * Easing: the shape of every transition, beside Motion's length (owner, 2026-10-19: "add an easing setting (Standard,
 * Snappy, Gentle, Spring) beside the duration"). Motion moves time; Easing moves the curve. One name, one effect: each
 * value sets the same seven roles, so a component reads `--area-ease-out` and never branches on the setting.
 *
 *   ease-out      enters, colour, anchored surfaces (docs/MOTION.md)
 *   ease-in-out   something moving while visible: a switch thumb, an indicator, an accordion's height
 *   ease-in       a full-screen surface leaving for good
 *   ease-drawer   surfaces sliding from a screen edge
 *   ease-effects  colour, opacity and shadow: the out curve, never overshooting (plan A5.4, 2026-11-11)
 *   ease-exit     a surface leaving: accelerates away (the in curve; plan A5.1, 2026-11-11)
 *   ease-linear   spinners, progress, shimmer: linear at every value
 *
 * Every curve is a product's own (docs/research/motion-2026-10-07/design-systems.md, sources in brackets):
 *
 *   Standard  today's curves, the default: out (0.16, 1, 0.3, 1) ChatGPT and Radix Themes [O1]; in-out
 *             (0.65, 0, 0.35, 1) Figma [FG1]; in (0.4, 0, 1, 1) Material and Tailwind [T1]; drawer (0.32, 0.72, 0, 1)
 *             Vaul and Base UI [B1]
 *   Snappy    gets there sooner and stops harder: out (0.19, 1, 0.22, 1) Linear's expo-out [L1]; in-out (0.6, 0, 0.2, 1)
 *             Primer's easeInOut [PR1]; in (0.6, 0, 0.8, 0.6) Atlassian's in-practical [A1]; drawer Linear's expo-out
 *   Gentle    eases in and out evenly: out (0.33, 1, 0.68, 1) Primer's overlay [PR8]; in-out (0.33, 0, 0.67, 1) Fluent's
 *             EasyEase [FL1]; in (0.5, 0, 1, 1) Spectrum's ease-in [S1]; drawer Primer's side sheet (0.33, 1, 0.68, 1) [PR9]
 *   Spring    settles like a spring: out and drawer a damped spring as linear() stops (damping 0.9, stiffness 700;
 *             plan A5.4, 2026-11-11), on movement only; effects, in-out and exits never
 *             overshoot. Until 2026-11-11 out was (0.175, 0.885, 0.32, 1.1) [V1] and in-out (0.175, 0.885, 0.32, 1.275)
 *             [M9], cubics past 1 that made a hover colour pass its target and return
 *
 * `ease-spring` (deprecated, no component uses it) keeps its value at every step so the token set stays the same.
 * Reduced motion sets every duration to 0 (motion.ts), so the curve no longer matters there.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

const CURVES = {
  // Subtle (owner, 2026-10-24: "subtle, clean", after bencho.dev; docs/research/motion-subtle-2026-10-24/systems.md): the
  // out curve is bencho's and Base UI's quint-like (0.22, 1, 0.36, 1), a gentler start than Standard's expo-out (40% of
  // the way in the first tenth of the time, not 49%), so a surface eases in rather than snapping; the rest is Standard's.
  subtle: { out: "cubic-bezier(0.22, 1, 0.36, 1)", inOut: "cubic-bezier(0.65, 0, 0.35, 1)", in: "cubic-bezier(0.4, 0, 1, 1)", drawer: "cubic-bezier(0.32, 0.72, 0, 1)" },
  standard: { out: "cubic-bezier(0.16, 1, 0.3, 1)", inOut: "cubic-bezier(0.65, 0, 0.35, 1)", in: "cubic-bezier(0.4, 0, 1, 1)", drawer: "cubic-bezier(0.32, 0.72, 0, 1)" },
  snappy: { out: "cubic-bezier(0.19, 1, 0.22, 1)", inOut: "cubic-bezier(0.6, 0, 0.2, 1)", in: "cubic-bezier(0.6, 0, 0.8, 0.6)", drawer: "cubic-bezier(0.19, 1, 0.22, 1)" },
  gentle: { out: "cubic-bezier(0.33, 1, 0.68, 1)", inOut: "cubic-bezier(0.33, 0, 0.67, 1)", in: "cubic-bezier(0.5, 0, 1, 1)", drawer: "cubic-bezier(0.33, 1, 0.68, 1)" },
  // Spring (plan A5.4, 2026-11-11): a real spring on movement only, sampled as linear() stops (SPRING below); colours,
  // fades and shadows read `ease-effects`, which here is Subtle's out, so nothing but movement passes its mark. In-out
  // is Subtle's: something already visible that moves (a thumb, an indicator, a body's height) never overshoots.
  spring: { out: "SPRING", inOut: "cubic-bezier(0.65, 0, 0.35, 1)", in: "cubic-bezier(0.4, 0, 1, 1)", drawer: "SPRING" },
} as const;

/**
 * A damped spring from rest to 1 (damping ratio 0.9, stiffness 700, mass 1: the spatial spring the plan's evidence
 * gives, docs/research/system-evaluation-2026-11-11 RD4), sampled at 24 even steps over its settling time (317ms, where it stays within 0.1% of 1) and written as
 * `linear()`, so the transition's own duration (the Speed setting) stretches the shape. It peaks at 1.0015.
 */
export function springStops(stiffness = 700, damping = 0.9, steps = 24): number[] {
  const w0 = Math.sqrt(stiffness), wd = w0 * Math.sqrt(1 - damping * damping);
  const at = (t: number) => 1 - Math.exp(-damping * w0 * t) * (Math.cos(wd * t) + (damping / Math.sqrt(1 - damping * damping)) * Math.sin(wd * t));
  let settle = 0;
  for (let t = 0; t < 2; t += 0.0005) if (Math.abs(1 - at(t)) > 0.001) settle = t;
  return Array.from({ length: steps + 1 }, (_, i) => (i === steps ? 1 : Math.round(at((settle * i) / steps) * 1000) / 1000));
}
export const SPRING = `linear(${springStops().join(", ")})`;
const curve = (value: string) => (value === "SPRING" ? SPRING : value);
/** Under every value but Spring the effects curve is the out curve; under Spring it is Subtle's out. */
const EFFECTS: Record<string, string> = { spring: "cubic-bezier(0.22, 1, 0.36, 1)" };
export type EasingId = keyof typeof CURVES;

const LABELS: Record<EasingId, [string, string]> = {
  subtle: ["Subtle", "Eases into place with a gentle start; nothing snaps (bencho, Base UI)."],
  standard: ["Standard", "Today's curves: a quick start that settles (ChatGPT, Figma)."],
  snappy: ["Snappy", "Gets there sooner and stops harder (Linear, Primer)."],
  gentle: ["Gentle", "Eases in and out evenly (Primer, Fluent)."],
  spring: ["Spring", "Movement settles like a spring; colours, fades and exits never pass their mark."],
};

export const EASING_AXIS: AxisDefinition = {
  id: "easing",
  label: "Easing",
  description: "The shape of every transition: Subtle, Standard, Snappy, Gentle or Spring. Motion sets how long; this sets how.",
  defaultPreset: "subtle",
  namespaces: ["--area-ease-"],
  presets: (Object.keys(CURVES) as EasingId[]).map(id => ({
    id,
    label: LABELS[id][0],
    description: LABELS[id][1],
    tokens: tokens({
      "ease-linear": "linear",
      "ease-out": curve(CURVES[id].out),
      "ease-in": CURVES[id].in,
      "ease-in-out": CURVES[id].inOut,
      "ease-drawer": curve(CURVES[id].drawer),
      /** Colour, opacity and shadow: never overshoots (plan A5.4). The out curve, or Subtle's out under Spring. */
      "ease-effects": EFFECTS[id] ?? CURVES[id].out,
      /** A surface leaving: accelerates away, so its last frames never linger (plan A5.1). The in curve of each value. */
      "ease-exit": CURVES[id].in,
      /** Deprecated: slight overshoot; no component uses it. */
      "ease-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
    }),
  })),
};
