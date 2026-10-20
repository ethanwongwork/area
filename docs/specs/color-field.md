# ColorField spec

**Captures:** `docs/research/captures/color-field/`
**Peers:** Input (the hex field), InputGroup and NumberField (split opacity), ColorSwatch
(preview), ColorPicker (value row), Field

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md), "Color picker, color
  field and swatches"):
  - [React Aria ColorSwatchPicker](https://react-aria.adobe.com/ColorSwatchPicker):
    labeled radio choices and separate selected/focus states. Area uses compact square
    cells, a legible selection ring and checkerboard transparency. ColorField inherits
    Input's typography and inset instead of introducing an unrelated monospace field.
  - *Color and alignment follow-up, 2026-09-24.* The earlier muted swatches were arbitrary
    demo hex values, not palette tokens. Color examples now use exact family-500 hex values
    from `packages/tokens/src/color/palette.json` (e.g. blue #006DF5, purple #8D4DF3, green
    #01AA4E). Alpha examples deliberately remain translucent. Swatches represent document
    color data and must not change with UI theme. The supplied Figma neutral values are
    retained only in the explicitly labeled split-field reference example. The palette
    source itself is unchanged.
  - ColorField `alpha` joins hex and a 0–100% opacity editor in one InputGroup shell; `name`
    submits one canonical hex value. `opacityLabel` names the separate control, and `groupLabel` ("Color and
    opacity" by default; 2026-10-19) names the group that holds both.
- 2026-09-26, second pass ("decide all open items"): soft fields are flat, so a soft
  ColorField (Input soft) loses its shadow; the alpha shell (InputGroup soft) already had
  none. The gallery gained a sizes tile.

## Job and boundaries

ColorField edits one hex colour as text beside a preview swatch; with `alpha` it adds an
opacity percentage in the same shell. It commits on Enter or blur, Escape restores, and
callbacks and form values are one canonical hex. Choosing among fixed colours is
ColorSwatchPicker; editing by area, tracks and channels is ColorPicker.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm, md (default), lg | Input tiers; widths scale with them | — |
| variant | outline (default), soft (passed to Input / InputGroup) | Soft for inspector rows | Figma fill row (fill-only) |
| boolean | alpha | Split opacity | Figma fill row, page colour row and value row |
| boolean | fullWidth | Layout | — |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Page colour row (swatch + hex + opacity, one trailing icon); fill row (two trailing icons); picker value row (hex + opacity) | figma.com editor inspector, read-only, 2026-09-26; ColorPicker pass | evidence only | `input-group/figma--color-row--rest--light`; `color-picker/figma--fill-row--rest--light`, `figma--format-row--rest--light` |
| react-aria | design system (docs) | ColorSwatchPicker / ColorField anatomy | react-aria.adobe.com (owner decision above) | Apache-2.0 | — |
| area | this system | Gallery tiles, re-taken after the second pass (sizes tile added) | localhost gallery | — | `color-field/area--*` |

Figma colour row (`figma--color-row` nodes 2–15): one fill 184 × 24, radius 5, rgb(245), no
border or shadow; 14px chit (radius 2, a 2px 10% inner edge layer) 5px in; hex from 24px,
105 wide; opacity 54 wide with a transparent 1px edge, input 7px in, "%" in a 14px box at 50%
black; no rule between hex and opacity. Fill row: the same parts in 156 wide (nodes 2–18).
Value row: hex 89 + 1px gap + opacity 54 = 144 (nodes 10–13). Notion and ChatGPT: no colour
field among their captures (searched every `notion--*` and `baseline/chatgpt--*` file).

## Anatomy

```
area (no alpha)  div.area-input.area-color-field  (Input shell, width by size)
  icon     span.area-input__icon > span.area-color-swatch--sm  16px, radius 4
  control  input.area-input__control  tabular numerals, maxLength 9, pattern
area (alpha)     div.area-input-group.area-color-field--alpha  (InputGroup shell)
  hex      .area-input (chrome stripped)
  opacity  .area-number-field.area-color-field__opacity  72 wide, unit "%", 1px decorative rule
  hidden   input[type=hidden][name]  canonical #RRGGBBAA
```

Swatch inset: Input icon rule, (32 − 16) / 2 = 8 from the outer edge (padding 7 + border 1).

## Measurements

From the capture nodes (the component is node 0 in each):

| property | default | alpha / split | sizes (sm) | disabled | figma · color-row |
|---|---|---|---|---|---|
| shell | Input 144 × 32, #fff, `shadow-1` | InputGroup soft 208 × 32, rgb(247), no shadow | Input 128 × 28 | Input 144 × 32, rgb(247), ink rgb(164) | 184 × 24, rgb(245), no shadow |
| swatch | 16 × 16 at x 8, radius 4, 22% ink hairline | 16 at x 8 | 16 at x 6 | 16 at x 8 (full colour) | 14 at x 5, radius 2 |
| hex input | x 32, 100.98 wide | x 32, 92.98 wide | x 26 | x 32 | x 24, 105 wide |
| opacity | — | 72 wide at x 135, "%" rgb(102) | — | — | 54 wide, "%" 50% black |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| width | 144 md (`96 + 48`), 128 sm, 160 lg (`color.css:106-108`) | Figma value fields 144 wide | Figma's inspector rows stretch (156, 184) |
| alpha width | + 48 (192 md); **opacity sized to its content**: 8 inset, three tabular digits (3ch), 4, "%", 8 inset (60 at 14px) (`color.css`) | Owner (2026-09-28: "the percentage fields … seem too large"); Figma opacity 54 with "%" in a box at the end (`input-group/figma--color-row`, live Page row) | Was a fixed 72, which left the hex 39px in a 146px Fill row, so every hex clipped |
| opacity · unit | **"%" anchored at the end; the number starts at the inset** in a fixed three-digit box | Owner (2026-09-28): Figma anchors "%" right in colour rows; its Opacity field keeps "%" after the number | A plain NumberField keeps its unit right after the number (Opacity) |
| hex · overflow | ellipsis at rest (full value while editing) | — | Digits are tabular; letter-heavy values such as DDDDDD (68px at 14) are wider than a narrow row |
| chrome | Input / InputGroup; soft is flat | Owner: inherits Input's typography and inset; second pass: soft fields are flat (Figma) | Figma 24px, radius 5 |
| swatch | ColorSwatch sm 16, radius 4, 8px inset | Input icon slot; Figma chit 14 at 5px | Area keeps its 16px icon slot |
| type | 14/20 Geist, tabular numerals | Owner: not a monospace field | Figma 11/16 450 |
| hex · display | `#RRGGBB`; with alpha, six digits without "#" and the alpha byte in the opacity field (`ColorField.tsx:36`) | Existing Area behaviour | Figma's values are redacted in the captures |
| divider | 1px gap of `bg-surface` at `stroke-width` (audit F-7 A; `stroke-width` since the 2026-10-12 consistency pass, as every Input group seam) | Peer: InputGroup rule; Figma value row 1px gap | Figma's colour row draws a gap, not a rule; kept: two fields in one group, the gap marks where each edits |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover, focus | Input / InputGroup states | [input.md](input.md#states), [input-group.md](input-group.md#states) |
| invalid draft | Input invalid paint while the draft does not parse; reverts on commit | `ColorField.tsx:39, 77` |
| disabled | Input field paint; the swatch keeps its colour (document data) | `area--disabled` |

## Behavior and accessibility

The hex input forwards its ref and native props (`ColorField.tsx:67-79`). Accepts 3, 4, 6 or
8 digits with or without "#". A commit calls `onValueChange(value, event)`. The opacity NumberField is named by `opacityLabel`; with
`alpha`, `name` submits through a hidden input. Form reset restores `defaultValue`.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Input | leading visual | 16px slot, 8px inset | swatch in that slot | match |
| InputGroup | segment rule | decorative 1px | same (duplicated at `color.css:112`) | match |
| Input, InputGroup | soft shadow | none | none in both shells | match |
| ColorPicker | value row | InputGroup soft sm, surface divider | decorative divider | differs; noted in [color-picker.md](color-picker.md) |
| ColorSwatch | preview | theme-independent colour over a checker | same component | match |

## Visual pass

2026-09-28, owner feedback and Claude in Chrome (batch 9): Figma's Page colour row live (hex, then
"100" 8 after the rule and "%" at the end) beside the gallery's Fill rows and alpha tile at 2x. The
opacity part now hugs "100 %", "%" ends on the inset, and every Fill row shows its full hex (real
text 57-59px; the rows had 39-51). Measured across the gallery: no Color field hex, NumberField or
Select text overflows its box. Dark theme not compared.

Earlier note:

The gallery shows ColorField's tiles in named groups; the sizes tile is new.
Unverified: Figma side by side at the same zoom, dark theme.

## Settled questions

1. *Hex / opacity rule: kept.* Figma's colour and fill rows draw no rule between hex and
   opacity (`input-group/figma--color-row` nodes 2, 12); only the picker's value row shows a
   1px gap. Two fields in one group; the rule marks where each edits (shared with
   [input-group.md](input-group.md#settled-questions) 2; [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)).

## Verification

Compared the Area captures (`color-field/area--*`) with `input-group/figma--color-row`,
`color-picker/figma--fill-row` and `figma--format-row`. Build and test results are in the
[cohesion audit](../research/cohesion-audit.md#verification).

## Motion and interaction, 2026-10-07

Per `docs/MOTION.md`. Color field is an Input (hex) or an Input group (hex and opacity), so it
takes their motion: hover and focus edge and the focus halo in at once, out on `fast` / `ease-out`;
tones land at once (was: `fast` in and out, halo faded in). The swatch in the leading slot is static.
No change in the Color field rules of `color.css`.

## Review note, 2026-10-12 (swatch ring)

- **What changed:** its swatch takes the new translucent outline (from Color swatch); nothing else changed.
- **Why:** you asked why the swatch's outline only showed at its corners, then said to apply the fix: the outline is now
  a light translucent line drawn over the colour, so it shows evenly all the way round on every colour.

## Feedback log

- 2026-09-26 · cohesion audit → no change; spec written → `color-field/area--*`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → soft ColorField is
  flat; sizes tile added; one open question recorded → `input-group/figma--color-row`,
  `color-field/area--sizes`, `area--alpha`.
- 2026-09-27 · third pass → open question settled, value kept: the hex / opacity rule stays
  → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-28 · owner: percentage fields too large, anchor "%" right as Figma's colour rows do, truncation
  in this batch → opacity sized to its content with "%" at the end; hex ellipsis at rest → every
  gallery Color field measured, no hex clipped; Figma Page row compared live.
- 2026-09-28 · owner: approved (batch 9).
- 2026-09-30 · audit S17 (owner: normalise the API vocabulary) → `onValueChange(value, event)` passes the committing event.
- 2026-10-04 · quality pass after the one corner setting → the swatch is its own corner but never rounder than concentric with the field, floored (`color.css`; was 6 inside a 16 field 12 in, at 14). `docs/research/radius-audit-2026-10-03.md`, "Quality pass".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → the hex field and group take Input's and Input group's in-at-once, out-on-fast motion. See "Motion and interaction, 2026-10-07".
- 2026-10-12 · owner, review round 16: approved.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → the opacity seam is at `stroke-width`, as every Input group seam (was `border-width`, which Elevated sets to 0) (color.css). (docs/research/consistency-audit-2026-10-12.md)

## Review note, 2026-10-19 (round 56)

- **What changed:** its swatches show the thin translucent ring again (black 10% in light, white 10% in dark), solid colours included.
- **Why:** Color swatch's colour layer had been painting over its ring since a 2026-10-12 merge, so no swatch showed its outline; the fix is in Color swatch (docs/specs/color-swatch.md, round 56), and every family that draws one shows it.
