"""Apply review status to historical prose; never replace its findings.
Idempotent, section-local callouts. Run after a historical report generator.
"""
from pathlib import Path
import json,re
H=Path(__file__).resolve().parent;M=H.parent
D={
'D1':'Area’s calm no-cast/Trace-only expression is the None default, not a material ceiling. Contrast, focus, fixed hover ink and semantic meaning remain hard limits.',
'D2':'Material sits beside Surface; recipe structure switches with inherited 0/1 gate tokens. Surface shadows require a pixel-identical split into adjustable parts, including Tooltip/Toolbar literal exceptions. Selector-switched recipes alone are not nested-scope safe.',
'D3':'Ordinal caps and provisional control ranges are not limits. Numeric per-role strength multipliers and bounds must be calibrated to the board and contrast-tested at extremes; that work is pending tasks 20–22.',
'D4':'The first set is None identity (default), Glass, Tactile and Soft. Paper needs an opaque rebuild; Aero, Glow and Prism are later finishes.',
'D5':'Decorative colors derive from accent, neutral and tones; literal palette hexes are not the future preset contract.',
'D6':'The current vocabulary has 13 roles including row-plate; 04/05 now cover 101 contracts. Historical 12-role/78-contract counts below describe their original snapshot only.',
'D7':'Floating shells assume arbitrary backdrops; failing edges use opaque F0. App-level transparency reduction sits beside the OS query. Forced colors explicitly sets opaque Canvas and backdrop-filter:none.',
'D8':'Frost plus rim is baseline; native SVG backdrop refraction is a later Chromium-only enhancement. A historical unverified run is not a support verdict.',
'D9':'Figma Glass parameter names govern the next API. Light angle is 0 at top, clockwise; the historical 0-at-right angle convention below is superseded, not silently reinterpreted.',
'D10':'The dark page may take tint/texture only within a fixed distance of #020202 (neutral 975); a numeric bound is not yet calibrated.',
'D11':'Inner rims keep the radius floor at every setting except Sharp. Historical max(0, outer-inset) examples and tabulated square inner rims are retained but superseded.',
'D12':'Cutout rings and fixed-color fades become real transparent gaps through masks; separately required occlusion and contrast paint remain functional.',
'D13':'No automatic effects on glyphs or small text; display text and button labels may explicitly opt in. A curated duotone pilot is later work.',
'D14':'Performance rules must follow measured workloads, not universal no-row-blur/static-only caps. Owner names a 60Hz minimum device; a later rerun includes Firefox.',
'D15':'Internal positioning is “the broadest multi-material layer with separable controls”; no public claim until it ships.',
'D16':'Material does not change geometry, typography or foreground ink. Multi-axis choices are bundles, not a material axis.'}
# Target exact sections. Preserved source measurements in evidence/benchmark files are not rewritten.
TARGETS={
'01-taxonomy/layer-model.md':{'*':['D1','D2','D9','D13','D16']},
'02-prior-art/README.md':{'## Verdict':['D15'],'## Proposals':['D15']},
'03-css-cookbook/area-integration.md':{'*':['D1','D2','D3','D6','D11','D12','D13','D16']},
'03-css-cookbook/cookbook.md':{'## T10':['D11'],'## T09':['D8']},
'04-role-map/README.md':{'## Evidence':['D6'],'## Findings':['D1','D2']},
'05-absorption/policy.md':{'##':['D1','D2','D3','D6','D7','D10','D11','D12','D13','D14','D16']},
'05-absorption/README.md':{'## Main decisions':['D1','D3','D6','D14'],'## Open questions':['D1','D2','D3'],'## Proposals':['D1','D2','D3','D6','D14']},
'07-controls/architecture.md':{'## Option A':['D2'],'## Option B':['D2'],'## Recommendation':['D2'],'## What derives':['D2','D9'],'## Scope':['D2'],'## React':['D2','D3','D9','D16'],'### Structural recipe':['D2']},
'07-controls/controls.md':{'## Global':['D2','D3','D9','D16'],'## Per-role':['D1','D3','D6','D13','D14'],'## Resolution':['D2','D3']},
'07-controls/README.md':{'## Proposals':['D1','D2','D3','D9','D16']},
'08-accessibility/tests.md':{'*':['D1','D3','D6','D7']},
'09-dark-density/rules.md':{'## Dark':['D1','D10'],'## Scaling':['D1','D3','D14'],'## Concentric':['D11'],'## Proposed':['D11']},
'09-dark-density/geometry.md':{'## Concentric':['D11']},
'09-dark-density/styles.md':{'## Every radius':['D11']},
'10-states/policy.md':{'## State ownership':['D6','D7','D12'],'## Role and family':['D1','D3','D6','D13','D14'],'## Motion':['D14']},
'11-performance/budgets.md':{'*':['D1','D3','D6','D14'],'## Family':['D1','D3','D6','D14'],'## Release':['D3','D14']},
'11-performance/README.md':{'**Answer:**':['D1','D3','D14'],'## Findings':['D1','D3','D14'],'## Proposals':['D1','D3','D14']},
'12-glyphs-text/legibility.md':{'*':['D1','D13']},
'13-presets/contract.md':{'*':['D1','D2','D3','D4','D5','D6','D7','D9','D11','D12','D13','D14','D16']},
'13-presets/combinations.md':{'## Resolution':['D1','D2','D4','D5']},
'14-tooling/builder.md':{'## Live':['D1','D3','D6','D9','D13'],'## Data flow':['D2','D9','D16'],'## Shareable':['D4','D6','D9']},
'14-tooling/acceptance.md':{'*':['D2','D3','D6','D9','D16']},
'15-consistency/findings.md':dict({'*':['D1','D3','D6','D14']}, **{f'## C{i:02}':['D1','D3','D14'] for i in range(2,8)}),
'15-consistency/agreements.md':{'*':['D1','D3','D6','D14']},
'15-consistency/clarifications.md':{'*':['D1','D2','D3','D6','D9','D14']},
'16-specimen/limitations.md':{'*':['D1','D3','D4','D7','D9','D13','D14'],'## Cross-cutting':['D1','D3','D14']},
'14-tooling/exports.md':{'## Plain CSS':['D2','D6','D9','D16']},
'16-specimen/README.md':{'## Proposals':['D1','D3','D4','D7','D9','D13','D14']},
'18-contrast-harness/README.md':{'## Proposals':['D4','D6','D7']},
}
def annotate(rel, s):
 """Return deterministic decision callouts without editing a file."""
 s=re.sub(r'\n<!-- task19-superseded .*?<!-- /task19-superseded -->\n','\n',s,flags=re.S)
 # A removed block leaves adjacent blank lines. Normalize only around headings/markers.
 s=re.sub(r'\n{3,}', '\n\n', s)
 lines=s.splitlines();out=[];used=set();records=[]
 for i,line in enumerate(lines):
  out.append(line)
  for anchor,ids in TARGETS.get(rel,{}).items():
   if (anchor=='*' and i==0) or (anchor!='*' and line.startswith(anchor) and anchor not in used):
    used.add(anchor);marker=rel+' '+anchor
    out+=['',f'<!-- task19-superseded {marker} -->',f'> **Superseded policy — {", ".join(ids)} (owner, 2026-10-11):** '+ ' '.join(D[d] for d in ids)+' The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).','<!-- /task19-superseded -->','']
    records.append(dict(file=rel,anchor=anchor,decisions=ids))
 return re.sub(r'\n{3,}', '\n\n', '\n'.join(out)+'\n'),records

def main():
 records=[]
 for rel in TARGETS:
  p=M/rel;s,found=annotate(rel,p.read_text());p.write_text(s);records+=found
 (H/'decision-overrides.json').write_text(json.dumps(dict(checked='2026-10-11',decisions=D,passages=records),ensure_ascii=False,indent=2)+'\n')
 missing=[(r,a) for r,ts in TARGETS.items() for a in ts if not any(x['file']==r and x['anchor']==a for x in records)]
 assert not missing,missing
 print('Annotated',len(records),'local passages; all anchors matched.')

if __name__=='__main__': main()
