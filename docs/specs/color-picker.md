# Color picker spec

**Captures:** `docs/research/captures/color-picker/`
**Peers:** Popover (surface, Complete), Slider (thumb focus, Complete), Select (model menu,
Complete), InputGroup and NumberField (value row, Complete), ColorField, ColorSwatch and
ColorSwatchPicker (Complete), Button (eyedropper, Complete)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Untitled UI's
  solid picker was inspected directly: square saturation/value area, hue and alpha tracks,
  joined color/opacity editing, saved colors. The picker is composed from Area's own
  InputGroup, NumberField and ColorSwatchPicker; it keeps canonical hex callbacks and form
  values. Swatches are document color data and must not change with the UI theme; examples
  use exact family-500 hex values from `palette.json`.
- 2026-09-26: "Refine the color picker to be more like Figma's."
- 2026-09-26: "Add more controls and a swatch picker … also add OKLCH … the swatch picker can
  look like the 4th pic … very robust in how it shows color selection and options." The
  owner supplied four reference images (not stored): a Fill picker with a paint-type
  segmented row and an HSL value row; a rounded picker with Hex select and "Last Colors"
  swatches; Figma's picker with a contrast checker (ratio chip, AA mark, threshold curve with
  a dotted failing side); and the iOS color picker (Grid / Spectrum / Sliders tabs, a 12-column
  hue × lightness grid with a grayscale row, an opacity slider, current color and saved
  colors with +). Screenshots are not measured; values reuse this spec's Figma measurements
  and Area peers.

## Job and boundaries

Edits one solid color (with optional opacity) by area, tracks, typed channels, screen
sampling or saved swatches. ColorField is the single-line hex field for inspector rows;
ColorSwatchPicker is a choice among fixed colors; ColorSwatch only displays. Gradient,
pattern, image and video paints, blend mode, contrast checks and library/variable binding
are Figma features outside this component (see Excluded).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| composition | `header` | A title, tabs or close action above the editor, divided from it | Figma: every picker has a 40px header (Custom / Libraries tabs, +, close) |
| composition | `swatches` (+ `onAddSwatch`) | Saved colors under the editor; opt-in, so the default is the editor alone (owner 2026-10-23) | Figma: "On this page" document colors |
| composition | `eyedropper` | Sample a color from the screen | Figma: 24px button beside the tracks |
| layout | `alpha={false}` | Colors without opacity (a page background in CSS, a theme color) | React Aria/Ant `disabledAlpha`; Figma's page background still shows opacity, so on by default |
| state | `model`: hex, rgb, css, hsl, hsb | Figma's color model menu | Figma format menu (captured open) |
| composition | `views`: spectrum, grid, sliders (+ `view`, `defaultView`, `onViewChange`) | Several ways to choose; a switcher appears with more than one | iOS picker (Grid / Spectrum / Sliders) |
| composition | `grid` (defaults to the Area palette) | A fixed palette to pick from | iOS 12-column grid; Area's palette.json |
| composition | `contrast`: `{ background, level: AA \| AAA }` | Text and UI colors checked while choosing | Figma contrast checker (owner reference) |
| composition | `preview` | New color beside the original, which restores it | iOS current color; Photoshop new/current |
| state | `model`: `oklch` | Perceptual editing; CSS Color 4 | Owner request |
| state | `disabled` | — | Peers |
| variant | `surface` (default), `plain` | `surface` is the floating plate; `plain` drops background, edge and lift for a picker inside a Popover or Panel (audit S17) | Calendar and Toolbar use the same `surface` / `plain` pair |

Excluded: Figma's paint-type row (Solid, Gradient, Pattern, Image, Video, Shader) and blend
mode and contrast buttons. Selecting a non-solid paint would change the owner's file, so
they were captured only at rest (`figma--paint-type-row--rest--light`), and each needs its
own editor (gradient stops, image fit). They are later components, not tabs over a solid
picker. The Libraries tab needs a variable/style system Area does not have.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Page-background picker (solid only) and layer Fill picker, a locked frame in the owner's draft file; read-only (opened, hovered, tabbed, menu opened and closed with Escape) | figma.com editor, Edge, 2026-09-26, 100% zoom, dpr 2 | evidence only | 11 files `figma--*` |
| area | this system | Pass 0 and this pass | localhost gallery | — | `before/area--solid--rest--light`, `area--{default,header,model-rgb,opaque}--rest--light` |
| gap audit | catalogues | Parts per system: React Aria ColorArea/ColorSlider/ColorField/ColorWheel, Mantine, Ant Design, Ark, Fluent | react-aria.adobe.com/ColorPicker, ant.design/components/color-picker, mantine.dev/core/color-input, 2026-09-26 | — | — |

