# Area — completion roadmap

**Updated:** 2026-09-14. Source: [system audit](SYSTEM_AUDIT.md).
**Scope:** a reusable web application design system, with a verified CSS contract and usable React components. Items below are a milestone checklist, not completed changes. The user has authorized broad system improvements; the detailed work order and design authority are in [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md). External publishing/push authorization remains separate.

## Start here

Follow [the execution plan](IMPLEMENTATION_PLAN.md): regression baseline and theme scoping first,
then semantic contrast/strokes, API/package cleanup, behavior and component completion.
Its E01–E12 batches refine the order of the milestone checklist below.

E03 resolves the 75/100/150 trial's failures: decoration remains quiet at 75, supplementary
frames/outlines return to 150/200, and required control/state edges gain explicit 3:1 contracts.
See [the final contrast policy](CONTRAST.md). E04 completes API/package consistency. The next milestone is **interaction architecture**,
then **working interaction primitives**. Further palette expansion is not the priority.

Effort bands describe uncertainty and scope, not calendar commitments: **small** is one focused change; **medium** spans several modules and a focused test suite; **large** needs a design/API decision, implementation and browser/assistive-technology validation. Dependencies matter more than the bands.

E01 tooling and visual baseline is complete: [results and screenshots](batches/E01/README.md).
E02 scope implementation is complete: [contract and browser evidence](batches/E02/README.md).
Gecko validation remains pending. E01–E04 are implemented; E05 is next; the foundation and release milestones remain open.

## Milestone 1 — Trust the rendered foundation

### R01 · P0 · Resolve the stroke trial · small

- [x] Review 75/100/150 in flat/outlined surfaces, light/dark, all neutral casts.
- [x] Decide which borders are decorative, supplementary, or required control/state indicators.
- [x] Select release values and rerun the unchanged gate; document any policy change separately with rationale.
- [x] Preserve a comparison of the trial and release hierarchy in the journal.

**Exit:** no unexplained gate failure; no blanket claim that a quiet stroke meets non-text contrast. The user has authorized final token/value decisions that improve consistency and quality; preserve the quiet visual direction and justify the result with measurements. Audit: stroke section, F02–F03.

### R02 · P0 · Repair scoped themes · medium

- [x] Define inherited theme + brand + neutral resolution and explicit reset rules.
- [x] Fix dark parent → brand/neutral child and dark parent → light child.
- [x] Add native light color-scheme reset and verify controls.
- [x] Specify how portals inherit the effective scope.
- [x] Validate dark maps for extra keys, namespace collisions and invalid values.

**Exit:** multi-level nesting equals `resolveTheme()` for all color selections; test both attribute placement and attribute removal. Do not rely only on same-element theme selections. Audit: F01, F08.

**Validation remaining:** execute the scope matrix in Gecko; Chromium and Safari passed.

### R03 · P0 · Make contrast tests reflect actual UI · medium

- [x] Apply normal-text requirements to normal-size hover labels and placeholders.
- [x] Resolve four syntax-color waiver groups through semantic color selection.
- [x] Measure translucent focus rings and actual adjacent surfaces.
- [x] Inventory unchecked glyphs, selected/invalid states, outline controls and active backgrounds.
- [x] Add forced-color focus/selection fallbacks and inspect fixture keyboard clipping.
- [ ] Validate the fallbacks in native Windows forced colors and rerun supported engines.
- [x] Label aesthetic floors, WCAG requirements and supplementary APCA policy distinctly.

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

- [x] Fix the token root export deliberately (E04 configuration helpers).
- [x] Compile ESM/declarations; verify isolated local tarball consumption (E04).
- [x] Align neutral/accent terminology and size unions across React/manifest/CSS (E04).
- [x] Validate export paths, declarations, installed peers, CSS and package contents (E04; peer-version matrix remains release work).
- [ ] Define versioning, deprecation, changelog, project license and asset attribution.

**Exit:** a clean consumer installs a local package tarball, renders representative components and builds without workspace-only paths or undocumented transpilation. Audit: F06.

### R10 · P1 · CI, browser coverage and truthful documentation · medium

- [ ] CI runs tests, typecheck, builds, manifest parity and dogfood audit on a clean checkout.
- [x] Add component-scoped selector/state checks and typed public-prop fixtures (E04).
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
