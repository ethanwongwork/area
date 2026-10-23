# Menu spec

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
| separator · spacing | **6 / 1 / 6**, compact **5 / 1 / 5** (margin plus the row gap) | Cursor desktop chat-actions menu 6 / 1 / 6 (`compact/cursor-app--menu--open--light`); VS Code and Cursor web 5 / 1 / 5; Figma 7 / 1 / 7 | Owner 2026-10-02. Was 4 / 1 / 4 (Notion; the owner had cut 10 / 1 / 10 as too big); ChatGPT 8. Line starts level with the icons (Notion) |
| checkable row | `MenuItem checked` → `menuitemcheckbox`; with `radio`, `menuitemradio` (primitives.tsx:1143-1161); trailing check (default) or `indicator="switch"`; indicator 8px from the end | Notion toggle rows (whole row is the control, 30×18 switch 8px from the end, input `tabindex=-1`); ChatGPT model picker (trailing check) | Area draws its sm switch (28×16) display-only, with no nested input, so the row stays the only focusable element |
| selected row | **check only**: `radio checked` (one of several) or `checked`; no plate at rest, the plate stays the highlight. The raw `data-selected` plate (`bg-component-active`, surface.css:1055) is the value-picker hook only (Select, Combobox) | ChatGPT model picker (check, no plate) | Audit S13 C. The Selected tile and the Composer mode menu drew the plate plus a Fluent check in the shortcut slot |
| surface · shadow | **`--area-shadow-float`**, the Elevation axis's float role: `0 0 2` + `0 8 16` at the Elevation step in % (3% key at the default 3), the ambient half, dark doubled; transparent at step 0 (axes/elevation.ts) | Notion's two layers; ChatGPT 8/16; Figma 2/5 + 10/16 | Was `shadow-2` (1–2px), a flat card edge. A Surface axis role since audit S10 |
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
Area colours the danger row, as ChatGPT does. Group labels follow Nav's (since 2026-10-22): the rows' size at weight 500 in the muted ink, a
row tall, one pattern across Nav, Menu, Combobox, Command palette, Custom select, Context menu and
List box. Notion's menu and palette labels are 12/14.4 500; ChatGPT's sidebar labels keep the rows' 14 at 500.

## Verification

- 18 product captures, 3 Area before, 1 after; checksums verified; no personal content.
- Area after: icon 8, label 36 (was 32), text-only rows 11; shadow as specified; focus wash.
- `typecheck`, `build:docs`, `test:contracts` (14), `test:preview` (4), React tests (90),
  `npm test` (19,491): all pass.
- `MenuSub` placement verified live: 4 from the parent menu's edge, first row level with the
  trigger row (audit D-10).
- Unverified: dark theme, screen-reader announcement of menu items and submenus.

## Motion and interaction, 2026-10-07

Contract: [MOTION.md](../MOTION.md), "Popover, menu ...", "Hover plate", "Selected", "Small mark".

| Interaction | Before | After |
|---|---|---|
| open (anchored Menu, MenuSub) | `opacity` + `scale` 0.97, `duration-base` 150, `ease-out`, origin at the trigger | unchanged |
| close | same as open (150) | `duration-fast` 100, `ease-out` (shared rule; see popover.md) |
| rest | `scale: 1` | `scale: none` (no resting transform) |
| row hover (pointer) | `--area-transition`: the plate faded in and out over 100 | in at once (`:hover { transition-duration: 0s }` under `(hover: hover)`), out over `duration-fast` ease-out |
| highlighted, selected, `:focus-visible`, `:active`, open submenu row | 100 in | at once; out over `fast` |
| keyboard movement | the row left behind faded over 100 while the next one appeared | instant both ways while a row has keyboard focus (`.area-menu:has(.area-menu__item:focus-visible)`), so no tail trails the arrow keys |
| check mark (checkbox and radio rows) | `visibility` flip | the 16px check fades and grows from `scale` 0.6 on `duration-fast` `ease-out` both ways; rests at scale 1; the column stays reserved |
| danger row | red label, neutral plate | unchanged: foreground fixed on hover |
| disabled | no plate | unchanged |
| Context menu | its own `fast` clock and pointer origin (context-menu.css) | unaffected: it names its tokens directly |

Crispness: popup menu rows rest on whole pixels (rects of every row and check `x % 1 = 0`,
`y % 1 = 0` at rest, DPR 2). The docs page centres the inline specimens on .5 px (odd heights
189, 121, 155 under `place-items: center`); that is the docs frame, layout-snapped, and fine at 2x.

