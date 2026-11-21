import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

// Shared selection paint (plan B7.4–B7.7, B7.13; DESIGN_SYSTEM.md "Shared state paint"). The source is read with its
// comments, since a justified literal is one marked `/* spec */` on its own line; the built sheet for the cascade.
const SRC = new URL('../../styles/src/', import.meta.url);
const sourceFiles = [...readdirSync(new URL('components/', SRC)).filter(f => f.endsWith('.css')).map(f => `components/${f}`), 'layers.css', 'inset.css', 'base.css', 'selection.css', 'material.css'];
const source = Object.fromEntries(sourceFiles.map(f => [f, readFileSync(new URL(f, SRC), 'utf8')]));
const built = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const builtRules = [...built.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim().replace(/\s+/g, ' '), body }));

/** Every declaration of a file with its rule's selector and whether its line carries a `spec` comment. */
function declarations(file) {
  const text = source[file];
  // Blank comments out (keeping offsets), remembering which lines hold a spec mark.
  const specLines = new Set();
  const plain = text.replace(/\/\*[\s\S]*?\*\//g, (c, at) => {
    if (/\bspec\b/.test(c)) specLines.add(text.slice(0, at).split('\n').length);
    return c.replace(/[^\n]/g, ' ');
  });
  const out = [];
  for (const m of plain.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].trim().replace(/\s+/g, ' ');
    let at = m.index + m[1].length + 1;
    for (const raw of m[2].split(/;(?![^(]*\))/)) {
      const colon = raw.indexOf(':');
      if (colon > 0) {
        const end = text.slice(0, at + raw.length).split('\n').length;
        const start = text.slice(0, at + raw.search(/\S|$/)).split('\n').length;
        let spec = false; for (let line = start; line <= end + 0; line++) if (specLines.has(line)) spec = true;
        out.push({ selector, prop: raw.slice(0, colon).trim(), value: raw.slice(colon + 1).trim(), spec });
      }
      at += raw.length + 1;
    }
  }
  return out;
}

