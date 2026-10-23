# Plan spec

**Captures:** none yet; evidence in `docs/research/inspector-chat-2026-10-18/`.
**Peers:** Stepper (a process the person moves through), Spinner, Checkbox (the drawn box), Step

## Owner decisions

- 2026-10-18: "start Phase 2 … Plan tray".

## Job and boundaries

The agent's plan for the run, above the composer: what is done, what it is doing now, what is next, with a count
("2 of 4"). It folds to its head. Not a Stepper (a person's process with steps they visit), not a checklist the person
ticks (the agent sets the states).

## Variants

| Axis | Value | Justification | Where |
|---|---|---|---|
| item status | done, current, pending, cancelled | cancelled: an item the agent dropped stays, struck, with a cross (round 49) | Cursor `todo-list.js` (in progress, pending, done struck; cancelled todos); Codex ✔ / □; Claude Code todos |
| open | open, folded | the tray folds | Cursor tray, Claude Code todos |

## Sources

| Id | What | Path |
|---|---|---|
| cursor | todo tray | `todo-list.js`: gap 10, 14/22, icon slot 14×22; in progress primary, pending quaternary, done struck quaternary; container radius 8 bg-quaternary; header 28, padding 0 12. `Tray.stylex.js`: bg-elevated, radius 12 |
| codex | plan update | TUI `plan_update_with_note_and_wrapping_snapshot.snap`: "• Updated Plan · 1/4 complete", ✔ / □ |
| claude-code | todos | `index.css` `.todoList{gap:4px}`, `.todoItem{gap:8px}` |

## Anatomy

```
area-plan                 the agent card: card edge at stroke-width, container corner, bg-surface; text-sm
  area-plan__head         button (aria-expanded): title, count, chevron; ui-row tall, padding 0 12 (the card column);
                          a rule under it while open; the chevron's hover plate as far from the end as from the top
  area-plan__items        ol, padding 4 (Menu's list), ui-row-gap between rows
    area-plan__item       a Menu row that may wrap: first line centred in a row, 16 mark slot + text, gap-row;
                          area-plan__item--done | --current | --pending | --cancelled
      area-plan__mark     done: check glyph; current: Spinner; pending: a drawn ring; cancelled: a cross
      area-plan__text     the words, then the status for assistive tech
```

## Decisions

| Slot · property | Area value | Basis | Reason |
|---|---|---|---|
| frame, fill, corner | border-card at stroke-width, bg-surface, radius-container | Code block (the agent card) | round 49: one card for Edit summary, Plan and Queue (was a recessed bg-subtle tray with no edge) |
| head | ui-row tall (28 at Compact), padding 0 12; open, a row plus its rule at stroke-width | cursor header 28, padding 0 12 | round 52: the rule never eats into the row |
| list, items | list padding 4; items are Menu rows (padding-block (ui-row − leading) / 2, row inset), ui-row-gap apart | Menu (peer) | round 49 (were 4 apart on a 22 line); audit 2026-10-19 added Menu's ui-row-gap |
| mark slot / gap | 16 square, gap-row (12, compact 8) | Menu's row gap; Area's icon slot | the text lands on the list column at every density (audit 2026-10-19; was 8 everywhere, Claude Code's item gap) |
| current | default ink, Spinner sm | cursor (in progress primary) | — |
| pending | muted ink, a 1px ring on the control hover edge | cursor quaternary; codex □; peer: Checkbox's rest edge | the control edge vanished on the Plan's subtle fill (L 0.913 on 0.976, browser check 2026-10-19) |
| done | muted ink, struck through, check glyph | cursor done struck; codex ✔ | — |
| cancelled | muted ink, struck through, a cross | cursor cancelled todos | round 49 |
| chevron | 12 glyph, closed points along the reading direction (−90°, +90° in RTL), down when open, turns on `fast` | Accordion, Tree view | audit 2026-10-19 added the RTL mirror |

## Behavior and accessibility

The head is a button with `aria-expanded`; the list is an `ol` named by the title; each item states its status in
visually hidden text ("Done", "In progress", "Not started", "Cancelled"), not by mark alone. The Spinner follows Motion 0 and reduced
motion.

## Visual pass

Seen in the browser preview on 2026-10-19: above the composer while the recorded run plays (counting 1 of 4 → 4 of 4), and the gallery tiles in light and dark. Fixed then: the chevron did not draw, and the pending ring on the control edge nearly vanished on the Plan's fill; it now uses Checkbox's rest edge.

## Verification

React tests (`packages/react/tests/agent-chat.test.mjs`, 9), the full React suite (495), manifest parity, contracts, app typecheck, playgrounds. In the browser preview (4420), 2026-10-19.

## Feedback log

- 2026-10-18 · built for Phase 2 of the Inspector chat.
- 2026-10-19 · browser check: pending ring faint (L 0.913 on 0.976) → control hover edge (Checkbox's rest edge); chevron sized.

- 2026-10-19 · owner, round 49 (rethink): "make sure the text styles and colors, and gaps, padding, margins, overall spacing/layout are cleaned up, intentional, accurate, and consistent. also are there any missing variants?" → a cleanup pass: every text style, color, gap and inset traced to a reference value or an Area peer, written below.
- 2026-10-19 · owner, round 51 (needs changes): "looks like the inset padding isnt equal, looks like theres slightly more room on the right side than on top." → round 52 (below).
- 2026-10-19 · audit: current-state sections rewritten to the code (the agent card, padding 4, Menu rows, modifier
  classes, cancelled); items take Menu's gap-row and ui-row-gap; the closed chevron mirrors in RTL.

## Review note, 2026-10-19

- **What changed:** new: the agent's plan as a tray above the composer while it works: done items struck, the current one with a spinner, the rest with a ring, and a count; folds to its head.
- **Why:** Cursor's todo tray and Claude Code's todos (TodoWrite) show progress on long runs; the count keeps it one line when folded.

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

Changed here: the Plan is the agent card (was a recessed grey tray with no edge), at text-sm (was the reply's 16), a
rule under its head when open, its items Menu rows a row tall with the first line centred (were 4 apart on a 22
line). The head's title and the marks share the 12 column. Ink: the current item default, the rest muted (Cursor);
done and cancelled struck.

Missing variants (owner: "are there any missing variants?"): an item can be **cancelled** (Cursor's todos have
pending, in progress, completed and cancelled; Claude Code's and Codex's have the first three): struck, with a cross.
Added, with a tile. Not added: an inline "Updated plan" card in the transcript (Codex) — the Step line "Updated the
plan" plays that part; a folded head that names the current item — no product verified to do it.

## Open questions

- Should the folded head name what it is doing now ("Plan · Edit button.css") instead of only the count?

## Review note, 2026-10-19 (round 50)

- **What changed:** the plan is now the same card as the edit summary (an edge instead of a grey fill), in the card's
  text size, with each item a full row; a dropped item shows as **cancelled**, struck with a cross.
- **Why:** you asked for cleaner, consistent spacing and whether a variant was missing; Cursor's plans can drop items,
  which the plan could not show.

## Round 51 coherence pass (2026-10-19)

Approved in round 50; two shared fixes from the coherence pass: the head now answers the pointer as Accordion's does
(a plate behind the chevron on hover and press; it had none), and the chevron turns on `fast` ease-out (MOTION.md).

## Review note, 2026-10-19 (round 51)

- **What changed:** pointing at the plan's head now shows a soft square behind its arrow, and the arrow turns smoothly.
- **Why:** the head had no hover at all; this is the accordion's hover, so every fold in Area answers the same way.
  At rest it looks the same; the page marks it changed because the arrow's box grew to hold the hover square.

## Round 52 (2026-10-19)

Equal insets (owner: "slightly more room on the right side than on top"): the hover plate behind the chevron now sits
as far from the card's end as from its top, (row − plate) / 2, and its corner is the card's less that inset. The
chevron moves out with it (its 12 column was the cause). Queue's head shares the rule.

## Review note, 2026-10-19 (round 52)

- **What changed:** the arrow and its hover square sit as far from the right edge as from the top.
- **Why:** you saw more room on the right; the square now uses one inset on both sides, and its corner follows the
  card's.

## Review note, 2026-10-19 (round 55, design-system audit)

- **What changed:** Items sit on Menu's list column (12 at Default, unchanged at Compact) with Menu's 2 between rows, and the closed chevron mirrors in right-to-left text.
- **Why:** The rows used 8 where Menu uses its row gap, and the chevron didn't flip as Accordion's and Tree view's do.

## Review note, 2026-10-19 (round 56)

- **What changed:** The open head's seam takes `border-decorative`, as Edit summary's and Code block's (it was `border-divider`, darker than the frame).
- **Why:** you asked on Edit summary whether the frame and the divider were meant to differ. They weren't: DESIGN_SYSTEM.md says a rule inside a container is never darker than the container's edge, and seams inside a card take the seam colour. The same seam was fixed wherever it appeared.

## Review note, 2026-10-20 (round 62)

- **What changed:** The plate behind its head's chevron now takes the plate made for its raised card. In light at the default settings nothing moves (there the raised plate equals the page's);
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

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.
