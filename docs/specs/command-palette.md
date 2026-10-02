# Command palette spec

**Status:** accepted · 2026-09-28 (batch 18; was: in review · 2026-09-26)
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

| chatgpt | target product | "Search chats" palette, ⌘K, nothing typed (titles redacted) | chatgpt.com, 2026-09-28 | `chatgpt--search-palette--open--light` |

ChatGPT's search could not be captured on 2026-09-26 (the tab stopped responding); captured on
2026-09-28 with the window visible.

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
| surface | Dialog's: border, opaque surface, floating lift `--area-shadow-float` (command-palette.css:42; `none` under Flat), scrim 13% | dialog.md | Notion's translucent blur is not in Area's surfaces |
| corner | row radius + list inset = 8 + 4 = 12 (Menu's and the Combobox list's) | list pass: one list model; kept by owner (audit D-23 A, 2026-09-30) | Notion 20 with 12 rows in a 10 inset; ChatGPT and Notion draw their palettes larger than their menus (corner 16–20, rows 36–48, audit D-23); Area keeps the list model (12 / 32) |
| search row | 48 tall, 16/24 text; the glyph on the rows' icon column (13 from the edge), the typed text on their text column (41), `--area-gap-row` after the glyph (command-palette.css:56), rule under it | list pass | Notion puts its field 12 in |
| rows | Menu rows (32, 8 radius, 5% wash), icon 16, 12 gap (`--area-gap-row`, command-palette.css:28; labels at 36) | menu.md | Notion's 36 rows and 20 icons belong to its larger scale |
| group headings | Menu's label rows: 32 tall, 12/16 muted, on the icon column; groups 2 apart like rows | list pass: one list model; Menu labels 12/16 (2026-09-27) | Notion 12/14.4 medium; ChatGPT 14/20 regular |
| description | muted, after the label | Notion (a page's parent) | — |
| empty state | one quiet row, 32 tall, muted, at the text-only inset (32 − 1cap) / 2 — the Combobox row (command-palette.css:97-105) | audit D-24 A (owner 2026-09-30): one empty-state row everywhere | Was a centred 96 block |
| shortcut | Kbd small, quiet, at the end; renders like Menu's string shortcut (UI font 12/16 400, muted, unboxed; kbd.css:89-102) | Kbd; Menu | Was the keyboard face at 500 until audit S12a |
| footer | key hints (↑ ↓ Move, ⏎ Open, Esc Close), each also a button: ↑ and ↓ move the highlight, Open runs it, Close closes; 24 plates (Button xs height and radius) with the keycap on their 4 inset, the `bg-hover` wash, ink fixed; disabled (50%) with no results; out of the tab order and focus kept in the field; `aria-hidden` (the keys are announced by the field); quiet keys (unboxed UI font 12/16, as the row shortcuts), 12/16 muted labels; plates 8 from the rule, the side and the bottom (concentric with the corner: 4 + 8 = 12; 40 tall + the rule), keycaps starting on the icon column, 16 between hints | Notion's hint row; owner: "the controls … still don't do anything" (2026-09-27) | Notion's hints are text only |

## Visual pass

2026-09-28 (batch 18), live in Claude in Chrome, opened with ⌘K and closed with Escape:

| | Notion (search) | ChatGPT (search chats) | Area |
|---|---|---|---|
| surface | 1006 × 700, corner 20, white 90% + blur 40, 0 24 48 24% lift | 720 × 460, corner 16, white, 1px 10% edge | 600 wide (modal), corner 12, Dialog's surface and lift |
| field | 16/24, 12 in, text at 50 | 16/24, 24 in; a 65-tall header with a rule and a 36 close | 16/24, 48 row, glyph on the icon column, rule under it |
| headings | 12/14.4 500 muted | 14/20 400 muted, 24 in | 12/16 400 muted, 32 rows |
| rows | 36, corner 12, icon 20, 14/16.8 | 48, corner 12, 12 in, icon 20 at 18, 14/20 at 56 | 32, corner 8, 4 in, icon 16, 14/20 |
| highlight | 5% warm black | (none until hovered) | `bg-component-hover` #f3, Menu's row plate (surface.css:1025-1026) |

Notion re-measured the same as 2026-09-27. Type matches both products (16/24 field, 14 rows,
muted headings between Notion's 12 and ChatGPT's 14). Area's rows and corner follow the one list
model (Menu, Combobox, Context menu); both products draw the palette larger than their menus
(corner 16–20, rows 36–48). No change; open for the owner: a palette-specific scale (larger
corner and rows) would part it from the list model.

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
  link; the modal sits 77 from the top, 600 wide, corner 16 (now 12, the list model's row radius + inset; command-palette.css:30), rows 8; Escape clears then
  closes; ⌘K opens with focus in the field; Enter runs and closes.
- React test: roles, grouping, disabled row, spoken shortcut, empty state.
- Unverified: dark theme, screen reader output, IME.

## Open questions

- Filter chips (Notion's "Title only", "Created by") and a preview pane are left for a
  recipe; the palette takes a custom footer but no header slot yet.

## List pass (2026-09-26)

Owner: "are the controls at the bottom of command palette correctly sized or even usable?
make sure the gaps and margins for all of these menus and dropdowns and lists are
intentional and consistent." The footer items were keyboard hints, not controls: nothing in
them was clickable, and they were hidden from assistive tech (the keys are announced by the
field). *Superseded: each hint is now also a quiet button (↑ / ↓ move, Open runs, Close closes;
command-palette.css:125-142; see Decisions, footer).* Measured before: list inset 8 (Menu 4), rows at 9 and icons at 17 (Menu 5 / 13),
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

## Footer inset (2026-09-28)

Owner (screenshot of a hovered ↓ plate): "is this spacing at the bottom correct?" It was not:
the plates sat 8 from the side but 3.5 from the rule and from the bottom edge (a 24 plate in a
32 row). The footer now pads 8 on every side, so a plate sits evenly in the corner and
concentric with it (plate radius 4 + 8 = the palette's 12). Measured after, every gallery
palette: plate 8 below the rule, 8 above the inner bottom edge, 8 from the inner side; footer
41 with the rule.

Owner, same day: "should the move text be further away? or part of the backplate? it looks off
with the text so close to the arrow." The label names both arrows, so it cannot join one plate;
it now sits 6 from the ↓ plate's edge (was 2, so the hover wash met the text). 6 is the
keycap-to-label gap inside the Open plate, taken from the visible plate here.

## Feedback log

- 2026-09-30 · audit S10–S12 (owner) → the lift is the Surface axis role `--area-shadow-float` (command-palette.css:42); rows and the search row take the density token `--area-gap-row` (12, labels at 36; command-palette.css:28, :56); quiet keys render in the UI font 12/16 400, and Escape is written "Esc" (kbd.css:89-102).
- 2026-09-30 · audit D-23 (owner pick A) → kept the list model (12 corner, 32 rows) rather than ChatGPT's and Notion's larger palette (corner 16–20, rows 36–48).
- 2026-10-01 · audit D-24 (owner pick A) → the empty state is the Combobox row: 32 tall, muted, at the text inset (was a centred 96 block); the description stays after the label → command-palette.css:97-105.
- 2026-10-01 · compact pass round 7 → the search row is 48, compact 40. docs/research/compact-pass-2026-10-01.md.
- 2026-10-02 · compact pass round 9 → footer hints 16 → 12 ink to ink; hint key-to-label gap reads `gap-md` (6 / 4). docs/research/compact-pass-2026-10-01.md (round 9).
