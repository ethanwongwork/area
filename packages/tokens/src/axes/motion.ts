/**
 * Motion: durations and easings.
 *
 * Every preset keeps the same token names so a component never branches on motion. The
 * `none` preset sets every duration to 0 rather than removing transitions, which is what
 * lets it double as the target for `prefers-reduced-motion`.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

const EASINGS = {
  "ease-linear": "linear",
  "ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
  "ease-in": "cubic-bezier(0.7, 0, 0.84, 0)",
  "ease-in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
  /** Slight overshoot. For elements that enter, never for colour or opacity. */
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
        "duration-slow": "400ms",
        ...EASINGS,
      }),
    },
  ],
};
