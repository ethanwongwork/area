"""Generate the role map from curated assignments + immutable CSS/manifest/spec evidence.
Run from anywhere: python3 /path/to/04-role-map/build.py [--check]
No working-tree production file is used. No network needed after fetching the snapshot.
"""
import re,json,sys,collections
from source import HERE,SHA,read,paths,manifest,rules
from assignments import MAP,ROLES,PARENTS,DEPTH,NOTES,SPEC_ALIASES
from extras import EXTRAS
from compositions import BINDINGS
from refinements import SOURCES,REPLACE,VARIANTS
BASE='https://github.com/ethanwongwork/area/blob/'+SHA+'/'
MS=manifest(); RS=rules(); CACHE={}
def lines(p):
 if p not in CACHE:CACHE[p]=read(p).splitlines()
 return CACHE[p]
def pin(p,a,b=None):
 b=b or a
 assert 1<=a<=b<=len(lines(p)),(p,a,b,len(lines(p)))
 return {'file':p,'line':a,'end':b}
def link(s):
 suffix=f'#L{s["line"]}'+(f'-L{s["end"]}' if s['end']!=s['line'] else '')
 return f'[{s["file"]}:{s["line"]}]({BASE}{s["file"]}{suffix})'
def csspin(stem,a,b=None):return pin('packages/styles/src/components/'+stem+'.css',a,b)
def clsrows(c):
 pat=re.compile(r'\.'+re.escape(c)+r'(?![\w-])')
 return [r for r in RS if pat.search(r['selector'])]
def subject(r,c):
 # Conservative census, not a CSS parser: exact class or final class followed only by state/pseudo.
 s=r['selector']; allc=re.findall(r'\.(area-[\w-]+)',s)
 if not allc or allc[-1].split('--')[0]!=c:return False
 tail=s[s.rfind('.'+allc[-1])+len(allc[-1])+1:]
 return not re.search(r'\s[>+~]?\s*(?:svg|span|img|video|input|button|i|a|li|path|circle|th|td)\b',tail)
def best(c):
 rs=clsrows(c)
 assert rs,c
 def score(r):
  s=r['selector']; exact=s=='.'+c
  return (not exact,not subject(r,c),'components/' not in r['path'],'::' in s, ':hover' in s or ':focus' in s or ':active' in s,'--' in s,len(s),r['line'])
 r=min(rs,key=score)
 return pin(r['path'],r['line'],r['end'])
assign={}
for l in MAP.strip().splitlines():
 k,root,*groups=l.split();d={'root':root}
 for group in groups:
  role,es=group.split(':')
  for e in es.split(','):assert e not in d;d[e]=role
 assign[k]=d
assert set(assign)==set(MS),(set(MS)-set(assign),set(assign)-set(MS))
F=[];BY={}
for k,m in MS.items():
 expected={'root',*m.get('elements',[])}
 assert set(assign[k])==expected,(k,expected-set(assign[k]),set(assign[k])-expected)
 slug=SPEC_ALIASES.get(k,re.sub(r'(?<!^)(?=[A-Z])','-',k).lower())
 sp='docs/specs/'+slug+'.md';sl=lines(sp)
 heading=next((i for i,l in enumerate(sl,1) if re.search(r'^## Anatomy',l)),next((i for i,l in enumerate(sl,1) if l=='## Job and boundaries'),1))
 end=next((i-1 for i,l in enumerate(sl,1) if i>heading and l.startswith('## ')),min(heading+15,len(sl)))
 f={'id':k,'block':m['block'],'description':m['description'],'manifest':pin('packages/styles/src/manifest.ts',m['line']),'spec':pin(sp,heading,min(end,heading+18)),'parts':[],'compositions':[]}
 F.append(f);BY[k]=f
 for e,code in assign[k].items():
  ident=k+'.'+e;c=m['block']+('' if e=='root' else '__'+e)
  al,note=NOTES.get(ident,('',''))
  kind='contract';visible=True
  if ident in ['switch.control','colorPicker.channel','count.label','panel.resize']:kind='nonpaint';visible=False
  p={'id':ident,'part':e,'selector':'.'+c,'role':ROLES[code],'depth':DEPTH.get(ident,'flush'),'parent':PARENTS.get(k,{}).get(e,'@host' if e=='root' else 'root'),'kind':kind,'sources':[best(c)]}
  if al and ROLES[al]!=p['role']:p['alternate_role']=ROLES[al]
  if note:p['note']=note
  if not visible:p['paint']='none'
  f['parts'].append(p)
