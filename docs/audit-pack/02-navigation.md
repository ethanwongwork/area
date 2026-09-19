# 02 Navigation

> **v2 note.** This file is the capability checklist (variants, anatomy, behaviour, demos). It is not a source for sizes, padding, radius or shape: those come only from `construction/02-navigation.md`. Any px value still written below is illustrative and loses to the construction file.


Tabs, Menu (dropdown, context, menubar), Breadcrumbs, Pagination, Stepper, Tree, Command menu.
Nav is already complete; its gap check is in file 07.

---

## Tabs

**Job:** switch between sibling panels of content in the same context (true tabs), or
between sibling pages that share a header (tab-styled navigation). These are two
semantics with one look; build both and keep them named apart.
**Aliases:** TabList (FLU), UnderlinePanels = tabs and UnderlineNav = nav links (PRI),
TabNav (PRI, boxed), SubNav (PRI, pill links), Tabs (SHA, GEI, M3, CAR, ATL, MUI), Tab bar (HIG).

### Anatomy

```
 horizontal, line variant
 ┌list──────────────────────────────────────────────────────────────────┐
 │  [icon] Overview    [icon] Activity (12)    Settings     More v   +  │ <- end slot: overflow, add, actions
 │  ━━━━━━━━━━━━━━━                                                     │ <- indicator (one element, slides)
 ├──────────────────────────────────────────────────────────────────────┤ <- list baseline rule (1px)
 │ panel                                                                │
 └──────────────────────────────────────────────────────────────────────┘
 parts: root, list, tab, tab-icon, tab-label, tab-secondary-label?, tab-count?, tab-close?,
        indicator, scroll-button-start / end, overflow-menu, end-slot, panel
```

Alignment: indicator sits **on** the list's baseline rule (overlapping it, not above it).
Line variant: tab inline padding belongs to the tab, but the indicator spans either the
full tab (M3 secondary, CAR, PRI) or only the content width (M3 primary, FLU). Expose as
`indicator=full|content`. First tab's text aligns to the page gutter: in `flush` mode the
list gets a negative inline margin equal to tab inline padding (PRI `variant=flush`).

### Build list

| Axis | Value | Looks like / aligns | Sources |
| --- | --- | --- | --- |
| variant | `line` (default) | Transparent tabs, 2px indicator under selected, 1px baseline rule. Selected text strong, others muted | PRI GEI SHA(line) FLU(transparent) M3 CAR(line) ATL MUI |
| variant | `soft` / pill | Selected tab gets soft fill, no rule. Hover = faint fill | FLU(subtle) PRI(SubNav) |
| variant | `segmented` | Muted container + raised thumb. Same paint as Segmented but with `tablist` semantics and panels | SHA(default) |
| variant | `solid` pill | Selected tab = solid tone pill, unselected = ghost or outline pills | FLU(filled-circular, subtle-circular) GEI(secondary) |
| variant | `contained` | Tabs are filled blocks on a darker strip; selected matches panel surface and has a 2px top indicator; panel attaches with no gap | CAR(contained) |
| variant | `boxed` / folder | Selected tab has 1px border on top, left, right with top radius, its bottom border removed so it opens into the panel | PRI(TabNav) |
| variant | `plain` | No indicator; selected = strong text only (panel headers) | FIG NOT |
| size | sm / md / lg | see geometry | FLU(3) CAR SHA(1) |
| orientation | horizontal; vertical (indicator on inline-start or inline-end edge, labels start-aligned, list fixed width 160-240) | | FLU SHA CAR MUI |
| layout | `inline` (hug); `block` equal widths; `centered`; `flush` | | MUI(fullWidth, centered) CAR(fullWidth) PRI(flush, inset) M3(fixed) |
| overflow | `scroll`: horizontal scroll, hidden scrollbar, edge fades, optional chevron scroll buttons that appear only when clipped | | M3(scrollable) MUI CAR |
| overflow | `menu`: tabs that do not fit collapse into a trailing "More" menu; selected tab is always kept visible by swapping | | PRI(UnderlineNav) FLU(Overflow) NOT("N more") |
| overflow | `wrap` to multiple rows (rare, soft variant only) | | FLU |
| content | label; icon + label inline; icon **stacked above** label; icon-only with tooltip; label + count; label + status dot; two-line (label + secondary label) | stacked raises list height about 16px | M3(stacked) MUI(iconPosition top, start, end, bottom) CAR(secondaryLabel, icon-only) PRI(counter, leadingVisual) FLU(iconOnly) |
| content | `loadingCounters`: counts render as skeleton pills until data arrives | fixed 20px wide placeholder | PRI |
| content | responsive `hideIconsBreakpoint` | | PRI |
| function | closable tab: trailing close icon button, visible on hover / focus / selected; middle-click closes; Delete key closes | close target 16-20 inside tab padding | CAR(dismissable) browser / editor pattern |
| function | add tab: trailing "+" icon button after the last tab | | NOT browser pattern |
| function | reorder by drag; keyboard alternative Ctrl/Cmd+Shift+Arrow | extended | editor pattern |
| function | end slot actions (filter, sort, view options) pinned inline-end on the same baseline | | PRI(SubNav actions) NOT |
| activation | `automatic` (focus selects) and `manual` (Enter / Space selects) | | PRI FLU(selectTabOnFocus) CAR |
| semantics | `tabs` (tablist / tab / tabpanel) vs `nav` (nav > ul > a with `aria-current="page"`) | same CSS, different markup; nav has no arrow-key roving | PRI |
| panel | keep-mounted vs unmount-on-hide; panel padding none / default; panel focusable when it has no focusable child | | SHA |
| state | tab: rest, hover, active, focus-visible (inset ring), selected, selected+hover, disabled, disabled-focusable | | all |
| width stability | `reserveSelectedTabSpace` so bold selected labels do not shift | | FLU |

