# A chat in the Inspector: research and plan (2026-10-18)

Owner: "look into cursors ui and build a chat interface in the inspector panel. for now, research, and plan for what
needs to be built for a chat interface, look at codex, cursor, even claude and claude code." Research only; nothing is
built. Sources, each read from the installed product, with every value cited to a file and selector:

- [cursor.md](cursor.md): Cursor 3.24.12's agent panel (IDE and Agents window bundles)
- [claude-code.md](claude-code.md): the Claude Code extension 2.1.296 webview and Claude desktop's design tokens
- [codex.md](codex.md): the Codex desktop app (`/Applications/ChatGPT.app` is now Codex), its TUI source and docs
- [area.md](area.md): what Area already has, and the gaps

## What the four products agree on

| Part | Cursor | Claude Code | Codex | So Area |
|---|---|---|---|---|
| Panel type | 13 UI, chat 14/22 | 13, 1.5 | chat 13, code 12 | the app's 13; code 12 |
| User message | bordered card, radius 12, hugs right, inset ≥32 | composer-like box, full width, left | soft bubble 70%, radius 22, right | a quiet bubble, right, inset 32 at narrow widths |
| Assistant | unboxed markdown | unboxed markdown on a dot rail | unboxed markdown | unboxed markdown |
| A step | one line: verb + detail, no fill | bold tool + mono argument on a rail | one line: bold verb + muted detail | one line: verb + detail |
| Live vs done | "Reading" (shimmer) → "Read" | blinking dot → green / red | "Running" → "Ran" | wording plus a shimmer; no spinner per row |
| Grouping | reads and searches → "Explored …" | quiet tools → one counted header | reads and searches → "Explored" | fold reads and searches |
| Finished turn | "Worked" group | (rail) | "Worked for 2m 5s" | fold to "Worked for …" |
| Reasoning | "Thinking" → "Thought for Ns", closed | "Thinking…" → "Thought for Ns · tokens", closed | headline in the status line | "Thinking" → "Thought for Ns", closed |
| Edits | header `file +N −N`, inline diff on demand; Keep / Undo | Monaco diff, `+/−` stats | "Edited 2 files (+6 −1)", Undo / Review; a git panel | an edit summary with +/−; diff on demand; Keep / Undo |
| Approval | Skip / Run row under the command | replaces the composer: numbered choices, free text, Esc | numbered choices with scope; "tell Codex what to do differently" | replaces the composer, numbered, scoped, free text |
| Plan / todos | tray above the composer | todo list in the transcript | "Updated Plan · 1/4" | tray above the composer |
| Composer | soft fill, radius 18, 36–200 tall, 24 pills, round send that inverts | border radius 8, mode tints ring and send | min 44, controls under the input | Area's Composer, stacked, plus a context row |
| While running | send → stop; queue with Send now / Steer | "Queue another message…" | Enter steers, Tab queues | send → stop; queue and steer |
| Context meter | ring | pie, only under 50% left | ring and % full | Spinner ring, only when it matters |
| Scroll | sticks within 4px, no button | scroll on send, sticky prompts, no button | — | stick to the end; Scroll to latest when scrolled up; sticky prompts |

Narrow widths matter here: the Inspector is 256 to 500. Claude Code hides tool input and output entirely under 500;
Cursor uses container queries (mode label off under 250, bubble inset 32 under 480, tray banners stack). So Area's
steps must read as one line and open on demand, never as cards by default.

## Recommendation

