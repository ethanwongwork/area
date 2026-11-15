# Geometry and spacing audit (2026-11-11, prefix G)

## 1. Scope and method

**Read.** `docs/DESIGN_SYSTEM.md` "Size and shape" and "Optical insets"; `docs/THEMING.md` density rows (113–147);
`packages/styles/src/inset.css` (all); `packages/tokens/src/emit/base.ts` (all; `sizeDerivations` 457–515,
`radiusDerivations` 517–550); `axes/density.ts`, `axes/ui-scale.ts`, `axes/type-size.ts`, `axes/radius.ts`,
`axes/registry.ts` (defaults: type `13`, density `32`, radius `10`); `styles/src/index.css` import order (inset.css is
imported after every control family, line 133, so its padding wins over the families' own `padding-inline`).
All 108 files in `packages/styles/src/components/` were parsed into 12,068 declarations (file, line, selector, property,
value; comments stripped) with a scratch parser, then queried by property and value; the families named in the brief
were read in full where geometry is set (button, input, field, number-field, input-group, select in navigation.css,
custom-select, combobox, date-picker, tag-picker, textarea, otp-field, search-field, surface.css Card/Alert/Dialog/
Popover/Menu/Tooltip/Toast/Surface, nav, list-box, tree-view, command-palette, panel, drawer, toolbar, page-header,
badge, tag, count, kbd, chip, segmented, toggle-group, board, setting-row, asset-row, description-list, shortcut-list,
stack, calendar, split-button, breadcrumb, file-upload, indicator, accordion, switch, choice heads).

**How values were resolved.** `geometry/derive.mjs` and `geometry/census.mjs` (scratchpad) re-implement
`sizeDerivations` exactly: `ui-level = clamp(type-level-min, density-level, type-level-max)`, `ui-dense =
round(nearest, (16 − (8/7 + up·2/7 + down/7)·base)/4, 0.5)`, `ui-gap-step` the same rounded to 1, heights
`max(floor, line + (room + 2·level)·2)`. Cap height is Geist's 710/1000 (read with fontkit from
`apps/desktop/dist/fonts/geist/Geist-Variable.woff2`), so `1cap` = 9.23 at 13, 7.81 at 11. Insets follow inset.css:
`round((H − box)/2 − border) + border` from the outer edge. CSS `round(nearest)` ties go up (as `Math.round`).

