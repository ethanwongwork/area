/**
 * Radius.
 *
 * Radius is a size curve owned entirely by this axis. Each family has a reference value
 * at the default 32px control, then scales deliberately for smaller and larger boxes.
 * This makes a standard small Button 6px and a standard medium Button 8px while keeping
 * same-size text and icon Buttons identical.
 *
 * Containers sit at 12px, the single most agreed-upon number in the survey: Primer
 * overlays, OpenAI's popover, dialog and alert, and Linear's cards all use it.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

type ControlRadii = { xs: number; sm: number; md: number; lg: number; xl: number };

interface RadiusPreset {
  /**
   * A value per control tier. The curve changes only where box height changes; controls
   * at the same painted height always read the same token.
   */
  control: ControlRadii;
  /** Cards, dialogs, menus, popovers. */
  container: number;
  /** Badges, swatches, and other small nested shapes. */
  small: number;
  /**
   * A full-width row's backplate: a sidebar item, a table of contents entry, a nav link.
   *
   * Its own step because a row is neither a control nor a nested shape. It has a control's
   * height but a container's width, and both of the other tokens get it wrong: `small` at
   * 4px reads as a rectangle with the corners filed off, and `control` at 6px is tuned for
   * a box roughly as wide as it is tall.
   *
   * An earlier version of this comment derived 8 as "a quarter of OpenAI's 40px row". That
   * was wrong twice over, and the correction is worth keeping. Their row is not 40px: the
   * shipped tokens give `--menu-item-padding` as 6px 8px on 14/20 type, which is a 32px row
   * -- the same height Area already uses. The 40 was read off a screenshot rather than
   * measured, and the ratio was then built on it.
   *
   * What is actually measurable: OpenAI's radius scale carries an 8px step (`--radius-md`)
   * between 6 and 10, their menu *panel* is 12px, and an item nested in that panel resolves
   * concentrically to 12 less its 6px gutter, which is 6. A sidebar row sits in no panel, so
   * nothing constrains it concentrically and the choice is free. 8 is one step rounder than
   * a control, which is the amount that stops a full-width plate reading as a filed-off
   * rectangle without turning it into a pill.
   */
  row: number;
  /**
   * The most of a box's height a radius may claim, as a fraction.
   *
   * A radius is an absolute length and the boxes it lands on are not: the same 12px reads
   * as a gentle round on a 48px control and as a pill on a 20px one, because the browser
   * clamps `border-radius` to half the shorter side. Measured across the ladder, presets
   * 10, 12 and pill all painted the same 10px on a compact extra-small control -- three
   * distinct choices, one result, and that result a pill.
   *
   * 0.4 keeps the smallest control visibly a rounded rectangle. The top preset is the
   * exception at 0.5, because a pill is the one case where reaching half the height is the
   * intent rather than an accident.
   *
   * This does not make every preset distinct on every box. Nothing can, short of scaling
   * radius with height, which this system deliberately does not do -- Primer, Vercel,
   * Linear and Notion all ship one flat radius. What it does is bound the failure: on a box
   * too small to tell 10 from 12, both render as the same rounded rectangle rather than as
   * the same pill.
   */
  cap: number;
  /**
   * Button-only upper bound. The Pill preset is intentionally full only on actions;
   * editable fields and navigation rows stay recognisably rectangular.
   */
  buttonCap: number;
}

function radiusTokens({ control, container, small, row, cap, buttonCap }: RadiusPreset) {
  return {
    "radius-control": `${control.md}px`,
    "radius-control-xs": `${control.xs}px`,
    "radius-control-sm": `${control.sm}px`,
    "radius-control-md": `${control.md}px`,
    "radius-control-lg": `${control.lg}px`,
    "radius-control-xl": `${control.xl}px`,
    "radius-container": `${container}px`,
    "radius-small": `${small}px`,
    "radius-row": `${row}px`,
    // Unitless, because the box it applies to is only known where it is used. Radius owns
    // both caps: UI scale owns box dimensions, never a shape decision.
    "radius-cap": String(cap),
    "radius-button-cap": String(buttonCap),
  };
}

/**
 * Public names describe visible character rather than duplicating component-size labels.
 * The 32px reference ladder is Sharp 0, Subtle 4, Soft 6, Standard 8, Round 10, Rotund 12,
 * and Pill. Standard is the default family.
 */
const PRESETS: ReadonlyArray<RadiusPreset & { id: string; note: string }> = [
  { id: "sharp", control: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 }, small: 0, row: 0, container: 0, cap: 0.4, buttonCap: 0.4, note: "Square corners throughout." },
  { id: "subtle", control: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }, small: 2, row: 4, container: 6, cap: 0.4, buttonCap: 0.4, note: "A restrained 4px medium-control family." },
  { id: "soft", control: { xs: 3, sm: 4, md: 6, lg: 8, xl: 10 }, small: 4, row: 6, container: 8, cap: 0.4, buttonCap: 0.4, note: "A soft 6px medium-control family." },
  { id: "standard", control: { xs: 4, sm: 6, md: 8, lg: 10, xl: 12 }, small: 6, row: 8, container: 12, cap: 0.4, buttonCap: 0.4, note: "Default: 6px small, 8px medium, and 10px large Buttons." },
  { id: "round", control: { xs: 5, sm: 8, md: 10, lg: 12, xl: 14 }, small: 8, row: 10, container: 14, cap: 0.4, buttonCap: 0.4, note: "A round 10px medium-control family." },
  { id: "rotund", control: { xs: 6, sm: 10, md: 12, lg: 14, xl: 16 }, small: 10, row: 12, container: 16, cap: 0.4, buttonCap: 0.4, note: "The roundest finite family: 12px at medium." },
  {
    id: "pill",
    control: { xs: 999, sm: 999, md: 999, lg: 999, xl: 999 },
    small: 9999,
    row: 9999,
    container: 24,
    cap: 0.4,
    buttonCap: 0.5,
    note: "Fully round buttons. Other controls and containers stay finite, since a pill field or card obscures its role.",
  },
];

export const RADIUS_AXIS: AxisDefinition = {
  id: "radius",
  label: "Radius",
  description: "How rounded controls and containers are, grouped by visual character.",
  defaultPreset: "standard",
  namespaces: [
    "--area-radius-control",
    "--area-radius-control-",
    "--area-radius-container",
    "--area-radius-small",
    "--area-radius-row",
    "--area-radius-cap",
    "--area-radius-button-cap",
  ],
  presets: PRESETS.map(({ id, note, ...preset }) => ({
    id,
    label: id.slice(0, 1).toUpperCase() + id.slice(1),
    description: note,
    tokens: tokens(radiusTokens(preset)),
  })),
};
