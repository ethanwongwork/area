# Filter bar spec

**Captures:** none taken; the measured values are Notion's computed styles in `docs/research/components-audit-2026-11-07/notion.md`
**Peers:** Chip (each filter), Button (Add filter, Reset), Popover and Menu (the editors), Search field (a typed query), Segmented and Tabs (fixed choices), Setting row (the same change dot)

## Owner decisions

- 2026-11-07: components audit, "Take all recs": N5 Filter bar is built (review page St7jcEipvPoa3GvSwnAvBT).

## Job and boundaries

Filter bar shows the filters a view has on, as a row: each filter a Chip that reads "Name: value" and opens its editor,
an Add filter button that opens the caller's menu of properties, and Reset once the filters differ from the view's saved
ones. A filter changed since it was saved carries a dot. It holds no filtering logic: each editor is a Popover or Menu the
caller gives, with the filter as its trigger, and the view applies the filters. It is not Chip's filter kind, which
toggles on and off; not Search field, which takes a typed query; and not Segmented or Tabs, a fixed choice of views.

Intake gates:

- **Useful.** Notion's database filter bar (notion.md: chips with an editor each, "+ Filter", Reset, the unsaved dot;
  Help Center "views, filters and sorts") and Primer's filter pattern (Filter, FilterCore, ListFilterButton; scenario
  pattern "Filter"). PRODUCT_UI.md rule 6 ("Reset only once changed") has no Area part that draws it.
- **Unique.** Chip group lays out chips; it doesn't pair a chip with an editor, add filters, or reset to a saved view.
- **Composable.** Chip's block for each filter, Button for Add filter and Reset, Popover and Menu for the editors (their
  `trigger` sets the chip's `aria-expanded`, `aria-haspopup` and `aria-controls`).
- **Consistent.** An applied filter takes Chip's selected paint (the selection role, neutral by default); the dot is the
  change mark for modified, as Setting row's.
