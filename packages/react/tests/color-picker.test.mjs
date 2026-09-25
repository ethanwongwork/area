import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { ColorPicker, ColorField, hexToHsv, hsvToHex } from '../dist/modules/index.js';

test('HSV round trips chromatic, achromatic and transparent colors', () => {
  for (const hex of ['#FF0000', '#00FF00', '#0000FF', '#8D4DF3', '#000000', '#FFFFFF', '#777777', '#8D4DF380', '#00000000']) {
    assert.equal(hsvToHex(...hexToHsv(hex)), hex);
  }
  assert.equal(hsvToHex(360, 100, 100), '#FF0000');
  assert.equal(hsvToHex(120, 100, 100, 0), '#00FF0000');
});
test('split color field submits one canonical color and names the opacity control', () => {
  const html = renderToString(h(ColorField, {alpha: true, name: 'fill', defaultValue: '#abc8', 'aria-label': 'Fill', disabled: true}));
  assert.equal((html.match(/name="fill"/g) || []).length, 1);
  assert.match(html, /type="hidden" disabled="" name="fill" value="#AABBCC88"/);
  assert.match(html, /value="AABBCC"/);
  assert.match(html, /aria-label="Opacity"/);
});
test('picker exposes individually named keyboard channels and one form value', () => {
  const html = renderToString(h(ColorPicker, {label: 'Fill', name: 'fill'}));
  for (const label of ['saturation', 'brightness', 'hue', 'opacity']) assert.ok(html.includes(`aria-label="Fill ${label}"`));
  assert.equal((html.match(/name="fill"/g) || []).length, 1);
});
