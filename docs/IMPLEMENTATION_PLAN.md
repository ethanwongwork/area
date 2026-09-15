# Area — implementation plan

**Updated:** 2026-09-14. **Planning baseline:** `59ea987`.
**Status:** E01 completed; E02 is next. See [E01 results and visuals](batches/E01/README.md).
The system remains red: 165 existing token failures and the newly visible browser/package regressions.
**Inputs:** [system audit](SYSTEM_AUDIT.md), [milestone checklist](ROADMAP.md), and the user's subsequent authorization to rename/add tokens, reorganize structure, build components and make system-wide improvements.

## Objective and working authority

Make Area a coherent, dependable web design system: quiet and precise in appearance, correct under nested customization, usable with keyboard and assistive technology, and consumable outside its own repository.

The user has authorized design and implementation judgment. Token names, semantic mappings, component APIs, internal organization and implementation dependencies can change when there is a concrete improvement. Routine design choices do not need another permission round. This is not authorization to publish packages, deploy publicly, push to a shared remote, remove historical provenance or discard unrelated work. The existing push restriction still applies.

This document is the execution sequence. `SYSTEM_AUDIT.md` is dated evidence; `ROADMAP.md` is the milestone checklist. A recommendation here becomes an implemented decision only when its batch is completed and the current architecture/design documentation is updated.

## The direction I will pursue

1. **Keep the eight axes as the public organizing model.** Improve their contracts before adding a ninth. Profiles can combine axes without creating new ones.
2. **Keep the quiet visual character.** Light framing, restrained surfaces, regular/medium typography and controlled radii remain the direction. Contrast problems are solved at the relevant role, not by darkening every line.
3. **Make token names describe jobs.** Divider, container edge, editable control, selection and focus are different jobs even when two initially share a color.
4. **Standardize the public vocabulary.** Use `neutral` for the neutral tone and `accent` for the configurable chromatic role/axis; reserve solid/soft/outline/ghost for emphasis. Migrate the current `primary`/`neutral` and `brand`/`accent` splits together with docs and persistence.
5. **Separate primitive data, semantic policy, emitted output and component behavior.** Preserve the palette as an input; fix semantic selection first. Keep one owner per emitted property and one tested place for cross-axis relationships.
6. **Keep CSS independently usable.** React adds behavior and composition. CSS-only examples must state which native behavior they get and which interaction controller they require.
7. **Use native controls where they fit.** Keep native Select for straightforward selection. Prove a mature accessible behavior layer for composite widgets before building more custom event/focus machinery.
8. **Treat package consumption as a design constraint early.** A component that works only inside the docs is unfinished.
9. **Make visual review continuous.** Return to the System lab after every visible change. The user requests a one-off before/after summary after each batch, with real screenshots where applicable. Preserve matched profile/viewport/state captures and describe what changed; for nonvisual work report checks instead.
10. **Use small, coherent commits.** Keep mechanical moves separate from behavior or color changes where possible; each commit must have an intelligible purpose and recorded checks.

## Sequence and dependencies

The main path is:

**E01 baseline → E02 theme resolution → E03 semantic color/strokes → E04 API and package boundary → E05 behavior proof → E06–E07 component completion → E08–E09 axis and visual refinement → E10 core release validation → E11 customization → E12 new components.**

Some work can be interleaved without changing that order:

- The docs watcher and test harness start in E01 and improve throughout.
- Motion-none can be fixed after E02 while the behavior proof is being evaluated.
- Native form fixes do not need to wait for every overlay, but depend on the agreed API/state conventions.
- DTCG export follows the stable token contract; Combobox follows the chosen behavior and overlay contracts.
- Every batch includes its own docs and tests. E10 consolidates verification; it is not when testing begins. E01–E10 define the first dependable release; E11–E12 are authorized expansion after that core is sound.

These are dependency boundaries, not a request to launch parallel agents or separate user tasks. Shared token/manifest changes should remain sequential until their contracts settle.

## First implementation milestone: a trustworthy foundation

I will start with **E01 and E02**, then complete **E03** before expanding any widget. The first visible milestone is a themed comparison page whose nested scopes, text, boundaries, states and focus all follow verified semantics.

The first concrete changes will be:

1. Promote the audit's nested-color probes into a small automated browser regression suite.
2. Add light→dark→light, custom-accent and custom-neutral nesting cases, including attribute removal and switching order.
3. Extend registry validation to dark maps and all emitted token ownership/value paths.
4. Implement the closest-scope theme contract, with native color-scheme reset.
5. Verify the fix against the independent resolved-theme model and capture the comparison board.
6. Correct text/focus assertions, then migrate strokes by role and select passing semantic values.

