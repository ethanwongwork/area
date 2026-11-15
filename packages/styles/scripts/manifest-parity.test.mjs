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

/* A state's hook as its manifest names it (stateAttributes), and a state another component draws (statesFrom). */
const o={a:{block:'area-a',variants:{},states:['open'],stateAttributes:{open:'open'},defaults:{}}};
test('a native attribute hook counts where the manifest names it',()=>{
 assert.deepEqual(check(o,'.area-a[open] {}'),[]);
 assert.ok(check({a:{...o.a,stateAttributes:{}}},'.area-a[open] {}').some(v=>v.includes('state open')));
});
test('a pseudo-class hook counts where the manifest names it',()=>{
 assert.deepEqual(check({a:{...o.a,stateAttributes:{open:':popover-open'}}},'.area-a:popover-open {}'),[]);
 assert.ok(check(o,'.area-a:popover-open {}').some(v=>v.includes('state open')));
});
test('an ARIA hook counts, only where it is true',()=>{
 const busy={a:{block:'area-a',variants:{},states:['loading'],stateAttributes:{loading:'aria-busy'},defaults:{}}};
 assert.deepEqual(check(busy,'.area-a[aria-busy="true"] {}'),[]);
 assert.ok(check(busy,'.area-a[aria-busy="false"] {}').some(v=>v.includes('state loading')));
});
test('a list in :is() lends its state to each member, never to a neighbour outside it',()=>{
 const two={...o,b:{...o.a,block:'area-b'}};
 assert.deepEqual(check(two,':is(.area-a, .area-b)[open] {}'),[]);
 assert.ok(check(two,':is(.area-a, .area-b[open]) {}').some(v=>v.includes('a: missing component-scoped positive state open')));
 assert.ok(check(two,':is(.area-a, .area-b:not([open])) {}').some(v=>v.includes('state open')));
});
test('a state drawn by another component must be that component\'s declared state',()=>{
 const from={a:{block:'area-a',variants:{},states:['disabled'],statesFrom:{disabled:'b'},defaults:{}},b:{block:'area-b',variants:{},states:['disabled'],defaults:{}}};
 assert.deepEqual(check(from,'.area-a {} .area-b:disabled {}'),[]);
 assert.ok(check({...from,b:{...from.b,states:[]}},'.area-a {} .area-b {}').some(v=>v.includes('which has no disabled state')));
 assert.ok(check({a:{...from.a,statesFrom:{disabled:'c'}}},'.area-a {}').some(v=>v.includes('unknown component c')));
 assert.ok(check({a:{...from.a,states:[]}},'.area-a {}').some(v=>v.includes('statesFrom for undeclared state')));
});
test('stateAttributes name only declared states',()=>assert.ok(check({a:{...o.a,states:[]}},'.area-a {}').some(v=>v.includes('stateAttributes for undeclared state open'))));

/* --- React against the manifest (system evaluation 2026-11-11, F5; GOVERNANCE § 7) ---------------------------------
 * The manifest is the source of every visual prop's values and of the states a behaviour prop paints. The React props
 * are read with the TypeScript compiler (apps/desktop/scripts/api-rows.mjs, which also writes the API tab's rows). Each
 * KNOWN list holds today's real mismatches, one side lacking a value or a state: a new one fails, and so does one that
 * has been fixed (take it off the list). Never add to a list to make a change pass; fix the side that is wrong. */
const api = await import('../../../apps/desktop/scripts/api-rows.mjs');
const react = api.reactProps();
const manifests = await api.loadManifests();
const pages = await api.loadPages();
const parts = api.partsOfPages(pages, react);
/** Every family's own parts with the manifest each draws: [Part, props entry, manifest]. */
const drawn = pages.filter(page => !page.docsOnly).flatMap(page => parts.get(page.slug).map((name, index) =>
  [name, react[name], api.manifestOfExport(page, name, index, manifests)])).filter(([, entry, manifest]) => entry && manifest);
const own = (name, prop) => prop.owner === `${name}Props` && !prop.deprecated;
const at = prop => `${prop.file}:${prop.line}`;
const report = (found, known) => {
  const keys = found.map(([key]) => key);
  const fresh = found.filter(([key]) => !known.includes(key)).map(([key, where]) => `${key} (${where})`);
  const fixed = known.filter(key => !keys.includes(key));
  assert.deepEqual({ new: fresh, fixed }, { new: [], fixed: [] });
};

/* A value React draws that the manifest lacks: the base look with no class of its own, which belongs in the manifest
 * as a value and its default (B-S3, B-S9), or a manifest value React cannot take. */
