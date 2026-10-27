# Progress trackers: a plan's overall progress with detail on demand (2026-10-25)

Owner: "i want a collapsible and expandable container like these, very simple tho, that shows overall progress and
added detail. will need to build this component. can you research products that have a progress tracker like this?
github? even claude, chatgpt, cursor, should have some sort of task tracker visual". References sent: an onboarding plan
(segmented phase bars, phases with "5/9 tasks"), a Design System card ("3 of 4", 75%, checklist), a roadmap card (60%
bar, phases with rings and task counts), an agent run (steps on a rail), Codex's "Step 4 / 5" pill, Linear's activity.

All read-only: installed app bundles, signed-out public pages, open-source code.

## Sources

| Product | What | Where read |
|---|---|---|
| Cursor 3.27 | agent todo tray; plan editor phases; ProgressBar (single, segmented), ring, pie | `/Applications/Cursor.app/…/workbench.desktop.main.{js,css}`, `workbench.glass.main.css` (stylex classes decoded) |
| Codex (ChatGPT.app) | todo plan pill "Step N / M" with a donut, its plan in a tooltip; collapsible plan summary | `app.asar` → `webview/assets/sites-end-resource-*.js` (`codex.todoPlan.pillProgress`), `localConversation.planSummary.*` |
| Claude (claude.ai, Claude Code) | todo rail shimmer while building; a progress rail with numbered steps; todo reveal highlight; Claude Code todos | claude.ai stylesheets (signed out); `inspector-chat-2026-10-18/claude-code.md` |
| GitHub / Primer | ProgressBar (sizes, segmented items, ARIA); sub-issues progress ring and "9 of 12"; milestone bar; Actions states | primer/react `ProgressBar.module.css`, `ProgressBar.tsx`; DOM of public pages (microsoft/vscode) |
| Linear | status marks (ring with a filling pie), progress formula, milestones % | linear.app DOM; `linear/linear` SDK schema; linear.app/docs |

## Findings

**Folded summary.** Every product keeps a one-line summary that opens to the detail:
- Cursor's tray head: "{current to-do}" while one is in progress, else "3 of 5 To-dos Completed", else "5 To-dos";
  28 tall, padding 0 12, gap 8, title 14/22 in the secondary ink, count in the tertiary; body padding 8 16; the tray
  bg-quaternary, 1px stroke-quaternary, radius 8.
