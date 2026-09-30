# D — Navigation and list families audit

Families: Nav, Menu, Context menu, Tree view, Tabs, Breadcrumb, Command palette (peers compared: Select options, Combobox options, Segmented, Table rows, Kbd, ghost Button).
Method: read-only reading of CSS, manifest, React, gallery demos, tests, specs, DESIGN_SYSTEM.md, inset.css, cohesion audit and handoff. Token values come from the built `packages/styles/dist/area.css` (default theme, light). No browser rendering was done, so anything visual is worked out from the CSS and marked "computed" where it matters.

## Summary

- The shared row model (32px rows, `bg-component-hover` / `-active` plates, neutral markers, one floating lift) mostly holds. The main break is in **Tree view**: a selected row loses its plate under the pointer (a specificity bug), disabled rows grey their text instead of dimming to 50%, and resting rows use the muted ink while Nav switched to the default ink. The Tree spec's reason for that ink ("peer Nav rgb 102") is no longer true.
- **The list families disagree on row geometry.** Icon-to-label gap is Nav 8, Menu/Palette/Combobox 12 (fixed even in compact), Tree 6 and Select 8. Text-only row insets and group-label columns also differ, and there are three focus indicators. Each family's choice is sourced, but they come from the same products read in different ways.
- **Shortcuts, selection and submenus are not systematized.** Menus render shortcuts four ways (string, and Kbd at normal/small, quiet/default), in two fonts at weights 400 and 500. A 500 label with no fill breaks the weight rule, and 11px is off the type ramp. There are three selection models (raw `data-selected` with a Fluent check, `checked`, and a role override to `menuitemradio`). The Submenu tile is two static menus, with no behavior behind it.
- **Owner decisions have outrun the rules and the specs.** The Nav section title is 14/20 at weight 500, but DESIGN_SYSTEM allows 500 only on fills. The Menu CSS and specs still claim "one label pattern with Nav". Most of these specs carry stale values or peer claims (listed in D-26).
- **Interaction gaps:** there are three menu keyboard handlers with different typeahead timing and different close-on-check behavior. A Menu with a `trigger` drops the consumer's `onKeyDown`, `onClick`, `id` and `aria-labelledby`. Chevrons are not mirrored in RTL (Tree, Nav). In forced colors, Nav current, the Nav marker, Tree selection and Menu `data-selected` all become invisible.

## Findings

### D-1  Nav section title weight 500 breaks the weight rule and splits the "one label pattern"
- Families: nav, menu, command-palette, context-menu (Combobox and Select peers)
- Category: system-rule
- Severity: medium
- Type: DECISION
- What: The owner took the Nav group title from ChatGPT (14/20, weight 500, muted). DESIGN_SYSTEM allows 500 only for labels on fills. Menu, Palette, Combobox and Context menu keep 12/16 at 400, and their CSS comments and specs still describe one shared pattern with Nav.
- Evidence:
  - `nav.css:80-83`: `color: fg-muted; font-size: ui-size; font-weight: var(--area-weight-strong); /* spec: ChatGPT 500 */`
  - `surface.css:1111-1124` Menu label: 12/16 (`text-xs`), `weight-regular`. The comment says "one label pattern with Nav" and "Menu, Combobox, Command palette and Context menu share it". The comment at `:1106-1110` still says "the item's size ... regular weight ... See nav.css".
  - `DESIGN_SYSTEM.md:41-44`: "400 for text and every title or heading; 500 only for labels on fills".
  - `docs/specs/nav.md:135-136`: "Menu's label is the same, and the two stay one pattern" (stale). `menu.md:117-119`: "Group labels now follow Nav's: 12/16" (stale).
  - Select optgroup is a third form: 14/20, 400, in a 32 grid row (`navigation.css:358-364`).

  | Family | Label type | Weight | Start column |
  |---|---|---|---|
  | Nav | 14/20 muted | 500 | 8 (icon column, `inset.css:52`) |
  | Menu / Palette / Combobox / Context | 12/16 muted | 400 | ≈11.7 (cap-centred, see D-15) |
  | Select optgroup | 14/20 muted | 400 | picker padding |
