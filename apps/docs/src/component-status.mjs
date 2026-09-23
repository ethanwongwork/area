/** Owner-confirmed completion registry.
 * A historical audit or passing build does not imply acceptance. New or refined
 * families stay in review until the owner accepts them. Compound parts follow their
 * parent family.
 */
export const COMPLETE_COMPONENTS = new Set([
  'alert', 'avatar', 'badge', 'button', 'card', 'checkbox', 'chip', 'code',
  'code-block', 'dialog', 'field', 'input', 'kbd', 'menu', 'nav', 'panel',
  'popover', 'progress', 'radio', 'segmented', 'select', 'separator', 'skeleton',
  'slider', 'spinner', 'switch', 'table', 'tabs', 'textarea',
]);

/** Built/refined and awaiting owner approval; not completion. */
export const REVIEW_COMPONENTS = new Set(['button-group', 'input-group', 'number-field', 'toast', 'tooltip', 'tree-view', 'composer']);
export const componentStatus = slug => COMPLETE_COMPONENTS.has(slug) ? 'complete' : REVIEW_COMPONENTS.has(slug) ? 'review' : 'unrefined';
export const statusLabel = status => ({ complete: 'Complete', review: 'In review', unrefined: 'Unrefined' })[status];

// Most recently designed first. Move a family to the front when its design is worked on.
export const RECENT_COMPONENTS = ['composer', 'tree-view', 'input-group', 'button-group', 'toast', 'number-field'];
