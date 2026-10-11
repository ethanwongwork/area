"""Read-only artifact, coverage, immutable citation and witness verification."""
from pathlib import Path
from functools import lru_cache
import csv, hashlib, json, math, os, re, subprocess, sys
from paint import contrast, rgb

HERE=Path(__file__).resolve().parent; REPO=HERE.parents[4]
load=lambda name:json.loads((HERE/name).read_text())
inputs=load('inputs.json'); bindings=load('bindings.json'); summary=load('summary.json')
fixtures={f['id']:f for f in bindings['fixtures']}; measures=load('measurements.json')
presets=json.loads((HERE/'../13-presets/presets.json').read_text())
assert hashlib.sha256((HERE/'../13-presets/presets.json').read_bytes()).hexdigest()==inputs['presets']['sha256']
assert len(fixtures)==433 and len(summary['results'])==16
covered={f['assertion'] for f in fixtures.values()}; excluded={f['index'] for f in bindings['excludedAssertions']}
assert not covered&excluded and covered|excluded==set(range(len(inputs['assertions'])))
assert len(covered)==213 and len(excluded)==30
for f in fixtures.values():
    a=inputs['assertions'][f['assertion']]
    assert (f['fg'],f['bg'],f['threshold'],f['apcaFloor'])==(a['fg'],a['bg'],a['wcag'],a['apca'])
    assert f['threshold'] in [3,4.5]
for item in summary['results']:
    assert list(item['roles'])==presets['roles']
    data=load(f'results-{item["preset"]}-{item["mode"]}.json')
    for scenario,records in data['scenarios'].items():
        assert set(records)==set(fixtures)
        for fid,mid in records.items():
            f=fixtures[fid]; r=measures[mid]
            if r['status']=='UNRESOLVED': continue
            ratio=contrast(rgb(inputs['themes'][item['mode']][f['fg']]),r['ground'])
            assert math.isclose(ratio,r['ratio'],abs_tol=1e-9)
            assert (ratio>=f['threshold'])==(r['status']=='PASS')
            assert len(r['backdrop'])==3 and all(0<=x<=1 for x in r['backdrop'])
        if scenario=='f0': assert all(measures[mid]['status']=='PASS' for mid in records.values())
    assert len(data['outsideScene'])==171
    assert all(measures[mid]['status']=='FAIL' and math.isclose(measures[mid]['ratio'],1,abs_tol=1e-9)
               for mid in data['outsideScene'].values())
assert summary['counts']['guarded-FAIL']==3 and summary['counts']['requested-FAIL']==32
assert len(list(csv.DictReader((HERE/'results.csv').open())))==16*12*2*3
for file in HERE.glob('*.json'): assert file.stat().st_size<1_000_000, file.name

@lru_cache(maxsize=None)
def source(sha,path):
    return subprocess.check_output(['git','show',f'{sha}:{path}'],cwd=REPO,text=True).splitlines()
pins=set()
for file in [*HERE.glob('*.md'),HERE/'bindings.json']:
    text=file.read_text()
    for sha,path,start,end in re.findall(r'https://github.com/ethanwongwork/area/blob/([0-9a-f]{40})/([^#\s)]+)#L(\d+)(?:-L(\d+))?',text):
        assert 1<=int(start)<=int(end or start)<=len(source(sha,path)),(file.name,path,start,end)
        pins.add((sha,path,start,end))
    if file.suffix=='.md':
        for target in re.findall(r'\]\(([^)]+)\)',text):
            if '://' in target or target.startswith('#'): continue
            assert (file.parent/target.split('#')[0]).exists(),(file.name,target)
environment=dict(os.environ,PYTHONDONTWRITEBYTECODE='1')
run=subprocess.run([sys.executable,str(HERE/'build.py'),'--check','--gate'],env=environment,capture_output=True,text=True)
assert run.returncode==1 and 'requested-FAIL' in run.stdout,(run.returncode,run.stdout,run.stderr)
for name in ['example-trap.json','example-gradient.json']:
    cli=subprocess.run([sys.executable,str(HERE/'check_scene.py'),str(HERE/name)],env=environment,capture_output=True,text=True)
    assert cli.returncode==1 and json.loads(cli.stdout)['status']=='FAIL'
print(f'PASS: 213/243 assertions + 30 explicit exclusions; 433 fixtures; 16 preset/modes; 12 roles; {len(pins)} source-line pins; all witnesses and JSON sizes; expected failing gate exit 1.')
