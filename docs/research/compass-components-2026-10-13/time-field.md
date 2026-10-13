# TimeField — design-system source evidence

Researched 2026-10-12. Every claim cites `path:line-line` at a pinned commit. Raw files were read at the SHA (raw.githubusercontent.com/<repo>/<sha>/<path>); SHAs were taken from the GitHub API for the default branch on that day.

| Repo | Branch | Short SHA |
|---|---|---|
| adobe/react-spectrum | main | `9b7a06e` |
| mui/mui-x | master | `4ddc1c0` |
| mantinedev/mantine | master | `e243f7f` |
| ant-design/ant-design | master | `5a102fe` |
| react-component/picker (rc-picker) | master | `97fbf8a` |
| microsoft/fluentui | master | `16fcf57` |
| carbon-design-system/carbon | main | `c9b1f79` |
| untitleduico/react | main | `1d410cb` |
| primer/react | main | `7f5303d` |
| Shopify/polaris-react-archive (Shopify/polaris redirects here) | main | `3f7954a` |
| shadcn-ui/ui | main | `30a58d4` |
| mdn/content | main | `1937034` |

Note: React Aria's sources have moved. The hooks are now in `packages/react-aria/src/datepicker/*` and state is in `packages/react-stately/src/datepicker/*`. The old `@react-aria/datepicker` and `@react-stately/datepicker` folders no longer hold the code.

---

## 1. React Aria — TimeField / DateField segments (`9b7a06e`)

**Entry model:** segments only, with no popover. TimeField is a DateField with `maxGranularity: 'hour'`.
- `useTimeFieldState` wraps `useDateFieldState` with `granularity: granularity || 'minute'` and `maxGranularity: 'hour'`, and uses a Gregorian calendar ("Calendar should not matter for time fields"). See `packages/react-stately/src/datepicker/useTimeFieldState.ts:87-100`. The default `placeholderValue` is `new Time()`, which is 00:00 (`:46`).
- Props (`packages/react-stately/src/datepicker/types.ts:132-166`): `hourCycle?: 12 | 24` (the locale decides by default), `granularity?: 'hour' | 'minute' | 'second'` (default `'minute'`), `hideTimeZone`, `shouldForceLeadingZeros`, `placeholderValue` (it "Defaults to 12:00 AM or 00:00 depending on the hour cycle"), `minValue`, `maxValue`. **There is no minute-step prop** (`grep -i step` over types.ts finds none).

**Hour cycle from the locale:** `new DateFormatter(locale, {dateStyle:'short', timeStyle:'short', hour12: props.hourCycle != null ? props.hourCycle === 12 : undefined})`, then `resolvedOptions().hourCycle`. See `useDateFieldState.ts:218-228`. The segment order is `[…, 'hour', 'dayPeriod' (only when h11/h12), 'minute', 'second']`, sliced from maxGranularity to granularity. When granularity is `hour` on a 12-hour clock, the slice runs through dayPeriod (`:271-288`).

**Segment formatting:** the defaults are `hour: 'numeric'`, `minute: '2-digit'` and `second: '2-digit'`. With `shouldForceLeadingZeros`, the hour also becomes `'2-digit'` (`packages/react-stately/src/datepicker/utils.ts:166-190`).

**Placeholders:** time segments show `'––'`, two en-dashes ("For time fields … use two dashes"). dayPeriod shows its real value, for example "AM" (`packages/react-stately/src/datepicker/placeholders.ts:102-113`). A placeholder segment gets `data-placeholder` (`useDateSegment.ts:404`).

**Literal separators:** `formatToParts` literals become `type: 'literal'` segments that are not editable. useDateSegment returns only `aria-hidden: true` for them (`useDateSegment.ts:373-381`). The hour…granularity run is wrapped in U+2066/U+2069 (LRI/PDI) literal segments so RTL locales don't render minute:hour (`useDateFieldState.ts:519-555`).

