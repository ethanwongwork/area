#!/usr/bin/env python3
"""Generate analytical geometry from pinned Area source; no browser measurements."""
import json, re, subprocess
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=next(p for p in HERE.parents if (p/'.git').exists())
A='6f896789a5200bcbd34fe87de458e60ca82141d6'
R='817c9eeeedacf7a5e477289d44f38f8e4f15f103'
def src(p): return subprocess.check_output(['git','show',f'{A}:{p}'],cwd=ROOT,text=True)
def pin(p,a,b): return f'https://github.com/ethanwongwork/area/blob/{A}/{p}#L{a}-L{b}'
radius=src('packages/tokens/src/axes/radius.ts')
steps=[(s,int(b),int(c)) for s,b,c in re.findall(r'\["(0|2|4|6|8|10|12|14|pill)", (\d+), (\d+)\]',radius)]
density=src('packages/tokens/src/axes/density.ts')
def heights(name):
 block=density.split(f'export const {name}_TIERS')[1].split('};')[0]
 return {s:int(h) for s,h in re.findall(r'(sm|md|lg):\s*\{\s*height: (\d+)',block)}
heights_by_density={n.lower():heights(n) for n in ('DEFAULT','COMPACT')}
def corner(h,b): return max(0 if b==0 else 2, int(h*b/32/2)*2)
rows=[]; lists=[]
for s,b,c in steps:
 for density,hs in heights_by_density.items():
  for size,h in hs.items():
   r=corner(h,b)
   rows.append(dict(setting=s,density=density,size=size,height=h,radius=r,inner_rim_at_1=max(0,r-1),inner_rim_at_2=max(0,r-2),q=h/32))
  rh=32 if density=='default' else 24
  lr=min(max(min(4,b),c-4),b,rh/2-min(2,(.5-b/32)*1000))
  lists.append(dict(setting=s,density=density,container=c,row_height=rh,row=corner(rh,b),list_row=lr,list=min(c,lr+4)))
data=dict(area_commit=A,research_commit=R,units='CSS px; q dimensionless; rims at 1 and 2 are analytical examples, not preset values',control_cases=rows,surface_cases=lists)
(HERE/'geometry.json').write_text(json.dumps(data,indent=2)+'\n')
lines=['# Radius and size geometry','', '**Observed inputs; calculated outputs.** Every control case uses Area’s formula with pill flags off, uniform corners and a box at least as wide as its height. Numbers are CSS pixels. The rim insets of 1 and 2 below are analytical examples, not adopted material widths. They also illustrate where an inner corner must become square.','',f'Inputs: [radius steps]({pin("packages/tokens/src/axes/radius.ts",26,66)}), [default heights]({pin("packages/tokens/src/axes/density.ts",135,144)}), [compact heights]({pin("packages/tokens/src/axes/density.ts",156,162)}), [radius derivation]({pin("packages/tokens/src/emit/base.ts",249,272)}).','', '## Controls at every setting','', '| Setting | Density | sm: height / radius | md: height / radius | lg: height / radius | md inner rim at inset 1 / 2 |','| --- | --- | --- | --- | --- | --- |']
for s,b,c in steps:
 for density in heights_by_density:
  rs=[r for r in rows if r['setting']==s and r['density']==density]; md=rs[1]
  lines.append('| '+('Sharp (0)' if s=='0' else s)+' | '+density+' | '+' | '.join(f"{r['height']} / {r['radius']}" for r in rs)+f" | {md['inner_rim_at_1']} / {md['inner_rim_at_2']} |")
lines += ['', '## Surfaces and lists at every setting','', 'Surface corners do not follow control height. Floating lists use their separate row-plus-padding formula; their maximum differs with density. Values below are token results before CSS overlap normalization for the actual box.','', '| Setting | Density | Container | General row | Floating list row | Floating list shell |','| --- | --- | --- | --- | --- | --- |']
for r in lists: lines.append('| '+' | '.join((f'{r[k]:g}' if isinstance(r[k],(int,float)) else str(r[k])) for k in ('setting','density','container','row','list_row','list'))+' |')
lines += ['', '## Concentric rims and exceptions','', 'See [geometry contract](rules.md#concentric-geometry) for used-radius normalization, inset equations, pill overrides, nested-child floors, Sharp joins and connected regions. These tables apply to every style; a material must never select a different radius setting to preserve its appearance. [Per-style matrix](styles.md) states what gets simplified when its layers no longer fit.', '', 'Regenerate with `python3 docs/research/astra/materials/09-dark-density/build.py`. This reads the immutable source commit through Git, not production files in the research checkout.']
(HERE/'geometry.md').write_text('\n'.join(lines)+'\n')
print(f'Generated {len(rows)} control cases and {len(lists)} surface/list cases')
