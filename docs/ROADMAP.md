# Area — completion roadmap

**Updated:** 2026-09-14. Source: [system audit](SYSTEM_AUDIT.md).
**Scope:** a reusable web application design system, with a verified CSS contract and usable React components. Items below are a milestone checklist, not completed changes. The user has authorized broad system improvements; the detailed work order and design authority are in [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md). External publishing/push authorization remains separate.

## Start here

Follow [the execution plan](IMPLEMENTATION_PLAN.md): regression baseline and theme scoping first,
then semantic contrast/strokes, API/package cleanup, behavior and component completion.
Its E01–E12 batches refine the order of the milestone checklist below.

The current 75/100/150 stroke trial is visible but fails five existing contrast assertions (165 parameterized tests). Preserve the checks. First resolve the intended resting-stroke policy: decorative 75 passes; faint 150 and subtle 200 restore these existing floors, while required control indicators still need rendered accessibility review.

The next implementation milestone should be **theme correctness and honest contrast coverage**, followed by **working interaction primitives**. Do not begin with more colors, radius stops or a large new component catalog.

Effort bands describe uncertainty and scope, not calendar commitments: **small** is one focused change; **medium** spans several modules and a focused test suite; **large** needs a design/API decision, implementation and browser/assistive-technology validation. Dependencies matter more than the bands.

E01 tooling and visual baseline is complete: [results and screenshots](batches/E01/README.md).
This does not close the foundation or release-readiness milestones. E02 is next.

## Milestone 1 — Trust the rendered foundation

### R01 · P0 · Resolve the stroke trial · small

- [ ] Review 75/100/150 in flat/outlined surfaces, light/dark, all neutral casts.
- [ ] Decide which borders are decorative, supplementary, or required control/state indicators.
- [ ] Select release values and rerun the unchanged gate; document any policy change separately with rationale.
- [ ] Preserve a comparison of the trial and release hierarchy in the journal.

**Exit:** no unexplained gate failure; no blanket claim that a quiet stroke meets non-text contrast. The user has authorized final token/value decisions that improve consistency and quality; preserve the quiet visual direction and justify the result with measurements. Audit: stroke section, F02–F03.

### R02 · P0 · Repair scoped themes · medium

- [ ] Define inherited theme + brand + neutral resolution and explicit reset rules.
- [ ] Fix dark parent → brand/neutral child and dark parent → light child.
- [ ] Add native light color-scheme reset and verify controls.
- [ ] Specify how portals inherit the effective scope.
- [ ] Validate dark maps for extra keys, namespace collisions and invalid values.

**Exit:** multi-level nesting equals `resolveTheme()` for all color selections; test both attribute placement and attribute removal. Do not rely only on same-element theme selections. Audit: F01, F08.

### R03 · P0 · Make contrast tests reflect actual UI · medium

- [ ] Apply normal-text requirements to normal-size hover labels and placeholders.
- [ ] Resolve four syntax-color waiver groups through semantic color selection.
- [ ] Measure translucent focus rings and actual adjacent surfaces.
- [ ] Inventory unchecked glyphs, selected/invalid states, outline controls and active backgrounds.
- [ ] Add forced-color focus/selection indicators and inspect keyboard clipping.
- [ ] Label aesthetic floors, WCAG requirements and supplementary APCA policy distinctly.

**Exit:** every supported rendered state has the right criterion and passes or is explicitly excluded from the supported release contract. No default accessibility claim based solely on the current token report. Audit: F02–F03.

## Milestone 2 — Make existing components usable

### R04 · P0 · Choose and prove the interaction layer · large

- [ ] Write an ADR comparing native primitives, React Aria integration and a small custom layer against Area's actual needs.
- [ ] Prototype Dialog and Tabs using the candidate; preserve semantic CSS and scoped tokens.
- [ ] Verify keyboard behavior, names/relationships, SSR/hydration, portals and focus return.
- [ ] Select the approach using that evidence, then apply it consistently.

**Exit:** a real form → menu → dialog → confirmation flow works with keyboard and assistive technology. The architecture decision records bundle/API/maintenance implications. E05 in the execution plan specifies the preferred prototype and selection gate; the user has authorized the agent to choose a suitable implementation dependency after that proof. Audit: F04.

### R05 · P0/P1 · Complete composite widgets and native state · large

- [ ] Tabs: activation callback, arrows, focus policy, unique IDs, disabled handling.
- [ ] Segmented: native radio or equivalent keyboard model, one tab stop, form participation/reset.
- [ ] Menu/Popover/Tooltip: trigger relationship, positioning, dismissal and correct focus policy.
- [ ] Dialog: single semantic owner, inert background, focus entry/return, close policy.
- [ ] Toast: live-region lifecycle, queue/action/dismissal contract.
- [ ] Slider: controlled/uncontrolled fill synchronization and browser-aligned normalization.
- [ ] Field: label/help/error IDs, required/invalid semantics and composed examples.
- [ ] Nav disabled behavior; Progress value bounds; Avatar fallback/name policy.

