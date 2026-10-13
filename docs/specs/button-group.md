# Button group spec

**Status:** accepted · 2026-09-26 (was: in review · 2026-09-26 (first pass under the capture workflow))
**Captures:** `docs/research/captures/button-group/` (pass-0 in `before/`); split references in
`../split-button/`
**Peers:** Button (every child), SplitButton (same joined edges and divider), Toolbar
(command groups with roving focus), Segmented (mutually exclusive modes)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): - [shadcn ButtonGroup](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/button-group.tsx)
  and [Untitled UI ButtonGroup](https://github.com/untitleduico/react/blob/main/components/base/button-group/button-group.tsx):
  connected full-size buttons, collapsed shared borders and only outside corners rounded.
  Area reuses Button typography, icons, state painting and focus behavior.
- 2026-09-26: build ButtonGroup and SplitButton either way (with the split button survey).
- 2026-09-26: accepted. Owner: "consider every component that you have built to be approved. if i havent given any feedback to change anything consider them approved."

## Job and boundaries

Joins related, independent Button actions into one shape. Each child stays a separate
button with its own name and Tab stop. Not Toolbar (roving focus, overflow), not Segmented
(one selected value), not SplitButton (a default action plus its menu).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | soft (default) | Quiet joined actions on a fill | shadcn secondary group with separator |
| variant | outline | Joined actions with a shared stroke | shadcn outline groups; Untitled button group |
| size | sm, md, lg | Button's scale | shadcn size examples (28/32/36) |
| composition | text; icon only; icon and label; toggle | One tile each, in soft and outline where both apply | Figma alignment commands (Toolbar in the product); shadcn icon and text groups |
| state | one button disabled; every button disabled | Tile "Disabled button" (the others stay usable). The disabled button gives up its divider and the enabled neighbour before it draws the seam at full strength (audit A-23 A, owner 2026-09-30); with every button disabled the group dims once as a whole, so overlapped edges aren't dimmed twice (audit H-26) (`button-group.css:83-103`) | shadcn disabled examples |

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| shadcn | design system (rendered) | Outline groups (shared borders), split with separator | ui.shadcn.com/docs/components/button-group, 2026-09-26 | `shadcn--group-*` (2), `../split-button/shadcn--*` |
| notion | target product | Split button divider (full-height inset line) | app.notion.com, 2026-09-26 | `../split-button/notion--split-*` |
| figma | target product | Present / Prototype view pair: 32 tall, 5px outer corners, square inner edges, 1px apart, transparent plates | figma.com editor, owner's session, 2026-09-28 | `figma--present-split-group--rest--light` |
| area | this system | Soft group before and after | localhost gallery | `before/area--group-soft-divider--before`, `area--group-soft-divider--rest` |

ChatGPT, Notion and Figma show no general button group outside toolbars and segmented
controls; Figma's alignment row is a Toolbar in Area.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| divider · height | **full height** (32 on md) | Notion split (inset line, full height); shadcn separator (full height inside borders) | Was 16px (8px in from top and bottom) |
| divider · paint | **`edge-control`** (226) | shadcn separator lab 90.95 (≈226); SplitButton soft/outline | Was `border-decorative` (243 on a 247 fill), barely visible. The seam counts as a control edge, a written exception to "a rule inside a container is never darker than its edge" (audit S8, owner) |
| outline divider | the shared border only | shadcn outline groups (inner border collapsed) | Was a second 16px line drawn over the shared border |
| children | Button unchanged (400 labels, 6px icon gap, no shadow); the group no longer sets a child's `--_gap` (button-group.css:26-38) | Button spec | Was the group's gap tier, 4 / 8 / 8, until audit S14 |
| peer · SplitButton soft | a neutral soft Split button paints as this group: `bg-component` fill, the quiet ink, no hairline, hover `bg-component-hover`, press `bg-component-active` (split-button.css:70-77); same `edge-control` divider | Audit S15b (owner) | Was two soft Buttons with body ink, a #f3 hairline and a translucent hover wash |

## Visual pass

2026-09-28, batch 11, gallery tiles (default soft, sm, lg, icon and label, toggle, disabled,
outline) beside Figma's Present / Prototype view pair in Claude in Chrome. Same construction:
outer corners only, square inner edges, one shape. Figma parts its ghost plates by 1px with no
drawn line (SplitButton's ghost icon tile already follows it); Area's soft group keeps Notion's
full-height divider in the control line and the outline group its shared border. Sizes step
cleanly (sm 28, lg 40 keep the same divider). No change.

## Verification

- `area--group-soft-divider`: divider 32px tall, `edge-control`; before 14px (8px insets) in
  `border-decorative`. Pass review (`GalleryReviewButtonGroup`) checked on screen at 1× and 3×.
- Unverified: dark theme, focus ring over the divider in every size.

## Motion and interaction, 2026-10-07

No group-level motion: every child is a Button and takes Button's rules (`button.md`, "Motion and
interaction, 2026-10-07"): hover, press and selected land instantly and fade out over
`duration-fast` `ease-out`; focus is an outline. The dividers are 1px pseudo-elements in layout
and never move. The selected child's `z-index: 1` changes at once.

Verified on `/button-group.html` (computed styles): no resting transforms; group and child heights
are whole pixels; selecting a child creates no transition, deselecting fades `background-color`
and `color` over 100ms.

## Feedback log

- 2026-09-28 · batch 11 Chrome side by side (Figma's Present pair) → no change; visual pass
  recorded → `figma--present-split-group--rest--light`.

- 2026-09-26 · owner: build ButtonGroup and SplitButton → divider aligned with SplitButton
  and the references.
- 2026-09-26 · owner: show more ButtonGroup variants → nine tiles: soft/outline × text, soft/outline × icon only, icon and label, toggle selected, small, large, disabled button.
- 2026-09-30 · audit S8 (owner) → the soft group's seam counts as a control edge and keeps #e2 (`edge-control`); a written exception to the inner-rule rule. No code change.
- 2026-09-30 · audit S14, S15b (owner) → children keep Button's own 6 icon gap; the group no longer overrides `--_gap` (button-group.css:26-38; was 4 / 8 / 8). A neutral soft Split button now paints as the soft group (split-button.css:70-77; peer row).
- 2026-10-01 · audit A-23 (owner pick A) → a disabled button's seam is drawn by the enabled neighbour at full strength (was ~75% under the dimmed button) → button-group.css:83-94.
- 2026-10-01 · audit H-26 → a group whose buttons are all disabled dims once as a whole (one disabled part still dims alone) → button-group.css:98-102.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → no group change; children inherit Button's instant-in, fast-out rule.
- 2026-10-12 · owner, 2026-10-12: "go with your recommendations" (consistency pass) → the solid neutral group's quiet ink reads `fg-quiet` (O5: one role for a literal written in several families; same paint). (docs/research/consistency-audit-2026-10-12.md)
