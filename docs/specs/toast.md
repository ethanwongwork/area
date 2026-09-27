# Toast spec

**Status:** in review · 2026-09-26 (cohesion audit, second pass)
**Captures:** `docs/research/captures/toast/`
**Peers:** Alert (in-place message, tones), Popover and Dialog (floating lift), Button sm
(action, dismiss), Tooltip (transient annotation)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Toast supports
  titles, actions and dismissal; it is a surface, not a global queue or automatic timer.
  Plain Toasts use 8px vertical/10px horizontal insets; action and dismissal Toasts use 4px
  vertical insets around their 28px controls. All three are 38px high at normal density,
  with centered icons and text. Multiline icons align to the first text line, and multiline
  is demonstrated separately from tone. Consumers own placement, lifetime and dismissal
  focus restoration. Reference: [Spectrum Toast](https://react-spectrum.adobe.com/v3/Toast.html).
- 2026-09-26: Neutral by default, accent by override ([design system](../DESIGN_SYSTEM.md#color-and-focus)).
- 2026-09-26: Decide every open item with the most calculated option consistent with the
  system ([second pass](../research/cohesion-audit.md#second-pass-notion-figma-and-the-open-decisions)).
  For Toast: a `neutral` tone with a muted icon is the default (item 6); the 360px width stays
  a public hook default (item 15).

## Job and boundaries

Toast reports the outcome of an action without interrupting: an optional status icon, text
with an optional title, and an optional action or dismiss button. It is the surface only;
queueing, timing, placement and focus return belong to the consumer. Alert sits in the page
and is tinted by tone; Dialog interrupts.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| tone | **neutral (default)**, info, success, warning, danger | Outcome meaning; paints the icon only | Spectrum Toast (owner reference); neutral default by the owner rule |
| composition | title, action, dismissible | Owner | Spectrum |
| layout | multiline | Owner (first-line icon) | — |

Gallery groups (`apps/docs/scripts/build.mjs:794-804`): Default (neutral); Tones (success,
info, warning, danger); Content (with title, dismissible); Layout (multiline); Behavior
(action).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| spectrum | design system (guidance) | Toast | Owner reference (above) | — | — |
| notion | target product | Nearest floating surface (Share popover lift); icon button (the dismiss control's peer) | app.notion.com, 2026-09-26 (second pass) | evidence only | `popover/notion--share-popover--open--light`, `button/notion--icon-button--hover--light` |
| area | this system | 9 gallery tiles after the second pass | localhost gallery | — | `toast/area--*` (9) |

Untitled UI has no toast ([reference](../research/untitled-ui-reference.md), "Not present").
No toast was captured in any target product: the second-pass Notion and Figma captures
(`captures/*/notion--*`, `figma--*`) contain none, and a toast appears only after an action
that would change the owner's data. Light theme only.

## Anatomy

```
area  div.area-toast flex, gap 8, padding 8/10 + 1px border, radius 12, 360 wide
  icon     span.area-toast__icon 16px, tone ink (muted when neutral), first-line offset 2
  content  div.area-toast__content[role=status] grid gap 4: title (400), body
  action   div.area-toast__action: a sm Button (28px)
  dismiss  span.area-toast__dismiss: sm ghost icon-only Button (28px, Fluent dismiss_16_regular)
with action or dismiss: align center, padding-block 4
```

Inset equations: plain height 1 + 8 + 20 + 8 + 1 = 38; with a control 1 + 4 + 28 + 4 + 1 = 38.
Icon at 1 + 10 = 11 from the start and 1 + 8 + (20 − 16)/2 = 11 from the top (`area--neutral`:
icon at 11, 11). Text at 11 + 16 + 8 = 35. A dismiss button ends 1 + 10 = 11 from the end.

## Measurements

`node scripts/capture-compare.mjs --slots shell toast/area--{neutral,title,action,multiline}--rest--light.json` (trimmed):

| slot · property | area · neutral | area · title | area · action | area · multiline |
|---|---|---|---|---|
| **shell** size | 360 × 38 | 360 × 62 | 360 × 38 | 240 × 58 |
| **shell** padding | 8 10 8 10 | 8 10 8 10 | 4 10 4 10 | 8 10 8 10 |
| **shell** border | 1 solid rgb(243, 243, 243) | same | same | same |
| **shell** radius | 12px | 12px | 12px | 12px |
| **shell** align / justify | flex-start | flex-start | center | flex-start |
| **shell** gap (row / column) | 8px / 8px | 8px / 8px | 8px / 8px | 8px / 8px |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 20px 24px 0px, color(srgb 0 0 0 / 0.03) 0px 5px 8px 0px | same | same | same |

Icon ink (node 1): neutral rgb(102, 102, 102) (`area--neutral`), success rgb(0, 119, 52),
info rgb(1, 96, 217). Notion's Share popover lift, for comparison: `0 20 24 rgba(25,25,25,.05)`,
`0 5 8 .027` and a 1px `rgba(42,28,0,.07)` ring.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| width | 360 (`--area-toast-inline-size` fallback, `surface.css:706`) | Second pass (item 15): a public hook default | No product or design-system source |
| inset | 8 / 10 plain; 4 / 10 with a 28px control; 38 high | Owner | — |
| gap | 8 (`gap-md`, inset.css) | Inset contract | — |
| radius, edge, fill | 12, 1px `border-decorative`, `bg-surface` | Peers Popover, Dialog | — |
| shadow | floating lift `0 20px 24px` + `0 5px 8px`, `shadow-color` | Shared rule; Notion's floating surfaces | Was `shadow-3` before the audit |
| icon | 16 (`icon-md`), first-line aligned | Owner; inset contract | — |
| tone | icon ink only: `fg-muted` (neutral), `fg-success` #007734, `fg-info` #0160d9, `fg-warning` #a44f00, `fg-danger` #cf033c | Earlier Area value; owner neutral rule | Alert tints the surface; a floating toast stays neutral |
| default tone | **`neutral`**, muted icon; the bare `.area-toast__icon` is muted too (`surface.css:717-719`) | Owner rule; second pass (item 6); third pass for the base rule | Was `info` (a blue icon); a bare `.area-toast` painted its icon in `fg-default` until the third pass |
| title | 14/20 400 `fg-default`, 4 above the body | Weight policy (400 for titles) | Title and body differ only by position |
| action, dismiss | sm Button 28px (outline action; ghost icon-only dismiss) | Owner (28px controls); Notion icon button 28, radius 6 | — |

Settled in the third pass (changed; [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)):
1. Framework-free default. `.area-toast__icon` now paints `fg-muted` (`surface.css:717-719`),
   so a bare `.area-toast` renders the manifest's default tone, as `.area-toast--neutral`
   (`surface.css:734`) and React do. It painted `fg-default` before.

## States

The surface has no states of its own. The action and dismiss buttons use Button's states
(hover `bg-component-hover` on ghost, fixed ink).

## Behavior and accessibility

`Toast` renders a `div`; the content is `role="status"` with `aria-atomic="true"`, so a
screen reader announces title and body when they change; the icon is `aria-hidden`. The
dismiss button is named by `dismissLabel` ("Dismiss notification") and calls `onDismiss`;
`tone` defaults to `"neutral"` (`primitives.tsx:814-830`). There is no timer, queue or focus
return. RTL follows the flex row; forced colours not verified.

## Peers and consistency

| Peer | Shared role | Peer value | Toast | Match / reason |
|---|---|---|---|---|
| Popover, Dialog, Menu | floating lift, radius 12, decorative edge | shared | same | match |
| Alert | tone default | `neutral` | `neutral` | match; tone paints the surface in Alert, the icon in Toast |
| Alert, Dialog, Popover | dismiss | 28px, radius 6, fixed ink | same (Button sm ghost) | match |
| Tooltip | transient surface | inverse, `0 4px 12px −2px` | surface, floating lift | a toast carries actions |

## Visual pass

Not inspected in this spec pass. Unverified: any product toast side by side, dark theme,
stacked toasts.

## Verification

Compared 9 Area captures (`toast/area--*`, re-taken after the second pass); no product or
Untitled UI toast exists to compare. Build and test results are in
[the audit](../research/cohesion-audit.md#verification).

## Feedback log

- 2026-09-26 · cohesion audit → `shadow-3` → floating lift → 8 Area captures.
- 2026-09-26 · found while writing this spec → a dead 10px gap overridden by inset.css →
  removed → `surface.css`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → default tone
  `info` → `neutral` (muted icon), neutral tile added; 360 kept as the hook default; open
  question on the framework-free default → `toast/area--neutral`; no product toast captured.
- 2026-09-27 · third pass → a bare `.area-toast` paints its icon muted, as neutral does (was
  `fg-default`) → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