- Options:
  - A: Keep the split and amend DESIGN_SYSTEM: "500 is also allowed for a section title the size of its rows" (Nav, and Popover's title, which is also 500). Fix the Menu comments and specs.
  - B: Nav titles back to 400 at 14/20 muted. Ink and position then set them apart, and the weight rule holds as written.
  - C: One label for all lists at 12/16 400 muted, which was the owner's first Nav message.
  - Recommended: A. Both owner messages are recent and explicit ("get the nav titles from ChatGPT"). The rule, not the component, is stale, and Popover's strong title already needs the same exception. Whichever option is chosen, remove the "one pattern" claims.
- Visual: A Nav sidebar group and a Menu group side by side, labels at their real weight and size, with the icon and text columns ruled.

### D-2  List rows put the label column in different places
- Families: nav, menu, command-palette, context-menu, tree-view (Select, Combobox peers)
- Category: consistency
- Severity: medium
- Type: DECISION
- What: The families read the same product evidence (labels at about 36 in ChatGPT and Notion, with 20px icons) in two ways. Menu keeps the 36 column (gap 12). Nav keeps the 8 gap (text at 32). Tree uses 6. Menu's gap is a literal 12px, so it does not follow compact density, while Nav's `gap-md` drops to 6.
- Evidence:

  | Family | Row | Icon at | Icon→label | Text column (icon row) | Text-only row start |
  |---|---|---|---|---|---|
  | Nav | 32 | 8 | `gap-md` 8 (compact 6) (`inset.css:59`; `nav.css:89` 8 is overridden) | 32 | 8 (icon column, `inset.css:56`) |
  | Menu / Context menu | 32 | 8 | 12px literal (`surface.css:989`, `inset.css:62`) | 36 | 11.03 (cap-centred) |
  | Command palette | 32 | 8 (+4 list inset) | `space-12` (`command-palette.css:28`) | 36 | 11.03 |
  | Combobox options | 32 | 8 | 12 (Menu rows) | 36 | 11.03 |
  | Tree view | 32 | 30 (after 16 chevron + 6) | 6 literal (`tree-view.css:18`) | 52 (30 with no icon) | 8 + chevron slot |
  | Select option (base-select) | ≥32 | 8 | `space-8` (`navigation.css:338-342`) | 32 | 8 |
  - Specs: `nav.md:117` "Notion and Figma 8 icon-to-text". `menu.md:90` "ChatGPT and Notion both start the label at 36".
- Options:
  - A: One label column for every icon row: 36 (gap 12) in Nav, Menu, Palette, Combobox and Select; Tree keeps its own column grid.
  - B: One gap: 8 (`gap-md`) everywhere, so Menu and Palette text move to 32 and follow density.
  - C: Keep as is and record it as intentional (Menu is a surface, Nav is a sidebar).
  - Recommended: A. Both products' measured label column is 36 for menus and for sidebars (Notion sidebar text at 38, `nav.md:71-72`). Nav's "8 gap" comes from 20px icons, and applying it to Area's 16px icons is what put text at 32. Make the gap a density token rather than a 12px literal.
- Visual: Nav, Menu, Palette, Tree and Select option rows stacked with a vertical rule at 32 / 36 / 52 to show where each label starts.

### D-3  Tree view rests in muted ink; Nav moved to default
- Families: tree-view, nav (Menu, Palette, Table peers)
- Category: consistency
- Severity: medium
- Type: DECISION
- What: Tree rows rest in `fg-muted` "as Nav". On 2026-09-27 Nav switched to `fg-default` (ChatGPT's sidebar rows). Tree is now the only list family whose resting rows are muted, and its recorded reason no longer holds.
- Evidence: `tree-view.css:9-10` (`color: fg-muted`, comment "as Nav (102)"). `nav.css:100-103` (`color: fg-default`). `tree-view.md:87` ("Peer Nav rgb(102)"). `nav.md:167` still says "Tree view rest ink `fg-muted` ... match".

  | Rows at rest | Ink |
  |---|---|
  | Nav, Menu, Palette, Combobox, Select option, Table | `fg-default` #282828 |
  | Tree view | `fg-muted` #666666 |
  | Nav `selection="marker"` | `fg-muted` (intentional: ink marks current) |
- Options:
  - A: Tree rests in `fg-default` like Nav, and current or selected is shown by the plate alone.
  - B: Keep muted (Notion's sidebar tree is rgb 95) and record Notion as the basis, not Nav.
  - Recommended: A. Tree and Nav are the "Navigation lists" batch, the spec's reason is gone, and file and layer trees in Figma and ChatGPT's sidebar use body ink.
- Visual: A Nav and a Tree view side by side at rest, one row current, showing the ink difference.

### D-4  A selected Tree row loses its plate under the pointer
- Families: tree-view
- Category: system-rule
- Severity: high
- Type: FIX
- What: The hover rule excludes `aria-current` rows but not `aria-selected` rows, and its specificity (0,4,0) beats the selection rule (0,3,0). A selected row that is not current, such as the Layers tile, drops from `#eeeeee` to `#f3f3f3` on hover. DESIGN_SYSTEM says selection stays one step firmer "under the pointer". The cohesion test only checks that the hover rule paints `bg-component-hover`, so it does not catch this.
- Evidence:
  - `tree-view.css:44`: `.area-tree-view [role="treeitem"]:hover:not([data-disabled], [aria-current="page"])` → hover.
  - `tree-view.css:45-46`: `[aria-selected="true"]`, `[aria-current="page"]` → `--_tree-selection`.
  - Gallery `GalleryTreeViewLayers` (`gallery.tsx:2129-2143`) passes `selectedIds` with no `currentId`.
  - `cohesion.test.mjs:25-27` claims every hover selector "excludes the selected or current row".
  - Related: in checkbox mode `--_tree-selection` is `bg-component` #f7 (`tree-view.css:26`), lighter than hover. It still paints an `aria-current` row if one is passed.
- Visual: The Layers tile with the selected row at rest (#ee) and under the pointer (#f3), next to a Nav current row under the pointer (#ee).

### D-5  Tree view disabled rows use disabled ink, not the 50% dim
- Families: tree-view (peers Nav, Menu, Tabs)
- Category: system-rule
- Severity: medium
- Type: FIX
- What: DESIGN_SYSTEM says rows dim to 50% as a whole. Tree greys only the text, so its icon, chevron and trailing text stay at full strength.
- Evidence: `tree-view.css:49`: `[data-disabled] { color: var(--area-fg-disabled); cursor: not-allowed; }`. The trailing text and icons have their own `fg-muted` (`:69`, `:72`). Nav, Menu and Tabs use `opacity: 0.5` (`nav.css:173-176`, `surface.css:1045-1048`, `navigation.css:109-112`). `DESIGN_SYSTEM.md:71`. The Select option has the same issue (`navigation.css:356`, other agent).
- Visual: The Tree "Disabled row" tile beside the Nav disabled tile: grey text with a full-ink icon, against a whole row at 50%.

### D-6  Hover plates of nested controls vanish on a hovered row and show as holes on a current row
- Families: tree-view, nav (ghost Button inside rows)
- Category: visual
- Severity: medium
- Type: DECISION
- What: The Tree chevron's hover plate and the neutral ghost Buttons in Nav and Tree row actions all hover with `bg-component-hover`. So does the row they sit on. On a hovered row the nested plate is invisible, which is exactly when the pointer is over it. On a current row (#ee) the nested plate (#f3) paints lighter, like a hole. The cohesion audit moved rows to `bg-component-hover` after the owner approved the chevron plate (Tree pass 2), so this is a regression the audit introduced.
- Evidence: `tree-view.css:68`. The ghost neutral hover is `bg-component-hover` and pressed is `-active` (`button.css:397-400`). The row plates are at `tree-view.css:44-46`, `nav.css:240-241`. Nav actions: `gallery.tsx:1583-1588`, and the sidebar recipe at `:1541`. DESIGN_SYSTEM (`:66-68`) reserves translucent `bg-hover` for "grounds a component cannot know".

  | Row state | Row fill | Nested hover fill | Result |
  |---|---|---|---|
  | hovered | #f3f3f3 | #f3f3f3 | invisible |
  | current / selected | #eeeeee | #f3f3f3 | lighter hole |
- Options:
  - A: Nested row controls hover with the translucent `bg-hover` (5%, which composites one step above any row fill), as the rule itself prescribes for unknown grounds.
  - B: Nested controls hover with `bg-component-active`, which is still invisible on current rows.
  - Recommended: A. It is the documented purpose of `bg-hover`, and it works on rest, hover and current rows in both themes.
- Visual: A Tree row and a Nav row with actions, each in three states (rest, hovered, current), with the pointer on the chevron or action.

### D-7  Four different focus indicators on list rows
- Families: menu, command-palette, nav, tree-view, tabs, breadcrumb (Select peer)
- Category: a11y
- Severity: medium
- Type: DECISION
- What: Keyboard focus on a row is shown four ways:
  - Menu and Palette: the hover plate only.
  - Nav and Tree: a 2px ring offset +2 outside the row. The rows are only 2px apart, so the ring covers the neighbouring rows' edges.
  - Tabs and the Select option: an inset ring. The Select option also has a plate.
  - Breadcrumb: a ring that hugs the text while its hover plate reaches 6px past it.
- Evidence: `surface.css:1039-1043` (Menu: plate, `outline: none`). `nav.css:167-170` and `tree-view.css:48` (`outline-offset: var(--area-focus-offset)` = 2px). Row gap `space-2` (`nav.css:23`, `tree-view.css:5`). `navigation.css:102-107` (Tabs, offset −2). `navigation.css:353-355` (Select option: plate plus inset ring). `breadcrumb.css:23-25` (plate inset −2/−6, ring offset +2).
- Options:
  - A: One row focus treatment: an inset 2px focus ring on the row's own radius, plus the hover plate, for every row family. Menu and Palette keep the plate as the active-descendant cue.
  - B: Keep Menu's plate-only focus (ChatGPT and Notion) for menus, and make Nav, Tree and Table use an inset ring instead of the outset one.
  - Recommended: B. Menus follow the product evidence and the APG active-descendant cue. Moving Nav and Tree to an inset ring (offset −2, as Tabs does) stops the overlap onto neighbouring rows. Breadcrumb's ring should follow its hover plate's box.
- Visual: A focused row in Menu, Nav, Tree, Tabs and Breadcrumb, stacked, with the neighbouring rows visible.

### D-8  Menu shortcuts render four ways, two of which break the type rules
- Families: menu, context-menu, command-palette, nav (Kbd peer)
- Category: system-rule
- Severity: medium
- Type: DECISION
- What: The owner approved "plain menu shortcuts" (unboxed). A string shortcut renders 12/16 in the UI font (Geist) at 400. A `Kbd` shortcut renders in `--area-font-keyboard` (system-ui) at weight 500, at 12px (normal) or 11px (small). So an unboxed keycap keeps the 500 meant for "labels on fills" with no fill, and 11px is off the ramp. The context-menu spec says "quiet 12 keycaps", but it renders `Kbd size="small"` at 11px. The end inset also changes with the form: the Kbd box reserves 20/16 (`inset.css:150-151`), while the string gets the cap inset. On a danger row a string shortcut turns red but a Kbd stays muted. Nav trailing Kbd are boxed. The Escape glyph question (⎋ vs "Esc") is still open with the owner.
- Evidence:

  | Where | Form | Font / size / weight |
  |---|---|---|
  | `gallery.tsx:1464` MenuIconRows | `"⌘L"` string | Geist 12/16 400 (`surface.css:1163-1169`) |
  | `gallery.tsx:1364-1368` KbdInMenu, `overlays.tsx:24` | `Kbd` normal (unboxed by `kbd.css:85-91`) | system-ui 12 500 (`kbd.css:10-40`) |
  | `gallery.tsx:1036` Context menu, `CommandPalette.tsx:153` | `Kbd size="small" quiet` | system-ui 11 500 (`kbd.css:63-69`) |
  | `gallery.tsx:1412` MenuShortcuts | `Kbd quiet` (deprecated prop) | system-ui 12 500 |
  | `gallery.tsx:1374-1378` KbdInNav | `Kbd size="small"` boxed | filled keycap in the Nav trailing slot |
  - Danger rows: `kbd.css:109-112` (`.area-menu__item--danger .area-menu__shortcut { color: inherit }`), overridden inside Kbd by `kbd.css:85-91`. Escape: `primitives.tsx` KEY_GLYPHS `escape: "⎋"`, and the Palette footer shows ⎋ Close (`CommandPalette.tsx:195`).
  - `context-menu.md:52-53` says "quiet 12 keycaps". `DESIGN_SYSTEM.md:81-83` still says keycap "radius 4 ... concentric" (the owner changed this to 6, not concentric).
- Options:
  - A: One "menu shortcut" style. In a menu, palette row or Nav trailing slot, a quiet Kbd renders as 12/16 UI font at 400 in muted ink, which a string already does, with the end inset of a text slot. The 500 weight and the keycap font apply only when filled.
  - B: Keep Kbd's own face (system-ui 500), but use size normal (12) everywhere in lists and remove `size="small"` from menus.
  - Escape: A1, write "Esc" (ChatGPT, Notion); A2, keep ⎋.
  - Recommended: A with A1. It meets the weight rule and the one-font rule, and matches Notion ("12px, tertiary, UI font", `menu.md:95`). "Esc" is what both products write, and ⎋ is rarely recognized.
- Visual: One menu row per current form (string, normal, small, small in a danger row) stacked, with the end-edge distance ruled; plus "⎋ Close" beside "Esc Close".

### D-9  Menus have three selection models, and the one in the gallery is not announced
- Families: menu (Combobox, Select, ModelPicker, Composer peers)
- Category: api / a11y
- Severity: medium
- Type: DECISION
- What: MenuItem has no `selected` or radio prop. The Selected tile and the Composer's mode menu fake selection with a raw `data-selected` (active plate) and a Fluent `CheckIcon` in the shortcut slot. That is not announced, and the check is a different glyph. `checked` makes a `menuitemcheckbox` with the Area check and no plate. ModelPicker overrides `role="menuitemradio"`. Combobox shows a check with no plate, and Select shows plate plus checkmark.
- Evidence: `gallery.tsx:1414-1421`, `:2154` (`data-selected` + `shortcut={<CheckIcon/>}`). `primitives.tsx:1127-1172` (MenuItem props: `checked` → `menuitemcheckbox`; no radio). `ModelPicker.tsx:69` (`role="menuitemradio" checked=…`). `Combobox.tsx:199-208` (`data-selected={undefined}`, check only). `navigation.css:353-357` (Select: plate + `::checkmark`). The manifest lists state `selected` for menu (`manifest.ts:562`).

  | Pattern | Plate | Mark | Announced |
  |---|---|---|---|
  | Menu tile / Composer (`data-selected`) | active #ee | Fluent check in the shortcut slot | no |
  | `MenuItem checked` | none | Area check glyph | checkbox |
  | ModelPicker | none | Area check | radio (by role override) |
  | Combobox option | none | Area check | `aria-selected` |
  | Select option | active #ee | native checkmark | native |
- Options:
  - A: Add `MenuItem selected` (or `type="radio"`) → `menuitemradio` + `aria-checked`, trailing Area check, no plate. The same as Combobox. Retire `data-selected` for menus.
  - B: As A, but selected rows also carry the active plate (as Select does).
  - Recommended: A. The plate is the pointer and keyboard highlight in menus. A second, firmer plate for selection competes with it, and Combobox and ModelPicker (both approved) already use the check alone.
- Visual: The five patterns as five small menus, one selected row each.

### D-10  Submenu is listed and tiled but not built
- Families: menu, context-menu
- Category: interaction
- Severity: medium
- Type: DECISION
- What: The Menu spec lists "submenu" as a composition. The gallery tile is two static Menus placed side by side. The parent row carries a Fluent arrow (→, not a chevron) in the shortcut slot and a forced `data-highlighted`. There is no `aria-haspopup`, no Right/Left keys and no RTL mirroring. The Menu spec's Verification says submenu keys are "not implemented", and the handoff lists them as open.
- Evidence: `gallery.tsx:1435-1450` (`shortcut={<ArrowIcon />} data-highlighted`, second menu offset by a literal calc). `menu.md:33`, `:127-128`. `icons.tsx:70-75` (ArrowIcon = Fluent `arrow_right_16`). `primitives.tsx:1086` only defers to "a nested submenu".
- Options:
  - A: Build `MenuSub` (trigger row with `aria-haspopup="menu"`, Right/Enter opens, Left/Escape closes, hover intent, anchored beside the row, a chevron mirrored in RTL).
  - B: Remove the submenu tile and variant until it is built.
  - Recommended: A if Context menu is expected to match Notion's page menu (which has submenus). Otherwise B, because the current tile shows behavior that does not exist.
- Visual: The current submenu tile beside a mockup of an Area chevron submenu indicator in LTR and RTL.

### D-11  Three menu keyboard handlers diverge
- Families: menu, context-menu, tree-view
- Category: interaction
- Severity: medium
- Type: FIX
- What: A hosted Menu, a Menu with a trigger (AnchoredMenu) and TreeView each implement typeahead with a different reset delay. A checkable row closes an anchored Menu but keeps a Context menu open, although MenuItem's own doc says "Hosts keep the menu open for checkable items".
- Evidence:
  - Typeahead reset: 500ms (`primitives.tsx:1100`), 1000ms (`Overlays.tsx:30` `TYPEAHEAD_RESET`, "Radix, React Aria"), 300ms (`TreeView.tsx:111`).
  - Close on checkbox: `Overlays.tsx:150-155` closes on any `[role^='menuitem']` unless `data-keep-open`. `ContextMenu.tsx:93` closes only on `role="menuitem"`. `primitives.tsx:1133-1134` ("Hosts keep the menu open for checkable items").
- Visual: None needed (behavior). A timeline strip of the three reset windows could illustrate it.

### D-12  Menu with `trigger` silently drops consumer props
- Families: menu (ModelPicker and SplitButton use Menu)
- Category: api
- Severity: medium
- Type: FIX
- What: With `trigger`, the surface spreads the consumer's `rest` and then the internal `extra`. So a consumer's `onKeyDown`, `onClick`, `onPointerMove`, `id`, `tabIndex` and `aria-labelledby` are all overwritten. A consumer cannot label the menu or listen for keys on it.
- Evidence: `primitives.tsx:1077`: `<div role="menu" … onKeyDown={onKeyDown} {...rest} {...extra} …>`. `Overlays.tsx:180-189` (`extra` carries `id`, `tabIndex`, `aria-labelledby`, `onKeyDown`, `onClick`, `onPointerMove`).
- Visual: None (API).

### D-13  RTL: chevrons do not mirror; Tree arrows do not reverse
- Families: tree-view, nav (Tabs and Breadcrumb peers do mirror)
- Category: a11y
- Severity: medium
- Type: FIX
- What: A collapsed chevron is a down chevron rotated −90° (physical). In RTL it still points right, into the indent rather than toward the content. Tree's Left/Right keys are not swapped in RTL, but Tabs flips its arrows and Breadcrumb mirrors its chevron.
- Evidence: `tree-view.css:66` (`rotate(-90deg)`). `nav.css:248` (`.area-nav__actions [aria-expanded="false"] svg { rotate: -90deg; }`). No `:dir(rtl)` in either file. `TreeView.tsx:96-105` (fixed ArrowRight / ArrowLeft). Tabs: `primitives.tsx` `rtl ? -1 : 1`. Breadcrumb: `breadcrumb.css:34`. `DESIGN_SYSTEM.md:131` ("Use logical properties so direction follows the enclosing scope").
- Visual: The same collapsed Tree row in LTR and RTL, and the Nav expandable row in RTL.

### D-14  Forced colors erase current, selected and marker states
- Families: nav, tree-view, menu
- Category: a11y
- Severity: medium
- Type: FIX
- What: `forced-colors.css` restores the Menu focus ring and the Tabs indicator only. Nav current, Tree selected or current, and Menu `data-selected` are shown only by a background plate. The Nav marker is a `::before` background. In forced colors all of these disappear, and nothing else shows which page is current.
- Evidence: `forced-colors.css:8-11`, `:62` (Menu focus, Tabs indicator only). `nav.css:135-138`, `:154-165`. `tree-view.css:45-46`. `surface.css:1058-1062`. The Tabs spec (`tabs.md:142`) says "indicator not verified", but it is covered.
- Visual: The Nav default tile and the Nav marker tile with the plate removed, showing no current cue.

### D-15  Menu group labels are off the icon column; the Palette spec says otherwise
- Families: menu, command-palette, combobox, context-menu (Nav peer)
- Category: consistency / docs-drift
- Severity: low
- Type: FIX
- What: `inset.css` pins only the Nav label to the icon column (8). Menu labels get the generic cap-centred inset. At 12px that is about (32 − 8.5) / 2 ≈ 11.7, which is neither the icon column (8) nor the icon rows' text column (36). The Palette spec says labels, icons and footer share column 13. `surface.css:1119` sets `padding-inline: 8`, which `inset.css` overrides (it loads later). Computed from CSS, not measured.
- Evidence: `inset.css:8-9, 20-24, 44-48, 52`. `surface.css:1115-1124`. `command-palette.md:119-120` ("search icon 13 = row icon 13 = label 13"). The palette column is `--_column` = 4 + 8 (`command-palette.css:26`), so the label is at about 4 + 11.7.
- Visual: A Palette group ("Recent") with rules at the icon column and at the label's start.

### D-16  Row radius comes from different roles; they diverge off the Standard preset
- Families: menu, command-palette, nav, tree-view (Select peer)
- Category: system-rule
- Severity: low
- Type: DECISION
- What: At Standard every row is 8. Menu and Palette items are concentric (container − 4). Nav and Tree use `radius-row`. The Select option uses `radius-row` with no cap. Under other presets the rows differ, and under Pill the Select option becomes a full pill. The Palette corner (row + inset) also leaves the container role.
- Evidence: `surface.css:1020-1023`, `command-palette.css:29-30`, `nav.css:95-98`, `tree-view.css:40`, `navigation.css:347`. Presets from `radius.ts:98-114`:

  | Preset | Menu item | Nav / Tree row | Select option | Palette corner | Menu corner |
  |---|---|---|---|---|---|
  | Subtle | 2 | 4 | 4 | 6 | 6 |
  | Soft | 4 | 6 | 6 | 8 | 8 |
  | Standard | 8 | 8 | 8 | 12 | 12 |
  | Pill | 12.8 (cap) | 12.8 (cap) | 9999 (pill) | 16.8 | 24 |
- Options:
  - A: Rows inside a floating surface are concentric (Menu, Palette, Combobox, Select picker, all capped). Standalone rows use `radius-row` (Nav, Tree). Record this as the rule, and cap the Select option.
  - B: Every row uses `radius-row`.
  - Recommended: A. It is what Menu already documents ("Concentric corners, applied", `surface.css:1004-1007`). It only needs the Select cap and one sentence in DESIGN_SYSTEM.
- Visual: A Menu and a Nav rendered under Subtle, Standard and Pill.

### D-17  Menu minimum width is stated as 256 in one place and built as 224 in another
- Families: menu
- Category: docs-drift
- Severity: low
- Type: FIX
- What: The searchable surface says "Menu's own minimum (256), so a searchable menu is not narrower than a plain one". Menu's minimum is 96×2 + 32 = 224, and the Menu spec measured 224. The search surface is therefore 32px wider than a plain menu.
- Evidence: `surface.css:995` (`min-inline-size: calc(96*2 + 32)` = 224) vs `surface.css:1177-1178` (`96*2 + 64` = 256). `menu.md:50` (shell 224). Combobox list minimum 224 (`combobox.css:30`).
- Visual: A plain Menu and a MenuSearch surface stacked at their minimum widths.

### D-18  API vocabulary differs across the families
- Families: nav, menu, context-menu, tree-view, tabs, breadcrumb, command-palette (Segmented, Combobox peers)
- Category: api
- Severity: low
- Type: DECISION
- What: The same concept has different names and shapes:
  - `label` is a visible heading in NavGroup, but an accessible name in Tabs (default "Views"), ContextMenu, CommandPalette and Segmented.
  - The change callbacks are `onValueChange` (Tabs, Combobox), `onSelect` (Segmented; per item in Palette), `onActivate` / `onSelectedChange` (Tree) and `onClick` (MenuItem).
  - MenuItem has no `icon` prop. Every demo hand-writes `<span className="area-menu__icon">` and `<span className="area-menu__text">`, while NavItem, Tree nodes, Tabs and Palette items take `icon`.
  - `shortcut` is a `ReactNode` in MenuItem but a `string[]` in CommandItem.
  - NavSeparator takes no ref or props, while MenuSeparator does.
  - Items are composed as children (Nav, Menu, Breadcrumb) or passed as data arrays (Tree, Tabs, Palette).
- Evidence: `Nav.tsx:37-53`, `:99`. `primitives.tsx:1113-1172` (MenuItem), `:1204-1215` (Tabs `label = "Views"`), `:1367-1379` (Segmented `onSelect`). `ContextMenu.tsx:6-15`. `CommandPalette.tsx:8-45`. `TreeView.tsx:21-33`. Demos: `gallery.tsx:1036-1040`, `:1364-1368`.
- Options:
  - A: Add MenuItem `icon`; rename the accessible-name props to `aria-label` passthrough (or `accessibleLabel`) and keep `label` for visible text; standardise `value` / `onValueChange` for single choice (Segmented alias). Keep both data and children APIs.
  - B: Document the current names only.
  - Recommended: A (a non-breaking addition of MenuItem `icon`, and a Segmented `onValueChange` alias). The hand-written icon spans are the most repeated boilerplate in the gallery.
- Visual: None (API table).

### D-19  The collapsed breadcrumb marker is not reachable
- Families: breadcrumb
- Category: a11y
- Severity: low
- Type: DECISION
- What: `BreadcrumbEllipsis` is a `span role="img"` ("More pages"). The hidden ancestors cannot be reached by pointer or keyboard, and a test enforces that it is not a link.
- Evidence: `Breadcrumb.tsx:43-47`. `breadcrumb.test.mjs:21` ("labels an omitted section without making it a link"). `breadcrumb.md:88`.
- Options:
  - A: The ellipsis becomes a ghost button that opens a Menu of the omitted ancestors (shadcn, Untitled).
  - B: Keep it decorative and document that consumers must offer another route.
  - Recommended: A. Otherwise a collapsed path removes navigation, and the Menu is already built.
- Visual: The collapsed breadcrumb with its ellipsis hovered and a Menu open beneath it.

### D-20  Nav "expandable" children are not indented and repeat Tree view's job
- Families: nav, tree-view
- Category: visual
- Severity: low
- Type: DECISION
- What: The expandable tile toggles a plain `div hidden` wrapping an unlabelled NavGroup. The child rows sit on the parent's column, with no indent. The chevron is a Fluent icon in a ghost action, while Tree view uses the Area chevron glyph.
- Evidence: `gallery.tsx:1590-1593`. `nav.css:248`. Tree: `TreeView.tsx:136` (`Glyph name="chevron-down"`), `icons.tsx:84-89` (Fluent chevron).
- Options:
  - A: Indent Nav children by Tree's step (22), and use the Area chevron.
  - B: Drop "expandable" from Nav and point to Tree view for hierarchies.
  - Recommended: A. ChatGPT and Notion sidebars expand sections inside the nav, and Tree's column grid already exists to borrow.
- Visual: The expandable tile opened beside a Tree view at the same width.

### D-21  Vertical tabs with a track put the indicator and the track on opposite sides
- Families: tabs
- Category: visual
- Severity: low
- Type: FIX
- What: The vertical indicator rail is at the tab's inline-start. The vertical track is drawn at the list's inline-end. Horizontally, the indicator sits on the track's side. There is no vertical + track tile. Computed from CSS.
- Evidence: `navigation.css:76` (vertical track: `border-inline-end`) vs `:85` (`inset-inline: 0 auto`, rail at the start). The vertical text start of 10 (`:84`) is a literal with no `/* spec */`.
- Visual: A vertical Tabs with `track` as built, beside the rail moved to the track's side.

### D-22  MenuSearch is a third search-plus-list pattern with no keyboard wiring
- Families: menu (Combobox, Command palette peers)
- Category: interaction
- Severity: low
- Type: DECISION
- What: `MenuSearch` only wraps an Input above a Menu. Typing does not filter, and arrows in the field do not reach the rows. Combobox and CommandPalette already implement the field-drives-list contract.
- Evidence: `primitives.tsx:1123-1125`. `GalleryMenuSearch` (`gallery.tsx:1423-1433`). `surface.css:1171-1194`.
- Options:
  - A: Retire MenuSearch in favour of an inline CommandPalette or Combobox.
  - B: Wire it (combobox + menu) like CommandPalette.
  - Recommended: A. Two working patterns already exist, and a third that looks the same but behaves differently confuses consumers.
- Visual: MenuSearch, the inline CommandPalette and an open Combobox side by side.

### D-23  Command palette scale: the list model vs the products (owner question still open)
- Families: command-palette
- Category: visual
- Severity: low
- Type: DECISION
- What: Both products draw the palette larger than their menus. Area keeps the Menu list model (corner 12, rows 32, icons 16) inside a 600-wide modal with a 48px search row and 16/24 input.
- Evidence: `command-palette.md:72-84` (Notion corner 20 with 36 rows; ChatGPT corner 16 with 48 rows). `command-palette.css:29-34`, `:48-53`. Handoff line 181-182 ("Open: both products draw the palette larger…").
- Options:
  - A: Keep the list model (one row scale for every list).
  - B: Palette scale: corner `radius-container × 2`-capped 16–20, rows 36 (a `lg` row), icons 20, list inset 8.
  - Recommended: A for now, because Area has no 36 or 20px-icon tier yet and the compact-density plan will change row heights system-wide. Revisit when a `lg` list tier exists.
- Visual: The Area palette beside Notion's and ChatGPT's at the same scale.

### D-24  Descriptions and empty states appear in three different places
- Families: menu, command-palette (Combobox peer)
- Category: consistency
- Severity: low
- Type: DECISION
- What: A row description sits below the label in Menu (12/16), right after the label in Palette (14 muted, inline), and pushed to the row's end in Combobox. The empty state is a centred 96-tall block in Palette but a left-aligned 32 row at the text inset in Combobox.
- Evidence: `surface.css:1068-1076` (Menu). `command-palette.css:95-96` and `CommandPalette.tsx:152` (Palette). `combobox.css:37` (Combobox). Empty: `command-palette.css:97-103` vs `combobox.css:41-50`.
- Options:
  - A: Keep them (each is sourced: ChatGPT's model list, Notion's parent page, Figma's font list) and record the three roles in the list model.
  - B: One inline-after-label description and one empty row for all lists.
  - Recommended: A for descriptions (they mean different things) and B for empty states (one pattern: the Combobox row at the text inset).
- Visual: One row with a description in each family, and the two empty states side by side.

### D-25  Palette footer hints hover with the translucent wash on a known ground
- Families: command-palette
- Category: system-rule
- Severity: low
- Type: FIX
- What: The hint buttons hover with `bg-hover` (translucent), and their comment says "Menu's hover wash". Menu now uses `bg-component-hover`, and the footer's ground is the known palette surface. The spec also still says the highlight is "5% wash (`bg-hover`)".
- Evidence: `command-palette.css:125-126`, `:142`. `DESIGN_SYSTEM.md:62-68`. `command-palette.md:66`, `:78`.
- Visual: A hovered hint plate beside a hovered palette row.

### D-26  Specs and docs contradict the code and later owner decisions
- Families: all seven
- Category: docs-drift
- Severity: medium
- Type: FIX
- What: Most of the family specs carry values that were later changed, and several cross-family "match" claims are now false.
- Evidence:

  | File:line | Says | Code / decision now |
  |---|---|---|
  | `nav.md:3` | Status "in review" | Complete (`component-status.mjs:9`) |
  | `nav.md:78`, `:146` | Item / rest ink `fg-muted` | `fg-default` (`nav.css:103`; `nav.md:119`) |
  | `nav.md:135-136`, `:170` | Menu label same as Nav (14/20 muted), "one pattern" | Menu 12/16 400; Nav 14/20 500 |
  | `nav.md:167-168` | Tree rest ink `fg-muted` "match"; Tree current rail | Nav default ink; Tree marker removed (`tree-view.css:47`) |
  | `tabs.md:96`, `:106` | sm text 12/16 | `control-sm-text` = 14 (owner: small controls 14/20) |
  | `tabs.md:140`, `:142` | `primitives.tsx:847-902`; forced colours `:14`, indicator unverified | Tabs at `primitives.tsx:1204-1274`; indicator covered at `forced-colors.css:62` |
  | `tabs.md:148`, `:152` | Tree view rail marker; Menu separator `border-divider` | Rail removed; Menu separator `border-decorative` (`surface.css:1134`) |
  | `tree-view.md:72` | indent `depth × 20` | 22 (`tree-view.css:19`) |
  | `tree-view.md:88` | selected plate `bg-component-hover` | `bg-component-active` (`tree-view.css:25`) |
  | `tree-view.md:90` vs `:94` | chevron "24px hover plate" / "20" | 20 plate, 24 target |
  | `menu.md:18` | "Combobox, not built" | Built and Complete |
  | `command-palette.md:78`, `:100` | highlight `bg-hover`; "corner 16" | `bg-component-hover`; corner 12 (`:60`) |
  | `command-palette.md:114-116` | footer "nothing in them is clickable" | Working buttons (same spec `:122-129`) |
  | `context-menu.md:52-53` | "quiet 12 keycaps" | Kbd small = 11px |
  | `DESIGN_SYSTEM.md:81-83` | keycap radius 4, concentric in Buttons | 6 everywhere, not concentric (`kbd.css:16-18`; handoff 2026-09-28) |
  | `surface.css:1106-1114` | Menu label comments ("item's size", "one pattern with Nav") | See D-1 |
- Visual: None (text).

### D-27  Gallery hygiene
- Families: breadcrumb, command-palette, tree-view, menu, tabs, nav
- Category: gallery
- Severity: low
- Type: FIX
- What:
  - **Invented nouns, against DESIGN_SYSTEM "Example copy":** Breadcrumb tiles use Dashboard / Reports / Export and Projects / Files. The Palette uses Roadmap, Design tokens, Research notes, "Product", "Area" and "Quarterly plan". The filter tree uses Market filters, Positive funding and Trade setup.
  - **Deprecated or fake constructs:** GalleryMenuShortcuts uses the deprecated `quiet` prop. The Selected and Submenu tiles fake state (D-9, D-10).
  - **Duplicate names:** every horizontal Tabs tile shares the default accessible name "Views", so the page has many identically named tablists.
  - **What is fine:** each Tabs size is in its own tile, and Irene Yamaguchi is the only person shown (Nav sidebar recipe).
- Evidence: `gallery.tsx:12-38`, `:1011-1027`, `:2080-2086`, `:2145`, `:1412`, `:1961-1969`. `primitives.tsx:1218` (`label = "Views"`). `DESIGN_SYSTEM.md` "Example copy".
- Visual: None.

### D-28  Tests do not guard Tree view, Nav keyboard, or selection-under-hover
- Families: tree-view, nav, menu
- Category: interaction
- Severity: low
- Type: FIX
- What: There is no TreeView test file. Nav has one SSR test (actions outside the link). The cohesion test's "selection outranks hover" only checks each rule's paint, not specificity or exclusion, which is why D-4 passes. Menu typeahead and close behavior (D-11) are only exercised through the overlay test's menu-button case.
- Evidence: `packages/react/tests/` (no tree test). `gallery-primitives.test.mjs:111`. `cohesion.test.mjs:25-42`. `overlay.test.mjs:46`.
- Visual: None.

### D-29  Small CSS and a11y leftovers
- Families: menu, nav, command-palette
- Category: consistency
- Severity: low
- Type: FIX
- What:
  - `.area-menu__shortcut { padding-inline-start: 12 }` is dead, because `inset.css` sets 0.
  - `nav.css:89` `gap: space-8` is dead, because `inset.css` sets `gap-md`.
  - Nav row rules key on `aria-current="page"` only, while item rules accept any `aria-current` (so `aria-current="location"` paints the item but not a row with actions).
  - A disabled NavItem becomes an `<a>` with no href: it has no link role, `aria-disabled` sits on a generic element, and it is out of the tab order.
  - The Palette announces no result count or empty state (no live region).
- Evidence: `surface.css:1165` vs `inset.css:153`. `nav.css:89` vs `inset.css:59`. `nav.css:135` vs `:240-243`. `Nav.tsx:78-83`. `CommandPalette.tsx:172-173`.
- Visual: None.

## Confirmed consistent

- Row height 32 (`control-md`) for Nav, Menu, Context menu, Tree, Palette and Combobox rows; row gap 2 in every list.
- The hover plate is `bg-component-hover` in Nav, Menu, Tree, Table, Select, Palette and Breadcrumb. Ink stays fixed on hover everywhere (Tabs uses a pending underline, Breadcrumb a `::before` plate).
- Nav current and Menu `data-selected` use `bg-component-active` and keep it under the pointer (`nav.css:135` after `:127`; `nav.css:240` excludes current; `surface.css:1039` excludes selected).
- Current markers are neutral: the Nav rail and the Tabs underline are `fg-default`. Accent appears only through `Nav tone="accent"`. No marker uses the focus colour. The Tree marker was removed as the owner decided.
- Menu, MenuSearch, Context menu (Menu) and Command palette share the floating lift over the 1px `border-decorative` edge. The Palette scrim equals Dialog's.
- Rules follow the divider rule: Menu separators and the Palette search and footer rules are `border-decorative`; the Nav separator and Tabs track are `border-divider`.
- Tabs and Segmented: unselected options muted, selected default ink. Segmented is 500 on a fill and Tabs 400, one weight per label.
- Tabs follows APG: roving tab stop, arrows, Home/End, RTL reversal, automatic and manual activation, `aria-controls` / `aria-labelledby`, and disabled tabs skipped.
- Breadcrumb: `nav` landmark with a default label, `ol`, `aria-current="page"`, `aria-hidden` separators, chevron mirrored in RTL, and the hover plate taken from Notion (24 tall, radius-small).
- Command palette: combobox plus an always-shown listbox with `aria-activedescendant`. Focus stays in the field, disabled rows are skipped, Escape clears and then closes, and the footer hint buttons are out of the tab order and keep focus in the field.
- Context menu: Shift+F10 and the ContextMenu key; opens at the pointer with a viewport flip; focus returns on close; the physical `left`/`top` is intentional and commented.
- Tree view: `aria-level`, `aria-posinset`, `aria-setsize`, a roving single tab stop, Home/End and typeahead, and row actions outside the Tab order by contract.
- Disabled at 50%: Nav, Menu, Tabs, Palette rows and Combobox options (Tree is the exception, D-5).
- Refs are forwarded and native props spread for Nav, NavGroup, NavItem, the Breadcrumb parts, a hosted Menu, MenuItem, MenuLabel, MenuSeparator, TreeView, Tabs, CommandPalette and ContextMenu (a Menu with `trigger` is the exception, D-12).
- Overlay motion is token-based and reduced motion removes the scale (`surface.css:1364-1366`).
- Gallery: one size per Tabs tile, and Irene Yamaguchi is the only person in the Nav sidebar recipe.
