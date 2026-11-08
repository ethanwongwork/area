# Message spec

**Captures:** `docs/research/captures/message/`
**Peers:** Composer (the bubble's corner), Button (ghost icon actions), Prompt suggestions

## Owner decisions

- 2026-09-27: "the buttons and controls don't line up" → action plates align with the text
  edge and the bubble's edge instead of hanging 8 outside them.
- 2026-09-26: "do each of them subsequently" — ChatGPT conversation group (Message and
  MessageActions together).

## Job and boundaries

One turn in a conversation: the person's words in a bubble at the end of the column, the
assistant's as prose across it, each with a row of icon actions. Rich content inside the
prose (code blocks, lists, tables, citations) uses those components; Message only lays out
the turn.

## Variants

| Axis | Value | Justification |
|---|---|---|
| author | user, assistant (default; optional in React, manifest default `author: "assistant"`: the bare block already is the assistant layout) | ChatGPT |
| state | streaming (dot after the last word; actions wait) | ChatGPT |
| status | sending, error (the person's message on its way, or not sent); unset once sent | Queue's sending row, Attachment's and Turn notice's error (components audit O6, internal.md:148) |
| stack | MessageGroup (the person's consecutive messages) and `split` (one message in several bubbles): 2 apart, meeting corners tightened | the Claude app's bubble stack (chat-apps.md; components audit V9) |
| actions | assistant: copy, rate, read aloud, regenerate, more; user: copy, edit (hover) | ChatGPT |

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| chatgpt | target product | An existing conversation, read only (text redacted) | chatgpt.com/c/…, 2026-09-26; hover 2026-09-28 | `chatgpt--user-message--rest`, `--assistant-prose--rest`, `--assistant-actions--rest`, `chatgpt--user-message--hover` |

## Measurements (ChatGPT)

```
column      768 wide
user        bubble padding 10 16, radius 22, 16/24, max 70% of a wide column (at least the column less 48 or 456),
            at the column's end;
            background rgb(232,243,254) with blue ink = the owner's accent personalization
            (ChatGPT's default bubble is neutral); actions (copy, share, edit) 32 × 32, no gap,
            hidden until hover
assistant   prose 16/26 400 rgb(13), paragraphs 16 apart, the column's width
actions     six 32 × 32 buttons, radius 8, no gap, icons 20 (16 for regenerate and more),
            muted rgb(143); the row starts 6 before the text (532 vs 538) so the first icon
            sits on the text's edge; 12 under the last paragraph; always shown on the last turn
```

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| bubble padding, width | 10 16, at most max(70%, min(100% − 48, 456)), at the end | measured references, docs/research/chat-kit-2026-11-02 | — |
| bubble corner | 16, the composer's (send Button 8 + 8) | the words were typed in the composer | ChatGPT 22 is a full pill at one line; owner: rounder, not pill |
| bubble fill | neutral component fill, default ink | ChatGPT's default is neutral | the blue came from the owner's accent setting |
| prose | the prose line, `text-lg-prose-leading` (16/24 at type 14, 15/24 at 13; was the UI line, 15/22 at 13); blocks the prose gap apart (16); a heading the gap plus 8 above and 8 below; a list 8 under its lead-in, items 4 apart | DESIGN_SYSTEM.md › Prose lines, Text that flows (owner, 2026-10-30); docs/research/vertical-rhythm-2026-10-30 | ChatGPT 26 leading; Area's prose line is 1.5 × the size on its 2px ramp |
| actions | ghost neutral icon Buttons (md, 32), no gap, the ghost Button's quiet ink (button.css:374-377; audit S6b, was `fg-muted`, message.css:50); the plates line up with the turn (assistant: first plate on the text edge; person: last plate on the bubble's edge); 12 below | ChatGPT (row, sizes); owner (alignment) | 16 icons (Area) instead of 20. ChatGPT pulls the row out 6 so its icons sit on the edge; the owner read the overhanging hover plates as misaligned (2026-09-27) |
| user actions | shown on hover and focus (always on touch), at the bubble's end; same row geometry | ChatGPT hides them until hover; measured 2026-09-28: three 32 plates, no gap, 4 below the bubble, the last ending 4 inside its edge | the plates end on the bubble's edge (owner, 2026-09-27: plates line up with the turn) |
| streaming | 8 dot 4 after the last word, pulsing (still under reduced motion); actions hidden until done; `aria-busy` | ChatGPT's dot | size not measured |
| sending | `aria-busy`; after the long wait (1000 ms, Spinner's `delay="long"`, `data-waiting` until then) the bubble dims to 60% and "Sending…" shows under it in the notice line's type (text-base, muted); the line keeps its place while it waits | Queue's sending row (opacity 0.6, Codex opacity-60); WRITING.md "Loading shows by how long it takes" | a send is usually quick, so nothing shows for a second |
| error | under the bubble: the dismiss-circle mark (icon-sm, danger ink), "Not sent" in the default ink, then Retry (a ghost neutral sm Button with the reset glyph) when `onRetry` is passed; `statusText` replaces the words; said once through the shared announcer ("Message: Not sent"), politely | Turn notice's error line (mark, default ink words, its action after); Queue's "Not sent" and dismiss-circle; the reference's failed strip and Retry (chat-apps.md, Attachment) | the bubble keeps its fill: the line says it, so a stack's corners and widths stay |
| status line | 4 under the bubble (the person's actions' gap), a control-sm row (24) so it is one height with or without Retry, at the column's end | Message's own user gap | — |
| stack | 2 apart; where two of the person's bubbles meet, their end corners (top-end of the lower, bottom-end of the upper) are a quarter of the bubble's corner: 4 at 16, 3 at compact 12; a bubble with a status line under it keeps them | gap: the reference's `--cds-message-bubble-stack-gap: 2px`; the meeting corner is set per look there with no default (chat-apps.md), so Area derives it from its own corner and the Radius setting | the person's bubbles line up on the column's end, so only the end corners meet |

## Visual pass

2026-09-28 (batch 19), live in Claude in Chrome on an existing conversation (read only):
the user bubble, prose and assistant actions re-measured the same as 2026-09-26 (bubble corner
22, 10 / 16 padding, 16/24; prose 16/26, paragraphs 4 + margins; actions 32, corner 8, icons 20,
muted #8f, no gap). New: the user turn's hover actions (`chatgpt--user-message--hover`): three
32 plates, no gap, 4 below the bubble, the last 4 inside its edge. Area in the gallery: bubble
corner 16, 10 / 16, neutral #f7, 16/24; prose 16/24; 32 plates with 16 icons, muted, no gap (since audit S6b the ghost Button's quiet ink, about #58). The
type and row geometry match; the differences are the recorded decisions (corner 16 over the
pill, the neutral fill over the owner's accent personalization, 24 leading, 16 icons, plates on
the edge). No change.

## Behavior and accessibility

Each turn is an `article` named "<name> said": "You said" / "Assistant said" by default, or `authorName`; actions are a named group of
labelled buttons. A sending message is `aria-busy`; a message not sent is said through the shared announcer
(`useAnnouncement`, DESIGN_SYSTEM.md "Announcements") as "Message: Not sent", and its Retry is a Button in the turn's
Tab order. MessageGroup is a plain `div` (its turns keep their own names); a split message is one article.

## Verification

- Headless Edge (`scratchpad/msg.mjs`): bubble 70% of the column, flush to its end, padding
  10 16, corner 16; actions 12 below; user actions shown on hover.
- 2026-09-27 alignment change, measured in the gallery: assistant first plate starts on the
  text edge (43.8 = 43.8); the person's last plate ends on the bubble's edge (523.8 = 523.8).
- React test: names, structure, streaming cursor.
- Unverified: dark theme, screen readers, RTL (the bubble moves to the start).

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Research: `docs/research/motion-2026-10-07/crispness-and-current-state.md`.


| Interaction | Before | After |
|---|---|---|
| Streaming cursor | opacity 1 → 0.3 → 1, `slow × 4` (1s), literal `ease-in-out` keyword | same, `--area-ease-in-out`: each half of the breath eases, so the dot dwells at both ends and never kinks at the turn (the contract's "pulse: linear" would) |
| Cursor, reduced motion / none | stopped | unchanged; stopped, the dot rests at full ink (the keyframes set only the 30% midpoint) |
| User actions, pointer reveal | opacity `fast` ease-out both ways | unchanged: matches the system's other reveal-on-hover rows (Card overlay, Tree view actions) |
| User actions, keyboard focus | faded in over `fast` | **instant** (`:focus-within` sets 0s): focus never waits on a fade |
| Action buttons | Button's rules | unchanged here |

Verified on `/message.html`: cursor `1s cubic-bezier(0.65, 0, 0.35, 1) infinite`; with motion none
`animation-name: none` and opacity 1; focusing a user action gives `transition-duration: 0s`, opacity 1.

Open question: should the pointer reveal also arrive at once (MOTION.md hover recipe) and fade out
on `fast`? Recommendation: yes, but together with Card and Tree view so every reveal row moves alike.

## Feedback log

- 2026-09-30 · audit S6b (owner) → actions no longer override Button ink to `fg-muted`; they take the ghost icon Button's quiet ink as every icon action does. Suggestion rows and Code block tabs keep `fg-muted` → message.css:50.
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → `author` is optional, default `"assistant"` (Message.tsx:7, :18); manifest default `author: "assistant"`, since the bare block already equals the assistant layout. No visual change.
- 2026-10-01 · audit G-23 (owner pick A) → demos use the placeholder vocabulary (Body text, Item one, Option one, Placeholder, Label) and `authorName` "Assistant", per DESIGN_SYSTEM's Example copy; no component change.
- 2026-10-01 · compact pass round 7 → gap 12 → 8 and bubble 10 × 16 → 6 × 12 at compact; the corner is the Composer's (control radius + `ui-cluster`), 16 / 12 (a literal +8 made it 14 at compact). docs/research/compact-pass-2026-10-01.md.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → cursor pulse on the ease-in-out token (was the system's one literal easing); keyboard focus shows the person's actions at once → message.css. See "Motion and interaction, 2026-10-07".
- 2026-10-14 · owner: Motion is one number, default 210 → the streaming cursor breathes over a fixed 1s (was `slow × 4`, which would have become 1.4s); it still stops at motion 0 and under reduced motion → message.css. docs/MOTION.md.
- 2026-10-14 · owner: "merge it, then continue working" (the all-axis audit's open item) → the loop stops through the Motion axis's `duration-loop` token (1, or 0 at step 0 and under reduced motion): the cursor's breath is `calc(1s * duration-loop)`, resting at full ink. The nearest motion scope now decides, so a non-zero scope nested in a 0 scope runs it; it was a `[data-area-motion="0"]` descendant rule plus a reduced-motion media rule (cohesion test pins it).
- 2026-10-30 · owner: a vertical rhythm audit against Cursor and Claude, then "add the reading leading tokens and apply the text-flow rules to Message and the chat markdown" → Message sets `text-lg-prose-leading` (15/24 at type 13, was 15/22) and its blocks the `text-lg-prose-gap` apart; headings take the gap plus 8 above and 8 below, a list 8 under its lead-in, items 4. Step, Plan, Edit summary and Turn notice keep their own UI lines (cohesion test). → message.css. Back In review.
- 2026-11-02 · owner: "the list and bulleted lists should align to the text and not be so indented" → a list's markers start on the text's edge in a 1.25em slot (`::before`, a counter for numbers), the words 1.25em in (18.75 at 15); nested lists one slot further. It was the browser's 40 (markers 33 in). The app's chat markdown and documentation lists take the same. → message.css.


## 2026-11-02: the bubble in a narrow chat

The bubble was 70% at every width, so in the Inspector (268 of text) it was 188 wide, a word or two a line. Measured
(docs/research/chat-kit-2026-11-02): the references keep 70% of a 768 thread, `min(456px, 100%)` in a compact one, 84–85%
in a narrow one and a 32 inset under 480. Now `max(70%, min(100% - 48, 456px))`: 538 of
768 (unchanged), 408 of 456, 220 of 268.

## 2026-11-04: read on its glyphs (Q-T2)

Owner, "Apply both" on Kit Type Decisions (artifact KeEDPx5sUTQXE6iKtu6sw1; docs/research/kit-type-2026-11-04). An assistant reply trims its first and last text lines (`text-box: trim-start cap text`, `trim-end cap text`), as Card trims its title and last line: the gaps around a reply (a section title over it, the turn above, its actions under it) are read on the glyphs. A reply that opens a block sits 16 under a title (it was 21); the person's turn to the reply reads 24 (it was 29). Frames in a reply and the person's bubble are unchanged. Test: `packages/react/tests/type-rhythm.test.mjs`.

## 2026-11-04: lists that are the reply's own; the cursor on the last word (kit gaps pass)

- The reply's list rules (markers, the 1.25em slot, the 4 between items) apply to its own lists only,
  `:not([class*="area-"])`: markdown's and an app's lists keep them, a component set in a reply (Reference list) keeps
  its own. A Reference list in a reply had drawn the reply's markers over its numbers. Rule: DESIGN_SYSTEM "Text that
  flows" (a host's text rules leave components alone); test: `cohesion.test.mjs`.
- Streaming: when a reply ends in a text block (a paragraph, a heading, a quote or a list), the dot is drawn on that
  block's last line (its last item's), and the cursor element after it stands down; it sat on a line of its own.

## 2026-11-07: sending, not sent, stacks (components audit O6, V9)

- **What changed:** a person's message can be `status="sending"` (after a second the bubble dims and "Sending…" shows
  under it) or `status="error"` ("Not sent" with the danger mark and Retry from `onRetry`, said to screen readers).
  `MessageGroup` stacks the person's consecutive messages 2 apart and `split` puts one message's parts in bubbles of
  their own on the same stack; where two bubbles meet, their end corners tighten to a quarter of the corner (4 at 16).
- **Why:** Message had only streaming, while Queue, Attachment and Turn notice already say a send or an upload failed
  (internal.md:148); the Claude app stacks a person's bubbles 2 apart with tighter meeting corners (chat-apps.md). The
  owner took every recommendation of the components audit (2026-11-07).
- **Not measured:** the meeting corner (the reference sets it per look with no default), derived from Area's corner.
- **Verdict:** awaiting the owner.
