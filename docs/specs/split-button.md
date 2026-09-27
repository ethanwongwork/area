# Split button spec

**Status:** accepted · 2026-09-26 (was: in review · 2026-09-26 (first build under the capture workflow))
**Captures:** `docs/research/captures/split-button/`
**Peers:** Button (both parts are Buttons), ButtonGroup (joined edges, divider), Menu (the
menu surface), Popover (native top layer), Toolbar overflow (another menu trigger)

## Owner decisions

- 2026-09-26: build split button as a separate component if other design systems more often
  do; say where it usually lives (Button variant, ButtonGroup, or standalone); build
  ButtonGroup and SplitButton either way.
- 2026-09-26: accepted. Owner: "consider every component that you have built to be approved. if i havent given any feedback to change anything consider them approved."

## Where design systems put it

Survey of 15 systems' official docs or source, 2026-09-26:

| Structure | Systems |
|---|---|
| Standalone component | Fluent 2 `SplitButton`; Material 3 `SplitButtonLayout`; Carbon `ComboButton`; Atlassian `SplitButton` |
| Composition of ButtonGroup + menu | Primer (ButtonGroup + ActionMenu); shadcn/ui (ButtonGroup + separator + DropdownMenu); Polaris (segmented ButtonGroup; its `Button connectedDisclosure` prop was removed in v12); Mantine; Chakra |
| Prop of a dropdown | Ant Design `Dropdown.Button`, now deprecated in favour of composition |
| Not offered | React Spectrum, Untitled UI, Radix Themes, Salesforce Lightning, Base UI |

No current system models it as a Button variant. The four product-scale systems that specify
its visuals ship a standalone component; primitive libraries leave it to composition.
**Decision:** a standalone `SplitButton`, built from two Buttons with ButtonGroup's joined-edge
rules. Consumers who need something else can still compose ButtonGroup + Button + Menu.

## Job and boundaries

A default action joined to a menu of related alternatives ("Save" · "Save as…, Export";
Notion's "New" · templates). Not a menu button (no default action; use a Button with a
trailing chevron), not a Segmented control (mutually exclusive modes), not a Toolbar
overflow (hidden commands).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | solid (default) | Primary action with alternatives | Notion "New ▾" (solid accent); Fluent, Atlassian primary |
| variant | soft | Secondary action | shadcn split (secondary fill + separator) |
| variant | outline | Secondary action on busy surfaces | shadcn "Follow ▾"; Fluent outline |
| tone | Button's eight tones | Same meaning as Button | Notion accent |
| size | sm 28, md 32, lg 40 | Button's scale | Notion 28; shadcn 32 |
| composition | leading icon on the action | Iconic defaults ("+ Add") | Fluent, Atlassian icon slots |
| state | disabled (both parts), menu open (`aria-expanded`) | Runtime | Notion reports `aria-expanded` on its chevron |

Excluded: ghost (with no fill or edge the two parts do not read as one control; none of the
references offers it).

## Sources

| Id | Type | What | Link / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | Database "New ▾" split (solid accent), each part hovered, open menu surface | app.notion.com, owner's "tasks" board (Chrome), 2026-09-26; the menu was opened, nothing chosen | evidence only | `notion--split-*` (6) |
| shadcn | design system (rendered) | ButtonGroup "Split" (soft + separator), "Dropdown menu" (outline), outline groups | ui.shadcn.com/docs/components/button-group, 2026-09-26 | MIT | `shadcn--*` (4) |
| fluent, carbon, atlassian, material | design system (source) | API structure only (survey above) | microsoft/fluentui `react-button/.../SplitButton`; carbon `ComboButton/index.tsx`; atlassian.design split-button; androidx `material3/SplitButton.kt` | MIT / Apache-2.0 | — |
| area | this system | Solid sm, solid accent, soft, outline | localhost gallery | — | `area--split-*` (4) |

ChatGPT and Figma: no split button found (ChatGPT's model picker is a menu button; Figma's
file browser has none; the editor was not opened).

## Anatomy

