# Motion and interaction

How Area moves, and how it stays crisp while it does. Motion in Area is quiet: it confirms what
the person did and shows where something came from, then gets out of the way. Nothing bounces,
nothing waits for an animation to finish, and every resting state lands on whole pixels
(scaled previews of a component are the one exception, under Crispness).

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
ceiling for UI motion. The number moves time only; the curves are the Easing setting (below). Loops do not follow it:
Spinner (1s a turn), Skeleton shimmer (3s), indeterminate Progress (1.8s), the Indicator pulse and
Message cursor (1s), Step's running shimmer (2s) and the OTP field's caret blink (1s) run their measured periods and stop at `0` and under reduced motion.
They stop through one token, `duration-loop` (1, or 0 at step 0), which multiplies each period and fades the Skeleton
band and Progress stripe, so the nearest motion scope decides: a non-zero scope inside a `0` scope runs its loops.

Easings: one setting, `data-area-easing` (`axes/easing.ts`, owner 2026-10-19: "an easing setting (Standard, Snappy,
Gentle, Spring) beside the duration"). Each value sets the same roles, so components read the tokens below and never
branch on it. Subtle is the default since 2026-10-24 (owner: "not great easing ... subtle, clean"); every curve is a
product's own (`docs/research/motion-2026-10-07/design-systems.md`, `docs/research/motion-subtle-2026-10-24/systems.md`):

| Easing | `ease-out` | `ease-in-out` | `ease-in` | `ease-drawer` | From |
|---|---|---|---|---|---|
| Subtle (default) | `(0.22, 1, 0.36, 1)` | `(0.65, 0, 0.35, 1)` | `(0.4, 0, 1, 1)` | `(0.32, 0.72, 0, 1)` | bencho.dev, Base UI's panels; then Standard's. 40% of the way in the first tenth of the time (Standard 49%), so a surface eases in rather than snapping |
| Standard | `(0.16, 1, 0.3, 1)` | `(0.65, 0, 0.35, 1)` | `(0.4, 0, 1, 1)` | `(0.32, 0.72, 0, 1)` | ChatGPT, Radix; Figma; Material, Tailwind; Vaul (the default until 2026-10-24) |
| Snappy | `(0.19, 1, 0.22, 1)` | `(0.6, 0, 0.2, 1)` | `(0.6, 0, 0.8, 0.6)` | `(0.19, 1, 0.22, 1)` | Linear's expo-out; Primer; Atlassian in-practical |
| Gentle | `(0.33, 1, 0.68, 1)` | `(0.33, 0, 0.67, 1)` | `(0.5, 0, 1, 1)` | `(0.33, 1, 0.68, 1)` | Primer overlay and side sheet; Fluent EasyEase; Spectrum |
| Spring | `(0.175, 0.885, 0.32, 1.1)` | `(0.175, 0.885, 0.32, 1.275)` | `(0.4, 0, 1, 1)` | `(0.175, 0.885, 0.32, 1.1)` | Geist's swift; Material's switch handle; exits never overshoot |

`ease-linear` is linear at every value, and the deprecated `ease-spring` keeps its value. Reduced motion makes every
duration 0, so the curve no longer applies there.

| Token | Value (Subtle) | Use |
|---|---|---|
| `--area-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | almost everything: colour, enters, exits of anchored surfaces, marks, a press's give |
| `--area-ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | something moving across the screen while visible: switch thumb, tabs and segmented indicator, accordion height (Figma, Primer) |
| `--area-ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | surfaces sliding from a screen edge, both ways (Vaul) |
| `--area-ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | rarely: a full-screen surface leaving for good, and a lift fading out |
| `--area-ease-linear` | `linear` | spinners, progress, shimmer |
| `--area-ease-spring` | deprecated | never; an overshoot reads as play, not as Area |

`--area-transition` is the shared transition (background, border, colour, box-shadow and `scale` over `duration-fast`
with `ease-out`): the leave of every state, the release of a press.