Verification: `/menu.html`: enter `opacity/scale: 150` ease-out, close `display/opacity/overlay/scale: 100`,
rest opacity 1, origin `27px 155px`, `will-change: auto`; a highlighted row computes `0s`, a
resting one `0.1s ×4`; an injected unchecked row's check computes opacity 0, scale 0.6, and on
check runs `opacity/scale: 100` ease-out to opacity 1, scale none.
Verified on the dev server (background tab, so transitions were read from `getAnimations()` and computed styles, not watched; real-pointer hover could not be driven in a background tab, so hover rules were read from the stylesheet).

Open questions:
- Combobox, Custom select, Tag picker and Command palette rows reuse `.area-menu__item`, so
  they get the instant-in plate. Their keyboard highlight is `aria-activedescendant` (focus stays
  in the field), so the keyboard rule above does not reach them and the row left behind fades
  over 100. Recommendation: each owner adds the same rule keyed on its own keyboard state.

## Review note, 2026-10-09

- **What changed:** Section titles in menus whose rows have no icon now start where the row text starts (11px in), not 3px short of it (8px). Menus whose rows lead with an icon, like Command palette, keep the title on the icon, as Notion's palette does.
- **Why:** You asked for the titles to line up with the row text; they sat 3px left of it.

## Review note, 2026-10-10

- **What changed:** In a menu that has rows with a check, the plain rows now leave the check's space empty at the end,
  so their keyboard shortcuts line up with the check rows' shortcuts. Menus without check rows look the same.
- **Why:** You agreed to fix it in Menu itself (Zoom control, question 2): a plain row's shortcut sat at the row's end,
  a check's width right of the check rows' shortcuts, and Figma keeps every shortcut in one column.

## Review note, 2026-10-17 (round 31)

- **What changed:** the red of a danger item ("Delete") is a little deeper in light, and a little lighter on the
  lightest dark grounds, so it stays readable when the row is hovered or pressed. It holds the same red in every state.
- **Why:** the red was solved for the plain menu, not its row fills. On the pressed row it fell to 3.97:1 even at the
  default settings, and to 3.2:1 at dark 24 + 8 (the hover and pressed sweep). Look at a danger item while pressing it,
  at **Default** and **Lightest dark**.

## Interaction polish, 2026-10-16

