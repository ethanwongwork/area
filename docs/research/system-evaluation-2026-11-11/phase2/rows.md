# Phase 2 · rows (B2.1–B2.7), running report

## Done (2026-11-13)

- **B2.2: one centring model** (`packages/styles/src/inset.css`, "One centring model"). A one-line text sits with its cap at (H − 1cap) / 2 from each edge. There are three forms:
  - **cap slot:** the text is trimmed, with 0.25em of padding for paint.
  - **line slot:** the text is trimmed and padded back to its line with `--_line-room` = (1lh − 1cap) / 2, and the box rounds up to whole pixels.
  - **text box:** a block whose padding is `--_cap-room` = (H − 1cap) / 2.

  Trimming has no effect on a flex or grid container (lab-tested), so a text slot is always an inner part. Families now on the model: Tabs (new `__text`), Tree view label, status and trailing text, Pagination page (text box), Tooltip (React wraps its words in `__text`, a line slot; a text-only tooltip is a text box), Selection bar count, Switch (track at the top, text (h − 1cap) / 2 down with the label trimmed), Setting row with a single line, Panel row label, Panel checkbox row, Menu trailing string, Command palette path.
  - Untrimmed text sits 0.26 / 0.62 / 0.03 / 0.33 / 0.68 high at type 12 / 13 / 14 / 15 / 16.
  - Native `<input>` values, measured by ink centroid: within a device pixel of the trimmed centre at type 12, 13, 14 and 16, and 1px low at 15.
- **B2.1: one row table** (inset.css, "One row table"):
  - Text-only rows, menu labels and the empty line start on the 8px glyph edge.
  - Icons use `fg-muted` everywhere except danger rows.
  - Separators sit round(6 − ui-dense) from the plates, with their ends on the plates' edges.
  - The Nav group break is `gap-row`.
  - Native Select options are 1 apart and start at 8.
  - A Nav with pictures reserves 20px for the picture in every row.
  - The Menu row gap falls back to `ui-cluster`.
- **B2.3:** builds on Phase 1 (ui-cluster gap, 160 floor). The palette and picker rows now use the same gap.
- **B2.4:** a two-line Menu row puts its icon in a box one line tall. Alert, Toast and Card list now use the same box technique.
- **B2.5:**
  - Switch: its box is the track's height, and the hit area is centred and out of flow (24, or 44 for a coarse pointer).
  - A Checkbox with no label is 0 tall in layout.
  - A one-line Checkbox in a Panel row is centred at the height of control-sm.
- **B2.6:** Combobox, Command palette and Composer menu render `.area-menu__empty`. Their own CSS and manifest `empty` parts are removed.
- **B2.7:**
  - In a Panel, a section that has any action reserves the action column on every row.
  - The action column hangs into the inset by `--_action-hang`, so the action's edge sits at 8.
  - Box field and Property list follow the same grid.
- **Tests and docs:**
  - New test `packages/react/tests/rows.test.mjs`: row table sweep, centring lists, no trim on flex, B2.4/2.5/2.7 rules.
  - Updated assertions for Tabs, Tooltip, empty line, dialog and editable-text.
  - DESIGN_SYSTEM: Optical insets and List rows.
  - Spec history appended for 25 families, plus edits in place.
  - Documentation parts updated.
- **Known failures:** cap-centring went from 48 to 34 (49 to 35 in total).

## Row table (rows.test.mjs, AREA_ROW_TABLE=1)

| type / density | row | glyph edge | label | separator | group break | panel hang |
|---|---|---|---|---|---|---|
| 12 / 28 | 26 | 8 | 30 | 5 | 8 | 6 |
| 12 / 32 | 28 | 8 | 30 | 6 | 8 | 8 |
| 13 / 28 | 28 | 8 | 30 | 5 | 8 | 7 |
| 13 / 32 | 30 | 8 | 32 | 6 | 12 | 8 |
| 13 / 36 | 34 | 8 | 34 | 7 | 16 | 12 |
| 16 / 32 | 36 | 8 | 38 | 7 | 16 | 12 |
| 16 / 36 | 40 | 8 | 40 | 8 | 20 | 16 |

Plates are always 1 apart. Type 12 / 36 resolves to 32, and 16 / 28 resolves to 32.

## Verified

- Light-theme captures:
  - defaults: 31 families, then 6 again after the Panel fix;
  - type 12 Compact and type 16 Comfortable: 9 families each.
- My families pass cap centring under all of those settings, apart from the Tree view status letter at type 12, which was fixed afterwards and not re-captured.
- The header-bars snapshot is unchanged. The marks and corners snapshot changes belong to other workers.

## Left / not verified

- Dark theme was not captured; the change is layout plus one ink role.
- Corner, Layer contrast and stroke were not swept.
- The app was not looked at in Electron.
- Outside my files, and still failing:
  - Code block tabs need `__text` (CodeBlock.tsx).
  - Toggletip's text span is flex.
  - Indicator's demo tab has a bare label.
  - Tag picker still uses its own empty line.
  - Accordion trigger.
