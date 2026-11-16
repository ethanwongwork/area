import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Disabled, read-only and inactive, one way each (plan B7.8, B7.9, B7.10, B7.12; DESIGN_SYSTEM.md, "Disabled and
// read-only"). Reads the built stylesheet and the sources, so a family that brings back its own copy of a recipe, dims
// a field, drops a chosen card's edge when read-only, or paints a toned disabled Button in its hue, fails here. What the
// recipes paint on every ground and setting is measured in the browser: tests/behaviour/suites/states.test.mjs.
const strip = text => text.replace(/\/\*[\s\S]*?\*\//g, '');
const css = strip(readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8'));
const rules = [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim().replace(/\s+/g, ' '), body }));
const src = name => strip(readFileSync(new URL(`../../styles/src/components/${name}`, import.meta.url), 'utf8'));
const find = (selectorStart, body) => rules.find(r => r.selector.startsWith(selectorStart) && body.test(r.body));

const DISABLED = ':is(.area-input, .area-number-field, .area-otp-field, .area-tag-picker__field)[data-disabled], :is(.area-select, .area-textarea, .area-custom-select__trigger, .area-date-picker__trigger):disabled';
const READ_ONLY = ':is(.area-input, .area-number-field, .area-otp-field, .area-tag-picker__field, .area-textarea, .area-custom-select__trigger, .area-date-picker__trigger)[data-read-only]:not([data-disabled], :disabled)';

test('one disabled field recipe: the family\'s disabled fill, the faint edge, the disabled ink, never an opacity', () => {
  const rule = rules.find(r => r.selector === DISABLED);
  assert.ok(rule, 'the field shell has no disabled recipe for every shell');
  assert.match(rule.body, /--_bg:\s*var\(--_bg-disabled\)/);
  assert.match(rule.body, /--_border:\s*var\(--_border-disabled\)/);
  assert.match(rule.body, /--_border-hover:\s*var\(--_border-disabled\)/);
  assert.match(rule.body, /--_ink:\s*var\(--area-fg-disabled\)/);
  assert.doesNotMatch(rule.body, /opacity/);
  // Each root reads its own seam; soft and ghost never gain an edge.
  const roots = find('.area-input, .area-number-field, .area-input-group', /--_bg-disabled:/);
  assert.match(roots.body, /--_bg-disabled:\s*var\(--area-input-bg-disabled\)/);
  assert.match(roots.body, /--_border-disabled:\s*var\(--area-border-faint\)/);
  assert.match(find('.area-input.area-input--soft', /--_border-disabled/).body, /--_border-disabled:\s*transparent/);
  for (const [file, seam] of [['select.css', 'select-bg-disabled'], ['textarea.css', 'textarea-bg-disabled'], ['custom-select.css', 'select-bg-disabled'], ['date-picker.css', 'select-bg-disabled']])
    assert.match(src(file), new RegExp(`--_bg-disabled:\\s*var\\(--area-${seam}\\)`), `${file} doesn't read its seam`);
  for (const file of ['custom-select.css', 'date-picker.css'])
    assert.match(src(file), /--ghost \{[^}]*--_bg-disabled:\s*transparent;[^}]*--_border-disabled:\s*transparent;/, `${file}'s ghost gains paint when disabled`);
  // Parts follow the value's ink.
  const parts = rules.find(r => r.selector.startsWith(':is(.area-input, .area-number-field, .area-otp-field, .area-tag-picker__field)[data-disabled] :is(') && /color:\s*var\(--area-fg-disabled\)/.test(r.body));
  for (const part of ['area-input__icon', 'area-input__affix', 'area-input__action-button', 'area-number-field__unit', 'area-number-field__scrub', 'area-number-field__step', '[data-placeholder]', 'area-custom-select__chevron', 'area-date-picker__icon'])
    assert.ok(parts?.selector.includes(part), `${part} keeps its ink when its field is disabled`);
  // No family restates the recipe.
  for (const file of ['number-field.css', 'select.css', 'textarea.css', 'custom-select.css', 'date-picker.css', 'tag-picker.css', 'otp-field.css', 'time-field.css']) {
    const text = src(file);
    assert.doesNotMatch(text, /background-color:\s*var\(--area-(input|select|textarea)-bg-disabled\)/, `${file} paints its own disabled fill`);
    assert.doesNotMatch(text, /--_bg:\s*var\(--area-(input|select|textarea)-bg-disabled\)/, `${file} sets its own disabled fill`);
    assert.doesNotMatch(text, /border-faint/, `${file} paints its own disabled edge`);
    for (const [, selector, body] of text.matchAll(/([^{}@]+)\{([^{}]*)\}/g))
      if (/(\[data-disabled\]|:disabled)/.test(selector) && !/(__step|picker-icon|__control)/.test(selector)) assert.doesNotMatch(body, /color:\s*var\(--area-fg-disabled\)/, `${file} restates the disabled ink on ${selector.trim()}`);
  }
});

