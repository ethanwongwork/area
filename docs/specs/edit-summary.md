# Edit summary spec (with Diff)

**Captures:** none yet; evidence from the products' stylesheets in `docs/research/inspector-chat-2026-10-18/`.
**Peers:** Code block (diff marks, card shape), Step, Button (ghost), Table

## Owner decisions

- 2026-10-26 (round 73): the head title stays regular beside the 500-weight Undo all / Keep all ("Keep the chat card
  head titles regular; it's intentional"), as Plan's, Queue's and Code block's heads.
- 2026-10-18: "start Phase 2 … Edit summary and diff".

## Job and boundaries

**Edit summary** is what an agent changed in one turn: a card with a title, the turn's total +N −N, and a row per file with its own counts, each opening to its diff, with Keep and Undo for each file and
for all. The caller words the title with the count ("Edited 2 files", as the Inspector chat passes it); without a
`title` the card reads "Edited files" (`EditSummary.tsx`, the title's fallback). **Diff** draws a unified diff in Code block sm's metrics: line numbers, a + / − marker and a tint on added and removed lines, and a fold for
the unchanged runs between hunks. Not Code block's `marks` (one-sided, no numbers pairs or folds); not a review tool
(staging, commits, split view are Codex's side panel and out of scope).

## Variants

| Axis | Value | Justification | Where |
|---|---|---|---|
| file status | pending, kept, undone | Keep / Undo per file and all | Cursor review ("Keep All", "Undo All", per-file Keep / Undo); Codex Undo / Review |
| file open | closed, open (diff) | the diff on demand | Cursor `EditToolCallView.js` chevron; Codex "Review" |
| (Diff) line kind | added, removed, context; fold | — | Cursor `DefaultDiff.stylex.js`; Codex TUI diff_render |

API: a file's outcome is `status` (Governance § 4; `state` stays as a deprecated alias for one release, `status` wins).
A file's diff opens uncontrolled (`defaultOpen`) or controlled (`open` / `onOpenChange`), as Step, Plan and Queue do.
Diff is named by `aria-label` ("Changes" when unset); its `label` (read as "Changes to <label>") is a deprecated alias,
and `aria-label` wins.

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
        (2026-10-26, EditToolCallView minimalContent) the opened diff is a box: margin-top 4, 1px stroke-secondary all
        round, radius-base 6, overflow hidden, bg-editor; line numbers padding 4 / 4, tertiary ink; line content padding
        8; the separator ("N unchanged lines") sans, font-size-sm, text-tertiary, padding 4 / 8, on bg-tertiary
codex   "• Edited 2 files (+6 -1)", per file "└ path (+1 -1)", numbered +/- lines with green / red fills
```

Area:

```
area-edit-summary            card: card edge at stroke-width, container corner, surface fill; text-base throughout
  area-edit-summary__head    flex, wraps, gap 8; a small control plus its inset above and below; title 12 in; a divider:
                             title, counts, Undo all, Keep all (buttons at the end, wrapping under the title when narrow)
  area-edit-summary__files   padding 4; ui-row-gap between rows (Menu's)
    area-edit-summary__file  Menu row (ui-row, row inset, row corner, row plate, gap-row): button (name, counts,
                             chevron) + actions (Undo, Keep) or the settled status ("Kept" / "Undone")
    area-edit-summary__diff  under its row when open, 4 above and below (the list's row gap included)
      area-diff
area-diff                    mono, Code block sm's type; Code block's frame (card edge, code ground), its edges on the text line (12 in), corner nested and floored (4); horizontal scroll, focusable
  area-diff__lines           one grid: old number, new number, marker 8, text; gap 4
  area-diff__line            subgrid row; added / removed tint
  area-diff__fold            "12 unchanged lines", sans (Cursor's), muted on the recessed band, from where the numbers start
```

## Decisions

| Slot · property | Area value | Basis | Reason |
|---|---|---|---|
| card edge, fill | border-card at stroke-width, no shadow; bg-surface | cursor (one card shape) + Code block | a required frame (round 49) |
| type | text-base across the card; sm buttons | Cursor cards 13 under a 14 reply | round 49: the card mixed four sizes |
| card corner | radius-container | Code block md (peer) | Cursor's 12 is its card radius; Area's card corner role |
| head | min height control-sm + 2 × inset, inset (row − control-sm) / 2, never under 4; title 12 in (list 4 + row inset 8); gap 4, the rows' name-to-counts gap (round 82; was 8); no seam under it (2026-10-25; was `border-decorative` from round 56, Code block's header seam) | Code block's header (stable height with or without actions); Cursor card header 0 12 | rounds 49 and 52 |
| list / row | list padding 4, ui-row-gap between rows; Menu rows: ui-row tall, row inset, radius-row, gap-row (12, compact 8) | Menu (peer: `--_menu-gap`, surface.css); cursor rows radius 6 | round 49; audit 2026-10-19 (was gap 8 at every density) |
| row plate | bg-component-hover on hover / focus, bg-component-pressed while the name is pressed | Menu rows (Shared state paint) | round 51; audit 2026-10-19 (was bg-component-active, the selected fill) |
| row actions | muted ghost buttons, default ink on hover and press, no plate of their own; over the row's end on the row's plate (pointer), in flow on touch | Nav's and Board's row-action rule | round 51 |
| button corners | concentric: head buttons take the card's corner less the border and their inset; row buttons the row's corner less theirs (the same clamped inset, never under 4, that sets their distance from the row's end); own corner under Sharp | owner round 51 | round 52 |
| counts | +N fg-success, −N fg-danger, tabular, 4 apart | cursor git added / removed, codex green / red | — |
| diff type | text-xs on 18 (compact 16), mono; insets 8 (compact 6), number start 4, gap 4 | Code block sm (peer) | the Inspector's code well |
| diff frame | border-card, radius-row (concentric with the list: 12 − 4), bg-code | Code block (peer) | round 49 |
| diff tint, marker | success-surface / danger-surface; marker 8 wide in fg-success-vivid / fg-danger-vivid, strong | Code block's diff (peer) | one diff paint across Area (cleanup pass 2026-10-19; was Cursor's 3px strip) |
| fold | the diff's size, sans, muted on bg-well; from the number start 4 to the diff's end inset | cursor collapsed regions 12px on bg-tertiary | round 49 |
| kept / undone | counts muted; undone name struck through; the row says "Kept" / "Undone" | cursor Keep / Undo | — |

## States

Row hover / focus: plate; actions show (always on touch). Name pressed: the pressed fill (bg-component-pressed). Open:
chevron turns down (`fast`; closed it points along the reading direction, mirrored in RTL), diff below. Kept / undone: final, the actions leave for "Kept" / "Undone"; counts muted; an undone name is
struck through.

## Behavior and accessibility

The file name is a button (`aria-expanded`) that opens its diff; Undo and Keep are separate Buttons labelled with the
file ("Undo button.css"); Undo all and Keep all show only when the caller passes their handlers. The card is a
`section` named by its title. The diff is a focusable `figure` named by its `aria-label`, such as "Changes to <file>" (a sideways scroll needs the
keyboard); added and removed lines carry visually hidden "Added"
/ "Removed" so the change is not colour alone. Long lines scroll sideways; the card never widens its column.

## Peers and consistency

Code block: same diff paint and code type. Step: an Edit step's summary uses the same counts.

## Visual pass

Seen in the browser preview on 2026-10-19: the Chat view's finished turn at 256 (Testing screen) with Keep, the open diff, and the gallery tiles in light and dark. Fixed then: at the Inspector's width the head cut its title to "Edi…" (it now wraps Undo all and Keep all under the title), the file row kept room for its invisible Undo / Keep (with a pointer they now cover the row's end on hover), the diff drew empty number columns for an agent's edit (a diff without numbers now has none) and spread the number columns over spare width (the text column takes it). The diff tints are Code block's marks: faint in light, strong in dark; left for review.

## Verification

React tests (`packages/react/tests/agent-chat.test.mjs`, 9), the full React suite (495), manifest parity, contracts, app typecheck, playgrounds. In the browser preview (4420), 2026-10-19.

## Feedback log

- 2026-10-25 · owner: "Drop the line on Edit summary, Queue and Plan too, and tighten the bar Plan's spacing as shown"
  (after Code block's header lost its rule; comparison page https://claude.ai/artifact/914gYc7RXYaRuK8mk2erRb) → no
  seam under the head. Measured head middle to first row middle against the row pitch: Plan and Queue 1.1, Edit
  summary 1.2, Cursor's to-do tray 1.0 (its stylesheet: header 28, body padding 8, no border), so no spacing change
  except Plan's open bar (below).

- 2026-10-18 · built for Phase 2 of the Inspector chat.
- 2026-10-19 · browser check: head cut the title at 228 → head wraps; file name cut by hidden actions → actions overlay on hover (pointer), in flow on touch; empty number columns for unnumbered edits → dropped; number columns took spare width → text column is 1fr; frame and divider moved to stroke-width (no shadow under the card: a required line, cohesion test).

- 2026-10-19 · audit: the pressed row takes bg-component-pressed (was the selected fill); rows take Menu's gap-row and
  ui-row-gap; the row buttons' corner uses the clamped inset; the closed chevron mirrors in RTL; `state` → `status`
  and Diff `label` → `aria-label` (deprecated aliases kept); controlled `open` / `onOpenChange` on a file.

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
| Lines in the transcript | the reply's type (text-lg); 4 between a line's parts | Message; Cursor ToolCallLine gap 4 |
| Cards (Edit summary, Plan) | one size, text-base; sm buttons | Cursor: cards 13 under a 14 reply |
| Card frame | the card edge at stroke-width, container corner, surface fill | Code block |
| Card column | text 12 in: Menu's list padding 4 + the row inset 8 | Menu; Cursor card header 0 12 |
| Card head | one row tall, no rule under it (2026-10-25); a trailing button (row − control) / 2 from the end, never under 4 | Code block's header |
| Card rows | Menu rows: row height, row inset, row corner, row plate (pressed: bg-component-pressed), Menu's row gap `gap-row` (12, compact 8) so a label after the icon slot lands on the list column, and `ui-row-gap` (2, compact 0) between rows | Menu (`--_menu-gap`, surface.css) |
| What a line opens | 4 under the line, on a 1px rail with its content 12 in | Cursor content gap 4; Claude Code's rail at 12 |
| Backplates | one: the row plate under the pointer or focus | Menu |

Changed here: the card's text drops to text-base (it mixed 16 titles, 14 buttons, 13 code and 12 diff); the head is a
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

## Review note, 2026-10-19 (round 55, design-system audit)

- **What changed:** File rows sit on Menu's list column (12 at Default, unchanged at Compact) with Menu's 2 between rows; a pressed name takes Menu's pressed fill; the closed chevron mirrors in right-to-left text; the row buttons' corners use the same clamped inset as their padding. A file's `state` is now `status`, it can be controlled (`open` / `onOpenChange`), and Diff takes `aria-label`.
- **Why:** The audit found the rows used 8 instead of Menu's row gap, press used the selected step, and the chevron and corner rules differed from Accordion's and Queue's.

## Review note, 2026-10-19 (round 56)

- **What changed:** The head's seam takes `border-decorative`, Code block's header seam (it was `border-divider`, #e2, darker than the #ee frame).
- **Why:** you asked on Edit summary whether the frame and the divider were meant to differ. They weren't: DESIGN_SYSTEM.md says a rule inside a container is never darker than the container's edge, and seams inside a card take the seam colour. The same seam was fixed wherever it appeared.

## Review note, 2026-10-20 (round 62)

- **What changed:** Its file rows and buttons now take the plate made for its raised card, and the diff inside does the same. In light at the default settings nothing moves (there the raised plate equals the page's);
  in dark and on a grey page its hover, selected and pressed plates are now the same step from this surface as every
  Card's and Menu's (dark: #272727 on #121212, was #212121).
- **Why:** you asked that hover colours come from rules, not one-off fixes. The rule is now written (DESIGN_SYSTEM.md,
  Layers: a component that paints a ground declares it in layers.css) and enforced by a test; this family painted a
  raised ground without declaring it.

## Review note, 2026-10-22 (round 67)

- **What changed:** stacked rows sit 1px apart (were 2px at the default size, and touching at Compact). Keyboard focus is the brighter indicator blue (#0160d9, was #004cb0), as everywhere since the state settings.
- **Why:** you asked for the gap between nav items to stay the same and not disappear at Compact. ChatGPT's and
  Notion's sidebars put their rows 1px apart, so `ui-row-gap` is now 1px at every type size and density, for every
  family that stacks rows. The focus colour is your pick on the state page (2026-10-21).

## Review note, 2026-10-26

- **What changed:**
  - No line under the head (2026-10-25). The first file starts right under the title and counts.
  - A file's diff sits 4 below its row in a bordered box whose edges are on the card's text line, under the title and
    file names (option C, as Cursor's opened edit). It was a bordered box 4 inside the card's edge.
  - Added and removed lines take the diff's own tints, the solid status colours mixed into the ground (a clear pink
    and green in light, about a quarter-strength red and green in dark), not the status surfaces.
  - The folded-lines row keeps the sans, as Cursor's does.
- **Why:** you dropped the line under Code block's header, then asked for Edit summary, Queue and Plan to match. In
  rounds 72 and 73 you found the box's margins tight, asked whether its edges should align to the text, and could not
  tell the red rows from the green. Cursor, read from its app on 2026-10-26, puts the diff in a box on the text
  (margin 4, 1px stroke, radius 6, the editor's ground, sans separator); you picked that over edge to edge (A) and a
  grey box (B). The status surfaces were near white in light and near solid in dark, so the diff has its own tints.

## Review note, 2026-10-26 (interaction pass)

- **What changed:** A file's diff eases open and shut on Accordion's recipe; a closed diff stays in the page, hidden, so the file's name points at it.
- **Why:** It snapped, and while closed the name's aria-controls pointed at nothing. You asked for the Slider's motion and detail pass on every component; measured across all 118 families ([the pass](../research/interaction-pass-2026-10-26/README.md)).

## Review note, 2026-10-28 (round 82)

- **What changed:** the head's counts sit 4 after the title, the gap a file row has between its name and its counts
  (was 8). Undo all and Keep all stay at the end.
- **Why:** side by side, "Title  +3 −1" read looser than "Item one +2 −1" under it; one card, one name-to-counts gap.
- **Verdict:** approved (owner, 2026-10-29, review page round 82); Complete.
- 2026-11-01 · owner ("Yes, fix fills", colour system study, docs/research/color-system-2026-11-01): The fold painted `bg-subtle`, which equals the page at Layer contrast 0 (the default), so it vanished in both modes → `bg-well`, the recessed tone never closer to the page than the page's control fill (#f9f9f9 / #161616 at Layers 0, unchanged from Layers 50 in light).


## 2026-11-02: variant plain

Owner, in the Chat kit (Labs › Chat): "the tracker, do they need containers? the containers look off, and out of place, not
even padding around them, gaps look either too big or too small". Measured in docs/research/chat-kit-2026-11-02: the
references' turn summaries and tool rows carry no box (only an opened output does), and grouped tool rows sit unboxed, and in Area's turn the boxed Edit summary sat 27 (text to text) from the line above against a Step's 13. `variant`
(surface, the default and unset; plain) is Area's name for a frame that can go (Calendar, Description list). Plain drops
the border, fill and corner and the list's 4 padding, and hangs the edit summary one row inset into the margin, so its
words start on the text edge around it and its row plates hang outside it (as Nav's and Message actions' do); its head is
the text's line and its last row's half-leading hangs past its foot, so the words above and below are the turn's gap
away. A plain edit summary is not a raised ground (layers.css). The diff (Edit summary) and nested steps (Plan) keep
their own grounds.

## 2026-11-02: figures at the secondary step, a file's icon and folder

Owner: "the text size of the numbers on the right look way bigger than the left ... can you look into the code changes
design?". Every figure in a tracker (Plan's count and meta, Step's meta, Edit summary's +N −N) is metadata, the ramp's
secondary step (`text-sm`, 12 at type 13) on the row's line: the face's figures are cap height and tabular, so at the
label's 13 they read a size up. A file row takes `icon` (its kind's 16 glyph, muted, before the name) and splits a path:
the file's name first, its folder after it, muted and cut from its start, so the part that differs leads.

## 2026-11-04: read on its glyphs (Q-T2)

Owner, "Apply both" on Kit Type Decisions (artifact KeEDPx5sUTQXE6iKtu6sw1; docs/research/kit-type-2026-11-04). Plain gives back its head's half-leading at its top, and its last row's at its foot while the last file's diff is closed (a diff is a frame). A head that carries Keep / Undo is a control row and still sits a little lower (19.6 under a Step group, measured). Test: `packages/react/tests/type-rhythm.test.mjs`.
