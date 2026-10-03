/**
 * Roundness: a signed offset on every corner, in 2px steps, independent of the radius family.
 *
 * The radius axis chooses a family (Sharp ... Pill) as whole ladders; roundness moves whichever
 * family is chosen in steps of 2px, applied equally to every role: control tiers, rows, small
 * shapes and containers (owner, 2026-10-03: "if the default is 8px, i want to show that
 * component at 0px, 2px, 4px, 6px, 8px, 10px, 12px, etc ... until it goes to pill"; odd steps
 * dropped, a 1px step barely reads).
 *
 *   corner = clamp(0, min(family(height), height x radius-cap) + offset, height / 2)
 *
 * - the cap still shapes the family (a 12px family on a 20px box reads 8), and the offset moves
 *   the result, so every shape can reach square and pill;
 * - half the height is the browser's own clamp: past it the shape is a pill;
 * - concentric shells (Card, Composer, Segmented track) derive from the shape they hold, and
 *   nested shapes from their shell less its inset, so a shell and its contents move together.
 *
 * The range, -12 to +12: at -12 the default surface (12) is square and every control with it;
 * at +12 the largest control (48, corner 12) is a pill. Sharp ignores the offset (multiplied
 * by radius-concentric, 0 at Sharp). See docs/research/radius-audit-2026-10-03.md, "Roundness".
 */
import { type AxisDefinition, tokens } from "./schema.ts";

const STEPS = [-12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12].map(step => {
  const id = step > 0 ? `+${step}` : String(step);
  return { id, label: id.replace("-", "−"), description: step === 0 ? "The radius family as designed." : `Every corner ${Math.abs(step)}px ${step < 0 ? "sharper, down to square" : "rounder, up to a pill"}.` };
});

export const ROUNDNESS_AXIS: AxisDefinition = {
  id: "roundness",
  label: "Roundness",
  description: "Moves every corner in 2px steps, from square to pill; each shape stops at its own limits.",
  defaultPreset: "0",
  namespaces: ["--area-radius-offset:"],
  presets: STEPS.map(step => ({
    ...step,
    tokens: tokens({ "radius-offset": `${Number(step.id)}px` }),
  })),
};
