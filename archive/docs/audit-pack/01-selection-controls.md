# 01 Selection controls

> **v2 note.** This file is the capability checklist (variants, anatomy, behaviour, demos). It is not a source for sizes, padding, radius or shape: those come only from `construction/01-selection.md`. Any px value still written below is illustrative and loses to the construction file.


Switch, Slider, Segmented, Toggle button / Toggle group, Chip, Rating.
Read `00-CODEX-BUILD-BRIEF.md` first. Pixel values are reference measurements; map to Area tokens.

---

## Switch

**Job:** an immediate on/off setting that takes effect without a submit step.
**Aliases:** Toggle (GEI, CAR, ATL), ToggleSwitch (PRI), Switch (OAI, SHA, FLU, M3, MUI, HIG).
Naming trap: Geist's `Switch` is a segmented control; Geist's `Toggle` is this component.

### Anatomy

```
 label-position=end (default)                 label-position=start, layout=block (settings row)
 ┌────────track────────┐                      ┌──────────────────────────────────────────────┐
 │ (thumb)             │  Label               │ Label                          ┌──track────┐ │
 └─────────────────────┘  Description         │ Description, wraps under label │    (thumb)│ │
                                               └────────────────────────────────└───────────┘─┘
 parts: root, input (native, visually hidden, full-size hit area), track, thumb,
        thumb-icon?, track-icon-on?, track-icon-off?, state-text?, label, description,
        required-mark?, spinner?
```

Alignment rules: the track aligns to the **first line** of the label (top offset =
(label line-height - track height) / 2), never `align-items: center`, so a wrapping label
does not pull the track to the middle (OAI does this with `--switch-track-top-offset`).
Description sits under the label in the same column, never under the track.

### Candidate decisions

Names are normalized before support is counted. Product observations establish context,
not reusable API. The owner revised this table after reviewing the first implementation.

| Candidate | Normalized evidence | Area decision | Reason |
| --- | --- | --- | --- |
| Default pill switch | OAI, SHA, FLU, M3, CAR, ATL | **Core** | The pill track and circular thumb are the component's identity. Off/on paint belongs to state, not a public visual variant. |
| Outline off treatment | FLU, M3 | **Log only** | This is an off-state construction in those systems, not a durable Area `variant` axis. Area keeps its existing control edge. |
| Rounded track/thumb | PRI; RDX follows theme radius | **Log only** | Insufficient overlap and weakens the switch identity. Radius presets do not alter the pill. |
| Accent, neutral, semantic, custom tones | General color APIs in SHA/GEI/MUI; product examples elsewhere | **Log only** | Switch state has no semantic tone. The on state maps to Area accent; `custom` was a duplicate accent hook. |
| sm / md / lg | SHA, FLU, CAR, ATL, RDX; broader sources publish one to three sizes | **Core** | Three conventional glyph tiers cover 32×16, 40×20, 48×24. xs/xl names added no distinct job. |
| Thumb icon | M3, CAR, MUI Joy | **Log only** | Credible overlap, but it adds a second visual language without an Area use case. Revisit when a product requires explicit on/off glyphs. |
| Track icons | PRI, ATL | **Log only** | Redundant with position/state and too cramped at the default size. |
| Track text, including localized strings | MUI Joy | **Log only** | A single-system pattern. Text forces a content-sized track and cannot preserve the standard 40×20 geometry across locales. |
| Adjacent state text | PRI, CAR | **Log only** | Duplicates the native switch state and competes with the setting label. |
| Label end/start | OAI, FLU and common settings layouts | **Core** | Both inline label and full-width settings row are recurring jobs. |
| Label above | FLU | **Log only** | A one-system layout that is better composed with Field. |
| Description and hidden accessible label | reusable form/choice patterns; native labeling requirement | **Core** | Description supports settings context; an unlabeled visual switch still requires an accessible name. |
| Required/invalid | FLU/OAI form composition | **Separate** | A switch applies immediately; deferred validation belongs to Checkbox/Field. |
| Settings row and Panel list | NOT/HIG product patterns | **Composition** | Build from Switch plus Panel; no new Switch visual API. |
| Choice card | SHA Field composition | **Separate** | Selectable card is a container/choice pattern, not Switch styling. |
| rest/hover/active/focus/checked/disabled/disabled-checked/read-only | OAI, SHA, FLU, M3, HIG, CAR | **Core** | Required interaction and availability states. |
| disabled-focusable | FLU | **Log only** | A specialized policy; explain unavailability beside a disabled native control instead of inventing a second disabled mode. |
| loading beside | PRI pattern | **Extended** | Retained for immediate settings that save remotely; reuse Area Spinner and block changes. |
| spinner in thumb / delayed announcement | PRI-derived completion | **Log only** | Crowds the glyph and duplicated Spinner behavior. Nearby status copy owns announcements. |
| optimistic rollback helper | PRI pattern | **Composition** | Network ownership and rollback stay in application state; Switch exposes synchronous `onCheckedChange`. |
| drag thumb | HIG, M3 mobile patterns | **Log only** | Native click/Space is the desktop web contract; custom pointer capture added complexity without an Area use case. |

