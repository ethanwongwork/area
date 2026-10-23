# Text and gaps, 2026-10-22

Owner, after round 67: "make sure there is consistent and intentional logic behind the visible gaps between labels
and content, both vertically and horizontally ... any labels or any placement of text (title + copy) ... do another
text style, weight + fg color pass on all the components".

## Method

`sweep.mjs` drives headless Edge over the built app (`desktop-dist`, 4410), all 119 families, light, Area defaults,
tiles at 1x. For every element with its own text it records size, leading, weight, tracking and ink, and the visible
gap to what follows it, read on the glyphs: below = the next part's cap top (or its painted edge) minus this text's
last baseline; beside = the next part's ink start minus this text's ink end; and an icon's gap before the text.
`analyze.mjs` groups texts by role (title, label, description, meta, value) and lists each style and gap with the
families behind it. Raw JSON isn't committed (re-run: `node sweep.mjs out.json light http://127.0.0.1:4410/`).

## Gaps: findings and what changed

| Pair | Before | Now |
|---|---|---|
| Title → its description (16 over 14) | Card, Approval 12; Dialog, Confirm dialog, Drawer 16; Empty state md 20; Infobox 14 | 12 everywhere |
| Title → its description (14 over 14) | Empty state sm 12; Alert, Popover, Toast 15 | 10 everywhere |
| Title → its description (14 over 12) | choice 10.5; group legend 14.5 | 10.5 both |
| Label → its control (stacked) | 11 in all 15 families with a Field label or legend | unchanged |
| Label → its value (beside) | Infobox 93 after a short label (fixed 120 column + 8) | the longest label + 12 (`fit-content(40%)`, subgrid) |
| Icon → label | 6 for controls (15 families), 12 for list rows (8), 4 for marks | unchanged: already the documented rule |
| Stepper line (horizontal) | 12 after the text, 4 before the next marker | 12 at both ends |

The title pairs followed one owner rule on Card (2026-09-28: a description under its title joins it; Figma and Notion
11.5) while the surfaces set on 2026-09-26 kept 15–16 and Empty state kept ChatGPT's 8 gap. The rule is now in
DESIGN_SYSTEM.md ("Text pairs") with a cohesion test.

Not changed, raised with the owner:
- Description list `columns` keeps Notion's fixed 160 term column (111–145 from a short term to its value). It is
  Notion's editable property rows at page width; a fitted column would match Infobox.
- Rows that sit far apart because a layout spreads them (justified rows, a card's header action) are layout, not a
  pair gap, and were left out.

## Type: findings

The roles hold together: container titles (Card, Alert, Popover, Toast, Panel, Board, Section heading, Empty state,
Calendar) are 500 in default ink; names of items and controls (a choice, a step, a timeline item, a file, an asset)
are 400; supporting lines are muted 400; field labels 400 default; button labels 500.

Fixed:
- Token row (and the token rows in Panel): 12.25/16.54, inline Code's 0.875em of a 14 host, off the ramp. Now the
  small role, 12/16.

Raised with the owner (each was approved as is, so not changed):
- The agent chat card heads: Plan and Edit summary titles are 400 default, Queue's is 400 muted, Approval's 16/500,
  while Accordion's trigger, the other collapsible head, is 500.
- Small group labels: Menu, List box and Command palette group labels are 12/16 400 muted; Badge, Count and Table's
  small labels are 12/16 500.
  Superseded 2026-10-23: the owner kept the change in `docs/research/cursor-audit-2026-10-22.md` item 1, so Menu,
  List box, Combobox, Command palette, Custom select and Context menu labels take Nav's (the rows' size, 500, muted).
- Box model's numbers sit on an 8.5 line (tight by design inside the diagram).

## Other research from round 67

- `infobox.md`: references for the Infobox rethink (column sizing, gaps, type, whether it should be its own family).
- `stepper.md`: smaller, dot and bar markers, standalone rows, tint style.
- `queue.md`: Cursor, Claude, Zed, VS Code, Codex queues; the main gap is Edit, then a height cap.