### Geometry

Superseded. The numbers that used to be here were partly recalled. Use the measured table, consensus and Area decision in `construction/02-navigation.md`; if the component is marked seed or missing there, run the construction step in `00-START-HERE.md` first.

### Reference markup

```html
<div class="area-tabs area-tabs--line area-tabs--md area-tabs--horizontal">
  <div class="area-tabs__list" role="tablist" aria-label="Project">
    <button class="area-tabs__tab" role="tab" id="t1" aria-selected="true" aria-controls="p1">
      <svg class="area-tabs__icon" aria-hidden="true">…</svg>
      <span class="area-tabs__label" data-label="Overview">Overview</span>
    </button>
    <button class="area-tabs__tab" role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1">
      <span class="area-tabs__label" data-label="Activity">Activity</span>
      <span class="area-badge area-badge--counter">12</span>
    </button>
    <span class="area-tabs__indicator" aria-hidden="true"></span>
  </div>
  <div class="area-tabs__panel" role="tabpanel" id="p1" aria-labelledby="t1" tabindex="0">…</div>
</div>
```

Indicator: one element, `translate` + `inline-size` from the selected tab's
`offsetLeft` / `offsetWidth` (or CSS anchor positioning: `position-anchor` on the
selected tab, where supported, with the JS path as fallback). CSS-only fallback paints
`box-shadow: inset 0 -2px` on `[aria-selected=true]`.

### Behaviour

Roving tabindex. Left / Right (Up / Down when vertical), Home / End, wrap around. Tab key
moves from the selected tab into the panel. Disabled tabs are skipped unless
disabled-focusable. Delete closes a closable tab and moves selection to the next, else
previous. Overflow menu items are `menuitemradio`; choosing one selects that tab.

### Separate

Segmented (no panels), Nav (site-level), Stepper (ordered), Accordion (the vertical
mobile fallback for tabs).

### Demo list

1 default line with 3 tabs and real panels. 2 all variants stacked. 3 sizes. 4 icons
inline. 5 icons stacked. 6 icon-only. 7 counts + loading counters. 8 two-line contained.
9 vertical line and vertical soft. 10 block / centered / flush. 11 overflow scroll with
fades and buttons. 12 overflow menu in a resizable container. 13 closable + add.
14 end-slot actions. 15 manual activation. 16 nav semantics with `aria-current`.
17 states. 18 in-context: page header + tabs + table; settings dialog with vertical tabs.
19 stress RTL, long labels, 200% zoom.

### Pitfalls

Indicator floating above the rule with a gap. `border-bottom` on each tab so the indicator
cannot animate. All tabs in the tab order. Panel missing `tabindex="0"` when it has no
focusable content. Counts implemented as plain text. Bold-on-select width jump.

