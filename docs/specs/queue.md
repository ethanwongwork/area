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
| item status | queued, sending, error (`failed` a deprecated alias) | Codex (sending .6 + spinner; paused / failed with Retry) |

API: `items`, `onSendNow(id)`, `onDismiss(id)` (Remove; `onRemove` stays as a deprecated alias for one release,
`onDismiss` wins), `onRetry(id)`, `open` / `defaultOpen` / `onOpenChange`. The list is an `ol`: messages send in
order.

## Decisions

| Slot | Area | Basis |
|---|---|---|
| card | the agent card: Code block's frame, text-base, one-row head with no rule under it (2026-10-25), Menu rows | Plan, Edit summary (peers); Cursor tray rows 13/18, radius 6 |
| rows | an `ol` with Menu's list padding 4 and ui-row-gap between rows; each row ui-row tall, row inset, row corner, Menu's row gap (gap-row: 12, compact 8); the row plate on hover and focus | Menu (peer) |
| sending | the text at 60% opacity (`--_sending-opacity`), a Spinner sm in the 16 slot | Codex sending opacity-60 |
| chevron | closed points along the reading direction (−90°, +90° in RTL), down when open, turns on `fast`; Accordion's hover plate | Plan (peer) |
| head | the one collapsible head (inset.css, plan B4.4): "N queued" strong in the default ink, the chevron 4 after it; folds | Cursor "N Queued" (its muted tone and end chevron set aside for the chat cards' one head, VS7) |
| actions | Send now (ghost sm) and Remove (icon), over the row's end on hover or focus; always on a failed row (Retry in place of Send now) and on touch. The last one ends as far from the row's end as from its top, never under 4, and the buttons' corner is the row's less that same inset | Cursor hover actions; Codex Steer + Delete; Edit summary's row buttons |
| paused | not a prop or state of Queue: the app passes `title` ("N queued, paused") after the person stops a run, until the next send (`apps/desktop/src/chat/chat.tsx`, `session.queuePaused`) | Codex "Queue paused because you interrupted" |

## Feedback log

- 2026-10-25 · owner: "Drop the line on Edit summary, Queue and Plan too, and tighten the bar Plan's spacing as shown"
  (after Code block's header lost its rule; comparison page https://claude.ai/artifact/914gYc7RXYaRuK8mk2erRb) → no
  seam under the head. Measured head middle to first row middle against the row pitch: Plan and Queue 1.1, Edit
  summary 1.2, Cursor's to-do tray 1.0 (its stylesheet: header 28, body padding 8, no border), so no spacing change
  except Plan's open bar (below).

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

- **What changed:** The open Queue has no line under its head. The messages start right under "2 queued".
- **Why:** you dropped the line under Code block's header, then asked for Edit summary, Queue and Plan to match. The
  first message already sits about a row under the head (Cursor's queue and to-do trays draw no line either), so the
  spacing stays.

## Review note, 2026-10-26 (interaction pass)

- **What changed:** The queued messages ease open and shut with the head's chevron, on Accordion's recipe.
- **Why:** They snapped while Accordion eased. You asked for the Slider's motion and detail pass on every component; measured across all 118 families ([the pass](../research/interaction-pass-2026-10-26/README.md)).

### 2026-11-07 · Shared status words (system gaps C1)

- **What changed:** An item that didn't send is `error` (`area-queue__item--error`); `failed` still works for one release.
- **Why:** one set of status words across Plan, Stepper, Step, Queue, Attachment, File upload, Edit summary and Turn
  notice (GOVERNANCE.md, "Status words"; owner picked Build on the system gaps review, 2026-11-07).
- **Verdict:** awaiting the owner.

### 2026-11-07 · A message not sent is said (components audit O6)

- **What changed:** when a queued message can't be sent (`status: "error"`), the shared announcer says "“{text}”: Not
  sent", politely, as Message and Attachment now say their failures. Nothing on screen changed. Reopened from Complete.
- **Why:** a failure away from focus was silent to screen readers (DESIGN_SYSTEM.md "Announcements"); one rule for every
  send or upload that fails (cohesion test).
- **Verdict:** awaiting the owner.
- 2026-11-11 · system evaluation B2.3 · a row's gap is Menu's icon-to-label gap, `ui-cluster` (8, Compact 6; was `gap-row`).

### 2026-11-13 · One chat card (system plan, Phase 2, B1.3)

- The frame is the chat card (`surface.css`): its corner (16 at the default, 14 at Compact), rows 4 from the outer edge
  with the edge counted once, so the words and the head's title start 12 in (were 13), a one-row head, a strong title.
- Queue's title is strong in the default ink (was muted).

## Shared bars and corners (plan B4), 2026-11-14

- B4.2: a row's actions sit as far from the row's end as from its top, (row − control) / 2 (2 at the defaults; the end was floored at 4), and are concentric with the row: 8 − 2 = 6 (was 4).
- B4.4: the head is the one collapsible head (inset.css): "N queued" strong in the default ink, the chevron 4 after the title (it stood at the card's far end), a row tall.

## State paint (plan B7.11), 2026-11-14

- Row actions hide only inside `@media (hover: hover)`; on touch they sit in the row, shown (the margin moved to the base rule).
