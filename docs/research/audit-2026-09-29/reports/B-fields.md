# B — Fields audit: Input, InputGroup, Textarea, Field, Select, Combobox, NumberField, BoxField

Read-only audit, 2026-09-29, worktree `component-audit-visual-guide-ac7bc4`. Every value below comes from source. Nothing was rendered in a browser. Items marked **unverified** are inferred from code or from browser defaults.

## Summary

- **Focus on fields is almost invisible, and in dark mode hover and focus change nothing.** Hover, focus and (in dark) rest all paint the same neutral edge. The only focus cue is a 2px halo of 6% black (8% in dark). Every product capture shows a coloured focus edge, and every other Area control uses the 2px focus ring. Select has no caret, so it relies on this weak focus alone (B-1, high).
- **The field family has split in a few places.** Select alone keeps `shadow-1` at rest (B-2). Select's chevron and check are not Area glyphs, and its option rows do not follow the "one list model" that Menu and Combobox share: 8 vs 11 text inset, rows that grow with the trigger, a non-concentric radius at 3 of 7 presets, 14/20 group labels (B-3, B-4). Fields keep one radius at every size while Button steps 6/8/10 (B-17).
- **State paint has gaps.** Disabled fields leave icons, units and group affixes in muted ink, which the cohesion audit says it fixed (B-10). Read-only and disabled look the same on outline fields. Soft read-only looks like soft rest (B-9). InputAction has no pressed or disabled style (B-8). Nested hover plates almost vanish on soft fields (B-7).
- **Behaviour contracts are incomplete.** Combobox submits the label, not the value, and ignores form reset. BoxField ignores reset (B-12). Enter mis-commits during IME composition in Combobox and NumberField (B-13). Field cannot disable or invalidate an InputGroup (B-14). NumberField and InputGroup have no forced-colours focus or edge rules (B-11). Combobox relies only on CSS anchor positioning (B-15).
- **The docs are stale in many places.** DESIGN_SYSTEM still says outline fields keep `shadow-1` and that placeholder text uses the disabled level. Several specs still say "in review" and quote sm type as 12/16. NumberField `prefix` is now `scrub`. The cohesion audit claims fixes the code does not have (B-26).

## Findings

### B-1  Field focus is barely visible, and in dark mode hover and focus look like rest
- Families: Input, Textarea, Select, NumberField, InputGroup, Combobox (through Input)
- Category: a11y
- Severity: high
- Type: DECISION
- What: At standard contrast a focused field's edge becomes `field-focus-color` = `border-subtle`, which is exactly the hover edge. The only other change is a 2px halo in `shadow-color` (6% black light, 8% dark). In dark mode, `border-faint` (rest), `border-subtle` (hover) and the focus edge are all neutral rung 750, so hover changes nothing and focus shows only a dark halo on a dark surface. Select is a button-like control with no caret, so keyboard users get almost no signal. Checkbox, Switch, Button and the InputAction inside the same field use the 2px `focus-color` ring.
- Evidence:
  - `packages/tokens/src/emit/base.ts:107-112`: `field-focus-color` = `border-subtle`, mixed toward `focus-color` only by `contrast-more`; outline width = `focus-width × contrast-more` (0 at standard).
  - `packages/tokens/src/color/curves.ts:89,102`: `borderSubtle {light 200, dark 750}`, `borderFaint {light 150, dark 750}`.
  - `packages/tokens/src/axes/color.ts:57-60`: shadow-color `rgb(0 0 0 / .06)` light, `.08` dark.
  - `input.css:63-72`, `textarea.css:77-86`, `navigation.css:265-272`, `number-field.css:41-47`, `input-group.css:32,37-41`.
  - Contrast: #d4d4d4 on white ≈ 1.48:1. Focus edge vs rest edge #e2 ≈ 1.26:1. WCAG 1.4.11 asks 3:1 for focus indicators.

  | State (light) | Edge | Extra | Dark edge |
  |---|---|---|---|
  | rest | #e2 (`border-faint`) | — | rung 750 |
  | hover | #d4 (`border-subtle`) | — | rung 750 |
  | focus | #d4 | 2px 6% black halo | rung 750 + 8% black halo |
  | Button / Checkbox / InputAction focus | 2px `focus-color` ring | — | 2px ring |
- Product evidence: Notion's fields draw a 2px ring in rgb(35,131,226) (`captures/input/notion--invite-field--focus--light.json`, `notion--field--focus`). ChatGPT's textarea focus is a 1px rgb(58,131,247) border (`captures/textarea/chatgpt--textarea--focus--light.json`). DESIGN_SYSTEM "Color and focus" says focus uses the focus role and that this "is a system setting, not accent selection". The third pass kept the neutral edge under "neutral by default", which conflates selection with focus.
- Options:
  - A: Keep the quiet edge plus halo (current, documented in CONTRAST.md "Focus").
  - B: Focused fields take a 1px `focus-color` edge and a `focus-color` halo at low alpha, as ChatGPT does.
  - C: Make the increased-contrast presentation (2px `focus-color` outline) the default for fields, as Notion does.
  - D: A for text fields, but Select uses the ordinary control ring.
- Recommended: B. Both products use a coloured focus edge. It keeps the field's 1px geometry, fixes dark mode, and agrees with the rule that focus is a system role. At minimum take D, because Select has no caret.
- Visual: four outline fields (rest, hover, focus now, focus with B) in light and dark, beside a focused Button and Checkbox in the same form.

