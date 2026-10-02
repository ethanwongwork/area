# Nav spec

**Status:** accepted · 2026-09-27 (batches 1-3; was: in review · 2026-09-26 (cohesion audit, second pass))
**Captures:** `docs/research/captures/nav/`, `docs/research/captures/baseline/`
**Peers:** Menu (rows, plates, labels), Tree view (navigation rows), Tabs (neutral current
marker), Breadcrumb (hover plate), Button ghost (row actions)

## Owner decisions

- 2026-09-27 (second message): "get the nav titles from ChatGPT for nav and show the nav in full
  context" → group titles take ChatGPT's section title: the rows' 14px size at weight 500 in a
  quieter ink, a row pitch tall (`nav/chatgpt--sidebar-section-label`: 14/18 500 rgb(143) in a
  36 row); Area's ink stays `fg-muted` for contrast. Supersedes the 12/16 label of the first
  message. New tile Recipe / sidebar in context: ChatGPT's sidebar layout (header, icon rows,
  titled Projects and Recents, a row action, the account row) from Area components.

- 2026-09-27: "look into openai chatgpt, notion nav for design reference" → items take the
  default ink (ChatGPT rgb 13); group labels step back by size and ink, 12/16 `fg-muted`
  (Notion 12/16 rgb 161, ChatGPT 14/18 rgb 143; both under 4.5:1, so Area keeps `fg-muted`);
  12 between groups (ChatGPT 21 at 35px rows). The marker variant keeps muted rows, its
  current row in the default ink.

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Current refinements:
  Nav has a 200px default vertical measure, content-width horizontal layout, decorative
  trailing annotations and independent action slots. Nav uses filled rows for destinations,
  with a compact horizontal run for top level routes and a separate vertical selection
  marker option.
