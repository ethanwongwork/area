# Queue: how other products show queued messages (2026-10-22)

Read-only research. Nothing in the repo was changed. Anything not read from a primary source (an app bundle, source
code or official docs) is marked [unverified].

## 1. Area's Queue as built

| Aspect | Area | Where |
|---|---|---|
| Job | Messages written while an agent works wait above the composer and send in order | `docs/specs/queue.md:8-11` |
| Placement | its own card above the composer, over the Plan | `apps/desktop/src/chat/chat.tsx:330-333` |
| Frame | Code block's frame: 1px `border-card`, `radius-container`, `bg-surface`, no shadow | `queue.css:21-23` |
| Type | text-sm (13 at the app's setting); title in the muted ink, tabular figures | `queue.css:25`, `:48` |
| Head | one row tall (`ui-row`), padding 12 (list 4 + row inset 8), gap 8; "N queued" + chevron; plus a 1px `border-decorative` seam when open | `queue.css:28-45`; `ComposerParts.tsx:178` |
| Chevron | 12px glyph; points along the reading direction when closed (−90°, +90° in RTL), down when open; turns on `fast`; Accordion's hover plate | `queue.css:49-66` |
| List | an `ol`, padding 4, `ui-row-gap` (1px) between rows; **no max height or scroll** | `queue.css:69`; `ComposerParts.tsx:181` |
| Row | `ui-row` min height, `ui-row-inset` padding, `radius-row`, gap `gap-row` (12, Compact 8); one line with an ellipsis; the row plate on hover and focus-within | `queue.css:72-86`, `:94` |
| States | queued; sending (text at .6 + Spinner sm in a 16 slot); failed (`dismiss-circle` in the danger ink, Retry always shown) | `queue.css:96-99`; `ComposerParts.tsx:186-193` |
| Actions | Send now (ghost sm text, tooltip "Stops the run and sends this now") and Remove (icon ×); laid over the row's end on hover or focus, always on touch and on failed rows | `queue.css:100-117`; `ComposerParts.tsx:190-195` |
| Paused | not a state: the app passes `title` "N queued, paused" | `queue.md:33`; `chat.tsx:332` |
| API | `items`, `title`, `onSendNow`, `onDismiss` (`onRemove` deprecated), `onRetry`, `open`/`defaultOpen`/`onOpenChange` | `ComposerParts.tsx:142-163` |
| Not built | Steer, drag to reorder (both wait for the engine), Edit | `queue.md:10-11` |
| Demos | Default, Sending, Failed, Folded (two items each) | `apps/desktop/src/content/demos/composer-additions.tsx:59-72` |

Existing evidence is in `docs/research/inspector-chat-2026-10-18/composer-additions.md`, section D (lines 109-123):
Cursor's tray, Claude Code's "Queue another message…", and Codex's rail with its sending, paused and failed states.
The rest of this report adds to it.

## 2. Other products

### Cursor 3.24 (app bundle, read-only)
The bundle has two queue UIs.
- **IDE composer** (`workbench.glass.main.js` ≈24,605,700, Solid):
  - Header row `fst=24` px tall, clickable, toggles `isQueueExpanded`. It is open by default (`isQueueExpanded:!0` @16,227,450).
  - Chevron is `chevronRight` 14px in `icon-secondary`, turning 0→90° over `transform 0.1s`.
  - Title is `${n} Queued`, or "N Queued Message(s)" when steering is on.
  - The list scrolls at `maxHeight:200`, with a 4px gap and 3px bottom padding.
- **Agents window tray** (≈34,237,900, React):
  - Header "N Queued" in the muted tone, with "Start Multitasking" ("Run tasks in parallel") and a **Close queue** × in place of a chevron.
  - Rows sit in a `role=listbox` "Queued messages" with `maxHeight:200`.
  - Row sizes come from the earlier capture: min height 28, padding 0 4 0 6, gap 8, radius 6, label 13/18.
- **Row actions on hover:**
  - "Send Now" or "Steer" as a text button with a shortcut. ⌘-click picks the opposite mode (`gMn` = meta key).
  - Icon buttons: Edit (pencil), Send now (arrow-up), Remove (trash), and More ("Move to Side Chat", "New Message Settings").
  - Double-click a row to edit it. Drag to reorder (`onQueueItemReorder`; the dragged row at .35, a 2px `stroke-focused` drop line).
- **Editing** reuses the composer: a banner "Editing queued message" and an "Editing" pill. The row being edited gets a 15% tint and a 1px inset stroke.
- **Keys:** ↑ from the prompt runs `focus-last-queue-item` or `edit-last-queue-item` and expands the queue if it is folded; ↓ moves into the list (`moveDownFromPrompt`).
- **Text fallback:** a row with no text shows "N Images" / "N Attachments" (`queueItemDisplayText.js`).
- **First-run banner** "Steer New Messages?" offers "Keep Queuing" and "Open Settings" (`SteerQueueNuxNotice`).
- The setting lives at Settings › Agents › Queue Messages [unverified: forum].

### Claude desktop / Claude Code desktop (`/Applications/Claude.app`, `ion-dist/assets/v1`, read-only)
- **Shape:** `ChatComposerQueuedMessages` (`c0d1f1ea0-DZPPmFeb.js`) and `QueuedRows` (`cdf347a37-C2Ufvwyn.js`). There is **no card or header**.
- **Row:** each queued message renders as the user's **message bubble in a `queued` state** (`Message state:"queued"`, text `text-secondary`), right-aligned in a `ul role=list` "Queued messages" above the composer.
  - Fallback item: `max-w-[85%]`, `text-body`, `whitespace-pre-wrap`, so the text is multi-line and not clamped. Attachment tiles show.
  - A 40px page fade (`before:h-10 page-fade-b-soft`) sits above the list.
- **Actions,** each a 32px slot (`k(n)=n*32+8`):
  - Send now (`ArrowReturn` icon; the shortcut is shown on the first row only), "Edit in composer", and "Remove from queue" (X).
  - They sit outside the bubble at its end when there is room, and inside at its start when there isn't.
- **Live region:** a polite `role=status` that reads "1 message queued. Will send after the current response." or "{count} messages queued…".
- **Errors:** "Couldn't reorder the queued messages. Try again." So the data model reorders, but no drag UI was found.
- **No folding** was found.
- Community reports say queued messages flush at the next model pause rather than at the end of the turn [unverified].

### Codex (from the earlier capture, `composer-additions.md:119-123`)
- A rail above the composer: `max-h-[30dvh]` with a scroll fade, rows 13px, one-line clamp, a 24px leading icon or image.
- Actions: Steer, Delete, a menu (Edit message / Open in side chat / Turn off queueing), and a drag grip on hover.
- States: sending (.6 + spinner), paused/failed with Retry, "Queue paused because you interrupted" + Resume, and "Clear queue".
- In the TUI, Tab queues and Enter steers; alt+↑ edits.

### Zed agent panel (`zed-industries/zed`, `crates/agent_ui/src/conversation_view/thread_view.rs`, main)
- **Placement:** inside the **same activity block above the editor as Plan and Edited files**, separated by a horizontal divider (≈3985-3992). Open by default (`queue_expanded: true`).
- **Header** (`render_message_queue_summary`, ≈4685):
  - padding 4 (`p_1`), gap 4; a Disclosure; "1 Queued Message" / "N Queued Messages" at `LabelSize::Small` in the muted colour.
  - A "**Clear All**" button with a 12px keybinding hint.
  - A bottom border when open.
- **List** (`render_message_queue_entries`, ≈5525): `max_h_40` (160px) with a scroll.
- **Rows:**
  - padding 6 (`p_1p5`), gap 4, on `editor_background`.
  - Rows are separated by 1px `border_variant` rules, not plates.
  - A leading Circle icon, small: **accent on the first row ("Next in Queue")** and muted on the others ("In Queue").
  - The text is an **inline editor**: type to edit in place.
- **Actions:** Remove (trash), Edit (pencil, "moves to main editor"), a **Steer toggle** (tinted accent when on; "Interrupt the agent at its next step…"), and Send Now.
  - The first row's actions are always visible, with an outlined Send Now and key hints. Other rows show them on hover.
  - Pressing Enter on an empty editor sends the first queued message.

### VS Code + GitHub Copilot Chat (`microsoft/vscode`, main)
- **Placement:** pending messages render **in the transcript**, after a divider labelled "Queued" ("Queued messages will be sent after the current request completes") or "Steering" (`chatListRenderer.ts` ≈2029-2043).
  - The divider has padding 8 16, a gap of 8, and an xs semibold label in `descriptionForeground` (`chat.css` ≈5009-5023).
  - Pending items show at **opacity .7**.
- **Reordering:**
  - A 16px gripper drag handle appears on hover (transition .15s) when more than one message of a kind is pending.
  - The dragged item shows at .4, with a 2px `focusBorder` insertion line.
- **Actions** (`chatQueueActions.ts`): Add to Queue, Steer with Message, Ask in Side Chat, Remove from Queue (closeSmall), Edit, Send Immediately, Remove All Queued (clearAll).
- **Sending:** while a request runs, Send becomes a dropdown (Add to Queue / Steer / Stop and Send). Alt+Enter takes the opposite action. The setting is `chat.requestQueuing.defaultAction`, which defaults to steer.

### Replit Agent (official docs)
- A drawer above the chat input that closes when the queue empties.
- Actions: Steer now, Edit, Delete, drag to Reorder. ⌘Enter sends with the opposite behaviour. Attachments are allowed.
- Row sizes are not documented.

### Windsurf Cascade
- Docs say messages queue while Cascade works and run in order. A "Queued Messages" release post exists [unverified: third-party summary].
- No row anatomy found.

### ChatGPT (consumer chat), v0, Lovable
- No native queue was found. ChatGPT has only a third-party userscript.
- v0 and Lovable: nothing found [unverified: absence].

### Design systems
**Vercel AI Elements `Queue`** (`vercel/ai-elements/packages/elements/src/queue.tsx`) is a general queue or todo list, not specifically for messages.
- **Container:** `rounded-xl border px-3 pt-2 pb-2 shadow-xs`, gap 8.
- **Sections** are collapsible, open by default:
  - The trigger is `px-3 py-2 text-sm font-medium text-muted-foreground bg-muted/40`.
  - The chevron is 16px and rotates −90° when closed.
- **List:** `max-h-40` (160) in a ScrollArea.
- **Item:** `px-3 py-1 text-sm rounded-md hover:bg-muted`, with a line-clamp-1 title and a description.
- **Indicator:** a 10px ring.
- **Completed state:** a strikethrough at 50%.
- **Actions** show only on hover (`opacity-0 group-hover:opacity-100`, p-1).
- **Attachments:** 32px images and file chips (`text-xs px-2 py-1`).

## 3. Placement and counts at a glance

| Product | Placement | Folds? | Max visible | Edit | Remove | Send now | Steer | Reorder | Clear all |
|---|---|---|---|---|---|---|---|---|---|
| Area | card above composer | yes (chevron) | unbounded | – | ✓ | ✓ | – (Phase 3) | – | – |
| Cursor IDE | header + list above input | yes, 24 header, open default | 200px scroll | ✓ (composer) | ✓ | ✓ | ✓ | ✓ drag | – |
| Cursor Agents | tray above input | close × | 200px scroll | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| Claude desktop | queued user bubbles above composer | no | (none found) | ✓ (composer) | ✓ | ✓ | – | model only | – |
| Codex | rail above composer | – | 30dvh + fade | ✓ (menu) | ✓ | (Steer) | ✓ | grip | ✓ |
| Zed | shared block with Plan + Edits | yes, open default | 160px scroll | ✓ inline | ✓ | ✓ | ✓ toggle per row | – | ✓ |
| VS Code Copilot | transcript, under a "Queued" divider | no | – | ✓ | ✓ | ✓ | ✓ (own divider) | ✓ drag | ✓ |
| Replit | drawer above input | auto-closes when empty | – | ✓ | ✓ | (Steer now) | ✓ | ✓ drag | – |
| AI Elements | card, sections | yes, open default | 160px scroll | slot | slot | slot | – | – | – |

## 4. Gaps and differences to consider (no changes made)

1. **Edit is missing.** Every product with a queue has it.
   - Two patterns exist: hand the text back to the composer (Cursor, Claude, Codex, VS Code), or edit inline (Zed).
   - Cursor's pattern implies an `editing` row state (15% tint + 1px inset stroke) and a composer banner. This would need an `onEdit(id)` and an `editing` status.
2. **No height cap.** Cursor 200px, Zed and AI Elements 160px, Codex 30dvh with a scroll fade. Area's list grows without limit and can push the transcript up in the 256-500 Inspector. A max height with Area's scroll fade is the common answer.
3. **No "next" emphasis.**
   - Zed marks the first row with an accent dot, keeps its actions visible and shows key hints.
   - Claude shows the Send now shortcut only on the first row.
   - Area treats every row alike.
4. **No Clear all.** Zed, Codex and VS Code have it, usually in the header's trailing slot, where Area has only the chevron.
5. **No live announcement.**
   - Claude announces "N messages queued. Will send after the current response." through a polite `role=status`.
   - Claude Code (VS Code extension) announces "Message queued."
   - Area's Queue has no live region.
6. **Keyboard.** Cursor (↑ from the prompt focuses or edits the last queued row; ↓ enters the list), Claude Code (↑ edits) and Codex (alt+↑) all reach the queue from the composer. Zed sends the first queued message on Enter in an empty editor. Area has no composer-to-queue keys, and its rows are plain `li` rather than a navigable list.
7. **Steer and reorder.** These are already deferred to the engine, but they are now near-universal: Cursor, Codex, Zed, VS Code and Replit all steer. The UI shapes differ:
   - Zed: a per-row toggle.
   - Cursor: the label swaps by setting, and ⌘-click does the opposite.
   - VS Code: separate Queued and Steering groups.
   - Reorder: dragged row .35-.4, a 2px focus-colour drop line, a grip on hover.

   These can be specced now as tile states without the engine.
8. **Attachments.** Area's rows are text only.
   - Codex shows a 24px thumbnail, and Claude shows tiles.
   - Cursor falls back to "N Images" when a row has no text.

   Area's `QueueItem` has no attachments field.
9. **Placement alternatives.**
   - Claude shows queued messages as muted user bubbles (multi-line, no card).
   - VS Code puts them in the transcript at .7 opacity.
   - Zed merges Queue, Plan and Edits into one block with dividers, where Area stacks separate cards.

   Area's card-above-composer matches Cursor, Codex, Replit and AI Elements, so it is the majority choice. Merging the stack with Plan, as Zed does, is the one structural idea worth a look.
10. **Header.** Area's "N queued" in muted ink with a fold matches Cursor IDE ("N Queued", 24 header, open by default) and Zed ("N Queued Messages", Small, muted).
    - Cursor IDE's chevron points right and turns 90° over 0.1s. Area's turns on `fast` along the reading direction, so it is consistent.
    - Cursor's Agents window uses a Close × instead of a fold.
11. **Where Area is ahead.** Only Codex has sending, failed and Retry states. Area has them, plus RTL chevron mirroring.
    - Paused is an app title in Area. Codex makes it a real state with Resume. Consider a `paused` prop if the engine needs Resume.
12. **Row metrics agree.** The references give:
    - Cursor: rows 28 tall, 13/18 text.
    - Codex: 13px text, about 28 tall.
    - Zed: 6px padding and divider rules.
    - AI Elements: `px-3 py-1`, text-sm.

    Area's `ui-row` and text-sm sit inside that range. Zed's dividers-not-plates and Cursor's radius-6 plates are both precedents, and Area follows Cursor here.
