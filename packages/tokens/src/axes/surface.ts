/**
 * Stroke width and Rest shadow: how surfaces at rest are set apart from what is around them, by a line, a subtle
 * shadow, both, or neither (owner, 2026-10-19: "the options are no strokes (flat), 0.5 strokes, 1 strokes, 1.5 strokes,
 * 2 strokes, or you can use varying subtle shadows only, or potentially combine strokes with subtle shadows. this is all
 * for rest as dividers, not shadows for elevation purposes"). Two independent settings, so every combination is one
 * choice of each. Elevation (axes/elevation.ts) stays the lift of floating surfaces and hovers.
 *
 * Stroke width (`data-area-surface`, the Surface setting from 2026-10-14; research docs/research/surface-2026-10-14.md):
 * the decorative frame of cards, panels and floating surfaces, 0 (Flat: no line, and nothing in its place), 0.5, 1 (the
 * default; every product measured frames at 1px: Notion's ring, ChatGPT's composer, Cursor's widget border), 1.5 or 2.
 * A half-pixel width is one device pixel on a 2x screen; on a 1x screen Chromium draws it as one pixel and the insets
 * that count the frame sit half a pixel off. Required edges (`stroke-width`: controls, state, swatch rings, joined seams,
 * divider rules) and focus are independent of it. The axis writes `frame-width`; components read `border-width`, derived
 * in emit/base.ts as the frame or 1px under increased contrast (owner, 2026-10-15), so Medium or More contrast brings a
 * line back at 0 and rounds a half pixel up, as macOS Increase Contrast adds borders.
 *
 * Rest shadow (`data-area-shadow-rest`): a subtle shadow round the same surfaces, 0 (None, the default) to 8, beside the
 * line or in its place. It is `shadow-edge`, which every surface with a frame already lists first in its box-shadow:
 * after ChatGPT's frameless-menu edge (a 1px-blur dark shadow; in dark, a crisp white line inside, captured 2026-10-13,
 * docs/research/elevation-2026-10-13.md), now set by its own setting instead of switching on when the frame is 0. Light:
 * a half-pixel-down, 1.5px-blur shadow at 5% black a step (40% at 8; ChatGPT's 62% read stronger than a 1px line).
 * Dark: a 1px white line inside at 2.5% a step (20% at 8, ChatGPT's hairline, #4b4b4b over its #212121). Two layers at
 * every step, never `none`, so it sits in a box-shadow list beside the Elevation roles; `shadow-edge-filter` is the same
 * edge for a shape a box-shadow cannot follow (the Popover arrow). Contrast never strengthens it (no system surveyed
 * does). Forced colours drop box-shadow; forced-colors.css puts the frame back there.
 *
 * Until 2026-10-19 the frame was 0 or 1 and 0 always drew the soft edge (labelled "0 (Borderless)", then briefly Edge:
 * Line / Shadow); a surface could not be flat, and a line could not take a shadow.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

export const SURFACE_STEPS = ["0", "0.5", "1", "1.5", "2"] as const;
export const REST_SHADOW_STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

const REST = "var(--area-shadow-rest-step, 0)";
/** The rest shadow, `--area-shadow-edge`: light 5% black a step, half a pixel down, 1.5px blur; dark a 2.5%-a-step white line inside. */
export const SOFT_EDGE = `0 0.5px 1.5px light-dark(rgb(0 0 0 / calc(0.05 * ${REST})), transparent), inset 0 0 0 1px light-dark(transparent, rgb(255 255 255 / calc(0.025 * ${REST})))`;
/** The same edge as a drop-shadow, `--area-shadow-edge-filter`, for a shape a box-shadow cannot follow. */
export const SOFT_EDGE_FILTER = `drop-shadow(0 0.5px 1.5px light-dark(rgb(0 0 0 / calc(0.05 * ${REST})), rgb(255 255 255 / calc(0.025 * ${REST}))))`;

export const SURFACE_AXIS: AxisDefinition = {
  id: "surface",
  label: "Stroke width",
  description: "The line round cards, panels and floating surfaces, in px: 0 (flat, no line) to 2.",
  defaultPreset: "1",
  namespaces: ["--area-frame-width:"],
  presets: SURFACE_STEPS.map(step => ({
    id: step,
    label: step === "0" ? "0 (Flat)" : step,
    description: step === "0" ? "No line round surfaces; a Rest shadow can set them apart instead. Control and state edges remain."
      : `A ${step}px line round cards, panels and floating surfaces.`,
    tokens: tokens({ "frame-width": `${step}px` }),
  })),
};

export const REST_SHADOW_AXIS: AxisDefinition = {
  id: "shadow-rest",
  label: "Edge shadow",
  description: "A subtle shadow round cards, panels and floating surfaces at rest, 0 (none) to 8, with the line or instead of it.",
  defaultPreset: "0",
  namespaces: ["--area-shadow-rest-step:"],
  presets: REST_SHADOW_STEPS.map(step => ({
    id: String(step),
    label: step === 0 ? "0 (None)" : String(step),
    description: step === 0 ? "No rest shadow." : `A rest shadow at ${step * 5}% (light), ${step * 2.5}% (dark).`,
    tokens: tokens({ "shadow-rest-step": String(step) }),
  })),
};
