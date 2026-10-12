# Materials 15 — consistency audit

**Question:** Do materials tasks 01–14 agree on vocabulary, inventory, control semantics, role budgets, accessibility and states? Which conflicting statement should govern the next revision?

**Answer:** The headline inventory agrees: **25 styles, 12 roles, 78 contracts and 626 parts**.
Seven concrete contract conflicts remain: global inheritance and six groups of preset-versus-budget conflicts.
Task 13's role records need reconciliation with 07's global controls and 11's effect budgets; copying them unchanged into an exporter would preserve those conflicts.
Task 08's fallbacks and 10's states agree when preference gates run last; later wording and serialization leave eight additional ambiguities to settle.
Keep 07's inheritance, 08's accessibility priority and 11's stricter role budgets; revise requested recipes or report their suppression explicitly.
All findings have both source locations and a recommended winner. Earlier folders are unchanged.

**Snapshot:** Checked **2026-10-10**, America/Los_Angeles. Research input **b0768c8d809946b82d6b00139ecc33fe4e57f528** (`origin/astra/research` fetched at start); Area main **3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e**. Brief and tasks 01–14 are the audit corpus. Research comparisons pin the former SHA; production shadow facts below pin the latter. Prior reports' older Area snapshots remain historical evidence. This does not remap 626 parts against a newer manifest or revalidate public sources, browser performance, WCAG compliance or product approvals.


<!-- task19-changes -->
## Changes after review — 2026-10-11

Task 19 corrections, with the reason from [Corrections for Astra and D1–D16](../REVIEW.md). Older Answer/Snapshot passages below retain their original date and findings unless explicitly refreshed; the changes here and decision callouts govern subsequent work.

- **C25 — Review reason:** Historical winners deferred to unmeasured caps. **Change:** Marked C02–C07 winners locally superseded by D1/D3/D14; kept comparisons intact. Reproduction now reads its immutable original inputs, so corrected earlier folders cannot silently mutate the historical audit. Files: [findings.md](findings.md), [agreements.md](agreements.md), [clarifications.md](clarifications.md), [audit.py](audit.py). Decisions: D1, D2, D3, D6, D9, D14.

Full change ledger and verification: [19-corrections](../19-corrections/README.md).
<!-- /task19-changes -->

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
