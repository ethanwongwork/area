# NumberField spec

**Status:** in review · 2026-09-26 (cohesion audit; second pass with Notion and Figma)
**Captures:** `docs/research/captures/number-field/`
**Peers:** Input (field chrome), InputGroup (paired and unit compositions), ColorField and
ColorPicker (opacity and channel fields), Panel (inspector rows), Field

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md), "Inspector references
  and density"; this is its home, and [input-group.md](input-group.md) refers here):

  Images 1–6 were supplied by the owner in an earlier session; they are not stored in the
  repository.

  - **Images 1 and 2:** floating rounded containers, grouped command buttons, soft paired
    fields, small section gaps and selective emphasis. Reuse Panel, Button, Avatar and
    Segmented, then add toolbar/group behavior and numeric field composition.
  - **Image 3:** shadow parameters, a color-plus-alpha row, layout direction, nine-point
    alignment and editable fill/stroke lists. These are combinations of a few reusable
    controls, not a separate Input variant for each design property. Its decorative
    outer frames are reference styling, not necessary component anatomy.
  - **Images 4 and 5:** repeated field widths, aligned label rows, shared control heights,
    section separators and trailing actions. The nine-point picker spans more than one
    row because it edits two axes. Expanded corner fields are a linked value group.
  - **Image 6:** a composed color editor with a two-dimensional area, hue and alpha sliders,
    format selection, channel inputs and an eyedropper. Build those parts independently
    so simpler color popovers can omit channels they do not need.

  *Density and size.* Treat the reference inspector as a **compact UI scope** in Area. Keep
  most fields at size md and let data-area-ui=compact select 28px controls with 13/18px type;
  default md is 32px with 14/20px type. Use sm selectively for secondary header actions or
  tight metadata. Do not shrink every control independently or scale the interface with a
  CSS transform. Panel inset size is a separate layout choice and does not resize its
  children.

  This is an Area implementation recommendation, not a claim about Figma's private
  component API. Screenshot pixels cannot establish CSS dimensions without knowing zoom
  and device scale. The repeated rows suggest a coordinated density system, while the
  larger pickers and mixed fields reflect function. [Spectrum's platform scale](https://spectrum.adobe.com/page/platform-scale/)
  also treats coordinated sizing as a system concern. Small visible icons still need
  usable focus and pointer targets.

  *Framer inspector reference.* Framer's public [Property Controls guide](https://www.framer.com/developers/property-controls)
  describes a right-side properties panel with typed editors. Its Number control can show
  a range slider or steppers and accepts bounds, units and step; Padding and BorderRadius
  switch between one value and four separate values. Color is its own control. This
  supports Area's current split between NumberField, color controls, and inspector recipes
  for linked values. A sizing-mode picker belongs beside a numeric field in a recipe, not
  inside every Input.

  Framer's [plugin interface guide](https://www.framer.com/developers/interface) says
  plugins receive basic styles for semantic inputs and buttons, but Framer does not publish
  an official reusable component set there. The [June 2026 developer changelog](https://www.framer.com/developers/changelog)
  also records refreshed input styles for Framer 3.0. These sources establish control
  types and composition, not stable editor dimensions, tokens or interaction details.
  Keep Area's own density, contrast and keyboard contracts; avoid inferring pixel values
  from Framer screenshots.

  *Other references reviewed, 2026-09-24.* [Geist Avatar](https://vercel.com/geist/avatar) and
  [Notion editing guidance](https://www.notion.com/help/writing-and-editing-basics) were
  reviewed for adjacent-control sizing and contextual actions. Neither establishes
  private editor CSS measurements. The Framer findings above remain the reference for
  inspector composition and conditional property controls. Exact Figma/Notion/Framer
  internal tokens remain unverified; no private source implementation is claimed.
- 2026-09-26, second pass ("decide all open items"): NumberField gains `prefix`, a short
  leading label (X, W, a glyph) as Figma's inspector fields show; with `scrub` it is the drag
  handle. Soft fields are flat (fill, no shadow). Control height unchanged (item 18).

## Job and boundaries

NumberField edits one number as text (`role="spinbutton"`), with an optional prefix, unit,
stacked steppers, a scrub handle and arithmetic entry (`24*2`, `+8`) committed on Enter or
blur. Paired values in one shell are InputGroup; a range is Slider; colour channels reuse it.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | outline (default), soft | As Input | Figma inspector fields are fill-only (soft) |
| size | sm, md (default), lg | Control tiers | Figma 24 |
| composition | prefix, unit, steppers, scrub, mixed | Figma letter prefixes, units and scrub labels; Framer Number steppers | Figma X/Y/W/H and opacity fields; Framer (owner reference above) |
| state | read-only, disabled, invalid, success, warning, scrubbing | Native and validation | — |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Inspector transform field (letter prefix + value); opacity and channel fields | figma.com editor inspector, read-only, 2026-09-26; ColorPicker pass | evidence only | `number-field/figma--number-field--rest--light`; `input-group/figma--icon-field--rest--light`; `color-picker/figma--fill-row--rest--light`, `figma--format-row--rest--light` |
| area | this system | Gallery tiles, re-taken after the second pass (prefix and sizes tiles added) | localhost gallery | — | `number-field/area--*` |

Figma transform field (`figma--number-field` nodes 0–4): 88 × 24, radius 5, fill rgb(245),
no border (a transparent 1px outline at −1 for focus), no shadow. Prefix box 24 × 24 (= the
row height) at the start, `cursor: ew-resize` (it is the scrub handle); the box's ink is 50%
black, the letter's own span 89.8%. The value input follows at x 24 with 8px end padding,
11/16 450. Opacity field (`figma--color-row` nodes 12–15): "%" in a 14px box at 50% black.
ChatGPT and Notion: no numeric field among their captures (searched every `notion--*` and
`baseline/chatgpt--*` file). Untitled UI has none ([reference](../research/untitled-ui-reference.md)).

## Anatomy

```
area   span.area-number-field  (shell: as Input; padding by inset.css)
  scrub     span.area-number-field__scrub   16px box: the prefix or the grip, fg-muted; ew-resize with scrub, default cursor without (data-static)
  control   input[role=spinbutton]          block-size 100%
  unit      span.area-number-field__unit    fg-muted (fg-disabled when disabled), aria-hidden
  steppers  span.area-number-field__steppers  (H − 6) wide, 1px start rule, flush to the end
    step    button × 2                      12px chevrons, 1px rule between
```

Insets: text (32 − 9.94) / 2 − 1 = 10.03; prefix or grip box (32 − 16) / 2 − 1 = 7 (8 from the
outer edge); with steppers the end padding is 0 (`number-field.css:38`).

## Measurements

`node scripts/capture-compare.mjs --slots shell` (trimmed; Area widths are the tile's):

| slot · property | area · default | area · prefix | area · soft | area · steppers | area · disabled | figma · number-field |
|---|---|---|---|---|---|---|
| **shell** size | 256 × 32 | 100 × 32 | 256 × 32 | 256 × 32 | 256 × 32 | 88 × 24 |
| **shell** padding | 0 10.03 0 10.03 | 0 10.03 0 7 | 0 10.03 0 10.03 | 0 0 0 10.03 | 0 10.03 0 10.03 | 0 |
| **shell** border | 1 solid color(srgb 0.886275 …) | 1 solid rgba(0, 0, 0, 0) | 1 solid rgba(0, 0, 0, 0) | 1 solid color(srgb 0.886275 …) | 1 solid rgb(226, 226, 226) | 0 |
| **shell** radius | 8px | 8px | 8px | 8px | 8px | 5px |
| **shell** color | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(164, 164, 164) | rgba(0, 0, 0, 0.898) |
| **shell** background | rgb(255, 255, 255) | rgb(247, 247, 247) | rgb(247, 247, 247) | rgb(255, 255, 255) | rgb(247, 247, 247) | rgb(245, 245, 245) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px | — | — | same as default | same as default | — |

`area--prefix` nodes 1–2: prefix box 16 × 16 at x 8, ink rgb(102); value from x 32. The
disabled unit inherits rgb(164). `area--steppers`: column 26 × 30, 12px chevrons in rgb(102).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| shell · chrome | Input's (32, radius 8, `input-edge`, `shadow-1`); soft #f7 with no shadow (`number-field.css:32`) | Peer: [Input](input.md); second pass: soft is flat (Figma) | Figma 24px, radius 5: density is the UI-scale axis (owner decision above) |
| prefix | text or glyph in the 16px scrub box, `fg-muted`, control text size (`number-field.css:87-88`; `NumberField.tsx:155-158`) | Figma letter prefix in a row-height box that is also the scrub handle | Area keeps the 16px icon box and 8px gap, so the value lands at 32 (Figma 24 at 24px). Letter ink kept `fg-muted` (third pass): the prefix names the value, it is not the value |
| unit | `fg-muted` text after the value; `fg-disabled` when disabled (`number-field.css:72-73`) | Figma "%" at 50% ink | — |
| steppers | stacked, (H − 6) wide, 12px chevrons, flush with 1px rules | Framer Number steppers (owner reference) | Figma shows none |
| stepper hover | whole column `bg-component-hover` | Audit row-plate rule | — |
| stepper disabled | opacity 0.5 (`number-field.css:118`) | Audit "Disabled": controls dim to 50% | Was 0.4 |
| field disabled | field paint, no opacity | Audit "Disabled" (text fields) | — |
| scrub | 8px per step, Shift × 10, Alt × 0.1 (`NumberField.tsx:116-131`) on the prefix or grip | Figma scrubs on its prefix box (`figma--number-field` node 1) | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover | border → `border-subtle` #d4d4d4 | `number-field.css:40` |
| focus-within | field focus edge + 2px halo (validation tones repaint both) | `number-field.css:41-56`; Notion fields use a 2px blue ring; neutral kept ([input.md](input.md#settled-questions) 1) |
| read-only | fill #f7; steppers disabled | `area--read-only` |
| disabled | field paint, unit in disabled ink; steppers 50% | `area--disabled` (no steppers in the tile) |
| invalid | set on a failed parse; sr-only "Enter a valid number or calculation" | `NumberField.tsx:170` |
| scrubbing | `cursor: ew-resize` on the shell | `number-field.css:59` |

## Behavior and accessibility

Text input with `role="spinbutton"`, `aria-valuenow/min/max`, `aria-valuetext` with the unit
or "Mixed values". Arrow keys step (Shift × 10, Alt × 0.1), Home/End go to bounds, Enter
commits, Escape restores. The prefix is `aria-hidden`: name the input with `aria-label` or a
Field. Step buttons are named "Increase/Decrease <label>". `name` submits through a hidden
input; form reset restores `defaultValue`.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Input, Select, Textarea | field chrome, disabled paint | field paint, flat soft | same | match |
| Button, Switch, Checkbox | disabled control | 50% | steppers 50% | match |
| Input | affix / unit ink | `fg-muted` | `fg-muted` | match |
| InputGroup | letter visual before a value | H-wide box, `fg-muted` | 16px box, `fg-muted` | value at 32–33 in both |

## Visual pass

The gallery shows the tiles in named groups; prefix and sizes tiles were added. Unverified: disabled steppers on screen, Figma side by side at one zoom, dark theme.

## Settled questions

1. *Prefix ink: kept `fg-muted`.* Figma's letter is 89.8% black inside a 50% box
   (`figma--number-field` nodes 1–2); Area's prefix stays muted, like Input's affixes. The
   prefix names the value; it is not the value ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)).

## Verification

Compared `number-field/area--*` with the Figma captures in Sources. Build and test results
are in the [cohesion audit](../research/cohesion-audit.md#verification).

## Feedback log

- 2026-09-26 · cohesion audit → disabled steppers 0.4 → 0.5 opacity → `number-field.css:118`
  (no capture shows a disabled stepper).
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → `prefix` prop (the
  scrub box, static without `scrub`); soft variant flat; one open question recorded →
  `number-field/figma--number-field`, `area--prefix`, `area--soft`.
- 2026-09-27 · third pass → open question settled, value kept: prefix ink `fg-muted` →
  [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
