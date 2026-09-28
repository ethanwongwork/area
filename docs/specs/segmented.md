# Segmented spec

**Status:** in review · 2026-09-26 (cohesion audit; second pass the same day)
**Captures:** `docs/research/captures/segmented/` (Area tiles, `figma--panel-tabs`, `figma--view-toggle`), `baseline/chatgpt--segmented--*`, `toolbar/figma--bottom-toolbar` (mode switch), `tabs/figma--*` and `tabs/notion--view-tab*` (comparisons)
**Peers:** Tabs (views, underline; same ink pair), Chip (long sets), Button (labels on fills), AlignmentPicker (track with translucent hover), Toolbar / Button group

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Segmented iconOnly
  keeps option labels accessible while using square inner buttons.
- 2026-09-26: **Neutral by default, accent by override** (DESIGN_SYSTEM.md). The selected
  option is a neutral raised surface; Segmented has no accent tone.
- 2026-09-26 (second pass): decide every open item with the most calculated option
  consistent with the system. For Segmented: unselected options take the muted ink, as
  ChatGPT and Figma do, fixed on hover (audit decisions 2 and 16); the dark translucent
  hover is solved against the dark page (decision 1).

## Job and boundaries

Segmented picks one value from a small set laid out in one track and marks it with a raised
fill. Views are Tabs (underline); a set too long for one track is Chip; independent
commands are Toolbar or Button group.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm 28, md 32 (default), lg 40 | Outer height is the control tier (`segmented.css:17-22`) | ChatGPT 36; Figma 32 (toolbar mode switch), 24 (view toggle) |
| layout | `fullWidth` | Align with a field's edge on a panel row | ChatGPT options share the width equally (112 + 112) |
| composition | text, icon + text, `iconOnly` | Inspector alignment choices | Figma view toggle and toolbar mode switch (icon only) |
| state | selected, disabled option | — | Gallery `disabled` |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | Chat / Work control, rest and with the pointer over the unselected option | owner's session, 2026-09-26 | evidence only | `baseline/chatgpt--segmented--{rest,hover}--light` |
| figma | target product (primary for inspector controls) | Icon view toggle (two radios on a track); editor toolbar mode switch (four radios); inspector panel tabs (trackless, two options) | figma.com file browser and editor, light, read-only, 2026-09-26 | evidence only | `figma--view-toggle--rest--light`, `toolbar/figma--bottom-toolbar--rest--light`, `figma--panel-tabs--rest--light`, `tabs/figma--panel-tab--{rest,hover}--light` |
| figma | target product | Paint-type radios: 24px icon cells, 4px apart, no track | earlier ColorPicker pass | evidence only | `color-picker/figma--paint-type-row--rest--light` |
| notion | target product | Database view tabs: pill options, selected by a 5% warm fill, one weight | app.notion.com, owner's workspace (database views), 2026-09-26 | evidence only | `tabs/notion--view-tab--rest--light`, `tabs/notion--view-tab-selected--rest--light` |
| uui | design system | No segmented control; button tabs with a bordered track are nearest | [reference](../research/untitled-ui-reference.md) | MIT | none |
| area | this system | Gallery tiles, re-taken after the second pass | localhost gallery | — | `segmented/area--*` (8) |

Notion has no segmented track in the captured surfaces (page menu, Share popover, board,
table); its view tabs are the nearest set and belong to Tabs.

## Anatomy

```
chatgpt  div grid 224×36, radius 9999
  track  span inset 1px, rgba(13,13,13,.03)
  thumb  span white, 0 1px 6px 5%, 121×37 (overhangs 0.5px)
  option button 112×36, 14/20 500; unselected rgb(93)
figma    fieldset 48×24 (view toggle): track rgb(245), radius 5, no inset
  option span 24×24, radius 5; selected white + inset 1px rgb(230); glyph 12px, unselected 50% black
figma    fieldset 122×32 (toolbar mode): rgb(245), radius 5, 2px padding, 2px gap
  option div 28×28, radius 3; selected white, 0 0 0.5px 30% + 0 1px 3px 15%
area     div.area-segmented[role=radiogroup]  owns: tier height, 2px inset, track fill, inset 1px ring, radius
  item   button.area-segmented__item[role=radio]  owns: item height (tier − 4), 1px border, radius, fill, lift
    icon  span 16px square
    label span (area-sr-only when iconOnly)
```

