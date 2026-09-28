# Command palette spec

**Status:** in review · 2026-09-26
**Captures:** `docs/research/captures/command-palette/`
**Peers:** Combobox (the field–list contract), Menu (rows), Dialog (scrim, lift, corner), Kbd

## Owner decisions

- 2026-09-26: "do each of them subsequently" — second in the product-specific inventory.

## Job and boundaries

A search field over a list of actions and places, opened from anywhere with a shortcut:
narrow by typing, move with the arrows, run with Enter. Not Combobox (it picks a value for
a field; a palette runs things and closes), not Menu (no search, opened from a trigger).
Notion's slash menu and ⌘K search, ChatGPT's chat search and Figma's quick actions are all
this shape.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| presentation | modal (default), inline | Notion's is modal; inline for embedded search and docs | Notion |
| composition | groups, icon, description, shortcut, disabled row | Notion: date groups, page icons, parent after the title | Notion |
| footer | key hints (default), custom, none | Notion's footer hint row | Notion |
| state | highlighted, empty | — | Notion |

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| notion | target product (primary) | "Search or ask" palette, opened from the sidebar, nothing typed or opened | app.notion.com, 2026-09-26 | `notion--search-palette--open--light` |
| wai | pattern | combobox with a listbox that is always shown | w3.org/WAI/ARIA/apg/patterns/combobox/ | — |

ChatGPT's search could not be captured (the tab stopped responding); an attempt collapsed
its sidebar, which was restored immediately.

## Measurements (Notion)

```
dialog     1006 × 700, radius 20, rgba(255,255,255,0.9) + blur(40), shadow 0 24 48 24%,
           0 4 12 14%, 0 0 0 1 ring; 77 from the top of the page
search     row 48 tall; field 24 tall 12 in; text 16/24; icon square before it (text at 50)
filters    row 44, padding 10 12; chips 24 tall, pill, 14px muted
list       600 wide column, padding 0 10; groups padding 4
heading    12/14.4 500 muted, row padding 0 8
row        36 tall, radius 12, padding 4 8; icon 20; text 14/16.8; trailing hint 26 × 14
highlight  5% warm black (rgba 33,27,23 / 0.05)
```

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| width | 600 | Notion's list column | Notion's preview pane (406) is left out |
| position | 77 from the top, centred; max 700 tall | Notion | results grow downward from a fixed field |
| surface | Dialog's: border, opaque surface, floating lift, scrim 13% | dialog.md | Notion's translucent blur is not in Area's surfaces |
| corner | row radius + list inset = 8 + 4 = 12 (Menu's and the Combobox list's) | list pass: one list model | Notion 20 with 12 rows in a 10 inset |
| search row | 48 tall, 16/24 text; the glyph on the rows' icon column (13 from the edge), the typed text on their text column (41), rule under it | list pass | Notion puts its field 12 in |
| rows | Menu rows (32, 8 radius, 5% wash), icon 16, 12 gap | menu.md | Notion's 36 rows and 20 icons belong to its larger scale |
| group headings | Menu's label rows: 32 tall, 14/20 muted, on the icon column; groups 2 apart like rows | list pass: one list model | Notion 12/14.4 medium |
| description | muted, after the label | Notion (a page's parent) | — |
| shortcut | Kbd small, quiet, at the end | Kbd | — |
| footer | key hints (↑ ↓ Move, ⏎ Open, ⎋ Close), each also a button: ↑ and ↓ move the highlight, Open runs it, Close closes; 24 plates (Button xs height and radius) with the keycap on their 4 inset, the `bg-hover` wash, ink fixed; disabled (50%) with no results; out of the tab order and focus kept in the field; `aria-hidden` (the keys are announced by the field); quiet 16 keycaps, 12/16 muted labels; 32 tall, keycaps starting on the icon column, 16 between hints, rule above | Notion's hint row; owner: "the controls … still don't do anything" (2026-09-27) | Notion's hints are text only |

## Behavior and accessibility

The dialog is a native modal `<dialog>` (focus trapped, inert page); the field is
`role=combobox` with `aria-expanded=true` and `aria-activedescendant` on an always-shown
`role=listbox` of grouped `role=option` rows. Focus stays in the field. ↓/↑ move (wrapping,
skipping disabled rows), Ctrl+Home/End jump, Enter runs the highlighted row and closes
(unless `keepOpen`), Escape clears the query and then closes, a click on the scrim closes.
`hotkey="mod+k"` toggles it (⌘ on Apple platforms, Ctrl elsewhere).

## Verification

- Headless Edge, real keys and pointer (`scratchpad/palette.mjs`): ↓↓ from Roadmap reaches
  Research notes; "s" narrows to four and highlights the first; ↑ wraps past disabled Trash
  to Settings; the modal opens from its button with focus in the field, "copy" leaves Copy
  link; the modal sits 77 from the top, 600 wide, corner 16, rows 8; Escape clears then
  closes; ⌘K opens with focus in the field; Enter runs and closes.
- React test: roles, grouping, disabled row, spoken shortcut, empty state.
- Unverified: dark theme, screen reader output, IME.

## Open questions

- Filter chips (Notion's "Title only", "Created by") and a preview pane are left for a
  recipe; the palette takes a custom footer but no header slot yet.

## List pass (2026-09-26)

Owner: "are the controls at the bottom of command palette correctly sized or even usable?
make sure the gaps and margins for all of these menus and dropdowns and lists are
intentional and consistent." The footer items are keyboard hints, not controls: nothing in
them is clickable, and they are hidden from assistive tech (the keys are announced by the
field). Measured before: list inset 8 (Menu 4), rows at 9 and icons at 17 (Menu 5 / 13),
search icon 16, footer 13, group labels 24 tall at 12px. After, one list model for Menu,
Combobox, Command palette and Context menu: inset 4, rows 32 two apart, row radius 8,
corner 12, labels as 32 rows on the icon column, icon-to-label 12. Palette columns measured:
search icon 13 = row icon 13 = label 13 = footer 13; typed text 41 = row text 41.

## Working footer (2026-09-27)

Owner: "the controls at the bottom of command palette still don't do anything." The hints
are now pointer buttons for the same actions as their keys (`area-command-palette__hint-button`).
Verified in the gallery with pointerdown + click: ↓ moves Roadmap → Design tokens → Research
notes, ↑ moves back, Close closes the modal, Open runs the highlighted row and closes; focus
stays in the field throughout. Measured: first keycap on the rows' icon column (46 = 46),
"Move" ink to the Open keycap 16. Unverified: hover paint by eye, dark theme.
