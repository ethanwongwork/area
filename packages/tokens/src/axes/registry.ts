/**
 * The axis registry, and the invariant that makes the whole design hold together.
 *
 * Forty-four axes produce more combinations than any test could visit. The property that makes targeted
 * verification tractable
 * is proving the axes are *orthogonal*, which reduces the problem to checking each axis
 * once. Orthogonality is not a hope here -- `assertAxisIntegrity` fails the build if any
 * two axes ever write the same custom property.
 *
 * Where axes genuinely interact, the relationship is expressed once in `emit/base.ts` as a
 * calc() over both axes' tokens, never by one axis reaching into another's namespace.
 */
import type { AxisDefinition, TokenMap } from "./schema.ts";
import { ACCENT_AXIS, NEUTRAL_AXIS, THEME_AXIS } from "./color.ts";
import { ACTION_AXIS, SELECTION_AXIS } from "./emphasis.ts";
import { MOTION_AXIS } from "./motion.ts";
import { EASING_AXIS } from "./easing.ts";
import { FEEDBACK_AXIS } from "./feedback.ts";
import { RADIUS_AXIS } from "./radius.ts";
import { REST_SHADOW_AXIS, SURFACE_AXIS } from "./surface.ts";
import { ELEVATION_AXIS } from "./elevation.ts";
import { DEPTH_AXES } from "./depth.ts";
import { STROKE_GROUP_AXES } from "./stroke-groups.ts";
import { STATE_AXES } from "./states.ts";
import { DENSITY_AXIS } from "./density.ts";
import { TYPE_AXIS } from "./type-size.ts";
import { GROUND_DARK_AXIS, GROUND_LIGHT_AXIS, LAYERS_DARK_AXIS, LAYERS_LIGHT_AXIS } from "./layers.ts";
import { INK_TINT_AXIS, TINT_DARK_AXIS, TINT_HUE_AXIS, TINT_HUE_DARK_AXIS, TINT_LIGHT_AXIS } from "./tint.ts";
import { CARD_TONE_DARK_AXIS, CARD_TONE_LIGHT_AXIS } from "./card-tone.ts";
import { ACCENT_STRENGTH_AXIS, LABEL_TINT_AXIS, SOLID_DARK_AXIS, SOLID_LIGHT_AXIS, STATUS_COLOURS_AXIS } from "./accent.ts";
import { SERIES_AXIS } from "./series.ts";

export const AXES: AxisDefinition[] = [
  THEME_AXIS,
  NEUTRAL_AXIS,
  // The grays' hue and strength and the text's share of it (2026-10-22): Auto follows Neutral.
  TINT_HUE_AXIS,
  TINT_HUE_DARK_AXIS,
  TINT_LIGHT_AXIS,
  TINT_DARK_AXIS,
  INK_TINT_AXIS,
  ACCENT_AXIS,
  // Any accent colour (2026-10-23): how much of its colour it keeps, and the step solid fills sit on per mode.
  ACCENT_STRENGTH_AXIS,
  SOLID_LIGHT_AXIS,
  SOLID_DARK_AXIS,
  // The label on an accent solid: how much of the accent's hue it takes (2026-10-23).
  LABEL_TINT_AXIS,
  // The status tones: as the palette draws them, or quieted with the accent (2026-10-23).
  STATUS_COLOURS_AXIS,
  // The eight data colours (2026-11-01, the colour system study): how light their luminous colour is.
  SERIES_AXIS,
  ACTION_AXIS,
  SELECTION_AXIS,
  GROUND_LIGHT_AXIS,
  GROUND_DARK_AXIS,
  LAYERS_LIGHT_AXIS,
  LAYERS_DARK_AXIS,
  // Cards and asset cards against the page, per mode (2026-10-22): Auto keeps each container's own tone.
  CARD_TONE_LIGHT_AXIS,
  CARD_TONE_DARK_AXIS,
  TYPE_AXIS,
  DENSITY_AXIS,
  RADIUS_AXIS,
  SURFACE_AXIS,
  REST_SHADOW_AXIS,
  ELEVATION_AXIS,
  // Edge and Depth's other controls (2026-10-18): Stroke, Rest and Field shadow, Shadow size, Softness, Light, Shadow colour.
  ...DEPTH_AXES,
  // Stroke groups (2026-10-30): an edge amount for each of twelve groups of components, under Edge contrast.
  ...STROKE_GROUP_AXES,
  // Interaction states (2026-10-21): the focus ring, and the stroke, shadow and fill scales for hover, selected and pressed.
  ...STATE_AXES,
  MOTION_AXIS,
  EASING_AXIS,
  // How a control answers the pointer (2026-10-24): hover and press arrival, and the give under a press.
  FEEDBACK_AXIS,
];

