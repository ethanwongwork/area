"""Read-only source, data, browser-evidence and local-link validation."""
from pathlib import Path
import ast,hashlib,json,re,subprocess
H=Path(__file__).resolve().parent
ROOT=next(p for p in H.parents if (p/'.git').exists())
A='4ea50618cf19e8737b607c9f983f64dd310d921d';R='0169fb7b6d85a910a24a684f9b5b3b537a735956'
cache={};pins=set()
def source(sha,path):
 if (sha,path) not in cache:cache[sha,path]=subprocess.check_output(['git','show',sha+':'+path],cwd=ROOT,text=True)
 return cache[sha,path]
for p in H.iterdir():
 if not p.is_file():continue
 assert p.stat().st_size<1_000_000,p.name
 if p.suffix=='.json':json.loads(p.read_text())
 if p.suffix=='.py':ast.parse(p.read_text())
 if p.suffix!='.md':continue
 for url in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  if url.startswith('https://github.com/ethanwongwork/area/blob/'):
   m=re.fullmatch(r'https://github.com/ethanwongwork/area/blob/([a-f0-9]{40})/([^#]+)#L(\d+)-L(\d+)',url);assert m,url
   sha,path,lo,hi=m.groups();assert sha in (A,R);assert 1<=int(lo)<=int(hi)<=len(source(sha,path).splitlines()),url;pins.add(url)
  elif not re.match(r'\w+://',url):assert (p.parent/url.split('#')[0]).exists(),(p.name,url)
for f in json.loads((H/'source-ledger.json').read_text())['files']:
 assert hashlib.sha256(source(A,f['file']).encode()).hexdigest()==f['sha256'],f['file']
axis=json.loads((H/'axis.json').read_text());assert axis['id']=='material' and axis['defaultPreset']=='none'
assert [x['id'] for x in axis['presets']]==['none','glass','tactile','soft']
assert len({tuple(sorted(x['tokens'])) for x in axis['presets']})==1
for p in axis['presets']:
 assert sum(int(v) for k,v in p['tokens'].items() if k.startswith('--area-material-gate-'))==(p['id']!='none')
controls=json.loads((H/'controls.json').read_text());assert len(controls['roles'])==13 and 'row-plate' in controls['roles']
for preset,values in controls['seeds'].items():
 for key,value in values.items():b=controls['bounds'][key];assert b['min']<=value<=b['max'],(preset,key)
b=json.loads((H/'browser-results.json').read_text());assert b['pass'] and len(b['surface'])==64 and len(b['nested'])==8 and len(b['gates'])==16
for name,digest in b['sourceHashes'].items():assert hashlib.sha256((H/name).read_bytes()).hexdigest()==digest,('stale browser evidence',name)
assert all(x['changedPixels']==0 and x['computedEqual'] for x in b['surface'])
assert all(x['offDiff']['changedPixels']==0 for x in b['gates'] if not x['expectedFailure'])
assert all(x['onDiff']['changedPixels']>0 for x in b['gates'])
r=(H/'README.md').read_text();assert r.startswith('**Question:**') and r.index('**Answer:**')<r.index('**Snapshot:**')
assert len(r.split('**Answer:**')[1].split('**Snapshot:**')[0].strip().splitlines())<10
print(f'PASS: {len(pins)} pinned source links, local links, immutable hashes, total preset maps, bounds and fresh browser evidence.')
