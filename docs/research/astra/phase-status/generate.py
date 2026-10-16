#!/usr/bin/env python3
"""Rebuild the approval evidence inventory from an immutable Git snapshot."""
import argparse
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
DEFAULT_SHA = '4c1854202a8e109479d5b83ef24a8325231da056'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--commit', default=DEFAULT_SHA)
parser.add_argument('--date', default='2026-10-07')
args = parser.parse_args()
def git(*argv):
    return subprocess.check_output(['git', '-C', str(ROOT), *argv], text=True)
sha = git('rev-parse', args.commit + '^{commit}').strip()
def read(path):
    return git('show', f'{sha}:{path}')
def cite(path, start=1, end=None, label=None):
    anchor = f'#L{start}' + (f'-L{end}' if end and end != start else '')
    return f'[{label or path + ":" + str(start)}](https://github.com/ethanwongwork/area/blob/{sha}/{path}{anchor})'
def hit(text, pattern):
    return next(i for i, line in enumerate(text.splitlines(), 1) if re.search(pattern, line))
def block(text, pattern):
    lines = text.splitlines()
    start = hit(text, pattern)
    end = next((i for i in range(start, len(lines)) if lines[i].startswith('## ')), len(lines))
    return start, end
def unverified(text):
    lines = text.splitlines()
    result = []
    for i, line in enumerate(lines):
        if re.search(r'Unverified\s*:', line, re.I):
            end = i + 1
            while end < len(lines) and lines[end].strip() and not re.match(r'^\s*(?:#{1,6} |[-*] |\d+\. |\|)', lines[end]):
                end += 1
            result.append({'line': i + 1, 'end': end, 'text': '\n'.join(lines[i:end])})
    return result

status_path = 'apps/docs/src/component-status.mjs'
pass_path = 'apps/docs/src/pass-status.mjs'
audit_path = 'docs/research/cohesion-audit.md'
status, passes, audit = map(read, [status_path, pass_path, audit_path])
batches_text = status.split('export const APPROVAL_BATCHES = [', 1)[1].split('];', 1)[0]
batches = [(name, re.findall(r"'([^']+)'", families)) for name, families in re.findall(r"name: '([^']+)', families: \[([^]]+)\]", batches_text)]
complete = set(re.findall(r"'([^']+)'", status.split('export const COMPLETE_COMPONENTS = new Set([', 1)[1].split(']);', 1)[0]))
validated = {}
for m in re.finditer(r'^  (?:"([^"]+)"|(\w+)): \{\n    date: "([^"]+)",\n    against: "([^"]+)",\n  \}', passes, re.M):
    validated[m[1] or m[2]] = {'date': m[3], 'against': m[4], 'line': passes[:m.start()].count('\n') + 1}
files = git('ls-tree', '-r', '--name-only', sha, 'docs/research/captures', 'docs/specs').splitlines()
families = [s for _, slugs in batches for s in slugs]
assert len(families) == len(set(families))
assert complete <= set(families) and set(validated) <= set(families)
records = []
for batch_no, (batch_name, slugs) in enumerate(batches, 1):
    for slug in slugs:
        path = f'docs/specs/{slug}.md'
        spec = read(path)
        visual = block(spec, r'^## Visual pass\b') if re.search(r'^## Visual pass\b', spec, re.M) else None
        captures = [p for p in files if p.startswith(f'docs/research/captures/{slug}/') and p.endswith('.json')]
        products = [p for p in captures if re.search(r'/(?:chatgpt|notion|figma|cursor)--', p)]
        references = [p for p in captures if not re.search(r'/area--', p) and p not in products]
        # Registry explicitly attests all three evidence steps; spec existence alone is insufficient.
        record = dict(slug=slug, batch=batch_no, batch_name=batch_name, spec=path,
                      spec_status=spec.splitlines()[2], audited=slug in validated,
                      visual=visual, products=products, other_references=references,
                      validated=validated.get(slug), owner=slug in complete,
                      unverified=unverified(spec))
        record['official'] = all([record['audited'], visual, products, record['validated'], record['owner']])
        records.append(record)

R = {r['slug']: r for r in records}
def local(slug):
    return f'[{slug}](#{slug})'
def spec_ref(slug, pattern):
    path = R[slug]['spec']
    a, b = block(read(path), pattern)
    return cite(path, a, b)
