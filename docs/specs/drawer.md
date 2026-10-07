# Drawer spec

**Status:** in review · 2026-10-05 (built; Review page batch "New components, batch 1")
**Captures:** `docs/research/captures/drawer/`: `shadcn--sheet-right--open--light`,
`shadcn--sheet-overlay--open--light` (Claude in Chrome, 2026-10-06, viewport 1504 × 719),
`area--drawer-sm--open--light`, `area--drawer-stacked--rest--light`.
**Peers:** Dialog (header, body, footer, close, native modal, scrim), Panel (a docked side
surface, not modal), Popover

## Owner decisions

- 2026-10-04: batch 1 (owner pick): "An edge sheet"; reuses Dialog, Button.
- 2026-10-05: owner: "then build drawer".

## Job and boundaries

A panel that slides in from an edge of the screen over a scrim, for a task beside the page (edit a
record, settings, filters). Modal. Not Dialog (centred, short), not Panel (docked in the layout,
not modal), not Notion's side peek as such (a non-modal page view; see Open questions).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| side | end (default), start, bottom | shadcn's Sheet sides (right, left, bottom; top dropped: no product use) | shadcn docs |
| size | sm 384 (default), md 480 | shadcn's max-w-sm; Dialog's width | shadcn; Area Dialog |
| composition | close control (default on), footer | Dialog's | — |
| layout | actions `row` (default, Dialog's) or `stacked` (full width, primary first, 8 apart) | owner 2026-10-06 ("could be a variant"); shadcn's Sheet stacks | shadcn |
| behavior | `modal` (default) or `modal={false}`: no scrim, page usable, a manual popover in the top layer | owner 2026-10-06 ("up to you"): Notion's side peek is non-modal | Notion (behaviour; not captured) |

## Sources

| Id | Type | What | Where | Captures |
|---|---|---|---|---|
| shadcn | design system (rendered) | Sheet, right side, "Edit profile" demo | ui.shadcn.com/docs/components/base/sheet, 2026-10-05 (built-in browser) and 2026-10-06 (Claude in Chrome) | `shadcn--sheet-right--open--light`, `shadcn--sheet-overlay--open--light` |
| notion | target product | Side peek | not captured: the owner's database opens pages in a centre peek; switching it is a view setting | — |

## Measurements (shadcn Sheet, right, viewport 1094 × 798)

| Slot · property | shadcn | Area |
|---|---|---|
| surface | x 710, 384 × 798 (full height, flush right), white, 1px left border #e5, shadow 0 10 15 −3 / 0 4 6 −4 at 10% | the same box at the same viewport (verified live), Area surface fill, 1px `border-float` on the inner edge, float lift |
| header | padding 16, title 16/24 500, description 14/20 muted, 2 apart | Dialog's: 16 inset, 16/24 strong, 14/20 muted, 4 apart |
| body | 16 sides, fields 24 apart | Dialog's body (scrolls), 16 inset |
| footer | padding 16, buttons stacked full width, 8 apart | Dialog's footer: end-aligned row |
| close | 28 ghost at 12 / 12, radius 8, 16 icon | Dialog's close: md ghost at 8 / 8 (icon on the 16 inset) |
| overlay | 10% black, 4px blur, 150ms fade; panel 200ms | Dialog's scrim (13%), `duration-base` slide and fade |

`node scripts/capture-compare.mjs` (shadcn vs `area--drawer-sm--open--light`): shell 384 wide both,
1px inline-start edge both (shadcn #e5, Area `border-float` #f3), content 16 from the edge both
(shadcn header padding 16; Area border 1 + padding 15), title 16/24 500 both, description 14/20 both,
section gap 16 both. Area's title sits 11 from the top (centred on the 32 close, Dialog's rule)
where shadcn's is 16 under a 28 close at 12 / 12. Shadow: shadcn 0 10 15 −3 / 0 4 6 −4 at 10%;
Area's float lift 0 20 24 at 6% / 0 5 8 at 3%.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| width | 384 sm / 480 md | shadcn; Dialog | — |
| edge | inner-edge 1px `border-float`, no radius against the screen edge; bottom: top corners `radius-container` | shadcn (flush, 1px edge) | — |
| anatomy, insets, type, close | Dialog's | Peer: Dialog (accepted) | shadcn close at 12 and stacked footer |
| scrim | Dialog's | Peer: Dialog | shadcn 10% + blur |
| motion | slide from the edge + scrim fade, `duration-base`, none under reduced motion | Dialog's motion tokens | shadcn 200ms |

## Behavior and accessibility

Native modal `<dialog>` (focus trapped, Escape closes, focus returns to the trigger, page behind
inert and unscrollable), named by the title and described by the description; a press that starts
and ends on the scrim closes it. `start`/`end` follow the writing direction. `inline` renders the
surface in place for documentation.

## Verification

Builds, parity, typecheck and tests pass. Browser: opens as `:modal` at 710 / 384 × 798 in a 1094 ×
798 viewport (shadcn's exact box), focus on Close; Escape closes and returns focus to "Open drawer".
Unverified: dark, compact, RTL, screen reader, the exit slide on browsers without
`transition-behavior`.

## Settled questions

1. **Non-modal: a mode on Drawer** (owner: "up to you"). Notion's side peek is the primary content
   product's drawer and it leaves the page usable; Panel is docked in the layout and doesn't slide
   over it, so the mode belongs here. `modal={false}` renders a manual popover (top layer, no
   scrim, page not inert), moves focus to its first control, closes on Escape or the close control
   and returns focus.
2. **Footer: a variant** (owner: "could be a variant"): `actions="row"` (default) or `"stacked"`.

## Feedback log

- 2026-10-06 · owner: stacked footer "could be a variant", non-modal "up to you" → `actions`
  variant (row / stacked) and `modal={false}` (manual popover in the top layer; first tried
  `dialog.show()`, which painted under the gallery's rail). Verified: non-modal opens at 710 / 384,
  the page beside it takes clicks, Escape closes and returns focus; stacked buttons 353 wide.
- 2026-10-05 · owner: build drawer → built from shadcn's Sheet on Dialog's anatomy; on the Review page.