Why this order: palette tuning inside an incorrectly inherited theme is unreliable, and new components would otherwise copy broken tokens and behavior. Theme scoping is a bounded, reproducible first fix that strengthens every later batch.

### E01 — Establish the regression and visual baseline · completed

**Scope:** verification scaffolding, fixtures, current-state documentation. **Effort:** small–medium. **Maps to:** R10 and preparation for R02/R03.

- Preserve the audit evidence as a dated snapshot.
- Record the current 165 known stroke failures and four waived syntax groups. Do not suppress them or label the branch green.
- Add a focused browser test entry point for owned local fixtures, with assertions on computed values, focus, accessible relationships and control state.
- Add one compact visual comparison board using real Area components: a mixed control row, a small form, a panel, menu/popover surface, selected segmented control, code block and status messages.
- Include representative light/dark, neutral casts, both densities, sharp/default/pill, and flat/outlined/elevated states. Capture a selected matrix, not every possible screenshot.
- Establish a clean-consumer fixture and a baseline export/import check. Record its existing token-root failure.
- Add a docs rebuild/watch workflow that preserves the last successful preview on a build error.

**Delivered:** [System lab, checks, watcher and baseline evidence](batches/E01/README.md). Browser execution is currently an in-page runner in Chromium; cross-engine automation and CI remain later work.

**Commit units:** test runner and probe fixtures; comparison board and watcher; recorded baseline.

**Exit:** each confirmed bug has a repeatable failure or a precise manual reproduction; visual changes can be compared consistently. If expected-failure annotations are needed for pre-existing bugs, keep them explicit, issue-linked and short-lived. Never use broad snapshots or blanket skips as substitutes for assertions.

### E02 — Correct theme resolution and scope ownership

**Scope:** tokens schema/registry, resolver, CSS emitter, base color-scheme, a small Theme scope API. **Effort:** medium–large. **Maps to:** R02, F01/F08.

Define this contract before changing selectors:

- An omitted axis inherits the nearest effective selection.
- An explicit axis overrides only that choice.
- An explicit light/dark boundary correctly re-evaluates inherited accent and neutral choices.
- An inner light scope wins over any outer dark scope, and vice versa.
- Removing an attribute restores inheritance; updates do not depend on change order.
- Native controls use the same effective scheme.
- Overlays can carry their trigger's complete effective theme when rendered outside its DOM subtree.

**Implementation direction:** retain the pure resolver as the reference model. Prototype a CSS implementation that keeps each color role's light/dark values together and applies polarity at the correct scope. `light-dark()` plus explicit `color-scheme` is a candidate, subject to supported-browser and inheritance tests; no architecture decision rests on assuming it works. If the target matrix needs a fallback, emit an explicit, tested fallback from the same model. Avoid a growing list of descendant-selector exceptions.

Build a small `Theme` wrapper around the same configuration contract for React, including effective values needed by future portals. It should not become a second source of color logic or require React for the CSS-only path. Keep any universal configuration helpers free of DOM globals.

**Registry work:** validate light and dark maps for missing/extra keys, invalid finite values, conflicting owners and namespace errors. Validate emitted output as well as definitions so special emitter branches cannot bypass the invariant.

**Commit units:** failing scope/integrity cases; emitter/resolver fix; native scheme and Theme scope; portal-scope contract fixture.

**Exit:** all nesting and mutation cases match the reference resolver, across the supported browser engines. Changing radius/density/type must not change resolved color roles. Document any unsupported bare-CSS composition explicitly rather than silently replacing the original promise with React-only behavior.

### E03 — Rebuild the semantic stroke and contrast contract

**Scope:** semantic tokens, color policy, focus recipes, component token consumption, contrast tests. **Effort:** large. **Maps to:** R01/R03, F02/F03.

The requested 75/100/150 sequence remains a useful **visual reference**, not a mandate that every interactive boundary use those levels. I can now choose the final values under the user's broader authorization.

**Proposed semantic vocabulary, finalized after the consumer inventory:**

- `--area-stroke-divider`: decorative section/table rules.
- `--area-stroke-container`: supplementary card/panel/code framing.
- `--area-stroke-control`: required editable-control definition.
- `--area-stroke-control-hover`: hover treatment without changing foreground.
- `--area-stroke-selected`: persistent selection when an edge is part of the signal.
- `--area-focus-color`, `--area-focus-width`, `--area-focus-offset`: keyboard focus, independent of decorative elevation.

