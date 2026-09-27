# Checkbox spec

**Status:** in review · 2026-09-26 (cohesion audit, second pass)
**Captures:** `docs/research/captures/checkbox/` (Area, Notion, Figma)
**Peers:** Radio (same glyph ladder and paint), Switch (on/off setting), Chip (selectable
filter), Field and CheckboxGroup (label and validation), Table (row selection)

## Owner decisions

- 2026-09-26: **Neutral by default, accent by override** (DESIGN_SYSTEM.md, "Color and
  focus"). The checked face is `neutral-solid` with `fg-on-neutral`; `tone="accent"` opts
  into the accent. Recorded with the Alignment picker's decisions ([alignment-picker.md](alignment-picker.md)):
  "Checkbox, Radio and Chip moved the same way (neutral-solid checked face; neutral tonal
  chip selection); all four await owner review."
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
| size | sm, md (default), lg | Label type follows the control tier; lg is the 20px glyph | Untitled sm 16 / md 20; Notion and Figma one size, 16 |
| tone | neutral (default), accent | Owner rule, 2026-09-26 | Notion checks in its blue; Figma checks neutral |
| variant | card | A contained option with its own caption and visual | Area composition (gallery `card`) |
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
  control  input.area-checkbox__control  --_size square, 1px edge, radius min(small, size/4), shadow-1
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
| rest fill | #fff, `shadow-1` | none (row ground) | #f5 |
| checked fill / edge | rgb(40) / rgb(40) | rgb(39, 131, 222) / none | #f5 / 20% black |
| checked mark | rgb(250), 1.75 stroke | white filled check, 9.17 × 9.14 | 90% black stroked check, 6.5 × 6 |
| accent fill / mark | rgb(92, 93, 254) / #fff | — | — |
| invalid edge; checked | rgb(207, 3, 60); fill rgb(232, 9, 69), mark #fff | — | — |
| label type | 12/16 · 14/20 · 14/20, 400 | not in capture | 11/16, 450 |
| row / gap | min 24; gap 4 / 8 / 8 | — | 24; label column at the box edge |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| control · size | **16 / 16 / 20** (`space-16`, `space-20`; choice.css:315-330) | Notion and Figma 16; Untitled sm 16, md 20; audit rule "one glyph ladder" | lg takes Untitled's 20 |
| control · radius | min(`radius-small` 6, size / 4): 4 / 4 / 5 (choice.css:67) | Untitled 4 at 16 | Notion 3 and Figma 2 are squarer; kept (third pass), see below |
| control · rest edge | **`edge-control-hover` #d4d4d4** (choice.css:55) | Notion 19% warm ≈ #d4, Untitled #d4d4d4 (second pass) | Was `edge-control` #e2e2e2, a field's edge, faint on a 16px box |
| control · checked | `neutral-solid` #282828, mark `fg-on-neutral` #fafafa | Owner 2026-09-26 | Notion fills its blue; Figma keeps a light face with a dark check. Accent as `tone="accent"` (choice.css:29-35) |
| mark · geometry | 1.75 stroke on a 16 viewBox, masked at 75% of the padding box (choice.css:132-140) | — | Derived: Notion's filled glyph is 9.17px, Figma's stroked path 6.5px, Untitled's check 12px |
| control · shadow | `shadow-1` (0 0.5px 1px −0.5px, 6%) | In-flow control elevation (DESIGN_SYSTEM.md) | Neither product nor Untitled has one |
| gap | `gap-sm` 4 / `gap-md` 8 / `gap-lg` 8 | Control tier | Untitled 8 / 12 |
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
| hover, checked | fill → `neutral-solid-hover` #1d1d1d (choice.css:178-183); mark fixed | not captured |
| focus-visible | 2px `focus-color` outline, 2px offset (choice.css:200-204) | not captured |
| checked / indeterminate | fill and edge `neutral-solid`, mark scales 0 → 1 (`ease-spring`, 100ms) | `area--selected`, `area--partial` |
| invalid | edge and label `fg-danger-vivid`; checked becomes one danger fill | `area--invalid`, `area--invalid-selected` |
| disabled | whole label 50% | `area--disabled*` (opacity 0.5) |

## Behavior and accessibility

Native `input type="checkbox"` inside its `label`; `indeterminate` is set on the DOM node
and mirrored as `data-indeterminate` (forms.tsx:126-150). Caption is wired through
`aria-describedby`; `invalid` sets `aria-invalid`. CheckboxGroup is a native `fieldset` with
`legend` (forms.tsx:188-203). choice.css has no forced-colors rule (the mark is a mask
painted `--_mark`); forced colours are unverified. The mark transition uses
`duration-fast`, which the motion axis zeroes. Notion and Figma also keep a native input
(opacity 0) over a drawn face.

## Peers and consistency

| Peer | Shared role | Area value in peer | Checkbox | Match / reason |
|---|---|---|---|---|
| Radio | glyph ladder, rest edge | 16 / 16 / 20, #d4d4d4 | same | match (shared choice.css) |
| Radio, Switch, Slider | checked / on paint | `neutral-solid` | same | match (owner rule) |
| Switch, Radio, Button | disabled | 50% whole control | same | match (audit rule) |
| Input | rest edge | `edge-control` #e2e2e2 | #d4d4d4 | differs by design: a 16px glyph needs a firmer edge than a 32px field |
| Switch | off fill | `fill-toggle` #d4d4d4 | edge #d4d4d4 | same grey for an off glyph |
| Switch | row type | 14/20 label, 12/16 description | same | match |
| Table | selection column | Checkbox md | — | Table composes this component |

## Visual pass

The gallery shows the tiles in groups (Default, Tones, Sizes,
Content, States, Layout; Layout now includes the horizontal group). Against the products at 16px: Area's edge now reads as firm as
Notion's; its checked face is darker than either product by the owner's neutral rule.
Unverified: dark theme, hover and focus on screen.

## Verification

Area tiles are being re-captured after the second pass (`area--*`); the rest-edge value
above is from `area--size-medium` (edge rgb(212)). Build and test results are in the
[cohesion audit](../research/cohesion-audit.md#verification).

## Feedback log

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
