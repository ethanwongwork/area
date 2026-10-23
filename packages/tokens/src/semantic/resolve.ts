/**
 * Builds a complete resolved theme: every scale, plus the semantic layer on top.
 *
 * A theme is the cross-product of the colour axis choices (which neutral, which accent)
 * with light or dark. The contrast gate asserts against these resolved objects rather
 * than against source data, because what ships is what has to be readable.
 */
import { type BuiltScale, type Theme, WHITE, buildScale } from "../color/scale.ts";
import { ALL_SCALES, CHROMATIC_SCALES, NEUTRAL_SCALES, ROLE_SCALES } from "../color/presets.ts";
import { type Role, type ScaleLookup, resolveAliases } from "./aliases.ts";
import { DEFAULT_LAYER_SELECTION, type LayerSelection, castOf, layerTokens } from "../color/layers.ts";
import { ACCENT_HUES, DEFAULT_ACCENT_STRENGTH, type SolidPick, generatedSpec, hueScaleId, withStrength } from "../color/generate.ts";
import { SEMANTIC_ALIASES } from "./aliases.ts";

export interface ThemeSelection {
  theme: Theme;
  /** The Layers settings (ground and layer contrast); Area's defaults when omitted. */
  layers?: LayerSelection;
  /** Which neutral scale the interface is built from. */
  neutral: string;
  /** Which chromatic scale fills the accent role: a named family ("blue") or a hue in 5° steps ("260"). */
  accent: string;
  /** Accent strength (axes/accent.ts), percent of the accent's own chroma; 100 when omitted. */
  accentStrength?: number;
  /** The Solid setting per mode (axes/accent.ts); Auto when omitted. */
  solid?: { light: SolidPick; dark: SolidPick };
}

export interface ResolvedTheme extends ThemeSelection {
  /** Every scale Area ships, built for this theme. Keyed by scale id. */
  scales: Record<string, BuiltScale>;
  /** The scale backing each semantic role, after the axis selection is applied. */
  roles: Record<Role, BuiltScale>;
  /** Flat semantic token name -> colour. This is what the CSS emitter writes. */
  tokens: Record<string, string>;
}

const scaleCache = new Map<string, BuiltScale>();

export function scaleFor(id: string, theme: Theme): BuiltScale {
  const key = `${id}:${theme}`;
  const cached = scaleCache.get(key);
  if (cached) return cached;

  const spec = ALL_SCALES.find((s) => s.id === id) ?? generatedSpec(id);
  if (!spec) throw new Error(`Unknown scale "${id}". Known: ${ALL_SCALES.map((s) => s.id).join(", ")}`);

  const built = buildScale(spec, theme);
  scaleCache.set(key, built);
  return built;
}