---

## Menu

**Job:** a transient list of actions or option toggles for a trigger or a context.
**Aliases:** DropdownMenu, ContextMenu, Menubar (SHA); ActionMenu + ActionList (PRI);
Menu (OAI, FLU, GEI, M3, MUI); Dropdown menu (ATL); OverflowMenu (CAR); pull-down and
context menus (HIG).

### Anatomy

```
 ┌menu (surface, radius, shadow step 2, padding = gutter)──────────────┐
 │ ┌header? (search field or title)─────────────────────────────────┐  │
 │ GROUP HEADING                                        aux text     │
 │ [chk] [icon]  Label                         [trail]   ⌘K      >   │ <- item
 │               Description (block) ...                             │
 │ ──────────────── separator (bleeds to menu edge) ───────────────  │
 │ [ o ] [icon]  Radio item                                          │
 │ [sw ]         Toggle item                              (switch)   │
 │ ┌footer? (hint text, "Last edited by ...")───────────────────────┐ │
 └────────────────────────────────────────────────────────────────────┘
 item columns, in order: selection-indicator | leading-visual | text (label + description)
                         | trailing-visual | shortcut | submenu-caret
```

Column alignment is the thing generated menus get wrong. Rule: if **any** item in a menu
(or group, configurable) has a selection indicator, **every** item reserves that column;
same for the leading-visual column (FLU: `hasCheckmarks`, `hasIcons`). Shortcuts are
end-aligned in their own column with tabular spacing, muted, using Kbd's plain variant.
Separators bleed through the menu's gutter to its edges (OAI: negative inline margin
equal to gutter).

### Build list

| Axis | Value | Looks like / aligns | Sources |
| --- | --- | --- | --- |
| type | dropdown (button trigger) | anchored to trigger, default `bottom-start` | all |
| type | context menu (`openOnContext`): right-click, long-press, Shift+F10 / Menu key; positions at pointer | | SHA FLU GEI HIG |
| type | menubar: horizontal bar of triggers; hovering a neighbour while one is open switches menus; Left / Right moves across menus | | SHA HIG |
| type | submenu, any depth; opens on hover after about 100-200ms and on Right arrow; safe-triangle pointer grace area | side offset -4 so it overlaps the parent edge slightly | OAI SHA FLU ATL M3 |
| type | `inline` (rendered in flow, no portal) | | FLU |
| type | sheet on narrow viewports: menu becomes a bottom sheet with larger items | | PRI(narrow fullscreen) HIG |
| item | action (button), link (anchor; external icon trailing), checkbox item, radio group + radio item, switch item (trailing Switch, menu stays open), submenu trigger, split item (primary action + separate submenu caret zone) | | OAI(Item, Link, CheckboxItem, RadioGroup) SHA FLU(MenuSplitGroup) NOT(switch) |
| item | tone `neutral`, `danger` (text + icon danger; hover fill danger-soft) | | PRI SHA(destructive) GEI(error) OAI HIG |
| item | size md; lg (more block padding, for touch and two-line) | | PRI(medium, large) |
| item | description `inline` (same line, muted, after label) or `block` (second line); `truncate` | | PRI ATL |
| item | leading visual: icon 16, avatar 20, colour swatch, emoji; trailing visual: icon, badge, counter, text value ("English") | | PRI ATL M3 GEI(prefix, suffix) |
| item | shortcut hint | | SHA(Shortcut) M3 FIG NOT |
| item | selection: single (check or radio dot), multiple (checkbox); `indicatorPosition=start|end` | | PRI(selectionVariant) OAI(indicatorPosition) HIG(start) |
| item | `inset`: aligns a no-icon item's text with icon items when columns are not auto-reserved | | SHA |
| item | states: rest, highlighted (hover **or** keyboard, same paint, only one at a time), active, selected, disabled, `inactive` with reason (focusable, warning icon, tooltip text), loading (spinner in leading column), `locked` (trailing lock icon) | | PRI(inactiveText, loading) GEI(locked) ATL(isLoading) |
| structure | group with heading; heading variant `subtle` (text only) or `filled` (full-bleed muted band); auxiliary text at heading end; separators; `showDividers` between every item | | PRI ATL SHA(Label) |
| structure | header slot: search / filter input (turns it into a filterable list; build on Combobox listbox contract), title with back button for drill-in pages | | NOT PRI(SelectPanel) |
| structure | footer slot: hint, secondary action, meta text | | NOT PRI |
| structure | empty and loading content states (skeleton rows, "No results") | | PRI ATL |
| surface | width: `auto`, fixed token, `min-width` = trigger width (`matchTrigger`); `max-height` with internal scroll and sticky group headings; scroll fades | | OAI(width, minWidth, maxHeight) |
| surface | variant `default`, `translucent` (backdrop blur), `inverted` (dark menu on light UI) | | OAI(Popover translucent) FIG(dark) HIG |
| placement | side top / right / bottom / left x align start / center / end, side and align offsets, collision flip and shift, `closeOnScroll` | | OAI SHA FLU PRI |
| behaviour | `persistOnItemClick` for checkbox, radio, switch items; `openOnHover` with `hoverDelay`; `modal` (traps outside interaction) vs non-modal | | FLU OAI(modal) |
| trigger | any Button variant; icon button "more" (kebab / meatball); caret auto-added via the `--caret` boolean modifier; split button trigger; avatar trigger | trigger gets `data-state=open` pressed paint | GEI ATL PRI |

