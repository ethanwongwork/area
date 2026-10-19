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

A group's cells crop their asset to the square (a thumbnail), with the 6 corner.

## Anatomy

```
area-asset-card            the asset: its frame, then its caption
  __frame                  the container: 1px card edge, 12 corner (radius-container), surface fill, square
    __media                the asset, centred in the frame's 12 inset (an image contained, 12 corner)
    __mosaic               a group: 2 × 2 cells in the 12 inset, 8 apart
      __cell               one asset, cropped to its square, 6 corner (radius-small), the swatch ring
  __caption                under the frame, 8 down: the text, then the controls
    __text
      __name               the app's UI text, strong; one line, then an ellipsis
      __meta               the caption size, muted; one line
    __actions              controls at the end, on the name's line
```

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
| mosaic · gap | 8 | pick (Figma's reference reads close to two-thirds of its inset; not measured) |
| cell · corner | `radius-small` (6) | owner, 2026-10-18: thumbnails 6 |
| media image · corner | `radius-container` (12) | owner, 2026-10-18: a standalone image 12 |
| caption · gap from frame | 8 | the gallery tile's head-to-stage 8 |
| name | UI text, strong | the Components card title ("the app's text, strong", PRODUCT_UI rule 11) |
| meta | caption (text-xs), muted | File tile's detail line (Figma black 50%, ChatGPT rgb(93)) |
| hover | `shadow-lift`, fade in `fast` ease-out, out `base` ease-in | the gallery tile and linked Card (owner, 2026-10-18) |

## States

| State | Change |
|---|---|
| hover | the frame lifts (`shadow-lift`); edge, fill and caption stay. Elevation 0: the edge steps to `edge-control-hover` |
| pressed | the lift drops at once |
| selected | the frame's edge is the selection colour (one line, as the gallery tile) |
| focus-visible | the focus ring round the frame, at once |
| disabled | the whole card at the disabled opacity |

## Behavior and accessibility

In an `AssetGrid` each card is a ListBox option (`role="option"`, `aria-selected`) whose accessible name is its name
(`textValue`). Enter or a double click opens (`onOpen`); Space selects. Controls in `actions` sit inside the option:
keep them few and give each its own label. A standalone `AssetCard` is a plain element; images take `mediaAlt`
(empty by default, since the name says what it is).

## Open

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
