# Design-system research 2: split-button menu placement, counts, banners

Read 2026-09-27 from shallow sparse clones at the pinned commits plus public docs pages.
Source reading only: nothing was rendered or captured, so every geometry value here is a
source default, not a measurement. Marks: **doc** = documentation page (URL given), **infer**
= my reading of code behaviour that I did not run, **not found** = looked, absent.

## Pinned sources

| Id | Repo | Commit |
|---|---|---|
| fluent | microsoft/fluentui | `8add8c8750c34c85acd811e32ab324abf8f1562e` |
| carbon | carbon-design-system/carbon | `7e8c8f7db6dd2ed98c4947b78b37614f43eda920` |
| primer | primer/react | `67945828439898ace865bd5f7417c562033bcbc2` |
| primitives | primer/primitives | `f48bc063f7bc0fb3e447386a8c259650ce46dea8` |
| pbeh | primer/behaviors | `4b7efaa50a92ba81123b93631a421eb07afac395` |
| polaris | Shopify/polaris | `3f7954ae42fabf26d63cee68c23ceebfd7ef0972` |
| shadcn | shadcn-ui/ui (apps/v4, new-york-v4) | `98a1fe67b439324ddc857f47fbdce056600a4329` |
| rprim | radix-ui/primitives | `f7ecd5ab16f5e1e820eb5786a1419a98a2d594ae` |
| radix | radix-ui/themes | `1faff10ac26ae17f09944d418c6949b93fc6b566` |
| mantine | mantinedev/mantine | `f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4` |
| mantine-ui | mantinedev/ui.mantine.dev | `7bce6d790cf29472862a6bc9cfc68eecc79aedd1` |
| antd | ant-design/ant-design | `e0ea7bb76fdf2a8871b5f3f0eea5e9fd0cd7f485` |
| chakra | chakra-ui/chakra-ui (v3) | `961161428b8c59157ad921dd23303b73c294d73f` |
| zag | chakra-ui/zag (Chakra's menu machine) | `7bff8b77e1a0a865abdaad22890edbfe8424ab5d` |
| spectrum | adobe/react-spectrum (S2) | `16eead67e83cf42f3c0ee46ef6eb7a2032778378` |
| baseui | mui/base-ui | `6d93516df883c4fd912daafa0aea57345ce800ce` |
| ariakit | ariakit/ariakit | `5a2dcdfbfef9dbf0d90963958a494acab5098467` |
| uui | untitleduico/react | `4702dc0ea8d140c3491a85670c7b4fab47b722da` |
| mweb | material-components/material-web | `cbd34a8921915af94d5ef65c2a69eece41d5b4f3` |
| androidx | androidx/androidx (Compose M3) | `dbabe838c8a357bf03201fec1578b61eae88a643` (raw files: `scratchpad/sources/m3-splitsamples.kt`, `m3-menu.kt`) |

Path prefixes: fluent `FR` = `packages/react-components/`; carbon `CR` = `packages/react/src/components/`,
`CS` = `packages/styles/scss/components/`; primer `PR` = `packages/react/src/`; mantine `MT` =
`packages/@mantine/core/src/components/`; shadcn `SH` = `apps/v4/registry/new-york-v4/`; S2 =
`packages/@react-spectrum/s2/src/`; polaris `PL` = `polaris-react/src/components/`.

---

## 1. Split button menu placement

Area today (docs/specs/split-button.md:65, 112-116): menu anchored to the **whole group**,
**4px below**, aligned to the **group's end edge** (icon-only tool splits align to the tool's
start), flips above when there isn't room, and shifts to stay inside the viewport. Evidence is
Notion's split: 3.99 below, 0.33 from the end.

