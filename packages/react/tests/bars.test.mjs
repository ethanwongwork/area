import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { baseTokens, derivedTokens } from '../../tokens/src/emit/base.ts';
import { typeSizeTokens, TYPE_SIZES } from '../../tokens/src/axes/type-size.ts';
import { DENSITY_LEVELS } from '../../tokens/src/axes/density.ts';
import { RADIUS_AXIS } from '../../tokens/src/axes/radius.ts';
import { AXES, defaultPresetOf } from '../../tokens/src/axes/registry.ts';

// The shared bars and corners (plan B4.1–B4.4, 2026-11-14; packages/styles/src/inset.css, "Two header bars", "A corner
// control", "Edge ghost buttons" and "One collapsible head"; DESIGN_SYSTEM.md, "Header bars" and "A button set into a
// corner"). These read the built stylesheet and resolve the recipes at every type, density and Corner, so a family that
// restates a bar height or a corner control's corner, or a setting that leaves a recipe off the pixel grid, fails here.
// AREA_BAR_TABLE=1 prints the values.
const strip = css => css.replace(/\/\*[\s\S]*?\*\//g, '');
const css = strip(readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8'));
const source = name => strip(readFileSync(new URL(`../../styles/src/${name}`, import.meta.url), 'utf8'));
const rules = [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim().replace(/\s+/g, ' '), body }));
const split = selector => { const out = []; let depth = 0, from = 0; for (let i = 0; i < selector.length; i++) { const ch = selector[i]; if (ch === '(') depth++; else if (ch === ')') depth--; else if (ch === ',' && depth === 0) { out.push(selector.slice(from, i).trim()); from = i + 1; } } out.push(selector.slice(from).trim()); return out; };
const bodyOf = selector => rules.filter(rule => split(rule.selector).includes(selector)).map(rule => rule.body).join(';');
const term = (body, prop) => body.match(new RegExp(`(?:^|[;\\s])${prop.replace(/[-]/g, '\\-')}\\s*:\\s*([^;]+)`))?.[1].trim().replace(/\s+/g, ' ');

