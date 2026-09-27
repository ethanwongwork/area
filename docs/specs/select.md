# Select spec

**Status:** in review · 2026-09-26 (cohesion audit; second pass with Notion and Figma)
**Captures:** `docs/research/captures/select/`
**Peers:** Input, Textarea, NumberField (field chrome), Menu (picker rows and lift), Popover
(floating surface), InputGroup (mode picker), ColorPicker (model select)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Select's enhanced
  native picker opens below with a 4px gap and no above-input fallback; unsupported browsers
  retain their platform-native picker placement.
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
area     select.area-select  owns: height, border, radius, fill, shadow-1, focus; chevron = background image
  picker ::picker(select)   4px below, padding 4, radius 12, bg-surface, decorative border, floating lift
  option option             min 32, padding 6 8, radius 8, 2px apart, ::checkmark at the end
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
padding 6 8, radius 8, gap 8. `area--disabled` has no opacity (0.5 before the audit).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| trigger · chrome | Input's: 32 / 28 / 40, radius 8, `input-edge`, `bg-surface`, `shadow-1` | Peer: [Input](input.md); Figma's outline selects (1px rgb(230), white) | ChatGPT 36 pill with a fill; Figma 24, radius 5; no product select has a shadow; kept with Input (Settled questions 2) |
| trigger · soft | **`input-bg-soft` fill, transparent edge, no shadow; hover edge `input-edge`** (`.area-select--soft`, `navigation.css:250-255`); `variant` in the manifest (`manifest.ts:206, 211`) and React (`forms.tsx:12, 43`) | Third pass: the one field without soft, so a Panel mixed two field styles; peer Input soft (`input.css:52-57`) | — |
| trigger · chevron | 16px, 1.5 stroke, `#888`, 8px from the outer end | Notion rgb(142,139,134) 8px from the end; ChatGPT 16px rgb(143); UUI 16px; second pass item 10 | A literal in a data URI (`navigation.css:237`), not a role; Figma 50–90% black |
| trigger · text | 14/20 400 `fg-default`, 11.03 from the edge | Notion 14 400, ChatGPT 14/18 400 | Notion's permission select uses muted ink as an inline trigger; Figma 11/16 450 |
| picker · offset | 4px below, no flip | Owner; UUI 4px offset | — |
| picker · surface | padding 4, `radius-container` 12, `border-decorative`, `bg-surface` | Peer: Menu (4px inset) | UUI radius 8 |
| picker · lift | `0 20px 24px` + `0 5px 8px` at half strength, `shadow-color` (`navigation.css:312`) | Audit "Floating lift" (Notion popover; Menu, Popover) | Was `shadow-2` |
| option · row | min 32, padding 6 8, radius `radius-row` 8, 2px apart | Peer: Menu rows 32px | Figma 24px rows; UUI 36, radius 6 |
| option · hover / focus | `bg-component-hover` #f3 | Audit row-plate rule | — |
| option · checked | `bg-component-active` #eee; check at the end in `currentColor` | Audit: selection one step above hover | Figma's check sits before the label; UUI one fill for both |
| disabled | field paint only (`navigation.css:281-287`) | Audit "Disabled" rule for text fields | Was field paint and 50% opacity |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover | border → `border-subtle` #d4d4d4; ink fixed | `navigation.css:247` |
| focus | border `field-focus-color` + 2px halo | `navigation.css:249-254`; Notion fields use a 2px blue ring; neutral kept ([input.md](input.md#settled-questions) 1) |
| invalid / success / warning | border and halo in the tone colour; `aria-invalid` or `data-*` | `area--error`, `area--success`, `area--warning` |
| disabled | fill #f7, `border-faint`, ink `fg-disabled` rgb(164); no opacity | `area--disabled` |
| option hover / checked / disabled | #f3 / #eee / `fg-disabled` | `navigation.css:335-338`; `area--default` node 1 |

## Behavior and accessibility

Native `<select>`, ref forwarded (`forms.tsx:21-48`); validation props mirror Input.
Keyboard, typeahead and dismissal are the browser's. Option focus uses the focus ring inset
2px. RTL moves the chevron (`navigation.css:243`). Notion's inline trigger is a
`div role="button" aria-haspopup="dialog"`, not a select; Area keeps the native element.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Input, Textarea, NumberField | field chrome and disabled | field paint, no opacity | same | match |
| Input, Textarea, NumberField | soft variant | flat fill, transparent edge, no shadow | same (`navigation.css:250-255`) | match (third pass) |
| Menu | row plates | hover #f3, selected #eee, 32px rows, 4px inset | same | match |
| Popover, Menu, Dialog | floating lift | Notion geometry | same | match |
| Menu | selected mark | neutral | `currentColor` check | match |
| InputGroup | mode picker | first child 3 × height wide (`input-group.css:102`) | chrome stripped inside the group | match |

## Visual pass

The gallery shows Select's tiles in named groups, one variant per tile. The picker lift
and checked fill appear only with the picker open in a supporting browser. Unverified: the
open picker on screen, a Notion or Figma picker side by side, dark theme.

## Settled questions

Both kept in the third pass ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)):

1. *Borderless trigger: none.* Notion's permission select (no fill or border, muted ink) and
   Figma's zoom select (no border) are inline triggers. A ghost variant is a candidate, not
   started without the owner.
2. *Outline shadow.* No product select has a shadow; Area keeps `shadow-1` on outline fields
   with Input ([input.md](input.md#settled-questions) 2). The soft variant is flat.

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
