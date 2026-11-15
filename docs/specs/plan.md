# Plan spec

**Captures:** none yet; evidence in `docs/research/inspector-chat-2026-10-18/` and
`docs/research/progress-tracker-2026-10-25/` (the bar, item meta and the ring).
**Peers:** Stepper (steps the person moves between), Progress (the bar's segments), Spinner, Checkbox (the drawn box), Step

## Owner decisions

- 2026-10-18: "start Phase 2 … Plan tray".
- 2026-10-25: "a collapsible and expandable container ... very simple tho, that shows overall progress and added detail.
  will need to build this component" (references: an onboarding plan, a roadmap card, Codex's step pill). Intake: Plan
  is the job; it gains a bar, item meta, a ring for a part-done item and a count override.

## Job and boundaries

A plan's progress: what is done, what is happening now, what is next, with a count ("2 of 4") and, optionally, a bar
that stays when it folds to its head. An agent's plan for the run above the composer, or a person's plan (Setup's
chapters, an onboarding plan). Not a Stepper (markers that take the person to a step), not a checklist the person ticks
(the plan's owner sets the states).

## Variants

| Axis | Value | Justification | Where |
|---|---|---|---|
| item status | complete, current, pending, cancelled (`done` a deprecated alias) | cancelled: an item the agent dropped stays, struck, with a cross (round 49) | Cursor `todo-list.js` (in progress, pending, done struck; cancelled todos); Codex ✔ / □; Claude Code todos |
| open | open, folded | the tray folds | Cursor tray, Claude Code todos |
| variant | surface (default), plain | its own frame, or none, its words on the text edge around it (a chat's steps) | the Chat kit (owner 2026-11-02) |
| bar | none (default), single, segmented | a bar under the head that stays folded: the whole plan's share, or a segment per item filled by its share (2026-10-25) | Cursor ProgressBar (4 high, segments 2 apart); Primer segmented ProgressBar (2 apart); GitHub milestone bar |
| item meta | any short value | an item's own count or date at the row's end | GitHub "9 of 12"; the references' phase counts; Cursor plan phases |
| rail | off, on | the marks joined by a line, a timeline, for items with detail or steps (owner 2026-10-25: "the whole progress data tracker ... in 1 container", an agent run's timeline) | the agent-run reference (rail, chips, inset findings); Claude's todo rail |
| item detail | any inline values | what an item acted on or decided, after its words: chips | the agent-run reference ("Updating time range: [7:00 AM – 8:30 AM]") |
| item steps | one level of items | an item's own steps in a recessed box under its words, one step quieter and denser than items (2026-10-25: boxed, unboxed, boxed again after the agent panel reference) | the agent panel's results box; Run Details' sub-lines; Cursor's plan phases |
| icon | a 16 glyph | before the title: what the plan is about, or its state | the agent-run reference ("Analyzing…" with its spinner) |
| item progress | 0–1 on a current item | its segment fills that far; its mark is the ring filling as a pie | Linear's in-progress ring; GitHub's sub-issue ring; Codex's donut |

## Sources

| Id | What | Path |
|---|---|---|
| cursor | todo tray | `todo-list.js`: gap 10, 14/22, icon slot 14×22; in progress primary, pending quaternary, done struck quaternary; container radius 8 bg-quaternary; header 28, padding 0 12. `Tray.stylex.js`: bg-elevated, radius 12 |
| codex | plan update | TUI `plan_update_with_note_and_wrapping_snapshot.snap`: "• Updated Plan · 1/4 complete", ✔ / □ |
| claude-code | todos | `index.css` `.todoList{gap:4px}`, `.todoItem{gap:8px}` |
| cursor-bar | ProgressBar, segmented | stylex root: height spacing-1 (4), radius xs (2), track stroke-secondary; segmented: gap spacing-0-5 (2), segment radius 1, `flex-grow` by value; fill bg-accent |
| cursor-tray | todo tray head (2026-10-25) | 28 tall (spacing-7), padding 0 12, gap 8; title 14/22 secondary; count tertiary; body 8 16; folded label `${inProgressTodo.content}` or `${n} of ${m} To-dos Completed` |
| primer | ProgressBar | `ProgressBar.module.css`: small 5, default 8, large 10, radius 3, items 2 apart; each item `role="progressbar"` |
| linear | status marks | 14 SVG: a 12 ring, stroke 1.5, an inner pie r 3.5 for how far (todo empty, in progress half, in review three-quarters) |

## Anatomy

```
area-plan                 the agent card: card edge at stroke-width, container corner, bg-surface; text-base
  area-plan--rail         the marks joined by a 1px line in the divider ink, 4 short of each ring; beside a steps box
  area-plan__head         button (aria-expanded): icon (with icon), title, chevron beside it, count at the end on the meta column; ui-row
                          tall, padding 0 12 (the card column);
                          no rule under it (2026-10-25); the chevron's hover
                          plate as far from the end as from the top
  area-plan__bar          with bar: role=progressbar for the whole plan; padding 0 12 12 (the card column); stays folded
    area-plan__segment    a Progress sm (4), one per item (segmented) or one in all (single), 2 apart, aria-hidden
  area-plan__items        ol, padding 4 (Menu's list), ui-row-gap between rows
    area-plan__item       a Menu row that may wrap: first line centred in a row, 16 mark slot + text, gap-row;
                          area-plan__item--done | --current | --pending | --cancelled
      area-plan__mark     one 12 ring in the 16 slot: pending the ring; done the ring and Checkbox's tick (muted);
                          cancelled the ring and a cross; current: Spinner;
                          area-plan__mark--ring: a current item with progress, the ring filling as a pie
      area-plan__text     the words, then the status for assistive tech
      area-plan__detail   with detail: inside the text, 8 after the words, its values 4 apart, wrapping when narrow
      area-plan__meta     with meta: muted, tabular, at the row's end, 8 from the text
      area-plan__steps    with items: an ol in a box from the item's text column to the item row's edge, 8 under the
                          words and 4 more than a row's end above the next item; recessed ground (layers.css), padding
                          4 0, the block corner (`radius-container`); its rows keep their 8 inset (marks 8 in, meta on the plan's meta column),
                          2 shorter each side (29 apart under items 36), muted unless current
```

## Decisions

| Slot · property | Area value | Basis | Reason |
|---|---|---|---|
| frame, fill, corner | border-card at stroke-width, bg-surface, the chat card's corner (16 at the default; `surface.css`, plan B1.3); rows 4 from the outer edge, the edge counted once, their words and the head's title 12 in; head one row (`ui-row`), its title strong in the default ink | Code block (the agent card) | round 49: one card for Edit summary, Plan and Queue (was a recessed bg-subtle tray with no edge); B1.3 moved the text 1 in (13 → 12) and made the title strong |
| head | ui-row tall (28 at Compact), padding 0 12; no rule under it | cursor header 28, padding 0 12, no border | owner 2026-10-25 (was a row plus its rule at stroke-width, round 52) |
| list, items | list padding 4; items are Menu rows (padding-block (ui-row − leading) / 2, row inset), ui-row-gap apart | Menu (peer) | round 49 (were 4 apart on a 22 line); audit 2026-10-19 added Menu's ui-row-gap |
| mark slot / gap | 16 square, gap-row (12, compact 8) | Menu's row gap; Area's icon slot | the text lands on the list column at every density (audit 2026-10-19; was 8 everywhere, Claude Code's item gap) |
| current | default ink, Spinner sm | cursor (in progress primary) | — |
| pending | muted ink, a 1px ring on the control hover edge | cursor quaternary; codex □; peer: Checkbox's rest edge | the control edge vanished on the Plan's subtle fill (L 0.913 on 0.976, browser check 2026-10-19) |
| done | muted ink, struck through; the 12 ring and Checkbox's tick (1.25 line) in the muted ink; with meta (a phase), not struck | cursor done struck, `check-circle`; codex ✔; the references' phases (a check and "Completed") | owner 2026-10-25: a strike on a phase reads as removed; one mark silhouette (was a bare check glyph) |
| cancelled | muted ink, struck through, the ring and a cross; with meta, not struck | cursor cancelled todos, `x-circle` | round 49; owner 2026-10-25 |
| steps box | from the item's text column to the item row's edge; recessed (bg-subtle), the block corner (`radius-container`, 16 at the default), padding 4 0; 8 under the item's line, taking the item's end padding and the last step's 2 below (a negative margin; 2026-11-02, was 4 extra); rows 2 shorter each side, muted unless current | the agent panel reference (box on the label column, results 30 apart under steps 38, ~8 padding) | owner 2026-10-25: containers back "as long as the padding, alignment and visual balance is right" |
| tracker room | with a bar or a rail: the agent card column (12 in, 13 from the outer edge, as the plain tray), head 8 taller (title 14 from the top), bar 12 under the title's line and 12 above the bottom, rail rows 4 apart | Claude's Context panel (8 text to bar); the agent chat's card column | owner 2026-10-25: "the padding/margins for the timeline and also the gap between the text and the indicators looks too small" (measured 12 / 7 / 6 / 12, unbalanced); owner 2026-10-28, chat set review: the column back to 12 ("move them to 13 anyway"), so the boxes in a chat start their text on one edge (it was Card's 16) |
| bar | padding 6 column column folded, 6 column 8 open (the first item 1.1 rows under it); Progress sm (4) segments 2 apart, the selection fill on the track; no rule under it | cursor-bar 4 / 2; primer 2 apart | one bar per plan; Progress is the peer, so the segments are Progress |
| ring | the pending ring (icon-sm − 4) in the selection fill, a conic pie inside it (icon-sm − 8) to the item's share | linear (ring + inner pie) | the mark and its segment read as one value, in one fill |
| meta | muted, tabular, margin-inline-start auto, 8 from the text | cursor tray count (tertiary); GitHub's count | — |
| chevron | 12 glyph, closed points along the reading direction (−90°, +90° in RTL), down when open, turns on `fast` | Accordion, Tree view | audit 2026-10-19 added the RTL mirror |

## Behavior and accessibility

The head is a button with `aria-expanded`; the list is an `ol` named by the title; each item states its status in
visually hidden text ("Done", "In progress", "Not started", "Cancelled"), not by mark alone. With a bar, one
`role="progressbar"` names itself by the title, values the whole plan 0–100 (single: done of all; segmented: the mean of
the items' shares) and says the count as `aria-valuetext`; the segments are hidden, so eight phases are not eight bars
(Primer gives each segment a role; GitHub hides its milestone bar beside its text). The Spinner follows Motion 0 and reduced
motion.

## Visual pass

Seen in the browser preview on 2026-10-19: above the composer while the recorded run plays (counting 1 of 4 → 4 of 4), and the gallery tiles in light and dark. Fixed then: the chevron did not draw, and the pending ring on the control edge nearly vanished on the Plan's fill; it now uses Checkbox's rest edge.

## Verification

React tests (`packages/react/tests/agent-chat.test.mjs`, 9), the full React suite (495), manifest parity, contracts, app typecheck, playgrounds. In the browser preview (4420), 2026-10-19.

## Feedback log

- 2026-10-28 · chat set review (https://claude.ai/artifact/3ZRgoiUPiX6kkQxgt1MJTw): in Theme setup the progress Plan's
  text sat at 17, the answers' framed list at 16 and the question card at 15; owner: "move them to 13 anyway" → a bar
  or rail Plan keeps the agent card column (list padding 4, as the plain tray), its bar 12 above the bottom. The head
  stays 8 taller. In review.
- 2026-10-25 · owner: "Drop the line on Edit summary, Queue and Plan too, and tighten the bar Plan's spacing as shown"
  (after Code block's header lost its rule; comparison page https://claude.ai/artifact/914gYc7RXYaRuK8mk2erRb) → no
  seam under the head. Measured head middle to first row middle against the row pitch: Plan and Queue 1.1, Edit
  summary 1.2, Cursor's to-do tray 1.0 (its stylesheet: header 28, body padding 8, no border), so no spacing change
  except Plan's open bar (below).
  Plan's open bar keeps 8 under it (was 16 above a rule; 1.3 rows to the first item, now 1.1).

- 2026-10-25 · owner (five agent-timeline references; "i dont mind adding containers back into the tracker as long as
  the padding, alignment and visual balance is right") → research round 2 (progress-tracker README): a box belongs to
  payload, an open step's results, or groups with their own head, never to a plain row. Built: the steps box again
  (on the item's text column, to the row's edge, recessed, padding 4 0, list corner), steps muted and 2 shorter each
  side, done and cancelled as rings with a tick or cross (one mark family), the rail 4 short of each ring.

- 2026-10-25 · owner: "a collapsible and expandable container ... that shows overall progress and added detail" → bar
  (single, segmented), item meta and progress (the ring), count; reopened to In review. Gallery tiles Bar / single and
  Bar / segmented; React test for the bar's one value and hidden segments. Setup's pinned progress is a Plan.
- 2026-10-25 · owner: "maybe there is no need for a container here" → the steps lose the inset box (no fill, edge or
  padding; out of layers.css's recessed lists): rows under the item's words, marks on its text column, 33 apart, the
  next item 36 on as the rail's rows are.
- 2026-10-25 · owner: "theres too much padding in the gray container, and the corner radius looks too sharp" → the
  steps box takes Menu's list padding 4 at every room (was the tracker's 8) and the list corner `radius-list` (the
  row corner plus 4; was the card corner less 8).
- 2026-10-25 · owner: "Apply the proposed spacing to Plan (16 inset, 12 title to bar, 16 under, rail rows 4 apart)" →
  applied to the tracker forms (a bar or a rail); the plain to-do tray keeps the agent card's 12 with Edit summary and
  Queue.
- 2026-10-25 · owner: "i want the whole progress data tracker to be in 1 container. i basically like this design" (an
  agent run: a head with its state, steps on a rail, values as chips, nested findings in inset boxes) → `rail`, `icon`,
  item `detail` and item `items` (one level, in an inset box declared as a recessed ground); an item with detail or
  steps is not struck. Tile Rail; React test. Setup's tracker is one rail Plan.
- 2026-10-25 · owner: "keep refining the details, alignment, type size, information density" (Claude's Context
  panel, an agent timeline, Codex's status, Linear's activity) → the head reads title, chevron, then the count at the
  end, so the head's count and the items' meta form one column (was title, count, chevron at the end).
- 2026-10-25 · owner: "drop the strike-through when an item has meta (phases), keep it for plain to-dos" → done and
  cancelled items with meta keep their mark and muted ink, unstruck.

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
| Lines in the transcript | the reply's type (text-lg); 4 between a line's parts | Message; Cursor ToolCallLine gap 4 |
| Cards (Edit summary, Plan) | one size, text-base; sm buttons | Cursor: cards 13 under a 14 reply |
| Card frame | the card edge at stroke-width, container corner, surface fill | Code block |
| Card column | text 12 in: Menu's list padding 4 + the row inset 8 | Menu; Cursor card header 0 12 |
| Card head | one row tall, no rule under it (2026-10-25); a trailing button (row − control) / 2 from the end, never under 4 | Code block's header |
| Card rows | Menu rows: row height, row inset, row corner, row plate (pressed: bg-component-pressed), Menu's row gap `gap-row` (12, compact 8) so a label after the icon slot lands on the list column, and `ui-row-gap` (2, compact 0) between rows | Menu (`--_menu-gap`, surface.css) |
| What a line opens | 4 under the line, on a 1px rail with its content 12 in | Cursor content gap 4; Claude Code's rail at 12 |
| Backplates | one: the row plate under the pointer or focus | Menu |

Changed here: the Plan is the agent card (was a recessed grey tray with no edge), at text-base (was the reply's 16), a
rule under its head when open, its items Menu rows a row tall with the first line centred (were 4 apart on a 22
line). The head's title and the marks share the 12 column. Ink: the current item default, the rest muted (Cursor);
done and cancelled struck.

Missing variants (owner: "are there any missing variants?"): an item can be **cancelled** (Cursor's todos have
pending, in progress, completed and cancelled; Claude Code's and Codex's have the first three): struck, with a cross.
Added, with a tile. Not added: an inline "Updated plan" card in the transcript (Codex) — the Step line "Updated the
plan" plays that part; a folded head that names the current item — no product verified to do it.

## Open questions

- Should the folded head name what it is doing now ("Plan · Edit button.css") instead of only the count? Cursor's tray
  does (bundle 3.27: `${inProgressTodo.content}, ${n} of ${m}`).

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

## Review note, 2026-10-25

- **What changed:** Plan can now be a whole progress tracker in one container.
  - A bar under the head stays when it folds: one bar, or a segment per item.
  - Each item can carry its own count at the row's end ("2 of 4"), values as chips after its words, and its own steps
    in a recessed box under its words: the box starts at the item's words, the steps are muted and closer together
    than items, and their values end on the same edge as the items' counts.
  - Done is now a ring with a tick, cancelled a ring with a cross, so every mark is the same circle. It was a bare
    check. The rail stops 4 short of each ring and runs on beside a steps box.
  - `rail` joins the marks with a line, a timeline. `icon` puts a glyph before the title. `count` sets the head's
    count.
  - A current item with a known share shows a ring filling, and its segment of the bar fills with it.
  - The head reads title, chevron, then the count at the end, in line with the items' counts. It was title, count,
    chevron.
  - Done items with a count, chips or steps (phases) are not struck through; plain to-dos still are.
- **Why:** you asked for a simple collapsible tracker of overall progress with detail on demand, then for "the whole
  progress data tracker ... in 1 container" like the agent-run timeline. Cursor, Codex, GitHub and Linear all keep a
  one-line summary with a bar or ring that opens to the items
  (docs/research/progress-tracker-2026-10-25). The box came back after your five timeline references: there, a box
  holds only an open step's results, and the agent panel's sits on the label column with tighter rows inside.
- **Also changed (later the same day):** no line under the head or the bar. With a bar, the open plan keeps 8 under the
  bar instead of 16, so the first item sits as close to the bar as rows sit to each other. You asked for Edit summary,
  Queue and Plan to match Code block, after comparing them with and without the line.

## Review note, 2026-10-26 (interaction pass)

- **What changed:** The items ease open and shut with the head's chevron, on Accordion's recipe.
- **Why:** They snapped while Accordion eased. You asked for the Slider's motion and detail pass on every component; measured across all 118 families ([the pass](../research/interaction-pass-2026-10-26/README.md)).

## Review note, 2026-10-28 (chat set review)

- **What changed:** A Plan with a bar or a rail puts its text 12 inside the frame, as the plain Plan, Edit summary and
  Queue do (it was 16, a Card's room). The bar sits 12 above the bottom (was 16). The head keeps its extra 8 above the
  title.
- **Why:** In a chat column the boxes' text started 1–3px apart: Theme setup stacked the progress Plan (17), the framed
  answers (16) and the question card (15). You chose one card column, "move them to 13 anyway".

## Review note, 2026-10-29 (round 85)

- **What changed:** a cancelled item shows its ring with a cross, as specified, in light and dark; done items keep the
  tick. A cohesion test checks the cross's rule outranks the shared tick rule.
- **Why:** the cross's rule was one class lighter than the rule that draws the tick for done and cancelled items, so
  the tick won and a cancelled item looked done (only its hidden "Cancelled" text told them apart).
- **Verdict:** approved (owner, 2026-10-29, review page rounds 85–89); Complete.

- 2026-11-02 · trackers review (owner: "the trackers dont look right, the type ramp looks wrong, the alignment looks off
  … also delete the agent icon … do the trackers need to be smaller?").
  - **What changed:** the steps box takes its item's end padding instead of adding 4 below it and its last step's 2, so the steps sit 16 from their item and from the next, as items sit 16 apart (were 16 and 22). The Plan stays at text-base: a same-day trial at the
    reply's text-lg (15/22, items as plain lines) was reverted. The Feed kit's Plan drops its glyph and its hand-written
    count ("3 of 5" over three segments; now the Plan's own "1 of 3").
  - **Why:** the trackers are UI under the reply's prose, so they share one size (Step, Edit summary, Approval, Turn
    notice at text-base too). At Layer contrast 0 the box is flat, and its extra 4 left a hole under the steps (25 against
    20 above).


## 2026-11-02: variant plain

Owner, in the Chat kit (Labs › Chat): "the tracker, do they need containers? the containers look off, and out of place, not
even padding around them, gaps look either too big or too small". Measured in docs/research/chat-kit-2026-11-02: the
references' turn summaries and tool rows carry no box (only an opened output does), and grouped tool rows sit unboxed, and in Area's turn the boxed Plan sat 27 (text to text) from the line above against a Step's 13. `variant`
(surface, the default and unset; plain) is Area's name for a frame that can go (Calendar, Description list). Plain drops
the border, fill and corner and the list's 4 padding, and hangs the plan one row inset into the margin, so its
words start on the text edge around it and its row plates hang outside it (as Nav's and Message actions' do); its head is
the text's line and its last row's half-leading hangs past its foot, so the words above and below are the turn's gap
away. A plain plan is not a raised ground (layers.css). The diff (Edit summary) and nested steps (Plan) keep
their own grounds.

## 2026-11-04: read on its glyphs (Q-T2)

Owner, "Apply both" on Kit Type Decisions (artifact KeEDPx5sUTQXE6iKtu6sw1; docs/research/kit-type-2026-11-04). Plain gives back its head's half-leading at its top, and its last item's at its foot unless that item holds its steps box, Step's rule, so the gaps around a plain plan in a turn are read on the glyphs. Test: `packages/react/tests/type-rhythm.test.mjs`.

## 2026-11-04: margins kept apart

Plain is its own block formatting context (`display: flow-root`, 2026-11-04 kit pass): its list's negative foot and its own glyph margin had collapsed to the larger of the two, so the next tracker sat 20.4 under the last item's baseline in the Chat kit against the turn's 16. Measured after: 16.0.

### 2026-11-07 · Shared status words (system gaps C1)

- **What changed:** A finished item is `complete` (`area-plan__item--complete`); `done` still works for one release.
- **Why:** one set of status words across Plan, Stepper, Step, Queue, Attachment, File upload, Edit summary and Turn
  notice (GOVERNANCE.md, "Status words"; owner picked Build on the system gaps review, 2026-11-07).
- **Verdict:** awaiting the owner.

- 2026-11-11 · System evaluation F5: the manifest gives `variant` its default, `surface`, so `--surface` is written by default; the bare class and `--surface` draw the same frame. No visual change.
- 2026-11-11 · system evaluation A2.2 · the steps box takes the block corner, radius-container: 14 → 16 at the default (it was the list corner, which A2.1 moved to 12). plan.css; cohesion.test.mjs.
- 2026-11-11 · system evaluation B2.3 · the mark-to-text gap is Menu's icon-to-label gap, `ui-cluster` (8, Compact 6; was `gap-row`), so the text stays on the list column.

### 2026-11-13 · One chat card (system plan, Phase 2, B1.3)

- The frame is the chat card (`surface.css`): its corner (16 at the default, 14 at Compact), rows 4 from the outer edge
  with the edge counted once, so the words and the head's title start 12 in (were 13), a one-row head, a strong title.

## Shared bars and corners (plan B4), 2026-11-14

- B4.4: the head, title, chevron and count are the one collapsible head (inset.css), shared with Queue: no change at the defaults. A single or segmented tracker's head keeps its 8 more above (owner, 2026-10-25).

### 2026-11-14 · Shared parts, leftovers (system plan, Phase 2, wave 3)

- The single and segmented head's top, the open bar's bottom, an item's meta start and the words-to-detail gap are `ui-cluster` (6 / 8 / 10). Values at type 13 Compact / Default / Comfortable; unchanged at the default.
- Why: docs/research/system-evaluation-2026-11-11 (plan B6.1, B6.5, B8.2, B2.2; README §5, phase2/leftovers.md); the owner took every recommendation on 2026-11-11. Fix the rule, not the instance.
- Verdict: awaiting the owner.
