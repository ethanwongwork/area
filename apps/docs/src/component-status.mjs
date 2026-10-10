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
  'popover', 'progress', 'select', 'separator', 'slider',
  'table', 'tabs', 'tooltip', 'tree-view',
  // Approved 2026-10-08 on the component review page (recommendations for open questions accepted).
  'accordion', 'alignment-picker', 'tag',
  // Approved 2026-10-08 after their requested changes.
  'confirm-dialog', 'date-picker',
  // Approved 2026-10-09 on the review page, round 2 (components2).
  'pagination', 'scroll-area', 'toggletip', 'combobox', 'custom-select', 'tag-picker', 'drawer',
  // Approved 2026-10-09 on the review page, round 3 (components3), after the round-2 feedback.
  'link', 'file-upload', 'menu', 'command-palette', 'panel', 'alert', 'card', 'kbd', 'number-field', 'property-list',
  // Approved 2026-10-09 on the review page, round 4 (components4): one underline on link chips.
  'chip',
  // Approved 2026-10-10 on the review page, round 5 (components5).
  'empty-state', 'description-list',
  // Approved 2026-10-10 on the review page, round 6 (components6), after the round-5 rethink.
  'toggle-group', ]);

/** Built/refined and awaiting owner approval; not completion. */
export const REVIEW_COMPONENTS = new Set(['meter']);
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
  { name: 'Contextual help', families: ['toggletip'] },
  { name: 'Empty states', families: ['empty-state'] },
  { name: 'Toggle sets', families: ['toggle-group'] },
  { name: 'Labelled values', families: ['description-list'] },
  { name: 'Measurements', families: ['meter'] },
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
export const REVIEW_BATCHES = [];

// Most recently designed first. Move a family to the front when its design is worked on.
export const RECENT_COMPONENTS = ['meter', 'description-list', 'toggle-group', 'empty-state', 'panel', 'link', 'file-upload', 'menu', 'command-palette', 'toggletip', 'scroll-area', 'pagination', 'tag', 'drawer', 'confirm-dialog', 'date-picker', 'tag-picker', 'custom-select', 'accordion', 'badge-group', 'card', 'checkbox', 'radio', 'dialog', 'count', 'alert', 'toolbar', 'switch', 'code-block', 'chip', 'table', 'model-picker', 'scroll-to-latest', 'message', 'prompt-suggestions', 'hover-card', 'context-menu', 'combobox', 'composer', 'box-field', 'property-list', 'number-field', 'toast', 'popover', 'split-button', 'button-group', 'button', 'tree-view', 'breadcrumb', 'tooltip', 'badge', 'indicator', 'icon-pilot', 'color-picker', 'color-swatch-picker', 'color-field', 'color-swatch', 'alignment-picker', 'input-group', 'avatar', 'input', 'nav', 'progress', 'segmented', 'select', 'skeleton', 'spinner', 'calendar'];
