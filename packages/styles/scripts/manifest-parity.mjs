/**
 * `:is(.a, .b)[open]` as one selector per member (`:is(.a)[open]`, `:is(.b)[open]`), so a state written after a list
 * belongs to each member and never to its neighbour; nested lists expand too.
 */
function expandIs(selector) {
  const at = selector.search(/:(?:is|where)\(/);
  if (at < 0) return [selector];
  const open = selector.indexOf('(', at);
  let depth = 0, end = open;
  for (; end < selector.length; end++) {
    if (selector[end] === '(') depth++;
    else if (selector[end] === ')' && --depth === 0) break;
  }
  const inner = selector.slice(open + 1, end);
  const members = [];
  let start = 0; depth = 0;
  for (let i = 0; i <= inner.length; i++) {
    const c = inner[i];
    if (c === '(' || c === '[') depth++;
    if (c === ')' || c === ']') depth--;
    if (i === inner.length || (c === ',' && depth === 0)) { members.push(inner.slice(start, i).trim()); start = i + 1; }
  }
  const head = selector.slice(0, at), tail = selector.slice(end + 1);
  // One member: keep it in place (`:is(.a)`), and expand what follows.
  return members.flatMap(member => expandIs(tail).map(rest => `${head}:is(${member})${rest}`)).flatMap(one => one === selector ? [one] : expandIs(one));
}

const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/**
 * The selector patterns a state's hook may take: `[data-<state>]`, `:<state>` and `[aria-<state>]` always, and the hook
 * its manifest names in `stateAttributes`: a native attribute (`[open]`, `[readonly]` with its `:read-only`), an ARIA one
 * (`[aria-busy="true"]`, `[aria-expanded="true"]`) or a pseudo-class (`:popover-open`).
 */
function statePattern(state, hook) {
  const attribute = name => `\\[${escape(name)}(?:\\]|=["']?(?:true|[\\w-]+)?["']?\\]|[~|^$*]=)`;
  const parts = [`\\[data-${state}(?:\\]|[=~|^$*])`, `:${state}(?![\\w-])`, `\\[aria-${state}(?:\\]|=["']?true["']?\\])`];
  if (hook?.startsWith(':')) parts.push(`${escape(hook)}(?![\\w-])`);
  else if (hook?.startsWith('aria-')) parts.push(`\\[${escape(hook)}(?:\\]|=["']?true["']?\\])`);
  else if (hook) {
    parts.push(attribute(hook), `:${escape(hook)}(?![\\w-])`);
    if (hook === 'readonly') parts.push(':read-only(?![\\w-])');
  }
  return parts.join('|');
}

/**
 * Selector-aware, component-scoped parity. No declaration text or negated states counts. A state reads the hook its
 * manifest names (`stateAttributes`); a state another component draws for it (`statesFrom`: Box field's `disabled` is its
 * Number fields') must be that component's declared state instead of a selector of its own.
 */
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
    for(const key of Object.keys(m.stateAttributes??{}))if(!m.states?.includes(key))problems.push(`${name}: stateAttributes for undeclared state ${key}`);
    for(const [state,from] of Object.entries(m.statesFrom??{})) {
      if(!m.states?.includes(state))problems.push(`${name}: statesFrom for undeclared state ${state}`);
      if(!manifests[from])problems.push(`${name}: ${state} from unknown component ${from}`);
      else if(!manifests[from].states?.includes(state))problems.push(`${name}: ${state} from ${from}, which has no ${state} state`);
    }
    const positive=own.map(s=>s.replace(/:not\([^()]*(?:\([^()]*\)[^()]*)*\)/g,'')).flatMap(expandIs);
    for(const state of m.states??[]) {
      if(m.statesFrom?.[state])continue;
      const pattern=statePattern(state,m.stateAttributes?.[state]);
      const belongs = new RegExp(`\\.${block}(?:--[a-z0-9-]+|__[a-z0-9-]+)?(?![\\w-])[^\\s>+~,]*?(?:${pattern})`);
      if(!positive.some(s=>belongs.test(s)))problems.push(`${name}: missing component-scoped positive state ${state}`);
    }
    for(const [group,value] of Object.entries(m.defaults))if(!m.variants[group]?.includes(value))problems.push(`${name}: invalid default ${group}=${value}`);
  }
  return problems;
}

/* --- One vocabulary (system evaluation 2026-11-11, F8; GOVERNANCE § 4) ---------------------------------------------- */

const kebabOf = name => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
/** A React prop as the job it names: `defaultOpen`, `onOpenChange` and `openProps` read as `open`, in kebab case. */
const propWord = name => kebabOf(name.replace(/^default(?=[A-Z])/, '').replace(/^on([A-Z]\w*)Change$/, '$1').replace(/(?<=.)Props$/, '')).replace(/^-/, '');
const KEBAB = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const isSlot = type => /\bReactNode\b/.test(type);

/**
 * Every name off the vocabulary (vocabulary.mjs), less the listed deviations, and every listed deviation that is gone
 * or no longer off. `sources`: `manifests` (parts, states, axes, flags and their values), `react` (api-rows.mjs's
 * reactProps: each `*Props` interface's own props) and `css` (the `data-area-*` attributes); a deviation is checked for
 * staleness only against the sources given (a React export's against `react`, `@settings` against `css`).
 */
