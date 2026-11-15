import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { derivedTokens } from '../../tokens/src/emit/base.ts';
import { typeSizeTokens, TYPE_SIZES } from '../../tokens/src/axes/type-size.ts';
import { DENSITY_LEVELS } from '../../tokens/src/axes/density.ts';
import { RADIUS_AXIS } from '../../tokens/src/axes/radius.ts';

// The one floating surface (plan B6.1–B6.7, 2026-11-14; packages/styles/src/components/popup.css and scroll-area.css;
// DESIGN_SYSTEM.md, "Elevation", "Overlay corners", "Overlay footers" and "Scrollers"). These read the built stylesheet
// and the sources, so a family that restates the frame, the shadow stack, the list corner or the bar fails here.
const strip = css => css.replace(/\/\*[\s\S]*?\*\//g, '');
const css = strip(readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8'));
const source = name => strip(readFileSync(new URL(`../../styles/src/${name}`, import.meta.url), 'utf8'));
const rules = [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim().replace(/\s+/g, ' '), body }));
const split = selector => { const out = []; let depth = 0, from = 0; for (let i = 0; i < selector.length; i++) { const ch = selector[i]; if (ch === '(') depth++; else if (ch === ')') depth--; else if (ch === ',' && depth === 0) { out.push(selector.slice(from, i).trim()); from = i + 1; } } out.push(selector.slice(from).trim()); return out; };
const bodyOf = selector => rules.filter(rule => split(rule.selector).includes(selector)).map(rule => rule.body).join(';');

// Every floating and modal surface the shared recipe lists, and the stack it writes.
const FLOATING = ['.area-popover', '.area-menu', '.area-menu__search-surface', '.area-command-palette', '.area-dialog', '.area-drawer',
  '.area-toast', '.area-calendar:not(.area-calendar--plain)', '.area-color-picker:not(.area-color-picker--plain)'];
const STACK = 'var(--_m-layers, 0 0 0 0 transparent), var(--area-shadow-edge), var(--_elevation)';
const FAMILY_SHEETS = ['popover', 'menu', 'command-palette', 'dialog', 'confirm-dialog', 'drawer', 'toast', 'calendar', 'color-picker',
  'select', 'custom-select', 'combobox', 'tag-picker', 'hover-card', 'context-menu', 'scroll-to-latest', 'date-picker', 'filter-bar',
  'time-field', 'zoom-control', 'toolbar', 'selection-bar', 'titlebar'];

test('one floating shadow stack: the shared recipe writes it once, and no family restates the frame or a lift', () => {
  const where = `:where(${FLOATING.join(', ')})`;
  const frame = rules.find(rule => rule.selector === where && /box-shadow:\s*var\(--_float-shadow\)/.test(rule.body));
  assert.ok(frame, 'popup.css draws the frame and the stack on every floating surface');
  assert.match(frame.body, /border:\s*var\(--area-border-width\) solid var\(--area-edge-floating\)/);
  assert.match(frame.body, /background-color:\s*var\(--area-bg-float\)/);
  const stack = rules.find(rule => rule.selector.startsWith(':where(.area-popover') && rule.body.includes('--_float-shadow:'));
  assert.ok(stack.body.includes(`--_float-shadow: ${STACK}`), 'the stack is the material layers, the edge, then the role');
  assert.ok(stack.selector.includes('.area-scroll-to-latest > .area-button'), 'Scroll to latest takes the stack');
  assert.match(bodyOf(':where(.area-command-palette, .area-dialog, .area-drawer)'), /--_elevation:\s*var\(--area-shadow-modal\)/);
  assert.match(bodyOf('.area-scroll-to-latest > .area-button'), /box-shadow:\s*var\(--_float-shadow\)/);
  // Select's picker restates it on the pseudo-element, word for word.
  assert.ok(bodyOf(':where(.area-select)::picker(select)').includes(`--_float-shadow: ${STACK}`));
  // No family sheet names the float or modal role, the floating edge as a frame, or a box-shadow of its own on its root.
  for (const name of FAMILY_SHEETS) {
    const sheet = source(`components/${name}.css`);
    assert.doesNotMatch(sheet, /--area-shadow-(?:float|modal)\b/, `${name}.css names a floating role; set --_elevation in popup.css`);
    assert.doesNotMatch(sheet, /border:\s*var\(--area-border-width\) solid var\(--area-edge-floating\)/, `${name}.css restates the floating frame`);
  }
  // Tooltip is the written exception: its own role and an inset line, no material.
  assert.match(bodyOf('.area-tooltip'), /box-shadow:\s*var\(--area-shadow-tooltip\)/);
});

