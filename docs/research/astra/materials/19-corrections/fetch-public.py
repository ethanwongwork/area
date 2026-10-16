"""Optional read-only fetch of task-19 public source pins into ignored .cache/."""
from pathlib import Path
import hashlib,json,urllib.request
H=Path(__file__).resolve().parent;M=H.parent
lock=json.loads((M/'02-prior-art/source-lock.json').read_text())
selected={'figma-glass','open-props','auraglass','liquid-glass-web'}
seen=set()
for record in json.loads((M/'02-prior-art/source-integrity.json').read_text()):
 if record['library'] not in selected:continue
 source=lock[record['library']];repo,sha=source['repo'],source['commit'];path=record['path']
 if (repo,path) in seen:continue
 seen.add((repo,path))
 data=urllib.request.urlopen('https://raw.githubusercontent.com/'+repo+'/'+sha+'/'+path).read()
 assert hashlib.sha256(data).hexdigest()==record['sha256'],(repo,path)
 dest=H/'.cache'/repo/path;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
 print(repo,path,'hash matches')
