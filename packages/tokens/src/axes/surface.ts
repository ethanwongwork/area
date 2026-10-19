/**
 * Surface: the decorative frame's width, as one number (owner, 2026-10-14: "continue working on the next
 * axis", after Elevation and Motion took the one-number form). Required edges (`stroke-width`: controls,
 * state, swatch rings, joined seams, divider rules) and focus are independent of it.
 * Research: docs/research/surface-2026-10-14.md.
 *
 * 1 (the default) draws the 1px frames of cards, panels and floating surfaces. 0 (Borderless) removes them
 * for a shadow-led look (it was the Elevated preset). Every product measured frames at 1px (Notion's ring, ChatGPT's
 * composer, Cursor's widget border). Since 2026-10-18 (Edge and Depth, axes/depth.ts) two more widths: 0.5 (Hairline,
 * Apple's one device pixel and Polaris' 0.66; on a 1x screen Chromium draws it as one pixel and the insets that count
 * it sit half a pixel off) and 2 (Bold, the outer end of every surveyed width scale). Raised contrast makes a hairline
 * 1px (`border-width` below).
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
 * 2026-10-15), so More contrast brings the frame back at 0 too, as macOS Increase Contrast adds borders.
 *
 * The soft edge is derived beside it (emit/base.ts), drawn only while no frame is: at 1, and at 0 under any raised
 * contrast (Medium or More), it is transparent, so a surface never draws its frame and the soft edge at once (the
 * double edge in the Elevation and Stroke audit, 2026-10-18; it had stayed beside the returned frame). It reads
 * `border-width`, so it re-derives wherever Surface or Contrast is set.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

export const SURFACE_STEPS = ["0", "0.5", "1", "2"] as const;

// 1 while no frame is drawn, 0 once one is (`border-width` is the frame or contrast's 1px).
const EDGE_ON = "(1 - sign(var(--area-border-width)))";
// Dark draws its line crisp (no blur, 1px spread): blurred, it was barely visible at 1x on a near-black ground (owner,
// 2026-10-17: "make it firmer"). 20% white is ChatGPT's hairline, #4b4b4b over its #212121 card.
/** The soft edge, `--area-shadow-edge`: 62% black outside, 20% white inside in dark, transparent while a frame is drawn. */
export const SOFT_EDGE = `0 0 1px rgb(0 0 0 / calc(0.62 * ${EDGE_ON})), inset 0 0 0 1px light-dark(transparent, rgb(255 255 255 / calc(0.2 * ${EDGE_ON})))`;
/** The same edge as a drop-shadow, `--area-shadow-edge-filter`, for a shape a box-shadow cannot follow. */
export const SOFT_EDGE_FILTER = `drop-shadow(0 0 1px light-dark(rgb(0 0 0 / calc(0.62 * ${EDGE_ON})), rgb(255 255 255 / calc(0.2 * ${EDGE_ON}))))`;

export const SURFACE_AXIS: AxisDefinition = {
  id: "surface",
  label: "Surface",
  description: "The frame's width on cards, panels and floating surfaces: 0 (Borderless, a soft shadow edge), 0.5 (Hairline), 1 or 2 (Bold).",
  defaultPreset: "1",
  namespaces: ["--area-frame-width:"],
  presets: [
    { id: "0", label: "0 (Borderless)", description: "No frames: a soft shadow edge, ChatGPT's frameless menu. Control and state edges remain.", tokens: tokens({ "frame-width": "0px" }) },
    { id: "0.5", label: "0.5 (Hairline)", description: "Half-pixel frames, one device pixel on a 2x screen (Apple's hairline); 1px under raised contrast.", tokens: tokens({ "frame-width": "0.5px" }) },
    { id: "1", label: "1 (Default)", description: "1px frames on cards, panels and floating surfaces.", tokens: tokens({ "frame-width": "1px" }) },
    { id: "2", label: "2 (Bold)", description: "2px frames: a printed, outlined look. Insets count the frame, so content stays put.", tokens: tokens({ "frame-width": "2px" }) },
  ],
};
