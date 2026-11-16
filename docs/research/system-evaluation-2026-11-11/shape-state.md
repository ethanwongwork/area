# Shape, stroke, elevation, colour and state paint (finding prefix S)

System evaluation 2026-11-11. Read-only audit from source. Nothing in the repo was changed except this file.

## 1. Scope and method

**Read.** `docs/DESIGN_SYSTEM.md` (Colour, Shared state paint, Elevation, Strokes, Size and shape), `docs/CONTRAST.md`;
`packages/tokens/src/axes/{radius,elevation,surface,stroke-groups,states,density}.ts` and the radius, size and role
derivations in `packages/tokens/src/emit/base.ts`; `packages/styles/src/{base,forced-colors}.css`; every file in
`packages/styles/src/components/` (115 files, 19,851 lines). The overlay section of `surface.css` (Dialog, Popover, Menu,
Tooltip, Toast, anchored overlays, lines 885–1887), `command-palette.css`, the Select picker (`navigation.css` 760–870),
`button.css` 350–520, `segmented.css`, `toggle-group.css`, `list-box.css` were read in full. The rest was read through
a PostCSS census: every rule's radius, border, outline, box-shadow, background and colour declarations, every `:hover`,
`:active`, `:focus-visible`/`:focus-within`, selected/checked/current, open and disabled rule, and every literal colour
(scripts in the session scratchpad, not committed). `layers.css`, `material.css`, `THEMING.md`, `depth.ts`, `layers.ts`,
`material.ts`, `emphasis.ts`, `tint.ts` were only skimmed for the parts that bear on findings below.

**How values were resolved.** At the shipped defaults: Type 13, Density 32 (level 0), Corner 10 (`radius.ts:48`,
factor 10/32 = 0.3125, surface 16, min 2), Stroke width 1, Elevation 8, Focus ring Hug (2px, offset 0, gap 2), Selected
edge 2, Selection Neutral, Action Neutral. From `emit/base.ts:461–548`:

| Token | Formula | Default |
|---|---|---|
| `ui-dense` | round(nearest, (16 − 8/7 × 13)/4, 0.5) | 0.5 |
| `control-xs/sm/md/lg/xl` | line + (room + 2·level)·2 | 22 / 26 / 30 / 38 / 46 |
| `radius-control-xs/sm/md/lg/xl` | max(2, round(down, h × 0.3125, 2)) | 6 / 8 / 8 / 10 / 14 |
| `ui-row` / `radius-row` | 18 + 6·2 / corner(30) | 30 / 8 |
| `radius-step` | corner(32px) | **10** |
| `inset-surface-md` / `-sm` | 16 − 4·dense / 12 − 4·dense | 14 / 10 |
| `radius-container` | min(16, round(down, 14 × 1.5, 2)) | 16 |
| `radius-small` / `radius-floor` | control-xs corner / min(4, step) | 6 / 4 |
| `radius-list-row` | min(max(4, 16 − 4), 10, 30/2 − 2) | 10 |
| `radius-list` | min(16, 10 + 4) | 14 |
| field list (md field) | rows = field corner, list = rows + 4 | 8 / 12 |
| `gap-row` | 12 − 4·dense | 10 |

**Not verified.** Nothing was measured in a browser: every px value is arithmetic on the source formulas. Computed
colours (e.g. what `neutral-800` resolves to in dark) were not resolved. Forced-colours, scrollbars, `::selection` and
dark paint were checked from source only. React markup was consulted only for Date picker's Calendar variant.

## 2. Census

### 2a. Overlays (the job "a surface over the page")

| Overlay | Surface | Frame | Shadow role | Material (`--_m-layers`) | Corner (default) | Inset (edge counted) | Child corner, concentric? |
|---|---|---|---|---|---|---|---|
| Menu, Context menu | `bg-surface` | `border-width` `edge-floating` | float | yes | `radius-list` 14 | 4 + 1 border (border not subtracted) | rows `radius-list-row` 10; 14 − 4 = 10 if the border is ignored, 14 − 5 = 9 if not (documented choice, surface.css:1276) |
| Combobox, Custom select, Tag picker lists | same (Menu class) | same | float | yes | field + 4 = 12 | 4 + 1 | rows 8 = field corner; 12 − 4 = 8 ✓ |
| Select picker (`::picker`) | `bg-surface` | `border-width` `edge-floating` | float, **no `--_m-layers`** (navigation.css:785) | **no** | 12 | 4 + 1 | rows 8 ✓; rows **2 apart** (margin-block space-2, :816) not `ui-row-gap` 1 |
| Popover, Hover card, Toggletip popup, Date picker panel | `bg-surface` | `border-width` `edge-floating` | float | yes | `radius-container` 16 | 12 − 1 = 11 (+1) | media 16 − 11 − 1 = 4 → floor ✓; close (sm 26, icon 16) sits 12 + (16 − 26)/2 = 7 from the edge, corner 8; concentric would be 9 (1 off) |
| Tooltip | inverse light / `neutral-800` dark | **none**; dark 5% white inset literal | tooltip | **not listed in material.css** | `radius-control-lg` capped at half height: min(10, 13) = 10 | block 4, inline 10 − 2·0.5 = 9 | Kbd 20 box at (26 − 20)/2 = 3: corner 6 (own height), concentric 7 (1 off) |
| Toast | `bg-surface` | `border-width` `edge-floating` | float | yes | one line `radius-control-lg` 10; titled 16 | sides 10 − 1; block 10 + (16 − 18)/2 − 1 = 8 → 36 tall | end control (sm 26) 10 + (16 − 26)/2 = 5 from edge, corner 8: concentric 5 (one line) / 11 (titled), **3 off both** |
| Dialog, Confirm dialog | `bg-surface` | `border-width` `edge-floating` | modal | yes | container + 4 = **20** | 16 − 1 | close (md 30) 16 + (16 − 30)/2 = 9 from edge, corner 8; concentric 11, **3 off** (comment surface.css:963–966 says 12 + 4 = 16 and "at the default it equals the close's corner plus 8": true only at the old default 8) |
| Drawer | `bg-surface` | side borders `edge-floating` | modal | yes | bottom: container + 4 = 20 | `_drawer-outer` | close as Dialog |
| Command palette | `bg-surface` | `border-width` `edge-floating` | modal | yes | **`radius-list` 14** | list 4 | rows 10 ✓ |
| Calendar surface, Color picker surface | `bg-surface` | `border-width` `edge-floating` | float, **no `--_m-layers`** (calendar.css:56, color.css:304) | **no** | 16 | inset-sm 10 − 1 − day inset | days `min(8, corner(day))` |
| Floating Toolbar, Selection bar, Titlebar | per part | **inset box-shadow** `edge-floating` (not a border) | float | toolbar/titlebar yes, selection bar unverified | control + inset (concentric outward) | `ui-cluster` | ✓ by construction |
| Scroll to latest | Button | Button's | float, **no `shadow-edge`** (scroll-to-latest.css:38) | yes | Button | — | — |
| Video player controller | dark glass | inset 12% white literal | float | yes | — | — | — |

