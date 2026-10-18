# Table of contents spec

**Status:** built, in review · 2026-10-17
**Captures:** computed-style readouts below (Wikipedia, en.wikipedia.org/wiki/Lisa_Su)
**Peers:** Nav (marker), Tree view, Section heading

## Owner decisions

- 2026-10-17: "build whatever you recommend in the order you recommend", after the Wikipedia survey (docs/COMPONENTS.md,
  "From Wikipedia"). Order: Reference list, Table of contents, Figure, Infobox, Inline list, Abbreviation, Hatnote, Navbox.

## Job and boundaries

Lists a page's sections and marks the one being read, following the scroll. The rows are Nav's marker rows; the component adds the title, nesting from data, the scroll-following and collapse. Not site navigation (Nav) and not a file tree (Tree view).

## Sources

| Id | Type | What | Where |
|---|---|---|---|
| wikipedia | product (evidence) | Table of contents on an article | en.wikipedia.org/wiki/Lisa_Su (Vector 2022 on Wikimedia's Codex), built-in browser, 2026-10-17, computed styles read in the page |
| codex | design system | Wikimedia Codex, the system Vector 2022 is built on | doc.wikimedia.org/codex (not read in detail) |

Target products searched: ChatGPT and Figma have no equivalent; Notion's equivalents (table of contents block, image
caption) were not measured this round.

## Measurements

Wikipedia, computed:

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
| current | body ink and the selection rail; the rest muted | Nav marker (Area's outline) | Wikipedia bolds the current row and colours the rest blue; Area keeps one weight and neutral rows, as its other outlines |
| nesting | NavGroup `nested` (one Tree view level) | Area | Wikipedia 12 a level |
| title | UI text, strong, 16 in (the rows' text) | Wikipedia "Contents" 14 bold | — |
| following | the last heading at or above the scroller's top + `offset` + 24 is current; the last when scrolled to the end | Wikipedia's behaviour | measured once a frame |
| collapse | `collapse`: only the section being read shows its subsections | Wikipedia | no manual toggle yet |
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
