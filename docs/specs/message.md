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
| actions | assistant: copy, rate, read aloud, regenerate, more; user: copy, edit (hover) | ChatGPT |

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| chatgpt | target product | An existing conversation, read only (text redacted) | chatgpt.com/c/…, 2026-09-26; hover 2026-09-28 | `chatgpt--user-message--rest`, `--assistant-prose--rest`, `--assistant-actions--rest`, `chatgpt--user-message--hover` |

## Measurements (ChatGPT)

```
column      768 wide
user        bubble padding 10 16, radius 22, 16/24, max 70% of the column, at the column's end;
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
| bubble padding, width | 10 16, at most 70%, at the end | ChatGPT | — |
| bubble corner | 16, the composer's (send Button 8 + 8) | the words were typed in the composer | ChatGPT 22 is a full pill at one line; owner: rounder, not pill |
| bubble fill | neutral component fill, default ink | ChatGPT's default is neutral | the blue came from the owner's accent setting |
| prose | 16/24, paragraphs 16 apart | Area body; ChatGPT 16 apart | ChatGPT 26 leading; Area's ramp is 24 |
| actions | ghost neutral icon Buttons (md, 32), no gap, the ghost Button's quiet ink (button.css:374-377; audit S6b, was `fg-muted`, message.css:50); the plates line up with the turn (assistant: first plate on the text edge; person: last plate on the bubble's edge); 12 below | ChatGPT (row, sizes); owner (alignment) | 16 icons (Area) instead of 20. ChatGPT pulls the row out 6 so its icons sit on the edge; the owner read the overhanging hover plates as misaligned (2026-09-27) |
| user actions | shown on hover and focus (always on touch), at the bubble's end; same row geometry | ChatGPT hides them until hover; measured 2026-09-28: three 32 plates, no gap, 4 below the bubble, the last ending 4 inside its edge | the plates end on the bubble's edge (owner, 2026-09-27: plates line up with the turn) |
| streaming | 8 dot 4 after the last word, pulsing (still under reduced motion); actions hidden until done; `aria-busy` | ChatGPT's dot | size not measured |

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

Each turn is an `article` named "<name> said": "You said" / "Assistant said" by default, or `authorName` (Message.tsx:20-23); actions are a named group of
labelled buttons.

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
