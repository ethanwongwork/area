# Cursor's agent chat, read from the app bundle

Cursor 3.24.12 (`/Applications/Cursor.app/Contents/Resources/app/product.json`). Paths are relative to
`/Applications/Cursor.app/Contents/Resources/app/out/vs/workbench/`: JS = `workbench.desktop.main.js`, CSS =
`workbench.desktop.main.css`, glass = `workbench.glass.main.{css,js}` (the Agents window: the same components, same
5054 StyleX atoms, plus `body[data-cursor-glass-mode=true]` overrides). The transcript and composer are React with
StyleX: each component is a module greppable as `"Name.js"(){` whose hashed atoms (`ui-xxxx`) resolve to CSS inlined in
JS. Read 2026-10-18, read-only.

## Tokens

`:root, .ui-qruemj{--cursor-font-size-base:13px…` (JS):

- Type xs/sm/base/lg 11/12/13/14, line-height 14/16/18/22; controls 20/24/28/32; radius xs 2, sm 4, base 6, lg 8,
  xl 12, 2xl 14, 3xl 16, 4xl 18, full; spacing 4px steps (`--cursor-spacing-1-5:6px`, `-2-5:10px`).
- Colour is one base at alphas (dark `--cursor-base:#F0F0F0`): text 100/74/60/36%, stroke 20/12/8%, background
  20/14/8/6%; input surface = 6%.
- Motion 100/150/200ms, `cubic-bezier(.215,.61,.355,1)`, press scale 0.98.
- Conversation scale (CSS `.composer-bar,.composer-messages-container{--conversation-text-font-size…`): text 14/22,
  tray 13, block gap 16, list before 8 / after 18 / item 8, heading after 4, embedded block before 12, tool card
  padding 10×8 gap 6, surface radius 12. Markdown `sizeSm` (`Markdown.stylex.js`) is 13/18, tracking −0.08px.

## Panel

- Chats are tabs in the auxiliary bar: `.auxiliary-bar-show-agent-tabs>.title{…height:34px}`, tab max-width 200
  (`.tab:has(.composer-tab-label)`); actions New Chat, Show Chat History, More (Pin, Fork Chat, Open in New Tab).
- Transcript: virtualised (`.virtualized-composer-messages-layout`), content max 840 (`--composer-max-width`).
- Empty: the input is the hero (`.composer-bar.editor.empty .full-input-box{box-shadow:…}`). Placeholders "Plan,
  search, build anything" (Agent), "Ask, learn, brainstorm" (Ask), "Add a follow-up", "Plan, Build, / for skills, @
  for context".

## Messages

- User (`AgentTranscriptHumanBubble.js`): radius 12, padding 8/12, 14/22, min-width 150, gap 6; fill bg-elevated,
  1px stroke-tertiary (hover/focus stroke-secondary), shadow `0 1px 2px rgb(0 0 0/.05)`; "filled" variant bg-quaternary
  with no border. Chat layout hugs right with inset `max(32px, clamp(0px,(100% - 480px)*0.4, 20%))`
  (`--conversation-opposed-inset-human`). Joined bubbles take a 6 corner on the joined side. Long messages collapse at
  72 with a mask (`UserMessageBox.js`). User rows stick to the top while their turn scrolls. Click to edit; older turns
  dim to .5.
- Assistant: no bubble, markdown with inset 11 (classic) or 0 (glass) (`AgentTranscriptRow.js`).
- Markdown: headings weight 590, 1.466/1.333/1.133/1em; lists 2em; inline code .9em mono, padding 1.5/2, radius 5,
  bg-tertiary; blockquote 3px rule; tables in a 12-radius card.
- Code block (`CodeBlock.js`): radius 12, 1px stroke-secondary, editor fill; header padding 6/8, gap 6, divider;
  copy at top 4 / right 4, hover only, green when copied.