**ARIA:**
- Each editable segment is `role="spinbutton"` with `aria-valuenow`, `aria-valuetext`, `aria-valuemin` and `aria-valuemax` (`packages/react-aria/src/spinbutton/useSpinButton.ts:241-250`).
- For an hour that has a value, `aria-valuetext` is the localized hour with day period ("hourDateFormatter"), so a screen reader hears "3 PM", not "3" (`useDateSegment.ts:58-69`).
- On iOS, and for timeZoneName, the role becomes `textbox` and the value attributes are nulled ("spinbuttons cannot be focused with VoiceOver on iOS") (`:343-353`).
- Each segment's `aria-label` is the localized segment name (Intl.DisplayNames), followed by the field's `aria-label` and `aria-labelledby`, because "VoiceOver on iOS does not announce groups" (`:365-371`).
- `aria-describedby` goes on the first editable segment only, unless the field is invalid (`:355-360`).
- The segment is `contentEditable`, has `inputMode="numeric"` (none for dayPeriod/era), `enterKeyHint="next"`, `tabIndex=0`, and `caretColor: transparent` (`:383, 397-419`).
- The field container is `role="group"` with `aria-disabled` and `aria-describedby`. Inside a DatePicker it becomes `role="presentation"` to avoid duplicate announcements (`packages/react-aria/src/datepicker/useDateField.ts:153-168`).
- A hidden `<input>` carries `name` and the value, which is `Time.toString()` for TimeField. It is `type="text" hidden required` when `validationBehavior="native"` (`useDateField.ts:189-205, 244-252`).

**Keyboard:**
- ArrowUp/Down call increment/decrement. PageUp/Down call incrementPage/decrementPage. Home/End go to min/max. All allow repeats (`useSpinButton.ts:75-130`).
- Both increment and decrement **wrap** "around to the opposite limit" (`useDateFieldState.ts:103-124`).
- The page step is `hour: 2, minute: 15, second: 15` (`:153-160`).
- For Home/End in h12, the hour minimum is 12 and the maximum is 11 (`:409-418`). dayPeriod cycles 0..1 (`IncompleteDate.ts:217-218`).
- ArrowLeft/Right move to the previous/next segment through a focus manager, using geometric search in RTL. Alt+ArrowDown/Up opens the popover when the field is inside a picker (`packages/react-aria/src/datepicker/useDatePickerGroup.ts:22-80`).
- When you click the field (not a segment), focus goes to the last non-placeholder segment before the click point (`:82-134`).

**Typing:**
- Digits accumulate in `enteredKeys`. If the accumulated number exceeds the max, only the new key is used.
- The segment **auto-advances** when `Number(value + '0') > max` or the entered length reaches the max's digit count (`useDateSegment.ts:216-249`). For example, typing "3" in hour (max 12) advances at once; typing "1" waits.
- dayPeriod takes the first letter of the localized AM/PM (`startsWith`) and then advances (`:198-207`).

**Backspace/Delete:** deletes the last digit, or clears the segment to its placeholder. On a segment already showing the placeholder, focus moves to the previous segment (`useDateSegment.ts:110-143`).

**RAC component API:**
- `TimeField` renders a `div.react-aria-TimeField` with `data-invalid`, `data-disabled`, `data-readonly` and `data-required` (`packages/react-aria-components/src/DateField.tsx:232-308`).
- `DateInput` is a `Group` that maps `state.segments` to children, plus a hidden `Input` (`:407-425`).
- `DateSegment` exposes `data-placeholder`, `data-invalid`, `data-readonly`, `data-disabled`, `data-type`, `data-hovered`, `data-focused` and `data-focus-visible` (`:540-547`).

**Reference styling (RAC starters):**
- Hooks starter CSS: the segment has `padding: 2px`, `font-variant-numeric: tabular-nums`, `text-align: end`. Literals have `padding: 0`. A placeholder uses the placeholder colour. `:focus` paints `--highlight-background` with `--highlight-foreground`, `border-radius: 4px`, no outline. An invalid segment's focus uses `--highlight-background-invalid`. The DateInput has `min-width: 150px` (`starters/hooks/src/DateField.css:9-72`).
- Tailwind starter: the segment uses `p-0.5 rounded-xs`, literal `p-0`. Placeholder `text-neutral-600`. Focused `bg-blue-600 text-white`, forced-colors `Highlight/HighlightText` (`starters/tailwind/src/DateField.tsx:40-53`). The input uses `min-w-[150px] px-3 h-9 text-sm` (`:62`).

## 2. Spectrum 2 — TimeField (`9b7a06e`)

