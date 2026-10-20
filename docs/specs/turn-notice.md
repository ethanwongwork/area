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
| kind | stopped, error, compacted | the three turn endings the products name | Codex "■ Conversation interrupted", "You stopped after {time}", "Stop and retry"; Cursor `.composer-error-title` + Retry / Resume; Claude Code compact row "Conversation was compacted to free up context.", interrupted turns in secondary italic |
| action | none, a Button (Retry) | — | Cursor, Codex |

## Decisions

| Slot · property | Area value | Basis | Reason |
|---|---|---|---|
| type | text-md (Message's), muted | claude-code secondary; codex muted | no italic: Area does not set type in italic |
| icon | 16 slot: stop, info (error, compacted) | codex ■ marker; Area glyphs | — |
| error ink | the icon in fg-danger; text stays muted | cursor error title; Area keeps text readable | — |
| gap | 8 | Area's icon-text gap (gap-md) | — |
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

- 2026-10-19 · owner, round 49 (rethink): "make sure the text styles and colors, and gaps, padding, margins, overall spacing/layout are cleaned up, intentional, accurate, and consistent" → a cleanup pass: every text style, color, gap and inset traced to a reference value or an Area peer, written below.

## Review note, 2026-10-19

- **What changed:** new: one quiet line where a turn ended other than by finishing: stopped, failed (with a retry), or the conversation compacted.
- **Why:** Cursor, Codex and Claude Code each mark a stopped or failed turn in the transcript instead of leaving it cut off.

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

Changed here: the line takes Step's line exactly (the reply's type, the 16 icon slot, 4 between its parts; was the
gap-md token, the same 4 by another name); an error's words are in the default ink (Cursor's error title, Codex's red
■), its icon in the danger ink; stopped and compacted stay muted.

## Review note, 2026-10-19 (round 50)

- **What changed:** an error's message is now in the normal text colour, so it reads as the one notice that needs
  you; stopped and compacted stay quiet. Spacing is now exactly a step line's.
- **Why:** you asked for intentional, consistent spacing and colour; the notice sits among the steps, so it shares their
  line.
