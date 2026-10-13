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
    // A revealed control may fade in to full opacity (a card's actions, a tree row's controls,
    // a section chevron, a drag handle): it appears, and no ink changes. A tooltip may fade.
    // An inherited colour follows its owner.
    if (/tooltip/.test(selector)) continue;
    for (const [, prop, value] of body.matchAll(/(?:^|[;\s])(color|opacity)\s*:\s*([^;]+)/g)) {
      if (prop === 'opacity' && value.trim() === '1') continue;
      assert.ok(prop === 'color' && /^(inherit|HighlightText|LinkText|CanvasText)$/.test(value.trim()), `${selector} sets ${prop}: ${value.trim()} on hover`);
    }
  }
});

test('rows share one hover plate and one selection plate, and selection outranks hover', () => {
  // Each hover selector excludes the selected or current row, so the stronger plate stays
  // under the pointer (a hover rule of higher specificity would otherwise lighten it).
  const hover = [
    // Pointer hover sits under @media (hover: hover) (audit S21b); keyboard highlight does not.
    '.area-menu__item:hover:not([data-disabled], [data-selected])',
    '.area-menu__item:is([data-highlighted], :focus-visible):not([data-selected])',
    '.area-nav__item:hover:not([data-disabled])',
    '.area-nav__row:has(> .area-nav__item:not([data-disabled], [aria-current]:not([aria-current="false"]))):hover',
    '.area-table--interactive tbody tr:not([data-selected], [aria-selected="true"]):hover td',
    '.area-tree-view [role="treeitem"]:hover:not([data-disabled], [aria-current="page"], [aria-selected="true"])',
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
  // The lift is the Surface axis role (audit S10): Notion's geometry by default, none at Flat.
  const lift = /var\(--area-shadow-float\)/;
  const role = [...css.matchAll(/--area-shadow-float:\s*([^;]+);/g)].map(match => match[1].trim());
  assert.ok(role.includes('0 20px 24px var(--area-shadow-color), 0 5px 8px color-mix(in srgb, var(--area-shadow-color) 50%, transparent)'), 'shadow-float lost its recipe');
  assert.ok(role.includes('none'), 'the Flat preset should drop the lift');
  for (const block of ['.area-popover, .area-menu', '.area-dialog', '.area-toast', '.area-menu__search-surface', '.area-calendar, .area-calendar--surface', '.area-color-picker, .area-color-picker--surface', '.area-command-palette']) {
    const rule = ruleFor(block);
    assert.ok(rule, `${block} missing`);
    assert.match(rule.body, lift, `${block} does not use the floating lift`);
  }
  // The shadow that paints is the last box-shadow on the block, in any rule: a later literal
  // once overrode the shared lift with a full-strength second layer and this test still passed.
  const elevation = rule => rule.body.match(/--_elevation\s*:\s*([^;]+)/)?.[1].trim();
  for (const block of ['.area-popover', '.area-menu', '.area-dialog', '.area-toast', '.area-menu__search-surface', '.area-command-palette']) {
    const own = rules.filter(rule => rule.selector.split(/\s*,\s*/).includes(block) && /(^|[;\s])box-shadow\s*:/.test(rule.body));
    assert.ok(own.length, `${block} has no box-shadow`);
    const value = [...own.at(-1).body.matchAll(/(?:^|[;\s])box-shadow\s*:\s*([^;]+)/g)].at(-1)[1].trim();
    const resolved = value === 'var(--_elevation)' ? rules.filter(rule => rule.selector.split(/\s*,\s*/).includes(block)).map(elevation).filter(Boolean).at(-1) : value;
    assert.match(resolved ?? '', lift, `${block} paints ${value}, not the floating lift`);
  }
});

test('text fields show disabled with field paint, not opacity', () => {
  for (const selector of ['.area-input[data-disabled]', '.area-textarea:disabled', '.area-select:disabled', '.area-composer[data-disabled]', '.area-number-field[data-disabled]']) {
    const rule = ruleFor(selector);
    assert.ok(rule, `${selector} missing`);
    assert.doesNotMatch(rule.body, /opacity/, `${selector} dims a field twice`);
  }
  // InputGroup's disabled paint is field paint too (audit B-32).
  const group = rules.find(rule => rule.selector.startsWith('.area-input-group:is([aria-disabled="true"]') && /background-color/.test(rule.body));
  assert.ok(group, 'InputGroup disabled paint missing');
  assert.doesNotMatch(group.body, /opacity/);
});

test('fields rest without a shadow, and the Select picker floats with the shared lift (audit B-32)', () => {
  for (const selector of ['.area-input', '.area-number-field', '.area-select']) {
    const rule = rules.find(r => r.selector === selector && /box-shadow/.test(r.body));
    assert.ok(rule, `${selector} resting shadow rule missing`);
    assert.match(rule.body, /box-shadow:\s*none/, `${selector} rests with a shadow`);
  }
  const picker = rules.find(r => r.selector === '.area-select::picker(select)' && /box-shadow/.test(r.body));
  assert.ok(picker, 'Select picker rule missing');
  assert.match(picker.body, /var\(--area-shadow-float\)/);
});

test('selection markers never paint the accent or focus colour directly', () => {
  for (const { selector, body } of rules) {
    if (!/area-(nav|tree-view|avatar|code-block)/.test(selector)) continue;
    assert.doesNotMatch(body, /--area-(accent-solid|focus-color)\)\s*;?\s*$|background(-color)?:\s*var\(--area-(accent-solid|focus-color)\)/, `${selector} paints a marker in accent or focus colour`);
  }
});

