"""Generate deterministic research tables/data; --check validates without writing.
Inputs are pinned prior research, not the checkout's production files. No network required.
"""
from pathlib import Path
import sys,json,re,subprocess,hashlib,collections
from recipes import ROLES,LEVELS,CHANNELS,RECIPES,TECHNIQUES,LIMITS
from guards import GUARDS
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[4]
RESEARCH='79f76ea0557d201777c29de1a8626c20bbc67575'
AREA='9036ed9293beb7a867bdf637ee768c7a46a9901a'
PREFIX='docs/research/astra/materials/'
CACHE={}
def read(sha,path):
 key=(sha,path)
 if key not in CACHE:CACHE[key]=subprocess.check_output(['git','show',f'{sha}:{path}'],cwd=ROOT,text=True)
 return CACHE[key]
def pin(sha,path,a,b=None):
 b=b or a;assert 1<=a<=b<=len(read(sha,path).splitlines()),(sha,path,a,b)
 return {'commit':sha,'file':path,'line':a,'end':b}
def url(p):return f'https://github.com/ethanwongwork/area/blob/{p["commit"]}/{p["file"]}#L{p["line"]}'+(f'-L{p["end"]}' if p['end']!=p['line'] else '')
def link(p,label=None):return f'[{label or p["file"]+":"+str(p["line"])}]({url(p)})'
def section(sha,path,start,heading='## '):
 ls=read(sha,path).splitlines();a=next(i for i,l in enumerate(ls,1) if start in l)
 b=next((i-1 for i,l in enumerate(ls,1) if i>a and l.startswith(heading)),len(ls))
 return pin(sha,path,a,b)
def esc(s):return str(s).replace('|','\\|').replace('\n',' ')
TAX=json.loads(read(RESEARCH,PREFIX+'01-taxonomy/taxonomy.json'))
RM=json.loads((HERE.parent/'04-role-map/role-map.json').read_text())
assert RM['area_commit']==AREA
assert set(ROLES.values())==set(RM['role_vocabulary'])
PARTS={p['id']:p for f in RM['families'] for p in f['parts']};PARTS.update({p['id']:p for p in RM['environment']})
FAMILIES={f['id']:f for f in RM['families']}
styles={};current=None
for l in RECIPES.strip().splitlines():
 if l.startswith('['):
  current=l[1:-1];assert current not in styles;styles[current]=[];continue
 role,level,layers,treatment=l.split('|');assert role in ROLES and level in LEVELS
 codes=layers.split(',');assert all(x in CHANNELS for x in codes)
 assert len(codes)==len(set(codes))
 styles[current].append({'role':ROLES[role],'amount':LEVELS[level],'channels':[CHANNELS[x] for x in codes],'treatment':treatment,'basis':'historical proposal; D1/D3/D14 supersede ordinal ceilings and blanket prohibitions; D6 row-plate is new','strengthMultiplier':None,'calibrationStatus':'pending task 22; amount is historical label, not a limit'})
assert set(styles)=={x['id'] for x in TAX['styles']}==set(TECHNIQUES)
for k,rows in styles.items():
 assert len(rows)==13 and {r['role'] for r in rows}==set(ROLES.values()),k
 assert [r['role'] for r in rows]==list(ROLES.values()),k
assert sum(map(len,styles.values()))==325
tech={k:section(RESEARCH,PREFIX+'03-css-cookbook/cookbook.md','## '+k+' ') for ids in TECHNIQUES.values() for k in ids}
CAT=read(RESEARCH,PREFIX+'01-taxonomy/catalogue.md').splitlines()
def stylepin(k):
 a=next(i for i,l in enumerate(CAT,1) if l==f'<a id="{k}"></a>')
 b=next((i-1 for i,l in enumerate(CAT,1) if i>a and l.startswith('<a id=')),len(CAT))
 return pin(RESEARCH,PREFIX+'01-taxonomy/catalogue.md',a,b)
family_guards={k:[] for k in FAMILIES};guards=[]
for k,g in GUARDS.items():
 fs=g['families'].split();ps=g['parts'].split()
 assert set(fs)<=set(FAMILIES),(k,set(fs)-set(FAMILIES))
 assert set(ps)<=set(PARTS),(k,set(ps)-set(PARTS))
 for f in fs:family_guards[f].append(k)
 evidence=[]
 for p in ps:
  for s in PARTS[p]['sources'][:1]:
   evidence.append({'part':p,'source':pin(AREA,s['file'],s['line'],s['end'])})
 guards.append({'id':k,'title':g['title'],'families':fs,'why':g['why'],'rule':g['rule'],'amount_cap':g['cap'],'evidence':evidence,'basis':'sources prove current parts; ordinal caps and blanket performance prohibitions superseded D1/D3/D14','superseded_decisions':['D1','D3','D14'] if k not in ['cutout-gaps','fixed-colour-fades','translucent-washes','list-focus-plate','solid-emphasis','disabled-group-opacity','diagnostic-extent'] else []})