### Geometry

Superseded. The numbers that used to be here were partly recalled. Use the measured table, consensus and Area decision in `construction/01-selection.md`; if the component is marked seed or missing there, run the construction step in `00-START-HERE.md` first.

### Reference markup and CSS skeleton

```html
<label class="area-switch area-switch--md area-switch--solid area-switch--label-end">
  <input class="area-switch__input" type="checkbox" role="switch" name="notifications" />
  <span class="area-switch__track" aria-hidden="true">
    <span class="area-switch__thumb"><!-- optional icon / spinner --></span>
  </span>
  <span class="area-switch__text">
    <span class="area-switch__label">Email notifications</span>
    <span class="area-switch__description">Sent when a review is requested.</span>
  </span>
</label>
```

```css
.area-switch {
  --_h: var(--area-switch-track-height);
  --_w: var(--area-switch-track-width);
  --_inset: var(--area-switch-thumb-inset);
  --_thumb: calc(var(--_h) - 2 * var(--_inset));
  display: inline-grid; grid-auto-flow: column; align-items: start;
  column-gap: var(--area-switch-gap); position: relative; cursor: pointer;
}
.area-switch--full-width { display: grid; grid-template-columns: 1fr auto; width: 100%; }
.area-switch--label-start .area-switch__text { order: -1; }
.area-switch__input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: inherit; }
.area-switch__track {
  inline-size: var(--_w); block-size: var(--_h); border-radius: 999px;
  margin-block-start: calc((var(--area-switch-label-line-height) - var(--_h)) / 2);
  background: var(--area-switch-off); transition: background 150ms;
}
.area-switch__thumb {
  display: block; inline-size: var(--_thumb); block-size: var(--_thumb);
  margin: var(--_inset); border-radius: inherit; background: var(--area-switch-thumb);
  transition: translate 220ms cubic-bezier(.2,.8,.2,1), inline-size 120ms;
}
.area-switch__input:checked + .area-switch__track { background: var(--area-switch-on); }
.area-switch__input:checked + .area-switch__track .area-switch__thumb {
  translate: calc(var(--_w) - var(--_thumb) - 2 * var(--_inset)) 0;
}
:dir(rtl) .area-switch__input:checked + .area-switch__track .area-switch__thumb {
  translate: calc(-1 * (var(--_w) - var(--_thumb) - 2 * var(--_inset))) 0;
}
.area-switch__input:active:not(:disabled) + .area-switch__track .area-switch__thumb {
  inline-size: calc(var(--_thumb) + 3px);   /* and subtract 3px from translate when checked */
}
.area-switch__input:focus-visible + .area-switch__track { outline: var(--area-focus-ring); outline-offset: 2px; }
@media (forced-colors: active) {
  .area-switch__track { border: 1px solid ButtonText; background: Canvas; }
  .area-switch__input:checked + .area-switch__track { background: Highlight; }
  .area-switch__thumb { background: ButtonText; forced-color-adjust: none; }
}
```

### Behaviour

Native `<input type="checkbox" role="switch">`. Space toggles. Do not add Enter on the
native input. Submits `name=value` when on. Label click toggles. `aria-describedby`
points to description. Loading preserves the native control, sets `aria-busy`, blocks
changes, and places the shared Area Spinner beside the track.
Never use a switch inside a form that needs Save; that is Checkbox's job. Record that
boundary on the docs page.

### Separate

