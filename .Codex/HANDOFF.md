# Handoff — 2026-09-14

**Branch:** `main`. **Starting commit:** `5f0f749`.
**Checkpoint:** the commit containing this handoff; use `git log -1 --oneline`.
**State:** V01 visual calibration implemented. Token/build/package/scope checks pass.
Standard soft boundaries deliberately have 3:1 audit shortfalls; six existing behavior
failures/profile and the release platform matrix remain open. The entire system is NOT complete.

## Where things stand

Area follows [E01–E12](../docs/IMPLEMENTATION_PLAN.md). E01–E04 are implemented. The user rejected
E03's heavy default outlines and supplied seven new references; **V01** was inserted before
E05 to correct the visual direction holistically. **E05 behavior architecture is next.**

The user authorizes broad system/API/component improvements and requires a real before/after
visual summary per batch. Latest constraint: **do not change the palette without asking**.
Use existing palette colors. Preserve quiet framing, light neutral layers, small 5–8% black
shadows, compact consistent controls and sparse light/vivid accent use. Do not reintroduce
strong default control outlines by treating the more-preference gate as the visual baseline.

## What happened this session

- [V01 report](../docs/batches/V01/README.md) studies all seven supplied images plus official
  OpenAI Apps SDK UI, shadcn and Notion references. Original supplied images are preserved in
  the report's references directory. The report separates source facts from observations.
- Palette export, curves (including green +14 and chroma trims), scale and semantic aliases
  are byte-identical to 5f0f749. Durable hashes prove this. No palette permission was needed.
- Six unregistered derived aliases: edge-control, edge-control-hover, edge-selected,
  edge-accent, fill-toggle, fill-toggle-hover. Standard reads existing faint/subtle/quiet
  accent colors; more reads the existing strong indicator endpoints. Color mixing selects
  exact endpoints at 0/100%; it does not create a new palette.
- data-area-contrast="standard" / "more" are scoped preferences outside the eight creative
  axes. An unconfigured root follows prefers-contrast: more; explicit nested standard resets
  inherited more. Derived aliases reemit at every axis/preference boundary. Native OS
  preference activation itself has not been executed on a host with that setting enabled.
- Input/Textarea/Select, neutral outline Button, Chip, Segmented and choices now share quiet
  framing. Segmented selection uses a pale edge, white/surface plate, shadow and 500 weight;
  unselected labels use 400. Slider inactive track and thumb shadow are quieter; active track
  retains stronger definition. Nav labels no longer change foreground on hover.
- Shadow ink is 6% black in light / 8% in dark. Outlined shadow-1 is 0 1px 1px 0, higher tiers
  graduate; flat stays none. Panel drops shadow-3 → shadow-2. The user's “blue: 1” was interpreted
  as blur: 1 for the contact shadow. Table padding follows density gutters (10/12 → 8/10 compact).