def quotes(entries, path):
    if not entries:
        return ['- `Unverified:`: not found (case-insensitive search of the entire linked spec).']
    result = []
    for entry in entries:
        result += [f'- Verbatim marker and continuation ({cite(path, entry["line"], entry["end"])}):', '',
                   *['  > ' + line for line in entry['text'].splitlines()], '']
    return result

official = sum(bool(r['official']) for r in records)
marker_count = sum(len(r['unverified']) for r in records)
answer = [
    f'- {len(records)} families in {len(batches)} batches: {official} have all four phases recorded; {len(records)-official} remain in review. See [batch evidence](#batch-evidence).',
    '- Disclosure and Alignment picker are closest by recorded phases: only owner approval is absent. Both have later edits than their validation dates; Alignment picker was explicitly reopened. See [closest to owner approval](#closest-to-owner-approval).',
    '- Six newer families lack an audited-pass attestation and a `pass-status.mjs` entry. [Tag](#tag) has a documented side-by-side; [Custom select](#custom-select) has a Visual pass but explicitly lacks a side-by-side screenshot. [Tag picker](#tag-picker), [Date picker](#date-picker), [Drawer](#drawer) and [Confirm dialog](#confirm-dialog) lack a Visual pass section.',
    '- Target-product capture files exist for every batch family except [Drawer](#drawer) (shadcn captures only) and [Confirm dialog](#confirm-dialog) (live measurements, product export not saved).',
    f'- The family specs retain {marker_count} `Unverified:` markers, including historical notes. [Most unverified](#most-unverified) distinguishes missing phase evidence from marker count; neither approval nor a passing build clears these notes.'
]
lines = ['# Phase status', '', '**Question:** Where does every family in `APPROVAL_BATCHES` stand in the four-step approval process, and what does its spec still label `Unverified:`?', '',
         '**Answer:**', '', *answer, '',
         f'**Snapshot:** `origin/main` at `{sha}`; checked {args.date} (America/Los_Angeles). Sources: {cite(status_path)}, {cite(pass_path)}, {cite(audit_path)}, each family’s pinned spec and tracked capture files below. No live product inspection or new validation was performed.', '',
         '## Method and interpretation', '',
         f'The four gates are audited spec, Visual pass section, target-product captures plus a recorded side-by-side, and owner membership in `COMPLETE_COMPONENTS`. Captures alone are half of phase 3; an older approval remains valid while earlier phases catch up. {cite(status_path, 58, 67)}', '',
         f'“Audited: recorded” uses an existing spec plus a `VALIDATED_PASSES` entry: the registry explicitly attests that all three evidence steps were done. This is a historical attestation, not a fresh audit of current code. The cohesion audit documents its original scope and later additions; an isolated mention of an inherited audit rule or passing audit tests is not evidence that a new family was audited. {cite(pass_path, 1, 12)} {cite(audit_path, 6, 12)} {cite(audit_path, 271, 277)} {cite(audit_path, 319, 339)}', '',
         '“Visual pass” means the named section exists, not that every theme/state is verified. “Product captures” means tracked JSON files in that family’s capture directory whose names identify ChatGPT, Notion, Figma or Cursor. Links below identify every counted file; Area captures and design-system captures are not counted as product captures. No capture contents containing personal data are copied into this report.', '',
         '“Side-by-side: recorded” means a validation entry exists. Spec-only comparisons are reported separately and do not silently fill the registry. Missing evidence means “not found” in the named spec, the complete pass registry and cohesion audit; it does not mean work could never have happened.', '',
         'Every `Unverified:` marker is retained case-insensitively with its source line and the wrapped paragraph continuation. Historical and potentially superseded notes are preserved, not asserted to be current failures. A spec with no such marker can still contain “not compared”, “not yet”, open questions or other limits. The count ranks written markers, not severity or individual checks.', '',
         '## Batch evidence', '']

