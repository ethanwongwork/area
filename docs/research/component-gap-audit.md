# Component gap audit (2026-09-26)

Which component jobs mature design systems ship that Area lacks. Catalogues were fetched
on 2026-09-26; section 3 is the matrix, section 5 the recommended order. The Color picker
and Calendar findings were acted on the same day (see [color-picker](../specs/color-picker.md)
and [calendar](../specs/calendar.md)); section 1 describes Area before that work.

## 1. What Area ships today

Sources: `packages/styles/src/manifest.ts` (56 manifests), `packages/react/src/index.ts`,
`primitives.tsx`, `forms.tsx`, `apps/docs/src/component-status.mjs`.

| Family | Variant axes (manifest) | Notes on behavior |
|---|---|---|
| Button | variant solid/soft/outline/ghost; tone ×8; size sm/md/lg; align; bool full-width, icon-only, pill; states disabled/loading/selected | `selected` → `aria-pressed`, so toggle button is covered |
| ButtonGroup | variant soft/outline; size | — |
| Toolbar (+Item/Group/Separator/Overflow) | variant plain/surface; size; orientation | roving focus, `<details>` overflow |
| AlignmentPicker | variant surface/plain; size; bool stretch | 9-position radio grid |
| ColorPicker | none (elements area, thumb, channel, slider, hue, alpha, heading) | S/V area + hue + alpha native ranges, hex ColorField, saved swatches + Add |
| ColorSwatch / ColorSwatchPicker / ColorField | size; picker layout grid/row; field bool alpha | hex only (6/8-digit) |
| Field, Label | orientation; bool inline | label/description/error |
| Input (+InputAction) | variant outline/soft; size; bool full-width, monospace; states incl. loading | icon/affix/action slots |
| NumberField | variant; size | steppers, units, scrub, expressions |
| InputGroup (+Text) | variant; size | — |
| Textarea | variant; size; resize | — |
| Select | size | **native `<select>` only** |
| Checkbox / CheckboxGroup | checkbox variant card; size; group orientation | indeterminate |
| Radio / RadioGroup | size; orientation | no card variant |
| Switch | size; labelPosition; track short/long; tone | — |
| Slider | tone; size; labelPosition top; orientation | **single native range**, step marks |
| Chip / ChipGroup | kind assist/filter/input/suggestion; size; pill, swatch-only, link | — |
| Segmented | size; full-width, icon-only | radiogroup (single choice) |
| Badge / BadgeGroup | variant ×5; tone ×9; size; dot/pill/icon-only; group overflow inline/overlay | — |
| Indicator / IndicatorAnchor / Presence | kind count/dot; tone; placement; status ×8 | — |
| Avatar / AvatarGroup | size; shape; tone | — |
| Kbd / KbdGroup, Code / Token, CodeBlock | kbd size/appearance; code ground; codeblock flush/wrap/collapsed | CodeBlock has copy action |
| Alert | tone ×6; layout single/multiline | — |
| Toast | tone info/danger/warning/success | `role=status`; no queue/timers |
| Progress, Spinner, Skeleton | size/tone; skeleton shape | linear only |
| Card | layout vertical/horizontal/compact/immersive | — |
| Panel (+Section/Stack) | size xs–lg; flush, bare-bar | inspector surface |
| Dialog | none | visual shell; expects native `<dialog>.showModal()` |
| Popover | side ×4; arrow | **surface only** — no trigger/anchor/dismiss |
| Tooltip | side ×4; arrow | **surface only** (`role=tooltip`) |
| Menu (+Item/Label/Separator/Search) | item danger | `role=menu` surface, **no keyboard/typeahead/submenu/trigger** |
| Tabs | size; orientation; track | full keyboard |
| Nav | orientation; tone; selection marker | — |
| Breadcrumb, TreeView | tree selectionMode navigation/checkbox | TreeView has full keyboard |
| Table / TableWrapper | size; interactive, striped, column-dividers | visual table, not a grid |
| Separator | orientation; spacing; inset | — |
| Composer | layout inline/stacked; busy | chat input |

## 2. Catalogues fetched (all 2026-09-26)

