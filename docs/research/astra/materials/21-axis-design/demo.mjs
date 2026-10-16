const $=id=>document.getElementById(id);
const fixture=await fetch('surface-parts.json').then(r=>r.json());
let gate=0,baseline=false,split=false,index=0;
function probe(kind='shadow',value=0,off=false){
 gate=value;baseline=off;$('technique').value=kind;$('gate').textContent='Gate: '+gate;$('baseline').textContent='Baseline: '+(off?'on':'off');
 $('probe-stage').className='test-stage '+(kind.startsWith('bad-')||kind==='zero-blur'?kind:'probe-'+kind)+(off?' baseline':'');
 $('probe-stage').style.setProperty('--gate',value);
 const c=getComputedStyle($('probe-stage').firstElementChild),p=getComputedStyle($('probe-stage').firstElementChild,'::after');
 $('computed').textContent=JSON.stringify({gate:value,boxShadow:c.boxShadow,backgroundImage:c.backgroundImage,filter:c.filter,layerOpacity:p.opacity,layerFilter:p.filter,layerBackdropFilter:p.backdropFilter},null,2);
}
function surface(i=0,composed=false){$('surface-case').value=String(i);index=i;split=composed;const c=fixture.shadows[i],s=$('surface-stage');s.style.cssText='';for(const [k,v]of Object.entries(c.tokens))s.style.setProperty(k,v);s.style.setProperty('--area-border-width',c.borderWidth);s.style.setProperty('--area-stroke-width','1px');s.style.setProperty('--area-shadow-color','light-dark(rgb(0 0 0 / 0.06),rgb(0 0 0 / 0.2))');s.style.setProperty('--area-border-float','light-dark(rgb(225 225 225),rgb(50 50 50))');s.style.setProperty('--fixture-shadow',composed?c.composed:c.original);$('split').textContent=composed?'Showing split':'Showing original';}
function mode(dark){document.documentElement.dataset.mode=dark?'dark':'light';$('mode').textContent=dark?'Switch to light':'Switch to dark';}
fixture.shadows.forEach((c,i)=>{const o=document.createElement('option');o.value=i;o.textContent=c.surface+' / '+c.id;$('surface-case').append(o);});
$('mode').onclick=()=>mode(document.documentElement.dataset.mode!=='dark');$('technique').onchange=()=>probe($('technique').value,gate,baseline);$('gate').onclick=()=>{gate=1-gate;$('gate').textContent='Gate: '+gate;probe($('technique').value,gate,baseline);};$('baseline').onclick=()=>{baseline=!baseline;$('baseline').textContent='Baseline: '+(baseline?'on':'off');probe($('technique').value,gate,baseline);};$('surface-case').onchange=()=>surface(+$('surface-case').value,split);$('split').onclick=()=>surface(index,!split);
window.lab={probe,surface,mode,fixture,ready:true};probe();surface();
