**Question:** How should every material style translate to Area's near-black dark page, scale across compact density and sm/md/lg, and retain concentric rims from Sharp through Pill?

**Answer:** Keep the near-black page and establish hierarchy with semantic surface planes and readable edges; use local rim light or lighter tops where the material calls for them.
Retain useful dark cast shadows rather than converting every shadow to white glow; Apple, Fluent and current M3 guidance support distinct but compatible approaches to dark hierarchy.
All 25 styles have explicit dark translations and separate shadow, glow, highlight and stroke policies, plus a 225-cell style-by-radius matrix.
Scale local modeling from each part's painted dimensions; keep role-owned floating casts and functional strokes independent of density.
Compact reduces optional layer count and halo reach before weakening boundaries or making glass more transparent; static marks and thumbs often retain their dimensions.
The calculated geometry covers all nine settings × both densities × sm/md/lg, with finite surface corners, separate list radii and pill-override exceptions.
Concentric rims subtract inset from the used outer radius; nested component floors are a separate contract and must not distort same-body rims.
These are uncalibrated research proposals, with no implementation, visual approval or new preset values.

**Snapshot:** checked **2026-10-09** (America/Los_Angeles), after `git fetch origin`. Area `origin/main`: [`6f896789a5200bcbd34fe87de458e60ca82141d6`](https://github.com/ethanwongwork/area/tree/6f896789a5200bcbd34fe87de458e60ca82141d6). Research/brief/input snapshot: [`817c9eeeedacf7a5e477289d44f38f8e4f15f103`](https://github.com/ethanwongwork/area/tree/817c9eeeedacf7a5e477289d44f38f8e4f15f103/docs/research/astra/materials). Public sources: Apple HIG Dark Mode, Fluent 2 Elevation/Shapes, M3 Color roles and Android theming documentation, W3C rounded-border geometry; all checked 2026-10-09. Apple and M3 guidance was read in rendered public browser pages. Area production source was read at the pinned main commit, not the research checkout's older production tree. No product capture or rendered Area material experiment was performed.


<!-- task19-changes -->
## Changes after review — 2026-10-11

Task 19 corrections, with the reason from [Corrections for Astra and D1–D16](../REVIEW.md). Older Answer/Snapshot passages below retain their original date and findings unless explicitly refreshed; the changes here and decision callouts govern subsequent work.

- **C15 — Review reason:** Scope re-emission citation pointed at the wrong file. **Change:** Corrected the pinned 163–174 citation from emit/base.ts to emit/css.ts. Marked historical square inner rims/radius arithmetic superseded by D11 and dark/scaling policy by D1/D3/D10/D14. Files: [evidence.md](evidence.md), [rules.md](rules.md), [geometry.md](geometry.md), [styles.md](styles.md). Decisions: D1, D3, D10, D11, D14.

Full change ledger and verification: [19-corrections](../19-corrections/README.md).
<!-- /task19-changes -->

## Evidence and reading order

1. [Evidence ledger](evidence.md): dated public guidance and pinned Area facts, including the compact surface-inset discrepancy.
2. [Shared rules](rules.md): dark translation, exact size factors, twelve-role absorption inherited from task 05, channel-specific scaling, concentric geometry, override exceptions and proposed acceptance checks.
3. [All 25 styles](styles.md): explicit channel policies and all nine radius settings for each style. [Machine-readable policies](styles.json).
4. [Calculated geometry](geometry.md): 54 control cases plus 18 surface/list cases, with example inner-rim calculations. [Machine-readable geometry](geometry.json).

The three evidence classes remain separate: **observed** Area/source rules; **calculated** arithmetic consequences of pinned geometry; **proposed** dark recipes and scaling policy. No screenshot-derived dimensions or invented native Apple/Microsoft rendering constants appear here. All numeric gains are ratios or illustrative geometry, not measured visual tuning.

Current radius labels are `0`, `2`, `4`, `6`, `8`, `10`, `12`, `14`, `pill`; Sharp is the descriptive name of `0`. Optional pill flags and intrinsically round parts mean a Sharp theme does not make every visual part square. The report treats that behavior as an explicit exception, not permission for materials to choose a different radius. [Evidence](evidence.md#density-and-geometry-inputs).

## Proposals

**Option A — recommended:** retain Material beside Surface, as proposed in task 07. Theme supplies semantic dark paint, UI/Radius supply geometry, Material supplies local optical modeling, and Surface retains decorative-width/cast ownership. Derive cross-axis outputs and re-emit at scopes/painted-part boundaries without registering derived colors. This preserves existing role hierarchy and lets compact simplify effects without altering functional sizes or contrast gates. [Contract and acceptance checks](rules.md).

**Option B:** multiply every shadow, glow, stroke and highlight by control height and invert light shadow ink for dark mode. It is mechanically simple, but conflicts with fixed painted marks, role-owned floating elevation, required strokes, dark Card behavior and the separate semantics of reflection/emission. Do not adopt it. [Observed counterexamples](evidence.md#area-dark-and-ownership-constraints).

For later calibration, compare the proposed local-geometry policy with a discrete, authored sm/md/lg optical ladder. The discrete ladder may improve pixel-level results, but needs measured examples per role; current evidence cannot justify a numeric ladder. Retain the shared equations as a starting hypothesis and test small dense compositions before adopting values.

## Reproduce and validation

From the repository root, run the commands below. Each script also locates the root relative to its own file, so it can be invoked by absolute path from another directory:

```sh
python3 docs/research/astra/materials/09-dark-density/build.py
PYTHONDONTWRITEBYTECODE=1 python3 docs/research/astra/materials/09-dark-density/render_styles.py
python3 docs/research/astra/materials/09-dark-density/check.py
```

`build.py` reads the pinned Git source and derives geometry; `render_styles.py` renders authored policy data in taxonomy order; `check.py` validates coverage, line bounds, local links, sizes and independent geometry invariants. Neither script edits production. Data files stay under 1 MB. Validation is document/arithmetic integrity, not browser appearance, contrast certification or product approval. No production tests were run for this research-only change.

## Open questions

- **Not found:** vendor or Area measurements defining one compact multiplier across all 25 styles. Looked in the brief, tasks 01/03/05/07/08, current axes/component/spec sources and the public guidance in the ledger. Local optics still need calibration; no opacity/blur/strength defaults can be approved from this report.
- **Not found:** an approved Area implementation of the proposed material renderer or shared squircle rim model in the inspected sources. Continuous-curvature board descriptions cannot establish browser geometry.
- How much gloss and rim contrast remains comfortable on actual near-black hardware across neutral casts and accessibility preferences? Task 08's worst-case contrast method remains binding; these recipes have not been browser-tested.
- Should a future discrete size ladder replace G for specific local relief profiles after measurements? Static marks, thin tracks, letterforms and broad surfaces need independent references either way.
- Should the prose about fixed compact surface insets be corrected to the emitter? This report records both sources without modifying policy or code.
- Board images remain unavailable. Item 6 provides printed values but not all angles/stops; no visual match or extrapolated dark recipe is claimed.
