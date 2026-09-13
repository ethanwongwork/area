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

interface RadiusPreset {
  /** Control radius, in pixels. Flat across every tier. */
  control: number;
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
}

function radiusTokens({ control, container, small, row }: RadiusPreset) {
  return {
    "radius-control": `${control}px`,
    "radius-container": `${container}px`,
    "radius-small": `${small}px`,
    "radius-row": `${row}px`,
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
  { id: "0", control: 0, small: 0, row: 0, container: 0, note: "Square corners throughout." },
  { id: "2", control: 2, small: 0, row: 4, container: 6, note: "Barely softened." },
  { id: "4", control: 4, small: 2, row: 6, container: 10, note: "Restrained. Close to Material 3." },
  {
    id: "6",
    control: 6,
    small: 4,
    row: 8,
    container: 12,
    note: "Matches Primer, Vercel, Linear and Notion, which all ship a 6px control.",
  },
  {
    id: "8",
    control: 8,
    small: 6,
    row: 10,
    container: 14,
    note: "The default. Matches shadcn/ui.",
  },
  { id: "10", control: 10, small: 8, row: 12, container: 16, note: "Soft." },
  { id: "12", control: 12, small: 10, row: 14, container: 20, note: "Very soft." },
  {
    id: "pill",
    control: 9999,
    small: 9999,
    row: 9999,
    container: 24,
    note: "Fully round controls. Containers stay finite, since a pill card is a lozenge.",
  },
];

export const RADIUS_AXIS: AxisDefinition = {
  id: "radius",
  label: "Radius",
  description: "How rounded controls and containers are, named by the button's own radius.",
  defaultPreset: "8",
  namespaces: [
    "--area-radius-control",
    "--area-radius-container",
    "--area-radius-small",
    "--area-radius-row",
  ],
  presets: PRESETS.map(({ id, note, ...preset }) => ({
    id,
    label: id === "pill" ? "Pill" : `${id}px`,
    description: note,
    tokens: tokens(radiusTokens(preset)),
  })),
};
