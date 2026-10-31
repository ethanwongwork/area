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
 *   prose leading           text that runs past two lines (a chat reply, documentation): the first value on the 2px
 *                           leading ramp at or above 1.5 × the size, WCAG 1.4.8's line spacing (owner, 2026-10-30;
 *                           docs/research/vertical-rhythm-2026-10-30): 12/18, 13/20, 14/22, 15/24, 16/24. Its paragraph
 *                           gap is about two-thirds of that line on the spacing ramp: 12, 16 or 20. UI text keeps LEADING
 *   tracking                small text loosens a hair (Geist is drawn for 0 at UI sizes and has no
 *                           optical-size axis): 10 +0.01em, 11 +0.0075, 12 +0.005, 13 +0.0025
 *   icon stroke             follows the text stem, 1.125px at 14
 *   check box / toggle      4 inside the UI line (never under 14); a toggle 4 taller than that
 *   icons                   the 16 slot, the 20 slot from 15 (owner, 2026-10-29: at 15 a 16 icon read 1.06× the cap
 *                           height, under the 1.15–1.35 every other row and Cursor sit at); a default-size icon in the
 *                           20 slot draws the size curve's line, the token line × type-icon-line (0.8846, as a
 *                           size={20} icon), not the 16px drawing scaled whole (1.51px at 15, 1.61 at 16 before)
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
/** Prose leading for a size: the first 2px step at or above 1.5 × the size (WCAG 1.4.8). */
export const proseLeading = (px: number) => Math.ceil((px * 1.5) / 2) * 2;
/** A prose paragraph gap: the spacing-ramp step nearest two-thirds of its prose line (13.3 → 12, 16 → 16, 18.7 → 20). */
export const proseGap = (px: number) => {
  const target = (proseLeading(px) * 2) / 3;
  return [12, 16, 20].reduce((best, step) => Math.abs(step - target) < Math.abs(best - target) ? step : best);
};

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
    "text-sm-prose-leading": `var(--area-leading-${proseLeading(base)})`, "text-sm-prose-gap": `var(--area-space-${proseGap(base)})`,
    "text-md-prose-leading": `var(--area-leading-${proseLeading(reading)})`, "text-md-prose-gap": `var(--area-space-${proseGap(reading)})`,
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
    "type-icon": `${base >= 15 ? 20 : 16}px`,
    // The line ratio for an icon drawn at its default size in the icon slot: 1 in the 16 slot, the size curve's
    // (20 / 16)^-0.55 in the 20 slot. Icons with an explicit size, the xs slot and other strokes keep the token line.
    "type-icon-line": base >= 15 ? "0.8846" : "1",
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
  defaultPreset: "13",
  namespaces: ["--area-font-", "--area-text-", "--area-title-", "--area-display-", "--area-weight-", "--area-type-"],
  presets: TYPE_SIZES.map(base => ({
    id: String(base),
    label: String(base),
    description: `${base}px interface text, ${Math.max(10, base - 2)}px small text, ${base + 2}px reading text.`,
    tokens: tokens(typeSizeTokens(base)),
  })),
};
