import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {HERE,SHA,REVIEW,read,registry} from './snapshot.mjs';
import {axisDefinition,bounds,seeds,roleSeeds,resolve,roles,resolveThemeMaterial} from './model.mjs';
const material=axisDefinition();
assert.deepEqual(registry.checkAxisIntegrity([...registry.AXES,material]),[]);
const bad={...material,namespaces:['--area-shadow-']};
assert(registry.checkAxisIntegrity([...registry.AXES,bad]).some(x=>x.kind==='namespace'));
// Run the actual pinned registry on the proposal, not a hand-written prefix list.
function out(name,value){const s=JSON.stringify(value,null,2)+'\n';assert(Buffer.byteLength(s)<1e6);const p=path.join(HERE,name);if(process.argv.includes('--check'))assert.equal(fs.readFileSync(p,'utf8'),s,name);else fs.writeFileSync(p,s);}
out('axis.json',material);
out('controls.json',{status:'proposal seeds; not calibrated limits or approved material recipes',bounds,seeds,roles,roleSeeds,colorSources:['neutral','accent','info','success','warning','caution','danger','discovery']});
out('namespace-audit.json',{areaCommit:SHA,existing:registry.AXES.map(({id,namespaces})=>({id,namespaces})),proposed:material.namespaces,newSurfaceNamespace:'--area-surface-part-',derivedOnly:['--area-material-paint-'],problems:registry.checkAxisIntegrity([...registry.AXES,material]),negativeControl:'broad --area-shadow- rejected'});
const surface=registry.AXES.find(a=>a.id==='surface');
assert.deepEqual(registry.checkAxisIntegrity([...registry.AXES.filter(a=>a.id!=='surface'),{...surface,namespaces:[...surface.namespaces,'--area-surface-part-','--area-shadow-tooltip:','--area-shadow-toolbar:']},material]),[]);
function topSplit(s,separator){let depth=0,start=0,a=[];for(let i=0;i<s.length;i++){if(s[i]==='(')depth++;if(s[i]===')')depth--;if(depth===0&&separator(s[i])){if(i>start)a.push(s.slice(start,i).trim());start=i+1;}}if(start<s.length)a.push(s.slice(start).trim());return a;}
function split(shadow,id){if(shadow==='none')return {parts:[],tokens:{},composed:'none'};const tokens={};const parts=topSplit(shadow,c=>c===',').map((s,i)=>{
 const a=topSplit(s,c=>/\s/.test(c));const inset=a[0]==='inset';if(inset)a.shift();
 const nums=[];while(a.length&&/^(-?(?:\d*\.)?\d+)(px)?$/.test(a[0]))nums.push(a.shift());
 if(nums.length===3&&/^var\(--area-(stroke|border)-width\)$/.test(a[0]))nums.push(a.shift());
 assert(nums.length>=2&&nums.length<=4,s);const color=a.join(' ');assert(color,s);
 const values={x:nums[0],y:nums[1],blur:nums[2]??'0px',spread:nums[3]??'0px',color};
 for(const [k,v]of Object.entries(values))tokens[`--area-surface-part-${id}-${i+1}-${k}`]=v;
 return {inset,...values,css:(inset?'inset ':'')+Object.keys(values).map(k=>`var(--area-surface-part-${id}-${i+1}-${k})`).join(' ')};
 });return {parts,tokens,composed:parts.map(p=>p.css).join(', ')};}
