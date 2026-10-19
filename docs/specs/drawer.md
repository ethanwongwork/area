# Drawer spec

**Status:** complete · 2026-10-08 (owner approved on the component review page; recommendations accepted)
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
Area's lift is the Elevation axis's modal role, as Dialog (`--area-shadow-modal`: 0 0 8 + 0 14 28, 6% key at the default step).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| width | 384 sm / 480 md | shadcn; Dialog | — |
| edge | inner-edge 1px `border-float`, no radius against the screen edge; bottom: top corners `radius-container` | shadcn (flush, 1px edge) | — |
| anatomy, insets, type, close | Dialog's | Peer: Dialog (accepted) | shadcn close at 12 and stacked footer |
| scrim | Dialog's | Peer: Dialog | shadcn 10% + blur |
| motion | `translate` 100% from the edge, in on `duration-slow` (250), out on `duration-moderate` (200), `ease-drawer` both ways; scrim fade `moderate` ease-out; instant under reduced motion (2026-10-07, below) | docs/MOTION.md, "Drawer / sheet"; Vaul's curve | shadcn 200ms ease-in-out; was `duration-base` ease-out |

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

## Visual pass

### Claude in Chrome audit, 2026-10-07 (incomplete)

Sources: `localhost:4377/drawer.html` (Area, modal "Open drawer", light, viewport 1504 × 719,
tab in the background); `ui.shadcn.com/docs/components/base/drawer` (opened, then Escape; not
measured). Stopped early: the session's permission classifier refused further JavaScript
measurement and the capture relay, so no capture files were saved and no reference was measured
this pass. Notion side peek, ChatGPT sidebar, Figma panels, Vaul, Fluent, Atlassian, Material 3:
not visited.

| Slot · property | Area (measured, before) | Dialog rule | shadcn Sheet (2026-10-06) |
|---|---|---|---|
| surface | 1120 / 0, 384 × 719, 1px `border-float` inner edge, float lift | — | 384, flush, 1px edge |
| content from the inner (bordered) edge | 16 (1 + 15) | 16, border included | 16 |
| content from the top, outer side, bottom | **15** (no border, padding 15) | 16 | 16 |
| title top (with close) | 11 | 12 (16 − (24 − 16) / 2) | 16 |
| close | 32 at 7 / 7 from the corner | 8 / 8 | 28 at 12 / 12 |
| scrim | 13.3% black, no blur | the same | 10% + 4px blur |
| motion | transform 150ms `cubic-bezier(0.16, 1, 0.3, 1)` | `duration-base`, ease-out | 200ms |

Findings: (1) the surface padding was `16 − border` on all four sides while only the inner edge
has a border, so the three flush sides sat at 15 and the close at 7 / 7, one off Dialog's 16 and
8 / 8. (2) The title lacked Dialog's `text-box` rule, so without a close its cap didn't sit on the
inset as Dialog's does.

Changed (`drawer.css`): padding 16 on every side, `16 − border` only on the bordered side (end:
inline start; start: inline end; bottom: block start); the title takes Dialog's cap trim without a
close and `text-box: none` with one. Expected after the rebuild: content 16 from every edge, title
top 12, close 8 / 8. Not re-measured (see above).

Still open for a later audit: widths per size against Notion side peek and Fluent/Atlassian;
flush vs floating inset; scrim and dark-mode lift; compact; motion duration (150 vs shadcn 200).

## Settled questions

1. **Non-modal: a mode on Drawer** (owner: "up to you"). Notion's side peek is the primary content
   product's drawer and it leaves the page usable; Panel is docked in the layout and doesn't slide
   over it, so the mode belongs here. `modal={false}` renders a manual popover (top layer, no
   scrim, page not inert), moves focus to its first control, closes on Escape or the close control
   and returns focus.
2. **Footer: a variant** (owner: "could be a variant"): `actions="row"` (default) or `"stacked"`.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`, "Drawer / sheet". Verified on `/drawer.html` in a background tab
(modal and non-modal), with `getAnimations()` read at the start of each transition and rects
after `finish()`.

| Interaction | Before | After |
|---|---|---|
| enter | `transform` translate(±100%), `duration-base` 150 `ease-out` | `translate` (the individual property) 100% on the edge axis, `duration-slow` 250 `ease-drawer` (Vaul) |
| exit | the same 150 `ease-out` | one step faster, `duration-moderate` 200 `ease-drawer`; `overlay`/`display` `allow-discrete` on 200 |
| scrim | `opacity` 150 `ease-out` | `opacity` `duration-moderate` 200 `ease-out` in, and out on the surface's 200 so it is never cut |
| non-modal (side peek) | as modal, no scrim | the same slide clocks (verified 250 in, 200 out) |
| reduced motion | local `@media` set the duration to 0 | the tokens are 0; the local rule now zeroes both clocks |
| close button, footer | Button's (sibling) | unchanged |

Crispness: the panel rests at `translate: none` on whole pixels (705, 0, 384 × 798); the travel is
the panel's own size, so no resting fraction; no `will-change`.

Open questions: under reduced motion the panel appears at once. A short opacity fade instead
(Apple, Emil Kowalski) is the system-wide question in `docs/MOTION.md`; follow it there.

## Feedback log

- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → slide in on slow (250) and out on moderate (200) with ease-drawer, `translate` instead of `transform`, scrim on moderate. drawer.css.
- 2026-10-07 · audit (Claude in Chrome, stopped early by a permission refusal): flush sides at 15,
  close at 7 / 7 → padding 16 per side with the border counted once on the inner edge; title cap
  trim as Dialog's. Evidence: live Area measurement above; not re-measured after the change.

- 2026-10-06 · owner: stacked footer "could be a variant", non-modal "up to you" → `actions`
  variant (row / stacked) and `modal={false}` (manual popover in the top layer; first tried
  `dialog.show()`, which painted under the gallery's rail). Verified: non-modal opens at 710 / 384,
  the page beside it takes clicks, Escape closes and returns focus; stacked buttons 353 wide.
- 2026-10-05 · owner: build drawer → built from shadcn's Sheet on Dialog's anatomy; on the Review page.
- 2026-10-09 · owner went with Scroll area's recommendation to adopt it in the scrolling families (docs/specs/scroll-area.md, "Adoption") → the scroll container is a Scroll area: Figma's overlay bar instead of the platform's, its inset moved into the scroller so rows keep their place → back in review.
- 2026-10-14 · owner: "continue working on the next axis" → Surface is one number, the frame's width: `1` (Default) or `0` (Borderless) (was `outlined` / `borderless`; axes/surface.ts). At 0 the drawer lists the Surface axis's `shadow-edge` first in its box-shadow, ChatGPT's frameless-menu edge (`0 0 1px` black 62%, and in dark an inset `0 0 1px` white 20%; captured 2026-10-13), so it keeps an edge at Elevation 0 and in dark, where it had none. Owner approved ("go with your recs"), review https://claude.ai/artifact/L4TCF2W5zcjvBK7xZmaDBN (docs/research/surface-2026-10-14.md).
- 2026-10-18 · Elevation and Stroke audit (docs/research/elevation-stroke-2026-10-18, "Audit: Area today") → under any Material the drawer fell back to the float shadow (material.css re-added `var(--_elevation, float)` and the drawer set no `--_elevation`). It now names `--_elevation: var(--area-shadow-modal)` and lists the material's layers first (`--_m-layers`), so it keeps the modal lift under every material; unchanged with none (drawer.css). Checked in the app, light and dark, None, Glass and Tactile.