### Geometry

Superseded. The numbers that used to be here were partly recalled. Use the measured table, consensus and Area decision in `construction/02-navigation.md`; if the component is marked seed or missing there, run the construction step in `00-START-HERE.md` first.

### Reference markup

```html
<button class="area-button" aria-haspopup="menu" aria-expanded="true" aria-controls="m1">Options</button>
<div class="area-menu area-menu--has-indicators area-menu--has-icons" id="m1" role="menu" popover>
  <div class="area-menu__group" role="group" aria-labelledby="g1">
    <div class="area-menu__heading" id="g1">View</div>
    <button class="area-menu__item" role="menuitemcheckbox" aria-checked="true">
      <span class="area-menu__indicator" aria-hidden="true">✓</span>
      <svg class="area-menu__leading" aria-hidden="true">…</svg>
      <span class="area-menu__text"><span class="area-menu__label">Show sidebar</span></span>
      <kbd class="area-menu__shortcut area-kbd area-kbd--quiet">⌘\</kbd>
    </button>
  </div>
  <div class="area-menu__separator" role="separator"></div>
  <button class="area-menu__item area-menu__item--danger" role="menuitem">…Delete project…</button>
</div>
```

```css
.area-menu__item { display: grid; align-items: center; column-gap: var(--area-menu-item-gap);
  grid-template-columns: [ind] var(--_ind, 0) [lead] var(--_lead, 0) [text] 1fr [trail] auto [short] auto [caret] auto; }
.area-menu--has-indicators { --_ind: 16px; }
.area-menu--has-icons      { --_lead: 16px; }
.area-menu__item > .area-menu__text { grid-column: text; min-inline-size: 0; }
.area-menu__separator { block-size: 1px; margin: var(--_gutter) calc(-1 * var(--_gutter)); }
```

When a column variable is 0 the column-gap still applies; zero it with
`column-gap: 0` plus `margin-inline-end` on present cells, or switch template by attribute.

### Behaviour

Open: click, Enter, Space, Down (focus first), Up (focus last). Inside: Up / Down with
wrap, Home / End, type-ahead by first characters, Right opens submenu, Left closes it, Esc
closes one level and returns focus to the trigger, Tab closes the whole menu (OAI: Tab
does not advance focus inside). Only one highlighted item: pointer move sets
highlight and moves focus with `preventScroll`. Checkbox, radio, switch items keep the menu
open when `persistOnItemClick`. Use the `popover` attribute and CSS anchor positioning
where available; keep a JS positioning fallback.

### Separate

Select and Combobox (value pickers), Popover (arbitrary content), Command menu
(search-first), Nav, Select panel (filterable multi-select with footer: PRI SelectPanel,
build as `area-select-panel` on top of Menu surface + Combobox listbox).

### Demo list

