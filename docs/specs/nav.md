# Nav spec

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
- 2026-09-26: Neutral by default, accent by override ([design system](../DESIGN_SYSTEM.md#colour)).
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
| rest ink | **`fg-default`** (marker variant and horizontal items `fg-muted`, since 2026-10-29) | Owner (2026-09-27); ChatGPT rgb(13) (`nav/chatgpt--sidebar-top-group`) | Notion rgb(95, 94, 89); the label carries the quieter ink |
| hover plate | `bg-component-hover` #f3f3f3 / #333333; ink fixed | Row-plate rule; ChatGPT 5% black; Figma page row #f5 | — |
| current | `bg-component-active` #eeeeee / #3f3f3f, ink `fg-default` | Selection one step above hover; Notion and ChatGPT current ink is the default ink | Notion, ChatGPT and Figma pages use the hover fill for current |
| current weight | 400 | One weight per label (second pass) | Figma pages 550 current, 400 rest |
| marker rail | `fg-selection` (nav.css:167): `fg-default` by default, the accent when a theme sets selection to accent | Owner rule 2026-09-26; emphasis roles 2026-09-29 | Figma's file browser tints the current row blue; the owner rule outranks it |
| disabled | whole row 50% | Audit disabled rule; Untitled 50% | — |
| item gap | 2 | Untitled 2 (38 pitch, 36 rows) | Notion, Figma single-row captures only |
| separator | 1px `border-divider` #e2e2e2 / #333333 at `stroke-width` (since the 2026-10-12 consistency pass) | Second pass divider role | Was `border-decorative` |
| group label | 32px row, **14/20 500** `fg-muted`, start 8 | Owner (2026-09-27, second message): ChatGPT's section title 14/18 500 rgb(143) (`nav/chatgpt--sidebar-section-label`) | Area's 14 leading is 20; rgb(143) is 3.3:1, so the ink is `fg-muted`. Notion's 12/16 was the first message's choice. Menu keeps 12/16 (Notion's menus) |
| nested group | `NavGroup nested` (`area-nav__group--nested`): the content steps in by Tree view's level step, a 16px slot + 6 gap = 22 (`--_nav-indent`, `nav.css:74-77`), added to the row's start inset by the inset contract (`inset.css:172-173`); plates stay full width; no group gap above it. A nested group inside a nested group steps in a level more (44, then 66) | Audit D-20 A (owner 2026-09-30); Tree view's 22px level | Children used to sit on the parent's column; until 2026-10-28 a second level sat on the first |
| closable tab | A horizontal row with actions (the desktop app's open tabs): the name `gap-md` after the icon (5 at type 13, as every control's icon and label); the close the **xs** icon (6.8 drawn at 13) in a nested square 4 in on every side (18 in the Titlebar's 26, through `--_nav-row-height` / `--_nav-row-radius`, which a container that shortens the items sets). With `revealActions` the close keeps no slot: the name runs to 8 from the plate's end and the close lands over it on hover, focus and while the row is current (always on touch), the name fading out under it (visible to 4 before the close's plate, an 8 fade). Horizontal rows never shrink; past its room the Nav scrolls | Claude Code's browser tabs (owner's screenshot); Figma desktop `desktop_shell.css` (close shown on `.isTabActive`, `:hover`, `:focus-within`, over a fixed-width tab, the owner's pick); Cursor 3.27.22 `workbench.desktop.main.css` (close at opacity 0 to 1 on `.tab.active`, `:hover`, `:focus`; `.tab-fade-hider`); Tree view's selected-row rule | 2026-10-29 rounds: gap-md 6 and an sm 16 close 2 from the top; then a kept slot (approved, then replaced the same day) |
| icon-only item | A `NavItem` with an `icon` and no children renders no text slot: a square plate (`aspect-ratio: 1`, no side padding), the icon centred, named by its `aria-label`. In the Titlebar's tabs, 26 by 26 at type 13. Hover changes only the plate, as every horizontal item | Figma desktop `desktop_shell.css` `tab--fileBrowserTab`: `flex: 0 0 40px; height: 38px`, the icon centred, `--color-text-secondary` at rest, `--color-text` on hover and active (Area keeps the ink fixed on hover) | — |
| group gap | **12** + the 2px item gap | ChatGPT 21 between sections at 35px rows (`nav/chatgpt--sidebar-projects-section`) | Notion 4; was 8 |
| width | **240** (`--area-nav-inline-size` fallback, `/* spec */`, `nav.css:27`) | Figma file-browser sidebar: 224 rows + 8 inset | Was 200 (prior decision); Notion rows 254. Docs demos render at this width, no longer framed at 260 (`apps/desktop/src/content/demos/nav.tsx:4`, third pass) |
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

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Verified in the built-in browser on `/nav.html` and the gallery
(computed transitions, `getAnimations()`, pseudo-element geometry at default and compact).

| Interaction | Before | After |
|---|---|---|
| Item hover plate | `--area-transition` both ways (100 in, 100 out) | instant in, fast ease-out out |
| Item press | eased 100 | instant (no press colour of its own; feedback is the hover plate) |
| Current plate and ink | eased 100 in | instant in, fast out |
| Row with actions (`__row`) hover / current plate | snapped both ways | instant in, fast ease-out out |
| Marker (marker variant) | appeared and vanished with the pseudo-element | drawn on every marker row, painted on the current one: instant in, fast ease-out out |
| Expandable chevron | snapped (`rotate` without transition) | `rotate` on fast ease-out, the one chevron rule |
| Focus ring | outline, instant | unchanged |

Crispness: the marker was `block-size: calc(1cap + 4px)` (≈13.94 at 14px) centred with
`translate: 0 -50%`, so both ends fell on fractional pixels. It is now `round(nearest, 1cap + 4px,
2px)` and centred by layout (`inset-block: 0; margin-block: auto`): measured 14 in a 32 row
(offset 9) and 12 in a 24 compact row (offset 6), no translate.

Selector fix: the collapsed rotation applied to any action with `aria-expanded`, which would have
turned a menu trigger's icon (a ⋯ button with `aria-expanded="false"`) a quarter turn. It now
skips `[aria-haspopup]`.

Open questions: none.

## Verification

Compared the ChatGPT, Notion and Figma row captures above with 10 Area captures
(`nav/area--*`, re-taken after the second pass). Build and test results are in
[the audit](../research/cohesion-audit.md#verification). Area hover was read from the CSS: a
current row keeps its plate under the pointer as a plain item (`nav.css:131, 139`, equal
specificity, later wins) and as a row with actions (`nav.css:242` excludes it).

## Review note, 2026-10-15

- **What changed:** a row can hide its actions until the row is hovered or focused, as Board's cards
  already do. The actions keep their place, so the text never moves; on a touch screen they always show.
- **Why:** the app's Sidebar rows needed it; it was the last Nav gap in the product rules.
- **Not a new component:** it is an option on a Nav row (`revealActions`). Over a trailing count the actions take the count's place on hover and focus (2026-10-22).

## Review note, 2026-10-16

- **What changed:** a row's actions are smaller, with 4 of room on every side inside the row (they nearly filled it,
  1–2 in), and under the pointer only their ink darkens, with no second plate on the row's plate.
- **Why:** your questions. Notion leaves 5, ChatGPT 8; ChatGPT and Cursor change only the ink on a row that
  already shows the pointer. The size rule is the one Chip's remove and field actions use: the row less 8.

## Review note, 2026-10-16 (round 29)

- **What changed:** in the sidebar example the rows now end where the header's buttons do, 8 from each edge (they
  stopped 16 from the right: the Nav kept its own 240 width inside a wider sidebar), and the product name is back at
  its old size, now set as the surface title rather than whatever it inherited. The Library icon's two lines are
  evenly spaced.
- **Why:** your notes. The rows fill the sidebar's column, so one 8 inset runs down both sides; Nav itself didn't
  change.

## Interaction polish, 2026-10-16

Rows press at `bg-component-pressed`, one step past selected (Notion presses at 10%, ChatGPT 12%; it shared selected's fill, 1.5% below hover). A row with actions showed no press at all: the row's hover rule outranked its press rule; the press is restated after it. Item text is not selectable. See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Lines (current, 2026-10-25)

Nav's separator paints `border-decorative` (#f3). Was `border-divider` (#e2). This supersedes any older line value below (owner 2026-10-25: "Build everything as proposed on the dividers page, removing the footer line but keeping the line under the Command palette's search" (comparison https://claude.ai/artifact/3Fc3sXEgfKJmHEf2arA9hE; docs/research/dividers-2026-10-25)).

## Feedback log

- 2026-10-25 · owner 2026-10-25: "Build everything as proposed on the dividers page, removing the footer line but keeping the line under the Command palette's search" (comparison https://claude.ai/artifact/3Fc3sXEgfKJmHEf2arA9hE; docs/research/dividers-2026-10-25) → Nav's separator paints `border-decorative` (#f3). Was `border-divider` (#e2).

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
- 2026-10-21 · owner: "make sure the gaps between the nav items is consistent ... in compact, that gap shouldnt go away" → `ui-row-gap` is a constant 1px at every type and density (was 2 − 2 × ui-dense: 0 at Compact 12–13, 2 at Default, up to 5 at Comfortable); supersedes the line above. ChatGPT 35 rows and Notion 30 rows, 1 apart (`nav/chatgpt--sidebar-top-group`, `nav/notion--sidebar-private-section`); headless Edge: 1px in Nav and Menu at all 15 type × density combinations.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → hover, current and row plates land at once and fade out on fast; marker fades out and rests on whole pixels (14 / 12, layout-centred); expandable chevron turns on fast; menu triggers no longer rotate.
- 2026-10-12 · owner adopted the product UI rules (docs/PRODUCT_UI.md, rule 3: rest → hover → press → selected, each a step firmer) → a held item (and a row with actions) takes `bg-component-active`, landing at once; replaces the 2026-10-07 "no press colour of its own" → `nav.css`; desktop gallery.
- 2026-10-12 · owner (desktop Sidebar) → in a Panel, Nav hangs its plates by its row inset and takes the panel's width instead of its 240 default; text on the panel's 14 column, plates 6 from the edges (Figma and Notion 8). Rule lives in panel.css; Nav alone is unchanged.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → separators are at `stroke-width`, as Separator (were `border-width`) (nav.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-15 · PRODUCT_UI.md open gap ("Nav row actions revealed on hover and focus-within, as Board card actions are"), owner: "merge it, then continue working" → NavItem `revealActions` (`area-nav__row--reveal`): Board's card-actions rule on a row, hidden (opacity 0, no pointer) until the row is hovered or holds focus, landing at once and leaving on `fast`; kept while a menu one of them opened is open (`aria-expanded` with `aria-haspopup`); only under `(hover: hover)`, so a touch screen always shows them. The actions keep their place, so the text never reflows. Gallery: Behavior / actions on hover.
- 2026-10-16 · owner, review round 27 (components27) → rethink `revealActions`: "should the actions backplate be smaller? so the margins are a bit larger and more visible? what is the sizing logic for inset hover actions in a row that already has a backplate? like maybe something like the dismiss button on a chip filter. i know some other design systems for small controls like this just do a color change for hover, wondering if that might be simpler/easier to implement across all components when it comes to small inset controls/actions" → open.
- 2026-10-16 · from the owner's round-27 questions → row actions are a nested square 4 in from the plate on every side, the row less 8 (24 at type 14 Default, 18 at the app's 13 Compact; were Button sm, 28 / 24, 2 / 1 in), with the row's corner less 4 (floor), and the row's end padding 4; their hover changes only the ink, `fg-muted` to `fg-default` (also while pressed or while its menu is open), with no plate (was the translucent `bg-hover`, audit S11c). Basis: Notion 20 in 30 (5 in), ChatGPT 20 in 36 (8 in, ink-only hover), shadcn 20 in 32, Fluent 24 in 32, Cursor's Agents sidebar ink-only; Area's own nested-square rule (Chip remove, InputAction). Measured in the app at type 13 Default: 22 in 30, 4 in, corner 4. docs/research/inset-actions-2026-10-16.md. Open: whether every inset control (Tree view, Chip, Tag, Badge, field actions) takes the same rule; Tree view still has the old one.
- 2026-10-16 · owner, review round 28 (components28) → rethink: "can you make sure the margins and padding are all intentional, it looks like there is extra margins on the right side. and so the backplate of the nav item doesnt look aligned with the button on top. also the wordmark can be the old size before." In chat: "how is the wordmark size for Area decided? is the library icon an area component? the lines inside the document look off and too close to the bottom of the document, not evenly spaced" → open.
- 2026-10-16 · from the owner's round-28 note → the sidebar demo (`GalleryNavSidebar`): the Nav kept its 240 default inside the 264 sidebar's 248 column, so its plates stopped 16 from the right edge and 8 from the left, out of line with the header's buttons. It now fills its column (`--area-nav-inline-size: 100%`, the sidebar sets the width), so the plates and the header's buttons both end 8 from each edge; the name starts on the rows' icon column (8 + the row's 8). The name had no type role and showed whatever it inherited (16 in the review page's Before frame, 14 in its After); it is now the surface title size (`title-xs`, 16 / 24 at type 14), at the regular weight, the old size. Nav's CSS unchanged. The Library row's `document` icon was redrawn with evenly spaced lines (docs/specs/icons.md, 2026-10-16).
- 2026-10-16 · owner, review round 29 (components29) → approved (row actions, the sidebar demo) → Complete again in `component-status.mjs`.
- 2026-10-22 · owner, review of docs/research/cursor-audit-2026-10-22.md (items 2 and 9) → (1) rows keep at least 5 above and below their text (`ui-row` = leading + max(5, 6 + 2 × level) × 2): 28 at type 13 Compact, was 26; Default and Comfortable unchanged (emit/base.ts). Cursor's Agents rows 28 (12/16 + 6), Figma's file browser 28 (11/16), ChatGPT 35 (14/20); Notion's 30 (14/21) was Area's proportion; the owner chose 28. (2) Revealed actions over a trailing count take its place: the row is their positioning box, they sit at its end (4 in), and the count gives way as they land (at once; back on `fast`); without hover they always show and the count is hidden. Notion's sidebar keeps a 0-wide slot and shows "…" and "+" at the end on hover (`tree-view/notion--sidebar-row`), ChatGPT's recents cover the row's end (`baseline/chatgpt--sidebar-recent--hover`), Figma's file browser a 24 action (`baseline/figma--sidebar-row`). Product UI rule 2 gains this one exception; cohesion.test.mjs names it. First use: the desktop Components Sidebar's Pin → nav.css.

- 2026-10-28 · the desktop app's nav (app structure Phase 1: Brands › Area › Foundations › its pages) needed a third level → a `NavGroup nested` inside another steps in by two of Tree view's levels (44), and a third by three (66); one nested level is unchanged (22) → nav.css (nested groups).

- 2026-10-29 · owner: "make inactive horizontal Nav items grey and give the tabs the reference's spacing" (Claude Code's browser tabs, inactive rgb(82, 81, 79), current rgb(11), inactive close rgb(137)) → horizontal items rest in `fg-muted`, current `fg-default`; a horizontal row with actions spaces as a closable tab (icon 10, close xs, end inset 4) and its close is full strength on the current row → nav.css (horizontal items, closable tab); gallery tile Horizontal / closable tabs. Reaches the desktop app's tabs and Inspector views, Nav's horizontal tiles, App shell's demos and one Abstract board scene. The reference's inactive close is lighter than its name; Area keeps both muted.
- 2026-10-29 · owner: "show the close on hover, focus and the current tab (Tree view's rule), always on touch, and change the icon→name gap to the system's 12. Measure Figma and Cursor first"; "make sure that the inset spacing around the close button is the same distance to the backplate" → a horizontal row with `revealActions` keeps its actions while current; the closable tab's name takes `gap-row` (10 at type 13); a row's action and corner follow `--_nav-row-height` / `--_nav-row-radius`, which the Titlebar sets to the small control, so the close is 18 in 26, 4 in on every side (was 22 in 26: 2, 2, 4), concentric 4 in the tab's 8 → nav.css, app-shell.css; tile Horizontal / closable tabs reveals.
- 2026-10-29 · owner, on the closable tab's 10 between icon and name: "seems a bit too large … is it consistent with other icon to text gaps?" → no: `gap-row` is a list's label column (vertical Nav, Menu, Command palette, Approval); a control's icon and label take `gap-md` (Button, Segmented, Tabs, Chip; 5 at type 13). The closable tab drops its gap override and keeps the horizontal item's `gap-md` → nav.css.
- 2026-10-29 · owner: "i like how figma shows the full text or as much of the text as possible, then on hover the dismiss goes over the text and then the text is truncated" (after the tab edge-case sheet: shortest and longest names, 12 tabs) → a horizontal row's revealed actions keep no slot: positioned over the item's end, the name filling the item and masked out under them (`--_nav-cover`, the action and its 4 each side less the item's 8 end; an 8 fade), on hover, focus, current, always without hover; horizontal rows `flex: 0 0 auto` as horizontal items, so a long Nav scrolls instead of squeezing its rows → nav.css. Supersedes the kept slot approved earlier the same day.

- 2026-10-29 · app structure Phase 2: the desktop app's Home is a fixed first tab, icon only, as Figma's file browser tab → a `NavItem` with an icon and no children is a square plate with the icon centred, named by its `aria-label` (Nav.tsx drops the empty text slot; nav.css `.area-nav__item:not(:has(> .area-nav__text))`); gallery tile Horizontal / icon-only item; documentation entry. Nav back in review for this addition.

## Review note, 2026-10-22 (round 67)

- **What changed:** stacked rows sit 1px apart (were 2px at the default size, and touching at Compact). Keyboard focus is the brighter indicator blue (#0160d9, was #004cb0), as everywhere since the state settings.
- **Why:** you asked for the gap between nav items to stay the same and not disappear at Compact. ChatGPT's and
  Notion's sidebars put their rows 1px apart, so `ui-row-gap` is now 1px at every type size and density, for every
  family that stacks rows. The focus colour is your pick on the state page (2026-10-21).

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.

## Review note, 2026-10-26

- **What changed:** The separator is the lightest grey, #f3 (was #e2).
- **Why:** you asked for dividers only where they are needed and intended, and for the ones that stay to be very
  light. You approved each one on the dividers comparison page.

## Review note, 2026-10-29

- **What changed:** In a horizontal Nav, items at rest are grey (`fg-muted`); the current one stays full strength. A
  horizontal row with a close (open tabs) keeps a control's icon gap (`gap-md`), draws a small close 4 in
  from its plate on every side, and shows it on hover, focus and the current tab (always on touch), its place kept.
- **Why:** you asked for the tabs to look like Claude Code's browser tabs: grey inactive tabs and its spacing.
- **Before / after:** https://claude.ai/artifact/Jt3DeSrHcKpaH7M1rjEGs4 (tabs and the Inspector's views, light and dark;
  Cursor's and Figma's close rules).
- **Verdict:** approved, 2026-10-29: "Keep the hidden close's space (Cursor's way); approve this round." Reopened the same
  day: the owner chose Figma's way (the close lands over the name's end, which fades). Approved 2026-10-29: "keep Figma's
  close, 120 to 170 tabs and scrolling overflow; mark Nav complete." Nav is Complete.
  Edge cases: https://claude.ai/artifact/1RWLR2gyESHHwxNKJ4XpsZ

## Review note, 2026-10-29 (icon-only item)

- **What changed:** a Nav item with an icon and no label is now a square plate with the icon centred (it was a plate
  with an empty label slot). Nothing else changed.
- **Why:** the desktop app's Home is a fixed first tab, icon only, as Figma's file browser tab (app structure Phase 2).
- **Verdict:** awaiting the owner.
