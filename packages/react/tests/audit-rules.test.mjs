import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { Alert, Chip, Combobox, Dialog, Menu, MenuItem } from '../dist/modules/index.js';

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
