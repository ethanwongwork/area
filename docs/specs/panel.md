# Panel spec

**Status:** accepted · 2026-09-28 (owner, batch 8)
**Captures:** `docs/research/captures/panel/`
**Peers:** Card (in-flow surface), Popover, Menu and Dialog (floating surfaces), Field
(inline rows), NumberField (numeric rows), Separator (divider role), Toolbar (inspector chrome)

## Owner decisions

- 2026-09-27: "does there need to be multiple sizes for panel? … does panel really need xs?"
  → two sizes, **sm** (Figma's inspector density) and **md** (default); xs and lg removed
  (24px rows belong to compact density; 40px rows are too loose for an inspector). The Sizes
  group shows both, the default included. "Only have the controls set to not full width in
  the Figma control panel example" → rows fill the width; `actionColumn` reserves the trailing
  square on every row (the Figma recipe and the resizable Design panel use it); a row with its
  own action still gets the square. Default width 240 (Figma), was 280. "The divider strokes
  should not be darker than the container strokes" → bar, section and footer rules take the
  panel's own `border-decorative` edge.

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Panel is 280px with
  medium control-height rows; its inset size does not resize child controls.
- 2026-09-26 (second pass, owner: decide all open items): section headings are the UI text
  in the default ink over muted field labels; every label in a panel is muted; numeric rows
  use NumberField with Figma's letter prefixes; section, bar and footer rules use the
  `border-divider` role.
- 2026-09-27 (third pass): one field style per surface, so every row is soft (Selects take
  `variant="soft"`); the docs example is the default 280px panel with medium rows.

The broader "Inspector references and density" notes (compact UI scope, Panel inset as a
layout choice) are in [number-field.md](number-field.md), since they cover several families.

## Job and boundaries

Panel is an inspector: a titled surface of rows that act on something beside it
(`panel.css:1-16`). It owns the container, the bar, section seams and a pinned footer; the
rows are Field (`orientation="horizontal"`) and controls. Card presents content; Dialog and
Popover float over the page. A panel stays beside its subject.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm, md (default) | Inset and row tier; sm is Figma's inspector density | Gallery Sizes / sm, md; the Figma recipe uses sm |
| actionColumn | boolean | Every row keeps a trailing action square, so controls line up where a row has no action | Figma's properties panel (recipe); otherwise rows fill the width |
| flush | boolean | Docked to an edge: no radius, border or elevation, `bg-page` | Gallery Layout / flush; docs site right rail; Figma's docked inspector |
| bare-bar | boolean | A bar that names the panel carries no rule | Gallery Layout / bare bar; docs site sidebar |
| composition | sections, heading, stack, footer | Grouping and a pinned action | Gallery `default`, `sections`, `footer` |

Panel insets (sm 12, md 16) and gaps (sm 8, md 12) are fixed spacing, not the gutter or gap
ramps. The compact pass steps them down one rung (insets read `inset-surface-sm/md`, 12 / 16 →
8 / 12; gaps 8 / 12 → 6 / 8; the md label gap reads `ui-stack`, 6 / 4); see the feedback log.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Editor inspector: section title, collapsible section header, colour row, number field with letter prefix, size select | figma.com editor, logged in, second pass 2026-09-26 | evidence only | `figma--section-title`, `figma--section-header`, `../input-group/figma--color-row`, `../number-field/figma--number-field`, `../select/figma--size-select` (all `--rest--light`) |
| figma | target product | Fill row (ColorPicker pass) | figma.com editor | evidence only | `color-picker/figma--fill-row--rest--light` |
| notion | target product | Date-filter popover, a floating surface for contrast | Calendar pass | evidence only | `calendar/notion--search-date-filter-popover--rest--light` |
| area | this system | Four gallery tiles, re-taken after the second pass | localhost gallery | — | `area--*` (4) |

Untitled UI has no panel. Notion has no docked inspector (its page menu and Share popover
are floating surfaces, recorded under Menu and Popover). Figma's inspector was captured by
row, not as a whole surface: its panel is flat and docked, with no radius, border or shadow
of its own on any captured row.

## Anatomy

```
figma  inspector 240 wide, rows own their insets (padding 0 8 0 16)
  section title   240 × 40, grid, 11/16 550, ink 90% black; text at 16, 12 above and below
  section header  240 × 40, h2 text at 16, trailing 24px icon action (radius 5) at 8 from the end
  colour row      240 × 32; soft field 184 × 24, radius 5, #f5; trailing 24px action
  number field    88 × 24, radius 5, #f5, 24px prefix box ("W"), 64px input, 11/16
  size select     88 × 24, radius 5, white, 1px #e6 edge, 11/16 450
area   div.area-panel flex column, 280 wide; border, radius, surface, shadow-2
  bar      row + one field gap above and below + 1 rule (sm 8 + 28 + 8 + 1 = 45, md 12 + 32 + 12 + 1 = 57);
           padding-inline = inset; title 500, md 16/24, sm 14/20
  body     padding = inset, gap 16, scrolls
    section   rows 12 apart (sm 8), full-width divider (negative margins, inset returned as padding)
      heading   a row (sm 28, md 32) with one field gap above; 500, md 14/20, sm 12/16, fg-default
      rows      Field horizontal, label fg-muted; NumberField soft with X / Y / W / H prefixes
      stack     label above a full-width control, gap 6 (sm 4)
  footer   pinned, padding = inset, top divider
```

The bar uses the shared inset contract with its own inputs (`inset.css:27-40`): the title
starts at the body's inset, and a trailing Button sets the end inset from its own height.

## Measurements

`node scripts/capture-compare.mjs --slots shell` (trimmed):

| slot · property | area · default | area · sections | area · flush | figma · section-title | figma · section-header | figma · color-row |
|---|---|---|---|---|---|---|
| **shell** size | 280 × 388 | 280 × 348 | 280 × 165 | 240 × 40 | 240 × 40 | 240 × 32 |
| **shell** padding | 0 | 0 | 0 | 0 8 0 16 | 0 8 0 8 | 0 8 0 16 |
| **shell** border | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) | 0 | 0 | 0 | 0 |
| **shell** radius | 12px | 12px | 0px | 0px | 0px | 0px |
| **shell** font | 16px/24px 400 Geist | 16px/24px 400 Geist | 16px/24px 400 Geist | 11px/16px 550 Inter | 11px/16px 400 Inter | 11px/16px 400 Inter |
| **shell** color | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(40, 40, 40) | rgba(0, 0, 0, 0.898) | rgba(0, 0, 0, 0.898) | rgba(0, 0, 0, 0.898) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 1px 2px -0.5px | same | none | none | none | none |

