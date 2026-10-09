#!/usr/bin/env python3
"""Read-only integrity and independent arithmetic checks, not visual approval."""
import json,re,subprocess
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=next(p for p in HERE.parents if (p/'.git').exists())
A='6f896789a5200bcbd34fe87de458e60ca82141d6'
R='817c9eeeedacf7a5e477289d44f38f8e4f15f103'
cache={}; pins=set(); errors=[]
def req(ok,msg):
 if not ok: errors.append(msg)
def anchor(s): return re.sub(r'[^\w\- ]','',s.lower()).replace(' ','-')
for p in HERE.iterdir():
 if p.is_file(): req(p.stat().st_size<1_000_000,f'oversize {p.name}')
for p in HERE.glob('*.md'):
 for target in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  if target.startswith('https://github.com/ethanwongwork/area/blob/'):
   m=re.fullmatch(r'https://github.com/ethanwongwork/area/blob/([a-f0-9]{40})/([^#]+)#L(\d+)(?:-L(\d+))?',target)
   req(bool(m),f'malformed pin {target}')
   if not m: continue
   sha,file,start,end=m.groups();req(sha in (A,R),'unexpected SHA')
   if (sha,file) not in cache: cache[sha,file]=subprocess.check_output(['git','show',f'{sha}:{file}'],cwd=ROOT,text=True).splitlines()
   req(1<=int(start)<=int(end or start)<=len(cache[sha,file]),f'pin bounds {target}');pins.add(target)
  elif target.startswith('https://'): continue
  else:
   file,_,frag=target.partition('#');dest=p.parent/file if file else p
   req(dest.is_file(),f'missing local {target}')
   if frag and dest.is_file():
    txt=dest.read_text(); anchors={anchor(s) for s in re.findall(r'^#{1,6} (.+)$',txt,re.M)}|set(re.findall(r'<a id="([^"]+)">',txt))
    req(frag in anchors,f'missing anchor {target}')
styles=json.loads((HERE/'styles.json').read_text())['styles']
tax=json.loads(subprocess.check_output(['git','show',f'{R}:docs/research/astra/materials/01-taxonomy/taxonomy.json'],cwd=ROOT,text=True))
req([x['id'] for x in styles]==[x['id'] for x in tax['styles']],'taxonomy coverage')
settings=['0','2','4','6','8','10','12','14','pill']
for s in styles:
 for k in ('dark','shadow','glow','highlight','stroke','compact'): req(bool(s[k].strip()),f'empty {s["id"]} {k}')
 req(list(s['radius'])==settings,f'radius coverage {s["id"]}')
g=json.loads((HERE/'geometry.json').read_text()); cases=g['control_cases']
req(len(cases)==54,'54 control cases'); req(len(g['surface_cases'])==18,'18 surface cases')
req(len({(r['setting'],r['density'],r['size']) for r in cases})==54,'unique cases')
# Independent expected values at reference sizes, Sharp, Pill and monotonicity.
for r in cases:
 req(r['q']==r['height']/32,'q')
 req(0<=r['radius']<=r['height']/2,'radius bounds')
 req(r['inner_rim_at_1']==max(0,r['radius']-1),'rim one')
 req(r['inner_rim_at_2']==max(0,r['radius']-2),'rim two')
 if r['setting']=='0': req(r['radius']==0,'Sharp')
 if r['setting']=='pill': req(r['radius']==r['height']/2,'Pill')
 if r['density']=='default' and r['size']=='md': req(r['radius']==(16 if r['setting']=='pill' else int(r['setting'])),'reference corner')
for density in ('default','compact'):
 for size in ('sm','md','lg'):
  v=[next(r['radius'] for r in cases if r['setting']==s and r['density']==density and r['size']==size) for s in settings]
  req(v==sorted(v),'monotonic')
for r in g['surface_cases']:
 req(r['list']<=r['container'],'list cap')
 req(r['list_row']<=r['row_height']/2,'row cap')
 if r['setting']=='pill': req(r['list']==(20 if r['density']=='default' else 16),'pill list geometry')
readme=(HERE/'README.md').read_text()
req(readme.startswith('**Question:**'),'Question first')
req(readme.index('**Question:**')<readme.index('**Answer:**')<readme.index('**Snapshot:**'),'README order')
if errors: raise SystemExit('\n'.join(errors))
print(f'PASS: 25 styles, 225 radius cells, 54 control cases, 18 surface cases, {len(pins)} pinned citations; links, line bounds and file sizes.')
