# Circular (ring) determinate progress: design-system source evidence

Collected 2026-10-12. Each repo was read at its default-branch HEAD (SHA from the GitHub API), with raw files fetched at that SHA. Citations use `path:line-line @ shortsha`. "Rendered px" values are worked out from the source numbers shown. Downloaded copies are in a local cache (not committed).

| Repo | Pinned SHA |
|---|---|
| untitleduico/react | `1d410cb` (1d410cb8facde8d50869e7bbb5f3d048e2267466) |
| mui/material-ui | `ade9a69` (ade9a69112d76d1213fee5750bf5dbdb23db8efe) |
| mantinedev/mantine | `e243f7f` (e243f7f999b3250c0babe6c6aa6dba9bcb4aa836) |
| ant-design/ant-design | `5a102fe` (5a102fe28abc8624eb27c5e1365cdbb0a4dead73) |
| react-component/progress (rc-progress) | `090325f` (090325f5a4d975c07cb33e7c5195142c0e7cce72) |
| adobe/react-spectrum | `9b7a06e` (9b7a06eedc6ba50a6aa45553d6ee9c3259c0b877) |
| microsoft/fluentui | `16fcf57` |
| carbon-design-system/carbon | `c9b1f79` |
| carbon-design-system/ibm-products | `114ff7d` |
| primer/react | `7f5303d` |
| Shopify/polaris | `3f7954a` |
| radix-ui/themes | `1faff10` |
| shadcn-ui/ui | `30a58d4` |

Geist has no public source repo. Its values come from the server-rendered HTML of https://vercel.com/geist/gauge, fetched 2026-10-12 (not pinned). ARIA comes from the W3C Recommendation https://www.w3.org/TR/wai-aria-1.2/ (#progressbar, #meter).

---

## Summary table

