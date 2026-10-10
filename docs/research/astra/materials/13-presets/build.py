"""Generate and validate research only. Use --check for deterministic verification."""
from pathlib import Path
from itertools import combinations
import hashlib,json,subprocess,sys
sys.dont_write_bytecode=True
from model import AREA,RESEARCH,ROLES,NEUTRAL,PRESETS,resolved
from combinations import REASONS,reason,PRESET_PAIRS
HERE=Path(__file__).resolve().parent
ROOT=next(p for p in HERE.parents if (p/'.git').exists())
def read(path):return subprocess.check_output(['git','show',f'{RESEARCH}:docs/research/astra/materials/{path}'],cwd=ROOT,text=True)
def jtext(x):return json.dumps(x,ensure_ascii=False,indent=2)+'\n'
def emit(name,s):
 s=s.rstrip()+'\n'
 assert len(s.encode())<1000000,(name,len(s.encode()))
 if '--check' in sys.argv:assert (HERE/name).read_text()==s,name
 else:(HERE/name).write_text(s)
refs=json.loads(read('06-references/references.json'))
tax=json.loads(read('01-taxonomy/taxonomy.json'))['styles']
styles=[x['id'] for x in tax]
refmap={r['id']:r for r in refs['references']}
used=sorted({r for p in PRESETS for r in p['refs']})
sourcekeys={e for r in used for l in refmap[r]['layers'] for e in l['evidence']}
evidence=dict(checked='2026-10-09',input_checked=refs['checked'],research_commit=RESEARCH,references=[refmap[r] for r in used],sources={k:refs['sources'][k] for k in sorted(sourcekeys)})
emit('reference-inputs.json',jtext(evidence))
records=[]
for p in PRESETS:
 r={k:v for k,v in p.items() if k!='roles'}
 r['sourceStatus']='reference-inspired authored proposal; not native parity or approved Area preset'
 r['modes']={}
 for dark in [False,True]:
  mode='dark' if dark else 'light'
  r['modes'][mode]={'globalControls':resolved(p,'floating-surface',dark)['controls'],'roles':{role:resolved(p,role,dark) for role in ROLES}}
 r['statePolicy']={'hover':p['states'][0],'press':p['states'][1],'focus-visible':'Keep required focus; remove optional glow, gloss and reflected body overlays on the focused receiver.','selected-checked':p['states'][2],'open':'Resolve the opened receiver independently, one shell; preserve actual expanded state.','disabled':'Use existing disabled paint once and opaque body; remove optional glow/gloss/relief/grain/gradients/strokes, keep selected value.','invalid':'Keep danger context and combined invalid-focus geometry; suppress optional glow/gloss, reflected body overlays and decorative edge gradient.'}
 records.append(r)
inputs={f'{i:02}':hashlib.sha256(read(next(x for x in subprocess.check_output(['git','ls-tree','-r','--name-only',RESEARCH,'docs/research/astra/materials'],cwd=ROOT,text=True).splitlines() if x.split('/')[-1]=='README.md' and x.split('/')[-2].startswith(f'{i:02}-')).split('materials/',1)[1]).encode()).hexdigest() for i in range(1,11)}
out=dict(schemaVersion=1,status='unreviewed authored proposal; numeric seeds uncalibrated',checked='2026-10-09',areaCommit=AREA,researchCommit=RESEARCH,inputReadmeHashes=inputs,roles=ROLES,neutralControls=NEUTRAL,presets=records)
emit('presets.json',jtext(out))

