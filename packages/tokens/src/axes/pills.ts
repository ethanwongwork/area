/**
 * Pill shapes: which components draw a pill instead of the radius setting's corner (owner,
 * 2026-10-04: "if i want badges to follow corner radius but switch to stay pill").
 *
 * Not an axis (an axis picks one preset; this is a set). Selected with a space-separated list on
 * any element, inherited like an axis: `<html data-area-pills="chip count switch avatar">`. With
 * no attribute the defaults apply: Badge, Count, Chip, Switch, Avatar and the Composer's buttons are pills, everything else
 * follows the radius setting. Count and Badge share one shape (owner, 2026-11-07, "Yes, build it" on the Count beside
 * Badge page, after "maybe they should all be pills then?"): a count beside a status read as two families when Count
 * alone left the list on 2026-11-01. Nearly every design system surveyed draws its count as a pill and gives a count and
 * a status on one line one shape (docs/research/count-badge-2026-11-07). Each component reads its own flag, `--area-pill-<id>` (0 or
 * 1), and adds `flag x radius-full` to its corner, so the shapes concentric with it follow too
 * (an Input's action button, a Switch's thumb, Segmented items). A component's own `pill` prop,
 * where it has one, overrides the flag for that instance.
 */
export interface PillShape {
  id: string;
  label: string;
  /** What the flag reaches. */
  covers: string;
  /** A pill when no `data-area-pills` is set. */
  pill: boolean;
}

export const PILL_SHAPES: readonly PillShape[] = [
  { id: "button", label: "Button", covers: "Button, Split button, Button group, icon buttons", pill: false },
  { id: "field", label: "Fields", covers: "Input, Select, Combobox, Number field, Input group, Color field (and the buttons inside them)", pill: false },
  // Composer (owner, 2026-11-02: "the composer should have round buttons/pill buttons ... as part of the rounded/pill
  // theme selection, and it should be rounded by default for area (like cursor)"): its buttons and pickers, attach,
  // modes, model, mic and send (the measured references' 24 pills and round send). Its shell keeps its
  // own corner (a pill only with a round send at one line).
  { id: "composer", label: "Composer", covers: "Composer's buttons and pickers: attach, modes, model, mic, send", pill: true },
  { id: "segmented", label: "Segmented", covers: "the Segmented track and its items", pill: false },
  { id: "chip", label: "Chip", covers: "Chip, its swatch and remove button", pill: true },
  { id: "badge", label: "Badge", covers: "Badge, Badge group", pill: true },
  { id: "count", label: "Count", covers: "Count", pill: true },
  { id: "switch", label: "Switch", covers: "Switch track and thumb", pill: true },
  { id: "avatar", label: "Avatar", covers: "Avatar (a rounded square when not a pill)", pill: true },
];

export const DEFAULT_PILLS: readonly string[] = PILL_SHAPES.filter(shape => shape.pill).map(shape => shape.id);

/** The flags with no attribute: `--area-pill-<id>: 0 | 1`. */
export function pillDefaults(): Record<string, string> {
  return Object.fromEntries(PILL_SHAPES.map(shape => [`--area-pill-${shape.id}`, shape.pill ? "1" : "0"]));
}