Checkbox (deferred commit), Toggle button (pressed state on an action, below),
Segmented (2-3 mutually exclusive views, below).

### Demo list

1 default with label. 2 sm/md/lg sizes. 3 checked and interaction states. 4 label end.
5 label start. 6 label plus description. 7 hidden accessible label. 8 full-width settings
row. 9 switch list composed with Panel. 10 loading with the shared Spinner. Stress-only
RTL, long-label, narrow-container, density, theme, contrast, motion and radius coverage
remains in the fixture/customizer rather than becoming additional public variants.

### Pitfalls

Thumb travel hard-coded instead of derived from track, thumb and inset. Track centred
against a multi-line block instead of the first label line. Text trim used to position the
whole row, making text appear low. Disabled done with whole-control opacity so the thumb
goes grey-on-grey in dark theme. Focus ring painted on the hidden input. Product-only
patterns promoted directly into public variants without checking overlap or Area fit.

---

## Slider

**Job:** pick a number, or a range, from a bounded continuous or stepped scale where
approximate position matters more than exact entry.
**Aliases:** Range (ATL, HTML), Slider (all others).

### Anatomy

```
 Label                                   [ 64 ] %      <- header: label start, value / input end
 ◁ min-icon  ├──────range━━━━━━━●────────rail──────┤  max-icon ▷
             0        25        50        75      100          <- marks + mark labels
                              ┌────┐
                              │ 64 │  value bubble above thumb (on hover / focus / drag or always)
                              └─┬──┘
 parts: root, header, label, value-output, input (native range, one per thumb), rail, range,
        thumb, thumb-value-bubble, mark, mark-label, min-label, max-label, start-slot, end-slot,
        number-input?, reset-button?
```

Alignment: rail is vertically centred on the thumb centre. Thumb centre travels from
rail start + thumb/2 to rail end - thumb/2 (inset travel) so the thumb never overhangs
the rail ends; marks use the same inset so mark 0 sits under the thumb centre at min.
Mark labels are centred under their mark except first and last, which align start and
end to stay inside the root box.

### Build list

| Axis | Value | Looks like / aligns | Sources |
| --- | --- | --- | --- |
| type | single | One thumb, filled range from min to thumb | all |
| type | range | Two thumbs, fill between; thumbs cannot cross; optional `minStepsBetweenThumbs` | SHA(Radix) M3 CAR MUI |
| type | multi-thumb (3+) | N thumbs, fill between first and last | SHA(Radix) |
| type | centred / from-origin | Fill grows from a `origin` value (usually 0 at centre) toward the thumb, for -100..100 scales | M3 FIG |
| track | `normal`, `inverted` (fill from thumb to max), `none` (no fill, for pick-a-point) | | MUI |
| steps | continuous, stepped (`step`), restricted to marks only (`step=null`) | | MUI M3 |
| marks | tick marks, tick marks + labels, custom marks array `{value,label}` | 2px dots or 1x4px ticks centred on the rail; marks inside the filled range invert colour | OAI M3 MUI HIG |
| value display | none; header output text end-aligned with `unit` suffix and `prefixUnit` | tabular numerals, fixed min-width = widest value so the header does not jitter | OAI |
| value display | bubble: `auto` (hover, focus, drag), `on` (always), `off` | Tooltip-styled, centred above thumb, 6px gap, flips below when clipped; for vertical, to the inline-end | M3 MUI |
| value display | paired number input, single or two for range; `hideTextInput` option | Input at inline-end, width 4-6ch + padding, same control height, gap 12 | CAR FIG |
| labels | min / max text labels at rail ends, inline with rail | | CAR |
| slots | start / end icons (volume low / high, zoom out / in), clicking an end icon steps the value | icon 16, gap 8, vertically centred on rail | HIG M3(inset icon) |
| size | sm / md (+ lg) | see geometry | FLU(2) MUI(2) M3(5 track heights) |
| orientation | horizontal, vertical (min-height 176) | vertical fills bottom-up, RTL does not flip vertical | SHA FLU M3 MUI |
| tone | accent, neutral, success, warning, danger; custom `rangeColor` / `trackColor` | | MUI OAI |
| scale | linear; non-linear `scale(value)` fn for display (log) | | MUI |
| function | reset to default: double-click thumb or a reset button with tooltip "Reset to default" | small marker on the rail at the default value | OAI FIG |
| function | `stepMultiplier`: Shift+Arrow moves 10 steps (configurable) | | CAR |
| state | rest, hover (thumb halo ring 4px), active / dragging (thumb scales 1.1 or halo 6px, bubble shown), focus-visible, disabled (50% tokens, no halo), read-only, invalid, warning, skeleton | | SHA CAR MUI |
| layout | inline fixed width token; `block` fills container | | all |

