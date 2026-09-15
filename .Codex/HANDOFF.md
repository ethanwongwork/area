# Handoff — 2026-09-14

**Branch:** `main`. **Starting commit:** `735ddd3`.
**Checkpoint:** the commit containing this handoff; use `git log -1 --oneline`.
**State:** E03 implementation complete. Token suite GREEN: 16,316 pass, zero waivers.
Release remains incomplete: six behavior lab failures/profile, three package imports fail,
and cross-engine/native forced-colors validation is pending.

## Where things stand

Area follows [E01–E12](../docs/IMPLEMENTATION_PLAN.md). E01 supplied the lab/watcher; E02 fixed
scope inheritance; E03 resolves strokes, normal-text/syntax and painted focus. **E04 is next:**
API vocabulary, manifest/props and compiled package contracts. Do not reopen the original
stroke trial as current state; it is preserved in dated research and prior batch reports.

The user authorizes token/API renames, structure changes, new components and routine design
choices. They require a real before/after visual summary after each batch. Match specimen,
profile, viewport and state; preserve evidence in `docs/batches/E##/`.

## What happened this session

- Supplementary decoration stays 75/800, faint framing returns 150/750, quiet outlines 200/750.
  Their existing 1.1/1.2/1.3 floors were preserved. Added required stroke-control 450/400,
  stroke-control-hover 500/350 and accent stroke-selected 650/150. Values are light/dark.
- Required 1px stroke-width and 2px focus-width/offset are primitives independent of Surface.
  Elevated may remove container decoration but cannot erase fields, choice controls or
  selected edges. Focus-color replaces border-focus; ring-width/offset and ring are retired.
- Components use opaque CSS focus outlines, keeping selection/shadow intact. Invalid Input,
  Textarea and Select retain danger definition during hover/focus. Select supports aria-invalid.
- Placeholder shares the readable muted rung 550/250. Tonal text 650/150 clears active fills.
  Solid hover chooses a safe adjacent rung with the same label; it may reverse the old
  page-relative direction to preserve small-text contrast. Syntax measures its actual code
  ground; all four waiver groups removed. No palette/hue/chroma changes or new dependencies.
- Checkbox/radio marks now have positioned dimensions: the prior intrinsic-grid percentage
  geometry could collapse them to zero. Checked Switch thumbs use the solid's measured label
  color. Selected Segmented has a real border; unselected foreground stays fixed on hover.
  Slider track and thumb use required indicators; its existing keyboard fill behavior is not fixed.
- Added `packages/styles/src/forced-colors.css`: system colors for focus/marks/selection,
  dashed invalid edges, native Select arrow. Native execution remains pending, not claimed.
- Added `/contrast.html` and an app-owned keyboard paint matrix, actual adjacent backgrounds,
  alpha rejection, mark dimensions and focus clipping checks. The existing docs highlighter
  supplies its real code specimen. [Contract](../docs/CONTRAST.md), [report](../docs/batches/E03/README.md).
- `contrast/report.ts` now exits nonzero on unwaived failures. Build alone still does not run
  the test suite. Expanded checks found three dark active-tint text failures; 150 fixed them.

## In flight

No intentional partial implementation remains. The E03 browser matrix passed in Chromium.
Safari could not be rechecked: native CUA reported the host Mac locked. Do not treat the old
E02 Safari pass as an E03 result. Firefox/Gecko and native Windows forced-colors remain pending.

Preview: http://localhost:4321/contrast.html via the E01 dev watcher (session 98213, log
`/tmp/area-e01-dev-final.log`). Contrast and scope tabs are deliverables; temporary lab tab
was closed. Viewport override reset after 390×844 verification (scrollWidth 390, no overflow).
Restart dev only after changing the watcher/server implementation.

## Next

1. **E04:** align accent/brand and neutral/primary public vocabulary, manifest versus React
   props, source organization and genuine compiled consumer exports. Current compiled config
   subpath works; token root and raw React/manifest Node imports still fail. Preserve scope,
   color and field-height contracts while changing package/API boundaries.