### B-2  Select is the only outline field that still has a resting shadow; DESIGN_SYSTEM says all of them should
- Families: Select vs Input, Textarea, NumberField, InputGroup
- Category: consistency, docs-drift
- Severity: medium
- Type: FIX
- What: The owner's outline pass ("do whatever is consistent with the system") removed resting shadows from Input, NumberField, InputGroup and Textarea. Select still paints `shadow-1`. DESIGN_SYSTEM, the Input, Select and Textarea specs and the cohesion audit's third pass still say "outline keeps `shadow-1`", so the documented rule no longer matches four of the five fields.
- Evidence:

  | Family | Resting shadow |
  |---|---|
  | Input | `none` (`input.css:45`) |
  | Textarea | `none` (`textarea.css:42`) |
  | NumberField | `none` (`number-field.css:30`) |
  | InputGroup | `none` (`input-group.css:19`) |
  | **Select** | **`var(--area-shadow-1)` (`navigation.css:239`)** |

  - Docs: `DESIGN_SYSTEM.md:79` ("outline fields keep `shadow-1`") and `:86` ("In-flow content (fields, controls) uses `shadow-1`").
  - Specs: `select.md:67,98,166`; `input.md:136,163-165`; `textarea.md:53,111`.
  - Owner direction: `number-field.md:84-87,110-112`; handoff "NumberField pass 2" and batch 12 ("specs' stale resting shadow corrected").
- Visual: an outline Input and an outline Select stacked in one Field column, showing the Select's 0.5px under-shadow.

### B-3  Select's chevron and check are not Area glyphs, and they differ from Combobox beside it
- Families: Select vs Combobox (and InputAction, Tree view and Split button chevrons)
- Category: visual, consistency
- Severity: medium
- Type: DECISION
- What: Select draws its chevron as a data-URI path (7 wide, 1.5 stroke, fixed #888). Its checked option uses the UA's `::checkmark` glyph. Combobox, directly comparable, draws the Area `chevron-down` glyph (9 wide, 1.125 `--area-weight-icon`, `fg-muted` #666) and the Area `check` glyph. Select's chevron also stays #888 when disabled, while its text turns `fg-disabled`.
- Evidence:
  - `navigation.css:244` (`stroke='%23888' stroke-width='1.5' d='M4.5 6.5L8 10l3.5-3.5'`); `navigation.css:315` hides `::picker-icon`; `navigation.css:357` styles `::checkmark` (content left to the UA); `navigation.css:299-305` has no chevron change for disabled.
  - `Combobox.tsx:229` `<Glyph name="chevron-down" />`, `Combobox.tsx:207` `<Glyph name="check" />`; `glyphs.ts` chevron `M3.5 5.5L8 10L12.5 5.5`.
  - Owner decision (second pass, item 10) kept #888 only because "the data URI a native select requires". With `appearance: base-select` that is no longer required.
- Options:
  - A: Keep the data URI everywhere (current).
  - B: Under `@supports (appearance: base-select)`, draw `::picker-icon` and `::checkmark` from the Area glyphs (mask plus `currentColor` in `input-icon`, disabled ink when disabled). Keep the #888 URI only as the fallback for the native picker.
- Recommended: B. It matches Combobox and every other Area chevron, follows the icon rule ("Area-drawn … at `--area-weight-icon`"), and fixes the disabled mismatch.
- Visual: a Select and a Combobox side by side at 2x, rest and disabled, with their open lists showing both checks.

### B-4  Select option rows do not follow the "one list model" that Menu and Combobox share
- Families: Select (picker) vs Menu, Combobox
- Category: consistency, system-rule
- Severity: medium
- Type: FIX
- What: The handoff's list model gives Menu, Combobox, Command palette and Context menu 32px rows, text on the inset contract (11), a concentric corner and 12/16 muted group labels. Select's options set their own padding, a radius from `radius-row`, a height that follows the trigger's size, and 14/20 group labels. The Select spec claims a "match" (`select.md:133`).
- Evidence:

  | Property | Menu / Combobox | Select option |
  |---|---|---|
  | Text start in the row | (32 − 1cap) / 2 ≈ 11 (`inset.css:44-47`, 17-18) | 8 (`navigation.css:342`, padding 6 8) |
  | Row height | 32 at every size (`surface.css` `.area-menu__item` block-size `control-md`) | `max(--_height, control-md)`: **40 in an lg Select** (`navigation.css:341`) |
  | Corner | `min(max(0, container − 4), 32 × cap)` | `radius-row` (`navigation.css:347`) |
  | Corner at Subtle / Soft / Pill | 2 / 4 / 12.8 | 4 / 6 / 9999 (capsule options) |
  | Group label | 12/16 muted (`.area-menu__label`) | inherits 14/20, muted, padding 0 (`navigation.css:358-364`); label inset unverified |
  | Gap to check | 12 (`--_menu-gap`) | 8 |

  - Radius presets: `packages/tokens/src/axes/radius.ts:98-112`. DESIGN_SYSTEM:174 says "Nested radius is `max(0, outer radius − actual inset)`".
- Visual: an open Select picker and an open Combobox list overlaid on one text column, at the Standard and Pill presets.

### B-5  Select picker and Combobox list place, size and focus differently
- Families: Select, Combobox (Menu for reference)
- Category: consistency, interaction
- Severity: medium
- Type: DECISION
- What: The two floating lists do the same job with different rules. Select never flips (an owner decision from before 2026-09-24). Combobox flips. Minimum widths, maximum heights and keyboard-focus paint also differ. Select options draw a 2px focus ring. Combobox rows show only the plate, as Menu does; Menu's ring is still an open owner question from the cohesion audit's fourth pass.
- Evidence:

  | | Select picker | Combobox list | Menu |
  |---|---|---|---|
  | Flip | `position-try-fallbacks: none` (`navigation.css:320`) | `flip-block` (`combobox.css:31`) | JS flip (overlay work) |
  | Min width | trigger width (`:321`) | max(trigger, 224) (`combobox.css:30`) | 224 (`surface.css`, `.area-menu`) |
  | Max height | min(288, 100%) (`:322`) | min(324, 50vh) (`combobox.css:18`) | available height |
  | Keyboard focus | plate plus 2px `focus-color` ring inset (`:353,355`) | plate only (`[data-highlighted]`) | plate only |

  - Owner decision on the Select flip: `select.md:10-12`.
- Options:
  - A: Keep them separate: Select stays native-ish (no flip, trigger width), Combobox follows Menu.
  - B: Give both one rule set: flip, at least Menu's width, one maximum height (Figma's 324), one focus paint.