**Exit:** targeted interaction tests and actual consumer demos, with no docs-only JavaScript needed to repair library behavior. Audit: F04, F07. Depends on R04 for composites; native fixes can proceed independently.

## Milestone 3 — Finish the axes and visual contract

### R06 · P1 · Motion and preferences · medium

- [ ] Make explicit none stop spinner, skeleton and indeterminate progress.
- [ ] Define OS preference vs saved/explicit/nested setting precedence.
- [ ] Tokenize animation durations and document nonanimated status alternatives.

**Exit:** every animation/transition respects the documented policy in nested scopes. Audit: F05.

### R07 · P1 · Typography and density resilience · medium

- [ ] Apply typography changes at actual scope boundaries, not only to custom properties.
- [ ] Test fallback fonts, enlarged text, long labels, multilingual text, RTL and user text spacing.
- [ ] Measure clickable targets and spacing for compact/icon-only controls.
- [ ] Define a comfortable/coarse-pointer policy without breaking named outer-height tiers.
- [ ] Check mixed control rows and nested density/type combinations.

**Exit:** documented desktop and touch use cases fit, remain operable and preserve hierarchy at zoom/narrow widths. Audit: typography/density sections.

### R08 · P1 · Surface and state refinement · medium

- [ ] Clarify what flat, outlined, raised and elevated change and which lines always survive.
- [ ] Compare borders/fills/shadows on card, menu, dialog, input and segmented together.
- [ ] Separate selection, keyboard focus, hover, pressed and invalid signals.
- [ ] Check sharp/pill corners, compact extremes and focus clipping.
- [ ] Review three real application compositions: settings/form, data/filter/empty state, command/dialog flow.

**Exit:** all four surface recipes are distinct and documented, with no required indicator lost; mixed component layouts remain harmonious. Audit: surface/radius and visual refinements.

## Milestone 4 — Prove a first release

### R09 · P0 · Public package and API contract · medium

- [ ] Fix or remove the missing token root export deliberately.
- [ ] Decide source-only versus compiled distribution; verify a clean external consumer.
- [ ] Align neutral/primary terminology and size unions across React/manifest/CSS.
- [ ] Validate export paths, declaration output, peer dependencies, styles and package contents.
- [ ] Define versioning, deprecation, changelog, project license and asset attribution.

**Exit:** a clean consumer installs a local package tarball, renders representative components and builds without workspace-only paths or undocumented transpilation. Audit: F06.

### R10 · P1 · CI, browser coverage and truthful documentation · medium

- [ ] CI runs tests, typecheck, builds, manifest parity and dogfood audit on a clean checkout.
- [ ] Add component-scoped selector/state checks and public-prop parity checks.
- [ ] Add interaction tests and selected cross-axis visual regressions.
- [ ] Publish a supported browser/React/runtime matrix and test it.
- [ ] Add manual VoiceOver/NVDA and Windows forced-color checks; record results and limits.
- [ ] Show maturity: native/complete interaction/presentation-only on component docs.
- [ ] Remove stale source claims, old preset examples and unsourced reference measurements.
- [ ] Add a docs watcher and a consumer troubleshooting page.

**Exit:** the documented installation works; example behavior matches its claims; a single release command fails on a broken test rather than succeeding after a CSS build. Audit: F08 and all acceptance checks above.

## Milestone 5 — Controlled expansion

### R11 · P2 · Profiles, custom themes and token interchange · large

- [ ] Versioned profile schema selecting existing axes, with reset/export/import.
- [ ] Custom brand/neutral/font recipes validated through the same compiler and rendered checks.
- [ ] Higher-contrast profile with a namespace-safe ownership model.
- [ ] Separate DTCG exporter and resolver-context prototype; round-trip checks.
- [ ] Design-tool library only if useful to actual consumers, using safe new tooling.

**Exit:** a custom profile can be shared and reproduced with clear validation status; it does not silently inherit shipped-theme guarantees. Depends on R02/R03/R09.

### R12 · P2 · New patterns based on product needs · variable

- [ ] Combobox with search, async/loading/empty/error states and complete keyboard behavior.
- [ ] Disclosure/Accordion, Breadcrumb/Pagination where needed.
- [ ] Reusable search/filter, empty-state and form-validation compositions.
- [ ] Consider date/time, tree, command palette, virtualization and data grid as separate projects.

**Exit:** every addition has a concrete consumer use case, behavior contract, visual states, docs and tests. Component count alone is not a completion metric.

## Definition of a first complete release

All of Milestones 1–4 are resolved, or scope is explicitly narrowed so unsupported behavior is not promised. A consumer can install Area, tune a nested theme, complete a real form/selection/dialog flow, and use it with keyboard, assistive technology, supported browsers, text enlargement and OS preferences. Every shipped component has documented ownership of behavior and styling. Changes are versioned and checked in CI. There is no unexplained red gate or silent contrast waiver behind an accessibility claim.

Milestone 5 is expansion. Area can reach a complete first release before implementing it.
