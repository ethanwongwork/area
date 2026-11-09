# Internal coverage audit (2026-11-07)

Area against itself: where peer families disagree, or a family lacks a variant, size, state, slot or behaviour that its
peers have or that its job needs. Read-only. Sources: `area-inventory.md` (from `packages/styles/src/manifest.ts`), the
React interfaces in `packages/react/src/components`, component CSS, specs and `docs/GOVERNANCE.md`.

Not repeated here: GOVERNANCE's known deviations (Checkbox/Radio `md`/`lg` only, Drawer `sm` default, `show*`
booleans, `labelPosition`/`selectionMode`, Folder/File page sizes without a default), the system-gaps sweep
(`docs/research/system-gaps-2026-11-06/README.md`: status words, dismiss API, colour vocabulary, Tag/Badge size names,
the frame spelling and C2 frame recipe, overlay width hooks) and PRODUCT_UI's open gaps (width hooks for Slider,
Progress and Radio; List box frameless grid). Where a family's spec already decided against the thing, the row says
"no change" with the decision.

Paths are relative to `packages/react/src/components/` (`.tsx`), `packages/styles/src/` (`manifest.ts`, `components/*.css`)
or `docs/specs/` unless written in full.

## Top findings by value

1. Success and warning validation stops at six fields: OTP, Time, Date, Date range, Custom select and Tag picker take
   only `invalid`, and ignore the `data-validation-status` that Field hands every control.
2. Read-only is missing where it is needed: on Checkbox and its group (a native checkbox ignores `readonly`), Custom select,
   Date picker and Date range picker. Switch, Radio group, Input, Combobox and Tag picker have it.
3. The open-state API is split: Combobox, Tag picker, Time field and Split button expose none; Date picker, Date
   range picker, Custom select, Zoom control and Context menu expose only `onOpenChange`; Nav group has `open` but no
   `defaultOpen`.
4. `onValueChange(value, event)` (the GOVERNANCE rule) is broken by 11 families that drop the event. Input, Textarea,
   Select and Password field have no `onValueChange` at all, though Search field (on the same Input) does.
5. List box picks one value only, and File grid and Asset grid inherit that, though choosing several files or assets is
   a browser's job. Its rows have no icon or description slots (Menu, Combobox and Custom select rows do), and it has no
   `name`.
6. Alert, Toast and Indicator lack the `caution` and `discovery` tones that Button and Badge carry. Alert's spec still
   says its tones follow "Badge's order".
7. The choice groups disagree with each other. Checkbox group has no value model or `name` (Radio group has both).
   Radio group has no success or warning validation (Checkbox group has both). Radio group spells `readonly` where
   everything else says `read-only`.
8. Dialog has none of Drawer's `size` axis or `inline` prop. It goes inline implicitly, when no trigger or `open` is
   given.
9. Message has only `streaming`. A sent message that fails, or is still sending, has no state, though Queue, Attachment
   and Turn notice each have `error`.
