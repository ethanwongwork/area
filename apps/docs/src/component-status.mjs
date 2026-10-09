/** Owner-confirmed completion registry.
 * A historical audit or passing build does not imply acceptance. New or refined
 * families stay in review until the owner accepts them. Compound parts follow their
 * parent family.
 */
// Re-confirmed 2026-10-02 after the compact evidence audit (PR 37): menu, nav, tree-view,
// command-palette, combobox, tooltip, dialog, code-block, panel, color-picker, checkbox, radio,
// chip, badge-group, box-field and tabs keep Complete (docs/research/compact-evidence-2026-10-02/).
export const COMPLETE_COMPONENTS = new Set([
  // Approved 2026-09-27 after all phases (batches 1-3).
  'toolbar', 'split-button', 'segmented', 'nav', 'toast',
  // Approved 2026-09-28 (batch 4).
  'count',
  // Approved 2026-09-28 (batch 5).
  'avatar', 'indicator', // badge was already approved
  // Approved 2026-09-28 (batch 6; progress was already approved).
  'skeleton', 'spinner',
  // Approved 2026-09-28 (batch 7; popover was already approved).
  'calendar',
  // Approved 2026-09-28 (batch 8; number-field and box-field were already approved).
  // Approved 2026-09-28 (batch 11: 6px keycap everywhere, no stroke, plain menu shortcuts).
  'kbd',
  // Approved 2026-09-28 (batch 12; input-group was already approved).
  'input', 'textarea',
  // Approved 2026-09-28 (batch 14: cards, sm removed, lighter Switch off track).
  'checkbox', 'radio', 'switch',
  // Approved 2026-09-28 (batch 13; select and field were already approved).
  // Approved 2026-09-28 (batch 15: group gap 6 / 8; slider was already approved).
  'badge-group',
  // Approved 2026-09-28 (batches 17-19; dialog, tooltip and composer were already approved).
  'hover-card', 'context-menu', 'message', 'prompt-suggestions',
  // Approved 2026-09-28 (batch 16 again after the 16 column; batch 20).
  'model-picker', 'scroll-to-latest',
  // Approved 2026-09-28 (batch 22: lighter ground, brighter syntax; code and separator were already approved).
  'code-block',
  'badge', 'box-field', 'breadcrumb',
  'button', 'button-group', 'code',
  'color-field', 'color-picker', 'color-swatch', 'color-swatch-picker', 'composer',
  'dialog', 'field', 'input-group',
  'number-field', 'popover', 'progress', 'property-list', 'select', 'separator', 'slider',
  'table', 'tabs', 'tooltip', 'tree-view',
  // Approved 2026-10-08 on the component review page (recommendations for open questions accepted).
  'accordion', 'alignment-picker', 'tag',
  // Approved 2026-10-08 after their requested changes.
  'confirm-dialog', 'date-picker', ]);

/** Built/refined and awaiting owner approval; not completion. */
// alignment-picker reopened 2026-10-04: responsive grid, hover preview, sizes removed.
// pagination: new 2026-10-08 (owner picked it as the next component); link: new 2026-10-08 ("move on to the next component");
// alert, card and chip reopened 2026-10-08: their always-on underlines moved to Link's line (link.md).
// menu, combobox, custom-select, tag-picker, command-palette, drawer and panel reopened 2026-10-09: their scroll
// containers are Scroll areas (scroll-area.md, "Adoption").
export const REVIEW_COMPONENTS = new Set(['pagination', 'link', 'scroll-area', 'file-upload', 'alert', 'card', 'chip', 'menu', 'combobox', 'custom-select', 'tag-picker', 'command-palette', 'drawer', 'panel']);
export const componentStatus = slug => COMPLETE_COMPONENTS.has(slug) ? 'complete' : REVIEW_COMPONENTS.has(slug) ? 'review' : 'unrefined';
export const statusLabel = status => ({ complete: 'Complete', review: 'In review', unrefined: 'Unrefined' })[status];

/**
 * Approval batches (owner, 2026-09-27): "reorganize the components in phases that I can approve
 * once they have gone through all phases … in batches so I can focus on approving 2-3 components
 * at once. Once they are completely finished, mark them as officially complete and move them to
 * the bottom."
 *
 * Every family moves through the same phases, read from the repository by the gallery build:
 *   1. Audit: an audited spec (docs/specs/<slug>.md, covered by the cohesion audit).
 *   2. Visual pass: the spec's "Visual pass" section.
 *   3. Claude in Chrome: target-product captures, compared side by side (an entry in
 *      pass-status.mjs; captures without the side-by-side count as half done).
 *   4. Owner approval: the family is in COMPLETE_COMPONENTS.
 * Officially complete = all four. The gallery leads with the first batch that is not officially
 * complete, then the batches after it in order; officially complete families sink to the bottom.
 * A family approved before the phases existed keeps its approval but stays in its batch until
 * phases 1-3 are done.
 */
