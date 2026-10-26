/**
 * A brand's theme (owner, 2026-10-26; docs/research/brand-palette-2026-10-26/PLAN.md, phase 1): up to three exact brand
 * colours drive the accent, harmonised status colours, a secondary and a tertiary role, eight supporting colours and two
 * brand surfaces, through the same solver and resolver as Area's own palette. With no brand, `resolveBrandTheme` is
 * `resolveTheme` token for token, plus the new tokens at their defaults (`defaultBrandTokens`, the same values the CSS
 * emits): Area's palette stays the default.
 *
 * The roles:
 *   accent            the primary's family; its button is the readable shade nearest the brand (`nearestShade`), which
 *                     Shade and Saturation move from as they move from Auto
 *   status roles      each palette family harmonised toward the primary (color/brand.ts); "fixed" and "match" keep
 *                     today's behaviour
 *   secondary-*,      the accent's tonal block on the secondary and tertiary families, each with its nearest readable
 *   tertiary-*        button; at the accent's own values where none is set
 *   support-1 … 8     the supporting palette: a soft tone (200 in light, 850 in dark) and a strong one (700, 300), each
 *                     with the label that reads on it; the palette's own eight families with no brand
 *   bg-brand-page,    the primary family's lightest (light) or deepest (dark) rung as a page, its 900 as a deep ground with
 *   bg-brand-ground   its label; the page and the inverse ground with no brand
 */
import { type BuiltScale, type ScaleSpec, type Theme, buildScale } from "../color/scale.ts";
import { type Family, brandFamily, harmonisedFamily, supportingFamilies, PALETTE_SUPPORT, paletteFamily } from "../color/brand.ts";
import { SRGB, deltaEOk, parseHex, rgbToOklab } from "../color/oklab.ts";
import { apcaMagnitude, wcagContrastHex } from "../color/contrast.ts";
import { type SolidStep } from "../color/generate.ts";
import { type Level, LEVELS } from "../color/curves.ts";
import { CHROMATIC_SCALES, ROLE_SCALES, STATUS_TONES } from "../color/presets.ts";
import { type Role, SEMANTIC_ALIASES, resolveAlias } from "./aliases.ts";
import { type ResolvedTheme, type ThemeSelection, lookupOf, resolveTheme, resolveWithRoles, viewOf, DEFAULT_SELECTION } from "./resolve.ts";
import { type ContrastAssertion, ASSERTIONS } from "../contrast/assertions.ts";
import { APCA, WCAG } from "../color/contrast.ts";

/** Up to three exact brand colours (any CSS hex). The primary drives the accent and the harmonised status colours. */
export interface Brand { primary: string; secondary?: string; tertiary?: string }

export interface BrandSelection extends Omit<ThemeSelection, "accent" | "statusColours"> {
  /** The accent where no brand is set: a palette family or a hue, as `resolveTheme` takes it. */
  accent?: string;
  brand?: Brand | null;
  /** Status colours: harmonised with the brand (the default where one is set), Area's own ("fixed"), or quieted ("match"). */
  statusColours?: "fixed" | "match" | "harmonised";
}

export interface BrandTheme extends ResolvedTheme {
  /** What the brand resolved to, for the controls and the docs: each slot's anchor, hue, character and button. */
  brandInfo: null | Record<"primary" | "secondary" | "tertiary", null | { hex: string; anchor: Level; hue: number; character: number; shade: SolidStep; button: string; label: string }>;
}

const STATUS = STATUS_TONES as readonly Role[];
const SUPPORT_LEVELS: Record<Theme, { soft: Level; strong: Level }> = { light: { soft: 200, strong: 700 }, dark: { soft: 850, strong: 300 } };
const SURFACE_LEVELS: Record<Theme, { page: Level; ground: Level }> = { light: { page: 25, ground: 900 }, dark: { page: 975, ground: 900 } };

/** A brand family's scale, its solid starting from the label that reads better on the brand colour. */
function brandScale(id: string, hex: string, theme: Theme) {
  const own = brandFamily(hex);
  const spec: ScaleSpec = { id, kind: "chromatic", family: own.family, exact: own.anchor, ...(own.label === "#000000" ? { solidForeground: "dark" as const } : {}) };
  return { own, scale: buildScale(spec, theme) };
}