10. Avatar ships `xs`, against its own spec's sizes, GOVERNANCE's "never `xs`" and audit C-19 ("the system has no xs
    tier"). Nav has no `size` while Tree view has `sm`, though Tree view's spec says the two share row heights.

## Text fields

Input, Textarea, Number field, Search field, Password field, OTP field, Time field, Date picker, Date range picker,
Color field, Combobox, Select, Custom select, Tag picker, Input group.

| Family | Missing | Peers that have it | Evidence | Suggested fix |
|---|---|---|---|---|
| OTP field, Time field, Date picker, Date range picker, Custom select, Tag picker | `success` / `warning` validation (they take `invalid` only; Time field maps status `error` and drops the rest) | Input, Number field, Textarea, Select, Input group (and Search, Password, Color field, Combobox through Input) | Input.tsx:38, NumberField.tsx:47, forms.tsx:22, 75, InputGroup.tsx:13; input.css:105-113. Missing: OTPField.tsx:26, TimeField.tsx:82, DatePicker.tsx:22, DateRangePicker.tsx:33, CustomSelect.tsx:51, TagPicker.tsx:40; manifest.ts:184, 781, 805, 816. Field passes `data-validation-status` (Field.tsx:144) | **Add state**: `validationStatus` plus reading `data-validation-status`, painted with `--area-input-success/warning-color` as Input does |
| Custom select, Date picker, Date range picker | `readOnly` (a value set elsewhere, shown but not changed: the reason Radio group has one) | Input, Number field, Textarea, OTP field, Time field, Combobox, Tag picker, Color field | manifest.ts:159, 184, 349; TimeField.tsx:31; Combobox.tsx:147; TagPicker.tsx:148; no `readOnly` in CustomSelect.tsx:32-73 or DatePicker.tsx:10-38 | **Add state** `read-only`: the trigger stays focusable and announces `aria-readonly`, and the list doesn't open |
| Select | `readOnly` | the same | forms.tsx:13-24 | **No change**: a native `<select>` has no read-only. Point to Custom select once it has one |
| Combobox, Tag picker, Time field (its list) | any open-state API (`open` / `defaultOpen` / `onOpenChange`) | Popover, Menu, Dialog, Drawer, Tooltip, Hover card, Toggletip, Command palette | Combobox.tsx:24-51 and :74 (internal `useState`), TagPicker.tsx:24-42, TimeField.tsx:13-37; peers primitives.tsx:1356-1358, 1474-1476 | **Add API**: at least `onOpenChange`, ideally the full trio |
| Date picker, Date range picker, Custom select | `open` / `defaultOpen` (they have `onOpenChange` only) | the overlays above | DatePicker.tsx:37, DateRangePicker.tsx:50, CustomSelect.tsx:56 | **Add API**: controlled and uncontrolled open |
| Input, Textarea, Select, Password field | `value` / `defaultValue` / `onValueChange` (native `onChange` only) | Search field, OTP, Number, Color field, Combobox, Time, Date, Tag picker, Custom select | Input.tsx:10-44, forms.tsx:13-24, 65-77, PasswordField.tsx:9-18 vs SearchField.tsx:12-15 (same Input base) | **Add API**: `onValueChange(value, event)` beside native `onChange`, as Checkbox added `onCheckedChange` (forms.tsx:137) |
| Search field, OTP field, Time field | the event in `onValueChange` | Number field, Color field, Combobox, Date picker, Tag picker | SearchField.tsx:15, OTPField.tsx:15, TimeField.tsx:18 vs NumberField.tsx:12 | **Fix API**: `(value, event?)` |
| Input, Select, Tag picker, Combobox | `ghost` variant | Date picker, Custom select | manifest.ts:157, 803 vs 779, 814; select.md:180 ("a ghost variant is a candidate") | **No change yet**: the trigger fields are buttons. A native Select ghost waits on select.md's candidate, and Input ghost has no use |
| Custom select, Tag picker, Command palette (and Combobox's list) | `loading`: a busy list while options arrive | Input (`loading`, `loadingText`), Button, Switch | Input.tsx:28-32; CustomSelect.tsx:32-73, TagPicker.tsx:24-42, CommandPalette.tsx:26-49 have none; Combobox gets Input's spinner but its list only has `emptyText` (Combobox.tsx:45) | **Add state**: `loading` with a spinner row in the list, shared through Menu's surface |
| Date picker, Date range picker | ref and native props on one element: `forwardRef<HTMLDivElement>` reaches the wrapper, while `ButtonHTMLAttributes` reach the trigger button | Custom select (ref and props both on the trigger button) | DatePicker.tsx:10, 56, 116-121; DateRangePicker.tsx:19, 67; CustomSelect.tsx:32, 81 | **Fix API**: forward the ref to the trigger, as Custom select does, so `ref.focus()` works and Field's `id` and the ref agree |
| Textarea | `lg` | Input, Number field, Select | manifest.ts:343-347; textarea.md:28 | **No change**: removed by audit B-24 (lg differed from md by 4px). Check an `lg` form: Input lg's inset no longer matches the Textarea next to it |
| Color field | `variant` in the manifest (the React prop works) | Input, Number field | manifest.ts:138 lists only `size`; ColorField.tsx:77, 84 pass `variant` | **Manifest fix**: add `variant: outline / soft` so the gallery and Inspector show it |
| Tag picker | `description` and `group` on options | Combobox and Custom select options | TagPicker.tsx:12-20 vs Combobox.tsx:12-22, CustomSelect.tsx:14-28 | **No change** until a use appears: tag lists are flat in the references |

## Choices

Checkbox (and group), Radio (and group), Switch, Segmented, Toggle group, Chip.

| Family | Missing | Peers that have it | Evidence | Suggested fix |
|---|---|---|---|---|
| Checkbox | `readOnly`: the native attribute does nothing on a checkbox, so a passed `readOnly` neither blocks a change nor paints | Switch (blocks changes and sets `data-read-only`), Radio group | forms.tsx:118-139 (no prop); Switch.tsx:55, 72, 87; forms.tsx:261, 279 | **Add state** `read-only`: prevent the change, set `aria-readonly`, and paint it as Radio group's read-only (choice.css:202-205) |
| Checkbox group | `readOnly` | Radio group | forms.tsx:189-200 vs 256-261 | **Add state**, as Radio group |
| Checkbox group | a value model (`value` / `defaultValue` / `onValueChange(string[])`) and a shared `name` | Radio group (`value`, `defaultValue`, `onValueChange`, generated `name`, form reset), Toggle group (`value: string[]`) | forms.tsx:189-200 vs 249-254, 284-292; ToggleGroup.tsx:22-26 | **Add API**: an optional controlled array, with each Checkbox reading it by `value`, as Radio does through context |
| Radio group | `validation` and `validationStatus` (success, warning) | Checkbox group, Field | forms.tsx:241-262 (only `error`) vs 195-198; manifest.ts:381 vs 401 | **Add state**: success and warning, as Checkbox group |
| Radio group | the vocabulary `read-only` (it spells `readonly`) | Input, OTP, Textarea, Number field, Switch | manifest.ts:401, forms.tsx:302 (`data-readonly`), choice.css:205 vs manifest.ts:159, 416 and `data-read-only` in 17 places | **Rename** to `read-only` / `data-read-only`, keeping the old attribute for one release |
| Toggle group | `name` / `form` | Segmented, Radio group | ToggleGroup.tsx:20-36 vs primitives.tsx:2009-2010 | **No change** until a form use: toggles are commands (toggle-group.md:17-19) |
| Toggle group | the event in `onValueChange` | Segmented, Tabs | ToggleGroup.tsx:26 vs primitives.tsx:2005 | **Fix API** |
| Button (toggle) | the event in `onSelectedChange` | Chip | Button.tsx:39 vs primitives.tsx:1102 | **Fix API** |
| Segmented | `variant` | Toggle group (soft, outline, ghost) | manifest.ts:972 vs 69 | **No change**: Segmented is one track (segmented.md:108) |
| Chip group | a selection model | Toggle group | primitives.tsx:1250-1253 | **No change**: each chip toggles on its own (manifest description) |
| Radio | per-option `invalid` | Checkbox | forms.tsx:134 vs 361-373 | **No change**: validation belongs on the group |

## Buttons

Button, Split button, Button group, Copy button, Zoom control, Toggle group item.

| Family | Missing | Peers that have it | Evidence | Suggested fix |
|---|---|---|---|---|
| Split button | `open` / `defaultOpen` / `onOpenChange` for its menu | Menu | SplitButton.tsx:11-34 vs primitives.tsx:1474-1476 | **Add API**: pass it through to the anchored menu |
| Split button | a top-level `loading` (it only reaches the action through `actionProps`, and the chevron stays live) | Button | SplitButton.tsx:33 vs Button.tsx:44 | **Add state**: `loading` busies the action and disables the trigger |
| Split button | `size` in the manifest (React and spec have sm/md/lg) | Button, Button group, Toggle group | manifest.ts:77 vs SplitButton.tsx:20, split-button.md:56 | **Manifest fix**: add `size` |
| Split button | `fullWidth` | Button, Button group, Toggle group | SplitButton.tsx:11-34 vs manifest.ts:61-69 | **No change** until a use (a stacked mobile footer would be one) |
| Zoom control | `open` / `defaultOpen`; the event in `onValueChange` | Menu; Number field | ZoomControl.tsx:15, 49 | **Fix API** |
| Button group | `solid` and `ghost` | Button, Split button | manifest.ts:61 vs 38-47, 77 | **No change**: joined groups are soft or outline in every reference (button-group.md:59-60) |

## Overlays

Dialog, Confirm dialog, Drawer, Popover, Hover card, Tooltip, Toggletip, Menu, Context menu, Command palette.

| Family | Missing | Peers that have it | Evidence | Suggested fix |
|---|---|---|---|---|
| Dialog | a `size` axis (one width, 480) | Drawer (`size` sm/md) | manifest.ts:887 (`variants: {}`) vs 833; dialog.md:94 | **Add variant** `size` sm/md (shadcn 384, Area 480, Primer 640). This is the axis behind the known "no width hook" item |
| Dialog | an `inline` prop (it goes inline implicitly when there is no trigger and no `open`) | Drawer, Confirm dialog, Command palette | primitives.tsx:1902-1907 vs Drawer.tsx:34, ConfirmDialog.tsx:26, CommandPalette.tsx:33 | **Fix API**: add `inline` and keep the implicit case for one release |
| Drawer | `onDismiss` (it has `dismissLabel` only) | Dialog | Drawer.tsx:26-27 vs primitives.tsx:1880-1882 | **Add API**, so one close API runs across the modal family |
| Dialog, Confirm dialog | footer `actions` row or stacked | Drawer | manifest.ts:833 | **No change** until a narrow-screen dialog is built |
| Hover card | `arrow` | Popover, Tooltip | HoverCard.tsx:9-33 vs primitives.tsx:1350, 1386 | **No change**: a preview card has no pointer in the references |
| Context menu | `open` / `defaultOpen` | Menu | ContextMenu.tsx:23 | **No change**: it opens at the pointer; `onOpenChange` is enough |
| Dialog | `modal={false}` | Drawer | Drawer.tsx:24 | **No change**: a non-modal Dialog is a Popover or a Drawer |

## Lists

Menu, List box, Nav, Tree view, Table, Description list, Property list, Shortcut list, Tabs.

| Family | Missing | Peers that have it | Evidence | Suggested fix |
|---|---|---|---|---|
| List box, and File grid and Asset grid, which inherit its props | picking several values | Tree view (`selectedIds`), Custom select (`multiple`), Toggle group, Calendar `multiple` | ListBox.tsx:35-46 (`value: string`); FileTile.tsx:44, AssetCard.tsx:146 extend `ListBoxProps`; list-box.md:22 ("multiple selection waits for a use") | **Add state** `multiple` (`aria-multiselectable`, Shift/⌘-click, Space). Choosing several files or assets is the use |
| List box item (list layout) | `icon` and `description` slots | Menu item, Combobox and Custom select options, Command item | ListBox.tsx:156-163, 202-206 (children only, in `area-menu__text`) vs primitives.tsx:1666-1668, Combobox.tsx:17-18 | **Add slot**: render Menu's `__icon` and `__description` parts |
| List box | `name` / `form` | Segmented, Radio group, Custom select | ListBox.tsx:35-46 vs primitives.tsx:2009, CustomSelect.tsx:53 | **Add API**: a hidden input, as Combobox does (Combobox.tsx:267) |
| List box, Accordion, Description list, Table of contents | the event in `onValueChange` / `onExpandedChange` | Tabs, Segmented, Tree view | ListBox.tsx:41, Accordion.tsx:94, DescriptionList.tsx:25, TableOfContents.tsx:31 vs TreeView.tsx:35 | **Fix API** |
| Nav | `size` | Tree view (sm/md), Accordion, Panel | manifest.ts:1009 vs 315; tree-view.md:86 ("Tree rows stay the same size as Nav rows") | **Add variant** `size="sm"` with Tree view sm's row, so a sidebar and a layer tree can match |
| Nav group | `defaultOpen` | Panel section, Accordion item, Plan, Step | Nav.tsx:45-46 (controlled only) vs primitives.tsx:665-668 | **Add API** |
| Menu item | `trailing` slot (a count, a badge) | Nav item, Tabs items, Tree view nodes | primitives.tsx:1651-1675 (only `shortcut`) vs Nav.tsx:95, primitives.tsx:1794, TreeView.tsx:12 | **Add slot** `trailing` |
| Tabs | items keyed `value` (they're keyed `id`, and `value` selects by id) | Segmented, Toggle group item, Combobox, Custom select, Model picker | primitives.tsx:1794-1797 vs 1997-2001 | **Fix API**: accept `value` on items, keep `id` as an alias |
| Table | `selected` row state in the manifest and docs (the CSS paints `tr[aria-selected]`) | Card, List box, Menu, Segmented, Tabs | components/navigation.css:425, 416-417; manifest.ts:949-959 (no states) | **Manifest and docs**: list `selected` (`aria-selected` on `tr`) |
| List box, Tree view, Table | an empty slot | Combobox, Tag picker, Command palette (`emptyText`) | Combobox.tsx:45, TagPicker.tsx:36, CommandPalette.tsx:44 | **No change**: compose Empty state. Write the recipe in each family's usage entry |
| List box section, Nav group, Panel section, Accordion item | one name for a group's heading | — | ListBox.tsx:213 `title`, Nav.tsx:38 `label`, primitives.tsx:659 `heading`, Accordion.tsx:22 `heading` | **Vocabulary**: pick `heading` for a group's title prop and alias the rest, low priority |

## Feedback

Alert, Toast, Badge, Count, Indicator, Progress, Meter, Spinner, Skeleton, Empty state.

| Family | Missing | Peers that have it | Evidence | Suggested fix |
|---|---|---|---|---|
| Alert, Toast, Indicator | `caution` and `discovery` tones | Button, Badge | manifest.ts:878, 934, 485 vs 40-47, 475; alert.md:35 ("Badge's order", now stale) | **Add values** on the existing `tone` axis: `discovery` for a feature banner, `caution` between warning and danger. Re-run the contrast tests per tone |
| Toast | the `link` slot and `dismissIcon` | Alert | primitives.tsx:1726-1736 vs 166-179 | **Add slot** `link` (an "Undo" or "View" link is common in toasts) |
| Alert, Toast | one name for the action slot: Alert's part is `__actions` and Toast's `__action`; both props are singular `action`, where Empty state, Card header, Board column and Nav item say `actions` | — | manifest.ts:880 vs 935; primitives.tsx:170, 1730, 1750; EmptyState.tsx:17 | **Vocabulary**: `actions` for both parts and props, keeping `action` as an alias |
| Progress | `tone` for a failed or stalled run | Meter (`warning`, `danger`) | manifest.ts:680 vs 252; progress.md:11-12 (tone removed with accent, D1) | **Owner decision**: D1 removed accent, not danger. File upload item's error hides the bar today |
| Progress | a visible label and value | Meter (`label`, `valueText`, header part) | primitives.tsx:486-492 vs Meter.tsx:36-43; FileUpload.tsx:152-154 rebuilds the percent beside a Progress | **No change** (progress.md: label and value are composed). Document the recipe once, so File upload item and others share it |
| Meter | `size` in the manifest (React takes sm/md/lg) | Progress | manifest.ts:252 vs Meter.tsx:47 | **Manifest fix** |
| Indicator | boolean naming: `withBorder` (the rule is an adjective for the non-default state, so `bordered`), and two words for one idea, `hidden` here and `invisible` on Indicator anchor | GOVERNANCE "Booleans" | Indicator.tsx:12, 18, 43 | **Rename** with deprecated aliases |
| Count | `tone` | Indicator | manifest.ts:495 | **No change**: Count is the quiet label count (count.md) |

## Content

Card, Surface, Asset card, Design card, Asset row, File tile, Folder, Avatar, Timeline, Board, Message, Code block.

| Family | Missing | Peers that have it | Evidence | Suggested fix |
|---|---|---|---|---|
| Message | `error` (failed to send) and `sending` | Queue item (`sending`, `error`), Attachment (`error`), Turn notice (`error`) | manifest.ts:594; Message.tsx:5-15 (only `streaming`); message.md:25 | **Add state** `status="sending" | "error"` on the user turn, with Retry in its actions |
| Avatar | `xs` exists in the manifest and CSS but not in the spec, against "never `xs`" | Badge, Presence, Indicator (sm/md/lg; xs removed in audit C-19) | manifest.ts:633, components/display.css:80 vs avatar.md:32; GOVERNANCE §5 "Sizes"; indicator.md:35 | **Owner decision**: record xs's use (the Chip and inline avatars) in the spec as a deviation, or retire it |
| Board card | `selected` | Card, Asset card, Design card | Board.tsx:59-69 vs primitives.tsx:226-234, AssetCard.tsx:45, DesignCard.tsx:103 | **No change** until boards gain multi-select; dragging stays the app's (board.md:17-18) |
| Asset row | `selected` / `interactive` | Asset card | AssetRow.tsx:7-18 vs AssetCard.tsx:45-50 | **No change**: an export list row isn't chosen |
| File tile | standalone `selected` | Asset card, Design card | FileTile.tsx:12-23 | **No change**: File grid item (List box) owns selection |
| Card | the `interactive` boolean (Card is interactive through `CardLink`) and Asset card / Design card `size` | Asset card, Design card; Card, Surface | surface.css:477-492; manifest.ts:872, 851 | **Covered by system gaps C2** (one frame recipe) |
| Timeline item | `status` / tones | Stepper step | timeline.md:40 | **No change**: tones wait for a product use |
| Folder, File page, File image | — (`variant` / `tone` are archived and ignored) | — | Folder.tsx:43-46 | **No change**: already `@deprecated` |

## Cross-family behaviour notes

- **`onValueChange` without the event** (GOVERNANCE: `onValueChange(value, event)`): Accordion.tsx:94,
  EditableText.tsx:18, ListBox.tsx:41, OTPField.tsx:15, SearchField.tsx:15, SliderRange.tsx:13,
  TableOfContents.tsx:31, TimeField.tsx:18, ToggleGroup.tsx:26, ZoomControl.tsx:15; also `onSelectedChange` in
  Button.tsx:39 and `onExpandedChange` in DescriptionList.tsx:25. Make the event the optional second argument, as Number
  field does: a non-breaking change.
- **Controlled and uncontrolled pairs**: Editable text has `defaultEditing` and `onEditingChange` but no `editing`
  (EditableText.tsx:20-22). Slider range has no `onValueCommit` (Slider has it, primitives.tsx:828; Number field too,
  NumberField.tsx:13), so a drag on the range commits on every step (SliderRange.tsx:10-28).
- **Ref forwarding is universal** (every exported component uses `forwardRef` except the internal `Anchored*`, Toolbar
  item and Toaster). The one mismatch is the trigger fields' ref target (Date picker and Date range picker vs Custom
  select, above).
