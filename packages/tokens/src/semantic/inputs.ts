/**
 * The colour inputs an axis writes from a resolved theme: the accent's (Accent axis) and the status tones' (Theme axis),
 * every colour at full strength under `-full` for emit/base.ts to derive the public tokens from. One module for the
 * axes (axes/color.ts) and for a brand (emit/brand.ts, 2026-10-26), so a brand writes exactly what a palette accent does;
 * it imports no axis, so the brand runtime does not compute every preset on load.
 */
import { type ResolvedTheme } from "./resolve.ts";
import { SEMANTIC_ALIASES, type Alias } from "./aliases.ts";
import { tintRoom } from "../color/layers.ts";
import { SOLID_STEPS } from "../color/generate.ts";
import { STATUS_TONES } from "../color/presets.ts";

/** Semantic tokens whose alias points at a given role. */
export function tokensForRole(theme: ResolvedTheme, role: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, alias] of Object.entries(SEMANTIC_ALIASES) as Array<[string, Alias]>) {
    // A literal belongs to the axis whose role it names (the neutral scrim); others are skipped.
    if (alias.role !== role) continue;
    // A vivid or tonal ink is written as its rung; the Layers model derives `fg-<role>-vivid` and `fg-<role>` from it, so
    // it follows the ground (color/layers.ts HUED_INKS).
    // A tonal stroke is written as its rung too; base.ts moves it with the Contrast level.
    out[alias.kind === "vivid" || alias.kind === "tonalForeground" || alias.kind === "stroke" || alias.kind === "strokeHover" ? `${name}-rung` : name] = theme.tokens[name]!;
  }
  return out;
}

/**
 * A scale's full primitive ramp: every level, its translucent twin, and the foreground the
 * scale measured against its own solid fill.
 *
 * Keyed by ordinal rung, not array position. A level identifies a palette step; it is not
 * a measured lightness and it does not change when theme polarity changes.
 */
export function primitiveRamp(theme: ResolvedTheme, scaleId: string, as = scaleId): Record<string, string> {
  // A family by id, or the accent role's own scale (a named family or a hue's generated one).
  const scale = theme.scales[scaleId] ?? theme.roles[scaleId as keyof ResolvedTheme["roles"]]!;
  const out: Record<string, string> = {};
  for (const step of scale.steps) out[`${as}-${step.level}`] = step.hex;
  for (const alpha of scale.alphas) out[`${as}-a${alpha.level}`] = alpha.hex8;
  out[`${as}-contrast`] = scale.contrast.hex;
  return out;
}

/** The accent's measured label (black or white), written as it is: Accent strength never quiets it. `fg-on-accent` is
 * derived from it with Label tint (axes/accent.ts), so the axis writes that one as `fg-on-accent-full`. */
export const ACCENT_LABEL_TOKENS: ReadonlySet<string> = new Set(["accent-contrast"]);

/**
 * The accent's tokens, as the axis writes them: every colour at its full strength under a `-full` name, which emit/base.ts
 * turns into the public token at the Accent strength (and, for the solid and its hover, at the Solid step); the label
 * (`fg-on-accent`, `accent-contrast`) as measured, since a label never quiets; the Solid steps' fills and hovers; and the
 * accent's hue, which Tint hue's Accent value reads. Short names (no `--area-`).
 */
export function accentInputs(resolved: ResolvedTheme): Record<string, string> {
  const own = { ...primitiveRamp(resolved, "accent"), ...tokensForRole(resolved, "accent") };
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(own)) out[ACCENT_LABEL_TOKENS.has(name) ? name : `${name}-full`] = value;
  const scale = resolved.roles.accent;
  const hexAt = (level: number) => scale.steps.find(step => step.level === level)!.hex;
  // Label tint's end on each solid: its tinted rung, or the label itself where none clears (scale.ts tintedLabel).
  const label = scale.contrast.hex, tinted = (level: number | null) => level === null ? label : hexAt(level);
  out["accent-label-full"] = tinted(scale.labelTint);
  for (const step of SOLID_STEPS) {
    out[`accent-solid-${step}-full`] = hexAt(scale.solidSteps[step].level);
    out[`accent-solid-hover-${step}-full`] = hexAt(scale.solidSteps[step].hover);
    out[`accent-label-${step}-full`] = scale.solidSteps[step].label === null ? scale.solidSteps[step].fg : hexAt(scale.solidSteps[step].label!);
    // The label the step carries, black or white (2026-10-25: it flips with the shade).
    out[`accent-on-${step}-full`] = scale.solidSteps[step].fg;
  }
  const hue = Number(scale.steps.find(step => step.level === 500)!.oklch.h.toFixed(2));
  out["accent-hue"] = String(hue);
  // Its room under sRGB (color/layers.ts tintRoom), for Tint hue's Accent value.
  out["accent-room-white"] = String(tintRoom(hue).white);
  out["accent-room-black"] = String(tintRoom(hue).black);
  return out;
}

/** The tones the Theme axis writes: the six status tones (at full strength, under `-full`) and the three tag tones. */
export const TONE_ROLES = ["danger", "warning", "caution", "success", "info", "discovery", "pink", "gray", "brown"] as const;

/**
 * A tone's tokens, as the Theme axis writes them: a status tone's colours at full strength (`-full`), which emit/base.ts
 * derives the public ones from with Status colours (axes/accent.ts); its label never quiets; tag tones stay as they are.
 * Short names.
 */
export function toneInputs(resolved: ResolvedTheme, roles: readonly string[] = TONE_ROLES): Record<string, string> {
  const out: Record<string, string> = {};
  for (const role of roles)
    for (const [name, value] of Object.entries(tokensForRole(resolved, role)))
      out[STATUS_TONES.includes(role) && !name.startsWith("fg-on-") ? `${name}-full` : name] = value;
  return out;
}
