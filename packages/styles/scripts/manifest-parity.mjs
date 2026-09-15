/** Selector-aware, component-scoped parity. No declaration text or negated states counts. */
export function checkManifestParity(manifests, css) {
  const source=css.replace(/\/\*[\s\S]*?\*\//g,'');
  const selectors=[];
  for(const match of source.matchAll(/(?:^|[{}])\s*([^{}]+)(?=\{)/g)) {
    if(match[1].trim().startsWith('@')) continue;
    let depth=0,start=0;
    for(let i=0;i<=match[1].length;i++) {
      const c=match[1][i];
      if(c==='('||c==='[')depth++;
      if(c===')'||c===']')depth--;
      if(i===match[1].length||(c===','&&depth===0)) {selectors.push(match[1].slice(start,i).trim());start=i+1;}
    }
  }
  const classes=s=>[...s.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map(m=>m[1]);
  const allClasses=new Set(selectors.flatMap(classes));
  const problems=[];
  for(const [name,m] of Object.entries(manifests)) {
    const {block}=m;
    if(!allClasses.has(block)) problems.push(`${name}: missing base .${block}`);
    const declared=new Set();
    const add=c=>{if(declared.has(c))problems.push(`${name}: duplicate modifier ${c}`);declared.add(c);};
    for(const values of Object.values(m.variants)) for(const value of values) add(`${block}--${value}`);
    for(const flag of m.booleans??[])add(`${block}--${flag}`);
    for(const element of m.elements??[])declared.add(`${block}__${element}`);
    for(const [element,values] of Object.entries(m.elementModifiers??{})) {
      if(!m.elements?.includes(element))problems.push(`${name}: modifier for undeclared element ${element}`);
      for(const value of values)add(`${block}__${element}--${value}`);
    }
    for(const c of declared)if(!allClasses.has(c))problems.push(`${name}: missing selector .${c}`);
    for(const c of allClasses)if((c.startsWith(block+'--')||c.startsWith(block+'__'))&&!declared.has(c))problems.push(`${name}: undeclared selector .${c}`);
    const own=selectors.filter(s=>classes(s).some(c=>c===block||c.startsWith(block+'--')||c.startsWith(block+'__')));
    for(const state of m.states??[]) {
      const positive=own.map(s=>s.replace(/:not\([^()]*(?:\([^()]*\)[^()]*)*\)/g,''));
      const pattern=new RegExp(`\\[data-${state}(?:\\]|[=~|^$*])|:${state}(?![\\w-])|\\[aria-${state}(?:\\]|=["']?true["']?\\])`);
      const belongs = new RegExp(`\\.${block}(?:--[a-z0-9-]+|__[a-z0-9-]+)?(?![\\w-])[^\\s>+~]*?(?:${pattern.source})`);
      if(!positive.some(s=>belongs.test(s)))problems.push(`${name}: missing component-scoped positive state ${state}`);
    }
    for(const [group,value] of Object.entries(m.defaults))if(!m.variants[group]?.includes(value))problems.push(`${name}: invalid default ${group}=${value}`);
  }
  return problems;
}
