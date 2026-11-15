# Date range picker spec

**Captures:** `docs/research/captures/calendar/notion--search-date-filter-popover--rest--light.json` (presets, panel),
`calendar/notion--range*` (the band), Date picker's and Calendar's Area captures
**Peers:** Date picker (the field, the panel, the Clear footer), Calendar (range selection, two months), Menu (preset
rows, check, separator), Popover

## Owner decisions

- 2026-10-10: "continue working" → Date range picker, next in the date family (inventory: "DatePicker and
  DateRangePicker (field + popover)"); answers Date picker's open question 1 (range) with a sibling component, so the
  approved single-date picker is unchanged.
- 2026-10-10: "go with your recommendations" → no typed start / end fields until a product shows one; no Include time
  until TimeField exists.

## Job and boundaries

Set a range of dates: a field shows it ("Oct 4 – 10, 2026"); it opens a panel with optional presets (Today, Last 7
days) and a range Calendar, and a Clear row. Not Date picker (one date), not Calendar (always visible, no field), not
a date-time range (Notion's Include time; open question 2).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant, size, icon, states | Date picker's: outline / soft / ghost, sm / md / lg, leading calendar, placeholder, disabled, invalid | One field across the date family | Date picker (accepted) |
| content | presets (rows above the month) | Notion's search date filter: Today, Last 7 days, Last 30 days; Untitled UI's range picker lists presets beside the month | Notion |
| layout | one month (default) or two side by side | Ranges across a month's end; Calendar's `visibleMonths` | shadcn, React Aria, Untitled UI two-month examples |

Excluded: typed start and end fields (Notion's search filter has none; Date picker's typed field is open question 1),
an Apply / Cancel footer (Untitled UI; Notion applies at once), a date-field-in-the-trigger (React Aria's segmented
DateRangePicker; segmented entry is DateField's job).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | Search › date filter popover: a field menu chip, three preset rows, a range calendar, a Remove row | app.notion.com, 2026-09-26 (Calendar pass), read-only | evidence only | `calendar/notion--search-date-filter-popover`, `calendar/notion--range*` |
| notion | target product | Date property editor: End date switch (range), Include time | 2026-10-05 (Date picker pass) | evidence only | `date-picker/notion--date-property-editor--open` |
| react-aria, shadcn, uui | design systems | DateRangePicker (two fields, RangeCalendar); Popover + Calendar `mode="range"` with two months; date range picker with presets | React Aria docs; shadcn date-picker range example; Untitled UI date pickers | Apache-2.0 / MIT | — |
| chatgpt, figma | target products | not found: no date range control in either | — | — | — |

## Anatomy

```
notion   panel 248 wide, radius 10, sections padding 4
           header: field chip (12/16 500, 5% plate) · Clear (12/16 500)
           presets: rows 28 tall, radius 6, 0 8 padding, 14/16.8; the chosen one checked
           month (padding 4 8 8): react-day-picker range
           rule 12 in, Remove row 28

area     div.area-date-picker.area-date-picker--{variant,size}.area-date-range-picker
           button.area-date-picker__trigger: icon · value ("Oct 4 – 10, 2026", formatRange)
           div.area-popover.area-date-picker__panel
             div.area-date-range-picker__presets[role=group]: button.area-menu__item.__preset[aria-pressed] (check when chosen) · separator
             div.area-calendar (plain, range, 1 or 2 months)
             div.area-date-picker__footer: separator · Clear
           input[type=hidden] <name>-start, <name>-end
```

The presets bleed from the Popover's 12 to Menu's 4 at the top and sides, as Date picker's footer does at the bottom.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| field | Date picker's trigger and paint | Peer Date picker (accepted) | — |
| value text | `Intl.DateTimeFormat.formatRange` with a short month ("Oct 4 – 10, 2026"; "Oct 28 – Nov 3, 2026"; one day as one date) | Notion's short dates in filters; formatRange shares the year and month once | Date picker's long month would overflow a 240 field across months |
| preset rows | Menu's rows (32, radius-list-row), 4 from the panel's sides and top; the chosen one checked; a separator after them | Notion's rows 4 in, checked; peer Menu | Notion's rows are 28; Area's Menu row is 32 at the default density |
| month | Calendar plain, range; `visibleMonths` 1 or 2 | Calendar (accepted) | — |
| commit | a preset or the second day sets the value and closes; focus returns to the field | Date picker closes on pick; Notion applies at once | — |
| Clear | Date picker's footer | Peer Date picker; Notion's Remove | — |
| form | `<name>-start`, `<name>-end` | Calendar's range inputs | — |

## Behavior and accessibility

The trigger is Date picker's (`aria-haspopup="dialog"`, `aria-expanded`); the panel is a Popover dialog named by the
field's label. Presets are buttons in a group with `aria-pressed`. In the month, Calendar's grid keyboard holds; the
first press sets the start and the band follows focus or the pointer to the end; Escape drops a half-picked range, a
second Escape closes the panel.

**State hooks (manifest).** Its root is a Date picker too (`area-date-picker`), so `open`, `invalid` and `read-only` are Date picker's on the same element and trigger (`statesFrom`).

## Visual pass

In the gallery (light): presets 4 from the panel's sides, the check on Last 7 days, the rule, the month, Clear; two
months side by side with the band across the month break; the field reads "Oct 28 – Nov 3, 2026" in 240.

## Verification

- `npm run build` (parity, token references), `build:docs`, `typecheck`, `date-range-picker.test.mjs` (2).
- In the gallery: Today sets "Oct 10, 2026" and closes with focus on the field; 12 then 22 sets "Oct 12 – 22, 2026";
  two months render at 544 wide; after a first day, Escape drops it with the panel open, a second Escape closes it
  with the value unchanged and focus on the field.
- Unverified: the band preview between the two clicks (the in-app browser's synthetic hover didn't fire it; it is
  Calendar's), dark and compact in the panel, screen readers, RTL.

## Open questions

Resolved 2026-10-10 (owner: "go with your recommendations"); kept for the record.

1. Typed start and end fields above the month, as Date picker has one typed field? Notion's filter has none.
   Recommendation: leave them out until a product use shows one.
2. Include time (Notion's switch) for date-time ranges? Recommendation: wait for TimeField.

## Review note, 2026-10-10

- **What changed:** New component. Date range picker is Date picker for a span of days: the field shows "Oct 4 – 10,
  2026", and its panel has optional shortcuts (Today, Last 7 days, Last 30 days) above the calendar, one or two months
  wide, and a Clear row.
- **Why:** It was next in the date family, and Date picker's open question about ranges. The shortcuts follow Notion's
  search date filter; the field, calendar and Clear row are the ones you already approved in Date picker.

## Feedback log

- 2026-10-10 · owner: "continue working" → Date range picker on Date picker's field and panel with Notion's preset rows;
  6 gallery tiles, in review.
- 2026-10-10 · owner: "go with your recommendations" → open questions 1–2 resolved as recommended; no change.
- 2026-10-11 · owner, review round 7: approved.
- 2026-11-11 · system evaluation F5 · the manifest declares `open`, `invalid` and `read-only` as Date picker's (`statesFrom`); no paint changed.

## Review note, 2026-10-28 (round 82)

- **What changed:** the ghost tile is sm, as Date picker's and Custom select's ghost tiles (a property value). No
  change at rest (a ghost field has no chrome and sm keeps the text size); its hover plate is 4 shorter. Demo only.

### 2026-11-07 · Success, warning and read-only; open and defaultOpen; the ref on the trigger (components audit O1, O2, O3, O7)

- **What changed:** As Date picker's: `validationStatus`, `readOnly`, `open` / `defaultOpen`, and the ref on the trigger button.
- **Why:** DateRangePicker.tsx:33, :50, :19, :67. From the components audit's internal peer comparison (`docs/research/components-audit-2026-11-07/internal.md`); the owner took every recommendation ("Take all recs", 2026-11-07).
- **Verdict:** awaiting the owner.

### 2026-11-14 · One field shell (system plan, Phase 2, B3)

- Takes Date picker's trigger: the one field shell and the value as a cap slot (it sat 0.62 high).
- Why: docs/research/system-evaluation-2026-11-11 (B3.1, B3.2, B3.3, B2.2 in fields; README §5); the owner took every recommendation on 2026-11-11 and the 24 targets on 2026-11-13. B3.2: field text stays on Button's inset (Keep 10, the pick), so nothing moved.
- Verdict: awaiting the owner.
