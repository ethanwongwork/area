/**
 * Feedback: how a control answers the pointer (owner, 2026-10-24: "alot of the components dont have any visible
 * motion/interaction animation ... if you are a professional motion designer, how would you apply the motion in a
 * subtle way ... implement the subtle package as the default"). Until then every hover and press landed at once and
 * nothing moved (ChatGPT's 0s; MOTION.md, 2026-10-07), so an interface read as still even while it answered.
 *
 *   off         the old behaviour: hover and press colours land at once, fade on the way out; nothing gives
 *   subtle      (default) hover and a press arrive in about 90ms (0.65 of the leave, 140ms at Speed 210) and fade out
 *               over the leave; a control gives a little under a press, by size: 0.96 small, 0.97 medium, 0.975
 *               large, 0.985 wide (a full-width button, a card, a choice card), about 0.5 to 2.4px a side
 *   pronounced  hover arrives over 160ms, and controls give more: 0.94, 0.95, 0.96, 0.975
 *
 * Measured references (docs/research/motion-subtle-2026-10-24/systems.md): bencho.dev presses buttons to 0.96 and wide
 * rows to 0.985 in 90ms and fades hover plates in over 160ms; Linear's site presses to 0.97 over 160ms; Raycast's to
 * 0.98 over 100ms; Emil Kowalski's rule is 0.97. Component libraries (Geist, Radix Themes, shadcn) don't scale, so
 * Subtle stays at or under a 4% give. The give is a `scale` that rests at 1 (MOTION.md, Crispness: animate transforms
 * only and end at identity), never on a menu trigger or a keyboard press (button.css).
 *
 * The axis writes factors only; emit/base.ts turns them into durations on the Speed setting (`hover-in`, `press-in`), so
 * Speed 0 and reduced motion stop feedback with every other transition, and reduced motion also rests the give at 1.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

export const FEEDBACK_IDS = ["off", "subtle", "pronounced"] as const;
export type FeedbackId = (typeof FEEDBACK_IDS)[number];
/** The value `prefers-reduced-motion` resolves to. */
export const FEEDBACK_NONE: FeedbackId = "off";

type Give = { sm: number; md: number; lg: number; wide: number };
const FEEDBACK: Record<FeedbackId, { label: string; description: string; hover: number; press: number; give: Give }> = {
  off: { label: "Off", description: "Hover and press land at once; nothing moves under the pointer.", hover: 0, press: 0, give: { sm: 1, md: 1, lg: 1, wide: 1 } },
  subtle: { label: "Subtle", description: "Hover and press ease in, and controls give a little under a press (0.97 at medium; wide surfaces 0.985).", hover: 0.65, press: 0.65, give: { sm: 0.96, md: 0.97, lg: 0.975, wide: 0.985 } },
  pronounced: { label: "Pronounced", description: "Hover eases in more slowly and controls give more (0.95 at medium; wide surfaces 0.975).", hover: 1.15, press: 0.65, give: { sm: 0.94, md: 0.95, lg: 0.96, wide: 0.975 } },
};

export const FEEDBACK_AXIS: AxisDefinition = {
  id: "feedback",
  label: "Feedback",
  description: "How a control answers the pointer: Off, Subtle or Pronounced. Speed sets how long; this sets how much moves.",
  defaultPreset: "subtle",
  namespaces: ["--area-feedback-"],
  presets: FEEDBACK_IDS.map(id => ({
    id,
    label: FEEDBACK[id].label,
    description: FEEDBACK[id].description,
    tokens: tokens({
      /** Hover's arrival as a share of `duration-fast` (the leave). */
      "feedback-hover": String(FEEDBACK[id].hover),
      /** A press's arrival as a share of `duration-fast`. */
      "feedback-press": String(FEEDBACK[id].press),
      /** How far a control gives under a press, by its size tier, and a wide surface (a card, a full-width button). */
      "feedback-scale-sm": String(FEEDBACK[id].give.sm),
      "feedback-scale": String(FEEDBACK[id].give.md),
      "feedback-scale-lg": String(FEEDBACK[id].give.lg),
      "feedback-scale-wide": String(FEEDBACK[id].give.wide),
    }),
  })),
};
