"""Validate research scope, mappings, source pins, rendering and priority arithmetic."""
import ast, hashlib, json, re, subprocess
from functools import lru_cache
from pathlib import Path
from catalogue import CATEGORIES, PATTERNS, SHOWCASE
from sources import SOURCES, DATE
from area import BASE, RANGE
ROOT=Path(__file__).resolve().parent
EXPECTED={'app-shells','settings','onboarding-empty-states','sign-in-account','forms-flows',
 'tables-list-views','dashboards','detail-pages','inbox-notifications','search-command','chat-ai-assistant',
 'document-editor','design-tool-inspector','billing-plans','errors-system-states',
 'file-upload-management','comments-collaboration','marketing'}
@lru_cache(None)
def pinned(sha,path):
    return subprocess.check_output(['git','show',f'{sha}:{path}'],text=True).splitlines()
def check():
    d=json.loads((ROOT/'coverage.json').read_text());cs=d['components'];ps=d['patterns']
    assert set(d['categories'])==EXPECTED==set(CATEGORIES)
    assert len(SHOWCASE)==20==len({x[0] for x in SHOWCASE})
    assert len(PATTERNS)==len(ps)==len({p['id'] for p in PATTERNS})
    assert d['area_base_commit']==BASE
    assert d['range_commits']=={str(k):v for k,v in RANGE.items()}
    checks=json.loads((ROOT/'source-checks.json').read_text())
    assert set(checks)==set(SOURCES)
    assert {s['system'] for s in SOURCES.values()}=={'Primer','Carbon','Polaris','Atlassian','GOV.UK','Fluent','Material','Apple HIG','Untitled UI','shadcn'}
    for id,s in SOURCES.items():
        assert s['checked_on']==DATE and s['finding'] and s['url'].startswith('https://')
        c=checks[id];assert c['checked_on']==DATE
        assert c['http_status']==200 and re.fullmatch('[0-9a-f]{64}',c['sha256'])
    for c in cs.values():
        assert c['area_status'] in {'built','recipe','partial','missing'}
        assert c['area_evidence'] and c['range_evidence'] and c['status_note']
        for family in c['area_families']: assert cs[family]['area_status']=='built'
        for e in c['area_evidence']+c['range_evidence']:
            assert re.fullmatch('[0-9a-f]{40}',e['commit'])
            lines=pinned(e['commit'],e['path'])
            assert 0<e['line']<=len(lines),(c['id'],e)
            end=re.search(r'-L(\d+)$',e['url'])
            if end:assert e['line']<=int(end[1])<=len(lines),e
        if c['area_status']=='built':
            e=c['area_evidence'][0]; body='\n'.join(pinned(e['commit'],e['path']))
            assert 'block: "area-'+c['id']+'"' in body
            registry='\n'.join(pinned(BASE,'apps/docs/src/component-status.mjs'))
            name='COMPLETE' if c['owner_status']=='complete' else 'REVIEW'
            group=registry.split('export const '+name+'_COMPONENTS = new Set([')[1].split(']);')[0]
            assert "'"+c['id']+"'" in group
    for id,p in ps.items():
        assert p['category'] in EXPECTED and p['anatomy'] and len(p['anatomy'])>=3
        assert p['purpose'] and p['variations'] and p['responsive_proposal'] and p['runtime_contract']
        assert p['sources'] and p['source_ids']
        assert p['sources']==[SOURCES[x] for x in p['source_ids']]
        required=[x['component_id'] for x in p['required_components']]
        optional=[x['component_id'] for x in p['optional_components']]
        assert len(required)==len(set(required)) and len(optional)==len(set(optional))
        assert not set(required)&set(optional)
        for dep in p['required_components']+p['optional_components']:
            assert dep['area_status']==cs[dep['component_id']]['area_status']
            assert dep['area_families']==cs[dep['component_id']]['area_families']
        assert p['missing_or_partial']==[x for x in required if cs[x]['area_status'] in ('missing','partial')]
        body=(ROOT/p['file']).read_text();assert f'<a id="{id}"></a>' in body
        section=body.split(f'<a id="{id}"></a>')[1].split('<a id=')[0]
        for marker in ('**Purpose.**','**Anatomy, in order','**Required components','**What Area lacks','**Common variations','**Responsive proposal.**','**Behavior boundary.**','**Source observations.**'):
            assert marker in section,(id,marker)
        for s in p['sources']:assert s['url'] in section
    for cat,c in d['categories'].items():
        assert c['pattern_ids']==[id for id,p in ps.items() if p['category']==cat] and c['pattern_ids']
    for r in d['priorities']:
        id=r['component_id']
        expected=[p['id'] for p in ps.values() if id in {x['component_id'] for x in p['required_components']}]
        optional=[p['id'] for p in ps.values() if id in {x['component_id'] for x in p['optional_components']}]
        assert r['required_patterns']==expected and r['required_pattern_count']==len(expected)
        assert r['optional_patterns']==optional and r['optional_pattern_count']==len(optional)
        assert r['sole_remaining_shared_gap_patterns']==([x for x in expected if ps[x]['missing_or_partial']==[id]] if r['status'] in ('missing','partial') else [])
    shown={c['component_id'] for id,_ in SHOWCASE for c in ps[id]['required_components'] if c['area_status']=='built'}
    assert d['counts']['built_families_in_showcase']==len(shown)
    assert d['counts']['categories']==len(EXPECTED) and d['counts']['patterns']==len(ps)
    assert d['counts']['sources']==len({s for p in ps.values() for s in p['source_ids']})
    # Check local links and pinned GitHub source line bounds, including Markdown-only links.
    links=0
    for path in ROOT.glob('*.md'):
        text=path.read_text()
        for target in re.findall(r'\]\(([^)]+)\)',text):
            if target.startswith('https://github.com/ethanwongwork/area/blob/'):
                match=re.search(r'/blob/([0-9a-f]{40})/(.+)#L(\d+)(?:-L(\d+))?$',target)
                assert match,target
                lines=pinned(match[1],match[2]);assert 0<int(match[3])<=int(match[4] or match[3])<=len(lines)
            elif not target.startswith(('https://','http://')):
                file,_,anchor=target.partition('#');resolved=ROOT/file if file else path
                assert resolved.is_file(),(path,target)
                if anchor:assert f'id="{anchor}"' in resolved.read_text(),(path,target)
            links+=1
    for path in ROOT.glob('*.py'):ast.parse(path.read_text())
    # The complete research tree must regenerate without differences.
    outputs=[ROOT/'README.md',ROOT/'coverage.json']+[ROOT/(x+'.md') for x in EXPECTED]
    before={x:x.read_bytes() for x in outputs}
    from render import render
    render()
    assert all(x.read_bytes()==data for x,data in before.items()),'Generated output drift'
    paths=subprocess.check_output(['git','diff','origin/main','--name-only'],text=True).splitlines()
    paths+=subprocess.check_output(['git','ls-files','--others','--exclude-standard'],text=True).splitlines()
    assert all(p.startswith('docs/research/patterns/') for p in paths),paths
    assert not list(ROOT.rglob('__pycache__')),'Do not commit Python cache files'
    print(f'PASS: {len(ps)} patterns, {len(EXPECTED)} categories, {len(SOURCES)} dated sources, {len(cs)} component/capability records, {links} Markdown links; pinned lines, priorities, rendering and change scope verified.')
if __name__=='__main__':check()
