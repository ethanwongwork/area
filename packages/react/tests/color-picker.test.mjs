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
test('picker exposes named keyboard controls and one form value', () => {
  const html = renderToString(h(ColorPicker, {label: 'Fill', name: 'fill'}));
  for (const label of ['saturation and brightness', 'hue', 'opacity', 'color model', 'hex', 'opacity percent']) assert.ok(html.includes(`aria-label="Fill ${label}"`), label);
  assert.match(html, /aria-roledescription="2D slider"/);
  assert.equal((html.match(/name="fill"/g) || []).length, 1);
});
test('color models render their channels from one HSV state', () => {
  const rgb = renderToString(h(ColorPicker, {label: 'Fill', defaultValue: '#EA7401', defaultModel: 'rgb'}));
  for (const [channel, value] of [['red', 234], ['green', 116], ['blue', 1]]) assert.match(rgb, new RegExp(`aria-label="Fill ${channel}"[^>]*value="${value}"|value="${value}"[^>]*aria-label="Fill ${channel}"`), channel);
  const hsl = renderToString(h(ColorPicker, {label: 'Fill', defaultValue: '#1E1E1E66', defaultModel: 'hsl'}));
  assert.ok(hsl.includes('aria-label="Fill lightness"'));
  const css = renderToString(h(ColorPicker, {label: 'Fill', defaultValue: '#00A79780', defaultModel: 'css'}));
  assert.match(css, /value="rgba\(0, 167, 151, 0.5\)"/);
});
test('without alpha the opacity track and percentage are removed', () => {
  const html = renderToString(h(ColorPicker, {label: 'Page', defaultValue: '#F5F5F5', alpha: false}));
  assert.ok(!html.includes('aria-label="Page opacity"'));
  assert.ok(!html.includes('aria-label="Page opacity percent"'));
});
test('header, swatches and the eyedropper are optional compositions', () => {
  const html = renderToString(h(ColorPicker, {label: 'Fill', header: h('span', null, 'Fill'), swatches: [{value: '#006DF5', label: 'Blue 500'}]}));
  assert.match(html, /area-color-picker__header/);
  assert.match(html, /area-color-picker__swatches/);
  // The EyeDropper API is detected after mount, so server markup never promises it.
  assert.ok(!html.includes('from screen'));
});

import { readFileSync } from 'node:fs';
import { AREA_COLOR_GRID, ColorSwatchPicker } from '../dist/modules/index.js';
import { rgbToOklch, oklchToRgb, contrastRatio, contrastBand } from '../dist/modules/components/color-math.js';

const palette = JSON.parse(readFileSync(new URL('../../tokens/src/color/palette.json', import.meta.url), 'utf8'));
const rgbOf = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