Inset equation: item 28 = 32 − 2 × 2 inset; item padding (28 − 9.94 cap) / 2 − 1 border =
8.03 (`inset.css:43`); label starts 2 + 1 + 8.03 = 11.03 from the track edge (captured
11.02). Track radius min(`radius-control` 8 + 2, 32 × 0.4) = 10; item radius min(8, 28 × 0.4)
= 8. Figma's mode switch is the same construction at radius 5 / 3.

## Measurements

`node scripts/capture-compare.mjs --slots shell` plus item nodes:

| slot · property | area · size-medium | area · icon-only | chatgpt · segmented | figma · view-toggle | figma · toolbar mode switch | figma · panel-tabs |
|---|---|---|---|---|---|---|
| **shell** size | 95.57 × 32 | 92 × 32 | 224 × 36 | 48 × 24 | 122 × 32 | 125.77 × 24 |
| **shell** padding / gap | 2 / 2 | 2 / 2 | 0 / 0 | 0 / 0 | 2 / 2 | 0 / 4 |
| **shell** radius | 10px | 10px | 9999px | 5px (track) | 5px | — (no track) |
| **shell** background | rgb(247, 247, 247) + inset 1px rgb(243, 243, 243) | same | rgba(13, 13, 13, 0.03) | rgb(245, 245, 245) | rgb(245, 245, 245) | — |
| item · size / radius | 44.73 × 28 / 8px | 28 × 28 / 8px | 112 × 36 / pill | 24 × 24 / 5px | 28 × 28 / 3px | 53.02 × 24 / 5px |
| item · font | 14px/20px 500 | — | 14px/20px 500 | — | — | 11px/16px 550 selected, 450 unselected |
| item · selected | white, 1px #e2e2e2, `shadow-1` | same | white thumb, 0 1px 6px 5% | white, inset 1px rgb(230) | white, 0 0 0.5px 30%, 0 1px 3px 15% | rgb(245) fill |
| item · unselected ink | rgb(102, 102, 102) | rgb(102, 102, 102) | rgb(93, 93, 93) | 50% black glyph | not recorded | rgba(0, 0, 0, 0.5) |