- `size?: 'S' | 'M' | 'L' | 'XL'`, default `'M'` (`packages/@react-spectrum/s2/src/TimeField.tsx:47-52`).
- It renders `FieldLabel`, then `FieldGroup role="presentation"` with `paddingX: 'edge-to-text'`, which contains `DateInputContainer > DateInput`, then `InvalidIndicator` and `HelpText` (`:100-135`). There is no popover and no clock icon.
- **Segment style** (shared from DateField; `packages/@react-spectrum/s2/src/DateField.tsx:75-99`):
  - `outlineStyle: none`, `caretColor: transparent`.
  - Background is transparent; when **focused** it is `blue-800` with text `white`. Forced colors use `Highlight` / `HighlightText`.
  - `borderRadius: 2px`.
  - `paddingX: 2` (punctuation `0`) and `paddingY: 2`. In S2 the padding scale is px: `padding[p] = p + 'px'` (`s2/style/spectrum-theme.ts:354-364`). So segments are 2px × 2px, and literals have no horizontal padding.
- The segment container is a flex row with `overflowX: auto`, `scrollbarWidth: none` and `textWrap: nowrap` (`DateField.tsx:62-73`).
- `edge-to-text` padding is `calc(height * 3/8)` (`spectrum-theme.ts:436`).
- Field heights (`controlSize`): S 24, M 32, L 40, XL 48 (`s2/src/style-utils.ts:223-231`). Default widths: S 192, M 208, L 224, XL 240 (`:118-127`).
- Radius is the medium token ("8px") scaled by 1.125^n per size (`style-utils.ts:244-263`; `spectrum-theme.ts:525-528`). FieldGroup has a 2px border, gray-300, and gray-900 on focus-within (`s2/src/Field.tsx:201-224`).
- **In DatePicker:** when the DatePicker's granularity is hour, minute or second, the calendar popover renders a `TimeField` labelled "Time" under the Calendar, with a flex wrapper gap of 16 (`s2/src/DatePicker.tsx:204-209, 260-276`). The time is entered as segments, not picked from a list.

## 3. MUI X — TimeField / TimePicker (`4ddc1c0`)

**Field (sections):**
- Each section is a contentEditable span with `role: 'spinbutton'`, `aria-valuenow`, `aria-valuemin` and `aria-valuemax`. `aria-valuetext` is the value, or the "Empty" translation. `aria-label` is the section-type translation ("Hours", "Minutes", "Seconds", "Meridiem"). `inputMode` is `numeric`, or `text` for letter sections (`packages/x-date-pickers/src/internals/hooks/useField/useFieldSectionContentProps.ts:176-198`). Roving tabindex: only section 0 has `tabIndex 0` (`:188`).
- English placeholders are `hh`, `mm`, `ss`, `aa`; the labels and "Empty" are at `src/locales/enUS.ts:75-91`.
- The focused section is painted by **native text selection**. `syncSelectionToDOM` runs `range.selectNodeContents(target)` followed by `addRange` (`useField/syncSelectionToDOM.ts:65-68`), so the paint is the browser's `::selection` colour. A section has `lineHeight: 1.4375em` (23px) and `outline: none` (`PickersTextField/PickersInputBase/PickersInputBase.tsx:131-167`). The separator uses `whiteSpace: pre` (`:169-175`).
- **Keyboard:**
  - ArrowUp/Down are ±1 and PageUp/Down are ±5 (`useField/useFieldRootProps.ts:443-456`).
  - On an empty section, Up goes to the minimum and Down to the maximum (`:489-498`).
  - `minutesStep` is applied to the minutes section only, with snapping to the step (`:484-514`).
  - Values **wrap** past min/max (`:516-530`). Letter sections such as AM/PM cycle (`:535-554`).
  - ArrowLeft/Right move between sections, and Delete clears (`:87-137`).
- **Typing auto-advance:** the field moves on when `query * 10 > max` or the query length equals the max's digit count (`useField/useFieldCharacterEditing.ts:239-241`). Letter sections advance when exactly one option matches (`:102-111`).
- `ampm` defaults to `adapter.is12HourCycleInCurrentLocale()` (`TimeField/TimeField.tsx:60-64`). `minutesStep` is a field prop (`:195`).

