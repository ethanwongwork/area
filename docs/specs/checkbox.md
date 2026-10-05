# Checkbox spec

**Status:** accepted · 2026-09-28 (batch 14: cards, sm removed; was: in review · 2026-09-26 (cohesion audit, second pass))
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
| variant | card | A contained option: visual, text, control at the end; the chosen card's 1px edge darkens to the checked colour | Owner references (2026-09-28); shadcn Choice Card (`shadcn--choice-card-radio-*`) |
| layout (card) | row (default), tile | Row: one line; tile: a 20px visual above the label, control in the corner, cards in a grid | Owner reference 1 (tile grid); references 2, 3 and shadcn (rows) |
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
    ::after  mask of the check (or dash) at 75% of the box, painted --_mark
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
| mark · geometry | 1.75 stroke on a 16 viewBox, masked at 75% of the padding box (choice.css:132-140) | — | Derived: Notion's filled glyph is 9.17px, Figma's stroked path 6.5px, Untitled's check 12px |
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
| checked / indeterminate | fill and edge `selection-solid`, mark scales 0 → 1 (`ease-spring`, 100ms) | `area--selected`, `area--partial` |
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

## Feedback log

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
