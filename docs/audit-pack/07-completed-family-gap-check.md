# 07 Gap check for completed families

Field, Input, Textarea, Select, Radio, Token, Code, Nav are marked Complete, and Button and
Checkbox were finished by hand. Those audits ran under the old "justify inclusion" policy,
so they likely rejected or deferred rows that the new policy wants built. Walk each
checklist against the shipped CSS / manifest / React / docs. Anything unticked becomes a
follow-up batch for that family. Items marked **(Separate)** are their own components and
should be added to the audit sequence table if they are not there yet.

Legend: source codes as in file 00.

---

## Button (quick check)

- [ ] Variants solid / soft / outline / ghost / plain(link) x tones neutral / accent / danger / success (+ warning) matrix
- [ ] `inverted` / on-emphasis set for use on solid Alerts, Toasts, dark Tooltips
- [ ] Sizes across the whole control ramp; icon-only square at each size; `pill` shape
- [ ] Leading icon, trailing icon, both; trailing `count` (Counter badge) PRI; trailing Kbd SHA; trailing caret (`dropdown`); avatar leading
- [ ] `block` width; `alignContent=start|center` for block buttons in menus and sidebars PRI
- [ ] `loading`: spinner replaces leading icon, or replaces label with width preserved; `loadingText`; announcement PRI
- [ ] `inactive` / disabled-focusable with explanatory tooltip PRI FLU
- [ ] Toggle (pressed) state: see Toggle button, file 01
- [ ] Label wrap vs truncate policy; two-line "compound" button with secondary text FLU(CompoundButton)
- [ ] **(Separate)** IconButton with required label + tooltip; ButtonGroup joined / separated, vertical, with separators and mixed Input / Select children SHA(ButtonGroup, ButtonGroupText, ButtonGroupSeparator); Split button (primary + menu caret, shared outline, 1px divider) GEI FLU M3; Menu button; Link / Anchor (inline, standalone, subtle, external icon, `muted`, underline policy) PRI FLU OAI(TextLink); FAB / floating action M3; Copy button (icon swap + feedback); Button with progress fill

## Checkbox (quick check)

- [ ] Sizes; indeterminate; invalid; read-only; disabled x checked / indeterminate
- [ ] Label position end / start; label + description; hidden label
- [ ] Tones (accent, neutral ink) and `circular` shape FLU
- [ ] Group: legend, caption, group-level validation, required; horizontal / vertical; columns grid PRI(CheckboxGroup)
- [ ] Select-all parent with indeterminate + nested indented children
- [ ] Checkbox card / Choicebox (whole card is the label; multi) GEI SHA CAR(selectable tile)
- [ ] In Menu (`menuitemcheckbox`), in Table selection cell, in List leading slot

---

## Field

- [ ] Orientation `vertical`, `horizontal` (label column fixed width or `max-content`, control column grows, help and error under the control column), `responsive` (container query flips) SHA FLU
- [ ] Label: required asterisk, `(optional)` text alternative, visually hidden, info tooltip / InfoLabel FLU, **label end slot** (link such as "Forgot password?", counter)
- [ ] Description placement below control (default) and above control (between label and control) SHA
- [ ] Messages: error (icon + text, `aria-live` on change), warning, success, hint; multiple errors as a list SHA(FieldError); message reserves one line height option to stop layout jump
- [ ] Validation states error / warning / success / none propagate to child control FLU(validationState)
- [ ] Character counter (under control, end-aligned; tone shifts at 90% and over limit) CAR M3
- [ ] Sizes sm / md / lg drive label and message type, and pass size to the control FLU
- [ ] Disabled and read-only propagation; `inert` fieldset
- [ ] FieldSet + Legend (variant `legend` large, `label` small) + group description; FieldGroup (vertical rhythm); FieldSeparator with optional text ("Or continue with"); multi-column grid rows (first / last name), inline field rows with shared label (date parts) SHA
- [ ] Choice fields: control-start layout for Checkbox / Radio / Switch (control aligned to first label line), choice **card** wrapper SHA PRI(FormControl layout horizontal)
- [ ] Floating / inside label variants: `floating` (label animates to the border / top on focus or fill) M3 MUI; `fluid` (label inside the box above the value, box is 56-64 high) CAR(Fluid forms)
- [ ] Form-level: error summary at top linking to fields, sticky form footer, section headings; **(Separate)** Form layout recipes

