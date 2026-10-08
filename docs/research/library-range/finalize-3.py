#!/usr/bin/env python3
"""Update the date-stamped lookup manifest and dependency-aware research index."""
import hashlib,json,re,subprocess
from pathlib import Path
P=Path(__file__).resolve().parent
ROOT=P.parents[2]
load=lambda name:json.loads((P/name).read_text())
write=lambda name,data:(P/name).write_text(json.dumps(data,indent=2)+'\n')
index=load('index-3.json');scope=load('scope-3.json');pins=load('source-pins-3.json')
# Store retrieval metadata, not third-party page text or personal captures.
pages={}
for filename,cache in [('.research-cache-3.json','catalogues'),('.pages-cache-3.json','pages')]:
    for key,row in load(filename).items():
        pages[('catalogue|' if cache=='catalogues' else '')+key]={**{k:v for k,v in row.items() if k in ['url','final_url','status','error','checked']},'cache':cache,'text_sha256':hashlib.sha256(row.get('text','').encode()).hexdigest()}
write('checked-pages-3.json',pages)
coverage=next(iter(index.values()))['coverage'];systems={}
for name,row in coverage.items():
    url=row['catalog'];matches=[v for v in pages.values() if url.rstrip('/') in [v['url'].rstrip('/'),v.get('final_url',v['url']).rstrip('/')]]
    systems[name]={'url':url,'checked':'2026-09-28','status':next((v['status'] for v in matches if v['status']==200),'not found in cached retrieval metadata'),'evidence_note':'Public catalogue plus pinned source where available; reviewed scope only.'}
    if name=='Apple HIG':systems[name]['status']=200;systems[name]['retrieved_as']='https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json'
write('systems-3.json',systems)
# New prerequisites are design judgments. Existing reuse remains the pinned manifest set.
deps={
'multi-select':['listbox'],'tag-picker':['multi-select'],'selectable-list':['listbox'],
'date-picker':['date-field'],'date-range-picker':['date-picker'],'duration-input':['time-field'],
'people-picker':['tag-picker'],'tree-select':['listbox'],'transfer-list':['listbox'],
'app-shell':['sidebar','page-header','responsive-layout'],'dockable-inspector':['splitter','app-shell'],
'data-grid':['selectable-list'],'tree-grid':['data-grid'],'gradient-editor':['color-area','color-slider'],
'emoji-picker':['listbox'],'reactions':['emoji-picker'],'toggle-block':['accordion'],
'thinking-disclosure':['accordion'],'attachment-card':['file-upload'],'floating-format-bar':['rich-text-editor'],
'font-picker':['listbox'],'property-value':['unit-field','people-picker','date-field'],
'database-card':['property-value'],'keyboard-shortcuts':['description-list']}
# Common jobs and their prerequisites form the first tranche; lower-coverage
# primitives need not delay broadly used recipes that can reuse Area today.
priority={slug:row['family_system_count'] for slug,row in index.items()}
changed=True
while changed:
    changed=False
    for slug,items in deps.items():
        for dep in items:
            if priority[dep]<priority[slug]:priority[dep]=priority[slug];changed=True
phases={slug:(4 if row['family_system_count']==0 else 3 if row['kind']=='adapter' else 1 if priority[slug]>=6 else 2) for slug,row in index.items()}
phases['banner']=0
# Lift dependants to the phase of their latest prerequisite, then topologically sort.
changed=True
while changed:
    changed=False
    for slug,items in deps.items():
        value=max([phases[slug]]+[phases[d] for d in items])
        if phases[slug]!=value:phases[slug]=value;changed=True
order=[]
while len(order)<len(index):
    ready=[slug for slug in index if slug not in order and all(d in order for d in deps.get(slug,[]))]
    assert ready,'Dependency cycle'
    order.append(min(ready,key=lambda slug:(phases[slug],-priority[slug],-index[slug]['family_system_count'],index[slug]['name'])))