/**
 * The settings as people meet them (owner, 2026-10-19: "i want the axises to be the source of truth"): every axis, plus
 * the two scoped settings outside the registry (Contrast, Pills), under the headings the Inspector and the Theme tab
 * both show, in their order. A setting's name is its axis label; under its heading the heading's word is dropped
 * (`settingLabel`): Stroke width reads Width under Stroke, Shadow size Size under Shadow.
 */
export const SETTING_GROUPS: ReadonlyArray<{ heading: string; settings: readonly string[] }> = [
  // In palette order (owner, 2026-10-24, the axis review): the page and its greys, the accent, then where the accent
  // paints; the interaction states under one heading, so one state's settings sit together.
  { heading: "Page", settings: ["theme", "ground-light", "ground-dark", "neutral", "tint-hue", "tint-hue-dark", "tint-light", "tint-dark", "ink-tint", "layers-light", "layers-dark", "card-tone-light", "card-tone-dark"] },
  // The colour, then how deep and how saturated it is (owner, 2026-10-25), then its label.
  { heading: "Accent", settings: ["accent", "solid-light", "solid-dark", "accent-strength", "label-tint"] },
  // Emphasis (owner 2026-10-27: "avoid long phrases like where it paints"; was "Where it paints"): how strongly things
  // stand out, the accent on buttons and selection, the status tones, and contrast.
  { heading: "Emphasis", settings: ["action", "selection", "status-colours", "series-lightness", "contrast"] },
  { heading: "Size", settings: ["type", "density"] },
  { heading: "Shape", settings: ["radius", "pills"] },
  // Width and the master Edge contrast, then each group's amount (owner, 2026-10-30, the stroke review).
  { heading: "Stroke", settings: ["surface", "stroke", "stroke-cards", "stroke-blocks", "stroke-callouts", "stroke-floating", "stroke-regions", "stroke-dividers", "stroke-fields", "stroke-buttons", "stroke-options", "stroke-tracks", "stroke-tags", "stroke-media"] },
  { heading: "Shadow", settings: ["elevation", "shadow-resting", "shadow-field", "shadow-rest", "shadow-size", "shadow-softness", "shadow-light", "shadow-color"] },
  { heading: "States", settings: ["fill-hover", "stroke-hover", "shadow-hover", "fill-selected", "selected-stroke", "selected-tint", "fill-pressed", "focus-ring", "danger-hover"] },
  { heading: "Effects", settings: ["motion", "easing", "feedback"] },
];

/** The scoped settings that are not axes: `data-area-contrast` (styles, docs/CONTRAST.md) and `data-area-pills` (pills.ts). */
export const SCOPED_SETTINGS: ReadonlyArray<{ id: string; label: string; description: string }> = [
  { id: "contrast", label: "Contrast", description: "How strong edges, focus and state are: System follows the OS; 0 (Standard) to 8 (More) strengthen them, 8 to 3:1." },
  { id: "pills", label: "Pills", description: "Which components draw a pill instead of the Radius corner." },
];

/** A setting's name under its heading: the heading's word dropped ("Stroke width" under Stroke reads "Width"). */
export function settingLabel(label: string, heading: string): string {
  const short = label.replace(new RegExp(`\\b${heading}\\b`, "i"), "").replace(/\s+/g, " ").trim();
  return short ? short[0]!.toUpperCase() + short.slice(1) : label;
}

/** `data-area-<id>` for each axis. */
export function attributeFor(axis: AxisDefinition): string {
  return `data-area-${axis.id}`;
}

export function axisById(id: string): AxisDefinition {
  const axis = AXES.find((a) => a.id === id);
  if (!axis) throw new Error(`Unknown axis "${id}". Known: ${AXES.map((a) => a.id).join(", ")}`);
  return axis;
}

export function defaultPresetOf(axis: AxisDefinition) {
  const preset = axis.presets.find((p) => p.id === axis.defaultPreset);
  if (!preset) {
    throw new Error(`Axis "${axis.id}" names "${axis.defaultPreset}" as default, but has no such preset.`);
  }
  return preset;
}

export interface IntegrityProblem {
  kind: "collision" | "namespace" | "inconsistent-preset" | "missing-default" | "invalid-value";
  message: string;
}

/**
 * Every check that has to hold for the axis model to be sound. Returns problems rather
 * than throwing so the build can report all of them at once.
 */
