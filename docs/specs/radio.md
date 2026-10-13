# Radio spec

**Status:** accepted · 2026-09-28 (batch 14: cards, sm removed; was: in review · 2026-09-26 (cohesion audit, second pass))
**Captures:** `docs/research/captures/radio/`; glyph-edge evidence in
`checkbox/notion--checkbox--rest--light`, `checkbox/figma--checkbox-checked--rest--light`
**Peers:** Checkbox (shared stylesheet, glyph ladder and paint), Segmented (short exclusive
sets), ColorSwatchPicker and AlignmentPicker (radio-semantics pickers), Switch

## Owner decisions

- 2026-09-26: **Neutral by default, accent by override** (DESIGN_SYSTEM.md, "Color and
  focus"). The checked face is `neutral-solid` with an `fg-on-neutral` dot; `tone="accent"`
  opts into the accent. Recorded with the Alignment
  picker's decisions ([alignment-picker.md](alignment-picker.md)) ("Checkbox, Radio and Chip moved the same way … all four await owner review"; all approved since). *Superseded 2026-09-29 (owner, D1): accent is the Selection emphasis role, set by a theme (`data-area-selection="accent"`); the `tone` axis was removed.*
- 2026-09-26 (second pass, owner: decide every open item): choice glyphs take the control
  hover edge at rest (#d4d4d4), with Notion and Untitled
  ([cohesion audit](../research/cohesion-audit.md#second-pass-notion-figma-and-the-open-decisions)).

## Job and boundaries

Radio picks one option from a mutually exclusive set, inside RadioGroup (a native
`fieldset`). A short set of view modes belongs in Segmented; independent options in
Checkbox.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | md (default), lg (sm removed 2026-09-28) | Label type follows the tier | Untitled sm 16 / md 20 |
| state | checked, disabled; group invalid | Native states; RadioGroup `error` | Untitled: checked, disabled |
| layout (group) | vertical (default), horizontal | Settings stacks vs inline choices | Untitled group gap 16 |
| composition | description | Option caption | Untitled label + hint |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | No radio; the table-view checkbox is the nearest glyph (edge evidence) | app.notion.com, returns table view, 2026-09-26 | evidence only | `checkbox/notion--checkbox--rest--light` |
| figma | target product | No radio; the inspector checkbox is the nearest glyph | figma.com editor inspector, 2026-09-26 | evidence only | `checkbox/figma--checkbox-checked--rest--light` |
| uui | design system (source) | Radio buttons | `components/base/radio-buttons/radio-buttons.tsx:30-118` at `4702dc0` ([reference](../research/untitled-ui-reference.md)) | MIT | source reading only |
| area | this system | 10 gallery tiles (re-captured after the second pass) | localhost gallery | — | `area--*` (10) |

Target products searched without an equivalent: ChatGPT (sidebar, profile menu, model
picker, settings card); Notion (page menu, Share popover and its permission select, tasks
board, returns table view); Figma (file browser, editor inspector, layers, main menu). Each
exclusive choice there is a select, a segmented control or a menu, not a radio.

## Anatomy

Shared with Checkbox (choice.css). Differences:

```
control  input.area-radio__control  radius-full (choice.css:108-110)
  ::after  dot, --_dot (6 / 8) centred on the border box, radius-full (choice.css; 2026-10-07)
```

The label's first line centres on the glyph through inset.css:185-195, which overrides
choice.css:113 (`align-items: center`) wherever `text-box` is supported.

## Measurements

Read from the nodes of `area--*` (after the second pass) and the product checkbox files:

| Node · property | Area sm | Area md | Area lg | Notion checkbox | Figma checkbox |
|---|---|---|---|---|---|
| control box | 16 × 16 | 16 × 16 | 20 × 20 | 16 × 16 | 16 × 16 |
| rest edge | 1px rgb(212) | same | same | 1 device px, 19% warm black (≈ rgb(212, 211, 207), arithmetic) | 1px 20% black |
| dot (checked) | 5.6 | 5.6 | 7.2 | — | — |
| label type / cap top | 12/16 / 3.74 | 14/20 / 3.02 | 14/20 / 5.02 | — | 11/16 450 |
| checked fill / dot | rgb(40) / rgb(250) | | | | |
| accent fill / dot | rgb(92, 93, 254) / #fff | | | | |
| invalid edge | rgb(207, 3, 60) | | | | |
| group | legend 14/20; options 12px below; 8px between 24px rows; horizontal columns 16 | | | | |

Captures: `area--size-small`, `-medium`, `-large`, `area--selected`, `area--tone-accent`,
`area--invalid`, `area--horizontal`, `area--description`, `area--default`.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| control · size | **16 / 16 / 20** (choice.css:315-330) | Untitled 16 / 20; audit rule "one glyph ladder"; the products' glyphs are 16 | Was 12 / 16 / 20 |
| rest edge | **`edge-control-hover` #d4d4d4** (choice.css:48) | Notion's glyph edge ≈ #d4; Untitled #d4d4d4 (second pass) | Was `edge-control` #e2e2e2 |
| dot | **6 at 16, 8 at 20** (`--_dot`, 2026-10-07) | Untitled 6 / 8 | Was a 30% inset (5.6 / 7.2), which put the dot's edge on fractional pixels; an even dot in an even box centres exactly |
| checked | `selection-solid` (neutral by default), dot `fg-on-selection` (choice.css:20-22) | Owner 2026-09-26; emphasis roles 2026-09-29 | Untitled brand-600 |
| shadow, focus, hover | as Checkbox | Peer consistency | — |
| label gap | 6 at md and lg, as Checkbox (choice.css:9, :404, :410) | Peer: Checkbox, Button (audit S14) | Was 8 |
| group spacing | options `space-12` below the legend, `space-8` between rows, horizontal `space-16` columns (choice.css:243-256) | Untitled horizontal gap 16 | Vertical rows keep Checkbox's 8 |
| disabled | 50% on the label; group `:disabled` the same (choice.css:37-41, 259) | Audit rule; Untitled 50% | Same element, so not doubled |

## States

| State | Changes | Evidence |
|---|---|---|
| hover, unchecked | edge → `border-hover` #b4b4b4 (choice.css:190-193) | not captured |
| hover, checked | fill → `selection-solid-hover` | not captured |
| focus-visible | 2px focus outline, 2px offset (choice.css:200-204) | not captured |
| checked | fill `selection-solid` at once; dot `scale` 0.6 → 1 + `opacity`, `fast` ease-out (Motion, 2026-10-07) | `area--selected` |
| group invalid | unchecked edges `fg-danger-vivid`; the checked option `danger-solid` with `fg-on-danger` dot; message in danger ink | `area--invalid` |
| disabled | 50% | `area--disabled` |

## Behavior and accessibility

Native `input type="radio"`; RadioGroup shares `name`, controlled/uncontrolled `value` and
`disabled` through context (forms.tsx:232-266); arrow keys are the browser's. Group
description and error are wired through `aria-describedby`; `aria-invalid` on the fieldset.
Forced colours: forced-colors.css:47-63 (Canvas control, CanvasText edge, Highlight when checked, HighlightText dot); not verified in a forced-colours browser.

## Peers and consistency

| Peer | Shared role | Area value in peer | Radio | Match / reason |
|---|---|---|---|---|
| Checkbox | glyph ladder, rest edge | 16 / 16 / 20, #d4d4d4 | same | match (shared choice.css) |
| Checkbox, Switch | checked paint | `selection-solid` | same | match (Selection role) |
| Checkbox, Switch, Button | disabled | 50% | same | match |
| ColorSwatchPicker, AlignmentPicker | selected marker | Selection role: neutral by default, accent by theme | same | match |

## Visual pass

The gallery groups the tiles (Default, Tones, Sizes, Layout
with the horizontal group, Content with the description, States with validation and
disabled). The validation, description and horizontal tiles were added in the second
pass. No product radio exists to compare against (ChatGPT's mode choice is radio cards,
`chatgpt--mode-radio-cards`). 2026-09-28 (batch 14): control and label centre on each other at
every size; sm and md differ only by the label gap, as Checkbox (settled 2026-09-28: sm removed).
Unverified: dark theme, hover and focus in a product.

## Verification

10 Area captures after the second pass read (edges rgb(212) at rest). Build and test
results are in the [cohesion audit](../research/cohesion-audit.md#verification).

## Motion and interaction, 2026-10-07

Contract: [`docs/MOTION.md`](../MOTION.md). Radio shares `choice.css` with Checkbox; see
[checkbox.md](checkbox.md#motion-and-interaction-2026-10-07) for the shared mark motion.

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

**Crispness.** The dot was `inset: 30%` of the 14px padding box: a 5.6px dot at a 4.2px offset,
soft on every side. It is now an even dot in an even box, so it centres on whole pixels:
`--_dot` 6px at md (border-box 5–11) and 8px at lg (6–14), `inset: (size − dot) / 2 − 1px`.
Untitled draws 6 / 8 (the Decisions row's basis), so the value now matches its source exactly.

**Verified** (`/radio.html`, Chromium, DPR 2): `::after` computes `inset: 4px; width: 6px` at
md and `5px / 8px` at lg; unchecked rests at `opacity 0, scale 0.6`, checked at `1 / 1`. Setting
`checked` from script starts the fill and edge transitions (100ms ease-out) and the dot's
`scale` and `opacity` (100ms ease-out). Not verified by eye (background tab), nor arrow-key
selection with a real keyboard.

**Open questions.** None beyond Checkbox's.

## Feedback log

- 2026-09-28 · owner approved batch 14 → Complete.

- 2026-09-28 · owner: chosen card stroke darker, not thicker → 1px border in the checked colour,
  inset ring removed (shared with Checkbox, `choice.css`; see checkbox.md).

- 2026-09-28 · owner references (plan and registration pickers) → Radio gains Checkbox's card
  variant and row / tile layouts, with `leadingVisual` and `caption` (docs/specs/checkbox.md,
  feedback log) → gallery `card`, `card-tile`.

- 2026-09-28 · owner: "do whatever you think would be best, maybe dropping small?" → `size`
  is md (16) and lg (20); sm removed from the manifest, CSS, demos and docs, since with 14/20
  small-control text it differed from md only by a 4px gap. Notion and Figma ship one 16px size.

- 2026-09-26 · neutral-by-default sweep → `tone` axis, neutral checked face →
  `area--tone-accent`, `area--selected`.
- 2026-09-26 · cohesion audit → sm glyph 12 → 16 (ladder 16 / 16 / 20, shared with
  Checkbox) → `area--size-small` (16 × 16).
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → rest edge
  #e2e2e2 → #d4d4d4 and hover #b4b4b4 (shared with Checkbox); invalid, description and
  horizontal tiles added; no product radio found → `checkbox/notion--checkbox--rest--light`,
  `checkbox/figma--checkbox-checked--rest--light`, `area--size-medium`, `area--invalid`,
  `area--horizontal`, `area--description`.
- 2026-09-27 · owner flagged the invalid group → a checked option in an invalid group takes the danger fill, as a single invalid Checkbox does (`choice.css`); the group now reads as one error state → headless Chromium.
- 2026-09-30 · audit S14 (owner) → the label gap is 6 at md and lg (was 8), shared with Checkbox (choice.css:9, :404, :410; density.ts:81-82).
- 2026-10-02 · compact pass round 9 → horizontal options 16 → 12; the choice card inset 12 → 8 and the tile's icon gap 16 → 12 at compact (choice.css). Default unchanged. docs/research/compact-pass-2026-10-01.md (round 9).
- 2026-10-03 · radius audit D1 (owner) → the container role is 12 at compact too (was 8; Figma 13, Cursor 12-14), so this family's surface is 12 at both densities; rows concentric with a floating surface follow (compact 24 rows r8). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → dot 6 / 8 centred on whole pixels (was a 30% inset, 5.6 / 7.2); dot `scale` 0.6 → 1 + opacity on `fast` ease-out (was scale 0 on the spring); hover, press and arrow-key selection land at once and fade out over `fast` (`choice.css`; "Motion and interaction, 2026-10-07").
- 2026-10-12 · owner, 2026-10-12: "go with your recommendations" (consistency pass) → the unchecked hover edge reads `edge-control-strong` (O5: one role for a literal written in several families; same paint). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · type size and density split (owner) → the radio shares Checkbox's box, `--area-mark-box` (14 / 14 / 16 / 18 / 20 for type 12–16; `choice.css`). `docs/research/ui-size-scale-2026-10-12.md`.
