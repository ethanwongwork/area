# Badge group spec

**Status:** accepted · 2026-09-25 (first pass under the capture workflow)
**Captures:** `docs/research/captures/badge-group/`
**Peers:** Badge (items and the overflow), AvatarGroup (overflow as a member of the
group), Popover (overflow surface), Table and Card (host compositions)

## Owner decisions

- 2026-09-24 (moved from the Badge record): BadgeGroup is a separate layout family. Omit
  `visibleCount` to wrap all, set a number to cap the visible badges, or `auto` to fit the
  available width. Inline allows wrapping and overlay keeps one line; both use the same
  native overflow popover.
- 2026-09-25: Badge group is the next component after Badge and Indicator were accepted.

## Job and boundaries

Badge group lays out a set of badges with one gap and, when asked, collapses the ones that
do not fit behind a "+N" disclosure that lists them in a popover. It adds no badge paint of
its own; the overflow is a badge. Not Badge group: a filter bar of selectable choices
(ChipGroup), a list of people (AvatarGroup), a toolbar of actions (Toolbar).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| overflow | inline | Wrap onto more lines; the "+N" sits after the visible badges | Primer LabelGroup `overflowStyle="inline"` |
| overflow | overlay | Keep one line; the "+N" opens the rest | Primer LabelGroup `overflowStyle="overlay"` (its default) |
| visibleCount | none, number, auto | No truncation, a fixed cap, or fit to width | Primer `visibleChildCount` (same three) |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| primer | design system (rendered) | LabelGroup truncated after 5 labels, overflow opened | primer.style/product/components/label-group (2026-09-25). Source not pinned in this pass | MIT | `primer--group-truncated-5--expanded--light` |
| notion | target product | Multi-select tags would show group spacing | app.notion.com, logged in (Edge), 2026-09-25 | evidence only | none |
| area | this system | The four gallery tiles after this pass | localhost gallery | — | `area--group-*` (4) |

Target products searched without an equivalent:
- **Notion:** the owner's "tasks" board, "returns" and "july2+6" tables. No row holds more
  than one tag (no multi-select values), so tag-to-tag spacing could not be measured;
  creating values would change the owner's data.
