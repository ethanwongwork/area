/* A bounded research renderer. Baseline recipes are exact task-13 records, not defaults inferred from CSS. */
(() => {
'use strict';
const data=window.M16_DATA, $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const presets=Object.fromEntries(data.presets.map(p=>[p.id,p]));
const patches=Object.fromEntries(data.presets.map(p=>[p.id,{global:{},roles:{}}]));
const records=new WeakMap(), diagnostics=[];
const clone=x=>JSON.parse(JSON.stringify(x));
const get=(o,path)=>path.split('.').reduce((v,k)=>v?.[k],o);
const set=(o,path,value)=>{const keys=path.split('.');const last=keys.pop();for(const key of keys)o=o[key]??=(/^[0-9]+$/.test(last)?{}:{});o[last]=value;};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const numeric=(group,label,path,min,max,step,unit='')=>({group,label,path,min,max,step,unit});
const fields=[
 numeric('Light','Angle','light.angleDeg',0,359,1,'°'),numeric('Light','Height','light.heightDeg',0,90,1,'°'),numeric('Light','Ambient','light.ambient',0,1,.01),
 numeric('Local relief','Depth','relief.depthPx',0,4,.1,'px'),numeric('Local relief','Softness','relief.softnessPx',0,6,.1,'px'),numeric('Local relief','Spread','relief.spreadPx',-2,2,.1,'px'),numeric('Local relief','Strength','relief.strength',0,.4,.01),
 {group:'Local relief',label:'Profile',path:'relief.profile',options:['flush','convex','concave']},
 numeric('Surface cast','Lift gain','surfaceControls.liftGain',0,2,.05,'×'),numeric('Surface cast','Softness gain','surfaceControls.softnessGain',0,2,.05,'×'),numeric('Surface cast','Spread delta','surfaceControls.spreadDeltaPx',-3,3,.25,'px'),numeric('Surface cast','Strength gain','surfaceControls.strengthGain',0,2,.05,'×'),
 {group:'Surface cast',label:'Direction',path:'surfaceControls.direction',options:['source','key']},
 numeric('Transmission','Fill transparency','body.transparency',0,.5,.01),numeric('Transmission','Backdrop blur','backdrop.blurPx',0,24,.5,'px'),
 numeric('Edge','Opacity','stroke.opacity',0,1,.01),{group:'Edge',label:'Coverage',path:'stroke.coverage',options:['none','all','top','logical-start']},{group:'Edge',label:'Paint',path:'stroke.paint',options:['solid','gradient']},{group:'Edge',label:'Profile',path:'stroke.profile',options:['plain','double-rim','bevel']},
 numeric('Gradient edge','Angle','gradients.edge.angleDeg',0,359,1,'°'),numeric('Gradient edge','First stop','gradients.edge.stops.0.position',0,100,1,'%'),numeric('Gradient edge','Last stop','gradients.edge.stops.1.position',0,100,1,'%'),numeric('Gradient edge','First alpha','gradients.edge.stops.0.alpha',0,1,.01),numeric('Gradient edge','Last alpha','gradients.edge.stops.1.alpha',0,1,.01),
 {group:'Gradient edge',label:'First color · light',path:'gradients.edge.stops.0.customLight',color:true},{group:'Gradient edge',label:'First color · dark',path:'gradients.edge.stops.0.customDark',color:true},{group:'Gradient edge',label:'Last color · light',path:'gradients.edge.stops.1.customLight',color:true},{group:'Gradient edge',label:'Last color · dark',path:'gradients.edge.stops.1.customDark',color:true},
 numeric('Glow','Strength','glow.strength',0,.3,.01),numeric('Glow','Softness','glow.softnessPx',0,8,.25,'px'),numeric('Glow','Spread','glow.spreadPx',0,3,.25,'px'),{group:'Glow',label:'Color source',path:'glow.source',options:['context','action','selection','tone','decorative']},{group:'Glow',label:'Decorative color · both modes',path:'glow.custom',color:true},
 numeric('Texture & gloss','Grain strength','grain.strength',0,.08,.005),numeric('Texture & gloss','Grain scale','grain.scalePx',.5,3,.25,'px'),numeric('Texture & gloss','Grain seed','grain.seed',0,100,1),numeric('Texture & gloss','Gloss strength','gloss.strength',0,.3,.01),numeric('Texture & gloss','Gloss extent','gloss.extent',.02,.5,.01),numeric('Texture & gloss','Gloss softness','gloss.softnessPx',0,4,.25,'px')
];
const zeroGradient=()=>({target:'edge',kind:'linear',angleDeg:180,interpolation:'srgb',stops:[{id:'top',position:0,source:'highlight-white',alpha:.12,customLight:'#ffffff',customDark:'#ffffff'},{id:'bottom',position:100,source:'highlight-white',alpha:0,customLight:'#ffffff',customDark:'#ffffff'}]});
function rawControls(material,mode,role) {
 const c=clone(presets[material].modes[mode].roles[role].controls), p=patches[material];
 for(const [path,value] of Object.entries({...p.global,...p.roles[role]})) {
  if(path.startsWith('gradients.edge')&&!c.gradients.edge)c.gradients.edge=zeroGradient();
  set(c,path,value);
  if(path.includes('.customLight')||path.includes('.customDark'))c.gradients.edge.stops[Number(path.split('.')[3])].source='decorative';
 }
 return c;
}
function roleOf(el) {
 if(el.matches('.area-switch__thumb'))return 'thumb-knob';
 if(el.matches('.area-segmented__item'))return el.hasAttribute('data-selected')?'thumb-knob':'raised-control';
 if(el.matches('.area-input,.area-segmented,.area-switch__track'))return 'recessed-field-track';
 if(el.matches('.area-button'))return 'raised-control';
 if(el.matches('.area-card,.area-code-block,.area-table-wrapper'))return 'container';
 return 'floating-surface';
}
const selector='.area-button,.area-input,.area-switch__track,.area-switch__thumb,.area-segmented,.area-segmented__item,.area-card,.area-menu,.area-popover,.area-dialog,.area-toast,.area-code-block,.area-table-wrapper';
function register(el) {
 if(records.has(el))return records.get(el);
 const meta={id:'receiver-'+recordsCount++,optics:document.createElement('span'),emission:document.createElement('span')};
 el.dataset.m16Id=meta.id;meta.optics.className='m16-optics';meta.optics.setAttribute('aria-hidden','true');
 for(const name of ['island','relief','grain','gloss','edge','edge-inner']){const span=document.createElement('span');span.className='m16-'+name+(name==='edge-inner'?' m16-edge':'');meta.optics.append(span);}
 meta.emission.className='m16-emission';meta.emission.setAttribute('aria-hidden','true');
 for(const child of el.children)if(getComputedStyle(child).position==='static'&&!child.matches('.area-switch__thumb'))child.classList.add('m16-content-lift');
 if(getComputedStyle(el).position==='static')el.classList.add('m16-relative');
 el.classList.add('m16-receiver');el.append(meta.optics,meta.emission);records.set(el,meta);return meta;
}
let recordsCount=0;
const prefs=['(prefers-reduced-transparency: reduce)','(prefers-contrast: more)','(forced-colors: active)'].map(q=>matchMedia(q));
const reduced=()=>$('#plain-fallback').checked||prefs.some(q=>q.matches);
const grainCache=new Map();
function grain(seed) {
 if(grainCache.has(seed))return grainCache.get(seed);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=64;const ctx=canvas.getContext('2d'),im=ctx.createImageData(64,64);let s=seed>>>0;
 for(let i=0;i<im.data.length;i+=4){s=(Math.imul(1664525,s)+1013904223)>>>0;const v=s>>>31?255:0;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}ctx.putImageData(im,0,0);const url=`url("${canvas.toDataURL()}")`;grainCache.set(seed,url);return url;
}
function castFor(el,mode) {
 if(el.matches('.area-card'))return mode==='light'?[[0,1,2,-1,.03,'black'],[0,2,8,0,.03,'black']]:[];
 if(el.matches('.area-switch__thumb,.area-segmented__item[data-selected]'))return [[0,.5,1,-.5,1,'theme']];
 if(el.matches('.area-menu,.area-popover,.area-dialog,.area-toast'))return [[0,20,24,0,1,'theme'],[0,5,8,0,.5,'theme']];
 return [];
}
function paintReceiver(el,material,mode) {
 const meta=register(el),role=roleOf(el),c=rawControls(material,mode,role),notes=[];
 // Clear only our layer gates before sampling the current native state paint.
 delete el.dataset.m16Glass;delete el.dataset.m16Cast;meta.optics.hidden=true;meta.emission.hidden=true;
 const s=getComputedStyle(el),rect=el.getBoundingClientRect();
 const body=s.backgroundColor,baseEdge=s.borderTopColor,edgeWidth=parseFloat(s.getPropertyValue('--area-border-width'))||0;
 const radius=Math.min(parseFloat(s.borderTopLeftRadius)||0,rect.width/2,rect.height/2);
 const padding=Math.min(...['paddingTop','paddingRight','paddingBottom','paddingLeft'].map(k=>parseFloat(s[k])||0));
 let perimeter=Math.max(0,Math.min(4,padding));
 // Controls expose a label/control box inside the shell; measure spare clearance, never add padding.
 if(el.matches('.area-button,.area-input')){
  const content=el.querySelector('.area-button__label,.area-input__control');
  if(content){const r=content.getBoundingClientRect();perimeter=Math.max(0,Math.min(4,r.top-rect.top-edgeWidth,rect.bottom-r.bottom-edgeWidth,r.left-rect.left-edgeWidth,rect.right-r.right-edgeWidth));}
 }
 if(role==='thumb-knob')perimeter=Math.min(1,rect.height/8);
 if(el.matches('.area-switch__track'))perimeter=1;
 const casts=castFor(el,mode),disabled=el.matches(':disabled,[data-disabled]')||el.closest('.area-switch[data-disabled]');
 const dense=el.matches('.area-code-block,.area-table-wrapper');
 const ghost=el.matches('.area-button--ghost')||el.matches('.area-segmented__item:not([data-selected])');
 const reading=['container','floating-surface'].includes(role);
 let amount=c.amount,relief=c.relief.profile!=='flush'&&c.relief.depthPx>0&&c.relief.strength>0,gloss=c.gloss.strength>0,edge=c.stroke.coverage!=='none'&&c.stroke.opacity>0&&edgeWidth>0;
 let glow=c.glow.strength>0,texture=c.grain.strength>0,transmission=c.body.transparency>0;
 if(reduced()||disabled||dense||ghost||amount==='none'){
  notes.push(reduced()?'F0 · preference/plain fallback':disabled?'Disabled · native paint':dense?'Opaque reading plane · no row effects':ghost?'Ghost/idle option · native body':'None · native paint');
  diagnostics.push({id:meta.id,context:el.closest('.m16-context').dataset.context,material,mode,role,family:el.closest('[data-family]').dataset.family,notes,effective:{amount:'none'}});return;
 }
 if(amount==='trace'){
  gloss=false;texture=false;transmission=false;
  if(relief){edge=false;glow=false;}else if(glow){edge=false;} // Trace keeps one cue, never a scaled full stack.
 }
 if(!reading){transmission=false;texture=false;}
 if(role==='recessed-field-track'){gloss=false;edge=false;glow=false;texture=false;notes.push('Static inset only; native field/focus retained');}
 if(role==='raised-control'){glow=false;texture=false;if(relief)notes.push('No cast; local relief has an unresolved 11-budget interpretation');}
 if(role==='thumb-knob'){
  relief=false;glow=false;texture=false;gloss=false; // 11: one nonblurred rim, preserve native shadow-1.
  notes.push('Thumb budget · one rim; extra relief/gloss omitted');
 }
 if(role==='floating-surface'&&casts.length){if(relief||glow)notes.push('Float budget · extra inset/halo omitted');relief=false;glow=false;}
 if(role==='container'&&casts.length+(relief?2:0)+(glow?1:0)>2){notes.push('Container budget · extra inset/halo omitted');relief=false;if(casts.length>=2)glow=false;}
 if(!CSS.supports('mask-composite','exclude')){relief=false;gloss=false;texture=false;edge=false;transmission=false;notes.push('F0 · content mask unsupported');}
 if(perimeter<1){gloss=false;texture=false;relief=false;notes.push('No verified spare perimeter');}
 if(c.gloss.softnessPx>0&&gloss){notes.push('Gloss softness is specified in 13; this specimen does not implement its blur · gloss omitted');gloss=false;}
 if(transmission){
  if(!CSS.supports('backdrop-filter','blur(1px)')||padding<3||!body.match(/^(rgb|color|oklab)/)){transmission=false;notes.push('Glass F0 · unsupported or no reading mask');}
  else {el.dataset.m16Glass='true';notes.push('Glass perimeter + opaque reading island');}
 }
 const style=(k,v)=>el.style.setProperty('--m16-'+k,String(v));
 style('body',body);style('transparency',c.body.transparency);style('blur',c.backdrop.blurPx+'px');
 style('perimeter',perimeter+'px');style('island-inset',padding+'px');style('island-radius',Math.max(0,radius-padding)+'px');style('inner-radius',Math.max(0,radius-edgeWidth/2)+'px');
 meta.optics.querySelector('.m16-island').hidden=!transmission;
 const q=['raised-control','thumb-knob'].includes(role)?rect.height/(role==='thumb-knob'?16:32):1;
 const sign=c.relief.profile==='concave'?-1:1;
 const d=c.relief.depthPx*q*Math.cos(c.light.heightDeg*Math.PI/180)*sign;
 const dx=Math.cos(c.light.angleDeg*Math.PI/180)*d,dy=Math.sin(c.light.angleDeg*Math.PI/180)*d;
 const a=c.relief.strength*(1-c.light.ambient),soft=c.relief.softnessPx*q,spread=c.relief.spreadPx*q;
 const inset=(flip=1)=>`inset ${-dx*flip}px ${-dy*flip}px ${soft}px ${spread}px rgb(255 255 255 / ${a}), inset ${dx*flip}px ${dy*flip}px ${soft}px ${spread}px rgb(0 0 0 / ${a})`;
 style('relief',relief?inset():'none');style('relief-pressed',relief?inset(-1):'none');
 let edgePaint=`color-mix(in srgb, ${baseEdge==='rgba(0, 0, 0, 0)'?'var(--area-border-decorative)':baseEdge} ${c.stroke.opacity*100}%, transparent)`;
 if(c.stroke.paint==='gradient'){
  const g=c.gradients.edge||zeroGradient();
  const stops=g.stops.map(stop=>{
   const color=stop.source==='decorative'?(mode==='dark'?stop.customDark:stop.customLight):'#ffffff';
   return `color-mix(in srgb,${color||'#ffffff'} ${stop.alpha*c.stroke.opacity*100}%,transparent) ${stop.position}%`;
  });edgePaint=`linear-gradient(${g.angleDeg}deg in srgb,${stops.join(',')})`;
 }
 style('edge-paint',edge?edgePaint:'none');style('edge-width',edgeWidth+'px');style('half-edge',edgeWidth/2+'px');
 const edgeNode=meta.optics.querySelector('.m16-edge:not(.m16-edge-inner)'),inner=meta.optics.querySelector('.m16-edge-inner');
 const double=edge&&role!=='thumb-knob'&&c.stroke.profile==='double-rim';
 edgeNode.style.padding=double?'var(--m16-half-edge)':'var(--m16-edge-width)';
 inner.hidden=!double;inner.style.background=double?(c.stroke.paint==='gradient'?edgePaint:`rgb(255 255 255 / ${a})`):'none';inner.style.opacity=double&&c.stroke.paint==='gradient'?'0.5':'1';
 if(edge&&c.stroke.profile==='bevel')notes.push('Bevel approximated by separate local relief');
 const clip=c.stroke.coverage==='top'?'inset(0 0 calc(100% - var(--m16-edge-width)) 0)':c.stroke.coverage==='logical-start'?(s.direction==='rtl'?'inset(0 0 0 calc(100% - var(--m16-edge-width)))':'inset(0 calc(100% - var(--m16-edge-width)) 0 0)'):'none';
 edgeNode.style.clipPath=clip;inner.style.clipPath=clip;
 const angle=(c.light.angleDeg+270)%360;
 style('gloss',gloss?`linear-gradient(${angle}deg,rgb(255 255 255 / ${c.gloss.strength}),transparent ${c.gloss.extent*100}%)`:'none');
 style('grain',texture?grain(c.grain.seed):'none');style('grain-alpha',texture?c.grain.strength:0);style('grain-size',64*c.grain.scalePx+'px');
 let color={'context':'var(--area-border-decorative)','action':'var(--area-action-solid)','selection':'var(--area-selection-solid)','tone':'var(--area-border-decorative)','decorative':c.glow.custom||'#7695c4'}[c.glow.source];
 if(c.glow.source==='tone'&&glow)notes.push('Neutral receiver · tone resolves to neutral edge');
 // Emission stays away from the semantic core; only sparse containers have remaining budget.
 if(role!=='container')glow=false;
 style('glow',glow?`0 0 ${c.glow.softnessPx*q}px ${c.glow.spreadPx*q}px color-mix(in srgb,${color} ${c.glow.strength*100}%,transparent)`:'none');
 meta.emission.hidden=!glow;
 meta.optics.hidden=!(edge||relief||gloss||texture||transmission);
 const sc=c.surfaceControls;
 if(casts.length&&(sc.direction!=='source'||sc.liftGain!==1||sc.softnessGain!==1||sc.spreadDeltaPx!==0||sc.strengthGain!==1)){
  if(CSS.supports('color','rgb(from black r g b / calc(alpha * 1))')){
   const out=casts.map(([x,y,b,sp,alpha,ink])=>{
    if(sc.direction==='key'){const lift=Math.hypot(x,y)*Math.cos(c.light.heightDeg*Math.PI/180);x=-Math.cos(c.light.angleDeg*Math.PI/180)*lift;y=-Math.sin(c.light.angleDeg*Math.PI/180)*lift;}
    const col=ink==='black'?`rgb(0 0 0 / ${clamp(alpha*sc.strengthGain,0,1)})`:`rgb(from var(--area-shadow-color) r g b / calc(alpha * ${alpha*sc.strengthGain}))`;
    return `${x*sc.liftGain}px ${y*sc.liftGain}px ${b*sc.softnessGain}px ${sp+sc.spreadDeltaPx}px ${col}`;
   });style('cast',sc.strengthGain===0?'none':out.join(','));el.dataset.m16Cast='true';
  }else notes.push('Relative-color cast control unsupported · original cast');
 }
 if(!notes.length)notes.push('Role recipe · original Area geometry');
 if(edge)notes.push('Rim inside native edge · allocation approximation');
 diagnostics.push({id:meta.id,context:el.closest('.m16-context').dataset.context,material,mode,role,family:el.closest('[data-family]').dataset.family,notes,effective:{perimeterPx:perimeter,amount,transmission,blur:transmission?c.backdrop.blurPx:0,relief,gloss,edge,glow,texture,castLobes:casts.length}});
}
function render() {
 diagnostics.length=0;
 for(const context of $$('.m16-context:not([hidden])')){
  for(const column of context.querySelectorAll('[data-material]')){
   for(const receiver of column.querySelectorAll(selector))paintReceiver(receiver,column.dataset.material,context.dataset.areaTheme);
   for(const tile of column.querySelectorAll('.m16-tile')){
    const ids=new Set([...tile.querySelectorAll('[data-m16-id]')].map(el=>el.dataset.m16Id));
    const subset=diagnostics.filter(d=>ids.has(d.id));
    const unique=[...new Set(subset.flatMap(d=>d.notes))];tile.querySelector('[data-note]').textContent=unique.slice(0,3).join(' · ');
   }
  }
 }
 const limited=diagnostics.filter(d=>d.notes.some(n=>/budget|omitted|F0|None|Ghost|Opaque|ambiguity/.test(n))).length;
 $('#control-feedback').textContent=`${diagnostics.length} painted receivers inspected in the visible contexts. ${limited} retain a limit or fallback. Unset values come from each role’s light/dark preset; only edited leaves are shared overrides.`;
 window.M16_DIAGNOSTICS=clone(diagnostics);
}
let frame=0;
function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(render);}
function showContexts(){const key=[$('#mode').value,$('#density').value,$('#backdrop').value].join('-');for(const c of $$('.m16-context'))c.hidden=!$('#all-contexts').checked&&c.dataset.context!==key;schedule();}
for(const id of ['mode','density','backdrop','all-contexts'])$('#'+id).addEventListener('change',showContexts);
$('#plain-fallback').addEventListener('change',schedule);for(const q of prefs)q.addEventListener('change',schedule);
function fieldValue(field){const role=$('#control-role').value==='all'?'floating-surface':$('#control-role').value;const c=rawControls($('#control-material').value,$('#mode').value,role);return get(c,field.path)??(field.color?'#ffffff':get({gradients:{edge:zeroGradient()}},field.path)??0);}
function patchFor(path){const p=patches[$('#control-material').value],role=$('#control-role').value;return role==='all'||path.startsWith('light.')?p.global:(p.roles[role]??={});}
function controls(){const host=$('#control-fields');host.replaceChildren();let group;
 for(const [i,f] of fields.entries()){
  if(group?.dataset.group!==f.group){group=document.createElement('fieldset');group.dataset.group=f.group;const legend=document.createElement('legend');legend.textContent=f.group;group.append(legend);host.append(group);}
  const row=document.createElement('div');row.className='m16-field';const label=document.createElement('label');label.htmlFor='m16-field-'+i;label.textContent=f.label;row.append(label);
  const output=document.createElement('output');output.htmlFor=label.htmlFor;
  const input=document.createElement(f.options?'select':'input');input.id=label.htmlFor;input.dataset.control=f.path;
  if(f.options)for(const value of f.options){const o=document.createElement('option');o.value=value;o.textContent=value;input.append(o);}
  else {input.type=f.color?'color':'range';if(!f.color){input.min=f.min;input.max=f.max;input.step=f.step;}}
  input.value=fieldValue(f);output.textContent=String(input.value)+(f.unit||'');row.append(output,input);
  const reset=document.createElement('button');reset.type='button';reset.className='m16-inherit';reset.textContent=Object.hasOwn(patchFor(f.path),f.path)?'Clear override':'Preset';reset.disabled=!Object.hasOwn(patchFor(f.path),f.path);reset.setAttribute('aria-label','Clear '+f.label+' override');
  reset.addEventListener('click',()=>{delete patchFor(f.path)[f.path];controls();schedule();});row.append(reset);
  input.addEventListener('input',()=>{
   const value=f.options||f.color?input.value:Number(input.value);if(typeof value==='number'&&!Number.isFinite(value))return;
   const patch=patchFor(f.path);patch[f.path]=value;
   // Keep gradient stops monotonic; editing one clamps it to the other, not an unsorted export.
   if(f.path.endsWith('.position')){
    const c=rawControls($('#control-material').value,$('#mode').value,$('#control-role').value==='all'?'floating-surface':$('#control-role').value);
    const stops=c.gradients.edge.stops;
    if(stops[0].position>stops[1].position){patch[f.path]=f.path.includes('.0.')?stops[1].position:stops[0].position;input.value=patch[f.path];}
   }
   output.textContent=String(input.value)+(f.unit||'');reset.disabled=false;reset.textContent='Clear override';schedule();
  });group.append(row);
 }
}
for(const id of ['control-material','control-role','mode'])$('#'+id).addEventListener('change',controls);
$('#reset-controls').addEventListener('click',()=>{const p=patches[$('#control-material').value],r=$('#control-role').value;if(r==='all'){p.global={};p.roles={};}else delete p.roles[r];controls();schedule();});
$('#controls-toggle').addEventListener('click',()=>{const open=$('#control-panel').hidden;$('#control-panel').hidden=!open;$('#controls-toggle').setAttribute('aria-expanded',String(open));});
$('#controls-close').addEventListener('click',()=>{$('#control-panel').hidden=true;$('#controls-toggle').setAttribute('aria-expanded','false');$('#controls-toggle').focus();});
$('#export-controls').addEventListener('click',()=>{const doc={kind:'area-material-specimen-draft',schemaVersion:1,researchCommit:data.researchCommit,areaCommit:data.areaCommit,presets:data.presets,patches,policy:'task-16-bounded-research-renderer',status:'unreviewed; not a production Theme schema'};const url=URL.createObjectURL(new Blob([JSON.stringify(doc,null,2)+'\n'],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='area-material-specimen.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
let announceTimer;
function announce(text){$('#demo-feedback').textContent=text;clearTimeout(announceTimer);announceTimer=setTimeout(()=>$('#demo-feedback').textContent='',2400);}
// Local specimen interaction, deliberately not hydration or an overlay implementation.
for(const group of $$('.area-segmented')){
 const choose=(b,focus=false)=>{for(const item of group.querySelectorAll('[role="radio"]')){item.setAttribute('aria-checked',String(item===b));item.toggleAttribute('data-selected',item===b);item.tabIndex=item===b?0:-1;}if(focus)b.focus();schedule();};
 group.addEventListener('click',e=>{const b=e.target.closest('[role="radio"]');if(b&&!b.disabled)choose(b);});
 group.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();const items=[...group.querySelectorAll('[role="radio"]:not(:disabled)')],i=items.indexOf(document.activeElement),dir=getComputedStyle(group).direction==='rtl'?-1:1;const step=['ArrowDown','ArrowRight'].includes(e.key)?1:-1;const next=e.key==='Home'?0:e.key==='End'?items.length-1:(i+step*(['ArrowRight','ArrowLeft'].includes(e.key)?dir:1)+items.length)%items.length;choose(items[next],true);});
}
for(const menu of $$('.area-menu')){
 let search='',timer;
 menu.addEventListener('keydown',e=>{const items=[...menu.querySelectorAll('[role="menuitem"]:not(:disabled)')];const i=items.indexOf(document.activeElement);let next;
 if(e.key==='ArrowDown')next=items[(i+1)%items.length];else if(e.key==='ArrowUp')next=items[(i-1+items.length)%items.length];else if(e.key==='Home')next=items[0];else if(e.key==='End')next=items.at(-1);else if(e.key.length===1&&!e.ctrlKey&&!e.metaKey&&e.key!==' '){search+=e.key.toLowerCase();clearTimeout(timer);timer=setTimeout(()=>search='',1000);next=[...items.slice(i+1),...items.slice(0,i+1)].find(b=>b.textContent.trim().toLowerCase().startsWith(search));}if(next){e.preventDefault();next.focus();}});
}
$('#specimens').addEventListener('click',e=>{const b=e.target.closest('.area-button,.area-menu__item');if(b&&!b.disabled)announce(b.textContent.trim()+' · local specimen only');});
$('#specimens').addEventListener('change',e=>{if(e.target.matches('.area-switch__control'))schedule();});
window.addEventListener('resize',schedule);
let auditResult;
$('#run-audit').addEventListener('click',()=>{
 const prev=$$('.m16-context').map(c=>c.hidden),fallback=$('#plain-fallback').checked;
 for(const c of $$('.m16-context'))c.hidden=false;
 $('#plain-fallback').checked=false;render();
 const receivers=$$('.m16-receiver'),sample=()=>receivers.map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {id:el.dataset.m16Id,width:r.width,height:r.height,color:s.color};});
 const painted=sample(),resolved=clone(diagnostics);
 const captures=[];
 for(const mode of ['light','dark'])for(const [material,family] of [['glass','card'],['tactile','button-solid']]){
  const root=$(`[data-context="${mode}-default-image"] [data-material="${material}"] [data-family="${family}"] .m16-receiver`);
  captures.push(areaCapture.capture(root,{source:'area-materials-16',variant:material+'-'+family,theme:mode,state:'rest',note:'Research overlays; authored image backdrop; exact task-13 baseline unless patches listed in audit.'}));
 }
 $('#plain-fallback').checked=true;render();const plain=sample();
 const mismatches=painted.filter((v,i)=>v.width!==plain[i].width||v.height!==plain[i].height||v.color!==plain[i].color);
 const ids=$$('[id]').map(el=>el.id);
 const result={checked:new Date().toISOString(),areaCommit:data.areaCommit,researchCommit:data.researchCommit,cssSha256:data.cssSha256,patches:clone(patches),checks:{contexts:$$('.m16-context').length,tiles:$$('.m16-tile').length,receivers:receivers.length,duplicateIds:ids.length-new Set(ids).size,geometryOrForegroundDifferences:mismatches.length,glassWhileFallback:$$('[data-m16-glass]').length,viewportOverflow:document.documentElement.scrollWidth>innerWidth},mismatches,resolved,captures};
 auditResult=result;$('#audit-data').textContent=JSON.stringify(result,null,2)+'\n';$('#audit-result').textContent=JSON.stringify(result.checks,null,2)+'\nArea capture records: '+captures.length+'; download includes all effective role decisions. This is not a contrast or AT certification.';
 $('#download-audit').disabled=false;
 $('#plain-fallback').checked=fallback;$$('.m16-context').forEach((c,i)=>c.hidden=prev[i]);render();
});
$('#download-audit').addEventListener('click',()=>{if(!auditResult)return;const url=URL.createObjectURL(new Blob([JSON.stringify(auditResult,null,2)+'\n'],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='specimen-audit.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
controls();showContexts();
})();
