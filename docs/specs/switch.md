# Switch spec

**Captures:** `docs/research/captures/switch/` (Area, Notion),
`docs/research/captures/baseline/chatgpt--switch-on--*`
**Peers:** Checkbox and Radio (choice paint, disabled), Slider (thumb), Spinner (loading),
Field, Menu and settings rows

## Owner decisions

- 2026-09-26: **Neutral by default, accent by override** (DESIGN_SYSTEM.md, "Color and
  focus"). Switch already followed it: on is `neutral-solid`, `tone="accent"` or
  `tone="custom"` (`--area-switch-color`) opt out. *Superseded 2026-09-29 (owner, D1): on is
  the Selection role (`selection-solid`), accent by theme; `tone="accent"` was removed and
  `tone` is neutral or custom.* — superseded 2026-10-01: the `tone` axis was removed (audit
  H-13); `--area-switch-color` sets a custom on colour on any Switch.
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
| size | sm, md (default), lg | Tier type and gap; the track follows the type size: md is `--area-mark-toggle`, sm and lg 4 either side (2026-10-14) | Untitled sm / md; ChatGPT and Notion one size each |
| track | short (default), long | Long gives a wider pill thumb | Area composition |
| labelPosition | end (default), start; fullWidth | Settings and menu rows put the switch at the end | ChatGPT settings row; Notion page-menu row |
| shape | pill while `data-area-pills` lists `switch` (default); `pill` forces it, `pill={false}` (`--rounded`) takes the radius setting's corner | One corner setting (2026-10-03, 2026-10-04) | Area composition |
| state | checked, disabled, read-only, loading | Native plus busy/read-only | Untitled: checked, disabled |

No tone axis (owner, audit H-13, 2026-10-01): the on colour is the theme's Selection role, and
`--area-switch-color` / `--area-switch-color-hover` set a custom one on any Switch (switch.css:20-21).
The React `tone` prop is deprecated and ignored (Switch.tsx:13-15).

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
  track    span 1px --_edge, --_track-radius (pill by default), --_off / --_on; centred on the first line
  thumb    span surface, shadow-control (+ contrast ring); inline (inset − border) from the
           track's padding edge, centred on the track's height
  text     label 13/18 + description 13/18 muted (the label's size, plan A9.3)
```

Inset: 1px track border + 1px = the 2px thumb inset ChatGPT and Notion use (switch.css:15,
114-116). Width is `height + travel` (switch.css:8-9); height is `--area-mark-toggle` at md
(switch.css:12, 50).

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
| travel | **12px at every size at type 13**, two thirds of the type's toggle track at every type (`--_travel`: 12 / 13 / 15 / 16 at types 14-16; "Settings pass, 2026-11-21") | ChatGPT (32 − 16 − 4) and Notion (30 − 14 − 4) agree on 12 | Was width = 40 / 32 / 48 − 4, which gave 16px travel at md |
| track · md | **`--area-mark-toggle` tall** (18 at type 12–13, 20 at 14, 22 at 15, 24 at 16), width height + 12; **32 × 20** at type 14, thumb 16, inset 2 (switch.css:12, 50) | ChatGPT 32 × 20, 16, 2 | Was 36 × 20 (Untitled sm); was 20 at every type size until 2026-10-12 / 10-14 |
| track · sm / lg | mark-toggle − 4 / + 4: **28 × 16 / 36 × 24** at type 14 (switch.css:49, 51) | Same 12px travel | Notion's 30 × 18 sits between sm and md; Untitled md 44 × 24 is longer |
| track · long | 2 × height + 4 (44 at md, type 14), thumb +8 (switch.css:54) | Area composition | — |
| on fill | `selection-solid`, or `--area-switch-color` when set (switch.css:20) | Owner 2026-09-26; emphasis roles 2026-09-29; audit H-13 | ChatGPT and Untitled use brand blue: a theme's Selection accent |
| on hover | `selection-solid-hover` (neutral #1d1d1d), or `--area-switch-color-hover` (switch.css:21) | Untitled darkens on hover | ChatGPT does not change |
| off fill | **`fill-track` #e2, edge `edge-control`, equal so none shows** (owner 2026-09-28: lighter); hover `fill-track-hover` #d4 (switch.css:27-29). Contrast More keeps the fill and outlines instead: strong edge, and a 1px `stroke-control` ring on an off thumb (switch.css:30; owner 2026-10-18) | Notion's off track ≈ rgb(219, 218, 215); the one off-track grey shared with the Slider and Progress rails (audit S5) | Area is about one step darker than Notion; edge kept (third pass), see below |
| thumb | `bg-surface`, `shadow-control` plus the contrast ring (switch.css:120-121); centred on the track's height (switch.css:114-115; owner 2026-10-19) | ChatGPT white thumb with an 8% shadow | Notion's thumb has no shadow |
| disabled | `opacity-disabled` (50%) on the whole label (switch.css:154) | Audit shared rule; Untitled 50% | — |
| read-only | **full paint, default cursor** (switch.css:155), in forced colours too (switch.css:178-180); changes blocked | Second pass, item 9; third pass for forced colours | Was the disabled 50%, which hid that the value is set |
| label gap | `gap-sm` / `gap-md` / `gap-lg`, the density tokens: 6 at sm, md and lg (switch.css:18, 49, 51); compact sm 4 | Peer: Checkbox, Button (audit S14) | Was 4 / 8 / 8 |
| label alignment | track centred on the first line (`margin-block-start`, switch.css:78) | inset contract | ChatGPT centres on a two-line row; Notion centres in a 28px row |

**Settled in the third pass** ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)):

1. *Track edge: kept.* Neither ChatGPT nor Notion draws an edge on the track
   (`notion--switch-off`: transparent outline only). Area keeps 1px `edge-control`
   #e2e2e2 (switch.css:29, 79): the edge carries the contrast-more mix. Since the owner's
   2026-09-28 lightening it equals the off fill, so none shows.
2. *Forced colours: changed.* Read-only no longer paints like disabled (GrayText); only
   disabled greys (switch.css:178-180), matching the normal theme.

## States

| State | Changes | Evidence |
|---|---|---|
| hover | a layer over the track: off `fill-track-hover` #d4, edge included; on `--_on-hover`; lands at once, fades out over `fast` (switch.css:95-105, 144-145); ink fixed | `area--hover` |
| pressed | thumb +2px wide, on the thumb's clock (`base` ease-in-out) | `area--active` |
| focus-visible | 2px `focus-color` outline, 2px offset, on the track | `area--focus` (outline rgb(65, 45, 208)) |
| checked | track and edge `--_on`; thumb `translate` 12px to the end, track and thumb on `base` ease-in-out (Motion, 2026-10-07) | `area--checked` (thumb x 2 → 14) |
| disabled | `opacity-disabled` (50%), `not-allowed` cursor; the thumb keeps its own shadow under a Material (2026-10-18) | `area--disabled`, `area--disabledchecked` |
| read-only | full paint, default cursor, no hover | `area--readonly` (no opacity) |
| loading | Spinner md after the track; changes blocked; `aria-busy`; `progress` cursor | `area--loading` |

## Behavior and accessibility

Native checkbox with `role="switch"` covering the label; controlled or uncontrolled with form
reset (Switch.tsx:52-64); `onCheckedChange(checked, event)` passes the change event (Switch.tsx:17). Read-only and loading block changes in `onChange`/`onClick`;
read-only sets `aria-readonly`. Thumb travel honours `data-area-motion="0"` and reduced
motion through the duration tokens (Motion, 2026-10-07). Forced colours: Highlight/Canvas paint; only disabled greys (switch.css:172-183).
Coarse pointers get a 44px minimum target (switch.css:171). A display-only track takes its state
from `data-checked` on the track (a menu's checkable row; switch.css:141-143). Notion also keeps a native
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

- 2026-10-27 · owner: "is the toggle the correct size?" → in a panel a switch row is a small control tall (26 at the app's scale) at any switch size; the Inspector's Brand colours switch is md, 30 × 18 (Notion's 30 × 18; ChatGPT 32 × 20), where sm drew 26 × 14, smaller than both.
- 2026-10-27 · owner: "fine tune the spacing ... of everything in this panel" → a full-width switch row in a panel, without a description, is a settings row: as tall as a control of its size (26 at sm), centred, its label in a horizontal Field label's muted ink (was the body ink, the one bright row name in the Inspector) (switch.css). Back in review.
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
- 2026-10-14 · all-axis audit → the track now follows the type size at every size: the `--sm` / `--md` / `--lg` classes set the fixed marks 16 / 20 / 24 and overrode the 2026-10-12 base rule, so every Switch stayed 20 tall (and hung 2px above its line at type 12). md reads `--area-mark-toggle`, sm and lg 4 either side; type 14 is unchanged → switch.css.
- 2026-10-18 · owner: under Contrast More "the switch component circle looks off" (a #83 slab with a white thumb) → the off track keeps the rail's fill (`fill-track`, #e2; hover `fill-track-hover`, #d4) at every contrast level; More outlines instead, as macOS Increase Contrast: the track's edge is the strong stroke and an off thumb gets a 1px `stroke-control` ring (`--_thumb-ring`, eased on the thumb's clock; none when on, where the white thumb holds 3:1 on the solid). Under a Material the thumb's shadow comes from `--_m-own`, which lists the ring too since 2026-10-18 (switch.css; material.css; CONTRAST.md).
- 2026-10-18 · Elevation and Stroke audit (docs/research/elevation-stroke-2026-10-18, "Audit: Area today") → under a Material a disabled switch's thumb dropped its `shadow-control` lift with the material (`box-shadow: none`); it now keeps its own shadow (`--_m-rest`: the control lift and the contrast ring) and drops only the material. The thumb's material shadow lists the ring too, so More contrast outlines the off thumb under a material as without one. Checked in the app, light and dark, Glass, Standard and More.
- 2026-10-19 · owner (Language's Motion tiles, drawn at 0.8x): "the circle is too high in the track" → the thumb was set
  down a fixed 1 from the track's padding edge; at a fractional scale the 1px edge snaps to device pixels and the
  offset does not, so it sat 1.3 under the top and 1.9 over the bottom at 0.8x (2 / 2 at 1x). It is now centred on the
  track's height (`inset-block: 0; margin-block: auto`): the same 2 at 1x, equal gaps at any scale or browser zoom.
- 2026-11-14 · plan B7.10 → unchanged paint (read-only already kept full paint and no hover or press); the behaviour suite `states` now asserts that it is focusable, announced and unchanged. Forced colours: a disabled label is GrayText. Why: docs/research/system-evaluation-2026-11-11 (README §5, phase2/disabled.md); the owner took every recommendation on 2026-11-11.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.

## Review note, 2026-11-06 (balance pass; owner: "Keep it")

- **What changed:** a description joins its label as the next line: the 12/16 line sits 7.7 under the 13/18 label's
  baseline, its own line gap (7.4). It sat 2 below (9.7), 2.3 off its own line. A group's legend and its description
  join the same way.
- **Why:** the owner's balance pass ("no spacing logic between the title and the text … make sure all of this is
  intentional"): a gap near a line's own spacing but not on it reads as no decision. File tile's meta already joined at
  7.7. DESIGN_SYSTEM.md, "Text pairs"; `docs/research/title-balance-2026-11-06`.

## Review note, 2026-11-11 (type rules, plan A9)

- **What changed:** the description joins the label at the label's size in the muted ink (13/18 at md), the same setting as a Setting row's 13 over 13; it was 12/16 (plan A9.3, owner 2026-11-11).
- **Why:** the system evaluation's type rules (docs/research/system-evaluation-2026-11-11, section 5, A9), owner-approved
  2026-11-11; the rules are in DESIGN_SYSTEM.md ("Ink and weight", "Size and shape", "Text pairs") and the type skill.

## Review note, 2026-11-11 (focus and targets, plan A6, A11.2)

- **What changed:** On, the track is the ring's own colour: the ring stands off by `focus-gap` (A6.1).
- **Why:** the system evaluation's focus, forced colours and hit target items (docs/research/system-evaluation-2026-11-11, section 5), owner-approved 2026-11-11; the rules are in DESIGN_SYSTEM.md ("The focus ring", "Targets") and CONTRAST.md (Focus).

## Shared parts (plan B2), 2026-11-13

- **Centring (B2.2, VA2).** The words centre their cap on the track: the track sits at the box's top and the text column is set (track − 1cap) / 2 down, the label trimmed at its start (both ends when it is alone) and a description trimmed at its end, as Checkbox and Radio do. The label sat 0.62 above the track's centre on every tile. The track's `(leading − track) / 2` margin is gone.
- **Target (B2.5, VA3).** The box is the track's (or the text's) height; the 24 target (44 under a coarse pointer) is the native control's, centred on the box and out of flow. A Switch in a row (Setting row, a Panel) now keeps the row's centre: its track drew at the top of a 24 box, 3 above the line a Select beside it centred on. A Switch alone is 18 tall at type 13 (was 24).

## Sizes beside Checkbox, Radio and Switch (plan B8.1), 2026-11-14

The three choices share one box ladder (`mark-box`, then 4 and 8 more: 14 / 18 / 22 at type 13), matched by what the
hand marks: a Switch's thumb is a Checkbox's and a Radio's box at the same size name (md 14, lg 18), its track the thumb
plus its 2 inset round it. So Checkbox and Radio offer md and lg, and Switch sm, md and lg: Switch's sm is a 14 track
(a 10 thumb) for a dense row; the choices' sm was removed on 2026-09-28, when it differed from md only by its label gap.
In a dense row, a Checkbox md and a Switch sm stand one height (14). No size is added (COMPONENTS.md, Boundaries).

### 2026-11-14 · Shared parts, leftovers (system plan, Phase 2, wave 3)

- A pill is one value: while the Pills set rounds it, its corner is `radius-full` itself, `max(corner, flag × full)`, never the corner plus full (it computed 10003px and 10005px; the thumb 10001px and 10003px). Draws the same; the corners snapshot records 9999px.
- The thumb lists the flag too, so it is `radius-full` at a pill.
- Why: docs/research/system-evaluation-2026-11-11 (plan B6.1, B6.5, B8.2, B2.2; README §5, phase2/leftovers.md); the owner took every recommendation on 2026-11-11. Fix the rule, not the instance.
- Verdict: awaiting the owner.

## Settings pass, 2026-11-21 (step C: icon weight and size tiers)

From docs/research/system-status-2026-11-18 (section 3, step C1–C2). At the shipped defaults (type 13, density 32) nothing moves: every box, mask and stroke measured the same before and after, and 2x screenshots of every part are pixel-identical in light and dark.

### Sizes

The thumb's travel was 12 at every size and type, so the track grew squatter as the type made it taller (36 × 24 at
type 16). It is now two thirds of the type's toggle track (`mark-toggle`), whole pixels: 12 at types 12-13, 13 at 14, 15
at 15, 16 at 16, every tier alike (sm and lg tracks are 4 either side of the toggle; their travel is the same). md is
30 × 18 at the defaults as before, 40 × 24 at type 16.

- **Open (owner):** the 2/3 is Notion's 30 × 18 proportion; ChatGPT's 32 × 20 is 0.6. `icon-xs` (12, 16 at type 16)
  was the role equal to 12 at the defaults, but it jumps only at type 16.

## Review note, 2026-11-21

- **What changed:** the switch keeps its shape at every type size: its thumb travels further on the taller tracks.
- **Why:** the travel was fixed, so at type 16 the switch looked stubby next to its peers.
