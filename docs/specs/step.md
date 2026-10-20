# Step spec

**Captures:** none yet: the evidence is the agent products' shipped stylesheets, cited by file and selector in
`docs/research/inspector-chat-2026-10-18/` (cursor.md, claude-code.md, codex.md). ChatGPT's reasoning disclosure is
not captured (needs the owner's session).
**Peers:** Accordion (disclosure), Message (the turn it sits in), Timeline, Spinner, Code block

## Owner decisions

- 2026-10-18: "Go with your recommendations on all six decisions and start Phase 1" → steps as plain lines (Cursor,
  Codex), not Claude Code's dot rail; then "start Phase 2: the Step, Step group, Reasoning … components".

## Job and boundaries

One thing an agent did, on one line: what it did (the verb, live while it runs, past tense when done) and what it did
it to (the detail), opening on demand to show what went in and came out. **Step group** folds a run of steps under one
line ("Explored 6 files", "Worked for 2m 5s"). **Reasoning** is the agent's thinking as one closed line ("Thought for
12s") that opens to its summary. Not a Timeline (dated events with times and media), not an Accordion (a reader's
section of a document), not a Stepper (a process the person moves through).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| status | running, done, failed | the three states every product draws | Cursor `ToolCallLine.js` + shimmer; Codex "Running" / "Ran" / "✘ Failed"; Claude Code dot colours |
| body | none, expandable | a step with input or output opens; one without stays a line | Cursor collapsible header; Claude Code IN / OUT; Codex transcript |
| icon | none, any 16 glyph | Cursor shows a tool icon; Codex and Claude Code do not | Cursor `ToolCallLine.js` (icon secondary) |
| (Step group) open | closed, open | groups fold; a running group can start open | Cursor `AgentTranscriptActivityGroup.js`, Codex "Explored", Claude Code quiet tools |
| (Reasoning) running | true, false | "Thinking" shimmer, then "Thought for Ns" | Cursor `bUl`, Claude Code thinkingV2, Codex "Thinking…" |

Excluded: Claude Code's 7px dot on a 1px rail (owner chose plain lines); per-step card bodies by default (Claude Code
hides them under 500 wide; the Inspector is 256 to 500).

## Sources

| Id | Type | What | Path | License | Captures |
|---|---|---|---|---|---|
| cursor | product bundle | agent transcript, StyleX atoms | `Cursor.app/…/workbench.desktop.main.{css,js}` 3.24.12 | evidence only | cursor.md |
| claude-code | product bundle | extension webview | `anthropic.claude-code-2.1.296/webview/index.css` | evidence only | claude-code.md |
| codex | product bundle + source | desktop webview, TUI | `ChatGPT.app` asar (Codex); github.com/openai/codex @89461ea `codex-rs/tui` | evidence only; TUI Apache-2.0 | codex.md |

Target products: ChatGPT shows "Thought for Ns" on reasoning models (not captured); Notion and Figma have no agent
steps.

## Anatomy

```
cursor  ToolCallLine: line (flex, gap 4, nowrap ellipsis, 22 line) → icon (secondary) → verb (secondary) → detail (tertiary)
        collapsible header: bare text button, chevron margin 3, hidden until hover/open, rotate 90° open; body gap 4
codex   activity label: <action> bold verb, <detail> muted; grouped items 4 apart
claude  tool header: name bold + mono argument .85em; quiet tools under one counted header
```

Area:

```
area-step                 grid; the line, then the body
  area-step__row          button when it opens (aria-expanded), else div; flex, gap 4, one line
    area-step__icon       optional 16 square slot, muted
    area-step__verb       default ink; shimmers while running; danger ink when failed
    area-step__detail     muted, cut short with an ellipsis, tabular numbers
    area-step__meta       optional (a duration, +N −N), muted, tabular
    area-step__chevron    12 glyph, hidden until the row is hovered or focused, or the step is open
  area-step__body         margin-top 4, on a rail: a 1px border-inline-start (border-divider at stroke-width), content
                          12 in with the rule counted; hidden when closed
area-step--group          a Step whose body holds `area-step__items`: steps, 4 apart (same body and rail)
area-step--reasoning      a Step whose body is the summary in muted ink, pre-wrap
```

## Measurements

