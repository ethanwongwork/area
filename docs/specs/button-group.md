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
| state | one button disabled | Tile "Disabled button" (the others stay usable) | shadcn disabled examples |

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| shadcn | design system (rendered) | Outline groups (shared borders), split with separator | ui.shadcn.com/docs/components/button-group, 2026-09-26 | `shadcn--group-*` (2), `../split-button/shadcn--*` |
| notion | target product | Split button divider (full-height inset line) | app.notion.com, 2026-09-26 | `../split-button/notion--split-*` |
| area | this system | Soft group before and after | localhost gallery | `before/area--group-soft-divider--before`, `area--group-soft-divider--rest` |

ChatGPT, Notion and Figma show no general button group outside toolbars and segmented
controls; Figma's alignment row is a Toolbar in Area.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| divider · height | **full height** (32 on md) | Notion split (inset line, full height); shadcn separator (full height inside borders) | Was 16px (8px in from top and bottom) |
| divider · paint | **`edge-control`** (226) | shadcn separator lab 90.95 (≈226); SplitButton soft/outline | Was `border-decorative` (243 on a 247 fill), barely visible |
| outline divider | the shared border only | shadcn outline groups (inner border collapsed) | Was a second 16px line drawn over the shared border |
| children | Button unchanged (400 labels, 6px icon gap, no shadow) | Button spec | — |

## Verification

- `area--group-soft-divider`: divider 32px tall, `edge-control`; before 14px (8px insets) in
  `border-decorative`. Pass review (`GalleryReviewButtonGroup`) checked on screen at 1× and 3×.
- Unverified: dark theme, focus ring over the divider in every size.

## Feedback log

- 2026-09-26 · owner: build ButtonGroup and SplitButton → divider aligned with SplitButton
  and the references.
- 2026-09-26 · owner: show more ButtonGroup variants → nine tiles: soft/outline × text, soft/outline × icon only, icon and label, toggle selected, small, large, disabled button.
