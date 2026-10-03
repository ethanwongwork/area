# Cursor (web) against the compact inventory (2026-10-02)

First Cursor evidence. Read from the owner's signed-in Chrome on cursor.com: the agents app
(`/agents`: sidebar, composer, ⌘K palette, model menu) and the dashboard (`/dashboard`: cards,
settings rows, fields, switch, account menu). Light theme only (the account follows System;
dark was not switched). 25 captures in `docs/research/captures/compact/cursor-web--*.json`,
redacted (no names, email or text content); checksums pass `capture-compare.mjs`.
The window was hidden, so `meta.zoom` reads 0.31; it is an outer/inner-width artefact, not
page zoom (viewport 1504, dpr 2).

**Caveat.** This is Cursor's web UI, not the desktop editor. It runs a step denser than
Area's default but looser than Area compact: UI type 13/18, menus 26–28 rows, nav and palette
rows 32, icons 14. It is good evidence for controls, menus, palette and the composer; it is
not a substitute for the editor's 22–24 rows (vscode.dev stays the stand-in there). Two
component systems ship side by side: the newer `ui-*` set (model menu, badges, icons) and a
Tailwind/Radix set (palette, cards, account menu); values below say which.

## Matches (Cursor agrees with what compact ships)

| # | Value | Compact ships | Cursor | Capture |
|---|---|---|---|---|
| 9, 10 | control-md height · gutter | 28 · 8 | 28 · 8 (primary, secondary, Upgrade, input) | `button-primary`, `button-secondary`, `button-28`, `input` |
| 33 | radius-control-md | 6 | 6 (all 28 controls) | same |
| 4 | control-sm height | 24 | 24 (icon buttons, composer controls, model trigger) | `icon-button-24`, `composer` |
| 40 | Menu container inset | 4 | 4 + 1 ring (both menus) | `model-menu`, `account-menu` |
| 47 | Palette search row | 40 | 40 (sides 12, icon 16, gap 8) | `command-palette` |
| 48 | Palette row corner | 4 (8 − 4) | 4 in an 8 shell, list inset 4: concentric | `command-palette` |
| 25, 37 | Badge height · corner | 16 · 4 | 16 · 4, 12/16, sides 3 | `badge`, `nav-row-badge` |
| 104 | Composer corner | 12 | 12 | `composer` |
| 36 | Container corner | 8 | palette 8; account menu 6; model menu, cards and composer 12 | — |

## Conflicts (Cursor differs)

| # | Value | Compact ships | Cursor | Note |
|---|---|---|---|---|
| 103 | Composer inset / control gap | 6 / 6 | 12 / 12 (editor pad 12; add → model trigger 12; send 12 from the end and bottom) | Larger than Area's default 8 too. The composer card is 120 tall. |
| 7 | Button icon-to-label gap | 4 | 6 (28 buttons); badge 4 | Default ships 6. |
| 32 | radius-control-sm (24) | 4 | 6 on 24 icon buttons; composer controls are pills | Cursor keeps 6 at both 24 and 28. |
| 41 | Menu row gap | 0 | 1 (`gap-px` in both menus) | VS Code and Figma 0. |
| 42 | Separator spacing | 4 / 1 / 4 | 5 / 1 / 5 (margin 4 + the 1 gap) | Matches VS Code 5 / 1 / 5. |
| 17 | Menu row height | 24 | 26 (model menu, pad 4 × 8) · 28 (account menu) | Web density; the editor is 22–24. |
| 18 | Row glyph edge | 8 | 8 (nav, model menu) · 6 (account menu) | Mixed; supports 8 with 6 as the tight case. |
| 19, 44 | Label column (row inset + icon + gap) | 32 (8 + 16 + 8) | 30 in the nav row (8 + 14 + 8) and the account menu (6 + 18 slot + 6) | Same inset and gap as Area; the 2 is Cursor's 14 icon. |
| 43 | Menu row corner | 4 | 8 in a 12 menu (concentric) · 4 in a 6 menu (not) | — |
| 6, 11 | Icon in sm/md controls and rows | 16 | 14 (`ui-icon` 14 everywhere; palette lucide 16) | Area holds the 16 native cut; Cursor draws 14. |
| 8 | UI type | 12/16 | 13/18 (menus, buttons, rows); 12/16 palette rows and input; 11/14 section headings | — |

## New reference values (no Area value to compare yet)

- Dashboard card: inset 24 (plan card 20 top), gap 16–20, corner 12, 1px ink 4% ring. A
  default-density card, not a compact one.
- Settings row: pad 12 × 16, column gap 20, divider inset 16 (1px, ink 4%); field 28 tall,
  1px border, corner 6, sides 8.
- Switch: 34 × 20 track, 16 thumb, 2 inset.
- Promo card (toast-like, bottom centre): 58 tall, inset 12 + 1 border, gap 12, corner 12,
  32 icon plate at corner 8; title 12/16 medium, body 11/14.
- Palette rows: 32 tall, pad 8 × 12, icon-to-label 12, heading 11/14 at pad 6 × 8.
- Hover and selected rows paint ink at 6% (nav, model menu) or 8% (palette, account menu);
  foreground holds. Primary button hover lightens #141414 → oklab 0.269.

## Effect on the open recommendations

- **R11 (one-rung spacing, ≈47 gaps): keep.** Cursor brackets it as the products did before:
  menu and palette insets match (menu inset 4, search row 40, row inset and gap 8) while the composer and cards are
  larger than Area at either density. Nothing here argues for a different single rung.
- **Candidates for the owner** (not applied): composer inset at compact (Cursor 12, VS Code
  has no composer); separator 5 / 1 / 5 now has two dense products (VS Code, Cursor) against
  Area's 4 / 1 / 4 — a default change, as R10 noted; radius-control-sm 6 vs the painted-height
  rule's 4 (Cursor 6, VS Code 4, Figma 5).
- **Still unmeasured:** the Cursor desktop editor (chat panel, code block, notification toast,
  panel tabs, keybindings table), dark theme, a Figma dialog and a sectioned Figma popover.
