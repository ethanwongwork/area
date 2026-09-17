/**
 * The axis registry, and the invariant that makes the whole design hold together.
 *
 * Eight axes produce tens of thousands of combinations. The property that makes targeted
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
import { MOTION_AXIS } from "./motion.ts";
import { RADIUS_AXIS } from "./radius.ts";
import { SURFACE_AXIS } from "./surface.ts";
import { UI_SCALE_AXIS } from "./ui-scale.ts";

export const AXES: AxisDefinition[] = [
  THEME_AXIS,
  NEUTRAL_AXIS,
  ACCENT_AXIS,
  UI_SCALE_AXIS,
  RADIUS_AXIS,
  SURFACE_AXIS,
  MOTION_AXIS,
];

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
