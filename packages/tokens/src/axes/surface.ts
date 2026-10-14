/**
 * Surface: the decorative stroke weight. Required edges (`stroke-width`: controls, state, swatch
 * rings, joined seams, divider rules) and focus are independent of it.
 *
 * Depth moved to its own axis (axes/elevation.ts, owner 2026-10-14), so stroke and lift combine
 * freely: Outlined draws the 1px frames of cards, panels and floating surfaces; Borderless removes
 * them, for a shadow-led look at a higher elevation step (it was the Elevated preset).
 */
import { type AxisDefinition, tokens } from "./schema.ts";

export const SURFACE_AXIS: AxisDefinition = {
  id: "surface",
  label: "Surface",
  description: "Whether surfaces draw their 1px frame.",
  defaultPreset: "outlined",
  namespaces: ["--area-border-width"],
  presets: [
    { id: "outlined", label: "Outlined", description: "1px frames on cards, panels and floating surfaces.", tokens: tokens({ "border-width": "1px" }) },
    { id: "borderless", label: "Borderless", description: "No decorative frames; pair with an elevation that lifts. Control and state edges remain.", tokens: tokens({ "border-width": "0px" }) },
  ],
};
