# Cursor agent chat workflow, read from the app bundle

Cursor 3.27.22 (`Contents/Resources/app/package.json`), read 2026-11-08, read-only. **G-JS** =
`/Applications/Cursor.app/Contents/Resources/app/out/vs/workbench/workbench.glass.main.js` (Agents window; the same
React/StyleX modules ship in `workbench.desktop.main.js`). Modules are cited as `"Name.js"`; you can grep each one as
`"Name.js"(){`. Atoms (`ui-xxxx`) were resolved from the CSS strings inlined in G-JS. Spacing tokens are in 4 px steps
(`--cursor-spacing-3` = 12, `-5` = 20, `-16` = 64; `ne-` = negative).

Already recorded, so not repeated here: tokens, bubble, composer box (36–200 editor, radius 18, 24 send circle),
pills `Pill.js`, modes list, queue/steer, trays, tool lines, "Explored"/"Thought for Ns", cards, shell, edit diffs,
Keep All / Undo All, todos (see `docs/research/inspector-chat-2026-10-18/cursor.md`). Column, markdown, tables,
grouping density, end-of-turn summary geometry and tray container queries are in
`docs/research/chat-kit-2026-11-02/cursor.md`. `docs/research/settings-2026-11-07/README.md` is the method only.

## 1. Context

- **@ menu categories** (`"buildMentionMenuSections.react.js"`, title switch `case"files_and_folders":return"Files & Folders"`):
  Mentions (all), Files & Folders, Docs, Terminals, Past Chats, Canvas, Tasks, Branch (Diff with Main), Browser.
  With an empty query the menu shows up to **3** recent items (`oNv=3`), then two category rows: "Files & Folders"
  (icon `folder`) and "Past Chats" (icon `chat-bubbles`) (`aNv=[{id:"files-and-folders",…}`). MCP items sort first
  (`ieC`).
- **Everything that can be attached** (`"ContextPills.js"` map `zWl={code:"selections",file:"fileSelections",…}`):
  code selections, files, folders, docs, commits, PRs, terminal selections, terminal files, images, attached documents,
  videos, git diff, diff to main, external links, past chats (`composer`), rules, commands, UI elements
  (`uiElementSelections`), console logs, subagents, browser. Shortcut labels (`FX={…composer:"Past Chats",…}` in
  `"types.js"`): Code, Files, Folders, Commits, Commit History, Past Chats, Reset, Summarize, Agent Review, Open Browser,
  Terminals, Browser, Projects.
- **Plus menu** (`"PlusMenuAnchoredTray.react.js"`): tooltip "Add agents, context, tools", search "Search skills,
  context, chats...", sub-views "Search MCPs...", "Search custom modes...", empty "No Matches Found".
- **Mention chip** (`"MentionChip.js"`, style `GMe`). It sits **inline in the text, not as a pill**: inline-flex, baseline
  aligned, font 1em, line-height 1.5, weight normal, colour `--cursor-text-link`, no fill. Icon slot 12 × 12
  (`--cursor-spacing-3`) with 4 after it; an image icon is the size of `font-size-lg`. The label is capped at **20em**
  and truncates. The line range sits at 52% of currentColor, base size, 2 before. A clickable chip gets a hover tint on
  `::before`, inset −1 px vertically and −3 px horizontally, radius sm (4), `--cursor-bg-link-hover`. A status dot
  (error, warning or neutral) can trail it. Its tooltip appears above, offset 6 (`"MentionChipTooltip.js"`). The old
  IDE pill row (`"AutoCollapseDivGroup.js"`) hid pills that did not fit (opacity 0, 0.1 s fade), with no "+N" count.
- **Add to Chat** (`"selectionHoverActions.js"`): a hover action on an editor selection, `label:"Add to Chat"`, shown
  beside Quick Edit (`showsQuickEdit=!0`) and hidden while a suggestion shows. Bugbot comments have their own "Add to Chat"
  button with the icon `chat-bubble-plus-center`. Terminals reach chat by drag (dataTransfer type `"Terminals"`).
  Browser design mode adds items with ⌘L (see §6).
