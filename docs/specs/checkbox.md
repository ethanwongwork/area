# Checkbox spec

**Captures:** `docs/research/captures/checkbox/` (Area, Notion, Figma)
**Peers:** Radio (same glyph ladder and paint), Switch (on/off setting), Chip (selectable
filter), Field and CheckboxGroup (label and validation), Table (row selection)

## Owner decisions

- 2026-09-26: **Neutral by default, accent by override** (DESIGN_SYSTEM.md, "Color and
  focus"). The checked face is `neutral-solid` with `fg-on-neutral`; `tone="accent"` opts
  into the accent. Recorded with the Alignment picker's decisions ([alignment-picker.md](alignment-picker.md)):
  "Checkbox, Radio and Chip moved the same way (neutral-solid checked face; neutral tonal
  chip selection); all four await owner review." (All four approved since.) *Superseded 2026-09-29 (owner, D1): accent is the Selection emphasis role, set by a theme (`data-area-selection="accent"`); the `tone` axis was removed.*
- 2026-09-26 (second pass, owner: decide every open item): choice glyphs take the control
  hover edge at rest (#d4d4d4), with Notion and Untitled
  ([cohesion audit](../research/cohesion-audit.md#second-pass-notion-figma-and-the-open-decisions)).

## Job and boundaries

Checkbox toggles one independent option, or shows a parent's partial selection. It is not
a setting that applies immediately (Switch), one of an exclusive set (Radio), or a filter
token (Chip). CheckboxGroup owns the legend, group description and group validation.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | md (default), lg (sm removed 2026-09-28) | Label type follows the control tier; lg is the 20px glyph | Untitled sm 16 / md 20; Notion and Figma one size, 16 |
| variant | card | A contained option: visual, text, control at the end; the chosen card's edge takes `stroke-selected` at `selected-width` (Selected stroke, 2), drawn inside | Owner references (2026-09-28); shadcn Choice Card (`shadcn--choice-card-radio-*`) |
| layout (card) | row (default), tile, preview | Row: one line; tile: a 20px visual above the label, control in the corner, cards in a grid; preview: the visual centred as the option's picture, the label centred, no box drawn (2026-10-21) | Owner reference 1 (tile grid); references 2, 3 and shadcn (rows); the owner's Appearance picker, Radix CheckboxCards (preview) |
| state | checked, indeterminate, invalid, disabled | Native states plus `aria-invalid` | Untitled: checked, indeterminate, disabled; no invalid |
| composition | caption, leading visual, group (vertical, horizontal; invalid, success) | — | Untitled label + hint; Figma label beside the box; gallery Layout / horizontal group |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | Table-view checkbox property, empty and checked | app.notion.com, returns table view, logged in, 2026-09-26 | evidence only | `notion--checkbox--rest--light`, `notion--checkbox-checked--rest--light` |
| figma | target product | Inspector checkbox with label, checked | figma.com editor inspector, logged in, 2026-09-26 | evidence only | `figma--checkbox-checked--rest--light` |
| uui | design system (source) | Checkbox | `components/base/checkbox/checkbox.tsx:20-108` at `4702dc0` ([reference](../research/untitled-ui-reference.md)) | MIT | source reading only |
| area | this system | Gallery tiles (being re-captured after the second pass) | localhost gallery | — | `area--*` |

ChatGPT: no checkbox in the captured surfaces (settings use switches). Not captured in any
product: an empty Figma checkbox, hover, focus, and dark themes.

## Anatomy

```
notion  div 16×16, radius 3, 1 device-px edge rgba(27,21,0,.19) (0.56 CSS px at dpr 1.8)
  input  opacity 0, covers the box
  checked: no edge, fill rgb(39,131,222), 14px svg filled check (glyph 9.17 × 9.14), white
figma   div 216×24 grid (16px + 200px columns)
  span 16×16 at y 4: input (opacity 0) + face: 1px rgba(0,0,0,.2), radius 2, fill #f5
    svg 16×16, stroked check (path 6.5 × 6), stroke rgba(0,0,0,.898)
  label  11/16 450, starts at x 16 (no gap or padding in the captured layers)
area   label.area-checkbox  inline-flex, align flex-start, min-block 24, gap --_gap   owns hit area
  control  input.area-checkbox__control  --_size square, 1px edge, radius min(small, size/4) (`shadow-1` at capture; removed since)
    ::after  mask of the check (or dash) drawn 1:1 on the border box (16 / 20 grid), painted --_mark
  visual   span.area-checkbox__visual  optional 16px decorative icon, fg-muted
  label    span.area-choice-label  cap-trimmed title (+ description 12/16 muted)
```

First-line alignment (inset.css:187-195): the label box starts `(size − 1cap) / 2` below the
glyph top, so the cap-height centres on the glyph. Card: 1px border + 12px padding = 13px
from the edge to the glyph (`area--card`).

## Measurements

Read from the nodes (Notion and Figma files above; Area `area--size-*`, `area--selected`,
`area--tone-accent`, `area--invalid*`). Composites on white are arithmetic, not captured.

| Node · property | Area sm / md / lg | Notion | Figma |
|---|---|---|---|
| control box | 16 / 16 / 20 | 16 | 16 |
| radius | 4 / 4 / 5 | 3 | 2 |
| rest edge | 1px #d4d4d4 | 1 device px, 19% warm black (≈ rgb(212, 211, 207)) | 1px 20% black (empty state not captured) |
| rest fill | #fff, `shadow-1` (at capture; now none) | none (row ground) | #f5 |
| checked fill / edge | rgb(40) / rgb(40) | rgb(39, 131, 222) / none | #f5 / 20% black |
| checked mark | rgb(250), 1.75 stroke | white filled check, 9.17 × 9.14 | 90% black stroked check, 6.5 × 6 |
| accent fill / mark | rgb(92, 93, 254) / #fff | — | — |
| invalid edge; checked | rgb(207, 3, 60); fill rgb(232, 9, 69), mark #fff | — | — |
| label type | 12/16 · 14/20 · 14/20, 400 | not in capture | 11/16, 450 |
| row / gap | min 24; gap 4 / 8 / 8 | — | 24; label column at the box edge |

The gaps above predate audit S14: the label gap is now 6 at md and lg.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| control · size | **16 / 20** md / lg (sm removed 2026-09-28; `choice.css`) | Notion and Figma 16; Untitled sm 16, md 20; audit rule "one glyph ladder" | lg takes Untitled's 20 |
| control · radius | min(`radius-small` 6, size / 4): 4 / 4 / 5 (choice.css:67) | Untitled 4 at 16 | Notion 3 and Figma 2 are squarer; kept (third pass), see below |
| control · rest edge | **`edge-control-hover` #d4d4d4** (choice.css:48) | Notion 19% warm ≈ #d4, Untitled #d4d4d4 (second pass) | Was `edge-control` #e2e2e2, a field's edge, faint on a 16px box |
| control · checked | `selection-solid` (neutral default #282828), mark `fg-on-selection` #fafafa (choice.css:20-22) | Owner 2026-09-26; emphasis roles 2026-09-29 | Notion fills its blue; Figma keeps a light face with a dark check. The accent comes from a theme's Selection role, not a tone |
| mark · geometry | check 1.5 stroke and dash 2px bar, drawn 1:1 on the control's 16 / 20 grid (choice.css, "Sizes"; 2026-10-07) | Figma 1.5px check on a 16 grid (`figma--checkbox-checked`) | Was 1.75 on a 16 viewBox masked at 75% of the padding box (1.15px, off-grid). Notion's filled glyph is 9.17px, Untitled's check 12px |
| control · shadow | none (computed 2026-09-28) | Outline pass: controls at rest carry no shadow; neither product nor Untitled has one | The audit had `shadow-1`; since removed |
| gap | 6 at md and lg, `gap-md` / `gap-lg` (choice.css:9, :404, :410); compact md 6 | Control tier; peer Button (audit S14) | Untitled 8 / 12. Was 8 / 8 until audit S14 |
| hit area | label, min-block 24 (choice.css:74) | WCAG 2.5.8 target; Figma's 24px row | — |
| invalid | edge `fg-danger-vivid`; checked = `danger-solid` fill | Area field validation | No product or Untitled invalid checkbox |
| disabled | 50% on the label (choice.css:37-41) | Audit shared rule; Untitled 50% | — |

**Settled in the third pass (kept):** radius. Notion draws 3 and Figma 2 at 16px, both
squarer than Area's 4 (`notion--checkbox*`, `figma--checkbox-checked`); Untitled draws 4.
Area keeps `radius-small`, shared with every small control ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)).

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover, unchecked | edge → `border-hover` #b4b4b4 (choice.css:190-193) | not captured |
| hover, checked | fill → `selection-solid-hover` (neutral #1d1d1d) (choice.css:178-183); mark fixed | not captured |
| focus-visible | 2px `focus-color` outline, 2px offset (choice.css:200-204) | not captured |
| checked / indeterminate | fill and edge `selection-solid` at once; mark `scale` 0.6 → 1 + `opacity`, `fast` ease-out (Motion, 2026-10-07) | `area--selected`, `area--partial` |
| invalid | edge and label `fg-danger-vivid`; checked becomes one danger fill | `area--invalid`, `area--invalid-selected` |
| disabled | whole label 50% | `area--disabled*` (opacity 0.5) |

## Behavior and accessibility

Native `input type="checkbox"` inside its `label`; `indeterminate` is set on the DOM node
and mirrored as `data-indeterminate` (forms.tsx:126-150). Caption is wired through
`aria-describedby`; `invalid` sets `aria-invalid`. `onCheckedChange(checked, event)` runs
after native `onChange` unless that calls `preventDefault` (forms.tsx:121). CheckboxGroup is a native `fieldset` with
`legend` (forms.tsx:188-203). forced-colors.css:47-63 paints the control Canvas with a
CanvasText edge, checked and indeterminate in Highlight with a HighlightText mark, and an
invalid control with a dashed Mark edge; not verified in a forced-colours browser. The mark transition uses
`duration-fast`, which the motion axis zeroes. Notion and Figma also keep a native input
(opacity 0) over a drawn face.

## Peers and consistency

| Peer | Shared role | Area value in peer | Checkbox | Match / reason |
|---|---|---|---|---|
| Radio | glyph ladder, rest edge | 16 / 16 / 20, #d4d4d4 | same | match (shared choice.css) |
| Radio, Switch, Slider | checked / on paint | `selection-solid` | same | match (Selection role) |
| Switch, Radio, Button | disabled | 50% whole control | same | match (audit rule) |
| Input | rest edge | `edge-control` #e2e2e2 | #d4d4d4 | differs by design: a 16px glyph needs a firmer edge than a 32px field |
| Switch | off fill | `edge-control` #e2e2e2, hover #d4 | edge #d4d4d4 | differs by design (audit S5): the off track is the rail grey, a glyph edge is one rung firmer |
| Slider | thumb edge | `edge-control-hover` #d4 (slider.css:34) | edge #d4d4d4 | match (audit S5) |
| Switch | row type | 14/20 label, 12/16 description | same | match |
| Table | selection column | Checkbox md | — | Table composes this component |
| Card | contained surface | 24 corner, 16 to the text column, `#ee` edge with the card halo (surface.css:33-90) | card variant: `radius-container` 12 corner, 12 to the content, `edge-control` #e2 edge, no shadow (choice.css:99-110) | differs by design (audit C-20 A, owner 2026-09-30): a choice card is a control-tier option in a list or grid, its edge is the field edge that darkens when chosen; Card is a content surface with a lift |

## Visual pass

The gallery shows the tiles in groups (Default, Tones, Sizes,
Content, States, Layout; Layout now includes the horizontal group). Against the products at 16px: Area's edge now reads as firm as
Notion's; its checked face is darker than either product by the owner's neutral rule.
2026-09-28 (batch 14): control and label centre on each other at every size (16 / 16 / 20
control, 14/20 label). Against Notion's and Figma's 16px checkboxes on file. Found: since small
controls moved to 14/20, sm differs from md only by its 4px label gap (was also 12/16 text);
settled 2026-09-28: sm removed. No product checkbox hover could be reached (the owner's board has none).
Unverified: dark theme, hover and focus in a product.

## Verification

Area tiles are being re-captured after the second pass (`area--*`); the rest-edge value
above is from `area--size-medium` (edge rgb(212)). Build and test results are in the
[cohesion audit](../research/cohesion-audit.md#verification).

## Motion and interaction, 2026-10-07

Contract: [`docs/MOTION.md`](../MOTION.md). Checkbox and Radio share `choice.css`.

| Interaction | Before | After |
|---|---|---|
| hover (edge or checked fill) | `--area-transition`: colours over `fast` ease-out, both ways | lands at once (`:hover` 0s under `hover: hover`), fades out over `fast` ease-out |
| press | colours ease over `fast` | at once (`:active` 0s) |
| checking by hand | fill and edge ease over `fast` | at once: a pointer or Space press is `:active`, an arrow key moves a focus-visible radio (`:is(:active, :focus-visible)` 0s); the option given up, or a change from script, fades over `fast` ease-out |
| mark enter / leave | `transform: scale(0 → 1)`, `fast`, `ease-spring` (overshoot) | `scale` 0.6 → 1 + `opacity` 0 → 1, `fast` `ease-out`, both ways (MOTION.md small-mark recipe); rests at `scale: 1` |
| card edge (chosen, hover) | `--area-transition` both ways | same rule as the control: at once on hover, press or keyboard focus, `fast` fade out |
| focus-visible | outline, not transitioned | unchanged: rings never fade |
| disabled | none | none |
| reduced motion | tokens zeroed on `:root` only | tokens zeroed wherever motion is set (`emit/css.ts`); no literal durations or keyframes here |

**Crispness.** The mark used to be a 16-unit drawing masked at 75% of the 14px padding box: a
10.5px mask at a 1.75px offset, so the check's stroke was 1.15px and the indeterminate dash
(1.15px centred on y = 8) fell across two rows at 57% at 1x. The mark now covers the control's
border box (`inset: -1px`) and its mask is drawn 1:1 on that box's pixel grid, one drawing per
size (`--_check` / `--_dash` on `.area-checkbox--md` and `--lg`):

| Mark | md (16) | lg (20) | Basis |
|---|---|---|---|
| check | `M5 8.5 l2 2 4-5`, 1.5 stroke, round caps; geometry centred on (8, 8) | `M6.5 10.5 l2.5 2.5 4.5-6`, 1.5 stroke; centred on (10, 10) | Figma's 16px inspector check: 1.5px stroke, 6.5 × 6 path (`figma--checkbox-checked`); 1.5 is 3 device px at 2x. Was 1.15 at md, 1.48 at lg |
| dash | `M6 8h4`, 2 stroke: rows 7–8 solid, ink 5–11 | `M7 10h6`, 2 stroke: rows 9–10, ink 6–14 | An even bar in an even box centres on whole pixels at 1x and 2x (MOTION.md "Crispness" 5); was ink ≈ 6.7 × 1.15 |

Rasterised in Chromium (OffscreenCanvas, 2026-10-07): the md dash is two fully opaque rows at 1x
and four at 2x with only the round caps antialiased; the check's ink spans columns 4–11 and
rows 5–10, centred on the box.

**Verified** (`/checkbox.html`, Chromium, DPR 2): every mark's `::after` computes `inset: -1px`;
unchecked marks rest at `opacity: 0; scale: 0.6`, checked and indeterminate at `1 / 1`;
transitions read `scale 0.1s, opacity 0.1s cubic-bezier(0.16, 1, 0.3, 1)`; controls are 16 and
20px squares. A programmatic check starts colour transitions at 100ms and the mark's two at
100ms ease-out. Not verified by eye: the background tab does not repaint, so no screenshot of
the new mark was taken, and hover / press timing was read from the rules, not from a pointer.
Control positions on the docs page are fractional (x ≈ .28) from the specimen frame's centring;
Chromium snaps box edges and masks to device pixels, so the marks stay on the grid.

**Open questions.**
1. The dash is 2px where the check is 1.5px: the only crisp, centred bar in a 16 box at 1x is
   even. Recommendation: keep; the alternative is a 1px dash (crisp at 2x only) or a 1.5px dash
   (soft at both).
2. The check reads a little heavier than before (1.15 → 1.5 at md). Recommendation: keep
   Figma's 1.5; if it reads heavy beside 14px labels, 1px is the whole-pixel step down.

## Review note, 2026-10-21

- **What changed:** as Radio: a chosen card's edge is 2px vibrant blue, drawn inside (was 1px, darkened).
- **Why:** your picks on the state page (2026-10-21), now the defaults of the new state settings (Inspector: Stroke, Shadow, Fill).

## Feedback log

- 2026-10-21 · owner, the Theme setup's choices: "i want to separate the choices from the visual ... they should be
  consistent, cohesive, simple visuals that convey the choice well ... research and look into choice card ui, maybe the
  cards can have centered text" and an Appearance picker reference (soft grey cards, a centred window, the label under
  it, the chosen card ringed) → `layout="preview"` (Radix RadioCards, macOS Appearance, Untitled UI's theme cards): the
  card a soft `bg-subtle` ground with no edge at rest, the visual a frame at `--area-choice-ratio` (4 / 3), the label
  centred, the control hidden (the card is the indicator; keyboard and name stay native), the chosen card's selected
  stroke; a group lays previews in equal columns of `--area-choice-min` (104). choice.css, manifest, a gallery tile.

- 2026-09-28 · owner approved batch 14 → Complete.

- 2026-09-28 · owner: "the selected card stroke for radio and checkbox should just be darker not
  thicker than rest" → the chosen card keeps the 1px border and takes the checked colour; the
  1px inset ring that made it 2px is removed (Checkbox and Radio share `choice.css`).

- 2026-09-28 · owner: "look into checkbox card, maybe these layouts are better?" (three
  screenshots: a tile grid with the check in the corner; a plan list and a registration list
  with the control at the top end; chosen cards outlined 2px) → card rebuilt for Checkbox and,
  as the references are radio lists, added to Radio: control moved to the end (DOM order kept),
  12 to the content with the border counted once (shadcn 11), 1px `edge-control` at rest (was
  `border-decorative` #f3; shadcn ≈ #e3), hover `edge-control-hover`, chosen = 2px edge in the
  checked colour (border + 1px inset ring, neutral by default, accent by tone), focus ring on the
  card; `layout="tile"` stacks a 20px visual 16 above the label with the control in the corner
  and lays cards out in a grid (144 minimum columns); rows in a group stretch, 8 apart. Not
  adopted: tinting the label or the fill (foreground stays fixed; two of three references keep
  the fill white). Evidence: `shadcn--choice-card-radio-{0,1}` (ui.shadcn.com Field, Choice Card).

- 2026-09-28 · owner: "do whatever you think would be best, maybe dropping small?" → `size`
  is md (16) and lg (20); sm removed from the manifest, CSS, demos and docs, since with 14/20
  small-control text it differed from md only by a 4px gap. Notion and Figma ship one 16px size.

- 2026-09-26 · neutral-by-default sweep → `tone` axis, neutral checked face, accent
  override → `area--tone-accent`, `area--selected`.
- 2026-09-26 · cohesion audit → one glyph ladder 16 / 16 / 20 (was 16 at every tier) →
  `area--size-large` (20 × 20).
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → rest edge
  `edge-control` #e2e2e2 → `edge-control-hover` #d4d4d4, hover to `border-hover` #b4b4b4;
  radius gap recorded as open → `notion--checkbox--rest--light`,
  `notion--checkbox-checked--rest--light`, `figma--checkbox-checked--rest--light`,
  `area--size-medium`.
- 2026-09-27 · third pass → open question settled, value kept: radius stays `radius-small`;
  Layout / horizontal group tile added → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · owner flagged the invalid group → a checked option in an invalid group takes the danger fill, as a single invalid Checkbox does (`choice.css`); the group now reads as one error state → headless Chromium.
- 2026-09-30 · audit S5 (owner) → no Checkbox change; the #d4 glyph edge is now shared with the Slider thumb edge, and Switch's off track is #e2 (the peer row said #d4) → choice.css:48, slider.css:34.
- 2026-09-30 · audit S14 (owner) → the label gap is 6 at md and lg (was 8), from the density tokens (choice.css:9, :404, :410; density.ts:81-82); Radio and the choice labels follow.
- 2026-09-30 · audit S17 (API vocabulary, slice 1) → `onCheckedChange(checked, event)` added, as Switch; called after native `onChange` unless it calls `preventDefault` → forms.tsx:121.
- 2026-09-30 · audit C-20 (owner pick A) → the choice card keeps its own geometry (12 corner, 12 inset, #e2 edge), distinct from Card (24 corner, 16 inset, #ee edge + halo); recorded under Peers, no change → choice.css:99-110, surface.css:33-90.
- 2026-10-01 · compact pass round 5 → the 24px activation lane stays at compact (WCAG 2.5.8); type steps to 12/16, the 16px glyph stays. docs/research/compact-pass-2026-10-01.md.
- 2026-10-02 · compact pass round 9 → CheckboxGroup options read `ui-cluster` (8, compact 6) and `ui-stack` (6 / 4) as RadioGroup does; horizontal groups 16 → 12; the choice card inset 12 → 8 and the tile's icon gap 16 → 12 at compact (choice.css). Default unchanged. docs/research/compact-pass-2026-10-01.md (round 9).
- 2026-10-03 · radius audit D1 (owner) → the container role is 12 at compact too (was 8; Figma 13, Cursor 12-14), so this family's surface is 12 at both densities; rows concentric with a floating surface follow (compact 24 rows r8). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-03 · roundness → the box corner is a quarter of the box plus the roundness shift (16: 2 / 3 / 4 / 5 / 6), never past the small role (`choice.css:61`). `docs/research/radius-audit-2026-10-03.md`, "Roundness".
- 2026-10-03 · all even (owner) → the box corner is a quarter of the box rounded down to 2px: 16 and 20 → 4 (`choice.css:61`).
- 2026-10-03 · one corner setting (owner: one radius setting, Sharp and Pill as ends; "every control is a pill") → the box's own corner, a quarter of it at the default (unchanged), capped at 7/16 of the side so Pill leaves a rounded square (`choice.css`). `docs/research/radius-audit-2026-10-03.md`, "One corner setting".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → mark redrawn 1:1 on the 16 / 20 grid (check 1.5 stroke, dash 2px on whole rows); tick `scale` 0.6 → 1 + opacity on `fast` ease-out (was scale 0 on the spring); hover, press and keyboard checks land at once and fade out over `fast` (`choice.css`; "Motion and interaction, 2026-10-07").
- 2026-10-12 · owner, 2026-10-12: "go with your recommendations" (consistency pass) → the unchecked hover edge reads `edge-control-strong` (O5: one role for a literal written in several families; same paint). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · owner: type size and density as separate settings; every component sized from the text → the box reads `--area-mark-box`, 4 inside the UI line: 14 at type 12–13, 16 at 14, 18 at 15, 20 at 16 (`choice.css`; was 16 at every size). `docs/research/ui-size-scale-2026-10-12.md`.
- 2026-10-14 · all-axis audit → the box now follows the type size: `.area-checkbox--md` set a fixed 16 and overrode the 2026-10-12 base rule, so it stayed 16 at every type. md reads `--area-mark-box`, lg four larger (20 at type 14, as before); the check and dash drawings are no longer scaled with the box but drawn 1:1 and centred (`--_grid` 16 / 20), whole pixels in every even box → choice.css.
- 2026-10-21 · owner's picks on the state page (https://claude.ai/artifact/3uKMHRhpWnPqNA6pK4WfD9) and "capture some of these options as options for the design system customization … keep my current selections as the default" → as Radio: a chosen card's edge is `selected-width` (2) in the indicator rung, superseding 2026-09-28's "darker, not thicker". choice.css.

## Spacing audit (2026-10-17)

Group rhythm: a group's description and validation sit `ui-stack` (6, compact 4) from what's above, Field's label-control-message gap; validation was 12 and the description a fixed 6. Measured in `docs/research/spacing-2026-10-17/` (Before / After: https://claude.ai/artifact/JtDZ9LNfutFyfdkGUvQzL2).

## Review note, 2026-10-22 (round 68)

- **What changed:** a group's description sits 2 under its legend (was 6), exactly as a choice's own description sits under its title, and the options now start 12 below that text (was 6), one step more than the 8 between options (Compact: 8, was 4).
- **Why:** the gap and text pass across every family (your note: one intentional logic for the gaps between labels, titles and their copy). A title and the line under it now join with no gap everywhere, the rule you set on Card (Figma and Notion 11.5). Before, the same pair sat 10.5 to 20 apart depending on the family. DESIGN_SYSTEM.md, "Text pairs". Your follow-up: the description sat closer to the first option (6) than the options sit to each other (8), so the text read as a label for the first option only. Text that introduces a set now stands one step further from it than the items are apart. Radio's group changes the same way.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.