def summary(c):
 a=[f"body `{c['body']['source']}`; transparency {c['body']['transparency']}"]
 if c['backdrop']['blurPx']:a.append(f"local blur {c['backdrop']['blurPx']}px")
 q=c['relief']
 if q['depthPx']:a.append(f"{q['profile']} relief depth/softness/spread {q['depthPx']}/{q['softnessPx']}/{q['spreadPx']}px, strength {q['strength']}")
 q=c['stroke']
 if q['coverage']!='none':a.append(f"edge {q['coverage']}/{q['paint']}/{q['profile']}, opacity {q['opacity']}")
 q=c['gloss']
 if q['strength']:a.append(f"{q['source']} gloss strength/extent {q['strength']}/{q['extent']}, softness {q['softnessPx']}px")
 q=c['glow']
 if q['strength']:a.append(f"context outer glow strength {q['strength']}, softness/spread {q['softnessPx']}/{q['spreadPx']}px")
 q=c['grain']
 if q['strength']:a.append(f"static grain strength {q['strength']}, scale {q['scalePx']}px, seed {q['seed']}")
 for key,g in c['gradients'].items():
  stops=' → '.join(f"{s['position']}% {s.get('customDark') if s.get('customDark') else s['source']} α{s['alpha']}" for s in g['stops'])
  # Select color pair by mode outside this function; both members are printed below.
  if g['stops'][0].get('customLight'):stops=' → '.join(f"{s['position']}% {s['customLight']} light / {s['customDark']} dark α{s['alpha']}" for s in g['stops'])
  a.append(f"{key}: linear {g['angleDeg']}° sRGB [{stops}]")
 return '; '.join(a)
lines=['# Eight proposed presets','', '**Authored complete specifications, not measured or shipping presets.** Every row resolves from the neutral control contract in [contract.md](contract.md); unlisted optional channels are explicitly off. All twelve roles and both modes are expanded without inheritance in [presets.json](presets.json). Numeric seeds are proposals; source values and intentional differences are recorded in [evidence.md](evidence.md).','', 'Each preset has a shared light at 225° toward the upper-left, height 45°, ambient .5. Cast controls remain source direction, lift/softness/strength gains 1, spread delta 0. These are authored compatibility/lighting choices. The following rows override the preset global profile, which is the floating-surface profile. Roles never inherit that full profile accidentally. Semantic ink and Surface policy survive every row.','']
for p in records:
 lines += [f"## {p['name']} (`{p['id']}`)",'',p['intent'],'',f"**References:** "+', '.join(f"[{r}](evidence.md#{r.lower()})" for r in p['refs'])+'. **Transfer:** '+p['difference'],'',f"**Light:** {p['light']} **Dark:** {p['dark']}",'','| Role / cap | Light requested recipe | Dark requested recipe | Cast / context |','| --- | --- | --- | --- |']
 for role in ROLES:
  l=p['modes']['light']['roles'][role];d=p['modes']['dark']['roles'][role]
  lines.append(f"| {role} / {l['controls']['amount']} | {summary(l['controls'])} | {summary(d['controls'])} | {l['castEligibility']}. {l['guard']} |")
 lines+=['','**States (only on eligible receivers):**']
 lines += [f"- **{s}:** {v}" for s,v in p['statePolicy'].items()]
 lines += ['','**Fallback:** F0 from the shared contract in both modes; fixed hover ink, no optical motion, no per-row blur, no new geometry. See the shared density/radius and state rules for the effective recipe.','']
emit('presets.md','\n'.join(lines))
# 25x25 styles, every unordered pair has a reason and provenance paths.
pairs=[]
for a,b in combinations(styles,2):
 key=reason(a,b);status,why=REASONS[key]
 pairs.append(dict(a=a,b=b,status=status,reasonId=key,reason=why,references=sorted(set(refs['style_coverage'][a]['references']+refs['style_coverage'][b]['references']))))