- **Images**: pasted or dropped images show at the top of the composer as a grid of **64 × 64** previews
  (`--ui-prompt-input-image-preview-width/height: var(--cursor-spacing-16)`), 8 apart (`"PromptInputImageGrid.js"`).
  Actions: "View image", "Remove image", fullscreen, and **draw on the image** (`onSaveDrawing`;
  `"PromptInputImageAnnotation.js"`; `"MultiImageViewer.react.js"` "Failed to save annotated image"). Sent messages show
  **32 × 32** thumbnails, 8 apart (`"AgentTranscriptHumanAttachmentStrip.js"`). Drop hint: "Drop or click to attach an
  image".
- **Long pastes become a pill**: text over **10,000** characters is replaced by "Clipboard (N lines)"
  (`"clipboardPastePill.js"`, `Vsm=1e4`, `` `Clipboard (${n} ${n===1?"line":"lines"})` ``).
- **Context meter: a ring** (`"context-utilization-ring.react.js"`): SVG 14 px, stroke 2, track opacity 0.28. The
  "subdued" variant caps the drawn arc at 90% (`GH_=14,fQs=2,qH_=90,zH_=.28`); the IDE's `"TokenRing.js"` is 16 / 2.
  Tooltip `"N% · used / limit context used"` or "Show context usage". A click opens the **Context Usage tray**
  (`"ContextUsageTray.js"`, `"context-usage-tray.ts"`): "N% Full", "~X" tokens, and a breakdown by category, each with a
  colour: system_prompt grey, tools purple, rules green, skills yellow, mcp pink, subagents blue, conversation orange,
  summarized_conversation red. It has a "View Report" action that opens the breakdown as a canvas.

## 2. Long prompts

- The editor grows from 36 to 200 and then scrolls inside (recorded; re-checked: `.ui-j7tqr1{--prompt-input-editor-max-height:200px}`,
  min `var(--cursor-spacing-9)`). I found **no full-screen or expand editor**: `variant:"expanded"` is the ordinary full
  box, as opposed to the compact one-line box.
- **Prompt history**: up arrow walks back through the **last 10** non-empty user prompts of this chat
  (`"promptHistory.js"` `dtv=10`; `"use-prompt-history.react.js"`).
- **Drafts are kept per chat**: disk key `composerDraft:<id>` stores text, rich text and the active custom mode
  (`"composerDraftRecord.js"` `FAf="composerDraft:"`). Answers to an unfinished questionnaire are saved as a draft too
  (`onSaveDraft`, §4).
- **Slash menu** (`"ComposerSlashMenuList.js"`): rows are typed Skill, Command, Mode or Subagent; you can pin a row
  ("Pin …"/"Unpin …"); "Show N more"; "Add Skills". Built-in actions (`"slashMenuData.js"`, `"glass-composer-slash-corpus.js"`):
  /reset "Clear the conversation and start fresh", /summarize "Summarize this conversation" (alias compact), /side
  "Start a side chat for this conversation" (alias btw), /run-everything, /add-plugin, /remove-plugin, Agent Review,
  Open Browser. Built-in skills (`beg={…}`): canvas "Create a document, diagram, or small website to express an idea."
  (keywords Dashboard, Mockup, Prototype, Wireframe), onboard "Get started with Cursor.", create-rule, create-skill,
  create-subagent, review, loop, schedule, automate, shell, split-to-prs, rename-chat, and more. Git actions
  (`"git-action-slash-commands.js"`) are written as plain outcomes: "Commit the current changes", "Create a pull request
  for this branch", "Split the current work into reviewable pull requests".
- **Voice input** (`"PromptInputDictation.js"`): "Send voice input", "Cancel recording".

## 3. Modes and models

- **Modes, as shipped** (`"modeConfig.js"`; IDE descriptions in `getModeDescription`). Agent (default) "Plan, search,
  build anything". Plan (yellow, `list-todo`) "Generate an implementation plan", placeholder "Plan changes"; IDE
  wording "Create detailed plans for accomplishing tasks". Debug (red, `bugbot`) "Pinpoint the root cause of an issue".
  Ask (green, `chat-bubble-question`) "Answer questions without making edits"; IDE wording "Ask Cursor questions about
  your codebase". Multitask (purple, `circles`) "Orchestrate multiple subagents in parallel". Hidden modes: spec, triage.
  The agent can **ask to switch modes**: a transcript card with Skip / Switch and the preference Always ask / Always run
  ("Switched to …", "The agent requested to switch to X Mode, but it was skipped by the user";
  `"AgentTranscriptSwitchModeCard.js"`).