family_decisions=[]
for k,f in FAMILIES.items():
 s=f['spec'];root=next(p for p in f['parts'] if p['part']=='root')['sources'][0]
 family_decisions.append({'family':k,'block':f['block'],'guards':family_guards[k],'decision':('Context guard required where applicable; role recipe alone does not resolve these cases.' if family_guards[k] else 'Ordinary role and nesting policy sufficient for the shipped anatomy; no additional family-specific guard identified.'),'sources':[pin(AREA,s['file'],s['line'],s['end']),pin(AREA,root['file'],root['line'],root['end'])]})
style_data=[]
for t in TAX['styles']:
 k=t['id'];style_data.append({'id':k,'name':t['name'],'kind':t['kind'],'definition_evidence':stylepin(k),'techniques':[{'id':x,'source':tech[x]} for x in TECHNIQUES[k]],'limit':LIMITS.get(k,'Proposed role translation of the named layer only. Preserve semantic paint, current geometry and Surface; remove optional treatment when a guard or fallback requires it.'),'recipes':styles[k]})
input_paths=[PREFIX+'README.md',PREFIX+'01-taxonomy/taxonomy.json',PREFIX+'01-taxonomy/layer-model.md',PREFIX+'03-css-cookbook/cookbook.md',PREFIX+'03-css-cookbook/area-integration.md',PREFIX+'04-role-map/role-map.json']
inputs=[{'file':p,'commit':RESEARCH,'sha256':hashlib.sha256(read(RESEARCH,p).encode()).hexdigest()} for p in input_paths if not p.endswith('role-map.json')]
inputs.append({'file':PREFIX+'04-role-map/role-map.json','commit':None,'revision':'same task-19 research revision; Area snapshot pinned inside','sha256':hashlib.sha256((HERE.parent/'04-role-map/role-map.json').read_bytes()).hexdigest()})
summary={'styles':len(styles),'roles':len(ROLES),'style_role_cells':325,'context_guards':len(guards),'manifest_contracts_reviewed':len(family_decisions),'families_with_context_guards':sum(bool(x['guards']) for x in family_decisions),'amount_counts':dict(collections.Counter(r['amount'] for rows in styles.values() for r in rows))}
data={'schema_version':1,'date':'2026-10-11','area_commit':AREA,'research_input_commit':RESEARCH,'status':'Task 19 refresh: current anatomy; historical style cells retained with D1/D3/D14 supersession; D6 row-plate added. Numeric strengths pending calibration.','summary':summary,'inputs':inputs,'layer_model':'01-taxonomy/layer-model.md; same canonical channels, with task 04 edge/scrim roles','amount_order':list(LEVELS.values()),'owner_decisions':'../REVIEW.md#owner-decisions-2026-10-11','superseded_decisions':['D1','D2','D3','D14'],'amount_semantics':'SUPERSEDED D1/D3/D14: historical ordinal cap on added style, never numeric opacity or semantic intensity. Apply role/context/nesting/channel constraints. None retains functional body/ink/marks/scrim. Trace display text requires explicit inscription context; ordinary UI text remains None.','resolution_order':['resolve actual painted part and donor alias','preserve semantic/state/required paint','select style-role cell','take strictest role/context/nesting/accessibility/owner cap and channel prohibitions','merge channels by explicit owner, not duplicate layers','preserve geometry and Surface elevation','derive locally and select verified fallback'],'policy':'policy.md','styles':style_data,'guards':guards,'families':family_decisions,'limitations':['No new browser/product captures, contrast certification or performance measurements.','Ordinal levels require later numerical calibration and owner review.','Native platform names denote constrained web-inspired proposals, not implementation parity.','Family guards constrain common recipes; they are not independent component styles.','JSON records proposed rules and coverage, not executable CSS or a full React state engine.']}
md=['# Style × role absorption recipes','','> **Superseded — D1, D2, D3, D14:** the historical ordinal ceilings, in-flow no-shadow and static/no-blur prohibitions below are retained as findings/proposals, not current requirements. D3 numeric multipliers await calibration. New D6 row-plate cells complete 25 × 13; their Trace label is historical formatting only. Hard semantic/contrast/focus limits remain.','','**All 325 cells are authored proposals, not captured recipes or native platform constants.** Read [amounts, resolution and nesting](policy.md) first. None removes added style, not required paint. Explicit family/context limits in [the exception ledger](family-exceptions.md) override the amount and channels here. Each row changes only the named layer channels; semantic ink, existing state and required boundaries are protected in every row.','','The source links establish the style vocabulary, available techniques and their limitations. They do not empirically validate these proposed role assignments or amounts. Definitions/public-source access dates remain those in task 01; no external compatibility update is claimed.','','## Coverage and amount overview','','N = None · T = Trace · Q = Quiet · F = Full. These are ordinal caps, never opacity percentages.','','| Style | '+' | '.join(ROLES.values())+' |','| --- | '+' | '.join('---' for _ in ROLES)+' |']
for s in style_data:
 md.append('| ['+s['name']+'](#'+s['id']+') | '+' | '.join(next(c for c,n in LEVELS.items() if n==r['amount']) for r in s['recipes'])+' |')
