/**
 * A brand as CSS custom properties (2026-10-26; docs/research/brand-palette-2026-10-26/PLAN.md, phase 2). It writes what a
 * palette accent writes, the accent's and the status tones' full-strength inputs, plus the brand's own roles, as
 * `light-dark()` pairs, and declares again every derivation that reads them (emit/brand-derived.ts), so Shade, Saturation,
 * Label tint, Contrast and every other setting keep deriving in CSS over a brand exactly as over the palette.
 *
 *   brandDeclarations  `--area-*` name to value, for an inline style (React `Theme`'s `brand`) or a rule
 *   brandCss           the same as a rule, `[data-area-brand]` by default, in the axes layer
 *
 * The brand's Auto is its nearest readable shade (semantic/brand.ts `nearestShade`), with that shade's label and Label
 * tint's end; a Shade step chosen in the settings still picks its own.
 */
import { type Brand, resolveBrandTheme } from "../semantic/brand.ts";
import { accentInputs, toneInputs } from "../semantic/inputs.ts";
import { STATUS_TONES } from "../color/presets.ts";
import { type Theme } from "../color/scale.ts";

export type { Brand };
export interface BrandOptions {
  /** Status colours: harmonised with the brand (the default), Area's own ("fixed"), or quieted with Saturation ("match"). */
  statusColours?: "harmonised" | "fixed" | "match";
}

const SLOT_PREFIXES = ["secondary", "tertiary"] as const;
const SUPPORT = Array.from({ length: 8 }, (_, i) => i + 1).flatMap(n => [`support-${n}`, `fg-on-support-${n}`, `support-${n}-strong`, `fg-on-support-${n}-strong`]);
const SURFACES = ["bg-brand-page", "bg-brand-ground", "fg-on-brand-ground"];

/** A brand's literal values in one mode, short names (no `--area-`). */
function literals(brand: Brand, theme: Theme, options: BrandOptions): Record<string, string> {
  const resolved = resolveBrandTheme({ theme, neutral: "neutral", brand, statusColours: options.statusColours });
  const out = accentInputs(resolved);
  // Auto is the brand's nearest readable shade: its fill, hover and label came through the resolver; Label tint's end too.
  const shade = resolved.brandInfo!.primary!.shade;
  out["accent-label-full"] = out[`accent-label-${shade}-full`]!;
  if ((options.statusColours ?? "harmonised") === "harmonised") Object.assign(out, toneInputs(resolved, STATUS_TONES));
  const own = (name: string) => { out[name] = resolved.tokens[name]!; };
  for (const prefix of SLOT_PREFIXES) if (brand[prefix]) for (const name of Object.keys(resolved.tokens)) if (name.startsWith(`${prefix}-`) || name.startsWith(`fg-${prefix}`) || name === `fg-on-${prefix}`) own(name);
  SUPPORT.forEach(own);
  SURFACES.forEach(own);
  return out;
}

/** Every input a brand can write, short names: the derivations that read them are restated (emit/brand-derived.ts). */
export function brandInputNames(): string[] {
  return Object.keys(literals({ primary: "#00b65c", secondary: "#a785fe", tertiary: "#f8311c" }, "light", {}));
}

const cache = new Map<string, Record<string, string>>();

/** A colour as the solver reads it: #rrggbb, lower case (#rgb expanded); anything else is refused. */
function colour(value: string, slot: string): string {
  const hex = value.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(hex)) return hex;
  if (/^#[0-9a-f]{3}$/.test(hex)) return `#${[...hex.slice(1)].map(c => c + c).join("")}`;
  throw new Error(`The brand's ${slot} must be a hex colour (#rgb or #rrggbb), not "${value}".`);
}
const normalise = (brand: Brand): Brand => ({
  primary: colour(brand.primary, "primary"),
  ...(brand.secondary ? { secondary: colour(brand.secondary, "secondary") } : {}),
  ...(brand.tertiary ? { tertiary: colour(brand.tertiary, "tertiary") } : {}),
});

/**
 * A brand's declarations: the derivations (`derived`, from emit/brand-derived.ts) first, then every literal, so where a
 * brand sets a token that is otherwise derived (a secondary block, where the default aliases the accent) its own value
 * is the one declared.
 */
export function brandDeclarationsWith(derived: Readonly<Record<string, string>>, given: Brand, options: BrandOptions = {}): Record<string, string> {
  const brand = normalise(given);
  const key = JSON.stringify([brand.primary, brand.secondary ?? "", brand.tertiary ?? "", options.statusColours ?? ""]).toLowerCase();
  const known = cache.get(key);
  if (known) return known;
  const light = literals(brand, "light", options), dark = literals(brand, "dark", options);
  const out: Record<string, string> = {};
  for (const [name, formula] of Object.entries(derived)) if (!(name.slice("--area-".length) in light)) out[name] = formula;
  for (const name of Object.keys(light)) out[`--area-${name}`] = light[name] === dark[name] ? light[name]! : `light-dark(${light[name]}, ${dark[name]})`;
  cache.set(key, out);
  return out;
}

/** The declarations as one rule in the axes layer, after the axes' own, so the brand's inputs win on the same element. */
export function brandCssWith(derived: Readonly<Record<string, string>>, brand: Brand, options: BrandOptions & { selector?: string } = {}): string {
  const declarations = brandDeclarationsWith(derived, brand, options), named = normalise(brand);
  const body = Object.entries(declarations).map(([name, value]) => `    ${name}: ${value};`).join("\n");
  return `/* Area brand: ${[named.primary, named.secondary, named.tertiary].filter(Boolean).join(", ")} */\n@layer area.axes {\n  ${options.selector ?? "[data-area-brand]"} {\n${body}\n  }\n}\n`;
}
