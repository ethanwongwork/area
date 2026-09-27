# Popover spec

**Status:** in review · 2026-09-26 (cohesion audit, second pass)
**Captures:** `docs/research/captures/popover/`
**Peers:** Menu (same surface rule), Dialog and Toast (floating lift), Tooltip (hover label),
Calendar and ColorPicker (popover content), Button (header close, footer actions)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Popover uses Tooltip's
  medium UI type and shadow-2, with a 12px border-inclusive outer inset. It uses the theme
  surface (white in light, dark in dark mode). Its preferred width is 240px, capped at its
  container for every composition. Group gaps are 12px with 8px inside the body. A
  small-control-height header contains the title and close button, without negative
  margins or trimmed title line boxes. Description leading is UI leading minus 2px
  (14/18px at default density). Examples omit pointers and share optional media, header,
  body and optional footer slots. Media corners subtract the inset and border from the
  outer radius. The optional decorative SVG pointer has a curved outline and supports all
  four sides. See [WAI Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) and
  [Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover). The existing
  Popover API supplies the surface; consumers still own trigger, positioning, focus and
  dismissal behavior.
- 2026-09-26: Decide every open item with the most calculated option consistent with the
  system ([second pass](../research/cohesion-audit.md#second-pass-notion-figma-and-the-open-decisions)).
  The shared floating lift (which replaced `shadow-2` in the cohesion audit) is kept; the
  Share popover confirms Notion's geometry.

## Job and boundaries

Popover floats rich, interactive content (a title, text, a field, media, actions) beside
the element that opened it. Tooltip names a control and holds nothing interactive; Menu
lists actions; Dialog interrupts. Positioning, focus and dismissal are the consumer's; a
`[popover]` element keeps its native closed state and top layer (`surface.css:435-436`).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| side | top (default), right, bottom, left | Placement of the optional pointer | Owner (four sides) |
| arrow | off (default), on | Decorative pointer | Owner; Notion's Share and date popovers and Figma's picker draw none |
| composition | teaching step, field, image | Header, body, media, footer slots | Owner; Notion Share popover: tabs, field, list, footer rows |

Gallery groups (`apps/docs/scripts/build.mjs:408-415`): Default (teaching step); Content
(with field, image); Layout (arrow, side left, side right). The side tiles were added after
the Area capture run and have no capture yet.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | Share popover open (tabs, invite field, access list, footer); date filter popover (older) | app.notion.com page Share popover, 2026-09-26 (second pass); Calendar pass | evidence only | `popover/notion--share-popover--open--light`, `calendar/notion--search-date-filter-popover--rest--light` |
| figma | target product | Colour picker surface; editor main menu surface | figma.com (ColorPicker pass; second pass) | evidence only | `color-picker/figma--solid-layer-fill--rest--light` (values in BASELINE), `menu/figma--main-menu--open--light` |
| chatgpt | target product | Menu surface (nearest floating surface) | chatgpt.com, owner's session, 2026-09-26 | evidence only | `baseline/chatgpt--menu--rest--light` |
| uui | design system (source) | Select popover and dropdown (no general popover) | [reference](../research/untitled-ui-reference.md), `popover.tsx:15-30` @ `4702dc0` | MIT | — |
| area | this system | 4 gallery tiles after the second pass | localhost gallery | — | `popover/area--*` (4) |

Light theme only.

## Anatomy

```
notion share  div[role=dialog] 456 wide, radius 12, white, lift + 1px rgba(42,28,0,.07) ring
  tabs    40.55 row, tab list at 12, hairline below, 16 below that         (nodes 4-6)
  field   row padding 0 16 8 16 (content inset 16)                         (node 10)
  list    padding 12 8 8 8; group label 12/16 500 rgb(125, 122, 117), padding 0 8 4 8 (nodes 18-19)
  footer  rows padding 12, top rule 0.56px rgb(240, 239, 237)              (nodes 21-23)
notion date  248 wide, radius 10, same lift and ring; sections padding 4
figma   picker 240 wide, radius 13, white, no border; 40px header
area    div.area-popover grid, padding 11 + 1px border, radius 12, gap 12, 240 wide (≤ 100%)
  header  .area-popover__header min 28 (control-sm): h2 title 14/20 400 + sm ghost close
  body    .area-popover__body grid gap 8; description 14/18 fg-muted
  media   .area-popover__media 5:2, radius max(0, 12 − 11 − 1) = 0 at Standard
  footer  .area-popover__footer end-aligned; first child pushed to the start
  arrow   svg 32 × 14 curved shoulder, surface fill, decorative stroke
```

Inset equation: 1 border + 11 padding = 12 to every slot (`area--teaching`: header at 12, 12).
The 28px close button ends 12 from the edge; the header row is its height.

## Measurements

`node scripts/capture-compare.mjs --slots shell popover/area--{teaching,arrow}--rest--light.json popover/notion--share-popover--open--light.json calendar/notion--search-date-filter-popover--rest--light.json` (trimmed):

| slot · property | area · teaching | area · arrow | notion · share-popover · open | notion · date-filter-popover |
|---|---|---|---|---|
| **shell** size | 240 × 122 | 240 × 82 | 456 × 348.04 | 247.95 × 430.31 |
| **shell** padding | 11 | 11 | 0 (sections 16 / 8 / 12) | 0 |
| **shell** border | 1 solid rgb(243, 243, 243) | same | 0 | 0 |
| **shell** radius | 12px | 12px | 12px | 10px |
| **shell** gap (row / column) | 12px / 12px | 12px / 12px | — | — |
| **shell** background | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(255, 255, 255) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 20px 24px 0px, color(srgb 0 0 0 / 0.03) 0px 5px 8px 0px | same | rgba(25, 25, 25, 0.05) 0px 20px 24px 0px, rgba(25, 25, 25, 0.027) 0px 5px 8px 0px, rgba(42, 28, 0, 0.07) 0px 0px 0px 1px | same as the Share popover |

Notion's page menu (`menu/notion--page-menu--open`) carries the same three shadows, so all
three Notion floating surfaces share one lift.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| radius | 12 (`radius-container`) | Peers Menu, Dialog, Toast; Notion Share popover 12 | Notion date popover and page menu 10, Figma 13, ChatGPT menu 16 |
| edge | 1px `border-decorative` #f3f3f3 / #282828 | Notion 1px ring (rgba(42,28,0,.07), about #f0efed) | Figma none; ChatGPT 0.5px ring |
| shadow | floating lift: `0 20px 24px` `shadow-color` (#000 6% / 8%) + `0 5px 8px` at half | Notion geometry on every floating surface (Share, date filter, page menu) | Notion's colour is 5% warm black; Area keeps the theme-aware role |
| fill | `bg-surface` #ffffff / #1d1d1d | Owner (theme surface) | — |
| width | 240 (`--area-popover-inline-size`), ≤ container | Owner; Figma picker 240 | Notion 248 (date), 456 (Share, content-sized) |
| inset | 12, border-inclusive | Owner | Notion's Share content sits at 16, its lists at 8 and its footer at 12; Notion date popover 4; the owner decision outranks product evidence |
| gaps | 12 between groups, 8 in the body | Owner | Notion Share: 16 below the tab row |
| header | min 28 (`control-sm`), title 14/20 400 | Owner | Notion Share's header is a 40px tab row with no title |
| description | 14/18 `fg-muted` | Owner (UI leading − 2) | — |
| media radius | outer − inset − border (0 at Standard) | Owner; concentric rule | — |
| arrow | curved 32 × 14 SVG, opt-in | Owner | Target products draw none |

## States

The surface has no interactive states of its own; its slots use Button and Input states.
Closed `[popover]` elements stay `display: none` (`surface.css:436`).

## Behavior and accessibility

`Popover` renders a plain `div` forwarding props and ref; the gallery gives it
`role="dialog"` and `aria-label` (`gallery.tsx:723-745`), as Notion's Share popover and page
menu do (`role=dialog`, `aria-modal=true`). `PopoverTitle` is an `h2`. The pointer SVG is
`aria-hidden` and not focusable; the `arrow` prop now documents the curved shoulder it draws
(`primitives.tsx:740-742`). With a `trigger` it anchors, flips, takes focus and dismisses
(2026-09-27): see [overlay behavior](overlay.md). Without one it renders inline as before.

## Peers and consistency

| Peer | Shared role | Peer value | Popover | Match / reason |
|---|---|---|---|---|
| Menu, Dialog, Toast, Select picker, Calendar, ColorPicker | floating lift | `0 20px 24px` + `0 5px 8px` | same | match |
| Menu | surface rule | radius 12, 1px decorative, inset 4 | inset 12 | prose needs a reading inset; rows carry their own |
| Dialog | outer inset, section gap | 16, 16 | 12, 12 | a popover is smaller and anchored |
| Tooltip | lift | `0 4px 12px −2px` | floating lift | a label floats less than a surface |
| Button sm | header close, footer actions | 28px, radius 6 | same | match |

## Visual pass

Not inspected in this spec pass. Unverified: Notion and Figma side by side on screen, dark
theme (the lift's 8% colour on #121212), the arrow with the lift on screen.

## Verification

Compared 4 Area captures (`popover/area--*`, re-taken after the second pass) with the Notion
Share and date filter popovers and the Figma and ChatGPT surface values in
[BASELINE](../research/BASELINE.md). Build and test results are in
[the audit](../research/cohesion-audit.md#verification).

## Feedback log

- 2026-09-26 · cohesion audit → `shadow-2` → floating lift (shared rule in `surface.css:403-416`)
  → 3 Area captures, `calendar/notion--search-date-filter-popover`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → evidence added,
  no change; the arrow tile was added and the `arrow` prop comment corrected →
  `popover/notion--share-popover--open`, `menu/notion--page-menu--open`.
