# Handoff — 2026-09-14

**Branch:** `main`. **Starting commit:** `8c6c067`.
**Checkpoint:** the commit containing this handoff; use `git log -1 --oneline`.
**State:** E04 complete. Token, contract, package-consumer and docs checks pass.
Release remains incomplete: six behavior lab failures/profile plus pending release matrix.

## Where things stand

Area follows [E01–E12](../docs/IMPLEMENTATION_PLAN.md). E01 supplied the lab/watcher; E02 fixed
scope inheritance; E03 resolved strokes/readability/focus; E04 repairs names, public APIs and
compiled package contracts. **E05 is next: prove Tabs and Dialog behavior architecture.**

The user authorizes token/API renames, structural changes, new components and useful routine
dependencies. They require a real before/after visual summary after each batch. Preserve
matched evidence in `docs/batches/E##/`; record unchanged appearance honestly for structural work.

## What happened this session

- Public `brand` became `accent` across axes, tokens, resolver, configuration, React, docs,
  lab and tests. `primary` tone became `neutral`. Neutral solid tokens are now
  `--area-neutral-solid`, `--area-neutral-solid-hover`, `--area-fg-on-neutral`. No color values
  changed. The E03 policy remains intact. Historic reports/research retain their original names.
- Searched known checkout consumers before removing aliases. [Migration](../docs/API_MIGRATION.md)
  records the breaking cleanup; no outside repository or registry release is claimed.
- Docs preference restoration migrates `area-docs-axes.brand` once, preserving other valid
  choices; an existing accent wins. Invalid values are dropped; corrupt/blocked storage is
  safe. Rails use a separate key and are untouched. Tests cover repeated loads and failures.
- Literal `as const satisfies` manifests retain exact types. Variant props index those
  manifests. Helpers reject invalid keys/values/element/state names rather than silently
  ignoring them. Helper boolean keys are camelCase. Native state exceptions are explicit
  in `stateAttributes` metadata (Select, Textarea, Segmented items).
- Select/Slider expose xl, Chip lg/xl, Panel xs; choices retain their distinct size sets.
  Nav accent now matches actual CSS. Menu exposes existing layout/selection variants.
  CodeBlock drops nonexistent toolbar/title classes and title prop, uses its real action slot,
  and exposes layout. Native form controls moved into `components/forms.tsx`, retaining root exports.
- CSS parity checks exact classes, reverse elements/modifiers, duplicate values and positive
  component-owned states (native/ARIA/data). Negations, comma neighbors, descendant components,
  comments and prefix collisions cannot satisfy a missing state. Table cell modifiers are
  declared and the base cell class shares the existing th/td rule.
- React and manifest ship compiled ESM and declarations under dist/modules; relative imports
  use .js in JS and declarations. Token root is the same lightweight API as config; type-only
  tokens/types exports token/preset unions. Public packages pack dist only. CSS stays separate.
- React is required; React DOM belongs to rendering applications. Build-only APCA and style
  generation dependencies are dev dependencies. No version upgrade/new dependency.
- Theme alone declares use client; per-module compilation preserves it. SSR succeeds without
  DOM globals. RSC framework integration and React 18 peer coverage remain unverified.
- Packed consumer extracts real tarballs into an isolated directory, copies installed peers
  and tools (no workspace links/registry fetch), checks exports/types/SSR/browser JS+CSS and
  tree-shaking. Shared build scripts are watched by dev. All real docs demos now get tsc checks.

## In flight

No intentional partial implementation remains. [E04 report](../docs/batches/E04/README.md)
contains before/after captures, consumer output and browser summaries. The matched 919×798
contrast captures are byte-identical. Nav's repaired accent variant was separately inspected:
current item background rgb(241,244,255), foreground rgb(60,46,190).

Preview: http://localhost:4321/contrast.html. Dev session 53957, log `/tmp/area-e04-dev.log`.
Contrast tab 11 and scope tab 9 are deliverables; temporary tab 13 was closed. Viewport is natural.

## Next

