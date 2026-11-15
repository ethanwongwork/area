# Type and foreground ink, every family (system evaluation 2026-11-11, prefix T)

## 1. Scope and method

Read: `.claude/skills/area-type-usage/SKILL.md`; `docs/DESIGN_SYSTEM.md` Colour (50–201), Size and shape (487–704),
Optical insets, Icons and technical labels; `docs/CONTRAST.md`; `docs/research/title-balance-2026-11-06/README.md`,
`type-pass-2026-10-31/README.md`; the product recreations README (another worktree, read only);
`packages/tokens/src/axes/typography.ts`, `type-size.ts`, `density.ts`; `semantic/aliases.ts` (fg roles),
`color/curves.ts` (ink rungs), `emit/base.ts` (size derivations); every file in `packages/styles/src/components/`
(108 files), plus the type rules in `inset.css`, `base.css`, `fonts.css`.

How: a parser (scratchpad `type-census.mjs`) dumped every `font-size`, `line-height`, `font-weight`, `color`,
`letter-spacing`, `font-variant-numeric`, `font-family`, `text-overflow`/`white-space`/clamp, `text-box` and every private
`--_*text|size|leading|weight|ink|fg` property, with selector and line: 1,972 declarations. Each was resolved by hand
through its private property and the token to px at the shipped defaults, verified in source: Type `13`
(`type-size.ts:127`), Density `32` = level 0 (`density.ts:29,36`), so `ui-dense` = 0.5 and `ui-gap-step` = 0
(`base.ts:464-473`). At those defaults:

| Token | px | Token | px |
|---|---|---|---|
| `text-xs` = `control-xs-text` | 11/14, +0.0075em | `title-xs` | 16/22, 0 |
| `text-sm` | 12/16 (prose 12/18), +0.005em | `title-sm` | 18/24, −0.01em |
| `text-base` = `ui-size` = `control-sm/md/lg-text` | 13/18 (prose 13/20), +0.0025em | `title-md` | 20/28, −0.015em |
| `text-lg` = `control-xl-text` | 15/22, 0 | `title-lg` | 26/30, −0.02em |
| controls xs/sm/md/lg/xl | 22 / 26 / 30 / 38 / 46 | display sm/lg | 52/52, 67/68 (no component uses them) |
| `ui-row` | 30 | `mark-label-sm/md/lg` | 14 / 18 / 22 |
| `ui-stack` / `ui-cluster` / `gap-row` | 6 / 8 / 10 | inks (light/dark rungs, `curves.ts:134-140`) | default 800/100, muted 550/250, placeholder 550/250, disabled 350/550; `fg-quiet` = default mixed 75% to muted (`base.ts:229`) |

Geist metrics, read from `node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf` (and Mono): unitsPerEm 1000, hhea
ascent 1005, descent −295, line gap 0, cap 710, x 530. Hence the cap's centre sits exactly at the line box's centre at
any line-height ((1005 − 295)/2 = 355 = 710/2).

Not verified: rendered pixels (no app or browser was run, per the brief); Chromium's baseline snapping of fractional
baselines; the React markup of every part (only where named); the desktop app's own type (out of scope: components only).

## 2. Census

Legend: sizes px at type 13, `s/l` = size/line; `4`/`5` = weight 400/500; inks D default, M muted, Q quiet, P
placeholder, X disabled, T tone ink (`fg-<tone>`), V vivid tone ink, K tone mark (`fg-<tone>-mark`), I inherit; `tab` =
tabular-nums; `…` = ellipsis, `wrap`, `clamp n`; `mono` = Geist Mono. "Row 18" = a smaller size that keeps the row's 18
line (skill rule 5). Gaps are between line boxes unless stated.