- Recommended: B. Both are the same "list under a field" surface. A narrow mode Select in an InputGroup (3 × H = 96px) opens a 96px picker, narrower than any other list in the system. It needs the owner to revisit the pre-2026-09-24 no-flip decision.
- Visual: a Select and a Combobox near the bottom of a viewport, both open, plus the 96px mode Select opened next to a Combobox list.

### B-6  Combobox marks the selected option with a check only; Select and the row rule use a plate
- Families: Combobox, Select
- Category: consistency, system-rule
- Severity: medium
- Type: DECISION
- What: The Shared state paint rule says "pressed, selected and current are `bg-component-active`", and names Select options. Select paints the plate plus a check. Combobox forces `data-selected={undefined}` and shows only a trailing check. The cohesion audit's fourth pass left this open ("Combobox selected option: keep check-only, or add the plate").
- Evidence: `Combobox.tsx:199-201` (`aria-selected={isSelected}` … `data-selected={undefined}`); `combobox.css:36`; `navigation.css:354` (`option:checked` → `bg-component-active`); DESIGN_SYSTEM.md "Row and item plates"; `cohesion-audit.md`, Fourth pass, "Open for the owner".
- Options:
  - A: Check only, as ChatGPT's model picker does (also Menu's checkable rows).
  - B: Plate plus check, as Select does now and as the rule states.
- Recommended: B. It is the documented rule and makes the two pickers agree. ChatGPT's picker is a menu of choices, not a value field.
- Visual: the same four-option list rendered as a Select picker and as a Combobox list, the second option selected and the third hovered.

