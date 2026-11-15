# Badge group spec

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
| notion | target product | Multi-select cells in a table view (3 tags wrapping to two lines; 11 tags) on a public Notion page, since the owner's workspace has no multi-select | thomasfrank.notion.site "Count multi-select tags", Claude in Chrome, 2026-09-28 | evidence only | `notion--multi-select-wrap--rest--light`, `notion--multi-select-many--rest--light` |
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
shell     div.area-badge-group flex, gap 6 / 8 (wraps unless overlay)  owns: gap
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
| shell · gap | **6 between lines, 8 between badges** (the overflow Popover the same) | Notion multi-select cell: row 6, column 8, set as flex gaps; two lines of 20px tags 46 tall (`notion--multi-select-wrap`) | Was Primer's 4 both ways; the target product outranks the design system |
| action · shape and size | A neutral soft Badge at the group's size ("+N"; md 20 by default) | Peer: AvatarGroup renders its overflow as an avatar of the group's size | Primer uses a 28px invisible small button with 12px text. Beside 20px badges it made the row 28px tall and set the count smaller than the labels |
| action · size source | The first child's `size` prop | — | Groups mix sizes rarely; the first badge sets the row |
| action · ink | `fg-muted` (neutral Badge) | Badge spec | — |
| action · hover, focus | Badge link states: `_bg-hover` fill, focus ring; 24px (44px coarse) hit area | Badge | — |
| overlay · width | Content width (`max-content`), capped at the viewport less 16px (the engine's 8 each side) | Owner decision (overflow lists the hidden badges) | Popover's 240px width overrode it and wrapped three badges onto two lines. Was less 32 |
| overlay · placement | **8** under the "+N" badge, starting at its start edge, flips and shifts inside the viewport; scrolls past the room on its side; the shared engine `useAnchoredPosition` (BadgeGroup.tsx) | overlay.md popover gap; audit S16 and H-10 (owner 2026-09-30) | Was CSS anchor positioning 4 below, centred in the viewport where anchors are unsupported |
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

2026-10-27 (desktop app, the Stage at 100%, 2x): the Auto tile flashed its hidden badges over the visible ones. Auto-fit
measures the hidden badges by giving the closed popover a visible style for a moment; restoring the closed style ran
the popover's close transition (opacity, display), so they showed and faded, and the size change re-fired the
ResizeObserver, so it looped every few hundred milliseconds. The restore now runs with the transition off
(BadgeGroup.tsx); the popover stays at display none with no running animations, and opens and closes as before.

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

2026-09-28, live in Claude in Chrome: Notion's multi-select cell (public page, see Sources) beside
the gallery. Tags match Badge md (20 tall, corner 4, 6 sides); the spacing did not: Notion sets 8
between tags and 6 between wrapped lines, Area 4 and 4. Changed to 6 / 8; the wrap tile is now 46
tall, as Notion's two-line cell. The "+N" trigger keeps the column gap.

## Verification

- 1 Primer capture and 4 Area captures, checksums verified.
- `npm run build:docs` (docs audit), `test:badge` (9), `typecheck`, `test:contracts` (14),
  `test:preview` (4), `scripts/validate-badge.mjs` (80 Badge captures, 0 failing): all pass.
- Unverified: keyboard focus ring on the trigger (not reached with the real Tab key in
  this pass), dark theme, Primer source at a pinned commit.
- 2026-09-28: 2 Notion captures (public page, redacted) and the 4 Area captures retaken after
  the gap change; checksums verified. The wrap tile is 46 tall, as Notion's two-line cell.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Research: `docs/research/motion-2026-10-07/crispness-and-current-state.md`.


The overflow trigger is a `button.area-badge`, so it takes Badge's hover (instant in, `fast` out).
The overflow popover enters and leaves on the shared overlay rules (`surface.css`, not owned here).
No group-specific motion was added: badges do not animate when they move into or out of the
overflow (they are measured and re-rendered; a reflow animation would lag the resize).

## Feedback log

- 2026-09-25 · owner chose Badge group as the next component → first pass: badge-shaped
  overflow at the group's size, overlay at content width → 4 Area captures.
- 2026-09-25 · owner approved Badge group; no further variants (removable or keyboard-navigable
  tag groups belong to Chip; end alignment is a wrapper; Primer's in-place expansion was
  declined by the 2026-09-24 decision) → Complete in `component-status.mjs`.
- 2026-09-27 · third pass → Pass review note replaced: the family is inspected in the grouped
  gallery → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-28 · owner: "do claude chrome for badge group" → the owner's workspace has no
  multi-select (sidebar databases scanned read-only), so a public Notion page was measured:
  multi-select tags 20 tall, corner 4, 6 sides (Badge md matches), flex gaps 6 between lines and
  8 between tags. Area's group gap 4 / 4 (Primer) → 6 / 8, in the group and its overflow
  Popover. Back to In review.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → the overflow trigger takes Badge's hover recipe; popover motion is the shared overlay's; no change here.
- 2026-10-14 · all-axis audit → `visibleCount="auto"` measured hidden badges inside the overflow popover, whose text styles made them 1.5px narrower than in the group at type 12 / Compact; the fitted count flipped between two answers until React stopped it ("Maximum update depth exceeded"). The measuring pass now unsets the popover's styles (`all: unset`), so every badge measures in the group's context → BadgeGroup.tsx.

## Review note, 2026-10-27 (round 80)

- **What changed:** an Auto badge group no longer flickers: the badges it hides stay hidden until you open "+2".
- **Why:** measuring the hidden badges set off the overflow popover's close fade each time, and the fade itself made the
  group measure again, so the hidden badges kept flashing over the visible ones.

## One mark, 2026-11-13

Plan B5.1: the marks it holds (Badge) are on the shared mark recipe (inset.css, "One mark"); nothing in this family changed. Badges keep their heights at Compact now that the ladder no longer shrinks md (18 at type 13).
