#!/usr/bin/env python3
"""Research integrity only. No rendered contrast or behavior claim."""
import json,re,subprocess,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=next(p for p in HERE.parents if (p/'.git').exists())
A='6f896789a5200bcbd34fe87de458e60ca82141d6';R='2097df6d80ef9a0ca6a7f7e6f4db946e6749db01'
errors=[];cache={};pins=set()
def req(ok,msg):
 if not ok: errors.append(msg)
def anchor(s): return re.sub(r'[^\w\- ]','',s.lower()).replace(' ','-')
for p in HERE.iterdir():
 if p.is_file(): req(p.stat().st_size<1_000_000,f'size {p.name}')
for p in HERE.glob('*.md'):
 for target in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  if target.startswith('https://github.com/ethanwongwork/area/blob/'):
   m=re.fullmatch(r'https://github.com/ethanwongwork/area/blob/([a-f0-9]{40})/([^#]+)#L(\d+)(?:-L(\d+))?',target)
   req(bool(m),f'bad pin {target}')
   if not m: continue
   sha,file,a,b=m.groups();req(sha in (A,R),'unexpected Area SHA')
   if (sha,file) not in cache: cache[sha,file]=subprocess.check_output(['git','show',f'{sha}:{file}'],cwd=ROOT,text=True).splitlines()
   req(1<=int(a)<=int(b or a)<=len(cache[sha,file]),f'line bounds {target}');pins.add(target)
  elif target.startswith('https://'): continue
  else:
   file,_,frag=target.partition('#');dest=p.parent/file if file else p
   req(dest.is_file(),f'missing {target}')
   if frag and dest.is_file():
    txt=dest.read_text();anchors={anchor(s) for s in re.findall(r'^#{1,6} (.+)$',txt,re.M)}|set(re.findall(r'<a id="([^"]+)">',txt))
    req(frag in anchors,f'missing anchor {target}')
data=json.loads((HERE/'states.json').read_text())
tax=json.loads(subprocess.check_output(['git','show',f'{R}:docs/research/astra/materials/01-taxonomy/taxonomy.json'],cwd=ROOT,text=True))
req([s['id'] for s in data['styles']]==[s['id'] for s in tax['styles']],'taxonomy coverage/order')
fields=['hover','press','focus_visible','selected_checked','open','disabled','invalid','motion','reduced_motion']
for row in data['styles']:
 for k in fields: req(bool(row[k].strip()),f'empty {row["id"]} {k}')
readme=(HERE/'README.md').read_text();req(readme.startswith('**Question:**'),'Question first')
req(readme.index('**Question:**')<readme.index('**Answer:**')<readme.index('**Snapshot:**'),'README shape')
# Generator comparison uses only in-memory snapshots; generated output stays topic-local.
before={p.name:p.read_bytes() for p in [HERE/'states.json',HERE/'states.md']}
subprocess.run([sys.executable,'-B',str(HERE/'build.py')],cwd=ROOT,check=True,stdout=subprocess.DEVNULL)
for name,content in before.items(): req((HERE/name).read_bytes()==content,f'nondeterministic/stale {name}')
if errors: raise SystemExit('\n'.join(errors))
print(f'PASS: 25 styles × 7 states; 50 motion entries; {len(pins)} Area/research pins; deterministic output, links and sizes.')
print('Public pages/source were read during research; this validator does not fetch them or certify visual behavior.')
