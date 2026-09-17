/**
 * Radius.
 *
 * Flat per preset, and the same at every control tier.
 *
 * An earlier version derived this as a proportion of control height, so that radius
 * scaled with the box. The evidence does not support it: Primer at 32px, Vercel at 32px,
 * Linear at 32px and Notion at 28px all ship exactly 6px. Nobody moves control radius
 * when density changes, and deriving it meant a compact button quietly became 5px.
 *
 * Keeping it absolute also restores the axis boundary properly -- radius is now owned
 * entirely by this axis, with no slice of it living in density.
 *
 * Containers sit at 12px, the single most agreed-upon number in the survey: Primer
 * overlays, OpenAI's popover, dialog and alert, and Linear's cards all use it.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

type ControlRadii = { xs: number; sm: number; md: number; lg: number; xl: number };

interface RadiusPreset {
  /** Control radii on the default UI ladder. Compact applies its own safe cap. */
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
}

function radiusTokens({ control, container, small, row, cap }: RadiusPreset) {
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
    // Unitless, because the box it applies to is only known where it is used. This is the
    // same shape as the density/radius interaction: the dependent axis emits a multiplier
    // and the relationship is written in calc() at the point of use.
    "radius-cap": `var(--area-ui-radius-cap, ${cap})`,
  };
}

/**
 * The presets, named by the one number a reader already has in their head: the radius of a
 * button.
 *
 * `sharp` / `subtle` / `default` / `rounded` / `soft` was a ladder that needed a lookup
 * table to read, and which of `subtle` and `default` was rounder was a thing you had to
 * remember rather than something the name told you. Every other primitive ramp in Area is
 * named by its value -- `space-16` is 16px, `wght-400` is weight 400 -- and a radius preset
 * is no different: `data-area-radius="8"` says what it does.
 *
 * The steps are 2px apart, which is the smallest difference that reads on a 32px control,
 * and the low end is denser than it was: 0, 2 and 4 are three distinguishable near-square
 * treatments where `sharp` and `subtle` were two.
 *
 * Within a preset every semantic radius takes a distinct value, so nothing collapses into
 * anything else. The single exception is 0, where square is square and uniqueness is not
 * available -- which is the point of that preset rather than a gap in it.
 */
const PRESETS: ReadonlyArray<RadiusPreset & { id: string; note: string }> = [
  { id: "sharp", control: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 }, small: 0, row: 0, container: 0, cap: 0.4, note: "Square corners throughout." },
  { id: "xs", control: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }, small: 0, row: 2, container: 4, cap: 0.4, note: "A near-square treatment." },
  { id: "sm", control: { xs: 2, sm: 4, md: 4, lg: 6, xl: 6 }, small: 2, row: 6, container: 8, cap: 0.4, note: "Restrained rounding that grows with the control." },
  { id: "md", control: { xs: 2, sm: 4, md: 6, lg: 6, xl: 8 }, small: 4, row: 8, container: 12, cap: 0.4, note: "Default: a 6px medium control with a measured container step." },
  { id: "lg", control: { xs: 4, sm: 6, md: 8, lg: 10, xl: 10 }, small: 6, row: 10, container: 14, cap: 0.4, note: "Soft controls without turning small shapes into pills." },
  { id: "xl", control: { xs: 4, sm: 8, md: 10, lg: 12, xl: 14 }, small: 8, row: 12, container: 16, cap: 0.4, note: "The roundest finite family: 10px at medium and 12px at large." },
  {
    id: "pill",
    control: { xs: 9999, sm: 9999, md: 9999, lg: 9999, xl: 9999 },
    small: 9999,
    row: 9999,
    container: 24,
    cap: 0.5,
    note: "Fully round controls. Containers stay finite, since a pill card is a lozenge.",
  },
];

export const RADIUS_AXIS: AxisDefinition = {
  id: "radius",
  label: "Radius",
  description: "How rounded controls and containers are, named by the button's own radius.",
  defaultPreset: "md",
  namespaces: [
    "--area-radius-control",
    "--area-radius-control-",
    "--area-radius-container",
    "--area-radius-small",
    "--area-radius-row",
    "--area-radius-cap",
  ],
  presets: PRESETS.map(({ id, note, ...preset }) => ({
    id,
    label: id === "pill" ? "Pill" : id === "sharp" ? "Sharp" : id.toUpperCase(),
    description: note,
    tokens: tokens(radiusTokens(preset)),
  })),
};
