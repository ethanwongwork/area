# Timestamp spec

**Captures:** none live. Evidence: `docs/research/inspector-chat-2026-10-18/composer-additions.md`, section E.
**Peers:** Turn notice (the other centred / quiet transcript line), Message

## Job and boundaries

When a turn was sent, as one centred muted line between turns, shown only after a pause. The component draws the
line; the caller decides where. `TIMESTAMP_GAP` is one pause, an hour (`ComposerParts.tsx`; Codex `o=36e5`): a timestamp
goes before a person's message that comes over an hour after the conversation's last turn, either side's, or before the
first message if it is over an hour old (`apps/desktop/src/chat/chat.tsx`; a reply ends at its prompt's time plus its
duration). Replies never get one, since a reply follows the message it answers (owner, 2026-10-19; Codex's 10-minute
reply pause was dropped). No product
puts a time, model or read mark on every message (Cursor and Codex: none; Claude Code: off by default), so Area has no
per-message metadata. `formatTimestamp` words it as Codex does: Today / Yesterday, the weekday within a week, "Tue,
Oct 14" within a year, else "Oct 14, 2025", then the time.

## Decisions

| Slot | Area | Basis |
|---|---|---|
| type | text-sm, muted, centred | Codex 14/20 text-tertiary under a 13 chat |
| space | none of its own; the conversation's gap | Area: components own no outer margin (Codex py-4 on its row) |

## Review note, 2026-10-19

- **What changed:** new: a quiet centred time between turns after a long pause.
- **Why:** Astryx's set has message times; none of the agent apps puts one on every message, and Codex shows exactly
  this, so this is what Area does.
