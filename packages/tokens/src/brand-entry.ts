/**
 * `@area/tokens/brand`: a brand's tokens at runtime (2026-10-26). Up to three exact colours in, CSS custom properties out,
 * from the same solver and contrast rules as Area's palette (semantic/brand.ts, emit/brand.ts). Bundled by build.ts with
 * the derivations it restates embedded as data (emit/brand-derived.ts), so it never loads the axes.
 *
 *   brandDeclarations(brand)  `--area-*` to value: an inline style, or React `Theme`'s `brand`
 *   brandCss(brand)           the same as a `[data-area-brand]` rule (or `selector`)
 *   brandInfo(brand)          what each slot resolved to, per mode: anchor rung, hue, character, button and label
 */
import DERIVED from "area:brand-derived";
import { type Brand, type BrandOptions, brandCssWith, brandDeclarationsWith } from "./emit/brand.ts";
import { resolveBrandTheme } from "./semantic/brand.ts";

export type { Brand, BrandOptions };

export function brandDeclarations(brand: Brand, options: BrandOptions = {}): Record<string, string> {
  return brandDeclarationsWith(DERIVED, brand, options);
}

export function brandCss(brand: Brand, options: BrandOptions & { selector?: string } = {}): string {
  return brandCssWith(DERIVED, brand, options);
}

export function brandInfo(brand: Brand) {
  return {
    light: resolveBrandTheme({ theme: "light", neutral: "neutral", brand }).brandInfo,
    dark: resolveBrandTheme({ theme: "dark", neutral: "neutral", brand }).brandInfo,
  };
}

/** A colour the brand slots accept: a CSS hex, #rgb or #rrggbb. */
export const isBrandColour = (value: string): boolean => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
