/**
 * The colour axes: theme, neutral, and brand.
 *
 * Three separate axes rather than one, because their token namespaces are disjoint and
 * therefore compose. `--area-neutral-*` and everything derived from it belongs to the
 * neutral axis; `--area-brand-*` to the brand axis. Twelve accents times six neutrals is
 * seventy-two looks from eighteen CSS blocks rather than seventy-two.
 *
 * The theme axis carries what neither of the others owns: every scale's primitive ramp,
 * the fixed semantic tones (danger, warning, success, info), and the shadow colour.
 */
import { type AxisDefinition, type AxisPreset, type TokenMap, tokens } from "./schema.ts";
import { CHROMATIC_SCALES, NEUTRAL_SCALES, SCALE_DESCRIPTIONS } from "../color/presets.ts";
import { type Theme } from "../color/scale.ts";
import { type ResolvedTheme, DEFAULT_SELECTION, resolveTheme } from "../semantic/resolve.ts";
import { SEMANTIC_ALIASES, type Alias } from "../semantic/aliases.ts";

/** Semantic tokens whose alias points at a given role. */
function tokensForRole(theme: ResolvedTheme, role: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, alias] of Object.entries(SEMANTIC_ALIASES) as Array<[string, Alias]>) {
    if (alias.kind === "literal" || alias.role !== role) continue;
    out[name] = theme.tokens[name]!;
  }
  return out;
}

/**
 * A scale's full primitive ramp: every level, its translucent twin, and the foreground the
 * scale measured against its own solid fill.
 *
 * Keyed by level, not by position. `--area-blue-55` names the lightness it carries, so a
 * change to the ladder renames the tokens it affects instead of silently repointing them.
 */
function primitiveRamp(theme: ResolvedTheme, scaleId: string, as = scaleId): Record<string, string> {
  const scale = theme.scales[scaleId]!;
  const out: Record<string, string> = {};
  for (const step of scale.steps) out[`${as}-${step.level}`] = step.hex;
  for (const alpha of scale.alphas) out[`${as}-a${alpha.level}`] = alpha.hex8;
  out[`${as}-contrast`] = scale.contrast.hex;
  return out;
}

function themeFor(t: Theme, brand: string, neutral: string): ResolvedTheme {
  return resolveTheme({ theme: t, brand, neutral });
}

// ---------------------------------------------------------------------------
// Theme axis
// ---------------------------------------------------------------------------

/**
 * Shadows are a colour, not a constant. `rgba(0,0,0,.06)` vanishes on a dark surface --
 * the most common elevation bug there is -- so the tone lives in a token the theme owns.
 */
const SHADOW_COLOR: Record<Theme, string> = {
  light: "rgb(0 0 0 / 0.10)",
  dark: "rgb(0 0 0 / 0.45)",
};

function themePreset(t: Theme): AxisPreset {
  const resolved = themeFor(t, DEFAULT_SELECTION.brand, DEFAULT_SELECTION.neutral);

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
  for (const spec of [...NEUTRAL_SCALES, ...CHROMATIC_SCALES]) {
    if (spec.id === NEUTRAL_ALIAS) continue;
    Object.assign(ramps, primitiveRamp(resolved, spec.id));
  }

  const fixedTones: Record<string, string> = {};
  for (const role of ["danger", "warning", "caution", "success", "info", "discovery"]) {
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
  label: "Theme",
  description: "Light or dark.",
  defaultPreset: "light",
  namespaces: [
    ...[...NEUTRAL_SCALES, ...CHROMATIC_SCALES]
      .filter((s) => s.id !== NEUTRAL_ALIAS)
      .map((s) => `--area-${s.id}-`),
    "--area-danger-",
    "--area-warning-",
    "--area-caution-",
    "--area-success-",
    "--area-info-",
    "--area-discovery-",
    "--area-fg-danger",
    "--area-fg-warning",
    "--area-fg-caution",
    "--area-fg-success",
    "--area-fg-info",
    "--area-fg-discovery",
    "--area-fg-on-danger",
    "--area-fg-on-warning",
    "--area-fg-on-caution",
    "--area-fg-on-success",
    "--area-fg-on-info",
    "--area-fg-on-discovery",
    "--area-shadow-color",
  ],
  presets: [themePreset("light"), themePreset("dark")],
};

// ---------------------------------------------------------------------------
// Neutral axis
// ---------------------------------------------------------------------------

function neutralTokens(t: Theme, neutral: string): TokenMap {
  const resolved = themeFor(t, DEFAULT_SELECTION.brand, neutral);
  return tokens({
    ...primitiveRamp(resolved, neutral, "neutral"),
    ...tokensForRole(resolved, "neutral"),
  });
}

export const NEUTRAL_AXIS: AxisDefinition = {
  id: "neutral",
  label: "Neutral",
  description: "The grey the whole interface is built from.",
  defaultPreset: DEFAULT_SELECTION.neutral,
  namespaces: [
    "--area-neutral-",
    "--area-bg-",
    "--area-fg-default",
    "--area-fg-muted",
    "--area-fg-placeholder",
    "--area-fg-disabled",
    "--area-fg-on-inverse",
    "--area-fg-on-primary",
    "--area-border-subtle",
    "--area-border-hover",
    "--area-border:",
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
// Brand axis
// ---------------------------------------------------------------------------

function brandTokens(t: Theme, brand: string): TokenMap {
  const resolved = themeFor(t, brand, DEFAULT_SELECTION.neutral);
  return tokens({
    ...primitiveRamp(resolved, brand, "brand"),
    ...tokensForRole(resolved, "brand"),
  });
}

export const BRAND_AXIS: AxisDefinition = {
  id: "brand",
  label: "Accent",
  description: "The brand hue. Drives fills, links, and the focus ring.",
  defaultPreset: DEFAULT_SELECTION.brand,
  namespaces: ["--area-brand-", "--area-fg-brand", "--area-fg-on-brand", "--area-border-focus"],
  presets: CHROMATIC_SCALES.map((spec) => ({
    id: spec.id,
    label: spec.id[0]!.toUpperCase() + spec.id.slice(1),
    description: SCALE_DESCRIPTIONS[spec.id]!,
    tokens: brandTokens("light", spec.id),
    darkTokens: brandTokens("dark", spec.id),
  })),
};
