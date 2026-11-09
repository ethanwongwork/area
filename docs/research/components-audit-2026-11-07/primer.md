# Primer against Area (2026-11-07)

Research only. What GitHub's Primer has that Area lacks: variants on families Area already has, components it
doesn't have, and system practices. The baseline is `area-inventory.md` (this folder), `docs/COMPONENTS.md`
› Candidates, `docs/research/component-gap-audit.md` (2026-09-26) and `docs/research/system-gaps-2026-11-06/README.md`.
Anything those already record is left out, or is marked as already a candidate.

**Sources.**
- `src/…` is `packages/react/src/…` in `github.com/primer/react` at commit `35ff4972` (2026-11-07,
  `@primer/react` 38.45.0), read from a shallow clone. Line numbers are at that commit.
- Every component's props, defaults, subcomponents and status come from its `*.docs.json`. Primer's site
  generates its props tables from these files.
- Component pages are at `https://primer.style/product/components/<kebab-name>/`; the slug pattern was checked on
  `/segmented-control/`. Pattern pages are under `https://primer.style/product/ui-patterns/`, and accessibility
  pages under `https://primer.style/accessibility/`.
- All were fetched on 2026-11-07.

## 1. Primer's components mapped to Area

Primer's public list has 62 components (`/product/components/`). The source has 80 `docs.json` files, which add
deprecated, draft and experimental ones. There are also 25 internal components (`/product/internal-components/`).
Statuses come from the `docs.json` files; the site's lifecycle is Experimental, Ready and Deprecated
(`/product/getting-started/component-status/`).

| Primer (status) | Area family |
|---|---|
| ActionBar (alpha) | Toolbar |
| ActionList (beta) | Menu, List box |
| ActionMenu (beta) | Menu with a trigger |
| AnchoredOverlay (alpha), Overlay (alpha) | Popover and `Overlays.tsx` (not a public primitive) |
| Autocomplete (alpha) | Combobox |
| Avatar, AvatarStack (alpha) | Avatar, Avatar group |
| Banner (alpha) | Alert `layout=banner` |
| Blankslate (draft) | Empty state |
| BranchName (alpha) | none (Code + Link) |
| Breadcrumbs (alpha) | Breadcrumb |
| Button, IconButton (alpha) | Button (`iconOnly`) |
| ButtonGroup (alpha) | Button group |
| Card (draft) | Card |
| Checkbox, CheckboxGroup, Radio, RadioGroup (alpha) | Checkbox, Radio and their groups |
| CircleBadge (deprecated) | none |
| ConfirmationDialog (alpha) | Confirm dialog |
| CounterLabel (alpha) | Count |
| DataTable, Table (alpha) | Table (visual only) |
| Details (alpha) | Accordion |
| Dialog (alpha) | Dialog, Drawer |
| FormControl (alpha) | Field |
| Header (alpha) | Titlebar |
| Heading, Text (alpha) | none (type tokens; Section heading is title + lede) |
| Hidden (draft) | none |
| InlineMessage (alpha) | Field's validation part only |
| IssueLabel (experimental), Label (alpha), StateLabel (alpha) | Tag; Badge |
| KeybindingHint (draft) | Kbd |
| LabelGroup (alpha) | Badge group |
| Link (alpha) | Link |
| NavList (alpha) | Nav |
| PageHeader (beta) | none (Section heading, Titlebar) |
| PageLayout, SplitPageLayout (alpha) | none: the App-shell layout candidate |
| Pagination (alpha) | Pagination |
| Popover (alpha) | Popover (also its tour `step`) |
| ProgressBar (alpha) | Progress; Meter `segmented` |
| RelativeTime (alpha) | Timestamp (chat turns only) |
| ScrollableRegion (no docs.json) | Table wrapper, Scroll area |
| SegmentedControl (alpha) | Segmented |
| Select (alpha) | Select |
| SelectPanel (alpha) | Custom select, Tag picker (no filter panel) |
| SkeletonBox, SkeletonText, SkeletonAvatar (alpha) | Skeleton |
| Spinner (alpha) | Spinner |
| Stack (alpha) | Stack |
| SubNav (alpha), TabNav (deprecated) | Nav horizontal, Segmented |
| Textarea, TextInput (alpha) | Textarea, Input |
| TextInputWithTokens (deprecated), Token (alpha) | Tag picker; Tag, Chip `kind=input` |
| Timeline (alpha) | Timeline |
| ToggleSwitch (alpha) | Switch |
| Tooltip v2 (beta) | Tooltip |
| TopicTag (draft) | Chip link, Tag |
| TreeView (beta) | Tree view |
| Truncate (alpha) | none (Badge `truncate` only) |
| UnderlineNav (beta) | Tabs, Nav horizontal |
| UnderlinePanels (draft) | Tabs |
| Experimental Tabs hooks (`useTabs`, `useTabList`, `useTabPanel`) | none (Tabs is styled only) |
| AriaStatus, AriaAlert (alpha), `@primer/live-region-element` | none (each component writes its own region) |