Nodes (`area--default`, `area--sections`, size sm): bar 278 × 37, title at 8; body padding
8; heading 278 × 32 at 14px/20px; field labels 14px/20px rgb(102, 102, 102); soft
NumberFields 127 × 32 in pairs 8 apart, fill rgb(247, 247, 247), radius 8px, prefix 16px in
rgb(102, 102, 102). Figma number field and size select: both 88 × 24, radius 5, fills
rgb(245, 245, 245) and white with a 1px rgb(230, 230, 230) edge.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| shell · width | **240**, public hook `--area-panel-inline-size` | Owner (2026-09-27: smaller by default); Figma's inspector 240 | Was 280, which made room for the action column; the Figma recipe sets 280 for its 28px rows |
| rows | the tier's control, `--_row`: sm 28, md 32 (`panel.css:36, 351-357`) | Owner (prior; confirmed in the third pass) | Figma's rows are 32 (`figma--color-row`) with 24px fields inside; Area's controls fill the row |
| field style | **soft for every field, Select included** (`apps/desktop/src/content/demos/gallery.tsx:700-719`) | Third pass: one field style per surface | Was outline Selects beside soft NumberFields; Select gained `variant="soft"` ([select.md](select.md)) |
| shell · radius / edge / fill | `radius-container` 12, `border-decorative` #f3f3f3, `bg-surface` #ffffff (`panel.css:36-38`) | Peers: Alert, Code block, Dialog; container seams stay decorative | Card's edge took `border-divider` in the third pass (it stands alone on the page), now neutral 100 (audit S7); a panel's lift carries its seam |
| shell · shadow | `shadow-2`, 0 1px 2px −0.5px `shadow-color` 6% (`panel.css:40`) | Shared rule: the floating lift is for overlays | A panel sits in the page flow; Notion's 20px-blur geometry would read as an overlay |
| flush | no border, radius or shadow; `bg-page` (`panel.css:49-54`) | Figma's docked inspector: no radius, edge or shadow on any row (`figma--section-title`, `figma--color-row`) | — |
| bar | `--_row` + 2 × `--_panel-gap` + rule: sm 45, md 57 (`panel.css:43-45`) | Owner 2026-09-28: the bar's button has one field gap above and below | Was `control-sm` + 2 × 4 + rule = 37 at every size |
| title | 500; md 16/24, sm 14/20 (`--_panel-title-*`, `panel.css:105-111`) | Surface title (audit S2, owner 2026-09-30); type by size (owner 2026-09-28) | Was UI 14/20 at both sizes |
| heading | **500, `fg-default`; md 14/20, sm 12/16** (`--_panel-label-*`, `panel.css:162-177`; audit S2) | Second pass: the heading outranks muted labels by ink | Was 12/16, smaller than the 14px labels under it. Figma's title is 11/16 550 at the same ink as its field text; kept (third pass): one label weight, so ink sets headings apart |
| field labels | **`fg-muted` #666666** (`panel.css:147`) | Second pass | Was the Field default ink |
| numeric rows | **NumberField soft with letter prefixes** X / Y / W / H (`apps/desktop/src/content/demos/gallery.tsx:680-690`) | Figma's letter-prefixed number fields (`figma--number-field`) | Prefix ink and box differ from Figma; see [number-field.md](number-field.md) |
| rules (bar, section, footer) | **`border-decorative`**, the panel's own edge (owner, 2026-09-27: a divider is never darker than its container); was `border-divider` #e2e2e2 | Second pass: new divider role for rules; Figma #e6 (`figma--size-select` edge), ChatGPT 10% black; Notion's menu rules are lighter, 7% (#f0, `menu/notion--page-menu--open`); #e2 is the nearest rung to #e5 | Was `border-decorative` #f3f3f3 |
| section rule extent | full width; last section none (`panel.css:114-127`) | Area's own | — |
| inset (sides, last field to a rule) | **sm 12, md 16** (`--_inset`) | Owner (2026-09-28: "the margins are too big for both") | Was 16 / 20 for one round, 12 / 16 before that |
| section heading and bar | **a row: the button with one field gap above and below** (8 / 12), title centred; heading row sm 44, md 56; bar sm 45, md 57 | Figma's header row 40 = 8 + 24 + 8; VS Code's pane header (Cursor) a 22 row with centred actions; owner (2026-09-28: "make sure the padding for the inset buttons is even") | Was sized from the title (cap one inset below the rule), which left the button 6.3 above and ~11 below |
| end-of-row buttons (bar, heading actions, row action) | **box on the inset, one field gap after the last field** | Owner (2026-09-28: "use the same gaps between the inputs … and the button"); Figma 8 between H and its action | A glyph-on-inset pull (tried the same day) widened the gap after H |
| md width in the gallery | the md size tile at 280 | Owner (2026-09-28: "show a slightly larger width of the container for medium") | The component default stays 240 (owner, 2026-09-27) |
| type and gaps by size | **sm**: bar title 14/20, section titles and labels 12/16, fields and their action 8 apart, rows 8 apart, labels 4 over; **md**: 16/24, 14/20, 12, 12, 6. Controls keep their tier's text (14/20). Published as `--_panel-*` for BoxField and PropertyList inside a panel | Owner (2026-09-28: "shouldn't there be differences in text size and gaps between medium and small?"); the control scale's gaps (4 / 8) and gutters (8 / 12) step the same way | Was one type ramp at both sizes (Card's rule), 8 / 6 gaps |
| section gap / stack gap | md 12 / 6, sm 8 / 4 (`--_panel-row-gap`, `--_panel-label-gap`) | Stack 6 matches Field's label gap (Untitled 6); type and gaps by size (owner 2026-09-28) | Was 8 / 6 at both sizes |
| section rule placement | **midway: 16 below the last field, the next title's cap 16 below the rule**; a heading after a rule rises by `(row − 1cap) / 2`; a heading-only section's cap sits 16 above the rule below (`panel.css`) | Figma (batch 8, `figma--section-auto-layout`): 16 from the last field to the rule, 16.5 from the rule to the title's cap; heading-only sections 40 tall, text centred | Was 12 below the last field and about 26 from the rule to the cap (the 16 body gap plus half the heading row), so rules read as belonging to the section above |
| inset tiers | sm 12, md 16 only (`panel.css:351-357`); the xs and lg tiers were removed | Owner (2026-09-27: two tiers) | Figma insets 16 start, 8 end |

Settled in the third pass ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)); both kept:

