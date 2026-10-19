# Claude Code (extension) and Claude desktop, read from installed files

- EXT: `~/.cursor/extensions/anthropic.claude-code-2.1.296-darwin-arm64/webview/index.css` (classes carry a module
  hash, `.message_07S1Yg`: grep the base name plus `_`); EXTJS: `index.js` beside it; PKG: `package.json` one up.
- DESK: `/Applications/Claude.app/Contents/Resources/app.asar`, `.vite/renderer/main_window/assets/MainWindowPage-*.css`.
  The desktop chat itself loads from claude.ai, but the shell CSS ships the CDS (Claude Design System) chat tokens:
  `[data-cds=UserMessage|AssistantMessage|ChatComposerDock|ChatComposerChin|TurnStatus|MessageActions|ModelSelector|FileDiff|AskUserQuestion]`.
- Colours map to VS Code theme variables through `--app-*`; brand `--app-claude-orange:#d97757`,
  `--app-claude-clay-button-orange:#c6613f`. Read 2026-10-18, read-only.

## Panel (EXT)

- Base `body{font-size:var(--vscode-chat-font-size,13px)}`, line-height 1.5; spacing 4/8/12/16, radius 4/6/8.
- Header: padding 6, gap 4, bottom rule; editable title (radius 6, max 300, padding 6, weight 500); icon buttons
  padding 4 radius 4, 16/20 icons.
- Sessions list: rows 28 (padding 0 8, radius 6, gap 8), group headers 26; time and actions share one cell (actions
  replace the time on hover); 8px status dots busy green, pending blue, unread orange.
- Messages: `.messagesContainer{padding:20px 20px 40px}`; composer floats (`position:absolute; bottom:16px;
  left/right:16px; max-width:680px`) over a 150px fade to the background.

## Messages

- User (EXT): looks like the composer: 1px input border, radius 6, input fill, padding 4×6, full width,
  left-aligned. Sticky: the prompt pins to the top while its turn scrolls; click jumps back.
- User (DESK CDS): neutral bubble, radius r+4, padding lg×md, width `clamp(85%, 448px, 100%)`; consecutive bubbles 4
  apart with 4px meeting corners.
- Assistant: no bubble (DESK inset 4, right stop `clamp(0px,(100% - 384px)*.175,56px)`).
- Timeline (EXT): tool and assistant rows indent 30; a 7px dot at left 9 on a 1px rail at left 12; dots success
  #74c991, failure #c74e39, warning #e1c08d, progress blinking; rows padding 8/8.
- Markdown: p margins .1/.2em; lists 2em; inline code 2×4, radius 3, .9em; code blocks margin 8, padding 8, radius 4,
  copy at top 4 / right 4 on hover. After a reply a 16-tall action row with a 20×20 copy.
- Thinking: a `<details>`, closed by default; "Thinking..." then "Thought for Ns" plus a live token count; 16px
  chevron rotating 90° over .15s.
- Streaming: a status row (1.85em, fade in .3s) cycling verbs ("Pondering", "Wrangling"; user-extensible via
  `claudeCode.spinnerVerbs`), orange spinner.
- DESK type at 13px base: body 13, prose 14, code 12, caption 11; message actions on hover (in after .1s, out 60ms;
  kept on focus-within).

## Tool use (EXT)

- Header: tool name bold + argument mono .85em (paths link); summary clamps to 2 lines. Names: Read, Grep, Glob,
  Search, Web Fetch, Web Search, Update Todos, Agent:, Claude's Plan.
- Quiet tools (Read, Grep, Glob, Search, TodoWrite) group under one collapsible header with a bold count.
- Body: an IN / OUT grid card (.5px border, radius 5, tool fill; label column mono .85em at 50%); output clipped to
  60 with a mask, click to expand. **The body is hidden below 500px wide** (`@media (max-width:500px)`).
- Bash: the command is editable before approval; a safety tag (green, or red "destructive", 11px, radius 3).
- Diffs: embedded Monaco diff editor (radius 4) with mono +/− stats; changed-file rows.
- Permission prompt (takes the composer's place): card padding 8, radius 8, max 70vh; bold title 1.1em, description
  .9em, raw input in a `<details>`; vertical buttons (padding 6×8, radius 4, inset 1px ring) each with a number
  shortcut, arrow keys move focus, the focused one fills; last option a free-text "tell Claude what to do instead";
  labels "Yes", "Yes, allow all edits this session", "Yes, and don't ask again", "No"; "Esc to cancel"; it can fold.
- Plan mode: "Claude's Plan <file>", options "Yes, and auto-accept" / "Yes, and manually approve edits" / "No, keep
  planning"; comments on selected plan text.
- Todos gap 4, item gap 8; interrupted turns italic secondary; meta rows padding 8 at .8.

## Composer (EXT)

- Shell: 1px border, radius 8, shadow `0 1px 2px #0000001a`; focus ring 3px at 12% of a colour **set by the
  permission mode** (orange default, foreground for accept-edits, blue for plan, red for bypass); the send button takes
  the same colour.
- Field: contenteditable, padding 10 36 10 14, 1.5 line, max 200; a mirror layer draws @-mentions as inline chips.
  Placeholders "Ask Claude to edit…", "⌘ Esc to focus or unfocus Claude", "Queue another message…" while busy, and an
  italic suggestion.
- Footer: padding 5, gap 6, top rule .5px; 26×26 icon buttons radius 5; mode button icon + label (Manual, Edit
  automatically, Plan, Auto, Bypass permissions, Don't ask; icons drop under 300 wide); send 26×26 radius 5 #c6613f,
  a 16px stop while busy; model pill full radius, 18 tall, .85em, shows the effort after the name.
- Attachments row padding 6 4 4 8, thumbnails radius 8; drop overlay dashed orange. Slash and @ menus open above the
  composer (radius 8, max 50vh, fade .15s; items padding 4×8, radius 4).
- Keys: ⌘Esc focus/blur, ⌥K mention the selection, ⌘N new conversation, Shift+Tab cycles modes, Ctrl+Enter option.

## Status

- Empty state centred, gap 24, a rotating tip 11/1.6 with drawn key caps; hidden under 500 tall.
- No scroll-to-bottom button; scroll-to-bottom on send (default on).
- Context: a 26px pie in the footer appears only under 50% remaining ("N% of context remaining until auto-compact.
  Click to compact now."); compaction leaves a closed row "Conversation was compacted to free up context."
- Usage panel: 12px uppercase titles at .7, rows 4, tabular numbers, bars gap 12.
