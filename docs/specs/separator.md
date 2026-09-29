# Separator spec

**Status:** accepted (Complete in `component-status.mjs`) · 2026-09-26: the second pass moved
the rule to `border-divider`; the owner has not re-reviewed it
**Captures:** `docs/research/captures/separator/`; product rules in
`menu/notion--page-menu--open--light`, `popover/notion--share-popover--open--light`,
`card/figma--file-card--rest--light`, `baseline/chatgpt--menu--rest--light`,
`baseline/chatgpt--settings-card--rest--light`; edge references in
`button/notion--outline-button--rest--light`, `select/figma--size-select--rest--light`
**Peers:** Menu, Nav and Toolbar separators, Table dividers, Panel sections, Code block
headers, Card and Popover seams

## Owner decisions

- 2026-09-26 (second pass, owner: decide every open item): rules between content use a new
  `border-divider` role (#e2e2e2 light, #333 dark); container seams stay
  `border-decorative` ([cohesion audit](../research/cohesion-audit.md#second-pass-notion-figma-and-the-open-decisions),
  item 7; DESIGN_SYSTEM.md, "Color and focus").

## Job and boundaries

Separator divides related groups of content in a list, toolbar or panel. It is a 1px
`border-divider` rule, never a control edge or a container seam. Section spacing is the
container's job; Separator only reserves optional margin.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| orientation | horizontal (default), vertical | Lists vs toolbars | ChatGPT and Notion menus (horizontal); Area Toolbar (vertical) |
| spacing | none (default), normal (8px margin) | Rule inside a padded container vs between rows | ChatGPT menu: 8px above and below; Notion page menu: 4px |
| inset | boolean | Rule stops short of the container edge | ChatGPT settings card and Notion Share popover (16px), Notion page menu (12px) |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | Profile menu separator; settings card row divider | chatgpt.com, logged in (Edge), 2026-09-26 | evidence only | `baseline/chatgpt--menu--rest--light`, `baseline/chatgpt--settings-card--rest--light` |
| notion | target product | Page menu (⋯) group rules; Share popover section rules and footer seam; outline button edge (control, for comparison) | app.notion.com, logged in, 2026-09-26 | evidence only | `menu/notion--page-menu--open--light`, `popover/notion--share-popover--open--light`, `button/notion--outline-button--rest--light`; earlier `calendar/notion--search-date-filter-popover--rest--light` |
| figma | target product | File card border and footer seam; size select edge (control, for comparison); colour picker header rule | figma.com file browser and editor, 2026-09-26 | evidence only | `card/figma--file-card--rest--light`, `select/figma--size-select--rest--light`, `color-picker/figma--solid-layer-fill--rest--light` |
| uui | design system (source) | Section divider | `section-divider.tsx:9` at `4702dc0` ([reference](../research/untitled-ui-reference.md)) | MIT | source reading only |
| area | this system | 5 gallery tiles (re-captured after the second pass) | localhost gallery | — | `area--*` (5) |

## Anatomy

```
chatgpt menu     div 304×17 (8px block padding, 8px inline inset) > div.h-px 288×1, rgba(0,0,0,.1)
chatgpt card     row ::after 734×1, inset 16px each side, rgba(0,0,0,.1), on rgb(252)
notion menu      section (row-gap 1) > abs div 232×1 at x 12, top −1, rgba(42,28,0,.07);
                 4px section padding above and below → 9px between 28px row plates
notion share     div 424×1 at x 16 in a 456 popover, 1 device-px top border rgba(42,28,0,.07);
                 footer seam full width, rgb(240, 239, 237)
figma file card  1px #e6 card border; footer 1px top border #e6, full inner width
figma picker     header inset box-shadow 0 −1px rgb(230), full 240 width
area             div.area-separator[role=separator]  1px, border-divider fill, flex-shrink 0
```

## Measurements

Read from the nodes; composites on white are arithmetic, not captured.

| Rule | Thickness | Colour | ≈ on white | Inset | Space around |
|---|---|---|---|---|---|
| Area `area--full-width` / `inset` / `spacing-normal` | 1 | rgb(226, 226, 226) | #e2 | 0 / 16 / 0 | 0 / 0 / 8 |
| Area `area--vertical-inset` | 1 × 9.95 | same | #e2 | 5.03 (one cap-height tall) | 8 |
| ChatGPT menu, settings card | 1 | 10% black | ≈ #e6 | 8, 16 | 8 (menu) |
| Notion page menu | 1 | 7% warm black | ≈ rgb(240, 239, 237) | 12 | 4 |
| Notion Share popover | 1 device px | 7% warm black; footer seam rgb(240, 239, 237) | ≈ #f0 | 16 | section padding |
| Figma file card seam | 1 | rgb(230, 230, 230) | #e6 | 0 | — |
| Untitled section divider | 1 | neutral-200 | #e5 | — | — |
| For comparison, control edges | 1 | Notion outline button 11% warm (≈ rgb(230, 229, 227)); Figma select #e6 | | | |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| thickness | 1px (display.css:115, 120) | Every product and Untitled | — |
| colour | **`border-divider` #e2e2e2** (display.css:108) | Second pass: rules need a step more than a seam; ChatGPT ≈ #e6, Figma #e6, Untitled #e5 | Was `border-decorative` #f3f3f3, lighter than every reference. #e2 is the nearest rung to #e5–#e6 (#ee is twice as far); kept (third pass) |
| spacing normal | `space-8` margin (display.css:137) | ChatGPT menu separator: 8 above and below | Notion's page menu uses 4 |
| horizontal inset | `space-16` each side (display.css:128) | ChatGPT settings card and Notion Share popover agree on 16 | Notion page menu 12, ChatGPT menu 8 (from the item plates) |
| vertical inset | `--area-separator-inset`, default `space-8` (display.css:133) | Toolbar composition | Horizontal inset has no matching hook |
| spacing default | none | Rule inside a padded container | — |

**Settled in the third pass (value kept; evidence corrected):** Notion's captured rules are
7% (≈ #f0; `menu/notion--page-menu--open`, `popover/notion--share-popover--open`), not 11%;
11% is Notion's outline *button* edge (`button/notion--outline-button`). The
`border-divider` comment now says so (`packages/tokens/src/semantic/aliases.ts:155-161`).
`border-divider` #e2 is kept as the nearest rung to ChatGPT, Figma and Untitled's #e5–#e6;
the next lighter rung, #ee, is twice as far
([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)).

## States

None; Separator is static.

## Behavior and accessibility

`role="separator"` with `aria-orientation` (primitives.tsx:245-258). Not focusable. Forced
colours: a background-painted rule may disappear in forced colours (no rule in display.css;
unverified).

## Peers and consistency

| Peer | Shared role | Area value in peer | Separator | Match / reason |
|---|---|---|---|---|
| Menu separator | list divider | 1px `border-divider`, 8px block and inline margins (surface.css:586-594) | spacing normal: 8px block | match on paint; Notion's menu uses 4 / 12 |
| Nav separator | list divider | 1px `border-divider`, 8px block (nav.css:227-231) | same | match |
| Toolbar separator | vertical rule | 1px `border-divider`, icon-height (toolbar.css:41-42) | vertical inset 8 | same paint; the length rule differs |
| Table, Panel, Code block, Tabs track, ButtonGroup | content rules | `border-divider` (navigation.css:75, 152, 193; panel.css:68, 121, 163; code.css:39, 200, 443; button-group.css:46) | same | match (second pass) |
| Popover, Dialog | container seam | `border-decorative` #f3f3f3 | #e2e2e2 | differs by design: a seam has fill and lift to help it |
| Card | edge | `border-divider` #e2e2e2 (third pass; Figma's card seam #e6) | #e2e2e2 | match: a card has the page's fill, so its edge stands alone |

## Visual pass

The gallery groups the tiles (Default, Layout for orientation and inset,
Variants for spacing, the spacing tile added in the second pass). Beside the Notion page
menu the rule now reads firmer than Notion's; beside ChatGPT's menu it reads about the same.
2026-09-28 (batch 22), live in Claude in Chrome: Notion's page-menu rules (right-click on a
sidebar page, then Escape) are 1px at 7% warm black (about #ef on white), 12 from each side of the
265 menu. Area in the gallery: the default rule 1px `border-divider` #e2; inside Menu 1px #f3,
13 from each side. The menu rule matches Notion within a step; the standalone rule stays the
firmer divider role. No change.

Unverified: dark theme (#333 on the dark surface), forced colours.

## Verification

5 Area captures after the second pass (rule rgb(226)) and 9 product captures read. Build
and test results are in the [cohesion audit](../research/cohesion-audit.md#verification).

## Feedback log

- 2026-09-26 · cohesion audit → no change; spec written; colour gap to products recorded →
  captures above.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → `border-decorative`
  #f3f3f3 → `border-divider` #e2e2e2 for Separator and every content rule; spacing tile
  added; Notion's rules found to be 7%, not 11%, recorded as open →
  `menu/notion--page-menu--open--light`, `popover/notion--share-popover--open--light`,
  `button/notion--outline-button--rest--light`, `card/figma--file-card--rest--light`,
  `select/figma--size-select--rest--light`, `area--full-width`.
- 2026-09-27 · third pass → open question settled, value kept: Notion's rules are 7% (#f0),
  not 11%; `border-divider` #e2 stays the nearest rung to #e5–#e6 →
  [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
