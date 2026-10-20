# Queue spec

**Captures:** none live. Evidence: `docs/research/inspector-chat-2026-10-18/composer-additions.md`, section D.
**Peers:** Plan and Edit summary (the agent card), Menu (rows), Composer (`onQueue`)

## Job and boundaries

Messages written while an agent works wait above the composer and go in order when it finishes. Each row is one
message on one line; hovering or focusing it offers Send now (stops the run and sends it, Cursor's Send Now) and
Remove. A row being sent dims with a spinner; one that failed shows a mark and Retry. Steer (send without stopping)
and reordering by drag need the engine (Phase 3) and are not built.

## Variants

| Axis | Value | Where |
|---|---|---|
| item status | queued, sending, failed | Codex (sending .6 + spinner; paused / failed with Retry) |

## Decisions

| Slot | Area | Basis |
|---|---|---|
| card | the agent card: Code block's frame, text-sm, one-row head with a rule when open, Menu rows | Plan, Edit summary (peers); Cursor tray rows 13/18, radius 6 |
| head | "N queued" in the muted ink, a chevron; folds | Cursor "N Queued", tone muted |
| actions | Send now (ghost sm) and Remove (icon), over the row's end on hover or focus; always on a failed row (Retry in place of Send now) and on touch | Cursor hover actions; Codex Steer + Delete |
| paused | not a prop or state of Queue: the app passes `title` ("N queued, paused") after the person stops a run, until the next send (`apps/desktop/src/chat/chat.tsx`, `session.queuePaused`) | Codex "Queue paused because you interrupted" |

## Feedback log

- 2026-10-19 · built. Browser check: a queued message goes when the run finishes; Send now's tooltip first described
  Steer (Cursor's other action) and was corrected.

## Review note, 2026-10-19

- **What changed:** new: messages you write while the agent works wait above the composer and go in order; each can
  be sent now or removed.
- **Why:** Cursor and Codex both queue; without it the composer could not take a message mid-run.

## Round 51 coherence pass (2026-10-19)

Approved in round 50; shared fixes: Send now and Remove follow the row-action rule (muted, default ink on hover and
press; their own plate was the row's grey), the head's chevron gets Accordion's hover plate, and it turns on `fast`.

## Review note, 2026-10-19 (round 51)

- **What changed:** Send now and Remove darken their text on hover instead of showing an invisible grey; the head's
  arrow gets the same hover as the plan's.
- **Why:** the same interaction fixes as the edit summary and plan, so the three cards behave alike.
  At rest it looks the same; the page marks it changed because the arrow's box grew to hold the hover square.

## Round 52 (2026-10-19)

Approved in round 51; it shares Plan's head (equal insets for the chevron's plate, its corner concentric) and Edit
summary's row buttons (the row's corner less their inset).
