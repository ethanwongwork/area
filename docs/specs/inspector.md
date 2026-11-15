# Inspector spec (PanelRow, section actions)

**Captures:** `docs/research/captures/inspector/`
**Peers:** Panel (container, sections), NumberField, ButtonGroup, Segmented, ColorField,
Checkbox

## Owner decisions

- 2026-09-23 (COMPONENTS.md, inspector foundation item 6): PropertyRow, paired fields,
  collapsible sections and property lists; typography, layout and export editors are recipes
  of the same primitives.
- 2026-09-26: "then work on the next component. if you can recreate the figma control panel
  that'd be great."
- 2026-09-26: accepted. Owner: "consider every component that you have built to be approved. if i havent given any feedback to change anything consider them approved."

## Job and boundaries

PanelRow lays out one property: an optional caption per column, two equal control columns and
one trailing square for an icon button, so every row in a panel shares the same grid.
PanelSection's `actions` put icon buttons on a section's heading. Not Field (a single labelled
control in a form), not Toolbar (a command strip). The Figma panel is a recipe, not a component.

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| figma | target product | Design panel with a frame selected (community-file copy in Drafts; selection only) | figma.com (Chrome), 2026-09-26 | `figma--design-panel-frame--rest` (463 nodes) |

## Measurements (from the capture)

- Panel 240 wide; content inset 16 (216 content).
- Rows: 24 tall. Columns 88 + 8 + 88 + 8 + 24: two field columns and a trailing icon-button
  square at 208. Alignment groups: three 29 × 24 buttons across an 88 column, soft
  (#F5F5F5), 5px radius at the ends.
- Section heading rows 32 tall, 11/32 at 550; heading actions 24px at 180 and 208 (4 apart).
- Row captions (Flow): 9/14 at 500, 50% black, about 4 above the controls.
- Frame title 13/22 at 550; buttons 11/16 at 450.

## Decisions

| Slot | Area value | Basis | Reason when it differs |
|---|---|---|---|
| row · grid | `minmax(0,1fr) minmax(0,1fr) var(--_row)`, column gap `--_panel-gap` (sm 8, md 12) | Figma 88 + 8 + 88 + 8 + 24 | Columns flex to the panel width |
| row · trailing column | the panel's row height (`--_row`: 28 in a small panel, 32 at md) | Figma 24 = its control height | Always reserved, so rows without an action still align |
| row · captions | `--_panel-label-*` muted: sm 12/16, 4 above the controls; md 14/20, 6 above (Panel's label gap; owner 2026-09-28); one caption spans both columns, two caption one each | Figma 9/14 500 at 50% | Area's caption role; Figma's smaller size belongs to compact density |
| section · heading | strong (was regular) | Typography rule (every title strong); Figma 550 | — |
| section · actions | icon buttons ending on the content edge, 4 apart | Figma 180/208, 4 apart | — |
| panel tiers | two tiers (owner 2026-09-27): `--_row` sm 28, md 32 | Panel's inset steps with them (12 / 16) | Was control-md for every tier; the xs (24) and lg (40) tiers were removed, since 24px rows belong to compact density |
| ButtonGroup · fullWidth | new: fills its column, buttons share it | Figma's 3 × 29 groups | — |
| NumberField · grouping | new, default on; the recipe turns it off (1202) | Figma shows 1202 | Forms keep locale grouping |

## Recipe

`GalleryPanelFigma` (Panel gallery, "Recipe / properties panel"): Position (alignment
groups + distribute, X/Y, rotation + rotate/flip group), Layout (Flow segmented, W/H +
constrain, Clip content), Appearance (opacity and corner radius with per-column captions +
independent corners), Fill (alpha ColorField + remove), Stroke (add). New docs icons from
Fluent: align center horizontal, align right, subtract.

## Pass 2: collapsible sections

Evidence (the same panel capture): Figma section titles are buttons with a 16px chevron icon
at x 0 in the side margin, hidden until hover (`collapsible_panel--hiddenIcon`, ink 3 × 5);
"Selection colors" collapsed is a 240 × 40 toggle whose summary is 16px color chips in 24px
slots at 132, 156, 180 and a muted count at 204.

| Slot | Area value | Basis |
|---|---|---|
| structure | `h3 > button[aria-expanded][aria-controls]`, rows in a region the button controls (`hidden` when closed) | WAI accordion; Figma's title button |
| chevron | `chevron-down` glyph, rotated to point right when closed, in the side inset (glyph sized to the inset), shown on hover or focus, always on touch | Figma: hidden chevron in the margin |
| summary | `summary` shown at the end of the title while collapsed, muted, 8 apart | Figma: chips and a "+2" count, muted |
| heading-only sections | a collapsed or empty section sits centred between its rules (16 above, 16 below) | Figma: 40px collapsed rows, text centred |
| actions | stay outside the toggle, clickable while collapsed | Figma: + on Stroke and Export |
| API | `collapsible`, `open` / `defaultOpen` (true) / `onOpenChange`, `summary` | — |

Verified with real events in headless Edge (`scratchpad/collapse.mjs`): hover shows the
chevron (opacity 1); a click opens Selection colors (`aria-expanded` true, rows shown, the
summary removed); Enter on Layout collapses it.

## Verification

- Figma capture redacted; checksum verified.
- Rendered in headless Edge at 2× (image sent in chat); React test for PanelRow.
- Unverified: dark theme; keyboard order across the groups (each button is its own stop).

## Open questions

- Compact density: Figma's 24px rows, 9px captions and 11px headings are the compact target.
- Section heading and row caption share 12/16 and differ by weight and ink (Figma separates
  them by size too, 11 against 9, which belongs to compact density).

## Audit (2026-09-26)

Variant audit of the Panel family, then fixes:

| Finding | Change | Basis |
|---|---|---|
| Bar action ended 4.5 from the edge; section and row actions end on the inset (3.5 off at sm, 7.5 at md) | the bar's end inset equals the body inset (`--_box-end = bar height − 2 × inset`) | Figma: header buttons at 208, the same column as every action |
| lg panel kept 32px rows beside 40px controls; its bar was too short for an lg action | `--_row: control-lg` at lg; bar = max(row, control-sm) + 8 + border (sm 37 unchanged, md 41, lg 49) | tiers follow their controls |
| Default, Sections and Footer tiles used md inputs, Field labels and a raw grid in an sm panel (two row styles in one family) | rebuilt on PanelRow with controls at the panel's tier | inspector row |
| No tiles for xs, md, lg, flush, bare bar | one tile each | one variant per tile |
| A named panel was a generic div with `aria-label` (not a valid name); headings were fixed at h3 | a named panel is `role="region"`, named by its title (or `aria-label`); `PanelSection headingLevel` | ARIA naming |
| Docs API lacked bareBar, heading, PanelStack; one example | API rows and examples for inspector, sections, collapsible, footer, resizable | — |
| Property list rows were 29 tall around 28px controls | value slot is a flex row | 28 = control |
| 280 default width untraced | commented: Figma's 240 at 24px rows, widened for 28px rows | resizable-panel.md |

Measured after (gallery): the bar action ends 9 from the edge in sm, xs, bare-bar and the
recipe (8 inset + 1 border), 13 in md and lg, 8 flush, the same as every section and row
action in each tile; fields 28 / 32 / 40 by tier.
