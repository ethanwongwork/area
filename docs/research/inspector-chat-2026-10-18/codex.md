# OpenAI Codex, read from the app bundle, the open-source TUI and the docs

- `/Applications/ChatGPT.app` (v26.1013.31256) is the Codex desktop app: its `app.asar` `package.json` reads
  `"name": "openai-codex-electron", "productName": "Codex"`. The same webview serves the IDE extension, re-tokenised
  with the host's font: `:root[data-codex-window-type=extension]{--font-ui-family:var(--vscode-font-family);--font-ui-size:var(--vscode-font-size)}`.
  Read read-only with a small asar reader; chunks named below are under `webview/assets/`.
- TUI: github.com/openai/codex `codex-rs/tui` (commit 89461ea, 2026-10-19); its `.snap` snapshots show rendered text.
- Docs moved to learn.chatgpt.com/docs. Older web-only details (Ask/Code buttons, best-of-N) are no longer documented
  and were not verified. Read 2026-10-18.

## App anatomy

- Sidebar: projects, then chats; states "Awaiting approval", "Needs input", "Waiting for review", "Unread"; an Activity
  bell (⌘⌥U) for running and waiting chats (learn.chatgpt.com/docs/notifications).
- Thread: content max `--thread-content-max-width:48rem`; toolbar 46; composer floats at the bottom (inset 16 or 24);
  gutter `clamp(12px, 3cqi, 24px)`.
- Side panel "Changes": Uncommitted, Last turn, Branch comparison, Commits, Pull requests; Stage / Unstage / Revert all,
  Revert file, per-hunk revert, Mark as viewed, Open in editor; diff Auto = split for additions and removals, inline
  for narrow panes (`thread-side-panel-tab-content-*.js`, `editor-diff-page-*.js`).
- "Work in" under the composer: Local, Worktree, Cloud (learn.chatgpt.com/docs/environments/modes); handoff "Continue
  in"; "Fork from this message in a new worktree".

## Messages

- User (app): right-aligned bubble, `--user-chat-width:70%`, radius 22 (compact variant max 456, radius 16), fill
  black/white alpha 5% light / 8% dark; copy, edit and fork on hover (`user-message-*.{css,js}`).
- User (TUI): `› ` on a shaded full-width band (`tui/src/style.rs`).
- Assistant: unboxed markdown; TUI marks it `• ` and reserves magenta for Codex (`tui/styles.md`).
- Chat 13px, code 12px (`--codex-chat-font-size: var(--font-ui-size,13px)`, `--font-code-size`).
- Reasoning: a live "Thinking…" shimmer label; in the TUI the summary's bold first line becomes the status header
  ("• Preparing evidence report (42s • esc to interrupt)"), the full summary only in the transcript view (Ctrl+T).
  Settings: brief, detailed, or no summaries.
- A finished turn folds behind "Worked for {time}" (`collapsed-turn-disclosure-*.js`; TUI "Worked for 2m 5s").

## Agent activity

- Rows, not cards: bold verb + muted detail, live verb flipping to past tense ("Running" → "Ran", "Reading {target}",
  "Searching for {query}", "Listing files in {folder} folder"; `active-tool-activity-label-*.js`); grouped items 4
  apart, separate items 16 apart (`--conversation-grouped-item-gap`, `--conversation-item-gap`).
- TUI exec cells: `•` header with a `└` gutter, output head and tail with "+7 lines (⌃t to view transcript)"; reads and
  searches merge into one "• Explored" cell.
- Patches: "• Edited 2 files (+6 -1)", per file `└ path (+1 -1)` with numbered +/- lines; "✘ Failed to apply patch".
  IDE: "retry.ts +2−2" with Undo and Review.
- Approvals: TUI modal "Would you like to run the following command?" → "1. Yes, proceed (y) / 2. Yes, and don't ask
  again for commands that start with … (p) / 3. No, and tell Codex what to do differently (esc)". App: inline request
  cards ("Allow ChatGPT to run this command?", "Allow similar commands", "Allow all edits"), "Step 1 / 3 · Needs
  attention"; Auto-review chips ("Auto-reviewing", "approved", "denied" with the reason).
- Plan: "• Updated Plan · 1/4 complete" with ✔ / □ rows; app "Plan mode", "Implement this plan?", "Up next".
- Errors: "■ Conversation interrupted", "■ rate limit exceeded: Please try again in 10s."; app "You stopped after
  {time}", "Stop and retry", a diagnostic with a recommended next step.

## Composer

- Placeholder "Ask Codex to do anything" (TUI) / "Ask for follow-up changes" (app, IDE).
- App: min height 44, line 20, padding 0 12, token buttons 32 or 36, radius `--radius-4xl`, elevated surface with
  `--elevation-composer`; attachment radius = composer radius − 8.
- Under the input, separate controls: permissions ("Ask for approval", "Approve for me", "Full access" with a confirm,
  "Custom"), model + thinking effort (Minimal … Max, Ultra, Persistent) and speed (Standard, Fast), Work in, a context
  ring, Attach files or folders.
- `@` files / plugins / skills, `$` skills / apps, `/` commands.
- Running: Enter steers now, Tab queues; queued items show under the status row (`↳ first`, "alt + ↑ edit"); app
  "Steer" vs "Queue", "Clear queue".

## Status

- TUI footer "gpt-5.4 xhigh fast · Context 100% left · /tmp/project"; live row "• Working (0s • esc to interrupt)".
- `/status`: context "100% left (2.2K used / 272K)", 5-hour and weekly limit bars "55% left (resets 09:25)".
- App: "{usage}% full", "Compact this chat's context", "You're approaching your usage limit", "Working for {time}";
  completion notifications never / background / always.

## Measurements (app CSS, `[data-codex-window-type=electron]`)

Spacing unit 4; chat 13 / code 12; item gap 16, grouped 4; toolbar 46; composer min 44; user bubble radius 22, width
70%; diff rows padding-y 4; diff header padding-x 12–16; thread max 48rem; narrow variants 480 / 500.
