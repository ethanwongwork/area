# Edit summary spec (with Diff)

**Captures:** none yet; evidence from the products' stylesheets in `docs/research/inspector-chat-2026-10-18/`.
**Peers:** Code block (diff marks, card shape), Step, Button (ghost), Table

## Owner decisions

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
codex   "• Edited 2 files (+6 -1)", per file "└ path (+1 -1)", numbered +/- lines with green / red fills
```

Area:

```
area-edit-summary            card: card edge at stroke-width, container corner, surface fill; text-sm throughout
  area-edit-summary__head    flex, wraps, gap 8; a small control plus its inset above and below; title 12 in; a divider:
                             title, counts, Undo all, Keep all (buttons at the end, wrapping under the title when narrow)
  area-edit-summary__files   padding 4; ui-row-gap between rows (Menu's)
    area-edit-summary__file  Menu row (ui-row, row inset, row corner, row plate, gap-row): button (name, counts,
                             chevron) + actions (Undo, Keep) or the settled status ("Kept" / "Undone")
    area-edit-summary__diff  under its row when open, 4 above and below (the list's row gap included)
      area-diff
area-diff                    mono, Code block sm's type; card edge, row corner, code fill; horizontal scroll, focusable
  area-diff__lines           one grid: old number, new number, marker 8, text; gap 4
  area-diff__line            subgrid row; added / removed tint
  area-diff__fold            "12 unchanged lines", sans, muted on the recessed fill, from where the numbers start
```

## Decisions

| Slot · property | Area value | Basis | Reason |
|---|---|---|---|
| card edge, fill | border-card at stroke-width, no shadow; bg-surface | cursor (one card shape) + Code block | a required frame (round 49) |
| type | text-sm across the card; sm buttons | Cursor cards 13 under a 14 reply | round 49: the card mixed four sizes |
| card corner | radius-container | Code block md (peer) | Cursor's 12 is its card radius; Area's card corner role |
| head | min height control-sm + 2 × inset, inset (row − control-sm) / 2, never under 4; title 12 in (list 4 + row inset 8); gap 8; seam at stroke-width in `border-decorative`, Code block's header seam (round 56; was `border-divider`, darker than the frame) | Code block's header (stable height with or without actions); Cursor card header 0 12 | rounds 49 and 52 |
| list / row | list padding 4, ui-row-gap between rows; Menu rows: ui-row tall, row inset, radius-row, gap-row (12, compact 8) | Menu (peer: `--_menu-gap`, surface.css); cursor rows radius 6 | round 49; audit 2026-10-19 (was gap 8 at every density) |
| row plate | bg-component-hover on hover / focus, bg-component-pressed while the name is pressed | Menu rows (Shared state paint) | round 51; audit 2026-10-19 (was bg-component-active, the selected fill) |
| row actions | muted ghost buttons, default ink on hover and press, no plate of their own; over the row's end on the row's plate (pointer), in flow on touch | Nav's and Board's row-action rule | round 51 |
| button corners | concentric: head buttons take the card's corner less the border and their inset; row buttons the row's corner less theirs (the same clamped inset, never under 4, that sets their distance from the row's end); own corner under Sharp | owner round 51 | round 52 |
| counts | +N fg-success, −N fg-danger, tabular, 4 apart | cursor git added / removed, codex green / red | — |
| diff type | text-xs on 18 (compact 16), mono; insets 8 (compact 6), number start 4, gap 4 | Code block sm (peer) | the Inspector's code well |
| diff frame | border-card, radius-row (concentric with the list: 12 − 4), bg-code | Code block (peer) | round 49 |
| diff tint, marker | success-surface / danger-surface; marker 8 wide in fg-success-vivid / fg-danger-vivid, strong | Code block's diff (peer) | one diff paint across Area (cleanup pass 2026-10-19; was Cursor's 3px strip) |
| fold | the diff's size, sans, muted on bg-subtle; from the number start 4 to the diff's end inset | cursor collapsed regions 12px on bg-tertiary | round 49 |
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
| Lines in the transcript | the reply's type (text-md); 4 between a line's parts | Message; Cursor ToolCallLine gap 4 |
| Cards (Edit summary, Plan) | one size, text-sm; sm buttons | Cursor: cards 13 under a 14 reply |
| Card frame | the card edge at stroke-width, container corner, surface fill | Code block |
| Card column | text 12 in: Menu's list padding 4 + the row inset 8 | Menu; Cursor card header 0 12 |
| Card head | one row tall, a rule under it when rows follow; a trailing button (row − control) / 2 from the end, never under 4 | Code block's header |
| Card rows | Menu rows: row height, row inset, row corner, row plate (pressed: bg-component-pressed), Menu's row gap `gap-row` (12, compact 8) so a label after the icon slot lands on the list column, and `ui-row-gap` (2, compact 0) between rows | Menu (`--_menu-gap`, surface.css) |
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
