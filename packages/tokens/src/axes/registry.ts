/**
 * The axis registry, and the invariant that makes the whole design hold together.
 *
 * Seven axes with three to twelve presets each is on the order of ten thousand
 * combinations. Verifying that many is impossible; the only thing that makes it tractable
 * is proving the axes are *orthogonal*, which reduces the problem to checking each axis
 * once. Orthogonality is not a hope here -- `assertAxisIntegrity` fails the build if any
 * two axes ever write the same custom property.
 *
 * Where axes genuinely interact, the relationship is expressed once in `derived.ts` as a
 * calc() over both axes' tokens, never by one axis reaching into another's namespace.
 */
import type { AxisDefinition } from "./schema.ts";
import { BRAND_AXIS, NEUTRAL_AXIS, THEME_AXIS } from "./color.ts";
import { DENSITY_AXIS } from "./density.ts";
import { MOTION_AXIS } from "./motion.ts";
import { RADIUS_AXIS } from "./radius.ts";
import { SURFACE_AXIS } from "./surface.ts";
import { TYPOGRAPHY_AXIS } from "./typography.ts";

export const AXES: AxisDefinition[] = [
  THEME_AXIS,
  NEUTRAL_AXIS,
  BRAND_AXIS,
  TYPOGRAPHY_AXIS,
  DENSITY_AXIS,
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

      if (preset.darkTokens) {
        const darkKeys = new Set(Object.keys(preset.darkTokens));
        const mismatched = [...keys].filter((k) => !darkKeys.has(k));
        if (mismatched.length) {
          problems.push({
            kind: "inconsistent-preset",
            message: `Axis "${axis.id}" preset "${preset.id}" sets tokens in light that its dark variant omits: ${mismatched.slice(0, 6).join(", ")}`,
          });
        }
      }

      // Key parity does not imply valid values. A token whose value contains `undefined`
      // or `NaN` still has the right name, so every structural check passes while the
      // stylesheet ships something the browser silently drops. Caught exactly that once.
      for (const [key, value] of Object.entries(preset.tokens)) {
        if (/undefined|NaN/.test(value)) {
          problems.push({
            kind: "invalid-value",
            message: `Axis "${axis.id}" preset "${preset.id}" emits "${key}: ${value}".`,
          });
        }
      }

      for (const key of keys) {
        // Ownership: no two axes may write the same property.
        const previous = owner.get(key);
        if (previous !== undefined && previous !== axis.id) {
          problems.push({
            kind: "collision",
            message:
              `"${key}" is written by both the "${previous}" and "${axis.id}" axes. ` +
              `Axes must own disjoint namespaces -- express the relationship with calc() in derived.ts instead.`,
          });
        }
        owner.set(key, axis.id);

        // Namespace: a token must live under a prefix its axis declared.
        if (!axis.namespaces.some((ns) => key.startsWith(ns.replace(/:$/, "")))) {
          problems.push({
            kind: "namespace",
            message: `"${key}" is emitted by the "${axis.id}" axis but falls outside its declared namespaces.`,
          });
        }
      }
    }
  }

  return problems;
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
