"""Research fixtures/ledger only. --check validates deterministic local outputs, not target apps."""
from pathlib import Path
import ast, hashlib, json, re, subprocess, sys
sys.dont_write_bytecode=True
from sources import AREA, RESEARCH, CHECKED, AREA_SOURCES, PUBLIC
HERE=Path(__file__).resolve().parent
ROOT=next(p for p in HERE.parents if (p/'.git').exists())
def read(rev,path):return subprocess.check_output(['git','show',f'{rev}:{path}'],cwd=ROOT,text=True)
def canonical(x):return json.dumps(x,sort_keys=True,separators=(',',':'),ensure_ascii=False,allow_nan=False).encode('utf8')
def digest(x):return hashlib.sha256(canonical(x)).hexdigest()
def emit(name,x):
 s=x if isinstance(x,str) else json.dumps(x,indent=2,ensure_ascii=False,allow_nan=False)
 s=s.rstrip()+'\n'
 assert len(s.encode())<1000000
 p=HERE/name
 if '--check' in sys.argv:assert p.read_text()==s,name
 else:p.write_text(s)
# A portable source snapshot, not a production Theme config or compiled material.
data=json.loads(read(RESEARCH,'docs/research/astra/materials/13-presets/presets.json'))
glass=next(p for p in data['presets'] if p['id']=='glass')
payload={'kind':'area-material-research','schemaVersion':1,'profileRevision':RESEARCH,
 'requiredPolicy':{'controlContract':'materials/07-controls','recipeContract':'materials/13-presets/contract.md','revision':RESEARCH},
 'compilerContract':'proposal-only-07-option-a','recipeSnapshot':glass,
 'patch':{'light':{'roles':{'floating-surface':{'gloss':{'strength':0}}}},'dark':{'roles':{'floating-surface':{'gloss':{'strength':0}}}}},
 'preview':{'fixture':'popup-with-reading-island','baseline':'material-none','axes':{'surface':'outlined','ui':'default','radius':'8'},'mode':'light'}}
share={'label':'Glass with optional popup glint disabled','status':'unreviewed research example',
 'integrity':{'algorithm':'sha256','serialization':'sorted-key-utf8-compact-json-v1','payloadSha256':digest(payload)},'payload':payload}
emit('examples/material.area.json',share)
# Independent authored test fixture: NOT a renderer-derived export of Glass above.
def color(r,g,b,a=1):return {'colorSpace':'srgb','components':[r,g,b],'alpha':a}
def dim(v):return {'value':v,'unit':'px'}
fixture={'status':'authored serialization fixture; not Area visual defaults','context':{'mode':'light','receiver':'illustrative-surface'},
 'shadow':[{'color':color(0,0,0,.1),'offsetX':dim(0),'offsetY':dim(2),'blur':dim(4),'spread':dim(0),'inset':False},
           {'color':color(1,1,1,.2),'offsetX':dim(-1),'offsetY':dim(-1),'blur':dim(0),'spread':dim(0),'inset':True}],
 'gradient':{'kind':'linear','angleDeg':135,'interpolation':'srgb','target':'edge','stops':[{'id':'start','positionPercent':0,'color':color(.2,.4,.8,.3)},{'id':'end','positionPercent':100,'color':color(.8,.3,.5,0)}]},
 'border':{'color':color(0,0,0,.15),'width':dim(1),'style':'solid'},
 'backdrop':{'source':'local','blurPx':5,'fallback':'opaque'},'policyRef':'area-role-guards-required'}
emit('examples/projection-input.json',fixture)
tokens={'specimen':{'$description':'Authored projection fixture; geometry and behavior losses recorded in projection.loss.json.',
 'shadow':{'$type':'shadow','$value':fixture['shadow']},
 'ramp':{'$type':'gradient','$value':[{'color':s['color'],'position':s['positionPercent']/100} for s in fixture['gradient']['stops']]},
 'border':{'$type':'border','$value':fixture['border']},
 'blur':{'$type':'dimension','$value':dim(fixture['backdrop']['blurPx'])}}}