for batch_no, (name, slugs) in enumerate(batches, 1):
    batch_line = hit(status, r"name: '" + re.escape(name) + "', families:")
    lines += [f'## Batch {batch_no} — {name}', '', f'Batch membership: {cite(status_path, batch_line)}.', '']
    for slug in slugs:
        r = R[slug]
        lines += [f'### {slug}', '', f'- Spec: {cite(r["spec"])}.']
        if r['audited']:
            v = r['validated']
            lines += [f'- Audited spec: **recorded**, through the validated-pass attestation ({cite(pass_path, v["line"], v["line"]+3)}).']
        else:
            lines += [f'- Audited spec: **not found**. Spec exists, but no family audit attestation in the {cite(pass_path, label="pass registry")} or {cite(audit_path, label="cohesion audit")}; inherited rules/test results in the spec do not establish this gate.']
        lines += [f'- Visual pass: **present** ({cite(r["spec"], *r["visual"])}).' if r['visual'] else f'- Visual pass: **not found** (entire {cite(r["spec"], label="spec")} searched for the named heading).']
        if r['products']:
            lines += [f'- Product captures: **yes**, {len(r["products"])} tracked files (pinned inventory below).']
        else:
            lines += [f'- Product captures: **not found** in `docs/research/captures/{slug}/`; {cite(r["spec"], 4, 7, "spec capture record")}.']
        if r['other_references']:
            lines += ['- Other reference files (excluded from product count): ' + '; '.join(cite(p, label=Path(p).name) for p in r['other_references']) + '.']
        if r['validated']:
            v = r['validated']
            lines += [f'- Side-by-side: **recorded {v["date"]}** — {v["against"]}. {cite(pass_path, v["line"], v["line"]+3)}.']
        else:
            special = {
                'tag': 'Spec describes a live Notion/Area side-by-side on 2026-10-06; **documented in spec, not registered**.',
                'custom-select': 'Spec compares against captures and explicitly says “not yet a side-by-side screenshot”; **not completed in the written record**.',
                'drawer': 'Spec records a shadcn/Area measurement comparison; **design-system comparison only**, with no target-product comparison recorded.',
                'confirm-dialog': 'Spec has a ChatGPT/Area measurement table, but no saved product capture or explicit live side-by-side claim; **not found**.',
                'tag-picker': 'Spec has product measurements and Area anatomy; an explicit live side-by-side claim is **not found**.',
                'date-picker': 'Spec has product measurements and Area anatomy; an explicit live side-by-side claim is **not found**.',
            }[slug]
            lines += [f'- Side-by-side: no {cite(pass_path, label="validation entry")}. {special} {cite(r["spec"], *(r["visual"] or (1, len(read(r["spec"]).splitlines()))))}.']
        owner_line = hit(status, r"'" + re.escape(slug) + r"'")
        lines += [f'- Owner approval: **{"yes" if r["owner"] else "no — in review"}** ({cite(status_path, owner_line)}).',
                  '- Phase position: **' + ('all four recorded; officially complete by these gates' if r['official'] else 'phases 1–3 recorded; awaiting owner approval' if r['audited'] else 'evidence phases incomplete; awaiting owner approval') + '**.']
        if slug == 'alignment-picker':
            lines += [f'- Freshness: reopened 2026-10-04 after responsive grid / hover-preview changes; validation remains 2026-09-28. The spec’s later implementation notes must be included in the owner review. {cite(status_path, 46, 48)} {spec_ref(slug, r"^## Feedback log")}']
        if slug == 'disclosure':
            lines += [f'- Freshness: validation is 2026-10-02, but the feedback log includes owner changes on 2026-10-06. Do not assume the prior comparison covers every later edit. {spec_ref(slug, r"^## Feedback log")}']
        lines += quotes(r['unverified'], r['spec']) + ['']
        if r['products']:
            lines += ['<details>', f'<summary>{len(r["products"])} pinned product capture files</summary>', '',
                      *['- ' + cite(p, label=Path(p).name) for p in r['products']], '', '</details>', '']

supplemental = []
for path in files:
    if path.startswith('docs/specs/') and path.endswith('.md') and Path(path).stem not in families:
        entries = unverified(read(path))
        if entries:
            supplemental.append({'spec': path, 'unverified': entries})
lines += ['## Supplementary specs outside the batch list', '',
          'These are supporting specs rather than additional approval families. Their markers are preserved for completeness; they are excluded from the family totals. Other non-family specs were also searched and had no `Unverified:` marker.', '']
for record in supplemental:
    lines += [f'### {Path(record["spec"]).stem}', '', *quotes(record['unverified'], record['spec']), '']

