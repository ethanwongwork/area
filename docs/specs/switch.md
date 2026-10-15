# Switch spec

**Status:** accepted · 2026-09-28 (batch 14: lighter off track; was: in review · 2026-09-26 (cohesion audit, second pass))
**Captures:** `docs/research/captures/switch/` (Area, Notion),
`docs/research/captures/baseline/chatgpt--switch-on--*`
**Peers:** Checkbox and Radio (choice paint, disabled), Slider (thumb), Spinner (loading),
Field, Menu and settings rows

## Owner decisions

- 2026-09-26: **Neutral by default, accent by override** (DESIGN_SYSTEM.md, "Color and
  focus"). Switch already followed it: on is `neutral-solid`, `tone="accent"` or
  `tone="custom"` (`--area-switch-color`) opt out. *Superseded 2026-09-29 (owner, D1): on is
  the Selection role (`selection-solid`), accent by theme; `tone="accent"` was removed and
  `tone` is neutral or custom.*
- 2026-09-26 (second pass, owner: decide every open item): the thumb travels 12px at every
  size (track = height + 12: 28 / 32 / 36); read-only keeps full paint with a default
  cursor, and only disabled dims
  ([cohesion audit](../research/cohesion-audit.md#second-pass-notion-figma-and-the-open-decisions),
  items 9 and the Switch row).
- 2026-09-27: the custom-colour example's green should be more vibrant and lighter.

## Job and boundaries

Switch turns a setting on or off with immediate effect. A choice submitted later is a
Checkbox; a choice among named modes is Segmented.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm, md (default), lg | Tier type and gap | Untitled sm / md; ChatGPT and Notion one size each |
| track | short (default), long | Long gives a wider pill thumb | Area composition |
| tone | neutral (default), custom | Product colour hook (`--area-switch-color`); the accent comes from the theme's Selection role (D1, 2026-09-29) | ChatGPT on is blue |
| labelPosition | end (default), start; fullWidth | Settings and menu rows put the switch at the end | ChatGPT settings row; Notion page-menu row |
| state | checked, disabled, read-only, loading | Native plus busy/read-only | Untitled: checked, disabled |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | Settings "Enable Dictation", on, rest and hover | chatgpt.com settings, logged in, 2026-09-26 | evidence only | `baseline/chatgpt--switch-on--rest--light`, `--hover--light` |
| notion | target product | Page-menu toggle, off: the switch alone and its 28px menu row | app.notion.com page menu (⋯), logged in, 2026-09-26 | evidence only | `notion--switch-off--rest--light`, `notion--menu-switch-off--rest--light` |
| uui | design system (source) | Toggle | `components/base/toggle/toggle.tsx:22-90` at `4702dc0` ([reference](../research/untitled-ui-reference.md)) | MIT | source reading only |
| area | this system | 21 gallery tiles (re-captured after the second pass) | localhost gallery | — | `area--*` (21) |

Not captured: ChatGPT off, Notion on, any Figma switch (none in the file browser, inspector
or main menu captured this session), hover in Notion, dark themes.

## Anatomy

```
chatgpt  button[role=switch] 32×20
  track  span rounded-full, fill rgb(58, 131, 247) (on); no edge
  thumb  span 16×16, 2px inset, 1px white border, shadow 0 1px 2px −1px rgba(0,0,0,.08)
notion   div 30×18 radius 44 (pill)
  track  div fill rgba(135,131,120,.3) (off); no edge, transparent hairline outline
  thumb  div 14×14 white at 2px inset, radius 44, no shadow
  input  opacity 0, covers the track
notion menu row  248×28, flex, gap 8: 20px icon at x 8, label 14/16.8, switch 8px from the end
area     label.area-switch  inline-flex, align flex-start, min-block 24, gap --_gap
  control  input[role=switch]  opacity 0, covers the whole label (hit area)
  track    span 1px --_edge, radius-full, --_off / --_on; centred on the first line
  thumb    span surface, shadow-1, (inset − border) from the track's padding edge
  text     label 14/20 + description 12/16 muted
```

Inset: 1px track border + 1px = the 2px thumb inset ChatGPT and Notion use (switch.css:10,
76-77). Width is `height + travel` (switch.css:5-6).

## Measurements

Read from the nodes. Composites on white are arithmetic, not captured.

| Node · property | Area sm | Area md | Area lg | Area long (md) | ChatGPT | Notion |
|---|---|---|---|---|---|---|
| track | 28 × 16 | 32 × 20 | 36 × 24 | 44 × 20 | 32 × 20 | 30 × 18 |
| thumb / inset | 12 / 2 | 16 / 2 | 20 / 2 | 24 × 16 / 2 | 16 / 2 | 14 / 2 |
| travel | 12 | 12 | 12 | 18 | 12 | 12 |
| off fill / edge | #d4d4d4 / 1px #e2e2e2 (before 2026-09-28; now #e2 / #e2) | | | | not captured | 30% warm grey (≈ rgb(219, 218, 215)) / none |
| off hover fill | #c5c5c5 (before 2026-09-28; now #d4) | | | | — | not captured |
| on fill | rgb(40) (neutral), rgb(92, 93, 254) (accent) | | | | rgb(58, 131, 247) | not captured |
| on hover | `neutral-solid-hover` (not captured) | | | | unchanged | — |
| thumb paint | #fff, `shadow-1` | | | | #fff, 1px white border, 8% shadow | #fff, no shadow |
| pressed thumb | 18 × 16 (+2) | | | | — | — |

Captures: `area--sizesm`, `area--sizemd`, `area--sizelg`, `area--long`, `area--default`,
`area--hover`, `area--active`, `area--checked`, `area--accent`, `chatgpt--switch-on--rest`,
`notion--switch-off`, `notion--menu-switch-off`.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| travel | **12px at every size** (`--_travel`, switch.css:5-6) | ChatGPT (32 − 16 − 4) and Notion (30 − 14 − 4) agree on 12 | Was width = 40 / 32 / 48 − 4, which gave 16px travel at md |
| track · md | **32 × 20**, thumb 16, inset 2 | ChatGPT 32 × 20, 16, 2 | Was 36 × 20 (Untitled sm) |
| track · sm / lg | **28 × 16 / 36 × 24** (switch.css:34-36) | Same 12px travel | Notion's 30 × 18 sits between sm and md; Untitled md 44 × 24 is longer |
| track · long | 2 × height + 4 (44 at md), thumb +8 (switch.css:38) | Area composition | — |
| on fill | `selection-solid` (switch.css:14), neutral by default | Owner 2026-09-26; emphasis roles 2026-09-29 | ChatGPT and Untitled use brand blue: a theme's Selection accent |
| on hover | `selection-solid-hover` (neutral #1d1d1d) | Untitled darkens on hover | ChatGPT does not change |
| off fill | **`edge-control` #e2e2e2, edge the same** (owner 2026-09-28: lighter); hover `edge-control-hover` #d4 (switch.css:20-22) | Notion's off track ≈ rgb(219, 218, 215); the one off-track grey shared with the Slider and Progress rails (audit S5) | Area is about one step darker than Notion; edge kept (third pass), see below |
| thumb | `bg-surface`, `shadow-1` | ChatGPT white thumb with an 8% shadow | Notion's thumb has no shadow |
| disabled | 50% on the whole label (switch.css:97) | Audit shared rule; Untitled 50% | — |
| read-only | **full paint, default cursor** (switch.css:98), in forced colours too (switch.css:121-123); changes blocked | Second pass, item 9; third pass for forced colours | Was the disabled 50%, which hid that the value is set |
| label gap | 6 at sm, md and lg, the density tokens (switch.css:13, :38, :40); compact sm 4 | Peer: Checkbox, Button (audit S14) | Was 4 / 8 / 8 |
| label alignment | track centred on the first 20px line (switch.css:65) | inset contract | ChatGPT centres on a two-line row; Notion centres in a 28px row |

**Settled in the third pass** ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)):

1. *Track edge: kept.* Neither ChatGPT nor Notion draws an edge on the track
   (`notion--switch-off`: transparent outline only). Area keeps 1px `edge-control`
   #e2e2e2 (switch.css:22, 69): the edge carries the contrast-more mix. Since the owner's
   2026-09-28 lightening it equals the off fill, so none shows.
2. *Forced colours: changed.* Read-only no longer paints like disabled (GrayText); only
   disabled greys (switch.css:121-123), matching the normal theme.

## States

| State | Changes | Evidence |
|---|---|---|
| hover | off `edge-control-hover` #d4, edge the same (switch.css:94); on `selection-solid-hover`; ink fixed | `area--hover` |
| pressed | thumb +2px wide, on the thumb's clock (`base` ease-in-out) | `area--active` |
| focus-visible | 2px `focus-color` outline, 2px offset, on the track | `area--focus` (outline rgb(65, 45, 208)) |
| checked | track and edge `--_on`; thumb `translate` 12px to the end, track and thumb on `base` ease-in-out (Motion, 2026-10-07) | `area--checked` (thumb x 2 → 14) |
| disabled | 50%, `not-allowed` cursor | `area--disabled`, `area--disabledchecked` |
| read-only | full paint, default cursor, no hover | `area--readonly` (no opacity) |
| loading | Spinner md after the track; changes blocked; `aria-busy`; `progress` cursor | `area--loading` |

## Behavior and accessibility

Native checkbox with `role="switch"` covering the label; controlled or uncontrolled with form
reset (Switch.tsx:44-57); `onCheckedChange(checked, event)` passes the change event (Switch.tsx:12). Read-only and loading block changes in `onChange`/`onClick`;
read-only sets `aria-readonly`. Thumb travel honours `data-area-motion="0"` and reduced
motion through the duration tokens (Motion, 2026-10-07). Forced colours: Highlight/Canvas paint; only disabled greys (switch.css:115-125).
Coarse pointers get a 44px minimum target (switch.css:114). Notion also keeps a native
input (opacity 0) over the drawn track.

## Peers and consistency

| Peer | Shared role | Area value in peer | Switch | Match / reason |
|---|---|---|---|---|
| Checkbox, Radio, Button | disabled | 50% whole control | same | match (audit) |
| Checkbox, Radio, Slider | on paint | `selection-solid` | same | match |
| Slider, Progress | off track / rail | `edge-control` #e2 (slider.css:29, display.css:265) | off fill #e2 | match (audit S5) |
| Checkbox, Radio | glyph edge | rest edge `edge-control-hover` #d4 | off fill #e2, hover #d4 | differs by design (audit S5): a track is a fill, a 16px glyph needs the firmer edge |
| Slider | thumb | surface, `shadow-1`, 16 at md | same | match |
| Checkbox | row type | 14/20 + 12/16 | same | match |
| Menu | trailing control in a row | 28px row (Notion) | 20px track | fits with 4px to spare |

## Visual pass

The gallery groups the tiles (Default, Variants, Tones,
Sizes, Layout, States, Behavior); the long track moved from Layout to Variants in the third
pass. Beside ChatGPT's 32 × 20 the md track now matches exactly;
beside Notion's 30 × 18 it is 2px longer and taller with the same travel. Read-only now
reads as set.

2026-09-28 (batch 14, Claude in Chrome): ChatGPT's settings switches (`chatgpt--switch-{off,on}--
{rest,hover}--light`): 32 × 20, off track 10% black (≈ #e6 on white), on #3a83f7, and hover
changes neither. Area's md track matches in size; its off fill #d4 is darker than both ChatGPT
(≈ #e6) and Notion (≈ #dbdad7): open for the owner (the fill is the shared toggle role and the
edge carries contrast). Owner: "lighten is better" → off track #e2 (was #d4), hover #d4 (was
#c5), edge equal to the fill so none shows. Unverified: dark theme.

## Verification

21 Area captures after the second pass read (tables above), plus 2 ChatGPT and 2 Notion
captures. Build and test results are in the
[cohesion audit](../research/cohesion-audit.md#verification).

## Motion and interaction, 2026-10-07

Contract: [`docs/MOTION.md`](../MOTION.md) (Switch thumb recipe).

| Interaction | Before | After |
|---|---|---|
| thumb travel | `inset-inline-start` over `slow` (250) ease-out | `translate` over `base` (150) `ease-in-out`; the end offset is `round(nearest, track − 2 × inset − thumb, 1px)` (12 at every short size; 16 / 20 / 12 on long md / lg / sm); `:dir(rtl)` flips the sign |
| track fill and edge on check | `background` over `fast` (100) ease-out; **the edge jumped** | `background-color` and `border-color` over `base` `ease-in-out`: the same clock as the thumb |
| hover | track fill and edge swapped, eased over `fast` with the check | a hover layer (`.area-switch__track::before`, the hover colour over the border box) lands at once (`opacity` 0s) and fades out over `fast` ease-out; its colour follows a check on the thumb's clock. One background could not be at once on hover and on the thumb's clock on check |
| press stretch (owner's, kept) | `inline-size` +2px over `fast` ease-out; the on-side offset via `inset-inline-start` | `inline-size` +2px on the thumb's clock (`base` ease-in-out); when on, the translate shortens by 2px so it grows toward the start |
| focus-visible | outline on the track | unchanged (rings never fade) |
| disabled, read-only, loading | no hover, no stretch | unchanged |
| reduced motion | `transition: none` on the thumb (own `@media` and `data-area-motion="0"` rules) | the rules are removed: the duration tokens are zero wherever motion is set (`emit/css.ts`), which now also stops the track and hover layer |

**Crispness.** The thumb rests on whole pixels: it is laid out once at the start inset and only
`translate` moves it, by a rounded length. Mid-travel frames are fractional, as any motion is.
The press stretch stays a layout width rather than `scale`: a 2px stretch of a 16px pill is
`scale` 1.125, which ovals the pill ends and would hold a non-identity scale for as long as the
pointer is down (MOTION.md "Crispness" 1). The thumb's `shadow-1` keeps its 0.5px offset
(token, B12 in the crispness research).

**Verified** (`/switch.html` and probes, Chromium, DPR 2): thumb start 2 / end gap 2 at sm, md,
lg, short and long, on and off, RTL on and off; pressed md 18 wide, ends 2px from the far edge
when on; `translate` computes `0px` / `12px`; the hover layer is `opacity 1` under `data-hover`
and 0 when disabled, `#d4` off and `#1d` on; one click starts track `background-color`,
the four `border-*-color`s, the layer's `background-color` and the thumb's `translate`, all
150ms `cubic-bezier(0.65, 0, 0.35, 1)`. Not verified by eye (background tab), nor with a real
pointer press.

**Open questions.**
1. The press stretch animates `inline-size`, which MOTION.md lists under "never". Recommendation:
   keep it (2px, absolutely positioned, no sibling layout) and amend the recipe to allow the
   stretch; the alternative is to drop the stretch.
2. Hover adds a layer (`::before`) to the track. Recommendation: keep; the alternative is a
   hover that fades in over `base` with the check.

## Feedback log

- 2026-09-28 · owner approved batch 14 → Complete.

- 2026-09-28 · owner: lighten the off track → `--_off` = `edge-control` (#e2, contrast-more mix
  kept), hover `edge-control-hover` (#d4), track edge follows the fill (checked hover too).
  `fill-toggle` is unchanged for Slider and the other shared users.

- 2026-09-26 · cohesion audit → disabled dims to 50% and keeps the on fill (was a grey
  track) → `area--disabledchecked` (opacity 0.5, fill rgb(40)).
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → 12px travel at
  every size (tracks 28 / 32 / 36, were 28 / 36 / 44); read-only at full paint with a
  default cursor; track-edge and forced-colours read-only recorded as open →
  `notion--switch-off--rest--light`, `notion--menu-switch-off--rest--light`,
  `baseline/chatgpt--switch-on--rest--light`, `area--sizemd`, `area--readonly`.
- 2026-09-27 · third pass → forced colours no longer grey read-only (only disabled); track
  edge kept → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · owner: brighter green → the `custom` tile uses green 500 (#01aa4e; hover 550), 3.06:1 on white for the track and for the white thumb on it (success solid, #00853c, was 4.75:1) → headless Chromium.
- 2026-09-30 · audit S5 (owner) → no Switch change; its off track #e2 is now the one off-track grey, shared by the Slider and Progress rails; Checkbox and Radio keep #d4 as the glyph edge → slider.css:29, display.css:265.
- 2026-09-30 · audit S14 (owner) → the track-to-label gap is 6 at sm, md and lg (was 4 / 8 / 8), from the density tokens (switch.css:13, :38, :40; density.ts:80-82).
- 2026-09-30 · audit S17 (API vocabulary, slice 1) → `onCheckedChange(checked, event)` now passes the change event, as Checkbox → Switch.tsx:12.
- 2026-10-01 · owner (audit H-13): the `tone` axis is removed; `--area-switch-color` and `--area-switch-color-hover` set a custom on colour on any Switch (the `custom` tile keeps green 500 through the hook). The React `tone` prop is a deprecated no-op.
- 2026-10-03 · one corner setting (owner: one radius setting, Sharp and Pill as ends; "every control is a pill") → a pill by default; `pill={false}` (`--rounded`) takes the setting's corner for the track's height, the thumb concentric (track − inset, floored) (`switch.css`, `Switch.tsx`). `docs/research/radius-audit-2026-10-03.md`, "One corner setting".
- 2026-10-04 · pill shapes and list rows (owner) → the pill is the `switch` entry of data-area-pills (default on); `pill` three-way (`switch.css`). `docs/research/radius-audit-2026-10-03.md`, "Pill shapes and list rows".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → thumb slides by a whole-pixel `translate` on `base` ease-in-out (was `inset-inline-start` over `slow`), track fill and edge on the same clock (the edge used to jump), hover through a layer that lands at once and fades over `fast`, press stretch kept on the same clock (`switch.css`; "Motion and interaction, 2026-10-07").
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → disabled reads `opacity-disabled` (was an unset `--_disabled-opacity` hook with a literal 0.5 fallback) (switch.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · type size and density split (owner: "the switches/toggles look to be the same size for everything") → the track reads `--area-mark-toggle`, a check box plus 4: 18 at type 12–13, 20 at 14, 22 at 15, 24 at 16 (`switch.css`; was `mark-md`, 20 at every size). `docs/research/ui-size-scale-2026-10-12.md`.