From the stylesheets (not capture-compare tables; no live captures yet):

| Property | Cursor | Claude Code | Codex |
|---|---|---|---|
| line type | 14/22 conversation (13/18 sizeSm) | 13 × 1.5 | 13 |
| verb / detail gap | 4 | 4 (margin-right) | a space |
| verb ink | secondary 74% | bold default | bold default |
| detail ink | tertiary 60% | mono .85em | muted |
| steps apart in a group | 4 | (rows 8 + 8 padding) | 4 |
| chevron | margin 3, hidden until hover / open, 90° | 16, rotate 90°, .15s | — |
| body gap | 4 | 8 margin, IN / OUT grid | — |

## Decisions

| Slot · property | Area value | Basis | Reason |
|---|---|---|---|
| line type | text-md (Message's) | peer: Message | a step sits in a reply; Codex and Claude Code match the panel's text |
| verb ink | fg-default, regular | cursor (verb over detail) | one label weight (DESIGN_SYSTEM); the default ink is the stronger of Area's two |
| detail ink | fg-muted | cursor, codex | — |
| gaps | 4 between parts and between steps | cursor + codex agree (4) | — |
| chevron | 12 glyph `chevron-down`, rotated 270° closed (90° in RTL, pointing along the reading direction), hidden until hover / focus / open; appears at once and fades out on `fast`, turns on `fast` | cursor | Area's chevron glyph (Accordion's); MOTION.md Hover and Chevron rotation |
| running | verb shimmer, 60% → 100% → 60% of its ink over 2s × the motion loop | cursor `TextShimmerContent.js` | stops at Motion 0 and under reduced motion |
| failed | verb in fg-danger | codex ✘, claude-code failure dot | — |
| group children | 4 apart, a 1px divider rule, content 12 in | claude-code rail at 12 | the rule keeps a folded run legible at 256 |
| reasoning body | muted text, pre-wrap | claude-code (secondary), cursor | — |
| row focus | the focus ring, offset 2, on a small corner | DESIGN_SYSTEM focus | — |

## States

| State | Change | Evidence |
|---|---|---|
| hover / focus-visible | chevron shows; nothing else moves (foreground fixed) | cursor; Area rule |
| open | chevron points down, body shows | cursor, claude-code |
| running | shimmer; `aria-busy` | cursor |
| failed | verb in danger ink | codex, claude-code |

## Behavior and accessibility

