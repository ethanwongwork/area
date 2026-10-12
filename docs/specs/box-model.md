# Box model spec

**Status:** in review · 2026-10-12 (round 11, after the round-10 rethink)
**Captures:** `docs/research/captures/box-model/`
**Peers:** Box field (edits padding and radius; this only shows them), Panel (the inspector it sits in), Count and
Badge (small value chips), Code block (the inspector's other read-only block)

## Owner decisions

- 2026-10-11: shared a Figma Dev Mode inspector ("can any of these from figma dev mode be componentized? i want the
  inspector to look more like this ... into tables, containers, diagrams") → recommended four new parts; the box-model
  diagram (G) the most distinctive.
- 2026-10-12: "keep working, start on the inspector components" → Box model first: it had the best evidence (Dev
  Mode's real layout renders behind its upgrade dialog on the owner's Free plan).

- 2026-10-12, review round 10 (rethink): "any ways to make it look more like area, more of an original design so its
  not just copying figma, also can you make sure the corner radius numbers sit inset equally in the corners?", with "go
  with your recommendations". Redrawn in Area's language: the margin as a dashed outline at the container corner (space,
  not a surface; no grey well), no chips or crossing lines (plain tabular values, spacing values in the tone's ink),
  every ring a square of `control-xs` so the rings read evenly, a "Margin" label like the others, the border box on the
  surface in a 1px divider ring at `radius-small`, the padding filled in the tone at `radius-min`, the size the one
  strong value. Corner radii are placed by their cap box (`text-box: trim-both cap`) at (ring − 1cap) / 2 from both
  edges, so each sits on its corner's diagonal (measured: 7.7 from both edges in every corner). The round-10
  recommendations (32 margin rows, Area's corner over the element's) were superseded by the square rings and kept,
  respectively.

## Job and boundaries

Box model shows a layer's spacing as nested boxes: margin around the border box, the border box with its corner radii,
the padding box, and the content's size at the centre. It is read-only, one image to assistive technology. Not Box
field (an editor), not a Table of values (Description list does that), not a ruler or canvas overlay.

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| tone | info (default) | Spacing in the measuring blue: margin chips and lines, the padding box tinted | the owner's Dev Mode reference (blue margin chips, blue padding box) |
| tone | neutral | Greyscale: grey chips and lines, a grey padding box | Figma's Dev Mode drawing as captured (`box_model--paddingBoxGrayscale`, `unrealGap`) |
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
div    .area-box-model[--tone]        role="img", aria-label "Margin 24, border 1, padding 16, radius 8, size 608 × 184"
  span   __label                          "Margin"
  div    __side--top|right|bottom|left    margin values, the tone's ink (the root is a dashed outline)
  div    __border                         surface, 1px divider ring, radius-small
    span   __label                          "Border"
    div    __corner--top-left…              radius values (with `radius`)
    div    __side--…                        border widths
    div    __padding                        tone fill, radius-min
      span   __label                          "Padding"
      div    __side--…                        padding values
      div    __content                        surface, "W × H" in the strong weight
  span   __caption                        "border-box"
```

Insets: every ring is a square of `control-xs` (24, compact 20), the margin ring included (round 11; Figma: 32
columns, 24 rows, a 35 margin row). Labels 8 in from their ring, 4 down (Figma). Corner radii: cap box at
(ring − 1cap) / 2 from both edges.

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
| ring size | Figma 32 columns × 24 rows | 24 × 24 squares (`control-xs`, compact 20) | owner (round 10), Figma's rows | square rings put corner values on the diagonal |
| margin | Figma: a grey well, values as chips on crossing lines | a dashed 1px divider outline at `radius-container`, plain values | owner (round 10: "more like area") | margin is space, not a surface |
| border box | Figma: white, 1px rgb(230) ring, the element's radius | surface, 1px `border-divider` ring, `radius-small` | Figma's ring, Area's nested corner | — |
| padding | Figma: grey (or blue) fill, 1px ring, radius 2 | the tone's fill, no ring, `radius-min` | the owner's reference blue | — |
| values | Figma 11/16 450 | 12/16 tabular; spacing values in the tone's ink, border widths default, the size `weight-strong` | Area's smallest UI text | — |
| corner radii | Figma: none drawn (the owner's reference: centred in 32 × 24 cells) | cap box (ring − 1cap) / 2 from both edges | owner ("sit inset equally in the corners"), inset.css cap reference | — |
| labels | Figma 4 8 padding, Border and Padding | 4 8, Margin, Border and Padding | Figma | — |
| tone | owner's reference blue | info: `info-solid` ink, `info-surface` fill; neutral: `fg-muted`, `bg-subtle` | Area's info role | Area's accent is neutral by default |

## States

Static. Forced colors: CanvasText rings and lines, chips outlined.

## Behavior and accessibility

`role="img"` with a generated summary as its name; the drawn numbers are not read separately. Missing values show "–".
Native props and refs reach the root.

## Peers and consistency

| Peer | Shared role | Peer value | Box model | Note |
|---|---|---|---|---|
| Box field | padding and radius | edits them, linked or per side | shows them | an editor and its readout |
| Count | small number on a plate | 16, 12px tabular, pill | 16, 12px tabular, radius 2 | Figma squares the chip |

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

## Feedback log

- 2026-10-12 · owner: "keep working, start on the inspector components" → Box model from Figma Dev Mode's layer
  properties; 9 captures, 4 gallery tiles, in review.
- 2026-10-12 · owner, review round 10 (rethink): more Area, less Figma; corners inset equally; "go with your
  recommendations" → redrawn as above; corner values measured 7.7 from both edges in all four corners. Round 11.
