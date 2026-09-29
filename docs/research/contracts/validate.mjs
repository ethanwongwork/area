/** Dependency-free validator for the exact JSON Schema vocabulary used by schema.json. */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { stripTypeScriptTypes } from 'node:module';
import assert from 'node:assert/strict';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
export const DIR = resolve(ROOT, 'docs/research/contracts');
export const START = '7dae828e7af1daf9d26b663d34335121156606f7';
const git = (...args) => execFileSync('git', args, {cwd: ROOT, encoding:'utf8', maxBuffer: 40e6});
const cache = new Map();
export function source(path) {
  if (!cache.has(path)) cache.set(path, git('show', `${START}:${path}`));
  return cache.get(path);
}
export const pointer = key => String(key).replace(/~/g, '~0').replace(/\//g, '~1');
export function paths(value, path = '') {
  const out = path ? [path] : [];
  if (value && typeof value === 'object') for (const [k,v] of Object.entries(value)) {
    if (!path && k === 'evidence') continue;
    out.push(...paths(v, `${path}/${pointer(k)}`));
  }
  return out;
}
export function validateSchema(value, schema, root = schema, path = '$') {
  if (schema.$ref) {
    assert(schema.$ref.startsWith('#/'), 'Only local schema references are supported');
    const target = schema.$ref.slice(2).split('/').reduce((o,k) => o[k], root);
    assert(target, `Unresolved schema reference ${schema.$ref}`);
    return validateSchema(value, target, root, path);
  }
  if (schema.anyOf) {
    const errors = [];
    for (const candidate of schema.anyOf) {
      try { validateSchema(value, candidate, root, path); return; } catch (e) { errors.push(e.message); }
    }
    throw new Error(`${path}: no anyOf branch matched: ${errors.join('; ')}`);
  }
  if ('const' in schema) assert.deepEqual(value, schema.const, `${path}: const`);
  if (schema.enum) assert(schema.enum.some(v => JSON.stringify(v) === JSON.stringify(value)), `${path}: enum`);
  const type = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
  if (schema.type) assert(type === schema.type, `${path}: expected ${schema.type}, got ${type}`);
  if (type === 'object') {
    for (const key of schema.required ?? []) assert(Object.hasOwn(value,key), `${path}: missing ${key}`);
    for (const [key, child] of Object.entries(value)) {
      const spec = schema.properties?.[key] ?? schema.additionalProperties;
      assert(spec !== false, `${path}: unexpected ${key}`);
      if (spec && typeof spec === 'object') validateSchema(child, spec, root, `${path}/${pointer(key)}`);
    }
  }
  if (type === 'array') {
    if (schema.minItems !== undefined) assert(value.length >= schema.minItems, `${path}: minItems`);
    if (schema.uniqueItems) assert(new Set(value.map(v=>JSON.stringify(v))).size === value.length, `${path}: duplicate item`);
    if (schema.items) value.forEach((v,i)=>validateSchema(v,schema.items,root,`${path}/${i}`));
  }
  if (type === 'string') {
    if (schema.minLength !== undefined) assert([...value].length >= schema.minLength, `${path}: minLength`);
    if (schema.pattern) assert(new RegExp(schema.pattern).test(value), `${path}: pattern ${schema.pattern}`);
  }
}
function checkVocabulary(schema) {
  const supported = new Set(['$schema','$id','title','description','$defs','$ref','type','required','properties','additionalProperties','items','minItems','uniqueItems','minLength','pattern','enum','const','anyOf']);
  for (const k of Object.keys(schema)) assert(supported.has(k), `Unsupported schema keyword: ${k}`);
  for (const k of ['$defs','properties']) for (const s of Object.values(schema[k] ?? {})) checkVocabulary(s);
  for (const k of ['additionalProperties','items']) if (typeof schema[k] === 'object') checkVocabulary(schema[k]);
  for (const s of schema.anyOf ?? []) checkVocabulary(s);
}
export async function loadManifests(text = readFileSync(resolve(ROOT, 'packages/styles/src/manifest.ts'), 'utf8')) {
  return (await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(text)).toString('base64')}`)).MANIFESTS;
}
export function checkDefinition(d, schema, manifests) {
  validateSchema(d, schema);
  const m = manifests[d.manifest];
  assert(m, `${d.slug}: unknown manifest`);
  assert.equal(d.slug, m.block.slice(5), `${d.slug}: slug/block mismatch`);
  assert.deepEqual(Object.keys(d.options).sort(), Object.keys(m.variants).sort(), `${d.slug}: option axes`);
  for (const [axis, values] of Object.entries(m.variants)) {
    assert.deepEqual(d.options[axis].values, values, `${d.slug}.${axis}: values`);
    assert.equal(d.options[axis].default, m.defaults[axis] ?? 'not found', `${d.slug}.${axis}: default`);
  }
  assert.deepEqual(d.booleans, m.booleans ?? [], `${d.slug}: booleans`);
  assert.deepEqual(d.elementModifiers, m.elementModifiers ?? {}, `${d.slug}: elementModifiers`);
  const ids = new Set(d.parts.map(p=>p.id));
  assert.equal(ids.size, d.parts.length, `${d.slug}: duplicate part id`);
  assert(d.parts.some(p=>p.id==='root' && p.class===m.block), `${d.slug}: root class`);
  for (const el of m.elements ?? []) assert(d.parts.some(p=>p.class===`${m.block}__${el}`), `${d.slug}: missing part ${el}`);
  for (const state of m.states ?? []) assert(d.states.some(s=>s.name===state), `${d.slug}: missing manifest state ${state}`);
  for (const v of [...d.states,...d.keyboard,...d.accessibleName,...d.slots]) assert(v.part === 'not found' || ids.has(v.part), `${d.slug}: unresolved part ${v.part}`);
  const expected = paths(d).sort();
  assert.deepEqual(Object.keys(d.evidence).sort(), expected, `${d.slug}: evidence must cover every node exactly`);
  for (const path of expected) {
    const e = d.evidence[path];
    const value = path.slice(1).split('/').reduce((o,k)=>o[k.replace(/~1/g,'/').replace(/~0/g,'~')],d);
    if (value === 'not found') assert.equal(e.status, 'not found', `${d.slug}${path}: missing value must have missing evidence`);
    for (const coordinate of e.sources) {
      const [,file,line] = coordinate.match(/^(.+):(\d+)$/) ?? [];
      assert(file && !file.startsWith('/') && !file.split('/').includes('..'), `${coordinate}: invalid source path`);
      const text = source(file);
      assert(Number(line) <= text.split('\n').length, `${coordinate}: out of bounds at ${START}`);
    }
  }
}
export async function validateDirectory(directory = DIR) {
  const schema = JSON.parse(readFileSync(resolve(directory,'schema.json'),'utf8'));
  checkVocabulary(schema);
  const manifests = await loadManifests();
  const definitions = readdirSync(directory).filter(f=>f.endsWith('.json') && f!=='schema.json').map(f=>{
    const d=JSON.parse(readFileSync(resolve(directory,f),'utf8'));
    assert.equal(f, `${d.slug}.json`, `${f}: filename/slug mismatch`);
    checkDefinition(d,schema,manifests);
    return d;
  });
  assert.deepEqual(definitions.map(d=>d.manifest).sort(),Object.keys(manifests).sort(),'Every manifest family needs exactly one definition');
  return definitions;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const definitions = await validateDirectory();
    console.log(`Contracts valid: ${definitions.length} families; ${definitions.reduce((n,d)=>n+Object.keys(d.options).length,0)} axes; complete evidence at ${START}.`);
  } catch (error) { console.error(error.message); process.exitCode=1; }
}
