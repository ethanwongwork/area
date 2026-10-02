# Menu spec

**Status:** accepted · 2026-09-26 (was: in review · 2026-09-26 (first pass under the capture workflow; reopened from Complete))
**Captures:** `docs/research/captures/menu/` (pass-0 in `before/`)
**Peers:** SplitButton (hosts a Menu in a popover), Toolbar overflow, Nav (row insets),
Tree view (row wash), Kbd (shortcuts), Popover (surface family)

## Owner decisions

- 2026-09-26: "build the next component" after Button, SplitButton and ButtonGroup. Menu
  chosen: SplitButton depends on it, it had no spec, and its keyboard support was missing.
- 2026-09-26: accepted. Owner: "consider every component that you have built to be approved. if i havent given any feedback to change anything consider them approved."

## Job and boundaries

A list of actions shown on demand (a popup from a trigger) or inline in a surface. Not
navigation (Nav), not a single-value choice in a form (Select), not a searchable picker
(Combobox, built 2026-09-26). Showing, positioning and dismissing the popup belong to the host
(SplitButton, or Menu's own `trigger` from the overlay work, [overlay.md](overlay.md)).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| item | text | Plain action | All products |
| item | icon + text (`icon`) | Iconic actions | ChatGPT account and chat actions; Notion page actions; Figma "More" |
| item | shortcut | Command hint | Notion page actions (⌘⌥L, ⌘D) |
| item | danger | Destructive action | ChatGPT "Delete" (red label) |
| item | selected (`radio checked`) | Current choice among several | ChatGPT model picker (check) |
| item | disabled | Unavailable action | Area; Radix-based products support it |
| composition | label, separator | Groups | ChatGPT chat actions (groups); Notion (groups) |
| item | checkable (switch or check) | Settings that toggle in place | Notion "Small text", "Full width" (switch); ChatGPT model picker (check) |
| composition | search (**deprecated**) | `MenuSearch` / `.area-menu__search-surface` are deprecated in favour of Combobox (a field that filters a list) and Command palette (audit D-22 A, owner 2026-09-30); still exported so existing markup renders; gallery tile removed | — |
| composition | submenu (`MenuSub`) | A row that opens a nested menu beside it (audit D-10 A, owner) | Notion page actions (submenus); ChatGPT model submenu |

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| chatgpt | target product | Account menu, chat actions (danger), model picker; item rest, hover, keyboard highlight, danger hover, selected | chatgpt.com, owner's session (Chrome), 2026-09-26; menus opened and hovered, nothing chosen | `chatgpt--*` (10) |
| notion | target product | Page actions menu; items with icon, shortcut, toggle; hover, keyboard highlight | app.notion.com (Chrome), 2026-09-26 | `notion--*` (7) |
| figma | target product | File browser "More" menu (rest) | figma.com/files (Chrome), 2026-09-26 | `figma--more-menu--open` |
| area | this system | Before: default, shortcuts, danger; after: icons menu | localhost gallery | `before/area--*` (3), `area--menu-icons--open` |

## Measurements

Surfaces (generated with `node scripts/capture-compare.mjs`, filtered):

| slot · property | area · menu-icons · open · light | area · menu-default · open · light | chatgpt · chat-actions-menu · open · light | notion · page-actions-menu · open · light | figma · more-menu · open · light |
|---|---|---|---|---|---|
| **shell** size | 224 × 163 | 224 × 110 | 188.88 × 270 | 256 × 843.55 | 208 × 151 |
| **shell** padding | 4 | 4 | 10 | 0 | 8 0 8 0 |
| **shell** border | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) | 0 | 0 | 0 |
| **shell** radius | 12px | 12px | 16px | 10px | 13px |
| **shell** background | rgb(255, 255, 255) | rgb(255, 255, 255) | oklab(0.999994 0.0000455678 0.0000200868 / 0.9) | rgb(255, 255, 255) | rgb(255, 255, 255) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 1px 2px -0.5px | rgba(0, 0, 0, 0.06) 0px 1px 2px -0.5px | rgba(0, 0, 0, 0.1) 0px 0px 0px 0.5px, rgba(0, 0, 0, 0.1) 0px 0px 0px 0.5px, rgba(0, 0, 0, 0.12) 0px 8px 16px -4px | rgba(25, 25, 25, 0.05) 0px 20px 24px 0px, rgba(25, 25, 25, 0.027) 0px 5px 8px 0px, rgba(42, 28, 0, 0.07) 0px 0px 0px 1px | rgba(0, 0, 0, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.12) 0px 10px 16px 0px, rgba(0, 0, 0, 0.12) 0px 0px 0.5px 0px |
| **item** size | 214 × 32 | 214 × 32 | 168.88 × 36 | 248.01 × 27.99 | 192 × 40 |
| **item** edge from shell (t r b l) | 5 5 126 5 | 5 5 73 5 | 82 10 152 10 | 120.94 4 694.62 3.99 | 8 8 103 8 |
| **item** padding | 0 11.03 0 8 | 0 11.03 0 11.03 | 6 10 6 10 | 0 | 4 0 4 0 |
| **item** border | 0 | 0 | 0 | 0 | 0 |
| **item** radius | 8px | 8px | 12px | 6px | 5px |
| **item** background |  |  |  |  | rgb(255, 224, 252) |

