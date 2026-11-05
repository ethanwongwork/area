# Feed kit and Chat kit: gaps and inconsistencies (2026-11-04)

Owner: "relaunch the chat and feed kits, evaluate and research any gaps, fix any inconsistencies, see what needs to be
updated in area design system". Earlier the same day: "continue working on the feed and chat kits, refining the type
sizes, spacing, visual balance, corner radius, fill, stroke, pacing, rhythm"; the question card's answers; premade UI as
answers.

## Method

1. **Type census** (`docs/research/kit-type-2026-11-04/census.mjs`): every text style in Labs › Feed and Labs › Chat.
2. **Rhythm on the glyphs**: a probe of each chat's children, cap to baseline, frames by their edge.
3. **Corner, fill and edge census**: every painted box over 120 × 24 in both kits, light and dark, grouped.
4. **Widths**: Panel 268, Split 456, Column 768; the feed at a 400 Canvas and at 1150.
5. **Coverage**: which of Area's components (221 exports) neither kit shows, then each chat-relevant one composed in a
   reply to see whether it holds up there.

## Inconsistencies found and fixed

| # | Found | Where the fix went |
|---|---|---|
| 1 | Plain Plan and Edit summary sat 20.4 / 19.4 over the next tracker (16 elsewhere): their glyph margin collapsed into their list's negative foot | `plan.css`, `edit-summary.css`: `display: flow-root` |
| 2 | The feed's prose paragraphs 16 apart on the glyphs, a reply's 27 | `feed.css`: trim the block's edges only |
| 3 | A chart Card's title at 16 in a chat (13 in the feed): the reply's heading rule reached every h3 under it | `feed.css`: the reply's own headings only |
| 4 | Two design cards in a 768 reply took two of three tracks | `canvas.css` `--_most`; `feed.css` |
| 5 | The activity log's cards 20 round beside its tables at 16 | `feed.css`: the kit's corner |
| 6 | The feed's question cards on the app's edge, the same cards in a chat on the cards' edge | `question-kit.tsx`: the cards' stroke on the unit |
| 7 | A three-across picture question beside a frame stood 673 tall by a 393 frame | `question.css`: three across to 440 |
| 8 | Answer plates, the 22 key square and Skip's outline: three nested corners that did not agree | Approval: plain answers, plain digits, ghost Skip (owner) |
| 9 | Answer plates 10 inside the Composer's 22 card at 6 (not concentric) | `approval.css` `--_approval-plate`: the card's less the mat |
| 10 | Message's list markers drew over a Reference list's numbers inside a reply | `message.css`: `:not([class*="area-"])`; rule and test |
| 11 | A streaming reply's cursor on a line of its own | `message.css`: the dot on the last text block |
| 12 | Questions with a close beside Skip and Esc | `question-kit.tsx`: close only on a run |

## Gaps: what the kits did not show

The chat kit showed finished replies only. Added (Labs › Chat, `chat-kit.tsx`), each from the component made for it:

| Section | Components | Notes |
|---|---|---|
| Empty chat | Empty state, Composer, Prompt suggestions | suggestions under the composer, their prompts under its placeholder |
| Streaming | Reasoning (running), Message (streaming) | found #11 |
| Response with sources | Citation, Link, Reference list (also in the feed) | found #10 |
| Versions | Message actions with a compact Pagination | |
| Failed turn | Turn notice (error) with Retry | |
| Composer note | Composer note under the conversation's composer | |

Not built, and why:

- **Scroll to latest**: it shows only in a scrolled conversation; the kit's chats don't scroll. A chat section with a
  fixed height would show it.
- **Loading in the feed** (Skeleton) and **files in the feed** (File tile, File upload): no feed section yet.
- **People** (Avatar group, Presence) beside the activity log.
- **A theme set up as one chat** (owner's request, interrupted): Setup's 47 questions in 11 chapters
  (`pages/setup-questions.ts`), one frame a chapter; not started.

## What the design system needs (decisions for the owner)

Written today (DESIGN_SYSTEM.md): a host's text rules leave components alone (Text that flows); a list's ordinal is not a
keycap (Keycaps). Specs: Plan, Edit summary, Approval, Message.

Open:

1. **Plan's pending ring in a chat** reads about 1.1:1: it is an edge token, and the chat's cards' stroke lightens edges.
   Options: the ring takes the strong control edge everywhere, or the chat's stroke scope stops at frames.
2. **A fixed table at 268** splits code tokens ("space-" / "4"): Table's label column is 27%. Options: tables scroll under
   400 (the references do), or a code token never breaks.
3. ~~Approval's corner in a chat~~: settled by the aligned answers (later 2026-11-04): every question card is 22, a
   visual question's frame with it.
4. **Reference list's separators** are em dashes (its citation style, owner round 37), while the kit's copy rule is
   "never an em dash". Keep as a typographic separator, or a middle dot.
5. **Figures**: `FIGURES` (setup-screen.tsx) is off since 2026-10-30, while answers now use premade pictures
   (`MiniPicture`). Setup's choice cards could take the same pictures.
