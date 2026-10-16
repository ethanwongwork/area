#!/usr/bin/env python3
"""Render authored policies; read immutable inputs, write only this topic."""
import json, subprocess
from pathlib import Path
from recipes import RECIPES
HERE=Path(__file__).resolve().parent
ROOT=next(p for p in HERE.parents if (p/'.git').exists())
A='6f896789a5200bcbd34fe87de458e60ca82141d6'
R='2097df6d80ef9a0ca6a7f7e6f4db946e6749db01'
tax=json.loads(subprocess.check_output(['git','show',f'{R}:docs/research/astra/materials/01-taxonomy/taxonomy.json'],cwd=ROOT,text=True))
assert set(RECIPES)=={s['id'] for s in tax['styles']}
rows=[]
for s in tax['styles']:
 h,p,c,o,hazard,m=RECIPES[s['id']]
 rows.append(dict(id=s['id'],name=s['name'],hover=h,press=p,
 focus_visible='Immediate existing focus indicator, unclipped and independent of material. '+hazard+' Keep field focus-within/invalid-focus behavior where applicable.',
 selected_checked=c,open=o,
 disabled='Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. '+hazard,
 invalid='Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. '+hazard,
 motion=m,
 reduced_motion='All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. '+('Hold the noise field static.' if s['id']=='grain' else 'Remove optional optical movement without removing state meaning.')))
(HERE/'states.json').write_text(json.dumps(dict(status='authored proposal, not calibrated or visually verified',area_commit=A,research_commit=R,styles=rows),indent=2)+'\n')
fields=[('hover','Hover'),('press','Press'),('focus_visible','Focus-visible'),('selected_checked','Selected / checked'),('open','Open'),('disabled','Disabled'),('invalid','Invalid'),('motion','Motion'),('reduced_motion','Reduced motion')]
lines=['# All styles: state expression','','**Authored proposals, not captured vendor recipes or approved Area presets.** Each style has all seven requested states plus normal/reduced motion. The [shared policy](policy.md) is mandatory: apply states only to eligible interactive parts, preserve fixed hover ink, keep required cues independent, and use task 05 absorption caps. “Depth” below is local painted relief unless an existing Surface role already owns a cast. None of these rows changes layout, focus behavior, native semantics or corner geometry.','','The [evidence ledger](evidence.md) cites Apple, Fluent and M3 precedents and pins current Area behavior. Those precedents do not prove the authored recipes or supply unmeasured opacity/blur/shadow defaults. [Task 09](../09-dark-density/README.md) governs dark, compact and geometry limits; [task 08](../08-accessibility/README.md) governs scene contrast/fallbacks.','','## Coverage','','| Style | State cells | Motion |','| --- | --- | --- |']
for r in rows: lines.append(f'| [{r["name"]}](#{r["id"]}) | All seven | Normal + reduced |')
for r in rows:
 lines += ['',f'<a id="{r["id"]}"></a>',f'## {r["name"]}','',f'Style identity: [task 01](../01-taxonomy/catalogue.md#{r["id"]}). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.','','| State | Proposed expression |','| --- | --- |']
 for k,label in fields: lines.append(f'| {label} | {r[k]} |')
(HERE/'states.md').write_text('\n'.join(lines).rstrip()+'\n')
print(f'Generated {len(rows)} styles × 7 states, with 50 normal/reduced motion entries')
