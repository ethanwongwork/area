# Turn notice spec

**Captures:** none yet; evidence in `docs/research/inspector-chat-2026-10-18/`.
**Peers:** Alert (a page's message; heavier), Message, Step

## Owner decisions

- 2026-10-18: "start Phase 2 … turn-state components".

## Job and boundaries

A line at the end of a turn that says what happened to it: you stopped it, it failed (with Retry), or the conversation
was compacted to free context. Quiet, one line, in the turn's column. Not an Alert (a callout that asks for attention in
a page), not a Toast (transient).

## Variants

| Axis | Value | Justification | Where |
|---|---|---|---|
| status | stopped, error, compacted | the three turn endings the products name | Codex "■ Conversation interrupted", "You stopped after {time}", "Stop and retry"; Cursor `.composer-error-title` + Retry / Resume; Claude Code compact row "Conversation was compacted to free up context.", interrupted turns in secondary italic |
| action | none, a Button (Retry) | — | Cursor, Codex |

The axis is `status`, an outcome (Governance § 4: `kind` is an interaction role). `kind` stays as a deprecated alias
for one release; `status` wins. The CSS modifiers keep their names (`area-turn-notice--error`).

## Decisions

| Slot · property | Area value | Basis | Reason |
|---|---|---|---|
| type | text-base (the trackers' UI size; was text-lg, Message's), muted | claude-code secondary; codex muted | no italic: Area does not set type in italic |
| icon | error only: info in a 16 slot | cursor error title; Area glyphs | stopped and compacted are a divider (tracker pass 2026-11-02) |
| divider | stopped and compacted: the words, then a 1px rule in the Dividers group to the column's end, 8 after them | codex "You stopped after {t}", gap 8, full-width 1px rule | a turn's end reads as a break in the column, not another step |
| error ink | the icon in fg-danger; the words in fg-default (stopped and compacted stay muted) | cursor error title; codex red ■ | the one notice that asks for something (round 50) |
| gap | 6 between the error's icon and words (Step's icon gap); 8 before the rule | Step; codex 8 | — |
| action | ghost sm Button after the text | cursor Retry | — |

## Behavior and accessibility

`role="status"` for stopped and compacted, `role="alert"` for error, so the ending is announced once. The action is a
real Button.

## Visual pass

Seen in the browser preview on 2026-10-19: the gallery tiles in light (stopped, error, compacted). In the Chat view after Stop in Phase 1's check; not rechecked in this pass.

## Verification

React tests (`packages/react/tests/agent-chat.test.mjs`, 9), the full React suite (495), manifest parity, contracts, app typecheck, playgrounds. In the browser preview (4420), 2026-10-19.

## Feedback log

- 2026-10-18 · built for Phase 2 of the Inspector chat.
- 2026-10-19 · browser check: icon sized to fill its slot (the Glyph had no size).
- 2026-10-19 · audit: `kind` → `status` (an outcome; `kind` kept as a deprecated alias, manifest axis renamed, CSS
  modifiers unchanged); Decisions corrected to the code (gap 4, an error's words in the default ink); the shared card
  rows take Menu's `gap-row` and `ui-row-gap`, and the pressed fill.

- 2026-10-19 · owner, round 49 (rethink): "make sure the text styles and colors, and gaps, padding, margins, overall spacing/layout are cleaned up, intentional, accurate, and consistent" → a cleanup pass: every text style, color, gap and inset traced to a reference value or an Area peer, written below.

## Review note, 2026-10-19

- **What changed:** new: one quiet line where a turn ended other than by finishing: stopped, failed (with a retry), or the conversation compacted.
- **Why:** Cursor, Codex and Claude Code each mark a stopped or failed turn in the transcript instead of leaving it cut off.

## Cleanup pass, 2026-10-19 (owner, round 49)

The agent chat's shared rules (all five families):

| Rule | Value | Basis |
|---|---|---|
| Lines in the transcript | the reply's type (text-lg); 4 between a line's parts | Message; Cursor ToolCallLine gap 4 |
| Cards (Edit summary, Plan) | one size, text-base; sm buttons | Cursor: cards 13 under a 14 reply |
| Card frame | the card edge at stroke-width, container corner, surface fill | Code block |
| Card column | text 12 in: Menu's list padding 4 + the row inset 8 | Menu; Cursor card header 0 12 |
| Card head | one row tall, a rule under it when rows follow; a trailing button (row − control) / 2 from the end, never under 4 | Code block's header |
| Card rows | Menu rows: row height, row inset, row corner, row plate (pressed: bg-component-pressed), Menu's row gap `gap-row` (12, compact 8) so a label after the icon slot lands on the list column, and `ui-row-gap` (2, compact 0) between rows | Menu (`--_menu-gap`, surface.css) |
| What a line opens | 4 under the line, on a 1px rail with its content 12 in | Cursor content gap 4; Claude Code's rail at 12 |
| Backplates | one: the row plate under the pointer or focus | Menu |

Changed here: the line takes Step's line exactly (the reply's type, the 16 icon slot, 4 between its parts; was the
gap-md token, the same 4 by another name); an error's words are in the default ink (Cursor's error title, Codex's red
■), its icon in the danger ink; stopped and compacted stay muted.

## Review note, 2026-10-19 (round 50)

- **What changed:** an error's message is now in the normal text colour, so it reads as the one notice that needs
  you; stopped and compacted stay quiet. Spacing is now exactly a step line's.
- **Why:** you asked for intentional, consistent spacing and colour; the notice sits among the steps, so it shares their
  line.

- 2026-11-02 · tracker pass, from the apps' bundles, read 2026-11-02 (Cursor `ToolCallLine.js` / `todo-list.js`, Claude Code's `TurnStatusStep` and to-dos, Codex's `agent-activity-item-row`).
  - **What changed:** stopped and compacted lose their icon and become a divider: the muted words, then a rule to the
    column's end; an error keeps its info mark, 6 from its words.
  - **Why:** Codex ends a stopped turn with "You stopped after {t}" and a full-width rule, and the stop square read as a
    button among the steps.

- 2026-11-02 · trackers review.
  - **What changed:** the line reads at text-base (was the reply's text-lg).
  - **Why:** the owner: "the trackers dont look right, the type ramp looks wrong, the alignment looks off … do the
    trackers need to be smaller?" An agent's work is UI and its answer prose (Cursor's cards 13 under a 14 reply), so
    every tracker reads at text-base, one size, under the reply's text-lg; the cards' words share one 12 column.

## 2026-11-04: read on its glyphs (Q-T2)

Owner, "Apply both" on Kit Type Decisions (artifact KeEDPx5sUTQXE6iKtu6sw1; docs/research/kit-type-2026-11-04). Its one line gives back its half-leading above and below (`margin-block: calc((1cap - 1lh) / 2)`), Step's rule. Test: `packages/react/tests/type-rhythm.test.mjs`.
