# Motion and interaction

How Area moves, and how it stays crisp while it does. Motion in Area is quiet: it confirms what
the person did and shows where something came from, then gets out of the way. Nothing bounces,
nothing waits for an animation to finish, and every resting state lands on whole pixels.

Evidence: `docs/research/motion-2026-10-07/` (packages and practitioners; industry design systems
and the target products; crispness and Area's state before this pass). Every value below cites
that research; component specs cite this file.

## Tokens

Durations (the motion axis, `packages/tokens/src/axes/motion.ts`): one number, the Menu's open in
milliseconds (`duration-base`), `0` (None) to `300` in steps of 30, `210` by default (owner,
2026-10-14; it replaced the None, Subtle and Expressive presets, and the owner moved the default from
150 to 210 to match ChatGPT's popover, 220, and Figma's dropdown, 250). Every duration is a third-multiple
of it; `0` and `prefers-reduced-motion` make every one 0.

| Token | Of the number | 150 | 210 (default) | 240 | 300 | Use |
|---|---|---|---|---|---|---|
| `--area-duration-instant` | 0 | 0 | 0 | 0 | 0 | hover-in, press, focus, keyboard-driven changes |
| `--area-duration-fast` | 2/3 | 100 | 140 | 160 | 200 | colour leaving a state; small marks (check, radio dot, chevron); anchored surface exits |
| `--area-duration-base` | 1 | 150 | 210 | 240 | 300 | anchored surfaces entering; indicators that slide (switch thumb, tabs, segmented); dialog exit |
| `--area-duration-moderate` | 4/3 | 200 | 280 | 320 | 400 | dialog enter; drawer and accordion exit; scrim |
| `--area-duration-slow` | 5/3 | 250 | 350 | 400 | 500 | drawer and toast enter; accordion open |

150 is the old Subtle default. The thirds are the old Subtle's ratios; the old Expressive (150 / 250 / 320 / 400) sat within 10ms
of 240. Anchors in the research: 150 Radix Themes and Tailwind, 210 Geist's popover (200) and
ChatGPT's (220), 240 Figma's dropdown (250), 300 Primer's medium, where `slow` reaches 500, Primer's
ceiling for UI motion. The number moves time only; easings are fixed. Loops do not follow it:
Spinner (1s a turn), Skeleton shimmer (3s), indeterminate Progress (1.8s), the Indicator pulse and
Message cursor (1s) and the OTP field's caret blink (1s) run their measured periods and stop at `0` and under reduced motion.
They stop through one token, `duration-loop` (1, or 0 at step 0), which multiplies each period and fades the Skeleton
band and Progress stripe, so the nearest motion scope decides: a non-zero scope inside a `0` scope runs its loops.

Easings:

| Token | Value | Use |
|---|---|---|
| `--area-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | almost everything: colour, enters, exits of anchored surfaces, marks (ChatGPT, Radix Themes) |
| `--area-ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | something moving across the screen while visible: switch thumb, tabs and segmented indicator, accordion height (Figma, Primer) |
| `--area-ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | surfaces sliding from a screen edge, both ways (Vaul) |
| `--area-ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | rarely: a full-screen surface leaving for good |
| `--area-ease-linear` | `linear` | spinners, progress, shimmer |
| `--area-ease-spring` | deprecated | never; an overshoot reads as play, not as Area |

`--area-transition` is the shared colour transition (background, border, colour, box-shadow over
`duration-fast` with `ease-out`).

## Recipes

| Interaction | Enter | Leave | Properties | Notes |
|---|---|---|---|---|
| Hover plate / colour | instant | `fast` ease-out | colours only | `:hover { transition-duration: 0s }` under `@media (hover: hover)`: feedback appears at once and fades away (ChatGPT 0s, Notion 20ms, Linear 0s in / 150 out) |
| Lift (linked Card, gallery tiles) | `fast` ease-out | `base` ease-in | `box-shadow` to the lift shadow (Elevation's `lift` role, shadow8 at half the float's weight; owner, 2026-10-18: the float shadow read "too drastic") | the edge stays; a press drops the lift at once; Elevation 0 steps the edge instead (owner, 2026-10-18; Notion's linked card fades its shadow in 150 / out 200, `docs/research/card-hover-2026-10-18.md`). A selected gallery tile is one line, its own edge in the selection colour, crossfading on `fast` ease-out both ways and lifting like the rest (owner, 2026-10-18: the 2px stroke read thick and landed at once) |
| Press | instant | `fast` | colours | `:active { transition-duration: 0s }`. No press scale by default (no target product shrinks controls) |
| Focus ring | instant | instant | outline / box-shadow | rings never fade in; a ring that animates lags the keyboard |
| Selected / checked colour | instant | `fast` | colours | same rule as hover |
| Small mark (checkbox tick, radio dot, indeterminate bar) | `fast` ease-out | `fast` | `scale` from 0.6 + `opacity` | no overshoot; marks are drawn 1:1 on the control's own pixel grid, one drawing per size, whole pixels at rest |
| Chevron rotation | `fast` ease-out | `fast` | `rotate` | one rule for every chevron that turns (Accordion, Tree view, Nav, Split button). A select trigger's chevron stays still (native Select, ChatGPT, Notion) |
| Switch thumb | `base` ease-in-out | same | `translate` (whole pixels) | track colour on the same clock; never animate `left` / `inset`. The 2px press-stretch may change the thumb's `inline-size` on the same clock (a `scale` would distort the pill ends) |
| Tabs / Segmented indicator | `base` ease-in-out | same | `translate` + `scale`/`inline-size` of one indicator | only if the component draws a moving indicator |
| Popover, menu, select list, combobox list, hover card, date panel | `base` ease-out | `fast` ease-out | `opacity` + `scale` from 0.97 | `transform-origin` at the trigger (overlay.ts writes it); `@starting-style` for the enter; exit by `allow-discrete` on `display`/`overlay` |
| Context menu | `fast` ease-out | `fast` | `opacity` + `scale` from 0.97 | origin at the pointer |
| Tooltip | `fast` ease-out after the open delay | instant | `opacity` + `scale` 0.97 | open delay 500–700ms; once one tooltip is open, neighbours open at once (skip window ~300ms) |
| Dialog, command palette, confirm dialog | `moderate` ease-out | `base` ease-out | `opacity` + `scale` 0.97 | scrim `opacity` on `moderate`; no translate |
| Drawer / sheet | `slow` ease-drawer | `moderate` ease-drawer | `translate` 100% on the edge axis | scrim as Dialog |
| Toast | `slow` ease-out | `base` ease-out | `opacity` + `translate` 8–16px from the toaster's edge | stack reflow on `base` ease-in-out |
| Accordion body | `slow` ease-in-out | `moderate` ease-in-out | `block-size` via `interpolate-size: allow-keywords` + `opacity` | progressive enhancement; without support it snaps |
| Spinner | 0.6–1s per turn, linear | — | `rotate` | stops under reduced motion |
| Skeleton shimmer, pulse | linear, long | — | `background-position` / `opacity` | stops under reduced motion |
| Theme / density change | instant | instant | — | never animate a theme switch: the app sets `data-area-switching` (base.css) on the scope it repaints for one frame, so token-built colour transitions jump (the desktop app does it for Light / Dark and every Canvas setting, hover previews included) |

Exits are one step faster than entrances. Anything opened from the keyboard should feel no slower
than pressing a key: keep keyboard-opened surfaces on the same short clock and never delay focus
for an animation. Interrupted transitions reverse from where they are (CSS transitions do; avoid
keyframe animations for state that can flip back mid-way).

## Crispness

Previews shrink a component whole: the gallery's tiles (fit.ts) and Language's drawings are laid out at 1x and
`scale`d (owner, 2026-10-19: "i want scaling of components to be seamless, if it could sit on half pixels would that
work?"). From 2026-10-07 to then they used `zoom`, which lays the component out again smaller: sharper 1px edges, but
edges snap to device pixels while offsets scale, so parts moved against each other (a Switch's thumb sat high). A
scaled preview keeps exact proportions on half pixels and draws a 1px edge a little softer. The Stage still zooms for
its exact 50–200% stops. Components keep these rules so they stay sharp at 1x and 2x, and so any part placed against
an edge stays put at a fractional scale (browser zoom included):

1. Rest on whole pixels. A resting element never carries a fractional `translate` or a `scale`
   other than 1; centre with layout (flex/grid, `inset` + `margin: auto`), not with
   `translate(-50%, -50%)` on odd sizes; centre a part on its host (Switch's thumb, `inset: 0` + `margin: auto`, 2026-10-19) rather than offsetting it from one edge. Round computed offsets (`round()` in CSS, `Math.round` in JS).
2. Animate `transform`/`opacity` only, and end at identity (`scale: 1`, `translate: 0`). Never leave
   `will-change` on a resting element; it freezes the layer at its first raster.
3. Borders and rings: `border`/`outline` snap to device pixels, `box-shadow` does not. Draw a
   1px edge with `border` or `outline`, and halos (focus) with `box-shadow` only when they are soft.
4. Icons: draw at their native size (`Glyph size={12|16|20|24}`, Fluent cuts at their size); never
   shrink a 16 drawing to 12 with CSS.
5. Geometry that halves an odd number (a 5px dot in a 16 box) lands on half pixels: choose even/odd
   pairs that centre exactly.
6. Text is never scaled at rest. Body text stays on the font's own rendering (`-webkit-font-smoothing`
   is set once in base styles, never per component).

## Reduced motion

`prefers-reduced-motion: reduce` resolves every duration to 0 wherever motion is set, including
subtrees with their own `data-area-motion` (it used to apply only where none was set). Loops
(spinner, shimmer, pulse) stop, through the same `duration-loop` token. Open question for the owner: keep short opacity fades under reduced
motion, as Apple and Emil Kowalski recommend, instead of 0.

## Checking a component

Hover, press, focus by keyboard, open and close each surface twice quickly (interrupt it), in light
and dark, at default and compact, then with reduced motion. Read `getAnimations()` and computed
`transition` values; look for a resting `transform`, `will-change`, half-pixel rects
(`getBoundingClientRect()` x/y ending in .5 at DPR 1), and colour transitions on `:hover`/`:active`.