| Code | System | URL |
|---|---|---|
| UU | Untitled UI React | https://www.untitledui.com/react/components |
| SH | shadcn/ui | https://ui.shadcn.com/docs/components |
| RA | React Aria Components | https://react-aria.adobe.com/getting-started (sidebar) |
| RX | Radix Primitives | https://www.radix-ui.com/primitives/docs/overview/introduction |
| BU | Base UI | https://base-ui.com/react/overview/quick-start |
| FL | Fluent 2 React v9 | https://react.fluentui.dev/index.json (Storybook index) + https://fluent2.microsoft.design/components/web/react |
| PR | Primer React | https://primer.style/product/components/ |
| CB | Carbon | https://carbondesignsystem.com/components/overview/components/ |
| MT | Mantine core + dates + charts + x | https://mantine.dev/core/button/ and https://mantine.dev/dates/calendar/ (sidebars) |
| MU | Material UI + MUI X | https://mui.com/material-ui/all-components/, https://mui.com/x/react-date-pickers/ |
| AD | Ant Design 6.6 | https://ant.design/components/overview/ |
| CK | Chakra UI v3 + Ark UI | https://chakra-ui.com/llms-components.txt, https://ark-ui.com/llms.txt |
| SP | React Spectrum (S2) | https://react-spectrum.adobe.com/getting-started |

Caveat: Carbon's overview omits sub-components (combo box and multiselect live under Dropdown). MUI X
Data Grid / Tree View / Charts are separate MUI X products not re-fetched here.

## 3. Coverage matrix (jobs shipped by ≥2 systems)

Area: **has** / **partial** (visuals without behavior, or missing an important sub-part) / **missing**.

### Actions and commands
| Job | Shipped by | Area |
|---|---|---|
| Button / icon button | all 13 | has — Button |
| Toggle button (pressed) | SH RA RX BU FL MU CK SP | has — Button `selected` |
| Toggle group (multi-press set) | SH RA RX BU MU CK SP | partial — Segmented is single-choice; ButtonGroup has no group state |
| Button group | UU SH PR MU SP | has — ButtonGroup |
| Split / menu button | FL PR CB AD SP | missing |
| Toolbar | RA RX BU FL | has — Toolbar |
| Action bar (bulk-selection bar) | PR MT CK SP | missing |
| Copy / clipboard button | MT CK CB | partial — CodeBlock copy only |
| Link | RA FL PR CB MT MU CK SP | missing (only BreadcrumbLink, ChipLink, CardAction) |
| Floating action button | MU AD | missing (low value) |

### Entry and forms
| Job | Shipped by | Area |
|---|---|---|
| Text input / textarea | all | has — Input, Textarea |
| Field / label / help / error | SH RA BU FL PR CB MT CK SP | has — Field |
| Fieldset / Form (validation summary) | RA RX BU PR CB MT AD CK SP | partial — group legends only |
| Input group / affixes | SH RA MT AD CK | has — InputGroup |
| Number field | RA BU FL CB MT AD CK SP | has — NumberField |
| Search field (clear, Esc) | RA FL CB SP | partial — Input icon + action, no clear contract |
| Password field (reveal) | RX MT AD CK | partial — Input action slot, no reveal behavior |
| OTP / PIN input | UU SH RX BU MT CK | missing |
| Custom Select (listbox popup) | UU SH RA RX BU FL PR CB MT MU AD CK SP | partial — native Select only |
| Combobox / Autocomplete | SH RA BU FL PR CB MT MU AD CK SP | missing |
| Multi-select / tags input / token field | UU RA FL PR CB MT AD CK | partial — Chip `kind=input` visuals, no entry |
| Listbox / selectable list | RA FL PR MU AD CK SP | missing |
| Cascader / TreeSelect | MT AD | missing |
| Transfer list | MU AD | missing (low) |
| Checkbox, Radio, Switch (+groups) | all | has |
| Choice cards | CK SP CB | partial — Checkbox `card`; no Radio card |
| Slider | all but PR | has — Slider |
| Range slider (2+ thumbs) | UU RA RX BU MT MU AD CK SP | missing |
| Angle slider / dial | MT CK | missing |
| Segmented control | PR CB MT AD CK SP | has — Segmented |
| Rating | UU FL MT MU AD CK | missing |
| File upload / drop zone | UU RA CB MT AD CK SP | missing |
| Editable inline text | CK AD | missing |
| Rich text editor (adapter) | UU MT CK | missing |
| Color picker (composite) | UU RA FL MT AD CK SP | partial — see §4b |
| Color swatch / swatch picker / color field | RA FL MT CK SP | has |
| Gradient editor | UU AD | missing |
| Calendar / DatePicker / DateRange / TimeField | UU SH RA FL CB MT MU AD CK SP | missing — see §4a |