test('OKLCH matches the palette to four decimals and round trips through sRGB', () => {
  for (const family of Object.values(palette.families)) for (const { hex, oklch } of Object.values(family)) {
    const [L, C, H] = rgbToOklch(rgbOf(hex));
    assert.ok(Math.abs(L - oklch.L) < 6e-4 && Math.abs(C - oklch.C) < 6e-4, `${hex} L/C`);
    if (oklch.C > 0.02) assert.ok(Math.abs(((H - oklch.H + 540) % 360) - 180) < 0.5, `${hex} H`);
    const back = oklchToRgb([L, C, H]).rgb.map(Math.round);
    assert.deepEqual(back, rgbOf(hex));
  }
});
test('out-of-gamut OKLCH keeps lightness and hue and loses chroma', () => {
  const { rgb, mapped } = oklchToRgb([0.7, 0.4, 150]);
  assert.equal(mapped, true);
  const [L, , H] = rgbToOklch(rgb);
  assert.ok(Math.abs(L - 0.7) < 0.01 && Math.abs(H - 150) < 2);
});
test('contrast ratio and band agree with WCAG', () => {
  assert.equal(+contrastRatio([0, 0, 0], [255, 255, 255]).toFixed(2), 21);
  assert.equal(+contrastRatio([118, 118, 118], [255, 255, 255]).toFixed(2), 4.54);
  // On white, black passes and white fails: the band starts above 0 and reaches the top.
  const band = contrastBand(0, [255, 255, 255], 4.5);
  assert.equal(band[0][1], 100);
  assert.ok(band[0][0] > 40 && band[0][0] < 50);
});
test('views, OKLCH, contrast and preview render with names', () => {
  const html = renderToString(h(ColorPicker, { label: 'Fill', defaultValue: '#DF127D', views: ['spectrum', 'grid', 'sliders'], defaultView: 'sliders', defaultModel: 'oklch', contrast: { background: '#FFFFFF' }, preview: true, onAddSwatch: () => {} }));
  assert.match(html, /role="radiogroup" aria-label="Fill view"/);
  for (const channel of ['lightness', 'chroma', 'hue']) assert.ok(html.includes(`aria-label="Fill ${channel}"`), channel);
  assert.match(html, /data-channel="ok-c"/);
  assert.match(html, /Contrast [\d.]+ to 1 against #FFFFFF/);
  assert.match(html, /Restore original #DF127D/);
  assert.match(html, /aria-label="Save #DF127D to saved colors"/);
});
test('the palette grid is the Area palette in a contiguous radio grid', () => {
  assert.equal(AREA_COLOR_GRID.columns, 11);
  assert.equal(AREA_COLOR_GRID.options.length, 110);
  assert.equal(AREA_COLOR_GRID.options[0].label, 'White');
  const html = renderToString(h(ColorSwatchPicker, { label: 'Palette', layout: 'palette', columns: 11, options: AREA_COLOR_GRID.options }));
  assert.match(html, /area-color-swatch-picker--palette/);
  assert.equal((html.match(/type="radio"/g) || []).length, 110);
});
// The gamut picker (exact colours, 2026-10-27): lightness × chroma at a hue inside a region, an exact OKLCH value.
test('a gamut picker offers lightness and chroma at a hue, exact fields and one form value', () => {
  const html = renderToString(h(ColorPicker, {label: 'Page', name: 'page', gamut: {lightness: [0.9, 1], chroma: 0.08}, oklch: {l: 0.9634, c: 0.012, h: 255}}));
  for (const label of ['lightness and chroma', 'hue', 'lightness', 'chroma']) assert.ok(html.includes(`aria-label="Page ${label}"`), label);
  assert.match(html, /area-color-picker__area--gamut/);
  assert.match(html, /<canvas[^>]*class="area-color-picker__plane"/);
  assert.match(html, /aria-valuetext="Lightness 96.34%, chroma 0.012"/);
  assert.match(html, /type="hidden" name="page" value="oklch\(0.9634 0.012 255\)"/);
  // No spectrum, model menu, opacity or eyedropper: the value is the exact colour.
  for (const label of ['saturation and brightness', 'color model', 'opacity']) assert.ok(!html.includes(`aria-label="Page ${label}"`), label);
});
test('a gamut picker holds a value past its region at the nearest it offers', () => {
  const reach = (l) => 0.05 * (1 - l) / 0.1;
  const html = renderToString(h(ColorPicker, {label: 'Page', name: 'page', gamut: {lightness: [0.9, 1], chroma: 0.08, reach}, oklch: {l: 1.2, c: 0.3, h: 370}}));
  // Lightness held at the top (1), where the region has no chroma; the hue wraps.
  assert.match(html, /value="oklch\(1 0 10\)"/);
  const mid = renderToString(h(ColorPicker, {label: 'Page', name: 'page', gamut: {lightness: [0.9, 1], chroma: 0.08, reach}, oklch: {l: 0.95, c: 0.3, h: 30}}));
  assert.match(mid, /value="oklch\(0.95 0.025 30\)"/);
});