combo=dict(status='authored compatibility policy, not browser support',styleOrder=styles,reasons=REASONS,stylePairs=pairs,presetPairs=[dict(a=a,b=b,status=s,reason=r) for a,b,s,r in PRESET_PAIRS])
emit('compatibility.json',jtext(combo))
lines=['# Combination matrix','', '**Interpretation:** C = compatible channels under the shared contract; K = conditional composition with an explicit owner/region; X = conflicting complete recipes on the same receiver. Separate nested receivers can still coexist. A C never certifies arbitrary values, contrast or performance. These are authored judgments grounded in tasks 01/03/05/07–10 and the [source transfers](evidence.md).','', '## Named preset combinations','', 'This matrix concerns combining two preset requests. C commonly means one supplies a body and the other an edge or a distinct child role. It never means concatenating both complete control objects. K and X require the resolution in the pair ledger.','', '| Preset | '+' | '.join(p['name'] for p in PRESETS)+' |','| --- | '+' | '.join('---' for _ in PRESETS)+' |']
lookup={frozenset((a,b)):(s,r) for a,b,s,r in PRESET_PAIRS}
for p in PRESETS:lines.append('| '+p['name']+' | '+' | '.join('C' if p['id']==q['id'] else lookup[frozenset((p['id'],q['id']))][0] for q in PRESETS)+' |')
lines+=['','| Pair | Result | Reason / resolution |','| --- | --- | --- |']+[f'| {a} + {b} | {s} | {r} |' for a,b,s,r in PRESET_PAIRS]
lines+=['','## All 25 taxonomy styles','', 'Codes in the matrix are explained below. This is a same-receiver composition matrix. Full material/native/language names denote their stated model, not just a reusable fragment. The pair JSON retains all 300 unordered decisions.','', '| # | Style |','| --- | --- |']+[f"| {i+1} | {s['name']} |" for i,s in enumerate(tax)]
lines+=['','| # | '+' | '.join(str(i+1) for i in range(25))+' |','| --- | '+' | '.join('---' for _ in tax)+' |']
for i,a in enumerate(styles):lines.append('| '+str(i+1)+' | '+' | '.join(REASONS[reason(a,b)][0] for b in styles)+' |')
lines+=['','### Reason keys','']+[f'- **{k} ({s}):** {r}' for k,(s,r) in REASONS.items()]
lines+=['','### Every pair with its reason','', '| Pair | Result | Reason key |','| --- | --- | --- |']+[f"| {x['a']} + {x['b']} | {x['status']} | {x['reasonId']} |" for x in pairs]
lines+=['','## Resolution examples','', '- **Glass + Prism:** keep Glass body/transmission/acquisition, replace its decorative edge with one Prism mask, retain Area required edge/focus. Do not add the two edge strengths.','- **Acrylic + grain:** edit Acrylic’s one texture layer. A second independent grain overlay is not the intended combination.','- **Soft + inner shadow:** the handle can be convex and its separate well concave. One region cannot simultaneously adopt both signs of the same relief profile.','- **Aero + Glow:** distinguish reflected top light from emitted halo; choose one primary cue and remove both around focus/invalid if they compete.','- **Paper + Glass:** opaque Paper reading plane inside a Glass shell is valid; making the same plane both opaque and transmitting is the conflict.','- **Flat + drop shadow:** taxonomy strict-flat modeling rejects it. The existing Surface Flat means no cast, not an automatic prohibition of every other optical channel; do not confuse the two names.','']
emit('combinations.md','\n'.join(lines))
# Source transfer ledger preserves exact upstream evidence, rather than presenting authored values as vendor values.
lines=['# Evidence and source transfers','',f'Area snapshot **{AREA}**. Research input **{RESEARCH}**. Read brief and tasks **01–10** at that immutable research commit. Task 06 source checks retain **2026-10-08**; this task does not relabel them as a new exhaustive upstream audit. [reference-inputs.json](reference-inputs.json) carries the selected exact records and source pins.','', '## Current Area constraints','']
for label,path,lo,hi in [('Namespace/derivation','docs/DESIGN_SYSTEM.md',20,27),('Elevation eligibility','docs/DESIGN_SYSTEM.md',156,165),('Near-black and dark Card','docs/DESIGN_SYSTEM.md',272,278),('Surface presets','packages/tokens/src/axes/surface.ts',15,81),('Ink, focus, state and tests','docs/CONTRAST.md',7,76),('State clocks','docs/MOTION.md',40,63),('Reduced motion','docs/MOTION.md',85,90)]:lines.append(f'- [{label}](https://github.com/ethanwongwork/area/blob/{AREA}/{path}#L{lo}-L{hi}).')
lines+=['','## Series inputs','']
for i in range(1,11):
 topic=next(x for x in (HERE.parent).iterdir() if x.is_dir() and x.name.startswith(f'{i:02}-'))
 lines.append(f'- [{topic.name}](https://github.com/ethanwongwork/area/tree/{RESEARCH}/docs/research/astra/materials/{topic.name}): read README and relevant layer/control/role/policy/reference records. README content SHA-256 is stored in presets.json.')
