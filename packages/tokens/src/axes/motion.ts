/**
 * Motion: durations and easings.
 *
 * Every preset keeps the same token names so a component never branches on motion. The
 * `none` preset sets every duration to 0 rather than removing transitions, which is what
 * lets it double as the target for `prefers-reduced-motion`.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

/*
 * Easings (docs/MOTION.md; research in docs/research/motion-2026-10-07/). ease-out is what ChatGPT
 * and Radix Themes ship; ease-in-out is Figma's and Primer's; ease-drawer is Vaul's edge-sheet curve.
 * ease-in was expo-in (0.7, 0, 0.84, 0), so slow to start that a 100ms exit read as a pause; it is
 * now the standard accelerate (Material, Polaris). ease-spring overshoots ~10% and is kept only for
 * compatibility: no component uses it (an overshoot reads as play, not as Area).
 */
const EASINGS = {
  "ease-linear": "linear",
  "ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
  "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
  "ease-in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
  "ease-drawer": "cubic-bezier(0.32, 0.72, 0, 1)",
  /** Deprecated: slight overshoot; no component uses it. */
  "ease-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

export const MOTION_AXIS: AxisDefinition = {
  id: "motion",
  label: "Motion",
  description: "How long transitions take, and how they accelerate.",
  defaultPreset: "subtle",
  namespaces: ["--area-duration-", "--area-ease-"],
  presets: [
    {
      id: "none",
      label: "None",
      description: "Instant. Also what `prefers-reduced-motion` resolves to.",
      tokens: tokens({
        "duration-instant": "0ms",
        "duration-fast": "0ms",
        "duration-base": "0ms",
        "duration-moderate": "0ms",
        "duration-slow": "0ms",
        ...EASINGS,
      }),
    },
    {
      id: "subtle",
      label: "Subtle",
      description: "Short and unobtrusive. State changes read as immediate.",
      tokens: tokens({
        "duration-instant": "0ms",
        "duration-fast": "100ms",
        "duration-base": "150ms",
        "duration-moderate": "200ms",
        "duration-slow": "250ms",
        ...EASINGS,
      }),
    },
    {
      id: "expressive",
      label: "Expressive",
      description: "Longer and more visible. Motion becomes part of the voice.",
      tokens: tokens({
        "duration-instant": "0ms",
        "duration-fast": "150ms",
        "duration-base": "250ms",
        "duration-moderate": "320ms",
        "duration-slow": "400ms",
        ...EASINGS,
      }),
    },
  ],
};
