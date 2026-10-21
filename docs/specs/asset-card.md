# Asset card spec

**Captures:** the owner's three designs (round 55, 2026-10-19: "Image container", "Group container", "Component
container", 300 × 300 PNGs), measured pixel by pixel in headless Edge (canvas `getImageData`, the session's scratchpad):
values below are read from pixels, not estimated. Figma's file browser (the 2026-10-18 reference) is still not captured.
**Peers:** Card (the corner), the app's gallery tile (`apps/desktop/src/tile.tsx`: a head over a stage), Color swatch
(the colour kind's ring), File tile (a ListBox grid of figures), Asset row (an asset in a list).

## Owner decisions

- 2026-10-18: "make the brand folders switch to another container based design ... anything, a component, an image, a
  screen, an animation, an illustration, a logo, a type ramp style, can belong standalone in a container ... then you
  can group assets together in a group ... maybe just a 2x2 grid with each asset scaled down."
- 2026-10-18: the names are **Asset** and **Group**.
- 2026-10-19, round 55 (rethink): "the text and the images should align, the inset radius should be mathematically
  correct, any components or real designs should be screenshotted and scaled down. the padding, gaps, margins, can all
  be improved", then the three designs: the name in a head with a More button, the asset in a frame 4 in.
- 2026-10-19: "expand the scope ... see if color, language, typography, etc can have their own versions of these
  containers ... i want the overall design balance of this to be well organized and simple." → one card, four kinds
  of frame content (an element, an image, a colour, a group); a type style, an icon and a setting's option are
  elements. Supersedes the 2026-10-18 caption below the container and the 2026-10-19 caption inside the frame.
- 2026-10-19 (main, PR #141): "a view setting that changes how containers are shown strictly for assets and groups. i
  want to look at containerless containers, and potentially a waterfall view that hugs the size of assets." Built as
  two axes: `container` (framed · containerless) on the card, `layout` (grid · waterfall) on the grid, whose cards hug.
  Then: "i want the containerless design to be tested on components first" (Container in the Components tab's header).
  Carried onto the round-61 card in the merge (2026-10-20).

## Job and boundaries

An Asset card shows one asset in a square card: its name (a short detail, a few controls) in a head, the asset in a
frame under it. What the frame holds says what kind of asset it is: any element (a component, a type style, an icon,
a setting's option) centred on the surface, an image covering it, a colour painting it, or a group's first four
assets as a 2×2 mosaic. `AssetGrid` lays cards out as a ListBox grid (one Tab stop, arrows in two dimensions,
typeahead, Space selects, Enter or a double click opens), as FileGrid does for File tiles.

Not this: a file in a file browser (File tile), an asset in a list (Asset row), a content card with its own text and
actions (Card), a framed preview of a page at its own size (Preview frame).

## Variants

| Axis | Value | Set by | Design |
|---|---|---|---|
| layout | asset (default): any element, centred on the frame's surface, 12 of room around it | `media` as an element, or `children` | Component container |
| layout | image: the image covers the frame, cropped | `media` as a URL | Image container |
| layout | color: the colour paints the frame, the swatch ring over its edge | `color` | (extension, owner 2026-10-19) |
| layout | group: a 2×2 mosaic of the first four assets, 4 apart, no frame | `group` | Group container |
| interactive | off · on: the card is a control outside an asset grid | `interactive` | the app's gallery tiles |
| state | hover (lift), pressed, selected (edge), focus (ring on the card) | — | gallery tile |
| container | framed (default): the card · containerless: no card at rest (no fill, edge or shadow), the head and the frame in the same places; a component's frame shows the hovered edge on hover and the selected edge when selected; an image or group is its own surface and selection rings it (2, `stroke-selected`) | Owner 2026-10-19 (main): containerless views | Pinterest, Cosmos |
| aspect | square (default) · hug: the card as tall as its head and its asset at its width (an image at `mediaRatio`, a group and a colour square) | Owner 2026-10-19 (main): "a waterfall view that hugs the size of assets" | Pinterest's board |
| grid layout | grid (default): square cards in rows · waterfall: hugging cards in columns of the least width, each into the shortest column in reading order | Owner 2026-10-19 (main) | Pinterest's board, Cosmos, Savee |

`layout` is derived from the content, never passed. The extended kinds are elements, so they need no axis: a type
style (its sample, size and leading as `meta`), an icon (the glyph at a native size), a setting's option (drawn
under its own scope, as the Language tab previews, `Default` as `meta`).

## Anatomy

```
area-asset-card          the card: as tall as its head and its frame, Card's corner, card edge, recessed fill, padding 0 4 4
  __head                 control-sm + 2 × 4 tall; the name, then the controls, nothing else (round 58)
    __name               UI text, regular, default ink; cap-trimmed; one line, then an ellipsis
    __actions            small ghost controls, ending 4 in (on the frame's side), centred on the head
  __frame                1:1 (an image: the image's ratio), 4 in on three sides; corner card − edge − 4; surface + card edge; raised ground
    __media              asset: centred, 12 of room · image: covers the frame (object-fit cover)
    __mosaic             group: 2 × 2, 4 apart, the frame's place (the frame paints nothing)
      __cell             one asset cropped to its cell, the frame's corner
```

Inset equations (the designs at 300, edge 1; Area at the default):

- frame side = edge + inset = 1 + 4 = 5 from the outside on three sides (design: frame at x 5, 294 and y 294);
- head = control-sm + 2 × inset (design: 33 inside the edge; Area 24 + 8 = 32 at the app's type 13);
- name start = edge + (head − 1cap) / 2 (design: 1 + (33 − 11) / 2 = 12, its text box at x 12);
- control end = edge + inset, centred: (head − control-sm) / 2 = 4, so a button's side meets the frame's side
  (design: the "…" glyph's centre at x 280.5 of 300);
- frame corner = card corner − (edge + inset) × concentric = 16 − 5 = 11 (design: straight edges from 11 in).

## Measurements

| Slot · property | Design (300 PNG) | Area | Basis |
|---|---|---|---|
| card · size | 300 × 300 | the host's width; as tall as the head plus the frame (a 224 card is 224 × 252) | owner, round 65: the frame decides, not the card |
| frame · size | 291 × 262 (the card's rest) | 1:1 for a component, group, colour, type, icon or setting; an image's own ratio (`mediaRatio`, or its natural size once loaded; square until then) | owner, round 65: "for components can you make the top layer frame a 1:1 AR always. for images, it can vary based on the image height" |
| card · corner | 16 (straight edges from 15–16) | Card's: `radius-container` + inset × concentric (16 at the default); `--area-asset-card-corner` overrides | design = Card |
| card · edge | 1px #f0f0f0 | `border-card` at `border-width` (Card's), `shadow-edge` under Borderless; state edges at least `stroke-width` | design; DESIGN_SYSTEM Strokes |
| card · fill | #fafafa (neutral/25) | `bg-subtle` (neutral/50, #f7f7f7 at the default settings; Table's header fill) | design; round 58 tried a mix to #fafafa, outside the roles; round 59 reverted (no role lands on neutral/25; a new role would be a foundation change) |
| head · height | 33 inside the edge | `control-sm` + 2 × 4 | design |
| name | 16 regular, near black, x 12, cap 11–22 | `ui-size`, regular, `fg-default`, cap-centred, (H − 1cap) / 2 in | design (scaled to the app's UI text) |
| more | 3 dots 276–285, y 16–18 | a small ghost icon-only Button (`more-horizontal`); its corner the frame's (11): set into the card's corner as deep as the frame, so concentric with the card (round 52's rule) | design; owner round 57 ("the button nesting") |
| controls · plates | — | the card is a recessed ground (layers.css), the frame a raised one: a button's hover plate steps from the card's fill (light #ebebeb on #f7f7f7, 1.11:1; it was the page's #f3f3f3, 1.04:1); the glyph 6.85:1 (light) and 12.6:1 (dark) on the fill, 6.2:1 and 10.3:1 on its plate; the focus ring 7.4:1 and 13.7:1 | owner round 60: "make sure the backplate on the button is accessible"; layers.css |
| frame · inset | 4 inside the edge, none above (under the head) | `space-4` | design |
| frame · corner | 11 | card − (edge + inset) × concentric | design, exact concentric (owner: "mathematically correct") |
| frame · edge, fill | 1px #eee–#f0f0f0; component: white | `border-card`; `bg-surface` | design |
| image | covers the frame (cropped) | `object-fit: cover` | Image container |
| specimen room | — (centred) | 12 (pick) | — |
| group · cells | 143 × 128, 4 apart, corner 11, no edge | 2 × 2, gap = inset (4) = margin to the card's edge (the frame gives up its edge's width), corner = frame corner | Group container; owner round 59 |
| group · element cell | — | a thumbnail: laid out at twice the cell (about its own card's frame), scaled to half, inert | owner round 57: "image versions that are scaled down when that image is a thumbnail in a group" |
| setting · frame | — | the option's own scope on the frame (`frameProps`, e.g. `data-area-theme="dark"`), so the frame paints that option's ground | owner round 57: "it doesnt always have to be white" |
| head · end | — | controls only: Copy for what is used (component code, colour value, type role, icon name), More for what is managed (image, group); `meta` deprecated and ignored | owner round 58: "it should always be controls, maybe a copy button?" |
| colour · value | — | behind Copy (copies `#2563EB`) | Figma's colour styles carry the value |
| type · detail | — | in the sample: "Aa" over "Geist · Medium · 24 / 32" | Figma's text styles: "Ag" over the face |
| colour | — | the frame's fill; the swatch ring (`token-swatch-ring`, inset outline at `stroke-width`) | Color swatch |
| grid · gap | — | 12 both ways (the name is in the card) | PRODUCT_UI rule 11 |
| hover | — | `shadow-lift`, in `fast` ease-out, out `base` ease-in | the gallery tile, Card |
Containerless: the card draws no fill, edge or shadow and declares no recessed ground (its head's buttons step from the
page); the frame sets no raised ground. A component's frame keeps its clear edge, so the hovered and selected edges
appear without moving anything; an image's or a group's frame drops its edge (border 0) and is the surface.

## States

| State | Change |
|---|---|
| hover | the card lifts (`shadow-lift`, Hover shadow). Hover shadow 0: its edge steps to `edge-control-hover`, at least `stroke-width` |
| pressed | the lift drops at once |
| selected | the card's edge is `stroke-selected` at `selected-width` (Selected stroke, 2), drawn inside, over `selected-tint` |
| focus-visible | the focus ring round the card at `focus-gap`, at once |
| disabled | a disabled `AssetGridItem` is a disabled ListBox option: dimmed, no lift, Enter and double click do not open |

## Behavior and accessibility

In an `AssetGrid` each card is a ListBox option (`role="option"`, `aria-selected`) named by its name (`textValue`).
Enter or a double click opens (`onOpen`); Space selects. Controls in `actions` sit inside the option: keep them few
and label each. A standalone card is a plain element; with `interactive` the host supplies its role, `tabIndex` and
`aria-pressed` or `aria-selected`. Images take `mediaAlt` (empty by default); element media and a group's mosaic are
`aria-hidden`; a colour is named by the card's name. Forced colours: a selected grid card draws a `Highlight` outline,
and a colour keeps its own paint.

## Fit with the other containers

One language across Area's framed surfaces: a quiet band names the thing, a white body holds it.

| Container | Head | Body | Edge | Why it differs |
|---|---|---|---|---|
| Table | the header row on `bg-subtle` | rows on `bg-surface`, flush | `border-divider` at `stroke-width` (rows inside, so the frame is never lighter than its rules) | data: rows run to the frame |
| Asset card | the head on `bg-subtle` (the card's ground) | the asset on `bg-surface`, 4 in, concentric | `border-card` (frame of a standalone surface) | an asset is visual, so it gets its own frame and corner inside the card |
| Card | title in the body | content on `bg-surface` | `border-card`, Card's corner | content, not an asset; Asset card takes Card's corner |
| Code block / Edit summary | a header with a `border-decorative` seam | code on `bg-surface` | `border-card` at `stroke-width` | a seam instead of an inset frame: text needs no frame of its own |

The Asset card's corner is Card's, its head's fill is Table's header fill, and its inner frame follows the concentric
rule every nested surface uses (Popover, Code block's buttons, Edit summary's head buttons).

## Open

- A group of colours or type styles (a palette, a ramp) as cells: today a cell takes an image URL or an element.
- Adopting the card in the app's own tabs (Color's swatch cards, Typography's role cards, Icons, Language previews,
  Brand): each tab draws its own cards today.

## Review note, 2026-10-18

- **What it is:** a container for any asset with its name and controls under it, and a group form that shows four of
  its assets as a 2×2 mosaic.
- **Based on:** your Figma file-browser reference, Area's gallery container (edge, corner, inset, lift) and File
  tile's label and grid behaviour.

## Review note, 2026-10-21

- **What changed:** every selected edge (framed card, a component's frame, an image or group ring) is the same 2px vibrant blue drawn inside (the framed card was 1px dark blue); hover lifts by `0 2px 4px -1px` at 8%; focus sits 2px off.
- **Why:** your round 65 note on the selected border, answered by your picks on the state page (2026-10-21), now the defaults of the new state settings (Inspector: Stroke, Shadow, Fill).

## Feedback log

- 2026-10-21 · owner, round 65 (`components65`), needs changes: "what is the size or AR of the frame, for components can you make the top layer frame a 1:1 AR always. for images, it can vary based on the image height. not sure how i feel about the selected state border." → the frame is 1:1 for every kind but an image, which takes its own ratio; the card grows by its head (was a square card with a 1.15:1 frame). The selected border is part of the system-wide selection audit (docs/research/states-2026-10-21/), awaiting the owner's pick.
- 2026-10-18 · owner: Brand as containers, assets and groups, names under, rounded images → built (this spec).
- 2026-10-18 · owner: "rebuild the gallery tiles on Asset card so every tile's name and controls sit under its frame,
  on every tab" → the app's Tile is an Asset card (`apps/desktop/src/tile.tsx`). The card gained `interactive` (hover,
  press, focus and `aria-pressed` / `aria-selected` outside a grid), custom frame content (`children`, `frameProps`,
  `captionProps`) and two public hooks, `--area-asset-card-ratio` (the app's 5:4 frames, auto for full-width rows) and
  `--area-asset-card-corner` (the app holds 12 whatever the Canvas's Radius). The Compact density's hairline contact
  sheet is gone: a caption sits between rows.
- 2026-10-19 · owner: "the containers for assets and groups should always be a square AR ... move the text back into the
  containers. the name should be at the top" (every tile, a trial) → the frame is always square (the ratio hook is
  gone); a `caption` axis, `inside` by default (the frame's first row, cap-trimmed, 8 over the asset) or `below`.
- 2026-10-19 · owner (Brand groups): "make the images smaller, larger gaps, and margins, also dont put any strokes around
  them" → the mosaic sits in a 12 margin with 16 gaps; cells and standalone images lose the swatch ring. The caption's
  name and detail clip with a 4 margin, so a cap-trimmed name keeps its descenders (they were cut: "Loaos").
- 2026-10-19 · audit: the selected edge and Elevation 0's hover edge use at least `stroke-width` (they rode
  `border-width`, which Stroke width 0 removes); the resting frame stays on Card's `border-width`; the grid's 224
  column moved into a `/* spec */` property.
- 2026-10-21 · owner's picks on the state page (https://claude.ai/artifact/3uKMHRhpWnPqNA6pK4WfD9) and "capture some of these options as options for the design system customization … keep my current selections as the default" → round 65's open "not sure how i feel about the selected state border": every selected edge (framed card, a component's frame, an image or group ring, a grid item) is `selected-width` (2) in the indicator rung, the vibrant blue (was 1px framed, 2px containerless, #004cb0), over `selected-tint`; focus at `focus-gap`; the hover edge at Hover shadow 0 (was Elevation 0). asset-card.css; docs/research/states-2026-10-21.

## Review note, 2026-10-19 (round 55, design-system audit)

- **What changed:** The selected edge and Elevation 0's hover edge never disappear when Stroke width is 0. A new tile shows `caption="below"`, and the API page lists `caption`.
- **Why:** CONTRAST.md: removing a frame must not erase an indicator; GOVERNANCE: one tile per value.
- 2026-10-19 · owner, round 55: rethink with three designs → rebuilt: square card, head (control-sm + 2 × 4, name
  regular at (H − 1cap) / 2, More at the end on the frame's side), frame 4 in with the concentric corner (16 − 5 = 11),
  image covers, group 2 × 2 at 4 with every cell at 11, component centred on white; new `color` kind; type, icon and
  setting examples; `caption` deprecated (ignored), `captionProps` → `headProps`; states move from the frame to the card
  → headless Edge captures, light and dark: every kind, selected and the grid.

## Review note, 2026-10-19 (round 57)

- **What changed:** the card is your design: a square card with the name in a head and a More button at its end, and
  the asset in a frame 4 in, its corner exactly concentric (16 outside, 11 inside). Images fill the frame; a group is
  four cells 4 apart; a component sits centred on white. New kinds: a colour paints the frame, and a type style, an
  icon or a setting's option sit centred like a component, with a short detail (a size, Default) beside the name.
- **Why:** you sent the three designs and asked for colour, typography and language versions, organised and simple.
  One card with four kinds of frame content covers them all, and each value comes from the designs' pixels.

## Review note, 2026-10-19 (round 58)

- **What changed:** the More button's corner is the frame's (11), so it sits concentric in the card's corner like the
  frame does. In a group, a component or design is a scaled-down image of itself, not the live thing at full size. A
  setting's frame takes the option's own theme, so the Dark option's frame is dark. Colour shows its value beside the
  name; a type style shows its size and leading beside the name and its face and weight under the sample.
- **Why:** your notes on nesting, thumbnails, the setting background and more information. The spec's new "Fit with
  the other containers" section answers how the card relates to Table and Card: Table's header fill for the head, Card's
  corner, the shared concentric rule for the frame.

## Review note, 2026-10-19 (round 59)

- **What changed:** the head's end holds controls only: Copy on a component, a colour, a type style and an icon
  (copying its code, value, role or name), More on an image and a group. The type style's size and leading moved into
  its sample's line. The card's fill is lighter, the designs' #fafafa (it was the recessed grey, about #f7f7f7).
- **Why:** you said the top right should always be controls, perhaps a copy button, and asked whether the fill could be
  lighter. It was the recessed role (2.4% under white at the default Layers); it now sits 60% of the way to white, so it
  still follows the Layers setting, and in dark it keeps its step under the raised frame.

## Review note, 2026-10-19 (round 60)

- **What changed:** in a group the images sit 4 from the card's edge, the same as the 4 between them (they were 5 in:
  the frame kept an invisible 1px edge). A selected card in the grid no longer shows a square plate behind its rounded
  corners. The card's fill is the recessed role again (#f7f7f7 at the defaults), as agreed.
- **Why:** your notes on the group's margin and the grid's selected corners; the fill was a one-off mix outside the
  roles, so it went back to `bg-subtle`, which follows the Neutral, Ground and Layers settings.

## Review note, 2026-10-19 (round 61)

- **What changed:** the More and Copy buttons' hover and press plates now show on the card: the hover plate is a clear
  step darker than the card's fill (#ebebeb on #f7f7f7) instead of almost the same grey (#f3f3f3).
- **Why:** you asked to make sure the backplate is accessible. The card paints the recessed grey under its head but
  never said so, so its buttons used the plate meant for a white page, 1.04:1 against the card. Declared recessed (as a
  sidebar is), the plate steps from the card's own fill, 1.11:1, the same step every hover plate in Area takes from its
  ground. The parts that must pass WCAG already did and still do: the icon 6.85:1 in light and 12.6:1 in dark (6.2:1
  and 10.3:1 on its plate), the focus ring 7.4:1 and 13.7:1.
| containerless | hover: a component's frame shows the hovered edge, an image or group a hairline ring; no lift. Selected: a component's frame takes the selected edge, an image or group a `selected-width` ring; the card stays clear. Focus rings the frame |

## Review note, 2026-10-20 (round 65, merged with main)

- **What changed:** the containerless and waterfall views from the other session (Brand's waterfall, the Components
  tab's Container option) now sit on your redesigned card. Containerless drops the card's fill and edge but keeps the
  head and the frame in the same places, so nothing jumps; a component's frame shows its edge on hover and selection,
  and an image or group gets a ring. Hug lets a card be as tall as its asset, which the waterfall uses.
- **Why:** both sessions changed Asset card at once; the merge keeps your approved design as the structure and carries
  the view options onto it. The Language tab's tiles now carry "(Default)" in their names, since the card's head no
  longer shows a detail line.
- **Compared with round 61 (what you approved):** 8 tiles are new, the containerless, hug and waterfall views. Group,
  setting and grid read as changed only because the Cards drawn inside them now carry the dark-mode rim every shadow
  gained in PR #141 (transparent in light, a faint light edge in dark); Asset card itself is the same as round 61.
