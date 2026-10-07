# Date picker spec

**Status:** in review · 2026-10-05 (built; Review page batch "New components, batch 1")
**Captures:** `docs/research/captures/date-picker/notion--date-property-editor--open--light.json` and Area (`area--*`, 2026-10-06: every tile at rest plus the open list / panel)
**Peers:** Calendar (the month, plain variant), Popover (the panel), Input (the typed date),
Select / Custom select (the field's chrome and the ghost trigger), Menu (the Clear row and its rule)

## Owner decisions

- 2026-10-04: batch 1 (owner pick). Date picker reference: "Notion's date property: a field that
  opens a calendar"; reuses Calendar, Popover, Input group, Field (`REVIEW_BATCHES`).
- Inherited: Calendar's day treatment, selection and keyboard (calendar.md, accepted); Popover's
  surface (accepted).

## Job and boundaries

Set one date: a field shows it in words; it opens a panel where the date can be typed or picked
from a month, or cleared. Not Calendar (always visible, no field), not DateInput (the native date
input), not a range or date-time picker yet (Notion's End date and Include time toggles; see Open
questions).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | outline (default), soft | Field chrome shared with Select and Custom select | forms, inspectors |
| variant | ghost | A property value: plain text until hovered | Notion's date property ("Empty") |
| size | sm, md (default), lg | Control tiers | — |
| content | leading calendar icon (optional) | Date fields in forms; Notion's property shows none | — |
| behavior | min, max, unavailable days; Clear row | Calendar's limits; Notion's Clear row (capture node 190) | — |
| state | open, placeholder, disabled, invalid | Select's states | — |

## Sources

| Id | Type | What | Where | Captures |
|---|---|---|---|---|
| notion | target product (primary: properties) | Date property editor: typed-date field, month caption with Today and arrows, 7 × 6 grid, End date / Include time switches, Date format and Remind rows, Clear, help link | app.notion.com, owner's "tasks" database, a task's side peek, Date "Empty"; opened only, Escape to close, the date stayed empty | `notion--date-property-editor--open--light` |
| area | peers | Calendar (Notion day hover, today, selected measured there), Popover | calendar.md, popover.md | — |

## Anatomy

```
notion (node numbers from the capture)
panel   div (0)   248 wide, radius 6, white, Notion's float shadow; sections padding 4
  field  div (6)   224 × 28, padding 0 8, radius 6, rgba(66,35,3,.03) with a 1px rgba(28,19,1,.11) ring, 14px
  month  (11–139)  caption 14px with Today (12/14.4 500 muted) and two 20 arrows; weekday row 32,
                   12/18 muted; days 32 cells holding 28 buttons radius 6; today rgb(39,131,222) fill, white
  rule   1px rgba(42,28,0,.07), 12 in
  rows   28 tall, padding 0 8: End date (switch 30 × 18), Date format & time zone (value + chevron),
         Include time (switch), Remind (value + chevron)
  rule, Clear row 28; rule, help link row 28 with a 20 icon
```

Area:

```
root    div.area-date-picker[data-open]          owns: variant/size locals
  trigger button.__trigger[aria-haspopup=dialog]  owns: Select's chrome, sides (inset.css)
    icon  span.__icon (optional)  value span.__value[data-placeholder]
  panel  div.area-popover.__panel[popover][role=dialog]   Popover's surface, inset 12, gap 16
    Input size sm (typed date)
    Calendar variant plain (single)
    footer div.__footer: Menu separator + Menu row "Clear"
```

Field insets: Select's (text 10 at md; with an icon, the icon square 8 from the edge).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| field | Select's chrome, tiers and corner; ghost as Custom select | Peers: Select, Custom select | — |
| field text | "October 14, 2026" (`Intl` long month), `formatOptions` to change it | Notion's default full date | — |
| panel | Popover surface (inset 12, gap 16, radius surface) | Peer: Popover | Notion 4 / 8 padding, radius 6 |
| typed date | Input sm (28), full width, selected on open; Enter commits; ISO or anything the platform parses ("Oct 22 2026") | Notion's field (28 tall) | Notion's field is soft with a ring; Input sm outline |
| month | Calendar plain, single selection, today ringed | Peer: Calendar (accepted) | Notion fills today blue and has a Today button |
| after picking a day | sets the date, closes, focus back on the field | WAI date picker dialog pattern | Notion stays open (it has more settings below) |
| Clear | Menu separator + Menu row, disabled when empty | Notion (Clear row under a rule) | — |
| invalid typed text | Input invalid paint, value kept | Input | — |

## States

| State | Change | Evidence |
|---|---|---|
| hover | edge hover (outline/soft); ghost hover plate | Select, Custom select |
| open | `data-open`; field in focus edge colour (ghost: pressed plate) | Custom select |
| placeholder | `input-placeholder` ink ("Pick a date"; ghost demo "Empty", Notion's) | Select |
| disabled | Select's disabled paint; never opens | Select |
| invalid | `select-invalid-color` edge | Select |
| typed text invalid | Input invalid edge until edited | Input |

## Behavior and accessibility

The field is a button with `aria-haspopup=dialog`, `aria-expanded` and `aria-controls` (Popover's
trigger path); the panel is a non-modal dialog named by the picker's `aria-label`. Opening moves
focus to the typed date (its text selected); Tab reaches the month's arrows and days (Calendar's
own keys: arrows by day and week, Page Up/Down by month, Home/End within the week). Enter in the
typed date commits and closes; a day click or Enter commits and closes; Escape or a press outside
closes; focus returns to the field. min/max/unavailable dates are refused when typed (the field
shows invalid). `name` submits YYYY-MM-DD; form reset restores `defaultValue`.

## Verification

Builds, manifest parity, typecheck pass. Browser (Review page): open focuses the typed date with
its text selected; "2026-10-20" and "Oct 22 2026" + Enter set the date and return focus to the
field; Tab from the field reaches "Previous month"; invalid text keeps the panel open with the
invalid edge. Dark (panel and calendar) and compact (field 28) checked 2026-10-06. Unverified: screen reader, RTL, Figma comparison.

## Open questions

1. Notion's panel also holds End date (range), Include time, Date format and Remind. Add range and
   time as options here (Calendar already has range), or keep this a single-date picker?
2. Close on pick (WAI) or stay open as Notion does?
3. Today: Calendar's ring (Area) or Notion's blue fill and a "Today" button in the caption?

## Feedback log

- 2026-10-05 · batch 1, third component → built from Notion's date property editor on Select's
  chrome, Popover, Input and Calendar; on the Review page, in review.
