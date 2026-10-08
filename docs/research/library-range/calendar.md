# Calendar — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Choose dates using an inline calendar grid. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L28)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (component): `presentation`: `calendar`, `calendar-card`, `range-calendar`, `range-calendar-card`; `view`: `month`, `week`, `day` [Untitled UI 1](https://www.untitledui.com/react/components/date-pickers), [Untitled UI 2](https://www.untitledui.com/react/components/calendars)

  Month/week/day scheduling examples are adjacent to date selection, not proof of event dragging.

- **shadcn/ui** (component): `selection`: `single`, `range`, `multiple` [shadcn/ui 1](https://ui.shadcn.com/docs/components/calendar.md), [shadcn/ui 2](https://daypicker.dev/selections/selection-modes)

  Calendar delegates its API to React DayPicker. Date-time entry is composition, not a built-in time field.

- **React Aria / Spectrum 2** (component): `selection`: `single`, `multiple`, `range`; `weekdayStyle`: `long`, `narrow`, `short`; `pageBehavior`: `visible`, `single`; `firstDayOfWeek`: `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun`; `isDisabled`: `false`, `true`; `isReadOnly`: `false`, `true`; `isInvalid`: `false`, `true`; `allowsNonContiguousRanges`: `false`, `true` [React Aria / Spectrum 2 1](https://react-aria.adobe.com/Calendar.md), [React Aria / Spectrum 2 2](https://react-aria.adobe.com/RangeCalendar.md), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/Calendar.md), [React Aria / Spectrum 2 4](https://react-spectrum.adobe.com/RangeCalendar.md)

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- Calendar / `autoFocus`: `false`, `true`. [API](https://react-aria.adobe.com/Calendar.md)

- Calendar / `firstDayOfWeek`: `fri`, `mon`, `sat`, `sun`, `thu`, `tue`, `wed`. [API](https://react-aria.adobe.com/Calendar.md)

- Calendar / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/Calendar.md)

- Calendar / `isInvalid`: `false`, `true`. [API](https://react-aria.adobe.com/Calendar.md)

- Calendar / `isReadOnly`: `false`, `true`. [API](https://react-aria.adobe.com/Calendar.md)

- Calendar / `selectionAlignment`: `center`, `end`, `start`. [API](https://react-aria.adobe.com/Calendar.md)

- CalendarGrid / `weekdayStyle`: `long`, `narrow`, `short`. [API](https://react-aria.adobe.com/Calendar.md)

- CalendarHeading / `autoFocus`: `false`, `true`. [API](https://react-aria.adobe.com/Calendar.md)

- CalendarHeading / `suppressContentEditableWarning`: `false`, `true`. [API](https://react-aria.adobe.com/Calendar.md)

- CalendarHeading / `suppressHydrationWarning`: `false`, `true`. [API](https://react-aria.adobe.com/Calendar.md)

- CalendarHeading / `unselectable`: `off`, `on`. [API](https://react-aria.adobe.com/Calendar.md)

- CalendarMonthPicker / `format`: `2-digit`, `long`, `narrow`, `numeric`, `short`. [API](https://react-aria.adobe.com/Calendar.md)

- RangeCalendar / `allowsNonContiguousRanges`: `false`, `true`. [API](https://react-aria.adobe.com/RangeCalendar.md)

- RangeCalendar / `autoFocus`: `false`, `true`. [API](https://react-aria.adobe.com/RangeCalendar.md)

- RangeCalendar / `firstDayOfWeek`: `fri`, `mon`, `sat`, `sun`, `thu`, `tue`, `wed`. [API](https://react-aria.adobe.com/RangeCalendar.md)

- RangeCalendar / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/RangeCalendar.md)

- RangeCalendar / `isInvalid`: `false`, `true`. [API](https://react-aria.adobe.com/RangeCalendar.md)

- RangeCalendar / `isReadOnly`: `false`, `true`. [API](https://react-aria.adobe.com/RangeCalendar.md)

- RangeCalendar / `selectionAlignment`: `center`, `end`, `start`. [API](https://react-aria.adobe.com/RangeCalendar.md)

- CalendarGrid / `weekdayStyle`: `long`, `narrow`, `short`. [API](https://react-aria.adobe.com/RangeCalendar.md)

- CalendarHeading / `autoFocus`: `false`, `true`. [API](https://react-aria.adobe.com/RangeCalendar.md)

- CalendarHeading / `suppressContentEditableWarning`: `false`, `true`. [API](https://react-aria.adobe.com/RangeCalendar.md)

- CalendarHeading / `suppressHydrationWarning`: `false`, `true`. [API](https://react-aria.adobe.com/RangeCalendar.md)

- CalendarHeading / `unselectable`: `off`, `on`. [API](https://react-aria.adobe.com/RangeCalendar.md)

- CalendarMonthPicker / `format`: `2-digit`, `long`, `narrow`, `numeric`, `short`. [API](https://react-aria.adobe.com/RangeCalendar.md)

- API / `autoFocus`: `false`, `true`. [API](https://react-spectrum.adobe.com/Calendar.md)

- API / `firstDayOfWeek`: `fri`, `mon`, `sat`, `sun`, `thu`, `tue`, `wed`. [API](https://react-spectrum.adobe.com/Calendar.md)

- API / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/Calendar.md)

- API / `isInvalid`: `false`, `true`. [API](https://react-spectrum.adobe.com/Calendar.md)

- API / `isReadOnly`: `false`, `true`. [API](https://react-spectrum.adobe.com/Calendar.md)

- API / `selectionAlignment`: `center`, `end`, `start`. [API](https://react-spectrum.adobe.com/Calendar.md)

- API / `allowsNonContiguousRanges`: `false`, `true`. [API](https://react-spectrum.adobe.com/RangeCalendar.md)

- API / `autoFocus`: `false`, `true`. [API](https://react-spectrum.adobe.com/RangeCalendar.md)

- API / `firstDayOfWeek`: `fri`, `mon`, `sat`, `sun`, `thu`, `tue`, `wed`. [API](https://react-spectrum.adobe.com/RangeCalendar.md)

- API / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/RangeCalendar.md)

- API / `isInvalid`: `false`, `true`. [API](https://react-spectrum.adobe.com/RangeCalendar.md)

- API / `isReadOnly`: `false`, `true`. [API](https://react-spectrum.adobe.com/RangeCalendar.md)

- API / `selectionAlignment`: `center`, `end`, `start`. [API](https://react-spectrum.adobe.com/RangeCalendar.md)

</details>

- **Fluent 2** (component): `isMonthPickerVisible`: `false`, `true`; `isDayPickerVisible`: `false`, `true`; `showMonthPickerAsOverlay`: `false`, `true`; `showGoToToday`: `false`, `true`; `showWeekNumbers`: `false`, `true`; `showSixWeeksByDefault`: `false`, `true`; `allFocusable`: `false`, `true`; `allowTextInput`: `false`, `true`; `underlined`: `false`, `true`; `borderless`: `false`, `true`; `firstWeekOfYear`: `FirstDay`, `FirstFullWeek`, `FirstFourDayWeek` [Fluent 2 1](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

  Pinned Fluent v9 compatibility packages react-calendar-compat and react-datepicker-compat; not a claim that these are a newly redesigned Fluent 2 core Calendar. DateRangeType is referenced but its full enum was not found in the examined files.

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `isMonthPickerVisible`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts)

- `isDayPickerVisible`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts)

- `showMonthPickerAsOverlay`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts)

- `showGoToToday`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts)

- `showWeekNumbers`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts)

- `showSixWeeksByDefault`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts)

- `highlightCurrentMonth`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts)

- `highlightSelectedMonth`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts)

- `showCloseButton`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts)

- `allFocusable`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts)

- `required`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

- `disabled`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

- `isMonthPickerVisible`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

- `showMonthPickerAsOverlay`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

- `allowTextInput`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

- `disableAutoFocus`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

- `open`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

- `highlightCurrentMonth`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

- `highlightSelectedMonth`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

- `showWeekNumbers`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

- `showGoToToday`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

- `allFocusable`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

- `showCloseButton`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

</details>

- **Primer** (internal): `anchor`: `button`, `input`, `icon-only`, `custom`; `view`: `1-month`, `2-month`; `confirmation`: `false`, `true`; `confirmUnsavedClose`: `false`, `true`; `disableWeekends`: `false`, `true` [Primer 1](https://primer.style/product/internal-components/date-picker/)

  Public documentation explicitly says GitHub-only, unavailable externally; excluded from shipping counts.

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `disabled`: `false`, `true`. [API](https://primer.style/product/internal-components/date-picker/)

- `confirmUnsavedClose`: `false`, `true`. [API](https://primer.style/product/internal-components/date-picker/)

- `compressedHeader`: `false`, `true`. [API](https://primer.style/product/internal-components/date-picker/)

- `disableWeekends`: `false`, `true`. [API](https://primer.style/product/internal-components/date-picker/)

- `showInputs`: `false`, `true`. [API](https://primer.style/product/internal-components/date-picker/)

- `showTodayButton`: `false`, `true`. [API](https://primer.style/product/internal-components/date-picker/)

- `showClearButton`: `false`, `true`. [API](https://primer.style/product/internal-components/date-picker/)

- `view`: `1-month`, `2-month`. [API](https://primer.style/product/internal-components/date-picker/)

- `open`: `false`, `true`. [API](https://primer.style/product/internal-components/date-picker/)

</details>

- **Carbon** (component): `selection`: `single`, `range`; `input`: `default`, `fluid` [Carbon 1](https://carbondesignsystem.com/components/date-picker/usage)

  Time input is adjacent, not a calendar selection mode.

- **Material 3** (component): `selection`: `single`, `range`; `input`: `calendar`, `text` [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/DatePicker.md)

- **Mantine** (component): `type`: `default`, `multiple`, `range`; `level`: `month`, `year`, `decade`; `allowDeselect`: `false`, `true`; `allowSingleDateInRange`: `false`, `true`; `withWeekNumbers`: `false`, `true`; `withCellSpacing`: `false`, `true`; `withNativeLevelSelect`: `false`, `true`; `size`: `xs`, `sm`, `md`, `lg`, `xl`, `custom` [Mantine 1](https://mantine.dev/llms/dates-calendar.md), [Mantine 2](https://mantine.dev/llms/dates-date-picker.md), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `fullWidth`: `false`, `true`. [API](https://mantine.dev/llms/dates-calendar.md)

- Props / `hideOutsideDates`: `false`, `true`. [API](https://mantine.dev/llms/dates-calendar.md)

- Props / `hideWeekdays`: `false`, `true`. [API](https://mantine.dev/llms/dates-calendar.md)

- Props / `highlightToday`: `false`, `true`. [API](https://mantine.dev/llms/dates-calendar.md)

- Props / `level`: `month`, `year`, `decade`. [API](https://mantine.dev/llms/dates-calendar.md)

- Props / `withCellSpacing`: `false`, `true`. [API](https://mantine.dev/llms/dates-calendar.md)

- Props / `withNativeLevelSelect`: `false`, `true`. [API](https://mantine.dev/llms/dates-calendar.md)

- Props / `withWeekNumbers`: `false`, `true`. [API](https://mantine.dev/llms/dates-calendar.md)

- Props / `nextDisabled`: `false`, `true`. [API](https://mantine.dev/llms/dates-calendar.md)

- Props / `previousDisabled`: `false`, `true`. [API](https://mantine.dev/llms/dates-calendar.md)

- Props / `withNext`: `false`, `true`. [API](https://mantine.dev/llms/dates-calendar.md)

- Props / `withPrevious`: `false`, `true`. [API](https://mantine.dev/llms/dates-calendar.md)

- Props / `allowDeselect`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `allowSingleDateInRange`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `fullWidth`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `hideOutsideDates`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `hideWeekdays`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `highlightToday`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `level`: `month`, `year`, `decade`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `type`: `range`, `multiple`, `default`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `withCellSpacing`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `withNativeLevelSelect`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `withWeekNumbers`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `clearButtonProps`: `button`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `clearable`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `closeOnChange`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `disabled`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `inputWrapperOrder`: `input`, `label`, `description`, `error`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `loading`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `loadingPosition`: `left`, `right`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `modalProps`: `children`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `readOnly`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `required`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `withAsterisk`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `withErrorStyles`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- Props / `withSuccessStyles`: `false`, `true`. [API](https://mantine.dev/llms/dates-date-picker.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (component): `mode`: `month`, `year`; `selection`: `single`, `range`, `multiple`; `picker`: `date`, `week`, `month`, `quarter`, `year`; `variant`: `outlined`, `borderless`, `filled`, `underlined`; `size`: `small`, `medium`, `large` [Ant Design 1](https://ant.design/components/calendar), [Ant Design 2](https://ant.design/components/date-picker)

  Standalone Calendar and DatePicker panels have different APIs; selection range/multiple comes from DatePicker.

- **Chakra/Ark** (component): `selectionMode`: `single`, `multiple`, `range`; `variant`: `outline`, `subtle`, `flushed` [Chakra/Ark 1](https://chakra-ui.com/docs/components/date-picker), [Chakra/Ark 2](https://chakra-ui.com/docs/components/calendar), [Chakra/Ark 3](https://ark-ui.com/llms.txt/components/date-picker)

  DatePicker trigger/input is a related composition; inline Calendar is directly documented.

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `colorPalette`: `gray`, `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `cyan`, `purple`, `pink`. [API](https://chakra-ui.com/docs/components/date-picker)

- `size`: `xs`, `sm`, `md`, `lg`, `xl`. [API](https://chakra-ui.com/docs/components/date-picker)

- `variant`: `outline`, `subtle`, `flushed`. [API](https://chakra-ui.com/docs/components/date-picker)

- `disabled`: `false`, `true`. [API](https://chakra-ui.com/docs/components/date-picker)

- `fixedWeeks`: `false`, `true`. [API](https://chakra-ui.com/docs/components/date-picker)

- `invalid`: `false`, `true`. [API](https://chakra-ui.com/docs/components/date-picker)

- `open`: `false`, `true`. [API](https://chakra-ui.com/docs/components/date-picker)

- `outsideDaySelectable`: `false`, `true`. [API](https://chakra-ui.com/docs/components/date-picker)

- `readOnly`: `false`, `true`. [API](https://chakra-ui.com/docs/components/date-picker)

- `required`: `false`, `true`. [API](https://chakra-ui.com/docs/components/date-picker)

- `showWeekNumbers`: `false`, `true`. [API](https://chakra-ui.com/docs/components/date-picker)

- `unmountOnExit`: `false`, `true`. [API](https://chakra-ui.com/docs/components/date-picker)

- `hideOutsideDays`: `true`, `false`. [API](https://chakra-ui.com/docs/components/date-picker)

- Context / `focused`: `false`, `true`. [API](https://ark-ui.com/llms.txt/components/date-picker)

- Context / `open`: `false`, `true`. [API](https://ark-ui.com/llms.txt/components/date-picker)

- Context / `disabled`: `false`, `true`. [API](https://ark-ui.com/llms.txt/components/date-picker)

- Context / `invalid`: `false`, `true`. [API](https://ark-ui.com/llms.txt/components/date-picker)

- Context / `readOnly`: `false`, `true`. [API](https://ark-ui.com/llms.txt/components/date-picker)

- Context / `showWeekNumbers`: `false`, `true`. [API](https://ark-ui.com/llms.txt/components/date-picker)

- Context / `isMaxSelected`: `false`, `true`. [API](https://ark-ui.com/llms.txt/components/date-picker)

</details>

- **Atlassian** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Atlassian 1](https://atlassian.design/components/calendar/examples)

- **Polaris** (component): `type`: `single`, `range`; `visibleMonths`: `auto`, `1`, `2` [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-picker.md)

- **Apple HIG** (guidance): `iOSStyle`: `compact`, `inline`, `wheels`, `automatic`; `mode`: `date`, `time`, `date-and-time`, `countdown-timer`; `macOSStyle`: `textual`, `graphical` [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/pickers.json)

  iOS/iPadOS countdown mode is unavailable in compact/inline styles. Platform picker modes include time jobs adjacent to Area Calendar.

## Structural alternatives

- **Untitled UI** (component): single month; two-month range; presets; typed date; Today action; Cancel and Apply footer. [Untitled UI 1](https://www.untitledui.com/react/components/date-pickers), [Untitled UI 2](https://www.untitledui.com/react/components/calendars)

- **shadcn/ui** (component): month-year selector; presets; date-time composition; booked dates; custom cell content; week numbers; Persian/Hijri/Jalali adapters. [shadcn/ui 1](https://ui.shadcn.com/docs/components/calendar.md), [shadcn/ui 2](https://daypicker.dev/selections/selection-modes)

- **React Aria / Spectrum 2** (component): one or multiple months; month picker; year picker; custom calendar system; min/max and unavailable dates. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/Calendar.md), [React Aria / Spectrum 2 2](https://react-aria.adobe.com/RangeCalendar.md), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/Calendar.md), [React Aria / Spectrum 2 4](https://react-spectrum.adobe.com/RangeCalendar.md)

- **Fluent 2** (component): inline calendar; input with popup; side-by-side day/month pickers; overlaid month picker; Today link; week numbers; close button. [Fluent 2 1](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

- **Primer** (internal): single date; range; compressed header; month/year dropdowns; Today; Clear; input inside panel. [Primer 1](https://primer.style/product/internal-components/date-picker/)

- **Carbon** (component): simple date input; calendar picker; year selector; time input adjacency. [Carbon 1](https://carbondesignsystem.com/components/date-picker/usage)

- **Material 3** (component): docked picker; modal picker; year menu; month navigation. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/DatePicker.md)

- **Mantine** (component): presets; multiple columns; month/year/decade drill-down; native level select; custom day content; custom header order; outside days; weekend distinction. [Mantine 1](https://mantine.dev/llms/dates-calendar.md), [Mantine 2](https://mantine.dev/llms/dates-date-picker.md), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): full calendar; card calendar; custom cell; custom header; week numbers; presets; time composition; range panel. [Ant Design 1](https://ant.design/components/calendar), [Ant Design 2](https://ant.design/components/date-picker)

- **Chakra/Ark** (component): inline calendar; month picker; year picker; month/year select; multiple months; presets; presets sidebar; Today; week numbers; booking time grid; fixed weeks; outside-day toggle. [Chakra/Ark 1](https://chakra-ui.com/docs/components/date-picker), [Chakra/Ark 2](https://chakra-ui.com/docs/components/calendar), [Chakra/Ark 3](https://ark-ui.com/llms.txt/components/date-picker)

- **Atlassian** (component): month calendar. [Atlassian 1](https://atlassian.design/components/calendar/examples)

- **Polaris** (component): month view; two months. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-picker.md)

- **Apple HIG** (guidance): inline date calendar; compact popup; wheel entry; numeric entry; date range browsing. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/pickers.json)

## Interaction patterns

- **Untitled UI** (component): single date; date range. [Untitled UI 1](https://www.untitledui.com/react/components/date-pickers), [Untitled UI 2](https://www.untitledui.com/react/components/calendars)

- **shadcn/ui** (component): date grid selection; timezone example. [shadcn/ui 1](https://ui.shadcn.com/docs/components/calendar.md), [shadcn/ui 2](https://daypicker.dev/selections/selection-modes)

- **React Aria / Spectrum 2** (component): grid keyboard; controlled focused date; international calendar conversion; non-contiguous range policy. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/Calendar.md), [React Aria / Spectrum 2 2](https://react-aria.adobe.com/RangeCalendar.md), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/Calendar.md), [React Aria / Spectrum 2 4](https://react-spectrum.adobe.com/RangeCalendar.md)

- **Fluent 2** (component): bounds; restricted dates; localized first day; controlled selection; typed date parsing; validation callback. [Fluent 2 1](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts)

- **Primer** (internal): bounds; locale start of week; apply or immediate commit; unsaved-close confirmation. [Primer 1](https://primer.style/product/internal-components/date-picker/)

- **Carbon** (component): bounds; date input; calendar navigation. [Carbon 1](https://carbondesignsystem.com/components/date-picker/usage)

- **Material 3** (component): constraints; calendar/text entry; confirmation. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/DatePicker.md)

- **Mantine** (component): keyboard grid; min/max bounds; excluded dates; localization; deselect. [Mantine 1](https://mantine.dev/llms/dates-calendar.md), [Mantine 2](https://mantine.dev/llms/dates-date-picker.md), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): bounds; disabled dates; date selection; locale; multiple incompatible with showTime. [Ant Design 1](https://ant.design/components/calendar), [Ant Design 2](https://ant.design/components/date-picker)

- **Chakra/Ark** (component): date grid; bounds; unavailable dates; localization; maximum selection count. [Chakra/Ark 1](https://chakra-ui.com/docs/components/date-picker), [Chakra/Ark 2](https://chakra-ui.com/docs/components/calendar), [Chakra/Ark 3](https://ark-ui.com/llms.txt/components/date-picker)

- **Atlassian** (component): disabled dates/ranges/filter; localization; selection. [Atlassian 1](https://atlassian.design/components/calendar/examples)

- **Polaris** (component): allow/disallow dates and weekdays; controlled view; change/input/viewchange. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-picker.md)

- **Apple HIG** (guidance): locale-dependent ordering; multiple edits before outside confirmation in compact presentation; watchOS Digital Crown navigation. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/pickers.json)

## Area today

Single/range/multiple selection; one/two months; square/circle/tile days; month/week view; weekday formatting; custom markers; min/max/unavailable dates, locale, week start, outside days and fixed weeks. Arrows/Home/End/PageUp/PageDown and shifted year navigation. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L8), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L28), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L35), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L111), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L154)

No documented week-number column, month/year dropdown or drill-down, preset sidebar or Apply/Cancel selection transaction. Date/time and scheduling are adjacent recipes. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L101), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L1)

- **calendar manifest:** `variant` = `plain`, `surface`; `tone` = `neutral`, `accent`; `days` = `square`, `circle`, `tile`; `layout` = `month`, `week`. [packages/styles/src/manifest.ts:101](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L101)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Single and range selection** — layer 2; **9 systems**; Area **yes**; **retain**. Both selection modes already exist. Evidence: [Untitled UI](https://www.untitledui.com/react/components/date-pickers), [shadcn/ui](https://ui.shadcn.com/docs/components/calendar.md), [React Aria / Spectrum 2](https://react-aria.adobe.com/Calendar.md), [Carbon](https://carbondesignsystem.com/components/date-picker/usage), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/DatePicker.md), [Mantine](https://mantine.dev/llms/dates-calendar.md), [Chakra/Ark](https://chakra-ui.com/docs/components/date-picker), [Ant Design](https://ant.design/components/calendar), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-picker.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L1)

- **Multiple noncontiguous dates** — layer 2; **5 systems**; Area **yes**; **retain**. Existing multiple mode. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/calendar.md), [React Aria / Spectrum 2](https://react-aria.adobe.com/Calendar.md), [Mantine](https://mantine.dev/llms/dates-calendar.md), [Chakra/Ark](https://chakra-ui.com/docs/components/date-picker), [Ant Design](https://ant.design/components/calendar). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L1)

- **One or multiple visible months** — layer 3; **5 systems**; Area **yes**; **retain**. Area supports one/two; do not imply unlimited panels. Evidence: [Untitled UI](https://www.untitledui.com/react/components/date-pickers), [React Aria / Spectrum 2](https://react-aria.adobe.com/Calendar.md), [Mantine](https://mantine.dev/llms/dates-calendar.md), [Chakra/Ark](https://chakra-ui.com/docs/components/date-picker), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-picker.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L1)

- **Month/year navigation controls** — layer 3; **6 systems**; Area **not-found**; **add**. Add selector or drill-down with a clear keyboard contract. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/calendar.md), [Carbon](https://carbondesignsystem.com/components/date-picker/usage), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/DatePicker.md), [Mantine](https://mantine.dev/llms/dates-calendar.md), [Chakra/Ark](https://chakra-ui.com/docs/components/date-picker), [Fluent 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L1)

- **Week-number column** — layer 3; **5 systems**; Area **not-found**; **add**. Optional structural column; preserve date-grid semantics. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/calendar.md), [Mantine](https://mantine.dev/llms/dates-calendar.md), [Chakra/Ark](https://chakra-ui.com/docs/components/date-picker), [Ant Design](https://ant.design/components/calendar), [Fluent 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L1)

- **Preset date shortcuts** — layer 3; **4 systems**; Area **partial**; **add**. No named preset recipe today; compose shortcuts with selected-date state. Today is a related optional action. Evidence: [Untitled UI](https://www.untitledui.com/react/components/date-pickers), [shadcn/ui](https://ui.shadcn.com/docs/components/calendar.md), [Mantine](https://mantine.dev/llms/dates-calendar.md), [Chakra/Ark](https://chakra-ui.com/docs/components/date-picker). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L1)

- **Custom day metadata/markers** — layer 3; **3 systems**; Area **yes**; **retain**. Existing markers and tile view. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/calendar.md), [Mantine](https://mantine.dev/llms/dates-calendar.md), [Ant Design](https://ant.design/components/calendar). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L1)

- **Min/max and unavailable dates** — layer 2; **8 systems**; Area **yes**; **retain**. Existing constraints. Evidence: [React Aria / Spectrum 2](https://react-aria.adobe.com/Calendar.md), [Carbon](https://carbondesignsystem.com/components/date-picker/usage), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/DatePicker.md), [Mantine](https://mantine.dev/llms/dates-calendar.md), [Chakra/Ark](https://chakra-ui.com/docs/components/date-picker), [Ant Design](https://ant.design/components/calendar), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-picker.md), [Fluent 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L1)

- **Apply/Cancel date transaction** — layer 3; **2 systems**; Area **not-found**; **consider**. Model draft versus committed selection separately. Evidence: [Untitled UI](https://www.untitledui.com/react/components/date-pickers), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/DatePicker.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L1)

- **Date plus time recipe** — layer 3; **3 systems**; Area **not-applicable**; **consider**. Time input is an adjacent composition, not a new date-selection enum. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/calendar.md), [Carbon](https://carbondesignsystem.com/components/date-picker/usage), [Ant Design](https://ant.design/components/calendar). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — component

- [component/source](https://www.untitledui.com/react/components/date-pickers) — read; checked 2026-09-28.

- [component/source](https://www.untitledui.com/react/components/calendars) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/calendar.md) — read; checked 2026-09-28.

- [component/source](https://daypicker.dev/selections/selection-modes) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — component

- [component/source](https://react-aria.adobe.com/Calendar.md) — read; checked 2026-09-28.

- [component/source](https://react-aria.adobe.com/RangeCalendar.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/Calendar.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/RangeCalendar.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — component

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-calendar-compat/library/src/components/Calendar/Calendar.types.ts) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-datepicker-compat/library/src/components/DatePicker/DatePicker.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — internal

- [component/source](https://primer.style/product/internal-components/date-picker/) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — component

- [component/source](https://carbondesignsystem.com/components/date-picker/usage) — read; checked 2026-09-28.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — component

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [component/source](https://m3.material.io/components/date-pickers/overview) — not found or unusable response; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/DatePicker.md) — read; checked 2026-09-28.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/dates-calendar.md) — read; checked 2026-09-28.

- [component/source](https://mantine.dev/llms/dates-date-picker.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — component

- [component/source](https://ant.design/components/calendar) — read; checked 2026-09-28.

- [component/source](https://ant.design/components/date-picker) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/date-picker) — read; checked 2026-09-28.

- [component/source](https://chakra-ui.com/docs/components/calendar) — read; checked 2026-09-28.

- [component/source](https://ark-ui.com/llms.txt/components/date-picker) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — component

- [component/source](https://atlassian.design/components/calendar/examples) — read; checked 2026-09-28.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — component

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-picker.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/pickers.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:101 — calendar](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L101)

- [docs/specs/calendar.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L1)

- [docs/specs/calendar.md:8 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L8)

- [docs/specs/calendar.md:28 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L28)

- [docs/specs/calendar.md:35 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L35)

- [docs/specs/calendar.md:111 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L111)

- [docs/specs/calendar.md:154 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/calendar.md#L154)
