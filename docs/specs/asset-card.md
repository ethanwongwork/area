# Asset card spec

**Status:** built · 2026-10-18 (in review)
**Captures:** none yet. Figma's file browser (the owner's reference) is not captured: the values below come from Area's
own gallery container and File tile, and the mosaic's gap is a pick (Open).
**Peers:** the app's gallery tile (`apps/desktop/src/tile.tsx`), File tile (label under the figure, ListBox grid),
Asset row (an asset in a list), Card (the linked card's lift), Preview frame (an image's corner inside a frame).

## Owner decisions

- 2026-10-18: "make the brand folders switch to another container based design. keep folders and docs and the file
  thing, but i want the gallery for brand to just be a bunch of containers ... anything, a component, an image, a
  screen, an animation, an illustration, a logo, a type ramp style, can belong standalone in a container ... they are
  essentially all assets, then you can group assets together in a group ... maybe just a 2x2 grid with each asset
  scaled down." Reference: Figma's file browser, a folder as one container of four file thumbnails, its name and
  "Edited 5 minutes ago" under it.
- 2026-10-18: the names are **Asset** and **Group** (offered Collection, since Button group, Nav group and the app's
  Group by already use the word; the owner chose Group).
- 2026-10-18: names and controls sit **under** the container, "for even assets ... for consistency".
- 2026-10-19: "a view setting that changes how containers are shown strictly for assets and groups. i want to look at
  containerless containers, and potentially a waterfall view that hugs the size of assets." Built as two separate axes:
  `container` (framed · containerless) on the card, and `layout` (grid · waterfall) on the grid, whose cards hug.
  Brand shows Waterfall between Grid and List for a group's assets.
- 2026-10-19: "i want the containerless design to be tested on components first, not the brand assets and groups."
  Container (Framed, Containerless) moved from Brand to the Components tab's header (All and a family's tiles); a
  containerless component keeps the frame's box with its edge clear until hover or selection.
- 2026-10-18: images are rounded by size: **12** (the container corner) where an image stands alone, **6** (the small
  corner) for thumbnails. Both follow the Radius setting.

## Job and boundaries

An Asset card shows one asset, anything that can stand alone (an image, a component, a screen, an animation, an
illustration, a logo, a type style), in a container, with its name, a detail line and its controls under it. A
**group** is the same card holding a 2×2 mosaic of its first four assets. `AssetGrid` lays cards out as a ListBox
grid (one Tab stop, arrows in two dimensions, typeahead, Space selects, Enter or a double click opens), as FileGrid
does for File tiles.

Not this: a file in a file browser (File tile, Finder's icon view), an asset in a list (Asset row), a content card
with its own text and actions inside (Card), a framed preview of a page or screen (Preview frame).

## Variants

| Axis | Value | Justification | Where |
|---|---|---|---|
| layout | asset (default): the asset in the frame | Owner: "can belong standalone in a container" | the app's gallery tiles; Figma's file card |
| layout | group: a 2×2 mosaic of the first four assets | Owner: "a 2x2 grid with each asset scaled down" | Figma's folder card (owner's reference) |
| media | image (contained, never cropped, 12 corner) · any node (centred) | File tile contains images; owner's corners | File tile, gallery tile |
| state | hover (lift), pressed, selected (edge in the selection colour), focus (ring on the frame) | the gallery tile's states (owner, 2026-10-18) | gallery tile, linked Card |
| interactive | off · on: the card is a control outside an asset grid (an app's gallery tile) | the app's tiles (owner, 2026-10-18) | gallery tile |
| container | framed (default) · containerless: no edge, fill or shadow at rest, on the page's ground. A component keeps the frame's box and inset, its edge shown on hover (hovered edge) and selection (selected edge); an image or a group's mosaic drops the inset and is the surface, the states painting it | owner 2026-10-19; PRODUCT_UI rule 11 (a thing that is its own figure sits on the surface) | Pinterest's pins, Finder's icon view, Are.na's blocks |
| aspect | square (default) · hug: the frame as tall as its asset at the card's width (`mediaRatio` holds an image's shape before it loads) | owner 2026-10-19: "a waterfall view that hugs the size of assets" | Pinterest's board |
| grid layout | grid (default): square cards in rows · waterfall: hugging cards in columns of the least width, each into the shortest column in reading order | owner 2026-10-19 | Pinterest's board, Cosmos, Savee |
| caption | inside (default): the frame's first row, name at the start, detail at the end · below: under the frame | owner 2026-10-19 (a trial: "the name should be at the top"); 2026-10-18 (below) | the old gallery tile head; Figma's file card |

A group's cells crop their asset to the square (a thumbnail), with the 6 corner.

## Anatomy

```
area-asset-card            the asset: its frame, then its caption
  __frame                  the container: 1px card edge, 12 corner (radius-container), surface fill, square
    __media                the asset, centred in the frame's 12 inset (an image contained, 12 corner)
    __mosaic               a group: 2 × 2 cells in a 12 margin inside the frame's inset, 16 apart
      __cell               one asset, cropped to its cell, 6 corner (radius-small), no stroke
  __caption                under the frame, 8 down: the text, then the controls
    __text
      __name               the app's UI text, strong; one line, then an ellipsis
      __meta               the caption size, muted; one line
    __actions              controls at the end, on the name's line
```

