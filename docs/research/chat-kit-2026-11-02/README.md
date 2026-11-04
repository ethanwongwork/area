# The Chat kit: what changes between a feed and a chat (2026-11-02)

Owner: "also start a chat feed kit, maybe the chat components for feed will follow different rules? or will they be more
or less the same. the min and max widths may be different, but the same or similar content may be featured in both. find
out what the differences in design might be. do research, use claude in chrome, refine the chat examples research
chatgpt, claude code, cursor. be thorough." With seven reference pictures (a glass agent panel, a question card, an agent's
activity on a rail, a composer's command menu, attachments over a composer, an activity log, Claude Code's turn summary).

Sources, each with its values and where they were read:

- [live.md](live.md): ChatGPT and Claude, measured in the owner's Chrome on existing conversations (nothing sent)
- [claude-desktop.md](claude-desktop.md): the Claude desktop app's bundle, its Code tab (Claude Code) and narrow chats
- [cursor.md](cursor.md): Cursor's bundles, the IDE's agent pane and the Agents window
- earlier: `docs/research/inspector-chat-2026-10-18/` (Cursor, Claude Code's extension, Codex), `feed-system-2026-10-31`

Built: Labs › Chat (`#labs/chat`, `apps/desktop/src/pages/chat-lab.tsx`, blocks in `src/chat-kit.tsx`).

## The answer: one set of components, two compositions

The components are the same. Every product draws a chat's content with the parts it draws elsewhere (ChatGPT's one
Markdown component serves its thread, its compact thread, the Codex app and print; Claude's prose serves the 768
transcript and the 404 chat beside an artifact). What differs is **composition**: how many things share a row, what
titles them, where the frame is, and what the width does to them.

| | Feed (Labs › Feed, the Canvas) | Chat (Labs › Chat) |
|---|---|---|
| Width | the Canvas, 600 to 2000+; content in a grid | a column: 268 (Inspector), 456 (split), 768 (reading) |
| Across | cards 2 to 4 across (least 260, gap 12) | one thing a row; two cards across only when each keeps ~200 |
| Order | sections by kind, titled, counted | time: turns, each person's then the reply |
| Titles | a section title over every block (title-xs 16) + count | none; a reply's own headings, one step over its text |
| Type | UI 13 in frames, reading 15/22 for prose | the same two: reading 15 for the reply, UI 13 for the parts set in it (steps, tables, code) |
| Spacing | margin 32, sections 48, heading 16, gap 12, frame inset 16 | turns 24, blocks 16 (the prose gap), trackers 12, steps 4; no margin of its own (the panel's 14 or the column's) |
| Text edge | 4 in from the frames (`--_text-inset`) | the same 4 (Claude's `--msg-text-inset: .25rem`) |
| Frames | every block in a frame (cards, tables, code) | text bare; tables, code, cards and charts in the feed's frames, the column's width |
| Actions | on the card (hover, select, open) | under the turn (copy, rate, again), on a block's head (copy code) |
| Arrival | all at once | one block at a time (streaming), actions after |
| Narrow | the grid drops a column | the bubble widens, tables and code scroll inside their frames, cards go one across |

## What the width changes (and what it doesn't)

Kept at every width, in every product measured:
1. **The type.** ChatGPT 16/26, Claude 15/21, Cursor 14/22 in the IDE pane and 15/24 in the Agents window (per window,
   never per width), Claude Code 14/20 (a Small / Medium / Large
   setting, 13 / 14 / 15): the same in a side panel as in a wide column. The size is the host's setting, never the
   width's. The one exception is a deliberately compact surface (Claude's "peek" chats: 13, leading 1.5, code 12).
2. **The spacing**, because it is the type's: ChatGPT's unit is the size ÷ 4, Claude's 0.75em, Claude Code's block gap
   half a line and its turn gap three-quarters, Area's prose gap two-thirds of the prose line. One Markdown at any width:
   none of Claude desktop's four renderers has a width rule, nor Cursor's `Markdown.stylex` (one component, both windows).