- **Model picker**: Auto "Balanced quality and speed, recommended for most tasks" (`"modelPickerDisplayConfiguration.js"`);
  toggles "MAX Mode" (it asks to confirm with "Enable MAX Mode"; Enter confirms, Backspace cancels) and "Use Multiple
  Models" (`"ModelToggles.js"`); per-model On/Off parameters (`"ModelParameterControls.js"`).
- **Several models at once**: each chosen model gets a count submenu "1x…Nx", "Select model count"
  (`"ModelCountControls.js"`), and runs as sub-chats (`isBestOfNSubcomposer`). A server-side **judge** picks a winner
  (`aiserver.v1.UiBestOfNJudgeFinalResult{winner_composer_id, reasoning}`). I found no client UI that shows the judge's
  reasoning.
- **A/B response comparison** (`ResponseComparison*`, near `"ResponseComparisonComment.js"`): two `article` cards,
  "Response A" and "Response B", side by side in a horizontal scroll-snap row. Each card is 85% wide (flex-basis 85%),
  padding 16, radius 2xl (14), `bg-elevated`, 1 px `stroke-tertiary`; its label is xs (11) tertiary. While they
  generate, each shows 5 shimmer skeleton lines; the status reads "Generating responses" then "Responses ready"
  (aria-live). The button "Response A is Better" becomes ✓ "Selected", and the other card dims to 0.6. An optional
  comment follows: "Optional — tell us why…", "Enter to send · Esc to skip", then "✓ Thanks for the feedback".

## 4. Questions back (AskQuestion / questionnaire)

- They open as a **tray above the composer**, max-height **320** (`"questionnaire-tray.react.js"`, `maxHeight:320`). The
  header is muted "Question" or "Questions", or "Questions from <agent>" for a subagent. Each question is a step
  (`_i.Step`) whose prompt renders as markdown at size md. If there is more than one question, the footer shows a
  stepper ("Previous question" / "Next question").
- **Options** (`"TrayOption.js"`, `labelStyle:"letter"`): each row is a button with a letter badge A, B, C…
  (`String.fromCharCode(65+t)`). Badge 20 × 20, radius sm 4, sm 12 medium type, `bg-tertiary`, tertiary ink. When
  selected, the badge turns the **plan yellow** (`--cursor-bg-yellow-secondary` / `--cursor-text-yellow-primary`). The
  row has padding 6, radius lg 8, gap 8, and 50% `bg-tertiary` on hover or selection. Label ink is secondary, primary
  when selected; an optional description is tertiary, 2 below. Multi-select is supported (`allowMultiple`).
  **Single-select auto-advances** to the next question.
- **Free text**: the last option is always "Other..." (aria "Other answer"). It is a full rich editor, with @ mentions
  and / commands, and Enter submits it.
- **Footer**: primary "Next" (while questions remain) or "Continue", tone `plan` (yellow), with its shortcut; secondary
  "Skip". Errors: "Could not submit the questionnaire. Please try again." When minimised it becomes a pill, "Answer
  questions (N)", with a needs-attention dot (`"questionnaire-collapsed-pill.react.js"`).
- **After answering**, the transcript keeps a card: each prompt (medium weight) with its answers joined by ", ", or
  "Skipped" (`"AgentTranscriptAskQuestionCard.js"`).

## 5. Output

- **End-of-turn summary** (`"EndOfTurnSummary.js"`; Agents window only, flag `composer_end_of_turn_summary`): header
  "N File(s) Changed" (or "Notes" if no files) with a text button "Review" / "Open". Rows show the file icon, name and
  `+N −N`. It shows **5**: 4 rows and then "Show N more" (`pPp=5`). Under the rows there is an optional brief written in
  markdown (`briefMarkdown`, size sm, collapses).
