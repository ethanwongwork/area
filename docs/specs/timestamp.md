# Timestamp spec

**Status:** built · in review · 2026-10-19
**Captures:** none live. Evidence: `docs/research/inspector-chat-2026-10-18/composer-additions.md`, section E.
**Peers:** Turn notice (the other centred / quiet transcript line), Message

## Job and boundaries

When a turn was sent, as one centred muted line between turns, shown only after a pause: before a person's message
that comes over an hour after the one before it, or before the first if it is over an hour old (Codex). No product
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
