/**
 * The colour axes: theme, neutral, and accent.
 *
 * Three separate axes rather than one, because their token namespaces are disjoint and
 * therefore compose. `--area-neutral-*` and everything derived from it belongs to the
 * neutral axis; `--area-accent-*` to the accent axis. Eleven accents and three neutral casts give
 * thirty-three selections, each retaining both light and dark polarity.
 *
 * The theme axis carries what neither of the others owns: every scale's primitive ramp,
 * the fixed semantic tones (danger, warning, success, info), and the shadow colour.
 */
import { type AxisDefinition, type AxisPreset, type TokenMap, tokens } from "./schema.ts";
import { CHROMATIC_SCALES, MUTED_SCALES, NEUTRAL_SCALES, SCALE_DESCRIPTIONS } from "../color/presets.ts";
import { type Theme } from "../color/scale.ts";
import { type ResolvedTheme, DEFAULT_SELECTION, resolveTheme } from "../semantic/resolve.ts";
import { SEMANTIC_ALIASES, type Alias } from "../semantic/aliases.ts";
import { LAYER_COLOR_TOKENS, castOf } from "../color/layers.ts";
import { scaleFor } from "../semantic/resolve.ts";

/** Semantic tokens whose alias points at a given role. */
function tokensForRole(theme: ResolvedTheme, role: string): Record<string, string> {
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
function primitiveRamp(theme: ResolvedTheme, scaleId: string, as = scaleId): Record<string, string> {
  const scale = theme.scales[scaleId]!;
  const out: Record<string, string> = {};
  for (const step of scale.steps) out[`${as}-${step.level}`] = step.hex;
  for (const alpha of scale.alphas) out[`${as}-a${alpha.level}`] = alpha.hex8;
  out[`${as}-contrast`] = scale.contrast.hex;
  return out;
}

function themeFor(t: Theme, accent: string, neutral: string): ResolvedTheme {
  return resolveTheme({ theme: t, accent, neutral });
}

// ---------------------------------------------------------------------------
// Theme axis
// ---------------------------------------------------------------------------

/**
 * Shadows are a colour, not a constant. `rgba(0,0,0,.06)` vanishes on a dark surface --
 * the most common elevation bug there is -- so the tone lives in a token the theme owns.
 */
const SHADOW_COLOR: Record<Theme, string> = {
  light: "rgb(0 0 0 / 0.06)",
  // spec (audit S21c, dark captures 2026-09-30): 20%, Notion's menu lift (ChatGPT's dialog 19%,
  // Figma 35%). 8% left every floating surface flat on a dark page.
  dark: "rgb(0 0 0 / 0.2)",
};

function themePreset(t: Theme): AxisPreset {
  const resolved = themeFor(t, DEFAULT_SELECTION.accent, DEFAULT_SELECTION.neutral);

  // Every family except the one the neutral axis aliases.
  //
  // The vendored palette names its achromatic cast `neutral`, and that is also the name of
  // the role the neutral axis owns -- Area overloads the two deliberately, so that
  // `neutral-500` means "the active cast" and nothing downstream has to know a tone exists.
  // Area cannot overload it: two axes writing one property is precisely what
  // `checkAxisIntegrity` forbids, because it makes the pair untestable. So the role wins
  // the namespace, the achromatic cast is reached through it, and `cool` and `warm` keep
  // their own primitive ramps for anything that needs to name a specific cast.
  const ramps: Record<string, string> = {};
  for (const spec of [...NEUTRAL_SCALES, ...CHROMATIC_SCALES, ...MUTED_SCALES]) {
    if (spec.id === NEUTRAL_ALIAS) continue;
    Object.assign(ramps, primitiveRamp(resolved, spec.id));
  }

  const fixedTones: Record<string, string> = {};
  // pink and gray are the tag tones (owner 2026-10-06; docs/specs/tag.md).
  for (const role of ["danger", "warning", "caution", "success", "info", "discovery", "pink", "gray", "brown"]) {
    Object.assign(fixedTones, tokensForRole(resolved, role));
  }

  return {
    id: t,
    label: t === "light" ? "Light" : "Dark",
    description:
      t === "light"
        ? "The default theme."
        : "Re-derived rather than inverted; solid fills hold their identity across both.",
    tokens: tokens({ ...ramps, ...fixedTones, "shadow-color": SHADOW_COLOR[t] }),
  };
}

/** The role namespace the neutral axis owns, and therefore the family the theme axis skips. */
const NEUTRAL_ALIAS = "neutral";

export const THEME_AXIS: AxisDefinition = {
  id: "theme",
  label: "Mode",
  description: "Light or dark.",
  defaultPreset: "light",
  namespaces: [
    ...[...NEUTRAL_SCALES, ...CHROMATIC_SCALES, ...MUTED_SCALES]
      .filter((s) => s.id !== NEUTRAL_ALIAS)
      .map((s) => `--area-${s.id}-`),
    "--area-danger-",
    "--area-warning-",
    "--area-caution-",
    "--area-success-",
    "--area-info-",
    "--area-discovery-",
    "--area-gray-",
    "--area-fg-danger",
    "--area-fg-warning",
    "--area-fg-caution",
    "--area-fg-success",
    "--area-fg-info",
    "--area-fg-discovery",
    "--area-fg-pink",
    "--area-fg-gray",
    "--area-fg-brown",
    "--area-fg-on-danger",
    "--area-fg-on-warning",
    "--area-fg-on-caution",
    "--area-fg-on-success",
    "--area-fg-on-info",
    "--area-fg-on-discovery",
    "--area-fg-on-pink",
    "--area-fg-on-brown",
    "--area-shadow-color",
  ],
  presets: [themePreset("light"), themePreset("dark")],
};

// ---------------------------------------------------------------------------
// Neutral axis
// ---------------------------------------------------------------------------

/** The neutral role's tokens the Layers model derives instead (color/layers.ts): page, layers, fills, edges, inks. */
const LAYER_OWNED = new Set<string>(LAYER_COLOR_TOKENS);
function neutralRoleTokens(resolved: ResolvedTheme): Record<string, string> {
  return Object.fromEntries(Object.entries(tokensForRole(resolved, "neutral")).filter(([name]) => !LAYER_OWNED.has(name)));
}

/** The cast the Layers model tints with: the hue and chroma of this neutral's own 50 (light) and 900 (dark). Numbers,
 * so both polarities carry the same four values and the emitter writes them once. */
function castTokens(neutral: string): Record<string, string> {
  const step = (theme: Theme, level: number) => scaleFor(neutral, theme).steps.find(s => s.level === level)!.hex;
  const cast = castOf(step("light", 50), step("dark", 900));
  return {
    "neutral-chroma-light": String(cast.light.chroma), "neutral-hue-light": String(cast.light.hue),
    "neutral-chroma-dark": String(cast.dark.chroma), "neutral-hue-dark": String(cast.dark.hue),
  };
}

function neutralTokens(t: Theme, neutral: string): TokenMap {
  const resolved = themeFor(t, DEFAULT_SELECTION.accent, neutral);
  return tokens({
    ...primitiveRamp(resolved, neutral, "neutral"),
    ...neutralRoleTokens(resolved),
    ...castTokens(neutral),
  });
}

export const NEUTRAL_AXIS: AxisDefinition = {
  id: "neutral",
  label: "Neutral",
  description: "The grey the whole interface is built from.",
  defaultPreset: DEFAULT_SELECTION.neutral,
  namespaces: [
    "--area-neutral-",
    ...Object.keys(neutralRoleTokens(themeFor("light", DEFAULT_SELECTION.accent, DEFAULT_SELECTION.neutral)))
      .map(name => `--area-${name}:`),
  ],
  presets: NEUTRAL_SCALES.map((spec) => ({
    id: spec.id,
    label: spec.id[0]!.toUpperCase() + spec.id.slice(1),
    description: SCALE_DESCRIPTIONS[spec.id]!,
    tokens: neutralTokens("light", spec.id),
    darkTokens: neutralTokens("dark", spec.id),
  })),
};

// ---------------------------------------------------------------------------
// Accent axis
// ---------------------------------------------------------------------------

function accentTokens(t: Theme, accent: string): TokenMap {
  const resolved = themeFor(t, accent, DEFAULT_SELECTION.neutral);
  return tokens({
    ...primitiveRamp(resolved, accent, "accent"),
    ...tokensForRole(resolved, "accent"),
  });
}

export const ACCENT_AXIS: AxisDefinition = {
  id: "accent",
  label: "Accent",
  description: "The accent hue. Drives fills, links, and the focus ring.",
  defaultPreset: DEFAULT_SELECTION.accent,
  namespaces: ["--area-accent-", "--area-fg-accent", "--area-fg-on-accent", "--area-focus-color:", "--area-stroke-selected:"],
  presets: CHROMATIC_SCALES.map((spec) => ({
    id: spec.id,
    label: spec.id[0]!.toUpperCase() + spec.id.slice(1),
    description: SCALE_DESCRIPTIONS[spec.id]!,
    tokens: accentTokens("light", spec.id),
    darkTokens: accentTokens("dark", spec.id),
  })),
};
