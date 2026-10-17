# Libraries: how style layers reach components (checked 2026-10-16/17)

Research agent report, condensed. Pinned sources:
- daisyUI `bf3bac3a`
- Untitled UI `1d410cb8`
- shadcn `d2fba50e`
- Neumorphism UI (Themesberg) `d17658d0`
- Soft UI (Creative Tim) `05db0bb7`
- glasscn-ui `756203a2`
- Frosted UI `48e33718`
- Radix Themes `1faff10a`
- tweakcn `a3b47b37`
- HeroUI Pro Glass (docs)

## daisyUI 5: `--depth` and `--noise` (values at depth 1)

`--depth` is 0 or 1 in every theme (13 use 1, 22 use 0). Only one theme sets `--noise`.

| Component | Depth | Noise |
| --- | --- | --- |
| Button (solid only; ghost, outline, dash, soft and link set it to 0) | border = bg + 5% black; inset `0 .5px 0 .5px` white 6%; drops `0 3px 2px -2px`, `0 4px 3px -2px` in its own bg at 30%; text-shadow white 0.15. Active: no inset or drop, 0.5px down | yes |
| Input, textarea, select, file input, OTP | inset `0 1px` (input colour 10%) top, inset `0 -1px` white 0.1 bottom (a well) | button part only |
| Select picker | xl drop scaled by depth | – |
| Checkbox, radio | unchecked: inset `0 1px` black 0.1 (a well); checked: inset top gloss white 0.1 + drop `0 1px` black 0.1 | yes |
| Toggle | track well; knob gloss + drop | knob |
| Range thumb | gloss + drop | – |
| Tabs (box style only) | track: opposed 0.5px lines; active tab: lit top + soft neutral drop | – |
| Menu active item | `0 2px 3px -2px` in its own colour | yes |
| Alert (solid only) | inset top white 0.08, a tinted 1px ring, small drop | yes |
| Badge | noise only | yes |
| Status dot | radial highlight + small drop | – |

**Neither variable:** card, modal, dropdown, tooltip, toast, table, kbd, progress, avatar, navbar, list, stat, steps,
calendar, chat, collapse.

## Untitled UI: shadow tokens by component

- **xs-skeuomorphic:** primary, secondary and destructive buttons (solid ones also get a white 12% inner border).
  Tertiary and link get none.
- **xs:** fields, modern badges, table container, active bordered tab, slim toggle knob.
- **sm/md:** toggle knob, slider handle.
- **lg:** dropdowns, popovers, tooltips.
- **xl:** modals, slideouts, date picker.
- **None:** checkbox, radio, tags, avatar, pagination.

## shadcn new-york-v4

- **xs:** outline button only, fields, checkbox, radio, switch, toggle outline.
- **sm:** card, slider thumb, active tab.
- **md:** popover, hover card, select, menus.
- **lg:** dialog, sheet, dropdown.
- **None:** solid buttons, badge, alert, tooltip, table, kbd, progress, avatar.
- **tweakcn** retunes the shadow tokens only: every component keeps its own level.

## Neumorphism and Soft UI

- **Neumorphism UI** raises buttons, pagination, some badges and toasts (`3px 3px 6px` pair); raises dropdowns and nav
  pills more softly.
- It recesses (inset) pressed buttons, fields, checkboxes, the progress track, active nav and list items, dropdown
  items, and even popovers, tooltips and modals.
- Tables and alerts stay flat.
- **Soft UI** turns the depth system off. It gives only soft drops to buttons, cards, the navbar and dropdowns; glass
  is an opt-in `.blur` class used on navbars.

## Glass themes

- **Radix** `panelBackground="translucent"` (white 0.7, blur 64px) reaches **cards and tables only**. Overlays stay
  solid; fields use a 0.85 surface without blur.
- **Frosted UI** puts translucency on **overlays only** (menus, popover, hover card: white 0.85, blur 20px, saturate
  190%). Card, dialog panel, drawer, toast, select and tooltip stay solid. Reduced transparency makes everything solid.
- **glasscn-ui** puts glass on card, alert, dialog, drawer, command, dropdown, context menu, hover card and outline
  buttons. Popover, tooltip, select, sheet and the other controls stay solid.
- **HeroUI Pro Glass** frosts surfaces, fields and overlays. It blurs on iOS only; elsewhere it falls back to opaque.

## Patterns (verified in code)

- Controls take depth, and only their filled variants. Ghost, link and soft variants are stripped (daisyUI, Untitled UI,
  shadcn).
- Fields take the inverse: an inset well (top dark, bottom light), never a raised look.
- Pressed and checked states flip raised to recessed (daisyUI `:active`, Neumorphism active = inset).
- Lift follows the layer: controls xs, cards sm, popovers md/lg, dialogs lg/xl. A material retunes the ladder; it
  doesn't move components up it.
- Text, kbd, avatar, progress, rows and table cells are untouched (except full neumorphism).
- Glass goes to containers or to overlays, rarely both, never to tooltips, and always with a solid fallback.
