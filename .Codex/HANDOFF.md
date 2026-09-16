# Handoff — 2026-09-15

**Branch:** `main`. **Starting commit:** `7325b1b`.
**Checkpoint:** the commit containing this handoff; use `git log -1 --oneline`.
**State:** V03 native-control polish is implemented and verified. Area is not release-complete:
E05 behavior architecture, platform validation and documented standard-mode soft-edge
shortfalls remain open.

## Where things stand

Area follows [E01–E12](../docs/IMPLEMENTATION_PLAN.md). E01–E04 and V01–V03 are implemented.
**E05 interaction architecture is next.** The latest direction is compact, simple controls
with low-contrast neutral layers, soft gray focus treatment and restrained shadows.

Continue providing a one-off before/after visual report for each visual batch. **Do not edit
the palette without asking.** V03 preserves `palette.json` and `curves.ts`; their hashes are
recorded in [the V03 report](../docs/batches/V03/README.md). Semantic derivations from the
current palette remain within the existing design authority.

## What happened this session

- [V03](../docs/batches/V03/README.md) preserves supplied references, Area before/after
  captures, browser geometry, hashes and verification results.
- Switch now has five tiers. Width follows the control ramp; height is 12/16/20/20/24px.
  Default md is 32×20px with a 16px thumb and 2px inset. Standard boundaries are flat;
  increased contrast restores the strong edge.
- Checkbox and Radio use border-box geometry and five tiers. The standard selected edge
  matches the fill, so checked and unchecked outer dimensions remain identical; increased
  contrast restores `stroke-selected`. Choice labels/gaps follow the tier.
- Kbd follows Primer’s one-chord structure: native text glyphs, unboxed semantic key children,
  no shadow and normal/small sizes. Menu shortcuts use the small quiet form. Space is named.
- Input, Textarea and Select share a neutral opaque 2px edge and 6px translucent halo. More
  changes the edge to accent. The halo is the sole focused box-shadow, so flat Surface remains
  valid when `shadow-1` resolves to `none`. Forced colors still uses Highlight.
- Shared shadow ink is 6% light /8% dark. V02’s short geometry remains unchanged. Boxed button
  variants use shadow-1; ghost stays shadowless.
- Consumer fixtures now cover Checkbox xs and Switch xl. Duplicate Segmented guidance was
  consolidated. AGENTS, README, design/contrast contracts, plan and roadmap are current.

## In flight

No intentional partial V03 work remains. The two requested subagents completed useful choice,
gallery and Kbd work before later capacity errors; no agent is active. Composite behavior
completion remains separate from this visual batch.

Preview: http://localhost:4321/gallery.html. Dev session **70944** is running. Gallery tab16,
scope tab9, contrast tab11 and V03 review tab17 remain available at desktop size.

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

- Do not combine `var(--area-shadow-1)` with another comma-separated shadow. Flat Surface
  resolves shadow-1 to `none`, which invalidates the entire shadow list. Field focus therefore
  uses its halo as the sole focused box-shadow.
- Token gates check strong endpoints. Standard retains 3,012 quiet non-text shortfalls; this
  is not an accessibility-conformance claim. Increased contrast passes all 21,120 checks.
- CUA only for browser work. Paint checks require keyboard modality: focus Run then Enter.
  Read/save JSON summaries, not multi-MB reports. A CUA action can succeed even when its
  locator times out afterward; inspect state before retrying (seen with mobile Customize).
- Progress indeterminate bar can have a bounding rect outside its track while clipped by
  overflow:hidden; this is not visible gallery overflow. Check clipping, not rects alone.
- Stop dev before manual full build; dist/modules is deleted/rebuilt and concurrent builds
  race. One parallel checkpoint run produced temporary missing declarations; a sequential
  rerun passed with no source change. Build before typecheck/consumer because exports use dist.
- Preview test needs a localhost socket permission; its initial EPERM was a sandbox failure,
  not a code regression. With that permission all four pass.
- Docs CSS layer order remains crucial. Rail visibility belongs in utilities. Responsive
  layout must honor explicit grid columns and stored rail state. Preserve desktop state when
  testing narrow screens; script now does this automatically.
- Checkbox/Radio use the icon ramp. Switch is the documented track exception: control-ramp
  width and 12/16/20/20/24px height.
- Native system text, not Fluent icons, draws Kbd legends. A custom keyboard font must contain
  all modifier glyphs or fallback metrics will diverge.
- Preserve PURE annotations and Theme-only use client. Consumer checks do not prove actual
  RSC framework integration or every supported React peer version.

## Verify

- `npm test`: **16,322 tests /9 files passed** (contrast file16,140).
- `node packages/tokens/src/contrast/report.ts`: **308 passing /0 failing /0 waivers**,66 themes.
- `npm run build:docs`: **46 pages /106 demos /36 components**; dogfood/parity pass.
- `npm run lint:manifest`:36 component blocks pass. `npm run typecheck`:all workspaces pass.
- `npm run test:contracts`:12/12. `npm run test:preview`:4/4 (localhost permission).
- `npm run test:consumer`:24 export-condition targets; strict NodeNext/runtime/SSR/browser
  JS+CSS/tree-shaking pass. Helper1,417 bytes /Button2,236 bytes with React external.
- Chromium scopes:75,493/0. Preference inheritance:288/0.
- Chromium paint standard:18,108 passed /3,012 shortfalls; more:21,120/0.
- Gallery:32 working Docs links;32 matching alphabetical sidebar/tile entries;75 unique IDs;
 36 manifest blocks; square tiles at1280,390 and dark compact; no document overflow/errors.
- Mobile nav/panel in-flow geometry and focus restoration passed; viewport reset restores
  desktop rail preferences. Markdown local links and whitespace pass. Palette hashes unchanged.

Durable captures and measurements are in `docs/batches/V03/`.

## Remote state

Local checkpoints remain unpushed. Automatic approval review previously rejected git push
origin main because explicit repository-export/shared-branch authorization was missing.
No push was attempted in V03. Do not retry without explicit push authorization.
