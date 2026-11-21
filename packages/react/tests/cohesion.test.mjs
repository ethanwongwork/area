import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

// DESIGN_SYSTEM.md, "Shared state paint" and "Elevation"; docs/research/cohesion-audit.md.
// These read the built stylesheet, so they guard the rules across every family at once.
const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const rules = [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim().replace(/\s+/g, ' '), body }));
const ruleFor = selector => rules.find(rule => rule.selector === selector);
// A rule's selector list with its :where() lists expanded: the shared recipes write `:where(a, b, …)` (popup.css, plan B6.1).
const selectorList = selector => {
  const parts = []; let depth = 0, from = 0;
  for (let i = 0; i <= selector.length; i++) { const ch = selector[i]; if (ch === '(') depth++; else if (ch === ')') depth--; else if (i === selector.length || (ch === ',' && depth === 0)) { parts.push(selector.slice(from, i).trim()); from = i + 1; } }
  const closes = part => { let level = 0; for (let i = 6; i < part.length; i++) { if (part[i] === '(') level++; else if (part[i] === ')' && --level === 0) return i; } return -1; };
  return parts.flatMap(part => part.startsWith(':where(') && closes(part) === part.length - 1 ? selectorList(part.slice(7, -1)) : [part]);
};
// The one floating surface's frame (popup.css, plan B6.1): every floating and modal surface draws it from this rule.
const FLOATING_FRAME = rules.find(rule => rule.selector.startsWith(':where(.area-popover') && /border:[^;]*var\(--area-edge-floating\)/.test(rule.body));

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
    '.area-menu__item:hover:not([data-disabled], [data-inactive], [data-selected])',
    '.area-menu__item:is([data-highlighted], :focus-visible):not([data-selected])',
    '.area-nav__item:hover:not([data-disabled], [data-inactive])',
    '.area-nav__row:has(> .area-nav__item:not([data-disabled], [data-inactive], [aria-current]:not([aria-current="false"]))):hover',
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
      // One edge per surface (plan A7.1): the floating and modal rims only where no frame is, Tooltip's none (its inset
      // edge takes the strength); the rest a 1px rim.
      const spread = role === 'float' || role === 'modal' ? 'max\\(0px, calc\\(1px - var\\(--area-border-width\\)\\)\\)' : role === 'tooltip' ? '0px' : '1px';
      assert.match(second, new RegExp(`^0 0 0 ${spread} light-dark\\(transparent, rgb\\(255 255 255 \\/ min\\(0\\.16, calc\\(var\\(--area-(elevation|shadow-resting-step|shadow-hover-step|shadow-field-step)\\) \\/ 100 \\* [\\d.]+ \\* 2\\)\\)\\)\\)$`), `--area-shadow-${role} has no dark rim at its step: ${second}`);
      assert.match(value, /^0 1px 0 0 /, `--area-shadow-${role} does not start with the lip`);
      assert.match(value, /, inset 0 1px 0 0 light-dark\(rgb\(255 255 255 \/ var\(--area-shadow-highlight-light\)\), rgb\(255 255 255 \/ var\(--area-shadow-highlight-dark\)\)\)$/, `--area-shadow-${role} does not end with the highlight`);
    }
  }
  // Each Elevation step writes its number alone; the roles read it.
  for (let step = 0; step <= 8; step++) assert.match(css, new RegExp(`\\[data-area-elevation="${step}"\\] \\{\\s*--area-elevation: ${step};`), `Elevation ${step} does not write its number`);
  // The defaults reproduce the two-layer recipe exactly at Floating 8 (3 until 2026-11-05, docs/research/shadow-depth-2026-11-04.md;
  // Fluent's ambient + key, ambient half, dark doubled):
  // two slots (ambient: no offset, the ambient blur, half the key; key: full offset and blur), the rest transparent,
  // Shadow size 1 (×4/4), no tightness, lip or highlight, black, ×2 in dark, rest at 3 as Shadow, fields at 0.
  const root = css.slice(css.indexOf(':where(:root)'));
  const leaf = name => root.match(new RegExp(`--area-${name}:\\s*([^;]+);`))?.[1].trim();
  assert.deepEqual([leaf('elevation'), leaf('shadow-size'), leaf('shadow-tightness'), leaf('shadow-lip'), leaf('shadow-highlight-light'), leaf('shadow-tint-l'), leaf('shadow-tint-c'), leaf('shadow-resting-step'), leaf('shadow-field-step'), leaf('stroke-strength'), leaf('shadow-rest-step')],
    ['8', '1', '0', '0', '0', '0', '0', '3', '0', '1', '0'], 'the Edge and Depth defaults moved'); // Floating 8; resting lift 3; main's Rest shadow 0
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
    const own = rules.filter(rule => !rule.selector.includes('[data-area-material]') && selectorList(rule.selector).includes(block) && /(^|[;\s])box-shadow\s*:/.test(rule.body));
    assert.ok(own.length, `${block} has no box-shadow`);
    let value = [...own.at(-1).body.matchAll(/(?:^|[;\s])box-shadow\s*:\s*([^;]+)/g)].at(-1)[1].trim();
    // The shared stack (popup.css, plan B6.1) is one property, written on the block by the recipe.
    const stack = rules.filter(rule => selectorList(rule.selector).includes(block)).map(rule => rule.body.match(/--_float-shadow\s*:\s*([^;]+)/)?.[1].trim()).filter(Boolean).at(-1);
    if (value === 'var(--_float-shadow)' && stack) value = stack;
    const ownElevation = () => rules.filter(rule => selectorList(rule.selector).includes(block)).map(elevation).filter(Boolean).at(-1);
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
  // It takes the one floating stack (plan B6.1): the layers, the Rest shadow's edge it lacked, then the float role.
  assert.match(paints('.area-scroll-to-latest > .area-button'), /^var\(--_m-layers, 0 0 0 0 transparent\), var\(--area-shadow-edge\), var\(--area-shadow-float\)$/, 'Scroll to latest does not list a material\'s layers beside its lift');
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
  assert.match(ruleFor('.area-video-player__surface')?.body ?? '', /box-shadow:\s*var\(--_m-layers, 0 0 0 0 transparent\), inset 0 0 0 var\(--area-border-width\) var\(--_media-glass-edge\), var\(--area-shadow-float\)/, 'the Video player lost its ring or its material slot');
  // The surface Calendar and Color picker take the one floating stack on the float role (popup.css, plan B6.1), their
  // material's layers included (they had none).
  for (const block of ['.area-calendar:not(.area-calendar--plain)', '.area-color-picker:not(.area-color-picker--plain)']) {
    assert.match(paints(block), /^var\(--_m-layers, 0 0 0 0 transparent\), var\(--area-shadow-edge\), var\(--area-shadow-float\)$/, `${block} does not take the float role`);
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
  // Every field shell takes the one recipe (input.css, plan B7.8): its disabled fill, edge and ink; never an opacity.
  const shell = rules.find(rule => rule.selector.startsWith(':is(.area-input, .area-number-field, .area-otp-field, .area-tag-picker__field)[data-disabled]') && /--_bg:\s*var\(--_bg-disabled\)/.test(rule.body));
  assert.ok(shell, 'the field shell has no disabled recipe');
  assert.doesNotMatch(shell.body, /opacity/, 'the shell dims a field twice');
  const composer = ruleFor('.area-composer[data-disabled]');
  assert.ok(composer, '.area-composer[data-disabled] missing');
  assert.doesNotMatch(composer.body, /opacity/, 'Composer dims a field twice');
  // InputGroup's disabled paint is field paint too (audit B-32).
  const group = rules.find(rule => rule.selector.startsWith('.area-input-group:is([aria-disabled="true"]') && /background-color/.test(rule.body));
  assert.ok(group, 'InputGroup disabled paint missing');
  assert.doesNotMatch(group.body, /opacity/);
});

test('fields rest on Field shadow, transparent by default, and the Select picker floats with the shared lift (audit B-32)', () => {
  // Fields carry no shadow by default (ChatGPT, Notion, Figma); Field shadow (axes/depth.ts, 2026-10-18) lifts them when
  // chosen, as shadcn's and Primer's, and it is 0 by default, a transparent role. Soft fields stay flat.
  // One field shell (plan B3.1): the roots rest on Field shadow, the shell paints the lift, soft is flat.
  const roots = rules.find(r => r.selector.startsWith('.area-input, .area-number-field, .area-input-group, .area-select') && /--_field-lift:/.test(r.body));
  assert.match(roots?.body ?? '', /--_field-lift:\s*var\(--area-shadow-field\)/, 'fields do not rest on Field shadow');
  const shell = rules.find(r => r.selector.startsWith('.area-input, .area-number-field, .area-input-group, .area-select') && /border-radius:\s*var\(--_field-shape\)/.test(r.body));
  assert.match(shell?.body ?? '', /box-shadow:\s*var\(--_field-lift\)/, 'the field shell paints something other than its lift');
  const soft = rules.find(r => r.selector.startsWith('.area-input.area-input--soft'));
  for (const block of ['area-input', 'area-number-field', 'area-select']) assert.ok(soft?.selector.includes(`.${block}.${block}--soft`), `${block} soft is not the shell's`);
  assert.match(soft?.body ?? '', /--_field-lift:\s*0 0 0 0 transparent/, 'soft fields lift; they are flat');
  const lift = css.slice(css.indexOf(':where(:root)')).match(/--area-shadow-field-step:\s*([^;]+);/)?.[1].trim();
  assert.equal(lift, '0', 'Field shadow is on by default');
  // The picker takes the one floating stack on the float role (popup.css, plan B6.1), restated on the pseudo-element.
  const picker = rules.find(r => r.selector === ':where(.area-select)::picker(select)' && /box-shadow/.test(r.body));
  assert.ok(picker, 'Select picker rule missing');
  assert.match(picker.body, /--_elevation:\s*var\(--area-shadow-float\)/);
  assert.match(picker.body, /box-shadow:\s*var\(--_float-shadow\)/);
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
    ['.area-description-list--surface', 'border'],
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
  // One rule draws it on every surface (popup.css, plan B6.1); the native picker restates it on its pseudo-element.
  assert.ok(FLOATING_FRAME, 'the one floating frame is missing');
  for (const selector of ['.area-popover', '.area-menu', '.area-dialog', '.area-drawer', '.area-toast', '.area-menu__search-surface', '.area-calendar:not(.area-calendar--plain)', '.area-command-palette', '.area-color-picker:not(.area-color-picker--plain)']) {
    assert.ok(selectorList(FLOATING_FRAME.selector).includes(selector), `${selector} does not draw the Floating group's edge`);
  }
  assert.match(ruleFor(':where(.area-select)::picker(select)')?.body ?? '', /border:[^;]*var\(--area-edge-floating\)/, 'the Select picker does not draw the Floating group\'s edge');
  // The floating bars (Toolbar's surface, the floating Selection bar and Titlebar) draw the same edge inside, an inset
  // ring (`--_float-frame`, popup.css), before the one floating stack on the float role (plan B6.1, 2026-11-14).
  const bars = ['.area-toolbar--surface', '.area-selection-bar--floating', '.area-titlebar--floating'];
  const barFrame = rules.find(rule => bars.every(bar => selectorList(rule.selector).includes(bar)) && /--_float-frame\s*:/.test(rule.body));
  assert.match(barFrame?.body ?? '', /--_float-frame:\s*inset 0 0 0 var\(--area-border-width\) var\(--area-edge-floating\)/, 'the floating bars lost their inside edge');
  const barStack = rules.find(rule => bars.every(bar => selectorList(rule.selector).includes(bar)) && /--_float-shadow\s*:/.test(rule.body));
  assert.ok(barStack && selectorList(barStack.selector).includes('.area-popover'), 'the floating bars do not take the one floating stack');
  for (const selector of bars) {
    const own = rules.filter(rule => selectorList(rule.selector).includes(selector) && /(^|[;\s])(box-shadow|--_toolbar-shadow|--_shadow)\s*:/.test(rule.body)).at(-1);
    assert.match(own?.body ?? '', /(box-shadow|--_toolbar-shadow|--_shadow):\s*var\(--_float-frame\), var\(--_float-shadow\)/, `${selector} writes its own float stack`);
  }
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
  // 2026-11-06 balance pass: a component's title is its text's size and joins it as its first line; a heading over its
  // text (a title step) stands a whole step (4) off it. Never between: a 16 title joined over 13 text sat 10.0 beside the
  // text's 8.8, which the owner read as no spacing logic.
  const titleGaps = [...css.matchAll(/--_title-gap:\s*([^;]+);/g)].map(match => match[1].trim());
  assert.ok(titleGaps.length >= 5, `expected the title-gap slots, found ${titleGaps.length}`);
  for (const gap of titleGaps) assert.ok(gap === '0px' || gap === 'var(--area-space-4)', `a title and its line sit neither joined nor a step apart: --_title-gap ${gap}`);
  const emptyMd = ruleFor('.area-empty-state--md')?.body ?? '';
  assert.match(emptyMd, /--_title-size:\s*var\(--area-title-xs-size\)/, 'Empty state md heads a region with a title step');
  assert.match(emptyMd, /--_title-gap:\s*var\(--area-space-4\)/, 'a heading over its text stands a step (4) off it');
  // Owner 2026-11-06, second look: a title joined on its copy's line read as the paragraph's first line. Every surface
  // title stands one step (4) off its copy; names of items (a choice, a Switch, a file row) still join theirs.
  // Dialog and Drawer share one title group (system gaps C7, 2026-11-07).
  for (const heading of [':is(.area-dialog__heading, .area-drawer__heading)', '.area-approval__heading']) {
    assert.match(ruleFor(heading)?.body ?? '', /(^|[;\s])gap:\s*var\(--area-space-4\)/, `${heading}: the copy one step off its title`);
  }
  assert.ok(titleGaps.every(gap => gap === 'var(--area-space-4)'), `every surface title stands a step off its copy: ${titleGaps.join(' / ')}`);
  assert.ok(!rules.some(rule => rule.selector.includes('.area-card__title + .area-card__description')), "Card's description takes the text group's 4, not a join");
  // A component's own title is the text's size: Dialog (and Confirm dialog, which uses it), Drawer and Card.
  for (const title of [':is(.area-dialog__title, .area-drawer__title)']) {
    const body = ruleFor(title)?.body ?? '';
    assert.match(body, /font-size:\s*var\(--area-text-base-size\)/, `${title} should be its text's size`);
    assert.match(body, /line-height:\s*var\(--area-text-base-leading\)/, `${title} should take its text's line`);
  }
  // The frame recipe's title pair (surface.css, plan B1.1): the text's size, which Card's title reads.
  assert.match(ruleFor('.area-card')?.body ?? '', /--_card-title-size:\s*var\(--area-card-title-size,\s*var\(--_fr-title-size\)\)/, "Card's title should be its description's size");
  assert.ok(rules.some(rule => rule.selector.startsWith(':where(.area-card, .area-surface,') && /--_fr-title-size:\s*var\(--area-text-base-size\)/.test(rule.body)), "the frame's title is not its text's size");
  assert.doesNotMatch(css, /var\(--area-leading-24\)\s*-\s*var\(--_height\)/, 'a close centres on its title\'s own line, not a fixed 24');
  const groups = rules.find(rule => rule.selector.includes('.area-checkbox-group__description') && /margin-block-start/.test(rule.body));
  assert.match(groups?.body ?? '', /margin-block-start:\s*0\s*;/, 'a group description should join its legend as a choice description does');
  // A 12/16 line under a 13/18 title joins it on its own line gap (7.7 beside 7.4), as File tile's meta; 2 apart sat 9.7.
  assert.match(ruleFor('.area-choice-label')?.body ?? '', /gap:\s*0\s*;/, 'a choice title and its 12/16 description join');
  assert.match(ruleFor('.area-switch__text')?.body ?? '', /gap:\s*0\s*;/, 'a Switch label and its description join');
  for (const set of ['.area-checkbox-group__options', '.area-radio-group__options']) {
    const body = ruleFor(set)?.body ?? '';
    assert.match(body, /gap:\s*var\(--area-ui-cluster\)/, `${set}: options 8 apart`);
    assert.match(body, /margin-block-start:\s*var\(--area-gap-row\)/, `${set}: the legend one step further (12) than the options are apart`);
  }
});

test('prose runs on prose lines and flows on the ladder; parts set in it keep their UI lines (DESIGN_SYSTEM.md, "Prose lines")', () => {
  // 2026-10-30, docs/research/vertical-rhythm-2026-10-30: a turn's prose was 15/22 with its blocks evenly 16 apart.
  assert.match(ruleFor('.area-message')?.body ?? '', /line-height:\s*var\(--area-text-lg-prose-leading\)/, 'Message sets its prose on the prose line');
  assert.match(ruleFor('.area-message__content > * + *')?.body ?? '', /margin-block-start:\s*var\(--area-text-lg-prose-gap\)/, 'blocks the prose gap apart');
  const heading = rules.find(rule => rule.selector.startsWith('.area-message__content > :is(h1') && rule.selector.includes(':not(:first-child)'));
  assert.match(heading?.body ?? '', /calc\(var\(--area-text-lg-prose-gap\) \+ var\(--area-space-8\)\)/, 'a heading carries its space above');
  const joins = rules.find(rule => rule.selector.includes('> :is(h1, h2, h3, h4, h5, h6) + *') && rule.selector.includes('> * + :is(ul, ol)'));
  assert.match(joins?.body ?? '', /margin-block-start:\s*var\(--area-space-8\)/, 'a heading and a list join what they introduce');
  // A part that sits in a turn states its own line, so it never inherits the prose line.
  for (const part of ['.area-step', '.area-plan', '.area-edit-summary', '.area-turn-notice']) {
    assert.ok(rules.some(rule => rule.selector.split(',').map(s => s.trim()).includes(part) && /line-height:/.test(rule.body)), `${part} should set its own line height`);
  }
  // An agent's work is UI under the reply's prose (owner, 2026-11-02: "do the trackers need to be smaller?"): every tracker
  // reads at the UI size, one size, as Cursor's cards sit 13 under a 14 reply.
  for (const part of ['.area-step', '.area-plan', '.area-edit-summary', '.area-turn-notice', '.area-approval']) {
    assert.ok(rules.some(rule => rule.selector.split(',').map(s => s.trim()).includes(part) && /font-size:\s*var\(--area-text-base-size\)/.test(rule.body)), `${part} should read at text-base`);
  }
  for (const part of ['.area-approval__description', '.area-approval__hint', '.area-approval__option-description']) {
    assert.doesNotMatch(rules.filter(rule => rule.selector.split(',').map(s => s.trim()).includes(part)).map(rule => rule.body).join(';'), /font-size/, `${part} should keep the card's one size`);
  }
});

