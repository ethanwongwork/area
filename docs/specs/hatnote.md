# Hatnote spec

**Captures:** computed-style readouts below (Wikipedia, en.wikipedia.org/wiki/Lisa_Su)
**Peers:** Alert, Link

## Owner decisions

- 2026-10-17: "build whatever you recommend in the order you recommend", after the Wikipedia survey (docs/COMPONENTS.md,
  "From Wikipedia"). Order: Reference list, Table of contents, Figure, Infobox, Inline list, Abbreviation, Hatnote, Navbox.

## Job and boundaries

"For other uses, see …" at the top of an article or section: points readers who wanted another page. Not an Alert (no status).

## Sources

| Id | Type | What | Where |
|---|---|---|---|
| wikipedia | product (evidence) | Hatnote on an article | en.wikipedia.org/wiki/Lisa_Su (Vector 2022 on Wikimedia's Codex), built-in browser, 2026-10-17, computed styles read in the page |
| codex | design system | Wikimedia Codex, the system Vector 2022 is built on | doc.wikimedia.org/codex (not read in detail) |

Target products searched: ChatGPT and Figma have no equivalent; Notion's equivalents (table of contents block, image
caption) were not measured this round.

## Measurements

Wikipedia, computed:

| Part | Value |
|---|---|
| hatnote | body size (16 / 26), italic, 1.6em in, 0.5em under; titles inside set upright. Mobile skin: subtle ink #54595d on a tint |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| indent | 1.6em | Wikipedia | — |
| ink | muted | Wikipedia's mobile skin (subtle ink) | Area's type has no italic, so the muted ink alone marks it as a note |
| space | 8 under; a second hatnote 2 under the first | Wikipedia 0.5em | — |
| semantics | `role="note"` | ARIA | — |

## Verification

- Gallery tiles at fit, light (headless Edge, 2x).
- Hover and pressed sweep with text contrast at light 100 + 4, light 90 + 8, dark 8 + 4 and dark 24 + 8: no text under 4.5:1.
- React: `packages/react/tests/articles.test.mjs`. Styles build: manifest parity, token references.
- Not checked: a screen reader; forced colours; Notion side by side.

## Review note, 2026-10-17

- **What it is:** A small indented note at the top of an article pointing to other pages.
- **Based on:** Wikipedia's hatnote; muted instead of italic, since Area's typeface has no italic.
