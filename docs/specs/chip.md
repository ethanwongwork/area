# Chip spec

**Captures:** `docs/research/captures/chip/` (Area tiles, `notion--board-tag`, `notion--select-tag`)
**Peers:** Badge (display counterpart), Segmented (one-track choice), Button (control tier and inset), Avatar (initials), Alert / Badge dismiss (remove plate), Checkbox / Radio (neutral selection)

## Owner decisions

- 2026-09-26: **Neutral by default, accent by override** (DESIGN_SYSTEM.md). The note
  recorded under Alignment picker in [prior decisions](PRIOR_DECISIONS.md) applies here:
  "Checkbox, Radio and Chip moved the same way (neutral-solid checked face; neutral tonal
  chip selection); all four await owner review." Selected chips use a neutral tonal fill;
  `tone="accent"` restores the accent fill. *Superseded 2026-09-29 (owner, D1): the selected
  paint is the Selection role (`selection-surface`, `-edge`, `fg-selection`; chip.css:127-142),
  accent by theme; the `tone` axis was removed. All four families are approved.*
- 2026-09-26: audit every family accepted under the earlier process (cohesion audit).
- 2026-09-26 (second pass): decide every open item with the most calculated option
  consistent with the system. Nothing in that pass changed Chip.

No Chip section existed in [prior decisions](PRIOR_DECISIONS.md).
- 2026-09-27: "the backplate of the hover state of the close button on chip does not look correct."
- 2026-10-19 (review page, docs pass): ChipLink follows the Pills setting and the `pill` prop like Chip (`pill={false}` draws the radius corner).

## Job and boundaries

A filter Chip is an independent toggle, one of a wrapping set too long for a Segmented track
(several can be on; there is no single selection), or it represents an entered value (input),
an assist action or a suggestion; ChipLink navigates. ChipGroup lays the set out. It is interactive;
Badge states a value and cannot be pressed (DESIGN_SYSTEM.md, Icons and technical labels).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| kind | filter (default), assist, input, suggestion | Interaction role (`chip.css:91-107`); assist, suggestion and filter look identical at rest, so the gallery groups the kind tiles under Behavior, not as visual variants (audit C-32 A, owner 2026-09-30) | Untitled Tags (input with close, checkbox selection) |
| size | sm 28, md 32 (default), lg 40 | Control tiers | Untitled sm 24 / md 24 / lg 28; Notion value tags 20 |
| booleans | `swatchOnly`, `link`, `linkIcon`; `pill` / `rounded` (React `pill` three-way: unset follows `data-area-pills`, which lists `chip` by default; `pill={false}` is `--rounded`, the radius setting's corner) | Colour choices; navigation; one corner setting (2026-10-03, 2026-10-04) | Gallery `swatch`, Composition / swatch only, `link-*` |
| composition | swatch, icon, avatar, image, remove, custom remove; ChipLink adds a trailing icon (`treatment="icon"`) | Visual leading item; removable values | Untitled close button; Gallery tiles |
| state | selected, disabled, invalid | — | Gallery `group`, `disabled`, `invalid` |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | Composer tool pill ("Web search"), rest and hover: a 36 pill, 16/26 muted; hover washes the whole pill 5% black and swaps the 16px icon for a 16px × in the same slot | chatgpt.com, logged in, 2026-09-27 (UI state only; nothing sent) | evidence only | `chatgpt--composer-tool-pill--{rest,hover}--light` |
| systems | design systems (source) | Remove button: Primer Token, Material input chip, Fluent Tag, Polaris Tag, Carbon Tag, Spectrum 2 TagGroup | Primer @6794582, Material Web @cbd34a8, Fluent @8add8c8, Polaris @3f7954a, Radix Themes @1faff10, shadcn @98a1fe6, Carbon @7e8c8f7, React Spectrum @16eead6, Base UI @45a75a5 | MIT / Apache | source reading |
| uui | design system (source) | Tags | `untitleduico/react@4702dc0`, `components/base/tags/tags.tsx:62-172`, `tag-checkbox.tsx:17-24` ([reference](../research/untitled-ui-reference.md)) | MIT | none |
| notion | target product | Entered values: a select-property tag on a board card and in a table cell | app.notion.com, owner's "tasks" board and "returns" table, light, read-only, 2026-09-26 | evidence only | `notion--board-tag--rest--light`, `notion--select-tag--rest--light` |
| area | this system | Gallery tiles, re-taken after the second pass | localhost gallery | — | `chip/area--*` (22) |

No interactive chip (a pressable filter or suggestion) was found. Searched: ChatGPT's sidebar,
header, menu and settings; Notion's page menu, Share popover, board and table (no filter
pill was captured; the only toolbar control is an icon button, `button/notion--toolbar-icon`);
Figma's file browser and editor (its file-browser filter is a bordered select,
`select/figma--filter-select`). The two Notion tags are the values a multi-select holds, the
nearest match for the `input` kind; the Badge spec uses the same files for display tags.