Items:

| slot · property | chatgpt · menu-item-icon · rest · light | notion · menu-item-icon · rest · light | chatgpt · menu-item-icon · hover · light | notion · menu-item-icon · hover · light | chatgpt · menu-item-danger · hover · light | notion · menu-item-shortcut · rest · light |
|---|---|---|---|---|---|---|
| **shell** size | 304 × 36 | 248.01 × 27.99 | 304 × 36 | 248.01 × 27.99 | 168.88 × 36 | 248.01 × 27.99 |
| **shell** padding | 6 10 6 10 | 0 | 6 10 6 10 | 0 | 6 10 6 10 | 0 |
| **shell** font | 14px/20px 400 -apple-system-body | 16px/24px 400 ui-sans-serif | 14px/20px 400 -apple-system-body | 16px/24px 400 ui-sans-serif | 14px/20px 400 -apple-system-body | 16px/24px 400 ui-sans-serif |
| **shell** color | rgb(13, 13, 13) | rgb(44, 44, 43) | rgb(13, 13, 13) | rgb(44, 44, 43) | rgb(224, 46, 42) | rgb(44, 44, 43) |
| **shell** background |  |  | rgba(0, 0, 0, 0.05) | color(srgb 0.129412 0.105882 0.0901961 / 0.0509804) | rgba(0, 0, 0, 0.05) |  |
| **icon** size | 20 × 20 | 20 × 20 | 20 × 20 | 20 × 20 | not found | 20 × 20 |
| **icon** edge from shell (t r b l) | 8 274 8 10 | 3.99 220.02 4 7.99 | 8 274 8 10 | 3.99 220.02 4 7.99 | not found | 3.99 220.02 4 7.99 |
| **icon** padding | 0 | 0 | 0 | 0 | not found | 0 |
| **icon** font |  |  |  |  | not found |  |
| **icon** color | rgb(13, 13, 13) | rgb(56, 56, 54) | rgb(13, 13, 13) | rgb(56, 56, 54) | not found | rgb(56, 56, 54) |
| **icon** background |  |  |  |  | not found |  |
| **text** size | 258 × 20 | 176.29 × 16.8 | 258 × 20 | 176.29 × 16.8 | 41.79 × 20 | 166.5 × 16.8 |
| **text** edge from shell (t r b l) | 8 10 8 36 | 5.6 35.73 5.59 35.99 | 8 10 8 36 | 5.6 35.73 5.59 35.99 | 8 91.09 8 36 | 5.6 45.52 5.59 35.99 |
| **text** padding | 0 | 0 | 0 | 0 | 0 | 0 |
| **text** font | 14px/20px 400 -apple-system-body | 14px/16.8px 400 ui-sans-serif | 14px/20px 400 -apple-system-body | 14px/16.8px 400 ui-sans-serif | 14px/20px 400 -apple-system-body | 14px/16.8px 400 ui-sans-serif |
| **text** color | rgb(13, 13, 13) | rgb(44, 44, 43) | rgb(13, 13, 13) | rgb(44, 44, 43) | rgb(224, 46, 42) | rgb(44, 44, 43) |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| item · height | 32 (`ui-row`); 24 in compact | Notion 28, ChatGPT 36, Figma 40; compact: VS Code 24, Figma 24 (owner 2026-10-01) | Default sits between ChatGPT and Notion |
| item · icon inset | 8 default, 6 compact (`ui-row-inset`; the row reserves `ui-row − 2 × inset`, the 16px icon at default) | Notion 8 (20px icon, 28px row); VS Code compact rows (compact pass) | ChatGPT 10. Compact rows are 24 at 12/16 with labels on a 30 column (docs/research/compact-pass-2026-10-01.md) |
| item · icon → label | **12**, the density token `--area-gap-row` (label at 36; `--_menu-gap`, surface.css:984) | ChatGPT and Notion both start the label at 36 | Was 8 (label at 32), then a literal 12 until audit S11a. Nav, Command palette and the Select picker share the token, so every icon row's label sits at 36. Icons stay 16 (Area's icon sizes are 12/16/24; the products draw 20) |
| item · text-only inset | 11 (shared rule) | ChatGPT 10 | Within 1px |
| item · text | 14/20 400 | ChatGPT 14/20 400; Notion 14 400 | — |
| hover, keyboard focus | **`bg-component-hover`** plate (the shared row plate since the cohesion audit; was the `bg-hover` wash) on hover, `data-highlighted` and `:focus-visible` | ChatGPT 5% black, Notion 5% warm black, pointer and keyboard alike | Keyboard focus had no style of its own. Focus is the plate only, with no ring (audit S11b; Nav and Tree rows draw an inset ring). Forced colours draw a Highlight ring |
| danger | red label; **neutral wash** on hover | ChatGPT "Delete" (red text, 5% wash) | Was a red-tinted row with darker red text |
| shortcut | 12/16 400 in the UI font, muted; a Kbd in a row renders the same, unboxed (kbd.css:89-102); on a danger row it takes the row ink (kbd.css:104) | Notion (12px, tertiary ink, UI font) | Was monospace. A Kbd here was the keyboard face at 500 until audit S12a |
| separator · spacing | **4 / 1 / 4** (2px margin plus the 2px row gap) | Notion 4 / 1 / 4 (the menus' primary product) | Owner: too big. Was 10 / 1 / 10 (21px band); ChatGPT 8 / 1 / 8. Line starts level with the icons (Notion) |
| checkable row | `MenuItem checked` → `menuitemcheckbox`; with `radio`, `menuitemradio` (primitives.tsx:1143-1161); trailing check (default) or `indicator="switch"`; indicator 8px from the end | Notion toggle rows (whole row is the control, 30×18 switch 8px from the end, input `tabindex=-1`); ChatGPT model picker (trailing check) | Area draws its sm switch (28×16) display-only, with no nested input, so the row stays the only focusable element |
| selected row | **check only**: `radio checked` (one of several) or `checked`; no plate at rest, the plate stays the highlight. The raw `data-selected` plate (`bg-component-active`, surface.css:1055) is the value-picker hook only (Select, Combobox) | ChatGPT model picker (check, no plate) | Audit S13 C. The Selected tile and the Composer mode menu drew the plate plus a Fluent check in the shortcut slot |
| surface · shadow | **`--area-shadow-float`**: `0 20px 24px` in `shadow-color`, `0 5px 8px` at half strength (surface.css:866, surface.ts:16); `none` under the Flat preset | Notion's two layers; ChatGPT 8/16; Figma 2/5 + 10/16 | Was `shadow-2` (1–2px), a flat card edge. A Surface axis role since audit S10 |
| surface · radius, inset, border | 12, 4, 1px decorative (unchanged) | Notion 10 and 4; ChatGPT 16 and 10 | Concentric item radius follows |
| keyboard | Up/Down (wrap), Home/End, typeahead in one 1000ms window (`TYPEAHEAD_RESET`, Overlays.tsx:30) shared by hosted and anchored Menu and Tree view | WAI menu pattern; Radix and React Aria 1s; Notion | Was none (SplitButton had its own copy); then a window per list (audit D-11) |
| submenu row | `MenuSub`: a menuitem row with a trailing chevron (`chevron-down` rotated −90°, +90° in RTL) in `fg-muted`, its edge 8 from the row's end as a check's; an open submenu keeps its row on the hover plate (surface.css:1127-1141) | Audit D-10 A (owner); Notion submenus | — |
| submenu placement | beside the parent menu, 4 from its edge (`MENU_OFFSET`), its first row level with the trigger row (the submenu's padding and border taken out); flips and shifts as every anchored menu | Audit D-10; verified live | — |
| forced colours | a `data-selected` row paints `Highlight` / `HighlightText`; focus a `Highlight` ring (`forced-colors.css`) | Audit D-14 | The plate alone vanished |

## Behavior and accessibility

`role="menu"`, items are native buttons with `role="menuitem"`. `MenuItem icon` renders in
`.area-menu__icon` (`aria-hidden`) before the label, which is then always wrapped in
`.area-menu__text` (primitives.tsx:1172-1174); demos no longer hand-write the icon spans. Menu handles Up/Down
(wrapping), Home/End and typeahead for its own items; a nested submenu handles its own keys,
and an anchored Menu ignores the keys and rows of nested menus (Overlays.tsx:108-110).

`MenuSub` (`primitives.tsx:1174-1255`) is a `menuitem` row with `aria-haspopup="menu"`,
`aria-expanded` and `aria-controls`. Right (Left in RTL), Enter or Space opens it on its first
row; Left (Right in RTL) or Escape closes it back to the row; a mouse hover opens it, and
moving focus to another row of the parent menu closes it. It is a nested `popover="auto"`, so
Escape and an outside press close the innermost menu first and closing the parent closes it;
the menu is named by a string `label`.

Choosing closes by row kind, in the anchored Menu and ContextMenu alike: an action or a radio
choice closes the menu, a checkbox row toggles and keeps it open, as does a `MenuSub` row
(`data-keep-open`) (audit D-11).

With a `trigger`, the consumer's `onKeyDown`, `onClick` and `onPointerMove` run first and can
cancel the menu's own (`preventDefault`); a consumer `id` is the menu's id and the trigger's
`aria-controls`; a consumer `aria-label` or `aria-labelledby` wins over the trigger's
`aria-labelledby` (primitives.tsx:1119-1130, audit D-12).
Items keep their own Tab stops (inline menus in panels rely on this); a popup host closes
on Tab (SplitButton). Opening, anchoring and dismissal are the host's job (native popover in
SplitButton). Verified in the gallery: arrows wrap, Home/End, typeahead ("s" → Settings), and
SplitButton's menu uses the same handler.

## Visual pass

2026-09-27, Claude in Chrome, side by side with Notion's page menu (read only, opened and
dismissed) beside the gallery's Content / icons tile: same anatomy (leading icons on one column,
muted shortcuts at the end, inset rules between groups, the floating lift). Notion's rows are
denser (about 28 against Area's 32 tier) and it keeps "Move to Trash" in the default ink where
Area colours the danger row, as ChatGPT does. Group labels now follow Nav's: 12/16 in the muted
ink (Notion's menu and palette labels are 12px), one pattern across Menu, Combobox, Command
palette and Context menu.

## Verification

- 18 product captures, 3 Area before, 1 after; checksums verified; no personal content.
- Area after: icon 8, label 36 (was 32), text-only rows 11; shadow as specified; focus wash.
- `typecheck`, `build:docs`, `test:contracts` (14), `test:preview` (4), React tests (90),
  `npm test` (19,491): all pass.
- `MenuSub` placement verified live: 4 from the parent menu's edge, first row level with the
  trigger row (audit D-10).
- Unverified: dark theme, screen-reader announcement of menu items and submenus.

## Feedback log

- 2026-09-26 · owner: "build the next component" → Menu evidence pass: label column 36,
  shared hover/focus wash, neutral danger hover, UI-font shortcuts, floating lift, keyboard.
- 2026-09-26 · owner: divider gap too big; refine the menu with controls, or fix controls
  first? → divider 4 / 1 / 4 (Notion). The controls were fine; the composition was not: rows
  were plain divs with independent focus stops and 8px insets. Replaced by checkable
  `MenuItem`s (switch or check, row is the control), measured against Notion's toggle rows.
  Mixed controls (segmented choice, buttons) belong in a Popover, not a menu.
- 2026-09-27 · merged the overlay-behavior branch → with a `trigger`, Menu anchors to it and follows the ARIA menu button pattern (flip and shift, arrows wrap, typeahead, Escape and Tab close); a Menu without one keeps this pass's in-menu keys for its host → [overlay behavior](overlay.md).
- 2026-09-27 · batch 2 visual pass → group labels 12/16 muted, one pattern with Nav (was 14/20)
  → side by side with Notion's page menu in Claude in Chrome.
- 2026-09-30 · audit S10–S12 (owner) → the lift is the Surface axis role `--area-shadow-float` (`none` under Flat; surface.css:866, :1178); the icon-to-label gap is the density token `--area-gap-row` (12), shared with Nav, Command palette and the Select picker (surface.css:984); rows keep plate-only focus; a Kbd in a row renders like a string shortcut, and Escape is written "Esc" (kbd.css:89-104).
- 2026-09-30 · audit S13 (owner) → a selected row in a menu of commands or choices shows the check only and the plate stays the highlight; `MenuItem radio` with `checked` gives `menuitemradio` (primitives.tsx:1143-1161); the `data-selected` plate is the value-picker hook only (surface.css:1045-1055); the Selected tile now uses `radio checked`.
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → `MenuItem` takes `icon` (ReactNode) in `.area-menu__icon` (`aria-hidden`) before the label, the label then always in `.area-menu__text`, as NavItem, Tabs and CommandItem take it (primitives.tsx:1153, :1172-1174); demos pass `icon` instead of hand-writing the spans. No visual change.
- 2026-10-01 · audit D-10 (owner pick A) → new `MenuSub`: a menuitem row with `aria-haspopup="menu"`, a muted trailing chevron 8 from the end (mirrored in RTL); Right (Left in RTL), Enter or Space opens on the first row, Left (Right in RTL) or Escape closes back to the row, hover opens, focus on another parent row closes; nested `popover="auto"`; placed beside the parent 4 from its edge, first row level with the trigger row (verified live). The parent AnchoredMenu ignores nested menus' keys and rows → primitives.tsx:1174-1255, Overlays.tsx:108-110, surface.css:1127-1141.
- 2026-10-01 · audit D-11 → one typeahead window (`TYPEAHEAD_RESET`, 1000ms) for hosted Menu, anchored Menu and Tree; checkbox rows keep a menu open, actions and radio choices close it, in the anchored Menu and ContextMenu → Overlays.tsx:30, :157-158, primitives.tsx:1152, ContextMenu.tsx:93-94.
- 2026-10-01 · audit D-12 → with a trigger, consumer handlers run first and can cancel; consumer `id` is used for `aria-controls`; consumer `aria-label` / `aria-labelledby` wins over the trigger's labelledby → primitives.tsx:1119-1130, Overlays.tsx.
- 2026-10-01 · audit D-14 → forced colours paint a selected row `Highlight` / `HighlightText` → forced-colors.css.
- 2026-10-01 · audit D-22 (owner pick A) → `MenuSearch` and `.area-menu__search-surface` deprecated (`@deprecated` JSDoc; use Combobox or Command palette); kept so existing markup renders; its gallery tile is removed → primitives.tsx:1342-1346, surface.css:1217-1219.
- 2026-10-02 · compact evidence audit → the row glyph edge holds at 8 at compact (was 6; Figma 8, VS Code 9), label column 32 (R1) docs/research/compact-evidence-2026-10-02/README.md.
