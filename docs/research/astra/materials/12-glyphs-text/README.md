# Materials 12 — glyphs and text

**Question:** How can engraved, embossed, glowing, duotone and gradient glyphs, and letterpress or glowing text, fit Area's material layer without losing its stroked construction or legibility at 12–16px?

**Answer:** Keep functional glyphs and small text in readable semantic ink by default. CSS can add shallow relief or glow to unchanged stroked SVGs; gradients need an SVG paint server, and true duotone needs semantic parts. Broad bevels, glass bodies and interior shading need a filled silhouette, which Area already derives for many icons; filling every path is incorrect. At 12–16px, decoration competes with the stroke and its gaps, so reserve it for reviewed display inscriptions, keep a plain fallback and never use glow as the only state cue. This research establishes capability and risks, not approved small-size presets or a human legibility result.

**Snapshot:** checked **2026-10-09**; Area `origin/main` **831f819e5b55b5ca0033fd628eeb9f95ccb92df7**; research input **35c0986eeccffbcd756ec552661fb804cf03bf7b**. Read the materials brief, icon spec, icon-construction guidance and tasks 01/03/05/08/11. [Sources](sources.md) pin Area lines separately from research proposals and date the public standards/docs. Research only; no production drawings, specs, tokens, approval statuses or APIs changed.


<!-- task19-changes -->
## Changes after review — 2026-10-11

Task 19 corrections, with the reason from [Corrections for Astra and D1–D16](../REVIEW.md). Older Answer/Snapshot passages below retain their original date and findings unless explicitly refreshed; the changes here and decision callouts govern subsequent work.

- **C18 — Review reason:** Duotone part names collide with production filled-icon knockout grouping. **Change:** Separated research labels into data-material-part/data-material-ink, updated fixture generator/CSS, and pinned the production knockout grouping source. Outline geometry remains unchanged. Files: [build-fixtures.py](build-fixtures.py), [fixtures.json](fixtures.json), [lab.css](lab.css), [treatments.md](treatments.md). Decisions: D13.

Full change ledger and verification: [19-corrections](../19-corrections/README.md).
<!-- /task19-changes -->

## Evidence

- [Treatments and implementation boundaries](treatments.md): seven requested treatments, layer records, CSS/markup/filled distinctions, font handling and Area integration.
- [Small-size policy and checks](legibility.md): 12/14/16px risks, contrast, semantic state, preferences, board coverage and exact validation procedure.
- [Comparison lab](index.html): unchanged generated outline geometry for Search and Calendar; seven treatments beside plain ink, light/dark, 12/14/16px. Every number is either imported from the pinned renderer or explicitly authored in `lab.css`/`lab.js`. These are demonstrations, including deliberately visible risk cases, not safe presets.
- [Verification](verification.md): actual execution coverage, limitations and reproduction.

The implementation matters more than the spec's opening historical summary. `Glyph` is a small package renderer with a size union and no material/part API; the docs pilot has richer derived filled variants. The historical uniform-scaling recommendation is superseded by the size curve. [A1–A5](sources.md#area-source-ledger)

## Proposals

**Recommended — opt-in inscriptions.** Keep task 05's `None` absorption for functional text/glyphs and task 11's no-filter budget for dense UI. A material may supply a static decoration recipe only for explicitly eligible display content. The recipe records semantic ink separately, its original silhouette, effect bounds, role/context and plain fallback. Prototype named semantic parts before promising duotone across the set. Existing Surface ownership and typography weight remain intact. [R1–R4](sources.md#research-inputs)

**Alternative — automatic styling of every glyph/text role.** Cheaper theme authoring, but loses the distinction between a decorative inscription and a required mark, incorrectly recolors masks and intrinsic images, and multiplies dense-row filters. Reject as the default; the current renderers and small-size evidence do not support it. [A1–A6](sources.md#area-source-ledger)

## Open questions

- Which display inscriptions should be the first owner-reviewed exception? The board supplies descriptions, not attached source images or measurements of their glyph effects.
- Should semantic duotone parts be exported by the pilot generator, and which parts are legitimate emphasis rather than a new state meaning?
- No user recognition study, native Windows forced-colors run, assistive-technology run, or measured performance budget for these exact effects is included. Browser rendering alone cannot approve 12–16px legibility.