The internal components map as follows:
- **Already in Area:** CommandPalette, QuickSearch (Command palette); DatePicker (Date picker); CopyToClipboard
  (Copy button); SimpleSelect (Custom select).
- **Already candidates:** MarkdownEditor (Content tools); ChartCard (Chart); DragAndDrop (reorder).
- **None in Area:** Filter and FilterCore; ListView, NestedListView, SimpleListView; ControlGroup;
  InlineAutocomplete and EmojiAutocomplete (Composer menu covers only the composer); BannerStack; LifecycleLabels;
  ListFilterButton; ListItemActionMenu; UiCommands; GitHubAvatar.

The site's pattern pages are of two kinds:
- **UI patterns:** data visualization, degraded experiences, empty states, feature onboarding, forms, loading,
  navigation, notification messaging, progressive disclosure, saving.
- **Scenario patterns:** copy, create, customize, delegate, delete, edit, filter, search, view.

## 2. Missing variants on existing Area families

Area's side was checked against `area-inventory.md` and the React prop interfaces in `packages/react/src/components/`.
In the last column, "N components" counts non-deprecated Primer components and subcomponents whose `docs.json` has
the prop.

| Area family | Missing variant or prop | Primer evidence (file:line, values) | How common across Primer |
|---|---|---|---|
| Button | `inactive`: looks disabled but keeps focus, hover and click, so it can explain why it doesn't work. It is not `disabled` | `src/Button/types.ts:46-50`; degraded-experiences page: "does it respond to hover or click? If yes, use an inactive Button" | 2 (Button, IconButton); the same idea is `inactiveText` on ActionList.Item, ActionList.LinkItem and NavList.Item (`src/ActionList/shared.ts:50-53`) |
| Button | `count` (number or string): a trailing counter inside the button | `src/Button/types.ts:88`; `Button.docs.json:115` | 5 (Button, SegmentedControl.Button `count`, UnderlineNav.Item and UnderlinePanels.Tab `counter`, TreeView.SubTree `count`) |
| Button | `loadingAnnouncement`: the words announced while loading (Area announces nothing of its own) | `src/Button/types.ts:42-45` | Also Spinner `srText` (default "Loading", `src/Spinner/Spinner.tsx:22`) and ToggleSwitch `loadingLabel` |
| Button | `labelWrap` (default false): a long label wraps instead of truncating | `src/Button/types.ts:51-54` | 1 |
| Button | `trailingAction`: a trailing slot apart from the label (the dropdown caret); `alignContent` start or center for block buttons | `Button.docs.json:166`, `:89` | trailingAction on 5 (Button, TextInput, ActionList, NavList, PageHeader) |
| Button (`iconOnly`) and Tooltip | `keybindingHint` drawn in the tooltip; IconButton's `description` switches its tooltip from label to description | `Button/IconButton.docs.json` (keybindingHint, description); `src/TooltipV2/Tooltip.tsx:23-24` (`type: 'label' \| 'description'`, `keybindingHint`) | 2 |
| Tooltip | Named delays: `short` 50 ms (default), `medium` 400, `long` 1200 | `src/TooltipV2/Tooltip.tsx:25-31`, `:98-99` | 1. Area takes any number of milliseconds and has no named scale |
| Kbd | `format="full"` spells keys out ("Command Shift K") where `condensed` uses glyphs; a `Mod` key that resolves per platform (`apple`, `windows`, `other`); sequences (`"Mod+x y z"`) | `src/KeybindingHint/props.ts:25`; `src/KeybindingHint/platform.ts:4-12`; `KeybindingHint.features.stories.tsx:15,17` | 3 (KeybindingHint, Tooltip, IconButton). Area's Kbd already took the `small`/`normal` size aliases but always draws glyphs |
| Spinner | `delay`: `true` or `'long'` = 1000 ms, `'short'` = 300 ms, or any number of milliseconds; nothing renders before it | `src/Spinner/Spinner.tsx:27-28`, `:53` | 3 (Spinner, SkeletonBox `delay` at `src/Skeleton/SkeletonBox.tsx:15`, Tooltip) |
| Skeleton | `delay` (as Spinner); SkeletonText `size` named after the type styles (`display`, `titleLarge`, `titleMedium`, `titleSmall`, `bodyLarge`, `bodyMedium` (default), `bodySmall`, `subtitle`) and `maxWidth`; SkeletonAvatar with a responsive `size` and `square` | `SkeletonText.docs.json:46`; `SkeletonAvatar.docs.json` | 3 skeleton components |
| Switch | A visible status word beside the switch (`buttonLabelOn` / `buttonLabelOff`, default On / Off) and its side (`statusLabelPosition`, default start); `loadingLabelDelay` (2000 ms) before "Loading" is announced | `src/ToggleSwitch/ToggleSwitch.tsx:32`, `:38`, `:45-46` | 1 |
| Segmented | `count` per option; responsive `variant` per viewport: `hideLabels`, `dropdown` (the control becomes a menu), `default`, `subtle`; a `subtle` look; responsive `fullWidth`; `SegmentedControl.Action` (an action at the end, with `loading`); `SegmentedControl.Divider` | `src/SegmentedControl/SegmentedControl.tsx:35`, `:139-144`; `SegmentedControlButton.tsx:27`; `SegmentedControl.docs.json:78` | 1 family, 4 subcomponents |
| Tabs, Nav horizontal | At narrow widths the tabs that don't fit go into a "More" menu (Area scrolls them); a counter per tab, with `loadingCounters` drawing skeleton counters; `hideIconsBreakpoint` (default `'medium'`, 768) drops the icons; `variant` inset or flush | `src/UnderlineNav/UnderlineNav.tsx:61` (`overflowMenuItems`); `UnderlineNav.docs.json:48,54,60,77` | 2 (UnderlineNav, UnderlinePanels) |
| Nav | `NavList.GroupExpand` ("Show more", loading `pages` of items); `inactiveText` on an item; Description `inline` or `block`; a group's `hideDivider`; `aria-current` as `page`, `step`, `location`, `date` or `time` (Area: a `current` boolean) | `src/NavList/NavList.tsx:431`; `NavList.docs.json:107,118,208,306` | 1 |
| Menu, List box | Item `inactiveText` and `loading`; Description `variant` inline or block, plus `truncate`; `TrailingVisual` (a count or text at the end, apart from the shortcut); `TrailingAction` (a second button in the row with a tooltip and `loading`); GroupHeading `variant` filled or subtle, with `auxiliaryText`; `showDividers`; item `size` small, medium or large; list `variant` inset, horizontal-inset or full; `selectionVariant` single, radio or multiple on the list or the group | `src/ActionList/shared.ts:53,57,149`; `List.tsx:23`; `Description.tsx:15,22`; `Group.tsx:55,63`; `TrailingAction.tsx:17` | ActionList is the row engine for ActionMenu, SelectPanel, NavList and Autocomplete (5 components) |
| Tree view | Branches that load later: `SubTree state` (`initial`, `loading`, `done`, `error`), with `count` skeleton rows while loading and `TreeView.ErrorDialog` (`onRetry`, `onDismiss`); `flat` (no indent, for search results); a `LeadingVisual` that is a function of `isExpanded` (open and closed folders), and `TreeView.DirectoryIcon`; `secondaryActions`; a `truncate` toggle; `containIntrinsicSize` for long trees | `src/TreeView/TreeView.tsx:96`, `:238`, `:543-551`; `TreeView.docs.json` | 1. The loading guidance names TreeView as a pattern consumer |
| Breadcrumb | `overflow`: `wrap` (default), `menu` or `menu-with-root`. The trail collapses into a menu by itself when it doesn't fit. In Area the ellipsis and its items are placed by hand, or `nowrap` cuts the trail | `src/Breadcrumbs/Breadcrumbs.tsx:25` | 1 |
| Pagination | Responsive `showPages` (`{narrow: false}` shows only previous and next on phones). Area has `siblingCount`, `boundaryCount` and `layout=compact`, but nothing switches by viewport | `Pagination.docs.json` (`showPages`); `src/Pagination/Pagination.tsx:116-118` | 2 (Pagination, Table.Pagination) |
| Alert (`banner`) | An `upsell` variant (Area has a `discovery` tone on Button and Badge, not on Alert); primary and secondary actions with `actionsLayout` (`default`, `inline`, `stacked`); `hideTitle` (the title stays for assistive tech); `layout=compact` | `src/Banner/Banner.tsx:12`, `:42`, `:85`, `:90` | 1 |
| Field | InlineMessage, a tone-coloured icon and line usable outside a field (after a save, for data that is unavailable). It has an `unavailable` tone beside critical, success and warning, and `size` small or medium. FormControl.Label has `requiredText` and `requiredIndicator` (drop the mark when every field is required), and `as` label, legend or span. FormControl also has a `LeadingVisual` | `src/InlineMessage/InlineMessage.tsx:6,12`; `src/FormControl/FormControlLabel.tsx:11-12` | InlineMessage is named in the notification, saving and forms patterns |
| Textarea | `autoSize` between `minHeight` and `maxHeight`. Area's Composer grows; its Textarea does not | `src/Textarea/Textarea.tsx:39` | 1 |
| Empty state | `size` large (Area has sm and md); `border` (off by default, on when it shares the screen); `narrow` (a capped width); `spacious` (more padding) | `src/Blankslate/Blankslate.tsx:14,24,29,34` | 1. The degraded pattern also uses it to replace a failed panel |
| Count | An emphasized `variant="primary"` (solid) beside `secondary`. Area's Count is plain or soft | `src/CounterLabel/CounterLabel.tsx:12` | 1 |
| Tag | Sizes 16 (`small`) and 32 (`xlarge`) beside 20 and 24 (Area has md 20 and lg 24); `fillColor`, any hex with its ink computed from that colour's HSL; IssueLabel's 19 named hues (pink, plum, purple, indigo, blue, cyan, teal, pine, green, lime, olive, lemon, yellow, orange, red, coral, gray, brown, auburn; Area has 10); `isSelected`; `as` button or link | `src/Token/TokenBase.module.css:22-48`; `src/Token/IssueLabelToken.tsx:18,49-50`; `IssueLabel.docs.json:26` | 3 (Token, IssueLabelToken, IssueLabel) |
| Avatar group | Spreads out on hover and focus (on by default; `disableExpand` turns it off); `variant` cascade (the 3rd and later avatars overlap 85%) or stack (all overlap 55%); `alignRight`; responsive `size` | `src/AvatarStack/AvatarStack.tsx:22-28`; `AvatarStack.module.css:14-21` | 1 |
| Dialog | `width` small 296, medium 320, large 480 or xlarge 640 (or any value); `height` small 480, large 640 or auto; responsive `position`, center, left, right, `bottom` or `fullscreen` per viewport (a bottom sheet or full screen on a phone); `align` top, center or bottom; `footerButtons` as data, with `autoFocus`; `initialFocusRef` | `src/Dialog/Dialog.tsx:125-128`, `:132`, `:145`; `Dialog.module.css:147-166` | Extends system-gaps' "Overlay hooks uneven" (no width hook on Dialog) with Primer's scale and the responsive position |
| Confirm dialog | `overrideButtonFocus` (confirm or cancel takes the first focus); `confirmButtonType` normal, primary or danger; `onClose(gesture)` reports confirm, close-button, cancel or escape; a promise hook, `useConfirm()` | `ConfirmationDialog.docs.json:11,35,41`; `src/index.ts:48` | 1 |
| Popover (overlays) | On narrow screens `variant: {narrow: 'fullscreen'}`; `side` `inside-*` (sits over the anchor, as over a field); `pinPosition`; a shared size scale (widths small 256, medium 320, large 480, xlarge 640, xxlarge 960; heights xsmall 192, small 256, medium 320, large 432, xlarge 600) | `src/AnchoredOverlay/AnchoredOverlay.tsx:106,110`; `src/Overlay/Overlay.tsx:62-64` | 5 (Overlay, AnchoredOverlay, ActionMenu.Overlay, SelectPanel, Autocomplete.Overlay) |
| Combobox | A `loading` menu; `selectionVariant` multiple; `sortOnCloseFn` (the chosen move first when it reopens); `openOnFocus` | `Autocomplete.docs.json:64,135,140,145` | 1. Area's `onCreate` matches `addNewItem` (`:120`) |
| Custom select | SelectPanel's jobs: a filter field in the overlay; `showSelectedOptionsFirst`; `showSelectAll`; explicit Save and Cancel in a footer (`variant: 'modal'` requires `onCancel`); `message` (empty, error, warning) and `notice`; `loading`; `virtualized`; `secondaryAction`; full screen on narrow screens (`disableFullscreenOnNarrow`) | `src/SelectPanel/SelectPanel.tsx:94,99,113,121,130`; `SelectPanel.docs.json:158,194,200,236` | 1. It is Primer's main multi-picker; the saving pattern requires its Save and Cancel for multi-select |
| Table | Sortable headers (`Table.SortHeader`, direction ASC, DESC or NONE, setting `aria-sort`; a column's `sortBy` is alphanumeric, basic, datetime or a function); row groups that collapse and select as one (all, some, none); a bulk-actions bar with its selected count; `Table.Skeleton` (`rows` default 10); `Table.Pagination` (`pageSize` default 25); a Title, Subtitle and Actions header; `CellPlaceholder`; an ErrorDialog with retry; column `width` grow, growCollapse or auto, with min and max | `DataTable.docs.json:105,130,151,185,551,583,695,700`; `src/DataTable/Table.tsx:149,386`; `src/DataTable/Pagination.tsx:62` | Row selection and virtualization are already a candidate (DataGrid). Sorting, groups, skeleton rows, a pagination slot and the header are not |
| Timeline | `Timeline.Break` (a gap in the line); a `condensed` item; `clipSidebar` (`start`, `end`, `both`: the line stops at the first or last event); Badge tones | `src/Timeline/Timeline.tsx:7,50,117`; `Timeline.docs.json:41,51` | 1 |
| Stack | `justify` start, center, end, space-between or space-evenly (Area has only `spread`); `wrap="balance"`; `padding`, `paddingBlock` and `paddingInline`; `Stack.Item` `grow` and `shrink`; a responsive value on every prop. Its gap ladder has 6 steps (none, tight, condensed, cozy, normal, spacious) | `Stack.docs.json:11-46`; `src/Stack/Stack.tsx:18` | Stack is the primitive used to lay out the pattern pages |
| Timestamp | RelativeTime: an element that updates itself, with `format` auto, micro ("3d") or elapsed ("4m 3s"); `tense`; `threshold` (default `P30D`, after which it shows the absolute date); `precision`; Intl parts; the full date as its title unless `noTitle` | `RelativeTime.docs.json:36,42,48,54,118`; content page: "Use the RelativeTime component for all dates and times" | 1. Area's WRITING.md has the rule ("relative while recent, then absolute") but no component outside chat turns |
| Progress | `inline` (sized to sit in a sentence); `animated` | `ProgressBar.docs.json:41,58`; `src/ProgressBar/ProgressBar.tsx:13-14` | 1 (low). Its segmented `ProgressBar.Item` is already Meter `segmented` |
| Toolbar | ActionBar's `gap` none or condensed (default condensed) and `flush` | `src/ActionBar/ActionBar.tsx:79,88` | 1 (low). Its overflow menu Area already has |

## 3. Components Area lacks

| Component | Job | Evidence | Already a candidate? |
|---|---|---|---|
| Page header | A view's title region. Its slots: a context area (a ParentLink back to the parent, shown on narrow screens by default, a ContextBar and context actions), a title area (`variant` subtitle, medium or large, responsive), leading and trailing visuals and actions, Actions, Breadcrumbs, Description, Navigation. Every slot has a responsive `hidden` | `PageHeader.docs.json` (`hidden` default for ParentLink `{narrow: false, regular: true, wide: true}`, `variant` at `:180`); `src/PageHeader/PageHeader.tsx:184`; navigation pattern: "the title area at the top of the main content region that shows the user where they are" | No. App-shell layout covers the window's regions, not the title block, and Section heading is only a title and lede |
| Truncate | A line that ends in an ellipsis and keeps the whole string in the DOM; `maxWidth` (default 125), `inline`, `expandable` (shows it whole on hover and focus) | `Truncate.docs.json:26,32,38`; `src/Truncate/Truncate.tsx:10-11`; `/accessibility/patterns/truncation/` | No. Only Badge has `truncate`; WRITING.md's rule is followed in each component's CSS |
| Relative time | A time element shared by every surface. It updates itself, switches from relative to absolute at a threshold and carries the full date (see the Timestamp row in section 2) | `RelativeTime.docs.json`; content page, "Numbers, dates, and times" | No. It could instead be an option of Timestamp |
| Heading, Text | Type primitives whose look is independent of the level: Heading `as` (default h2) with `variant` large, medium or small; Text with `size` large, medium or small and `weight` light, normal, medium or semibold | `src/Heading/Heading.tsx:13`; `Text.docs.json:61,65` | No. Area sets type with tokens and classes |
| Filter bar | A query input with suggestions and validation that builds a search string (`is:open label:bug`), and a button showing how many filters are active (ListFilterButton) | `/product/internal-components/` (Filter, FilterCore, ListFilterButton); scenario pattern "Filter" | No |
| List view | A list of items, each with its primary information, metadata, actions and selection, with bulk actions and nesting (NestedListView) | `/product/internal-components/` (ListView, NestedListView, SimpleListView, ListItemActionMenu) | No. The 2026-09-26 audit records "List / structured list: missing" (FL PR CB MU AD CK); not in Candidates |
| Bulk actions bar | Appears while rows are selected: the count of what is selected, actions on it, and focus returning where it was | `DataTable.docs.json:151` (`renderBulkActions`), `Table.BulkActions` (`getSelectedCountLabel`, `onFocusReturn`) | Partly. DataGrid covers selection, and the 2026-09-26 audit lists "Action bar (bulk-selection bar): missing", but it is not in Candidates |
| Settings group | Builds a settings page: rows of a title, a description and the control, grouped and divided | `/product/internal-components/` (ControlGroup) | No. Panel rows act on a selection; this is a page of preferences |
| Inline autocomplete | Suggestions for the word at the caret in any textarea or input (@mention, #ref, :emoji:) | `/product/internal-components/` (InlineAutocomplete, EmojiAutocomplete) | Partly. Composer menu does @ and / in the composer only; Notion parts lists an Emoji picker |
| Live region | `AriaStatus` and `AriaAlert`, plus `announce()` and `announceFromElement()` from one shared `<live-region>` element | `src/live-region/AriaStatus.docs.json`, `AriaAlert.docs.json`; `contributor-docs/adrs/adr-020-live-regions.md:43-70` | No (see section 4) |
| Responsive visibility | Shows or hides children by viewport range (`when`: narrow, regular or wide, or several) | `Hidden.docs.json` | No (see section 4) |
| Branch name | A monospace identifier that is also a link | `BranchName.docs.json` (`as` default `"a"`) | No (low; Code + Link) |
| Lifecycle labels | "Private preview", "Public preview", "General availability", "Closing down", with a "Give feedback" link | `/product/ui-patterns/feature-onboarding/`; internal LifecycleLabels | No (low; a Badge composition) |
| Page layout and split page layout | Header, content, pane, sidebar and footer regions. A pane can be `resizable` with `widthStorageKey`, `sticky` with `offsetHeader`, at a responsive `position`, with `divider` none, line or filled (narrow); a sidebar can go full screen on narrow screens; `minWidth` 256 | `src/PageLayout/PageLayout.tsx:520,538,550`; `PageLayout.docs.json`; `SplitPageLayout.docs.json` | Yes (App-shell layout). Primer adds the persisted width and the narrow behaviour |
| Markdown editor | A textarea for Markdown with its toolbar and view switch | `/product/internal-components/` | Yes (Content tools: rich text) |
| Drag and drop | Reorders by dragging, with a Move dialog for the keyboard | `/product/internal-components/` (DragAndDrop) | Yes (Rating, drag handle, reorder). Primer adds the keyboard Move dialog |
| Chart card | An accessible chart in a card | `/product/internal-components/` (ChartCard) | Yes (Chart) |
| Global header | The site's top bar | `Header.docs.json` | Yes (App-shell layout, with Titlebar) |

## 4. System practices

Only practices that `system-gaps-2026-11-06/README.md` does not already record. That README already covers DTCG
tokens, composite motion tokens, the MCP server, token lint, per-platform status, props tables, the page template, a
patterns layer in general, target size, axe, RTL, and DOM and screenshot tests.

| Practice | Evidence | What Area does today |
|---|---|---|
| **One slot vocabulary**: `leadingVisual`, `trailingVisual` and `trailingAction`, as props or as subcomponents, on every row-, field- and control-shaped component | Census of the `docs.json` files: leadingVisual on 13 (Button, TextInput, Token, Banner, InlineMessage, SegmentedControl.Button, UnderlineNav.Item, ActionBar.Button, ActionList, NavList, TreeView, PageHeader, FormControl); trailingVisual on 6; trailingAction on 5 | 9 names for the same slots: `icon` (about 30 files), `leadingIcon` (Input, Search field), `leadingVisual` (forms.tsx), `trailingIcon` (Button, Input, Chip), `trailing` (Nav, Number field, Tree view, Tabs items), `end` (Titlebar), `prefix`/`suffix` (Input), `action`/`actions`, `picture` (Nav). System-gaps fixed the dismiss names (C4), not these |
| **`inactive` is not `disabled`**, with an order for deciding. If removing the control wouldn't disorient, don't render it. If it would and the control responds to hover or click, make it inactive (with `inactiveText`). Otherwise disable it. Never disable a control because of an availability problem | `src/Button/types.ts:46-50`; `src/ActionList/shared.ts:50-53`; `/product/ui-patterns/degraded-experiences/` | No inactive state. Property list's `inactive` means a hidden property, a different job |
| **Degraded experiences** as a pattern: show an error page only when the primary content fails; otherwise a page banner (`warning` by default), at most 5 outage messages a page; replace a failed panel with a Blankslate whose alert icon is in muted ink; never show a user's own content as empty ("say it's unavailable"); hide a count or activity dot whose data is missing; never print placeholder output such as "undefined of undefined" | `/product/ui-patterns/degraded-experiences/` | WRITING.md covers empty, loading and notices, not partial failure. Empty state has no error use |
| **A ladder of loading times**: under 1 s, nothing; 1–3 s, indeterminate; 3–10 s, determinate if possible; over 10 s, determinate and moved to the background. One announcement for a group of skeletons; `aria-busy` while a region updates; the button that started the work is not `aria-disabled`. Animated indicators are kept under reduced motion | `/product/ui-patterns/loading/`; Spinner `delay` 300 and 1000 ms (`src/Spinner/Spinner.tsx:27`) | WRITING.md: "a Spinner or Skeleton is enough under a second", the opposite threshold. Spinner and Skeleton have no delay. MOTION.md's reduced-motion contract stops loops; Primer keeps subtle indicators animating |
| **One live-region service**: a shared `<live-region>` element with `announce()` and `announceFromElement()`, `AriaStatus` and `AriaAlert`, and lint against raw `aria-live`. Form validation must not use live regions | `contributor-docs/adrs/adr-020-live-regions.md:43-70`; `@primer/live-region-element` ^0.8.1 in `packages/react/package.json:81`; forms pattern: "Do not use live regions for form validation" | 12 hand-written regions in 10 files (Toaster ×2, Color picker ×2, Copy button, Combobox, Command palette, Tag picker, Pagination, Property list, File upload, Calendar). No shared announcer, and no rule on polite or assertive |
| **Responsive values on props.** Named ranges: narrow < 768, regular ≥ 768, wide ≥ 1400. Breakpoints: 320, 544, 768, 1012, 1280, 1400. A prop takes `{narrow, regular, wide}`, set through `data-*` attributes and CSS rather than JS so server rendering doesn't shift (ADR-018). Narrow screens get rules: split list and detail into pages, show a pane as a bottom sheet, or stack. The minimum viewport is 320 × 256 | `contributor-docs/adrs/adr-018-responsive-values.md`; `/product/getting-started/foundations/layout/`; `/foundations/responsive/`; responsive props on about 15 components (Stack, Dialog `position`, SegmentedControl `variant`, PageHeader `hidden`, AnchoredOverlay `variant`, Avatar `size`, Pagination `showPages`, PageLayout, SplitPageLayout, UnderlineNav, SelectPanel, Hidden) | No breakpoint vocabulary in DESIGN_SYSTEM, THEMING, GOVERNANCE or PRODUCT_UI; 9 `@media`/`@container` rules in packages/styles; no responsive prop. System-gaps lists "responsive" only as a missing docs section |
| **Saving pattern.** Explicit saving is the default for forms. Imperative controls save at once (Switch, Segmented, a single-select custom dropdown); declarative ones save explicitly (text, checkbox and radio groups, native select, multi-select with Save and Cancel). Never mix the two in one form. Keep Save enabled. One save per form. Save at the bottom left on a page and the bottom right in a dialog. Optionally warn on `beforeunload` | `/product/ui-patterns/saving/` | None in WRITING.md, PRODUCT_UI.md or area-ui-compose (searched: autosave, explicit save, save button) |
| **Form validation contract.** Validate on submit by default, then inline. With 3 or more errors, a focused Banner summary at the top with anchor links to each field; otherwise focus the first invalid field. `aria-invalid` and `aria-describedby`; one message per group of inputs; Primer's messages rather than the browser's; disabled submit buttons discouraged | `/product/ui-patterns/forms/` | WRITING.md: "validate on leave or on submit", "a form's summary above the form". The Form validation summary candidate lacks its "behaviour contract", and this supplies it |
| **Toasts discouraged** on accessibility grounds: screen magnification, banner blindness, auto-dismissal. A Banner for failures, complex successes and long tasks; a Dialog to interrupt; inline validation; nothing for a success the page already shows. A long action in a Dialog keeps it open and shows a Banner inside | `/accessibility/patterns/accessible-notifications-and-messages/`; saving page: "avoid toasts because of known accessibility issues"; `/product/ui-patterns/notification-messaging/` | Toast is complete, and WRITING.md routes background failures and Undo to it. A tension to decide on, not a gap: Area's Toaster already pauses on hover and focus and has a hotkey |
| **Truncation accessibility.** Don't truncate text that contains links, buttons or mentions. Tooltips are rarely the right way to show the whole text, because hover misses keyboard and speech users. Keep the full string in the DOM | `/accessibility/patterns/truncation/` | WRITING.md: "A truncated name shows whole in a tooltip", which this contradicts. No Truncate primitive |
| **An accessibility review date per component**, machine-readable (`"a11yReviewed": "2025-01-08"`) in the same file as its props, status and stories | 67 of 80 `docs.json` files have `a11yReviewed` (e.g. `src/Button/Button.docs.json:5`) | component-status.mjs records only the owner's completion; no accessibility field (0 matches) |
| **Behaviour hooks are public**: useFocusZone (roving focus), useFocusTrap, useAnchoredPosition, useOnOutsideClick, useOnEscapePress, useOverlay, useOpenAndCloseFocus, useConfirm, useResponsiveValue, useResizeObserver, useIsMacOS; experimental headless Tabs hooks (useTabs, useTabList, useTabPanel) | `src/index.ts:41-56`; `src/hooks/index.ts:1-20`; `src/experimental/Tabs/Tabs.tsx:11-15` | `packages/react/src/index.ts` exports one hook (`useToaster`). The overlay and roving-focus logic in `Overlays.tsx` and `overlay.ts` is private |
| **Development warnings and prop deprecation.** Dev-only checks sit in `__DEV__` blocks and are stripped in production (ADR-012). A deprecated prop gets the TS `@deprecated` tag, a docs mark and an ESLint rule with an autofix (ADR-019) | `contributor-docs/adrs/adr-012-development-warnings.md:24-38`; `adr-019-deprecating-props.md:38-46` | `@deprecated` tags exist (e.g. Tabs `tabs`, Segmented `options`), but `packages/react/src` has 0 `console.warn` or `NODE_ENV` checks, and nothing lints deprecated props |
| **An experimental entry point.** Components whose API isn't settled ship from `@primer/react/experimental` (ADR-007, ADR-010), so stable imports never change under consumers | `src/experimental/index.ts`; `contributor-docs/adrs/adr-007-experimental-components.md` | One entry point; maturity is only in the status registry. System-gaps C3 added a deprecated stage, not an experimental one |
| **Design-tool links per component**: Figma Code Connect files beside the source | 51 `*.figma.tsx` files in `src` (e.g. `src/ActionList/ActionList.figma.tsx`) | None. Extends system-gaps' "no design-tool export" from tokens to components |
| **Stories in tiers per component**: default, features (one story per prop value), examples, dev, stress; type-contract tests | 85 `*.features.stories.tsx`, 42 `*.types.test.tsx`; e.g. `src/ActionList/ActionList.stress.dev.stories.tsx` | Gallery tiles and specimens, no stress or type-contract tier (no `*.types.test.*` in packages) |
| **Scenario patterns**: pages by the user's task (copy, create, customize, delegate, delete, edit, filter, search, view), beside the UI patterns | `/product/scenario-patterns/` | area-ui-compose's recipes are by screen (chat, document, settings…), not by task |
| **An accessibility annotation toolkit** for hand-off: annotations for buttons, form elements, headings, landmarks, links, lists, media, metadata, ordering, flow lines, tables, system feedback, user interactions and mobile, with Primer presets | `/accessibility/annotation-toolkit/` (16 tutorial pages) | Specs and usage entries carry ARIA and keys in prose; composed screens have no annotation layer |
| **Limits for feature onboarding**: at most 2 alerts at a time and one teaching bubble; about 160 characters; "OK, got it" as the default dismissal; a dismissal is remembered; no unmonitored preview over 2 months | `/product/ui-patterns/feature-onboarding/` | Popover has a tour `step` part, with no rules for its use |
| **Stable selectors** (`data-component` on roots and parts, ADR-023) | `contributor-docs/adrs/adr-023-stable-selectors-api.md:58-112` | Area has this already: its BEM classes (`area-x__part`) are public and documented. No action |

## Top findings by value

1. **Inactive state**: Button, Menu and Nav, and the degraded-experiences pattern behind it.
2. **Loading-time ladder and `delay`** on Spinner and Skeleton. WRITING.md's under-a-second rule says the opposite.
3. **One live-region service**, replacing 12 hand-written regions.
4. **Responsive values and breakpoints**: narrow, regular, wide.
5. **Overflow into a menu** for Tabs, Breadcrumb and Segmented (`dropdown`, `hideLabels`).
6. **Slot vocabulary**: leadingVisual, trailingVisual, trailingAction.
7. **SelectPanel's jobs on Custom select**: filter, Save and Cancel, selected first, select all, messages.
8. **Tree view branches that load later**, with an error and retry.
9. **Table**: sort headers, row groups, skeleton rows, pagination slot, bulk actions.
10. **Page header** as a component.