| System | Diameters (px) | Stroke (px) / stroke÷diameter | Track vs fill | Caps | Start / direction | Label inside | Indeterminate | Construction | Value transition | ARIA |
|---|---|---|---|---|---|---|---|---|---|---|
| **Untitled UI** `ProgressBarCircle` | xxs 64, xs 160, sm 200, md 240, lg 280 | 6/16/20/24/28 (9.4%, then 10%) | `bg-quaternary` (neutral-200 / dark neutral-700) under `fg-brand-primary` (brand-600 / dark brand-500) | round | 12 o'clock (`-rotate-90`), clockwise | yes: % value 14/24/30/36/48 px semibold; optional label 12–14 px above it (below the ring at xxs) | no | 2 circles, `pathLength=100`, `dasharray=100`, `dashoffset=100-pct` | none | `role=progressbar`, now/min/max |
| **Untitled UI** `CircleProgressBar` (simple) | 64 | 6.4 (10%) | same tokens | round on fill | 12 o'clock, clockwise | yes: 14 px medium | no | `pathLength=100`; offset `calc(100 - pct)` | none | progressbar, now/min/max |
| **MUI** `CircularProgress` | default 40 (any number) | thickness 3.6 in a 44 viewBox: 3.27 at 40 (8.2%) | no track by default; `enableTrackSlot` adds `currentColor` at opacity 0.12 light / 0.24 dark | butt (unset) | root `rotate(-90deg)`, clockwise | no | yes (default variant): rotate 1.4 s linear + dash 1.4 s ease-in-out | 1 circle; real circumference dasharray, px dashoffset | `stroke-dashoffset` 300 ms `cubic-bezier(.4,0,.2,1)` | progressbar; now/min/max only when determinate |
| **Mantine** `RingProgress` | default 120 (any) | default 12, clamped to ≤ size/4 | root curve gray-2 / dark-4 | butt by default; `roundCaps` on the outer ends only | `startAngle` 270 (12 o'clock), clockwise | yes: any node, centred, inset `thickness*2`; no font size set | no | multiple sections; per-section dasharray in real units | 0 ms by default (`transitionDuration` prop), `ease` | **none** (no role) |
| **Mantine** `SemiCircleProgress` | width 200 (height 100) | 12 | empty gray-2 / dark-4; filled primary | butt | left to right (`fillDirection`), up or down | yes: bottom or center | no | 2 circles, half-circumference dasharray | 0 ms by default, `ease` | **none** |
| **Ant Design** `type="circle"` / `"dashboard"` | small 60, medium 120 (any number); ≤20 becomes "inline" | 6% of the viewBox (min 3 px): 7.2 at 120, 3.6 at 60, 3 at 20 | rail `colorFillSecondary` (text @ 6% light / 12% dark) under `colorInfo`; success/error recolour | round (default) | 12 o'clock clockwise; dashboard has a 75° gap at the bottom | yes: `${pct}%`, font = `width*0.15+6` (24 px at 120, 15 px at 60); check/close icon at success/exception; ≤20 px moves to a Tooltip | not exposed (rc-progress has `loading`: rotate 1 s) | 100-unit viewBox; dasharray = perimeter; dashoffset (+ strokeWidth/2 with round caps) | `.3s ease` on dashoffset/dasharray/stroke/opacity | progressbar on the wrapper, now 0..100; svg `role=presentation` |
| **Spectrum 2** `ProgressCircle` | S 16, M 32, L 64 (× `--s2-scale`) | 2 / 3 / 4 (12.5%, 9.4%, 6.25%) | track `gray-300`, fill `blue-900` | round | fill `rotate(-90)`, clockwise | no (label and valueLabel omitted) | yes: rotate 1 s + dashoffset 75→20→75 | 3 circles (forced-colours stroke, track, fill); `pathLength=100`, `dasharray="100 200"`, `dashoffset=100-pct`; r = `50% - stroke/2` | none declared | progressbar (react-aria); now omitted when indeterminate; `aria-valuetext` = formatted % |
| **Geist** `Gauge` | 20 / 32 / 64 / 128 (size names tiny/small/medium/large) | viewBox 100: 15 at 20 (3 px), 10 otherwise (3.2 / 6.4 / 12.8) | **no full track**: the remainder is drawn as a second arc (`gray-alpha-400`), gaps at both ends (9 / 6 / 5 % of circumference; 0 at 0 or 100) | round | fill at 12 o'clock, clockwise; remainder mirrored (`scaleY(-1)`) | yes (`showValue`): number only; 11 px/500 at 32, 18 px/500 at 64, 32 px/600 at 128; none at 20 | yes: whole ring gray, no `aria-valuenow` | 2 circles, real dasharray via CSS vars | `1s ease` on dasharray/transform/stroke | progressbar, now/min/max |
| Fluent 2 | none: Spinner has no value (indeterminate only) | | | | | | | | | |
| Carbon / IBM Products | none: ProgressBar and ProgressIndicator (steps) only | | | | | | | | | |
| Primer, Polaris, Radix Themes, shadcn | none: linear progress only (shadcn and Fluent have radial/donut/gauge **charts**, not progress) | | | | | | | | | |

---

## Untitled UI React

Files:
- `components/base/progress-indicators/progress-circles.tsx @ 1d410cb` (exports `ProgressBarCircle` and `ProgressBarHalfCircle`)
- `components/base/progress-indicators/simple-circle.tsx @ 1d410cb`

**Sizes** (`progress-circles.tsx:20-56`): `{strokeWidth, radius}` are xxs 6/29, xs 16/72, sm 20/90, md 24/108, lg 28/126. The diameter is `2 * (radius + strokeWidth / 2)` (`:65`), which gives 64 / 160 / 200 / 240 / 280. The viewBox equals the diameter, so strokes render 1:1.

**Label**:
- The value classes are `text-sm` (xxs), `text-display-xs`, `-sm`, `-md`, `-lg`, all `font-semibold text-primary`.
- The label classes are `text-xs` (xxs–sm) and `text-sm` (md, lg), `font-medium text-tertiary` (`:24-54`).
- In `styles/theme.css @ 1d410cb`:
  - `--text-xs` is `spacing*3` (`:8`) and `--text-sm` is `spacing*3.5` (`:11`).
  - Display xs/sm/md/lg are `spacing*6 / 7.5 / 9 / 12` (`:23,26,29,33`).
  - With Tailwind's default `--spacing` of 0.25rem (not redefined in theme.css), that is 12 / 14 / 24 / 30 / 36 / 48 px.
- The label sits above the value inside the ring, except at xxs, where it goes below the ring (`:106-116`). The default text is `${percentage}%`; `valueFormatter` overrides it (`:109`).

**Construction** (`:78-104`):
- `<svg className="-rotate-90">` puts the start at 12 o'clock, drawing clockwise.
- The track circle uses `stroke-bg-quaternary`; the fill circle uses `stroke-fg-brand-primary`.
- Both circles set `pathLength="100" strokeDasharray="100" strokeLinecap="round"`.
- The fill sets `strokeDashoffset = 100 - percentage` (`:73`), with `percentage = Math.round(((value-min)*100)/(max-min))` (`:59`).
- There is no transition class.

**Colours** (`theme.css`): `--color-bg-quaternary` is neutral-200 (`:351`) and neutral-700 in dark (`:708`). `--color-fg-brand-primary` is brand-600 (`:319`) and brand-500 in dark (`:677`).

**Half circle** (`:121-182`): the same sizes; height is `radius + strokeWidth`. The track has `dashoffset=-50`; the fill has `-50 - (100-pct)/2` and is mirrored with `-scale-x-100`.

**ARIA**: `role="progressbar" aria-valuenow={value} aria-valuemin aria-valuemax` (`:77`). There is no `aria-valuetext`, no accessible-name prop and no indeterminate state.

**Simple circle** (`simple-circle.tsx:20-39`):
- `size-16` (64 px) SVG with `viewBox 0 0 60 60`, `r=26`, `strokeWidth=6`, which renders at 6.4 px.
- The track has no dasharray. The fill has `pathLength=100 strokeDasharray=100`, `strokeDashoffset: calc(100 - pct)` and round caps.
- The label is `text-sm font-medium` (14 px).
- ARIA is the same as above.

## MUI `CircularProgress`

File: `packages/mui-material/src/CircularProgress/CircularProgress.js @ ade9a69`

**Geometry**:
- `SIZE = 44` (`:15`). Defaults are `size = 40` and `thickness = 3.6` (`:232-234`).
- `viewBox = "22 22 44 44"` with `cx=cy=44` and `r = (44 - thickness)/2 = 20.2` (`:311-333`).
- The viewBox is scaled to `size`, so stroke ≈ 3.27 px at 40 px.

**Determinate** (`:273-296`):
- `circumference = 2π((44-thickness)/2)`.
- `strokeDasharray = circumference`.
- `strokeDashoffset = ((max-value)/range)*circumference` px.
- The root gets `transform: rotate(-90deg)`, so drawing starts at 12 o'clock and runs clockwise.
- No `strokeLinecap` is set, so caps fall back to the SVG default, butt.

**Track**:
- Only with `enableTrackSlot` (default false, `:229`, `:313-324`).
- `stroke: currentColor` with `opacity: palette.action.activatedOpacity` (`:206-214`).
- That opacity is 0.12 light and 0.24 dark (`styles/createPalette.js:48,79 @ ade9a69`).
- Without the slot there is no track at all.

**Colour**: the root sets `color: palette[color].main`; the circle uses `stroke: currentColor` (`:129-136`, `:164`).

**Transition**:
- In determinate mode, `getTransitionStyles(theme,'stroke-dashoffset')` applies to the circle and `'transform'` to the root (`:107-109`, `:170-172`).
- This calls `theme.transitions.create`, whose defaults are 300 ms `standard` with `easeInOut` `cubic-bezier(0.4, 0, 0.2, 1)` (`styles/createTransitions.js:8,25,65-66 @ ade9a69`; `transitions/utils.ts:171-193`).
- Reduced-motion handling is built in.

**Indeterminate** (the default variant, `:236`):
- The root rotates over 1.4 s linear (`:25-33`, `:58`).
- The dash animates over 1.4 s ease-in-out, from `1px,200px` to `100px,200px` and back, with offset 0 → -15 → -126 (`:35-50`).
- `disableShrink` turns off the dash animation.

**Label**: the component has no label slot.

**ARIA**: `role="progressbar"` always. `aria-valuenow`, `-min` and `-max` are set only when determinate (`:293-295`, `:304`). The doc comment recommends `aria-describedby` plus `aria-busy` on the region (`:216-222`).

## Mantine `RingProgress`, `SemiCircleProgress`

Directory: `packages/@mantine/core/src/components/ @ e243f7f`

**RingProgress**

Props and defaults (`RingProgress/RingProgress.tsx`):
- `size` 120, `thickness` 12, `startAngle` 270 (`:75-79`).
- Thickness is clamped to `≤ size/4` (`:19-21`).
- `roundCaps` defaults to false (`:46-47`).
- `transitionDuration` defaults to 0 (`:58-59`).
- `sectionGap` in degrees (`:61-62`).
- `startAngle`: "0 = right, 90 = bottom, 180 = left, 270 = top" (`:64-65`).
- `label` is centred (`:37-38`, `:159`).

Geometry (`Curve/get-curve-props.ts:10-27`):
- `r = (size*0.9 - thickness*2)/2`, so there is a 5% inset. At the defaults r = 42, and the outer ring edge is 96 px inside the 120 box.
- Units are real px: `deg = 2πr/100` and `dasharray = value*deg, (100-value)*deg`.
- The root (track) curve is drawn mirrored (`scale(1,-1)`) for the remainder.

Caps (`Curve.tsx:43`; `get-curves/get-curves.ts:57-68`):
- `strokeLinecap = lineRoundCaps ? 'round' : 'butt'`.
- Round caps apply only to the first and last sections. The root curve and middle sections are always butt.

CSS (`RingProgress.module.css`):
- The svg is rotated by `calc(var(--rp-start-angle, 270deg) - 360deg)` (`:15`).
- `.curve` transitions `stroke-dashoffset`, `stroke-dasharray` and `stroke` over `var(--rp-transition-duration)` with `ease` (`:20-23`); the duration defaults to `0ms` (`:7`).
- The root colour is `gray-2` in light and `dark-4` in dark (`:25-31`).
- `.label` is absolute, centred vertically, with `inset-inline: var(--rp-label-offset)` = `thickness*2` (`:34-39`; `RingProgress.tsx:85`). No font size is set.

ARIA and indeterminate:
- No `role` or `aria-*` appears anywhere in `RingProgress.tsx` or `Curve.tsx`.
- Mantine's linear `ProgressSection` does set `role: 'progressbar'`, `aria-valuemax 100`, `aria-valuemin 0`, `aria-valuenow` and `aria-valuetext: ${value}%` (`Progress/ProgressSection/ProgressSection.tsx:68-74`).
- There is no indeterminate state.

**SemiCircleProgress**

Source: `SemiCircleProgress/SemiCircleProgress.tsx` and `.module.css`.
- Defaults are `size` 200 (SVG height `size/2`), `thickness` 12, `orientation 'up'`, `fillDirection 'left-to-right'` and `labelPosition 'bottom'` (`:74-80`).
- Geometry is `r = (size - 2*thickness)/2` and `circumference = π r`.
- The filled dashoffset is `value*(circumference/100)`, with `strokeOpacity 0` at 0 (`:162-201`).
- Caps are butt (not set).
- Colours (`.module.css:1-12`): filled is `--mantine-primary-color-filled`; empty is gray-2 in light and dark-4 in dark.
- The transition covers dashoffset, dasharray, stroke-opacity and stroke over `--scp-transition-duration`, which defaults to `0ms` (`:24-30`).
- Label padding is `thickness*2` at the bottom and `*3` at the centre (`:40-54`).
- No ARIA (none in the file) and no indeterminate state.

## Ant Design `Progress type="circle" | "dashboard"`, rc-progress

Files:
- `components/progress/{Circle.tsx, progress.tsx, utils.ts, style/index.ts} @ 5a102fe`
- rc-progress `src/Circle/{index.tsx, util.ts}`, `src/common.ts` and `src/utils/getIndeterminateCircle.tsx @ 090325f`

**Sizes**:
- `getSize`: circle and dashboard are `small` → 60×60, otherwise 120×120, or any number (`utils.ts:73-82`).
- The default is `size='medium'` (`progress.tsx:110`).
- Width ≤ 20 gets the `-inline-circle` class (`progress.tsx:322`), and its text moves into a `Tooltip` (`Circle.tsx:118-128`).

**Stroke**:
- `strokeWidth = max((3/width)*100, 6)`, in units of a 100-unit viewBox (`Circle.tsx:18-20`, `:58-61`; `VIEW_BOX_SIZE = 100` in rc `Circle/util.ts:5`).
- That renders as 7.2 px at 120, 3.6 px at 60 and 3 px at 20 (minimum 3 px).
- The rail width equals the stroke width (`Circle.tsx:106`).

**Text**:
- The font size is set on the body: `width*0.15 + 6` (`Circle.tsx:63`), so 24 px at 120 and 15 px at 60.
- The indicator uses `circleTextFontSize: '1em'` and `circleTextColor: colorText` (`style/index.ts:357,361`).
- The indicator is absolutely centred with `line-height 1` (`style/index.ts:258-275`).
- The text is `${number}%` by default (`progress.tsx:194`).
- At success or exception the text becomes a `CheckOutlined` / `CloseOutlined` icon (`progress.tsx:196-206`), sized `fontSize/fontSizeSM` em (`style/index.ts:362`).

**Colours**:
- The rail is `remainingColor = colorFillSecondary` (`style/index.ts:242-244,359`), which is `colorTextBase` at alpha 0.06 in light and 0.12 in dark (`components/theme/themes/default/colors.ts:42`, `themes/dark/colors.ts:42`).
- The fill is `defaultColor = colorInfo` (`:248,358`); exception uses `colorError` and success uses `colorSuccess` (`:277-291`).
- Gradients are drawn as a conic gradient inside a mask (rc `PtgCircle.tsx:79-99`).

**Caps**:
- antd defaults to `strokeLinecap='round'` (`Circle.tsx:40`), forced to butt for conic gradients (rc `index.tsx:57`).
- With round caps the dashoffset adds `strokeWidth/2`, so the visible arc length matches the percent. Below about 1% the offset is clamped so the cap stays visible (rc `util.ts:31-40`, which cites ant-design#35009).

**Construction** (rc `Circle/index.tsx:39-46`, `util.ts:44-52`):
- `radius = 50 - strokeWidth/2`.
- `strokeDasharray = ${perimeterWithoutGap}px ${perimeter}`.
- `strokeDashoffset = ((100-pct)/100)*perimeterWithoutGap`.
- `transform: rotate(-90deg)` starts at 12 o'clock and draws clockwise.
- When `gapDegree > 0` the rotation becomes `90 + gap/2`.
- Dashboard defaults are `gapDegree 75` at the bottom (`Circle.tsx:65-79`).

**Transition**: `stroke-dashoffset .3s ease, stroke-dasharray .3s ease, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease` (rc `util.ts:50-51`). It is suppressed for updates closer than 100 ms apart (`common.ts:16-41`).

**Indeterminate**: rc-progress `loading` rotates over 1 s linear (`getIndeterminateCircle.tsx:16-30`). antd's `Circle.tsx` does not pass `loading` (`:102-115`).

**ARIA**:
- The wrapper `div` has `role="progressbar" aria-valuenow={percentNumber} aria-valuemin={0} aria-valuemax={100}` (`progress.tsx:344-347`).
- The rc `<svg>` has `role="presentation"` (rc `index.tsx:179`).

## Adobe Spectrum 2 `ProgressCircle` (and S1)

File: `packages/@react-spectrum/s2/src/ProgressCircle.tsx @ 9b7a06e`

**Sizes**:
- `size` is 16 for S, 32 for M (default) and 64 for L (`:53-66`).
- Numeric sizes in the S2 style macro become `calc(px/16 rem * var(--s2-scale))` (`style/spectrum-theme.ts:488-492`), so they are px at scale 1.

**Stroke**:
- The track is 2 / 3 / 4 px (S/M/L), dropping to 1 / 2 / 3 in forced colours (`:68-88`).
- The fill is 2 / 3 / 4 (`:90-105`; also `:174-179`).
- `r = calc(50% - strokeWidth/2)`, giving an inner stroke that stays inside the box (`:181-182`).

**Colours**:
- Track `gray-300`, fill `blue-900`.
- With `staticColor`, they become `transparent-overlay-300` and `-900`.
- In forced colours they become `Background` and `ButtonText` (`:69-72`, `:91-95`).
- There is also an extra `hcmStroke` circle for high-contrast mode (`:107-119`, `:203`).

**Construction** (`:202-223`):
- The fill has `rotate: -90` with `transformOrigin: center` (`:96-97`).
- It sets `pathLength="100"`, `strokeDasharray="100 200"` (the comment says the extra gap is there "so 0% works in Chrome"), `strokeDashoffset = 100 - percentage` and `strokeLinecap="round"`.

**Indeterminate** (`:140-159`, `:213-215`):
- Rotation over 1 s with `cubic-bezier(.6,.1,.3,.9)`.
- A dashoffset keyframe (75 at 0% and 100%, 20 at 30%) over 1 s with `cubic-bezier(.25,.1,.25,1.3)`.

**Transition and label**:
- No transition is declared for value changes.
- There is no label inside: `label` and `valueLabel` are omitted from the props (`:121-135`).

**ARIA**:
- The component wraps RAC `ProgressBar` (`:25-28`, `:186`), which calls `useProgressBar` (`react-aria-components/src/ProgressBar.tsx:81`).
- `useProgressBar` sets `role: 'progressbar'`, `aria-valuenow` (undefined when indeterminate), `-min`, `-max`, and `aria-valuetext` formatted as a percent by default (`react-aria/src/progress/useProgressBar.ts:83-114`).
- S1 warns when there is no `aria-label` or `aria-labelledby` (`@adobe/react-spectrum/src/progress/ProgressCircle.tsx:109-113`).

**S1**: `@adobe/react-spectrum/src/progress/ProgressCircle.tsx:92-152` builds the ring from rotated half-masks (`fillSubMask1/2` rotated by `-180 + pct/50*180`), not from SVG. S1 px sizes come from spectrum-css and were not read.

**Meter**: `useMeter` reuses `useProgressBar` but sets `role: 'meter'`, described as "a quantity within a known range, or a fractional value" (`react-aria/src/meter/useMeter.ts:30-43`). S2 `Meter.tsx` is a linear bar.

## Geist (Vercel) `Gauge`

Source: the rendered markup and text of https://vercel.com/geist/gauge (no public repo).

**Purpose**: the page describes it as a circular visual for conveying a percentage. Best Practices recommends it for a 0–100 ratio against a fixed maximum, giving quota usage and billing-period consumption as examples. For determinate task progress it points to `Progress`. This is the closest match to a context-window-usage ring.

**Sizes**: tiny, small, medium and large render SVGs at 20, 32, 64 and 128 px. The mapping comes from the order of the rendered demos.
- All use `viewBox 0 0 100 100`.
- At 20 px: `r=42.5`, `stroke-width=15`, which renders at 3 px.
- At 32, 64 and 128 px: `r=45`, `stroke-width=10`, which renders at 3.2, 6.4 and 12.8 px.

**No full track**:
- The remainder is drawn as a second arc (`stroke="var(--ds-gray-alpha-400)"`) that is mirrored with `scaleY(-1)`.
- Gaps separate it from the fill at both ends: `--gap-percent` is 9 at 20 px, 6 at 32 px and 5 at 64 and 128 px.
- The remainder length is `100 - value - 2*gap`, for example 38 = 100 − 50 − 12.
- At 0 or 100 the gap is 0.
- `arcPriority="equal"` gives both arcs the same size, for ratios (demo: 45/45, blue-700 and red-700).

**Caps and start**:
- Both arcs use `stroke-linecap="round"`.
- The fill uses `rotate(-90deg + gap…)`, so it starts at 12 o'clock and draws clockwise.

**Construction**: `--circumference: 2πr`, `--percent-to-px`, and `stroke-dasharray: calc(var(--stroke-percent)*var(--percent-to-px)) var(--circumference)`.

**Transition**: `--transition-length:1s`; the fill transitions `stroke-dasharray, transform` and `stroke` over that length with `ease`.

**Colours**:
- The default scale observed in the demos: 14 → `--ds-red-800`, 34 and 50 → `--ds-amber-700`, 68, 80 and 100 → `--ds-green-700`.
- A `colors` prop takes either a 0–100 keyed map (the demo uses pink-100…1000) or `primary`/`secondary`.
- The page says threshold colours "should match the same numeric breakpoints used elsewhere in the product" (≥80% warning, ≥95% error).

**Label (`showValue`)**:
- The number is shown without `%`.
- `<p class="text-copy-14">` with inline `font-size:11px;font-weight:500` at 32 px, `18px/500` at 64 px and `32px/600` at 128 px.
- No number is rendered at 20 px.
- The label wrapper is `aria-hidden`.
- `children` is reserved for an icon overlay.

**Indeterminate**: there is no `aria-valuenow`; all circles are forced to `gray-alpha-400`, with the fill at 100% and the remainder hidden. No animation class appears in the server-rendered HTML.

**ARIA**: the wrapper `div` has `role="progressbar" aria-valuemin=0 aria-valuemax=100 aria-valuenow`, and the svg is `aria-hidden`. The docs say to name it with `aria-labelledby` pointing to the adjacent label.

## Systems without a determinate circle

- **Fluent 2**: `Spinner` props are `appearance`, `delay`, `labelPosition` and `size` (extra-tiny to huge), with no value prop (`packages/react-components/react-spinner/library/src/components/Spinner/Spinner.types.ts:30-53 @ 16fcf57`). Its role defaults to `'progressbar'` (`useSpinner.tsx:51`).
  - `ProgressBar` is linear, with `shape` and `thickness` (`react-progress/.../ProgressBar.types.ts:24-45`).
  - No progress ring or circle was found in the full repo tree. `react-charts` contains a `GaugeChart`, but that is a data-visualisation chart.
- **Carbon**: `packages/react/src/components/ProgressBar` (linear) and `ProgressIndicator` (steps) only @ `c9b1f79`. There is a `chart--donut` icon but no circular component.
- **Carbon for IBM Products** @ `114ff7d`: no progress, gauge, circular or ring files in the tree.
- **Primer**: `packages/react/src/ProgressBar/ProgressBar.tsx` (linear; `aria-valuenow`/`-min 0`/`-max 100` at `:39-42`) @ `7f5303d`. No circle.
- **Polaris** (Shopify/polaris @ `3f7954a`): `polaris-react/src/components/ProgressBar` only, plus `GaugeIcon` and `ChartDonutIcon` icons.
- **Radix Themes** @ `1faff10`: `packages/radix-ui-themes/src/components/progress.tsx` (linear, wraps `radix-ui` `Progress`, has a `duration` prop at `:21`). No circle.
- **shadcn/ui** @ `30a58d4`: `ui/progress.tsx` (linear) in each base. Circular shapes appear only as Recharts `chart-radial-*` examples (`apps/v4/registry/new-york-v4/charts/chart-radial-*.tsx`).

## WAI-ARIA 1.2: `progressbar` vs `meter`

Source: https://www.w3.org/TR/wai-aria-1.2/ (#progressbar, #meter).

**progressbar**
- Defined as an element that displays the progress status for tasks that take a long time, indicating that the application is making progress toward completing the request.
- `aria-valuemin` and `aria-valuemax` default to 0 and 100.
- Authors SHOULD supply `aria-valuenow` unless the value is indeterminate, in which case they SHOULD omit it.
- The value is read-only.
- Superclass: `range`, `widget`.
- Accessible name required; children presentational.
- AT generally announce `aria-valuenow` as a percent of the range unless `aria-valuetext` is set.
- For region loading, use `aria-describedby` plus `aria-busy`.

**meter**
- Defined as representing "a scalar measurement within a known range, or a fractional value."
- `aria-valuenow` is **required** and must stay within min and max (defaults 0 and 100).
- The spec says "Authors SHOULD NOT use the meter role to indicate progress; the progressbar role exists to address that need."
- There are no ARIA equivalents yet for HTML `<meter>`'s low, high and optimum attributes; the spec defers them to 1.3.
- Superclass: `range`.
- Accessible name required; children presentational.

**Implication** (an inference from the definitions, not a quote): a ring that shows a level of a quantity, such as context-window usage, quota or disk, is a `meter`. A ring tracking a task toward completion is a `progressbar`, and only a progressbar can be indeterminate. React Aria models this with the separate `useMeter` (`role: 'meter'`). Geist's Gauge uses `progressbar` even for usage ratios, while noting that it is for a ratio rather than task progress.

---

## Consensus

- **Construction**:
  - Two concentric SVG `<circle>`s (track, fill) with `fill="none"`, filled through `stroke-dasharray`/`stroke-dashoffset`.
  - Normalising with `pathLength="100"` is used by Spectrum 2 and Untitled UI, which makes `dashoffset = 100 − pct`.
  - Spectrum adds `dasharray "100 200"` so 0% renders as nothing in Chrome.
  - MUI, rc-progress, Mantine and Geist compute real circumference units instead.
- **Start**: 12 o'clock, clockwise, everywhere, by rotating the svg, root or fill by −90°. Only Mantine (`startAngle`) and antd dashboard (gap) let you change it.
- **Stroke ratio**: for the small sizes relevant to a compact UI:
  - Spectrum: 2/16, 3/32, 4/64 px (12.5% / 9.4% / 6.25%).
  - Geist: 3 px at 20, 3.2 px at 32.
  - MUI: 3.27 px at 40.
  - antd: 3 px at ≤20 and 3.6 px at 60.
  - Small rings converge on about 2–3.3 px of stroke; Area's Spinner rule of 1/8 of the size (2 px at 16) matches Spectrum S.
  - Larger rings (Untitled UI, antd 120, Geist 64/128) sit near 6–10% of the diameter.
- **Inner stroke**: Spectrum (`r = 50% − stroke/2`), Untitled UI, MUI and rc-progress keep the stroke inside the box. Mantine adds a further 5% inset.
- **Caps**:
  - Round: Untitled UI, Spectrum 2, Geist, antd (default).
  - Butt: MUI (unset) and Mantine (default; `roundCaps` opt-in).
  - With round caps, antd extends the offset by stroke/2 so the visible length equals the percent and a tiny value stays visible.
- **Track**: a neutral, low-contrast full ring under an accent fill.
  - Values: MUI `currentColor` @ 12% (24% dark); antd text @ 6% (12% dark); Mantine gray-2 / dark-4; Spectrum gray-300; Untitled neutral-200 / neutral-700.
  - MUI hides the track by default.
  - Geist instead draws the remainder as a separate rounded arc with gaps.
  - Track-as-fill-ink-at-low-alpha (MUI) matches Area's Spinner rule (arc ink at 25%).
- **Label inside**:
  - Common on larger rings: Untitled ≥64, antd ≥ about 21, Geist ≥32, Mantine (free node).
  - Absent at small sizes: Spectrum never; Geist not at 20; antd moves it to a tooltip at ≤20; Untitled moves the caption out at xxs.
  - Label sizes scale with the ring: Geist 11/18/32 px at 32/64/128; antd `0.15·d + 6`; Untitled 14 px at 64.
  - Geist shows the number without `%`; antd and Untitled append `%`.
- **Indeterminate**:
  - Spectrum and MUI support it (rotate plus dash animation, 1–1.4 s).
  - Geist shows a static gray ring.
  - antd, Mantine and Untitled have none. For Area this is already covered by Spinner.
- **Value transition**:
  - antd 300 ms ease; MUI 300 ms `cubic-bezier(.4,0,.2,1)` with reduced-motion handling; Geist 1 s ease.
  - Mantine is 0 by default (opt-in); Spectrum and Untitled have none.
- **ARIA**:
  - `role="progressbar"` with `aria-valuenow`/`min`/`max` is universal among the systems that set ARIA (MUI, antd, Spectrum, Untitled, Geist).
  - Mantine's ring and semicircle set none.
  - Only React Aria offers `role="meter"` (`useMeter`), and the ARIA 1.2 definitions make `meter` the correct role for a usage or quantity ring such as context-window usage.
  - Spectrum adds `aria-valuetext` (formatted %) and warns when there is no label. The SVG is `aria-hidden` or `role=presentation`, and any inner number is `aria-hidden` (Geist).
