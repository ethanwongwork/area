/**
 * Easing: the shape of every transition, beside Motion's length (owner, 2026-10-19: "add an easing setting (Standard,
 * Snappy, Gentle, Spring) beside the duration"). Motion moves time; Easing moves the curve. One name, one effect: each
 * value sets the same five roles, so a component reads `--area-ease-out` and never branches on the setting.
 *
 *   ease-out      enters, colour, anchored surfaces (docs/MOTION.md)
 *   ease-in-out   something moving while visible: a switch thumb, an indicator, an accordion's height
 *   ease-in       a full-screen surface leaving for good
 *   ease-drawer   surfaces sliding from a screen edge
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
 *   Spring    passes its mark and settles: out (0.175, 0.885, 0.32, 1.1) Geist's swift [V1]; in-out
 *             (0.175, 0.885, 0.32, 1.275) Material's switch handle [M9]; drawer Geist's swift. Exits never overshoot,
 *             so in stays Standard's
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
  spring: { out: "cubic-bezier(0.175, 0.885, 0.32, 1.1)", inOut: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", in: "cubic-bezier(0.4, 0, 1, 1)", drawer: "cubic-bezier(0.175, 0.885, 0.32, 1.1)" },
} as const;
export type EasingId = keyof typeof CURVES;

const LABELS: Record<EasingId, [string, string]> = {
  subtle: ["Subtle", "Eases into place with a gentle start; nothing snaps (bencho, Base UI)."],
  standard: ["Standard", "Today's curves: a quick start that settles (ChatGPT, Figma)."],
  snappy: ["Snappy", "Gets there sooner and stops harder (Linear, Primer)."],
  gentle: ["Gentle", "Eases in and out evenly (Primer, Fluent)."],
  spring: ["Spring", "Passes its mark a little and settles back (Geist, Material); exits never overshoot."],
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
      "ease-out": CURVES[id].out,
      "ease-in": CURVES[id].in,
      "ease-in-out": CURVES[id].inOut,
      "ease-drawer": CURVES[id].drawer,
      /** Deprecated: slight overshoot; no component uses it. */
      "ease-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
    }),
  })),
};
