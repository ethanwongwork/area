# One system for the Canvas feed (2026-10-31)

The owner asked (2026-10-31): "also open to increasing the margins to 32px for the main feed canvas, for both gallery and
documentation views. i think all the content in the canvas feed is not very consistent and doesnt look well balanced
visually, including the tables, the asset cards, the headers/descriptions, the copy, etc. i want to simplify everything
that goes into the feed overall and just make things more consistent, more cohesive, more visually balanced and
intentionally spacious."

## What the feed drew (measured, type 13 / 32, `feed-inventory.js` in the running app)

| Block | Corner | Inset to its text | Caption | Grid |
|---|---|---|---|---|
| Plain tile (Systems, History, Patterns, the Stage's head) | 16 | **12** | name top-left | unit pairs (Patterns), cards (Home) |
| Asset card (typefaces, boards, the Components overview) | 16 | **16** | name at the foot, or on hover | cards |
| Colour card | 16 | **16** | step top, values at the foot | its own sheet, 4 apart |
| Table (Recent, docs, a typeface's About) | **14** | **14** at the frame, 7 above and below | header row | — |
| Settings' rows (and Home's ways) | 16 | 16 at the sides, 12 above and below | — | — |

Around them: margin 16, cards 8 apart, heading 12 over its block, sections 40 apart. Three insets (12, 14, 16) and two
corners in one feed; tables taking their values from the Table component at type 13 while the app's constants held
still; Patterns on an older grid (pairs of 152 units), the rest on the card grid.

## The system (built)

| Role | Compact | Default | Comfortable | Where |
|---|---|---|---|---|
| Margin round the feed | 24 | **32** | 40 | `--_canvas-margin` |
| Cards apart | 8 | **12** | 16 | `--_canvas-gap` (colour's swatch sheet stays 4) |
| Inside every frame | 12 | **16** | 20 | `--_frame-inset`: tiles, the Stage, Asset cards, colour cards, Settings' rows (their sides; 4 less above and below), feed tables (`.studio-table` → `--area-table-edge`) |
| Corner of every frame | 16 | 16 | 16 | `--_tile-radius`; feed tables `--area-table-corner` |
| Heading to its block | 12 | **16** | 20 | `--_canvas-heading` (and Settings' groups) |
| Sections apart | 40 | **48** | 56 | `--_canvas-section` |
| Loose text from the frames | 4 | 4 | 4 | `--_text-inset` |
| Grid | | | | one card grid everywhere: at least 260, at most four across (Patterns and a project's pages moved onto it) |

The ladder grows outward: cards 12 < heading 16 = frame 16 < margin 32 < sections 48; the margin is twice the frame inset
(Claude Code's transcript gutter is 32). Tables in the feed: 16 at the frame, text 16 from the rules (block 11), 13/20
lines, rows 43 (Cursor's 42, Primer's 44). Everything is on the spacing ramp and steps by density level.

New public hooks on Table (as Asset card's): `--area-table-corner`, `--area-table-edge` (md and lg), listed in
`OVERRIDABLE` (packages/tokens/src/emit/rederive.ts). The app sets them only on its feed tables (`FEED_TABLE` in
src/tile.tsx), so Table specimens in tiles and screens keep the component's own values.

## Checked

Margin, gaps, heading and section steps and the frame inset measured at 28 / 32 / 36 in the app (exactly the table above);
Colors, Typography, Patterns, Home, Button's API tab looked at, light and dark. Typecheck, 630 React tests, contracts,
27,922 token tests, desktop tests, playgrounds, app-css and docs pass.

## Not changed (owner's earlier picks; say if they should go)

- The resting shadow on Asset cards (the Theme's Shadow › Resting), which plain tiles don't draw.
- Colour's swatch sheet at 4 apart (owner, 2026-10-24).

## Names top-left everywhere (owner, 2026-10-31: "Yes, top-left everywhere")

Every gallery's card names its contents in its first row: component examples (with Copy), typeface cards, Home's and
Inspiration's boards, Inspiration's images, the Add image picker, pattern screens, history and the Stage. Measured in each
kind of card: the name's cap 16 below and its start 16 in from the frame, 13/18 regular. Asset card's own `caption="above"`;
no component changed. Light and dark checked.