1. Heading row height stays 32 (`panel.css:132`). Figma's section titles are 40px rows
   (`figma--section-title`, `figma--section-header`); the owner chose medium rows. *Superseded
   2026-09-28: the heading is a row with one field gap above and below (sm 44, md 56), Figma's
   8 + 24 + 8 construction.*
2. The heading outranks its rows by weight (500) and ink. Figma sets its title apart by
   weight 550 at the same 90% ink as its field text (`rgba(0, 0, 0, 0.898)` in all three
   rows); the code followed in the type pass, and audit S2 (owner, 2026-09-30) made surface
   titles at body size 500.

## States

Panel itself has no interactive states; its rows and controls own theirs.

## Behavior and accessibility

A `div` with a `header` bar, a scrolling body and a `footer`; the consumer names it
(`aria-label` in the gallery). `PanelSection` renders a `section` with an `h3` heading.
Each prefixed NumberField is named by `aria-label` ("X", "Y", "W", "H"). The footer is
outside the scroll so its action never reads as the last row's.

## Peers and consistency

| Peer | Shared role | Peer value | Panel | Match |
|---|---|---|---|---|
| Menu, Popover, Dialog, Toast, pickers | elevation | floating lift, 0 20px 24px + 0 5px 8px | `shadow-2` | intentionally different: region, not overlay |
| Card | in-flow elevation | `shadow-resting` | `shadow-resting` | same since 2026-10-14: a docked region rests on the page like a Card (the Elevation axis's resting role; was `shadow-2`) |
| Alert / Code block | radius | 12 / 12 | 12 | match; Card is 22 / 24 / 28, concentric with its Button (owner 2026-09-28, audit S3) |
| Field | row height and label | 32, label gap 6 | 32 rows, stack gap 6, labels muted inside a panel | match; the muting is Panel's (`panel.css:147`) |
| Code block header, Menu separator, Toolbar separator | rule | `border-decorative` | `border-decorative` | match (a rule is never darker than its container); Separator stands alone on `border-divider` |

## Visual pass

2026-09-28, Claude in Chrome (batch 8): Figma's Design panel (owner's file, a frame selected, nothing
edited) beside the gallery's Figma recipe tile, both at 2x. Captures: `figma--section-auto-layout`
here, field rows in `../number-field/` and `../inspector/`.

