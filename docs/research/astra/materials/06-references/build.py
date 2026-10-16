#!/usr/bin/env python3
"""Generate readable reference/board catalogues and validate locked source ranges."""
import argparse,hashlib,importlib,json,re,subprocess
from pathlib import Path
from catalogue import AREA,RESEARCH,DATE,SOURCES,REFS,BOARD,STYLE_NOTES
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[4]
reader=importlib.import_module('read-sources')

def generate():
 lock=json.loads((HERE/'source-lock.json').read_text())
 lock['area-research']={'repo':'ethanwongwork/area','commit':RESEARCH,'checked':DATE}
 styles=json.loads((HERE.parent/'01-taxonomy/taxonomy.json').read_text())['styles']
 roles=json.loads((HERE.parent/'04-role-map/role-map.json').read_text())['role_vocabulary']
 assert {s['id'] for s in styles}==set(STYLE_NOTES)
 assert {s for r in REFS for s in r['styles']}==set(STYLE_NOTES)
 assert len({r['id'] for r in REFS})==len(REFS)
 for r in REFS:
  assert set(r['roles'])<=set(roles)
  for l in r['layers']:assert l['evidence'] and set(l['evidence'])<=SOURCES.keys()
 sources={};integrity={}
 for id,s in SOURCES.items():
  s=dict(s)
  if s['kind']=='repository':
   m=lock[s['library']];path=s['path']
   if s['library']=='area-research':
    body=subprocess.check_output(['git','show',f'{m["commit"]}:{path}'],cwd=ROOT,text=True)
   else:body=reader.get(s['library'],path)
   lines=body.splitlines();a,b=s['start'],s['end']
   assert 1<=a<=b<=len(lines),(id,a,b,len(lines))
   assert s['needle'] in '\n'.join(lines[a-1:b]),id
   s['commit']=m['commit'];s['repo']=m['repo']
   s['url']=f'https://github.com/{m["repo"]}/blob/{m["commit"]}/{path}#L{a}-L{b}'
   integrity[(m['repo'],m['commit'],path)]={'repo':m['repo'],'commit':m['commit'],'path':path,'sha256_utf8_text':hashlib.sha256(body.encode()).hexdigest(),'line_count':len(lines),'checked':DATE}
  sources[id]=s
 def cite(ids):return '; '.join(f'[{id}]({sources[id]["url"]})' for id in ids)
 def ref(ids):return ', '.join(f'[{id}](catalogue.md#{id.lower()})' for id in ids)
 md=['# Public references and exact layer values','',f'Checked **{DATE}**. Research only; all role/style assignments are Astra interpretations. See [method and limits](README.md).', '',
 'Values are source-specified unless explicitly marked calculated. A layer not listed is **not established by this extract**, not automatically zero or absent. Preserve the stated variant, units, paint order, blend mode and dependency. Each record is a selected recipe or documented partial recipe, not an assertion about an entire library.','',
 '## Style coverage','', '| Taxonomy style | References | Coverage boundary |','| --- | --- | --- |']
 for s in styles:
  rs=[r['id'] for r in REFS if s['id'] in r['styles']]
  md.append(f'| {s["name"]} | {ref(rs)} | {STYLE_NOTES[s["id"]]} |')
 for r in REFS:
  md += ['',f'<a id="{r["id"].lower()}"></a>',f'## {r["id"]} — {r["title"]}','',f'**Evidence class:** {r["kind"]}. **Checked:** {r["checked"]}.', '',f'**Roles shown / possible role use:** {", ".join(r["roles"])}. **Scope:** {r["scope"]}','']
  for l in r['layers']:md.append(f'- **{l["channel"]}:** {l["value"]} {cite(l["evidence"])}.')
  md += ['',f'**Limits:** {r["limits"]}']
 board=['# Owner-board cross-reference','',f'Checked **{DATE}** against the [pinned brief](https://github.com/ethanwongwork/area/blob/{RESEARCH}/docs/research/astra/materials/README.md#L64-L118). No board images were supplied in this turn; the brief says they are not in the repository. No image-derived estimates were made.','',
 '**Coverage means ingredient evidence, not visual equivalence.** No independently identified public original matches a complete board composition. Items 5 and 6 are covered only to the extent of the owner-transcribed annotations; all other items have partial technical analogues and explicit gaps.','',
 '| Item / pinned description | Status | Relevant records | What is covered and what remains unknown |','| --- | --- | --- | --- |']
 for n,a,b,status,ids,note in BOARD:board.append(f'| [{n}]({sources["board-"+str(n)]["url"]}) | {status} | {ref(ids)} | {note} |')
 data={'schema_version':1,'checked':DATE,'status':'unreviewed','area_commit':AREA,'research_inputs_commit':RESEARCH,'basis':'Specified source values; mappings are research inference. No screenshot measurements. Partial native recipes are explicitly marked.','references':REFS,'sources':sources,'style_coverage':{s['id']:{'references':[r['id'] for r in REFS if s['id'] in r['styles']],'boundary':STYLE_NOTES[s['id']]} for s in styles},'board':[{'item':n,'status':status,'references':ids,'note':note,'evidence':'board-'+str(n)} for n,a,b,status,ids,note in BOARD]}
 outputs={'catalogue.md':'\n'.join(md)+'\n','board-coverage.md':'\n'.join(board)+'\n','references.json':json.dumps(data,indent=2,ensure_ascii=False)+'\n','source-integrity.json':json.dumps(list(integrity.values()),indent=2)+'\n'}
 for name,text in outputs.items():assert len(text.encode())<1_000_000,name
 return outputs,len(integrity)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
 outputs,n=generate()
 for name,text in outputs.items():
  path=HERE/name
  if args.check:assert path.read_text()==text,f'{name}: stale; run build.py'
  else:path.write_text(text)
 print(f'{"Verified" if args.check else "Generated"}: {len(REFS)} references, {len(STYLE_NOTES)} styles, {len(BOARD)} board entries; {n} immutable files, {sum(s["kind"]=="repository" for s in SOURCES.values())} pinned source ranges; every generated file <1 MB.')
