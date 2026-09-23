/** Owner-confirmed completion, 2026-09-22.
 * Every family that ships today is owner-confirmed complete; a historical audit or a
 * passing build still does not imply acceptance on its own. Reopen a family as in review
 * when it is refined again, and return it to complete only after the owner accepts it
 * once more. Compound parts follow their parent family.
 */
export const COMPLETE_COMPONENTS = new Set([
  'alert', 'avatar', 'badge', 'button', 'card', 'checkbox', 'chip', 'code',
  'code-block', 'dialog', 'field', 'input', 'kbd', 'menu', 'nav', 'panel',
  'popover', 'progress', 'radio', 'segmented', 'select', 'separator', 'skeleton',
  'slider', 'spinner', 'switch', 'table', 'tabs', 'textarea', 'toast', 'tooltip',
]);

/** Built/refined and awaiting owner approval; not completion. */
export const REVIEW_COMPONENTS = new Set([]);
export const componentStatus = slug => COMPLETE_COMPONENTS.has(slug) ? 'complete' : REVIEW_COMPONENTS.has(slug) ? 'review' : 'unrefined';
export const statusLabel = status => ({ complete: 'Complete', review: 'In review', unrefined: 'Unrefined' })[status];

// Most recently designed first. Move a family to the front when its design is worked on.
export const RECENT_COMPONENTS = ['card', 'avatar', 'alert', 'chip'];
