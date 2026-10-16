#!/usr/bin/env python3
import json,subprocess
from pathlib import Path
from style_data import DATA
HERE=Path(__file__).resolve().parent
ROOT=next(p for p in HERE.parents if (p/'.git').exists())
R='817c9eeeedacf7a5e477289d44f38f8e4f15f103'
tax=json.loads(subprocess.check_output(['git','show',f'{R}:docs/research/astra/materials/01-taxonomy/taxonomy.json'],cwd=ROOT,text=True))
assert set(DATA)=={s['id'] for s in tax['styles']}
# Every profile maps explicitly to every setting; these are simplification policies,
# not measured geometric thresholds. Actual geometry always comes from geometry.json.
profiles={
'plain':['square clip','tight clip','rounded clip','rounded clip','rounded clip','curved-end clip','curved-end clip','curved-end clip','capsule clip'],
'body':['square plane','single edge','single edge','offset rim if fit','offset rim if fit','wrap rim','wrap rim','wrap rim','cap-following rim'],
'glass':['square glass mask','single glass rim','single glass rim','concentric if fit','concentric if fit','wrap reflection','wrap reflection','wrap reflection','capsule reflection'],
'soft':['planar relief','reduce relief','reduce relief','fit local relief','fit local relief','curved crown','curved crown','curved crown','capsule crown'],
'gloss':['rectangular gloss clip','one glint','one glint','band if clear','band if clear','wrap gloss ends','wrap gloss ends','wrap gloss ends','wrap capsule gloss'],
'edge':['mitered path','single contour','offset if fit','offset if fit','offset if fit','shared curve','shared curve','shared curve','capsule contour'],
'ink':['body independent']*9,
 'texture':['square texture clip','tight texture clip','rounded texture clip','rounded texture clip','rounded texture clip','curved-end clip','curved-end clip','curved-end clip','capsule texture clip']}
settings=['0','2','4','6','8','10','12','14','pill']
keys=['dark','shadow','glow','highlight','stroke','compact','profile']
rows=[]
for s in tax['styles']:
 row=dict(id=s['id'],name=s['name'],**dict(zip(keys,DATA[s['id']])))
 row['radius']={k:v for k,v in zip(settings,profiles[row['profile']])}
 rows.append(row)
(HERE/'styles.json').write_text(json.dumps(dict(status='authored proposals, uncalibrated',research_commit=R,styles=rows),indent=2)+'\n')
lines=['# Per-style dark, density and radius proposals','','**All translations and scaling prescriptions here are authored proposals.** Style identities follow task 01, not new definitions. Each subsection links its taxonomy entry; the [evidence ledger](evidence.md) supplies Apple, Fluent, M3 and current Area constraints. No new opacity, shadow or highlight default is asserted.','','All rows inherit [D/N/G/S/E/H/W/B/R](rules.md). G supplies sm/md/lg and compact ratios from each painted part; S holds role-owned cast; E/H/W distinguish halo, reflection and functional edge. A material can have “none” in a channel: combining layers does not make that channel mandatory.','','## Every radius setting','','This matrix explicitly covers every style × every setting. It selects a painting strategy; exact current radii for both densities and all sizes are in [geometry](geometry.md). “If fit/clear” means fitting between the actual outer contour and content exclusion zone, not an assumed size-class threshold. At small corners the optional inner contour may become square or be omitted. At all other settings use the same offset equation; larger corner labels do not increase opacity, blur or stroke width. Pill entries describe control capsules; containers use their finite surface radius. Pill overrides/intrinsic circles use their resulting contour even under Sharp.','','| Style | Sharp (0) | 2 | 4 | 6 | 8 | 10 | 12 | 14 | Pill |','| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |']
for row in rows: lines.append('| '+f'[{row["name"]}](#{row["id"]})'+' | '+' | '.join(row['radius'].values())+' |')
lines+=['','For ink, body-independent means the surrounding body still follows its own radius; the letter contour does not change with the Radius axis. For soft/plush recipes, Sharp deliberately sacrifices roundness-dependent character rather than ignoring the chosen geometry. A conic field uses the plain clipping profile: angular color position is independent of the corner setting. Same-body double rims use R; independent nested children keep their own optical floors.','']
for row in rows:
 lines += [f'<a id="{row["id"]}"></a>', f'## {row["name"]}', '',f'Identity: [task 01 — {row["name"]}](../01-taxonomy/catalogue.md#{row["id"]}). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.', '',f'**Near-black translation (D/N):** {row["dark"]}', '',f'**Shadows / sm–md–lg:** {row["shadow"]}', '',f'**Glows / sm–md–lg:** {row["glow"]}', '',f'**Highlights / sm–md–lg:** {row["highlight"]}', '',f'**Strokes / sm–md–lg:** {row["stroke"]}', '',f'**Compact and size limits:** {row["compact"]}', '']
(HERE/'styles.md').write_text('\n'.join(lines).rstrip()+'\n')
print(f'Generated {len(rows)} style policies and {len(rows)*len(settings)} radius cells')
