/**
 * Stroke groups (owner, 2026-10-30: "add even more granularity to the groups of strokes … similar to how you can choose
 * multiple different components for what to be constant pill shapes … find groups of components to apply strokes and
 * amounts of edge contrast to"; picks on the review page https://claude.ai/artifact/EMR6Enr65EhJVq17SZonSx).
 *
 * Twelve groups, by what a stroke does for the component, each with an amount from 0 (none) to 8 in half steps. One
 * ladder for every group: a step is 2.5% of the text colour over whatever is under the stroke (4 is 10%, 8 is 20%),
 * mixed in sRGB as Cursor and Claude mix theirs (docs/research/control-edges-2026-10-27, "Groups by role"). Being
 * translucent, a stroke keeps its distance from any ground it sits on, light or dark. Edge contrast (`stroke`, depth.ts)
 * is the master over the groups: its 4 leaves each group's amount as set, 0 removes every group stroke and 8 doubles them.
 * Contrast More takes each one the rest of the way to the 3:1 control stroke, as it does every edge. One amount serves
 * light and dark; one width (Stroke width, surface.ts) serves the frames. Defaults are the owner's picks (Defined).
 *
 * Fixed, in no group: outline Buttons, Badges and Chip (the edge is the shape), solid fills, ghost and toolbar buttons,
 * list and menu rows, unchecked Checkbox and Radio boxes, outline fields, focus rings, selected edges, field state edges.
 */
import { type AxisDefinition, PREFIX, tokens } from "./schema.ts";

const v = (name: string) => `var(${PREFIX}${name})`;

export interface StrokeGroup {
  id: string;
  /** The setting's name under the Stroke heading. */
  label: string;
  /** What its stroke does, and its members, as the Inspector's hint says it. */
  hint: string;
  /** The owner's pick (2026-10-30, the Defined preset). */
  amount: number;
}

export const STROKE_GROUPS: readonly StrokeGroup[] = [
  { id: "cards", label: "Cards", hint: "The frame round cards, asset cards, file tiles, attachments, board cards and surfaces", amount: 4 },
  { id: "blocks", label: "Blocks", hint: "The frame round code blocks, tables and preview frames in a page", amount: 5 },
  { id: "callouts", label: "Callouts", hint: "The frame round an alert or notice in the flow", amount: 4 },
  { id: "floating", label: "Floating", hint: "The rim of menus, popovers, hover cards, toasts, dialogs, drawers and pickers", amount: 5 },
  { id: "regions", label: "Regions", hint: "The seams between panels and the app's regions", amount: 3 },
  { id: "dividers", label: "Dividers", hint: "The rules between rows and sections: separators, table, list and accordion rows", amount: 3 },
  { id: "fields", label: "Fields", hint: "The edge of soft fields: inputs, selects, number fields, text areas, pickers", amount: 5 },
  { id: "buttons", label: "Buttons", hint: "The edge of soft buttons, button groups, toggle groups and the Segmented track", amount: 3 },
  { id: "options", label: "Options", hint: "The edge of soft choice rows and choice cards", amount: 4 },
  { id: "tracks", label: "Tracks", hint: "The edge of slider, switch, progress and meter troughs", amount: 3 },
  { id: "tags", label: "Tags", hint: "The edge of soft badges, counts, tags and keys", amount: 3 },
  { id: "media", label: "Media", hint: "A hairline round avatars, swatches and pictures", amount: 2 },
];

/** A step of the ladder, as a share of the text colour (2.5% each). */
export const STROKE_GROUP_STEP = 2.5;

const steps = Array.from({ length: 17 }, (_, i) => i / 2);

/** One axis per group: `data-area-stroke-<id>`, its step `--area-stroke-<id>-step`. */
export const STROKE_GROUP_AXES: readonly AxisDefinition[] = STROKE_GROUPS.map(group => ({
  id: `stroke-${group.id}`,
  label: `${group.label} stroke`,
  description: `${group.hint}, 0 (none) to 8 in half steps: each step 2.5% of the text color`,
  defaultPreset: String(group.amount),
  namespaces: [`${PREFIX}stroke-${group.id}-step:`],
  presets: steps.map(n => ({
    id: String(n),
    label: n === 0 ? "0 (None)" : String(n),
    description: group.hint,
    tokens: tokens({ [`stroke-${group.id}-step`]: n }),
  })),
}));

/**
 * Each group's stroke, `--area-edge-<id>`: the text colour at its amount × Edge contrast over what is under it, then the
 * Contrast level's share of the way to the 3:1 control stroke. Derived (emit/base.ts), never registered.
 */
export function strokeGroupDerived(): Record<string, string> {
  return Object.fromEntries(STROKE_GROUPS.map(group => {
    const share = `calc(${v(`stroke-${group.id}-step`)} * ${STROKE_GROUP_STEP}% * ${v("stroke-strength")})`;
    const edge = `color-mix(in srgb, ${v("fg-default")} ${share}, transparent)`;
    return [`${PREFIX}edge-${group.id}`, `color-mix(in srgb, ${edge}, ${v("stroke-control")} calc(${v("contrast-more")} * 100%))`];
  }));
}