Do not create tokens that have no distinct consumer or contract. Divider and container may share a value; they need separate names only if their jobs and expected future behavior differ. Keep tonal state colors in the corresponding semantic family rather than assigning arbitrary per-component colors.

**Color work:**

1. Inventory every border/fill/ring consumer and classify what information it conveys.
2. Retain very quiet decoration where appropriate; start the comparison with divider 75 and the previously passing faint/subtle levels as controls, then select values using role requirements and rendered evidence.
3. Correct ordinary placeholder and hover-label checks to their actual text category.
4. Resolve the syntax-color waivers using readable semantic steps; keep the palette and historical rationale intact.
5. Measure focus as painted, including opacity and adjacent backgrounds. Prefer a reliable opaque outline/ring over relying on a faint halo alone.
6. Verify checkbox/radio geometry, selected segments, input invalid state, icon-only affordances and focus on quiet/tinted/raised surfaces.
7. Add forced-color fallbacks for focus and state. Keep decorative elevation from removing required indicators.
8. Choose rest/hover/pressed transitions as a sequence, avoiding an abrupt visual jump from almost invisible to heavy.

**Migration:** update aliases, theme policy, CSS, React class contracts where affected, docs, generated token inventories and assertions together. Preserve the old measured trial in research history. Temporary aliases are justified only by a real consumer/migration need; do not retain confusing legacy names indefinitely.

**Commit units:** corrected rendered-state assertions; text and syntax policy; focus/state treatment; stroke vocabulary and consumer migration; visual calibration.

**Exit:** the known stroke failures are resolved without lowering thresholds just to obtain a pass; supported text/focus/control states meet their stated requirements. If a design-only assertion is obsolete because a token's role has changed, replace it with the new role's explicit assertion and document the mapping—never silently remove coverage. Finish with before/after views of actual controls, not just swatches.

## Component contracts and behavior

### E04 — Unify names, contracts, files and package exports

**Scope:** manifest schema, component prop types, module boundaries, exports, docs persistence. **Effort:** medium–large. **Maps to:** R09 and API parts of R10.

- Canonical public vocabulary: **neutral / accent**, with tone distinct from emphasis.
- Migrate `brand` to `accent` across the public axis, tokens, props, docs and persisted inspector configuration. Add a one-time storage schema migration so saved settings continue to work; do not silently reset users during a rename.
- Remove `primary` as a tone name; express primary visual emphasis through variant. Rename the neutral solid tokens consistently.
- Generate or derive variant unions from literal manifest data, retaining strict useful types. Validate per-component supported size ranges rather than blindly giving every component every tier.
- Replace broad permissive helpers with typed helpers and detectable invalid values in development.
- Scope selector/state parity checks to the component and include native selectors such as `:disabled` where they represent the contract. Do not require duplicate data attributes solely to satisfy a simplistic audit.
- Split `primitives.tsx` into cohesive component modules as each family is edited. Avoid an unrelated wholesale file move followed by behavior changes in the same commit.
- Repair the token root export and establish explicit public entry points.
- Prefer compiled ESM plus declaration output for distributed JavaScript packages. Keep stylesheet imports separate and test CSS side effects/tree shaking. Preserve development ergonomics through workspace tooling.
- Audit server/client boundaries, DOM-global use and import paths; do not mark every module client-only or promise server-rendering compatibility without a consumer test.

**Target organization:** existing tokens/styles/react/docs packages remain. Within them, group token primitives/policy/resolution/emission, component contracts/styles, React components/theme/adapters, and tests by responsibility. Extract a new package only if a real runtime/build dependency boundary requires it.

**Commit units:** canonical names and persisted-config migration; typed contracts/parity; module extraction; exports/distribution and consumer test.

**Exit:** public props and classes agree, a clean consumer can import the packages, package output does not depend on internal workspace paths, and active terminology is consistent. Before removing compatibility aliases, search known consumers and document the migration. The user has authorized internal breaking cleanup; publishing those changes remains a separate action.

### E05 — Prove the interaction architecture

**Scope:** accessible primitive adapter evaluation using Tabs and Dialog. **Effort:** medium. **Maps to:** R04.

My starting preference is **native controls plus a consistent React Aria adapter for composite behavior**, with Area retaining visual ownership. This is a preferred candidate, not a claim that the current dependency has been integrated.

Prove two cases before broad adoption:

