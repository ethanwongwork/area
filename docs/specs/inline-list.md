# Inline list spec

**Status:** built, in review · 2026-10-17
**Captures:** computed-style readouts below (Wikipedia, en.wikipedia.org/wiki/Lisa_Su)
**Peers:** Breadcrumb, Badge group, Link

## Owner decisions

- 2026-10-17: "build whatever you recommend in the order you recommend", after the Wikipedia survey (docs/COMPONENTS.md,
  "From Wikipedia"). Order: Reference list, Table of contents, Figure, Infobox, Inline list, Abbreviation, Hatnote, Navbox.

## Job and boundaries

Runs short items along a line with a separator between them. Not a Breadcrumb (a path) and not a Badge group.

## Sources

| Id | Type | What | Where |
|---|---|---|---|
| wikipedia | product (evidence) | Inline list on an article | en.wikipedia.org/wiki/Lisa_Su (Vector 2022 on Wikimedia's Codex), built-in browser, 2026-10-17, computed styles read in the page |
| codex | design system | Wikimedia Codex, the system Vector 2022 is built on | doc.wikimedia.org/codex (not read in detail) |

Target products searched: ChatGPT and Figma have no equivalent; Notion's equivalents (table of contents block, image
caption) were not measured this round.

## Measurements

Wikipedia, computed:

| Part | Value |
|---|---|
| hlist | `li` inline; `li::after { content: " · "; font-weight: bold }` on all but the last |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| separator | `dot` " · " (default), `bar` " \| ", `comma` ", " | Wikipedia's hlist | — |
| ink | the separator in the muted ink, strong (dot) | Wikipedia bold, base ink | muted, so the items lead |
| wrapping | a no-break space before the separator, so a line never starts with one | Wikipedia | — |
| semantics | `ul role="list"` | Safari drops list semantics without markers | — |

## Verification

- Gallery tiles at fit, light (headless Edge, 2x).
- Hover and pressed sweep with text contrast at light 100 + 4, light 90 + 8, dark 8 + 4 and dark 24 + 8: no text under 4.5:1.
- React: `packages/react/tests/articles.test.mjs`. Styles build: manifest parity, token references.
- Not checked: a screen reader; forced colours; Notion side by side.

## Review note, 2026-10-17

- **What it is:** Short items in a line with a dot (or bar, or comma) between them.
- **Based on:** Wikipedia's hlist, as used in its navboxes and categories bar.
