# Tooltip spec

**Status:** accepted · 2026-09-25 (first pass under the capture workflow)
**Captures:** `docs/research/captures/tooltip/`
**Peers:** Kbd (shortcut inside), Popover (interactive overlay), Button (trigger), Toast
(inverse vs surface annotation)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Tooltip omits its
  indicator by default; `arrow` opts into an 8px diamond with a 2px radius on only its
  exposed tip. The gallery shows default, indicator, shortcut and side compositions
  separately. Tooltip is a non-focusable hover/focus description; rich interactive
  content belongs in Popover.
- 2026-09-25: Tooltip is the next component after Badge group was approved.
- 2026-09-25: rounder tooltips, like ChatGPT's. Adopted the recommendation: a pill at every
  radius preset (as Badge), capped at half a single line's height.
- 2026-09-25: "ChatGPT isn't fully round; I like more padding on the text sides." Measured
  live: ChatGPT is a pill by geometry (16px radius on 30px, `corner-shape: superellipse(1)`,
  which is the standard round corner); its calmer look comes from 12px text sides. Text
  sides moved to 12px.
- 2026-09-25: "slightly less than a pill; not pill, not too sharp; choose the value." 10px
  (`radius-control-lg`), following the radius preset again.
- 2026-09-25: 12px text sides are too much; 10px.

## Job and boundaries

Tooltip names or briefly describes a control on hover or focus, optionally with its
keyboard shortcut. It holds no interactive content (Popover does) and no status (Toast).

The Area component is the visual surface (`role="tooltip"`, sides, arrow). With a `trigger`
it shows on hover after 500ms (`delay`) and at once on keyboard focus, hides on Escape, press,
blur or pointer leave (after `closeDelay`, default 0), stays while hovered, and anchors and flips (2026-09-27; see
[overlay behavior](overlay.md)).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| side | top, right, bottom, left | Placement around the trigger | All three products place tooltips by available space |
| arrow | off (default), on | Owner: opt-in | Figma draws an arrow; ChatGPT and Notion do not |
| composition | label + shortcut | Name a command and its key | ChatGPT (inline chip), Notion (second line) |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | Sidebar toggle (label + shortcut chip); top-right icon (label only) | chatgpt.com home, logged in (Edge), 2026-09-25 | evidence only | `chatgpt--shortcut--rest--light`, `chatgpt--plain--rest--light` |
| notion | target product | Inbox button (label with the shortcut on a second line) | app.notion.com sidebar, logged in (Edge), 2026-09-25 | evidence only | `notion--shortcut-stacked--rest--light` |
| figma | target product | Notifications bell | figma.com/files, logged in (Edge), 2026-09-25 | evidence only | computed-style readout only (see below) |
| area | this system | The six gallery tiles, before and after this pass | localhost gallery | — | `before/area--*` (6), `area--*` (6) |

**Figma** showed its tooltip once; the computed styles were read then (223 × 24, padding
4/8, radius 5, 11px/16px weight 450, letter-spacing 0.055px, fill rgb(30, 30, 30), ink
white, shadow beginning `rgba(0,0,0,.15) 0 0 .5px 0, rgba(0,0,0,.13) 0 5px 12px`, an up
arrow). It did not reappear on re-hover or on other controls in the background browser
window, so no capture file was saved. Design-system references were not needed: the three
products cover every property in this pass.

## Anatomy

```
chatgpt   div[role=tooltip] 1px border (white 5%), padding 5/12, radius 16, fill rgb(13)
  row     flex, gap 8
    text  14/18 600, letter-spacing −0.15px
    kbd   18px chip, radius 8, fill white 25%, 6px sides, −7px end margin (sits 6px from the edge)
notion    div, padding 5/8, radius 6, fill rgb(44, 44, 43), inset 1px white-5% ring
  text    12/16.8 400 ink rgb(240, 239, 237)
  kbd     second line, ink rgb(173, 169, 163)
figma     div, padding 4/8, radius 5, fill rgb(30), 11/16 450, arrow
area      div.area-tooltip, padding 4/10 (4 at a trailing Kbd), radius 10, fill bg-inverse, 14/20 400
  kbd     .area-kbd on-emphasis, 20px, radius = tooltip radius − 4
```

