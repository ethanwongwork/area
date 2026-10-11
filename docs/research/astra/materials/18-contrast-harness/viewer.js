const $=id=>document.getElementById(id);
const load=async file=>{const r=await fetch(file);if(!r.ok)throw Error(`${file}: ${r.status}`);return r.json()};
const [summary,bindings,measurements,inputs]=await Promise.all(['summary.json','bindings.json','measurements.json','inputs.json'].map(load));
const fixtures=Object.fromEntries(bindings.fixtures.map(f=>[f.id,f]));
const title=id=>id.charAt(0).toUpperCase()+id.slice(1);
const rgb=c=>`rgb(${c.map(v=>(v*255).toFixed(4)).join(', ')})`;
for(const id of [...new Set(summary.results.map(r=>r.preset))])$('preset').add(new Option(title(id),id));
$('preset').value='glass';
let data,role='container',current,serial=0;
const backdrop=r=>r.backdropDependent?rgb(r.backdrop):'Any (opaque footprint)';
const matching=f=>{
  const target=$('target').value;
  if(['divider','scrim'].includes(role))return false;
  if(role==='text')return target==='text'&&f.kind==='text';
  if(role==='glyph')return target==='edge'&&f.kind==='glyph';
  if(role==='edge')return target==='edge'&&f.kind==='edge';
  return f.role===role&&(target==='text'?f.kind==='text':f.kind!=='text');
};
function detail(){
  $('detail-title').textContent=role;
  const records=data.scenarios[$('scenario').value];
  const choices=bindings.fixtures.filter(matching).sort((a,b)=>measurements[records[a.id]].ratio/a.threshold-measurements[records[b.id]].ratio/b.threshold);
  $('pair').replaceChildren(...choices.map(f=>new Option(`${f.fg} / ${f.bg} · ${f.role}`,f.id)));
  if(!choices.length){$('description').textContent='N/A: this role has no bound required target of the selected kind.';$('measurement').textContent='';$('source').hidden=true;document.querySelector('.swatches').hidden=true;return;}
  $('source').hidden=false;document.querySelector('.swatches').hidden=false;paint();
}
function paint(){
  const f=fixtures[$('pair').value], r=measurements[data.scenarios[$('scenario').value][f.id]];
  $('description').textContent=`${r.status} · ${r.ratio.toFixed(6)}:1 / ${f.threshold}:1 required. ${f.note}.`;
  $('measurement').textContent=`${r.adjacency}; gradient t=${r.position.toFixed(8)}; ${r.method}. Backdrop: ${backdrop(r)}. Ground: ${rgb(r.ground)}.`;
  $('source').href=f.source;
  $('backdrop').style.background=rgb(r.backdrop);$('ground').style.background=rgb(r.ground);
  $('ink').style.background=rgb(r.ground);$('ink').style.color=inputs.themes[$('mode').value][f.fg];
}
function matrix(){
  $('matrix').replaceChildren();
  const scenario=$('scenario').value,target=$('target').value;
  for(const [name,d] of Object.entries(current.roles)){
    const a=d[scenario][target],r=a.worst, tr=document.createElement('tr');tr.classList.toggle('selected',role===name);
    const td=document.createElement('td'),button=document.createElement('button');button.textContent=name;
    button.onclick=()=>{role=name;matrix();detail()};td.append(button);tr.append(td);
    for(const [text,css] of [[a.status,a.status.toLowerCase()],
      [r?`${r.ratio.toFixed(4)} / ${fixtures[r.fixture].threshold}`:'—',''],[r?backdrop(r):'—','']]){
      const cell=document.createElement('td');cell.textContent=text;cell.className=css;tr.append(cell);
    }
    $('matrix').append(tr);
  }
  const rec=Object.values(data.scenarios[scenario]).map(id=>measurements[id]);
  $('status').textContent=`${title(current.preset)} / ${current.mode} · ${rec.filter(r=>r.status==='PASS').length} pass, ${rec.filter(r=>r.status==='FAIL').length} fail, ${rec.filter(r=>r.status==='UNRESOLVED').length} unresolved · ${rec.length} host-pair probes.`;
  const r=current.roles.edge.outsideScene.worst;
  $('outside').textContent=`Every exterior required-edge probe fails without backing: ${r.ratio.toFixed(6)}:1 at ${rgb(r.backdrop)} in this example. This is an interior luminance collision, not an endpoint assumption.`;
}
async function update(){
  const revision=++serial,preset=$('preset').value,mode=$('mode').value;
  const result=await load(`results-${preset}-${mode}.json`);if(revision!==serial)return;
  data=result;current=summary.results.find(r=>r.preset===preset&&r.mode===mode);matrix();detail();
}
for(const id of ['preset','mode','scenario','target'])$(id).onchange=()=>update().catch(error=>{$('status').textContent=error.message});
$('pair').onchange=paint;
$('snapshot').textContent=`Checked 2026-10-11 · Area ${summary.areaCommit} · presets ${summary.researchCommit} · neutral / blue only.`;
await update();