Containerless: the frame draws no edge, fill or shadow and sets no raised ground, so a component inside steps its
fills from the page. A component keeps the frame's border (clear) and inset, so its edge can appear on hover and
selection without moving anything; an image or a group drops both (border 0, padding 0), and in a square an image sits
on the square's floor, so a caption below is always 8 under it. The caption stays where `caption` puts it. A group's mosaic loses its 12 margin and closes
to 4 apart, with the small corner round the whole, so its four read as one thing beside single assets 12 apart.

Inset equation: frame inset = border 1 + padding 11 = 12 from the outside to the media, the gallery tile's 12 (owner,
2026-10-13: "the margin/padding can be smaller"; was 16), the border counted once.

## Measurements

Not captured (Open). Values reuse measured or owner-set peers:

| Slot · property | Value | Basis |
|---|---|---|
| frame · edge | 1px `border-card` | the gallery tile's edge (Card's edge, owner 2026-10-12) |
| frame · corner | `radius-container` (12 at the default Radius) | the gallery tile's 12 (owner, 2026-10-13); Card's container role |
| frame · inset | 12 | the gallery tile's 12 (owner, 2026-10-13) |
| frame · shape | square | the Components cards' square (owner, 2026-10-18) |
| mosaic · gap | 16 | owner 2026-10-19: "larger gaps" (pick; was 8) |
| mosaic · margin | 12, inside the frame's 12 | owner 2026-10-19: "larger ... margins" (pick; was none) |
| image · stroke | none | owner 2026-10-19: "dont put any strokes around them" (was the swatch ring) |
| cell · corner | `radius-small` (6) | owner, 2026-10-18: thumbnails 6 |
| media image · corner | `radius-container` (12) | owner, 2026-10-18: a standalone image 12 |
| containerless · mosaic gap | 4 | pick: close enough that a group reads as one thing beside cards 12 apart |
| containerless · selected ring | 2 (twice the stroke), `stroke-selected`, on the image or mosaic | pick: an image has no edge for one line to recolour; Finder and Photos ring a selected thumbnail |
| waterfall · gaps | 12 between columns, 16 between cards | the grid's gaps |
| caption · gap from frame | 8 | the gallery tile's head-to-stage 8 |
| name | UI text, strong | the Components card title ("the app's text, strong", PRODUCT_UI rule 11) |
| meta | caption (text-xs), muted | File tile's detail line (Figma black 50%, ChatGPT rgb(93)) |
| hover | `shadow-lift`, fade in `fast` ease-out, out `base` ease-in | the gallery tile and linked Card (owner, 2026-10-18) |

## States

| State | Change |
|---|---|
| hover | the frame lifts (`shadow-lift`); edge, fill and caption stay. Elevation 0: the edge steps to `edge-control-hover` |
| pressed | the lift drops at once |
| hover, containerless | a component's frame shows the hovered edge (`edge-control-hover`), no lift; an image or group lifts itself |
| selected | the frame's edge is the selection colour (one line, as the gallery tile). Containerless: a component's frame the same; an image or group a 2 ring round it |
| focus-visible | the focus ring round the frame, at once |
| disabled | the whole card at the disabled opacity |

## Behavior and accessibility

A waterfall places its cards once it has measured them (`data-placed`; until then they keep the grid's flow): as many
columns of `--area-asset-card-size` as fit, each card into the shortest column in DOM order, positioned with logical
insets so a right-to-left grid fills from the right. It places again when the grid's width or a card's height changes,
or cards come and go. DOM order is reading order, so Left and Right step through cards in order and Up and Down find
the nearest card by centre (ListBox's grid), as on the square grid. Containerless cards move the focus ring and the
hover lift from the frame to the asset.

In an `AssetGrid` each card is a ListBox option (`role="option"`, `aria-selected`) whose accessible name is its name
(`textValue`). Enter or a double click opens (`onOpen`); Space selects. Controls in `actions` sit inside the option:
keep them few and give each its own label. A standalone `AssetCard` is a plain element; images take `mediaAlt`
(empty by default, since the name says what it is).

## Open

- Capture Pinterest's board (pin corner, column and row gaps, caption type, hover) and Finder's selected thumbnail,
  and replace the containerless and waterfall picks.
- A component asset in a containerless card has no surface of its own to show the states; Brand holds only images.

- Capture Figma's file browser (folder card, file card, hover, selected) and replace the mosaic gap pick.
- Mixed assets in a group (a component, a type style) need the Brand library to reference app content.

## Review note, 2026-10-18

- **What it is:** a container for any asset with its name and controls under it, and a group form that shows four of
  its assets as a 2×2 mosaic.
- **Based on:** your Figma file-browser reference, Area's gallery container (edge, corner, inset, lift) and File
  tile's label and grid behaviour.

## Feedback log

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
- 2026-10-19 · owner: "a view setting that changes how containers are shown strictly for assets and groups ...
  containerless containers, and potentially a waterfall view that hugs the size of assets" → `container`
  (framed · containerless) and `aspect` (square · hug) on the card, `layout` (grid · waterfall) and `container` on the
  grid; Brand's header gains Container and a Waterfall segment (Container moved to Components the same day, below). Found on the way: ListBox's selected, hover and pressed
  plates painted behind every asset grid card (hidden by a framed card's fill, exposed without one); the grid's reset
  now outranks them.
- 2026-10-19 · owner: "i want the containerless design to be tested on components first, not the brand assets and
  groups" → Container is a Components-tab view option (All grid and a family's tiles); Brand keeps Waterfall. A
  containerless component keeps the frame's box, its edge clear until hover or selection, and no raised ground; the
  caption is no longer forced below.