### Navigation
| Job | Shipped by | Area |
|---|---|---|
| Tabs | all | has — Tabs |
| Sidebar / nav list | UU SH FL PR CB MT SP | has — Nav |
| Navigation menu (flyouts) | UU SH RX BU CK | partial — Nav horizontal, no flyouts |
| Breadcrumb | UU SH RA FL PR CB MT MU AD CK SP | has — Breadcrumb |
| Tree | UU RA FL PR CB MT MU AD CK SP | has — TreeView |
| Pagination | UU SH PR CB MT MU AD CK | missing |
| Stepper / steps | UU CB MT MU AD CK | missing |
| Dropdown menu | all | partial — Menu surface, no keyboard/trigger/submenus |
| Context menu | UU SH RX BU | missing |
| Menubar | SH RX BU MT | missing |
| Command palette | UU SH MT | partial — Menu `search-surface` only |
| Table of contents / anchor | MT AD CK | missing (low) |
| App shell / page layout / page header | UU SH PR CB MT MU | missing (composition) |

### Overlays
| Job | Shipped by | Area |
|---|---|---|
| Dialog / modal | all | partial — shell only; focus/dismiss rely on native `<dialog>` |
| Alert / confirmation dialog | SH RX BU PR AD | missing |
| Drawer / sheet | UU SH BU FL MT MU AD CK | missing |
| Popover | all | partial — no anchoring, dismissal, focus |
| Tooltip | all | partial — no trigger delay/positioning |
| Hover card / preview card | SH RX BU MT CK RA | missing |
| Toggletip / contextual help / info label | CB CK FL SP | missing |
| Tour / teaching popover | FL AD CK | missing (low) |
| Floating panel / window | MT CK | missing |

### Feedback and status
| Job | Shipped by | Area |
|---|---|---|
| Inline alert | all | has — Alert |
| Page banner / message bar | UU PR CB FL | partial — Alert, no page-level variant |
| Toast (queue, timers, live region) | all but PR | partial — Toast surface only |
| Linear progress | all | has — Progress |
| Circular progress / ring | UU MT MU AD CK SP | missing |
| Meter | RA BU SP | missing |
| Spinner, Skeleton | most | has |
| Empty state | UU SH PR MT AD CK SP | missing |
| Status light / state label | PR CK SP | has — Badge dot / Indicator |

### Data display and structure
| Job | Shipped by | Area |
|---|---|---|
| Badge / counter / tag | all | has — Badge, Indicator, Chip |
| Avatar + group | all but CB | has |
| Card | most | has — Card |
| Table | all | has — Table |
| Data table / grid (sort, select, resize, virtualize) | SH FL PR CB MU AD RA SP | partial — Table is visual |
| List / structured list | FL PR CB MU AD CK | missing |
| Description list / labeled value | MT AD CK SP | partial — Panel rows only |
| Stat / metric | UU AD CK | missing |
| Timeline | PR MT MU AD CK | missing |
| Accordion | SH RX BU FL CB MT MU AD CK SP | missing |
| Collapsible / disclosure | SH RX BU RA PR MT CK SP | missing (used internally via `<details>`) |
| Resizable / splitter | SH MT AD CK | missing |
| Scroll area | SH RX BU MT CK | missing |
| Carousel | UU SH FL MT AD CK | partial — Card `carousel` element only |
| Image / lightbox | FL MT AD CK SP | missing (low) |
| Charts (adapter) | UU SH MT MU CK | missing |
| Chat message / bubble / scroller / attachment | SH UU | partial — Composer only |
| Kbd, Code, CodeBlock | SH MT CK PR CB | has |
| QR code | UU AD CK | missing (low) |

