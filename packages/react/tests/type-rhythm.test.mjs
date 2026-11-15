// Type rhythm (Q-T1, Q-T2; owner 2026-11-04, "Apply both"; docs/PRODUCT_UI.md "Type and rhythm in the kits"): text that
// opens or closes a block is read on its glyphs. A reply trims its first and last text lines (text-box, as Card); a
// component whose first line is a row with an icon (Step, Timeline, plain Plan and Edit summary, Turn notice,
// Timestamp) gives back that line's half-leading at its outer edge, so a section title sits 16 over it as over a frame.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ');
const TRIM = 'calc((1cap - 1lh) / 2)';
const has = (selector, declaration) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[},]) ?${escaped} ?\\{[^}]*${declaration.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(css);
};

test('a reply trims its first and last text lines to the cap and the descent', () => {
  assert.ok(css.includes('.area-message--assistant > .area-message__content > :is(p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote):first-child { text-box: trim-start cap text; }'));
  assert.ok(css.includes('.area-message--assistant > .area-message__content > :is(p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote):last-child { text-box: trim-end cap text; }'));
});

test('row components that open with a line of text give back its half-leading at their outer edge', () => {
  for (const [selector, property] of [
    ['.area-step:not(.area-step .area-step)', 'margin-block-start'],
    ['.area-timeline', 'margin-block-start'],
    ['.area-plan--plain', 'margin-block-start'],
    ['.area-edit-summary--plain', 'margin-block-start'],
    ['.area-turn-notice', 'margin-block'],
    ['.area-timestamp', 'margin-block'],
  ]) assert.ok(has(selector, `${property}: ${TRIM}`), `${selector} keeps ${property}: ${TRIM}`);
});

// 2026-11-06 balance pass (DESIGN_SYSTEM.md, "Text pairs"): a component's title is its text's size; it was title-xs.
// Since plan B1.1 (2026-11-13) the pair is the frame recipe's (surface.css), which Card and Surface share.
test("Card's title is one role, its description's size, unless a page's hook sets another ramp step", () => {
  assert.ok(css.includes('--_card-title-size: var(--area-card-title-size, var(--_fr-title-size))'));
  assert.ok(css.includes('--_card-title-leading: var(--area-card-title-leading, var(--_fr-title-leading))'));
  assert.ok(css.includes('--_card-title-tracking: var(--area-card-title-tracking, var(--_fr-title-tracking))'));
  assert.ok(css.includes('--_fr-title-size: var(--area-text-base-size)'));
  assert.ok(css.includes('--_fr-title-leading: var(--area-text-base-leading)'));
  assert.ok(css.includes('--_fr-title-tracking: var(--area-text-base-tracking)'));
});
