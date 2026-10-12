**Question:** Which corrections does the materials review require, and how does the series change under owner decisions D1–D16?

**Answer:** All Corrections for Astra are addressed in the earlier folders, with review reasons at the top of each affected README. Tasks 04/05 now cover **101 contracts, 13 roles, 773 parts/layers and 325 style/role cells**. None identity, Paper borders and theme-derived Prism colours are corrected. Historical findings and measurements remain; conflicting policies are marked superseded by decision number. Verification passes; production packages and existing contrast tests are unchanged.

**Snapshot:** work and source checks **2026-10-11**, final verification **2026-10-12**, America/Los_Angeles. Latest fetched Area `origin/main`: **9036ed9293beb7a867bdf637ee768c7a46a9901a**. Review/research input: **d2f9b9772677b32997dc6c0be1ea64b40cd835c8**. Read the [brief](../README.md) and [binding review](../REVIEW.md). New public sources retain their own checked dates in [public-source-lock.json](public-source-lock.json); older sources are not relabelled as freshly audited. Corrected-file line links below pin research **225a7a48852149fb0c75e127e3c2e14715d857de**.

## What changed

The review’s [Corrections for Astra:103–110](https://github.com/ethanwongwork/area/blob/d2f9b9772677b32997dc6c0be1ea64b40cd835c8/docs/research/astra/materials/REVIEW.md#L103-L110) and [D1–D16:112–154](https://github.com/ethanwongwork/area/blob/d2f9b9772677b32997dc6c0be1ea64b40cd835c8/docs/research/astra/materials/REVIEW.md#L112-L154) supply the reasons. The following **27 correction records** cover **16 earlier folders**. Each entry links to the exact line of that folder’s change note, which links the affected source/data/report files. [changes.json](changes.json) is the same ledger in machine-readable form.

### C01 · 01-taxonomy

**Review reason:** Acrylic blend contradicts the pinned WinUI active graph.

Replaced exclusion with luminosity blend followed by tint, with the active-graph source; regenerated definition, ingredient matrix and sources. [01-taxonomy/README.md:18](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/01-taxonomy/README.md#L18) Decisions: D1, D2, D9, D13, D16.

### C02 · 02-prior-art

**Review reason:** Missing Figma Glass, Open Props, AuraGlass and liquid-glass prior art; OpenGlass scale was not weighed.

Added four source-pinned entries (27 total) and OpenGlass creation/listed-contributor metadata; bounded the verdict to the inspected implementations. [02-prior-art/README.md:17](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/02-prior-art/README.md#L17) Decisions: D15.

### C03 · 03-css-cookbook

**Review reason:** Chromium SVG backdrop refraction was described as unverified support.

Added a dated support correction: Chromium enhancement, Safari/Firefox displacement fallback; retained the original run as a historical verification limit. Ordinary SVG filter support is a different question. [03-css-cookbook/README.md:17](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/03-css-cookbook/README.md#L17) Decisions: D8, D11.

### C04 · 04-role-map

**Review reason:** Twenty-three newer contracts were missing.

Refreshed all manifest/CSS/spec pins to current main, reviewed relocated ranges, added 23 contracts and their reuse bindings. Current inventory: 101 contracts, 83 specs, 773 parts/layers, 135 bindings. [04-role-map/README.md:12](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/04-role-map/README.md#L12) Decisions: D6.

### C05 · 04-role-map

**Review reason:** Table, Menu/Nav rows and hover plates had inconsistent roles.

Added row-plate as role 13, assigned all repeated state plates and explicitly named hover-plate parts consistently, and retained one primary role per part. [04-role-map/README.md:13](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/04-role-map/README.md#L13) Decisions: D6.

### C06 · 04-role-map

**Review reason:** Kbd and Card depth notes were wrong.

Recorded Kbd transparent default border/no shadow and conditional Card depth: raised only when its Surface shadow paints, otherwise flush. [04-role-map/README.md:14](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/04-role-map/README.md#L14) Decisions: D1, D2.

### C07 · 04-role-map

**Review reason:** Nonpaint count only counted hidden targets, omitting visible layout receivers.

Counted 171 nonpaint records explicitly: 18 hidden targets/labels plus 153 visible layout-only receivers. Painted conditional shells stay separate. [04-role-map/README.md:15](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/04-role-map/README.md#L15) Decisions: D6.

### C08 · 05-absorption

**Review reason:** Anatomy and role coverage must follow refreshed 04.

Expanded 25 styles to 13 roles (325 cells), all 101 contracts and 23 shared guards. Strength multipliers are explicitly uncalibrated, not fabricated numbers. [05-absorption/README.md:12](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/05-absorption/README.md#L12) Decisions: D1, D3, D6, D14.

### C09 · 05-absorption

**Review reason:** Drawer is modal by default.

Corrected Drawer default context and its scrim/opaque fallback responsibilities from current React/spec sources. [05-absorption/README.md:13](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/05-absorption/README.md#L13) Decisions: D7.

### C10 · 05-absorption

**Review reason:** Surface does not own every existing literal shadow.

Separated namespace ownership from actual component paint; pinned Toolbar/Tooltip literal shadows and recorded D2 migration as later work. [05-absorption/README.md:14](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/05-absorption/README.md#L14) Decisions: D2.

### C11 · 05-absorption

**Review reason:** Six guards were missing.

Added cutout rings, fixed-colour fades, translucent washes, list focus via row plate, solid emphasis fills and once-only disabled group opacity; mapped current source parts/families. Added diagnostic/data-extent guard for newer contracts. [05-absorption/README.md:15](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/05-absorption/README.md#L15) Decisions: D6, D7, D12, D16.

### C12 · 07-controls

**Review reason:** Selector-switched recipes break nested scopes; Option A requires Surface migration.

Marked old selector, scope and migration prescriptions superseded; D2 requires inherited 0/1 recipe gates and pixel-identical Surface shadow decomposition. Marked angle, ordinal caps and API proposals superseded where D3/D9/D16 differ. [07-controls/README.md:19](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/07-controls/README.md#L19) Decisions: D1, D2, D3, D6, D9, D13, D14, D16.

### C13 · 08-accessibility

**Review reason:** Forced colors preserves background alpha and does not remove backdrop-filter.

Added explicit opaque Canvas and no-backdrop-filter fallback, app-level transparency preference and optical-layer cleanup; required state/focus paint stays functional. [08-accessibility/README.md:20](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/08-accessibility/README.md#L20) Decisions: D7.

### C14 · 08-accessibility

**Review reason:** Gradient interpolation space was unstated.

Specified premultiplied sRGB composition/interpolation and matching CSS in srgb; a different interpolation space needs its own sampler. [08-accessibility/README.md:21](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/08-accessibility/README.md#L21) Decisions: D3, D6, D7.

### C15 · 09-dark-density

**Review reason:** Scope re-emission citation pointed at the wrong file.

Corrected the pinned 163–174 citation from emit/base.ts to emit/css.ts. Marked historical square inner rims/radius arithmetic superseded by D11 and dark/scaling policy by D1/D3/D10/D14. [09-dark-density/README.md:20](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/09-dark-density/README.md#L20) Decisions: D1, D3, D10, D11, D14.

### C16 · 10-states

**Review reason:** List focus is the row plate; disabled opacity must be named.

Added current Menu focus plate and ToggleGroup once-only disabled opacity pins; marked inherited cap/motion prescriptions superseded. State measurements/records are retained. [10-states/README.md:20](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/10-states/README.md#L20) Decisions: D1, D3, D6, D7, D12, D13, D14.

### C17 · 11-performance

**Review reason:** Universal no-row-blur/static-only budgets did not follow the measurements.

Kept benchmark measurements unchanged; restated measured risk cases (64 panes, animated 5–6-shadow stacks, Safari animated live grain). Marked old role caps superseded; owner minimum 60Hz device and Firefox rerun remain pending. [11-performance/README.md:16](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/11-performance/README.md#L16) Decisions: D1, D3, D6, D14.

### C18 · 12-glyphs-text

**Review reason:** Duotone part names collide with production filled-icon knockout grouping.

Separated research labels into data-material-part/data-material-ink, updated fixture generator/CSS, and pinned the production knockout grouping source. Outline geometry remains unchanged. [12-glyphs-text/README.md:15](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/12-glyphs-text/README.md#L15) Decisions: D13.

### C19 · 13-presets

**Review reason:** Paper faded existing borders to 14%/22%.

Set its existing stroke opacity to 1 in light/dark; Paper remains deferred for a real opaque material rebuild, not promoted by this fix. [13-presets/README.md:19](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/13-presets/README.md#L19) Decisions: D4.

### C20 · 13-presets

**Review reason:** None identity/default was missing.

Added None with identity:true and emitsMaterialDeclarations:false. There are now nine records, with None/Glass/Tactile/Soft identified as the first set. [13-presets/README.md:20](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/13-presets/README.md#L20) Decisions: D4.

### C21 · 13-presets

**Review reason:** Prism colours were literal inventions and ignored accent.

Replaced custom hex stops with accent/neutral-derived sources; retained the old numeric seeds as uncalibrated proposals. [13-presets/README.md:21](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/13-presets/README.md#L21) Decisions: D5.

### C22 · 13-presets

**Review reason:** Glass container violated the old container cap.

Made its sparse painted-shell binding explicit and marked the global Trace ceiling superseded by D1/D3; dense reading grounds remain opaque. Added D7 arbitrary-backdrop/failing-edge F0 requirements. [13-presets/README.md:22](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/13-presets/README.md#L22) Decisions: D1, D3, D7.

### C23 · 13-presets

**Review reason:** D6 adds a role and D3 supersedes ordinal cap enforcement.

Expanded all nine records to 13 roles in both modes; added plain row-plate records and uncalibrated numeric-strength markers. Marked old angle, cast, geometry and cap policy superseded instead of pretending it implements D2/D3/D9. [13-presets/README.md:23](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/13-presets/README.md#L23) Decisions: D1, D2, D3, D6, D9, D11, D13, D14, D16.

### C24 · 14-tooling

**Review reason:** Old builder/export examples inherit the earlier role, angle and selector contracts.

Marked affected sections and frozen schema/examples superseded by D2/D3/D6/D9/D16; kept valid format findings and old round-trip fixtures intact. [14-tooling/README.md:19](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/14-tooling/README.md#L19) Decisions: D2, D3, D4, D6, D9, D16.

### C25 · 15-consistency

**Review reason:** Historical winners deferred to unmeasured caps.

Marked C02–C07 winners locally superseded by D1/D3/D14; kept comparisons intact. Reproduction now reads its immutable original inputs, so corrected earlier folders cannot silently mutate the historical audit. [15-consistency/README.md:20](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/15-consistency/README.md#L20) Decisions: D1, D2, D3, D6, D9, D14.

### C26 · 16-specimen

**Review reason:** Caption said Gloss softness undefined; example person was wrong.

Corrected caption to state that blur is specified but not implemented; changed generated fixture person to Irene Yamaguchi. Pinned its original preset input and source link so the historical specimen stays reproducible. [16-specimen/README.md:17](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/16-specimen/README.md#L17) Decisions: D1, D3, D4, D7, D9, D13, D14.

### C27 · 18-contrast-harness

**Review reason:** Opaque passes test Area paint; arbitrary-scene exterior 1:1 is structural, and changing 13 would corrupt old reproduction.

Documented those interpretation limits and pinned the eight-preset input at the original research commit. Preserved all original numerical results; this is not a rerun against task 19 presets. [18-contrast-harness/README.md:18](https://github.com/ethanwongwork/area/blob/225a7a48852149fb0c75e127e3c2e14715d857de/docs/research/astra/materials/18-contrast-harness/README.md#L18) Decisions: D4, D6, D7.

## Refresh scope and evidence

04/05 use the latest main snapshot above. A final fetch advanced main from `ef8f6b1` to `9036ed9`; `packages/styles/src`, `packages/react/src`, `packages/tokens/src` and `docs/specs` are byte-identical between those commits. The new desktop gallery does not change the requested contract inventory. The refresh therefore pins the newer commit without inventing anatomy changes.

The 23 additions are **FileUpload, FileUploadList, FileUploadItem, EmptyState, ToggleGroup, DescriptionList, Meter, SearchField, ShortcutList, DateRangePicker, Citation, ZoomControl, Board, BoardColumn, BoardCard, Timeline, TimelineItem, EditableText, BoxModel, ScrollArea, Link, Toggletip and Pagination**. They are actual manifest contracts, not inferred extra families.

[04/role-map.md](../04-role-map/role-map.md) gives every source file/line at the current SHA; [role-map.json](../04-role-map/role-map.json) is **443,125 bytes**. It covers **533 manifest root/element classes, 540 normalized CSS classes, 83 distinct component specs, 135 reuse bindings and 21 row-plate parts**. The 773 records include 171 nonpaint receivers: 18 hidden and 153 layout-only. Counts describe the declared templates/layers, not rendered DOM instances or approved components.

[pin-relocation.json](pin-relocation.json) records old/current hardcoded ranges from the old `6f896789a5200bcbd34fe87de458e60ca82141d6` source; five ranges changed in content as well as location. Alert underline, the CustomSelect/TagPicker/CommandPalette ScrollArea/label changes, and Panel flush edge were reviewed. Newly generated class ranges and new contract assignments come directly from the current source census; line bounds alone do not prove semantic correctness.

[05/absorption.json](../05-absorption/absorption.json) covers 25 styles × 13 roles and 23 guards; 100 contracts need at least one guard. Each cell retains its historical amount label and has `strengthMultiplier:null` with calibration status. That null records unfinished D3 calibration; it is not a zero-strength runtime value. The row recipe is shared, with family/context guards protecting focus, semantic fill, masks, washes, disabled opacity and data geometry.

## Supersession versus correction

[decision-overrides.json](decision-overrides.json) indexes **60 section-local callouts**, covering every D1–D16. [supersede.py](supersede.py) reapplies them idempotently after a historical generator. The old findings and benchmark/contrast witnesses stay visible. Factual errors and the explicit 13 preset errors are corrected in their current data; displaced policy is annotated, not rewritten to claim the original research reached the owner’s later decisions.

The original 07/08/09/10 role tables, 09 radius arithmetic, 14 schema/examples, 15 audit JSON, 16 preset data/captures and 18 eight-preset results remain historical artifacts. README and local callouts mark their inherited role/cap/angle/geometry policy superseded. They are not the new 13-role API or a validation of the nine corrected records in 13. Tasks 15, 16 and 18 now read their original immutable preset/research inputs, so changes in sibling folders cannot silently alter historical measurements.

All eight earlier optical presets remain uncalibrated seeds. The added None record is an output-identity contract; it emits no material declarations. The first set is None/Glass/Tactile/Soft. Paper, Aero, Glow and Prism are not promoted to first-set readiness by correcting their records. D7 requires opaque fallback for the known failing glass edges; no new optical pass is claimed.

06 and 17 have no requested factual correction and remain unchanged. Unavailable CodePen rechecks in 06 remain unavailable; the OpenGlass defects from 17 are not rewritten.

## Verification

- **Current inventories:** 04 and 05 deterministic generators pass exact family/class/role coverage, parent/donor references, source bounds and file sizes. The task-19 checker verifies all 23 new IDs, row/hover-plate consistency, six missing guards, corrected preset properties and all D1–D16 callouts. It checks **1,041 distinct current source ranges** and **31 byte-identical historical JSON/data artifacts**.
- **Earlier reports:** 01/02/03/07/08/09/10 integrity checks pass. 11 aggregates reproduce; 13 generates 9 × 13 × 2 records with 300 style pairs and 36 preset pairs; 14 keeps its original export/hash checks; 15 reproduces its 149 immutable historical input files. These are integrity checks, not fresh browser/AT approval.
- **16 specimen:** the historical compiled CSS hash remains `696593187549339ac82234d4bf7a682306901d49a88730c4c817d0a73c35e76d` (Area `eaa9222ebf98f7c260f9e0dd448940523003d4d3`). Static checks pass 288 tiles, eight contexts and the existing 480-receiver/four-capture evidence. Local Chromium showed Irene Yamaguchi and the corrected Gloss softness caption after a slider edit; controls were reset. The source link now points at the actual pinned original presets. This was a factual demo check, not a new visual/material approval.
- **12 glyphs:** local Chromium rendered the renamed attributes (240 research part attributes, no old `data-part` attributes); frame/detail strokes remained distinct. The checker compares outline SVG geometry to the old fixture after removing only the annotation namespace rename.
- **18 harness:** original outputs reproduce: requested paint 6,896 PASS / 32 FAIL; guarded 6,925 PASS / 3 FAIL; opaque F0 6,928 PASS. The gate still exits 1 as expected for failures. Those results describe the original eight presets and 12 roles, not the corrected set.

No production build, package code, component spec or existing contrast-test modification was needed for these research corrections. A temporary-checkout cleanup removed old unchanged files at midnight; the Git pointer and missing research files were restored from the recorded tip, preserving edited files. Final commit scope is checked separately.

## Reproduction

Run from a repository with the pinned commits fetched; Python 3 and Node 26 are sufficient for research validation. The comprehensive integrity checks remain documented in each topic. For this pass:

```sh
python3 -B docs/research/astra/materials/19-corrections/check.py
python3 -B docs/research/astra/materials/04-role-map/build.py --check
python3 -B docs/research/astra/materials/05-absorption/build.py --check
python3 -B docs/research/astra/materials/13-presets/build.py --check
python3 -B docs/research/astra/materials/15-consistency/audit.py --check
python3 -B docs/research/astra/materials/18-contrast-harness/build.py --check
```

To regenerate 04/05, omit `--check` in that order. After regenerating historical Markdown, run `19-corrections/supersede.py`; `13-presets/build.py` applies its combination callout itself. `change-notes.py` rebuilds the top-of-README ledger. `report.py --revision <correction-commit>` rebuilds this summary with immutable line links. Optional `fetch-public.py` downloads only new public source pins into ignored `.cache/` and validates hashes; no upstream code is executed. To rebuild the historical 16 HTML, supply its original compiled dependencies and CSS with `--area-root`; the CSS hash must match, rather than relabelling old measurements as current.

## Proposals

Carry D1–D16 into the later implementation/calibration tasks. Keep hard contrast, focus, semantic meaning, fixed hover ink and accessibility fallback requirements; do not resurrect the historical ordinal caps as numeric limits. This correction pass implements no production Material axis.

## Open questions

The owner still needs to name the minimum 60Hz device. Numeric strength/range calibration, bounded near-black tint/texture distance, Paper’s opaque rebuild, the gate-based control/export API and a revised expressive specimen remain later tasks. None is silently supplied by this correction pass.