| | Figma | Area |
|---|---|---|
| panel / field | 240 wide, fields 88 x 24, 11/16 | 280, fields 28, 14/20 (default density; compact density is planned for Figma's size) |
| section | 40px header row, label + field rows 48 apart, 12 below | 28 heading, rows 58 apart (48 scaled to 28px fields is 56) |
| rule | 16 below the last field, 16.5 to the next title's cap | **was 12 / ~26, now 16 / 15.7** |
| heading-only section | 40, text centred | cap 15.7 below the rule above, 16.3 above the rule below |
| row action column | 24 square at 208 | 28 square on the action column |

Changed: the rule placement (Decisions). Measured on every Panel tile after the change (default,
sizes sm and md, sections, footer, flush, bare bar, collapsible, Figma recipe): 16.0 / 15.7, and 16.3
under collapsed headings. Unchanged by evidence: labels stay `fg-muted` (Figma's are lighter, ~50%
black; the muted role is system-wide). Dark theme not compared.

Earlier note:

The gallery shows Panel in Default (every control, with prefixed NumberField pairs),
Content (sections, footer) and Layout (flush, bare bar) groups; every field is soft. The
docs example (`PanelEverything`, `apps/desktop/src/content/demos/display.tsx:316`) is the default 280px
panel with medium rows and soft fields. This spec's author did not inspect screenshots.
Unverified: dark theme and a side-by-side with Figma's inspector at the same zoom.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Verified in the built-in browser on `/panel.html` (computed rotation
of the svg and its `g`, `getAnimations()` on toggle; the pill formula at edge heights 437, 438,
300 and 41).

