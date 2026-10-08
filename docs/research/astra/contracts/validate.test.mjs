import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {DIR,validateSchema,checkDefinition,loadManifests,validateDirectory} from './validate.mjs';
const schema=JSON.parse(readFileSync(resolve(DIR,'schema.json'),'utf8'));
const button=JSON.parse(readFileSync(resolve(DIR,'button.json'),'utf8'));
const manifests=await loadManifests();
const mutated=(fn)=>{const d=structuredClone(button);fn(d);return d;};
test('every manifest family validates with complete evidence',async()=>assert.equal((await validateDirectory()).length,Object.keys(manifests).length));
test('schema rejects wrong field types and unknown fields',()=>{
 assert.throws(()=>validateSchema(mutated(d=>d.parts[0].required=42),schema),/anyOf/);
 assert.throws(()=>validateSchema(mutated(d=>d.invented=true),schema),/unexpected/);
 assert.throws(()=>validateSchema(mutated(d=>delete d.keyboard),schema),/missing/);
 assert.throws(()=>validateSchema(mutated(d=>d.options.variant.values.push('solid')),schema),/duplicate/);
});
test('manifest parity rejects changed values, missing axes, and stale defaults',()=>{
 assert.throws(()=>checkDefinition(mutated(d=>d.options.variant.values[0]='invented'),schema,manifests),/values/);
 assert.throws(()=>checkDefinition(mutated(d=>delete d.options.size),schema,manifests),/option axes/);
 assert.throws(()=>checkDefinition(mutated(d=>d.options.variant.default='ghost'),schema,manifests),/default/);
});
test('evidence requires every container and leaf, with valid pinned coordinates',()=>{
 assert.throws(()=>checkDefinition(mutated(d=>delete d.evidence['/parts/0/element/0']),schema,manifests),/evidence/);
 assert.throws(()=>checkDefinition(mutated(d=>d.evidence['/slug'].sources=['packages/styles/src/manifest.ts:999999']),schema,manifests),/out of bounds/);
 assert.throws(()=>checkDefinition(mutated(d=>d.evidence['/slug'].sources=['/private/file:1']),schema,manifests),/invalid source/);
});
test('part references and manifest states cannot silently disappear',()=>{
 assert.throws(()=>checkDefinition(mutated(d=>d.states[0].part='invented'),schema,manifests),/unresolved part/);
 assert.throws(()=>checkDefinition(mutated(d=>d.states=d.states.filter(s=>s.name!=='loading')),schema,manifests),/missing manifest state/);
});
test('JSON Schema vocabulary handles refs, enums, patterns, arrays, and alternatives',()=>{
 assert.throws(()=>validateSchema('wrong',{enum:['correct']}),/enum/);
 assert.throws(()=>validateSchema('wrong',{type:'string',pattern:'^yes$'}),/pattern/);
 assert.throws(()=>validateSchema([],{type:'array',minItems:1}),/minItems/);
 assert.throws(()=>validateSchema('',{type:'string',minLength:1}),/minLength/);
 assert.throws(()=>validateSchema('value',{$ref:'#/$defs/missing',$defs:{}}),/Unresolved/);
 validateSchema(false,{anyOf:[{type:'boolean'},{const:'not found'}]});
});
