# Table of contents spec

**Captures:** computed-style readouts below (Wikipedia, en.wikipedia.org/wiki/Lisa_Su)
**Peers:** Nav (marker), Tree view, Section heading

## Owner decisions

- 2026-10-17: "build whatever you recommend in the order you recommend", after the Wikipedia survey (docs/COMPONENTS.md,
  "From Wikipedia"). Order: Reference list, Table of contents, Figure, Infobox, Inline list, Abbreviation, Hatnote, Navbox.

## Job and boundaries

Lists a page's sections and marks the one being read, following the scroll. The rows are Nav's marker rows; the component adds the "On this page" label, nesting from data (one or two levels, never folded) and the scroll-following. Not site navigation (Nav) and not a file tree (Tree view).

## Sources

| Id | Type | What | Where |
|---|---|---|---|
| wikipedia | product (evidence) | Table of contents on an article | en.wikipedia.org/wiki/Lisa_Su (Vector 2022 on Wikimedia's Codex), built-in browser, 2026-10-17, computed styles read in the page |
| codex | design system | Wikimedia Codex, the system Vector 2022 is built on | doc.wikimedia.org/codex (not read in detail) |

Target products searched: ChatGPT and Figma have no equivalent; Notion's equivalents (table of contents block, image
caption) were not measured this round.

## Measurements

Wikipedia, computed (evidence only; Area's current values are in Decisions):

| Part | Value |
|---|---|
| rows | 28 tall at 14 (text 6 above and below), sections 12 in per level |
| current | `.vector-toc-list-item-active > a`: bold, base ink #202122; the rest link blue |
| title | "Contents", 14 bold |
| collapse | a section's subsections show only while it is expanded (the current section expands); a 22 toggle at −11 |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| rows | Nav marker rows (Area's row, 28 at compact) | Wikipedia 28 at 14 | — |
| current | default ink and the selection rail (`fg-selection`); the rest `fg-muted`, regular | Nav marker (Area's outline); Notion, VitePress (round 35) | Wikipedia bolds the current row and colours the rest blue; Area keeps one weight and neutral rows, as its other outlines |
| nesting | NavGroup `nested` (Nav's nested indent); `levels` 2 (default) or 1; subsections always shown | round 34 (VitePress, Starlight, Primer, Nextra, Docusaurus, MDN) | Wikipedia 12 a level and folds subsections; `collapse` dropped in round 34 |
| title | "On this page" by default, `false` for none; UI text, strong, default ink, a row tall (`ui-row`), its text 16 in with the rows; hidden from the accessibility tree, the `nav`'s name instead | VitePress title 600 in text-1 (round 35) | Wikipedia "Contents" 14 bold |
| top | optional first row back to the top (`top`: label and id) | Area | — |
| following | the last heading at or above the scroller's top + `offset` + 24 is current; the last when scrolled to the end; `value` makes it controlled (`defaultValue`, `onValueChange`; `current` / `onCurrentChange` are deprecated aliases) | Wikipedia's behaviour; VitePress `outline.ts` | measured once a frame |
| `aria-current` | `location` | ARIA | — |

## Verification

- Gallery tiles at fit, light (headless Edge, 2x).
- Hover and pressed sweep with text contrast at light 100 + 4, light 90 + 8, dark 8 + 4 and dark 24 + 8: no text under 4.5:1.
- React: `packages/react/tests/articles.test.mjs`. Styles build: manifest parity, token references.
- Not checked: a screen reader; forced colours; Notion side by side.

## Review note, 2026-10-17

- **What it is:** A page's sections as an outline, with the section being read marked as you scroll.
- **Based on:** Wikipedia's contents panel drawn with Nav's marker rows, so it matches Area's other outlines.

## Rethink, 2026-10-17 (round 34)

Owner, round 33: "rethink" (not only Wikipedia). Survey: `docs/research/articles-rethink-2026-10-17/reference-list-toc.md`.
- `title` defaults to "On this page", in Nav's group label (muted, strong, a row tall), its text 16 in with the rows.
- `levels`: 2 (default) or 1. Dropped `collapse`. Rows, rail and the scroll rule (VitePress `outline.ts`) unchanged.
- Open: a faint marker track on every row (VitePress, MDN) would change Nav marker everywhere; not done.

## Review note, 2026-10-17 (round 34)

- **What changed:** The label is a quiet "On this page" (Nav's muted group label) instead of a bold "Contents". It
  shows two levels, or one with `levels={1}`, and the Wikipedia-style collapse is gone. The rows are unchanged:
  muted, the section being read in the full ink with its rail.
- **Why:** You asked for it not to look only like Wikipedia. Docs outlines (VitePress, Starlight, Primer, Nextra,
  Docusaurus, MDN) head it "On this page" in a quiet label, show two levels and never fold subsections.

## Round 35, 2026-10-17

Owner, round 34: "reevaluate type styles and make sure they are correct for style and fg color." → the label moves to
the default ink.

| Part | Type | Ink | Space | Basis |
|---|---|---|---|---|
| label ("On this page") | UI text, strong | default | a row tall, text 16 in | VitePress: title 600 in text-1 over text-2 links |
| row | UI text, regular | `fg-muted` | Nav marker rows (28 at the app's 13, 16 in) | Notion's outline: rows in its secondary ink; VitePress text-2 |
| current row | UI text, regular | default, with the rail in `fg-selection` | — | Nav marker; Notion marks the current row by ink (its blue), VitePress by its brand ink: Area's Selection role, neutral unless a theme makes it the accent |
| nested | — | — | Nav's nested indent | Notion 12 per level |

## Review note, 2026-10-17 (round 35)

- **What changed:** "On this page" is now in the full text colour, so it reads as the outline's heading above the grey
  section names. The section you're reading stays in the full colour with its marker.
- **Why:** You asked to re-check the type and colours. The label was grey like the rows, so only its weight told it
  apart; docs outlines (VitePress) and Notion keep the heading strong and the rows grey.
- 2026-10-19 · design-system audit → the API takes the shared vocabulary, `value` / `defaultValue` / `onValueChange`
  (DESIGN_SYSTEM.md, One API vocabulary), with `current` / `onCurrentChange` kept as deprecated aliases; the change
  callback fires outside the state updater, so StrictMode no longer calls it twice. No visual change.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.

### 2026-11-07 · The event in onValueChange (components audit O3)

- **What changed:** `onValueChange(id, event)` passes the click (absent when scrolling moved the section).
- **Why:** TableOfContents.tsx:31. From the components audit's internal peer comparison (`docs/research/components-audit-2026-11-07/internal.md`); the owner took every recommendation ("Take all recs", 2026-11-07).
- **Verdict:** awaiting the owner.

### 2026-11-11 · Ink, dark and colour (system plan, Phase 1)

- **What changed:** The title is muted (plan A9.4, finding T3), reversing round 34's default ink by the owner's 2026-11-11 pick.
- **Why:** docs/research/system-evaluation-2026-11-11 (README §5); the owner took every recommendation on 2026-11-11.
- **Verdict:** awaiting the owner.

### 2026-11-14 · Shared parts, leftovers (system plan, Phase 2, wave 3)

- The title's sides read the row role, `2 × ui-row-inset` and `ui-row-inset` (16 and 8 at every density, the marker rows' start): the same values.
- Why: docs/research/system-evaluation-2026-11-11 (plan B6.1, B6.5, B8.2, B2.2; README §5, phase2/leftovers.md); the owner took every recommendation on 2026-11-11. Fix the rule, not the instance.
- Verdict: awaiting the owner.