### Geometry

Superseded. The numbers that used to be here were partly recalled. Use the measured table, consensus and Area decision in `construction/01-selection.md`; if the component is marked seed or missing there, run the construction step in `00-START-HERE.md` first.

### Reference markup

```html
<div class="area-slider area-slider--md area-slider--horizontal" style="--_value: 64%;">
  <div class="area-slider__header">
    <label class="area-slider__label" for="opacity">Opacity</label>
    <output class="area-slider__value" for="opacity">64%</output>
  </div>
  <div class="area-slider__control">
    <div class="area-slider__rail"><div class="area-slider__range"></div></div>
    <input id="opacity" class="area-slider__input" type="range" min="0" max="100" step="1" value="64" />
    <div class="area-slider__thumb" aria-hidden="true"><span class="area-slider__bubble">64</span></div>
    <div class="area-slider__marks" aria-hidden="true">…</div>
  </div>
</div>
```

CSS-only path: style the native `input[type=range]` (`::-webkit-slider-thumb`,
`::-moz-range-thumb`, `::-moz-range-progress`, and a `linear-gradient` driven by
`--_value` for WebKit fill). React path: the native input stays in the DOM, transparent and
full-size over the control, so keyboard, forms, and AT come for free; painted rail, range,
and thumb are positioned from `--_value`. Range type uses two stacked native inputs with
`pointer-events: none` on the inputs and `pointer-events: auto` on their thumbs.

### Behaviour

Arrow keys +/- step (Left/Down decrease; in RTL Left increases). Page Up / Down = 10%
or `stepPage`. Home / End = min / max. Shift+Arrow = `stepMultiplier`. `aria-valuetext`
whenever a unit, a non-linear scale, or mark labels are used ("64 percent", "Medium").
`<output>` is `aria-live="off"` (the slider already announces). `onChange` while dragging
and `onChangeCommitted` on release (MUI naming; SHA / Radix `onValueCommit`).

### Separate

Number input / Stepper, Scrub input (Figma-style drag-on-label numeric field: build as
`area-scrub-input`), Progress (not interactive), Rating (below).

### Demo list

1 default with label + value. 2 range. 3 sizes. 4 stepped with ticks. 5 marks with labels
(Low / Medium / High). 6 restricted to marks. 7 centred origin (-100..100, "Tint").
8 inverted and no-fill tracks. 9 bubble auto / on. 10 with number input, single and range.
11 min / max labels. 12 start / end icons (volume). 13 reset-to-default marker. 14 vertical
trio (equaliser). 15 tones. 16 states incl. read-only, invalid in Field. 17 in-context:
property panel row, 240px wide, with number input. 18 stress: RTL, 200% zoom.

### Pitfalls

Thumb overhangs rail ends so marks misalign. Fill computed from raw value instead of
(value-min)/(max-min). Bubble clipped by overflow containers (render in the top layer via
the `popover` attribute or a portal). Two-thumb sliders where the second thumb cannot be
reached by keyboard. Missing `aria-valuetext` with units.

---

## Segmented

**Job:** switch between 2-5 mutually exclusive views or modes of the same surface,
all options visible at once, change applies immediately.
**Aliases:** SegmentedControl (OAI, PRI, HIG), Switch (GEI), Content switcher (CAR),
Segmented button / connected button group (M3), ToggleButtonGroup exclusive (MUI),
Tabs `default` variant and ToggleGroup `single` (SHA), TabList `subtle` / `filled-circular` (FLU).

### Anatomy

```
 ┌─container (soft fill, padding = gutter)───────────────────────────┐
 │ ┌──thumb (raised, slides)──┐                                      │
 │ │  [icon] Source   (12)    │   [icon] Output      [icon] Diff     │
 │ └──────────────────────────┘                                      │
 └───────────────────────────────────────────────────────────────────┘
 parts: root (radiogroup), thumb (one absolutely positioned element that animates between
        options), option (label wrapping native radio), option-icon, option-label,
        option-count, divider?, trailing-action?
```

