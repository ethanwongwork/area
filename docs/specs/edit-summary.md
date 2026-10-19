# Edit summary spec (with Diff)

**Status:** built · in review · 2026-10-18
**Captures:** none yet; evidence from the products' stylesheets in `docs/research/inspector-chat-2026-10-18/`.
**Peers:** Code block (diff marks, card shape), Step, Button (ghost), Table

## Owner decisions

- 2026-10-18: "start Phase 2 … Edit summary and diff".

## Job and boundaries

**Edit summary** is what an agent changed in one turn: a card titled with the count ("Edited 2 files"), the turn's
total +N −N, and a row per file with its own counts, each opening to its diff, with Keep and Undo for each file and
for all. **Diff** draws a unified diff in Code block sm's metrics: line numbers, a + / − marker and a tint on added and removed lines, and a fold for
the unchanged runs between hunks. Not Code block's `marks` (one-sided, no numbers pairs or folds); not a review tool
(staging, commits, split view are Codex's side panel and out of scope).

## Variants

| Axis | Value | Justification | Where |
|---|---|---|---|
| file state | pending, kept, undone | Keep / Undo per file and all | Cursor review ("Keep All", "Undo All", per-file Keep / Undo); Codex Undo / Review |
| file open | closed, open (diff) | the diff on demand | Cursor `EditToolCallView.js` chevron; Codex "Review" |
| (Diff) line kind | added, removed, context; fold | — | Cursor `DefaultDiff.stylex.js`; Codex TUI diff_render |

## Sources

| Id | What | Path |
|---|---|---|
| cursor | edit view, diff, cards | `workbench.desktop.main.js`: `EditToolCallView.js`, `DefaultDiff.stylex.js`, `TranscriptCardRoot/Header/Row/Footer.js` |
| codex | patch summary, diff | TUI `patches` and `diff_render` snapshots; app "Edited N files (+a −b)", Undo / Review |
| claude-code | diff stats | `index.css` diff stats mono .85em, gap 3; changed-file rows gap 6 |

## Anatomy

```
cursor  card: radius 12, 1px stroke-secondary, editor fill; header padding 8 gap 6 (+ divider); rows padding 4/6 radius 6 hover bg-tertiary
        edit: 30 header, filename + +N (git added) −N (git removed); chevron opens an inline diff (radius 6)
        diff: 3px indicator strip, inserted / removed line fills, collapsed regions 12px on bg-tertiary
codex   "• Edited 2 files (+6 -1)", per file "└ path (+1 -1)", numbered +/- lines with green / red fills
```

Area:

```
area-edit-summary            card: 1px card edge, Code block's container corner, the raised fill
  area-edit-summary__head    flex, gap 6, padding 6 8 and a divider: title, counts, Undo all, Keep all
  area-edit-summary__files   padding 4
    area-edit-summary__file  row: button (name, counts, chevron) + actions (Undo, Keep); 4/6, row corner, row plate
      area-diff              under its row when open
area-diff                    mono, Code block sm's type; horizontal scroll
  area-diff__line            subgrid row: old number, new number, + / − marker, text; added / removed tint
  area-diff__fold            "12 unchanged lines" on the recessed fill
```

## Decisions

| Slot · property | Area value | Basis | Reason |
|---|---|---|---|
| card edge, fill | border-card, bg-surface | cursor (one card shape) + Code block (raised fill) | — |
| card corner | radius-container | Code block md (peer) | Cursor's 12 is its card radius; Area's card corner role |
| head padding / gap | 6 × 8, gap 6 | cursor header 8, gap 6 | 6 block so the head is a row tall at Compact |
| row padding / corner | 4 × 6, radius-row | cursor rows 4/6, radius 6 | Area's row corner role |
| row hover | bg-component-hover plate | DESIGN_SYSTEM row plates | — |
| counts | +N fg-success, −N fg-danger, tabular | cursor git added / removed, codex green / red | — |
| diff type | text-xs on 18 (compact 16), mono | Code block sm (peer) | the Inspector's code well |
| diff tint, marker | success-surface / danger-surface; marker 8 wide in fg-success-vivid / fg-danger-vivid, strong | Code block's diff (peer) | one diff paint across Area (cleanup pass 2026-10-19; was Cursor's 3px strip) |
| fold | text-xs muted on bg-subtle, padding 2 × 8 | cursor collapsed regions 12px on bg-tertiary | — |
| kept / undone | counts muted; undone name struck through; the row says "Kept" / "Undone" | cursor Keep / Undo | — |

## States

Row hover / focus: plate; actions show (always on touch). Open: chevron down, diff below. Kept / undone: final, the
actions leave.

## Behavior and accessibility

The file name is a button (`aria-expanded`) that opens its diff; Undo and Keep are separate Buttons labelled with the
file ("Undo button.css"). The diff is a `figure` named by its file; added and removed lines carry visually hidden "Added"
/ "Removed" so the change is not colour alone. Long lines scroll sideways; the card never widens its column.

## Peers and consistency

Code block: same diff paint and code type. Step: an Edit step's summary uses the same counts.

## Visual pass

