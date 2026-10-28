/**
 * Exact colours as CSS custom properties (2026-10-27; plan https://claude.ai/artifact/K4rswTACDiMB31nd4nzWz2), the way
 * emit/brand.ts writes a brand: the pages' inputs (color/colours.ts), which the stylesheet's `[data-area-colours]` rule
 * re-derives from (emit/css.ts), and the accent through the brand engine with the derivations it restates (`derived`).
 *
 *   colourDeclarationsWith  `--area-*` name to value, for an inline style (React `Theme`'s `colours`) or a rule
 *   colourCssWith           the same as a rule, `[data-area-colours]` by default, in the axes layer
 */
import { type BrandOptions, brandDeclarationsWith } from "./brand.ts";
import { type ColourInput, type PageColours, formatOklch, oklchHex, pageDeclarations, parseColour, solvePage } from "../color/colours.ts";

export interface Colours {
  /** The page in light and in dark, each any colour; a mode left out keeps its settings. */
  page?: PageColours;
  /** The accent: one colour for both modes (dark is solved from it). */
  accent?: ColourInput;
}

/** The accent as the brand engine takes it: a hex, the nearest one in sRGB for an OKLCH colour. */
export const accentHex = (accent: ColourInput) =>
  typeof accent === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(accent.trim()) ? accent.trim().toLowerCase() : oklchHex(parseColour(accent));

/** The declarations for picked colours: the accent's (with the derivations it restates), then the pages'. */
export function colourDeclarationsWith(derived: Readonly<Record<string, string>>, colours: Colours, options: BrandOptions = {}): Record<string, string> {
  return {
    ...(colours.accent !== undefined ? brandDeclarationsWith(derived, { primary: accentHex(colours.accent) }, options) : {}),
    ...(colours.page ? pageDeclarations(colours.page) : {}),
  };
}

/** The declarations as one rule in the axes layer, after the axes' own, so the picks win over presets on the same element. */
export function colourCssWith(derived: Readonly<Record<string, string>>, colours: Colours, options: BrandOptions & { selector?: string } = {}): string {
  const body = Object.entries(colourDeclarationsWith(derived, colours, options)).map(([name, value]) => `    ${name}: ${value};`).join("\n");
  const named = [
    ...(["light", "dark"] as const).filter(m => colours.page?.[m] !== undefined).map(m => `${m} page ${formatOklch(solvePage(m, parseColour(colours.page![m]!)).painted)}`),
    ...(colours.accent !== undefined ? [`accent ${accentHex(colours.accent)}`] : []),
  ];
  return `/* Area colours: ${named.join(", ")} */\n@layer area.axes {\n  ${options.selector ?? "[data-area-colours]"} {\n${body}\n  }\n}\n`;
}