| Interaction | Before | After |
|---|---|---|
| Section chevron reveal | opacity fast both ways | instant in on hover or focus, fast out |
| Section chevron turn | the Glyph's `rotate={270}` (an SVG `transform` on a `g` that mounts and unmounts): snapped | CSS `rotate` on the svg (−90° collapsed, 90° in RTL) on fast ease-out; `svg > g { transform: none }` cancels the Glyph's own turn |
| Toggle focus ring | outline, instant | unchanged |
| Resize handle focus pill | instant | unchanged |
| Rows on collapse | `display: contents` / `hidden`: snap | unchanged (a `display: contents` run has no box to animate) |

Crispness: the resize focus pill was `block-size: 50%`, centred: on an odd edge it fell on a half
pixel. It is now `calc(100% − 2 × round(25%, 1px))`, half the edge to the pixel, with a whole-pixel
offset on either parity (437 → 219 at 109; 438 → 218 at 110). RTL used `scale: -1 1` on the
collapsed glyph; it now rotates 90°.

Proposed TSX (primitives.tsx, not edited here): drop the Glyph's turn, which the CSS now draws, so
the `g` override can go: `<Glyph name="chevron-down" rotate={open ? undefined : 270} />` →
`<Glyph name="chevron-down" size={12} />` (size 12 also sets the 12px line weight; the glyph is
drawn at `min(icon-sm, inset)`, 12 at md, 8 in a small panel, but currently strokes at the 16 weight).

