---
name: area-component-build
description: Build or refine an Area component from measured evidence. Use whenever the user asks to build, adapt, restyle or refine a component or variant in this repository. Captures real components from ChatGPT, Notion, Figma and design systems with one script, writes the spec sheet, builds with literal spec values, then hands off to the area-visual-language pass.
---

# Area component build

The canonical process is `docs/COMPONENT_ADAPTATION.md`. Read it fully once per session
before starting; this skill is the working checklist. The owner's current direction
overrides both.

## Before measuring

1. Read the component's spec (`docs/specs/<slug>.md`). If there is none, copy
   `docs/specs/TEMPLATE.md` and move the component's section out of
   `docs/specs/PRIOR_DECISIONS.md` into its Owner decisions. For a family accepted before
   the evidence process, follow "Auditing a component built before this process" in
   `docs/COMPONENT_ADAPTATION.md`: capture every tile before changing anything.
2. Read the current CSS (`packages/styles/src/components/`), React
   (`packages/react/src/components/`), manifest entry and gallery demos, so you know what
   exists and which peers share its roles.
3. Read `docs/research/BASELINE.md` for values already measured, and the primary product
   for this component's context.
4. Write the job, boundaries and candidate variants into the spec. Then list the sources
   (`docs/DESIGN_REFERENCES.md`), including where you will look in each target product.

## Measuring

- Target products: use Claude in Chrome (the owner's sessions), read-only. Public docs
  sites: the built-in browser is fine.
- Inject `apps/docs/public/area-capture.js` (read the file and run its full text with the
  JavaScript tool), then `areaCapture.pick()` or a selector, then
  `areaCapture.capture(el, { source, variant, state, theme, slots: { shell: el, … }, rules: true })`.
- Capture every variant × state × theme that the reference has. Hover with the real
  pointer; reach focus with Tab. Never trigger data-changing actions. Ask the owner
  before switching a product's theme.
- Return `JSON.stringify(cap)` as a string (browser tools re-sort returned objects) and
  save it verbatim to `docs/research/captures/<slug>/<source>--<variant>--<state>--<theme>.json`.
  For many captures, collect them in a page variable and move them out through the
  clipboard or the local relay described under "Browser tools" in the process doc. If the
  window is hidden (`document.visibilityState === 'hidden'`), ask the owner to bring it
  forward rather than working around it.
  The comparison script rejects the file if its checksum doesn't match. Check it for
  personal content first (redaction is on by default off localhost).
- Read the source at a pinned commit for structure, variant API, state mapping and
  behavior. Cite file paths and line numbers.
- Record the reference's icon size and ink box, and the Fluent cut that matches the slot.

## Deciding

- Generate the tables with `node scripts/capture-compare.mjs <files>` and paste them into
  the spec's Measurements section.
- Fill the decision table. Basis order: owner → target-product agreement → primary
  product for the context → primary design system → peer/baseline consistency. Every
  Area value has a basis; a value that differs from its basis has a reason.
- Write each slot's inset equation (border + shell padding + slot inset) and check it
  against the captured `edge from shell` values.
- Add new cross-product findings to the baseline, with captures.

## Building

- Literal measured values in component-private properties, each with `/* spec */`.
  Reuse a token only when it resolves to exactly the spec value. Colors: an existing
  semantic role that matches side by side, otherwise `light-dark(…) /* spec */`.
- Variants set local properties; the base rule consumes them. Keep axes independent.
- Keep native props, refs, keyboard behavior, focus and accessible names working.
- Paint shared roles the shared way (row plates, disabled, fixed foreground, neutral
  markers, the floating lift): `docs/DESIGN_SYSTEM.md`, "Shared state paint". The styles
  build rejects a `var(--area-*)` that names no token.
- Update CSS, manifest, React, demos (one variant per gallery tile) and the docs page
  together.

## Verifying and handing off

1. Capture each Area variant with the same script (`source: 'area'`), save it, and run
   the comparison with the references. Fix or explain every difference.
2. Run the checks in `docs/DEVELOPMENT.md` for the change.
3. Do the visual pass with the `area-visual-language` skill.
4. Make sure every manifest value has a gallery tile, named by category (`size-sm`,
   `tone-accent`, `state-disabled`) so the gallery groups it. Every family's Pass review
   (built from the spec and captures) shows its audit, visual pass and Claude in Chrome
   evidence and the default tile at 2×. After a visual pass compared side by side in Claude in
   Chrome, record it in `apps/docs/src/pass-status.mjs`. Temporary `GalleryReview<Name>` rows
   (removed once seen) are only for subtle side-by-sides: each change in its own row, before
   and after, at 1× and 3×.
5. Report to the owner: gallery links, the comparison table, visual-pass observations,
   open questions, and anything unverified. Status stays In review until the owner
   accepts it in `apps/docs/src/component-status.mjs`.
6. Log owner feedback in the spec (observation → change → evidence) before changing code.
