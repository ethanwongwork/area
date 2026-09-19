# Construction: overlays and surfaces

Read from source 2026-09-18. Status: **seed** unless stated.

## Dialog (seed: OpenAI, shadcn, Primer, Material, Atlassian, Radix; MUI partly)

| System | Widths | Pad | Radius | Header / footer | Viewport margin |
| --- | --- | --- | --- | --- | --- |
| OpenAI `_variables` | min 250, max 450 | 20 | see file | see file | see file |
| shadcn `sha/dialog` | max 512 from the sm breakpoint; else 100% - 32 | 24; section gap 16 | 10 | header gap 8; footer gap 8; close icon 16 at 16 / 16 | 16 each side |
| Primer `pri/Dialog` | small 296, medium 320, large 480 (xlarge in file); heights 480 and 640 | 16 (other paddings: see file) | 12 | footer gap 8 | max = viewport - 64 (viewport - 12 on narrow); min-width 296 |
| Material 3 `m3/dialog` | n/p | n/p | 28 | divider 1; icon 24; actions 14/20 | n/p |
| MUI `mui/Dialog` | named breakpoints xs to xl (values in theme, not this file) | see `mui/DialogContent`, `DialogTitle`, `DialogActions` | theme | see files | 32 |
| Atlassian `atl/modal-dialog` | small 400, medium 600, large 800 (xlarge in file) | see file | see file | see file | see file |
| Radix `rdx/base-dialog`, `rdx/dialog` | max 600 default | 12 / 16 / 24 by size | 8 / 8 / 12 | n/a | overlay pad 32 top, 16 sides |

**Consensus so far.** Named widths in three or four steps: about 300 to 400, 450 to 600,
800. Content pad 16 to 24. Radius is the large container radius (10 to 12; Material 28).
Viewport margin 16 to 32. Footer button gap 8. **Area decision (provisional).** Widths
as named tokens `sm` 20rem, `md` 30rem (default), `lg` 40rem, `xl` 50rem; pad
`space-20` or `space-24`; section gap `space-16`; footer gap `space-8`;
`radius-container`; viewport margin `space-16` (mobile) and `space-32`.

## Popover (seed: OpenAI, shadcn, Radix)

shadcn: width 288, pad 16, radius 8, header gap 4, 14/20. Radix: pad 12 / 16 / 24, radius
8 (12 at the largest). OpenAI: radius 12. Still to read: `pri/Popover`, `pri/AnchoredOverlay`,
`flu/Popover*`, `mui/Popover`, `atl/popup`, `car/popover`. **Provisional.** Pad `space-12`
(`space-16` for rich content), `radius-container`, `shadow-3`, default width a named token
at 18rem.

## Card (seed: shadcn)

shadcn: radius 14, block pad 24, inline pad 24, section gap 24, header gap 8, description
14/20. Still to read: `rdx/base-card` (five sizes), `flu/Card*`, `m3/*-card`, `mui/Card*`,
`car/tile`, `pri/Card`. Area's visual direction is compact with thin nested padding, so do
not adopt 24 without reading the denser systems first.

## Separator (complete for shadcn)

1px in both orientations. Read `flu/Divider` for the labelled form and its insets.

## Accordion (seed: shadcn)

shadcn: trigger block pad 16, gap 16, 14/20 w500, chevron 16 nudged 2 down. Read
`flu/Accordion*`, `car/accordion`, `mui/Accordion*`, `pri/Details`.

## Drawer, Hover card, Teaching popover, Panel

Not measured yet; files in `evidence/INDEX.md`.