Feedback: one setting, `data-area-feedback` (`axes/feedback.ts`, owner 2026-10-24: "alot of the components dont have
any visible motion/interaction animation ... implement the subtle package as the default"; bencho.dev the reference).
It sets how a control answers the pointer, on top of Speed and Easing: hover's and a press's arrival as shares of
`duration-fast`, and the give under a pointer press by size. Derived in `emit/base.ts`: `--area-hover-in` and
`--area-press-in`. Speed 0 makes both 0; reduced motion resolves Feedback to Off as well.

| Feedback | Hover in | Press in | Give (sm · md · lg · wide) | From |
|---|---|---|---|---|
| Off | 0 | 0 | 1 · 1 · 1 · 1 | the 2026-10-07 behaviour (ChatGPT 0s; Linear 0 in) |
| Subtle (default) | 0.65 × fast (≈91ms) | 0.65 × fast (≈91ms) | 0.96 · 0.97 · 0.975 · 0.985 | bencho 0.96 / 0.985 in 90ms; Linear's site 0.97; Raycast 0.98; Emil Kowalski 0.97 |
| Pronounced | 1.15 × fast (≈160ms) | 0.65 × fast | 0.94 · 0.95 · 0.96 · 0.975 | bencho's 160ms hover plates |

Never given: inputs, Switch, Checkbox, Radio, Slider (its knob lifts instead, Recipes), Tabs, Segmented options, menu triggers (`aria-haspopup`), a key
press (`:focus-visible`), disabled and loading controls. Given: Button (by size; full width the wide amount), Chip
(small), choice cards and linked Cards (wide). Library-wide the give stays at or under 4% (Geist, Radix Themes and
shadcn don't scale at all).

## Roles

Every transition is one of five intents (owner, 2026-11-07, system gaps M3; Carbon's productive set, Primer's and
Atlassian's composite tokens). Pick the role, then take its clock and curve; never pair a duration and a curve by hand.

| Role | Clock | Curve | Use |
|---|---|---|---|
| Hover | `hover-in` in, `fast` out | `ease-out` | a plate, an edge or a reveal answering the pointer |
| State change | `press-in` / `hover-in` in, `fast` out (`--area-transition`) | `ease-out` | selected, checked, pressed, a colour or a lift |
| Enter | `base` (anchored), `moderate` (modal), `slow` (from an edge, a toast) | `ease-out`; `ease-drawer` from an edge | a surface arriving: fade (`fade-*`) and the overlay scale, or a slide |
| Exit | one step faster than its enter: `fast`, `base`, `moderate` | as its enter; `ease-in` only for a full-screen surface leaving for good | a surface leaving |
| Move | `base` | `ease-in-out` | something visible travelling or resizing: a thumb, an indicator, a body opening, a panel's width |

The opacity of any role reads the matching `fade-*` token, and its movement (scale, translate, rotate, size) the
`duration-*` token, so reduced motion can keep the one and drop the other (below). An exit is never slower than its
enter (`cohesion.test.mjs`).

## Recipes

| Interaction | Enter | Leave | Properties | Notes |
|---|---|---|---|---|
| Hover plate / colour | `hover-in` ease-out | `fast` ease-out | colours only | `:hover { transition-duration: var(--area-hover-in) }` under `@media (hover: hover)`: ≈91ms at Feedback Subtle, 0 at Off (ChatGPT 0s, Notion 20ms, Linear 0s in / 150 out; bencho 160 in). A highlight the keyboard moves stays instant |
| Lift (linked Card, gallery tiles) | `fast` ease-out | `base` ease-in | `box-shadow` to the lift shadow (Elevation's `lift` role, shadow8 at half the float's weight; owner, 2026-10-18: the float shadow read "too drastic") | the edge stays; a press drops the lift at once; Elevation 0 steps the edge instead (owner, 2026-10-18; Notion's linked card fades its shadow in 150 / out 200, `docs/research/card-hover-2026-10-18.md`). A selected gallery tile is one line, its own edge in the selection colour, crossfading on `fast` ease-out both ways and lifting like the rest (owner, 2026-10-18: the 2px stroke read thick and landed at once) |
| Press | `press-in` ease-out | `fast` ease-out | colours + `scale` to the give | `:active { transition-duration: var(--area-press-in) }`; the give only for a pointer press (Feedback, above) |
| Focus ring | instant | instant | outline / box-shadow | rings never fade in; a ring that animates lags the keyboard |
| Selected / checked colour | `hover-in` | `fast` | colours | same clock as hover; a check made by the keyboard lands at once |
| Small mark (checkbox tick, radio dot, indeterminate bar) | `fast` ease-out | `fast` | `scale` from 0.6 + `opacity` | no overshoot; marks are drawn 1:1 on the control's own pixel grid, one drawing per size, whole pixels at rest |
| Chevron rotation | `fast` ease-out | `fast` | `rotate` | one rule for every chevron that turns (Accordion, Tree view, Nav, Split button). A select trigger's chevron stays still (native Select, ChatGPT, Notion) |
| Switch thumb | `base` ease-in-out | same | `translate` (whole pixels) | track colour on the same clock; never animate `left` / `inset`. The 2px press-stretch may change the thumb's `inline-size` on the same clock (a `scale` would distort the pill ends) |
| Tabs / Segmented indicator | `base` ease-in-out | same | `translate` + `inline-size` of one indicator | Segmented slides one plate since 2026-10-24 (`data-plate`, docs/specs/segmented.md); Tabs slide one bar since 2026-10-26 (`data-indicator`, docs/specs/tabs.md), Code block's language tabs too |
| Slider thumb and fill | `fast` ease-out | same | `--_slider-ratio` (registered), the thumb by `translate` | the thumb and fill are drawn over the native input (owner 2026-10-26), so every change that is not a drag eases: a click on the track, a key step, a controlled change, the settle onto a step. A drag follows the pointer exactly once it moves (`data-dragging`; Apple, Radix, Material 3); a stepped range glides between steps (`glide`). A host whose change is costly applies it in `onValueCommit` (release, key step) or once the pointer rests, never on every step of a drag (the Inspector's bars, 2026-10-25) |
| Slider press | `press-in` ease-out | `fast` ease-out | `scale` to `1 + (1 − feedback-scale) × 4` (1.12 at Subtle) | the knob is picked up, so it grows rather than gives; the bar lifts its grip; pointer only, 1 at Off |
| Popover, menu, select list, combobox list, hover card, date panel | `base` ease-out | `fast` ease-out | `opacity` + `scale` from 0.97 | `transform-origin` at the trigger (overlay.ts writes it); `@starting-style` for the enter; exit by `allow-discrete` on `display`/`overlay` |
| Context menu | `fast` ease-out | `fast` | `opacity` + `scale` from 0.97 | origin at the pointer |
| Tooltip | `fast` ease-out after the open delay | instant | `opacity` + `scale` 0.97 | open delay 500–700ms; once one tooltip is open, neighbours open at once (skip window ~300ms) |
| Dialog, command palette, confirm dialog | `moderate` ease-out | `base` ease-out | `opacity` + `scale` 0.97 | scrim `opacity` on `moderate`; no translate |
| Drawer / sheet | `slow` ease-drawer | `moderate` ease-drawer | `translate` 100% on the edge axis | scrim as Dialog |
| Panel width (a resizable Panel's width set by the app) | `moderate` ease-drawer | `moderate` ease-drawer | `inline-size` | never while it is dragged (`data-resizing`), so the edge stays under the pointer; the desktop app's Sidebar widening for a list (2026-11-01). Off under reduced motion |
| Region shown or hidden (the desktop app's Sidebar and Inspector, ⌘B and ⌥⌘B) | `moderate` ease-drawer | `moderate` ease-drawer | the region's `translate` from its edge; the Canvas's edge moves with it, its content never stretched | a view transition (studio.tsx `moveRegions`), as the regions mount and unmount; at Motion 0 and under reduced motion it lands at once. The smoothness pass, 2026-11-11 |
| Resize edge (Splitter's handle, Panel's resizable edge; components audit N6) | a step after the pointer rests 300 ms | instant | the line's width (1 → 2) and ink, the hit area (4 → 12) | a wait, never an animation (`transition` 0s with a 300 ms delay, splitter.css `--_sash-delay`), so passing over an edge never flashes and reduced motion has nothing to stop; while dragging the line takes the accent at once. A drag follows the pointer exactly |
| Hover-revealed actions (Toolbar `floating`, Panel `revealActions`, Code block `revealActions`, Nav row actions) | instant | `fade-fast` ease-out | `opacity` | the actions keep their place, so nothing reflows; hidden, they stay in the tab order and focus inside the host shows them; a touch screen always shows them |
| Toast | `slow` ease-out | `base` ease-out | `opacity` + `translate` 8–16px from the toaster's edge | stack reflow on `base` ease-in-out |
| Folder open (drop target, `open`) | `base` ease-in-out | `fast` ease-in-out | the pocket's `d` (it tips forward: top 88 → 152, flaring 16 past each side) and the sheet's `translate` | shape moving while visible, so ease-in-out; nothing in a File tile moves on hover (PRODUCT_UI rule 2); docs/specs/folder.md |
| Accordion body, and every disclosure body | `slow` ease-in-out | `moderate` ease-in-out | `block-size` via `interpolate-size: allow-keywords` + `opacity`, with the body's own gap (margin, list padding) | progressive enhancement; without support it snaps. Since 2026-10-26 the same rule opens Step's body (and Step group's, Reasoning's), Plan's and Queue's items and an Edit summary file's diff (accordion.css; they hide with `hidden`, so the open eases from `@starting-style` and `display` is held through the close). Tree view and Panel sections stay instant (Figma's layers and panels, Finder's outline) |
| Spinner | 1s per turn, linear | — | `rotate` | stops at Motion 0 and under reduced motion. Its `delay` (300 or 1000 ms, components audit V6) is a wait, not motion: it holds under reduced motion and Motion 0, and the ring then appears at once, with no fade |
| Skeleton shimmer, pulse | linear, long | — | `background-position` / `opacity` | stops under reduced motion; `delay` as Spinner's |
| Chart (components audit N7) | instant | instant | none | no draw-in and no transition: a series the legend hides or shows, the hovered value's band, guide, points and tooltip land at once, so reduced motion and Motion 0 have nothing to stop. Its loading Skeleton keeps Skeleton's row |
| Dialog header rule (`data-scrolled`, V1) | `fade-fast` ease-out | `fade-fast` ease-out | `opacity` | appears once the body leaves its top, leaves when it returns; the fade clock, so reduced motion keeps it short |
| Theme / density change | instant | instant | — | never animate a theme switch: an app sets `data-area-switching` (base.css) on the scope it repaints for one frame, so token-built colour transitions jump; the desktop app instead finishes the transitions a change starts, once its commit is written (studio.tsx `switchInstantly`, 2026-10-25), since taking the attribute off restyled the scope a second time (130 to 210ms a setting). It does this for Light / Dark and every Canvas setting, hover previews included; the chrome and the Canvas take a setting in the same commit, one restyle, and the Inspector's bars set a value when a drag lets go or rests (inspector-rows.tsx). A preview of a theme may crossfade its picture (Setup's stage, below) |
| A turn of a conversation (Setup's chat) | rise 8px and fade, `slow` ease-out | — | `opacity` + `translate` | a new question, and a reopened one's choices; the thread scrolls to it smoothly (instantly under reduced motion). Earlier turns stay; nothing leaves |
| A preview's picture (Setup's stage) | crossfade `moderate` ease-out | — | `opacity` of a copy of the old drawing | a pick or a hover preview only; a run of changes (a drag) cuts (setup-screen.tsx, `crossfade`) |

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
2. Animate `transform` and `opacity` where you can, and end at identity (`scale: 1`, `translate: 0`). Size animates
   only where nothing else can say it, on the Move role: Accordion's and every disclosure body's height, a Panel's
   width, the Switch thumb's press-stretch and the Tabs / Segmented indicator's width (it said "only" until 2026-11-07,
   which these recipes contradicted). Never leave `will-change` on a resting element; it freezes the layer at its first
   raster.
3. Borders and rings: `border`/`outline` snap to device pixels, `box-shadow` does not. Draw a
   1px edge with `border` or `outline`, and halos (focus) with `box-shadow` only when they are soft.
4. Icons: draw at their native size (`Glyph size={12|16|20|24}`, with its 12px and 10px cuts); never
   shrink a 16 drawing to 12 with CSS.
5. Geometry that halves an odd number (a 5px dot in a 16 box) lands on half pixels: choose even/odd
   pairs that centre exactly.
6. Text is never scaled at rest. Body text stays on the font's own rendering (`-webkit-font-smoothing`
   is set once in base styles, never per component).

## Reduced motion

The contract (owner, 2026-11-07, system gaps M2; Apple's guidance, Emil Kowalski, Motion's `reducedMotion="user"`,
Base UI and bencho.dev, research 2026-10-24): under `prefers-reduced-motion: reduce`, movement goes and the interface
stays whole.

1. **Nothing moves.** Every `duration-*` resolves to 0 wherever motion is set, subtrees with their own
   `data-area-motion` included, so scale, translate, rotate and size changes land at once; Feedback resolves to Off,
   so the give rests at 1.
2. **Fades stay, short.** Opacity reads `fade-*`, which resolve to 100ms (`fade-fast`) and 160ms (the rest): a menu,
   a dialog or a toast fades in place, at full size, where it would have scaled or slid. Motion 0 asked for none, so
   its fades are 0 too. A top layer's `display` / `overlay` hold reads the fade, so an exit fade is never cut off.
3. **Loops stop**, through `duration-loop` (Spinner, shimmer, pulse, the caret), and a scroll that would glide jumps.
4. **Every state stays reachable without motion**: nothing waits for an animation to end, and no information is only
   in a transition.

`emit/css.ts` writes the reduced-motion block; a component never writes its own `prefers-reduced-motion` rule except
to undo a scale it set outside the tokens.

## Checking a component

Hover, press, focus by keyboard, open and close each surface twice quickly (interrupt it), in light
and dark, at default and compact, then with reduced motion. Read `getAnimations()` and computed
`transition` values; look for a resting `transform`, `will-change`, half-pixel rects
(`getBoundingClientRect()` x/y ending in .5 at DPR 1), and colour transitions on `:hover`/`:active`.
