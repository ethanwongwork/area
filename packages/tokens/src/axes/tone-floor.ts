/**
 * Tone contrast (owner, 2026-11-02: "allow for more vibrant colors in places where accessibility limits the vibrancy and
 * saturation and lightness of certain colors"). The lowest contrast a status or label tone's words keep on the
 * grounds they sit on: its tints at rest, hover and pressed, the page, the surface and the subtle ground. 4.5 (AA) is the
 * default; below it each tone's ink rises toward its most vivid colour, solved exactly at the floor (color/scale.ts
 * `solveInk`), never past the colour's own peak. One for both modes, as Status is.
 *
 * What it never moves: the accent's ink (links, selection), every neutral ink, words on a solid fill, edges and focus.
 * Raised Contrast, and the OS asking for more (Contrast's System), put every tone back at 4.5 (axes/tone-tint.ts
 * `toneDerived`, which picks each ink by this floor and Tone tint).
 *
 * It writes numbers only: a switch per floor below the default, and the floor's darkening target and luminance bound,
 * which the Layers model darkens the tone inks by on a gray page (color/layers.ts `toneFloorTarget`, `toneFloorY`).
 */
import { type AxisDefinition, tokens } from "./schema.ts";
import { DEFAULT_TONE_FLOOR, TONE_FLOORS, toneFloorId, toneFloorTarget, toneFloorY } from "../color/layers.ts";

/** The floors below the default, each a switch emit/base.ts mixes its ink in by. */
export const LOWER_FLOORS = TONE_FLOORS.filter(floor => floor !== DEFAULT_TONE_FLOOR);

export const TONE_FLOOR_AXIS: AxisDefinition = {
  id: "tone-contrast",
  label: "Tone contrast",
  description: "The lowest contrast colored status words keep on their tints: 4.5 (AA) by default, down to 2.5 for brighter, more saturated tones. Links, body text and edges keep theirs.",
  defaultPreset: String(DEFAULT_TONE_FLOOR),
  namespaces: ["--area-tone-floor-"],
  presets: TONE_FLOORS.map(floor => ({
    id: String(floor),
    label: floor === DEFAULT_TONE_FLOOR ? "4.5 (AA)" : floor === 2.5 ? "2.5 (Vivid)" : String(floor),
    description: floor === DEFAULT_TONE_FLOOR
      ? "WCAG AA: status words at 4.5:1 or more."
      : `Status words at ${floor}:1 or more, below WCAG AA${floor >= 3 ? "" : " and its large-text 3:1"}: brighter, more saturated tones.`,
    tokens: tokens({
      ...Object.fromEntries(LOWER_FLOORS.map(lower => [`tone-floor-${toneFloorId(lower)}`, lower === floor ? 1 : 0])),
      "tone-floor-target": Number(toneFloorTarget(floor).toFixed(6)),
      "tone-floor-y": Number(toneFloorY(floor).toFixed(6)),
    }),
  })),
};
