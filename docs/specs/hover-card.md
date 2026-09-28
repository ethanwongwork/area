# Hover card spec

**Status:** in review · 2026-09-26
**Captures:** timing measured live (below); no capture file (GitHub is a design-system reference, not a target product)
**Peers:** Popover (surface, anchoring, slots), Tooltip (a label, not a preview), Avatar

## Owner decisions

- 2026-09-26: "do each of them subsequently" — fourth in the product-specific inventory
  (Notion's page peek and link previews, ChatGPT's source previews).

## Job and boundaries

A preview of what a link points to (a person, a page, a source) while the pointer rests on
it or keyboard focus reaches it. Supplemental: it repeats what the link leads to and holds
no actions or information found nowhere else. Not Tooltip (a short label for a control), not
Popover (opened by a click, may hold a form).

## Variants

| Axis | Value | Justification |
|---|---|---|
| side | bottom (default), top, left, right | Popover's sides |
| content | person (identity row, description, facts), page, source | Notion, ChatGPT, GitHub |

## Sources

| Id | Type | What | Link |
|---|---|---|---|
| github | design-system reference (Primer hovercard) | user hovercard on a public commit list, timed in headless Edge with a real pointer: opens ≈ 750 ms after the pointer arrives (includes loading), closes ≈ 115 ms after it leaves; card 360 wide, radius 6, starts 20 before its link, 12 from it | github.com/nodejs/node/commits/main, 2026-09-26 |
| radix | design-system source | HoverCard defaults: openDelay 700, closeDelay 300; no focus trap; touch ignored | radix-ui.com/primitives/docs/components/hover-card |
| area | peer | Popover: 320 wide, 4 from its anchor, slots | popover.md |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| open delay | 700 ms | Radix 700; GitHub ≈ 750 | — |
| close delay | 300 ms, cancelled while the pointer is on the card | Radix 300 | GitHub's 115 gives too little time to cross onto the card |
| surface, width, offset | Popover: 320, 4 from the link | popover.md | GitHub 360 and 12 (its caret) |
| alignment | the card starts at the link's start; flips on both axes | GitHub starts its card at the link | Popover centres, which pinned edge links' cards to the viewport |
| identity row | avatar, then name (Popover title) over a muted handle, 12 apart | people cards (GitHub, Notion) | — |
| meta | 12/16 muted facts, 12 apart | caption role | — |
| touch | never opens (`hover: none` hides it) | Radix | the link is followed instead |
| keyboard | opens on focus-visible after the delay; Escape and blur close | Radix | — |
| semantics | no role and no `aria-describedby` on the link | Radix: supplemental | a whole card read as a link's description is noise |

**Server rendering.** The card renders next to its link and holds block content (Popover's
title and description). Inside a `<p>`, an HTML parser closes the paragraph at the card's first
block, so server-rendered HTML no longer matches the React tree and hydration fails (React
#418). Server-rendered pages place a hover card in flow content (a `div`), as the gallery
demos now do (2026-09-27); client-only rendering is unaffected.

## Verification

- Headless Edge, real pointer and keys (`scratchpad/hover.mjs`): opens after 751–754 ms;
  4 below the link, 320 wide, starting at the link (x 136); stays open with the pointer on
  it; closes 333 ms after the pointer leaves both; Tab to the link opens it; Escape closes.
- React test: anchor, manual popover, no added semantics.
- Unverified: dark theme, screen readers (by design the card is not announced).
