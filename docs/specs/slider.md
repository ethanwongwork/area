# Slider spec

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
- 2026-10-21 (owner: "the slider/track options for our current component are not great"; picked "B fix + C track", then
  asked for the "Rate your driver" bar as well, "1 circle style and 1 of this style"): the knob is plain (the fill
  dot is gone), step ticks sit under the rail, the top layout spans the row; new `variant` `track` (Figma's
  adjustment slider) and `bar` (the reference), on Slider and SliderRange.

- 2026-10-25 (owner: "they arent very smooth to move and it doesnt seem like any animation … is implemented? should the
  sliders have an indicator?", with two references: a glass settings panel whose fills end in a line, and an Audio panel
  whose bars end in a grip beside a number box, "something like this with an input at the end"): the field bar gets a
  mark at its value, its fill eases on a press, a key and a release and fades on hover, Slider gains `onValueCommit`, and
  the bar with a number field is a composition (Label, Slider field, NumberField), not a prop.
- 2026-10-26 (owner: "making it smoother, more interactive, and applying motion specifically for this interaction ...
  consolidate and make the visual variants more clear"; then "i like this look and the subtle dots", the Path panel
  reference): the rail, fill and thumb are drawn over the native input and ease on every change but a drag; a press
  lifts the knob; `field` is folded into `bar` as `labelPosition="inside"`, with a thin grip line and step dots inside
  the bar; the budget reference's "No limit" plate is a composition (a soft toggle Button after the slider).