- Codex: a pill "Step 4 / 5" (the in-progress step's number) beside a donut, chat size, secondary ink, gap 6; hovering
  shows the whole plan (rows 8 apart, 16 marks, done in the tertiary ink). The plan summary card collapses and expands.
- GitHub sub-issues: a section head "Sub-issues" with a 14px ring and "9 of 12" (12/600); a chevron button
  (`aria-expanded`) folds the list. Under the issue title, a 16px ring and "9 / 12".
- Claude: the cowork panel's "Progress" folds; a rail of numbered steps; a shimmer runs down the rail while the plan
  builds; a new todo flashes a 1.4s highlight.

**Bars.**
| | Height | Radius | Segments | Fill |
|---|---|---|---|---|
| Cursor ProgressBar | 4 (spacing-1) | 2 | 2 apart (spacing-0-5), radius 1, `flex-grow` by value | accent, or foreground |
| Primer ProgressBar | small 5, default 8, large 10 | 3 | 2 apart, one colour each | success green by default |
| GitHub milestone | Primer small (5) | 3 | — | success green; "14% complete · 12 open · 2 closed" |

**Counts.** "9 of 12" beside a heading (GitHub, Cursor "3 of 5"); "9 / 12" in compact metadata (GitHub rows, Codex
"Step 4 / 5"); "14% complete" for milestones (GitHub, Linear); bare numbers on group heads (Linear).

**Phases.** Cursor's plan editor groups to-dos in phases: a phase head 20 tall, 14/22 in the tertiary ink, 10 below it
to a 1px rule, 10 more to the list. The references' onboarding plan and roadmap do the same with a count per phase.

**Status marks** (one shape family at 14–16): Cursor in progress, `check-circle` done, `x-circle` cancelled,
`circle-dashed` pending; GitHub open / closed / skipped and Actions' spinner; Linear's 12px ring with an inner pie
showing how far the status is (todo empty, in progress half, in review three-quarters, done a filled check).

**Weighting.** Linear counts started issues as 25% done in project progress; Primer and Cursor take the value given.

**Accessibility.** Primer puts `role="progressbar"` on each segment (the container has none); GitHub's milestone bar
is `aria-hidden` next to its text; GitHub's ring has "9 of 12 Issues completed" as hidden text.

## What Area does

Intake: rung 4–5, not a new family. Plan already is the job (what is done, now and next, a count, folds to its head;
Cursor's tray, Codex's plan, Claude Code's todos). What the trackers add is an overall bar that stays when folded,
phases with their own counts, and a mark for how far the current item is. So Plan gains:

| Addition | API | From |
|---|---|---|
| A bar under the head, staying when folded | `bar="single" \| "segmented"` (manifest axis `bar`, default `none`) | Cursor's ProgressBar, Primer's segmented bar, GitHub milestones |
| Segments 2 apart, Progress sm (4) each | the segments are Progress | Cursor 4 high / 2 apart; Primer 2 apart |
| One progressbar for the whole plan, named by the title, the count as its text; the segments hidden | — | Primer (per-segment roles) simplified: one plan, one value |
| An item's trailing value ("2 of 4", a date) | `PlanItem.meta` | GitHub "9 of 12", Cursor and the references' phase counts |
| How far a current item is: its segment fills that far and its mark is a ring filling as a pie | `PlanItem.progress` (0–1) | Linear's in-progress ring, GitHub's sub-issue ring, Codex's donut |
| The head's count when the items are phases of a larger count | `count` | Setup: "9 of 14" questions in 8 chapters |

Done items: struck as to-dos (Cursor), but not when they have meta (owner: phases keep their check and count, unstruck).

Not taken: per-segment colours (Primer, Cursor; Area's bar takes the selection fill, one role); Linear's 25% weight
(the value is the caller's); a percent in the head (the count reads the same and fits); folding each phase (the plan
folds as one, simple as asked).

Boundary change: Plan's "instead" row for Stepper said "Stepper is the person's progress; a Plan is the agent's". A
person's setup is a plan too (the references' onboarding plan), so the line is now: Stepper's markers take the person
to a step; a Plan reports how far a plan has got, whoever sets its states.

Setup uses it as its pinned progress: folded to "Shape · 9 of 14 · about 1 min left" over a bar of a segment per
chapter, opening to the chapters with "2 of 3" each and the current chapter's ring.

## Open

- Cursor's folded head names the to-do in progress. Plan's spec has had this as an open question since 2026-10-19;
  the Cursor bundle now confirms it (`${inProgressTodo.content}, ${n} of ${m}`).
- Hover detail (Codex's pill shows the plan in a tooltip) is not built: Plan opens in place.

## Round 2: timelines with containers (owner references, 2026-10-25)

Owner: "i like these visual references, can you analyze and research each one and break down how each is structured
and see what can be take from it? i dont mind adding containers back into the tracker as long as the padding,
alignment and visual balance is right. look at the examples to see when it would be appropriate to include".

Five images: a Run Details card (an agent's workflow), an agent tool list (two crops of one design, a Claude-style
summary), a numbered research stepper, and an agent panel ("Analyzing…" with a step rail). Only images exist, so they
were read off their pixels with a PNG sampler (`png.py` in the session scratchpad: ink extents, edge profiles). Each image is at its own
scale, so every value is taken in units of its own text: the cap height of the body text over Inter's 0.727 gives the
em, and the value is shown at Area's 14. Values are ±1; radii were not readable reliably and are given relatively.

| Reference | Body cap (px) | em (px) | ×14 |
|---|---|---|---|
| Run Details | 14 | 19.3 | 0.725 |
| Agent panel | 14 | 19.3 | 0.725 |
| Tool list | 17 | 23.4 | 0.60 |
| Stepper | 12 | 16.5 | 0.85 |

### Run Details (agent workflow card)

- **Shape:** one outer card (header, then body). The body holds an outer rail of 30 nodes (a logo, a grey dot), dashed,
  outside everything else. Each node owns a **group card**: a 36 header row on a subtle fill (title, "10m ago",
  chevron), then a white body.
- **Group body:** steps with a filled green check (12), the label 8 after it, primary ink, and the duration at the end in
  the tertiary ink. Each step has sub-lines hanging from a tree line dropped from the check's centre. The sub-lines are
  in the secondary ink, and a value follows its label as a 22-high mono chip.
- **Rhythm:** sub-lines 32 apart, 36 from a step's last sub-line to the next step. The header text sits 12 in, and the
  steps' checks 12 further in (the body is inset from the header's text). Padding is 12 around and between the group
  cards.
- **Alignment:** every trailing value ends on one line, and rows without a chevron keep its column empty. The group
  card takes a smaller corner than the outer card.

### Agent panel ("Analyzing…")

- **Status card** at the top: 52 high, raised (white on the grey panel), spinner, title, "2 MIN REMAINING" at the end.
  It spans from the marks' outer edge to the panel's right edge.
- **Step rail:** 16 marks (pending a light hollow circle, active a ring with a dot), the label 12 after it in the
  muted ink, values as 22-high mono chips 8 after the label. Pending rows are 38 apart (their chips make them tall).
  The rail runs mark to mark, stopping about 4 short of each.
- **The active step's results sit in a box:**
  - recessed (one step darker than the panel, 1px edge, small corner), 12 under the step's label;
  - its left edge on the label's text column, its right edge on the panel's;
  - inside, 14 marks (outlined check, spinner) 16 in, text 8 after, rows 30 apart, about 8 above and below;
  - the rail keeps running to the left of the box.
- **Rule seen:** only the step that has results gets a box. Steps without them stay plain rows, and values stay chips.

### Tool list (Claude-style)

- **Summary row:** a mark, "18 tools, edited 5 files, ran 2 commands", a chevron right after the text, "6m 12s" at the
  end.
- **Rows** 36 apart: a 16 tool glyph (terminal, compass, task), the label about 12 after it in the secondary ink (not
  primary), its kind ("script", "file") at the end in the tertiary ink. One crop shows the kind as a filled pill
  instead.
- **Rail:** a solid line through the glyphs' centres.
- **Payload card:** the only container is the JSON output.
  - Raised (white, 1px edge, soft shadow) with a large corner.
  - It reaches about 6 beyond the rows on both sides and sits over the rail.
  - Inside: 16 padding, a "JSON" label with a copy button at the end, then the code.
- **Last row:** "Done" with a filled success check, the one coloured mark.

### Research stepper (numbered)

- **Markers:** 32 numbered circles with a 1px edge, the title 16 after them in bold. Under each circle a rail starts 8
  below it and ends about 16 after that step's content, so the rail belongs to the step rather than linking markers.
- **Content:** a field box on the title's text column, 12 under the title, 16 padding, small corner. A meta row of
  glyph-and-count pairs sits under it.
- **Rule seen:** the steps are never boxed. Their content (an input, a query builder, results) is.

### When a container belongs (all five agree)

1. **Payload:** content of another kind than steps (code, JSON, a field, a preview), boxed and raised (tool list,
   stepper).
2. **An open step's results:** the children of the active or expanded step, in a recessed box on the label column,
   with the rail running beside it (agent panel).
3. **Groups with their own head:** a card per group only when each group folds on its own and carries its own meta
   (Run Details).
4. **Never:**
   - a single step row;
   - a pending step;
   - a leaf value (it is a chip);
   - the whole timeline boxed again inside a panel that already frames it.

### What Setup's tracker takes (built 2026-10-25)

The tracker already is the outer container (Run Details' card, the agent panel). Today all levels share one rhythm.
In Setup the chapters' rows sit 36 apart and the current chapter's questions 32 apart. Both levels use 16 marks and the
same ink, with no box, so the questions read as peers of the chapters. From the references:

| Take | From | Plan / Setup |
|---|---|---|
| The current item's steps in a recessed box | agent panel | `.area-plan__steps` gets a box again: left on the item's text column, right on the meta's edge, the rail running beside it; recessed ground (layers.css), small corner (the list corner), 8 block / 12 inline padding, rows 28 apart |
| Children one step quieter than parents | Run Details, agent panel | step labels in the secondary ink, parents primary; the steps' trailing values stay muted |
| One mark silhouette | all (Cursor's `check-circle`) | done = check in a circle (today a bare check), current = the ring, pending = the hollow circle |
| Rail stops short of marks | agent panel | a 4 gap at each mark |
| Values as chips after the label | Run Details, agent panel | done chapters' answers stay outline Badges |
| A reserved trailing column | Run Details | already true (meta ends on one edge) |
| Group cards | Run Details | not now: eight chapter cards in a 50vh tray is heavy; only if chapters fold one by one |
| Payload cards | tool list, stepper | not in the tracker; the chat's answer rows and tables already are Setup's payload |

Built (owner: "Yes, build the recessed steps box, quieter step ink, circled done mark and rail gaps"): measured in the
built app at type 14, Regular: the box 8 under "Accent", its left on the chapter's text (77), its rows' marks 8 in and
their values ending on the chapters' value edge (526); steps 29 apart against chapters 36; 8 inside on every side.
Plain to-do trays keep their strike with the new ringed tick.