test('read-only fields take one cue, the fill one step deeper, and keep the value\'s ink and edge', () => {
  const rule = rules.find(r => r.selector === READ_ONLY);
  assert.ok(rule, 'the field shell has no read-only recipe for every shell');
  assert.match(rule.body, /--_bg:\s*var\(--_bg-read-only\)/);
  assert.match(rule.body, /--_border-hover:\s*var\(--_border\)/, 'a read-only field shows a hover edge');
  assert.match(rule.body, /cursor:\s*default/);
  assert.doesNotMatch(rule.body, /--_ink|(^|[;\s])color:|--_border:/, 'read-only changes the value\'s ink or the edge');
  assert.match(find('.area-input, .area-number-field, .area-input-group', /--_bg-read-only:/).body, /--_bg-read-only:\s*var\(--_bg-soft\)/);
  assert.match(find('.area-input.area-input--soft', /--_bg-read-only/).body, /--_bg-read-only:\s*var\(--area-bg-component-hover\)/);
  for (const file of ['custom-select.css', 'date-picker.css']) assert.match(src(file), /--_bg-read-only:\s*var\(--area-bg-component\)/, `${file}'s ghost has no read-only cue`);
});

test('everything that is not a field dims by opacity-disabled, cells and options included; descriptions keep their ink (B7.8)', () => {
  for (const [selector, body] of [
    ['.area-checkbox[data-disabled], .area-radio[data-disabled]', /opacity:\s*var\(--area-opacity-disabled\)/],
    ['.area-switch[data-disabled]', /opacity:\s*var\(--area-opacity-disabled\)/],
    ['.area-menu__item[data-disabled]', /opacity:\s*var\(--area-opacity-disabled\)/],
    ['.area-calendar__day:is(:disabled, [aria-disabled="true"]) > *', /opacity:\s*var\(--area-opacity-disabled\)/],
    ['.area-select option:disabled', /opacity:\s*var\(--area-opacity-disabled\)/],
    ['.area-property-list__item[data-inactive] > .area-property-list__value', /opacity:\s*var\(--area-opacity-disabled\)/],
  ]) assert.match(rules.find(r => r.selector === selector)?.body ?? '', body, `${selector} doesn't dim by opacity-disabled`);
  for (const file of ['calendar.css', 'setting-row.css']) assert.doesNotMatch(src(file), /fg-disabled/, `${file} dims by ink`);
  assert.match(rules.find(r => r.selector === '.area-setting-row[data-disabled] .area-setting-row__label')?.body ?? '', /color:\s*var\(--area-fg-muted\)/);
  assert.ok(!rules.some(r => /\[data-disabled\][^,]*__description/.test(r.selector) && /color|opacity/.test(r.body)), 'a disabled description changes its ink');
  assert.doesNotMatch(css, /\.area-select option:hover \{/, 'a disabled option takes the hover plate');
});

test('a toned Button repaints neutral when disabled, a neutral one dims (B7.9)', () => {
  const button = src('button.css');
  for (const tone of ['info', 'success', 'warning', 'caution', 'danger', 'discovery'])
    assert.match(button, new RegExp(`\\.area-button--${tone} \\{[^}]*--_tone-hue:\\s*1;`), `${tone} is not toned`);
  assert.match(button, /\.area-button--neutral \{[^}]*--_tone-hue:\s*0;/);
  assert.match(button, /\.area-button--solid \{[^}]*--_toned:\s*max\(var\(--_tone-hue\), var\(--area-action-accent\)\);[^}]*--_bg-off:\s*var\(--area-bg-component\)/, 'a solid at Action Accent is not toned, or has no neutral fill');
  const all = rules.find(r => r.selector === '.area-button:is(:disabled, [data-disabled], [data-inactive])');
  assert.match(all?.body ?? '', /--_dim:\s*calc\(1 - \(1 - var\(--area-opacity-disabled\)\) \* \(1 - var\(--_toned\)\)\)/);
  assert.match(all.body, /color:\s*color-mix\(in srgb, var\(--_fg\), var\(--area-fg-disabled\) calc\(var\(--_toned\) \* 100%\)\)/);
  const disabled = rules.find(r => r.selector === '.area-button:is(:disabled, [data-disabled])');
  assert.match(disabled?.body ?? '', /opacity:\s*var\(--_dim\)/);
  assert.match(disabled.body, /background-color:\s*var\(--_off-bg\)/);
  assert.match(button, /--on-color \{[^}]*--_toned:\s*0;/, 'an on-colour button repaints');
  // The joined pair dims once, and only when neutral.
  assert.match(css, /\.area-split-button:has\(> \.area-button--neutral:disabled\):not\(:has\(> \.area-button:not\(:disabled\)\)\) \{\s*opacity: var\(--_split-dim\);/);
});

test('read-only keeps every state\'s paint and drops only the pointer\'s; one spelling (B7.10)', () => {
  assert.doesNotMatch(css, /\[data-readonly\]/, 'data-readonly is painted');
  for (const { selector, body } of rules) {
    if (!/\[data-read-only\]/.test(selector) || /:not\(/.test(selector.split('[data-read-only]')[0].slice(-12))) continue;
    if (/:not\([^)]*\[data-read-only\]/.test(selector)) continue;
    assert.doesNotMatch(body, /box-shadow:\s*none|border-color:\s*var\(--_card-edge\)/, `${selector} drops a chosen card's edge`);
  }
  // The box's hover paint never reaches a read-only option.
  for (const { selector } of rules) {
    if (!/__control[^,]*:hover/.test(selector) || !/area-(checkbox|radio)__control/.test(selector)) continue;
    if (/:not\([^)]*:disabled/.test(selector)) assert.match(selector, /\[data-read-only\] > \*/, `${selector} hovers a read-only box`);
  }
});

test('an inactive row dims as a whole and its reason is never stronger than its label (B7.12)', () => {
  const own = rules.find(r => r.selector === '.area-menu__item[data-inactive]');
  assert.match(own?.body ?? '', /color:\s*var\(--area-fg-muted\)/, 'the inactive label is not the muted ink its reason reads');
  assert.doesNotMatch(own.body, /(^|[;\s])opacity\s*:/);
  const parts = rules.find(r => r.selector.startsWith('.area-menu__item[data-inactive] > :is(') && /opacity/.test(r.body));
  assert.ok(parts && !/__text|__lines|__description|__trailing/.test(parts.selector), 'an inactive row fades its words or its reason');
  assert.ok(!rules.some(r => /\[data-inactive\][^,]*(__description|__lines)/.test(r.selector) && /opacity/.test(r.body)), 'the reason takes an opacity');
});

test('disabled is GrayText in forced colours; read-only keeps the text colour', () => {
  for (const part of ['.area-button:is(:disabled, [data-disabled])', '.area-menu__item:is([data-disabled], [data-inactive])', '.area-calendar__day:is(:disabled, [aria-disabled="true"])', ':is(.area-checkbox, .area-radio)[data-disabled]', '.area-switch[data-disabled]'])
    assert.ok(rules.some(r => r.selector.split(/,\s*(?![^()]*\))/).includes(part) && /color:\s*GrayText/.test(r.body)), `${part} has no GrayText`);
  assert.ok(rules.some(r => r.selector.includes(':is(.area-input, .area-number-field, .area-otp-field, .area-tag-picker__field)[data-disabled]') && /border-color:\s*GrayText/.test(r.body)), 'a disabled field keeps a CanvasText edge');
  assert.ok(!rules.some(r => /data-read-only/.test(r.selector) && /GrayText/.test(r.body)), 'read-only greys out');
});
