'use strict';
// All fixture dimensions/paint values are authored stress inputs, not Area presets.
const $=id=>document.getElementById(id), rows=$('rows'), panes=$('panes'), scroller=$('scroller');
const CONFIG={version:1,sampleMs:1500,warmupMs:350,repeats:3,scrollPxPerSec:360,seed:7112026,stage:[840,480],rowHeight:32,rowPitch:40};
const cases=[];
for(const radius of [0,4,12,24,48])for(const count of [1,4,16,64])for(const mode of ['scroll','paint'])cases.push({family:'blur',radius,count,rows:200,mode});
for(const layers of [0,1,2,3,4,5,6])for(const n of [200,500,1000])for(const mode of ['scroll','paint'])cases.push({family:'shadow',layers,rows:n,mode});
for(const scale of [0,24])for(const count of [1,4,16])for(const mode of ['scroll','paint'])cases.push({family:'refraction',scale,count,rows:200,mode});
for(const kind of ['none','image','raster','live'])for(const n of [200,1000])for(const mode of ['scroll','paint'])cases.push({family:'grain',kind,rows:n,mode});
for(const kind of ['solid','double','mask'])for(const n of [200,1000])for(const mode of ['scroll','paint'])cases.push({family:'stroke',kind,rows:n,mode});
for(const radius of [0,24])for(const count of [1,64])cases.push({family:'blur',radius,count,rows:200,mode:'transform'});
cases.forEach((c,i)=>c.id='c'+String(i).padStart(3,'0'));
let running=false,abort=false,runData=null,allLong=[],resizeEpoch=0;
addEventListener('resize',()=>resizeEpoch++);
try{new PerformanceObserver(list=>{for(const e of list.getEntries())allLong.push({start:e.startTime,duration:e.duration});}).observe({type:'longtask',buffered:true});}catch{}
function random(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function shuffled(a,seed){const b=[...a],r=random(seed);for(let i=b.length-1;i>0;i--){let j=Math.floor(r()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function quantile(a,q){const s=[...a].sort((a,b)=>a-b);return s[Math.min(s.length-1,Math.floor((s.length-1)*q))]??null;}
function summarize(a,period){return{samples:a.length,mean:a.reduce((x,y)=>x+y,0)/a.length,p50:quantile(a,.5),p95:quantile(a,.95),p99:quantile(a,.99),max:Math.max(...a),over1_5period:a.filter(v=>v>period*1.5).length,over33_34:a.filter(v=>v>33.34).length,over50:a.filter(v=>v>50).length};}
const noiseSvg='<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" seed="7" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>';
const svgURL='data:image/svg+xml,'+encodeURIComponent(noiseSvg);
const canvas=document.createElement('canvas');canvas.width=canvas.height=96;const cx=canvas.getContext('2d'),im=cx.createImageData(96,96),rand=random(7);for(let i=0;i<im.data.length;i+=4){im.data[i]=im.data[i+1]=im.data[i+2]=Math.floor(rand()*256);im.data[i+3]=255;}cx.putImageData(im,0,0);const rasterURL=canvas.toDataURL();
const preload=Promise.all([svgURL,rasterURL].map(url=>new Promise(resolve=>{const i=new Image();i.onload=i.onerror=resolve;i.src=url;})));
const svgArt='<svg viewBox="0 0 96 52" xmlns="http://www.w3.org/2000/svg"><g class="art"><rect width="96" height="52" fill="#286483"/><path d="M0 8H96M0 24H96M0 40H96M16 0V52M40 0V52M64 0V52M88 0V52" stroke="#9aefdf" stroke-width="3"/><circle cx="46" cy="26" r="15" fill="#f99b85"/></g></svg>';
function mount(c,repeat){
 rows.className='';rows.removeAttribute('style');panes.replaceChildren();rows.replaceChildren();scroller.scrollTop=0;
 rows.className=['blur','refraction'].includes(c.family)?'scene':c.family==='grain'?'grain-'+c.kind:c.family==='stroke'?'stroke-'+c.kind:'';
 const frag=document.createDocumentFragment();
 for(let i=0;i<c.rows;i++){const r=document.createElement('div');r.className='row';r.innerHTML='<span><b>Record '+String(i+1).padStart(4,'0')+'</b> · Project reference · Available</span><i class="meter"></i>';if(c.family==='grain'&&c.kind==='live')r.insertAdjacentHTML('afterbegin','<svg class="noise-art"><rect width="100%" height="100%" filter="url(#noise)"/></svg>');frag.append(r);}rows.append(frag);
 if(c.family==='shadow'){
  const blurs=[2,4,8,12,16,24];let shadows=Array.from({length:c.layers},(_,i)=>`0 ${i+1}px ${blurs[i]}px -1px rgb(0 0 0 / var(--shade-alpha))`).join(',')||'none';
  // One stylesheet variable changes every row, avoiding per-frame JS node loops.
  rows.style.setProperty('--shadow',shadows);for(const r of rows.children)r.style.boxShadow='var(--shadow)';
 }
 if(c.family==='grain'&&['image','raster'].includes(c.kind))rows.style.setProperty('--grain',`url("${c.kind==='image'?svgURL:rasterURL}")`);
 if(['blur','refraction'].includes(c.family))for(let i=0;i<c.count;i++){
  const p=document.createElement('div');p.className='pane '+(c.family==='blur'?'blur':'');p.style.setProperty('--blur',c.radius+'px');
  if(c.mode==='transform')p.classList.add('transform');
  if(c.family==='refraction'){p.innerHTML=svgArt;if(c.scale)p.querySelector('.art').setAttribute('filter','url(#lens)');}else p.textContent='Surface '+(i+1);
  panes.append(p);
 }
 $('displace').setAttribute('scale',String(c.scale||0));$('liveNoise').setAttribute('baseFrequency','.75');
 const max=scroller.scrollHeight-scroller.clientHeight;const offset=repeat===0?0:repeat===1?Math.max(0,max/2-700):Math.max(0,max-1800);scroller.scrollTop=offset;
 return{offset,max,visibleRows:Math.ceil(scroller.clientHeight/CONFIG.rowPitch)+1,computed:panes.firstElementChild?getComputedStyle(panes.firstElementChild).backdropFilter:null};
}
function draw(c,t,geo){
 if(c.mode==='scroll'){scroller.scrollTop=Math.min(geo.max,geo.offset+t*CONFIG.scrollPxPerSec/1000);return;}
 if(c.mode!=='paint')return;
 const wave=(Math.sin(t/1000*Math.PI*2)+1)/2;
 if(c.family==='blur'){for(const p of panes.children)p.style.setProperty('--blur',(c.radius*(.5+.5*wave))+'px');}
 if(c.family==='shadow')rows.style.setProperty('--shade-alpha',(.12+.18*wave).toFixed(4));
 if(c.family==='refraction')$('displace').setAttribute('scale',String(c.scale*wave));
 if(c.family==='grain'){if(c.kind==='live')$('liveNoise').setAttribute('baseFrequency',String(.6+.2*wave));else rows.style.setProperty('--grain-x',(wave*32)+'px');}
 if(c.family==='stroke')rows.style.setProperty('--angle',(90+90*wave)+'deg');
}
async function frames(ms,c,geo,collect=false,phase=0){const initialResize=resizeEpoch;return new Promise(resolve=>{let first=null,last=null,intervals=[],callback=[],valid=true,focusLost=0,hidden=0;function step(t){if(first===null)first=t;const elapsed=t-first;if(document.visibilityState!=='visible'){valid=false;hidden++;}if(!document.hasFocus()){valid=false;focusLost++;}if(collect&&last!==null)intervals.push(t-last);last=t;const before=performance.now();if(resizeEpoch!==initialResize)valid=false;if(c)draw(c,elapsed+phase,geo);if(collect)callback.push(performance.now()-before);if(abort||elapsed>=ms){resolve({intervals,callback,valid,focusLost,hidden,elapsed,aborted:abort});return;}requestAnimationFrame(step);}requestAnimationFrame(step);});}
async function save(){const response=await fetch('/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(runData)});if(!response.ok)throw Error('Local result save failed '+response.status);}
function environment(){const r=$('stage').getBoundingClientRect();let glInfo=null;try{const gl=document.createElement('canvas').getContext('webgl');const e=gl&&gl.getExtension('WEBGL_debug_renderer_info');if(e)glInfo={vendor:gl.getParameter(e.UNMASKED_VENDOR_WEBGL),renderer:gl.getParameter(e.UNMASKED_RENDERER_WEBGL)};}catch{}return{userAgent:navigator.userAgent,hardwareConcurrency:navigator.hardwareConcurrency,deviceMemory:navigator.deviceMemory??null,dpr:devicePixelRatio,viewport:[innerWidth,innerHeight],screen:[screen.width,screen.height],stage:[r.x,r.y,r.width,r.height],visibility:document.visibilityState,focus:document.hasFocus(),reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,backdrop:CSS.supports('backdrop-filter','blur(4px)'),webkitBackdrop:CSS.supports('-webkit-backdrop-filter','blur(4px)'),mask:CSS.supports('mask-composite','exclude'),longtask:PerformanceObserver.supportedEntryTypes.includes('longtask'),webgl:glInfo};}
let previewIndex=0;
const previews=[{family:'blur',radius:24,count:64,rows:200,mode:'scroll'},{family:'refraction',scale:24,count:16,rows:200,mode:'scroll'},{family:'grain',kind:'live',rows:200,mode:'scroll'},{family:'stroke',kind:'mask',rows:200,mode:'scroll'}];
$('preview').onclick=()=>{const c=previews[previewIndex++%previews.length];mount(c,0);$('case').textContent='Preview (cycle): '+JSON.stringify(c);};
$('stop').onclick=()=>{abort=true;};
$('start').onclick=async()=>{
 if(running)return;const label=$('label').value;if(!/^[a-z0-9-]{1,40}$/.test(label)){alert('Use a short lowercase run label.');return;}
 const rect=$('stage').getBoundingClientRect();if(rect.right>innerWidth||rect.bottom>innerHeight){$('status').textContent='Viewport too small: entire 840×480 stage must be visible. Enlarge window and retry.';return;}
 running=true;abort=false;$('start').disabled=true;$('stop').disabled=false;$('preview').disabled=true;await preload;
 runData={schema:1,label,started:new Date().toISOString(),config:CONFIG,environment:environment(),cases,trials:[],calibrations:[],complete:false};
 try{
 for(let repeat=0;repeat<CONFIG.repeats&&!abort;repeat++){
  rows.replaceChildren();panes.replaceChildren();const idle=await frames(1500,null,null,true);const period=quantile(idle.intervals,.5);runData.calibrations.push({repeat,period,valid:idle.valid,stats:summarize(idle.intervals,period)});
  const order=shuffled(cases,CONFIG.seed+repeat);
  for(const c of order){if(abort)break;$('status').textContent=`Running ${runData.trials.length+1}/${cases.length*CONFIG.repeats} · repeat ${repeat+1}`;$('case').textContent=JSON.stringify(c);const geo=mount(c,repeat);await frames(CONFIG.warmupMs,c,geo);const start=performance.now();const f=await frames(CONFIG.sampleMs,c,geo,true,CONFIG.warmupMs);const end=performance.now();const long=allLong.filter(e=>e.start>=start&&e.start<end);const trial={caseId:c.id,repeat,order:runData.trials.length,valid:f.valid&&!f.aborted,focusLost:f.focusLost,hidden:f.hidden,aborted:f.aborted,elapsed:f.elapsed,interval:summarize(f.intervals,period),callback:summarize(f.callback,period),longTasks:runData.environment.longtask?{count:long.length,totalMs:long.reduce((a,b)=>a+b.duration,0)}:null,visibleRows:geo.visibleRows,scrollStart:geo.offset,scrollEnd:scroller.scrollTop,backdropComputed:geo.computed};runData.trials.push(trial);$('result').textContent=JSON.stringify(trial,null,2);await save();}
 }
 runData.complete=!abort;runData.finished=new Date().toISOString();await save();$('status').textContent=(abort?'Stopped':'Complete')+` · ${runData.trials.length} trials saved as ${label}.json`;panes.replaceChildren();rows.replaceChildren();$('case').textContent='Suite finished; results saved locally.';
 }catch(e){$('status').textContent='Error: '+e.message;runData.error=String(e);try{await save();}catch{}}
 finally{running=false;$('start').disabled=false;$('stop').disabled=true;$('preview').disabled=false;}
};
$('status').textContent=`Ready. ${cases.length} cases × ${CONFIG.repeats} repeats; about ${Math.ceil(cases.length*CONFIG.repeats*(CONFIG.sampleMs+CONFIG.warmupMs)/60000)} minutes. Keep tab visible and focused.`;
