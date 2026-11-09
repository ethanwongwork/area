# Chat workflow: input, output and the loop (2026-11-08)

Owner (2026-11-08): "work out an entire workflow for updating the chat and how users interact with it … thinking about
input, adding context, drafting long prompts, etc, and also the output, showing more visual examples, asking more
questions, a/b examples, giving more succinct answers and simplifying the results … research cursor, chatgpt, and claude's
chat currently, and see where improvements can be made to make it more designer/non technical friendly."

Research and proposals only; nothing in `apps/` or `packages/` changed. Review page (private, picks stored in its db as
`verdicts/<id>` with `pick` build | change | later, `note`, `at`): https://claude.ai/artifact/GszAD4HPUQUjJoG9GwR3Km.
It is built from `proposals.ts` (the list below), `entry.tsx` and `page.css` with `node build.mjs <tree> <out.html>`
against a built tree (`npm run build`, then `npm run build -w @area/desktop`).

## Sources

- **ChatGPT** (chatgpt.com) and **Claude** (claude.ai), the owner's Chrome, light, 1504 × 766, read-only: menus opened,
  drafts typed and cleared, nothing sent, no setting changed. ChatGPT's composer was captured with
  `apps/docs/public/area-capture.js` (a minified copy pasted in; the page's CSP blocks loading it from localhost); the
  other values are `getComputedStyle` reads of single elements. Full notes: [web.md](web.md).
- **Cursor** 3.27.22, read from the app bundle (`workbench.glass.main.js`, modules cited by name). Full notes:
  [cursor.md](cursor.md). Earlier Cursor, Claude Code, Codex and Claude desktop readings are in
  `../inspector-chat-2026-10-18/` and `../chat-kit-2026-11-02/` and are cited, not repeated.
- **Area**: `apps/desktop/src/chat/` (chat.tsx, session.ts), `electron/agent.cjs`, `design-inspector.tsx`
  (`changesMessage`), `design-edit.ts`, `chat-kit.tsx`, `question-kit.tsx`, `choice-visuals.tsx`, the components'
  manifest descriptions, and the earlier research above.
- **Not measurable without sending a message**: ChatGPT's and Claude's clarifying questions, ChatGPT's "which response do
  you prefer", image generation picks, any live tool run. Claude's question widget was measured earlier
  (`../chat-kit-2026-11-02/questions.md`). Dark mode was not read (owner's setting left alone).

## Findings per product

### ChatGPT (measured)

| Part | Value |
|---|---|
| Composer, empty | 768 × 52, radius 26 (pill), padding 8, gap 8; buttons 36 circles, icons 20; Think pill 92 × 36; editor 16/26 |
| Composer, long | Stacks (text over the tools row), radius 28; grows to 182 (7 lines × 26), then scrolls; **Expand** (32) top right fills the column (768 × 583 in a 766 window, editor 511) |
| + menu | Opens under the composer at its width (768), radius 20, padding 8; rows 36, radius 12, padding 6 8, gap 12; label 14/20 then a **muted description on the same line** (Add photos & files, Upload from computer; Create image, Visualize anything; Deep research, Get a detailed report; Thinking, For detailed answers; Sketch, Draw and attach an image); some marks in color |
| Person's message | Right, max 70%, padding 10 16, radius 22, light blue fill (232, 243, 254), 16/24; on hover Copy, Share, **Edit message** (32 each) |
| Reply | Column 768, 16/26, paragraphs 16 apart, h2 18/28 600 with 24 above; tinted block padding 12 radius 12; tables 14/26, cells 8 24 8 0, no painted rules |
| Reply actions | Copy, Good, Bad, Read aloud, Share, More (32 each); More: the time as its head, **Regenerate response** (by model), View sources, **Branch in new chat** |
| Selection | Selecting reply text shows **Ask ChatGPT** (100 × 28), which quotes it into the composer |

### Claude (measured)

| Part | Value |
|---|---|
| Composer, new chat | 656 wide, radius 14, padding 8; shadow 0 4 20 rgba(0,0,0,.075) + a 1 px 12% ring; input 15/21 over a tools row; buttons 28, radius 8; under it, outside: Project, model with effort ("Sonnet 5.5 High"), Auto |
| Composer, long | Grows to **384**, then scrolls; no expand control |
| Reply composer | One line, 768 × 44, radius 14 |
| + menu | 232 wide, radius 14; rows 28, padding 4 10, radius 8; Upload or add files ⌘U, Skills ›, Connectors ›, **Design system ›** (Manage design systems, New design system), Add plugins, Devices ›, Research, Memory ✓ |
| Messages | Person: grey 5% fill, padding 12 16, radius 12, 15/21. Reply: 15/21 serif. Actions on hover: Copy, Read aloud, Good, Bad, Retry (24 each) |
| Work | Tool use folds to **one muted line** in the reply ("Searched the web, read a page": row 28, padding 3.5 6, radius 8, text 60% ink), opening to its steps |
| Questions | (earlier) rows 44 / 36 with a 28 / 24 key, single choice sends at once, previews beside the list from 480 (`../chat-kit-2026-11-02/questions.md`) |

### Cursor (bundle; details and module names in [cursor.md](cursor.md))

- **Questions** come as a tray over the composer, up to 320 tall, one question a step: lettered rows (A, B, C badges 20 ×
  20), a single choice moves on at once, **Other…** last (a full editor), Next / Continue and Skip, drafts kept; set aside
  it folds to a pill "Answer questions (N)"; answered, the transcript keeps a card per question with its answer or
  "Skipped".
- **A/B compare**: "Response A" and "Response B" as two cards side by side (each 85% wide, padding 16, radius 14), shimmer
  while "Generating responses", then "Responses ready"; "Response A is Better" turns into "✓ Selected" and the other dims
  to 0.6, with an optional why. Several models at once is a count per model.
- **Plans are documents**: a "Created Plan" card (name, overview, View Plan) opens an editable plan; Build is a split
  button; progress "N of M To-dos Completed".
- **Going back**: "Restore Checkpoint" on each of the person's messages (then "Redo checkpoint"); editing an earlier
  message asks "Revert files to this message?" (Cancel, Revert Files, Keep Files); Undo All asks twice.
- **Turn summary card** (behind a flag): "N Files Changed", Review, rows of file +N −N, 4 then "Show N more", an optional
  short written summary.
- **Context**: @ items as inline chips in the text (12 icon, label to 20em); the @ menu opens on 3 recent items, then
  Files & Folders and Past Chats; categories Files & Folders, Docs, Terminals, Past Chats, Canvas, Tasks, Branch,
  Browser. A 14 px ring shows how full the conversation is and opens a breakdown.
- **Long input**: images 64 × 64 in the composer, 32 × 32 sent, drawable before sending; a paste over 10,000 characters
  becomes "Clipboard (N lines)"; ↑ walks the last 10 prompts; a draft per chat; voice. No full-screen editor.
- **Design mode**: "Annotate: Point at anything and tell the agent what to fix" in its browser: click an element or drag
  an area, draw marks, double-click to edit text, then "Describe the change or ⌘+L to add to chat"; the picture and marks
  go to the chat. Mermaid diagrams render in replies.
- **Words**: modes each with one plain line (Ask "Answer questions without making edits", Plan "Generate an
  implementation plan", Debug "Pinpoint the root cause of an issue"), each its own color; approval levels as one sentence
  each; first run asks the person's role, Designer among them.

### What the references share, and where they stop

1. Context enters through a + menu of things with a plain line each, and @ for named items; pictures are first-class.
2. Long input grows to a cap (182 to 384), then scrolls or expands; long pastes fold to a chip.
3. Work folds to one muted line or a count; the detail is a click away.
4. Questions back sit over the composer as choices with free text last; answers stay in the conversation.
5. Going back is per message (restore, edit, regenerate, branch).
6. **None draws the design itself.** Changes are files with +N −N, approvals show code, A/B is two text responses. This
   is where Area can be different: its stage already draws a screen with changes as overrides (the Design view's log),
   and its question kit already draws answers as pictures.

## Area today

| Step | Now | Gap for a designer |
|---|---|---|
| Composer | Stacked Pills composer, field 15/22, grows to 5 rows of 28 (`.area-composer__input` max 5 × control-md), then scrolls | No expand; no starters; / offers New chat only |
| Context | The Canvas selection as one chip; @ lists 11 fixed repository files; pasted images as Attachments | Files, not design things; **images reach the agent as their names only** (`about()` joins names into the turn's context) |
| Design view | Send to chat sends `changesMessage`: "Make these 4 design changes in …" with numbered lines and token names | The person's bubble shows that whole generated text |
| Modes, model | Three model names in the composer; Settings › Chat holds the default | No Ask / change choice; every message may edit, after asking |
| Work | Every tool call a Step named by file or command; reads fold to "Explored N items"; Reasoning | Engineer's vocabulary; long |
| Approvals | Every edit and command asks; the body is the code diff or the command | Code to approve |
| Questions | `disallowedTools: ["AskUserQuestion"]`: the agent asks in prose | Area's own question card (Approval, question kit) is unused in the live chat |
| Edits | Edit summary "Edited N files +N −N", Keep / Undo per file (real) | Files and lines, not what changed on the design |
| Answers | Markdown; "Keep replies short" in the instructions | No pictures, options or folds |
| Loop | Keep / Undo this turn; project history (100 iterations) separate | No restore to a message; no Try again; chat edits aren't versions |

## Proposals, ranked

Each is the smallest change that meets the need (area-component-intake). Recommendation in brackets; the review page
starts from it.

| # | Proposal | What | Kind | Rec |
|---|---|---|---|---|
| P1 | Answers you can see | Area's own tools for the agent (show a screen with changes, offer options, ask, log design changes); the chat draws each as Area UI | App only (engine); existing components | Build |
| P2 | Changes in design words | Turn summary and approvals read as design changes (Save button: corner 8 to 12) with before / after, Keep / Undo; code under Show code | Edit summary: a design row (name, from and to, optional picture, counts optional) | Build |
| P3 | Questions back, with choices | Turn the agent's question tool on; draw it as the question card (recommended first, pictures, Something else, Skip); answers stay as replies | Nothing new (Approval) | Build |
| P4 | Options side by side | 2 to 4 versions as pictures in a row, each named by its difference; pick, More like B, Mix; no code until kept | Composition (Approval grid + Design card) | Build |
| P5 | The work folded into one line | Plain live line; done: "Worked 18s, looked at 6 things, changed 2 screens", opening to steps; Settings › Chat Summary / Every step | Composition (Step group) + a Settings row | Build |
| P6 | Context as design things | @ and + offer this page, layers, components, tokens, theme, saved references, past chats, files; chips with icons; pictures really sent | Composition (Composer menu, Chip) + engine fix | Build |
| P7 | Short answers, details folded | Lead with 2 or 3 sentences, then a picture or table, More for reasons; end on the next step as a choice | Composition (Accordion) + instructions | Build |
| P8 | Restore to any message | A version per acted-on message; Restore to here; Try another way into an exploration | Composition and app (Message actions, Versions) | Build |
| P9 | Design changes as one card | Send to chat puts "4 design changes on Settings" in the composer as a chip opening to the list | Composition (Chip in the context row) | Build |
| P10 | Room for long prompts | Grow to 8 lines, then Expand to the panel's height; / starters with an outline; long paste as a chip | Composer boolean (`expanded`, rung 6) + composition | Build |
| P11 | Ask, suggest or change | The + menu's first group: Ask, Suggest, Change, each a plain line; a quiet chip in the composer | Composition (the kit's + menu, Chip) | Build |
| P12 | Point at it | In Chat, a click on the stage drops a numbered pin and a note into the composer | App composition (stage overlay) | Not now |
| P13 | Ask about a part of a reply | Select words, Ask about this; Edit on your message, Try again on a reply | Composition (Message actions, Popover) | Build |
| P14 | Effort, not models | Quick or Thorough in the composer; the model in Settings › Chat | Option already on Model picker (efforts) | Not now |

Why each, what it touches and today's state are in `proposals.ts` (the page shows them per row).

### Order of work, if the owner takes the recommendations

1. **P1 with P3** (the engine's tools and the question card): everything visual depends on the agent being able to draw.
2. **P2, P5, P9** (the output in design words): mostly chat.tsx and the agent's instructions; one Edit summary change.
3. **P4, P7** (options and short answers), then **P8, P13** (the loop).
4. **P6, P10, P11** (input), **P12, P14** later.

### Intake notes for the component changes

- **Edit summary, design row (P2).** Need: show what changed on a design in a turn, by thing and value, with Keep and
  Undo. Answer: rung 4 and 5: the row's counts become optional, a `detail` (from and to) and a `visual` slot join it; no
  new component (the job, anatomy and Keep / Undo are Edit summary's). Peers: Step (one line, verb and detail), Design
  card (the picture). Cost: a gallery tile (design rows), states unchanged, docs and spec. Open: whether the head counts
  things ("Changed 3 things") or keeps +N −N when the rows are files.
- **Composer, expanded (P10).** Need: write a long prompt in the panel without a 5-line window. Answer: rung 6, a
  boolean `expanded` (and `onExpandedChange`) that lets the field fill its container, with the expand control in
  `trailingActions`; the 5-row cap becomes 8 to match the measured 7 to 8 lines. Peers: Textarea's autosize. Open: the
  cap (ChatGPT 182, Claude 384, Cursor 200).
- Everything else is a composition of existing components or app code; nothing proposes a new component.

## Built, 2026-11-08

The owner took every recommendation ("Take all recs"): P1 to P11 and P13 built, P12 and P14 not now.

| Proposal | What was built | Where |
|---|---|---|
| P1 | The engine's own tools, `show_options` and `log_changes`, as an in-process MCP server (zod schemas), allowed without asking | `electron/agent.cjs` `areaTools` |
| P2 | Edit summary design rows (`EditSummaryChange`) with the files under Show code; approvals titled in plain words ("Change Card's styles?"), the diff or command folded | `EditSummary.tsx`, `chat.tsx` `TurnEdits`, `ApprovalAsk` |
| P3 | AskUserQuestion on; the question card in the composer's place, Recommended marked, Something else and Skip; the answer kept as the person's reply | `agent.cjs`, `chat-parts.tsx` `QuestionCard`, `AskedQuestion` |
| P4 | Options as named pictures (the Workspace under each option's settings), the choice under them; a pick puts the settings on the theme, with Undo | `chat-parts.tsx` `OptionSet` |
| P5 | The work as one line in plain words ("Worked 9s, looked at 1 thing, made 1 change"), opening to plain steps; Settings › Chat › Work: Summary or Every step | `words.ts`, `chat.tsx` `AssistantParts` |
| P6 | The @ menu offers this project's pages and layers, components and the theme's settings before files; pictures reach the agent as image blocks | `chat.tsx` `useThings`, `agent.cjs` `withImages` |
| P7 | Instructions for short answers; text after `<!-- more -->` folds under More | `agent.cjs` `SYSTEM`, `chat-parts.tsx` `ReplyText` |
| P8 | Restore to here and Edit on a person's message (undo every change from it on); Try again and Try another way on a reply | `session.ts` `restore`, `retry` |
| P9 | Send to chat puts the changes in the composer as one card; the bubble shows it as a design-row summary | `design-inspector.tsx`, `chat.tsx` |
| P10 | Composer grows to eight lines, then Expand fills the panel; starters in /; a long paste becomes a chip | `Composer.tsx` `expandable`, `chat.tsx` |
| P11 | The + menu's first group: Ask, Suggest, Change; Ask and Suggest take the writing tools away | `chat.tsx`, `agent.cjs` `MODES` |
| P13 | Ask about this over words selected in a reply | `chat.tsx` `ChatTranscript` |

Second pass (same day): options draw one picture at the column's width in the visual questions' frame under 440 wide
(the option under the pointer, else the picked, else the recommended one) and side by side from 440; a question that
takes several answers marks each Chosen and sends them with Continue; finished conversations are kept (the last 20)
and the @ menu offers them as Past chats.

Not built from the proposals: Versions showing chat turns (P8; Versions restores page snapshots, and a chat edit changes
code files, so a chat entry there could not be gone back to), a before and after picture on a design row (P2), saved
references in the @ menu (P6), a separate `show` tool for one screen with changes (P1). Checked in the app's recorded runs, light and dark, at the browser pane's width; not run live (no sign-in).

## Not checked

- No live run (this Mac's Claude Code sign-in had expired; noted in the handoff). P1 and P3's engine changes are
  unverified against the SDK's question tool and in-process tools.
- Dark mode of the references; ChatGPT and Claude behaviours that need a sent message (above).
- The review page was seen in the app's browser pane at 1024 wide, light; not checked at phone width or dark.
