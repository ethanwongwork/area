# Radio spec

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
| size | md (default), lg (sm removed 2026-09-28); the box follows the type size (2026-10-14) | Label type follows the tier | Untitled sm 16 / md 20 |
| variant | `card`: a contained, full-width option with the control at the end, as Checkbox's card (owner 2026-09-28) | Owner references (plan and registration pickers); shadcn Choice Card | gallery `card`, `card-tile` |
| layout (card) | row (default): visual, text and control on one line; tile: visual above the label, control in the top-end corner; preview: the visual centred as the option's own picture, the label centred under it, no control drawn, the card a soft ground (2026-10-21). Read only with `variant="card"` (forms.tsx:318) | Owner reference 1; the owner's Appearance picker; Radix RadioCards | gallery `card`, `card-tile`, `card-preview` |
| state | checked, disabled; group invalid | Native states; RadioGroup `error` | Untitled: checked, disabled |
| orientation (group) | vertical (default), horizontal | Settings stacks vs inline choices | Untitled group gap 16 |
| composition | description (`caption` is an alias), `leadingVisual` | Option caption; decorative context beside the text | Untitled label + hint |

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
control  input.area-radio__control  radius-full (choice.css:161-163)
  ::after  dot, --_dot (6 / 8) centred on the border box, radius-full (choice.css:206-211, 455, 461)
visual   span.area-radio__visual  `leadingVisual`, aria-hidden, fg-muted (20px, fg-default in a tile)
card     label.area-radio--card  1px edge-control, radius-container, bg-surface, inset 12 (compact 8)
         to the content, border counted once; control moved to the end (choice.css:104-159)
