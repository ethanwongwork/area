import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {scan, root, BASE, ev, unique} from './scan.mjs';
import {conditions,specAliases,combinedReasons,fallback,implicitDefaults,reviewNotes} from './review.mjs';
const out=path.dirname(fileURLToPath(import.meta.url));
const data=await scan(), {manifests:ms}=data;
const {classesFor}=await import(path.join(root,'packages/react/dist/modules/variants.js'));
const kebab=s=>s.replace(/[A-Z]/g,c=>'-'+c.toLowerCase());
const same=(r,f,a,v)=>r.family===f&&r.axis===a&&r.value===v;
const helperEvidence=[ev('packages/react/src/variants.ts',23),ev('packages/react/src/variants.ts',32),ev('packages/react/src/variants.ts',34)];
const rootTags=new Set(Object.keys(ms).map(k=>k[0].toUpperCase()+k.slice(1)).concat(['DraftInput','ButtonLink','ChipLink','AnchoredPopover','AnchoredTooltip','AnchoredMenu']));
const deps=[];
function addDependency(owner,target,axis,values,kind,evidence,extra={}){
 if(!values.length)return;
 deps.push({id:`dep-${deps.length+1}`,family:owner,targetFamily:target,targetAxis:axis,targetValues:unique(values),kind,condition:conditions[owner+':'+target]??'When this built-in child/part renders.',evidence,fix:'Generate a retained child-part contract (or a private base part) and rewrite this call/default. Reject unsupported caller choices early; do not silently keep an excluded public variant.',...extra});
}
function childAxes(owner,target,attrs,evidence,extra={}){
 for(const [axis,values] of Object.entries(ms[target].variants)){
  const attr=attrs.find(a=>a.name===axis),def=ms[target].defaults[axis];
  if(attr?.literal&&values.includes(attr.literal))addDependency(owner,target,axis,[attr.literal],'explicit literal',[attr.evidence],extra);
  else if(attr){
   const own=ms[owner].variants[axis],forward=own&&values.some(v=>own.includes(v))&&(attr.expression===axis||(owner==='input'&&attr.expression==='spinnerSize'));
   addDependency(owner,target,axis,forward?own.filter(v=>values.includes(v)):values,'forwarded/inferred',[attr.evidence],{...extra,expression:attr.expression,...(forward?{sourceAxis:axis,mapping:Object.fromEntries(own.filter(v=>values.includes(v)).map(v=>[v,v]))}:{borrowedPublicAxis:true}),defaultIfUnspecified:def??null});
  }else if(def!==undefined)addDependency(owner,target,axis,[def],'implicit child default',[evidence,ms[target].defaultEvidence],extra);
 }
}
for(const f of data.react)for(const j of f.jsx){
 const owner=j.owner?.family;if(!owner||owner===j.target||!rootTags.has(j.tag))continue;
 const extra={callSite:j.evidence,tag:j.tag};
 if(owner==='indicator'&&j.target==='presence')extra.nonManifestBranch=true;
 if(owner==='promptSuggestions')extra.appliesWhen={layout:[j.evidence.line===33?'chips':'list']};
 if(owner==='calendar')extra.appliesWhen={layout:[j.evidence.line<225?'week':'month']};
 childAxes(owner,j.target,j.attrs,j.evidence,extra);
}
for(const f of data.react)for(const c of f.literalClasses){if(c.owner?.family&&c.owner.family!==c.family&&c.kind==='axis')addDependency(c.owner.family,c.family,c.axis,[c.value],'literal CSS class',[c.evidence],{condition:c.owner.family==='button'?'Only while loading. The raw md class requests space-16 sizing; removal leaves the icon-md base sizing. No helper validation occurs.':'MenuItem checked switch indicator only; no helper validation occurs. Removing Switch sm CSS leaves larger base geometry.',removalEffect:c.owner.family==='button'?'Stale emitted class; base icon-md supplies a fallback rather than throwing. Equality with space-16 is not assumed across custom themes.':'Size-specific paint/geometry is lost; base Switch remains.'});}
// Calls that build another family's classes without a JSX root.
for(const f of data.react)for(const c of f.calls){const owner=c.owner?.family,target=c.helper.replace(/Variants$/,'');if(owner&&ms[target]&&target!==owner){
 childAxes(owner,target,c.args,c.evidence,{tag:c.helper,callSite:c.evidence});
}}
// The helper receives a literal fallback in HoverCard, not the Popover default.
for(const d of deps.filter(d=>d.family==='hoverCard'&&d.targetAxis==='side')){
 d.kind='caller fallback / forwarded';d.targetValues=ms.popover.variants.side;d.defaultIfUnspecified='bottom';d.evidence.push(ev('packages/react/src/components/HoverCard.tsx',21));
}
for (const family of ['checkbox','radio']) {
 const file='packages/react/src/components/forms.tsx';
 const line=fs.readFileSync(path.join(root,file),'utf8').split('\n').findIndex(l=>l.includes(family+'Variants({ variant, layout:'))+1;
 addDependency(family,family,'variant',['card'],'layout prerequisite',[ev(file,line)],{appliesToAxis:'layout',condition:'Layout row/tile is forwarded only when variant=card; otherwise React suppresses layout.',fix:'Expose layout only for card, and retain card whenever a layout option is enabled.'});
}
const combined=data.css.filter(r=>r.refs.length>1).map(r=>{
 const name=path.basename(r.evidence.file),reason=combinedReasons[name];if(!reason)throw Error('Unreviewed combined selector '+r.id);
 const only=r.declarations.filter(d=>!data.css.some(o=>o.id!==r.id&&o.refs.length<=1&&o.families.some(f=>r.families.includes(f))&&o.declarations.some(x=>x.property===d.property&&x.value===d.value))).map(d=>({property:d.property,value:d.value,evidence:d.evidence}));
 return {...r,status:'combination intended by design',reason,sameAxisConjunction:r.refs.some((a,i)=>r.refs.some((b,j)=>i!==j&&a.kind==='axis'&&b.kind==='axis'&&a.family===b.family&&a.axis===b.axis)),declarationsOnlyInCombinedRules:only};
});
const explicitDefaults=data.react.flatMap(f=>f.assignments).filter(a=>a.owner?.family&&a.kind==='binding-default'&&Object.hasOwn(ms[a.owner.family].variants,a.name));
const extraDefaultEvidence={
 'alert.layout':[ev('packages/react/src/components/primitives.tsx',169)],
 'indicator.kind':[ev('packages/react/src/components/Indicator.tsx',27)],
 'field.orientation':[ev('packages/react/src/components/Field.tsx',114)],
 'kbd.appearance':[ev('packages/react/src/components/primitives.tsx',1817)],
};
const families={};
const allSpecs=data.specs.map(s=>s.file),allDemos=data.demos.map(d=>d.file);
function specFor(f){const primary=`docs/specs/${specAliases[f]??kebab(f)}.md`;return data.specs.filter(s=>s.file===primary);}
function applies(d,axis,value){if(d.appliesToAxis&&d.appliesToAxis!==axis)return false;if(d.nonManifestBranch)return false;if(d.appliesWhen?.[axis]&&!d.appliesWhen[axis].includes(value))return false;return true;}
function depLabel(d,a,v){const values=d.sourceAxis===a?[d.mapping[v]].filter(Boolean):d.targetValues;return `${d.targetFamily}.${d.targetAxis}=${values.join('|')}`;}
function cssFallback(f,a,def){
 if(fallback[f+'.'+a])return fallback[f+'.'+a];
 if(a==='size')return 'Removing this default modifier leaves the family base metrics and any parent composition overrides. It does not select another size. The exact retained base declarations and removed size rules are listed below.';
 if(a==='tone')return 'The family base palette remains; removing the default tone selector does not select another tone. Other axes and state rules continue consuming the base private color variables. Exact base declarations and removed rules are listed below.';
 if(a==='variant'&&['input','numberField','inputGroup','textarea','select'].includes(f))return 'The base outlined field paint and geometry remain. Removing outline CSS alone does not select soft; other size/state rules remain.';
 if(f==='badge'&&a==='variant')return 'Base soft surface and tone-foreground paint remain; the explicit soft modifier is redundant for that baseline.';
 throw Error('Missing omission review '+f+'.'+a+'='+def);
}
for(const [family,m]of Object.entries(ms)){
 const familyCSS=data.css.filter(r=>r.families.includes(family)),bases=familyCSS.filter(r=>r.expanded==='.'+m.block);
 const ownCalls=data.react.flatMap(f=>f.calls).filter(c=>c.owner?.family===family);
 const functions=data.react.flatMap(f=>f.functions).filter(c=>c.family===family);
 const spec=specFor(family),demoNodes=data.demos.flatMap(d=>d.jsx).filter(j=>j.target===family);
 const baseIds=bases.map(r=>r.id);
 const specE=spec.flatMap(s=>s.lines.filter(l=>/^\|/.test(l.text)&&/variant|tone|size|layout|orientation|ground|appearance|kind|overflow|track|days|side|shape|selection|status|placement/i.test(l.text)).map(l=>ev(s.file,l.line,l.text)));
 const axes={};
 for(const[axis,values]of Object.entries(m.variants)){
  const def=m.defaults[axis],implicit=implicitDefaults[family+'.'+axis];
  if(def===undefined&&!implicit)throw Error('Unreviewed implicit default '+family+'.'+axis);
  const assignments=explicitDefaults.filter(a=>a.owner.family===family&&a.name===axis);
  const ownDefaultRules=familyCSS.filter(r=>r.refs.some(x=>same(x,family,axis,def)));
  let probe=null;
  if(def!==undefined){const pruned={...m,variants:{...m.variants,[axis]:values.filter(v=>v!==def)}};let explicitError;try{classesFor(pruned,{[axis]:def});throw Error('Expected RangeError');}catch(e){if(!(e instanceof RangeError))throw e;explicitError=e.message;}
   probe={implicitClasses:classesFor(pruned,{}),explicitError};
  }
  const metrics=bases.filter(r=>r.atRules.every(a=>a.startsWith('@layer'))).flatMap(r=>r.declarations).filter(d=>axis==='size'?/size|height|inset|cell|text|leading|font|gutter|icon|--_h$|--_min$/.test(d.property):false).slice(0,6);const cssOnly=(def!==undefined?cssFallback(family,axis,def):implicit.note)+(metrics.length?' Base metrics: '+metrics.map(d=>d.property+' = '+d.value).join('; ')+'.':'');
  const defaultInfo={manifest: def??null,effective:implicit?.value??def,evidence:[m.defaultEvidence,...assignments.map(a=>a.evidence),...(extraDefaultEvidence[family+'.'+axis]??[])],reactAssignments:assignments.map(a=>({owner:a.owner.name,expression:a.expression,evidence:a.evidence})),whenDefaultOmitted:{cssOnly,removedRuleIds:ownDefaultRules.map(r=>r.id),retainedBaseRuleIds:baseIds,manifestValuesOnly:probe?'The helper emits the removed default for an omitted/undefined prop. An explicit removed value throws RangeError. Literal React defaults and inferred values reach the explicit path. Keeping only CSS pruning avoids the throw but leaves stale classes.':'No manifest default to remove. '+implicit.note,atomicRemoval:'Choose a retained default (or an intentional unmodified base) and rewrite manifest defaults, React fallback/derived branches, types, child contracts and demos together. None of the current code automatically chooses the next allowed value.',helperProbe:probe,helperEvidence}};
  const entries={};
  for(const value of values){
   const rules=familyCSS.filter(r=>r.refs.some(x=>same(x,family,axis,value))),standalone=rules.filter(r=>r.refs.length===1),combo=combined.filter(r=>r.refs.some(x=>same(x,family,axis,value)));
   const relevantDeps=deps.filter(d=>d.family===family&&applies(d,axis,value));
   const needed=unique(relevantDeps.map(d=>depLabel(d,axis,value)));
   const directDemo=demoNodes.filter(j=>j.attrs.some(a=>a.name===axis&&(a.literal===value||a.expression===axis)));
   const exactSpec=spec.flatMap(s=>s.lines.filter(l=>l.text.includes(value)&&(/variant|tone|size|default|layout|kind|shape|ground|appearance|status|side|\|/i.test(l.text))).map(l=>ev(s.file,l.line,l.text)));
   const cssStatus=combo.length?'combination intended by design':'independent';
   const status=needed.length?'depends on '+needed.join('; '):cssStatus;
   const propertiesOnlyCombined=unique(combo.flatMap(r=>r.declarations.map(d=>d.property))).filter(p=>!standalone.some(r=>r.declarations.some(d=>d.property===p)));
   entries[value]={status,classification:needed.length?'depends on':cssStatus,reason:needed.length?'This value can render a built-in child/part whose current implementation requests the listed values. Conditions, forwarded-value mappings and optional branches are on the dependency records. Same-family layout prerequisites and cross-family composition dependencies are distinguished by kind and condition.':combo.length?'Standalone/base CSS exists; the listed intersections adjust paint or geometry only when both choices are present. No other named value is required for this value to exist.':'Standalone selector/base behavior exists and the reviewed implementation contains no mandatory other named variant for this value. This is a source-level result, not a browser deletion test.',evidence:[m.axisEvidence[axis],...rules.map(r=>r.evidence),...ownCalls.map(c=>c.evidence),...functions.filter(f=>f.name.toLowerCase()===family.toLowerCase()).map(f=>f.evidence)],css:{status:cssStatus,ruleIds:rules.map(r=>r.id),standaloneRuleIds:standalone.map(r=>r.id),baseRuleIds:baseIds,combinedRuleIds:combo.map(r=>r.id),emptyModifier:standalone.every(r=>!r.declarations.length),propertiesAuthoredOnlyInCombinationForThisValue:propertiesOnlyCombined},dependencyIds:relevantDeps.map(d=>d.id),reactReview:{helperEvidence:ownCalls.map(c=>c.evidence),relatedNotes:reviewNotes.filter(n=>n.families.includes(family)).map(n=>n.id)},demoReview:{evidence:directDemo.map(j=>j.evidence),result:directDemo.length?'Explicit or forwarded occurrence; co-occurrence alone is not classified as a dependency.':'No direct literal/axis-forwarded JSX occurrence found; wrappers/defaults may cover it. Entire demos corpus searched.',searchedFiles:directDemo.length?undefined:allDemos},specReview:{evidence:exactSpec.length?exactSpec.slice(0,4):specE.slice(0,3),result:exactSpec.length?'Value mentioned in family spec; dependency interpretations are in reviewedNotes.':'Exact value mention not found in the mapped family spec; manifest/CSS are authoritative for coverage.',searchedFiles:spec.length?spec.map(s=>s.file):allSpecs}};
  }
  axes[axis]={evidence:m.axisEvidence[axis],default:defaultInfo,values:entries};
 }
 families[family]={block:m.block,status:deps.some(d=>d.family===family)?'has conditional composition dependencies':combined.some(r=>r.families.includes(family))?'combination intended by design':'independent',manifestEvidence:m.evidence,axes,dependencyIds:deps.filter(d=>d.family===family).map(d=>d.id),baseRuleIds:baseIds,cssFiles:unique(familyCSS.map(r=>r.evidence.file)),reactEvidence:functions.map(f=>f.evidence),specEvidence:specE.length?specE:spec.map(s=>ev(s.file,1)),specSearch:spec.length?spec.map(s=>s.file):allSpecs,demoEvidence:demoNodes.map(j=>j.evidence),axisless:Object.keys(axes).length===0,notes:reviewNotes.filter(n=>n.families.includes(family)).map(n=>n.id)};
}
const demoPairs=data.demos.flatMap(f=>f.jsx.flatMap(j=>{
 const attrs=j.attrs.filter(a=>ms[j.target].variants[a.name]&&a.literal);
 const pair=attrs.length>1?[{kind:'same-element independent axes',family:j.target,choices:attrs.map(a=>({axis:a.name,value:a.literal})),evidence:j.evidence}]:[];
 if(j.ancestors.length&&attrs.length)pair.push({kind:'nested child choices',family:j.target,choices:attrs.map(a=>({axis:a.name,value:a.literal})),ancestors:j.ancestors,evidence:j.evidence});return pair;
}));
const reviewedNotes=reviewNotes.map(({refs,...n})=>({...n,evidence:refs.map(([f,l])=>ev(f,l))}));
const defaultFamilies=Object.keys(families).filter(f=>Object.values(families[f].axes).some(a=>a.default.manifest!==null));
const childGroups=Object.entries(Object.groupBy(deps,d=>d.kind==='layout prerequisite'?'card-layout':d.targetFamily)).map(([target,ds])=>({id:'child-'+target,title:target==='card-layout'?'Card-only layout prerequisite':`Built-in ${target} values/defaults`,families:unique(ds.map(d=>d.family)),dependencyIds:ds.map(d=>d.id),evidence:ds.map(d=>d.evidence[0]),fix:'Give internal parts a generated, retained-value contract, or private paint/geometry independent of optional public values. Rewrite literal props and validate forwarded values/defaults.'}));
const groups=[{id:'defaults',title:'Manifest default survives allowed-value removal',families:defaultFamilies,evidence:helperEvidence,fix:'Prune variants and defaults atomically. Choose a retained value or explicit base; rewrite React defaults and derived branches. Validate defaults as well as caller props.'},...childGroups,...reviewedNotes.map(n=>({id:n.id,title:n.kind+': '+n.id,families:n.families,evidence:n.evidence,fix:n.fix}))].sort((a,b)=>b.families.length-a.families.length||a.id.localeCompare(b.id));
const allValues=Object.values(families).flatMap(f=>Object.values(f.axes).flatMap(a=>Object.values(a.values)));
const counts={families:Object.keys(families).length,axes:Object.values(families).reduce((n,f)=>n+Object.keys(f.axes).length,0),values:allValues.length,axislessFamilies:Object.values(families).filter(f=>f.axisless).length,statuses:Object.fromEntries(['independent','depends on','combination intended by design'].map(k=>[k,allValues.filter(v=>v.classification===k).length])),cssFiles:Object.keys(data.files).filter(f=>f.endsWith('.css')).length,sourceFiles:Object.keys(data.files).length,combinedBranches:combined.length,sameAxisConjunctions:combined.filter(r=>r.sameAxisConjunction).length,childDependencyRecords:deps.length,familiesWithChildDependencies:unique(deps.map(d=>d.family)).length,defaultAxes:Object.values(families).flatMap(f=>Object.values(f.axes)).filter(a=>a.default.manifest!==null).length,defaultFamilies:defaultFamilies.length,demoCompositions:demoPairs.length};
const matrix={schemaVersion:1,startingCommit:BASE,sourceLinkTemplate:`https://github.com/ethanwongwork/area/blob/${BASE}/{file}#L{line}`,scope:'All entries and named values in manifest. Booleans, element modifiers and states are examined when they intersect named values; they are not additional named-axis value rows. Source-level deletion review; no modified-component browser render is claimed.',method:{css:'Balanced CSS scanner; comma alternatives and :is/:where branches expanded; :not references are exclusions, not prerequisites. At-rule ancestry retained. CSS evidence includes original selectors.',react:'TypeScript AST inventory plus reviewed derivations, literal defaults and cross-family class-helper calls. Child dependency is conditional on the documented branch. Forwarded public axes outside parent manifest are marked borrowedPublicAxis.',demos:'All demo TS/TSX searched; literal same-element and nested combinations indexed. Wrapper/default-only coverage is marked not found when a direct occurrence cannot be established.',specs:'All spec files scanned; family maps include shared specs. Mentions support review, not a claim that all co-occurring values are inseparable.',defaults:'Two distinct counterfactuals: prune CSS only, or remove the default from allowed values while leaving code/defaults unchanged. classesFor probes use built dist on cloned manifests; authored CSS fallback is not a computed-style snapshot.'},counts,sourceInventory:data.files,families,dependencies:deps,combinedRules:combined,negativeContexts:data.css.filter(r=>r.negativeRefs.length).map(r=>({id:r.id,evidence:r.evidence,selector:r.selector,negativeRefs:r.negativeRefs,reason:'Negated values are exclusions, not positive dependencies; preserve remaining selector semantics when pruning.'})),cssRules:Object.fromEntries(data.css.map(r=>[r.id,{selector:r.selector,expanded:r.expanded,atRules:r.atRules,refs:r.refs,evidence:r.evidence,declarations:r.declarations}])),literalReactClasses:data.react.flatMap(f=>f.literalClasses),reactDerivations:data.react.flatMap(f=>f.assignments).filter(a=>a.owner?.family),reactHelperCalls:data.react.flatMap(f=>f.calls).filter(c=>c.owner?.family),demoCompositions:demoPairs,reviewedNotes,dependencyGroups:groups};
// Evidence shares one pinned commit in the document, avoiding duplicated URLs/large JSX excerpts.
function compact(k,v){if(k==='commit'||k==='url')return undefined;if(k==='excerpt')return undefined;return v;}
fs.writeFileSync(path.join(out,'matrix.json'),JSON.stringify(matrix,compact,2)+'\n');
const link=e=>`[${e.file}:${e.line}](https://github.com/ethanwongwork/area/blob/${BASE}/${e.file}#L${e.line})`;
const links=es=>unique(es.map(link)).join(', ');
const escape=s=>String(s).replaceAll('|','\\|').replaceAll('\n',' ');
const lines=[`# Variant independence audit`,``,`Snapshot of commit: \`${BASE}\` (the fetched \`origin/main\` used to create \`astra/variant-independence\`). All file:line evidence and links refer to this commit.`,
``,`## Result`,``,`${counts.families} families, ${counts.axes} named axes and ${counts.values} named values are covered. ${counts.axislessFamilies} families have no named axes and are still included. All ${counts.cssFiles} CSS files and ${counts.sourceFiles} source files in the recorded inventory were scanned.`,
``,`${counts.statuses.independent} values are independent; ${counts.statuses['depends on']} have conditional prerequisites or child/part dependencies; ${counts.statuses['combination intended by design']} have intentional CSS combinations and no recorded child dependency. These mutually exclusive totals count value rows, not distinct defects. See [matrix.json](./matrix.json) → \`counts\` and \`families\`.`,
``,`${counts.combinedBranches} expanded selector branches combine positive manifest choices (including booleans/element modifiers); ${counts.sameAxisConjunctions} require two named sibling values on the same axis. Checkbox/Radio layout values require variant=card; other named values have standalone selectors or documented base behavior. The combined rules are intentional contrast/layout adjustments, not proof that one sibling variant needs another. The retained component can nevertheless depend on another family's public values through composition. Evidence is in \`combinedRules\` and the per-value \`css\` objects.`,
``,`${counts.familiesWithChildDependencies} families have ${counts.childDependencyRecords} direct child-axis dependency records, including forwarded choices, current child defaults and optional branches. Records are per call site/axis, not unique bugs; transitive consequences can be followed through the target family. A depends-on status means a supported branch can request those values, not that every render requires every value.`,
``,`## Scope and interpretation`,``,
`- The required matrix is \`families → axes → values\`. Each value includes a status, source evidence, CSS rule IDs, React evidence, demo/spec findings and dependency IDs. Axis defaults include the CSS-only outcome and the allowed-values-only outcome.`,
`- Independence is about omitting another value. Shared base CSS/tokens remain necessary. Empty default marker rules (Calendar square/month, Switch short, Chip filter) do not depend on a sibling value; deleting their base rules would be a different operation.`,
`- Positive \`:is()\` alternatives are split; selector commas mean OR. Negated classes are not prerequisites. At-rules and responsive conditions are preserved. \`declarationsOnlyInCombinedRules\` lists exact property/value pairs seen only in intersections; per-value \`propertiesAuthoredOnlyInCombinationForThisValue\` also catches context-only paint/geometry. Neither field means the whole value is unavailable alone.`,
`- CSS-only omission notes are source-level cascade consequences with exact base/removed rule IDs. No browser rendering of pruned builds was performed. Runtime state, caller content, theming and conditional rules can change computed pixels.`,
`- Demos are examples, not allowed-combination schemas. \`demoCompositions\` indexes ${counts.demoCompositions} explicit combinations; wrapper/default-only occurrences are reported as not found where appropriate. Specs are historical records; manifest and current implementation define the audited inventory.`,
`- Manifest booleans, states and element modifiers are retained as evidence for intersections. The DONE denominator is the named \`variants\` axes; this is not an exhaustive independent status list for every runtime state or composition prop.`,
``,`## Dependencies and proposed fixes — largest reach first`,``,`Counts below are distinct originating families per group. Groups overlap; do not add their counts. Full call sites and conditions are linked in matrix.json below.`,``,`| Families affected | Dependency / contract | Families | Proposed fix | Evidence |`,`| ---: | --- | --- | --- | --- |`,
...groups.map(g=>`| ${g.families.length} | ${escape(g.title)} | ${g.families.join(', ')} | ${escape(g.fix)} | ${unique(g.evidence.map(link)).slice(0,3).join(', ')} |`),
``,`Full per-call-site dependency records, values, conditions and evidence are in [matrix.json](./matrix.json) → dependencies. The table above has one row per cause. Checkbox and Radio layout row/tile apply only with variant=card; React suppresses layout otherwise.`,``,
``,`## Reviewed React, gallery and spec combinations`,``,
...reviewedNotes.flatMap(n=>[`### ${n.id}`,``,n.text,``,`Proposed fix: ${n.fix}`,``,links(n.evidence),``]),
`## Combined CSS rules`,``,`All are classified as combination intended by design. Exact declarations and context-only paint/geometry are in \`combinedRules\`.`,``,`| Selector branch | Why the combination exists | Evidence |`,`| --- | --- | --- |`,
...combined.map(r=>`| ${escape(r.expanded)} | ${escape(r.reason)} | ${link(r.evidence)} |`),
``,`## Defaults and omission outcomes`,``,
`${counts.defaultAxes} axes across ${counts.defaultFamilies} families have manifest defaults. The helper validates explicit props first, then merges defaults without validating them. The audit probes cloned manifests after removing each default: omitted props still produce the excluded class; explicitly requesting it throws RangeError. This is a shared helper result, not a claim that every component calls the helper in the same way. Kbd/Code/Token construct classes manually. ${links(helperEvidence)}`,``,
`React defaults can also override a newly chosen manifest default (for example Calendar month, Chip filter, Tabs md, AnchoredPopover bottom). Each axis records these assignments or relevant derivation evidence. The table's CSS-only column assumes the original React/default code remains; the JSON gives exact removed rules and retained base rules. No replacement value is selected automatically.`,``,`| Family.axis | Manifest default | Effective default / baseline | If default CSS is excluded | Evidence |`,`| --- | --- | --- | --- | --- |`,
...Object.entries(families).flatMap(([f,info])=>Object.entries(info.axes).map(([a,row])=>`| ${f}.${a} | ${row.default.manifest??'none'} | ${escape(row.default.effective)} | ${escape(row.default.whenDefaultOmitted.cssOnly)} | ${links([row.evidence,...row.default.evidence,...info.baseRuleIds.slice(0,1).map(id=>matrix.cssRules[id].evidence)])} |`)),
``,`## Coverage by family`,``,`| Family | Axes | Values | Independent | Depends on | Intended combination | Evidence |`,`| --- | ---: | ---: | ---: | ---: | ---: | --- |`,
...Object.entries(families).map(([f,info])=>{const vs=Object.values(info.axes).flatMap(a=>Object.values(a.values));return `| ${f} | ${Object.keys(info.axes).length} | ${vs.length} | ${vs.filter(v=>v.classification==='independent').length} | ${vs.filter(v=>v.classification==='depends on').length} | ${vs.filter(v=>v.classification==='combination intended by design').length} | ${link(info.manifestEvidence)} |`;}),
``,`## Reproduce and checks`,``,
`Prerequisite: the repository's existing dependencies and dist build (\`npm ci\`, then \`npm run build\`). Both passed in this isolated worktree. No dependencies were added.`,
``,`\`node docs/research/variant-independence/audit.mjs\` rebuilds both deliverables. \`node docs/research/variant-independence/check.mjs\` checks manifest coverage, evidence coordinates, parser fixtures, default-removal probes, generated totals and identical second-run bytes. The scanner rejects source files that differ from the pinned commit.`,
``,`Research files: \`css.mjs\` (balanced scanner), \`scan.mjs\` (source/AST inventory), \`review.mjs\` (reviewed decisions), \`audit.mjs\` (deterministic report generator), \`check.mjs\` (verification), \`matrix.json\`, and this README. Source inventory hashes are recorded in the JSON.`,
``,`## Open questions for the owner`,``,
`1. May composed components keep private part styles when the equivalent public Button/Badge/Input variant is excluded? This allows strict public omission without breaking built-in controls.`,
`2. When a default is removed, should the builder require a replacement, choose an explicit base, or omit the component? The current helper has no replacement policy.`,
`3. Should borrowed public axes (SplitButton tone/size, BoxField/ColorField variant, Combobox size, HoverCard side) become explicit manifest references so their dependencies can be validated?`,
`4. Should Code/Token ground booleans and deprecated Field/Kbd aliases be preserved in generated APIs, or normalized to independent enum choices?`,
``,`## DONE`,``,
`- [x] Every manifest family is represented, including axisless families.`,
`- [x] Every named manifest axis value has a status with pinned file:line evidence.`,
`- [x] CSS intersections, React derivations/defaults, demos and specs are recorded.`,
`- [x] Every axis has a default/baseline and an omission outcome.`,
`- [x] Proposed fixes are documented; component/CSS source is unchanged.`,
`- [x] Deterministic regeneration, coverage/count/evidence checks, and git diff whitespace check passed.`,``];
fs.writeFileSync(path.join(out,'README.md'),lines.join('\n'));
console.log(JSON.stringify(counts));