Rows press at `bg-component-pressed`, one step past selected (Notion presses at 10%, ChatGPT 12%; it shared selected's fill, 1.5% below hover). Row text is not selectable. See [interaction polish](../research/interaction-polish-2026-10-16.md).

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
- 2026-10-02 · compact evidence audit → rows stack flush at compact: new density role `ui-row-gap` (2, compact 0; VS Code and Figma menus 0); the separator keeps 4 / 1 / 4 by taking the gap back into its margin (R7) docs/research/compact-evidence-2026-10-02/README.md.
- 2026-10-21 · owner: "make sure the gaps between the nav items is consistent ... in compact, that gap shouldnt go away" → `ui-row-gap` is a constant 1px at every type and density (was 2 − 2 × ui-dense: 0 at Compact 12–13, 2 at Default, up to 5 at Comfortable); supersedes the line above. ChatGPT 35 rows and Notion 30 rows, 1 apart (`nav/chatgpt--sidebar-top-group`, `nav/notion--sidebar-private-section`); headless Edge: 1px in Nav and Menu at all 15 type × density combinations.
- 2026-10-02 · Cursor and Figma captures (owner) → separator 4 / 1 / 4 → 6 / 1 / 6, compact 5 / 1 / 5: every dense product measured sits at 5–7 (VS Code 5, Cursor web 5, Cursor desktop 6, Figma 7) → surface.css `.area-menu__separator`; docs/research/compact-evidence-2026-10-02/cursor-desktop.md.
- 2026-10-03 · radius audit D1 (owner) → the container role is 12 at compact too (was 8; Figma 13, Cursor 12-14), so this family's surface is 12 at both densities; rows concentric with a floating surface follow (compact 24 rows r8). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-03 · roundness work → rows are concentric with the outer edge, border counted: 12 − 4 − 1 = 7 (was 8) at both densities (`surface.css`, `.area-menu__item`); they move with the roundness offset. `docs/research/radius-audit-2026-10-03.md`, "Roundness".
- 2026-10-03 · all even (owner) → rows back to the surface corner less its padding, 8; the 1px border is left out (7 when counted).
- 2026-10-03 · two roundness step sizes (owner) → the surface steps by 4 and rows (surface − padding) with it; the rows' height cap moves by `radius-shift-surface`, so compact rows keep the 4px step (`surface.css`, `.area-menu__item`). `docs/research/radius-audit-2026-10-03.md`, "Step size for large shapes".
- 2026-10-03 · one corner setting (owner: one radius setting, Sharp and Pill as ends; "every control is a pill") → rows are the surface less its padding (8 at both densities, floored at min(4, setting)) up to a pill; the menu stops at pill rows plus the padding, 20, so it stays concentric at 12, 14 and Pill (`surface.css`). `docs/research/radius-audit-2026-10-03.md`, "One corner setting".
- 2026-10-04 · pill shapes and list rows (owner) → rows use `radius-list-row` (no rounder than a medium Button, a pill only at Pill) and the menu `radius-list` (rows + 4): 12 / 8 at the default, 16 / 12 at 12, 20 / 16 at Pill (owner: menu rows wait for Pill) (`surface.css`). `docs/research/radius-audit-2026-10-03.md`, "Pill shapes and list rows".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → row plate in at once and out on `fast`, instant both ways under keyboard focus; menu checks fade and grow from 0.6 on `fast`; close one step faster than open (`surface.css`).
- 2026-10-09 · owner went with Scroll area's recommendation to adopt it in the scrolling families (docs/specs/scroll-area.md, "Adoption") → the scroll container is a Scroll area: Figma's overlay bar instead of the platform's, its inset moved into the scroller so rows keep their place → back in review.
- 2026-10-09 · owner, review round 2 (needs changes): "the small section titles in the menu should line up with the
  text in the rows?" → open; the label takes the rows' own text inset (11 at 32) over text-only rows; over icon rows it stays on the icon column → inset.css, surface.css (`.area-menu__label-text`), MenuLabel, Combobox, CustomSelect, CommandPalette, TagPicker.
- 2026-10-10 · owner: "go with your recommendations" (zoom-control.md Q2) → in a menu with check rows, a plain row ending
  in a shortcut ends on the icon box and reserves the check column (16 + the row gap), so shortcuts align: 36 from the
  row's end in every row (was 39 / 36) → inset.css (`--_box-end`), surface.css (margin); new tile "Content / plain and
  check rows" (`GalleryMenuMixedRows`). Back in review.
- 2026-10-11 · owner, review round 7: approved (shortcut column in mixed menus).
- 2026-10-12 · owner adopted the product UI rules (docs/PRODUCT_UI.md, rule 3: rest → hover → press → selected, each a step firmer) → a held item (not a selected value row) takes `bg-component-active`, landing at once; replaces the hover-plate-only press → `surface.css, .area-menu__item:active`; desktop gallery.
- 2026-10-12 · same adoption → `MenuItem keepOpen` (view-option menus stay open, `data-keep-open`) and `Menu tooltip` (an Area Tooltip on the trigger; a Tooltip cannot wrap a menu trigger from outside) → `primitives.tsx`, `Overlays.tsx` (`wrapTrigger`); the gallery's Sort and group menu.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → the separator is `border-width` (was a literal 1px), a seam inside the menu like Panel's rules (surface.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-14 · owner: "continue working on the next axis" → Surface is one number, the frame's width: `1` (Default) or `0` (Borderless) (was `outlined` / `borderless`; axes/surface.ts). At 0 the menu, and its search surface, lists the Surface axis's `shadow-edge` first in its box-shadow, ChatGPT's frameless-menu edge (`0 0 1px` black 62%, and in dark an inset `0 0 1px` white 20%; captured 2026-10-13), so it keeps an edge at Elevation 0 and in dark, where it had none. Owner approved ("go with your recs"), review https://claude.ai/artifact/L4TCF2W5zcjvBK7xZmaDBN (docs/research/surface-2026-10-14.md).
- 2026-10-14 · owner (desktop app: "make all the dropdown selector windows sized to fit
  appropriately they seem too wide") → the 224 floor is now `var(--area-menu-min-inline-size, 224)`
  on Menu, Select's picker, Custom select, Combobox and Tag picker; the default is unchanged, and a
  list anchored to a field stays at least the field's width. The desktop app sets 128.
- 2026-10-17 · owner: "go with your recs" (after round 30), the hover and pressed sweep (docs/research/layers-2026-10-16/sweep/states.mjs) → a danger item's red is solved for the row's pressed fill, the deepest it sits on: in light it darkens beyond the page's own darken by what the raised pressed fill needs (`--_danger-darken`, from `layer-light-raised-fill-2` and the vivid bound, 0.063 at the defaults), in dark it lifts past a raised pressed fill of L 0.396, 6.1× the excess (`--_danger-lift`, fitted over every accent and neutral; 0 up to the defaults). The same red at rest, so the ink stays fixed across states. Was 4.15:1 hovered and 3.97:1 pressed at the defaults, 3.2:1 pressed at dark 24 + 8.
- 2026-10-22 · owner: "work through each of these items ... more intentional, consistent and overall professional" (docs/research/cursor-audit-2026-10-22.md item 1) → group labels take Nav's label, the owner's ChatGPT pick of 2026-09-27: the rows' size at 500, muted (was 12/16 at 400 since 2026-09-27's batch 2, left behind when Nav moved). One label for every run of rows. Evidence: ChatGPT sidebar 14/18 500 over 14 rows, Figma panel headings 550 at the rows' 11 (same size); Notion 12/16 500 over 14 and Cursor 11/14 over 12 (a step down) → surface.css (.area-menu__label).

## Settings collisions fixed (2026-10-18)

Elevation and Stroke audit (docs/research/elevation-stroke-2026-10-18): under a Material the Menu inside a search
surface (`.area-menu__search-surface > .area-menu`, deprecated) took the overlay glass, frost and gradient stroke, while
the search surface around it was in no Material group, so a searchable menu painted glass inside an opaque frame. A
searchable menu is now one overlay: the search surface is listed with Menu in every overlay group (material.css; the
inner Menu is excluded with `.area-menu:not(:where(.area-menu__search-surface > *))`, which keeps each list's weight),
its box-shadow lists the Material slot first, `var(--_m-layers, 0 0 0 0 transparent), var(--area-shadow-edge),
var(--_elevation)`, as Menu's, and the inner Menu is clear (`background-color: transparent`, surface.css), so the
surface's fill or glass shows through it. With no Material the inner Menu's surface fill was the search surface's own,
so the look is unchanged. Checked in the app (light and dark, None, Glass and Glow): under a Material the search surface
computes the same fill, image, frost, stroke and box-shadow as a plain Menu.

## Review note, 2026-10-20 (round 62)

- **What changed:** The search field above a searchable menu now takes the fill made for its raised surface. In light at the default settings nothing moves (there the raised plate equals the page's);
  in dark and on a grey page its hover, selected and pressed plates are now the same step from this surface as every
  Card's and Menu's (dark: #272727 on #121212, was #212121).
- **Why:** you asked that hover colours come from rules, not one-off fixes. The rule is now written (DESIGN_SYSTEM.md,
  Layers: a component that paints a ground declares it in layers.css) and enforced by a test; this family painted a
  raised ground without declaring it.

## Review note, 2026-10-22 (round 67)

- **What changed:** stacked rows sit 1px apart (were 2px at the default size, and touching at Compact). Keyboard focus is the brighter indicator blue (#0160d9, was #004cb0), as everywhere since the state settings.
- **Why:** you asked for the gap between nav items to stay the same and not disappear at Compact. ChatGPT's and
  Notion's sidebars put their rows 1px apart, so `ui-row-gap` is now 1px at every type size and density, for every
  family that stacks rows. The focus colour is your pick on the state page (2026-10-21).

## Review note, 2026-10-22 (round 68, keys)

- **What changed:** shortcuts are small keycaps (16, the 6% plate) instead of muted text, string shortcuts included. A destructive row's key is a plate of the row's red.
- **Why:** your note that every Kbd should have its backplate, for one look everywhere (docs/specs/kbd.md, "When a key has a backplate").

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.

## Review note, 2026-10-23 (press room)

- **What changed:** a danger item's red is solved for the press Area actually paints (the selected fill 12% toward the
  body ink in light, 14% in dark, stopped where muted text keeps 4.6:1), was an older press (3% and 7%). At the defaults
  it is a touch deeper in light, and in dark 6% lighter (the real dark press, L 0.406, passes the 0.396 where the lift
  starts; the old formula put it at 0.362).
- **Why:** the press room (THEMING.md, Interaction states) deepened the light press to L 0.913, and the state sweep found
  the red at 4.39:1 pressed (#cd073c on #e2e2e2). The muted ink is #646464 at the defaults, was #666666.