const derived = derivedTokens();
const defaults = {};
for (const axis of AXES) Object.assign(defaults, defaultPresetOf(axis)?.tokens ?? {});
Object.assign(defaults, baseTokens());
function resolver(base, density, corner) {
  const leaves = { ...defaults };
  for (const [k, v] of Object.entries(typeSizeTokens(base))) leaves[`--area-${k}`] = v;
  leaves['--area-density-level'] = String(DENSITY_LEVELS[density]);
  Object.assign(leaves, RADIUS_AXIS.presets.find(p => p.id === corner).tokens);
  const lookup = name => { const value = leaves[name] ?? derived[name]; if (value === undefined) throw new Error(`${name} is not defined`); return value; };
  const expand = value => value.replace(/var\((--area-[\w-]+)\)/g, (_, name) => `(${expand(lookup(name))})`);
  return expression => {
    const js = expand(expression).replace(/(\d*\.?\d+)px/g, '$1').replace(/round\((nearest|up|down),/g, (_, mode) => `R("${mode}",`)
      .replace(/\bcalc\(/g, '(').replace(/\b(max|min)\(/g, 'Math.$1(').replace(/\bclamp\(/g, 'C(');
    const C = (lo, x, hi) => Math.min(Math.max(lo, x), hi);
    const R = (mode, x, step) => (mode === 'up' ? Math.ceil(x / step - 1e-9) : mode === 'down' ? Math.floor(x / step + 1e-9) : Math.round(x / step)) * step;
    if (/var\(--_/.test(js)) throw new Error(`unresolved private property in ${expression}`);
    return Number(new Function('R', 'C', `return (${js});`)(R, C));
  };
}
const DENSITIES = Object.keys(DENSITY_LEVELS);
const CORNERS = RADIUS_AXIS.presets.map(p => p.id);
const MAX = CORNERS[CORNERS.length - 1];

// --- B4.1 -------------------------------------------------------------------------------------------------------------
const BAR_ROOTS = ':where(.area-panel, .area-titlebar, .area-command-palette__search, .area-board-column__header, .area-color-picker, .area-color-picker__header)';

test('two header bars: one shared recipe, whole at every type and density, and every bar reads it', () => {
  const recipe = bodyOf(BAR_ROOTS);
  assert.ok(recipe, 'the header bar recipe is missing (inset.css, "Two header bars")');
  assert.equal(term(recipe, '--_hb-rule'), '0px');
  assert.equal(term(recipe, '--_hb-region'), 'calc(var(--area-control-sm) + var(--_hb-region-room) * 2 + var(--_hb-rule))');
  assert.equal(term(recipe, '--_hb-tool'), 'calc(var(--area-control-md) + var(--_hb-tool-room) * 2 + var(--_hb-rule))');
  assert.equal(term(recipe, '--_hb-tool-room'), 'var(--area-ui-cluster)');
  const regionRoom = term(recipe, '--_hb-region-room');
  const region = `calc(var(--area-control-sm) + ${regionRoom} * 2)`;
  const tool = 'calc(var(--area-control-md) + var(--area-ui-cluster) * 2)';
  const table = {};
  for (const base of TYPE_SIZES) for (const density of DENSITIES) {
    const evaluate = resolver(base, density, '10');
    const row = { region: evaluate(region), tool: evaluate(tool), 'region room': evaluate(regionRoom), 'tool room': evaluate('var(--area-ui-cluster)') };
    for (const [name, value] of Object.entries(row)) assert.ok(Number.isInteger(value), `${name} at type ${base} / ${density} is ${value}`);
    assert.equal(row['region room'], 7, 'the region bar holds its control 7 above and below at every type and density');
    // Only at type 12 Compact, where both controls sit on the 24 floor, is the tool bar (24 + 2 × 6 = 36) under the region
    // bar (38): the cluster space there is 6, the region room 7.
    if (row.tool < row.region) assert.ok(base === 12 && density === '28', `the tool bar is under the region bar at type ${base} / ${density}`);
    table[`type ${base} / ${density}`] = row;
  }
  if (process.env.AREA_BAR_TABLE) console.table(table);
  // Each family reads one bar; none restates a height.
  assert.match(bodyOf('.area-panel'), /--_bar:\s*var\(--_hb-tool\)/, "Panel's md bar is the tool bar");
  assert.match(bodyOf('.area-panel'), /--_bar-rule:\s*var\(--_hb-rule\)/, "Panel's md bar counts no rule: it draws none");
  assert.match(bodyOf('.area-panel--window-bar'), /--_bar:\s*var\(--_hb-region\)/, 'a window bar is the region bar');
  assert.match(bodyOf('.area-titlebar'), /block-size:\s*var\(--_hb-tool\)/, "Titlebar md is the tool bar");
  assert.match(bodyOf('.area-titlebar'), /--_hb-rule:\s*var\(--_titlebar-rule\)/, 'Titlebar counts the rule it draws');
  assert.match(bodyOf('.area-titlebar--sm:not(.area-titlebar--floating)'), /block-size:\s*var\(--_hb-region\)/, 'Titlebar sm is the region bar');
  assert.match(bodyOf('.area-command-palette__search'), /min-block-size:\s*var\(--_hb-tool\)/, "the palette's search is the tool bar");
  assert.match(bodyOf('.area-command-palette__search'), /--_hb-rule:\s*var\(--area-border-width\)/, 'the search counts its rule');
  assert.match(bodyOf('.area-board-column__header'), /min-block-size:\s*var\(--_hb-region\)/, "Board's column header is the region bar");
  assert.match(bodyOf('.area-color-picker__header'), /min-block-size:\s*var\(--_hb-region\)/, "Color picker's header is the region bar");
  // Toolbar surface md is the tool bar by its own inset: the medium control and the cluster space round it.
  assert.match(bodyOf('.area-toolbar--surface'), /--_toolbar-inset:\s*var\(--area-ui-cluster\)/);
  assert.match(bodyOf('.area-toolbar'), /block-size:\s*calc\(var\(--_height\) \+ 2 \* var\(--_toolbar-inset\)\)/);
  // No bar sets a fixed height.
  for (const bar of ['.area-panel__bar', '.area-command-palette__search', '.area-board-column__header', '.area-color-picker__header', '.area-titlebar']) {
    for (const rule of rules.filter(r => split(r.selector).some(one => one.endsWith(bar)))) {
      assert.doesNotMatch(rule.body, /(?:^|[;\s])(?:min-)?block-size:\s*\d+px/, `${rule.selector} sets a fixed bar height`);
    }
  }
});

// --- B4.2 -------------------------------------------------------------------------------------------------------------
const CC_CONTROLS = ['.area-dialog__dismiss', '.area-drawer__dismiss', '.area-popover__header > .area-button',
  '.area-toast > :is(.area-toast__actions, .area-toast__action, .area-toast__dismiss):last-child > .area-button:last-child',
  '.area-alert > .area-alert__dismiss > .area-button', '.area-alert > .area-alert__actions:last-child > .area-button:last-child',
  '.area-alert--multiline > .area-alert__actions > .area-button:last-child', '.area-calendar__nav > .area-button',
  '.area-queue__item .area-button', '.area-edit-summary__head .area-button', '.area-edit-summary__file .area-button',
  '.area-panel__bar > .area-button:last-child', '.area-color-picker__header > .area-button:last-child',
  '.area-code-block__header > .area-code-block__actions:last-child > .area-button:last-child',
  '.area-code-block > .area-code-block__actions > .area-button:last-child'];
const SHAPE = 'max(min(var(--_height) / 2, var(--_cc-round, var(--_cc-own))), var(--_button-pill) * var(--area-radius-full))'; // a pill is radius-full, one value
const ROUND = 'max(min(var(--area-radius-floor), var(--_cc-own)), calc(var(--_cc-corner) - var(--_cc-near, var(--_cc-distance)) * var(--area-radius-concentric)), calc(var(--_cc-own) - (0.5 - var(--area-radius-factor)) * 1000px))';

test('a corner control: one derivation, and every corner control reads it', () => {
  const recipe = rules.find(rule => rule.selector.startsWith(':is(.area-dialog__dismiss,') && rule.selector.endsWith(').area-button'));
  assert.ok(recipe, 'the corner control recipe is missing (inset.css, "A corner control")');
  for (const control of CC_CONTROLS) assert.ok(recipe.selector.includes(control), `${control} is outside the corner control recipe`);
  assert.equal(term(recipe.body, '--_shape'), SHAPE);
  assert.equal(term(recipe.body, '--_cc-round'), ROUND);
  assert.equal(term(recipe.body, '--_cc-pull'), 'calc((var(--_height) - var(--_icon)) / 2)');
  assert.equal(term(recipe.body, '--_cc-distance'), 'var(--_cc-at, calc(var(--_cc-inset) - var(--_cc-glyph, 1) * var(--_cc-pull)))');
  // No family writes its own corner for these controls any more.
  for (const sheet of ['queue', 'edit-summary', 'dialog', 'drawer', 'popover', 'toast', 'alert', 'calendar', 'panel', 'color-picker', 'code-block']) {
    assert.doesNotMatch(source(`components/${sheet}.css`), /--_shape\s*:|--_(?:head|row)-button-radius/, `${sheet}.css writes a corner control's corner of its own`);
  }
  // Each surface publishes the corner its control sits in.
  const publishes = { '.area-dialog': '--_dialog-radius', '.area-drawer--bottom': '--_drawer-radius', '.area-popover': '--_popover-radius',
    '.area-toast': '--area-radius-control-lg', '.area-alert': '--_alert-radius', '.area-calendar': '--_fr-block', '.area-panel': '--_panel-corner',
    '.area-color-picker': '--_fr-block', '.area-queue__item': '--area-radius-row' };
  for (const [surface, corner] of Object.entries(publishes)) assert.ok((term(bodyOf(surface), '--_cc-corner') ?? '').includes(corner), `${surface} does not publish its corner`);
  for (const square of ['.area-panel--flush', '.area-alert--flush', '.area-code-block--flush', '.area-calendar--plain']) {
    assert.equal(term(bodyOf(square), '--_cc-corner'), 'initial', `${square} is square: its control keeps its own corner`);
  }
});

// The controls as the families place them: [height tier, icon, distance from both outer edges, the corner it sits in].
const own = tier => `min(var(--area-radius-control-${tier}), max(var(--area-radius-min), round(down, calc(var(--area-control-${tier}) * var(--area-radius-factor)), 2px)))`;
const glyph = (tier, inset) => `calc(${inset} - (var(--area-control-${tier}) - var(--area-icon-${tier})) / 2)`;
const CHAT = 'min(var(--area-radius-container), calc(var(--area-radius-control-md) + var(--area-ui-cluster) * var(--area-radius-concentric)))';
// Equidistant controls (no title beside them). Dialog's, Drawer's and a titled Popover's close are the one named
// exception, a corner control beside a title (TITLED, below).
const CASES = {
  'Popover close, no title': ['sm', glyph('sm', 'var(--area-space-12)'), 'var(--area-radius-container)'],
  'Toast end, one line': ['sm', glyph('sm', 'var(--area-inset-surface-sm)'), 'var(--area-radius-control-lg)'],
  'Toast end, titled': ['sm', glyph('sm', 'var(--area-inset-surface-sm)'), 'var(--area-radius-container)'],
  'Calendar step': ['sm', 'var(--area-inset-surface-sm)', 'var(--area-radius-container)'],
  'Queue row action': ['sm', 'calc((var(--area-ui-row) - var(--area-control-sm)) / 2)', 'var(--area-radius-row)'],
  'Edit summary head': ['sm', 'calc(var(--area-stroke-width) + (var(--area-ui-row) - var(--area-control-sm)) / 2)', CHAT],
  'Panel bar action': ['sm', 'calc(var(--area-border-width) + (var(--area-control-md) + var(--area-ui-cluster) * 2 - var(--area-control-sm)) / 2)', 'var(--area-radius-container)'],
  'Color picker header': ['sm', 'calc(var(--area-border-width) + (var(--area-space-16) - var(--area-space-2)) / 2)', 'var(--area-radius-container)'],
  'Alert banner end': ['sm', 'calc(var(--area-inset-surface-md) - var(--area-space-4) + (var(--area-ui-leading) - var(--area-control-sm)) / 2)', 'var(--area-radius-control-lg)'],
  'Code block copy, header': ['sm', 'calc(var(--area-stroke-width) + var(--area-space-4))', CHAT],
  'Code block copy, floating': ['sm', 'calc(var(--area-stroke-width) + var(--area-space-12) + (var(--area-text-base-leading) - var(--area-control-sm)) / 2)', CHAT],
};

test('corner controls are whole, concentric where the floor allows, and square at Sharp, at every type, density and Corner', () => {
  const table = {};
  for (const base of TYPE_SIZES) for (const density of DENSITIES) for (const corner of CORNERS) {
    const evaluate = resolver(base, density, corner);
    const at = `type ${base} / ${density} / Corner ${corner}`;
    for (const [name, [tier, distanceOf, cornerOf]] of Object.entries(CASES)) {
      const H = evaluate(`var(--area-control-${tier})`);
      const distance = evaluate(distanceOf);
      const surface = evaluate(cornerOf);
      const self = evaluate(own(tier));
      const round = evaluate(ROUND.replaceAll('var(--_cc-own)', own(tier)).replace('var(--_cc-corner)', cornerOf).replace('var(--_cc-near, var(--_cc-distance))', distanceOf));
      const shape = Math.min(H / 2, round);
      assert.ok(Number.isInteger(distance) && distance >= 0, `${name}: distance ${distance} at ${at}`);
      assert.ok(Number.isInteger(shape) && shape >= 0, `${name}: corner ${shape} at ${at}`);
      assert.ok(shape <= H / 2, `${name}: corner past half its height at ${at}`);
      if (corner === '0') assert.equal(shape, 0, `${name} is square at Sharp (${at})`);
      // Concentric: the control's corner and its distance make the corner it sits in, unless the floor or half its
      // height stops it.
      const floor = Math.min(evaluate('var(--area-radius-floor)'), self);
      if (corner === 'pill') assert.ok(shape >= self, `${name} is never squarer than every control at Pill (${at})`);
      else if (surface - distance >= floor && surface - distance <= H / 2) assert.equal(shape + distance, surface, `${name} is not concentric at ${at}`);
      if (['12', '13', '16'].includes(String(base)) && ['0', '10', MAX].includes(corner)) (table[name] ??= {})[at] = `${distance} in, corner ${shape} in ${surface}`;
    }
  }
  if (process.env.AREA_BAR_TABLE) for (const [name, rows] of Object.entries(table)) { console.log(name); console.table(rows); }
});

// A corner control beside a title (plan B6.5, the one named exception; DESIGN_SYSTEM.md, "Bars and corner controls"): the
// title's cap on the inset, the control centred on the cap (its top distance), its glyph on the side column (its side
// distance), and its corner from the nearer of the two. [tier, inset, the control's top below the inset, the corner].
const CAP_EM = 0.71; // the face's cap height per em (Geist 710 / 1000)
const TITLED = {
  'Dialog close': ['md', 'var(--area-space-16)', 'round(nearest, calc((CAP - var(--area-control-md)) / 2), 1px)', 'var(--area-radius-container)'],
  'Popover close, titled': ['sm', 'var(--area-space-12)', 'round(nearest, calc((CAP - var(--area-control-sm)) / 2), 1px)', 'var(--area-radius-container)'],
};

test('a corner control beside a title: centred on the cap, glyph on the column, its corner from the nearer distance', () => {
  // The families write the exception's input.
  assert.match(bodyOf(':is(.area-dialog__header, .area-drawer__header) > :is(.area-dialog__dismiss, .area-drawer__dismiss)'), /--_cc-near:\s*min\(var\(--_cc-distance\), calc\(var\(--_cc-inset\) \+ var\(--_cc-top\)\)\)/);
  assert.match(bodyOf('.area-popover__header:has(> .area-popover__title) > .area-button'), /--_cc-near:\s*min\(var\(--_cc-distance\), calc\(var\(--_cc-inset\) \+ var\(--_cc-top\)\)\)/);
  const table = {};
  for (const base of TYPE_SIZES) for (const density of DENSITIES) for (const corner of CORNERS) {
    const evaluate = resolver(base, density, corner);
    const at = `type ${base} / ${density} / Corner ${corner}`;
    for (const [name, [tier, inset, topOf, cornerOf]] of Object.entries(TITLED)) {
      const H = evaluate(`var(--area-control-${tier})`);
      const top = evaluate(`calc(${inset} + ${topOf.replaceAll('CAP', `${CAP_EM * base}px`)})`);
      const side = evaluate(glyph(tier, inset));
      const near = Math.min(top, side);
      const surface = evaluate(cornerOf);
      const self = evaluate(own(tier));
      const round = evaluate(ROUND.replaceAll('var(--_cc-own)', own(tier)).replace('var(--_cc-corner)', cornerOf).replace('var(--_cc-near, var(--_cc-distance))', `${near}px`));
      const shape = Math.min(H / 2, round);
      assert.ok(Number.isInteger(top) && Number.isInteger(side) && top >= 0, `${name}: ${top} / ${side} at ${at}`);
      // Centred on the cap: its centre is the cap's centre (the cap on the inset), within the whole-pixel rounding.
      const capCentre = evaluate(inset) + CAP_EM * base / 2;
      assert.ok(Math.abs(top + H / 2 - capCentre) <= 0.5, `${name}: centre ${top + H / 2} vs cap ${capCentre} at ${at}`);
      assert.ok(Number.isInteger(shape) && shape >= 0 && shape <= H / 2, `${name}: corner ${shape} at ${at}`);
      if (corner === '0') assert.equal(shape, 0, `${name} is square at Sharp (${at})`);
      const floor = Math.min(evaluate('var(--area-radius-floor)'), self);
      if (corner !== 'pill' && surface - near >= floor && surface - near <= H / 2) assert.equal(shape + near, surface, `${name} is not concentric with its nearer distance at ${at}`);
      if (['12', '13', '16'].includes(String(base)) && ['0', '10', MAX].includes(corner)) (table[name] ??= {})[at] = `top ${top}, side ${side}, corner ${shape} in ${surface}`;
    }
  }
  if (process.env.AREA_BAR_TABLE) for (const [name, rows] of Object.entries(table)) { console.log(name); console.table(rows); }
});

// --- B4.3 -------------------------------------------------------------------------------------------------------------
test('edge ghost buttons pull out by their gutter so the glyph sits on the column; other emphases keep the plate there', () => {
  assert.equal(term(bodyOf('.area-button'), '--_pull-start'), 'calc(var(--_inset-start) + var(--_box-border))');
  assert.equal(term(bodyOf('.area-button'), '--_pull-end'), 'calc(var(--_inset-end) + var(--_box-border))');
  assert.match(bodyOf('.area-button--start.area-button--ghost'), /margin-inline-start:\s*calc\(-1 \* var\(--_pull-start\)\)/);
  assert.match(bodyOf('.area-button--end.area-button--ghost'), /margin-inline-end:\s*calc\(-1 \* var\(--_pull-end\)\)/);
  assert.equal(bodyOf('.area-button--start'), '', 'align pulls a ghost Button only: a plate that is seen stays on the column');
  assert.equal(bodyOf('.area-button--end'), '', 'align pulls a ghost Button only: a plate that is seen stays on the column');
  assert.match(bodyOf('.area-card__header-action > .area-button--ghost:last-child'), /margin-inline-end:\s*calc\(-1 \* var\(--_pull-end\)\)/);
  assert.match(bodyOf('.area-message--assistant > .area-message__actions > .area-button--ghost:first-child'), /margin-inline-start:\s*calc\(-1 \* var\(--_pull-start\)\)/);
  assert.match(bodyOf('.area-message--user > .area-message__actions > .area-button--ghost:last-child'), /margin-inline-end:\s*calc\(-1 \* var\(--_pull-end\)\)/);
  // An icon-only Button's pull is (H − icon) / 2: its start inset is the icon's box, less the border, plus the border.
  for (const base of TYPE_SIZES) for (const density of DENSITIES) {
    const evaluate = resolver(base, density, '10');
    for (const tier of ['sm', 'md', 'lg']) {
      const pull = evaluate(`calc(max(0px, round(nearest, calc((var(--area-control-${tier}) - var(--area-icon-${tier})) / 2 - var(--area-stroke-width)), 1px)) + var(--area-stroke-width))`);
      assert.equal(pull, evaluate(`calc((var(--area-control-${tier}) - var(--area-icon-${tier})) / 2)`), `icon-only ${tier} pull at type ${base} / ${density}`);
    }
  }
});

// --- B4.4 -------------------------------------------------------------------------------------------------------------
test('one collapsible head: a row tall, the strong title in the default ink, the chevron after it', () => {
  const head = bodyOf(':is(.area-plan__head, .area-queue__head)');
  assert.match(head, /min-block-size:\s*var\(--_chat-head\)/);
  assert.match(head, /padding:\s*0 var\(--_card-column\)/);
  const title = bodyOf(':is(.area-plan__title, .area-queue__title)');
  assert.match(title, /font-weight:\s*var\(--area-weight-strong\)/);
  assert.match(title, /color:\s*var\(--area-fg-default\)/);
  const chevron = bodyOf(':is(.area-plan__chevron, .area-queue__chevron)');
  assert.match(chevron, /margin-inline:\s*calc\(-1 \* var\(--area-space-4\)\)/, 'the chevron sits 4 after the title');
  // No family moves its chevron to the far end or restates the head.
  for (const sheet of ['plan', 'queue']) {
    const text = source(`components/${sheet}.css`);
    assert.doesNotMatch(text, new RegExp(`\\.area-${sheet}__chevron\\s*\\{[^}]*margin-inline-start:\\s*auto`), `${sheet}'s chevron is pushed to the end`);
    assert.doesNotMatch(text, new RegExp(`(^|\\})\\s*\\.area-${sheet}__head\\s*\\{`), `${sheet}.css restates the head`);
  }
  assert.match(bodyOf('.area-edit-summary__head'), /min-block-size:\s*var\(--_chat-head\)/, "Edit summary's head is the same row");
});