1 default actions with icons and shortcuts. 2 groups with headings (subtle, filled) and
separators. 3 checkbox items. 4 radio group with indicator start / end. 5 switch items.
6 danger item last after a separator. 7 descriptions inline / block. 8 leading avatars,
trailing values. 9 submenu two levels. 10 split item. 11 inactive with reason, loading,
locked. 12 link items. 13 context menu on a card. 14 menubar (File Edit View). 15 header
search + footer. 16 empty and loading. 17 max-height scroll with sticky headings.
18 widths auto / matchTrigger / fixed. 19 placements grid. 20 triggers: button with caret,
icon "more", avatar. 21 translucent and inverted surfaces. 22 narrow-viewport sheet.
23 stress: RTL (caret flips, submenu opens to the left), long labels truncating.

### Pitfalls

Text columns ragged because icon / check columns are not reserved. Hover and keyboard
highlight both visible at once. Separator not bleeding. Submenu closes when the pointer
crosses diagonally. Item radius equal to menu radius. Danger item placed first.
Focus not returned to the trigger on close.

---

## Breadcrumbs

**Job:** show where the current page sits in a hierarchy and let people go up.

```
 [icon] Workspace  /  Projects  /  …  /  Area  /  Components      (current, not a link)
 parts: root (nav), list (ol), item, link, separator (aria-hidden), current, ellipsis-menu-button, item-icon
```

| Axis | Value | Looks like / aligns | Sources |
| --- | --- | --- | --- |
| separator | `/` (default), chevron, custom node; separator colour muted, inline margin 4-8 | | SHA MUI PRI CAR |
| size | sm / md / lg (text and gap step) | | FLU(3) CAR(sm, md) |
| overflow | `wrap`; `menu` (middle items collapse into "…" button opening a Menu); `menu-with-root` (root stays, rest collapses); `maxItems` + `itemsBeforeCollapse` + `itemsAfterCollapse` | | PRI MUI SHA(ellipsis + dropdown) FLU |
| overflow | per-item truncation with max-width (about 160-200) + tooltip; only the current item may grow | | NOT ATL |
| overflow | narrow: show only parent as a back link "‹ Projects" | | PRI(PageHeader ParentLink) HIG |
| content | text; icon + text; icon-only root (home); page emoji / icon per crumb | | FLU NOT |
| item | link, button, dropdown crumb (crumb with caret listing siblings) | | SHA NOT |
| current | plain strong text `aria-current="page"`; option to render current as link; option to omit trailing current (`noTrailingSlash` inverse) | | CAR PRI |
| variant | plain links (muted, hover strong + underline) or ghost-button crumbs (padded, hover fill; FLU `BreadcrumbButton`) | | FLU NOT |
| state | rest, hover, focus-visible, current, disabled | | |

Markup: `nav[aria-label=Breadcrumb] > ol > li > a`, separators are CSS `::before` on
`li + li` or `aria-hidden` elements. Demos: default; separators; sizes; icons; ghost-button
crumbs; overflow menu; menu-with-root; truncation; dropdown crumb; in a page header above
the title; narrow back-link; RTL (chevrons flip).

---

## Pagination

**Job:** move through pages of a collection.

| Axis | Value | Looks like / aligns | Sources |
| --- | --- | --- | --- |
| type | numbered: prev, 1, …, 4 **5** 6, …, 20, next; `siblingCount` / `surroundingPageCount`, `boundaryCount` / `marginPageCount`; ellipsis is not focusable, or is a button opening a jump popover | every page cell is the same square so the bar width is stable; reserve 7 or 9 cells | PRI SHA MUI CAR(PaginationNav) |
| type | simple: prev / next only, with text labels "Previous" / "Next" | | SHA PRI(showPages false) |
| type | compact: `‹  3 / 12  ›` | tabular numerals | MUI(mobile) ATL |
| type | table footer: "Rows per page [25 v]   1-25 of 312   ‹ ›" optionally + page select "Page [3 v] of 13" | left cluster start-aligned, right cluster end-aligned, all on control sm | CAR MUI(TablePagination) PRI(Table.Pagination) |
| type | doc footer: two large link cards, "Previous" / "Next" eyebrow over page title, arrows at outer edges | | GEI |
| type | load more button / infinite sentinel with spinner; shows "Showing 50 of 312" | | product pattern |
| type | cursor-based (unknown total): prev / next only, no numbers, `totalItems` unknown text "1-25 of many" | | CAR(pagesUnknown) |
| controls | first / last buttons; hide prev / next; prev / next as icon-only or icon + text | | MUI |
| variant | ghost (default; current = soft), outline (each cell bordered; current = solid or strong stroke), solid current | | MUI(text, outlined) SHA |
| shape | rounded, pill / circular | | MUI |
| size | sm / md / lg | | MUI CAR |
| responsive | `showPages` per breakpoint: collapse numbered to simple on narrow | | PRI |
| state | cell: rest, hover, focus-visible, current (`aria-current="page"`), disabled (prev on page 1) | | |