test('every Kbd is a keycap: nothing unboxes it (owner 2026-10-22)', () => {
  // "i prefer having kbd with backplate everywhere it shows up in all components". Menus, the Command palette, Approval,
  // Shortcut list and a Search trigger used to strip the plate (`--quiet`, `.area-menu__item .area-kbd`).
  for (const rule of rules.filter(r => /\.area-kbd(?!__key)/.test(r.selector))) {
    assert.doesNotMatch(rule.body, /background(-color)?:\s*transparent|padding:\s*0\s*;|border-width:\s*0/, `${rule.selector} unboxes a key`);
  }
});

// DESIGN_SYSTEM.md, "Text that flows": a host's text rules style its own text, never a component set in it (2026-11-04:
// Message's list markers drew over a Reference list's numbers in a reply). Message's list rules exclude Area's parts.
test("a host's text rules leave components alone", () => {
  // A descendant list rule (`.area-message__content :is(ul, ol)`, `… ol`), not a direct child's (`> * + :is(ul, ol)`).
  const lists = rules.filter(rule => /\.area-message__content (:is\(ul, ol\)|ul|ol)(?![\w-])/.test(rule.selector));
  assert.ok(lists.length >= 5, 'Message has its list rules');
  for (const rule of lists) assert.match(rule.selector, /:not\(\[class\*="area-"\]\)/, `${rule.selector} reaches a component's list`);
});