Option radius = container radius - gutter (OAI source computes exactly this). Thumb is a
single element moved with `translate` + `inline-size` measured from the active option
(ResizeObserver), not a per-option background, so it slides.

### Build list

| Axis | Value | Looks like / aligns | Sources |
| --- | --- | --- | --- |
| variant | `soft` (default) | Muted container fill, raised surface thumb with smallest shadow, 2px gutter, 2px gap | OAI SHA GEI HIG |
| variant | `outline` | 1px stroked container, no fill; selected option gets soft fill + inner stroke; dividers between unselected neighbours, hidden on both sides of the selected option | PRI M3 HIG MUI |
| variant | `ghost` / subtle | No container; options are ghost buttons with gap 2-4; selected gets soft fill | PRI(subtle) FLU(subtle) |
| variant | `solid` selected | Selected option is tone-solid (ink or accent) instead of raised white | CAR FLU(filled-circular) GEI(tabs secondary) |
| variant | `line` | Underline indicator instead of thumb. Belongs to Tabs; listed so it is not added here | SHA |
| shape | rounded, `pill` | pill scales option inline padding by about 1.2 | OAI FLU(circular) |
| size | full Area control ramp | OAI documents 22, 24, 26, 28, 32, 36, 40, 44, 48 with font step at 26 and 44 | OAI(9) PRI(28,32) GEI(3) CAR(3) MUI(3) |
| gutter | `gutterSize` independent of size: 6, 8, 10, 12, 14, 16 option inline padding | for dense toolbars vs roomy page headers | OAI |
| content | label; icon + label; icon-only (requires `aria-label` + Tooltip); label + count; label + badge dot | icon 14-16, gap 4-6; count uses Counter badge at smallest size | PRI(leadingVisual, IconButton, count) GEI(icon, tooltip) CAR(icon-only) |
| content | selected checkmark | Leading check replaces / precedes icon on selected; reserve its width in every option so labels do not shift | M3 |
| layout | `inline` (hug), `block` (equal-width options via `grid-auto-columns: 1fr`) | | OAI(block) PRI(fullWidth) GEI(full width) HIG |
| layout | proportional vs equal widths | default hug = proportional; `equal` forces widest-option width on all | HIG |
| layout | vertical | stacked options, thumb slides on Y | MUI FLU |
| responsive | `hideLabels` below a breakpoint (icons only), `dropdown` below a breakpoint (collapses to a menu button showing the selection) | per-breakpoint object in React; CSS container query in CSS | PRI |
| selection | single (radio semantics, default); `multiple` | multiple is Toggle group, below | MUI M3 |
| selection | `enforceOne` vs deselectable | segmented always enforces one | MUI |
| trailing | divider + action button inside the container end (for example "+", or settings) | | PRI(Divider, Action) |
| state | option: rest, hover (text to strong, faint fill), active, focus-visible ring inside container, selected, disabled option, disabled group, loading action | | all |
| tone | neutral default; accent for `solid` selected | | CAR FLU |

### Geometry

Superseded. The numbers that used to be here were partly recalled. Use the measured table, consensus and Area decision in `construction/01-selection.md`; if the component is marked seed or missing there, run the construction step in `00-START-HERE.md` first.

### Reference markup and CSS skeleton

```html
<div class="area-segmented area-segmented--md area-segmented--soft" role="radiogroup" aria-label="View">
  <span class="area-segmented__thumb" aria-hidden="true"></span>
  <label class="area-segmented__option">
    <input type="radio" name="view" value="source" checked />
    <svg class="area-segmented__icon" aria-hidden="true">…</svg>
    <span class="area-segmented__label" data-label="Source">Source</span>
  </label>
  <label class="area-segmented__option">
    <input type="radio" name="view" value="output" />
    <span class="area-segmented__label" data-label="Output">Output</span>
  </label>
</div>
```