export function checkAxisIntegrity(axes: AxisDefinition[] = AXES): IntegrityProblem[] {
  const problems: IntegrityProblem[] = [];
  const owner = new Map<string, string>();

  for (const axis of axes) {
    if (!axis.presets.some((p) => p.id === axis.defaultPreset)) {
      problems.push({
        kind: "missing-default",
        message: `Axis "${axis.id}" names "${axis.defaultPreset}" as its default, but has no such preset.`,
      });
    }

    // Every preset in an axis must set exactly the same keys. A preset that omits a token
    // silently inherits it from whichever preset came before, which is the subtlest
    // possible bug: the axis appears to work until someone selects presets in a new order.
    const reference = new Set(Object.keys(axis.presets[0]?.tokens ?? {}));
    for (const preset of axis.presets) {
      const keys = new Set(Object.keys(preset.tokens));
      const missing = [...reference].filter((k) => !keys.has(k));
      const extra = [...keys].filter((k) => !reference.has(k));
      if (missing.length || extra.length) {
        problems.push({
          kind: "inconsistent-preset",
          message:
            `Axis "${axis.id}" preset "${preset.id}" does not set the same tokens as "${axis.presets[0]!.id}".` +
            (missing.length ? `\n  missing: ${missing.slice(0, 6).join(", ")}${missing.length > 6 ? ` (+${missing.length - 6})` : ""}` : "") +
            (extra.length ? `\n  extra:   ${extra.slice(0, 6).join(", ")}${extra.length > 6 ? ` (+${extra.length - 6})` : ""}` : ""),
        });
      }

      for (const [polarity, map] of [["light", preset.tokens], ["dark", preset.darkTokens]] as const) {
        if (!map) continue;
        problems.push(...checkEmittedTokens(axis, map, `${preset.id}/${polarity}`, keys));
        for (const key of Object.keys(map)) {
          const previous = owner.get(key);
          if (previous !== undefined && previous !== axis.id) {
            problems.push({ kind: "collision", message: `"${key}" is written by both "${previous}" and "${axis.id}".` });
          }
          owner.set(key, axis.id);
        }
      }
    }
  }

  for (let i = 0; i < axes.length; i++) for (let j = i + 1; j < axes.length; j++) {
    const a = axes[i]!, b = axes[j]!;
    for (const x of a.namespaces) for (const y of b.namespaces) {
      const xName = x.replace(/:$/, ""), yName = y.replace(/:$/, "");
      const overlap = x.endsWith(":") && y.endsWith(":") ? xName === yName
        : x.endsWith(":") ? xName.startsWith(yName)
        : y.endsWith(":") ? yName.startsWith(xName)
        : xName.startsWith(yName) || yName.startsWith(xName);
      if (overlap) problems.push({kind:"namespace",message:`Axes "${a.id}" and "${b.id}" claim overlapping namespaces "${x}" and "${y}".`});
    }
  }
  return problems;
}

/** A trailing colon denotes an exact property; all other namespaces are prefixes. */
function owns(axis: AxisDefinition, key: string): boolean {
  return axis.namespaces.some(ns => ns.endsWith(":") ? key === ns.slice(0, -1) : key.startsWith(ns));
}

export function checkEmittedTokens(
  axis: AxisDefinition,
  map: TokenMap,
  label = "emitted",
  reference = new Set(Object.keys(axis.presets[0]?.tokens ?? {})),
): IntegrityProblem[] {
  const problems: IntegrityProblem[] = [];
  const keys = Object.keys(map);
  const missing = [...reference].filter(key => !(key in map));
  const extra = keys.filter(key => !reference.has(key));
  if (missing.length || extra.length) problems.push({
    kind: "inconsistent-preset",
    message: `${axis.id}/${label}: missing [${missing.join(", ")}]; extra [${extra.join(", ")}].`,
  });
  for (const [key, value] of Object.entries(map)) {
    if (typeof value !== "string" || !value.trim() || /\b(?:undefined|NaN|Infinity)\b/.test(value)) {
      problems.push({ kind: "invalid-value", message: `${axis.id}/${label}: invalid "${key}: ${value}".` });
    }
    if (!owns(axis, key)) problems.push({ kind: "namespace", message: `${axis.id}/${label}: "${key}" falls outside its declared namespaces.` });
  }
  return problems;
}

/** Validate transformed output too, so emitter-specific branches cannot bypass ownership. */
export function assertEmittedTokens(axis: AxisDefinition, map: TokenMap): void {
  const problems = checkEmittedTokens(axis, map);
  if (problems.length) throw new Error(problems.map(p => `[${p.kind}] ${p.message}`).join("\n"));
}

/** Throws with every problem listed. Called at the top of the build. */
export function assertAxisIntegrity(axes: AxisDefinition[] = AXES): void {
  const problems = checkAxisIntegrity(axes);
  if (problems.length === 0) return;
  throw new Error(
    `Axis integrity check failed with ${problems.length} problem(s):\n\n` +
      problems.map((p) => `  [${p.kind}] ${p.message}`).join("\n\n"),
  );
}
