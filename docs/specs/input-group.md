# InputGroup spec

**Captures:** `docs/research/captures/input-group/`
**Peers:** Input, NumberField, Select, Button ghost (children), ColorField (hex + opacity),
ColorPicker (value row), Panel (inspector rows)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): InputGroup now paints
  one focus shell. Its visual compartment is one square control height with centered 16px
  Fluent art or a control-text-sized letter, so both have equal horizontal inset. The focused
  child's rectangular inner shadow was removed.
- Before 2026-09-24: the owner's inspector references (paired soft fields, linked value
  groups, a colour-plus-alpha row) and the density guidance that govern InputGroup's
  compositions are recorded verbatim in [number-field.md](number-field.md#owner-decisions).
- 2026-09-26, second pass ("decide all open items"), item 11: InputGroup takes disabled field
  paint and success and warning edges; soft fields are flat everywhere, so its soft variant
  (already without a shadow) now matches Input's.

## Job and boundaries

InputGroup draws one field shell around independently named, independently focusable
controls (Input, NumberField, Select, a ghost Button) and passive segments
(`InputGroupText`: an affix, a letter or an icon). Each child keeps its own ref, name and
keyboard stop; the group adds `role="group"` only. A single value with an affix is Input's
prefix/suffix, or NumberField's `scrub` (renamed from `prefix`); a label and message are Field.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | outline (default), soft | As Input; soft for inspector rows | Figma icon field and colour row are fill-only |
| size | sm, md (default), lg | Sets every child's tier | — |
| composition | affixes, icon or letter visual, mode Select + value, paired fields, trailing action | Units, property glyphs (X, opacity, rotation), unit pickers, clear | Figma icon field (opacity glyph + value), colour row (swatch + hex + opacity); owner's inspector images |
| boolean | fullWidth | Layout | — |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Inspector opacity field (icon + value); page colour row (swatch + hex + opacity + visibility); colour picker value rows | figma.com editor inspector, read-only, 2026-09-26; ColorPicker pass | evidence only | `input-group/figma--icon-field--rest--light`, `figma--color-row--rest--light`; `color-picker/figma--fill-row--rest--light`, `figma--format-row--rest--light` |
| area | this system | Gallery tiles, re-taken after the second pass | localhost gallery | — | `input-group/area--*` |

Figma (node numbers from the captures):
- Icon field (nodes 0–8): 88 × 24, radius 5, fill rgb(245), a 1px edge in the fill colour; a
  24 × 24 icon box (= the row height) with a 12px glyph at 50% black; the value input starts
  at the box's end, 11/16 450, with no rule between them.
- Colour row (nodes 2–15): one 184 × 24 fill, radius 5; a 14px chit 5px in; hex from 24px;
  opacity 54 wide with a transparent 1px edge and "%" in a 14px box at 50% black; no visible
  rule between hex and opacity. The colour picker's value row splits them by a 1px gap
  (`figma--format-row` nodes 10–13).
Notion and ChatGPT: no grouped field among their captures (searched every `notion--*` and
`baseline/chatgpt--*` file). Untitled UI's input add-ons are not in the
[reference](../research/untitled-ui-reference.md).

## Anatomy

```
area   div.area-input-group  (shell: height, border, radius, fill, no resting shadow, one focus ring, overflow clip)
  text     span.area-input-group__text          gutter padding, fg-muted
  visual   span.area-input-group__text[data-visual]  H wide, 16px icon or a letter, centred
  child    .area-input / .area-number-field / .area-select  chrome stripped, flex 1, least width its content (fields), 1px decorative rule before it
  action   .area-button (ghost)                 H wide, chrome stripped
```

Children inherit the group's tier through their private properties (`input-group.css:43-49`)
and keep the inset contract with the group's height: text sits 1 + 10.03 = 11.03 =
(32 − 9.94) / 2 from the outer edge, the border counted once. After a visual the child drops
its rule and start padding (`input-group.css:101-102`), as Figma's value follows its icon box.

## Measurements

`node scripts/capture-compare.mjs --slots shell` (trimmed; Area widths are the tile's):

| slot · property | area · letter | area · opacity | area · paired | area · sizes (sm) | figma · icon-field | figma · color-row |
|---|---|---|---|---|---|---|
| **shell** size | 256 × 32 | 256 × 32 | 152 × 32 | 256 × 28 | 88 × 24 | 240 × 32 (row; fill 184 × 24) |
| **shell** border | 1 solid color(srgb 0.886275 …) | 1 solid rgba(0, 0, 0, 0) | 1 solid rgba(0, 0, 0, 0) | 1 solid color(srgb 0.886275 …) | 1 solid rgb(245, 245, 245) | 0 |
| **shell** radius | 8px | 8px | 8px | 8px | 5px | 5px (fill, node 2) |
| **shell** background | rgb(255, 255, 255) | rgb(247, 247, 247) | rgb(247, 247, 247) | rgb(255, 255, 255) | rgb(245, 245, 245) | rgb(245, 245, 245) (node 2) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px | — | — | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px | — | — |

Nodes: visual box 32 × 30 with the 16px icon at x 9, y 8 and ink rgb(102) (`area--opacity`
1–2); the letter visual is rgb(102) (`area--letter` 1); the value starts at x 33, right after
the visual. Figma's icon glyph is 50% black, its letter prefix 89.8% (see Settled questions 1).
The sizes (sm) radius was 8 at capture; since audit S4 it is 6.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| shell · chrome | Input's: 32, radius per tier 6 sm, 8 md, 10 lg (`--_group-radius`, `input-group.css:17`, `:29-31`), `input-edge`, no resting shadow; soft = `bg-component` #f7, no border, no shadow (`input-group.css:26`) | Peer: [Input](input.md); Figma fill-only for soft; second pass: soft is flat | Figma 24px, radius 5: density is the UI-scale axis |
| focus | one ring on the group (`:focus-within`); children lose theirs | Owner: one focus shell | — |
| visual | H wide, 16px icon or control-size letter, `fg-muted`; value follows with no rule | Owner: square compartment; Figma 24 × 24 icon box = row height, no rule | Figma letter ink is near-default; kept (third pass): the prefix names the value, it is not the value |
| segment rule | 1px `border-decorative` before each other child (`input-group.css:103`) | Figma value row: 1px gap between hex and opacity | Figma's colour row has none; kept (third pass): two fields in one group, and the rule marks where each edits |
| affix | gutter sides (12 md), `fg-muted` | Peer: Input affix; Figma "%" at 50% | — |
| child gap | children read the group's gap tier, 6 at sm, md and lg (`--_group-gap`, `input-group.css:8, :29-31`; passed on at `:53`, `:77`); compact sm 4 | Peer: Input, Button (audit S14) | Was 4 / 8 / 8 |
| field minimum | a grouped Input or Number field is at least its content wide (`min-inline-size: min-content`, its control sized by `field-sizing: content`), so the value or placeholder and its insets always show; it still grows to fill the group. Where `field-sizing` is unsupported the field keeps no minimum | System evaluation F3.2 (VA4): in a content-sized place (an inline row, a width that is a share of an unsized parent) the field fell to 0 × 18 and Number field's "100%" clipped to "1(" | A text control's own intrinsic width is 20 characters, so `min-content` alone would hold the group at ~258 |
| mode select | 3 × H wide first child (`input-group.css:102`) | Existing Area recipe | — |
| validation | invalid: danger edge, danger halo on focus; success / warning: tone edge, **held through focus with the tone halo** (`input-group.css:34-35, 41-45`) | Peer: Input and Select hold the tone; second pass item 11; third pass | Success and warning gave way to the focus edge on focus until the third pass |
| disabled | field paint when the group is `aria-disabled` or a direct child is disabled: fill `input-bg-disabled`, `border-faint`, `fg-disabled` (InputGroupText included), no hover (`input-group.css`) | Audit "Disabled" (text fields); second pass item 11; audit B-10, B-14 | Was no group paint; InputGroupText kept its muted ink |
| forced colours | `CanvasText` edge on the group, none on its children; one `Highlight` focus ring on the group (children draw none); invalid dashed (`forced-colors.css`) | Audit B-11, as Input | Had no forced-colours rule |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover | border → `input-edge-hover` #d4d4d4; skipped while focused or disabled | `input-group.css:31` |
| focus-within | border `field-focus-color` (focus colour) + 2px `field-focus-halo-color` halo; outline in increased contrast (audit S1) | `input-group.css:36-40` |
| invalid | danger border; danger halo on focus | `input-group.css:44-45` |
| success / warning | tone border at rest; tone border, outline and halo on focus | `input-group.css:34-35, 42-43` |
| disabled | field paint on the group, InputGroupText in `fg-disabled`; children keep stripped chrome; the manifest's `disabled` state, on the group's `aria-disabled` | `input-group.css`; no disabled tile |

## Behavior and accessibility

`div role="group"`; name it with `aria-label` or `aria-labelledby`. `InputGroupText` is
passive: include its meaning in the neighbouring control's name. Every child keeps its own
tab stop and name. The group takes `disabled` and validation (`aria-invalid` or
`data-validation-status`), as a Field sets them, and passes them to its Input, NumberField and
Select through `InputGroupContext` (`input-group-context.ts`); a disabled group sets
`aria-disabled` and disables those controls. `required` is accepted and ignored on the group
(`InputGroup.tsx:10-28`).

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Input, NumberField, Select | field chrome and focus | edge, radius 6 / 8 / 10 per tier, halo | same, drawn once on the group | match |
| Input soft | soft shadow | none (`input.css:53`) | none | match (was an open question) |
| Input, Select, NumberField | disabled | field paint | field paint on the group | match (was open) |
| Input, Select | success / warning on focus | tone edge and halo kept | tone edge and halo kept | match (third pass) |
| NumberField `scrub` (was `prefix`) | letter or icon before a value | 16px box, 8px inset, `fg-muted` | H-wide box, `fg-muted` | both put the value at 32–33 from the edge |
| ColorField (alpha) | hex + opacity | this component | `color.css:110-113` | match |

## Visual pass

2026-09-28 (batch 9): a decorative visual (`InputGroupText visual`) before a Select drew a rule and an
8px start inset, unlike the same visual before an Input or NumberField. The visual now seats a
following Select the same way (no rule, no start padding): one rule for one role, and the Effects
rows' "Inner shadow" fits.

Earlier note:

The gallery shows InputGroup's tiles in named groups; the sizes tile was added in the
second pass. Unverified: Figma side by side at one zoom, dark theme, a
disabled group, a group with one of two children disabled (the whole group paints disabled).

2026-09-28 (batch 12, Claude in Chrome): beside Notion's Share invite row (field and Invite
button side by side, 32 tall, the field's corner 6 and its 2px accent focus ring) and Figma's
design-panel fields (`figma--icon-field`, `figma--color-row`). Area joins the parts into one
shell with one focus ring, where Notion keeps the button outside the field; both are 32 tall.
No change. `area--*` retaken (51 tiles across the batch).

## Settled questions

Settled in the third pass ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)):

