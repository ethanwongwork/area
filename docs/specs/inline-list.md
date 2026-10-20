# Inline list spec

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

Wikipedia, computed (evidence only; Area's current values are in Decisions):

| Part | Value |
|---|---|
| hlist | `li` inline; `li::after { content: " · "; font-weight: bold }` on all but the last |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| separator | `dot` (default): "·", regular, `fg-muted`, 8 either side; `rule`: a `stroke-width` (1px) line, 1em tall, `border-divider`, 8 either side; `none`: 16 between items | round 34: Docusaurus 8; shadcn, Radix, MUI, Apple; GitHub 16 | Wikipedia's bold dot, `bar` and `comma` dropped in round 34 |
| layout | a flex row that wraps; `dot` on the baseline, `rule` and `none` centred on the line | round 34 | a rule or an icon has no baseline |
| wrapping | the mark is the previous item's `::after`, so a wrapped line never starts with one | round 34 | — |
| items | the context's type and ink; a link is Link's `standalone` (underlined on hover only), in any of its inks | round 35 | — |
| semantics | `ul role="list"` | Safari drops list semantics without markers | — |

## Verification

- Gallery tiles at fit, light (headless Edge, 2x).
- Hover and pressed sweep with text contrast at light 100 + 4, light 90 + 8, dark 8 + 4 and dark 24 + 8: no text under 4.5:1.
- React: `packages/react/tests/articles.test.mjs`. Styles build: manifest parity, token references.
- Not checked: a screen reader; forced colours; Notion side by side.

## Review note, 2026-10-17

- **What it is:** Short items in a line with a dot (or bar, or comma) between them.
- **Based on:** Wikipedia's hlist, as used in its navboxes and categories bar.

## Rethink, 2026-10-17 (round 34)

Owner, round 33: "rethink" (not only Wikipedia). Survey: `docs/research/articles-rethink-2026-10-17/inline-list-navbox.md`.
- `separator`: `dot` (default; regular, `fg-muted`, 8 either side), `rule` (1px `border-divider`, 1em tall, 8 either
  side), `none` (16 gap, GitHub). Dropped `bar`, `comma` and the bold weight.
- A flex row that wraps; the mark is the previous item's `::after`, so no line starts with one. `rule` and `none`
  centre items on the line (an icon or a rule has no baseline).

## Review note, 2026-10-17 (round 34)

- **What changed:** The separator is no longer Wikipedia's bold dot. `dot` is a regular muted dot 8 from each item;
  `bar` became `rule`, a 1px divider line; `comma` is gone (write commas in the text); new `none` leaves 16 of space
  for metadata that starts each item with an icon.
- **Why:** You asked for it not to look only like Wikipedia. No other source bolds the separator; most use space
  alone (GitHub, MDN, GOV.UK) or a quiet dot or rule (Docusaurus; shadcn, Radix, MUI, Apple).

## Round 35, 2026-10-17

Owner, round 34: "should the underline still be there on rest like the links? is there a colored version?" → links in
an Inline list are standalone: underlined on hover, not at rest. A link in a sentence is underlined so it stands out
from the words around it; a row of links is all links, as a site footer's or GitHub's topics, so the underline would
only add noise (Link spec: `inline` for prose, `standalone` outside a sentence). Colour is Link's: any of its inks; a
new tile shows the link blue.

| Part | Type | Ink | Space | Basis |
|---|---|---|---|---|
| item | the context's | the context's (a link: Link's ink) | — | GitHub's metadata, Docusaurus |
| `dot` | the item's size, regular | `fg-muted` | 8 either side | Docusaurus 8 |
| `rule` | 1px × 1em | `border-divider` | 8 either side | shadcn, Radix, MUI, Apple |
| `none` | — | — | 16 between items | GitHub 16 |

## Review note, 2026-10-17 (round 35)

- **What changed:** A new example shows the list with blue links. Links in a list stay underlined only on hover.
- **Why:** You asked about the underline and a coloured version. A link in a sentence is underlined to stand out from
  the words around it; a row of links needs no underline, as GitHub's topics and site footers. Any of Link's colours
  works here.
- 2026-10-19 · design-system audit → demo copy uses the placeholder vocabulary (Label, Value, 1) instead of a date, a
  read time and a star count.