// DESIGN_SYSTEM.md, "Strokes" (consistency pass 2026-10-12). A line's width follows its job: required lines (control,
// field and state edges, swatch rings, cutouts, joined-control seams, standalone dividers and frames with no shadow)
// use `stroke-width`, which no preset changes; frames of surfaces that carry a shadow, the seams inside them and the
// edges of filled shapes use `border-width`, which the Elevated surface preset sets to 0. The swatch ring once
// regressed to `border-width` (audit F-5), so a white swatch vanished under Elevated again.
test('required lines never ride the Surface axis', () => {
  const lineProp = /(?:^|[;\s])(border(?:-[a-z-]+)?|outline|box-shadow|--_[a-z-]*(?:ring|edge|line|border))\s*:\s*([^;]+)/g;
  const required = /--area-(border-divider|token-swatch-ring|edge-control|edge-control-hover|edge-selected|edge-accent|input-edge|input-edge-hover|selection-edge|stroke-control|stroke-selected|focus-color|field-focus-color)\b/;
  for (const { selector, body } of rules) {
    for (const [, prop, value] of body.matchAll(lineProp)) {
      if (!/var\(--area-border-width\)/.test(value)) continue;
      assert.doesNotMatch(value, required, `${selector} draws a required line (${prop}) at border-width`);
    }
  }
  const strokeWidth = /var\(--area-stroke-width\)/;
  // Swatch rings, cutouts and standalone dividers, by name.
  for (const [selector, prop] of [
    ['.area-color-swatch', 'outline'],
    ['.area-chip__swatch', 'outline'],
    ['.area-code__swatch, .area-token__swatch', 'box-shadow'],
    ['.area-color-swatch-picker--palette', 'outline'],
    ['.area-avatar-group__item > .area-avatar, .area-avatar-group__overflow', '--_group-ring'],
    ['.area-separator--horizontal', 'block-size'],
    ['.area-nav__separator', 'block-size'],
    ['.area-table-wrapper', 'border'],
    ['.area-description-list--framed', 'border'],
    ['.area-code-block', 'border'],
    ['.area-file-upload', 'border'],
  ]) {
    const rule = rules.find(r => r.selector === selector && new RegExp(`(^|[;\\s])${prop.replace(/[-]/g, '\\-')}\\s*:`).test(r.body));
    assert.ok(rule, `${selector} ${prop} missing`);
    const value = rule.body.match(new RegExp(`(?:^|[;\\s])${prop.replace(/[-]/g, '\\-')}\\s*:\\s*([^;]+)`))[1];
    assert.match(value, strokeWidth, `${selector} ${prop} is not at stroke-width: ${value.trim()}`);
  }
  // Seams inside a container go with its frame.
  for (const selector of ['.area-menu__separator', '.area-toolbar__separator']) {
    assert.match(ruleFor(selector)?.body ?? '', /var\(--area-border-width\)/, `${selector} is a container seam and should ride the Surface axis`);
  }
});

test('every floating surface draws the floating frame', () => {
  // border-float: the decorative rung in light, neutral 650 in dark, so a floating surface stays distinct over another
  // surface where its shadow no longer reads (DESIGN_SYSTEM.md, "Size and shape").
  for (const selector of ['.area-popover, .area-menu', '.area-dialog', '.area-toast', '.area-menu__search-surface', '.area-calendar, .area-calendar--surface', '.area-command-palette', '.area-select::picker(select)', '.area-board-card__actions']) {
    const rule = rules.find(r => r.selector === selector && /var\(--area-border-float\)/.test(r.body));
    assert.ok(rule, `${selector} does not draw border-float`);
  }
  assert.match(ruleFor('.area-color-picker, .area-color-picker--surface')?.body ?? '', /--_picker-edge:\s*var\(--area-border-float\)/);
});