A step with a body is a native button with `aria-expanded` and `aria-controls`; Enter and Space toggle it. A step with
none is plain text. The verb change is visible text, so a screen reader reads "Reading" then "Read" when the row is
reached; the Chat view announces new steps through its live transcript. The shimmer stops under reduced motion and
Motion 0 (`--area-duration-loop`). Forced colours: the verb keeps CanvasText (the shimmer's gradient is dropped).

## Peers and consistency

| Peer | Shared role | Peer value | Step | Match |
|---|---|---|---|---|
| Message | prose type | text-md | text-md | yes |
| Accordion | chevron glyph | chevron-down 12 | chevron-down 12 | yes |
| Spinner | running | ring | wording + shimmer | Cursor and Codex mark running in the words |

## Visual pass

Seen in the browser preview on 2026-10-19: the recorded run in the Chat view (Inspector, about 228 wide) and the gallery tiles, light. The chevron was not drawing (its Glyph had no size in the slot); it now takes the xs icon slot, as do Plan's and Edit summary's. Side by side with Cursor not done (no live capture). Dark not rechecked after the chevron fix.

## Verification

React tests (`packages/react/tests/agent-chat.test.mjs`, 9), the full React suite (495), manifest parity, contracts, app typecheck, playgrounds. In the browser preview (4420), 2026-10-19.

## Feedback log

- 2026-10-18 · built from the recorded evidence for Phase 2 of the Inspector chat.
- 2026-10-19 · browser check: chevrons drew at 0 wide (an unsized Glyph) → sized in the xs icon slot; Step icon fills its sm slot.

- 2026-10-19 · owner, round 49 (needs changes): "make sure the text styles and colors, and gaps, padding, margins, overall spacing/layout are cleaned up, intentional, accurate, and consistent" → a cleanup pass: every text style, color, gap and inset traced to a reference value or an Area peer, written below.
- 2026-10-19 · owner, round 50 (rethink): "is the line necessary?" → round 51 coherence pass (below).
- 2026-10-19 · owner, round 51 (rethink): "if the line is necessary/intentional then i would keep it" → round 52 (below).
- 2026-10-19 · audit: Anatomy corrected to the code (the body's margin and rail, `.area-step--group`); the chevron now
  appears at once on hover (it faded in) while its turn keeps `fast`; the closed chevron mirrors in RTL.

## Review note, 2026-10-19

- **What changed:** new: one line per thing the agent did (Read, Grep, Ran), opening to what went in and came out; Step group folds a run of them ("Explored 3 items"); Reasoning is the thinking as "Thought for 2s".
- **Why:** the Chat view's plain step lines become components, after Cursor's tool lines and Codex's and Claude Code's transcripts (read from their installed bundles).

## Cleanup pass, 2026-10-19 (owner, round 49)

The agent chat's shared rules (all five families):

| Rule | Value | Basis |
|---|---|---|
| Lines in the transcript | the reply's type (text-md); 4 between a line's parts | Message; Cursor ToolCallLine gap 4 |
| Cards (Edit summary, Plan) | one size, text-sm; sm buttons | Cursor: cards 13 under a 14 reply |
| Card frame | the card edge at stroke-width, container corner, surface fill | Code block |
| Card column | text 12 in: Menu's list padding 4 + the row inset 8 | Menu; Cursor card header 0 12 |
| Card head | one row tall, a rule under it when rows follow; a trailing button (row − control) / 2 from the end, never under 4 | Code block's header |
| Card rows | Menu rows: row height, row inset, row corner, row plate (pressed: bg-component-pressed), Menu's row gap `gap-row` (12, compact 8) so a label after the icon slot lands on the list column, and `ui-row-gap` (2, compact 0) between rows | Menu (`--_menu-gap`, surface.css) |
| What a line opens | 4 under the line, on a 1px rail with its content 12 in | Cursor content gap 4; Claude Code's rail at 12 |
| Backplates | one: the row plate under the pointer or focus | Menu |

Changed here: a step's input and output and the reasoning summary now sit on the rail, as a group's steps already did
(one rule for whatever a line opens; before, only the group had it). Kept: the reply's type, verb in the default ink
and detail muted (Cursor's order of inks), the chevron 4 after the text, the 4 between grouped steps.

## Review note, 2026-10-19 (round 50)

- **What changed:** whatever a line opens now sits on the same thin rule 12 in: a step's output and the reasoning
  summary, as the grouped steps already did.
- **Why:** you asked for intentional, consistent spacing; one rule for every opened line replaces three different
  treatments.

## Round 51 coherence pass (2026-10-19)

- The rail is gone. Whatever a line opens sits 4 under it at the line's start: Cursor's group is a plain column (flex,
  gap 4, no indent, no rule; `AgentTranscriptActivityGroup.js`), and the owner chose plain lines over Claude Code's
  timeline on 2026-10-18; the 12 rail was that timeline's.
- The chevron turns on `fast` ease-out (MOTION.md's one chevron rule); it snapped before.

## Review note, 2026-10-19 (round 51)

- **What changed:** the thin line beside opened steps, reasoning and grouped steps is gone; what a line opens now sits
  just under it, in line with it.
- **Why:** you asked whether the line was needed; Cursor draws none, and the line came from Claude Code's timeline,
  the style you set aside for plain lines.

## Round 52 (2026-10-19)

The rail is back (owner: "if the line is necessary/intentional then i would keep it"). It is intentional: without it,
an opened group's steps and the reasoning summary read as more lines of the turn, since they are the same type at the
same start; the rule says they belong to the line above. It stays one rule for everything a line opens.

## Review note, 2026-10-19 (round 52)

- **What changed:** the thin line beside opened content is back.
- **Why:** it is what tells an opened group's steps apart from the steps that follow it; without it they read as one
  list.

## Review note, 2026-10-19 (round 55, design-system audit)

- **What changed:** The chevron appears at once under the pointer (it faded in) and still fades out; the closed chevron mirrors in right-to-left text.
- **Why:** MOTION.md: hover enters instantly and leaves on fast, as Queue's and Edit summary's reveals do.
