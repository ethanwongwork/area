/**
 * Axis definitions.
 *
 * An axis is one dimension a consumer can retune: colour, typography, density, radius,
 * surface, motion. Each ships a small set of presets, each preset is a flat map of CSS
 * custom properties, and choosing one is a single data attribute on the root element.
 *
 * The rule that makes six axes composable rather than a 4,096-cell matrix is that no two
 * axes may write the same custom property. `registry.ts` enforces it mechanically. Where
 * axes genuinely interact -- radius depends on control height -- the dependent axis emits
 * a unitless multiplier and the relationship is expressed once, in calc(), in the tokens
 * layer. That is also what makes `<aside data-area-density="compact">` work: custom
 * properties inherit, so a subtree can carry its own axis values, but only while the
 * derived values stay as live calc() rather than baked pixels.
 */

export type TokenMap = Readonly<Record<string, string>>;

export interface AxisPreset {
  /** Value of the data attribute, e.g. "compact". */
  id: string;
  /** Shown in the docs picker. */
  label: string;
  /** One sentence, shown under the label. */
  description: string;
  /** Custom properties this preset sets. Must fall inside the axis's namespace. */
  tokens: TokenMap;
  /**
   * Values that replace `tokens` under the dark theme. Only the colour axes use this;
   * every other axis is theme-invariant, which is itself a useful property -- swapping
   * theme never changes a size, and swapping density never changes a colour.
   */
  darkTokens?: TokenMap;
}

export interface AxisDefinition {
  /** Attribute suffix: `data-area-<id>`. */
  id: string;
  label: string;
  description: string;
  /** Which preset applies with no attribute present. */
  defaultPreset: string;
  presets: AxisPreset[];
  /**
   * Prefixes this axis owns. Every token it emits must start with one of these, and no
   * other axis may claim an overlapping prefix.
   */
  namespaces: readonly string[];
}

/** Prefix every token name carries, so an Area variable is never mistaken for a consumer's. */
export const PREFIX = "--area-";

export function token(name: string): string {
  return `${PREFIX}${name}`;
}

/** Build a token map from short names, applying the prefix once. */
export function tokens(map: Record<string, string | number>): TokenMap {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(map)) {
    out[token(name)] = typeof value === "number" ? String(value) : value;
  }
  return out;
}
