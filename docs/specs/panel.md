# Panel spec

**Status:** accepted (Complete in `component-status.mjs`) · changed in the second pass,
2026-09-26, and not yet re-reviewed by the owner
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

At default density the gutter ramp is 8 / 8 / 12 / 12 (`packages/tokens/src/axes/density.ts:71-76`),
so xs = sm and md = lg; compact spreads them to 6 / 8 / 10 / 12.

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
  bar      header 28 + 4 × 2 + 1 rule = 37; padding-inline = inset; title UI 14/20 400
  body     padding = inset, gap 16, scrolls
    section   gap 8, 12 below, full-width divider (negative margins, inset returned as padding)
      heading   min 32 (row), UI 14/20 400, fg-default
      rows      Field horizontal, label fg-muted; NumberField soft with X / Y / W / H prefixes
      stack     label above a full-width control, gap 6
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
| rows | `control-md` 32 (`panel.css:20, 132`) | Owner (prior; confirmed in the third pass) | Figma's rows are 32 (`figma--color-row`) with 24px fields inside; Area's controls fill the row |
| field style | **soft for every field, Select included** (`apps/docs/src/demos/gallery.tsx:700-719`) | Third pass: one field style per surface | Was outline Selects beside soft NumberFields; Select gained `variant="soft"` ([select.md](select.md)) |
| shell · radius / edge / fill | `radius-container` 12, `border-decorative` #f3f3f3, `bg-surface` #ffffff (`panel.css:36-38`) | Peers: Alert, Code block, Dialog; container seams stay decorative | Card's edge took `border-divider` in the third pass (it stands alone on the page); a panel's lift carries its seam |
| shell · shadow | `shadow-2`, 0 1px 2px −0.5px `shadow-color` 6% (`panel.css:40`) | Shared rule: the floating lift is for overlays | A panel sits in the page flow; Notion's 20px-blur geometry would read as an overlay |
| flush | no border, radius or shadow; `bg-page` (`panel.css:49-54`) | Figma's docked inspector: no radius, edge or shadow on any row (`figma--section-title`, `figma--color-row`) | — |
| bar | `control-sm` + 2 × 4 + rule = 37 (`panel.css:26`) | Area's own; fixed across inset tiers | — |
| title | UI 14/20 400 (`panel.css:81-85`) | Type ramp (400 for titles) | — |
| heading | **UI 14/20 400, `fg-default`** (`panel.css:139-142`) | Second pass: the heading outranks muted labels by ink | Was 12/16, smaller than the 14px labels under it. Figma's title is 11/16 550 at the same ink as its field text; kept (third pass): one label weight, so ink sets headings apart |
| field labels | **`fg-muted` #666666** (`panel.css:147`) | Second pass | Was the Field default ink |
| numeric rows | **NumberField soft with letter prefixes** X / Y / W / H (`apps/docs/src/demos/gallery.tsx:680-690`) | Figma's letter-prefixed number fields (`figma--number-field`) | Prefix ink and box differ from Figma; see [number-field.md](number-field.md) |
| rules (bar, section, footer) | **`border-decorative`**, the panel's own edge (owner, 2026-09-27: a divider is never darker than its container); was `border-divider` #e2e2e2 | Second pass: new divider role for rules; Figma #e6 (`figma--size-select` edge), ChatGPT 10% black; Notion's menu rules are lighter, 7% (#f0, `menu/notion--page-menu--open`); #e2 is the nearest rung to #e5 | Was `border-decorative` #f3f3f3 |
| section rule extent | full width; last section none (`panel.css:114-127`) | Area's own | — |
| body gap / section gap / stack gap | 16 / 8 / 6 (`panel.css:94, 117, 153`) | Stack 6 matches Field's label gap (Untitled 6) | — |
| inset tiers | `gutter-xs/sm/md/lg` (`panel.css:174-177`) | Density axis | Figma insets 16 start, 8 end |

Settled in the third pass ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)); both kept:

1. Heading row height stays 32 (`panel.css:132`). Figma's section titles are 40px rows
   (`figma--section-title`, `figma--section-header`); the owner chose medium rows.
2. The heading outranks its rows by ink, not weight. Figma sets its title apart by weight
   550 at the same 90% ink as its field text (`rgba(0, 0, 0, 0.898)` in all three rows), so
   the Figma citation does not support the ink split; Area keeps one label weight, so ink
   sets headings apart.

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
| Card | in-flow elevation | `shadow-1` (0 0.5px 1px) | `shadow-2` (0 1px 2px) | intentional: a docked region sits one step above content (DESIGN_SYSTEM.md, Elevation) |
| Card / Alert / Code block | radius | 12 / 12 / 12 | 12 | match (Card moved to the container radius) |
| Field | row height and label | 32, label gap 6 | 32 rows, stack gap 6, labels muted inside a panel | match; the muting is Panel's (`panel.css:147`) |
| Separator, Code block header, Menu | rule | `border-divider` | `border-divider` | match |

## Visual pass

The gallery shows Panel in Default (every control, with prefixed NumberField pairs),
Content (sections, footer) and Layout (flush, bare bar) groups; every field is soft. The
docs example (`PanelEverything`, `apps/docs/src/demos/display.tsx:316`) is the default 280px
panel with medium rows and soft fields. This spec's author did not inspect screenshots.
Unverified: dark theme and a side-by-side with Figma's inspector at the same zoom.

## Verification

- 4 Area captures (re-taken after the second pass) and 5 Figma inspector captures compared
  above; Notion popover kept for contrast.
- Build and test results: see [the audit](../research/cohesion-audit.md#verification).
- The docs API table lists `bareBar` (`apps/docs/src/pages.mjs:834`).

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
