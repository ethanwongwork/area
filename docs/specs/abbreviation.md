# Abbreviation spec

**Status:** built, in review · 2026-10-17
**Captures:** computed-style readouts below (Wikipedia, en.wikipedia.org/wiki/Lisa_Su)
**Peers:** Tooltip, Link

## Owner decisions

- 2026-10-17: "build whatever you recommend in the order you recommend", after the Wikipedia survey (docs/COMPONENTS.md,
  "From Wikipedia"). Order: Reference list, Table of contents, Figure, Infobox, Inline list, Abbreviation, Hatnote, Navbox.

## Job and boundaries

Marks an abbreviation and shows its expansion in an Area Tooltip, on hover and keyboard focus.

## Sources

| Id | Type | What | Where |
|---|---|---|---|
| wikipedia | product (evidence) | Abbreviation on an article | en.wikipedia.org/wiki/Lisa_Su (Vector 2022 on Wikimedia's Codex), built-in browser, 2026-10-17, computed styles read in the page |
| codex | design system | Wikimedia Codex, the system Vector 2022 is built on | doc.wikimedia.org/codex (not read in detail) |

Target products searched: ChatGPT and Figma have no equivalent; Notion's equivalents (table of contents block, image
caption) were not measured this round.

## Measurements

Wikipedia, computed:

| Part | Value |
|---|---|
| abbr[title] | `text-decoration: underline dotted`, `cursor: help`; the expansion in the browser's title tooltip |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| line | dotted, 1 stroke, Link's 0.25em offset | Wikipedia dotted | Link's offset |
| expansion | an Area Tooltip that describes the abbreviation; no `title` | PRODUCT_UI rule 4 (never the browser's title) | Wikipedia uses the browser's title |
| focus | focusable (`tabIndex` 0) with the focus ring | keyboard access to the expansion | Wikipedia's isn't focusable |

## Verification

- Gallery tiles at fit, light (headless Edge, 2x).
- Hover and pressed sweep with text contrast at light 100 + 4, light 90 + 8, dark 8 + 4 and dark 24 + 8: no text under 4.5:1.
- React: `packages/react/tests/articles.test.mjs`. Styles build: manifest parity, token references.
- Not checked: a screen reader; forced colours; Notion side by side.

## Review note, 2026-10-17

- **What it is:** An abbreviation with a dotted underline; its full form shows on hover or focus.
- **Based on:** Wikipedia's abbr, with Area's Tooltip instead of the browser's.
