/**
 * Emphasis roles: which colour the two jobs that carry emphasis take.
 *
 * Area has one chosen colour (the accent axis) and neutral. Components never ask for the
 * accent themselves; they paint one of two roles, and a theme decides whether each role is
 * neutral or the accent (owner, 2026-09-29):
 *
 * - Action: what you press to commit, the solid Button and everything built on it.
 * - Selection: what shows state, checked, on, selected, current, and a filled value.
 *
 * Four combinations follow: both neutral, both accent, accent leading (actions in colour, controls calm) and neutral
 * leading (neutral actions, coloured state), the default since 2026-10-22 (owner, option B: Selection defaults to the
 * accent, and a selected container's edge follows Selection, so everything selected is one colour).
 *
 * Each axis writes one unitless switch, 0 or 1. The role colours themselves are cross-axis
 * derivations in `emit/base.ts` (a color-mix between the neutral and accent endpoints), so
 * a subtree that changes its accent, neutral or theme re-derives them, as contrast does.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

function roleAxis(id: "action" | "selection", label: string, description: string, neutral: string, accent: string, defaultPreset: "neutral" | "accent" = "neutral"): AxisDefinition {
  return {
    id,
    label,
    description,
    defaultPreset,
    namespaces: [`--area-${id}-accent:`],
    presets: [
      { id: "neutral", label: "Neutral", description: neutral, tokens: tokens({ [`${id}-accent`]: 0 }) },
      { id: "accent", label: "Accent", description: accent, tokens: tokens({ [`${id}-accent`]: 1 }) },
    ],
  };
}

export const ACTION_AXIS = roleAxis(
  "action",
  "Buttons",
  "The colour of what you press to commit: solid Buttons, Split button, send.",
  "Solid actions in the neutral ink.",
  "Solid actions in the accent.",
);

export const SELECTION_AXIS = roleAxis(
  "selection",
  "Selection",
  "The colour of state: checked, on, selected, current and filled values, selected edges and the focus ring.",
  "State, selected edges and focus in the neutral ink.",
  "State, selected edges and focus in the accent.",
  "accent",
);