## Anatomy

```
uui      span 24 (sm/md) / 28, radius 6, white, neutral-300 ring; close 14/16/20, hover neutral-50
notion   div 20 high, radius 4, padding 0 6, translucent tone fill, no border; label 14/20
area     button.area-chip (or span wrapper when removable)  owns: tier height, 1px border, pill radius, fill, focus
  visual span __swatch / __avatar / __image  20px (icon 16 + 4) · __icon 16px, fg-muted
  label  span __label
  action button __action  (removable + clickable)
  remove button __dismiss  circle 20 / 24 / 32 (`--_remove`), concentric radius, fg-muted, Area dismiss glyph 16
  trailing span __trailing-icon  ChipLink with `treatment="icon"`, 16px, fg-muted
```

Inset equation (`inset.css:7-19, 42, 85-105`): text (32 − 9.94) / 2 − 1 = 10.03; icon
(32 − 16) / 2 − 1 = 7; visual (32 − 20) / 2 − 1 = 5. A trailing remove control reserves its
16px box like an icon (`inset.css:97-99`): (32 − 16) / 2 − 1 = 7; the old −2px start margin
is gone (cohesion audit, spec defects).

## Measurements

`node scripts/capture-compare.mjs` (shell) plus item nodes:

| slot · property | area · default | area · size-sm | area · size-lg | area · input | area · invalid | area · swatch | area · avatar-initials |
|---|---|---|---|---|---|---|---|
| **shell** size | 51.8 × 32 | 44.97 × 28 | 59.8 × 40 | 55.1 × 32 | 73.8 × 32 | 84.38 × 32 | 86.06 × 32 |
| **shell** padding | 0 10.03 0 10.03 | 0 8.74 0 8.74 | 0 14.03 0 14.03 | 0 10.03 0 10.03 | 0 10.03 0 10.03 | 0 10.03 0 5 | 0 10.03 0 5 |
| **shell** border | 1 solid #e2e2e2 | 1 solid #e2e2e2 | 1 solid #e2e2e2 | 1 solid transparent | 1 solid rgb(242, 219, 225) | 1 solid #e2e2e2 | 1 solid #e2e2e2 |
| **shell** radius | 9999px | 9999px | 9999px | 9999px | 9999px | 9999px | 9999px |
| **shell** gap | 8px | 4px | 8px | 8px | 8px | 8px | 8px |
| **shell** font | 14px/20px 400 Geist | 12px/16px 400 Geist | 14px/20px 400 Geist | 14px/20px 400 Geist | 14px/20px 400 Geist | 14px/20px 400 Geist | 14px/20px 400 Geist |
| **shell** color | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(207, 3, 60) | rgb(40, 40, 40) | rgb(40, 40, 40) |
| **shell** background | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(247, 247, 247) | rgb(251, 245, 245) | rgb(255, 255, 255) | rgb(255, 255, 255) |

