/** Validated design passes, shown in every family's Pass review in the gallery.
 *
 * A family is Validated when all three steps are done and recorded:
 *   1. Audit: the family was checked against the shared rules (`docs/research/cohesion-audit.md`,
 *      the `area-component-build` process) and has a spec in `docs/specs/<slug>.md`.
 *   2. Visual pass: the spec's "Visual pass" section records the `area-visual-language` pass.
 *   3. Claude in Chrome: the target product was measured live in Claude in Chrome and the
 *      captures are committed in `docs/research/captures/<slug>/`; the visual pass compared the
 *      two side by side there.
 * The gallery build reads the spec and captures for every family and shows what exists; an entry
 * here is the claim that step 3's side-by-side happened. The build fails when an entry's spec or
 * captures are missing. Validation is not owner acceptance (`component-status.mjs`).
 */
export const VALIDATED_PASSES = {
  toolbar: {
    date: "2026-09-27",
    against: "Figma toolbelt, re-checked after the Segmented and split-tool change (tools, chevrons, divider, mode switch)",
  },
  "split-button": {
    date: "2026-09-27",
    against: "Figma's toolbelt tool groups (tool and chevron plates, hover, selected)",
  },
  nav: {
    date: "2026-09-27",
    against: "ChatGPT's and Notion's sidebars (sections, labels, rows, current plate)",
  },
  menu: {
    date: "2026-09-27",
    against: "Notion's page menu (icons, shortcuts, rules, danger row, lift)",
  },
  "tree-view": {
    date: "2026-09-27",
    against: "Notion's sidebar tree (rows, hover, row actions)",
  },
  alert: {
    date: "2026-09-28",
    against: "Notion's callout block (fill, edge, icon on the first line); banner layout against OpenAI's Daybreak banner (height, corner, 16 inset, end link)",
  },
  avatar: {
    date: "2026-09-28",
    against: "Figma's file-browser avatars and Notion's person and workspace avatars (size, shape, fill, initial)",
  },
  indicator: {
    date: "2026-09-28",
    against: "Figma's notification bell dot and Notion's help-button activity dot (size, cutout, placement)",
  },
  badge: {
    date: "2026-09-28",
    against: "Figma's AI label and Notion's select tags",
  },
  skeleton: {
    date: "2026-09-28",
    against: "ChatGPT's results shimmer, Figma's tab shimmer and Notion's startup placeholders (fill, band, speed, shape)",
  },
  spinner: {
    date: "2026-09-28",
    against: "ChatGPT's conversation spinner (ring, track, sizes, speed)",
  },
  progress: {
    date: "2026-09-28",
    against: "Figma's AI-credits usage meter (height, shape, track, neutral fill)",
  },
  calendar: {
    date: "2026-09-28",
    against: "Notion's search Date filter calendar (surface, month label, cells, weeks, today, outside days)",
  },
  popover: {
    date: "2026-09-28",
    against: "Notion's Share popover (surface, ring, lift, corner)",
  },
  count: {
    date: "2026-09-28",
    against: "Notion's board group counts (neutral and tinted groups: size, gutter, ink, place after the label)",
  },
  toast: {
    date: "2026-09-27",
    against: "Notion's Link copied toast (shape, icon, action; Notion's is inverse)",
  },
  segmented: {
    date: "2026-09-27",
    against: "ChatGPT's Chat / Work switch and Figma's mode switch",
  },
  panel: {
    date: "2026-09-28",
    against: "Figma's Design panel (section header, label and field rows, rules, row action column)",
  },
  "number-field": {
    date: "2026-09-28",
    against: "Figma's Design panel fields (X / Y letters, W / H with a menu, Rotation, Gap)",
  },
  "box-field": {
    date: "2026-09-28",
    against: "Figma's Padding and Corner radius rows (paired fields, per-side toggle on the action column)",
  },
  "property-list": {
    date: "2026-09-28",
    against: "Figma's Fill and Effects rows (hex and opacity, effect type, row actions); owner screenshots",
  },
  "color-field": {
    date: "2026-09-28",
    against: "Figma's Page colour row (hex, opacity anchored with % at the end)",
  },
  "color-swatch": {
    date: "2026-09-28",
    against: "The swatch in Figma's Page colour row (leading slot, hairline edge)",
  },
  "color-picker": {
    date: "2026-09-28",
    against: "Figma's colour picker from the Page colour row (area, tracks, value row, swatches)",
  },
  "color-swatch-picker": {
    date: "2026-09-28",
    against: "Figma's On this page swatch grid (chit size, cell, corner, light-chit edge)",
  },
  "alignment-picker": {
    date: "2026-09-28",
    against: "Figma's auto-layout Alignment grid (ground, dots, selected bars)",
  },
};
