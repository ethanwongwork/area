export type ScopeCheck = { id: string; pass: boolean; detail: string };
export type ScopeResult = { passed: number; failed: number; checks: ScopeCheck[]; engine?: string };
type Reference = {theme:'light'|'dark';neutral:string;accent:string;tokens:Record<string,string>};
export async function runScopeChecks(): Promise<ScopeResult> {
  if(!CSS.supports('color','light-dark(white, black)')) throw new Error('This fixture requires CSS light-dark() support.');
  const response = await fetch('./scope-reference.json');
  if (!response.ok) throw new Error('Could not load scope-reference.json');
  const references: Reference[] = await response.json();
  const checks: ScopeCheck[] = [];
  const find = (theme:string,neutral:string,accent:string) => {
    const ref=references.find(r=>r.theme===theme&&r.neutral===neutral&&r.accent===accent);
    if(!ref) throw new Error(`Missing resolver reference ${theme}/${neutral}/${accent}`);
    return ref;
  };
  const host = document.createElement('div');
  host.style.position='absolute'; host.style.visibility='hidden';
  host.setAttribute('aria-hidden','true'); document.body.append(host);
  const check = (id:string,actual:string,expected:string) => checks.push({id,pass:actual===expected,detail:`${actual} → ${expected}`});
  const attrs = (node:HTMLElement, values:Partial<Reference>) => {
    for (const name of ['theme','neutral','accent'] as const) if(values[name]) node.setAttribute(`data-area-${name}`,values[name]);
  };
  function compare(id:string, node:HTMLElement, ref:Reference) {
    const probe=document.createElement('span'); node.append(probe);
    const expected=document.createElement('span'); node.append(expected);
    for (const [name,value] of Object.entries(ref.tokens)) {
      probe.style.color=`var(--area-${name})`; expected.style.color=value;
      const actual=getComputedStyle(node).getPropertyValue(`--area-${name}`).trim()?getComputedStyle(probe).color:'<missing token>';
      check(`${id}/${name}`,actual,getComputedStyle(expected).color);
    }
    const native=document.createElement('select'); node.append(native);
    check(`${id}/native-scheme`,getComputedStyle(native).colorScheme,ref.theme);
    probe.style.boxShadow='var(--area-shadow-1)';
    expected.style.boxShadow=`0 0.5px 1px -0.5px rgb(0 0 0 / ${ref.theme==='dark'?0.08:0.06})`;
    check(`${id}/inherited-shadow`,getComputedStyle(probe).boxShadow,getComputedStyle(expected).boxShadow);
    probe.remove();expected.remove();native.remove();
  }
  try {
    for (const ref of references) {
      host.replaceChildren();
      const parent=document.createElement('div'), child=document.createElement('div');
      host.append(parent);parent.append(child);
      const id=`${ref.theme}/${ref.neutral}/${ref.accent}`;
      attrs(parent,{theme:ref.theme});attrs(child,{neutral:ref.neutral,accent:ref.accent});
      compare(`${id}/inherited`,child,ref);
      attrs(parent,{theme:ref.theme==='dark'?'light':'dark',neutral:ref.neutral,accent:ref.accent});
      child.removeAttribute('data-area-neutral');child.removeAttribute('data-area-accent');attrs(child,{theme:ref.theme});
      compare(`${id}/boundary`,child,ref);
      child.removeAttribute('data-area-theme');attrs(parent,{theme:ref.theme});
      compare(`${id}/removed`,child,ref);
      // Axis mutation order and an unrelated density/radius/type change must not alter colors.
      attrs(child,{accent:ref.accent});attrs(child,{neutral:ref.neutral});attrs(child,{theme:ref.theme});
      child.dataset.areaDensity='compact';child.dataset.areaRadius='pill';child.dataset.areaType='system';
      compare(`${id}/layout`,child,ref);
      // Override with genuinely different choices, then remove one attribute at a time.
      const otherTheme=ref.theme==='dark'?'light':'dark';
      const otherNeutral=ref.neutral==='warm'?'cool':'warm';
      const otherAccent=ref.accent==='red'?'green':'red';
      attrs(child,{theme:otherTheme,neutral:otherNeutral,accent:otherAccent});
      compare(`${id}/changed`,child,find(otherTheme,otherNeutral,otherAccent));
      child.removeAttribute('data-area-accent');
      compare(`${id}/remove-accent`,child,find(otherTheme,otherNeutral,ref.accent));
      child.removeAttribute('data-area-neutral');
      compare(`${id}/remove-neutral`,child,find(otherTheme,ref.neutral,ref.accent));
      child.removeAttribute('data-area-theme');
      compare(`${id}/remove-theme`,child,ref);
      // Opposite intermediate boundary, then another explicit boundary back to the root mode.
      attrs(child,{theme:otherTheme});
      const grandchild=document.createElement('div');attrs(grandchild,{theme:ref.theme});child.append(grandchild);
      compare(`${id}/three-level`,grandchild,ref);
      // Set theme last after clearing all selections: final output cannot depend on order.
      child.replaceChildren();
      for(const name of ['theme','neutral','accent']) child.removeAttribute(`data-area-${name}`);
      attrs(child,{accent:ref.accent});attrs(child,{neutral:ref.neutral});attrs(child,{theme:ref.theme});
      compare(`${id}/reverse-order`,child,ref);
    }
    const child=document.getElementById('react-child');
    const portal=document.getElementById('react-portal');
    const parent=document.getElementById('react-parent');
    if(!child || !portal || !parent) throw new Error('React portal fixture is not mounted');
    const selection=JSON.parse(document.getElementById('react-requested')!.dataset.expected!);
    const context=JSON.parse(portal.dataset.selection!);
    const ref=find(selection.theme,selection.neutral,selection.accent);
    compare('react/child',child,ref);compare('react/portal',portal,ref);
    check('react/portal-outside-parent',String(parent.contains(portal)),'false');
    for(const [axis,value] of Object.entries(selection)) {
      check(`react/context/${axis}`,String(context[axis]),String(value));
      check(`react/portal-attribute/${axis}`,portal.getAttribute(`data-area-${axis}`)??'',String(value));
      check(`react/child-attribute/${axis}`,child.getAttribute(`data-area-${axis}`)??'',String(value));
    }
  } finally { host.remove(); }
  return {passed:checks.filter(c=>c.pass).length,failed:checks.filter(c=>!c.pass).length,checks,engine:navigator.userAgent};
}