1. *Letter ink: kept `fg-muted`.* Figma's letter prefix is 89.8% black
   (`number-field/figma--number-field` node 2) while its icon glyph is 50%
   (`figma--icon-field` node 4). The prefix names the value; it is not the value.
2. *Hex / opacity rule: kept.* Figma's colour row draws none (`figma--color-row` nodes 2, 12);
   its picker value row shows a 1px gap. Two fields in one group; the rule marks where each
   edits.
3. *Tone on focus: changed.* Success and warning now hold their edge, outline and halo
   through focus (`input-group.css:41-43`), as Input (`input.css:81-95`) and Select do.
   Invalid is unaffected.

## Verification

Compared the Area captures (`input-group/area--*`) with Figma's icon field, colour row, fill
row and value row. Build and test results are in the
[cohesion audit](../research/cohesion-audit.md#verification).

## Motion and interaction, 2026-10-07

Per `docs/MOTION.md` (hover, focus, selected: in at once, out on `fast`; focus never fades in). The
shell lists its transitioned properties explicitly (`background-color, border-color, color,
box-shadow`) with two private clocks, `--_t-paint` for fill, edge and ink and `--_t-halo` for the
focus halo, so a state can make paint instant while the halo still lets go softly.

| Interaction | Before | After |
|---|---|---|
| Hover edge | `--area-transition`: border-color `fast` ease-out in and out | in at once (`--_t-paint: 0s` on `:hover`), out on `fast` / `ease-out` |
| Focus edge | border-color `fast` ease-out in and out | in at once, out on `fast` / `ease-out` |
| Focus halo (box-shadow) | faded in over `fast` (lagged the keyboard) | in at once (`--_t-halo: 0s`), out on `fast` / `ease-out`, also when the field is left while hovered |
| Increased-contrast outline | never transitioned | unchanged: instant both ways |
| Validation tone (invalid, success, warning) and disabled | edge faded in over `fast` | lands at once; clearing it while focused is instant (focus is 0s), clearing it at rest fades on `fast` |

The group owns the edge and halo; the Input, NumberField and Select inside it draw none, so their own
clocks never show. Crispness: the passive text segment's inline inset is `round()`ed to whole pixels
(was `(height − 1cap) / 2 − 1`, 9.9 at md), as inset.css rounds every derived inset; the segment's
width still follows its text's advance (fractional by nature, the divider is pixel-snapped).

## Feedback log

- 2026-09-28 · batch 12 Chrome side by side → no change; spec's resting shadow corrected to none
  (the CSS had dropped it) → `notion--invite-row--focus--light`, `area--*` retaken.

- 2026-09-26 · cohesion audit → no change; spec written → `input-group/area--*`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → disabled field
  paint, success and warning edges, hover skipped when disabled, sizes tile; three open
  questions recorded → `input-group/figma--icon-field`, `figma--color-row`, `area--sizes`.
- 2026-09-27 · third pass → success and warning hold their tone through focus (the focus
  edge replaced them); letter ink and hex / opacity rule kept → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-28 · batch 9 → visual + Select joins like visual + Input (no rule, no start inset).
- 2026-09-30 · audit S4 (owner) → group radius follows the tier as Button: sm 6, md 8, lg 10 (`--_group-radius` per size, `input-group.css:17`, `:29-31`); was 8 at every size.
- 2026-09-30 · audit S14 (owner) → the gap tier the group passes to its children is 6 at sm, md and lg (was 4 / 8 / 8), from the density tokens (`input-group.css:8, :29-31`; density.ts:80-82).
- 2026-10-01 · audit B-10 → InputGroupText takes `fg-disabled` with a disabled group → input-group.css.
- 2026-10-01 · audit B-11 → forced colours: `CanvasText` edge on the group, `Highlight` focus ring on the group only (children draw none), dashed invalid → forced-colors.css.
- 2026-10-01 · audit B-14 → InputGroup takes Field's `disabled` and validation and passes them to its Input, NumberField and Select through `InputGroupContext`; the group gets `aria-disabled` → InputGroup.tsx, input-group-context.ts.
- 2026-10-04 · pill shapes and list rows (owner) → `--area-pill-field` makes the group a pill (`input-group.css`). `docs/research/radius-audit-2026-10-03.md`, "Pill shapes and list rows".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → motion pass: hover and focus edge and the focus halo appear at once and fade out on `fast`; tones land at once; the text segment inset rounded to whole pixels (`input-group.css`). See "Motion and interaction, 2026-10-07".
- 2026-10-15 · owner: "merge it, then continue working" → boundary sweep under increased contrast (CONTRAST.md: required boundaries target 3:1): the soft group's edge is `input-edge-soft`, as Input's.
- 2026-11-11 · system evaluation F5 · `variant`, `size` and `fullWidth` gain their descriptions on the API tab; no other change.

## Review note, 2026-10-26 (interaction pass)

- **What changed:** The hover edge eases in on Feedback's hover clock, as Input's.
- **Why:** One hover clock for every field. You asked for the Slider's motion and detail pass on every component; measured across all 118 families ([the pass](../research/interaction-pass-2026-10-26/README.md)).

### 2026-11-11 · A grouped field keeps its content's width (system evaluation F3.2, VA4)

- **What changed:** a grouped Input or Number field's least width is its content: `min-inline-size: min-content` with the
  control sized by `field-sizing: content` (inside `@supports`), so the value or placeholder and its insets always show.
  At the default width (16rem) and in every gallery tile nothing moves: the field still takes the rest of the group.
- **Why:** with `flex: 1 1 0; inline-size: 0; min-inline-size: 0` the field had no intrinsic minimum, so a group whose
  width resolved against an unsized parent (the gallery set the fields' width hook to 100% inside a shrink-wrapped
  stage) drew a 0-wide field in 9 of 12 tiles, and the Opacity tile's "100%" clipped to "1(". Measured after the change
  in a `width: fit-content` box at that hook: the Affixes group is 128 wide with a 55 field ("24.00"), Opacity 74 with
  42, Phone 169 with 77; at the default every group is 256 as before.
- **Gallery half:** a fluid demo's wrapper now takes the stage's width before the fit measures it (src/gallery/fit.ts),
  so the tiles show each group across its card.
- **Verdict:** awaiting the owner.

- 2026-11-11 · System evaluation F5: the manifest lists the `disabled` state (`stateAttributes: aria-disabled`), so the generated API tab and the parity test read it. No visual change.

### 2026-11-14 · One field shell (system plan, Phase 2, B3)

- The group draws the one field shell (tiers from the shell; `--_group-*` became the shell's `--_height` etc., the fields inside `inherit` them). Seams: border-decorative → `input-edge`, the field edge (visible: a step darker). Soft group's hover edge: edge-control-hover → `input-edge`, the control edge, as every soft field. Status reaches the group through the shell (`:has()`). The text segment is a text box on the centring model (cap at (H − 1cap) / 2 − border; it sat 0.62 high at type 13).
- Why: docs/research/system-evaluation-2026-11-11 (B3.1, B3.2, B3.3, B2.2 in fields; README §5); the owner took every recommendation on 2026-11-11 and the 24 targets on 2026-11-13. B3.2: field text stays on Button's inset (Keep 10, the pick), so nothing moved.
- Verdict: awaiting the owner.
