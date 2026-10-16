"""Read-only evidence/link/schema checks; this does not run a None pixel test."""
from pathlib import Path
import ast
import hashlib
import json
import re
import subprocess

HERE = Path(__file__).resolve().parent
ROOT = next(p for p in HERE.parents if (p / '.git').exists())
AREA = 'd455567e5b264a768f42dc853476f1622ed6dd9f'
REVIEW = 'dbd57a9067e3d927b2bfb7a061db074eeaf48db9'
PREFIX = 'https://github.com/ethanwongwork/area/blob/'
PIN = re.compile(re.escape(PREFIX) + r'([a-f0-9]{40})/([^#)]+)#L(\d+)(?:-L(\d+))?$')
cache = {}

def source(sha, path):
    key = (sha, path)
    if key not in cache:
        cache[key] = subprocess.check_output(['git', 'show', sha + ':' + path], cwd=ROOT, text=True)
    return cache[key]

pins = set()
def check_pin(url):
    match = PIN.fullmatch(url)
    assert match, ('unpinned source', url)
    sha, path, start, end = match.groups()
    assert sha in (AREA, REVIEW), ('unlisted snapshot', sha)
    lo, hi = int(start), int(end or start)
    lines = source(sha, path).splitlines()
    assert 1 <= lo <= hi <= len(lines), (path, lo, hi, len(lines))
    pins.add((sha, path, lo, hi))
    return '\n'.join(lines[lo - 1:hi])

for path in sorted(HERE.iterdir()):
    if not path.is_file():
        continue
    assert path.stat().st_size < 1_000_000, path.name
    if path.suffix == '.py':
        ast.parse(path.read_text(), filename=str(path))
    elif path.suffix == '.json':
        json.loads(path.read_text())
    elif path.suffix == '.md':
        for url in re.findall(r'\]\(([^)]+)\)', path.read_text()):
            if url.startswith(PREFIX):
                check_pin(url)
            elif not re.match(r'\w+://', url):
                assert (path.parent / url.split('#')[0]).exists(), (path.name, url)

records = json.loads((HERE / 'hard-limits.json').read_text())
assert records['areaCommit'] == AREA and records['reviewCommit'] == REVIEW
limits = records['limits']
assert [r['id'] for r in limits] == [f'H{i:02}' for i in range(1, 23)]
for row in limits:
    for key in ('title', 'rule', 'enforcement_today', 'missing_test', 'evidence'):
        assert row[key], (row['id'], key)
    for citation in row['evidence']:
        check_pin(re.search(r'\]\(([^)]+)\)', citation)[1])

# Decision pins must actually include the named decision, not merely valid line numbers.
for number, record_ids in {
    7: ['H03', 'H10', 'H11', 'H12', 'H21'],
    13: ['H14'], 16: ['H15'], 2: ['H16'], 5: ['H17'],
    10: ['H18'], 11: ['H19'], 12: ['H20'], 8: ['H21'], 14: ['H22'],
}.items():
    for record_id in record_ids:
        row = next(r for r in limits if r['id'] == record_id)
        cited = '\n'.join(check_pin(re.search(r'\]\(([^)]+)\)', c)[1]) for c in row['evidence'])
        assert f'**D{number} ' in cited, (record_id, f'missing D{number} in cited lines')

ledger = json.loads((HERE / 'source-pins.json').read_text())
for item in ledger['files']:
    body = source(item['commit'], item['file'])
    assert len(body.splitlines()) == item['lines']
    assert hashlib.sha256(body.encode()).hexdigest() == item['sha256']
scans = json.loads((HERE / 'source-search.json').read_text())
assert scans['commit'] == AREA and len(scans['searches']) == 4
for scan in scans['searches']:
    assert scan['matches'] == [], scan['id']
readme = (HERE / 'README.md').read_text()
assert readme.startswith('**Question:**')
assert readme.index('**Question:**') < readme.index('**Answer:**') < readme.index('**Snapshot:**')
assert len(readme.split('**Answer:**')[1].split('**Snapshot:**')[0].strip().splitlines()) < 10
assert 'No production None implementation or pixel-identity pass is claimed.' in readme
print(f'PASS: 22 limits; {len(pins)} distinct bounded source pins; {len(ledger["files"])} immutable file hashes; local links, decision anchors and file sizes.')
print('Not run: candidate None implementation, browser identity, production builds/tests or AT.')
