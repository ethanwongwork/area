# Reference list spec

**Captures:** computed-style readouts below (Wikipedia, en.wikipedia.org/wiki/Lisa_Su)
**Peers:** Citation (footnote), Link, Nav marker

## Owner decisions

- 2026-10-17: "build whatever you recommend in the order you recommend", after the Wikipedia survey (docs/COMPONENTS.md,
  "From Wikipedia"). Order: Reference list, Table of contents, Figure, Infobox, Inline list, Abbreviation, Hatnote, Navbox.

## Job and boundaries

Lists a text's sources, as ChatGPT's "Sources": each a publisher, a linked title and what it covers, under an optional heading. Numbered by default so footnotes (Citation `variant="footnote"`) can point at the notes; each note can end with links back to where it is cited. Not a bibliography layout (free-form note text is the caller's) and not a Description list (no labels).

## Sources

| Id | Type | What | Where |
|---|---|---|---|
| wikipedia | product (evidence) | Reference list on an article | en.wikipedia.org/wiki/Lisa_Su (Vector 2022 on Wikimedia's Codex), built-in browser, 2026-10-17, computed styles read in the page |
| codex | design system | Wikimedia Codex, the system Vector 2022 is built on | doc.wikimedia.org/codex (not read in detail) |

Target products searched: ChatGPT and Figma have no equivalent; Notion's equivalents (table of contents block, image
caption) were not measured this round.

## Measurements

Wikipedia, computed (evidence only; Area's current values are in Decisions):

| Part | Value |
|---|---|
| ol | 0.9 of the body: 14.4 / 23.4 on 16; markers 3.2em in (46.08) |
| li | 0.1em apart (1.44); in columns `column-width: 27em` (Vector 2022), `break-inside: avoid-column` |
| backlinks | "↑" for one citation (aria-label "Jump up"), "^ a b c" for several, the letters raised, bold, italic; link blue #36c; `user-select: none` |
| target | `ol.references li:target { background-color: #e8eeff }` |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| type | UI text (`ui-size` / `ui-leading`), default ink | ChatGPT's sources at the answer's size and ink (round 35) | Wikipedia's 0.9 and round 34's muted small text replaced |
| title | optional; UI text, strong, default ink, `role="heading"` level 3, 8 over the list | ChatGPT's h3 (round 35) | — |
| markers | `number` (default; an `ol`, period, `fg-muted`, tabular, `start` continues a count) or `bullet` (a `ul`, "•" centred in the box) | owner, round 35 ("i actually prefer numbers"); Notion (round 37) | — |
| marker column | one box shared by every row, at least 0.8em and as wide as the widest number, starting on the edge of the text above; text 6 after it; wrapped lines hang under the text; items back to back | Notion, Substack (rounds 36–37) | no hanging indent (Wikipedia 3.2em, ChatGPT 2em) |
| item | publisher — title — description, spaced em dashes in the item's ink; the title a Link `external` | ChatGPT (round 35); owner, round 37 | Area's Link in place of ChatGPT's dotted line |
| backlinks | at the end of the note, 4 after the text: Area's `return` glyph at 12 (`icon-xs`), `fg-muted`; the second and later add their count in `text-xs`; foreground fixed on hover | GitHub ↩, remark ↩² (round 34) | Wikipedia's ↑ and a b c dropped in round 34 |
| target | `:target` or `highlighted` (hook `data-target`): Nav marker's selection rail (`fg-selection`), 6 outside the marker column | Nav marker (rounds 34, 36) | Wikipedia tints the note; a filled plate failed contrast |

## Verification

- Gallery tiles at fit, light (headless Edge, 2x).
- Hover and pressed sweep with text contrast at light 100 + 4, light 90 + 8, dark 8 + 4 and dark 24 + 8: no text under 4.5:1.
- React: `packages/react/tests/articles.test.mjs`. Styles build: manifest parity, token references.
- Not checked: a screen reader; forced colours; Notion side by side.

## Review note, 2026-10-17

- **What it is:** A list of numbered notes for footnotes to point at, each with ↑ (or ↑ a b c) back to where it is cited; long lists can run in columns.
- **Based on:** Wikipedia's references, in Area's small text and the link blue, with the note you jumped to marked by the same rail as the current section in a table of contents.

## Rethink, 2026-10-17 (round 34)

Owner, round 33: "rethink" (not only Wikipedia). Survey: `docs/research/articles-rethink-2026-10-17/reference-list-toc.md`.
- Small text, `fg-muted` (GitHub 12 muted); indent 2ch + 12; notes 4 apart; native tabular numbers.
- One backlink per citation at the end: Area's `return` glyph at 12 (added to the component glyphs), muted, 4 after the
  text; the second and later carry their number (remark's ↩²). Foreground fixed on hover.
- Target (`:target` or `highlighted`, hook `data-target`): the note in `fg-default` and Nav marker's rail at the list's
  start edge (GitHub and GOV.UK mark the whole note).
- `divided`: 1px divider and 12 above. Dropped `ink` (ten inks), `columns`, ↑ and lettered backlinks.
- Later, if wanted: a "Sources" list of favicon, title and domain rows (ChatGPT, Perplexity).

## Review note, 2026-10-17 (round 34)

- **What changed:** The notes are quiet now: small muted text with plain numbers. The "↑ a b c" before each note is
  replaced by one return arrow at the end (a second citation shows a small 2). No columns, no blue ink axis. The note
  a footnote jumped to goes to the full ink with the selection rail. `divided` adds a rule above.
- **Why:** You asked for it not to look only like Wikipedia. GitHub's footnotes (and GOV.UK's, Substack's) are
  muted, end with one ↩, never letter their backlinks and never run in columns.

## Round 35, 2026-10-17

Owner, round 34: "look at chatgpts reference/source design" → rebuilt on ChatGPT's "Sources" (measured: `docs/research/articles-rethink-2026-10-17/round-35-measurements.md`).

| Part | Type | Ink | Space | Basis |
|---|---|---|---|---|
| title | UI text, strong | default | 8 over the list | ChatGPT's h3: the answer's size, 600, default ink; Section heading's title |
| list | UI text | default | 2em in; items back to back | ChatGPT 32 at 16, no gap |
| marker | disc (`bullet`) or decimal (`number`) | the item's | — | ChatGPT's discs in the text ink |
| item | "source — title ↗ — description" | default | " — " | ChatGPT |
| title link | Link `inline`, `external` (Area's line, the open mark 4 after) | default | — | Area's approved Link in place of ChatGPT's dotted grey line |
| backlink | return glyph 12, count `text-xs` | `fg-muted` | 4 after the text | GitHub ↩, remark ↩² |
| target | the selection rail at the list's start edge | `fg-selection` | — | Nav marker |

## Review note, 2026-10-17 (round 35)

- **What changed:** It now looks like ChatGPT's "Sources" under an answer: a short heading, then each source as
  publisher — linked title ↗ — what it covers, in the normal text colour and size. It can be numbered when footnotes
  point at it, and then each note ends with a small arrow back to where it was cited.
- **Why:** You asked to look at ChatGPT's source design. These are its measured sizes and spacing, drawn with Area's
  own link and heading.

## Round 36, 2026-10-17

Owner, round 35 (approved, with notes): "i actually prefer numbers and the numbers themselves aligning with the text on
top, i dont like huge indents. can you research other design systems/products? also use more generic placeholder text".
Survey: `docs/research/articles-rethink-2026-10-17/round-36-variants.md`. Substack, Notion and Perplexity start the marker on the edge of the text above (Substack: number
min 24 + 6 at 90% of the body; Notion: a 24 marker box + 6 at 16; Perplexity: 16 + 8); GitHub, Tailwind, ChatGPT and
Wikipedia hang the marker in a 16 to 36 indent. Area: numbered by default; no list padding; one shared marker column at
least 16 wide (a grid with subgrid rows, so 10 and over keep the text on one edge), text 8 after it, wrapped lines
under the text; the number `fg-muted`, tabular, with its period. The target rail moves 6 outside the marker column.

## Review note, 2026-10-17 (round 36)

- **What changed:** Numbered by default, with the numbers starting right at the edge of the heading above and the text
  8 after them; no big indent. Long lists keep every note's text on one edge. Placeholder copy throughout.
- **Why:** You preferred numbers flush with the text above. Substack, Notion and Perplexity lay their lists out that
  way; the hanging indent was GitHub's and ChatGPT's.

## Round 37, 2026-10-17

Owner, round 36: "the space between the dots/numbers and the start of the text is too big, can you make it so theyre
interchangeable/aligned. look at other text lists for bullets and numbers, also are the m dashes necessary? remove m
dashes from all copy if possible".
- Measured Geist at 13 (headless Edge): "1." 10.42, "10." 18.22, "•" 4.06, a space 3.25.
- Other lists: Notion keeps one marker box for bullets and numbers (24 at 16, the marker centred, 6 to the text);
  Substack 6 after the number; the browser's own markers end one space (3.25 at 13) before the text.
- Area: one marker box for both, at least 0.8em ("1."), growing to the widest number and shared by every row; the text
  6 after it (was a 16 box + 8: 24, now 16.4 at 13). Numbers start on the edge, the bullet centred in the box, so
  `marker` swaps without moving the text.
- Em dashes: the parts of a source now run as an Inline list (its muted dot). The gallery's other visible copy has no
  em dashes; API tables keep "—" for "no default".

## Review note, 2026-10-17 (round 37)

- **What changed:** The numbers and bullets sit much closer to the text (6 after them), and bullets and numbers share one
  marker column, so switching between them leaves the text where it is. The em dashes are gone: a source's parts are
  separated by the same muted dot as Inline list.
- **Why:** You found the gap too big and asked for the markers to line up. Notion keeps one marker box for bullets and
  numbers with 6 to the text; Substack uses 6 too.

## Round 38, 2026-10-17

Owner, round 37: "i actually prefer m dashes over dots if thats an intentional use and proper use for m dashes" → the
spaced em dash is back. It is a proper use: an em dash sets off a parenthetical part of a line, here the work's title and
then what it covers after its publisher, as ChatGPT's sources use it (measured, round 35).

## Review note, 2026-10-17 (round 38)

- **What changed:** The em dashes are back between a source's publisher, title and description.
- **Why:** You prefer them, and it is a proper use: a spaced em dash sets off each part as an aside, as ChatGPT's
  sources do.
- 2026-10-19 · design-system audit → a passed `aria-label` names the section even with a title (it was dropped), as
  Infobox and Table of contents do. No visual change.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.
