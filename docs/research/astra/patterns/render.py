"""Render Markdown and coverage from the authored, pinned research inputs."""
from pathlib import Path
from collections import Counter
import copy, hashlib, json
from catalogue import CATEGORIES, PATTERNS, SHOWCASE
from sources import SOURCES, DATE
from area import BASE, RANGE, CAPABILITIES, build_registry, evidence, read
ROOT=Path(__file__).resolve().parent

def link(label,url):return f'[{label}]({url})'
def evlinks(items):return '; '.join(link(f'{x["path"]}:{x["line"]}',x['url']) for x in items)
def source_links(ids):return '; '.join(link(SOURCES[i]['system']+' — '+SOURCES[i]['title'],SOURCES[i]['url']) for i in ids)
def render():
    used={c for p in PATTERNS for k in ('built','gaps','optional_gaps') for c in p[k]}
    # Include potential reuses so every capability resolves to a built Area family.
    used|={c for k in list(used) if k in CAPABILITIES for c in CAPABILITIES[k]['reuse_candidates']}
    registry=build_registry(used)
    patterns={}
    for p in PATTERNS:
        out=copy.deepcopy(p)
        out['file']=p['category']+'.md';out['anchor']=p['id']
        out['interpretation']='Area proposal synthesized from cited references; anatomy, mapping and responsive behavior are recommendations, not upstream API or prevalence claims.'
        out['required_components']=[dict(component_id=c,area_status=registry[c]['area_status'],area_families=registry[c]['area_families']) for c in p['built']+p['gaps']]
        out['optional_components']=[dict(component_id=c,area_status=registry[c]['area_status'],area_families=registry[c]['area_families']) for c in p['optional_gaps']]
        out['missing_or_partial']=[c['component_id'] for c in out['required_components'] if c['area_status'] in ('partial','missing')]
        out['sources']=[SOURCES[i] for i in p['source_ids']]
        for k in ('built','gaps','optional_gaps'):out.pop(k)
        patterns[p['id']]=out
    reach=[]
    for id,c in registry.items():
        if c['area_status']=='built':continue
        required=[p['id'] for p in patterns.values() if id in {r['component_id'] for r in p['required_components']}]
        optional=[p['id'] for p in patterns.values() if id in {r['component_id'] for r in p['optional_components']}]
        if not required and not optional:continue
        sole=[p for p in required if patterns[p]['missing_or_partial']==[id]] if c['area_status'] in ('partial','missing') else []
        reach.append(dict(component_id=id,status=c['area_status'],kind=c['kind'],required_pattern_count=len(required),optional_pattern_count=len(optional),
                          required_patterns=required,optional_patterns=optional,sole_remaining_shared_gap_patterns=sole))
    reach.sort(key=lambda x:(-x['required_pattern_count'],-x['optional_pattern_count'],x['component_id']))
    shown={c['component_id'] for id,_ in SHOWCASE for c in patterns[id]['required_components'] if c['area_status']=='built'}
    all_built={c for c,v in registry.items() if v['area_status']=='built'}
    coverage=dict(schema_version=1,checked_on=DATE,area_base_commit=BASE,range_commits={str(n):s for n,s in RANGE.items()},
      semantics={'built':'Exported family at pinned baseline. Owner status is separate.',
                 'recipe':'No independent export found; simple baseline composes existing families/native HTML. A reusable recipe remains to be authored.',
                 'partial':'Useful anatomy or limited behavior exists; the stated shared contract is not found.',
                 'missing':'Named primitive, behavior manager or adapter not found in pinned scope. Reuse candidates do not implement it.',
                 'required':'Needed for this catalogued baseline; recipe entries can be supplied by ordinary application composition.',
                 'optional':'Needed only for an explicitly expanded variant, excluded from required reach.',
                 'sole_remaining_shared_gap':'Only non-recipe shared gap for the pattern in this dataset. NOT proof the whole app becomes complete or production-ready.'},
      categories={k:dict(title=v,file=k+'.md',pattern_ids=[p['id'] for p in PATTERNS if p['category']==k]) for k,v in CATEGORIES.items()},
      components=registry,patterns=patterns,priorities=reach,
      showcase=[dict(pattern_id=id,reason=reason) for id,reason in SHOWCASE],
      counts=dict(categories=len(CATEGORIES),patterns=len(patterns),sources=len({s for p in patterns.values() for s in p['source_ids']}),showcase_patterns=len(SHOWCASE),
                  built_families_in_catalogue=len(all_built),built_families_in_showcase=len(shown)),
      provenance=dict(brief='Absent from base main; read-only user-specified fallback. No commit provenance asserted for that working file.',
        brief_fallback='.claude/worktrees/astra-6-usage-tasks-17a367/docs/BRIEF.md',
        brief_sections='Customization model, lines 109–123; Library, lines 213–223. Checked 2026-09-28.',
        sources='sources.py and source-checks.json',scope='Only docs/research/patterns; public sources; no product UI or owner completion state changed.'))
    (ROOT/'coverage.json').write_text(json.dumps(coverage,indent=2,ensure_ascii=False)+'\n')
    for cat,title in CATEGORIES.items():
        lines=[f'# {title}', '', f'Checked {DATE}. '+link('Method, status meanings and priorities','README.md')+'.', '',
         'These are proposed Area recipes informed by the cited public examples and guidance. Anatomy is the proposed reading order; variations are candidates to offer, not a claim that every source implements them. Responsive behavior is an Area recommendation unless a source observation explicitly says otherwise. No dimensions are inferred from images.', '',
         'Component availability is pinned to `'+BASE+'`. `recipe` means reusable packaging is absent but the baseline is composable; `partial` and `missing` identify additional shared behavior or adapters. Native headings, paragraphs, links, lists, forms and layout CSS remain valid building blocks.', '']
        for p in [p for p in patterns.values() if p['category']==cat]:
            lines += [f'<a id="{p["id"]}"></a>',f'## {p["title"]}', '', '**Purpose.** '+p['purpose'], '', '**Anatomy, in order (proposal).**', '']
            lines += [f'{i}. {s}' for i,s in enumerate(p['anatomy'],1)]
            lines += ['', '**Required components → Area families.**', '']
            for dep in p['required_components']:
                c=registry[dep['component_id']]
                if c['area_status']=='built':
                    lines.append(f'- {c["label"]}: **built** ({c["owner_status"]}); '+link('pinned manifest',c['area_evidence'][0]['url'])+'; '+link('range cross-check',c['range_evidence'][0]['url'])+'.'+(' '+c['range_note'] if c.get('range_note') else ''))
                else:
                    reuse=', '.join(registry[x]['label'] for x in c['area_families'])
                    lines.append(f'- {c["label"]} → {reuse}: **{c["area_status"]}**. {c["status_note"]} '+link('inventory',c['area_evidence'][0]['url'])+'; '+link('range cross-check',c['range_evidence'][0]['url'])+'.'+(' '+c['range_note'] if c.get('range_note') else ''))
            gaps=p['missing_or_partial']
            lines+=['','**What Area lacks for this baseline.** '+('; '.join(registry[c]['label'] for c in gaps)+'. Existing controls cover only the reuses listed above.' if gaps else 'No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.'), '', '**Common variations to catalogue.**', '']
            lines += ['- '+v+'.' for v in p['variations']]
            if p['optional_components']:
                lines+=['', '**Extra requirements for expanded variants.**', '']
                for dep in p['optional_components']:
                    c=registry[dep['component_id']]
                    lines+=['- '+c['label']+f' — **{c["area_status"]}**. '+c['status_note']+' '+link('range cross-check',c['range_evidence'][0]['url'])+'.']
            lines+=['','**Responsive proposal.** '+p['responsive_proposal']+' General layout basis: '+source_links(['fluent-layout'])+'.', '',
                    '**Behavior boundary.** '+p['runtime_contract'], '', '**Source observations.**', '']
            for id in p['source_ids']:
                s=SOURCES[id]
                lines+=['- '+link(s['system']+' — '+s['title'],s['url'])+f' ({s["kind"]}; checked {s["checked_on"]}). '+s['finding']+((' Read via '+link('official documentation JSON',s['readable_url'])+'.') if 'readable_url' in s else '')]
            lines+=['']
        (ROOT/(cat+'.md')).write_text('\n'.join(lines).rstrip()+'\n')
    lines=['# Patterns and screens catalogue','',f'Layer 4 research · checked **{DATE}** · branch `astra/patterns`.','',
      f'Snapshot of commit **`{BASE}`**. This is the fetched `origin/main` used to create the isolated worktree. Findings stay pinned here even if main or another working branch advances.','',
      f'The catalogue contains **{len(patterns)} patterns across {len(CATEGORIES)} requested categories**, grounded in **{coverage['counts']['sources']} cited public reference pages**. Counts are computed from '+link('coverage.json','coverage.json')+'. All entries contain purpose, ordered anatomy, Area mappings, gaps, variations, responsive recommendations and dated sources.','',
      '## Scope and evidence','',
      'The brief puts screens, flows and layouts in layer 4. It was absent from main, so the user-specified `docs/BRIEF.md` in the `astra-6-usage-tasks-17a367` worktree was read only (2026-09-28; customization model lines 109–123). That working-file fallback is a scope input, not evidence for today’s component availability.','',
      'Area evidence uses '+link('COMPONENTS.md',evidence(BASE,'docs/COMPONENTS.md',27)['url'])+', the pinned manifest/React exports and the '+link('owner registry',evidence(BASE,'apps/docs/src/component-status.mjs',6)['url'])+'. Each component record has exact pinned file/line links. The three range branches were read without checkout:','']
    for n,s in RANGE.items():
        lines+=['- `origin/astra/library-range-'+str(n)+'` at `'+s+'`: '+link(f'README-{n}',evidence(s,f'docs/research/library-range/README-{n}.md',1)['url'])+'.']
    lines+=['', 'The range surveys use an earlier Area base. Current executable declarations take precedence over stale backlog wording: Combobox, CommandPalette, ContextMenu, HoverCard and the conversation families are built; Count and Alert’s banner layout are present. Panel resizing and PanelSection collapse must not be counted as entirely absent. The per-family evidence and separate capability entries in coverage.json record these distinctions.', '',
      'Anatomy, dependency selection and responsive behavior are **Area design proposals** drawn from references, not claims of a shared upstream implementation. “Common” names recognizable alternatives in this reviewed corpus; no market-prevalence count is claimed. No measurements, breakpoints, paid source or logged-in product use is included.', '',
      '## Categories','']
    for cat,title in CATEGORIES.items():
        lines+=['- '+link(title,cat+'.md')+f' — {len(coverage["categories"][cat]["pattern_ids"])} patterns.']
    lines+=['','## Twenty showcase patterns','',
      f'These editorial selections expose **{len(shown)} distinct built Area families** across their required mappings. They favor current controls and varied composition; this is not a mathematical optimum or a statement that all screens already work. Fixtures can demonstrate layout and states, but each page identifies the runtime work still needed. Optional variants do not contribute to the family count.','']
    for i,(id,reason) in enumerate(SHOWCASE,1):
        p=patterns[id]; gaps=', '.join(registry[g]['label'] for g in p['missing_or_partial'])
        lines+=[f'{i}. '+link(p['title'],p['file']+'#'+id)+' — '+reason+(' Shared contract still needed: '+gaps+'.' if gaps else ' Baseline uses existing families and recipe composition.')]
    unshown=all_built-shown
    lines+=['', 'Built families elsewhere in this catalogue but outside that selection: '+(', '.join(registry[c]['label'] for c in sorted(unshown)) or 'none')+'.', '',
      '## Missing capabilities with the broadest reach','',
      'Counts below are **direct dependency incidence in this catalogue**, not third-party popularity or estimates of implementation effort. Required and optional variants are separate. Adding one dependency can leave other gaps. “Sole shared gap” excludes recipe packaging and backend/runtime work; it does not mean a complete app becomes ready. Full pattern ID lists are in `coverage.json → priorities`.','']
    for x in [x for x in reach if x['status'] in ('partial','missing')]:
        c=registry[x['component_id']]
        lines+=['- **'+c['label']+f'** ({x["status"]}; {x["kind"]}): {x["required_pattern_count"]} required patterns, {x["optional_pattern_count"]} optional variants; sole shared gap for {len(x["sole_remaining_shared_gap_patterns"])}. '+link('Range evidence',c['range_evidence'][0]['url'])+'.']
    lines+=['', 'Suggested order is an editorial decision: establish shared form-error handling and collection selection; add upload and responsive sheet contracts; then choose grid, chart and editor adapters according to the screens the owner actually wants. Preserve working Panel resizing, Calendar range selection and single-value Combobox while extending their surrounding contracts. Do not implement every gap solely to increase a count.', '',
      '### Recipes that improve breadth without another primitive','',
      'These entries have no independent family export in the checked scope. Their basic version can be authored with existing components and semantic HTML; they are packaging opportunities rather than mandatory new primitives.','']
    for x in [x for x in reach if x['status']=='recipe']:
        c=registry[x['component_id']]
        lines+=['- **'+c['label']+f'**: {x["required_pattern_count"]} required patterns, {x["optional_pattern_count"]} optional variants. Reuse '+', '.join(registry[a]['label'] for a in c['area_families'])+'. '+link('Range evidence',c['range_evidence'][0]['url'])+'.']
    lines+=['', '## How to read coverage.json','',
      '- `patterns[id].required_components` maps each requirement to an Area status and family IDs. `optional_components` applies only to expanded variants. These are not all independently installed packages.',
      '- `components[id]` supplies labels, status rationale, owner status, pinned inventory/manifest/spec evidence and the pinned range cross-check. `area_families` on a non-built capability means candidate reuses, not proof of that capability.',
      '- `built` means the family exists at the baseline. `complete` and `review` are copied separately from the owner registry, never conferred here.',
      '- `recipe` means composable anatomy without a named exported family. `partial` means missing shared behavior despite usable anatomy. `missing` means the named primitive/manager/adapter was not found in the cited inventory, exports and range corpus.',
      '- Plain headings, text, landmarks, links, images, lists and form markup do not need invented Area families. Domain logic, services, routing, permissions and persistence are recorded in the behavior boundary rather than counted as component gaps.', '',
      '## Public reference coverage and lookup limits','']
    for system in dict.fromkeys(s['system'] for s in SOURCES.values()):
        ids=[id for id,s in SOURCES.items() if s['system']==system]
        lines+=['- **'+system+'**: '+source_links(ids)+'.']
    lines+=['', 'All source URLs were checked on '+DATE+'. '+link('source-checks.json','source-checks.json')+' records final URL, HTTP result and content hash. HTTP success alone does not prove the authored finding. '+link('Lookup notes','lookup-notes.md')+' records moved, unavailable or script-only entry points and bounded not-found results. Public Untitled UI descriptions do not verify paid code or behavior. Material and Apple references are platform guidance, not React implementation promises.', '',
      '## Owner questions','',
      '1. Which showcase screens should be built first, and which should remain fixture-only explorations?',
      '2. Should Sidebar, PageHeader, EmptyState, Pagination and Accordion be named library recipes, exported families, or both?',
      '3. Which shared behaviors belong to Area: aggregate form validation, selectable collections, upload lifecycle and Toast queueing?',
      '4. Which engines should back charts, data grids and rich/code editors? These choices should precede claims of complete screen functionality.',
      '5. Should the first inspector and assistant examples stay within today’s controls, or include new gradients, attachments, docking and advanced collection behavior?', '',
      '## Reproduction and checks','',
      'No dependencies were added. `npm ci` and `npm run build` passed in the isolated worktree before research. Research files are not docs-site routes; no component or gallery UI is changed and no preview server is needed. `npm run build:docs` also passed, including manifest parity and the docs audit. The catalogue validator passed for all categories, mappings, pinned source lines, links and computed priorities. Final whitespace and push/PR results are recorded in the draft PR.', '',
      '```sh\nPYTHONDONTWRITEBYTECODE=1 python3 docs/research/astra/patterns/render.py\nPYTHONDONTWRITEBYTECODE=1 python3 docs/research/astra/patterns/validate.py\ngit diff --check\n```','',
      'The renderer reads Area and range files with `git show` at the fixed commits above. Reproduction requires those objects to be fetched. `catalogue.py`, `area.py` and `sources.py` are the authored inputs. Run `check_sources.py` only when deliberately refreshing URL retrieval metadata; it uses the Python standard library and does not retain page bodies. Source links can change after the checked date; pinned Area evidence remains reproducible.', '',
      '## DONE','',
      '- [x] Every requested category is covered.',
      '- [x] Every pattern links a dated public source and records purpose, anatomy, required Area families, gaps, variations and responsive behavior.',
      '- [x] Area availability is cross-checked against all three pinned range branches and the pinned main baseline.',
      '- [x] coverage.json maps patterns to requirements and Area status, with computed gap reach.',
      '- [x] Twenty showcase patterns and the broadest missing capabilities are identified.',
      '- [x] Only docs/research/patterns is changed; no component, icon, guide, handoff or completion-registry edits.',
      '- [x] No logged-in products, owner browser, new dependencies or personal captures were used.',
      '- [x] Pattern recommendations do not confer component completion or authorize their implementation.', '']
    (ROOT/'README.md').write_text('\n'.join(lines))
    print(json.dumps(coverage['counts']))
if __name__=='__main__':render()
