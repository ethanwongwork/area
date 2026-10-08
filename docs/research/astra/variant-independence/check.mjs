import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {parseCSS,split,closeParen} from './css.mjs';
import {root,BASE} from './scan.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const read=n=>fs.readFileSync(path.join(here,n),'utf8');
const matrix=JSON.parse(read('matrix.json'));
const {MANIFESTS}=await import(path.join(root,'packages/styles/dist/modules/manifest.js'));
assert.equal(matrix.startingCommit,BASE);
assert.deepEqual(Object.keys(matrix.families).sort(),Object.keys(MANIFESTS).sort());
let axes=0,values=0,defaultAxes=0;
const counts={'independent':0,'depends on':0,'combination intended by design':0};
for(const [family,m]of Object.entries(MANIFESTS)){
 const result=matrix.families[family];assert.deepEqual(Object.keys(result.axes),Object.keys(m.variants));
 for(const [axis,vs]of Object.entries(m.variants)){
  axes++;const row=result.axes[axis];assert.deepEqual(Object.keys(row.values),vs);
  assert.equal(row.default.manifest,m.defaults[axis]??null);
  assert.ok(row.default.whenDefaultOmitted.cssOnly.length>20);
  if(m.defaults[axis]!==undefined){defaultAxes++;const p=row.default.whenDefaultOmitted.helperProbe;assert.ok(p.implicitClasses.split(' ').includes(m.block+'--'+m.defaults[axis]));assert.ok(p.explicitError.includes('invalid '+axis+'='));}
  for(const value of vs){
   values++;const v=row.values[value];assert.ok(Object.hasOwn(counts,v.classification));counts[v.classification]++;
   assert.ok(v.evidence.length);assert.ok(v.css.ruleIds.length);assert.ok(v.css.standaloneRuleIds.length || (axis==='layout' && ['checkbox','radio'].includes(family)));
   for(const id of [...v.css.ruleIds,...v.css.baseRuleIds])assert.ok(matrix.cssRules[id]);
   for(const id of v.dependencyIds)assert.ok(matrix.dependencies.some(d=>d.id===id));
   assert.ok(v.demoReview.result&&v.specReview.result);
  }
 }
}
assert.equal(axes,matrix.counts.axes);assert.equal(values,matrix.counts.values);assert.equal(defaultAxes,matrix.counts.defaultAxes);assert.deepEqual(counts,matrix.counts.statuses);
const cssFiles=execFileSync('git',['ls-tree','-r','--name-only',BASE,'packages/styles/src'],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(f=>f.endsWith('.css'));
assert.equal(cssFiles.length,matrix.counts.cssFiles);
for(const f of cssFiles)assert.ok(matrix.sourceInventory[f]);
for(const [file,info]of Object.entries(matrix.sourceInventory)){
 const source=execFileSync('git',['show',BASE+':'+file],{cwd:root,encoding:'utf8'});
 assert.equal(createHash('sha256').update(source).digest('hex'),info.sha256);
 assert.equal(fs.readFileSync(path.join(root,file),'utf8'),source,'Source changed: '+file);
}
let evidenceCount=0;
function evidence(o){if(!o||typeof o!=='object')return;
 if(typeof o.file==='string'&&Number.isInteger(o.line)){evidenceCount++;assert.ok(matrix.sourceInventory[o.file],o.file);assert.ok(o.line>0&&o.line<=matrix.sourceInventory[o.file].lines,`${o.file}:${o.line}`);}
 for(const v of Object.values(o))evidence(v);
}evidence(matrix);
// Parser fixtures exercise comments, quoted punctuation, function commas and nested conditions.
const fixture='/* x { ; } */\n@layer x { @media (min-width: 1px) { .a:is(.b,.c), .d:not(.e,.f) { --x: "a;{b}"; width: calc(2px + 3px); } } }';
const parsed=parseCSS(fixture,'fixture');
assert.equal(parsed.declarations.length,2);assert.deepEqual(parsed.rules[2].atRules,['@layer x','@media (min-width: 1px)']);
assert.equal(parsed.declarations[0].value,'"a;{b}"');assert.equal(parsed.declarations[0].line,2);
assert.deepEqual(split('.a:is(.b,.c), .d:not(.e,.f)'),['.a:is(.b,.c)','.d:not(.e,.f)']);
assert.equal(closeParen(':is(a,b)',3),7);assert.throws(()=>parseCSS('.a { color: red;','bad'));
assert.equal(matrix.combinedRules.length,matrix.counts.combinedBranches);
assert.equal(matrix.combinedRules.filter(r=>r.sameAxisConjunction).length,0);
for(const r of matrix.combinedRules){assert.ok(r.refs.length>1);assert.ok(r.reason);assert.ok(r.status==='combination intended by design');}
const cardResponsive=Object.values(matrix.cssRules).filter(r=>r.atRules.some(a=>a.startsWith('@media'))&&r.refs.some(x=>x.family==='card'));
assert.ok(cardResponsive.length,'Responsive context must survive scan');
const kbdNot=matrix.negativeContexts.find(r=>r.evidence.file.endsWith('/kbd.css')&&r.selector.includes(':not(')&&r.negativeRefs?.some(x=>x.family==='button'&&x.value==='neutral'));
assert.ok(kbdNot.negativeRefs.some(r=>r.family==='button'&&r.value==='neutral'));
assert.ok(!matrix.combinedRules.some(r=>r.evidence.file.endsWith('/kbd.css')&&r.selector.includes(':not(')&&r.negativeRefs?.some(x=>x.family==='button'&&x.value==='neutral')));
assert.ok(matrix.dependencies.some(d=>d.family==='menu'&&d.targetFamily==='switch'&&d.kind==='literal CSS class'));
assert.ok(matrix.dependencies.some(d=>d.family==='button'&&d.targetFamily==='spinner'&&d.kind==='literal CSS class'));
// Independently compare the Markdown family table, not just generator totals.
const md=read('README.md');let tableValues=0;
for(const [family,f] of Object.entries(matrix.families)){
 const n=Object.values(f.axes).flatMap(a=>Object.values(a.values));
 const expected=[family,Object.keys(f.axes).length,n.length,...Object.keys(counts).map(k=>n.filter(v=>v.classification===k).length)].join(' | ');
 assert.ok(md.includes('| '+expected+' |'),family+' count row missing');tableValues+=n.length;
 for(const axis of Object.keys(f.axes))assert.ok(md.includes('| '+family+'.'+axis+' |'),'Default row missing');
}assert.equal(tableValues,values);
assert.ok(md.includes(`${matrix.counts.families} families, ${axes} named axes and ${values} named values`));
assert.ok(md.includes('[matrix.json](./matrix.json)'));
for(const family of ['checkbox','radio']) for(const value of ['row','tile']) {
 const row=matrix.families[family].axes.layout.values[value];
 assert.equal(row.classification,'depends on');
 assert.ok(row.dependencyIds.some(id=>matrix.dependencies.some(d=>d.id===id&&d.kind==='layout prerequisite'&&d.targetValues.includes('card'))));
}
for(let i=1;i<matrix.dependencyGroups.length;i++)assert.ok(matrix.dependencyGroups[i-1].families.length>=matrix.dependencyGroups[i].families.length);
const before=Object.fromEntries(['matrix.json','README.md'].map(f=>[f,read(f)]));
execFileSync(process.execPath,[path.join(here,'audit.mjs')],{cwd:root,stdio:'pipe'});
for(const [f,bytes]of Object.entries(before))assert.equal(read(f),bytes,f+' is not deterministic');
execFileSync('git',['diff','--check'],{cwd:root,stdio:'pipe'});
console.log(JSON.stringify({passed:true,families:Object.keys(MANIFESTS).length,axes,values,defaultAxes,cssFiles:cssFiles.length,evidenceCoordinates:evidenceCount,secondRunIdentical:true}));