// A default drawn by the bare block is a value with an empty class of its own (`.area-approval--surface {}`, Slider's
// `--rail`), so the manifest lists it and its default.
const KNOWN_VALUES = [];
test('a visual prop takes exactly its manifest axis\'s values', () => {
  const found = [];
  for (const [name, entry, manifest] of drawn) for (const prop of entry.props) {
    const axis = manifest.variants[prop.name];
    if (!axis || !prop.literals) continue;
    const extra = prop.literals.filter(value => !axis.includes(value) && !prop.aliases.includes(value));
    // Exclude<…> narrows on purpose (Chart's number kind is ChartNumber); anything else must take every value.
    const missing = prop.narrowed ? [] : axis.filter(value => !prop.literals.includes(value));
    if (extra.length) found.push([`${name}.${prop.name}: React has ${extra.join(', ')}`, at(prop)]);
    if (missing.length) found.push([`${name}.${prop.name}: the manifest has ${missing.join(', ')}`, at(prop)]);
  }
  report(found, KNOWN_VALUES);
});

test('a visual prop is typed from the manifest, not by hand', () => {
  const found = [];
  for (const [name, entry, manifest] of drawn) for (const prop of entry.props) {
    if (manifest.variants[prop.name] && own(name, prop) && !prop.manifestTyped) found.push(`${name}.${prop.name} (${at(prop)}): ${prop.type}`);
  }
  assert.deepEqual(found, []);
});

/* A visual word React takes with no axis in its family's manifest. */
const VISUAL = ['variant', 'size', 'tone', 'layout', 'kind', 'orientation', 'selection', 'density'];
const KNOWN_AXES = [
  // Structure, not a treatment: sides or corners chooses which Number fields there are and the glyph in each (four
  // fields either way, the same paint), so no class could draw it; GOVERNANCE § 4's axes are classes. docs/specs/box-field.md.
  'BoxField.kind',
];
test('a visual prop has its manifest axis', () => {
  const found = [];
  for (const [name, entry, manifest] of drawn) for (const prop of entry.props) {
    if (VISUAL.includes(prop.name) && !manifest.variants[prop.name] && own(name, prop) && prop.literals && !prop.manifestTyped) found.push([`${name}.${prop.name}`, at(prop)]);
  }
  report(found, KNOWN_AXES);
});

/* A behaviour prop (GOVERNANCE § 4) whose state the manifest does not list, so nothing declares how it paints. */
const BEHAVIOUR = { disabled: 'disabled', readOnly: 'read-only', invalid: 'invalid', loading: 'loading', selected: 'selected', open: 'open', inactive: 'inactive', collapsed: 'collapsed' };
// A state is declared with the hook the CSS uses (stateAttributes: [open], :popover-open, aria-busy, aria-expanded), or
// as another component's (statesFrom: Box field's disabled is its Number fields'). What is left paints nothing a state
// hook could name: the prop changes what is there, not how it is drawn.
const KNOWN_STATES = [
  'ContextMenu.disabled', // no custom menu opens, so the browser's own does; the area it wraps is content, never dimmed
  // The native disabled of its button. No CSS draws a disabled Mention: giving it a look is a visual change for its own
  // pass, not a declaration.
  'Mention.disabled',
  // Each swaps parts rather than painting the block (the root's aria-busy is announced, and no CSS reads it): Composer's
  // send slot holds Stop, Table's bodies are Skeleton rows (`__skeleton`), Menu shows its `__loading` row.
  'Composer.loading', 'Table.loading', 'Menu.loading',
  'Skeleton.loading', // `loading={false}` shows the children in its place; the waiting paint is `data-waiting` (the delay)
];
test('a behaviour prop has its manifest state', () => {
  const found = [];
  for (const [name, entry, manifest] of drawn) for (const prop of entry.props) {
    const state = BEHAVIOUR[prop.name];
    if (state && own(name, prop) && !(manifest.states ?? []).includes(state)) found.push([`${name}.${prop.name}`, at(prop)]);
  }
  report(found, KNOWN_STATES);
});

