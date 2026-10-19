# Infobox spec

**Status:** built, in review · 2026-10-17
**Captures:** computed-style readouts below (Wikipedia, en.wikipedia.org/wiki/Lisa_Su)
**Peers:** Card, Description list, Figure

## Owner decisions

- 2026-10-17: "build whatever you recommend in the order you recommend", after the Wikipedia survey (docs/COMPONENTS.md,
  "From Wikipedia"). Order: Reference list, Table of contents, Figure, Infobox, Inline list, Abbreviation, Hatnote, Navbox.

## Job and boundaries

Summarises a subject beside an article: a title, an image with its caption, and labelled facts, in titled sections. Not a property editor (Property list) and not a form.

## Sources

| Id | Type | What | Where |
|---|---|---|---|
| wikipedia | product (evidence) | Infobox on an article | en.wikipedia.org/wiki/Lisa_Su (Vector 2022 on Wikimedia's Codex), built-in browser, 2026-10-17, computed styles read in the page |
| codex | design system | Wikimedia Codex, the system Vector 2022 is built on | doc.wikimedia.org/codex (not read in detail) |

Target products searched: ChatGPT and Figma have no equivalent; Notion's equivalents (table of contents block, image
caption) were not measured this round.

## Measurements

Wikipedia, computed:

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
| box | 22em; Card's paint (surface, `border-card`, container corner, resting shadow); 12 in, parts 8 apart | Wikipedia 22em | Card's paint |
| type | small text (14 / 20) | Wikipedia 0.88 | type scale |
| title | body size, strong, centred | Wikipedia 1.25em bold | Area's heading weight |
| section band | the control fill, small corner, strong, centred | Wikipedia's tinted band | neutral paint |
| rows | label 2fr : value 3fr (40%), 12 apart, top-aligned; label in Description list's muted term ink, regular | Wikipedia's 40% | Description list's role for labelled values (Wikipedia bolds labels) |
| align | as Figure | Wikipedia floats right | — |

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
| label | UI text, regular | `fg-muted` | a 120 column | Description list's term ink; Wikipedia's label column 123 of 296 |
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
