# Time field spec

**Captures:** `docs/research/captures/time-field/`
**Research:** [design-system sources](../research/compass-components-2026-10-13/time-field.md) (pinned commits, cited lines)
**Peers:** Input (the shell, sizes, focus), Date picker and Date range picker (dates; a later DateField shares the
segments), Number field (stepping a number), Menu (the list of times), Calendar

## Owner decisions

- 2026-10-13: the Compass review → the backlog's "TimeField" under "Date and time" ("Keep segmented date editing
  distinct from a text field with a mask"), with Password field, OTP field, Progress circle and Stepper.

## Job and boundaries

A time field takes a time of day: a reminder, a meeting start, a scheduled run. Hour, minute, optional second and
AM/PM are each typed or stepped on their own; with `step`, a list of times at that interval can be picked from instead.
Not a duration (minutes and hours of length), not a date (Date picker), not a time zone picker, not a wheel (Compass's
mobile picker; no desktop system draws one).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| hourCycle | the locale's (default), 12, 24 | React Aria and Fluent read `Intl` hourCycle; MUI the adapter; Mantine and Ant a prop | — |
| granularity | minute (default), second | React Aria, MUI X, Mantine, Ant `showSecond` | — |
| step | none (default), minutes between listed times | ChatGPT's task schedule (15); Fluent `increment` 30; Ant `minuteStep`; MUI `timeSteps` | ChatGPT |
| icon | none (default), the clock, any | React Aria starter, Mantine `leftSection` | — |
| variant | outline (default), soft | Input's | — |
| size | sm, md (default), lg | Input's tiers; Spectrum 2 S 24 / M 32 / L 40 | — |
| state | empty, partly filled, filled, invalid, disabled, read-only | all | — |

Excluded: scrolling hour / minute columns (Ant, MUI desktop, Mantine; ChatGPT uses one list), a wheel (Compass, iOS),
a native `<input type="time">` (its look and 12/24 belong to the browser; no full system ships it).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | Scheduled › New task › Time: a read-only combobox "9:00 AM PT" with a 20 chevron; a listbox of 96 times 15 minutes apart, the chosen one checked, opened centred on it | chatgpt.com/scheduled, 2026-10-13, opened and closed without saving | evidence only | `chatgpt--schedule-time-{trigger--rest,list--open,option--rest,option--selected}` |
| react-aria | design system (source) | TimeField segments: spinbutton roles, keys, placeholders, hourCycle, labelling | `packages/react-aria/src/datepicker/useDateSegment.ts`, `react-stately/src/datepicker/useTimeFieldState.ts` at `9b7a06e` | Apache-2.0 | — |
| spectrum-2 | design system (source) | TimeField: field 24 / 32 / 40; focused segment blue-800 / white, 2 radius, 2 padding | `@react-spectrum/s2/src/TimeField.tsx` at `9b7a06e` | Apache-2.0 | — |
| mui-x, mantine, ant, fluent, carbon | design systems (source) | sections, step props, column and list popovers, row sizes | pinned in the research file | MIT / Apache-2.0 | — |
| area | this system | Every gallery tile at 1:1, light and dark | the app, headless Edge | — | `area--*` (26) |

Notion's date picker has "Include time" (a typed "9:00 AM" field), but turning it on edits a page's date, so it was not
opened. Figma has no time field.

## Anatomy

```
chatgpt  div[data-slot=popover-anchor] (109 × 40 row cell): input[role=combobox][readonly] 14/20 · button[tabindex=-1] 20 chevron
         popover 160 wide, radius 16, padding 10, 0.5px ring + 8/16 shadow: listbox (max-h 288) of 96 buttons[role=option]
         option 140 × 30, padding 5 8, radius 12, 14/20, tabular numerals; selected: black 5% plate + a 16 check at the end
area     div.area-input.area-time-field[role=group]      Input's shell; hugs its segments
           span.area-input__icon                          the clock (optional)
           span.area-time-field__segments                 tabular numerals
             span.area-time-field__part > span.area-time-field__segment[role=spinbutton]  hour
             span.area-time-field__part > span.area-time-field__literal ":" + segment     minute (second)
             span.area-time-field__part > literal " " + span.area-time-field__segment.area-time-field__period  AM/PM
           span.area-input__action > button.area-input__action-button.area-time-field__trigger   with `step`
             Menu.area-time-field__list > MenuItem[role=menuitemradio] …
```

