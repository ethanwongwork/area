/** Owner-confirmed completion registry.
 * A historical audit or passing build does not imply acceptance. New or refined
 * families stay in review until the owner accepts them. Compound parts follow their
 * parent family.
 */
export const COMPLETE_COMPONENTS = new Set([
  // Approved 2026-09-27 after all phases (batches 1-3).
  'toolbar', 'split-button', 'segmented', 'nav', 'menu', 'toast',
  // Approved 2026-09-28 (batch 4).
  'count', 'alert',
  // Approved 2026-09-28 (batch 5).
  'avatar', 'indicator', // badge was already approved
  // Approved 2026-09-28 (batch 6; progress was already approved).
  'skeleton', 'spinner',
  'alignment-picker', 'badge', 'badge-group', 'box-field', 'breadcrumb',
  'button', 'button-group', 'checkbox', 'code',
  'color-field', 'color-picker', 'color-swatch', 'color-swatch-picker', 'composer',
  'dialog', 'field', 'input', 'input-group', 'kbd',
  'number-field', 'popover', 'progress', 'property-list', 'radio', 'select', 'separator', 'slider', 'switch',
  'table', 'tabs', 'textarea', 'tooltip', 'tree-view',
]);

/** Built/refined and awaiting owner approval; not completion. */
export const REVIEW_COMPONENTS = new Set([
  // Changed 2026-09-27 after owner feedback (dividers, indicator, loaders).
  'code-block',
  // Rebuilt after approval (layouts, sizes, linked cards, templates): docs/specs/card.md.
  'card',
  // Built on the cohesion-audit branch (docs/specs/calendar.md); never reviewed.
  'calendar',
  // Changed 2026-09-28: avatar initials size in the chip (docs/specs/chip.md).
  'chip',
  'model-picker', 'scroll-to-latest', 'message', 'prompt-suggestions', 'hover-card', 'context-menu', 'command-palette', 'combobox', 'panel']);
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
  { name: 'Choosing from a list', families: ['select', 'combobox', 'field'] },
  { name: 'Choice controls', families: ['checkbox', 'radio', 'switch'] },
  { name: 'Values and tags', families: ['slider', 'chip', 'badge-group'] },
  { name: 'Content surfaces', families: ['card', 'table'] },
  { name: 'Overlays', families: ['dialog', 'tooltip', 'hover-card'] },
  { name: 'Command surfaces', families: ['context-menu', 'command-palette'] },
  { name: 'Conversation', families: ['message', 'composer', 'prompt-suggestions'] },
  { name: 'Conversation controls', families: ['model-picker', 'scroll-to-latest'] },
  { name: 'Page navigation', families: ['tabs', 'breadcrumb'] },
  { name: 'Code and rules', families: ['code', 'code-block', 'separator'] },
];
export const batchOf = slug => APPROVAL_BATCHES.findIndex(batch => batch.families.includes(slug));

// Most recently designed first. Move a family to the front when its design is worked on.
export const RECENT_COMPONENTS = ['count', 'alert', 'toolbar', 'card', 'switch', 'checkbox', 'radio', 'code-block', 'chip', 'table', 'model-picker', 'scroll-to-latest', 'message', 'prompt-suggestions', 'hover-card', 'context-menu', 'command-palette', 'combobox', 'panel', 'composer', 'box-field', 'property-list', 'number-field', 'toast', 'dialog', 'popover', 'menu', 'split-button', 'button-group', 'button', 'tree-view', 'breadcrumb', 'tooltip', 'badge-group', 'badge', 'indicator', 'icon-pilot', 'color-picker', 'color-swatch-picker', 'color-field', 'color-swatch', 'alignment-picker', 'input-group', 'avatar', 'input', 'nav', 'progress', 'segmented', 'select', 'skeleton', 'spinner', 'calendar'];
