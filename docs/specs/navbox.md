# Navbox spec

**Status:** built, in review · 2026-10-17
**Captures:** computed-style readouts below (Wikipedia, en.wikipedia.org/wiki/Lisa_Su)
**Peers:** Card, Inline list, Table, Accordion

## Owner decisions

- 2026-10-17: "build whatever you recommend in the order you recommend", after the Wikipedia survey (docs/COMPONENTS.md,
  "From Wikipedia"). Order: Reference list, Table of contents, Figure, Infobox, Inline list, Abbreviation, Hatnote, Navbox.

## Job and boundaries

Groups links to related pages under one title at the foot of an article, collapsible. Not site navigation (Nav) and not a data Table.

## Sources

| Id | Type | What | Where |
|---|---|---|---|
| wikipedia | product (evidence) | Navbox on an article | en.wikipedia.org/wiki/Lisa_Su (Vector 2022 on Wikimedia's Codex), built-in browser, 2026-10-17, computed styles read in the page |
| codex | design system | Wikimedia Codex, the system Vector 2022 is built on | doc.wikimedia.org/codex (not read in detail) |

Target products searched: ChatGPT and Figma have no equivalent; Notion's equivalents (table of contents block, image
caption) were not measured this round.

## Measurements

Wikipedia, computed:

| Part | Value |
|---|---|
| box | 1px #a2a9b1 hairline, #fdfdfd, 0.88 of the body, 3 in |
| title | centred bold band (#ccf); "hide" at its end |
| groups | group name bold, end-aligned, on #ddf, padding 3.52 / 14.08; lists (hlist) beside it; rows 2 apart (white borders); every other list striped #f7f7f7 |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| box | Card's paint (surface, `border-card`, container corner, resting shadow); small text | Wikipedia's box | Card's paint |
| title band | the control fill, title strong and centred, Button ghost sm "Hide" / "Show" at the end (`aria-expanded`) | Wikipedia | neutral paint |
| groups | name strong, end-aligned, on the control fill, 6 / 12; lists 6 / 12; rows divided by `border-divider` at stroke width | Wikipedia | dividers instead of 2px white gaps |
| stripes | every other list on `bg-stripe` | Wikipedia | — |
| collapsed | the body `hidden` | Wikipedia's mw-collapsible | — |

## Verification

- Gallery tiles at fit, light (headless Edge, 2x).
- Hover and pressed sweep with text contrast at light 100 + 4, light 90 + 8, dark 8 + 4 and dark 24 + 8: no text under 4.5:1.
- React: `packages/react/tests/articles.test.mjs`. Styles build: manifest parity, token references.
- Not checked: a screen reader; forced colours; Notion side by side.

## Review note, 2026-10-17

- **What it is:** A box of related links in named groups, with a Hide / Show toggle, for the foot of an article.
- **Based on:** Wikipedia's navbox in Card's paint, with Inline lists for the links.