## Measurements

ChatGPT's list (`node scripts/capture-compare.mjs docs/research/captures/time-field/chatgpt--*.json`, trimmed):

| slot · property | chatgpt list | chatgpt option | chatgpt option · selected |
|---|---|---|---|
| size | 160 × 308 | 140 × 30 | 140 × 30 |
| padding | 10 | 5 8 | 5 8 |
| radius | 16 | 12 | 12 |
| type | — | 14/20 400, tabular | 14/20 400 |
| background | #fff, 0.5px ring, 0 8 16 −4 shadow | none | black 5% |
| check | — | — | 16 at the end, 8 in |

Area md (captures): field 88 × 32 at "9:30 AM", segments 20 tall, 2 padding either side; sm 28, lg 40.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| shell, sizes, variants, focus, invalid, disabled | Input's; the field hugs its segments | peer Input; Spectrum 2 24 / 32 / 40 | — |
| entry | segments, each `role=spinbutton` with now / min / max / text, named Hour, Minute, Second, AM/PM | React Aria, Spectrum 2, MUI X, Mantine | ChatGPT has no typed entry; a list alone can't hold 9:07 |
| keys | Up / Down ±1 and wrap; Page Up / Down 2 hours or 15 minutes; Home / End; digits auto-advance once no digit could follow; Backspace clears, then moves back; Left / Right between segments; A / P for the period | React Aria and MUI agree | Mantine clamps instead of wrapping; not adopted |
| empty | "––" for numbers, the real "AM" for the period, in the placeholder ink | React Aria | — |
| focused segment | Editable text's editing surface (`selection-surface`) with the field's own ink, 2 corner (`radius-min`), 2 sides hanging over its neighbours (negative 2 margins; the separators drawn above), so the time spaces as text and the digits start at Input's inset (9 / 11 / 15) | Owner (round 24); peer Editable text; Spectrum 2's 2 / 2 geometry | Spectrum 2, Mantine and Untitled UI fill it with the accent and white; the owner found that block foreign to a field's text |
| hour cycle | the locale's by default | React Aria, Fluent | — |
| value | "HH:MM" or "HH:MM:SS", 24-hour, null while a segment is empty; a hidden input submits it under `name` | Date picker's "YYYY-MM-DD" | — |
| list | with `step`: a trailing chevron (InputAction's box, out of the Tab order) or Alt+Down on a segment opens a Menu of times `step` apart as check rows; the chosen time is focused and centred | ChatGPT (15 minutes, check, opened centred); Fluent 30; peer Combobox (chevron `tabindex=-1`, Alt+Down) | ChatGPT's 30 rows at radius 12 in a radius 16 surface are its own menu style; Area uses Menu's rows |
| list format | "9:00 AM" (12-hour) or "09:00" | ChatGPT | — |
| list height | 12 rows before it scrolls | Fluent ("12 items") | ChatGPT shows about 10 in 288 |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| a segment focused | `selection-surface` behind it, the field's ink; Input's focus edge on the shell | owner, round 24; Editable text |
| empty segment | "––" in the placeholder ink | React Aria |
| invalid | Input's invalid edge; `aria-invalid` on the segments | peer Input |
| success / warning | Input's success and warning edges on the shell, from `validationStatus` or a Field's status (2026-11-07) | peer Input |
| disabled | segments out of the Tab order, disabled ink, no list | React Aria |
| read-only | segments focusable, not editable; no list | React Aria |
| list open | Menu; the chosen row checked | ChatGPT |

## Behavior and accessibility

- The field is a `group` named by `aria-label` or a Field label; with `aria-labelledby`, each segment reads
  "<label> Hour" (React Aria does this because VoiceOver on iOS doesn't announce groups). Each segment is its own Tab
  stop, as in React Aria.
- A Field's `aria-invalid` and validation status paint it.
- Not verified: typing on touch keyboards (segments are not contenteditable, so a phone keyboard won't open; React Aria
  switches segments to `textbox` with contenteditable on iOS), right-to-left order, screen-reader announcements.

## Visual pass

In the app at 1× and 2×, light and dark, Default and Compact. Typed with real keys: "9", "45", "P" → 9:45 PM, focus
moving on by itself; Up, Up, Page Down on the minute → 32; Backspace clears the hour; "12" fills it and moves on. The
list opens with 9:00 AM focused and checked; Down then Enter picks 9:15. Changed during the pass: the hour no longer
reserves two digits, which pushed "9" away from its colon; the list now centres under the canvas's CSS zoom.

## Review note, 2026-10-13 (round 26)

- **What changed:** the time sits closer to the field's edges and reads as ordinary text ("9:30 AM", not "9 : 30
  AM"). The highlight on the part you are typing into now hangs over its neighbours instead of pushing them apart.
- **Why:** you said the side margins looked slightly too large; the digits were 2px deeper than an Input's text at
  each end. They now start exactly where an Input's text starts, at every size.

## Open questions


1. Segments aren't typeable on a phone keyboard yet. Recommendation: fine for the desktop app; add React Aria's
   contenteditable mode when Area ships to touch.
2. A DateField (the same segments for dates) would share this code. Recommendation: extract the segment engine when
   DateField is built.

## Feedback log

- 2026-10-13 · owner, review round 24 (needs changes): "can you make the editing state be more custom to the component,
  for the highlighted text, should it just be black?" → the focused segment takes `selection-surface` (Editable text's
  editing surface) with the field's ink, not the Selection plate with inverse ink → time-field.css. Own pass for
  consistency: the chevron leaves the Tab order and Alt+Down opens the list, as Combobox's → TimeField.tsx. Headless
  Edge: light and dark shots of the focused segment; Alt+Down focuses the checked 9:00 AM.
- 2026-10-13 · owner, review round 25 (rethink): "margins on the horizontal sides seem slightly too large?" → measured in
  headless Edge: the digits started 13 / 13 from the edges at md (Input's text 11), the segments' 2px padding added to
  Input's inset, and 4 around the colon → each segment's plate hangs 2 over its neighbours (`margin-inline: -2`), the
  separators drawn above; digits now at 9 / 11 / 15 at sm / md / lg, both ends, as Input; md "9:30 AM" 88 → 76 wide →
  time-field.css.
- 2026-10-13 · owner, review round 26 (rethink): "is it better to have the 9 : 30 or 9:30?" → answered with the
  evidence, no change yet: ChatGPT's time list ("9:00 AM"), the native time input, macOS and MUI X set the colon tight;
  Spectrum 2 and React Aria pad each segment 2, which reads as a slight space; Area's own list rows in this field read
  "9:00 AM". Recommendation: keep "9:30" so the typed time and its list rows match.
- 2026-10-13 · owner, in chat: "okay agree" → "9:30" kept; approved → Complete.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.

### 2026-11-07 · Success and warning; the list's open state; the event (components audit O1, O3)

- **What changed:** `validationStatus` and a Field's status paint the shell as Input's; `open` / `defaultOpen` / `onOpenChange` control the list of times; `onValueChange(value, event)` passes the key or click.
- **Why:** Time field mapped a Field's `error` and dropped success and warning (TimeField.tsx:82); its list had no open-state API, while every overlay has the trio (Governance § 4). From the components audit's internal peer comparison (`docs/research/components-audit-2026-11-07/internal.md`); the owner took every recommendation ("Take all recs", 2026-11-07).
- **Verdict:** awaiting the owner.
