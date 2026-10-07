# Custom select spec

**Status:** in review · 2026-10-04 (built; `REVIEW_COMPONENTS`, Review page batch "New components, batch 1")
**Captures:** `docs/research/captures/custom-select/` (6 Notion, 14 Area)
**Peers:** Select (native single choice; same field chrome), Combobox (same listbox rows), Menu
(rows, labels, separators, lift), ModelPicker (a trigger over rich rows), Button ghost (the ghost
trigger's paint), Popover (anchoring)

## Owner decisions

- 2026-10-04: batch 1 of new components (owner pick): Custom Select, Tag picker, Date picker,
  Drawer and confirm dialog. Custom Select reference: "Notion's and Figma's dropdowns: rows with
  icons, checks and descriptions"; reuses the Combobox listbox, Menu rows and the overlay
  (`REVIEW_BATCHES`, `component-status.mjs`).
- Inherited: a value picker shows its value with the active plate and the check (audit S13 C,
  owner 2026-09-30); Neutral by default (2026-09-26); Menu's row, surface and separator values
  (menu.md, owner-approved).

## Job and boundaries

Pick one value from a short, fixed list whose options need more than text: a leading icon, a
line of description under the label, a check on the chosen row, groups. The trigger is a button
showing the current value; the popup is a listbox. Not Select (a native `<select>`: plain text
options, platform picker where `base-select` is missing), not Combobox (typing filters the
list), not Menu (commands, no value), not ModelPicker (a composer recipe that could sit on this).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | outline (default), soft | Field chrome shared with Select, Input and NumberField | Select's variants; Figma's soft inspector fields |
| variant | ghost | An inline value with no chrome until hovered | Notion Share popover access selects (`notion--*-trigger--rest--light`) |
| size | sm, md (default), lg | Control tiers, as Select | Notion 28 (sm), Area fields 32 |
| content | option icon (also shown in the trigger), description | The reason this exists beside Select | Notion general access (icons), member access (descriptions) |
| composition | groups (label, ruled apart) | Notion's access menu: "Current access" / "User access", 1px rules | `notion--member-access-menu--open--light` |
| state | open, placeholder, disabled, disabled option, invalid | WAI; Select's states | — |
| boolean | fullWidth | Layout | — |

Excluded: an open-on-load tile (the list lives in the top layer and would float over the
gallery; the Review page opens it on click); multiple selection (Tag picker, next in the batch).

## Sources

| Id | Type | What | Link / path | Captures |
|---|---|---|---|---|
| notion | target product (primary: lists) | Share popover: member access menu (group labels, title + description rows, trailing check, separator, danger row), general access menu (icon rows, check), both triggers | app.notion.com, owner's page, Share popover, read-only (opened only, nothing chosen), 2026-10-04 | `notion--member-access-menu--{open,hover}--light`, `notion--share-general-access--{open,hover}--light`, `notion--{member,general}-access-trigger--rest--light` |
| figma | target product (primary: inspector) | Colour-model select menu: 24 rows, 16 check before the label | earlier ColorPicker pass | `color-picker/figma--format-menu--open--light` |
| uui | design system (source) | Select popover: 4 offset, trigger width, rows inset 4–6, check at end | `untitled-ui-reference.md`, pinned `4702dc0` | source only |
| wai | pattern | Select-only combobox | w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/ | — |
| area | peers | Select trigger, Menu rows, Combobox listbox | `select/area--*`, menu.md, combobox.md | `area--*` (this folder) |

ChatGPT's settings selects were not opened this pass (a choice would change a setting). Notion's
hover capture records no row fill: the hover paint transitions and was read before it landed;
Menu's measured Notion hover (menu.md) stands for it. Notion dark not captured (needs a theme
change on the owner's account).

## Anatomy

```
notion (member access menu)
shell      div  radius 10, white, 3-layer shadow incl. 1px ring; no padding
  section  div  padding 4 (6 4 4 4 after a rule), gap 1
    label  div  12/14.4 500 rgb(125,122,117), 8 sides, 6 above
    rule   div  1px rgba(42,28,0,.07), 12 in from each side
    row    div  radius 6; padding 4 8 (two lines, 45) or 0 8 (one line, 28); gap 8
      lines  title 14/16.8, description 12 rgb(125,122,117), 2 apart
      check  svg 16, 8 from the end, top-aligned with the title (7 from the row top)
notion (trigger)
shell      div  28, radius 6, padding 0 8 (6 start beside nothing), no fill or edge; gap 4
  value    14/16.8 ink rgb(44,44,43) (general) / rgb(125,122,117) (member)
  chevron  16 viewBox at 14–16, rgb(142,139,134)
```

Area:

```
root      div.area-custom-select[data-open]        owns: variant/size locals, layout
  trigger button.__trigger[role=combobox]          owns: height, edge, radius, fill, focus, sides (inset.css)
    icon     span.__icon      square --_icon (only when the chosen option has one)
    value    span.__value     truncation; [data-placeholder] ink
    chevron  span.__chevron   square --_icon, input-icon ink
  input[type=hidden]          form value
  listbox  div.area-menu.__listbox[popover]        Menu's surface; overlay engine places it
    group  div.__group[role=group] > div.area-menu__label
    rule   div.area-menu__separator.__separator    between groups
    option div.area-menu__item.__option[role=option]  Menu's row; data-selected plate
      icon / text or lines(text + description) / check
```

Inset equations (md 32, border 1): value start = round((32 − 1cap) / 2 − 1) = 10 (cap 9.94);
with an icon, (32 − 16) / 2 − 1 = 7; chevron end = (32 − 16) / 2 − 1 = 7, so its square sits 8
from the outer edge (`area--default--rest--light` chevron edge 8, `area--icons` icon edge 8).
sm 28: 8 / 5; lg 40: 14 / 11. Rows: Menu's (inset.css).

## Measurements

Triggers (`node scripts/capture-compare.mjs` over the trigger files):

| slot · property | notion · member-access-trigger | notion · general-access-trigger | area · variant-ghost (sm) | area · default (md) | area · size-sm |
|---|---|---|---|---|---|
| **shell** size | 105.43 × 27.99 | 158 × 27.99 | 108.5 × 28 | 240 × 32 | 240 × 28 |
| **shell** padding | 0 8 0 8 | 6 8 6 6 | 0 5 0 8 | 0 7 0 10 | 0 5 0 8 |
| **shell** border | 0 | 0 | 1 transparent | 1 #e2 | 1 #e2 |
| **shell** radius | 6px | 6px | 6px | 8px | 6px |
| **shell** gap | — | 4px | 6px | 6px | 6px |
| **shell** font | 14/16.8 400 | 14/16.8 400 | 14/20 400 Geist | 14/20 400 Geist | 14/20 400 Geist |
| **shell** color | rgb(125, 122, 117) | rgb(44, 44, 43) | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(40, 40, 40) |
| **text** edge from shell (start) | 8 | 6 | 9 | 11 | 9 |
| **chevron** size · edge from end | 13.99 · 7.99 | 16 · 7.99 | 16 · 6 | 16 · 8 | 16 · 6 |

Area across variants and states:

| slot · property | default | soft | ghost | sm | lg | icons | disabled | invalid |
|---|---|---|---|---|---|---|---|---|
| **shell** size | 240 × 32 | 240 × 32 | 108.5 × 28 | 240 × 28 | 240 × 40 | 240 × 32 | 240 × 32 | 240 × 32 |
| **shell** padding | 0 7 0 10 | 0 7 0 10 | 0 5 0 8 | 0 5 0 8 | 0 11 0 14 | 0 7 0 7 | 0 7 0 10 | 0 7 0 10 |
| **shell** border | 1 #e2 | 1 transparent | 1 transparent | 1 #e2 | 1 #e2 | 1 #e2 | 1 #e2 | 1 rgb(232, 9, 69) |
| **shell** radius | 8px | 8px | 6px | 6px | 10px | 8px | 8px | 8px |
| **shell** background | #fff | #f7 | — | #fff | #fff | #fff | #f7 | #fff |
| **shell** color | #28 | #28 | #28 | #28 | #28 | #28 | rgb(164, 164, 164) | #28 |

Select's own trigger (`select/area--default--rest--light`, 2026-09-28): 8 r8, #e2 edge, text at
10, chevron square 8 from the end; the same today (its 8 text gap is now `gap-md` 6, as here).

Lists:

| slot · property | notion · member-access-menu | area · default-list | notion · general-access | area · icons-list |
|---|---|---|---|---|
| **shell** padding / border | 0 / 0 (ring in the shadow) | 4 / 1 #f3 | 0 / 0 | 4 / 1 #f3 |
| **shell** radius | 10px | 12px | 10px | 12px |
| **shell** gap | 1 | 2 | 1 | 2 |
| **shell** shadow | 0 20 24 .05, 0 5 8 .027, ring 1 .07 | 0 20 24 .06, 0 5 8 .03 | same as left | same as left |
| two-line row | 45–47 tall, padding 4 8, r6 | 46.5 tall, padding 6 8, r8 | — | — |
| one-line row | 28, padding 0 8, r6 | 32 (Menu row) | 30 (28 + 2) | 32 |
| row gap (icon → text) | 8 | 12 (Menu's list column) | 8 | 12 |
| selected row | check only | `bg-component-active` plate + check | check only | plate + check |

Area's list captures were taken mid-entry (Menu's 0.96 → 1 scale), so its sizes carry the
transform; the values above are the CSS values (Menu, menu.md).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| trigger chrome (outline, soft) | Select's: `select-bg`, `select-edge`, control tiers 28 / 32 / 40, per-tier radius, field focus ring (`custom-select.css`, trigger block) | Peer: Select (owner-approved) | — |
| trigger sides | inset contract: cap-centred start (icon square with an icon), chevron square at the end (`inset.css`, custom select rule) | Inset contract; Select's chevron inset | — |
| ghost trigger | no fill or edge; `bg-component-hover` under the pointer; `bg-component-active` while open; width of its value | Notion inline select (28, r6, no chrome) for shape; Button neutral ghost for paint | Notion's open trigger shows its focus ring (blue halo); Area keeps one open treatment for menu triggers (button.css, audit G-12) |
| text → chevron gap | `gap` tier (6 md) | Peer: Select | Notion 4 |
| value ink | `select-text` (fg-default) | Notion general access (#2c) | Notion's member access value is muted; one ink for a chosen value |
| chevron | 16 `chevron-down` glyph, `input-icon` ink | Peers: Select, Combobox | Notion 14–16 at rgb(142) |
| open trigger (outline, soft) | focused edge colour while the list shows | Combobox (its field is focused while open) | — |
| list surface | Menu: radius-list 12, 4 padding, 1px decorative edge, float shadow | Peer: Menu (owner-approved, measured from Notion) | Notion 10 radius, no padding; menu.md records the step |
| rows | Menu rows: 32, 8 sides, r8, 12 icon gap, 14/20 | Peer: Menu / Combobox | Notion 28, r6, 8 gap |
| description rows | Menu's two-line row: 6 above and below, 12/16 muted | Peer: Menu (ChatGPT model list) | Notion 4 above and below, 2 between lines |
| chosen row | `bg-component-active` plate + 16 check at the end, `fg-selection` | Owner (audit S13 C) | Notion shows the check only |
| check on two-line rows | centred in the row | Peer: Menu's description row | Notion aligns it with the title; see Open questions |
| group label | Menu label: 12/16 muted, row pitch | Peer: Menu (one label pattern) | Notion 12/14.4 500 |
| group rule | Menu separator, between groups only | Notion (rule between sections) | Combobox groups have no rule |
| list placement | overlay engine: 4 below, flips, ≥ trigger width and 224, ≤ 324 tall | Peer: Combobox | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover (trigger) | outline/soft: edge `select-edge-hover`; ghost: `bg-component-hover` plate | Select; Button ghost |
| focus-visible | field focus ring (outline + halo) | Select |
| open | `data-open` on the root; field edge in focus colour, ghost pressed plate | Combobox; button.css |
| highlighted row | `bg-component-hover` (pointer or keyboard) | Menu |
| selected row | `bg-component-active` + check | owner S13 C |
| placeholder | `input-placeholder` ink | Select (audit B-19) |
| disabled | Select's disabled paint; ghost: no plate, disabled ink | Select |
| disabled option | Menu's 50% row, skipped by arrows and typeahead | Menu, Combobox |
| invalid | `select-invalid-color` edge and ring | Select |

## Behavior and accessibility

WAI select-only combobox (`CustomSelect.tsx`): `button role=combobox aria-haspopup=listbox
aria-expanded aria-controls aria-activedescendant`; the listbox is named by the consumer's
`aria-label` (else `aria-labelledby`); groups are `role=group` named by their label. Focus stays
on the trigger. Closed: Enter, Space, ↓, ↑ open on the chosen row (↑ on the last when nothing is
chosen); Home / End open on the first / last; a letter opens on the next label starting with it.
Open: ↑/↓ move (clamped, disabled rows skipped), Home / End, Page Up / Down by 10, Enter and Space
choose and close, Tab chooses and moves on, Alt+↑ chooses and closes, Escape closes; typing within
half a second searches as one string, a repeated letter cycles. Clicking a row chooses it and
returns focus to the trigger; blur closes. `name` submits the value through a hidden input; an
uncontrolled select restores `defaultValue` on form reset. Forced colours: Menu's rules.

## Visual pass

2026-10-04, Review page at 1:1, light and dark: the default and soft triggers read as Select
beside it; the list is Menu's (description rows, plate + check on the chosen row, labels and a
rule between groups); the ghost trigger in dark shows the pressed plate while open. Against
Notion's captures (not yet a side-by-side screenshot): same anatomy (label over muted description, trailing check, group
labels, a rule between sections); Area is a step roomier (32 rows, 12 corners), as Menu is.
Compact checked 2026-10-06 (trigger 28, rows 24, dark). Not yet: Figma side by side, forced colours.

## Open questions

1. Check on two-line rows: Notion aligns it with the title line; Menu centres it in the row.
   Changing it would change Menu too.
2. Group rules: Notion rules sections off; Combobox's groups have none. Keep the rule here only,
   or add it to Combobox?

## Verification

`npm run build`, `npm run lint:manifest`, `npm run typecheck`, `npm test` pass. Docs build passes
(`node apps/docs/scripts/build.mjs`); the dogfood check fails on main for unrelated icon-page
inline styles. In the browser: keyboard (typeahead "c c" → Can comment, Enter chooses, End/↑
moves, Escape closes and keeps focus), groups, ghost open in dark. Unverified: screen reader
announcement, RTL, forced colours, Figma side by side.

## Feedback log

- 2026-10-04 · owner: batch 1, Custom Select first → built from Notion's Share popover menus
  (captures in this folder) on Select's chrome and Menu's rows; on the Review page, in review.
