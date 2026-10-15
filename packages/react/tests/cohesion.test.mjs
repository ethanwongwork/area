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

test('every surface takes its depth from its elevation role', () => {
  // The Elevation axis (axes/elevation.ts, owner 2026-10-14): components name a role, the preset sets its depth.
  // Every role is two layers, ambient then key, in every preset, so presets swap and transition layer by layer;
  // "no lift" is a transparent shadow, never `none`, because a role also sits inside lists (Board card's ring,
  // the floating Toolbar's edge) where `none` invalidates the whole box-shadow and drops the ring with it.
  const layers = value => { let depth = 0, count = 1; for (const ch of value) { if (ch === '(') depth++; else if (ch === ')') depth--; else if (ch === ',' && depth === 0) count++; } return count; };
  const roles = ['control', 'resting', 'tooltip', 'float', 'modal'];
  for (const role of roles) {
    const values = [...css.matchAll(new RegExp(`--area-shadow-${role}:\\s*([^;]+);`, 'g'))].map(match => match[1].trim());
    // The default on :root, then one scope per step, 0 to 8.
    assert.equal(values.length, 10, `--area-shadow-${role} should have the default and one value per step`);
    for (const value of values) {
      assert.notEqual(value, 'none', `--area-shadow-${role} is none; use a transparent shadow`);
      assert.equal(layers(value), 2, `--area-shadow-${role} is not two layers: ${value}`);
    }
  }
  const float = [...css.matchAll(/--area-shadow-float:\s*([^;]+);/g)].map(match => match[1].trim());
  // Step 3, the default: the Menu's shadow at 3% (Notion's lightest lift, 2.7%), ambient half, dark doubled.
  assert.equal(float[0], '0 0 2px light-dark(rgb(0 0 0 / 0.015), rgb(0 0 0 / 0.03)), 0 8px 16px light-dark(rgb(0 0 0 / 0.03), rgb(0 0 0 / 0.06))', 'the default float lost its step-3 recipe');
  assert.ok(float.includes('0 0 0 0 transparent, 0 0 0 0 transparent'), 'step 0 should drop the lift');
  assert.ok(float.includes('0 0 2px light-dark(rgb(0 0 0 / 0.04), rgb(0 0 0 / 0.08)), 0 8px 16px light-dark(rgb(0 0 0 / 0.08), rgb(0 0 0 / 0.16))'), 'step 8 should be ChatGPT\'s menu strength, 8%');

  // The shadow that paints is the last box-shadow on the block, in any rule: a later literal once overrode the
  // shared lift with a full-strength second layer and a looser test still passed.
  const elevation = rule => rule.body.match(/--_elevation\s*:\s*([^;]+)/)?.[1].trim();
  const paints = block => {
    const own = rules.filter(rule => rule.selector.split(/\s*,\s*/).includes(block) && /(^|[;\s])box-shadow\s*:/.test(rule.body));
    assert.ok(own.length, `${block} has no box-shadow`);
    const value = [...own.at(-1).body.matchAll(/(?:^|[;\s])box-shadow\s*:\s*([^;]+)/g)].at(-1)[1].trim();
    const ownElevation = () => rules.filter(rule => rule.selector.split(/\s*,\s*/).includes(block)).map(elevation).filter(Boolean).at(-1);
    return value.includes('var(--_elevation)') ? value.replace('var(--_elevation)', ownElevation() ?? 'var(--_elevation)') : value;
  };
  const expect = { float: ['.area-popover', '.area-menu', '.area-toast', '.area-menu__search-surface', '.area-scroll-to-latest > .area-button'], modal: ['.area-dialog', '.area-command-palette'], resting: ['.area-panel', '.area-composer'] };
  for (const [role, blocks] of Object.entries(expect)) {
    for (const block of blocks) assert.match(paints(block), new RegExp(`var\\(--area-shadow-${role}\\)`), `${block} does not take the ${role} role`);
  }
  for (const block of ['.area-calendar, .area-calendar--surface', '.area-color-picker, .area-color-picker--surface']) {
    assert.match(ruleFor(block)?.body ?? '', /var\(--area-shadow-float\)/, `${block} does not take the float role`);
  }
  assert.match(ruleFor('.area-tooltip')?.body ?? '', /var\(--area-shadow-tooltip\)/, 'Tooltip does not take the tooltip role');
  assert.match(ruleFor('.area-card')?.body ?? '', /--_card-shadow:\s*var\(--area-shadow-resting\)/, 'Card does not take the resting role');

  // The Surface axis (axes/surface.ts, 2026-10-14): at 0 (Borderless) a framed surface's edge is a shadow, so every
  // surface whose frame the setting removes lists `shadow-edge` first, or Borderless leaves it with no edge at
  // Elevation 0 and in dark. Two layers at both steps, never none, as the roles.
  const edges = [...css.matchAll(/--area-shadow-edge:\s*([^;]+);/g)].map(match => match[1].trim());
  assert.equal(edges.length, 3, '--area-shadow-edge should have the default and one value per step');
  for (const value of edges) assert.equal(layers(value), 2, `--area-shadow-edge is not two layers: ${value}`);
  assert.ok(edges.includes('0 0 1px rgb(0 0 0 / 0.62), inset 0 0 1px light-dark(transparent, rgb(255 255 255 / 0.2))'), 'Borderless lost ChatGPT\'s frameless edge');
  for (const block of [...expect.float.slice(0, 4), ...expect.modal, '.area-panel', '.area-drawer', '.area-board-card']) {
    assert.match(paints(block), /^var\(--area-shadow-edge\),/, `${block} does not lead with the Surface axis's edge`);
  }
  assert.match(ruleFor('.area-card')?.body ?? '', /box-shadow:\s*var\(--area-shadow-edge\), var\(--_card-shadow\)/, 'Card does not lead with the Surface axis\'s edge');
  // The Popover arrow is a shape a box-shadow cannot follow: it takes the same edge as a drop-shadow.
  assert.match(ruleFor('.area-popover__arrow')?.body ?? '', /filter:\s*var\(--area-shadow-edge-filter\)/, 'the Popover arrow has no edge at Borderless');
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
// edges of filled shapes use `border-width`, which the Borderless surface preset (was Elevated) sets to 0. The swatch ring once
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
  // border-float: neutral 100 in light (Notion's popover ring; it carries the separation the minimal lift no longer
  // does), neutral 650 in dark, so a floating surface stays distinct over another surface (DESIGN_SYSTEM.md, "Size and shape").
  for (const selector of ['.area-popover, .area-menu', '.area-dialog', '.area-toast', '.area-menu__search-surface', '.area-calendar, .area-calendar--surface', '.area-command-palette', '.area-select::picker(select)', '.area-board-card__actions']) {
    const rule = rules.find(r => r.selector === selector && /var\(--area-border-float\)/.test(r.body));
    assert.ok(rule, `${selector} does not draw border-float`);
  }
  assert.match(ruleFor('.area-color-picker, .area-color-picker--surface')?.body ?? '', /--_picker-edge:\s*var\(--area-border-float\)/);
});

test('every loop stops through the motion axis\'s loop factor', () => {
  // axes/motion.ts (2026-10-14): `duration-loop` is 1, and 0 at motion 0 and under reduced motion. Each infinite
  // animation multiplies its measured period by it, so the nearest motion scope decides; a `[data-area-motion="0"]`
  // descendant rule could not be undone by a non-zero scope nested inside it.
  const loops = [...css.matchAll(/animation\s*:\s*([^;{}]*\binfinite\b[^;{}]*)/g)].map(match => match[1].trim());
  assert.ok(loops.length >= 7, `expected the seven loops, found ${loops.length}`);
  for (const loop of loops) assert.match(loop, /calc\([\d.]+s \* var\(--area-duration-loop\)\)/, `a loop runs without the loop factor: ${loop}`);
  assert.doesNotMatch(css, /\[data-area-motion="0"\]\s+[.:#\[\w]/, 'a loop stops by a motion-0 descendant rule again');
  const factors = [...css.matchAll(/--area-duration-loop:\s*([^;]+);/g)].map(match => match[1].trim());
  assert.deepEqual([...new Set(factors)].sort(), ['0', '1'], 'the loop factor should be 1, or 0 at step 0');
});