Inset equation: shell padding 4 (block) + cap-trimmed 20px text = 28px; the Kbd is 20px and
centred by construction ((28 − 20) / 2 = 4).

## Measurements

`node scripts/capture-compare.mjs` (Area before, Area after, ChatGPT plain, Notion):

| slot · property | area before | area after | chatgpt plain | notion shortcut-stacked |
|---|---|---|---|---|
| **shell** size | 89.13 × 28 | 89.13 × 28 | 130.02 × 30 | 47.55 × 43.58 |
| **shell** padding | 4 8 4 8 | 4 8 4 8 | 5 12 5 12 | 5 8 5 8 |
| **shell** border | 0 | 0 | 1 solid white 5% | 0 |
| **shell** radius | 8px | 6px (first change; now 14px) | 16px | 6px |
| **shell** font | 14px/20px 400 Geist | 14px/20px 400 Geist | 14px/18px 600 | 12px/16.8px 400 |
| **shell** color | rgb(250, 250, 250) | rgb(250, 250, 250) | rgb(255, 255, 255) | rgb(240, 239, 237) |
| **shell** background | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(13, 13, 13) | rgb(44, 44, 43) |
| **shell** shadow | rgba(0,0,0,.06) 0 1px 2px −0.5px | rgba(0,0,0,.06) 0 4px 12px −2px | rgba(15,23,42,.2) 0 8px 18px | rgba(0,0,0,.08) 0 4px 12px −2px + inset white 5% ring |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| shell · height | 28 (single line) | Products 24 (Figma), 27 (Notion), 30 (ChatGPT) | — |
| shell · padding | 4 block; **10 on text sides**; 4 beside a trailing Kbd | Owner (2026-09-25): more than 8, less than ChatGPT's 12 (13 with its border) | Was 8 (Notion, Figma); 12 tried and judged too much. The equal inset beside a Kbd keeps Area's rule |
| shell · radius | **10** (`radius-control-lg` at Standard), capped at half a line | Owner (2026-09-25): "rounder but not quite pill, not too sharp"; value chosen by Claude on request | Between controls (8) and popovers (12), so a tooltip reads as its own floating label; a pill (14) was tried and rejected. The nested Kbd lands on its own 6px. Follows the radius preset (Sharp 0 … Round 12, Rotund 14) |
| text · size | 14/20 | ChatGPT and Figma set tooltips at their body size (14, 11); Area's body is 14 | Notion uses 12 under a 14 body |
| text · weight | 400 | Type ramp (500 is reserved for labels on fills and selected states); Notion 400 | ChatGPT 600, Figma 450 |
| shell · fill / ink | `bg-inverse` rgb(40) / `fg-on-inverse` | Products rgb(13), rgb(44), rgb(30) | Within the range; semantic role kept |
| shell · shadow | **0 4px 12px −2px** `shadow-color` | Target-product agreement on a ~12px blur, 4–8px down; Notion's geometry | Was `shadow-2` (1px). Colour stays theme-aware (6% / 8%) rather than Notion's 8% literal. Tooltip keeps this smaller lift as a documented exception to `--area-shadow-float` (audit S10; surface.css:1225) |
| shell · ring | none | — | ChatGPT and Notion add a 1px white-5% ring so their dark tooltips separate from dark pages. Area's tooltip inverts in dark theme, so the ring has no job |
| kbd · layout | inline, 20px, radius = tooltip shape − 4 = 6 (Kbd's own radius) | ChatGPT inline chip (18px, radius 8); inset rule | Notion stacks the shortcut on a second line |
| max width | 288 | ChatGPT 320, Notion 300 | — |
| arrow | opt-in 8px diamond | Owner; Figma | — |

## States

With a trigger: closed, delayed open (500ms), open, closing. See [overlay behavior](overlay.md).

## Behavior and accessibility

`role="tooltip"`; the trigger points to it with `aria-describedby`. Not focusable. Forced
colours draw a 1px `CanvasText` edge, since the fill and shadow are dropped (forced-colors.css:72,
audit E-10); RTL follows the logical properties in `surface.css`.
Hover intent is shared with Hover card through `useHoverIntent` (overlay.ts:108-145): a mouse or pen opens after the delay, touch never (a tap activates the trigger); keyboard focus (`:focus-visible`) opens at once; blur closes at once; Escape is one handler in the capture phase on `window` that consumes the event, so the Popover or modal Dialog underneath stays open (audit E-18 A, owner 2026-09-30; Tooltip used to open for the mouse only).

## Peers and consistency

| Peer | Shared role | Peer value | Tooltip | Match |
|---|---|---|---|---|
| Kbd on-emphasis | nested chip | 20px, radius 6 (`radius-control-sm`, kbd.css) | 20px, 4 block inset at a trailing Kbd | inset rule; the keycap keeps its own 6px corner |
| Popover | overlay lift | container radius, `--area-shadow-float` (20/24 + 5/8) | radius 10, 0 4px 12px −2px | a tooltip is smaller; its own lift (audit S10 exception) |

## Visual pass

Pass reviews were removed at the owner's request; the family is inspected in the grouped
gallery. The earlier before/after review compared radius (10px), text sides (10px), wrapped
text and shadow at 1× and 3×. Gallery after: every tile 10px radius on 28px with 10px text
sides; the Kbd 6px on 20px, 4px from the edge; a two-line tooltip 10px on 48px.

2026-09-28 (batch 17), live in Claude in Chrome: ChatGPT's sidebar-toggle tooltip re-measured
matches `chatgpt--shortcut--rest--light` exactly (171.92 × 30, 5/12 padding, corner 16, 14/18 600
on rgb(13), a 1px white-5% ring, 0 8 18 at 20%, inline keycap 18 tall, corner 8, 8 gap), so no
new file was saved. Area keeps its documented differences (28 tall, corner 10, 14/20 400 on
`bg-inverse`, no ring). No change.

## Verification

- ChatGPT 2 and Notion 1 captures; 6 Area captures before and 6 after; checksums verified.
- `build:docs` (docs audit), `typecheck`, `test:badge` (9), `test:contracts` (14),
  `test:preview` (4), `npm test` (tokens and contrast), `git diff --check`: all pass.
- Unverified: Figma capture file, dark theme. Hover/focus behaviour is implemented (2026-09-27, [overlay.md](overlay.md)); its timing has not been owner-reviewed (the batch 17 pass compared static paint).

## Feedback log

- 2026-09-25 · owner chose Tooltip after approving Badge group → radius 6, 12px-blur
  shadow → 6 Area captures after.
- 2026-09-25 · owner: "12px is too much" → text sides 10px → 6 captures re-taken.
- 2026-09-25 · owner: "rounder but not quite pill; you choose" → 10px (radius-control-lg), Kbd
  6px, review rows retitled → 6 captures re-taken (10px).
- 2026-09-25 · owner: "ChatGPT isn't fully round; more padding on the text sides" → live
  check (pill, superellipse(1) = round) and text sides 8 → 12px, Kbd side 4px; review row
  "Text sides 8 → 12px"; review rows now wrap instead of clipping → 6 captures re-taken.
- 2026-09-25 · owner: "I don't mind rounder tooltips; ChatGPT's are pretty round" → pill
  capped at half a line (14px), Kbd a pill by the inset rule, wrapped-text review row →
  6 Area captures re-taken (14px).
- 2026-09-25 · owner approved Tooltip with 10px text sides → Complete in `component-status.mjs`.
- 2026-09-27 · third pass → Pass review note replaced: the family is inspected in the grouped
  gallery → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-30 · audit S10 (owner) → no change; Tooltip keeps its own 0 4px 12px −2px lift as a documented exception to the shared `--area-shadow-float` (surface.css:1225).
- 2026-09-30 · audit S17 (API vocabulary, slice 1) → `closeDelay` added (default 0) beside `delay` (500), Hover card's name → `primitives.tsx:999`.
- 2026-10-01 · audit E-18 (owner pick A) → Tooltip and Hover card share `useHoverIntent`: mouse and pen open after the delay (was mouse only), touch never, `:focus-visible` at once, blur closes at once, one consuming capture-phase Escape → overlay.ts:108-145, Overlays.tsx:214-234.
- 2026-10-02 · compact evidence audit → compact sides 10 → 8 (VS Code 9, Figma 8) and corner 8 → 4, the sm control corner of its 24 box (VS Code 3, Figma 5); default unchanged (R2, R3) docs/research/compact-evidence-2026-10-02/README.md.