/**
 * The button nearest the brand: of the Shade steps that draw their own rung (under black or white, whichever reads), the
 * one that looks most like the brand colour (OKLab distance). The solver's Auto is the family's most vivid readable
 * shade, which can drift from a brand (GO Green's turns neon); a brand keeps its own.
 */
export function nearestShade(scale: BuiltScale, hex: string): SolidStep {
  const brand = rgbToOklab(parseHex(hex), SRGB);
  const looks = (level: Level) => deltaEOk(rgbToOklab(parseHex(scale.steps.find(s => s.level === level)!.hex), SRGB), brand);
  const landing = (Object.entries(scale.solidSteps) as Array<[string, BuiltScale["solidSteps"][SolidStep]]>).filter(([step, v]) => v.level === Number(step));
  return Number(landing.sort((a, b) => looks(a[1].level) - looks(b[1].level))[0]![0]) as SolidStep;
}

/** The label that reads on a colour (black or white), as a button's: whichever clears more. */
const labelOn = (hex: string) => wcagContrastHex("#000000", hex) >= wcagContrastHex("#ffffff", hex) ? "#000000" : "#ffffff";

/** A role's tonal block on another scale: the accent's aliases, renamed, resolved with that scale in the accent's place. */
function tonalTokens(prefix: "secondary" | "tertiary", scale: BuiltScale, base: ResolvedTheme, theme: Theme, shade: SolidStep | null): Record<string, string> {
  const lookup = { ...lookupOf(base.roles), accent: viewOf(scale) };
  const out: Record<string, string> = {};
  for (const [name, alias] of Object.entries(SEMANTIC_ALIASES)) {
    if (alias.role !== "accent") continue;
    out[name.replace("accent", prefix)] = resolveAlias(alias, lookup, theme);
  }
  if (shade !== null) {
    const step = scale.solidSteps[shade], hexAt = (level: Level) => scale.steps.find(s => s.level === level)!.hex;
    out[`${prefix}-solid`] = hexAt(step.level);
    out[`${prefix}-solid-hover`] = hexAt(step.hover);
    out[`fg-on-${prefix}`] = step.fg;
  }
  return out;
}

/** The accent's own values under the secondary and tertiary names: where no brand sets them. */
function accentAs(prefix: "secondary" | "tertiary", tokens: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(SEMANTIC_ALIASES).filter(([, alias]) => alias.role === "accent").map(([name]) => [name.replace("accent", prefix), tokens[name]!]));
}

/**
 * A tone that carries its label as text (4.5:1 and APCA Lc 60, both modes): the rung at `start` or, where its label falls
 * short, the first toward the label's own side that clears (lighter under black, deeper under white). A strong tone in
 * dark starts at 300, where black reads 7:1 but only Lc 49 on some hues.
 */
function readableRung(family: Family, start: Level): { hex: string; label: string } {
  const levels = LEVELS as readonly Level[], at = (i: number) => family[String(levels[i])]!.hex;
  const label = labelOn(family[String(start)]!.hex), direction = label === "#000000" ? -1 : 1;
  const clears = (hex: string) => wcagContrastHex(label, hex) >= WCAG.TEXT && apcaMagnitude(label, hex) >= APCA.CONTENT;
  for (let i = levels.indexOf(start); i >= 0 && i < levels.length; i += direction) if (clears(at(i))) return { hex: at(i), label };
  return { hex: family[String(start)]!.hex, label };
}

/** The supporting palette's tokens: each family's soft and strong tone and their labels. */
function supportTokens(families: readonly Family[], theme: Theme): Record<string, string> {
  const out: Record<string, string> = {};
  families.forEach((family, i) => {
    const { soft, strong } = SUPPORT_LEVELS[theme], n = i + 1;
    const a = readableRung(family, soft), b = readableRung(family, strong);
    out[`support-${n}`] = a.hex;
    out[`fg-on-support-${n}`] = a.label;
    out[`support-${n}-strong`] = b.hex;
    out[`fg-on-support-${n}-strong`] = b.label;
  });
  return out;
}