- The new working [workspace](http://localhost:4321/workbench.html) composes real public Area
  components: search, category and published filters, cards/list, empty reset and appearance
  controls. Compact toolbar heights are all 28px; default all 32px. No docs CSS component skin.
- Contrast lab exposes both preferences and a separate 288-case alias inheritance probe.
  Actual CSS color(srgb ...) output is parsed, not silently skipped. Strong 3:1 thresholds are
  unchanged; standard failures remain visible and explicitly documented, never waived as passes.
- Fixed dogfood component coverage reading old dist instead of the current staged preview.
  New page builds exposed this. Build logs now count lab pages dynamically (42 total).
- Updated README, design contract, contrast policy, implementation plan, roadmap, journal and
  this handoff. E03 reports remain historical; current default policy is V01.

## In flight

No intentional partial V01 implementation remains. No release completion is claimed.
Durable captures/results/research are in `docs/batches/V01/`. Matching controls are 919×798
at scrollY 30, light and dark; workspace is a new 1280×720 composition, plus list and 390px
responsive samples. The full system's six original behavior defects remain visible.

Preview: http://localhost:4321/workbench.html. Dev session **34837**, log `/tmp/area-v01-dev.log`.
Workspace tab 14, contrast tab 11 and scope tab 9 are deliverables. Temporary behavior tab 15
was closed. Viewport override reset. No browser error/warning appeared in the workspace check.

## Next

1. **E05:** prove Tabs and Dialog interaction architecture. Existing plan prefers native controls
   plus a consistent React Aria adapter; no dependency selected/installed yet. Research current
   official APIs, prototype and verify the exit criteria before committing to an adapter.
2. **E06–E07:** Field help/required relationships, Tabs IDs/keyboard, Segmented tab stops, reduced
   motion; fix Slider's native keyboard value leaving its painted fill stale. Styling did not
   fix these. Preserve visual softness while making state and keyboard cues reliable.
3. **E08–E09:** remaining density-aware chrome spacing, long labels/localization/zoom, theme-aware
   native Select chevron, complete overlay compositions. Workbench can be the product-scale
   visual regression subject. Native Select popup belongs to the OS; Combobox is still missing.
4. **E10:** Safari, Gecko, Windows forced colors, OS increased contrast, assistive technology,
   React 18 and actual RSC framework integration. Review complete soft-mode state cues; the
   more-mode fixture passing is not a claim of overall accessibility.
5. **E11–E12:** persistent preferences/semantic theme recipes, then searchable Combobox and
   missing composites on the validated behavior architecture. No palette edit without approval.

## Traps

- The token gate checks strong indicator endpoints, not the standard soft aliases. Do not call
  its 308 passing groups proof of default control contrast. Standard has 3,696 non-text audit
  shortfalls; some redundant borders are not individual WCAG violations. Keep the distinction.
- CUA-only browser work. Run paint checks through keyboard modality (focus Run, Enter). A
  pointer-only run is deliberately refused. Read JSON summaries, not multi-MB full reports.
- Browser reload preserves scroll. The before captures were at scrollY 30; match that position
  for comparisons. CUA fractional-page scrolling matched it without modifying screenshots.
- Scope sweep initially failed 662 inherited-shadow expectations, all due to the old hardcoded
  10%/45%, 2px-blur recipe. Updated the independent reference to 6%/8%, 1px blur; all now pass.
- Stop dev before a competing manual full build. Dist/modules is deleted/rebuilt and concurrent
  builds race. Build before fresh typecheck/consumer checks because public exports point at dist.
- Preserve PURE annotations and per-module use client. E04 consumer verifies strict NodeNext,
  declarations, SSR and tree-shaking; it does not prove RSC or all peer versions.
- A data-disabled visual flag does not implement native disabling. State metadata exceptions
  still matter. Docs snippets must remain real demo source; docs CSS must not override Area classes.
- User-provided AGENTS text includes old historical claims. Current implementation facts are
  in the latest contracts/report; green rotation remains +14, despite older “empty” descriptions.

## Verify

- `npm test`: **16,318 passed**, eight files; contrast file 16,140.
- `node packages/tokens/src/contrast/report.ts`: **308 passing /0 failing /0 token waivers**, 66 themes.
- `npm run build:docs`: **42 pages /65 demos /36 components**, parity and dogfood pass.
- `npm run typecheck`: packages, lab and all docs demos pass.
- `npm run test:contracts`: **12 passed**. `npm run test:preview`: **4 passed**.
- `npm run test:consumer`: **24 export-condition targets**, strict NodeNext, runtime, SSR,
  browser JS/CSS and tree-shaking pass. Helper 1,417 bytes, Button 2,236 bytes (React external).
- Chromium paint standard: **17,424 passed /3,696 shortfalls**. More: **21,120 passed /0 failed**.
- Chromium scopes: **75,493 passed /0 failed**. Preference inheritance: **288 passed /0 failed**.
- Six behavior profiles: each **16 passed /6 failed /22 checks**, unchanged.
- Workspace filters/view/theme/contrast/density verified; 390px document has no horizontal overflow.
- Palette input hashes unchanged. Markdown local links and git diff --check pass.

Logs and browser summaries are copied into `docs/batches/V01/`; temporary logs `/tmp/area-v01-*`.

## Remote state

Local checkpoints remain unpushed. Automatic approval review previously rejected git push
origin main because explicit repository-export/shared-branch authorization was missing.
No push was attempted in V01. Do not retry without explicit push authorization.
