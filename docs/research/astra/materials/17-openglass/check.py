"""Validate audit coverage, immutable source pins, hashes and local links."""
from pathlib import Path
import hashlib,json,re,subprocess
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[4]
lock=json.loads((HERE/'source-lock.json').read_text())
data=json.loads((HERE/'components.json').read_text())
cache=HERE/'.source-cache'
expected={'Button','IconButton','SegmentedControl','Switch','Slider','Toolbar','Dock','Tabs','Menu','MenuItem','Popover','Tooltip','MediaControls','Badge','Avatar','AvatarGroup','Card','Stat','Progress','Meter','Spinner','Skeleton','Alert','Banner','Breadcrumbs','Pagination','Accordion','Dialog','Drawer','Toast','Checkbox','RadioGroup','Select','TextField','Textarea','SearchField','NumberField','Stepper','ToggleButton','FileDropzone'}
names=[r['component'] for r in data['components']]
assert len(names)==len(set(names))==40 and set(names)==expected
assert data['upstream_commit']==lock['open_glass_ui']['commit']
for path in HERE.glob('*.json'):
 assert path.stat().st_size<1_000_000,path
 json.loads(path.read_text())
def git(*args):return subprocess.check_output(['git','-C',str(ROOT),*args],text=True)
source_text={}
for r in lock['citations']:
 key=(r['owner'],r['path'])
 if key not in source_text:
  if r['owner']=='og':
   if cache.exists():source_text[key]=(cache/r['path']).read_text().splitlines()
   else:source_text[key]=[None]*next(f['lines'] for f in lock['source_files'] if f['path']==r['path'])
  else:source_text[key]=git('show',r['commit']+':'+r['path']).splitlines()
 assert 1<=r['start']<=r['end']<=len(source_text[key]),r
 assert r['commit'] in r['url'] and r['url'].endswith(f"#L{r['start']}-L{r['end']}"),r
for c in data['components']:
 assert c['sources'] and c['flow'] and c['fallback_and_nesting'] and c['roles']
 s=c['sources'][0]
 if cache.exists():
  lines=(cache/s['file']).read_text().splitlines()[s['start']-1:s['end']]
  assert any('function '+c['component'] in line for line in lines),c['component']
if cache.exists():
 assert subprocess.check_output(['git','-C',str(cache),'rev-parse','HEAD'],text=True).strip()==lock['open_glass_ui']['commit']
 assert not subprocess.check_output(['git','-C',str(cache),'status','--porcelain','--untracked-files=no'],text=True).strip(),'Upstream tracked source changed'
 for f in lock['source_files']:
  assert hashlib.sha256((cache/f['path']).read_bytes()).hexdigest()==f['sha256'],f['path']
 atlas=(cache/'apps/showcase/src/component-atlas.tsx').read_text()
 atlas_names=re.findall(r'<Specimen\b[^>]*\bname="([^"]+)"',atlas,re.S)
 assert len(atlas_names)==40 and set(atlas_names)==expected,(len(atlas_names),set(atlas_names)^expected)
for path in HERE.glob('*.md'):
 text=path.read_text()
 assert not re.search(r'\{(?:og|area|research):',text),path
 for target in re.findall(r'\]\(([^)]+)\)',text):
  if target.startswith(('https://','http://','#')):continue
  assert (path.parent/target.split('#')[0]).exists(),(path.name,target)
# Every generated source URL must be a recorded immutable citation.
known={r['url'] for r in lock['citations']}
for path in HERE.glob('*.md'):
 for url in re.findall(r'https://github.com/[^)\s]+/blob/[^)\s]+',path.read_text()):
  assert url in known,(path.name,url)
print(f"PASS: {len(names)} components; {len(lock['citations'])} pinned ranges; {len(lock['source_files'])} upstream files; JSON <1 MB; local links resolve.")
if not cache.exists():print('LIMIT: ignored source clone absent; upstream bounds checked from lock, bytes not reverified.')