3. **The order and the frames.** A table is a table and a code block a code block at 268 and at 768.

Changed by the width:
1. **The column**: 768 (ChatGPT, Claude: 48rem), Cursor 840 (IDE) / 796 (Agents), all centred at their cap → 456
   (ChatGPT compact) → 404–500 (Claude split, Cursor's pane, Area's Inspector 268–472 of text).
2. **Side padding**: Claude 16 → 0 beside an artifact; Claude Code's gutters 32 → 16 in a split tile ≤ 560; the
   reply's end stop `clamp(0, (W − 384) × .175, 56)` (Claude Code's one fluid prose rule); panels keep their own inset
   (Area 14).
3. **The person's bubble**: ChatGPT 70% / compact `min(456px, 100%)`; Claude 84% / 85%; Cursor `100cqi − 82` (a full
   card in the IDE pane). Area's
   was 70% everywhere (188 of 268). **Built**: `max(70%, min(100% - 48, 456px))`, 538 / 408 / 220.
4. **Overflow**: narrow, a table or code block scrolls inside its frame; wide, ChatGPT lets tables and media grow past
   the column ("wide blocks"). Area keeps everything in the column (proposal W1 below).
5. **Cards side by side**: two across only when each keeps its least width; one across a panel.
6. **Hidden detail**, by container query on chrome only: Cursor hides the composer's mode label ≤250, wraps card rows
   and media ≤280, stacks tray banners ≤480; Claude Code narrows gutters 32 → 16 ≤560. Never the prose.

## Proposals (for the owner)

- **W1. Wide blocks.** ChatGPT lets a table or a chart run past the 768 column when the window has room. Area keeps them
  in the column (they scroll). Recommendation: keep them in the column; the feed is where wide things go.
- **W2. Tables in a reply.** ChatGPT's are unframed (rules only, 14 in 16 prose); Area's reply uses the feed's framed
  Table (owner, 2026-11-02: tables and code "like the other code block and tables found in the rest of the kit").
  Cursor frames them (radius 12 card, cells 6 × 10, no header fill, scroll on hover). Recommendation: keep the feed's
  frame.