**Where.** A fourth Inspector view, **Chat**, after Theme · Design · Code. Chat needs the whole column: its own
transcript scroller and a composer pinned at the foot, which the other views do not. ⌘L opens it and focuses the
composer (Cursor's chat key); Esc stops a run.

**What it is for.** An agent that works on this repository with the Canvas as its context: the chosen component,
tile or setting arrives as a removable chip in the composer ("Button · default", "Theme: Stroke 4, Shadow 3"), so
"make the outline variant's hover a step darker" means something without explaining where.

**What powers it.** The [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/typescript) (Claude Code as a
library) in Electron's main process, streaming to the renderer over IPC:
- `query({ prompt, options })` with `cwd` = the worktree, `includePartialMessages: true` for streamed text,
  `permissionMode` ("default" asks before edits and commands; "plan"; "acceptEdits"), `resume` for history,
  `interrupt()` for Stop.
- Its built-in tools (Read, Edit, Bash, Grep, Glob, WebFetch …) are what the steps render; `canUseTool(toolName,
  input, { toolUseID, suggestions })` resolving `{ behavior: "allow" | "deny" }` is what the approval prompt answers.
- Messages the UI renders: assistant text and thinking, tool use and tool results (with `parent_tool_use_id` for
  subagents), result (cost, duration), compaction boundaries, errors and `aborted` turns.
- Model: Claude Opus 5.5 (`claude-opus-5-5`) by default in the Model picker. Thinking text is a summary, not the raw
  reasoning; "Thought for Ns" is what to show.
- The alternatives: spawning the `claude` CLI with stream-json (the same harness, but a process protocol to own), or
  the Messages API with our own tools (we would rebuild file, edit and shell tools and their safety). The SDK is the
  least code for the most capability.
- Credentials are the owner's (their Claude login or an API key in the environment); nothing goes in the repo.

## What to build

Reuse first (all Complete): Composer (stacked), Message and MessageActions, ModelPicker, PromptSuggestions (chips),
ScrollToLatest, CodeBlock `sm` (+ `marks`), CopyButton, Chip `input` (context), Spinner ring (context), Accordion,
Alert, EmptyState `sm`, Menu, Popover, Tooltip, Kbd, Button, SplitButton.

New, each through the component process (`docs/COMPONENT_ADAPTATION.md`: captures, a spec, gallery tiles, review):

| # | Component | Job | Measured from |
|---|---|---|---|
| 1 | **Step** (agent step row) | one line: icon, verb (live → past), detail, duration; opens to its input and output | Cursor `ToolCallLine`, Codex activity labels, Claude Code tool header |
| 2 | **Step group** | "Explored 6 files", "Worked for 2m 5s": folds steps | Cursor `AgentTranscriptActivityGroup`, Codex "Explored", Claude Code quiet tools |
| 3 | **Reasoning** (ThinkingDisclosure, in the backlog) | "Thinking" shimmer → "Thought for 12s", closed | all three |
| 4 | **Edit summary + diff** | `file +N −N`, Keep / Undo per file and for all; unified diff on demand (CodeBlock `marks` grows line-number pairs and hunk separators) | Cursor `EditToolCallView` / `DefaultDiff`, Codex patches |
| 5 | **Approval** | replaces the composer: what and why, numbered choices with scope (once / this session / always), "tell it what to do instead", Esc | Claude Code permission prompt, Codex approval modal |
| 6 | **Plan / todo tray** | the run's plan above the composer: done, now, next | Cursor `todo-list` + `Tray`, Codex "Updated Plan" |
| 7 | **Markdown** for Message | headings, lists, inline code, code blocks, tables, links, drawn with Area's own parts | Cursor `Markdown.stylex` sizeSm, Claude Code markdown |
| 8 | **Composer additions** | a context row (chips, attachments: AttachmentCard in the backlog); @ and / menus anchored to the text; queue and steer while running | Cursor `PromptInput`, Claude Code mirror chips, Codex steer / queue |
| 9 | **Panel plumbing** | a view's own footer (no top rule), a scroller that sticks to the end, sticky user prompts | Cursor, Claude Code |
| 10 | **Turn states** | interrupted, error with Retry, compacted | Codex, Claude Code |

## Phases

1. **Shell and transcript, with a scripted engine.** The Chat view, the transcript scroller and pinned composer, Message
   with markdown, the empty state with suggestion chips, a context chip from the selection. A recorded run (a fixture
   of SDK messages) plays back, so every state can be designed and reviewed without spending tokens. A Testing screen
   shows it at 256, 360 and 500.
2. **Agent steps.** Step, Step group, Reasoning, Edit summary and diff, Approval, Plan tray, turn states: each a
   component with a spec, tiles and review rounds, played from the fixture.
3. **The engine.** The Agent SDK in Electron's main process; IPC events mapped onto the same view model the fixture
   feeds; Stop, approvals, modes (Ask / Agent / Plan → permission modes), Model picker, history (resume).
4. **Polish.** Queue and steer, the context ring and compaction, sticky prompts, notifications when a run finishes in
   the background, reduced motion, screen-reader announcements for each step and result.

## Values to start from (decided by the data; adjust on review)

- Type: the app's 13 for chat (Codex and Claude Code in a panel; Cursor's 14 is for its wider pane), code 12.
- Spacing: steps 4 apart in a group, 16 between groups and messages (Codex; Cursor 4 / 8 / 16).
- User message: right, a quiet fill, Message's existing corner; inset `max(32px, …)` as Cursor's, so at 256 it still
  reads as the person's.
- Composer: Area's stacked Composer; send turns to Stop; the mode's colour on the focus ring and send (Claude Code)
  only if modes ship.
- Steps: one line at the app's text (13 on a 20 line), verb in the default ink, detail muted; no card unless opened.

## Open for the owner

1. Chat as a fourth view (recommended), or always under the other views?
2. Power it with the Claude Agent SDK (recommended), the CLI, or the Messages API?
3. What may it do without asking: nothing (recommended: it asks before every edit and command), edits only, or
   everything?
