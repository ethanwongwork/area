/**
 * `@area/tokens/colours`: exact colours at runtime (2026-10-27; plan https://claude.ai/artifact/K4rswTACDiMB31nd4nzWz2).
 * A light page, a dark page and an accent, each one exact colour, in; CSS custom properties out. The pages solve into the
 * numbers the Layers model reads (color/colours.ts), and the stylesheet's `[data-area-colours]` rule restates every grey
 * from them; the accent goes through the brand engine (`@area/tokens/brand`), whose declarations carry their own
 * derivations (emit/colours.ts). The application settings (Layer contrast, Card shade, the fills, Text tint, Shade,
 * Saturation, Label tint) stay attributes and apply over whatever was picked.
 *
 *   colourDeclarations(colours)  `--area-*` to value: an inline style on an element with `data-area-colours`, or React
 *                                `Theme`'s `colours`
 *   colourCss(colours)           the same as a `[data-area-colours]` rule (or `selector`)
 *   pageInfo(page)               what each page pick solved to and the colour it paints
 */
import DERIVED from "area:brand-derived";
import { type BrandOptions } from "./emit/brand.ts";
import { type Colours, colourCssWith, colourDeclarationsWith } from "./emit/colours.ts";
import { type ColourInput, type Mode, type Oklch, type PageColours, type PageSolve, formatOklch, isColour, oklchHex, parseColour, reachableChroma, solvePage } from "./color/colours.ts";

export type { ColourInput, Colours, Oklch, PageColours, PageSolve };
export { formatOklch, isColour, oklchHex, parseColour, reachableChroma, solvePage };

export function colourDeclarations(colours: Colours, options: BrandOptions = {}): Record<string, string> {
  return colourDeclarationsWith(DERIVED, colours, options);
}

export function colourCss(colours: Colours, options: BrandOptions & { selector?: string } = {}): string {
  return colourCssWith(DERIVED, colours, options);
}

/** What each page pick solved to, per mode given. */
export function pageInfo(page: PageColours): Partial<Record<Mode, PageSolve>> {
  return Object.fromEntries((["light", "dark"] as const).filter(m => page[m] !== undefined).map(m => [m, solvePage(m, parseColour(page[m]!))]));
}