- Thinking: "Thinking" (shimmer) → "Thought for Ns" / "briefly" (`function bUl(`), collapsed by default.
- Streaming: shimmer gradient 60→100→60% (`TextShimmerContent.js`, off under reduced motion); tail status 13/22
  secondary ("Planning next moves", "Generating…") with Cancel (`AgentTranscriptTailStatus.js`).
- Turn actions and timestamps on hover only (`AgentTranscriptTurnActions.js`): Copy, Fork, More, feedback.

## Agent steps

- One line per step (`ToolCallLine.js`): gap 4, nowrap ellipsis, 22 line; verb secondary (hover primary), detail
  tertiary. Verb pairs (`function JEs(`): Reading/Read, Grepping/Grepped, Searching files/Searched files, Running/Ran,
  Editing/Edited, Listing/Listed, Searching web, Updating todos.
- Collapsible: bare text button; chevron margin 3, hidden until hover/open, rotates 90°; body animates height 150ms;
  content gap 4. Consecutive reads and searches fold into a group ("Explored …", "Worked"; step gap 4, group gap 8,
  `AgentTranscriptActivityGroup.js`).
- Cards (`TranscriptCardRoot/Header/Row/Footer.js`): radius 12, stroke-secondary, editor fill; header padding 8 gap 6;
  rows 4/6 radius 6; footer right-aligned.
- Shell (`ShellToolCallView.js`): radius 8, stroke-tertiary (primary while pending); mono 13/18; preview 5 lines with
  a top fade, newest at the bottom; expanded `min(480px,60vh)`; approval row: mode dropdown left, Skip / Run right.
- Edits (`EditToolCallView.js`): 30 header, filename + `+N` / `−N`; chevron opens an inline diff (radius 6). Diff
  (`DefaultDiff.stylex.js`): 3px indicator strip, inserted/removed line fills, collapsed regions at 12px.
- Review: Keep All / Undo All (Undo confirms), per-file Keep / Undo, Review Changes; checkpoints restore from a user
  bubble ("Revert files to this message?").
- Todos (`todo-list.js`): gap 10, 14/22, icon 14×22; in progress primary, pending quaternary, done struck; container
  radius 8, bg-quaternary, header 28.

## Composer (`PromptInput.js`)

- Fill input surface (6%), 1px stroke-tertiary → stroke-secondary on hover/focus, no shadow; radius 18 expanded, 6
  embedded, full when compact; section gap 6.
- Editor (TipTap): padding 8 12, 36 to 200 tall, 22 line; compact = one 24 line.
- Toolbar (`role="toolbar"`): padding 8, slots gap 4; the mode chip's label hides under 250px
  (`@container (max-width: 250px)`).
- Pills (`Pill.js`): full radius, sm 20 / 12px, md 24 / 13px, padding 8, gap 4; ghost pill with stroke-secondary.
- Modes Agent, Plan, Debug, Ask; model picker Auto, MAX Mode, Use Multiple Models.
- Send (`PromptInputSubmitButton.js`): circle 24 (20 sm); filled with the text colour when sendable (inverted);
  bg-quaternary when empty; while running a tinted stop (bg-tertiary) with a square.
- Context: inline mention chips in the text (14px icon slot, line range at 52%); images as a grid at the top.
- Queue: messages sent while running wait in a "Queued messages" tray (Send Now interrupts; Steer "Sends without
  interrupting the agent").
- Trays (`Tray.stylex.js`): above the input, bg-elevated, radius 12, soft shadow, blur 8; todos, queue, review,
  questions stack and peek.
- Keys: Enter sends, Shift+Enter breaks, Esc stops.

## States and narrow widths

Errors "Connection failed" with Retry / Resume (`.composer-error-title` 12/130% 500). Sticks to the bottom within 4px;
no scroll-to-bottom button found. Narrow widths use container queries: mode label off under 250, opposed bubble inset
32 under 480, tray banners stack under 480, approval labels truncate, tool lines ellipsize.
