# Handoff — 2026-09-14

**Branch:** `main`. **Baseline before this checkpoint:** `e07ec11`.
**Current checkpoint:** the commit containing this handoff; read `git log -1 --oneline`.
**State:** requested 75/100/150 stroke trial is visible, but contrast tests are RED:
165 failing / 8,810 passing tests. The audit and proposed completion roadmap are complete.
Build, docs, typecheck and manifest checks pass. No thresholds or waivers were relaxed.

## Where things stand

Area is an eight-axis token/CSS system and a presentational React kit, with a 38-page docs
site. The detailed [system audit](../docs/SYSTEM_AUDIT.md) now distinguishes the intended
architecture from verified behavior. The [roadmap](../docs/ROADMAP.md) defines a dependable
first release, with priorities, dependencies and acceptance criteria.

The local branch has unpushed checkpoints. Automatic approval review previously rejected
`git push origin main` because explicit authorization for exporting the repository and
updating the shared branch was missing. No retry or remote update was made this session.
Do not retry without explicit user authorization.

## What happened this session

- Implemented the user's exact light stroke progression through `INVERSION`:
  decorative 75, faint 100, subtle 150. Default colors are #f3f3f3 / #eeeeee / #e2e2e2.
  Components already consume these shared roles, including Select/Input/Textarea,
  Menu/Popover, segmented track/selection, Chip and neutral outline Button.
  Dark remains 800 / 750 / 750. Hover/focus unchanged.
- Preserved existing tests. Decorative 75 clears its 1.1 floor, but five faint/subtle
  assertion groups fail in all 33 light themes. The full report has the exact ratios.
- Audited source, measured all 66 color themes, ran browser scope/interaction probes,
  and researched 17 primary sources. No external primitive library was installed.
- Wrote `docs/SYSTEM_AUDIT.md`, `docs/ROADMAP.md`, and reproducible evidence in
  `docs/research/2026-09-14/`. Updated README, architecture, maintenance and design rules.
- Created a typed interactive summary at
  `/Users/ethanwong/.cursor/projects/Users-ethanwong-Desktop-area/canvases/area-system-audit.canvas.tsx`.
  It is outside git; the full report/roadmap/evidence are in the repository. Canvas SDK
  typecheck passed; host visual rendering was not verified.

## In flight

The requested audit is complete. No roadmap fixes have been implemented. The stroke trial
is deliberately retained for visual review; its release policy is unresolved, not hidden.
Do not start implementing every finding automatically merely because it appears in the roadmap.

Preview: http://localhost:4321/ (server restarted; static build, no watcher). A fresh preview
tab was opened after the prior tab became an unreachable-site error. Light mode restored.

## Next

1. Resolve the trial's stroke policy. Keeping decorative 75 with faint 150/subtle 200
   restores the existing stroke floors; required control indicators still need review.
   Do not lower thresholds just to make the user's visual trial pass.
2. Start roadmap R02/R03: nested theme correctness and accurate rendered contrast checks.
3. Prove an interaction layer, then finish current widgets and forms (R04/R05).
4. Complete motion/type/density/surface behavior and release/consumer checks (R06–R10).
5. Profiles, custom palettes, DTCG interchange and new components follow those foundations.

## Confirmed audit findings

- Dark parent + independently nested brand/neutral child receives light role values.
  Nested light does not reset inherited dark neutral/brand values or native color-scheme.
- Normal-size hover labels and placeholders are tested at 3:1 rather than 4.5:1.
  Independent diagnostics show failures that the current suite does not flag.
- Focus gate tests an opaque color; the ring renders at 45% opacity. Default light ring
  over white is about 2.376:1. Shadow-only focus needs a forced-colors fallback.
- Tabs has no arrow/activation handler; Segmented/Menu/overlays lack complete behavior.
- Explicit motion none leaves spinner running at 0.7s; duration literals bypass the axis.
- Token root import fails: its exported src/index.ts does not exist.
- React Button/Badge accept neutral while manifest says primary; size unions also drift.
- Uncontrolled Slider's native value can diverge from its painted fill. Field relationships
  are caller-owned but not adequately expressed. See F07 for the other state contracts.
- Registry accepts an extra invalid dark-map token; global manifest state checks do not
  prove per-component state coverage. Namespace separation does not prove DOM composition.

## Traps

- `npm run build` does not run contrast tests. The contrast report prints failures but
  exits zero; `npm test` is the blocking command.
- There are 50,688 preset combinations, but only 66 color themes. Do not conflate them.
- All six test files are token tests; a large parameterized count is not UI coverage.
- The audit's scope fixture is a standalone CSS probe. Copy it beside built area.css
  to run; rebuilding docs removes that temporary route.
- Current public Button tone is neutral, not primary; the latter remains in the manifest.
- The archived contrast-policy proposal is historical, not approved implementation work.
- Preserve palette values and icon geometry. Current branding is Area; archives retain history.

## Verify

- `npm test`: 165 failed / 8,810 passed (8,975 total), one failed/five passed files.
- `node packages/tokens/src/contrast/report.ts`: five failing / 173 passing assertion groups,
  four waived groups, across 66 themes. Saved at docs/research/2026-09-14/contrast.txt.
- `npm run build:docs`: pass; package builds, 36-component parity, 38 pages/64 demos,
  dogfood audit 36/36 and no violations. Includes `npm run build`.
- `npm run lint:manifest`: pass, 36 components.
- `npm run typecheck`: pass, all three packages.
- `node docs/research/2026-09-14/measure.ts`: reproduce diagnostic JSON.
- `git diff --check`: pass. New/updated Markdown local file targets resolve.
- Browser: light/dark stroke values, scope errors, motion-none, elevated outline and
  nonworking Tabs ArrowRight confirmed. Other accessibility/browser checks are proposed,
  not claimed complete; see the audit's scope and browser-observations.md.
