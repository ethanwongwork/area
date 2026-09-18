import { test } from 'node:test';
import assert from 'node:assert/strict';
import { restoreAxisPreferences as restore } from './axis-preferences.mjs';
const presets={accent:['green','red'],theme:['dark','light'],ui:['compact','default'],radius:['sharp','subtle','soft','standard','round','rotund','pill']};
function store(value){return {value, writes:0,getItem(){return this.value},setItem(key,value){assert.equal(key,'area-docs-axes');this.value=value;this.writes++}}}
test('migrates accent once while retaining other selections',()=>{
 const s=store('{"brand":"green","theme":"dark","density":"compact"}');
 assert.deepEqual(restore(s,presets),{accent:'green',theme:'dark',ui:'compact'});
 assert.equal(s.writes,1);restore(s,presets);assert.equal(s.writes,1);
});
test('new accent selection wins and stale values are removed',()=>assert.deepEqual(restore(store('{"brand":"green","accent":"red","theme":"invalid","unknown":"x"}'),presets),{accent:'red'}));
test('maps old compact type to the curated compact package',()=>assert.deepEqual(restore(store('{"type":"geist-compact"}'),presets),{ui:'compact'}));
test('migrates legacy radius labels and numeric values to named families',()=>{
 assert.deepEqual(restore(store('{"radius":"md"}'),presets),{radius:'standard'});
 assert.deepEqual(restore(store('{"radius":"10"}'),presets),{radius:'round'});
});
test('corrupt and blocked storage remain usable',()=>{
 for(const s of ['null','[]','false','not json'])assert.deepEqual(restore(store(s),presets),{});
 assert.deepEqual(restore({getItem(){throw Error()}},presets),{});
 const s=store('{"brand":"green"}');s.setItem=()=>{throw Error()};assert.deepEqual(restore(s,presets),{accent:'green'});
});
