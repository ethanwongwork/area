# Infobox spec

**Captures:** computed-style readouts below (Wikipedia, en.wikipedia.org/wiki/Lisa_Su)
**Peers:** Card, Description list, Figure

## Owner decisions

- 2026-10-17: "build whatever you recommend in the order you recommend", after the Wikipedia survey (docs/COMPONENTS.md,
  "From Wikipedia"). Order: Reference list, Table of contents, Figure, Infobox, Inline list, Abbreviation, Hatnote, Navbox.
- 2026-10-19 (review page, docs pass): the lead image takes the container corner (`radius-container`), the standalone-image rule Figure and Asset card follow.

## Job and boundaries

Summarises a subject beside or above the content: a start-aligned header (optional media, a title, an optional subtitle, an optional action), then labelled facts in sections. Fills its column; unframed by default, `framed` puts it in Card's frame. A caption belongs to a Figure. Not a property editor (Property list) and not a form.

## Sources

| Id | Type | What | Where |
|---|---|---|---|
| wikipedia | product (evidence) | Infobox on an article | en.wikipedia.org/wiki/Lisa_Su (Vector 2022 on Wikimedia's Codex), built-in browser, 2026-10-17, computed styles read in the page |
| codex | design system | Wikimedia Codex, the system Vector 2022 is built on | doc.wikimedia.org/codex (not read in detail) |

Target products searched: ChatGPT and Figma have no equivalent; Notion's equivalents (table of contents block, image
caption) were not measured this round.

## Measurements

