# Context menu spec

**Status:** accepted · 2026-09-28 (batch 18; was: in review · 2026-09-26)
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
| rows | Menu's: icon, shortcut, separator, danger, disabled, submenu (`MenuSub`) | menu.md | Notion page menu |

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| notion | target product | Right-click on a sidebar page: page menu, nothing chosen (re-measured live 2026-09-28, unchanged) | app.notion.com, 2026-09-26 | `notion--context-menu--open--light` |

## Measurements (Notion)

- Pointer at (59, 375) → menu corner at (59, 376): 0 across, 1 down (rounding).
- 265 wide; radius 10; white; shadow 0 20 24 5%, 0 5 8 2.7%, 0 0 0 1 ring (the lift Area's
  Menu already uses); rows 28 tall, radius 6, 4 in from the edge.

## Decisions

| Slot · property | Area value | Basis |
|---|---|---|
| name | `aria-label` names the menu (`label` is a deprecated alias) | Audit S17 |
| open state | uncontrolled for opening (no `open` / `defaultOpen`); `onOpenChange` reports it. The position comes from the pointer or the focused element, so it cannot be opened from state: a documented exception to the overlay contract (overlay.md) | Audit S17 |
| position | the menu's top-left at the pointer; flipped across the pointer when it would leave the viewport (8 margin); keyboard: under the focused element, at its start | Notion; WAI |
| surface, rows | Menu, unchanged | menu.md (same Notion lift) |
| layer | native `popover="auto"` (top layer; Escape and click outside close it) | Popover |
| focus | pointer: the menu takes focus, nothing highlighted; keyboard: the first row | WAI menu |
| close | choosing an action or a radio choice (a checkbox row or a `MenuSub` row keeps it open, as the anchored Menu; audit D-11, ContextMenu.tsx:93-94), Escape, Tab, click outside; focus returns to where it was | WAI menu |

## Visual pass

2026-09-28 (batch 18), live in Claude in Chrome: right-click on a Notion sidebar page (then
Escape). The menu matches the 2026-09-27 capture exactly: 265 wide, corner 10, white, lift 0 20 24
at 5% + 0 5 8 at 2.7% + the 7% ring; rows 28 tall, corner 6, 4 from the edge, 1 apart; icon 20 at
8; label 14/16.8 at 36; shortcuts and footer 12 muted; the section label 12/14.4 500. Area's
context menu is Menu (approved batch 2): the same lift and 4 inset, 32 rows with an 8 corner, 16
icons, 14/20 labels, 12/16 section labels, quiet 12px shortcuts (unboxed, string or Kbd alike; audit S12a); the type matches, the rows are one
step larger on Area's scale (Notion's 28 rows belong to the compact density). No change.

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

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`, "Context menu": `fast` ease-out in and out, `opacity` + `scale` from
0.97, origin at the pointer. Verified on `/context-menu.html` in a background tab (computed
styles, `getAnimations()`, inline custom properties).

| Interaction | Before | After |
|---|---|---|
| enter | Menu's `duration-base` 150, scaled from the menu's centre | `duration-fast` 100 `ease-out` (`context-menu.css`), `transform-origin` at the pointer: `--_context-origin-x/y`, the pointer's place inside the menu after any flip (verified: `0 0` opening down-right, `224px 0` flipped left, `0 155px` flipped up) |
| exit | 150, and the rows unmounted the moment it closed, so the fade showed an empty box | `duration-fast` 100; the rows stay mounted until the exit's transitions finish (`getAnimations()`), then unmount (verified: 4 rows during the exit, 0 after) |
| keyboard open (Shift+F10, Menu key) | as pointer | same 100 clock; focus is not delayed by the animation |
| rows: hover, press, focus, checked | Menu's (sibling) | unchanged, inherited |

Crispness (research B10): the pointer is rounded to whole pixels before the flip and the flipped
corner is rounded too; the size used for flipping is the layout size (`offsetWidth`), not the
bounding rect, which the 0.97 enter scale shrank by 3%. Under CSS `zoom` (a scaled preview) the
position and origin are divided by the menu's zoom, as `overlay.ts` does. Resting menu: 488, 666,
224 × 155, `scale: 1`. Fractional pointer coordinates could not be produced by synthetic events
(Chrome truncates them), so the rounding is checked by reading the code only.

Open question: none new.

## Review note, 2026-10-15

- **What changed:** one context menu can serve a whole list: it opens only on a row (`itemSelector`), its items can
  depend on which row, and that row is tagged while the menu is open. Nothing looks different yet; marking the
  right-clicked row is the next step.
- **Why:** the app's pin menu had to read the row from the click event itself.
- **Not a new component:** it is an option on Context menu.

## Feedback log

- 2026-09-30 · audit S17 (owner: normalise the API vocabulary) → `aria-label` names the menu (`label` deprecated alias); opening stays uncontrolled, a documented exception (its position comes from the pointer or focused element).
- 2026-10-03 · radius audit D1 (owner) → the container role is 12 at compact too (was 8; Figma 13, Cursor 12-14), so this family's surface is 12 at both densities; rows concentric with a floating surface follow (compact 24 rows r8). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → fast enter and exit (100) from the pointer: origin written after the flip, coordinates rounded (B10), flip measured on the layout size, rows kept through the exit. context-menu.css, ContextMenu.tsx.
- 2026-10-15 · PRODUCT_UI.md open gap ("A per-item context-menu target: the gallery's PinMenu reads data-key from the event"), owner: "merge it, then continue working" → `itemSelector`: the menu opens only on a matching element inside the area (from the pointer, or the focused element for Shift+F10 and the Menu key), `menu` may be a function of that element, and the element carries `data-context-target` while the menu is open (a hook; nothing is painted). Outside an item nothing opens and the browser's own menu shows. The app's PinMenu uses it (`[data-key]`). Gallery: Behavior / one menu per row.
- 2026-10-16 · owner, review round 27 (components27) → approved (`itemSelector`) → Complete again in `component-status.mjs`.