ChatGPT and Notion have no color picker (Notion offers fixed text/background colors in
menus: that is ColorSwatchPicker's job).

## Anatomy

```
figma (layer Fill, 240 × 537, radius 13, white, shadow 0 2 5 .15 / 0 10 16 .12 / 0 0 .5 .12)
header      40px, padding 0 32 0 8, inset 1px rgb(230) divider; tabs 24px; +, close 24px at 8 from the end
paint row   41px, padding 8: six 24px paint radios (4px gap, selected fill rgb(245)); blend and contrast 24px buttons
area        wrapper padding 16 16 0; canvas 208 × 208, radius 5, outline 1px rgba(0,0,0,.1) at -1px
            reticle 16px: 4px white border, fill = current color, rings 1px rgba(0,0,0,.2) outside and inside,
            lift 0 1 3 .1 / 0 5 12 .13 / 0 0 .5 .15 on an inner 12px disc
controls    52px row, padding 0 16, gap 12: eyedropper 24px (hover fill rgba(0,0,0,.05)), tracks column 172px
tracks      16px pills, 12px apart, hairline 1px rgba(0,0,0,.1) at -1px; hue stops start at 8px and end at 100% - 8px;
            opacity: transparent → color over a 10.67px checker (#fff / #e1e1e1); thumbs as the reticle
values      40px row, padding 0 16, gap 8: model select 57 × 24 (1px rgb(230), radius 5, white, text 11/16, chevron 24);
            fields 144 × 24: hex 89 (fill rgb(245), padding 0 8), 1px surface gap, opacity 54 (8px start, % in a 14px box, ink 50%)
swatches    1px rgb(230) top rule, padding-top 11; source select 208 × 24; grid of 24px cells from 12px, 16px chits (radius 20%)
area (this pass)
shell       10 rows wide (240 compact, 280 default), 1px `border-float`, radius container, the Surface axis's edge then
            the floating lift (`--area-shadow-edge`, `--area-shadow-float`); `plain`: none of the three
header      optional, min 40, padding 16 start / 8 end (border counted), `border-decorative` rule
body        padding 16 at both densities (border counted), gap 12 (compact 8): views → contrast → area or grid → controls
            (eyedropper, tracks, preview) → values → note
swatches    opt-in; `border-decorative` rule, padding rhythm 16 12 (border counted; compact 8 at the top), heading row
            (label + save on the header's end inset), ColorSwatchPicker md (20 chips in 28 cells, nine across),
            contiguous cells pulled outward by the cell inset (4), so chips meet the area's edge and sit 16 from the bottom
```

Inset equations: outer inset = border 1 + padding 15 = 16 (Figma 16, no border). Header end
inset = 1 + 7 = 8 (Figma 8). Swatch chip = 1 + 15 − 4 (grid pull) + 4 (cell inset) = 16
(Figma 12 + 4 = 16), at the start and at the bottom (1 + 11 + 4). Tracks: the input is the track, so a 16px thumb travels between the
ends and gradient stops sit half a thumb in (Figma's `linear-gradient(90deg, #f00 8px, …,
#f00 calc(100% - 8px))`).

## Measurements

Generated with `node scripts/capture-compare.mjs docs/research/captures/color-picker/figma--solid-layer-fill--rest--light.json docs/research/captures/color-picker/before/area--solid--rest--light.json docs/research/captures/color-picker/area--default--rest--light.json` (shell and area rows):

| slot · property | figma · solid-layer-fill | area · pass 0 | area · this pass (compact width) |
|---|---|---|---|
| **shell** size | 240 × 537 | 288 × 460 | 240 × 417 |
| **shell** border | 0 | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) |
| **shell** radius | 13px (inner layer) | 12px | 12px |
| **track** (area) size | 208 × 208 (`figma--area`) | 254 × 254 | 208 × 208 |
| **track** edge from shell | 16 (wrapper padding) | 17 17 189 17 | 16 16 193 16 |
| **track** radius | 5px (canvas) | 8px | 6px |
| **track** shadow | outline 1px rgba(0,0,0,.1) −1px | — | inset 0 0 0 1px rgba(0,0,0,.1) |
| **thumb** border | 4 solid #fff | 2 solid #fff | 4 solid #fff |
| **thumb** shadow | 1px .2 ring out + in, lift | 1px rgba(0,0,0,.4) | 1px .2 ring out + in, lift |
| hue/opacity track | 172 × 16, pill | 254 × 12 | 168 × 16, pill |
| eyedropper | 24 × 24, radius 5 | — | 28 × 28 (sm; 24 compact), radius 6 |
| model select | 57 × 24 | — | 57.33 × 28 (sm) |
| opacity field | 54 wide, 8 start, % box 14 | 72 wide | 54 wide, 8.74 start (inset contract), % box 14 |

The Area row was captured before the width became ten rows; at the default scale the shell
is 280px and the area 248px (verified in the browser, not re-captured).

Focus (`figma--hue-slider--focus-visible--light`): Figma thickens the thumb ring to 6px and
draws a 1px #0d99ff outline at −2px. Format menu (`figma--format-menu--open--light`): Hex,
RGB, CSS, HSL, HSB in a dark 24px-row listbox.

## Second pass: views, OKLCH, contrast, preview

| Part | Area value | Basis | Reason / note |
|---|---|---|---|
| view switcher | Segmented sm, full width, first row of the body | iOS tabs; Area Segmented (Complete) | Shown only when `views` has more than one entry |
| grid view | ColorSwatchPicker `layout="palette"`: contiguous square cells filling the width, container radius-control-sm with the area's hairline; selection is the thumb ring (2px white, hairline edges) inside the cell with radius-control-xs | iOS grid; this spec's thumb | Palette = `AREA_COLOR_GRID`, generated from palette.json by `scripts/gen-color-grid.mjs`: 11 hue columns (red → pink by OKLCH hue) × rungs 900 → 100, under a white → neutral → black row |
| sliders view | a track per channel of the current model (Hex/CSS edit as RGB), a one-letter label column (icon-md wide, fg-muted), then opacity; each row the track's height, so tracks sit the rhythm apart as in the spectrum view | iOS Sliders; Figma tracks | Gradients hold the other channels at the current color, computed in CSS from numeric custom properties; RGB, HSB (as HWB) and HSL S are exact two-stop sRGB gradients; OKLCH tracks interpolate `in oklch` |
| OKLCH | L % (0–100), C % of 0.4 (0–100), H ° | CSS Color 4 (`C` percentage reference 0.4) | Integers fit the 3-field row like HSL. Out-of-sRGB input keeps L and h and reduces C (binary search); a status line says so. Conversion matches palette.json's stored OKLCH within 6e-4 for every color (test) |
| contrast | row above the area: pair swatch (current / background), ratio `n.nn : 1`, check or dismiss glyph + level (danger ink when failing); on the area, the failing band dotted (white 55%) between two white edges | Figma contrast checker (owner reference) | Ratio uses the color composited at its opacity over the background. The band is solved per saturation column: WCAG contrast is V-shaped in luminance, so there is a dark edge and a light edge; either can be absent |
| preview | control-sm wide, stretch to the tracks, new over original, hairline edge, checker under alpha; original is a button that restores it | iOS current swatch; Photoshop new/current | Disabled when unchanged |
| save | ghost sm icon button (Fluent `add_16_regular`) in the swatch heading, disabled when the color is already saved | Owner references 1 and 3 (+) | Replaces the "Add" text button; the section shows when `onAddSwatch` is set even with no swatches |

Not built: Figma's paint types, blend mode, library styles; the contrast checker's editable
foreground/background popover (the background is a prop).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| shell · width | `control-sm × 10` (240 / 280) | Figma 240 = 10 × its 24px rows | The inset contract gives 28px fields an 8.74px text inset; at a fixed 240 three RGB digits clipped. Tying width to the row keeps Figma's proportions at both scales |
| shell · surface | `border-float`, radius container (12), the Surface axis's `--area-shadow-edge` (an edge at Surface 0) then the Elevation axis's float role `--area-shadow-float` (0 0 2 + 0 8 16, 3% key at the default step; transparent at 0); `plain` sets background, edge and lift to transparent / none (color.css, `.area-color-picker--plain`) | Peer: Popover | Figma 13px radius, no border; Area popovers are one surface family, and since the 2026-09-26 cohesion audit that family uses Notion's deep lift, close to Figma's 0 10px 16px |
| shell · inset | 16 at both densities (border counted) | Figma 16; compact evidence audit 2026-10-02 | — |
| vertical rhythm | 12, compact 8 | Figma: area→tracks 12, track gap 12, tracks→values 12 | — |
| header | min 40, 16 start / 8 end, `border-decorative` rule drawn inside the 40 (an inset shadow) | Figma 40, inset divider rgb(230) | Figma's tab text sits at 16 (8 + tab padding); a plain title uses the same column. A rule inside a container is never darker than its edge (audit F-6; was border-faint). As a border the rule took 1 of the 40 and a 28 action sat at 5.5 |
| area · size, radius | square, full width; radius-control-sm (6) | Figma 208 square, radius 5 = its control radius | Area's control radius for the sm tier |
| area / track · hairline | inset `token-swatch-ring` (black 10%, white 10% in dark) at `stroke-width`; also the contrast pair and the preview | Figma rgba(0,0,0,.1); consistency pass 2026-10-12 | Dark value not captured |
| thumbs | 16px, 4px #fff ring, current-color fill, an opaque 1px `edge-control-hover` outer edge (#d4, Slider's thumb edge), the swatch ring (black 10%) inside, a fixed lift the Elevation setting does not move | Figma; owner round 16 | Figma's outer edge is black 20% (translucent): it changed colour around the circle where the thumb meets the track. Lift uses −2px spread to draw Figma's 12px shadow disc on one element |
| thumb · focus | Area focus ring (2px at 2px offset) | Peer: Slider, CONTRAST.md | Figma's 1px outline is below Area's focus width |
| tracks | 16px pills, stops half a thumb in | Figma | — |
| opacity checker | the alpha track: ColorSwatch's checker ink as a gradient, three rows (cells 2/3 of the track); preview chips: ColorSwatch's pixel mask, 5 across | Peer: ColorSwatch; batch 10 (Figma's ~5px track cells) | Figma 10.67px #fff/#e1e1e1 |
| eyedropper | Button ghost sm, Fluent `eyedropper_16_regular` | Figma 24px button left of the tracks | Shown only where `window.EyeDropper` exists (Chromium); Figma samples its own canvas |
| values · model | Select sm, content width | Figma 57 × 24 (content width) | — |
| values · fields | InputGroup soft sm; 1px surface divider; opacity 54 with % in a 14px box; value text runs to the field end | Figma | Hex fill is bg-component (247; Figma 245) |
| swatches | opt-in; ColorSwatchPicker md: contiguous control-sm cells (28) with 20 chips, pulled 4 outward; `border-decorative` rule (audit F-6); padding rhythm 16 12; heading row (muted 12/16 label, the save button on the header's 8 end inset) | Figma: rule, padding-top 11 + 1, 24px cells from 12, 16px chits, nine across | Scaled to Area's row as the width is (Figma's 16 in 24 at 24 rows; nine across at every scale). Heading is a label with a save button instead of Figma's source select (no libraries) |
| grid view · selected cell | ColorSwatchPicker `palette`'s: a white outline straddling the cell edge with a 15% line inside (color-swatch-picker.md, round 20) | owner rounds 18–20 | — |
| type | control-sm 12/16 400 | Type ramp (small controls 12/16) | Figma 11/16 450 |

## States

| State | Changes | Evidence |
|---|---|---|
| hover (eyedropper) | Button ghost hover (`bg-component-hover` #f3) | `figma--eyedropper--hover--light`: rgba(0,0,0,.05) |
| focus-visible | Area focus ring on the area thumb and track thumbs; field focus on the value group | Figma thumb focus captured |
| sampling | eyedropper `aria-pressed` while the EyeDropper API is open | — |
| disabled | whole picker 50%, not-allowed cursor | Peers |

## Behavior and accessibility

- `role="group"` named by a consumer's `aria-label`, else `label`; the same name prefixes
  every inner control ("Fill colour hue", "Fill colour hex"). The area is one tab stop: a hidden range input with
  `aria-roledescription="2D slider"` and `aria-valuetext` naming saturation and brightness;
  Left/Right change saturation, Up/Down brightness, Shift ×10, Page Up/Down brightness ±10.
  The area and the tracks stay left-to-right in every script (`dir="ltr"`, ColorPicker.tsx `areaKey`; colour geometry
  is physical, audit F-16). Pointer drag uses pointer capture.
- Hue and opacity are native range inputs. Channel fields are NumberFields (commit on
  Enter/blur, bounds, arithmetic); hex and CSS fields keep a draft while typing and commit on
  Enter/blur, Escape restores. CSS accepts hex, `rgb()`/`rgba()` and `hsl()`/`hsla()`.
- State is HSV, so hue survives gray and black. Values are canonical `#RRGGBB` or
  `#RRGGBBAA`; `name` submits one hidden value; form reset restores the default.
- Forced colors: thumbs draw Canvas/CanvasText rings.

## Peers and consistency

| Peer | Shared role | Peer value | Picker | Match / reason |
|---|---|---|---|---|
| Popover | floating surface | `border-float`, container radius, `--area-shadow-edge` + `--area-shadow-float` | same (`surface`); none (`plain`, inside a Popover) | match |
| Slider | thumb focus | focus-width at focus-offset | same | match |
| Slider | track and thumb | 4px rail, 16 / 16 / 20 thumb with a 1px #d4 edge and a fill dot (slider.css:22-36) | 16px pill tracks with a gradient, 16px thumbs with a 4px white ring and current-colour fill | differs by design (audit F-32 A, owner 2026-09-30): a colour track shows data (hue, opacity, a channel), as Figma's; Slider's rail shows a value |
| ColorField | hex + opacity | soft InputGroup, decorative divider | soft InputGroup, surface divider | Figma's divider is a surface gap; ColorField keeps its own until it gets a pass |
| ColorSwatchPicker | saved colors | 4px gap grid | contiguous cells inside the picker | Figma's document colors are contiguous |

## Visual pass

2026-09-28, Claude in Chrome (batch 10): Figma's colour picker opened from the Page colour row
(nothing edited) beside the gallery's picker at 2x. Structure, order and proportions match (area,
eyedropper beside two pill tracks, model select before joined value fields, rule, swatch source and
16px chits in 24 cells). Changed:

- The opacity part takes Color field's rule (batch 9): sized to three tabular digits and "%", the
  number 9 from the rule and "%" 8 from the end (Figma: "100" ~9 after the rule, "%" at the end).
  The fixed 54 (Figma's, at 11px) squeezed "100" under the "%" at 14px.
- Channel fields hug their digits and share the rest: OKLCH's three fields were 23px each beside its
  wider select and clipped "150"; Figma fits equal shares only at 11px with a fixed 57px select.
  Every picker tile measured: no value clipped.
- The alpha track's checker has three rows (Figma's ~5px cells), from Color swatch's checker ink.
- Found and removed: an older slider block later in `color.css` that overrode this spec's 16px tracks
  and ringed thumbs (see the feedback log).

Observed, not changed: Figma splits a translucent colour's chit (opaque half, checker half); Area
shows the colour over the checker across the whole chit. Dark theme not compared.

Earlier note:

Compared at 100% zoom in light: Figma's layer Fill picker (screenshot in the capture
session) against the gallery tiles. Structure, order and proportions match: square area,
eyedropper left of two pill tracks, model select before joined fields, ruled swatch
section. Area is quieter at the edge (1px decorative border, lighter shadow) and uses its
own radius and 12px type. Observations that changed the build: the border had been counted
twice (content at 17px), fixed with the inset equation; RGB digits clipped at the default
scale, fixed by the ten-row width. Dark theme not compared (Figma's theme is an account
setting).

## Verification

- 11 Figma captures, 1 pass-0 and 4 Area captures; checksums verified.
- Browser: area keys (Shift+Down moved brightness 95 → 85, hex to #7E45D9), model switch to
  RGB (126, 69, 217), no clipped value text at 280 and 240 widths.
- Unverified: dark theme, screen readers, Firefox and Safari (no EyeDropper there), touch.

## Motion and interaction, 2026-10-07

Per `docs/MOTION.md`.

| Interaction | Before | After |
|---|---|---|
| Area thumb, hue / alpha / channel thumbs | follow the pointer directly | unchanged: direct manipulation is never eased |
| Area thumb position at rest | `left` / `top` at the raw percentage (68.31% of the area, a fractional pixel), so the 4px white ring and its 1px edge drew soft | `round(nearest, …, 1px)` on both (behind `@supports`; the 16px thumb's `translate: -50%` is 8, whole) |
| Thumb focus ring (outline) | instant | unchanged |
| Saved swatches | no transition | Color swatch picker's rule (below) |
| Value fields, model Select, header Buttons, view Segmented | their own components | their own passes |

Measured on `color-picker.html`: every thumb rect on whole pixels. Open question: the band edge's
`drop-shadow` filter is a moving composited layer only during a drag; it rests at identity.

## Review note, 2026-10-12 (swatch ring)

- **What changed:** its swatches take the new translucent outline (from Color swatch); nothing else changed.
- **Why:** you asked why the swatch's outline only showed at its corners, then said to apply the fix: the outline is now
  a light translucent line drawn over the colour, so it shows evenly all the way round on every colour.

## States compared, 2026-10-12 (owner, round 16)

The owner asked whether the picker's selected state is correct and consistent, and what the selected states are for
things like it and for inputs while typing. Area separates two roles (`docs/DESIGN_SYSTEM.md`, Selection; `CONTRAST.md`,
focus):

| What it shows | Where | Paint |
|---|---|---|
| **The current value** (what the picker is set to) | area, hue, alpha and channel thumbs | a 4px white ring on the colour, an opaque `border-subtle` outer edge, the swatch ring inside, the lift |
| **The selected option** in a set (state) | saved colours (Color swatch picker) | Selection role: a 2px `fg-selection` ring on a surface plate around the swatch (neutral ink unless the theme makes selection the accent), as Calendar days, Chip, the Nav marker |
| **The selected cell** in a contiguous palette | grid view (`layout="palette"`) | the thumb's ring drawn inside the cell (2px white, opaque outer edge, swatch ring), since cells touch and leave no room for an outside ring |
| **Keyboard focus** (where input goes) | thumbs, tracks, swatches | the focus ring: 2px `focus-color` (#004cb0 light) at 2px offset |
| **Typing in a field** | hex / channel inputs | field focus: the edge turns `focus-color` with a 14% halo |

So selected (state) is neutral ink and focus (keyboard, typing) is the focus blue everywhere; the picker follows both
rules. The one deliberate difference is the palette cell, which uses the thumb's ring because its cells have no gap.

## Review note, 2026-10-12 (round 17)

- **What changed:** the thumbs' outer edge is a solid light grey instead of a see-through dark line, so it looks the same
  all the way round the circle; the line inside the white ring and the palette's selected cell match the new swatch
  outline.
- **Why:** you said the slider circle's outer stroke looked odd; it was see-through, so it showed darker over the colour
  and grey over the panel, changing colour around the circle.

## Feedback log

- 2026-09-26 · owner: more controls, a grid swatch picker like iOS, OKLCH, robust selection →
  views, palette grid, channel sliders, OKLCH, contrast band, preview, save → tests (OKLCH
  vs palette.json, contrast math, rendering); gallery tiles Views, Grid, Sliders, Contrast,
  Preview, OKLCH, and ColorSwatchPicker "Palette grid".

- 2026-09-26 · owner: "more like Figma's" → Figma pass: ten-row width, 16px pill tracks,
  ringed thumbs, eyedropper, color-model value row, header slot, ruled swatch section →
  `figma--*` and `area--*` captures.
- 2026-09-26 · cohesion audit → the surface takes the shared floating lift with Popover and Menu (was shadow-2) → [cohesion-audit.md](../research/cohesion-audit.md); Pass review row added.
- 2026-09-28 · found while replacing the checker: a 2026-09-24 slider block later in `color.css` (12px
  tracks, #ccc / #fff checker, 2px-ring thumbs) overrode this spec's 16px pill tracks and ringed
  thumbs; removed, the measured tracks render again. Preview chips and the alpha track take Color
  swatch's pixel checker (see color-swatch.md).
- 2026-09-28 · batch 10 Claude in Chrome side by side (Figma picker) → opacity sized to content, channel
  fields hug their digits, alpha checker 3 rows → every picker tile measured, no clipped value.
- 2026-09-30 · audit F-6 (owner rule 09-27) → header and swatch rules take `border-decorative` #f3 (was `border-faint` #e2, darker than the container edge) (color.css:222, 359).
- 2026-09-30 · audit S10 (owner) → the surface reads the Surface axis role `--area-shadow-float` (same recipe; `none` under Flat) (color.css:214).
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → `variant`: `surface` (default, the floating plate) or `plain` (no background, edge or lift, for a picker inside a Popover or Panel; color.css:217-225), gallery tile "Variant / plain"; a consumer's `aria-label` names the group and every inner control ("Fill colour hue"), `label` is the fallback (ColorPicker.tsx:141; it used to override `aria-label`).
- 2026-09-30 · audit F-32 (owner pick A) → kept: tracks and thumbs stay Figma's (16px pills, ringed thumbs), deliberately unlike Slider's 4px rail; recorded under Peers.
- 2026-10-02 · compact evidence audit → the body inset holds at 16 at compact (was 12; Figma's color picker 16) (R5) docs/research/compact-evidence-2026-10-02/README.md.
- 2026-10-03 · radius audit D1 (owner) → the container role is 12 at compact too (was 8; Figma 13, Cursor 12-14), so this family's surface is 12 at both densities; rows concentric with a floating surface follow (compact 24 rows r8). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → the area thumb's resting position is rounded to whole pixels (`color.css`). See "Motion and interaction, 2026-10-07".
- 2026-10-12 · owner, review round 16 (needs changes): "the slider circle transparency on the outer stroke is kinda odd?
  can you look into it? also is the color selected state correct/consistent? what are the selected states for things like
  that and inputs when typing, etc" → the thumb is as tall as its track, so the translucent 20% outer edge sat half over
  colour and half over the panel; now opaque `border-subtle`, the inner edge the swatch ring (10%); the palette's selected
  cell takes the same. States compared above (no change to selection or focus: they follow the system's roles). Round 17.
- 2026-10-12 · owner, review round 17: approved.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → the area, track, contrast-pair and preview hairlines are the swatch ring token at `stroke-width` (were a literal 1px and colour), and the thumb's outer edge reads Slider's `edge-control-hover` (same #d4 as `border-subtle`; stronger under increased contrast) (color.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-14 · owner: "continue working on the next axis" → Surface is one number, the frame's width: `1` (Default) or `0` (Borderless) (was `outlined` / `borderless`; axes/surface.ts). At 0 the surface picker lists the Surface axis's `shadow-edge` first in its box-shadow, ChatGPT's frameless-menu edge (`0 0 1px` black 62%, and in dark an inset `0 0 1px` white 20%; captured 2026-10-13), so it keeps an edge at Elevation 0 and in dark, where it had none. Owner approved ("go with your recs"), review https://claude.ai/artifact/L4TCF2W5zcjvBK7xZmaDBN (docs/research/surface-2026-10-14.md).
- 2026-10-23 · owner: "can the default state just be top part, without the saved colors? can you make sure the design of the sliders, and the size of the swatches, and the overall design of each variant, the placement of every control, the alignment, gaps, padding, layout, etc are all correct and intentional?" → measured every tile at the default and at density 28/36 × type 12–16, light and dark: the Default tile is the editor alone and Saved colors is its own tile (the component already made them opt-in); saved chips are md, 20 in 28 (were 16 in 24, Figma's size at its 24 rows, small beside Area's 28 rows), nine across; the chips sat 1 off the area's edge (the pull used the rhythm, not the cell inset) and 12 from the bottom at compact, now 16 at both; the save button takes the header's 8 end inset; the sliders view's tracks were 16 apart (the label's line set the row), now the rhythm, as hue and opacity; the header's rule is drawn inside its 40, so a 28 action centres on whole pixels (it sat at 5.5); the Disabled tile no longer carries saved colors and Plain no longer drops opacity (one variant per tile). Checked, unchanged: area and track geometry (16 inset, 12 / 8 rhythm, 16 pills, thumbs), the value row, preview, contrast row, grid view.

## Review note, 2026-10-23

- **What changed:** the default picker is the editor alone; saved colours are their own tile. Saved chips are a size up
  (20, from 16) and line up with the area's edge; the + sits where the header's close does; the sliders view's tracks
  are as far apart as the hue and opacity tracks; the header's close button sits on whole pixels.
- **Why:** your note that the default should be just the top part, and that every size, gap and alignment should be
  intentional. The chips were Figma's size at Figma's smaller rows; scaled to Area's rows they keep Figma's nine across.

## Review note, 2026-10-19 (round 56)

- **What changed:** its swatches show the thin translucent ring again (black 10% in light, white 10% in dark), solid colours included.
- **Why:** Color swatch's colour layer had been painting over its ring since a 2026-10-12 merge, so no swatch showed its outline; the fix is in Color swatch (docs/specs/color-swatch.md, round 56), and every family that draws one shows it.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.