Markup: `nav[aria-label=Pagination] > ul > li > a|button`. Links when pages have URLs
(`hrefBuilder`), buttons otherwise. Announce page changes from the collection's live
region, not from the pagination. Demos: each type; variants; shapes; sizes; with first / last;
20 pages at positions 1, 5, 20 to show ellipsis logic; in a table footer; narrow collapse.

---

## Stepper

**Job:** show progress through an ordered set of steps; optionally navigate between them.
**Aliases:** Progress indicator (CAR), Progress tracker (ATL), Stepper (MUI), Steps.
Atlas note: `Progress indicator / Tracker` in the Feedback category is this component.

```
 horizontal, label-below                        vertical with content
  (✓)━━━━━━━(2)─ ─ ─ ─(3)─ ─ ─ ─(4)             (✓) Account
 Account   Workspace   Invite    Done             │    Created 12 Sep
           Optional                              (2) Workspace          <- current, expanded
                                                  │    [ form content ]
                                                 (3) Invite team
 parts: root (ol), step (li), indicator (number | check | icon | dot | error), connector,
        label, secondary-label (optional / description / error text), content (vertical only)
```

| Axis | Value | Sources |
| --- | --- | --- |
| orientation | horizontal; vertical; vertical with collapsible per-step content | MUI CAR |
| label placement | inline-end of indicator; below indicator centred (`alternativeLabel`) | MUI CAR |
| indicator | number, check when complete, custom icon, dot only (compact), error icon, progress ring for a partly complete step | MUI CAR ATL |
| step status | incomplete, current, complete, error / invalid, disabled, skipped, optional | CAR MUI |
| connector | solid complete, muted or dashed incomplete; partial-fill for current | MUI CAR |
| spacing | comfortable / cosy / compact; `spaceEqually` (equal flex) vs hug | ATL CAR |
| interaction | static; visited steps are links; non-linear (all steps clickable) | ATL MUI |
| compact forms | text "Step 2 of 4"; dots (page control); thin segmented progress bar | MUI(MobileStepper) HIG(page control) |
| size | sm (indicator 16-20), md (24), lg (32) | CAR |

Semantics: `ol`, current step `aria-current="step"`, status in visually hidden text
("Completed: Account"). Clickable steps are links or buttons inside the `li`.
Demos: default; vertical; label-below; statuses row incl. error and optional; dots;
"Step 2 of 4" text; segmented bar; clickable visited; vertical with content; sizes; in a
dialog header; narrow collapse to text form.

---

## Tree

**Job:** browse and act on a hierarchy (files, layers, pages, outline).

```
 v [dir] components                       (12)  [+] […]   <- trailing: count, hover actions
 │  > [dir] button
 │  v [dir] checkbox
 │  │    [file] checkbox.css        M              <- trailing visual (status)
 │  │    [file] checkbox.tsx   ← current (soft fill, full-row)
 │  │    ░░░░░░░░░░  (loading skeleton rows, `count` of them)
 parts: root (tree), item (treeitem), toggle (chevron), leading-visual, label, trailing-visual,
        actions, indent-guide, subtree (group), selection-control (checkbox | radio), drop-indicator
```

