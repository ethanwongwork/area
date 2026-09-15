# Handoff — 2026-09-14

**Branch:** `main`. **Baseline:** `59ea987` (audit and 75/100/150 stroke trial).
**Checkpoint:** the commit containing this handoff; read `git log -1 --oneline`.
**State:** detailed implementation plan completed. Implementation batches have NOT started.
The existing stroke trial remains RED: 165 failing / 8,810 passing tests. Build, docs,
typecheck and manifest parity pass. No source/token behavior changed during planning.

## Where things stand

Area has a measured [system audit](../docs/SYSTEM_AUDIT.md), a [milestone checklist](../docs/ROADMAP.md),
and now a detailed [implementation plan](../docs/IMPLEMENTATION_PLAN.md). The implementation
plan is the authoritative execution order; the audit remains dated evidence.

The user explicitly gave freedom to rename/add tokens, reorganize structure, build components
and make system-wide improvements. Routine design/architecture decisions are authorized;
do not ask again just to choose better token values, names, organization or a suitable
implementation dependency after a focused proof. The current turn requested a plan, so no
implementation batch was started or marked complete.

## What happened this session

- Organized E01–E12 into dependencies, concrete changes, commit-sized units and exit gates.
- Chose E01 regression/visual baseline and E02 theme scoping as the first work, followed by
  E03 semantic strokes and accurate rendered contrast coverage.
- Set design directions: quiet visual character; purpose-based strokes; neutral/accent
  canonical vocabulary; CSS independence; native controls plus a proved behavior adapter.
- Moved API/distribution checks early (E04), before expanding composite behavior.
- Defined a preferred React Aria prototype for Tabs/Dialog (E05), with measurable selection
  criteria. No dependency was installed or adopted.
- Defined E06–E07 existing component completion, E08–E09 axis/visual refinement, E10 core
  release validation, then E11 customization and E12 new components including Combobox.
- Updated roadmap, README and agent orientation. Rechecked primary implementation references.

## First next actions

Read the implementation plan before editing source. When implementation begins:

1. E01: turn audit scope probes into focused automated browser regressions. Establish one
   comparison board with real components and a clean-consumer baseline. Preserve known red
   tests as visible failures, not blanket skips.
2. E02: fix independently nested neutral/accent selections and light resets; strengthen
   dark-map/emitted ownership validation; verify native color-scheme and dynamic changes.
3. E03: classify border consumers by job, correct normal-text/focus checks, resolve syntax
   waivers, and select coherent final strokes. The user authorized these design decisions;
   75/100/150 is now a visual reference, not a mandatory value for every interactive edge.

Some independent work can be interleaved: motion-none after E02; native state fixes after
API conventions settle. Do not launch parallel agents or user tasks without a request.

## Proposed changes are not current behavior

- Public `accent` naming is planned. Current source still mixes `brand`/`accent` and
  `primary`/`neutral`; E04 must migrate code, docs and persisted inspector settings together.
- Purpose-based `stroke-*` and `focus-*` names are proposed in E03, not yet emitted.
- CSS `light-dark()` is a candidate to prove against the scope/browser matrix, not a
  preselected implementation assumed to fix inheritance.
- React behavior adapter, compiled packages, new Theme API, custom profiles and Combobox
  are planned. Existing presentational wrappers remain unchanged.

## Confirmed current issues

See audit F01–F08 for full evidence. Critical cases:

- Dark parent with independent color child gets light role values; light child fails to
  reset inherited dark values/native color-scheme.
- Placeholder/normal-size hover text checks use 3:1; independent 4.5:1 diagnostics fail.
- Focus checks opaque color but paints 45% opacity; shadow-only focus lacks forced-color fallback.
- Tabs lacks keyboard/activation behavior; composite widgets mainly supply presentation.
- Explicit motion none leaves spinner at 0.7s; uncontrolled Slider can diverge from its fill.
- Token root export is missing; React prop/manifest names and supported sizes drift.
- Registry accepts extra invalid dark tokens; global state selector checks are incomplete.

## Verification and traps

Fresh checkpoint results:

- `npm test`: 165 failed / 8,810 passed (8,975 total), one failed/five passed files.
- Contrast report: five failing / 173 passing assertion groups, four waived groups, 66 themes.
- `npm run build:docs`: pass; includes package build and 36-component parity. Docs: 38 pages,
  64 demos, 36/36 components represented; dogfood audit clean.
- `npm run typecheck`: pass for all three packages.
- Markdown local file links and `git diff --check`: pass.

Build does not run tests. The contrast report prints failures but exits zero; `npm test`
is the blocking command. The current 165 failures are unchanged by this documentation turn.
There are 50,688 preset combinations, not 50,688 tested rendered configurations. All six
existing test files belong to tokens. Browser/manual acceptance criteria are not evidence
that those checks have already been performed.

Preview: http://localhost:4321/; rebuild and refresh after source changes (no watcher yet).
Dated probes/measurements: `docs/research/2026-09-14/`. Historical audit Canvas remains outside
Git at `/Users/ethanwong/.cursor/projects/Users-ethanwong-Desktop-area/canvases/area-system-audit.canvas.tsx`;
the repository plan and reports are the durable source. Do not rewrite the historical audit
as though planned fixes had already shipped.

## Remote state

Local checkpoints remain unpushed. Automatic approval review previously rejected
`git push origin main` because explicit authorization to export repository contents and
update the shared branch was missing. The user's broad authority for system improvements
is not a specific push/publish instruction. Do not retry that rejected action without
explicit authorization. No remote update was attempted during planning.
