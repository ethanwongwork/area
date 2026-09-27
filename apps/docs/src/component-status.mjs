/** Owner-confirmed completion registry.
 * A historical audit or passing build does not imply acceptance. New or refined
 * families stay in review until the owner accepts them. Compound parts follow their
 * parent family.
 */
export const COMPLETE_COMPONENTS = new Set([
  'alert', 'alignment-picker', 'avatar', 'badge', 'badge-group', 'box-field', 'breadcrumb',
  'button', 'button-group', 'checkbox', 'chip', 'code', 'code-block',
  'color-field', 'color-picker', 'color-swatch', 'color-swatch-picker', 'composer',
  'dialog', 'field', 'indicator', 'input', 'input-group', 'kbd', 'menu', 'nav',
  'number-field', 'popover', 'progress', 'property-list', 'radio', 'segmented',
  'select', 'separator', 'skeleton', 'slider', 'spinner', 'split-button', 'switch',
  'table', 'tabs', 'textarea', 'toast', 'toolbar', 'tooltip', 'tree-view',
]);

/** Built/refined and awaiting owner approval; not completion. */
export const REVIEW_COMPONENTS = new Set([
  // Rebuilt after approval (layouts, sizes, linked cards, templates): docs/specs/card.md.
  'card',
  // Built on the cohesion-audit branch (docs/specs/calendar.md); never reviewed.
  'calendar',
  'model-picker', 'scroll-to-latest', 'message', 'prompt-suggestions', 'hover-card', 'context-menu', 'command-palette', 'combobox', 'panel']);
export const componentStatus = slug => COMPLETE_COMPONENTS.has(slug) ? 'complete' : REVIEW_COMPONENTS.has(slug) ? 'review' : 'unrefined';
export const statusLabel = status => ({ complete: 'Complete', review: 'In review', unrefined: 'Unrefined' })[status];

// Most recently designed first. Move a family to the front when its design is worked on.
export const RECENT_COMPONENTS = ['card', 'switch', 'checkbox', 'radio', 'code-block', 'chip', 'table', 'model-picker', 'scroll-to-latest', 'message', 'prompt-suggestions', 'hover-card', 'context-menu', 'command-palette', 'combobox', 'panel', 'composer', 'box-field', 'property-list', 'number-field', 'toast', 'dialog', 'popover', 'menu', 'split-button', 'button-group', 'button', 'tree-view', 'breadcrumb', 'tooltip', 'badge-group', 'badge', 'indicator', 'icon-pilot', 'color-picker', 'color-swatch-picker', 'color-field', 'color-swatch', 'alignment-picker', 'toolbar', 'input-group', 'alert', 'avatar', 'input', 'nav', 'progress', 'segmented', 'select', 'skeleton', 'spinner', 'calendar'];