for l in EXTRAS.strip().splitlines():
 k,e,code,parent,stem,a,b,sel,note=l.split('|')
 hidden=any(x in note.lower() for x in ['invisible','no independent material paint'])
 p={'id':k+'.'+e,'part':e,'selector':sel,'role':ROLES[code],'depth':DEPTH.get(k+'.'+e,'floating' if code=='F' and parent=='@host' else 'flush'),'parent':parent,'kind':'nonpaint' if hidden else 'supplement','sources':[csspin(stem,int(a),int(b))],'note':note}
 if hidden:p['paint']='none'
 BY[k]['parts'].append(p)
# Manual review overrides weak lexical source matches, plus conditional depth evidence.
for f in F:
 for p in f['parts']:
  if p['id'] in SOURCES:
   src=[pin(path[1:] if path.startswith('@') else 'packages/styles/src/'+path,a,b) for path,a,b in SOURCES[p['id']]]
   p['sources']=src if p['id'] in REPLACE else p['sources']+src
  if p['id'] in VARIANTS:
   p['depth_variants']=[{'when':when,'depth':dep,'source':csspin(stem,a,b)} for when,dep,stem,a,b in VARIANTS[p['id']]]
  if p['id']=='colorPicker.slider-thumb-moz':p['depth']='raised'
  if p['role']=='scrim' and p['parent']=='@host':p['depth']='floating'
  if p['id'] in ['card.carousel','skeleton.lines']:p['parent']='@host'
  if p['id']=='field.required':p['parent']='label'
  if p['id']=='table.cell':p['parent']='row'
  if p['id'] in ['table.head-cell','table.body-cell']:p['parent']='row'
# Explicit edges and structural rules are paint layers on an existing part, not new boxes.
# Only subject rules are examined; context selectors are retained as conditions in evidence.
for f in F:
 k=f['id']
 for p in list(f['parts']):
  if p['kind']!='contract' or p['role'] in ['edge','divider'] or p.get('paint')=='none':continue
  c=p['selector'][1:];edge=[];div=[]
  for r in clsrows(c):
   if not subject(r,c):continue
   for prop,val in r['props'].items():
    if prop.startswith('--'):continue
    if prop in ['outline','border','border-color','border-width'] or prop=='box-shadow' and ('inset' in val or re.search(r'0\s+0\s+0',val)):
     if val.strip() not in ['0','none','transparent','0px'] and not val.strip().startswith('0 '):edge.append(r)
     elif prop=='box-shadow' and val.strip()!='none':edge.append(r)
    elif re.match(r'border-(?:block|inline)(?:-start|-end)?$',prop) and val.strip() not in ['0','none']:div.append(r)
  for typ,rs in [('edge',edge),('divider',div)]:
   if not rs:continue
   # Keep a base example and a focus/selected example. Full matching locations available in census rerun.
   chosen=[rs[0]]
   for r in rs[1:]:
    if ':focus' in r['selector'] or 'selected' in r['selector'] or 'checked' in r['selector']:
     chosen.append(r);break
   src=[]
   for r in chosen:
    s=pin(r['path'],r['line'],r['end'])
    if s not in src:src.append(s)
   f['parts'].append({'id':p['id']+'.'+typ,'part':p['part']+'.'+typ,'selector':p['selector']+' [same-element '+typ+' paint]','role':typ,'depth':'flush','parent':p['part'],'kind':'paint-layer','sources':src,'note':('Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry.' if typ=='edge' else 'Directional border/rule. Structural divider by default; at an exposed outer side it is an edge. Do not paint it twice.'),**({'alternate_role':'edge'} if typ=='divider' else {})})
