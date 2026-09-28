import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import ts from 'typescript';
import {parseCSS,split,closeParen,lineAt} from './css.mjs';
export const root=path.resolve(fileURLToPath(new URL('../../..',import.meta.url)));
export const BASE='c585f8c5f38705a7efa79bf05148a8c6989b142a';
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
export const unique=xs=>[...new Set(xs)];
const walk=dir=>fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]).sort();
export const ev=(file,line,excerpt)=>({file,line,commit:BASE,url:`https://github.com/ethanwongwork/area/blob/${BASE}/${file}#L${line}`,...(excerpt?{excerpt}: {})});
export async function scan(){
 const {MANIFESTS}=await import(path.join(root,'packages/styles/dist/modules/manifest.js'));
 const dirs=['packages/styles/src','packages/react/src/components','apps/docs/src/demos','docs/specs'];
 const paths=unique([...dirs.flatMap(walk).filter(f=>/\.(css|ts|tsx|md)$/.test(f)),'packages/react/src/variants.ts']);
 const files=Object.fromEntries(paths.map(file=>{const s=read(file);const pinned=execFileSync('git',['show',`${BASE}:${file}`],{cwd:root,encoding:'utf8'});if(s!==pinned)throw Error(`Source drift: ${file}`);return[file,{sha256:createHash('sha256').update(s).digest('hex'),lines:s.split('\n').length}];}));
 const mf='packages/styles/src/manifest.ts',ms=read(mf),mt=ts.createSourceFile(mf,ms,ts.ScriptTarget.Latest,true);
 const manifests={};
 function unwrap(n){while(n.expression&&(ts.isAsExpression(n)||ts.isSatisfiesExpression(n)||ts.isParenthesizedExpression(n)))n=n.expression;return n;}
 function prop(n,k){return n.properties.find(p=>p.name?.getText(mt).replaceAll('"','')===k);}
 function mvisit(n){if(ts.isVariableDeclaration(n)&&n.initializer){const o=unwrap(n.initializer);if(ts.isObjectLiteralExpression(o)&&prop(o,'block')){const block=prop(o,'block').initializer.text,key=Object.keys(MANIFESTS).find(k=>MANIFESTS[k].block===block);if(key){const variants=prop(o,'variants').initializer,defaults=prop(o,'defaults').initializer;const sourceVariants=Object.fromEntries(variants.properties.map(p=>[p.name.getText(mt),p.initializer.elements.map(e=>e.text)]));const sourceDefaults=Object.fromEntries(defaults.properties.map(p=>[p.name.getText(mt),p.initializer.text]));if(JSON.stringify(sourceVariants)!==JSON.stringify(MANIFESTS[key].variants)||JSON.stringify(sourceDefaults)!==JSON.stringify(MANIFESTS[key].defaults))throw Error('Stale dist manifest: '+key);manifests[key]={...MANIFESTS[key],evidence:ev(mf,lineAt(ms,n.getStart(mt))),axisEvidence:Object.fromEntries(variants.properties.map(p=>[p.name.getText(mt),ev(mf,lineAt(ms,p.getStart(mt)),p.getText(mt))])),defaultEvidence:ev(mf,lineAt(ms,defaults.getStart(mt)),defaults.getText(mt))};}}}ts.forEachChild(n,mvisit);}mvisit(mt);
 const classMap=new Map();
 for(const [family,m]of Object.entries(manifests)){
  for(const [axis,vs]of Object.entries(m.variants))for(const value of vs)classMap.set(`${m.block}--${value}`,{family,axis,value,kind:'axis'});
  for(const value of m.booleans??[])classMap.set(`${m.block}--${value}`,{family,axis:'boolean',value,kind:'boolean'});
  for(const [el,vs]of Object.entries(m.elementModifiers??{}))for(const value of vs)classMap.set(`${m.block}__${el}--${value}`,{family,axis:`element:${el}`,value,kind:'element modifier'});
 }
 function alternatives(s){let q='',square=0;for(let i=0;i<s.length;i++){if(q){if(s[i]==='\\')i++;else if(s[i]===q)q='';continue;}if('"\''.includes(s[i])){q=s[i];continue;}if(s[i]==='[')square++;if(s[i]===']')square--;if(square)continue;const m=s.slice(i).match(/^:(is|where)\(/);if(m){const st=i+m[0].length-1,end=closeParen(s,st);return split(s.slice(st+1,end)).flatMap(a=>alternatives(s.slice(0,i)+a+s.slice(end+1)));}}return[s];}
 function withoutNot(s){let result='';for(let i=0;i<s.length;i++){if(s.slice(i).startsWith(':not(')){const end=closeParen(s,i+4);result+=':not(...)';i=end;}else result+=s[i];}return result;}
 const css=[];
 for(const f of paths.filter(f=>f.endsWith('.css'))){const s=read(f),p=parseCSS(s,f);for(const r of p.rules.filter(r=>!r.at)){
  const decls=p.declarations.filter(d=>d.ruleIds.at(-1)===r.id).map(d=>({property:d.property,value:d.value,evidence:ev(f,d.line)}));
  for(const branch of split(r.header))for(const selector of alternatives(branch)){
   const classes=unique([...withoutNot(selector).matchAll(/\.([\w-]+)/g)].map(x=>x[1]));
   const allClasses=unique([...selector.matchAll(/\.([\w-]+)/g)].map(x=>x[1]));
   const refs=classes.filter(c=>classMap.has(c)).map(c=>({...classMap.get(c),className:c}));
   const families=Object.keys(manifests).filter(k=>allClasses.some(c=>c===manifests[k].block||c.startsWith(manifests[k].block+'--')||c.startsWith(manifests[k].block+'__')));
   if(!families.length)continue;
   css.push({id:`css-${css.length+1}`,selector:r.header,branch,expanded:selector,atRules:r.atRules,classes,refs,negativeRefs:allClasses.filter(c=>!classes.includes(c)&&classMap.has(c)).map(c=>classMap.get(c)),families,declarations:decls,evidence:ev(f,lineAt(s,r.start),r.header)});
  }
 }}
 const names=Object.fromEntries(Object.keys(manifests).map(k=>[k[0].toUpperCase()+k.slice(1),k]));
 Object.assign(names,{DraftInput:'input',ButtonLink:'button',ChipLink:'chip',AnchoredMenu:'menu',AnchoredPopover:'popover',AnchoredTooltip:'tooltip'});
 function familyFor(name){if(names[name])return names[name];const prefix=Object.keys(names).sort((a,b)=>b.length-a.length).find(n=>name.startsWith(n));return prefix?names[prefix]:null;}
 const react=[],demos=[];
 for(const f of paths.filter(f=>/\.tsx?$/.test(f)&&!f.endsWith('manifest.ts'))){const s=read(f),sf=ts.createSourceFile(f,s,ts.ScriptTarget.Latest,true,f.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS),isDemo=f.startsWith('apps/');
  const report={file:f,functions:[],jsx:[],assignments:[],calls:[],literalClasses:[]};
  const evidence=n=>ev(f,lineAt(s,n.getStart(sf)),n.getText(sf).slice(0,650));
  const lit=n=>n&&(ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n))?n.text:undefined;
  function visit(n,owner){
   if((ts.isFunctionExpression(n)||ts.isFunctionDeclaration(n))&&n.name&&/^[A-Z]/.test(n.name.text)){owner={name:n.name.text,family:familyFor(n.name.text)};report.functions.push({...owner,evidence:evidence(n),endLine:lineAt(s,n.end)});}
   if(ts.isStringLiteral(n)){for(const word of n.text.split(/\s+/)){const ref=classMap.get(word);if(ref)report.literalClasses.push({owner,...ref,className:word,evidence:evidence(n)});}}
   if(ts.isBindingElement(n)&&n.initializer)report.assignments.push({kind:'binding-default',owner,name:n.name.getText(sf),expression:n.initializer.getText(sf),literal:lit(n.initializer),evidence:evidence(n)});
   if(ts.isVariableDeclaration(n)&&n.initializer&&!ts.isCallExpression(n.initializer)&&!ts.isArrowFunction(n.initializer)&&!ts.isFunctionExpression(n.initializer)){const name=n.name.getText(sf);if(/variant|tone|size|layout|orientation|kind|shape|appearance|ground|selection|days|track|author|status|overlap|placement|overflow|resize/i.test(name))report.assignments.push({kind:'derived',owner,name,expression:n.initializer.getText(sf),literal:lit(n.initializer),evidence:evidence(n)});}
   if(ts.isCallExpression(n)&&/Variants$/.test(n.expression.getText(sf)))report.calls.push({owner,helper:n.expression.getText(sf),args:n.arguments[0]&&ts.isObjectLiteralExpression(n.arguments[0])?n.arguments[0].properties.filter(p=>p.name).map(p=>({name:p.name.getText(sf),expression:p.initializer?.getText(sf)??p.name.getText(sf),literal:lit(p.initializer),evidence:evidence(p)})):[],evidence:evidence(n)});
   if(ts.isJsxOpeningElement(n)||ts.isJsxSelfClosingElement(n)){
    const tag=n.tagName.getText(sf),target=familyFor(tag);
    if(target){const attrs=n.attributes.properties.filter(ts.isJsxAttribute).map(a=>{let v=a.initializer;if(v&&ts.isJsxExpression(v))v=v.expression;return {name:a.name.getText(sf),expression:v?.getText(sf)??'true',literal:lit(v),evidence:evidence(a)};});const ancestors=[];let parent=n.parent;while(parent){if(ts.isJsxElement(parent)&&parent.openingElement!==n){const ptag=parent.openingElement.tagName.getText(sf);if(familyFor(ptag))ancestors.push({tag:ptag,family:familyFor(ptag),evidence:evidence(parent.openingElement)});}parent=parent.parent;}report.jsx.push({owner,target,tag,attrs,ancestors,evidence:evidence(n)});}
   }
   ts.forEachChild(n,c=>visit(c,owner));
  }visit(sf,null);(isDemo?demos:react).push(report);
 }
 const specs=paths.filter(f=>f.startsWith('docs/specs/')).map(file=>({file,lines:read(file).split('\n').map((text,i)=>({line:i+1,text})).filter(l=>/variant|tone|size|default|independen|orthogonal|combin|pair|only|coupl|same|neutral|accent|solid|soft|outline|ghost/i.test(l.text))}));
 return {base:BASE,files,manifests,css,react,demos,specs};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const data=await scan();fs.writeFileSync(new URL('./scan.json',import.meta.url),JSON.stringify(data,null,2)+'\n');console.log(JSON.stringify({files:Object.keys(data.files).length,families:Object.keys(data.manifests).length,axes:Object.values(data.manifests).reduce((n,m)=>n+Object.keys(m.variants).length,0),values:Object.values(data.manifests).reduce((n,m)=>n+Object.values(m.variants).flat().length,0),css:data.css.length,combined:data.css.filter(r=>r.refs.length>1).length}));}
