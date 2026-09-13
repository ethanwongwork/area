/**
 * Machine-readable token output.
 *
 * `tokens.json` is what the docs site reads to render the ramp pages and the axis picker,
 * and what `tokens:diff` compares between releases so a public token cannot change value
 * or disappear without someone noticing.
 */
import { AXES, defaultPresetOf } from "../axes/registry.ts";
import {
  LEADING_RAMP,
  RADIUS_RAMP,
  REGISTERED_PROPERTIES,
  SIZE_RAMP,
  SPACE_RAMP,
  WGHT_RAMP,
  Z_LAYERS,
  baseTokens,
  derivedTokens,
} from "./base.ts";
import { INVERSION, LEVELS } from "../color/curves.ts";
import { SEMANTIC_ALIASES } from "../semantic/aliases.ts";
import { ALL_SCALES, SCALE_DESCRIPTIONS } from "../color/presets.ts";
import { buildScale } from "../color/scale.ts";

export interface TokensJson {
  version: 1;
  generatedBy: string;
  base: Record<string, string>;
  derived: Record<string, string>;
  registered: typeof REGISTERED_PROPERTIES;
  axes: Array<{
    id: string;
    label: string;
    description: string;
    attribute: string;
    defaultPreset: string;
    namespaces: readonly string[];
    presets: Array<{
      id: string;
      label: string;
      description: string;
      tokens: Record<string, string>;
      darkTokens?: Record<string, string>;
    }>;
  }>;
  /** The ladder itself: every level, lightest first. A level *is* its lightness. */
  levels: readonly number[];
  /** Which level each semantic slot reads in each theme -- the inversion, as data. */
  inversion: Record<string, { light: number; dark: number }>;
  /** One sentence per scale. */
  scaleDescriptions: Record<string, string>;
  /** Semantic token -> the role it reads and the level it lands on in each theme. */
  semantics: Record<string, { kind: string; role?: string; light?: number; dark?: number }>;
  /**
   * Every scale. One ramp, not two: the steps are theme-independent, and only the alphas
   * differ, because those are composited over a page background that the theme decides.
   */
  scales: Record<
    string,
    {
      hue: number;
      peak: { level: number; C: number };
      solid: { level: number; hover: { light: number; dark: number }; foreground: string; wcag: number; apca: number; retreat: number };
      steps: Array<{
        level: number;
        hex: string;
        oklch: string;
        contrast: { fg: string; ratio: number; grade: string };
      }>;
      alphas: Record<"light" | "dark", Array<{ level: number; hex8: string; alpha: number }>>;
    }
  >;
  spaceRamp: readonly number[];
  sizeRamp: readonly number[];
  leadingRamp: readonly number[];
  wghtRamp: readonly number[];
  radiusRamp: readonly number[];
  zLayers: typeof Z_LAYERS;
}

export function buildTokensJson(): TokensJson {
  const scales: TokensJson["scales"] = {};
  for (const spec of ALL_SCALES) {
    scales[spec.id] = serialiseScale(spec.id);
  }

  const semantics: TokensJson["semantics"] = {};
  for (const [name, alias] of Object.entries(SEMANTIC_ALIASES)) {
    semantics[name] =
      alias.kind === "literal"
        ? { kind: alias.kind }
        : alias.kind === "contrast"
          ? { kind: alias.kind, role: alias.role }
          : alias.kind === "solid" || alias.kind === "solidHover"
            ? { kind: alias.kind, role: alias.role }
            : {
                kind: alias.kind,
                role: alias.role,
                light: INVERSION[alias.slot].light,
                dark: INVERSION[alias.slot].dark,
              };
  }

  return {
    version: 1,
    generatedBy: "@area/tokens",
    base: baseTokens(),
    derived: derivedTokens(),
    registered: REGISTERED_PROPERTIES,
    axes: AXES.map((axis) => ({
      id: axis.id,
      label: axis.label,
      description: axis.description,
      attribute: `data-area-${axis.id}`,
      defaultPreset: defaultPresetOf(axis).id,
      namespaces: axis.namespaces,
      presets: axis.presets.map((p) => ({
        id: p.id,
        label: p.label,
        description: p.description,
        tokens: { ...p.tokens },
        ...(p.darkTokens ? { darkTokens: { ...p.darkTokens } } : {}),
      })),
    })),
    levels: LEVELS,
    inversion: INVERSION,
    scaleDescriptions: SCALE_DESCRIPTIONS,
    semantics,
    scales,
    spaceRamp: SPACE_RAMP,
    sizeRamp: SIZE_RAMP,
    leadingRamp: LEADING_RAMP,
    wghtRamp: WGHT_RAMP,
    radiusRamp: RADIUS_RAMP,
    zLayers: Z_LAYERS,
  };
}

function serialiseScale(id: string) {
  const spec = ALL_SCALES.find((s) => s.id === id)!;
  const light = buildScale(spec, "light");
  const dark = buildScale(spec, "dark");
  const alphas = (built: typeof light) =>
    built.alphas.map((a) => ({ level: a.level, hex8: a.hex8, alpha: round(a.alpha) }));

  return {
    hue: light.hue,
    peak: { level: light.peak.level, C: round(light.peak.C) },
    solid: {
      level: light.solid.level,
      hover: light.solid.hover,
      foreground: light.solid.foreground,
      wcag: light.solid.wcag,
      apca: light.solid.apca,
      retreat: light.solid.retreat,
    },
    steps: light.steps.map((s) => ({
      level: s.level,
      hex: s.hex,
      oklch: s.oklchCss,
      contrast: s.contrast,
    })),
    alphas: { light: alphas(light), dark: alphas(dark) },
  };
}

function round(n: number): number {
  return Number(n.toFixed(4));
}
