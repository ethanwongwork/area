# Box model spec

**Captures:** `docs/research/captures/box-model/`
**Peers:** Box field (edits padding and radius; this only shows them), Panel (the inspector it sits in), Count and
Badge (small value chips), Code block (the inspector's other read-only block)

## Owner decisions

- 2026-10-11: shared a Figma Dev Mode inspector ("can any of these from figma dev mode be componentized? i want the
  inspector to look more like this ... into tables, containers, diagrams") → recommended four new parts; the box-model
  diagram (G) the most distinctive.
- 2026-10-12: "keep working, start on the inspector components" → Box model first: it had the best evidence (Dev
  Mode's real layout renders behind its upgrade dialog on the owner's Free plan).

- 2026-10-12, review round 12 (needs changes): no dashed lines; the outer box takes its component family's corner; the
  inner corners stay round.
- 2026-10-12, review round 11 (rethink): "the background can still be gray and there can and should be strokes at
  every container level just the colors can be different. i do like the margin in a box with lines actually, maybe the
  corner radius can be rounder and the layer shapes bigger overall?" → the margin box keeps its dashed lines and gets
  Figma's grey ground back; every box has a 1px stroke in its own colour; rings 24 → 32; corners 16 / 12 / 8 / 6.
  — superseded in part 2026-10-12 (round 12): the margin's stroke is solid, not dashed, and its corner is the
  container family's 12 (corners 12 / 12 / 8 / 6).
- 2026-10-12, review round 10 (rethink): "any ways to make it look more like area, more of an original design so its
  not just copying figma, also can you make sure the corner radius numbers sit inset equally in the corners?", with "go
  with your recommendations". Redrawn in Area's language: the margin as a dashed outline at the container corner (space,
  not a surface; no grey well), no chips or crossing lines (plain tabular values, spacing values in the tone's ink),
  every ring a square of `control-xs` so the rings read evenly, a "Margin" label like the others, the border box on the
  surface in a 1px divider ring at `radius-small`, the padding filled in the tone at `radius-min`, the size the one
  strong value. Corner radii are placed by their cap box (`text-box: trim-both cap`) at (ring − 1cap) / 2 from both
  edges, so each sits on its corner's diagonal (measured: 7.7 from both edges in every corner). The round-10
  recommendations (32 margin rows, Area's corner over the element's) were superseded by the square rings and kept,
  respectively. — superseded in part 2026-10-12 (round 11): the margin is a grey box with a stroke again, every box has
  its own stroke, rings are `control-md` (32) and the corners rounder; the cap-box corner placement and plain values stay.

## Job and boundaries

Box model shows a layer's spacing as nested boxes: margin around the border box, the border box with its corner radii,
the padding box, and the content's size at the centre. It is read-only, one image to assistive technology. Not Box
field (an editor), not a Table of values (Description list does that), not a ruler or canvas overlay.

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| tone | info (default) | Spacing in the measuring blue: spacing values in `fg-info`, the padding box in `info-surface` with an `info-border-strong` stroke, the content stroke `info-border` | the owner's Dev Mode reference (blue margin chips, blue padding box) |
| tone | neutral | Greyscale: spacing values in `fg-muted`, the padding box in `bg-active` with a `border-subtle` stroke, the content stroke `edge-control` | Figma's Dev Mode drawing as captured (`box_model--paddingBoxGrayscale`, `unrealGap`) |
| content | per side, per corner, caption | Different values per side (CSS order), radii per corner, a note such as "border-box" | the owner's reference (corner radii, "border-box") |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Dev Mode inspector with an instance selected: Layer properties (box model), the List / Code toggle, the CSS picker, a code group | figma.com, owner's file, 2026-10-12, light. Dev Mode is behind "Upgrade to Professional" on the owner's plan; the panel renders under the dialog with placeholder bars for values. Nothing was upgraded; the file was switched back to Design Mode | evidence only | `figma-dev--box-model`, `figma-dev--section-heading`, `figma-dev--code-tabs`, `figma-dev--code-heading`, `figma-dev--code-block` |
| owner | reference image | Figma's Dev Mode inspector with real values (blue margin chips, corner radii, a blue padding box, "608 × 184", "border-box") | chat, 2026-10-11 | — | not measurable (an image) |

Not captured: real values and the blue paint (paywalled, so colours come from the matching Area roles), hover on values,
dark.

## Anatomy

```
figma (Dev Mode, 11/16 Inter)
well     div.gapBox         287 × 190, grid 32 | 223 | 32 × 35 | 120 | 35, radius 5, rgb(245,245,245)
  side     div.gap            a 1px rgb(217,217,217) line across the zone; a value chip centred on it:
                               16 tall, padding 2 3, radius 2, rgb(217,217,217) (grey placeholder state)
  border   div.borderBox      223 × 120, grid 32 | 159 | 32 × 24 | 72 | 24, white, inset 1px rgb(230,230,230) ring,
                               radius 16 (the element's)
    label    "Border"           at the top ring's start, padding 4 8, 11/16 at 50% black
    padding  div.paddingBox     159 × 72, grid 32 | 95 | 32 × 24 | 24 | 24, rgb(245,245,245), inset 1px ring, radius 2
      label    "Padding"          top-left, padding 4 8
      size     div.innerSizeBox   95 wide, 1px dashed rgb(230,230,230), radius 2, white, padding 4 2
```

Area:

```
div    .area-box-model[--tone]        role="img", aria-label "Margin 24, border 1, padding 16, radius 8, size 608 × 184";
                                        the margin: bg-subtle in a solid 1px border-subtle line, radius-container
  span   __label                          "Margin", muted
  div    __side--top|right|bottom|left    margin values (`__value`), the tone's ink
  div    __border                         surface, 1px inset edge-control stroke, radius-container
    span   __label                          "Border", muted; clears the top-left corner value when radii show
    div    __corner--top-left…              radius values (with `radius`), muted
    div    __side--…                        border widths, default ink
    div    __padding                        the tone's fill and stroke, radius-control-md
      span   __label                          "Padding", muted
      div    __side--…                        padding values, the tone's ink
      div    __content                        surface, 1px stroke in the tone's content line, radius-small; "W × H" strong
  span   __caption                        "border-box", muted, at the bottom ring's end, 8 in
```

Insets: every ring is a square of `control-md` (32, compact 28), the margin ring included (round 11: "bigger"; Figma:
32 columns, 24 rows, a 35 margin row). Labels 8 in from their ring and centred in its row ((ring − 16) / 2, 8 at 32;
Figma's 4 at 24). Corner radii: cap box at (ring − 1cap) / 2 from both edges.

## Measurements

Generated with `node scripts/capture-compare.mjs` (rows abbreviated).

| slot · property | figma · dev-box-model | area · default |
|---|---|---|
| well size | 287 × 190 | 288 × 184 |
| well radius / fill | 5px · rgb(245, 245, 245) | 6px (`radius-small`) · `bg-subtle` rgb(247, 247, 247) |
| border box | 223 × 120, 32 in, radius 16 (the element's), white, 1px rgb(230) ring | 224 × 120, 32 in, radius 12 (`radius-container`), surface, 1px divider ring |
| padding box | 159 × 72, radius 2 | 160 × 72, radius 2 |
| label | padding 4 8, at x 64 | padding 4 8, at x 64 |
| type | 11/16 450 Inter | 12/16 400 Geist (`text-xs`), tabular numerals |

## Decisions

| Slot · property | Reference | Area | Basis | Reason when it differs |
|---|---|---|---|---|
| ring size | Figma 32 columns × 24 rows | 32 × 32 squares (`control-md`, compact 28) | owner (round 10: square; round 11: "bigger"), Figma's 32 columns | square rings put corner values on the diagonal |
| margin | Figma: a grey well rgb(245), radius 5, values as chips on crossing lines | `bg-subtle` (#f7) inside a solid 1px `border-subtle` (#d4) stroke, `radius-container` (12), plain values | owner (round 11: grey ground, a box with lines; round 12: no dashes, the family's corner) | the container family's corner, as Panel and Code block |
| border box | Figma: white, 1px rgb(230) ring, the element's radius | surface, 1px inset `edge-control` stroke, `radius-container` (12) | Figma's ring; owner round 11 (strokes at every level, rounder) | — |
| padding | Figma: grey (or blue) fill, 1px ring, radius 2 | the tone's fill and its strong border (neutral: `bg-active`, `border-subtle`), `radius-control-md` (8) | the owner's reference blue; round 11 strokes | — |
| content | Figma: white, 1px dashed rgb(230), radius 2 | surface, 1px stroke in the tone's border (`info-border`; neutral `edge-control`), `radius-small` (6), at least one ring tall | Figma; round 11 strokes and corners | solid: the dashes belong to the margin |
| values | Figma 11/16 450 | 12/16 tabular; spacing values in the tone's ink, border widths default, the size `weight-strong` | Area's smallest UI text | — |
| corner radii | Figma: none drawn (the owner's reference: centred in 32 × 24 cells) | cap box (ring − 1cap) / 2 from both edges | owner ("sit inset equally in the corners"), inset.css cap reference | — |
| labels | Figma 4 8 padding, Border and Padding | 8 in, centred in the ring's row (8 down at 32); Margin, Border and Padding, muted | Figma | the rings grew to 32 |
| tone | owner's reference blue | info: `fg-info` ink (the text role; `info-solid` is a fill and read 4.35:1 in light, 3.16:1 in dark, found 2026-10-14), `info-surface` fill; neutral: `fg-muted` ink, `bg-active` fill | Area's info role | Area's accent is neutral by default |
| inks on their grounds | — | info's spacing values darken just enough to hold 4.6:1 as the margin's recessed ground deepens; in dark the neutral padding's inks take Code block's marked-line lift (private `--_ink`) | Layers sweep 2026-10-16 (owner: "go with your recs") | defaults unchanged |

## States

Static. Forced colors: the border, padding and content boxes take a CanvasText border in place of their inset strokes.

## Behavior and accessibility

`role="img"` with a generated summary as its name; the drawn numbers are not read separately. Missing values show "–".
Native props and refs reach the root.

## Peers and consistency

| Peer | Shared role | Peer value | Box model | Note |
|---|---|---|---|---|
| Box field | padding and radius | edits them, linked or per side | shows them | an editor and its readout |
| Count | small number on a plate | 16, 12px tabular, pill | 12px tabular, no plate (plain values since round 11) | Figma's chips are not drawn |

## Visual pass

Gallery at 1:1 and 1.6×, light default: the margin chips sit on their lines, the border box carries its corner radii,
the padding box is tinted, and the size sits in a dashed box, as in the owner's reference. Not compared side by side
with Dev Mode's real values (paywalled), not checked in dark or compact.

## Verification

- 9 captures (5 product, 4 Area); checksums verified; product captures redacted.
- Build (parity, token references), React tests (`box-model.test.mjs`, 2).
- Unverified: dark, compact, a screen reader, very long values (they truncate with an ellipsis).

## Open questions

None open. (Round 10's two were accepted; square rings replaced the 32 margin row.)

## Review note, 2026-10-12

- **What changed:** New component. Box model draws a layer's margin, border, padding, corner radii and size as nested
  boxes, like Figma Dev Mode's "Layer properties", for the inspector.
- **Why:** you asked for the inspector to show information as diagrams like Dev Mode. Its layout was measured from Dev
  Mode itself; the blue comes from your reference.

## Review note, 2026-10-12 (round 11)

- **What changed:** Box model is redrawn in Area's own style: the margin is a dashed outline instead of a grey panel, the
  values are plain numbers without Figma's chips and lines, every ring is an even square, and each corner radius now
  sits the same distance from both edges of its corner.
- **Why:** you asked for it to look more like Area than a copy of Figma, and for the corner numbers to be inset
  equally.

## Review note, 2026-10-12 (round 12)

- **What changed:** the margin is a grey box inside dashed lines again, every box has its own outline in its own colour,
  the rings are bigger (32 instead of 24) and every corner is rounder, each nested inside the one around it.
- **Why:** you asked for the grey background back, strokes at every level in different colours, the margin as a box
  with lines, rounder corners and bigger shapes.

## Review note, 2026-10-12 (round 13)

- **What changed:** the margin box's outline is a solid line now, and its corner is the same as the inspector's other
  containers (Panel, Code block). The inner boxes keep their rounded corners.
- **Why:** you asked for no dashed lines and for the outer box to take its component family's corner, with the inner
  corners still round.

## Review note, 2026-10-16 (round 30)

- **What changed:** the blue spacing values darken as the gray margin deepens on a gray page, and in dark the
  neutral padding's labels lighten on the lightest grounds. Defaults unchanged.
- **Why:** the Layers sweep: values fell to 3.6:1 on the margin at light 90, and the neutral labels to 4.0:1 at dark
  24 + 8. Look at **Gray page** and **Lightest dark**.

## Feedback log

- 2026-10-12 · owner: "keep working, start on the inspector components" → Box model from Figma Dev Mode's layer
  properties; 9 captures, 4 gallery tiles, in review.
- 2026-10-12 · owner, review round 10 (rethink): more Area, less Figma; corners inset equally; "go with your
  recommendations" → redrawn as above; corner values measured 7.7 from both edges in all four corners. Round 11.
- 2026-10-12 · owner, review round 11 (rethink): "the background can still be gray and there can and should be strokes at
  every container level just the colors can be different. i do like the margin in a box with lines actually, maybe the
  corner radius can be rounder and the layer shapes bigger overall?" → read as: the margin box gets its grey ground back
  and keeps its dashed lines; every box (margin, border, padding, content) has a 1px stroke, each level its own colour;
  rings 24 → 32 (`control-md`, Figma's 32 columns); corners rounder, nested (16 / 12 / 8 / 6). Round 12.
- 2026-10-12 · owner, review round 12 (needs changes): "no dashed lines, the outer container can be its own unique radius,
  that matches whatever component family it should be. but the inner radius should be round. maybe" → the margin box's
  stroke is solid (`border-subtle`); its corner is the container family's (`radius-container`, 12, as Panel and Code
  block); the inner boxes keep their rounded corners (12 / 8 / 6). Round 13.
- 2026-10-12 · owner, review round 13: approved.
- 2026-10-14 · all-axis audit → spacing values take `fg-info`, the info text role (were `info-solid`, a fill: 4.35:1 on `bg-subtle` in light, 3.16:1 in dark, under 4.5 for 11–12px text) → box-model.css.
- 2026-10-16 · owner: "go with your recs, fix them in that order" (after the Layers sweep, docs/research/layers-2026-10-16/sweep/README.md) → inks follow the grounds they sit on. Info's spacing values on the margin's recessed ground darken just enough for 4.6:1 as it deepens (fg-info, luminance 0.134; 3.63:1 at 90 + 8 before, none at the defaults); in dark the neutral padding's labels and values take Code block's marked-line lift for its 6.7% wash (past a raised L 0.225; 4.04:1 at dark 24 + 8 before); in light the Layers model's muted ink, now solved on the soft mark, holds on it (4.27:1 at 95 + 0 before). Labels, corners and values read a private `--_ink`.
