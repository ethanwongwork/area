# Menu spec

**Status:** in review · 2026-09-26 (cohesion audit, second pass)
**Captures:** `docs/research/captures/menu/`
**Peers:** Nav and Tree view (row plates, label rows), Select picker (option plates, lift),
Popover (surface), Kbd (shortcut), Button ghost (hover plate)

## Owner decisions

- No Menu section existed in [prior decisions](PRIOR_DECISIONS.md).
- 2026-09-26: Neutral by default, accent by override ([design system](../DESIGN_SYSTEM.md#color-and-focus)).
  Menu selection is a neutral plate; Menu has no accent option.
- 2026-09-26: Decide every open item with the most calculated option consistent with the
  system ([second pass](../research/cohesion-audit.md#second-pass-notion-figma-and-the-open-decisions)).
  For Menu: minimum width 256 (Notion's page menu), the 2px leading-icon nudge removed,
  separators on the new `border-divider` role.

## Job and boundaries

Menu lists actions opened from a trigger: rows with an optional icon and shortcut, group
labels, separators, a destructive tone, and a searchable composition. It is not navigation
(Nav: destinations and the current page) or a value picker (Select). Opening, anchoring,
roving focus and dismissal belong to the consumer, as for Popover.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| item tone | danger | Destructive actions | Area earlier value; not in Untitled; no product capture |
| composition | shortcuts | Name an action's key | Untitled, Notion (`notion--item-shortcut` node 11) and Figma (`figma--item--rest` node 8): plain text |
| state | selected | An option menu's current choice | Figma format menu and main menu (24px check column, `figma--item--rest` node 2) |
| composition | search, controls, nested submenu | Filter a long menu; toggles in a settings menu; a submenu trigger | Notion page menu: a 232 × 28 search field (`notion--page-menu--open` nodes 4-5) and switches (`switch/notion--menu-switch-off--rest`); ChatGPT 16px trailing chevron (`chatgpt--menu--rest` node 53) |
| state | disabled | Unavailable action | Untitled (50%) |

No size axis: row height follows the density axis. Gallery groups
(`apps/docs/scripts/build.mjs:728-737`): Default; Content (shortcuts, search, nested
submenu, controls); States (selected, disabled); Tones (danger).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | Profile menu, one hovered item | chatgpt.com, owner's session, 2026-09-26 | evidence only | `baseline/chatgpt--menu--rest--light`, `baseline/chatgpt--menu-item--hover--light` |
| notion | target product | Page "…" menu open (search, toggles, grouped rows), a hovered item, a shortcut item; older date-filter preset rows | app.notion.com page menu, 2026-09-26 (second pass); Calendar pass | evidence only | `menu/notion--page-menu--open--light`, `menu/notion--item--hover--light`, `menu/notion--item-shortcut--rest--light`, `input/notion--menu-search--focus--light`, `switch/notion--menu-switch-off--rest--light`, `calendar/notion--search-date-filter-popover--rest--light` |
| figma | target product | Editor main menu (dark), an item at rest and hovered; older colour format menu | figma.com editor, 2026-09-26 (second pass); ColorPicker pass | evidence only | `menu/figma--main-menu--open--light`, `menu/figma--item--{rest,hover}--light`, `color-picker/figma--format-menu--open--light` |
| uui | design system (source) | Dropdown menu | [reference](../research/untitled-ui-reference.md), `dropdown.tsx:85-190` @ `4702dc0` | MIT | — |
| area | this system | 8 gallery tiles after the second pass | localhost gallery | — | `menu/area--*` (8) |

Light theme only (Figma's main menu is dark inside it). The Figma main-menu capture stops at
its five groups, so its rows come from the item captures. No product destructive row was captured.

## Anatomy

```
chatgpt  menu 324 wide, padding 10, radius 16; rows 36, radius 12; sep 1px 10% black 8px in
notion   div[role=dialog] 256 wide, radius 10, white, lift + 1px ring          (page-menu node 0)
  section  padding 4 (first: 8 4 4 4, holding the 232 × 28 search), row gap 1  (nodes 3, 7, 9)
  item   div[role=option] 248 × 28, radius 6, padding 0/8, gap 8               (item--hover nodes 0-1)
    icon 20px, rgb(56, 56, 54); text 14/16.8 400 rgb(44, 44, 43) at 36          (nodes 2-6)
    shortcut 12px plain text rgb(161, 158, 153), 8px from the end             (item-shortcut node 11)
  sep    1px rgba(42, 28, 0, .07), 12px in from each side, at a section's top (page-menu node 16)
figma    194.3 wide, radius 13, rgb(30, 30, 30); items 178.3 × 24 (8px in), radius 5,
         11/16 450; 4px lead + 24px check/icon box (70% white), text at 32   (item--rest)
area     div.area-menu[role=menu] padding 4, 1px border, radius 12, gap 2, min 256 wide
  item   button.area-menu__item 32px, radius 8, gap 8; text inset by inset.css
    icon 16px slot; text truncates; shortcut 12px text in Kbd's keyboard face, a quiet Kbd or a 16px glyph
  label  .area-menu__label 32px, fg-muted
  sep    .area-menu__separator 1px `border-divider`, 8px margins
```

Inset equations (outer inset = border + shell padding + slot inset):
- text start: 1 + 4 + (32 − 1cap)/2 = 1 + 4 + 11.03 = 16.03 (`area--default`: text at 16.02).
- trailing Kbd: 1 + 4 + (32 − 20)/2 = 11 (`area--shortcuts`: Kbd ends 11px from the edge).
- trailing 16px glyph: 1 + 4 + 8 = 13 (`area--selected`: check ends 13px from the edge).
- leading icon: 1 + 4 + (32 − 16)/2 = 13, the inset contract (`inset.css:88`), as Nav. The
  10px override in `surface.css` was removed in the second pass. No gallery tile has icons.
- item radius: min(max(0, 12 − 4), 32 × 0.4) = 8 (`surface.css:493-496`; captured 8px);
  Notion follows the same rule (10 − 4 = 6).

## Measurements

`node scripts/capture-compare.mjs --slots shell menu/notion--page-menu--open--light.json menu/figma--main-menu--open--light.json menu/area--default--rest--light.json` (trimmed):

| slot · property | notion · page-menu · open | figma · main-menu · open | area · default |
|---|---|---|---|
| **shell** size | 256 × 680.89 | 194.3 × 468 | 256 × 110 |
| **shell** padding | 0 (sections 4) | 0 | 4 |
| **shell** border | 0 | 0 | 1 solid rgb(243, 243, 243) |
| **shell** radius | 10px | 13px | 12px |
| **shell** shadow | rgba(25, 25, 25, 0.05) 0px 20px 24px 0px, rgba(25, 25, 25, 0.027) 0px 5px 8px 0px, rgba(42, 28, 0, 0.07) 0px 0px 0px 1px | rgba(0, 0, 0, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.12) 0px 10px 16px 0px, rgba(0, 0, 0, 0.12) 0px 0px 0.5px 0px | rgba(0, 0, 0, 0.06) 0px 20px 24px 0px, color(srgb 0 0 0 / 0.03) 0px 5px 8px 0px |

`node scripts/capture-compare.mjs --slots shell baseline/chatgpt--menu-item--hover--light.json menu/notion--item--hover--light.json menu/figma--item--{rest,hover}--light.json` (trimmed):

| slot · property | chatgpt · menu-item · hover | notion · item · hover | figma · item · rest | figma · item · hover |
|---|---|---|---|---|
| **shell** size | 304 × 36 | 248.01 × 27.99 | 178.3 × 24 | 178.3 × 24 |
| **shell** padding | 6 10 6 10 | 0 (inner row 0 8) | 0 8 0 0 | 0 8 0 0 |
| **shell** radius | 12px | 6px | 5px | 5px |
| **shell** font | 14px/20px 400 | 16px/24px 400 (text 14/16.8) | 11px/16px 450 Inter | 11px/16px 450 Inter |
| **shell** color | rgb(13, 13, 13) | rgb(44, 44, 43) | rgb(255, 255, 255) | rgb(255, 255, 255) |
| **shell** background | rgba(0, 0, 0, 0.05) | color(srgb 0.129 0.106 0.090 / 0.051) | — | rgb(12, 140, 233) |

Area rows (node trees): items 246 × 32, radius 8, padding 0 / 11.03, 14/20; selected fill
rgb(238, 238, 238); danger ink rgb(207, 3, 60); disabled opacity 0.5; label rgb(102, 102, 102).
Figma's hover also lifts the icon and shortcut ink from 70% to 80% white (`figma--item--hover` nodes 2, 7).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| surface · radius | 12 (`radius-container`) | Peers Popover, Dialog, Toast (container role) | Notion 10, Figma 13, ChatGPT 16; Untitled 8 |
| surface · inset | 4 (`space-4`) | Notion 4 (primary for lists); Untitled 4 block | ChatGPT 10; Figma 8 inline |
| surface · edge | 1px `border-decorative` light-dark(#f3f3f3, #282828) | Notion 1px ring, ChatGPT and Figma 0.5px rings | Area paints a border rather than a ring |
| surface · fill | `bg-surface` #ffffff (opaque) | Notion white | ChatGPT white 90% + blur; Figma's main menu is dark in light mode |
| surface · shadow | floating lift `0 20px 24px` + `0 5px 8px`, `shadow-color` full and half | Notion page menu (same geometry, `notion--page-menu--open`) | Figma `0 2 5 .15, 0 10 16 .12` agrees on a deep soft blur |
| surface · min width | **256** (`space-96 × 2 + space-64`, `/* spec */`, `surface.css:474`; search surface the same, `surface.css:614`) | Notion page menu 256 (primary product for menus) | Was 224, unsourced (the search surface kept 224 until the third pass); Untitled 248, Figma 194, ChatGPT 324 |
| item · height | 32 (`control-md`) | Peers Nav, Tree view | Notion 28, Figma 24, ChatGPT 36, Untitled 36; density is the UI-scale axis's job (second pass, item 18) |
| item · radius | 8, concentric (12 − 4) | Area concentric rule; Notion 6 = 10 − 4 | ChatGPT 12 on 16 and Figma 5 on 13 are not concentric |
| item · pitch gap | 2 | Untitled 2 (38 pitch, 36 rows) | Notion 1, ChatGPT 0, Figma 0 |
| item · text | 14/20 400 `fg-default` | ChatGPT 14/20 400; Notion 14 400 | Figma 11/16 450 (editor density) |
| item · icon, gap | 16 (`icon-md`), 8 (`gap-md`) | Untitled 16 / 8; Notion gap 8 | Notion and ChatGPT icons 20; Figma 24 box with 8 to text |
| item · leading inset | **8**, the inset contract | Second pass (item 4); Nav; Notion 8 | Was 10 (a 2px optical nudge) |
| item · hover | `bg-component-hover` #f3f3f3 / #333333; ink fixed | Row-plate rule; Notion 5% warm (`notion--item--hover`), ChatGPT 5% black | Figma paints its accent blue (dark menu) and lifts secondary ink |
| item · selected | `bg-component-active` #eeeeee / #3f3f3f | Selection one step above hover | ChatGPT and Untitled use one fill for both |
| danger | ink `fg-danger` #cf033c / #ffc9cb, fixed; hover plate `danger-surface` #fbf5f5 / #820022 | Foreground fixed on hover; earlier Area value | — |
| disabled | whole row 50% | Audit disabled rule; Untitled 50% | — |
| separator | 1px **`border-divider`** #e2e2e2 / #333333, 8px block and inline margins | Second pass divider role (ChatGPT 10% black, Figma #e6) | Was `border-decorative`. Notion's page-menu rules are lighter, 7% (#f0); #e2 kept as the nearest rung to #e5–#e6 (third pass) |
| shortcut | 12px `fg-muted` text in **`font-keyboard`**, Kbd's face (`surface.css:597-605`), or a quiet Kbd | Untitled, Notion, Figma: plain 12 / 11px text in the UI sans | Was monospace (third pass). Notion's ink is tertiary rgb(161, 158, 153); Area keeps `fg-muted` |
| label | 32px, 14/20 400 `fg-muted`, text-aligned with items | Peer Nav label | Untitled's 12px bold uppercase not adopted |

Settled in the third pass ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)):
1. Separator ink: kept at `border-divider` #e2e2e2. Notion's page-menu separators are
   `rgba(42, 28, 0, .07)`, about #f0efed on white (`notion--page-menu--open` nodes 16, 21),
   not the 11% the second pass cited (that was the outline-button edge). #e2 is the divider
   role, the nearest rung to ChatGPT, Figma and Untitled's #e5–#e6.
2. Shortcut face: changed from monospace to Kbd's keyboard face (`font-keyboard`,
   `surface.css:604`). Notion (12px) and Figma (11px) set shortcuts in the UI sans.
3. Search surface width: changed from 224 to Menu's own 256 (`surface.css:614`). The two
   surfaces are one menu.

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover / `data-highlighted` | plate `bg-component-hover`; ink fixed; not on a selected item | `notion--item--hover` (5% warm), `chatgpt--menu-item--hover` (5% black); `surface.css:508-511` |
| focus-visible | 2px `focus-color` ring inset by its width | `surface.css:514-517`; Notion's field focus is a 2px blue ring (`input/notion--menu-search--focus`) |
| selected (`data-selected`) | plate `bg-component-active`, kept under the pointer | `area--selected` rgb(238); `surface.css:532-536` |
| danger hover | plate `danger-surface`; ink fixed | `surface.css:539-543` |
| disabled | opacity 0.5, `not-allowed` | `area--disabled` |

## Behavior and accessibility

`Menu` renders `div[role=menu]`; `MenuItem` a `button[role=menuitem]`, native `disabled` plus
`data-disabled` (`primitives.tsx:759-803`). With a `trigger` it follows the ARIA menu button
pattern: arrows, Home, End, typeahead, Escape, Tab and item choice (2026-09-27; see
[overlay behavior](overlay.md)). `MenuSearch` keeps the input outside `role=menu`. A selected item sets only
`data-selected`, with no `aria-checked`/`menuitemradio`. `MenuSeparator` has
`role=separator`. Notion's page menu is `role=dialog` with `listbox`/`option` rows; Figma's
is `ul[role=menu]` with `group` sections. Forced colours and RTL: not verified.

## Peers and consistency

| Peer | Shared role | Peer value | Menu | Match / reason |
|---|---|---|---|---|
| Nav, Tree view | row height, radius | 32, 8 | 32, 8 | match |
| Nav, Tree view, Table, Select | hover / selected plates | `bg-component-hover` / `-active` | same | match |
| Nav | leading icon inset | 8 (inset contract) | 8 | match (the nudge is gone) |
| Nav | group label | 32px, 14/20 400 `fg-muted` | same | match (Nav starts at 8, Menu at the text inset) |
| Popover, Dialog, Toast, Select picker | floating lift, radius 12, 1px decorative edge | shared lift | same | match; inset differs by content (4 rows vs 12 prose) |

Baseline ([BASELINE.md](../research/BASELINE.md)): rows are 24 (Figma), 28 (Notion), 36
(ChatGPT), all hovering at about 5%; Area is concentric at 32.

## Visual pass

Not inspected in this spec pass. Unverified: Notion and Figma side by side on screen, dark
products, keyboard focus on screen, a leading icon at the new inset (no tile has one).

## Verification

Compared the ChatGPT, Notion and Figma captures above with 8 Area captures (`menu/area--*`,
re-taken after the second pass). Build and test results are in
[the audit](../research/cohesion-audit.md#verification). Area hover, focus and danger states
were read from the CSS, not captured.

## Feedback log

- 2026-09-26 · cohesion audit → hover `bg-hover` → `bg-component-hover`; danger label fixed at
  `fg-danger`; `shadow-2` → floating lift (menu and search surface) → 8 Area captures,
  `chatgpt--menu-item--hover`, `chatgpt--menu--rest`.
- 2026-09-26 · found while writing this spec → the hover rule outranked `[data-selected]`, lightening a selected item under the pointer; items had no keyboard focus ring → hover excludes selected items (tested in `cohesion.test.mjs`); focus-visible draws the shared ring inset → `surface.css`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → minimum width 224 →
  256; leading-icon inset 10 → 8; separators `border-decorative` → `border-divider`; open
  questions on separator ink, shortcut face and the search surface's width →
  `notion--page-menu--open`, `notion--item--hover`, `notion--item-shortcut--rest`,
  `figma--main-menu--open`, `figma--item--{rest,hover}`.
- 2026-09-27 · third pass → search surface minimum 256 (was 224); shortcut text in Kbd's
  keyboard face (was monospace); separator `border-divider` kept, Notion's rules corrected
  to 7% → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