1. **E05:** prove Tabs and Dialog behavior before adopting an adapter broadly. The plan prefers
   native controls plus a consistent React Aria adapter, but no dependency has been selected
   or installed. Research current official APIs; prototype and compare using the explicit E05
   exit criteria, then make the implementation choice within the user's authorization.
2. E06–E07 complete native/control/composite behavior. Six original failures remain: Field
   help/required relationships, Tabs IDs/keyboard, Segmented tab stops, motion-none animation.
   Slider's native keyboard value still leaves its painted fill stale.
3. Release matrix: current Safari, Gecko, native Windows forced-colors, React 18, RSC framework
   integration. Select's fixed SVG arrow remains an E03-known visual refinement. Do not claim
   full accessibility or a publishable release from local token/package checks.

## Traps

- Build before fresh typecheck or consumer tests: workspace public exports now resolve dist
  intentionally. A source edit is not visible through public imports until compiled.
- Stop dev before a competing manual full build. Its own queue is serialized, but simultaneous
  manual/watcher package builds can delete/rewrite the same dist/modules. This was observed
  once during E04 setup; rerunning after stopping the watcher passed.
- TypeScript's declaration emitter kept .ts/.tsx import suffixes despite rewrite options.
  The shared build script rewrites declaration references too; strict isolated NodeNext catches
  missing or unsupported paths. Use fileURLToPath for compiler paths with spaces.
- Preserve PURE annotations on generated wrapper/helper construction where safe; without them,
  bundlers keep unused constructors/manifests. Consumer tests check Button and Select pruning.
- `use client` is module-specific. Do not blanket the barrel or infer RSC support from Node SSR.
- A data-disabled visual flag does not implement native disabling. The helper metadata names
  native exceptions; apply state attributes to their actual state-bearing element.
- CUA-only browser work. Run painted contrast through keyboard modality: focus Run and press
  Enter. Pointer-only activation is deliberately refused by the fixture.
- Read only summaries from the report pre elements; full paint output is several MB. Scope
  and paint summaries plus failures are durable. Behavior lab has two status roles; scope to
  `#regressions [role=status]` instead of a global locator.
- E02 scope rules remain: paired unregistered light-dark colors resolve at consumption;
  geometric derivations reemit at axis boundaries. Theme uses React context, not arbitrary DOM.
- No new Safari result: E03's native attempt found the Mac locked. Don't carry E02 Safari into
  E04 coverage. Gecko and native Windows forced colors still lack execution.

## Verify

- `npm test`: **16,316 passed**, eight files; contrast test file has 16,140.
- Contrast report: **308 passing /0 failing groups /0 waivers**, 66 themes.
- `npm run build:docs`: **41 pages /65 demos /36 components**, parity and dogfood pass.
- `npm run typecheck`: three packages, lab and all docs demos pass.
- `npm run test:contracts`: **12 passed**. `npm run test:preview`: **4 passed**.
- `npm run test:consumer`: **24 concrete export-condition targets**, strict NodeNext positive/
  negative type cases, runtime validation, SSR, browser JS+CSS and tree-shaking pass. Minified
  helper-only bundle 1,417 bytes; Button 2,236 bytes with React external (fixture sizes only).
- Chromium paint: **21,120 passed /0 failed**. Scope: **75,493 passed /0 failed**.
- Six-profile behavior lab: every profile **16 passed /6 failed /22 checks**, unchanged.
- Before/after light specimen SHA-256 (both):
  `d96d9b53bd6290cc98ecd02bf5ff92a804b82f35a0705ec5101714c39bc4bf0e`.
- Final markdown local links and git diff --check pass.

Logs `/tmp/area-e04-{tests,build,typecheck,contrast,parity,preview,contracts,consumer}.log`.
Durable report and samples: `docs/batches/E04/`.

## Remote state

Local checkpoints remain unpushed. Automatic approval review previously rejected git push
origin main because explicit repository-export/shared-branch authorization was missing.
Do not retry without explicit push authorization. No push was attempted in E04.
