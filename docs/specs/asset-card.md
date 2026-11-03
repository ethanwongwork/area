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
- 2026-10-22: "i want the component gallery to feel more like a gallery … smaller, so 4 columns can fit? can update the
  aspect ratio of the asset cards" → `aspect="landscape"`, the frame 5:4 (the reference gallery's media measured
  195 × 158), on the Components gallery's cards four across; square stays the default.
- 2026-10-22: "explore different asset card styles and add them as options to the dropdown. very simple adjustments,
  maybe different placements of the text, inside the card, outside the card, different paddings, layering" → `caption`
  (above · below), `inset` (snug · roomy) and a `flush` container. Then, the same day: "no divider lines across, no
  roomy version. maybe just a basic container would work, maybe try playing with the fill and stroke" → `inset` and
  `flush` removed; a `basic` container (one surface), `fill` (recessed · raised) and `borderless`. The Container menu
  offers eight combinations: Framed, Name below, Basic, Basic with the name below, Basic white, Basic with no stroke,
  Containerless, Containerless with the name below. The head keeps its own 4 (`--_head-pad`) apart from the inset.
- 2026-10-22: the layer map (https://claude.ai/artifact/2AtkSCcTm3GqwAveDbdqXY): on the raised frame a Card inside matched
  it, 1.00:1, on every grey and dark ground; owner: "make the Asset card frame the page tone" → the frame paints
  `bg-page` and declares the page ground, so raised components lift from it (1.11:1 at light 94 + 4) and controls step
  from the page as they do in an app. White at the default light ground, so the default looks the same.
- 2026-10-22: "i just want users to be able to choose the option of making these containers/cards match the background or
  making them slightly different, lighter or darker" → the Card tone setting (axes/card-tone.ts), per mode: Auto keeps
  the container's own tone, else −4 (darker) to +4 (lighter) from the page, 0 matching it. An Asset card paints `bg-tile` (Auto: the recessed layer, `bg-subtle`) and declares the tile ground; a basic card's frame declares the tile ground too; the `raised` fill and the frame keep their own tones.
- 2026-10-23: "i want to make it so the color on the inside frame of the asset cards is different from the outside card
  material, in my case i want it to be a light gray since the card container around it will be white, just like the
  page"; chose "the frame adapts … no new setting" → the frame is the page tone unless the card is the page tone (Card
  tone 0, a step clamped at white, or the raised fill on a white page), where it takes the recessed tone (`bg-frame`,
  `bg-frame-raised`, color/layers.ts `FRAME_SAME`); the frame and frame-raised grounds point its controls and edges at
  it. Auto and every non-zero step are unchanged. Containerless cards follow the same rule.