**Token values at type 13** (the shipped default; all three density levels; type 14 shown for the docs' quoted values):

| Token | 13 · 28 | **13 · 32 (default)** | 13 · 36 | 14 · 32 |
|---|---|---|---|---|
| ui-level / ui-dense / ui-gap-step | −1 / 1 / 1 | **0 / 0.5 / 0** | 1 / −0.5 / −1 | 0 / 0 / 0 |
| control xs / sm / md / lg / xl | 20 / 24 / 26 / 34 / 42 | **22 / 26 / 30 / 38 / 46** | 26 / 30 / 34 / 42 / 50 | 24 / 28 / 32 / 40 / 48 |
| ui-row | 28 | **30** | 34 | 32 |
| ui-stack / ui-cluster / gap-sm,md / gap-lg / gap-xl | 4 / 6 / 4 / 6 / 6 | **6 / 8 / 6 / 6 / 8** | 8 / 10 / 8 / 6 / 10 | 6 / 8 / 6 / 6 / 8 |
| gap-row / inset-surface-sm / inset-surface-md | 8 / 8 / 12 | **10 / 10 / 14** | 14 / 14 / 18 | 12 / 12 / 16 |
| mark-label sm / md / lg | 14 / 14 / 18 | **14 / 18 / 22** | 14 / 18 / 22 | 16 / 20 / 24 |
| icon xs / sm=md=lg / xl | 12 / 16 / 16 | **12 / 16 / 24** | 12 / 16 / 24 | 12 / 16 / 24 |
| mark-box / mark-toggle | 14 / 18 | **14 / 18** | 14 / 18 | 16 / 20 |

The ladder at the default is **22 · 26 · 30 · 38 · 46** with rows 30. Space ramp (`SPACE_RAMP`, base.ts:27):
0 2 4 6 8 10 12 16 20 24 32 40 48 64 80 96 (no 14, 18, 22). The "Area ladder" the Text-pairs rule quotes
(DESIGN_SYSTEM.md:548) is 2 · 4 · 6 · 8 · 12 · 16 · 24.

**Not verified.** No browser measurement (read-only brief; the Electron app belongs to another session), so painted
bounds where the browser clamps (pill radii, `text-box` trim, sub-pixel layout of the unrounded insets in G4) are
computed, not measured. Hit-area findings (G6) assume a pseudo-element with `pointer-events: none` adds no target,
which is the CSS behaviour. React markup was read only to settle Dialog's close size (`primitives.tsx:2256`, md).

## 2. Census (type 13; values are px from the outer edge, border counted once)

### 2a. Controls, by size, at 28 / **32** / 36

| Family | Size | Height | Text side | Icon side | Icon | Icon→label gap | Label→trailing | Nested action | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Button | sm | 24 / **26** / 30 | 7 / **8** / 10 | 4 / **5** / 7 | 16 | 4 / **6** / 8 | Kbd: ui-cluster | – | button.css:506–527, inset.css:9–26 |
| Button | md | 26 / **30** / 34 | 8 / **10** / 12 | 5 / **7** / 9 | 16 | 4 / **6** / 8 | – | – | |
| Button | lg | 34 / **38** / 42 | 12 / **14** / 16 | 9 / **11** / 13 | 16 | 6 | – | – | lg icon is 16, same as md |
| Input, Search, Password | sm/md/lg | = Button | = Button | = Button | 16 | = Button | – | action h−8: 16 / **18** / 22 (sm), 18 / **22** / 26 (md) | input.css:14–19, 247 |
| Number field | sm/md/lg | = Button | = Button | – | 16 | = Button | – | steps h−8 (as Input action) | number-field.css:11, 130 |
| Select (native), Custom select, Combobox | sm/md/lg | = Button | = Button | 16 slot | 16 | = Button | gap-md before chevron | chevron 8 from edge (md), 11 at lg | inset.css:181–196 |
| Date picker | sm/md/lg | = Button | = Button | 16 slot | 16 | = Button | – | – | date-picker.css:20–49 |
| Tag picker | sm/md/lg | = Button, grows | text 10 at md | – | – | – | – | tags 5 in (+1 edge); wrap row-gap 5 (sm 3, lg 7), column-gap 6 | tag-picker.css:41, 65–74 |
| Textarea | sm/md | 2× control | 10 (md) | – | – | – | – | block 6 (md), 4 / 8 at 28 / 36 | textarea.css:21–34 |
| OTP field | sm/md/lg | = control | centred | – | – | slot gap 8 fixed | – | – | otp-field.css:20 |
| Chip | sm/md/lg | = Button | = Button | 16 slot; visual 20 | 16 | = Button | – | dismiss h−8 (18 / **22** / 26 at md), end 4 | chip.css:24–33 |
| Segmented, Toggle group soft | sm/md/lg | = Button | 10 (md, = Button) | – | 16 | = Button; items 2 apart | – | items h−4: 20 / **22** / 26 (sm), 22 / **26** / 30 (md) | segmented.css:34–46 |
| Tabs (underline) | sm/md/lg | = control | 0 (aligned) | – | 16 | gap-md | – | tab gap md 16 / **18** / 22, sm 12 / **14** / 18, lg **24 fixed**; plate tabs 4 | navigation.css:11–16, 126–128 |
| Pagination | sm/md/lg | = control | page side 6 | – | 16 | – | – | pages 2 apart | pagination.css:13–69 |
| Badge, Count, Kbd | sm/md/lg | 14 · 14 · 18 / **14 · 18 · 22** / 14 · 18 · 22 | (H−6)/2: 4 · 4 · 6 / **4 · 6 · 8** | icon (H−12)/2 | 10–12 | Badge label gap min(4, H/2−6): **1 · 3 · 4**; icon 2 | – | dismiss min(16, H−4) | badge.css:7–22, count.css:12–20 |
| Tag | md/lg | 18 / 22 | **6 / 6** | (H−12)/2 | 12 | 2 + 2 margin = 4 | – | remove H−4, 2 in | tag.css:15–38, 85–86 |
| Switch / Checkbox / Radio | – | track 18, box 14, target ≥24 | – | – | – | gap-md | – | – | switch.css:12–16, choice.css:9–15 |

### 2b. Rows (the same job in seven families), at 28 / **32** / 36

| Family | Row | Plate gap | List pad | Icon edge | Text-only edge | Icon→label | Label x | Trailing end | Indent / level | Separator | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Menu, Context menu, Custom select list, List box | 28 / **30** / 34 | 1 | 4 (+1 border = 5 outer) | 8 | 9 / **10** / 12 (cap-centred) | 8 / **10** / 14 (gap-row) | 32 / **34** / 38 | 8 | – | 5+1 / **5+1** / 6+1 (rounded) | surface.css:1257–1285, 1499; inset.css:67–105 |
| Nav | = row | 1 | 0 (6 in a Panel) | 8 (6 in a Panel) | 8 (icon column, on purpose) | = Menu | = Menu | 8 | icon + gap-row: 24 / **26** / 30 | **8 + 1 fixed** | nav.css:65, 77, 174, 377 |
| Tree view md | = row | 1 | 0 (6 in a Panel) | 8 | – | **6 fixed** | 8+16+6+16+6 = **52** fixed | 8 | **22 fixed** | – | tree-view.css:12–40 |
| Tree view sm | control-sm 24 / **26** / 30 | 1 | – | 8 | – | 4 | – | – | 16 | – | tree-view.css:193–199 |
| Command palette | = row | 1 | 4 | 12 (4 + 8) | 12 | = Menu | 36 / **38** / 42 from the panel | – | – | – | command-palette.css:27–31 |
| Native Select option (base-select) | = row | **2 (margin)** | 4 | – | (row − cap)/2 **unrounded**: 9.38 / **10.38** / 12.38 | gap-row | – | 8 | – | – | navigation.css:816–825 |
| Edit summary, Queue, Plan rows | = row | 1 | card-list | 8 | 8 | gap-row | – | – | – | – | edit-summary.css:79–82, queue.css:76–79, plan.css:88–91 |
| Menu row with a description | ≥ row, **6 / 6 / 6 fixed** block pad | 1 | 4 | 8, **icon centred on both lines** | – | gap-row | – | 8 | – | – | surface.css:1379 |
| Description list | row + 2: 30 / **32** / 36 | 4 − 4·dense: 0 / **2** / 6 | – | – | 6 | – | – | – | – | – | description-list.css:19–22 |
| Shortcut list | row + 4: 32 / **34** / 38 | – | – | – | – | – | – | – | – | – | shortcut-list.css:15 |
| Table md / sm | 34 · 22 / **38 · 24** / 46 · 28 | – | – | – | edge 12 / **14** / 18, side 8 / **10** / 14 | – | – | – | – | rules | navigation.css:313–432 |
| Asset row | 56 fixed | – | – | 8 fixed | – | 12 fixed | – | – | – | – | asset-row.css:13–19 |
| Board card / add row | content / leading + 16 = 34 | – | – | 10 fixed | 10 fixed | gap-md + 18 box | – | – | – | – | board.css:111–143 |

### 2c. Surfaces and header bars, at 28 / **32** / 36

| Family | Edge → content | Block gap | Header / bar height | Corner action | Density-aware? | Source |
|---|---|---|---|---|---|---|
| Panel md | 14 / **14** / 18 | 6 / **8** / 12 | bar = md + 2·gap + 1: 39 / **47** / 59 | ends on the body's action column | yes | panel.css:32–73 |
| Panel sm | 6 / **8** / 12 | 4 / **6** / 8 | 33 / **39** / 47 | same | yes | panel.css:484–487 |
| Panel window bar, Titlebar sm | – | – | sm + 14: 38 / **40** / 44 | controls centred | yes | panel.css:494, app-shell.css:69 |
| Titlebar md | – | – | md + 2·(10 − 4·dense): 38 / **46** / 58 | – | yes | app-shell.css:36 |
| Toolbar md (surface) | 6 / **8** / 10 (ui-cluster) | ui-cluster | 38 / **46** / 54 | – | yes | toolbar.css:3–34 |
| Command palette search | column 12 | – | 48 − 8·dense: 40 / **44** / 52 | – | yes (own formula) | command-palette.css:62 |
| Card sm / md / lg | 12·16·20 / **14·18·22** / 18·22·26 | 8·12·16 / **10·14·18** / 14·18·22 | none (title at the inset) | **plate** ends on the text column | yes | surface.css:45–150 |
| Surface md | 12 / **14** / 18 | 8 / **10** / 14 | – | – | yes | surface.css:1899–1928 |
| Dialog, Drawer | **16 fixed** | 12 / **14** / 18 | none (title at the inset; rule on scroll) | close **glyph** on the inset (9 / 9 from the corner) | inset no, gap yes | surface.css:961–1029, drawer.css:48–63 |
| Popover | **12 fixed** | 12 / **14** / 18 | – | close glyph on the inset | inset no, gap yes | surface.css:1143–1157 |
| Menu, Select picker | **4 fixed** (+ border) | 1 | – | – | no | surface.css:1105, navigation.css:773 |
| Alert, Toast | block 7 / **9** / 13, inline 8 / **10** / 14 | 4 title gap | – | – | yes | surface.css:647–648, 1739 |
| Alert banner | block 8 / **10** / 14, inline 12 / **14** / 18 | – | – | – | yes | surface.css:763–764 |
| Tooltip | block **4 fixed**, inline 8 / **9** / 11 | – | – | – | inline only | surface.css:1612–1615 |
| Message bubble | block 6 / **8** / 12, inline 12 / **14** / 18 | – | – | – | yes (10px literal base) | message.css:38 |
| Setting row | block 8 / **10** / 14, gap **16 fixed** | – | – | – | block only | setting-row.css:18–21 |
| Calendar | 8 / **10** / 14 | cells 32 / **34** / 38, days 28 / **30** / 34 | – | – | own formula | calendar.css:7–27 |
| Board column | 18 fixed (8 + 10) | – | **40 fixed** | – | no | board.css:69–70 |
| Color picker header | – | – | **40 fixed** | – | no | color.css:309 |
| Empty state lg / sm | 2× inset-surface-md / inset-surface-md | media 16 / 12, actions 24 / 12 fixed | – | – | padding only | empty-state.css:24–73 |
| Page header | 0 | parent 8, description 4, nav inset-surface-md | – | actions 8 apart, 16 from the title | gaps no | page-header.css:59–105 |

### 2d. Sibling gaps between independent controls or actions (default)

| Where | Gap | Source |
|---|---|---|
| Row-embedded icon actions (Nav, Tree view, Asset row, Asset card, Design card, Board, File upload item, Video player, Zoom stepper, Pagination pages, Composer group) | 2 fixed | nav.css:414, tree-view.css:147, asset-row.css:58, asset-card.css:143, design-card.css:98, board.css:84/218, file-upload.css:147, video-player.css:203, zoom-control.css:32, pagination.css:49, composer.css:149 |
| Header actions (Card, Panel, Alert, Toast), Menu and Nav trailing, Kbd group | 4 fixed | surface.css:333, 722, 1564, 1776; panel.css:243; nav.css:364; kbd.css:88 |
| Toolbar, Toggle group ghost, Chip group, Dialog/Drawer/Popover/Card footer, Field inline, Breadcrumb item, Filter bar, Selection bar | ui-cluster 6 / **8** / 10 | toolbar.css:13, toggle-group.css:75, chip.css:304, surface.css:558/1093/1204, drawer.css:133 |
| Page header actions, Drawer stacked footer, Toaster list | **8 fixed** | page-header.css:84, drawer.css:136, surface.css:1706 |
| Segmented items, Toggle group soft, List box grid, Custom select grid | 2 fixed | segmented.css:44, toggle-group.css:35, list-box.css:32 |
| OTP slots | 8 fixed | otp-field.css:20 |

## 3. Findings, most severe first

Deltas are at type 13 as 28 / 32 / 36 unless stated; "+2" means the value grows by 2px.

### G1. Gaps still read the half-step curve, so the default lands between the ladder's rungs (inconsistency)
- **What.** `ui-dense` is 0.5 at the shipped type 13 Default (base.ts:464–469), so every `N − 4·ui-dense` lands 2 under
  its type-14 value. L3 (system gaps, 2026-11-07) moved `ui-stack`, `ui-cluster` and `gap-sm/md/xl` onto
  `ui-gap-step`, but `gap-row` (base.ts:488) and the hand-written gap formulas still read `ui-dense`. At the default:
  `gap-row` **10**, Card md section gap `16 − 4·dense` **14** and lg **18** (surface.css:144, 150), Card's carousel and
  media-well gap `--_card-inset` **7** (surface.css:395, 577: the exact 7 L3 removed from Card's list), Tabs md gap
  **18** (navigation.css:14), sm **14** (126), Stack section `2 × gap-row` **20** (stack.css:23), Command palette footer
  **14** (command-palette.css:195), Choice tile and option row gaps **14** (choice.css:228, 650, 692), Description list
  row gap **2** (description-list.css:20). 10, 14, 18 and 7 are not on the Text-pairs ladder 2·4·6·8·12·16·24
  (DESIGN_SYSTEM.md:548); 14 and 18 are not on `SPACE_RAMP` at all. At Comfortable the icon→label gap is 14.
- **Evidence it is drift, not intent.** The families' comments quote the type-14 values as the default: inset.css:94
  ("the row gap (12) then starts the label 36px in", it is 34), stack.css:22 ("24, Compact 16", it is 20 / 16),
  DESIGN_SYSTEM.md:581 ("list rows use gap-row 12"). The app's own feed spaces by `ui-level` and lands on the
  ladder at 13 (THEMING.md:129–131: 8 / 12 / 16), so components and the screens around them use two curves (only one
  `ui-level` read in all 108 files).
- **Rule.** A gap reads `ui-gap-step` (whole steps); only insets (edge → content) keep the half step, as THEMING.md:146
  already says for L3. Concretely `gap-row = 12 − 4·ui-gap-step` and every `N − 4·dense` used as a gap becomes
  `N − 4·ui-gap-step`; Card's `--_card-inset` used as a gap becomes `8 − 2·ui-gap-step`.
- **Changes** (28 / 32 / 36): `gap-row` 8 / 10→**12** / 14→**16**, so the icon→label gap and label column of Menu,
  Nav, List box, Custom select, Combobox, Command palette, native Select options, Edit summary, Queue, Plan, Hover card,
  Message, Description list columns: 0 / +2 / +2 (labels at 32 / **36** / 40, the value inset.css promises); Nav nested
  indent 0 / +2 / +2; Stack group 0 / +2 / +2, section 0 / +4 / +4; Card sm gap 0 / +2 / +2, md 0 / +2 / +2, lg 0 / +2 /
  +2; Card carousel and media-well gap 0 / +1 / +1; Tabs md and sm gaps 0 / +2 / +2; Command palette footer 0 / +2 /
  +2; Choice row gaps 0 / +2 / +2; Description list row gap 0 / +2 / +2. At type 15 (gap step 0, dense −0.5) gap-row
  falls 14→12; at 16 it rises 14→16. Compact at 13, the app's density, does not move.
- **Size** M (base.ts + 10 files + cohesion test that no gap reads `ui-dense`). **Confidence** high on the values;
  the 36 label column is the documented intent.

### G2. Surface block gaps exceed the surface's own inset (inconsistency)
- **What.** Dialog, Drawer and Popover fix their inset at both densities (owner, 2026-10-02: Dialog 16, surface.css:961;
  Drawer 16, drawer.css:48; Popover 12, surface.css:1143) but space their blocks with the density's
  `inset-surface-md` (surface.css:969, 1009, 1157; drawer.css:57). Popover's blocks stand **14** apart inside a **12**
  edge at the default and 18 inside 12 at Comfortable; Dialog's and Drawer's 18 inside 16 at Comfortable. Stack's rule
  is the opposite: "children are never farther apart than they are from the edge" (stack.css:3, DESIGN_SYSTEM.md:631),
  and Surface enforces it (`gap: min(gap-row, inset)`, surface.css:1924).
- **Rule.** A surface's block gap is `min(inset-surface-md, its own inset)` (the Surface rule, stated once for every
  floating and modal surface).
- **Changes.** Popover gap 12 / 14→**12** / 18→**12**; Dialog and Drawer header-to-body and body gaps 12 / 14 /
  18→**16**; Dialog's scrolled rule (surface.css:1047, placed at half the gap) follows.
- **Size** S. **Confidence** high.

### G3. Pointer targets under 24 with no hit expansion (defect)
- **What.** WCAG 2.5.8 wants 24 (DESIGN_SYSTEM.md:490 cites it for heights). Badge and Tag dismissals and Toggletip
  already widen to 24 with `::after` (badge.css:293, tag.css:143, toggletip.css:69; 44 under `pointer: coarse`), but
  these interactive boxes are smaller and have none:
  - Input action and Number field steps, `h − 8` (input.css:18, number-field.css:11): sm **16 / 18 / 22**, md 18 / 22 / 26;
  - Chip dismiss, `h − 8` (chip.css:30): same values;
  - Nav row actions, `row − 8` (nav.css:140, 392): **20 / 22** / 26;
  - Split button icon-only trigger, `h / 2` wide (split-button.css:94): md **13 / 15 / 17**, sm 12 / 13 / 15;
  - Segmented and Toggle group soft sm items, `h − 4` tall and 2 apart (segmented.css:36, toggle-group.css:48): **20 / 22** / 26;
  - Breadcrumb ellipsis, a 16 × 16 button whose plate is a `pointer-events: none` `::before` (breadcrumb.css:55–58);
  - Color swatch picker sm cell, `control-xs` (color.css:113): **20 / 22** / 26.
  Spacing cannot rescue them: each sits flush against another target (the field, the chip, the row, the next segment).
- **Rule.** Any interactive box under 24 on either axis carries the shared target: a centred `::after` of
  `max(24px, 100%)` (44 under `pointer: coarse`), the Badge/Tag recipe made one utility rule in inset.css or base.css,
  and a cohesion test that lists interactive selectors whose computed box can fall under 24 at Compact.
- **Changes.** None visible; targets only. Segmented sm's expansion overlaps its neighbours by 1–2px each side, so the
  2px gap halves the overlap; acceptable, or let sm segments read `max(24, h − 4)`.
- **Size** S–M. **Confidence** high (computed; not hit-tested in a browser).

### G4. Cap-centred insets that skip the whole-pixel rounding (defect)
- **What.** inset.css:5 rounds every side "so text starts on the pixel grid", but these compute `(H − 1cap) / 2`
  unrounded: Combobox empty (combobox.css:43), Tag picker empty (tag-picker.css:184), Composer menu empty
  (composer-menu.css:49), Command palette empty (command-palette.css:183), native Select option (navigation.css:821),
  Card header heading beside a control (surface.css:358). At the default each is **10.38** (9.38 / 12.38 at 28 / 36):
  the text starts between pixels and 0.38 right of the Menu rows above and below it (10). Card's is a block offset of
  10.38 above the title.
- **Rule.** Every derived inset goes through `round(nearest, …, 1px)`; better, these slots join inset.css's list
  (`.area-menu__empty` is already in it, inset.css:11) instead of writing their own formula. Cohesion test: no
  `1cap` in a padding or margin outside `round()`.
- **Changes.** Text −0.38 at every density (to Menu's 9 / 10 / 12); Card's title −0.38.
- **Size** S. **Confidence** high.

### G5. Empty and loading lines of lists use three geometries (inconsistency)
- **What.** Menu's empty and loading lines are rows (`ui-row`, the row inset, inset.css:11, 67; surface.css:1349).
  Combobox, Tag picker and Composer menu restate the row with their own padding (G4). Command palette's empty line is
  `control-md` tall (command-palette.css:182): **26** beside 28 rows at Compact, and its padding is the md control's.
- **Rule.** A list's empty, loading and no-results line is `.area-menu__empty` (one class, one geometry), whatever the
  list.
- **Changes.** Command palette empty +2 / 0 / 0 tall; the three others −0.38 (G4).
- **Size** S. **Confidence** high.

### G6. Header bars: eight heights for one job (inconsistency)
- **What.** A bar that holds a title or controls above a body is, at 28 / 32 / 36: Panel md 39 / **47** / 59
  (`md + 2·(10 − 4·dense) + rule`, panel.css:73), Panel sm 33 / 39 / 47, Titlebar md 38 / **46** / 58 (app-shell.css:36),
  Panel window bar and Titlebar sm 38 / **40** / 44 (panel.css:494, app-shell.css:69; THEMING.md:133's "Header, 7 above
  and below"), Toolbar surface 38 / **46** / 54 (toolbar.css:17, 34), Command palette search 40 / **44** / 52
  (`48 − 8·dense`, command-palette.css:62), Board column header **40 fixed** (board.css:69), Color picker header **40
  fixed** (color.css:309). Panel md's bar grows 20px from Compact to Comfortable while its rows grow 6; Titlebar md
  and Toolbar agree at 28 and 32 and part by 4 at 36; the palette's search sits on no ladder.
- **Rule.** Two bars, both from the control they hold: a **region bar** = `control-sm + 14` (the owner's 7 above and
  below, THEMING.md:133) and a **tool bar** = `control-md + 2 × ui-cluster`, plus the bar's rule when it draws one.
  Every header picks one.
- **Changes.** Panel md bar 39 / 47 / 59→**55** (−4 at 36); Titlebar md 38 / 46 / 58→**54**; Command palette search
  40→**38** / 44→**46** / 52→**54** (tool bar); Board column header and Color picker header 40→38 / 40 / 44 (region
  bar). Panel sm stays (it is `sm + 2·ui-stack + rule`, a third bar; or fold it into region bar: 33→39 / 39→41 / 47→45;
  decide).
- **Size** M. **Confidence** medium: the two-bar split is my proposal; the measured values are certain.

### G7. Row families do the same job with different gaps, indents and separators (inconsistency)
- **What.** All list rows share `ui-row` and `ui-row-gap` (a strength: system-gaps README:62), but:
  - icon→label: Menu, Nav, List box, palette `gap-row` (8 / 10 / 14); **Tree view 6 fixed** (tree-view.css:19, owner
    pass 3, so chevron, icon and label are evenly spaced); Tree view sm 4;
  - one level of indent: Nav `icon + gap-row` 24 / 26 / 30 (nav.css:77); Tree view `chevron + 6` **22 fixed**
    (tree-view.css:20);
  - separator: Menu `round(6 − dense − 1) + 1`: **5 / 6 / 7** from the plates (surface.css:1499); Nav **8 + 1 = 9
    fixed** (nav.css:377);
  - group break: Nav `margin-block-start: 12` fixed (nav.css:65); Menu groups by separators or labels;
  - plate spacing: native Select options **2 apart by margin** (navigation.css:825), every other list 1 by `gap`.
- **Rule.** (a) A separator between row plates is Menu's: 6 − ui-dense from the plates, rounded, in every list (Nav,
  Tree view, List box). (b) A group break in a row list is `gap-row` (density-aware), never a fixed margin. (c) Plates
  are `ui-row-gap` apart by `gap`. (d) Tree view's 6 stays, written as the one exception: a row that carries a
  disclosure chevron spaces chevron, icon and label evenly so each level's chevron sits under its parent's icon;
  DESIGN_SYSTEM.md:581 should say so.
- **Changes.** Nav separator 9→**5 / 6 / 7** (−4 / −3 / −2); Nav group break 12→**8 / 12 / 16** with G1 (−4 / 0 / +4);
  native Select options 2→1 apart (−1 per row).
- **Size** S. **Confidence** high on values; (d) is a documentation decision.

### G8. Spacing that ignores density beside peers that follow it (inconsistency)
- **What.** These read fixed steps or literals while the families around them scale (all values stay put at 28 and
  36): Asset row padding 8, gap 12, row 56 (asset-row.css:13–19); Board card and add row `8 10px`, column header
  `8 + 10px` (board.css:70, 113, 143); Setting row text→control 16 (setting-row.css:21); Page header actions 8 apart and
  16 from the title (page-header.css:84–86); Stepper and Timeline gap 12 (stepper.css:19, timeline.css:13); Tabs lg gap
  24 while sm and md scale (navigation.css:128); OTP slots 8 (otp-field.css:20); Alert's icon→text and text→action 8
  (surface.css:732–733) while Toast's are `ui-cluster` (surface.css:1734); Menu two-line row block pad 6px
  (surface.css:1379) while the one-line row pads 5 / 6 / 8; Empty state media and actions gaps 16 / 24 / 12
  (empty-state.css:38–73); Drawer stacked footer 8 (drawer.css:136) while every footer is `ui-cluster`; Toaster list 8
  (surface.css:1706); Table caption 12 (navigation.css:493); Shortcut list groups 32 apart (shortcut-list.css:29).
  `indicator.css:80` writes the Count's 16 + 2 as `16px + 2px` literals (a fixed mark, so right in value, wrong in form).
- **Rule.** Space between two pieces of UI reads a density role (`ui-stack`, `ui-cluster`, `gap-row`,
  `inset-surface-*`); a fixed value is allowed only for a mark, a hit area, a platform constant (traffic lights,
  app-shell.css:96) or a measured media size, and its spec line says "at every density". Literals become tokens.
- **Changes** (28 / 32 / 36): Asset row padding → `ui-cluster` −2 / 0 / +2, gap → `gap-row` −4 / 0 / +4 (with G1);
  Board pads → `inset-surface-sm` −2 / 0 / +4; Setting row gap → `inset-surface-md` −4 / −2 / +2; Page header actions →
  `ui-cluster` −2 / 0 / +2; Stepper, Timeline → `gap-row` −4 / 0 / +4; Tabs lg → `24 − 4·gap-step` −4 / 0 / +4 (with G1);
  OTP → `ui-cluster`; Alert gaps → `ui-cluster` −2 / 0 / +2 (matches Toast); Menu two-line → the row's room `(row −
  leading)/2` −1 / 0 / +2; Drawer stacked footer and Toaster → `ui-cluster`.
- **Size** M (12 files). **Confidence** high on the facts; each was a spec decision, so the owner confirms per family.

### G9. A corner action in a surface header sits two ways (inconsistency)
- **What.** Dialog, Drawer and Popover pull a ghost close so its **glyph** sits on the content inset, the plate
  overhanging (surface.css:1028–1029, 1225–1226; close 9 from the corner, glyph on 16). Card keeps the ghost
  **plate** on the text column (surface.css:362), so a md ghost's glyph is 7 inside: 25 from a Card md's edge beside
  text at 18 (Card sm's `control-sm` action, card-action at surface.css:138: 5 inside). Panel's bar ends the action on the body's action column (inset.css:53), a third rule.
- **Rule.** A ghost icon action at a surface's edge puts its glyph on the content inset (Dialog's rule); a filled or
  outline control keeps its plate on the column.
- **Changes.** Card ghost header action moves out by `(control − icon) / 2`: 5 / 7 / 9 with a md action (Card md and
  lg), 4 / 5 / 7 with Card sm's sm action.
- **Size** S. **Confidence** medium (Card's 2026-09-28 note chose the plate edge for the carousel title's vertical
  position, not its horizontal one).

### G10. Multi-line rows: one centres its icon, and first-line alignment is done two ways (inconsistency)
- **What.** DESIGN_SYSTEM.md:719 says multiline content aligns to the first line. Menu's row with a description
  (`align-items: center`, surface.css:1379, used by Model picker and Custom select) centres the leading icon and the
  check over both lines: icon 9 below the content top instead of 1. Elsewhere first-line alignment uses either an icon
  box one line tall (Board card, Board add, Plan and Queue chevrons, Accordion chevron, Attachment: board.css:179,
  plan.css:66, queue.css:61, accordion.css:105, attachment.css:97) or a margin `(leading − icon) / 2` (Alert, Toast,
  Card list, Switch: surface.css:680, 1762, 458; switch.css:78). Both give the same pixels.
- **Rule.** A leading glyph in a multi-line row sits in a box one first-line tall (the box technique; no margin
  arithmetic), `align-self: flex-start`; the trailing check of a picker row may stay centred (the spec's ChatGPT
  reference) and says so.
- **Changes.** Menu two-line rows: leading icon −8 (to the first line); others none.
- **Size** S. **Confidence** medium (the leading icon case conflicts with model-picker.md's capture, which has no
  leading icon: needs the owner).

### G11. Heights off the ladder (inconsistency)
- **What.** Calendar's cells and days are `36 / 32 − 4·dense` (calendar.css:7–8): days 28 / **30** / 34 beside
  control-md 26 / 30 / 34 (2 taller at Compact), and at type 12 Compact 28 vs 24, at 16 34 vs 36. Description list rows
  `row + 2` (description-list.css:19), Shortcut list `row + 4` (shortcut-list.css:15), Plan's single head `row + 8`
  (plan.css:163), Prompt suggestion `22 + 2·(12 − 2·dense)` 42 / 44 / 48 (prompt-suggestions.css:33), Board add row
  `leading + 16` 34 (board.css:111), Asset row 56 fixed. Each is spec'd from one product; together they make eight
  row heights between 30 and 56.
- **Rule.** A height is a ladder token (`control-*`, `ui-row`) or a ladder token plus whole room steps of the
  density (`+ 2 × ui-stack`), never `+ 2px` / `+ 4px` literals. Calendar day = `control-md`, cell = `control-md + 4`.
- **Changes.** Calendar days −2 / 0 / 0 (−4 at type 12 Compact, +2 at 16); Description list rows `row + 2·ui-row-gap`
  or `row` (−2); Shortcut list `row + ui-stack` (0 / +2 / +4); Board add row → `ui-row` (−6 / −4 / 0).
- **Size** S–M. **Confidence** medium (each literal was a measured reference; the rule trades fidelity to one product
  for one ladder).

### G12. Marks of one size disagree (inconsistency)
- **What.** (a) At Compact `mark-label-sm` = `mark-label-md` = **14** (base.ts:494–495), so Badge, Count, Kbd and Tag sm
  and md are identical at the app's own density. (b) Tag lg's text side is `min(6, …)` = **6** (tag.css:23) where Badge
  and Count lg are `(H − 6)/2` = **8**, and Tag lg sets 11 text where Badge lg sets 13 (badge.css:259): two lg marks on
  one line part (DESIGN_SYSTEM.md:723–734 says they share side and text). (c) Badge's label gap is `min(4, H/2 − 6)` =
  **1 / 3 / 4** at sm / md / lg (badge.css:20), off the 2px ladder. (d) Kbd sm's font is a fixed 11 (kbd.css:81)
  while Kbd md reads `text-xs`: at type 12 the sm key's text (11) is larger than md's (10).
- **Rule.** Marks of one size share height, text role and side `(H − 6)/2`; a mark's internal gaps are 2 or 4; every
  mark size is distinct at every density (sm floor 14, md = sm + 4).
- **Changes.** Compact md marks 14→18 (or document that sm and md merge at Compact); Tag lg side 6→8, text 11→13;
  Badge gap 1→2, 3→4; Kbd sm text → `text-xs` at types 14+ only, else `size-10`.
- **Size** S. **Confidence** high on values; (a) needs a decision.

### G13. Sibling actions: four gap values with no stated roles (inconsistency)
- **What.** Census 2d: row-embedded icon actions 2 (11 families), header actions 4 (Card, Panel, Alert, Toast, Menu and
  Nav trailing), independent controls `ui-cluster` 6 / 8 / 10 (Toolbar, footers, Chip group), and 8 fixed in Page
  header actions, Drawer stacked footer and Toaster.
- **Rule.** Three roles, written in DESIGN_SYSTEM "Size and shape": a joined set (segments, row actions) 2; actions in a
  header or a line of text 4; independent controls `ui-cluster`. The 8-fixed three take `ui-cluster`.
- **Changes.** Page header actions, Drawer stacked footer, Toaster list −2 / 0 / +2.
- **Size** S. **Confidence** high.

### G14. A picture in Nav's icon slot is wider than the slot (refinement)
- **What.** `.area-nav__picture` is 20 × 14 at the 16 icon (nav.css:152–153), so its label starts at 8 + 20 + 10 =
  **38** beside icon rows' 34: the label column breaks in a list that mixes pictures and icons. DESIGN_SYSTEM.md:588
  allows a mark in an icon slot of at most 14 × 10.
- **Rule.** A mark in an icon slot keeps the slot's footprint; a list that wants larger pictures reserves the picture's
  width on every row (a list-level `--_box-icon`).
- **Changes.** Picture rows' labels −4, or every row in a picture list +4.
- **Size** S. **Confidence** high.

### G15. Glyphs drawn at sizes that are not native or do not follow the type (refinement)
- **What.** File upload's glyph is a fixed `20px` in its tile (file-upload.css:63), so it does not follow the type's icon
  slot (16 → 20 from type 15); Empty state's glyph is `24px / 16px − 4·cut` (empty-state.css:34, 66); File page's
  icon is `size × 0.32` rounded to 2: 16 / 20 / **30** (file-page.css:94), 30 being no native Glyph size
  (16, 20, 24; 12 and 10 cuts).
- **Rule.** A glyph's box reads an `icon-*` token or a native size; scaled figures snap to the nearest native size.
- **Changes.** File page at 96: 30→32 (or 24); File upload glyph → `icon-xl` (24, 16 at Compact) or stays 20 with a
  spec line.
- **Size** S. **Confidence** medium.

### G16. Tag picker's wrapped rows are 1px tighter than its columns (refinement)
- **What.** `gap: var(--_tag-inset) var(--area-space-6)` (tag-picker.css:71): rows 3 / **5** / 7 apart (sm / md / lg),
  columns 6; the first row sits 6 from the field's edge (5 + border).
- **Rule.** Wrapped marks are as far apart both ways as from the edge: row gap = tag inset + border.
- **Changes.** Row gap +1 at every size (md 5→6).
- **Size** S. **Confidence** high.

### G17. Floating lists do not count their border in the inset (refinement, documented exception)
- **What.** Menu and the Select picker pad 4 inside a 1px border (surface.css:1105–1106, navigation.css:773), so plates
  sit 5 from the outer edge; Popover, Dialog, Drawer, Card and Panel count the border once ("border included"). The
  comment at surface.css:1275–1279 leaves the border out on purpose, for concentric corners. Visually consistent with
  Command palette (13 to the icon), so no change proposed; DESIGN_SYSTEM.md:713–715 should name the exception.
- **Size** S (docs). **Confidence** high.

### G18. Sibling spacing by margin compensation (refinement)
- **What.** Joins and breaks written as margins that undo a container's gap: Card's title join `calc(4px − gap)`
  (surface.css:277), Card carousel after a header `calc(text-inset − gap)` (597), Menu shortcut column
  `icon + gap` margin (1546), Nav group margin 12 (nav.css:65), Shortcut list + list 32 (shortcut-list.css:29),
  Description list "more" (description-list.css:171), Combobox description + check 8 (combobox.css:35), native Select
  options (G7). Each works, but a change to the container gap silently changes the join.
- **Rule.** A container's children are spaced by its `gap`; a pair that joins is its own group with its own gap
  (Dialog's heading grid does this: surface.css:1016), never `margin: calc(x − parent gap)`.
- **Changes.** None visible.
- **Size** M. **Confidence** medium.

### G19. Comments and docs quote type-14 values as the default (refinement)
- **What.** Since the default became type 13 (2026-10-26) several "spec" comments state values that are not what
  renders: inset.css:94 (label at 36: it is 34), stack.css:22 (section 24: 20), description-list.css:17 (32 + 2, 26 at
  Compact: 32, 30), setting-row.css:16 (12 above and below, one line 42: 10, 38), timeline.css:12 (24, Compact 20:
  22, 20), DESIGN_SYSTEM.md:548 (ladder 2·4·6·8·12·16·24 while 10 and 14 render), DESIGN_SYSTEM.md:581 (gap-row 12:
  10). Readers tune against the wrong numbers.
- **Rule.** A comment quotes the value at the shipped default (type 13, density 32) or names the type it is at.
- **Size** S. **Confidence** high.

### G20. Small controls' lg icon equals md's (observation)
- `icon-sm`, `icon-md` and `icon-lg` are all `type-icon` (16 at 13; base.ts:502–504), so Button, Input and Chip lg (38)
  hold a 16 icon 11 from the edge beside text 14 from it. This is consistent and documented (one icon per type), noted
  only because lg reads lighter than md in a size row; no change proposed.

## 4. What is already excellent (keep)

- **One ladder from two settings.** Heights, rows, gaps, marks and corners are live `calc()` from type and density with
  floors (base.ts:457–515); every control family reads the same tier tokens, and the census found no control height
  off `control-*` (G11 is rows and composites only).
- **inset.css's contract.** Border + shell + slot, a square box per slot, nested backplates reserving their own box
  (Kbd, Badge, Count, InputAction, steppers, Chip remove), whole-pixel rounding, and the corner-clear for pill fields.
  Text side 10 and icon side 7 on a 30 control are exact and identical across Button, Input, Select, Custom select,
  Combobox, Date picker, Chip, Segmented (track + item = 10) and Textarea.
- **One row.** Menu, List box, Custom select, Combobox, Command palette and the agent cards all render `ui-row` plates
  1 apart with a shared 8 glyph edge and a shared trailing edge; Panel's row pad aligns row icons with the panel title
  (14) exactly.
- **The chevron inset rule** (8 from the edge at sm/md, centred at lg) across Select, Custom select and Combobox.
- **Marks on one line** at md: Badge, Count, Tag share height 18, side 6 and the whole-pixel cap baseline.
- **Fields align when stacked:** Textarea's inline inset equals Input's at every size and density; Tag picker's text
  starts where Input's does (10).
- **`ui-gap-step`** (L3) already fixed the control-interior gaps; G1 extends the same idea, not a new one.
