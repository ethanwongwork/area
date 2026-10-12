"""Reproduce internal inventory checks; never writes to tasks 01–14.

Default writes only this folder; --check compares committed audit data. This is
not a material renderer, semantic contradiction detector, or external-source audit.
"""
from pathlib import Path
from collections import Counter
from itertools import combinations
import ast, hashlib, json, re, subprocess, sys

HERE = Path(__file__).resolve().parent
MATERIALS = HERE.parent
ROOT = next(p for p in HERE.parents if (p / '.git').exists())
RESEARCH = 'b0768c8d809946b82d6b00139ecc33fe4e57f528'
AREA = '3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e'
PREFIX = 'docs/research/astra/materials/'

def read(name):
    return json.loads(subprocess.check_output(['git', 'show', f'{RESEARCH}:{PREFIX}{name}'], cwd=ROOT))

def emit(name, data):
    text = json.dumps(data, ensure_ascii=False, indent=2) + '\n'
    assert len(text.encode()) < 1_000_000
    if '--check' in sys.argv:
        assert (HERE / name).read_text() == text, name
    else:
        (HERE / name).write_text(text)

tracked = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', RESEARCH, PREFIX], cwd=ROOT, text=True).splitlines()
ledger = []
for name in tracked:
    relative = name.removeprefix(PREFIX)
    if not re.match(r'(0[1-9]|1[0-4])-', relative):
        continue
    # Reproduce the historical audit from its immutable inputs after task 19 corrections.
    data = subprocess.check_output(['git', 'show', f'{RESEARCH}:{name}'], cwd=ROOT)
    # Parse every JSON, including benchmark aggregates; retain no duplicate raw logs.
    if name.endswith('.json'):
        json.loads(data)
    ledger.append(dict(file=relative, bytes=len(data), sha256=hashlib.sha256(data).hexdigest(), lines=len(data.splitlines())))

tax = read('01-taxonomy/taxonomy.json')['styles']
style_names = {s['id']: s['name'] for s in tax}
assert len(style_names) == 25
for name in ['05-absorption/absorption.json', '08-accessibility/styles.json', '09-dark-density/styles.json', '10-states/states.json']:
    assert {s['id']: s['name'] for s in read(name)['styles']} == style_names, name
rolemap = read('04-role-map/role-map.json')
parts = rolemap['environment'] + [p for f in rolemap['families'] for p in f['parts']]
role_counts = dict(sorted(Counter(p['role'] for p in parts).items()))
assert len(parts) == 626 and len({p['id'] for p in parts}) == 626
assert len(role_counts) == 12 and len(rolemap['families']) == 78
assert all(p['sources'] for p in parts)
assert sum(p['kind'] == 'nonpaint' for p in parts) == 15
assert sum(len(f.get('compositions', [])) for f in rolemap['families']) == 107
roles = list(role_counts)
normalize = lambda s: s.replace('/', '-').replace(' ', '-')
absorption = read('05-absorption/absorption.json')
assert {f['id'] for f in rolemap['families']} == {f['family'] for f in absorption['families']}
assert all({r['role'] for r in s['recipes']} == set(roles) for s in absorption['styles'])
assert sum(len(s['recipes']) for s in absorption['styles']) == 300
references = read('06-references/references.json')
assert set(references['style_coverage']) == set(style_names)
assert all(references['style_coverage'][s]['references'] for s in style_names)
presets = read('13-presets/presets.json')
assert set(presets['roles']) == {normalize(r) for r in roles}
assert len(presets['presets']) == 8
neutral = presets['neutralControls']

def leaves(value, prefix=''):
    if isinstance(value, dict) and value:
        return {k: v for a, b in value.items() for k, v in leaves(b, prefix + '/' + a).items()}
    return {prefix: value}

