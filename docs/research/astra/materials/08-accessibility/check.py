#!/usr/bin/env python3
"""Read-only document/data integrity checks; not a conformance test."""
import json
import re
import subprocess
from pathlib import Path
HERE = Path(__file__).resolve().parent
ROOT = next(p for p in HERE.parents if (p / '.git').exists())
A = '6f896789a5200bcbd34fe87de458e60ca82141d6'
R = '666bdcefb602e371da81f4dd30f6f7061f61f482'
cache, errors, pins, public = {}, [], set(), set()
def require(ok, message):
    if not ok: errors.append(message)
def anchor(s):
    return re.sub(r'[^\w\- ]', '', s.lower()).replace(' ', '-')
for p in sorted(HERE.iterdir()):
    if p.is_file(): require(p.stat().st_size < 1_000_000, f'{p.name}: size')
for p in HERE.glob('*.md'):
    for target in re.findall(r'\]\(([^)]+)\)', p.read_text()):
        if target.startswith('https://github.com/ethanwongwork/area/blob/'):
            m = re.fullmatch(r'https://github.com/ethanwongwork/area/blob/([a-f0-9]{40})/([^#]+)(?:#L(\d+)(?:-L(\d+))?)?', target)
            require(bool(m), f'{p.name}: bad pin {target}')
            if not m: continue
            sha,file,start,end=m.groups()
            require(sha in (A,R), f'unexpected snapshot {sha}')
            if (sha,file) not in cache:
                cache[sha,file]=subprocess.check_output(['git','show',f'{sha}:{file}'],cwd=ROOT,text=True).splitlines()
            if start:
                require(1<=int(start)<=int(end or start)<=len(cache[sha,file]), f'invalid line bounds {target}')
                pins.add(target)
            else: require(file.endswith('.json'), f'missing source lines {target}')
        elif target.startswith('https://'):
            public.add(target)
        else:
            file,_,frag=target.partition('#')
            dest=p.parent/file if file else p
            require(dest.is_file(),f'missing link {target}')
            if frag and dest.is_file():
                headings=re.findall(r'^#{1,6} (.+)$',dest.read_text(),re.M)
                anchors={anchor(h) for h in headings}|set(re.findall(r'<a id="([^"]+)">',dest.read_text()))
                require(frag in anchors,f'missing anchor {target}')
tax=json.loads(subprocess.check_output(['git','show',f'{R}:docs/research/astra/materials/01-taxonomy/taxonomy.json'],cwd=ROOT,text=True))
data=json.loads((HERE/'styles.json').read_text())['styles']
require([s['id'] for s in data]==[s['id'] for s in tax['styles']], 'taxonomy order/coverage')
for row in data:
    for key in ['text','non_text','focus_scene','transparency','contrast','forced_colors','motion']:
        require(bool(row[key].strip()), f'{row["id"]}: empty {key}')
roles=['page','container','floating surface','raised control','recessed field/track','thumb/knob','indicator/fill','divider','edge','glyph','text','scrim']
fallback=(HERE/'fallbacks.md').read_text()
for role in roles: require(f'| {role} |' in fallback, f'missing role {role}')
for feature in ['prefers-reduced-transparency','prefers-contrast','forced-colors','prefers-reduced-motion']:
    require(feature in fallback, f'missing feature {feature}')
readme=(HERE/'README.md').read_text()
require(readme.startswith('**Question:**'), 'opening Question')
require(readme.index('**Question:**')<readme.index('**Answer:**')<readme.index('**Snapshot:**'),'opening order')
if errors: raise SystemExit('\n'.join(errors))
print(f'PASS: {len(data)} styles × 7 fields; {len(roles)} roles; {len(pins)} Area/research line pins in {len(cache)} files; local links and sizes.')
print(f'{len(public)} external/tree URLs recorded; checked through research browsing, not fetched by this validator.')
