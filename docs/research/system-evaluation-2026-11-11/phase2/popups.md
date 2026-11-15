# Phase 2 · popups worker (B6.1–B6.7), running report

## Done (2026-11-14, in the working tree)

- **One floating surface** (`packages/styles/src/components/popup.css`, rewritten). `:where()` lists, so a family's own
  rule always wins:
  - **Frame**: one edge `edge-floating`, `bg-float`, default ink.
  - **Stack** (`--_float-shadow` = `--_m-layers`, `shadow-edge`, `--_elevation`): float by default, modal for Dialog,
    Drawer and Command palette.
  - **Listed surfaces**: Popover (and so Hover card and the Date picker and Filter bar popovers), Menu (and so every list
    opened from a control or a field, Context menu, Zoom control's and Calendar's caption menus), the search surface,
    Command palette, Dialog (Confirm dialog), Drawer, Toast, the surface Calendar and Color picker. Select's picker
    restates the same rule on `::picker(select)`. Scroll to latest takes the stack alone.
  - **Copies removed** from menu, popover, dialog, drawer, command-palette, toast, calendar, color-picker (the
    `--_picker-*` props are gone) and select.
  - **Material** (`material.css`): Calendar and Color picker (their surface forms) are added to every overlay list.
    Select's picker gets its own block (glass and layers, no ring, frost or gradient). The overlay glass fill is now
    `bg-float` (it was `bg-surface`).
- **B6.2 block gap** = `min(inset-surface-md, --_block-inset)`. Popover is 12 everywhere. Dialog and Drawer are 14 / 16 /
  16 at type 13 Compact / Default / Comfortable, and 12 at Compact. The scrolled rule follows the gap.
- **B6.3 corner table**: one equation, `corner = row + (pad − max(0, 4 − row)) × concentric`.
  - Lists: the padding is given (4).
  - Palette: the corner is given (`radius-container`), and the padding is `max(4, container − row)`.
  - Field lists only re-point their rows.
  - `--area-radius-list` (emit/base.ts) is now `row + min(4, row)`. It equals the equation everywhere, and differs from
    before only at Corner 2 (2 → 4).
  - Width hooks: `--area-dialog-inline-size`, `--area-confirm-dialog-inline-size`, `--area-drawer-inline-size`,
    `--area-command-palette-inline-size`.
- **B6.4**: kept and written. The list padding is 4 inside the edge, with no border term.
- **B6.5 footer pair**:
  - Footer text Buttons have `min-inline-size: round(up, 2.25 × H, 1px)`.
  - Demos: the Cancel in Dialog is now soft neutral, and so is the secondary in Popover's teaching step.
  - Title group (final, 2026-11-14; the interim ruling of a title on an equidistant close is reversed): the title's cap
    sits on the inset with or without a close (Dialog and Drawer 16, Popover 12; the Popover title is now trimmed). A
    close beside a title is the one named exception to the corner control: centred on the cap (`--_cc-top =
    round((1cap − H) / 2)`), its glyph on the side column, its corner from the nearer distance (`--_cc-near`, new input
    in inset.css). Dialog close at Default, type 12 / 13 / 16: top 6 / 6 / 4, side 10 / 9 / 8, corner 10 / 10 / 12 at
    Corner 10, 0 at Sharp, 14 / 14 / 18 at Pill. Titled Popover close: top 4 / 4 / 2, side 8 / 7 / 6, corner 12 / 12 /
    14, 0, 12 / 13 / 16. The last line is trimmed to its baseline.
  - Confirm dialog's own trim rule is removed, because the general rule now covers it.
- **B6.6 scrollers**:
  - One thumb value, shared by Scroll area and the thin native bars (Textarea, Code block pre, Table wrapper, the
    palette's preview, Select's picker).
  - Track ends sit `max(0, corner − 2)` from the corners. `--_bar-corner` comes from Menu, or from the public
    `--area-scroll-area-corner`.
  - ScrollArea sets `data-scroll-more`, which draws a footer rule in Dialog and Drawer.
  - Dialog's body is now a ScrollArea.
- **B6.7** (corrected 2026-11-14): Alert drops its 30rem container query and `container-type`. Alert's one-line and
  default layouts and Toast are now one wrapping row:
  - the text asks for its whole line beside the icon (`flex: 1 1 auto`, capped at the row less the icon);
  - the actions wrap to a second row only when they no longer fit beside it, end-aligned and `ui-cluster` under the
    text (`row-gap: cluster − control-block`);
  - the close sits absolutely in the top corner, equidistant from top and side;
  - the text is never cut to make room for the actions; single-line text too long for the row alone still ends in an
    ellipsis.
  Pinned by `tests/behaviour/suites/wrap.test.mjs` (type 12 / 13 / 16 × every density, wide and narrow; 18 tests).
- **Tag picker** now uses `.area-menu__empty`, and `empty` is removed from its manifest and docs.
- **Tests**:
  - New `packages/react/tests/popups.test.mjs` (10 tests; the corner table sweep runs with `AREA_OVERLAY_TABLE=1`).
  - `cohesion.test.mjs` is re-pointed to the shared rule. A `selectorList` helper expands `:where()`. The tests for depth,
    frame, stroke groups, floating ground, painted grounds and the picker now point at the shared rule. Scroll to
    latest now expects the edge.
  - `radius.test.ts`: the list is its rows plus `min(4, rows)`.

## Values

At type 13 (rows / list / palette padding / palette / panel and modal):

| | Corner 0 | Corner 10 | Corner 14 | Pill |
|---|---|---|---|---|
| Compact | 0/0/4/0/0 | 8/12/8/16/16 | 12/16/6/18/18 | 14/18/4/18/18 |
| Default | 0/0/4/0/0 | 8/12/8/16/16 | 12/16/8/20/20 | 15/19/5/20/20 |
| Comfortable | 0/0/4/0/0 | 10/14/6/16/16 | 14/18/10/24/24 | 17/21/7/24/24 |

- The one-line Toast and Alert bar is `radius-control-lg`: 10 at the default, 0 at Corner 0, 16 at Corner 14, 18 at Pill.
- Shadows, light and dark: the stack is the same everywhere. Float uses `shadow-float` (8% key at the default; dark
  doubles it); modal uses `shadow-modal`. In dark the frame takes the rim (A7.1).

## Left / not verified

- See the final message for rendered capture results.
- Outside my files:
  - Toolbar floating and Selection bar still write their own float stack (bars or toolbar owner).
  - Approval's footer is not on the 2.25 minimum (B6.5 lists it).
  - Examples `stroke-groups.tsx` and `analytics.tsx` use a ghost or outline Cancel.
  - Split button and Number field lists (B6.3) belong to the fields worker.
