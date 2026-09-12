/**
 * Machine-readable token output.
 *
 * `tokens.json` is what the docs site reads to render the ramp pages and the axis picker,
 * and what `tokens:diff` compares between releases so a public token cannot change value
 * or disappear without someone noticing.
 */
import { AXES, defaultPresetOf } from "../axes/registry.ts";
import { REGISTERED_PROPERTIES, SPACE_RAMP, Z_LAYERS, baseTokens, derivedTokens } from "./base.ts";
import { STEP_ROLES } from "../color/curves.ts";
import { SEMANTIC_ALIASES } from "../semantic/aliases.ts";
import { ALL_SCALES } from "../color/presets.ts";
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
  /** Step roles, so the docs render the contract rather than a caption someone typed. */
  stepRoles: readonly string[];
  /** Semantic token -> the role and step it resolves to. */
  semantics: Record<string, { role?: string; step?: number; kind: string }>;
  /** Every scale, both themes, for the ramp pages. */
  scales: Record<
    string,
    Record<
      "light" | "dark",
      {
        hue: number;
        cusp: { L: number; C: number };
        contrast: string;
        steps: Array<{ step: number; hex: string; p3: string; oklch: string; role: string }>;
        alphas: Array<{ step: number; hex8: string; alpha: number }>;
      }
    >
  >;
  spaceRamp: readonly number[];
  zLayers: typeof Z_LAYERS;
}

export function buildTokensJson(): TokensJson {
  const scales: TokensJson["scales"] = {};
  for (const spec of ALL_SCALES) {
    scales[spec.id] = {
      light: serialiseScale(spec.id, "light"),
      dark: serialiseScale(spec.id, "dark"),
    };
  }

  const semantics: TokensJson["semantics"] = {};
  for (const [name, alias] of Object.entries(SEMANTIC_ALIASES)) {
    semantics[name] =
      alias.kind === "literal"
        ? { kind: alias.kind }
        : alias.kind === "contrast"
          ? { kind: alias.kind, role: alias.role }
          : { kind: alias.kind, role: alias.role, step: alias.step };
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
    stepRoles: STEP_ROLES,
    semantics,
    scales,
    spaceRamp: SPACE_RAMP,
    zLayers: Z_LAYERS,
  };
}

function serialiseScale(id: string, theme: "light" | "dark") {
  const spec = ALL_SCALES.find((s) => s.id === id)!;
  const built = buildScale(spec, theme);
  return {
    hue: built.hue,
    cusp: { L: round(built.cusp.L), C: round(built.cusp.C) },
    contrast: built.contrast.hex,
    steps: built.steps.map((s) => ({
      step: s.step,
      hex: s.hex,
      p3: s.p3,
      oklch: s.oklchCss,
      role: STEP_ROLES[s.step - 1]!,
    })),
    alphas: built.alphas.map((a) => ({ step: a.step, hex8: a.hex8, alpha: round(a.alpha) })),
  };
}

function round(n: number): number {
  return Number(n.toFixed(4));
}