lines += ['## Proposals', '',
          '- Recommended: review Disclosure and Alignment picker first, checking the changes made after their recorded comparisons. This recommendation follows their existing three evidence gates; it does not grant approval.',
          '- Audit the six newer families explicitly. For Tag, reconcile the documented comparison with the pass registry once all prerequisites are confirmed. For the other five, finish the missing evidence before recording validation.',
          '- Keep a current verification checklist alongside historical `Unverified:` notes, marking resolved items with dated evidence. Do not delete history or treat the marker counts as a release-risk score.', '',
          '## Open questions', '',
          f'- Should Drawer’s shadcn comparison satisfy phase 3, or must it gain target-product evidence? The current definition specifically requires a target product; this report applies that definition. {cite(pass_path, 7, 11)} {spec_ref("drawer", r"^## Sources")}',
          f'- Which audit covers each new family? No dedicated attestation was found for Custom select, Tag, Tag picker, Date picker, Drawer or Confirm dialog in the audited sources. Their records above identify the gaps.',
          '- Which historical notes are superseded? For example, Panel, Color field, Color swatch, Color swatch picker, Input group and Badge group retain old comparison gaps alongside recorded later comparisons. This inventory preserves both and does not resolve the chronology into new approvals.', '',
          '## Reproduce and verify', '',
          'From the repository root, run:', '',
          '```sh', f'python3 docs/research/astra/phase-status/generate.py --commit {sha} --date {args.date}', '```', '',
          'The script resolves the repository relative to itself, reads only Git objects at the pinned SHA, and writes only this topic’s README and evidence.json. No dependencies, builds, product access or owner-status mutations are needed. `evidence.json` contains all capture paths and exact marker paragraphs for independent checking.', '',
          '## closest to owner approval', '',
          f'1. **{local("disclosure")} and {local("alignment-picker")}** tie by the formal record: audited spec, Visual pass, product captures and registered comparison are present; owner approval is absent. Disclosure’s comparison is newer. Both need the owner to consider post-validation edits; Alignment picker was explicitly reopened.',
          f'2. **{local("tag")}** follows by documented evidence: it has a Visual pass and a live product comparison, but no family audit attestation or validation entry. This is an inference about evidence proximity, not a claim that it is ready for approval.',
          f'3. **{local("custom-select")}** has captures and a Visual pass, but the spec explicitly stops short of side-by-side. {local("tag-picker")} and {local("date-picker")} lack the Visual pass heading as well. {local("drawer")} and {local("confirm-dialog")} also lack saved target-product captures.', '',
          '## most unverified', '',
          f'**By missing required evidence:** {local("drawer")} and {local("confirm-dialog")} have the broadest formal gaps: no audit attestation, no Visual pass section, no saved target-product captures and no registered comparison. Drawer does have measured shadcn evidence; Confirm dialog records a blocked export. This ranks documentation gaps, not implementation quality.', '',
          f'**By retained marker count:** the maximum is {max(len(r["unverified"]) for r in records)} markers per family: ' + ', '.join(local(r['slug']) for r in records if len(r['unverified']) == max(len(x['unverified']) for x in records)) + '. Each is quoted in full above, including earlier notes that may have been superseded.', '',
          f'**Coverage:** {marker_count} markers across {sum(bool(r["unverified"]) for r in records)} family specs, plus {sum(len(r["unverified"]) for r in supplemental)} markers in supporting specs. ' + ', '.join(local(r['slug']) for r in records if not r['unverified']) + ' have no literal marker; that is not a claim of exhaustive verification.', '']
data = {'snapshot': sha, 'checked': args.date, 'families': records, 'supplemental': supplemental}
for name, contents in [('README.md', '\n'.join(lines)), ('evidence.json', json.dumps(data, ensure_ascii=False, indent=2) + '\n')]:
    assert len(contents.encode()) < 1_000_000
    (OUT / name).write_text(contents)
print(json.dumps({'families': len(records), 'batches': len(batches), 'official': official, 'audited_recorded': len(validated), 'visual_sections': sum(bool(r['visual']) for r in records), 'product_capture_families': sum(bool(r['products']) for r in records), 'family_markers': marker_count, 'supplemental_markers': sum(len(r['unverified']) for r in supplemental)}, indent=2))
