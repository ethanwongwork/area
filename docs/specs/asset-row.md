# Asset row spec

**Status:** complete · 2026-10-12 (approved, round 16); was: in review · 2026-10-12 (round 16, after round-15 changes)
**Captures:** `docs/research/captures/inspector-rows/`
**Peers:** Token row and Box model (the inspector's other parts), File upload item (a file with name and meta; an
upload card, not a list row), Menu rows (list row rhythm), Box model's margin ground (the preview well), Button ghost sm
(the row's action)

## Owner decisions

- 2026-10-11: Figma Dev Mode inspector reference → the plan named a Link row / Asset row.
- 2026-10-12: "reviewed round 13, keep working" → Asset row, measured from Dev Mode's Assets section.
- 2026-10-12, review round 14 (rethink): "look up other asset rows, not just figma" → surveyed Penpot, Material 3,
  shadcn Attachment and Item, Untitled UI, Fluent, Polaris, Carbon, Atlassian and Zeplin
  (`docs/research/asset-row-survey.md`); redrawn on what they agree on: a 40 preview inset 8 in a 56 row, 12 to the
  text, the name strong, the action visible at rest.
- 2026-10-12, review round 15 (needs changes): "should the image be full container? should there be a light stroke
  too?" → yes to both: an image fills the well (`cover`, no inner margin; icons stay centred on the ground), and the well
  takes the swatch ring (black 10%) over whatever fills it.

## Job and boundaries

Asset row lists one exportable asset of a layer: a preview of it, its name, a detail line (format, size), and an
optional trailing action (download, export). Read-only. Not File upload item (a bordered upload card with progress and
status), not a Menu row (a command), not Token row (a token's name and value).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| preview | an icon or vector drawn in the well, or an image | Dev Mode previews each asset | Dev Mode Assets |
| meta | a detail line, or none | format and size | Dev Mode Assets (placeholder second line) |
| actions | trailing slot | download / export | Dev Mode (on hover in the real product; not captured) |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma-dev | target product | Dev Mode inspector, Assets section: three rows (loading placeholders behind the "Get Dev Mode" dialog) | figma.com, the owner's "Foundation Doc Assets (Copy)", 2026-10-12, light; nothing upgraded, returned to Design Mode | evidence only | `figma-dev--asset-row`, `figma-dev--assets-panel` |
| survey | design systems and products (source at pinned commits; Zeplin estimated) | Penpot Assets list (@5eb33add), Material 3 list (material-web @47adb655), shadcn Attachment and Item (@993eb2c3), Untitled UI file item, Fluent attachment, Polaris Thumbnail + ResourceItem, Carbon, Atlassian, Zeplin | `docs/research/asset-row-survey.md` | evidence only | not captured (source reads) |

## Anatomy

```
figma-dev (11/16 Inter 450)
panel     Assets: a 40 title row, rows 56 apart, 12 bottom padding
row       div.assetRow        319 × 56, flex, centre
  media     div.assetPreview   56 × 56 at the panel's edge (0 in), rgb(245, 245, 245), radius 2; a 16 mark centred
  content   div.assetDetails   263 × 32, 12 from top and bottom, padding 0 4 0 16, column, gap 8 (two 12 bars)
```

Area:

```
div   .area-asset-row
  span  __preview     40 square well, 8 in: bg-subtle, radius-small, 4 inside; an image contained, or an icon at icon-md
  span  __text        column: __name 12/16 strong, __meta 12/16 muted; 12 from the preview
  span  __actions     trailing, inside the row's 8 padding
```

Inset equations: preview 8 from every edge of the 56 row (8 + 40 + 8), so stacked wells sit 16 apart; text 8 + 40 + 12
= 60; text block 16 + 16 = 32, (56 − 32) / 2 = 12 above and below (Figma 12).

## Decisions

| Slot · property | Reference | Area | Basis | Reason when it differs |
|---|---|---|---|---|
| row height | 56 | 56: 8 + 40 + 8 | Figma; shadcn Attachment (8 around 40) | — |
| preview | 56 flush at the panel edge, radius 2 | 40, inset 8, `bg-subtle` (#f7, Box model's ground), `radius-small` (6), a 1px swatch ring over it; an image fills it (`cover`), an icon sits 4 inside | survey: 40 in shadcn, Penpot, Polaris, Untitled UI; every reference but Figma insets; Penpot 6 | Figma is the outlier (flush, 56, radius 2) |
| preview content | a 16 placeholder mark | an image `object-fit: contain` with 8 inside, or an icon at `icon-xl` (24) | Figma's centred mark | — |
| text | 16 in, two lines | 12 gap; name 12/16 strong, meta 12/16 muted, no gap (32) | survey: 12 in Untitled UI, Fluent, Polaris; name 500 / 600 in shadcn, Untitled UI, Fluent | Figma's 16; Area's inspector type |
| action | not captured | trailing slot inside the 8 padding, visible at rest | survey: file and attachment rows keep it visible (shadcn, Untitled UI, Fluent, Zeplin) | list patterns hide it until hover; Area keeps it, so it is never hover-only |

## States

Static. A trailing action keeps its own states (Button).

## Behavior and accessibility

A plain `div`; the name and meta are read as text; an image preview takes `previewAlt` (default empty: the name already
says what it is). Native props and the ref reach the root.

## Verification

- 2 product captures (redacted, checksums verified). Area captures not taken yet.

## Review note, 2026-10-12 (round 16)

- **What changed:** an image now fills its preview edge to edge, and every preview has a light outline, the same one the
  colour swatches now use.
- **Why:** you asked whether the image should fill the container and whether there should be a light stroke.

## Review note, 2026-10-12 (round 15)

- **What changed:** the preview is smaller (40) and sits inside the row with space around it, the text starts closer to
  it, and the name is in the strong weight.
- **Why:** you asked to look beyond Figma. Every other product and design system we checked (Penpot, shadcn, Material,
  Polaris, Untitled UI, Fluent, Zeplin) insets a 40-ish preview; Figma's flush 56 was the outlier.

## Review note, 2026-10-12

- **What changed:** New component. Asset row lists a layer's exportable asset, as in Figma Dev Mode's Assets: a preview,
  its name and a detail line, with an optional action at the end.
- **Why:** it's the next inspector part from Dev Mode; its size and spacing were measured there, and its preview well and
  text styles reuse Box model's grey ground and File upload's name and detail styles.

## Feedback log

- 2026-10-12 · owner: "reviewed round 13, keep working" → Asset row from Dev Mode's Assets rows, in review.
- 2026-10-12 · owner, review round 14 (rethink): "look up other asset rows, not just figma" → survey of other products
  and design systems (`docs/research/asset-row-survey.md`) before redrawing.
- 2026-10-12 · owner, review round 15 (needs changes): full-bleed image, light stroke → applied. Round 16.
- 2026-10-12 · owner, review round 16: approved.