```

The label's first line centres on the glyph through inset.css:264-265, which overrides
choice.css:166 (`align-items: center`) wherever `text-box` is supported; a card aligns to the
first line (choice.css:117-119).

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
| control · size | md **`--area-mark-box`** (14 at type 12–13, 16 at 14, 18 at 15, 20 at 16), lg four larger: **16 / 20 at type 14** (choice.css:465-476) | Untitled 16 / 20; audit rule "one glyph ladder"; the products' glyphs are 16 | Was 12 / 16 / 20; was a fixed 16 / 20 at every type size until 2026-10-12 / 10-14 |
| rest edge | **`edge-control-hover` #d4d4d4** (choice.css:48-53) | Notion's glyph edge ≈ #d4; Untitled #d4d4d4 (second pass) | Was `edge-control` #e2e2e2 |
| dot | **6 at md, 8 at lg**, at every type size (`--_dot`, choice.css:455, 461; 2026-10-07, 2026-10-14) | Untitled 6 / 8 | Was a 30% inset (5.6 / 7.2), which put the dot's edge on fractional pixels; an even dot in an even box centres exactly |
| checked | `selection-solid` (neutral by default), dot `fg-on-selection` (choice.css:19-31, 213-225) | Owner 2026-09-26; emphasis roles 2026-09-29 | Untitled brand-600 |
| shadow, focus, hover | as Checkbox | Peer consistency | — |
| label gap | 6 at md and lg, the density tokens, as Checkbox (choice.css:12, :469, :475) | Peer: Checkbox, Button (audit S14) | Was 8 |
| group spacing | options `ui-stack` (6, compact 4) below the legend, `ui-cluster` (8, compact 6) between rows, horizontal columns 16 (compact 12); description and validation `ui-stack` from what is above (choice.css:323-342, 420) | Untitled horizontal gap 16; Field's gaps (audit C-27 A; spacing audit 2026-10-17) | Options were 12 below the legend; validation was 12 |
| card | 1px `edge-control`, hover `edge-control-hover`, chosen edge `stroke-selected` at `selected-width` (Selected stroke, 2; was 1px, darker not thicker), drawn inside, over `selected-tint`; `radius-container`; inset 12, compact 8; cards in a group 8 apart, tiles in equal columns at least 144 wide (choice.css:99-159, 384-398) | Owner references 2026-09-28; shadcn Choice Card | — |
| disabled | `opacity-disabled` (50%) on the label; a disabled group dims once as a whole, legend included, and its options do not dim again (choice.css:33-37, 344-346) | Audit rule; Untitled 50%; audit C-27 A | Not doubled |

## States

| State | Changes | Evidence |
|---|---|---|
| hover, unchecked | edge → `edge-control-strong` #b4b4b4 (choice.css:273-274) | not captured |
| hover, checked | fill → `selection-solid-hover` (choice.css:261-262) | not captured |
| hover, card | card edge → `edge-control-hover` (choice.css:124-125) | not captured |
| focus-visible | 2px focus outline, 2px offset (choice.css:284-287); on a card the ring moves to the card (choice.css:130-135, 289-290) | not captured |
| checked | fill `selection-solid` at once; dot `scale` 0.6 → 1 + `opacity`, `fast` ease-out (Motion, 2026-10-07) | `area--selected` |
| group invalid | unchecked edges `fg-danger-vivid`; the checked option `danger-solid` with `fg-on-danger` dot; message in danger ink | `area--invalid` |
| disabled | `opacity-disabled` (50%) | `area--disabled` |

## Behavior and accessibility

Native `input type="radio"`; RadioGroup shares `name` (generated when omitted, so the options
always form one native group), controlled/uncontrolled `value` and `disabled` through context
(forms.tsx:225-299); `onValueChange(value, event)`; a form reset returns an uncontrolled group to
its `defaultValue`. Arrow keys are the browser's. A card keeps the native label as its click target
and DOM order, so keyboard order and the accessible name are unchanged; `leadingVisual` is
`aria-hidden`. Group description and error are wired through `aria-describedby`; `aria-invalid` on the fieldset.
Forced colours: forced-colors.css:43, 55-73 (Canvas control, CanvasText edge, Highlight when checked, HighlightText dot; a chosen card's edge Highlight); not verified in a forced-colours browser.

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

## Review note, 2026-10-21

- **What changed:** a chosen card's edge is 2px vibrant blue, drawn inside (was 1px, darkened to the checked colour); the control keeps its checked colour.
- **Why:** your picks on the state page (2026-10-21), now the defaults of the new state settings (Inspector: Stroke, Shadow, Fill): ChatGPT's 2px selected tile. This replaces 2026-09-28's "darker, not thicker".

## Feedback log

- 2026-10-21 · owner, the Theme setup's choices: "i want to separate the choices from the visual ... they should be
  consistent, cohesive, simple visuals that convey the choice well ... research and look into choice card ui, maybe the
  cards can have centered text" and an Appearance picker reference (soft grey cards, a centred window, the label under
  it, the chosen card ringed) → `layout="preview"` (Radix RadioCards, macOS Appearance, Untitled UI's theme cards): the
  card a soft `bg-subtle` ground with no edge at rest, the visual a frame at `--area-choice-ratio` (4 / 3), the label
  centred, the control hidden (the card is the indicator; keyboard and name stay native), the chosen card's selected
  stroke; a group lays previews in equal columns of `--area-choice-min` (104). choice.css, manifest, a gallery tile.

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
- 2026-10-14 · all-axis audit → the box now follows the type size (`.area-radio--md` set a fixed 16, overriding the 2026-10-12 base rule); lg is four larger; the dot stays 6 / 8, centred on whole pixels → choice.css.
- 2026-10-21 · owner's picks on the state page (https://claude.ai/artifact/3uKMHRhpWnPqNA6pK4WfD9) and "capture some of these options as options for the design system customization … keep my current selections as the default" → a chosen card's edge is Selected stroke's width (2) in the indicator rung, its 1px edge topped up by an inset ring, so nothing moves; this supersedes 2026-09-28's "darker, not thicker" (the owner picked ChatGPT's 2px tile). choice.css.

## Spacing audit (2026-10-17)

Group rhythm: as Checkbox group, the description and validation sit `ui-stack` (6, compact 4) from what's above (validation was 12). Measured in `docs/research/spacing-2026-10-17/` (Before / After: https://claude.ai/artifact/JtDZ9LNfutFyfdkGUvQzL2).

## Review note, 2026-10-22 (round 68)

- **What changed:** a group's description sits 2 under its legend (was 6), exactly as a choice's own description sits under its title, and the options now start 12 below that text (was 6), one step more than the 8 between options (Compact: 8, was 4).
- **Why:** the gap and text pass across every family (your note: one intentional logic for the gaps between labels, titles and their copy). A title and the line under it now join with no gap everywhere, the rule you set on Card (Figma and Notion 11.5). Before, the same pair sat 10.5 to 20 apart depending on the family. DESIGN_SYSTEM.md, "Text pairs". Your follow-up: the description sat closer to the first option (6) than the options sit to each other (8), so the text read as a label for the first option only. Text that introduces a set now stands one step further from it than the items are apart.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.
