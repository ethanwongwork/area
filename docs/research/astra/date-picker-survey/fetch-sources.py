#!/usr/bin/env python3
"""Fetch public pinned sources into a disposable /tmp cache, never into the repository."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import sys
import urllib.request

ROOT = Path(__file__).resolve().parents[4]
TOPIC = Path(__file__).resolve().parent
CACHE = Path('/private/tmp/area-date-picker-sources')
CACHE.mkdir(exist_ok=True)
def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Area-research'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()
def catalog(name, repo, commit):
    if not commit:
        commit = json.loads(fetch(f'https://api.github.com/repos/{repo}/commits/HEAD'))['sha']
    tree = json.loads(fetch(f'https://api.github.com/repos/{repo}/git/trees/{commit}?recursive=1'))
    assert not tree.get('truncated'), repo
    (CACHE / (name + '-tree.json')).write_text(json.dumps(tree))
    return name, {'repo': repo, 'commit': commit}
if '--npm' in sys.argv:
    name, repo, package, version = sys.argv[2:6]
    commit = json.loads(fetch(f'https://registry.npmjs.org/{package}/{version}'))['gitHead']
    key, entry = catalog(name, repo, commit)
    lock = json.loads((TOPIC / 'source-lock.json').read_text())
    lock[key] = entry
    (TOPIC / 'source-lock.json').write_text(json.dumps(lock, indent=2) + '\n')
    print(key, entry)
elif '--add' in sys.argv:
    name, repo, ref = sys.argv[2:5]
    commit = json.loads(fetch(f'https://api.github.com/repos/{repo}/commits/{ref}'))['sha']
    key, entry = catalog(name, repo, commit)
    lock = json.loads((TOPIC / 'source-lock.json').read_text())
    lock[key] = entry
    (TOPIC / 'source-lock.json').write_text(json.dumps(lock, indent=2) + '\n')
    print(key, entry)
elif '--catalog' in sys.argv:
    repos = {
        'shadcn': ('shadcn-ui/ui', 'db2db460a26fa84fb65c8d903b213925fbdee9ed'),
        'radix': ('radix-ui/primitives', None),
        'radix-themes': ('radix-ui/themes', '1faff10ac26ae17f09944d418c6949b93fc6b566'),
        'adobe': ('adobe/react-spectrum', 'b90cbea6a1ab6ee12b66ac03d37a97fd661c8783'),
        'base-ui': ('mui/base-ui', '62b54e8c944784c4de992eb424286b77cea4415a'),
        'primer': ('primer/react', 'a89299ae77e8f444599f94d7e9ca368c17be3f9a'),
        'fluent': ('microsoft/fluentui', '8add8c8750c34c85acd811e32ab324abf8f1562e'),
        'carbon': ('carbon-design-system/carbon', '650fcf4a8c5f86c5fdaa255d59229fe70fdb9757'),
        'ant': ('ant-design/ant-design', '7ad64087106acd078dcc7d91a4adfdf38f5ce172'),
        'mui-x': ('mui/mui-x', None),
    }
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        futures = [pool.submit(catalog, name, *repo) for name, repo in repos.items()]
        results = dict(f.result() for f in futures)
    (TOPIC / 'source-lock.json').write_text(json.dumps(results, indent=2) + '\n')
    print(json.dumps(results, indent=2))
else:
    lock = json.loads((TOPIC / 'source-lock.json').read_text())
    requests = json.loads((TOPIC / 'source-files.json').read_text())
    def get(item):
        name, path = item
        meta = lock[name]
        url = f'https://raw.githubusercontent.com/{meta["repo"]}/{meta["commit"]}/{path}'
        target = CACHE / name / path
        target.parent.mkdir(parents=True, exist_ok=True)
        body = fetch(url)
        target.write_bytes(body)
        return {'library': name, 'path': path, 'sha256': hashlib.sha256(body).hexdigest(), 'lines': len(body.decode().splitlines())}
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        results = list(pool.map(get, requests))
    (TOPIC / 'source-integrity.json').write_text(json.dumps(results, indent=2) + '\n')
    print(f'Fetched {len(results)} pinned files to {CACHE}')
