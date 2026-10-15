/**
 * Radius: the system's one corner setting (owner, 2026-10-03: "i just want 1 corner radius setting
 * that controls everything").
 *
 * A preset is one number, the corner it gives the default 32px Button: 0 (Sharp), 2, 4, 6, 8
 * (default), 10, 12, 14, and Pill (owner, 2026-10-04: one number, everything scales off it).
 * Every other corner follows from it, so each preset is one coherent theme:
 *
 * - Shapes on the height ladder scale with their height: corner = setting x height / 32, rounded
 *   down to even pixels, never under 2 (emit/base.ts). So every height goes square together at
 *   Sharp and reaches half its height together at Pill (16 on a 32px control); 8 gives the audited
 *   ladder exactly, 4 / 6 / 6 / 8 / 10 / 12 for 20-48px boxes, at either density.
 * - Surfaces (the container role) take their own ladder, 4px a step above 4 (owner: two step sizes;
 *   a 2px step is a quarter of a Button but a sixth of a surface): 0, 2, 4, 8, 12, 16, 20, 24.
 *   At Pill they stay finite at 24 (owner, 2026-10-03: "every control is a pill"), as Radix Themes'
 *   `full` keeps cards at its large ladder while controls go round.
 * - Nested shapes are their shell less the inset, never sharper than min(4, setting): only Sharp is
 *   square anywhere (owner: "0 corner radius should apply everywhere. 2 and up the corner radius
 *   should use math for all inset").
 *
 * Replaces the hand-written families (Subtle 4, Soft 6, Standard 8, Round 10, Rotund 12) and the
 * roundness offset. See docs/research/radius-audit-2026-10-03.md, "One corner setting".
 */
import { type AxisDefinition, tokens } from "./schema.ts";

/** [id, Button corner, surface corner]. Pill's 16 is half of 32: every height takes h / 2. */
const STEPS: ReadonlyArray<readonly [string, number, number]> = [
  ["0", 0, 0],
  ["2", 2, 2],
  ["4", 4, 4],
  ["6", 6, 8],
  ["8", 8, 12],
  ["10", 10, 16],
  ["12", 12, 20],
  ["14", 14, 24],
  ["pill", 16, 24],
];

const describe = (id: string, button: number, surface: number) =>
  id === "0" ? "Sharp: square corners everywhere."
    : id === "pill" ? "Every control is a pill; surfaces stay finite at 24, as round as their pill rows allow."
      : `${button}px on a medium Button, ${surface}px on surfaces${id === "8" ? " (default)" : ""}.`;

export const RADIUS_AXIS: AxisDefinition = {
  id: "radius",
  label: "Radius",
  description: "One corner setting, from Sharp to Pill: controls scale with their height, surfaces and nested shapes follow.",
  defaultPreset: "8",
  namespaces: [
    "--area-radius-factor",
    "--area-radius-min",
    "--area-radius-surface",
    "--area-radius-concentric",
  ],
  presets: STEPS.map(([id, button, surface]) => ({
    id,
    // Named as the other number settings and the Inspector name them: "0 (Sharp)", "8 (Default)".
    label: id === "pill" ? "Pill" : id === "0" ? "0 (Sharp)" : id === "8" ? "8 (Default)" : id,
    description: describe(id, button, surface),
    tokens: tokens({
      // The corner per pixel of height: the Button's corner over its 32px.
      "radius-factor": String(button / 32),
      // The smallest corner a rounded preset draws; only Sharp reaches 0.
      "radius-min": button === 0 ? "0px" : "2px",
      "radius-surface": `${surface}px`,
      // How much of a shell's distance joins its concentric corner: 0 at Sharp, so shells are square.
      "radius-concentric": button === 0 ? "0" : "1",
    }),
  })),
};
