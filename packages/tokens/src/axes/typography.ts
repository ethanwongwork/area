/**
 * Typography: families, the size ramp, and three weights in one table (plan A9.5, 2026-11-11; DESIGN_SYSTEM.md, "Ink and
 * weight", where the table lives, and the area-type-usage skill quote it):
 *
 *   400 regular   everything read or operated: running text, descriptions, field labels, rows, a setting's, a choice's
 *                 or a step's name, a label beside its value, a bar's name, a figure. Its own setting, Regular weight
 *                 (axes/regular-weight.ts, plan A9.6): 400 by default, up to 470
 *   500 strong    a surface's or a region's title and `title-xs` headings; a label over a run of rows (muted); an item's
 *                 name on a picture or file card; labels on fills and marks (Buttons on every variant, Segmented, Badge,
 *                 Kbd, Citation, Indicator, Avatar initials); the selected Tab
 *   600 heading   titles from `title-sm` up: a page's own title (Page header md and lg), a document's title and headings
 *
 * Three decisions shape this ramp.
 *
 * **Weight is orthogonal to role.** A role sets size, leading and tracking; it does not
 * set weight. That is what makes large text at a regular weight possible -- a 20px
 * paragraph rather than a 20px heading -- which a ramp with weight baked into the role
 * cannot express at all.
 *
 * **Two weights in interface text, a third for page titles.** Regular and strong carry every row, label and
 * control. Heading (600) was added on 2026-11-11 for titles from title-sm up, where strong sat too close to body text
 * for a page to read as a level (plan A9.1).
 *
 * **Strong is deliberately soft.** 500, not 600 and not Geist's own 550. The two-weight
 * rule exists to make the step between regular and strong *small*, and at UI sizes 550
 * against 400 is already most of the way to a semibold -- which is the contrast the rule
 * was written to avoid. 500 is also the one weight every platform font ships, so the
 * variable and non-variable presets no longer disagree about what strong means.
 *
 * Geist has a single weight axis and no optical-size axis, so tracking is built by hand.
 * When a face carries optical sizing the font already adjusts its own spacing and manual
 * tracking double-corrects; that is why Apple's SF Pro table reverses direction above
 * 20pt and must not be copied onto a face like this one.
 *
 * Names are relative (xs..xl) rather than pixel values, unlike spacing and radius. The
 * type size axis rescales the whole ramp, so `--area-text-14` would become a lie the moment
 * someone chose another size. Spacing does not rescale, so there the pixel value is the
 * honest name.
 *
 * The roles at each size (12 to 16) live in axes/type-size.ts (owner, 2026-10-12); this file
 * keeps the faces and weights every size shares. Display tracking stops at -0.03em: Inter's
 * dynamic-metrics curve asymptotes at -0.0223em, so anything past about -0.03em is style, not
 * optical correction, and openai.com ships exactly -0.03em at 64px.
 */
/**
 * Geist is self-hosted from jsDelivr rather than Google Fonts. The Google build is subset
 * to 288 glyphs with every stylistic set stripped, including `ss11` -- the one
 * vercel.com itself enables.
 */
export const GEIST_TOKENS = {
  "font-sans": `"Geist", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
  "font-mono": `"Geist Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace`,
  "font-feature-settings": `"rlig" 1, "calt" 0, "ss11" 1`,
  /* Regular is its own setting (axes/regular-weight.ts, plan A9.6): `--area-weight-regular`, 400 by default. */
  /** Geist's own emphasis weight, as shipped by Vercel. Needs the variable font. */
  "weight-strong": "var(--area-wght-500)",
  /**
   * A heading that has to hold a page or a long reply together: a document's title and its headings, where strong (500)
   * sits too close to body text to read as a level (the four product screens, docs/research/product-recreations-2026-11-10).
   * Document and chat products draw these at 600 to 700; one step, 600, so interface labels keep strong.
   */
  "weight-heading": "var(--area-wght-600)",
  /** Line weight of Area-drawn icons, matched to this face's 14px regular stem (docs/specs/icons.md). */
  "weight-icon": "1.125px",
};