export function resolveTheme(selection: ThemeSelection): ResolvedTheme {
  const { theme, neutral, accent } = selection;

  if (!NEUTRAL_SCALES.some((s) => s.id === neutral)) {
    throw new Error(`"${neutral}" is not a neutral scale.`);
  }
  const accentScale = accentScaleId(accent);
  if (!CHROMATIC_SCALES.some((s) => s.id === accentScale) && !ACCENT_HUES.some(hue => hueScaleId(hue) === accentScale)) {
    throw new Error(`"${accent}" is not a chromatic scale or an accent hue.`);
  }

  const scales = Object.fromEntries(ALL_SCALES.map((s) => [s.id, scaleFor(s.id, theme)]));

  const roles: Record<Role, BuiltScale> = {
    neutral: scaleFor(neutral, theme),
    accent: scaleFor(accentScale, theme),
    danger: scaleFor(ROLE_SCALES.danger, theme),
    warning: scaleFor(ROLE_SCALES.warning, theme),
    caution: scaleFor(ROLE_SCALES.caution, theme),
    success: scaleFor(ROLE_SCALES.success, theme),
    info: scaleFor(ROLE_SCALES.info, theme),
    discovery: scaleFor(ROLE_SCALES.discovery, theme),
    pink: scaleFor(ROLE_SCALES.pink, theme),
    gray: scaleFor(ROLE_SCALES.gray, theme),
    brown: scaleFor(ROLE_SCALES.brown, theme),
  };

  // Keyed by level rather than by position, so a semantic entry says which *colour* it
  // wants and cannot silently follow an index if the ladder ever gains or loses a rung.
  const lookup = Object.fromEntries(
    Object.entries(roles).map(([role, scale]) => [
      role,
      {
        byLevel: {
          ...Object.fromEntries(scale.steps.map((s) => [s.level, s.hex])),
          white: WHITE,
        },
        alphaByLevel: Object.fromEntries(scale.alphas.map((a) => [a.level, a.hex8])),
        solid: { level: scale.solid.level, hover: scale.solid.hover },
        stroke: scale.stroke,
        vivid: scale.vivid,
        tonal: scale.tonal,
        contrast: { hex: scale.contrast.hex },
      },
    ]),
  ) as unknown as ScaleLookup;

  // The page, layers, control fills, edges and inks come from the Layers model (color/layers.ts), tinted by this
  // neutral's own cast, so the gate checks what ships.
  const hexAt = (t: Theme, level: number) => scaleFor(neutral, t).steps.find(s => s.level === level)!.hex;
  const cast = castOf(hexAt("light", 50), hexAt("dark", 900))[theme];
  const resolvedTokens = { ...resolveAliases(lookup, theme), ...layerTokens(theme, selection.layers ?? DEFAULT_LAYER_SELECTION, cast) };
  Object.assign(resolvedTokens, accentPaint(roles.accent, theme, resolvedTokens, selection));
  return { ...selection, theme, neutral, accent, scales, roles, tokens: resolvedTokens };
}

/** An accent setting's scale: a hue's generated family ("260" → "hue-260"), or the named family itself. */
export function accentScaleId(accent: string): string {
  return /^\d+$/.test(accent) ? hueScaleId(Number(accent)) : accent;
}

/** Accent tokens that are labels, measured black or white: Strength never moves them (emit/base.ts ACCENT_LABELS). */
export const ACCENT_LABELS: ReadonlySet<string> = new Set(["fg-on-accent"]);

/**
 * What Solid and Accent strength paint over the accent's own tokens, as emit/base.ts derives them in CSS: the solid and
 * its hover at the Solid step, then every accent colour but its label at the strength's share of its chroma.
 */
function accentPaint(scale: BuiltScale, theme: Theme, tokens: Record<string, string>, selection: ThemeSelection): Record<string, string> {
  const strength = selection.accentStrength ?? DEFAULT_ACCENT_STRENGTH;
  const pick = selection.solid?.[theme] ?? "auto";
  const hexAt = (level: number) => scale.steps.find(s => s.level === level)!.hex;
  const out: Record<string, string> = {};
  if (pick !== "auto") {
    out["accent-solid"] = hexAt(scale.solidSteps[pick].level);
    out["accent-solid-hover"] = hexAt(scale.solidSteps[pick].hover);
  }
  for (const [name, alias] of Object.entries(SEMANTIC_ALIASES)) {
    if (alias.role !== "accent" || ACCENT_LABELS.has(name)) continue;
    out[name] = withStrength(out[name] ?? tokens[name]!, strength);
  }
  return out;
}

/** The selection Area ships as its default. */
export const DEFAULT_SELECTION = { neutral: "neutral", accent: "blue" } as const;

/** Every theme the contrast gate has to clear: both themes x every axis choice. */
export function shippedThemes(): ResolvedTheme[] {
  const out: ResolvedTheme[] = [];
  for (const theme of ["light", "dark"] as const) {
    for (const neutral of NEUTRAL_SCALES) {
      for (const accent of CHROMATIC_SCALES) {
        out.push(resolveTheme({ theme, neutral: neutral.id, accent: accent.id }));
      }
    }
  }
  return out;
}
