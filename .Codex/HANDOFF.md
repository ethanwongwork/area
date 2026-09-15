# Handoff — 2026-09-14

**Branch:** `main`. **Starting commit:** `e679615`.
**Checkpoint:** the commit containing this handoff; use `git log -1 --oneline`.
**State:** E01 completed. System remains RED: 165 token failures; lab baseline 14 failures
per profile; known package imports fail. Build, typecheck, manifest and four preview tests pass.

## Where things stand

Area is following [E01–E12](../docs/IMPLEMENTATION_PLAN.md). E01 now supplies the System lab,
source watcher, preview recovery tests and packed-consumer baseline. E02 theme resolution is
next; no component CSS, token values or behavior was changed in E01. The 75/100/150 trial
and dated [audit](../docs/SYSTEM_AUDIT.md) remain unchanged.

The user authorized token/API renames, architecture improvements, new components and routine
implementation decisions. Continue without another design permission round. They now request
**a one-off visual before/after summary after every batch**, with real screenshots where
applicable. Match specimen, profile, viewport and state; document nonvisual verification when
no visual change applies. Preserve each batch in `docs/batches/E##/`.

## What happened this session

- Added `apps/docs/src/lab/`: real Area components server-rendered and hydrated from one tree;
  six representative profiles; 22 visible assertions with actual/expected data and JSON.
- Added lab navigation and included its CSS in the dogfood audit and its TypeScript in checks.
- Added immutable preview snapshots, staged audited builds, serialized/debounced rebuilds,
  live reload, loopback serving and staging-path containment. Source fingerprints ignore
  duplicate filesystem events and unchanged writes. No dependencies added.
- Added `npm run test:preview` (four passing tests) and `npm run test:consumer` (known red).
  Consumer check packs three packages into a temporary independent directory without registry
  installs or workspace symlinks. It checks declared export targets and raw Node entry imports;
  compiler/React-peer consumption remains E04.
- Saved [E01 report and visuals](../docs/batches/E01/README.md), six-profile browser JSON,
  keyboard slider JSON and consumer output. README, architecture, maintenance and plan updated.

## In flight

E01 is complete; no partial implementation changes are intentionally left dirty. All existing
red states are documented below. Preview is running at http://localhost:4321/lab.html through
`npm run dev` (terminal session 98213; log `/tmp/area-e01-dev-final.log`). The visible tab is
marked as a deliverable. Restart the watcher process after editing its own implementation.

## Next

1. **E02:** define closest-scope theme/neutral/accent inheritance and explicit light resets.
   Extend lab fixtures with nested boundaries, attribute removal/mutation order and comparisons
   to the pure resolver; then fix emission and dark-map ownership validation. Preserve E01.
2. **E03:** fix semantic stroke/normal-text/focus contracts and the existing contrast failures.
   The quiet visual direction matters; 75/100/150 is a reference, not mandatory for every edge.
3. **E04:** API naming, manifest/props parity and genuine compiled/consumer package contracts.
   React Aria is still a planned proof in E05, not installed or selected.

## Traps

- Build success is not a green token suite. Contrast report still exits zero on printed
  failures; `npm test` is the actual token gate. Never weaken thresholds to clear this baseline.
- Lab scope references are explicit sibling scopes, not yet an independent resolver oracle.
  Its synthetic Tab key assertion complements one trusted keyboard reproduction; it is not
  cross-engine automation. In-page checks run from the UI, not a headless browser CLI.
- Slider initial-fill check passes at 40. Press Right: value 41, fill 40, then rerun to see
  the extra failure. Field required/help links, Tab IDs/keyboard, segmented tab stops and
  explicit-none spinner remain defective. Menu/Popover remain presentation specimens.
- Browser capture immediately after profile selection can catch color transitions midway.
  Observe the settled view before saving. Full-page captures in this provider produced blank
  padding; final desktop images use normal 1280×720 viewport captures instead.
- Browser locator clicks could time out when the action was scrolled away after a slider
  interaction. Scroll to the top and use the fresh AX button; do not treat it as a component bug.
- The first watcher reacted to duplicate/metadata notifications. Source fingerprints now
  filter unchanged bytes; the dedicated regression covers rewrite, edit, deletion and restore.
- A syntax-error experiment confirmed the server retains the last successful build; restoring
  the source recovered. No intentional syntax error remains. Generated output is excluded.
- Local sandbox needs escalation to bind loopback ports. The consumer script uses its own
  temporary npm cache rather than touching the user's protected cache. Do not run npm's
  suggested cache ownership changes; the original error was sandbox access, not proven ownership.

## Verify

Fresh E01 results:

- `npm test`: **165 failed / 8,810 passed / 8,975 total**, 1 failed / 5 passed files.
- `node packages/tokens/src/contrast/report.ts`: **5 failing / 173 passing groups + 4 waived**,
  66 themes. Independent stricter diagnostics remain in the dated research directory.
- `npm run build:docs`: pass, including package build and manifest parity. **39 pages,
  64 catalog demos, 36/36 manifest components**; no dogfood violations.
- `npm run lint:manifest`: **36 components**, pass.
- `npm run typecheck`: pass for three packages plus the lab.
- `npm run test:preview`: **4 tests passed**.
- Lab **Run browser checks**: **8 passed / 14 failed / 22** in each of 6 profiles.
  With a trusted Right on Allocation: **7 passed / 15 failed**.
- `npm run test:consumer`: **9 export targets exist / 1 missing**; three raw Node imports
  fail (missing token root; React and manifest source TS unsupported in node_modules).
- Hydration: Activity click, Select choice and Checkbox work. Trusted Tab Right stays Account.
  Mobile 390×844: no horizontal overflow. No screen reader, forced-colors or cross-engine claim.
- Markdown local links and `git diff --check`: pass.

Logs: `/tmp/area-e01-{tests,build,typecheck,contrast,parity,preview-tests,consumer}.log`.
Durable results and screenshots: `docs/batches/E01/`. Original audit: `docs/research/2026-09-14/`.

## Remote state

Local checkpoints are unpushed. Automatic approval review previously rejected `git push origin
main` because explicit authorization to export repository contents and update the shared
branch was missing. Do not retry without explicit push authorization. None was attempted in E01.
