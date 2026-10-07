# Tag picker spec

**Status:** in review · 2026-10-05 (built; Review page batch "New components, batch 1")
**Captures:** `docs/research/captures/tag-picker/` (Notion select property editor, open and hover) and Area (`area--*`, 2026-10-06: every tile at rest plus the open list / panel)
**Peers:** Combobox (typing filters a listbox; create row), Custom select (rows with a check),
Tag (the tag: Notion's palette, remove ×), Chip (`kind="input"`, a removable value), Input (field chrome),
Menu (rows, label, lift)

## Owner decisions

- 2026-10-04: batch 1 (owner pick). Tag picker reference: "Notion's select and multi-select
  properties: coloured tags, create on type"; reuses Combobox, Chip, Field (`REVIEW_BATCHES`).
- Inherited: the chosen value shows a check (audit S13 C); Badge is a pill unless the theme's Pills
  setting drops it (`data-area-pills`, owner 2026-10-04); Menu's rows.

## Job and boundaries

Choose several values from a list that can grow: the chosen ones sit in the field as coloured
tags, typing filters the list, and text that matches nothing can become a new tag. Not Combobox
(one value), not Custom select (one value, fixed list), not a Chip group (filters shown all at
once, toggled in place).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | outline (default), soft | Input's field chrome | Notion's editor field is soft (rgba(242,241,238,.6)) |
| size | sm, md (default), lg | Control tiers; tags Badge sm (20) up to md, Badge md at lg | Notion tags 20 |
| content | tag tone per option | Notion's tag colours | `notion--select-property-editor--open--light` nodes 36, 53, 70, 87 |
| behavior | create (`onCreate`) | Notion "Select an option or create one" | same capture, node 22 |
| state | open, placeholder, disabled, invalid | Input's states | — |
| boolean | fullWidth | Layout | — |

Excluded: Notion's drag handles and per-option "…" menu (reorder and edit the option set, a
property-settings job, not choosing); the editor replacing the cell in place (Area anchors the list
below its field, as Combobox).

## Sources

| Id | Type | What | Where | Captures |
|---|---|---|---|---|
| notion | target product (primary: lists, properties) | Status (select) property editor on a task's side peek: field with the chosen tag and its ×, hint, four tag rows with drag handle and "…"; hovered row | app.notion.com, owner's "tasks" database, a task opened in side peek; opened only, Escape to close, nothing changed (Status still "personal") | `notion--select-property-editor--{open,hover}--light` |
| area | peers | Badge's Notion tag measurements; Combobox's create row | `badge.md`, `combobox.md` | — |

## Anatomy

```
notion (node numbers from the open capture)
popup    div (2)  539 wide (the property cell), radius 6, white, Notion's float shadow
  field  div (8)  38 tall, soft rgba(242,241,238,.6), 4 padding, inset bottom rule 1px rgba(28,19,1,.11)
    wrap div (9)  padding 5.25 8, gap 6
      tag   div (11) 20 tall, radius 4, padding 0 0 0 6, 14px, toned fill and ink; × 16 in a 20 box
      input (18)  20 tall, 14px
  list   div (21) padding 4, gap 1
    hint div (22) 12/14.4 500 muted, 6 above, 8 below
    row  div (29) 28, padding 0 8, radius 6, gap 8: drag handle 16, tag 20 (radius 4, padding 0 6), "…" 24 at the end
```

Area:

```
root    div.area-tag-picker[data-open]            owns: variant/size locals
  field div.__field[aria-invalid][data-disabled]   owns: edge, fill, radius, focus ring, wrap, insets
    Badge (soft, tone, dismiss) × n                 the tags
    input.__input[role=combobox]                    the text
  input[type=hidden] × n                            form values
  listbox div.area-menu.__listbox[popover][aria-multiselectable]
    hint  div.area-menu__label.__hint
    option div.area-menu__item.__option[role=option]: Badge + check
    create div.area-menu__item.__create: "Create" + Badge
```

Inset equation (md 32, tag 20, border 1): tag inset = (32 − 20) / 2 − 1 = 5 on every side, so the
first tag sits as far from the start as from the top; rows of tags are 20 apart by 5 (the same
inset), tags 6 apart (Notion). With no tags the input starts on Input's text column: 10 − 5 = 5
more.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| field chrome | Input's: outline (white, `input-edge`) or soft; per-tier radius; field focus ring | Peer: Input | Notion's field is soft and square-cornered inside its popup |
| field height | control tier (32 md), grows by a row of tags | Input tiers | Notion 38 |
| tag | Badge soft, size sm (20), tone per option, dismiss × | Notion tags 20 (Badge spec measured Notion's tags) | Badge is a pill by the theme's Pills setting; Notion's are radius 4 (set `data-area-pills` without badge to get corners) |
| tag gap | 6 | Notion (node 9: gap 6) | — |
| tag inset | (height − tag) / 2 − border | Equal insets (owner 2026-10-01) | Notion 4 + 5.25 / 8 |
| list | Menu surface and rows; Combobox placement | Peer: Combobox | Notion opens the editor over the cell |
| hint | Menu label, "Select a tag or create one" | Notion (node 22) | Notion 500 weight; Menu labels are regular |
| option row | Badge + check at the end | Peer: Custom select (S13 C) | Notion has no check (the chosen tags are in the field); drag and "…" excluded |
| create row | "Create" + the tag it would make | Notion; Combobox's create row | — |
| removal | Backspace in an empty field; the tag's × | Notion; Badge dismiss | — |

## States

| State | Change | Evidence |
|---|---|---|
| focus / open | field focus ring and edge; `data-open` | Input |
| highlighted row | `bg-component-hover` | Menu; Notion hover capture (row plate) |
| chosen row | check | Custom select |
| disabled | Input's disabled fill; tags dimmed, no ×; list never opens | Input, Badge |
| invalid | `input-invalid-color` edge and ring | Input |

## Behavior and accessibility

`input role=combobox aria-autocomplete=list aria-expanded aria-controls aria-activedescendant`;
the listbox is `aria-multiselectable`, options carry `aria-selected`. Typing filters (case-insensitive
contains) and highlights the first row; ↑/↓ move (wrapping, disabled rows skipped); Enter adds or
removes the highlighted tag and keeps the list open, clearing a search; Backspace in an empty
field removes the last tag; Escape closes; blur closes and clears the text. Each change is
announced in a status region ("work added", "Ideas removed"). Each tag's × is a button named
"Remove <tag>". `name` submits one hidden input per value; form reset restores `defaultValue`.

## Verification

Builds, manifest parity, typecheck pass. Browser (Review page): "wo" + Enter adds work; typing
"Ideas" offers Create, Enter creates and adds it; Backspace removes it and announces "Ideas
removed"; chosen rows show the check. Dark and compact checked on the Review page 2026-10-06 (compact field 28). Unverified: screen reader, RTL.

## Open questions

1. Tags as pills (theme default) or Notion's radius 4 inside this field?
2. Show the check on chosen rows (Area's value-picker rule) or hide chosen tags' checks as Notion?

## Feedback log

- 2026-10-05 · batch 1, second component → built from Notion's select property editor on Input's
  chrome, Badge tags and Menu rows; on the Review page, in review.
- 2026-10-06 · owner: the tags look wrong → the field and list now hold Tag (new component, `tag.md`)
  instead of Badge: 20 tall, 14 regular, Notion's palette, radius 4 (no longer a pill), muted × with a
  concentric hover plate. Open question 1 (pill or radius 4) is settled by Tag: radius 4.
