# Select spec

**Status:** in review · 2026-09-26 (cohesion audit; second pass with Notion and Figma)
**Captures:** `docs/research/captures/select/`
**Peers:** Input, Textarea, NumberField (field chrome), Menu (picker rows and lift), Popover
(floating surface), InputGroup (mode picker), ColorPicker (model select)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Select's enhanced
  native picker opens below with a 4px gap and no above-input fallback; unsupported browsers
  retain their platform-native picker placement. **Superseded 2026-09-30** (audit B-5, option
  B): the picker follows Combobox's list rules and flips above when there is no room below.
- Neutral by default, accent by override (2026-09-26): the checked option is marked with the
  neutral selection fill and a `currentColor` check, not accent.
- 2026-09-26, second pass ("decide all open items"), item 10: the chevron stays a
  theme-neutral mid grey (#888) in the data URI a native select requires; intentional.
  Item 18: control height unchanged (32px md; density is the UI-scale axis).

## Job and boundaries

Select picks one value from a short list with a native `<select>`: one focusable node, native
keyboard, typeahead, form value and reset. Where `appearance: base-select` is supported the
picker is styled; elsewhere it is the platform picker. Multiple selection, search and rich
options are out of scope (Menu, a combobox).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | outline (default), soft | Soft is the flat filled field shared with Input, Textarea and NumberField, so a Panel holds one field style (third pass) | Figma's soft inspector fields; gallery Variant / soft |
| size | sm, md (default), lg | Control tiers | UUI sm/md/lg; Notion 28, ChatGPT 36, Figma 24 |
| state | invalid, success, warning, disabled | Validation and native disabled | UUI (disabled) |
| composition | option groups | Native `optgroup` headings | Native |
| boolean | fullWidth | Layout | — |

Excluded: a borderless inline trigger (Notion's permission select, Figma's zoom select); see
Settled questions 1.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system (source) | Select trigger and popover | [Untitled UI reference](../research/untitled-ui-reference.md):47-48, pinned `4702dc0` | MIT | — |
| chatgpt | target product | Settings select trigger, rest and hover | chatgpt.com settings, owner's session, read-only | evidence only | `baseline/chatgpt--select--rest--light`, `--hover--light` |
| notion | target product | Share popover permission select (inline trigger) | app.notion.com Share popover, read-only, 2026-09-26 | evidence only | `select/notion--inline-select--rest--light` |
| figma | target product | File-browser filter select; editor size select; toolbar zoom select; colour model select and its menu | figma.com file browser and editor, read-only | evidence only | `select/figma--filter-select--rest--light`, `figma--size-select--rest--light`, `figma--zoom-select--rest--light`; `color-picker/figma--format-row--rest--light`, `figma--format-menu--open--light` |
| area | this system | Gallery tiles, re-taken after the second pass | localhost gallery | — | `select/area--*` |

No product picker was captured open this pass (ChatGPT's was left closed because a selection
would change a setting). Figma's format menu (earlier pass): 24px rows with 12 / 32px
sides, 11/16 450, a 16px check before the label.

Product triggers (node numbers from the captures):
- Notion (nodes 0–3): 28 tall, radius 6, no fill or border, text 8px in, 14/16.8 400 in
  rgb(125,122,117), 14px chevron in rgb(142,139,134), 4px before it, 8px from the end.
- Figma size select (nodes 0–4): 24 tall, radius 5, white, 1px rgb(230), text 9px in, 11/16
  450, a 24px chevron box flush at the end, chevron 89.8% black.
- Figma filter select (nodes 0–8): 24 tall, radius 5, white, `inset 0 0 0 1px rgb(230)`, text
  8px in, 16px chevron 2px from the end in 50% black.
- Figma zoom select (nodes 0–2): 24 tall, no border, padding 4 4 4 12, 16px chevron.

## Anatomy

```
chatgpt  button  36px pill, padding 0 12, gap 4, fill rgb(243) (hover 5% black), 1px 10% ring
notion   div[role=button]  28px, radius 6, no chrome; text span; 14px chevron svg, margin-start 4
area     select.area-select  owns: height, border, radius, fill, focus (no resting shadow, audit B-2); chevron = background image
  picker ::picker(select)   4px below, padding 4, radius 12, bg-surface, decorative border, floating lift (--area-shadow-float)
  option option             min 32, padding 6 8, radius 8, 2px apart, icon-to-label gap-row 12, ::checkmark at the end
```

Insets (`inset.css:120-125`): text start (H − 1cap) / 2 − 1 = 10.03 at md; chevron inset
(32 − 16) / 2 − 1 = 7; text end padding 7 + 16 + 8 = 31.

## Measurements

`node scripts/capture-compare.mjs --slots shell` (trimmed; the chevron data URI is `url(…)`;
Area widths are the tile's):

| slot · property | area · default | area · size-sm | chatgpt · select | notion · inline-select | figma · size-select | figma · filter-select | figma · zoom-select |
|---|---|---|---|---|---|---|---|
| **shell** size | 256 × 32 | 256 × 28 | 121.44 × 36 | 105.43 × 27.99 | 88 × 24 | 113.45 × 24 | 47.59 × 24 |
| **shell** padding | 0 31 0 10.03 | 0 25 0 8.74 | 0 12 0 12 | 0 8 0 8 | 0 0 0 8 | 0 | 4 4 4 12 |
| **shell** border | 1 solid color(srgb 0.886275 …) | 1 solid color(srgb 0.886275 …) | 1 solid rgba(0, 0, 0, 0.1) | 0 | 1 solid rgb(230, 230, 230) | 0 | 0 |
| **shell** radius | 8px | 8px | 9999px | 6px | 5px | 5px | 5px |
| **shell** font | 14px/20px 400 Geist | 12px/16px 400 Geist | 14px/18px 400 | 14px/16.8px 400 | 11px/16px 450 | 11px/16px 450 | 11px/16px 400 |
| **shell** color | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(13, 13, 13) | rgb(125, 122, 117) | rgba(0, 0, 0, 0.898) | rgba(0, 0, 0, 0.898) | rgb(0, 0, 0) |
| **shell** background | rgb(255, 255, 255) url(…) | rgb(255, 255, 255) url(…) | rgb(243, 243, 243) | — | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(255, 255, 255) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px | same | — | — | — | rgb(230, 230, 230) 0 0 0 1px inset | — |

`area--default` node 1 (the checked option): fill rgb(238, 238, 238) (`bg-component-active`),
padding 6 8, radius 8, gap 8. `area--disabled` has no opacity (0.5 before the audit). The
size-sm trigger radius was 8 at capture; since audit S4 it is 6.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| trigger · chrome | Input's: 32 / 28 / 40, radius per tier 8 / 6 / 10 (`navigation.css:231`, `:310-312`), `input-edge`, `bg-surface`, `shadow-1` | Peer: [Input](input.md); Figma's outline selects (1px rgb(230), white) | ChatGPT 36 pill with a fill; Figma 24, radius 5; no product select has a shadow; kept with Input (Settled questions 2) |
| trigger · soft | **`input-bg-soft` fill, transparent edge, no shadow; hover edge `input-edge`** (`.area-select--soft`, `navigation.css:250-255`); `variant` in the manifest (`manifest.ts:206, 211`) and React (`forms.tsx:12, 43`) | Third pass: the one field without soft, so a Panel mixed two field styles; peer Input soft (`input.css:52-57`) | — |
| trigger · chevron | 16px, 1.5 stroke, `#888`, 8px from the outer end | Notion rgb(142,139,134) 8px from the end; ChatGPT 16px rgb(143); UUI 16px; second pass item 10 | A literal in a data URI (`navigation.css:237`), not a role; Figma 50–90% black |
| trigger · text | 14/20 400 `fg-default`, 11.03 from the edge | Notion 14 400, ChatGPT 14/18 400 | Notion's permission select uses muted ink as an inline trigger; Figma 11/16 450 |
| picker · offset | 4px below; flips above when out of room (`position-try-fallbacks: flip-block`) | Audit B-5 (owner 2026-09-30): one rule set with Combobox; UUI 4px offset | Was no flip (pre-09-24 decision) |
| picker · width | at least the field and Menu's 224 (`max(anchor-size(self-inline), 224)`) | Audit B-5: Combobox's list | Was the field's width: a 96px mode Select opened a 96px list |
| picker · height | at most **324** | Audit B-5: Figma's font list (Combobox) | Was 288 |
| picker · surface | padding 4, `radius-container` 12, `border-decorative`, `bg-surface` | Peer: Menu (4px inset) | UUI radius 8 |
| picker · lift | `--area-shadow-float`: `0 20px 24px` + `0 5px 8px` at half strength, `shadow-color` (`navigation.css:334`); `none` under the Flat preset | Audit "Floating lift" (Notion popover; Menu, Popover) | Was `shadow-2`. A Surface axis role since audit S10 |
| option · row | min 32, padding 6 8, radius `radius-row` 8, 2px apart; icon-to-label gap `--area-gap-row` 12 (`navigation.css:342`), labels at 36 as Menu's | Peer: Menu rows 32px | Figma 24px rows; UUI 36, radius 6 |
| option · hover / focus | `bg-component-hover` #f3, no ring | Audit row-plate rule; B-5: one focus paint with Menu and Combobox rows | Keyboard focus drew a 2px inset ring as well |
| option · checked | `bg-component-active` #eee; check at the end in `currentColor` | Audit: selection one step above hover | Figma's check sits before the label; UUI one fill for both |
| disabled | field paint only (`navigation.css:281-287`) | Audit "Disabled" rule for text fields | Was field paint and 50% opacity |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover | border → `border-subtle` #d4d4d4; ink fixed | `navigation.css:247` |
| focus | border `field-focus-color` (focus colour) + 2px `field-focus-halo-color` halo | `navigation.css:249-254`; audit S1, as [input.md](input.md) |
| invalid / success / warning | border and halo in the tone colour; `aria-invalid` or `data-*` | `area--error`, `area--success`, `area--warning` |
| disabled | fill #f7, `border-faint`, ink `fg-disabled` rgb(164); no opacity | `area--disabled` |
| option hover / checked / disabled | #f3 / #eee / `fg-disabled` | `navigation.css:335-338`; `area--default` node 1 |

## Behavior and accessibility

Native `<select>`, ref forwarded (`forms.tsx:21-48`); validation props mirror Input.
Keyboard, typeahead and dismissal are the browser's. Option focus is the hover plate, as a
Menu or Combobox row (audit B-5). The picker is the one anchored surface the shared React
engine (audit S16) doesn't place: the platform owns it, so its rules mirror Combobox's in CSS. RTL moves the chevron (`navigation.css:243`). Notion's inline trigger is a
`div role="button" aria-haspopup="dialog"`, not a select; Area keeps the native element.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Input, Textarea, NumberField | field chrome and disabled | field paint, no opacity | same | match |
| Input, Textarea, NumberField | soft variant | flat fill, transparent edge, no shadow | same (`navigation.css:250-255`) | match (third pass) |
| Menu | row plates | hover #f3, 32px rows, 4px inset, icon gap `--area-gap-row` 12; the #eee `data-selected` plate is the value-picker hook (surface.css:1045-1058) | same | match (audit S11a; option gap was 8) |
| Popover, Menu, Dialog | floating lift | `--area-shadow-float` | same | match |
| Menu | selected mark | check only, no plate (commands and choices: `checked`, `radio checked`) | #eee plate plus `currentColor` check | differs by job (audit S13 C): a value picker shows its value with the plate |
| Combobox | selected option | #eee plate (`data-selected`) plus check | same | match (audit S13 C; Combobox was check only) |
| InputGroup | mode picker | first child 3 × height wide (`input-group.css:102`) | chrome stripped inside the group | match |

## Visual pass

2026-09-28 (batch 9, owner: truncation errors): a narrow Select wrapped its option onto a second line
inside the 28px control (Property list Effects, "Drop shadow"). The value is now one line with an
ellipsis, and inside an InputGroup the text runs up to the chevron's 16px box, as Figma's W / H menu
fields do (`number-field/figma--number-field-menu`: value box 17 from the end = chevron 16 + 1); the
chevron's side-bearing keeps about 4.5 of air. A standalone Select keeps its extra 4.

Earlier note:

The gallery shows Select's tiles in named groups, one variant per tile. The picker lift
and checked fill appear only with the picker open in a supporting browser. Unverified: the
open picker on screen, a Notion or Figma picker side by side, dark theme.

2026-09-28 (batch 13, Claude in Chrome): beside ChatGPT's settings dropdown (Personalization: a
36px pill, #f3 fill, 0.56px 10% edge, 0 12, 14/18) and the Figma and Notion selects on file.
Area's outline and soft Selects (32, corner 8, 11 text inset) sit between Figma's 24–32 fields
and ChatGPT's 36 pill; its chevron is 16 wide, 6 / 8 / 12 from the end at sm / md / lg,
exactly where Combobox's chevron and Input's trailing icons sit. ChatGPT's hover is a 5% black
wash (≈ #f2 against its #f3 rest). No change. Captures: `chatgpt--settings-select--{rest,hover}--light`.

## Settled questions

Both kept in the third pass ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)):

1. *Borderless trigger: none.* Notion's permission select (no fill or border, muted ink) and
   Figma's zoom select (no border) are inline triggers. A ghost variant is a candidate, not
   started without the owner.
2. *Outline shadow.* No product select has a shadow. Input, Textarea, NumberField and InputGroup
   dropped `shadow-1` in the outline pass and Select followed on 2026-09-29 (audit B-2): every
   field rests flat.

## Verification

Compared the Area captures (`select/area--*`) with ChatGPT's select, Notion's permission
select and Figma's filter, size, zoom and format selects. Build and test results are in the
[cohesion audit](../research/cohesion-audit.md#verification).

## Feedback log

- 2026-09-26 · cohesion audit → disabled without double dimming; picker takes the floating
  lift; checked option uses `bg-component-active` → `area--disabled` (no opacity),
  `area--default` node 1 rgb(238).
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → no change; the #888
  chevron is kept and documented; two open questions recorded → `select/notion--inline-select`,
  `figma--size-select`, `figma--filter-select`, `figma--zoom-select`.
- 2026-09-27 · third pass → `variant: outline | soft` added, outline default (was outline
  only), so a Panel holds one field style; Variant / soft tile added; borderless trigger and
  outline shadow kept → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-28 · owner: truncation errors → nowrap + ellipsis; in-group end padding = gutter + chevron
  → gallery measured, no Select text overflows.
- 2026-09-30 · audit S4 (owner) → trigger radius follows the tier as Button: sm 6, md 8, lg 10 (`--_radius` per size, `navigation.css:231`, `:310-312`); was 8 at every size.
- 2026-09-30 · audit S10, S11a (owner) → the picker reads the Surface axis role `--area-shadow-float` (same recipe; `none` under Flat; `navigation.css:334`); option icon-to-label gap is `--area-gap-row` 12 (was 8), labels at 36 as Menu's (`navigation.css:342`).
- 2026-09-30 · audit S13, S14 (owner) → Select keeps the plate plus the check; Menu rows of commands and choices now show the check only, and Combobox matches Select (peer rows). The density gap moved to 6 at sm/md/lg, but the trigger sets `--_gap` without reading it (navigation.css:216, :311-313), so nothing visible changes.
