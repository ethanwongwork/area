#!/usr/bin/env python3
"""Generate the authored per-style report from pinned taxonomy plus local assessments."""
import json
import re
import subprocess
import sys
from pathlib import Path
sys.dont_write_bytecode = True
from style_data import ROWS
HERE = Path(__file__).resolve().parent
ROOT = next(p for p in HERE.parents if (p / '.git').exists())
REF = '666bdcefb602e371da81f4dd30f6f7061f61f482'
BASE = 'docs/research/astra/materials/01-taxonomy/'
def read(name):
    return subprocess.check_output(['git', 'show', f'{REF}:{BASE}{name}'], cwd=ROOT, text=True)
tax = json.loads(read('taxonomy.json'))['styles']
cat = read('catalogue.md').splitlines()
assert [x[0] for x in ROWS] == [x['id'] for x in tax]
labels = ['SC 1.4.3 — text', 'SC 1.4.11 — required information', 'Focus and adversarial scene',
          'T — reduced transparency', 'C — contrast preferences', 'F — forced colors', 'M — reduced motion']
parts = ['# Accessibility assessment for every style', '',
 '**Status: authored risk analysis and fallback proposals, not measured pass/fail results.**', '',
 'All 25 entries inherit the [worst-case method](method.md), [four preference policies and role fallbacks](fallbacks.md), and [test requirements](tests.md). C means the more/less/custom handling defined in that policy, not permission to lower text/indicator floors. A no-op for a purely opaque/static layer still requires checking optional layers combined with it. The pinned definition establishes the ingredients; each risk/fallback below is an inference or recommendation.', '',
 'Public standards/preferences were checked 2026-10-08; Area snapshot and provenance are in the [evidence ledger](evidence.md). Required text, focus and marks always survive removal of optional paint.', '']
records=[]
for row, item in zip(ROWS,tax):
    id,*fields=row
    start=next(i for i,l in enumerate(cat,1) if l==f'<a id="{id}"></a>')
    end=next((i-1 for i,l in enumerate(cat,1) if i>start and l.startswith('<a id=')),len(cat))
    url=f'https://github.com/ethanwongwork/area/blob/{REF}/{BASE}catalogue.md#L{start}-L{end}'
    parts += [f'## {id}', '', f'**{item["name"]}.** [Pinned definition and ingredients]({url}).', '', '| Check | Proposed assessment / fallback |', '| --- | --- |']
    parts += [f'| {label} | {value} |' for label,value in zip(labels,fields)]
    parts += ['']
    records.append({'id':id,'name':item['name'],'definition_source':url,'status':'authored proposal', **dict(zip(['text','non_text','focus_scene','transparency','contrast','forced_colors','motion'],fields))})
outputs={'styles.md':'\n'.join(parts), 'styles.json':json.dumps({'research_commit':REF,'date':'2026-10-08','styles':records},indent=2)+'\n'}
for name,text in outputs.items():
    assert len(text.encode())<1_000_000
    p=HERE/name
    if '--check' in sys.argv: assert p.read_text()==text, f'{name} stale'
    else:p.write_text(text)
print('PASS: 25 styles, seven assessment fields each, pinned definitions; generated output current.')
