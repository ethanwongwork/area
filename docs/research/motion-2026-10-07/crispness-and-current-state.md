# Crispness and motion: current state (2026-10-07)

Owner feedback: the components "seem a bit pixelated" and "the interactions don't seem polished".
This is a diagnosis only. No component CSS was changed.

**Method.** Part A is external research, with sources. Part B reads the code (`packages/styles`,
`packages/tokens`, `packages/react`, `apps/docs`) and the served assets on the dev server at
`http://localhost:4377`, fetched with curl (`/`, `/area.css`, `/gallery.js`, `/button.html`). No browser
was driven, so every rendering effect below follows from the research. None was measured on screen.
The first verification step (end of the report) measures them on screen.

**Headline.** The likeliest cause of "pixelated" is the docs gallery, not the components. The home
page (`/`, title "Components — area", 778 tiles) shows every specimen through a fractional
`scale` transform (at most 0.8, any value written with `toFixed(3)`). A transform scale is applied
after layout and paint snapping, so 1px borders, box-shadow rings, 16px icons and glyph positions
all land on fractional device pixels and are antialiased into soft grey edges. The per-component
pages (`/button.html`, etc.) have no scaled tiles and render 1:1. Two system-level contributors
apply everywhere, including 1:1 pages: the icon line weight of 1.125px, and 12px icon slots that
draw 16px drawings at 0.75. On the interaction side the motion system is sound: tokens, no
`transition: all`, no `will-change`, overlays enter and exit with `@starting-style`, and
`prefers-reduced-motion` is wired. Polish is lost to inconsistency and to gaps: chevrons rotate at
three different speeds or not at all, the Switch thumb animates layout properties on a different
clock from its track, Toast and Command palette have no entrance or exit, the Context menu scales
from its centre, and exits run at the same speed and curve as entrances.

---

## Part A: rules, with sources

Each rule gives the mechanism first, then what to do.