Seen in the browser preview on 2026-10-19: the Chat view's finished turn at 256 (Testing screen) with Keep, the open diff, and the gallery tiles in light and dark. Fixed then: at the Inspector's width the head cut its title to "Edi…" (it now wraps Undo all and Keep all under the title), the file row kept room for its invisible Undo / Keep (with a pointer they now cover the row's end on hover), the diff drew empty number columns for an agent's edit (a diff without numbers now has none) and spread the number columns over spare width (the text column takes it). The diff tints are Code block's marks: faint in light, strong in dark; left for review.

## Verification

React tests (`packages/react/tests/agent-chat.test.mjs`, 9), the full React suite (495), manifest parity, contracts, app typecheck, playgrounds. In the browser preview (4420), 2026-10-19.

## Feedback log

- 2026-10-18 · built for Phase 2 of the Inspector chat.
- 2026-10-19 · browser check: head cut the title at 228 → head wraps; file name cut by hidden actions → actions overlay on hover (pointer), in flow on touch; empty number columns for unnumbered edits → dropped; number columns took spare width → text column is 1fr; frame and divider moved to stroke-width (no shadow under the card: a required line, cohesion test).

- 2026-10-19 · owner, round 49 (rethink): "make sure the text styles and colors, and gaps, padding, margins, overall spacing/layout are cleaned up, intentional, accurate, and consistent" → a cleanup pass: every text style, color, gap and inset traced to a reference value or an Area peer, written below.
- 2026-10-19 · owner, round 50 (rethink): "do another area coherence pass, make sure all interaction states work as well." → round 51 coherence pass (below).
- 2026-10-19 · owner, round 51 (needs changes): "make sure the inset button for undo all and keep all is mathematically correct corner radius" → round 52 (below).

## Review note, 2026-10-19

- **What changed:** new: what an agent changed in a turn, as a card with the turn's +N −N and a row per file that opens to its diff, with Keep and Undo for each and for all; Diff draws the unified diff.
- **Why:** the review step every agent chat has (Cursor's edit cards and review bar, Codex's patch summary); Keep or Undo keeps the person in charge of each change.

## Cleanup pass, 2026-10-19 (owner, round 49)

The agent chat's shared rules (all five families):

| Rule | Value | Basis |
|---|---|---|
| Lines in the transcript | the reply's type (text-md); 4 between a line's parts | Message; Cursor ToolCallLine gap 4 |
| Cards (Edit summary, Plan) | one size, text-sm; sm buttons | Cursor: cards 13 under a 14 reply |
| Card frame | the card edge at stroke-width, container corner, surface fill | Code block |
| Card column | text 12 in: Menu's list padding 4 + the row inset 8 | Menu; Cursor card header 0 12 |
| Card head | one row tall, a rule under it when rows follow; a trailing button (row − control) / 2 from the end | Code block's header |
| Card rows | Menu rows: row height, row inset, row corner, row plate, gap 8 | Menu |
| What a line opens | 4 under the line, on a 1px rail with its content 12 in | Cursor content gap 4; Claude Code's rail at 12 |
| Backplates | one: the row plate under the pointer or focus | Menu |

Changed here: the card's text drops to text-sm (it mixed 16 titles, 14 buttons, 13 code and 12 diff); the head is a
row tall with its title 12 in and the buttons 4 from the end (was 6 × 8 padding); file rows are Menu rows (were 2 × 6
with a 2px button inside); the diff sits 4 under its row, as wide as the row plate (was 2 2 6). The Diff takes Code
block sm's metrics and diff paint: a + / − marker in the vivid inks instead of a 3px strip (Cursor's), so Area draws
one diff; its frame is Code block's edge and its corner the row's (concentric with the list: 12 − 4); numbers, marker
and text are one grid, so columns line up on every line; the fold starts where the numbers do.

## Review note, 2026-10-19 (round 50)

- **What changed:** one text size across the card, a head one row tall, files as menu rows, and everything starting on
  one edge 12 in. The diff now looks like Area's code block diff (a + or − beside each changed line, its frame and type)
  instead of a coloured strip.
- **Why:** the card mixed four text sizes and several one-off insets; Area already had a diff in Code block, so this
  one follows it.

## Round 51 coherence pass (2026-10-19)

Interaction states, checked one by one:

| State | Before | Now | Basis |
|---|---|---|---|
| Undo / Keep hover on a hovered row | their plate was the row's grey: no visible hover | muted ghost buttons, default ink on hover and press | Nav's and Board's row-action rule (cohesion test, now covering this) |
| row pressed (name) | no press state | the pressed plate | Menu rows |
| actions' backing | always the hover grey | follows the row's current plate | — |
| chevron | snapped open | turns on `fast` ease-out | MOTION.md |
| diff that scrolls sideways | not reachable by keyboard | a focusable region with the focus ring | WAI: scrollable regions take focus |
| focus on the name | the row's inset ring | unchanged | — |
| touch | actions always shown, in flow | unchanged | — |

## Review note, 2026-10-19 (round 51)

- **What changed:** Undo and Keep on a row now darken their text when you point at them (before, their hover was the
  same grey as the row, so nothing showed); a row darkens while pressed; the chevron turns; a wide diff can be scrolled
  from the keyboard.
- **Why:** you asked for every interaction state to work; these follow how Area's nav rows, board cards and menus
  already behave.

## Round 52 (2026-10-19)

Concentric corners (owner: "make sure the inset button for undo all and keep all is mathematically correct corner
radius"). A button set into a corner takes that corner less its inset: Undo all / Keep all, at the card's top-end,
take the card's corner less the border and their inset (at the default 12 − 1 − 4 = 7; Button's own 6 left a wider
ring at the corner than along the edges); a file row's Undo / Keep take the row's corner less theirs. The inset itself
is what the row leaves around a small control, never under 4. The head is a small control plus that inset above and below, whether or
not its buttons are showing (Code block's header rule), so Keep all does not shift the card; at the gallery's type
that is 36, a little taller than Plan's one-row head. Under the Sharp radius setting (no concentric corners)
buttons keep their own corner.

## Review note, 2026-10-19 (round 52)

- **What changed:** Undo all and Keep all now have corners that follow the card's corner exactly, so the gap around
  them is even; the per-file buttons follow their row's corner the same way.
- **Why:** you asked for mathematically correct corners: a button inset into a corner takes that corner less the inset.