```css
.area-segmented { --_gutter: 2px; --_r: var(--area-segmented-radius);
  display: inline-grid; grid-auto-flow: column; gap: 2px; padding: var(--_gutter);
  position: relative; isolation: isolate; border-radius: var(--_r);
  block-size: var(--area-control-size); background: var(--area-segmented-bg); }
.area-segmented--full-width { display: grid; grid-auto-columns: 1fr; inline-size: 100%; }
.area-segmented__option { display: inline-flex; align-items: center; justify-content: center;
  gap: var(--area-segmented-option-gap); padding-inline: var(--area-segmented-option-gutter);
  border-radius: max(2px, calc(var(--_r) - var(--_gutter))); position: relative; z-index: 1;
  white-space: nowrap; cursor: pointer; }
.area-segmented__option input { position: absolute; inset: 0; opacity: 0; margin: 0; }
.area-segmented__thumb { position: absolute; inset-block: var(--_gutter); inset-inline-start: 0;
  inline-size: var(--_thumb-w); translate: var(--_thumb-x) 0; z-index: 0;
  border-radius: max(2px, calc(var(--_r) - var(--_gutter)));
  background: var(--area-segmented-thumb); box-shadow: var(--area-shadow-1);
  transition: translate 220ms cubic-bezier(.2,.8,.2,1), inline-size 220ms; }
/* CSS-only fallback when JS has not measured: paint the selected option itself */
.area-segmented:not([data-thumb-ready]) .area-segmented__option:has(input:checked) {
  background: var(--area-segmented-thumb); box-shadow: var(--area-shadow-1); }
.area-segmented__option:has(input:focus-visible) { outline: var(--area-focus-ring); outline-offset: -2px; }
```

### Behaviour

Native radios: Tab enters on the checked option, Arrow keys move **and select** (automatic),
Home / End. A `name` is required or the radios do not group (Geist calls this out). If the
options swap panels and you want manual activation, that is Tabs, not Segmented.
Icon-only options always carry a visually hidden label plus a Tooltip.

### Separate

Tabs (owns panels, `tablist` semantics), Toggle group (multi-select or deselectable),
Button group (independent actions), Select / dropdown (more than 5 options).

### Demo list

1 default two options. 2 variants soft / outline / ghost / solid. 3 size ramp stacked.
4 pill. 5 icon + label. 6 icon-only with tooltips (list / grid / board). 7 with counts
(Open 12, Closed 48). 8 selected checkmark. 9 block in a 320 panel. 10 equal vs
proportional. 11 vertical. 12 gutter sizes. 13 trailing action. 14 responsive hideLabels
and dropdown in a resizable container. 15 states incl. one disabled option. 16 in-context:
toolbar at the smallest size next to icon buttons; page header at md. 17 stress: 5 long
German labels, RTL.

### Pitfalls

Per-option background instead of one sliding thumb. Same radius on container and option.
Selected label goes bold and the control width jumps. Missing `name`. Dividers left visible
next to the selected option in the outline variant.

---

## Toggle button and Toggle group

**Job:** an action button that stays pressed (Bold, Pin, Mute), alone or grouped.
**Aliases:** Toggle (SHA), ToggleButton (FLU, MUI), Icon toggle button (M3),
ToolbarToggleButton / ToolbarRadioButton (FLU), pressed Button (ATL `isSelected`).

| Axis | Value | Looks like / aligns | Sources |
| --- | --- | --- | --- |
| base | Inherits Button geometry, sizes, shapes exactly. Min-width = height so icon-only is square | SHA: 32 / 36 / 40, min-w equals h | SHA FLU MUI |
| variant | `ghost` (default; pressed = soft fill), `outline` (pressed = soft fill + strong stroke), `soft` (pressed = solid), `solid` | | SHA(default, outline) FLU(primary, subtle, transparent, outline, secondary) |
| pressed content | optional icon swap (outline icon to filled icon), optional label swap ("Follow" / "Following") with reserved width | | M3 FLU |
| group | `type=single` deselectable, `type=single enforceOne`, `type=multiple` | | SHA MUI |
| group | `spacing=0` joined (shared borders collapse, only outer corners rounded, inner dividers 1px) or `spacing>0` separated (each keeps its radius) | | SHA(spacing) M3(connected vs standard groups) |
| group | orientation horizontal / vertical; block (equal widths) | | SHA MUI |
| group | size and variant set once on the group and inherited through context / CSS vars | | SHA |
| tone | neutral; accent when pressed state must read as "on" | | MUI(color) |
| state | rest, hover, active, focus-visible, pressed, pressed+hover, disabled, pressed+disabled, loading | | all |