plan=[dict(rank=i+1,family=slug,phase=phases[slug],kind=index[slug]['kind'],observed_system_count=index[slug]['family_system_count'],dependency_priority=priority[slug],new_prerequisites=deps.get(slug,[]),existing_reuses=index[slug]['reuses'],source=index[slug].get('page',slug+'.md#sources')) for i,slug in enumerate(order)]
write('build-order-3.json',plan)
readme=(P/'README-3.md').read_text().split('## Evidence and counting')[0]
options=sum(len(v['options']) for v in index.values());proposals=sum(sum(o['proposed'] for o in v['options'].values()) for v in index.values());units=len(load('source-ledger-3.json'))
readme+='''## Evidence and counting

Checked 2026-09-28. Public documentation and public source only. No screenshots,
logged-in products, owner browser, geometry measurements or private source.

Each family checks all 16 requested systems. The denominator is 15 implementation
systems; Apple HIG is platform guidance and is never counted as a shipped library.
React Aria / Spectrum 2 and Chakra/Ark each count once. Radix Themes is distinct
from Radix Primitives. Current Polaris web-component pages are used where the old
Polaris React catalogue redirects. [Catalogue URLs](systems-3.json) and
[retrieval metadata](checked-pages-3.json) record the checked locations and failures.

**Observed availability is not a stable-release audit.** Counts mean a component
source or first-party functional recipe was found at the linked public page/pinned
commit. They are lower bounds on this reviewed corpus. Source branches can contain
preview, compatibility or platform-extension packages. Component and recipe-only
counts are shown separately. Internal components, static mockups, analogues and
HIG guidance do not enter family counts. A failed URL or absent named declaration
means **not found at that location**, never proof that the ecosystem lacks it.

Material evidence is the official Android implementation plus its component guides;
platform-native choices are not promises of a React API. Untitled public examples
include paid-library presentation, while its free source is used when available.
Carbon Callout carries a source-stage stability caveat, Fluent chart evidence uses
v9, and Atlassian chart evidence is the Forge extension. See the linked family notes
and [lookup audit](lookup-audit-3.md) before treating those as direct dependencies.

Native options preserve exact axis names, literal values and declaring owners in
[index-3.json](index-3.json). Identical spelling across systems does not imply equal
geometry or behavior. Named/open types stay unresolved rather than inventing an enum.
Boolean states are runtime/configuration choices. Documentation headings are labelled
examples, not independently verified complete interactions. The complete extracted
API ledger is supporting evidence, not a promise to implement every upstream prop.

Proposed categories group related alternatives for an owner decision. Their count
means a system documents **at least one** alternative in that category; it does not
mean every member is supported by every system. Exact leaf-option support is indexed
separately. Zero-count proposals cite analogues and explicitly need an Area contract.
Reuse and build priorities are design judgments. Density and mode remain system-wide;
layer 2 is local variation and layer 3 is anatomy/composition. Avoid a Cartesian product
of all upstream choices.

'''
readme+=f'The deliverable contains **{len(index)} families**, **{options} linked option/example/category records**,\n**{proposals} proposed range categories** and **{units} source units**. These are computed\nfrom the committed JSON, not market-share estimates. Evidence-backed family pages have the seven requested\nsections; 13 deferred families share no-evidence.md. Every retained option has evidence, and all existing reuses resolve in the pinned Area manifest.\n\n'
readme+='''## Build-order proposal

Prioritize common jobs and their prerequisites, then narrower reusable families,
then engine integrations; unresolved product contracts come last. Common means
observed in at least six implementation systems, an editorial cutoff for this plan.
A prerequisite inherits its most widely supported dependent's priority, so DateField
can unlock DatePicker and ListBox can unlock MultiSelect before unrelated work.
Within each phase, order available families by this dependency priority, then their
own coverage. Prerequisites always come first and can lift a dependent to a later
phase. This is a recommendation, not an externally sourced score. The machine-readable order is [build-order-3.json](build-order-3.json).
Counts include functional recipes as described above; follow each family link for
its component/recipe split, system names, variants and citations.

'''
labels={0:'Already built on current main',1:'Common jobs and enabling primitives',2:'Narrower reusable families and compositions',3:'Adapters and engine-dependent work',4:'Owner contract and evidence needed'}
last=None
for row in plan:
    slug=row['family'];v=index[slug]
    if row['phase']!=last:readme+='### '+labels[row['phase']]+'\n\n';last=row['phase']
    new='; new prerequisites: '+', '.join(index[d]['name'] for d in row['new_prerequisites']) if row['new_prerequisites'] else ''
    target=v.get('page',slug+'.md')
    readme+=f"{row['rank']}. [{v['name']}]({target}) — **{v['family_system_count']}/15**; {v['kind']}; reuse {', '.join(v['reuses'])}{new}.\n"
    if row==plan[-1] or plan[row['rank']]['phase']!=row['phase']:readme+='\n'
readme+='''## Owner decisions

- Which named extensions should become exported families versus documented recipes?
  Banner, circular Progress, UnitField, ColorArea/Slider and MessageActions already
  reuse substantial existing Area anatomy; this research does not authorize rebuilding it.
- Should range include preview/compatibility/platform-specific evidence, or should a
  later implementation pass require a stable React release before selecting an upstream?
- Which engines and contracts should govern editors, charts, drag/drop, virtualized
  grids and voice capture? Their visual wrappers do not supply those behaviors.
- Are product-specific controls with no dedicated implementation evidence worth building
  now? ConstraintsPicker, VariableChip and related inspector jobs need owner-defined
  semantics before detailed component specifications.

## Reproduction and validation

`source-pins-3.json` gives immutable repository commits and local cache paths. Clone
public repositories into those ignored paths, checking out each exact SHA. Sparse
checkouts must include the file paths named by `source-ledger-3.json`; a complete
checkout is also sufficient. No source clone or raw page cache belongs in the PR.

From this worktree, after the already-authorized `npm ci`:

```sh
python3 docs/research/library-range/collect-3.py
python3 docs/research/library-range/inventory-3.py
python3 docs/research/library-range/render-3.py
python3 docs/research/library-range/validate-3.py
```

The collector replays the checked URL list. Live pages can change; their checked date
and text digest describe this research run, not future retrievals. Pinned source links
remain reproducible. `finalize-3.py` updates the build order and README from reviewed
inputs and the local retrieval caches; run it only when intentionally revising evidence.
The committed scope, notes, mappings and range proposals are editorial inputs.
The extractor uses TypeScript already in the repository; no dependencies were added.

Checks: `npm ci`, `npm run build`, `npm run build:docs`, research validation and
`git diff --check`. No product files changed, so no component visual behavior is claimed
or owner completion status changed. The research Markdown is not a new docs-site route.

## DONE

- [x] Exact unbuilt-family scope recorded against the pinned manifest and requested inventory sections.
- [x] Every family has a file in the requested section order.
- [x] Every family records checks against all requested systems, including bounded not-found results.
- [x] Every indexed option and proposed range category has at least one evidence link.
- [x] Existing Area reuse, option support counts and dependency-aware build order are recorded.
- [x] No values measured from screenshots; no logged-in products used.
- [x] Research-only changes on `astra/library-range-3`; no shared component or icon edits.
'''
(P/'README-3.md').write_text(readme)
print('Finalized',len(plan),'build-order entries;',options,'options;',proposals,'proposals')