```
notion   div (group, no paint)
  action   div[role=button] 45×28, padding 0 8, radius 6 0 0 6, 14/21 500, solid blue
  trigger  div[role=button] 24×28, radius 0 6 6 0, inset 1px left shadow rgba(28,19,1,.11), 16px chevron 4px in
  (overlay div, pointer-events none)
area     div.area-split-button[role=group]   anchor for the menu
  action   button.area-button.area-split-button__action   end corners square
  trigger  button.area-button.area-split-button__trigger  width = height − 4, start corners square,
           ::before divider (1px, full height, over the shared border), chevron glyph
  menu     div.area-menu.area-split-button__menu[popover=auto][role=menu]
```

## Measurements

Generated with `node scripts/capture-compare.mjs` from `docs/research/captures/split-button/`,
filtered to the shell, action, trigger ("menu") and icon rows.

| slot · property | area · split-solid-sm · rest · light | notion · split-solid-accent · rest · light | area · split-solid-accent · rest · light | area · split-soft · rest · light | shadcn · split-separator · rest · light | area · split-outline · rest · light | shadcn · split-dropdown · rest · light |
|---|---|---|---|---|---|---|---|
| **shell** size | 70.18 × 28 | 69.32 × 27.99 | 78.64 × 32 | 80.52 × 32 | 98.71 × 32 | 80.52 × 32 | 100.23 × 32 |
| **shell** padding | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **shell** border | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **shell** radius | 0px | 0px | 0px | 0px | 0px | 0px | 0px |
| **shell** font | 16px/24px 400 Geist | 14px/21px 400 ui-sans-serif | 16px/24px 400 Geist | 16px/24px 400 Geist | 15px/26.25px 400 Geist | 16px/24px 400 Geist | 15px/26.25px 400 Geist |
| **action** size | 47.18 × 28 | 45.33 × 27.99 | 51.64 × 32 | 53.52 × 32 | 65.71 × 32 | 53.52 × 32 | 65.23 × 32 |
| **action** edge from shell (t r b l) | 0 23 0 0 | 0 23.99 0 0 | 0 27 0 0 | 0 27 0 0 | 0 33 0 0 | 0 27 0 0 | 0 35 0 0 |
| **action** padding | 0 8.74 0 8.74 | 0 8 0 8 | 0 10.03 0 10.03 | 0 10.03 0 10.03 | 0 10 0 10 | 0 10.03 0 10.03 | 0 10 0 10 |
| **action** border | 1 solid rgba(0, 0, 0, 0) | 0 | 1 solid rgba(0, 0, 0, 0) | 1 solid rgb(243, 243, 243) | 1 solid rgba(0, 0, 0, 0) | 1 solid color(srgb 0.886275 0.886275 0.886275) | 1 solid lab(90.952 0 -0.0000119209) |
| **action** radius | 6px 0px 0px 6px | 6px 0px 0px 6px | 8px 0px 0px 8px | 8px 0px 0px 8px | 10px 0px 0px 10px | 8px 0px 0px 8px | 10px 0px 0px 10px |
| **action** font | 12px/16px 500 Geist | 14px/21px 500 ui-sans-serif | 14px/20px 500 Geist | 14px/20px 400 Geist | 14px/20px 500 Geist | 14px/20px 400 Geist | 14px/20px 500 Geist |
| **action** background | rgb(40, 40, 40) | rgb(39, 131, 222) | rgb(92, 93, 254) | rgb(247, 247, 247) | lab(96.52 -0.0000298023 0.0000119209) | rgb(255, 255, 255) | lab(100 0 0) |
| **menu** size | 24 × 28 | 23.99 × 27.99 | 28 × 32 | 28 × 32 | 32 × 32 | 28 × 32 | 35 × 32 |
| **menu** edge from shell (t r b l) | 0 0 0 46.18 | 0 0 0 45.33 | 0 0 0 50.64 | 0 0 0 52.52 | 0 0 0 66.71 | 0 0 0 52.52 | 0 0 0 65.23 |
| **menu** padding | 0 | 0 | 0 | 0 | 0 | 0 | 0 10 0 8 |
| **menu** border | 1 solid rgba(0, 0, 0, 0) | 0 | 1 solid rgba(0, 0, 0, 0) | 1 solid rgb(243, 243, 243) | 1 1 1 0 solid rgba(0, 0, 0, 0) | 1 solid color(srgb 0.886275 0.886275 0.886275) | 1 1 1 0 solid lab(90.952 0 -0.0000119209) |
| **menu** radius | 0px 6px 6px 0px | 0px 6px 6px 0px | 0px 8px 8px 0px | 0px 8px 8px 0px | 0px 10px 10px 0px | 0px 8px 8px 0px | 0px 10px 10px 0px |
| **menu** background | rgb(40, 40, 40) | rgb(39, 131, 222) | rgb(92, 93, 254) | rgb(247, 247, 247) | lab(96.52 -0.0000298023 0.0000119209) | rgb(255, 255, 255) | lab(100 0 0) |
| **menu** shadow |  | rgba(28, 19, 1, 0.11) 1px 0px 0px 0px inset |  |  |  |  |  |
| **icon** size | 16 × 16 | 16 × 16 | 16 × 16 | 16 × 16 | 16 × 16 | 16 × 16 | 16 × 16 |
| **icon** edge from shell (t r b l) | 6 4 6 50.18 | 7 4 4.99 49.32 | 8 6 8 56.64 | 8 6 8 58.52 | 8 8.5 8 74.21 | 8 6 8 58.52 | 8 11 8 73.23 |
| **icon** padding | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **icon** border | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **icon** radius | 0px | 0px | 0px | 0px | 0px | 0px | 0px |

