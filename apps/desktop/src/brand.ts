/**
 * The Canvas's brand (owner, 2026-10-26; docs/research/brand-palette-2026-10-26/PLAN.md, phase 3): off by default, Area's
 * palette; on, up to three exact colours paint the specimens through `@area/tokens/brand` (the holders that carry the
 * Inspector's settings, src/specimen-scope.tsx), while the app itself, the Canvas's body, cards and titles included, keeps
 * Area's defaults. Status colours are harmonised with the brand, or Area's own (then the Status colours setting decides
 * between fixed and matched). Saved as colours, not preset ids, and validated on the way back in.
 */
import { useInsertionEffect, useMemo } from "react";
import { brandCss, brandDeclarations, brandInfo, isBrandColour } from "@area/tokens/brand";

export interface BrandState {
  on: boolean;
  primary: string;
  secondary: string | null;
  tertiary: string | null;
  /** harmonised: the status colours turn toward the primary; own: Area's, as the Status colours setting draws them. */
  status: "harmonised" | "own";
}

/** Off, starting from the palette's blue accent solid when turned on. */
export const BRAND_DEFAULT: BrandState = { on: false, primary: "#006df5", secondary: null, tertiary: null, status: "harmonised" };

const colourOr = (value: unknown, fallback: string | null) => typeof value === "string" && isBrandColour(value) ? value.toLowerCase() : fallback;

/** A saved brand, each field kept only while it is still valid. */
export function restoreBrand(saved: unknown): BrandState {
  const s = (saved && typeof saved === "object" ? saved : {}) as Record<string, unknown>;
  return {
    on: s.on === true,
    primary: colourOr(s.primary, BRAND_DEFAULT.primary)!,
    secondary: colourOr(s.secondary, null),
    tertiary: colourOr(s.tertiary, null),
    status: s.status === "own" ? "own" : "harmonised",
  };
}

const statusOf = (brand: BrandState) => ({ statusColours: brand.status === "own" ? "fixed" as const : "harmonised" as const });
const colours = (brand: BrandState) => ({ primary: brand.primary, ...(brand.secondary ? { secondary: brand.secondary } : {}), ...(brand.tertiary ? { tertiary: brand.tertiary } : {}) });

/** The brand's declarations, or nothing when Brand is off (the engine caches each brand it works out). */
export function brandStyle(brand: BrandState): Record<string, string> | undefined {
  if (!brand.on) return undefined;
  return brandDeclarations(colours(brand), statusOf(brand));
}

/** What each slot resolved to, in one mode: its anchor rung, hue, character and button. */
export function brandSlots(brand: BrandState, mode: "light" | "dark") {
  return brandInfo(colours(brand))[mode];
}

/** The brand's rule, `[data-area-brand]` in the axes layer, after the axes' own so it wins where a specimen carries both. */
export const brandSheet = (brand: BrandState) => brandCss(colours(brand), statusOf(brand));

/** Keeps the brand's rule in the document's head while a brand is given, and takes it out when none is. */
export function useBrandSheet(brand: BrandState | null) {
  const css = useMemo(() => brand ? brandSheet(brand) : null, [brand]);
  useInsertionEffect(() => {
    if (!css) return;
    const style = document.createElement("style");
    style.dataset.areaBrandSheet = "";
    style.textContent = css;
    document.head.append(style);
    return () => style.remove();
  }, [css]);
}
