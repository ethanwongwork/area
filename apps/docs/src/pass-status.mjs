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
  disclosure: {
    date: "2026-10-02",
    against: "Notion's toggle block (row, chevron square, title column, hover plate); divided against shadcn's accordion source",
  },
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
  button: {
    date: "2026-09-28",
    against: "Figma's Share (32, corner 5, 12 inset), Notion's Share popover buttons and ChatGPT's solid and outline pills (height, inset, weight, no shadow)",
  },
  "button-group": {
    date: "2026-09-28",
    against: "Figma's Present / Prototype view pair (outer corners only, square inner edges) and Notion's split divider",
  },
  kbd: {
    date: "2026-09-28",
    against: "Notion's search ⌘K hint, ChatGPT's tooltip chip and Figma's keyboard-shortcuts panel keys (fill, edge, corner, nesting)",
  },
  input: {
    date: "2026-09-28",
    against: "Notion's sidebar search field (with its ⌘K hint) and Share invite field, Figma's file-browser search (height, corner, edge, fill, text inset)",
  },
  "input-group": {
    date: "2026-09-28",
    against: "Notion's Share invite row (field and button) and Figma's design-panel icon and colour fields",
  },
  textarea: {
    date: "2026-09-28",
    against: "ChatGPT's settings multiline fields (insets, corner, edge, no shadow)",
  },
  select: {
    date: "2026-09-28",
    against: "ChatGPT's settings dropdown (read live), Figma's zoom, size and filter selects, Notion's inline select (height, fill, edge, chevron place)",
  },
  combobox: {
    date: "2026-09-28",
    against: "Figma's font-family trigger, font-size combobox and open font picker (row, text, chevron place)",
  },
  field: {
    date: "2026-09-28",
    against: "ChatGPT's settings row (read live) and stacked field (label, description, gaps)",
  },
  checkbox: {
    date: "2026-09-28",
    against: "Notion's and Figma's 16px checkboxes (size, corner, edge, checked face, label alignment)",
  },
  radio: {
    date: "2026-09-28",
    against: "No product radio exists; ChatGPT's mode radio cards and Checkbox's product evidence (control, label alignment)",
  },
  switch: {
    date: "2026-09-28",
    against: "ChatGPT's settings switches off and on, rest and hover, and Notion's page-menu toggle (track, thumb, off fill)",
  },
  slider: {
    date: "2026-09-28",
    against: "Figma's colour-picker sliders (reopened) and adjustment slider (rail, thumb, hit row)",
  },
  chip: {
    date: "2026-09-28",
    against: "ChatGPT's composer tool pill (rest, hover) and Notion's select tags (shape, height, paint)",
  },
  card: {
    date: "2026-09-27",
    against: "Notion board cards, ChatGPT library cards and Figma file and community cards, light and dark (consistency pass)",
  },
  table: {
    date: "2026-09-28",
    against: "Notion's table view (row height, rules, header ink, cells)",
  },
  "badge-group": {
    date: "2026-09-28",
    against: "Notion's multi-select table cells on a public page (tag geometry, gap between tags and between wrapped lines)",
  },
  "hover-card": {
    date: "2026-09-28",
    against: "Notion's sub-page link preview, live (surface, corner, ring, lift, type), and the web link preview on file",
  },
  "context-menu": {
    date: "2026-09-28",
    against: "Notion's sidebar page menu, right-click, live (position, lift, rows, icons, type, shortcuts)",
  },
  "command-palette": {
    date: "2026-09-28",
    against: "Notion's search and ChatGPT's search-chats palettes, live via cmd+K (surface, field, headings, rows, highlight)",
  },
  message: {
    date: "2026-09-28",
    against: "ChatGPT's conversation, live (user bubble rest and hover actions, prose, assistant actions)",
  },
  composer: {
    date: "2026-09-28",
    against: "ChatGPT's home composer, live (size, corner, ring and lift, text)",
  },
  "prompt-suggestions": {
    date: "2026-09-28",
    against: "ChatGPT's home suggestions, live (rows, offset, hover wash, ink, dismiss)",
  },
  "model-picker": {
    date: "2026-09-28",
    against: "ChatGPT's composer model picker, live (trigger, menu surface, rows with notes, check)",
  },
  "scroll-to-latest": {
    date: "2026-09-28",
    against: "ChatGPT's scroll-to-bottom button, live (size, ring, fill, glyph, position, hover)",
  },
  tabs: {
    date: "2026-09-28",
    against: "Notion's database view tabs, live (size, corner, type, selected and hover wash, ink)",
  },
  breadcrumb: {
    date: "2026-09-28",
    against: "Notion's topbar page path, live (items, type, separator, hover plate)",
  },
  code: {
    date: "2026-09-28",
    against: "ChatGPT's inline code in a conversation, live (size, fill, corner, inset)",
  },
  "code-block": {
    date: "2026-09-28",
    against: "ChatGPT's code block in a conversation, live (shell, header, buttons, code type)",
  },
  separator: {
    date: "2026-09-28",
    against: "Notion's page-menu rules, live, and ChatGPT's settings dividers on file (weight, ink, inset)",
  },
  dialog: {
    date: "2026-09-28",
    against: "ChatGPT's keyboard-shortcuts dialog, live (width, corner, lift, title, close rest and hover, footer button inset)",
  },
  tooltip: {
    date: "2026-09-28",
    against: "ChatGPT's sidebar-toggle tooltip with its shortcut, live (height, corner, type, fill, inline keycap); unchanged since 2026-09-25",
  },
};
