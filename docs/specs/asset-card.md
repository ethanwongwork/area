# Asset card spec

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
- 2026-10-18: names and controls sit **under** the container, "for even assets ... for consistency". — superseded
  2026-10-19: the caption sits inside the frame's first row by default (a trial); `below` keeps this placement.
- 2026-10-18: images are rounded by size: **12** (the container corner) where an image stands alone, **6** (the small
  corner) for thumbnails. Both follow the Radius setting.

## Job and boundaries

An Asset card shows one asset, anything that can stand alone (an image, a component, a screen, an animation, an
illustration, a logo, a type style), in a square container, with its name, a detail line and its controls in the
container's first row (`caption="inside"`, the default) or under it (`below`). A **group** is the same card holding a 2×2 mosaic of its first four assets. `AssetGrid` lays cards out as a ListBox
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
| caption | inside (default): the frame's first row, name at the start, detail at the end · below: under the frame | owner 2026-10-19 (a trial: "the name should be at the top"); 2026-10-18 (below) | the old gallery tile head; Figma's file card |

A group's cells crop their asset to the square (a thumbnail), with the 6 corner.

## Anatomy

```
area-asset-card            the asset: its frame (caption inside, the default) or its frame, then its caption (below)
  __frame                  the container: 1px card edge, 12 corner (radius-container), surface fill, square,
                           raised ground (data-area-ground="raised"); inside: rows caption, then asset, 8 apart
    __caption              inside: the frame's first row, one line, centred; the text, then the controls
    __media                the asset, centred in the frame's 12 inset (an image contained, 12 corner, no stroke)
    __mosaic               a group: 2 × 2 cells in a 12 margin inside the frame's inset, 16 apart
      __cell               one asset, cropped to its cell, 6 corner (radius-small), no stroke
  __caption                below: under the frame, 8 down; the text, then the controls
    __text                 inside: name and detail on one baseline, 8 apart; below: name over detail
      __name               the app's UI text, strong; one line, then an ellipsis (4 clip margin for descenders);
                           inside: cap-trimmed
      __meta               the caption size (text-xs), muted, tabular figures; one line; inside: cap-trimmed, at the end
    __actions              controls at the end, centred on the name's line (inside: on its cap height)
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
| mosaic · gap | 16 | owner 2026-10-19: "larger gaps" (pick; was 8) |
| mosaic · margin | 12, inside the frame's 12 | owner 2026-10-19: "larger ... margins" (pick; was none) |
| image · stroke | none | owner 2026-10-19: "dont put any strokes around them" (was the swatch ring) |
| cell · corner | `radius-small` (6) | owner, 2026-10-18: thumbnails 6 |
| media image · corner | `radius-container` (12) | owner, 2026-10-18: a standalone image 12 |
| caption · gap | 8: over the asset (inside), under the frame (below) | the gallery tile's head-to-stage 8; inside per owner 2026-10-19 |
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
| disabled | not a card state (the manifest declares `selected` only). A disabled `AssetGridItem` is a disabled ListBox option: ListBox's disabled opacity, no lift or edge step on hover, Enter and double click do not open |

## Behavior and accessibility

In an `AssetGrid` each card is a ListBox option (`role="option"`, `aria-selected`) whose accessible name is its name
(`textValue`). Enter or a double click opens (`onOpen`); Space selects. Controls in `actions` sit inside the option:
keep them few and give each its own label. A standalone `AssetCard` is a plain element; with `interactive` the host
supplies its role, `tabIndex` and `aria-pressed` or `aria-selected`, and the frame shows hover, press, focus and the
selected edge. Images take `mediaAlt` (empty by default, since the name says what it is); a group's mosaic is
`aria-hidden`. Forced colors: a selected grid card draws a `Highlight` outline.

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
- 2026-10-19 · owner: "the containers for assets and groups should always be a square AR ... move the text back into the
  containers. the name should be at the top" (every tile, a trial) → the frame is always square (the ratio hook is
  gone); a `caption` axis, `inside` by default (the frame's first row, cap-trimmed, 8 over the asset) or `below`.
- 2026-10-19 · owner (Brand groups): "make the images smaller, larger gaps, and margins, also dont put any strokes around
  them" → the mosaic sits in a 12 margin with 16 gaps; cells and standalone images lose the swatch ring. The caption's
  name and detail clip with a 4 margin, so a cap-trimmed name keeps its descenders (they were cut: "Loaos").
