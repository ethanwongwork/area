# Link groups spec (was Navbox)

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

## Rethink, 2026-10-17 (round 34)

Owner, round 33: "rethink" (not only Wikipedia). Survey: `docs/research/articles-rethink-2026-10-17/inline-list-navbox.md`.
- Title: Area's Section heading (`title`, `level`). Groups: an auto grid, columns at least 10em, 24 apart (Vercel 24,
  Linear 16). Group heading: Nav's group label (muted, strong). Links: one per row, 4 apart (Vercel 20 + 4, Linear 28 +
  2), standalone Links.
- `divided`: a 1px divider and 16 above (MDN, GOV.UK). Dropped the frame, the centred title band, the label column,
  the stripes and the Hide / Show toggle (`expanded`, `hideLabel`…); fold a long block with Accordion if ever needed.
- Open: the name. "Navbox" is Wikipedia's word; "Link groups" or "Related links" would describe it.

## Review note, 2026-10-17 (round 34)

- **What changed:** No box, title band, tinted label column, stripes or Hide toggle. It is a Section heading (optional)
  over columns of groups; each group is a muted heading above its links, one per line. `divided` adds a rule above
  where it closes an article.
- **Why:** You asked for it not to look only like Wikipedia. Every other source (Vercel, Linear, Apple, GitHub,
  Notion, MDN, Docusaurus, GOV.UK, Primer) puts a small heading above stacked links in columns, unframed; none
  collapses at full width.

## Round 35, 2026-10-17

Owner, round 34: "reeavalute the text styles and make sure hierarchy and proper type alignment is correct" → the
footers' hierarchy (strong heading, dimmer links) and the surface title for the block.

| Part | Type | Ink | Space | Basis |
|---|---|---|---|---|
| title | surface title (`title-xs`), strong | default | 12 above the groups | Card, Dialog, Infobox title |
| group heading | UI text, strong | default | 8 above its links | Linear 13 / 510 primary, Vercel 14 / 500 gray-1000, Apple, MDN, Docusaurus: the heading is the strongest ink |
| link | UI text, regular | `fg-muted` (Link muted standalone) | 4 apart | Linear tertiary, Vercel gray-900; Vercel's 20 line + 4 |
| columns | — | — | at least 10em, 24 apart | Vercel gap-6 |
| alignment | title, headings and links share one start edge | — | — | no element is inset |

## Review note, 2026-10-17 (round 35)

- **What changed:** Three clear levels: the block's title is the same title as a Card's, each group heading is bold in
  the full text colour, and the links under it are grey. Everything starts on one edge.
- **Why:** You asked to re-check the hierarchy. Before, the title and the group headings were the same size and the
  headings were grey over full-colour links. Site footers (Vercel, Linear, Apple, MDN) do the reverse: strong headings,
  dimmer links.

## Renamed, 2026-10-17

Owner: "Link groups" (recommended: no other system calls this a navbox; site footers and docs call it link groups or a
sitemap). The family is `link-groups`: `LinkGroups` and `LinkGroup` in React, `.area-link-groups` in CSS, `linkGroups`
in the manifest. The design approved in round 35 is unchanged.