# Reviewed property-purpose exceptions: these are not edges/dividers despite CSS mechanism.
REMOVE={'input.control.edge','breadcrumb.chevron.divider','treeView.root.edge','slider.control.edge','codeBlock.line.edge','codeBlock.line.divider'}
for f in F:
 f['parts']=[p for p in f['parts'] if p['id'] not in REMOVE]
 for p in f['parts']:
  if p['id']=='slider.thumb-edge':p['sources'].append(csspin('slider',286,295))
  if p['id'] in ['codeBlock.line-fill','codeBlock.target-mark']:
   p['sources'].append(pin('packages/styles/src/forced-colors.css',73,79))
   p['note']+=' Forced colors replaces tint/shadow with a semantic border rail, still indicator/fill.'
  if p['id']=='avatar.rings':p['sources'].append(pin('packages/styles/src/forced-colors.css',80,82))
# Bindings carry normalized references rather than duplicating thousands of donor records.
for l in BINDINGS.strip().splitlines():
 k,mount,donor,inc,stem,a,b,note=l.split('|');members=BY[donor]['parts']
 wanted=[p['part'] for p in members if 'search-surface' not in p['part']] if inc=='*' else inc.split(',')
 # Edges follow their imported parent automatically.
 wanted+= [p['part'] for p in members if p['kind']=='paint-layer' and p['parent'] in wanted and p['part'] not in wanted]
 refs=[donor+'.'+x for x in wanted]
 BY[k]['compositions'].append({'mount':mount,'family':donor,'parts':refs,'sources':[(csspin(stem[4:],int(a),int(b)) if stem.startswith('css:') else pin('packages/react/src/components/'+stem+'.tsx',int(a),int(b)))],'note':note})
# Extra spec coverage and page/utility parts are intentionally outside the component manifest.
ambient=[
 {'id':'environment.page','part':'page','selector':'body','role':'page','depth':'flush','parent':'@viewport','kind':'environment','sources':[pin('packages/styles/src/base.css',5,14)],'note':'Library page ground, not a manifest family.'},
 {'id':'environment.text','part':'text','selector':'body text','role':'text','depth':'flush','parent':'page','kind':'environment','sources':[pin('packages/styles/src/base.css',7,13),pin('docs/specs/typography.md',86,107)],'note':'Inherited text; component-local text roles refine it.'},
 {'id':'environment.selection','part':'selection','selector':'::selection','role':'indicator/fill','depth':'flush','parent':'text','kind':'environment','sources':[pin('packages/styles/src/base.css',16,19)],'note':'Selected-text highlight; not a surface material.'},
 {'id':'environment.placeholder','part':'placeholder','selector':'::placeholder','role':'text','depth':'flush','parent':'@host','kind':'environment','sources':[pin('packages/styles/src/base.css',21,23)],'note':'Shared placeholder ink; per-field selectors may override it.'},
 {'id':'environment.glyph','part':'glyph','selector':'[data-area-glyph] path','role':'glyph','depth':'flush','parent':'@host','kind':'environment','sources':[pin('packages/styles/src/base.css',25,36),pin('docs/specs/icons.md',3,8)],'note':'Shared icon ink. Intrinsic photo/video pixels retain content; they are not recolorable glyph paint.'},
 {'id':'environment.sr-only','part':'sr-only','selector':'.area-sr-only','role':'text','depth':'flush','parent':'@host','kind':'nonpaint','paint':'none','sources':[pin('packages/styles/src/base.css',39,55)],'note':'Accessible labels/live regions are not visible material parts.'},
]
extra_specs=[
 {'file':'docs/specs/inspector.md','source':pin('docs/specs/inspector.md',17,22),'covered_by':['panel'],'note':'Panel row/section recipe; not an additional manifest family.'},
 {'file':'docs/specs/resizable-panel.md','source':pin('docs/specs/resizable-panel.md',12,19),'covered_by':['panel'],'note':'Panel option: resize hit edge plus focus grip are mapped.'},
 {'file':'docs/specs/overlay.md','source':pin('docs/specs/overlay.md',13,20),'covered_by':['popover','menu','tooltip','dialog','hoverCard','contextMenu'],'note':'Behavior layer; paint belongs to referenced surfaces.'},
 {'file':'docs/specs/icons.md','source':pin('docs/specs/icons.md',3,8),'covered_by':['environment.glyph'],'note':'Icon corpus maps to glyph role; individual drawings are not component parts.'},
 {'file':'docs/specs/typography.md','source':pin('docs/specs/typography.md',86,107),'covered_by':['environment.text'],'note':'Type system maps to text role; sizes/weights are not new material roles.'},
]
# Validation: finite inventory, source bounds, exact IDs and parent graph, CSS class census.
allparts={p['id']:p for f in F for p in f['parts']};allparts.update({p['id']:p for p in ambient})
assert len(allparts)==sum(len(f['parts']) for f in F)+len(ambient)
for f in F:
 local={p['part'] for p in f['parts']}
 for p in f['parts']:
  assert p['role'] in ROLES.values()
  assert p['depth'] in ['flush','raised','recessed','floating']
  assert p['parent'].startswith('@') or p['parent'] in local,(p['id'],p['parent'])
  seen=set();q=p
  while not q['parent'].startswith('@'):
   assert q['id'] not in seen,('cycle',q['id']);seen.add(q['id']);q=allparts[f['id']+'.'+q['parent']]
 for b in f['compositions']:
  assert b['mount'] in local,(f['id'],b['mount'])
  assert all(x in allparts for x in b['parts']),(f['id'],b['parts'])