### A1. Layout snaps, transforms do not
Blink lays out in fractional units, but it pixel-snaps box backgrounds and borders to device
pixels when it paints. A `transform`/`scale`/`translate` is applied after that snapping, so a
fractional scale or a translate of a half pixel puts every edge between device pixels. The
rasteriser then antialiases those edges into two partially covered pixels: a soft or grey edge.
The classic case is centring with `top: 50%; translate: 0 -50%` on an element of odd height,
which lands it on a half pixel and blurs its borders and text in Chrome.
*Rule:* position with layout (flex/grid, `margin: auto`, `round()`), not with percentage
translates. If a translate is needed, make the moved size even, or round the offset.
Sources: [Ben Nadel, Chrome blurry borders with percentage translation](https://www.bennadel.com/blog/3399-sanity-check-chrome-63-still-causes-blurry-borders-with-percentage-based-css-translation.htm);
[Emilio Cobos, Border rounding in CSS](https://crisal.io/words/2020/06/13/rounding-borders.html).

### A2. Border and outline widths snap to device pixels; box-shadow does not
CSS Values 4 "snap a length as a border width": a width above 0 and under 1 device pixel becomes
1 device pixel, and a larger width is floored to whole device pixels. All engines do this for
`border`, `outline` and `column-rule`. Box-shadow spread and inset rings are **not** snapped.
*Rule:* draw hairlines with `border`/`outline`, and use a box-shadow ring only where its geometry
is whole-pixel at 1:1. A `0.5px` border is a crisp 1-device-pixel line at 2x. A `0.5px` box-shadow
spread is a smear.
Sources: [CSS Values 4, snap as a border width](https://drafts.csswg.org/css-values-4/#snap-a-length-as-a-border-width);
[Patrick Brosset, Invasion of the border snappers](https://patrickbrosset.com/articles/2024-06-21-invasion-of-the-border-snappers/);
[csswg #3720, hairline border-width](https://github.com/w3c/csswg-drafts/issues/3720).

### A3. `transform: scale` vs CSS `zoom`
`scale()` is purely visual: layout happens at full size and the painted result goes through a
scaling matrix, so the snapping in A1 and A2 is lost. `zoom` scales computed lengths before
layout. Boxes are laid out at the zoomed size and paint-snapped again, borders re-snap under A2,
and text is shaped and laid out at the zoomed font size. `zoom` is standard and cross-engine
since 2024 (Chrome 126 standardised behaviour, Firefox 126 support). It still cannot make a 16px
icon drawing crisp at 12.8px (A5).
*Rule:* to shrink a specimen for display, prefer `zoom` to `scale`. Better still, show it at 1:1,
or at a real smaller density.
Sources: [caniuse, CSS zoom](https://caniuse.com/css-zoom);
[Stefan Judis, scale elements and their layout with zoom](https://www.stefanjudis.com/today-i-learned/css-zoom-to-scale-elements/);
[modern-css, zoom vs transform: scale()](https://modern-css.com/scaling-elements-without-transform-hacks/).

### A4. Composited layers, `will-change` and scale animations
Since Chrome 53, content whose transform scale changes from script is re-rastered at the new
scale, unless it has `will-change: transform`. That property freezes the layer into one bitmap,
which is then GPU-scaled and blurs. CSS animations and transitions keep re-rastering for quality.
`will-change` should be added just before an animation and removed after it. During a scale
animation some softness is normal. The end state must be exactly `scale: 1` with no lingering
`will-change`, so that the final frame is repainted crisply.
*Rule:* entrance scales end at exactly 1. Never leave `will-change: transform` or
`translateZ(0)` on resting UI. Animate a wrapper rather than the text node.
Sources: [Chrome, Re-rastering composited layers on scale change](https://developer.chrome.com/blog/re-rastering-composite);
[Chrome sample, will-change rasterization](https://googlechrome.github.io/samples/css-will-change-transform-rasterization/);
[Vercel Web Interface Guidelines](https://vercel.com/design/guidelines) ("scaling text can change
smoothing; prefer to animate a wrapper").

### A5. SVG icons: stroke alignment, odd and even widths, viewBox scaling
A stroke is centred on its path. A 1px stroke on an integer coordinate covers half of two pixels
(a grey 2px line). On a .5 coordinate it fills one pixel exactly. Even widths (2px) want integer
centres. A non-integer width (1.125px, 1.31px) always leaves a fringe, at any position. Scaling a
drawing by a non-integer factor (16 to 12 = 0.75, or 16 to 12.8 = 0.8) moves every edge off the
grid. That is why Fluent, Octicons and VS Code ship per-size cuts. `shape-rendering: crispEdges`
turns off antialiasing and wrecks curves, so it is not a fix for icons.
`vector-effect: non-scaling-stroke` keeps a stroke's width but not its position.
*Rule:* draw at the size shown (native cuts). Choose whole-device-pixel stroke widths at the
common DPR. Put straight strokes on the half or whole grid that matches their width parity.
Sources: [MDN, shape-rendering](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/shape-rendering);
[iconvectors, pixel-perfect SVG setup](https://iconvectors.io/tutorials/make-pixel-perfect-svg-icons.html);
[simurai, icon-sharpness limbo](https://simurai.com/blog/2012/03/25/icon-sharpness-limbo).

### A6. Text rasterisation on macOS
Apple removed subpixel (LCD) antialiasing from macOS in Mojave (2018). Only browsers kept the
heavier default. `-webkit-font-smoothing: antialiased` selects greyscale antialiasing: lighter
text that matches the rest of macOS. Vercel recommends it on the root, and it has no effect off
macOS. Skia positions horizontal text with subpixel accuracy on x and rounds the baseline on y
for axis-aligned matrices, so a fractional vertical layout position does not blur glyphs. It can
shift them by a device pixel between siblings. `text-rendering: geometricPrecision` turns off
font-size rounding and hinting. It is not a crispness fix on macOS, where TrueType hinting is
ignored anyway. `font-optical-sizing` only matters for fonts with an `opsz` axis.
*Rule:* keep `antialiased`. Keep font sizes integral. Do not reach for `text-rendering` to fix blur.
Sources: [David Bushell, What's the deal with WebKit font smoothing?](https://dbushell.com/2024/11/05/webkit-font-smoothing/);
[Vercel Web Interface Guidelines](https://vercel.com/design/guidelines);
[MDN, text-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-rendering).

### A7. backdrop-filter and filters
`backdrop-filter` and `filter` force a composited layer and resample their content. Under
fractional transforms they blur. Area uses no `backdrop-filter`. The only `filter` is the colour
picker's band edge (`color.css:338`, a drop shadow on a moving handle), which is fine.

### A8. Motion that reads as polished
- Animate `transform` and `opacity`, never layout properties (`width`, `left`, `inset-*`).
  List transitioned properties explicitly. Never use `transition: all`.
  ([Vercel](https://vercel.com/design/guidelines))
- UI motion stays under about 300ms. Tooltips and small popovers take 125–200ms. Entrances and
  exits use ease-out, never ease-in. Exits are faster than entrances. Do not scale from 0: start
  at 0.9 or more. Popovers scale from their trigger (`transform-origin`), and modals from the
  centre. ([Emil Kowalski, 7 practical animation tips](https://emilkowal.ski/ui/7-practical-animation-tips);
  [emilkowalski/skills review-animations STANDARDS](https://github.com/emilkowalski/skills/blob/main/skills/review-animations/STANDARDS.md))
- Hover feedback of about 100–150ms reads as instant. Anchor overlay motion near the trigger.
  Animations must be interruptible.
  ([Rauno, Web Interface Guidelines](https://interfaces.rauno.me/);
  [Rauno, Invisible details of interaction design](https://rauno.me/craft/interaction-design))
- Provide a reduced-motion variant. Focus rings should appear at once (`:focus-visible`).
  ([Vercel](https://vercel.com/design/guidelines))
- Crispness at the end: the resting frame lands on whole pixels, with `scale: 1` and an integer
  translate, and nothing promoted (A4).

---

## Part B: crispness findings

Severity: **H**, visible on most of the gallery or on every icon. **M**, visible on one component
family. **L**, an edge case or 1x-only.

| # | Where | Cause | Why it blurs | Fix | Sev |
|---|---|---|---|---|---|
| B1 | `apps/docs/src/gallery/fit.ts:19` (`MAX = 0.8`), `:83` (`fit`), `:133` (`stage.style.scale = scales[i].toFixed(3)`); served `gallery.js` also writes `style.scale` | Every gallery specimen is scaled through the CSS `scale` property (a transform) to ≤ 0.8, at arbitrary values such as 0.736 | A1 and A3: layout and paint snapping happen at 1:1, then the matrix shrinks the result. 1px borders become 0.8 CSS px (1.6 device px at 2x, spread over 2–3 device pixels). Box-shadow rings and focus halos smear (A2). 16px icons become 12.8px (25.6 device px), so every Fluent edge at .5 units is off-grid (A5). Glyph positions are scaled after shaping. All of this is the "pixelated" look, on exactly the page the owner sees first. | Show specimens at 1:1 by default and size the tiles to fit them. Where the owner wants the smaller "specimen on a plate" look, use the compact density, a real designed size, instead of shrinking. Shrink only specimens that cannot fit (dialogs, tables), with **`zoom`**, not `scale`, so layout re-snaps and borders stay 1 device pixel (A2, A3). Keep `fit.ts`'s measurement and swap `style.scale` for `style.zoom`. Note that `zoom` changes `getBoundingClientRect` units, so `extent()` must divide by zoom as it now divides by scale. Snap the factor to steps such as 1, 0.75, 0.5 rather than `toFixed(3)`. | **H** |
| B2 | `apps/docs/scripts/component-gallery.mjs:121-135` (`.gallery-tile__view { place-items: unsafe center }`, stage `inline-size: 100%`) | Centring the scaled stage | A stage whose size differs from the view by an odd number of pixels is centred on a half pixel, and the scale then multiplies that offset | With 1:1 or `zoom` this is snapped by layout. If a transform remains, round the stage's offset (or use even stage sizes). | M (part of B1) |
| B3 | `packages/tokens/src/axes/typography.ts:155`, `:166` (`weight-icon: 1.125px`); `packages/styles/src/base.css:27-35` (×1.1715 at 12, ×0.8846 at 20, ×0.8 at 24) | Area-drawn glyphs (`Glyph.tsx`, the checkbox and select chevrons) stroke at non-integer widths: 1.125px at 16, about 0.99 at 12, 1.24 at 20, 1.35 at 24 | A5: a 1.125px line always has a fringe. At 1x, on an integer centre (B4), it is two 56% grey columns. At 2x it is 2.25 device px: two solid pixels plus 12% fringes, so Area glyphs look slightly softer than the Fluent fills beside them, which are drawn on whole pixels. | Recheck against the evidence (the weight matches Geist's 14px stem). If the optical weight must stay, accept the softness at 2x but snap at 1x. Otherwise use whole-device-pixel weights at the common DPR: 1px at 1x and 1.5 (3 device px) or 1 (2 device px) at 2x. This touches the icon-construction rules, so it goes through `area-icon-construction` and `docs/specs/icons.md`, not CSS. | M |
| B4 | `packages/react/src/components/glyphs.ts:6` (`add`: `M8 2.5V13.5M2.5 8H13.5`), `:27` (`subtract`: `M2.5 8H13.5`) and similar straight strokes on integer coordinates | A roughly 1px stroke centred on integer coordinates | A5: at 1x the bar straddles two pixels, so a 1px plus or minus renders as a 2px grey bar. At 2x it is fine. Fluent's `add_16_regular` fills x 7.5–8.5, which is crisp. | For roughly 1px strokes put straight horizontal and vertical centre lines on .5 (e.g. `M7.5 2.5V13.5`). This is an optical change to the drawing, so it needs owner review per the icon rules. | L (1x) |
| B5 | `packages/tokens/src/axes/density.ts:136`, `:157` (xs `icon: 12`, default and compact); `apps/docs/src/icons.tsx:1-25` (Fluent 16 and 20 cuts only: 470 × 16, 61 × 20, 0 × 12); about 22 `icon-sm`/`icon-xs` uses in components | 12px icon slots draw 16px drawings at 0.75 | A5: every Fluent edge at n.5 units moves to n×0.75. At 1x, half the edges are fractional and soft. At 2x most land on whole device pixels (×1.5), so the damage is smaller but not zero. xl's 24 slot scales 16 cuts by 1.5. | Use Fluent's native `_12_regular` cuts where they exist (Fluent ships 12 for most UI glyphs), and `_24_` for 24. Regenerate with `gen-icons.mjs`. For Area glyphs at 12, draw a 12 grid version, or keep 16 drawings only in 16 and 24 slots. | M |
| B6 | `packages/styles/src/components/choice.css:181-185` (checkbox check mask `center / 75%`), `:195-198` (radio dot `inset: 30%`) | The mark's box is the 14px padding box of a 16px control with a 1px border | Check: 75% of 14 = 10.5px mask at a 1.75px offset, stroke 1.75 × 10.5/16 = 1.15px, so it is off-grid. The indeterminate dash centres on y = 8 with a 1.15 stroke and is soft at 1x. Radio: 30% of 14 = 4.2px inset, a 5.6px dot at a 4.2 offset, so its edge is soft on all sides. | Use whole-pixel sizes: `mask-size: 12px` (or 10px) and an integer offset, and a radio dot of `inset: 4px` (6px dot) or `5px` (4px dot), from the spec. Draw the check on the mask's own grid with a whole-device-pixel stroke. | M |
| B7 | `packages/styles/src/components/nav.css:166-173` (marker `inset-block-start: 50%; translate: 0 -50%; block-size: calc(1cap + 4px)`) | The marker's height is about 13.94px (Geist cap about 0.71em at 14px), centred with a −50% translate | A1: a fractional height plus a half-pixel translate gives soft top and bottom ends on the 3px pill | Round the height: `round(nearest, calc(1cap + 4px), 2px)`. Centre with `inset-block: 0; margin-block: auto`, not a translate. | L |
| B8 | `packages/styles/src/components/slider.css:56-62` (`.area-slider__marks i { inline-size: 1px; transform: translateX(-50%); inset-inline-start: var(--_mark) }`) | A 1px tick moved by −0.5px from a percentage position | A1 and A5: at 1x every tick is a 2px grey smear. At 2x it depends on the percentage. | Use a border or `outline` hairline. Snap the position: `inset-inline-start: round(nearest, calc(var(--_mark) - 0.5px), 1px)` with no translate (works where the track width is known in px; otherwise use `round()` on a calc of the track length). | L |
| B9 | `packages/styles/src/components/indicator.css:43`, `:46`, `:50`, `:58` (`translate(calc(var(--_x) * var(--_shift)) …)` with `--_x/--_y: ±50%`) | A count or dot is centred on a corner by translating −50% of its own size | A1: counts are content-sized (17px for "12", etc.), so odd widths land on half pixels. The count's text and its 1px surface-coloured ring (`indicator.css:44`, a box-shadow, A2) go soft. | Place the anchor point with layout: put the indicator in a 0×0 box at the corner and centre it with flex, or round the offset with `round(nearest, …, 1px)` on a measured size. Even out min-widths. | M |
| B10 | `packages/styles/src/components/context-menu.css:15-16`; `packages/react/src/components/ContextMenu.tsx:52-53` | The pointer `clientX/Y` is written straight to `left`/`top` without rounding (all other overlays round, `overlay.ts:94`) | Pointer coordinates can be fractional (trackpads, page zoom), which puts the menu's text and borders on fractional pixels. The other overlays already round. | `Math.round` the coordinates, as `computePosition` does | L |
| B11 | `packages/styles/src/inset.css:222` (`margin-block-start: max(0px, calc((var(--_size) - 1cap) / 2))`), `:172`, `:191` (`padding-block: 0.25em` = 3.5px at 14px), `packages/styles/src/components/code.css:140` (`font-size: max(…, 0.875em)` = 12.25px in 14px text) | Fractional vertical offsets and one fractional font size | A6: glyph baselines round on y, so this is not blur. It can shift a label by one device pixel against a sibling that resolved the other way. The fractional font size is shaped at a non-grid size. | Wrap these offsets in `round(nearest, …, 1px)`, as the horizontal insets already are (`inset.css:22-23`). Clamp Code's size to the integer ramp. | L |
| B12 | `packages/tokens/src/axes/surface.ts:48`, `:62`, `:76` (`shadow-1: 0 0.5px 1px -0.5px`) | A half-pixel shadow offset | Soft by design (it is a blurred shadow). At 1x the 0.5px offset reads as a faint double edge under switch thumbs and slider thumbs. | Keep it as measured, but on a 1x review prefer `0 1px 1px -1px` if it reads muddy | L |
| B13 | `packages/styles/src/reset.css:14-15` (`-webkit-font-smoothing: antialiased`) | Greyscale text antialiasing | Not a defect. It is what Vercel and macOS itself do (A6). It makes text lighter, which can read as thin beside the 1.125 icons. | Keep | — |
| B14 | `apps/docs/scripts/layout.mjs:612` (`.docs-pixel-preview { image-rendering: pixelated }`) | Intentional nearest-neighbour preview | Only on the 64px pixel preview, not on specimens | Keep. Confirm it is never applied to a specimen. | — |

**Checked and found crisp.** Overlays round their position and transform origin (`overlay.ts:94`,
`:199`). Overlay scale ends at exactly `scale: 1` (`surface.css:805`, `:1458`). Drawer rests at
`transform: none`. There is no `will-change`, `translateZ`, `backdrop-filter` or
`transition: all` anywhere: the served `area.css` was checked too. Radii and horizontal insets
are rounded with `round()` (`emit/base.ts`, radius derivations; `inset.css:22-23`). The popover
arrow translates −50% of 32 and 14, which are even sizes. Control heights and font sizes are
integers on the ramp. Fluent fills sit at their native 16 and 20 sizes in 16 and 20 slots.

---

## Part C: current motion, per component

Motion axis (`packages/tokens/src/axes/motion.ts`), default preset `subtle`: instant 0, fast
100ms, base 150ms, slow 250ms. `ease-out` = `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out),
`ease-in-out` = `(0.65, 0, 0.35, 1)`, `ease-spring` = `(0.34, 1.56, 0.64, 1)`. The shared
`--area-transition` (`emit/base.ts:233-234`) covers `background-color`, `border-color`, `color`
and `box-shadow` at fast / ease-out. Reduced motion maps to the `none` preset on
`:root:not([data-area-motion])` (`emit/css.ts:176-180`).

| Component | Property | Duration | Easing | Notes and issues |
|---|---|---|---|---|
| Button, Chip, Tag, Badge (link), Segmented item, Nav item, Menu item (`surface.css:1096`), Prompt suggestions, Breadcrumb plate, Card (linked), Code copy, Tabs tab and `::after` indicator, Select, Input, Textarea, Number field, Input group, Tag picker, Custom select trigger, Date picker trigger, Composer, Checkbox and Radio control, Radio card, Slider thumb | `--area-transition` (bg, border, color, box-shadow) | fast 100 | ease-out | Consistent. **`:active` also eases over 100ms**, so a quick click barely shows the press. Focus halos on fields are `box-shadow`, so **the field focus ring animates** while its `outline` (increased contrast) snaps (`input.css:71-74` and the field siblings). |
| Command palette row (`command-palette.css:146`), Table cell (`navigation.css:179`) | background-color | fast | ease-out | Consistent |
| Calendar day (`calendar.css:83`), Alignment picker, Box field, Color controls | — | — | — | **Hover has no transition**, unlike every other plate |
| Card reveal overlay (`surface.css:458`), Message user actions (`message.css:56`), Property list handle (`:76`), Panel chevron (`:366`), Prompt dismiss (`:92`), Tree view actions (`:112`) | opacity | fast | ease-out | Consistent reveal-on-hover |
| Accordion chevron (`accordion.css:113-114`) | `rotate` | fast 100 | ease-out | Has its own reduced-motion rule. **The content opens and closes with no height motion** (`hidden`, `Accordion.tsx:79`). |
| Split button chevron (`split-button.css:100-101`) | `transform: rotate` | **base 150** | ease-out | A different speed and property from Accordion |
| Tree view chevron (`tree-view.css:71-73`), Nav group chevron (`nav.css:259-261`) | rotate | **none** | — | **Snaps.** Three chevron behaviours in one system. |
| Switch track (`switch.css:77`) | `background` | fast | ease-out | **`border-color` also changes on check (`:94-95`) but is not transitioned**, so the 1px edge jumps while the fill fades |
| Switch thumb (`switch.css:91`) | `inset-inline-start`, `inline-size` | **slow 250** and fast | ease-out | **Layout properties** (main-thread, re-layout each frame, fractional mid-frames). **The thumb takes 250ms while the track colour takes 100ms**, so they finish apart. Press-stretch widens by 2px through `inline-size`. |
| Checkbox and Radio mark (`choice.css:178-179`, `:192`, `:210`) | `transform: scale(0→1)` | fast | **ease-spring** | **Scales from 0** (A8). Overshoot over 100ms is barely perceptible. There is no exit motion difference. |
| Progress bar (`display.css:286`) | **`inline-size`** | slow | ease-out | A layout property. Prefer `scale` (x) with `transform-origin: inline-start`, or `clip-path`. |
| Progress indeterminate (`display.css:299-310`) | translate keyframes | base × 12 = 1.8s | linear | Reduced motion slows it (3×), motion `none` stops it. Good. |
| Skeleton shimmer (`display.css:169`, `:359`), Spinner (`:254`) | keyframes | slow × 12 = 3s, slow × 4 = 1s | linear | Reduced-motion and `none` handled (`:313-368`) |
| Indicator pulse (`indicator.css:16-17`) | `transform: scale(0→2.8)`, opacity | slow × 4 = 1s | linear | Handled for reduced motion and `none` |
| Indicator anchor show and hide (`indicator.css:43`, `:58`) | transform (translate + **scale 0↔1**), opacity | base | ease-out | Scales from 0. Half-pixel translate (B9). |
| Message streaming cursor (`message.css:70`, `:76`) | opacity keyframes | slow × 4 | **`ease-in-out` keyword**, not `var(--area-ease-in-out)` | The only literal easing |
| Scroll to latest (`scroll-to-latest.css:22-24`) | opacity + delayed `visibility` | fast | ease-out | A good enter and exit pattern |
| Popover, Menu, Combobox, Custom select, Tag picker, Model picker, Split button menu, Badge group overflow, Hover card (`surface.css:1450-1468`) | opacity, `scale` 0.97→1, `overlay`/`display` allow-discrete, `@starting-style` | base 150 (both ways) | ease-out (both ways) | Good structure. `transform-origin` is set from the trigger (`overlay.ts:199`). **Exit equals entrance** in speed and curve (A8: exits should be faster). Reduced motion keeps the fade. |
| Tooltip (`surface.css:1471`) | opacity only | fast | ease-out | Warm-up skip delay exists (`Overlays.tsx:204-221`). With the skip, a follow-on tooltip still fades for 100ms. Radix and Linear show follow-ons instantly. |
| Context menu (`context-menu.css:10-21`) | inherits the Menu enter/exit | base | ease-out | **No `transform-origin`**: it scales from its centre, not from the pointer corner. Position not rounded (B10). |
| Dialog, Confirm dialog (`surface.css:801-826`) | opacity, `scale` 0.97, backdrop opacity | base | ease-out | Good. Centre origin is correct for modals. Exit equals entrance. |
| **Command palette** (`command-palette.css:9-19`) | — | — | — | **No entrance or exit and no scrim fade.** It is its own `<dialog class="area-command-palette__modal">`, not `.area-dialog__modal`, so it snaps open and shut beside a Dialog that animates. |
| Drawer (`drawer.css:12`, `:24-30`, `:62-63`, `:93-100`) | transform translate(±100%), backdrop opacity | **base 150** | ease-out | Correct structure and reduced motion. **150ms for a 384–480px panel is abrupt.** Panels typically take about 250–350ms in, faster out. |
| **Toast** (`surface.css:1373-1440`; `Toaster.tsx`) | — | — | — | **No entrance, exit or stack reflow motion.** Toasts pop in and vanish. |
| **Tabs** (`navigation.css:54-75`) | indicator `background-color` per tab | fast | ease-out | **No sliding indicator.** Selection fades out on one tab and in on the next. |
| **Segmented** (`segmented.css:80-95`) | bg, border, shadow | fast | ease-out | **The selected plate jumps.** There is no sliding thumb, unlike Figma's and Linear's segmented controls. |

### Inconsistencies, in summary
1. Chevrons: Accordion rotates over 100ms (`rotate`), Split button over 150ms (`transform`), and
   Tree view and Nav do not animate.
2. Switch: thumb 250ms on layout properties, track 100ms, border not transitioned.
3. Exits mirror entrances everywhere (same duration, same expo-out). Nothing exits faster or uses
   an accelerating curve.
4. The surfaces that should feel most alive, Toast, Command palette, Tabs, Segmented and the
   Accordion body, have no motion at all, while minor hovers all do.
5. `:active` presses ease over 100ms instead of landing at once.
6. Field focus halos animate (`box-shadow` in `--area-transition`). Button focus rings (outline)
   do not.
7. Two scale-from-0 entrances (Checkbox/Radio mark, Indicator anchor), and one spring on a 100ms
   transition where the overshoot cannot read.
8. One literal easing (`message.css:70`). Literal multiples (`slow × 12`, `base × 12`) are
   spec-marked and follow the axis, so they are acceptable.
9. Reduced motion: the token remap applies only on `:root:not([data-area-motion])`, so a page
   that sets `data-area-motion` explicitly ignores the OS preference unless the component has its
   own `@media` rule (Accordion, Switch, Split button, Drawer, Dialog, Popover and the loops do;
   the token-driven hovers, Progress and Checkbox do not). A subtree with `data-area-motion`
   re-enables motion for reduced-motion users.

---

## Prioritised fixes

### System-wide (tokens, base, inset, gallery)
1. **Gallery: stop transform-scaling specimens** (B1, B2). This has the biggest visible effect.
   Render at 1:1 and let tiles grow, or show the compact density. Use `zoom` only for specimens
   that cannot fit, with snapped steps. Update `fit.ts` (`style.scale` to `style.zoom`, and
   `extent()`'s divisor) and the tile CSS in `component-gallery.mjs`. Then compare the gallery
   with `/button.html` on a 1x and a 2x display.
2. **Icon slots at 12 and 24 use native cuts** (B5). Regenerate the Fluent `_12_` and `_24_`
   cuts with `gen-icons.mjs`, and stop drawing 16-grid glyphs at 12.
3. **Icon line weight** (B3, B4). Take the 1.125px weight and the integer-centred straight
   strokes to the icon-construction review: either whole-device-pixel weights, or
   parity-correct centre lines for the current weight.
4. **Motion tokens**: add an exit pair, e.g. `--area-duration-exit` (about 0.67 × the entrance)
   and `--area-ease-exit` (an ease-in-out or `cubic-bezier(0.4, 0, 1, 1)`), and use them in the
   shared overlay rules (`surface.css:1450-1468`, dialog `:801-823`, drawer). Add a
   `--area-duration-panel` (slow, 250) for Drawer.
5. **`--area-transition` hygiene** (`emit/base.ts:233-234`): add a shared rule that makes
   `:active` instant (`transition-duration: 0s` on press). Move field focus halos out of the
   animated set, or give them `0s`, so focus appears at once.
6. **Reduced motion**: also emit the `none` durations under
   `@media (prefers-reduced-motion: reduce)` for `[data-area-motion]` scopes, unless an explicit
   opt-in attribute such as `data-area-motion-force` is set. Then the OS preference always wins,
   and the per-component `@media` rules can go.
7. **Whole-pixel rounding helpers in inset.css** (B11): round the remaining vertical calc offsets.

### Per component
1. **Switch**: move the thumb to `translate` (computed travel, rounded) on the same duration as
   the track. Transition `border-color` with `background-color`. Do the press-stretch with
   `scale` on x from the leading edge, or keep `inline-size` but on the same clock.
2. **Chevrons**: one rule for Accordion, Split button, Tree view, Nav and Custom select, with one
   property (`rotate`), one duration (fast) and ease-out.
3. **Command palette**: share Dialog's enter and exit (`@starting-style`, scrim fade).
4. **Toast**: enter (translate 8–16px plus fade from the toaster's edge), exit (fade, faster),
   and stack reflow.
5. **Context menu**: set `transform-origin` to the pointer corner and round its coordinates (B10).
6. **Checkbox and Radio**: whole-pixel mark geometry (B6). Enter from `scale: 0.6` to 1 with
   opacity, on ease-out, and drop the spring at 100ms.
7. **Indicator anchor**: layout-centred placement (B9). Enter from 0.6 and opacity, not 0.
8. **Drawer**: slow (250) in, about 200 out.
9. **Tabs and Segmented**: a sliding indicator or thumb, one element positioned with
   `translate`/`inline-size` from the selected item. This is a component decision for the owner.
10. **Accordion body**: height motion via `interpolate-size: allow-keywords` with a `block-size`
    transition (progressive enhancement), or leave it as is. This is an owner decision.
11. **Calendar day, Alignment picker, Box field**: add `--area-transition` to the hover plates.
12. **Nav marker** (B7), **Slider ticks** (B8), **Message cursor** easing token (`message.css:70`),
    **Progress** with `scale` instead of `inline-size`.

### Verification still owed
None of the rendering effects above were observed in a browser in this pass. Before and after
each system-wide fix, capture the same specimen in the gallery tile and on its 1:1 page at DPR 1
and DPR 2 (`area-capture.js`, plus a zoomed screenshot of a 1px border and a 16px icon), and keep
the pairs in this folder.
