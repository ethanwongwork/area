---
name: area-type-usage
description: Chooses and checks the type style, ink, weight, line and spacing for every piece of text in an Area component, composition, screen or kit (the Feed kit, the Chat kit), so text stays consistent across the system and optically balanced. Use whenever you set or change font-size, line-height, font-weight, color of text, or the gap between texts; when you build or review a component with more than one line of text; when composing a feed, a chat, a card, a question or a settings page; when the owner says type looks off, too loud, too many styles, unbalanced, or a badge or label looks wrong; and before calling a type pass done.
---

# Area type usage

Area's type is one ramp, two inks, two weights and one rhythm. Every text in a component or a page takes a **role**,
and the role decides all four. This skill is how to pick the role, put roles together, and prove the result.

The rules come from measurement, not taste: Area's own census of both kits and the products' bundles
(`docs/research/kit-type-2026-11-04/`: Cursor, Claude desktop; ChatGPT and Claude live in
`docs/research/chat-kit-2026-11-02/live.md`). The normative tables per kit are in `docs/PRODUCT_UI.md`, "Type and rhythm
in the kits"; the ramp's definition is `docs/DESIGN_SYSTEM.md`, Size and shape. Read those for the values; this file is
the procedure.

## 1. The ramp (type 13, Default density; everything moves with Type and Density)

| Token | Size / line | Prose line | Role | Never |
|---|---|---|---|---|
| `text-xs` | 11/14 | — | marks: a badge, a count, a key, a data label (axis, tick, legend) | a sentence, a description |
| `text-sm` | 12/16 | 12/18 | secondary that stands apart: a caption, a note under a block, a timestamp, a lede; metadata on a row's line takes the row's 18 | default ink, 500 |
| `text-base` | 13/18 | 13/20 | the UI line: every control, row, label, cell, card name, choice, an agent's work in a chat | — |
| `text-lg` | 15/22 | 15/22 | reading: a reply, the person's bubble, a composer's field, a document, the feed's prose | inside a frame of UI |
| `title-xs` | 16/22 | — | a heading over a page's block: a feed section, a page's or region's empty state, a reply's heading | a component's own title (Dialog, Card, Drawer: `text-base` 500), two in one view at the same level |
| `title-sm` / `title-md` | 18/24 · 20/28 | — | a page or a panel's own title, once | inside a feed's section |
| `title-lg` | 26/30 | — | a figure (a stat's value) | words |
| display | 52 · 67 | — | specimens only (the type ramp, a tester) | UI |

Tracking is the token's own (`--area-<role>-tracking`); never set letter-spacing by hand.

## 2. Pick the role: four questions, in order

1. **Is it read or operated?** Read in sentences (a reply, prose, a doc) → `text-lg`. Operated or scanned (a row, a
   control, a label, a cell, a card name, a question's answers) → `text-base`.
2. **Does it head a block?** Over a page's block → `title-xs` (a section in a feed, a reply's heading, a region's empty
   state), standing one step (4) off any line under it. A component's own title (a Card, a Dialog, a Confirm dialog, a
   Drawer, a Popover) and a name that starts a row are not headings: they stay `text-base`, 500. A surface's title
   stands one step (4) off its copy; an item's name joins its line (DESIGN_SYSTEM.md, "Text pairs", 2026-11-06).
3. **Does it explain something next to it?** A description, a header cell, an option's line, a group label → the **same
   size** as what it explains, **muted**. Only text that stands apart (a caption under a block, a timestamp, a lede, a
   step's time at the row's end) drops a size, to `text-sm`, and then it is muted too.
4. **Is it a mark?** A badge, a count, a key, a data label → `text-xs`, in its component (Badge, Count, Kbd); never a
   hand-set 11.

If a text fits none of these, it is probably two texts (a label and a value) or the wrong component.

## 3. Ink

