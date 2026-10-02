# Compact density evidence inventory (2026-10-02)

Read-only audit of `[data-area-ui="compact"]` values. Captures read from `docs/research/captures/**` (box and computed style). `capture_check`: verified = number read from the JSON matches; mismatch = the note's claim does not match the capture; unverified = the claimed capture value is not in the file.

Counts: CONFLICT 11, MEASURED-DENSE 22, MEASURED-OTHER 1, PICK 4, RULE 81 (total 119)

## Tokens and ladders

| # | Role / component | Property | Default | Compact | Step | Class | Evidence | Notes | Check |
|---|---|---|---|---|---|---|---|---|---|
| 1 | control-xs | height | 24 | 20 | -4 (-17%) | **RULE** | One rung down (proportional step-down, owner 2026-10-01); extends below Primer's 24/28/32/40/48 ladder | No dense capture shows 20. Nearest: VS Code inline/extension action 18 at 11px (compact/vscode--extension-action: box h 18), keybinding 18. | n/a |
| 2 | gutter-xs | padding-inline | 8 | 6 | -2 (-25%) | **RULE** | Proportional step-down | No capture. VS Code extension action sides 5 (+1 border) at 18 tall. | n/a |
| 3 | icon-xs | size | 12 | 12 | +0 (0%) | **RULE** | Icon ramp 12/16/24 only (VS Code codicon linter, Octicons; density.ts comment) | Held. | n/a |
| 4 | control-sm | height | 28 | 24 | -4 (-14%) | **MEASURED-DENSE** | docs/research/captures/compact/figma--size-select 24 (select/), figma--tab 24 (tabs/), figma page row 24; docs/research/captures/compact/vscode--icon-button 22 | Figma controls 24 exactly; VS Code 22. | verified |
| 5 | gutter-sm | padding-inline | 8 | 8 | +0 (0%) | **MEASURED-DENSE** | select/figma--size-select pad-left 8 (+1 border); tabs/figma--tab pad 0 8 | Held. | verified |
| 6 | icon-sm | size | 16 | 16 | +0 (0%) | **MEASURED-DENSE** | docs/research/captures/compact/vscode--icon-button: 22 box, codicon 16, pad 3 | Was 12 in the earlier compact; now native 16. | verified |
| 7 | gap-sm / gap-md | icon-to-label gap | 6 | 4 | -2 (-33%) | **RULE** | Proportional step-down (xs and earlier compact sm already 4) | Note table: VS Code '—'. Figma menu (menu/figma--account-menu) puts a 4 margin after a 24 icon box holding a 12 glyph, i.e. ink gap ~10: not comparable. | n/a |
| 8 | control-sm/md text | UI type | 14/20 | 12/16 | — | **MEASURED-DENSE** | docs/research/captures/compact/vscode--button-sidebar 12/16; docs/research/captures/compact/vscode--hover 12/19; docs/research/captures/compact/vscode--status-item 12 | VS Code lists are 13/22, Figma 11/16. 12/16 is the ramp stop (owner). | verified |
| 9 | control-md | height | 32 | 28 | -4 (-12%) | **RULE** | One rung down on Primer's ladder (owner kept 28) | No dense capture shows 28: VS Code button 26 (vscode--button-sidebar h 26), input 26 (vscode--search-input h 26); Figma select 24, Figma search field 32. | n/a |
| 10 | gutter-md | padding-inline | 12 | 8 | -4 (-33%) | **MEASURED-DENSE** | docs/research/captures/compact/vscode--button-sidebar pad 4 8 4 8 (+1 border); docs/research/captures/compact/vscode--search-input pad 2 6 (+1) |  | verified |
| 11 | icon-md | size | 16 | 16 | +0 (0%) | **MEASURED-DENSE** | docs/research/captures/compact/vscode--icon-button codicon 16 | Held. | verified |
| 12 | control-lg | height/gutter/icon/gap/type | 40 /12/16/6 14/20 | 32 /12/16/6 14/20 | — | **RULE** | One rung down: compact lg = default md | No capture. | n/a |
| 13 | control-xl | height | 48 | 36 | -12 (-25%) | **PICK** | None stated; 36 is off the 24/28/32/40/48 ladder (one rung down would be 40) | Inconsistent with the one-rung rule used by every other tier. | n/a |
| 14 | gutter-xl | padding-inline | 16 | 14 | -2 (-12%) | **PICK** | None stated; 14 is off the 4px grid |  | n/a |
| 15 | icon-xl | size | 24 | 16 | -8 (-33%) | **RULE** | 'Icons keep their native 16 from sm up, as VS Code's 22px buttons do' |  | n/a |
| 16 | control-xl text | type | 16/24 | 14/20 | — | **RULE** | UI ramp one step down |  | n/a |
| 17 | ui-row | list/menu row height | 32 | 24 | -8 (-25%) | **MEASURED-DENSE** | docs/research/captures/compact/vscode--context-menu rows 24 (a.action-menu-item h 24); docs/research/captures/compact/figma--page-row 24; menu/figma--account-menu rows 24; menu/figma--item 24 | Owner pick 2026-10-01 too. VS Code lists/quick pick/tree are 22. | verified |
| 18 | ui-row-inset | row glyph edge | 8 | 6 | -2 (-25%) | **CONFLICT** | Rule: steps with the row | Dense captures keep 8-9: Figma menu icon box 8 in from row (menu/figma--account-menu span pad-left 8), Figma page row text 8 (docs/research/captures/compact/figma--page-row), Figma layer row text 8; VS Code quick pick text 9 in row (vscode--quick-pick-row: label rows at x 9). No dense capture shows 6. (VS Code quick pick 6 is the list's inset from the shell, a different quantity.) | verified |
| 19 | gap-row | row icon-to-label gap | 12 | 8 | -4 (-33%) | **RULE** | Steps with the row; label column = row-inset + 16 + gap = 30 | Dense label columns bracket it: Figma menu label 36 in from row (account-menu: row x 8, label x 44), VS Code context menu text 26 in row (2em padding). Neither shows 30. | verified |
| 20 | inset-surface-sm | floating-surface inset (Popover, Toast sides, Panel sm, Calendar) | 12 | 8 | -4 (-33%) | **CONFLICT** | One rung down; note cites 'VS Code hover 9' | vscode--hover is the compact workbench hover (25 tall, 12/19, radius 3, pad 2 8 +1 border): the same element used as the Tooltip reference, not a popover. Figma's popover (figma--color-picker--open) insets 16 (spectrum pad 16, controls pad 0 16); Figma account menu header pad 16. VS Code quick pick 7 is a list inset. | mismatch (capture is a tooltip) |
| 21 | inset-surface-md | section gap / md surface inset | 16 | 12 | -4 (-25%) | **RULE** | One rung down | Per-consumer evidence below (Popover/Dialog section gap, Panel md, Color picker, Tabs). | n/a |
| 22 | ui-stack | label-to-control gap | 6 | 4 | -2 (-33%) | **MEASURED-DENSE** | field/figma--dimensions-row: legend line box 0-16, field at 19 (gap 3; label ink to field ~5) | Weak: one capture, 9px label. | verified |
| 23 | ui-cluster | clustered-item gap / bar inset | 8 | 6 | -2 (-25%) | **RULE** | One rung down | Dense captures bracket it: VS Code modal header action gaps 4 (vscode--settings-dialog separator margin 0 4); Figma toolbelt/field/format rows gap 8 (toolbar/figma--toolbelt-row, field/figma--dimensions-row column-gap 8). None shows 6. | verified |
| 24 | mark-label-sm | text mark height | 16 | 16 | +0 (0%) | **MEASURED-DENSE** | badge/figma--plan-badge 16 at 11/16 | Floor of a 12/16 label (rule). | verified |
| 25 | mark-label-md | text mark height (Badge, Count, Kbd) | 20 | 16 | -4 (-20%) | **MEASURED-DENSE** | badge/figma--plan-badge 16 at 11px | VS Code keybinding 18 at 11px (compact/vscode--keybinding), count 19 at 10px, new-badge 17 at 11px: larger than 16 with smaller type. | verified |
| 26 | mark-label-lg | text mark height | 24 | 20 | -4 (-17%) | **RULE** | One rung down | No capture. | n/a |
| 27 | mark-sm/md/lg (static) | Switch track, Presence, Swatch, Indicator count | 16/20/24 | 16/20/24 | — | **RULE** | Static marks hold (main audit S21a C) | VS Code badge 17 (badge/vscode--badge-new h 17), keycap 18: verified. | verified |
| 28 | text-xs | caption | 12/16 | 12/16 | — | **RULE** | UI ramp clamps at caption (typography.ts) |  | n/a |
| 29 | text-md | body | 16/24 | 14/20 | — | **RULE** | One step down the UI ramp (typography.ts textRamp(-1)) | No dense body-text capture (VS Code editor/settings description, Figma comments). | n/a |
| 30 | title-* | titles | 16/24… | held | — | **PICK** | Audit H-7 A (owner 2026-09-30) | Titles hold at compact. | n/a |
| 31 | radius-control-xs | corner | 4 | 3 | -1 (-25%) | **RULE** | Dense ladder, 'about a third' | No capture (compact xs 20 has no default tier at 20). | n/a |
| 32 | radius-control-sm | corner | 6 | 4 | -2 (-33%) | **MEASURED-DENSE** | Rule: radius follows painted height (24 reads default xs 4). docs/research/captures/compact/vscode--icon-button 22 radius 4 | Figma 24 controls radius 5. | verified |
| 33 | radius-control-md | corner | 8 | 6 | -2 (-25%) | **RULE** | Radius follows painted height (28 reads default sm 6) | Dense controls are 4-5: VS Code button/input 4, Figma select/tab 5. Rule is grounded in Area's own default curve, not dense data. | verified |
| 34 | radius-control-lg | corner | 10 | 8 | -2 (-20%) | **RULE** | 32 reads default md 8 |  | n/a |
| 35 | radius-control-xl | corner | 12 | 10 | -2 (-17%) | **RULE** | Dense ladder | 36 has no default tier; value interpolated. | n/a |
| 36 | radius-container | surface corner | 12 | 8 | -4 (-33%) | **MEASURED-DENSE** | docs/research/captures/compact/vscode--quick-pick 8, docs/research/captures/compact/vscode--context-menu 8, docs/research/captures/compact/vscode--settings-dialog 8 | Partial conflict: Figma surfaces 13 (figma--color-picker, menu/figma--main-menu), Notion 10-12. VS Code hover 3. | verified |
| 37 | radius-small | badge/swatch corner | 6 | 4 | -2 (-33%) | **MEASURED-DENSE** | badge/figma--plan-badge radius 4 | VS Code keycap 3, new-badge 4. | verified |
| 38 | radius-row | row corner | 8 | 6 | -2 (-25%) | **MEASURED-DENSE** | docs/research/captures/compact/vscode--context-menu row radius 6 | VS Code quick pick/tree rows 4, Figma rows 5. | verified |
| 39 | radius presets (subtle…rotund, pill) | dense ladders | per preset | per preset | — | **RULE** | Same painted-height rule per preset; container/small/row hand-stepped | No capture for non-standard presets. | n/a |

## Rows

| # | Role / component | Property | Default | Compact | Step | Class | Evidence | Notes | Check |
|---|---|---|---|---|---|---|---|---|---|
| 40 | Menu | container inset | 4 | 4 | +0 (0%) | **MEASURED-DENSE** | docs/research/captures/compact/vscode--context-menu: row margin 0 4, list at y 5 (4 + 1 border) | Figma menus 8 (menu/figma--account-menu li pad 0 8; menu pad 8 0). Held. | verified |
| 41 | Menu | row gap | 2 | 2 | +0 (0%) | **CONFLICT** | Held from default | VS Code context menu 0 (rows abut: 5,29,53…), Figma 0 (135,159,183…). | verified |
| 42 | Menu | separator spacing | 4/1/4 | 4/1/4 | — | **CONFLICT** | Held | VS Code 5/1/5 (li 11 tall, rule at +5); Figma 7/1/7 (ul pad-bottom 7 + border + margin 7). Both dense products are larger. | verified |
| 43 | Menu | row corner | 8 (12−4) | 4 (8−4) | — | **RULE** | Concentric: container − inset | Figma is concentric (13 − 8 = 5, rows 5). VS Code is not (6 in 8 with 4 inset). | verified |
| 44 | Menu/Nav/Tree | label column | 36 | 30 | -6 (-17%) | **RULE** | row-inset + icon 16 + gap-row | See gap-row: Figma 36, VS Code 26. | verified |
| 45 | Nav / Tree view | row action end inset | (32−28)/2 = 2 | (24−24)/2 = 0 | — | **RULE** | Equal inset: plate ends as far from end as from top (round 4); owner cited Figma flush | Figma layer row action capture not in tree-view/ (only row text). | unverified |
| 46 | Nav | count plate size in row | 20 | 16 | -4 (-20%) | **RULE** | mark-label-md | Nav counts 16 in 24 rows. | n/a |
| 47 | Command palette | search row height | 48 | 40 | -8 (-17%) | **RULE** | default − 8 × ui-dense (one rung) | Notion 48 is default evidence. VS Code quick input header 35 (input 25 + 6/4 padding, vscode--quick-pick header h 35). | verified |
| 48 | Command palette | row corner | 8 (12−4) | 4 (8−4) | — | **RULE** | Concentric (container − 4) | VS Code quick pick rows 4 in an 8 shell: matches. | verified |
| 49 | Command palette | footer hint spacing | 16 | 12 | -4 (-25%) | **RULE** | default − 4 × ui-dense | No capture. | n/a |
| 50 | Command palette | hint key-to-label gap | 6 | 4 | -2 (-33%) | **RULE** | gap-md |  | n/a |
| 51 | Combobox / Select options | row height, padding | 32, (32−cap)/2 | 24, (24−cap)/2 | — | **MEASURED-DENSE** | ui-row (VS Code menu 24, Figma 24) | Inherits ui-row. | verified |

## Floating surfaces

| # | Role / component | Property | Default | Compact | Step | Class | Evidence | Notes | Check |
|---|---|---|---|---|---|---|---|---|---|
| 52 | Popover | inset | 12 | 8 | -4 (-33%) | **CONFLICT** | inset-surface-sm | Figma color picker popover 16 (figma--color-picker spectrum/controls pad 16); VS Code '9' is a tooltip-style hover. | mismatch |
| 53 | Popover | section gap | 16 | 12 | -4 (-25%) | **RULE** | inset-surface-md, one rung | Figma color picker: controls row gap 12 (column/row gap 12) is within a section, not between. | n/a |
| 54 | Popover | header/body/footer gap | 8 | 6 | -2 (-25%) | **RULE** | ui-cluster |  | n/a |
| 55 | Tooltip | height | 28 | 24 | -4 (-14%) | **MEASURED-DENSE** | tooltip/figma--tooltip 24; docs/research/captures/compact/vscode--hover 25 |  | verified |
| 56 | Tooltip | type | 14/20 | 12/16 | — | **MEASURED-DENSE** | docs/research/captures/compact/vscode--hover 12/19; figma tooltip 11/16 |  | verified |
| 57 | Tooltip | sides | 10 | 10 | +0 (0%) | **CONFLICT** | Owner pick 2026-09-25 (held) | VS Code 9 (pad 8 + 1 border), Figma 8 (pad 4 8). Owner decision stands; captures disagree. | verified |
| 58 | Tooltip | block inset | 4 | 4 | +0 (0%) | **MEASURED-DENSE** | figma tooltip pad 4; VS Code 2 + 1 border |  | verified |
| 59 | Tooltip | corner | 10 | 8 | -2 (-20%) | **CONFLICT** | radius-control-lg dense ladder | VS Code hover radius 3, Figma tooltip radius 5. | verified |
| 60 | Tooltip | internal gap (Kbd) | 8 | 6 | -2 (-25%) | **RULE** | ui-cluster |  | n/a |
| 61 | Hover card | identity / column gap | 12 | 8 | -4 (-33%) | **RULE** | default − 4 × ui-dense | Notion page preview (default-density) only. | n/a |
| 62 | Toast | side inset | 12 | 8 | -4 (-33%) | **RULE** | inset-surface-sm | Inherits the sm surface conflict. Notion toast 16 sides (toast/notion--toast-link-copied pad 11 16) at default density. | verified |
| 63 | Toast | block inset (height) | 10 (40 tall) | 8 (32 tall) | — | **RULE** | Equal inset: icon as far from top as side, inset-sm + (icon − leading)/2 − border | Note's top table still says '6 × 8 (28 tall)': stale, superseded by round 3. | mismatch (note stale) |
| 64 | Toast | gap | 8 | 6 | -2 (-25%) | **RULE** | ui-cluster |  | n/a |
| 65 | Dialog | inset | 16 | 16 | +0 (0%) | **PICK** | Owner 2026-10-02: 'Notion and Figma dialogs 16' | No Figma dialog capture exists; dialog/notion--settings-dialog records no inner padding (7 nodes). The cited 'VS Code settings dialog 24' is not in vscode--settings-dialog (header pad 0 8 0 10; body not captured). | unverified |
| 66 | Dialog | corner | 16 | 16 | +0 (0%) | **CONFLICT** | Concentric with the close (6 + 16 − 6) | Dense dialogs are 8 (vscode--settings-dialog radius 8); Notion settings dialog 12. | verified |
| 67 | Dialog | section gap | 16 | 12 | -4 (-25%) | **RULE** | inset-surface-md |  | n/a |
| 68 | Dialog | footer gap | 8 | 6 | -2 (-25%) | **RULE** | ui-cluster |  | n/a |
| 69 | Calendar | surface sides / top | 12 / 8 | 8 / 6 | — | **CONFLICT** | inset-surface-sm; 'compact is Notion's date picker' | Notion's picker (calendar/notion--search-date-filter-popover) puts the grid 12 from the edge (pad 4 + 8): equals Area default, not compact 8. | verified |

## Marks

| # | Role / component | Property | Default | Compact | Step | Class | Evidence | Notes | Check |
|---|---|---|---|---|---|---|---|---|---|
| 70 | Badge | md height | 20 | 16 | -4 (-20%) | **MEASURED-DENSE** | badge/figma--plan-badge 16 | Inner values are functions of height (RULE). | verified |
| 71 | Badge | inner values (gutter, icon, gaps) | per size | f(height) | — | **RULE** | Restate 16/20/24 rows; compact md drawn as default sm |  | n/a |
| 72 | Count | gutter | 6 | 4 | -2 (-33%) | **RULE** | (height − 8)/2 | VS Code count badge 19 tall with 6 sides at 10px (compact/vscode--count-badge pad 4 6). | verified |
| 73 | Kbd | height / padding / corner | 20 / 4 / 6 | 16 / 2 / 4 | — | **RULE** | mark-label-md; padding (h − 10)/2 − border | VS Code keycap 18, pad 3 5, radius 3 at 11px (compact/vscode--keybinding). | verified |
| 74 | Code (inline) | size | 0.875em | max(12, 0.875em) | — | **RULE** | Ramp floor 12 |  | n/a |

## Controls

| # | Role / component | Property | Default | Compact | Step | Class | Evidence | Notes | Check |
|---|---|---|---|---|---|---|---|---|---|
| 75 | Field | label-to-control gap | 6 | 4 | -2 (-33%) | **MEASURED-DENSE** | ui-stack (Figma dimensions row ~3-5) | Weak. | verified |
| 76 | Field (horizontal) | gap | 8 | 6 | -2 (-25%) | **RULE** | ui-cluster | Figma dimension row column-gap 8. | verified |
| 77 | Toolbar | inset and group gap | 8 | 6 | -2 (-25%) | **RULE** | ui-cluster | Figma toolbelt gap 8, button pad 4 (toolbar/figma--toolbelt-row). | verified |
| 78 | Toolbar | corner | 16 | 12 | -4 (-25%) | **RULE** | Concentric (control radius + inset) |  | n/a |
| 79 | Checkbox / Radio / Switch | activation lane | 24 | 24 | +0 (0%) | **RULE** | WCAG 2.5.8 target minimum |  | n/a |
| 80 | Checkbox / Radio | glyph | 16 | 16 | +0 (0%) | **RULE** | Native glyph size | VS Code settings checkbox 18 (checkbox/vscode--settings-checkbox); compact/vscode--checkbox is a 22.6 toggle, not a checkbox. | verified |
| 81 | Input | inline action | min(icon+8, h−4) | min(icon+8, h−4) | — | **RULE** | 2 clear on every side |  | n/a |
| 82 | Choice card | inset | 12 | 8 | -4 (-33%) | **RULE** | default − 4 × ui-dense |  | n/a |
| 83 | Choice tile | icon gap | 16 | 12 | -4 (-25%) | **RULE** | default − 4 × ui-dense |  | n/a |
| 84 | Choice groups (horizontal) | column gap | 16 | 12 | -4 (-25%) | **RULE** | default − 4 × ui-dense |  | n/a |
| 85 | Choice groups | option gap / margin | 8 / 6 | 6 / 4 | — | **RULE** | ui-cluster / ui-stack |  | n/a |

## Containers

| # | Role / component | Property | Default | Compact | Step | Class | Evidence | Notes | Check |
|---|---|---|---|---|---|---|---|---|---|
| 86 | Card | inset sm / md / lg | 6 / 8 / 12 | 4 / 6 / 8 | — | **RULE** | default − diff × ui-dense (one rung) | No dense card capture. | n/a |
| 87 | Card | step | 8 | 6 | -2 (-25%) | **RULE** | default − 2 × ui-dense |  | n/a |
| 88 | Card | text column · corner | 16 · 24 | 12 · 18 | — | **RULE** | Concentric (button 6 + 12) |  | n/a |
| 89 | Card | block gap | 12 | 8 | -4 (-33%) | **RULE** | default − 4 × ui-dense |  | n/a |
| 90 | Card | header/list/footer gap | 8 | 6 | -2 (-25%) | **RULE** | ui-cluster |  | n/a |
| 91 | Panel | md sides | 16 | 12 | -4 (-25%) | **CONFLICT** | inset-surface-md | Figma's inspector (dense) keeps 16: panel/figma--section-auto-layout pad 0 8 0 16, section title text at 16. | verified |
| 92 | Panel | sm sides | 12 | 8 | -4 (-33%) | **RULE** | inset-surface-sm | Figma inspector trailing side 8 (pad-right 8). | verified |
| 93 | Panel | gaps md / sm | 12 / 8 | 8 / 6 | — | **RULE** | default − diff × ui-dense | Figma property-row column gap 8. | verified |
| 94 | Panel | md label gap | 6 | 4 | -2 (-33%) | **RULE** | ui-stack |  | n/a |
| 95 | Property list | gap (standalone) | 8 | 6 | -2 (-25%) | **RULE** | default − 2 × ui-dense |  | n/a |
| 96 | Table | cell block padding sm / md / lg | 4 / 8 / 12 | 2 / 6 / 8 | — | **RULE** | default − diff × ui-dense | Notion table (default density) only. | n/a |
| 97 | Table | cell side padding | 12 | 8 | -4 (-33%) | **MEASURED-DENSE** | gutter-md |  | verified |
| 98 | Calendar | cell / day | 36 / 32 | 32 / 28 | — | **MEASURED-OTHER** | calendar/notion--day 28 (radius 6) | Notion is the default-density product; cell 32 not in the capture. | partially verified |
| 99 | Calendar | months gap | 16 | 12 | -4 (-25%) | **RULE** | inset-surface-md |  | n/a |

## Conversation and tools

| # | Role / component | Property | Default | Compact | Step | Class | Evidence | Notes | Check |
|---|---|---|---|---|---|---|---|---|---|
| 100 | Message | gap | 12 | 8 | -4 (-33%) | **RULE** | default − 4 × ui-dense |  | n/a |
| 101 | Message | bubble padding | 10 × 16 | 6 × 12 | — | **RULE** | default − 4 × ui-dense | ChatGPT (default) only. | n/a |
| 102 | Message | bubble corner | 16 | 12 | -4 (-25%) | **RULE** | Concentric: control radius + ui-cluster |  | n/a |
| 103 | Composer | inset / gap | 8 | 6 | -2 (-25%) | **RULE** | ui-cluster |  | n/a |
| 104 | Composer | corner | 16 | 12 | -4 (-25%) | **RULE** | Concentric |  | n/a |
| 105 | Code block | block / header inset | 12 | 8 | -4 (-33%) | **RULE** | default − 4 × ui-dense |  | n/a |
| 106 | Code block | inline end | 16 | 12 | -4 (-25%) | **RULE** | default − 4 × ui-dense |  | n/a |
| 107 | Code block | header action end | 4 | 4 | +0 (0%) | **RULE** | Equal inset (ChatGPT 7/7) |  | n/a |
| 108 | Code block | corner | 12 | 8 | -4 (-33%) | **RULE** | radius-container | Default 12 owner pick (2026-10-02). | n/a |
| 109 | Prompt suggestions | gap | 16 | 12 | -4 (-25%) | **RULE** | Stay under placeholder (6+28+6+8 = 48) |  | n/a |

## Round 8/9 sweep

| # | Role / component | Property | Default | Compact | Step | Class | Evidence | Notes | Check |
|---|---|---|---|---|---|---|---|---|---|
| 110 | Breadcrumb, Alert, Separator, Slider range, Color picker rows, Panel bar/toggle/summary, stacked Composer | cluster gap | 8 | 6 | -2 (-25%) | **RULE** | ui-cluster |  | n/a |
| 111 | CheckboxGroup, ChipGroup, BadgeGroup columns, Box field | cluster gap | 8 | 6 | -2 (-25%) | **RULE** | ui-cluster |  | n/a |
| 112 | BadgeGroup | row gap | 6 | 4 | -2 (-33%) | **RULE** | default − 2 × ui-dense |  | n/a |
| 113 | Box field, Panel md, CheckboxGroup | label gap | 6 | 4 | -2 (-33%) | **RULE** | ui-stack |  | n/a |
| 114 | Tabs | gap md / sm | 20 / 16 | 16 / 12 | — | **RULE** | default − 4 × ui-dense | Figma tabs are pill tabs with 4 gaps: not comparable. | n/a |
| 115 | Tabs | panel top / vertical gap | 16 | 12 | -4 (-25%) | **RULE** | inset-surface-md |  | n/a |
| 116 | Color picker | body inset | 16 | 12 | -4 (-25%) | **CONFLICT** | inset-surface-md | Figma color picker (dense) insets 16 (figma--color-picker spectrum pad 16, controls pad 0 16). | verified |
| 117 | Color picker | rhythm | 12 | 8 | -4 (-33%) | **RULE** | default − 4 × ui-dense | Figma color picker: controls gap 12, format row gap 8 — mixed. | verified |
| 118 | Code block title, expand toggle | icon gap | 6 | 4 | -2 (-33%) | **RULE** | gap-md |  | n/a |
| 119 | Alert | insets | 12 (sm) / 16 (md) | 8 / 12 | — | **RULE** | Toast derivation on inset-surface-sm/md |  | n/a |

## (a) PICK and CONFLICT values

**PICK**

- #13 control-xl · height: 48 → 36. Inconsistent with the one-rung rule used by every other tier.
- #14 gutter-xl · padding-inline: 16 → 14. None stated; 14 is off the 4px grid
- #30 title-* · titles: 16/24… → held. Titles hold at compact.
- #65 Dialog · inset: 16 → 16. No Figma dialog capture exists; dialog/notion--settings-dialog records no inner padding (7 nodes). The cited 'VS Code settings dialog 24' is not in vscode--settings-dialog (header pad 0 8 0 10; body not captured).

**CONFLICT**

- #18 ui-row-inset · row glyph edge: 8 → 6. Dense captures keep 8-9: Figma menu icon box 8 in from row (menu/figma--account-menu span pad-left 8), Figma page row text 8 (docs/research/captures/compact/figma--page-row), Figma layer row text 8; VS Code quick pick text 9 in row (vscode--quick-pick-row: label rows at x 9). No dense capture shows 6. (VS Code quick pick 6 is the list's inset from the shell, a different quantity.)
- #20 inset-surface-sm · floating-surface inset (Popover, Toast sides, Panel sm, Calendar): 12 → 8. vscode--hover is the compact workbench hover (25 tall, 12/19, radius 3, pad 2 8 +1 border): the same element used as the Tooltip reference, not a popover. Figma's popover (figma--color-picker--open) insets 16 (spectrum pad 16, controls pad 0 16); Figma account menu header pad 16. VS Code quick pick 7 is a list inset.
- #41 Menu · row gap: 2 → 2. VS Code context menu 0 (rows abut: 5,29,53…), Figma 0 (135,159,183…).
- #42 Menu · separator spacing: 4/1/4 → 4/1/4. VS Code 5/1/5 (li 11 tall, rule at +5); Figma 7/1/7 (ul pad-bottom 7 + border + margin 7). Both dense products are larger.
- #52 Popover · inset: 12 → 8. Figma color picker popover 16 (figma--color-picker spectrum/controls pad 16); VS Code '9' is a tooltip-style hover.
- #57 Tooltip · sides: 10 → 10. VS Code 9 (pad 8 + 1 border), Figma 8 (pad 4 8). Owner decision stands; captures disagree.
- #59 Tooltip · corner: 10 → 8. VS Code hover radius 3, Figma tooltip radius 5.
- #66 Dialog · corner: 16 → 16. Dense dialogs are 8 (vscode--settings-dialog radius 8); Notion settings dialog 12.
- #69 Calendar · surface sides / top: 12 / 8 → 8 / 6. Notion's picker (calendar/notion--search-date-filter-popover) puts the grid 12 from the edge (pad 4 + 8): equals Area default, not compact 8.
- #91 Panel · md sides: 16 → 12. Figma's inspector (dense) keeps 16: panel/figma--section-auto-layout pad 0 8 0 16, section title text at 16.
- #116 Color picker · body inset: 16 → 12. Figma color picker (dense) insets 16 (figma--color-picker spectrum pad 16, controls pad 0 16).
## (b) RULE values whose rule has no data behind it

| Rule | Values (#) | What grounds it today | What is missing |
|---|---|---|---|
| Proportional step-down of spacing: "one rung down" / `default − diff × ui-dense` (incl. every `ui-cluster` 8→6, `ui-stack` 6→4, `inset-surface-md` 16→12 and `inset-surface-sm` 12→8 consumer) | 2, 7, 21, 23, 26, 47, 49, 53, 54, 60, 61, 62, 64, 67, 68, 76, 77, 82–87, 89, 90, 92–96, 99–101, 103, 105, 106, 110–115, 117, 119 (≈47) | Owner direction (2026-10-01). VS Code agrees on rows, type and control gutters, not on container padding or gaps. No capture shows a 6 cluster gap; dense captures bracket it (VS Code 4, Figma 8). | A dense product's padding/gap for each container type (card, panel, table, popover, toast, chat). |
| One rung down on control heights | 1 (xs 20), 9 (md 28), 12 (lg 32), 26 (mark-label-lg 20) | Primer's 24/28/32/40/48 ladder (default-density data). | No dense product shows 28 (VS Code 26, Figma 24/32) or 20 (VS Code 18). xl 36 / gutter 14 break the rule outright (PICK). |
| Radius follows painted height (dense radius ladder) | 31, 33 (verified by VS Code 4), 34, 35, 39 | Area's own default curve (Primer/OpenAI/Linear survey at default). | Dense controls are flat 4–5 (VS Code 4, Figma 5); compact md 6 and lg 8 have no dense capture. Non-standard presets have no data at all. |
| UI text ramp one step down for reading text | 16, 29 (body 16/24 → 14/20) | Owner rule (4px ramp). | No dense body-text capture. |
| Label column = row inset + 16 + gap-row | 19, 44 | Arithmetic. | Inputs (row inset 6, gap 8) are themselves unmeasured; Figma shows 36, VS Code 26. |
| Equal inset (plate ends as far from end as top) | 45, 63, 107, 119 | Owner rule; ChatGPT code block 7/7. | Figma layer-row toggle "flush" is cited but not captured. |

Rules with data behind them (not listed above): concentric corners (Notion 10−4, Figma 13−8, OpenAI 12−6; VS Code is the exception), static marks hold (VS Code badge 17, keycap 18), WCAG 2.5.8 lane, icon ramp 12/16/24 (VS Code linter), 12px ramp floor.

## (c) Captures to close the gaps (prioritized by values settled)

1. **Cursor app, chat panel** (message gap, bubble padding and corner, composer inset/gap/corner, code block insets, inline end, corner, prompt suggestions gap) — 10 values (#100–109). Desktop app: needs Electron devtools or the area-capture script injected; vscode.dev has no chat surface.
2. **Figma popover with sections** (comment thread popover, variable/prototype popover, plus the existing color picker) and **Cursor/VS Code rich editor hover** — settles `inset-surface-sm` and its consumers: Popover inset, Toast sides, Panel sm, Calendar sides, Alert sm; plus popover section gap and header/body/footer gap — ~8 values (#20, 52–54, 62, 69, 92, 119).
3. **Cursor menu / command palette row with leading icon and shortcut** (and Figma left-panel layer row with icon, hover state with visibility toggle) — `ui-row-inset`, `gap-row`, label column, menu row gap, separator spacing, palette search row and footer hints, row-action end inset — 8 values (#18, 19, 41, 42, 44, 45, 47, 49).
4. **Figma dialog/modal** (share modal, export or plugin dialog) and **Notion dialog inner padding** and **VS Code/Cursor modal body** — Dialog inset (PICK; the cited "VS Code settings dialog 24" is not in the capture), corner (CONFLICT), section gap, footer gap — 4 values (#65–68).
5. **Cursor buttons and inputs** (md button with icon + label, small icon action, field) — control-md 28, gap-md 4, radius-control-md 6, control-xs 20/gutter 6 — 5 values (#1, 2, 7, 9, 33).
6. **Dense table**: VS Code/Cursor keybindings editor or Figma variables table — table cell padding sm/md/lg — 3 values (#96).
7. **Cursor/VS Code notification toast and inline notice** — toast block inset/height, gap, Alert insets — 4 values (#62–64, 119).
8. **Dense card**: Cursor settings card or Figma file browser card (existing `card/figma--file-card` captures can be re-read for inset/step/corner first) — Card inset sm/md/lg, step, text column, corner, block gap — 5 values (#86–90).
9. **Underline tabs in a dense product** (VS Code/Cursor panel tabs: Problems/Output/Terminal) — Tabs gap md/sm and panel top — 2 values (#114, 115).
10. **Dense body text** (VS Code settings descriptions, Cursor chat prose) — text-md 14/20 — 1–2 values (#29, 16).
11. **Toolbar / cluster gap in Cursor** (title bar actions, panel header actions) — `ui-cluster` 6 — settles the role behind ~15 consumer values.

Decisions that need no new capture (already contradicted by captures in hand): Tooltip corner 8 (VS Code 3, Figma 5), Tooltip sides 10 (VS Code 9, Figma 8), Menu row gap 2 (both 0), Separator 4/1/4 (5/1/5, 7/1/7), Panel md 12 and Color picker body 12 (Figma 16), Calendar sides 8 (Notion 12), Dialog corner 16 (VS Code 8), control-xl 36 / gutter-xl 14 (off ladder).

## Note claims checked against captures

| Claim in compact-pass note / density.ts | Capture | Result |
|---|---|---|
| VS Code lists 22, menus 24 | vscode--quick-pick (rows 22), vscode--context-menu (rows 24) | verified |
| Button 26 (4/8), input 26 (2/6), 12/16 | vscode--button-sidebar, vscode--search-input | verified |
| Icon-only 22, icon 16 | vscode--icon-button (22, pad 3, radius 4) | verified |
| Menu inset 4 (+1) · row gap 0; separator 5/1/5 | vscode--context-menu | verified |
| Quick pick text 6 + 1 + 9 | vscode--quick-pick-row (label rows at x 9) | verified |
| Tooltip 25, 12/19, sides 9 | vscode--hover (pad 2 8, border 1, radius 3) | verified (radius 3 not recorded in the note) |
| Popover inset: "hover 9" | vscode--hover is the compact workbench hover/tooltip | **mismatch**: not a popover; Figma's popover is 16 |
| Surface corner 8, row corner 4–6 | quick pick 8/4, context menu 8/6, settings dialog 8 | verified |
| Dialog: "VS Code settings dialog 24" | vscode--settings-dialog: header pad 0 8 0 10, body not captured | **unverified** (no 24 anywhere in the file) |
| Dialog: "Notion and Figma dialogs 16" (dialog.md) | no Figma dialog capture; notion--settings-dialog has no inner padding | **unverified** |
| Toast "6 × 8 (28 tall)" (first table) | current CSS: 8 × 8, 32 tall (round 3) | **stale in the note** |
| Key labels 18 at 11px, count 19 at 10px, inline actions 18 at 11px | vscode--keybinding, vscode--count-badge, vscode--extension-action | verified |
| VS Code checkbox 18 | checkbox/vscode--settings-checkbox 18; compact/vscode--checkbox is a 22.6 toggle | verified (compact/ file is a different control) |
| VS Code badge 17 (main S21a C) | badge/vscode--badge-new 17 | verified |
| Figma rows 24, tooltip sides 8 | figma--page-row 24; tooltip/figma--tooltip pad 4 8, 24 tall | verified |
| Notion date picker 32 / 28 | calendar/notion--day 28, radius 6; cell 32 not in file | day verified, cell unverified |
