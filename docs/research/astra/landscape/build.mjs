import {writeFile, readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {tools, fields, checked, base, brief} from './observations.mjs';
import {differentiation, corrections, closest} from './review.mjs';

const out=fileURLToPath(new URL('.',import.meta.url));
const expected=['figma','claude-design','v0','lovable','bolt','framer','paper','pencil','subframe','dessn','onlook','noon','cursor-design','builder','plasmic','penpot','mobbin','21st','supernova','knapsack','zeroheight','tokens-studio','specify','storybook','tweakcn','shadcn-create','shadcn-studio','realtime-colors','radix-themes','untitled-ui','dribbble','godly','refero','awwwards'];
const statuses=['documented','partial','not found','vendor claim','reported','conflicting','inference','assessment'];
function assert(ok,msg){if(!ok)throw new Error(msg);}
function checkClaim(v,label){
 assert(statuses.includes(v.status),`${label}: invalid status`);
 assert(typeof v.value==='string'&&v.value.length>0,`${label}: missing text`);
 assert(v.sources?.length>0,`${label}: missing evidence/search scope`);
 if(v.status==='not found')assert(v.value.includes('not found'),`${label}: must explicitly say not found`);
 for(const s of v.sources){assert(new URL(s.url).protocol==='https:',`${label}: invalid source URL`);assert(s.checked===checked,`${label}: missing checked date`);}
}
assert(tools.length===expected.length,'Coverage changed: review required');
assert(new Set(tools.map(t=>t.id)).size===tools.length,'Duplicate tool id');
for(const id of expected)assert(tools.some(t=>t.id===id),`Missing requested tool ${id}`);
for(const t of tools){assert(Object.keys(t.fields).length===fields.length,`${t.id}: field count`);for(const f of fields)checkClaim(t.fields[f],`${t.id}.${f}`);for(const [f,v]of Object.entries(t.features??{}))checkClaim(v,`${t.id}.${f}`);}
assert(differentiation.length===9,'Must assess all nine brief rows');
assert(closest.length===3,'Must select three competitors');
for(const x of differentiation)checkClaim(x.assessment,`brief ${x.line}`);
for(const x of corrections)checkClaim(x.correction,`correction ${x.lines}`);
for(const x of closest){assert(expected.includes(x.id),'Unknown competitor');checkClaim(x.reason,x.id);}
const claims=tools.flatMap(t=>[...Object.values(t.fields),...Object.values(t.features??{})]);
const sources=[...new Set(claims.flatMap(c=>c.sources.map(s=>s.url)))].sort();
const statusCounts=Object.fromEntries(statuses.filter(s=>s!=='assessment').map(s=>[s,claims.filter(c=>c.status===s).length]));
const data={schemaVersion:1,checked,areaStartingCommit:base,briefSnapshot:brief,
methodology:{scope:'Public documentation, launch pages, pricing pages and public source listings; read-only public browser inspection resolved tweakcn, 21st.dev and Lovable pricing. No logged-in product testing.',
meaning:'documented means the cited page says it, not that the product was independently exercised. Vendor claims and editorial inferences are distinguished. not found is limited to listed search scope.',
layers:{foundations:'Shared visual values',inventory:'Component/variant/size/tone/state inclusion and defaults',structure:'Anatomy and layout by family',patterns:'Screens, flows and layouts'},
github:'Distinguishes native remote writes from local code export, agent-mediated edits and read-only access.',
pricing:'Snapshot of visible plan/locale/billing information; not a quote. Plan limits, taxes and enterprise terms not exhaustively normalized.',
funding:'Confirmed historical events or explicitly qualified gaps; parent-company rounds, acquisitions and sponsorship are not product-specific venture totals.'},
counts:{tools:tools.length,requiredFieldsPerTool:fields.length,toolFieldCells:tools.length*fields.length,figmaFeatures:Object.keys(tools[0].features).length,datedClaims:claims.length,distinctToolSourceUrls:sources.length,statusCounts},tools};
const sourceName=url=>{
 const u=new URL(url); const host=u.hostname.replace(/^www\./,'');
 const tail=decodeURIComponent(u.pathname.split('/').filter(Boolean).at(-1)??'homepage').replace(/^\d+-/,'').replace(/[-_]/g,' ');
 return `${host}: ${tail}`;
};
const link=(s)=>`[${sourceName(s.url)}](${s.url}) (checked ${s.checked})`;
const refs=v=>v.sources.map(s=>link(s)).join('; ');
const escape=s=>s.replaceAll('|','\\|').replaceAll('\n',' ');
const cell=(t,f)=>`${t.fields[f].status} ([evidence](${t.fields[f].sources[0].url}))`;
const text=[];
text.push('# Landscape research\n',`Checked **${checked}**. **${tools.length} tools**, **${data.counts.toolFieldCells} required field cells**, plus **${data.counts.figmaFeatures} Figma feature records**. Every cell contains dated source URLs or an explicit “not found” with the pages searched. Full facts are in [tools.json](tools.json).\n`);
text.push('## Scope and provenance\n',`- Task branch: \`astra/landscape\`; worktree: \`area-astra/landscape\`.\n- Area snapshot of commit: \`${base}\`. No component code or shared-checkout files changed.\n- \`docs/BRIEF.md\` is absent from that commit. Reviewed the owner-supplied read-only fallback: \`${brief.path}\`.\n- Fallback SHA-256 on ${checked}: \`${brief.sha256}\`. Line numbers/quotes below refer to that working-file snapshot, not to a claimed committed version.\n- Four layers follow fallback lines 109–121; proposed differentiation follows lines 393–405. The fallback itself lists the generator/studio/GitHub/MCP/publishing work as missing at lines 375–391. **Area’s scope below is proposed, not shipped.**\n`);
text.push('## Read this first\n',
'- The old category-level claims are too broad. Existing-system maintenance, live code editing, persistent reusable systems, review workflows and interactive publishing all have documented competitors. See the sourced comparisons below.\n- A useful Area hypothesis is a constrained, inspectable customization model spanning foundations, inventory and anatomy, applied consistently to product screens, with reversible updates and conformance evidence. This is a proposed positioning and test plan, not a verified market monopoly.\n- Public pages were examined; products were not exercised behind a login. “Documented” records a source statement. “Not found” never means “does not exist.” A general-purpose agent’s ability to edit code does not establish a guarded design-system option model.\n- Native GitHub delivery, agent-mediated changes, local export and read-only repository access are recorded separately. Funding events are historical observations, not rankings or exhaustive totals. Prices retain the observed currency and billing caveats.\n');
text.push('## Comparison against every Differentiation row\n','All competitor links in this table were checked on **'+checked+'**. The rightmost column is a proposed proof obligation for Area.\n','| Brief line / proposed Area capability | Current competitive evidence and assessment | What Area must demonstrate |','| --- | --- | --- |');
for(const x of differentiation)text.push(`| ${x.line}: ${escape(x.area)} | ${escape(x.assessment.value)} ${x.assessment.sources.map(s=>`[${sourceName(s.url)}](${s.url})`).join(' ')} | ${escape(x.proof)} |`);
text.push('\n## Brief claims requiring revision\n','Exact quotes are from the fallback snapshot identified above. These findings do not edit the brief.\n');
for(const x of corrections){text.push(`### Lines ${x.lines.join(', ')} — ${x.verdict}\n`,...x.quote.split('\n').map(l=>`> ${l}`),'',x.correction.value,refs(x.correction),'');}
text.push('## Three closest competitors to the proposed scope\n','Selection is a qualitative assessment of end-to-end overlap: creating/reusing a system, editing its real implementations, composing product screens, and maintaining changes. It is not a market-share or feature-count ranking.\n');
for(const [i,x]of closest.entries()){const t=tools.find(t=>t.id===x.id);text.push(`### ${i+1}. ${t.name}\n`,x.reason.value,refs(x.reason),'',`**Comparison to test:** ${x.remaining}\n`);}
text.push('Builder Code is a close alternative for repository-driven enterprise workflows; Knapsack is especially relevant to live system governance; Figma and Claude Design have broad design/agent surfaces. Their fit depends on which part of Area’s scope the owner prioritizes. This is an editorial assessment based on the corresponding tool records, not a claim that they lack the other capabilities.\n',
`[Builder evidence](https://www.builder.io/c/docs/fusion-projects-overview), [Knapsack evidence](https://docs.knapsack.cloud/), [Figma evidence](https://www.figma.com/blog/code-on-the-figma-canvas/), [Claude Design evidence](https://support.claude.com/en/articles/14604416-get-started-with-claude-design); checked ${checked}.\n`);
text.push('## Coverage index\n','Each row links to evidence. Status labels summarize documentation certainty, **not capability scores**. Detailed GitHub artifacts/review mechanics, audience, content/live-code distinction, sharing, frameworks, execution, pricing and funding are in each JSON record. Every linked page below was checked on **'+checked+'**.\n','| Tool / JSON id | Foundations | Inventory | Structure | Patterns |','| --- | --- | --- | --- | --- |');
for(const t of tools)text.push(`| ${t.name} — \`${t.id}\` | ${cell(t,'foundations')} | ${cell(t,'inventory')} | ${cell(t,'structure')} | ${cell(t,'patterns')} |`);
text.push('\n## Material caveats and open questions\n',
`- **Figma:** distinguish Design Code Layers from Sites Code Layers, launch rollout from availability, and native Make pushes from agent-assisted PR workflows. Weekly use by “most larger customers” was not confirmed. [Launch](https://www.figma.com/blog/code-on-the-figma-canvas/) / [Make push help](https://help.figma.com/hc/en-us/articles/35463818346647-Push-from-Figma-Make-to-GitHub), checked ${checked}.\n`,
`- **Framer:** official export pages disagree. Treat portable site export as unresolved until tested on the relevant plan. [Porting](https://www.framer.com/help/articles/porting-your-data-from-framer/) / [self-hosting help](https://www.framer.com/ja/help/articles/can-i-export-my-website-to-html-and-self-host-it/), checked ${checked}.\n`,
`- **Subframe:** use the current canonical homepage for the macOS/source workflow and price; older export docs describe React/Tailwind CLI/copy workflows. [Current](https://www.subframe.com/) / [older export docs](https://help.subframe.com/en/articles/9407221-exporting-code-from-page-designs), checked ${checked}.\n`,
`- **Noon:** detailed technical support, repo mechanics, pricing and execution are not found in the public early-access material. [Public page](https://noon.design/), checked ${checked}.\n`,
`- **Godly:** direct HTTP reading of [godly.website](https://godly.website/) redirected to [Recent](https://recent.design/?ref=godly). A similarly named godly.design site was not treated as the same product. Checked ${checked}.\n`,
'- **Pricing gaps:** Read-only public browser inspection resolved the initially empty tweakcn/21st.dev/Lovable pricing pages. Several other products quote custom prices or retain explicit gaps. Mobbin returned a JPY locale. See the dated pricing sources in each JSON record.\n',
'- **Owner decisions:** prioritize system creation versus existing-system governance; choose the first frameworks for conformance; define which local edits regeneration must preserve; decide whether publishing must preserve an approved system version. These decisions can change the closest-competitor ranking.\n');
text.push('## Data and reproducibility\n',
'- [observations.mjs](observations.mjs): curated field-level facts, statuses and dated URLs.\n- [review.mjs](review.mjs): exact brief quotes and editorial assessments.\n- [build.mjs](build.mjs): dependency-free schema/coverage checks and deterministic output generation.\n- [tools.json](tools.json): complete machine-readable tool records.\n- [README.md](README.md): generated interpretation, comparison and research handoff.\n',
'```sh\nnode docs/research/astra/landscape/build.mjs\nnode docs/research/astra/landscape/build.mjs --check\ngit diff --check\n```\n',
'`--check` regenerates in memory and fails if either checked-in output differs. The generator performs no network requests; re-running it does not refresh source checks. Update the observations and checked dates after new research.\n',
`Current generated counts: ${tools.length} tools; ${fields.length} required fields each; ${data.counts.toolFieldCells} tool-field cells; ${data.counts.figmaFeatures} additional Figma feature cells; ${claims.length} dated claims; ${sources.length} distinct tool-source URLs. These counts are derived from the same records as tools.json.\n`,
'### Verification and DONE\n',
'- [x] Every named tool is covered; additional shadcn editors and an additional inspiration site are included.\n- [x] Every required field is filled or explicitly says “not found”; every claim has dated URLs, including the searched pages for gaps.\n- [x] All Figma subfeatures are separately identified.\n- [x] All nine Differentiation rows are assessed; exact brief lines are quoted for corrections.\n- [x] Three closest competitors are selected with sourced reasons and limits.\n- [x] `npm ci` and `npm run build` succeeded in the isolated worktree before research writing.\n- [x] Scope is restricted to this output folder; no CSS or brief edits.\n- [x] Deterministic regeneration and JSON/README count agreement are enforced by the build/check command.\n',
'Commit/push/PR identity is reported in the task’s final handoff; no merge is authorized.\n');
const outputs=new Map([['tools.json',JSON.stringify(data,null,2)+'\n'],['README.md',text.join('\n').trimEnd()+'\n']]);
if(process.argv.includes('--check')){
 for(const [name,content]of outputs)assert(await readFile(out+name,'utf8')===content,`${name} differs from deterministic generation`);
}else for(const [name,content]of outputs)await writeFile(out+name,content);
console.log(JSON.stringify({mode:process.argv.includes('--check')?'check':'write',...data.counts}));
