# Design card spec

One design in a container at its true size, placed by its layout's rule, with its name and true size under it. Opened,
the same ground grows to Full view (the app's design viewer). Built 2026-11-06 from the owner's picks on the Design
Containers page (2026-11-05; [research](../research/design-containers-2026-11-05/README.md)).

- Package: `DesignCard`, `placeDesign` (`packages/react/src/components/DesignCard.tsx`), `design-card.css`, manifest
  `designCard`.
- Status: in review (`component-status.mjs`).

## Owner decisions

- 2026-11-05: "i want to focus on the containers, no more 'asset cards' the containers contain designs that are high
  fidelity zoomable vector designs … this container will also be the main viewing method for looking at designs 'full
  view'."
- 2026-11-05, the Design Containers page's five questions. The owner picked the recommendation for every question:
  - Q1 `combine`: one component, the card at rest and Full view when opened.
  - Q2 `margin`: a tenth of the short side, 12 to 48 (framed designs a twentieth, 8 to 48).
  - Q3 `small`: hold 50%, crop on the focus.
  - Q4 `phone`: stand and run off the bottom.
  - Q5 `name`: under the card, 4 below.
- 2026-11-06: "Yes, build it."

## Job and boundaries

Shows one designed thing (a control, a component, a pattern, a type line, a screen, a phone, an icon, a colour) as it
is, in a gallery card that never enlarges it and never shrinks a part past legibility.

- **Useful.** Every design tool's canvas thumbnail does this job: a frame's thumbnail in Figma's file browser, a
  component's card in a design system's gallery. In the app it holds:
  - every specimen on Components;
  - every theme, project and system screen.
- **Unique.** Asset card frames a picture (an image at its own ratio, cropped or contained; a group as a mosaic) with
  the asset filling its frame. Design card lays out live DOM at its true size and places it by a rule per kind of
  design. Its jobs and behaviour differ: it measures, holds and crops, and keeps icons at whole multiples.
- **Composable.** The card's paint is Asset card's outside-caption card (corner, edge, tile tone, lift, selection). The
  caption holds a Badge or a Copy button as the app's cards do.
- **Consistent.** It paints the tile ground, declared in `layers.css`, so the controls inside step their fills from it.
- **Will not:**
  - enlarge a design in a gallery (Full view zooms);
  - frame images or groups (Asset card);
  - choose the gallery's columns (the host's grid).

## Variants

| Axis | Values | Use |
|---|---|---|
| `layout` | `part` (default) | A control, a component, a pattern, a type line. A tenth's margin, at most 100%, held at 50% and cropped below |
| | `screen` | A window. A twentieth's margin, always whole (PRODUCT_UI rule 26.2), in a 16:9 card |
| | `phone` | A phone. Stands from the top margin at 60% of the width and runs off the bottom (owner, 2026-11-04) |
| | `icon` | An icon at whole multiples, 1× to 4×, so its pixels stay whole |
| | `color` | A colour painting the card, with the swatch ring |
| `aspect` | `square` (default), `wide` (16:9) | A screen is wide unless set. Asset card's `wide` is 2:1 and its 16:9 is `screen`; `screen` can't be an aspect here (it is a layout, one class), so the two meet when Asset card retires (system gaps C8, 2026-11-07) |
| `focus` (prop) | `center` (default), `top`, `start` | Where a held part is kept when the card crops it |
| `interactive` | boolean | The card is a control: hover lifts, focus rings, a press drops |

## Anatomy

- root: the ground over the caption, 4 apart.
- ground: the container (corner 16 at the default, tile tone, card edge, lift). It clips what runs past it.
- design: the design's box at true size, positioned by a transform.
- caption: the name 4 in, the detail (true size by default, muted, tabular figures), the actions at the end.

## Decisions

- **The rule.** `placeDesign(layout, design, room, focus)`:
  - margin = clamp(round4(short side × 0.1), 12, 48) for a part or an icon;
  - clamp(round4(short side × 0.05), 8, 48) for a screen or a phone;
  - 0 for a colour;
  - x and y are rounded to whole pixels;
  - an icon's multiple is the nearest whole one to a quarter of the room, 1× to 4× (2× at 240, 3× at 320, 4× at 480):
    rounded, not floored, since the card's edge takes a pixel or two off the room.
- **Measured, not declared.** The design's box is laid out at `max-content` and read with `offsetWidth` and
  `offsetHeight`, which a transform leaves alone. A ResizeObserver places it again when the card or the design changes.
- **A design with no width of its own** is laid out at Area's field width, `--area-input-inline-size` (16rem). This
  covers a design that stretches, such as a skeleton line. The app's fit.ts used 256 for the same case.
- **Screens** are given their true size (`designWidth` 1920, `designHeight` 1080), so a ScreenFigure draws at 1:1 and
  the card shows it whole.
- **The ceiling is Full view's margin.** 48 is the design viewer's `MARGIN`, so a card at its largest and Full view keep
  the same room.

## States

- selected: the ground's edge in `stroke-selected`, with the Selected stroke width and tint.
- interactive: `:focus-visible` rings the ground. Hover lifts it, or at Hover lift 0 darkens its edge one step; a press
  drops it.

## Behavior and accessibility

- Not a control by default. The host makes it one with `interactive`, a role, a tab stop and `aria-pressed`.
- `designProps.inert` keeps a shown design's controls out of the tab order.

## Sources

- The Design Containers page (artifact E95K8UoMuAYPLDVBNJFMHT) and its research folder: the rules, drawn on the
  illustration skill's real screens, phones and vignettes.
- Asset card's outside caption (`asset-card.md`): corner, edge, caption, states.
- The design viewer (`apps/desktop/src/design-viewer.tsx`): margin 48, zoom, pixel grid.

## Measurements

| Value | Source |
|---|---|
| Corner 16 at the default | The card system (2026-11-01): container radius + 8, concentric |
| Caption 4 under the ground | The card system (2026-11-01) |
| Name 4 in | Asset card, caption outside |
| Margin 12 to 48 (part), 8 to 48 (framed) | Owner's pick Q2 |
| Hold at 50% | Owner's pick Q3 |
| Phone at 60% of the width | Owner's pick Q4, Illustrations 2026-11-04 |

## Peers and consistency

- Asset card: the same ground and caption paint. A gallery that mixes the two reads as one family.
- File tile, Card.

## Verification

- `packages/react/tests/design-card.test.mjs` covers:
  - the rule for every layout (margins, the cap at 100%, hold and crop, phone, icon multiples);
  - the markup.
- In the app (2026-11-06, light and dark, 1440 wide), all 160 Components cards at Auto are placed:
  - Board's 852-wide default holds 50% and is cropped;
  - Skeleton lays out at 256.
- Screen cards on Systems show the 1920 × 1080 screen whole at 19% in a 12 margin.

## Feedback log

- 2026-11-06: built. Adopted by the app's Tile:
  - every screen tile (Home, Systems, Projects, Themes, History, Publish);
  - Components at Auto in the gallery look.
- 2026-11-06, still on Asset card:
  - Fit, the exact zooms, waterfall and the other card looks;
  - Patterns (long pages at their own width);
  - Illustrations (its own gallery frames);
  - images, collections, colours and type sheets.
