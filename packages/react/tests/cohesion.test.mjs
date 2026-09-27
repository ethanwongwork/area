import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// DESIGN_SYSTEM.md, "Shared state paint" and "Elevation"; docs/research/cohesion-audit.md.
// These read the built stylesheet, so they guard the rules across every family at once.
const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const rules = [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim().replace(/\s+/g, ' '), body }));
const ruleFor = selector => rules.find(rule => rule.selector === selector);

test('hover changes a plate, edge or underline, never the ink', () => {
  for (const { selector, body } of rules) {
    if (!/:hover|\[data-hover\]|\[data-highlighted\]/.test(selector)) continue;
    // A revealed tooltip may fade in, and so may a card's revealed actions (they appear;
    // no ink changes); an inherited colour follows its owner.
    if (/tooltip|__overlay--reveal/.test(selector)) continue;
    for (const [, prop, value] of body.matchAll(/(?:^|[;\s])(color|opacity)\s*:\s*([^;]+)/g)) {
      assert.ok(prop === 'color' && /^(inherit|HighlightText|LinkText|CanvasText)$/.test(value.trim()), `${selector} sets ${prop}: ${value.trim()} on hover`);
    }
  }
});

test('rows share one hover plate and one selection plate, and selection outranks hover', () => {
  // Each hover selector excludes the selected or current row, so the stronger plate stays
  // under the pointer (a hover rule of higher specificity would otherwise lighten it).
  const hover = [
    '.area-menu__item:hover:not([data-disabled], [data-selected]), .area-menu__item:is([data-highlighted], :focus):not([data-selected])',
    '.area-nav__item:hover:not([data-disabled])',
    '.area-nav__row:has(> .area-nav__item:not([data-disabled], [aria-current="page"])):hover',
    '.area-table--interactive tbody tr:not([data-selected], [aria-selected="true"]):hover td',
    '.area-tree-view [role="treeitem"]:hover:not([data-disabled], [aria-current="page"])',
  ];
  for (const selector of hover) assert.match(ruleFor(selector)?.body ?? '', /var\(--area-bg-component-hover\)/, `${selector} is not the row hover plate`);
  const selected = [
    '.area-menu__item[data-selected]',
    '.area-nav__item[aria-current]:not([aria-current="false"])',
    '.area-table tbody tr:is([data-selected], [aria-selected="true"])',
  ];
  for (const selector of selected) assert.match(ruleFor(selector)?.body ?? '', /var\(--area-bg-component-active\)/, `${selector} is not the selection plate`);
  assert.match(ruleFor('.area-tree-view--navigation')?.body ?? '', /--_tree-selection:\s*var\(--area-bg-component-active\)/);
});

test('every floating surface shares the lift', () => {
  const lift = /0 20px 24px var\(--area-shadow-color\), 0 5px 8px color-mix\(in srgb, var\(--area-shadow-color\) 50%, transparent\)/;
  for (const block of ['.area-popover, .area-menu', '.area-dialog', '.area-toast', '.area-menu__search-surface', '.area-calendar--surface', '.area-toolbar__overflow-content']) {
    const rule = ruleFor(block);
    assert.ok(rule, `${block} missing`);
    assert.match(rule.body, lift, `${block} does not use the floating lift`);
  }
});

test('text fields show disabled with field paint, not opacity', () => {
  for (const selector of ['.area-input[data-disabled]', '.area-textarea:disabled', '.area-select:disabled']) {
    const rule = ruleFor(selector);
    assert.ok(rule, `${selector} missing`);
    assert.doesNotMatch(rule.body, /opacity/, `${selector} dims a field twice`);
  }
});

test('selection markers are neutral unless accent is asked for', () => {
  for (const { selector, body } of rules) {
    if (!/area-(nav|tree-view|avatar|code-block)/.test(selector)) continue;
    if (/--accent/.test(selector)) continue;
    assert.doesNotMatch(body, /--area-(accent-solid|focus-color)\)\s*;?\s*$|background(-color)?:\s*var\(--area-(accent-solid|focus-color)\)/, `${selector} paints a marker in accent or focus colour`);
  }
});
