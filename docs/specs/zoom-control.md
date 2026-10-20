# Zoom control spec

**Captures:** `docs/research/captures/zoom-control/`
**Peers:** Button (ghost sm, trailing chevron), Menu (rows, shortcuts, checks, separator), Input (the typed zoom),
Toolbar and Panel (where it sits)

## Owner decisions

- 2026-10-10: "keep working" → Zoom control, from the inventory's design-tools list ("ZoomControl (percentage menu with
  fit and 100%)"). ChatGPT's reasoning line (ThinkingDisclosure) was tried first: none of the owner's recent chats show
  one, and producing one would mean sending a message.
- 2026-10-10: "go with your recommendations" → keep Area's light Menu; the shortcut column reserve moves into Menu
  (menu.md), so Zoom control has no rule of its own for it.

## Job and boundaries

A zoom control shows a canvas's zoom as a percentage and opens a menu to type a zoom, step in and out, fit the content,
or jump to a preset; view toggles can follow. Not a Slider (no continuous drag), not a NumberField (the value is set by
commands and a typed entry inside the menu), not the canvas's own pinch or wheel zoom.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm (default), md | Button's tiers; Figma's 24 is Area's sm in compact | Figma design panel header |
| content | fit row (with `onZoomToFit`); presets (50 / 100 / 200%, the current one checked); view toggles as children | Figma's menu | Figma |
| state | at a preset, disabled | Figma checks the current preset | Figma |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Design panel › "48%" zoom and view options: the button, and its open menu | figma.com editor, a community file in the owner's drafts, viewed only; the menu opened and closed with Escape | evidence only | `figma--zoom-trigger--rest`, `figma--zoom-menu--open` |
| chatgpt, notion | target products | not found: no zoomable canvas | — | — | — |
| area | this system | Gallery tiles | the built gallery | — | — |

## Anatomy

```
figma   button (55 × 24, radius 5, 4 4 4 12, 11/16 400, a 16 chevron)
        menu surface (199 wide, #1e, radius 13, padding 8 0, Figma's three-layer shadow), 4 below the button, end-aligned
          field: input 150 × 30 (0 18 0 8, 11/16 450 white) · separator (8)
          rows 24 (4 8 4 24 inside 8, radius 5, 11/16 450): Zoom in ⌘+ · Zoom out ⌘− · Zoom to fit ⇧1 ·
            Zoom to 50% · Zoom to 100% ⇧0 · Zoom to 200% (menuitemcheckbox, a 16 check at the start) · separator ·
            Pixel preview · Pixel grid · Snap to pixel grid · Layout guides · Rulers · Outlines · Multiplayer cursors ·
            Additional labels · separator · Comments

area    button.area-button--ghost.--neutral.--sm.area-zoom-control: span.__value "48%" (tabular) · chevron-down
        div.area-menu.area-zoom-control__menu (Menu, end-aligned)
          div.__field > Input sm soft (the typed zoom) · separator
          Zoom in · Zoom out · Zoom to fit · Zoom to 50% / 100% / 200% (menuitemradio, Menu's trailing check) · separator · children
```

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| button | ghost Button sm, neutral, trailing chevron; the value in tabular figures | Figma 24 ghost with a 16 chevron, 11/16 | Area's sm (28; 24 in compact, Figma's density) and its UI type |
| menu | Area's Menu (light surface, its rows, shortcuts, separator), end-aligned under the button | Peer Menu (accepted) | Figma's menus are dark at 11/16; Area's Menu is one surface everywhere |
| typed zoom | a soft Input sm as the first row; "150", "150%" or "1.5x"; Enter applies and closes; invalid text marks the field | Figma's field | — |
| rows | Zoom in, Zoom out (× / ÷ `step`, default 2), Zoom to fit (when `onZoomToFit`), presets 50 / 100 / 200% | Figma | — |
| current preset | Menu's radio check at the row's end | Figma checks it (a check at the start) | Area's Menu puts checks at the end |
| shortcut column | plain rows reserve the check column, so shortcuts end on one line | Figma's shortcuts share a column | Menu's own rule since 2026-10-10 (menu.md) |
| range | 2% to 25,600% | Figma's range | — |

## Behavior and accessibility

The button is Menu's trigger (`aria-haspopup="menu"`, `aria-expanded`), named "Zoom 48%". The field keeps its own
keys (typing, editing, Home, End); ArrowDown moves to the rows and Escape closes the menu. Rows follow Menu: an action or
a preset closes the menu and returns focus to the button; a view toggle (`checked`) stays open. The page binds the
shortcuts; the menu shows them.

## Visual pass

In the gallery (light): the menu hangs end-aligned under the button; shortcuts end on one column after the reserve was
added (they stepped left on the preset rows before); the typed field sits on the rows' inset.

## Verification

- 2 Figma captures (redacted, read-only).
- `npm run build`, `build:docs`, `typecheck`, `zoom-control.test.mjs` (2).
- In the gallery: typing 150 and Enter sets 150% and closes; Zoom in from 150% gives 300% and returns focus to the button.
- Unverified: Area captures for the comparison table, dark and compact, screen readers.

## Open questions

Resolved 2026-10-10 (owner: "go with your recommendations"); kept for the record.

1. Figma's zoom menu is dark; Area's Menu is the light surface. Recommendation: keep Area's Menu.
2. Menu leaves no check column on plain rows, so mixed menus misalign their shortcuts. Fixed here only. Recommendation:
   move the reserve into Menu for any menu with checkable rows (a Menu change, so it goes back to review).

## Review note, 2026-10-10

- **What changed:** New component. Zoom control is Figma's "48%" button: it opens a menu where you can type a zoom, zoom
  in or out, fit, or jump to 50, 100 or 200%, with any view toggles underneath.
- **Why:** It was on the design-tools list. The rows, shortcuts and range copy Figma's; the button and the menu are
  Area's ghost Button and Menu, so it matches the rest of the system.

## Feedback log

- 2026-10-10 · owner: "keep working" → Zoom control from Figma's zoom and view options; 5 gallery tiles, in review.
- 2026-10-10 · owner: "go with your recommendations" → light Menu kept; the column reserve moved to Menu (zoom-control.css
  rule removed).
- 2026-10-11 · owner, review round 7: approved.
- 2026-10-14 · owner (desktop gallery: "find a way to add a +- percentage control … if not add it", after a "− 100% +"
  zoom row) → `stepper`: Zoom out / Zoom in ghost icon Buttons (`subtract`, `add`, each named in an Area Tooltip)
  either side of the percentage, which keeps the menu and drops its chevron; `stops` (the zooms − and + and the menu's
  Zoom in / out move between, else × / ÷ `step`); `valueLabel` ("Fit" while the view fits). The reference is a
  screenshot of a browser menu row, not a capture: sizes are Area's ghost sm Button, to be measured if the owner
  wants Chrome's own. Not yet a gallery tile.
- 2026-10-18 · owner (desktop gallery: "make the zoom view options more clear … just be Auto, Fit 50% … 200% … remove
  the zoom in and zoom out options … is there not supposed to be a gap at all between the backplate") → `views` (named
  ways to show the content, radio rows before the presets), `stepRows` and `field` (to leave out the Zoom in / out rows
  and the typed field), `presetLabel` ("50%" instead of "Zoom to 50%"); the stepper's plates stand 2 apart (edge to
  edge, two shown plates met at their rounded corners; Figma's mode switch and Segmented keep a control's plates 2
  apart, Excalidraw joins its zoom buttons on one shared plate instead, measured). Defaults unchanged otherwise.