Scrim: Dialog, Confirm dialog, Drawer and Command palette all paint `var(--area-scrim)` (surface.css:915, 990;
drawer.css:39; command-palette.css:19) and fade on the same clocks. Consistent.

### 2b. Families (one row each; "—" = not applicable; "plate" = the shared row plates `bg-component-hover/-active/-pressed`)

Corner values at defaults. Focus: "ring" = `focus-width` 2 in `focus-color`; "+0" offset (`focus-offset`), "+gap"
(`focus-gap` 2), "in" (−2, inside).

| Family | Corner per part | Stroke (width · colour) | Shadow | Rest bg | Hover | Pressed | Focus | Selected / current | Open | Disabled |
|---|---|---|---|---|---|---|---|---|---|---|
| Button | md 8 (own height ladder, pill hook) | outline: stroke-width `_line`; soft: `edge-buttons` | `shadow-field` (0) | solid / surface / soft / none | plate or wash; ink fixed | `_bg-active`, give scale | ring +0 | `_surface-active`, no press | menu trigger only: `_bg-active` (button.css:166) | opacity 0.5 |
| Button group, Split button | joined, outer corners only | seams: outline `_line`, solid 24% on-solid literal (split-button.css:41) | field | per Button | per Button | per Button | per Button | per Button | split chevron rotates | opacity |
| Toggle group soft | track = control 8; items 8 − 2 = 6 ✓ | track outline `border-width` `edge-buttons` | item `shadow-control` | `bg-component` | `bg-hover` | **`bg-active`** (the selected wash) | Button ring | raised thumb: surface + `edge-selected` + `shadow-control` | — | opacity |
| Segmented | track 8; items max(4, 8 − 2) = 6 ✓ | track outline **`stroke-width`** `edge-buttons` | thumb `shadow-control` | `bg-component` | `bg-hover` | **literal `light-dark(#00000013, #fcfcfc2a)`** (segmented.css:107) | ring +0 | raised thumb (same as Toggle group) | — | opacity |
| Tabs (underline) | — | track `edge-dividers`/`border-divider` gradient; indicator `fg-selection` | — | none | underline `border-hover` | underline `fg-muted` | inside (::before) | weight 500 + default ink + indicator | — | opacity |
| Tabs (plate) | row corner | — | — | none | plate | pressed, **also on selected** (navigation.css:240) | inside | `bg-component-active` plate | — | opacity |
| Nav | rows `radius-row` 8 | separators `edge-dividers` | — | none | plate | pressed, **also on current** (nav.css:261–263) | ring in | active plate or marker `fg-selection` | row actions keep reveal | opacity (row parts) |
| Menu item (and List box list, Command palette, Combobox, Custom select options) | `radius-list-row` 10 (field lists 8) | separator `edge-dividers` | — | none | plate | pressed, **not on selected** | plate only (active descendant) | value pickers: active plate + check `fg-selection` | sub row: hover plate | opacity; inactive: parts at 0.5 |
| Select options (native) | 8 | — | — | none | plate | **none** (no `:active` paint, navigation.css:837 only sets timing) | plate | **check alone, ink `currentColor`**, no plate | — | **ink** `fg-disabled` |
| Tree view | rows `radius-row` 8; chevron plate `radius-small` 6 | guides `edge-dividers` | — | none | plate | pressed, not on selected/current | ring in | active plate; steps back to hover off-focus | — | opacity |
| List box grid | `radius-row` 8 | — | — | none | plate | pressed, **also on selected** (list-box.css:51) | ring in | active plate | — | opacity |
| Table | frame own formula min(16, round(down, 10 × 1.5, 2)) = **14** | frame `edge-blocks`; rows `edge-dividers` | — | page / well head | plate (interactive) | pressed, not on selected | row ring in; wrapper +gap | active plate; steps back off-focus | — | — |
| Pagination | own height 8 (+pill-button) | — | — | none | plate | pressed, **also on current** | ring +0 | active plate + default ink | — | — |
| Calendar day | min(8, corner(day)) | today ring `edge-control-hover` (doc says `stroke-control`) | — | none | plate; circle variant: **active plate** for hover | pressed, not on selected | ring +0 | `selection-solid`; range band `selection-band` | — | **ink** `fg-disabled` |
| Checkbox, Radio | box min(corner(size), 7/16·size); radio round | `edge-control-hover` | — | page | edge strong | card scale | ring +0 (card: +gap) | selection solid; card edge `stroke-selected` @ selected-width | — | opacity |
| Choice card / soft row | row ladder; tile/preview surface | `edge-options` | — | `bg-component` (soft) | soft: plate; card: edge | card: scale only; **soft: none** | ring +gap | `stroke-selected` inside + `selected-tint` | — | opacity; read-only drops the selected edge (choice.css:209) |
| Switch | track own height + pill | `stroke-control` edge; Tracks group | thumb `shadow-control` | `fill-track` | ::before wash | yes | track ring +0 | selection solid | — | opacity |
| Slider | thumb round; bar variant `radius-control-md` | rail `edge-tracks` | thumb `shadow-control`; grip literal 0 0.5 1 10% (slider.css:466) | `fill-track` | fill fade | thumb grows | thumb ring +0 | — | — | opacity |
| Input, Textarea, Number field, OTP, Tag picker field, Select, Custom select / Date picker triggers | own height ladder 8 (+pill-field) | outline: `input-edge`; soft: `input-edge-soft` (`edge-fields`) | `shadow-field` (0) | surface / `bg-component` | edge `edge-control-hover` | — (fields) | field focus: ring +0, halo, recolour by setting | — | Custom select: `_bg-open` + **hover edge**; Date picker: **focus edge** (date-picker.css:91–93) | field paint, ink `fg-disabled` (no opacity) |
| Input group | field corner | seams **`border-decorative`** (input-group.css:124) | field | field | edge | — | group ring | — | — | field paint |
| Composer | concentric container formula | `composer-edge` | `shadow-resting` | surface | edge | — | edge `composer-focus-color` + halo drawn in **`--area-shadow-color`** (composer.css:59) | — | — | field paint |
| Chip | own height + pill; inner max(4, outer − 4) | stroke-width `_border` | — | input: `bg-mark` | `bg-mark-hover` | **literal rgb(0 0 0/.154)** (chip.css:107) | ring +0 | `selection-surface` + `selection-edge` + `fg-selection` | — | opacity |
| Badge, Count, Tag, Kbd | own height (pill set); **Kbd round(nearest, 1px)** (kbd.css:10) | `edge-tags` (Tag/Count inset shadow; Badge/Kbd border) | Badge modern `shadow-control` | `bg-mark`; **Tag literal `rgb(42 28 0/.07)`** (tag.css:28) | link badge underline | — | link badge ring +0 | — | — | Tag opacity |
| Card | max(4, 16 + min(2, 16)) = 18, capped 1.5 × 18 → 18; media 18 − 7 = **11 (odd)** | `edge-cards` @ border-width | `shadow-resting`, lift on link hover | `bg-card` | lift / edge | edge `border-hover` at Hover shadow 0 | ring +gap | `stroke-selected` inside | — | — |
| Surface | parent − inset, floored | one edge per boundary | resting (outermost) | layer step | — | — | — | — | — | — |
| Asset card, Design card | container + 8 (design card) = 24 | `edge-cards`; inner frame `edge-media` | resting + lift | tile | edge / lift | — | +gap | `stroke-selected` | — | — |
| Board column / card | column row + 8 = 16; card row 8 ✓ | card: tone ring as Cards group mix | resting | tone translucent | card plate | **literal `#00000013`** add plate (board.css:105) | +gap | — | — | — |
| Panel | `radius-container` 16 | `edge-regions` @ border-width | `shadow-resting` | surface | — | — | toggles +0 | — | — | — |
| Alert | bar `radius-control-lg` 10; multiline 16; flush 0 | `edge-callouts` / tone border | none | tone tint (light mixed in oklab) | — | — | link +gap | — | — | — |
| Code block | control-sm + header + 1 (header dependent, not resolved) | `edge-blocks` @ stroke-width | — | `bg-code` | line number underline | — | +gap; toggle in | linked line `bg-active` | — | — |
| Description list framed, Queue, Plan steps, Edit summary diff | 16 / 16 / **14** (`radius-list`) / max(4, 16 − 4 − 8) = 4 | `edge-blocks` | — | surface / subtle / code | rows plate | rows pressed (Queue, Plan) | heads in | — | — | — |
| File upload, File upload item | **`radius-surface` raw leaf** (file-upload.css:11, 94) | zone `_edge`; item **`input-edge`** | — | surface | edge | — | — | dragging: `selection-edge` + hover plate | — | opacity |
| Accordion trigger, Step row, Description list "more", Code line number | **`radius-small` 6** for full-width rows | — | — | none | plate | Accordion yes, **Step none** | Accordion **+0** (outside), Step **+0**, more +gap | — | — | Accordion opacity |
| Approval | concentric formula | `composer-edge`; options inset `input-edge-soft` | — | input bg | plate | pressed | **plate + ring in** | active plate | — | — |
| Prompt suggestions | `radius-row` | — | — | none | plate | pressed | **plate + ring in** | — | — | — |
| Editable text | min | — | — | none | `bg-hover` | **none** | +gap | editing: `selection-surface` + 1px `field-focus-color` | — | — |
| Color swatch picker | cell | swatch ring literal 70% white / 15% black (color.css:202, 211) | — | none | `bg-hover` | **none** | ring +0 / in | **inset `space-2` in `fg-selection`** (color.css:146), not selected-width / stroke-selected | — | opacity |
| Alignment picker | max(4, sm 8 − 4) = 4 | — | — | none | `bg-hover` | yes | ring +0 | dot `--_selected-mark` | — | opacity |
| Time field segment | **`radius-min` 2** | — | — | none | — | — | **fill only, no ring** (`selection-surface`, time-field.css:48) | — | — | ink |
| Splitter / Panel resize | — | line `border-width` → 2px literal on hover/drag | — | — | `border-hover` line | drag: **`accent-indicator`** (splitter.css:114) | `focus-color` line | — | — | — |
| Toggletip trigger | own box ladder | — | — | none | plate | pressed | ring +0 | — | **active plate** | — |
| Breadcrumb ellipsis | ::before plate | separators `stroke-control` | — | none | plate | pressed | ring +0 on ::before | — | **hover plate** | — |
| Mention, Citation, Link, Abbreviation | full / min | Mention inset edge | — | plate (Mention, Citation) | underline colour | Citation yes, others none | +gap | — | — | — |
| Presence, Indicator, Meter, Progress, Spinner, Skeleton, Avatar | round / own size; Meter swatch `space-2` literal; Skeleton per part | Progress `edge-tracks`; Avatar ring | — | Skeleton **light literal rgb(143 143 143/.1, .16)** (display.css:165) | — | — | — | Avatar active ring | — | — |
| Passive families (Empty state, Page header, Figure, Hatnote, Inline list, Link groups, Shortcut list, Timeline, Timestamp, Stack, Field, Display text, Turn notice, Token, Token row, Reference list, Table of contents, File image/page/tile, Folder, Asset row, Preview frame, Box model/field, Chart, Model picker, Zoom control, Filter bar, Setting row, Password/Search field, Date range picker, Composer menu, Copy button, Scroll area) | thumbnails `radius-small` 6; Preview frame 16; File image literal 8% of size (spec) | rules `edge-dividers`; Token row code **`border-divider`** | — | well / none | compose Button, Menu or Input | — | — | — | — | — |

