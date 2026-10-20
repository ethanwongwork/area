# Scroll area spec

**Captures:** `docs/research/captures/scroll-area/`
**Peers:** every Area surface that scrolls (Menu, Context menu, Command palette, Combobox and Custom select lists, Tag picker, Drawer body, Panel body, Dialog), Scroll to latest (a control over a scroller), Slider (a thumb on a track)

## Owner decisions

- 2026-10-09: "move on to the next component" after Link. Scroll area was the next item in the list the owner
  chose from (Pagination, Link, ScrollArea, FileUpload), and the gap audit's Resizable-and-ScrollArea step.
- 2026-10-09: the open questions go with the recommendations: Area's scrolling surfaces adopt Scroll area family
  by family (each reopened for review), `hover` stays the default, and the thumb keeps Figma's depth.

## Job and boundaries

Scroll area is a region whose content scrolls, drawn with a thin overlay scrollbar instead of the platform's,
so a list, panel or menu looks the same on every platform and the bar never takes the content's width. It is
not a virtualised list (it renders every child), not Scroll to latest (a button that jumps to the end), and not
a carousel (paged horizontal content with its own controls, Card `carousel`).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| type | `hover` (default) | The bar shows while the pointer is over the region or it scrolls | Figma's panels (the thumb is `display: none` until the panel is hovered); Figma's file browser `:hover` rule; Radix's default `type="hover"` |
| type | `scroll` | Only while scrolling | macOS overlay scrollbars (Notion inherits them); Radix `type="scroll"` |
| type | `always` | Always shown, for a region whose overflow should be obvious | shadcn's Base UI ScrollArea (opacity 1) |
| layout | vertical, horizontal or both | A bar appears for each axis that overflows; with both, each stops short of the other's corner | Radix, Base UI, shadcn |

