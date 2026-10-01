import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { readFileSync } from 'node:fs';

// Renders a forwardRef component's element inside a real render, so its hooks run, and hands
// back the element it returned: its handlers can then be called without a DOM.
const rendered = (component, props) => {
  let element;
  renderToString(h(() => (element = component.render(props, null))));
  return element;
};
import { Alert, Button, Chip, Combobox, Composer, Dialog, Menu, MenuItem } from '../dist/modules/index.js';

test('Alert closes with a ghost small Button and the Area glyph (audit S9)', () => {
  const html = renderToString(h(Alert, { tone: 'info', onDismiss: () => {}, dismissLabel: 'Dismiss notice' }, 'Saved'));
  assert.match(html, /<span class="area-alert__dismiss"><button[^>]*class="area-button area-button--ghost[^"]*area-button--sm/);
  assert.match(html, /aria-label="Dismiss notice"/);
  assert.match(html, /data-area-glyph="dismiss"/);
});

test('Chip dismisses through onDismiss with the Area glyph; onRemove still works (audit S9)', () => {
  const html = renderToString(h(Chip, { kind: 'input', onDismiss: () => {}, dismissLabel: 'Remove Design' }, 'Design'));
  assert.match(html, /class="area-chip__remove" aria-label="Remove Design"/);
  assert.match(html, /data-area-glyph="dismiss"/);
  const legacy = renderToString(h(Chip, { kind: 'input', onRemove: () => {} }, 'Design'));
  assert.match(legacy, /class="area-chip__remove" aria-label="Remove chip"/);
});

test('Dialog names its close control with dismissLabel (audit S9)', () => {
  const html = renderToString(h(Dialog, { title: 'Rename', dismissLabel: 'Close rename' }, 'Body'));
  assert.match(html, /aria-label="Close rename"/);
  assert.match(renderToString(h(Dialog, { title: 'Rename' }, 'Body')), /aria-label="Close dialog"/);
});

test('a radio MenuItem is a menuitemradio with the Area check (audit S13)', () => {
  const html = renderToString(h(Menu, { 'aria-label': 'Mode' }, h(MenuItem, { radio: true, checked: true }, 'Standard'), h(MenuItem, { radio: true, checked: false }, 'Focused')));
  assert.match(html, /role="menuitemradio" aria-checked="true"/);
  assert.match(html, /role="menuitemradio" aria-checked="false"/);
  assert.doesNotMatch(html, /data-selected/);
});

test('a loading Button keeps focus: aria-disabled, not native disabled (audit S18)', () => {
  const html = renderToString(h(Button, { loading: true }, 'Save'));
  assert.doesNotMatch(html, / disabled=""/);
  assert.match(html, /aria-disabled="true"/);
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /data-loading=""/);
  assert.match(html, /<span class="area-spinner" aria-hidden="true">/);
  // A disabled Button that is also loading stays natively disabled.
  assert.match(renderToString(h(Button, { loading: true, disabled: true }, 'Save')), / disabled=""/);
  // Its click (and a form's implicit submit, which is a click) is swallowed.
  let called = 0, prevented = 0;
  const element = rendered(Button, { loading: true, onClick: () => called++, type: 'submit', children: 'Save' });
  element.props.onClick({ preventDefault: () => prevented++ });
  assert.equal(called, 0);
  assert.equal(prevented, 1);
});

test('Button toggles uncontrolled with defaultSelected and reports onSelectedChange (audit S17)', () => {
  const html = renderToString(h(Button, { defaultSelected: true }, 'Bold'));
  assert.match(html, /aria-pressed="true"/);
  const changes = [];
  const element = rendered(Button, { selected: false, onSelectedChange: (next, event) => changes.push([next, typeof event]), children: 'Bold' });
  element.props.onClick({ defaultPrevented: false });
  assert.deepEqual(changes, [[true, 'object']]);
  // A plain Button is not a toggle.
  assert.doesNotMatch(renderToString(h(Button, null, 'Save')), /aria-pressed/);
});

test('a loading Composer keeps its field editable and turns send into Stop (audit S18)', () => {
  const html = renderToString(h(Composer, { loading: true, onStop: () => {}, defaultValue: 'Next prompt' }));
  assert.match(html, /aria-busy="true"/);
  assert.doesNotMatch(html, /<textarea[^>]* disabled=""/);
  assert.match(html, /aria-label="Stop"/);
  assert.match(html, /data-area-glyph="stop"/);
  assert.match(html, /<path d="M4.5 2.5H11.5[^"]*" fill="currentColor"/);
  // Without onStop, send is only unavailable; busy is the deprecated alias.
  const legacy = renderToString(h(Composer, { busy: true, defaultValue: 'Next prompt' }));
  assert.doesNotMatch(legacy, /<textarea[^>]* disabled=""/);
  assert.match(legacy, /aria-label="Send message"[^>]* disabled=""|disabled=""[^>]*aria-label="Send message"/);
});

test('every anchored surface is placed by the shared engine; no CSS anchoring left (audit S16)', () => {
  const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  // Only Select's native picker, which the platform places, keeps position-area.
  const anchored = [...css.matchAll(/([^{}]+)\{[^}]*position-area/g)].map(match => match[1].trim());
  assert.deepEqual(anchored, ['.area-select::picker(select)']);
  assert.doesNotMatch(css, /area-popover-anchor|anchor-name/);
  // Select's picker takes Combobox's list rules (B-5): flips, at least 224, at most 324.
  const picker = [...css.matchAll(/\.area-select::picker\(select\)\s*\{([^}]*)\}/g)].map(match => match[1]).find(body => /position-area/.test(body));
  assert.match(picker, /position-try-fallbacks:\s*flip-block/);
  assert.match(picker, /max-block-size:\s*min\(324px/);
  // A triggered tooltip draws no browser popover border (it was 34 tall, not 28).
  assert.match(css, /\.area-tooltip\[popover\]\s*\{\s*border:\s*0;?\s*\}/);
});

test('Combobox renders no anchor custom property; the engine places its list (audit S16)', () => {
  const html = renderToString(h(Combobox, { 'aria-label': 'Font', options: [{ value: 'inter', label: 'Inter' }] }));
  assert.doesNotMatch(html, /--_combobox-anchor/);
  assert.match(html, /role="listbox"[^>]*popover="manual"/);
});

test('every hover rule sits under @media (hover: hover); disabled and scrim read their roles (audit S21b)', () => {
  const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  // Walk the blocks: a rule whose selector has :hover must be inside a hover: hover media block.
  const stack = [];
  let start = 0, loose = [];
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === '{') { stack.push(css.slice(start, i).trim()); start = i + 1; }
    else if (c === '}') { stack.pop(); start = i + 1; }
    else if (c === ';') start = i + 1;
    if (c === '{') {
      const selector = stack.at(-1);
      if (/:hover/.test(selector) && !selector.startsWith('@') && !stack.some(s => /@media[^{]*\(hover:\s*hover\)/.test(s))) loose.push(selector);
    }
  }
  assert.deepEqual(loose, []);
  // Disabled controls dim through the role; the one literal 0.5 left is PropertyList's inactive layer.
  assert.equal((css.match(/opacity:\s*0?\.5;/g) ?? []).length, 1);
  assert.match(css, /\.area-button:disabled,\s*\.area-button\[data-disabled\]\s*\{[^}]*opacity:\s*var\(--area-opacity-disabled\)/);
  assert.equal((css.match(/::backdrop\s*\{\s*background:\s*var\(--area-scrim\)/g) ?? []).length, 3);
});