- **W3. Headings in a reply.** Claude: one step over the text (17 over 15) or the text's size; ChatGPT 18–24. Area's
  reply: title-xs 16 over 15 in a wide chat, the text's size strong in the Inspector. Recommendation: one rule, title-xs
  at every width (the Inspector's chat would gain a step).
- **W4. A step's time at the line's end.** Claude Code's turn summary and every tool row end on the time, tabular
  (`TurnStatus`); Area's Step and Step group set it after the detail. Recommendation: move `meta` to the line's end
  (one Step rule; the group gained `meta` today).
- **W5. A narrow composer.** At 268 the full composer (attach, permissions, model and effort, mic) now cuts its pickers'
  words short (built, below). Cursor and Claude Code drop a label rather than cut it. Recommendation: under ~320 the
  pickers show their icon alone, the full words in their menus.

## Built (2026-11-02, uncommitted)

- **Labs › Chat** (`#labs/chat`, search "Chat"): ten sections (Conversation, Response, Response with cards, Agent turn,
  Trackers, Question, Attachments, Commands, Composer, Activity) in a frame of the chosen width (Panel 268, Split 456,
  Column 768; a container, so parts answer to the chat's width). New blocks in `src/chat-kit.tsx`: `CardsReply` (the
  feed's design cards, the Top models chart and a color scale inside a reply), `AgentTurn` (a folded turn, one step
  open to its JSON output), `Question` (Approval in the composer's place), `Attachments`, `Commands` (the open "/" menu),
  `Activity` (Timeline with an edit summary and a comment card).
- **Message**: the person's bubble is `max(70%, min(100% − 48, 456px))` (was 70%): 538 / 408 / 220 at the three widths.
  Spec, Documentation entry updated.
- **Composer**: in a narrow composer the leading group shrinks and its pickers cut their words with an ellipsis, so the
  send never leaves the shell (it ran 32 past the 268 panel).
- **Step group** takes `meta` (the run's time), as Step does.
- **Data cards**: the bar list's name column is at most 30% (its bars were 32 wide at 268; now 77).
- Checked in the browser preview at all three widths, light and dark.

## Layout pass (2026-11-02, second round)

Owner: "do a visual layout, pacing, rhythm, padding, gaps, text size pass on all the chat specific modules and designs. why
are all the composers and other designs in a container?" Measured at 1440 × 900, type 13, in the browser preview, every
module at Panel, Split and Column, light and dark.

- **The containers.** At Panel and Split each section's chat sat in a bordered panel (the page's ground, the cards' edge,
  14 in), drawn to show the width. A chat has no frame of its own in any product measured, so the frames are gone; the
  chat sits bare at its width. The composer, Plan, Edit summary and Approval keep their own frames (they are those
  components' shells; the composer is a field, the Approval takes its place).
- **One edge in a reply.** Plan and Edit summary drew the app's stroke (12% black) beside the feed's table, code block
  and cards in the cards' Stroke 2 (6%). The chat's root now takes the cards' stroke, so every frame in a reply draws
  one edge.
- **One inset in a reply.** The chat's own frames hold words 12–13 in; the feed's table, code block and cards held them
  17–18. Inside a chat `--_frame-inset` is 12 (Cursor's tool cards 10, Claude Code's 8, Claude's code 14), so every frame
  in a reply now holds its words 12–13 in.
- **Card bug.** The feed's frames asked for their inset through Card's `--area-card-inset`, which Card's size classes
  overrode (spec card.md, 2026-11-02). Fixed in Card; the feed's stat cards, charts and meters now sit 16 in, as the
  feed's other frames (they were 18).
- **A time joins its message** (8, as the Inspector's chat), not the 24 turn gap.
- **An activity comment** is the chat's surface frame, like the Edit summary beside it, in the log's 13 type (it was the
  feed's grey 16-in frame at 15).
- **Color steps fill the reply** (five across 768), as its other blocks do.
- Unchanged, measured: turns 24, blocks 16, a heading 24 above and 8 below, trackers 12, steps 4; three type sizes in a
  reply (15/22 reading, 16/22 headings, 13 UI and code) plus the Diff's 11/17 mono, a component size (see below).

Open: the Diff draws its code at 11/17 (Code block sm) beside the reply's code block at 13/20; the composer's corner (18)
stays a step rounder than the reply's frames (16), its shell's own rule. Artifact: https://claude.ai/artifact/85QkQbtLFrFDhtMSMXVHg5
(build: `node docs/research/chat-kit-2026-11-02/build.mjs apps/desktop/dist <out.html> <snapshot.json>`, snapshot from
`../feed-kit-2026-11-01/capture.cjs "http://localhost:<port>/#labs/chat"`).

## Round 3 (2026-11-02): + menu, round composer buttons, unboxed trackers, activity log

Owner, with two references (Cursor's + menu, an activity feed): "can you add this dropdown for the plus icon, i like the
colored icons"; "the composer should have round buttons/pill buttons ... rounded by default for area (like cursor)"; "the
tracker, do they need containers? the containers look off ... gaps look either too big or too small"; "a notification
style activity tracker ... for a project", in the Feed kit too.

- **+ menu** (`chat-kit.tsx` `ADD_ITEMS`, `Add`; section Add menu): Area's Menu off the composer's +, the four modes first
  with their marks in a tone's ink (Plan info, Debug danger, Multitask discovery, Ask success) and a note under each, then
  Files, the model (its effort in the discovery ink) and Connectors in the menu's quiet ink. Every composer in the kit
  opens it.
- **Pills › Composer** (tokens `axes/pills.ts`, on by default): the composer's buttons and pickers are pills, the send a
  circle. Off, they follow Button's flag.
- **Plan and Edit summary `variant="plain"`**: no frame, words on the text edge, plates hanging; in the kit's turn every
  tracker line is now 16 from the next (text to text 13–16, was 13 / 27 / 26 / 36 / 22). The diff and the question card
  keep their boxes (an output and the composer's stand-in).
- **Activity log** (`src/activity-kit.tsx`, Labs › Feed "Activity log", Labs › Chat "Activity"): days as a label on a rule,
  events on Timeline with a toned mark on a round plate, who (David Tee, or a team on a square), what, when, and a card
  under the events with more (checks, a merge's names and counts, a comment, changes, a file). Open: the time sits after
  the title (Timeline's rule), not at the line's end as in the reference; the marks' plates go against Timeline's round-8
  "no backplate" decision, here only, for the notification look.

## Round 4 (2026-11-03): figures, code changes, activity balance, real copy, questions

- **Figures a size up.** Plan's "1 of 3" measured 13/18 like its labels; the face's figures are cap height and tabular, so
  they read larger. Every tracker figure (Plan count and meta, Step meta, Edit summary +N −N) is now the secondary step
  (12) on the row's line, as the ramp names metadata.
- **Code changes.** Edit summary files take an icon of their kind and show a path as the file's name then its folder,
  muted; counts at 12. Real two-file change with a diff of the settings page.
- **Activity balance.** Avatars were Avatar sm (26) on an 18 line and names the browser's bold (700). New Avatar `xs`, the
  text line's height (18); names and objects at the strong weight (500); a card's trailing figures at 12; token changes
  in two aligned columns.
- **Real copy.** One scenario through the kit: a dark mode switch for a settings page (conversation, plan, explored files,
  edits, tests, an install approval, the reply), a spacing-token answer, a design-system project's activity.
- **Questions** ([questions.md](questions.md)). Built from what the measured products agree on: at the composer, keyed
  options, a free-text last row, "N of M" with chevrons in the head (Pagination compact), Skip in the footer and on Esc, a
  single choice moves to the next question. Not built (no product does it): a two-column option grid, progress dots, a
  serif question title. Open choices 1–9 in questions.md.

## Round 5 (2026-11-03): the live gaps closed, the activity log refined

Owner: "Close all four" (live.md, second pass), then on the activity log: the check too small, "·" not wanted, the date
rule and the dates' type, tables for the changes.
- **+ menu**: each note on its label's line, muted, 12 after it (one line a row); the menu 384.
- **Step**: verb muted, what it acted on in the full ink; a group's summary and the thinking line stay one quiet line.
- **Question card** (Approval with notes): 22 square keys, a light Dividers line between choices (gone beside a hovered,
  focused or chosen row), Skip at the end of the "Something else" row (Esc still skips), no hint row; a close at the head.
- **Timeline**: no dots; who or where a gap after the title, the time at the line's end at 12.
- **Activity log**: dates are Area's group label (13, 500, muted, no rule); the passed checks' mark a 16 icon; the token
  and component changes are the feed's framed Table (sm), aligned with the other cards' 12 inset; no "·" in card copy.
- **Event marks** (owner: "are these icons necessary to be inside a circle, maybe make them standalone and bigger, also
  show me what the actual icon options are and why they are colored that way"): the round plates are gone; each event is
  its kind's 16 icon in Timeline's own mark slot. Color now carries the meaning it has on a status badge, only where an
  event has an outcome or asks for something: Published and Approved success, Review requested discovery, Changes
  requested warning, Marked priority danger, Commented info; routine work (tokens, components, files, stars) keeps the
  quiet mark. Before, attached and starred were orange and tokens purple with no reason. The key is the "Event marks"
  table in both kits (`activity-kit.tsx` EVENTS).
- **Teams** (owner: "Team icon in square"): a team's avatar is the square with the team glyph, not an initial.
