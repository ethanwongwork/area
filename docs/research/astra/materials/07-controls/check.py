#!/usr/bin/env python3
"""Read-only checks for the task 07 proposal, not a renderer or production test."""
import re
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = next(p for p in HERE.parents if (p / '.git').exists())
AREA = '6f896789a5200bcbd34fe87de458e60ca82141d6'
RESEARCH = '33e8ee40fc3aa86295920b77baef4771e1f86064'
ROLES = ('page', 'container', 'floating-surface', 'raised-control',
         'recessed-field-track', 'thumb-knob', 'indicator-fill', 'divider',
         'edge', 'glyph', 'text', 'scrim')
cache = {}
errors = []
pins = set()
links = set()

def require(condition, message):
    if not condition:
        errors.append(message)

def anchor(heading):
    return re.sub(r'[^\w\- ]', '', heading.lower()).replace(' ', '-')

for path in sorted(HERE.glob('*.md')):
    text = path.read_text()
    require(path.stat().st_size < 1_000_000, f'{path.name}: over size limit')
    for target in re.findall(r'\]\(([^)]+)\)', text):
        if target.startswith('https://'):
            match = re.fullmatch(r'https://github.com/ethanwongwork/area/blob/([0-9a-f]{40})/([^#]+)(?:#L(\d+)(?:-L(\d+))?)?', target)
            if not match:
                require('/tree/' in target, f'{path.name}: unpinned URL {target}')
                continue
            sha, file, start, end = match.groups()
            require(sha in (AREA, RESEARCH), f'{path.name}: unexpected snapshot {sha}')
            key = (sha, file)
            if key not in cache:
                cache[key] = subprocess.check_output(['git', 'show', f'{sha}:{file}'], cwd=ROOT, text=True).splitlines()
            if start:
                require(1 <= int(start) <= int(end or start) <= len(cache[key]), f'{path.name}: invalid bounds {target}')
                pins.add(target)
            else:
                require(file.endswith('.json'), f'{path.name}: source needs line pin {target}')
        elif not target.startswith(('http:', 'mailto:')):
            file, _, fragment = target.partition('#')
            dest = path.parent / file if file else path
            require(dest.is_file(), f'{path.name}: missing local link {target}')
            if fragment and dest.is_file():
                headings = re.findall(r'^#{1,6} (.+)$', dest.read_text(), re.M)
                require(fragment in {anchor(h) for h in headings}, f'{path.name}: missing anchor {target}')
            links.add(target)
controls = (HERE / 'controls.md').read_text()
for role in ROLES:
    require(f'### {role}\n' in controls, f'missing role {role}')
for field in ('light.angleDeg', 'light.heightDeg', 'relief.depthPx', 'softnessGain',
              'spreadDeltaPx', 'strengthGain', 'glow.strength', 'glow.source',
              'stops[]', 'angleDeg', 'stroke.opacity', 'body.transparency',
              'backdrop.blurPx', 'grain.strength', 'gloss.strength'):
    require(field in controls, f'missing requested control {field}')
architecture = (HERE / 'architecture.md').read_text()
for phrase in ('## Option A', '## Option B', '## Recommendation', 'emit/base.ts',
               'data-area-material-scope', 'surfaceControls', 'portal', '@property'):
    require(phrase in architecture, f'missing architecture section {phrase}')
readme = (HERE / 'README.md').read_text()
require(readme.startswith('**Question:**'), 'README must begin with Question')
require(readme.index('**Question:**') < readme.index('**Answer:**') < readme.index('**Snapshot:**'), 'README opening order')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pins)} pinned ranges in {len(cache)} immutable files; {len(links)} local links; {len(ROLES)} roles; requested controls and options; file sizes.')
print('This checks document integrity, not proposal correctness, rendering or approval.')
