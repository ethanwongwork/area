import { expect, it } from 'vitest';
import { colorPairs } from './colors.ts';
import { emitAxes, emitTokens } from './css.ts';
import { ACCENT_AXIS, NEUTRAL_AXIS } from '../axes/color.ts';
import { derivedTokens, REGISTERED_PROPERTIES } from './base.ts';

it('emits both polarities without a theme axis writing another role', () => {
  const css=emitAxes();
  expect(css).not.toMatch(/\[data-area-theme="dark"\]\[data-area-(?:accent|neutral)/);
  for (const axis of [ACCENT_AXIS,NEUTRAL_AXIS]) for (const preset of axis.presets) {
    const paired=colorPairs(preset.tokens,preset.darkTokens);
    for (const [key,value] of Object.entries(paired)) expect(css).toContain(`${key}: ${value};`);
  }
});
it('defaults contain both polarities and no paired color is registered', () => {
  const css=emitTokens();
  for (const axis of [ACCENT_AXIS,NEUTRAL_AXIS]) {
    const preset=axis.presets.find(p=>p.id===axis.defaultPreset)!;
    for(const [key,value] of Object.entries(colorPairs(preset.tokens,preset.darkTokens))) {
      expect(css).toContain(`${key}: ${value};`);
      if(value.startsWith('light-dark(')) expect(REGISTERED_PROPERTIES.some(p=>p.name===key)).toBe(false);
    }
  }
});
it('refuses missing or extra polarity values',()=>{
  expect(()=>colorPairs({'--x':'#fff'},{})).toThrow();
  expect(()=>colorPairs({'--x':'#fff'},{'--x':'#000','--extra':'#fff'})).toThrow();
});

it('rejects transformed declarations outside the emitting owner', async()=>{
  const { assertEmittedTokens }=await import('../axes/registry.ts');
  expect(()=>assertEmittedTokens(ACCENT_AXIS,{...ACCENT_AXIS.presets[0]!.tokens,'--area-bg-page':'#fff'})).toThrow();
  expect(()=>assertEmittedTokens(ACCENT_AXIS,{...ACCENT_AXIS.presets[0]!.tokens,'--area-accent-solid':'Infinity'})).toThrow();
});
it('keeps inherited shadow recipes responsive to theme boundaries',()=>{
  expect(emitTokens()).toContain('--area-shadow-color: light-dark(rgb(0 0 0 / 0.06), rgb(0 0 0 / 0.2));');
});

// Since 2026-10-25 each derivation is restated where an axis that feeds it is set, and rederive.test.ts checks that for
// every axis; the contrast presentation aliases are restated wherever they can change, and none is registered.
it('re-emits contrast presentation aliases wherever an axis that feeds them is set',()=>{
  const css=emitAxes();
  const block=css.slice(css.indexOf('Re-derive cross-axis values'),css.indexOf('Re-derive material paints'));
  for(const [name,value] of Object.entries(derivedTokens()).filter(([k])=>k.startsWith('--area-edge-')||k.startsWith('--area-fill-toggle')||k.startsWith('--area-token-'))) {
    // A constant (transparent) reads nothing a scope can change, so the root's value holds everywhere.
    if(value.includes('var(')) expect(block).toContain(`${name}:`);
    expect(REGISTERED_PROPERTIES.some(p=>p.name===name)).toBe(false);
  }
});
it('honors explicit contrast preferences and only applies the OS fallback to an unconfigured root',()=>{
  const css=emitAxes();
  expect(css).toContain('[data-area-contrast="more"] {\n    --area-contrast-more: 1;');
  expect(css).toContain('[data-area-contrast="standard"] {\n    --area-contrast-more: 0;');
  expect(css).toContain('[data-area-contrast="medium"] {\n    --area-contrast-more: 0.5;');
  expect(css).toContain('@media (prefers-contrast: more)');
  expect(css).toContain(':root:not([data-area-contrast])');
  expect(emitTokens()).toContain('--area-contrast-more: 0;');
});