## 3. Findings, most severe first

### S1 · defect · The Corner setting's number is not the medium Button's corner at the shipped type
`radius-step` is `corner(32px)` (emit/base.ts:537), the corner of a 32 box. The medium control is 30 at Type 13
(18 + 6·2), so Button md draws round(down, 9.375, 2) = **8**, while the setting reads "10px on a medium Button"
(radius.ts:42) and DESIGN_SYSTEM.md:604 says the setting is "the medium Button's corner". Everything capped by
`radius-step` therefore runs 2 rounder than any Button: `radius-list-row` = min(12, **10**, 13) = 10, so Menu,
Context menu and Command palette rows (30 tall) are **10** while Nav, Tree view and List box rows of the same 30 height
are `radius-row` **8**, Buttons 8 and field lists 8. The comment in `radius-list-row` (base.ts:542, "no rounder than the
medium Button") is false at the default.
**Fix (rule):** `radius-step` = `radius-control-md` (the corner of the real medium control at the current type and
density), and the axis description says "the corner of a 32px control" or is restated per type. Families that change:
Menu, Context menu, Command palette, Model picker, Zoom control, Split button menu (rows 10 → 8, lists 14 → 12, the
field-list value already), `radius-floor` (unchanged, 4), Kbd's and Stepper's own corners where they read the step.
Visibly: floating-list rows match Nav rows and Buttons. **M**, confidence high (arithmetic; not rendered).

### S2 · defect · Close buttons and end controls are not concentric with their surfaces at the default corner
Every surface comment proves concentricity at the old default 8 (surface 12); at 10 (surface 16) the controls keep the
control ladder and fall off it:
- Dialog / Confirm dialog / Drawer: corner 20, md close at 9 from the edge, corner 8: concentric value 11 (**3 off**;
  surface.css:963–966, 1027–1029).
- Toast: one-line corner 10, end control sm at 5 in, corner 8: needs 5 (**3 off**); titled 16 needs 11 (**3 off**)
  (surface.css:1735–1742, 1779–1781; the comment's "6px radius concentric with the 12px corner" is stale).
- Popover: corner 16, sm close at 7 in, corner 8: needs 9 (1 off; surface.css:1236–1243).
- Tooltip + Kbd: 10 corner, Kbd 3 in, corner 6: needs 7 (1 off).
**Fix (rule):** DESIGN_SYSTEM's own sentence "A button set into a corner takes that corner less its inset" applied as a
token: a surface publishes `--_corner` and its corner control takes `max(radius-floor, corner − distance)` (as Composer
actions, Toolbar and Approval already do). Families: Dialog, Confirm dialog, Drawer, Popover (Hover card, Toggletip
popup), Toast, Alert's dismiss, Tooltip's Kbd. Visibly the dismiss plate curves with the corner (11 in a dialog, 5 in a
one-line toast). **S–M**, high.

### S3 · inconsistency · The open trigger is painted five ways
- Button with `aria-haspopup="menu"`: its `_bg-active` (the pressed plate) (button.css:166). A Button that opens a
  Popover or dialog (`aria-haspopup="dialog"`, `true`, listbox) gets **nothing**.
- Custom select ghost: `bg-component-active` (the selected plate), although its comment says "the pressed plate while
  its list is open" (custom-select.css:43–51); outline/soft: the **hover edge** (custom-select.css:114).
- Date picker outline/soft: the **focus edge** (`_border-focus`, date-picker.css:91–93), so under Focus ring Halo an
  open Date picker looks focused and an open Custom select does not; ghost: active plate.
- Toggletip trigger: active plate (toggletip.css:64); Breadcrumb ellipsis: **hover** plate (breadcrumb.css:61); Nav row
  actions: default ink, no plate (nav.css:426).
**Fix (rule):** one "open" paint: a trigger whose popup is open (`[aria-expanded="true"]` with any `aria-haspopup`,
or `data-open`) takes the pressed plate for plate-shaped triggers and the hover edge for field-shaped ones, never the
focus edge. Put it in `button.css` keyed on `[aria-expanded="true"][aria-haspopup]` (not `="menu"`) and in the shared
field chrome. Families: Button (all popup kinds), Custom select, Date picker, Combobox toggle, Toggletip, Breadcrumb,
Model picker, Zoom control, Split button, Nav row actions, Hover card triggers. Add to `cohesion.test.mjs`. **M**, high.

### S4 · inconsistency · Pressed on a selected or current item: some show it, some don't
Show press over selected/current: Nav (nav.css:261–263), Tabs plate (navigation.css:240), List box grid
(list-box.css:51), Pagination (pagination.css:93, current not excluded). Don't: Menu item (surface.css:1326), Tree view
(tree-view.css:63), Table (navigation.css:393), Calendar (calendar.css:125), Approval (approval.css:119), Button toggle
(button.css:479–485, "pressing an on toggle adds no wash"). DESIGN_SYSTEM says pressed "always moves at least the press
room past selected", which reads as "press shows on selected too".
**Fix (rule):** decide once (recommend: press shows on every item, selected included, since a click on the current
item is still a click; that is what Nav and Tabs do and what the press-room derivation was built for), state it in
Shared state paint, and remove the `[data-selected]` / `[aria-current]` exclusions from the `:active` rules (or add
them to the four that press). `cohesion.test.mjs` gets a "press shows on selected" case. Families: the ten above.
**S**, high.

### S5 · defect · Plates with a hover and no pressed state
Select's native options (navigation.css:837–841: timing only), soft Checkbox/Radio rows (choice.css:170; cards have only
the scale give), Editable text preview (editable-text.css:51), Color swatch picker cells (color.css:145), Tree view
chevron plate (tree-view.css:123), Step row (step.css:31, a row with a hover chevron, no plate press), Video player
start. **Fix (rule):** "every hover plate has a pressed plate one step past it" (`bg-component-pressed` or `bg-pressed`
for the translucent twins), enforced by a cohesion test that pairs each `:hover` background rule with an `:active` one.
Families: the seven above. **S**, high.

### S6 · inconsistency · Pressed fills written as literals or borrowed from the selected wash
- Segmented `light-dark(#00000013, #fcfcfc2a)` (segmented.css:107) and Board's add plate `#00000013`
  (board.css:105): fixed 7.5% / 16.5%, so Pressed fill, Layers and Tint do not move them.
- Chip input `light-dark(rgb(0 0 0/.154), rgb(255 255 255/.24))` (chip.css:107): `bg-mark` has rest and hover
  tokens (base.ts:226–227) but no pressed one.
- Soft Toggle group items press to `bg-active` (toggle-group.css:56), the selected wash, while its twin Segmented
  presses to a firmer literal.
Each literal is justified by a contrast cap (the muted label on a grey track), so the real gap is a missing role.
**Fix (rule):** add `bg-pressed-track` (the pressed wash capped where muted text keeps 4.5:1 on a control fill, solved in
base.ts beside `bg-pressed`) and `bg-mark-pressed`; Segmented, soft Toggle group, Board add and Chip read them.
**S**, high.

### S7 · inconsistency · Twin controls draw the same track with different widths and corners
Segmented's track outline is `stroke-width` (segmented.css:58), soft Toggle group's is `border-width`
(toggle-group.css:44); DESIGN_SYSTEM Strokes lists both under `border-width` ("edges of filled shapes"). So at Stroke
width 0 or 2 the Toggle group track changes and the Segmented one does not. Segmented reads the `pill-segmented` hook;
Toggle group has no pill hook, so `data-area-pills="segmented"` rounds one and not the other.
**Fix (rule):** one track recipe (corner, inset, edge width, pill hook, pressed, thumb) shared by Segmented and soft
Toggle group, as Button group shares Button's; pick `border-width` per the doc. **S**, high.

### S8 · defect · Selection colour bypasses the Selection setting in Splitter
Splitter's and Panel resize's dragging line is `accent-indicator` (splitter.css:114), so at the default Selection
Neutral (and Action Neutral) a dragged sash is still blue. DESIGN_SYSTEM.md:175–180: "Both on Neutral is an entirely
neutral look; nothing else reads the accent." The only other raw accent reads are the documented `unseen` dots
(navigation.css:122, tree-view.css:256) and Chip's selected hover edge, which mixes by `selection-accent` correctly.
**Fix:** the sash's drag ink is `focus-color` (already its keyboard ink, splitter.css:125) or `stroke-selected`.
Families: Splitter, Panel. **S**, high.

### S9 · inconsistency · "Selected" for a chosen tile or swatch is drawn three ways
Choice thumbnail/card, Asset card, Design card, Custom select grid preview: `stroke-selected` at `selected-width`,
inside. Color swatch picker: an inset ring of **`space-2`** in **`fg-selection`** on a `bg-surface` plate
(color.css:146), so the Selected edge setting (1/2/3) and `stroke-selected` don't reach it. Alignment picker: the dot's
mark colour only. List box grid: the active plate. **Fix (rule):** a chosen cell in a grid of swatches or pictures
draws the selected edge (`selected-width`, `stroke-selected`, inside, `selected-tint` under it); a grid of glyphs or
words takes the plate. Families: Color swatch picker, Alignment picker (keep the dot, add nothing if it is a glyph
grid; state which), List box grid. **S**, medium (the swatch ring has an iOS spec note).

### S10 · inconsistency · Value pickers show the chosen value differently
DESIGN_SYSTEM.md:276–277: "Value pickers (Select, Combobox) show the value with the active plate and the check."
Combobox, Custom select and List box do; native Select shows the **check alone** (navigation.css:842–843, owner
custom-select.md Q3), its check in `currentColor` (default ink) where Menu's check is `fg-selection`; its options sit 2
apart (`margin-block: space-2`, :826) where every other list is 1 (`ui-row-gap`); its group label is 11/14 400
(`text-xs`, :862–866) where Menu's label is the rows' size at 500 (surface.css:1475–1482), and its comment says 12/16;
a disabled option dims by ink, not opacity.
**Fix:** either the doc moves to "check alone" for every value picker (and Combobox, Custom select, List box drop the
plate), or Select's `::checkmark` takes `fg-selection` and options take the active plate; in both cases Select takes
`ui-row-gap`, Menu's label and the disabled opacity. Families: Select (and the three others if the doc moves).
**S**, high.

### S11 · inconsistency · Disabled by opacity in one place and by ink in another
Shared rule: "Controls, rows and pickers dim to 50% as a whole; text fields keep full opacity and use their disabled
field paint." Departures: Calendar days `fg-disabled` (calendar.css:132), Select options `fg-disabled`
(navigation.css:845), Setting row labels `fg-disabled` (setting-row.css:110), Number field's step and Input's action
buttons `fg-disabled` (number-field.css:153, input.css:272) while Button dims, Time field segments `fg-disabled`.
Custom select and Date picker triggers take the field paint although DESIGN_SYSTEM calls them pickers. Property list's
inactive value is a literal `opacity: 0.5` (property-list.css:29), not `opacity-disabled`.
**Fix (rule):** state the split by shape, not by name: a field-shaped box (anything with the field chrome: Input,
Textarea, Select, Custom select, Date picker, Tag picker, OTP, Number field) uses field paint and its parts follow
`fg-disabled`; everything else dims by `opacity-disabled`, including cells and options. Calendar days and Select options
move to opacity; Property list reads the token. Add the list to the cohesion test. **S**, medium.

### S12 · inconsistency · Focus rings drawn off-rule
- Rows that draw the ring **outside**: Accordion trigger (accordion.css:91, `focus-offset`), Step row (step.css:47),
  Token row copyable (token-row.css:57). Rule: "Rows, tabs and cells draw it inside."
- Rows that draw **plate and ring**: Approval options and tiles (approval.css:113, 228), Prompt suggestions
  (prompt-suggestions.css:56, 66). Menu draws the plate alone, Nav and Tree the ring alone (both documented); these two
  do both.
- Tag picker's field ring has no `outline-offset` (tag-picker.css:102), so under Focus ring Gap or Bold it hugs while
  every other field moves off.
- Time field segment: a `selection-surface` fill and **no ring** (time-field.css:48); Editable text's editing state
  draws a literal 1px `field-focus-color` outline (editable-text.css:63) rather than the field focus roles.
- Composer's focus halo is painted in `--area-shadow-color` (composer.css:59), not a focus colour; every field halo is
  `field-focus-halo-color`. (Composer keeps a quiet edge on purpose; the halo colour looks like a slip.)
**Fix (rule):** the focus placement table (control +offset, container/text +gap, row/tab/cell inside) becomes a
cohesion test over every `:focus-visible` rule; Approval and Prompt suggestions pick one indicator (the inset ring, as
Nav); Tag picker adds `outline-offset: var(--area-focus-offset)`; Time field segments add the inset ring; Composer's
halo reads `composer-focus-color` at the halo alpha. **S**, high.

### S13 · defect · Several floating surfaces miss the material and edge layers every other overlay lists
The overlay box-shadow contract is `var(--_m-layers), var(--area-shadow-edge), var(--_elevation)`. Calendar surface
(calendar.css:56), Color picker surface (color.css:304) and Select's picker (navigation.css:785) list only edge + float,
and none is in `material.css`, so under a glass material Menu and Popover go translucent while a date grid, a colour
picker and a native select list stay opaque. Scroll to latest lists material + float but **no `shadow-edge`**
(scroll-to-latest.css:38), so at Edge shadow > 0 it is the only floating part without the edge. Tooltip is outside
material too (defensible: it's inverse; state it).
**Fix (rule):** one custom property, e.g. `--area-float-shadow-stack`, that every floating surface uses, with material
listing every floating class; cohesion test "every surface on shadow-float/modal lists material and edge". Families:
Calendar, Color picker, Select picker, Scroll to latest (+ Tooltip as a written exception). **S**, high.

### S14 · inconsistency · Modal and floating corners and insets differ without a stated reason
Dialog and Drawer 20 (container + 4), Command palette **14** (`radius-list`, command-palette.css:37), all three on the
modal role. Popover 16 at inset 12, Toast 10/16 at inset 10, Calendar surface 16 at inset 10, Menu 14 at 4. Date
picker's panel is a Popover (16) while Custom select's and Combobox's lists from the same field trigger are 12: the
"a list opened from a field takes the field's corner" rule (DESIGN_SYSTEM.md:638–642) doesn't cover a panel opened
from a field.
**Fix (rule):** write the overlay table into DESIGN_SYSTEM (as 2a above) with the reason per row: lists (Menu, Command
palette's results, field lists) take the list corner; panels (Popover, Calendar surface, Toast titled) the surface
corner; modals (Dialog, Drawer, Command palette's frame) the modal corner. Then Command palette's frame takes the modal
corner with its list inset concentric inside it, or the table says why it is a list. **S** (doc) / **M** (Command
palette), medium: this is a design call.

### S15 · inconsistency · Radius roles: wrong role, raw leaf or private rounding
- File upload and File upload item use **`radius-surface`**, the raw setting leaf (file-upload.css:11, 94), skipping
  `radius-container`'s 1.5 × inset cap that every other surface obeys (differs at Compact and at Corner 12+).
- Full-width rows on `radius-small` (6): Accordion trigger (accordion.css:74), Step row (step.css:31), Description
  list "more" (description-list.css:152); Nav, Tree, Queue, Prompt suggestions rows use `radius-row` (8). A 30 row
  should take its height's corner.
- Kbd rounds to **1px** (`round(nearest, …, 1px)`, kbd.css:10) where every ladder corner rounds down to 2px: the
  16 box gets 5. DESIGN_SYSTEM.md:644 says "Kbd is a 24px box's corner at every size"; the code takes its own height.
- Stepper marker uses `corner(24px)` literal (stepper.css:88); Time field segment `radius-min` (2) inside an 8 field
  (needs field − inset); Table frame has its own `min(container, 1.5 × (12 − 4·dense))` = 14 (navigation.css:292) where
  Description list framed and Queue, the same Blocks group, are 16 and Plan's steps borrow `radius-list` 14.
- Redundant `min(x, x)`: attachment.css:17, alignment-picker.css (two `min(radius-control-sm, radius-control-sm)`).
- Card's media corner at the default is **11** (18 − 7) because `ui-dense` 0.5 makes the card inset 7: concentric, but
  the only odd corner on the ladder.
**Fix (rule):** a lint in `cohesion.test.mjs`: components may read only the public roles (`radius-control-*`,
`-container`, `-row`, `-list(-row)`, `-small`, `-full`, `-floor`, `-min` inside a formula) and the shared corner
expression, never `radius-surface`, a px literal or a private rounding step. Blocks (Table, Code block, Description list
framed, Queue, Plan, Edit summary, Settings group) share one block corner. Doc Kbd sentence corrected or the code
pinned. **S–M**, high for the facts.

### S16 · inconsistency · Seams inside joined controls use three colours
Rule (DESIGN_SYSTEM.md:453–455): seams inside joined controls keep `edge-control`. Button group soft seams: control
edge; Split button solid: `on-solid` 24% literal (split-button.css:41, spec); outline: `_line`. Input group seams:
**`border-decorative`** (input-group.css:124) and the focused child's edge `border-decorative` (:77), the lightest rung,
lighter than the group's own edge, against the rule and against the Fields stroke group. **Fix:** Input group seams read
`edge-control` (or `input-edge`), as Button group. Families: Input group (and Color field's inner seam if it shares
the pattern; not verified). **S**, high.

### S17 · inconsistency · The Elevation and Strokes docs describe rungs the code no longer uses
- DESIGN_SYSTEM.md:373–376 and the Strokes rung table (:446) say `border-float` (#ee / #4b) frames every floating surface;
  **no component reads `border-float`**: every frame reads the Floating stroke group, `edge-floating` (12.5% of the
  text colour), surface.css:979, 1109, 1587, 1740; calendar, color, command palette, drawer, navigation, toolbar,
  selection bar, app shell.
- The rung table says every divider is `border-decorative` and opt-in divided rules `border-divider`; dividers read
  `edge-dividers` (23 files) and `border-decorative` survives only in Input group; `border-divider` only in Chart's
  baseline, Token row's code edge and the Tabs track gradient (navigation.css:106, mixing both).
- Calendar's today ring is `edge-control-hover` (calendar.css:16), not `stroke-control` as the rung table says.
- Comments carrying the old default: Menu "12 at the default" and "3% at the default 3" (surface.css:1111, 1115),
  Dialog "12 + 4 = 16" (:966), Toast "12px corner, 6 in" (:1685–1689), radius.ts header "8 (default)" (:5),
  Tooltip "10px at the default radius 8; 28" (:1617–1622), Select optgroup "12/16 on a 32 row" (navigation.css:858).
**Fix:** regenerate the Strokes table from `stroke-groups.ts` (groups first, rungs only for what no group covers:
Chart baseline, Token row, Tabs track, Box model, disabled `border-faint`), and point the Elevation sentence at
`edge-floating`. Comments state formulas, not default numbers (or a check that flags `at the default` numbers). **S**,
high.

### S18 · opportunity · Forced-colours gaps
Covered (forced-colors.css plus 37 component files): fields, choice controls, Switch, Slider, Progress, Tabs, Nav,
Tree view, Table rows, Menu rows, Segmented and Button selected, Calendar, Badge, Tag, Chip selected, Splitter,
Tooltip edge, Toolbar and Selection bar outlines. Not covered, by source search:
- Focus outlines for Custom select trigger, Date picker trigger, Tag picker field, OTP slots are drawn in
  `field-focus-color` with no `Highlight` rule (the forced list at forced-colors.css:48–56 names Input, Textarea,
  Select, Number field, Input group, Composer only). A browser forces `outline-color` to a system colour anyway, but
  Area restores `Highlight` explicitly elsewhere; these are the exceptions.
- Selected state drawn as a fill or an inset box-shadow, which forced colours remove: soft Toggle group's selected
  item, Pagination's current page (covered at pagination.css:136 ✓), Approval option and tile selected, List box grid
  selected, Combobox/Custom select `data-selected` options (covered only if the row carries `.area-menu__item
  [data-selected]`, not verified), Custom select grid preview ring (inset box-shadow), Color swatch picker selected ring
  (covered by an outline ✓), Design card / Asset card selected ring part drawn as inset shadow (Asset card covered ✓,
  Design card not found).
- Time field focus fill (covered by `Highlight` fill ✓, no ring).
**Fix (rule):** a cohesion test that every selector with `[data-selected]`, `[aria-selected="true"]`,
`[aria-current]`, `:checked` or `[aria-pressed="true"]` whose only cue is `background*` or `box-shadow` has a
forced-colours rule. Families: Toggle group, Approval, List box grid, Custom select (grid), Design card, and the four
field triggers' focus. **S**, medium (not tested in Windows forced colours).

### S19 · defect (low) · `::selection` forces the default ink on inverse and dark grounds
base.css:26–29 paints every selection `selection-highlight` with `color: fg-default`. On an inverse Tooltip in light
(dark fill, light text, no `user-select: none` on `.area-tooltip`) selected words turn near-black on near-black plus a
12% black wash; the same happens on any `color-scheme: dark` island in a light page (Video player, Attachment glass,
attachment.css:138/194, video-player.css:44) only if their tokens don't re-resolve (they do via color-scheme, so those
are probably fine). **Fix:** `::selection { color: inherit; }` on inverse surfaces, or a scoped
`--area-selection-ink` that inverse grounds re-point; Tooltip either takes that or `user-select: none` if its text is
never meant to be copied (Toggletip's should be copyable). **S**, medium (not rendered).

### S20 · inconsistency · Literal colours that bypass roles (classified)
Drift (a role exists or should): Tag's neutral plate `rgb(42 28 0/.07)` / `rgb(255 255 255/.1)` (tag.css:28) duplicates
`--area-hue-neutral-bg` (DESIGN_SYSTEM.md:148 gives the same values) and should read it; Skeleton's light fill and
band `rgb(143 143 143/.1, .16)` (display.css:165–166) don't follow Layers or Tint while dark reads tokens; the three
pressed literals of S6; Property list `opacity: 0.4/0.5` (property-list.css:29, 66).
Justified spec (unknown grounds or fixed physics; keep, mark): media chrome on video (video-player.css 32–88,
attachment glass 22–24), colour-picker gradients, thumb rings and hue tracks (color.css 202–432), Slider grip `#fff`
and its 10% shadow (slider.css:459–466), Tooltip's dark 5% white edge (surface.css:1647), Split button's on-solid 24%
seam, Button solid press `#000 18% / 10%` mixes (button.css:45, 252–340, a derivation), Token's `oklch(from
currentcolor …)` code plate, gradient masks `#000` (nav, tree view, code: masks, not paint), Diff line tints
(edit-summary.css:243, tone solid at 14/24%: consider a `diff-added` role shared with Code block's added line, which
uses `success-surface`, code.css:440, a different paint for the same meaning).
**Fix:** the Diff vs Code block added/removed line paint becomes one role pair; Tag and Skeleton read roles. **S**,
high.

### S21 · refinement · The Menu family's concentric arithmetic ignores its own border
Menu, Command palette, Select picker and field lists inset rows by 4 inside a 1px frame and compute the row corner as
list − 4 (surface.css:1276–1280: "the 1px border is left out so corners stay even; counting it gives 7"). The row sits
5 from the outer edge, so the true concentric corner is list − 5. Card, Popover, Dialog and Toast instead subtract the
border from the padding (`inset − border-width`) so the content edge is where the math says. Two conventions.
**Fix (rule):** one convention, recommended the surfaces' one (padding = inset − border, the border counted once, as
inset.css requires): Menu's padding becomes 4 − border, so rows sit 4 from the outer edge and list − 4 is exact; at
Stroke width 0 nothing changes. Families: Menu, Context menu, Command palette, Select picker, Combobox, Custom select,
Tag picker lists. Visible change: rows 1px wider in each direction. **S**, medium (owner made the current call).

### S22 · refinement · Read-only is not visible and drops the selected edge on choice cards
Read-only changes only `cursor` on Input, Number field, OTP, Tag picker, Custom select, Date picker, Switch, Time field
(and suppresses hover), so a read-only field reads as editable until clicked; CONTRAST.md:156 asks that
"disabled/read-only/loading remain distinct". On a checked read-only choice card the selected edge is removed
(choice.css:209: `border-color: var(--_card-edge); box-shadow: none`), so the chosen card looks unchosen apart from its
small control. Radio group spells it `data-readonly` beside the shared `data-read-only` (choice.css:206).
**Fix (rule):** read-only keeps every state's paint (checked keeps its edge) and drops only hover and press; fields take
one quiet cue (the `border-faint` edge disabled uses, or no fill change but a muted chevron). One spelling. **S**,
medium (design call).

### S23 · refinement · Scrollbars are styled in one place only
Scroll area draws Area's overlay bar (scroll-area.css). Every other scroller is the native bar with no
`scrollbar-color` / `scrollbar-width`: Dialog body (surface.css:1087), Drawer body when not a Scroll area, Command
palette list when not a Scroll area, Menu `[popover]` without Scroll area (surface.css:1855), Select picker
(`overflow: auto`, navigation.css:771), Textarea, Code block, Table wrapper, Popover. So the same app shows two
scrollbar looks, and in dark the native bar depends on `color-scheme` being set on the scope (it is on `:root` and on
theme scopes, css.ts:113, 161). **Fix (rule):** every scrolling region in a component either is a Scroll area or sets
`scrollbar-width: thin; scrollbar-color: var(--area-fg-placeholder) transparent` from one shared token; Select's picker
and Textarea at least take the token. **S**, medium.

### S24 · inconsistency · Two hover-to-reveal mechanisms
Rule (DESIGN_SYSTEM.md:268–269): reveal content "stays unwrapped, with a `hover: none` rule that shows it". Half the
reveals do that (Attachment, Message, Nav chevron, Panel chevron, Queue, Prompt suggestions, Property list, Step,
Card overlay, Tree view actions, Edit summary, Asset card); the other half hide inside `@media (hover: hover)` so touch
never hides them (Nav row actions, Panel section actions, Setting row reset, Code block actions, floating Toolbar).
Both work; the second is safer. **Fix:** make the second the rule and convert the first group (it drops a rule each).
**S**, high.

### S25 · refinement · Odd half-step insets at the shipped type
`ui-dense` is 0.5 at Type 13 Density 32, so every inset written `x − 2·dense` lands on an odd pixel: Card inset 7 and
media corner 11, Tooltip inline 9, Card text 18 (even), `gap-row` 10 (so the "36 column" of list rows is 34;
DESIGN_SYSTEM.md:325–326). Not wrong (whole pixels), but the list-row column doc and Card's "8 + 8 = 16" comment
(surface.css:35–40) describe Type 14. **Fix:** docs quote the formulas and the Type 13 values; consider whether Card's
media inset should round to the 2px ladder like gaps do (`ui-gap-step`), which would make the media corner 10. **S**,
low-medium.

## 4. Already excellent, do not disturb

- One corner setting with height-scaled corners and live `calc()` derivations; field lists inherit the field's corner;
  floors keep only Sharp square.
- Every shadow comes from a role (only the colour-picker thumbs and Slider's grip are literal, both functional); roles
  are eight-slot lists that never use `none`, so states interpolate.
- Every pointer hover is under `@media (hover: hover)` (167 rules, 0 unwrapped) and no hover changes foreground except
  the documented row-action exception.
- Focus is one width and colour token everywhere (49 rules), with a field-specific triplet that the Focus ring setting
  drives; inactive controls fade parts, never the focusable element.
- Overlays share one scrim token, one overlay scale, one motion recipe, whole-pixel centring.
- Stroke groups: translucent text-colour edges that keep their distance on every ground, with Contrast taking every
  group to 3:1.
- The danger row's red plate solved at the plate's own lightness (surface.css:1401–1417).
- Selection off-focus stepping back to the hover plate, with a contrast floor.