const tooltip=read('packages/styles/src/components/surface.css').split('\n').find(s=>s.includes('box-shadow: 0 4px 12px -2px')).split('box-shadow: ')[1].split(';')[0];
const toolbar=read('packages/styles/src/components/toolbar.css').split('\n').find(s=>s.includes('--_toolbar-shadow: inset')).split('--_toolbar-shadow: ')[1].split(';')[0];
const shadows=[];
for(const p of surface.presets)for(const [id,raw]of [...Object.entries(p.tokens).filter(([k])=>k.startsWith('--area-shadow-')).map(([k,v])=>[k.slice(14),v]),['tooltip',tooltip],['toolbar',toolbar]])shadows.push({surface:p.id,id,original:raw,borderWidth:p.tokens['--area-border-width'],...split(raw,id)});
out('surface-parts.json',{areaCommit:SHA,policy:'Tooltip and Toolbar retain their original recipes even under Flat in the identity migration.',shadows});
const dormant=Object.assign({},...shadows.filter(x=>x.surface==='outlined').map(x=>x.tokens));
const proposedSurface={...surface,namespaces:[...surface.namespaces,'--area-surface-part-','--area-shadow-tooltip:','--area-shadow-toolbar:'],presets:surface.presets.map(p=>({...p,tokens:{...dormant,...p.tokens,...Object.assign({},...shadows.filter(x=>x.surface===p.id).map(x=>({...x.tokens,['--area-shadow-'+x.id]:x.composed})))}}))};
assert.deepEqual(registry.checkAxisIntegrity([...registry.AXES.filter(a=>a.id!=='surface'),proposedSurface,material]),[]);
out('surface-axis-proposal.json',proposedSurface);
const n=resolve(),t=resolve(n,{preset:'tactile',controls:{gloss:.9}}),g=resolve(t,{preset:'glass'}),inherit=resolve(g,{controls:{'glass.radius':22}}),reset=resolve(inherit,{preset:'glass'});
assert.equal(g.controls.gloss,.45);assert.equal(inherit.controls['glass.radius'],22);assert.equal(reset.controls['glass.radius'],12);assert.deepEqual(resolve(g,{preset:'none'}),n);
assert.deepEqual(resolve(structuredClone(inherit)),inherit); // serialized context remount model, NOT a React portal test.
for(const patch of [{controls:{gloss:NaN}},{controls:{lightAngle:361}},{controls:{'glass.refraction':.1}},{colorSource:'#fff'},{roles:{text:3}}])assert.throws(()=>resolve(g,patch));
assert.equal(resolveThemeMaterial(g,{material:'tactile'},{for:'glass',glass:{radius:60}}).discarded,true);
assert.equal(resolveThemeMaterial(g,{material:'tactile'},{for:'glass',glass:{radius:60}}).state.controls['glass.radius'],0);
assert.equal(resolveThemeMaterial(inherit,undefined,'preset').state.controls['glass.radius'],12);
out('resolver-results.json',{checks:['root None','explicit preset resets parent controls','omission inherits','same preset explicit resets','nested None clears overrides','serialized scope remount retains resolved controls','NaN/range/deferred/color/role rejection','stale for-tag patch discarded on preset change','preset sentinel clears local/inherited control overrides'],scopeChain:[n,t,g,inherit,reset],reactPortalExecuted:false});
// Ledger every requested axis source and both emitters, without copying source files.
const files=[...new Set([...registry.AXES.flatMap(()=>[]),'packages/tokens/src/axes/schema.ts','packages/tokens/src/axes/registry.ts','packages/tokens/src/axes/registry.test.ts','packages/tokens/src/axes/color.ts','packages/tokens/src/axes/emphasis.ts','packages/tokens/src/axes/density.ts','packages/tokens/src/axes/type-size.ts','packages/tokens/src/axes/type-size.test.ts','packages/tokens/src/axes/typography.ts','packages/tokens/src/axes/ui-scale.ts','packages/tokens/src/axes/pills.ts','packages/tokens/src/axes/radius.ts','packages/tokens/src/axes/surface.ts','packages/tokens/src/axes/motion.ts','packages/tokens/src/emit/base.ts','packages/tokens/src/emit/css.ts','packages/react/src/components/Theme.tsx','docs/THEMING.md'])];
out('source-ledger.json',{areaCommit:SHA,reviewCommit:REVIEW,files:files.map(file=>{const s=read(file);return{file,lines:s.split('\n').length-1,sha256:crypto.createHash('sha256').update(s).digest('hex')};})});
console.log(`PASS: actual pinned registry accepts Material; ${shadows.length} Surface recipes decomposed; reset/bounds model passes.`);
