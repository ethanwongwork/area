# Alignment picker spec

**Captures:** `docs/research/captures/alignment-picker/`, `button-group/figma--align-group`, `number-field/figma--number-field`
**Peers:** Segmented (a choice on its own track), Radio (exclusive choice), Checkbox / Chip (neutral selection), Input (soft field fill), ColorSwatchPicker (grid of cells), NumberField (inspector row neighbour)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)):

  From the 2026-09-24 control refinement:

  - [Figma alignment guidance](https://help.figma.com/hc/en-us/articles/31289464393751-Use-the-horizontal-and-vertical-flows-in-auto-layout):
    the nine-position control and spatial arrow navigation inform AlignmentPicker; a flat
    selected cell replaces the raised tile. Dimensions come from Area's tokens.

  From the color and alignment follow-up, 2026-09-24:

  AlignmentPicker uses three rounded bars with column-dependent alignment, 2px unselected
  dots, no selected backplate, and `stretch` to fill both dimensions of a sized parent.
  Landscape and portrait examples demonstrate this independently of size/treatment variants.

  2026-09-26: the selected bars are `fg-default` by default and `fg-accent` with
  `tone="accent"`, following "Neutral by default, accent by override" (DESIGN_SYSTEM.md).
  Checkbox, Radio and Chip moved the same way (neutral-solid checked face; neutral tonal chip
  selection); all four await owner review. *All four approved since. Superseded 2026-09-29
  (owner, D1): the bars are the Selection role, `fg-selection` (alignment-picker.css:23), accent
  by theme; the `tone` axis was removed.*
- 2026-09-26: **Neutral by default, accent by override** (owner; DESIGN_SYSTEM.md).
- 2026-10-08: "go with your recs for open questions" → corner `radius-control-sm` (6 at both
  densities, the sm fields' corner); no edge in either theme (transparent 1px, counted once in the
  4 inset); default proportion 88 : 56 kept, Panel sizes it; the hover preview glyph keeps swapping
  at once. See Settled questions 2–5.
- 2026-09-26 (second pass): decide every open item with the most calculated option
  consistent with the system. Nothing in that pass changed AlignmentPicker; a `sizes` tile
  was added to the gallery.

## Job and boundaries

AlignmentPicker chooses one of nine physical positions (a 3 × 3 radio group) for an
inspector property. It is not a general grid of options (ColorSwatchPicker) or a
one-dimensional choice (Segmented).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | soft (default; `.area-alignment-picker--soft`, the field fill it borrows), plain | Standalone, or inside an existing inspector surface. Was `surface`, renamed because `surface` means a lifted plate in Calendar, Toolbar and ColorPicker; `"surface"` stays a deprecated React alias | Figma auto-layout alignment control (guidance above) |
| size | *removed 2026-10-04* (React `size` kept, ignored): the grid fills its parent's width, and its height when the parent sets one, else 88 : 56 | Owner (2026-10-04, responsive) | Gallery default (framed at 88), `fill` (220 × 112) |
| boolean | `stretch` *removed 2026-10-04* (React prop kept, ignored): always fills | Owner (2026-10-04) | — |
| state | checked, disabled | — | Gallery `disabled` |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma-guide | official guidance | Nine-position control, arrow navigation | Figma help link above | n/a | none |
| figma | target product (primary for inspector controls) | Editor inspector alignment row: three joined 24px icon buttons, rgb(245), outer radius 5; inspector number field: rgb(245), radius 5, no edge | figma.com editor, light, read-only, 2026-09-26 | evidence only | `button-group/figma--align-group--rest--light`, `number-field/figma--number-field--rest--light` |
| figma | target product | Paint-type radios: 24px cells, radius 5, selected rgb(245), 4px apart | earlier ColorPicker pass | evidence only | `color-picker/figma--paint-type-row--rest--light` |
| area | this system | Gallery tiles, re-taken after the second pass | localhost gallery | — | `alignment-picker/area--*` (7) |

Figma's nine-position auto-layout control was not captured: the second pass recorded the
inspector's alignment row, number field, size select and section titles, not the auto-layout
alignment grid. ChatGPT and Notion have no equivalent in the captured surfaces (page
menu, Share popover, board, table). Untitled UI has no alignment picker
([reference](../research/untitled-ui-reference.md)).

## Anatomy

```
area     div.area-alignment-picker[role=radiogroup][dir=ltr]  owns: grid, 1px transparent edge, padding, radius, fill
  cell   label.area-alignment-picker__cell  owns: square cell, radius, hover plate, focus ring, hit area
    input  radio, opacity 0, fills the cell
    dot    span.__dot  2px dot; when checked a 16px box of three 2px bars (10 / 16 / 6: 60 / 100 / 40% rounded to even pixels)
```

Inset equation: 1px transparent border + 3px padding = 4px outer inset (`alignment-picker.css`);
cells meet with no gap. Default frame (88 wide): 4 + 3 × 26.67 + 4 = 88 by 4 + 3 × 16 + 4 = 56
(measured 2026-10-07); the floor is 3 × 16 + 8 = 56 each way. Cell radius = max(radius-floor 4,
container 6 − inset 4) = 4 (container 8 until 2026-10-08). *The 80 × 80 table below predates the 2026-10-04 responsive change.*

## Measurements

`node scripts/capture-compare.mjs alignment-picker/*.json` (shell) plus cell nodes:

| slot · property | default | disabled | landscape | plain | portrait | tone-accent |
|---|---|---|---|---|---|---|
| **shell** size | 80 × 80 | 80 × 80 | 220 × 112 | 80 × 80 | 112 × 200 | 80 × 80 |
| **shell** padding | 3 | 3 | 3 | 3 | 3 | 3 |
| **shell** border | 1 solid rgb(243, 243, 243) | same | same | 1 solid transparent | same as default | same as default |
| **shell** radius | 8px | 8px | 8px | 8px | 8px | 8px |
| **shell** background | rgb(247, 247, 247) | same | same |  | same | same |
| cell | 24 × 24, radius 4 | | | | | |
| unselected dot | 2 × 2, rgb(102, 102, 102) | | | | | |
| selected bars | 9.59 / 16 / 6.4 × 2, rgb(40, 40, 40) | | | | | rgb(72, 62, 223) |

`area--sizes` shows the sm tier: 74 × 74 (22px cells). Figma, for comparison:

| slot · property | figma · align-group | figma · number-field | figma · paint-type cell |
|---|---|---|---|
| size | 88 × 24 (three 28.66 × 24 items, 1px apart) | 88 × 24 | 24 × 24, 4px apart |
| fill / edge | rgb(245, 245, 245), none | rgb(245, 245, 245), none | rgb(245, 245, 245) when selected |
| radius | 5px on the outer ends | 5px | 5px |
| glyph | 24 × 24 svg, rgb(0, 0, 0) | — | — |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| cell | (control + icon) / 2: 22 (min 20) / **24** / 28 (`alignment-picker.css:3, 15-17`) | Area tiers; Figma inspector cells 24 | — |
| outer inset | 4, border counted once | Inset contract | — |
| container paint | `input-bg-soft` light-dark(#f7f7f7, #282828), 1px transparent edge (`alignment-picker.css`) | Peer: soft NumberField (fill, transparent edge); Figma inspector controls rgb(245), flat | — (owner 2026-10-08: was a `border-decorative` #f3 edge, invisible in dark) |
| radius | `radius-control-sm` 6 at both densities; cells 4 (`alignment-picker.css`) | Peer: the sm NumberFields beside it in a Panel row (6); nested radius rule | Figma 5 on its controls and cells; Area's sm corner is 6 (owner 2026-10-08; was `radius-control-md` 8 / 6) |
| default proportion | 88 : 56 when the parent sets no height; fills a sized parent | Figma's grid, 88 × 56 | — (owner 2026-10-08: kept; a Panel row spanning two fields sets the height) |
| hover preview glyph | swaps at once (no crossfade); the plate fades out on fast | Figma swaps its preview at once | — (owner 2026-10-08) |
| unselected mark | 2px dot `fg-muted` rgb(102) | Owner (prior decision) | — |
| selected mark | three 2px bars in a 16px box, aligned by column; `fg-selection` (neutral: `fg-default`; `alignment-picker.css:23`) | Owner (prior decision, 2026-09-26 tone note); Figma's alignment glyphs are black | Was `fg-accent` |
| selected backplate | none (`alignment-picker.css:52-54`) | Owner (prior decision) | Figma fills the selected cell (rgb 245) |
| hover | `bg-hover` light-dark(#1414140d, #fcfcfc24) plate plus the position's glyph in `fg-muted` on unselected, enabled cells (`alignment-picker.css`, hover block; static hook `data-preview`) | Audit rule: translucent hover on a component's own track (as Segmented); glyph preview from Figma | Figma draws no hover fill; owner asked for the soft plate back with the glyph (2026-10-04) |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover | translucent plate and the position's glyph in fg-muted | `figma--auto-layout-alignment--hover--light`, `area--default--hover--light` (before the plate returned) |
| checked | bars replace the dot | all tiles |
| focus-visible | 2px focus ring on the cell, raised (`alignment-picker.css:84-88`) | not captured |
| disabled | cells 50% (`alignment-picker.css:89`) | `area--disabled` |
| forced colours | checked cell outlined and bars in Highlight (`alignment-picker.css:90-94`) | not inspected |

## Behavior and accessibility

`role="radiogroup"` named by a consumer's `aria-label`, else `label`; nine native radios named "top left" … "bottom right"
(`AlignmentPicker.tsx:75-83`). The group is forced `dir="ltr"` because the positions are
physical. Arrow keys wrap within a row or column, Home and End reach the corners, and
selection follows focus (`AlignmentPicker.tsx:47-67`). `name`, `required` and `disabled` are
native (group `disabled` also sets `aria-disabled`); an uncontrolled picker restores `defaultValue` on form reset.

## Peers and consistency

| Peer | Shared role | Area value in peer | AlignmentPicker | Match / reason |
|---|---|---|---|---|
| Segmented | hover on its own track | `bg-hover` | `bg-hover` | match |
| ColorSwatchPicker | picker cell ladder | `control-xs/sm/md` 24 / 28 / 32, plate + ring (`color.css:83-85`) | (control + icon) / 2: 22 (min 20) / 24 / 28, bars (`alignment-picker.css:15-17`) | differs by design (audit F-31 A, owner 2026-09-30): two ladders kept; a swatch cell holds a chit, an alignment cell a mark |
| Radio / Checkbox / Chip | selection paint | Selection role, neutral by default | `fg-selection` bars | match |
| Input (soft) | field fill | `input-bg-soft` | same | match |
| All controls | disabled | 50% | 50% | match |

## Visual pass

### Claude in Chrome audit, 2026-10-07

**Sources.** `localhost:4377/alignment-picker.html` (Area docs page, 1:1; light, dark and compact
set by `data-area-theme` / `data-area-ui` on the specimen's host, computed styles) and
`/panel.html` (inspector peers: sm NumberField, Panel rows). Figma: the 2026-10-04 live captures
(`figma--auto-layout-alignment--rest/--hover--light`); not re-opened, since no Figma file was open
and the auto-layout grid needs an editable selection (Community view mode shows no Design panel).
Framer, Penpot, Webflow and Plasmic need a login; Webstudio's source had no matching component
(GitHub code search). Dark Figma not seen (theme is an account setting).

| slot · property | Area light | Area dark | Area compact | Figma (10-04) | Area sm NumberField (Panel) |
|---|---|---|---|---|---|
| shell size at 88 wide | 88 × 56 | 88 × 56 | 88 × 56 | 88 × 56 | 28 high (compact 24) |
| inset | 1 edge + 3 pad = 4 all round | same | same | 4 top/bottom + 1 = 5; 1 at sides | — |
| fill | #f7 | #282828 | #f7 | #f5 | #f7 / #282828 |
| edge | 1px #f3 | 1px #282828 (= fill, invisible) | 1px #f3 | none | 1px transparent |
| radius | 8 | 8 | 6 | 5 | 6 (compact 6) |
| cell | 26.67 × 16, r4 | same | same | 28.66 × 15.33, no plate | — |
| dot | 2 × 2, #666 | 2 × 2, #c5c5c5 | #666 | 2 × 2, 30% black | — |
| chosen glyph | 9.59 / 16 / 6.40 × 2 bars, #282828, no plate | #eeeeee | same | 7 / 10 / 5 bars, blue, no plate | — |
| hover | plate rgba(20,20,20,.05) r4 + glyph #666 (bars at y 3 / 7 / 11 of 16) | plate #fcfcfc24 + #c5 | same | no plate, glyph 50% black, tooltip | — |
| focus | cell outline 2px focus-color, offset 2, z 1 (rule) | #c1d9fd | same | not captured | — |

**Findings.** (1) In an inspector row the picker's corner (8) is larger than its sm field peers' (6);
Figma uses one corner (5) on both. Compact matches (6 / 6). (2) Dark theme: `border-decorative`
and `input-bg-soft` are both #282828, so the edge settled as "bounding the grid" disappears in dark;
light shows it. (3) Default height 56 is Figma's two 24 fields + 8; Area's sm fields are 28 at
default density (56 only in compact, 24 + 8 + 24), so beside two Area field rows the picker comes up
short unless the row sets its height (it then fills). (4) Hover, chosen and dot geometry match Figma
within the owner's decisions (horizontal bars, neutral ink, soft plate). (5) Focus follows Segmented
and ColorSwatchPicker (same rule); live Tab focus not exercised (window in background).

**Changed.** Spec only: Variants and Anatomy rows still described `size` / `stretch` and the 80 × 80
md grid removed on 2026-10-04. No CSS or React change: findings 1–3 are owner calls (below).
New JSON captures not saved (the clipboard needs a visible window and a local relay was refused);
values above are computed styles read in the tab.

2026-09-28, Claude in Chrome (batch 10): Figma's auto-layout Alignment grid (a frame selected, nothing
edited) beside the gallery's default tile at 3x. Same control: soft grey ground, grey dots, the chosen
position as three short bars. Differences, all owner decisions or earlier passes: Figma's grid is
88 x 56 (one field column by two field rows, non-square cells) where Area's is square 24px cells;
Figma draws no edge and a blue mark; Area keeps a decorative edge and a neutral mark. No change; the
grid-to-layout sizing is raised with the owner. Dark theme not compared.

Earlier note:

The gallery shows the tiles in named groups (Default, Variants, Tones, Sizes, Layout, States).
Beside Figma's inspector row the picker reads as the same soft control: a flat grey ground
and black marks, with Area's larger radius. Not inspected by this spec's author: hover, dark
theme, forced colours.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`; research finding: "Alignment picker … hover has no transition"
(`docs/research/motion-2026-10-07/crispness-and-current-state.md`, Part C).

| Interaction | Before | After |
|---|---|---|
| Cell hover plate (`bg-hover`) | none: snapped in and out | in: instant (`:hover` 0s, under `hover: hover`); out: `background-color` on fast 100, ease-out (`--area-transition`, plate only) |
| Hover preview glyph (dot → three bars, `fg-muted`) | swaps at once | unchanged: a preview, not a plate; the dot returns at once while the plate fades |
| Press | none | instant (`:active` 0s) |
| Choose (pointer or arrow keys) | glyph and plate swap at once | unchanged: the chosen cell's plate drops at once (`:has(input:checked)` 0s) |
| Focus ring (outline on the cell) | instant | unchanged |
| Disabled | dims as a whole | unchanged |

Crispness (MOTION.md rule 5): the bars were 60 / 100 / 40% of the 16 box, 9.6 / 16 / 6.4 long
(measured on `/alignment-picker.html`), so a centred bar sat 0.2px off the pixel grid. They are now
`round(nearest, …, 2px)` of the icon size: 10 / 16 / 6 (12 / 20 / 8 at a 20 icon), centring exactly.
Figma's measured bars are 9.59 / 16 / 6.40 (Measurements); the 0.4px difference is the price of a
crisp centre. Cells stay fractional (a third of the track, 26.67 wide at 88): they are laid out,
not transformed, so their plates are pixel-snapped at paint. No resting transform or `will-change`.

## Settled questions

1. **Container edge: kept** (2026-09-27, third pass). *Superseded by 3 (owner 2026-10-08).* Figma's
   inspector controls are flat rgb(245) with no edge (`figma--align-group`, `figma--number-field`);
   the picker kept a 1px `border-decorative` (#f3) to bound the grid
   ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)).

From the 2026-10-07 audit and motion pass; owner 2026-10-08: approved, recommendations accepted.

2. **Corner role: `radius-control-sm`.** 6 at both densities (was `radius-control-md`, 8 / 6), the
   corner of the sm fields it sits beside in a Panel row, as Figma's grid shares its fields' 5.
   Cells stay at the floor, 4 (max(4, 6 − 4)).
3. **Edge: dropped in both themes.** The edge was invisible in dark (#282828 on #282828); Figma and
   Area's soft NumberField draw none. The 1px border stays transparent so the inset stays 1 + 3 = 4
   (counted once) and forced colours still outline the grid.
4. **Default height: 88 : 56 kept.** Panel sets the height when the picker spans two field rows;
   the picker already fills a sized parent.
5. **Preview glyph: no fade.** The plate fades out on fast; the preview bars swap back to the dot at
   once, as Figma's preview does (a crossfade would need both drawings and is too short to read).

## Open questions

None.

## Verification

Compared the seven `alignment-picker/area--*` captures with `button-group/figma--align-group`,
`number-field/figma--number-field` and `color-picker/figma--paint-type-row--rest--light`.
Build and test results are in [the audit](../research/cohesion-audit.md#verification).
Unverified: Figma's focus state (rest and hover captured 2026-10-04).

## Interaction polish, 2026-10-16

Cells are not selectable. See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Feedback log

- 2026-09-26 · earlier pass the same day → selected bars `fg-accent` → `fg-default`, `tone`
  axis added → `area--default`, `area--tone-accent`.
- 2026-09-26 · cohesion audit → no change; spec written → 6 Area captures.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → evidence added,
  no change; sizes tile added; container edge recorded as open →
  `button-group/figma--align-group`, `number-field/figma--number-field`, `area--sizes`.
- 2026-09-27 · third pass → open question settled, value kept: the 1px decorative edge
  stays → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-28 · batch 10 Claude in Chrome side by side (Figma auto-layout Alignment grid) → no change;
  question: size the grid to one field column by two rows, as Figma does?
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → variant `surface` renamed `soft` (the field fill it borrows; `surface` means a lifted plate in Calendar, Toolbar and ColorPicker), `"surface"` kept as a deprecated React alias, CSS `.area-alignment-picker--soft` (alignment-picker.css:18; manifest default `soft`); a consumer's `aria-label` wins over `label`; group `disabled` sets `aria-disabled` (AlignmentPicker.tsx:72). No visual change.
- 2026-09-30 · audit F-31 (owner pick A) → the two picker ladders stay (swatch cells 24 / 28 / 32, alignment cells 22 / 24 / 28 at default density); Figma's 88 × 56 grid sized to the layout is answered later as a separate layout option (backlog in COMPONENTS.md), not a change to the square cells.
- 2026-10-03 · radius audit → cells are concentric with the picker, floored at the smallest control's corner (compact r2 → r4, default r4 → r5; `alignment-picker.css:31`). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-03 · all even (owner) → cells floor at `radius-floor` 4 (`alignment-picker.css:31`).
- 2026-10-04 · owner: responsive, no sizes; Figma's hover preview; the inspector-sized grid
  (COMPONENTS.md backlog) → the grid fills its parent's width, and its height when the parent sets
  one, with a default proportion otherwise (provisional 88 : 56 from the 2026-09-29 audit, to be
  measured); `size` and `stretch` are removed (React props kept as ignored, deprecated); cells are a
  third of the grid; hovering an unselected cell shows its glyph in the muted ink (provisional: Figma's
  hover is not yet captured), with `data-preview` as the static hook; demos frame it at 112. Reopened
  for review (`component-status.mjs`). Unverified: Figma's grid size, padding, hover ink and plate,
  pending a live capture in Claude in Chrome.
- 2026-10-04 · Figma captured live in Claude in Chrome (`figma--auto-layout-alignment--rest--light`,
  `--hover--light`; owner's file, selection only, nothing changed): the grid is 88 × 56, fill #f5,
  radius 5, inset 5 top and bottom and 1 at the sides, cells about 28.7 × 15.3, dots 2 × 2 at 30% black;
  the chosen glyph is a 16 box of three 2px bars 2px apart (7 / 10 / 5 long, Figma blue, vertical for a
  horizontal flow); hover previews that glyph at 50% black with no cell fill, plus a tooltip
  ("Align bottom right"). Applied: default proportion 88 : 56 (confirmed), no hover fill, preview in
  the dots' ink (fg-muted; Figma's preview is darker than its dots, Area's dots are already fg-muted),
  demos framed at 88. Kept (owner decisions): the 1px edge, 4 inset all round, horizontal bars and
  the neutral selection ink. Open: a per-cell tooltip, as Figma's.
- 2026-10-04 · owner: "add a soft backplate back in addition to the icon change" → the hovered (and
  `data-preview`) cell gets the `bg-hover` plate again under the fg-muted preview glyph; checked cells
  keep no plate. Departs from Figma's hover (no fill) by owner choice.
- 2026-10-07 · Claude in Chrome audit (Area light / dark / compact computed, Panel peers; Figma from
  the 10-04 captures) → no CSS change; stale size / stretch / 80 × 80 rows corrected; open: corner
  role (8 vs the sm fields' 6), the edge vanishing in dark, default height beside 28px fields →
  [Visual pass](#claude-in-chrome-audit-2026-10-07).
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → motion pass: the cell hover plate appears at once and fades out on fast ease-out (was snapped); bars on whole even pixels (10 / 16 / 6, were 9.6 / 16 / 6.4). "Motion and interaction, 2026-10-07".
- 2026-10-08 · owner: "go with your recs for open questions" → approved, recommendations accepted:
  corner `radius-control-sm` 6 (was 8 / 6), edge transparent in both themes (was `border-decorative`),
  88 : 56 kept, preview glyph keeps its instant swap. Checked on `/alignment-picker.html` (computed,
  light / dark / compact): radius 6, cells 4, edge transparent, inset 4, fill #f7 / #282828.