test('soft fields draw a boundary under increased contrast', () => {
  // CONTRAST.md: under increased contrast a required boundary targets 3:1. A soft field's fill alone read 1.07:1,
  // so its resting edge is `input-edge-soft`: the Fields group's amount at standard contrast, the strong control edge at more.
  // One field shell (plan B3.1): soft paints --_border-soft, the Fields group's edge by default; Textarea its own seam.
  const soft = rules.find(r => r.selector.startsWith('.area-input.area-input--soft'));
  for (const block of ['area-input', 'area-number-field', 'area-input-group', 'area-otp-field', 'area-select', 'area-custom-select', 'area-date-picker', 'area-tag-picker', 'area-textarea'])
    assert.ok(soft?.selector.includes(`.${block}.${block}--soft`), `${block} soft is not the shell's`);
  assert.match(soft?.body ?? '', /--_border:\s*var\(--_border-soft\)/, 'soft does not draw its soft edge');
  const roots = rules.find(r => r.selector.startsWith('.area-input, .area-number-field, .area-input-group') && /--_border-soft:/.test(r.body));
  assert.match(roots?.body ?? '', /--_border-soft:\s*var\(--area-input-edge-soft\)/, 'a soft field has no edge under increased contrast');
  assert.match(ruleFor('.area-textarea')?.body ?? '', /--_border-soft:\s*var\(--area-textarea-edge-soft\)/, 'Textarea soft has no edge under increased contrast');
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
  const declared = { raised: new Set(), float: new Set(), page: new Set(), recessed: new Set(), well: new Set() };
  for (const ground of Object.keys(declared)) {
    const at = layers.indexOf(`[data-area-ground="${ground}"] {`);
    assert.ok(at > 0, `layers.css has no ${ground} ground`);
    const open = layers.lastIndexOf(':where(', at);
    let depth = 0, end = open + ':where('.length - 1;
    for (let i = end; i < layers.length; i++) { if (layers[i] === '(') depth++; else if (layers[i] === ')' && --depth === 0) { end = i; break; } }
    // A ground declared by its attribute alone (`[data-area-ground="recessed"] {` with no :where list before it).
    if (!/^\s*,\s*$/.test(layers.slice(end + 1, at))) continue;
    const list = layers.slice(open + ':where('.length, end);
    let part = '', level = 0;
    for (const ch of list + ',') {
      if (ch === ',' && level === 0) { declared[ground].add(part.trim().replace(/:not\(.*\)$/, '')); part = ''; continue; }
      if (ch === '(') level++; else if (ch === ')') level--;
      part += ch;
    }
  }
  if (/\.area-select::picker\(select\)\s*\{[^}]*--area-bg-component:\s*var\(--area-bg-component-float\)/.test(layers)) declared.float.add('.area-select::picker(select)');
  const GROUND = { 'bg-surface': 'raised', 'bg-code': 'raised', 'bg-float': 'float', 'bg-subtle': 'recessed', 'bg-well': 'well', 'bg-page': 'page' };
  // Painted grounds that hold nothing with a control fill, each with its reason.
  const EXEMPT = {
    '.area-asset-card__cell': 'a group cell: an image or an inert thumbnail',
    '.area-asset-card--overlay.area-asset-card--image > .area-asset-card__head > .area-asset-card__name': 'the name\'s plate holds text only',
    '.area-asset-card--overlay.area-asset-card--group > .area-asset-card__head > .area-asset-card__name': 'the name\'s plate holds text only',
    '.area-asset-card--overlay.area-asset-card--screen > .area-asset-card__head > .area-asset-card__name': 'the name\'s plate holds text only',
    '.area-asset-row__preview': 'an image well',
    '.area-attachment': 'its close button paints the video glass tints, not ground fills',
    '.area-box-model': 'labels and values only',
    '.area-box-model__border': 'labels and values only',
    '.area-box-model__content': 'labels and values only',
    '.area-radio--surface': 'the card is the control: its own paint, not a ground under one',
    '.area-checkbox--surface': 'the card is the control: its own paint, not a ground under one',
    '.area-color-picker__preview-new': 'a colour well',
    '.area-file-upload__icon': 'an icon box',
    '.area-color-swatch-picker__cell:has(input:checked)': "a selected cell's own paint",
    '.area-color-picker__preview-original': 'a colour well',
    '.area-diff__fold': 'a static fold row in a diff',
    '.area-file-tile__figure > img': 'an image',
    '.area-file-upload-item__icon': 'an icon box',
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
      const paint = body.match(/background(?:-color)?\s*:\s*var\(--area-(bg-surface|bg-code|bg-float|bg-subtle|bg-page)\)/);
      if (!paint) continue;
      for (const selector of selectorList(rawSelector.trim().replace(/\s+/g, ' ')).map(part => part.replace(/^:where\((\.[\w-]+)\)(::.*)$/, '$1$2'))) {
        if (EXEMPT[selector] || declared[GROUND[paint[1]]].has(selector) || declared[GROUND[paint[1]]].has(selector.replace(/:not\(.*\)$/, ''))) continue;
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
  assert.match(scope, /font-size:\s*var\(--area-text-lg-size\)/, 'the Type scope does not restate the body size');
  assert.match(scope, /line-height:\s*var\(--area-text-lg-leading\)/, 'the Type scope does not restate the body leading');
  // Containers whose children are free text, not controls, carry a role of their own.
  assert.match(ruleFor('.area-surface')?.body ?? '', /font-size:\s*var\(--area-text-base-size\)/, 'Surface has no text role');
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
    // Inside: the negative of the ring's own width (a role, or a private width the rule derives from the roles).
    const own = body.match(/outline:\s*(var\(--_[\w-]+\)) solid/)?.[1];
    assert.ok(/var\(--area-focus-(offset|gap|solid-offset)\)|^calc\(\s*(-1 \* var\(--area-[\w-]+\)|var\(--area-[\w-]+\) \* -1)\s*\)$/.test(offset) || (own && offset === `calc(-1 * ${own})`),
      `${selector} sets its focus ring off by ${offset}; use var(--area-focus-offset) on a control, var(--area-focus-gap) off a container or text`);
  }
  for (const { selector, body } of rules) {
    if (!body.includes('var(--area-stroke-selected)')) continue;
    // Each shadow layer, split on the commas outside brackets (a linear walk: a nested pattern here backtracks for
    // minutes on a long declaration that never reaches the selected stroke).
    const layers = []; let depth = 0, start = 0;
    for (let i = 0; i <= body.length; i++) { const c = body[i];
      if (c === '(') depth++; else if (c === ')') depth--;
      else if (i === body.length || c === ';' || (c === ',' && depth === 0)) { layers.push(body.slice(start, i)); start = i + 1; } }
    for (const layer of layers) {
      const width = layer.match(/0 0 0 (.+) var\(--area-stroke-selected\)\s*$/)?.[1];
      if (width === undefined) continue;
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
  for (const ground of ['raised', 'float', 'page', 'recessed', 'well', 'card', 'tile', 'frame', 'frame-raised']) {
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
  const grounds = ['raised', 'float', 'page', 'card', 'tile', 'recessed', 'well'];
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
  for (const ground of ['raised', 'float', 'page', 'recessed', 'well', 'card', 'tile', 'frame', 'frame-raised']) {
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
  // 4 since plan B7.11 (2026-11-14): the touch rules that showed them again are gone; touch never hides them.
  assert.ok(checked >= 4, `only ${checked} showing rules checked`);
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
  for (const second of ['.area-command-palette__description', '.area-popover__step', '.area-composer-menu__path']) {
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
  // Its one public hook (2026-11-04, visual questions: the card beside an Asset card frame takes the frame's corner)
  // wraps the Composer's corner, which stays the default term for term.
  const radius = norm(read('.area-approval', '--_approval-radius'));
  assert.match(radius, /^var\(--area-approval-corner, .+\)$/);
  assert.equal(radius.replace(/^var\(--area-approval-corner, (.+)\)$/, '$1'), norm(read('.area-composer', '--_composer-corner')));
  assert.equal(norm(read('.area-approval', '--_approval-height')), norm(read('.area-composer', '--_composer-height')).replace('var(--_x-action)', 'var(--area-control-md)'));
});

// composer.css: a surface standing alone on the page takes Card's edge (audit S7a). Its corner is the chat card's (plan
// B1.3, 2026-11-13; surface.css), never past half its one-line height, its actions concentric inside it. It was the
// container plus its inset's share (19 at the default), held in Phase 1 until the one chat card set it.
test('the Composer takes the chat card\'s corner, its actions concentric', () => {
  const read = (selector, prop) => rules.find(rule => rule.selector === selector && new RegExp(`${prop}\\s*:`).test(rule.body))?.body.match(new RegExp(`${prop}\\s*:\\s*([^;]+)`))?.[1].trim().replace(/\s+/g, ' ');
  assert.equal(read('.area-composer', '--_composer-corner'), 'min(calc(var(--_composer-height) / 2), var(--_fr-corner))');
  assert.equal(read('.area-composer', '--_composer-action-radius'), 'max(min(var(--area-radius-control-md), var(--_composer-corner)), calc(var(--_composer-corner) - var(--_composer-inset) * var(--area-radius-concentric)))');
  assert.equal(read('.area-composer', '--_composer-inset'), 'var(--area-ui-cluster)', 'the Composer holds its actions at the chat card\'s mat');
});

// DESIGN_SYSTEM.md, Size and shape (plan A2.2, A2.3, 2026-11-11): a component's corner reads the public radius roles
// (radius-control-*, -container, -row, -list(-row), -small, -full, -floor, -min) or the shared corner expression on its
// own height, round(down, calc(H * var(--area-radius-factor)), 2px), never the raw leaves (radius-surface, the setting's
// own step), a px literal or a rounding of its own. Blocks share the block corner; resting cards never out-round the
// floating corner.
test('corners read the public radius roles: no raw leaf, no literal, no private rounding (plan A2.2)', () => {
  // Each a selector, its property, and why its rounding is its own. Nothing else may round a corner off the 2px ladder.
  const OWN = [
    ['.area-color-swatch', '--_radius', "a swatch's shape factor on its own size, to the nearest even pixel"],
    [':is(.area-menu__icon, .area-custom-select__icon) .area-color-swatch', '--_radius', "the same, on the menu icon's swatch"],
    ['.area-color-field .area-input__icon > .area-color-swatch', '--_radius', 'the same, capped concentric with its field'],
    ['.area-color-swatch-picker__cell', 'border-radius', "the swatch's corner plus the cell's clearance"],
    ['.area-file-image__figure', 'border-radius', "a file picture's corner, 8% of its size (spec)"],
    ['.area-asset-card--below > .area-asset-card__head > .area-asset-card__actions', '--_actions-corner', "concentric with the card from the controls' offset, to the nearest pixel"],
    // Not a corner: the clearance a field keeps beside its curve.
    ['.area-input, .area-number-field, .area-select, .area-custom-select__trigger', '--_corner-clear', 'the clearance beside a field corner, not a corner'],
  ];
  // Not yet on the roles, each pinned outside this test (remove on the fix): inset.css's pill term writes radius-full as
  // 9999px (the same length).
  // Chart's keys and marks keep a 2px literal that chart.test.mjs pins; radius-min is the same 2 (square at Sharp).
  const LITERAL = [['.area-input, .area-number-field, .area-select, .area-custom-select__trigger', '--_field-corner'], ['.area-chart__key', 'border-radius'], ['.area-chart__legend-item', 'border-radius']];
  const own = (selector, prop, list) => list.some(([s, p]) => selector.startsWith(s) && p === prop);
  // Strips the balanced call starting at `index` (the name's first letter) and returns [inner, end].
  const call = (value, index) => {
    let depth = 0;
    for (let i = value.indexOf('(', index); i < value.length; i++) {
      if (value[i] === '(') depth++;
      else if (value[i] === ')' && --depth === 0) return [value.slice(value.indexOf('(', index) + 1, i), i + 1];
    }
    return [value.slice(index), value.length];
  };
  const checked = [];
  for (const { selector, body } of rules) {
    if (!/\.area-/.test(selector)) continue;
    for (const [, prop, raw] of body.matchAll(/(?:^|[;\s])([\w-]+)\s*:\s*([^;]+)/g)) {
      if (!/^border(-[a-z]+)*-radius$/.test(prop) && !/^--_[\w-]*(radius|corner|shape)[\w-]*$/.test(prop)) continue;
      const value = raw.trim().replace(/\s+/g, ' ');
      checked.push(selector);
      assert.doesNotMatch(value, /--area-radius-(surface|step)\b/, `${selector} ${prop} reads a raw radius leaf: ${value}`);
      if (own(selector, prop, OWN)) continue;
      // The pill term (a row or keycap 2px short of a pill until Pill) and every rounding, each to the 2px ladder.
      let rest = value.replace(/min\(2px, \(0\.5 - var\(--area-radius-factor\)\) \* 1000px\)/g, '').replace(/\(0\.5 - var\(--area-radius-factor\)\) \* 1000px/g, '');
      for (let at = rest.indexOf('round('); at !== -1; at = rest.indexOf('round(')) {
        const [inner, end] = call(rest, at);
        assert.match(inner, /^down, .+, 2px$/, `${selector} ${prop} rounds a corner its own way (round(${inner})); a corner rounds down to even pixels`);
        rest = rest.slice(0, at) + 'R' + rest.slice(end);
      }
      assert.doesNotMatch(rest, /--area-radius-factor/, `${selector} ${prop} reads the radius factor outside the shared corner expression: ${value}`);
      if (own(selector, prop, LITERAL)) continue;
      assert.doesNotMatch(rest, /(^|[^\w.-])(?!0px\b)\d*\.?\d+px\b/, `${selector} ${prop} writes a corner in px: ${value}`);
    }
  }
  assert.ok(checked.length > 300, `only ${checked.length} corner declarations read`);
  // Blocks share one block corner, the container's (Table, Description list framed, Queue, Plan, Plan's steps, Edit
  // summary). Code block's frame is concentric with its copy control instead (code-block.css).
  const radiusOf = selector => rules.find(rule => rule.selector.split(', ').includes(selector) && /(^|[;\s])border-radius\s*:/.test(rule.body))?.body.match(/(?:^|[;\s])border-radius\s*:\s*([^;]+)/)?.[1].trim();
  // Since plan B1.1 / B1.3 (2026-11-13) each reads its frame recipe role (surface.css; the frame recipe test below).
  assert.equal(radiusOf('.area-description-list--surface'), 'var(--_fr-block)', 'Description list framed is a block: the block corner');
  assert.equal(radiusOf('.area-plan__steps'), 'var(--area-radius-container)', 'a plan item\'s steps box is a block');
  for (const chat of ['.area-queue', '.area-plan', '.area-edit-summary']) assert.equal(radiusOf(chat), 'var(--_fr-corner)', `${chat} is a chat card: the chat card's corner`);
  assert.equal(radiusOf('.area-table-wrapper'), 'var(--area-table-corner, var(--_fr-block))', 'Table is a block: the block corner');
  // Resting cards never out-round the floating corner (plan A2.3): Card is six tenths of its text inset, capped; Asset
  // card, Design card, Surface and the modal surfaces take the container's.
  const read = (selector, prop) => rules.find(rule => rule.selector === selector && new RegExp(`(^|[;\\s])${prop}\\s*:`).test(rule.body))?.body.match(new RegExp(`(?:^|[;\\s])${prop}\\s*:\\s*([^;]+)`))?.[1].trim().replace(/\s+/g, ' ');
  assert.equal(read('.area-card', '--_card-radius'), 'var(--_fr-card)', 'Card takes the resting-card corner');
  for (const size of ['.area-card--sm', '.area-card--md', '.area-card--lg']) assert.equal(read(size, '--_card-radius'), undefined, `${size} restates the corner instead of reading the recipe`);
  assert.equal(read('.area-asset-card', '--_corner'), 'var(--area-asset-card-corner, var(--_fr-block))');
  assert.equal(read('.area-design-card', '--_corner'), 'var(--area-design-card-corner, var(--_fr-block))');
  assert.equal(read('.area-surface', '--_sf-corner'), 'var(--_fr-card)', 'Surface takes Card\'s corner (plan B1.1)');
  assert.equal(read('.area-dialog', '--_dialog-radius'), 'var(--area-radius-container)', 'Dialog takes the floating corner, no + 4');
  assert.equal(read('.area-drawer--bottom', '--_drawer-radius'), 'var(--area-radius-container)', "Drawer takes Dialog's corner");
});

// panel.css / app-shell.css (owner 2026-10-30: "there shouldnt be so much excess room on the sides of the buttons, it
// should be equal"): a bar of controls holds them as far from its sides as from its top. Panel's controls-only bar applies
// its even padding itself, so the shared inset (inset.css) can't put its text inset back at a side with no seam rule; a
// window bar, with no rule, is even to the control alone; a Titlebar that starts with tabs (a Nav, or a strip holding one)
// starts at the even inset too.
test('a bar of controls is inset as far from its sides as from its top', () => {
  const body = selector => rules.find(rule => rule.selector === selector)?.body ?? '';
  assert.match(body('.area-panel__bar:not(:has(> .area-panel__title))'), /padding-inline:\s*var\(--_bar-start\)\s+var\(--_bar-end\)/);
  // The even room is the bar less the rule it counts and the control (plan B4.1): a window bar counts none, so 7 all round.
  assert.match(body('.area-panel__bar:not(:has(> .area-panel__title))'), /--_bar-even:\s*calc\(\(var\(--_bar\) - var\(--_bar-rule\) - var\(--area-control-sm\)\) \/ 2\)/);
  assert.match(body('.area-panel--window-bar'), /--_bar-rule:\s*0px/);
  assert.match(body('.area-panel--window-bar'), /--_bar:\s*var\(--_hb-region\)/);
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
  const facts = read('.area-panel .area-description-list--columns:not(.area-description-list--surface)', 'grid-template-columns');
  assert.ok(facts?.startsWith('var(--_panel-label)'), `facts in a panel take ${facts}`);
  assert.equal(read('.area-panel .area-description-list--columns:not(.area-description-list--surface)', 'column-gap'), 'var(--area-ui-cluster)');
});

test('every Card slot sits on the card\'s one space: CardContent adds no padding and media steps back out (owner 2026-10-30)', () => {
  const body = selector => rules.find(rule => rule.selector === selector)?.body ?? '';
  assert.match(body('.area-card'), /padding:\s*var\(--_card-padding\)/, 'Card is not padded by its space');
  assert.match(body('.area-card'), /--_card-padding:\s*calc\(var\(--_card-space\) - var\(--_card-border\)\)/, 'Card\'s padding is not its space less the border');
  assert.doesNotMatch(body('.area-card__content'), /padding/, 'CardContent pads its slots, so a slot outside it sits elsewhere');
  assert.match(body('.area-card__content'), /gap:\s*var\(--_card-gap(, var\(--_fr-gap\))?\)/, 'CardContent spaces its blocks apart from the card\'s section gap (in a Surface, the frame recipe\'s)');
  assert.ok(rules.some(rule => /> \.area-card__media:not\(\.area-card__media--bleed\)$/.test(rule.selector) && /margin-inline:\s*calc\(-1 \* var\(--_card-pull\)\)/.test(rule.body)), 'inset media does not step back out to the media inset');
});

test('every stroke group\'s members draw its edge, and the groups are the only edges they draw (owner 2026-10-30)', () => {
  // axes/stroke-groups.ts: twelve groups, each an amount of the text colour over the ground; a member that kept its old
  // rung would ignore its group's setting. One representative rule per member, as the stylesheet writes it.
  const members = {
    cards: [['.area-card', /--_card-edge:\s*var\((?:--area-card-edge,\s*var\()?--area-edge-cards\)/], // the group, or the group behind Card's public hook (2026-11-02)
     ['.area-attachment', /--_attachment-edge:\s*var\(--area-edge-cards\)/]],
    blocks: [['.area-code-block', /border:[^;]*var\(--area-edge-blocks\)/], ['.area-table-wrapper', /border:[^;]*var\(--area-edge-blocks\)/]],
    callouts: [['.area-alert', /--_border:\s*var\(--area-edge-callouts\)/]],
    floating: [[FLOATING_FRAME?.selector, /border:[^;]*var\(--area-edge-floating\)/]], // one rule for every floating surface (popup.css, plan B6.1)
    regions: [['.area-panel', /border:[^;]*var\(--area-edge-regions\)/]],
    dividers: [['.area-separator', /background-color:\s*var\(--area-edge-dividers\)/], ['.area-menu__separator', /background-color:\s*var\(--area-edge-dividers\)/], ['.area-table th, .area-table td, .area-table__cell', /border-block-end:[^;]*var\(--area-edge-dividers\)/]],
    buttons: [['.area-button--soft', /--_border:\s*var\(--area-edge-buttons\)/], [':where(.area-segmented, .area-toggle-group--soft)', /outline:[^;]*var\(--area-edge-buttons\)/]], // one track (plan B8.1)
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

test('a one-line option row takes the height ladder corner, pictures in a card the surface corner', () => {
  // DESIGN_SYSTEM.md, Radius, "Option rows are bars" (owner 2026-10-30): a row or list card / soft option is a bar, so it
  // reaches a pill only at Pill; on the surface corner a 34 row was a pill at corner 12.
  const base = rules.find(rule => rule.selector.startsWith('.area-checkbox--surface, .area-radio--surface, .area-checkbox--soft, .area-radio--soft') && /border-radius/.test(rule.body))?.body ?? '';
  assert.match(base, /border-radius:\s*var\(--_card-corner\)/, 'card and soft options draw --_card-corner');
  assert.match(base, /--_card-line:\s*calc\(2 \* \(var\(--_card-inset\) \+ var\(--area-stroke-width\)\) \+ var\(--_size\)\)/, 'the one-line height is the inset and edge twice plus the control box');
  assert.match(base, /--_card-corner:\s*min\(var\(--area-radius-container\),.*var\(--_card-line\) \* var\(--area-radius-factor\)/, 'the corner is the ladder on the one-line height, capped at the surface');
  const pictures = rules.find(rule => /area-radio--preview/.test(rule.selector) && /--_card-corner:\s*var\(--area-radius-container\)/.test(rule.body));
  assert.ok(pictures && /area-radio--tile/.test(pictures.selector) && /area-radio--media-row/.test(pictures.selector), 'tile, preview and media options keep the surface corner');
});

test('named derivations are read, never written out again (system gaps C6, 2026-11-07)', () => {
  // A formula a token already holds is read from the token, so changing the formula changes every family at once.
  // Spacing that steps with density: gaps read the gap ladder (ui-stack, ui-cluster, gap-row), which rounds the curve to
  // whole steps (L3); surface insets read inset-surface-sm / -md. A corner on a control height reads radius-control-*.
  const dense = (a, b) => new RegExp(`calc\\(var\\(--area-space-${a}\\) - var\\(--area-space-${b}\\) \\* var\\(--area-ui-dense\\)\\)`);
  for (const { selector, body } of rules) {
    for (const [, prop, value] of body.matchAll(/(?:^|[;\s])([\w-]+)\s*:\s*([^;]+)/g)) {
      if (prop.startsWith('--area-')) continue; // the tokens themselves
      const gap = /^(gap|row-gap|column-gap|--_[\w-]*gap[\w-]*|--_card-section)$/.test(prop);
      const inset = /^(padding[\w-]*|--_[\w-]*(inset|space|side|start|end|pad)[\w-]*)$/.test(prop);
      if (gap) for (const [a, b, token] of [[12, 4, 'gap-row'], [8, 2, 'ui-cluster'], [6, 2, 'ui-stack']]) {
        assert.doesNotMatch(value, dense(a, b), `${selector} ${prop} writes ${a} − ${b}·dense; read --area-${token}`);
      }
      if (inset) for (const [a, b, token] of [[16, 4, 'inset-surface-md'], [12, 4, 'inset-surface-sm']]) {
        assert.doesNotMatch(value, dense(a, b), `${selector} ${prop} writes ${a} − ${b}·dense; read --area-${token}`);
      }
      assert.doesNotMatch(value, /round\(down, calc\(var\(--area-control-(xs|sm|md|lg|xl)\) \* var\(--area-radius-factor\)\), 2px\)/,
        `${selector} ${prop} writes the ladder corner on a control height; read --area-radius-control-*`);
    }
  }
});

test('gaps on the 2px ladder never land between its rungs (system gaps L3, 2026-11-07)', () => {
  // ui-dense is in halves, so 8 − 2 × 0.5 drew 7 (Card's list items at type 13). The gap ladder reads ui-gap-step.
  for (const token of ['ui-stack', 'ui-cluster', 'gap-sm', 'gap-md', 'gap-xl']) {
    const m = css.match(new RegExp(`--area-${token}:\\s*([^;]+);`));
    assert.ok(m, `--area-${token} is emitted`);
    assert.match(m[1], /ui-gap-step/, `--area-${token} reads ui-gap-step, not the half step`);
  }
});

test('overlays enter from the one overlay scale (system gaps C7, 2026-11-07)', () => {
  for (const { selector, body } of rules) {
    if (selector.startsWith(':where(:root)') || selector.startsWith(':root')) continue;
    assert.doesNotMatch(body, /(?:^|[;\s])(?:scale|--_[\w-]*(?:scale|from)):\s*0\.97\b/, `${selector} writes 0.97; read --area-overlay-scale`);
  }
});

test('opacity reads the fade clock, so reduced motion keeps the fade and drops the movement (system gaps M2, 2026-11-07)', () => {
  for (const { selector, body } of rules) {
    assert.doesNotMatch(body, /opacity var\(--area-duration-(fast|base|moderate|slow)\)/, `${selector} fades on a movement clock; read --area-fade-*`);
  }
  const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(reduced, /--area-fade-base:\s*160ms/, 'reduced motion keeps a short fade');
  assert.match(reduced, /\[data-area-motion="0"\][^{]*\{[^}]*--area-fade-base:\s*0ms/, 'Motion 0 keeps no fade, reduced or not');
});

test('an exit is never slower than its enter, and accelerates away (docs/MOTION.md, Roles; system gaps M3; plan A5.1)', () => {
  // Owner 2026-11-11 (plan A5.1): anchored overlays enter and leave on `fast`, dialogs enter on `base` and leave on
  // `fast`; every exit reads `ease-exit`, so a surface never eases out into invisibility.
  const order = ['instant', 'quick', 'fast', 'base', 'moderate', 'slow'];
  const rank = value => order.indexOf(value.match(/--area-(?:duration|fade)-(\w+)/)?.[1] ?? '');
  const read = (body, name) => body.match(new RegExp(`${name}:\\s*([^;]+)`))?.[1].trim() ?? '';
  const anchored = ruleFor(':is(.area-popover, .area-menu, .area-tooltip)[popover]')?.body ?? '';
  const enter = read(anchored, '--_overlay-duration'), exit = read(anchored, '--_overlay-exit');
  assert.ok(rank(exit) >= 0 && rank(exit) <= rank(enter), `anchored overlays: exit ${exit} vs enter ${enter}`);
  assert.equal(enter, 'var(--area-duration-fast)', 'anchored overlays enter on fast (plan A5.1)');
  assert.ok(rank(read(anchored, '--_overlay-fade-exit')) <= rank(read(anchored, '--_overlay-fade')), 'anchored overlays: the exit fade is slower than the enter fade');
  const anchoredClosed = ruleFor(':is(.area-popover, .area-menu, .area-tooltip)[popover]:not(:popover-open)')?.body ?? '';
  assert.match(anchoredClosed, /--_overlay-ease:\s*var\(--area-ease-exit\)/, 'anchored overlays: the exit fade does not accelerate');
  assert.match(anchoredClosed, /--_overlay-move:\s*var\(--area-ease-exit\)/, 'anchored overlays: the exit scale does not accelerate');
  const modal = ':is(.area-dialog__modal, .area-command-palette__modal)';
  const open = read(ruleFor(modal)?.body ?? '', '--_overlay-duration');
  const closedBody = ruleFor(`${modal}:not([open])`)?.body ?? '';
  const closed = read(closedBody, '--_overlay-duration');
  assert.ok(rank(closed) >= 0 && rank(closed) < rank(open), `modals: exit ${closed} vs enter ${open}`);
  assert.equal(open, 'var(--area-duration-base)', 'dialogs enter on base (plan A5.1)');
  assert.match(closedBody, /--_overlay-ease:\s*var\(--area-ease-exit\)/, 'modals: the exit does not accelerate');
  const palette = read(ruleFor('.area-command-palette__modal')?.body ?? '', '--_overlay-duration');
  assert.ok(rank(palette) <= rank(enter), `the command palette takes the anchored clocks, not ${palette}`);
  // Every other surface's exit (Drawer, Toast, the native Select picker, the scrims) reads ease-exit too.
  for (const selector of ['.area-drawer__modal:not([open], :popover-open) > .area-drawer', '.area-toaster__list > li[data-leaving] > .area-toast', `${modal}:not([open])::backdrop`, '.area-drawer__modal:not([open])::backdrop'])
    assert.match(ruleFor(selector)?.body ?? '', /transition-timing-function:\s*var\(--area-ease-exit\)/, `${selector} does not leave on ease-exit`);
  assert.ok(rules.some(rule => rule.selector === '.area-select::picker(select)' && /opacity var\(--area-fade-fast\) var\(--area-ease-exit\)/.test(rule.body)), 'the Select picker does not leave on ease-exit');
});

test('a surface opened from a key appears at its size: no scale, only the fade (plan A5.2)', () => {
  // overlay.ts writes data-opened-by="keyboard" on every popover and dialog a key opens; one hook, read here.
  for (const selector of [':is(.area-popover, .area-menu, .area-tooltip)[popover][data-opened-by="keyboard"]', '.area-command-palette__modal[data-opened-by="keyboard"]'])
    assert.match(ruleFor(selector)?.body ?? '', /--_overlay-scale:\s*none\b/, `${selector} still scales`);
  // A context menu is the most frequent open: it never scales.
  assert.match(ruleFor('.area-menu.area-context-menu__menu[popover]')?.body ?? '', /--_overlay-scale:\s*none\b/, 'the context menu still scales');
  const hooks = [...css.matchAll(/\[data-opened-by(?:="([^"]*)")?\]/g)].map(match => match[1]);
  assert.ok(hooks.every(value => value === 'keyboard'), `an unknown data-opened-by value: ${hooks}`);
});

test('a highlight moving through a list lands and leaves at once (docs/MOTION.md, "List highlight"; plan A5.3)', () => {
  // Rows whose plate follows the pointer and the keys through a list: Menu and every list built on its rows (Context
  // menu, List box, Custom select, Combobox, Command palette), the native Select's options, List box's grid, Nav and
  // Tree view. None may carry a transition; their own parts (a check, a chevron, revealed actions) may.
  const top = (text, at) => { const out = []; let depth = 0, from = 0; for (let i = 0; i < text.length; i++) { const c = text[i]; if (c === '(' || c === '[') depth++; else if (c === ')' || c === ']') depth--; else if (depth === 0 && at.test(c)) { out.push(text.slice(from, i)); from = i + 1; } } out.push(text.slice(from)); return out.map(one => one.trim()).filter(Boolean); };
  const isRow = part => {
    if (part.includes('::')) return false;
    const last = top(part, /[\s>+~]/).at(-1);
    return /^\.area-(menu__item|list-box__item|nav__row|nav__item)(?![\w-])/.test(last)
      || (part.includes('.area-tree-view') && last.startsWith('[role="treeitem"]'))
      || (part.includes('.area-select') && /^option(?![\w-])/.test(last));
  };
  let checked = 0;
  for (const { selector, body } of rules) {
    if (!top(selector, /,/).some(isRow)) continue;
    checked++;
    const transition = body.match(/(?:^|[;\s])transition(?:-duration)?\s*:\s*([^;]+)/)?.[1].trim();
    if (transition === undefined) continue;
    assert.match(transition, /^(none|0s(\s*,\s*0s)*)$/, `${selector} transitions its highlight: ${transition}`);
  }
  assert.ok(checked > 20, `expected the list rows' rules, found ${checked}`);
});

test('colour, opacity and shadow never ride an overshooting curve (plan A5.4)', () => {
  // Under Easing Spring, ease-out and ease-drawer are a spring that passes 1; effects read ease-effects, which never
  // does (axes/easing.ts; easing.test.ts checks every value). ease-in-out, ease-in and ease-exit never overshoot.
  const EFFECT = /^(opacity|background|background-color|border(-[a-z-]+)?-color|color|box-shadow|outline-color|fill|stroke|text-decoration-color|filter|backdrop-filter|caret-color)$/;
  const split = value => { const out = []; let depth = 0, from = 0; for (let i = 0; i < value.length; i++) { const c = value[i]; if (c === '(') depth++; else if (c === ')') depth--; else if (c === ',' && depth === 0) { out.push(value.slice(from, i).trim()); from = i + 1; } } out.push(value.slice(from).trim()); return out; };
  const overshoot = /var\(--area-ease-(out|drawer|spring)\)/;
  let seen = 0;
  for (const { selector, body } of rules) {
    const shorthand = body.match(/(?:^|[;\s])transition\s*:\s*([^;]+)/)?.[1];
    if (shorthand) for (const item of split(shorthand)) {
      const prop = item.split(/\s+/)[0];
      if (!EFFECT.test(prop)) continue;
      seen++;
      assert.doesNotMatch(item, overshoot, `${selector}: ${item}`);
    }
    const props = body.match(/(?:^|[;\s])transition-property\s*:\s*([^;]+)/)?.[1];
    const curves = body.match(/(?:^|[;\s])transition-timing-function\s*:\s*([^;]+)/)?.[1];
    if (props && curves) {
      const list = split(curves);
      split(props).forEach((prop, i) => { if (EFFECT.test(prop)) assert.doesNotMatch(list[i % list.length], overshoot, `${selector}: ${prop} on ${list[i % list.length]}`); });
    }
  }
  assert.ok(seen > 80, `expected the colour and opacity transitions, found ${seen}`);
  assert.match(css.match(/--area-transition:\s*([^;]+);/)?.[1] ?? '', /^background-color var\(--area-duration-quick\) var\(--area-ease-effects\)/, 'the shared transition leaves colour on quick and ease-effects (plan A5.5)');
});

test('a press gives on the plate; the label stays at its size (plan A5.6)', () => {
  // A control that scales to the Feedback give under :active hands its content the inverse scale on the same clocks.
  const gives = rules.filter(({ selector, body }) => /:active/.test(selector) && /(?:^|[;\s])scale:\s*var\(--(?:_give|area-feedback-scale[\w-]*)\)/.test(body) && !/>\s*\*$/.test(selector));
  assert.ok(gives.length >= 2, `expected Button and Chip's press, found ${gives.length}`);
  for (const { selector, body } of gives) {
    if (!/area-(button|chip)\b/.test(selector)) continue;
    const give = body.match(/scale:\s*(var\([^)]+\))/)[1];
    const inverse = ruleFor(`${selector} > *`)?.body ?? '';
    assert.ok(inverse.includes(`scale: calc(1 / ${give})`), `${selector} scales its label with the plate`);
    assert.match(inverse, /transition-duration:\s*var\(--area-press-in\)/, `${selector}: the label's inverse scale is not on the press's clock`);
  }
});

test('Progress moves its fill by a transform, never by its width (plan A5.7)', () => {
  const bar = ruleFor('.area-progress__bar')?.body ?? '';
  const transition = bar.match(/transition:\s*([^;]+)/)?.[1] ?? '';
  assert.match(transition, /^translate /, transition);
  assert.doesNotMatch(transition, /inline-size|width/, transition);
});

test('every field that paints invalid paints success and warning too (components audit O1, 2026-11-07)', () => {
  // A Field hands every control its status; a field that draws the error edge draws the other two the same way.
  // One field shell (plan B3.1): one rule per tone, every field in it, each setting the edge from the tone's ink.
  const fields = ['.area-input', '.area-number-field', '.area-textarea', '.area-select', '.area-otp-field', '.area-date-picker__trigger', '.area-custom-select__trigger', '.area-tag-picker__field'];
  for (const [state, attr] of [['invalid', '[data-invalid], [aria-invalid="true"]'], ['success', '[data-success]'], ['warning', '[data-warning]']]) {
    const rule = rules.find(r => r.selector.includes(attr) && new RegExp(`--_border:\\s*var\\(--_tone-${state}\\)`).test(r.body));
    assert.ok(rule, `no shell rule paints ${state}`);
    for (const field of fields) assert.ok(rule.selector.includes(field), `${field} does not take ${state}`);
    assert.match(rule.selector, /\.area-input-group:has\(/, `Input group does not take ${state} from its fields`);
  }
});

test('status surfaces take every tone Button and Badge take (components audit O4, 2026-11-07)', async () => {
  const { MANIFESTS } = await import('../dist/modules/index.js');
  const tones = MANIFESTS.button.variants.tone;
  for (const family of ['alert', 'toast', 'indicator']) {
    assert.deepEqual(MANIFESTS[family].variants.tone, tones, `${family} tones`);
    for (const tone of tones) {
      if (family === 'toast' && tone === 'neutral') continue;
      assert.ok(rules.some(rule => rule.selector.includes(`.area-${family}--${tone}`)), `.area-${family}--${tone} is painted`);
    }
  }
  // A status icon's ink is the shared mark role for every tone that has one (Governance § 4).
  for (const tone of tones.filter(tone => tone !== 'neutral')) {
    assert.ok(rules.some(rule => rule.selector === `.area-toast--${tone} .area-toast__icon` && rule.body.includes(`--area-fg-${tone}-mark`)), `Toast ${tone} icon reads fg-${tone}-mark`);
    assert.ok(rules.some(rule => rule.selector === `.area-alert--${tone}` && rule.body.includes(`--area-fg-${tone}-mark`)), `Alert ${tone} icon reads fg-${tone}-mark`);
  }
});

test('read-only is spelled one way: data-read-only (components audit O2, 2026-11-07)', () => {
  // `data-readonly` survives only as Radio group's deprecated alias, beside the shared spelling in the same selector.
  for (const { selector } of rules) {
    if (!selector.includes('[data-readonly]')) continue;
    assert.match(selector, /\.area-radio-group:is\(\[data-read-only\], \[data-readonly\]\)/, selector);
  }
});

test('one announcer: no family writes a live region of its own, except where the visible text is the message (components audit D1, 2026-11-07)', () => {
  // DESIGN_SYSTEM.md, "Announcements". A change said away from focus goes through `announce` / `useAnnouncement`
  // (components/announce.ts). The exceptions are elements whose visible content is itself the message, rendered with it.
  const allowed = new Map([
    ['announce.ts', ['aria-live']], // the announcer's own two regions
    ['Alert.tsx', ['role={tone === "danger" ? "alert" : "status"}']], // Alert: the banner is the message
    ['Spinner.tsx', ['role={label ? "status" : undefined}']], // Spinner: a named wait, in place
    ['Toast.tsx', ['role={live ? (tone === "danger" ? "alert" : "status") : undefined}']], // Toast without a Toaster (a Toaster turns it off)
    ['TurnNotice.tsx', ['role={status === "error" ? "alert" : "status"}']], // a conversation's notice line
    ['Pagination.tsx', ['aria-live']], // compact "Page 2 of 10": the visible words, built from the label's nodes
  ]);
  const dir = new URL('../src/components/', import.meta.url);
  const pattern = /role=\{[^}]*"(?:status|alert|log)"[^}]*\}|role="(?:status|alert|log)"|aria-live|setAttribute\("role", ?"(?:status|alert)"/g;
  for (const name of readdirSync(dir)) {
    if (!/\.tsx?$/.test(name)) continue;
    const found = (readFileSync(new URL(name, dir), 'utf8').match(pattern) ?? []).filter(hit => !hit.startsWith('setAttribute') || name !== 'announce.ts');
    assert.deepEqual(found, allowed.get(name) ?? [], `${name} writes its own live region; use announce() or useAnnouncement()`);
  }
});

test('a send or an upload that fails is said, offers Retry as onRetry and wears one mark (components audit O6, V10, 2026-11-07)', () => {
  // Message (not sent), Queue (a queued message not sent), Attachment and File upload item (an upload that failed): the
  // failure goes through the shared announcer, Retry is `onRetry`, and the mark is the danger ink's dismiss-circle.
  const dir = new URL('../src/components/', import.meta.url);
  const source = name => readFileSync(new URL(name, dir), 'utf8');
  const section = (text, from, to) => text.slice(text.indexOf(from), to ? text.indexOf(to) : undefined);
  const families = {
    Message: section(source('Message.tsx'), 'export const Message =', 'export interface MessageActionsProps'),
    Attachment: section(source('Attachment.tsx'), 'export const Attachment ='),
    Queue: section(source('Queue.tsx'), 'export const Queue ='),
    FileUploadItem: section(source('FileUpload.tsx'), 'export const FileUploadItem ='),
  };
  for (const [family, code] of Object.entries(families)) {
    assert.match(code, /useAnnouncement\(/, `${family} does not say its failure through the announcer`);
    assert.match(code, /onRetry \?/, `${family} does not offer Retry from onRetry`);
  }
  for (const family of ['Message', 'Attachment', 'Queue']) assert.match(families[family], /<Glyph name="dismiss-circle" \/>/, `${family}'s failure mark`);
  const body = selector => rules.filter(rule => rule.selector === selector).map(rule => rule.body).join(';');
  // A failure glyph reads the tone's mark ink (plan A3.4).
  assert.match(body('.area-message__status > svg'), /color:\s*var\(--area-fg-danger-mark\)/);
  assert.match(body('.area-attachment__mark'), /color:\s*var\(--area-fg-danger-mark\)/);
  // V9: the stack's meeting corner is the bubble's own corner, tightened, so it follows the Radius setting.
  assert.match(body('.area-message__bubble'), /--_bubble-meet:\s*calc\(var\(--_bubble-radius\) \/ 4\)/);
  assert.match(body('.area-message__stack'), /--_stack-gap:\s*var\(--area-space-2\)/);
});

test('every label hue reads its roles, never a tone or a palette step of its own (components audit D5, 2026-11-07)', async () => {
  // semantic/hues.ts: one role table for every hue. Tag `color`, Board columns, and Link's and Citation's hued inks read it.
  const tokens = readFileSync(new URL('../../tokens/dist/css/tokens.css', import.meta.url), 'utf8');
  const hues = ['neutral', 'gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'];
  const roles = ['text', 'icon', 'border', 'bg', 'bg-hover', 'bg-active', 'accent', 'on-accent', 'bg-translucent', 'border-translucent'];
  for (const hue of hues) for (const role of roles) assert.match(tokens, new RegExp(`--area-hue-${hue}-${role}:`), `--area-hue-${hue}-${role} is emitted`);
  const { MANIFESTS } = await import('../dist/modules/index.js');
  assert.deepEqual(MANIFESTS.tag.variants.color, hues, 'Tag takes every hue');
  assert.deepEqual(MANIFESTS.boardColumn.variants.color, hues, 'Board takes every hue');
  const painted = (selector) => rules.filter(rule => rule.selector === selector).map(rule => rule.body).join(';');
  for (const hue of hues) {
    assert.match(painted(`.area-tag--${hue}`), new RegExp(`--_bg:\\s*var\\(--area-hue-${hue}-bg\\);\\s*--_fg:\\s*var\\(--area-hue-${hue}-text\\)`), `Tag ${hue}`);
    assert.match(painted(`.area-board-column--${hue}`), new RegExp(`--_ground:\\s*var\\(--area-hue-${hue}-bg-translucent\\)`), `Board ${hue} ground`);
  }
  for (const family of ['link', 'citation']) for (const hue of MANIFESTS[family].variants.ink.filter(ink => hues.includes(ink)))
    assert.match(painted(`.area-${family}--${hue}`), new RegExp(`--_ink:\\s*var\\(--area-hue-${hue}-text\\)`), `${family} ${hue}`);
});

test('change words are one vocabulary in one set of inks (components audit D6, 2026-11-07)', async () => {
  // Governance § 4, "Change words": added, modified, deleted, untracked, renamed; `removed` survives only as a deprecated
  // alias beside `deleted`. Tree view, Tabs and Edit summary paint them from fg-change-<status>.
  const { CHANGE_STATUSES, CHANGE_MARK } = await import('../dist/modules/index.js');
  assert.deepEqual([...CHANGE_STATUSES], ['added', 'modified', 'deleted', 'untracked', 'renamed']);
  assert.deepEqual(CHANGE_STATUSES.map(status => CHANGE_MARK[status].letter), ['A', 'M', 'D', 'U', 'R']);
  const body = selector => rules.find(rule => rule.selector === selector)?.body ?? '';
  for (const status of CHANGE_STATUSES) {
    assert.match(body(`.area-tree-view__status[data-status="${status}"]`), new RegExp(`var\\(--area-fg-change-${status}\\)`), `Tree view ${status}`);
    assert.match(body(`.area-tabs__tab[data-status="${status}"] .area-tabs__label`), new RegExp(`var\\(--area-fg-change-${status}\\)`), `Tabs ${status}`);
  }
  assert.match(body('.area-edit-summary__added'), /var\(--area-fg-change-added\)/);
  assert.match(body('.area-edit-summary__deleted, .area-edit-summary__removed'), /var\(--area-fg-change-deleted\)/);
  // `removed` is never painted alone: each of its selectors names `deleted` beside it.
  for (const { selector } of rules) {
    if (!/(__removed|--removed)\b/.test(selector)) continue;
    assert.match(selector, /(__deleted|--deleted)\b/, `${selector} paints the deprecated spelling without the shared word`);
  }
  // Unseen is a dot apart from the status, never a colour of it.
  for (const part of ['.area-tree-view__unseen', '.area-tabs__unseen']) assert.match(body(part), /background-color:\s*var\(--area-accent-indicator\)/, part);
});

test('a change since the default or the saved view is one mark: a 6 dot in the modified ink (components audit N4, N5, 2026-11-07)', () => {
  // Setting row's modified dot and Filter bar's unsaved dot say the same thing (Governance § 4, Change words: modified),
  // so they are one mark, the size of Tabs' and Tree view's unseen dot, which keeps its own (accent) ink.
  const body = selector => rules.find(rule => rule.selector === selector)?.body ?? '';
  for (const part of ['.area-setting-row__modified', '.area-filter-bar__dirty']) {
    assert.match(body(part), /background-color:\s*var\(--area-fg-change-modified\)/, `${part} is not the modified ink`);
    assert.match(body(part), /inline-size:\s*var\(--area-space-6\)/, `${part} is not the 6 dot`);
    assert.match(body(part), /block-size:\s*var\(--area-space-6\)/, `${part} is not the 6 dot`);
  }
  assert.match(body('.area-tabs__unseen'), /inline-size:\s*var\(--area-space-6\)/, 'the unseen dot changed size');
  assert.match(css, /\.area-setting-row__modified,\s*\.area-filter-bar__dirty\s*\{[^}]*background-color:\s*CanvasText/, 'the change dots have no forced-colours repair');
});

test('a selected row in a list that has lost focus steps back to the hover plate (components audit V15, 2026-11-07)', () => {
  // DESIGN_SYSTEM.md "Shared state paint": every list with its own focus quiets its selection to the hover plate while
  // focus is elsewhere, never quieter (the hover plate's text contrast is asserted in tokens, and Hover fill floors at 25).
  const quiet = [
    '.area-list-box:not(:focus-within) .area-list-box__item[aria-selected="true"]:not([data-disabled])',
    '.area-tree-view--navigation:not(:focus-within) [role="treeitem"][aria-selected="true"]:not([aria-current="page"])',
    // A press still shows on it (plan B7.2), so the quieter plate stands aside while the row is held.
    '.area-table:not(:focus-within):has(tbody :is(input, button, a[href], [tabindex])) tbody tr:is([data-selected], [aria-selected="true"]):not(:active)',
  ];
  for (const selector of quiet) assert.match(ruleFor(selector)?.body ?? '', /var\(--area-bg-component-hover\)/, `${selector} does not step back to the hover plate`);
  // The place you are (Nav's current page, a tree's current row) is not a selection, and keeps its plate.
  for (const { selector } of rules) {
    if (!/:not\(:focus-within\)/.test(selector) || !/aria-current/.test(selector)) continue;
    assert.match(selector, /:not\(\[aria-current="page"\]\)/, `${selector} quiets the current page`);
  }
});

test('inactive looks disabled but keeps a full-strength focus indicator (components audit V2, 2026-11-07)', () => {
  // An opacity on the focusable element would fade its focus ring with it: inactive fades the parts, never the element.
  for (const block of ['.area-button', '.area-menu__item', '.area-nav__item']) {
    const own = ruleFor(`${block}[data-inactive]`);
    assert.ok(own, `${block} has no inactive rule`);
    assert.doesNotMatch(own.body, /(^|[;\s])opacity\s*:/, `${block}[data-inactive] fades the element and its ring`);
    // Button's parts take --_dim, the disabled opacity for a neutral button and 1 for a toned one, which repaints (B7.9).
    assert.ok(rules.some(({ selector, body }) => selector.startsWith(`${block}[data-inactive] >`) && /opacity:\s*var\((--area-opacity-disabled|--_dim)\)/.test(body)), `${block} doesn't fade its parts`);
    // No hover or press paint, as disabled.
    for (const { selector } of rules) {
      if (!selector.startsWith(block + ':hover') && !selector.startsWith(block + ':active')) continue;
      if (!/:not\(/.test(selector)) continue;
      assert.match(selector, /data-inactive/, `${selector} paints an inactive ${block}`);
    }
  }
});

test('every list that filters as you type marks the typed text with one mark (components audit V4, 2026-11-07)', () => {
  // One helper (highlightMatch) and one part (Menu's __match) for Command palette, Combobox and Custom select's filter, so
  // a match reads the same in every list; no family draws its own.
  const dir = new URL('../src/components/', import.meta.url);
  for (const name of ['CommandPalette.tsx', 'Combobox.tsx', 'CustomSelect.tsx']) {
    assert.match(readFileSync(new URL(name, dir), 'utf8'), /import \{ highlightMatch \} from "\.\/highlight\.tsx"/, `${name} uses highlightMatch`);
  }
  for (const name of readdirSync(dir).filter(file => /\.tsx$/.test(file) && file !== 'highlight.tsx')) {
    assert.doesNotMatch(readFileSync(new URL(name, dir), 'utf8'), /<mark\b/, `${name} draws its own mark`);
  }
  const match = ruleFor('.area-menu__match');
  assert.ok(match, 'the match part has its rule');
  assert.match(match.body, /font-weight: var\(--area-weight-strong\)/);
  assert.match(match.body, /color: inherit/, 'the mark keeps the row\'s ink, so it holds on every plate');
  assert.match(match.body, /background: none/);
});

test('every resize edge shares one handle paint: Splitter\'s handle and Panel\'s resizable edge (components audit N6, 2026-11-07)', () => {
  const both = (state = '', pseudo = '') => ruleFor(`.area-splitter__handle${state}${pseudo}, .area-panel__resize${state}${pseudo}`)?.body ?? '';
  assert.match(both(), /--_sash-delay:\s*300ms/, 'the 300 ms rest before an edge shows itself');
  assert.match(both(), /--_sash-line:\s*var\(--area-border-width\)/);
  assert.match(both(':hover'), /--_sash-line:\s*2px;\s*--_sash-ink:\s*var\(--area-border-hover\)/, 'hover: a 2 line in the hover edge ink');
  assert.match(both('[data-resizing]'), /--_sash-line:\s*2px;\s*--_sash-ink:\s*var\(--area-focus-color\)/, 'dragging: the Selection ink (plan B7.5)');
  assert.match(both(':focus-visible', '::after'), /background-color:\s*var\(--area-focus-color\)/, 'keyboard focus: the focus pill');
  // A step, never an animation, so reduced motion has nothing to stop (MOTION.md, Resize edge).
  const transition = both('', '::before').match(/transition:\s*([^;]+)/)?.[1] ?? '';
  assert.ok(transition.split(',').every(part => /^[a-z-]+ 0s$/.test(part.trim())), transition);
  // No resize edge paints itself apart from the shared rule.
  for (const { selector, body } of rules) {
    if (!/\.area-panel__resize|\.area-splitter__handle/.test(selector) || /forced/.test(selector)) continue;
    if (selector.includes(', ')) continue;
    assert.doesNotMatch(body, /background(-color)?:\s*var\(--area-(focus-color|accent|border-hover)/, `${selector} paints a resize edge on its own`);
  }
});

test('hover-revealed actions hide by opacity, land at once and leave on the fade clock (components audit N14, 2026-11-07)', () => {
  // Toolbar floating (the hover action bar), Panel's revealActions, Code block's and Nav's: Tab still reaches them, and
  // focus inside the host shows them (MOTION.md, Hover-revealed actions).
  const hosts = {
    '.area-toolbar--floating': [/^\.area-toolbar--floating$/, /^:is\(:hover, :focus-within\) > \.area-toolbar--floating/],
    '.area-panel__section--reveal': [/^\.area-panel__section--reveal > \.area-panel__heading > \.area-panel__actions > \*$/, /^\.area-panel__section--reveal:is\(:hover, :focus-within/],
    '.area-code-block--reveal-actions': [/^\.area-code-block--reveal-actions > \.area-code-block__actions$/, /^\.area-code-block--reveal-actions:is\(:hover, :focus-within/],
    '.area-nav__row--reveal': [/^\.area-nav__row--reveal > \.area-nav__actions$/, /^\.area-nav__row--reveal:is\(:hover, :focus-within/],
  };
  for (const [host, [hidden, shown]] of Object.entries(hosts)) {
    const hide = rules.find(rule => hidden.test(rule.selector) && /opacity:\s*0\b/.test(rule.body));
    assert.ok(hide, `${host}: no hiding rule`);
    assert.match(hide.body, /transition:\s*opacity var\(--area-fade-fast\) var\(--area-ease-effects\)/, `${host} leaves on another clock`); // the effects curve since plan A5.4
    const show = rules.find(rule => shown.test(rule.selector) && /opacity:\s*1\b/.test(rule.body));
    assert.ok(show, `${host}: no rule shows it on hover and focus`);
    assert.match(show.body, /transition-duration:\s*0s/, `${host} does not land at once`);
    assert.doesNotMatch(hide.body, /display:\s*none|visibility:\s*hidden/, `${host} hides from the keyboard`);
  }
});

test('a count and a status badge on one line share one shape and one text side (DESIGN_SYSTEM.md, "Marks on one line")', async () => {
  // Owner, 2026-11-06/07 ("why are count and badge so stylistically and scale wise different"; picks on the Count beside
  // Badge page): the same size of each is one height and one text size, and they keep their words (h - 6) / 2 from the
  // outer edge, edge counted once; both are pills by default, or neither (docs/research/count-badge-2026-11-07).
  const { DEFAULT_PILLS } = await import('../../tokens/dist/config.js');
  assert.equal(DEFAULT_PILLS.includes('badge'), DEFAULT_PILLS.includes('count'), 'Badge and Count share the default shape');
  const badgeSide = rules.filter(rule => rule.selector === '.area-badge' && /--_box-text/.test(rule.body)).at(-1)?.body ?? '';
  assert.match(badgeSide, /--_box-text:\s*var\(--area-space-6\)/, "Badge's text side is (h - 6) / 2 by the inset contract (inset.css), the mark side");
  for (const size of ['sm', 'md']) {
    assert.match(ruleFor(`.area-badge--${size}`)?.body ?? '', new RegExp(`--_height:\\s*var\\(--area-mark-label-${size}\\)`), `Badge ${size} is the ${size} mark height`);
    assert.match(ruleFor(`.area-count--${size}`)?.body ?? '', new RegExp(`--_count-height:\\s*var\\(--area-mark-label-${size}\\)`), `Count ${size} is the ${size} mark height`);
  }
  assert.match(ruleFor('.area-count[data-single]')?.body ?? '', /padding-inline:\s*0/, 'a one-character count drops its sides');
  assert.match(ruleFor('.area-indicator--count[data-single]')?.body ?? '', /padding-inline:\s*0/, "Indicator's one-character count drops its sides, as Count's (plan B5.3)");
});

// One mark (plan B5.1, B5.2, B5.3; inset.css "One mark"; DESIGN_SYSTEM.md, "One mark"). Every mark family sets the
// recipe's inputs and reads its outputs; none writes its own side, baseline, corner, text or gap again.
const MARK_RECIPE = ':where(.area-badge, .area-count, .area-tag, .area-kbd, .area-citation:not(.area-citation--footnote), .area-indicator--count, .area-stepper-step__marker)';
const MARK_FAMILIES = {
  badge: { selector: '.area-badge', height: /--_mark-height:\s*var\(--_height\)/, corner: ['--_badge-radius', 'border-radius: var(--_badge-radius)'], text: /--_text:\s*var\(--_mark-text\)/ },
  count: { selector: '.area-count', height: /--_mark-height:\s*var\(--_count-height\)/, corner: ['border-radius: var(--_mark-corner)'], text: /--_count-text:\s*var\(--_mark-text\)/ },
  tag: { selector: '.area-tag', height: /--_mark-height:\s*var\(--_height\)/, chip: true, corner: ['--_corner: var(--_mark-corner)'], text: /font-size:\s*var\(--_mark-text\)/ },
  kbd: { selector: '.area-kbd', height: /--_mark-height:\s*var\(--_height\)/, chip: true, corner: ['border-radius: var(--_mark-corner)'], text: /font-size:\s*var\(--_mark-text\)/ },
  citation: { selector: '.area-citation', height: /--_mark-height:\s*var\(--_height\)/, corner: ['border-radius: var(--_mark-corner)'], text: /font-size:\s*var\(--_mark-text\)/ },
  indicator: { selector: '.area-indicator--count', height: /--_mark-height:\s*var\(--area-mark-label-md\)/, corner: ['border-radius: var(--_mark-corner)'], text: /var\(--_mark-text\)\/var\(--_mark-leading\)/ },
  // Stepper's marker is Kbd's keycap (plan B8.2 hand-over, 2026-11-14): the chip corner on the marker's height.
  stepper: { selector: '.area-stepper-step__marker', height: /--_mark-height:\s*var\(--_marker\)/, chip: true, corner: ['border-radius: var(--_mark-corner)'], text: /font-size:\s*var\(--area-text-xs-size\)/ },
};

test('one mark: a mark\'s side, baseline, corner, text and gap come from the one recipe (plan B5.1)', () => {
  const norm = text => text.replace(/\s+/g, ' ');
  const recipe = norm(ruleFor(MARK_RECIPE)?.body ?? '');
  assert.ok(recipe, 'the shared mark recipe is in inset.css');
  const expect = {
    '--_mark-side': 'calc((var(--_mark-height) - var(--area-space-6)) / 2 - var(--_mark-border))',
    '--_mark-baseline': 'calc(var(--area-stroke-width) + round(nearest, calc((var(--_mark-height) - 2 * var(--area-stroke-width) + 1cap) / 2), 1px))',
    '--_mark-cap-above': 'calc(var(--_mark-baseline) - 1cap - var(--_mark-border))',
    '--_mark-cap-below': 'calc(var(--_mark-height) - var(--_mark-baseline) - var(--_mark-border))',
    // A pill is one value, radius-full (plan B5.1 hand-over, 2026-11-14: Citation computed 10003px, full plus the corner).
    '--_mark-corner': 'calc((1 - var(--_mark-chip)) * max(var(--area-radius-min), round(down, calc(var(--_mark-height) * var(--area-radius-factor)), 2px), var(--_mark-pill) * var(--area-radius-full)) + var(--_mark-chip) * min(var(--area-radius-small), calc(var(--_mark-height) / 2)))',
    '--_mark-text': 'calc(var(--area-control-xs-text) + (var(--area-control-md-text) - var(--area-control-xs-text)) * var(--_mark-lg))',
    '--_mark-gap': 'calc(var(--area-space-2) * (1 + max(0, sign(var(--_mark-height) - var(--area-mark-label-sm)))))',
  };
  for (const [prop, value] of Object.entries(expect)) assert.ok(recipe.includes(`${prop}: ${value}`), `the recipe's ${prop} is ${value}`);
  // The recipe reads no density, so a mark's text and height follow its size prop only (plan B5.2).
  assert.doesNotMatch(recipe, /ui-dense|ui-level|density|ui-leading/, 'the recipe never reads density');
  const parts = norm(rules.find(rule => rule.selector.startsWith('.area-badge > .area-badge__label, .area-tag > .area-tag__label') && /padding-block/.test(rule.body))?.body ?? '');
  assert.ok(parts.includes('padding-block: var(--_mark-cap-above) var(--_mark-cap-below)') && parts.includes('text-box: trim-both cap alphabetic'), 'every mark\'s text part is trimmed and placed by the recipe');
  for (const [family, { selector, height, chip, corner, text }] of Object.entries(MARK_FAMILIES)) {
    const own = rules.filter(rule => rule.selector === selector).map(rule => norm(rule.body)).join(';');
    assert.match(own, height, `${family} sets the recipe's height`);
    assert.equal(/--_mark-chip:\s*1/.test(own), !!chip, `${family} is ${chip ? 'an object chip (the small corner)' : 'on the pill role'}`);
    for (const piece of corner) assert.ok(own.includes(piece), `${family}'s corner is the recipe's (${piece})`);
    assert.match(own, text, `${family}'s text is the recipe's`);
  }
  // Nothing else writes a mark's cap baseline or the old optical lift: one formula, in the recipe.
  for (const { selector, body } of rules) {
    if (selector === MARK_RECIPE) continue;
    if (!/area-(badge|count|tag|kbd|citation|indicator)\b/.test(selector)) continue;
    assert.doesNotMatch(body, /\+ 1cap\) \/ 2/, `${selector} writes its own cap baseline: read --_mark-baseline`);
    assert.doesNotMatch(body, /optical-lift/, `${selector} lifts its label off the marks' cap centre`);
  }
});

test('the mark ladder is 14 / 18 / 22 at type 13 at every density, whole and distinct at every type (plan B5.1, G12)', () => {
  const tokensCss = readFileSync(new URL('../../tokens/dist/css/tokens.css', import.meta.url), 'utf8');
  const axesCss = readFileSync(new URL('../../tokens/dist/css/axes.css', import.meta.url), 'utf8');
  const ladder = [...(tokensCss + axesCss).matchAll(/--area-mark-label-(sm|md|lg):\s*([^;]+);/g)].map(([, size, value]) => [size, value.trim()]);
  assert.ok(ladder.length >= 3, 'the ladder is emitted');
  const want = { sm: 'var(--area-type-small-leading)', md: 'calc(var(--area-type-small-leading) + 4px)', lg: 'calc(var(--area-type-small-leading) + 8px)' };
  for (const [size, value] of ladder) assert.equal(value, want[size], `mark-label-${size} is the small line plus ${size === 'sm' ? 0 : size === 'md' ? 4 : 8}, the same at every density`);
  // The small line at every type is even, so H, (H - 6) / 2 and the mark's gaps are whole pixels at every type.
  const smallLines = [...axesCss.matchAll(/--area-type-small-leading:\s*(\d+)px/g)].map(([, px]) => Number(px));
  assert.ok(smallLines.length >= 5, 'a small line per type');
  for (const line of smallLines) {
    for (const h of [line, line + 4, line + 8]) {
      assert.equal(h % 2, 0, `a ${h} mark is even`);
      assert.ok(Number.isInteger((h - 6) / 2), `a ${h} mark's side is whole`);
    }
  }
});

test('an inline chip never exceeds its line (plan B5.1, VC24)', () => {
  const norm = text => text.replace(/\s+/g, ' ');
  const chip = norm(ruleFor(':where(.area-code, .area-mention--soft)')?.body ?? '');
  assert.ok(chip.includes('--_chip-pad-block: max(0px, calc((1lh - var(--_chip-content)) / 2 - var(--_chip-border)))'), 'the chip pads only what its line leaves round the font');
  assert.match(rules.filter(rule => rule.selector === '.area-code').map(rule => norm(rule.body)).join(';'), /padding: var\(--_chip-pad-block\) var\(--_chip-pad-inline\)/, 'inline Code takes the chip padding');
  assert.match(norm(ruleFor('.area-mention--soft')?.body ?? ''), /--_mention-pad-block: var\(--_chip-pad-block\)/, 'a soft Mention takes the chip padding');
});

// --- Type rules (plan A9, docs/research/system-evaluation-2026-11-11; DESIGN_SYSTEM.md, "Ink and weight" and "Size
// and shape"; area-type-usage). Each guards one rule across every family.

/** Every declaration of a property in a component rule (token scopes and @font-face left out). */
const declarations = props => rules.flatMap(({ selector, body }) => {
  if (/^(:root|:where\(:root\)|\[data-area|font-face|from|to|\d)/.test(selector)) return [];
  return [...body.matchAll(new RegExp(`(?:^|[;\\s])(${props})\\s*:\\s*([^;]+)`, 'g'))].map(([, prop, value]) => ({ selector, prop, value: value.trim() }));
});

test('text-xs is for marks: words that label, explain, warn or locate are text-sm or larger (plan A9.2)', () => {
  // The parts allowed the mark size, each a mark, a data label, a status letter or code text (code-block sm, Diff, a
  // token's name). Anything else that sets text-xs (or control-xs-text, its alias) is a word at the mark size: T1 found
  // a field's error message, a slider's ends, the calendar's days and a panel's labels there.
  const MARKS = [
    /^\.area-avatar--(xs|sm)$/, /^\.area-(badge|chip|timeline-item)__(avatar|media) > \.area-avatar$/, // initials
    /^\.area-badge$/, /^\.area-count$/, /^\.area-indicator--count$/, /^\.area-tag$/, /^\.area-citation$/, /^:where\(\.area-badge, \.area-count, /, // marks and the one mark recipe
    /^\.area-kbd(--sm|--md)?$/, /^\.area-menu__item \.area-kbd$/, // keys
    /^\.area-stepper-step__marker$/, /^\.area-reference-list__count$/, /^\.area-tree-view__status$/, // numbers and status letters on marks
    /^\.area-chart__(plot|legend-item|note)$/, /^\.area-box-model$/, // data labels
    /^\.area-code$/, /^\.area-code-block--sm$/, /^\.area-diff$/, /^\.area-token-row\.area-code$/, // code text
  ];
  const found = declarations('[\\w-]+').filter(({ value }) => /--area-(text-xs-size|control-xs-text)\b/.test(value));
  assert.ok(found.length >= 15, `expected the marks' text-xs declarations, found ${found.length}`);
  for (const { selector, prop } of found) {
    assert.ok(MARKS.some(mark => mark.test(selector)), `${selector} sets ${prop} at text-xs: words take text-sm or larger (add it to the marks only if it is a mark)`);
  }
});

test('no literal font size, line height or tracking: text reads the type axis (plan A9.9)', () => {
  // A literal ignores the Type setting (Kbd's fixed 11, Code block sm's 18 line less density, inline Code's 1.35). Allowed:
  // a token or a private property, inherit, a unitless 0 or 1 line for a box that holds one glyph, 1cap, and a ratio of
  // the host floored at a ramp step (inline Code, Citation's footnote). Folder's and File page's labels are aria-hidden
  // artwork drawn to the figure's own scale.
  const ARTWORK = /^\.area-(folder__count|file-page__label|folder__badge > \.area-avatar)$/;
  for (const { selector, prop, value } of declarations('font-size|line-height|letter-spacing')) {
    if (ARTWORK.test(selector)) continue;
    if (/^(inherit|normal|0|1|1cap)$/.test(value)) continue;
    if (prop === 'letter-spacing' && selector === '.area-otp-field__control' && value === '-0.5em') continue; // the hidden input's caret trick
    const bare = value.replace(/var\((--[\w-]+)(?:,\s*var\(--[\w-]+\))?\)/g, 'T');
    if (/^(T|max\(T, 0\.\d+em\))$/.test(bare)) continue;
    assert.fail(`${selector} sets ${prop}: ${value}, a literal off the type axis`);
  }
  assert.doesNotMatch(css, /--_(code|diff)-leading:[^;]*--area-leading-18/, 'code lines are a role on the type axis, never the fixed 18 less density');
  for (const selector of ['.area-code-block--sm', '.area-diff']) {
    assert.match(rules.filter(rule => rule.selector === selector).map(rule => rule.body).join(';'), /--_(code|diff)-leading:\s*var\(--area-text-xs-code-leading\)/, `${selector}: code takes the code leading`);
  }
  assert.ok(!declarations('--_font').some(({ selector, value }) => selector.includes('area-kbd') && /--area-size-\d+/.test(value)), 'every Kbd reads the mark text, never a fixed step');
  assert.doesNotMatch(ruleFor('.area-tag')?.body ?? '', /font-size:[^;]*(ui-dense|ui-leading|--_small)/, "Tag's text follows its size, never density (plan B5.2)");
});

test('weights come from the one weight table (plan A9.5)', () => {
  // Two weights in UI text and a third for page titles: every weight is a weight token (or a private property that holds
  // one), never a number.
  for (const { selector, prop, value } of declarations('font-weight|--_[\\w-]*weight')) {
    assert.match(value, /^(inherit|var\(--(area-weight-(regular|strong|heading)|_[\w-]+)(, var\(--area-weight-(regular|strong)\))?\))$/, `${selector} sets ${prop}: ${value}`);
  }
  // 600 heads a page: titles from title-sm up (Page header md and lg) and nothing in an interface's rows or controls.
  const heading = declarations('font-weight|--_[\\w-]*weight').filter(({ value }) => value.includes('--area-weight-heading'));
  assert.deepEqual([...new Set(heading.map(({ selector }) => selector))].sort(), ['.area-page-header', '.area-page-header--lg', '.area-page-header--md'], 'only page titles take weight-heading');
  // 500: an item's name on a picture or file card (B1.2), a heading over a run of rows (A9.4), labels on fills.
  const strong = selector => rules.filter(rule => rule.selector.split(',').map(s => s.trim()).includes(selector)).map(rule => rule.body).join(';');
  for (const name of ['.area-asset-card__name', '.area-design-card__name', '.area-file-tile__name', '.area-asset-row__name', '.area-select optgroup', '.area-color-picker__heading', '.area-table__group-heading > th']) {
    assert.match(strong(name), /font-weight:\s*var\(--area-weight-strong\)/, `${name} should be 500`);
  }
  // 400: a label beside or over a value (A9.13), and a figure.
  for (const part of ['.area-meter__label', '.area-card__value', '.area-chart__figure', '.area-chart__center']) {
    assert.match(strong(part), /font-weight:\s*var\(--area-weight-regular\)/, `${part} should be 400`);
  }
  assert.doesNotMatch(strong('.area-description-list--justified .area-description-list__term'), /font-weight|color/, 'a justified term keeps the term\'s muted 400');
});

test('numbers that change, count or sit in a column are tabular (plan A9.8)', () => {
  const NUMERIC = [
    '.area-number-field', '.area-timestamp', '.area-nav__trailing', '.area-date-picker__value', '.area-slider__ends',
    '.area-table', '.area-table .area-table__cell--numeric', '.area-field__count', '.area-calendar__day', '.area-chart__plot',
    '.area-chart__center', '.area-chart__figure', '.area-card__value', '.area-meter__value', '.area-count',
    '.area-tree-view__status', '.area-menu__trailing', '.area-reference-list__count', '.area-time-field__segments',
  ];
  for (const part of NUMERIC) {
    const bodies = rules.filter(rule => rule.selector.split(',').map(s => s.trim()).includes(part)).map(rule => rule.body).join(';');
    assert.match(bodies, /font-variant-numeric:\s*tabular-nums/, `${part} shows numbers that change or align: tabular-nums`);
  }
});

test('a joined line is its name\'s size in the muted ink; text-sm is for text set apart (plan A9.3)', () => {
  const body = selector => rules.filter(rule => rule.selector.split(',').map(s => s.trim()).includes(selector)).map(rule => rule.body).join(';');
  for (const [part, size] of [
    ['.area-choice-label__description', 'var\\(--_text\\)'], ['.area-switch__description', 'var\\(--_text\\)'],
    ['.area-checkbox-group__description', 'var\\(--area-control-md-text\\)'], ['.area-custom-select__caption', 'var\\(--area-ui-size\\)'],
    ['.area-file-tile__meta', 'var\\(--area-ui-size\\)'], ['.area-hover-card__meta', 'var\\(--area-ui-size\\)'],
    ['.area-section-heading__lede', 'var\\(--area-ui-size\\)'],
  ]) {
    assert.match(body(part), new RegExp(`font-size:\\s*${size}`), `${part} joins its name at the name's size`);
  }
  // Set apart: help and messages under a control, a caption, Empty state sm, and Menu's dense descriptions (the written
  // exception).
  for (const part of ['.area-field__description', '.area-field__count', '.area-field__validation', '.area-meter__description', '.area-menu__description']) {
    assert.match(body(part), /font-size:\s*var\(--area-text-sm-size\)/, `${part} stands apart at text-sm`);
  }
});

test('every underline sits one offset under its text (plan A9.10)', () => {
  for (const { selector, value } of declarations('text-underline-offset|--_offset')) {
    assert.match(value, /^var\(--(area-underline-offset|_offset)\)$/, `${selector} sets its own underline offset: ${value}`);
  }
});

// Spacing and geometry (plan A1.1–A1.5, A8.2, A11.1, B2.3; docs/research/system-evaluation-2026-11-11). Own helpers, so
// these stand apart from the tests above.
const spacingDeclarations = props => rules.flatMap(({ selector, body }) => {
  if (/^(:root|:where\(:root\)|\[data-area|font-face|from|to|\d)/.test(selector)) return [];
  return [...body.matchAll(new RegExp(`(?:^|[;\\s])(${props})\\s*:\\s*([^;]+)`, 'g'))].map(([, prop, value]) => ({ selector, prop, value: value.trim() }));
});
const tokenValue = name => css.match(new RegExp(`--area-${name}:\\s*([^;]+);`))?.[1] ?? '';

test('a gap reads whole steps; only an inset keeps the half step (plan A1.1)', () => {
  // ui-dense is 0.5 at the default type 13, so N − 4 × ui-dense put gaps on 10, 14 and 18, between the ladder's rungs.
  for (const token of ['gap-row', 'gap-section']) {
    assert.match(tokenValue(token), /ui-gap-step/, `--area-${token} reads ui-gap-step`);
    assert.doesNotMatch(tokenValue(token), /ui-dense/, `--area-${token} reads the half step`);
  }
  const gaps = spacingDeclarations('gap|row-gap|column-gap|--_[\\w-]*gap[\\w-]*|--_card-section|--_rhythm');
  assert.ok(gaps.length > 300, `expected the component gaps, found ${gaps.length}`);
  for (const { selector, prop, value } of gaps) {
    assert.doesNotMatch(value, /--area-ui-dense/, `${selector} ${prop} reads ui-dense; a gap reads ui-gap-step (${value})`);
  }
  // A gap written out that a token holds is read from the token (as "named derivations", above, for the half step).
  for (const { selector, prop, value } of gaps) {
    for (const [a, b, token] of [[12, 4, 'gap-row'], [8, 2, 'ui-cluster'], [6, 2, 'ui-stack'], [24, 8, 'gap-section']]) {
      assert.doesNotMatch(value, new RegExp(`calc\\(var\\(--area-space-${a}\\) - var\\(--area-space-${b}\\) \\* var\\(--area-ui-gap-step\\)\\)`),
        `${selector} ${prop} writes ${a} − ${b} × ui-gap-step; read --area-${token}`);
    }
  }
});

test('a row\'s icon-to-label gap is ui-cluster in every list, and lists share one floor (plan B2.3)', () => {
  const body = selector => rules.filter(rule => rule.selector === selector).map(rule => rule.body).join(';');
  assert.match(body('.area-menu'), /--_menu-gap:\s*var\(--area-ui-cluster\)/, 'Menu');
  assert.match(body('.area-command-palette'), /--_menu-gap:\s*var\(--area-ui-cluster\)/, 'Command palette');
  assert.match(body('.area-nav__item'), /(?:^|[;\s])gap:\s*var\(--area-ui-cluster\)/, 'Nav');
  assert.match(body('.area-tree-view'), /--_tree-gap:\s*var\(--area-ui-cluster\)/, 'Tree view');
  assert.match(body('.area-select option'), /(?:^|[;\s])gap:\s*var\(--area-ui-cluster\)/, 'native Select options');
  assert.match(body('.area-nav__group--nested'), /--_nav-indent:\s*calc\(var\(--area-icon-md\) \+ var\(--area-ui-cluster\)\)/, 'Nav nesting steps one label column');
  // Nothing spaces a row's icon from its label with gap-row any more: gap-row is a group's gap.
  for (const selector of ['.area-menu', '.area-command-palette', '.area-command-palette__search', '.area-queue__item', '.area-plan__item', '.area-edit-summary__file']) {
    assert.doesNotMatch(body(selector), /(?:--_menu-gap|(?:^|[;\s])(?:column-)?gap):\s*var\(--area-gap-row\)/, `${selector} spaces its row with gap-row`);
  }
  // One floor, 160, wherever a list restates it (Menu, Select's picker, Custom select, Combobox, Tag picker). Custom
  // select's picture grid reads the hook for its own width, not as a list floor.
  const floors = spacingDeclarations('min-inline-size').filter(({ value }) => /--area-menu-min-inline-size/.test(value));
  assert.ok(floors.length >= 6, `expected the list floors, found ${floors.length}`);
  for (const { selector, value } of floors) {
    assert.match(value, /var\(--area-menu-min-inline-size, calc\(var\(--area-space-96\) \+ var\(--area-space-64\)\)\)/, `${selector} floors its list at another width: ${value}`);
  }
  assert.match(body('.area-menu'), /min-inline-size:\s*var\(--area-menu-min-inline-size, calc\(var\(--area-space-96\) \+ var\(--area-space-64\)\)\)/, 'Menu floor 160');
});

test('a padding or inline inset that reads 1cap rounds to a whole pixel (plan A11.1)', () => {
  // A vertical cap placement (Badge's, Tag's and Count's padding-block on a whole-pixel baseline) is exempt: the cap
  // centres on its row there, within the 0.1 px rendered rule.
  const strip = value => {
    let out = value;
    for (let i = 0; i < 6; i++) out = out.replace(/round\((?:nearest|up|down),(?:[^()]|\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\))*\)/g, 'ROUNDED');
    return out;
  };
  const insets = spacingDeclarations('padding|padding-inline|padding-inline-start|padding-inline-end|padding-left|padding-right|inset|inset-inline|inset-inline-start|inset-inline-end|--_[\\w-]*(?:inset|pad)[\\w-]*');
  assert.ok(insets.length > 300, `expected the component insets, found ${insets.length}`);
  for (const { selector, prop, value } of insets) {
    if (!/1cap/.test(value)) continue;
    assert.doesNotMatch(strip(value), /1cap/, `${selector} ${prop} reads 1cap outside round(): ${value}`);
  }
});

test('children are spaced by their container\'s gap, never by a margin that undoes it (plan A1.3)', () => {
  // A margin of `calc(x − the parent's gap)` changes silently when the gap does. The two left need a group in React (a
  // text group for Card's title and copy; the header and its carousel; Button's label and its trailing keycap; a media
  // row choice's picture and its text), named here so the list only shrinks.
  const waiting = new Set([
    '.area-button > .area-kbd',
    ':is(.area-checkbox--media-row > .area-checkbox__visual, .area-radio--media-row > .area-radio__visual)',
    ':is(.area-card, .area-card__content) > :is(.area-card__title, .area-card__description, .area-card__value) + :is(.area-card__title, .area-card__description, .area-card__value)',
    ':is(.area-card, .area-card__content) > .area-card__header + .area-card__carousel',
  ]);
  const found = new Set();
  for (const { selector, prop, value } of spacingDeclarations('margin|margin-block|margin-block-start|margin-block-end|margin-inline|margin-inline-start|margin-inline-end|margin-top|margin-bottom')) {
    // A gap read with a fallback (`var(--_card-gap, var(--_fr-gap))`) is still the gap.
    if (!/-\s*var\(--(?:_[\w-]*gap|area-(?:gap-row|ui-cluster|ui-stack|gap-section))(?:, var\(--[\w-]+\))?\)/.test(value)) continue;
    found.add(selector);
    assert.ok(waiting.has(selector), `${selector} ${prop} undoes its container's gap: ${value}`);
  }
  for (const selector of waiting) assert.ok(found.has(selector), `${selector} no longer compensates: remove it from the list`);
});

test('rows and composites read the height ladder (plan A8.2)', () => {
  const body = selector => rules.filter(rule => rule.selector === selector).map(rule => rule.body).join(';');
  assert.match(body('.area-calendar'), /--_day:\s*var\(--area-control-md\)/, 'Calendar day is a medium control');
  assert.match(body('.area-calendar'), /--_cell:\s*calc\(var\(--area-control-md\) \+ var\(--area-space-4\)\)/, 'Calendar cell is the day + 4');
  assert.match(body('.area-description-list'), /--_row:\s*var\(--area-ui-row\)/, 'Description list rows are the UI row');
  assert.match(body('.area-shortcut-list'), /--_row:\s*calc\(var\(--area-ui-row\) \+ var\(--area-ui-stack\)\)/, 'Shortcut list rows are the row + one room step');
  assert.match(body('.area-board-column__add'), /min-block-size:\s*var\(--area-ui-row\)/, 'Board add row is a row');
  assert.match(body('.area-token-row.area-code'), /--_token-height:\s*var\(--area-control-xs\)/, 'Token row is the xs control');
  // No row height adds a pixel literal to a ladder token.
  for (const { selector, prop, value } of spacingDeclarations('block-size|min-block-size|--_row|--_day|--_cell')) {
    assert.doesNotMatch(value, /var\(--area-(?:ui-row|control-(?:xs|sm|md|lg|xl))\) \+ (?:2|4|6|8)px/, `${selector} ${prop} adds a literal to the ladder: ${value}`);
  }
});

test('page and section spaces are named roles (plan A1.4)', () => {
  assert.match(tokenValue('gap-section'), /24px/, 'gap-section is two groups');
  assert.match(tokenValue('inset-page'), /32px/, 'inset-page is the feed margin');
  assert.match(rules.filter(rule => rule.selector === '.area-stack--section').map(rule => rule.body).join(';'), /--_stack-gap:\s*var\(--area-gap-section\)/, 'Stack section reads gap-section');
});

// Rules with their @media context, for the focus, forced-colours and hit-target tests (plan A6.2, A6.4, A11.2).
const mediaRules = (() => {
  const out = []; const stack = []; let buf = '';
  for (const ch of css) {
    if (ch === '{') { stack.push(buf.trim()); buf = ''; }
    else if (ch === '}') { const head = stack.pop(); if (head && !head.startsWith('@')) out.push({ selector: head.replace(/\s+/g, ' '), body: buf, media: stack.filter(h => h.startsWith('@media')).join(' ') }); buf = ''; }
    else buf += ch;
  }
  return out;
})();
const splitSelectors = selector => { const parts = []; let depth = 0, cur = ''; for (const c of selector) { if (c === '(') depth++; if (c === ')') depth--; if (c === ',' && !depth) { parts.push(cur.trim()); cur = ''; } else cur += c; } parts.push(cur.trim()); return parts; };
const withoutNot = s => { let r = s, prev; do { prev = r; r = r.replace(/:not\((?:[^()]|\([^()]*(?:\([^()]*\))*[^()]*\))*\)/g, ''); } while (r !== prev); return r; };

test('every focus ring sits where the focus table puts it: controls at the offset, containers and text at the gap, rows, tabs and cells inside (plan A6.2)', () => {
  // DESIGN_SYSTEM.md, "The focus ring". A new ring joins one of these rows; a ring that matches none fails.
  const TABLE = [
    ['inside', /tree-view \[role="treeitem"\]|accordion-item__trigger|step__row|edit-summary__(file|code-toggle)|diff__comment|approval__(option|tile)|plan__head|queue__head|command-palette__back|prompt-suggestions__item|\.area-table tbody tr|table__group-toggle|nav__toggle|nav__item|scroll-area__viewport|editable-text__input|token-row|list-box--grid|time-field__segment|code-block__toggle|color-picker__preview-original|board-column__add/],
    ['part', /tabs__(tab|panel):focus-visible::before/],
    ['gap', /\.area-toolbar|\.area-diff:|(checkbox|radio)--(card|soft|thumbnail)|card:has\(\.area-card__link|card__carousel|alert__link|toaster|table-wrapper|\.area-link|description-list__more|citation|board-card|editable-text__preview|asset-card|asset-grid__item|design-card|mention|code-block__linenumber|code-block:has|reference-list__backlink|abbr|video-player:focus/],
    ['offset', /./],
  ];
  const RING = /(?:^|;)\s*(outline|border):\s*([^;]*?)\s+solid\s+var\(--(?:area-(?:field-|composer-)?focus-color|_focus-outline)/;
  const placement = body => {
    const [, prop, width] = body.match(RING);
    if (prop === 'border') return 'part';
    const offset = body.match(/outline-offset:\s*([^;]+)/)?.[1].trim();
    if (offset === undefined) return 'none';
    if (/^var\(--area-focus-offset\)$/.test(offset)) return 'offset';
    if (/^var\(--area-focus-gap\)$/.test(offset)) return 'gap';
    const flat = offset.replace(/\s+/g, ''), w = width.replace(/\s+/g, '');
    return flat === `calc(-1*${w})` || flat === `calc(${w}*-1)` ? 'inside' : `off by ${offset}`;
  };
  let seen = 0;
  for (const { selector, body, media } of mediaRules) {
    if (/forced-colors/.test(media) || !RING.test(body)) continue;
    seen++;
    const want = TABLE.find(([, pattern]) => pattern.test(selector))[0];
    assert.equal(placement(body), want, `${selector} draws its ring ${placement(body)}; the focus table puts it ${want}`);
  }
  assert.ok(seen > 80, `only ${seen} focus rings found`);
  // A solid fill's ring takes the solid placement, and only a solid fill does (plan A6.1).
  const solid = mediaRules.filter(({ body, media }) => !/forced-colors/.test(media) && /outline-offset:\s*var\(--area-focus-solid-offset\)/.test(body));
  for (const { selector } of solid) assert.match(selector, /--solid/, `${selector} takes the solid fill's ring placement`);
  for (const fill of ['.area-button--solid:focus-visible', ':is(a, button).area-badge--solid:focus-visible'])
    assert.ok(solid.some(({ selector }) => selector === fill), `${fill} has no solid placement: its ring would sit flush on a fill of its own colour`);
  for (const mark of [/area-checkbox__control:is\(:checked/, /area-radio__control:checked:focus-visible/, /switch__control:checked:focus-visible ~ \.area-switch__track/])
    assert.ok(mediaRules.some(({ selector, body }) => mark.test(selector) && /outline-offset:\s*var\(--area-focus-gap\)/.test(body)), `${mark} keeps its ring flush on its filled mark`);
});

test('a row shows keyboard focus by one indicator, a ring or a plate, never both (plan A6.2)', () => {
  const RING = /outline:[^;]*var\(--area-focus-color\)/;
  const key = s => s.replace(/:focus-visible/g, '').replace(/\s+/g, ' ').trim();
  const ringed = new Set(), plated = new Set();
  for (const { selector, body, media } of mediaRules) {
    if (/forced-colors/.test(media) || !/:focus-visible/.test(selector)) continue;
    for (const s of splitSelectors(selector)) {
      if (!/:focus-visible/.test(s) || /:has\(/.test(s)) continue;
      if (RING.test(body)) ringed.add(key(s));
      if (/(?:^|;)\s*background(-color)?:\s*(?!transparent|none)[^;]+/.test(body)) plated.add(key(s));
    }
  }
  for (const s of ringed) assert.ok(!plated.has(s), `${s} draws a ring and a plate on focus`);
});

test('every selected, current, checked or pressed state shown only by a fill or a shadow has a forced-colours rule (plan A6.4)', () => {
  const STATES = ['[data-selected]', '[aria-selected="true"]', '[aria-current', ':checked', '[aria-pressed="true"]'];
  const block = s => s.match(/\.area-([a-z0-9]+(?:-[a-z0-9]+)*)/)?.[1];
  const forced = mediaRules.filter(({ media }) => /forced-colors/.test(media)).flatMap(({ selector }) => splitSelectors(selector).map(withoutNot));
  let checked = 0;
  for (const { selector, body, media } of mediaRules) {
    if (/forced-colors/.test(media)) continue;
    if (!/(^|;)\s*(background(-color|-image)?|box-shadow)\s*:/.test(body)) continue;
    if (/(^|;)\s*(border(-[a-z-]+)?|outline(-[a-z]+)?|color|text-decoration[a-z-]*|font-weight|opacity)\s*:/.test(body)) continue;
    if (/(^|;)\s*background(-color)?\s*:\s*(transparent|none)\s*(;|$)/.test(body)) continue;
    for (const s of splitSelectors(selector)) {
      const positive = withoutNot(s);
      const state = STATES.find(t => positive.includes(t));
      if (!state || /:(hover|active)/.test(positive)) continue;
      checked++;
      assert.ok(forced.some(f => block(f) === block(positive) && f.includes(state)), `${s} shows ${state} by fill alone and has no forced-colours rule`);
    }
  }
  assert.ok(checked > 10, `only ${checked} fill-only states found`);
  // Every field trigger restores the system focus colour (S18).
  for (const trigger of ['.area-custom-select__trigger:focus-visible', '.area-date-picker__trigger:focus-visible', '.area-tag-picker__field:focus-within'])
    assert.ok(mediaRules.some(({ selector, body, media }) => /forced-colors/.test(media) && splitSelectors(selector).includes(trigger) && /Highlight/.test(body)), `${trigger} has no Highlight focus in forced colours`);
});

test('every interactive part under 24 carries the shared hit target, 44 under a coarse pointer (plan A11.2)', () => {
  // The parts whose box falls under 24 at Compact (geometry.md G3, interaction.md I22, the behaviour hit suite).
  const SMALL = ['.area-input__action-button', '.area-number-field__step', '.area-chip__action', '.area-chip__dismiss', '.area-nav__actions > .area-button',
    '.area-split-button > .area-split-button__trigger', '.area-segmented__item', '.area-toggle-group--soft > .area-button', '.area-breadcrumb__link',
    'button.area-breadcrumb__ellipsis', '.area-color-swatch-picker__cell', '.area-step__row', '.area-checkbox__control', '.area-radio__control'];
  // Parts that keep their own target, the recipe the shared one generalises.
  const OWN = [':is(a, button).area-badge::after', '.area-badge__dismiss::after', '.area-tag__dismiss::after', '.area-toggletip::after'];
  const shared = mediaRules.find(({ selector, body, media }) => !media && /--_hit:\s*var\(--area-space-24\)/.test(body));
  assert.ok(shared, 'no shared hit target rule');
  const parts = splitSelectors(shared.selector);
  for (const part of SMALL) assert.ok(parts.includes(part), `${part} is under 24 and has no hit target`);
  assert.match(shared.body, /position:\s*relative/);
  const coarse = mediaRules.find(({ body, media }) => /pointer:\s*coarse/.test(media) && /--_hit:\s*var\(--_hit-coarse\)/.test(body));
  assert.ok(coarse, 'no coarse hit size');
  assert.match(shared.body, /--_hit-coarse:\s*calc\(var\(--area-space-40\) \+ var\(--area-space-4\)\)/, 'the coarse target is 44');
  const box = mediaRules.find(({ selector, body }) => /::after/.test(selector) && /max\(100%, var\(--_hit-inline, var\(--_hit\)\)\)/.test(body));
  assert.ok(box, 'no hit box');
  assert.match(box.body, /position:\s*absolute/); assert.match(box.body, /translate:\s*-50% -50%/);
  assert.match(box.body, /block-size:\s*max\(100%, var\(--_hit-block, var\(--_hit\)\)\)/);
  const boxed = splitSelectors(box.selector).join(' ');
  for (const part of SMALL) assert.ok(boxed.includes(part), `${part} has no hit box`);
  for (const own of OWN) assert.ok(mediaRules.some(({ selector, body }) => splitSelectors(selector).includes(own) && /--area-space-24/.test(body)), `${own} lost its own target`);
});

// Ink, dark and colour (plan A3, A7.1, A7.2, A10, 2026-11-11). Each rule with the test that keeps it true.
// Every rule with this exact selector, joined: a component may state one selector in several rules.
const bodiesFor = selector => rules.filter(rule => rule.selector === selector).map(rule => rule.body).join(';');

test('a floating surface draws one edge in dark: its rim only where no frame is (A7.1)', () => {
  // The floating and modal roles draw their rim at 1px less the frame, so a framed menu draws its frame alone; the frame
  // (edge-floating) takes the rim's strength in dark; Tooltip's role draws none, its inset edge takes the strength.
  for (const role of ['float', 'modal']) assert.match(tokenValue(`shadow-${role}`), /0 0 0 max\(0px, calc\(1px - var\(--area-border-width\)\)\)/, `shadow-${role} draws its rim outside a frame`);
  assert.match(tokenValue('shadow-tooltip'), /0 0 0 0px light-dark\(transparent/, 'shadow-tooltip still draws a rim outside Tooltip\'s inset edge');
  assert.match(tokenValue('edge-floating'), /max\(.*min\(0\.16/, 'the floating frame does not take the rim\'s strength in dark');
  assert.match(bodiesFor('.area-tooltip'), /var\(--area-shadow-tooltip-rim\)/, 'Tooltip\'s inset edge does not take the rim\'s strength');
});

test('floating and modal surfaces paint the floating ground (A7.2)', () => {
  // In dark the floating ground sits a step above the layers under it; every floating surface paints it and declares it.
  // One rule paints it on every surface (popup.css, plan B6.1).
  assert.match(FLOATING_FRAME?.body ?? '', /background-color:\s*var\(--area-bg-float\)/, 'the one floating frame does not paint bg-float');
  const floating = ['.area-popover', '.area-menu', '.area-dialog', '.area-toast', '.area-command-palette', '.area-drawer', '.area-calendar:not(.area-calendar--plain)', '.area-color-picker:not(.area-color-picker--plain)'];
  for (const selector of floating) assert.ok(selectorList(FLOATING_FRAME?.selector ?? '').includes(selector), `${selector} does not paint bg-float`);
  assert.doesNotMatch(css, /\.area-menu[^{]*\{[^}]*background-color:\s*var\(--area-bg-surface\)[^}]*--_elevation/, 'a menu paints the raised layer');
});

test('placeholders read the placeholder role, meta the subtle ink (A3.2, A3.3)', () => {
  assert.match(bodiesFor('.area-approval__field::placeholder'), /color:\s*var\(--area-input-placeholder\)/);
  assert.match(bodiesFor('.area-editable-text__preview[data-placeholder]'), /color:\s*var\(--area-input-placeholder\)/);
  // Every ::placeholder reads a placeholder role, never the muted ink.
  for (const { selector, body } of rules.filter(rule => /::placeholder/.test(rule.selector) && /(^|[;\s])color\s*:/.test(rule.body)))
    assert.doesNotMatch(body, /color:\s*var\(--area-fg-muted\)/, `${selector} paints its placeholder muted`);
  for (const selector of ['.area-menu__shortcut', '.area-timestamp']) assert.match(bodiesFor(selector), /color:\s*var\(--area-fg-subtle\)/, `${selector} is not the subtle ink`);
});

test('an unselected option reads the muted ink in every selection control (A3.3)', () => {
  assert.match(bodiesFor('.area-toggle-group:is(.area-toggle-group--outline, .area-toggle-group--ghost) > .area-button:not([data-selected], [aria-pressed="true"])'), /--_fg:\s*var\(--area-fg-muted\)/);
  assert.match(bodiesFor('.area-pagination .area-pagination__step.area-button'), /--_fg:\s*var\(--area-fg-muted\)/);
});

test('tone colours the mark, never the words (A3.4)', () => {
  // Alert's words keep the default ink; status glyphs read the tone's mark ink.
  assert.match(bodiesFor('.area-alert'), /(^|[;\s])color:\s*var\(--area-fg-default\)/, 'Alert\'s words take the tone ink');
  assert.match(bodiesFor('.area-alert__link a'), /color:\s*var\(--area-fg-default\)/, 'Alert\'s link takes the tone ink');
  for (const [selector, tone] of [['.area-attachment__mark', 'danger'], ['.area-turn-notice--error', 'danger'], ['.area-message__status > svg', 'danger'], ['.area-file-upload-item--error .area-file-upload-item__status > svg', 'danger'], ['.area-file-upload-item--complete .area-file-upload-item__status > svg', 'success']])
    assert.match(bodiesFor(selector), new RegExp(`var\\(--area-fg-${tone}-mark\\)`), `${selector} paints its glyph in the words' ink`);
});

test('a heading over a run of rows is muted (A9.4)', () => {
  for (const selector of ['.area-panel__heading', '.area-table__group-heading > th', '.area-link-groups__label', '.area-reference-list__title', '.area-toc__title'])
    assert.match(bodiesFor(selector), /(^|[;\s])color:\s*var\(--area-fg-muted\)/, `${selector} is not muted`);
});

test('empty boxes and progress lines keep their edge (A10.3)', () => {
  assert.match(bodiesFor('.area-otp-field'), /--_border:\s*var\(--area-edge-control-hover\)/, 'an empty OTP slot is not on the strong control edge');
  assert.match(bodiesFor('.area-alignment-picker'), /--_alignment-edge:\s*var\(--area-edge-control-hover\)/, 'the Alignment picker has no edge');
  assert.match(bodiesFor('.area-stepper-step'), /--_connector:\s*var\(--area-stroke-control\)/, 'a Stepper connector is a faint rule');
  // A Card's media placeholder sits a step off the card in both themes (A10.1).
  assert.match(css, /--_card-media-fill:\s*var\(--area-bg-plate\)/);
});

test('Layer contrast 0 keeps a soft Surface flat (owner, 2026-10-29)', () => {
  // It paints the recessed tone, the page at Layer contrast 0 (layers.test.ts holds the tone), and is a recessed ground,
  // never the well, which shows at 0.
  assert.match(bodiesFor('.area-surface--soft'), /--_sf-fill:\s*var\(--area-bg-subtle\)/, 'a soft Surface paints a tone that shows at Layer contrast 0');
  const layers = readFileSync(new URL('../../styles/src/layers.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const listBefore = ground => { const at = layers.indexOf(`[data-area-ground="${ground}"] {`); return layers.slice(layers.lastIndexOf(':where(', at), at); };
  assert.match(listBefore('recessed'), /\.area-surface--soft/, 'a soft Surface is not a recessed ground');
  assert.doesNotMatch(listBefore('well'), /\.area-surface--soft/, 'a soft Surface is a well ground, which paints at Layer contrast 0');
});

// surface.css, "The frame recipe" (plan B1.1–B1.4, 2026-11-13; DESIGN_SYSTEM.md, "Frames"): every card-like frame reads
// one recipe, so a frame added later cannot drift from it. Each role is pinned once here, term for term; each frame
// draws its corner from a role and never restates the container corner or a concentric sum of its own.
test('every card-like frame reads the one frame recipe: corner roles, the inset ladder, nested floors (plan B1.1)', () => {
  const recipe = rules.find(rule => rule.selector.startsWith(':where(.area-card, .area-surface,') && /--_fr-card\s*:/.test(rule.body));
  assert.ok(recipe, 'the frame recipe is missing');
  const roots = recipe.selector.slice(':where('.length, -1).split(', ');
  const FRAMES = ['.area-card', '.area-surface', '.area-panel', '.area-asset-card', '.area-design-card', '.area-figure', '.area-video-player',
    '.area-table-wrapper', '.area-description-list--surface', '.area-board-column', '.area-calendar', '.area-color-picker',
    '.area-plan', '.area-queue', '.area-edit-summary', '.area-approval', '.area-composer', '.area-code-block', '.area-message__bubble'];
  for (const frame of FRAMES) assert.ok(roots.includes(frame), `${frame} is a frame outside the recipe`);
  const term = prop => recipe.body.match(new RegExp(`(?:^|[;\\s])${prop}\\s*:\\s*([^;]+)`))?.[1].trim().replace(/\s+/g, ' ');
  assert.equal(term('--_fr-block'), 'var(--area-radius-container)');
  assert.equal(term('--_fr-card'), 'min(var(--area-radius-container), max(var(--area-radius-min), round(down, calc(var(--_fr-inset) * 0.6 * var(--area-radius-factor) / 0.3125), 2px)))');
  assert.equal(term('--_fr-around'), 'min(var(--area-radius-container), calc(var(--_fr-held) + var(--_fr-mat) * var(--area-radius-concentric)))');
  assert.equal(term('--_fr-nested'), 'max(min(var(--area-radius-row), var(--_fr-corner)), round(down, calc(var(--_fr-corner) - var(--_fr-mat) * var(--area-radius-concentric)), 2px))', 'a nested frame stops at a row\'s corner, never the floor\'s 4');
  assert.equal(term('--_fr-picture'), 'max(var(--area-radius-floor), round(down, calc(var(--_fr-corner) - var(--_fr-mat) * var(--area-radius-concentric)), 2px))');
  assert.equal(term('--_fr-pad'), 'calc(var(--_fr-inset) - var(--_fr-border))', 'the border is counted once');
  for (const size of ['sm', 'md', 'lg']) for (const part of ['inset', 'mat', 'gap']) assert.ok(term(`--_fr-${part}-${size}`), `the ladder has no ${part} at ${size}`);
  // Each frame's corner reads a role (or a public hook wrapping one).
  const radiusOf = selector => rules.find(rule => rule.selector.split(', ').includes(selector) && /(^|[;\s])border-radius\s*:/.test(rule.body))?.body.match(/(?:^|[;\s])border-radius\s*:\s*([^;]+)/)?.[1].trim().replace(/\s+/g, ' ');
  const prop = (selector, name) => rules.filter(rule => rule.selector.split(', ').includes(selector)).map(rule => rule.body.match(new RegExp(`(?:^|[;\\s])${name}\\s*:\\s*([^;]+)`))?.[1].trim().replace(/\s+/g, ' ')).filter(Boolean)[0];
  assert.match(bodiesFor('.area-figure__media > :is(img, video, svg, picture, canvas)'), /border-radius:\s*var\(--_fr-block\)/, 'Figure\'s picture does not draw the block corner');
  const reads = {
    '.area-video-player': [radiusOf, 'var(--_fr-block)'],
    '.area-board-column': [radiusOf, 'var(--_fr-around)'],
    '.area-calendar--surface': [radiusOf, 'var(--_fr-block)'],
    '.area-plan': [radiusOf, 'var(--_fr-corner)'],
    '.area-queue': [radiusOf, 'var(--_fr-corner)'],
    '.area-edit-summary': [radiusOf, 'var(--_fr-corner)'],
  };
  for (const [selector, [read, want]] of Object.entries(reads)) assert.equal(read(selector), want, `${selector} does not draw its frame recipe corner`);
  assert.equal(prop('.area-panel', '--_panel-corner'), 'var(--_fr-block)');
  assert.equal(prop('.area-color-picker', 'border-radius'), 'var(--_fr-block)');
  assert.equal(prop('.area-surface', '--_sf-corner'), 'var(--_fr-card)');
  assert.equal(prop('.area-card', '--_card-media-radius'), 'var(--_fr-picture)', 'Card\'s picture keeps the recipe\'s picture corner (4 at the default)');
  assert.equal(prop('.area-code-block', '--_code-radius'), 'var(--area-code-block-corner, var(--_fr-corner))');
  assert.equal(prop('.area-message__bubble', '--_bubble-radius'), 'var(--_fr-corner)');
  assert.equal(prop('.area-approval', '--_approval-radius'), 'var(--area-approval-corner, min(calc(var(--_approval-height) / 2), var(--_fr-corner)))');
  // Card and Surface share the ladder: Surface takes Card's inset, gap and corner (decided once, plan B1.1).
  for (const size of ['sm', 'md', 'lg']) {
    assert.equal(prop(`.area-card--${size}`, '--_card-space'), `var(--area-card-inset, var(--_fr-inset-${size}))`);
    assert.equal(prop(`.area-card--${size}`, '--_card-inset'), `var(--_fr-mat-${size})`);
    assert.match(prop(`.area-surface--${size}`, '--_sf-text') ?? '', new RegExp(`^var\\(--_fr-inset-${size}\\)$`), `Surface ${size} is not on Card's inset`);
  }
  // Nested frames publish the recipe's nested corner (VC19: a Surface in a Card or a Panel landed at the floor's 4).
  assert.equal(prop('.area-card', '--_sf-a'), 'var(--_fr-nested)');
  assert.equal(prop('.area-panel', '--_sf-a'), 'var(--_fr-nested)');
  // No frame root restates the container corner or its own concentric sum in border-radius.
  for (const frame of FRAMES) {
    const own = radiusOf(frame);
    if (own) assert.doesNotMatch(own, /--area-radius-container|--area-radius-row\) \+/, `${frame} draws a corner of its own: ${own}`);
  }
});

test('one chat card: the around corner over the medium control, rows 4 from the outer edge, words 12 in, a one-row head (plan B1.3)', () => {
  const chat = rules.find(rule => rule.selector.startsWith(':where(.area-plan, .area-queue, .area-edit-summary, .area-approval, .area-composer, .area-code-block, .area-message__bubble)'));
  assert.ok(chat, 'the chat card recipe is missing');
  const term = prop => chat.body.match(new RegExp(`(?:^|[;\\s])${prop}\\s*:\\s*([^;]+)`))?.[1].trim().replace(/\s+/g, ' ');
  assert.equal(term('--_fr-held'), 'var(--area-radius-control-md)');
  assert.equal(term('--_fr-mat'), 'var(--area-ui-cluster)');
  assert.equal(term('--_fr-corner'), 'var(--_fr-around)');
  assert.equal(term('--_chat-list'), 'max(0px, calc(var(--area-space-4) - var(--_chat-edge)))', 'rows sit 4 from the outer edge, the edge counted once');
  assert.equal(term('--_chat-text'), 'calc(var(--area-space-4) + var(--area-ui-row-inset))');
  assert.equal(term('--_chat-column'), 'calc(var(--_chat-text) - var(--_chat-edge))');
  assert.equal(term('--_chat-head'), 'var(--area-ui-row)');
  // A part is its own rule or one of the shared collapsible head's (inset.css, plan B4.4): `:is(.area-plan__head, …)`.
  const body = selector => rules.filter(rule => rule.selector.split(', ').includes(selector) || new RegExp(`^:is\\([^)]*${selector.replace(/[.]/g, '\\.')}(?![\\w-])[^)]*\\)$`).test(rule.selector)).map(rule => rule.body).join(';');
  for (const card of ['.area-plan', '.area-queue', '.area-edit-summary']) {
    assert.match(body(card), /--_card-list:\s*var\(--_chat-list\)/, `${card} holds its rows off the chat card's list`);
    assert.match(body(card), /--_card-column:\s*var\(--_chat-column\)/, `${card} sets its words off the chat card's column`);
    assert.match(body(`${card}__head`), /min-block-size:\s*var\(--_chat-head\)/, `${card}'s head is not one row tall`);
    assert.match(body(`${card}__title`), /font-weight:\s*var\(--area-weight-strong\)/, `${card}'s title is not strong`);
    assert.doesNotMatch(body(`${card}__title`), /color:\s*var\(--area-fg-muted\)/, `${card}'s title is muted`);
  }
});

test('one item name for picture cards: strong in the default ink, 8 under a picture and on its edge (plan B1.2)', () => {
  const NAMES = ['.area-card__title', '.area-asset-card__name', '.area-design-card__name', '.area-file-tile__name', '.area-board-card__title'];
  const part = rules.find(rule => rule.selector.startsWith(':where(.area-card__title,') && /font-weight/.test(rule.body));
  assert.ok(part, 'the item name part is missing');
  for (const name of NAMES) assert.ok(part.selector.includes(name), `${name} is outside the item name part`);
  assert.match(part.body, /font-weight:\s*var\(--area-weight-strong\)/);
  assert.match(part.body, /color:\s*var\(--area-fg-default\)/);
  for (const name of NAMES) for (const rule of rules.filter(rule => rule.selector === name)) assert.doesNotMatch(rule.body, /font-weight/, `${name} sets its own weight`);
  const gap = rules.find(rule => rule.selector.startsWith(':where(.area-asset-card, .area-design-card, .area-file-tile, .area-figure)'));
  // 8 at the default, a density role (ui-cluster: 6 / 8 / 10 at type 13), as every space between two pieces (plan B8.2).
  assert.match(gap?.body ?? '', /--_fr-name-gap:\s*var\(--area-ui-cluster\)/);
  assert.match(bodiesFor('.area-file-tile'), /gap:\s*var\(--_fr-name-gap\)/, 'File tile\'s name is not the frame recipe\'s name gap under its frame');
  const under = 'max(0px, calc(var(--_fr-name-gap) - (var(--area-control-sm) - var(--area-ui-leading)) / 2))';
  assert.ok(rules.some(rule => rule.selector === '.area-design-card' && rule.body.replace(/\s+/g, ' ').includes(`gap: ${under}`)), 'Design card\'s name is not 8 under its picture');
  assert.ok(rules.some(rule => rule.selector === '.area-asset-card.area-asset-card--outside' && rule.body.replace(/\s+/g, ' ').includes(`gap: ${under}`)), 'an outside Asset card\'s name is not 8 under its picture');
  assert.match(bodiesFor('.area-design-card__caption'), /padding-inline-start:\s*0/, 'Design card\'s name is indented');
  assert.match(bodiesFor('.area-figure__caption'), /padding-block-start:\s*var\(--_fr-name-gap\)/);
});

test('a Table caption starts on the first column\'s text (the frame recipe\'s inset), a row\'s gap above the grid', () => {
  assert.match(bodiesFor('.area-table caption'), /padding:\s*var\(--area-gap-row\) var\(--_cell-edge\)/);
  assert.match(bodiesFor('.area-table--flush caption'), /padding-inline:\s*0/);
  assert.match(bodiesFor('.area-table :is(th, td):first-child'), /padding-inline-start:\s*var\(--_cell-edge\)/);
});

test('a text-only Card ends on its baseline less a fixed descender allowance (plan B1.4)', () => {
  assert.ok(rules.some(rule => rule.selector === '.area-card' && /--_card-descender-allowance:\s*var\(--area-space-2\)/.test(rule.body)), 'the allowance is missing');
  const end = rules.find(rule => rule.selector.startsWith(':is(.area-card > :last-child,') && /text-box-edge:\s*cap alphabetic/.test(rule.body));
  assert.ok(end, 'text ending the card does not end on its baseline');
  assert.match(end.body, /margin-block-end:\s*calc\(-1 \* var\(--_card-descender-allowance\)\)/);
});

// --- State paint: open, press and reveal (plan B7.1, B7.2, B7.3, B7.11, 2026-11-14; DESIGN_SYSTEM.md, "Shared state
// paint"). A rule's selector list (its parts read through withoutNot, above, so a state named only inside :not() is not
// read as the state); and the stylesheet's rules with the at-rules they sit in, for the reveal's media.
const splitList = list => { const out = []; let depth = 0, start = 0;
  for (let i = 0; i < list.length; i++) { const c = list[i]; if (c === '(') depth++; else if (c === ')') depth--; else if (c === ',' && depth === 0) { out.push(list.slice(start, i)); start = i + 1; } }
  return [...out, list.slice(start)].map(part => part.trim()).filter(Boolean); };
const inMedia = (() => {
  const out = [], stack = []; let start = 0;
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (ch === '{') {
      const prelude = css.slice(start, i).trim();
      if (prelude.startsWith('@')) { stack.push(prelude); start = i + 1; continue; }
      const end = css.indexOf('}', i);
      out.push({ selector: prelude.replace(/\s+/g, ' '), body: css.slice(i + 1, end), at: [...stack] });
      i = end; start = i + 1;
    } else if (ch === '}') { stack.pop(); start = i + 1; }
    else if (ch === ';') start = i + 1;
  }
  return out;
})();
const PRESSED = /var\(--(area-bg-component-pressed|area-bg-pressed|_bg-pressed|_bg-active|_wash-active)\)/;
const statePaints = body => [...body.matchAll(/(?:^|[;\s])(background(?:-color|-image)?)\s*:\s*([^;]+)/g)].map(([, prop, value]) => ({ prop, value: value.trim() }));

test('an open trigger holds its pressed paint, never the focus edge (plan B7.1)', () => {
  // Written once for every Button, whatever its popup (a menu, a popover, a dialog, a list), and once in the field shell.
  const button = rules.find(rule => rule.selector === '.area-button[aria-expanded="true"]:is([aria-haspopup]:not([aria-haspopup="false"])):not(:disabled, [data-disabled], [data-loading], [data-inactive])');
  assert.ok(button, 'Button has no open rule for every popup kind');
  assert.match(button.body, /background-color:\s*var\(--_bg-active\)/);
  assert.match(button.body, /background-image:\s*var\(--_wash-active\)/);
  const shell = rules.find(rule => splitList(rule.selector).includes(':is(.area-custom-select, .area-date-picker)[data-open] > :is(.area-custom-select__trigger, .area-date-picker__trigger)'));
  assert.match(shell?.body ?? '', /background-color:\s*var\(--_bg-pressed\)/, 'the field shell has no open fill');
  for (const family of ['custom-select', 'date-picker']) {
    assert.match(bodiesFor(`.area-${family}`), /--_bg-pressed:\s*var\(--_bg\)/, `${family}: a field-shaped trigger does not keep its fill`);
    assert.match(bodiesFor(`.area-${family}--ghost`), /--_bg-pressed:\s*var\(--area-bg-component-pressed\)/, `${family}: a ghost trigger does not take the pressed plate`);
  }
  // A submenu's row is a list's highlight, not a trigger's press (DESIGN_SYSTEM.md, "Open").
  const HIGHLIGHT = /^\.area-menu__item--sub\[aria-expanded="true"\]/;
  let open = 0;
  for (const { selector, body } of rules) for (const part of splitList(selector)) {
    const state = withoutNot(part);
    if (!/\[aria-expanded="true"\]|\[data-open\]/.test(state) || HIGHLIGHT.test(part)) continue;
    assert.doesNotMatch(state, /\[aria-haspopup="menu"\]\[aria-expanded="true"\]/, `${part}: open paint for menus alone`);
    for (const { prop, value } of statePaints(body)) {
      open++;
      assert.match(value, PRESSED, `${part} paints ${prop}: ${value} while open; an open trigger holds its pressed paint`);
    }
    // Tag picker's field keeps its caret, and so its focus, while its list shows: its edge there is focus's.
    if (/\.area-tag-picker\[data-open\]/.test(part)) continue;
    assert.doesNotMatch(body, /--_field-edge:\s*var\(--_border-focus\)/, `${part} shows the focus edge while open`);
  }
  assert.ok(open >= 6, `only ${open} open paints checked`);
});

test('press shows on a selected or current item (plan B7.2)', () => {
  // A rule whose press leaves out the selected item must have a sibling that presses it: the selected plate to the
  // pressed plate, a chosen solid past its hover. Two indicators are not plates: underline Tabs (the selected bar is the
  // strongest mark already). Segmented's press is a literal until plan B7.4 gives it the pressed role; it joins then.
  const EXEMPT = /^\.area-tabs(--vertical)? \.area-tabs__tab:active.*::after$|^\.area-tabs__tab:active.*::after$|^\.area-segmented__item:active/;
  const CHOSEN = /\[data-selected\]|\[aria-selected="true"\]|\[aria-current[^\]]*\]|:checked|\[aria-pressed="true"\]/;
  const key = part => (withoutNot(part).split(/[\s>+~]+/).at(-1).match(/\.[\w-]+/g) ?? []).at(-1);
  const pressedChosen = rules.flatMap(({ selector }) => splitList(selector)).filter(part => /:active/.test(withoutNot(part)) && CHOSEN.test(withoutNot(part)));
  let checked = 0;
  for (const { selector, body } of rules) for (const part of splitList(selector)) {
    if (!/:active/.test(withoutNot(part)) || EXEMPT.test(part)) continue;
    const nots = part.match(/:not\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\)/g) ?? [];
    if (!nots.some(group => CHOSEN.test(group)) || !statePaints(body).length) continue;
    checked++;
    assert.ok(pressedChosen.some(other => key(other) === key(part)), `${part} leaves the selected or current item without a press`);
  }
  assert.ok(checked >= 2, `only ${checked} exclusions checked`);
  // Button: an on toggle presses one press room past its fill; a solid one a step past its hover.
  const toggle = bodiesFor('.area-button[data-selected]');
  assert.match(toggle, /--_bg-active:\s*var\(--_surface-pressed\)/, 'an on toggle shows no press');
  assert.match(toggle, /--_wash-active:\s*none/);
  assert.match(bodiesFor('.area-button--danger'), /--_surface-pressed:\s*var\(--_surface-hover\)/, 'a tone\'s on toggle does not press to its hover tint');
  assert.match(bodiesFor('.area-button--solid[data-selected]'), /--_bg-active:\s*var\(--_solid-active\)/, 'an on solid toggle shows no press');
  assert.match(bodiesFor('.area-button'), /--_surface-pressed:\s*var\(--area-bg-component-pressed\)/);
  // No row's press excludes its selected or current state any more.
  for (const selector of ['.area-menu__item:active:not([data-disabled], [data-inactive])', '.area-tree-view [role="treeitem"]:active:not([data-disabled])', '.area-table--interactive tbody tr:active td', 'button.area-approval__option:active', '.area-pagination__page[aria-current="page"]:active'])
    assert.match(ruleFor(selector)?.body ?? '', /var\(--area-bg-component-pressed\)/, `${selector} is not the pressed plate`);
  assert.match(ruleFor('.area-calendar__day[data-selected]:active:not(:disabled, [aria-disabled="true"])')?.body ?? '', /var\(--_selected-pressed\)/, 'the chosen day does not press');
});

test('every hover plate has a pressed plate one step past it (plan B7.3)', () => {
  // Each :hover rule that paints a plate (the row plate, the translucent wash, a band, a firmer plate on a plate) has an
  // :active rule for the same element (its selector with the states and their exclusions removed) that paints it.
  const PLATE = /var\(--(area-bg-component-hover|area-bg-hover|area-bg-component-active|_bg-hover|_band-hover|area-bg-component-raised-hover)\)/;
  const base = part => withoutNot(part).replace(/:is\(:active, \[aria-expanded="true"\]\)/g, '').replace(/:hover|:active/g, '').replace(/(^|[\s>+~(])button(?=\.)/g, '$1').replace(/\s+/g, ' ').trim();
  // Open, for another worker of plan B7 in this wave: Alignment picker's glyph cells (B7.6) join with that change.
  const OPEN_PRESS = /^\.area-alignment-picker__cell:hover/;
  const pressed = new Set();
  for (const { selector, body } of rules) if (statePaints(body).length || /--_bg-active|box-shadow/.test(body))
    for (const part of splitList(selector)) if (/:active/.test(withoutNot(part))) pressed.add(base(part));
  let checked = 0;
  for (const { selector, body } of rules) {
    if (!statePaints(body).some(({ value }) => PLATE.test(value))) continue;
    for (const part of splitList(selector)) {
      if (!/:hover/.test(withoutNot(part))) continue;
      checked++;
      if (OPEN_PRESS.test(part)) continue;
      assert.ok(pressed.has(base(part)), `${part} has a hover plate and no pressed plate`);
    }
  }
  assert.ok(checked >= 25, `only ${checked} hover plates checked`);
});

test('hover-revealed content hides only where there is hover (plan B7.11)', () => {
  // A part a :hover rule shows (opacity 1) is hidden (opacity 0) only inside @media (hover: hover), so a touch screen,
  // which cannot hover, always shows it, and no (hover: none) rule is needed to show it again.
  const target = part => {
    const compounds = withoutNot(part).replace(/:(is|has|where)\((?:[^()]|\([^()]*\))*\)/g, '').split(/[\s>+~]+/).filter(Boolean);
    const name = compound => (compound.match(/\.[\w-]+|::[\w-]+/g) ?? []).join('');
    const last = name(compounds.at(-1) ?? '');
    return last || `${name(compounds.at(-2) ?? '')} > *`;
  };
  const HOVERED = /:hover/;
  // Not reveals: Switch's hover layer is its hover plate fading in (its rest is the plate's absence); a Scroll area's
  // bar shows on hover and while scrolling, and touch scrolls the content itself; a dialog's footer rule shows on scroll.
  // Board's card actions still hide everywhere (board.css, outside this wave's files): open, to convert as the rest.
  const NOT_REVEAL = /^\.area-switch__track::before$|^\.area-scroll-area__scrollbar$|footer\)::before$|^\.area-board-card__actions$/;
  const shown = new Set();
  for (const { selector, body } of inMedia) {
    if (/tooltip/.test(selector) || !/(?:^|[;\s])opacity:\s*1\b/.test(body)) continue;
    for (const part of splitList(selector)) if (HOVERED.test(withoutNot(part))) shown.add(target(part));
  }
  assert.ok(shown.size >= 12, `only ${shown.size} revealed parts found`);
  let hidden = 0;
  for (const { selector, body, at } of inMedia) {
    const hover = at.some(rule => /^@media \(hover: hover\)/.test(rule)), touch = at.some(rule => /\(hover: none\)|not \(hover: hover\)|not all and \(hover: hover\)/.test(rule));
    for (const part of splitList(selector)) {
      if (!shown.has(target(part)) || HOVERED.test(withoutNot(part))) continue;
      if (/(?:^|[;\s])opacity:\s*0\b/.test(body)) { hidden++; if (!NOT_REVEAL.test(part)) assert.ok(hover, `${part} hides a hover-revealed part outside @media (hover: hover)`); }
      if (touch) assert.doesNotMatch(body, /(?:^|[;\s])opacity:\s*1\b/, `${part} shows a revealed part again for touch; hide it only where there is hover`);
    }
  }
  assert.ok(hidden >= 12, `only ${hidden} hiding rules found`);
});

// Plan C6 and C4 (docs/MOTION.md "Timing"; composing.ts): behaviour timings come from timing.ts, and every Enter
// handler on a text input steps aside for an input-method composition.
const componentSources = () => {
  const dir = new URL('../src/components/', import.meta.url);
  return readdirSync(dir).filter(name => /\.(tsx|ts)$/.test(name) && name !== 'timing.ts').map(name => ({ name, source: readFileSync(new URL(name, dir), 'utf8') }));
};
test('timings come from timing.ts: no literal setTimeout delay of 50 ms or more (plan C6)', () => {
  const found = [];
  for (const { name, source } of componentSources())
    for (const match of source.matchAll(/setTimeout\([^;]*?,\s*(\d{2,})\s*\)/g)) if (Number(match[1]) >= 50) found.push(`${name}: ${match[0].slice(0, 60)}`);
  for (const { name, source } of componentSources())
    for (const match of source.matchAll(/(?:delay|Delay|DELAY|_MS|timeout)\s*=\s*(\d{3,})\b/g)) found.push(`${name}: ${match[0]}`);
  assert.deepEqual(found, []);
});
test('every Enter handler on a text entry checks composing() (plan C4)', () => {
  const families = ['CommandPalette.tsx', 'Approval.tsx', 'ColorField.tsx', 'DatePicker.tsx', 'EditableText.tsx', 'ZoomControl.tsx', 'NumberField.tsx', 'Composer.tsx', 'TagPicker.tsx', 'Combobox.tsx', 'SearchField.tsx'];
  const sources = Object.fromEntries(componentSources().map(({ name, source }) => [name, source]));
  for (const name of families) {
    assert.ok(sources[name], `${name} exists`);
    assert.match(sources[name], /composing\(event(\.nativeEvent)?\)/, `${name} guards Enter with composing()`);
    assert.doesNotMatch(sources[name], /nativeEvent\.isComposing/, `${name} reads isComposing directly instead of composing()`);
  }
});
