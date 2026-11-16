/**
 * Motion: how long transitions take, as one number (owner, 2026-10-14: "go with motion, same
 * one-number approach as elevation"). It was three presets, None, Subtle and Expressive.
 *
 * The number is `duration-base` in milliseconds: the Menu's open until 2026-11-11, a dialog's open since menus and
 * other anchored surfaces moved to `fast` (plan A5.1, owner 2026-11-11). Elevation is the Menu's shadow,
 * the radius setting the medium Button's corner and the type setting the base text size: 0 (None) to
 * 300, in steps of 30, 210 by default (owner, 2026-10-14: "make 210 the default", matching the target
 * products: ChatGPT's popover opens in 220ms, Figma's dropdown in 250). Every duration scales from it,
 * in thirds:
 *
 *   quick     1/3   colour leaving a state (plan A5.5, 2026-11-11: 70 at 210; it was fast)
 *   fast      2/3   small marks, anchored surfaces both ways (plan A5.1), dialog exit
 *   base      1     dialog enter, sliding indicators
 *   moderate  4/3   drawer and accordion exit
 *   slow      5/3   drawer and toast enter, accordion open
 *
 * The thirds are the old Subtle's ratios (100 / 150 / 200 / 250; Expressive's 150 / 250 / 320 / 400
 * was within 10ms of the same thirds), and steps of 30 keep every token a whole number of 10ms. 150
 * is the old Subtle default exactly; 240 is Expressive within 10ms. Anchors
 * (docs/research/motion-2026-10-07/design-systems.md): 150 is Radix Themes' and Tailwind's default, 210 Geist's popover (200) and
 * ChatGPT's (220), 240 Figma's dropdown (250), 300 Primer's medium (dropdown, modal); the top step
 * stops where `slow` reaches 500, Primer's ceiling for any UI motion.
 *
 * `instant` is 0 at every step. The number moves time, never the curve: the curve is Easing (easing.ts, 2026-10-19).
 * Every step keeps the same token names, so a component never branches on motion; 0 sets every
 * duration to 0 rather than removing transitions, which is what lets it double as the target for
 * `prefers-reduced-motion` (emit/css.ts).
 *
 * Loops (Spinner, Skeleton shimmer, indeterminate Progress, Indicator pulse, Message cursor, OTP caret) run
 * fixed, measured periods instead, and `duration-loop` is the factor on every one: 1, and 0 at step 0. A
 * zero-length animation draws nothing, so a loop rests in its base drawing; the Skeleton band and the
 * Progress stripe read the same factor. Being a token, it inherits: the nearest motion scope decides, so a
 * non-zero scope inside a 0 scope runs its loops again (they stopped by `[data-area-motion="0"] .x` until
 * 2026-10-14), and reduced motion stops them wherever it re-emits step 0.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

export const MOTION_STEPS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300] as const;
export type MotionStep = (typeof MOTION_STEPS)[number];
/** The step `prefers-reduced-motion` resolves to. */
export const MOTION_NONE = "0";

/*
 * The curves are their own setting since 2026-10-19 (easing.ts, owner: "add an easing setting ... beside the
 * duration"): this axis moves time only.
 */

/** One duration at a step: the step's thirds. */
export const duration = (step: number, thirds: number) => `${(step / 3) * thirds}ms`;

function stepTokens(step: number) {
  return tokens({
    "duration-instant": "0ms",
    "duration-quick": duration(step, 1),
    "duration-fast": duration(step, 2),
    "duration-base": duration(step, 3),
    "duration-moderate": duration(step, 4),
    "duration-slow": duration(step, 5),
    "duration-loop": step === 0 ? "0" : "1",
  });
}

const describe = (step: number) =>
  step === 0 ? "Instant. Also what `prefers-reduced-motion` resolves to."
    : `A dialog opens in ${step}ms and a menu in ${(step / 3) * 2}ms; every duration scales from it${step === 210 ? " (default)" : step === 150 ? " (the old Subtle)" : step === 240 ? " (the old Expressive)" : step === 300 ? " (the slowest reaches 500ms)" : ""}.`;

export const MOTION_AXIS: AxisDefinition = {
  id: "motion",
  label: "Speed",
  description: "How long transitions take, as a dialog's open in ms from 0 (none) to 300, 210 by default; every duration scales from it.",
  defaultPreset: "210",
  namespaces: ["--area-duration-"],
  presets: MOTION_STEPS.map(step => ({
    id: String(step),
    label: step === 0 ? "0 (None)" : String(step),
    description: describe(step),
    tokens: stepTokens(step),
  })),
};