| System | Anchor element | Side | Alignment | Offset | Flip / collision | Source |
|---|---|---|---|---|---|---|
| **Fluent 2** SplitButton + Menu | **Chevron** (`menuButton={triggerProps}`: MenuTrigger's props and ref go to the menu button) | below | Recipe: `positioning="below-end"` → menu end = chevron end = group end. Menu default is `below` + `start` | **0** (offset middleware only when `offset` is set) | flip (unless `pinned`) + shift | `FR/react-button/stories/src/SplitButton/SplitButtonDefault.stories.tsx:13-16`; `FR/react-menu/library/src/components/Menu/useMenu.tsx:113-117`; `FR/react-positioning/library/src/utils/resolvePositioningShorthand.ts:10`; `FR/react-positioning/library/src/usePositioningOptions.ts:157-167` |
| **Carbon** ComboButton | `refs.setReference` is attached to the **container** (merged ref) and to the trigger IconButton. React attaches the parent ref last, so the **group** wins (**infer**) | bottom (`menuAlignment` default `'bottom'`) | floating-ui `bottom` (centred), with **menu width = reference width**, so it spans the group | **0** (no offset middleware) | `flip({crossAxis:false})` + `hide()` | `CR/ComboButton/index.tsx:101,119-131,134-147,198,210`. MenuButton has the same defaults: `CR/MenuButton/index.tsx:107,127-142` |
| **Atlassian** SplitButton | **Chevron** (DropdownMenu trigger is an IconButton) | not found | not found (`placement` default not documented) | not found | `shouldFlip` deprecated; "CSS Anchor Positioning handles flipping natively" | **doc** https://atlassian.design/components/button/split-button/examples, https://atlassian.design/components/dropdown-menu/code |
| **Material 3** SplitButtonLayout (Compose) | **Whole split button** (DropdownMenu is a sibling inside the `Box` that wraps `SplitButtonLayout`) | below | start of the anchor (candidate list begins `startToAnchorStart` / `topToAnchorBottom`) | not found in the fetched file (Compose DropdownMenu `offset` defaults to `DpOffset(0,0)` per its API docs, unverified) | falls back to other candidates, including above (`bottomToAnchorTop`), keeping a 48dp window margin | androidx `SplitButtonSamples.kt:185-188,252`; `internal/MenuPosition.kt:79,115,129,284,361-380` |
| **Primer** ButtonGroup + ActionMenu ("DropdownSplit" story) | **Chevron** (`ActionMenu.Button`) | `outside-bottom` | **`start` of the chevron** (the menu hangs to the right of the group) | **4** (`anchorOffset`) | tries `outside-top`, then right/left; alternative alignment `end`, then `center` | `PR/ButtonGroup/ButtonGroup.features.stories.tsx:100-131`; `PR/ActionMenu/ActionMenu.tsx:279,356-357`; `PR/AnchoredOverlay/AnchoredOverlay.tsx:170-173`; pbeh `src/anchored-position.ts:103-117,292-303` |
| **Polaris** segmented ButtonGroup + Popover | **Chevron** (Popover `activator`) | below (`preferredPosition` default) | `preferredAlignment="right"` = end | **5** (`--pc-popover-visible-portion-of-arrow` margin) | chooses above/below by available space | `polaris.shopify.com/pages/examples/button-split.tsx:21-37`; `PL/PositionedOverlay/PositionedOverlay.tsx:257-258`; `PL/Popover/Popover.module.css:3,8-9`; `PL/PositionedOverlay/utilities/math.ts:25-63` |
| **shadcn** ButtonGroup + DropdownMenu | **Chevron** (`DropdownMenuTrigger asChild` on the chevron Button) | bottom | `align="end"` | **4** (`sideOffset = 4`) | Radix `avoidCollisions` | `SH/examples/button-group-dropdown.tsx:27-35`; `SH/examples/button-group-demo.tsx:54`; `SH/ui/dropdown-menu.tsx:35,42` |
| **Mantine** (Mantine UI SplitButton) | **Chevron** (`Menu.Target` on ActionIcon) | bottom | `position="bottom-end"` | **8** (Popover default) | flip + shift | mantine-ui `lib/SplitButton/SplitButton.tsx:9-22`; `MT/Popover/Popover.tsx:184-187` |
| **Ant Design** Dropdown.Button (deprecated) | **Chevron** (the Dropdown wraps only the right button) | bottom | `bottomRight` (`bottomLeft` in RTL) = end | **4** (`marginXXS` = sizeXXS = 4) | `autoAdjustOverflow = true` | `components/dropdown/dropdown-button.tsx:36,112-116,139-146`; `dropdown/dropdown.tsx:133,272-277`; `theme/util/alias.ts:138`; `theme/themes/shared/genSizeMapToken.ts:15` |
| **Chakra v3** Group + Menu ("button-with-split-menu") | **Chevron** (`Menu.Trigger asChild` on IconButton) | bottom | `placement: "bottom-end"` (menu default `bottom-start`) | **8** (`gutter`) | flip, `overflowPadding` 8 | chakra `apps/compositions/src/examples/button-with-split-menu.tsx:12-21`; zag `packages/machines/menu/src/menu.machine.ts:69-70`; `packages/utilities/popper/src/get-placement.ts:12-22` |
| **Spectrum 2** | no split button (not found in `S2/`). MenuTrigger defaults: | bottom | `start` | **8** (0 for context menus) | `shouldFlip` | `S2/Menu.tsx:852-888` |
| **Radix** DropdownMenu (primitives) | the trigger | bottom | **center** | **0** | `avoidCollisions = true` | rprim `packages/react/popper/src/popper.tsx:186-191` |
| Radix Themes DropdownMenu | the trigger | bottom | `start` | **4** | inherited | radix `packages/radix-ui-themes/src/components/dropdown-menu.tsx:73-74` |
| **Base UI** Menu | the trigger | bottom | **center** | **0** | flips side, no cross-axis fallback (`fallbackAxisSide: 'none'`); `collisionPadding` 5 | baseui `packages/react/src/internals/useAnchorPositioning.ts:145-147`; `menu/positioner/MenuPositioner.tsx:46-53`; `internals/constants.ts:18-20` |
| **Ariakit** Menu | the MenuButton | bottom | `start` (`bottom-start`) | **0** (`gutter` undefined; no arrow) | `flip = true` | ariakit `packages/ariakit-components/src/menu/menu-store.ts:77-78,93-96`; `packages/ariakit-react-components/src/popover/popover.tsx:124-132,254-260` |

**Majority convention for split buttons** (the 10 systems with a split recipe or component):
- **Anchor:** the chevron trigger in 8 (Fluent, Atlassian, Primer, Polaris, shadcn, Mantine,
  Ant, Chakra). The whole group in 2 (Carbon, which also matches the group width; Material 3).
- **Side:** below in every system that specifies one, flipping above when there isn't room.
- **Alignment:** the chevron's **end** in 6 (Fluent, Polaris, shadcn, Mantine, Ant, Chakra).
  The chevron sits at the group's end, so this is the same edge as the group's end. Outliers:
  Primer aligns to the chevron's start (the library default, not a split choice); Carbon spans
  the full group width; M3 aligns to the group's start.
- **Offset:** 0 (Fluent, Carbon), 4 (Primer, shadcn, Ant, Radix Themes), 5 (Polaris), 8
  (Mantine, Chakra, S2). The median and mode among the split recipes is **4**.
- The generic menu primitives mostly default to bottom and start (Fluent, Primer, Ariakit,
  S2, Radix Themes, zag), or bottom and centre (Radix, Base UI). Split recipes override the
  alignment to **end**.

---

## 2. Counts inside other components

Area today: Nav and Tabs counts are plain `<Badge>` (default md, 20px) in a `trailing` slot
(apps/docs/src/demos/gallery.tsx:1442, 1806). Indicator has a `count` kind: attached, 16px,
10/14 500, tabular, 4px sides, danger by default (docs/specs/indicator.md:32, 215-222). Badge
spec line 68 already says "Not Badge: a count or dot attached to another element (Indicator)".

| System | Count element | Same as label badge? | Height / text / padding / radius | Fill · ink | Tabular | In a tab / nav row | Source |
|---|---|---|---|---|---|---|---|
| **Primer** | **CounterLabel** | **No.** Label is separate (20/24 tall, 500 weight, outlined) | 12px text × `line-height:1` + 2px padding × 2 + 1px border × 2 = **18** (arith); 12px (`text-body-size-small`) semibold; padding 2/6; radius 20 (pill) | secondary: `bgColor-neutral-muted` = neutral.8 #818B98 at **12%** (dark 20%), `fgColor-default`; primary: neutral-emphasis fill with onEmphasis ink; border transparent | not found | UnderlineNav: `margin-inline-start: 8`, flex centred; NavList puts it in TrailingVisual | `PR/CounterLabel/CounterLabel.module.css:1-24`; `PR/Label/Label.module.css:3-22`; `PR/internal/components/UnderlineTabbedInterface.module.css:129-133`, `.tsx:85-93`; primitives `src/tokens/functional/color/bgColor.json5:212-231`, `src/tokens/component/counter.json5:2-4` |
| **Fluent 2** | **CounterBadge** | **Partly.** A Badge subtype: same Badge styles, with count logic (`overflowCount` 99, `showZero`, `dot`) | Badge md **20** (min-width 20), sm 16, lg 24; caption1Strong 12/16 **600**; padding 0 6 (XS 4 + text 2); circular | filled **brand** by default | not found | Tabs and Nav have no count slot in library src (not found) | `FR/react-badge/library/src/components/CounterBadge/useCounterBadge.ts:16,39-49`; `Badge/useBadgeStyles.styles.ts:14-28,70-85,257-259` |
| **Carbon** | **BadgeIndicator** (count or dot) | **No.** Tag is the label | min 8, **max 16** tall; helper-text-01 (12/16); padding 0 4 2; pill | `support-error` red, `text-on-color` | not found | **Attached** absolute top/end of icon-only tabs and header actions, 999+ cap. No inline count next to a text label (not found) | `CS/badge-indicator/_badge-indicator.scss:22-45`; `CR/BadgeIndicator/index.tsx:22-39`; `CS/tabs/_tabs.scss:567-575` |
| **Atlassian** | **Badge** (numeric only) | **No.** Lozenge carries text status; Badge "is used to display numeric status data" | not found | neutral plus semantic appearances; bold variants for notification counts | not found | Docs: pair with labels "in navigation, tabs, or buttons" | **doc** https://atlassian.design/components/badge/usage |
| **Material 3** | **Badge** (small dot 6 / large 16) | **Counts only.** No label badge (labels use chips) | large **16**, min-width 16; label-small type; padding 0 4; full radius | `error` / `on-error` | not found | **Attached** to nav-bar, rail and tab icons | mweb `labs/gb/components/badge/_badge-tokens.scss:6-18`; `labs/gb/components/badge/badge.scss:23,37-41` |
| **Polaris** | **Badge** | **Yes.** Same Badge | 12px (`bodySm`); padding 2/8; radius 8 (`border-radius-200`) | `tone="new"` (transparent-secondary fill, secondary ink, bold) when the tab is **not selected**; default tone when selected | not found | Tab renders `<Badge>` after the label; Navigation.Item wraps it in `.Badge` | `PL/Tabs/components/Tab/Tab.tsx:279-280,310`; `PL/Navigation/components/Item/Item.tsx:125-141`; `PL/Badge/Badge.module.css:3-13,114-118`; `PL/Badge/Badge.tsx:111-113` |
| **Untitled UI** | **Badge** `size="sm"` | **Yes.** Same Badge | 12/18 (`text-xs`) + 2 + 2 = **22** (arith); padding 2/8; `rounded-full`; 500 | gray pill-color (gray-50 fill, gray-700 ink, gray-200 inset ring); **switches to brand when the tab is hovered or selected** | not found | Tabs: `gap-1.5` (6) after the label; NavItem: `ml-3` (12) | uui `components/application/tabs/tabs.tsx:166-208`; `components/application/app-navigation/base-components/nav-item.tsx:67-73`; `components/base/badges/badges.tsx:125-131` |
| **shadcn** | **SidebarMenuBadge** (sidebar) vs Badge | **No** in the sidebar: a distinct plain element | **20** (`h-5 min-w-5`); 12px 500; padding 0 4; `rounded-md` | **no fill**; sidebar-foreground ink, accent ink on hover/active | **yes** (`tabular-nums`) | absolute `right-1`, `top-1.5` in a default-size row | `SH/ui/sidebar.tsx:580-593`; Badge `SH/ui/badge.tsx:7` (pill, 12px 500, py 2 px 8) |
| **Mantine** | **Badge** | **Yes.** `circle` prop makes width = height | xs 16 / sm 18 / **md 20**; 9/10/**11**px **bold uppercase**, letter-spacing .25; padding x 6/8/10 (circle: 2); radius 1000 | filled by default | not found | Tabs `rightSection`: margin 10 (spacing-xs); NavLink `rightSection`: 12 (spacing-sm) | `MT/Badge/Badge.module.css:2-43,66-74`; `MT/Tabs/Tabs.module.css:141-151`; `MT/NavLink/NavLink.module.css:42-57` |
| **Ant Design** | **Badge** `count` (standalone = `not-a-wrapper`) | **No.** Tag is the label; Badge is count, dot or status | **20** (`round(14 × 1.5714) − 2`), sm 14; **12px normal** weight; multi-digit padding 0 8; radius 10 | `colorError` red, white ink, 1px ring in the surface colour | not found | Tabs `label` accepts any node (no count slot) | `components/badge/style/index.ts:181-223,322-335,375-410` |
| **Chakra v3** | **Badge** | **Yes** | sm **20** min-h (default); xs text 12/16; px 6; radius `l2` 4; **500** | `subtle` by default | **yes** (`fontVariantNumeric: tabular-nums`) | not found | chakra `packages/react/src/theme/recipes/badge.ts:8-11,42-67` |
| **Spectrum 2** | **NotificationBadge** | **No.** Badge is the label/status element | S **12**, M `1lh`, L 16, XL 18; ui-xs / ui-sm; pill; square when single digit; 99+ | `accent` fill, white ink | not found | **Attached** to ActionButton (`--badgeTop`, `--badgePosition`) | `S2/NotificationBadge.tsx:56-118,146-161`; `S2/ActionButton.tsx:281-292,432-443` |
| Radix Themes | Badge only | Yes | size 1: 12/16 + 2 + 2 = 20 (arith); padding 2/6; 500 | variant-based | not found | not found | radix `components/badge.css:6-29` |

**Pattern.**
- Six systems give counts **their own element**: Primer CounterLabel, Atlassian Badge vs
  Lozenge, Carbon BadgeIndicator vs Tag, Ant Badge vs Tag, Spectrum NotificationBadge vs
  Badge, and shadcn's SidebarMenuBadge. Material has counts only.
- Five reuse **one Badge**: Polaris, Untitled, Mantine, Chakra, Radix Themes. Fluent sits
  between: CounterBadge is its own component on Badge's styles.
- The inline counts that sit next to a label in a row share a band: **18–22px tall, 12px
  text, 500–600 weight, pill or near-pill, neutral and quiet** (Primer 18, shadcn 20, Fluent
  20, Polaris about 20, Untitled 22). Red, filled counts appear only when **attached** to an
  icon (Carbon, Material, Spectrum, Ant, Area Indicator).
- Two behaviours recur that a label badge does not have. The count follows its owner's state
  (Polaris swaps tone on the selected tab; Untitled goes gray → brand on hover/selected;
  shadcn's ink follows the active row). And it uses tabular numerals (shadcn, Chakra, Area
  Indicator).

**Recommendation: a separate `Count` element, not a Badge variant.** Share code with
Indicator's count kind; take the shell geometry from Badge sm/md.
1. **Different job.** Badge (spec l.68) labels a thing. A count quantifies its owner and has
   no meaning alone: Atlassian says to pair it with a label, and Primer, Carbon, Ant and
   Spectrum all split number from label. Area already excluded owned counts from Badge.
2. **Different rules.** A count needs tabular numerals, min-width = height (a circle for one
   digit), overflow formatting (99+), and an accessible name folded into its owner ("Inbox,
   3 unread"). It has no tone axis beyond neutral and accent, and no dot or icon slots. These
   would be dead or contradictory props on Badge.
3. **State coupling.** Its paint follows the owner's hover, selected and current state
   (Polaris, Untitled, shadcn). That belongs in a small element the owners style through a
   documented hook (e.g. `[aria-current] .area-count`), not in Badge's tone system.
4. **Two emphases cover the evidence:** `soft` (neutral 12%-ish fill, like Primer, Untitled
   and Polaris) and `plain` (no fill, muted ink, like shadcn's sidebar and Notion's board
   group counts from the Indicator spec). Sizes: 16 in compact rows, 20 by default (the Badge
   sm/md heights), with 12px text, 500 weight and tabular numerals. Seat it in the owner's
   trailing slot with the owner's gap (Primer 8, Untitled 6–12, Mantine 10–12).
5. **Indicator's count stays the attached, filled (danger by default) corner form.** Count and
   Indicator can share the number formatting and overflow helper.

If the owner prefers fewer components, the fallback is `Indicator count` with an unattached
inline placement. It is not a Badge variant, because Badge's tone, dot and icon axes don't
apply.

---

## 3. Banner vs Alert vs Toast

Area today: Alert (in-place; single-line and multiline layouts; neutral default; 1px tone
border; container radius; solid emphasis excluded) and Toast (transient surface; consumer owns
placement). Banner is listed as backlog in docs/COMPONENTS.md:134,186.

| System | Separate Banner? | In-place message | Transient | Banner anatomy | Placement | Dismissal | Tones | Geometry | Full-bleed? | Source |
|---|---|---|---|---|---|---|---|---|---|---|
| **Primer** | **No.** `Banner` *is* the in-place message; Flash is deprecated in its favour | Banner | (none in react) | icon, title (can hide), description, primary and secondary actions, dismiss | anywhere; `flush` for "confined spaces, such as dialogs, tables, cards" | `onDismiss` optional | critical, info (default), success, upsell, warning | padding 8 (compact 4); 1px border; radius medium; grid `auto 1fr auto` | `flush` → radius 0, edge to edge | `PR/Banner/Banner.tsx:12,42-95,120-170`; `PR/Banner/Banner.module.css:3-9,64-71`; `PR/Flash/Flash.tsx:7,16` |
| **Atlassian** | **Yes.** Banner vs Section message vs Flag (and Inline message) | Section message (a section; title, description, actions; persistent until resolved) | Flag | icon + one line of content, truncates | **top of screen, full width**, pushes content down | **not dismissible**; one at a time; role `alert` | warning, error, **announcement** | not found | yes | **doc** https://atlassian.design/components/banner/usage, /banner/code, /section-message/usage |
| **Carbon** | **No banner** (not found) | InlineNotification, ActionableNotification `inline`, Callout / StaticNotification | ToastNotification, ActionableNotification (toast by default) | icon, title, subtitle, action, close | inline in content | close button, `hideCloseButton` | error (default for actionable), info, success, warning, plus low-contrast | min height 48; max width 288/608/736/832 by breakpoint; actionable radius 8 | no (width capped) | `CR/Notification/Notification.tsx:396,666,928-960,1326,1472`; `CS/notification/_inline-notification.scss:35-54`; `_actionable-notification.scss:39-61` |
| **Polaris** | **No.** One `Banner` with contextual layouts | Banner `withinContentContainer` | Toast (separate) | icon, title, children, action, secondary action, dismiss | `withinPage` (top of page content) or inside a card | `onDismiss` optional | success, info (default), warning, critical | withinPage: radius 12 at sm+ and **0 on mobile**, bevel shadow, 16 gap between stacked banners; in-container: radius 8, 8 gap; padding 12 (400 at md) | withinPage goes edge to edge on mobile only | `PL/Banner/Banner.tsx:35-53,62-79,101-189`; `PL/Banner/Banner.module.css:1-33` |
| **Fluent 2** | **No.** One `MessageBar` | MessageBar `shape="rounded"` | Toast (react-toast) | icon, body (title + text), actions, dismiss; `MessageBarGroup` stacks them | "Use square for page level messages and rounded for component level" | via actions slot | info (default), success, warning, error | min height 36; padding-left 12; 1px stroke; radius medium; layout auto / singleline / multiline | `shape="square"` → radius 0 | `FR/react-message-bar/library/src/components/MessageBar/MessageBar.types.ts:22,33-42`; `useMessageBar.ts:22-26,86`; `useMessageBarStyles.styles.ts:17-26,62-63,83-91` |
| **Material** | M2 had **Banner**; **M3 does not list it** | (none) | Snackbar | M2: message, 1–2 actions | M2: top of screen, below the top app bar | M2: persistent until acted on | — | not found | M2: full width | https://m3.material.io/components (no Banner); https://slack-chats.kotlinlang.org/t/2708406 (M3 dropped banner). M2 values not found (m2.material.io rendered empty) |
| **Spectrum 2** | **No** (only the legacy `spectrum-css-temp/components/banner`, not exported by S2) | InlineAlert | Toast | header, content, optional autoFocus | inline | not found | informative, positive, notice, negative, neutral × fillStyle border / subtleFill / boldFill | padding 24; radius lg; border 2 | no | `S2/InlineAlert.tsx:39-69`; `S2/Toast.tsx` |
| **Ant Design** | **No.** `Alert banner` prop | Alert | message / notification | same as Alert; banner defaults to warning and shows an icon | top of page (by convention) | `closable` | success, info, warning, error | Alert padding 8/12, radius 8; banner: radius 0, **no border**, margin 0 | yes | `components/alert/Alert.tsx:94,239-265,295`; `alert/style/index.ts:70-80,164-168,246-252` |
| **Mantine** | **No** (not found) | Alert | Notification | title, icon, close | inline | `withCloseButton` | colour-based | padding md (16); default radius | no | `MT/Alert/Alert.module.css:2-8` |
| **Untitled UI** | **Yes.** Marketing "Banners" section, separate from Alerts and Notifications | Alerts (floating and full-width layouts; icon, title, supporting text, actions, close) | Notifications (Sonner) | Banner: slim, single-action, dual-action, text-field (email capture), countdown; default and brand | **top or bottom** of the site; one at a time | dismissible | default, brand | not found | full-width and floating versions of every banner | **doc** https://www.untitledui.com/react/marketing/banners, /react/components/alerts, /react/components/notifications (not in the free repo at `4702dc0`) |
| Radix Themes / shadcn / Chakra / Base UI | No | Callout / Alert / Alert / — | — / Sonner / Toast / Toast | — | — | — | — | — | — | (repo trees; no banner files) |

**Pattern.**
- **Most systems have no separate Banner.** The page-level banner is a **layout of the
  in-place message**: Primer `flush`, Fluent `shape="square"`, Polaris `withinPage` vs
  `withinContentContainer`, Ant `banner`. Each changes the same few things: **radius 0**,
  side borders dropped, the edge goes to the container, and sometimes the default tone
  changes (Ant → warning).
- **Separate Banners exist only where the job differs**:
  - Atlassian: site-wide, not dismissible, one at a time, bold warning/error/announcement fills.
  - Untitled: promotional and marketing (countdowns, email capture).
  - Material 2: a persistent message under the top app bar, dropped in M3.
- Toast is always separate: transient and positioned.

**Recommendation: an Alert layout variant, not a new component. Marketing banners are a
composition.**
1. **Add `layout="banner"` to Alert** (or a boolean `flush`, as Primer does). It sets radius
   0; drops the start and end borders, keeping only the block-end divider (or none at the top
   of the page); and fills the container's width, with an optional centred content max-width.
   It keeps Alert's tones, icon, actions and dismiss. Precedent: 4 of the 5 systems that
   support the case do it with one component (Primer, Fluent, Polaris, Ant). Area's Alert
   single-line layout is already "a one-row banner" (alert.md:36).
2. **Keep placement consumer-owned**, as Toast does. The variant describes the shape, not
   "top of page". Document that the page-level use shows one banner at a time and is
   persistent, and that `role` is `status`, or `alert` only for danger/warning (Polaris:
   Banner.tsx:79; Atlassian warns that role `alert` is noisy).
3. **Don't add a separate Banner for the site-wide or bold case unless the owner asks.** Alert
   excluded solid emphasis (alert.md:39) and no target product showed one. If it is wanted
   later, add it as Alert's emphasis axis (Atlassian's bold fills, Spectrum's `boldFill`), not
   as a new component.
4. **Treat promotional banners** (announcement bars, countdowns, email capture) as a
   **composition** in docs (Alert banner layout, or a plain bar + Button + Input), not as a
   component. Only Untitled ships them, and as marketing sections, not app components.

## Appendix: OpenAI banners, measured live (Claude in Chrome, 2026-09-27)

Owner references: openai.com/business and openai.com/daybreak. Computed styles read on the public
pages (the capture file for the business banner was lost in transfer; values below are the
computed styles read at the time).

| Page | Element | Box | Fill / edge | Radius | Padding | Type | End slot |
|---|---|---|---|---|---|---|---|
| /business | `a` (the whole banner is one link) | 1376 × 48 min, inside the page width (not full-bleed), 64 from the viewport top | #000, white ink | 6 | 10 / 14 | 14/23 text after a 208 × 24 wordmark; grid, 12 / 14 gaps | 99 × 20 countdown pill, radius 4, #924ff7, 2 / 6 padding |
| /daybreak | `div` | 1376 × 50, inside the page width | #f5 (the owner's screenshot shows a pale cyan gradient with a cyan edge) | 6 | 12 / 16 | title 14/20 600 black | "Learn more", 14 / 400, underlined, 16 from the end |

Reading: both are section-width, persistent announcement bars at the top of a page, one line,
with an action or status at the end: Alert's anatomy in a banner layout. Neither is transient,
so neither is a Toast.