allclasses={c.split('--')[0] for r in RS for c in re.findall(r'\.(area-[\w-]+)',r['selector'])}
contractclasses={m['block'] for m in MS.values()}|{m['block']+'__'+e for m in MS.values() for e in m.get('elements',[])}
extra_classes={'area-sr-only'}|{'area-syntax-'+x for x in ['attr','comment','keyword','punct','string','tag']}
assert allclasses==contractclasses|extra_classes,allclasses-(contractclasses|extra_classes)
covered_specs={f['spec']['file'] for f in F}|{x['file'] for x in extra_specs}
assert set(paths('docs/specs'))-covered_specs=={'docs/specs/README.md','docs/specs/TEMPLATE.md','docs/specs/PRIOR_DECISIONS.md'}
summary={'manifest_contracts':len(F),'distinct_component_specs':len({f['spec']['file'] for f in F}),'parts':len(allparts),'nonpaint_records':sum(p['kind']=='nonpaint' for p in allparts.values()),'composition_bindings':sum(len(f['compositions']) for f in F),'normalized_css_classes':len(allclasses),'css_selector_records':len(RS),'roles':dict(collections.Counter(p['role'] for p in allparts.values()))}
data={'schema_version':1,'date':'2026-10-08','area_commit':SHA,'evidence_url_template':BASE+'{file}#L{line}-L{end}','classification':'Research inference from pinned source, not an approved API or browser measurement.','depth_basis':'Relative visual paint plane, not DOM nesting, CSS z-index or a measured distance. Raised/floating are conditional readings; see part and composition notes. Field/track roles are flush unless source demonstrates relief.','parent_semantics':'Local part id or @host/@viewport; representative visual containment, not a promise of exact DOM ancestry. Same-element paint layers refer to the owning part. Composition parts are normalized references; donor root binds to mount when co-classed, otherwise is its child. Host overlays stay relative to @host.','composition_semantics':'parts enumerates donor templates available at that mount, conditional on props and note. Reuse imports roles, never applies a second root paint. Recurse into donor compositions only when their mount is present and the consuming variant enables them. Menu submenu is explicitly recursive. A custom consumer child is outside the closed shipped-part census.','role_vocabulary':list(ROLES.values()),'summary':summary,'environment':ambient,'families':F,'additional_specs':extra_specs,'excluded_specs':['docs/specs/README.md','docs/specs/TEMPLATE.md','docs/specs/PRIOR_DECISIONS.md'],'scope_limits':['CSS selector census is lexical, not a standards CSS parser or computed-style engine. Variant conditions remain in source links.','Native OS popup/scrollbars/textarea resize grips have no Area-owned internal geometry; no invented subpart values.','Repeated rows/options/icons and arbitrary consumer content use templates; no per-instance expansion.','Hit-target-only and screen-reader-only records are accounted but have paint:none.','State fills on an existing plate retain the plate role; independent semantic markers and edge paint receive explicit records.']}
blob=json.dumps(data,ensure_ascii=False,indent=1)+'\n';assert len(blob.encode())<1_000_000,len(blob.encode())
md=['# Area material role map','',f'Area snapshot: `{SHA}` · checked 2026-10-08. Research assignments, not owner approval.','',f'{summary["manifest_contracts"]} manifest contracts; {summary["distinct_component_specs"]} component specs; {summary["parts"]} normalized part/layer records, including {summary["nonpaint_records"]} nonpaint records; {summary["composition_bindings"]} explicit reuse bindings.','', 'Read [method and limits](README.md) before applying this map. **Flush** is the default visual plane; a role named “raised control” or “recessed field/track” does not assert present relief. Parents are visual groups, not exact DOM parents. Edges are same-element paint, never additional strokes. Optional parts are a union across supported variants.','', '## Environment','', '| Part | Role | Parent → depth | Evidence / qualification |','| --- | --- | --- | --- |']
def esc(x):return str(x).replace('|','\\|').replace('\n',' ')
def row(p):
 note=p.get('note','')
 if p.get('depth_variants'):note+=' Depth exceptions: '+ '; '.join(x['when']+' → '+x['depth']+' '+link(x['source']) for x in p['depth_variants'])+'.'
 if p.get('alternate_role'):note+=' Alternate: '+p['alternate_role']+'.'
 if p.get('paint')=='none':note='**No paint.** '+note
 return '| `'+p['part']+'`<br>'+esc(p['selector'])+' | '+p['role']+' | `'+p['parent']+'` → '+p['depth']+' | '+esc(note)+' '+ ' '.join(link(s) for s in p['sources'])+' |'
