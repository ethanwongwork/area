/** Browser-owned scope probe. Separate from the unchanged accessibility thresholds. */
export function runPreferenceChecks() {
  const cases = [
    ['theme','dark'],['neutral','warm'],['accent','yellow'],['density','compact'],
    ['radius','0'],['type','system'],['surface','flat'],['motion','none'],
  ];
  const pairs = [
    ['edge-control','border-faint','stroke-control'],
    ['edge-control-hover','border-subtle','stroke-control-hover'],
    ['edge-selected','border-faint','stroke-control'],
    ['edge-accent','accent-border','stroke-selected'],
    ['fill-toggle','border-subtle','stroke-control'],
    ['fill-toggle-hover','border','stroke-control-hover'],
  ];
  const checks:{id:string;pass:boolean;actual:string}[]=[];
  const channels=(color:string)=>{
    const srgb=color.startsWith('color(srgb ');
    return color.replace(/^color\(srgb\s+|^rgba?\(|\)$/g,'').split(/[,\s/]+/).filter(Boolean).slice(0,3).map(Number).map(n=>srgb?n:n/255);
  };
  const host=document.createElement('div');
  host.hidden=true;
  host.setAttribute('data-area-theme','light');
  host.setAttribute('data-area-neutral','neutral');
  host.setAttribute('data-area-accent','indigo');
  document.body.append(host);
  try {
    for(const outer of ['standard','more'])for(const inner of ['inherit','standard','more'])for(const [axis,value] of cases) {
      host.setAttribute('data-area-contrast',outer);
      const boundary=document.createElement('div');
      boundary.setAttribute(`data-area-${axis}`,value!);
      if(inner!=='inherit')boundary.setAttribute('data-area-contrast',inner);
      const consumer=document.createElement('div');
      const reference=document.createElement('div');
      boundary.append(consumer,reference);host.append(boundary);
      const strong=(inner==='inherit'?outer:inner)==='more';
      for(const [alias,quiet,emphasized] of pairs) {
        consumer.style.backgroundColor=`var(--area-${alias})`;
        reference.style.backgroundColor=`var(--area-${strong?emphasized:quiet})`;
        const actual=getComputedStyle(consumer).backgroundColor;
        const expected=getComputedStyle(reference).backgroundColor;
        checks.push({id:`${outer}/${inner}/${axis}/${alias}`,pass:channels(actual).every((n,i)=>Math.abs(n-channels(expected)[i]!)<.00001),actual:`${actual} = ${expected}`});
      }
      boundary.remove();
    }
  } finally {host.remove();}
  return {passed:checks.filter(c=>c.pass).length,failed:checks.filter(c=>!c.pass).length,checks};
}
