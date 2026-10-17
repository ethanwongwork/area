/**
 * Surface: the decorative frame's width, as one number (owner, 2026-10-14: "continue working on the next
 * axis", after Elevation and Motion took the one-number form). Required edges (`stroke-width`: controls,
 * state, swatch rings, joined seams, divider rules) and focus are independent of it.
 * Research: docs/research/surface-2026-10-14.md.
 *
 * 1 (the default) draws the 1px frames of cards, panels and floating surfaces. 0 (Borderless) removes them
 * for a shadow-led look (it was the Elevated preset). No other width is offered: every product measured
 * frames at 1px (Notion's ring, ChatGPT's composer, Cursor's widget border), and a fractional width would
 * put the insets that count the frame off whole pixels at 1x.
 *
 * Borderless still keeps an edge, as ChatGPT's frameless menu does: `shadow-edge` is a 1px-blur shadow at
 * 62% black outside the surface and, in dark, a 1px-blur 20% white line inside it (captured 2026-10-13,
 * docs/research/elevation-2026-10-13.md), drawn crisp since 2026-10-17 so it holds at 1x. Every surface whose frame the setting removes lists it in its
 * box-shadow, so a surface never loses its edge: not at Elevation 0 (no lift to carry it), and not in dark
 * (where a lift barely reads). At 1 it is transparent. It is two layers at both steps, never `none`, so it
 * sits in a box-shadow list beside the Elevation roles. `shadow-edge-filter` is the same edge for a shape a
 * box-shadow cannot follow (the Popover arrow): a drop-shadow outside the shape, 62% black, or 20% white in dark.
 * Forced colours drop box-shadow; forced-colors.css puts the frame back there. The axis writes `frame-width`;
 * components read `border-width`, derived in emit/base.ts as the frame or 1px under increased contrast (owner,
 * 2026-10-15), so More contrast brings the frame back at 0 too, as macOS Increase Contrast adds borders. The soft
 * edge stays beside it.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

export const SURFACE_STEPS = ["0", "1"] as const;

const NO_EDGE = "0 0 0 0 transparent, inset 0 0 0 0 transparent";
// Dark draws its line crisp (no blur, 1px spread): blurred, it was barely visible at 1x on a near-black ground (owner,
// 2026-10-17: "make it firmer"). 20% white is ChatGPT's hairline, #4b4b4b over its #212121 card.
const SOFT_EDGE = "0 0 1px rgb(0 0 0 / 0.62), inset 0 0 0 1px light-dark(transparent, rgb(255 255 255 / 0.2))";
const SOFT_EDGE_FILTER = "drop-shadow(0 0 1px light-dark(rgb(0 0 0 / 0.62), rgb(255 255 255 / 0.2)))";

export const SURFACE_AXIS: AxisDefinition = {
  id: "surface",
  label: "Surface",
  description: "The frame's width on cards, panels and floating surfaces, 1px or 0 (Borderless, a soft shadow edge).",
  defaultPreset: "1",
  namespaces: ["--area-frame-width:", "--area-shadow-edge:", "--area-shadow-edge-filter:"],
  presets: [
    { id: "0", label: "0 (Borderless)", description: "No frames: a soft shadow edge, ChatGPT's frameless menu. Control and state edges remain.", tokens: tokens({ "frame-width": "0px", "shadow-edge": SOFT_EDGE, "shadow-edge-filter": SOFT_EDGE_FILTER }) },
    { id: "1", label: "1 (Default)", description: "1px frames on cards, panels and floating surfaces.", tokens: tokens({ "frame-width": "1px", "shadow-edge": NO_EDGE, "shadow-edge-filter": "none" }) },
  ],
};
