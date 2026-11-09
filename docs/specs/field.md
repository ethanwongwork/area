# Field spec

**Captures:** `docs/research/captures/field/`
**Peers:** Input, Textarea, Select, NumberField, ColorField (child controls), CheckboxGroup
(group label and validation), Panel (inspector rows)

## Owner decisions

- Before 2026-09-24: the Input and Field confirmation pass (owner-confirmed complete) is
  recorded verbatim in [input.md](input.md#owner-decisions); it covers Field's label,
  description, validation, required and disabled relationships.
- 2026-09-26, second pass ("decide all open items"), Panel: section headings are UI text in
  the default ink over muted field labels, and every field label inside a Panel is muted,
  stacked or beside its control (`panel.css:147`).

- 2026-10-21 (owner: "build proposals 1–4"): `characterCount` shows "12 / 320" against the control's maxLength at the end of the line under it, in the description's text and ink; it shares the description's line, default ink at the limit (never an error colour), joined to aria-describedby. A Field with a contained control hugs it so the count ends where the control ends.

## Job and boundaries

Field labels and describes exactly one direct form control and carries its validation
message. It wires `id`, `aria-labelledby`, `aria-describedby`, `aria-errormessage`,
`aria-invalid`, `required` and `disabled` onto the child (`Field.tsx:95-111`). It has no size
of its own: the child owns the control tier. Groups of choices use CheckboxGroup or
RadioGroup; several values in one shell use InputGroup.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| orientation | vertical (default), horizontal | Stacked form; label beside the control in a settings or inspector row | UUI (stacked); Figma inspector rows (label beside) |
| composition | description, validation (error, success, warning), required mark, visually hidden label, character count | Guidance, correction, required fact; a limit (owner 2026-10-21) | UUI label + hint; count: Polaris showCharacterCount, Carbon, MUI, ChatGPT's custom instructions, the owner's text-field reference "0 / 320" |
| state | disabled | Keeps guidance readable | UUI |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system (source) | Label and hint | [Untitled UI reference](../research/untitled-ui-reference.md):45, pinned `4702dc0` | MIT | — |
| notion | target product | Share popover: an unlabelled field and a section label | app.notion.com Share popover, read-only, 2026-09-26 | evidence only | `input/notion--field--focus--light`, `popover/notion--share-popover--open--light` |
| figma | target product | Inspector section title and header over its field rows; unit and prefix labels | figma.com editor inspector, read-only, 2026-09-26 | evidence only | `panel/figma--section-title--rest--light`, `panel/figma--section-header--rest--light`, `input-group/figma--color-row--rest--light`, `number-field/figma--number-field--rest--light` |
| area | this system | Gallery tiles, re-taken after the second pass | localhost gallery | — | `field/area--*` |

No product form label (a label bound to a control) was captured: Notion's Share field is
named by its placeholder, and Figma's inspector rows are named by section titles and in-field
prefixes. What the captures show:
- Figma section title (`figma--section-title` nodes 0–2): 40px row, 16px sides, 11/16 **550**
  at rgba(0,0,0,.898), over rows whose unit labels are 50% ink (`figma--color-row` node 15).
- Notion Share popover section label (`notion--share-popover` node 19): 12/16 500
  rgb(125,122,117), 8px sides, above a list rather than a field.
- ChatGPT settings row (`baseline/chatgpt--settings-card` nodes 1–7): label 14/20 **500**
  rgb(13) with a 12/16 rgb(93) description 2px below, the control 24px to the side.

## Anatomy

```
area   div.area-field  flex column, gap 6 (horizontal: grid, label column + control column, gap 8)
  label        label.area-field__label   14/20 400 fg-default (horizontal: fg-muted)
    required   span.area-field__required  "*" aria-hidden, danger ink
  control      the child (Input, Select, …)
  description  span.area-field__description  12/16 fg-muted
  validation   span.area-field__validation   12/16, tone ink
```

Vertical rhythm (`area--description-error`): label 0–20, control 26–58, description 64–80,
validation 86–102: one 6px gap between every part (`field.css:12`).

## Measurements

`node scripts/capture-compare.mjs --slots shell` (Area, shell = the Field; widths are the tile's):

| slot · property | area · default | area · description-error | area · horizontal | area · disabled | area · size-small | area · size-large |
|---|---|---|---|---|---|---|
| **shell** size | 256 × 58 | 256 × 102 | 260 × 32 | 256 × 80 | 256 × 54 | 256 × 66 |
| **shell** display / direction | flex column | flex column | grid column | flex column | flex column | flex column |
| **shell** gap (row / column) | 6px / 6px | 6px / 6px | 8px / 8px | 6px / 6px | 6px / 6px | 6px / 6px |

Nodes: label 14/20, ink rgb(40) (horizontal and disabled rgb(102)); required mark
rgb(207, 3, 60); description 12/16 rgb(102); validation 12/16 in rgb(207, 3, 60) (error),
rgb(0, 119, 52) (success), rgb(164, 79, 0) (warning) (`area--description-error`,
`area--success`, `area--warning`).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| gap (label, control, message) | 6 (`space-6`) | UUI 6px between label, control and hint (confirmed in the audit) | — |
| label · type | 14/20 **400** `fg-default` | Type rule: 500 only for labels on fills (DESIGN_SYSTEM "Color and focus") | UUI 500 neutral-700 |
| description · type | 12/16 `fg-muted` (`text-xs`, field.css:35-39; was `control-sm-text`, now 14) | UUI hint 12/18 at sm | UUI 14/20 at md; Area keeps supporting text one step below the control |
| validation · ink | `fg-danger-vivid` / `fg-success-vivid` / `fg-warning-vivid` | Semantic tone roles | UUI turns only the hint red |
| required mark | `field-error-color`, aria-hidden | UUI mark (brand, red when invalid) | Neutral-by-default does not apply: required is a warning cue, not selection |
| horizontal · columns | label max-content + control `input-inline-size`, gap 8; in a Panel 1fr / 1.5fr | Contained width rule; Figma inspector rows | — |
| horizontal · label ink | `fg-muted` | Figma inspector: labels secondary to values (50% unit ink, `figma--color-row` node 15) | — |
| label in a Panel | `fg-muted`, stacked or horizontal (`panel.css:147`) | Second pass: the Panel heading (default ink, 14/20) outranks muted labels, as Figma's section title does | Figma's heading is 550; Area keeps 400 (type rule) |
| disabled · label | `fg-muted`; description and messages unchanged | "Keep instructions readable" (`field.css:54-57`) | UUI dims all to 50% |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| focus | owned by the child (field focus edge + halo) | [input.md](input.md#states) |
| invalid / success / warning | message in tone ink; child gets `data-validation-status` | `area--error`, `area--success`, `area--warning` |
| disabled | label → `fg-muted`; child uses its own disabled paint | `area--disabled` |
| in a Panel | label → `fg-muted` at rest | `panel.css:147` |

## Behavior and accessibility

One direct control; the label is a native `<label for>` and also `aria-labelledby`.
Description and validation ids merge into `aria-describedby`; an error sets
`aria-errormessage` and `aria-invalid`. `validation` without `validationStatus` is an error;
pass `"success"` or `"warning"` for the others. Help text belongs in `description`. `visuallyHiddenLabel` keeps the name. Multiple React
roots need an `identifierPrefix` (`Field.tsx:55-59`). When the control is an InputGroup, the
group takes Field's `disabled` and validation and passes them to the Input, NumberField and Select
inside it ([input-group.md](input-group.md#behavior-and-accessibility)), so a Field can disable or
invalidate a group.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| CheckboxGroup, RadioGroup | group label and validation | 14/20 label, 12/16 message | same | match |
| Input, Select, Textarea, NumberField | disabled | field paint | Field only mutes its label | match: the control owns disabled paint |
| Panel | inspector row | 1fr / 1.5fr columns; muted labels under a default-ink heading | `field.css:74-81`, `panel.css:147` | match |

## Settled questions

1. *Horizontal label: kept at 400 `fg-muted`.* ChatGPT's settings row labels its control in
   14/20 500 default ink with a 2px gap to the description; Area's horizontal label stays
   400 `fg-muted` (`field.css:83-87`) with 6px gaps: one label weight, and Figma's inspector
   labels are muted ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)). No Figma form label was captured to confirm the muted ink
   directly.

## Visual pass

The gallery shows Field's tiles in named groups, one variant per tile.
Unverified: dark theme.

2026-09-28 (batch 13, Claude in Chrome): beside ChatGPT's settings row (label 14/20 500,
description 12/16 rgb(93) 2 below, control at the end, 24 apart) and its stacked field (label,
8, a 38 control). Area's stacked Field keeps 6 between label, control and message (UUI) and the
400 label (type rule); its description matches ChatGPT's 12/16 muted. No change. Capture: `chatgpt--settings-row--rest--light`.

## Verification

Compared the Area captures (`field/area--*`) with the Notion and Figma captures in Sources.
Build and test results are in the
[cohesion audit](../research/cohesion-audit.md#verification).

## Motion and interaction, 2026-10-07

Per `docs/MOTION.md`. Field has no interactive paint of its own: the label, description and
validation message appear and change at once (no fade, no height animation), and the control's edge,
halo and tones follow its own motion (Input, Textarea, NumberField, Input group, same date). Before →
after: unchanged; nothing in `field.css` moves. Crispness: the label's first-line drop beside a
Textarea is already `round()`ed; no transforms. Open question: none.

## Feedback log

- 2026-10-27 · owner: "seems like there is somewhat of a balance of inputs/controls below the label and some all in the same row. can there be more logic around that" → `orientation="auto"`: a wrapping row, the control beside its label while it fits there at its natural width (max-content), under it when not; in a Panel the label keeps the horizontal row's 40% column. It follows the panel's width, the type size and the control's content, never its value. The Inspector's Segmented rows use it (Type's five sizes now fit beside; Density, Selected tint, Focus ring and Feedback go under).
- 2026-10-27 · owner: "hide the captions behind a small info button with tooltip" → `labelAction`: a slot after the `<label>`, label and action in `.area-field__head` (flex, 4 apart), so a Toggletip's name stays out of the control's (Toggletip spec, open question 1). The Inspector's dimmed rows use it.
- 2026-10-27 · owner: "rows 8 apart" → a horizontal Field in a panel is as tall as its control (floor `control-sm`), so the panel's 8 gap is the space between controls, as Figma's inspector; was the panel's md row (30), which left the Inspector's sm controls 12 apart (field.css). Back in review.
- 2026-09-26 · cohesion audit → no change (6px label-to-control gap confirmed against Untitled
  UI) → `area--default`, `area--description-error`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → Field unchanged;
  labels inside a Panel are muted under a default-ink heading (Panel rule) →
  `panel/figma--section-title`, `input-group/figma--color-row`, `popover/notion--share-popover`.
- 2026-09-27 · third pass → open question settled, value kept: horizontal label 400
  `fg-muted` → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → docstring clarified: `validation` without `validationStatus` is an error (`aria-invalid`, `aria-errormessage`); help text belongs in `description` (Field.tsx:31-36; it used to call `validation` "non-error"). Behaviour unchanged.
- 2026-10-01 · audit B-14 → a Field around an InputGroup disables and invalidates the controls inside it: the group takes `disabled` and validation and passes them on through `InputGroupContext` → InputGroup.tsx, input-group-context.ts.
- 2026-10-01 · compact pass round 5 → the label-to-control gap reads `ui-stack` (6, compact 4) and a horizontal Field's gap `ui-cluster` (8, compact 6). Default unchanged. docs/research/compact-pass-2026-10-01.md.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → Field has no motion of its own; its controls carry it (no change to `field.css`). See "Motion and interaction, 2026-10-07".

## Review note, 2026-10-21

- **What changed:** a Field can show a character count, "12 / 320", at the end of the line under its control.
- **Why:** your text-field reference; Polaris, Carbon and ChatGPT's custom instructions show it the same way. It
  replaces the Textarea tile's hand-made count.

## Review note, 2026-11-08

- **What changed:** a horizontal Field beside a vertical Stack (a list of checkboxes) sets its label on the list's first
  line, as it already did beside a Textarea; and Field reads the system's default `orientation` from `SystemDefaults`
  (labels above, beside or by width as a system's structure choice; a use's own `orientation` wins).
- **Why:** the Inspector's inventory rows (docs/research/system-inventory-2026-11-08) put a list of values beside its
  axis's name; centred, the name floated beside the middle value.