**Picker popover (desktop):**
- `timeSteps` defaults to `{hours: 1, minutes: 5, seconds: 5}`. The **single-column DigitalClock** is used only when `(24*60)/(hours*minutes) <= thresholdToRenderTimeInASingleColumn` (default 24). Otherwise the multi-section clock is used (`internals/utils/date-time-utils.ts:69-107`; doc in `DesktopTimePicker/DesktopTimePicker.tsx:366-380`). **So with defaults the desktop picker shows the multi-column list** (288 > 24 options).
- **MultiSectionDigitalClock** (columns for hours, minutes, [seconds] and meridiem):
  - Each column is a `MenuList` with `role="listbox"`, `maxHeight: 232` (DIGITAL_CLOCK_VIEW_HEIGHT) and `width: 56`. The scrollbar appears on hover with a fine pointer. Columns after the first get a 1px `divider` left border. Scrolling is smooth after first render (`MultiSectionDigitalClock/MultiSectionDigitalClockSection.tsx:61-94`; constants in `internals/constants/dimensions.ts:6-7`).
  - Items are `role="option"` with `aria-selected` and roving tabIndex (`:299-325`). Item style: `padding: 8`, `margin: '2px 4px'`, `width: 48`, centred, first item `marginTop: 4`. Hover is primary at hoverOpacity. Selected is `primary.main` with contrastText, and `primary.dark` on hover/focus-visible (`:96-126`).
  - The selected item is scrolled to the **centre** of the column (`:209-225`). PageUp/PageDown move ±5 items (`:258-292`).
  - The root is a flex row with a 1px bottom divider (`MultiSectionDigitalClock/MultiSectionDigitalClock.tsx:40-47`).
- **DigitalClock** (single column): `listbox`/`option` (`DigitalClock/DigitalClock.tsx:350-372`). Item style: `padding: '8px 16px'`, `margin: '2px 4px'`, first `marginTop 4`, with the same hover and selected paints (`:69-98`). maxHeight is 232 (`:49`).

## 4. Mantine — TimeInput and TimePicker (`e243f7f`)

**TimeInput** is a native `<input type="time">` inside InputBase. `step` is `step ?? (withSeconds ? 1 : 60)` (`packages/@mantine/dates/src/components/TimeInput/TimeInput.tsx:122-134`). `minTime`/`maxTime` are clamped on blur (`:63-116`). Its CSS hides `::-webkit-calendar-picker-indicator` and `::-webkit-clear-button`, and paints the WebKit/Blink internal segments `::-webkit-datetime-edit-{hour,minute,second,ampm}-field:focus` with `--mantine-primary-color-filled` and white text (`TimeInput/TimeInput.module.css:1-27`). This is direct evidence that the native control is itself segmented.

