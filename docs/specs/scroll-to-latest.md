# Scroll to latest spec

**Status:** accepted · 2026-09-28 (batch 20; was: in review · 2026-09-26)
**Captures:** `docs/research/captures/scroll-to-latest/`
**Peers:** Button (outline, icon-only, pill), Composer, Message

## Owner decisions

- 2026-09-26: "do each of them subsequently" — ChatGPT conversation group.

## Job and boundaries

Returns a long conversation to its newest message, shown only after the reader scrolls away.

## Sources

| Id | Type | What | Captures |
|---|---|---|---|
| chatgpt | target product | "Scroll to bottom" in an existing conversation, hidden at the end and shown after scrolling up 900 (scrolled back afterwards) | `chatgpt--scroll-to-bottom--visible--light`, `--hidden--light` (the latter is an inactive copy at opacity 0), `--hover--light` (2026-09-28) |

## Measurements (ChatGPT)

32 × 32, radius 9999, fill rgb(252), 1px rgba(0,0,0,0.1) ring, no shadow, icon 20 in
rgb(93); centred on the composer (delta 0), 24 above it; hidden with opacity 0 and
`pointer-events: none`.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| button | Button outline neutral, icon-only, pill (32 round, surface fill, border ring) | ChatGPT | 16 icon (Area) |
| glyph | package arrow, pointing down | — | — |
| position | 24 above the composer, centred on it | ChatGPT 24, delta 0 | the same 24 as Prompt suggestions |
| visibility | fades in when the reader is more than 200 from the end; hidden: not focusable, `aria-hidden` | ChatGPT hides it at the end | threshold not measurable in ChatGPT |
| action | scrolls to the end smoothly; instantly under reduced motion | — | — |

## Visual pass

2026-09-28 (batch 20), live in Claude in Chrome (the conversation scrolled up, then back to the
end): 32 round, fill #fc, 1px 10% ring, no shadow, 20 icon in #5d, 24 above the composer, centre
delta 0, all as 2026-09-26. Hover, first captured (`chatgpt--scroll-to-bottom--hover`): no paint
change at all, only the pointer cursor. Area: outline neutral icon Button, 32 round, surface
fill, the 1px control edge (#e2), 16 icon in default ink, 24 above, centred, with Button's hover
wash. Geometry and position match. ChatGPT's glyph is muted (#5d); owner (2026-09-28)
lightened every neutral ghost and outline Button to #56 (button.md), which now matches it.

## Verification

- Headless Edge, real click (`scratchpad/stl.mjs`): shown 336 from the end, 32 round, 24
  above the composer, centre delta 0; a click scrolls to the end (0) and hides it.
- React test: hidden, unfocusable round outline button.
