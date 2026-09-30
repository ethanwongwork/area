# Breadcrumb spec

**Status:** accepted · 2026-09-25 (first pass under the capture workflow)
**Captures:** `docs/research/captures/breadcrumb/`
**Peers:** Nav and TreeView (navigation rows), Menu (hover plate), Link, Tabs

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): keep Breadcrumb on
  the medium UI type and gap tier. It is a navigation trail, not an input control; add a
  public size axis only when a real composition needs one.
- 2026-09-25: Breadcrumb is the next component after Tooltip was approved.
- 2026-09-25: chevrons closer to the text; separators lighter, but not too light. Adopted
  the recommendation: 4px gaps, `stroke-control` (rgb 131).

## Job and boundaries

Breadcrumb shows where a page sits: linked ancestors, separators, an optional collapsed
marker and the current page. It is not a tab bar (sibling views) or a menu.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| composition | text trail | Ancestors and the current page | Notion page header; Untitled "text" |
| composition | collapsed (…) | Long paths | Untitled; Area already supports `BreadcrumbEllipsis` |
| composition | icons | A leading glyph per item | Untitled leading home icon |

Excluded: Untitled's "button" style (28px bordered items) and "text with line" container;
no target product uses them. A slash separator (Notion) is recorded, not added.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | Page header path "database / page" | app.notion.com, a page opened in full from the owner's board, logged in (Edge), 2026-09-25 | evidence only | `notion--path-2--rest--light` |
| uui | design system (rendered) | Text, text-with-line and button breadcrumbs | untitledui.com/react/components/breadcrumbs (2026-09-25) | MIT | computed-style readout only (below) |
| area | this system | Three gallery tiles after this pass | localhost gallery | — | `area--*` (3) |

**Untitled** readout: 14px/20px weight 600; ancestors lab(48.5) (about rgb(115)), current
page brand purple or lab(27) dark; separators 16px chevrons in lab(84.9) (about rgb(213));
6px gap; the "button" style makes items 28px with 4px padding and a 2px gap. Not saved as
a capture file.

Target products searched without an equivalent:
- **ChatGPT:** no breadcrumbs (settings use a "Back to app" link).
- **Figma:** the file browser shows a page title only; opening a file to see its path did
  not respond to clicks in the background browser window.

The pass-0 Area tile was captured before the change and then overwritten by the re-capture;
its values (below) come from the same session's computed-style readout.

## Anatomy

```
notion   div flex, 14/16.8 400 rgb(44, 44, 43)
  item   a, 24px, padding 2/6, radius 6 (hover plate)      text at 6px inside
  sep    span "/", 13px, rgb(230, 229, 227), 6px wide
area     nav > ol.area-breadcrumb__list flex, gap 4, 14/20
  link   a.area-breadcrumb__link, muted; ::before hover plate 2px / 6px past the text, radius 6; focus ring drawn on the plate
  sep    li 16×16, Area chevron glyph (svg, ink centred)
  page   span[aria-current=page]
```

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| text · size | 14/20 | Notion 14, Untitled 14 | — |
| page · ink | **`fg-default`** | Untitled (dark current page); Notion (default ink) | Was `var(--area-fg)`, an undefined token, so the page rendered in the link grey |
| page · weight | **400** | Type ramp (selection by colour); Notion 400 | Was 500; Untitled 600 |
| link · ink | `fg-muted` | Untitled (grey ancestors) | Notion uses one ink for the whole trail; Area keeps the current page distinct by colour now that weight is 400 |
| separator · ink | **`stroke-control`** rgb(131) | Owner (2026-09-25): lighter, but not too light; Area's 1px control-stroke role for a 1px stroke | Was the link grey rgb(102); `border-subtle` rgb(212, as Untitled 213 and Notion 230) was tried and judged too light |
| separator · glyph | **Area `chevron-down` glyph rotated 270°** (ink x 5.5–10 in a 16px box, `--area-weight-icon` line), mirrored in RTL | Owner (2026-09-25): the plate sat too close to the chevron on one side; peer TreeView uses the same glyph | The CSS chevron (two borders of a rotated square) put its point at the box's end edge. `.area-breadcrumb__chevron` stays for plain-HTML markup. Notion uses "/" |
| gap | **4** | Owner (2026-09-25): chevrons closer to the text | With the centred glyph: 8.9px text to ink, 9.4px ink to the next text; the hover plate clears the ink by about 3px on both sides. Was 8 |
| link / page · icon gap | 6, `gap-md` (`breadcrumb.css:22`, `:29`); the item's own gap is pinned to 8 (`breadcrumb.css:15`) | Peer: Button (audit S14) | The icon gap was 8. The item gap had read `gap-md` and was pinned so it did not move |
| link · hover | **background plate** `bg-component-hover`, 24px (2px above and below), 6px past the text, radius 6; ink fixed | Notion (primary product for navigation): 24px items, 2/6 padding, radius 6 | Was an underline. Painted outside the link box so the trail stays flush with the content below |