const STATE = /:hover|:active|\[data-selected\]|\[aria-selected="true"\]|\[aria-current|:checked|\[aria-pressed="true"\]|\[data-highlighted\]|\[data-resizing\]|\[aria-checked="true"\]|\[data-pressed\]/;
const PAINT = /^(background(-color|-image)?|box-shadow|border(-[a-z-]+)?-color|outline-color|color|fill|stroke)$/;
const STATE_PROP = /^--_[\w-]*(hover|active|pressed|selected|checked|current)[\w-]*$/;
const LITERAL = /#[0-9a-f]{3,8}\b|\brgba?\(\s*[\d.]|\bhsla?\(\s*[\d.]|\boklch\(\s*[\d.]+%?\s|\boklab\(\s*[\d.]|\b(white|black)\b/i;
// A material's paint and the neutral solid's dark press (white, in Button and Calendar's selected day) are justified
// literals their owners mark `/* spec */` (plan B7.4); until then they are named here, so a new unmarked literal anywhere
// else fails. Media chrome left the list when Video player's glass became one recipe (step C4, 2026-11-18).
const PENDING_SPEC_MARKS = new Set(['material.css', 'components/button.css', 'components/calendar.css']);

test('no state rule paints a literal: a fill a setting should move reads a role, a justified literal is marked spec (plan B7.4)', () => {
  const found = [];
  for (const file of sourceFiles) {
    if (PENDING_SPEC_MARKS.has(file)) continue;
    for (const { selector, prop, value, spec } of declarations(file)) {
      if (spec || /forced-colors/.test(selector)) continue;
      const stateRule = STATE.test(selector) && (PAINT.test(prop) || /^--_/.test(prop));
      if (!stateRule && !STATE_PROP.test(prop)) continue;
      // Mixing a role toward black or white is a derivation (a solid's press, a darkened ink), not a literal fill.
      const bare = value.replace(/(#000(000)?|#fff(fff)?|\bblack\b|\bwhite\b)(?=\s+(calc\(|[\d.]+%))/gi, '');
      if (LITERAL.test(bare)) found.push(`${file}: ${selector.slice(0, 100)} { ${prop}: ${value.slice(0, 80)} }`);
    }
  }
  assert.deepEqual(found, []);
});

test('the pressed and mark roles replace the literals (plan B7.4)', () => {
  const tokens = readFileSync(new URL('../../tokens/src/emit/base.ts', import.meta.url), 'utf8');
  for (const role of ['bg-mark-pressed', 'wash-pressed-light', 'wash-pressed-dark', 'bg-change-added', 'bg-change-deleted']) assert.match(tokens, new RegExp(`\\$\\{PREFIX\\}${role}\``), `${role} is derived in emit/base.ts`);
  assert.match(source['layers.css'], /--area-bg-pressed-track:\s*light-dark\(/, 'bg-pressed-track is restated with the grounds in layers.css');
  const reads = [
    ['components/segmented.css', /\.area-segmented__item:active:not\(\[data-selected\]\):not\(:disabled\) \{ background-color: var\(--area-bg-pressed-track\); \}/],
    ['components/toggle-group.css', /--_bg-active: var\(--area-bg-pressed-track\)/],
    ['components/board.css', /--_add-plate-active: var\(--area-bg-pressed-track\)/],
    ['components/chip.css', /--_bg-active: var\(--area-bg-mark-pressed\)/],
    ['components/tag.css', /--_bg: var\(--area-hue-neutral-bg\)/],
    ['components/skeleton.css', /--_skeleton-fill: var\(--area-bg-component\);[\s\S]*--_skeleton-band: var\(--area-bg-component-active\)/],
    ['components/edit-summary.css', /\.area-diff__line--added \{ background-color: var\(--area-bg-change-added\); \}/],
    ['components/code-block.css', /\.area-code-block__line--added \{\s*background-color: var\(--area-bg-change-added\);/],
  ];
  for (const [file, pattern] of reads) assert.match(source[file], pattern, `${file} reads its role`);
  // Selected words on a ground with its own ink (plan B7.4, S19): the selection reads a scoped ink, the default ink without one.
  assert.match(source['base.css'], /::selection \{[^}]*color: var\(--area-selection-ink, var\(--area-fg-default\)\)/);
});

test('nothing reads the raw accent but the documented unseen dots (plan B7.5)', () => {
  const ALLOWED = [/\.area-tree-view__unseen\b/, /\.area-tabs__unseen\b/];
  for (const { selector, body } of builtRules) {
    if (!selector.includes('.area-') || !/var\(--area-accent-(indicator|solid|surface|fg|border)[\w-]*\)/.test(body)) continue;
    assert.ok(ALLOWED.some(a => a.test(selector)), `${selector} reads the raw accent; read a Selection or Action role`);
  }
  const drag = builtRules.find(r => r.selector.includes('.area-splitter__handle[data-resizing]') && /--_sash-ink/.test(r.body));
  assert.match(drag?.body ?? '', /--_sash-ink:\s*var\(--area-focus-color\)/, 'the dragged sash reads the Selection ink');
});

test('a chosen tile or swatch draws the one selected edge (plan B7.6)', () => {
  const recipe = builtRules.find(r => r.selector.startsWith(':where(.area-asset-card') && /--_selected-edge:/.test(r.body));
  assert.ok(recipe, 'selection.css declares the selected edge');
  assert.match(recipe.body, /--_selected-ring:\s*inset 0 0 0 max\(0px, calc\(var\(--area-selected-width\) - var\(--_selected-border\)\)\) var\(--area-stroke-selected\)/);
  assert.match(recipe.body, /--_selected-edge:\s*var\(--_selected-ring\), inset 0 0 0 100vmax var\(--area-selected-tint\)/);
  // Each part on it reads the recipe; no family writes its own ring of the selected stroke. Card and choice cards draw
  // the same arithmetic over their own border and move onto the recipe with their families (named for the conductor).
  const PENDING = /^\.area-card|area-checkbox|area-radio|:is\(\.area-checkbox, \.area-radio\)|area-choice/;
  for (const { selector, body } of builtRules) {
    if (!/inset 0 0 0 [^;,]*var\(--area-stroke-selected\)/.test(body) || /--_selected-ring:/.test(body) || PENDING.test(selector)) continue;
    assert.fail(`${selector} draws its own selected ring; read var(--_selected-edge) (selection.css)`);
  }
  const parts = [
    ['.area-color-swatch-picker__cell:has(input:checked)', /box-shadow:\s*var\(--_selected-edge\)/],
    ['.area-file-grid.area-list-box--grid .area-file-grid__item[aria-selected="true"]:not([data-disabled])', /box-shadow:\s*var\(--_selected-edge\)/],
    ['.area-custom-select__option[aria-selected="true"] > .area-custom-select__preview::after', /box-shadow:\s*var\(--_selected-ring\)/],
  ];
  for (const [selector, pattern] of parts) assert.ok(builtRules.some(r => r.selector === selector && pattern.test(r.body)), `${selector} reads the selected edge`);
  for (const family of ['asset-card', 'design-card']) assert.match(source[`components/${family}.css`], /--_sel-ring: var\(--_selected-edge\)/, `${family} reads the selected edge`);
  // A grid of glyphs or words keeps the plate: List box grid, Custom select's word grid; Alignment picker the mark.
  assert.match(builtRules.find(r => r.selector === '.area-list-box--grid .area-list-box__item[aria-selected="true"]:not([data-disabled])')?.body ?? '', /background:\s*var\(--area-bg-component-active\)/);
  assert.match(source['components/alignment-picker.css'], /--_selected-mark: var\(--area-fg-selection\)/);
  // Focus reads apart from the edge by placement: a chosen tile's ring is outside it.
  assert.match(builtRules.find(r => r.selector === '.area-file-grid .area-file-grid__item.area-list-box__item:focus-visible')?.body ?? '', /outline-offset:\s*var\(--area-focus-offset\)/);
});

test('every value picker shows its value with the active plate and the check in the Selection ink (plan B7.7)', () => {
  const select = source['components/select.css'];
  assert.match(select, /\.area-select option:checked:not\(:disabled, :active\) \{ background: var\(--area-bg-component-active\); \}/);
  assert.match(select, /option::checkmark \{[^}]*background-color: var\(--area-fg-selection\)/);
  assert.match(builtRules.find(r => r.selector === '.area-custom-select--grid .area-custom-select__option[aria-selected="true"]:not(:has(> .area-custom-select__preview))')?.body ?? '', /var\(--area-bg-component-active\)/);
});

test('a selected or current row is an ink scope: its quiet parts read the row ink (plan B7.13)', () => {
  const scope = builtRules.find(r => /--area-fg-quiet:\s*var\(--area-fg-default\)/.test(r.body) && r.selector.startsWith(':where('));
  assert.ok(scope, 'selection.css declares the selection scope');
  for (const row of ['.area-menu__item[data-selected]', '.area-list-box__item[aria-selected="true"]', '.area-nav__row:has(> .area-nav__item[aria-current]:not([aria-current="false"]))',
    '.area-tree-view [role="treeitem"]:is([aria-selected="true"], [aria-current="page"])', '.area-table tbody tr:is([data-selected], [aria-selected="true"])', '[data-area-selected]:not([data-area-selected="false"])'])
    assert.ok(scope.selector.includes(row), `the scope covers ${row}`);
  // No family writes a part's ink under a selected row any more: the scope does.
  for (const { selector, body } of builtRules) {
    if (scope === undefined || selector === scope.selector) continue;
    if (/(\[aria-current\]|\[data-selected\]|\[aria-selected="true"\])[^,]*\)?\s[^,]*\.area-button/.test(selector) && /--_fg:/.test(body)) assert.fail(`${selector} sets a part's ink under a selected row; the selection scope does`);
  }
});
