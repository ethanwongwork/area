#!/usr/bin/env python3
"""Validate the run-3 deliverable, citations and its isolated edit boundary."""
import json,re,subprocess
from pathlib import Path
from urllib.parse import unquote,urlparse
P=Path(__file__).resolve().parent;ROOT=P.parents[2]
load=lambda name:json.loads((P/name).read_text())
index=load('index-3.json');scope=load('scope-3.json');pins=load('source-pins-3.json');ledger=load('source-ledger-3.json');pages=load('checked-pages-3.json');plan=load('build-order-3.json')
errors=[]
assert len([r for r in index.values() if r.get('page','').startswith('no-evidence.md#')])==13
assert index['banner']['area_status']=='built'
bounded=next(o for o in index['date-picker']['options'].values() if o['label']=='Bounded and unavailable dates')
assert bounded['system_count']==6
assert {'Ant Design','Fluent 2','Carbon'} <= set(bounded['systems'])
def check(value,message):
    if not value:errors.append(message)
check(subprocess.check_output(['git','branch','--show-current'],cwd=ROOT,text=True).strip()=='astra/library-range-3','Wrong branch')
check(set(index)=={s['slug'] for s in scope},'Scope/index mismatch')
check(len(plan)==len(scope) and {x['family'] for x in plan}==set(index),'Build order incomplete')
positions={r['family']:i for i,r in enumerate(plan)}
manifest=(ROOT/'packages/styles/src/manifest.ts').read_text();built={x.lower() for x in re.findall(r'export const (\w+) = \{',manifest)}
headings=['Job','Variant axes','Structural alternatives','Interaction patterns','Reuses in Area','Proposed range','Sources']
urls=set();option_count=0
for slug,row in index.items():
    path=P/row.get('page',slug+'.md').split('#')[0];check(path.exists(),slug+' missing file')
    if not path.exists():continue
    md=path.read_text();check(row.get('page','').startswith('no-evidence.md#') or re.findall(r'^## (.+)$',md,re.M)==headings,slug+' wrong sections')
    check(len(row['coverage'])==16,slug+' lacks system checks')
    check(row['family_system_count']==len(set(row['family_systems'])),slug+' family count')
    check(row['component_system_count']+len(row['recipe_only_systems'])==row['family_system_count'],slug+' component/recipe split')
    check(all(reuse.lower() in built for reuse in row['reuses']),slug+' unknown existing reuse')
    observed=set()
    for system,cov in row['coverage'].items():
        check(cov.get('checked') and cov.get('catalog') and cov.get('queries'),slug+' incomplete lookup')
        if any(f['status'] in ['component','recipe'] for f in cov['findings']):observed.add(system)
    check(observed==set(row['family_systems']),slug+' family support mismatch')
    check((not row['options'] and row.get('evidence_status')) or any(o['proposed'] for o in row['options'].values()),slug+' missing proposal')
    for oid,opt in row['options'].items():
        option_count+=1;name=slug+'/'+oid
        check(bool(opt['evidence']),name+' missing evidence')
        check(opt['system_count']==len(set(opt['systems'])),name+' count mismatch')
        check(opt['reuses']==row['reuses'],name+' reuse mismatch')
        expected={ev['system'] for ev in opt['evidence'] if not ev.get('analogue') and ev['system']!='Apple HIG'}
        check(expected==set(opt['systems']),name+' unsupported system count')
        for ev in opt['evidence']:
            check(ev.get('checked') and ev.get('unit') in ledger,name+' lacks provenance')
            check(ev.get('url','').startswith('https://'),name+' missing URL')
            urls.add(ev.get('url',''))
        check(opt['layer'] in [2,3],name+' invalid layer')
    for url in re.findall(r'\]\((https://[^\s)]+)\)',md):urls.add(url)
for row in plan:
    for dep in row['new_prerequisites']:check(positions[dep]<positions[row['family']],row['family']+' precedes dependency')
# Collect every source and axis citation, not just selected proposals.
for row in ledger.values():
    urls.update(s['url'] for s in row['sources'])
    urls.update(a['source'] for a in row['axes'])
    urls.update(h['source'] for h in row['headings'])
checked={u.rstrip('/') for v in pages.values() if v['status']==200 for u in [v['url'],v.get('final_url',v['url'])]}
cache={};line_checks=0;web_checks=0
for url in urls:
    parsed=urlparse(url);path=unquote(parsed.path)
    match=re.search(r'/(?:blob|src)/([a-f0-9]{40})/(.+)',path)
    if match:
        sha,file=match.groups()
        pin=next((v for v in pins.values() if v['sha']==sha),None)
        if pin:local=ROOT/pin['path']/file
        elif sha in {next(iter(index.values()))['base_commit'],index['banner']['area_review_commit']}:
            content=subprocess.check_output(['git','show',sha+':'+file],cwd=ROOT,text=True)
            nums=[int(n) for n in re.findall(r'\d+',parsed.fragment)]
            check(bool(nums) and all(1<=n<=len(content.splitlines()) for n in nums),'Invalid Area line: '+url)
            line_checks+=1
            continue
        else:check(False,'Unpinned commit: '+url);continue
        check(local.is_file(),'Missing cached cited file: '+url)
        if local.is_file():
            if local not in cache:cache[local]=len(local.read_text(errors='replace').splitlines())
            nums=[int(n) for n in re.findall(r'\d+',parsed.fragment)]
            check(bool(nums) and all(1<=n<=cache[local] for n in nums),'Invalid line citation: '+url)
            line_checks+=1
    elif parsed.netloc in ['github.com','bitbucket.org'] and re.search('/(?:tree|src)/[a-f0-9]{40}$',path):pass
    elif parsed.netloc=='developer.apple.com' and path.startswith('/design/human-interface-guidelines/'):
        api='https://developer.apple.com/tutorials/data'+path+'.json'
        check(api.rstrip('/') in checked,'Unverified HIG page: '+url);web_checks+=1
    else:
        check(url.split('#')[0].rstrip('/') in checked,'Unverified public page: '+url);web_checks+=1
# Shared files, caches and generated build output must never enter this branch's diff.
changed=subprocess.check_output(['git','diff','--name-only','origin/main'],cwd=ROOT,text=True).splitlines()
for file in changed:
    check(file.startswith('docs/research/library-range/'),'Outside scope: '+file)
    check(not any(part.startswith('.') or part=='__pycache__' for part in Path(file).parts),'Cache in diff: '+file)
failures=P/'.evidence-failures-3.json'
if failures.exists():check(not load(failures.name),'Unresolved proposed evidence')
print(f'Validated {len(index)} families, {option_count} options, {len(scope)*16} system checks, {line_checks} pinned line URLs and {web_checks} checked page URLs.')
if errors:
    print('\n'.join(errors));raise SystemExit(f'{len(errors)} validation errors')
print('All research invariants passed.')