md += [row(p) for p in ambient]
md+=['','## Families','',' | Contract | Parts | Spec |','| --- | ---: | --- |']
for f in F:md.append(f'| [{f["id"]}](#{f["id"].lower()}) | {len(f["parts"])} | {link(f["spec"])} |')
for f in F:
 md+=['',f'## {f["id"]}','',f'`{f["block"]}` — {f["description"]} Manifest: {link(f["manifest"])}. Spec context: {link(f["spec"])}.','','| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |','| --- | --- | --- | --- |']
 md += [row(p) for p in f['parts']]
 if f['compositions']:
  md+=['','**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.','','| Mount | Donor parts with primary roles | Context / instantiation evidence |','| --- | --- | --- |']
  for b in f['compositions']:
   members='; '.join('`'+x.split('.',1)[1]+'` = '+allparts[x]['role'] for x in b['parts'])
   md.append(f'| `{b["mount"]}` | [{b["family"]}](#{b["family"].lower()}): '+members+' | '+esc(b['note'])+' '+ ' '.join(link(s) for s in b['sources'])+' |')
md+=['','## Specs without independent manifest contracts','','| Spec | Coverage | Evidence |','| --- | --- | --- |']
for s in extra_specs:md.append('| '+s['file']+' | '+', '.join(s['covered_by'])+' — '+s['note']+' | '+link(s['source'])+' |')
outputs={'role-map.json':blob,'role-map.md':'\n'.join(md)+'\n'}
for name,content in outputs.items():
 p=HERE/name
 if '--check' in sys.argv:assert p.read_text()==content, name+' differs: rerun build.py'
 else:p.write_text(content)
print(json.dumps(summary,indent=2));print('role-map.json bytes:',len(blob.encode()));print('All manifest elements, CSS classes, spec families, parent links, donor references and source bounds validated.')
