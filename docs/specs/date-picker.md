# Date picker spec

**Status:** complete · 2026-10-08 (owner approved on the component review page after the requested changes)
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
    footer div.__footer: Menu separator + Menu row "Clear"; bleeds to Menu's inset (4) on the
           sides and bottom, so the rule is 12 in and the row plate 4 in (Notion nodes 188–192)
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
| Clear | Menu separator + Menu row, disabled when empty; the section at Menu's inset: plate 4 from the sides and bottom, rule 12 in, text 15 (compact 12) | Notion (Clear row under a rule; row plate 4 in, rule 12 in, nodes 189–190) | Text 15 not 12: Menu's row padding |
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

## Visual pass

### Claude in Chrome audit, 2026-10-07

Sources (light unless noted; open and Escape only, nothing picked):

| Source | URL | What |
|---|---|---|
| Notion | app.notion.com, owner's tasks board | Re-open of the date property refused by the session's safety classifier; the 2026-10-05 capture (`notion--date-property-editor--open--light`) re-read node by node instead. `/date` mention and filter pickers not opened (both write to the owner's page or view) |
| shadcn (Base UI build) | ui.shadcn.com/docs/components/base/date-picker | Basic trigger and its popover, computed |
| React Aria | react-aria.adobe.com/DatePicker | Starter DatePicker field and popover, computed |
| Mantine | mantine.dev/dates/date-picker-input | Trigger rest and open; dropdown did not mount in a background tab (rAF), not measured |
| Fluent 2 | storybooks.fluentui.dev, compat DatePicker default | Field and popup surface, computed |
| Google Flights | google.com/travel/flights | Departure field at rest only |
| Base UI | base-ui.com | No date picker or calendar among 39 components |
| Area | localhost:4377/review.html | Light, dark, compact (scoped `data-area-*` on the canvas, nothing persisted), transitions off while measuring |

Not reached: Material 3 docked picker, Linear, Airbnb, Google Calendar, ChatGPT scheduled tasks
(time, and the tab was backgrounded by sibling sessions). No new capture files: the clipboard
and relay routes were unavailable this session, so the values below are computed styles read
in place; `area--date-picker-panel--open--light.json` predates the footer change.

| Slot · property | Area (before → after) | Notion | shadcn | React Aria | Fluent 2 | Mantine |
|---|---|---|---|---|---|---|
| field height · radius | 32 · 8 (sm 28, lg 40; compact 28) | — (no field) | 32 · 10 | 32 · 8 | 32 · 4 | 36 · 8 |
| field side padding | 10; 7 + 1 border before a 16 icon | — | 10 / 8 | 12 / 40 (button) | 12 | 12 |
| field glyph | optional leading calendar | none | trailing chevron-down 16 | trailing chevron-down 16 in a 24 button | trailing calendar 20 | none (optional sections) |
| field text | "October 14, 2026" | "October 5, 2026" | placeholder "Pick a date" | segments | placeholder "Select a date..." | "October 7, 2026" |
| open field | focus edge colour | — | unchanged | unchanged | — | focus edge colour (rgb 34 139 230) |
| panel width · radius | 276 · 12 | 248 · 6 | 201 · 10 | 268 · 10 | 442 · 4 | — |
| panel inset to content | 12 | 4 (sections), field 12 | 8 (calendar's own) | 8 | 0 (calendar's own) | — |
| panel lift | float shadow + 1px border | 1px ring + two shadows | 1px ring 10% + md shadow | none measured | shadow 2 + 16 | — |
| Clear / Today | Clear row; no Today | Clear row; Today in caption | none | none | "Go to today" link | clear button in the field |
| Clear row plate from sides · bottom | 12 · 12 → **4 · 4** | 4 · 4 | — | — | — | — |
| Clear text from panel edge | 23 → **15** (compact 12) | 12 | — | — | — | — |
| rule inset · row gap | 12 · 4 | 12 · 4 | — | — | — | — |

Findings, by severity:

1. **Clear section sat at the Popover's inset, not Menu's (fixed).** The row plate was 12 from the
   panel's sides and bottom with an 8 corner inside the 12 panel corner, so not concentric, and its
   text started at 23 against the field's 21 and the caption's 16. Notion's Clear row plate is 4 in
   with the rule 12 in (nodes 189–190). The footer now bleeds by `4 − 12` on the sides and bottom
   (`--_footer-bleed`, lifting Popover's `max-inline-size: 100%` cap) and uses Menu's own
   separator inset (8, so 12 from the edge). Measured after: plate 4 / 4 / 4, rule 12, text 15
   (compact 12), corner 8 = 12 − 4; panel 276 × 355 (was 363); light, dark and compact.
2. **No trailing affordance on the field (open question 4).** shadcn and React Aria end the field
   in a chevron-down, Fluent in a calendar glyph; Notion and Mantine show none.
3. **Two focus edges while open (open question 5).** The open field takes the focus edge colour
   (as Mantine) while focus sits in the typed date, which also draws the focus edge and halo.
4. Panel geometry otherwise holds: 12 inset matches Notion's field inset (12) and Popover;
   width follows the 252 month (React Aria's month is also 252). Date text format matches
   Notion and Mantine. Dark: panel rgb(29,29,29), border rgb(75,75,75), open edge #c1d9fd; ghost
   open plate rgb(238,238,238) light, rgb(63,63,63) dark.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. The panel is Popover and the month is Calendar, so their motion is
theirs; this pass changes the trigger (as Custom select's) and, through Calendar, the days.

| Interaction | Before | After |
|---|---|---|
| Trigger hover (edge, ghost plate) | in and out: `--area-transition`, fast 100, ease-out | in: instant (`:hover` 0s, under `hover: hover`); out: fast, ease-out |
| Press | eased in over fast | instant (`:active` 0s) |
| Focus ring (outline + halo) | halo (`box-shadow`) faded in and out over fast | instant: `box-shadow` left out of the trigger's `transition-property` |
| Open (focus edge, ghost pressed plate) | eased in over fast | instant (`[data-open]` 0s); leaves on fast, ease-out |
| Panel enter / exit | Popover: `opacity` + `scale` 0.97 at the trigger origin | unchanged here (surface.css) |
| Day hover, selection | snapped both ways (no transition) | Calendar's: in instant, out fast ease-out (`calendar.md`) |
| Clear row | Menu's row | unchanged (surface.css) |

Crispness: checked in the browser with the panel's transition finished: `scale: 1`, panel at
468, 436 (whole pixels), all 35 day plates on whole pixels, no `will-change` or resting transform on
the trigger.

## Open questions

1. Notion's panel also holds End date (range), Include time, Date format and Remind. Add range and
   time as options here (Calendar already has range), or keep this a single-date picker?
2. Close on pick (WAI) or stay open as Notion does?
3. Today: Calendar's ring (Area) or Notion's blue fill and a "Today" button in the caption?
   Fluent adds a "Go to today" link too (2026-10-07). Recommendation: keep the ring; a Today
   action belongs to Calendar's caption if added, not to this panel.
4. Trailing chevron-down on the outline/soft field (shadcn, React Aria), matching Select's
   trigger? Recommendation: yes for outline/soft, none for ghost (Notion's property), keeping the
   optional leading calendar.
5. While open, keep the field's focus edge colour (Mantine) or hold the rest edge so only the
   typed date shows focus (shadcn, React Aria)? Recommendation: hold the rest edge; one focus
   indicator on screen.

## Interaction polish, 2026-10-16

The trigger's label is not selectable. See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Feedback log

- 2026-10-05 · batch 1, third component → built from Notion's date property editor on Select's
  chrome, Popover, Input and Calendar; on the Review page, in review.
- 2026-10-07 · Claude in Chrome audit (shadcn, React Aria, Mantine, Fluent 2, Google Flights; Notion
  re-read from the capture) → Clear section moved to Menu's inset (plate 4, rule 12); trailing
  chevron and open focus edge raised as open questions 4–5.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → motion pass: trigger hover, press, focus and open paint land at once and fade out on fast ease-out; the focus halo no longer fades; days fade out through Calendar. "Motion and interaction, 2026-10-07".
- 2026-10-08 · owner approved Custom select's recommendations (custom-select.md Q4, Q5, Q7), which name Date picker → no visible change: the field has no chevron today (open question 4). If one is added, it takes the shared field chevron inset (`inset.css`, 8 from the edge at sm/md) and `input-chevron` ink, and stays still.
- 2026-10-08 · owner: approved on the component review page (re-review after the requested changes).
- 2026-10-15 · owner: "merge it, then continue working" → boundary sweep under increased contrast (CONTRAST.md: required boundaries target 3:1): the soft variant's resting edge is `input-edge-soft`, as Input's; ghost stays chromeless.
