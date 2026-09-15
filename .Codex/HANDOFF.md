# Handoff — 2026-09-14

**Branch:** `main`. **Starting commit:** `378f74d`.
**Checkpoint:** the commit containing this handoff; use `git log -1 --oneline`.
**State:** E02 implementation complete; Gecko validation pending. System remains RED:
165 token failures, six initial lab failures per profile and three package import failures.

## Where things stand

Area follows [E01–E12](../docs/IMPLEMENTATION_PLAN.md). E02 fixes independent CSS color
inheritance and explicit light resets, introduces React Theme/context and generated config,
and strengthens registry ownership. E03 semantic strokes, normal-text contrast and focus is
next. The 75/100/150 trial and historical audit remain unchanged.

The user authorizes token/API renames, structure improvements, components and routine design
choices. They request a real matched visual before/after report after every batch. Preserve
each in `docs/batches/E##/`; match specimen, viewport, profile and state.

## What happened this session

- `emit/colors.ts` retains light/dark pairs until a consuming CSS property selects polarity.
  `emit/css.ts` owns color-scheme; the theme axis no longer injects neutral/accent maps.
  Theme-owned shadow color must also be paired: inherited shadow recipes otherwise freeze
  the root light opacity. Geometric derivations keep their existing re-emission rules.
- Registry checks both polarity maps and emitted maps, including malformed values and exact
  namespace claims. Surface owns four shadow recipes; Theme owns shadow color. Fifteen new
  unit tests cover these contracts and generated config.
- `@area/tokens/config` emits small DOM-free JS/types from AXES: AXIS_PRESETS, DEFAULT_AXES,
  mergeAxes and themeAttributes. It validates selections and freezes merged values. React
  declares a local tokens dependency; no new external dependency was added.
- React `Theme` / `useTheme` inherit React context, recreate complete eight-axis DOM scopes,
  and support portals through a Theme inside createPortal. They do not infer arbitrary host
  DOM attributes; pass a root host selection explicitly. [Contract](../docs/THEMING.md).
- Added `/scopes.html` with a pure-resolver color oracle, nested comparisons and hydrated
  React updates/portal specimen. Axes docs include a real Theme demo and extracted source.
  Updated current architecture, conventions, roadmap and implementation plan.
- [E02 report](../docs/batches/E02/README.md) preserves actual before/after images and evidence.
  The same 29,040-comparison subset improved from 3,174 failures to zero. Expanded 73,507
  comparisons pass in Chromium and Safari 27.0, including colors, native scheme, shadows,
  role removal, three-level nesting, attribute order, React context and body portal.

## In flight

No intentional partial implementation remains. E02's all-engine exit is not fully closed:
Firefox is not installed. Preserve this limitation for release validation. Preview remains
at http://localhost:4321/scopes.html via `npm run dev` (session 98213, log
`/tmp/area-e01-dev-final.log`); the tab is marked deliverable and viewport override reset.
Restart the dev process only after editing its watcher/server implementation.

## Next

1. **E03:** capture current real controls; classify decorative, supplementary and required
   strokes. Resolve 165 failures and normal-text/syntax/focus coverage without silently
   weakening gates. Check selected/invalid/unchecked states and forced-colors treatment.
   Preserve quiet visual direction; 75/100/150 is a reference, not every edge's requirement.
2. **E04:** align accent/brand and other API vocabulary, manifest/props and compiled package
   contracts. Config is compiled; the rest of the package contract remains defective.
3. E05 behavior proof, then component and axis completion. React Aria is not installed or
   selected. Six initial lab failures and keyboard slider fill remain later batch work.

## Traps

- Raw custom-property strings may contain light-dark(). Measure an actual consuming color,
  border or shadow. The lab and axis fixture now do this. Do not @property-register paired
  colors: declaration-time resolution would recreate the inheritance bug.
- React scope starts from context defaults, not host DOM. CSS-only attributes remain
  independently composable. A Theme is unstyled and does not implement overlay behavior.
- Build tokens before typecheck/packing a fresh checkout; config's generated types are needed.
- Registry namespace suffix ':' is exact. Do not let --area-border: claim all border tokens
  or --area-shadow- let Surface claim Theme's shadow-color.
- Build success is not a green token suite. contrast/report.ts prints failures but exits0;
  npm test is the real gate. No palette values, thresholds or waivers changed in E02.
- Browser runner lives in the app and is invoked through UI. It is not headless automation
  or CI. Count 73,507 means repeated defined comparisons, not that many distinct features.
  No screen-reader, forced-colors, OS preference or historical minimum browser claim.
- CUA-only browser work. Captures are normal 1280×720 viewport screenshots; fullPage produced
  blank padding. Wait for settled color transitions before capturing profiles. Source edits
  cause live reload and clear results; avoid edits between running checks and saving JSON.
- The first native Safari acquisition took over eight minutes; later native calls were fast.
  Safari27 scope evidence is saved; do not rerun just to regenerate the same result.
- Slider Right changes value41 while fill stays40. Field relationships/required, Tab IDs and
  keyboard, segmented tab stops, and explicit-none spinner remain defective.
- Loopback tests require sandbox escalation. Do not modify npm cache ownership; consumer
  tests use a temporary cache. No dependencies were fetched for E02.

## Verify

- `npm test`: **165 failed / 8,825 passed / 8,990 total**, 1 failed / 7 passed files.
- Contrast report: **173 passing / 5 failing unwaived groups + 4 waived**, 66 themes.
- `npm run build:docs`: pass including package build, parity and dogfood; **40 pages,
  65 catalog demos, 36/36 manifest components**.
- `npm run typecheck`: three packages plus lab pass. Manifest parity: 36 components pass.
- `npm run test:preview`: **4 passed**.
- Scope matrix: **73,507 passed / 0 failed** in Chromium and Safari27. Live React parent
  polarity change and child override removal each pass the full matrix in Chromium.
- Original lab: **16 passed / 6 failed / 22** in all six profiles (was8/14). Eight scope
  failures resolved. Keyboard slider interaction exposes another existing failure.
- `npm run test:consumer`: **11 export targets exist / 1 missing**. Config import passes;
  token root missing and raw React/styles-manifest TypeScript imports fail in Node.
- 390×844 scope fixture: no horizontal overflow. Firefox absent, not tested.
- Markdown local links and `git diff --check`: pass at checkpoint.

Logs: `/tmp/area-e02-{tests,build,typecheck,contrast,parity,preview-tests,consumer}.log`.
Durable results: `docs/batches/E02/`. Preserve E01 and dated research as historical baselines.

## Remote state

Local checkpoints remain unpushed. Automatic approval review previously rejected
`git push origin main` for missing explicit repository export/shared-branch authorization.
Do not retry without explicit push authorization. No push was attempted in E02.
