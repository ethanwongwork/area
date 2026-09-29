# Tabs spec

**Status:** accepted · 2026-09-26 (spec written in the cohesion audit; accepted earlier;
second-pass evidence added)
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
- 2026-09-26: Neutral by default, accent by override ([design system](../DESIGN_SYSTEM.md#color-and-focus)).
  Tabs already followed it: the indicator is `fg-default`; there is no accent option.
- 2026-09-26: Decide every open item with the most calculated option consistent with the
  system ([second pass](../research/cohesion-audit.md#second-pass-notion-figma-and-the-open-decisions)).
  Unselected options in a set take the muted ink with one weight (Tabs already did); the
  track is a rule, so it uses the new `border-divider` role.

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
  list  div.area-tabs__list[role=tablist] flex, gap 20 (md); 1px border-divider when track
    tab   button.area-tabs__tab[role=tab] 32px, padding 0, gap 8, fg-muted, 14/20 400
      icon  .area-tabs__icon 16px;  label .area-tabs__label (trimmed text)
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
16px apart, 12/16 text (`area--size-sm`); lg 40px, 24px apart (`area--size-lg`). Track list 33px
(32 + 1px divider). Disabled tab opacity 0.5 (`area--disabled`).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| tab · height | 28 / 32 / 40 (`control-sm/md/lg`) | Owner (three sizes); control tier | Notion 28 in a 40 row, Figma 24, Untitled 32 / 36 |
| tab · inline padding | 0, content-aligned | Manifest contract ("labels align with panel content"); `inset.css:65` | Notion pads 8 each side; kept (third pass): padding would carry the underline past the content |
| tab · gap | 16 / 20 / 24 (`space-*`) | not found (searched PRIOR_DECISIONS.md, navigation.css comments); unsourced, kept in the third pass | Notion 16 label to label (8 + 8, no gap); Untitled 12 |
| text | 12/16, 14/20, 14/20; 400 in every state | Control tier; one weight per label | Notion 500 in both states; Figma 450 → 550 with the width reserved; Untitled 600. Area keeps 500 for labels on fills |
| rest / selected ink | `fg-muted` #666666 / `fg-default` #282828 | Second pass: unselected options muted (Figma 50% black, Notion tertiary) | Untitled selected brand-700 |
| indicator | 2px, `radius-full`, `fg-default`, whole tab | Owner (rounded underline spanning icon and count); Notion 2px in primary ink | Untitled 2px square-ended brand-600 |
| hover | pending indicator `border-hover` #b4b4b4 / #585858; ink fixed | Foreground fixed on hover; Figma panel tab keeps 50% ink on hover | Figma paints a #f5 plate; Untitled hovers to the selected paint |
| pressed | indicator `fg-muted` | Earlier Area value | — |
| track | 1px **`border-divider`** #e2e2e2 / #333333 below the list | Second pass divider role; Untitled 1px baseline; Notion's hairline | Was `border-decorative`; Area's indicator sits above the divider |
| focus | 2px `focus-color` inset (offset −2), radius min(8, 0.4 × height) | Untitled 2px inset focus | — |
| disabled | 50% | Audit disabled rule; Untitled 50% | — |
| icon, gap | icon tier per size; gap 4 (sm) / 8 (md, lg) | Area icon and gap tiers | — |
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
| selected (`data-selected`, `aria-selected`) | `fg-default`, indicator `fg-default` | `area--default` tab 1; `notion--tabs-underline` node 3 |
| disabled | opacity 0.5, `not-allowed`; skipped by arrow keys | `area--disabled` |

## Behavior and accessibility

`role=tablist` with `aria-orientation`; tabs are buttons with `aria-selected` and
`aria-controls`; panels are `tabpanel`, `aria-labelledby`, `tabIndex=0`. Roving tab stop;
Left/Right (Up/Down vertically), Home and End, reversed in RTL for horizontal lists;
automatic or manual activation (`primitives.tsx:847-902`). Notion's tabs are `div[role=tab]`
with `aria-selected` and every tab at `tabindex=0` (`notion--tabs-underline` nodes 3, 6).
Forced colours: tab focus is listed in `forced-colors.css:14`; the indicator is not verified.

## Peers and consistency

| Peer | Shared role | Peer value | Tabs | Match / reason |
|---|---|---|---|---|
| Nav marker, Tree view rail | current marker | `fg-default` | `fg-default` | match (neutral) |
| Segmented | option ink, weight | muted / default, 500 on a fill | muted / default, 400, no fill | same ink rule; labels on fills take 500 |
| Code block tabs | hover | plate, ink fixed | indicator, ink fixed | both keep ink fixed |
| Button, Menu, Nav | disabled | 50% | 50% | match |
| Separator, Menu separator | rule | `border-divider` 1px | track 1px | match |

## Visual pass

2026-09-28 (batch 21), live in Claude in Chrome on the owner's "returns" database (read only): the
view tabs re-measured as 2026-09-26 (32 tall, corner 20, 6 / 12, 14/16.8 500; selected a 5% warm
wash in default ink, rest muted #7d, 1 apart). Hover, first captured (`notion--view-tab--hover`):
the same 5% wash, the ink stays muted, as Area's foreground-fixed rule. Notion's view tabs are
pills, Area's Segmented shape; Area's Tabs follow Notion's underline tabs (Share popover): in the
gallery 32 tall, 20 apart, 14/20 400, selected #28 over rest #66 with the 2px rounded indicator.
Type size matches (14); weight stays 400 by the type ramp (Notion 500). No change. Unverified:
dark theme.

## Verification

Compared the Notion and Figma tab captures above with 8 Area captures (`tabs/area--*`,
re-taken after the second pass) and Untitled UI source values. Build and test results are
in [the audit](../research/cohesion-audit.md#verification).

## Feedback log

- 2026-09-26 · cohesion audit → no change (neutral underline, fixed ink confirmed) → 7 Area captures.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → track
  `border-decorative` → `border-divider`; lg tile added; open question on tab padding and
  spacing → `notion--tabs-underline`, `notion--view-tab*`, `figma--tab*`, `figma--panel-tab*`.
- 2026-09-27 · third pass → open question settled, values kept: no tab padding, underline
  the tab's own width; the 20px gap recorded as unsourced → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