## 4a. Calendar and date picking

Parts each system splits out (a separate component or a documented mode):

| Part | Systems |
|---|---|
| Inline calendar grid | RA Calendar, SP Calendar, SH Calendar, MT Calendar/DatePicker/MiniCalendar, MU DateCalendar, AD Calendar, FL (compat) Calendar, CK Calendar, UU Calendars |
| Range calendar | RA RangeCalendar, SP RangeCalendar, SH `mode="range"`, MT `type="range"`, Ark `selectionMode="range"`, AD RangePicker, MU DateRangeCalendar (Pro) |
| Multiple dates | RA Calendar `selectionMode="multiple"`, SH `mode="multiple"`, MT `type="multiple"`, AD `multiple`, Ark `selectionMode="multiple"` + `maxSelectedDates` |
| Segmented date field | RA DateField (DateInput + DateSegment), SP DateField, MU DateField, Ark/CK Date Input; MT DateInput is free-text parse |
| DatePicker (field + popover) | RA, SP, MU, MT DatePickerInput, AD, CB, FL (compat), CK, SH (Popover + Calendar), UU |
| DateRangePicker | RA, SP, MU (Pro), AD RangePicker, CB range, MT `type="range"`, CK |
| TimeField / TimePicker | RA TimeField, SP TimeField, MU TimeField/TimePicker, MT TimeInput/TimePicker/TimeGrid, AD TimePicker, FL (compat) TimePicker |
| Date-time picker | MU DateTimePicker, MT DateTimePicker, AD `showTime`, SH date+time example |
| Month / year / quarter / week pickers | MU MonthCalendar/YearCalendar + week picker, MT MonthPicker/YearPicker, AD `picker=week|month|quarter|year`, FL month-only + week selection |
| Presets / shortcuts | MU shortcuts, AD `presets`, Ark `PresetTrigger`, SH presets example |

Variants and options:
- **Multi-month**: RA `visibleDuration` + `pageBehavior`; MT `numberOfColumns`; Ark `numOfMonths`.
- **Week numbers**: MU `displayWeekNumber`, MT `withWeekNumbers`, FL WeekNumbers, Ark `showWeekNumbers`. Not documented in RA.
- **Outside days**: MU `showDaysOutsideCurrentMonth` + `fixedWeekNumber`, MT `hideOutsideDates`, Ark `fixedWeeks`/`outsideDaySelectable`, FL SixWeeks, RA `weeksInMonth`.
- **Min/max + unavailable**: RA `minValue`/`maxValue`/`isDateUnavailable` (+ `allowsNonContiguousRanges`, range `commitBehavior` clear/reset/select); MU `shouldDisableDate`, disable past/future; MT `minDate`/`maxDate`/`excludeDate`; AD `disabledDate`/`disabledTime`; SH booked dates; FL DateBoundaries.
- **Locale**: RA `firstDayOfWeek`, I18nProvider, custom calendar systems; MT `firstDayOfWeek`, `weekendDays`, `locale`; MU adapters, timezones, calendar systems; SH Persian/Hijri + timezone; FL Localized.
- **Month/year navigation**: dropdowns (SH `captionLayout="dropdown"`, RA CalendarMonthPicker/YearPicker, Ark MonthSelect/YearSelect, MT `withNativeLevelSelect`) or arrows + drill-down levels (MU `views`, MT `level` month/year/decade, AD panels).
- **Sizes and display**: MT `size`, `hideWeekdays`, `highlightToday`; AD input size small/middle/large + variants outlined/filled/borderless/underlined; SH custom cell size; RA `weekdayStyle` narrow/short/long.
- **Other**: marked days and loading (FL MarkedDays, MU dynamic data), confirm button (AD `needConfirm`), `shouldCloseOnSelect` (RA), read-only/invalid (RA, MU).