- **Keep / Undo**: Undo All needs a **second click**, with hint "Click again to confirm undo" and label "Confirm"
  (G-JS near `"Click again to confirm undo"`). Keep says "Accept all changes". For worktree chats: "Apply" ("Apply
  changes to the main working directory") and "Undo Apply". Cloud agents: "Apply Changes Locally".
- **Checkpoints** (`"ComposerHumanRowButtons.react.js"`): a "Restore Checkpoint" icon button (codicon restore, 16) on
  the user message; after a restore, "Redo checkpoint" with tooltip "Restore edits to the latest checkpoint". Editing and
  resending an earlier message asks "Revert files to this message?" — "Later messages in this chat will be removed. File
  changes after this message can be reverted so they match, or kept as they are." — with Cancel / **Revert Files** /
  **Keep Files** (⇧⏎) and "Don't ask again" ("Always revert"), 480 wide. A plan execution row shows "Reverting to
  checkpoint" (`"ComposerPlanExecutionRow.react.js"`).
- **Plans as documents**: the transcript card is muted "Created Plan" over the plan name (lg, medium), an overview in
  markdown (sm), "View Plan" and the Build controls (`"AgentTranscriptPlanCard.js"`). The plan opens as an editable
  markdown document, placeholder "Start writing your plan..." (`"PlanEditorView.js"`). **Build** is a yellow (plan-tone)
  split button with "Build Locally", "Build in Cloud" and "Build in Parallel" ("Execute the plan across parallel
  subagents."); while it runs it reads "Building..." (`"plan-build-controls.react.js"`). Progress reads "N of M To-dos
  Completed" with a progress ring (`"PlanExecutionCard.js"`).
- **Diagrams and pictures in replies**: Mermaid renders inline with the header "Mermaid Diagram" and "Expand diagram"
  (`"MermaidCodeBlock.js"`, `"MermaidDiagram.js"`); generated images show as "Generated image"
  (`"GenerateImageToolCallView.js"`), and markdown images open a viewer (`glass-markdown-image-viewer`).
- **Canvases (agent-made artifacts)**: "Create a New Canvas — Build a dashboard, document, or other artifact"
  (`"canvas-activation-empty-state.react.js"`); a preview tray with "Open Canvas"; steps "Updating/Updated canvas";
  Publish / "Copy link" / "All team members can view" (`"canvas-share-menu.react.js"`); seed prompt "Make me a canvas
  that " (`"request-new-canvas.js"`).
- **Approvals, in plain words** (G-JS `function yPC(`). Ask Every Time "Agent will ask for approval before running
  tools." Allowlist "Commands that are allowlisted will run automatically." Auto-review "A classifier will run for each
  action and decide whether it's safe to execute this command. Allowlists are still respected." Run Everything "All
  commands will run without approval, classification or sandboxing." Each has a "(with Sandbox)" variant. Reasons are
  stated: "This … a file outside your workspace." / "a protected config file." (`"transcriptToolApprovalReason.js"`).
- **Steering nux**: "Steer New Messages?" — "Steering sends new messages to Agent while it works, without stopping it."
  with Keep Queuing / Open Settings (`"SteerQueueNuxNotice.react.js"`).

## 6. Aimed at non-technical users

- **Design Mode in the built-in browser** (`"browser-design-mode-toggle.react.js"`): "Annotate — Point at anything and
  tell the agent what to fix". Hints (`"design-mode-hints.js"`): "Click to select or drag to create an area · ↑↓ to
  adjust", "Double-click to edit text", markup strokes "⌘Z to undo · Esc to stop", "Return to save". The comment field
  says "Describe the change or ⌘+L to add to chat" (`"browser-design-mode-comment-input.react.js"`). The screenshot
  plus annotation points are captured into chat (`"design-mode-screenshot.js"`).
- **First-run role question**: "Tell us about your role", with Software engineer, Designer, Product manager,
  Researcher, Data scientist, Student, Marketer, Operations, Something else (`"ftux-wizard-welcome-step.react.js"`).
- Plain outcome wording for slash commands (git actions and skills, §2) and for approval modes (§5), and an empty
  canvas state that names what a person might make (dashboard, document).
- **Not found**: an "Explain" / "explain like I'm new" action, a plain-language rewrite of changes, chat empty-state
  example prompts (the only examples are in `"PlanBuildMessageSection.js"`, e.g. "Add authentication"), a full-screen
  prompt editor, and any UI showing the best-of-N judge's reasoning.
