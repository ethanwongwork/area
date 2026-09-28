# Slider spec

**Status:** accepted (Complete in `component-status.mjs`) · 2026-09-26: the second pass changed
the lg thumb; the owner has not re-reviewed it
**Captures:** `docs/research/captures/slider/`; rail evidence in
`progress/figma--usage-bar--rest--light`
**Peers:** Progress (shares the rail), Switch (thumb), Checkbox and Radio (glyph ladder),
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
  followed it.
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
| tone | neutral (default), accent | Owner rule | Untitled brand |
| labelPosition | inline (default), top | Label and readout above the rail | Area composition (owner-confirmed) |
| orientation | horizontal (default), vertical | Vertical tool panels | Area composition (owner-confirmed) |
| composition | readout, step marks, range with inputs | Owner-confirmed (above) | Area compositions |

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
| rail colour | ≈ rgb(221) (`progress/area--default`, same mix) | | | #e6e6e6 (`figma--usage-bar`) |

Disabled shell opacity 0.5 (`area--disabled`); vertical shell 32 wide (`area--vertical`).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| control · height | `control-sm/md/lg` 28 / 32 / 40 (slider.css:303-305) | Peer rows (Input, Button) | Untitled 24 hit area |
| rail · thickness | `space-4` 4px (slider.css:21) | Figma's usage bar is 4 | Untitled 8; Figma's 16px channel tracks are a different job |
| rail · colour | `fill-toggle` mixed 20% toward `bg-surface` ≈ #ddd (slider.css:27) | Audit rule "one rail" | Figma's rail #e6 and Untitled's #e5 are lighter; kept (third pass): the toggle-off fill lightened, shared with Switch, within 8 levels ([progress.md](progress.md)) |
| fill | `neutral-solid`; accent by tone | Owner | Untitled brand; Figma's usage fill is its blue |
| thumb · size | **16 / 16 / 20** (`icon-sm`, `icon-md`, `space-20`; slider.css:303-305) | Second pass: the choice glyph ladder (Checkbox, Radio); Figma 16 | Was the icon ramp, 16 at every tier. Untitled 24 |
| thumb · construction | surface ring, 1px `border-hover` mixed 35% to surface, fill dot to 42% of the radius (slider.css:29, 218-220) | Owner-confirmed; Figma's 4px white ring around the value colour | Untitled: white thumb with a 2px brand ring |
| thumb · shadow | `shadow-1` | In-flow control; Radix classic and shadcn shadow the thumb | Untitled `shadow-md`; Figma a 3-layer lift |
| hover | **fill and thumb dot darken; the rail keeps its colour** | Fluent: colour on the thumb and fill only (`useSliderStyles.styles.ts L76-83`); Radix, Base UI: no hover change | Was the rail darkening too. Correction (2026-09-27 survey): antd does darken its rail on hover (`slider/style/index.ts:489-492`); Radix, Fluent and Base UI do not, so the choice stands on the majority |
| step marks | 1 × 10 ticks behind the rail (3 show above and below) | Kept; Fluent cuts notches into the rail, Material draws 2px dots, Base UI 1 × 8 below | Open: notches would need the marks drawn into the rail itself |
| readout | 14/20 `fg-muted`, tabular, 4ch | Area value text role | — |
| disabled | 50% on the label (slider.css:158-160) | Audit rule | Untitled has no disabled style |

## States

| State | Changes | Evidence |
|---|---|---|
| hover | fill `neutral-solid-hover`, rail `fill-toggle-hover` mix (slider.css:28, 236-247); ink fixed | not captured (pseudo-elements) |
| focus-visible | thumb border and 2px outline in `focus-color` (slider.css:263-274) | not captured |
| disabled | 50% | `area--disabled` |

## Behavior and accessibility

Native `input type="range"`: keyboard, value and announcements are the browser's. The fill is
`--_pct` set by React from the normalized value, kept in sync on input and form reset
(primitives.tsx:455-552). The readout is `aria-hidden` (the input announces the value).
Vertical uses `writing-mode: vertical-lr; direction: rtl`. The right-to-left mirror and the
collapsed-range thumb are now one engine's pseudo-element per rule (slider.css:143-146,
201-202), so each applies in its engine (audit, "Found while writing the specs").

## Peers and consistency

| Peer | Shared role | Area value in peer | Slider | Match / reason |
|---|---|---|---|---|
| Progress | rail | same `fill-toggle` mix (display.css:231) | slider.css:27 | match (audit) |
| Progress, Switch | fill | `neutral-solid` | same | match |
| Checkbox, Radio | glyph ladder | 16 / 16 / 20 | thumb 16 / 16 / 20 | match (second pass) |
| Switch | thumb | surface, `shadow-1`, 16 at md | same | match |
| Checkbox, Switch | disabled | 50% | same | match |
| Spinner | track | `bg-component-active` #eee | ≈ #ddd | differs: a spinner ring is a lighter guide (Untitled: neutral-100 vs neutral-200) |

## Visual pass

The gallery groups the tiles (Default, Tones, Sizes, Layout, Content,
States), with the size tiles added in the second pass. The lg thumb now grows with the
tier as Checkbox and Radio do. Unverified on screen: the RTL mirror and the collapsed-range
thumb in Firefox and Safari; dark theme.

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
