---
name: area-component-build
description: Builds or refines an Area component from measured evidence. Captures real components from ChatGPT, Notion, Figma and design systems with one script, writes the spec, builds CSS, manifest, React, demos and the Documentation entry with literal spec values, then hands off to the visual pass and the owner's review. Use whenever the user asks to build, adapt, restyle or refine a component or variant in this repository.
---

# Area component build

The process is `docs/COMPONENT_ADAPTATION.md`; read it fully once per session. This skill is
the working checklist. The owner's current direction overrides both.

Copy this checklist into your notes and tick it off:

```
- [ ] 0 Intake: is it a component, variant or setting? (new things only)
- [ ] 1 Read: spec, code, baseline, peers
- [ ] 2 Measure: references and Area, every variant × state × theme
- [ ] 3 Decide: decision table with a basis per value
- [ ] 4 Build: CSS, manifest, React, tests, demos, tiles, Documentation entry
- [ ] 5 Verify: re-capture, checks, look in the app
- [ ] 6 Visual pass (area-visual-language)
- [ ] 7 Review note and review page; owner feedback into the spec
```

## 0. Intake (new components, variants, props)

Run `area-component-intake` first. A request for "a X" may be a variant, a setting or
nothing new. Build only what the owner asked for.

## 1. Before measuring

- **The spec.** Read `docs/specs/<slug>.md`. A new family starts from
  `docs/specs/TEMPLATE.md`. For a family accepted before the evidence process, follow
  "Auditing a component built before this process" in the process doc: capture every tile
  before changing anything.
- **The code.** Read the current CSS (`packages/styles/src/components/`), React
  (`packages/react/src/components/`), the manifest entry, the demos
  (`apps/desktop/src/content/demos/`) and the Documentation entry. Know which peers share
  its roles.
- **The evidence so far.** Read `docs/research/BASELINE.md` for values already measured,
  and the primary product for the component's context.
- **Plan the sources.** Write the job, boundaries and candidate variants into the spec.
  List the sources (`docs/DESIGN_REFERENCES.md`) and where you will look in each product.

## 2. Measuring

- **Target products:** Claude in Chrome with the owner's sessions, read-only. Public docs
  sites: the built-in browser is fine.
- **Load the script.** Run the full text of `apps/docs/public/area-capture.js` with the
  browser JavaScript tool. Then call `areaCapture.pick()` or use a selector, and
  `areaCapture.capture(el, { source, variant, state, theme, slots: { shell: el, … }, rules: true })`.
- **Coverage.**
  - Capture every variant × state × theme the reference has.
  - Hover with the real pointer; reach focus with Tab.
  - Never trigger data-changing actions.
  - Ask the owner before switching a product's theme.
- **Save verbatim.**
  - Return `JSON.stringify(cap)` as a string, and save it unchanged to
    `docs/research/captures/<slug>/<source>--<variant>--<state>--<theme>.json`.
  - For many captures, move them through the clipboard or the local relay ("Browser tools"
    in the process doc).
  - If `document.visibilityState === 'hidden'`, ask the owner to bring the window forward.
  - Check each file for personal content before saving.
- **Read source at a pinned commit** for structure, variant API, state mapping and
  behaviour. Cite paths and lines.
- **Icons.** Record the reference's icon size and ink box, and the Area glyph and size that
  match the slot.

## 3. Deciding

- **Measurements.** Generate tables with `node scripts/capture-compare.mjs <files>` and paste
  them into the spec's Measurements.
- **Decision table.** Every Area value has a basis, and a value that differs from its basis
  has a reason. The basis order is: owner → target-product agreement → primary product for
  the context → primary design system → peer and baseline consistency.
- **Insets.** Write each slot's inset equation (border + shell padding + slot inset) and
  check it against the captured `edge from shell` values.
- **Shared findings.** Add new cross-product findings to the baseline, with captures.

## 4. Building

Follow `docs/ARCHITECTURE.md` › "Adding a component: the files" for where each piece goes.

- **CSS.**
  - Literal measured values go in private properties with `/* spec */`.
  - Reuse a token only when it resolves to exactly the spec value.
  - Colours use an existing semantic role that matches side by side, else
    `light-dark(…) /* spec */`.
  - Variants set local properties and the base rule consumes them; keep axes independent.
- **Shared roles.** Paint them the shared way (`docs/DESIGN_SYSTEM.md`, "Shared state
  paint", "Elevation", "Strokes"): row plates, disabled, fixed foreground, emphasis roles,
  floating frame and shadow role.
- **API words.** Use the vocabulary in `docs/GOVERNANCE.md` § 4.
- **React.** Native props and refs are forwarded, every prop has JSDoc, and keyboard
  behaviour and accessible names are complete or their gaps stated.
- **Tests.** Add `packages/react/tests/<slug>.test.mjs`. Extend `cohesion.test.mjs` when the
  component paints a shared role.
- **Demos.** One export per tile in `apps/desktop/src/content/demos/<slug>.tsx`. Tiles go in
  `specimens.mjs`, named by category (`size-sm`, `tone-danger`, `state-disabled`). Every
  manifest value gets a tile.
- **Documentation entry.** Write it with `area-component-docs`.
- **Status.** A new family goes into `REVIEW_COMPONENTS`. Only the owner moves it to
  Complete.

## 5. Verifying

1. **Re-capture.** Capture each Area variant with the same script (`source: 'area'`) in the
   app, and compare with the references. Fix or explain every difference.
2. **Checks.** Run the checks for the change ("Checks by change" in `docs/DEVELOPMENT.md`).
   For components that includes `npm run build`, the React suites, `npm run typecheck`,
   `npm run check:playgrounds -w @area/desktop` and `npm run check:docs -w @area/desktop`.
3. **Look in the app.**
   - Check light and dark, at the app's scale, and at the extremes of type, density and
     radius.
   - Relaunch Electron from this worktree when done.

## 6. Visual pass

Use the `area-visual-language` skill. Route every fix through the spec's decision table
first, then the code, then a re-capture.

## 7. Review and feedback

1. **Update the spec's current-state sections** (Variants, Anatomy, Decisions, States,
   Behavior) to match what you built.
2. **Write the review note.** Add a `## Review note, <date>` section with two plain bullets,
   no values or file names unless they are the point:

       - **What changed:** the menu's section titles now start where the row text starts.
       - **Why:** you asked for them to line up; Notion and Figma align them too.

   A new component's note says what it is for and what it is based on.
3. **Build the review page.** Run `npm run build:docs`, then
   `node apps/docs/scripts/component-review.mjs --before <dist the owner last saw>
   --before-label "main at <sha> (<date>)" --round <slugs>`. Publish it to the same review
   artifact.
4. **Report.** Send the page, the comparison table, visual-pass observations, open
   questions and anything unverified.
5. **Log owner feedback before changing code.** Add it to the spec's Feedback log
   (observation → change → evidence), then apply it. Verdicts not yet applied are open work.
