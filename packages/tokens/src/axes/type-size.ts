/**
 * Type size: the base UI text size, 12 to 16 (owner, 2026-10-12: "the 12 to 16 proposal is
 * something i am interested in"; docs/research/ui-size-scale-2026-10-12.md). One number, every
 * type role and every mark that sits on a text line derived from it, as radius derives every
 * corner from one number. Density (axes/density.ts) is separate: it sets only the room around
 * text, and emit/base.ts derives heights, gaps and insets from both.
 *
 * Products put interface text at 13 (VS Code, Cursor, macOS) or 14 (Notion, ChatGPT, GitHub,
 * Fluent); 13 is the default (2026-10-26). The small, secondary and UI steps and the titles are Cursor's (owner,
 * 2026-11-02: "make sure the type ramp is updated to match what cursor does"): its `--cursor-font-size-xs / sm / base`
 * 11/14, 12/16, 13/18 and its titles 16, 18, 20 and 26 at its 13 base, read from its bundle
 * (docs/research/type-presentation-2026-11-01). Reading text is Claude's, 15/22 (owner, 2026-11-02, the same day, showing
 * Claude Code's chat beside the feed's 14: "15/22 like Claude"). Each moves with the base, a whole pixel on a ramp:
 *
 *   small (text-xs)         the base less 2, never under 10: badges, counts, keys, axis ticks (Cursor xs): 10 / 11 / 12
 *                           / 13 / 14 (owner, 2026-10-12: 10 at 12)
 *   secondary (text-sm)     the base less 1: a description, metadata, help and hints under the UI line (Cursor sm, the
 *                           size it declares most): 11 / 12 / 13 / 14 / 15
 *   UI (text-base)          the base, at the default's leading ratio: every control, row and label, 12/16 … 16/24 (Cursor
 *                           base). It was `text-sm` until 2026-11-02
 *   reading (text-lg)       the base plus 2 on the UI ratio's line: a chat turn, a document, the feed's copy, 14/20 ·
 *                           15/22 · 16/24 · 17/26 · 18/28 (Claude's prose step, `--cds-font-size-prose--sm` 15 on
 *                           `--cds-leading-prose--sm` 22; Claude Code's chat measured 15 with a 10.5 cap). Its line is
 *                           both its UI and its prose line (1.47 at 13, a hair under WCAG 1.4.8's 1.5, as Claude's). It
 *                           was 14/22 (Cursor's lg) for a day, and `text-md` 15/22 with a 24 prose line before that
 *   titles (title-*)        Cursor's 16 / 18 / 20 / 26 at 13 (a settings or surface title, a dialog's message and a
 *                           reply's heading, a modal title, a document's h1), in proportion to the base, whole pixels,
 *                           each role's leading at its ratio at 13 (owner, 2026-10-19: one ratio from 12 to 16, as Apple's
 *                           Dynamic Type scales every style); they were 15 / 19 / 22 / 30 at 13 until 2026-11-02
 *   page title (title-xl)   2.5 times the base, 32/40 at 13: a document's own title, the one step between the interface
 *                           titles and display (2026-11-11, the four product screens)
 *   display                 in proportion to the base, as before: 52 / 67 at 13
 *   prose leading           secondary and UI text that runs past two lines (a description, documentation): the first
 *                           value on the 2px leading ramp at or above 1.5 × the size, WCAG 1.4.8's line spacing (owner,
 *                           2026-10-30; docs/research/vertical-rhythm-2026-10-30): 12/18, 13/20, 14/22, 15/24, 16/24.
 *                           Its paragraph gap is about two-thirds of that line on the spacing ramp: 12, 16 or 20.
 *                           UI text keeps LEADING; reading text's prose line is its own line (above)
 *   tracking                none on the body steps (plan A9.10, 2026-11-11: no tracking below 14; the 0.03 to 0.08px it
 *                           added at 10 to 13 was invisible and applied by few rules); titles and display tighten by
 *                           their own token
 *   code leading            code text's own line, the small step's line plus 2 (11/16 at 13: Code block sm, Diff), on
 *                           the Type axis and never moved by density (plan A9.9)
 *   underline offset        one offset under the text for every underline (Link, Mention, Chip, Code), 0.08em
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
/** Body text carries no tracking at any size (plan A9.10): below 14 Geist is drawn for 0, and 14 to 18 too. */
const tracking = (_size: number) => "0em";
const size = (px: number) => `var(--area-size-${px})`;
const leading = (px: number) => `var(--area-leading-${LEADING[px]})`;
/** Prose leading for a size: the first 2px step at or above 1.5 × the size (WCAG 1.4.8). */
export const proseLeading = (px: number) => Math.ceil((px * 1.5) / 2) * 2;
/** A paragraph gap: the spacing-ramp step nearest two-thirds of a line (13.3 → 12, 16 → 16, 18.7 → 20). */
export const proseGap = (px: number, line = proseLeading(px)) => {
  const target = (line * 2) / 3;
  return [12, 16, 20].reduce((best, step) => Math.abs(step - target) < Math.abs(best - target) ? step : best);
};

