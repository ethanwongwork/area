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

API: `items`, `onSendNow(id)`, `onDismiss(id)` (Remove; `onRemove` stays as a deprecated alias for one release,
`onDismiss` wins), `onRetry(id)`, `open` / `defaultOpen` / `onOpenChange`. The list is an `ol`: messages send in
order.

## Decisions

| Slot | Area | Basis |
|---|---|---|
| card | the agent card: Code block's frame, text-sm, one-row head with a rule when open, Menu rows | Plan, Edit summary (peers); Cursor tray rows 13/18, radius 6 |
| rows | an `ol` with Menu's list padding 4 and ui-row-gap between rows; each row ui-row tall, row inset, row corner, Menu's row gap (gap-row: 12, compact 8); the row plate on hover and focus | Menu (peer) |
| sending | the text at 60% opacity (`--_sending-opacity`), a Spinner sm in the 16 slot | Codex sending opacity-60 |
| chevron | closed points along the reading direction (−90°, +90° in RTL), down when open, turns on `fast`; Accordion's hover plate | Plan (peer) |
| head | "N queued" in the muted ink, a chevron; folds | Cursor "N Queued", tone muted |
| actions | Send now (ghost sm) and Remove (icon), over the row's end on hover or focus; always on a failed row (Retry in place of Send now) and on touch. The last one ends as far from the row's end as from its top, never under 4, and the buttons' corner is the row's less that same inset | Cursor hover actions; Codex Steer + Delete; Edit summary's row buttons |
| paused | not a prop or state of Queue: the app passes `title` ("N queued, paused") after the person stops a run, until the next send (`apps/desktop/src/chat/chat.tsx`, `session.queuePaused`) | Codex "Queue paused because you interrupted" |

## Feedback log

- 2026-10-19 · built. Browser check: a queued message goes when the run finishes; Send now's tooltip first described
  Steer (Cursor's other action) and was corrected.
- 2026-10-19 · audit: `ul` → `ol` (messages send in order); `onRemove` → `onDismiss` (deprecated alias kept); the
  card-end inset clamped at 4 as Edit summary's, used for both the buttons' inset and their concentric corner; rows
  take Menu's gap-row and ui-row-gap; the closed chevron mirrors in RTL; the sending opacity moved into a `/* spec */`
  property.

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

## Review note, 2026-10-19 (round 55, design-system audit)

- **What changed:** Rows sit on Menu's list column (12 at Default) with Menu's 2 between rows; at Compact the row actions end 4 from the edge as Edit summary's do (they were 2); the closed chevron mirrors in right-to-left text; the list is an ordered list. Remove is `onDismiss` (the old `onRemove` still works).
- **Why:** The audit found the row gap, the card-end inset and the chevron differed from Edit summary's and Menu's; messages send in order, so the list is ordered.

## Review note, 2026-10-19 (round 56)

- **What changed:** The open head's seam takes `border-decorative`, as Edit summary's and Code block's (it was `border-divider`, darker than the frame).
- **Why:** you asked on Edit summary whether the frame and the divider were meant to differ. They weren't: DESIGN_SYSTEM.md says a rule inside a container is never darker than the container's edge, and seams inside a card take the seam colour. The same seam was fixed wherever it appeared.

## Review note, 2026-10-20 (round 62)

- **What changed:** Its rows and row buttons now take the plate made for its raised card. In light at the default settings nothing moves (there the raised plate equals the page's);
  in dark and on a grey page its hover, selected and pressed plates are now the same step from this surface as every
  Card's and Menu's (dark: #272727 on #121212, was #212121).
- **Why:** you asked that hover colours come from rules, not one-off fixes. The rule is now written (DESIGN_SYSTEM.md,
  Layers: a component that paints a ground declares it in layers.css) and enforced by a test; this family painted a
  raised ground without declaring it.
