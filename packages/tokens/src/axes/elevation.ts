/**
 * Elevation: how much surfaces lift off the page, as one number (owner, 2026-10-14: "add elevation as an
 * option"; then "figure out a naming convention similar to the existing axis ... think about the 2px scale
 * for corner radius and the 1px scale for typeface"). Research: docs/research/elevation-2026-10-14.md.
 *
 * The number is the Menu's shadow strength in percent, as the radius setting is the medium Button's corner
 * and the type setting the base text size: 0 (Flat) to 8, one step at a time, 3 by default. Every role
 * scales from it, so one setting moves the whole library together.
 *
 * Components never pick a shadow; they name the role they play:
 *
 *   control  a raised part on a track or plate: Switch, Slider and Segmented thumbs, the soft Toggle
 *            group selection, Badge modern
 *   resting  a surface that rests on the page: Card, Panel, Board card, Composer
 *   tooltip  a small annotation: Tooltip, Toggletip
 *   float    a surface over the page: Menu (and everything that opens one: Context menu, Combobox, custom
 *            Select, Tag picker, Model picker, Split button, Zoom control), Popover (Hover card, Date
 *            picker), the Select picker, Toast, the Calendar and ColorPicker surfaces, the floating
 *            Toolbar, the Video player's controller, Scroll to latest (Board card actions sit on the card's
 *            paint with no lift since review round 30, docs/specs/board.md)
 *   modal    the topmost surface, over a scrim: Dialog (Confirm dialog), Drawer, Command palette
 *
 * Geometry is Fluent 2's recipe per role at the default Distance (packages/tokens/src/utils/shadows.ts @93e324f72): an
 * ambient layer with no offset and a key layer whose offset is half its blur. control is shadow2, resting
 * shadow4, tooltip shadow8, float shadow16, modal shadow28. Strength scales the alpha only:
 *
 *   key      n% x the role's weight: control 1, resting 0.5, tooltip 0.5, float 1, modal 2 (picks: rest and
 *            annotation sit under the float, a modal over it, as in every system surveyed)
 *   ambient  half the key (Notion's popover: 2.7% under 5%; the floating lift Area carried until 2026-10-13)
 *   dark     twice the light alpha (Fluent's dark shadow colours are its light ones doubled: 24/28 over 12/14)
 *
 * Anchors on the scale: 3 is Notion's small floating chip (2.7%, captured 2026-10-13), 5 its popover's key
 * (5%), 8 ChatGPT's menu (8%). Fluent's own 14% sits past the top: the owner found it too strong.
 *
 * Every role is two layers at every step, so steps swap and transition layer by layer. 0 is a transparent
 * shadow, never `none`: a role also sits inside lists beside a component's own layers (Board card's tone
 * ring, the floating Toolbar's edge), and `none` there invalidates the whole box-shadow. Forced colours
 * compute box-shadow to none; every floating surface keeps its 1px border-float, which the browser repaints
 * (forced-colors.css restores the frame width at Surface 0, where the edge is a shadow (axes/surface.ts), and gives the floating Toolbar, whose edge is
 * a box-shadow, an outline). The ColorPicker thumbs' shadow is functional and fixed, not a role.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

export const ELEVATION_STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
export type ElevationStep = (typeof ELEVATION_STEPS)[number];

const describe = (step: number) =>
  step === 0 ? "No shadows. Edges and the dialog scrim separate surfaces."
    : `The Menu's shadow at ${step}%; every role scales from it${step === 3 ? " (default: Notion's lightest lift)" : step === 5 ? " (Notion's popover)" : step === 8 ? " (ChatGPT's menu)" : ""}.`;

/**
 * Since 2026-10-18 (Edge and Depth, axes/depth.ts) the axis writes the number alone (`--area-elevation`), labelled
 * Shadow in the app, and sets the floating roles (tooltip, float, modal) and the hover lift. The resting and control
 * roles have their own number (Rest shadow), as fields do (Field shadow); Shadow size, Softness, Light and Shadow colour
 * shape every role. At their defaults every role is the two-layer recipe above, exactly.
 */
export const ELEVATION_AXIS: AxisDefinition = {
  id: "elevation",
  label: "Elevation",
  description: "How much menus, popovers, tooltips and dialogs lift, and a hovered card, as the Menu's shadow strength from 0 (flat) to 8.",
  defaultPreset: "3",
  namespaces: ["--area-elevation:"],
  presets: ELEVATION_STEPS.map(step => ({
    id: String(step),
    label: step === 0 ? "0 (Flat)" : step === 3 ? "3 (Default)" : String(step),
    description: describe(step),
    tokens: tokens({ elevation: step }),
  })),
};