lines+=['','## Task 06 reference records','', 'Each exact value below belongs to its external specimen. The preset tables use authored adaptations unless a transfer note explicitly says a scalar is retained. Light/dark roles not present in a reference are new design proposals. No screenshot sampling or estimation.','']
for rid in used:
 r=refmap[rid];lines += [f'<a id="{rid.lower()}"></a>',f"### {rid} — {r['title']}",'',f"Scope: {r['scope']}",'']
 for layer in r['layers']:
  links=', '.join(f"[{k}]({refs['sources'][k]['url']})" for k in layer['evidence'])
  lines.append(f"- **{layer['channel']}:** {layer['value']} {links}")
 lines += ['', '**Limit:** '+r['limits'],'']
lines+=['## Public checks on 2026-10-09','', '- [Microsoft Acrylic guidance](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic): avoid stacked Acrylic planes; provide solid fallbacks and check text after tint changes. Its general historical graph is not substituted for R04’s pinned active WinUI code path.','- [W3C CSS Backgrounds and Borders](https://www.w3.org/TR/css-backgrounds-3/#box-shadow): shadows, borders and rounded clipping are separate operations.','- [Temani Afif gradient-edge technique](https://css-tip.com/border-gradient/): opaque-center double background and transparent-center mask are alternatives. The live newer border-area technique does not change our selected fallback path.','', '## Not found / not adopted','', 'No complete native Liquid Glass or active Mica numeric recipe was found in task 06’s inspected sources. Neither is marketed as a matching preset here. No original board images/public URLs are available; R19/R20 remain owner transcriptions. No evidence in 01–10 calibrates all-role dark/compact material numbers: the explicit seeds in model.py are new proposals. No source demonstrates these complete eight Area presets; the role translation and compatibility judgments are this task’s synthesis.','']
emit('evidence.md','\n'.join(lines))
assert len(records)==8 and len(pairs)==300 and len(lookup)==28
for p in records:
 for mode in ['light','dark']:
  assert list(p['modes'][mode]['roles'])==ROLES
  for role,r in p['modes'][mode]['roles'].items():
   c=r['controls'];assert set(c)==set(NEUTRAL)
   assert 0<=c['body']['transparency']<=1 and c['backdrop']['blurPx']>=0
   assert c['amount'] in ['none','trace','quiet']
   assert 0<=c['light']['angleDeg']<360 and 0<=c['light']['heightDeg']<=90
   assert 0<=c['light']['ambient']<=1
   assert c['backdrop']['mapping']=='unchanged'
   assert c['backdrop']['source'] in ['none','local']
   for field in ['relief','glow','grain','gloss']:
    assert 0<=c[field]['strength']<=1
   assert 0<=c['stroke']['opacity']<=1 and 0<=c['gloss']['extent']<=1
   assert c['relief']['profile'] in ['flush','convex','concave']
   for field in ['relief','glow','gloss']:
    assert c[field]['softnessPx']>=0
   assert c['relief']['depthPx']>=0 and c['grain']['scalePx']>0
   assert c['content']==NEUTRAL['content'] and c['filters']==[]
   if role not in ['container','floating-surface']:
    assert c['backdrop']['blurPx']==0 and c['body']['transparency']==0
   if role in ['divider','glyph','text','scrim','page']:
    assert c['glow']['strength']==0 and c['grain']['strength']==0
   for layer,g in c['gradients'].items():
    assert layer==g['target'] and g['kind']=='linear' and g['interpolation']=='srgb'
    positions=[stop['position'] for stop in g['stops']]
    assert positions==sorted(positions) and all(0<=v<=100 for v in positions)
    assert len({stop['id'] for stop in g['stops']})==len(g['stops'])
    assert all(0<=stop['alpha']<=1 for stop in g['stops'])
   assert c['surfaceControls']==NEUTRAL['surfaceControls']
   if role in ['glyph','text','scrim','page']:assert c['amount']=='none' and c['backdrop']['blurPx']==0
assert len({p['id'] for p in records})==8
assert len({frozenset([p['a'],p['b']]) for p in pairs})==300
for pair in pairs:
 assert pair['references'] and set(pair['references'])<=set(refmap)
 assert reason(pair['a'],pair['b'])==reason(pair['b'],pair['a'])
for p in records:assert set(p['refs'])<=set(refmap) and set(p['styles'])<=set(styles)
for path in HERE.iterdir():
 if path.is_file():assert path.stat().st_size<1000000,path
print('PASS: 8 presets × 12 roles × 2 modes; 300 style pairs; 28 preset pairs; deterministic outputs; each file <1 MB.')
