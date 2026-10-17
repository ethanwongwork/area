# Reference list spec

**Status:** built, in review · 2026-10-17
**Captures:** computed-style readouts below (Wikipedia, en.wikipedia.org/wiki/Lisa_Su)
**Peers:** Citation (footnote), Link, Nav marker

## Owner decisions

- 2026-10-17: "build whatever you recommend in the order you recommend", after the Wikipedia survey (docs/COMPONENTS.md,
  "From Wikipedia"). Order: Reference list, Table of contents, Figure, Infobox, Inline list, Abbreviation, Hatnote, Navbox.

## Job and boundaries

Lists the notes a footnote (Citation `variant="footnote"`) points at: numbered, each led by links back to where it is cited. Not a bibliography layout (the note's text is the caller's) and not a Description list (no labels).

## Sources

| Id | Type | What | Where |
|---|---|---|---|
| wikipedia | product (evidence) | Reference list on an article | en.wikipedia.org/wiki/Lisa_Su (Vector 2022 on Wikimedia's Codex), built-in browser, 2026-10-17, computed styles read in the page |
| codex | design system | Wikimedia Codex, the system Vector 2022 is built on | doc.wikimedia.org/codex (not read in detail) |

Target products searched: ChatGPT and Figma have no equivalent; Notion's equivalents (table of contents block, image
caption) were not measured this round.

## Measurements

Wikipedia, computed:

| Part | Value |
|---|---|
| ol | 0.9 of the body: 14.4 / 23.4 on 16; markers 3.2em in (46.08) |
| li | 0.1em apart (1.44); in columns `column-width: 27em` (Vector 2022), `break-inside: avoid-column` |
| backlinks | "↑" for one citation (aria-label "Jump up"), "^ a b c" for several, the letters raised, bold, italic; link blue #36c; `user-select: none` |
| target | `ol.references li:target { background-color: #e8eeff }` |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| type | Area's small text (14 / 20) | Wikipedia 0.9 of the body | the type scale, not a ratio |
| markers | 3.2em in, muted ink, tabular figures | Wikipedia 3.2em | muted so the notes lead |
| item gap | 2 | Wikipedia 0.1em (1.44) | — |
| columns | `columns`: 27em, gap 32 | Wikipedia 27em | — |
| backlinks | ↑ for one; ↑ then raised a b c for several; `ink` as Link's, blue by default | Wikipedia | letters strong, upright: Area's type has no italic (Geist upright only, `font-synthesis: none`) |
| highlighted | `:target` or `highlighted`: Nav marker's selection rail at the list's start edge | Area's current-location mark (Nav marker, TOC) | Wikipedia tints the note (#e8eeff); a filled plate left the blue backlinks at 3.16:1 at dark 24 + 8 |

## Verification

- Gallery tiles at fit, light (headless Edge, 2x).
- Hover and pressed sweep with text contrast at light 100 + 4, light 90 + 8, dark 8 + 4 and dark 24 + 8: no text under 4.5:1.
- React: `packages/react/tests/articles.test.mjs`. Styles build: manifest parity, token references.
- Not checked: a screen reader; forced colours; Notion side by side.

## Review note, 2026-10-17

- **What it is:** A list of numbered notes for footnotes to point at, each with ↑ (or ↑ a b c) back to where it is cited; long lists can run in columns.
- **Based on:** Wikipedia's references, in Area's small text and the link blue, with the note you jumped to marked by the same rail as the current section in a table of contents.
