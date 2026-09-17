# Handoff — 2026-09-16

**Checkpoint update:** Textarea audit, shared 24px Code/Token, compact docs rails, and named radius families are complete in `af4a90b`. Verification: 18,104 tests passed; 344 contrast passes/0 failures across 66 themes; build/docs/typecheck/diff check passed. Radius is now `sharp/xs/sm/md/lg/xl/pill`; `xl` curves 4/8/10/12/14px across default button tiers, while compact caps at 32% of height. Next: audit Select.

**Branch** `main` · **Last commit** checkpoint commit; run `git log -1 --oneline` after checkout
**State** Green: the working tree is checkpointed after the commit and push described below.

## Where things stand

Area is an eight-axis design system with framework-free CSS, thin React components, and a
static documentation site. The current user-facing refinement batch is complete: UI scale is
curated into compact/default packages; visual insets, field/input, documentation chrome, and
Token have been audited and made consistent. This handoff captures the state that should be
resumed after this checkpoint rather than the prior V04-only snapshot.

## What happened this session

- Replaced independently selectable typography/density controls with the `ui` axis in
  `packages/tokens/src/axes/ui-scale.ts`: compact/default packages carry UI type, control
  height, icon size, padding, and gaps together. The docs inspector migrates legacy saved
  choices, and consumer tests now use `ui: "compact"`.
- Added the shared optical-inset contract in `packages/styles/src/inset.css`: square icons
  use their view box, text uses a shared cap reference, and nested interactive actions own a
  square action backplate. Multiline Alert/Toast icons align to the first text line.
- Audited Field and Input. `Field.tsx` owns label/help/error relationships and vertical or
  horizontal composition; Input owns 256px contained width, explicit full-width, soft
  treatment, affixes, leading/trailing visuals, loading, validation, monospace, and an
  `InputAction` with a 24px internal action plate, 16px icon, and accessible tooltip.
- Updated docs examples so default, persistent treatments, sizes where owned, states, and
  compositions are separate specimens. The docs rails use system controls and persist
  resizable widths. Card media has 8px layers and text/action areas have 12px layers.
- Audited Token in `docs/component-audits/token.md`. Token remains a static design-token
  reference; selectable/removable metadata belongs to a future TokenInput/Tag composition.
  It now has component aliases (`--area-token-*`), a softer decorative edge, consistent
  manifest naming, and separate default/subtle/on-color/swatch/prose documentation.
- Updated the reusable component-audit skill and its framework to require all seven
  benchmark sources, a union decision ledger, contained width discipline, nested-backplate
  measurements, and one ordinary variant per preview container.

## In flight

Nothing intentional — the tree should be clean after the checkpoint commit and GitHub push.
The next component audit is **Textarea**, the next queued sibling after completed Field and
Input. Read `.agents/skills/component-audit/SKILL.md`, `docs/COMPONENT_AUDIT.md`, and
`docs/component-audits/input.md` first.

## Next

1. Audit Textarea against all seven required benchmarks before changing its contract.
2. Continue the stated audit order through Select and choice controls; treat Tag/TokenInput
   as a separate behavior family when that work is explicitly requested.
3. Keep browser validation for visual component changes: built docs at desktop/narrow widths,
   compact/default UI scale, representative themes, and radius extremes.

## Traps

- Build React before the docs typecheck. The docs compiler resolves `@area/react` through
  generated declarations in `packages/react/dist/modules`; an absent/stale package build
  appears as missing declarations rather than a docs-source error.
- The `density` and `type` axes are retired from public `Theme`/`mergeAxes` input. Use
  `ui: "compact" | "default"`; docs preferences migrate old saved values.
- A static Token is not Primer's object Token. Do not add remove, selection, generic icons,
  or arbitrary sizes without the separate TokenInput/Tag behavior audit.
- Nested focusable actions need three measurements: outer plate → action box, action box →
  icon, and outer plate → text. Do not solve tight icon spacing by shrinking the glyph.
- Native editable controls retain browser-managed text metrics. Chromium measurements do
  not prove Safari/Firefox/OS-font behavior. Preserve generated/vendor icon geometry.
- Do not commit `dist/`, caches, or `node_modules/`. Stop dev before full builds if a watcher
  is rebuilding the same output.

## Verify

- `npm test`: **18,104 tests / 9 files passed**.
- `node packages/tokens/src/contrast/report.ts`: **344 passing / 0 failing** across
  **66 themes**.
- `npm run build`: passed; axis integrity and styles manifest parity passed for
  **36 components**.
- `npm run lint:manifest -w @area/styles`: passed, **36 components**.
- `npm run build:docs`: passed, **47 pages / 130 demos**; dogfood audit passed.
- `npm run typecheck`: passed after rebuilding React declarations.
- `npm run test:contracts`: **13/13** passed.
- `npm run test:consumer`: strict NodeNext declarations, runtime, SSR, browser bundle, CSS,
  and tree-shaking passed; helper **1,417 bytes**, Button **2,236 bytes** with React external.
- Built Chromium Token page measured default Token as **18px** high at **14px** mono type;
  swatch is **14×14px** with a **4px** gap. `git diff --check` passed.
