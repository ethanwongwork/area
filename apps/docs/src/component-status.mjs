/** Owner-confirmed completion registry.
 * A historical audit or passing build does not imply acceptance. New or refined
 * families stay in review until the owner accepts them. Compound parts follow their
 * parent family.
 */
export const COMPLETE_COMPONENTS = new Set([
  'badge', 'badge-group', 'breadcrumb', 'code', 'field', 'kbd', 'panel',
  'separator', 'slider', 'tabs', 'textarea', 'tooltip',
]);

/** Built/refined and awaiting owner approval; not completion. */
export const REVIEW_COMPONENTS = new Set([
  // Reopened by the 2026-09-26 cohesion audit (docs/research/cohesion-audit.md); each has a Pass review.
  'alert', 'avatar', 'button', 'card', 'checkbox', 'chip', 'code-block', 'input', 'menu', 'nav',
  'popover', 'progress', 'radio', 'segmented', 'select', 'skeleton', 'spinner', 'switch', 'table',
  'indicator',
  'calendar', 'color-picker', 'dialog', 'color-swatch-picker', 'color-field', 'color-swatch', 'alignment-picker', 'toolbar', 'button-group', 'input-group', 'number-field', 'toast', 'tree-view', 'composer']);
export const componentStatus = slug => COMPLETE_COMPONENTS.has(slug) ? 'complete' : REVIEW_COMPONENTS.has(slug) ? 'review' : 'unrefined';
export const statusLabel = status => ({ complete: 'Complete', review: 'In review', unrefined: 'Unrefined' })[status];

// Most recently designed first. Move a family to the front when its design is worked on.
export const RECENT_COMPONENTS = ['alert', 'avatar', 'button', 'card', 'checkbox', 'chip', 'code-block', 'input', 'menu', 'nav', 'popover', 'progress', 'radio', 'segmented', 'select', 'skeleton', 'spinner', 'switch', 'table', 'tree-view', 'dialog', 'toast', 'calendar', 'color-picker', 'composer', 'breadcrumb', 'tooltip', 'badge-group', 'badge', 'indicator', 'icon-pilot', 'color-swatch-picker', 'color-field', 'color-swatch', 'alignment-picker', 'toolbar', 'input-group', 'number-field'];