Excluded: a size axis (Figma keeps one 10px track at its dense 24px rows; Radix and shadcn one 10px bar), a
visible track fill (no reference paints one), thumb hover and drag paint (Figma's thumb does not change under
the pointer), arrow buttons (no reference has them).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Editor Design panel scrollbar (a community file, viewed only), file browser rules | figma.com (owner's Chrome, read-only), 2026-10-09 | evidence only | `figma--panel-scrollbar--{rest,hover}--light` |
| chatgpt | target product | Global scrollbar rule | chatgpt.com (owner's Chrome, read-only) | evidence only | rule readout (below) |
| notion | target product | Board and sidebar scrollers | app.notion.com (owner's Chrome, read-only) | evidence only | rule readout (below) |
| shadcn | design system (rendered) | ScrollArea (Base UI) | ui.shadcn.com/docs/components/base/scroll-area, 2026-10-09 | MIT | computed readout (below) |
| area | this system | Every gallery tile at 1:1; the default tile hovered with the real pointer | localhost gallery | — | `area--*` (6) |

**Readouts:**
- ChatGPT: `* { scrollbar-color: var(--scrollbar-color) transparent; scrollbar-width: thin; }`, with
  `--scrollbar-color: color-mix(in oklab, #0d0d0d 30%, transparent)` (its text ink at 30%). Native, thin.
- Notion: no scrollbar styling on its scrollers (`scrollbar-width: auto`, `scrollbar-color: auto`); on the owner's Mac
  they are the system's overlay bars (`offsetWidth − clientWidth` = 0). Only `hide-scrollbar` utilities exist.
- Figma file browser: `scrollbar-color: var(--color-scrollbar) transparent` with `--color-scrollbar: #b3b3b380`; a
  `scrollbar-color: transparent transparent` rule whose `:hover` sets `var(--color-border)` (#e6e6e6), a bar shown
  on hover; WebKit thumbs with a 2px transparent border and a 9999px radius.
- Figma editor panel: the viewport is a native scroller with `scrollbar-width: none`; beside it an absolute 10px
  track (2px padding; 11 with a 1px left border while hovered) holds a thumb moved by `translateY`, painted by its
  `::after`: 6 wide, 2 short of each end, rgba(179, 179, 179, 0.5), radius 6. The thumb is `display: none` until
  the panel is hovered and does not change under the pointer.
- shadcn (Base UI): a 10px bar (`w-2.5`), 1px padding and a 1px transparent start border, so a 7px thumb in
  `--border` (lab 90.95), fully round; always shown (opacity 1); the viewport hides its native bar.

## Anatomy

```
figma    host (relative)
  viewport  native scroller, scrollbar-width none
  track     absolute, 10 wide at the end edge, padding 2
    thumb   absolute, translateY; ::after 6 wide, inset 2 at the ends, #b3b3b3 at 50%, radius 6
area     div.area-scroll-area (relative, flex column, overflow hidden; the consumer sizes it)
  viewport  div.area-scroll-area__viewport: native scroller, platform bar hidden, a Tab stop
    content div.area-scroll-area__content (observed for size changes)
  track     div.area-scroll-area__scrollbar[data-orientation] (absolute, 10 wide, padding 2, aria-hidden)
    thumb   div.area-scroll-area__thumb: 6 wide, fully round, sized and moved in whole pixels by the script
```

Insets (thumb paint from the region's edge): 0 border + 0 track offset + 2 padding = **2** at the side and at
each end, Figma's 2 (padding 2 at the side; the `::after`'s 2 at the ends).

## Measurements

Generated with `node scripts/capture-compare.mjs docs/research/captures/scroll-area/{area--default--hover,figma--panel-scrollbar--hover,area--default--rest,figma--panel-scrollbar--rest}--light.json`
(track and thumb rows). Area's demo frame has a 1px border, so its track sits 1 inside the outer box.

| slot · property | area · default · hover · light | figma · panel-scrollbar · hover · light | area · default · rest · light | figma · panel-scrollbar · rest · light |
|---|---|---|---|---|
| **track** size | 10 × 190 | 11 × 683 | 10 × 190 | 10 × 683 |
| **track** edge from parent (t r b l) | 1 1 1 181 | 0 0 2 229 | 1 1 1 181 | 0 0 2 230 |
| **track** padding | 2 | 2 | 2 | 2 |
| **track** radius | 0px | 0px | 0px | 0px |
| **track** opacity |  |  | 0 |  |
| **thumb** size | 6 × 37 | 6 × 279.63 | 6 × 37 | — |
| **thumb** edge from parent (t r b l) | 2 2 151 2 | 123.92 2 279.45 3 | 2 2 151 2 | — |
| **thumb** padding | 0 | 0 | 0 | — |
| **thumb** radius | 9999px | 0px | 9999px | — |
| **thumb** background | oklab(0.276846 0.0000126138 0.00000554323 / 0.18) |  | oklab(0.276846 0.0000126138 0.00000554323 / 0.18) | — |
| **thumb** pseudo |  | ::after 6px × 275.633px rgba(179, 179, 179, 0.5) r=6px |  | — |

Area's thumb composites to rgb ≈ 216 on white (18% of rgb 40); Figma's to 217 (#b3b3b3 at 50%); ChatGPT's native
thumb to ≈ 182 (30% of #0d0d0d). Dark: 18% of the dark default ink, a light thumb (gallery, Dark).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| approach | native viewport, platform bar hidden, overlay bar | Figma (the only target product with its own bar); Radix, Base UI, shadcn | ChatGPT thins the native bar and Notion leaves it, which looks different per platform and takes width on Windows |
| track · width | 10 | Figma 10, shadcn 10 | — |
| track · padding | 2 | Figma 2 | shadcn 1 + a 1px border |
| thumb · width | 6 | Figma 6 | shadcn 7 |
| thumb · radius | full | Figma 6 on a 6 thumb, shadcn full | — |
| thumb · colour | 18% of `fg-default` (≈ 216 on white) | Figma's depth (217 on white) | Expressed from the ink so dark draws a light thumb; ChatGPT is a step darker (30%) |
| thumb · min length | 18 | Radix | — |
| visibility (`hover`) | shown while the region is hovered or scrolling; hides 600ms after the last scroll, fading out on fast | Figma (shown on panel hover); Radix (600ms delay); MOTION.md hover recipe | Figma toggles `display`, with no fade |
| track press | brings the thumb's middle to the pointer, then drags | Radix, Base UI | — |
| keyboard | the viewport is a Tab stop (`tabIndex 0`), focus ring inside the edge | WCAG scrollable-region focus; Area focus ring | Radix leaves it to the content |

## States

| State | Changes | Evidence |
|---|---|---|
| region hovered | bar opacity 1, at once | `area--default--hover--light` |
| scrolling (`data-scrolling`) | bar opacity 1 until 600ms after the last scroll event | gallery: scrollTop 200 → shown; 800ms later → hidden |
| dragging (`data-dragging`) | bar stays shown | gallery: real pointer drag, thumb moved 44.8px for 45px of pointer travel at the tile's 0.8 zoom |
| overflow (`data-overflow-x`, `data-overflow-y`) | a bar exists for that axis | `area--layout-both--rest--light` |

## Behavior and accessibility

The viewport is the native scroller: wheel, touch, keyboard, find-in-page and scroll anchoring work as usual.
It is a Tab stop so the arrow keys and Page keys scroll it (`viewportProps.tabIndex = -1` when the content has its
own Tab stops); name it with `viewportProps["aria-label"]` when it is a region of its own. The overlay bars are
`aria-hidden`: they repeat what the scroller exposes. `viewportRef` reaches the scroller from code. RTL: the
vertical bar moves to the left and a horizontal thumb runs from the right. Under CSS zoom, pointer travel is divided
by the bar's `currentCSSZoom`, as overlay.ts does. Forced colors: the thumb draws in CanvasText. Reduced motion: the
fade uses `duration-fast`, which reduced motion sets to 0.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Menu, Command palette, lists, Drawer, Panel | scrolling surfaces | platform scrollbar (`overflow-y: auto`) | overlay bar | Not adopted in this change (open question 1) |
| Slider | thumb on a track | a raised round thumb | a flat round thumb | A scrollbar is not a value control |

## Visual pass

Gallery at 1:1 (viewport 800 × 500, tile zoom cleared), light and dark: the thumb reads as a quiet mark over the
list in both themes; with both axes each bar stops short of the corner; the bars overlay the last pixels of content,
as Figma's do. Fixed during the pass: dragging under the gallery's 0.8 tile zoom moved the thumb 0.8× the pointer
(zoom correction added); the two visibility tiles were named `type-*`, which the gallery filed under Content (now
`behavior-*`).

## Adoption, 2026-10-09

Owner: "go with your recommendations" (open question 1). Each surface's scroll container is now a Scroll area
root that keeps its class, name, role and popover; its padding moves into the scroller and its row stack into
the content, so the bar sits at the surface's edge (Figma) and every row keeps its place. The scroller is no
Tab stop in these families (focus stays on the field, the items or the dialog's controls; Chromium makes a
scroller without focusable content focusable on its own).

| Family | Scroller | Inset moved into the scroller | Measured after (gallery) |
|---|---|---|---|
| Menu (anchored) | `.area-menu[popover]` | `--_inset` 4 | first row 0.6 border + 4, as before; focus on the menu |
| Combobox, Custom select, Tag picker | `.area-menu` listbox popovers | `--_inset` 4 | first option 0.6 + 4; at 120px tall, ArrowDown keeps every highlighted option in view |
| Command palette | `.area-command-palette__list` | `--_list-inset` 4 | first row 4, 4 |
| Drawer | `.area-drawer__body` | `--_drawer-bleed` 4 (the body keeps its negative margin) | first child 4, 4 |
| Panel | `.area-panel__body` | `0 --_inset --_inset` (12) | sections from the body's top, 12 sides |

Menu's other users (Context menu, Split button, Toolbar overflow, Model picker, Breadcrumb's ellipsis menu) draw the
same surface and pick up the bar when they overflow. Dialog's body and Nav's overflow menu still use the platform bar.

Found and fixed while adopting:
- Scroll area's private `--_inset` (its 2px track padding) shadowed the surface's own `--_inset` in its scroller
  (Panel read 2, not 12). Its private properties are now `--_bar-track`, `--_bar-inset`, `--_bar-thumb`.
- `scrollOptionIntoList` (overlay.ts) scrolls the option's Scroll area viewport, and divides by the scroller's
  `currentCSSZoom`: under the gallery's 0.8 tile zoom it had scrolled 0.8 of the distance (a bug from before).

## Verification

- 6 Area captures and 2 Figma captures; checksums verified. ChatGPT, Notion and shadcn as readouts.
- Build (parity, token refs), typecheck, React tests (2 new in `scroll-area.test.mjs`), contracts, consumer,
  `npm test`, `build:docs`, `git diff --check`.
- In the gallery: programmatic scroll shows and hides the bar; the thumb ends flush with the track's end at the
  bottom (offset 150 + size 37 = 187); real pointer hover reveals it; real drag moves it 1:1 under zoom.
- Unverified: touch, a real RTL page, Windows (where the hidden platform bar would otherwise take width), a screen
  reader, Figma dark.

## Open questions

Resolved 2026-10-09 (owner: "go with your recommendations"):
1. Scrolling surfaces adopt Scroll area family by family: see "Adoption" below.
2. `hover` stays the default.
3. The thumb keeps Figma's depth (18% of the ink).

## Feedback log

- 2026-10-09 · owner: "move on to the next component" → Scroll area built from Figma's panel scrollbar, ChatGPT,
  Notion and shadcn readouts → 8 captures, gallery tiles, in review.
- 2026-10-09 · owner: "go with your recommendations" → open questions resolved as recommended; adoption in the
  scrolling families follows in separate commits.
- 2026-10-14 · owner: "merge it, then continue working" → all-axis sweep of Surface 0 at Elevation 0 (90 families, light and dark): the demo's frame (standing alone, no shadow) is a required edge, `stroke-width`, so it stays at Surface 0.

## Review note, 2026-10-20

- **What changed:** the demo's list items take the body size of the canvas (16 at Type 14, was 13); the scroll area is unchanged.
- **Why:** a section of the screen with its own Type setting (the canvas, a Theme) now starts its text at Area's body size, so text that inherits its size follows that setting; it kept the app's 13 before.
