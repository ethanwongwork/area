/** Rebuild the source inventory. Uses the repository's existing TypeScript dev dependency. */
import ts from 'typescript';
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { START, ROOT, DIR, source, pointer, paths, loadManifests } from './validate.mjs';
import { keyboardRules, nameRules, compositionRules } from './reviewed.mjs';
const git = (...args) => execFileSync('git',args,{cwd:ROOT,encoding:'utf8',maxBuffer:40e6});
const files=git('ls-tree','-r','--name-only',START).trim().split('\n');
const manifestPath='packages/styles/src/manifest.ts';
const manifestText=source(manifestPath);
const manifests=await loadManifests(manifestText);
const sf=(file)=>ts.createSourceFile(file,source(file),ts.ScriptTarget.Latest,true,file.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
const asts=new Map(files.filter(f=>/^packages\/react\/src\/.*\.tsx?$|^apps\/docs\/src\/demos\/.*\.tsx?$/.test(f)).map(f=>[f,sf(f)]));
const visit=(node,fn)=>{fn(node);ts.forEachChild(node,n=>visit(n,fn));};
const coord=(file,node)=>`${file}:${1+asts.get(file).getLineAndCharacterOfPosition(node.getStart()).line}`;
const lineAt=(text,pos)=>text.slice(0,pos).split('\n').length;
const unique=a=>[...new Set(a)];
const cap=s=>s[0].toUpperCase()+s.slice(1);
const manifestAst=sf(manifestPath);
const manifestNodes=new Map();
visit(manifestAst,n=>{if(ts.isVariableDeclaration(n)&&ts.isIdentifier(n.name))manifestNodes.set(n.name.text,n);});
const manifestNode=k=>manifestNodes.get(k==='switch'?'switchControl':k);
const manifestEvidence=(k,property)=>{
 const n=manifestNode(k); let found=n;
 if(property){
  let object=n.initializer;while(object && !ts.isObjectLiteralExpression(object))object=object.expression;
  const direct=object?.properties.find(x=>x.name?.getText(manifestAst).replaceAll('"','')===property);
  const variants=object?.properties.find(x=>x.name?.getText(manifestAst)==='variants');
  found=direct??variants?.initializer.properties.find(x=>x.name?.getText(manifestAst).replaceAll('"','')===property)??n;
 }
 return `${manifestPath}:${1+manifestAst.getLineAndCharacterOfPosition(found.getStart()).line}`;
};
const familyForExport=name=>Object.keys(manifests).sort((a,b)=>b.length-a.length).find(k=>name===cap(k)||name.startsWith(cap(k)));
const declarations=[];
for(const [file,ast]of asts){
 if(!file.startsWith('packages/react/src/components/'))continue;
 for(const statement of ast.statements){
  if(ts.isVariableStatement(statement))for(const d of statement.declarationList.declarations)if(ts.isIdentifier(d.name))declarations.push({file,node:d,name:d.name.text,exported:statement.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)});
  if(ts.isFunctionDeclaration(statement)&&statement.name)declarations.push({file,node:statement,name:statement.name.text,exported:statement.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)});
 }
}
function resolveLocal(name, origin, file) {
 const ancestors=new Set();for(let n=origin;n;n=n.parent)ancestors.add(n);
 let found;
 visit(asts.get(file),n=>{if(!ts.isVariableDeclaration(n)||!ts.isIdentifier(n.name)||n.name.text!==name||n.pos>=origin.pos)return;
  let scope=n.parent;while(scope&&!ts.isBlock(scope)&&!ts.isSourceFile(scope))scope=scope.parent;
  if(ancestors.has(scope)&&(!found||n.pos>found.pos))found=n;
 });
 return found?.initializer;
}
function expressionClasses(node,file,seen=new Set()){
 if(!node)return [];
 const text=node.getText(asts.get(file));
 const out=[...text.matchAll(/\barea-[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9-]+)?\b/g)].map(m=>m[0]);
 for(const [k,m]of Object.entries(manifests)){
  if(new RegExp(`\\b${k}Variants\\s*\\(`).test(text))out.push(m.block);
  for(const hit of text.matchAll(new RegExp(`\\b${k}Variants\\.element\\(\\s*["']([^"']+)["']\\s*\\)`,'g')))out.push(`${m.block}__${hit[1]}`);
 }
 visit(node,n=>{if(!ts.isIdentifier(n)||seen.has(n.text)||n.text==='className')return;
  const value=resolveLocal(n.text,node,file);if(value){seen.add(n.text);out.push(...expressionClasses(value,file,seen));}
 });
 return unique(out);
}
function classes(open,file){
 const a=open.attributes.properties.find(p=>ts.isJsxAttribute(p)&&p.name.getText()==='className');
 if(a)return expressionClasses(a.initializer,file);
 const out=[];
 for(const spread of open.attributes.properties.filter(ts.isJsxSpreadAttribute)){
  let value=spread.expression;while(ts.isAsExpression(value)||ts.isParenthesizedExpression(value))value=value.expression;
  if(ts.isIdentifier(value))value=resolveLocal(value.text,open,file);
  if(!value)continue;
  visit(value,n=>{if(ts.isPropertyAssignment(n)&&n.name.getText()==='className')out.push(...expressionClasses(n.initializer,file));});
 }
 return unique(out);
}
const jsx=[];
for(const [file,ast]of asts){
 if(!file.startsWith('packages/react/src/components/'))continue;
 visit(ast,n=>{if(ts.isJsxOpeningElement(n)||ts.isJsxSelfClosingElement(n))jsx.push({file,node:n,classes:classes(n,file),tag:n.tagName.getText(ast),at:coord(file,n)});});
}
// Balanced scanner: comments are replaced by spaces so source offsets stay exact.
function splitTop(text,separator){
 const result=[];let start=0,depth=0,quote='';
 for(let i=0;i<text.length;i++){const c=text[i];if(quote){if(c==='\\')i++;else if(c===quote)quote='';continue;}if(c==='"'||c==="'"){quote=c;continue;}if(c==='('||c==='[')depth++;if(c===')'||c===']')depth--;if(c===separator&&depth===0){result.push(text.slice(start,i));start=i+1;}}
 result.push(text.slice(start));return result;
}
const cssRules=[];
for(const file of files.filter(f=>f.startsWith('packages/styles/src/')&&f.endsWith('.css'))){
 const original=source(file), text=original.replace(/\/\*[\s\S]*?\*\//g,m=>m.replace(/[^\n]/g,' '));
 function scan(start,end,ancestors=[]){
  let cursor=start;
  while(cursor<end){let brace=text.indexOf('{',cursor);if(brace<0||brace>=end)break;
   let depth=1,quote='',close=brace+1;for(;close<end&&depth;close++){const c=text[close];if(quote){if(c==='\\')close++;else if(c===quote)quote='';}else if(c==='"'||c==="'")quote=c;else if(c==='{')depth++;else if(c==='}')depth--;}
   const pre=text.slice(cursor,brace).trim(),body=text.slice(brace+1,close-1);
   if(pre.startsWith('@'))scan(brace+1,close-1,[...ancestors,pre]);
   else if(pre){
    const selectorStart=cursor+text.slice(cursor,brace).indexOf(pre);
    const declarations=[];let offset=brace+1;
    for(const chunk of splitTop(body,';')){const colon=chunk.indexOf(':');if(colon>=0){const property=chunk.slice(0,colon).trim(),value=chunk.slice(colon+1).trim();declarations.push({property,value,at:`${file}:${lineAt(original,offset+chunk.search(/\S/))}`});}offset+=chunk.length+1;}
    cssRules.push({file,selectors:splitTop(pre,',').map(s=>s.trim()),declarations,at:`${file}:${lineAt(original,selectorStart)}`,ancestors});
   }cursor=close;
  }
 }scan(0,text.length);
}
function classPattern(c){return new RegExp(`\\.${c}(?=--|[^a-zA-Z0-9_-]|$)`);}
function selectorSubject(s){
 // Only the last top-level compound can be a direct target. :has/:not arguments are context.
 let depth=0,last=0,quote='';for(let i=0;i<s.length;i++){const c=s[i];if(quote){if(c==='\\')i++;else if(c===quote)quote='';continue;}if(c==='"'||c==="'")quote=c;else if(c==='('||c==='[')depth++;else if(c===')'||c===']')depth--;else if(!depth&&/[\s>+~]/.test(c))last=i+1;}
 return s.slice(last).replace(/:(?:has|not)\([^)]*\)/g,'');
}
const specAliases={checkboxGroup:'checkbox',radioGroup:'radio',choiceLabel:'checkbox',avatarGroup:'avatar',chipGroup:'chip',indicatorAnchor:'indicator',presence:'indicator',tableWrapper:'table',popoverAnchor:'popover',kbdGroup:'kbd'};
const indexFile='packages/react/src/index.ts',indexText=source(indexFile);
const all=[];
for(const [family,m]of Object.entries(manifests)){
 const slug=m.block.slice(5), ev={}, base=manifestEvidence(family), found=(sources,note='Direct source declaration or implementation.')=>({status:'found',sources:unique([sources].flat()),note}), missing=(sources,note)=>({status:'not found',sources:unique([sources].flat()),note:`not found: ${note}`});
 const set=(path,value,e)=>{ev[path]=e;return value;};
 const exported=declarations.filter(d=>d.exported&&familyForExport(d.name)===family);
 const ownNodes=jsx.filter(j=>j.classes.some(c=>c===m.block||c.startsWith(`${m.block}__`)));
 const scopes=exported.length?exported:unique(ownNodes.flatMap(j=>declarations.filter(d=>d.file===j.file&&d.node.pos<=j.node.pos&&d.node.end>=j.node.end)));
 const searched=unique([base,...scopes.map(d=>coord(d.file,d.node))]);
 const specFile=`docs/specs/${files.includes(`docs/specs/${slug}.md`)?slug:specAliases[family]??slug}.md`;
 const specs=files.includes(specFile)?[specFile]:[];
 searched.push(...specs.map(f=>`${f}:1`));
 const gap=note=>missing(searched,note);
 const doc={slug:set('/slug',slug,found(manifestEvidence(family,'block'))),manifest:set('/manifest',family,found(base)),parts:[],slots:[],options:{},booleans:m.booleans??[],elementModifiers:m.elementModifiers??{},states:[],keyboard:[],accessibleName:[],composition:{allowedParents:'not found',allowedChildren:'not found',observedChildren:[],demoExamples:[]},reference:{css:[],spec:specs.length?specs:'not found',reactExport:[]}};
 ev['/parts']=found([base,...ownNodes.map(j=>j.at)],'Manifest parts plus implementation-only structural elements; unclassed nodes retain explicit IDs.');
 const partClasses=unique([m.block,...(m.elements??[]).map(el=>`${m.block}__${el}`),...ownNodes.flatMap(j=>j.classes.filter(c=>c.startsWith(`${m.block}__`)))]);
 const partNodes=new Map();
 for(const c of partClasses){const id=c===m.block?'root':c.slice(m.block.length+2);partNodes.set(id,ownNodes.filter(j=>j.classes.includes(c)));doc.parts.push({id,element:'not found',class:c,required:'not found',allowedContent:'not found',customProperties:[],tokens:[]});}
 // Include otherwise anonymous native anatomy within this family's own exported implementations.
 for(const s of scopes){
  for(const j of jsx.filter(j=>j.file===s.file&&s.node.pos<=j.node.pos&&s.node.end>=j.node.end&&!j.classes.length&&/^(input|button|a|span|div|label|fieldset|legend|dialog|summary|details|img|textarea|select|output|table|thead|tbody|tr|th|td|ul|li|section|h[1-6])$/.test(j.tag))){
   const id=`unclassed-${j.tag}-${j.at.split(':').at(-1)}`;
   if(partNodes.has(id))continue;
   partNodes.set(id,[j]);doc.parts.push({id,element:[j.tag],class:'not found',required:'not found',allowedContent:'not found',customProperties:[],tokens:[]});
  }
 }
 const partFor=j=>doc.parts.find(p=>partNodes.get(p.id)?.some(n=>n===j))?.id??'not found';
 doc.parts.forEach((p,i)=>{
  const path=`/parts/${i}`,nodes=partNodes.get(p.id),refs=nodes.length?nodes.map(n=>n.at):[base];
  ev[path]=found(refs);ev[`${path}/id`]=found(refs,'Stable contract ID derived from the cited class or unclassed source node.');
  ev[`${path}/class`]=p.class==='not found'?missing(refs,'No class assigned at this native element; callers may supply one through forwarded props.'):found(nodes.length?refs:manifestEvidence(family,'elements'));
  const delegatedRefs=[];
  function nativeTags(j,seen=new Set()){
   if(/^[a-z]/.test(j.tag))return [j.tag];
   const target=Object.keys(manifests).find(k=>cap(k)===j.tag);
   if(!target||seen.has(target))return [];seen.add(target);
   const roots=jsx.filter(n=>n.classes.includes(manifests[target].block));delegatedRefs.push(...roots.map(n=>n.at));
   return roots.flatMap(n=>nativeTags(n,seen));
  }
  const elements=unique(nodes.flatMap(n=>nativeTags(n)));
  if(elements.length){p.element=elements;ev[`${path}/element`]=found([...refs,...delegatedRefs],'Observed native element(s), resolving direct calls to public family roots; conditional element choices retained.');}else ev[`${path}/element`]=missing(refs,'No native element resolved for this manifest part; searched JSX classes and class helpers.');
  if(p.id==='root'&&elements.length){p.required=true;ev[`${path}/required`]=found(refs,'Root of the rendered family surface.');}else if(nodes.some(j=>{for(let n=j.node.parent;n&&!ts.isSourceFile(n);n=n.parent)if(ts.isConditionalExpression(n)||(ts.isBinaryExpression(n)&&n.operatorToken.kind===ts.SyntaxKind.AmpersandAmpersandToken))return true;return false;})){p.required=false;ev[`${path}/required`]=found(refs,'This part can be omitted by a conditional rendering branch.');}else if(nodes.some(j=>{const owner=exported.find(d=>d.name===cap(family)&&d.file===j.file&&d.node.pos<j.node.pos&&d.node.end>j.node.end);if(!owner)return false;for(let n=j.node.parent;n&&n!==owner.node;n=n.parent){if(ts.isReturnStatement(n))return true;if(ts.isVariableDeclaration(n)||ts.isArrowFunction(n)||ts.isConditionalExpression(n)||ts.isIfStatement(n))return false;}return false;})){p.required=true;ev[`${path}/required`]=found(refs,'Unconditional native child on the primary component return path.');}else ev[`${path}/required`]=missing(refs,'Family-wide mandatory/optional anatomy is not specified; presence at one JSX call site does not establish a composition rule.');
  ev[`${path}/allowedContent`]=missing(refs,'No explicit content grammar for this part; see separately typed public slots.');
  for(const field of ['customProperties','tokens']){
   const reads=new Map();
   if(p.class!=='not found')for(const rule of cssRules)for(const selector of rule.selectors){
    if(!classPattern(p.class).test(selectorSubject(selector)))continue;
    for(const decl of rule.declarations)for(const match of decl.value.matchAll(/var\(\s*(--[\w-]+)/g)){
     const name=match[1];if((field==='tokens')!==name.startsWith('--area-'))continue;
     if(!reads.has(name))reads.set(name,{name,selectors:[],refs:[]});const r=reads.get(name);r.selectors.push(selector);r.refs.push(decl.at);
    }
   }
   p[field]=[...reads.values()].sort((a,b)=>a.name.localeCompare(b.name)).map((r,k)=>{const q=`${path}/${field}/${k}`,v={name:r.name,selectors:unique(r.selectors)};ev[q]=found(r.refs,'Direct var() read on this selector target, including conditional rules and pseudo-elements. Not a computed/inherited token closure.');return v;});
   ev[`${path}/${field}`]=reads.size?found([...reads.values()].flatMap(r=>r.refs),'Direct selector-scoped var() reads in all styles sources.'):missing(refs,'No directly targeted var() reads located in packages/styles/src; inheritance and child-family styling are not expanded.');
  }
 });
 // Resolve locally declared props through interfaces, aliases and intersections.
 for(const s of exported){
  const ast=asts.get(s.file),types=new Map(ast.statements.filter(n=>ts.isInterfaceDeclaration(n)||ts.isTypeAliasDeclaration(n)).map(n=>[n.name.text,n]));
  const members=[],seen=new Set();
  function collect(node){if(!node)return;
   if(ts.isInterfaceDeclaration(node)){members.push(...node.members);for(const h of node.heritageClauses??[])for(const t of h.types)collect(types.get(t.expression.getText()));return;}
   if(ts.isTypeAliasDeclaration(node)){if(seen.has(node.name.text))return;seen.add(node.name.text);collect(node.type);return;}
   if(ts.isTypeLiteralNode(node)){members.push(...node.members);return;}
   if(ts.isIntersectionTypeNode(node)||ts.isUnionTypeNode(node)){node.types.forEach(collect);return;}
   if(ts.isTypeReferenceNode(node))collect(types.get(node.typeName.getText()));
  }
  collect(types.get(`${s.name}Props`));
  const memberNames=new Set();
  for(const prop of members){if(!ts.isPropertySignature(prop)||!prop.type||!prop.name)continue;
   const type=prop.type.getText(ast);if(!/\bReact(Node|Element)\b/.test(type))continue;
   const name=prop.name.getText(ast).replace(/["']/g,'');if(memberNames.has(name))continue;memberNames.add(name);
   const idx=doc.slots.length,path=`/slots/${idx}`;
   const targets=ownNodes.filter(j=>j.file===s.file&&j.node.parent&&ts.isJsxElement(j.node.parent)&&j.node.parent.children.some(c=>ts.isJsxExpression(c)&&c.expression?.getText(ast)===name));
   const part=targets.length?partFor(targets[0]):'not found',partData=doc.parts.find(p=>p.id===part);
   doc.slots.push({name:`${s.name}.${name}`,part,element:partData?.element??'not found',class:partData?.class??'not found',required:!prop.questionToken,allowedContent:[/ReactElement/.test(type)?'element':'renderable content (text, elements, fragments, or empty content)']});
   ev[path]=found(coord(s.file,prop),'Public content prop type translated to a framework-neutral slot.');
   if(part==='not found')ev[`${path}/part`]=gap(`No single direct part resolved for ${s.name}.${name}; conditional/delegated rendering requires review.`);
   for(const field of ['element','class'])ev[`${path}/${field}`]=partData?ev[`/parts/${doc.parts.indexOf(partData)}/${field}`]:gap(`No resolved part for ${s.name}.${name}.`);
   if(partData){const pp=`/parts/${doc.parts.indexOf(partData)}/allowedContent`;partData.allowedContent=unique([...(Array.isArray(partData.allowedContent)?partData.allowedContent:[]),...doc.slots.at(-1).allowedContent]);ev[pp]=found(coord(s.file,prop),'Content type of the public slot rendered directly in this part.');}
  }
 }
 for(const s of exported){
  if(doc.slots.some(slot=>slot.name===`${s.name}.children`))continue;
  let binding;visit(s.node,n=>{if(ts.isBindingElement(n)&&n.name.getText()==='children')binding=n;});
  if(!binding)continue;
  const targets=ownNodes.filter(j=>j.file===s.file&&j.node.parent&&ts.isJsxElement(j.node.parent)&&j.node.parent.children.some(c=>ts.isJsxExpression(c)&&c.expression?.getText()==='children'));
  const part=targets.length?partFor(targets[0]):'not found',partData=doc.parts.find(p=>p.id===part),i=doc.slots.length,path=`/slots/${i}`;
  doc.slots.push({name:`${s.name}.children`,part,element:partData?.element??'not found',class:partData?.class??'not found',required:'not found',allowedContent:'not found'});
  ev[path]=found(coord(s.file,binding),'Observed children slot inherited through native props; no local content grammar declared.');
  for(const field of ['required','allowedContent'])ev[`${path}/${field}`]=missing(coord(s.file,binding),'Inherited native children; local content grammar/cardinality not found.');
  for(const field of ['element','class'])ev[`${path}/${field}`]=partData?ev[`/parts/${doc.parts.indexOf(partData)}/${field}`]:gap('No unique direct part for inherited children.');
 }
 ev['/slots']=doc.slots.length?found(doc.slots.flatMap((_,i)=>ev[`/slots/${i}`].sources)):gap('No locally declared ReactNode/ReactElement slot props; native inherited children and delegated interfaces require review.');
 ev['/options']=found(manifestEvidence(family,'variants'));
 for(const [axis,values]of Object.entries(m.variants)){
  doc.options[axis]={values,default:m.defaults[axis]??'not found'};
  ev[`/options/${pointer(axis)}`]=found(manifestEvidence(family,axis));
  ev[`/options/${pointer(axis)}/default`]=axis in m.defaults?found(manifestEvidence(family,'defaults')):missing(manifestEvidence(family,'defaults'),'No manifest default for this axis; does not assert that the effective CSS or React default is absent.');
 }
 ev['/booleans']=found(m.booleans?manifestEvidence(family,'booleans'):base,'Exact manifest boolean modifier list; absence means no declared booleans.');
 ev['/elementModifiers']=found(m.elementModifiers?manifestEvidence(family,'elementModifiers'):base);
 const stateSeen=new Set();
 function addState(name,part,kind,hook,value,e){const signature=JSON.stringify([name,part,kind,hook,value]);if(stateSeen.has(signature))return;stateSeen.add(signature);const i=doc.states.length;doc.states.push({name,part,kind,hook,value});ev[`/states/${i}`]=e;if(part==='not found')ev[`/states/${i}/part`]=gap(`Carrier for ${hook} is not resolved.`);}
 for(const [id,nodes]of partNodes)for(const j of nodes){
  for(const a of j.node.attributes.properties){
   if(ts.isJsxAttribute(a)){
    const name=a.name.getText(),kind=name.startsWith('aria-')?'aria':name.startsWith('data-')?'data':['disabled','checked','selected','readOnly','required','hidden','open','multiple'].includes(name)?'native':null;
    if(!kind||['aria-label','aria-labelledby','aria-describedby','aria-controls','aria-owns','aria-roledescription','aria-details','aria-keyshortcuts'].includes(name))continue;
    if(/^[A-Z]/.test(j.tag)){
     addState(name.replace(/^(aria-|data-)/,''),'not found','not found','not found',a.initializer?.getText(asts.get(j.file))??'present',missing(coord(j.file,a),`Forwarded ${name} prop on ${j.tag}; local native carrier/hook is not established by this call site. Consult the child-family definition.`));
    }else addState(name.replace(/^(aria-|data-)/,''),id,kind,name,a.initializer?.getText(asts.get(j.file))??'present',found(coord(j.file,a),'Exact authored attribute value/expression; expressions describe current implementation, not a portable evaluator.'));
   }else if(ts.isJsxSpreadAttribute(a)){
    for(const match of a.expression.getText().matchAll(/["']((?:data|aria)-[\w-]+)["']\s*:\s*([^,}]+)/g)){
     const name=match[1];if(['aria-label','aria-labelledby','aria-describedby'].includes(name))continue;
     addState(name.replace(/^(aria-|data-)/,''),id,name.startsWith('aria-')?'aria':'data',name,match[2].trim(),found(coord(j.file,a),'Hook in conditional spread; evaluate the cited branch condition before emitting.'));
    }
   }
  }
 }
 for(const p of doc.parts)if(p.class!=='not found')for(const r of cssRules)for(const selector of r.selectors){
  const subject=selectorSubject(selector);if(!classPattern(p.class).test(subject))continue;
  for(const match of subject.matchAll(/:(hover|active|focus-visible|focus-within|focus|disabled|checked|indeterminate|read-only|invalid|open|popover-open)\b/g))addState(match[1],p.id,'pseudo',`:${match[1]}`,selector,found(r.at,'CSS selector condition; a pseudo-class is not an attribute adapter.'));
  for(const match of subject.matchAll(/\[((?:data-|aria-)[\w-]+|disabled|checked|open|hidden|readonly)(?:\s*=\s*([^\]]+))?\]/g))addState(match[1].replace(/^(aria-|data-)/,''),p.id,match[1].startsWith('aria-')?'aria':match[1].startsWith('data-')?'data':'native',match[1],match[2]??'present',found(r.at,'CSS-recognized hook, with the complete selector retained as evidence context.'));
 }
 for(const [name,hook]of Object.entries(m.stateAttributes??{}))if(!doc.states.some(s=>s.name===name&&s.hook===hook)){
  const native=doc.parts.find(p=>p.id==='control'&&Array.isArray(p.element)&&p.element.includes('input'));
  addState(name,native?.id??'not found',hook.startsWith('aria-')?'aria':hook.startsWith('data-')?'data':'native',hook,'present',found(manifestEvidence(family,'stateAttributes'),'Manifest native/ARIA exception; state-bearing input control when present.'));
 }
 for(const name of m.states??[])if(!doc.states.some(s=>s.name===name)){
  const attr=m.stateAttributes?.[name]??`data-${name}`;
  addState(name,'not found',attr.startsWith('aria-')?'aria':attr.startsWith('data-')?'data':'native',attr,'present',found([manifestEvidence(family,'states'),'packages/react/src/variants.ts:56'],'Manifest/plain-HTML state adapter exists; carrier or implementation hook not located.'));
 }
 for(const s of scopes){const txt=s.node.getText(asts.get(s.file));const at=txt.indexOf('.indeterminate =');if(at>=0&&doc.parts.some(p=>p.id==='control'))addState('indeterminate','control','native-property','indeterminate','boolean property',found(`${s.file}:${lineAt(source(s.file),s.node.getStart()+at)}`,'Native input DOM property; not an HTML content attribute.'));}
 ev['/states']=doc.states.length?found(unique(doc.states.flatMap((_,i)=>ev[`/states/${i}`].sources))):gap('No runtime hooks found in manifest, family markup or directly targeted CSS selectors.');
 for(const rule of keyboardRules[family]??[]){const [key,part,action,condition,file,needle]=rule;const text=source(file),pos=text.indexOf(needle);if(pos<0)throw Error(`${family}: keyboard evidence missing ${needle}`);const at=`${file}:${lineAt(text,pos)}`;const i=doc.keyboard.length;doc.keyboard.push({key,part,action,condition});ev[`/keyboard/${i}`]=found(at,'Reviewed keyboard behavior in the reference implementation or spec.');}
 ev['/keyboard']=doc.keyboard.length?found(doc.keyboard.flatMap((_,i)=>ev[`/keyboard/${i}`].sources)):gap('No reviewed key-to-action contract found. Native behavior is not invented from a tag name.');
 for(const rule of nameRules[family]??[]){const [part,ruleText,file,needle]=rule;const pos=source(file).indexOf(needle);if(pos<0)throw Error(`${family}: naming evidence missing ${needle}`);const i=doc.accessibleName.length;doc.accessibleName.push({part,rule:ruleText});ev[`/accessibleName/${i}`]=found(`${file}:${lineAt(source(file),pos)}`);}
 // Preserve concrete naming wiring even when a normative requirement is not written.
 for(const [id,nodes]of partNodes)for(const j of nodes)for(const a of j.node.attributes.properties){if(!ts.isJsxAttribute(a))continue;const name=a.name.getText();if(!['aria-label','aria-labelledby','alt','htmlFor'].includes(name))continue;
  const i=doc.accessibleName.length;doc.accessibleName.push({part:id,rule:`Reference wiring: ${name}=${a.initializer?.getText(asts.get(j.file))??'present'}.`});ev[`/accessibleName/${i}`]=found(coord(j.file,a),'Observed naming/label association; raw expression is not a framework-neutral requirement.');
 }
 ev['/accessibleName']=doc.accessibleName.length?found(doc.accessibleName.flatMap((_,i)=>ev[`/accessibleName/${i}`].sources)):gap('No explicit accessible-name rule or naming attribute found in scoped implementation; inherited native props are not treated as naming requirements.');
 ev['/composition']=found(searched,'Allowed composition is distinct from examples and built-in child calls.');
 for(const field of ['allowedParents','allowedChildren'])ev[`/composition/${field}`]=gap('No exhaustive allowed-composition grammar found; examples do not prohibit other content.');
 for(const [field,value,file,needle]of compositionRules[family]??[]){const pos=source(file).indexOf(needle);if(pos<0)throw Error(`${family}: composition evidence missing`);doc.composition[field]=value;ev[`/composition/${field}`]=found(`${file}:${lineAt(source(file),pos)}`);}
 for(const s of scopes)visit(s.node,n=>{if(!ts.isJsxOpeningElement(n)&&!ts.isJsxSelfClosingElement(n))return;const tag=n.tagName.getText();if(!/^[A-Z]/.test(tag)||doc.composition.observedChildren.includes(tag))return;doc.composition.observedChildren.push(tag);ev[`/composition/observedChildren/${doc.composition.observedChildren.length-1}`]=found(coord(s.file,n),'Observed child component call; not an allowed-child restriction.');});
 ev['/composition/observedChildren']=doc.composition.observedChildren.length?found(searched):gap('No child component call located.');
 for(const [file,ast]of asts)if(file.startsWith('apps/docs/src/demos/'))visit(ast,n=>{if(!ts.isJsxOpeningElement(n)&&!ts.isJsxSelfClosingElement(n))return;const name=n.tagName.getText();if(!exported.some(d=>d.name===name)&&!classes(n,file).some(c=>c===m.block))return;const at=coord(file,n);if(doc.composition.demoExamples.includes(at))return;const i=doc.composition.demoExamples.length;doc.composition.demoExamples.push(at);ev[`/composition/demoExamples/${i}`]=found(at,'Demo use, not a normative composition constraint.');});
 ev['/composition/demoExamples']=doc.composition.demoExamples.length?found(doc.composition.demoExamples):gap('No direct family element/export use in apps/docs/src/demos; wrappers and computed galleries are not interpreted.');
 const relevant=cssRules.filter(r=>r.selectors.some(s=>partClasses.some(c=>classPattern(c).test(s))));
 doc.reference.css=unique(relevant.map(r=>r.file));ev['/reference/css']=found(relevant.map(r=>r.at));
 doc.reference.css.forEach((file,i)=>{ev[`/reference/css/${i}`]=found(relevant.find(r=>r.file===file).at);});
 ev['/reference/spec']=specs.length?found(`${specFile}:1`,specAliases[family]&&specFile!==`docs/specs/${slug}.md`?'Shared family spec; dedicated slug spec not found.':'Dedicated family spec.'):gap(`No docs/specs/${slug}.md or mapped shared spec found; searched docs/specs.`);
 for(const s of exported){
  const needle=`./components/${s.file.split('/').at(-1)}`;const pos=indexText.indexOf(needle);
  if(pos<0)continue;doc.reference.reactExport.push(s.name);ev[`/reference/reactExport/${doc.reference.reactExport.length-1}`]=found([coord(s.file,s.node),`${indexFile}:${lineAt(indexText,pos)}`],'Implementation declaration and public barrel export.');
 }
 if(!doc.reference.reactExport.length){doc.reference.reactExport='not found';ev['/reference/reactExport']=gap('No family export found in packages/react/src/index.ts and component declarations.');}else ev['/reference/reactExport']=found(doc.reference.reactExport.flatMap((_,i)=>ev[`/reference/reactExport/${i}`].sources));
 ev['/reference']=found([base,...doc.reference.css.map(f=>`${f}:1`),...specs.map(f=>`${f}:1`)]);
 // Expand scoped evidence down to every container and leaf. Missing values always get missing status.
 for(const path of paths(doc))if(!ev[path]){let parent=path;while(!ev[parent]&&parent)parent=parent.slice(0,parent.lastIndexOf('/'));ev[path]=ev[parent]??gap('No evidence assigned.');}
 for(const path of paths(doc)){
  const value=path.slice(1).split('/').reduce((o,k)=>o[k.replace(/~1/g,'/').replace(/~0/g,'~')],doc);
  if(value==='not found'&&ev[path].status!=='not found')ev[path]=missing(ev[path].sources,'No value resolved; see the cited declaration and family review.');
 }
 doc.evidence=ev;
 const {evidence,...payload}=doc;
 const body=JSON.stringify(payload,null,2).slice(0,-2);
 const evidenceLines=Object.entries(evidence).map(([path,entry])=>`    ${JSON.stringify(path)}: ${JSON.stringify(entry)}`);
 writeFileSync(resolve(DIR,`${slug}.json`),`${body},\n  "evidence": {\n${evidenceLines.join(',\n')}\n  }\n}\n`);all.push(doc);
}
console.log(`Generated ${all.length} definitions at ${START}.`);
