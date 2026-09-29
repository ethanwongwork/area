# Chip spec

**Status:** in review · 2026-09-26 (cohesion audit; second pass the same day, no change)
**Captures:** `docs/research/captures/chip/` (Area tiles, `notion--board-tag`, `notion--select-tag`)
**Peers:** Badge (display counterpart), Segmented (one-track choice), Button (control tier and inset), Avatar (initials), Alert / Badge dismiss (remove plate), Checkbox / Radio (neutral selection)

## Owner decisions

- 2026-09-26: **Neutral by default, accent by override** (DESIGN_SYSTEM.md). The note
  recorded under Alignment picker in [prior decisions](PRIOR_DECISIONS.md) applies here:
  "Checkbox, Radio and Chip moved the same way (neutral-solid checked face; neutral tonal
  chip selection); all four await owner review." Selected chips use a neutral tonal fill;
  `tone="accent"` restores the accent fill.
- 2026-09-26: audit every family accepted under the earlier process (cohesion audit).
- 2026-09-26 (second pass): decide every open item with the most calculated option
  consistent with the system. Nothing in that pass changed Chip.

No Chip section existed in [prior decisions](PRIOR_DECISIONS.md).
- 2026-09-27: "the backplate of the hover state of the close button on chip does not look correct."

## Job and boundaries

Chip selects values from a set too long for a Segmented track, or represents an entered
value (input), an assist action or a suggestion; ChipLink navigates. It is interactive;
Badge states a value and cannot be pressed (DESIGN_SYSTEM.md, Icons and technical labels).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| kind | filter (default), assist, input, suggestion | Interaction role (`chip.css:67-79`) | Untitled Tags (input with close, checkbox selection) |
| size | sm 28, md 32 (default), lg 40 | Control tiers | Untitled sm 24 / md 24 / lg 28; Notion value tags 20 |
| tone | neutral (default), accent | Owner rule | — |
| booleans | `pill`, `swatchOnly`, `link`, `linkIcon` | Colour choices; navigation | Gallery `swatch`, Composition / swatch only, `link-*` |
| composition | swatch, icon, avatar, image, remove, custom remove | Visual leading item; removable values | Untitled close button; Gallery tiles |
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
  remove button __remove  16px, radius full, fg-muted
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

(The capture writes the border as `color(srgb 0.886275 …)`, which is #e2e2e2.)

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
| base tier | **md** 32 / gutter 12 / 14/20 (`chip.css:20-26`) | Manifest default `size: "md"` (`manifest.ts:288`) | Was sm (28) in CSS while React defaulted to md |
| height | 28 / 32 / 40 | Peer: Button tiers; audit decision 18 | Untitled 24 / 24 / 28; Notion's value tags 20; kept (third pass): Notion's tags are Badges in Area |
| radius | pill (`radius-full`, `chip.css:42`) | Area: Chip is the pill control | Untitled 6, Notion 4 |
| label weight | 400 | Weight policy (a choice, not a label on a fill); one weight per state; Notion select tag 400 | Untitled 500; Notion board tag 500 |
| rest paint | `bg-surface` + 1px `edge-control` #e2e2e2 | Untitled white + neutral-300 ring | Lighter edge than Untitled's #d4d4d4 |
| hover | `bg-component-hover` #f3, edge `edge-control-hover` #d4 (`chip.css:56-59`) | Audit row/control hover | — |
| selected (neutral) | `bg-component-active` #eeeeee, edge #d4, default ink; hover edge `border-hover` #b4b4b4 (`chip.css:98-105`) | Owner rule; audit: selection one step above hover | Untitled shows selection only in an embedded checkbox |
| selected (accent) | `accent-surface`, `edge-accent`, `fg-accent` (`chip.css:106-112`) | Owner: accent by override | — |
| input kind · paint | `bg-component` #f7, transparent border (`chip.css:74`; `area--input`) | Area input-chip rule | Notion's values are tone-tinted; Area chips carry no tone by value (Badge does) |
| remove · target | **a circle 4 inside the pill: 20 / 24 / 32** (`--_remove`, chip height − 8), concentric with the pill's end; the chip's end inset is that 4 | Material 24 circle in a 32 chip (`_trailing-icon.scss L18-22`); Primer, Carbon, Spectrum 2 make it the chip's height; chip trailing padding 0 (Primer, Polaris, Carbon, Spectrum 2) | Was the 16px glyph box, so the hover plate hugged the glyph (owner: "does not look correct") |
| remove · glyph | 16 (Fluent `dismiss_16`, ink ≈ 11) at every size | Primer 12 in 16/20, 16 in 24/32 (`_RemoveTokenButton.tsx L39,58`) | — |
| remove · hover | **plate `currentColor` 12%** on the circle; ink fixed `fg-muted` (`chip.css`) | Audit: foreground fixed; peer Alert dismiss; systems use a subtle neutral fill on the button alone | ChatGPT washes the whole pill instead; Area keeps the remove a separate target beside the chip's own action |
| avatar initials | **12px** (`--area-control-xs-text`: 12 default, 11 compact), as Badge's avatar | Type ramp floor 12; Figma 12 and Notion 11 on a 24 avatar | Was 10px, off the ramp; then 14 when `control-sm-text` moved to 14/20 for small controls (2026-09-26), which overflowed the 20 plate (fixed 2026-09-28) |
| visual box | 20px (icon 16 + 4) | Inset contract | — |
| group gap | 4, wrapping (`chip.css:256-260`) | Area spacing | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover | fill #f3, edge #d4; ink fixed | not captured |
| focus-visible | border and 2px outline `focus-color` (`chip.css:61-65`); forced colours Highlight | not captured |
| selected | as Decisions; `aria-pressed` on filter chips | `area--group`, `area--tone-accent` |
| invalid | danger surface, border, ink; remove in `fg-danger` (`chip.css:81-87, 224`) | `area--invalid` |
| disabled | 50% (`chip.css:121-124`) | `area--disabled` |

## Behavior and accessibility

Filter chips are `button` with `aria-pressed`, controlled or uncontrolled
(`primitives.tsx:591-650`). A removable chip is a `span` holding an optional action button
and a separate remove button named by `removeLabel`, so both are focusable peers. ChipLink is
an `a`. Forced colours paint selected chips Highlight (`forced-colors.css:21-26`).

## Peers and consistency

| Peer | Shared role | Area value in peer | Chip | Match / reason |
|---|---|---|---|---|
| Button | tier height and text inset | 32, 10.03 | 32, 10.03 | match |
| Menu / Nav / Table rows | hover / selected plates | `bg-component-hover` / `-active` | same pair | match |
| Alert dismiss | dismiss hover | ink 12% plate | ink 12% plate | match |
| Badge dismiss | dismiss hover | the badge's own `--_bg-hover` (`badge.css:202`) | ink 12% | differs; the CSS comment (`chip.css:224-225`) names both as precedent |
| Badge | a value shown as a tag | 20 / 24 / 28, Notion tag geometry (badge.md) | 28 / 32 / 40 pill | different job: Badge displays, Chip is pressed |
| Avatar | initials | 500, ramp sizes | 12px 500 | match |
| Checkbox / Radio / AlignmentPicker | selection tone | neutral, accent override | same | match |

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
