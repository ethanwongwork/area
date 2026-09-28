"""Validate the run-2 research deliverable without network access or dependencies."""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
EXPECTED = set('menu message model-picker nav number-field panel popover progress prompt-suggestions property-list radio scroll-to-latest segmented select separator skeleton slider spinner split-button switch table tabs textarea toast toolbar tooltip tree-view'.split())
SECTIONS = ['Job', 'Variant axes', 'Structural alternatives', 'Interaction patterns', 'Area today', 'Proposed range', 'Sources']
INDEX = json.loads((ROOT / 'index-2.json').read_text())
AUDIT = json.loads((ROOT / 'source-audit-2.json').read_text())
SHA = INDEX['_meta']['starting_commit']
DATE = INDEX['_meta']['checked_on']
SYSTEMS = set(INDEX['_meta']['systems'].values())
assert len(SYSTEMS) == 16
assert set(INDEX['families']) == EXPECTED
assert AUDIT['starting_commit'] == SHA
assert AUDIT['checked_on'] == DATE
prefix = f'https://github.com/ethanwongwork/area/blob/{SHA}/'
checked_baseline = {}

def check_source(url):
    assert url.startswith('https://'), url
    if url.startswith(prefix):
        path, anchor = url[len(prefix):].split('#')
        match = re.fullmatch(r'L(\d+)(?:-L(\d+))?', anchor)
        assert match, url
        if path not in checked_baseline:
            content = subprocess.check_output(['git', 'show', f'{SHA}:{path}'], cwd=REPO, text=True)
            checked_baseline[path] = len(content.splitlines())
        first, last = int(match[1]), int(match[2] or match[1])
        assert 1 <= first <= last <= checked_baseline[path], url
    else:
        assert url in AUDIT['pages'], url
        assert AUDIT['pages'][url]['evidence_available'], url

options_count = proposals_count = observations_count = 0
for slug, family in INDEX['families'].items():
    page = ROOT / f'{slug}.md'
    assert page.exists(), slug
    body = page.read_text()
    assert re.findall(r'^## (.+)$', body, re.M) == SECTIONS, slug
    assert set(family['survey']) == SYSTEMS, slug
    check_source(family['area_manifest']['source'])
    check_source(family['area_spec'])
    for system, survey in family['survey'].items():
        assert survey['checked_on'] == DATE
        assert survey['searched_terms'] and survey['qualification']
        assert survey['catalogue'] in AUDIT['pages']
        assert survey['result'] in ('documented', 'not found')
        assert bool(survey['sources']) == (survey['result'] == 'documented')
        for url in survey['sources']:
            check_source(url)
    options = family['options']
    for oid, option in options.items():
        options_count += 1
        assert oid == option['axis'] + ':' + option['value']
        assert option['section'] in SECTIONS[1:4]
        assert option['area_has_it']['status']
        assert option['area_has_it']['sources']
        for url in option['area_has_it']['sources']:
            check_source(url)
        groups = {k: set() for k in ('direct', 'experimental', 'supporting', 'guidance', 'different_job')}
        for system, entries in option['systems'].items():
            assert system in SYSTEMS and entries
            assert len(entries) == len({(e['url'], e['evidence_kind']) for e in entries})
            observations_count += len(entries)
            for entry in entries:
                assert entry['checked_on'] == DATE
                check_source(entry['url'])
                kind = entry['evidence_kind']
                key = ('guidance' if kind == 'guidance' else 'different_job' if kind == 'different-job' else 'supporting' if kind in ('primitive', 'adjacent') else 'experimental' if kind == 'experimental-component' else 'direct')
                groups[key].add(system)
        for group in ('experimental', 'supporting', 'guidance'):
            groups[group] -= groups['direct']
        assert option['support'] == {k: sorted(v) for k, v in groups.items()}, (slug, oid)
        assert option['direct_system_count'] == len(groups['direct']), (slug, oid)
    for proposal in family['proposed_range']:
        proposals_count += 1
        assert proposal['layer'] in (2, 3)
        assert proposal['sources']
        assert proposal['selectors'] == proposal['option_ids']
        assert set(proposal['option_ids']) <= set(options)
        assert proposal['option_ids'] or proposal['id'] == 'retain-baseline-inventory'
        for url in proposal['sources']:
            check_source(url)
        groups = {k: set() for k in proposal['support']}
        for oid in proposal['option_ids']:
            for k, systems in options[oid]['support'].items():
                groups[k].update(systems)
        for group in ('experimental', 'supporting', 'guidance'):
            groups[group] -= groups['direct']
        assert proposal['support'] == {k: sorted(v) for k, v in groups.items()}, (slug, proposal['id'])

for page in [ROOT / f'{s}.md' for s in EXPECTED] + [ROOT / 'README-2.md']:
    for link in re.findall(r'\]\(([^)]+)\)', page.read_text()):
        if not link.startswith(('https://', '#')):
            assert link == 'verification-2.json' or (page.parent / link.split('#')[0]).exists(), (page.name, link)
        elif link.startswith(prefix):
            check_source(link)

for command in (['git', 'diff', '--name-only', SHA], ['git', 'ls-files', '--others', '--exclude-standard']):
    changed = subprocess.check_output(command, cwd=REPO, text=True).splitlines()
    assert all(p.startswith('docs/research/library-range/') for p in changed), changed
assert subprocess.check_output(['git', 'branch', '--show-current'], cwd=REPO, text=True).strip() == 'astra/library-range-2'
subprocess.run(['git', 'diff', '--check', SHA], cwd=REPO, check=True)
result = {
    'checked_on': DATE,
    'starting_commit': SHA,
    'families': len(EXPECTED),
    'systems_per_family': len(SYSTEMS),
    'options': options_count,
    'unique_source_observations': observations_count,
    'proposals': proposals_count,
    'external_option_source_urls': sum(v['used_for_options'] for v in AUDIT['pages'].values()),
    'result': 'pass',
    'checks': ['exact family set', 'required section order', '16-system dispositions', 'option evidence and dates', 'baseline paths and line bounds', 'deduplicated support counts', 'proposal option membership and counts', 'local links', 'branch and changed-file scope', 'git diff --check against baseline'],
    'limitations': 'Structural validation is not an independent semantic fact-check of source interpretation. Dated documentation may change.',
}
(ROOT / 'verification-2.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result))
