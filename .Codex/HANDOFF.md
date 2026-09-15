# Handoff — 2026-09-14

**Branch:** `main`. **Starting commit:** `cd657a1`.
**Checkpoint:** the commit containing this handoff; use `git log -1 --oneline`.
**State:** V02 visual/gallery batch implemented and verified. Area is NOT release-complete:
standard soft-mode contrast shortfalls and existing behavior/platform work remain open.

## Where things stand

Area follows [E01–E12](../docs/IMPLEMENTATION_PLAN.md). E01–E04 and V01–V02 are implemented.
**E05 interaction architecture is next.** User explicitly requested the quieter green outline,
even softer shadows, alphabetical components and a square component gallery, with subagents.
Green and gallery agents completed their work; no agent work remains in flight.

Standing direction: soft neutral surfaces, very quiet borders/shadows, compact controls;
real before/after visuals after each batch. **Do not edit the palette without asking**.
V02 preserves palette.json and curves.ts (including green +14 and existing chroma trims).
Semantic tints are permitted uses of the current palette, not primitive edits.

## What happened this session

- [V02 report](../docs/batches/V02/README.md) contains before/after screenshots, new gallery,
  mobile/dark samples, all 44 tonal-stroke measurements, palette hashes and verification logs.
- `packages/tokens/src/semantic/stroke.ts` now derives chromatic outlines by compositing each
  existing readable text rung over the canonical neutral surface and choosing the faintest
  quantized alpha clearing the unchanged rest/hover requirements. Green rest #82f7c4→#d0e5dd;
  hover #00c787→#97c5b5. All 11 families/light/dark/rest/hover use this recipe. Four cross-family
  chroma-budget tests stop neon outliers returning. Fills, labels and palette inputs unchanged.
- Canonical neutral ground keeps axis ownership disjoint. Contrast still tests all casts.
  `aliasLevel()` returns null for the derived strokes; they are not numbered palette rungs.
  `BuiltScale.stroke` remains a raw-ramp diagnostic/public shape; it no longer resolves aliases.
- Shared shadow ink now 4% black light /6% dark; outlined contact shadow is
  0 0.5px 1px -0.5px. Higher tiers tighten offset/blur with negative spread. Solid/soft/outline
  Buttons share shadow-1, ghost remains none; flat surface remains entirely shadowless.
  All consumers inherit this, including native controls, segmented selection and overlays.
- `gallery.html` has 32 square tiles from alphabetical component metadata. Real SSR specimens
  cover all 36 CSS manifest blocks, with useful variants and dedicated Docs links. Code,
  Code block and Segmented gained API pages. 46 pages /102 demos total. Gallery composites
  remain presentation-only; the inline Dialog uses group semantics, not a false modal claim.
- Mobile review exposed old base-layer display:none losing to Panel’s component display.
  Responsive rails now open in flow above content, with focus restoration and separate
  temporary narrow-screen state. Desktop saved preferences return on resizing. At <=1100
  the outline column hides; at <=820 content is one column and rails open one at a time.
- README, design/contrast contracts, plan, roadmap, journal and this handoff are current.

## In flight

No intentional partial V02 implementation remains. All batch changes belong in this checkpoint.
No release completion is claimed. Native controls in gallery work; composite interaction
completion remains separate. The known six behavior failures/profile were not rerun this
batch (last V01 result 16 pass /6 fail per profile); none was fixed by visual changes.

Preview: http://localhost:4321/gallery.html. Dev session **26707**, log `/tmp/area-v02-dev.log`.
Gallery tab16, Button tab14, scope tab9 and contrast tab11 are preserved deliverables.
Gallery opening in Codex was queued because the current task was hidden. Viewport reset.
Gallery desktop1280/mobile390 and dark compact inspected; Button comparison919×798.

## Next

1. **E05:** prove Tabs and Dialog behavior architecture. Current plan prefers native controls
   plus a consistent React Aria adapter; no dependency installed yet. Research official APIs,
   prototype and verify selection/exit criteria before committing to an adapter.
2. **E06–E07:** Field help/required relationships; Tabs IDs/keyboard; Segmented single tab stop
   and arrow keys; motion-none; Slider native keyboard value leaving painted fill stale.
3. **E08–E09:** density-aware chrome, long labels/localization/zoom, native Select chevron,
   full overlay compositions. Gallery and workbench are visual regression subjects.
4. **E10:** Safari, Gecko, Windows forced colors, native OS increased contrast, assistive
   technology, React18 and actual RSC integration. More-mode passing is not overall conformance.
5. **E11–E12:** preference/theme recipes, then searchable Combobox and missing composites.

## Traps

- Token gate checks strong indicator endpoints, not standard quiet aliases. Standard retains
  3,696 non-text shortfalls; redundant edges are not automatically individual WCAG failures.
  Do not call this green accessibility. More preference independently passes 21,120 checks.
- CUA only for browser work. Paint checks require keyboard modality: focus Run then Enter.
  Read/save JSON summaries, not multi-MB reports. A CUA action can succeed even when its
  locator times out afterward; inspect state before retrying (seen with mobile Customize).
- Progress indeterminate bar can have a bounding rect outside its track while clipped by
  overflow:hidden; this is not visible gallery overflow. Check clipping, not rects alone.
- Stop dev before manual full build; dist/modules is deleted/rebuilt and concurrent builds
  race. Build before fresh typecheck/consumer tests because exports point at dist.
- Preview test needs a localhost socket permission; its initial EPERM was a sandbox failure,
  not a code regression. With that permission all four pass.
- Docs CSS layer order remains crucial. Rail visibility belongs in utilities. Responsive
  layout must honor explicit grid columns and stored rail state. Preserve desktop state when
  testing narrow screens; script now does this automatically.
- Palette source assertions in user-provided historical AGENTS text can be stale. Current
  curves remain authoritative; this batch changed semantic presentation only.
- Preserve PURE annotations and Theme-only use client. Consumer checks do not prove actual
  RSC framework integration or every supported React peer version.

## Verify

- `npm test`: **16,322 tests /9 files passed** (contrast file16,140).
- `node packages/tokens/src/contrast/report.ts`: **308 passing /0 failing /0 waivers**,66 themes.
- `npm run build:docs`: **46 pages /102 demos /36 components**; dogfood/parity pass.
- `npm run lint:manifest`:36 component blocks pass. `npm run typecheck`:all workspaces pass.
- `npm run test:contracts`:12/12. `npm run test:preview`:4/4 (localhost permission).
- `npm run test:consumer`:24 export-condition targets; strict NodeNext/runtime/SSR/browser
  JS+CSS/tree-shaking pass. Helper1,417 bytes /Button2,236 bytes with React external.
- Chromium scopes:75,493/0. Preference inheritance:288/0.
- Chromium paint standard:17,424 passed /3,696 shortfalls; more:21,120/0.
- Gallery:32 working Docs links;32 matching alphabetical sidebar/tile entries;75 unique IDs;
 36 manifest blocks; square tiles at1280,390 and dark compact; no document overflow/errors.
- Mobile nav/panel in-flow geometry and focus restoration passed; viewport reset restores
  desktop rail preferences. Markdown local links and whitespace pass. Palette hashes unchanged.

Durable logs/results are in `docs/batches/V02/`; temporary logs `/tmp/area-v02-*`.

## Remote state

Local checkpoints remain unpushed. Automatic approval review previously rejected git push
origin main because explicit repository-export/shared-branch authorization was missing.
No push was attempted in V02. Do not retry without explicit push authorization.