`area--size-small` 82.78 × 28 (12/16 500), `area--size-large` 111.57 × 40. Figma's panel tabs
keep a hidden 550 copy of each label (`opacity 0`) so the width does not change on selection.
In `chatgpt--segmented--hover` the hovered unselected option records no ink of its own and
inherits rgb(13, 13, 13): ChatGPT darkens the label under the pointer. Figma's hovered panel
tab keeps its 50% ink and gains an rgb(245) plate (`tabs/figma--panel-tab--hover`).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| item · weight | 500 for every option (`segmented.css:76-78, 94`) | ChatGPT and Notion view tabs keep one 500 weight; weight policy (labels on fills) | Figma switches 450 → 550 and reserves the bold width; one weight needs no reserve |
| item · unselected ink | **`fg-muted` rgb(102)** (`segmented.css:70-72`) | Target-product agreement: ChatGPT rgb(93), Figma 50% black, Notion view tabs rgb(125, 122, 117) | Was `fg-default` (second pass, decision 2) |
| item · selected ink | `fg-default` rgb(40) (`segmented.css:96`) | Two-ink rule: selected default, unselected muted (DESIGN_SYSTEM.md, Shared state paint) | — |
| item · hover ink | fixed | Area rule: foreground fixed on hover; Figma panel tab keeps its ink | ChatGPT darkens 93 → 13 (decision 16) |
| item · hover fill | `bg-hover` light-dark(#1414140d, #fcfcfc24) (`segmented.css:84-86`) | Audit rule: translucent hover on a track | Dark value was 20% white; now 14%, solved against the dark page rung (decision 1) |
| track · height | tier 28 / 32 / 40 | Control tier; decision 18 | ChatGPT 36; Figma 32 / 24 |
| track · inset / gap | 2 / 2 (`segmented.css:31, 42`) | Figma toolbar mode switch 2 / 2 | ChatGPT's thumb fills the track; Figma's view toggle has no inset |
| track · radius | concentric 10 | Radius rule; Figma 5 / 3 is concentric too | ChatGPT is a pill; Area keeps the pill for Chip |
| track · paint | `bg-subtle` #f7f7f7 + inset 1px `border-decorative` #f3 (`segmented.css:53-54`) | ChatGPT 3% ink (about rgb 248); Figma rgb(245) | The ring adds definition on white |
| selected · paint | `bg-surface` + 1px `edge-selected` (#e2 standard) + `shadow-1` (`segmented.css:93-99`) | Figma view toggle: white + 1px rgb(230) ring; ChatGPT and Figma mode switch: white + soft shadow | Area carries both the hairline and a light shadow |
| icon-only item | square, item height (`segmented.css:29, 125-128`) | Owner (prior decision); Figma square cells (24 and 28) | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover (unselected) | `bg-hover` plate; ink fixed | not captured for Area; `tabs/figma--panel-tab--hover` |
| selected | surface, edge, `shadow-1`, default ink; weight unchanged | all `area--*` |
| focus-visible | 2px focus ring, 2px offset (`segmented.css:101-104`); forced colours Highlight | not captured |
| disabled option | 50% (`segmented.css:106-109`) | `area--disabled` item opacity 0.5, muted ink |

## Behavior and accessibility

`role="radiogroup"` named by `label`; options are `button role="radio"` with `aria-checked`
and a roving tab stop (`primitives.tsx:980-1030`). Arrow keys (RTL-aware), Home and End move
and select, skipping disabled options. Icon-only labels stay in `area-sr-only`. Forced
colours paint the selected item Highlight (`forced-colors.css:21-26`). Figma's view toggle
and mode switch are native radios in a `fieldset` with a hidden legend: the same semantics.

## Peers and consistency

| Peer | Shared role | Area value in peer | Segmented | Match / reason |
|---|---|---|---|---|
| Tabs | unselected / selected ink | `fg-muted` / `fg-default` | same | match (second pass) |
| Button | label on a fill | 14/20 500 | 14/20 500 | match |
| AlignmentPicker | hover on its own track | `bg-hover` | `bg-hover` | match |
| Toolbar | mode switch inside a bar | — | 2 / 2 construction | Figma's toolbar switch matches it |
| Chip | selection | `bg-component-active` + hover edge | raised surface | differ by design (track vs free set) |

## Visual pass

The gallery shows the tiles in named groups: Default, Sizes, Layout (`full-width`,
`icon-only`), Content (`icons`) and States (`disabled`). Beside Figma's view toggle and
toolbar mode switch the construction is the same (flat track, white raised item, square
icon cells); Area's track is rounder and carries a faint ring. Not inspected by this spec's
author: hover in the browser, dark theme (selected #1d1d1d on a #282828 track).

2026-09-27 (Claude in Chrome, side by side): ChatGPT's Chat / Work switch and Figma's mode
switch against the gallery's Default tile and the Toolbar's mode and alignment controls. Same
structure in all three (groove, 2px inset, the chosen option raised on the surface, the others
muted). ChatGPT rounds the whole control to a pill; Area follows the control radius. Area's
chosen option keeps a 1px selected edge where Figma relies on shadow alone.

## Verification

Compared `segmented/area--{size-small,size-medium,size-large,icon-only,default,disabled}` with
`baseline/chatgpt--segmented--{rest,hover}`, `figma--view-toggle`, `figma--panel-tabs`,
`tabs/figma--panel-tab--hover`, `tabs/notion--view-tab*` and the mode switch in
`toolbar/figma--bottom-toolbar`. Build and test results are in
[the audit](../research/cohesion-audit.md#verification). Unverified: hover and focus
captures, dark theme.

## Feedback log

- 2026-09-26 · cohesion audit → one 500 weight for every option (was 400 / 500 selected) →
  `baseline/chatgpt--segmented--rest`; 8 Area captures.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → unselected ink
  `fg-default` → `fg-muted`, fixed on hover; dark `bg-hover` 20% → 14% white →
  `figma--view-toggle`, `figma--panel-tabs`, `toolbar/figma--bottom-toolbar`,
  `tabs/notion--view-tab*`, `segmented/area--*`.
- 2026-09-27 · owner (Toolbar): "shouldn't that be a segmented control?" → the toolbar's track
  group is gone; Toolbar hosts a real Segmented. Inside a Toolbar its options leave the Tab order
  and join the toolbar's arrows (WAI-ARIA toolbar with a radio group; Space or Enter chooses).
  Side by side in Claude in Chrome with ChatGPT's Chat / Work switch (2px inset, a raised white
  option, muted unselected label: same structure; ChatGPT is a pill with no track hairline) and
  Figma's mode switch (same; Figma draws no stroke on the chosen option, Area keeps its selected
  edge as the owner asked for strokes).
