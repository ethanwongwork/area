import { expect, it } from 'vitest';
import { colorPairs } from './colors.ts';
import { emitAxes, emitTokens } from './css.ts';
import { BRAND_AXIS, NEUTRAL_AXIS } from '../axes/color.ts';
import { REGISTERED_PROPERTIES } from './base.ts';

it('emits both polarities without a theme axis writing another role', () => {
  const css=emitAxes();
  expect(css).not.toMatch(/\[data-area-theme="dark"\]\[data-area-(?:brand|neutral)/);
  for (const axis of [BRAND_AXIS,NEUTRAL_AXIS]) for (const preset of axis.presets) {
    const paired=colorPairs(preset.tokens,preset.darkTokens);
    for (const [key,value] of Object.entries(paired)) expect(css).toContain(`${key}: ${value};`);
  }
});
it('defaults contain both polarities and no paired color is registered', () => {
  const css=emitTokens();
  for (const axis of [BRAND_AXIS,NEUTRAL_AXIS]) {
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
  expect(()=>assertEmittedTokens(BRAND_AXIS,{...BRAND_AXIS.presets[0]!.tokens,'--area-bg-page':'#fff'})).toThrow();
  expect(()=>assertEmittedTokens(BRAND_AXIS,{...BRAND_AXIS.presets[0]!.tokens,'--area-brand-solid':'Infinity'})).toThrow();
});
it('keeps inherited shadow recipes responsive to theme boundaries',()=>{
  expect(emitTokens()).toContain('--area-shadow-color: light-dark(rgb(0 0 0 / 0.10), rgb(0 0 0 / 0.45));');
});