| Family (file) | Text parts |
|---|---|
| Accordion | trigger md **15/22** (text-lg) 4 D (divided 5), sm 13/18; chevron M (`accordion.css:29-30`, comment says 16/24 · 14/20) |
| Alert (surface.css) | root 13/18 in T (tone) or D; title 5 T; description 4 M; link 4 T underline; icon K (neutral M); title–copy 4 (`:820`) |
| Approval | root 13/18 D; title 5; description, hint, option description 13 M; key 13 M tab; placeholder **M** (`:153`) |
| Asset card | name 13/18 4 D …; badge 13 |
| Asset row | **whole row 11/14** (`asset-row.css:21`): name 11 5 D …, meta 11 M tab … |
| Attachment | body 12/16: name 12 D clamp 3, text 12 M; video badge 12/16 tab; icon M; mark **T** danger |
| Avatar (display.css) | initials 5, xs/sm 11, md 13, lg 15, line 1, ink M |
| Badge | 11/14 5 (plain 4), T/M/V; lg 13/18; `letter-spacing: normal` (`:38`) |
| Board | column 13/18; title 5 …; count via Count in hue; card title 5 wrap; properties 13 M; icon M |
| Box field | label 13 D … (in Panel M; sm 11) |
| Box model | root 11/14 tab; labels/values M/T darkened …; content 5; caption M |
| Breadcrumb | 13/18 M; page D 4; separator `stroke-control` |
| Button (+ group, split, toggle group) | 13/18 5 at sm/md/lg; neutral ghost/outline **Q**; solid on-solid; row actions M→D |
| Calendar | root 13/18; title 13 5; weekday **11/14** M; day **11/14** D tab (`:105`, comment "12/16"); week day number 15/22 |
| Card (surface.css) | title 13/18 5 D wrap; description 13 M; value 26/30 4 tab; list/footer 13; action 13 underline; title–copy 4 |
| Chart | root 13/18; plot mono 11/14 tab; legend 11 M; label/empty M; figure 26/30 4 tab; **centre 18 5 mono** (`:88`); note mono 11 M tab |
| Chip | 13/18 4 D …(inset.css:274); icon M; selected `fg-selection`; invalid T |
| Choice (Checkbox, Radio, groups) | label 13/18 4 D; description **12/16** M joined; meta 13 M tab; legend 13 4 D; group description 12/16 M; validation 12/16 V |
| Citation | 11/14 5 M …; footnote **0.704em/1** |
| Code | inline mono `max(11, 0.875em)` / **1.35** (`code.css:154-155`); block md mono 13/18, sm mono 11/**17**; header 13 (sm 11); language M; gutter M tab; title mono 4 D |
| Color | picker 13/18; channel labels M tab; heading **11/14 4 M**; note M; field input tab |
| Combobox | description 13 M nowrap (beside); empty 13 M |
| Command palette | root 13/18; input **15/22**; step **15/22 M** …; description, path 13 M …; footer 11/14 M; group labels = Menu's |
| Composer (+ menu) | input 15/22 `input-text`; placeholder P; disabled X; group note 12/16 M …; menu path **11/14 M** …; menu empty 13 M |
| Confirm dialog | description **D** (Dialog's is M) |
| Count | 11/14 4 M tab |
| Custom select, Date picker, Select, Input, Number field, OTP, Textarea, Tag picker, Time field | value 13/18 `input-text`/`select-text`; placeholder P; disabled X; icons `input-icon` (M); affix/unit M; OTP, Time field, Color field tab; **Number field, Date picker value: no tab** |
| Custom select | caption 12/16 M … (selected D) |
| Description list | 13/18; term M (justified **D 5**); value D wrap; more 13 M |
| Design card | 13/18; name 4 …; detail 13 M tab |
| Dialog, Drawer (surface.css) | title 13/18 5 D; description 13 M; title–copy 4 (`:1016`) |
| Edit summary | 13/18; title …; counts 12 row 18 tab, change inks; folder/status M; icon M |
| Diff | mono 11/**17**; numbers M tab; markers 5 V |
| Editable text | inherits; placeholder **M** (`:45`) |
| Empty state | md title 16/22 5, description 13/18 M; sm title 13/18 5, description 12/16 M; both title–copy 4; icon D |
| Field | label 13/18 4 D (horizontal/inline/auto **M**; disabled **M**); description 12/16 M; count **11/14** M tab; validation **11/14** V (neutral M); required V; label–control 6 |
| Figure | caption 12/16 M |
| File image / File page / Folder | label/count **`round(size × 0.13)`** = 6 / 8 / 12 px, line 1 (`file-page.css:105`, `folder.css:101`) |
| File tile | 13/18; name 5 clamp 2; meta 12/16 M tab …; figure M |
| File upload | 13/18 M; action 5; hint 12/16; item name 13 5 D …; meta 13 M tab; percent 5 D tab; status T |
| Hatnote | M |
| Hover card | meta 12/16 M |
| Indicator | 11/14 5 on-tone tab |
| Inline list | separator M 4 |
| Kbd | **size-11 / line size-10** fixed in sm and in menus (`kbd.css:80,107`); md text-xs; 5 M |
| Link | inherits; D or M or hue; underline 1 stroke at 0.08em |
| Link groups | 13/18; title 16/22 5; label 13 5 D; list M |
| Mention | inherits; due T |
| Menu (surface.css) | item 13/18 I; label 13/18 **5 M**; description 12/16 M; trailing M tab; shortcut 11/14 M; match 5; danger V; empty 13 M; icon I (D) |
| Message | 15/22 (prose line 22); status 13/18 M; status icon **T** danger; no heading styles |
| Meter | 13/18; label **5** D; value 13 M tab; description 12/16 M; gaps 6 |
| Model picker | name D; effort M |
| Nav | item 13/18 D (horizontal M); label 13/18 **5 M**; trailing 4 M **no tab**; icon I (D); actions M→D |
| Page header | title 18/24 5 (sm 16/22, lg 20/28), tracking token; parent 13; description 13 M |
| Pagination | page 13/18 **5 M** tab; current D; status M tab; value 5 D |
| Panel | md: title 13/18 5, heading 13/18 5 D, row label 13 M …, count M tab, summary M; **sm: labels 11/14**; label gap 4 (sm 4) |
| Plan | 13/18; title …; count, meta 12 row 18 M tab; text M (current D) |
| Popover | title 13/18 5; description 13 M; step M tab; title–copy 4 |
| Prompt suggestions | items **15/22 M** … (chips D) |
| Queue | 13/18; title **M 4** tab …; status M (error T) |
| Reference list | 13/18; title 13 5; numbers M tab; count 11/1 tab |
| Section heading (app-shell.css) | title 16/22 5 trimmed; lede 12/18 M trimmed |
| Segmented | 13/18 **5 M** at rest, D selected …(inset.css) |
| Selection bar | 13/18; count 5 tab |
| Setting row | label 13/18 4 D; description **13/18 M**; disabled **X both** (`:110`) |
| Shortcut list | 13/18; title 13 **5 M**; keys M |
| Slider | label 13 4 D; value 13 M tab; ends **11/14 M** (`:309`, comment "the description's text"), no tab; label–track **2** (`:235`) |
| Step | 13/18; verb M (open D); detail D tab …; meta 12 row 18 M tab; icon M; reasoning body M |
| Stepper | 13/18; title 4 M (current D); description 13 M; marker 11/1 5 tab |
| Surface | 13/18 + tracking |
| Switch | label 13/18 D wrap; description **12/16** M |
| Table (navigation.css) | sm cells 13/18, md/lg 13/20; th M 4 nowrap; numeric cells tab; caption M; group heading 13 4 D, toggle 5; group count M tab |
| Tabs | 13/18 4 M, selected 5 D (reserved width); status change inks |
| Tag | **13/18 at Default, 11 at Compact** (`tag.css:49-50`); 4; hue text; … |
| Timeline | 13/18; title 4; meta M; time 12 row 18 M tab; icon M (current selection) |
| Timestamp | **12/16 M, no tab** |
| TOC | title 13/18 5 D |
| Toast | 13/18 D; title 5 D; description M; icon K (neutral M); title–copy 4 |
| Token row | mono 11/14; value M tab … |
| Tooltip | 13/18 on-inverse |
| Tree view | 13/18 D; icon **M**; trailing M tab; status 11/14 5 change inks; label clip + fade |
| Turn notice | 13/18 M; icon M (error **T** danger); error text D |
| Video player | 13/18; clock 13 4 M tab |

### Distinct styles actually in use (size/line, weight, ink, at defaults)

38 combinations of size/line × weight × ink class (tone inks counted once per role):

| # | Style | Where (examples) |
|---|---|---|
| 1 | 13/18 4 D | every row, control, label, value, cell |
| 2 | 13/18 4 M | surface descriptions, th, terms, row labels, tabs at rest, paths, empties, setting descriptions |
| 3 | 13/18 5 D | surface titles, Panel heading, TOC/Reference/Link-groups labels, buttons, selected tab, Meter label, item names (File tile, File upload) |
| 4 | 13/18 5 M | Menu/Nav/List box/Palette/Shortcut-list group labels, Pagination pages, Segmented at rest |
| 5 | 13/18 4 X · 6 13/18 4 P | disabled, placeholders |
| 7 | 13/18 T / V / K | Alert text, Chip invalid, menu danger, Tabs status |
| 8 | 13/20 4 D · 9 13/20 4 M | Table md/lg cells and headers |
| 10 | 12/16 4 M | field/choice/switch/menu descriptions, captions, metas, Timestamp |
| 11 | 12/16 4 D | Attachment name, a chosen Custom select caption |
| 12 | 12/16 4 V | group validation |
| 13 | 12/18 4 M | Section heading lede; row-line metas (Plan, Step, Timeline time, Edit counts) |
| 14 | 12/18 change inks | Edit summary counts |
| 15 | 11/14 4 M | Field count, Slider ends, weekday, legend, Menu shortcut, Composer path, optgroup, Color heading, Palette footer, Count |
| 16 | 11/14 4 D | Calendar days, Asset row meta row, Box model values |
| 17 | 11/14 5 D | Asset row name |
| 18 | 11/14 4 V | Field validation |
| 19 | 11/14 5 M/T | Badge, Citation |
| 20 | 11/10 5 M | Kbd |
| 21 | 11/1 5 | Stepper marker, Indicator count (11/14) |
| 22 | 15/22 4 D | Message, Composer, Accordion md, Palette input |
| 23 | 15/22 4 M | Prompt suggestions, Palette step |
| 24 | 15/22 5 D | Accordion md divided |
| 25 | 16/22 5 D | Section heading, Link groups title, Empty state md, Page header sm |
| 26 | 18/24 5 D | Page header md |
| 27 | 18 5 D mono | Chart donut centre |
| 28 | 20/28 5 D | Page header lg |
| 29 | 26/30 4 D tab | Card value, Chart figure |
| 30 | mono 13/18 4 D | Code block md, title |
| 31 | mono 11/17 4 D | Code block sm, Diff |
| 32 | mono 11/14 4 D/M | Chart plot, note, Token row |
| 33 | mono 0.875em/1.35 | inline Code |
| 34 | 0.704em/1 | Citation footnote |
| 35 | 6–12 /1 4 | Folder count, File page label |
| 36 | 13/18 Q | ghost/outline neutral Buttons |
| 37 | 15/22 on-color/inherit | Command palette input |

(37 rows; no part sets 12 at 500, so the skill's "12 is never 500" holds.)

Merge candidates (each argued in a finding): 15→10 (T1: secondary words at 11 become 12); 16 and 17 (T1); 18→12 (T1);
31→a ramp line (T7); 27→29 or 26 (T18); 23→2 and 24→3 (T15); 4's Pagination and Segmented members stay (a control's
own weight) while its label members get one rule (T3); 34 and 35 get a floor (T22). After T1, T7, T15, T18 and T22 the
set falls to about 28.

## 3. Findings

### T1 · defect · Secondary words still set at `text-xs` (11) after the ramp gained `text-sm` (12)

What: on 2026-11-02 the ramp split "small" into `text-xs` 11/14 (marks only: "never a sentence, a description",
skill §1) and a new `text-sm` 12/16 (secondary). Families written when the small step was the caption (their comments
still say 12/16, or "the description's text") were never moved, so words that explain or label now sit at the mark size:

| Part | Line | Value now | Its own comment |
|---|---|---|---|
| Field validation / error | `field.css:77-79` | 11/14 V | — (Field's description beside it is 12/16, `:46-48`) |
| Field count | `field.css:60-61` | 11/14 M | "in the description's text and ink" (`:52`) |
| Slider end labels | `slider.css:309-311` | 11/14 M | "In the description's text and ink (Field)" (`:302`) |
| Calendar day numbers | `calendar.css:105` | 11/14 D | "Day numbers use the caption text (12/16)" (`:96`) |
| Asset row, whole row (name 500) | `asset-row.css:21-22` | 11/14 | "the inspector's 12/16" |
| Panel sm row labels and headings | `panel.css:486` | 11/14 | "section titles and labels 12/16" (`:482`) |
| Select optgroup label | `navigation.css:863-865` | 11/14 4 M | "A group label is Menu's: 12/16" (`:861`; Menu's is now 13/18 5, T3) |
| Color picker saved-colours heading | `color.css:487` | 11/14 M | — |
| Composer menu path | `composer-menu.css:33-34` | 11/14 M | — (Command palette's path is 13, T15) |
| Command palette footer hints | `command-palette.css:205-206` | 11/14 M | — |
| Menu shortcut wrapper | `surface.css:1574` | 11/14 | "spec: 12px" (`:1570`) |
| Choice label holding only a description | `inset.css:304` | label box 11 while its description is 12 (`choice.css:758`), so `1cap` in its top margin is 11's: 0.36 px high | — |

Field's own messages show the drift clearest: description 12/16, error 11/14, count 11/14, while Choice and Radio group
validation is 12/16 (`choice.css:621-622`). An error message is a sentence; at 11 it is the smallest words in the system.

Rule-level fix: "`text-xs` is for marks (Badge, Count, Kbd, Indicator, Citation, a data label on a chart or box model, a
status letter). Any word that labels, explains, warns or locates is `text-sm` or larger." Add it to
`cohesion.test.mjs` as a list of parts allowed `text-xs`.
Changes: every row above moves 11/14 → 12/16 (Calendar days and Asset row: see below); comments corrected.
Calendar days are operated targets inside a 13/18 control family: `text-base` (13) or `text-sm` (12) is an owner pick
(day cells are 30 at Default, so either fits). Asset row's name should take the row role (13/18 4, T4) with its meta
12/16, or the whole row 12 if the inspector density is wanted. Panel sm labels: 12/16, leaving 11 to values that are
marks. Size S–M (about 12 rules, demos to re-look); visible: 1 px larger in each; confidence high.

### T2 · inconsistency · A line that explains a name is 12 in some families and 13 in others, and the two rule texts disagree

What: the skill says a description is "the same size as what it explains, muted" and "only text that stands apart …
drops a size" (`SKILL.md:40-42`); DESIGN_SYSTEM's ramp says `text-sm` is "secondary: a description, metadata, help, a
hint" (`DESIGN_SYSTEM.md:498`). The code follows both:

- 12/16 muted under a 13/18 name (size and ink both change): Choice description (`choice.css:758`), Switch description
  (`switch.css:160`), group descriptions (`choice.css:621`), Menu description (`surface.css:1385`), Custom select caption
  (`custom-select.css:276`), Field description (`field.css:47`), Meter description (`meter.css:30`), File tile meta
  (`file-tile.css:88`), Hover card meta (`hover-card.css:28`), Empty state sm description (`empty-state.css:74`).
- 13/18 muted (ink only): Setting row description (`setting-row.css:62`, inherits 13), Approval option description
  (`approval.css:133`), Stepper description (`stepper.css:123`), File upload item meta (`file-upload.css:132`), Design
  card detail (`design-card.css:97`), Board card properties (`board.css:197`), Timeline meta (`timeline.css:106`), and
  every surface description (Card, Dialog, Popover, Toast, Alert, Page header).
- 11/14: Asset row meta (T1).

The plainest collision: a Switch with a description is 13 over 12; the same setting as a Setting row is 13 over 13. Both
are "an item's name and its line, joined" in DESIGN_SYSTEM (`:536-539`). File tile (12) and File upload row (13) show
the same file name over the same size line.

Rule-level fix (state it once, in DESIGN_SYSTEM "Text pairs" and the skill): "A line joined to a name in the same box
(a choice, a switch, a setting, a menu option, a file, a step, a card) is the name's size in the muted ink. `text-sm`
is for text set apart from what it explains: help and messages under a control (Field, Meter), a caption under a block,
a timestamp, a lede, a metadata line on its own." Evidence for ink-only joins: Cursor's settings row 13/18 over 13/18
(title-balance README table). Menu's 12 has a measured source (ChatGPT's model list 14/20 over 12/14,
`surface.css:1374`); keep it only if the owner wants dense menus to step down, and then say so as the one exception.
Changes: Choice, Switch, group descriptions, Menu description (owner pick), Custom select caption, File tile meta,
Hover card meta 12/16 → 13/18 (rows grow 2 per line). Field and Meter descriptions stay 12 (set apart, under a control).
Empty state sm stays 12 (title-balance decision). Size M; confidence high on the inconsistency, medium on which way.

### T3 · inconsistency · A heading over a run of rows has three treatments

What: the owner chose one group label (2026-10-22, `surface.css:1477-1482`): the rows' size, 500, muted, a row tall.
Menu (`surface.css:1472-1482`), Nav (`nav.css:97-100`), List box, Combobox, Command palette and Shortcut list
(`shortcut-list.css:35-37`) follow it. Others do not:

- 13/18 5 **default**: Panel heading (`panel.css:235-238`), Link groups label (`link-groups.css:40`), Reference list
  title (`reference-list.css:25`), TOC title (`table-of-contents.css:22-25`).
- 11/14 4 muted: Select optgroup (`navigation.css:863`, which claims to be Menu's), Color picker heading (`color.css:487`).
- 13/18 4 default with a 500 toggle: Table group heading (`navigation.css:556-577`).

And the written rules contradict the decision: the skill says "Never 500 + muted … a group label is muted and regular"
(`SKILL.md:62`) and lists "a day label at 500 in the muted ink → regular" as a mistake (`:148`); DESIGN_SYSTEM lists "Nav
group titles" under 500 (`:190`).

Rule-level fix: write the decided rule into both docs: "A label over a run of rows (a menu group, a nav section, a list
section, a shortcut group, an optgroup, a panel section, a table group) is the rows' size at 500 in the muted ink, a
row tall. A title that names a whole surface or region is default ink." Then decide Panel heading, Link groups label,
Reference list title, TOC title: they head runs of rows, so muted under the rule (owner pick: the Inspector's headings
are default today, Figma's 550 default). Changes: Select optgroup and Color picker heading 11/4 → 13/5 muted; the
skill's §4 and §10 lines rewritten; DESIGN_SYSTEM `:190` kept. Size S; confidence high.

### T4 · inconsistency · Weight rules contradict each other and the code

What:
- `typography.ts:2-3`: "strong only for labels on fills: buttons, segmented options, badges, counts". Count is 400
  (`count.css:32,72,80`), and every title is 500.
- `DESIGN_SYSTEM.md:186`: "Weight 400 is for … titles set larger than body". Every larger title is 500: Section heading
  (`app-shell.css:125`), Page header (`page-header.css:72`), Link groups title (`:30`), Empty state title
  (`empty-state.css:110`). Only figures are 400 (Card value, Chart figure).
- `DESIGN_SYSTEM.md:191`: "soft Count" is 500; it is 400, and "Marks on one line" (`:727`) says count 400.
- Item names: DESIGN_SYSTEM says "the name of an item or control (a choice, a step, a row, a file) is regular (400)"
  (`:556`); the skill says 500 is for "the name that starts a line" (`SKILL.md:61`). Code: 500 in File tile name
  (`file-tile.css:78`), File upload item name (`file-upload.css:119`), Asset row name (`asset-row.css:56`), Board card
  title (`board.css:188`); 400 in Asset card name (`asset-card.css:136`), Design card name, Attachment name, Edit summary
  name, Tree view, Nav, Setting row label (`setting-row.css:57`), Stepper title (`stepper.css:122`), Timeline title
  (`timeline.css:105`), Choice title.

Rule-level fix: one weight table in DESIGN_SYSTEM, quoted by the skill and the typography.ts header: 500 = titles (a
surface's or a region's), group labels (T3), labels on fills and marks (Button, Segmented, Badge, Kbd, Indicator,
Avatar), the selected Tab; 400 = everything read or operated, including an item's name and a figure. Decide the person
in an activity / Approval's question (skill's examples) as "a title of its block" if they stay 500.
Changes: File tile, File upload item, Asset row names and Board card title 500 → 400 (or, if the owner prefers names to
lead, the reverse for Asset card, Design card, Attachment: either way one weight); docs and header comment corrected.
Size S; confidence high.

### T5 · inconsistency · Weight rises with muted ink in controls, against the skill's "weight rises only with the default ink"

What: 500 in the muted ink at rest: Pagination pages (`pagination.css:75,81`), Segmented options (`segmented.css:81,87`),
Citation (`citation.css:45,50`), Kbd (`kbd.css:50,56`), neutral Badge (`badge.css:33,46`), plus the group labels (T3).
Each has a reason in its comment (one weight per control so selection never reflows; marks draw their own weight). The
skill states the rule without these exceptions (`SKILL.md:62`), so it reads as broken in seven families.

Fix: write the exception once: "A control's labels keep one weight in every state (Segmented, Pagination, Tabs' reserve);
a mark draws its own weight; group labels are 500 muted (T3). Elsewhere weight rises only with the default ink."
Changes: docs only. Size S; confidence high.

### T6 · defect · Density changes Tag's text size

What: `tag.css:49-50` sets the size by `sign(ui-leading − plate height)`: at Default the md plate is 18 = the UI line, so
Tag is 13/18; at Compact the plate is 14 (`base.ts:495`), so Tag drops to 11. At type 12 Default it is 12. Badge and
Count on the same 18 plate are 11 at every density (`badge.css:22`, `count.css:28`). Type-size.ts says density "sets only
the room around text" (`type-size.ts:5-6`), and "Marks on one line" puts Count, Badge and Tag on one baseline
(`DESIGN_SYSTEM.md:729-732`) while their sizes differ by 2 at Default.

Fix: a mark's text size follows its size prop, never density: Tag md 13/18 (if a tag is a word in a row) or 11/14 (a
mark, as Badge) at every density; owner pick, with Badge's 11 the system's reading. Changes: Tag at Compact (and type
12) stops changing size. Size S; confidence high.

### T7 · defect · Code block sm and Diff use a literal 18px line that ignores Type and lands off the ramp

What: `code.css:201` and `edit-summary.css:210`: `calc(var(--area-leading-18) − 2px × ui-dense)`. `leading-18` is the
fixed ramp step, not a role, so at the default it is 17 (odd: every other leading is on the 2px ramp,
`type-size.ts:56`), Compact 16, Comfortable 19. With Type it does not move: at type 16 the text is 14 on 17 (1.21); at
type 12 it is 10 on 17 (1.7). An odd line also puts the cap 0.5 px off whole pixels on every second line of a diff.
Inline code is `max(11, 0.875em)` on `line-height: 1.35` (`code.css:154-155`): 11.375/15.4 inside 13 text, literal.

Fix: code leading is a role on the type axis: `text-xs-code-leading` = LEADING[xs] + 2 (16 at 13, 18 at 16) or the
`text-sm-leading` of the base, emitted in `type-size.ts`; density adds no leading (it is text, not room). Inline code
takes `line-height: inherit` or 1lh of the host (it is inline). Changes: Code block sm and Diff 11/17 → 11/16 at
defaults and scale with Type; inline Code's box unchanged in practice. Size S; confidence high.

### T8 · defect · Kbd's text is a fixed 11 (and line 10) at every Type

What: `kbd.css:80-81,107`: `--_font: var(--area-size-11)`, `--_leading: var(--area-size-10)` for sm and every Kbd in a
menu row; md uses `text-xs` (`:74`). At type 16 a 16/24 menu row ends in an 11 keycap while a Badge there is 14. Menu
rows render shortcuts through Kbd (`primitives.tsx:1976-1977`), so this is every menu shortcut.

Fix: Kbd sm reads `text-xs` like md (the plate height already differs), line from the mark ladder (`mark-label-*` −
padding). Changes: none at type 13; keys grow with Type 14–16. Size S; confidence high.

### T9 · defect · Tabular numbers missing where numbers line up or change

What: present in 59 rules, missing in: Number field's control (`number-field.css`, no `font-variant-numeric` at all,
while Color field's input has it, `color.css:229`); Timestamp (`timestamp.css:13-15`; Timeline's time has it,
`timeline.css:107`); Nav trailing counts (`nav.css:365-366`; Tree view's and Menu's trailing have it,
`tree-view.css:135`, `surface.css:1566`); Date picker value (`date-picker.css:148`); Slider end labels (`slider.css:309`,
"0" … "100"); Table cells outside `--numeric` (`navigation.css:420`).

Fix: rule: "every part that shows a number which updates, counts or sits in a column sets `tabular-nums`; a field
whose value is numeric (Number field, Time field, Date picker, OTP, Color) sets it on the control". Add a cohesion test
over a list of numeric parts. Changes: Number field values stop shifting while scrubbing; Nav counts align with Tree
counts. Size S; confidence high.

### T10 · inconsistency · Status icons use the text ink in some families, the mark ink in others

What: DESIGN_SYSTEM: "A mark that stands alone takes `icon`" (`fg-<tone>-mark`, `:146,155`). Toast and Alert do
(`surface.css:873-880,1786-1792`). Text inks on icons: Turn notice error icon `fg-danger` (`turn-notice.css:25`),
Message status icon `fg-danger` (`message.css:86`), Attachment's mark `fg-danger` (`attachment.css:70`), File upload
item status `fg-success`/`fg-danger` (`file-upload.css:142-143`, when it is the icon). In light the mark is red 500 vs
the ink's deeper solved step, so the same error icon is two reds across Toast and a chat's Turn notice.

Fix: tone glyphs read `fg-<tone>-mark`; tone words read `fg-<tone>`. Changes: four icons a step brighter in light.
Size S; confidence high (rendered difference unmeasured).

### T11 · inconsistency · Row icons beside text: default ink in Menu and Nav, muted in Tree view and the rest

What: Menu (`surface.css:1428`) and Nav (`nav.css:319`) icons set no colour, so they take the row's default ink; Tree
view icons are muted (`tree-view.css:125`), as Edit summary (`:121`), Step (`:59`), Chip (`:179`), Attachment (`:99`),
Card list (`surface.css:459`), Input (`input-icon` = M). The app's sidebar shows Nav and Tree view together.

Fix: one rule: "An icon that labels a row or a value is muted; it takes the row's ink only where the row's ink is the
state (a current Nav row, a destructive Menu row)". Changes: Menu and Nav icons muted at rest (or Tree view's default,
owner pick). Size S; confidence high on the split.

### T12 · inconsistency · Alert's title is in the tone ink, Toast's in the default ink

What: Alert sets the whole text to `--_fg` = `fg-<tone>` (`surface.css:669,873-880`), so a danger Alert's title and
link are red and its description muted; Toast keeps the title default (`surface.css:1746,1767`) and colours only the
icon. Same title + description + status icon pair, in sibling surfaces.

Fix: rule: "tone colours the status mark and the surface, never the title" (Toast's), or the reverse for both. Toast's
matches DESIGN_SYSTEM's "Tone inks belong to Badge, status marks and diff counts, never a sentence" (`SKILL.md:52`).
Changes: tone Alerts' title and link default ink. Size S; confidence high.

### T13 · inconsistency · A result's path is 13 in Command palette, 11 in Composer menu

What: `command-palette.css:114` (13 on the row, components audit V4) vs `composer-menu.css:33` (11/14). Fix: Composer
menu's path takes the row size, as the audit decided. Size S; high. (Included in T1's table.)

### T14 · inconsistency · Label-to-control gap is 6, 4 or 2

What: DESIGN_SYSTEM: "a label above its one control: `ui-stack` (6)" (`:545`). Field 6 (`field.css:12`), Meter 6
(`meter.css:16`), Setting row vertical 6 (`setting-row.css:100`); Panel 4 (`panel.css:54`, "Field's label gap less 2";
its own comment at `:331` still says 6); Slider top layout 2 (`slider.css:235`).
Fix: the rule names its exceptions or they go: Panel's inspector rows 4 (Figma's, a dense composition: keep and write
it as Panel's tier), Slider top → 6 (it is a Field's label), or 4 with Panel if a slider label is a row caption. Size S;
confidence high on the values, medium on which should move.

### T15 · refinement · Reading size (15/22) in operated parts

What: Prompt suggestions items 15/22 muted (`prompt-suggestions.css:17,45`), Command palette step 15/22 muted
(`command-palette.css:150`) and input 15/22 (`:85`), Accordion md trigger 15/22 (`accordion.css:29`, whose comment
claims Notion's 16/24). The skill's first question puts anything operated at `text-base` (`SKILL.md:34-35`). The input
and the suggestions sit beside the Composer (15, a reading field), which is the likely reason.
Fix: rule: "a field you write prose into, and options that become that prose (Prompt suggestions), take `text-lg`;
every other operated part takes `text-base`". Then Command palette step → 13 (it is a breadcrumb of the search), the
input stays 15 (owner pick), Accordion md → 13/5 or `title-xs` if it heads document sections. Size S; medium.

### T16 · opportunity · Heading hierarchy tops out at 20/28 for words, 500 for weight

Verified on this branch: weights in components are 400 (33 rules) and 500 (48); none above 500. Word titles drawn by
components: `title-xs` 16 (Section heading, Link groups, Empty state md, Page header sm), `title-sm` 18 (Page header
md), `title-md` 20 (Page header lg, its only use). `title-lg` 26 is used only for figures (Card value, Chart figure),
display 52/67 by no component. Step ratios: 13→16 1.23, 16→18 1.13, 18→20 1.11, 20→26 1.30, 26→52 2.00. So a page title
is at most 1.54 × body, and there is no word size between 20 and 52 (the recreations' "26 to 52" is 20 to 52 for words).
Message has no heading styles of its own (`message.css`: only trims), so replies' headings are set by hosts.
Another session (worktree `electron-app-audit-cleanup-35275b`, product recreations README "Hierarchy and depth, built")
added `--area-weight-heading` 600 and `title-xl` (32/40 at 13) there; neither is on this branch
(`grep weight-heading|title-xl packages/tokens/src`: none). Fix: merge that work rather than redesign it; add a heading
role to Message (h2/h3 at `title-xs`, the skill's 16) so replies stop depending on hosts; keep display for specimens.
Size M (cross-worktree); confidence high on the census.

### T17 · inconsistency · Disabled ink on labels and their explanations

What: Field keeps its label muted when disabled, "Keep instructions and validation readable" (`field.css:87-90`); Setting
row paints its label and description `fg-disabled` (`setting-row.css:110`); Composer the whole box (`composer.css:62`).
CONTRAST: an inactive control's words may sit at disabled, "but its reason may not" (`CONTRAST.md:145-146`). A Setting
row's description is its reason.
Fix: rule: "disabled ink is for the control's own value and label inside it; a label outside the control and every
description keep their inks". Changes: Setting row's description stays muted when disabled (label to muted as Field's).
Size S; confidence medium-high.

### T18 · refinement · Figures: 26/400 sans in Card and Chart, 18/500 mono at a donut's centre

What: `surface.css:306-310` and `chart.css:179-183` set figures at `title-lg` 400 tabular sans; the donut centre is
`title-sm` 500 in the plot's mono (`chart.css:88`, comment "second-rank figure (title-sm, 500, mono)"), and lacks
`title-sm`'s tracking. Fix: one figure role: sans, 400, tabular, `title-lg` (a primary figure) or `title-sm` (a
secondary one), with its tracking token. Changes: donut centre to sans 400. Size S; medium.

### T19 · inconsistency · Placeholder ink by two roles

What: `approval.css:153` and `editable-text.css:45` paint placeholders `fg-muted`; every field uses `input-placeholder`
/ `textarea-placeholder` (→ `fg-placeholder`). Today the two resolve to the same rung (`curves.ts:135-136`, 550/250),
so nothing shows; a Contrast or theme change to the placeholder role would split them.
Fix: placeholders read `input-placeholder`; add to the role test. Size S; high.

### T20 · refinement · Tracking tokens applied by nine rules out of hundreds

What: `text-sm-tracking` is applied by 5 rules (Edit summary counts, Plan count and meta, Step meta, Timeline time),
`text-base-tracking` by Dialog title and Surface, Card's three parts, titles via Page header and Section heading; Badge
cancels it (`badge.css:38`, `normal`). Every other 12 and 13 inherits the root's `text-lg` tracking, 0
(`base.css:11`). At 11–13 the tokens are 0.03–0.08 px, invisible, so the split costs nothing visible but makes the rule
"tracking is the token's own" (`SKILL.md:30`) untrue. The visible case: title-sm's −0.18 px missing on the donut centre.
Fix: either drop tracking below 14 from `type-size.ts:57` (0 em, as Badge already does), or set tracking wherever a
part sets a ramp size (a test can check pairs). Recommend the first: true scale, no bloat. Size S; high.

### T21 · refinement · Underline offset is a literal in seven places, and differs in two

What: `0.08em` in `link.css:30`, `mention.css:44`, `chip.css:218,223,227`, `code.css:357`, `surface.css:630,710`; Badge
plain `0.2em` (`badge.css:232`); Description list "more" none (`description-list.css:177`). Thickness is one token
everywhere (good). Fix: `--area-underline-offset` (0.08em) on the type axis; Badge and Description list read it.
Size S; high.

### T22 · defect · Literal sub-floor text in Folder, File page and Citation's footnote

What: Folder count and File page label `round(nearest, size × 0.13, 1px)` (`folder.css:101`, `file-page.css:105`):
6 px at sm (48), 8 at md (64), 12 at lg (96). Citation footnote `0.704em` on line 1 (`citation.css:94-95`): 9.2 px in 13
text. The ramp's floor is 10 (`type-size.ts:15`). If the folder label is a drawing (part of the artwork) it should be
`aria-hidden` and documented as artwork; if it is text, it needs a floor: `max(text-xs, …)`. Footnote: `max(10px,
0.704em)` or `text-xs`. Size S; medium (the folder label's role was not checked in React).

### T23 · inconsistency · Title-pair rule says "one property at a time"; surface titles change two

What: the skill: "A step down in hierarchy changes size, or ink, or weight" (`SKILL.md:63-64`), echoed in Confirm
dialog's comment ("size and weight, not the ink as well", `confirm-dialog.css:17-19`). DESIGN_SYSTEM's surface title
rule: "told apart by weight (500) and ink (default over muted)" (`:529-531`), which Card, Dialog, Drawer, Popover, Toast,
Alert and Approval follow, while Confirm dialog alone keeps its description default (`confirm-dialog.css:21`).
Fix: decide which sentence is the rule. Measured references for surfaces (Cursor confirm: 500 primary over secondary;
title-balance table) support weight + ink for a surface's title over its copy; then the skill's sentence is about
size steps ("never smaller + muted + lighter at once"), and Confirm dialog's default description is the written
exception ("a surface whose copy is its only body"). Or Confirm's reasoning applies to Toast, Popover and Alert too. Docs
first; S; high on the contradiction.

### T24 · inconsistency · Label beside a value: muted, except Description list's justified layout

What: labels beside values are muted 400 (Field horizontal/inline/auto `field.css:148-149`, Panel row label
`panel.css:343`, Description list term `:52`, Table th `navigation.css:371`); Description list's `justified` term turns
default 500 (`description-list.css:78`). Fix: the layout changes position, not role; `justified` keeps the muted term,
or the docs say why a justified term is a title. Size S; medium.

### T25 · refinement · Stale type comments (they misled at least two later passes)

`calendar.css:96`, `asset-row.css:21`, `panel.css:482` and `:331`, `navigation.css:861`, `surface.css:1570`,
`accordion.css:26-27`, `field.css:52`, `slider.css:302`, `typography.ts:2-3`: each names a size or weight the code no
longer has (most from before the 2026-10-26 type 14 → 13 default and the 2026-11-02 ramp). Fix with T1/T4; add a note to
the foundation-change skill: a ramp change sweeps comments that quote px. Size S.

### Checked and not findings

- Truncation: every one-line name has an ellipsis or a fade (Chip, Segmented, Tabs, Code labels via `inset.css:274`;
  Nav and Tree fade by design). Multiline names wrap at words, `anywhere` only for paths and names in cards.
- Empty-list text is 13/18 M in all seven families (Combobox, Menu, Tag picker, Composer menu, Command palette, Chart,
  Board).
- Surface title–copy gaps are 4 in all eight families (`_title-gap`, Dialog `surface.css:1016`, Card `:326`).
- Row-line metas (Plan, Step, Edit summary, Timeline time) keep the row's 18 line as skill rule 5 asks.

Counts: 6 defects (T1, T6, T7, T8, T9, T22), 13 inconsistencies (T2, T3, T4, T5, T10, T11, T12, T13, T14, T17, T19,
T23, T24), 5 refinements (T15, T18, T20, T21, T25), 1 opportunity (T16).

## 4. Already excellent: don't disturb

- **Cap centring is exact by construction.** Geist's metrics put the cap's centre on the line box's centre at any
  line-height (ascent 1005, descent 295, cap 710: (1005 − 295)/2 = 355 = 710/2), and every control height is an even
  leading plus twice a whole room (`base.ts:465-466`), so the leftover is even at every Type and Density: 30 − 18,
  26 − 18, 22 − 14, 38 − 18, 46 − 22. The only odd line in the system is T7's 17. Rendered baseline snapping (13/18 puts
  the baseline at 13.6) was not measured.
- One ramp, derived from one number (`type-size.ts`), with prose leadings derived by WCAG 1.4.8, consumed through
  tokens everywhere except the literals listed in T7, T8, T21, T22. No hex text colours; inks are four roles plus `quiet`
  and tone roles, all semantic.
- Two weights only, and no 12px text at 500.
- Surface title pairs: 13/18 500 over 13/18 at 4 in all eight surface families (title-balance pass), trimmed to glyphs.
- Marks on one line: Count, Badge and Tag share a whole-pixel cap baseline (`badge.css:67`, `count.css:93`,
  `tag.css:97`).
- Selected Tab's 500 with a reserved width; Segmented and Pagination keep one weight so selection never reflows.
- Row-line metadata keeps the row's 18 line (Plan, Step, Edit summary, Timeline), and `text-box` trims are applied by
  role (cap/alphabetic for controls, cap/text for prose).
- Change inks (`fg-change-*`) are read identically by Tree view, Tabs and Edit summary.
