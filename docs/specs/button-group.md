# Button group spec

**Status:** in review · 2026-09-26 (cohesion audit; second pass the same day)
**Captures:** `docs/research/captures/button-group/` (Area tiles, `notion--split-button`, `figma--align-group`)
**Peers:** Button (the joined items), Toolbar (a row of separate commands), Segmented (an exclusive choice in a track), InputGroup (joined field shell), Separator (divider role)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)):
  [shadcn ButtonGroup](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/button-group.tsx)
  and [Untitled UI ButtonGroup](https://github.com/untitleduico/react/blob/main/components/base/button-group/button-group.tsx):
  connected full-size buttons, collapsed shared borders and only outside corners rounded.
  Area reuses Button typography, icons, state painting and focus behavior.
- 2026-09-26: **Neutral by default, accent by override** (DESIGN_SYSTEM.md). The group paints
  neutral fills only; a toggled Button inside it shows the neutral selected fill.
- 2026-09-26 (second pass): decide every open item with the most calculated option
  consistent with the system. For ButtonGroup: the item divider takes the new
  `border-divider` role (audit decision 7).

## Job and boundaries

ButtonGroup joins related, independent Button actions at their shared edges. Each Button
keeps its own tab stop, name and state. An exclusive value choice is Segmented; a command row
with one tab stop and arrow keys is Toolbar.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | soft (default), outline | Filled joined strip, or a bordered one on a surface | Figma align group (soft, `figma--align-group`); Untitled (bordered), shadcn (outline) |
| size | sm 28, md 32 (default), lg 40 | Matches Button tiers | Notion split button 28, Figma align group 24; Untitled 36 / 40 / 44 |
| composition | icon commands; text and toggle | Gallery `commands`, `text` | Figma align group (three icon commands); Notion split button (label + chevron) |

Excluded: vertical orientation (no product or source use recorded).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | Primary split button: a label part and a chevron part joined on one blue fill | app.notion.com, owner's workspace, light, read-only, 2026-09-26 | evidence only | `notion--split-button--rest--light` |
| figma | target product (primary for inspector controls) | Editor inspector alignment row: three joined icon buttons (`segmented_button` root) | figma.com editor, light, read-only, 2026-09-26 | evidence only | `figma--align-group--rest--light` |
| figma | target product | Paint-type radios: 24px cells, 4px apart (separate, not joined) | earlier ColorPicker pass | evidence only | `color-picker/figma--paint-type-row--rest--light` |
| uui | design system (source) | ButtonGroup | `untitleduico/react@4702dc0`, `components/base/button-group/button-group.tsx:16-99` ([reference](../research/untitled-ui-reference.md)) | MIT | none |
| shadcn | design system (source) | ButtonGroup composition | link above (prior decision) | MIT | none |
| area | this system | Gallery tiles, re-taken after the second pass | localhost gallery | — | `button-group/area--{commands,text,variant-outline,sizes}--rest--light` |

ChatGPT: no joined button group found in the captured surfaces (header, sidebar, settings).

## Anatomy

```
notion  div 69 × 28, radius 6 on the wrapper
  main  div 45 × 28, radius 6 on the start side, blue fill, label 500
  more  div 24 × 28, radius 6 on the end side, same fill; seam = inset 1px 0 0 rgba(28,19,1,.11), full height
figma   div 88 × 24, flex, 1px gap
  item  button 28.66 × 24, rgb(245) fill, radius 5 on the outer ends only; icon svg 24 × 24
uui     div, items overlap 1px, outer radius 8; selected = hover paint (neutral-50)
area    div.area-button-group[role=group]  owns: tier, fill and edge for its Buttons, isolation
  item  .area-button  (height, icon, text, gap, radius, bg and border from the group)
        not-first: start radii 0, margin-inline-start −1px (button-group.css:34-38)
        not-last: end radii 0 (button-group.css:39)
        ::before divider, 1px, full height (inset-block 0), border-divider (button-group.css:40-47)
```

The −1px margin collapses two 1px borders into one seam; it is structural (shared border),
not an optical nudge.

## Measurements

`node scripts/capture-compare.mjs` shell plus the item nodes read from the same files:

| slot · property | area · commands (soft) | area · text (outline) | notion · split-button | figma · align-group |
|---|---|---|---|---|
| **shell** size | 94 × 32 | 111.22 × 32 | 69.32 × 27.99 | 88 × 24 |
| item · size | 32 × 32 (x 0, 31, 62) | 52.15 × 32, 60.07 × 32 | 45.33 × 27.99 + 23.99 × 27.99 | 28.66 × 24 (x 0, 29.66, 59.34) |
| item · background | rgb(247, 247, 247) | rgb(255, 255, 255) | rgb(39, 131, 222) | rgb(245, 245, 245) |
| item · outer radius | 8px at the two outer ends | 8px at the two outer ends | 6px | 5px |
| item · icon / label | 16 × 16 at 8px | label at 11.02 from the start | chevron 16 × 16 | 24 × 24 svg |
| seam | `::before` 1 × 14, 8px from top and bottom, rgb(226, 226, 226) (before the third pass; now full height) | same | inset 1px rgba(28, 19, 1, 0.11), full height | 1px gap, full height |

`area--sizes` shows the sm tier: 28 × 28 items, radius 6, 16px icons at 6px. The outline edge
is `edge-control` (#e2e2e2 at standard contrast, `button-group.css:16`).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| structure | joined items, shared borders, outer corners only | Owner (prior decision); Notion and Figma both round only the outer ends | — |
| tier | Button tiers 28 / 32 / 40, radius 6 / 8 / 10 (`button-group.css:17-19`) | Peer: Button | Notion 28, Figma 24; density is the UI-scale axis (audit decision 18) |
| soft fill | `bg-component` light-dark(#f7f7f7, #282828), no edge (`button-group.css:15`) | Peer: Button soft; Figma rgb(245) | Area one step lighter than Figma |
| outline | `bg-surface` + `edge-control` (`button-group.css:16`) | Peer: Button outline | — |
| divider | **1px `border-divider` #e2e2e2, full height** (`inset-block: 0`, `button-group.css:40-47`) | Second pass: rules between content take the divider role (Figma #e6, ChatGPT #e6; Notion's rules 7%, #f0) | Was `border-decorative` #f3, which vanished beside an #f3 hover plate. Length: was inset 8px at each end; full height since the third pass (Notion split button, Figma align group) |
| item hover | the item Button's own hover (neutral ghost → `bg-component-hover` #f3) | Peer: Button | — |
| item selected | Button's selected fill (`button.css:384-392`), raised with z-index (`button-group.css:48`); the group fill applies to unselected items only (`button-group.css:33`) | Peer: Button | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover | item fill → Button hover | not captured |
| focus-visible | item's focus ring, item raised (`z-index: 1`, `button-group.css:48`) | not captured |
| selected | Button's selected fill, raised | fixed in the cohesion audit: the group rule was the same specificity as `.area-button[data-selected]` and loaded later, so a pressed toggle kept the group fill; the group fill is now `:not([data-selected])` (`button-group.css:31-33`) |
| disabled | item at 50% (Button) | not captured |

## Behavior and accessibility

`div role="group"` with a consumer `aria-label` (`ButtonGroup.tsx:14`); ref and native props
forwarded. No roving focus: every Button is its own tab stop. Toggle semantics come from
Button's `aria-pressed`. RTL: logical radii and margins.

## Peers and consistency

| Peer | Shared role | Area value in peer | Button group | Match / reason |
|---|---|---|---|---|
| Button | height, radius, type, icon, hover | tier tokens | same tokens via `--_group-*` | match |
| Toolbar, Separator | divider paint | `border-divider` | `border-divider` | match (second pass) |
| Toolbar | command row | separate 32px buttons, 2px apart | joined, 0 gap | different job (joined actions vs command row) |
| Segmented | selected item | raised surface item in a track | Button selected fill | differs by design; Segmented is exclusive |
| InputGroup | joined shell | one focus shell | per-item focus | different job |

## Visual pass

The gallery shows the tiles in named groups: Default (`commands`), Variants
(`variant-outline`), Sizes and Content (`text`). Beside Figma's align group, Area's soft strip reads
the same (flat fill, outer corners only) with a drawn divider where Figma leaves a white gap.
Not inspected by this spec's author: hover, focus and the pressed toggle in the browser, and
dark theme.

## Settled questions

1. **Seam length: changed to full height** (`inset-block: 0`, `button-group.css:44-45`). Both
   products run the seam the full height of the item: Notion as an inset 1px line on the
   fill (`notion--split-button`), Figma as a 1px gap between cells (`figma--align-group`).
   Area inset its divider 8px at each end until the third pass ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)).

## Verification

Compared `button-group/area--{commands,text,variant-outline,sizes}` (shell, item and pseudo
nodes) with `notion--split-button` and `figma--align-group`. Build and test results are in
[the audit](../research/cohesion-audit.md#verification).

## Feedback log

- 2026-09-26 · cohesion audit → no change; spec written; selected-in-group paint defect
  recorded → `button-group/area--*` (2) and a live computed-style check.
- 2026-09-26 · cohesion audit, spec defects → group fill applies to unselected items only, so
  a pressed toggle keeps Button's selected fill → `button-group.css:31-33`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → divider
  `border-decorative` → `border-divider`; outline and sizes tiles added; seam length recorded
  as open → `notion--split-button`, `figma--align-group`, `area--{commands,sizes}`.
- 2026-09-27 · third pass → seam runs the full height (was inset 8px top and bottom) →
  [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