/** The new tokens where no brand is set: what the CSS emits by default (emit/base.ts `brandDefaultTokens`). */
export function defaultBrandTokens(tokens: Record<string, string>, theme: Theme): Record<string, string> {
  return {
    ...accentAs("secondary", tokens),
    ...accentAs("tertiary", tokens),
    ...supportTokens(PALETTE_SUPPORT.map(paletteFamily), theme),
    "bg-brand-page": tokens["bg-page"]!,
    "bg-brand-ground": tokens["bg-inverse"]!,
    "fg-on-brand-ground": tokens["fg-on-inverse"]!,
  };
}

/** A theme for a brand, or Area's own where none is set. */
export function resolveBrandTheme(selection: BrandSelection): BrandTheme {
  const { theme, brand } = selection;
  const status = selection.statusColours ?? (brand ? "harmonised" : "fixed");
  const plain = { ...selection, accent: selection.accent ?? DEFAULT_SELECTION.accent, statusColours: status === "match" ? "match" as const : "fixed" as const };
  if (!brand) {
    const base = resolveTheme(plain);
    return { ...base, tokens: { ...base.tokens, ...defaultBrandTokens(base.tokens, theme) }, brandInfo: null };
  }

  const primary = brandScale("brand-primary", brand.primary, theme);
  const shade = nearestShade(primary.scale, brand.primary);
  const given: Partial<Record<Role, BuiltScale>> = { accent: primary.scale };
  if (status === "harmonised") for (const role of STATUS) {
    const id = ROLE_SCALES[role as keyof typeof ROLE_SCALES];
    const own = CHROMATIC_SCALES.find(s => s.id === id)!;
    given[role] = buildScale({ id: `brand-${role}`, kind: "chromatic", family: harmonisedFamily(id, brand.primary), ...(own.solidForeground ? { solidForeground: own.solidForeground } : {}) }, theme);
  }
  // Shade: the brand's nearest readable shade unless one is chosen, as Auto stands for the solver's own elsewhere.
  const solid = selection.solid?.[theme] && selection.solid[theme] !== "auto" ? selection.solid : { light: shade, dark: shade };
  const base = resolveWithRoles({ ...plain, solid }, given);

  const slot = (key: "primary" | "secondary" | "tertiary", made: { own: ReturnType<typeof brandFamily>; scale: BuiltScale } | null, step: SolidStep | null) => {
    if (!made || step === null) return null;
    const at = made.scale.solidSteps[step];
    return { hex: brand[key]!, anchor: made.own.anchor, hue: Math.round(made.own.hue), character: Math.round(made.own.character * 100) / 100, shade: step,
      button: made.scale.steps.find(s => s.level === at.level)!.hex, label: at.fg };
  };
  const secondary = brand.secondary ? brandScale("brand-secondary", brand.secondary, theme) : null;
  const tertiary = brand.tertiary ? brandScale("brand-tertiary", brand.tertiary, theme) : null;
  const secondaryShade = secondary ? nearestShade(secondary.scale, brand.secondary!) : null;
  const tertiaryShade = tertiary ? nearestShade(tertiary.scale, brand.tertiary!) : null;
  const surfaces = SURFACE_LEVELS[theme], family = primary.own.family;
  const ground = family[String(surfaces.ground)]!.hex;
  const tokens = {
    ...base.tokens,
    ...(secondary ? tonalTokens("secondary", secondary.scale, base, theme, secondaryShade) : accentAs("secondary", base.tokens)),
    ...(tertiary ? tonalTokens("tertiary", tertiary.scale, base, theme, tertiaryShade) : accentAs("tertiary", base.tokens)),
    ...supportTokens(supportingFamilies(brand.primary).map(s => s.family), theme),
    "bg-brand-page": family[String(surfaces.page)]!.hex,
    "bg-brand-ground": ground,
    "fg-on-brand-ground": labelOn(ground),
  };
  return {
    ...base, tokens,
    brandInfo: { primary: slot("primary", primary, shade), secondary: slot("secondary", secondary, secondaryShade), tertiary: slot("tertiary", tertiary, tertiaryShade) },
  };
}