emit('examples/projection.tokens.json',tokens)
def rgba(c):return 'rgba('+', '.join(str(round(v*255,6)) for v in c['components'])+', '+str(c['alpha'])+')'
legacy={'specimen':{
 'shadow':{'type':'boxShadow','value':[{'x':str(s['offsetX']['value'])+'px','y':str(s['offsetY']['value'])+'px','blur':str(s['blur']['value'])+'px','spread':str(s['spread']['value'])+'px','color':rgba(s['color']),'type':'innerShadow' if s['inset'] else 'dropShadow'} for s in fixture['shadow']]},
 'ramp':{'type':'color','value':'linear-gradient(135deg, '+', '.join(rgba(s['color'])+' '+str(s['positionPercent'])+'%' for s in fixture['gradient']['stops'])+')'},
 'border':{'type':'border','value':{'color':rgba(fixture['border']['color']),'width':'1px','style':'solid'}},
 'blur':{'type':'dimension','value':'5px'}}}
emit('examples/projection.tokens-studio-legacy.json',legacy)
loss={'schemaVersion':1,'source':'projection-input.json','sourceSha256':digest(fixture),
 'target':'DTCG-2025.10','validation':'local structural assertions only; target-tool import unverified',
 'records':[
 {'source':'/shadow','target':'/specimen/shadow','status':'represented','reason':'Lobes, dimensions, color alpha, inset and order retained; raster parity untested.'},
 {'source':'/border','target':'/specimen/border','status':'represented','reason':'Solid border fields retained; fixture does not include contour geometry.'},
 {'source':'/gradient/stops','target':'/specimen/ramp','status':'converted','reason':'Percent positions divide by 100; color/alpha retained. Stable IDs remain in sidecar.'},
 {'source':'/gradient','target':None,'status':'sidecar-required','reason':'Kind, angle, interpolation, target and stop IDs are not encoded in the core ramp.'},
 {'source':'/backdrop/blurPx','target':'/specimen/blur','status':'represented','reason':'A dimension is retained, not a backdrop-filter behavior.'},
 {'source':'/backdrop','target':None,'status':'sidecar-required','reason':'Acquisition and opaque fallback require Area renderer.'},
 {'source':'/policyRef','target':None,'status':'sidecar-required','reason':'Role eligibility, nesting, state and accessibility rules remain external.'},
 {'source':'/context','target':None,'status':'sidecar-required','reason':'The snapshot context is retained here, not silently applied by generic token tools.'},
 {'source':'/status','target':None,'status':'metadata','reason':'Authored test status retained in source, no approval claim.'}],
 'sidecar':fixture,'tokensStudioImport':'illustrative legacy projection only; not plugin-tested'}
emit('examples/projection.loss.json',loss)
ledger=['# Evidence ledger','',f'Checked **{CHECKED}** (America/Los_Angeles). Area **{AREA}**; research **{RESEARCH}**. Public URLs are dated documentation observations, not claims about a locally installed plugin version. No signed-in product writes or target-tool imports.','', '## Area snapshot','']
for key,title,path,lo,hi in AREA_SOURCES:
 txt=read(AREA,path);assert 1<=lo<=hi<=len(txt.splitlines())
 ledger.append(f'- **{key} — {title}:** [{path}:{lo}–{hi}](https://github.com/ethanwongwork/area/blob/{AREA}/{path}#L{lo}-L{hi}).')
ledger+=['','## Research inputs','']
for path in ['README.md','07-controls/README.md','07-controls/controls.md','07-controls/architecture.md','13-presets/contract.md']:
 txt=read(RESEARCH,'docs/research/astra/materials/'+path)
 ledger.append(f'- [{path}](https://github.com/ethanwongwork/area/blob/{RESEARCH}/docs/research/astra/materials/{path}#L1-L{len(txt.splitlines())}) — '+hashlib.sha256(txt.encode()).hexdigest()+' (content SHA-256).')