2. E05 behavior proof, then composite widget completion. React Aria is not installed or
   selected. Six initial behavior failures and keyboard slider fill remain visible.
3. Complete native browser/OS validation in the release matrix. Select's normal-mode SVG
   arrow is still fixed gray; a fully themeable glyph is a remaining component refinement.
   Its required field border/focus is measured, but the paint matrix does not measure its SVG.

## Traps

- Run the paint matrix with actual keyboard modality: focus its button and press Enter.
  Pointer focus does not match focus-visible on every control. The harness now refuses a
  pointer-only run instead of reporting thousands of false contrast failures. It measures
  browser properties, not synthetic keyboard behavior.
- Required borders cannot read elevation's border-width, which becomes 0 in Elevated. Focus
  cannot be a shadow: shadows disappear in forced colors and a 45% halo is not its source color.
- `box-shadow: none, inset ...` is invalid in flat surfaces. Segmented now uses a real border,
  leaving its optional shadow alone. Do not reintroduce a shadow-only selected edge.
- Checkbox/radio percentage marks need positioned geometry. The previous grid's intrinsic
  track had no definite dimensions for the percent child, making checked and unchecked alike.
- The 2px focus offset needs space. Fixture checks verify clipping ancestors, not arbitrary
  consumer layouts. Code disclosure deliberately uses its existing inset outline.
- The scope contract remains E02's: unregistered light-dark pairs resolve at consumption;
  Theme inherits React context, not arbitrary host DOM. Pass root host selection explicitly.
- Build tokens before fresh typecheck/pack; config types derive from AXES. CSS semantic colors
  may read as functions in getPropertyValue; measure actual consuming properties instead.
- CUA-only browser work. Normal screenshots are JPEG bytes, even if named.png accidentally;
  E03 files use.jpg. Captures match 1280×720. Provider fullPage produced blank padding before.
- Baseline fixture code was plain text; the final specimen uses the real docs highlighter.
  The report explicitly distinguishes this fixture change from measured syntax color claims.
- Consumer tests use a temporary npm cache. Loopback preview tests require sandbox escalation;
  do not change the user's npm-cache ownership or infer an ownership fault from sandbox denial.

## Verify

- `npm test`: **16,316 passed /0 failed**, eight files. Contrast test file 16,140 tests.
- Contrast report: **308 passing /0 failing groups, zero active waivers**, 66 themes.
- `npm run build:docs`: package build, parity and dogfood pass; **41 pages, 65 demos, 36/36 components**.
- `npm run typecheck`: three packages plus lab pass. Manifest parity: 36 components pass.
- `npm run test:preview`: **4 passed**.
- Paint matrix: **21,120 passed /0 failed** in Chromium (80 checks ×264 profiles).
  Worst field boundary in fixture: cool textarea on inset 3.4311:1. All measured focus opaque.
- Scope matrix: **75,493 passed /0 failed** in Chromium with 112 semantic colors.
- Pointer hover: red/green/yellow in light/dark retain foreground and pass text contrast;
  hover ratios 5.628/5.995/12.069. Full token tests cover all tonal hover fills.
- Original six-profile lab: **16 passed /6 failed /22** each, unchanged. Failures are Field
  relationships/required, Tab IDs/keyboard, segmented tab stops and motion-none. Slider fill
  still becomes stale after keyboard input; do not hide this later behavior work.
- Packed consumer: **11 export targets exist /1 missing**. Config imports; missing token root
  and unsupported raw React/manifest TypeScript imports remain E04 work.
- 390×844: no horizontal overflow. Native forced colors, E03 Safari and Gecko unverified.
- Markdown local links and git diff --check pass at checkpoint.

Logs `/tmp/area-e03-{tests,build,typecheck,contrast,parity,preview-tests,consumer}.log`.
Durable screenshots, reports and measured worst pairs: `docs/batches/E03/`.

## Remote state

Local checkpoints remain unpushed. Automatic approval review previously rejected git push
origin main because explicit repository-export/shared-branch authorization was missing.
Do not retry without explicit push authorization. No push was attempted in E03.