- **Worth maintaining.** No state of its own beyond the dot and Reset; native Tab order. It will not filter, build
  AND / OR groups (Notion nests them three deep), or save the view ("Save for everyone").

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| item value | given / not given | Applied (Chip's selected paint) or waiting for a value (the plain chip, the name alone) | Notion: grey empty chip, tinted chip with a value |
| item dirty | boolean | The filter changed since the view was saved: the dot | Notion's unsaved dot |
| bar dirty + onReset | boolean | Reset at the end while the filters differ from the saved view | Notion's Reset; PRODUCT_UI.md rule 6 |

Excluded: a remove (×) on each chip (Notion removes a filter from its editor; a chip's own × would compete with the
chevron), Primer's query input (Search field), nested filter groups, a count of active filters on a button
(ListFilterButton: a Count beside a Button does it).

## Anatomy

```
root      <div role=group>   owns: flex row that wraps, 8 gap (compact 6)
  item    <button>            the Chip block: area-chip--assist --sm; label "Name: value", the dot, the chevron
    dirty <span>              owns: the 6 dot, fg-change-modified; "Unsaved" for assistive tech
  add     <button>            Button ghost sm, add glyph, "Add filter"
  reset   <button>            Button ghost sm, "Reset", at the row's end
```

The chip's end inset with its chevron: the icon box's (`--_box-end: --_box-icon`, as an icon at a Button's end), set by
`.area-filter-bar__item`; Chip's own inset rule covers a leading icon only (ChipLink's trailing icon has the same gap,
left for Chip's next review).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| item · size | Chip `sm` | Notion's 24 tall chip | — |
| item · shape | Chip's (a pill by default) | Notion's radius 32 | — |
| item · applied paint | Chip's selected (`selection-surface`, `selection-edge`, `fg-selection`) | Notion's accent tint `rgba(0,124,215,.094)`, ink `rgb(39,131,222)` | Area's selection role, accent when the Selection setting is accent |
| item · empty paint | Chip assist (`bg-surface`, control edge) | Notion's `rgba(33,27,23,.05)`, ink `#7d7a75` | Chip's base paint, so a filter is a chip |
| item · words | "Name: value"; one or two picks by name, then "3 selected" | Notion "Status: On track"; WRITING.md "A choice of several" | — |
| item · trigger | a button, no `aria-pressed` | It opens an editor (the overlay sets `aria-expanded`) | Chip's filter kind is a toggle |
| unsaved dot | 6, `fg-change-modified`, before the chevron | Notion's 9 dot `rgb(213,128,59)` | Area's dot size (Tabs, Tree view, Setting row); in the line, not on the corner, so it never overlaps the edge |
| gap | `ui-cluster` (8, 6 compact) | Chip group | Notion's 6 |
| Add filter | Button ghost sm, add glyph, "Add filter" | Notion's ghost "+ Filter" 24 | WRITING.md: a button is a verb and its object |
| Reset | Button ghost sm, "Reset", at the end | Notion's Reset 28, pad 0 8, radius 6, at the end | Button's sm |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| applied (item `data-selected`) | Chip's selected paint | Notion |
| unsaved (item `dirty`) | The dot; "Unsaved" joins the chip's name | Notion |
| changed (bar `dirty`) | Reset shows | Notion; PRODUCT_UI.md rule 6 |
| disabled (item) | Chip's disabled | Chip |

## Behavior and accessibility

A `role="group"` named "Filters". Each filter is a native button whose name reads "Name: value" (and "Unsaved" when
dirty); as a Popover's or Menu's trigger it gets `aria-expanded`, `aria-haspopup` and `aria-controls`, and Enter or Space
opens its editor. Native Tab order through the filters, Add filter and Reset. Forced colours: the dot is kept in
CanvasText; the chips keep Chip's repairs. Not implemented: removing a filter from the bar, filter groups, saving.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product (computed styles, read-only) | OKR filter bar: empty chip 24h, pad 0 8, radius 32, gap 6; valued chip tint and ink; unsaved dot 9 orange at the corner; "+ Filter" 24 ghost, 14px; Reset 28h; row 40h, pad 8; editor header "Status is", option rows 28 | `notion.notion.site/OKR-Tracker-…` (notion.md rows 61, 62, 106, 131) | evidence only | none |
| primer | design system | Filter / FilterCore (a query with suggestions), ListFilterButton (a count of active filters); scenario pattern "Filter" | `primer.style/product/internal-components/` (primer.md:150) | MIT | none |

## Measurements

Notion's computed values are in the Sources row; no capture JSON was saved.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Chip group | a row of chips | `ui-cluster`, wraps | same | Match |
| Chip selected | a chosen chip | selection role | applied filter | Match |
| Setting row | change dot | 6, `fg-change-modified` | same | Match (cohesion test) |

## Visual pass

Looked at in the built renderer in a browser (`desktop-dist`, the app's gallery without Electron; another session owns the running Electron), light and dark, at the app's type 13 Compact: applied chips take the selected fill, an empty one the plain chip, the dot sits before the chevron, Reset at
the row's end. Not done: an editor open in Electron, the bar under a view's tabs.

## Verification

- `node --test packages/react/tests/filter-bar.test.mjs` (markup, order, as a Popover's and a Menu's trigger); cohesion's
  change-mark test.
- Seen in the gallery (above); not in Electron.

## App use

The app's view filters are ghost menu buttons in the Canvas header ("All statuses ⌄", PRODUCT_UI.md, Canvas header 1;
`view-controls.tsx` ViewFilter), not chips, so nothing is swapped.

## Review note, 2026-11-07

- **What changed:** a new family for a view's filters as chips, each opening its editor, with Add filter, Reset and an
  unsaved dot.
- **Why:** you took the audit's recommendation; Notion's databases and Primer both have it, and Area had no part for
  "Reset only once changed".

## Feedback log

- 2026-11-07 · built from the components audit (N5).
