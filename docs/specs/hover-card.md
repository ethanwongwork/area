# Hover card spec

**Status:** accepted · 2026-09-28 (batch 17; was: in review · 2026-09-26)
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
| area | peer | Popover: 320 wide, 8 from its anchor (4 before audit S16), slots | popover.md |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| open delay | 700 ms (`delay`; `openDelay` a deprecated alias) | Radix 700; GitHub ≈ 750 | — |
| close delay | 300 ms (`closeDelay`), cancelled while the pointer is on the card | Radix 300 | GitHub's 115 gives too little time to cross onto the card |
| surface, width, offset | Popover: 320, 8 from the link (`offset`, default `POPOVER_OFFSET`) | popover.md; audit S16, E-5 A (owner 2026-09-30) | GitHub 360 and 12 (its caret). Was 4 |
| alignment | the card starts at the link's start (`align`, default start); flips and shifts, via the shared JS engine (`useAnchoredPosition`), which writes `data-side` and `transform-origin` | GitHub starts its card at the link; audit S16 | Popover centres, which pinned edge links' cards to the viewport. The `.area-popover-anchor` wrapper and its CSS anchor rules are gone |
| identity row | avatar, then name (Popover title) over a muted handle, 12 apart | people cards (GitHub, Notion) | — |
| meta | 12/16 muted facts, 12 apart | caption role | — |
| pointer | a mouse or pen opens after the delay; touch never opens (`hover: none` hides it) | Radix; shared `useHoverIntent` (audit E-18 A, owner 2026-09-30) | the link is followed instead on touch |
| keyboard | opens at once on `:focus-visible`; blur closes at once; Escape closes in one capture-phase handler on `window` that consumes the event, so a Popover or Dialog underneath stays open (overlay.ts:108-145) | Tooltip's rule, audit E-18 A (owner 2026-09-30) | Radix waits the delay; Area did too (700ms) until audit E-18 |
| state | `open` / `defaultOpen` (shared `useOpenState`); `onOpenChange` fires only on real changes | audit S17 (API vocabulary, slice 1, 2026-09-30) | — |
| semantics | no role and no `aria-describedby` on the link | Radix: supplemental | a whole card read as a link's description is noise |

**Server rendering.** The card renders next to its link and holds block content (Popover's
title and description). Inside a `<p>`, an HTML parser closes the paragraph at the card's first
block, so server-rendered HTML no longer matches the React tree and hydration fails (React
#418). Server-rendered pages place a hover card in flow content (a `div`), as the gallery
demos now do (2026-09-27); client-only rendering is unaffected.

## Visual pass

2026-09-28 (batch 17, gallery): the Popover surface (corner 12, 12 inset with the border,
the shared floating lift), opened by hover or focus. Beside Notion's link preview on file
(`notion--link-preview--open`: 280 × 268, corner 10, a 7% warm ring and a two-layer 3% lift):
Area's corner is two larger and its lift is the one used by every floating surface. No change.
2026-09-28, live in Claude in Chrome: Notion's sub-page link preview (`notion--page-preview--open`,
pointer on the link): 260 × 179, corner 10, white, the 7% warm ring, and a lift of 0 20 24 at 5%
plus 0 5 8 at 2.7%, the same two-layer geometry as Area's floating lift (0 20 24 + 0 5 8). Its
text is small: a 12/18 muted path over a 13 semibold title. Area keeps the Popover surface
(corner 12, 12 inset) and its type roles: title 14/20 500 (Notion 14/20 600 in the link preview),
meta 12/16, description 14/20. Notion sets the preview's secondary text at 12 in both previews;
owner decision (2026-09-28, "go with your recommendation"): the description stays 14, one
description size across Popover, Card, Dialog and Hover card.

## Verification

- Headless Edge, real pointer and keys (`scratchpad/hover.mjs`): opens after 751–754 ms;
  4 below the link, 320 wide, starting at the link (x 136); stays open with the pointer on
  it; closes 333 ms after the pointer leaves both; Tab to the link opens it; Escape closes.
- React test: anchor, manual popover, no added semantics.
- Unverified: dark theme, screen readers (by design the card is not announced).

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md` ("Popover, menu, … hover card"). Verified in a background tab of the
built-in browser on `/hover-card.html` (computed transitions, `getAnimations()`, rects after
`finish()`); animations do not tick in a background tab, so nothing was watched in motion.

| Interaction | Before | After |
|---|---|---|
| open | after 700 ms (pointer), at once (keyboard focus); shown in a passive effect *after* the placement engine had measured the hidden card (0 × 0), then re-placed by the ResizeObserver a frame later | same delays; the card is shown in a layout effect *before* placement (Popover's order), so the enter starts at its final place with the origin at the link: verified `showPopover` runs with no inline position, then `left 570 / top 689`, `transform-origin 27px 132px`, flipped to top, 320 × 132 |
| enter | `opacity` + `scale` 0.97→1, `duration-base` `ease-out` (shared rule) | unchanged, inherited from `surface.css` (verified 150) |
| close | 300 ms close delay; exit `duration-base` | 300 ms; exit now `duration-fast` from the shared rule (verified 100: opacity, scale, overlay, display) |
| reduced motion | tokens 0; scale 1 (shared) | unchanged |

Crispness: resting card on whole pixels (570, 689, 320 × 132; `overlay.ts` rounds), `scale: 1`, no
`will-change`. Nothing in `hover-card.css` overrides the shared motion; a comment now says so.

Open questions: a warm-up window as Tooltip's (a second hover card within ~300 ms opens at
once) for lists of mentions. Recommendation: not yet; no reference product does it for cards.

## Feedback log

- 2026-10-01 · audit E-18 (owner pick A) → hover intent shared with Tooltip (`useHoverIntent`): keyboard focus opens at once (was after 700ms), blur closes at once, one consuming capture-phase Escape; mouse and pen open after the delay, touch never → overlay.ts:108-145, HoverCard.tsx:46-74.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → HoverCard is shown before it is placed (layout effect, Popover's order), so the enter scales from the link at its final place; delays 700 / 300 kept; exit now fast via the shared rule. HoverCard.tsx, hover-card.css comment.
