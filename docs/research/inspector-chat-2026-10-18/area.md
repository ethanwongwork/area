# What Area already has for a chat (inventory, 2026-10-18)

Every family below is **Complete** (`apps/desktop/src/content/component-status.mjs`; nothing is in review). Fit is for
the Inspector's content column: 256 to 500 wide (`apps/desktop/src/studio.tsx` `WIDTHS.inspector`), less the flush
Panel's 14 a side, so about 227 to 471, at the app's type 13 and Compact density.

## The conversation families (measured from ChatGPT)

| Family | What it gives | Fit and limits |
|---|---|---|
| Composer | `layout` inline / stacked; value, `onSubmit`; `loading` + `onStop` (send turns to Stop, the field stays editable); `leadingActions`, `trailingActions`, `mode` slot; grows to 5 rows; Compact shell 40, inset 6, corner 12 | Stacked under ~320 (inline at 227 leaves ~50px of text). **No slot above the text** for context chips or attachments. |
| Message, MessageActions | `author` user / assistant, `streaming` (pulsing dot, `aria-busy`); user bubble ≤70%, assistant full width; Compact prose 14/20, bubble 6×12 | Children are free content: **no markdown renderer.** No error, system or tool author; no edited state. |
| PromptSuggestions | `items`, `onSelect`, `onDismiss`, `layout` list / chips (chips are "for a side panel") | Fits. |
| ModelPicker | items with descriptions; sizes; goes in Composer's `mode` slot | Fits; no effort control. |
| ScrollToLatest | `scrollRef` (required), threshold 200, follows streaming | Fits, but **Panel's body exposes no ref**, so the chat needs its own scroller (ScrollArea has `viewportRef`). |

## Pieces a chat would reuse

CodeBlock (`size="sm"` is already the Inspector's code well; `marks` draws added / removed lines; collapsible; copy),
Code, CopyButton, Citation, ReferenceList, Avatar, Indicator / Presence, **Spinner** (`value` + `role="meter"` draws a
ring: Cursor's context ring), Progress, Skeleton, Meter, Tooltip (every icon-only control), Menu, ContextMenu, Popover,
HoverCard, **Chip** (`kind="input"`, measured from ChatGPT's composer pill: the context chip), Tag, FileUploadItem,
AssetRow, **Accordion** (the base for reasoning and tool blocks; no timer or status slot), Timeline, Stepper
(vertical: a plan), Alert (errors, rate limits), EmptyState (`sm` "inside a panel"), Button, SplitButton (Accept ▾),
Kbd, Segmented (a mode switch), ScrollArea.

Not a fit: Combobox and CommandPalette (each owns its input, so neither can drive @ or / inside the Composer's text),
Board.

## Gaps

1. Panel plumbing: no body ref; no stick-to-bottom; the footer draws a top rule and full inset (no composer looks like
   that); the Inspector passes no per-view footer.
2. Composer: no context / attachment row; no @ and / menus bound to the text; no queue or steer while running.
3. Reasoning disclosure (backlog: ThinkingDisclosure, "collapsible reasoning with a live timer").
4. Agent step row and group (tool name, live verb, status, duration, collapsible input / output).
5. Diff review: one-sided `marks` only (no line-number pairs, hunk separators, file header with +N −M, keep / undo).
6. Approval prompt (allow once / always / deny / tell it what to do instead).
7. Attachment card (backlog: AttachmentCard).
8. Markdown rendering for assistant prose.
9. Plan / todo list.
10. Chat history and new-chat controls (the Inspector bar's action slot holds the view pills).
11. Error, interrupted and retry turn states.
12. No chat demo at 256 to 500: Compact fit is untested on screen.

Prior work: `docs/research/astra/patterns/chat-ai-assistant.md` (the assistant-thread recipe; ThinkingDisclosure and
AttachmentCard as recipes); Cursor captures in `docs/research/captures/compact/cursor-app--*` and
`docs/research/compact-evidence-2026-10-02/cursor-desktop.md` (Cursor chat prose 15/24, follow-up composer a 42 pill);
`docs/COMPONENTS.md` "Conversation (ChatGPT)".
