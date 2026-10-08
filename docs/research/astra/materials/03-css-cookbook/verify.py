#!/usr/bin/env python3
"""Check this research package; optional --fetch validates upstream source hashes."""
import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote, urlsplit
from urllib.request import urlopen
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[4]
MAIN='4c1854202a8e109479d5b83ef24a8325231da056'
class Page(HTMLParser):
 def __init__(self):
  super().__init__(); self.refs=[]; self.ids=[]; self.labels=[]; self.inputs=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a: self.ids.append(a['id'])
  if tag=='label' and 'for' in a: self.labels.append(a['for'])
  if tag in ['input','select']: self.inputs.append(a.get('id'))
  for key in ['href','src']:
   if key in a: self.refs.append(a[key])
def local_link(file,ref):
 u=urlsplit(ref)
 if u.scheme or u.netloc or not u.path: return
 assert (file.parent/unquote(u.path)).resolve().exists(), f'{file.name}: missing {ref}'
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--fetch',action='store_true');args=parser.parse_args()
 files=[f for f in HERE.iterdir() if f.is_file()]
 for f in files: assert f.stat().st_size<1_000_000,f'{f.name} exceeds report limit'
 for f in HERE.glob('*.html'):
  page=Page();page.feed(f.read_text());assert len(page.ids)==len(set(page.ids)),f'{f.name}: duplicate id'
  assert all(x in page.labels for x in page.inputs),f'{f.name}: missing control label'
  for ref in page.refs:local_link(f,ref)
 css=(HERE/'lab.css').read_text()
 assert not re.search(r'@property\s',css),'Registration found'
 assert not re.search(r'--area-[\w-]+\s*:',css),'Demo defines a public Area token'
 for ref in re.findall(r'url\(["\']?([^\)"\']+)',css):local_link(HERE/'lab.css',ref)
 pins=set()
 for f in HERE.glob('*.md'):
  content=f.read_text()
  for ref in re.findall(r'\]\(([^\s)]+)\)',content):local_link(f,ref)
  pins.update(re.findall(r'https://github.com/ethanwongwork/area/blob/([0-9a-f]{40})/([^#)\s]+)#L(\d+)(?:-L(\d+))?',content))
 for sha,path,start,end in pins:
  assert sha==MAIN,f'Area evidence is not at the declared main snapshot: {sha}'
  raw=subprocess.check_output(['git','show',f'{sha}:{path}'],cwd=ROOT,text=True)
  assert 1<=int(start)<=int(end or start)<=len(raw.splitlines()),f'Invalid line pin: {path}:{start}'
 count=0
 for name in ['compat-data.json','caniuse-data.json']:
  data=json.loads((HERE/name).read_text());assert re.fullmatch('[0-9a-f]{40}',data['commit'])
  for item in data.get('files',data.get('features',[])):
   if 'sha256' not in item: continue
   assert re.fullmatch('[0-9a-f]{64}',item['sha256']);count+=1
   if args.fetch:
    url=f"https://raw.githubusercontent.com/{data['repo']}/{data['commit']}/{item['path']}"
    with urlopen(url,timeout=40) as response:raw=response.read()
    assert hashlib.sha256(raw).hexdigest()==item['sha256'],url
    for feature in item.get('features',[]):
     assert 1<=feature['line']<=len(raw.splitlines()),feature['feature']
 assert len(list(HERE.glob('*.html')))==3
 print(f'PASS: {len(files)} files below 1 MB; 3 labelled standalone demos; local links; no Area token definitions/registrations; {len(pins)} Area line pins; {count} source hashes'+(' fetched and matched.' if args.fetch else ' structurally valid.'))
if __name__=='__main__':main()