## States

| State | Changes | Evidence |
|---|---|---|
| link hover | plate `bg-component-hover` | Notion hover plate: 5% warm wash on the 24 item, corner 6, ink fixed (`notion--path-2--hover`, 2026-09-28) |
| link focus-visible | 2px `focus-color` ring on the `::before` plate (24 tall, 6 past the text, radius 6), offset 0; the link's own outline is removed | audit S11b (owner): the ring follows the hover plate (`breadcrumb.css:26-27`). Was the link's own outline on the text box |

## Behavior and accessibility

`nav` with `aria-label="Breadcrumb"`, an ordered list, separators `aria-hidden`, the current
page `aria-current="page"`, the ellipsis `role="img"` named "More pages".

## Peers and consistency

| Peer | Shared role | Peer value | Breadcrumb | Match |
|---|---|---|---|---|
| Menu / Nav rows | hover plate | `bg-component-hover` | same | match |
| Tooltip | small radius | 10 | 6 (`radius-small`) | a plate around text, not a surface |

## Visual pass

Pass reviews were removed at the owner's request; the family is inspected in the grouped
gallery. The earlier before/after review compared the current page and separators at 1× and
3×. Measured after: page rgb(40, 40, 40) at 400, separators rgb(131, 131, 131), 6.3px from
text to chevron on each side, link plate inset −2px / −6px (it stops 0.3px short of the
chevron).

2026-09-28 (batch 21), live in Claude in Chrome on a sub-page of the owner's archive (read only):
the topbar path re-measured as 2026-09-25 (items 24 tall, 2 / 6, corner 6, 14/16.8 400 in one ink,
"/" separators #e6). Hover, first captured (`notion--path-2--hover`): a 5% warm plate on the item,
ink fixed. Area in the gallery: 14/20 400, links #66 and the page #28, chevrons #83, a plate 2 / 6
past the text with a 6 corner on hover. Size, weight, plate geometry and the fixed ink match; the
muted ancestors and chevron separator are the recorded decisions. No change.

## Verification

- 1 Notion capture; 3 Area captures after; checksums verified.
- `build:docs` (docs audit), `typecheck`, `test:contracts` (14), `test:badge` (9),
  `test:preview` (4), `npm test` (tokens and contrast), `git diff --check`: all pass.
- Unverified: hover plate on screen (the browser pane was hidden), dark theme, Figma.

## Feedback log

- 2026-09-25 · owner approved Tooltip and asked to move on → Breadcrumb first pass: page
  ink bug fixed, weight 400, lighter separators, Notion hover plate, collapsed and icon
  tiles added → 3 Area captures.
- 2026-09-25 · owner: "chevrons a bit closer; lighter but not too light" → gap 8 → 4,
  separators `stroke-control` (131) → 3 Area captures re-taken; 6.3px text to chevron.
- 2026-09-25 · owner: "the backplate is too close to the front text but not the back text" →
  the CSS chevron's ink sat at its box's end; replaced with the centred Area chevron glyph
  (RTL mirrored) → text to ink 8.9 / 9.4px, plate clears by ~3px each side; review row
  "The chevron sits in the middle of its gap" → 3 Area captures re-taken.
- 2026-09-25 · owner approved Breadcrumb → Complete in `component-status.mjs`.
- 2026-09-27 · third pass → Pass review note replaced: the family is inspected in the grouped
  gallery → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-30 · audit S11b (owner) → the focus ring follows the hover plate: drawn on `::before` at offset 0, the link's own outline removed → `breadcrumb.css:26-27`.
- 2026-09-30 · audit S14 (owner) → a link or page icon sits 6 from its label (`gap-md`, was 8; `breadcrumb.css:22`, `:29`); the item gap is pinned to 8 (`breadcrumb.css:15`) and the 4 list gap is unchanged.
