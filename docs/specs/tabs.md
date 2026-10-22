# Tabs spec

**Captures:** `docs/research/captures/tabs/`
**Peers:** Segmented (picks a value; filled), Nav (current marker, horizontal routes), Code
block language tabs, Badge (counts)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Tabs supports three
  sizes, both orientations and automatic/manual keyboard activation. Its default rounded
  underline spans the selected tab, including an icon or count; track optionally adds a
  divider. Tab gallery tiles show icons, counts and disabled state independently. Vertical
  orientation remains useful for settings views and uses the corresponding vertical
  keyboard navigation. Reference: [WAI-ARIA Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).
- 2026-09-26: Neutral by default, accent by override ([design system](../DESIGN_SYSTEM.md#colour)).
  Tabs already followed it: the indicator is `fg-default`; there is no accent option.
  *Since 2026-09-29 (owner, D1) the indicator is the Selection role, `fg-selection`
  (navigation.css:91-101): `fg-default` by default, the accent when a theme sets selection to
  accent.*
- 2026-09-26: Decide every open item with the most calculated option consistent with the
  system ([second pass](../research/cohesion-audit.md#second-pass-notion-figma-and-the-open-decisions)).
  Unselected options in a set take the muted ink with one weight (Tabs already did); the
  track is a rule, so it uses the new `border-divider` role.

- 2026-10-21 (owner: "maybe the text needs to be strong for selected?"; picked C from a mock of A current, B every label
  500, C selected 500): the selected label is 500 over 400 at rest, each tab's width reserved at 500, a written
  exception to the one-weight rule (DESIGN_SYSTEM.md, "Ink and weight"); the indicator lies on the track.

## Job and boundaries

Tabs switch between views of one page with a transparent tab row and an underline (or a
rail, vertically). A segmented control picks a value and is filled; Nav moves between
pages. The underline rather than a fill is what keeps Tabs and Segmented apart
(`navigation.css:1-7`). Notion's database view tabs and Figma's tabs are filled pills; in
Area that treatment belongs to Segmented or a horizontal Nav.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm 28, md 32 (default), lg 40 | Owner (three sizes) | Untitled underline tabs 32 / 36; Notion underline tab 28 in a 40 row; Figma 24 |
| orientation | horizontal, vertical | Settings views | Owner; ChatGPT settings uses a vertical list (captured as a nav row) |
| track | off, on | Optional baseline divider | Untitled 1px neutral-200; Notion's Share tabs sit on a hairline (`popover/notion--share-popover--open` node 4) |
| composition | icons, counts | Owner | Untitled; Notion view tabs carry a 20px icon (`notion--view-tab--rest`) |
| state | disabled | Owner | Untitled |

Gallery groups (`apps/docs/scripts/build.mjs:784-793`): Default; States (disabled); Layout
(vertical); Sizes (sm, lg); Content (with track, icons, counts).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | Underline tabs in the Share popover; database view tabs rest and selected | app.notion.com Share popover and tasks board, 2026-09-26 (second pass) | evidence only | `tabs/notion--tabs-underline--rest--light`, `tabs/notion--view-tab--rest--light`, `tabs/notion--view-tab-selected{,2}--rest--light` |
| figma | target product | File-browser tabs rest, hover, selected; editor panel tabs rest, hover | figma.com file browser and editor inspector, 2026-09-26 (second pass) | evidence only | `tabs/figma--tab--{rest,hover}--light`, `tabs/figma--tab-selected--rest--light`, `tabs/figma--panel-tab--{rest,hover}--light` |
| uui | design system (source) | Underline and button tabs | [reference](../research/untitled-ui-reference.md), `tabs.tsx:21-208` @ `4702dc0` | MIT | — |
| area | this system | 8 gallery tiles after the second pass | localhost gallery | — | `tabs/area--*` (8) |
| systems | design systems (source), 2026-10-21 | Underline tabs: weight per state and width reservation, indicator, hover, track, motion | Radix Themes `1faff10` base-tab-list.css:32-52, 109-125; Fluent v9 `335c5de` useTabStyles.styles.ts:108-177, 568-595; Primer `3a71047` UnderlineTabbedInterface.module.css:55-71, 105-113; Material Web `d797a00` primary-navigation-tab.scss:85-99; Carbon `7ccd615` _tabs.scss:495-503, 580-586; React Spectrum `e36b8c2` s2 Tabs.tsx:409-417; shadcn `ba1503c` new-york-v4 tabs.tsx:66-69; Ant `e7bb7c2` tabs/style/index.ts:745-826; Atlassian @atlaskit/tabs 21.3.0 tab.js:52-55 | MIT / Apache-2.0 | — |

ChatGPT's settings navigation was captured as a Nav row (`baseline/chatgpt--settings-nav-current--rest`),
not as tabs. Light theme only. The `figma--tab--hover` capture shows no plate (white); the
panel-tab hover does.

## Anatomy

```
notion   div 281 × 40, padding 0 8 0 12; tablist flex, no gap                (tabs-underline nodes 0-1)
  tab    div[role=tab] 28 tall, padding 0/8, radius 6, 14/16.8 500
         selected rgb(44, 44, 43); rest rgb(161, 158, 153)                    (nodes 3, 5-6)
  line   border-bottom 2px `--c-texPri` (primary ink), the tab's full box    (node 4)
notion view tab  32 tall, padding 6/12, radius 20, 20px icon, 14/16.8 500;
         rest rgb(125, 122, 117); selected rgb(44, 44, 43) on rgba(33, 27, 23, .05)
figma    button 24 tall, padding 0/8, radius 5, 11/16 450; rest 50% black;
         selected 550, 90% black on #f5; a hidden 550 copy reserves the bold width (tab-selected node 1)
area  div.area-tabs (column; row when vertical, gap 16)
  list  div.area-tabs__list[role=tablist] flex, gap 20 (md); with track, a 1px border-divider painted at the
        bottom of its content box, under the tabs, so the indicator lies on it
    tab   button.area-tabs__tab[role=tab] 32px, padding 0, gap 6, fg-muted, 14/20 400
      icon  .area-tabs__icon 16px;  label .area-tabs__label (trimmed text; a column holding the text
            and .area-tabs__reserve, an aria-hidden 500 copy at no height that reserves the selected width)
      ::after indicator 2px, radius-full, full tab width, at the tab's bottom edge
  panel div.area-tabs__panel[role=tabpanel] padding-top 16 (6 vertical)
```

Inset: horizontal tabs have no inline padding, so the first label sits on the panel's
content edge (`inset.css:60-65`). Vertical tabs start text at 10 (`navigation.css:84`) with
the rail at 0, 2px wide, inset 4px top and bottom.

## Measurements

`node scripts/capture-compare.mjs --slots shell tabs/notion--tabs-underline--rest--light.json tabs/notion--view-tab{,-selected}--rest--light.json tabs/figma--tab-selected--rest--light.json tabs/figma--panel-tab--{rest,hover}--light.json` (trimmed):

| slot · property | notion · tabs-underline | notion · view-tab | notion · view-tab-selected | figma · tab-selected | figma · panel-tab | figma · panel-tab · hover |
|---|---|---|---|---|---|---|
| **shell** size | 281.4 × 39.99 | 152.73 × 32 | 122.86 × 32 | 103.89 × 24 | 68.75 × 24 | 68.75 × 24 |
| **shell** padding | 0 8 0 12 | 6 12 6 12 | 6 12 6 12 | 0 8 0 8 | 0 8 0 8 | 0 8 0 8 |
| **shell** radius | 0px | 20px | 20px | 5px | 5px | 5px |
| **shell** font | 14px/21px 400 (tabs 500) | 14px/16.8px 500 | 14px/16.8px 500 | 11px/16px 550 | 11px/16px 450 | 11px/16px 450 |
| **shell** color | rgb(44, 44, 43) | rgb(125, 122, 117) | rgb(44, 44, 43) | rgba(0, 0, 0, 0.898) | rgba(0, 0, 0, 0.5) | rgba(0, 0, 0, 0.5) |
| **shell** background | — | — | rgba(33, 27, 23, 0.05) | rgb(245, 245, 245) | rgb(255, 255, 255) | rgb(245, 245, 245) |

Area (node trees): md 32px tall, 20px apart, selected ink rgb(40, 40, 40), rest rgb(102, 102,
102); indicator 2px rgb(40, 40, 40) radius 9999px, full tab width (`area--default`). sm 28px,
16px apart, 12/16 text at capture (`area--size-sm`; now 14/20, `control-sm-text`); lg 40px, 24px apart (`area--size-lg`). Track list 33px
(32 + 1px divider). Disabled tab opacity 0.5 (`area--disabled`).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| tab · height | 28 / 32 / 40 (`control-sm/md/lg`) | Owner (three sizes); control tier | Notion 28 in a 40 row, Figma 24, Untitled 32 / 36 |
| tab · inline padding | 0, content-aligned | Manifest contract ("labels align with panel content"); `inset.css:65` | Notion pads 8 each side; kept (third pass): padding would carry the underline past the content |
| tab · gap | 16 / 20 / 24 (`space-*`) | not found (searched PRIOR_DECISIONS.md, navigation.css comments); unsourced, kept in the third pass | Notion 16 label to label (8 + 8, no gap); Untitled 12 |
| text | 14/20 at every size (`control-sm/md/lg-text`; sm was 12/16 until small controls moved to 14/20); **400 at rest, 500 selected**, each tab's width reserved at 500 | Owner 2026-10-21 (C); Figma 450 → 550 with a hidden copy; Radix 400 → 500 with a hidden copy; Fluent and Primer 400 → 600, reserved | A written exception to one weight per label (DESIGN_SYSTEM.md): tabs carry no fill, so weight marks the selected view. Notion, Material 3, shadcn and Atlassian keep 500; Spectrum 2 and Ant keep 400 |
| rest / selected ink | `fg-muted` #666666 / `fg-default` #282828 | Second pass: unselected options muted (Figma 50% black, Notion tertiary) | Untitled selected brand-700 |
| indicator | 2px, `radius-full`, `fg-selection` (neutral: `fg-default`), whole tab | Owner (rounded underline spanning icon and count); Notion 2px in primary ink | Untitled 2px square-ended brand-600 |
| hover | pending indicator `border-hover` #b4b4b4 / #585858; ink fixed | Foreground fixed on hover; Figma panel tab keeps 50% ink on hover | Figma paints a #f5 plate; Untitled hovers to the selected paint |
| pressed | indicator `fg-muted` | Earlier Area value | — |
| track | 1px **`border-divider`** #e2e2e2 / #333333 at `stroke-width`, painted at the bottom of the list's content box; **the indicator lies on it** | Second pass divider role; Radix and Primer inset 1px, Material and Ant under the indicator; owner 2026-10-21 | Was a border under the list, outside the scrolling list's clip, so the indicator stacked above it as a second line |
| focus | 2px `focus-color` inset (offset −2), radius min(8, 0.4 × height) | Untitled 2px inset focus | — |
| disabled | 50% | Audit disabled rule; Untitled 50% | — |
| icon, gap | icon tier per size; icon-to-label gap 6 at sm, md and lg (`--_tab-item-gap`, navigation.css:16, :38, :79-81); compact sm 4 | Area icon and gap tiers; peer Button (audit S14) | Was 4 (sm) / 8 (md, lg) |
| vertical | list gap 4, text start 10, rail 2px inset 4, panel top 6 | Owner (vertical orientation) | — |

Settled in the third pass (kept; [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)):
1. Tab box and spacing. Notion's underline tabs pad each label 8px with no gap, so the
   underline runs 8px past each side of the label and labels sit 16 apart
   (`notion--tabs-underline` nodes 3-6). Owner: the underline spans the selected tab, icon
   and count included, so tabs keep no padding; padding would carry it past the content.
   The 20px gap at md stays, recorded here as unsourced.

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| rest | `fg-muted`, no indicator | `area--default` tabs 2–3; Notion rest rgb(161, 158, 153) |
| hover | indicator `border-hover`; ink fixed | `navigation.css:66-69`; `figma--panel-tab--hover` (ink fixed) |
| pressed | indicator `fg-muted` | `navigation.css:70-73` |
| focus-visible | 2px inset outline | `navigation.css:102-107` |
| selected (`data-selected`, `aria-selected`) | `fg-default` at 500, indicator `fg-selection`; the width does not change | `area--default` tab 1; `notion--tabs-underline` node 3; headless Edge 2026-10-21: tab widths 56.89 / 57.69 / 67.14 whichever is selected, label box 2.5 + 27 unchanged |
| disabled | opacity 0.5, `not-allowed`; skipped by arrow keys | `area--disabled` |

## Behavior and accessibility

`role=tablist` with `aria-orientation`; tabs are buttons with `aria-selected` and
`aria-controls`; panels are `tabpanel`, `aria-labelledby`, `tabIndex=0`. Roving tab stop;
Left/Right (Up/Down vertically), Home and End, reversed in RTL for horizontal lists;
automatic or manual activation (`primitives.tsx:1401-1436`); `onValueChange(value, event)` passes
the click or key event. Notion's tabs are `div[role=tab]`
with `aria-selected` and every tab at `tabindex=0` (`notion--tabs-underline` nodes 3, 6).
Forced colours: tab focus is listed in `forced-colors.css:31`, and the selected indicator paints `Highlight` (`forced-colors.css:88`); not verified in a forced-colours browser.

## Peers and consistency

| Peer | Shared role | Peer value | Tabs | Match / reason |
|---|---|---|---|---|
| Nav marker | current marker | `fg-selection` | `fg-selection` | match (Selection role); Tree view's rail was removed |
| Segmented | option ink, weight | muted / default, 500 on a fill | muted / default, 400, no fill | same ink rule; labels on fills take 500 |
| Code block tabs | hover | plate, ink fixed | indicator, ink fixed | both keep ink fixed |
| Button, Menu, Nav | disabled | 50% | 50% | match |
| Separator | rule | `border-divider` 1px | track 1px | match; Menu separators take `border-decorative` (surface.css:1121), a rule inside a floating surface |

## Visual pass

2026-09-28 (batch 21), live in Claude in Chrome on the owner's "returns" database (read only): the
view tabs re-measured as 2026-09-26 (32 tall, corner 20, 6 / 12, 14/16.8 500; selected a 5% warm
wash in default ink, rest muted #7d, 1 apart). Hover, first captured (`notion--view-tab--hover`):
the same 5% wash, the ink stays muted, as Area's foreground-fixed rule. Notion's view tabs are
pills, Area's Segmented shape; Area's Tabs follow Notion's underline tabs (Share popover): in the
gallery 32 tall, 20 apart, 14/20 400, selected #28 over rest #66 with the 2px rounded indicator.
Type size matches (14); weight stays 400 by the type ramp (Notion 500). No change. Unverified:
dark theme.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Verified on `/tabs.html` by switching `data-selected` and reading
`getAnimations()` (the old tab fades ink and indicator over 100; the new one has none).

| Interaction | Before | After |
|---|---|---|
| Pending indicator on hover | `--area-transition` both ways | instant in, fast ease-out out |
| Pending indicator on press | eased 100 | instant |
| Selection (ink and indicator) | cross-fade 100 both ways | instant on the new tab, fast fade on the old |
| Focus ring | outline, instant | unchanged |

Crispness: the indicator is 2px at the tab's bottom edge, no transform.

Open question: a sliding indicator (one element moving by `translate` and width on `base`
ease-in-out; Figma, Linear and Primer slide, Notion does not). Recommendation: try it as an
opt-in after the owner sees it, since it changes the component's structure.

## Verification

Compared the Notion and Figma tab captures above with 8 Area captures (`tabs/area--*`,
re-taken after the second pass) and Untitled UI source values. Build and test results are
in [the audit](../research/cohesion-audit.md#verification).

## Interaction polish, 2026-10-16

Tab labels are not selectable. See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Feedback log

- 2026-10-21 · owner: "i also want to improve the tab component ui ... maybe the text needs to be strong for selected?"
  → research (Notion, Figma captures; 10 design systems from source, Sources) and a mock of three weights; owner picked
  C → selected 500 over 400 with the width reserved by a hidden copy (`__reserve`, aria-hidden; Code block's language
  tabs too), and the track painted inside the list so the indicator lies on it (navigation.css, primitives.tsx,
  manifest.ts, DESIGN_SYSTEM.md). Open: a sliding indicator (Fluent, Material, Spectrum 2, Ant, Base UI slide 150–300ms).

- 2026-09-26 · cohesion audit → no change (neutral underline, fixed ink confirmed) → 7 Area captures.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → track
  `border-decorative` → `border-divider`; lg tile added; open question on tab padding and
  spacing → `notion--tabs-underline`, `notion--view-tab*`, `figma--tab*`, `figma--panel-tab*`.
- 2026-09-27 · third pass → open question settled, values kept: no tab padding, underline
  the tab's own width; the 20px gap recorded as unsourced → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-30 · audit S14 (owner) → a tab's icon-to-label gap is 6 at sm, md and lg (was 4 / 8 / 8), from the density tokens (`--_tab-item-gap`, navigation.css:16, :79-81; density.ts:80-82). The 16 / 20 / 24 gap between tabs is unchanged.
- 2026-09-30 · audit S17 (API vocabulary, slice 1) → `onValueChange(value, event)` passes the click or key event → `primitives.tsx:1221`.
- 2026-09-30 · audit S17 (API vocabulary, slice 2, H-13) → manifest default `size: "md"` added (manifest.ts:590); the md modifier equals the base rule, no visual change.
- 2026-10-02 · compact pass round 9 → sm tab gap 16 → 12 and the panel's top inset reads `inset-surface-md` (16 / 12) at compact. docs/research/compact-pass-2026-10-01.md (round 9).
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → hover, press and selection land at once and fade out on fast; sliding indicator left as an open question.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → the track is at `stroke-width`, a standalone divider (was `border-width`) (navigation.css). (docs/research/consistency-audit-2026-10-12.md)

## Review note, 2026-10-21

- **What changed:** the selected tab's label is now medium weight while the others stay regular, and switching tabs
  never shifts the row. With the track on, the underline now sits on the divider instead of above it.
- **Why:** you asked for stronger selected text; Figma and Radix do the same, reserving the bold width. The
  underline stacked above the divider read as two lines.

