#!/usr/bin/env python3
"""Validate run-1 catalogue integrity; no network, dependencies, or file writes."""
import json
import re
import subprocess
from pathlib import Path
from urllib.parse import urlparse

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
BASE = 'c585f8c5f38705a7efa79bf05148a8c6989b142a'
EXPECTED = set('''alert alignment-picker avatar badge badge-group box-field breadcrumb button
button-group calendar card checkbox chip code code-block color-field color-picker
color-swatch color-swatch-picker combobox command-palette composer context-menu dialog
field hover-card count indicator input input-group kbd'''.split())
SECTIONS = ['Job', 'Variant axes', 'Structural alternatives', 'Interaction patterns',
            'Area today', 'Proposed range', 'Sources']
STATUSES = {'yes', 'partial', 'not-found', 'owner-decision', 'not-applicable'}
COUNTED = {'component', 'composition', 'headless'}


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT, text=True)


index = json.loads((HERE / 'index-1.json').read_text())
check(index['starting_commit'] == BASE, 'Starting commit changed')
check(set(index['families']) == EXPECTED, 'Family scope differs')
check(len(index['systems']) == 16 and len(set(index['systems'])) == 16,
      'Required system count differs')
check(git('branch', '--show-current').strip() == 'astra/library-range-1',
      'Wrong branch')
check(set(p.stem for p in HERE.glob('*.md')) == EXPECTED | {'README-1'},
      'Unexpected or missing Markdown file')
readme = (HERE / 'README-1.md').read_text()
check(all(f']({family}.md)' in readme for family in EXPECTED),
      'README missing family navigation')

options = 0
native_records = 0
api_records = 0
source_urls = set()
area_sources = set()
for family, data in index['families'].items():
    markdown = (HERE / (family + '.md')).read_text()
    check(re.findall(r'^## (.+)$', markdown, re.M) == SECTIONS,
          family + ': section order differs')
    check(set(data['system_catalogue']) == (set() if family == 'count' else set(index['systems'])),
          family + ': required system missing')
    for system, record in data['system_catalogue'].items():
        check(record['sources'], family + ': no source/search record for ' + system)
        for source in record['sources']:
            check(source['checked'] == index['checked'], 'Missing checked date')
            check(urlparse(source['url']).scheme == 'https', 'Invalid source URL')
            check(source['url'] in markdown, family + ': source missing from Markdown')
            source_urls.add(source['url'])
        if record['kind'] == 'not-found':
            check('not found' in record['finding'], 'Unbounded absence statement')
            continue
        native_records += 1
        for category in ['axes', 'structural_alternatives', 'interaction_patterns']:
            for item in record[category]:
                check(item['sources'], family + ': unsourced native option')
                check(all(url in source_urls for url in item['sources']),
                      family + ': option source not registered')
        for item in record['api_enum_inventory']:
            api_records += 1
            check(item['values'] and item['source'] in source_urls,
                  family + ': unsourced/empty API enum')
    for key, option in data['options'].items():
        options += 1
        check(option['layer'] in {2, 3}, family + ': invalid layer')
        check(option['area_has_it'] in STATUSES, family + ': invalid Area comparison')
        check(option['sources'] and option['area_sources'], family + ': unsourced proposal')
        area_sources.update(option['area_sources'])
        count = 0
        for system, support in option['systems'].items():
            check(system in index['systems'], 'Unknown system')
            check(support['counted'] == (support['kind'] in COUNTED),
                  family + ': wrong counting rule')
            check(support['sources'], family + ': missing support evidence')
            count += support['counted']
        check(count == option['system_count'], family + ': support count mismatch')
        check(f'**{option["label"]}**' in markdown, family + ': missing proposal')
        check(f'**{count} systems**' in markdown, family + ': missing rendered count')
    for source in data['area']['sources']:
        area_sources.add(source['url'])

# Check cited Area paths/lines against the actual starting Git objects.
for url in area_sources:
    match = re.fullmatch(r'https://github.com/ethanwongwork/area/blob/(' + BASE + '|' + index['review_commit'] + r')/([^#]+)#L(\d+)', url)
    check(match is not None, 'Area evidence is not pinned to a file and line: ' + url)
    content = git('show', match[1] + ':' + match[2])
    check(1 <= int(match[3]) <= len(content.splitlines()), 'Invalid Area line: ' + url)

check(index['totals']['proposed_options'] == options, 'Option total mismatch')
check(index['totals']['observed_system_family_records'] == native_records,
      'Native record total mismatch')
check(index['totals']['api_enum_records'] == api_records, 'API record total mismatch')

# Check committed, unstaged and untracked paths without touching other worktrees.
changed = set(git('diff', '--name-only', 'origin/main').splitlines())
changed.update(git('ls-files', '--others', '--exclude-standard').splitlines())
check(all(path.startswith('docs/research/astra/library-range/') for path in changed),
      'Out-of-scope path: ' + ', '.join(sorted(changed)))
print(f'PASS: {len(EXPECTED)} families, {index['totals']['coverage_cells']} system checks, '
      f'{options} proposed options, {api_records} API enum records; '
      f'{len(source_urls)} external URLs and {len(area_sources)} pinned Area references. '
      'Section order, source presence, counting rules and path scope agree.')
