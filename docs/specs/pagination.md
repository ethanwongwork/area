# Pagination spec

**Captures:** `docs/research/captures/pagination/`
**Peers:** Button (ghost, the steps), Segmented and Tabs (an option set: muted ink, selected ink and plate), Breadcrumb (page navigation, the ellipsis), Count (tabular numbers), Calendar (day buttons and the month steps)

## Owner decisions

- 2026-10-08: Pagination is the next component (picked from Pagination, Link, ScrollArea and FileUpload; the gap audit counts it in 8 of 13 systems).
- 2026-10-08: the open questions go with the recommendations: the current page keeps the shared
  selected plate, step labels stay on by default, and the design-system basis stands without a Figma search.

## Job and boundaries

Pagination moves between the pages of a long list or result set: Previous and Next steps, page
numbers with the current one marked, and an ellipsis for each skipped run. It is not Tabs (sibling
views of one thing), not a Breadcrumb (where a page sits in a hierarchy), not a Calendar's month
steps, and not infinite loading or a "Load more" button (Notion's boards), which append rather than
replace.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| layout | `pages` (default) | Numbered pages between the steps | Untitled UI "Page default" and "Button group", shadcn, Primer |
| layout | `compact` | "Page 2 of 10" between chevron steps, for a narrow column | Untitled UI "Card minimal" ("Page 1 of 10"); ChatGPT's former 2/2 response switcher |
| size | `sm` 28, `md` 32, `lg` 40 | Area's control tiers, so a pager matches the Buttons and fields beside it | shadcn 32, Primer 32, Untitled UI 36 |
| composition | step labels (`stepLabels`, default on) or chevrons only | shadcn and Untitled UI label the steps; a dense table footer uses chevrons | shadcn default, Untitled UI button group |
| behavior | buttons, or links (`getHref`) | A router or a server-rendered list needs real addresses | shadcn renders anchors; Untitled UI renders buttons |

Excluded: Untitled UI's joined "button group" frame (a ButtonGroup composition, no target product
uses it), its dot and line indicators (a carousel position, not pagination), and the rows-per-page
select (compose it with Select beside the pager). A current-page fill in the accent (Primer) and an
outlined current page (shadcn) are recorded, not added: Area paints selection with the shared plate.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system (rendered) | Page default, button group, card advanced, dot, line | untitledui.com/react/components/pagination, 2026-10-08 | MIT | `uui--page-default`, `uui--button-group`, `uui--card-advanced`, `uui--dot`, `uui--line` (rest, light) |
| shadcn | design system (rendered) | Default, simple, previous / next | ui.shadcn.com/docs/components/base/pagination, 2026-10-08 | MIT | `shadcn--default`, `shadcn--simple`, `shadcn--previous-next` (rest, light) |
| primer | design system (rendered) | Default pagination (GitHub's) | primer.style/product/components/pagination, 2026-10-08 | MIT | computed-style readout only (below); the clipboard route was refused when saving the file |
| area | this system | Every gallery tile, and page 4 hovered with the real pointer | localhost gallery; the hover on a server-rendered harness of the same CSS | — | `area--*` (11) |

**Primer readout** (2026-10-08): items 32 × 32, padding 8 / 6, radius 6, 4px apart (margin-end),
16/16 400 on the docs page; the current page is a solid accent rgb(9, 105, 218) with white ink;
other pages rgb(31, 35, 40); the ellipsis rgb(129, 139, 152); Previous and Next are accent links
with a 16px chevron; colour transitions 0.2s.

**Untitled UI hover** (source classes, read on the page; the pane could not land a real hover):
page buttons hover to `bg-primary_hover`, the current page's own fill, and darken the ink to
`text-secondary`, both over 100ms.

Target products searched without an equivalent:
- **ChatGPT** (owner's Chrome, read-only, 2026-10-08): no pager. Response versions are a "See
  versions" button in the message's hover actions; none of the recent chats opened showed the old
  ‹ 2/2 › switcher.
- **Notion** (owner's Chrome, read-only): a board of 800+ cards appends as it scrolls, with no pager;
  the page peek opened from a card has no previous / next record arrows.
- **Figma:** not searched (its file browser and editor panels have no paged lists we know of). Open.

## Anatomy

```
shadcn   nav (flex, centred)
  list   ul flex, gap 2
    step   a, 32 tall, 1px transparent border, padding 0 10 0 6, radius 10, 16 chevron 6 from the label, 14/20 500
    page   a, 32 × 32, ghost; hover bg-muted; current = outline (1px border, white fill)
    more   span 32 × 32, 16px MoreHorizontal
uui      nav (flex, space-between, top rule)
  steps  link-style buttons, 20 tall, 14/20 600, 20px arrow 4 from the label, tertiary ink
  pages  div flex, gap 2
    page   button 36 × 36, padding 12, radius 8, 14/20 500, quaternary ink; current = hover plate + secondary ink
    more   span 36 × 36, "…" 16/24
area     nav.area-pagination (flex)
  list   ul.area-pagination__list flex nowrap, gap 2
    item   li.area-pagination__item
      step   button|a .area-button--ghost (neutral, the tier) .area-pagination__step: the Button, chevron glyph in its icon slot
      page   button|a .area-pagination__page: control height square, min-inline-size = height, 6 sides, Button's corner
      more   span.area-pagination__ellipsis: the square, `more` glyph at the tier's icon size
      status span.area-pagination__status (compact): the text with Button's label inset, numbers in .area-pagination__value
```

Inset equations (outer inset = border + shell padding + slot inset):
- Step, icon side: 1 (Button's stroke) + round((32 − 16) / 2 − 1) = 1 + 7 = **8** from the edge to the chevron box (shadcn 1 + 6 = 7).
- Step, label side: 1 + round((32 − 1cap) / 2 − 1) = 1 + 10 = **11** (shadcn 1 + 10 = 11).
- Page: no border; the number is centred in the square; a wide number keeps 6 each side (`--_page-inset`, Primer 6).
- Status: round((32 − 1cap) / 2 − 1) = **10** each side, the Button label's text inset.

## Measurements

Generated with `node scripts/capture-compare.mjs docs/research/captures/pagination/{area--default,shadcn--default,uui--page-default}--rest--light.json`
(geometry, type and paint rows; the full table includes position and pseudo rows).

| slot · property | area · default · rest · light | shadcn · default · rest · light | uui · page-default · rest · light |
|---|---|---|---|
| **list** size | 409.66 × 32 | 305.66 × 32.25 | — |
| **list** padding | 0 | 0 | — |
| **list** border | 0 | 0 | — |
| **list** radius | 0px | 0px | — |
| **list** gap (row / column) | 2px / 2px | 2px / 2px | — |
| **list** font | 14px/20px 400 Geist | 15px/26.25px 400 Geist | — |
| **list** color | rgb(40, 40, 40) | lab(0 0 0) | — |
| **previous** size | 97.55 × 32 | 96.55 × 32 | 82.98 × 20 |
| **previous** padding | 0 10 0 7 | 0 10 0 6 | 0 |
| **previous** border | 1 solid rgba(0, 0, 0, 0) | 1 solid rgba(0, 0, 0, 0) | 0 |
| **previous** radius | 8px | 10px | 4px |
| **previous** gap (row / column) | 6px / 6px | 6px / 6px | 4px / 4px |
| **previous** font | 14px/20px 500 Geist | 14px/20px 500 Geist | 14px/20px 600 Inter |
| **previous** color | oklab(0.451918 0.0000205655 0.0000090301) | lab(0 0 0) | lab(34.924 0 0) |
| **previous** opacity |  |  | 0.5 |
| **page** size | 32 × 32 | 32 × 32 | 36 × 36 |
| **page** padding | 0 6 0 6 | 0 | 12 |
| **page** border | 0 | 1 solid rgba(0, 0, 0, 0) | 0 |
| **page** radius | 8px | 10px | 8px |
| **page** font | 14px/20px 500 Geist | 14px/20px 500 Geist | 14px/20px 500 Inter |
| **page** color | rgb(102, 102, 102) | lab(0 0 0) | lab(48.496 0 0) |
| **current** size | 32 × 32 | 32 × 32 | 36 × 36 |
| **current** padding | 0 6 0 6 | 0 | 12 |
| **current** border | 0 | 1 solid lab(90.952 0 -0.0000119209) | 0 |
| **current** radius | 8px | 10px | 8px |
| **current** font | 14px/20px 500 Geist | 14px/20px 500 Geist | 14px/20px 500 Inter |
| **current** color | rgb(40, 40, 40) | lab(0 0 0) | lab(27.036 0 0) |
| **current** background | rgb(238, 238, 238) | lab(100 0 0) | lab(98.26 0 0) |
| **ellipsis** size | 32 × 32 | 32 × 32 | 36 × 36 |
| **ellipsis** padding | 0 | 0 | 0 |
| **ellipsis** border | 0 | 0 | 0 |
| **ellipsis** radius | 0px | 0px | 0px |
| **ellipsis** font |  | 15px/26.25px 400 Geist | 16px/24px 400 Inter |
| **ellipsis** color |  | lab(0 0 0) | lab(34.924 0 0) |
| **next** size | 72.11 × 32 | 71.11 × 32 | 55.75 × 20 |
| **next** padding | 0 7 0 10 | 0 6 0 10 | 0 |
| **next** border | 1 solid rgba(0, 0, 0, 0) | 1 solid rgba(0, 0, 0, 0) | 0 |
| **next** radius | 8px | 10px | 4px |
| **next** gap (row / column) | 6px / 6px | 6px / 6px | 4px / 4px |
| **next** font | 14px/20px 500 Geist | 14px/20px 500 Geist | 14px/20px 600 Inter |
| **next** color | oklab(0.451918 0.0000205655 0.0000090301) | lab(0 0 0) | lab(34.924 0 0) |

Area across tiers and the compact layout (`area--size-{sm,md,lg}`, `area--layout-compact`): steps and
pages 28 / 32 / 40, radius 6 / 8 / 10, all 14/20 500 at default density; the status is 91.3 × 32 with
10 each side, 14/20 400 in rgb(102). Hover (`area--default--hover`): page 4 rgb(243) under the
pointer, ink fixed at rgb(102); the current page stays rgb(238).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| page · size | control height square: 28 / **32** / 40 | shadcn 32, Primer 32 (Untitled 36); Area control tiers | — |
| page · min width / sides | min = height, 6 each side past it | Primer (min 32, sides 6) | Untitled and shadcn fix the square, which clips four-digit pages |
| page · radius | Button's corner formula (6 / 8 / 10), pill with `button` in the pills list | peer: Button at the same height; Untitled 8 at 36 | shadcn 10, Primer 6; one corner beside the steps |
| page · type | 14/20 **500**, tabular numerals | Untitled 500, shadcn 500; Segmented one weight; Calendar and Count tabular | Primer 400 |
| page · ink | `fg-muted`; current `fg-default` | Shared state paint, options in a set (Segmented, Tabs); Untitled quaternary / secondary | shadcn one ink |
| page · hover | `bg-component-hover`, ink fixed, lands at once, fades out on fast | Shared state paint; MOTION.md hover plate | Untitled also darkens the ink; Area keeps it fixed |
| page · pressed | `bg-component-pressed`, one step past selected (pagination.css:93) | Interaction polish 2026-10-16 (Notion 10%, ChatGPT 12%) | — |
| page · current | `bg-component-active`, stays under the pointer; `aria-current="page"` | Shared state paint (current = active plate); Untitled (current = a plate) | shadcn outline, Primer accent fill |
| list · gap | **2** | Untitled 2, shadcn 2 | Primer 4 |
| step | ghost neutral Button at the tier, chevron in the icon slot, 6 gap, label "Previous" / "Next" | shadcn (ghost, 16 chevron 6 from the label, 14/20 500); peer Button | Untitled link-style steps at 600; Primer accent links |
| step · end | `aria-disabled` + `data-disabled` (Button's 50%); a click does nothing. As a button it stays focusable; as a link (`getHref`) it loses its `href` and so leaves the tab order (Pagination.tsx:89-109) | Button's loading pattern (audit S18) keeps focus | shadcn and Untitled drop to native disabled; focus would fall to the page body when Next reaches the last page |
| ellipsis | square, `more` glyph at the tier's icon size, `fg-muted`, hidden from assistive tech | shadcn (16px icon in the 32 square); Breadcrumb's muted ellipsis | Untitled and Primer draw "…" text, which sits on the baseline |
| range | 1 boundary, 1 sibling, 7 items always (a one-page run shows the page) | Untitled and shadcn's examples show 7; Material UI's documented range | — |
| compact · status | "Page 2 of 10", muted text, numbers `fg-default` 500, Button label inset | Untitled UI "Page 1 of 10" with medium numbers | — |

Basis order: owner → target-product agreement → primary product for this context →
primary design system → peer/baseline consistency. No target product has the component, so design
systems and Area's peers decide.

- A page number's side is `gap-md` (6, Compact 4, Comfortable 8 at type 13).

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| page hover | plate `bg-component-hover` (rgb 243), ink fixed | `area--default--hover--light` |
| page pressed | plate `bg-component-pressed`, one step past selected | interaction polish 2026-10-16; pagination.css:93 |
| current | plate `bg-component-active` (rgb 238), ink `fg-default` (rgb 40), no hover change | `area--default--rest--light` |
| focus-visible | 2px `focus-color` outline at `focus-offset` (2), as Button | read on the harness with Tab |
| step at an end | Button's disabled 50% via `data-disabled`, `aria-disabled`. Buttons: focus stays on the step. Links (`getHref`): no `href`, so the step is not focusable | `area--state-first--rest--light`; gallery: six Next presses end on 10 with focus on Next (buttons); Pagination.tsx:107-109 |
| forced colors | current page Highlight / HighlightText | as Calendar's selected day |

## Behavior and accessibility

`nav` named "Pagination" (`aria-label`, else `labels.nav`), a list of items. Pages are `<button type="button">` named
"Page n" (`labels.page`) with the number as text, or `<a href>` with `getHref`. The current page has
`aria-current="page"`. Steps keep their label as text (or `area-sr-only` when chevrons only); with
`getHref` they are links with `rel="prev"` / `rel="next"`, and a step at an end is an `<a>` without
`href`, out of the tab order, while a button step at an end keeps focus. Tab order follows the row; no arrow-key
roving (none of the references has it). The compact status is `aria-live="polite"`, since focus stays
on a step while the page changes. Chevrons mirror in RTL (`:dir(rtl)`). Controlled (`page`) or
uncontrolled (`defaultPage`); a page outside 1…`pageCount` is clamped. `paginationRange` is exported
for custom layouts.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Button ghost | the steps | ghost neutral, 75% quiet ink, row plates | the same Button classes | match |
| Button selected | selected plate | `bg-component-active` | current page | match (harness, light and dark) |
| Segmented / Tabs | option inks | muted, default when selected, one weight | the same pair, 500 | match |
| Breadcrumb | ellipsis | muted | muted `more` glyph | match |
| Calendar | number buttons | tabular numerals | tabular numerals | match |

Baseline checks: hover fill #f3 matches the products' row and transparent-button hover (#f2–#f5).

## Visual pass

Harness (server-rendered specimens with `dist/area.css`, 1:1, light and dark) beside a ghost Button,
a selected ghost Button, Segmented and Breadcrumb: the current page's plate is the selected Button's
in both themes; step labels read one step stronger than the page numbers, as Untitled's tertiary steps
over quaternary pages; the ellipsis dots centre in their square. Compact density steps everything to
the compact control tiers together (md 28, radius 6, 12/16).

Fixed during the pass: the list wrapped onto two rows inside a narrow gallery tile (now one line, as
every reference); the compact status lost its spaces ("Page2of10"), because an inline-flex container
makes each text run its own item (the text is now one span).

Not done: a side-by-side against a target product (none has the component), and dark captures of the
references.

## Verification

- 11 Area captures, 5 Untitled UI and 3 shadcn captures; checksums verified by `capture-compare.mjs`.
- `npm run build` (manifest parity, token refs), `npm run typecheck`, `node --test packages/react/tests/*.test.mjs`
  (216, including 6 new in `pagination.test.mjs`), `npm run test:contracts`, `npm run test:consumer`, `npm test`
  (24,251), `npm run build:docs` (dogfood audit), `git diff --check`: all pass.
- Behavior in the hydrated gallery: Next six times from page 5 ends on 10 with seven items each time and focus
  kept on Next; Page 1 resets; compact moves to "Page 3 of 10"; link items carry their `href`.
- Unverified: screen reader announcement of the live status, forced-colors rendering, a real RTL page, Figma.

## Open questions

Resolved 2026-10-08 (owner: "go with your recommendations"):
1. Current page: the shared selected plate (Untitled UI), not an outline (shadcn) or the accent fill (Primer).
2. Step labels on by default; a table footer turns them off with `stepLabels={false}`.
3. No Figma search; the design-system basis stands.

## Interaction polish, 2026-10-16

Pages press at `bg-component-pressed`, one step past selected (Notion presses at 10%, ChatGPT 12%; it shared selected's fill, 1.5% below hover). See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Feedback log

- 2026-10-08 · owner picked Pagination as the next component → built from Untitled UI, shadcn and Primer
  evidence and Area's peers → 19 captures, gallery tiles, in review.
- 2026-10-08 · owner: "go with your recommendations" → the three open questions resolved as recommended; no
  code change.

### 2026-11-11 · Ink, dark and colour (system plan, Phase 1)

- **What changed:** Previous and Next read the muted ink with the pages (plan A3.3, finding VN12): one ink for the bar's inactive items.
- **Why:** docs/research/system-evaluation-2026-11-11 (README §5); the owner took every recommendation on 2026-11-11.
- **Verdict:** awaiting the owner.

## Shared parts (plan B2), 2026-11-13

- **Centring (B2.2, VN8).** A page number is a text box: a block trimmed to its cap and padded (H − 1cap) / 2 above and below (inset.css, `--_cap-room`), so its digits sit on the square's centre; centred on its line box they sat 0.62 high. The square, its sides and its corner are unchanged.

### 2026-11-14 · Shared parts, leftovers (system plan, Phase 2, wave 3)

- A pill is one value: while the Pills set rounds it, its corner is `radius-full` itself, `max(corner, flag × full)`, never the corner plus full (it computed the corner plus 9999px). Draws the same; the corners snapshot records 9999px.
- Listed, not moved: the page side 6 (a control's text side is 9 at the default).
- Why: docs/research/system-evaluation-2026-11-11 (plan B6.1, B6.5, B8.2, B2.2; README §5, phase2/leftovers.md); the owner took every recommendation on 2026-11-11. Fix the rule, not the instance.
- Verdict: awaiting the owner.

## State paint (plan B7.2), 2026-11-14

- The current page presses (its plate rule outranked the press).

## System status step C, 2026-11-18 (shared sources)

Its density holdout took `gap-md`; off the waiting list. Nothing moved at the defaults.
