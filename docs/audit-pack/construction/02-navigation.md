# Construction: navigation

Read from source 2026-09-18; reproducible from `evidence/`. Italic = computed. Status per
component: **complete** (every system with a file was read) or **seed** (the systems listed
were read; finish the rest with `lookup.py` before building).

## Tabs (seed: read OpenAI n/a, shadcn, Fluent, Material, MUI, Primer, Radix size 1)

| System (evidence) | Tab height | Pad | Gap | Type | Indicator | Container |
| --- | --- | --- | --- | --- | --- | --- |
| shadcn `sha/tabs` | list 36, trigger = list - 6 - 1 | 8 x 4 | 6 | 14/20 w500; icon 16 | default: filled thumb, radius 8. line: 2px bar, 5 below | list pad 3, radius 10 |
| Fluent `flu/Tab` | small *32*, medium *44* (assuming a 20 line), large has 16 block pad | 6 x 6; 12 x 10; 16 x 10 | 2; 6; 6 | see file | bar, see file | none |
| Material 3 `m3/primary-navigation-tab` | 48; 64 with icon and label | n/p | n/p | see file; icon 24 | 3px, radius 3 3 0 0 (secondary: 2px) | none |
| MUI `mui/Tab` | min 48; 72 with icon and label | 12 x 16 | n/a | see file | 2px (see `mui/Tabs`) | min-width 90, max 360 |
| Primer `pri/UnderlineNav*` | item 32 inside a 48 bar | 8 inline, 6 block | 8 between items | 14; radius 6 on hover fill | underline at the bar's bottom edge | bar pad-inline 16 |
| Radix `rdx/base-tab-list` | size 1: 32 | outer 4, inner 2 x 4 | n/p | 12/16 | see file | none |

**Consensus so far.** Two heights are in play: a 32 hit row (shadcn, Fluent small, Primer,
Radix 1) and a 44 to 48 bar that the row sits in (Fluent medium, Material, MUI, Primer's
bar). Line indicator is 2px (3 in Material primary). Tab label is 14/20; icons 16 (24 in
Material). **Area decision (provisional).** Tab row = control tier (28 / 32 / 40); the
line variant adds block padding so the bar reaches tier + 12 to 16; indicator
`space-2`; pad-inline = tier gutter; gap `space-6`; follows the radius axis for filled
variants.

## Menu (seed: read OpenAI, shadcn, Primer, Fluent, Material, MUI, Carbon, Atlassian, Radix)

| System | Row height | Item pad | Gap | Type | Icon | Container pad / radius | Item radius |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OpenAI `oai/Menu`, `_variables` | *32* (20 lh + 6 + 6) | 6 x 8 | 6 | 14/20 | check and radio indicator 18 (dot 8) | 6 / 12 | see file; separator margin 6 -6 |
| shadcn `sha/dropdown-menu` | *32* | 6 x 8; inset start 32 | 8 | 14/20; shortcut 12/16 | 16; check 14; radio dot 8 | 4 / 8; min-width 128 | 6 |
| Primer `pri/ActionList` | *32* (pad-block 6; 8 and 10 also appear, see file) | 6 x 8 | 8 | 14/20; description 12/16 | 16 | see file | 6 |
| Fluent `flu/MenuItem`, `flu/MenuPopover` | min 32 | 6 | 4 | see file; secondary 12/16 | 20 (icon slot) | 4 / 4; min-width 138, max 300 | 4; item max-width 290 |
| Material 3 `m3/menu` | 48 | n/p | n/p | n/p | 24 | n/p / 4 | n/a |
| MUI `mui/MenuItem` | min 48 | 6 x 16 | icon column min 36 | see file | n/a | see `mui/Menu` | 0 |
| Carbon `car/menu` | see file | 16 inline (12 variant) | 8 | see file | 16 | 4 block | 0 |
| Atlassian `atl/menu` | min 40 | 20 inline | see file | see file | n/p | see file | see file |
| Radix `rdx/base-menu` | size 1: 24; size 2: 32 | start 20 / end 8; 12 | n/p | 12; 14 | n/p | 4; 8 | see file |

**Consensus.** Desktop menus use a 32 row (OpenAI, shadcn, Primer, Fluent, Radix 2);
touch-first systems use 40 to 48 (Atlassian, Material, MUI). Row = 20 line + 6 + 6. Item
pad-inline 8, gap 6 to 8, icon 16, shortcut and description 12/16. The container is padded
4 to 6 and item radius is concentric: container radius minus container pad (OpenAI 12 - 6,
shadcn 8 - 4 rounded up to 6). **Area decision.** Row `control-md` 32 (`control-sm` 28 in
compact density, `control-lg` 40 for a touch size); item pad `space-6` x `space-8`; gap
`space-8`; container pad `space-4`; container `radius-container`, item `radius-nested`
(this is exactly what the nested token exists for); separator margin-block `space-4`,
bleeding through the container pad.

## Breadcrumbs (seed: shadcn only)

shadcn `sha/breadcrumb`: 14/20, item gap 6 (10 from the sm breakpoint), separator icon 14,
ellipsis 36 box with a 16 icon. Read `pri/Breadcrumbs`, `flu/Breadcrumb*`, `car/breadcrumb`,
`mui/Breadcrumbs`, `atl/breadcrumbs` before deciding.

## Pagination (seed: shadcn only)

shadcn `sha/pagination`: page item 36 square (icon-size button), gap 4, prev / next pad 10,
icon 16. Read `pri/Pagination`, `car/pagination`, `mui/Pagination*`, `atl/pagination`.

## Stepper, Tree, Command menu

Not measured yet. Files are listed in `evidence/INDEX.md`.