- **Tabs:** controlled/uncontrolled state, disabled items, keyboard activation, unique instance IDs, correct relationships and RTL behavior.
- **Dialog:** opening, closing, initial focus, containment, background inertness, focus return, nested overlay behavior and themed portals.

Evaluate the candidate against Area's DOM/CSS needs, event/ref composition, type ergonomics, SSR/hydration, bundle contribution, testability and maintenance burden. Set an explicit package-size budget from measured before/after builds. If a critical requirement fails, compare another mature primitive implementation with the same fixture. Do not mix behavior libraries opportunistically across each component.

Record the selected approach in an architecture decision record, including rejected options and the specific reason for the selection. Proceed within the user's implementation authority; this decision does not require a new preference question.

**Exit:** both prototypes pass behavior tests and preserve Area's appearance and scope semantics. The selected adapter boundary is small enough to replace without rewriting tokens or component CSS.

### E06 — Complete forms, native controls and state synchronization

**Scope:** Button, Input, Textarea, Select, Field, Checkbox, Radio, Switch, Slider, Chip, Segmented. **Effort:** large, split by family. **Maps to:** native/form portions of R05.

**Batch A: Field and text entry.** Establish generated/stable IDs, label and help/error connections, required/read-only/disabled/invalid behavior, native validation integration, affixes and icon semantics. Forward refs and consumer handlers without silently overwriting critical internal behavior.

**Batch B: Choice controls.** Define group name/value semantics, single versus multiple selection, keyboard navigation, disabled items, form submission/reset and programmatic updates. Prefer native radio behavior for exclusive segmented choice when it satisfies the composition requirements.

**Batch C: Slider and buttons.** Synchronize value, fill and readout in both controlled and uncontrolled usage. Cover min/max/step, boundary values and reset. Confirm loading does not lose the accessible name or produce duplicate status announcements. Preserve appropriate submit/reset behavior.

**State contract:** define the semantic source of truth first (native property, controlled value or internal state). Derive styling attributes and ARIA from it. Do not maintain unrelated visual and accessible state stores.

**Exit:** a real form can be filled, validated, submitted and reset using keyboard and pointer. It works as a consumer of the library without docs-specific repair scripts. Each family gets its own reviewed commit and tests.

### E07 — Complete navigation, overlays and feedback

**Scope:** Tabs, Nav, Menu, Popover, Dialog, Tooltip, Toast; related status components. **Effort:** large, split by interaction model. **Maps to:** composite parts of R05.

1. Ship the proven Tabs API; verify multiple instances and nonfocusable panel content.
2. Complete Menu behavior, trigger state, disabled handling, dismissal and optional typeahead.
3. Finish Popover positioning/collision behavior and scope propagation; establish one overlay stacking model.
4. Finish Dialog's single semantic owner, dismiss policy, nested dialogs and focus restoration when the original trigger is removed.
5. Complete Tooltip's trigger relationship and keyboard/pointer behavior, without treating interactive content as a tooltip.
6. Add Toast queue/lifecycle and action policy; avoid duplicate announcements and disappearing interactive content.
7. Resolve Nav disabled-link behavior and distinguish site navigation from application menus.
8. Normalize Progress bounds and semantics; review Avatar fallback and Alert/status announcement policy.

**Exit:** menu → dialog → confirmation/toast works across keyboard, pointer and themes. Escape, outside interaction and focus return behave consistently. Static surface-only examples no longer announce themselves as functioning modals or menus.

## Finish the axes and visual quality

### E08 — Finish motion, typography, density and radius

**Scope:** axis definitions, real property application, targeted component refinements. **Effort:** medium–large. **Maps to:** R06/R07 and radius work in R08.

**Motion first:** explicit none stops looping animations as well as transitions. OS reduced-motion is the default upper bound on motion; an explicit local none can reduce it further. Any future opt-in override of OS preference must be intentional and documented. Separate loading cadence from state-transition duration while keeping both motion-owned. Preserve static loading meaning.

**Typography:** apply font family and type roles at scope boundaries; test actual computed properties. Keep 400/500 and role/weight separation. Add self-hosted/custom font guidance and fallback validation. Distinguish content scale from density-controlled UI text in the inspector. Cover numeric alignment, long text, multilingual scripts and user text-spacing overrides.

**Density:** retain 32px default and 28px compact medium. Audit interactive target boxes separately from icon dimensions. Prefer label/hit-area solutions before changing established visual tiers. Add a comfortable preset only if tested application/touch needs justify it.

**Radius:** retain the existing eight values. Verify concentric inset corners, sharp/pill extremes, density intersections, clipping and border thickness. Fix geometry inconsistencies instead of adding more near-identical presets.