### B-7  Nested field actions are 24px at every size and their hover almost disappears on soft fields
- Families: Input (InputAction, and Combobox's toggle), NumberField steppers
- Category: visual, system-rule
- Severity: medium
- Type: DECISION
- What: The action and stepper box is `icon + 8`. The icon is 16 at sm, md and lg, so the box is always 24. It sits 2px from the outer edge at sm (1px inside the border), 4 at md and 8 at lg. Its corner is `radius-small` 6, not the concentric 4 (the spec notes "Nested radius would be 4; kept Button's small radius"). Its hover plate is `bg-component-hover`. On a soft field (#f7) that is #f3, one step and about 1.03:1. In dark mode it is rung 750 on 800.
- Evidence:
  - `input.css:17,187-198`; `number-field.css:10,117-133`; `inset.css` `--_box-end: var(--_action)` / `var(--_step)`; `density.ts:74-77` (icon 16 at sm/md/lg); `input.md:107`; DESIGN_SYSTEM:174.
  - Plates: `bg-component` 50 → `componentHover` 75 (`curves.ts:85-86`).

  | Tier | Field H | Action | Gap to outer edge | Concentric radius | Actual |
  |---|---|---|---|---|---|
  | sm | 28 | 24 | 2 | 6 | 6 |
  | md | 32 | 24 | 4 | 4 | 6 |
  | lg | 40 | 24 | 8 | 2 | 6 |

- Options:
  - A: Keep 24 everywhere (current).
  - B: Action = H − 8 (20 / 24 / 32), so there is a 4px ring at every tier; corner = field radius − 4.
  - C: Keep 24 but use `bg-component-active`, or the translucent `bg-hover`, for the plate when the field is soft.
- Recommended: B plus C. B keeps one inset ring, as Chip's remove does ("concentric circle 4 inside the pill"). C follows the rule that `bg-hover` is for grounds a component cannot predict: a field action sits on either white or #f7.
- Visual: sm, md and lg Inputs with a hovered clear action, outline and soft, current vs B + C.

### B-8  InputAction has no pressed or disabled paint
- Families: Input (InputAction), Combobox (toggle); compare NumberField steppers and Button
- Category: interaction, consistency
- Severity: medium
- Type: FIX
- What: `.area-input__action-button` defines only `:hover` and `:focus-visible`. It has no `:active` plate, although steppers and ghost Buttons step to `bg-component-active`. A disabled action still shows the hover plate, keeps the pointer cursor and keeps muted ink. That is visible on a disabled or read-only Combobox, whose toggle is disabled (`Combobox.tsx:226`).
- Evidence: `input.css:183-199` has no `:active` and no `:disabled`, and `:hover` is not guarded with `:not(:disabled)`; compare `number-field.css:132-135` (hover, active and disabled all defined).
- Visual: InputAction and a stepper side by side at rest, hover, pressed and disabled.

### B-9  Read-only and disabled look alike, soft read-only looks editable, and soft disabled gains an edge
- Families: Input, Textarea, NumberField (Select has no read-only; InputGroup paints none)
- Category: visual
- Severity: medium
- Type: DECISION
- What:
  - Outline read-only and outline disabled draw the same fill (#f7) and the same edge (`border-faint`, #e2, which is also the rest edge); only the text ink differs.
  - Soft read-only draws the soft fill, so in a Panel (all soft) it looks exactly like an editable field, and it still hovers its edge.
  - Soft disabled sets `--_border: border-faint`, so it gains an edge the enabled soft field does not have.
  - A read-only child in an InputGroup paints nothing, because the group forces children transparent.
- Evidence:
  - `input.css:50-58,63-65,98-108` (the hover rule does not exclude read-only); `textarea.css:59-64,77,113-124`; `number-field.css:34,41,58-59`; `input-group.css:61`.
  - Tokens: `input-bg-disabled` = `input-bg-soft` = `bg-component` (`base.ts:120-122`); `input-edge` = `edge-control` = `border-faint` (`base.ts:98,123`).
  - Precedent: the second pass (item 9) gave read-only Switch "full paint with a default cursor; only disabled dims".
- Options:
  - A: Keep the current paint.
  - B: Read-only keeps its variant's rest paint with no hover edge and a default cursor. Disabled keeps its field paint but never adds an edge to soft. Then rest, read-only and disabled differ in each variant through fill, ink and hover.
- Recommended: B. It follows the Switch read-only decision and removes the soft-disabled edge.
- Visual: a 2×4 grid: outline and soft × rest, hover, read-only, disabled.

### B-10  Disabled fields leave icons, units and affixes in muted ink
- Families: Input, NumberField, InputGroup, Combobox
- Category: system-rule, docs-drift
- Severity: medium
- Type: FIX
- What: The disabled field paint turns the value and placeholder to `fg-disabled`. Several slots set their own `color`, so they stay `fg-muted`: Input's icons and action icon, NumberField's scrub handle and unit, InputGroupText. The cohesion audit lists "Input, NumberField: Disabled fields left affixes and units in muted ink → Disabled ink" as fixed. Only Input's affix and placeholder were changed.
- Evidence:
  - Input: `input.css:133-134` (affix and placeholder only), icon `:160`, action icon `:194`.
  - NumberField: unit `number-field.css:79`, scrub `:97`; only the cursor changes in `:106`.
  - InputGroup: `input-group.css:92`, while the group sets `color: fg-disabled` at `:34`.
  - `cohesion-audit.md`, "Found while writing the specs".
- Visual: a disabled NumberField (scrub + unit), a disabled Input with a leading icon and a disabled InputGroup with "$", current vs fixed.

### B-11  Forced colours: NumberField and InputGroup have no edge, focus or invalid rules
- Families: NumberField, InputGroup (Select partly)
- Category: a11y
- Severity: medium
- Type: FIX
- What: `forced-colors.css` forces `CanvasText` edges, a `Highlight` focus outline and a dashed invalid edge on `.area-input`, `.area-textarea` and `.area-select` only. In forced colours a focused NumberField or InputGroup loses its halo (shadows drop) and has a 0-width outline, so it shows no focus. Soft variants, which have transparent borders, may show no edge at all. Framework-free `.area-select[data-invalid]` is not dashed; only `[aria-invalid="true"]` is.
- Evidence: `forced-colors.css:4-6,22-31`; `number-field.css:34,42-47`; `input-group.css:27,37-41`. The handoff lists forced colours (execution) as unverified; this finding is from the code.
- Visual: a Windows High Contrast mock of a focused NumberField and a focused InputGroup next to a focused Input.

### B-12  Combobox and BoxField do not meet the form contract
- Families: Combobox, BoxField (NumberField for comparison)
- Category: interaction
- Severity: medium
- Type: FIX
- What: DESIGN_SYSTEM says "uncontrolled state must synchronize with native input and form reset. Visible, submitted and announced values must agree."
  - Combobox passes `name` through to the visible input, so a form submits the option's label ("Source Sans 3") instead of its value ("source-sans-3"). It has no hidden value input and no `reset` listener.
  - BoxField writes a hidden input but ignores `reset`. Its NumberFields are controlled, so their own reset handlers are disabled.
  - NumberField, ColorField, Switch and AlignmentPicker all handle reset.
- Evidence: `Combobox.tsx:218-221` (`{...rest}` … `value={text}`), with no `reset` anywhere; `BoxField.tsx:80,101-104,118-119`; `NumberField.tsx:61-67,189`; `grep "reset"` finds AlignmentPicker, ColorField, primitives, NumberField and Switch only.
- Visual: a form with a Combobox and a BoxField, before and after pressing Reset, with the submitted FormData shown underneath.

### B-13  Enter during IME composition picks or commits in Combobox and NumberField
- Families: Combobox, NumberField
- Category: interaction, a11y
- Severity: medium
- Type: FIX
- What: Composer ignores Enter while `isComposing`. Combobox (Enter picks the highlighted row, Tab commits) and NumberField (Enter commits the draft) do not. A Japanese or Chinese user confirming a candidate with Enter would select the first match. The Combobox spec lists "IME composition" as unverified.
- Evidence: `Composer.tsx:73` (`event.nativeEvent.isComposing`); `Combobox.tsx:169-179`; `NumberField.tsx:108-109`; `combobox.md:88`.
- Visual: not visual. Show a key-sequence strip: type "ふ", press Enter to confirm the IME candidate, see the wrong option chosen.

### B-14  Field cannot disable or invalidate an InputGroup
- Families: Field, InputGroup
- Category: interaction, a11y
- Severity: medium
- Type: FIX
- What: Field clones `id`, `disabled`, `aria-invalid`, `data-validation-status` and `required` onto its direct child. For InputGroup that child is the group `div`. InputGroup spreads those onto the div, but paints only from descendants (`:has(...)`, which does not match the element itself). So a Field error leaves the group edge neutral, and Field `disabled` leaves the inner Input and NumberField editable while the label turns muted. `<label for>` also points at a div, which is not labelable, so clicking the label focuses nothing.
- Evidence: `Field.tsx:95-111`; `InputGroup.tsx:12-16`; `input-group.css:34,35,36,45` (all `:has(...)`).
- Visual: `<Field label error disabled><InputGroup>…` as it renders now: red message, neutral edge, editable children.

### B-15  Combobox list relies only on CSS anchor positioning
- Families: Combobox (vs Menu, Popover, Tooltip triggers)
- Category: interaction, consistency
- Severity: medium (unverified in a browser without support)
- Type: FIX
- What: The overlay work gave Popover, Menu and Tooltip JS `computePosition` with flip and shift. Combobox positions its `popover="manual"` list only inside `@supports (anchor-name)`. Outside that block the list keeps `margin: 0` and inherits `inset: auto; position: fixed` from Menu's `[popover]` rule, so in a browser without anchor positioning it would likely open at the viewport origin (**unverified**). The min width also uses physical `anchor-size(width)`.
- Evidence: `combobox.css:14-33`; `surface.css` `:is(.area-popover, .area-menu, .area-tooltip)[popover]` (position fixed, inset auto, margin 0); handoff "Overlay behavior (2026-09-27)".
- Visual: not needed; a screenshot of the list in a non-anchor browser would settle it.

### B-16  InputAction's hint does not behave like Tooltip
- Families: Input (InputAction, and the Combobox toggle)
- Category: a11y, consistency
- Severity: low
- Type: FIX
- What: The hint now uses the Tooltip surface, but it is revealed by CSS on `:hover` and `:focus-within`. It has no show delay, no hover bridge, `pointer-events: none` (not hoverable) and no Escape dismissal (WCAG 1.4.13). Tooltip got delays, a bridge and a fade in the overlay pass. Its transition uses `--area-transition`, which covers background, border, colour and shadow only, so the designed opacity and translate animation never runs and the hint pops in. Message and Scroll to latest had the same defect fixed in the cohesion audit's fourth pass.
- Evidence: `input.css:210-226`; `base.ts:187-188` (`--area-transition` property list); `surface.css` `.area-tooltip[popover]` bridge rules; `cohesion-audit.md`, Fourth pass (Message, Scroll to latest).
- Visual: a timeline strip showing a Tooltip and the InputAction hint on hover: delay, fade, bridge.

### B-17  Fields keep one corner at every size; Button steps with size
- Families: Input, Textarea, Select, NumberField, InputGroup (vs Button, ButtonGroup, Toolbar)
- Category: consistency, visual
- Severity: medium
- Type: DECISION
- What: Fields use `radius-control` (the md value, 8) capped by 0.4 × H, so sm, md and lg are all 8. Button, ButtonGroup and Toolbar use `radius-control-sm/md/lg`, which is 6 / 8 / 10 at Standard. An sm Input next to an sm Button, or an lg Select next to an lg Button (a form row or a toolbar), has mismatched corners.
- Evidence: `input.css:38`, `textarea.css:35`, `navigation.css:230`, `number-field.css:24`, `input-group.css:16` vs `button.css:446,456,466`, `button-group.css:23-25`, `toolbar.css:35,37`; presets `radius.ts:101`.
- Options:
  - A: Keep one field corner (current). Notion and Figma fields are 5–8 at every height.
  - B: Fields take `radius-control-{size}`, like Button.
- Recommended: B. Fields and buttons share the control ladder and sit side by side. Area's radius roles are already per tier, and B changes only sm and lg by 2px.
- Visual: sm and lg rows of Input + Button + Select, current vs B.

### B-18  InputGroup affix text ignores the inset contract
- Families: InputGroup vs Input (prefix/suffix)
- Category: consistency, system-rule
- Severity: low
- Type: FIX
- What: `InputGroupText` (non-visual) pads with the gutter tokens, while every other field text uses the equal-inset rule. The same "$ 24.00" sits at a different position depending on whether it is written as Input `prefix` or `InputGroupText`.
- Evidence: `input-group.css:91` (`padding-inline: var(--_group-gutter)`); `inset.css:17-18`.

  | Tier | Input prefix, from outer edge | InputGroupText, from outer edge |
  |---|---|---|
  | sm | 9.74 | 9 |
  | md | 11.03 | 13 |
  | lg | 15.03 | 13 |
- Visual: `Input prefix="$"` stacked over `InputGroup` + `InputGroupText $` at sm, md and lg, with a guide line on the "$".

### B-19  Select has no placeholder state
- Families: Select vs Input, Textarea
- Category: visual, consistency
- Severity: low
- Type: DECISION
- What: The gallery's invalid Select uses an empty-valued "Placeholder" option. It renders in default ink, so it reads as a chosen value. Input and Textarea placeholders use `fg-placeholder`.
- Evidence: `form.tsx:224-228` (`SelectInvalid`); `navigation.css:232` (`color: var(--area-select-text)` with no placeholder rule).
- Options:
  - A: Leave it; consumers pick a real default.
  - B: `.area-select:has(option:checked[value=""])` takes `input-placeholder` ink.
- Recommended: B, so an empty Select matches an empty Input. It is cheap and framework-free.
- Visual: an empty Input and an empty Select stacked in a Field.

### B-20  API inconsistencies across the field family
- Families: NumberField, Input, Combobox, BoxField, Field
- Category: api
- Severity: medium
- Type: FIX
- What:
  1. NumberField has no `invalid` prop, while Input, Select, Textarea and Combobox accept it. On NumberField, `invalid` falls through to `<input>` as an unknown DOM attribute (`NumberField.tsx:7-39`).
  2. Input, NumberField and Combobox send `className` to the shell (or wrapper) but `style` and other native props to the inner `<input>` (`Input.tsx:117,140`; `NumberField.tsx:165,178`; `Combobox.tsx:216-219`). Width and margin overrides via `style` land on the wrong box.
  3. BoxField's `variant` is hand-typed (`BoxField.tsx:28`) and not in its manifest (`manifest.ts:511-518`); BoxField has no `readOnly`.
  4. Field's `validation` without `validationStatus` defaults to **error** (`Field.tsx:91`). Its docstring says "A non-error validation message" (`Field.tsx:31`), and the error default also sets `aria-invalid` and `aria-errormessage`.
- Evidence: as cited.
- Visual: an API table (prop × family) with gaps highlighted.

### B-21  Native browser chrome shows through Input
- Families: Input (and InputGroup, Combobox)
- Category: visual
- Severity: low (**unverified** in a browser)
- Type: FIX
- What: `.area-input__control` resets the border, padding and background but not the UA decorations:
  - `type="search"` shows the WebKit cancel "×" (four gallery tiles use `type="search"`).
  - Edge's `::-ms-reveal` eye appears next to the password InputAction's eye. The owner's captures are from Edge 153 and 154.
  - Autofill paints a coloured box on the inner input, not the shell (the Phone tile sets `autoComplete="tel"`).
  - `type="number"` spinners are reset only inside the slider-range composition.
- Evidence: `input.css:117-127`; `grep` finds no `search-cancel`, `-ms-reveal` or `:autofill` in `packages/styles`, and spin buttons only at `slider.css:138-139`. Gallery: `gallery.tsx:768,796`, `gallery.tsx:1305,1313`, `:1372`.
- Visual: the password and search tiles in Edge with text entered.

### B-22  Field caption type and ink vary by composition
- Families: Field, BoxField, CheckboxGroup and RadioGroup, Panel rows
- Category: consistency
- Severity: low
- Type: DECISION
- What: The same "names this control" caption varies:

  | Where | Caption | Gap to control |
  |---|---|---|
  | Field vertical | 14/20 `fg-default` | 6 |
  | Field horizontal | 14/20 `fg-muted` | 8 (column gap) |
  | Field in a Panel | muted, panel tier | panel gap |
  | BoxField outside a Panel | **12/16** `fg-muted` | 6 |
  | CheckboxGroup legend | 14/20 default, description **4** below | — |

  A standalone md BoxField next to a Field-labelled NumberField shows two caption styles.
- Evidence: `field.css:12,20-28,83-87`; `box-field.css:21,25-32`; `choice.css:273-293`; `panel.css:33-34,278,351-352`.
- Options:
  - A: Keep them (BoxField is an inspector part).
  - B: BoxField outside a Panel falls back to Field's label (14/20 default, 6 gap), and group descriptions use Field's 6 gap.
- Recommended: B. Its fallback 12/16 has no source outside a Panel (`box-field.md` Decisions cites "PanelRow caption", which is 14/20 at md).
- Visual: a form column with a Field NumberField, a BoxField and a CheckboxGroup, captions aligned.

### B-23  Horizontal Field centres its label on multiline controls
- Families: Field (with Textarea, and Composer-like children)
- Category: system-rule
- Severity: low
- Type: FIX
- What: `.area-field--horizontal` uses `align-items: center`, so a label beside a 98px Textarea sits at the middle of the box, not on the first text line. AGENTS.md and DESIGN_SYSTEM "Optical insets" require first-line alignment.
- Evidence: `field.css:62-72`; `AGENTS.md:42`.
- Visual: a horizontal Field with a Textarea: label centred (current) vs on the first line.

### B-24  Textarea lg differs from md only by 4px of inset
- Families: Textarea
- Category: visual
- Severity: low
- Type: DECISION
- What: The handoff's open note ("Textarea lg is barely distinct from md") was answered by per-size insets (9 / 11 / 15; block 5 / 7 / 11). Type is still 14/20 at sm, md and lg, so lg reads as md with more padding.
- Evidence: `textarea.css:17-23,130-132`; `density.ts:74-77` (lg text 14/20); `textarea.md:84-86,122-125`.
- Options:
  - A: Accept (owner: "do whatever makes the most sense").
  - B: Remove Textarea lg; keep sm and md.
  - C: lg uses 16/24 text.
- Recommended: A. The owner delegated and approved it in batch 12. Revisit only if lg is used next to an lg Input.
- Visual: sm, md and lg Textareas at 3 rows side by side.

### B-25  Only Input recolours its icons with the validation tone
- Families: Input vs NumberField, Select, InputGroup, Combobox (toggle)
- Category: consistency
- Severity: low
- Type: DECISION
- What: An invalid Input paints its leading search icon danger red. NumberField's scrub, Select's chevron, InputGroupText and the InputAction glyph stay muted in the same state.
- Evidence: `input.css:112-114` vs `number-field.css:97`, `navigation.css:244`, `input-group.css:92`, `input.css:194`.
- Options:
  - A: Glyphs stay muted everywhere; the edge and the message carry the tone.
  - B: Every field glyph takes the tone.
- Recommended: A, keeping a trailing status icon (success check) as the one tone-coloured glyph. That is quieter and matches the other fields.
- Visual: invalid Input, NumberField and Select in one column.

### B-26  Stale docs, specs and claims
- Families: all eight
- Category: docs-drift
- Severity: low
- Type: FIX
- What / Evidence:
  - DESIGN_SYSTEM.md:79 and :86 say outline fields and in-flow controls keep `shadow-1` (see B-2).
  - DESIGN_SYSTEM.md:44 says "disabled is for disabled and placeholder text only", but the placeholder uses the muted rung (`curves.ts:120-121`, textPlaceholder = textMuted = 550).
  - Status lines still read "in review" in `input.md:3`, `input-group.md:3` and `select.md:3`, while `component-status.mjs:22,38-39` lists them complete. `COMPONENTS.md:22-23,62` has the same drift.
  - "sm 12/16" is still quoted in `input.md:104`, `textarea.md:86` and `select.md:86` (the measured table), although small controls are 14/20 (`density.ts:74-76`). `field.md` gives the description's basis as `control-sm-text`, which is now 14.
  - `textarea.md:56-59` gives the old insets ("lg as md"); `textarea.md:113` gives "11 (gutter − border)".
  - `input.md:138` says InputGroup's tone "gives way" on focus, which the third pass fixed.
  - NumberField `prefix` is now `scrub`, but `input-group.md:27,125` still say `prefix`. The gallery tile is still "Prefix" / `GalleryNumberFieldPrefix` (`build.mjs:695`, `gallery-variants.tsx:27`).
  - The cohesion audit says "NumberField: Disabled steppers 50%", but `number-field.md:108` and `number-field.css:135` use `fg-disabled` ink.
  - `textarea.md:119-121` calls ChatGPT's multiline field "a match". `chatgpt--textarea--focus` shows a blue rgb(58,131,247) focus border (see B-1).
  - `pages.mjs` NumberField API types `scrub` as `boolean` (it is `boolean | ReactNode`). The Select API omits `disabled`, native props and ref.
  - `box-field.md` Open questions (opening Figma's split panels; CSS shorthand entry) are still unanswered.
- Visual: none. List these in the guide.

### B-27  Dead and duplicated CSS
- Families: Select, NumberField, Input
- Category: system-rule
- Severity: low
- Type: FIX
- What:
  - `inset.css` loads after the component files and overrides padding and chevron position, so these declarations never apply: `navigation.css:225-226` (padding), `:246,250` (`background-position`, plus a duplicate `[dir=rtl]` rule next to `inset.css`'s `:dir(rtl)`); `number-field.css:21-22,38-39` (gutter padding); `input.css:35`.
  - The picker offset uses the physical shorthand `margin: var(--area-space-4) 0 0` (`navigation.css:317`).
  - Combobox writes `4px /* spec */` where `space-4` equals the value (`combobox.css:29`).
  - The Select picker restates the lift as a literal (`navigation.css:332`) instead of sharing Menu's `--_elevation`.
- Visual: none.

### B-28  Variant and state rules follow three patterns
- Families: InputGroup, NumberField vs Input, Textarea, Select
- Category: system-rule
- Severity: low
- Type: FIX
- What:
  - Input, Textarea and Select set tone slots (`--_border-focus`, `--_focus-outline`, `--_focus-halo`) that the base focus rule reads.
  - NumberField repeats `:focus-within` overrides per tone (`number-field.css:53-57`).
  - InputGroup's variants and states write `background-color` and `border-color` directly (`input-group.css:26-27,34-46`).
  - Input matches only `[data-invalid]` while Textarea and Select also match `[aria-invalid="true"]` (`input.css:74` vs `textarea.css:88-89`, `navigation.css:274-275`).
  - AGENTS.md says "Variants set local CSS properties; base rules consume them."
- Visual: none.

### B-29  Gallery hygiene
- Families: all eight
- Category: gallery
- Severity: low
- Type: FIX
- What:
  - **Copy.** Several tiles invent domains, against DESIGN_SYSTEM "Example copy":
    - Input: "Full name" (`gallery.tsx:767`); "+1 555 0100" (`gallery.tsx:793`).
    - InputGroup: "Price", "Amount in dollars", "USD", "Country code" (`gallery.tsx:1303,1310`).
    - NumberField: "Quantity", "Scale", "Position", "Spacing", "Locked", "Unavailable" (`form.tsx:62-70`, `gallery.tsx:1301`).
    - Combobox: font names and tags "Design / Engineering / Research" (`gallery.tsx:970-984`).
    - Scrub glyph pairs (Rotation, Opacity) are acceptable under the icon-paired exception.
  - **Missing tiles.**
    - NumberField has no invalid, success or warning tile, although the manifest lists them (`manifest.ts:157`; `build.mjs:683-699`).
    - InputGroup has no disabled or invalid tile (`input-group.md` notes "no disabled tile") and no "Variant / soft" tile.
  - **Labels.** Size tiles are "md (default)" in InputGroup and NumberField, "medium" in Input, Select and Textarea, and "Control size" in Field. Combobox and BoxField have no md tile.
  - `FieldHiddenLabel` uses the deprecated `icon` prop (`form.tsx:124-128`).
  - The Date tile renders a read-only Input as its trigger, so the interactive field shows read-only fill (`gallery.tsx:782-786`; see B-9). It also has no `aria-haspopup`.
  - Confirmed: one size per tile everywhere (`InputGroupSizes`, `NumberFieldSizes` and `FieldSizes` are docs-only). People are Irene Yamaguchi plus teams.
- Visual: none; a checklist in the guide.

### B-30  NumberField: read-only steppers look disabled; Enter blocks form submit; Escape does not cancel a scrub
- Families: NumberField
- Category: interaction
- Severity: low
- Type: DECISION
- What:
  - `disabledState = disabled || readOnly`, so a read-only field shows greyed, disabled steppers. The Switch read-only decision keeps full paint.
  - Enter always calls `preventDefault()`, so it never submits the surrounding form, unlike Input.
  - A scrub is cancelled only by `pointercancel`; Escape during a drag does nothing, though the spec says "cancel restores".
- Evidence: `NumberField.tsx:75,98-116,141-147,198`; `number-field.md:118`.
- Options:
  - A: Keep the current behaviour.
  - B: Hide the steppers when read-only. Let Enter commit and then submit when the draft is unchanged. Let Escape cancel an active scrub.
- Recommended: B. It matches native field behaviour and the Switch read-only precedent.
- Visual: read-only NumberField with steppers, current vs hidden.

### B-31  Combobox accessibility details
- Families: Combobox
- Category: a11y
- Severity: low
- Type: FIX
- What:
  - The listbox is named only when the input has a string `aria-label`. When Field labels it through `aria-labelledby`, the listbox is unnamed (`Combobox.tsx:230`).
  - The empty "No results" row is `role="presentation"` with no live region, so screen readers get no feedback (`:232`).
  - Alt+ArrowUp (APG: close and keep the value) is treated as a plain ArrowUp (`:164-167`).
- Visual: none.

### B-32  Tests do not guard the field family's behaviour or shared paint
- Families: Combobox, NumberField, Select, Textarea, InputGroup
- Category: interaction
- Severity: low
- Type: FIX
- What:
  - The React tests are server-rendered string checks. Combobox keys, NumberField keys, scrub and repeat, and form reset have no committed tests; the headless Edge scripts live in the scratchpad.
  - `cohesion.test.mjs` does not include `.area-select::picker(select)` in the lift check, Select options in the row-plate check, NumberField or InputGroup in the "disabled without opacity" check, or any resting-shadow rule (which would have caught B-2).
- Evidence: `packages/react/tests/cohesion.test.mjs:25-70`; the Combobox and BoxField tests are in `dialog.test.mjs:88-130`.
- Visual: none.

### B-33  The file input's button label is 500 on a transparent control
- Families: Input (`type="file"`)
- Category: system-rule
- Severity: low
- Type: DECISION
- What: `::file-selector-button` is a transparent, unfilled label at `weight-strong` (500). The type rule reserves 500 for "labels on fills". Code block's toggle was moved 500 → 400 for the same reason.
- Evidence: `input.css:136-146`; `input.md:109`; `cohesion-audit.md` ("the toggle label was 500 on a transparent control" → 400).
- Options:
  - A: 400, transparent.
  - B: Keep 500 and give it a soft Button plate.
- Recommended: A, to be consistent with the Code block fix.
- Visual: the file Input, current vs A.

## Confirmed consistent

- Heights: every field uses `control-sm/md/lg` (28 / 32 / 40), the same tiers as Button.
- Text inset: Input, Select, NumberField and Textarea start text on the shared equal-inset rule (10.03 padding plus 1px border at md, 9 / 11 / 15 from the outer edge).
- Trailing glyph position: Input trailing icon, Select chevron and Combobox chevron all land 6 / 8 / 12 from the end at sm / md / lg.
- Field edge, hover edge, fills and text come from one alias chain (`textarea-*` and `select-*` → `input-*` → `edge-control` / `border-faint`).
- Soft fields are flat (no shadow) in Input, Textarea, NumberField, Select and InputGroup.
- Disabled text fields use field paint with no opacity (Input, Textarea, Select, NumberField, InputGroup, Composer); the cohesion test covers four of them.
- Validation tone holds through focus in Input, Textarea, Select, NumberField and InputGroup.
- Select option plates: hover `bg-component-hover`, checked `bg-component-active`, and checked keeps its plate under hover.
- Floating lift: Combobox (through `.area-menu`) and the Select picker paint Notion's `0 20 24` + `0 5 8` at half strength over `border-decorative`, with the container radius and 4 inset.
- Weights: every label, option, group label and caption is 400. The only 500 is the file button (B-33).
- No palette rungs are used directly. Literals are marked `/* spec */`, except the #888 chevron (documented).
- Framework-free defaults: every base rule renders md and outline, matching the React defaults.
- Logical properties throughout, apart from the items in B-15 and B-27. RTL chevrons flip; the Combobox list anchors to the logical start.
- Refs forward to the native element (Input, Textarea, Select, NumberField and Combobox → input, textarea or select; InputGroup, Field and BoxField → div).
- Field wires `id`, `aria-labelledby`, `aria-describedby`, `aria-errormessage`, `aria-invalid`, `required` and `disabled` to Input and NumberField, with tests.
- NumberField: spinbutton semantics, bounded arithmetic, form reset and a canonical hidden value, with tests.
- Combobox's base APG wiring: `role=combobox`, `aria-autocomplete=list`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, a toggle out of the tab order, and disabled options skipped.
- Gallery: one size per tile for all eight families. Example people are Irene Yamaguchi plus teams.
- Motion: every field transition uses the motion tokens (durations go to 0 under `motion="none"`). The Combobox list inherits Menu's popover motion, including reduced motion.