Notion's menu surface:

| slot · property | notion · split-menu-surface · open · light |
|---|---|
| **shell** size | 360 × 228.91 |
| **shell** padding | 0 |
| **shell** border | 0 |
| **shell** radius | 10px |
| **shell** background | rgb(255, 255, 255) |
| **shell** shadow | rgba(25, 25, 25, 0.05) 0px 20px 24px 0px, rgba(25, 25, 25, 0.027) 0px 5px 8px 0px, rgba(42, 28, 0, 0.07) 0px 0px 0px 1px |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| structure | standalone `SplitButton` of two Buttons | Survey: product-scale systems (Fluent, Material, Carbon, Atlassian) | — |
| trigger width | **height − 4** (24 / 28 / 36) | Notion 24 at 28 | shadcn uses a square (32) or 35 |
| chevron | Area chevron glyph, 16, centred | Notion 16px chevron centred in 24 | — |
| divider | **1px, full height** | Notion (inset line, full height); shadcn separator (full height) | — |
| divider paint · solid | label ink at 24% | Fluent draws its on-brand stroke; Area's near-black solid would lose Notion's dark 11% line | Notion is darker than its fill; one rule must serve near-black and coloured fills |
| divider paint · soft, outline | tone control line (`--_line`, neutral 226) | shadcn separator and outline borders (lab 90.95 ≈ 226) | — |
| action | Button unchanged (label, icon, insets) | Button spec | Notion's 28px part is 8px sides with 14px text; Area's sm is 12px text (Button's scale) |
| hover | each part on its own | Notion: hovering one part leaves the other at rest | — |
| menu position | 4px below, aligned to the group's end edge; flips when it would overflow | Notion 3.99 below, 0.33 from the end | — |
| menu surface | Area Menu (radius, shadow, inset) | Peer Menu | Notion 10px radius, 360 wide |

## Behavior and accessibility

- Group: `role="group"`. Both parts are native buttons in the Tab order.
- Trigger: its own name (`menuLabel`, default "More options"), `aria-haspopup="menu"`,
  `aria-expanded`, `aria-controls`; `popovertarget` opens a native `popover="auto"` menu
  (Escape, light dismiss and focus return come from the platform).
- Keyboard: Enter/Space or ArrowDown on the trigger opens the menu and focuses the first item;
  ArrowUp opens it on the last. In the menu, ArrowUp/Down wrap, Home/End jump, Tab closes.
  Choosing an item runs it, closes the menu and returns focus to the trigger (verified in the
  gallery 2026-09-26).
- Disabled disables both parts. Reduced motion stops the chevron's turn.

## Verification

- 11 Notion and shadcn captures, 4 Area captures; checksums verified.
- React tests (`test:split-button`, 3): names, popover wiring, prop pass-through, disabled.
- Gallery: all eight tiles render; keyboard and pointer behaviour checked on screen; the
  menu opens 4px below and flips at the viewport edge.
- Unverified: dark theme, screen reader announcement, forced colors, RTL divider position.

## Feedback log

- 2026-09-26 · owner: separate component if systems usually do; build ButtonGroup and
  SplitButton → survey (4 standalone, 5 composition, 1 dropdown prop, 5 none, 0 Button
  variant); SplitButton built standalone.
