#!/usr/bin/env node
// No third-party dependencies. Reads pinned public Git objects; never executes their code.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import observations from './observations.mjs';

const out = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(out, '../../..');
const startCommit = 'c585f8c5f38705a7efa79bf05148a8c6989b142a';
const sources = JSON.parse(fs.readFileSync(path.join(out, 'sources.json'), 'utf8'));
const bySource = new Map(sources.map(s => [s.id, s]));
const fields = ['scope','frameworks','styling','tokens','themes','variants','stories','docs','layout','license'];
const cache = new Map(), trees = new Map(), errors = [];
const git = (s, args) => execFileSync('git', ['-C', path.join(root, s.clonePath), ...args], {encoding:'utf8',maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
const hash = value => createHash('sha256').update(value).digest('hex');
function tree(s) {
  if (!trees.has(s.id)) trees.set(s.id, git(s, ['ls-tree','-r','--name-only',s.sha]).trim().split('\n'));
  return trees.get(s.id);
}
function blob(s, file) {
  const key = `${s.id}:${file}`;
  if (!cache.has(key)) {
    if (!tree(s).includes(file)) throw new Error(`Path not found: ${s.id}:${file}`);
    // git show reads exactly the pinned object; sparse checkout state cannot alter evidence.
    cache.set(key, git(s, ['show',`${s.sha}:${file}`]));
  }
  return cache.get(key);
}
function url(s, file, line) {
  const base = s.repository.includes('bitbucket.org') ? `${s.repository}/src/${s.sha}/${file}` : `${s.repository}/blob/${s.sha}/${file}`;
  return line ? base + (s.repository.includes('bitbucket.org') ? `#lines-${line}` : `#L${line}`) : base;
}
function cite(ref, source, field) {
  const s = bySource.get(ref.source ?? source.id);
  try {
    if (!s) throw new Error(`Unknown source ${ref.source}`);
    const content = blob(s,ref.path);
    const at = ref.anchor ? content.indexOf(ref.anchor) : 0;
    if (at < 0) throw new Error(`Anchor not found: ${s.id}:${ref.path} :: ${ref.anchor}`);
    const line = content.slice(0,at).split('\n').length;
    return {source:s.id,repository:s.repository,sha:s.sha,path:ref.path,line,url:url(s,ref.path,line),contentSha256:hash(content),checked:s.checked};
  } catch (err) { errors.push(`${source.id}.${field}: ${err.message}`); return null; }
}
function buildSystem(o) {
  const s = bySource.get(o.id);
  if (!s || !/^[0-9a-f]{40}$/.test(s.sha)) throw new Error(`Missing valid pin: ${o.id}`);
  if (git(s,['rev-parse','HEAD']).trim() !== s.sha) throw new Error(`Clone HEAD moved: ${o.id}`);
  const cells = Object.fromEntries(fields.map(field => {
    if (!o[field]?.evidence?.length) throw new Error(`Uncited cell ${o.id}.${field}`);
    return [field,{summary:o[field].summary,tags:o[field].tags,evidence:o[field].evidence.map(r => cite(r,s,field)).filter(Boolean)}];
  }));
  const re = new RegExp(o.componentCount.pattern), exclude = o.componentCount.exclude ? new RegExp(o.componentCount.exclude) : null;
  let matches = tree(s).filter(f => re.test(f) && !exclude?.test(f));
  if (o.countContent) matches = matches.filter(f => blob(s,f).includes(o.countContent));
  const members = new Map();
  for (const file of matches) {
    const name = file.match(re)[o.componentCount.group];
    if (!members.has(name)) members.set(name,[]);
    members.get(name).push({path:file,url:url(s,file)});
  }
  if (o.publicImports) {
    members.clear();
    const content = blob(s,o.publicImports);
    const exports = content.match(/export\s*\{([\s\S]*?)\}/)?.[1] ?? '';
    for (const m of content.matchAll(/import\s+([A-Z]\w*)(?:\s*,\s*\{[\s\S]*?\})?\s+from\s+['"](\.[^'"]+)['"];?/g)) {
      if (!new RegExp(`\\b${m[1]}\\b`).test(exports)) continue;
      const base = path.posix.join(path.posix.dirname(o.publicImports),m[2]);
      const file = ['.tsx','.ts','/index.tsx','/index.ts'].map(ext=>base+ext).find(f=>tree(s).includes(f));
      if (!file) throw new Error(`Unresolved public import: ${s.id}:${m[1]}`);
      members.set(m[1],[{path:file,url:url(s,file)}]);
    }
  }
  if (!members.size) errors.push(`No inventory members: ${o.id}`);
  const storyPaths = tree(s).filter(f => /\.(stories|story)\.[jt]sx?$|(?:^|\/)\.storybook\//.test(f));
  const componentCount = {value:members.size,unit:'scoped component inventory records',method:o.componentCount.method,
    selection:{publicDefaultImports:o.publicImports ?? null,pattern:o.publicImports ? null : o.componentCount.pattern,group:o.publicImports ? null : o.componentCount.group,exclude:o.publicImports ? null : o.componentCount.exclude || null,contentIncludes:o.countContent ?? null},
    evidence:o.componentCount.evidence.map(r=>cite(r,s,'componentCount')).filter(Boolean),
    members:[...members.entries()].sort(([a],[b])=>a.localeCompare(b,'en')).map(([name,paths])=>({name,paths}))};
  return {id:s.id,name:s.name,kind:s.kind,repository:s.repository,sha:s.sha,clonePath:s.clonePath,checked:s.checked,
    ...cells,componentCount,
    searches:{trackedFiles:tree(s).length,storybookPathPattern:'\\.(stories|story)\\.[jt]sx?$|(?:^|/)\\.storybook/',storybookPathCount:storyPaths.length,
      storybookPathExamples:storyPaths.slice(0,8).map(f=>({path:f,url:url(s,f)}))}};
}
for (const s of sources) {
  if (!/^[0-9a-f]{40}$/.test(s.sha) || git(s,['rev-parse','HEAD']).trim() !== s.sha) throw new Error(`Invalid source pin: ${s.id}`);
}
const systems = observations.map(buildSystem);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
if (systems.length !== 19 || systems.filter(s=>s.kind==='design-system').length !== 16 || systems.filter(s=>s.kind==='product').length !== 3) throw new Error('Expected all 16 named systems and three product repos');
const byId = new Map(systems.map(s=>[s.id,s]));
function ranking(field) {
  const labels = [...new Set(systems.flatMap(s=>s[field].tags))].sort();
  return labels.map(format => {
    const members=systems.filter(s=>s[field].tags.includes(format));
    return {format,systemCount:members.filter(s=>s.kind==='design-system').length,productCount:members.filter(s=>s.kind==='product').length,total:members.length,
      systems:members.map(s=>s.id),evidence:members.map(s=>({system:s.id,field,evidence:s[field].evidence}))};
  }).sort((a,b)=>b.systemCount-a.systemCount || b.total-a.total || a.format.localeCompare(b.format,'en'));
}
function support(ids,field) { return ids.map(id=>({system:id,field,evidence:byId.get(id)[field].evidence})); }
const importerOrder = [
  {stage:1,name:'CSS custom-property tokens and scope rules',proposal:'Extract declarations, aliases, fallbacks, selectors, layers, media/supports conditions and source order. Preserve unresolved calc/color values and theme scopes; do not flatten all definitions into one map.',evidence:support(['radix','mantine','openstatus'],'tokens')},
  {stage:2,name:'Structured token input: JSON/JSON5, DTCG extensions and Style Dictionary lineage',proposal:'Recognize $type/$value as well as legacy value objects, aliases and composite values. Preserve vendor extensions and generated/source relationships. Handle Carbon’s per-theme extension and Primer’s JSON5 before claiming generic DTCG coverage.',evidence:support(['primer','carbon','gestalt','atlassian'],'tokens')},
  {stage:3,name:'Restricted TS/JS token objects and Tailwind theme adapters',proposal:'Read literal objects, imports, spreads and simple aliases statically. Add Tailwind config and CSS @theme mappings. Keep factory/derivative functions as executable dependencies with unresolved outputs instead of evaluating arbitrary repository code during discovery.',evidence:support(['fluent','chakra','antd','shadcn','midday'],'tokens')},
  {stage:4,name:'Sass maps, generation and artifact linking',proposal:'Extract !default settings, maps, imports and generator inputs. Link published CSS/JS artifacts to definitions; treat compile-dependent values as unresolved until a controlled build is supplied.',evidence:support(['govuk','carbon','material','eui'],'tokens')},
  {stage:5,name:'React component records and variant adapters',proposal:'Discover package exports and TS/TSX modules; capture props, defaults, slots, polymorphism, controlled state, refs and style dependencies. Implement union/class-map, cva, prop-definition and recipe adapters without claiming visual equivalence from matching names.',evidence:support(['primer','fluent','chakra','radix','shadcn','baseui'],'variants')},
  {stage:6,name:'Stories, docs and preview composition',proposal:'Parse Storybook CSF args/decorators, MDX and component doc metadata first, then custom TSX examples and registry entries. Missing stories require a preview recipe or consumer fixture; a docs page is not automatically a runnable isolated story.',evidence:support(['primer','fluent','gestalt','shadcn','documenso'],'stories')},
  {stage:7,name:'Runtime styling resolution and non-React targets',proposal:'Keep Emotion/Griffel providers, caches, transforms and generated CSS as explicit preview dependencies. Extend the record for Nunjucks macro schemas and Lit custom-element metadata after the React path works on real product repos.',evidence:[...support(['chakra','fluent','eui'],'styling'),...support(['govuk','material'],'variants')]},
];
const recordFields = [
 ['identity','Repository URL, immutable SHA, package/version, entrypoint/export, module path, component family/part, framework, license scope and source evidence.', ['primer','fluent','eui'],'layout'],
 ['publicAPI','Props/type sources, unions, defaults, generics, events, children/slots, ref target, controlled/uncontrolled pairs and polymorphic render/as/asChild rules.', ['primer','fluent','baseui'],'variants'],
 ['structure','Root element and named parts, composition/dependency edges, required contexts/providers, accessibility/state hooks and inherited/native attributes.', ['fluent','spectrum','baseui'],'frameworks'],
 ['styles','Source style files, engine, class/slot/data-selector contracts, generated artifacts, build transforms, cascade order and unresolved runtime dependencies.', ['spectrum','atlassian','eui'],'styling'],
 ['tokens','Original format and raw nodes, semantic roles, alias edges, primitive/composite types, mode/scale/contrast dimensions, conditions, generated/source lineage and unresolved expressions.', ['primer','carbon','mantine'],'tokens'],
 ['variants','Independent axes, legal values, defaults, compounds, responsive values, per-slot mappings and state-dependent styles; keep behavior props separate from appearance choices.', ['radix','chakra','shadcn'],'variants'],
 ['theme','Provider and selector scope, light/dark/system preference, override and merge semantics, CSS entrypoints and initialization/SSR requirements.', ['primer','mantine','documenso'],'themes'],
 ['preview','Story/module/export/route, args and argTypes, decorators/providers, fixture data, assets/fonts, routing and environment requirements; explicit not-found state when stories are absent.', ['fluent','shadcn','openstatus'],'stories'],
 ['documentation','MDX/Markdown/TSX/JSON/YAML source links, API metadata, examples, lifecycle/deprecation and usage notes retained as source evidence.', ['primer','govuk','gestalt'],'docs'],
];
const reactSystems=systems.filter(s=>s.frameworks.tags.includes('React'));
const componentRecord = {status:'proposal, not an implemented importer',coverageCriterion:'The core record can describe React source plus opaque style/build/theme dependencies; it does not require a new HTML-template or custom-element target extension. This is representational coverage, not successful parsing, rendering, accessibility or automatic re-theming.',
 threshold:.8,eligible:reactSystems.length,total:systems.length,required:Math.ceil(systems.length*.8),fraction:reactSystems.length/systems.length,
 libraryEligible:reactSystems.filter(s=>s.kind==='design-system').length,libraryTotal:16,eligibleSystems:reactSystems.map(s=>s.id),
 evidence:reactSystems.map(s=>({system:s.id,evidence:s.frameworks.evidence})),
 fields:recordFields.map(([name,description,ids,field])=>({name,description,evidence:support(ids,field)})),
 extensions:[{target:'HTML/Nunjucks',system:'govuk',description:'Macro parameters, template path, YAML fixtures, JS enhancement module and Sass build inputs.'},{target:'Lit/Web Components',system:'material',description:'Custom-element tag, element properties/attributes/events, slots, shadow DOM styles, Sass tokens and Lit preview definitions.'}]};
const hardCases = [
 ['Generated and separately versioned tokens','Source token formats, dependency versions and emitted CSS must remain distinct. Primer’s supporting source is pinned independently; Spectrum imports external token JSON; Carbon and Atlassian generate artifacts.', ['primer','spectrum','carbon','atlassian'],'tokens'],
 ['Vendor mode extensions','A DTCG-looking file can store mode values in custom extensions, while JS themes can compute them. A schema label alone is insufficient to resolve every token.', ['carbon','chakra','antd'],'tokens'],
 ['Runtime and compiled CSS-in-JS','Style functions can depend on theme, props and runtime state; build-time extraction/macro transforms require the original toolchain. Record opaque dependencies before attempting normalization.', ['fluent','atlassian','spectrum','chakra','eui'],'styling'],
 ['Scope and cascade','Nested providers, classes, data attributes, media conditions and scale parameters change resolution. Preserve these conditions and source order rather than deduplicating equal variable names.', ['primer','radix','mantine'],'themes'],
 ['Unstyled behavior packages','Base UI and React Aria can supply behavior without a prescribed visual token set. Documentation themes must not be mistaken for required library tokens.', ['baseui','spectrum'],'styling'],
 ['Registry source and product drift','A source registry contains bases/styles/dependency metadata; products own local copies that may acquire wrappers, new variants and different theme initialization.', ['shadcn','openstatus','documenso','midday'],'variants'],
 ['Preview formats are heterogeneous','CSF is only one input. TSX docs/examples, route-based playgrounds, YAML fixtures and Lit stories need adapters; the three product clones have no conventional Storybook paths.', ['fluent','gestalt','radix','govuk','material','openstatus','documenso','midday'],'stories'],
 ['Counts and compound components','Public module, documented family, registry item and custom-element tag counts differ. Keep the explicit counting scope and full member paths; do not compare totals as interchangeable library sizes.', ['primer','fluent','material'],'scope'],
 ['License granularity','Repository roots, individual files, vendored UI and enterprise packages can have different terms. Preserve declarations at their actual scope; this survey does not determine reuse permissions.', ['eui','documenso','midday'],'license'],
];
const matrix = {schemaVersion:1,areaStartingCommit:startCommit,checked:'2026-09-28',
 scope:{designSystems:16,products:3,supportingSources:1,minimumRequested:15,allNamedSystemsIncluded:true,notes:'Primer Primitives is supporting evidence, not a twentieth survey row. React Spectrum/React Aria are one named system with multiple implementation surfaces. All product rows cite explicit shadcn adoption evidence.'},
 sources,systems,rankings:Object.fromEntries(['tokens','styling','variants','stories','docs'].map(f=>[f,ranking(f)])),importerOrder,componentRecord,
 hardCases:hardCases.map(([name,description,ids,field])=>({name,description,evidence:support(ids,field)}))};
const escaped = x => String(x).replace(/\|/g,'\\|').replace(/\n/g,' ');
const link = e => `[${e.source}:${e.path}:${e.line}](${e.url})`;
const citations = e => e.map(link).join('; ');
const table=(headers,rows)=>[headers,headers.map(()=>'---'),...rows].map(row=>'| '+row.map(escaped).join(' | ')+' |').join('\n');
const sysLink = id => `[${byId.get(id).name}](#${id})`;
const supports = refs => refs.map(r=>`${sysLink(r.system)} (${r.field})`).join(', ');
const rankingSection = (name,field) => `### ${name}\n\n${table(['Format','Systems / 16','Products / 3','All / 19','Evidence rows'],matrix.rankings[field].map(r=>[r.format,r.systemCount,r.productCount,r.total,r.systems.map(sysLink).join(', ')]))}`;
const incidence = (field,tag) => matrix.rankings[field].find(r=>r.format===tag);
const readme = `# Import survey\n\nSurvey of **${systems.length} pinned repositories: ${matrix.scope.designSystems} named design systems and ${matrix.scope.products} public shadcn product repos**. Checked 2026-09-28. Area starting commit: \`${startCommit}\`. The proposed importer order follows the brief’s step 6: tokens, then components and stories.\n\n[Matrix and evidence](./matrix.json) · [Repository pins](./sources.json) · [Curated observations](./observations.mjs) · [Generator/validator](./survey.mjs)\n\n## Findings and method\n\nThe first import boundary should retain token graphs, source locations, theme scopes and component contracts. Static files are useful early inputs, but generated tokens, style functions and preview providers are part of the system that must remain linked. The rankings below are measured from the cells in matrix.json; importer order, record design and hard cases are proposals inferred from those observations.\n\nAll 16 systems named in the request are included. The three products are OpenStatus, Documenso and Midday; their scope cells cite explicit shadcn adoption evidence. Primer Primitives is a separately pinned supporting repository for Primer’s token definitions and is excluded from system counts. Its checked version is not asserted to be the exact dependency version installed by Primer React.\n\nEvery survey cell cites a file and line in an immutable Git revision. Clones are under \`.cache/sources/<id>@<sha>/\`; they are shallow/sparse clones, and the validator reads pinned Git blobs and complete tracked-file lists, not mutable worktree contents. No surveyed repository code or build scripts were executed. Component counts are scoped inventories with executable selection rules and complete member paths in matrix.json. They count different kinds of records (families, modules, documented pages or registered elements), so totals are not interchangeable measures of product breadth.\n\n“Not found” is bounded by the named source paths and searches. The Storybook search examines the entire pinned tracked tree for \`*.story.*\`, \`*.stories.*\` and \`.storybook/\` paths; absence does not rule out unpublished stories or a differently named harness. Base UI’s docs-only theme is not counted as a prescribed token format. EUI’s declared per-file license choices are retained as such; including a requested repository does not assert that every file has one permissive license.\n\nThe brief was not found at \`docs/BRIEF.md\` on the starting commit. Context was read from the explicitly supplied fallback \`/Users/ethanwong/Desktop/area/.claude/worktrees/astra-6-usage-tasks-17a367/docs/BRIEF.md\` on 2026-09-28, “Bringing an existing system” and “Build sequence”, step 6. No survey facts or component counts come from that brief.\n\n## Findings at a glance\n\n- CSS custom properties appear in ${incidence('styling','CSS custom properties').systemCount}/16 library styling approaches; TS/JS objects appear in ${incidence('tokens','JavaScript/TypeScript objects').systemCount}/16 token cells. Start with static CSS and structured/object token discovery. Evidence: the ranked styling and token tables below.\n- Storybook CSF appears in ${incidence('stories','Storybook CSF').systemCount}/16 libraries. Preview import also needs custom TSX examples, templates and Lit stories. Evidence: the ranked stories table.\n- All three sampled products keep local cva-based UI modules, while their theme initialization differs. Preserve the local source and application theme dependencies. Evidence: [OpenStatus](#openstatus), [Documenso](#documenso), [Midday](#midday).\n\n## Repository inventory\n\n${table(['System / product','Pinned SHA','Component inventory count','Counting basis'],systems.map(s=>[sysLink(s.id),`[${s.sha}](${s.repository}/${s.repository.includes('bitbucket.org') ? 'src' : 'commit'}/${s.sha})`,`${s.componentCount.value} ([source](${s.componentCount.evidence[0].url}))`,s.componentCount.method]))}\n\nThe SHA link for Atlassian’s Bitbucket source is its [pinned source root](${byId.get('atlassian').repository}/src/${byId.get('atlassian').sha}/). GitHub-style commit links are used for GitHub repositories.\n\n## Formats ranked by observed incidence\n\nEach label counts a system once. Labels are not mutually exclusive: source token data, generated outputs and style engines can coexist. Library counts determine sort order; product counts are shown separately. “DTCG-shaped” records observed schema/field usage, not a conformance certification. “Generated artifacts” is a pipeline characteristic rather than a syntax.\n\n${rankingSection('Token inputs and outputs','tokens')}\n\n${rankingSection('Styling','styling')}\n\n${rankingSection('Variant definitions','variants')}\n\n${rankingSection('Stories and examples','stories')}\n\n${rankingSection('Documentation','docs')}\n\n## Proposed importer order\n\n${importerOrder.map(p=>`${p.stage}. **${p.name}.** ${p.proposal} Evidence: ${supports(p.evidence)}.`).join('\n\n')}\n\nDiscovery should produce source records before trying to rebuild a foreign system. Importing an existing component means preserving and previewing it with its dependencies; automatic conversion into Area’s semantic schema remains a separate migration step. This is a proposed boundary, not a capability already implemented by this survey.\n\n## Component record for at least 80%\n\nA React/TypeScript-oriented core with explicit opaque styling/build dependencies can represent **${componentRecord.eligible}/${componentRecord.total} surveyed subjects (${(100*componentRecord.fraction).toFixed(1)}%)**, including **${componentRecord.libraryEligible}/${componentRecord.libraryTotal} named libraries**. The minimum to exceed 80% of 19 subjects is ${componentRecord.required}. Evidence is each eligible subject’s framework cell and the explicit eligible-system list in matrix.json. This is **schema applicability**, not a measured importer success rate or a promise of automatic re-theming. GOV.UK and Material Web require the template/custom-element extensions below.\n\n${table(['Record field','Must retain','Evidence'],componentRecord.fields.map(f=>[f.name,f.description,supports(f.evidence)]))}\n\n${componentRecord.extensions.map(x=>`- **${x.target}:** ${x.description} Evidence: ${sysLink(x.system)}.`).join('\n')}\n\n## Hard cases\n\n${matrix.hardCases.map(h=>`### ${h.name}\n\n${h.description}\n\nEvidence: ${supports(h.evidence)}.`).join('\n\n')}\n\n## Per-repository evidence\n\n${systems.map(s=>`<a id="${s.id}"></a>\n\n### ${s.name}\n\nRepository: [${s.repository}](${s.repository}); pinned SHA: \`${s.sha}\`; checked ${s.checked}.\n\n${fields.map(f=>`- **${f}:** ${s[f].summary} ${citations(s[f].evidence)}`).join('\n')}\n- **componentCount:** ${s.componentCount.value}. ${s.componentCount.method} ${citations(s.componentCount.evidence)} Full member paths and selector are in matrix.json.\n- **Storybook path search:** ${s.searches.storybookPathCount} matching tracked paths; ${s.searches.trackedFiles} tracked files inspected. This counts paths, not stories. Search rule and sample paths are in matrix.json.`).join('\n\n')}\n\n## Reproduce and validate\n\nUse Node 22+ and Git. \`sources.json\` records clone URLs, full SHAs and clone locations. Recreate a missing source with a shallow clone/fetch of that SHA in its recorded directory; no dependency install in source repositories is needed. The generator reads missing sparse-checkout files via \`git show <sha>:<path>\`, which can fetch blobs in a partial clone.\n\n\`node docs/research/import-survey/survey.mjs\` regenerates matrix.json and this README.\n\n\`node docs/research/import-survey/survey.mjs --check\` regenerates in memory and verifies byte-for-byte equality, every cited path/anchor against pinned source, clone HEAD pins, all component inventories, cell completeness, subject counts and incidence rankings.\n\n- [x] At least 15 systems: all 16 named systems plus three product repositories.\n- [x] Every matrix cell cites a file at a pinned SHA.\n- [x] Component inventories and format rankings are generated from the same source records as this README.\n- [x] Byte-identical regeneration and source-reference validation pass.\n- Baseline Area \`npm ci\` and \`npm run build\` passed. This research changes no runtime UI; browser inspection is not applicable.\n\n## Owner questions and handoff\n\n- Is preserving an imported component with its native build/provider sufficient for the first import milestone, or must it also accept Area theme changes immediately? The brief distinguishes management from full re-theming.\n- Should the first real import fixture be a CSS-variable library, a structured-token library or one of the three shadcn products? The proposed order favors reusable static token discovery before runtime execution.\n- Which inventory unit should the future product show: component family, exported part, registry item or public custom-element tag? This survey keeps each source’s count scope explicit.\n\nAll durable task files are confined to docs/research/import-survey/. Public source clones are ignored under .cache/sources/.\n`;
// Data invariants independent of prose rendering.
for (const s of systems) {
  for (const f of [...fields,'componentCount']) {
    if (!s[f].evidence.length) throw new Error(`Empty evidence ${s.id}.${f}`);
    for (const e of s[f].evidence) if (!e.url.includes(e.sha) || !e.path || !e.line) throw new Error('Invalid citation');
  }
  if(s.componentCount.value!==s.componentCount.members.length) throw new Error('Count mismatch');
  if(s.stories.tags.includes('Not found') && s.searches.storybookPathCount) throw new Error(`Unexpected stories: ${s.id}`);
}
for (const [field, ranked] of Object.entries(matrix.rankings)) for (const r of ranked) {
  if (r.total !== systems.filter(s=>s[field].tags.includes(r.format)).length) throw new Error('Ranking mismatch');
}
if(componentRecord.eligible<componentRecord.required) throw new Error('80% schema target not reached');
const outputs={'matrix.json':JSON.stringify(matrix,null,2)+'\n','README.md':readme};
for(const [name,content] of Object.entries(outputs)) {
 const file=path.join(out,name);
 if(process.argv.includes('--check')) { if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==content) throw new Error(`Output differs: ${name}`); }
 else fs.writeFileSync(file,content);
}
console.log(JSON.stringify({mode:process.argv.includes('--check')?'verified':'generated',systems:systems.length,citedCells:systems.length*(fields.length+1),sourceBlobs:cache.size,counts:Object.fromEntries(systems.map(s=>[s.id,s.componentCount.value]))},null,2));