- **ChatGPT, Figma:** no groups of badges in the surfaces searched for Badge (see
  [badge.md](badge.md#sources)); neither shows a "+N" badge overflow.

## Anatomy

```
primer LabelGroup (overlay)
shell     ul flex, gap 4, overflow hidden, one line       owns: gap, clipping
  item    li flex, min-height 28, centred                 owns: row height = the button's
    label span 20px pill, 12/12 500, 6px sides, 1px border
  action  li > button 28px invisible (small), 12px 500, 8px sides, 6px radius
overlay   dialog 12px radius, 8px padding, all labels, close button
```

```
area BadgeGroup
shell     div.area-badge-group flex, gap 4 (wraps unless overlay)   owns: gap
  item    span.area-badge-group__item inline-flex                    owns: nothing visual
  action  button.area-badge.area-badge-group__overflow-trigger      a Badge of the group's size
overlay   div.area-popover.area-badge-group__overflow-content        Popover surface, hidden items only
```

## Measurements

Generated with `node scripts/capture-compare.mjs` (Primer truncated group against Area's
overlay tile, after this pass):

| slot · property | primer · group-truncated-5 | area · group-overlay |
|---|---|---|
| **shell** size | 694 × 28 | 146.48 × 20 |
| **shell** gap (row / column) | 4px / 4px | 4px / 4px |
| **item** size | 37.47 × 28 | 64.58 × 20 |
| **action** size | 37.25 × 28 | 32.63 × 20 |
| **action** padding | 0 8 0 8 | 0 7 0 7 |
| **action** radius | 6px | 9999px |
| **action** font | 12px 500 (button) | 14px/20px 500 Geist |
| **action** color | rgb(37, 41, 46) | rgb(102, 102, 102) |
| **action** background | rgba(129, 139, 152, 0.15) (expanded) | rgb(247, 247, 247) |

The Area action padding is 7px plus the 1px border, the Badge md gutter of 8.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| shell · gap | 4 (both axes) | Primer 4 | — |
| action · shape and size | A neutral soft Badge at the group's size ("+N"; md 20 by default) | Peer: AvatarGroup renders its overflow as an avatar of the group's size | Primer uses a 28px invisible small button with 12px text. Beside 20px badges it made the row 28px tall and set the count smaller than the labels |
| action · size source | The first child's `size` prop | — | Groups mix sizes rarely; the first badge sets the row |
| action · ink | `fg-muted` (neutral Badge) | Badge spec | — |
| action · hover, focus | Badge link states: `_bg-hover` fill, focus ring; 24px (44px coarse) hit area | Badge | — |
| overlay · width | Content width (`max-content`), capped at the viewport less 32px | Owner decision (overflow lists the hidden badges) | Popover's 240px width overrode it and wrapped three badges onto two lines |
| overlay · inset, radius, shadow | Popover's (12px inset, container radius) | Popover (Complete) | Primer's overlay uses 8px; Area keeps its own popover surface |
| overlay · content | Hidden badges only | Owner decision (2026-09-24) | Primer lists every label plus a close button |

## States

| State | Changes | Evidence |
|---|---|---|
| overflow hidden | trigger `hidden` | all tiles |
| trigger hover | fill `bg-component-hover` | Badge link rule |
| trigger focus-visible | focus ring | Badge link rule; not captured |
| overlay open | native popover, focus moves into it; Escape and outside click close it and restore focus | native `popover="auto"` |

## Behavior and accessibility

The trigger is a native button with `aria-label="<overflowLabel>, N more"` and a
`popovertarget`. The overlay is `role="group"` with the same label and takes focus when
opened. `visibleCount="auto"` measures real items with a ResizeObserver and reserves the
trigger's width. Children are counted with `Children.toArray`, which does not flatten
fragments: pass badges as direct children or an array.

## Peers and consistency

| Peer | Shared role | Peer value | Badge group | Match |
|---|---|---|---|---|
| AvatarGroup | overflow | an avatar of the group's size | a badge of the group's size | match |
| Badge md | height | 20 | row 20 | match (was 28) |
| Popover | surface | 12px inset, container radius | same | match |

## Visual pass

Pass reviews were removed at the owner's request; the family is inspected in the grouped
gallery. The earlier before/after review showed the "+N" with the row outlined to show its
height (28 → 20), and the overflow content before and after (two lines → one). Gallery
measurements after: every group is 20px tall; the trigger is 32.6 × 20 with 14/20 500 text;
the open overlay is 254.4 × 44 with its three badges on one line.

2026-09-28 (batch 15): tags wrap with 4px row and column gaps, every group 20 tall, the "+N"
trigger on the same line; beside Notion's select tags (`../chip/notion--select-tag`, 20 tall,
corner 4) the tag geometry matches (Badge). Not validated: no product shows a group of tags in the
owner's workspace (Notion's tasks board has single tags per group header). Unverified: a Notion multi-select cell's tag gap
(no multi-select was reachable in the owner's workspace), dark theme.

## Verification

- 1 Primer capture and 4 Area captures, checksums verified.
- `npm run build:docs` (docs audit), `test:badge` (9), `typecheck`, `test:contracts` (14),
  `test:preview` (4), `scripts/validate-badge.mjs` (80 Badge captures, 0 failing): all pass.
- Unverified: keyboard focus ring on the trigger (not reached with the real Tab key in
  this pass), dark theme, Notion multi-select spacing (no data), Primer source at a
  pinned commit.

## Feedback log

- 2026-09-25 · owner chose Badge group as the next component → first pass: badge-shaped
  overflow at the group's size, overlay at content width → 4 Area captures.
- 2026-09-25 · owner approved Badge group; no further variants (removable or keyboard-navigable
  tag groups belong to Chip; end alignment is a wrapper; Primer's in-place expansion was
  declined by the 2026-09-24 decision) → Complete in `component-status.mjs`.
- 2026-09-27 · third pass → Pass review note replaced: the family is inspected in the grouped
  gallery → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
