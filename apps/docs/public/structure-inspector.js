// Development-only gallery inspector. Reads live layout; never changes specimen styles.
const toggle = document.createElement('button');
toggle.type = 'button'; toggle.className = 'docs-structure-toggle'; toggle.textContent = 'Inspect structure';
toggle.setAttribute('aria-pressed', 'false');
const panel = document.createElement('aside'); panel.className = 'docs-structure-panel'; panel.hidden = true;
panel.setAttribute('aria-label', 'Component structure');
panel.innerHTML = '<header><strong>Component structure</strong><button type="button" data-close aria-label="Close structure inspector">×</button></header><p>Hover a component; click to pin. Select any layer below. On Pick another component, press Down to select the first visible specimen. Escape exits.</p><p class="docs-structure-legend">Orange margin · yellow border · green padding · blue content</p><button type="button" data-pick>Pick another component</button><div data-tree aria-label="Component layers"></div><pre data-values></pre><small>Computed CSS pixels. Gaps are reported below; overlays show axis-aligned box geometry. Negative margins are reported, not painted. Pseudo-elements are listed when present. This is not an accessibility-tree inspector.</small>';
const overlay = document.createElement('div'); overlay.className = 'docs-structure-overlay'; overlay.setAttribute('aria-hidden','true');
for (const name of ['margin','border','padding','content']) { const box=document.createElement('div'); box.dataset.box=name; overlay.append(box); }
document.body.append(toggle, panel, overlay);
let active=false, pinned=false, selected=null, root=null, frame=0;
const tree=panel.querySelector('[data-tree]'), values=panel.querySelector('[data-values]');
const n = value => Number.parseFloat(value) || 0;
const round = value => Math.round(value*100)/100;
const name = el => el.localName + [...el.classList].map(c=>'.'+c).join('');
function hide() { overlay.hidden=true; }
function close() { active=false; pinned=false; selected=null; root=null; panel.hidden=true; hide(); toggle.setAttribute('aria-pressed','false'); toggle.focus(); }
function paint() {
  frame=0;
  if (!active || !selected?.isConnected) { hide(); return; }
  const r=selected.getBoundingClientRect(), s=getComputedStyle(selected);
  if (!r.width || !r.height) { hide(); return; }
  overlay.hidden=false;
  const b=['Top','Right','Bottom','Left'].map(side=>n(s['border'+side+'Width']));
  const p=['Top','Right','Bottom','Left'].map(side=>n(s['padding'+side]));
  const m=['Top','Right','Bottom','Left'].map(side=>Math.max(0,n(s['margin'+side])));
  const rects=[
    [r.x-m[3],r.y-m[0],r.width+m[1]+m[3],r.height+m[0]+m[2]],
    [r.x,r.y,r.width,r.height],
    [r.x+b[3],r.y+b[0],r.width-b[1]-b[3],r.height-b[0]-b[2]],
    [r.x+b[3]+p[3],r.y+b[0]+p[0],r.width-b[1]-b[3]-p[1]-p[3],r.height-b[0]-b[2]-p[0]-p[2]],
  ];
  [...overlay.children].forEach((el,i)=>{const [x,y,w,h]=rects[i]; Object.assign(el.style,{left:x+'px',top:y+'px',width:Math.max(0,w)+'px',height:Math.max(0,h)+'px'});});
  const rows=[name(selected), `${round(r.width)} × ${round(r.height)} CSS px`, '',
    ...['display','position','box-sizing','padding','margin','row-gap','column-gap','align-items','justify-content','grid-template-columns','border-width','border-style','border-color','border-radius','background-color','color','font-family','font-size','font-weight','line-height','letter-spacing','box-shadow','overflow','transform'].map(key=>key+': '+s.getPropertyValue(key))];
  const svg=selected instanceof SVGElement ? selected.closest('svg') : selected.querySelector(':scope > svg');
  if(svg) rows.push('SVG viewBox: '+svg.getAttribute('viewBox'));
  for(const pseudo of ['::before','::after']) {const cs=getComputedStyle(selected,pseudo); if(!['none','normal'].includes(cs.content)) rows.push(pseudo+': '+cs.content+' · '+cs.width+' × '+cs.height+' · '+cs.position);}
  values.textContent=rows.join('\n');
}
function schedule() { if(!frame) frame=requestAnimationFrame(paint); }
function populate() {
  tree.replaceChildren();
  function visit(el,depth) {
    if(tree.childElementCount>=150) return;
    const row=document.createElement('button'); row.type='button'; row.style.paddingInlineStart=(8+depth*12)+'px'; row.textContent=name(el); row.title=row.textContent;
    row.setAttribute('aria-pressed',String(el===selected));
    row.onclick=()=>{selected=el;pinned=true;for(const button of tree.children) button.setAttribute("aria-pressed",String(button===row));schedule();};
    tree.append(row); for(const child of el.children) visit(child,depth+1);
  }
  if(root) visit(root,0);
}
function pick(target) {
  if (!(target instanceof Element)) return false;
  const specimen=target.closest('.docs-visual-gallery__tile-preview');
  if (!specimen) return false;
  selected=target; root=specimen; return true;
}
toggle.onclick=()=>{if(active){close();return;} active=true; panel.hidden=false; toggle.setAttribute('aria-pressed','true'); values.textContent='Hover a specimen to inspect its layers.';};
panel.querySelector('[data-close]').onclick=close;
panel.querySelector('[data-pick]').onclick=()=>{pinned=false; values.textContent='Hover another specimen, then click to pin.';};
document.addEventListener('pointermove',event=>{if(active&&!pinned&&pick(event.target)){populate();schedule();}},true);
document.addEventListener('click',event=>{if(active&&pickTarget(event.target)){event.preventDefault();event.stopImmediatePropagation(); if(!pinned){pick(event.target);pinned=true;populate();schedule();}}},true);
function pickTarget(target) {return target instanceof Element && target.closest('.docs-visual-gallery__tile-preview');}
document.addEventListener('keydown',event=>{if(!active)return;if(event.key==='Escape'){event.preventDefault();close();}});
// Keyboard users can select the first visible specimen without pointer picking.
panel.querySelector('[data-pick]').addEventListener('keydown',event=>{if(event.key!=='ArrowDown')return;event.preventDefault();root=[...document.querySelectorAll('.docs-visual-gallery__tile-preview')].find(el=>{const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;});if(root){selected=root;pinned=true;populate();schedule();tree.querySelector('button')?.focus();}});
window.addEventListener('scroll',schedule,true); window.addEventListener('resize',schedule);
new ResizeObserver(schedule).observe(document.body);
hide();
