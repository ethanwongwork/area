# Progress spec

**Status:** accepted · 2026-09-28 (owner, batch 6)
**Captures:** `docs/research/captures/progress/` (Area, Figma)
**Peers:** Slider (shares the rail), Spinner (unknown duration, small spaces), Skeleton
(content placeholder), Field (label and value above)

## Owner decisions

- 2026-09-26: **Neutral by default, accent by override** (DESIGN_SYSTEM.md, "Color and
  focus"). Progress already followed it: the fill is `neutral-solid`; `tone="accent"` opts in.

No Progress section existed in prior decisions. The second pass (owner: decide every open
item) changed nothing here.

## Job and boundaries

Progress shows how far a task has run (determinate), or that it is running with no known end
(indeterminate). An inline wait inside a control is a Spinner; a placeholder for content is
a Skeleton. Label and value text are composed around it, not part of the component.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm 4, md 6 (default), lg 8 | Rail thickness by density of the context | Figma usage bar 4; Untitled one size (8) |
| tone | neutral (default), accent | Owner rule | Figma and Untitled fill in brand blue |
| state | determinate, indeterminate | Omit `value` for indeterminate | not found in Untitled's progress source (reference table) |
| composition | label and value above | Gallery `labeled` | Untitled labels beside or below; Figma's usage bar sits under its text |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Plan usage bar in the file browser sidebar | figma.com file browser, logged in, 2026-09-26 | evidence only | `figma--usage-bar--rest--light` |
| uui | design system (source) | Progress indicators | `components/base/progress-indicators/progress-indicators.tsx:47-92` at `4702dc0` ([reference](../research/untitled-ui-reference.md)) | MIT | source reading only |
| area | this system | 7 gallery tiles (re-captured after the second pass) | localhost gallery | — | `area--*` (7) |

Searched without an equivalent: ChatGPT (sidebar, menus, settings card); Notion (page menu,
Share popover, tasks board, returns table view). No indeterminate bar in any product
capture.

## Anatomy

```
figma  div.progressBar 224×4, radius 4, fill #e6e6e6 (rail)
  div.progressPartial 147.84×4 (66%), radius 4, rgb(13, 153, 255)
area   div.area-progress[role=progressbar]  block, full width, block --_progress-size, radius-full,
                                            rail colour, overflow hidden
  bar  div.area-progress__bar  block 100%, inline-size = value %, radius inherit, --_progress-fill
```

Both round the bar's end as well as the rail's.

## Measurements

Read from the nodes of `area--size-small`, `-medium`, `-large`, `area--accent`,
`area--indeterminate` and `figma--usage-bar`:

| Node · property | Area sm | Area md | Area lg | Figma usage bar |
|---|---|---|---|---|
| rail | 260 × 4 | 260 × 6 | 260 × 8 | 224 × 4 |
| radius | 9999 | 9999 | 9999 | 4 (a pill at 4px) |
| rail colour | `color(srgb 0.865)` ≈ rgb(221) (before audit S5; now `edge-control` #e2) | same | same | rgb(230, 230, 230) |
| fill | rgb(40) at 62% (161.2) | same | same | rgb(13, 153, 255) at 66% |
| accent fill | rgb(92, 93, 254) at 45% (117) | | | — |
| indeterminate | 35% segment (91), `area-progress-indeterminate` | | | — |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| rail · colour | **`edge-control` #e2e2e2** (display.css:265) | Audit S5 (owner 2026-09-30): one off-track grey with Switch and Slider (slider.css:29, switch.css:20) | Figma #e6 and Untitled #e5. Was `fill-toggle` mixed 20% toward `bg-surface` ≈ #dd, and before that `bg-component-active` #eee |
| rail · thickness | 4 / 6 / 8 (display.css:242-244) | Figma 4 = sm; Untitled 8 = lg | Default md sits between |
| radius | `radius-full` | Figma and Untitled both round a thin bar to a pill | — |
| fill | `neutral-solid`; accent by tone | Owner | Figma and Untitled use brand blue |
| indeterminate | 35% segment travelling −100% → 340% of its width, 1.8s linear (display.css:252-260); mirrored in RTL (262-266) | Distinguishable from a full bar | — |
| label composition | 14/20 row, 8px above the bar (gallery `labeled`) | Untitled 8px below / 12px beside, 14/20 500 | Weight 400 (Area label rule); consumer layout, not the component |

**Settled by audit S5 (owner 2026-09-30):** rail colour. Figma's rail is #e6 (`figma--usage-bar`)
and Untitled's neutral-200 #e5. The third pass kept about #dd; S5 moved the rail to
`edge-control` #e2, the one off-track grey shared with Switch and Slider, within 4 levels of
Figma.

## States

| State | Changes | Evidence |
|---|---|---|
| determinate | bar width transitions with `duration-slow` | `area--default` |
| indeterminate | travelling segment; stops under `data-area-motion="none"` and reduced motion (display.css:271, 274-281) | `area--indeterminate` |

No hover, focus or disabled: Progress is not interactive.

## Behavior and accessibility

`role="progressbar"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` (omitted when
indeterminate) and `aria-label` (primitives.tsx:307-329). The value is clamped to 0–100%.
No forced-colors rule in display.css (unverified).

## Peers and consistency

| Peer | Shared role | Area value in peer | Progress | Match / reason |
|---|---|---|---|---|
| Slider, Switch | rail / off track | `edge-control` #e2 | same | match (audit S5) |
| Slider | rail thickness | 4 | sm 4 | match at sm |
| Slider, Switch, Spinner | fill | `neutral-solid` | same | match |
| Spinner | track | ink at 25% ≈ #c9 | #e2 | differs (audit E-22 open) |
| Skeleton, Spinner | motion axis | stop under `motion="none"` | same | match (audit) |

## Visual pass

2026-09-28, batch 6, Claude in Chrome: Figma's Starter hub → Usage (Ethan's Team, read-only)
shows an AI-credits meter (`figma--usage-meter-ai-credits`, `figma--usage-meter-card`): 617 ×
10, track #f5, radius 6 (a pill at 10 tall), fill rgb(44, 44, 44). Beside Area's tiles:

| | Figma meter | Figma usage bar (09-27) | Area md / lg |
|---|---|---|---|
| height | 10 | 4 | 6 / 8 (sm 4) |
| shape | pill | 4px top corners | pill |
| track | #f5 | #e6 | #e2 (shared rail; was about #dd) |
| fill | rgb(44, 44, 44), neutral | #0d99ff | `neutral-solid`, about #28 |

The neutral fill and the pill match. Figma's tracks were lighter than Area's shared rail (#f5 and
#e6 against #dd; Untitled #e5). Settled by audit S5: the rail is now `edge-control` #e2, shared
with Slider and Switch.

Earlier note:

The gallery groups the tiles (Default, Tones, Sizes, Content,
States). Beside Figma's usage bar the sm rail has the same thickness and shape; Area's rail
reads one step darker. Not checked on screen: the RTL segment, dark theme.

## Verification

7 Area captures after the second pass and 1 Figma capture read. Build and test results are
in the [cohesion audit](../research/cohesion-audit.md#verification).

## Feedback log

- 2026-09-26 · cohesion audit → rail moved to Slider's (`bg-component-active` #eee →
  ≈ rgb(221)) → all 7 `area--*` captures (background 0.865098).
- 2026-09-26 · cohesion audit → indeterminate stops under the motion axis; the segment
  runs from the inline start in RTL → display.css:262-271.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → evidence added,
  no change; rail colour lighter in Figma recorded as open → `figma--usage-bar--rest--light`.
- 2026-09-27 · third pass → open question settled, value kept: the rail stays the
  toggle-off fill lightened (≈ #dd) → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-28 · batch 6 Claude in Chrome (Figma usage meter) → no change; lighter track raised as an open question.
- 2026-09-28 · owner: approved (batch 6).
- 2026-09-30 · audit S5 (owner) → rail fallback `edge-control` #e2 (was ≈ #dd), the one off-track grey of Switch and Slider; the open Figma #e6 against #dd question is settled → display.css:265.
