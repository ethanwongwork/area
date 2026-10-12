#!/usr/bin/env python3
"""Validate report coverage and immutable source citations; optional hash verification."""
import argparse,hashlib,json,re,urllib.request
from pathlib import Path
from urllib.parse import unquote
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[4]
p=argparse.ArgumentParser(description=__doc__);p.add_argument('--fetch',action='store_true');p.add_argument('--render',action='store_true');args=p.parse_args()
assert (ROOT/'docs/research/astra/README.md').exists()
lock=json.loads((HERE/'source-lock.json').read_text());integrity=json.loads((HERE/'source-integrity.json').read_text());data=json.loads((HERE/'survey.json').read_text())
expected={'apple','visionos','fluent','m3','m3-expressive','radix','shadcn','tweakcn','chakra','mantine','heroui','park','carbon','spectrum','polaris','geist','98css','7css','xpcss','nes','daisyui','generators','openglass','figma-glass','open-props','auraglass','liquid-glass-web'}
assert len(data['entries'])==len(expected) and {r['id'] for r in data['entries']}==expected
indexed={(lock[f['library']]['repo'],lock[f['library']]['commit'],f['path']):f for f in integrity}
count=0
for r in data['entries']:
 assert all(r[k] for k in ['kind','controls','scope','gap','docs'])
 for ref in r['refs']:
  match=re.search(r'https://github.com/([^/]+/[^/]+)/blob/([a-f0-9]{40})/([^#]+)#L(\d+)-L(\d+)',ref)
  assert match,ref
  repo,sha,path,lo,hi=match.groups();f=indexed[(repo,sha,unquote(path))]
  assert 1<=int(lo)<=int(hi)<=f['lines'],(ref,f['lines'])
  count+=1
parts=['# Prior-art survey','', 'Original documentation and source snapshots checked **2026-10-08**; task 19 additions and OpenGlass scale checked **2026-10-11**. Source links pin full commit SHAs and one-based line ranges. “Not found” is bounded to the named APIs, documents and source files; it is not a claim that arbitrary custom CSS is impossible. No vendor accessibility/performance claims were independently tested.','']
for r in data['entries']:
 parts += [f'<a id="{r["id"]}"></a>',f'## {r["title"]}','',f'**Category:** {r["kind"]}.','',f'**Controls:** {r["controls"]}','',f'**Propagation:** {r["scope"]}','',f'**Limit / interpretation:** {r["gap"]}','',f'**Documentation:** {r["docs"]} (checked {r.get('checked', '2026-10-08')}).','']
 if r['refs']:parts += ['**Pinned source:** '+ '; '.join(r['refs'])+'.','']
body='\n'.join(parts)
if args.render:(HERE/'survey.md').write_text(body)
else:assert (HERE/'survey.md').read_text()==body,'Run --render'
for f in HERE.glob('*.md'):
 for target in re.findall(r'\]\(([^)]+)\)',f.read_text()):
  if not target.startswith(('https:','http:','#')):assert (f.parent/target.split('#')[0]).exists(),target
for f in HERE.iterdir():
 if f.is_file():assert f.stat().st_size<1_000_000
if args.fetch:
 for f in integrity:
  m=lock[f['library']];url=f'https://raw.githubusercontent.com/{m["repo"]}/{m["commit"]}/{f["path"]}'
  body=urllib.request.urlopen(url,timeout=30).read()
  assert hashlib.sha256(body).hexdigest()==f['sha256'],url
print(f'Validated {len(expected)} entries, {count} pinned citations and {len(integrity)} file integrity records; '+('upstream hashes verified.' if args.fetch else 'offline checks passed.'))