/* --- One vocabulary (system evaluation 2026-11-11, F8; GOVERNANCE § 4, vocabulary.mjs) ------------------------------ */
const { checkVocabulary } = await import('./manifest-parity.mjs');
const vocabulary = await import('./vocabulary.mjs');
const { readFileSync } = await import('node:fs');
const vocab = deviations => ({ ...vocabulary, ALLOWED_DEVIATIONS: deviations });
const plain = { block: 'area-a', variants: {}, defaults: {} };
test('a new name off the vocabulary fails', () => {
  const off = (m, react) => checkVocabulary({ manifests: { a: { ...plain, ...m } }, react }, vocab({}));
  assert.ok(off({ elements: ['head'] }).some(v => v.includes('"head"') && v.includes('use header')));
  assert.ok(off({ states: ['expanded'] }).some(v => v.includes('use open')));
  assert.ok(off({ states: ['busy'] }).some(v => v.includes('use loading')));
  assert.ok(off({ elements: ['action'] }).some(v => v.includes('use actions')), 'an action part outside SINGLE_ACTION is a slot');
  assert.ok(off({ variants: { status: ['available'] } }).some(v => v.includes('use presence')));
  assert.ok(off({ variants: { status: ['removed'] } }).some(v => v.includes('use change')));
  assert.ok(off({ variants: { side: ['left', 'end'] } }).some(v => v.includes('start / end')));
  assert.ok(off({ variants: { labelPlace: ['top'] } }).some(v => v.includes('kebab case')));
  assert.ok(off({ booleans: ['grey-ground'] }).some(v => v.includes('gray-ground')));
  const prop = (name, type, literals) => ({ A: { props: [{ name, type, literals, owner: 'AProps' }] } });
  assert.ok(off({}, prop('name', 'ReactNode')).some(v => v.includes('use title')), 'a display name');
  assert.deepEqual(off({}, prop('name', 'string')), [], 'a form name');
  assert.ok(off({}, prop('action', 'ReactNode')).some(v => v.includes('use actions')));
  assert.ok(off({}, prop('end', 'ReactNode')).some(v => v.includes('use trailing')));
  assert.ok(off({}, prop('onExpandedChange', '(expanded: boolean) => void')).some(v => v.includes('use open')));
  assert.ok(off({}, prop('status', '(page: number) => ReactNode')).some(v => v.includes('use statusText')));
  assert.ok(off({}, prop('side', 'Side', ['top', 'right'])).some(v => v.includes('start / end')));
  assert.ok(off({}, prop('status', 'Status', ['complete', 'done'])).some(v => v.includes('use complete')));
  const alias = { A: { props: [{ name: 'status', type: 'Status', literals: ['complete', 'done'], aliases: ['done'], owner: 'AProps' }] } };
  assert.deepEqual(off({}, alias), [], 'a deprecated value alias');
  assert.deepEqual(off({}, { A: { props: [{ name: 'lede', type: 'ReactNode', owner: 'AProps', deprecated: true }] } }), [], 'a deprecated prop');
  assert.deepEqual(off({ elements: ['header', 'footer', 'title', 'description', 'actions', 'trailing', 'media', 'icon', 'dismiss'], states: ['open', 'collapsed', 'loading', 'read-only'], variants: { status: ['pending', 'complete'], side: ['top', 'start'] } }), []);
  assert.ok(checkVocabulary({ css: '[data-area-colours="a"] {}' }, vocab({})).some(v => v.includes('data-area-colors')));
});
test('a listed deviation passes, and one that is gone fails', () => {
  const listed = { a: { head: { family: 'a', use: 'header', reason: 'r', migrateIn: 'F8-later' } } };
  assert.deepEqual(checkVocabulary({ manifests: { a: { ...plain, elements: ['head'] } } }, vocab(listed)), []);
  assert.ok(checkVocabulary({ manifests: { a: { ...plain, elements: ['header'] } } }, vocab(listed)).some(v => v.includes('deviation "head" is gone')));
  // A source not given is not checked for staleness (lint:manifest reads no React).
  assert.deepEqual(checkVocabulary({ manifests: {} }, vocab({ A: { end: listed.a.head } })), []);
});
test('every part, state, prop and attribute speaks the vocabulary, or is a listed deviation', () => {
  const css = readFileSync(new URL('../dist/area.css', import.meta.url), 'utf8');
  assert.deepEqual(checkVocabulary({ manifests, react, css }, vocabulary), []);
});
test('each deviation migrates in a plan item that reopens its family', () => {
  const plan = JSON.parse(readFileSync(new URL('../../../docs/research/system-evaluation-2026-11-11/plan.json', import.meta.url), 'utf8'));
  const items = new Map(plan.items.map(item => [item.id, item]));
  const wrong = [];
  for (const list of [vocabulary.ALLOWED_DEVIATIONS, vocabulary.MIGRATIONS]) for (const [owner, names] of Object.entries(list)) for (const [name, entry] of Object.entries(names)) {
    const item = items.get(entry.migrateIn);
    if (!entry.use || !entry.reason) wrong.push(`${owner}.${name}: no use or reason`);
    if (entry.migrateIn === 'F8-later') continue;
    if (!item || !item.families.includes(entry.family)) wrong.push(`${owner}.${name}: ${entry.migrateIn} does not reopen ${entry.family}`);
  }
  assert.deepEqual(wrong, []);
});