## Input

- [ ] Appearances: `outline` (default), `soft` / filled (muted fill, no stroke until focus), `underline`, `ghost` / subtle (no chrome until hover or focus: inline-edit and table cells) FLU(outline, underline, filled-darker, filled-lighter) ATL(standard, subtle, none) OAI M3
- [ ] Sizes on the control ramp; `pill` shape OAI; `block` and width tokens (xs to xl) ATL; `monospace`, `contrast` fill PRI
- [ ] Start / end **slots inside the box**: icon, text prefix / suffix ("https://", "USD", ".area.dev"), Kbd hint, spinner, status icon, clear button, icon-button action with tooltip PRI(leadingVisual, trailingVisual, trailingAction) FLU(contentBefore, contentAfter) GEI(prefix, suffix, with or without divider styling)
- [ ] **Input group** addons outside or attached: `inline-start`, `inline-end`, `block-start`, `block-end` (toolbar row inside the same box: the chat-composer pattern) with buttons (xs / sm / icon), text, select, dropdown menu SHA(InputGroup)
- [ ] Attached compositions: input + button, input + select (currency, country code), joined radius and collapsed borders SHA(ButtonGroup)
- [ ] States: hover, focus (ring + stroke), invalid, warning, success (trailing check), disabled, read-only (distinct from disabled: no fill change, no caret-blocking), loading (`loaderPosition` auto / leading / trailing) PRI
- [ ] Autofill styling neutralised; placeholder contrast; `:user-invalid` not `:invalid`
- [ ] Type recipes, each a documented variant or **(Separate)** component:
  - [ ] Password: reveal toggle, caps-lock hint, strength meter (segmented bar, file 04), requirements checklist CAR
  - [ ] Search: leading icon, clear button, shortcut Kbd that hides on focus, loading, `expandable` icon-to-field, recent searches popover, scoped search with leading Select FLU(SearchBox) CAR(Search) GEI
  - [ ] Clearable input GEI
  - [ ] Number / Stepper: buttons stacked at end, split minus / plus at both ends, hidden steppers; hold-to-repeat; wheel off by default; min / max clamp; `precision`, `stepPage`; locale formatting; unit suffix; scrub on label FLU(SpinButton) CAR(NumberInput) FIG
  - [ ] OTP / PIN: N cells, groups with separator, auto-advance, paste-to-fill, pattern, masked SHA(InputOTP)
  - [ ] Tags input: chips inside, delimiters (comma, space, Enter), `maxTags`, per-tag validity, `rows`, paste splitting OAI(TagInput) PRI(TextInputWithTokens: preventTokenWrapping, visibleTokenCount, maxHeight)
  - [ ] Copy field: read-only value + copy button + feedback
  - [ ] Masked / formatted: card, expiry, phone with country select, currency, percentage
  - [ ] Colour: swatch + hex field + picker popover; **(Separate)** Color picker, Swatch picker (sizes xs to lg; shape square / rounded / circular; spacing; row / grid; image and empty swatches) FLU
  - [ ] File: button-style, dropzone (idle / drag-over / uploading list with progress / error), avatar uploader; **(Separate)** File upload
  - [ ] Date / time: **(Separate)** Date picker, Date range picker, Calendar, Time picker OAI(DatePicker, DateRangePicker) SHA(Calendar) GEI(Calendar) FLU
  - [ ] Inline edit: text that becomes an input on click / Enter, confirm / cancel buttons or blur-commit ATL **(Separate)**
  - [ ] Slider + number pair (file 01)

## Textarea