test('every floating surface is listed in material.css, Select\'s picker too; Tooltip is not', () => {
  const material = source('material.css');
  const overlays = material.match(/:where\(\[data-area-material\]\) :is\(([^{]*)\) \{\s*--_m-image: var\(--area-material-overlays-image\)/);
  assert.ok(overlays, 'the overlays group');
  for (const surface of ['.area-menu', '.area-popover', '.area-toast', '.area-dialog', '.area-drawer', '.area-command-palette', '.area-menu__search-surface',
    '.area-calendar:not(:where(.area-calendar--plain))', '.area-color-picker:not(:where(.area-color-picker--plain))']) {
    assert.ok(overlays[1].includes(surface), `${surface} takes the overlays' material`);
  }
  // Each painter that lists the overlays lists the two pickers as well.
  assert.ok((material.match(/\.area-calendar:not\(:where\(\.area-calendar--plain\)\)/g) ?? []).length >= 7, 'every overlay painter lists Calendar');
  assert.match(material, /\[data-area-material\] \.area-select::picker\(select\) \{[^}]*--_m-layers:\s*var\(--area-material-overlays-shadow\)/);
  assert.match(material, /--_m-fill:\s*var\(--area-bg-float\);[^}]*--_m-frame:\s*var\(--area-border-float\)/, 'the glass lies over the floating ground');
  assert.doesNotMatch(material, /\.area-tooltip/);
});

// Resolves the derivations (emit/base.ts) for a type size, density and Corner preset, as the browser does.
const derived = derivedTokens();
function resolver(base, density, corner) {
  const leaves = {};
  for (const [k, v] of Object.entries(typeSizeTokens(base))) leaves[`--area-${k}`] = v;
  leaves['--area-density-level'] = String(DENSITY_LEVELS[density]);
  Object.assign(leaves, RADIUS_AXIS.presets.find(p => p.id === corner).tokens);
  const space = name => (/^--area-space-(\d+)$/.exec(name) ?? [])[1];
  const lookup = name => { const value = leaves[name] ?? derived[name] ?? (space(name) ? `${space(name)}px` : undefined); if (value === undefined) throw new Error(`${name} is not defined`); return value; };
  const expand = value => value.replace(/var\((--area-[\w-]+)\)/g, (_, name) => `(${expand(lookup(name))})`);
  return expression => {
    const js = expand(expression).replace(/(\d*\.?\d+)px/g, '$1').replace(/round\((nearest|up|down),/g, (_, mode) => `R("${mode}",`)
      .replace(/\bcalc\(/g, '(').replace(/\b(max|min)\(/g, 'Math.$1(').replace(/\bclamp\(/g, 'C(');
    const C = (lo, x, hi) => Math.min(Math.max(lo, x), hi);
    const R = (mode, x, step) => (mode === 'up' ? Math.ceil(x / step - 1e-9) : mode === 'down' ? Math.floor(x / step + 1e-9) : Math.round(x / step)) * step;
    return Number(new Function('R', 'C', `return (${js});`)(R, C));
  };
}

// The overlay corner table, one expression per term as popup.css writes it.
const PAD = 'var(--area-space-4)';
const ROW = 'var(--area-radius-list-row)';
const corner = pad => `calc(${ROW} + (${pad} - max(0px, var(--area-space-4) - ${ROW})) * var(--area-radius-concentric))`;
const PALETTE_PAD = `max(var(--area-space-4), calc(var(--area-radius-container) - ${ROW}))`;
const TERMS = {
  'list row': ROW,
  list: corner(PAD),
  'list (token)': 'var(--area-radius-list)',
  'palette pad': PALETTE_PAD,
  palette: corner(PALETTE_PAD),
  'panel / modal': 'var(--area-radius-container)',
  'toast bar': 'var(--area-radius-control-lg)',
  'popover gap': 'min(var(--area-inset-surface-md), var(--area-space-12))',
  'dialog gap': 'min(var(--area-inset-surface-md), var(--area-space-16))',
};
const CORNERS = RADIUS_AXIS.presets.map(p => p.id);

test('the overlay corner table: rows concentric with their list and the palette at every Corner, Type and Density', () => {
  // The shared layer writes exactly these expressions.
  assert.ok(bodyOf(':where(.area-menu, .area-menu__search-surface, .area-command-palette)').includes(`--_list-corner: ${corner('var(--_list-pad)')}`));
  assert.ok(bodyOf(':where(.area-command-palette)').includes(`--_list-pad: ${PALETTE_PAD}`));
  assert.match(bodyOf('.area-menu'), /border-radius:\s*var\(--_list-corner\)/);
  assert.match(bodyOf('.area-command-palette'), /--_palette-radius:\s*var\(--_list-corner\)/);
  assert.match(bodyOf('.area-command-palette'), /--_list-inset:\s*var\(--_list-pad\)/);
  // A field's list only re-points its rows; its corner follows by the same equation.
  const field = bodyOf(':where(.area-custom-select__listbox, .area-combobox__listbox, .area-tag-picker__listbox)');
  assert.match(field, /--area-radius-list-row:/);
  assert.doesNotMatch(field, /--area-radius-list:/);
  const table = {};
  for (const base of TYPE_SIZES) for (const density of Object.keys(DENSITY_LEVELS)) for (const id of CORNERS) {
    const evaluate = resolver(base, density, id);
    const row = Object.fromEntries(Object.entries(TERMS).map(([term, expression]) => [term, evaluate(expression)]));
    const at = `type ${base} / ${density} / Corner ${id}`;
    for (const [term, value] of Object.entries(row)) assert.ok(Number.isInteger(value), `${term} at ${at} is ${value}`);
    assert.equal(row.list, row['list (token)'], `the token and the shared rule agree at ${at}`);
    // Concentric: the corner is the rows' corner plus the room round them (or the rows' own, below 4).
    assert.equal(row.list - row['list row'], Math.min(4, row['list row']), `list at ${at}`);
    assert.ok(row['palette pad'] >= 4, `palette pad at ${at}`);
    assert.equal(row.palette - row['list row'], row['list row'] >= 4 ? row['palette pad'] : Math.min(4, row['list row']), `palette at ${at}`);
    // The palette is a modal: where its padding can reach the modal corner, it is the modal corner.
    if (row['panel / modal'] - row['list row'] >= 4) assert.equal(row.palette, row['panel / modal'], `palette is the modal corner at ${at}`);
    // A list never out-rounds the surfaces except where the container is under twice its rows.
    if (row['panel / modal'] >= 2 * row['list row']) assert.ok(row.list <= row['panel / modal'], `list within the container at ${at}`);
    // B6.2: a surface's block gap never exceeds its inset.
    assert.ok(row['popover gap'] <= 12 && row['dialog gap'] <= 16, `block gaps at ${at}`);
    if (['0', '10', '14', 'pill'].includes(id)) table[at] = row;
  }
  // The values quoted in popup.css and DESIGN_SYSTEM.md, at type 13 Default.
  const d = table['type 13 / 32 / Corner 10'];
  assert.deepEqual([d['list row'], d.list, d['palette pad'], d.palette, d['panel / modal'], d['popover gap'], d['dialog gap']], [8, 12, 8, 16, 16, 12, 14]);
  assert.deepEqual([table['type 13 / 32 / Corner 0'].list, table['type 13 / 32 / Corner 0'].palette, table['type 13 / 32 / Corner 0']['palette pad']], [0, 0, 4]);
  assert.deepEqual([table['type 13 / 32 / Corner 14'].list, table['type 13 / 32 / Corner 14'].palette], [16, 20]);
  assert.deepEqual([table['type 13 / 32 / Corner pill'].list, table['type 13 / 32 / Corner pill'].palette, table['type 13 / 32 / Corner pill']['palette pad']], [19, 20, 5]);
  if (process.env.AREA_OVERLAY_TABLE) console.table(table);
});

test('B6.4: a floating list pads 4 inside its edge, the edge not counted; every other surface counts it once', () => {
  // The list's padding and corner carry no border term, so they stay even at every stroke width.
  const list = bodyOf(':where(.area-menu, .area-menu__search-surface, .area-command-palette)');
  assert.match(list, /--_list-pad:\s*var\(--area-space-4\)/);
  assert.doesNotMatch(list, /border-width/);
  assert.match(bodyOf('.area-menu'), /padding:\s*var\(--_inset\)/);
  assert.match(bodyOf('.area-menu'), /--_inset:\s*var\(--_list-pad\)/);
  // Popover, Dialog, Drawer and Toast subtract their edge from the inset.
  assert.match(bodyOf('.area-popover'), /--_inset:\s*calc\(var\(--area-popover-inset, var\(--area-space-12\)\) - var\(--area-border-width\)\)/);
  assert.match(bodyOf('.area-dialog'), /--_dialog-inset:\s*calc\(var\(--_dialog-outer\) - var\(--area-border-width\)\)/);
  assert.match(bodyOf('.area-drawer'), /--_drawer-inset:\s*calc\(var\(--_drawer-outer\) - var\(--area-border-width\)\)/);
  assert.match(bodyOf('.area-toast'), /padding:[^;]*- var\(--area-border-width\)/);
});

test('B6.2: a surface\'s block gap is the md inset, never more than its own inset', () => {
  assert.match(bodyOf(':where(.area-popover, .area-dialog, .area-drawer)'), /--_block-gap:\s*min\(var\(--area-inset-surface-md\), var\(--_block-inset, var\(--area-inset-surface-md\)\)\)/);
  assert.match(bodyOf('.area-popover'), /--_block-inset:\s*var\(--area-popover-inset, var\(--area-space-12\)\)/);
  assert.match(bodyOf('.area-dialog'), /--_block-inset:\s*var\(--_dialog-outer\)/);
  assert.match(bodyOf('.area-drawer'), /--_block-inset:\s*var\(--_drawer-outer\)/);
  for (const name of ['popover', 'dialog', 'drawer']) {
    const root = [...source(`components/${name}.css`).matchAll(new RegExp(`(?:^|\\n)\\s*\\.area-${name} \\{([^}]*)\\}`, 'g'))].map(m => m[1]).join(';');
    assert.doesNotMatch(root, /(?:^|[;\s])gap:/, `${name}.css sets its own block gap`);
  }
  // The scrolled rule sits in the middle of that gap.
  assert.match(bodyOf('.area-dialog__header::after'), /var\(--_block-gap\) \/ 2/);
});

test('B6.3: the modal family and the palette expose their widths', () => {
  assert.match(bodyOf('.area-dialog'), /--_dialog-size:\s*var\(--area-dialog-inline-size,/);
  assert.match(bodyOf('.area-drawer'), /--_drawer-size:\s*var\(--area-drawer-inline-size, 384px\)/);
  assert.match(bodyOf('.area-command-palette'), /var\(--area-command-palette-inline-size, 600px\)/);
  assert.match(bodyOf('.area-confirm-dialog'), /var\(--area-confirm-dialog-inline-size, 420px\)/);
});

test('B6.5: one footer pair, and a corner close that follows its title', () => {
  assert.match(bodyOf(':where(.area-dialog__footer, .area-drawer__footer, .area-popover__footer, .area-approval__footer) > .area-button:not(.area-button--icon-only)'),
    /min-inline-size:\s*round\(up, calc\(var\(--_height\) \* 2\.25\), 1px\)/);
  // A corner control beside a title (the one named exception): the title's cap on the inset with or without the close,
  // the close centred on the cap ((1cap − H) / 2 above and below), its glyph on the column, its corner from the nearer
  // distance (rendered: tests/behaviour/suites/wrap.test.mjs; computed: bars.test.mjs).
  const dismiss = bodyOf(':is(.area-dialog__header, .area-drawer__header) > :is(.area-dialog__dismiss, .area-drawer__dismiss)');
  assert.match(dismiss, /--_cc-top:\s*round\(nearest, calc\(\(1cap - var\(--_height\)\) \/ 2\), 1px\)/);
  assert.match(dismiss, /margin-block:\s*var\(--_cc-top\)/);
  assert.match(dismiss, /--_cc-near:\s*min\(var\(--_cc-distance\), calc\(var\(--_cc-inset\) \+ var\(--_cc-top\)\)\)/);
  assert.match(dismiss, /margin-inline-end:\s*calc\(-1 \* var\(--_cc-pull\)\)/);
  const popoverClose = bodyOf('.area-popover__header:has(> .area-popover__title) > .area-button');
  assert.match(popoverClose, /margin-block:\s*var\(--_cc-top\)/);
  assert.match(popoverClose, /--_cc-near:/);
  assert.match(bodyOf('.area-popover__header > .area-popover__title'), /text-box:\s*trim-start cap alphabetic/);
  // No rule moves a title off the inset because a close is there.
  assert.ok(!rules.some(rule => /:has\(> :is\(\.area-dialog__dismiss/.test(rule.selector) && /__title/.test(rule.selector) && /margin-block-start/.test(rule.body)), 'a title moves beside a close');
  assert.ok(!rules.some(rule => /dialog__title/.test(rule.selector) && /text-box:\s*none/.test(rule.body)), 'no rule untrims the title beside a close');
  assert.match(bodyOf(':is(.area-dialog__heading, .area-drawer__heading) > :is(.area-dialog__description, .area-drawer__description):last-child'), /text-box:\s*trim-end cap alphabetic/);
  assert.match(bodyOf(':is(.area-dialog__heading, .area-drawer__heading) > :is(.area-dialog__title, .area-drawer__title):last-child'), /text-box:\s*trim-both cap alphabetic/);
  // The canonical secondary is soft neutral: Confirm dialog's Cancel, and the Dialog and Drawer demos.
  const confirm = readFileSync(new URL('../src/components/ConfirmDialog.tsx', import.meta.url), 'utf8');
  assert.match(confirm, /<Button ref=\{cancelRef\} variant="soft" tone="neutral"[^\n]*>\{cancelLabel\}<\/Button>/);
});

test('B6.6: one scroller, corner-aware ends, a cue at the end', () => {
  // The thumb is one value, read by the overlay bar and every thin native bar.
  const thumb = /--_bar-thumb:\s*color-mix\(in oklab, var\(--area-fg-default\) 18%, transparent\)/;
  assert.match(bodyOf(':where(.area-scroll-area, .area-textarea, .area-code-block__pre, .area-table-wrapper, .area-command-palette__preview)'), thumb);
  const thin = bodyOf(':where(.area-textarea, .area-code-block__pre, .area-table-wrapper, .area-command-palette__preview)');
  assert.match(thin, /scrollbar-width:\s*thin/);
  assert.match(thin, /scrollbar-color:\s*var\(--_bar-thumb\) transparent/);
  assert.equal((css.match(/--_bar-thumb:\s*color-mix/g) ?? []).length, 2, 'the thumb is written once, and once on the native picker');
  // Every scrolling body in the listed families is a Scroll area or reads the thin bar.
  for (const name of ['dialog', 'drawer', 'command-palette', 'menu', 'panel']) {
    const sheet = source(`components/${name}.css`);
    for (const [, selector] of sheet.matchAll(/([^{};]+)\{[^}]*overflow(?:-y)?:\s*auto/g)) {
      const parts = split(selector.trim()).filter(part => !/scroll-area/.test(part));
      for (const part of parts) {
        const scrollAreaRule = new RegExp(`${part.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.area-scroll-area|${part.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[popover\\]`);
        assert.ok(scrollAreaRule.test(sheet) || /preview/.test(part), `${part} in ${name}.css scrolls with the platform's bar`);
      }
    }
  }
  // Corner-aware ends: the track's ends stand in by the corner less the side inset.
  assert.match(bodyOf('.area-scroll-area'), /--_bar-end:\s*max\(0px, calc\(var\(--_bar-corner\) - var\(--_bar-inset\)\)\)/);
  assert.match(bodyOf('.area-scroll-area__scrollbar[data-orientation="vertical"]'), /inset-block:\s*var\(--_bar-end\)/);
  assert.match(bodyOf('.area-scroll-area__scrollbar[data-orientation="horizontal"]'), /inset-inline:\s*var\(--_bar-end\)/);
  assert.match(bodyOf('.area-menu.area-scroll-area'), /--_bar-corner:\s*var\(--_list-corner\)/);
  // The end cue mirrors the header's scrolled rule at the footer.
  assert.match(css, /:is\(\.area-dialog, \.area-drawer\):has\(> :is\(\.area-dialog__body, .area-drawer__body\)\.area-scroll-area\[data-scroll-more\]\) > :is\(\.area-dialog__footer, \.area-drawer__footer\)::before\s*\{\s*opacity:\s*1;?\s*\}/);
  const scrollArea = readFileSync(new URL('../src/components/ScrollArea.tsx', import.meta.url), 'utf8');
  assert.match(scrollArea, /toggleAttribute\("data-scroll-more"/);
  const dialog = readFileSync(new URL('../src/components/Dialog.tsx', import.meta.url), 'utf8');
  assert.match(dialog, /<ScrollArea className="area-dialog__body"/);
});

test('B6.7: Alert and Toast agree on inset, gaps and action placement, with no width query', () => {
  const alert = source('components/alert.css');
  assert.doesNotMatch(alert, /@container/, 'actions never move by a width query');
  assert.doesNotMatch(alert, /container-type/);
  // One inset: the sm surface inset at the sides, the icon as far from the top as from the side.
  assert.match(bodyOf('.area-alert'), /--_alert-pad-block:\s*calc\(var\(--area-inset-surface-sm\) \+ \(var\(--area-icon-md\) - var\(--area-ui-leading\)\) \/ 2 - var\(--area-border-width\)\)/);
  assert.match(bodyOf('.area-toast'), /padding:\s*calc\(var\(--area-inset-surface-sm\) \+ \(var\(--area-icon-md\) - var\(--area-ui-leading\)\) \/ 2 - var\(--area-border-width\)\) calc\(var\(--area-inset-surface-sm\) - var\(--area-border-width\)\)/);
  // One gap between the icon, the text and the actions: ui-cluster.
  assert.match(bodyOf('.area-toast'), /gap:\s*var\(--area-ui-cluster\)/);
  assert.match(bodyOf('.area-alert:not(.area-alert--banner) > .area-alert__icon'), /margin-inline-end:\s*var\(--area-ui-cluster\)/);
  assert.match(bodyOf('.area-alert:not(.area-alert--banner) > :is(.area-alert__actions, .area-alert__dismiss)'), /margin-inline-start:\s*var\(--area-ui-cluster\)/);
  // One icon box, one first line tall; one title weight; one bar corner.
  assert.match(bodyOf('.area-alert__icon'), /block-size:\s*var\(--area-ui-leading\)/);
  assert.match(bodyOf('.area-toast__icon'), /block-size:\s*var\(--area-ui-leading\)/);
  assert.match(bodyOf('.area-alert__title'), /font-weight:\s*var\(--area-weight-strong\)/);
  assert.match(bodyOf('.area-toast__title'), /font-weight:\s*var\(--area-weight-strong\)/);
  assert.match(bodyOf('.area-alert'), /var\(--area-radius-control-lg\)/);
  assert.match(bodyOf('.area-toast'), /border-radius:\s*var\(--area-radius-control-lg\)/);
  // Actions wrap to a second row only when the text no longer fits beside them: a wrapping row whose text asks for its
  // whole line and never leaves the icon's, the actions at the end, the close out of the row (rendered: tests/behaviour
  // suites/wrap.test.mjs, type 12, 13 and 16 at every density).
  const row = ':not(.area-alert--banner, .area-alert--multiline)';
  assert.match(bodyOf(`.area-alert${row}`), /flex-wrap:\s*wrap/);
  assert.match(bodyOf(`.area-alert${row}`), /row-gap:\s*calc\(var\(--area-ui-cluster\) - var\(--_alert-control-block\)\)/);
  assert.match(bodyOf(`.area-alert${row} > .area-alert__content`), /flex:\s*1 1 auto/);
  assert.match(bodyOf(`.area-alert${row} > .area-alert__actions`), /margin-inline-start:\s*auto/);
  assert.match(bodyOf(`.area-alert${row} > .area-alert__dismiss:is(*, :last-child)`), /position:\s*absolute/);
  assert.match(bodyOf('.area-toast'), /flex-wrap:\s*wrap/);
  assert.match(bodyOf('.area-toast:has(> .area-toast__content)'), /row-gap:\s*calc\(var\(--area-ui-cluster\) - var\(--_toast-control-block\)\)/);
  assert.match(bodyOf('.area-toast > .area-toast__content'), /flex:\s*1 1 auto/);
  assert.match(bodyOf('.area-toast > :is(.area-toast__actions, .area-toast__action)'), /margin-inline-start:\s*auto/);
  assert.match(bodyOf('.area-toast > .area-toast__dismiss:is(*, :last-child)'), /position:\s*absolute/);
  // Several actions wrap among themselves.
  assert.match(bodyOf('.area-alert__actions'), /flex-wrap:\s*wrap/);
});

test('Tag picker\'s empty line is Menu\'s', () => {
  assert.doesNotMatch(css, /\.area-tag-picker__empty/);
  const picker = readFileSync(new URL('../src/components/TagPicker.tsx', import.meta.url), 'utf8');
  assert.match(picker, /<div className="area-menu__empty" role="presentation"><span className="area-menu__text">\{emptyText\}<\/span><\/div>/);
});

test('every overlay footer\'s Cancel is the pair\'s soft neutral secondary, in demos, examples and the app', async () => {
  // The footer pair (plan B6.5, popup.css): a soft neutral Cancel beside a solid primary. A Dialog, Drawer or Popover
  // whose footer holds a "Cancel" Button of another emphasis fails here. WAITING lists app screens not yet moved
  // (each a later change); it may only shrink.
  const { readdirSync, statSync } = await import('node:fs');
  const ROOT = new URL('../../../apps/desktop/src/', import.meta.url);
  const WAITING = new Set(['pages/home.tsx', 'pages/project.tsx', 'publish.tsx']);
  const files = [];
  const walk = dir => { for (const name of readdirSync(dir)) { const url = new URL(name, dir); if (statSync(url).isDirectory()) walk(new URL(`${name}/`, dir)); else if (name.endsWith('.tsx')) files.push(url); } };
  walk(ROOT);
  const found = new Set();
  const misses = [];
  for (const url of files) {
    const rel = url.pathname.slice(ROOT.pathname.length);
    const text = readFileSync(url, 'utf8');
    for (const m of text.matchAll(/footer=\{/g)) {
      const before = text.slice(Math.max(0, m.index - 2000), m.index);
      const open = [...before.matchAll(/<(Dialog|Drawer|Popover|ConfirmDialog)\b/g)].at(-1);
      if (!open || /<\/(Dialog|Drawer|Popover|ConfirmDialog)>/.test(before.slice(open.index))) continue;
      // The footer expression, braces balanced.
      let depth = 0, end = m.index + 'footer='.length;
      for (; end < text.length; end++) { if (text[end] === '{') depth++; else if (text[end] === '}' && --depth === 0) break; }
      const footer = text.slice(m.index, end);
      for (const button of footer.matchAll(/<Button\b([^>]*)>\s*Cancel\s*<\/Button>/g)) {
        const props = button[1];
        if (/variant="soft"/.test(props) && /tone="neutral"/.test(props)) continue;
        if (WAITING.has(rel)) { found.add(rel); continue; }
        misses.push(`${rel}: ${button[0]}`);
      }
    }
  }
  assert.deepEqual(misses, [], 'a footer Cancel is not soft neutral');
  for (const rel of WAITING) assert.ok(found.has(rel), `${rel} is moved: take it off WAITING`);
});