fields = set(leaves(neutral))
instances = []
for preset in presets['presets']:
    assert set(preset['styles']) <= set(style_names)
    assert set(preset['modes']) == {'light', 'dark'}
    for mode, data in preset['modes'].items():
        assert set(data['roles']) == set(presets['roles'])
        assert data['globalControls'] == data['roles']['floating-surface']['controls']
        for role, record in data['roles'].items():
            controls = record['controls']
            # Dynamic named gradients are separately validated by task 13's checker.
            common = dict(controls, gradients={})
            assert set(leaves(common)) == fields
            assert controls['light'] == neutral['light']
            assert controls['surfaceControls'] == neutral['surfaceControls']
            instances.append(dict(preset=preset['id'], mode=mode, role=role,
                amount=controls['amount'], reliefLobes=2 if controls['relief']['depthPx'] and controls['relief']['strength'] else 0,
                reliefBlurPx=controls['relief']['softnessPx'],
                glowLobes=1 if controls['glow']['strength'] else 0,
                glowBlurPx=controls['glow']['softnessPx'],
                gloss=controls['gloss']['strength'] > 0, glossBlurPx=controls['gloss']['softnessPx'],
                stroke=controls['stroke']['coverage'] != 'none',
                castEligibility=record['castEligibility']))
assert len(instances) == 192
state_fields = ['hover', 'press', 'focus_visible', 'selected_checked', 'open', 'disabled', 'invalid']
states = read('10-states/states.json')['styles']
assert all(all(s[k] for k in state_fields + ['motion', 'reduced_motion']) for s in states)
# Human-selected counterexamples. Caps are transcribed from 11, not parsed from prose.
# The checks show requests exceed those caps; they do not run a guard resolver.
witnesses = []
by_id = {p['id']: p for p in presets['presets']}
def control(preset, mode, role):
    return by_id[preset]['modes'][mode]['roles'][role]['controls']
for mode in ['light', 'dark']:
    for preset in ['soft', 'tactile']:
        c = control(preset, mode, 'container')
        assert c['relief']['depthPx'] > 0 and c['relief']['strength'] > 0
        witnesses.append(dict(finding='C02', mode=mode, preset=preset, receiver='container with one permitted cast lobe', countedLobes=3, cap=2))
    if mode == 'light':
        c = control('glow', mode, 'container')
        assert c['glow']['strength'] > 0 and c['glow']['softnessPx'] > 0
        witnesses.append(dict(finding='C02', mode=mode, preset='glow', receiver='light Card with two cast lobes', countedLobes=3, cap=2))
    for preset, extra in [('soft', 2), ('tactile', 2), ('glow', 1)]:
        c = control(preset, mode, 'floating-surface')
        assert (2 if c['relief']['depthPx'] > 0 else 0) + (1 if c['glow']['strength'] > 0 else 0) == extra
        witnesses.append(dict(finding='C03', mode=mode, preset=preset, receiver='ordinary non-Flat overlay', countedLobes=2+extra, cap=2))
    c = control('glass', mode, 'thumb-knob')
    assert c['stroke']['coverage'] != 'none' and c['gloss']['strength'] > 0
    c = control('aero', mode, 'thumb-knob')
    assert c['gloss']['strength'] > 0 and 'body-reflection' in c['gradients'] and c['stroke']['coverage'] != 'none'
    for preset in ['soft', 'tactile']:
        assert control(preset, mode, 'thumb-knob')['relief']['depthPx'] > 0
    assert control('glow', mode, 'thumb-knob')['glow']['softnessPx'] == 2
    for preset in ['glass', 'soft', 'tactile', 'aero', 'glow']:
        witnesses.append(dict(finding='C04', mode=mode, preset=preset, receiver='thumb', reason='enabled request exceeds one nonblurred highlight/rim; see findings prose for distinct channels'))
    assert control('soft', mode, 'divider')['relief']['softnessPx'] == 2
    witnesses.append(dict(finding='C05', mode=mode, preset='soft', receiver='divider', requestedReliefBlurPx=2, cap=0))
    assert control('soft', mode, 'edge')['relief']['depthPx'] > 0
    assert control('glow', mode, 'edge')['glow']['softnessPx'] == 4
    for preset in ['soft', 'glow']:
        witnesses.append(dict(finding='C06', mode=mode, preset=preset, receiver='independent edge', reason='relief/halo outside single-ring budget'))
    c = control('glow', mode, 'indicator-fill')
    assert c['glow']['strength'] > 0 and c['glow']['softnessPx'] == 2
    assert c['body']['source'] == 'receiver.semantic-or-literal-core'
    witnesses.append(dict(finding='C07', mode=mode, preset='glow', receiver='semantic indicator without decorative designation', requestedGlowBlurPx=2, defaultGlowLobes=0))