- [ ] Appearances and sizes match Input exactly (same stroke, radius, padding-inline; padding-block tuned so the first line sits where Input's text sits)
- [ ] `resize`: none, vertical (default), horizontal, both; custom grab handle paint FLU
- [ ] Autosize: `minRows`, `maxRows`, then scroll; CSS `field-sizing: content` with JS fallback
- [ ] Character counter and limit states; word count option
- [ ] Block-start and block-end toolbars inside the box (formatting, attach, mic, send): composer recipe; send button enabled state; Cmd / Ctrl+Enter hint SHA(InputGroupTextarea) OAI(chat composer tokens: radius 4xl, gutter 12)
- [ ] Monospace / code mode; read-only with copy; invalid; disabled; loading
- [ ] Mentions, slash commands, markdown toolbar: **(Separate)** Rich-text editor / Composer

## Select (native) and its behavioural neighbours

Native Select is one row in a family of four. The atlas already separates them; confirm each
exists or is queued.

- [ ] **Select (native)**: sizes; appearances as Input; placeholder option; optgroup; leading icon slot; invalid; disabled; `block`; chevron is a background or positioned icon that ignores pointer events; `multiple` list-box form; customisable `<select>` (`appearance: base-select`) progressive enhancement SHA(native-select) PRI GEI CAR
- [ ] **(Separate) Select (custom listbox)**: trigger = **Select control** (variant soft / outline / ghost, pill, block, `selected` paint, StartIcon, dropdown icon options, loading, optical alignment) OAI(SelectControl); popup positions `item-aligned` (selected item overlays the trigger, macOS style) vs `popper` (below) SHA; option: icon, avatar, description, trailing meta, tooltip, disabled, check position start / end; groups + labels + separators; scroll buttons; typeahead; clearable; `matchTrigger` width; max-height; empty and loading OAI SHA FLU(Dropdown)
- [ ] **(Separate) Combobox**: editable / filterable; `freeform` (custom values) and creatable ("Create 'x'"); autocomplete list / inline / both; match highlighting; async with debounce + loading row; clear button; open on focus vs on type; grouped; disabled options; `inlinePopup`; input inside the popup (button trigger + searchable popover) FLU(freeform, showClearIcon) SHA(Combobox) PRI(Autocomplete) CAR MUI GEI
- [ ] **(Separate) Multi-select**: chips in the field with wrap or single-line "+N"; selection count chip with clear-all CAR; checkboxes in options; select all; selected-first ordering option; max selections; footer with Apply / Cancel (deferred commit) or instant; modal variant on narrow PRI(SelectPanel: anchored / modal, footer, showSelectAll, showSelectedOptionsFirst, notice, message) FLU(TagPicker) OAI(Select multiple) GEI(Multi Select)
- [ ] Shared listbox option geometry = Menu item geometry (file 02) so popups look like one family

## Radio

- [ ] Sizes; tones; invalid; disabled x checked; read-only
- [ ] Label position; label + description; hidden label
- [ ] Group: legend, caption, validation, required; orientation vertical / horizontal / `horizontal-stacked` (label under control) FLU; columns
- [ ] "Other" option revealing an Input
- [ ] Radio **card** / Choicebox: title + description + optional media / price end-aligned; radio control visible (start or end) or hidden with selected stroke only; grid or stacked; disabled card GEI(Choicebox) CAR(RadioTile) SHA(choice card)
- [ ] Button-style radio group = Segmented (file 01); swatch radio = Swatch picker; image radio grid (theme picker: Light / Dark / System with thumbnails) GEI(Theme Switcher)
- [ ] In Menu (`menuitemradio`), in Table single-select column

## Token

- [ ] Kinds with previews: colour (swatch chip, checkerboard under alpha), dimension (number + unit), typography (Aa preview), shadow, radius, duration / easing, alias (arrow to the referenced token)
- [ ] Sizes xs / sm / md; mono name; optional value at end; truncation in the middle of long dotted paths (`color.….hover`)
- [ ] Interaction: static; copy on click with feedback; link to the token's docs; hover card with resolved value per theme / mode
- [ ] Binding-state indicator where the product models it (bound to a variable, overridden / pinned, detached / loose), with distinct icon and paint per state; "detach" action affordance FIG(variable pills)
- [ ] Variants soft / outline / ghost; on-emphasis; inside Input (a field whose value is a token pill) FIG; inside Table cells and Description lists
- [ ] Deprecated / experimental status mark; invalid reference (danger, strikethrough)

## Code (inline)

- [ ] Variants soft (default) / outline / ghost / plain; tone neutral + accent + diff add / remove
- [ ] Size is relative (`0.875em`-ish) so it works inside headings, tables, alerts; radius and padding in `em`; `overflow-wrap: anywhere` and `box-decoration-break: clone` so wrapped inline code keeps padding on each line
- [ ] Copy-on-click option with feedback; link code (anchor inside or around); truncation (end and middle) with tooltip
- [ ] Recipes: branch name with icon and link PRI(BranchName); short SHA with copy; file path; colour value with swatch; env var; keyboard key goes to Kbd, not Code
- [ ] On emphasis (inside solid Alert, inverted Tooltip); inside prose at all text sizes

## Nav

- [ ] Item: leading icon, label, description, trailing visual (Counter badge, Badge "New", Kbd, status dot), trailing action (icon button on hover: add, more) PRI(NavList) NOT
- [ ] States: rest, hover, active, focus-visible, current (`aria-current="page"`; soft fill and / or inset accent bar), current-ancestor, disabled, `inactive` with reason, loading skeleton
- [ ] Structure: groups with headings (subtle / filled, collapsible, with heading action), dividers, nested sub-nav (indent, optional guide line, max depth 3-4), expandable parents (chevron end or start) that may also be links (split item) FLU(NavCategory, NavSubItem, SplitNavItem, NavSectionHeader) PRI(SubNav, GroupExpand "Show more")
- [ ] Sizes / density sm / md; item radius inset vs full-bleed rows
- [ ] **Sidebar shell**: side start / end; variant `sidebar` (flush, border), `floating` (inset card with shadow), `inset` (content area is the raised card); collapsible `offcanvas` (slides away), `icon` (rail: icons only, labels as tooltips, flyout sub-menus), `none`; header (workspace / account switcher), content (scrolls), footer (user menu); resize by drag with rail hit area, collapse threshold, hover-peek when collapsed; keyboard shortcut toggle; mobile = Drawer SHA(Sidebar) NOT ATL FLU(NavDrawer sizes) M3(rail, drawer)
- [ ] Sidebar extras: search input row, skeleton menu, sticky group labels, drag-to-reorder favourites, unread indicators
- [ ] Top nav: horizontal items with current indicator, overflow to "More", mega-menu panels with a shared animated viewport SHA(NavigationMenu); app header bar with start / centre / end slots CAR(UI Shell) PRI(Header)
- [ ] Bottom navigation (mobile): 3-5 items, icon over label, active pill behind icon, badge anchors M3 HIG MUI **(Separate)**
- [ ] Drill-in (nested views that slide, with back row) ATL **(Separate behaviour)**
- [ ] In-page nav: table of contents with scroll-spy indicator; anchor list **(Separate)**

---

## New rows to add to the audit sequence table

These appear in the atlas or in the sources but have no queue row yet. Suggested order
follows dependency (primitives before composites):

| Add | Depends on | Spec in this pack |
| --- | --- | --- |
| Icon button, Link, Button group, Split button | Button | 07 Button |
| Toggle button / Toggle group | Button | 01 |
| Rating | Radio | 01 |
| Counter badge, Status dot, Tag | Badge | 03 |
| Avatar group, Persona / Entity | Avatar | 03 |
| Banner, Inline message | Alert | 04 |
| Loading dots, Shimmer text, Progress circle / Gauge / Meter | Spinner, Progress | 04 |
| Empty state, Error state | Button, Icon | 04 |
| Alert dialog, Drawer / Sheet | Dialog | 05 |
| Hover card, Teaching popover / Spotlight, Toggletip | Popover, Tooltip | 05, 04 |
| Accordion / Disclosure | Separator | 05 |
| Snippet | Code block | 06 |
| List / Item, Description list, Stat, Timeline | Separator, Avatar, Badge | 06 |
| Breadcrumbs, Pagination, Stepper, Tree, Command menu | Menu, Button | 02 |
| Input group, Search, Number input, OTP, Tags input, Copy field, Inline edit | Input | 07 Input |
| Select (custom), Select control, Combobox, Multi-select / Select panel | Menu item geometry, Chip | 07 Select |
| Date picker, Date range picker, Calendar, Time picker | Popover, Input | not in this pack: needs its own research batch |
| Color picker, Swatch picker, File upload, Rich-text composer | Popover, Input, Progress | not in this pack beyond the rows above |
| Data grid, Tree table | Table, Tree | not in this pack: behaviour contract first |
| Toolbar / Action bar, Page header, App bar, Scroll area, Resizable | Button, Separator | partially in 05 Panel; needs own batch |
| Chat primitives: Message, Bubble, Attachment, Marker, Message scroller, Composer | Avatar, Textarea, Card | seen in shadcn HEAD (`message`, `bubble`, `attachment`, `marker`, `message-scroller`) and OpenAI tokens; needs own batch |
