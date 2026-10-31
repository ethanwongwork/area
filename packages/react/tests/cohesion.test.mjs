import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

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
    // Product UI rule 2's one exception (owner, 2026-10-22): a row's trailing annotation (Nav's count) gives way to the
    // actions revealed in its place (nav.css, revealActions over a trailing annotation).
    if (/\.area-nav__row--reveal\b.*> \.area-nav__trailing$/.test(selector.trim())) continue;
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
  // The Elevation axis (axes/elevation.ts, owner 2026-10-14): components name a role; Shadow (Elevation), Rest and Field
  // shadow and the Edge and Depth controls (axes/depth.ts, 2026-10-18) set its depth. Every role is one fixed slot list in every setting (the lip, the dark
  // rim, six soft layers, the highlight), so settings swap and transition layer by layer; "no lift" is a transparent layer, never
  // `none`, because a role also sits inside lists (Board card's ring, the floating Toolbar's edge) where `none`
  // invalidates the whole box-shadow and drops the ring with it.
  const layers = value => { let depth = 0, count = 1; for (const ch of value) { if (ch === '(') depth++; else if (ch === ')') depth--; else if (ch === ',' && depth === 0) count++; } return count; };
  const roles = ['control', 'field', 'resting', 'tooltip', 'lift', 'float', 'modal']; // lift: main's hover role (2026-10-19), was 'hover'
  for (const role of roles) {
    const values = [...css.matchAll(new RegExp(`--area-shadow-${role}:\\s*([^;]+);`, 'g'))].map(match => match[1].trim());
    // Derived: on :root, and again wherever an axis is set and under the OS contrast preference.
    assert.ok(values.length >= 2, `--area-shadow-${role} is not derived`);
    for (const value of values) {
      assert.notEqual(value, 'none', `--area-shadow-${role} is none; use a transparent shadow`);
      assert.equal(layers(value), 9, `--area-shadow-${role} is not the nine slots: ${value}`);
      // The dark rim (2026-10-19): second, transparent in light, white in dark at the role's own step, capped.
      const second = (() => { let depth = 0, start = -1; for (let i = 0; i < value.length; i++) { const ch = value[i]; if (ch === '(') depth++; else if (ch === ')') depth--; else if (ch === ',' && depth === 0) { if (start < 0) start = i + 1; else return value.slice(start, i).trim(); } } return ''; })();
      assert.match(second, /^0 0 0 1px light-dark\(transparent, rgb\(255 255 255 \/ min\(0\.16, calc\(var\(--area-(elevation|shadow-resting-step|shadow-hover-step|shadow-field-step)\) \/ 100 \* [\d.]+ \* 2\)\)\)\)$/, `--area-shadow-${role} has no dark rim at its step: ${second}`);
      assert.match(value, /^0 1px 0 0 /, `--area-shadow-${role} does not start with the lip`);
      assert.match(value, /, inset 0 1px 0 0 light-dark\(rgb\(255 255 255 \/ var\(--area-shadow-highlight-light\)\), rgb\(255 255 255 \/ var\(--area-shadow-highlight-dark\)\)\)$/, `--area-shadow-${role} does not end with the highlight`);
    }
  }
  // Each Elevation step writes its number alone; the roles read it.
  for (let step = 0; step <= 8; step++) assert.match(css, new RegExp(`\\[data-area-elevation="${step}"\\] \\{\\s*--area-elevation: ${step};`), `Elevation ${step} does not write its number`);
  // The defaults reproduce the step-3 two-layer recipe exactly (Fluent's ambient + key, ambient half, dark doubled):
  // two slots (ambient: no offset, the ambient blur, half the key; key: full offset and blur), the rest transparent,
  // Shadow size 1 (×4/4), no tightness, lip or highlight, black, ×2 in dark, rest at 3 as Shadow, fields at 0.
  const root = css.slice(css.indexOf(':where(:root)'));
  const leaf = name => root.match(new RegExp(`--area-${name}:\\s*([^;]+);`))?.[1].trim();
  assert.deepEqual([leaf('elevation'), leaf('shadow-size'), leaf('shadow-tightness'), leaf('shadow-lip'), leaf('shadow-highlight-light'), leaf('shadow-tint-l'), leaf('shadow-tint-c'), leaf('shadow-resting-step'), leaf('shadow-field-step'), leaf('stroke-strength'), leaf('shadow-rest-step')],
    ['3', '1', '0', '0', '0', '0', '0', '3', '0', '1', '0'], 'the Edge and Depth defaults moved'); // resting lift 3; main's Rest shadow 0
  assert.deepEqual([1, 2, 3, 4, 5, 6].map(i => [leaf(`shadow-slot-${i}-t`), leaf(`shadow-slot-${i}-g`), leaf(`shadow-slot-${i}-a`)]),
    [['0', '1', '0.5'], ['1', '0', '1'], ['0', '0', '0'], ['0', '0', '0'], ['0', '0', '0'], ['0', '0', '0']], 'the default Layers are not the ambient + key pair');
  const float = root.match(/--area-shadow-float:\s*([^;]+);/)[1];
  assert.match(float, /var\(--area-elevation\) \/ 100 \* 1 \* var\(--area-shadow-slot-2-a\)/, 'the float key is not the Menu\'s shadow at Depth %');
  assert.match(float, /var\(--area-shadow-size\) \* 8px \* var\(--area-shadow-slot-2-t\)/, 'the float key lost its 8px offset');
  assert.match(float, /rgb\(0 0 0 \/ min\(0\.9, calc\(var\(--area-elevation\) \/ 100 \* 1 \* var\(--area-shadow-slot-2-a\) \* 2\)\)\)/, 'dark shadows are not twice the light alpha');
  // Resting and lift are one tight layer each (axes/depth.ts TIGHT, owner 2026-10-21). Resting is a small contact shadow,
  // 4% at step 3 (owner 2026-10-30: "even more subtle/small"; was ChatGPT's sm at 8%); lift is ChatGPT's md, 8% at step 3.
  const resting = root.match(/--area-shadow-resting:\s*([^;]+);/)[1];
  assert.match(resting, /0 calc\(var\(--area-shadow-size\) \* 0\.5px\) calc\(var\(--area-shadow-size\) \* 1\.5px\) calc\(var\(--area-shadow-size\) \* -0\.5px\) light-dark\(oklch\(.*?\/ calc\(var\(--area-shadow-resting-step\) \/ 100 \* 1\.3333\)\)/, 'the resting role is not 0 0.5px 1.5px -0.5px at Resting shadow');
  const lift = root.match(/--area-shadow-lift:\s*([^;]+);/)[1];
  assert.match(lift, /0 calc\(var\(--area-shadow-size\) \* 2px\) calc\(var\(--area-shadow-size\) \* 4px\) calc\(var\(--area-shadow-size\) \* -1px\) light-dark\(oklch\(.*?\/ calc\(var\(--area-shadow-hover-step\) \/ 100 \* 2\.6667\)\)/, 'the lift role is not 0 2px 4px -1px at Hover shadow');
  assert.equal(leaf('shadow-hover-step'), '3', 'Hover shadow is not 3 by default');

  // The shadow that paints is the last box-shadow on the block, in any rule: a later literal once overrode the
  // shared lift with a full-strength second layer and a looser test still passed.
  const elevation = rule => rule.body.match(/--_elevation\s*:\s*([^;]+)/)?.[1].trim();
  const paints = block => {
    // Rules under a material (styles material.css) paint only inside data-area-material, and keep the role last in
    // --_m-own (checked below).
    const own = rules.filter(rule => !rule.selector.includes('[data-area-material]') && rule.selector.split(/\s*,\s*/).includes(block) && /(^|[;\s])box-shadow\s*:/.test(rule.body));
    assert.ok(own.length, `${block} has no box-shadow`);
    const value = [...own.at(-1).body.matchAll(/(?:^|[;\s])box-shadow\s*:\s*([^;]+)/g)].at(-1)[1].trim();
    const ownElevation = () => rules.filter(rule => rule.selector.split(/\s*,\s*/).includes(block)).map(elevation).filter(Boolean).at(-1);
    return value.includes('var(--_elevation)') ? value.replace('var(--_elevation)', ownElevation() ?? 'var(--_elevation)') : value;
  };
  const expect = { float: ['.area-popover', '.area-menu', '.area-toast', '.area-menu__search-surface', '.area-scroll-to-latest > .area-button'], modal: ['.area-dialog', '.area-command-palette', '.area-drawer'], resting: ['.area-panel', '.area-composer'] };
  for (const [role, blocks] of Object.entries(expect)) {
    for (const block of blocks) assert.match(paints(block), new RegExp(`var\\(--area-shadow-${role}\\)`), `${block} does not take the ${role} role`);
  }
  // A material never replaces a surface's box-shadow: it fills `--_m-layers`, which each surface lists first beside its
  // own edge, ring and role, so a Drawer keeps its modal lift, a selected Card its ring and a linked Card its hover lift
  // under a material (Elevation and Stroke audit, 2026-10-18: material.css re-added the float role and dropped them).
  const slotted = ['.area-card', '.area-menu', '.area-menu__search-surface', '.area-popover', '.area-hover-card', '.area-toast', '.area-dialog', '.area-drawer', '.area-command-palette', '.area-video-player__surface'];
  const material = rules.filter(rule => rule.selector.includes('[data-area-material]'));
  const names = (rule, block) => new RegExp(`${block.replace(/[.]/g, '\\.')}(?![\\w-])`).test(rule.selector);
  for (const block of slotted) {
    assert.ok(material.some(rule => names(rule, block) && /--_m-layers:\s*var\(--_m-ring\), var\(--_m-shadow\)/.test(rule.body)), `a material does not fill ${block}'s layers`);
    const replaces = material.find(rule => names(rule, block) && /(^|[;\s])box-shadow\s*:/.test(rule.body));
    assert.equal(replaces, undefined, `a material replaces ${block}'s box-shadow: ${replaces?.selector}`);
  }
  assert.ok(!material.some(rule => /--_m-own\s*:[^;]*shadow-(float|modal|resting|edge)/.test(rule.body)), 'a material restates a surface\'s own lift');
  // The same slot on a Button that floats: Scroll to latest lists the layers beside its float lift, and the button
  // painter fills them without writing its box-shadow (it replaced the lift; audit 2026-10-18).
  assert.match(paints('.area-scroll-to-latest > .area-button'), /^var\(--_m-layers, 0 0 0 0 transparent\), var\(--area-shadow-float\)$/, 'Scroll to latest does not list a material\'s layers beside its lift');
  const buttonPainter = material.filter(rule => rule.selector.includes('.area-button:is(.area-button--solid, .area-button--outline, .area-button--soft)') && /(^|[;\s])box-shadow\s*:/.test(rule.body) && !/:disabled/.test(rule.selector));
  assert.ok(buttonPainter.length, 'the button painter writes no box-shadow');
  for (const rule of buttonPainter) {
    assert.match(rule.selector, /:not\(:where\(\.area-scroll-to-latest > \*\)\)/, `the button painter replaces Scroll to latest's box-shadow: ${rule.selector}`);
    assert.match(rule.body, /box-shadow:\s*var\(--_m-layers\)/, `the button painter does not paint the layers: ${rule.selector}`);
  }
  // The Toggletip's class is its button, a ghost mark; its note is a Tooltip, inverse: neither takes a material.
  assert.ok(!material.some(rule => /\.area-toggletip(?![\w-])/.test(rule.selector)), 'a material paints the Toggletip button');
  // A searchable Menu is one overlay: the Menu inside its surface takes no material and is clear.
  for (const rule of material.filter(rule => /\.area-menu(?![\w-])/.test(rule.selector))) {
    for (const match of rule.selector.matchAll(/\.area-menu(?![\w-])(:not\(:where\(\.area-menu__search-surface > \*\)\))?/g)) {
      assert.ok(match[1], `a material paints the Menu inside a search surface: ${rule.selector}`);
    }
  }
  assert.match(ruleFor('.area-menu__search-surface > .area-menu')?.body ?? '', /background-color:\s*transparent/, 'the Menu inside a search surface covers its fill');
  // Disabled parts drop the material but keep their own shadow, and the rule outweighs every painter (it lost to the
  // plain parts' painter, so a disabled selected Segmented item kept the material; audit 2026-10-18).
  const disabled = material.find(rule => /:is\(:disabled, \[data-disabled\], \[aria-disabled="true"\]\)/.test(rule.selector));
  assert.match(disabled?.body ?? '', /box-shadow:\s*var\(--_m-rest, none\)/, 'a disabled part under a material drops its own shadow');
  assert.ok(disabled.selector.includes('.area-nav__item[aria-current]:not([aria-current="false"])'), 'the disabled rule no longer outweighs the plain parts\' painter');
  assert.match(ruleFor('.area-video-player__surface')?.body ?? '', /box-shadow:\s*var\(--_m-layers, 0 0 0 0 transparent\), inset 0 0 0 var\(--area-border-width\) rgb\(255 255 255 \/ 0\.12\), var\(--area-shadow-float\)/, 'the Video player lost its ring or its material slot');
  for (const block of ['.area-calendar, .area-calendar--surface', '.area-color-picker, .area-color-picker--surface']) {
    assert.match(ruleFor(block)?.body ?? '', /var\(--area-shadow-float\)/, `${block} does not take the float role`);
  }
  assert.match(ruleFor('.area-tooltip')?.body ?? '', /var\(--area-shadow-tooltip\)/, 'Tooltip does not take the tooltip role');
  assert.match(ruleFor('.area-card')?.body ?? '', /--_card-shadow:\s*var\(--area-shadow-resting\)/, 'Card does not take the resting role');
  assert.match(css, /\.area-card:has\(\.area-card__link\):hover\s*\{[^}]*--_card-lift:\s*var\(--area-shadow-lift\)/, 'a linked Card\'s hover does not take the lift role');

  // The rest shadow (axes/surface.ts, 2026-10-19): every framed surface lists `shadow-edge` first, set by the Rest
  // shadow setting alone (0 none, with the line or instead of it), two layers at every step, never none, as the roles.
  const rest = 'var(--area-shadow-rest-step, 0)';
  const edges = [...css.matchAll(/--area-shadow-edge:\s*([^;]+);/g)].map(match => match[1].trim());
  assert.ok(edges.length > 0, '--area-shadow-edge is not emitted');
  for (const value of edges) {
    assert.equal(layers(value), 2, `--area-shadow-edge is not two layers: ${value}`);
    assert.equal(value, `0 0.5px 1.5px light-dark(rgb(0 0 0 / calc(0.05 * ${rest})), transparent), inset 0 0 0 1px light-dark(transparent, rgb(255 255 255 / calc(0.025 * ${rest})))`, `--area-shadow-edge is not the rest shadow: ${value}`);
  }
  for (const value of [...css.matchAll(/--area-shadow-edge-filter:\s*([^;]+);/g)].map(match => match[1].trim())) {
    assert.ok(value.includes(`calc(0.05 * ${rest})`) && value.includes(`calc(0.025 * ${rest})`), `--area-shadow-edge-filter does not follow the rest shadow: ${value}`);
  }
  // Surfaces a material paints lead with its slot, then the edge; the rest lead with the edge.
  for (const block of [...expect.float.slice(0, 4), ...expect.modal]) {
    const leads = slotted.includes(block) ? /^var\(--_m-layers, 0 0 0 0 transparent\), var\(--area-shadow-edge\),/ : /^var\(--area-shadow-edge\),/;
    assert.match(paints(block), leads, `${block} does not lead with the Surface axis's edge`);
  }
  for (const block of ['.area-panel', '.area-board-card']) {
    assert.match(paints(block), /^var\(--area-shadow-edge\),/, `${block} does not lead with the Surface axis's edge`);
  }
  assert.match(ruleFor('.area-card')?.body ?? '', /box-shadow:\s*var\(--_card-ring\), var\(--_m-layers, 0 0 0 0 transparent\), var\(--area-shadow-edge\), var\(--_card-lift\)/, 'Card does not lead with its ring, the material slot and the Surface axis\'s edge');
  assert.match(ruleFor('.area-card')?.body ?? '', /--_card-lift:\s*var\(--_card-shadow\)/, 'Card does not rest on its resting shadow');
  // A chip with no fill is drawn by its edge alone, so that edge is required (`stroke-width`), or Surface 0 leaves
  // plain text (all-axis sweep, 2026-10-14): subtle Code and Token, and Token row's outline style.
  for (const block of ['.area-code--subtle, .area-token--subtle', '.area-token-row--outline.area-code']) {
    assert.match(ruleFor(block)?.body ?? '', /--_code-border:\s*var\(--area-stroke-width\)/, `${block} loses its only edge at Surface 0`);
  }
  assert.match(ruleFor('.area-code')?.body ?? '', /border:\s*var\(--_code-border\) solid/, 'Code does not draw its edge at --_code-border');
  // More contrast brings the frame back at Surface 0 (owner, 2026-10-15): the axis writes `frame-width` and every frame
  // reads `border-width`, derived from both, so no axis or preference sets `border-width` itself. Medium (0.5) rounds up
  // to the whole pixel (2026-10-18).
  const widths = [...css.matchAll(/--area-border-width:\s*([^;]+);/g)].map(match => match[1].trim());
  assert.ok(widths.length > 0 && widths.every(value => value === 'max(var(--area-frame-width), round(up, calc(var(--area-contrast-more) * 1px), 1px))'), `--area-border-width is set outside its derivation: ${widths.join(' / ')}`);
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

test('fields rest on Field shadow, transparent by default, and the Select picker floats with the shared lift (audit B-32)', () => {
  // Fields carry no shadow by default (ChatGPT, Notion, Figma); Field shadow (axes/depth.ts, 2026-10-18) lifts them when
  // chosen, as shadcn's and Primer's, and it is 0 by default, a transparent role. Soft fields stay flat.
  for (const selector of ['.area-input', '.area-number-field', '.area-select']) {
    const rule = rules.find(r => r.selector === selector && /box-shadow/.test(r.body));
    assert.ok(rule, `${selector} resting shadow rule missing`);
    assert.match(rule.body, /--_field-lift:\s*var\(--area-shadow-field\)/, `${selector} does not rest on Field shadow`);
    assert.match(rule.body, /box-shadow:\s*var\(--_field-lift\)/, `${selector} paints something other than its lift`);
  }
  for (const selector of ['.area-input--soft', '.area-number-field--soft', '.area-select--soft']) {
    const rule = rules.find(r => r.selector === selector && /--_field-lift/.test(r.body));
    assert.match(rule?.body ?? '', /--_field-lift:\s*0 0 0 0 transparent/, `${selector} lifts; soft fields are flat`);
  }
  const lift = css.slice(css.indexOf(':where(:root)')).match(/--area-shadow-field-step:\s*([^;]+);/)?.[1].trim();
  assert.equal(lift, '0', 'Field shadow is on by default');
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
      // A selected edge drawn inside a frame tops its frame's own line up to Selected stroke (axes/states.ts), so it
      // subtracts that line, whatever it is; the edge itself is selected-width.
      if (!/var\(--area-border-width\)/.test(value.replace(/var\(--area-selected-width\) - var\(--area-border-width\)/g, ''))) continue;
      assert.doesNotMatch(value, required, `${selector} draws a required line (${prop}) at border-width`);
    }
  }
  const strokeWidth = /var\(--area-stroke-width\)/;
  // Swatch rings, cutouts and standalone dividers, by name.
  for (const [selector, prop] of [
    ['.area-color-swatch', 'outline'],
    ['.area-chip__swatch', 'outline'],
    ['.area-code__swatch, .area-token__swatch', 'box-shadow'],
    ['.area-color-swatch-picker--palette::after', 'box-shadow'],
    ['.area-avatar-group__item > .area-avatar, .area-avatar-group__overflow', '--_group-ring'],
    ['.area-separator--horizontal', 'block-size'],
    ['.area-nav__separator', 'block-size'],
    ['.area-table-wrapper', 'border'],
    ['.area-description-list--framed', 'border'],
    ['.area-code-block', 'border'],
    ['.area-file-upload', 'border'],
    ['.area-asset-card__frame', 'border'],
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
  // The Floating stroke group's edge (axes/stroke-groups.ts, 2026-10-30; was border-float, neutral 100 / 650), so every
  // floating surface takes one amount and stays distinct over another surface (DESIGN_SYSTEM.md, "Strokes").
  for (const selector of ['.area-popover, .area-menu', '.area-dialog', '.area-toast', '.area-menu__search-surface', '.area-calendar, .area-calendar--surface', '.area-command-palette', '.area-select::picker(select)']) {
    const rule = rules.find(r => r.selector === selector && /var\(--area-edge-floating\)/.test(r.body));
    assert.ok(rule, `${selector} does not draw the Floating group's edge`);
  }
  assert.match(ruleFor('.area-color-picker, .area-color-picker--surface')?.body ?? '', /--_picker-edge:\s*var\(--area-edge-floating\)/);
});

test('row actions change ink, not plate: Nav, Board cards, Edit summary files and Queue rows', () => {
  // Nav's rule (owner, review rounds 27 and 29), and Board's card actions since round 30 ("cardactions need to be
  // fixed"): the row or card already shows the pointer, so its actions are ghost squares whose hover is ink only, and
  // Board's sit on the card's own paint rather than a floating plate.
  for (const scope of ['.area-nav__actions', '.area-board-card__actions', '.area-edit-summary__file', '.area-queue__item']) {
    const body = ruleFor(`${scope} .area-button.area-button--ghost`)?.body ?? '';
    assert.match(body, /--_bg-hover:\s*transparent/, `${scope}: a hover plate`);
    assert.match(body, /--_fg:\s*var\(--area-fg-muted\)/, `${scope}: not muted at rest`);
  }
  const plate = ruleFor('.area-board-card__actions')?.body ?? '';
  assert.match(plate, /background-color:\s*var\(--_card-bg\)/);
  assert.doesNotMatch(plate, /box-shadow|outline:/);
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

test('every transition and animation takes its curve and length from the motion tokens', () => {
  // axes/easing.ts and motion.ts: Easing moves the curve and Motion the length, so a literal curve or duration ignores
  // both settings (motion sweep 2026-10-22, docs/research/motion-2026-10-22). Allowed literals: `linear` and `0s` on a
  // discrete property (visibility, display, overlay), `steps()` for a caret's blink, and a loop's measured period
  // (checked above). An autofill hold (`9999s`) is a browser workaround, not motion.
  const declarations = [...css.matchAll(/(?<![-\w])(transition|animation)(-timing-function|-duration)?\s*:\s*([^;{}]+)/g)].map(match => ({ prop: match[1] + (match[2] ?? ''), value: match[3].trim() }));
  assert.ok(declarations.length > 100, `expected the component transitions, found ${declarations.length}`);
  for (const { prop, value } of declarations) {
    const items = value.split(/,(?![^()]*\))/).map(item => item.trim()).filter(item => !/^(visibility|display|overlay)\b/.test(item) && !/\b9999s\b/.test(item));
    for (const item of items) {
      const bare = item.replace(/var\([^()]*\)|calc\([^()]*(\([^()]*\))?[^()]*\)|steps\([^()]*\)/g, '');
      assert.doesNotMatch(bare, /cubic-bezier|\bease(-in|-out|-in-out)?\b|\blinear\b/, `${prop} uses a literal curve: ${item}`);
      if (prop !== 'transition-timing-function' && prop !== 'animation-timing-function') assert.doesNotMatch(bare, /(^|\s)(?!0m?s\b)[\d.]+m?s\b/, `${prop} uses a literal duration: ${item}`);
    }
  }
});

test('a line under its title joins it, and a label column fits its labels (DESIGN_SYSTEM.md, "Text pairs")', () => {
  // Owner 2026-09-28 (Card) and 2026-10-22 (every family): the same pair sat 10.5 to 20 apart across families.
  const titleGaps = [...css.matchAll(/--_title-gap:\s*([^;]+);/g)].map(match => match[1].trim());
  assert.ok(titleGaps.length >= 5, `expected the title-gap slots, found ${titleGaps.length}`);
  for (const gap of titleGaps) assert.equal(gap, '0px', `a title and its line sit apart again: --_title-gap ${gap}`);
  for (const heading of ['.area-dialog__heading', '.area-drawer__heading']) {
    assert.match(ruleFor(heading)?.body ?? '', /(^|[;\s])gap:\s*0\s*;/, `${heading} should join its title and description`);
  }
  const groups = rules.find(rule => rule.selector.includes('.area-checkbox-group__description') && /margin-block-start/.test(rule.body));
  assert.match(groups?.body ?? '', /margin-block-start:\s*var\(--area-space-2\)/, 'a group description should sit under its legend as a choice description does');
  assert.match(ruleFor('.area-choice-label')?.body ?? '', /gap:\s*var\(--area-space-2\)/, 'a choice title and its 12/16 description: 2 apart');
  for (const set of ['.area-checkbox-group__options', '.area-radio-group__options']) {
    const body = ruleFor(set)?.body ?? '';
    assert.match(body, /gap:\s*var\(--area-ui-cluster\)/, `${set}: options 8 apart`);
    assert.match(body, /margin-block-start:\s*var\(--area-gap-row\)/, `${set}: the legend one step further (12) than the options are apart`);
  }
});

test('prose runs on prose lines and flows on the ladder; parts set in it keep their UI lines (DESIGN_SYSTEM.md, "Prose lines")', () => {
  // 2026-10-30, docs/research/vertical-rhythm-2026-10-30: a turn's prose was 15/22 with its blocks evenly 16 apart.
  assert.match(ruleFor('.area-message')?.body ?? '', /line-height:\s*var\(--area-text-md-prose-leading\)/, 'Message sets its prose on the prose line');
  assert.match(ruleFor('.area-message__content > * + *')?.body ?? '', /margin-block-start:\s*var\(--area-text-md-prose-gap\)/, 'blocks the prose gap apart');
  const heading = rules.find(rule => rule.selector.startsWith('.area-message__content > :is(h1') && rule.selector.includes(':not(:first-child)'));
  assert.match(heading?.body ?? '', /calc\(var\(--area-text-md-prose-gap\) \+ var\(--area-space-8\)\)/, 'a heading carries its space above');
  const joins = rules.find(rule => rule.selector.includes('> :is(h1, h2, h3, h4, h5, h6) + *') && rule.selector.includes('> * + :is(ul, ol)'));
  assert.match(joins?.body ?? '', /margin-block-start:\s*var\(--area-space-8\)/, 'a heading and a list join what they introduce');
  // A part that sits in a turn states its own line, so it never inherits the prose line.
  for (const part of ['.area-step', '.area-plan', '.area-edit-summary', '.area-turn-notice']) {
    assert.ok(rules.some(rule => rule.selector.split(',').map(s => s.trim()).includes(part) && /line-height:/.test(rule.body)), `${part} should set its own line height`);
  }
});

test('every Kbd is a keycap: nothing unboxes it (owner 2026-10-22)', () => {
  // "i prefer having kbd with backplate everywhere it shows up in all components". Menus, the Command palette, Approval,
  // Shortcut list and a Search trigger used to strip the plate (`--quiet`, `.area-menu__item .area-kbd`).
  for (const rule of rules.filter(r => /\.area-kbd(?!__key)/.test(r.selector))) {
    assert.doesNotMatch(rule.body, /background(-color)?:\s*transparent|padding:\s*0\s*;|border-width:\s*0/, `${rule.selector} unboxes a key`);
  }
});

test('soft fields draw a boundary under increased contrast', () => {
  // CONTRAST.md: under increased contrast a required boundary targets 3:1. A soft field's fill alone read 1.07:1,
  // so its resting edge is `input-edge-soft`: the Fields group's amount at standard contrast, the strong control edge at more.
  const soft = ['.area-input--soft', '.area-number-field--soft', '.area-otp-field--soft', '.area-select--soft', '.area-custom-select--soft',
    '.area-date-picker--soft', '.area-tag-picker--soft'];
  for (const block of soft) assert.match(ruleFor(block)?.body ?? '', /--_border:\s*var\(--area-input-edge-soft\)/, `${block} has no edge under increased contrast`);
  assert.match(ruleFor('.area-textarea--soft')?.body ?? '', /--_border:\s*var\(--area-textarea-edge-soft\)/, 'Textarea soft has no edge under increased contrast');
  assert.match(ruleFor('.area-input-group--soft')?.body ?? '', /border-color:\s*var\(--area-input-edge-soft\)/, 'Input group soft has no edge under increased contrast');
  // Since 2026-10-30 the edge is the Fields stroke group's (axes/stroke-groups.ts), which carries the contrast switch.
  assert.match(css, /--area-input-edge-soft:\s*var\(--area-edge-fields\)/, 'input-edge-soft is not the Fields group\'s edge');
  assert.match(css, /--area-edge-fields:\s*color-mix\(in srgb, color-mix\(in srgb, var\(--area-fg-default\)[^;]*transparent\), var\(--area-stroke-control\) calc\(var\(--area-contrast-more\) \* 100%\)\)/, 'the Fields edge lost its contrast switch');
  // Composer is a field too: its card-edge frame turns to the strong control stroke under increased contrast.
  assert.match(ruleFor('.area-composer')?.body ?? '', /--_composer-edge:\s*var\(--area-composer-edge\)/, 'Composer has no strong edge under increased contrast');
});

// DESIGN_SYSTEM.md, "Layers": a component that paints a ground under anything with a control fill (a plate, a soft
// field, a ghost button) declares that ground in layers.css, so its fills step from what is under them (owner, round
// 61: "make sure other existing components and future components will be built properly and consistently"; Asset
// card's plate had read 1.04:1 on its own fill). Reads the sources, so a new component that paints a ground fails here
// until it is listed with its ground, or exempted below with the reason nothing on it paints a control fill.
test('every painted ground is declared in layers.css', () => {
  const src = new URL('../../styles/src/', import.meta.url);
  const strip = text => text.replace(/\/\*[\s\S]*?\*\//g, '');
  const layers = strip(readFileSync(new URL('layers.css', src), 'utf8'));
  // Each ground's list: the :where(...) before `[data-area-ground="<ground>"]`, its selectors with a trailing :not() dropped.
  const declared = { raised: new Set(), page: new Set(), recessed: new Set() };
  for (const ground of Object.keys(declared)) {
    const at = layers.indexOf(`[data-area-ground="${ground}"] {`);
    assert.ok(at > 0, `layers.css has no ${ground} ground`);
    const open = layers.lastIndexOf(':where(', at);
    let depth = 0, end = open + ':where('.length - 1;
    for (let i = end; i < layers.length; i++) { if (layers[i] === '(') depth++; else if (layers[i] === ')' && --depth === 0) { end = i; break; } }
    const list = layers.slice(open + ':where('.length, end);
    let part = '', level = 0;
    for (const ch of list + ',') {
      if (ch === ',' && level === 0) { declared[ground].add(part.trim().replace(/:not\(.*\)$/, '')); part = ''; continue; }
      if (ch === '(') level++; else if (ch === ')') level--;
      part += ch;
    }
  }
  if (/\.area-select::picker\(select\)\s*\{[^}]*--area-bg-component:\s*var\(--area-bg-component-raised\)/.test(layers)) declared.raised.add('.area-select::picker(select)');
  const GROUND = { 'bg-surface': 'raised', 'bg-code': 'raised', 'bg-subtle': 'recessed', 'bg-page': 'page' };
  // Painted grounds that hold nothing with a control fill, each with its reason.
  const EXEMPT = {
    '.area-asset-card__cell': 'a group cell: an image or an inert thumbnail',
    '.area-asset-card--overlay.area-asset-card--image > .area-asset-card__head > .area-asset-card__name': 'the name\'s plate holds text only',
    '.area-asset-card--overlay.area-asset-card--group > .area-asset-card__head > .area-asset-card__name': 'the name\'s plate holds text only',
    '.area-asset-row__preview': 'an image well',
    '.area-attachment': 'its close button paints the video glass tints, not ground fills',
    '.area-box-model': 'labels and values only',
    '.area-box-model__border': 'labels and values only',
    '.area-box-model__content': 'labels and values only',
    '.area-radio--card': 'the card is the control: its own paint, not a ground under one',
    '.area-checkbox--card': 'the card is the control: its own paint, not a ground under one',
    '.area-color-picker__preview-new': 'a colour well',
    '.area-file-upload__icon': 'an icon box',
    '.area-color-swatch-picker__cell:has(input:checked)': "a selected cell's own paint",
    '.area-color-picker__preview-original': 'a colour well',
    '.area-diff__fold': 'a static fold row in a diff',
    '.area-file-tile__figure > img': 'an image',
    '.area-file-upload-item__icon': 'an icon box',
    '.area-table th': 'header text only (the table wrapper is the raised ground)',
    '.area-presence': 'a status dot',
    '.area-presence[data-out-of-office]': 'a status dot',
    '.area-switch__thumb': "the switch's own thumb",
    '.area-code-block__toggle': "a code block's own toggle, on its raised ground",
  };
  const missing = [];
  for (const file of readdirSync(new URL('components/', src))) {
    if (!file.endsWith('.css')) continue;
    const text = strip(readFileSync(new URL(`components/${file}`, src), 'utf8'));
    for (const [, rawSelector, body] of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const paint = body.match(/background(?:-color)?\s*:\s*var\(--area-(bg-surface|bg-code|bg-subtle|bg-page)\)/);
      if (!paint) continue;
      for (const selector of rawSelector.split(',').map(part => part.trim().replace(/\s+/g, ' '))) {
        if (EXEMPT[selector] || declared[GROUND[paint[1]]].has(selector)) continue;
        missing.push(`${file}: ${selector} paints ${paint[1]} but is not a ${GROUND[paint[1]]} ground in layers.css`);
      }
    }
  }
  assert.deepEqual(missing, []);
});

test('a Type scope restarts text at the body role, and containers of free text state their own role', () => {
  // THEMING.md, CSS inheritance: below the page root, an element with its own Type sets the body role, so text set
  // straight in it follows that scope instead of the size inherited from above (2026-10-20: a canvas at Type 14 kept
  // the app's 13). Zero specificity, so components keep their own roles.
  const scope = ruleFor(':where([data-area-type]:not(:root))')?.body ?? '';
  assert.match(scope, /font-size:\s*var\(--area-text-md-size\)/, 'the Type scope does not restate the body size');
  assert.match(scope, /line-height:\s*var\(--area-text-md-leading\)/, 'the Type scope does not restate the body leading');
  // Containers whose children are free text, not controls, carry a role of their own.
  assert.match(ruleFor('.area-surface')?.body ?? '', /font-size:\s*var\(--area-text-sm-size\)/, 'Surface has no text role');
  assert.match(css, /\.area-card \{[^}]*font-size:\s*var\(--_card-title-size\)/, 'Card has no text role');
});

test('state indicators follow the state settings: focus offsets and selected strokes are never literal', () => {
  // axes/states.ts (owner, 2026-10-21): Focus ring places every keyboard ring, `focus-offset` on controls and `focus-gap`
  // off containers and text; Selected stroke sets every selected container's edge. A literal offset or width would keep
  // one family out of the setting. Inset rings (rows, tabs, cells) sit inside by their own width, a negative calc.
  for (const { selector, body } of rules) {
    if (!/outline:[^;]*--area-(field-)?focus-color/.test(body)) continue;
    const offset = body.match(/outline-offset:\s*([^;]+)/)?.[1].trim();
    if (offset === undefined) continue;
    assert.ok(/var\(--area-focus-(offset|gap)\)|^calc\(\s*(-1 \* var\(--area-[\w-]+\)|var\(--area-[\w-]+\) \* -1)\s*\)$/.test(offset),
      `${selector} sets its focus ring off by ${offset}; use var(--area-focus-offset) on a control, var(--area-focus-gap) off a container or text`);
  }
  for (const { selector, body } of rules) {
    for (const [, width] of body.matchAll(/0 0 0 ((?:[^,()]|\([^()]*(?:\([^()]*\))*[^()]*\))+?) var\(--area-stroke-selected\)/g)) {
      assert.match(width, /--area-selected-width/, `${selector} draws its selected edge ${width.trim()} wide; use var(--area-selected-width)`);
    }
  }
});

test('stacked row plates sit one fixed break apart at every density (owner 2026-10-21)', () => {
  // A hovered row must never run into the current one, so the break between plates is a constant, not density spacing.
  const tokens = readFileSync(new URL('../../tokens/src/emit/base.ts', import.meta.url), 'utf8');
  assert.match(tokens, /\[`\$\{PREFIX\}ui-row-gap`\]: "1px"/);
  for (const family of ['area-nav', 'area-nav__group', 'area-tree-view', 'area-list-box__options', 'area-command-palette__group', 'area-combobox__group', 'area-custom-select__group']) {
    const rule = rules.find(r => r.selector.split(',').some(s => s.trim() === `.${family}`) && /gap:\s*var\(--area-ui-row-gap\)/.test(r.body));
    assert.ok(rule, `.${family} stacks its rows ui-row-gap apart`);
  }
});

// layers.css: the pressed fill reads the selected fill, the ink and the fill steps, and a property that reads another
// resolves where it is declared. So it is restated on every ground that re-points the fills and on every element that
// sets a setting it reads (the layer map, 2026-10-22: a scoped page and half the surfaces kept the root's press).
test('the pressed fill is re-derived on every ground and every setting scope', () => {
  // The setting scopes inside a ground (`@scope`, below) re-point the fills but read a press their ground already derived.
  const pointer = name => rules.filter(rule => rule.body.includes(`--area-bg-component: var(--area-bg-component-${name})`) && !/^:where\(\s*\[data-area-/.test(rule.selector)).map(rule => rule.selector);
  const pressed = rules.filter(rule => /--area-bg-component-pressed:\s*light-dark/.test(rule.body)).map(rule => rule.selector).join(',');
  assert.ok(pressed, 'no rule derives the pressed fill');
  // Each compound in a selector list, with :where() lists opened: split on commas at depth 0 only.
  const split = list => { const out = []; let depth = 0, start = 0;
    for (let i = 0; i < list.length; i++) { const c = list[i]; if (c === '(') depth++; else if (c === ')') depth--; else if (c === ',' && depth === 0) { out.push(list.slice(start, i)); start = i + 1; } }
    return [...out, list.slice(start)].map(part => part.trim()).filter(Boolean); };
  const parts = selector => split(selector).flatMap(part => /^:where\(.*\)$/.test(part) ? parts(part.slice(7, -1)) : [part]);
  for (const ground of ['raised', 'page', 'recessed', 'card', 'tile', 'frame', 'frame-raised']) {
    for (const selector of pointer(ground)) for (const part of parts(selector)) {
      if (part.startsWith('[data-area-ground=')) continue;
      // The native Select's picker is a pseudo-element (it cannot join a list) and its options never press
      // (navigation.css: hover and focus plates only).
      if (part === '.area-select::picker(select)') continue;
      assert.ok(pressed.includes(part), `${part} re-points the fills (${ground}) but does not re-derive the pressed fill`);
    }
  }
  assert.match(pressed, /\[data-area-ground\]/);
  // The press mixes toward the body ink (Tint, Text tint, and the accent's hue at Tint hue Accent) and stops at muted,
  // which is solved on the deepest ground, a card's at Card tone (2026-10-23 theme review).
  for (const setting of ['theme', 'neutral', 'ground-light', 'ground-dark', 'layers-light', 'layers-dark', 'fill-hover', 'fill-selected', 'fill-pressed', 'tint-hue', 'tint-hue-dark', 'colours', 'tint-light', 'tint-dark', 'ink-tint', 'accent', 'card-tone-light', 'card-tone-dark']) {
    assert.ok(pressed.includes(`[data-area-${setting}]`), `a scope setting ${setting} keeps its parent's pressed fill`);
  }
});

// layers.css: every element that sets a setting re-derives the control fills as the page's, so each ground re-points
// them on the setting scopes inside it with `@scope`, the nearest ground winning (2026-10-23 theme review: a scope setting
// only Motion in a recessed region painted its fields the page's fill).
test('a setting scope inside a ground keeps the ground\'s fills', async () => {
  const { AXIS_PRESETS } = await import('../../tokens/dist/config.js');
  const scopes = [...css.matchAll(/@scope \(([^{]*)\) \{\s*:where\(([^{]*)\) \{([^{}]*)\}/g)].map(([, root, settings, body]) => ({
    root: root.replace(/\s+/g, ' '), settings: settings.replace(/\s+/g, ' '), ground: /--area-bg-component: var\(--area-bg-component-(\w+)\)/.exec(body)?.[1] }));
  const grounds = ['raised', 'page', 'card', 'tile', 'recessed'];
  assert.deepEqual(scopes.map(scope => scope.ground).sort(), [...grounds].sort());
  const split = list => { const out = []; let depth = 0, start = 0;
    for (let i = 0; i < list.length; i++) { const c = list[i]; if (c === '(') depth++; else if (c === ')') depth--; else if (c === ',' && depth === 0) { out.push(list.slice(start, i)); start = i + 1; } }
    return [...out, list.slice(start)].map(part => part.trim()).filter(Boolean); };
  const open = part => /^:where\(.*\)$/.test(part) ? split(part.slice(7, -1)) : [part];
  for (const scope of scopes) {
    const settings = split(scope.settings);
    for (const id of [...Object.keys(AXIS_PRESETS), 'ui', 'contrast', 'colours']) assert.ok(settings.includes(`[data-area-${id}]`), `${scope.ground}: a scope setting ${id} inside it falls back to the page's fills`);
    const roots = split(scope.root);
    const pointers = rules.filter(rule => rule.body.includes(`--area-bg-component: var(--area-bg-component-${scope.ground})`) && !/^:where\(\s*\[data-area-/.test(rule.selector))
      .flatMap(rule => split(rule.selector).flatMap(open)).filter(part => part !== '.area-select::picker(select)');
    for (const part of pointers) assert.ok(roots.includes(part), `${part} is a ${scope.ground} ground but its setting scopes fall back to the page's fills`);
  }
});

test('a destructive row paints every plate from Danger hover and keeps its ink (owner 2026-10-23)', () => {
  // axes/states.ts: the danger row's hover, highlight and pressed plates mix toward the danger hue by the setting's
  // switch, so Neutral is exactly the shared plates and Tint keeps their lightness. The ink is never restated per state.
  const plates = rules.filter(rule => rule.selector.includes('.area-menu__item--danger') && /background-color/.test(rule.body));
  for (const state of [':hover', ':focus-visible', ':active']) {
    const rule = plates.find(rule => rule.selector.includes(state));
    assert.ok(rule, `no danger plate for ${state}`);
    assert.match(rule.body, /background-color:\s*var\(--_danger-(hover|pressed)\)/, `${state}: the plate is not Danger hover's`);
    assert.doesNotMatch(rule.body, /(^|[;\s{])color:/, `${state}: the ink changes with the state`);
  }
  const base = ruleFor('.area-menu__item--danger')?.body ?? '';
  assert.match(base, /--area-row-danger-tint/);
  assert.match(base, /--_danger-hover:\s*color-mix\(in oklab,\s*var\(--area-bg-component-hover\)/);
  assert.match(base, /--_danger-pressed:\s*color-mix\(in oklab,\s*var\(--area-bg-component-pressed\)/);
});

test('a list opened from a field takes the field\'s corner; Menus keep the list shape (owner 2026-10-23)', () => {
  // surface.css "A list opened from a field", navigation.css (Select's picker): rows at the field's corner from its own
  // --_radius and --_height, the list 4 rounder. One formula for the four families.
  const shared = rules.find(rule => rule.selector.includes('.area-custom-select__listbox') && rule.selector.includes('.area-combobox__listbox') && rule.selector.includes('.area-tag-picker__listbox') && rule.body.includes('--area-radius-list-row'));
  assert.ok(shared, 'no shared rule for field lists');
  const picker = rules.find(rule => rule.selector.includes('::picker(select)') && rule.body.includes('--area-radius-list-row'));
  assert.ok(picker, "Select's picker does not take the field's corner");
  const formula = body => body.match(/--area-radius-list-row:\s*([^;]+);/)?.[1].trim();
  assert.equal(formula(picker.body), formula(shared.body), "Select's picker and the other field lists differ");
  assert.match(formula(shared.body), /var\(--_radius,[^)]*\)/);
  assert.match(formula(shared.body), /var\(--_height,/);
  const menu = ruleFor('.area-menu')?.body ?? '';
  assert.doesNotMatch(menu, /--area-radius-list-row:/, 'Menu re-points its own row corner');
});

// layers.css: edges on the ground they sit on (@area/tokens color/layers.ts GROUND_EDGES). Every ground sets how far it
// moves the edges (`edge-shift-light` / `-dark`) and its children restate every edge role and every token that reads one,
// since a property that reads another resolves where it is declared; the ground keeps its parent's for what it draws on
// itself, its boundary with the ground it sits on. The roles and their readers come from the built tokens, so a new edge
// role or alias fails here until layers.css restates it.
test('every ground moves the edges and restates every edge role and its readers', () => {
  const tokens = readFileSync(new URL('../../tokens/dist/css/tokens.css', import.meta.url), 'utf8');
  const root = Object.fromEntries([...tokens.matchAll(/(--area-[\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]));
  const roles = Object.keys(root).filter(name => root[name].includes(`oklab(from var(${name}-page)`) && root[name].includes('--area-edge-shift-light'));
  assert.ok(roles.length >= 18, `only ${roles.length} edge roles read the edge shift`);
  const readers = new Set(roles);
  for (let grew = true; grew;) {
    grew = false;
    for (const [name, value] of Object.entries(root)) {
      if (readers.has(name) || name.endsWith('-page')) continue;
      if ([...readers].some(role => value.includes(`var(${role})`))) { readers.add(name); grew = true; }
    }
  }
  // The tokens' own rules (:root, the setting scopes) are in the bundle too; the grounds' rules list components.
  const restate = rules.find(rule => /\.area-card/.test(rule.selector) && /> \*$/.test(rule.selector) && /--area-border:\s*light-dark\(oklab/.test(rule.body));
  assert.ok(restate, 'layers.css restates no edge roles on a ground\'s children');
  for (const name of readers) {
    const value = restate.body.match(new RegExp(`(?:^|;)\\s*${name}:\\s*([^;]+)`))?.[1].trim();
    assert.equal(value, root[name], `${name} is not restated as the tokens write it`);
  }
  // Every ground that re-points the fills sets the shift and restates the roles, and so does every ground that sets it.
  const split = list => { const out = []; let depth = 0, start = 0;
    for (let i = 0; i < list.length; i++) { const c = list[i]; if (c === '(') depth++; else if (c === ')') depth--; else if (c === ',' && depth === 0) { out.push(list.slice(start, i)); start = i + 1; } }
    return [...out, list.slice(start)].map(part => part.trim()).filter(Boolean); };
  const parts = selector => split(selector).flatMap(part => /^:where\(.*\)$/.test(part) ? parts(part.slice(7, -1)) : [part]);
  const shifting = new Set(rules.filter(rule => /--area-edge-shift-light:\s*(0|max\()/.test(rule.body) && !/:root/.test(rule.selector)).flatMap(rule => parts(rule.selector)));
  const restating = new Set(parts(restate.selector.replace(/ > \*$/, '')));
  for (const ground of ['raised', 'page', 'recessed', 'card', 'tile', 'frame', 'frame-raised']) {
    for (const rule of rules.filter(rule => rule.body.includes(`--area-bg-component: var(--area-bg-component-${ground})`) && !/^:where\(\s*\[data-area-/.test(rule.selector)))
      for (const part of parts(rule.selector)) {
        if (part === '.area-select::picker(select)') continue;
        assert.ok(shifting.has(part), `${part} re-points the fills (${ground}) but does not set the edge shift`);
      }
  }
  for (const part of shifting) assert.ok(restating.has(part), `${part} moves the edges but its children do not restate them`);
});

// A registered custom property (`@property`) applies to every element, not the component that declares it: registering a
// name another rule uses for something else retypes it there. In 2026-10-24 the app registered `--_fill` as a number
// for Setup's progress bar, and every Checkbox, Radio and Slider fill (`--_fill`, a colour) fell to 0 and went blank.
// Every registered name must be used by one family's file only (in Area's stylesheet and the app's).
test('a registered custom property has a name no other family uses', () => {
  const sources = new URL('../../styles/src/components/', import.meta.url);
  const appStyles = new URL('../../../apps/desktop/src/styles/', import.meta.url);
  const files = [
    ...readdirSync(sources).filter(name => name.endsWith('.css')).map(name => ({ name: `components/${name}`, text: readFileSync(new URL(name, sources), 'utf8') })),
    ...['base.css', 'layers.css', 'inset.css', 'material.css'].map(name => ({ name, text: readFileSync(new URL(`../../styles/src/${name}`, import.meta.url), 'utf8') })),
    ...readdirSync(appStyles).filter(name => name.endsWith('.css')).map(name => ({ name: `app/${name}`, text: readFileSync(new URL(name, appStyles), 'utf8') })),
  ].map(file => ({ ...file, text: file.text.replace(/\/\*[\s\S]*?\*\//g, '') }));
  for (const file of files) {
    for (const [, name] of file.text.matchAll(/@property\s+(--[\w-]+)/g)) {
      const users = files.filter(other => other !== file && new RegExp(`${name}(?![\\w-])`).test(other.text)).map(other => other.name);
      assert.deepEqual(users, [], `${file.name} registers ${name}, which ${users.join(', ')} also use${users.length === 1 ? 's' : ''}`);
    }
  }
});

test('dividers only where intended, and a divider is the lightest line (owner 2026-10-25)', () => {
  // "id prefer to not use dividers in general unless its very necessary and intentional. i also prefer dividers that are
  // inset to have a very light subtle stroke by default" (docs/research/dividers-2026-10-25). A head, a foot or a section
  // inside a container draws no line: space and its own heading separate it.
  const unruled = [
    '.area-code-block__header', '.area-code-block__toggle', '.area-edit-summary__head', '.area-color-picker__header',
    '.area-color-picker__swatches', '.area-panel__bar', '.area-panel__section', '.area-panel__footer', '.area-command-palette__footer',
  ];
  for (const part of unruled) {
    for (const { selector, body } of rules) {
      if (!selector.split(',').some(one => one.trim().endsWith(part))) continue;
      assert.doesNotMatch(body, /(border-block-(start|end)|border-(top|bottom))\s*:\s*[^;]*solid|box-shadow\s*:\s*inset 0 calc/, `${selector} draws a line`);
    }
  }
  for (const head of ['.area-plan[data-open] > .area-plan__head', '.area-queue[data-open] > .area-queue__head', '.area-plan[data-open] > .area-plan__bar']) {
    assert.doesNotMatch(ruleFor(head)?.body ?? '', /border-block-end\s*:\s*[^;]*solid/, `${head} draws a line`);
  }
  // Separators and the dividers that stay paint the Dividers stroke group's line (axes/stroke-groups.ts, 2026-10-30; was
  // the lightest rung, border-decorative), so every divider takes one amount.
  const lightest = {
    '.area-separator': /background-color:\s*var\(--area-edge-dividers\)/,
    '.area-nav__separator': /background-color:\s*var\(--area-edge-dividers\)/,
    '.area-inline-list--rule > .area-inline-list__item:not(:last-child)::after': /background-color:\s*var\(--area-edge-dividers\)/,
    '.area-file-upload-item__separator': /background-color:\s*var\(--area-edge-dividers\)/,
    '.area-shortcut-list--divided .area-shortcut-list__item:not(:last-child)': /border-block-end:[^;]*var\(--area-edge-dividers\)/,
  };
  for (const [selector, paint] of Object.entries(lightest)) assert.match(ruleFor(selector)?.body ?? '', paint, `${selector} is not the Dividers group's line`);
  assert.equal(rules.some(({ selector, body }) => selector === '.area-shortcut-list__item:not(:last-child)' && /border/.test(body)), false, 'Shortcut list rows are ruled by default');
});

test('a revealed control\'s showing rules outrank the rule that hides it (2026-10-24: Copy never showed on overlay cards)', () => {
  // Asset card hides the head and the corner controls under a caption that reveals them (below, overlay) and shows them
  // with other rules: at rest, on hover, with focus, and where nothing hovers. Each showing rule must beat the hiding
  // one in the cascade: a higher specificity, or the same one later in the file.
  const split = list => { const out = []; let depth = 0, start = 0;
    for (let i = 0; i < list.length; i++) { const c = list[i]; if (c === '(') depth++; else if (c === ')') depth--; else if (c === ',' && depth === 0) { out.push(list.slice(start, i)); start = i + 1; } }
    return [...out, list.slice(start)].map(part => part.trim()).filter(Boolean); };
  // Selectors Level 4 specificity as [ids, classes, types]: :is/:not/:has take their heaviest argument, :where none.
  const specificity = selector => {
    const score = [0, 0, 0];
    const add = other => other.forEach((n, i) => { score[i] += n; });
    let rest = selector.replace(/:(is|not|has|where)\(/g, '\u0000$1(');
    for (let open; (open = rest.indexOf('\u0000')) !== -1;) {
      const name = rest.slice(open + 1).match(/^\w+/)[0];
      let depth = 0, end = open;
      for (let i = open + 1 + name.length; i < rest.length; i++) { if (rest[i] === '(') depth++; else if (rest[i] === ')' && --depth === 0) { end = i; break; } }
      if (name !== 'where') add(split(rest.slice(open + name.length + 2, end).replace(/\u0000/g, ':')).map(specificity).reduce((a, b) => (a[0] - b[0] || a[1] - b[1] || a[2] - b[2]) >= 0 ? a : b));
      rest = rest.slice(0, open) + ' ' + rest.slice(end + 1);
    }
    score[0] += (rest.match(/#[\w-]+/g) ?? []).length;
    score[1] += (rest.match(/\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+/g) ?? []).length;
    score[2] += (rest.replace(/\[[^\]]+\]/g, '').match(/(^|[\s>+~])[a-z][\w-]*|::[\w-]+/gi) ?? []).length;
    return score;
  };
  const compare = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
  const parts = rules.map((rule, index) => ({ ...rule, index })).filter(rule => /\.area-asset-card/.test(rule.selector))
    .flatMap(rule => {
      const opacity = rule.body.match(/(?:^|[;\s])opacity\s*:\s*([^;]+)/)?.[1].trim();
      return opacity === '0' || opacity === '1' ? split(rule.selector).map(selector => ({ selector, index: rule.index, shown: opacity === '1' })) : [];
    });
  const target = selector => selector.match(/(\.area-asset-card__(?:head|actions))$/)?.[1];
  const captions = selector => new Set(selector.match(/\.area-asset-card--(?:below|overlay)\b/g) ?? []);
  const hiding = parts.filter(part => !part.shown && target(part.selector));
  assert.ok(hiding.length >= 2, 'Asset card hides no head or corner controls');
  let checked = 0;
  for (const show of parts.filter(part => part.shown && target(part.selector))) {
    for (const hide of hiding) {
      if (target(hide.selector) !== target(show.selector)) continue;
      if (![...captions(hide.selector)].some(caption => captions(show.selector).has(caption))) continue;
      const order = compare(specificity(show.selector), specificity(hide.selector));
      assert.ok(order > 0 || (order === 0 && show.index > hide.index), `${show.selector} does not outrank ${hide.selector}, which hides it`);
      checked++;
    }
  }
  assert.ok(checked >= 5, `only ${checked} showing rules checked`);
});

test('an icon size derived from the compact step lands on a native cut (2026-10-26: Empty state 22, Toggletip 14 at type 13)', () => {
  // `--area-ui-dense` is in halves (0.5 at the app's type 13), so `x − 4px × ui-dense` drew glyphs between the native
  // sizes (MOTION.md crispness rule 4). A glyph or icon size that reads it must round the step to a whole one first.
  for (const { selector, body } of rules) {
    for (const [, prop, value] of body.matchAll(/(--_(?:glyph|icon)[\w-]*)\s*:\s*([^;]+)/g)) {
      if (!/ui-dense/.test(value) || /line|gap|cut/.test(prop)) continue;
      assert.match(value, /round\(/, `${selector} ${prop} reads ui-dense without rounding it to a whole step`);
    }
  }
  // Every disclosure body opens on Accordion's height recipe (2026-10-26).
  const body = rules.find(rule => rule.selector.startsWith(':is(.area-step__body, .area-plan__items, .area-queue__items, .area-edit-summary__diff)') && /interpolate-size/.test(rule.body));
  assert.ok(body, 'the disclosure bodies share the height recipe (accordion.css)');
});

// inset.css, the text-slot trim: a second text beside a trimmed one in a centred row is trimmed too, or the two
// baselines part by half the leading's rounding (0.6px at type 13; round 81 swept every family's rows for it).
test('a row\'s second text is trimmed like the label beside it', () => {
  const trim = rules.find(rule => rule.selector.split(',').map(s => s.trim()).includes('.area-menu__text') && /text-box:\s*trim-both cap alphabetic/.test(rule.body));
  assert.ok(trim, 'the text-slot trim rule is missing');
  const slots = trim.selector.split(',').map(s => s.trim());
  for (const second of ['.area-command-palette__description', '.area-popover__step']) {
    assert.ok(slots.includes(second), `${second} sits beside a trimmed label and is not trimmed`);
  }
});

// prompt-suggestions.css: a suggestion's prompt starts under the composer's placeholder and its icon under the leading
// action, so the row reads the composer's own inset, action and gap (round 85: round 81 dropped the field's 8 after the
// leading action and the suggestions kept it, 8 to the right).
test('prompt suggestions line up with the composer above them', () => {
  const composer = rules.find(rule => /--_composer-inset\s*:/.test(rule.body))?.body ?? '';
  const read = (body, prop) => body.match(new RegExp(`(?:^|[;\\s])${prop}\\s*:\\s*([^;]+)`))?.[1].trim();
  const item = ruleFor('.area-prompt-suggestions__item')?.body ?? '';
  const icon = ruleFor('.area-prompt-suggestions__icon')?.body ?? '';
  assert.equal(read(item, 'gap'), read(composer, '--_composer-gap'), 'the icon-to-prompt gap is not the composer\'s gap');
  assert.equal(read(item, 'padding-inline')?.split(' ')[0], read(composer, '--_composer-inset'), 'the row inset is not the composer\'s inset');
  assert.equal(read(icon, 'flex')?.split(' ').at(-1), read(composer, '--_composer-action'), 'the icon slot is not the composer\'s action');
});

// plan.css: a cancelled item's cross replaces the done tick, so its rule must not lose to the shared tick rule
// (round 85: one class lighter, a cancelled item drew the tick).
test('a cancelled plan item draws its cross, not the done tick', () => {
  // Class count, an :is() list counting as its one heaviest argument (all single classes here).
  const specificity = selector => (selector.replace(/:is\([^)]*\)/g, '.is').match(/\.[\w-]+/g) ?? []).length;
  const tick = rules.find(rule => rule.selector.includes('.area-plan__item--done, .area-plan__item--cancelled') && rule.selector.endsWith('> .area-plan__mark::after') && /--_tick/.test(rule.body));
  const cross = rules.find(rule => /--cancelled\b[^,]*> \.area-plan__mark::after$/.test(rule.selector) && !rule.selector.includes('--done') && /--_tick/.test(rule.body));
  assert.ok(tick && cross, 'the tick and cross rules are missing');
  assert.ok(specificity(cross.selector) >= specificity(tick.selector) && rules.indexOf(cross) > rules.indexOf(tick), `${cross.selector} loses to ${tick.selector}`);
});

// display.css: a Spinner set in a host's icon slot takes that slot's size and the host's ink, as an icon would (round 87:
// a Badge's 16 spinner overflowed its 12 slot).
test('a spinner in a button or badge fills the host\'s icon box', () => {
  for (const host of ['.area-button', '.area-badge']) {
    const body = ruleFor(`${host} .area-spinner`)?.body ?? '';
    assert.match(body, /--_size:\s*var\(--_icon\)/, `${host} does not size its spinner to its icon box`);
    assert.match(body, /--_indicator:\s*currentColor/, `${host}'s spinner does not take its ink`);
  }
});

// composer.css / approval.css: Approval takes the Composer's place until it is answered, so it takes the Composer's
// corner term for term (2026-10-29: the composer's corner moved to the surface ladder; Approval had copied the old one).
test('Approval keeps the Composer\'s corner', () => {
  const read = (selector, prop) => rules.find(rule => rule.selector === selector && new RegExp(`${prop}\\s*:`).test(rule.body))?.body.match(new RegExp(`${prop}\\s*:\\s*([^;]+)`))?.[1].trim();
  const norm = value => value?.replace(/--_(composer|approval)-/g, '--_x-').replace(/\s+/g, ' ');
  assert.ok(read('.area-composer', '--_composer-corner'), 'the composer corner is missing');
  assert.equal(norm(read('.area-approval', '--_approval-radius')), norm(read('.area-composer', '--_composer-corner')));
  assert.equal(norm(read('.area-approval', '--_approval-height')), norm(read('.area-composer', '--_composer-height')).replace('var(--_x-action)', 'var(--area-control-md)'));
  assert.equal(norm(read('.area-approval', '--_approval-term')), norm(read('.area-composer', '--_composer-term')));
});

// composer.css / surface.css: a surface standing alone on the page takes Card's edge (audit S7a) and Card's corner
// (owner 2026-10-29: the composer's first rounder corner made its buttons rounder than every other Button).
test('the Composer takes Card\'s corner', () => {
  const read = (selector, prop) => rules.find(rule => rule.selector === selector && new RegExp(`${prop}\\s*:`).test(rule.body))?.body.match(new RegExp(`${prop}\\s*:\\s*([^;]+)`))?.[1].trim();
  const norm = value => value?.replace(/--_(composer|card)-(term|inset)/g, '--_x-$2').replace(/--_(composer-corner|card-radius)/g, '--_x-r').replace(/\s+/g, ' ');
  const card = read('.area-card', '--_card-radius'), composer = read('.area-composer', '--_composer-corner');
  assert.ok(card && composer, 'the corners are missing');
  assert.ok(norm(composer).includes(norm(card)), `${composer} does not take ${card}`);
  assert.equal(norm(read('.area-composer', '--_composer-term')), norm(read('.area-card', '--_card-term')));
});

// panel.css / app-shell.css (owner 2026-10-30: "there shouldnt be so much excess room on the sides of the buttons, it
// should be equal"): a bar of controls holds them as far from its sides as from its top. Panel's controls-only bar applies
// its even padding itself, so the shared inset (inset.css) can't put its text inset back at a side with no seam rule; a
// window bar, with no rule, is even to the control alone; a Titlebar that starts with tabs (a Nav, or a strip holding one)
// starts at the even inset too.
test('a bar of controls is inset as far from its sides as from its top', () => {
  const body = selector => rules.find(rule => rule.selector === selector)?.body ?? '';
  assert.match(body('.area-panel__bar:not(:has(> .area-panel__title))'), /padding-inline:\s*var\(--_bar-start\)\s+var\(--_bar-end\)/);
  assert.match(body('.area-panel--window-bar > .area-panel__bar'), /--_bar-even:\s*calc\(\(var\(--_bar\) - var\(--area-control-sm\)\) \/ 2\)/);
  const start = rules.find(rule => rule.selector.startsWith('.area-titlebar:not(.area-titlebar--floating, .area-titlebar--macos)') && /--_titlebar-start:\s*var\(--_titlebar-even\)/.test(rule.body));
  assert.ok(start, 'the Titlebar has no even start');
  assert.match(start.selector, /\.area-nav/);
  assert.match(start.selector, /> :first-child > :first-child/);
});

// panel.css / field.css / description-list.css: one label column per panel (owner 2026-10-30, "One Inspector grid",
// docs/research/inspector-panel-2026-10-30). A Field and a facts list in a panel both read --_panel-label, so a control
// and a fact's value start on one edge; values had started at 95, 104, 116 and 123 in one Inspector.
test('a panel\'s Fields and facts share its label column', () => {
  const read = (selector, prop) => rules.find(rule => rule.selector === selector && new RegExp(`${prop}\\s*:`).test(rule.body))?.body.match(new RegExp(`${prop}\\s*:\\s*([^;]+)`))?.[1].trim();
  assert.ok(read('.area-panel', '--_panel-label'), 'the panel publishes no label column');
  assert.equal(read('.area-panel .area-field--auto', '--_label-share'), 'var(--_panel-label)');
  const facts = read('.area-panel .area-description-list--columns:not(.area-description-list--framed)', 'grid-template-columns');
  assert.ok(facts?.startsWith('var(--_panel-label)'), `facts in a panel take ${facts}`);
  assert.equal(read('.area-panel .area-description-list--columns:not(.area-description-list--framed)', 'column-gap'), 'var(--area-ui-cluster)');
});

test('every Card slot sits on the card\'s one space: CardContent adds no padding and media steps back out (owner 2026-10-30)', () => {
  const body = selector => rules.find(rule => rule.selector === selector)?.body ?? '';
  assert.match(body('.area-card'), /padding:\s*var\(--_card-padding\)/, 'Card is not padded by its space');
  assert.match(body('.area-card'), /--_card-padding:\s*calc\(var\(--_card-space\) - var\(--_card-border\)\)/, 'Card\'s padding is not its space less the border');
  assert.doesNotMatch(body('.area-card__content'), /padding/, 'CardContent pads its slots, so a slot outside it sits elsewhere');
  assert.match(body('.area-card__content'), /gap:\s*var\(--_card-gap\)/, 'CardContent spaces its blocks apart from the card\'s section gap');
  assert.ok(rules.some(rule => /> \.area-card__media:not\(\.area-card__media--bleed\)$/.test(rule.selector) && /margin-inline:\s*calc\(-1 \* var\(--_card-pull\)\)/.test(rule.body)), 'inset media does not step back out to the media inset');
});

test('every stroke group\'s members draw its edge, and the groups are the only edges they draw (owner 2026-10-30)', () => {
  // axes/stroke-groups.ts: twelve groups, each an amount of the text colour over the ground; a member that kept its old
  // rung would ignore its group's setting. One representative rule per member, as the stylesheet writes it.
  const members = {
    cards: [['.area-card', /--_card-edge:\s*var\(--area-edge-cards\)/], ['.area-attachment', /--_attachment-edge:\s*var\(--area-edge-cards\)/]],
    blocks: [['.area-code-block', /border:[^;]*var\(--area-edge-blocks\)/], ['.area-table-wrapper', /border:[^;]*var\(--area-edge-blocks\)/]],
    callouts: [['.area-alert', /--_border:\s*var\(--area-edge-callouts\)/]],
    floating: [['.area-popover, .area-menu', /border:[^;]*var\(--area-edge-floating\)/], ['.area-dialog', /border:[^;]*var\(--area-edge-floating\)/], ['.area-toast', /border:[^;]*var\(--area-edge-floating\)/]],
    regions: [['.area-panel', /border:[^;]*var\(--area-edge-regions\)/]],
    dividers: [['.area-separator', /background-color:\s*var\(--area-edge-dividers\)/], ['.area-menu__separator', /background-color:\s*var\(--area-edge-dividers\)/], ['.area-table th, .area-table td, .area-table__cell', /border-block-end:[^;]*var\(--area-edge-dividers\)/]],
    buttons: [['.area-button--soft', /--_border:\s*var\(--area-edge-buttons\)/], ['.area-segmented', /outline:[^;]*var\(--area-edge-buttons\)/], ['.area-toggle-group--soft', /outline:[^;]*var\(--area-edge-buttons\)/]],
    tracks: [['.area-slider__rail', /outline:[^;]*var\(--area-edge-tracks\)/], ['.area-progress', /outline:[^;]*var\(--area-edge-tracks\)/]],
    tags: [['.area-count--soft', /box-shadow:[^;]*var\(--area-edge-tags\)/], ['.area-kbd', /border:[^;]*var\(--area-edge-tags\)/]],
    media: [['.area-avatar', /outline:[^;]*var\(--area-edge-media\)/]],
  };
  for (const [group, list] of Object.entries(members)) for (const [selector, paint] of list) {
    assert.ok(rules.some(rule => rule.selector === selector && paint.test(rule.body)), `${selector} does not draw the ${group} group's edge`);
  }
  // Soft fields and swatches reach their groups through their own roles.
  assert.match(css, /--area-input-edge-soft:\s*var\(--area-edge-fields\)/, 'a soft field\'s edge is not the Fields group\'s');
  assert.match(css, /--area-token-swatch-ring:\s*var\(--area-edge-media\)/, 'a swatch\'s ring is not the Media group\'s');
  assert.match(css, /\.area-checkbox--soft,\s*\.area-radio--soft\s*\{[^}]*--_card-edge:\s*var\(--area-edge-options\)/, 'a soft option row does not draw the Options group\'s edge');
});
