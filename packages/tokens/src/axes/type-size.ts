/**
 * Type size: the base UI text size, 12 to 16 (owner, 2026-10-12: "the 12 to 16 proposal is
 * something i am interested in"; docs/research/ui-size-scale-2026-10-12.md). One number, every
 * type role and every mark that sits on a text line derived from it, as radius derives every
 * corner from one number. Density (axes/density.ts) is separate: it sets only the room around
 * text, and emit/base.ts derives heights, gaps and insets from both.
 *
 * Products put interface text at 13 (VS Code, Cursor, macOS) or 14 (Notion, ChatGPT, GitHub,
 * Fluent); 14 is the default, today's default UI size. Every value is a whole pixel on a ramp:
 *
 *   UI text (text-sm)       the base, at the default's leading ratio: 12/16 … 16/24
 *   small text (text-xs)    the base less 2, never under 10 (macOS Caption, antd compact, VS Code
 *                           count badges): 10 / 11 / 12 / 13 / 14 (owner, 2026-10-12: 10 at 12)
 *   reading (text-md)       the base plus 2: 14 / 15 / 16 / 17 / 18
 *   surface title (title-xs) the reading size, so Card and Dialog titles stay peers while they
 *                           move with the type (was held at 16, audit H-7, 2026-09-30)
 *   titles and display      in proportion to the base, whole pixels, each role's leading at its ratio at 14 (owner,
 *                           2026-10-19: "should title and display also change?" → yes, so the hierarchy keeps one
 *                           ratio from 12 to 16, as Apple's Dynamic Type scales every style; they were held at 20 / 24 /
 *                           32 with display one rung down below 14): at 12 17 / 21 / 27 and 48 / 62, at 16 23 / 27 / 37
 *                           and 64 / 82; 14 is unchanged
 *   tracking                small text loosens a hair (Geist is drawn for 0 at UI sizes and has no
 *                           optical-size axis): 10 +0.01em, 11 +0.0075, 12 +0.005, 13 +0.0025
 *   icon stroke             follows the text stem, 1.125px at 14
 *   check box / toggle      4 inside the UI line (never under 14); a toggle 4 taller than that
 *   icons                   the 16 cut, the 20 cut at 16
 *
 * The axis also bounds density (`type-level-*`): Compact stops at 14 (at 15 and 16 its spacing
 * is Default's at 14 with larger text) and Comfortable starts at 13 (12px text floats in its
 * boxes). emit/base.ts clamps the density level between the two.
 */
import { type AxisDefinition, tokens } from "./schema.ts";
import { GEIST_TOKENS } from "./typography.ts";

export const TYPE_SIZES = [12, 13, 14, 15, 16] as const;
export type TypeSize = (typeof TYPE_SIZES)[number];

/** Leading for each size: the default's ratio, on the 2px leading ramp. */
export const LEADING: Record<number, number> = { 10: 14, 11: 14, 12: 16, 13: 18, 14: 20, 15: 22, 16: 24, 17: 26, 18: 28 };
const TRACKING: Record<number, string> = { 10: "0.01em", 11: "0.0075em", 12: "0.005em", 13: "0.0025em" };
const tracking = (size: number) => TRACKING[size] ?? "0em";
const size = (px: number) => `var(--area-size-${px})`;
const leading = (px: number) => `var(--area-leading-${LEADING[px]})`;

/** Every value the axis writes for one base size. Exported for the docs' type tables. */
export function typeSizeTokens(base: TypeSize): Record<string, string> {
  const small = Math.max(10, base - 2);
  const reading = base + 2;
  const box = Math.max(14, LEADING[base]! - 4);
  // Titles and display scale with the base: a role's size at 14 times base / 14, whole pixels; its leading keeps the
  // role's ratio at 14 on the 2px leading ramp.
  const scaled = (at14: number, leadingAt14: number) => {
    const px = Math.round((at14 * base) / 14);
    return [px, Math.round((px * leadingAt14) / at14 / 2) * 2] as const;
  };
  const titleSm = scaled(20, 28), titleMd = scaled(24, 32), titleLg = scaled(32, 40);
  const display = { sm: scaled(56, 56), lg: scaled(72, 72) };
  return {
    ...GEIST_TOKENS,
    "weight-icon": `${Number((1.125 * base / 14).toFixed(3))}px`,
    "text-xs-size": size(small), "text-xs-leading": leading(small), "text-xs-tracking": tracking(small),
    "text-sm-size": size(base), "text-sm-leading": leading(base), "text-sm-tracking": tracking(base),
    "text-md-size": size(reading), "text-md-leading": leading(reading), "text-md-tracking": "0em",
    "title-xs-size": size(reading), "title-xs-leading": leading(reading), "title-xs-tracking": "0em",
    "title-sm-size": size(titleSm[0]), "title-sm-leading": `var(--area-leading-${titleSm[1]})`, "title-sm-tracking": "-0.01em",
    "title-md-size": size(titleMd[0]), "title-md-leading": `var(--area-leading-${titleMd[1]})`, "title-md-tracking": "-0.015em",
    "title-lg-size": size(titleLg[0]), "title-lg-leading": `var(--area-leading-${titleLg[1]})`, "title-lg-tracking": "-0.02em",
    "display-sm-size": size(display.sm[0]!), "display-sm-leading": `var(--area-leading-${display.sm[1]})`, "display-sm-tracking": "-0.03em",
    "display-lg-size": size(display.lg[0]!), "display-lg-leading": `var(--area-leading-${display.lg[1]})`, "display-lg-tracking": "-0.03em",
    // The raw numbers emit/base.ts derives heights, marks and spacing from.
    "type-base": String(base),
    "type-leading": `${LEADING[base]}px`,
    "type-small-leading": `${LEADING[small]}px`,
    "type-reading-leading": `${LEADING[reading]}px`,
    "type-icon": `${base >= 16 ? 20 : 16}px`,
    "type-icon-xs": `${base >= 16 ? 16 : 12}px`,
    // 1 where the xs icon slot is 12px, so component glyphs draw their 12px cuts there (docs/specs/icons.md, "12px cuts").
    "type-icon-xs-cut": base >= 16 ? "0" : "1",
    "type-box": `${box}px`,
    "type-level-min": base >= 15 ? "0" : "-1",
    "type-level-max": base <= 12 ? "0" : "1",
  };
}

export const TYPE_AXIS: AxisDefinition = {
  id: "type",
  label: "Type size",
  description: "The base interface text size, 12 to 16; every type role, mark and icon follows it.",
  defaultPreset: "14",
  namespaces: ["--area-font-", "--area-text-", "--area-title-", "--area-display-", "--area-weight-", "--area-type-"],
  presets: TYPE_SIZES.map(base => ({
    id: String(base),
    label: String(base),
    description: `${base}px interface text, ${Math.max(10, base - 2)}px small text, ${base + 2}px reading text.`,
    tokens: tokens(typeSizeTokens(base)),
  })),
};
