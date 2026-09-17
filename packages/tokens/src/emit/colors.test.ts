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
  expect(emitTokens()).toContain('--area-shadow-color: light-dark(rgb(0 0 0 / 0.06), rgb(0 0 0 / 0.08));');
});

it('re-emits contrast presentation aliases at every axis and preference boundary',()=>{
  const css=emitAxes();
  const boundary=css.slice(css.lastIndexOf('[data-area-theme],'));
  for(const axis of ['theme','neutral','accent','ui','radius','surface','motion','contrast']) expect(boundary).toContain(`[data-area-${axis}]`);
  for(const name of Object.keys(derivedTokens()).filter(k=>k.startsWith('--area-edge-')||k.startsWith('--area-fill-toggle')||k.startsWith('--area-token-'))) {
    expect(boundary).toContain(`${name}:`);
    expect(REGISTERED_PROPERTIES.some(p=>p.name===name)).toBe(false);
  }
});
it('honors explicit contrast preferences and only applies the OS fallback to an unconfigured root',()=>{
  const css=emitAxes();
  expect(css).toContain('[data-area-contrast="more"] {\n    --area-contrast-more: 1;');
  expect(css).toContain('[data-area-contrast="standard"] {\n    --area-contrast-more: 0;');
  expect(css).toContain('@media (prefers-contrast: more)');
  expect(css).toContain(':root:not([data-area-contrast])');
  expect(emitTokens()).toContain('--area-contrast-more: 0;');
});
