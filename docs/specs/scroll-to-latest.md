# Scroll to latest spec

**Status:** in review · 2026-09-26
**Captures:** `docs/research/captures/scroll-to-latest/`
**Peers:** Button (outline, icon-only, pill), Composer, Message

## Owner decisions

- 2026-09-26: "do each of them subsequently" — ChatGPT conversation group.

## Job and boundaries

Returns a long conversation to its newest message, shown only after the reader scrolls away.

## Sources

| Id | Type | What | Captures |
|---|---|---|---|
| chatgpt | target product | "Scroll to bottom" in an existing conversation, hidden at the end and shown after scrolling up 900 (scrolled back afterwards) | `chatgpt--scroll-to-bottom--visible--light`, `--hidden--light` (the latter is an inactive copy at opacity 0) |

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

## Verification

- Headless Edge, real click (`scratchpad/stl.mjs`): shown 336 from the end, 32 round, 24
  above the composer, centre delta 0; a click scrolls to the end (0) and hides it.
- React test: hidden, unfocusable round outline button.
