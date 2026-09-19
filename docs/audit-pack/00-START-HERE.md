# Area audit pack: start here

Follow [WORKFLOW.md](WORKFLOW.md): prepare one construction + build approval packet,
ask for owner approval, then implement and verify autonomously. The owner does not need
to paste separate A/B/C/D prompts. An explicit staged request still controls its scope.

## Authority

- **evidence/**, INDEX.md and PINS.md: pinned benchmark facts and extracted values.
  Numbers not resolved by the extraction are n/p; do not guess them.
- **construction/**: benchmark measurements, consensus and proposed/approved Area geometry.
  Area design choices must be labeled as proposals, not attributed to a benchmark.
- **01–06 family files**: capability and demo checklists. Build unless an allowed
  exclusion applies. Any remaining illustrative dimensions or CSS skeletons are not decisions.
- **00-CODEX-BUILD-BRIEF.md**: implementation rules and gates.
- **09-area-repo-map.md**: naming and token map; inspect the current repo for actual state.
- **plans/**: per-component approval packet and progress.
- **docs/component-audits/**: implementation record and measured verification.
- **07/08**: finished-family gap check and evidence ledger.

## Current resumption

Switch research is recorded in [construction/01-selection.md](construction/01-selection.md).
Its [approval packet](plans/switch.md) covers construction and the complete build plan.
Owner approved the packet on 2026-09-18. Switch is built and verified; see
[the completed report](../component-audits/switch.md) before reopening its decisions.

Badge has its own owner-corrected decision and report. Do not rerun setup or alter Badge
when continuing Switch. Other entries may still be seeds; inspect each entry rather than
assuming a directory-wide completion status.

## Setup and evidence tools

The construction skill is installed at .agents/skills/construction-audit/. Its source copy
is skill/construction-audit/. The component-audit skill requires construction approval
before implementation. Existing approval requirements remain in effect.

Use:
- `npm run audit:lookup -- switch`
- `npm run audit:lookup -- switch --full --sys pri`
- `npm run audit:lookup -- --find toggle`
- `npm run audit:evidence` for a deliberate pinned refresh.

Use --latest only for an explicitly intended upstream refresh; review source and evidence
diffs afterward. Do not reinstall an already-working pack or delete this directory.

Model choice is optional operational guidance, not an audit gate. Stay in the current
task/model unless the owner requests otherwise. The essential controls are evidence,
explicit decisions, approval, complete coverage, and rendered verification.
