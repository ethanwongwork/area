import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { derivedTokens } from '../../tokens/src/emit/base.ts';
import { typeSizeTokens, TYPE_SIZES } from '../../tokens/src/axes/type-size.ts';
import { DENSITY_LEVELS } from '../../tokens/src/axes/density.ts';

// The shared row table and the one centring model (plan B2.1–B2.7, 2026-11-13; packages/styles/src/inset.css, "One
// centring model" and "One row table"; DESIGN_SYSTEM.md, "Optical insets" and "List rows"). These read the built
// stylesheet, so a family that restates a term, or a text slot that leaves the model, fails here.
const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const rules = [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim().replace(/\s+/g, ' '), body }));
const split = selector => { const out = []; let depth = 0, from = 0; for (let i = 0; i < selector.length; i++) { const ch = selector[i]; if (ch === '(') depth++; else if (ch === ')') depth--; else if (ch === ',' && depth === 0) { out.push(selector.slice(from, i).trim()); from = i + 1; } } out.push(selector.slice(from).trim()); return out; };
const bodyOf = selector => rules.filter(rule => split(rule.selector).includes(selector)).map(rule => rule.body).join(';');

// Resolves the size derivations (emit/base.ts) for a type size and density, as the browser does (density.test.ts).
const derived = derivedTokens();
function resolver(base, density) {
  const leaves = {};
  for (const [k, v] of Object.entries(typeSizeTokens(base))) leaves[`--area-${k}`] = v;
  leaves['--area-density-level'] = String(DENSITY_LEVELS[density]);
  const lookup = name => { const value = leaves[name] ?? derived[name]; if (value === undefined) throw new Error(`${name} is not defined`); return value; };
  const expand = value => value.replace(/var\((--area-[\w-]+)\)/g, (_, name) => `(${expand(lookup(name))})`);
  return expression => {
    const js = expand(expression).replace(/(\d*\.?\d+)px/g, '$1').replace(/round\((nearest|up|down),/g, (_, mode) => `R("${mode}",`)
      .replace(/\bcalc\(/g, '(').replace(/\b(max|min)\(/g, 'Math.$1(').replace(/\bclamp\(/g, 'C(');
    const R = (mode, x, step) => (mode === 'up' ? Math.ceil(x / step) : mode === 'down' ? Math.floor(x / step) : Math.round(x / step)) * step;
    const C = (lo, x, hi) => Math.min(Math.max(lo, x), hi);
    return Number(new Function('R', 'C', `return (${js});`)(R, C));
  };
}

// The row table as the shared layer writes it (inset.css, menu.css, nav.css, panel.css), one expression per term.
const TERMS = {
  row: 'var(--area-ui-row)',
  'glyph edge': 'var(--area-ui-row-inset)',
  'icon slot': 'var(--area-icon-md)',
  'icon box': 'calc(var(--area-ui-row) - var(--area-ui-row-inset) * 2)',
  'icon-to-label': 'var(--area-ui-cluster)',
  label: 'calc(var(--area-ui-row-inset) + var(--area-icon-md) + var(--area-ui-cluster))',
  'separator room': 'round(nearest, calc(6px - 1px * var(--area-ui-dense)), 1px)',
  'group break': 'var(--area-gap-row)',
  'plate gap': 'var(--area-ui-row-gap)',
  'text side, md control': 'max(0px, round(nearest, calc((var(--area-control-md) - CAP) / 2 - 1px), 1px))',
  'panel action hang (md)': 'max(0px, calc(max(calc(16px - 2px), var(--area-inset-surface-md)) + (var(--area-control-md) - var(--area-control-sm)) / 2 - var(--area-ui-row-inset)))',
};
const CAP = 0.71; // the face's cap height per em (Geist 710 / 1000), for the cap-centred side only
const DENSITIES = Object.keys(DENSITY_LEVELS);

test('the row table computes whole pixels at every type and density, and its label column is one value', () => {
  const table = {};
  for (const base of TYPE_SIZES) for (const density of DENSITIES) {
    const evaluate = resolver(base, density);
    const row = {};
    for (const [term, expression] of Object.entries(TERMS)) {
      const value = evaluate(expression.replace('CAP', `${CAP * base}px`));
      assert.ok(Number.isInteger(value), `${term} at type ${base} / ${density} is ${value}, not a whole pixel`);
      row[term] = value;
    }
    // The label column is the glyph edge, the icon slot and the gap; the icon box is the row less the glyph edge twice.
    assert.equal(row.label, row['glyph edge'] + row['icon slot'] + row['icon-to-label']);
    // The icon box is the inset's reference, not the glyph's box: it puts the start (row − box) / 2 = the glyph edge in.
    assert.equal((row.row - row['icon box']) / 2, row['glyph edge'], `the icon box puts the glyph on the edge at ${base} / ${density}`);
    // A separator stands 6 − ui-dense from the plates: 5 / 6 / 7 at type 13, 4 to 8 across every type and density.
    assert.ok(row['separator room'] >= 4 && row['separator room'] <= 8, `separator room ${row['separator room']} at ${base} / ${density}`);
    table[`${base} / ${density}`] = row;
  }
  // The values quoted in inset.css and DESIGN_SYSTEM.md, at type 13.
  assert.deepEqual([table['13 / 28'].label, table['13 / 32'].label, table['13 / 36'].label], [30, 32, 34]);
  assert.deepEqual([table['13 / 28']['separator room'], table['13 / 32']['separator room'], table['13 / 36']['separator room']], [5, 6, 7]);
  assert.deepEqual([table['13 / 28']['group break'], table['13 / 32']['group break'], table['13 / 36']['group break']], [8, 12, 16]);
  if (process.env.AREA_ROW_TABLE) console.table(table);
});

test('one centring model: every one-line text slot is trimmed to its cap, never a flex or grid container', () => {
  const CAP_SLOTS = ['.area-button__label', '.area-segmented__label', '.area-tabs__text', '.area-nav__text', '.area-menu__text',
    '.area-command-palette__description', '.area-command-palette__path', '.area-composer-menu__path', '.area-tree-view__label',
    '.area-selection-bar__count'];
  for (const slot of CAP_SLOTS) {
    const body = bodyOf(slot);
    assert.match(body, /text-box:\s*trim-both cap alphabetic/, `${slot} is the trimmed slot`);
    assert.match(body, /padding-block:\s*0\.25em/, `${slot} keeps its paint room`);
  }
  // Line slots keep their line, so a content-sized plate keeps its height.
  for (const slot of ['.area-tooltip__text', '.area-panel__row-label']) {
    const body = bodyOf(slot);
    assert.match(body, /text-box:\s*trim-both cap alphabetic/, `${slot} is trimmed`);
    assert.match(body, /--_line-room:\s*calc\(\(1lh - 1cap\) \/ 2\)/, `${slot} gives its line back`);
  }
  // Text boxes: a page number is its own box, (H − 1cap) / 2 above and below.
  assert.match(bodyOf('.area-pagination__page'), /--_cap-room:\s*calc\(\(var\(--_height\) - 1cap\) \/ 2\)/);
  assert.match(bodyOf('.area-pagination__page'), /display:\s*inline-block/);
  // Trim does nothing on a flex or grid container: no rule that trims a part may also make it one.
  for (const { selector, body } of rules) {
    if (!/text-box:\s*trim-both/.test(body)) continue;
    assert.doesNotMatch(body, /(?:^|[;\s])display:\s*(?:inline-)?(?:flex|grid)\b/, `${selector} trims a flex or grid container`);
  }
  // Tabs' label is a column (its strong-width reserve), so its words are their own part.
  assert.match(bodyOf('.area-tabs__label'), /display:\s*inline-flex/);
  assert.doesNotMatch(bodyOf('.area-tabs__label'), /text-box/);
  // Switch: the words centre their cap on the track, the track at the box's top.
  assert.match(bodyOf('.area-switch__text'), /margin-block-start:\s*max\(0px, calc\(\(var\(--_h\) - 1cap\) \/ 2\)\)/);
  assert.match(bodyOf('.area-switch__label'), /text-box:\s*trim-start cap alphabetic/);
  assert.doesNotMatch(bodyOf('.area-switch__track'), /margin-block-start/);
});

test('one row table: rows share the glyph edge, gap, ink, separator, group break and empty line', () => {
  // Text-only rows start on the glyph edge, the icon box, in every list.
  assert.match(bodyOf('.area-menu__item:not(:has(> .area-menu__icon:first-child))'), /--_box-start:\s*var\(--_box-icon\)/);
  assert.match(bodyOf('.area-nav__item:not(:has(> .area-nav__icon:first-child))'), /--_box-start:\s*var\(--_box-icon\)/);
  assert.match(bodyOf('.area-menu__empty'), /--_box-start:\s*var\(--_box-icon\)/);
  assert.match(bodyOf('.area-select option'), /padding-inline-start:\s*var\(--area-ui-row-inset\)/);
  // The icon-to-label gap is ui-cluster in every row family.
  assert.match(bodyOf('.area-menu__item'), /gap:\s*var\(--_menu-gap, var\(--area-ui-cluster\)\)/);
  assert.match(bodyOf('.area-nav__item'), /gap:\s*var\(--area-ui-cluster\)/);
  assert.match(bodyOf('.area-tree-view'), /--_tree-gap:\s*var\(--area-ui-cluster\)/);
  // One row-icon ink, muted; only a danger row gives its icon its ink.
  const ink = rules.find(rule => /> :is\(\.area-menu__icon, \.area-nav__icon, \.area-tree-view__icon\)$/.test(rule.selector) && /color:\s*var\(--area-fg-muted\)/.test(rule.body));
  assert.ok(ink, 'Menu, Nav and Tree view icons share the muted ink');
  for (const { selector, body } of rules) {
    if (!/__icon\b/.test(selector) || !/(?:menu|nav|tree-view)__icon/.test(selector) || selector === ink.selector) continue;
    if (/danger/.test(selector) || /forced/.test(selector)) continue;
    assert.doesNotMatch(body, /(?:^|[;\s])color:/, `${selector} restates the row icon's ink`);
  }
  // Plates are ui-row-gap apart by gap, never by margin.
  assert.match(bodyOf('.area-select option'), /margin-block:\s*var\(--area-ui-row-gap\) 0/);
  for (const list of ['.area-menu', '.area-nav__group', '.area-tree-view', '.area-list-box']) assert.match(bodyOf(list), /gap:\s*var\(--area-ui-row-gap\)/, `${list} stacks its plates by gap`);
  // Separators: one room, their ends on the plates' edges; Nav's and Menu's own rules no longer set it.
  const room = /round\(nearest, calc\(var\(--area-space-6\) - 1px \* var\(--area-ui-dense\)\), 1px\)/;
  assert.match(bodyOf('.area-menu__separator'), room);
  assert.match(bodyOf('.area-nav:not(.area-nav--horizontal) > .area-nav__separator'), room);
  assert.match(bodyOf('.area-menu__separator'), /margin-inline:\s*0/);
  for (const { selector, body } of rules) {
    if (!/^\.area-(?:menu|nav)__separator$/.test(selector)) continue;
    if (/margin-block/.test(body)) assert.match(body, room, `${selector} restates the separator's room`);
  }
  // A group break is gap-row.
  assert.match(bodyOf('.area-nav__group + .area-nav__group'), /margin-block-start:\s*var\(--area-gap-row\)/);
  // One empty line: Menu's, in every list; the families' own copies are gone.
  for (const gone of ['.area-combobox__empty', '.area-command-palette__empty', '.area-composer-menu__empty']) {
    assert.ok(!rules.some(rule => split(rule.selector).includes(gone)), `${gone} restates the empty line`);
  }
  assert.match(bodyOf('.area-menu__empty'), /block-size:\s*var\(--area-ui-row\)/);
  // A list with a picture reserves the picture's width in every row's slot.
  assert.match(bodyOf('.area-nav:has(.area-nav__picture)'), /--_nav-slot:/);
  assert.match(bodyOf('.area-nav__icon'), /inline-size:\s*var\(--_nav-slot, var\(--area-icon-md\)\)/);
});

test('two-line rows put the leading glyph on the first line by the box technique (plan B2.4)', () => {
  assert.match(bodyOf('.area-menu__item:has(.area-menu__description) > .area-menu__icon:first-child'), /align-self:\s*flex-start;\s*block-size:\s*var\(--area-ui-leading\)/);
  for (const part of ['.area-alert__icon', '.area-toast__icon']) {
    assert.match(bodyOf(part), /block-size:\s*var\(--area-ui-leading\)/, `${part} is a box one first line tall`);
    assert.doesNotMatch(bodyOf(part), /margin-block-start:\s*calc\(\(var\(--area-ui-leading\) - var\(--area-icon-md\)\) \/ 2\)/, `${part} sets its glyph by margin arithmetic`);
  }
  assert.match(bodyOf('.area-card__list > li > svg'), /block-size:\s*var\(--_card-body-leading\)/);
});

test('a control in a row keeps the row\'s height: its target is out of flow (plan B2.5)', () => {
  assert.doesNotMatch(bodyOf('.area-switch'), /min-block-size:\s*var\(--area-space-24\)/, 'Switch grows its box to its target');
  assert.match(bodyOf('.area-switch__control'), /inset:\s*50% auto auto 50%/);
  assert.match(bodyOf('.area-switch__control'), /block-size:\s*max\(100%, var\(--_target\)\)/);
  assert.match(bodyOf('.area-checkbox:has(> input:only-child)'), /min-block-size:\s*0/);
});

test('a Panel section with any row action reserves the action column on every row (plan B2.7)', () => {
  const section = '.area-panel__section:has(:is(.area-panel__row-action, .area-box-field__toggle, .area-property-list__actions))';
  assert.match(bodyOf(`${section} .area-panel__row`), /grid-template-columns:\s*minmax\(0, 1fr\) minmax\(0, 1fr\) var\(--_row\)/);
  assert.match(bodyOf(`${section} .area-panel__row`), /margin-inline-end:\s*calc\(-1 \* var\(--_action-hang\)\)/);
  assert.match(bodyOf(`${section} .area-box-field__fields`), /grid-template-columns:\s*minmax\(0, 1fr\) minmax\(0, 1fr\) var\(--_row\)/);
  assert.match(bodyOf('.area-panel'), /--_action-hang:/);
});