- `fg-default`: what is read. `fg-muted`: what explains it. Those two carry all words.
- `fg-quiet` is for ghost controls and icons; `fg-placeholder` and `fg-disabled` for fields and the off state.
- Tone inks (`fg-success`, …) belong to Badge, status marks and diff counts, never a sentence.
- **The smaller, the quieter**: 12 is always muted; 11 is a mark. Headings and titles are always default ink.
- A colour in a scope (the cards' `CARD_SCOPE`, a dark frame) resolves the same token one step differently: use the
  token, never a measured colour.

## 4. Weight

- Two weights in UI text: 400 (`weight-regular`) and 500 (`weight-strong`).
- 500 is for: titles (`title-xs` and up), the name that starts a line (a person in an activity, the question in an
  Approval, a timeline's actor), and controls (Button, Badge, Kbd draw their own).
- **Weight rises only with the default ink.** Never 500 + muted in a composition (a group label is muted and regular).
- **One property at a time.** A step down in hierarchy changes size, or ink, or weight: never smaller + muted + lighter
  at once, never a bigger size and a heavier weight to say the same thing twice.

## 5. Lines

- UI text takes its UI line (13/18). Prose that runs past two lines takes the prose line where it differs (12/18,
  13/20); `text-lg` keeps 22 either way.
- A secondary text **on a row's line** (a time, a count, a meta) keeps the row's line (12 on 18) so the baselines
  agree; standing alone it takes its own 12/16.
- Mixed sizes on one line share a baseline (`align-items: baseline`, or Table's `baseline`). A key, a badge, an icon or
  a check on a text line centres on the **first** line (inset.css, first-line alignment); never nudge a glyph.
- **Text that opens or closes a block is read on its glyphs** (DESIGN_SYSTEM, Q-T2): flowing text trims its first and
  last lines (`text-box: trim-start cap text` / `trim-end cap text`: Card, Message's reply, the feed's prose and lists);
  a component whose first line is a row with an icon gives back the half-leading at its outer edge
  (`margin-block: calc((1cap - 1lh) / 2)`: Step, Timeline, plain Plan and Edit summary, Turn notice, Timestamp). A new
  component of either kind does the same and joins `packages/react/tests/type-rhythm.test.mjs`. A control row keeps
  its box.

## 6. Rhythm between texts (measured on the glyphs: cap, baseline, a frame's edge)

| Pair | Gap | Rule |
|---|---|---|
| a surface's title and its copy | one step (4) between line boxes: 12.8 baseline to cap at 13/18 (owner, 2026-11-06: "4 is right") | Card, Dialog, Drawer, Popover, Alert, Toast, Approval, Empty state |
| an item's name and its line | joined: no gap between line boxes | choices, group legends, Switch, File tile, a File upload row, Stepper |
| joined lines that are siblings (a name and its meta, two facts) | 2–4 | Cursor 1/2/4, Claude 4 |
| a heading and its block | 16 (feed) · 12 (chat heading in a reply) | measured to the frame's edge or the first cap |
| rows in a list or group | the row's own padding; a divider adds no space | Settings rows 42 / 60 |
| blocks: paragraphs, cards, tables, trackers, a question | 16 (`text-lg-prose-gap`) in a reply and the feed · 12 between cards in a reply's frame | |
| a caption under its card | 4 | the card, as picked |
| a frame over its question (a visual question) | 8 | |
| turns in a chat | 24; a message over its reply 12; a time over its message 8 | |
| sections in a feed | 48; margin 32 | |

Gaps grow outward: never a larger gap inside a group than between groups. Text sits 4 in from the frames it rides on
(`--_text-inset`); text inside a frame sits the frame's inset in (16 feed, 12 chat, 13 in Approval's shell).

## 7. Putting styles together in one component or card

- **At most three styles** in a card or a component: its title (or name), its body, and one secondary. A fourth is
  usually a mark (Badge, Count, Kbd), drawn by its component.
- **One step between a title and its body** (16 over 13, or 13/500 over 13/400), and the secondary the body's size in
  muted. A reply: 16 headings, 15 text, 13 for the UI set in it (tables, code, trackers).
- **Nothing in a section speaks louder than its title.** A card's own title is not larger than its section's; an empty
  state inside a section is `sm`.
- **A label that carries a marker** (Default, Changed, a count) keeps them on one line: the marker is the same size and
  muted (`Balanced  Default`), or a Count; never a plated Badge beside a word in a row of words (it doubles the row's
  weight and height). Where the row is short of room the marker moves under the words as a joined line; the words are
  never cut or broken inside a word.
- **Names don't break inside words.** A picture's name, a tab, a chip: one line, an ellipsis if it must; running text
  wraps at words (`overflow-wrap: anywhere` only for paths and tokens).
- **Numbers**: `tabular-nums` wherever they line up; data views set numbers in Geist Mono at `text-xs`, words in Geist.
- **Icons** take the type's icon box (16 at 13, `--area-icon-sm`) beside `text-base`, `icon-xs` beside `text-sm`; a key
  square is `control-xs` when its rows carry descriptions (Approval).

## 8. Feed kit and Chat kit: what differs

| | Feed kit | Chat kit |
|---|---|---|
| Width | the Canvas: 424 least, 904 typical, 1440 most; grids count their own columns | one column: 268, 456 or 768; type never changes with it |
| Titles | a `title-xs` section title + Count over every block | none in a chat; a reply's headings only |
| Reading text | prose blocks only (`studio-feed__prose`) | every reply and the bubble |
| UI text | everything in frames | an agent's work, tables, code, cards, questions |
| Rhythm | sections 48, heading 16, cards 16 | turns 24, blocks 16, trackers 16 |
| Frames | text 16 in from the edge | text 12 in from the edge |

The tables in `docs/PRODUCT_UI.md` list every role per kit; change them there, not here.

## 9. Prove it

1. **Census** (both kits, or any page): run `docs/research/kit-type-2026-11-04/census.mjs` with `drive.mjs` against an
   Electron window launched with `--remote-debugging-port`. Every style must be a row of the ramp table; anything else
   is a finding. Watch for: a size off the ramp, a second leading for the same size outside rule 5, 500 in a muted ink,
   two title sizes at one level.
2. **Rhythm**: the layout audit (`.claude/skills/area-ui-review/scripts/layout-audit.js`) per section; read the gaps the
   composition sets (studio-*, qk-* containers), not a component's internals, and check them against the table in § 6.
   Before calling a finding, look: an audit that measures to the first picture inside a frame reads the frame's inset,
   not the gap (Q-T3, withdrawn).
3. **Look** in the app, light and dark, at the kit's widths (Labs › Chat's Width; the feed at 424 / 904 / 1440).
4. Run `node --test packages/react/tests/cohesion.test.mjs` (the ramp rule, joined pairs, corners) and
   `npm run check:app-css -w @area/desktop` (no app rule restyles a component; type changes go in the component).

## 10. Mistakes this rule set was written from

- A plated "Default" Badge beside an answer's word: unbalanced, two rows tall → the same-size muted note (2026-11-04).
- Data cards titled at the section title's size (Q-T1) → the name role, 13/500, through Card's title hook (applied).
- An activity log's day label at 500 in the muted ink → regular.
- Four 96 picture cells at 456: "Workspac e" → two by two under 600, names on one line.
- A section opening on a component's text sat 19–21 under its title, frames 16 (Q-T2) → read on its glyphs (applied).
- Six type styles in one reply (h1–h4, quote, caption) → three: 16 headings, 15 text, 13 UI.
- The feed's prose trimmed every paragraph to its cap (16 apart on the glyphs) while a reply's ran 16 between line boxes
  (27): one reading text, two rhythms → trim a block's outer edges only, everywhere (2026-11-04).
- A reply's heading rule written as a descendant (`.studio-response h3`) drew a chart card's CardTitle (an h3) at 16 in a
  chat: style a composition's own children (`> .area-message__content > h3`), never every heading under it. The census
  names the part (`area-card__title`); check which card before dismissing a row as a screen figure's.
