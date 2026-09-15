import { expect, it } from 'vitest';
import { emitConfig, emitConfigTypes } from './config.ts';
import { AXES, defaultPresetOf } from '../axes/registry.ts';

async function runtime() {
  return import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from(emitConfig()).toString('base64')}`);
}
it('derives all runtime presets and defaults from the registry',async()=>{
  const {AXIS_PRESETS,DEFAULT_AXES}=await runtime();
  for(const axis of AXES) {
    expect(AXIS_PRESETS[axis.id]).toEqual(axis.presets.map(p=>p.id));
    expect(DEFAULT_AXES[axis.id]).toBe(defaultPresetOf(axis).id);
    for(const preset of axis.presets) expect(emitConfigTypes()).toContain(JSON.stringify(preset.id));
  }
});
it('inherits omitted choices, validates inputs, and does not mutate its parent',async()=>{
  const {mergeAxes,themeAttributes}=await runtime();
  const parent=mergeAxes(undefined,{theme:'dark',brand:'green',neutral:'warm'});
  const child=mergeAxes(parent,{density:'compact',theme:undefined});
  expect(child).toMatchObject({theme:'dark',brand:'green',neutral:'warm',density:'compact'});
  expect(parent.density).toBe('default');
  expect(themeAttributes(child)['data-area-theme']).toBe('dark');
  expect(()=>mergeAxes(parent,{brand:'missing'})).toThrow();
  expect(()=>mergeAxes(parent,{unknown:'value'})).toThrow();
  expect(()=>mergeAxes({theme:'missing'})).toThrow();
  for(const invalid of [null,false,3,[]]) expect(()=>mergeAxes(invalid)).toThrow();
});