Docs: https://react-aria.adobe.com/Calendar, /RangeCalendar, /DateField, /DatePicker, /DateRangePicker, /TimeField ·
https://ui.shadcn.com/docs/components/calendar · https://mui.com/x/react-date-pickers/date-calendar/ ·
https://mantine.dev/dates/calendar/ · https://ant.design/components/date-picker/ ·
https://ark-ui.com/llms.txt/components/date-picker · Fluent compat stories (Calendar, DatePicker, TimePicker) in https://react.fluentui.dev/index.json.

Keyboard contract (WAI-ARIA APG date picker dialog,
https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/):
- Trigger: Space/Enter opens the dialog and focuses the selected date, or today if there is none.
- Dialog: Esc closes and returns focus to the trigger. Tab and Shift+Tab cycle within the dialog.
- Grid (`role="grid"`, roving tabindex with one `tabindex=0` cell, `aria-selected`, labelled by the month heading, weekday `abbr`):
  - ←/→ moves one day; ↑/↓ moves one week.
  - Home/End go to the start or end of the week.
  - PageUp/PageDown change the month and keep the day number.
  - Shift+PageUp/PageDown change the year.
  - Enter/Space selects the date and closes the dialog.
- React Aria's CalendarGrid follows this pattern. Its new docs pages do not spell out the key table, and the fetched DateField page did not document segment keys. Keys such as Up/Down to increment a segment and type-to-fill should be checked against the component before the spec relies on them.

## 4b. Color picker

| Part | Systems | Area |
|---|---|---|
| 2D saturation/brightness area | RA ColorArea, SP, FL ColorArea, Ark Area, MT ColorPicker, AD, UU | has |
| Hue slider | RA ColorSlider, SP, FL ColorSlider, MT HueSlider, Ark ChannelSlider | has |
| Alpha slider | RA, FL AlphaSlider, MT AlphaSlider, Ark, AD (`disabledAlpha`) | has |
| Other channel sliders (R/G/B, S, L) | RA ColorSlider (any channel), SP, FL ColorSlider channels, Ark | missing |
| Color wheel | RA ColorWheel, SP ColorWheel | missing |
| Color field (text entry) | RA ColorField (hex or single channel), SP, MT ColorInput, Ark ChannelInput | partial — hex + opacity only |
| Per-channel number inputs | Ark ChannelInput, AD, Figma | missing |
| Format selector (hex/RGB/HSL/HSB) | AD hex/rgb/hsb (+`disabledFormat`), Ark `View format` rgba/hsla, MT `format` (developer-set) | missing |
| Eyedropper | Ark EyeDropperTrigger, MT `withEyeDropper` (EyeDropper API) | missing |
| Swatches / presets | RA ColorSwatchPicker, FL SwatchPicker, MT swatches, AD presets, Ark SwatchGroup | has — saved colors + Add |
| Trigger swatch + popover | FL ColorPickerPopup, AD, Ark Trigger/Positioner, MT ColorInput | missing (blocked on Popover behavior) |
| Clear / no color | AD `allowClear` | missing |
| Gradient mode | AD `mode="gradient"`, UU Gradient Pickers | missing |

MUI, shadcn, Radix, Base UI, Primer and Carbon ship no color picker.
Docs: https://react-aria.adobe.com/ColorPicker (and /ColorArea, /ColorSlider, /ColorWheel, /ColorField,
/ColorSwatchPicker), https://mantine.dev/core/color-input/, https://ant.design/components/color-picker/,
https://ark-ui.com/llms.txt/components/color-picker, Fluent stories ColorPicker/SwatchPicker.

