# Skeleton spec

**Status:** in review · 2026-09-26 (cohesion audit, second pass)
**Captures:** `docs/research/captures/skeleton/`
**Peers:** Spinner and Progress (loading motion), Card (composition), Avatar (circle
placeholder), Typography (text-line heights)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Skeleton cards have
  two text lines; type samples share the trailing half of the tile.

The second pass (owner: decide every open item) changed nothing in Skeleton; its Card
composition inherits Card's new container radius.

## Job and boundaries

Skeleton stands in for content whose layout is known but whose data has not arrived. It is
decorative (`aria-hidden`); the loading state is announced by the region that hosts it. An
action in progress is Spinner; task progress is Progress.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| shape | text (default), circle, rectangle, rounded | Line of type, avatar, media, card-like block | Gallery tiles; no design-system source (Untitled has no skeleton) |
| composition | type heights, card | Owner decision above | `area--type-height`, `area--card` |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system | — | Not present in Untitled UI ([reference](../research/untitled-ui-reference.md), "Not present") | MIT | — |
| area | this system | 6 gallery tiles (re-captured after the second pass) | localhost gallery | — | `area--*` (6) |

Target products searched without an equivalent: ChatGPT (sidebar, menus, settings card);
Notion (page menu, Share popover, tasks board, returns table view); Figma (file browser
with file cards, editor inspector, layers, main menu). Every capture was taken on a loaded
page, so no placeholder was on screen; a product skeleton needs a capture during a load.

## Anatomy

```
area  div.area-skeleton[aria-hidden]  block; bg-component fill; a travelling
      bg-component-active highlight (200% × 100% gradient, 1.4s ease-in-out)
  text       block 1em (the host's font size), radius-small
  circle     radius-full; rectangle 0; rounded radius-container
```

Width and height come from the consumer (inline style), except text, whose height is `1em`.

## Measurements

Read from the shell nodes of `area--text`, `area--circle`, `area--rectangle`,
`area--rounded`, `area--type-height`, `area--card`:

| Tile | Size | Radius | Fill | Animation |
|---|---|---|---|---|
| text | 260 × 14 | 6 | rgb(247) | `area-shimmer` |
| circle | 40 × 40 | 9999 | rgb(247) | same |
| rectangle | 260 × 146.25 | 0 | rgb(247) | same |
| rounded | 260 × 146.25 | 12 | rgb(247) | same |
| type-height | 283 × 56 (56px font) | 6 | rgb(247) | same |
| card (media) | 284 × 96 | 0, clipped by the media slot | rgb(247) | same |

Highlight: `linear-gradient(90deg, transparent, rgb(238), transparent)` travelling across
the fill (display.css:145-158). The card tile's circle, lines and rounded block are set by
the demo (gallery.tsx:837-849): a 40px circle, lines at the md and ui font sizes 8px apart,
an 80 × 32 rounded block.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| fill | `bg-component` #f7f7f7 | Area's resting component fill | No reference measured |
| highlight | `bg-component-active` #eee, travelling | Travel reads as loading; a pulse reads as a state change (display.css:140-144) | — |
| text height | `1em` (display.css:166-170) | The host's font size, not its line box (`area--text` 14 at 14px, `area--type-height` 56 at 56px) | — |
| text radius | `radius-small` (6 at Standard) | Radius follows the axis | Was the `radius-2` primitive |
| rounded radius | `radius-container` 12 (display.css:173) | Card-like block; Card now uses the same role | — |
| motion | shimmer and gradient removed under `data-area-motion="none"` and reduced motion (display.css:271-272, 274-281) | Audit rule "motion setting" | Before the audit only reduced motion stopped it |

## States

| State | Changes | Evidence |
|---|---|---|
| animating | `area-shimmer`, 1.4s | all tiles (`animation-name`) |
| motion none / reduced | no animation, no gradient: a flat `bg-component` block | display.css:271-272; not tiled |

## Behavior and accessibility

`aria-hidden="true"` on every Skeleton (primitives.tsx:266-273). The host marks the region
busy or labels it (`area--card`: `aria-label="Loading card"`).

## Peers and consistency

| Peer | Shared role | Area value in peer | Skeleton | Match / reason |
|---|---|---|---|---|
| Spinner, Progress | motion axis | stop under `motion="none"` | same | match (audit) |
| Card | media radius | card radius 12 − padding 7 − border 1 = 4 (surface.css:17, 22, 98; arithmetic) | clipped by the media slot | match. Was 16 when Card was 24px |
| Card | rounded block | `radius-container` 12 | `rounded` 12 | match (second pass moved Card onto the container role) |
| Avatar | circle | `radius-full` | same | match |

## Visual pass

The gallery groups the tiles (Default, Variants for the
shapes, Content for type heights and the card); the shapes moved from Layout to Variants in
the third pass. Nothing in Notion or Figma to compare.
Unverified: dark theme, the card tile's media corners at the new Card radius on screen.

## Verification

6 Area captures after the second pass read. Build and test results are in the
[cohesion audit](../research/cohesion-audit.md#verification).

## Feedback log

- 2026-09-26 · cohesion audit → the shimmer stops under the motion axis →
  display.css:271-272.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → evidence
  searched, none found; no change to Skeleton; the card composition follows Card's new
  12px radius (media corners 16 → 4) → `area--card`, `area--rounded`.
- 2026-09-27 · third pass → shape tiles moved from Layout to Variants → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · owner: audit against other design systems → [survey](../research/skeleton-spinner-code-slider-survey.md):
  text lines reserve their line box (1em bar, half the leading above and below; Primer, MUI),
  so a skeleton paragraph matches the paragraph's height; line corners capped at 4 (seven
  systems at 3-4). Kept: the travelling sweep (Fluent, Primer, Carbon, antd, Spectrum), 1.4s
  (antd), the light #f7 fill (lightest of all; owner's lighter-UI direction). Open: page-wide
  phase sync (Spectrum), a shortened last line and show delay (Primer). Claude in Chrome:
  products show skeletons only while loading; not captured.