| Axis | Value | Sources |
| --- | --- | --- |
| size / density | sm 24, md 28-32 row height; indent 8-16 per level (PRI 8 + chevron, FLU 24, NOT about 12, FIG about 16) | PRI FLU(small, medium) CAR(xs, sm) |
| appearance | `subtle` (hover fill), `subtle-alpha`, `transparent` | FLU |
| row paint | full-bleed row highlight (VS Code, FIG) vs inset rounded row (NOT, PRI); indent never shrinks the highlight | PRI NOT FIG |
| indent guides | none; always; on hover of the tree; active guide highlighted for the current item's parent | PRI(hover) editor pattern |
| toggle | chevron before the icon; or chevron **replaces** the icon on row hover (NOT); leaf items reserve the chevron column so labels align | NOT PRI |
| visuals | leading icon, DirectoryIcon that swaps open / closed, emoji, colour dot, avatar; trailing icon / badge / counter / status letter | PRI FLU |
| actions | trailing icon buttons on hover / focus-within (add, more); always-visible option; `secondaryActions` reachable by keyboard shortcut and context menu | PRI FLU(actions, aside) NOT FIG(eye, lock) |
| selection | none (navigation with `current`), single, multiple with Ctrl / Shift, checkbox selection with indeterminate parents, radio | FLU MUI CAR |
| async | SubTree state initial / loading (skeleton rows x `count`) / done / error (inline retry or error dialog) | PRI |
| function | inline rename (F2, double-click); drag and drop reorder / reparent with a drop line and drop-into highlight; filter with match highlighting and auto-expand; expand all / collapse all; `flat` data + virtualisation | MUI FIG NOT FLU(FlatTree) |
| truncation | single-line ellipsis (default) or wrap | PRI(truncate) |
| nav mode | `tree` or `treegrid` (row with multiple focusable cells) | FLU |

Keyboard (WAI-ARIA tree): Up / Down move visible items; Right expands or moves to first
child; Left collapses or moves to parent; Home / End; type-ahead; `*` expands siblings;
Enter activates; Space toggles selection; F2 renames. One tab stop. Set `aria-level`,
`aria-setsize`, `aria-posinset`, `aria-expanded`, `aria-current` or `aria-selected`.

Demos: file tree; sizes; appearances; indent guides; chevron-replaces-icon; hover actions;
counts and status letters; checkbox selection with indeterminate; multi-select; async
loading and error; inline rename; drag reorder; filter; long-label truncation; in a
sidebar panel at 240px; RTL.

---

## Command menu

**Job:** search-first launcher for actions and navigation. **Aliases:** Command (SHA),
Command Menu (GEI), command palette, quick switcher, quick find (NOT), quick actions (FIG).

```
 ┌dialog (top-third of viewport, width about 560-640)─────────────────────┐
 │ [search icon]  Type a command or search…                    [esc]  │ <- input row, 44-52 high, no border, bottom rule
 │ [chip: Projects x]   (scope / filter chips, optional)                │
 ├─────────────────────────────────────────────────────────────────────┤
 │ RECENT                                                               │
 │ [icon]  Open "Component audit"                    Page     ↵         │ <- active row shows action hint
 │ [icon]  Toggle dark mode                                   ⌘⇧L       │
 │ ACTIONS                                                              │
 │ [icon]  New project…                                        ⌘N   >   │ <- ">" drills into a sub-page
 ├─────────────────────────────────────────────────────────────────────┤
 │ ↑↓ navigate   ↵ open   ⌘↵ open in new tab   ⌫ back        [Actions ⌘K]│ <- footer hints
 └─────────────────────────────────────────────────────────────────────┘
```

| Axis | Value | Sources |
| --- | --- | --- |
| container | modal dialog (default); inline / embedded (no dialog, in a popover or page) | SHA(Command, CommandDialog) |
| parts | input, list, group + heading, item, separator, shortcut, empty state, loading state, footer | SHA GEI |
| item content | icon / avatar / emoji; label with match highlighting; description; meta type label ("Page", "Command"); shortcut; drill-in caret; trailing badge | NOT FIG |
| function | fuzzy filter with ranking and keywords; recent items when query is empty; nested pages with breadcrumb chip in the input row and Backspace-to-go-back; scope chips; per-item secondary actions panel (Cmd+K inside); async results with skeleton rows; "Create '<query>'" fallback item | GEI NOT Raycast pattern |
| size | list max-height about 300-400 with scroll; item md 36-40 | SHA |
| state | item: rest, active (keyboard and pointer share one highlight), disabled | |

Semantics: combobox pattern. Input `role="combobox" aria-expanded="true"
aria-controls=list aria-activedescendant=<item>`; list `role="listbox"`, groups
`role="group"` with labelled heading, items `role="option"`. Focus stays in the input.
Open with Cmd / Ctrl+K; Esc clears the query first, then goes back a page, then closes.
Demos: default; with recents; groups; match highlight; nested page; scope chip; footer
hints; empty; loading; create-fallback; inline in a popover; narrow full-screen.
