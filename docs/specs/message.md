# Message spec

**Status:** accepted · 2026-09-28 (batch 19; was: in review · 2026-09-26)
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

## Feedback log

- 2026-09-30 · audit S6b (owner) → actions no longer override Button ink to `fg-muted`; they take the ghost icon Button's quiet ink as every icon action does. Suggestion rows and Code block tabs keep `fg-muted` → message.css:50.
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → `author` is optional, default `"assistant"` (Message.tsx:7, :18); manifest default `author: "assistant"`, since the bare block already equals the assistant layout. No visual change.
- 2026-10-01 · audit G-23 (owner pick A) → demos use the placeholder vocabulary (Body text, Item one, Option one, Placeholder, Label) and `authorName` "Assistant", per DESIGN_SYSTEM's Example copy; no component change.