export function checkVocabulary(sources, vocabulary) {
  const { JOBS, PRESENCE_WORDS, CHANGE_WORDS, EDGE_NAMES, PHYSICAL_WORDS, BRITISH, SINGLE_ACTION, ALLOWED_DEVIATIONS } = vocabulary;
  const offWords = where => Object.assign({}, ...JOBS.map(job => job.off?.[where] ?? {}));
  const off = { part: offWords('part'), state: offWords('state'), prop: offWords('prop'), value: offWords('value') };
  const found = new Map();
  const flag = (owner, name, kind, use, why) => { if (!found.has(`${owner}\0${name}`)) found.set(`${owner}\0${name}`, { owner, name, kind, use, why }); };
  const british = word => word.split('-').map(segment => BRITISH[segment]).find(Boolean) && word.split('-').map(segment => BRITISH[segment] ?? segment).join('-');
  const word = (owner, name, kind, as = name) => {
    const us = british(as);
    if (us) return flag(owner, name, kind, us, 'US spelling');
    if (off[kind === 'axis' || kind === 'flag' ? 'prop' : kind]?.[as]) flag(owner, name, kind, off[kind === 'axis' || kind === 'flag' ? 'prop' : kind][as], 'another word for a shared job');
  };
  const values = (owner, name, list, as = name) => {
    for (const value of list) {
      let use;
      if (as === 'status') use = PRESENCE_WORDS.includes(value) ? 'presence' : CHANGE_WORDS.includes(value) ? 'change' : off.value[value];
      else if (EDGE_NAMES.includes(as) || EDGE_NAMES.some(edge => as.endsWith(`-${edge}`))) use = value.split('-').some(part => PHYSICAL_WORDS.includes(part)) ? 'start / end' : undefined;
      else if (CHANGE_WORDS.includes(as) || as === 'change') use = off.value[value];
      if (use) return flag(owner, name, 'value', use, `${name}="${value}" is ${use === 'presence' ? 'availability' : use === 'change' ? 'a change word' : 'not the shared word'}`);
    }
  };
  if (sources.manifests) for (const [owner, m] of Object.entries(sources.manifests)) {
    const named = (list, kind) => { for (const name of list ?? []) { if (!KEBAB.test(name)) flag(owner, name, 'form', kebabOf(name), 'manifest names are kebab case'); word(owner, name, kind, kebabOf(name)); } };
    named(Object.keys(m.variants ?? {}), 'axis');
    named(m.booleans, 'flag');
    named(m.states, 'state');
    named(m.elements, 'part');
    for (const [axis, list] of Object.entries(m.variants ?? {})) values(owner, axis, list, kebabOf(axis));
    if (m.elements?.includes('action') && !SINGLE_ACTION[owner]) flag(owner, 'action', 'part', 'actions', 'a slot of actions, not a single built-in action');
  }
  if (sources.react) for (const [owner, entry] of Object.entries(sources.react)) for (const prop of entry.props) {
    if (prop.owner !== `${owner}Props` || prop.deprecated) continue;
    const as = propWord(prop.name);
    word(owner, prop.name, 'prop', as);
    const literals = (prop.literals ?? []).filter(value => !(prop.aliases ?? []).includes(value));
    values(owner, prop.name, literals, as);
    if (as === 'action' && isSlot(prop.type)) flag(owner, prop.name, 'prop', 'actions', 'a slot of actions, not a single built-in action');
    if (as === 'end' && isSlot(prop.type)) flag(owner, prop.name, 'prop', 'trailing', "an item's end slot");
    if (as === 'name' && prop.type.trim() !== 'string') flag(owner, prop.name, 'prop', 'title', 'display text; name is the form name only');
    if (as === 'status' && /=>/.test(prop.type)) flag(owner, prop.name, 'prop', 'statusText', 'words about the state, not an outcome');
  }
  if (sources.css) for (const [, attribute] of sources.css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/\[(data-area-[a-z0-9-]+)/g)) {
    const us = british(attribute);
    if (us) flag('@settings', attribute, 'attribute', us, 'US spelling');
  }
  const problems = [];
  for (const { owner, name, kind, use, why } of found.values()) {
    if (!ALLOWED_DEVIATIONS[owner]?.[name]) problems.push(`${owner}: ${kind} "${name}" is off the vocabulary (${why}): use ${use}, or list it in vocabulary.mjs ALLOWED_DEVIATIONS`);
  }
  const checked = owner => owner === '@settings' ? sources.css : /^[A-Z]/.test(owner) ? sources.react : sources.manifests;
  for (const [owner, names] of Object.entries(ALLOWED_DEVIATIONS)) for (const name of Object.keys(names)) {
    if (checked(owner) && !found.has(`${owner}\0${name}`)) problems.push(`${owner}: deviation "${name}" is gone or back on the vocabulary: take it off ALLOWED_DEVIATIONS`);
  }
  return problems;
}
