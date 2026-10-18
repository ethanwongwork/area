/**
 * The Canvas's Material setting (owner, 2026-10-17: materials as levers, testable in the app): a bundle (None, Glass,
 * Tactile, Jelly, Soft, Aero, Glow) and any lever, switch or stroke style moved away from it. The tokens own every
 * value (@area/tokens axes/material.ts); the app writes `data-area-material` and one `data-area-material-<id>` per
 * override on the Canvas, so the Canvas paints exactly what a product setting those attributes would.
 */
import { DEFAULT_MATERIAL, MATERIAL_BUNDLES, MATERIAL_LEVERS, MATERIAL_STROKE_STYLES, MATERIAL_SWITCHES } from "@area/tokens/config";

export interface MaterialState {
  bundle: string;
  /** Lever, switch and `stroke-style` values set over the bundle. */
  overrides: Readonly<Record<string, string>>;
}
export const MATERIAL_DEFAULT: MaterialState = { bundle: DEFAULT_MATERIAL, overrides: {} };

/** The value a lever, switch or the stroke styles take under the bundle alone. */
export function bundleValue(bundle: string, key: string): string {
  const b = MATERIAL_BUNDLES[bundle] ?? MATERIAL_BUNDLES[DEFAULT_MATERIAL]!;
  if (key === "stroke-style") return b.stroke.join(" ");
  const lever = MATERIAL_LEVERS.find(l => l.id === key);
  if (lever) return String(b.levers[key] ?? 0);
  const toggle = MATERIAL_SWITCHES.find(s => s.id === key);
  return b.switches[key] ?? toggle?.options[0]?.value ?? "";
}

export const materialValue = (state: MaterialState, key: string) => state.overrides[key] ?? bundleValue(state.bundle, key);

/** A saved Material, kept only where it still names a bundle and known values. */
export function restoreMaterial(saved: unknown): MaterialState {
  if (!saved || typeof saved !== "object") return MATERIAL_DEFAULT;
  const { bundle, overrides } = saved as Partial<MaterialState>;
  if (typeof bundle !== "string" || !(bundle in MATERIAL_BUNDLES)) return MATERIAL_DEFAULT;
  const kept: Record<string, string> = {};
  for (const [key, value] of Object.entries(overrides ?? {})) {
    if (typeof value !== "string") continue;
    const lever = MATERIAL_LEVERS.find(l => l.id === key);
    const toggle = MATERIAL_SWITCHES.find(s => s.id === key);
    const strokes = MATERIAL_STROKE_STYLES.map(s => s.id);
    if (lever ? lever.steps.map(String).includes(value)
      : toggle ? toggle.options.some(o => o.value === value)
      : key === "stroke-style" && value.split(" ").filter(Boolean).every(id => strokes.includes(id))) kept[key] = value;
  }
  return { bundle, overrides: kept };
}

/** The Canvas's attributes: none at all for None with nothing moved, so the Canvas is Area's default byte for byte. */
export function materialAttributes(state: MaterialState): Record<string, string> {
  const keys = Object.keys(state.overrides);
  if (state.bundle === DEFAULT_MATERIAL && !keys.length) return {};
  return {
    "data-area-material": state.bundle,
    ...Object.fromEntries(keys.map(key => [`data-area-material-${key}`, state.overrides[key]!])),
  };
}
