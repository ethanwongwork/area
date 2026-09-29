# Overlay behavior spec

**Status:** in review · 2026-09-27
**Captures:** `docs/research/captures/overlay/`
**Peers:** Popover, Menu and Tooltip (the surfaces this behavior drives; their specs own the
paint), BadgeGroup overflow (the first native popover), Select (native picker), Dialog

## Owner decisions

- 2026-09-27: build overlay behavior next (the gap audit's first recommendation): anchoring,
  dismissal, focus and keyboard for Popover, Menu and Tooltip.

## Job and boundaries

Opening a surface from a trigger, placing it beside the trigger, keeping it there, closing it,
and moving focus correctly. The surfaces keep their own specs; a surface without a `trigger`
renders inline exactly as before. Not here yet: submenus, context menus, a custom Select
listbox, modal Dialog wiring (native `<dialog>` already supplies it), hover cards.

## API

| Component | Props | Pattern |
|---|---|---|
| Popover | `trigger`, `open`, `defaultOpen`, `onOpenChange`, `side` (bottom), `align` (center), `offset` | non-modal dialog, `popover="auto"` |
| Menu | same; `align` (start) | ARIA menu button, `popover="auto"`, roving focus |
| Tooltip | same; `side` (top), `delay` | `role="tooltip"`, `aria-describedby`, `popover="manual"` |
| `computePosition` | anchor, surface and viewport sizes; side, align, offset, padding | exported pure function |

A button trigger gets `popovertarget`, so the browser toggles the surface, treats the trigger
as its invoker (a press on it is not an outside press) and anchors to it. Other triggers
toggle on click.

## Sources

| Id | Type | What | Link / commit | Captures |
|---|---|---|---|---|
| chatgpt | product | Chat actions menu (Radix): anchoring, focus, keys | chatgpt.com, 2026-09-27 | `chatgpt--chat-actions-menu--open--light` (rects in `meta.note`) |
| radix | design system | Popper, Popover, DropdownMenu, Tooltip, Themes defaults | radix-ui/primitives @ f7ecd5ab; radix-ui/themes @ 1faff10a | source reading |
| react-aria | design system | useOverlayPosition, menu trigger, tooltip state | adobe/react-spectrum @ 16eead67 | source reading |
| base-ui, fluent, primer, shadcn, floating-ui, ariakit, mui | design systems | defaults for offset, padding, delays, motion | pinned in the research report below | source reading |
| apg | guidance | Menu Button and Menu patterns | w3.org/WAI/ARIA/apg/patterns/menu-button/ | — |
| wcag | guidance | 1.4.13 Content on Hover or Focus | w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html | — |
| platform | support | Popover API baseline 2024-04; anchor positioning baseline 2026-01; `overlay` Chromium only; `popover="hint"` not baseline | web-features 3.40.0; MDN BCD a2d2a599 | — |

Notion and Figma: the page menu and tooltips were not measured (the Chrome window was hidden,
which throttles timers and blocks keyboard focus; a click opened Notion's Updates panel
instead, closed again). ChatGPT's tooltip did not appear for the same reason.

## Measurements

ChatGPT chat actions menu (`chatgpt--chat-actions-menu--open--light`, `meta.note`): trigger
20 × 20 at (278, 400.66); positioning wrapper at y 421.5 (under 1px below the trigger);
surface 188.88 × 270, side bottom, align start. Pointer open focuses the surface
(`tabindex=-1`); Enter opens on the first item; ArrowUp at the first item stays (no wrap);
Escape closes and focuses the trigger; Tab keeps focus in the menu (Radix's modal menu). The
focused item paints a 5% plate, no ring.

Area, headless Chromium (2026-09-27, gallery `behavior-*` tiles):

| Check | Result |
|---|---|
| Menu: pointer open / Enter / ArrowDown / ArrowUp | surface / first item / first item / last item |
| Menu: arrows wrap; disabled skipped; Home, End; typeahead | yes; yes; yes; next item by first letter |
| Menu: Escape / item chosen / Tab / outside press | closes, focus to trigger / same / closes, focus moves on / closes |
| Menu gap and align | 4px below, start edges equal |
| Popover: open | first control focused, 8px below, centred |
| Popover with arrow | 25px above (8 + 17 arrow reach), surface focused |
| Tooltip: hover | closed at 250ms, open by 700ms, 4px above, centred |
| Tooltip: pointer to tooltip / away | stays / closes |
| Tooltip: second within 300ms / Escape / Tab focus | opens at once / closes / opens at once |

## Decisions

| Behavior | Area | Basis | Reason when it differs |
|---|---|---|---|
| layer | native popover, top layer | Popover API baseline; BadgeGroup precedent | — |
| positioning | JS `computePosition` + `position: fixed`, re-run on scroll, resize and size changes | Radix, React Aria, Fluent, Base UI all position in JS | CSS anchor positioning cannot report the side it chose, which the arrow and origin need; Primer's CSS path is flag-gated |
| menu gap | 4 | Radix Themes, Fluent, Primer, shadcn | ChatGPT (Radix default) ~1 |
| popover gap | 8; + 17 with the arrow | Radix Themes, React Aria, Spectrum 2 (adds arrow size) | — |
| tooltip gap | 4; + 4 with the arrow | Radix Themes, Fluent, Primer; Spectrum 2 adds the arrow | shadcn, Base UI 0 |
| viewport padding | 8 | Ariakit 8; Radix Themes 10; React Aria 12 | — |
| flip / shift | flip to the opposite side when it has more room; shift along the edge | Radix, Floating UI | — |
| defaults | Menu bottom/start; Popover bottom/center; Tooltip top/center | Radix Themes, Fluent Menu, Primer (start); Radix, Base UI, React Aria tooltips | Popover centres because its arrow sits at the surface's centre |
| menu height | capped at the room on its side, scrolls | Radix Themes `available-height` | — |
| popover focus | first control, else the surface | Radix FocusScope, Base UI | — |
| menu focus | surface on pointer, first item on keys, last on ArrowUp | Radix, React Aria; APG | — |
| menu keys | wrap on; disabled skipped; typeahead resets after 1000ms; Tab closes | wrap: React Aria, Base UI, Fluent; skip: Radix, React Aria; APG Tab | Radix and ChatGPT keep focus on Tab (modal menu); APG, Fluent and Primer close |
| menu item highlight | focused item takes the hover plate; keyboard focus adds the shared ring | ChatGPT plate; Area menu ring (cohesion audit) | — |
| dismissal | Escape, outside press, choosing an item; focus returns to the trigger | APG; every system | — |
| tooltip timing | 500ms; instant for 300ms after another closes; close 0 | Ariakit 500 / 300; Radix skip 300 | Radix 700, Base UI 600, React Aria 1500 |
| tooltip triggers | hover; keyboard focus only (`:focus-visible`); hidden on press, blur, Escape | React Aria, Base UI, Primer, MUI | — |
| tooltip hover | bridge over the gap on the trigger's side | WCAG 1.4.13; Primer's `::after` bridge | Radix uses a grace polygon |
| motion | 150ms fade + scale from 0.97 at the trigger; tooltip 100ms fade only; none reduced | shadcn 150ms; Radix Themes 0.97; Primer tooltip 100ms | Exit animates only where `overlay` exists (Chromium) |

## Behavior and accessibility

Menu: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` on the trigger; the menu is
labelled by the trigger. Tooltip: `aria-describedby` adds the tooltip id to any existing
description. Popover: `aria-haspopup="dialog"`; give the surface a name. Items with
`data-keep-open` do not close the menu (for toggles inside it).

## Verification

`packages/react/tests/overlay.test.mjs` (7 tests: placement, flip, shift, alignment,
available height and origin, and the ARIA markup of each trigger). Interaction checks above,
driven by real pointer and key events over the DevTools protocol. Unverified: Firefox and
Safari, touch, screen readers, RTL alignment on screen, nested popovers.

## Feedback log

- 2026-09-27 · owner chose overlay behavior → built as above → research report (Radix, React
  Aria, Base UI, Fluent, Primer, shadcn, Floating UI, Ariakit, MUI), `chatgpt--chat-actions-menu`.

- 2026-09-28 · Popover `anchor` (a ref): position against that element instead of the trigger, for
  a field whose input opens the surface (the gallery date field anchors Calendar to the Input's
  shell while the inner input is the trigger). Menu and Tooltip do not take it.
- 2026-09-28 · a Popover whose only child is a Calendar hugs it (`inline-size: max-content`) instead of
  the 320 reading width (owner: the date picker "extends too big").