4. Should the selection attach itself as context (recommended), or only when added with @?
5. Step style: plain lines (Cursor, Codex; recommended for 256 wide) or Claude Code's dot rail?
6. Start with Phase 1 against a recorded run (recommended), or wire the engine first?

## Phase 1, built (2026-10-18)

Owner: "Go with your recommendations on all six decisions and start Phase 1: the Chat view on a recorded run." So:
Chat is a fourth Inspector view; the Claude Agent SDK is the engine (Phase 3); it will ask before every edit and
command; the Canvas selection attaches as context; steps are plain lines; Phase 1 plays recorded runs.

- `apps/desktop/src/chat/recording.ts`: two recorded runs written as the Agent SDK's messages (`stream_event` text and
  thinking deltas, `assistant` thinking / text / `tool_use` blocks, `user` `tool_result`, `result`). They propose a
  change and say they have not made one; their file facts (paths, line counts, selectors) were checked against the repo.
- `session.ts`: a reducer from those messages to turns (user; assistant parts: text, thinking with its seconds, tool
  calls running / done / failed), a player (timed events, Stop) and a finished-run loader. Phase 3 feeds the same
  reducer from IPC.
- `markdown-parse.ts` + `markdown.tsx`: headings, paragraphs, lists (one nested level), quotes, fenced code (the
  Inspector's code well), pipe tables, strong, emphasis, code, links; parsed at every streamed length
  (`apps/desktop/tests/chat-markdown.test.ts`: every prefix of every recorded reply; a table row before its separator
  once hung it).
- `chat.tsx`: the transcript (Message turns; steps as one line, a live verb shimmering then past tense, 4 apart; turns
  16 apart; a head with the title and New chat, pinned), the composer (stacked Composer, Model picker with Claude Opus
  5.5 / Sonnet 5.5 / Haiku 5.5, the selection as a removable Chip, Stop and Esc, Scroll to latest), the empty state
  (Empty state `sm` + Prompt suggestions as chips), and the Testing screen (Testing → Chat in the Inspector: 256, 360,
  500).
- Area changes: Panel `viewportRef` and `bareFooter` (spec log). App: `studio.tsx` (Chat view, ChatProvider above the
  tabs, ⌘L), `studio.css` (chat and markdown styles), `pages/examples.tsx`.
- Changed from the plan: New chat sits in the conversation's head, not the Inspector's bar (four pills and a button need
  247 in a 242 bar at 256).
- Next, Phase 2: Step, Step group, Reasoning, Edit summary and diff, Approval, Plan tray and turn states as components,
  replacing the plain lines; markdown and the head become Area components after review.

## Phase 2, built (2026-10-19)

Owner: "Keep it uncommitted for now and start Phase 2: the Step, Step group, Reasoning, Edit summary and diff, Approval,
Plan tray and turn-state components." Built as Area components (specs `docs/specs/{step,edit-summary,approval,plan,
turn-notice}.md`, CSS in `packages/styles/src/components/`, React in `packages/react/src/components/`, tests
`packages/react/tests/agent-chat.test.mjs`, gallery tiles in `apps/desktop/src/content/demos/agent-chat.tsx`, all five
In review):

- **Step, Step group, Reasoning** (`step.css`, `Step.tsx`): one line, verb in the default ink and detail muted, a
  chevron on hover or open, the live verb shimmering; a group folds a run on a rule; Reasoning reads "Thinking", then
  "Thought for Ns".
- **Edit summary and Diff** (`edit-summary.css`, `EditSummary.tsx`): a card with the turn's +N −N, Undo all / Keep all,
  a row per file opening to its Diff (Code block sm type and marks, a 3px strip, folds). Kept / Undone settle a row.
- **Approval** (`approval.css`, `Approval.tsx`): the Composer's shell with numbered Menu-row choices, arrows and 1–9,
  Esc, and "what to do instead".
- **Plan** (`plan.css`, `Plan.tsx`): the tray above the composer while a run works, with a count.
- **Turn notice** (`turn-notice.css`, `TurnNotice.tsx`): stopped, error (an alert, with an action) and compacted.

The Chat view uses them: `recording.ts` adds TodoWrite plans, an approval before the edit (`permission_request`, an
app-level event the Phase 3 engine sends from the SDK's `canUseTool`) and a branch for a no; `session.ts` tracks the
plan, the pending approval (playback pauses on it) and each edit's Keep / Undo; `chat.tsx` groups 2+ reads and searches
into "Explored N items", draws Reasoning, the Edit summary after a finished turn, the Turn notice after Stop, and puts
the Approval in the composer's place under the Plan.

Checked in the browser preview (not Electron) on 2026-10-19: the run with both answers, Keep, the open diff, the
gallery tiles in light and dark (Plan, Edit summary). The fixes that check made are in each spec's feedback log.
Not done: live captures of Cursor / Codex / Claude Code for side-by-side (values come from their bundles' CSS); ChatGPT's
reasoning line not captured; the component review page not regenerated; Undo changes no file (a recorded run).
Next, Phase 3: the Agent SDK in Electron's main process over IPC, `canUseTool` → Approval, real Keep / Undo.

## Phase 3, built (2026-11-06)

Owner: "Do this task here: Connect the Inspector Chat to a live agent." The engine is the Claude Agent SDK
(`@anthropic-ai/claude-agent-sdk`, pinned 0.3.319) in Electron's main process, `apps/desktop/electron/agent.cjs`:

- **One conversation per chat id.** Each prompt is a `query` that resumes the chat's Claude Code session; New chat
  starts another. Working directory: the repository. The system prompt is Claude Code's with a short addition (read
  AGENTS.md; design changes go into the screen's source with Area's components, props and tokens). Settings: the
  repository's (`project`, `local`), not the person's global ones.
- **What the page gets** is what the recordings were written as: text and thinking deltas, finished blocks, tool results
  as text, the result (with `error`), and `permission_request` from `canUseTool` (its title and description are the
  SDK's own sentence). Subagents' inner steps stay inside their call. `session.ts`'s reducer reads them unchanged.
- **It asks before every edit and command** (permission mode `default`); "Yes, for this session" allows that tool for
  the rest of the chat; a no with words sends them to the agent as what to do instead. AskUserQuestion is off: the
  agent asks in its reply.
- **Keep and Undo are real.** A PreToolUse hook reads each file before an edit, PostToolUse after; Undo writes the
  before back while the file is as the edit left it (a turn's edits newest first) and says why when it isn't.
- **Live where the engine answers.** The Inspector's chat asks `status()` and goes live in the Electron app; in a
  browser, a capture and the Testing screen's frames it plays the recordings, as before. The empty state says which.
- **Model:** the composer's picker goes with each prompt; thinking is adaptive with summaries, so Reasoning has words.
- **Sign-in** is the person's own Claude Code login or ANTHROPIC_API_KEY. A failed sign-in ends the turn with an error
  notice saying how to sign in. Started from inside a Claude Code session, the app leaves that session's variables out.

Checked: `apps/desktop/tests/agent.test.ts` drives the engine with a stand-in SDK (a yes edits and Undo restores, a no
with words, for this session, Stop, the sign-in message, the env, the reducer). In Electron the whole path ran to the
SDK and back: on 2026-11-06 this Mac's Claude Code sign-in had expired (`claude auth status`: not logged in), so the
reply was the sign-in notice; a reply with tools has not been seen live yet.

Not yet: image attachments go as their names only; @ files come from a fixed list; line numbers in diffs.

## Chat additions, plan (2026-10-19)

Owner, after round 49 (with Astryx's chat set as the prompt: composer, layout, message, message metadata, system
message, tool calls): "shouldnt there also be chat components like composer improvements" → "Do the cleanup pass on
the five round 49 families first, then build the chat additions." Astryx's set mapped to Area:

| Astryx | Area today | Addition |
|---|---|---|
| Chat Composer | Composer (inline, stacked), Model picker | a **context row** inside the shell (chips, attachments); the **@ and / menu**; the **queue** while a run works |
| Chat Layout (a /command token in the prompt) | Chat view (app) | the context row and menu cover the token's job: what the prompt is about is a chip, not styled text |
| Chat Message | Message (bubble, prose, streaming) | — |
| Chat Message Metadata (time, read, model, Failed + retry, actions) | MessageActions (hover) | **message meta**: a time · model line and a failed state with Retry |
| Chat System Message (date divider, joined, thinking, resolved) | Turn notice (stopped, error, compacted), Reasoning | a labelled divider is a Separator question for the owner; not in an agent chat |
| Chat Tool Calls (grouped calls, durations, +N −N) | Step group, Step (meta), Edit summary | — (built in Phase 2) |

New components, each with a spec and tiles: **Attachment** (an image or file in the composer: thumbnail, name, remove,
uploading, failed; the backlog's AttachmentCard), **Composer menu** (the @ / slash suggestion list above the composer:
Menu rows with an icon, a label and a muted path, groups, keyboard from the field), **Queue** (queued messages above
the composer: the agent card with rows, Send now and Remove). Changes to existing components: Composer gains a
`context` slot; Message gains `meta` (and a failed state). Context chips are Chip `input` (built), not a new component.
Evidence: `composer-additions.md` (the installed bundles: Cursor, Claude Code, Codex), ChatGPT's captures for Message.
