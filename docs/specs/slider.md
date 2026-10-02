# Slider spec

**Status:** accepted (Complete in `component-status.mjs`) · 2026-09-26: the second pass changed
the lg thumb; the owner has not re-reviewed it
**Captures:** `docs/research/captures/slider/`; rail evidence in
`progress/figma--usage-bar--rest--light`
**Peers:** Progress and Switch (share the off-track grey, audit S5), Switch (thumb), Checkbox and Radio (glyph ladder),
NumberField and Input (range with inputs), ColorPicker channel sliders, Segmented

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Slider has been
  refined across its native value lifecycle: controlled and uncontrolled values,
  normalization, live fill/readout updates and form reset now stay synchronized. It now has
  a neutral default, an accent opt-in, labeled and range-with-input compositions, vertical
  layout, and discrete step markers, plus a surface thumb with a centered fill-color dot.
  Its public sizes are the justified small/medium/large family; UI scale owns product-wide
  density. It is owner-confirmed complete.
- 2026-09-26: **Neutral by default, accent by override** (DESIGN_SYSTEM.md). Slider already
  followed it. *Superseded 2026-09-29 (owner, D1): the fill is the Selection role, accent by
  theme; the `tone` axis was removed.*
- 2026-09-26 (second pass, owner: decide every open item): the thumb follows the choice
  glyph ladder, 16 / 16 / 20 ([cohesion audit](../research/cohesion-audit.md#second-pass-notion-figma-and-the-open-decisions),
  item 8).
- 2026-09-27: audit Slider again, with a before-and-after at enlarged scale.

## Job and boundaries

Slider picks a value from an ordered range with a direction (radius, opacity, gap). Named,
unordered options belong in Segmented or Chip. Colour channels use ColorPicker's own
sliders.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm, md (default), lg | Row height follows the control tier | Untitled one size |
| labelPosition | inline (default), top | Label and readout above the rail | Area composition (owner-confirmed) |
| orientation | horizontal (default), vertical | Vertical tool panels | Area composition (owner-confirmed) |
| composition | readout, step marks | Owner-confirmed (above) | Area compositions |
| SliderRange | two handles on one rail, optional number fields; sm, md, lg | Audit C-12 A (owner): the range with inputs, promoted to a component | Figma's and Notion's range filters (below) |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Colour picker hue and alpha sliders (channel sliders, not value sliders); plan usage bar (rail colour) | figma.com colour picker (ColorPicker pass); file browser, 2026-09-26 | evidence only | `color-picker/figma--eyedropper-and-sliders--rest--light`, `figma--hue-slider--focus-visible--light`, `progress/figma--usage-bar--rest--light` |
| systems | design systems (source) | Radix Themes, Fluent v9, Material Web, Base UI, shadcn, Carbon sliders (track, thumb, paint, hover, focus, marks) | Primer @6794582, Material Web @cbd34a8, Fluent @8add8c8, Polaris @3f7954a, Radix Themes @1faff10, shadcn @98a1fe6, Carbon @7e8c8f7, React Spectrum @16eead6, Base UI @45a75a5 | MIT / Apache | source reading |
| uui | design system (source) | Slider | `components/base/slider/slider.tsx:35-58` at `4702dc0` ([reference](../research/untitled-ui-reference.md)) | MIT | source reading only |
| area | this system | 15 gallery tiles (re-captured after the second pass) | localhost gallery | — | `area--*` (15) |

Value sliders searched without an equivalent: ChatGPT (sidebar, menus, settings card);
Notion (page menu, Share popover, tasks board, returns table view); Figma (file browser,
editor inspector, where numeric values such as opacity are number fields,
`number-field/figma--number-field--rest--light`). Native range pseudo-elements (track,
thumb) are not recorded by `area-capture.js`, so rail and thumb values come from the CSS;
the rail colour is measured through Progress, which paints the same mix.

## Anatomy

```
figma   div 172×16 channel track (radius-full, 8px end padding)
  thumb 16×16, 4px white border, 1px 20% black ring; focus 20×20 with a 1px blue outline
area    label.area-slider  flex, align center, block --_height (tier), gap --_gap
  control input[type=range]  full tier height (hit area)
    ::track  --_track 4px, radius-full, gradient: --_fill to --_pct, then --_track-fill
    ::thumb  --_thumb, 1px --_thumb-border, surface with a centred --_fill dot, shadow-1
  value  span 14/20 muted (12/16 at sm), tabular, min 4ch (aria-hidden)
```

## Measurements

Shell and readout from `area--size-small`, `-medium`, `-large`, `area--default`,
`area--with-label`, `area--disabled`, `area--vertical`:

| Node · property | Area sm | Area md | Area lg | Figma |
|---|---|---|---|---|
| shell height | 28 | 32 | 40 | — |
| readout | 31.82 × 16 | 37.13 × 20 | 37.13 × 20 | — |
| thumb (CSS) | 16 | 16 | **20** | 16 (channel slider) |
| rail thickness (CSS) | 4 | 4 | 4 | 4 (usage bar), 16 (channel track) |
| rail colour | ≈ rgb(221) (`progress/area--default`, before audit S5; now `edge-control` #e2) | | | #e6e6e6 (`figma--usage-bar`) |

Disabled shell opacity 0.5 (`area--disabled`); vertical shell 32 wide (`area--vertical`).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| control · height | `control-sm/md/lg` 28 / 32 / 40 (slider.css:299-301) | Peer rows (Input, Button) | Untitled 24 hit area |
| rail · thickness | `space-4` 4px (slider.css:21) | Figma's usage bar is 4 | Untitled 8; Figma's 16px channel tracks are a different job |
| rail · colour | **`edge-control` #e2e2e2** (slider.css:29; range rail slider.css:94) | Audit S5 (owner 2026-09-30): one off-track grey for Switch, Slider and Progress | Figma's rail #e6 and Untitled's #e5; was `fill-toggle` mixed 20% toward `bg-surface` ≈ #dd |
| fill | **`selection-solid`** (slider.css:25; range slider.css:95): `neutral-solid` by default, the accent when a scope turns the Selection role on | Owner; Selection emphasis role (`emit/base.ts:140-142`) | Untitled brand; Figma's usage fill is its blue |
| thumb · size | **16 / 16 / 20** (`icon-sm`, `icon-md`, `space-20`; slider.css:299-301) | Second pass: the choice glyph ladder (Checkbox, Radio); Figma 16 | Was the icon ramp, 16 at every tier. Untitled 24 |
| thumb · construction | surface ring, 1px `edge-control-hover` #d4 (the Checkbox and Radio glyph edge, audit S5; was `border-hover` mixed 35% to surface ≈ #ce), fill dot to 42% of the radius (slider.css:34, 216, 227) | Owner-confirmed; Figma's 4px white ring around the value colour | Untitled: white thumb with a 2px brand ring |
| thumb · shadow | `shadow-1` | In-flow control; Radix classic and shadcn shadow the thumb | Untitled `shadow-md`; Figma a 3-layer lift |
| hover | **fill and thumb dot darken; the rail keeps its colour** | Fluent: colour on the thumb and fill only (`useSliderStyles.styles.ts L76-83`); Radix, Base UI: no hover change | Was the rail darkening too. Correction (2026-09-27 survey): antd does darken its rail on hover (`slider/style/index.ts:489-492`); Radix, Fluent and Base UI do not, so the choice stands on the majority |
| step marks | 1 × 10 ticks behind the rail (3 show above and below) | Kept; Fluent cuts notches into the rail, Material draws 2px dots, Base UI 1 × 8 below | Open: notches would need the marks drawn into the rail itself |
| readout | 14/20 `fg-muted`, tabular, 4ch | Area value text role | — |
| label gap | control to readout 6 at sm, md and lg, the density tokens (slider.css:22, :41, :299-301); compact sm 4. SliderRange's row keeps 8 (slider.css:98) | Peer: Button (audit S14) | Was 4 / 8 / 8; the range row had read `gap-md` and was pinned to 8 so it did not move |
| disabled | 50% on the label (slider.css:158-160) | Audit rule | Untitled has no disabled style |

## States

| State | Changes | Evidence |
|---|---|---|
| hover | fill and thumb dot `selection-solid-hover`; the rail keeps `edge-control` (slider.css:32, 233-256); ink fixed | not captured (pseudo-elements) |
| focus-visible | thumb border and 2px outline in `focus-color` (slider.css:263-274) | not captured |
| disabled | 50% | `area--disabled` |

## Behavior and accessibility

Native `input type="range"`: keyboard, value and announcements are the browser's. The fill is
`--_pct` set by React from the normalized value, kept in sync on input and form reset
(primitives.tsx:713); `onValueChange(value, event)` passes the input event. Shift+arrow moves
ten steps (Carbon, MUI; audit C-31 A, owner 2026-09-30), following the reading direction in
RTL; the native control takes the value and fires its own input event (primitives.tsx:813-820). The readout is `aria-hidden` (the input announces the value).
Vertical uses `writing-mode: vertical-lr; direction: rtl`. Right to left: the browser already
places the thumb from the right, so only the fill turns round, through `:dir(rtl)` on the input
(`--_fill-dir: to left`, slider.css:208), which matches a `dir` on the input or an ancestor. The
old `[dir=rtl]` track mirroring (`scale: -1 1`) is removed: it put Chromium's thumb back on the
left (audit C-11; checked live in Chromium with an ancestor `dir` and the input's own). The
collapsed-range thumb rules are one engine's pseudo-element per rule, so each applies in its
engine (audit, "Found while writing the specs").

## SliderRange

`SliderRange` (`SliderRange.tsx`; manifest `area-slider-range`: size sm / md / lg, states
`overlap` / `disabled`, elements `track` / `input` / `end`) picks a `[start, end]` pair with two
native range inputs on one rail, so keyboard and form behaviour stay native. It replaces the
docs-only composition (audit C-12 A, owner).

- Props: `value` / `defaultValue` / `onValueChange([start, end])` (start never above end),
  `min`, `max`, `step`, `size`, `inputs` (number fields either side, default true), `minLabel` /
  `maxLabel` (default "Minimum" / "Maximum": the sliders take them, the fields add " value"),
  `name` / `form` (both inputs submit under `name`, start then end), `disabled`.
- Rail: the tier height (28 / 32 / 40), 4px `edge-control` rail, fill between the handles in
  the Selection role (`selection-solid`), so a theme's accent reaches it (slider.css:92-139).
- Pointer: the rail moves the nearer handle, reading from the right in RTL, and keeps focus on
  the chosen handle (its mousedown is prevented). Overlapping handles hide the end thumb unless
  it has keyboard focus (`data-overlap`).
- Disabled: the rail at the disabled opacity, the fields disabled.
- Gap between fields and rail 8 (slider.css:98).

## Peers and consistency

| Peer | Shared role | Area value in peer | Slider | Match / reason |
|---|---|---|---|---|
| Progress, Switch | rail / off track | `edge-control` #e2 (display.css:265, switch.css:20) | slider.css:29 | match (audit S5) |
| Checkbox, Radio | glyph edge | `edge-control-hover` #d4 (choice.css:48) | thumb edge slider.css:34 | match (audit S5) |
| Progress, Switch | fill | `selection-solid` (display.css:261, switch.css:14) | same | match |
| Checkbox, Radio | glyph ladder | 16 / 16 / 20 | thumb 16 / 16 / 20 | match (second pass) |
| Switch | thumb | surface, `shadow-1`, 16 at md | same | match |
| Checkbox, Switch | disabled | 50% | same | match |
| Spinner | track | ink at 25% ≈ #c9 | #e2 | differs (audit E-22 open) |

## Visual pass

The gallery groups the tiles (Default, Tones, Sizes, Layout, Content,
States), with the size tiles added in the second pass. The lg thumb now grows with the
tier as Checkbox and Radio do. Unverified on screen: the RTL fill and the collapsed-range
thumb in Firefox and Safari (Chromium checked live, audit C-11); dark theme.

2026-09-28 (batch 15, Claude in Chrome): Figma's colour picker reopened (hue and opacity sliders,
16px pill tracks, the ColorPicker's evidence) and its adjustment slider on file
(`figma--adjustment-slider*`: 16 tall shell, 24 hit). Area's generic Slider keeps a 4px rail and a
16 thumb (20 at lg); sm and md share both and differ by the row height (28 / 32), which is what
lines a slider up with the same-size controls beside it, so sm stays. The hover review row
(fill and thumb darken, rail kept) is still shown for the owner. No change.

## Verification

15 Area captures read (shell and readout; see Sources on pseudo-elements). Build and test
results are in the [cohesion audit](../research/cohesion-audit.md#verification).

## Feedback log

- 2026-09-26 · cohesion audit → no change; rail confirmed as the shared rail (Progress moved
  onto it) → `progress/area--default` rail ≈ rgb(221).
- 2026-09-26 · cohesion audit, spec pass → the RTL mirror and collapsed-range thumb rules
  split per engine (they never applied) → slider.css:143-146, 201-202.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → lg thumb
  16 → 20 (the choice glyph ladder); size tiles added; rail colour gap to Figma recorded in
  Progress → `progress/figma--usage-bar--rest--light`, `area--size-large`.
- 2026-09-27 · third pass → open question settled, value kept: the shared rail stays ≈ #dd
  → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · owner: audit → against Radix, Fluent, Material, Base UI, shadcn and Carbon: thumb (16 / 16 / 20 round), 4px rail, fill role and focus ring confirmed; hover no longer darkens the rail → Pass review in the gallery. No target product has a value slider (earlier search).
- 2026-09-27 · owner: design-system audit → [survey](../research/skeleton-spinner-code-slider-survey.md): the
  "no source darkens the rail" claim corrected (antd does); open for the owner: thumb 16 against
  the common 20 at md, a hover/drag response on the thumb (halo, scale or shadow), a value
  tooltip, Shift+arrow large steps (Carbon a quarter, MUI 10). Spectrum 2's neutral fill with
  accent on emphasis supports the neutral-default rule. Claude in Chrome: no target-product
  value slider yet; Figma's colour-picker tracks are in `color-picker/`.
- 2026-09-30 · audit S5 (owner) → one off-track grey: rail and range rail `edge-control` #e2 (was ≈ #dd), thumb edge `edge-control-hover` #d4 (was ≈ #ce), shared with Switch, Progress, Checkbox and Radio → slider.css:29, 34, 94.
- 2026-09-30 · audit S14 (owner) → the control-to-readout gap is 6 at sm, md and lg (was 4 / 8 / 8; slider.css:22, :299-301); the range row is pinned to 8 so it does not move (slider.css:98).
- 2026-09-30 · audit S17 (API vocabulary, slice 1) → `onValueChange(value, event)` passes the input event → `primitives.tsx:679`.
- 2026-10-01 · audit C-11 → RTL: the fill gradient follows `:dir(rtl)` on the input (`--_fill-dir: to left`); the `[dir=rtl]` track mirroring is removed, it put Chromium's thumb back on the left (checked live in Chromium: ancestor `dir` and the input's own both correct) → slider.css:189-208.
- 2026-10-01 · audit C-12 (owner pick A) → new `SliderRange` component replaces the docs-only composition: `[start, end]` value API, sm / md / lg, optional number fields, `minLabel` / `maxLabel`, `name` / `form`, `disabled`, RTL-aware pointer mapping, focus kept on the chosen handle; fill is the Selection role → SliderRange.tsx, manifest.ts:277-284, slider.css:92-159.
- 2026-10-01 · audit C-31 (owner pick A) → Shift+arrow moves ten steps; the thumb stays 16 at md → primitives.tsx:813-820.
