/**
 * Builds a complete resolved theme: every scale, plus the semantic layer on top.
 *
 * A theme is the cross-product of the colour axis choices (which neutral, which accent)
 * with light or dark. The contrast gate asserts against these resolved objects rather
 * than against source data, because what ships is what has to be readable.
 */
import { type BuiltScale, type Theme, buildScale } from "../color/scale.ts";
import { ALL_SCALES, CHROMATIC_SCALES, NEUTRAL_SCALES, ROLE_SCALES } from "../color/presets.ts";
import { type Role, type ScaleLookup, resolveAliases } from "./aliases.ts";

export interface ThemeSelection {
  theme: Theme;
  /** Which neutral scale the interface is built from. */
  neutral: string;
  /** Which chromatic scale fills the accent role. */
  accent: string;
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

function scaleFor(id: string, theme: Theme): BuiltScale {
  const key = `${id}:${theme}`;
  const cached = scaleCache.get(key);
  if (cached) return cached;

  const spec = ALL_SCALES.find((s) => s.id === id);
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
  if (!CHROMATIC_SCALES.some((s) => s.id === accent)) {
    throw new Error(`"${accent}" is not a chromatic scale.`);
  }

  const scales = Object.fromEntries(ALL_SCALES.map((s) => [s.id, scaleFor(s.id, theme)]));

  const roles: Record<Role, BuiltScale> = {
    neutral: scaleFor(neutral, theme),
    accent: scaleFor(accent, theme),
    danger: scaleFor(ROLE_SCALES.danger, theme),
    warning: scaleFor(ROLE_SCALES.warning, theme),
    caution: scaleFor(ROLE_SCALES.caution, theme),
    success: scaleFor(ROLE_SCALES.success, theme),
    info: scaleFor(ROLE_SCALES.info, theme),
    discovery: scaleFor(ROLE_SCALES.discovery, theme),
  };

  // Keyed by level rather than by position, so a semantic entry says which *colour* it
  // wants and cannot silently follow an index if the ladder ever gains or loses a rung.
  const lookup = Object.fromEntries(
    Object.entries(roles).map(([role, scale]) => [
      role,
      {
        byLevel: Object.fromEntries(scale.steps.map((s) => [s.level, s.hex])),
        alphaByLevel: Object.fromEntries(scale.alphas.map((a) => [a.level, a.hex8])),
        solid: { level: scale.solid.level, hover: scale.solid.hover },
        vivid: scale.vivid,
        contrast: { hex: scale.contrast.hex },
      },
    ]),
  ) as unknown as ScaleLookup;

  return { theme, neutral, accent, scales, roles, tokens: resolveAliases(lookup, theme) };
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
