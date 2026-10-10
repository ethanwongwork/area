/** Research-only static HTML from the compiled Area React markup and preset records. */
import {readFile, writeFile, stat} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {dirname, resolve, join} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const here=dirname(fileURLToPath(import.meta.url)), repo=resolve(here,'../../../../..');
const arg=process.argv.indexOf('--area-root');
const area=arg>=0?resolve(process.argv[arg+1]):repo;
const req=createRequire(join(area,'package.json'));
const React=req('react'), {renderToStaticMarkup}=req('react-dom/server');
const A=await import(pathToFileURL(join(area,'packages/react/dist/modules/index.js')));
const h=React.createElement;
const data=JSON.parse(await readFile(resolve(here,'../13-presets/presets.json'),'utf8'));
const presets=data.presets.filter(p=>['paper','glass','tactile'].includes(p.id));
const hash=x=>createHash('sha256').update(x).digest('hex');
const css=await readFile(join(area,'packages/styles/dist/area.css'));
const main=execFileSync('git',['rev-parse','HEAD'],{cwd:area,encoding:'utf8'}).trim();
const label=(component,props,...children)=>h(component,props,...children);
const B=(text,props={})=>h(A.Button,{size:'md',variant:'solid',tone:'neutral',...props},text);
const fixtures=[
 ['button-solid','Button · solid','raised-control',()=>B('Create project')],
 ['button-ghost','Button · ghost','raised-control',()=>B('View details',{variant:'ghost'})],
 ['input','Input','recessed-field-track',()=>h(A.Input,{size:'md',defaultValue:'Untitled project','aria-label':'Project name'})],
 ['switch','Switch','recessed-field-track + thumb-knob',()=>h(A.Switch,{size:'md',defaultChecked:true,label:'Email updates'})],
 ['segmented','Segmented','recessed-field-track + thumb-knob',()=>h(A.Segmented,{size:'md','aria-label':'View',defaultValue:'board',items:[{value:'board',label:'Board'},{value:'list',label:'List'},{value:'timeline',label:'Timeline'}]})],
 ['card','Card','container',()=>h(A.Card,{size:'md'},h(A.CardHeader,null,h(A.CardTitle,null,'A quieter workspace'),h(A.CardDescription,null,'A shared place for work in progress.')),h(A.CardContent,null,'Keep the detail. Leave room to think.'),h(A.CardFooter,null,B('Open project',{variant:'ghost'})))],
 ['menu','Menu','floating-surface',()=>h(A.Menu,{'aria-label':'Project actions'},h(A.MenuLabel,null,'Project'),h(A.MenuItem,null,'Open project'),h(A.MenuItem,null,'Duplicate'),h(A.MenuSeparator),h(A.MenuItem,{disabled:true},'Archive project'))],
 ['popover','Popover','floating-surface',()=>h(A.Popover,{'aria-label':'Project information'},h(A.PopoverHeader,null,h(A.PopoverTitle,{level:3},'Project information')),h(A.PopoverDescription,null,'Visible to everyone on the design team.'),h(A.PopoverBody,null,'Updated by David Tee.'),h(A.PopoverFooter,null,B('Got it',{variant:'ghost'})))],
 ['dialog','Dialog · inline specimen','floating-surface',()=>h(A.Dialog,{role:'region','aria-label':'Save draft dialog specimen','aria-modal':false,title:'Save your draft?',description:'Keep these changes for the next session.',showCloseButton:false,footer:h(React.Fragment,null,B('Cancel',{variant:'ghost'}),B('Save draft'))})],
 ['toast','Toast','floating-surface',()=>h(A.Toast,{live:false,title:'Changes saved'},'Your workspace is up to date.')],
 ['table','Table','container / calm reading plane',()=>h(A.Table,{size:'md',striped:true,'aria-label':'Project progress',wrapperProps:{tabIndex:0}},h('thead',null,h('tr',null,h('th',null,'Project'),h('th',null,'Status'))),h('tbody',null,...[['Design system','In review'],['Workspace','In progress'],['Documentation','Draft']].map(([a,b])=>h('tr',{key:a},h('td',null,a),h('td',null,b)))))],
 ['code-block','Code block','container / calm reading plane',()=>h(A.CodeBlock,{title:'theme.ts',language:'TypeScript',copyable:false,wrap:true,code:'const workspace = {\n  name: "Area",\n  status: "In progress"\n};'})]
];
let index=0;
const context=[];
for(const mode of ['light','dark'])for(const density of ['default','compact'])for(const backdrop of ['plain','image']){
 const key=`${mode}-${density}-${backdrop}`;
 context.push(`<section class="m16-context" data-context="${key}" data-area-theme="${mode}" data-area-ui="${density}" data-area-surface="outlined" data-area-radius="8" data-backdrop="${backdrop}"${key==='light-default-image'?'':' hidden'} aria-label="${mode}, ${density}, ${backdrop}">
 <div class="m16-context-heading"><h2>${mode==='light'?'Light':'Dark'} <span>/ ${density} / ${backdrop==='image'?'image backdrop':'plain backdrop'}</span></h2><span class="m16-context-index">${String(++index).padStart(2,'0')} / 08</span></div>
 <div class="m16-comparison">${presets.map((p,i)=>`<section class="m16-material" data-material="${p.id}" aria-label="${p.name}"><header class="m16-material-title"><span>0${i+1}</span><h3>${p.name}</h3><p>${{paper:'Opaque, matte, familiar.',glass:'Light at the perimeter.',tactile:'A quiet sense of relief.'}[p.id]}</p></header>${fixtures.map(([id,title,role,render])=>`<article class="m16-tile" data-family="${id}"><header><h4>${title}</h4><span>${role.split(' / ')[0]}</span></header><div class="m16-stage">${id==='button-ghost'?'<div class="m16-ghost-ground">':''}${renderToStaticMarkup(render(),{identifierPrefix:key+'-'+p.id+'-'+id+'-'})}${id==='button-ghost'?'</div>':''}</div><p class="m16-note" data-note>Loading role policy…</p></article>`).join('')}</section>`).join('')}</div></section>`);
}
const html=`<!doctype html><html lang="en" data-area-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Area · Material specimens</title><link rel="stylesheet" href="/packages/styles/dist/area.css"><link rel="stylesheet" href="specimen.css"><script defer src="/area-capture.js"></script><script defer src="preset-data.js"></script><script defer src="specimen.js"></script></head>
<body class="m16-page"><a class="m16-skip" href="#specimens">Skip to specimens</a><header class="m16-header"><a class="m16-wordmark" href="#">area<span> / materials 16</span></a><span class="m16-badge">Research specimen · not approved</span><h1>A study in surfaces.</h1><p class="m16-lede">One component set. Three material recipes. Compare the reading plane, the edge and the space between them.</p></header>
<section class="m16-toolbar" aria-label="Comparison settings"><label>Appearance<select id="mode"><option value="light">Light</option><option value="dark">Dark</option></select></label><label>Density<select id="density"><option value="default">Default</option><option value="compact">Compact</option></select></label><label>Backdrop<select id="backdrop"><option value="image">Image</option><option value="plain">Plain</option></select></label><label class="m16-check"><input id="all-contexts" type="checkbox">Show all 8 contexts</label><label class="m16-check"><input id="plain-fallback" type="checkbox">Plain fallback</label><button id="controls-toggle" type="button" aria-expanded="false" aria-controls="control-panel">Adjust material <span aria-hidden="true">↗</span></button></section>
<aside id="control-panel" class="m16-controls" hidden aria-label="Material controls"><div class="m16-control-heading"><div><h2>Make a controlled change.</h2><p>Changes apply to the selected material in both modes. Clear an override to return to its role recipe.</p></div><button id="controls-close" type="button" aria-label="Close material controls">Close</button></div><div class="m16-control-scope"><label>Material<select id="control-material"><option value="tactile">Tactile</option><option value="glass">Glass</option><option value="paper">Paper</option></select></label><label>Receiver<select id="control-role"><option value="all">All eligible roles</option>${data.roles.map(r=>`<option value="${r}">${r}</option>`).join('')}</select></label><button id="reset-controls" type="button">Reset this scope</button><button id="export-controls" type="button">Download draft</button></div><p class="m16-policy-note">Role limits still apply. Light is shared. No extra effects on text, semantic fills, ghost bodies or dense rows. Ranges are lab controls, not validated production limits.</p><div id="control-fields" class="m16-control-fields"></div><output id="control-feedback" class="m16-control-feedback" aria-live="polite"></output></aside>
<main id="specimens">${context.join('\n')}</main><footer class="m16-footer"><h2>What this can show.</h2><p>Compiled Area anatomy with folder-scoped optical layers. Table and code stay opaque. Glass is limited to shell perimeters with an opaque reading island. Tactile gives up extra relief where role budgets or content clearance prevent it.</p><p>Dialog, Menu and Popover are inline anatomy specimens, not opened overlays. Buttons act only inside this demo; the Switch, Segmented and Input accept local interaction. No production component or token has changed.</p><div class="m16-footer-links"><a href="README.md">Read the report</a><a href="limitations.md">Rendering limits</a><a href="../13-presets/presets.json">Source presets</a></div><div class="m16-audit"><button type="button" id="run-audit">Run specimen checks</button> <button type="button" id="download-audit" disabled>Download audit</button><pre id="audit-result" aria-live="polite"></pre><script id="audit-data" type="application/json"></script></div><p id="build-status">Area ${main.slice(0,7)} · CSS SHA-256 ${hash(css).slice(0,12)} · md where supported</p></footer><div id="demo-feedback" class="m16-announcement" role="status" aria-live="polite"></div></body></html>`;
const model={areaCommit:main,researchCommit:'b372cc6cc7fe3427c99898e8f7944facadfb2be2',cssSha256:hash(css),presets,neutralControls:data.neutralControls,roles:data.roles};
for(const [name,text] of [['index.html',html],['preset-data.js','/* Exact selected task-13 records; generated by build.mjs. */\nwindow.M16_DATA='+JSON.stringify(model).replaceAll('<','\\u003c')+';\n']]){
 if(Buffer.byteLength(text)>=1000000)throw Error(name+' exceeds 1 MB');
 if(process.argv.includes('--check')){if(await readFile(join(here,name),'utf8')!==text)throw Error(name+' drift');}else await writeFile(join(here,name),text);
}
console.log('PASS: 3 presets × 8 contexts × 12 specimens = 288 static tiles; compiled Area markup; CSS '+hash(css));
