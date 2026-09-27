# Message spec

**Status:** in review · 2026-09-26
**Captures:** `docs/research/captures/message/`
**Peers:** Composer (the bubble's corner), Button (ghost icon actions), Prompt suggestions

## Owner decisions

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
| author | user, assistant | ChatGPT |
| state | streaming (dot after the last word; actions wait) | ChatGPT |
| actions | assistant: copy, rate, read aloud, regenerate, more; user: copy, edit (hover) | ChatGPT |

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| chatgpt | target product | An existing conversation, read only (text redacted) | chatgpt.com/c/…, 2026-09-26 | `chatgpt--user-message--rest`, `--assistant-prose--rest`, `--assistant-actions--rest` |

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
| actions | ghost neutral icon Buttons (md, 32), no gap, muted ink; row pulled out by the button padding so the first icon sits on the text edge; 12 below | ChatGPT | 16 icons (Area) instead of 20 |
| user actions | shown on hover and focus (always on touch), at the bubble's end; same row geometry | ChatGPT hides them until hover | the hover-state offset was not measurable in ChatGPT's markup |
| streaming | 8 dot 4 after the last word, pulsing (still under reduced motion); actions hidden until done; `aria-busy` | ChatGPT's dot | size not measured |

## Behavior and accessibility

Each turn is an `article` named "You said" / "ChatGPT said"; actions are a named group of
labelled buttons.

## Verification

- Headless Edge (`scratchpad/msg.mjs`): bubble 70% of the column, flush to its end, padding
  10 16, corner 16; the first assistant icon on the text edge (0); actions 12 below; user
  actions shown on hover.
- React test: names, structure, streaming cursor.
- Unverified: dark theme, screen readers, RTL (the bubble moves to the start).