ledger+=['','## Public sources','',f'Every entry checked **{CHECKED}**. The source notes identify what was read; export policies and the builder design are authored proposals.','']
for key,title,url,scope in PUBLIC:ledger.append(f'- **{key} — [{title}]({url}):** {scope}')
ledger+=['','## Limits and conflicting documentation','',
 '- DTCG latest-publication check used the project landing page and the published Format header. `/TR/` itself was unavailable through the web tool; no claim that an uninspected editor draft is normative.',
 '- Figma public API currently lists EASING/TIMING in addition to the familiar four types. Tokens Studio’s skipped-variables page still describes four. This report uses Figma for native capability and the plugin docs for its documented export path; installed compatibility is not inferred.',
 '- Figma API source-SHA retrieval via the shell was unavailable because network name resolution was restricted. Dated official API pages support the claims instead. No unpublished source pin is fabricated.',
 '- No full native-material-to-CSS parameter equivalence was found in the inspected Figma effects, DTCG format, or Tokens Studio type documentation. Similar field names are not evidence of identical rendering.',
 '- No installed Tokens Studio/Figma round trip, Tailwind build, material compiler, or gallery UI was run. Example checks test report and serialization integrity only.','']
emit('evidence.md','\n'.join(ledger))
emit('sources.json',{'checked':CHECKED,'areaCommit':AREA,'researchCommit':RESEARCH,'area':[dict(id=k,title=t,path=p,start=l,end=h) for k,t,p,l,h in AREA_SOURCES],'public':[dict(id=k,title=t,url=u,scope=s) for k,t,u,s in PUBLIC]})
# Meaningful field-preservation checks on this limited projection.
assert digest(json.loads(json.dumps(share))['payload'])==share['integrity']['payloadSha256']
assert set(glass['modes'])=={'light','dark'}
assert all(len(m['roles'])==12 for m in glass['modes'].values())
assert tokens['specimen']['shadow']['$value']==fixture['shadow']
for i,s in enumerate(fixture['gradient']['stops']):
 t=tokens['specimen']['ramp']['$value'][i];assert t['position']*100==s['positionPercent'] and t['color']==s['color']
assert tokens['specimen']['border']['$value']==fixture['border']
for s in tokens['specimen']['shadow']['$value']:
 assert set(s)=={'color','offsetX','offsetY','blur','spread','inset'} and type(s['inset']) is bool
 for k in ['offsetX','offsetY','blur','spread']:assert s[k]['unit']=='px' and isinstance(s[k]['value'],(int,float))
 assert s['blur']['value']>=0
for i,s in enumerate(legacy['specimen']['shadow']['value']):
 assert s['type']==('innerShadow' if fixture['shadow'][i]['inset'] else 'dropShadow')
assert {r['source'].split('/')[1] for r in loss['records']}==set(fixture)
assert loss['sourceSha256']==digest(loss['sidecar'])
# Verify every declared target and source pointer names an actual fixture field.
def pointer(doc, path):
 for part in path.strip('/').split('/'):
  doc=doc[int(part)] if isinstance(doc,list) else doc[part]
 return doc
for record in loss['records']:
 pointer(fixture,record['source'])
 if record['target'] is not None:pointer(tokens,record['target'])
for token in tokens['specimen'].values():
 if not isinstance(token,dict):continue
 assert token['$type'] in ['shadow','gradient','border','dimension']
for stop in tokens['specimen']['ramp']['$value']:
 assert 0<=stop['position']<=1
 c=stop['color'];assert c['colorSpace']=='srgb' and len(c['components'])==3
 assert all(0<=v<=1 for v in c['components']) and 0<=c['alpha']<=1
assert set(tokens['specimen']['border']['$value'])=={'color','width','style'}
# Self-contained Markdown references and basic artifact hygiene.
for p in HERE.rglob('*'):
 if not p.is_file():continue
 assert p.stat().st_size<1000000,p
 if p.suffix=='.json':json.loads(p.read_text())
 if p.suffix=='.py':ast.parse(p.read_text())
 if p.suffix=='.md':
  for url in re.findall(r'\]\(([^)]+)\)',p.read_text()):
   if not url.startswith(('https://','http://','#')):assert (p.parent/url.split('#')[0]).exists(),(p.name,url)
print('PASS: source pins, 24 shared role/mode records, source hash/JSON round trip, shadow/border/ramp preservation, loss coverage, deterministic fixtures, local links, syntax and <1 MB/file. No target-app or renderer certification.')
