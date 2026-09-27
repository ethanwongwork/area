# Context menu spec

**Status:** in review · 2026-09-26
**Captures:** `docs/research/captures/context-menu/`
**Peers:** Menu (the surface and rows, unchanged), Popover (top layer)

## Owner decisions

- 2026-09-26: "do each of them subsequently" — third in the product-specific inventory.

## Job and boundaries

Opens a Menu where you right-click an area (a page in a list, a layer, a canvas object), or
under the focused element from the keyboard. Only placement and opening are new; the menu is
Menu. Not a dropdown Menu (opened from a button), not a Popover (content, not actions).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| trigger | pointer (right-click), keyboard (Shift+F10, Menu key) | WAI; every product | Notion, Figma, ChatGPT |
| rows | Menu's: icon, shortcut, separator, danger, disabled | menu.md | Notion page menu |

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| notion | target product | Right-click on a sidebar page: page menu, nothing chosen | app.notion.com, 2026-09-26 | `notion--context-menu--open--light` |

## Measurements (Notion)

- Pointer at (59, 375) → menu corner at (59, 376): 0 across, 1 down (rounding).
- 265 wide; radius 10; white; shadow 0 20 24 5%, 0 5 8 2.7%, 0 0 0 1 ring (the lift Area's
  Menu already uses); rows 28 tall, radius 6, 4 in from the edge.

## Decisions

| Slot · property | Area value | Basis |
|---|---|---|
| position | the menu's top-left at the pointer; flipped across the pointer when it would leave the viewport (8 margin); keyboard: under the focused element, at its start | Notion; WAI |
| surface, rows | Menu, unchanged | menu.md (same Notion lift) |
| layer | native `popover="auto"` (top layer; Escape and click outside close it) | Popover |
| focus | pointer: the menu takes focus, nothing highlighted; keyboard: the first row | WAI menu |
| close | choosing a row (not checkable rows), Escape, Tab, click outside; focus returns to where it was | WAI menu |

## Verification

- Headless Edge, real right-click and keys (`scratchpad/ctx.mjs`): opens at the pointer
  exactly (93, 492); ↓ reaches Copy link; Escape closes and returns focus to the area;
  Shift+F10 opens under the area (33, 558) with Copy link focused; Enter runs it and closes;
  near the bottom of a 620-tall viewport it flips above the pointer (600 → 449); a click
  elsewhere closes it.
- React test: wrapper without a box, closed named popover menu.
- Unverified: touch long-press (not handled), screen reader output, dark theme.

## Open questions

- Long-press to open on touch.
