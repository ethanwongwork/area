#!/usr/bin/env python3
"""Read immutable public source into an ignored cache; retain only metadata in git."""
import concurrent.futures as cf
import datetime,json,subprocess,sys,urllib.request
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[4]
CACHE=HERE/'.source-cache'
LOCK=HERE/'source-lock.json'
def api(path):
 return json.loads(subprocess.check_output(['gh','api',path],text=True))
def lock_repo(repo):
 d=api('repos/'+repo+'/commits/HEAD')
 return {'repo':repo,'commit':d['sha'],'commit_date':d['commit']['committer']['date'],'checked':datetime.date.today().isoformat()}
def get(name,path):
 m=json.loads(LOCK.read_text())[name];url=f'https://raw.githubusercontent.com/{m["repo"]}/{m["commit"]}/{path}'
 dest=CACHE/name/path
 if not dest.exists():
  body=urllib.request.urlopen(url,timeout=40).read();dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(body)
 return dest.read_text()
if __name__=='__main__':
 cmd,*args=sys.argv[1:]
 if cmd=='init':
  repos={'98css':'jdan/98.css','7css':'khang-nd/7.css','neumorphism':'adamgiebl/neumorphism','fluent':'microsoft/microsoft-ui-xaml','clay':'codeAdrian/clay.css','flat':'designmodo/Flat-UI','material':'material-components/material-components-web','sdk':'microsoft/WindowsAppSDK','liquid':'rdev/liquid-glass-react'}
  selected={}
  with cf.ThreadPoolExecutor(max_workers=5) as ex:
   for k,v in zip(repos,ex.map(lock_repo,repos.values())): selected[k]=v
  LOCK.write_text(json.dumps(selected,indent=2)+'\n');print(json.dumps(selected,indent=2))
 elif cmd=='tree':
  name,pattern=args;import re
  m=json.loads(LOCK.read_text())[name];d=api(f'repos/{m["repo"]}/git/trees/{m["commit"]}?recursive=1')
  for e in d['tree']:
   if e['type']=='blob' and re.search(pattern,e['path'],re.I):print(e['path'])
 elif cmd=='file':
  name,path,*pattern=args;import re
  lines=get(name,path).splitlines()
  show=range(len(lines)) if not pattern else sorted({j for i,l in enumerate(lines) if re.search(pattern[0],l,re.I) for j in range(max(0,i-3),min(len(lines),i+5))})
  for i in show:print(f'{i+1}: {lines[i]}')
