# Phase 2 · bars (B4.1–B4.4), running report

## Done (2026-11-14, in the working tree)
- **Shared layer** (`packages/styles/src/inset.css`), four sections:
  - "Edge ghost buttons" (B4.3): `--_pull-start` / `--_pull-end` on every Button (its text side or (H − icon) / 2);
    `align` pulls only a ghost Button now.
  - "A corner control" (B4.2): one rule over 15 control selectors. Inputs `--_cc-corner`, `--_cc-inset`, `--_cc-glyph`
    or `--_cc-at`; output `--_shape` = min(H / 2, max(min(floor, own), corner − distance × concentric, own at Corner
    Pill)) + pill × full. A square surface sets `--_cc-corner: initial` and its control keeps its own corner.
  - "Two header bars" (B4.1): `--_hb-region` = control-sm + 14 + rule, `--_hb-tool` = control-md + 2 × ui-cluster +
    rule; rooms `--_hb-region-room` (7) and `--_hb-tool-room` (ui-cluster).
  - "One collapsible head" (B4.4): Plan's and Queue's head, title, chevron (4 after the title) and count.
- **Consumers.** Panel (md bar = tool bar, no rule counted; window bar = region bar; sm kept; titled bar's end action
  even + concentric; first section's heading has no top air), Titlebar (md tool, sm region, + its rule), Command palette
  search (tool + rule), Board column header and Color picker header (region; picker's end control 8 in, concentric),
  Dialog, Drawer (bottom only), Popover / Hover card, Toast, Alert (at = pad + edge + overhang, banner included; flush
  square), Calendar (glyph 0), Queue and Edit summary rows and head (`--_card-end` = (row − sm) / 2, no 4 floor), Code
  block copy (header, floating; flush square), Card's ghost header action and Message's actions (edge pull). Families'
  own `--_shape` / `--_head-button-radius` / `--_row-button-radius` removed.
- **Leftovers (B2.2):** Code block tabs take `__text`, Accordion's label is a line slot, Toggletip's note is a text box,
  the Indicator demo's tab takes `__label` / `__text`.
- **Tests:** new `packages/react/tests/bars.test.mjs` (5 tests; `AREA_BAR_TABLE=1` prints the tables); cohesion's
  chat-card and bar-of-controls tests read the new shared rules; audit-low's Calendar plain line kept whole.
- **Docs:** DESIGN_SYSTEM "Bars and corner controls" (new, before Overlays) and the corner sentence; THEMING density
  table (region bar, tool bar); area-ui-compose shell.md; spec history in 23 specs plus current-state rows (panel bar,
  board header, color picker header, palette search, queue head, dialog radius, popover close); docs entries (queue,
  message, dialog, code block, palette, color picker, panel, card, board); Button `align` JSDoc.

## Values
Bars (region / tool), from the token resolver:

| | Compact | Default | Comfortable |
|---|---|---|---|
| type 12 | 38 / 36 | 38 / 40 | 38 / 40 (resolves to Default) |
| type 13 | 38 / 38 | 40 / 46 | 44 / 54 |
| type 16 | 46 / 56 (resolves to Default) | 46 / 56 | 50 / 64 |

Only at type 12 Compact is the tool bar under the region bar (both controls on the 24 floor; cluster 6 < 7).

Corner control (Dialog's close, distance in / corner), Corner 0 · 10 · Pill:
type 12: C 12/0 · 12/4 · 12/12, D 10/0 · 10/6 · 10/14, Cf 10/0 · 10/6 · 10/14;
type 13: C 11/0 · 11/5 · 11/12, D 9/0 · 9/7 · 9/14, Cf 7/0 · 7/9 · 7/17;
type 16: C 8/0 · 8/8 · 8/18, D 8/0 · 8/8 · 8/18, Cf 6/0 · 6/10 · 6/20.
Every other control's table: `AREA_BAR_TABLE=1 node --test packages/react/tests/bars.test.mjs`.

Rendered at the defaults (light, 23 families): Panel bar 39 (sm) / 46 (md), action 9 in r7 (md) / 8 in r8 (sm panel);
palette search 47; board and color picker headers 40; Popover close 7/7 r9; Toast and Alert 5/5 r5 (banner 6/6 r4
after the fix); Calendar 10/10 r6; Queue and Edit summary rows 2/2 r6; Edit summary head 3/3 r13; Code block copy 5/5
r11, floating 9/9 r7, sm 3/3 r13; Dialog close 6 from the top, 9 from the side, r7 (see Conflicts).

## Decisions taken
- Bars count the rule they draw (the rule text): Panel md 47 → 46 at the defaults (it draws no rule since 2026-10-25;
  the plan's numbers kept the 1), the palette search 44 → 47 (it draws one; the plan's 38 / 46 / 54 left it out).
- Panel sm stays its own bar, the first option of the item's open choice.
- A corner control in a bar of fixed height sits evenly (as far from the side as from the top), the rule text, over
  the plan's "Color picker's control in 3" (glyph on the text inset), which would sit it 11 from the end beside 8 from
  the top.
- At Corner Pill a corner control keeps every control's round corner (concentric would make it squarer than every
  Button there).
- Message keeps two meta gaps with a stated reason (4 under a drawn bubble edge, the block gap under prose).
- Toolbar: no change; its surface md is the tool bar by its own inset (tested). Menu's header and footer are list
  regions, not bars (documented). Step is a line, the source of the chevron rule, not a card head.

## Conflicts for the conductor
- Dialog / Drawer close: B6.5 (popups) centres the close on the title's cap, 6 from the outer top while it is 9 from
  the side, so it is not equidistant; its corner is computed from the side distance (7).
- Code block sm's copy and Edit summary's head buttons come out 3 in, corner 13 (a full round end on a 26 button): the
  rule's value; owner to look.

## Rendered (full run, 2026-11-14, 125 families)
- `header-bars` snapshot updated deliberately: palette search 44 → 47 (+ kbd's tile), Panel md bar 47 → 46 (panel,
  description-list, surface tiles); dialog header 36.23/40 → 31.23 and drawer 14.23/40 → 9.23/31.23 are B6.5's
  (popups), recorded in the same update. Cap-centring: 0 new; Accordion trigger, Code block tab, Indicator tab and
  Toggletip no longer fail (their known-failure lines were already gone). `marks` and `corners` snapshots changed by
  other workers (Badge/Count/Citation pill corners, palette corner): not updated here.