**Exit:** selected combinations survive narrow layouts, enlargement and preference changes. No explicit none animation leaks; scoped fonts really change; clickable targets and control alignment meet the documented usage contract.

### E09 — Calibrate surfaces and visual hierarchy in real screens

**Scope:** surface policy, shared geometry, docs/application compositions. **Effort:** medium. **Maps to:** R08.

- Define flat/outlined/raised/elevated as curated appearance recipes. State/focus indicators remain effective under every recipe.
- Decouple required control boundary width from optional decorative frame width when the current global `border-width=0` would remove useful information.
- Review shadow color, spread, fill and edge together in dark and light themes.
- Align mixed control heights, text baselines, icon slots and optical padding.
- Calibrate rest/hover/pressed/selected/invalid/focus as a consistent set. Selection and focus must coexist visibly.
- Review token badge wrapping and swatch edges in prose and tables.
- Build three complete compositions: settings form/inspector; searchable table with filters/empty/error states; menu/command/dialog/confirmation flow.
- Review navigation density, reading width, section rhythm and code/example framing against the same system tokens.

**Exit:** all three compositions look like one system and remain usable across the selected theme/axis matrix. No one-off docs override should conceal a component defect. Approve visual baselines only after reviewing the rendered change and its state coverage.

## Core release validation

### E10 — Complete documentation, compatibility and release checks

**Scope:** CI, package checks, browser/assistive-technology validation, docs, maintenance. **Effort:** medium–large. **Maps to:** R09/R10 consolidation.

- Run unit/contract, component interaction, browser composition, docs audits, typecheck and clean-consumer checks in CI.
- Verify package tarballs, declaration imports, CSS asset paths, side effects, supported React versions and SSR/hydration in the declared environments.
- Establish and record a browser support matrix; test Chromium, Firefox and WebKit where available. Do not translate an unavailable test environment into a pass.
- Add manual assistive-technology results for agreed screen-reader/platform pairs and Windows forced colors.
- Test keyboard-only operation, focus visibility/obscuring, text enlargement, reflow, text-spacing overrides, RTL and long content.
- Generate prop/variant documentation from the contract. Keep executable snippets derived from real demos and show behavior maturity accurately.
- Replace unsupported claims and stale names/counts with current, scoped documentation. Preserve historic audit/journal entries as dated evidence.
- Establish versioning, migration notes, attribution and the intended licensing/release policy. Flag decisions requiring actual ownership information instead of inventing it.
- Track built CSS/JS sizes and regressions with budgets grounded in consumer measurements.

**Exit:** a fresh consumer installs local release artifacts, changes nested themes, completes real application flows and passes the documented support matrix. All release-blocking findings are closed with evidence. No unexplained failures, hidden waiver, broken import or false docs promise remains.

Preparing release artifacts is included. Publishing, deploying or pushing them requires the separate external-action authorization already noted.

## Expansion after the core is dependable

### E11 — Deliver validated customization

**Scope:** profiles/configuration, custom presets, optional higher contrast, token interchange. **Effort:** large, divisible. **Maps to:** R11.

**11A: profiles.** Add a versioned configuration schema with named recipes composed from existing axes. Validate input, migrate old storage, support reset and portable export/import. Distinguish shipped, validated custom and unverified override states.

**11B: custom fonts and palettes.** Support consumer font configuration and build-time accent/neutral generation through the same validation path. Report which text/focus/state pairs fail. Do not imply arbitrary CSS overrides carry the shipped-theme guarantee.

**11C: higher contrast.** Introduce stronger semantic policy inputs without letting a new axis collide with existing owners. Keep preference behavior explicit. A high-contrast option supplements a usable default; it does not excuse a failing default.

**11D: interchange.** Add a DTCG exporter alongside Area's existing JSON, then map conditional contexts with a tested resolver prototype. Preserve types, aliases, descriptions and deprecations where representable. Validate semantic equivalence; do not promise lossless conversion of browser-dependent calculations without proving it.

**Exit:** a profile can be saved, shared, imported into a clean consumer and reproduced with a clear validation result. A custom theme is accepted by evidence, not by looking plausible in a swatch grid.

### E12 — Add Combobox and missing application patterns

**Scope:** first new major component plus small composition patterns. **Effort:** large for Combobox; small–medium for patterns. **Maps to:** prioritized R12.

Combobox follows E05–E07 because it needs the same input, selection, overlay and focus rules:

- Editable search, highlighted option and committed value remain distinct.
- Define controlled/uncontrolled input and selection; support clearing and disabled options.
- Add loading, empty, error and async-result handling, including stale response protection and IME composition.
- Support labels, help/error descriptions, keyboard selection and appropriate screen-reader announcements.
- Keep native Select as the simpler alternative; share visual tokens without pretending their behavior is identical.
- Add virtualization only when a measured use case requires it, with accessible collection behavior included.

Add compositional EmptyState, search/filter and form-validation examples. Add Disclosure/Accordion and Breadcrumb/Pagination when those examples demonstrate a need. Defer data grid, tree, date picker and rich text until their product requirements are defined.

**Exit:** a searchable selection flow works with async data, validation and keyboard interaction inside a dialog, at both densities and in nested themes.

## Verification strategy for every batch

### 1. Regression evidence before fixes

Use a failing test or deterministic reproduction for correctness changes. Do not add low-value tests that merely repeat a CSS declaration; assert the observable contract, such as a nested theme's computed foreground, focus moving to the next enabled tab, or a form reset updating both value and paint.

### 2. Independent reference points

Keep the pure token resolver, browser computed values and component-state expectations sufficiently independent to detect disagreement. A generated expected file copied from the same broken emitter is not an independent oracle.

### 3. Focused combination coverage

- Exhaustively test finite color combinations and schema rules where cheap.
- Use pairwise axis combinations to cover interactions economically.
- Add targeted extremes: nested light/dark, flat/elevated, sharp/pill, compact xs, custom fonts, RTL, selected+focused and invalid+focused.
- Test portals and dynamic updates explicitly; a static screenshot will not reveal inheritance or state bugs reliably.

### 4. Visual and behavioral review together

Every visible change gets before/after comparison, actual computed values and relevant keyboard/state checks. Run automated accessibility checks, then manual checks for behavior those tools cannot establish. Do not accept a screenshot solely because it resembles the previous one.

### 5. Narrow commits and honest gates

Mechanical renames/moves, semantic policy, and behavior changes should be independently reviewable. A regression test may be introduced with its fix in one commit; if a dedicated test-first commit is red, label it explicitly and do not call it a checkpoint-ready green state. Do not stack unrelated work on a newly broken foundation. Existing known failures remain visible until their designated batch resolves them.

### 6. Documentation at the time of the decision

At each meaningful completion:

- Mark the batch and relevant roadmap checklist items complete only when exit conditions pass.
- Add an architecture decision record for changes to ownership, scoping, behavior dependencies, or distribution.
- Update `DESIGN_SYSTEM.md`/`ARCHITECTURE.md` with what is actually implemented.
- Add migration notes for renamed public tokens, attributes and props.
- Append the reason and measured result to `.Codex/JOURNAL.md`.
- Rewrite `.Codex/HANDOFF.md` with the current state, next exact action and any red checks.
- Keep generated output reproducible; preserve audit snapshots under their original date.

## What I will avoid

- A wholesale rewrite before the regression harness exists.
- Renaming tokens without migrating every active consumer and saved configuration.
- A new axis for every possible knob, or a token for every one-off value.
- Multiple competing state stores for ARIA, CSS and actual control value.
- Solving a component defect through a docs-only override.
- Lowering test thresholds or accepting new snapshots solely to get a green result.
- Adding complex widgets before the shared behavior/focus layer works.
- Inventing schedule certainty, passing manual checks that were not performed, or claiming zero remaining risk.

## Completion reporting

Each batch report will state: what changed, why it improves Area, which APIs/tokens migrated,
what was verified, any remaining limitation, and the next dependency. The first report should
be E01/E02 with reproducible scope fixes; the second should close E03 with a coherent stroke,
text and focus comparison. No date estimate is needed until those first batches establish the
actual implementation pace and the behavior-library proof resolves its uncertainty.

## Research informing the implementation candidates

- [MDN: light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark) explains scheme-dependent color selection. This is a candidate for E02, to be verified in Area's nesting and browser matrix.
- [React Aria: Customization](https://react-aria.adobe.com/customization) documents composition and DOM-prop forwarding; [Quality](https://react-aria.adobe.com/quality) describes its behavior/accessibility/internationalization responsibilities. They inform E05's preferred prototype, not a claim of automatic Area conformance.
- The [audit's primary sources](SYSTEM_AUDIT.md#research-and-sources) support the contrast, interaction, target-size, reflow and interchange acceptance criteria.

Sources rechecked 2026-09-14. Implementation choices remain subject to the specified proofs.