**TimePicker** has its own segmented fields and an optional dropdown of columns.
- Defaults: `format: '24h'`, `hoursStep/minutesStep/secondsStep: 1`, `amPmLabels {am:'AM', pm:'PM'}`, `maxDropdownContentHeight: 200`, `hoursPlaceholder/minutesPlaceholder: '--'` (`TimePicker/TimePicker.tsx:218-228`). `withDropdown` defaults to false and opens the dropdown on focus (`:131-132`). There are per-input `aria-label` props: `hoursInputLabel`, `minutesInputLabel`, `secondsInputLabel` and `amPmInputLabel` (`:116-126`). Presets are supported (`:183, 598-606`).
- Fields are `SpinInput`: hours (min 1 / max 12 in 12h, else 0..23), a literal `<span>:</span>`, minutes 0..59, optional seconds, then AmPmInput (`TimePicker.tsx:457-573`). Each field focuses the next or previous field.
- **SpinInput** is an `<input type="text" role="spinbutton">` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` (0 when empty), `inputMode="numeric"`, and select-all on focus and click (`SpinInput/SpinInput.tsx:146-170`).
  - ArrowUp/Down **clamp and do not wrap**: `clamp(value ± step, min, max+1-step)`. From empty, Up gives min (`:41-43, 132-143`).
  - Home/End go to min/max. Backspace clears, and on an empty field moves to the previous field. ArrowLeft/Right move between fields (`:102-130`).
  - Auto-advance happens when the typed value is greater than the first digit of max, or starts with "00" (`:72-82`).
- AmPmInput renders an `<input>` when `withDropdown` is set and a native `<select>` otherwise (`TimePicker/AmPmInput/AmPmInput.tsx:72-111`).
- **Field paint** (`TimePicker/TimePicker.module.css:119-161`):
  - `.field` is `width: calc(2ch + 0.3em)`, `padding-inline: 0.15em`, `border-radius: 2px`, `tabular-nums`, `caret-color: transparent`, centred.
  - `::selection` is transparent. **`:focus` paints `--mantine-primary-color-filled` with white text** (the placeholder turns white too).
  - The fields group is `height: calc(var(--input-height) - 15px)` (`:12-16`).
- **Dropdown** (`TimePicker.module.css:18-58`; `TimeControlsList/TimeControlsList.tsx:27-80`):
  - `padding: 4px`. Columns sit side by side (`controlsListGroup` gap 4px), and each column is a vertical `ScrollArea` of height `maxDropdownContentHeight` (200).
  - The values come from min..max by `step`. On open the active value is scrolled into view with `block: 'nearest'`.
  - Each control is an UnstyledButton with `tabIndex=-1`, so the columns are mouse-only (`TimeControlsList/TimeControl.tsx:11-26`). It is `min-width: 2.5em`, `height: 2em`, `border-radius: var(--mantine-radius-default)`, font-size sm. Active is primary filled with white text; hover is gray-1 (light) or dark-5 (dark).
- **TimeGrid** (a separate component, a grid of time buttons): `SimpleGrid` with default `{cols: 3, spacing: 'xs'}`. Each control has `padding 0.25em 1em`, a 1px default border, radius default, and an active fill of primary (`TimeGrid/TimeGrid.tsx:61-94`; `TimeGrid/TimeGrid.module.css:1-33`).

## 5. Ant Design — TimePicker on rc-picker (`5a102fe`, rc-picker `97fbf8a`)

**Entry:** a text input plus a popup panel of scrolling columns. The props table lists `format` (default `HH:mm:ss`), `hourStep`, `minuteStep` and `secondStep` (default 1), `use12Hours` (default false, format `h:mm:ss a`), `showNow`, `needConfirm`, and `changeOnScroll` (default false) (`components/time-picker/index.en-US.md:57-83`).

**Input:** by default it is free text parsed with `format`. An optional **mask mode** (`format: {format, type: 'mask'}`; "only support basic format mask: YYYY, MM, DD, HH, mm, ss, SSS") turns the text input into cell editing (`rc-picker src/interface.tsx:360-372`):
- ArrowLeft/Right move between cells, ArrowUp/Down ±1 with **wrap** (`rangeStart + ((range + num - rangeStart) % range)`), and Backspace refills the cell with the format token.
- After typing, the input auto-advances when the cell length reaches the mask length (`src/PickerInput/Selector/Input.tsx:248-323`).
- It is a single `<input>` with `setSelectionRange`, not spinbuttons (`:352-362`).

**Panel columns:**
- Each column is a `<ul role="listbox" aria-label=…>` of `<li role="option">` (`src/PickerPanel/TimePanel/TimePanelBody/TimeColumn.tsx:197-220`). ArrowDown/Up move within a column and wrap; Enter/Space select (`:170-191`).
- On a value change, the column animates its scroll so the selected cell sits at the **top** (`TimePanelBody/useScrollTo.ts:30-70`).
- With `changeOnScroll`, the cell nearest the top is selected while scrolling (`TimeColumn.tsx:116-131`).
- Units are generated by step (`src/hooks/useTimeInfo.ts:18-28, 54-58`), and `24 % hourStep` is validated (`:72`).

**Panel metrics** (`components/date-picker/style/token.ts:181-183`; `style/panel.ts:513-605`):
- `timeColumnWidth = controlHeightLG * 1.4`. Seeds: `controlHeight: 32` (`components/theme/themes/seed.ts:69`) and `controlHeightLG = controlHeight * 1.25` (`themes/shared/genControlHeight.ts:9`). So the column is 56px wide.
- `timeCellHeight: 28`, and `timeColumnHeight: 28 * 8` = 224.
- Each column has `margin: paddingXXS 0` and `overflowY: auto` with an 8px webkit scrollbar (thumb `colorTextTertiary`). A `::after` spacer of `100% - cellHeight` lets the last item scroll to the top. Columns after the first get a 1px `colorSplit` inline-start border. The active column is `controlItemBgActive` at alpha 0.2.
- Each cell inner is `width: columnWidth - 2*marginXXS`, `height: 28`, `lineHeight: 28`, `paddingInlineStart: (columnWidth - cellHeight)/2`, `borderRadius: borderRadiusSM`. Hover is `cellHoverBg`, selected is `controlItemBgActive` (a tinted background, not a solid fill), and disabled uses `colorTextDisabled`.

## 6. Fluent 2 — TimePicker (react-timepicker-compat) (`16fcf57`)

Base path: `packages/react-components/react-timepicker-compat/library/src/components/TimePicker/`.

**Entry:** a **Combobox**: a text input plus a listbox of time options. Typing is free-form when `freeform` is set. There are no segments.
- Defaults: `increment = 30` (minutes), `startHour = 0`, `endHour = 24` (exclusive), `showSeconds = false`, `hourCycle` undefined, so the locale decides (`useTimePicker.tsx:40-47`).
- Props: `hourCycle?: 'h11' | 'h12' | 'h23' | 'h24'` and `showSeconds` (`TimePicker.types.ts:80-93`). `startHour`, `endHour`, `increment` ("Time increment, in minutes, of the options in the dropdown") and `dateAnchor` are at `:116-134`.
- Options come from `getTimesBetween(start, end, increment)`, formatted with `toLocaleTimeString(undefined, {hour:'numeric', hourCycle, minute:'2-digit', second: showSeconds ? '2-digit' : undefined})` and rendered as Combobox `Option`s (`useTimePicker.tsx:59-116`; `timeMath.ts:47-52`).
- Freeform parsing is done by `getDateFromTimeString` with a 12h/24h regex (`timeMath.ts:140-175`).
- **Listbox:** `maxHeight: 'min(80vh, 416px)'`, commented "height for 12 items" (`useTimePickerStyles.styles.ts:16-20`). The Combobox listbox has `minWidth: 160px`, `padding: spacingHorizontalXS` (4px) and `rowGap: spacingHorizontalXXS` (2px) (`packages/react-components/react-combobox/library/src/components/Listbox/useListboxStyles.styles.ts:21-25`).
- **Option:** `padding: spacingVerticalSNudge spacingHorizontalS` (6px 8px), `fontSize 300` / `lineHeight 300` (14/20), and `borderRadius: borderRadiusMedium` (4px) (`react-combobox/.../Option/useOptionStyles.styles.ts:18-28`). Token values come from `packages/tokens/src/global/spacings.ts:6-9`, `fonts.ts:6,20` and `borderRadius.ts:6`. So a row is 32px (6+20+6). Hover is `colorNeutralBackground1Hover`.

## 7. Carbon — TimePicker (`c9b1f79`)

- The control is a plain **text `<input>`** with defaults `type = 'text'`, `maxLength = 5`, `pattern = '(1[012]|[1-9]):[0-5][0-9](\\s)?'` (12-hour h:mm only), `placeholder = 'hh:mm'` and `size = 'md'` (`packages/react/src/components/TimePicker/TimePicker.tsx:160-168, 295-312`). It has no segments and no popover.
- AM/PM and the time zone are **separate `TimePickerSelect` children**, each a native `<select>` with a ChevronDown icon. The default aria-label is "open list of options" (`packages/react/src/components/TimePickerSelect/TimePickerSelect.tsx:47-73`). The story uses `AM`/`PM` and "Time zone 1/2" items (`TimePicker/TimePicker.stories.js:38-43`).
- Styles (`packages/styles/scss/components/time-picker/_time-picker.scss`):
  - The input uses `code-02` type (monospace), `block-size: 40px` and `inline-size: 4.875rem` (`:62-77`).
  - Sizes: sm 32px, lg 48px (`:100-110`).
  - The select gets `padding-inline-end: 48px` and `margin-inline-start: $spacing-01` (`:28-31, 54-60`).

## 8. Untitled UI React (`1d410cb`)

- **No time field or time picker** was found. The repo tree has `components/application/date-picker/*` and `components/base/input/input-date.tsx`, and nothing named time apart from `utils/timezones.tsx`.
- `input-date.tsx` is a React Aria `DateInput`/`DateSegment` field, so it uses the same segment engine. The segment classes are `rounded px-0.5 tabular-nums caret-transparent focus:bg-brand-solid focus:font-medium focus:text-white focus:outline-hidden`. Placeholder segments are `text-placeholder uppercase`, and literals are `text-fg-quaternary` (`components/base/input/input-date.tsx:133-146`). Sizes: sm `px-3 py-2 text-sm`, md `px-3 py-2 text-md`, lg `px-3.5 py-2.5 text-md` (`:79-96`).

## 9. Primer (`7f5303d`), Polaris (`3f7954a`), shadcn (`30a58d4`)

- **Primer React:** not found. I searched the full tree for `time(field|picker|input)|datepicker|date-picker` and got no matches.
- **Polaris:** `Shopify/polaris` now redirects to `Shopify/polaris-react-archive`. That tree has `polaris-react/src/components/DatePicker` only; no time component was found.
- **shadcn/ui:** has no TimeField component. Its "date-picker-time" and "calendar-time" examples use a **native `<Input type="time" step="1">`**, with the picker indicator hidden through `appearance-none [&::-webkit-calendar-picker-indicator]:hidden`, at width `w-32` (`apps/v4/examples/radix/date-picker-time.tsx:50-58`; the same pattern is in `apps/v4/examples/aria/date-picker-time.tsx:50-54` and `apps/v4/examples/radix/calendar-time.tsx:37-55`).

## 10. Native `<input type="time">` (MDN `1937034`, `files/en-us/web/html/reference/elements/input/time/index.md`)

- The UI "is based on the browser and operating system". The value is always 24-hour `HH:mm` or `HH:mm:ss` "regardless of the UI's input format" (`:10-12`). The display format is "likely to be selected based on the user's locale (or by the user agent)" (`:174`). **A page cannot choose 12h or 24h display.**
- `step` is in seconds and defaults to 60. A step not divisible by 60 adds a seconds segment. Minute steps are written as seconds, for example 120 (`:70-79, 206-221`).
- `min`/`max` can cross midnight (periodic domain) (`:49, 277-285`). Validation is otherwise minimal, and the value can be `""` (`:83`).
- **Segmented in Blink/WebKit:** Mantine has to style `::-webkit-datetime-edit-{hour,minute,second,ampm}-field` and hide `::-webkit-calendar-picker-indicator` (see §4). shadcn also hides the indicator (see §9). Those engine-specific pseudo-elements are the only way to style the segments. **Why systems avoid it**, as far as these sources show: the OS and engine decide the look, the locale controls 12h/24h, and focus paint and styling depend on prefixed pseudo-elements. Only Mantine's simple `TimeInput` and shadcn's examples use it; every full design-system time field builds its own segments or list.

---

## Summary table

| System | Entry model | Popover / list | Step options | 12/24h | Keyboard (segment) | ARIA | Segment metrics / focused paint | List row |
|---|---|---|---|---|---|---|---|---|
| React Aria | Segments (contentEditable) | None (TimeField). DatePicker adds a TimeField under the Calendar (S2) | None. Page steps fixed: hour 2, min 15, sec 15 | Locale default; `hourCycle: 12\|24` | ↑↓ ±1 **wrap**, PgUp/Dn page, Home/End, ←→ move, digits auto-advance, Backspace to previous | group > spinbutton; valuetext for hour includes AM/PM; per-segment aria-label | Starter: 2px pad, 4px radius, highlight bg + fg | — |
| Spectrum 2 | Segments | None | — | prop | as RA | as RA | **2px × 2px pad, 2px radius, blue-800 bg / white text**; field S24/M32/L40/XL48 | — |
| MUI X | Sections (contentEditable, native selection) | Multi-column listbox by default; single column if ≤24 options | `minutesStep`, `timeSteps` {1,5,5} | `ampm` from adapter locale | ↑↓ ±1 wrap (minutes by step), PgUp/Dn ±5, empty↑=min, ↓=max | spinbutton per section; listbox/option columns | `::selection` paint, 23px line height | col 56w × 232h; item 48w, pad 8, margin 2/4; DigitalClock pad 8/16 |
| Mantine TimePicker | Separate `<input role=spinbutton>` per unit | Optional dropdown: columns, h 200 | hours/minutes/secondsStep (1) | `format: '24h'\|'12h'` (24h default) | ↑↓ **clamp**, Home/End, Backspace, ←→ | spinbutton + per-input aria-label props | `calc(2ch+0.3em)` wide, pad-inline 0.15em, **2px radius, primary-filled + white** | control h 2em, min-w 2.5em, dropdown pad 4, gap 4 |
| Mantine TimeInput | Native `type=time` | Native | `step` (60/1) | browser | native | native | styles `::-webkit-datetime-edit-*-field:focus` | — |
| Ant Design | Text input (optional mask cells) | Columns panel (Now/OK) | hour/minute/secondStep | `use12Hours` (default 24h `HH:mm:ss`) | mask: ↑↓ wrap, ←→ cells | single input; listbox/option columns | — | **col 56w, cell 28h, panel 224h**, selected scrolls to top |
| Fluent 2 | Combobox text (freeform optional) | Single listbox of times | `increment` (30 min) | `hourCycle` h11/h12/h23/h24, else locale | Combobox | combobox/listbox/option | — | option 6/8 pad, 14/20 type, 4px radius (32px row); listbox max 416 ("12 items") |
| Carbon | Plain text input `hh:mm` + `<select>` AM/PM + `<select>` TZ | Native selects | — | 12h pattern + AM/PM select | none special | text input + selects | code-02 mono, 40px (sm 32, lg 48), 4.875rem wide | — |
| Untitled UI | (date only) RA segments | — | — | — | RA | RA | `rounded px-0.5`, brand-solid + white, medium weight | — |
| Primer / Polaris | not found | — | — | — | — | — | — | — |
| shadcn | Native `type=time step=1` | — | `step` | browser | native | native | indicator hidden | — |

## Consensus

- **Segments are the modern standard for typed entry.** React Aria/Spectrum 2, MUI X and Mantine TimePicker all render one focusable unit per hour, minute, second and AM/PM, with literal separators that are not editable (aria-hidden in React Aria). Carbon and antd's default mode are plain text; Fluent is a combobox.
- **ARIA:** each segment is `role="spinbutton"` with `aria-valuenow/min/max`, an `aria-valuetext`, and an `aria-label` naming the unit (Hours/Minutes/AM/PM). React Aria wraps the segments in `role="group"` and prepends the field label to every segment label for VoiceOver iOS. It also switches to `role="textbox"` on iOS.
- **Keyboard (React Aria and MUI agree):** ↑/↓ change by 1 and **wrap** at the limits. PgUp/PgDn take a larger step (React Aria: 2 hours, 15 min, 15 s; MUI: ±5). Home/End go to min/max. ←/→ move between segments. Digits **auto-advance** once no further digit can fit (`value*10 > max` or max digit count reached). Backspace clears the segment and then moves to the previous one. AM/PM accepts the first letter. Mantine is the outlier: it clamps instead of wrapping.
- **Empty state:** React Aria shows `––` (two en-dashes) for time segments and the real "AM" for dayPeriod. Mantine shows `--`, MUI shows `hh/mm/aa`, and Carbon shows `hh:mm`. Incrementing from empty starts from the placeholder value (React Aria: 00:00 / 12 AM) or from min (MUI, Mantine).
- **12/24h comes from the locale by default**, through `Intl.DateTimeFormat().resolvedOptions().hourCycle` (React Aria), the adapter (MUI) or `toLocaleTimeString` (Fluent), with a prop to override it. Mantine (24h default) and antd (24h default) are explicit-prop systems.
- **Focused-segment paint is a solid accent fill with inverse text, small radius and tiny padding:** S2 blue-800/white, 2px radius, 2px padding. Mantine primary-filled/white, 2px radius. Untitled UI brand-solid/white with a medium weight. RAC starter highlight bg, 4px radius, 2px padding. Literals get 0 padding. Use `caret-color: transparent` and `tabular-nums` everywhere.
- **Minute step lives on the list, not the typed field:** antd `minuteStep`, MUI `timeSteps.minutes` (default 5) plus `minutesStep`, Mantine `minutesStep`, Fluent `increment` (default 30). React Aria has no step at all.
- **Popover list designs split into two families:**
  - (a) **Columns** (hours | minutes | [seconds] | AM/PM) with selected highlighting and scroll-to-selected: antd 56px columns × 28px cells × 224px tall, selected at the top. MUI 56px columns × 232px max, selected centred. Mantine 2em controls in a 200px ScrollArea.
  - (b) **A single list of times at a fixed increment**: Fluent 30-minute 32px rows, max 12 visible. MUI uses this only when there are ≤24 options.
  - Spectrum 2 has no time list at all: its DatePicker adds a segmented TimeField under the Calendar.
- **Native `<input type="time">` is avoided** by full design systems. Its UI and 12/24h are set by the browser, OS and locale, and styling needs engine-prefixed pseudo-elements. Only Mantine's lightweight `TimeInput` and shadcn's examples ship it.