(The capture writes the border as `color(srgb 0.886275 …)`, which is #e2e2e2.) The shell gaps predate audit S14: the gap is now 6 at sm, md and lg.

Notion (shell): `notion--board-tag` 44.17 × 20, padding 0 6, radius 4, 14px/20px 500, fill
rgba(92, 0, 163, 0.14), ink rgb(85, 59, 105); `notion--select-tag` 39.69 × 20, padding 0 6,
radius 4, 14px/20px 400, fill rgba(127, 51, 0, 0.157), ink rgb(88, 68, 55). No border, no
remove control at rest.

Item nodes:
selected neutral chip (`area--group`) rgb(238, 238, 238); accent selected (`area--tone-accent`)
rgb(234, 238, 253) with ink rgb(72, 62, 223); remove button 16 × 16, ink rgb(102, 102, 102)
(`area--delete`); avatar 20 × 20 at 6px, initials 12px/12px 500 rgb(102, 102, 102) on
rgb(238, 238, 238) (`area--avatar-initials`); disabled opacity 0.5.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| base tier | **md** 32 / gutter 12 / 14/20 (`chip.css:23-33`) | Manifest default `size: "md"` (`manifest.ts:432`) | Was sm (28) in CSS while React defaulted to md |
| height | 28 / 32 / 40 | Peer: Button tiers; audit decision 18 | Untitled 24 / 24 / 28; Notion's value tags 20; kept (third pass): Notion's tags are Badges in Area |
| radius | pill by default (`data-area-pills` lists `chip`); `pill={false}` takes the radius setting's corner for its height, swatch and remove concentric; avatars and images stay round (`chip.css:20-22, 51, 189, 302-303`) | Area: Chip is the pill control; one corner setting (owner 2026-10-03) | Untitled 6, Notion 4 |
| label weight | 400 | Weight policy (a choice, not a label on a fill); one weight per state; Notion select tag 400 | Untitled 500; Notion board tag 500 |
| rest paint | `bg-surface` + 1px `edge-control` #e2e2e2 | Untitled white + neutral-300 ring | Lighter edge than Untitled's #d4d4d4 |
| hover | `bg-component-hover` #f3, edge `edge-control-hover` #d4 (`chip.css:72-78`) | Audit row/control hover | — |
| pressed | `bg-component-pressed`, one step past hover; input 15.4% (24% white in dark); invalid `danger-surface-active`; selected keeps its hover plate; pressing remove does not press the chip (`chip.css:80-83, 104, 112, 138`) | Interaction polish 2026-10-16 | — |
| selected | Selection role, the accent by default (neutral before 2026-10-22): `selection-surface` = `bg-component-active` #eeeeee, `selection-edge` = #d4, `fg-selection` = default ink; hover edge `edge-control-strong` (mixed toward `edge-accent` by the selection accent; `chip.css:127-142`; owner 2026-10-12, O5) | Owner rule; audit: selection one step above hover; emphasis roles (D1) | Untitled shows selection only in an embedded checkbox |
| selected, accent theme | `accent-surface`, `edge-accent`, `fg-accent` through the same role tokens | Theme's Selection accent (was `tone="accent"` until 2026-09-29) | — |
| input kind · paint | **Count's translucent plate, `bg-mark`** (6% black / 10% white), hover `bg-mark-hover` (10.7% / 22.6%), transparent border, hover edge `edge-control-hover` (`chip.css:98-107`; tokens since owner 2026-10-12, O5) | Area input-chip rule; audit S6a (owner 2026-09-30), shared with Badge neutral soft and Count soft | Was `bg-component` #f7 (`area--input`), a lighter hole on a hovered #f3 row. Notion's values are tone-tinted; Area chips carry no tone by value (Badge does) |
| remove · target | **a circle 4 inside the pill: 20 / 24 / 32** (`--_remove`, chip height − 8), concentric with the pill's end; the chip's end inset is that 4 | Material 24 circle in a 32 chip (`_trailing-icon.scss L18-22`); Primer, Carbon, Spectrum 2 make it the chip's height; chip trailing padding 0 (Primer, Polaris, Carbon, Spectrum 2) | Was the 16px glyph box, so the hover plate hugged the glyph (owner: "does not look correct") |
| remove · glyph | 16, the Area `dismiss` Glyph, at every size (`primitives.tsx:1014`) | Primer 12 in 16/20, 16 in 24/32 (`_RemoveTokenButton.tsx L39,58`) | Was a Fluent `dismiss_16` path until audit S9 |
| remove · hover | **plate `currentColor` 12%** on the circle, pressed 20%; ink fixed `fg-muted` (`chip.css:265-268`) | Audit: foreground fixed; peer Alert dismiss; systems use a subtle neutral fill on the button alone | ChatGPT washes the whole pill instead; Area keeps the remove a separate target beside the chip's own action |
| avatar initials | **12px** (`--area-control-xs-text`: 12 default, 11 compact), as Badge's avatar | Type ramp floor 12; Figma 12 and Notion 11 on a 24 avatar | Was 10px, off the ramp; then 14 when `control-sm-text` moved to 14/20 for small controls (2026-09-26), which overflowed the 20 plate (fixed 2026-09-28) |
| visual box | 20px (icon 16 + 4) | Inset contract | — |
| icon → label gap | 6 at sm, md and lg, the density tokens `--area-gap-sm/md/lg` (`chip.css:25, :287-289`); compact sm 4 | Peer: Button (audit S14) | Was 4 / 8 / 8 |
| group gap | `ui-cluster`: 8, compact 6, wrapping (`chip.css:297-301`) | Material's chip set 8 / 8 (audit C-27 A, owner 2026-09-30); compact pass round 9 | Was 4 |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover | fill #f3, edge #d4; ink fixed | not captured |
| focus-visible | the 2px `focus-color` ring alone, at `focus-offset` (`chip.css:86-89`, audit C-13); nested action and remove ring at 0 (`chip.css:269-274`); forced colours Highlight | not captured |
| selected | as Decisions; `aria-pressed` on filter chips | `area--group`, `area--tone-accent` |
| pressed | as Decisions (`chip.css:80-83`) | not captured |
| invalid | danger surface, border, ink; remove in `fg-danger` (`chip.css:109-116, 262`) | `area--invalid` |
| disabled | `opacity-disabled` (50%) (`chip.css:144-147`) | `area--disabled` |

## Behavior and accessibility

Filter chips are `button` with `aria-pressed`, controlled or uncontrolled
(`primitives.tsx:944-973`); `onSelectedChange(selected, event)` passes the click event. A removable chip is a `span` holding an optional action button
and a separate remove button, so both are focusable peers. `ref` and native props land on the
primary control (the action, or the remove button when it is the only control); `className`
and `style` on the chip span (audit C-24). The API is Area's one dismiss API:
`onDismiss` shows the remove button, `dismissLabel` names it (default "Remove <text>" for a
text label, else "Remove chip"; audit C-6) and `dismissIcon` replaces the glyph. Backspace or
Delete on a focused chip removes it; focus then moves to the next chip, or the previous one
(`primitives.tsx:981-999`). ChipGroup is `role="group"`, named by `aria-label` (audit C-23,
D-18); `label` remains a deprecated alias (`primitives.tsx:1066-1076`). It adds no roving focus,
each chip keeps its own Tab stop. `onRemove`, `removeLabel` and `removeIcon` remain as
deprecated aliases (`primitives.tsx:926-937, 975, 980`). ChipLink is an `a` with the
`suggestion` kind; it takes no shape override (its `pill` prop is deprecated and ignored,
`primitives.tsx:1038-1039`), so it follows `data-area-pills`. Forced colours paint selected chips
Highlight (`forced-colors.css:49-54`).

## Peers and consistency

| Peer | Shared role | Area value in peer | Chip | Match / reason |
|---|---|---|---|---|
| Button | tier height and text inset | 32, 10.03 | 32, 10.03 | match |
| Menu / Nav / Table rows | hover / selected plates | `bg-component-hover` / `-active` | same pair | match |
| Alert dismiss | dismiss hover | ink 12% plate on tinted alerts; `bg-component-hover` on neutral (a ghost sm Button, audit S9) | ink 12% plate | match on tones; Alert is a rectangle and closes with a Button |
| Badge dismiss | dismiss hover | ink 12% (`badge.css:194`, audit S9) | ink 12% | match |
| Badge neutral soft, Count soft | soft plate | `light-dark(rgb(0 0 0 / 0.06), rgb(255 255 255 / 0.1))`, `bg-mark` | input kind, chip.css:100 | match (audit S6a) |
| Badge | a value shown as a tag | 16 / 20 / 24 (badge.css:178-181; badge.md) | 28 / 32 / 40 pill | different job: Badge displays, Chip is pressed |
| Avatar | initials | 500, ramp sizes | 12px 500 | match |
| Checkbox / Radio / AlignmentPicker | selection paint | Selection role, the accent by default (neutral before 2026-10-22) | same | match |

## Visual pass

The gallery shows the tiles in named groups (Default, Variants, Tones, Sizes, Content, States,
Behavior); the "Composition / swatch only" tile was added in the third pass. Beside Notion's tags, an Area input chip is a larger, quieter control: 32px pill,
grey fill, default ink, against Notion's 20px tinted tag. Not inspected by this spec's
author: hover, remove hover, dark theme.

2026-09-28 (batch 15): beside ChatGPT's composer tool pill (36 pill, 12 / 14 sides, bare at rest,
5% black on hover) and Notion's select tags (20, corner 4, tinted; Badge's role in Area). Area's
chip is a 28 / 32 / 40 pill with a hairline outline, one size step per tier, avatar and remove
slots concentric. No change.