Behaviour: `<button aria-pressed="true|false">`. Group `type=multiple` is `role="group"`
with each button `aria-pressed`. Group `type=single` is `role="radiogroup"` with
`role="radio" aria-checked` and roving tabindex when `enforceOne`; when deselectable keep
`aria-pressed` buttons. Inside a Toolbar, arrow keys move focus and Tab leaves (FLU Toolbar).

Joined-group CSS:

```css
.area-toggle-group--attached > * { border-radius: 0; margin-inline-start: -1px; }
.area-toggle-group--attached > :first-child { border-start-start-radius: var(--_r); border-end-start-radius: var(--_r); margin-inline-start: 0; }
.area-toggle-group--attached > :last-child  { border-start-end-radius: var(--_r); border-end-end-radius: var(--_r); }
.area-toggle-group--attached > :is(:hover, :focus-visible, [aria-pressed="true"]) { z-index: 1; }
```

Demos: single icon toggle (Pin). Text formatting group multiple (B I U S). Alignment group
single enforceOne. Variants row. Sizes. Joined vs separated. Vertical. Label swap
Follow / Following. Inside a toolbar with separators. States.

---

## Chip

**Job:** a compact, interactive value: select it, filter by it, remove it, or trigger it.
Static classification is **Tag** (file 03). Technical reference is **Token** (complete).
**Aliases:** Chip (M3, MUI), Tag / InteractionTag (FLU), Token (PRI), Tag selectable /
dismissible / operational (CAR), Pill (GEI), removable Tag (ATL).

### Anatomy

```
 ┌───────────────────────────────────────────────┐
 │ [media 16-20]  Primary text  [count]  [ x ]   │     two-line: primary over secondary,
 └───────────────────────────────────────────────┘     media spans both lines
 parts: root, primary-action (button / link / checkbox / radio), media (icon | avatar | dot |
        check), label, secondary-text?, count?, secondary-action (remove / dropdown caret)
```

With a secondary action, the chip is **two sibling buttons inside one painted box**
(FLU InteractionTag = InteractionTagPrimary + InteractionTagSecondary), separated by a 1px
divider on hover / focus. Never nest a button in a button.

### Build list

| Axis | Value | Looks like / aligns | Sources |
| --- | --- | --- | --- |
| kind | `action` (assist / suggestion) | Button; optional leading icon; fires and does not stay selected | M3 MUI(clickable) |
| kind | `filter` | Toggles selected; selected shows leading check (reserve or animate width), soft tone fill, strong stroke | M3 CAR(selectable) FLU(selected) PRI(isSelected) |
| kind | `choice` | One-of-many in a group, radio semantics | M3 |
| kind | `input` / removable | Represents an entered value; trailing remove button; Backspace / Delete removes when focused | M3 FLU(dismissible) PRI(onRemove) MUI(onDelete) ATL CAR |
| kind | `menu` / operational | Trailing caret, opens a Menu or Popover (filter with options: "Status: Open v") | CAR(operational) M3(filter + dropdown) NOT(filter pills) |
| kind | link | Anchor; whole chip navigates | MUI ATL PRI(as a) GEI(Pill) |
| variant | soft (default), outline, solid, ghost; `elevated` = surface fill + shadow step 1 | | FLU(filled, outline, brand) MUI(filled, outlined) M3(flat, elevated) |
| tone | full tone set + the categorical palette Tag uses (file 03) + custom `fillColor` with auto-contrast text | | PRI(IssueLabelToken) CAR MUI |
| shape | rounded, pill | | FLU(rounded, circular) ATL |
| size | xs 16-18, sm 20, md 24, lg 28-32 | see geometry | PRI(16, 20, 24, 32) FLU(20, 24, 32) MUI(24, 32) CAR(18, 24, 32) |
| media | icon; avatar (inset 2px so its circle is concentric with a pill end); colour dot 8px; image thumb | media side inline padding is smaller than text side | MUI FLU M3 NOT |
| content | secondary text (two-line, lg only); count; truncation with max-width + title / tooltip | | FLU |
| remove | remove button always; remove on hover / focus only; `hideRemoveButton` (keyboard delete still works); custom remove icon | remove hit target 24 min via pseudo-element | PRI MUI |
| group | ChipGroup: wrap with gap 4-8; single-row horizontal scroll with edge fade; `overflow=collapse` to "+N" chip opening a popover; align start / end | | FLU(TagGroup) PRI(LabelGroup, visibleTokenCount) ATL(TagGroup) M3(scroll) |
| group | in-input (Tags input / multi-select value area): chips wrap inside a field box, caret after the last chip | | PRI(TextInputWithTokens) OAI(TagInput) FLU(TagPicker) |
| state | rest, hover, active, focus-visible, selected, selected+hover, disabled, disabled+selected, invalid (failed validation in tags input: danger stroke + icon), loading, dragging | | OAI(valid flag) M3(dragged) |