- 2026-10-21 (owner: "build proposals 1–4"): `startLabel` / `endLabel` name the track's ends under it in the description's text and ink, aria-hidden; the slider becomes a grid so they sit under the control's column, and the ticks keep to the control's grid area (a bar's tick lane sits between it and the labels). Hidden when vertical.

## Job and boundaries

Slider picks a value from an ordered range with a direction (radius, opacity, gap). Named,
unordered options belong in Segmented or Chip. Colour channels use ColorPicker's own
sliders.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm, md (default), lg | Row height follows the control tier | Untitled one size |
| variant | rail (default), track, bar | Three looks by thickness. Track: a pill as tall as the knob, the fill under it. Bar: the track is the control's full height and corner, its thumb the fill's end with a grip (owner 2026-10-21). `field` is a deprecated alias of `bar` + `labelPosition="inside"` (owner 2026-10-26, "consolidate") | Track: Figma's image adjustment sliders (`figma--adjustment-slider`). Bar: the owner's "Rate your driver" reference; Material 3 Expressive's tall track (unverified) |
| labelPosition | inline (default), top, inside | Top: label and readout above the rail. Inside: a bar with the label at its start and the value at its end inside it, the fill a neutral plate behind them with a thin grip line inside its end, dragged from any point; step marks as dots; horizontal only, no end labels (owner 2026-10-24 as `field`; folded into bar 2026-10-26) | Top: Area composition (owner-confirmed). Inside: the owner's settings-panel reference ("Bounce 100", "Stagger 45ms", "Corner 28px") and the Path panel reference (Width with dots, Radius 347), screenshots; no live capture |
| composition | an option at the end ("No limit") | A soft toggle Button at the slider's size after it, a cluster's gap away; not a slot, since the slider's root is its label (owner 2026-10-26) | The owner's budget reference (a mouse finder's "What's your budget?": a blue bar, "No limit" plate the bar's height) |
| composition | a value input at the end | A NumberField on the same value after a label-inside bar, to type an exact value (owner 2026-10-25, "something like this with an input at the end"); NumberField keeps its units and commit. A number in a unit (an end may be a short name, "Flat"): a soft Input 4 or 5 characters wide that lands a typed name or number on its step, the name in the label column (owner 2026-10-27, "Keep the Input layout", then "smaller in width"); a value in words ("Cool 25%", "57% deeper") shows its number signed from its middle ("-25", "+57") with the words as its announced value, the bar's `gradient` saying which way is which (owner 2026-10-27: first the words as text under the name, then "i dont like the slider below the label for just some of them ... more consistent") | The owner's Audio panel reference (bars ending in a grip beside a number box), a screenshot |
| orientation | horizontal (default), vertical | Vertical tool panels | Area composition (owner-confirmed) |
| composition | readout, step marks | Owner-confirmed (above) | Area compositions |
| content | end labels (startLabel, endLabel) under the track; horizontal only | Owner 2026-10-21 ("Low" … "High") | The owner's Intensity reference; macOS and iOS settings sliders |
| content | gradient (a CSS image) | A range whose values are colours: the fill shows them at full strength up to the value, the rest of the trough shows them under the trough's fill at 80% (light) / 70% (dark), no edge; the grip is the bars' white pill; no step marks (owner 2026-10-27: "make the slider background itself be colored like a gradient"; 2026-10-31: the Intensity reference, "solid pills", "maybe always white") | The Inspector's Temperature (cool, grey, warm), Shade (the accent's shades) and Hue; ColorPicker's channel tracks, Figma's and Lightroom's temperature sliders (unverified) |
| content | origin (a value in the range) | Owner 2026-10-24: the Inspector's Temperature bar, Cool … Neutral … Warm; the fill runs between the origin and the value, so the neutral middle is an empty bar | Figma's and Lightroom's temperature and exposure sliders fill from their centre (unverified) |
| composition | field with a number field: Label over a field bar (readout off) and a NumberField on one value | Owner 2026-10-25: "something like this with an input at the end"; the range-with-inputs pattern on one value, so no prop | The owner's Audio panel reference (Volume, Scale: a bar and a "100%" box), a screenshot |
| content | buffered (0 to the value's units) | Owner 2026-10-21: media rows (music card) show how far the source has loaded | YouTube, Spotify, Apple Music; Video player's loaded part |
| SliderRange | two handles on one rail, optional number fields; sm, md, lg; variant rail, track, bar | Audit C-12 A (owner): the range with inputs, promoted to a component | Figma's and Notion's range filters (below) |

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
area    label.area-slider  flex, align center, block --_height (tier), gap --_gap; transitions --_slider-ratio
  track  span, the control's place, tier height, size container (positions are shares of 100cqi)
    control input[type=range]  inset 0, transparent, z 4: behaviour only; native thumb unpainted at the drawn size
    rail   span --_track 4px, centred, radius-full, --_track-fill, overflow clip
      buffer  to thumb/2 + travel × --_buffered: fill-toggle-hover on the rail, fill-track on track and bar troughs
      fill    to thumb × --_reach + travel × --_slider-ratio (reach ½: the thumb's centre; 1: its far edge)
    thumb  span --_thumb, 1px --_thumb-border, --_knob (surface; component-active in dark), shadow-control;
           translate travel × ratio, whole pixels; scale --_lift while pressed
  marks  1 × 4 ticks, 2px under the rail, edge-control-strong; on a bar, 3 × 3 dots centred inside it
track   ::track  16 / 16 / 20 (the thumb), bg-component; ::thumb as above, sitting inside the track
bar     rail  the tier height, radius-control-sm/md/lg, bg-component
        thumb 16 / 16 / 20 wide × tier tall, the fill colour, corner min(bar radius, 8 / 8 / 10);
              ::before grip = the thumb end inset 4: (thumb − 8) × (bar − 8), corner max(0, end corner − 4),
              fg-on-selection; focus ring on the whole bar (the rail)
        gradient  rail: wash over the colours, no edge; fill: the colours placed by the rail, reach 1, end rounded;
              thumb unpainted; grip #fff + 0 0.5px 1px 10% shadow, no stroke
inside  bar + the label and value over it (z 1), the track absolute inset 0; fill fill-track, reaching the thumb's
        far edge, its end rounded as the bar's (min(bar corner, thumb / 2)); from an origin only the thumb's end
        rounds; at the minimum the thumb's end, at the origin the thumb's end round both sides; thumb unpainted, the bar's
        grip in #fff with its shadow, always shown
figma adjustment  track 120×16 #f5 radius-full, 8 end padding; fill #0d99ff 16 tall from the origin;
                  thumb 16 white, 1px 20% black ring + 3-layer lift; origin dot 4×4; hit 24
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
| thumb · construction | **plain knob**: `light-dark(bg-surface, bg-component-active)`, 1px `edge-control-hover` #d4 (the Checkbox and Radio glyph edge, audit S5) | Owner 2026-10-21 ("B"); Figma's adjustment thumb (white, 1px ring); dark paint is Segmented's raised thumb | Was a fill-colour dot to 42% of the radius, which read as a selected Radio on the rail; in dark the surface knob read as a hole in the fill |
| fill · end | the thumb's centre: `thumb/2 + (100% − thumb) × --_slider-ratio` (slider.css `--_stop`), `--_pct` when no ratio is given | Figma's fill runs under its knob | Was `--_pct` of the whole rail, up to half a thumb off; hidden by a 4px rail, visible on a full-height track |
| track variant | track = thumb 16 / 16 / 20, `bg-component` | `figma--adjustment-slider`: 16 track, 16 thumb, #f5 (`bg-component` #f7 is the nearest role; Segmented's trough) | — |
| buffered | `fill-toggle-hover` on the rail (#d0 light, #4e dark), `fill-track` on the track and bar troughs; ends at the thumb-inset position of `buffered`, hidden behind the fill | Owner 2026-10-21; one step over each trough in both themes (probed in headless Edge) | Video player paints its loaded part as ink at 35% because it sits on footage |
| bar variant | track = tier height, `radius-control-*`; thumb the fill's end, one glyph wide; **grip = the thumb end inset 4 on every side**: 8 × (bar − 8) at sm and md, 12 at lg, corner the end's less 4 (a pill in a round end, square in a square bar); `fg-on-selection` on the accent bar, #fff on the label-inside bar and colours | Owner's reference (bar with an inner grip, beside a same-height button); owner 2026-10-31 ("bigger and match the track", then "consistently sized and so that the pill actually matches the inset corner of the track", "always white") | Thumb width is the glyph ladder; the grip was 4 × 16 in every bar until 2026-10-31. The accent bar keeps the selection's label ink: white on every fill but dark neutral's light one |
| field mark | 2 × a third of the bar (10 / 10 / 14 at sm, md, lg Compact), round, 4 inside the fill's end (centred on an empty origin bar; hidden at the range's two ends, where it read as a text cursor beside the label or value), whole pixels; `edge-control-strong` at rest, `fg-muted` on hover, drag and focus | Owner 2026-10-25, two references (a line at each fill's end; a grip inside it) | Picks, not read off the references (screenshots). Was none |
| thumb · shadow | `shadow-1` | In-flow control; Radix classic and shadcn shadow the thumb | Untitled `shadow-md`; Figma a 3-layer lift |
| motion | **the drawing eases onto every change that is not a drag** (`--_slider-ratio` registered, `fast` ease-out ≈140ms at Speed 210); a drag follows the pointer exactly (`data-dragging` once the pointer moves 2px past the press) | Owner 2026-10-26; MOTION.md: track the pointer 1:1 (Apple, Radix, Material 3), a click or key lands on a short ease-out (Figma's and Linear's sliders animate a click-jump; unverified) | A native thumb cannot be animated, so the thumb and fill are drawn; the input keeps behaviour and accessibility |
| press | **the knob lifts to `1 + (1 − feedback-scale) × 4`**: 1.12 at Subtle, 1.2 at Pronounced, 1 at Off and under reduced motion; on `press-in`, back on `fast`. The bar lifts its grip, not its end | Owner 2026-10-26 ("more interactive"); Material 3's thumb answers a press, iOS's knob grows under the finger (unverified) | MOTION.md's give shrinks a button under the finger; a thumb is picked up, so it grows by four times the same factor |
| hover | **the fill fades darker (and the bar's thumb, the fill's end) on `hover-in`, back on `fast`; the rail and knob keep their colour** | Fluent: colour on the thumb and fill only (`useSliderStyles.styles.ts L76-83`); Radix, Base UI: no hover change | Was the rail darkening too. Correction (2026-09-27 survey): antd does darken its rail on hover (`slider/style/index.ts:489-492`); Radix, Fluent and Base UI do not, so the choice stands on the majority |
| step marks | **1 × 4 ticks, 2px under the rail or track, inner steps only**, `edge-control-strong`; **on a bar, 3 × 3 dots at every value, both ends included, each exactly on its value** (not rounded to a whole pixel), the same grey, under the fill; with the value inside, the last dot is left to the text | Ticks: owner 2026-10-21 ("B"); Base UI 1 × 8 below. Dots: owner 2026-10-26 ("the subtle dots"); 2026-10-31 ("the dots should correspond to real values": the Width bar's three inner dots and its fill's end between two of them read as uneven; rounding left gaps of 18 and 19) | Even spacing over 1× crispness, as the icon set's marks |
| inside · grip | **the bar's grip, #fff, with a 0 0.5px 1px 10% shadow, no stroke** (toned down the same day: "tone down or remove the dropshadow"; with none the pill vanished on Temperature's near-white middle) (owner 2026-10-31: "always visible, maybe always white") | Was a 2 × 12 `edge-control-strong` line (the Path panel reference, 2026-10-26) | White reads on the neutral plate in both themes; the shadow keeps its shape on the light plate |
| inside · ends | **the fill always reaches the thumb's far edge, so at the minimum it is the thumb's end and at an origin the thumb's end rounded both sides; the grip is always shown**; the lane (inset.css: half the thumb, half the grip and 4, 16 at sm and md) keeps the grip off the label and value | Owner 2026-10-31 ("always visible"); reverses 2026-10-27, when the bar was empty at 0 and the grip hid at either end, where a grey line read as a text cursor beside the text | — |
| inside · in a panel | **a bar row is the bar's height**, as every panel row is its control's (field.css, owner 2026-10-27: "rows 8 apart"), so bars, fields and switches sit the panel's 8 apart | Owner 2026-10-27 ("the heights of the sliders and the other controls are the same"): bars, Segmented and dropdowns were all 26; bar rows were 26 among 30 rows. First the bars took the 30 row (a margin), then every row took its control's height | Figma's inspector: 24 fields 8 apart |
| bar end | **every bar's fill ends rounded with its line inside**: the accent bar's end is its rounded thumb; the label-inside bar's fill takes the same corner, `min(bar corner, thumb / 2)`, at its far end. From an origin the fill reaches the thumb's far edge on whichever side it is and only that end rounds; the origin's side stays straight | Owner 2026-10-26 ("should the track always be rounded at the end with a line indicator? id prefer that to be consistent") | The Path panel reference's fill ends square; consistency with the accent bar wins |
| readout | 14/20 `fg-muted`, tabular, 4ch | Area value text role | — |
| label gap | control to readout 6 at sm, md and lg, the density tokens (slider.css:22, :41, :299-301); compact sm 4. SliderRange's row keeps 8 (slider.css:98) | Peer: Button (audit S14) | Was 4 / 8 / 8; the range row had read `gap-md` and was pinned to 8 so it did not move |
| disabled | 50% on the label (slider.css:158-160) | Audit rule | Untitled has no disabled style |

## States

| State | Changes | Evidence |
|---|---|---|
| hover | `--_fill` becomes `selection-solid-hover` on the track, so the fill (and the bar's thumb) fades darker on `hover-in`; the rail and knob keep their paint; ink fixed. With the label inside, the grip line takes `fg-muted`, also while it drags or holds focus (from main's 2026-10-25 mark) | headless check pending |
| pressed (`data-pressed`) | the knob scales to `--_lift` on `press-in` (the bar's grip); pointer only | checked in Chromium: 1 → 1.12 at Subtle |
| dragging (`data-dragging`) | the `--_slider-ratio` transition is off, so the drawing follows the pointer | checked in Chromium |
| focus-visible | focus outline on the drawn knob; on the bar, on the whole bar (the rail) at its corner | not captured |
| disabled | 50% | `area--disabled` |

## Behavior and accessibility

Native `input type="range"`: keyboard, value, pointer mapping and announcements are the browser's. It lies over the
drawing, transparent, its thumb unpainted but the drawn thumb's size, so a press lands on the value where the drawing
shows it. The drawn parts are `aria-hidden`. The fill is
`--_pct` and `--_slider-ratio` (0 to 1; registered as a number, so a glide can ease it) set by React from the normalized value, or the pointer's place while a glide drags, kept in sync on input and form reset
(primitives.tsx:713); `onValueChange(value, event)` passes the input event, and `onValueCommit(value)` the final value:
on release (if it changed since the press) and on every key step, for a host whose change is costly. Shift+arrow moves
ten steps (Carbon, MUI; audit C-31 A, owner 2026-09-30), following the reading direction in
RTL; the native control takes the value and fires its own input event (primitives.tsx:813-820). The readout is `aria-hidden` (the input announces the value).
Vertical turns the input with `writing-mode: vertical-lr; direction: rtl`, and the drawing fills from the bottom
(block-axis rules, `100cqb`). Right to left: the browser places the native thumb from the right, and the drawing
follows `:dir(rtl)` on the track (`--_dir: -1`: the thumb translates leftward from the inline start; the fill grows from
it). Unverified on screen since the redraw (2026-10-26): RTL, vertical in Firefox and Safari. The collapsed-range rule
hides the end handle's drawn thumb unless its input has keyboard focus.

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

## Motion and interaction, 2026-10-07

Contract: [`docs/MOTION.md`](../MOTION.md). Covers Slider and SliderRange (`slider.css`).

| Interaction | Before | After |
|---|---|---|
| drag, keyboard step | native: the thumb follows at once | unchanged (keyboard-driven changes are instant) |
| hover (fill and thumb dot darken) | paints are gradients, which do not interpolate: at once both ways | unchanged; see open question 1 |
| focus-visible | outline on the thumb | unchanged |
| thumb `transition` | `--area-transition` | unchanged; inert (no transitioned property changes on the thumb) |
| reduced motion | nothing to stop | nothing to stop |

**Crispness.**
- Step marks: each 1px tick sat at its percentage and was pulled back by
  `translateX(-50%)`, so every tick straddled two device columns (B8 in the crispness research).
  Each tick now starts at `round(nearest, mark − 0.5px, 1px)`, no transform: it lands on a whole
  pixel, within 0.5px of the thumb's centre at that value.
- Mark strip and SliderRange rails: centred by layout (`inset-block: 0; margin-block: auto`)
  instead of `top: 50%` plus `translateY(-50%)`; the top-label layout spans the control row
  (`inset-block: calc(100% − height) 0`). Same position; no resting transform.
- The native thumb's position is the browser's: Chromium places it in layout units and snaps
  its box to device pixels when it paints.

**Verified** (`/slider.html`, Chromium, DPR 2): the md mark strip sits 11px down a 32px row, 10
tall, `transform: none`; its four ticks start at 127 / 255 / 382 / 510 of 638 (absolute x 396,
524, 651, 779, all whole); the 20% tick covers the thumb centre (135.6). The range rail and fill
compute `top: 0; height: 4px; transform: none` in a 32px track (y = 14 by layout). Not verified by
eye (background tab).

**Open questions.**
1. Hover-out on the thumb dot and fill is instant, not a `fast` fade, because both are gradient
   paints. Recommendation: leave it; a fade would need the dot rebuilt as a separate layer (or a
   registered colour property), for a 100ms change on a 16px dot.
2. MOTION.md has no recipe for a hover or drag response on the thumb (halo, shadow); the
   Feedback log's owner note lists it. Recommendation: none until the owner asks.

## Motion and interaction, 2026-10-26

Owner: "making it smoother, more interactive, and applying motion specifically for this interaction". Contract:
[`docs/MOTION.md`](../MOTION.md), Slider row.

| Interaction | Before | After |
|---|---|---|
| click on the track | the native thumb jumped there | the thumb and fill ease there on `fast` ease-out (≈140ms) |
| drag | native, 1:1 | 1:1: the drawing follows the pointer once it moves 2px (`data-dragging`); a stepped range still glides between steps |
| release onto a step | only the `field` variant eased; others jumped | every look eases onto the step |
| key step, Shift+arrow, Home / End | jumped | eases; holding a key retargets the ease smoothly |
| controlled change (a reset, a linked control) | jumped | eases |
| press | nothing | the knob lifts (1.12 at Subtle) on `press-in`, back on `fast`; the bar lifts its grip |
| hover | fill changed at once (a gradient) | the fill's colour fades in on `hover-in`, out on `fast` (closes the 2026-10-07 open question 1) |
| SliderRange | the fill jumped with the native thumbs | both thumbs and the fill between them ease; a drag on the rail follows exactly |
| reduced motion, Speed 0 | — | every duration is 0 and Feedback is Off: changes land at once, no lift |

Checked in the app (Chromium, the desktop app in the browser pane): a value change from 60 to 10 travels 181 → 30px
in ≈120ms with a decelerating curve; a press sets `data-pressed` and the knob to scale 1.12; a move sets
`data-dragging`; release clears both; a click without a move eases. The fill ends at the thumb's centre (38.2px at
10% of a 318px track). Not yet seen side by side in light and dark (the pane was hidden).

## Feedback log

- 2026-10-26 · owner: "i want to work on the slider component, specifically making it smoother, more interactive, and
  applying motion specifically for this interaction. i also want to consolidate and make the visual variants more
  clear" → the rail, fill and thumb drawn over the native input, easing on every change but a drag; press lift; hover
  fade; `field` folded into `bar` as `labelPosition="inside"` (deprecated alias kept one release); gallery tiles one look
  each, grouped Variant / Size / Label / Composition / Steps / Content / Range / Layout / State (slider.css,
  primitives.tsx, SliderRange.tsx, manifest.ts, material.css, forced-colors.css, inset.css, specimens.mjs).
- 2026-10-26 · owner: "i like this look and the subtle dots" (the Path panel reference: Shape, Width with dots, Color,
  Radius, Inverted) → the label-inside bar gains a 2px grip line inside its fill's end and the fill reaches past it;
  a bar's step marks are dots inside it (the 8px tick lane is gone).
- 2026-10-26 · owner: the budget reference ("What's your budget?", a bar with a "No limit" plate after it) → intake:
  a composition, not a slot (a button inside the slider's label joins its accessible name): Slider bar + soft toggle
  Button at the same size, `ui-cluster` apart; tile "Composition / option at the end".
- 2026-10-26 · owner: "should the track always be rounded at the end with a line indicator? id prefer that to be
  consistent" → the label-inside bar's fill ends rounded as the accent bar's end does, its line inside; from an origin
  the thumb's end rounds and the origin's side stays straight (slider.css; slider.test.mjs).
- 2026-10-26 · reconciled with main's 2026-10-25 slider (PR #165), built in parallel: this branch's drawn rail, fill and
  thumb replace the `field` bar's `::before` fill and `::after` mark; kept from main: `onValueCommit` (merged into the
  press handling, which keeps the 2px drag threshold), the Inspector's `SettingBar` (now `labelPosition="inside"`), the
  value-input tile (now "Composition / value input at the end", `GallerySliderWithInput`) and the mark's muted ink on
  hover, drag and focus, now on the grip. Not kept: the mark hiding at the range's ends, since the owner asked for the
  line always (2026-10-26) and the inside sides now clear it of the label and value text.

- 2026-10-21 · owner: "what about a separate track component for videos, music?" → intake: not yet a component; Slider
  gains `buffered` (all three variants), the music card shows it, and Media scrubber is a candidate in COMPONENTS.md
  (slider.css `--_buffer-fill`, `--_buffered`; primitives.tsx; card.tsx).

- 2026-10-21 · owner: "the slider/track options for our current component are not great. i want to fix the current
  slider visual and also add a track variant" → mock sheet (A current, B fix, C Figma track, D line handle); owner
  picked B + C, then sent the "Rate your driver" bar ("1 circle style and 1 of this style") → plain knob, ticks under
  the rail, top layout full width, fill ends at the thumb's centre (`--_ratio`, now `--_slider-ratio`), hover through `--_fill`; `variant`
  `track` and `bar` on Slider and SliderRange (slider.css, primitives.tsx, SliderRange.tsx, manifest.ts, material.css)
  → `figma--adjustment-slider--rest--light`; headless Edge sheets light and dark.

- 2026-10-21 · found in the Theme setup's bento: a `SliderRange` with `inputs={false}` collapsed to its two thumbs (its
  rail sat in the grid's first, content-sized column) → the rail spans the row when it is the only child (slider.css).

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
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → step ticks start on rounded whole pixels with no translate (was −0.5px, a 2px smear at 1x); the mark strip and SliderRange rails centre by layout instead of `translateY(-50%)`; native drag and keyboard steps stay instant (`slider.css`; "Motion and interaction, 2026-10-07").
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → step marks are `stroke-width` wide (were a literal 1px) (slider.css). (docs/research/consistency-audit-2026-10-12.md)

## Review note, 2026-10-21

- **What changed:** the knob is a plain circle, step ticks sit under the rail, and a label above spans the row. There
  are two new looks: track (a pill as tall as the knob, like Figma's image adjustments) and bar (the whole control is
  the track, its fill ending in a grip, from your reference). Both work on single sliders and ranges. A slider can also
  show how far media has loaded (`buffered`), a lighter stretch ahead of the played part, as on the music card.
- **Why:** you said the slider options weren't great. The dot made the knob read as a selected radio button, and the
  ticks hid under the fill.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.

## Review note, 2026-10-24

- **What changed:** a new `field` treatment: a bar the height of a field, with the setting's name at its start and its
  value at its end inside it, and a soft grey fill behind them that you drag from anywhere. It is for lists of settings,
  and the Inspector's theme settings move onto it.
- **Why:** your settings-panel reference ("Bounce 100", "Corner 28px"); its height, corner and side insets are Area's
  field tier's, so it lines up with a field or Button beside it.
- **Decisions:** trough `bg-component` (the soft field fill), fill `fill-track` (the off-track grey, one step past it),
  hover `fill-toggle-hover`; label and value in the body ink, which reads on both (the muted ink does not clear 4.5:1 on
  the fill). Sides: the inset contract's `(height − cap) / 2`, at least half the corner. Open: whether the fill should
  take the accent at Selection Accent (the reference is neutral, and an accent plate behind text needs its own step).
- **Origin (same day):** a range with a neutral middle (Temperature, Cool to Warm) now fills from that middle to the value,
  either way, so Neutral is an empty bar; you asked for it after the round-2 controls page. Any variant takes it.
- 2026-10-24 · owner: "the sliders are not very smooth in between their options" → `glide` (on by default for a range of 60 steps or fewer): while the pointer drags, the native control runs continuously (`step="any"`) and the fill follows it, `onValueChange` fires only when the step changes, and the value stays whole steps; on release, a key step or any change the field variant's fill eases onto the step (`--_slider-ratio` on `fast` ease-out, `data-glide`, `data-dragging`). Rail, track and bar keep their native thumb, which lands on the step at release. Checked in headless Edge: the fill moved 0.07 → 0.53 continuously while the value stepped 40% → 70%, then settled on 4/7. The ratio was renamed from `--_ratio` when it was registered, so no other family's private name is retyped (cohesion test "a registered custom property has a name no other family uses").

## Review note, 2026-10-25

- **What changed:** the field bar (the Inspector's settings) now marks its value with a short line inside the end of its
  fill, as both of your references do. Its fill is its own layer, so it eases to where you click, to each key step and
  onto the step when you let go (140ms at the default Speed), follows the pointer while you drag, and fades a step darker
  on hover. A new gallery tile, "Composition / field with input", puts a number box after the bar on the same value.
  The Inspector's bars no longer restyle the app on every step you cross: the bar and its value follow the pointer, and
  the setting lands when you let go or hold still.
- **Why:** dragging a setting froze the bar. Applying one step restyles the whole app (traced in headless Edge: three to
  six style recalculations of 3,000 to 5,000 elements, 200 to 450ms a step), so a one-second drag of Lightness took
  nine seconds to play out. With the setting landing on release, the same drag runs in two seconds with no frame over
  50ms. The fill could not ease or fade before because it was a gradient on the native track.
- **Decisions:** the mark is 2 wide and a third of the bar tall (10 / 10 / 14), 4 inside the fill's end, in the step
  tick's ink at rest and the muted ink on hover, drag and focus; on an origin bar it sits inside the fill on whichever side
  the value is. The trailing input is a composition, since
  NumberField already has units, steppers and its own commit. The cost of a restyle itself is a token-architecture
  matter (about a hundred setting scopes each re-emit the token set) and is left as a follow-up.
- **Ends:** at 0% and 100% the mark sat 4px from the label or value text ("|Label tint", "White|") and read as a text
  cursor, so it hides at the range's two ends, where an empty or full bar shows the value; it is back a hundredth in.
  Your first reference keeps its line at 0; it has more room between the line and the label than a field does.
- 2026-10-25 · owner: sliders not smooth, no animation, an indicator?, a trailing input → field bar: trough on the bar,
  fill a `::before` clipped between `--_lo` and `--_hi` (now worked out from the registered `--_slider-ratio` and
  `--_origin`, so origin fills ease too), the mark an `::after`, `data-dragging` only once the pointer moves after a press
  (a press alone eases); `onValueCommit` (release, key step); the Inspector's `SettingBar` (inspector-rows.tsx) lands a
  setting on release, after 300ms of a still pointer, or 150ms after a key, once the fill has settled; tile
  `field-input` (slider.css, primitives.tsx, inspector-rows.tsx, gallery.tsx, specimens.mjs, actions.mjs) → headless
  Edge: Lightness drag 9.3s → 2.0s, worst frame 400 → 50ms; a click eases 0.6 → 0.2 in 140ms on whole pixels.

## Review note, 2026-10-26

- **What changed:** the slider now moves. Clicking the track, pressing a key or letting go onto a step glides the thumb
  and fill there instead of jumping, a drag still follows your pointer exactly, the knob lifts a little while you hold
  it, and hover fades in. The looks are now three, by thickness (rail, track, bar). What was `field` is the bar with its
  label inside, now with a thin grip at the fill's end and faint dots for its steps; every bar's fill now ends
  rounded with its line inside. A new tile shows an option such as
  "No limit" after a bar.
- **Why:** you asked for a smoother, more interactive slider with motion for this interaction, and clearer variants; the
  grip and dots follow the Path panel reference you liked, and the option follows your budget reference.

## Review note, 2026-10-27

- Owner: "can you fix these sliders, the internal spacing? i also want to explore seeing the text on the outside/sides, and
  having a separate input for the number thats on the side, not inside the slider. i also want to make sure the heights of
  the sliders and the other controls are the same."
- Fixed in the component: the label-inside bar's ends (`inside · ends`) and its row pitch in a panel (`inside · in a
  panel`).
- Exploration, app only, switched in the Inspector's first heading (Inside / Sides / Input, `inspector-bar-layout`):
  Sides puts the name in the row's label column, as every other row's, and the value as text after the bar; Input puts the
  value in a soft Input that takes a typed value (a readout's name, or a number landing on the nearest step). Both are
  compositions (Field, the label-inside bar without its text, Input), as the 2026-10-25 decision on a value input made
  it. Sheet: `docs/research/slider-bar-layouts-2026-10-27.png` (Inspector in Electron, light and dark). Decided (owner,
  same day): "Keep the Input layout: label in the left column, bar, then the value field. Remove the switch and make it
  the only layout." The switch is gone; every setting bar (Inspector, Setup's fine-tune) is that row.

## Review note, 2026-10-27 (gradient, dots, one row)

- Owner: "for temperature, and shade, can you make the slider background itself be colored like a gradient? also i dont
  like the text just outside of the large slider. i dont like the slider below the label for just some of them, id
  prefer it to be more consistent. i liked the little notches or indicators in these sliders" (a dark settings panel:
  Label 537, Weight 400 with dots, Slant 0 with dots, Theme System).
- Slider gains `gradient` (above). The Inspector's bars are all one row with a value field; Temperature, Shade and both
  Hue bars take gradients and signed or degree numbers; bars of 3 to 12 steps draw their step dots (`stepMarks`), which
  the fill covers up to the value, as the reference's.

## Review note, 2026-10-31 (bar grip, colour bars, ends)

- Owner: "i dont like the current size of the pill indicator on the large slider, i think it should be bigger and match
  the track. i also dont like the visual treatment of the colored gradient sliders. maybe theres a better way to show
  the color, and color the tab? like this image reference?" (the Intensity bar: a fill from light to deep blue ending in
  a blue grip, Low … High ticks under it), "the ones in the inspector just look very washed out, not very smooth", "at
  full strength slider, the indicator should still be visible". Mid-session: "i dont like the outline visual for the
  sliders, i prefer solid pills or less complicated strokes ... i would prefer solid color or slightly transparent".
- **What changed:** the bar's grip runs the bar's height less 4 each side (22 in a 30 bar; was 16 in every bar). Colour
  bars draw their colours as the fill up to the value, the rest of the bar faint under the trough's own fill, and on a
  bar the thumb is a solid tab in the value's colour (deeper in light, lighter in dark), with no ring and no edge on the
  bar. The bar variant no longer paints its accent end over the colours. A label-inside bar with no text inside keeps
  its grip at both ends. The Inspector's Hue bars show each hue's real accent (its 500 shade, every 5°), Temperature
  is stronger (Cool 248° and Warm 80° at chroma 0.11 to 0.13), and every gradient blends in OKLab. New tile: Content /
  color gradient.
- **Tried and dropped** (headless captures, scratch): the gradient across the whole trough with a ringed tab (the tab
  read as a hollow ring on its own colour); the reference's plain trough with only the fill coloured (a hue bar showed
  half a spectrum and nothing ahead); a white tab (lost on the near-white Temperature middle); the colours inset to the
  thumb's travel with end caps (seams in Chromium).
- **Decided (owner, same day, after a side-by-side of both):** "Keep the Tracks edge on slider troughs." Neutral
  troughs keep the Tracks stroke (Stroke › Tracks, 3), shared with Switch, Progress and Meter; without it an empty light
  trough nearly vanished on a light card and the bars no longer matched the edged fields beside them. Colour bars keep
  no edge.

## Review note, 2026-10-31 (one pill, dots on values)

- Owner: "can you make the pill shape always visible, maybe always white? and also consistently sized and so that the
  pill actually matches the inset corner of the track? also the dots should correspond to real values, for the stroke
  width the dots dont look to be evenly spread to reflect the values".
- **What changed:** every bar's grip is one pill: the fill's rounded end inset 4 on every side, its corner the end's
  corner less 4, so it nests in the end as the end nests in the bar (8 × 22 in a 30 bar). It is white on the neutral
  plate and on colours (the colour tab above is gone) and always shown: the fill keeps its end at the minimum and at an
  origin. Step dots on a bar mark every value, both ends included, each placed exactly; a stepped range of more than 25
  steps draws none (it drew 24 marks at no value's place).
- **Why the Width bar looked uneven:** its five values (0, 0.5, 1, 1.5, 2) were evenly placed, but only the three inner
  dots were drawn, so the end gaps differed from the inner ones; the fill's end ran half a thumb past the value, between
  two dots; and whole-pixel rounding left gaps of 18 and 19.
- **Exception kept:** the accent bar's grip is the selection's label ink, which is dark on dark mode's light neutral
  fill, where white would not show.

### 2026-11-07 · Slider range: onValueCommit and the event (components audit O7, O3)

- **What changed:** SliderRange takes `onValueCommit(pair)`, as Slider: once when the pointer lets go (if the pair changed), on each keyboard step and on each typed end; `onValueChange(pair, event)` passes the input, key or pointer event.
- **Why:** SliderRange.tsx:10-28 committed on every step of a drag; Slider has `onValueCommit` (primitives.tsx:828). From the components audit's internal peer comparison (`docs/research/components-audit-2026-11-07/internal.md`); the owner took every recommendation ("Take all recs", 2026-11-07).
- **Verdict:** awaiting the owner.
