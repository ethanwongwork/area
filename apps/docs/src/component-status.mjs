/** Owner-confirmed completion, 2026-09-21.
 * A historical audit or passing build does not imply acceptance.
 * Refined families awaiting approval are in review; untouched families remain
 * unrefined. Compound parts follow their parent family.
 */
export const COMPLETE_COMPONENTS = new Set(['badge', 'button', 'checkbox', 'field', 'input', 'slider', 'card', 'avatar', 'alert', 'chip']);

/** Built/refined and awaiting owner approval; not completion. */
export const REVIEW_COMPONENTS = new Set(['code', 'code-block', 'dialog', 'kbd', 'tooltip', 'menu', 'nav', 'panel', 'popover', 'separator', 'skeleton', 'progress', 'spinner', 'switch', 'radio', 'select', 'segmented']);
export const componentStatus = slug => COMPLETE_COMPONENTS.has(slug) ? 'complete' : REVIEW_COMPONENTS.has(slug) ? 'review' : 'unrefined';
export const statusLabel = status => ({ complete: 'Complete', review: 'In review', unrefined: 'Unrefined' })[status];

// Most recently designed first. Move a family to the front when its design is worked on.
export const RECENT_COMPONENTS = ['card', 'avatar', 'alert', 'chip'];
