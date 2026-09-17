# Handoff — 2026-09-17

**Checkpoint update:** Radius repair plus Nav and Select audits are complete in `384e782`. Verification: 18,104 tests passed; 344 contrast passes/0 failures across 66 themes; build/docs/typecheck/manifest parity/diff check passed. This record supersedes the older session detail below.

**Branch** `main` · **Last implementation commit** `384e782 feat: audit nav and select controls`
**State** Green once this handoff commit has been pushed.

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

Nothing intentional. The tree should be clean after this handoff commit and GitHub push.
The next component audit is **Checkbox**. Read `.agents/skills/component-audit/SKILL.md`,
`docs/COMPONENT_AUDIT.md`, and `docs/component-audits/select.md` first.

## Next

1. Audit Checkbox against all seven required benchmarks before changing its contract.
2. Keep the Nav collapsed/drawer shell, Nav-specific size family, Combobox, and MultiSelect
   as separate audits; do not infer them from the closed controls.
3. Keep browser validation for visual component changes at compact/default UI, radius extremes,
   and representative themes.

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
- Button alone consumes `--area-radius-button-cap`; generic controls intentionally stay at
  the 0.4 radius cap even under the Pill axis.
- Area Nav aligns square SVG viewports and one text reference, never arbitrary path ink.
  Direct anonymous ChatGPT comparison measured a 20px icon viewport in a 36px row but does
  not justify a new 20px global icon token.
- React Select deliberately excludes `multiple`; do not re-add it without a dedicated
  MultiSelect/listbox contract.
- Do not commit `dist/`, caches, or `node_modules/`. Stop dev before full builds if a watcher
  is rebuilding the same output.

## Verify

- `npm test`: **18,104 tests / 9 files passed**.
- `node packages/tokens/src/contrast/report.ts`: **344 passing / 0 failing** across
  **66 themes**.
- `npm run build`: passed; axis integrity and styles manifest parity passed for
  **36 components**.
- `npm run lint:manifest -w @area/styles`: passed, **36 components**.
- `npm run build:docs`: passed, **47 pages / 149 demos**; dogfood audit passed.
- `npm run typecheck`: passed after rebuilding React declarations.
- `npm run test:contracts`: **13/13** passed.
- `npm run test:consumer`: strict NodeNext declarations, runtime, SSR, browser bundle, CSS,
  and tree-shaking passed; helper **1,417 bytes**, Button **2,236 bytes** with React external.
- Built Chromium Token page measured default Token as **18px** high at **14px** mono type;
  swatch is **14×14px** with a **4px** gap. `git diff --check` passed.
