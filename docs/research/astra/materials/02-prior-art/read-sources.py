#!/usr/bin/env python3
"""Read public GitHub snapshots. Cache is disposable; only the lock is report evidence."""
import concurrent.futures as cf
import hashlib,json,re,subprocess,sys,urllib.request
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[4]
CACHE=HERE/'.source-cache'
REPOS={'radix':'radix-ui/themes','shadcn':'shadcn-ui/ui','tweakcn':'jnsahaj/tweakcn','chakra':'chakra-ui/chakra-ui','mantine':'mantinedev/mantine','heroui':'heroui-inc/heroui','park':'cschroeter/park-ui','carbon':'carbon-design-system/carbon','spectrum':'adobe/react-spectrum','polaris':'Shopify/polaris','geist':'geist-org/geist-ui','98css':'jdan/98.css','7css':'khang-nd/7.css','xpcss':'botoxparty/XP.css','daisyui':'saadeghi/daisyui','openglass':'moekoelueker/open-glass-ui','fluent':'microsoft/microsoft-ui-xaml','material':'androidx/androidx','neumorphism':'adamgiebl/neumorphism','nes':'nostalgic-css/NES.css'}
def api(path):return json.loads(subprocess.check_output(['gh','api',path],text=True))
def catalogue(pair):
 name,repo=pair
 try:
  meta=api(f'repos/{repo}/commits/HEAD');sha=meta['sha'];tree=api(f'repos/{repo}/git/trees/{sha}?recursive=1')
  CACHE.mkdir(exist_ok=True);(CACHE/(name+'-tree.json')).write_text(json.dumps(tree))
  return name,{'repo':repo,'commit':sha,'commit_date':meta['commit']['committer']['date'],'checked':'2026-10-08','tree_truncated':tree.get('truncated',False)}
 except Exception as e:return name,{'error':str(e),'repo':repo}
def file(name,path):
 meta=json.loads((HERE/'source-lock.json').read_text())[name];dest=CACHE/name/path
 if dest.exists():return dest.read_text()
 url=f'https://raw.githubusercontent.com/{meta["repo"]}/{meta["commit"]}/{path}'
 body=urllib.request.urlopen(url,timeout=30).read().decode();dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(body);return body
if sys.argv[1]=='catalogue':
 names=sys.argv[2:] or REPOS.keys()
 lock=json.loads((HERE/'source-lock.json').read_text()) if (HERE/'source-lock.json').exists() else {}
 with cf.ThreadPoolExecutor(max_workers=5) as pool:
  for k,v in pool.map(catalogue,[(n,REPOS[n]) for n in names]):lock[k]=v;print(k,v)
 (HERE/'source-lock.json').write_text(json.dumps(lock,indent=2)+'\n')
elif sys.argv[1]=='tree':
 name,pattern=sys.argv[2:4];data=json.loads((CACHE/(name+'-tree.json')).read_text())
 for o in data['tree']:
  if o['type']=='blob' and re.search(pattern,o['path'],re.I):print(o['path'])
elif sys.argv[1]=='file':
 name,path=sys.argv[2:4];body=file(name,path);lines=body.splitlines()
 if len(sys.argv)>4:
  pat=sys.argv[4];hits={i for i,l in enumerate(lines) if re.search(pat,l,re.I)}
  show={j for i in hits for j in range(max(0,i-2),min(len(lines),i+4))}
 else:show=range(len(lines))
 for i in sorted(show):print(f'{i+1}: {lines[i]}')