md+=['','## Layer channel names','','Use the exact fields from 01. `filters` must name its target (backdrop, body, emission or texture); no row filters the content group. `spatial.relief` is local modeling, while task 04’s parent relationship remains unchanged. `illumination` is a shared rig when modeling is used, not an instruction to rotate every gradient or halo.','']
for s in style_data:
 md += [f'<a id="{s["id"]}"></a>',f'## {s["name"]}','',f'**Kind:** {s["kind"]}. **Definition evidence:** {link(s["definition_evidence"],"task 01 pinned definition and original sources")}.', '**Construction basis:** '+', '.join(link(x['source'],x['id']) for x in s['techniques'])+'. All are pinned task 03 technique sections, including fallback limits.','', '**Historical boundary (superseded D1/D2/D3/D14 where it limits expression):** '+s['limit'],'','| Role | Amount cap | Layer channels | Proposed treatment |','| --- | --- | --- | --- |']
 for r in s['recipes']:md.append('| '+r['role']+' | '+r['amount']+' | '+', '.join('`'+x+'`' for x in r['channels'])+' | '+esc(r['treatment'])+' |')
 md.append('')
ex=['# Where the role recipe needs context','','> **Superseded — D1, D2, D3, D14:** old guards’ ordinal amount caps and blanket decorative prohibitions are historical, not binding. The six review guards and diagnostic guard below govern semantic composition; numeric decoration limits await calibration.','','**Research proposals.** Existing CSS/markup/specs below establish the constraints. The caps are authored recommendations, not current implementation or measured effect values. Guards name semantic/contextual reasons, so the same guard applies across families without creating per-component style recipes.','',f'All {len(FAMILIES)} manifest contracts from task 04 were reviewed. A listed guard applies only to its named context/part; it does not suppress every part of the family. Family membership is not a material API.','', '## Family coverage ledger','','| Family / contract | Context rules beyond the role alone | Pinned existing anatomy |','| --- | --- | --- |']
for x in family_decisions:
 gl=', '.join(f'[{g}](#{g})' for g in x['guards']) or 'No additional family-specific exception identified; common role/nesting policy applies.'
 ex.append('| `'+x['family']+'` / `'+x['block']+'` | '+gl+' | '+' '.join(link(s) for s in x['sources'])+' |')
for g in guards:
 ex+=['',f'<a id="{g["id"]}"></a>',f'## {g["title"]}','', '**Families:** '+', '.join('`'+f+'`' for f in g['families'])+'.','','**Why role alone is insufficient:** '+g['why'],'','**Common guard:** '+g['rule'],'','**Amount (historical caps superseded D1/D3/D14):** '+g['amount_cap']+'.','','**Pinned evidence for the existing parts:**','']
 for x in g['evidence']:ex.append('- `'+x['part']+'`: '+link(x['source']))
ex+=['','## How the ledger should be used','','Do not write sixteen competing style implementations. Preserve the shared style/role cell and attach the applicable context metadata: repeated row, reading/editing plane, literal color, encoded extent, intrinsic media, shared shell, native receiver, required mark, nonpaint host, overlay boundary and divider ownership. A future implementation may encode these differently; this report proposes the responsibilities, not new selectors.','', 'Where prose and current source disagree, follow the pinned current paint/markup and record the discrepancy. Task 04 already identifies TagPicker’s old Badge anatomy versus current Tag children, and the Disclosure-to-Accordion rename. Those historical names must not generate extra material families.']
outputs={'recipes.md':'\n'.join(md).rstrip()+'\n','family-exceptions.md':'\n'.join(ex)+'\n','absorption.json':json.dumps(data,ensure_ascii=False,indent=2)+'\n'}
for name,content in outputs.items():
 assert len(content.encode())<1_000_000,(name,len(content.encode()))
 if '--check' in sys.argv:assert (HERE/name).read_text()==content,name+' differs; rerun build.py'
 else:(HERE/name).write_text(content)
# Every local link and every repository line link is checked, including hand-written prose.
count=0
for path in HERE.glob('*.md'):
 content=path.read_text()
 for label,target in re.findall(r'\[([^\]]+)\]\(([^)]+)\)',content):
  if not target.startswith(('http','#')):
   assert (path.parent/target.split('#',1)[0]).exists(),(path.name,target)
 for sha,file,a,b in re.findall(r'https://github.com/ethanwongwork/area/blob/([a-f0-9]{40})/([^#)]+)#L(\d+)(?:-L(\d+))?',content):
  pin(sha,file,int(a),int(b or a));count+=1
print(json.dumps(summary,indent=2))
print('Validated pinned Markdown line links:',count)
for name in outputs:print(name, (HERE/name).stat().st_size,'bytes')