### Geometry

Superseded. The numbers that used to be here were partly recalled. Use the measured table, consensus and Area decision in `construction/01-selection.md`; if the component is marked seed or missing there, run the construction step in `00-START-HERE.md` first.

### Reference markup

```html
<!-- filter chip -->
<label class="area-chip area-chip--filter area-chip--md">
  <input type="checkbox" class="area-chip__input" />
  <svg class="area-chip__check" aria-hidden="true">…</svg>
  <span class="area-chip__label">Assigned to me</span>
</label>

<!-- removable chip with a primary action -->
<span class="area-chip area-chip--input area-chip--md">
  <button class="area-chip__primary" type="button">
    <img class="area-chip__media" src="…" alt="" /><span class="area-chip__label">Mira Okafor</span>
  </button>
  <button class="area-chip__remove" type="button" aria-label="Remove Mira Okafor">…</button>
</span>
```

### Behaviour

Filter = native checkbox; choice = native radios in a `radiogroup`; action = button;
link = anchor. Removable: Delete or Backspace on the focused chip removes it, focus moves
to the next chip, else previous, else the input. In a ChipGroup with remove actions, arrow
keys move between chips (roving tabindex) and the remove button is reached with Tab inside
the chip or the Delete key. Announce removals through a polite live region
("Mira Okafor removed").

### Separate

Tag (static / link classification), Badge (count / status attached to something),
Token (technical reference), Tags input and Multi-select (own the input mechanics;
they consume Chip).

### Demo list

1 default action chip. 2 kinds row. 3 variants x tones matrix. 4 sizes. 5 shapes. 6 media:
icon, avatar, dot. 7 filter group with leading checks, three selected. 8 choice group.
9 removable set. 10 primary + secondary action with divider on hover. 11 menu chip
"Status: Open". 12 two-line. 13 truncation. 14 group wrap / scroll with fade / collapse +N.
15 in-input. 16 states. 17 in-context: filter bar above a table. 18 stress RTL + long.

### Pitfalls

Button nested inside button. Selected check added without reserved width, so the row
reflows. Avatar not concentric with the pill end. Remove target 12px. Removing a chip drops
focus to `<body>`.

---

## Rating

**Job:** capture or display a score on a small ordinal scale.

| Axis | Value | Looks like / aligns | Sources |
| --- | --- | --- | --- |
| mode | interactive; read-only display; `compact` display (one filled star + "4.6" + "(1,204)") | count in muted text, tabular numerals, gap 4 | FLU(Rating, RatingDisplay compact) MUI |
| precision | 1, 0.5 (half fill via clipped overlay), 0.1 for display only | | FLU(step) MUI(precision) |
| max | 5 default, 3-10 | | FLU MUI |
| icon | star default; custom (heart, circle); `filled` vs `outline` empty icons | | FLU(RatingItem appearance) MUI |
| tone | neutral, accent, `marigold` / warning-yellow | | FLU(brand, marigold, neutral) |
| size | sm 12, md 16, lg 20, xl 28 icon | gap 2-4 | FLU(4) MUI(3) |
| function | clearable (click the current value again sets 0); hover preview; hover feedback label ("Good") at inline-end with reserved width; `highlightSelectedOnly` (emoji scales) | | MUI |
| state | rest, hover preview, focus-visible per item, disabled, read-only | | |

Behaviour: a `radiogroup` of visually hidden native radios, one per step (ten radios for
five stars at 0.5). Arrow keys change value. Read-only renders
`role="img" aria-label="Rated 4.5 out of 5"`.
