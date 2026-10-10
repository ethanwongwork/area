# Reference baseline

How ChatGPT, Notion and Figma build the elements that recur across components. Specs
check their values against this page, which keeps components consistent with each other.
Every value cites capture files in [`captures/`](captures/README.md) (`baseline/` or a
component's folder). An empty cell means not captured yet, never "assumed".
Capture protocol: [Building a component](../COMPONENT_ADAPTATION.md#capture-protocol).

## Primary product by context

When the target products disagree and no owner decision applies, the product whose
context matches the component decides.

| Context | Primary product | Examples |
|---|---|---|
| Inspector, property editing, canvas tools | Figma | NumberField, ColorPicker, AlignmentPicker, Toolbar, InputGroup |
| Conversation, composing, assistant surfaces | ChatGPT | Composer, message actions, model and mode pickers |
| Content, navigation, lists, pages | Notion | Nav, TreeView, Menu, Breadcrumb, Table, page blocks |
| Status, identity, notifications | Decided per spec from which products show the pattern | Indicator, Badge, Avatar |

## Elements to capture

For each element: rest, hover and focus-visible, light and dark. Each row records height,
padding, gap, radius, border, type (size/line-height/weight/family), icon size, fill and
ink by state, and shadow.

| Element | ChatGPT | Notion | Figma | Captures |
|---|---|---|---|---|
| Primary button | Logged in: send/voice 36 round solid; logged out "Log in" 44 pill, 14/20 600, 12px sides, no shadow, focus 2px outline offset 2 | Share "Invite" 32, radius 6, 12px sides, 14/16.8 500, solid blue, no shadow | none captured (editor not opened) | `button/chatgpt*--*solid*`, `button/notion--solid-accent--*` |
| Secondary / ghost button | Soft pill 36, 12px sides, 14/18 400, 5% black (hover 10%); ghost 36 radius 8, icon 16 at 13, gap 4, hover 5% | Ghost 28, radius 6, 8px sides, 14/16.8 400, gap 6, hover 5% warm black; outline 32, 0.56px hairline, 500 | Pill 32 fill 245 + 1px inset ring; tabs 24, radius 5, 8px sides, 11/16 450–550 | `button/chatgpt--soft-*`, `button/notion--*ghost*`, `button/figma--*` |
| Secondary / ghost button (cohesion audit) | Model picker: 36px pill, 12/14px sides, 6px gap, 16/26 400 in tertiary ink rgb(143); hover rgba(0,0,0,.05) | | | `baseline/chatgpt--model-picker--{rest,hover}…` |
| Icon-only button | 36 radius 8 (20px icon, 8 in); 32 radius 8 (20px icon, 6 in); composer 36 round | 28 radius 6, 20px icon 4 in | 24 radius 5; 32 | `button/*icon-ghost*` |
| Icon-only button (cohesion audit) | 36px, radius 8, 20px icon in secondary ink rgb(93); the hover plate is a `::before` layer (rgba(0,0,0,.05)), which the captured hover state had not yet faded in | 24px, radius 3, hover rgba(55,53,47,.08) (calendar nav) | 24px, radius 5, hover rgba(0,0,0,.05) (eyedropper, close) | `baseline/chatgpt--icon-button-ghost--{rest,hover}…`, `calendar/notion--nav-button--hover…`, `color-picker/figma--eyedropper--hover…` |
| Text input | Search field: 36px pill, fill rgba(0,0,0,.05), no border, 16px icon 12px in, 8px gap, 14/18 | | | `baseline/chatgpt--search-field--rest…` |
| Menu item and menu surface | Surface 324 wide, radius 16, 10px padding, white at 90%, 0.5px black-10% ring + 0 8px 16px −4px black 12%. Items 36px, radius 12, 6/10px padding, 14/20 400; hover rgba(0,0,0,.05). Separator 1px black 10% in a 17px block, 8px in from the item edge | | | `baseline/chatgpt--menu--rest…`, `baseline/chatgpt--menu-item--hover…` |
| Sidebar / list row | 35–36px, radius 8, 6/10px padding, 20px icon 6px before the text, 14/20 400 rgb(13); hover and current both rgba(0,0,0,.05) | | | `baseline/chatgpt--sidebar-row{,-current}--…`, `baseline/chatgpt--sidebar-recent--{rest,hover}…` |
| Tab | | | | |
| Tooltip | | | | |
| Popover / dialog surface | | Date filter popover: 248 wide, radius 10, white, shadow 0 20 24 rgba(25,25,25,.05), 0 5 8 rgba(25,25,25,.027), …; 4px inset | Color picker: 240 wide, radius 13, white, no border; shadow 0 2 5 .15, 0 10 16 .12, 0 0 .5 .12; 40px header | `calendar/notion--search-date-filter-popover…`, `color-picker/figma--solid-layer-fill…` |
| Badge / tag | "NEW" pill: 16px, 1px border rgba(0,0,0,.15), 8/12 600 uppercase, rgb(143,143,143), 5px sides. Billing "Paid": 22px, radius 4, 8px sides, 14/14 400, fill rgb(243,243,243), ink rgb(93,93,93), no border | Board tag: 20px, radius 4, 6px sides, 14/16.8 500. Table select: same at 400. Status: 20px pill, 7/9px sides, 8px dot, 5px gap, 400. Alpha-tinted fills (0.14–0.28) with dark tinted ink | "AI" label: 18px (1px border rgb(230,230,230) + 16px line), radius 5, 4px padding, 11/16 400, ink 50% black, no fill. "Free" plan (dark menu): 16px, radius 5, 4px, 11/16 450, fill rgb(68,68,68) | `indicator/chatgpt--badge-new…`, `badge/chatgpt--status-paid…`, `badge/notion--*`, `badge/figma--*` |
| Count and status indicator | none found (2026-09-25 search) | none present; board group count is plain 14px text in a 20px box, radius 4, 6px sides | unread dot 5px, #dc3412, inside the 24px icon, 9px from the 32px button's top and end | `indicator/notion--board-group-count…`, `indicator/figma--bell-unread-dot…` |
| Avatar | 20px image circle in the profile menu; 24px in the account row | | | `baseline/chatgpt--avatar-initials--rest…`, `baseline/chatgpt--account-row--rest…` |
| Segmented control | 36px pill; track rgba(13,13,13,.03); selected thumb white with a 0.5px black-10% ring and 0 1px 6px black 5%; labels 14/20 **500 selected and unselected**, unselected in secondary ink rgb(93) | | | `baseline/chatgpt--segmented--{rest,hover}…` |
| Switch | 32 × 20 track, 16px white thumb 2px in with 0 1px 2px −1px black 8%; on is blue rgb(58,131,247) | | | `baseline/chatgpt--switch-on--{rest,hover}…` |
| Select trigger | 36px pill, fill rgb(243), 1px black-10% border, 12px sides, 16px chevron in rgb(143), 4px gap, 14/18 | | Inspector select 24px, radius 5, 1px rgb(230) border (colour picker format row) | `baseline/chatgpt--select--{rest,hover}…`, `color-picker/figma--format-row…` |
| Settings group (card) | Radius 16, 1px black-10% border, fill rgb(252) | | | `baseline/chatgpt--settings-card--rest…` |

## Type roles in use

| Role | ChatGPT | Notion | Figma | Captures |
|---|---|---|---|---|
| UI body | 14/20 400; 16/24 and 16/26 400 | 14/21 400, 15/22.5 500 (board) | 11/16 450–550 | see typography.md |
| UI small | | | | |
| Tiny chrome (badges, counts, shortcuts) | | | | |
| Section heading | 24/28 400 | 32/38.4 700 (page title) | 18/25 550 | see typography.md |

## Paint roles in use

| Role | ChatGPT | Notion | Figma | Captures |
|---|---|---|---|---|
| Surface / elevated surface | | | | |
| Primary ink / secondary ink / tertiary ink | rgb(13,13,13) / rgb(93,93,93) / rgb(143,143,143) | rgb(44,44,43) / rgb(95,94,89) / rgb(125,122,117), rgb(161,158,153) | 90% / 50% black | see typography.md |
| Divider and control border | rgba(0,0,0,.1) menu separators and select border | rgba(42,28,0,.07) popover rules | rgb(230) popover rules and select border | `calendar/notion--search-date-filter-popover…`, `color-picker/figma--*` |
| Hover and pressed fill | rgba(0,0,0,.05) on rows, menu items, icon buttons and the model picker | rgba(55,53,47,.08) (calendar nav) | rgba(0,0,0,.05) | `baseline/chatgpt--*--hover…`, `calendar/notion--nav-button--hover…`, `color-picker/figma--eyedropper--hover…` |
| Selected fill | Current sidebar row rgba(0,0,0,.05), the same as hover | | | `baseline/chatgpt--sidebar-row-current--rest…` |
| Focus ring | | | | |
| Shadow by elevation | Menu: 0.5px black-10% ring + 0 8px 16px −4px black 12% | Popover: 0 20px 24px rgba(25,25,25,.05), 0 5px 8px rgba(25,25,25,.027), 1px rgba(42,28,0,.07) ring | Picker: 0 2px 5px .15, 0 10px 16px .12, 0 0 .5px .12 | `baseline/chatgpt--menu--rest…`, `calendar/notion--search-date-filter-popover…`, `color-picker/figma--solid-layer-fill…` |

## Findings

Record cross-product agreements and disagreements as they are measured, each with its
captures. Promote an agreement into Area only through a spec's decision table.

- 2026-09-25 (Indicator pilot): indicators sit inside their owner, never straddling
  its corner (Figma bell dot; Untitled avatar status). Small chrome labels are 16–20px
  tall (ChatGPT 16, Notion 20). Only Figma showed an indicator; ChatGPT and Notion showed
  none in the states available. All captures are light theme.
- 2026-09-25 (Badge): product badges are 16–22px tall with 4–8px sides; filled tags carry
  no border (ChatGPT, Notion), outline labels carry no fill (Figma, ChatGPT). Neutral
  badge ink is the secondary text colour in both ChatGPT (rgb(93,93,93)) and Figma (50%
  black). Rectangular tags use 4–5px corners; Notion draws status-with-dot as a pill.
  Label weight is 400 in ChatGPT, Figma and Notion table cells, 500 on Notion board
  headers. Light theme only.
- 2026-09-26 (Color picker, Calendar): Figma's inspector controls are 24px with 5px radius
  and 11/16 text; its picker is exactly ten rows wide (240). Notion's date grid uses 32px
  cells with 28px day buttons at radius 6. Popover surfaces: Figma radius 13 with no
  border, Notion radius 10; both lean on shadow rather than a stroke. Hover fills are
  translucent neutrals (Figma 5% black, Notion 8% warm gray), except Notion's calendar day
  hover, which uses its selection blue. Light theme only.
- 2026-09-26 (Cohesion audit): all three products hover rows, menu items and transparent
  buttons at about #f2 on white (ChatGPT and Figma 5% black, Notion 8% warm grey); ChatGPT
  paints its current sidebar row with the same 5%. Floating surfaces in all three lean on a
  soft, deep blur (Notion 20px, ChatGPT 16px, Figma 16px) plus a hairline ring, not a 1–2px
  edge shadow. ChatGPT keeps segmented labels at 500 in both states. ChatGPT's controls are
  36px and pill-shaped (segmented, select, search); Figma's inspector controls are 24px.
  ChatGPT only, light theme; Notion and Figma were not re-captured for these elements
  ([cohesion audit](cohesion-audit.md)).
- 2026-09-25 (Button): no product shadows a button. Ghost and soft labels are 400 (ChatGPT,
  Notion); 500 appears on filled buttons (Notion). Hover is a 5% black wash in ChatGPT and
  Notion. Icon-to-label gaps are 4 (ChatGPT) to 6 (Notion). Controls are 24 (Figma), 28/32
  (Notion), 32/36 (ChatGPT). Light theme only.
- Dark theme (2026-09-30, [dark-pass](dark-pass-2026-09-30.md), 19 captures): every product
  keeps floating surfaces one step above the page with a visible light edge (Notion ring
  #383836; ChatGPT and Figma 15–35% white hairlines) and a strong lift (19–35% black). Tooltips
  stay dark (#1e–#2c) with a 5% white edge rather than inverting. Cards drop their shadow
  (Notion 5% white fill; Figma 1px #444 edge). Menu row hover is a white wash (ChatGPT 10%,
  Notion 5.5%) or Figma's accent. Scrims disagree (Notion 80% #0f0f0f; ChatGPT none).
- 2026-10-08 (Pagination): none of the products shows a numbered pager. ChatGPT lists response
  versions behind a "See versions" action; Notion's long boards append as they scroll. Design systems
  agree on 32px page squares 2 apart (shadcn; Untitled UI 36, 2 apart; Primer 32, 4 apart) and differ on
  the current page: a plate (Untitled UI), an outline (shadcn) or the accent fill (Primer)
  (`pagination/uui--*`, `pagination/shadcn--*`).
- 2026-10-08 (Link): ChatGPT and Notion keep a link in the ink and size of the text around it and always
  underline it in prose, about 2px below (ChatGPT 0.125rem in the text colour; Notion 10%, a 0.05em line at
  40% warm grey, the text at 70% opacity). Neither colours links (`link/chatgpt--*`, `link/notion--*`).
- 2026-10-09 (Scroll area): the three products disagree. Figma draws its own bar in the editor (a 10px track, a
  6px round thumb 2px in, #b3b3b3 at 50%, shown while the panel is hovered); ChatGPT thins the native bar for every
  element (its ink at 30% on a transparent track); Notion leaves the native bar, the system's overlay on macOS
  (`scroll-area/figma--*`; ChatGPT and Notion as rule readouts in the spec).
- 2026-10-09 (File upload): no product shows an upload surface we could measure without uploading the owner's data
  (ChatGPT's 10 recent chats carry no attachment; a test upload declined). Untitled UI is the basis (readout in
  `docs/specs/file-upload.md`).
- 2026-10-09 (Toggletip): ChatGPT and Notion put contextual help behind a quiet mark after a 14/20 label (ChatGPT a 12
  info button, #8f8f8f, 4 after the label; Notion a 16 "?", rgb(173, 169, 163), 6 after) and show the note on their
  dark tooltip 6 from the mark, on hover only (ChatGPT also on focus; a press does not pin it). Neither plates the mark;
  ChatGPT darkens it on hover (`toggletip/chatgpt--*`, `toggletip/notion--*`; Figma: none found in the file browser).

