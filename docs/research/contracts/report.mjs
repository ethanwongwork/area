/** Generate the gap inventory and re-anchor historical audit evidence without touching that branch. */
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { START, ROOT, DIR, source, validateDirectory } from './validate.mjs';
const git=(...args)=>execFileSync('git',args,{cwd:ROOT,encoding:'utf8',maxBuffer:40e6});
const AUDIT='c764f392381d1cea0935d5317e0c66d95ef23d89';
const audit=JSON.parse(git('show',`${AUDIT}:docs/research/variant-independence/matrix.json`));
const docs=await validateDirectory();
const definitions=new Map(docs.map(d=>[d.manifest,d]));
const unique=a=>[...new Set(a)];
const link=coordinate=>{const [,file,line]=coordinate.match(/^(.+):(\d+)$/);return `[${coordinate}](https://github.com/ethanwongwork/area/blob/${START}/${file}#L${line})`;};
const def=d=>`[${d.slug}](./${d.slug}.json)`;
const first=(d,path)=>link(d.evidence[path].sources[0]);
const changes=new Map();
function relocate(e){
 if(!changes.has(e.file))changes.set(e.file,[...git('diff','--unified=0',audit.startingCommit,START,'--',e.file).matchAll(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/gm)].map(m=>({old:+m[1],removed:m[2]===undefined?1:+m[2],now:+m[3],added:m[4]===undefined?1:+m[4]})));
 let delta=0;
 for(const h of changes.get(e.file)){
  if(h.removed&&e.line>=h.old&&e.line<h.old+h.removed)return null;
  if(h.removed?e.line>=h.old+h.removed:e.line>h.old)delta+=h.added-h.removed;
 }
 const n=e.line+delta;
 const old=git('show',`${audit.startingCommit}:${e.file}`).split('\n')[e.line-1];
 if(source(e.file).split('\n')[n-1]!==old)return null;
 return `${e.file}:${n}`;
}
const lines=[
 '# Framework-neutral component contracts',
 '',
 `Starting commit: \`${START}\` (latest fetched main when this worktree was created). Branch: \`astra/contracts\`. Every definition evidence coordinate resolves to this commit, not to moving main.`,
 '',
 `The inventory contains **${docs.length} manifest families, ${docs.reduce((n,d)=>n+Object.keys(d.options).length,0)} named axes and ${docs.reduce((n,d)=>n+Object.values(d.options).reduce((a,o)=>a+o.values.length,0),0)} named values**. The manifest is the family denominator, including axisless and CSS-only families. [Inventory source](https://github.com/ethanwongwork/area/blob/${START}/packages/styles/src/manifest.ts#L689).`,
 '',
 'These are source-backed drafts for ports and MCP consumers. They describe the implementation that exists; they do not certify behavior, define new component APIs, or mark components owner-approved. Unknown rules must be resolved before a consumer generates or validates a port against them.',
 '',
 '## Read and reproduce',
 '',
 '- `schema.json` is JSON Schema draft 2020-12. Definitions are `<manifest block without area->.json` (for example `button-group.json` → `buttonGroup`).',
 '- `validate.mjs` uses only Node built-ins (Node 22.18+, 24.x, or 26+); no build, installed dependencies, network, or audit branch is needed to validate. It checks the exact schema vocabulary, family/part coverage, option values/defaults, booleans, element modifiers, part references, and every evidence coordinate against the starting commit.',
 '- `generate.mjs` rebuilds definitions using the TypeScript already present in the repository lockfile. `reviewed.mjs` supplies human-reviewed keyboard, naming and composition facts. Generation reads source from the pinned Git commit, not from anyone else’s worktree.',
 `- \`report.mjs\` rebuilds this README from the definitions and the read-only audit at \`${AUDIT}\`. Its historical audit source was \`${audit.startingCommit}\`. That commit must be locally available only when regenerating this report.`,
 '- `validate.test.mjs` exercises rejection of malformed schemas/definitions, manifest drift and evidence defects without changing any source files.',
 '',
 '```sh',
 'node docs/research/contracts/validate.mjs',
 'node --test docs/research/contracts/validate.test.mjs',
 '# Optional regeneration after npm ci:',
 'node docs/research/contracts/generate.mjs',
 'node docs/research/contracts/report.mjs',
 '```',
 '',
 '## Evidence and interpretation',
 '',
 'Each definition has a parallel `evidence` map keyed by RFC 6901 JSON Pointers. Every container and every leaf except the evidence map itself has an entry. Evidence entries use one line each to keep large source maps scannable. `status: "found"` cites an implemented or documented fact; `status: "not found"` records the searched source coordinates and what remains unresolved. Literal `"not found"` is an unknown, never an empty allowlist. Empty arrays/objects with missing evidence likewise mean no fact was located. Manifest-declared empty option lists mean the family is axisless.',
 '',
 '- Options mirror manifest axes/defaults exactly. A missing manifest default does not mean the effective CSS/React default is absent. Boolean modifiers and element modifiers remain separate from named axes.',
 '- Parts include manifest anatomy and observed native elements. Root `required` means the root of a rendered surface; conditional parts can be optional. An unresolved required flag means family-wide cardinality has not been established. Native elements used with a family class outside its public export are retained as observations; this is not permission to change that export’s element.',
 '- Slots record locally declared content props (including local type aliases and inherited local interfaces), their content types, and direct part mappings when resolvable. Inherited native props, computed children and cross-family forwarding are not complete formal content grammars.',
 '- State records distinguish native attributes, ARIA, data hooks, native DOM properties, and CSS pseudo-classes. Markup values retain their authored expressions for traceability; these expressions are reference observations, not code a non-React target should execute. CSS conditions include selectors. An adapter may exist while its carrier is unresolved. Structural data/ARIA attributes are included so ports do not silently drop them.',
 '- Keyboard rules are reviewed key/action/condition records, not inferred from a tag name. The part is the focus target or the event-owning ancestor stated by the source; `not found` means the event exists but the local carrier is delegated/unresolved. Native keyboard behavior without an explicit local key map remains a gap.',
 '- Accessible-name entries distinguish explicit requirements from observed attribute wiring. Raw expressions in wiring records are not normative naming requirements. Native inherited ARIA props alone do not establish a naming rule.',
 '- `allowedParents`/`allowedChildren` are documented constraints; unknown is not unrestricted. `observedChildren` and `demoExamples` are observations, never restrictive allowlists. Child-family variants are covered in the dependency inventory below.',
 '- Per-part `tokens` contain direct `var(--area-*)` reads; `customProperties` contain other direct custom-property reads. Exact selector alternatives retain conditional and pseudo-element context. The scanner examines all styles sources and attributes reads to the last selector compound, excluding `:not()`/`:has()` arguments. Inherited values, universal rules, anonymous descendant selectors and transitive variable closure are not flattened. These are static reads, not computed styles or a complete theme API.',
 '',
 'The product brief is not present at the starting commit. The requested fallback was read **read-only** at `/Users/ethanwong/Desktop/area/.claude/worktrees/astra-6-usage-tasks-17a367/docs/BRIEF.md`, “Frameworks and targets” and “Library items”. It supplied task context only; no definition cites that unpinned worktree.',
 '',
 '## Families without a reviewed keyboard map',
 '',
 'This includes passive families and native controls whose detailed keys are not documented locally; it does not assert that they need custom key handlers. Search scope for each is in `/keyboard` evidence (manifest, component declarations and applicable shared/dedicated spec).',
 '',
 ...docs.filter(d=>!d.keyboard.length).map(d=>`- ${def(d)} — not found; searched ${d.evidence['/keyboard'].sources.map(link).join(', ')}.`),
 '',
 '## Keyboard carriers still unresolved',
 '',
 ...docs.filter(d=>d.keyboard.some(k=>k.part==='not found')).map(d=>`- ${def(d)}: ${d.keyboard.filter(k=>k.part==='not found').map(k=>`\`${k.key}\``).join(', ')}. See the per-key evidence; these handlers are delegated or live on caller-supplied triggers.`),
 '',
 '## States without an established hook or carrier',
 '',
 'The default plain-HTML adapter creates `data-<state>` unless the manifest specifies a native/ARIA exception ([adapter source](https://github.com/ethanwongwork/area/blob/'+START+'/packages/react/src/variants.ts#L51)). An adapter name does not prove that the component styles or forwards it on a particular element.',
 '',
 ...docs.flatMap(d=>d.states.flatMap((s,i)=>s.hook==='not found'||s.part==='not found'?[`- ${def(d)}: \`${s.name}\` → \`${s.hook}\`, carrier \`${s.part}\`; ${first(d,`/states/${i}`)}.`]:[])),
 '',
 '## Parts without a class',
 '',
 'These are explicit native anatomy, not proposed classes. IDs retain source-line suffixes to distinguish anonymous nodes. Shared native styling or inherited tokens may still apply.',
 '',
 ...docs.filter(d=>d.parts.some(p=>p.class==='not found')).map(d=>`- ${def(d)}: ${d.parts.flatMap((p,i)=>p.class==='not found'?[`\`${p.id}\` (${first(d,`/parts/${i}/class`)})`]:[]).join(', ')}.`),
 '',
 '## Other contract gaps',
 '',
 ...docs.filter(d=>d.reference.spec==='not found'||d.reference.reactExport==='not found').map(d=>`- ${def(d)}: ${[d.reference.spec==='not found'?'spec not found':'',d.reference.reactExport==='not found'?'React export not found':''].filter(Boolean).join('; ')}. See reference evidence.`),
 `- ${docs.filter(d=>d.composition.allowedParents==='not found').length} families lack documented allowed-parent rules; ${docs.filter(d=>d.composition.allowedChildren==='not found').length} lack an allowed-child grammar. Direct slot constraints and observed children do not fill this gap.`,
 `- ${docs.filter(d=>d.parts.some(p=>p.element==='not found')).length} families have at least one unresolved native part element; ${docs.filter(d=>d.parts.some(p=>p.required==='not found')).length} have unresolved part cardinality. See each part’s evidence and notes.`,
 `- ${docs.filter(d=>!d.accessibleName.length).length} families have no explicit naming requirement or locally authored naming wiring in the extracted scope.`,
 '',
 '## Variant dependencies from the earlier audit',
 '',
 `Read-only research: [audit README](https://github.com/ethanwongwork/area/blob/${AUDIT}/docs/research/variant-independence/README.md#result) and [full matrix](https://github.com/ethanwongwork/area/blob/${AUDIT}/docs/research/variant-independence/matrix.json). The prior audit covered 68 families / 95 axes / 268 values. It reported 110 conditional child-axis dependency records in 23 originating families, 68 named values classified “depends on”, and 28 intentional combined selector branches. It found no positive same-axis sibling conjunctions. Those are historical counts, **not a rerun against this starting commit**.`,
 '',
 'Count is new since that audit. Every current manifest family is represented in the definitions, but Count’s dependency status is **not found in the earlier audit**. Current named axes/values differ; do not apply the old matrix as a current pruning allowlist.',
 '',
 'Below, each dependency from the audit is retained with its condition. Evidence is re-anchored to the starting commit only when the source line survives unchanged. A changed line is explicitly marked not found instead of keeping a stale line number. Surviving individual lines do not prove that the whole behavior is unchanged; current dependency revalidation remains owner work.',
 ''
];
for(const [family,d]of definitions){
 const deps=audit.dependencies.filter(dep=>dep.family===family);if(!deps.length)continue;
 lines.push(`### ${d.slug}`,'');
 for(const dep of deps){const mapped=dep.evidence.map(e=>({e,at:relocate(e)}));lines.push(`- \`${dep.targetFamily}.${dep.targetAxis} = ${dep.targetValues.join(' / ')}\` — ${dep.kind}; ${dep.condition}${dep.appliesWhen?` Parent condition: ${JSON.stringify(dep.appliesWhen)}.`:''} Evidence: ${mapped.map(({e,at})=>at?link(at):`not found at starting commit (changed source; searched \`${e.file}\`; historical line ${e.line})`).join(', ')}.`);}
 lines.push('');
}
lines.push('### Intentional cross-axis combinations','', 'These intersections do not mean that one sibling option requires another. The audit’s reasons and exact selectors are retained below with surviving current evidence.','');
for(const r of audit.combinedRules){const at=relocate(r.evidence);lines.push(`- \`${r.selector}\` — ${r.reason} ${at?link(at):`not found unchanged at starting commit; searched \`${r.evidence.file}\` (historical line ${r.evidence.line}).`}`);}
lines.push('', '### Default removal', '', `The helper resolves defaults before emitting classes. Removing a value from an axis while keeping it as a default is unsafe; prune or replace both together. [Current helper](https://github.com/ethanwongwork/area/blob/${START}/packages/react/src/variants.ts#L21). Effective React defaults, borrowed public axes and child defaults also require review. The historical audit’s detailed omission matrix remains linked above.`, '', '## Validation and DONE', '', '- [x] Every current manifest family has one definition, including axisless families.', '- [x] Every field/container has pinned file:line evidence or an explicit not-found search record.', '- [x] `node docs/research/contracts/validate.mjs` passes with exact manifest option/default parity.', '- [x] Baseline `npm ci` and `npm run build` passed in the isolated worktree.', '- [x] Validator rejection tests and deterministic regeneration passed.', '- [x] `git diff --check` passed before the draft PR.', '- No visual or runtime component changes were made; no browser behavior or conformance suite is claimed.', '', '## Open questions for the owner', '', '1. Which currently implicit slot, required-part and composition rules should become normative constraints for every port?', '2. Should state hooks missing a proven carrier be standardized in the manifest, or kept as adapter-specific metadata?', '3. Should ports inherit documented native behavior, or should the definition enumerate every native key and accessible-name requirement?', '4. Should internal Button/Input/Badge variants remain available when a user excludes the corresponding public variant? The prior audit recommends retained private-part contracts or explicit dependency closure.', '5. Should the contract store authored state expressions only as evidence and require a separate neutral condition language before code generation?', '6. Should inherited/global/transitive CSS token reads be added as a separate computed dependency model, instead of mixing them with direct authored reads?', '7. Should Count and changed families receive a fresh variant-independence audit before inventory pruning is enabled?', '');
writeFileSync(resolve(DIR,'README.md'),lines.join('\n'));
console.log(`Gap report written for ${docs.length} families; historical dependency evidence re-anchored to ${START}.`);
