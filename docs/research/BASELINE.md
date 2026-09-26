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
| Primary button | | | | |
| Secondary / ghost button | | | | |
| Icon-only button | | | | |
| Text input | | | | |
| Menu item and menu surface | | | | |
| Sidebar / list row | | | | |
| Tab | | | | |
| Tooltip | | | | |
| Popover / dialog surface | | | | |
| Badge / tag | "NEW" pill: 16px, 1px border rgba(0,0,0,.15), 8/12 600 uppercase, rgb(143,143,143), 5px sides. Billing "Paid": 22px, radius 4, 8px sides, 14/14 400, fill rgb(243,243,243), ink rgb(93,93,93), no border | Board tag: 20px, radius 4, 6px sides, 14/16.8 500. Table select: same at 400. Status: 20px pill, 7/9px sides, 8px dot, 5px gap, 400. Alpha-tinted fills (0.14–0.28) with dark tinted ink | "AI" label: 18px (1px border rgb(230,230,230) + 16px line), radius 5, 4px padding, 11/16 400, ink 50% black, no fill. "Free" plan (dark menu): 16px, radius 5, 4px, 11/16 450, fill rgb(68,68,68) | `indicator/chatgpt--badge-new…`, `badge/chatgpt--status-paid…`, `badge/notion--*`, `badge/figma--*` |
| Count and status indicator | none found (2026-09-25 search) | none present; board group count is plain 14px text in a 20px box, radius 4, 6px sides | unread dot 5px, #dc3412, inside the 24px icon, 9px from the 32px button's top and end | `indicator/notion--board-group-count…`, `indicator/figma--bell-unread-dot…` |
| Avatar | | | | |

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
| Primary ink / secondary ink / tertiary ink | rgb(13,13,13) / rgb(143,143,143) | rgb(44,44,43) / rgb(95,94,89) / rgb(125,122,117), rgb(161,158,153) | 90% / 50% black | see typography.md |
| Divider and control border | | | | |
| Hover and pressed fill | | | | |
| Selected fill | | | | |
| Focus ring | | | | |
| Shadow by elevation | | | | |

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