/**
 * The pairings the new tokens must clear, beside every existing assertion: each accent pairing again on the secondary
 * and tertiary blocks, each supporting tone's label, and the brand surfaces' text.
 */
export const BRAND_ASSERTIONS: ContrastAssertion[] = [
  ...(["secondary", "tertiary"] as const).flatMap(prefix => ASSERTIONS
    .filter(a => /accent/.test(a.fg) || /accent/.test(a.bg))
    .map(a => ({ ...a, fg: a.fg.replace("accent", prefix), bg: a.bg.replace("accent", prefix), note: `${a.note} (${prefix})` }))),
  ...Array.from({ length: 8 }, (_, i) => i + 1).flatMap(n => [
    { fg: `fg-on-support-${n}`, bg: `support-${n}`, wcag: WCAG.TEXT, apca: APCA.CONTENT, note: "supporting colour label (tag, avatar initials)" },
    { fg: `fg-on-support-${n}-strong`, bg: `support-${n}-strong`, wcag: WCAG.TEXT, apca: APCA.CONTENT, note: "strong supporting colour label" },
  ]),
  { fg: "fg-on-brand-ground", bg: "bg-brand-ground", wcag: WCAG.TEXT, apca: APCA.CONTENT, note: "text on the deep brand ground" },
  { fg: "fg-default", bg: "bg-brand-page", wcag: WCAG.TEXT, apca: APCA.CONTENT, note: "body text on the brand page tint" },
  { fg: "fg-muted", bg: "bg-brand-page", wcag: WCAG.TEXT, apca: APCA.CONTENT, note: "muted text on the brand page tint" },
];

/** Every assertion that applies to a brand theme, measured: the failures, as `fg on bg ratio` strings. */
export function brandFailures(t: Record<string, string>, theme: Theme): string[] {
  const out: string[] = [];
  for (const a of [...ASSERTIONS, ...BRAND_ASSERTIONS]) {
    const fg = t[a.fg], bg = t[a.bg];
    if (!fg || !bg) continue;
    const wcag = wcagContrastHex(fg, bg), apca = theme === "dark" ? apcaMagnitude(fg, bg) : Infinity;
    if (wcag < a.wcag || apca < a.apca) out.push(`${a.fg} on ${a.bg} ${wcag.toFixed(2)}:1${theme === "dark" ? ` Lc ${apca.toFixed(0)}` : ""}`);
  }
  return out;
}

/**
 * The new tokens as the CSS writes them where no brand is set (emit/base.ts, emit/css.ts), the same values as
 * `defaultBrandTokens`: the secondary and tertiary blocks and the brand surfaces as aliases of the accent's and the page's
 * tokens (derived, so they follow the accent and the page wherever those change), and the supporting palette as the
 * palette's own colours, a light and a dark value each.
 */
export function brandDefaultCss(): { derived: Record<string, string>; fixed: Record<string, string> } {
  const derived: Record<string, string> = {};
  for (const prefix of ["secondary", "tertiary"] as const)
    for (const [name, alias] of Object.entries(SEMANTIC_ALIASES)) if (alias.role === "accent") derived[`--area-${name.replace("accent", prefix)}`] = `var(--area-${name})`;
  derived["--area-bg-brand-page"] = "var(--area-bg-page)";
  derived["--area-bg-brand-ground"] = "var(--area-bg-inverse)";
  derived["--area-fg-on-brand-ground"] = "var(--area-fg-on-inverse)";
  const families = PALETTE_SUPPORT.map(paletteFamily);
  const light = supportTokens(families, "light"), dark = supportTokens(families, "dark");
  const fixed = Object.fromEntries(Object.keys(light).map(name => [`--area-${name}`, light[name] === dark[name] ? light[name]! : `light-dark(${light[name]}, ${dark[name]})`]));
  return { derived, fixed };
}