Figma's color picker, according to Figma's help center. The live picker was then captured (`captures/color-picker/figma--*`), which confirmed this order: header, paint-type row with blend mode and contrast, area, eyedropper beside hue and opacity, model select with fields, swatches.
- **Header**: switches between a custom color and styles/variables from libraries, with **+** to create a style or variable. ([Apply paints](https://help.figma.com/hc/en-us/articles/360041003774-Apply-paints-with-the-color-picker))
- **Paint type**: Solid, Gradient, Pattern, Image, Video. Video is paid plans only. ([Guide to fills](https://help.figma.com/hc/en-us/articles/360041003694-Guide-to-fills))
- **Gradients**: Linear, Radial, Angular or Diamond from a dropdown.
  - Stops are edited on a stop bar. Click the bar or **+** to add a stop. Delete or **−** removes one.
  - Each stop has a position %, its own color and opacity, and can take a variable.
  - Flip and Rotate buttons change direction. ([Gradients](https://help.figma.com/hc/en-us/articles/34208860210199-Use-gradients-as-a-fill-or-stroke))
- **Images**: Fill, Fit, Crop or Tile, plus adjustments such as exposure. ([Image properties](https://help.figma.com/hc/en-us/articles/360041098433-Adjust-the-properties-of-an-image))
- **Blend mode** control and a **Check color contrast** (WCAG) control.
- **Main editor**:
  - 2D area, then an **eyedropper** button beside the **hue** and **opacity** sliders.
  - The eyedropper shortcut is I (Mac also Ctrl+C). Tab cycles the color model while sampling; Esc cancels. ([Eyedropper](https://help.figma.com/hc/en-us/articles/27643269375767-Sample-colors-with-the-eyedropper-tool))
- **Color model dropdown**: Hex (default), RGB, CSS, HSL, HSB, with matching value inputs and opacity %. CSS gives paste-ready notation. ([Color models](https://help.figma.com/hc/en-us/articles/360043042113-About-color-models))
- **Swatches**: document colors and library colors below the editor. Mixed selections are covered on a separate page. ([Mixed selection](https://help.figma.com/hc/en-us/articles/360042553434-View-and-adjust-colors-in-a-mixed-selection))

What Area's ColorPicker lacks compared with Figma:
- Model dropdown with per-channel inputs.
- Eyedropper, where the EyeDropper API exists.
- Popover trigger.
- Paint-type tabs, a gradient stop editor and blend mode.
- Library/document swatch sections and variable binding.
- Contrast check.

## 5. Recommended additions, in priority order

1. **Overlay behavior layer** (anchoring, collision, dismissal, focus return, typeahead). Popover, Tooltip, Menu and Dialog are all partial. Every picker below depends on this. [RA RX BU]
2. **Custom Select (listbox popup)**. All 13 systems ship one (Primer as SelectPanel, Spectrum as Picker). Figma and Notion dropdowns carry icons, checkmarks and descriptions that a native `<select>` cannot show.
3. **Combobox / Autocomplete, with multi-select/TagPicker mode**. 11 systems ship it. It is the core of Notion property/relation pickers and Figma's font and variable search.
4. **Menu completion**: keyboard, submenus, ContextMenu and a CommandPalette. All three products lean on right-click menus and ⌘K/⌘/ quick actions. Area has only surfaces.
5. **ColorPicker completion**: model dropdown and channel inputs, eyedropper, popover trigger, clear. After that, a gradient stop editor. These are the pieces that separate Area's picker from Figma's.
6. **Collapsible / Disclosure and Accordion**. 10 systems ship them. Figma inspector sections, Notion toggles and ChatGPT's "thinking" and sources blocks all use this shape.
7. **Calendar family**: Calendar, then DatePicker, RangeCalendar/DateRangePicker, segmented DateField and TimeField. Notion date properties need range, time and a reminder, and 10 systems ship a calendar.
8. **Resizable / Splitter and ScrollArea**. Figma side panels, Notion's sidebar and ChatGPT's sidebar are resizable, thin-scrollbar surfaces.
9. **Drawer/Sheet and AlertDialog**. ChatGPT's mobile sidebar and settings, plus destructive confirmations such as delete chat or page. 8 systems ship a drawer.
10. **Chat message primitives**: Message, Bubble, a scroller with stick-to-bottom, and an attachment chip. shadcn now ships these (https://ui.shadcn.com/docs/components/message). Area has only Composer, and the target product is ChatGPT.
11. **FileUpload / DropZone** with upload progress. Used by ChatGPT attachments, Notion file blocks and Figma image fills. 7 systems ship it.
12. **HoverCard and Toggletip / contextual help**. Used for Notion link and mention previews and Figma property help. 6 and 4 systems respectively.

Next tier, cheap or niche:
- Link, EmptyState, Pagination.
- Range slider, Toggle group (multi-press), editable inline text (layer/page rename).
- Description list, circular progress/meter, Stepper.
- DataGrid adapter (Notion database views; large job).