export const APPROVAL_BATCHES = [
  { name: 'Toolbar controls', families: ['toolbar', 'split-button', 'segmented'] },
  { name: 'Navigation lists', families: ['nav', 'menu', 'tree-view'] },
  { name: 'Status messages', families: ['toast'] },
  { name: 'Counts and banners', families: ['count', 'alert'] },
  { name: 'Identity and status marks', families: ['avatar', 'indicator', 'badge'] },
  { name: 'Loading', families: ['spinner', 'skeleton', 'progress'] },
  { name: 'Date and floating surface', families: ['calendar', 'popover'] },
  { name: 'Inspector fields', families: ['panel', 'number-field', 'box-field'] },
  { name: 'Fills', families: ['property-list', 'color-field', 'color-swatch'] },
  { name: 'Pickers', families: ['color-swatch-picker', 'color-picker', 'alignment-picker'] },
  { name: 'Buttons', families: ['button', 'button-group', 'kbd'] },
  { name: 'Text entry', families: ['input', 'input-group', 'textarea'] },
  { name: 'Choosing from a list', families: ['select', 'combobox', 'custom-select', 'tag', 'tag-picker', 'date-picker', 'field'] },
  { name: 'Choice controls', families: ['checkbox', 'radio', 'switch'] },
  { name: 'Values and tags', families: ['slider', 'chip', 'badge-group'] },
  { name: 'Content surfaces', families: ['card', 'table'] },
  { name: 'Overlays', families: ['dialog', 'confirm-dialog', 'drawer', 'tooltip', 'hover-card'] },
  { name: 'Command surfaces', families: ['context-menu', 'command-palette'] },
  { name: 'Conversation', families: ['message', 'composer', 'prompt-suggestions'] },
  { name: 'Conversation controls', families: ['model-picker', 'scroll-to-latest'] },
  { name: 'Page navigation', families: ['tabs', 'breadcrumb', 'pagination', 'link'] },
  { name: 'Scrolling', families: ['scroll-area'] },
  { name: 'Uploading', families: ['file-upload'] },
  { name: 'Code and rules', families: ['code', 'code-block', 'separator'] },
  { name: 'Accordion', families: ['accordion'] },
];
export const batchOf = slug => APPROVAL_BATCHES.findIndex(batch => batch.families.includes(slug));

/*
 * The Review page (review.html, owner 2026-10-04: "each new component as a dedicated preview to
 * scale for me to look at and approve ... in batches"). Each batch shows its families' specimens
 * at 1:1. `planned` lists components approved for building that have no family yet; each turns into
 * a family entry when it is built. Approval is still the owner's word, recorded in
 * COMPLETE_COMPONENTS.
 */
export const REVIEW_BATCHES = [
  {
    name: 'New: Pagination, Link, Scroll area and File upload',
    note: 'Built 2026-10-08 and 09: the two navigation gaps eight catalogues share, the overlay scrollbar and the drop zone with upload rows. Batch 1, Accordion and Alignment picker were approved on 2026-10-08.',
    families: ['pagination', 'link', 'scroll-area', 'file-upload'],
  },
  {
    name: "Link's underline in peers",
    note: "Reopened 2026-10-08: Alert's link, Card's action and Chip's link label draw Link's line (40% of the ink at rest, full on hover and focus).",
    families: ['alert', 'card', 'chip'],
  },
  {
    name: 'Scroll area in scrolling surfaces',
    note: "Reopened 2026-10-09: menus, the three list pickers, Command palette, Drawer and Panel scroll with Scroll area's overlay bar; rows keep their place.",
    families: ['menu', 'combobox', 'custom-select', 'tag-picker', 'command-palette', 'drawer', 'panel'],
  },
];

// Most recently designed first. Move a family to the front when its design is worked on.
export const RECENT_COMPONENTS = ['file-upload', 'scroll-area', 'link', 'pagination', 'tag', 'drawer', 'confirm-dialog', 'date-picker', 'tag-picker', 'custom-select', 'accordion', 'badge-group', 'card', 'checkbox', 'radio', 'dialog', 'count', 'alert', 'toolbar', 'switch', 'code-block', 'chip', 'table', 'model-picker', 'scroll-to-latest', 'message', 'prompt-suggestions', 'hover-card', 'context-menu', 'command-palette', 'combobox', 'panel', 'composer', 'box-field', 'property-list', 'number-field', 'toast', 'popover', 'menu', 'split-button', 'button-group', 'button', 'tree-view', 'breadcrumb', 'tooltip', 'badge', 'indicator', 'icon-pilot', 'color-picker', 'color-swatch-picker', 'color-field', 'color-swatch', 'alignment-picker', 'input-group', 'avatar', 'input', 'nav', 'progress', 'segmented', 'select', 'skeleton', 'spinner', 'calendar'];
