"""Render the audit's authored prose; writes only task 15. --check is read-only."""
from pathlib import Path
import re, sys
HERE=Path(__file__).resolve().parent
SHA='b0768c8d809946b82d6b00139ecc33fe4e57f528'
MAIN='3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e'
def emit(name,text):
 def pin(m):
  path,lo,hi=m.group(1),m.group(2),m.group(3)
  return f'[{path}:{lo}'+(f'–{hi}' if hi else '')+f'](https://github.com/ethanwongwork/area/blob/{SHA}/docs/research/astra/materials/{path}#L{lo}'+(f'-L{hi}' if hi else '')+')'
 text=re.sub(r'\[\[([^:]+):(\d+)(?:-(\d+))?\]\]',pin,text.strip())+'\n'
 assert len(text.encode())<1000000
 if '--check' in sys.argv: assert (HERE/name).read_text()==text,name
 else:(HERE/name).write_text(text)
emit('README.md',r'''
# Materials 15 — consistency audit

**Question:** Do materials tasks 01–14 agree on vocabulary, inventory, control semantics, role budgets, accessibility and states? Which conflicting statement should govern the next revision?

**Answer:** The headline inventory agrees: **25 styles, 12 roles, 78 contracts and 626 parts**.
Seven concrete contract conflicts remain: global inheritance and six groups of preset-versus-budget conflicts.
Task 13's role records need reconciliation with 07's global controls and 11's effect budgets; copying them unchanged into an exporter would preserve those conflicts.
Task 08's fallbacks and 10's states agree when preference gates run last; later wording and serialization leave eight additional ambiguities to settle.
Keep 07's inheritance, 08's accessibility priority and 11's stricter role budgets; revise requested recipes or report their suppression explicitly.
All findings have both source locations and a recommended winner. Earlier folders are unchanged.

**Snapshot:** Checked **2026-10-10**, America/Los_Angeles. Research input **b0768c8d809946b82d6b00139ecc33fe4e57f528** (`origin/astra/research` fetched at start); Area main **3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e**. Brief and tasks 01–14 are the audit corpus. Research comparisons pin the former SHA; production shadow facts below pin the latter. Prior reports' older Area snapshots remain historical evidence. This does not remap 626 parts against a newer manifest or revalidate public sources, browser performance, WCAG compliance or product approvals.

## Evidence

- [Contradictions](findings.md): **C01–C07**, with conditions, affected presets, both pins and which side should win.
- [Ambiguities and missing bridges](clarifications.md): **A01–A08**. These need an explicit contract, but are not counted as proven contradictions.
- [Agreements, crosswalks and review coverage](agreements.md): all fourteen chapters, canonical names/counts, 07→13→14 controls, every role's 05→11 cap, and 08→10 preference/state composition.
- [Checks](checks.json): independent structural totals and all 192 requested preset/role/mode effect summaries. [Input ledger](inputs.json): byte sizes and SHA-256 for all 149 tracked input files, including 30 parsed JSON files. A hash proves which bytes were audited, not that a renderer obeys the prose.

Evidence was read at three levels: report/policy prose, canonical structured records, and generators/fixtures where they define the disputed behavior. Generated inventories were traversed as data rather than treating repeated rendered tables as independent evidence. The review distinguished source examples, measurements, authored defaults, effective guards and future acceptance tests. Scope includes the fourteen reports and their supporting records; it does not claim a formal proof that no other natural-language ambiguity exists.

Re-run from repository root with Python 3, without external dependencies:

```sh
python3 docs/research/astra/materials/15-consistency/audit.py --check
python3 docs/research/astra/materials/15-consistency/write_report.py --check
```

Omit `--check` only to regenerate this folder's artifacts. The inventory checker requires tasks 01–14 to match the pinned input byte-for-byte, checks style/role sets, counts, complete control shapes, pair coverage and the shared Glass content/hash, and verifies research citation line bounds. It does **not** automatically detect semantic contradictions, implement guard resolution or certify target exports. Findings are human-authored analysis; numeric effect summaries count task 13's requested layers before guards.

## Proposals

Recommended authority order for a later reconciliation: existing Area semantics and required paint → task 08 preference/contrast gates → task 11 role budgets intersected with 05 family/nesting caps → 07 input/inheritance contract → 13 requested seeds → 14 serialization/adapters. Keep requested values inspectable, but export effective paint only after every guard. This precedence is proposed, not adopted code or owner approval.

Resolve C01 before implementing global controls, and C02–C07 before using task 13 as effective paint. Turn each finding into a fixture that selects a real receiver, Surface preset, mode and override. The alternative is to revise 11's budgets after actual component measurements; task 11 explicitly labels those caps provisional. Merely liking a preset or passing JSON validation is not evidence for that exception.

Validation passed: this audit’s structural/witness checks, deterministic report generation, citation bounds and local links; tasks 13 and 14 also passed their existing `build.py --check` runs. Their success establishes artifact integrity, not resolution of the findings.

No fixes were made in 01–14, production code, component specs, status or handoff. Only this topic and the research index change.

## Open questions

Which reviewed receivers, if any, should get exceptions to task 11? What explicit inheritance codec and versioned export schema should carry unset/reset/zero? Does the small-display exception deliberately revise the large-inscription limit? These are concrete choices in the findings, not requests blocking publication of this audit.
''')
emit('findings.md',r'''
# Confirmed conflicts and recommended winners

All seven findings compare proposals at the README's pinned research snapshot. **Conflict** means the same proposed receiver/action cannot obey both statements as written. C02–C07 concern requested preset seeds versus proposed effective budgets: they are not claims that a shipped Area component currently violates performance requirements. Both light and dark are affected unless stated otherwise. A resolver could suppress the request, but task 13's listed effective gates do not explicitly include 11; 14 must not mistake serialization fidelity for policy conformance. [[13-presets/contract.md:7-17]] [[11-performance/budgets.md:3-9]]

## C01 — Complete role replacement defeats global inheritance

**Side A:** 07 says role override presence is separate from the recipe default; absent override uses the global value at the receiver, and recipe defaults must not block later global input. 14 promises live global controls and “Clear means inherit.” [[07-controls/architecture.md:25-27]] [[14-tooling/builder.md:9-14]] [[14-tooling/builder.md:30-32]]

**Side B:** 13 says `globalControls` is the floating-surface starting profile, then complete role objects replace it. Every leaf is present, even inactive ones. Its generator copies complete resolved controls into both places; there is no override-presence record. [[13-presets/contract.md:7-13]] [[13-presets/build.py:27-33]]

**Reproduction:** Edit Glass global `backdrop.blurPx` from 5 to another otherwise permitted trial value without editing its floating-surface row. Literal complete-role replacement restores 5; 07's absent-override contract would use the edited global value. This is a control-flow example, not a recommendation for a new blur radius. Complete inactive leaves are useful reset data but cannot simultaneously mean “explicit user override” and “inherit.”

**Winner: 07's inheritance contract, reinforced by 14's builder.** Retain 13 as a fully expanded *recipe baseline*, separate from user patch presence; explicitly define how global edits affect eligible baseline channels before role patches and guards. Preserve reset/zero distinctions. A different valid option is to abandon global inheritance and make global editing an explicit multi-role operation, but that would revise 07 and 14 and must say which rows it changes. Do not silently treat every baseline scalar as an override.

## C02 — Container relief/halo can exceed the combined two-lobe cap

**Side A:** 11 caps a container at two permitted Surface/relief lobes and explicitly counts cast, inset relief and blurred glow together. [[11-performance/budgets.md:9-14]]

**Side B:** Soft/Tactile containers add two inset lobes while retaining an existing bound Surface cast. Glow adds one blurred halo while retaining that cast. The two-inset interpretation and unchanged cast policy are explicit, not inferred from screenshots. [[13-presets/model.py:20-23]] [[13-presets/model.py:39-40]] [[13-presets/model.py:67-82]] [[13-presets/contract.md:25-39]]

**Affected contexts:** Soft/Tactile with a one-lobe Panel cast produce at least three counted lobes; with the two-lobe light Card recipe, four. Glow on that light Card produces three. A no-cast container or dark Card is not the same counterexample; Glow plus a one-lobe Panel cast totals two and fits this particular cap. Existing production definitions: [Surface source:17–18, 48–53](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/packages/tokens/src/axes/surface.ts#L17-L53).

**Winner: 11's total budget, while retaining existing Surface eligibility/paint.** Remove or simplify optional local modeling until it fits the remaining allowance; do not drop an existing permitted Surface lobe merely to make room for a preset. Count after binding a real container and mode, not from the generic role alone. A separate measured exception remains possible.

## C03 — Floating recipes add lobes beyond the existing two-lobe float

**Side A:** 11 specifies the existing two-lobe `shadow-float`, a ring and an optional static tile; its total-count rule includes inset and glow. Tooltip/Toolbar have separate documented exceptions. [[11-performance/budgets.md:9-15]]

**Side B:** Soft and Tactile floating shells add the two-lobe relief model; Glow adds a blurred halo. Their cast remains the existing bound float. [[13-presets/model.py:20-23]] [[13-presets/model.py:29-40]] [[13-presets/model.py:67-82]] [[13-presets/contract.md:37-39]]

**Result:** On an ordinary non-Flat overlay, Soft/Tactile request four counted lobes, Glow three. This is not excused by “one cast owner”: owner count and lobe count are different. It does not assert the same result for Flat or the named exceptions.

**Winner: 11.** Preserve the existing float recipe, use a permitted rim/static reflection if independently allowed, and suppress extra inset/halo lobes. If 13 intends a richer floating budget, it must explicitly propose and measure that exception rather than silently expanding the baseline.

## C04 — Five thumb recipes exceed a single nonblurred highlight/rim

**Side A:** 11 allows the existing single `shadow-1` plus at most one nonblurred highlight/rim. [[11-performance/budgets.md:18-18]]

**Side B:** Glass thumb has a gradient edge plus separate gloss. Soft has paired inset relief, bevel and softened gloss; Tactile has paired relief, double rim and gloss. Aero has gradient double rim, separate body reflection and softened gloss. Glow has a 2px-softness halo. These are distinct enabled channels in the model and render order. [[13-presets/model.py:18-23]] [[13-presets/model.py:58-82]] [[13-presets/contract.md:37-47]]

**Result:** All five exceed the named highlight/rim allowance; Soft/Glow additionally request blurred relief or halo; Aero’s gloss-softness primitive remains unspecified (A08), and its multiple distinct reflection/edge layers already exceed the allowance. The existing permitted cast is not the problem. Paper's single rim and Prism's single gradient ring do not fail this comparison. Actual clearance and aliases may suppress effects further, but cannot make the full requested stacks the stated budget.

**Winner: 11.** Select one nonblurred highlight/rim for each thumb; omit optional blurred gloss, halo and extra relief. A combined single highlight design would be a new defined recipe, not permission to concatenate the current layers. Preserve handle geometry and travel.

## C05 — Soft divider uses blurred relief where only unblurred engraving is allowed

**Side A:** 11 explicitly allows zero blurred lobes on a divider, at most a two-line unblurred engraved pair. [[11-performance/budgets.md:20-20]]

**Side B:** `soft-rule` inherits `relief.softnessPx: 2`; its rule branch lowers depth to .5 and removes gloss but does not reset softness. Divider resolution removes the stroke, not the relief. [[13-presets/model.py:67-70]] [[13-presets/model.py:89-94]]

**Winner: 11.** A future Soft divider must use an unblurred pair or the unchanged structural line. Tactile's zero-softness paired divider fits this rule where space permits. Do not remove required division to meet the cap.

## C06 — Independent edge recipes add relief or halo outside the ring budget

**Side A:** 11 budgets one solid or decorative gradient ring for the edge role. The introductory total-count rule prevents renaming relief/glow to evade an effect cap. [[11-performance/budgets.md:9-9]] [[11-performance/budgets.md:21-21]]

**Side B:** An independent Soft edge retains two softened relief lobes; a Glow edge retains a 4px-softness halo alongside its optional stroke. Edge resolution removes body/gloss/body-reflection but leaves relief/glow. [[13-presets/model.py:67-82]] [[13-presets/model.py:89-94]]

**Scope:** 13 correctly says an edge alias reuses its parent's resolved perimeter, so this finding is about an independently painted edge, not a second effect pass on every `root.edge` record. Trace reduction can remove Soft's optional stroke but still leaves the relief model. [[13-presets/contract.md:55-64]]

**Winner: 11 for independent edge paint.** Resolve to the single permitted ring. If a decorative emitter needs a halo, it needs explicitly reviewed eligibility and ownership; do not reclassify a required edge solely to evade its budget. “0 blur” in 11's introduction means backdrop filtering, so this finding relies on the ring allowance, not on misreading that phrase as a universal shadow-blur prohibition.

## C07 — Glow grants a semantic-indicator halo without the stricter decorative opt-in

**Side A:** 05 permits a supplementary Trace halo/rim around an unchanged semantic core. 11 later tightens this to zero new blurred glows by default, with one small static halo only for an **explicitly decorative indicator**, separate from its semantic core. This is a deliberate cap refinement between 05 and 11. [[05-absorption/policy.md:32-32]] [[11-performance/budgets.md:19-19]]

**Side B:** Glow selects `glow-indicator`, enables a 2px-softness halo, and describes it as supplementing a selected/status mark. The guard requires clearance and excludes literal color data, but does not require explicit decorative-indicator designation. [[13-presets/model.py:23-23]] [[13-presets/model.py:33-33]] [[13-presets/model.py:79-82]] [[13-presets/model.py:95-95]]

**Winner: 11's narrower eligibility.** Default semantic status/progress/selection receivers to no optional halo. Require an explicit decorative-emitter binding before considering one. A halo being redundant does not automatically make its receiver explicitly designated decorative. Keep the opaque semantic core and real state indication in every case.
''')
emit('clarifications.md',r'''
# Ambiguities that need a decision

These eight items have two pinned sides and a recommended authority, but are **not counted as confirmed contradictions**. A plausible compatible reading exists; the missing detail must be supplied before implementing a compiler or claiming a complete schema.

## A01 — Raised-control budget does not name local relief or an emissive halo

07 permits local relief on sparse raised controls; 13 requests it for Soft/Tactile and a halo for Glow. 11 allows zero new cast lobes and “at most one static reflection/gradient and one ring,” without explicitly naming an inset-relief or emission allowance. An inset is not a cast, and emission is not reflection. [[07-controls/controls.md:76-78]] [[13-presets/model.py:20-23]] [[13-presets/model.py:67-82]] [[11-performance/budgets.md:9-16]]

**Recommended winner:** Treat 11's named allowance as conservative until the budget explicitly includes/excludes these channels. Do not assert that its zero-*cast* rule by itself bans every inset; that would overstate the text. The resolution needs an explicit per-role channel budget, not a change to Button's no-cast contract.

## A02 — One inset treatment versus two lobes

11 defines total shadow counts by lobes, yet allows a recess “at most one static inset treatment.” 13 models one concave treatment using two opposed inset lobes. [[11-performance/budgets.md:9-17]] [[13-presets/contract.md:39-39]] [[13-presets/model.py:65-66]]

**Recommended winner:** 11 owns the budget unit, but must say whether “treatment” means a pair or one primitive. Until reviewed, use a plain well rather than declaring the paired recipe accepted. C02/C03 have explicit numerical lobe caps; this row does not, which is why this is an ambiguity rather than another proven overrun.

## A03 — Stronger-contrast fallback is mandatory in 08, optional-sounding in 13

08's `more` proposal uses opaque reading grounds and removes distracting grain/gloss/halo; preference restrictions cannot be restored by an author setting. 13 says stronger contrast “can also” select F0, though it incorporates 08 by reference. [[08-accessibility/fallbacks.md:11-13]] [[13-presets/contract.md:3-3]] [[13-presets/contract.md:80-82]]

**Recommended winner:** 08. Its restrictions must always apply; whether they require the entire F0 bundle depends on the receiver. 13's wording must not be implemented as permission to retain forbidden optics. This does not conflict with 10: that report composes preference fallbacks after states. [[10-states/policy.md:23-27]] [[10-states/policy.md:70-70]]

## A04 — “Opaque ground” in the scrim budget could refer to the wrong receiver

11's scrim row says “Opaque/stronger ground when contrast requires it.” 08 explicitly exempts the scrim from making everything opaque and qualifies the foreground panel independently; 05/07 forbid added material on the scrim. [[11-performance/budgets.md:24-24]] [[08-accessibility/fallbacks.md:46-48]] [[05-absorption/policy.md:37-37]] [[07-controls/controls.md:108-110]]

**Recommended winner:** 08/05. Interpret “ground” as the panel's qualified reading ground, not a solid full-viewport scrim. Retain functional occlusion and modal context. The word “ground” is ambiguous, so this is not evidence that task 11 deliberately prescribes an opaque modal wall.

## A05 — Small display text exception versus “large, short” inscription

05 and 07 restrict text decoration to explicit **large, short display inscriptions**. 12 offers contextual evaluation of sparse display inscriptions at 14px and Trace decoration at 16px, while saying plain ink remains default and size is no approval. [[05-absorption/policy.md:36-36]] [[07-controls/controls.md:104-106]] [[12-glyphs-text/legibility.md:11-18]]

**Recommended winner:** Keep 05/07's narrower eligibility until the owner deliberately revises it using task 12 evidence. Define “large” as an Area material-policy term; do not equate it automatically with WCAG large text. Task 12's exploration is not approval to decorate 14px labels. 13 correctly enables no display-text exception. [[13-presets/contract.md:64-64]]

## A06 — Layer-model arrays versus the compact control record

01 defines `content.decoration[]`, `body.paints[]`, `edges[]`, `reflection[]`, `shading.*[]` and other ordered channels. 07 deliberately provides a compact authoring interface. 13 emits `content.decoration: "none"`, scalar relief/gloss, and named gradients. These can be equivalent representations, but no general codec proves that equivalence for multiple layers or non-none content treatment. [[01-taxonomy/layer-model.md:27-40]] [[07-controls/controls.md:20-48]] [[13-presets/model.py:7-15]]

**Recommended winner:** 01 owns layer meaning; 07 owns typed user controls; 13 is a restricted recipe encoding. Specify a versioned expansion/normalization mapping (for example, string `none` becomes an empty decoration array) rather than accepting all representations as the same wire schema. Task 14 stores the recipe snapshot; it does not implement this general material compiler. [[14-tooling/build.py:18-24]]

## A07 — Patch paths and reset semantics are not a complete export schema

07 proposes owner-separated Material/Surface patches, recursive named-record merge, null reset and role presence. 14's sample wraps both modes and uses `patch.light.roles.<role>.gloss`, whereas its embedded snapshot stores `modes.light.roles.<role>.controls.gloss`; it embeds Surface controls inside the role snapshot. This is a viable transport design if a codec maps owners and paths, but it is not the same path contract. [[07-controls/architecture.md:147-185]] [[14-tooling/build.py:18-25]] [[13-presets/model.py:14-15]] [[13-presets/model.py:98-99]]

**Recommended winner:** Preserve 07 semantics, and explicitly specify 14 as an envelope plus typed patch dialect. State the path translation, scope/mode selection, owner dispatch, missing/null/zero behavior and version migration. Storage nesting does not change token ownership. A content hash and JSON round trip do not demonstrate patch application. 14's checker verifies hashes/value preservation but never applies this material patch. [[14-tooling/build.py:84-107]]

## A08 — A published control has no complete rendering interpretation

07 exposes gloss softness; 13 gives Soft/Aero nonzero `gloss.softnessPx`, but its gloss interpretation specifies a white-to-transparent envelope, extent, orientation and mask without defining how softness changes that envelope or which primitive consumes it. 14 promises the same live softness control. [[07-controls/controls.md:45-45]] [[13-presets/model.py:67-77]] [[13-presets/contract.md:43-43]] [[14-tooling/builder.md:29-29]]

**Recommended winner:** Preserve 07's distinct softness meaning. Before calling the record render-complete, define its primitive, units, clipping and scaling; alternatively mark that control unsupported in this recipe and report the loss. Do not invent a root `filter: blur()` or equate softness with strength. C04 already rejects softened thumb cues under 11; this ambiguity also matters on otherwise eligible shells.
''')
emit('agreements.md',r'''
# Agreements, crosswalks and coverage

## Inventory and vocabulary

The independently recomputed headline counts match the reports: **25 styles, 12 roles, 78 manifest contracts, 626 parts**. The 626 includes six environment/shared-utility records and 15 nonpaint records; it is not 626 independent DOM surfaces. Composition bindings reuse donors and are not added again. The role JSON is exactly **346,737 bytes**, matching 04. There are 300 style–role cells in 05, 192 preset/role/mode control records in 13, 300 unordered style pairs, 28 unordered preset pairs and 24 copied Glass role/mode records in 14. [Reproducible totals](checks.json), from [[04-role-map/README.md:5-12]], [[05-absorption/README.md:5-12]], [[13-presets/contract.md:7-7]] and [[14-tooling/build.py:18-24]]. The checker derives totals from the records rather than trusting these prose claims.

Canonical style IDs, with identical names in 01/05/08/09/10:

`flat`, `paper`, `transparency`, `glassmorphism`, `acrylic`, `mica`, `liquid-glass`, `neumorphism`, `claymorphism`, `skeuomorphism`, `aqua`, `frutiger-aero`, `glow-neon`, `linear-gradient`, `radial-gradient`, `conic-gradient`, `mesh-gradient`, `gradient-stroke`, `inner-shadow`, `inner-glow`, `outer-glow`, `drop-shadow`, `bevel-emboss`, `letterpress`, `grain`.

They retain 01's distinctions between a material, visual language, property and paint primitive. All 25 have reference coverage in 06; coverage does not mean a complete vendor implementation. Task 13's eight names are **presets assembled from style ingredients**, not a competing eight-style taxonomy. Its referenced style IDs all belong to the canonical set. [[01-taxonomy/catalogue.md:3-7]] [[06-references/README.md:5-12]] [[13-presets/model.py:16-24]]

The twelve display roles are `page`, `container`, `floating surface`, `raised control`, `recessed field/track`, `thumb/knob`, `indicator/fill`, `divider`, `edge`, `glyph`, `text`, `scrim`. 07 normalizes spaces/slashes to hyphens in keys, and 13/14 use those same keys. This is an explicit aliasing rule, not naming drift. The seed brief's shorter role list is refined by 04's closed vocabulary. [[04-role-map/README.md:23-39]] [[07-controls/controls.md:14-16]] [[13-presets/model.py:5-5]]

Role/depth remain independent. A raised-control role is not permission for a new cast; a recessed-field role is not evidence that current CSS paints a cavity. Task 04 records conditional/composed anatomy and nonpaint targets. Tasks 05/07/13 preserve those distinctions. [[04-role-map/README.md:41-45]] [[05-absorption/policy.md:26-39]] [[13-presets/contract.md:9-13]]

## Control names: 07 → 13 → 14

No spelling drift was found in the common scalar control paths. All 192 records contain the same **43 baseline leaf paths**, treating the named-gradient map and empty filter list as container leaves; these are not 43 independently calibrated UI sliders. Full paths are in [checks.json](checks.json). The Glass snapshot embedded by 14 equals 13's record exactly, including semantic source strings, all role controls and state policy. This verifies preservation, not merge semantics or visual correctness.

- **Lighting:** `light.angleDeg`, `heightDeg`, `ambient` survive unchanged. All current preset roles agree on one light; 07 and 14 forbid independent role lights. [[07-controls/controls.md:24-26]] [[07-controls/controls.md:60-60]] [[13-presets/contract.md:21-21]] [[14-tooling/builder.md:23-23]]
- **Body/acquisition:** `body.transparency`, `backdrop.source`, `mapping`, `blurPx` survive. `body.source` is 13's explicit semantic binding descriptor, not an existing Area token. Restricting 01's descriptive native sources to 07's web `none|local` is a backend subset, not a false claim that CSS samples wallpaper. [[01-taxonomy/layer-model.md:42-42]] [[07-controls/controls.md:41-43]] [[13-presets/contract.md:11-11]] [[13-presets/contract.md:22-23]]
- **Local relief:** `relief.profile`, `depthPx`, `softnessPx`, `spreadPx`, `strength` agree; none changes parent depth, geometry or z-index. **Surface:** `direction`, `liftGain`, `softnessGain`, `spreadDeltaPx`, `strengthGain` remain a separate owner. All presets use compatibility gains/direction, not new cast tiers. [[07-controls/controls.md:27-32]] [[13-presets/contract.md:24-25]] [[14-tooling/builder.md:25-25]]
- **Glow:** `source`, `strength`, `placement`, `softnessPx`, `spreadPx` agree. 13 uses only context/outer in its defaults; 07's inner/both/custom possibilities remain schema capability, not required enabled presets. Eligibility conflicts are C02–C04/C06/C07. [[07-controls/controls.md:33-35]] [[13-presets/contract.md:26-26]] [[14-tooling/builder.md:28-28]]
- **Gradients:** named layers, target/kind, angle and stops retain stable IDs and alpha. 13 uses linear sRGB defaults with percentage positions; it does not claim to exercise conic degrees, radial coordinates or mesh topology. 14's independent projection converts percentage positions to normalized DTCG values and reports missing geometry/IDs. [[07-controls/controls.md:36-38]] [[13-presets/model.py:45-50]] [[14-tooling/build.py:30-61]]
- **Stroke:** `coverage`, `paint`, `profile`, `opacity` agree. Surface owns total decorative width; optional stroke off never removes required focus/invalid. [[07-controls/controls.md:39-40]] [[13-presets/contract.md:28-28]] [[13-presets/contract.md:41-41]] [[14-tooling/builder.md:26-26]]
- **Grain/gloss:** strength, scale/seed/source/blend/clip and gloss strength/extent/softness/source/mask are retained. Seeded tile and perimeter masks are authored implementation proposals. A08 identifies the incomplete gloss-softness interpretation. [[07-controls/controls.md:44-45]] [[13-presets/model.py:12-13]] [[13-presets/contract.md:29-30]] [[14-tooling/builder.md:29-29]]
- **Amount, content, filters:** amounts are ordinal gates, never whole-element opacity. 13 leaves functional text/glyph treatment off and filter lists empty. A06 covers layer-array normalization; C01/A07 cover inheritance and transport. [[07-controls/controls.md:46-54]] [[13-presets/contract.md:31-33]] [[14-tooling/builder.md:22-22]]

**Export-schema limit:** 14 supplies a proposed envelope, illustrative projections and a future validation plan, not a complete JSON Schema or functioning importer/renderer. DTCG composites, Tokens Studio, Figma variables/styles, Tailwind and CSS are deliberately lossy targets with sidecars. An invented fixture's shadow values differing from Glass is not a contradiction: the generator explicitly makes it an independent serialization specimen. [[14-tooling/build.py:18-43]] [[14-tooling/exports.md:3-23]] [[14-tooling/acceptance.md:3-21]]

## Caps: 05 intersected with 11, all twelve roles

05's None/Trace/Quiet/Full scale is ordinal channel policy. 11 explicitly applies *after* those caps and can be stricter; neither claims that Quiet always permits the same number of effects. This is a designed intersection, not a numerical conversion. [[05-absorption/policy.md:7-16]] [[05-absorption/policy.md:43-47]] [[11-performance/budgets.md:3-9]]

| Role | 05 allows, subject to style/family/nesting | 11 further limits | Audit result |
| --- | --- | --- | --- |
| page | Scene body, no self-blur/shadow | One static grain plane and one scene gradient; no live displacement | Compatible; None presets simply choose less |
| container | Painted shell; dense body Trace, perimeter Quiet | Two total lobes, one shared grain plane and edge; reviewed single blur owner | Compatible narrowing; C02 in later seeds |
| floating surface | Quiet normally, sparse Full, Tooltip Trace, one owner | Existing two-lobe float, ring/tile; constant blur trial, no displacement | Compatible narrowing; C03 |
| raised control | Quiet sparse, Trace repeated, no new cast | No new cast; one reflection/gradient plus ring, no row grain | Compatible core; relief/emission ambiguity A01 |
| recessed field/track | Trace; Quiet on a designated modeled well | One accepted static inset treatment, no acquisition/cast/grain | Compatible core; treatment/lobe unit A02 |
| thumb/knob | Quiet, sparse larger Full; preserve travel/Surface | Existing shadow-1 plus one nonblurred highlight/rim | 11 is stricter; C04 |
| indicator/fill | Core None, separate Trace halo/rim | No new blurred glow by default; explicit decorative-indicator exception | Intentional tightening; C07 omits it |
| divider | Trace seam, no glowing network | Zero blurred lobes; at most unblurred engraved pair | Compatible; C05 |
| edge | Quiet ordinarily, primitive Full under guards | Single ring | Compatible narrowing; C06 |
| glyph | Functional None; sparse decorative Trace | Zero decorative blur/glow on ordinary UI glyphs; separate display evidence | Compatible |
| text | UI None; large-short inscription exception | Zero effects on dense text, display outside this budget | Compatible; A05 is the later small-display question |
| scrim | None extra; retain functional occlusion | One alpha fill, no texture/shadow/ring | Compatible except ambiguous ground wording A04 |

Both sides for every row: [[05-absorption/policy.md:24-37]] and [[11-performance/budgets.md:13-24]]. Budget exceptions require explicit review; no “Full” cell grants permission to ignore them. Table/Tree/List/Menu/Command/Calendar repetition, CodeBlock/Message reading, Slider data geometry, shared glass and recessed-in-raised ownership remain aligned. [[05-absorption/policy.md:53-75]] [[05-absorption/policy.md:94-110]] [[11-performance/budgets.md:28-36]]

## Fallbacks in 08 versus states in 10

No direct contradiction found between these two policy layers across the 25 style records. State proposals operate beneath preference/unsupported-effect gates, so “hover can add a halo” does not mean reduced-transparency/contrast/forced-colors must retain it. The controlling order is explicit in both. [[08-accessibility/fallbacks.md:21-27]] [[10-states/policy.md:21-27]]

| State | 10's normal-material rule | 08's effective fallback rule / result |
| --- | --- | --- |
| hover | Body/rim change with fixed foreground; no automatic lift | Opaque/system semantic paint survives; optional optics may be absent |
| press | Immediate body/local-shading change, fixed geometry | Keep press feedback after removing optional relief; no motion needed |
| focus-visible | Required independent cue, also with invalid/selection | Never depend on glow, glass contrast or a shadow-only boundary |
| selected/checked | Persistent mark and correct semantic pairing | Preserve opaque core and actual checked value when effects disappear |
| open | Real expanded state; opened surface gets its own role/owner | Opaque or system-colored panel preserves placement, focus and dismissal |
| disabled | Suppress interaction effects; preserve state values | No repeated whole-group dimming; fallbacks compose after suppression |
| invalid | Keep danger context/message and combined focus geometry | Remove competing optics while retaining required error/focus cues |

Both sides: [[10-states/policy.md:7-15]] [[10-states/policy.md:21-27]] and [[08-accessibility/fallbacks.md:33-48]]. The per-style records cover all seven states and reduced motion; their shared policy makes these fallbacks apply to each, not only Glass.

- **Reduced transparency:** opaque reading/control ground plus no acquisition/lensing; do not merely remove blur. 10 requires positive OS reduction to beat an expressive local choice. [[08-accessibility/fallbacks.md:7-9]] [[10-states/policy.md:70-70]]
- **More/less/custom contrast:** retain required floors, plain reading grounds, remove distracting decoration; semantic states remain. Later F0 wording needs A03's clarification. [[08-accessibility/fallbacks.md:11-13]] [[10-states/policy.md:25-27]]
- **Forced colors:** real system-colored bodies/edges/marks and plain ink replace decorative gradients/shadows; preserve intrinsic/literal-color exceptions. 10 never requires its material cue as the sole signal. [[08-accessibility/fallbacks.md:15-15]] [[10-states/policy.md:25-27]]
- **Reduced motion:** stop material movement and any active JS/SVG loops; retain final semantic state. Normal 10 release crossfades/eligible handle motion do not override this. 13's zero-added-optical-motion seeds are a stricter choice, not a contradiction. [[08-accessibility/fallbacks.md:17-17]] [[10-states/policy.md:51-70]] [[13-presets/contract.md:76-76]]

## Review coverage and intentional refinements

1. **01 taxonomy:** checked all style IDs/names, the twelve ingredient fields and layer meanings against 05/07/13. Its “Surface sole writer” recommendation is explicitly revised by 07's sole-writer migration: Surface retains input/policy ownership, shared emitter writes final shadow outputs. Treat 07 as the more specific proposal, not simultaneous competing writers. 09's “Surface owns namespace” can consistently mean policy ownership but future wording should distinguish it. [[01-taxonomy/layer-model.md:90-96]] [[07-controls/architecture.md:15-27]] [[09-dark-density/rules.md:59-59]]
2. **02 prior art:** the bounded OpenGlass counterexample refines the brief's hypothesis, which was explicitly a hypothesis. It does not assert that the complete multi-material brief already exists. Nothing in 13/14 depends on universal novelty. Native material APIs versus CSS approximations remain distinct. [[02-prior-art/README.md:5-16]] [[02-prior-art/survey.md:331-344]]
3. **03 cookbook:** demonstration numbers and parser/browser checks are mechanism evidence, not preset defaults or permission for per-row blur. Masked versus opaque double-background strokes remain alternatives in 06/13. No claim in 11 turns owned-SVG displacement into arbitrary HTML/native refraction. [[03-css-cookbook/cookbook.md:106-165]] [[11-performance/method.md:17-35]]
4. **04 role map:** all records/primary roles/counts checked, including environment, nonpaint, source presence and donor reuse. Aliases do not create new surfaces; conditional depth does not mandate optical relief. [[04-role-map/README.md:23-45]]
5. **05 absorption:** all 300 cells and all 78 family IDs checked; guards and amount semantics compared with later controls, presets and budgets. The stricter 11 limits should intersect these records, not replace their semantics. [[05-absorption/policy.md:41-49]] [[11-performance/budgets.md:3-9]]
6. **06 references:** all 25 style-coverage keys, twenty reference entries and board limits checked. Eighteen public entries plus two owner annotations are not twenty fully reproducible native materials. Acrylic's active implementation note deliberately excludes unused historical graph constants; it refines 01's conceptual definition, not a demand to stack both recipes. No board image value is newly inferred. [[06-references/README.md:5-12]] [[06-references/catalogue.md:77-87]] [[06-references/board-coverage.md:3-5]]
7. **07 controls:** all control groups, ownership, scope and reset rules compared with every 13 control shape and 14's envelope. C01 and A06–A08 are the unresolved interfaces. [[07-controls/controls.md:18-60]] [[07-controls/architecture.md:176-208]]
8. **08 accessibility:** checked twenty-five style records, role fallbacks, worst-case-backdrop method and additive test policy. Fallbacks are constraints, not optional visual state presets. [[08-accessibility/README.md:5-16]] [[08-accessibility/fallbacks.md:21-48]]
9. **09 dark/density:** kept local geometry separate from Surface casts/required strokes. 13 explicitly uses local reference heights only for controls/thumbs and fixed shell seeds; it declares that specialization rather than multiplying both density and height. Used/concentric radius rules remain shared; task 13's reduced subset is not a change to the nine radius settings. [[09-dark-density/rules.md:13-45]] [[13-presets/contract.md:49-53]]
10. **10 states:** all 25×7 state fields and normal/reduced-motion fields checked against 08's precedence; no semantic hover-ink reversal or required-focus-as-glow proposal found. Vendor behavior differences are explicitly adaptations. [[10-states/README.md:5-16]] [[10-states/policy.md:21-27]]
11. **11 performance:** read budgets alongside fixture/method/results limitations. Counts/effect cost are not synonymous: the timings do not establish a universal safe 12px radius or make a four-lobe preset acceptable. Continuous animation in the stress test is deliberately not proposed interaction behavior. [[11-performance/method.md:17-35]] [[11-performance/method.md:59-61]] [[11-performance/budgets.md:26-26]] [[11-performance/budgets.md:46-48]]
12. **12 glyphs/text:** CSS capability and display exploration are distinct from permission to decorate functional content; A05 records the unresolved size boundary. 13's plain glyph/text defaults do not remove 12's research value or imply filled variants are unavailable. [[12-glyphs-text/README.md:3-16]] [[12-glyphs-text/legibility.md:11-24]] [[13-presets/model.py:36-37]]
13. **13 presets:** complete control records, generated tables, compatibility pairs, authored source transfers and guard descriptions were checked. Presets may intentionally omit taxonomy channels: eight reference-inspired presets are not eight vendor reproductions. All six preset-budget conflict groups are listed rather than assuming 13 incorporates 11 automatically. [[13-presets/contract.md:3-17]] [[13-presets/build.py:109-142]]
14. **14 tooling:** the Glass snapshot, content hash and independent DTCG/legacy fixtures preserve the fields they claim to preserve. The loss manifest openly excludes material policy from target core formats. Native Figma capability versus Tokens Studio documentation is a dated external discrepancy already disclosed, not two incompatible Area contracts. Schema/patch limitations are A06/A07. [[14-tooling/build.py:18-64]] [[14-tooling/build.py:75-81]] [[14-tooling/exports.md:3-23]]

No earlier files were corrected. Recommendations are confined to this audit; historical counts, source dates and measurements remain intact.
''')