Open questions:
- The sm panel's chevron is 8px (the inset), a 16 drawing at half size. Recommendation: accept
  (Figma's own is a 3×5 mark) unless the owner sees it as soft; a 12 cut would overhang the inset.

## Verification

- 4 Area captures (re-taken after the second pass) and 5 Figma inspector captures compared
  above; Notion popover kept for contrast.
- Build and test results: see [the audit](../research/cohesion-audit.md#verification).
- The docs API table lists `bareBar` (`apps/desktop/src/content/pages.mjs:834`).

## Review note, 2026-10-09

- **What changed:** Everything is 2px tighter: the side inset is 14px at md (was 17 with the border) and 10px at sm (was 13), gaps between fields and rows are 10 and 6 (were 12 and 8), and labels sit 4px over their fields. In the resizable inspector, the Dimensions row now carries Figma's constrain toggle in the action column, so its fields reach the same edge as the rest. A collapsible section's chevron now stays centred on its title when the section opens; it used to jump up.
- **Why:** You asked for the panel to be about 2px more compact everywhere, for the large right margin in the resizable tile, and for the chevron's movement on open to be fixed. The right margin was an empty action column; the chevron was centred on a box that shrinks when a section opens.

## Review note, 2026-10-12 (swatch ring)

- **What changed:** the Figma recipe's fill swatches take the new translucent outline (from Color swatch); nothing else changed.
- **Why:** you asked why the swatch's outline only showed at its corners, then said to apply the fix: the outline is now
  a light translucent line drawn over the colour, so it shows evenly all the way round on every colour.

## Interaction polish, 2026-10-16

The section toggle is not selectable. See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Review note, 2026-10-17 (round 33)

- **What changed:** Only the underline on the main-component link in dev mode (shown on hover and focus): it now sits close under the words, about 1px below the letters,
  instead of 0.25em down. Tails of g, y and p cross it and the line breaks around them. Nothing else changed.
- **Why:** It follows Link, which you asked to underline "very natural and close to the text" (link.md, "Close
  underline").

## Feedback log

- 2026-09-26 · cohesion audit → no change; `shadow-2` confirmed as an in-flow region, outside
  the floating-lift group → `area--*` captures.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → headings UI 14/20
  in the default ink (were 12/16), every label muted, numeric rows NumberField with letter
  prefixes, bar / section / footer rules `border-divider`; flush tile added →
  `figma--section-title`, `figma--section-header`, `input-group/figma--color-row`,
  `number-field/figma--number-field`, `select/figma--size-select`, `area--*` re-captures.
- 2026-09-27 · third pass → gallery Selects soft (one field style per surface); docs example
  at the default 280 with medium rows and soft fields (was 320, small controls); Layout /
  bare bar tile added; heading row and weight kept → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · owner: sizes, full-width controls, divider ink (screenshots of Motion,
  Layout and Effects panels) → size sm / md only, rows fill the width, `actionColumn` for the
  Figma recipe, width 240, rules `border-decorative` → gallery Sizes tiles, headless Edge
  screenshots of Sections and the Figma recipe.
- 2026-09-28 · batch 8 Claude in Chrome side by side (Figma Design panel) → section rules sit midway
  (16 below the last field, the next cap 16 below the rule) → `figma--section-auto-layout`, every Panel
  tile measured.
- 2026-09-28 · owner: sm and md spacing inconsistent around labels and controls; should text differ? →
  one inset per size on every side (12 / 16, Figma 16); type the same at both sizes → every Panel tile
  measured: sm 12.0 sides, bar cap 11.5, first cap 11.7, field→rule 12.0, rule→cap 11.7; md 16.0,
  15.5, 15.7, 16.0, 15.7; no input or select clipped.
- 2026-09-28 · owner: look at Figma and Cursor; title and buttons in one row; adjust padding for both
  sizes → heading as a row with centred title and buttons (Figma 40 / 8 air; VS Code pane header), insets
  16 / 20, end icons on the inset by their glyph → measured on every tile: title cap 15.7 / 19.7 below
  its rule, button air 6.3 / 8.3, title baseline to first label cap 21.5 (Figma 21.5) / 23.7, last field
  to rule 16 / 20, glyphs 16 / 20 from the edge; no clipped value.
- 2026-09-28 · owner: same gap between the inputs and the button; sm and md should differ in text and
  gaps → buttons on the inset one field gap after the fields; the panel's own text and gaps step with
  the tier (above) → measured: sm field gap 8 = field→button 8, labels 12/16 4 over, rows 8; md 12 = 12,
  labels 14/20 6 over, rows 12; titles one inset below rules, no clipped value.
- 2026-09-28 · owner: margins too big; show md wider; even padding around the inset buttons → insets 12 /
  16; headings and bar are rows with one field gap above and below their button; md tile 280 →
  measured: header button 8 / 8 (sm) and 12 / 12 (md) above and below, 12 / 16 from the right edge;
  field gap = field-to-button gap (8 / 12); last field to rule 12 / 16; no clipped value.
- 2026-09-28 · owner: approved (batch 8).
- 2026-09-30 · audit F-26 (owner pick B) → insets 12 / 16 and gaps 8 / 12 stay fixed spacing, not density-following; the code comment and this spec no longer claim the gutter ramp; compact values come with the density pass → panel.css:340-357.
- 2026-10-01 · compact pass round 6 → the sides read the surface insets (`inset-surface-md/sm`: 16 / 12, compact 12 / 8); gaps 12 / 8 step to 8 / 6. Default unchanged. docs/research/compact-pass-2026-10-01.md.
- 2026-10-02 · compact pass round 9 → the md label gap reads `ui-stack` (6, compact 4). docs/research/compact-pass-2026-10-01.md (round 9).
- 2026-10-02 · compact evidence audit → md sides hold at 16 at compact (was 12; Figma's inspector 16) (R4) docs/research/compact-evidence-2026-10-02/README.md.
- 2026-10-03 · radius audit D1 (owner) → the container role is 12 at compact too (was 8; Figma 13, Cursor 12-14), so this family's surface is 12 at both densities; rows concentric with a floating surface follow (compact 24 rows r8). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → section chevron turns on fast (was a snapping SVG transform) and appears at once on hover; resize focus pill centred on whole pixels.
- 2026-10-09 · owner went with Scroll area's recommendation to adopt it in the scrolling families (docs/specs/scroll-area.md, "Adoption") → the scroll container is a Scroll area: Figma's overlay bar instead of the platform's, its inset moved into the scroller so rows keep their place → back in review.
- 2026-10-09 · owner, review round 2 (rethink): density, gaps, padding and margins look a bit too big at every size;
  more compact, "maybe by like 2px", evenly across everything. Content / resizable: the right margin is far too large.
  Collapsible sections: the chevron's placement moves wrongly once a section opens → every step 2 smaller (md
  14 / 10 / 4, sm 10 / 6 / 4), the edge counted once (`--_side`); the resizable demo's Dimensions row carries Figma's
  constrain toggle in its reserved action column; the chevron is centred on the title row, not the heading box →
  panel.css, inset.css, gallery.tsx.
- 2026-10-12 · owner (desktop Sidebar: "nav margins on the sides are way too large and not equally inset") → (1) a docked flush panel's seam is counted once: the seam side's inset is the inset less the border (`--_side-start` / `--_side-end`), so content sits 14 from the outside on both sides (was 14 / 15); (2) a vertical Nav or a Tree view in a panel body hangs its plates by the row inset (`--area-ui-row-inset`) and fills the panel, so text, labels and counts sit on the panel's 14 column and plates 6 from each edge (was plates 14, text 22) → panel.css. Measured in the app: plates 6 / 6, text 14, count digits end 14.
- 2026-10-12 · owner, review round 16: approved.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → the collapsible toggle's focus ring sits at `focus-offset` (was `space-2`, the same 2px) (panel.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-14 · owner: "add elevation as an option" → Panel takes the Elevation axis's resting role, `--area-shadow-resting` (no lift at Minimal; was `shadow-2`, then `shadow-card` on 2026-10-13) (docs/research/elevation-2026-10-14.md).
- 2026-10-14 · owner: "continue working on the next axis" → Surface is one number, the frame's width: `1` (Default) or `0` (Borderless) (was `outlined` / `borderless`; axes/surface.ts). At 0 the panel lists the Surface axis's `shadow-edge` first in its box-shadow, ChatGPT's frameless-menu edge (`0 0 1px` black 62%, and in dark an inset `0 0 1px` white 20%; captured 2026-10-13), so it keeps an edge at Elevation 0 and in dark, where it had none. Owner approved ("go with your recs"), review https://claude.ai/artifact/L4TCF2W5zcjvBK7xZmaDBN (docs/research/surface-2026-10-14.md).

## Review note, 2026-10-17 (round 34)

- **What changed:** Only the Component icon in the dev-mode row ("Button / Primary"): its four diamonds are larger and
  closer, about 4.9 wide instead of 4, reaching as far as Area's diamond icon, so it reads as Figma's component mark
  rather than a scatter of dots.
- **Why:** You said "the component icon looks wrong". Lucide draws the same concept with larger diamonds; the old
  drawing was the lightest of the circle-keyline icons (docs/specs/icons.md, "Component redrawn").

## Review note, 2026-10-17 (round 35)

- **What changed:** The colour tokens in the dev-mode inspector have 8 between them instead of touching.
- **Why:** You said they should have a gap. Figma's Dev Mode lists its colours every 32; Area's token is about 23 tall,
  which leaves 8, the gap Token row's own examples use.


## Bar with only an action (2026-10-18)

- 2026-10-18 · owner: "a figma style panel … the tab controls at the top" (the app's Inspector: Theme, Design, Code as Nav pills in the bar) → a bar holding only an `action` no longer draws an empty title heading beside it (primitives.tsx); with a title nothing changes.
- 2026-10-18 · owner: "these controls are not evenly inset, theres too much space horizontally" → a bar of controls
  alone (no title) insets them evenly, (bar − rule − small control) / 2 from each side, the seam counted once, and
  centres them above its rule (no top balance), so they share a centre with the Titlebar's and the Canvas header's; a
  horizontal Nav in the bar takes the small control's height and corner, as in the Titlebar (panel.css, inset.css).
- 2026-10-18 · owner: "start Phase 1: the Chat view on a recorded run" (docs/research/inspector-chat-2026-10-18) →
  `viewportRef` reaches the body's scrolling element (Scroll area's viewport), so a conversation in the body can follow
  its newest line and Scroll to latest can watch it; `bareFooter` drops the footer's top rule, for a footer that
  continues the body (a chat's composer; Cursor, Claude Code and ChatGPT draw none). Manifest boolean `bare-footer`.
