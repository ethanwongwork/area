# Type pass: the app's chrome (2026-10-31)

The owner asked (2026-10-31): "can you do a type pass as well and make sure the type, line heights, styles, gaps between
lines of text, etc are all correctly implemented".

## How it was measured

The running Electron app (this branch), 1512 × 884, DPR 2, the owner's system (type 13, density 32), light; dark in
capture mode. Every visible text outside the specimens, on Home, Themes, Colors, Typography (and a typeface's pages),
Icons, Patterns, History, Components and Button's page, Inspiration, Settings (General, Appearance, Theme) and the
Inspector's Theme, Design, Code and Chat views:

- `type-census.js`: each text grouped by size / line height / weight / tracking and region, flagged when its size or line
  is off the ramp, its weight isn't 400 or 500, or it runs past two lines on a UI line.
- `long-blocks.js`: every block past two lines, with its line.
- `../vertical-rhythm-2026-10-30/type-rhythm.js`: the space between text blocks, baseline to cap.

## The type the app uses (type 13)

| Role | Size / line | Weight | Ink | Where |
|---|---|---|---|---|
| UI text | 13/18 | 400 | default | rows, labels, values, tabs, the path, table cells, ledes (muted) |
| Titles | 13/18 | 500 | default (Sidebar group labels muted) | section titles, Inspector headings, buttons, segments |
| Small text | 11/14 | 400 (counts), 500 (badges) | muted | counts, badges |
| Reading / surface title | 15/22 | 500 | default | Card titles, a page-level Empty state |
| Settings page title | 19/26 | 500 | default | Settings' one title |
| Code | 0.875em inline (11.375 at 13), 11/17 in the Inspector's well, 13/18 in a page's block | 400 | syntax | Code, Code block |
| Prose | 15/24 in chat, 13/20 | 400 | default | Message (the chat) |

Tracking: the ramp's tokens are +0.0025em at 13 and +0.0075em at 11 (0.03 and 0.08 px); only Card applies them, which
is invisible at these sizes.

## Gaps between lines (baseline to cap)

| Pair | Measured | Rule |
|---|---|---|
| Section title → its lede | 8 | joined (DESIGN_SYSTEM.md, Text pairs: 8.8 at 13 over 13; Section heading trims to 8) |
| Settings label → description | 8.8 | joined |
| Card / Empty state title (15) → description | 10.3 | joined (10 for 15 over 13) |
| Inspector heading → its first row | 26.8 | the heading row's own 8 + the panel's row gap |
| Inspector rows | 16.8 (17.3 with mono values) | rows 8 apart |
| Lede → first table text | 24.3 | heading 12 to the frame + the cell's 7 |
| Table rows | 23.8 (33 pitch) | |
| Section → section | 52.5 | 40 + the cells' padding |

## Found and fixed

1. **Empty states inside a section spoke louder than the section.** Home's three (Projects, Inspiration, Recent) and a
   project's Explorations and Versions used Empty state md: a 15/22 title under the section's 13/18. Now `sm`: title
   13/18 500, description joined (8.8). Page-level ones (no results, a missing library, a typeface not installed) keep md.
2. **The Props table's rows were 36.4, the other tables' 33.** A single prop name was wrapped in a grid stack, which
   made its inline Code a block whose padding added to the line (21.4 for 18). One name is now inline Code; only several
   names stack.

Both: `docs/PRODUCT_UI.md`, "One voice for the feed's text".

## Checked and correct

Every chrome text is on the ramp (13/18, 11/14, 15/22, 19/26) with weights 400 / 500 only; all joined pairs are 8 to
10.3; nothing runs past two lines on a UI line except table cells (below). Light and dark.

## Open, for the owner

- **q-cards.** Home's New system cards title at 15/22 (Card's one title role, every size) under a 13/18 section title:
  the one place a card's title outranks its section. Options: keep; or draw the three ways as the feed's tiles (13/18
  names).
- **q-table-lines.** Table descriptions wrap to 3–8 lines on the 13/18 UI line (Button's Props: up to 8). The rule keeps
  tables on UI lines (DESIGN_SYSTEM.md, Prose lines); Primer's prop table runs 1.67 and Notion's 1.43. Option: a wrapped
  cell takes the prose line, 13/20, rows of one line staying 33.
- Not changed: the 0.5px row jitter at a table's first and last rows (its rules, not its type), Geist Mono's 0.5px in a
  Geist line.

## Built after the owner's picks (2026-10-31)

- **q-cards:** Home's ways to start a system are Settings' framed rows (name 13/18, its line joined, Start at the end,
  Import marked Later), not Cards. Tiles weren't used: the feed's Tile always draws a picture, which these have none of.
- **q-table-lines and "why do the tables have so much more horizontal spacing inset added than vertical":** md and lg
  cells on the prose line (13/20), their block inset the frame's less the half-leading (9), so text is 14 from the rules
  as from the frame. Rows 33 → 39 (Compact 35, Comfortable 47). sm unchanged.