- 2026-09-26: Neutral by default, accent by override ([design system](../DESIGN_SYSTEM.md#color-and-focus)).
  The current plate and the marker rail are neutral; `tone="accent"` carries the accent.
  *Superseded 2026-09-29 (owner, D1): the marker rail is the Selection role (`fg-selection`,
  nav.css:167), accent by theme; the current plate stays neutral in every theme; `tone` was
  removed.*
- 2026-09-26: Decide every open item with the most calculated option consistent with the
  system ([second pass](../research/cohesion-audit.md#second-pass-notion-figma-and-the-open-decisions),
  item 15). The vertical measure is now 240, Figma's file-browser sidebar, replacing 200.

## Job and boundaries

Nav lists destinations and marks the current page, vertically (sidebar, with groups) or
horizontally (top-level routes). It is not a menu of actions (Menu), a hierarchy with
expansion state (Tree view) or a view switcher inside a page (Tabs).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| orientation | vertical (default), horizontal | Sidebar; top-level routes | ChatGPT, Notion and Figma sidebars; prior decision |
| selection | plate (default), marker | Quiet current-location rail for outlines | Prior decision |
| composition | groups, icons, counts, row actions, expandable | Sidebar content | ChatGPT recents (hover actions), Notion sidebar (icon rows, group labels), Figma sidebar (24px trailing action at opacity 0) |
| state | disabled | Unavailable destination | Untitled 50% |

Gallery groups (`apps/docs/scripts/build.mjs:389-400`): Default; Layout (grouped,
horizontal); Content (icons, counts, selection marker, actions, expandable); Tones (accent);
States (disabled).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | Sidebar row rest, hover, current; recents row rest, hover; settings nav current | chatgpt.com, owner's session, 2026-09-26 | evidence only | `baseline/chatgpt--sidebar-row{,-current}--*`, `baseline/chatgpt--sidebar-recent--{rest,hover}`, `baseline/chatgpt--settings-nav-current--rest` |
| notion | target product | Sidebar page row rest, hover; current row rest, hover; group label | app.notion.com sidebar, 2026-09-26 (second pass) | evidence only | `baseline/notion--sidebar-row--{rest,hover}--light`, `baseline/notion--sidebar-row-current--{rest,hover}--light`, `baseline/notion--sidebar-label--rest--light` |
| figma | target product | File-browser sidebar row rest, hover, current; editor page row rest, hover, current | figma.com file browser and editor pages list, 2026-09-26 (second pass) | evidence only | `baseline/figma--sidebar-row--{rest,hover}--light`, `baseline/figma--sidebar-row-current--rest--light`, `baseline/figma--page-row--{rest,hover}--light`, `baseline/figma--page-row-current--rest--light` |
| uui | design system (source) | Nav item and list | [reference](../research/untitled-ui-reference.md), `nav-item.tsx:11-119`, `nav-list.tsx:20-58` @ `4702dc0` | MIT | — |
| area | this system | 10 gallery tiles after the second pass | localhost gallery | — | `nav/area--*` (10) |

Light theme only. The Notion and Figma sidebar hover captures show no plate on the captured
row (the hover did not register, or an ancestor paints it); Figma's page-row hover does.

## Anatomy

```
chatgpt  button 328 × 35, padding 6/10, radius 8, 14/20 400; icon 20 at 10, text at 36
notion   div 254 × 30, padding 5/8, radius 6; icon 20 in a 22 × 18 box, 8 to text at 38;
         text 14/21 400; rest ink rgb(95, 94, 89), current rgb(44, 44, 43)
  label  div 254 × 30, padding 0/8; 12/16 text in rgb(161, 158, 153)      (sidebar-label)
figma    sidebar row 224 × 28, padding 0/4, radius 5; 24px icon box, gap 8, text at 36,
         11/16 400; a 24px trailing action at opacity 0 until hover       (sidebar-row--hover node 10)
  page   button 224 × 24, radius 5; text at 8, 11px; current 550, rest 400
area     nav.area-nav flex column, gap 2, 240 wide
  item   a.area-nav__item 32px, radius 8, gap 12 (gap-row; horizontal 6), fg-default (marker variant fg-muted); aria-current draws current
    icon 16px (.area-nav__icon); text truncates; trailing fg-muted
  row    .area-nav__row: item + .area-nav__actions (28px buttons), one shared plate
  label  .area-nav__label 32px, fg-muted
```

Inset equations: vertical text-only rows start at (32 − 16)/2 = 8, the icon column, not the
cap inset (`inset.css:56`), so labels, icons and group names share one edge (`area--default`:
text at 8). Horizontal text-only items centre their text at 11.03 on both sides
(`inset.css:58`; `area--horizontal`). End inset (32 − 1cap)/2 = 11.03; beside a Badge
(32 − 24)/2 = 4 (`inset.css:216`). Marker: start 16, rail 3 × (1cap + 4). Row with actions:
end padding (32 − 28)/2 = 2, action gap 2 (`nav.css:234-248`).

## Measurements

`node scripts/capture-compare.mjs --slots shell baseline/{chatgpt,notion,figma}--sidebar-row{,-current}--rest--light.json baseline/figma--page-row{--hover,-current--rest}--light.json` (trimmed):

| slot · property | chatgpt · row | chatgpt · current | notion · row | notion · current | figma · sidebar row | figma · sidebar current | figma · page hover | figma · page current |
|---|---|---|---|---|---|---|---|---|
| **shell** size | 328 × 35 | 328 × 35 | 254.01 × 30 | 254.01 × 30 | 224 × 28 | 224 × 28 | 224 × 24 | 224 × 24 |
| **shell** padding | 6 10 6 10 | 6 10 6 10 | 5 8 5 8 | 5 8 5 8 | 0 4 0 4 | 0 4 0 4 | 0 | 0 |
| **shell** radius | 8px | 8px | 6px | 6px | 5px | 5px | 5px | 5px |
| **shell** font | 14px/20px 400 | 14px/20px 400 | 14px/21px 500 (text 400) | same | 11px/16px 400 Inter | same | 11px/24px 400 | 11px/16px 550 |
| **shell** color | rgb(13, 13, 13) | rgb(13, 13, 13) | rgb(95, 94, 89) | rgb(44, 44, 43) | rgba(0, 0, 0, 0.898) | rgb(0, 0, 0) | rgb(0, 0, 0) | rgb(0, 0, 0) |
| **shell** background | — | rgba(0, 0, 0, 0.05) | — | rgba(33, 27, 23, 0.05) | — | rgb(229, 244, 255) | rgb(245, 245, 245) | rgb(245, 245, 245) |

Notion's current row keeps the same fill under the pointer (`notion--sidebar-row-current--hover`).
Area (node trees of `nav/area--default`, `--horizontal`, `--state-disabled`, `--tone-accent`):
items 240 × 32, radius 8, padding 0 / 11.03 / 0 / 8, 14/20; rest ink rgb(102, 102, 102);
current plate rgb(238, 238, 238); horizontal items 77.7–87.5 × 32, 4px apart; disabled row
opacity 0.5; accent current rgb(72, 62, 223) on rgb(225, 231, 253).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| row · height | 32 (`control-md`) | Peers Menu, Tree view | Notion 30, Figma 28 / 24, ChatGPT 35, Untitled 36; density is the UI-scale axis's job (second pass, item 18) |
| row · radius | 8 (`radius-row`, capped at 0.4 × 32) | ChatGPT 8 | Notion 6, Figma 5, Untitled 6 |
| row · start inset | 8 default, 6 compact (`ui-row-inset`), the icon column | Notion 8 (primary for navigation); Figma page rows 8 | ChatGPT 10; Figma sidebar 4 + 24px icon box. Compact rows are 24 (docs/research/compact-pass-2026-10-01.md); Tree view reads the same inset |
| icon · size, gap | 16 (`icon-md`), **12** (`--area-gap-row`, `inset.css:62`), so labels sit at 36 as Menu's; horizontal items take `gap-md`, 6 since audit S14 (`inset.css:64`) | ChatGPT and Notion labels at 36; Menu | Was 8 (labels at 32) until audit S11a. Product icons 20–24; Area icon slots are 16 |
| text | 14/20 400 | ChatGPT 14/20 400; Notion 14/21 400 | Figma 11/16 (editor density) |
| rest ink | **`fg-default`** (marker variant `fg-muted`) | Owner (2026-09-27); ChatGPT rgb(13) (`nav/chatgpt--sidebar-top-group`) | Notion rgb(95, 94, 89); the label carries the quieter ink |
| hover plate | `bg-component-hover` #f3f3f3 / #333333; ink fixed | Row-plate rule; ChatGPT 5% black; Figma page row #f5 | — |
| current | `bg-component-active` #eeeeee / #3f3f3f, ink `fg-default` | Selection one step above hover; Notion and ChatGPT current ink is the default ink | Notion, ChatGPT and Figma pages use the hover fill for current |
| current weight | 400 | One weight per label (second pass) | Figma pages 550 current, 400 rest |
| marker rail | `fg-selection` (nav.css:167): `fg-default` by default, the accent when a theme sets selection to accent | Owner rule 2026-09-26; emphasis roles 2026-09-29 | Figma's file browser tints the current row blue; the owner rule outranks it |
| disabled | whole row 50% | Audit disabled rule; Untitled 50% | — |
| item gap | 2 | Untitled 2 (38 pitch, 36 rows) | Notion, Figma single-row captures only |
| separator | 1px `border-divider` #e2e2e2 / #333333 | Second pass divider role | Was `border-decorative` |
| group label | 32px row, **14/20 500** `fg-muted`, start 8 | Owner (2026-09-27, second message): ChatGPT's section title 14/18 500 rgb(143) (`nav/chatgpt--sidebar-section-label`) | Area's 14 leading is 20; rgb(143) is 3.3:1, so the ink is `fg-muted`. Notion's 12/16 was the first message's choice. Menu keeps 12/16 (Notion's menus) |
| nested group | `NavGroup nested` (`area-nav__group--nested`): the content steps in by Tree view's level step, a 16px slot + 6 gap = 22 (`--_nav-indent`, `nav.css:74-77`), added to the row's start inset by the inset contract (`inset.css:172-173`); plates stay full width; no group gap above it | Audit D-20 A (owner 2026-09-30); Tree view's 22px level | Children used to sit on the parent's column |
| group gap | **12** + the 2px item gap | ChatGPT 21 between sections at 35px rows (`nav/chatgpt--sidebar-projects-section`) | Notion 4; was 8 |
| width | **240** (`--area-nav-inline-size` fallback, `/* spec */`, `nav.css:27`) | Figma file-browser sidebar: 224 rows + 8 inset | Was 200 (prior decision); Notion rows 254. Docs demos render at this width, no longer framed at 260 (`apps/docs/src/demos/nav.tsx:4`, third pass) |
| row actions | 28px ghost buttons, always shown; hover `bg-hover`, press `bg-active` (`nav.css:243`), so they show on a hovered or current row | Prior decision (independent action slots); audit S11c | ChatGPT (20px pills) and Figma (24px) show actions only on hover |

Third pass ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)):
1. Group label: kept. Notion's sidebar label is 12/16 in its tertiary ink rgb(161, 158, 153)
   in a 30px row (`baseline/notion--sidebar-label--rest`); Area's stays the item's 14/20 in
   `fg-muted` at 32. Menu's label is the same, and the two stay one pattern. *Superseded
   2026-09-27: Nav's group title is 14/20 at 500 in `fg-muted` (ChatGPT; nav.css:68-84); Menu's
   label is 12/16 at 400 (surface.css:1102-1111). They are no longer one pattern.*

2. Trailing Badge inset: settled. The item reserves the pill's own height (20, or 16 for a
   small Badge; `inset.css:221-224`), so a count ends 6px from the plate's edge, as it sits
   6px from the top and bottom. It reserved `control-xs` (24), leaving 4.

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| rest | transparent, `fg-default` (marker variant `fg-muted`) | `area--default` rows 2–3 (captured before the 2026-09-27 ink change) |
| hover | plate `bg-component-hover` (row or `.area-nav__row`); not on the current row | `chatgpt--sidebar-row--hover`, `figma--page-row--hover`; `nav.css:131, 242` |
| focus-visible | 2px `focus-color` outline, inset (offset −2), as Tabs, so rows 2 apart don't overlap the ring (audit S11b) | `nav.css:168-172` |
| current (`aria-current`) | plate `bg-component-active`, `fg-default`, kept under the pointer; marker: no plate, rail | `area--default` row 1, `area--marker`; `notion--sidebar-row-current--hover` |
| disabled (`data-disabled`) | opacity 0.5, no hover plate, `not-allowed` | `area--state-disabled`; `nav.css:175-178` |

## Behavior and accessibility

`nav` landmark (label required, docs practice); `NavItem` is an `a` with `aria-current="page"`,
which is also the paint selector (Figma's page rows use the same attribute). Disabled items
drop `href`, set `aria-disabled`, `tabIndex=-1` and cancel clicks (`Nav.tsx:68-96`). Labelled
groups are `role=group` with `aria-labelledby` (Notion's label is a `role=button` with
`aria-expanded`). Row actions are sibling buttons, never nested in the link. Horizontal navs
scroll rather than wrap. RTL uses logical properties; a collapsed group chevron points along the
reading direction (`:dir(rtl)` rotates it 90°, `nav.css`, audit D-13). Forced colours paint the
current row `Highlight` / `HighlightText`, and the marker variant's rail `Highlight`
(`forced-colors.css`, audit D-14).

## Peers and consistency

| Peer | Shared role | Peer value | Nav | Match / reason |
|---|---|---|---|---|
| Menu, Tree view | row height, radius | 32, 8 | 32, 8 | match |
| Menu, Tree view, Table, Select | hover / selected plates | `bg-component-hover` / `-active` | same | match |
| Tree view | rest ink, start inset | `fg-default`, 8 (audit D-3) | same | match |
| Tabs | current marker | `fg-selection` indicator (navigation.css:101) | `fg-selection` rail | match (Selection role); Tree view has no rail (marker removed) |
| Menu, Button, Tabs | disabled | 50% | 50% | match |
| Menu | group label, leading icon inset | 32px 12/16 400 `fg-muted`; 8 (surface.css:1102-1111) | 32px 14/20 500 `fg-muted`; 8 | inset matches; the label differs since 2026-09-27 (Nav takes ChatGPT's section title, Menu Notion's caption label) |
| Menu, Command palette, Select | icon-to-label gap | `--area-gap-row` 12, labels at 36 | same (vertical) | match (audit S11a) |
| Menu | keyboard focus | plate only | inset 2px ring | differs by owner call (audit S11b): Menu keeps plate-only focus |

## Visual pass

2026-09-27, Claude in Chrome, side by side at 100%: ChatGPT's sidebar (top rows, Projects and
Recents sections) and Notion's sidebar (Recents / Private sections, page rows) beside the
gallery's Grouped and Icons tiles.

- Hierarchy now matches both products: section labels are smaller and quieter than the rows,
  rows sit in the default ink, and space rather than a rule separates the sections.
- Row pitch: Area 34 (32 + 2) between Notion's 31 and ChatGPT's 36; current plate a neutral
  rounded fill in all three (Area and ChatGPT radius 8, Notion 6).
- Icons: the products draw 20px icons; Area's 16px icon slot reads lighter but keeps the grid.
- Label ink: Area's `fg-muted` is darker than both products' label inks (143 / 161), kept for
  4.5:1 text contrast.
- Unverified: dark products, an accent Selection theme beside a product.

## Verification

Compared the ChatGPT, Notion and Figma row captures above with 10 Area captures
(`nav/area--*`, re-taken after the second pass). Build and test results are in
[the audit](../research/cohesion-audit.md#verification). Area hover was read from the CSS: a
current row keeps its plate under the pointer as a plain item (`nav.css:131, 139`, equal
specificity, later wins) and as a row with actions (`nav.css:242` excludes it).

## Feedback log

- 2026-09-26 · cohesion audit → hover `bg-component` → `bg-component-hover`, current
  `bg-component-hover` → `-active`, marker accent → `fg-default` (accent via `tone`), disabled
  grey ink → 50% row → 8 Area captures, ChatGPT sidebar rows.
- 2026-09-26 · found while writing this spec → horizontal text-only plates were 8 / 11.03 →
  centred at 11.03 (`inset.css:58`) → `area--horizontal`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → width 200 → 240
  (Figma sidebar); separators `border-divider`; accent and disabled tiles added; open
  question on the group label → `baseline/notion--sidebar-*`, `baseline/figma--sidebar-*`,
  `baseline/figma--page-row-*`.
- 2026-09-27 · third pass → docs demos render at Nav's own 240 (were framed at 260); group
  label kept → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · third pass, follow-up → trailing Badge reserves its own 20px height, end inset 4 → 6 (measured 6 / 6 / 6 in the gallery) → `inset.css:221-224`.
- 2026-09-27 · owner: refine from ChatGPT and Notion → Claude in Chrome captures of both
  sidebars (`nav/chatgpt--sidebar-{top-group,section-label,projects-section,recents-section}`,
  `nav/notion--sidebar-{sections,private-section}`, redacted) → items default ink, labels 12/16
  muted, 12 between groups → headless Edge screenshot of the Grouped tile.
- 2026-09-27 · batch 2 → Claude in Chrome side by side with ChatGPT and Notion sidebars
  recorded (Visual pass); Validated.
- 2026-09-27 · owner: titles from ChatGPT, nav in full context → labels 14/20 500 muted, sidebar
  recipe tile → headless Edge screenshot of the recipe.
- 2026-09-30 · audit S11 (owner) → vertical items take `--area-gap-row` 12, labels at 36 (was `gap-md` 8, labels at 32; `inset.css:62`); focus ring inset (offset −2, was +2; `nav.css:171`); ghost row actions hover `bg-hover` and press `bg-active` (was `bg-component-hover`, invisible on a hovered row; `nav.css:243`).
- 2026-09-30 · audit S14 (owner) → horizontal items read `gap-md`, now 6 (was 8; `inset.css:64`); vertical items keep `--area-gap-row` 12.
- 2026-10-01 · audit D-3 (owner pick A) → Tree view rows now rest in `fg-default` as Nav's do; peer row and the stale rest-state row corrected → tree-view.css.
- 2026-10-01 · audit D-13 → a collapsed group chevron points along the reading direction (`:dir(rtl)` rotate 90) → nav.css.
- 2026-10-01 · audit D-14 → forced colours: current row `Highlight` / `HighlightText`; the marker rail draws in `Highlight` → forced-colors.css.
- 2026-10-01 · audit D-20 (owner pick A) → `NavGroup nested` indents an expandable item's children by Tree view's level step (16 + 6 = 22) with full-width plates → Nav.tsx:39, nav.css:74-77, inset.css:172-173.
- 2026-10-01 · owner: "the counts even on the default component look off from an inset equal padding view" → a plain Count has no plate, so its digits end on the row's glyph edge (8 default, 6 compact), mirroring the label's start; it was placed by its invisible box plus its 6px gutter (digits 17 from the end). A soft Count ends as far from the end as it sits from the top, as a Badge does. Row actions are concentric with the row plate (compact: 6 in a 6 row, was 4). Trailing Kbd and Badge rules read the mark roles, not literal 20/16. docs/research/compact-pass-2026-10-01.md.
- 2026-10-02 · compact evidence audit → the row glyph edge holds at 8 at compact (was 6; Figma 8, VS Code 9) (R1) docs/research/compact-evidence-2026-10-02/README.md.
- 2026-10-02 · compact evidence audit → rows and groups stack flush at compact (`ui-row-gap` 2 / 0; R7) docs/research/compact-evidence-2026-10-02/README.md.
