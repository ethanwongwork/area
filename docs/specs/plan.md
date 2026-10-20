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
| item status | done, current, pending | — | Cursor `todo-list.js` (in progress, pending, done struck); Codex ✔ / □; Claude Code todos |
| open | open, folded | the tray folds | Cursor tray, Claude Code todos |

## Sources

| Id | What | Path |
|---|---|---|
| cursor | todo tray | `todo-list.js`: gap 10, 14/22, icon slot 14×22; in progress primary, pending quaternary, done struck quaternary; container radius 8 bg-quaternary; header 28, padding 0 12. `Tray.stylex.js`: bg-elevated, radius 12 |
| codex | plan update | TUI `plan_update_with_note_and_wrapping_snapshot.snap`: "• Updated Plan · 1/4 complete", ✔ / □ |
| claude-code | todos | `index.css` `.todoList{gap:4px}`, `.todoItem{gap:8px}` |

## Anatomy

```
area-plan                 recessed fill, Code block's container corner
  area-plan__head         button (aria-expanded): title, count, chevron; ui-row tall, padding 0 12
  area-plan__items        list, padding 0 12 8, 4 apart
    area-plan__item       16 mark slot + text, gap 8; data-status
      area-plan__mark     done: check glyph; current: Spinner; pending: a drawn ring
```

## Decisions

| Slot · property | Area value | Basis | Reason |
|---|---|---|---|
| fill, corner | bg-subtle, radius-container | cursor (quaternary fill, a card corner) | Area's recessed fill; the card corner role |
| head | ui-row tall (28 at Compact), padding 0 12 | cursor header 28, padding 0 12 | — |
| items apart | 4 | claude-code (narrow panel) | Cursor's 10 is for a 14/22 line in a wide pane |
| mark slot / gap | 16 square, gap 8 | claude-code item gap 8; Area's icon slot | — |
| current | default ink, Spinner sm | cursor (in progress primary) | — |
| pending | muted ink, a 1px ring on the control hover edge | cursor quaternary; codex □; peer: Checkbox's rest edge | the control edge vanished on the Plan's subtle fill (L 0.913 on 0.976, browser check 2026-10-19) |
| done | muted ink, struck through, check glyph | cursor done struck; codex ✔ | — |

## Behavior and accessibility

The head is a button with `aria-expanded`; the list is an `ol` named by the title; each item states its status in
visually hidden text ("Done", "In progress", "Not started"), not by mark alone. The Spinner follows Motion 0 and reduced
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
| Card head | one row tall, a rule under it when rows follow; a trailing button (row − control) / 2 from the end | Code block's header |
| Card rows | Menu rows: row height, row inset, row corner, row plate, gap 8 | Menu |
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