/** Every value the axis writes for one base size. Exported for the docs' type tables. */
export function typeSizeTokens(base: TypeSize): Record<string, string> {
  const small = Math.max(10, base - 2);
  const secondary = base - 1;
  const reading = base + 2;
  const box = Math.max(14, LEADING[base]! - 4);
  // Titles and display scale with the base: a role's size at 14 times base / 14, whole pixels; its leading keeps the
  // role's ratio at 14 on the 2px leading ramp.
  const scaled = (at14: number, leadingAt14: number) => {
    const px = Math.round((at14 * base) / 14);
    return [px, Math.round((px * leadingAt14) / at14 / 2) * 2] as const;
  };
  // Titles: Cursor's at its 13 base (16/22, 18/24, 20/28, 26/30; docs/research/type-presentation-2026-11-01), times base / 13.
  const scaled13 = (at13: number, leadingAt13: number) => {
    const px = Math.round((at13 * base) / 13);
    return [px, Math.round((px * leadingAt13) / at13 / 2) * 2] as const;
  };
  const titleXs = scaled13(16, 22), titleSm = scaled13(18, 24), titleMd = scaled13(20, 28), titleLg = scaled13(26, 30);
  // A page's own title: 2.5 times the base, the ratio a document workspace draws its title at over its text (40 over 16),
  // so 32/40 at 13. The step between the largest interface title (26) and display (52).
  // On the size ramp's own steps (it has no 39), so 16 takes 40: 30/38, 32/40, 34/42, 37/46, 40/48.
  const titleXl = ({ 12: [30, 38], 13: [32, 40], 14: [34, 42], 15: [37, 46], 16: [40, 48] } as const)[base];
  const display = { sm: scaled(56, 56), lg: scaled(72, 72) };
  return {
    ...GEIST_TOKENS,
    // One offset under the text for every underline (Link, Mention, Chip, Code, Badge plain, Description list's more).
    "underline-offset": "0.08em",
    "weight-icon": `${Number((1.125 * base / 14).toFixed(3))}px`,
    "text-xs-size": size(small), "text-xs-leading": leading(small), "text-xs-tracking": tracking(small),
    "text-base-size": size(base), "text-base-leading": leading(base), "text-base-tracking": tracking(base),
    "text-sm-size": size(secondary), "text-sm-leading": leading(secondary), "text-sm-tracking": tracking(secondary),
    // Reading text keeps one line, running or not: the UI ratio's (Claude's prose, 15/22 at 13).
    "text-lg-size": size(reading), "text-lg-leading": leading(reading), "text-lg-tracking": tracking(reading),
    // Code text's line: the small step's line plus 2, 11/16 at 13 (plan A9.9). Text, not room, so density never moves it.
    "text-xs-code-leading": `var(--area-leading-${LEADING[small]! + 2})`,
    "text-sm-prose-leading": `var(--area-leading-${proseLeading(secondary)})`,
    "text-base-prose-leading": `var(--area-leading-${proseLeading(base)})`, "text-base-prose-gap": `var(--area-space-${proseGap(base)})`,
    "text-lg-prose-leading": leading(reading), "text-lg-prose-gap": `var(--area-space-${proseGap(reading, LEADING[reading])})`,
    "title-xs-size": size(titleXs[0]), "title-xs-leading": `var(--area-leading-${titleXs[1]})`, "title-xs-tracking": "0em",
    "title-sm-size": size(titleSm[0]), "title-sm-leading": `var(--area-leading-${titleSm[1]})`, "title-sm-tracking": "-0.01em",
    "title-md-size": size(titleMd[0]), "title-md-leading": `var(--area-leading-${titleMd[1]})`, "title-md-tracking": "-0.015em",
    "title-lg-size": size(titleLg[0]), "title-lg-leading": `var(--area-leading-${titleLg[1]})`, "title-lg-tracking": "-0.02em",
    "title-xl-size": size(titleXl[0]), "title-xl-leading": `var(--area-leading-${titleXl[1]})`, "title-xl-tracking": "-0.025em",
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
  namespaces: ["--area-font-", "--area-text-", "--area-title-", "--area-display-", "--area-weight-strong:", "--area-weight-heading:", "--area-weight-icon:", "--area-type-", "--area-underline-offset:"],
  presets: TYPE_SIZES.map(base => ({
    id: String(base),
    label: String(base),
    description: `${base}px interface text, ${base - 1}px secondary, ${Math.max(10, base - 2)}px small text, ${base + 2}px reading text.`,
    tokens: tokens(typeSizeTokens(base)),
  })),
};