## Settled questions

1. **Entered values: kept as a control.** Notion shows a multi-select's values as 20px tags,
   radius 4, 6px sides, tone-tinted (`notion--board-tag`, `notion--select-tag`); Area's
   `input` chip stays a 32px control-tier pill with a neutral fill. Notion's tags are
   Badges in Area ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)).

## Verification

Compared `chip/area--{default,size-sm,size-lg,input,invalid,swatch,avatar-initials,group,tone-accent,delete,disabled}`
with `notion--board-tag` and `notion--select-tag`. No product capture of an interactive chip
exists. Build and test results are in [the audit](../research/cohesion-audit.md#verification).

## Motion and interaction, 2026-10-07

Contract: [`docs/MOTION.md`](../MOTION.md).

| Interaction | Before | After |
|---|---|---|
| hover (fill and edge) | `--area-transition` over `fast` ease-out, both ways | lands at once (`:hover` 0s), fades out over `fast` ease-out; ink fixed |
| press | eased over `fast` | at once (`:active` 0s) |
| selection toggle | eased over `fast` | by hand at once: pointer or Space is `:active`, Enter acts on a focus-visible chip (or its action button in a removable chip: `:has(> .area-chip__action:focus-visible)`); a change from script fades over `fast` |
| remove plate hover | untimed: at once both ways | lands at once, fades out over `fast` ease-out (`background-color`) |
| focus-visible | outline | unchanged |
| link-icon underline | at once | unchanged (text decoration) |
| reduced motion | tokens | tokens (no literal durations) |

**Crispness.** The swatch's 1px ring was an inset `box-shadow` spread; it is now an inset
`outline` (`outline-offset: -1px`), which snaps to device pixels (MOTION.md "Crispness" 3). Since the 2026-10-12
consistency pass its colour is the swatch ring (`token-swatch-ring`, black 10% / white 10%) at `stroke-width`, as ColorSwatch's. In forced colours the ring is now kept. The remove target is
`height − 8` with a 16px glyph centred (4px each side at md): whole pixels.

**Verified** (`/chip.html`, Chromium, DPR 2): chip transition is the four `--area-transition`
properties at 100ms ease-out; the instant rules are in the served `area.css`
(`.area-chip:is(:active, :focus-visible, :has(…))`, `.area-chip:hover`, `.area-chip__remove:hover`
/ `:active`, all `0s`); the remove button transitions `background-color 0.1s` ease-out; a swatch
computes `outline: 1px solid rgb(247, 247, 247); outline-offset: -1px; box-shadow: none`. Not
verified by eye (background tab), nor with a real pointer or keyboard.

**Open questions.** None.

## Review note, 2026-10-09 (round 4)

- **What changed:** a link chip now shows one underline, under its label. It showed two where only Area's stylesheet is
  loaded: the browser's link underline and the label's. The link chip with an icon also lost a stray underline at rest;
  it underlines only on hover and focus, as designed.
- **Why:** you saw the underline doubled; the chip is a link element and never cleared the browser's default underline.
  The gallery hid it because the docs site resets links.

## Review note, 2026-10-12 (consistency pass)

- **What changed:** A swatch chip's colour circle has the same thin see-through outline as every other colour swatch, instead of a light grey band around it. A remove button's focus ring now sits on the button itself instead of 2 outside it.
- **Why:** You asked for one swatch outline everywhere (round 15); Chip still had the old band, which showed as a grey halo round the colour, most of all in dark mode. It also stays now when the Surface setting is Elevated. You went with the recommendation that a control inside another one rings at 0, as Tag's remove and a field's buttons do; at 2 outside, the ring met the chip's own edge.

## Interaction polish, 2026-10-16

Chips press one step past hover: `bg-component-pressed` (filter, assist, suggestion), 15.4% (the input chip's mark: 6%, 10.7%, 15.4%; 24% white in dark, as far as its label holds 4.5:1 at dark 24 + 8), `danger-surface-active` (invalid). A selected chip keeps its plate. Remove presses at 20% of its ink (hover 12%) and does not press the chip. Link's underline offset (0.25em). See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Review note, 2026-10-17 (round 33)

- **What changed:** Only the underline on link chips: it now sits close under the words, about 1px below the letters,
  instead of 0.25em down. Tails of g, y and p cross it and the line breaks around them. Nothing else changed.
- **Why:** It follows Link, which you asked to underline "very natural and close to the text" (link.md, "Close
  underline").

## Feedback log

- 2026-09-26 · earlier pass the same day → selected chips neutral tonal, `tone="accent"` added
  → DESIGN_SYSTEM.md; `area--group`, `area--tone-accent`.
- 2026-09-26 · cohesion audit → base tier sm → md; remove keeps its ink with a 12% plate;
  avatar initials 10 → 12px → 22 Area captures.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → evidence added,
  no change; entered-value geometry recorded as open → `chip/notion--board-tag`,
  `chip/notion--select-tag`.
- 2026-09-27 · third pass → open question settled, value kept (32px input chip; Notion's
  tags map to Badge); Composition / swatch only tile added → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · owner: remove hover plate wrong → the remove is a 20/24/32 circle 4 inside the pill, concentric with its end, holding the 16px glyph (`--_remove`, `inset.css` end box); `[data-hover]` hook for review specimens → ChatGPT tool pill (rest, hover), nine design systems; Pass review in the gallery.
- 2026-09-28 · batch 5 avatar check (owner: "check avatar in chip") → two initials overflowed the 20px plate: `--area-control-sm-text` had become 14 at default density; now `--area-control-xs-text` (12), as Badge; the avatar slot is `aria-hidden` (the label names the person, as in Badge); demos use Irene Yamaguchi → Claude in Chrome zoom of `chip-avatar-initials` (12px, 10.3 wide in the 20 circle). No product showed a person chip (Notion person properties absent from the owner's databases; Figma and ChatGPT none).
- 2026-09-30 · audit S6a (owner) → input kind takes Count's translucent plate (6% black / 10% white; hover 0.107 / 0.226), was `bg-component` #f7 → chip.css:80-81.
- 2026-09-30 · audit S9 (owner) → the remove glyph is the Area `dismiss` Glyph (was a Fluent path); pills close with a concentric circle, the Area glyph and a 12% ink plate. `onDismiss`, `dismissIcon`, `dismissLabel` added (default label still "Remove chip"); `onRemove`, `removeIcon`, `removeLabel` kept as deprecated aliases → `primitives.tsx:833-845`, `:883-893`.
- 2026-09-30 · audit S14 (owner) → the icon-to-label gap is 6 at sm, md and lg (was 4 / 8 / 8), from the density tokens (`chip.css:22, :244-246`; density.ts:80-82), as Button.
- 2026-09-30 · audit S17 (API vocabulary, slice 1) → `onSelectedChange(selected, event)` passes the click event → `primitives.tsx:827`.
- 2026-10-01 · audit C-6 → a removable chip names its remove "Remove <text>" by default; Backspace or Delete on a focused chip removes it, and focus moves to the next chip (or the previous) → primitives.tsx:886-915.
- 2026-10-01 · audit C-23 (owner pick A) → ChipGroup is `role="group"` with a `label` prop; chips are independent toggles, no single selection (manifest description too) → primitives.tsx:974-984, manifest.ts:301.
- 2026-10-01 · audit C-24 → on a removable chip, `ref` and native props land on the primary control (action, or the remove button when it is the only control); `className` and `style` on the chip span → primitives.tsx:916-923.
- 2026-09-30 · audit C-32 (owner pick A) → kept: assist, suggestion and filter share one rest paint; `kind` is an interaction role, and its gallery tiles are grouped under Behavior.
- 2026-10-01 · audit C-27 (owner pick A) → ChipGroup gap 8 / 8, Material's chip set (was 4) → chip.css:259-262.
- 2026-10-02 · compact pass round 9 → ChipGroup gap reads `ui-cluster` (8, compact 6). docs/research/compact-pass-2026-10-01.md (round 9).
- 2026-10-03 · one corner setting (owner: one radius setting, Sharp and Pill as ends; "every control is a pill") → a pill by default; `pill={false}` (`--rounded`) takes the setting's corner for its height, swatch and remove button concentric; avatars and images stay round (`chip.css`). `docs/research/radius-audit-2026-10-03.md`, "One corner setting".
- 2026-10-04 · pill shapes and list rows (owner) → the pill is the `chip` entry of data-area-pills (default on); `pill` three-way (`chip.css`). `docs/research/radius-audit-2026-10-03.md`, "Pill shapes and list rows".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → hover and press land at once and fade over `fast`, selection by hand paints at once, the remove plate gains the same fade (was untimed), the swatch ring is an inset outline (was a box-shadow spread) (`chip.css`; "Motion and interaction, 2026-10-07").
- 2026-10-08 · owner went with Link's recommendation to align Area's underlines (docs/specs/link.md, "Peers aligned") → a `link` chip's label underline is Link's line: 40% at rest, full when the chip is hovered or focused; `link-icon` unchanged (chip.css) → back in review.
- 2026-10-09 · owner, review round 3 (needs changes): "the link underline is doubled" → the link chip is an `<a>` and
  `.area-chip` never cleared the browser's underline, so it drew under the label's own; the gallery's docs CSS resets
  links, which hid it, and the review page (Area's CSS alone) showed it → `.area-chip { text-decoration: none }`
  (chip.css). Every other Area part that renders as a link already clears it.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → the swatch's ring is the shared swatch ring (`token-swatch-ring`) at `stroke-width` (was ColorSwatch's retired solid `bg-component` edge at `border-width`, which vanished under Elevated) (chip.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · owner, 2026-10-12: "go with your recommendations" (consistency pass) → the remove and action focus rings sit at 0 (O1; were `focus-offset`); the input plate reads `bg-mark` / `bg-mark-hover` and the selected hover edge `edge-control-strong` (O5, same paint) (chip.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · owner, review round 21 (components21): approved → Complete in `component-status.mjs`.

Since 2026-10-17 the underline offset is Link's 0.08em, close under the text (link.md, "Close underline").

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.

## Review note, 2026-10-28 (dark soft tones)

- **What changed:** the invalid chip's plate in dark, rest to pressed are quieter: each tone's soft surface is the neutral control fill of the same state in the
  tone's hue at chroma 0.05 / 0.06 / 0.07 (danger rest #3d1d1f, was #820022). Inks and light are unchanged; the ink
  reads better (Delete's label 7.34:1 → 10.38:1).
- **Why:** ChatGPT, Notion and Figma paint dark soft tones at chroma 0.04–0.07; Area's palette rungs carried up to 0.15
  and read almost solid. A token change (DESIGN_SYSTEM.md, Colour: dark soft tones;
  docs/research/dark-soft-tones-2026-10-28).
- **Verdict:** approved by the owner on the dark soft tones review page, 2026-10-28 (option A, every family approved).

### 2026-11-07 · One dismiss API and part (system gaps C4)

- **What changed:** the remove control's part is `area-chip__dismiss` (was `__remove`), as every family's close.
- **Why:** one dismiss API and one part name across the families that close or remove (Governance § 4; owner picked Build on the system gaps review, 2026-11-07).
- **Verdict:** awaiting the owner.
