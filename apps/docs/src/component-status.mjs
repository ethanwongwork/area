/** Owner-confirmed completion, 2026-09-21.
 * A historical audit or passing build does not imply acceptance.
 * Every other family remains unrefined until its implementation is verified
 * and the owner confirms the result. Compound parts follow their parent family.
 */
export const COMPLETE_COMPONENTS = new Set(['badge', 'button', 'checkbox', 'field', 'input', 'slider', 'card', 'avatar', 'alert', 'chip']);

// Most recently designed first. Move a family to the front when its design is worked on.
export const RECENT_COMPONENTS = ['card', 'avatar', 'alert', 'chip'];