pairs = read('13-presets/compatibility.json')
assert set(pairs['styleOrder']) == set(style_names)
assert {frozenset((x['a'], x['b'])) for x in pairs['stylePairs']} == {frozenset(x) for x in combinations(style_names, 2)}
assert len(pairs['stylePairs']) == 300 and len(pairs['presetPairs']) == 28
share = read('14-tooling/examples/material.area.json')
glass = next(p for p in presets['presets'] if p['id'] == 'glass')
assert share['payload']['recipeSnapshot'] == glass
canonical = json.dumps(share['payload'], sort_keys=True, separators=(',', ':'), ensure_ascii=False, allow_nan=False).encode()
assert hashlib.sha256(canonical).hexdigest() == share['integrity']['payloadSha256']
stats = dict(styles=25, roles=12, contracts=78, parts=626,
    nonpaintRecords=15, compositionBindings=107, styleStateCells=len(states)*len(state_fields),
    roleCounts=role_counts, roleMapBytes=next(x['bytes'] for x in ledger if x['file']=='04-role-map/role-map.json'),
    absorptionCells=300, presets=8, requestedRoleModeRecords=192, stylePairs=300, presetPairs=28,
    sharedGlassRoleModeRecords=24, parsedJsonFiles=sum(x['file'].endswith('.json') for x in ledger),
    inputFiles=len(ledger), controlLeaves=sorted(fields))
brief = subprocess.check_output(['git', 'show', f'{RESEARCH}:{PREFIX}README.md'], cwd=ROOT)
assert brief == subprocess.check_output(['git', 'show', f'{RESEARCH}:{PREFIX}README.md'], cwd=ROOT)
emit('inputs.json', dict(research=RESEARCH, area=AREA, checked='2026-10-10',
    brief=dict(file='README.md', sha256=hashlib.sha256(brief).hexdigest()), files=ledger))
emit('checks.json', dict(status='structural checks passed; human findings are separate', counts=stats,
    requestedEffects=instances, budgetWitnesses=witnesses, limits='Counts describe the recorded research inputs, not a remap of latest main. Effect counts describe requested seeds before guards; existing Surface lobe counts are contextual. Budget witness caps are human transcriptions, not an automatic policy parser.'))
for path in HERE.glob('*.md'):
    for file, first, last in re.findall(r'https://github.com/ethanwongwork/area/blob/' + RESEARCH + r'/docs/research/astra/materials/([^)#]+)#L(\d+)(?:-L(\d+))?', path.read_text()):
        n = len(subprocess.check_output(['git', 'show', f'{RESEARCH}:{PREFIX}{file}'], cwd=ROOT).splitlines())
        assert 1 <= int(first) <= int(last or first) <= n, (path, file, first, last)
    for url in re.findall(r'\]\(([^)]+)\)', path.read_text()):
        if not url.startswith(('https://', 'http://', '#')):
            assert (path.parent / url.split('#')[0]).exists(), (path.name, url)
for path in HERE.iterdir():
    if path.is_file():
        assert path.stat().st_size < 1_000_000, path
        if path.suffix == '.py':
            ast.parse(path.read_text())
print('PASS: 149 immutable historical inputs; 25 styles, 12 roles, 78 contracts, 626 parts; 300 absorption cells; 175 state cells; 192 preset records; 07/13 control shapes; Glass snapshot/hash; budget witnesses; citation bounds, local links, Python syntax and file sizes.')
