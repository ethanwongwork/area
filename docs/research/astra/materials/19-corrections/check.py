"""Validate the correction pass, without modifying research or production files."""
from pathlib import Path
import ast,hashlib,json,re,subprocess
from collections import Counter
H=Path(__file__).resolve().parent;M=H.parent;ROOT=next(p for p in H.parents if (p/'.git').exists())
BASE='d2f9b9772677b32997dc6c0be1ea64b40cd835c8'
AREA='9036ed9293beb7a867bdf637ee768c7a46a9901a'
PREFIX='docs/research/astra/materials/'
def read(rel):return json.loads((M/rel).read_text())
def old(rel):return subprocess.check_output(['git','show',BASE+':'+PREFIX+rel],cwd=ROOT)
r=read('04-role-map/role-map.json');a=read('05-absorption/absorption.json');p=read('13-presets/presets.json')
old_r=json.loads(old('04-role-map/role-map.json'))
new=set(f['id'] for f in r['families'])-set(f['id'] for f in old_r['families'])
expected=set('fileUpload fileUploadList fileUploadItem emptyState toggleGroup descriptionList meter searchField shortcutList dateRangePicker citation zoomControl board boardColumn boardCard timeline timelineItem editableText boxModel scrollArea link toggletip pagination'.split())
assert new==expected
assert r['area_commit']==a['area_commit']==AREA
assert r['summary']['parts']==773 and r['summary']['manifest_contracts']==101
assert len(r['role_vocabulary'])==13
parts=r['environment']+[x for f in r['families'] for x in f['parts']]
assert len(parts)==len({x['id'] for x in parts})==773
by_id={x['id']:x for x in parts}
for x in parts:
 assert x['sources'] and len(x['sources'])>0
 if 'hover-plate' in x['id']:assert x['role']=='row-plate',x['id']
for name in 'menu.item nav.item treeView.row table.row select.option combobox.option customSelect.option commandPalette.item calendar.day tagPicker.option'.split():assert by_id[name]['role']=='row-plate'
assert sum(x['kind']=='nonpaint' for x in parts)==171
assert r['summary']['hidden_nonpaint_records']+r['summary']['layout_nonpaint_records']==171
assert sum(len(f.get('compositions',[])) for f in r['families'])==135
assert 'transparent' in by_id['kbd.root']['note']
assert any(v['depth']=='flush' for v in by_id['card.root']['depth_variants'])
assert len(a['styles'])==25 and sum(len(s['recipes']) for s in a['styles'])==325
assert len(a['families'])==101 and len(a['guards'])==23
required=set('cutout-gaps fixed-colour-fades translucent-washes list-focus-plate solid-emphasis disabled-group-opacity'.split())
assert required<={g['id'] for g in a['guards']}
assert all(x['strengthMultiplier'] is None for s in a['styles'] for x in s['recipes'])
assert len(p['presets'])==9 and len(p['roles'])==13
presets={x['id']:x for x in p['presets']}
for mode in ['light','dark']:
 for x in presets.values():assert set(x['modes'][mode]['roles'])==set(p['roles'])
 for role,record in presets['none']['modes'][mode]['roles'].items():
  assert record['identity'] and not record['emitsMaterialDeclarations']
 for record in presets['paper']['modes'][mode]['roles'].values():
  if record['controls']['stroke']['coverage']!='none':assert record['controls']['stroke']['opacity']==1
 for record in presets['prism']['modes'][mode]['roles'].values():
  for gradient in record['controls']['gradients'].values():
   assert all(s['source'] in ['accent','neutral'] and not any('#' in str(v) for v in s.values()) for s in gradient['stops'])
 assert 'sparse-painted-shell-only' in presets['glass']['modes'][mode]['roles']['container']['guard']
assert 'Gloss softness undefined' not in (M/'16-specimen/specimen.js').read_text()
html=(M/'16-specimen/index.html').read_text();assert 'Irene Yamaguchi' in html and 'David Tee' not in html
# Exact SVG geometry is retained, only the research-owned annotation namespace changes.
f=read('12-glyphs-text/fixtures.json');o=json.loads(old('12-glyphs-text/fixtures.json'))
for k,v in f['fixtures'].items():assert v['svg'].replace('data-material-part','data-part').replace('data-material-ink','data-ink')==o['fixtures'][k]['svg']
# Historical quantitative artifacts must remain byte-for-byte, even after older inputs change.
kept=[]
paths=subprocess.check_output(['git','ls-tree','-r','--name-only',BASE,PREFIX],cwd=ROOT,text=True).splitlines()
for path in paths:
 rel=path.removeprefix(PREFIX)
 if (rel.startswith(('11-performance/','15-consistency/','18-contrast-harness/')) and rel.endswith('.json')) or rel in ['16-specimen/verification.json','16-specimen/preset-data.js']:
  assert (ROOT/path).read_bytes()==old(rel),rel
  kept.append(rel)
changes=read('19-corrections/changes.json')['changes'];assert len(changes)==27
for x in changes:
 assert x['id'] in (M/x['folder']/'README.md').read_text()
 for file in x['files']:assert (M/x['folder']/file).is_file()
from supersede import annotate,TARGETS
seen=[]
for rel in TARGETS:
 text=(M/rel).read_text();expected,records=annotate(rel,text)
 assert expected==text,('stale/non-idempotent annotation',rel)
 seen+=records
assert read('19-corrections/decision-overrides.json')['passages']==seen
assert {d for x in seen for d in x['decisions']}=={f'D{i}' for i in range(1,17)}
for path in H.iterdir():
 if path.is_file():
  assert path.stat().st_size<1_000_000,path
  if path.suffix=='.py':ast.parse(path.read_text())
# Fresh pins resolve to the requested latest snapshot. Old research pins keep their original SHA.
cache={};pins=set()
for folder in sorted({x['folder'] for x in changes}):
 for path in (M/folder).glob('*.md'):
  for file,lo,hi in re.findall(r'https://github.com/ethanwongwork/area/blob/'+AREA+r'/([^#)]+)#L(\d+)(?:-L(\d+))?',path.read_text()):
   if file not in cache:cache[file]=subprocess.check_output(['git','show',AREA+':'+file],cwd=ROOT).splitlines()
   assert 1<=int(lo)<=int(hi or lo)<=len(cache[file]),(file,lo,hi)
   pins.add((file,lo,hi))
print(f'PASS: 27 corrections; {len(seen)} decision callouts; 23 added contracts; 101/13/773 inventory; 325 cells; 9×13×2 preset records; {len(kept)} historical artifacts unchanged; {len(pins)} current source ranges valid.')
print('Scope: structural/source integrity, not optical approval, new contrast certification or performance calibration.')