Wikipedia, computed (evidence only; Area's current values are in Decisions):

| Part | Value |
|---|---|
| box | 22em (309.76 at 14.08), 0.88 of the body (14.08 / 21.12), float right, margin 7 0 7 14; #f8f9fa with a 1px #a2a9b1 hairline |
| title | 1.25em bold, centred |
| image | centred, caption centred under it |
| section | a centred bold band on a tint (#b0c4de here) |
| rows | label bold, about 40% (120.8 of 296), value; both top-aligned |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| box | fills its column; header and sections 12 apart; unframed | GitHub's About, Figma's inspector (round 34) | Wikipedia's 22em float dropped in round 34 |
| framed | Card's paint: `bg-surface`, `border-card`, container corner, `shadow-edge` then `shadow-resting`; 12 in, the border counted once | Card; spacing audit 2026-10-17; settings collisions 2026-10-18 | — |
| type | UI text (`ui-size` / `ui-leading`) | round 35 | one Area role per level |
| header | media 8 above the title row; title and subtitle 2 apart | round 35 (proximity) | — |
| media | `img`, `video`, `svg`, `picture` at the container corner (`radius-container`), a standalone image as Figure | DESIGN_SYSTEM "Image corners"; owner, 2026-10-19 | was `radius-small` |
| title | surface title (`title-xs`), strong, start-aligned | Card's and Dialog's title (round 35) | Wikipedia 1.25em bold, centred |
| subtitle | UI text, `fg-muted` | Card's description (round 35) | — |
| action | one control at the end of the title row, centred on the title's first line | Ant Descriptions' extra, GitHub's About gear (round 36) | — |
| section | 12 apart, a 1px `border-divider` rule (`stroke-width`) between, `border-decorative` when framed (a seam inside the card; round 56); heading 6 above its rows | GitHub's About, Figma (round 34–35) | Wikipedia's tinted band dropped |
| heading | UI text, strong, default ink | Section heading's title (round 35) | — |
| rows (`columns`, default) | label column as wide as the section's longest label (`fit-content(40%)`, shared through subgrid), value 12 (`gap-row`) after it, rows 4 apart, top-aligned | Wikipedia's column is sized by its labels (MediaWiki gives `.infobox` no width); Ant Descriptions and Radix DataList size it to the labels; label → value Radix 12–16, Notion 14, Chakra 16 | round 35: a fixed 120, value 8 after it; the owner (round 67): "the gaps between the columns is huge" |
| rows (`stacked`) | label 4 above its value, pairs 8 apart | App Store's Information; Radix, Chakra `vertical` (round 36) | — |
| label | UI text, regular, `fg-muted` | Description list's term ink | Wikipedia bolds labels |
| value | UI text, regular, default ink | round 35 | — |

## Verification

- Gallery tiles at fit, light (headless Edge, 2x).
- Hover and pressed sweep with text contrast at light 100 + 4, light 90 + 8, dark 8 + 4 and dark 24 + 8: no text under 4.5:1.
- React: `packages/react/tests/articles.test.mjs`. Styles build: manifest parity, token references.
- Not checked: a screen reader; forced colours; Notion side by side.

## Review note, 2026-10-17

- **What it is:** A side card that sums up a subject: title, image, and labelled facts in sections.
- **Based on:** Wikipedia's infobox in Card's paint, with Description list's quiet labels.

## Rethink, 2026-10-17 (round 34)

Owner, round 33: "rethink" (not only Wikipedia). Survey: `docs/research/articles-rethink-2026-10-17/figure-infobox.md`.
- Composition of Area parts: header (media, title in the strong weight, muted subtitle), sections of a heading (Nav's
  group label: muted, strong) over a **Description list** (`columns`, term column 120, Radix and Chakra's minimum),
  a 1px divider and 12 between sections (GitHub, Figma).
- `framed`: Card's surface, edge, corner and resting shadow, 12 in. Default unframed.
- Dropped: centred title and media, the media caption (a caption is a Figure), grey heading bands, the 2fr : 3fr grid,
  the fixed 22em width, `align` floats.
- Not done: Description list `stacked` (label above value; App Store, Chakra) would change an approved family; ask first.

## Review note, 2026-10-17 (round 34)

- **What changed:** No more centred title, centred photo or grey section bands. The header starts at the edge (media,
  title, a muted subtitle); each section is a muted heading over Description list rows, with a divider between
  sections. Unframed by default and fills its column; `framed` puts it in Card's frame. The floats are gone.
- **Why:** You asked for it not to look only like Wikipedia. GitHub's About sidebar, the App Store's Information,
  Figma's inspector, Notion's properties and Linear all start-align and draw no bands; most draw no frame.

## Round 35, 2026-10-17

Owner, round 34: "i like the left aligned but also like the density and spacing and gaps of the wikipedia one. also
want the text styles to be more intentional and consistent with the design system to show more hierarchy, are the
titles consistent with other components?" → own dense rows (Wikipedia's spacing) in place of Description list's 34
rows; one Area role per level. Measurements: `docs/research/articles-rethink-2026-10-17/round-35-measurements.md`.

| Part | Type | Ink | Space | Basis |
|---|---|---|---|---|
| title | surface title (`title-xs`, 15 / 22 at 13), strong | default | 2 above the subtitle | Card's, Dialog's and Navbox's title: the same role for every titled surface |
| subtitle | UI text | `fg-muted` | — | Card's description, Section heading's lede |
| media | — | — | 8 above the title | proximity: the title pairs with its subtitle first |
| section | — | — | 12 apart, a 1px divider between | GitHub's About, Figma's inspector |
| heading | UI text, strong | default | 6 above its rows | Section heading's title (GitHub's About headings, Figma's section titles in body ink) |
| label | UI text, regular | `fg-muted` | the shared label column | Description list's term ink |
| value | UI text, regular | default | 8 after the label column; rows 4 apart | Wikipedia: value 4 after the label, rows 5 apart (3 spacing + 2 × 1 padding); Area's 4 grid |

## Review note, 2026-10-17 (round 35)

- **What changed:** The rows are as tight as Wikipedia's again: labels in a column, values beside them, rows close
  together. Every text style is one Area already uses: the name is the same title as a Card's or Dialog's, section
  headings are Section heading's, labels are Description list's muted labels.
- **Why:** You liked the left alignment but missed Wikipedia's density, and asked whether the titles match other
  components. They now do, and each level steps down: title, heading, label, value.

## Round 36, 2026-10-17

Owner, round 35: "other variants needed? make the copy more generic". Survey: `docs/research/articles-rethink-2026-10-17/round-36-variants.md`. Added: `layout="stacked"`
(label above value, 4 between, pairs 8 apart: the App Store's Information, Radix and Chakra `vertical`, Ant vertical) and
`action` (one control at the end of the title row: Ant Descriptions' extra, GitHub's About gear). Not added: collapsible
sections (Notion's property groups, unverified), a media-size switch, icon-led rows (that is List). Demo copy is generic
("Title", "Section", "Label", "Value").

## Review note, 2026-10-17 (round 36)

- **What changed:** Placeholder copy throughout (Title, Section, Label, Value). Two new options: labels stacked above
  their values for a narrow column, and one action button at the end of the title row.
- **Why:** You asked whether other variants are needed. Those two are what the App Store, Radix, Chakra and Ant
  ship; collapsible sections had too little evidence, so they wait for your call.

## Spacing audit (2026-10-17)

Inset (framed, after the round-34 rethink): 12 to the content with the border counted once, `calc(12 − border-width)`, as Popover's (11 + 1); it was 13. Measured in `docs/research/spacing-2026-10-17/` (Before / After: https://claude.ai/artifact/JtDZ9LNfutFyfdkGUvQzL2).

## Settings collisions fixed (2026-10-18)

Elevation and Stroke audit (docs/research/elevation-stroke-2026-10-18, "Audit: Area today"): the framed Infobox had no edge at Surface 0 (Borderless). It now lists `--area-shadow-edge` before its resting
lift, as Card does: the soft edge at 0, transparent while a frame is drawn. Checked in the app, light and dark.
- 2026-10-19 · design-system audit → the label column is a named `--_label-column` spec value. No visual change.

## Review note, 2026-10-19 (round 56)

- **What changed:** Framed, the section rules take `border-decorative`: seams inside the card are never darker than its edge (unframed, they stay `border-divider`).
- **Why:** you asked on Edit summary whether the frame and the divider were meant to differ. They weren't: DESIGN_SYSTEM.md says a rule inside a container is never darker than the container's edge, and seams inside a card take the seam colour. The same seam was fixed wherever it appeared.

## Review note, 2026-10-20 (round 62)

- **What changed:** Framed, its action button now takes the plate made for its raised card. In light at the default settings nothing moves (there the raised plate equals the page's);
  in dark and on a grey page its hover, selected and pressed plates are now the same step from this surface as every
  Card's and Menu's (dark: #272727 on #121212, was #212121).
- **Why:** you asked that hover colours come from rules, not one-off fixes. The rule is now written (DESIGN_SYSTEM.md,
  Layers: a component that paints a ground declares it in layers.css) and enforced by a test; this family painted a
  raised ground without declaring it.

## Review note, 2026-10-21

- **What changed:** Its resting shadow is one tight layer, `0 1px 2px -1px` at 8% (ChatGPT's sm), instead of a soft two-layer haze at 1.5%.
- **Why:** your picks on the state page (2026-10-21), now the defaults of the new state settings (Inspector: Stroke, Shadow, Fill) (Rest shadow d). Nothing else on it changed.

## Review note, 2026-10-22 (round 68)

- **What changed:** the label column is now as wide as the longest label in the section (up to 40% of the box, then
  the label wraps), and the value starts 12 after it. Before, every label sat in a fixed 120 column with the value 8
  after it, so a short label left about 96px of empty space. The subtitle now sits directly under the title (it was
  2 below).
- **Why:** your round 67 note, "the gaps between the columns is huge". Wikipedia's own column is sized by its labels,
  as Ant's Descriptions and Radix's DataList are; the fixed 120 copied one article's width. The type was already one
  role per level (title-xs title, muted UI-text labels, default values), so it stays.
- **Your other questions** (is it necessary, what other systems do) are answered in
  `docs/research/text-gaps-2026-10-22/infobox.md`: design systems ship only the rows, not a titled box, so Infobox
  could become Description list in a Card. That would change the approved Description list, so it waits for you.
