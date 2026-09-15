import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkManifestParity as check } from './manifest-parity.mjs';
const m={a:{block:'area-a',variants:{size:['sm']},states:['disabled'],elements:['item'],defaults:{size:'sm'}}};
const base='.area-a {} .area-a--sm {} .area-a__item {}';
test('native state belongs to the component',()=>assert.deepEqual(check(m,base+' .area-a__item:disabled {}'),[]));
test('another component cannot satisfy a state',()=>assert.ok(check(m,base+' .area-b:disabled {}').some(v=>v.includes('state'))));
test('comma-separated neighbor cannot satisfy a state',()=>assert.ok(check(m,base+' .area-a, .area-b:disabled {}').some(v=>v.includes('state'))));
test('a negated state cannot satisfy positive state coverage',()=>assert.ok(check(m,base+' .area-a:not(:disabled) {}').some(v=>v.includes('state'))));
test('comments and declaration strings are not selectors',()=>assert.ok(check(m,'.area-a {content:".area-a--sm"} /* .area-a--sm {} */').some(v=>v.includes('missing selector .area-a--sm'))));
test('prefix collisions do not satisfy exact classes',()=>assert.ok(check(m,'.area-a-other {} .area-a--small {}').some(v=>v.includes('missing base'))));
test('undeclared elements and defaults fail',()=>{
 const errors=check({...m,a:{...m.a,defaults:{size:'xl'}}},base+' .area-a__unknown {}');
 assert.ok(errors.some(v=>v.includes('undeclared')));assert.ok(errors.some(v=>v.includes('invalid default')));
});
test('duplicate modifier values fail',()=>assert.ok(check({a:{...m.a,variants:{...m.a.variants,tone:['sm']}}},base).some(v=>v.includes('duplicate'))));

test('descendant component cannot satisfy parent state',()=>assert.ok(check(m,base+' .area-a .area-b:disabled {}').some(v=>v.includes('state'))));