- 2026-10-26: Card shade and Layer contrast take every position of 0–100 (owner: "a slider that adjusts to every possible
  percentage") → a card counts as the page tone within 0.005 L (`FRAME_SAME`, was 0.0001, under the smallest half step
  there was), and the frame takes the recessed tone there only if it is farther from the card than the page, so an Auto
  Asset card at the lowest Layer contrast positions (itself the recessed tone) keeps the page-tone frame. Every Card shade
  step and Layers step before is unchanged (`layers.test.ts`).

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
| mosaic | grid (default): the 2×2 above · strip: up to eight assets in one row at their own ratios (an element square), the frame's height, as far apart as from the card's edge, running on past the card's end, where the card's own corner cuts the last one; images square until they load | Owner 2026-11-01: "update the designs of the group cards" with two "Group container" designs (a strip and a 2×2, gaps equal to padding, every image rounded) | The owner's designs |
| fit | natural (default): an image's frame takes its own ratio · cover: the frame takes `aspect` and the image is cropped to it · contain: the frame takes `aspect` and is a size container; the whole image sits centred at `mediaRatio` (as `--_media-ratio`), the group inset round it (less the card's own inset), on the side the head takes the head's room; the image draws its own corner (frame corner − that inset, at least `radius-min`) and the media edge; the frame paints nothing, so the card's fill is the footprint | Owner 2026-11-01: "i like how in are.na images keep their aspect ratio no matter what bc there is an underlying grid that keeps AR and keeps each things footprint the same" | Are.na's channel grid (square cells, images whole) |
| interactive | off · on: the card is a control outside an asset grid | `interactive` | the app's gallery tiles |
| state | hover (lift), pressed, selected (edge), focus (ring on the card) | — | gallery tile |
| container | framed (default): the card · containerless: no card at rest (no fill, edge or shadow), the head and the frame in the same places; a component's frame shows the hovered edge on hover and the selected edge when selected; an image or group is its own surface and selection rings it (2, `stroke-selected`) | Owner 2026-10-19 (main): containerless views | Pinterest, Cosmos |
| caption | above (default): the head over the frame · below: the head under it, the card's inset above the frame · overlay: the frame fills the card and the name shows on it as a plate at its bottom start (the raised surface, control-sm tall, a pill, `shadow-control`, padded as far across as its height leaves over the cap, so the name keeps the card's name inset both ways), fading in on hover, shown for focus and where nothing hovers (owner 2026-10-24: "have names/titles appear on hover"; Bencho's block gallery: a white 94% pill 14 in) | Owner 2026-10-22: "different placements of the text, inside the card, outside the card" | Spline's file grid (name under the asset) |
| container (basic) | basic: one surface, the head and the asset on the card's fill, no inset, no frame of its own and no divider; Card's corner | Owner 2026-10-22: "no divider lines across … maybe just a basic container would work" | A gallery's tile (the owner's references) |
| fill | recessed (default): bg-subtle · raised: bg-surface, white in light · checker: the frame on Color swatch's transparency checker (8 cells, 16% ink on the frame tone), a colour painted over it so its alpha shows (Preview frame's, folded in 2026-10-26; Zeplin's and Figma's export previews); the frame of a basic card declares the same ground | Owner 2026-10-22: "playing with the fill and stroke" | — |
| borderless | off · on: no edge at rest, its width kept; hover and selection still draw | Owner 2026-10-22: "playing with the fill and stroke" | — |
| aspect | square (default) · landscape: the frame 4:3 (5:4 until 2026-11-01), an image at its own ratio · wide: the frame 2:1, for a colour or a banner (Preview frame's, folded in 2026-10-26) · screen: the frame 16:9, a product screen's 1920 × 1080 (owner 2026-11-01: "for ui, 1920x1080 AR for card thumbnails is the standard"); with `caption="outside"` the asset inside the inset is 16:9 and the card the inset larger round it, so a window fits whole (2026-11-02: the bottom was cut off) · hug: the card as tall as its head and its asset at its width (an image at `mediaRatio`, a group and a colour square) | Owner 2026-10-19 (main): "a waterfall view that hugs the size of assets"; landscape owner 2026-10-22: "update the aspect ratio of the asset cards" | Pinterest's board; landscape: a gallery's media, 195 × 158 (the owner's reference, 2026-10-22) |
| grid layout | grid (default): square cards in rows · waterfall: hugging cards in columns of the least width, each into the shortest column in reading order | Owner 2026-10-19 (main) | Pinterest's board, Cosmos, Savee |
| content (no head) | no `name` and no `actions`: no head. Containerless, the card is its frame alone: no inset, the frame filling its column at its aspect, its edge (`border-divider` at `stroke-width`) shown at rest and the container corner, since nothing carries it; framed or basic, the card's inset on all four sides | owner 2026-10-26: "Fold Preview frame into Asset card: add the wide aspect, a checker fill and an unnamed containerless frame, move the Inspector to it, and deprecate Preview frame": Preview frame folded in; the app's Inspector previews | Figma's and Penpot's asset tiles; Polaris Thumbnail |

`layout` is derived from the content, never passed. The extended kinds are elements, so they need no axis: a type
style (its sample, size and leading as `meta`), an icon (the glyph at a native size), a setting's option (drawn
under its own scope, as the Language tab previews, `Default` as `meta`).

## Anatomy

```
area-asset-card          the card: as tall as its head and its frame, Card's corner, the divider edge (the frame's), recessed fill, padding 0 4 4
  __head                 control-sm + 2 × 4 tall; the name, then the controls, nothing else (round 58)
    __name               UI text, regular, default ink; cap-trimmed; one line, then an ellipsis
    __actions            small ghost controls, ending 4 in (on the frame's side), centred on the head
  __frame                1:1 (an image: the image's ratio), 4 in on three sides; corner card − edge − 4; the frame tone (`bg-frame`: the page tone, or the recessed tone where the card is the page's; a raised card's `bg-frame-raised`) + divider edge at stroke-width; frame ground (2026-10-23; the page tone and ground from 2026-10-22; was surface, raised)
    __media              asset: centred, 12 of room · image: covers the frame (object-fit cover)
    __mosaic             group: 2 × 2, as far apart as from the edge, the frame's place (the frame paints nothing) · strip: a row, the frame's height, past the card's end
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
| card · corner | 16 (straight edges from 15–16) | Card's: `radius-container` + inset × concentric (16 at the default); `--area-asset-card-corner` overrides |
| head · name inset | the name's cap centred in the head | `(head − 1cap) / 2` inside the edge by default; `--area-asset-card-name-inset` sets it from the outer edge (the head grows to keep it, never under its controls; controls end that inset less their half-height over the cap). The app sets 16, its colour cards' padding (2026-10-24) | design = Card |
| card · edge | 1px #f0f0f0 | `border-card` at `border-width` (Card's), `shadow-edge` under Borderless; state edges at least `stroke-width` | design; DESIGN_SYSTEM Strokes |
| card · fill | #fafafa (neutral/25) | `bg-subtle` (neutral/50, #f7f7f7 at the default settings; Table's header fill) | design; round 58 tried a mix to #fafafa, outside the roles; round 59 reverted (no role lands on neutral/25; a new role would be a foundation change) |
| head · height | 33 inside the edge | `control-sm` + 2 × 4 | design |
| name | 16 regular, near black, x 12, cap 11–22 | `ui-size`, regular, `fg-default`, cap-centred, (H − 1cap) / 2 in | design (scaled to the app's UI text) |
| more | 3 dots 276–285, y 16–18 | a small ghost icon-only Button (`more-horizontal`); its corner the frame's (11): set into the card's corner as deep as the frame, so concentric with the card (round 52's rule) | design; owner round 57 ("the button nesting") |
| controls · plates | — | the card is a recessed ground (layers.css), the frame a raised one: a button's hover plate steps from the card's fill (light #ebebeb on #f7f7f7, 1.11:1; it was the page's #f3f3f3, 1.04:1); the glyph 6.85:1 (light) and 12.6:1 (dark) on the fill, 6.2:1 and 10.3:1 on its plate; the focus ring 7.4:1 and 13.7:1 | owner round 60: "make sure the backplate on the button is accessible"; layers.css |
| frame · inset | 4 inside the edge, none above (under the head) | `space-4` | design |
| frame · corner | 11 | card − (edge + inset) × concentric | design, exact concentric (owner: "mathematically correct") |
| frame · edge, fill | 1px #eee–#f0f0f0; component: white | `border-divider` at `stroke-width` (light #e2e2e2, 1.21:1 on the card's #f7f7f7, 1.30:1 on the frame's white; dark #333, 1.56:1, as before); `bg-page` (2026-10-22; was `bg-surface`) | DESIGN_SYSTEM Strokes: a frame with no shadow, as Table's; owner 2026-10-21 ("too thin": the design's #eee was 1.08:1 on Area's recessed card, which is darker than the design's #fafafa) |
| image | covers the frame (cropped) | `object-fit: cover` | Image container |
| specimen room | — (centred) | 12 (pick) | — |
| group · cells | 143 × 128, 4 apart, corner 11, no edge | 2 × 2, gap = inset (4) = margin to the card's edge (the frame gives up its edge's width), corner = frame corner; the frame's tone; an element cell draws the frame's edge (`stroke-width`, `border-divider`, inset), an image cell none, a containerless card's cells none at rest | Group container; owner round 59 (images); visual pass 2026-10-27 (element cells) |
| group · element cell | — | a thumbnail: laid out at twice the cell (about its own card's frame), scaled to half, inert | owner round 57: "image versions that are scaled down when that image is a thumbnail in a group" |
| setting · scope | — | the option's own scope on the whole card (e.g. `data-area-theme="dark"`), so the card and its frame paint that option's grounds together: the frame always the page tone inside the card's recessed fill (light: white on #f7f7f7; dark: #020202 on #0b0b0b) | owner round 57: "it doesnt always have to be white"; 2026-10-21: "the frame color and card color dont seem to always update together" (the frame alone was scoped, a dark frame on a light card) |
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
| Asset card | the head on `bg-tile` (the card's ground) | the asset on `bg-frame` (the page tone, or recessed where the card is the page's), 4 in, concentric | the card: `border-card` (a standalone surface); the frame: `border-divider` at `stroke-width` (no shadow carries it, as Table's) | an asset is visual, so it gets its own frame and corner inside the card |
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

## Review note, 2026-10-21 (frame edge)

- **What changed:** the frame inside the card has a firmer edge: #e2e2e2 instead of #eeeeee in light, still 1px. Dark
  is unchanged. It stays when Stroke width is 0, as Table's frame does.
- **Why:** you said the inner frame's strokes look too thin. They were the card's own edge colour, made for a card on a
  white page. Inside the card, they sit on its grey ground (#f7f7f7), where #eee is only 1.08:1, so the line almost
  disappears. Area's rule for a frame with no shadow (Table, Code block) is the divider colour at the required stroke
  width, which gives 1.21:1 on the ground and 1.30:1 against the white inside. In dark the two colours were already the
  same (#333, 1.56:1), so only light changes. Every app tile uses this card, so every tile's frame changes too.

## Visual pass

2026-10-27 (desktop app, the Stage at 100%, 2x, light and dark): all 27 tiles. In a group, a cell holding a
component or a card thumbnail was white with no edge on the card's tone, so the thumbnail floated loose and the 2 × 2 read
as two images and two stray marks; the cell had kept `bg-surface` when the frame moved to `bg-frame` (2026-10-22). Now a
cell takes the frame's tone and an element cell the frame's edge, as a single component's frame has; image cells keep no
edge (round 59). On the Stage, every Asset card took the app's own tile hooks (`--area-asset-card-corner` 16,
`--area-asset-card-name-inset` 16, `--area-asset-grid-gap` 8): the 2026-10-26 reset stopped them at a gallery tile's
stage but not at the Stage, so the Stage showed a group's cells 16 in at the 2 floor (measured: inset 16, cell corner 2;
now 4 and 15 at the default Radius). The reset now covers both holders and the grid gap (apps/desktop canvas.css). The
rest unchanged.

- 2026-10-21 · in the app, headless Edge 3× (light, dark) and a measured matrix: the card fill (`bg-subtle`, recessed)
  against the frame fill (`bg-surface`, raised) at light ground 100/95/90 and dark ground 0/8/16/24, each at Layers 0, 4
  and 8. They move together everywhere the Canvas sets them: the frame is the lighter step at every Layers above 0
  (1.07:1 at the light default, 1.05:1 at the dark default, up to 1.46:1 at ground 90, Layers 8), and at Layers 0 card,
  frame and page are one tone, which is that setting's design ("frames alone set layers apart"). Contrast More, Selected
  tint, Stroke width 0 and a Material leave the pair as it is. The one break was the setting demo: its option's scope
  (`data-area-theme="dark"`) sat on the frame alone, a dark frame on a light card. The scope now goes on the whole card.
  Figma's file browser and Notion's galleries need a sign-in in the browser pane, so the product comparison was not
  run. Against the owner's designs (round 55) and the peers Card and File tile, nothing else measured off.

- 2026-10-21 · in the app (not against a live product), light and dark, headless Edge at 3× and the pane: the frame
  edge was `border-card` (#eee) at `border-width` on the card's `bg-subtle` (#f7f7f7), 1.08:1 in light against 1.56:1
  in dark, so light read as a hairline that faded out (owner: "too thin"). The width was 1px, the same as the card's
  edge; the contrast was the defect. Compared with peers that frame content without a shadow: Table's frame and Code
  block (`stroke-width`), Table's colour `border-divider`. Changed to `border-divider` at `stroke-width`; cohesion test
  lists the frame among the required lines.

## Feedback log

- 2026-10-26 · owner: "can you make sure that the inset corner for the layers is accurately applied" → measured every
  tile (frame and group cells) against the card's corner less the gap at each corner where both gaps match, at Radius
  12, 0, 4, 8 and pill and Stroke 0, 1 and 2. Three fixes:
  - **The app's hooks leaked into the specimens:** `--area-asset-card-corner` and `--area-asset-card-name-inset`, set
    on the Canvas for the gallery's own tiles, reached the Asset cards drawn in them. The gallery showed the app's 16
    corner and 16 inset, and a group's cells fell to the 2 floor. The tile stage resets both (canvas.css).
  - **Basic:** the frame (invisible, but it clips an image) takes the concentric corner, not 0.
  - **The frame alone:** takes the card's corner. Also, the edge always counts in the frame's corner; only the inset
    follows `radius-concentric`, so a card held at a corner at Square keeps its frame on its inner curve.
  Now every corner is concentric at every combination measured.

- 2026-10-26 · owner 2026-10-26: "Fold Preview frame into Asset card: add the wide aspect, a checker fill and an unnamed containerless frame, move the Inspector to it, and deprecate Preview frame" → `name` optional (no head without it and controls), `aspect="wide"` (2:1), `fill="checker"`; the frame alone keeps its edge at rest and takes the container corner. The Inspector's preview (Icons, Color, Typography, Imagery, Theme) is this card. Tiles Aspect / wide, Fill / checker, Content / frame alone; React tests.

- 2026-10-21 · owner: "is the stroke on the inside frame and outside container the same? i think they should be the same
  or more consistent" → they were not: the card took Card's `border-card` (#ee light, 1.16:1 on the page) and the frame
  `border-divider` (#e2, 1.21:1 on the card's recessed fill); dark both #333. The card edge now takes `border-divider`
  too, so both are one stroke (light #e2, dark #333, 1px). The frame could not go back to #ee (the owner's "too thin").

- 2026-10-21 · owner: "the frame color and card color dont seem to always update together. the default is a white bg
  frame on a light gray card" and "restrict it to be used only on the component page" → measured the pair (Visual
  pass); the setting demo's scope moved from the frame to the card (demos/asset-card.tsx, the Documentation entry); the
  app's tiles outside the Components tab are plain containers (src/tile.tsx, PlainTile).

- 2026-10-21 · owner: "the asset card strokes on the inner frame look too thin, can you make sure the asset card is
  correctly designed and implemented?" → the frame's edge moved from the card's role (`border-card` at `border-width`,
  1.08:1 on the card in light) to the rule for a frame with no shadow (`border-divider` at `stroke-width`, 1.21:1);
  dark unchanged; the containerless selected ring now tops up from that edge. asset-card.css, cohesion.test.mjs.
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

## Review note, 2026-10-22 (round 67)

- **What changed:** every selected edge (the framed card, a component's frame, an image or group ring) is the same
  2px vibrant blue drawn inside (the framed card was 1px dark blue); hovering lifts the card by `0 2px 4px -1px` at 8%;
  focus sits 2px off. The frame inside the card has a firmer edge in light, #e2e2e2 instead of #eeeeee, still 1px,
  and the card's own edge now matches it.
- **Why:** your round 65 note on the selected border, answered by your picks on the state page (2026-10-21), now the
  defaults of the state settings. The frame's line was the card's edge colour, which almost disappears on the card's
  grey ground (1.08:1); a frame with no shadow takes the divider colour, as Table's does.

## Review note, 2026-10-23 (frame tone)

- **What changed:** the frame inside the card is no longer always the page tone. Where the card is the page tone too
  (Card tone 0, a lighter step clamped at white, or the raised fill on a white page) the frame takes the recessed tone,
  light #f7f7f7 on a white card at the defaults, slightly lighter than the page in dark. Everywhere else it is white as
  before. Controls and edges inside the frame step from its tone.
- **Why:** with the card matching the page, frame and card were one tone and only the hairline held the frame (owner,
  2026-10-23). The frame stays the page tone wherever it can, because components are drawn for the page.

## Review note, 2026-10-24 (gallery cards)

- **What changed:** a new public hook, `--area-asset-card-name-inset`, sets how far the name sits from the card's edge;
  at its default nothing moves. The app sets it to 16 so its Asset cards match the colour cards (corner 16, name 16 in,
  the same UI size). An Asset grid item now takes its column in any grid List box, not only inside Asset grid, so the
  app's type cards (List box sections, each a grid) fill their columns.
- **Why:** the owner: "i do want to see the name below treatment have the same corner, padding, and text title size to
  match color", with basic and the name below as the app's card for Components and Typography.

## Review note, 2026-10-24 (overlay caption, Imagery)

- **What changed:** `caption="overlay"`: the asset fills the card and its name appears on it, a small plate at the
  bottom start, while the card is hovered or focused (always on touch screens). The app's Imagery tab (was Brand) shows
  every image this way, as a basic card the image fills.
- **Why:** the owner: "make the images themselves fill the full width of the card, and also have names/titles appear on
  hover", after Bencho's block gallery.

## Review note, 2026-10-24 (grid gap, group inset, rows)

- **What changed:** `--area-asset-grid-gap` sets the grid's gap (12 by default; the app uses 8). An Asset grid's rows
  share their top and each card keeps its own height. Where the host sets the name inset, a group's cells line up with
  the name and sit that far apart and from the edge; at the default they keep the design's 4.
- **Why:** the owner: "the images inside the groups can align to the text and have gaps that match the margins",
  images with "their own unique height, and the top of each image row always aligns", and "maybe everything can be 8px".

## Review note, 2026-10-24 (overlay controls fix)

- **What changed:** with `caption="overlay"` the corner controls (the Components cards' Copy) now show with the name
  on hover and focus; before, they stayed invisible. With `caption="below"` on a touch screen they now show at rest, as
  documented. The rule that hides the controls is a plain selector list instead of `.area-asset-card:is(…)`, which had
  outranked the rules that show them. A cohesion test checks that every rule showing the head or the controls
  outranks the rule hiding them.
- **Why:** the owner asked what had happened to the Copy button on the component cards. It was still there, named
  and clickable, but invisible since overlay became the Components default (PR #160).

## Review note, 2026-10-26

- **What changed:** Asset card took over Preview frame's job:
  - With no name and no controls, it has no head. Containerless, it is the frame alone: it fills its column and keeps
    its edge at rest.
  - A wide 2:1 shape.
  - A checker fill, which shows transparency under a colour.
  - The Inspector's preview at the top of Icons, Color, Typography, Imagery and Theme now uses it.
- **Why:** you chose to fold Preview frame into Asset card. They drew the same frame twice, and Preview frame had one
  use.
- **Differences from Preview frame:**
  - Landscape is Asset card's 5:4, not 4:3.
  - The edge is the frame's own (`border-divider`), not Card's lighter one.
  - Content sits 12 in, as every asset does.

## Review note, 2026-10-26 (corners)

- **What changed:** the inner frame's corner now follows the card's at every corner and stroke setting. The gallery
  shows Asset card as it ships: its own corner and its 4 inset. Before, it took the app's 16, so a group's cells sat 16
  in with near-square corners.
- **Why:** you asked to make sure the inset corner is applied accurately. Measuring every tile found the app's corner
  hook leaking into the specimens, a basic card's square frame, and the frame alone rounder than its card.

## Review note, 2026-10-27 (visual pass)

- **What changed:** in a group, a cell that holds a component or a card now has the light edge a component's frame
  has on its own card, and the frame's tone; image cells are unchanged, with no edge.
- **Why:** white on the card's near-white tone with no edge, the thumbnails floated loose and the four cells stopped
  reading as one 2 × 2; each element cell is its own card's frame shrunk, so it draws that frame.
- **Also:** the Stage now shows Asset card as it ships, 4 in with its own corner. It still took the app's tile corner
  and 16 inset, which the gallery tiles stopped taking on 2026-10-26, and an Asset grid the app's 8 gap for its 12.

## Review note, 2026-11-01 (feed and gallery content)

- **What changed:** `aspect="screen"` (16:9); `fit` for images (natural, cover, contain); `mosaic="strip"` for groups;
  a public hook `--area-asset-card-inset` that holds a basic card's asset that far from its outer edge on its three open
  sides (the edge counted once; 0 by default, so nothing shipped moves).
- **Why:** the owner asked for one family of containers across the app's feeds, project cards with one 16:9 picture,
  a redesigned collection card, and Are.na's footprint grid beside the waterfall and a fixed ratio as gallery views. The
  app now draws References' and Home's collections as strips at 16:9, image grids in Grid (contain, square),
  Waterfall (natural) or Fixed ratio (cover at 16:9, 5:4 or 1:1), and holds their pictures at its 16 frame inset.
- **Tiles:** Aspect / screen, Fit / cover, Fit / contain, Mosaic / strip. Tests: asset-card.test.mjs (classes, the ratio,
  a strip's cells, the CSS rules).
- **Then (same day, the owner's "Group container" designs):** the lead mosaic (one large, two beside, 2 apart, square
  inside) became the strip; the frame corner keeps at least `radius-small` (never more than the card's inner curve) where
  the inset runs the concentric corner out, so cells and contained images 16 in are rounded 8 like the app's screens.

## Review note, 2026-11-01 (one card in three shapes)

- **What changed:** `aspect="landscape"` is 4:3 (was 5:4, which read as square beside a square card); a strip scrolls
  sideways inside the card's edge, starting on the inset, its row the frame's aspect or `--area-asset-card-strip-height`.
- **Why:** the owner: "they should all be the same just variants of each other … a more landscape AR … and then a square
  AR one for components", "maybe … 4:3", "some projects might want a full thumbnail 16:9 cover", and of collections "one is
  just a full width horizontal scroll version". The app draws components square, everything else 4:3, a project's
  thumbnail as a 16:9 cover (its plain tile's `shape`), collections square 2 × 2 in a grid and a scrolling strip across
  Home's column. Preview frame's and File tile's landscape were already 4:3.

## Review note, 2026-11-01 (caption outside: the app's cards)

- **What changed:** `caption="outside"`: the card is its frame alone, the asset `--area-asset-card-inset` in on every
  side (8 by default), its fill, edge, corner, lift and selected edge drawn by the frame; the head sits under the card
  on the page, 4 below it, the name 4 in and the controls ending on the card's edge. Containerless and outside: the same
  card clear at rest, its fill and edge on hover, focus or selection, nothing moving. A contained image no longer draws an
  edge. Tile: Caption / outside.
- **Why:** the owner's pick in the card explorer (artifact KCvLgSPg…): "apply 8 and update the corner radius to 16, also
  dont add a stroke to the inset images", "move the below text/button row even closer to 4", and of the card toggle "the
  card is still there it will just appear on hover". The app's Components, References, Home and Typography cards and its
  plain tiles all take it: 16 corners, 8 in, names 4 below at 13, 16 apart, square or 16:9.

## Review note, 2026-11-01 (badge on the picture)

- **What changed:** `badge` (element `badge`): a status or label laid on the asset at the frame's top start, on a raised
  plate (the surface, `control-sm` tall, a pill, `shadow-control`, padded as the overlay name's plate), shown at rest; an
  `iconOnly` badge takes a round plate. The plate sits concentric with the frame's corner: in by the frame's corner less
  the pill's radius (2 at the default; flush, the frame's clip took 0.6 off the pill's curve), or as far as the overlay
  name sits, whichever is more.
- **Why:** the owner, 2026-11-01: "can these badges also be overlayed on top of the asset cards/containers in area for
  designs, covers, images, etc. what would that look like?", then "go with your recommendations". The live sheet
  (https://claude.ai/artifact/R5WRGDZRsypsQiawvYgtnq, "On pictures") laid six treatments on a light design, a dark photo
  and a vivid cover: plain straight on the picture was lost on the photo and the cover; the solid variant read but put a
  block of colour on every card; modern carried its own border and corner. The overlay name's plate, mirrored to the top
  and holding a plain badge, keeps the badge's own contrast on the surface whatever the picture, and is one plate system.
- **Verdict:** in review.
- 2026-11-01, same day · owner: "the on pictures badge should be more inset, do you think this is good? or is it better
  to put badges below in the title/footer of the cards" → the plate sits 8 in from the frame's top and start (was 2,
  concentric with the corner), the asset's own inset in a card. Placement: a status goes in the card's name row where it
  has one (the app's cards, caption outside); the slot is for pictures without a row (caption overlay, image libraries).
  On a 16:9 design the top start is where its logo and navigation sit, and a status there covers the design.
