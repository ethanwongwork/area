# Subtle interaction motion: systems and practitioners (2026-10-24)

Research only; no Area code changed. This pass adds what `docs/research/motion-2026-10-07/` lacks: press scale
(who, how much, in vs out), hover-plate motion, sliders and drag tracking, step and value transitions, theme
crossfades, reduced-motion fades, and the agent motion skills published since. Durations, curves, overlays, M3
springs, SwiftUI presets, Motion defaults and the `linear()` method are in `design-systems.md` and
`packages-and-craft.md` (cited **[P1]** and **[P2]**), and aren't repeated here.

Target: bencho.dev, as the owner measured it **[BEN]**. Press scale 0.96 on small buttons and 0.985 on wide rows, 90ms
press. Hover plates fade in while scaling about 0.96 → 1 over about 160ms ease. Icons scale to 1.04 on hover. Content
enters with a "rise" (opacity + translateY 8–10px, 620ms `cubic-bezier(0.22, 1, 0.36, 1)`, 60–80ms stagger).
Tooltips open after 420ms. Reduced motion keeps 160ms fades.

How values were read: library values come from source at a pinned commit, cloned and read. Product values were read
in the browser (`getComputedStyle` and stylesheet walks, public pages, nothing clicked) and are marked
*(measured 2026-10-24)*. Values marked **(computed)** come from the closed-form spring and cubic-bezier sampling of
[P2]'s appendix: 0.1% settle, Ramer–Douglas–Peucker at 0.0025 for `linear()`. Every key resolves in **Sources**.

---

## 1. Press feedback

| Who | On press | Press-in | Release | Notes | Src |
|---|---|---|---|---|---|
| **bencho.dev** | `scale(0.96)` small buttons, `0.985` wide rows | 90ms | (hover clock) | the target | BEN |
| **Linear** (linear.app, every Button variant) *(measured)* | `scale(0.97)`; primary also `filter: brightness(98%)` | 160ms `(0.25, 0.46, 0.45, 0.94)` | same 160ms | one transition both ways (`border, background-color, color, box-shadow, opacity, filter, transform`); `will-change: transform` only while `:active`; a menu trigger sets `transform: none` | LIN-M |
| **Raycast** (raycast.com) *(measured)* | `scale(0.98)` on buttons, links, form submit; cards via `.cardWrapper:has(:active)` | transform 100ms `ease-in-out` | same | colours on a separate 200ms `ease` | RC-M |
| **Vercel Geist** Button *(measured)* | **no scale**; colour only | — | — | class asks for `transition-[border-color,background,color,transform,box-shadow] 150ms ease-in-out`, but a space in the arbitrary value breaks it, so the computed value is `all 0.15s (0.4, 0, 0.2, 1)`; `data-[focus]:transition-none`. Only the docs playground's reset button scales (0.95) | GE-M |
| **Radix Themes** | **no transform, no transition** on Button / IconButton; Card press = shadow change at 40ms | 0 (buttons), 40ms (cards) | cards 120ms | `base-button.css` has `:active` colour rules only | RT |
| **shadcn** new styles (vega, nova, maia, lyra, mira, luma, sera, rhea) | `translate-y-px` (1px down), **not on `aria-haspopup` triggers** | `transition-all` = 150ms `(0.4, 0, 0.2, 1)` | same | new-york-v4 has no press transform | SH |
| **Emil Kowalski** (skill, "Building great interfaces" standards) | `scale(0.97)`, "subtle (0.95–0.98)" | 160ms ease-out | same transition | the `apple-design` skill gives 0.97 at **100ms** ease-out, "Respond on pointer-down, not on release" | ES-E, ES-A |
| **Rauno Freiberg** | "~0.96, ~0.9, or so"; never 0.8 | — | — | [P2] | RF |
| **cmdk site** (Paco) | `scale(0.97)`, 150ms; palette bounces to 0.96 / 100ms on Enter | 150 | 150 | [P2] | CK |
| **Motion** docs example | `whileTap={{ scale: 0.9 }}`; **Enter on a focused element triggers `whileTap`** | spring default | spring | an example, not a recommendation | MO-G |
| **Material 3** (Compose) | **shape morph**, not scale: small button corner Full/Medium → **Small** while pressed | `DefaultEffects` spring (1600 / ζ 1.0, settles ≈ 231ms, computed) "to prevent any bounce" | same | switch handle grows to 28dp pressed (24 selected / 16 unselected) | M3C |
| **Apple** | button "should highlight immediately when I touch down"; system styles dim or highlight, don't shrink; Liquid Glass `.interactive()` adds a press response with no published values | instant highlight | tap confirmed on touch-up | Flashlight button "size changes based on the pressure of my touch" | AP-F, AP-G |
| **Family** | not specified (ripple on the QR tap only) | — | — | | FAM |
| **Sonner / Vaul** | no press scale on their buttons | — | — | | SO, VA |

Read:
- **Every product that scales sits at 0.96–0.98** (bencho, Linear, Raycast, cmdk, Emil). The libraries (Radix, Geist,
  shadcn) don't scale at all; shadcn's newest styles move 1px instead.
- **Press-in is 90–160ms, and release uses the same transition** in every measured product (Linear 160/160, Raycast
  100/100). No one releases faster than they press. Emil's asymmetry (slow press, fast release) is for hold-to-confirm
  (2s linear / 200ms ease-out), not taps **[ES-E]**.
- **Larger targets scale less.** Raycast puts 0.98 on cards and bencho 0.985 on rows, against 0.96 on small buttons.
  In pixels: 0.96 on a 28px icon button is 0.56px a side; 0.985 on a 280px row is 2.1px a side. 0.96 on that row would
  be 5.6px a side, which reads as a lurch.
- **Exclusions:** shadcn skips `aria-haspopup`, and Linear sets `transform: none` on its menu trigger, because the
  popover anchors to the trigger. Disabled elements are excluded (Raycast `:disabled { transform: scale(1) }`).
  Emil: "Never animate keyboard-initiated actions", yet Motion's `whileTap` fires on Enter **[ES-S, MO-G]**.

## 2. Hover

| Who | Plate / colour in | Out | Plate scale? | Src |
|---|---|---|---|---|
| bencho.dev | ≈160ms ease, fades | — | **yes, ≈0.96 → 1**; icon 1.04 | BEN |
| ChatGPT, Linear (app highlight) | 0 | Linear 150ms | no | P1 |
| Notion | 20ms ease-in | 20ms | no | P1 |
| Geist Button *(measured)* | 150ms `(0.4, 0, 0.2, 1)` (`all`) | 150 | no | GE-M |
| Linear site buttons *(measured)* | 160ms ease-out-quad | 160 | no | LIN-M |
| Raycast site *(measured)* | colours 200ms `ease`; card glow `::after` opacity | 200 | no (arrow icons `translate(25%)` on hover) | RC-M |
| Radix Themes | buttons none; Card shadow **40ms in, 120ms out** | 120 | no | RT |
| userinterface-wiki rule | "Press and hover interactions should use 120-180ms" | | — | UIW |
| Emil | hover = `ease`; gate with `(hover: hover) and (pointer: fine)`; example hover `scale(1.05)`; "tens of times/day (hover…): remove or drastically reduce" | | example only | ES-S, ES-E |
| Apple iPadOS pointer | **highlight effect**: the pointer *morphs into* a translucent rounded plate behind bar buttons, tab bars and segmented controls, with gentle parallax; **lift**: the element scales up with a shadow (app icons); **hover**: custom scale/tint/shadow for large items | | **yes (morph / lift)** | AP-P |

Read: only bencho (web) and iPadOS (native) animate a plate's size. iPadOS grows the plate from the pointer, which is
the same idea as bencho's 0.96 → 1. Every web system either snaps the plate in (ChatGPT, Linear, Radix) or fades it over
120–160ms (Geist, Linear's site, uiwiki). Frequency decides: rows hovered hundreds of times a day stay instant or
nearly instant (Emil, Notion 20ms, Atlassian list item 50 **[P1]**).

Crispness: bencho's icon at 1.04 is a *resting* scale while the pointer stays, so a 16px Glyph renders at 16.64px. That
breaks Area's Crispness rules 1 and 4 (`docs/MOTION.md`). The plate and press scales end at identity, so they don't.

## 3. Indicators, sliders, marks

| Control | Who | Behaviour | Src |
|---|---|---|---|
| Segmented thumb | Radix Themes | translateX 100ms `(0.445, 0.05, 0.55, 0.95)`; separators fade at 0.8 × that (80ms), `ease-out` in / `ease-in` out | RT |
| Tabs indicator | Base UI demo | `translate, width` 150ms `ease-in-out` | BU |
| Tabs indicator | Geist *(measured)* | **no transition**: the selected tab's own 2px border-bottom | GE-M |
| Tabs indicator | Radix Themes | none (selected tab's own underline) | RT |
| Tabs indicator | Emil recipe | duplicate the list styled as active, reveal it with `clip-path: inset(...)` 250ms ease-in-out, so text colour and plate change together | ES-R |
| Switch | Radix Themes | track gradient `background-position` 120ms (off) / 160ms (on) linear; colour 140ms ease-in-out; **`:active` → 30ms** | RT |
| Switch | M3 | thumb on `FastSpatial` spring (1400 / ζ 0.9: 0.15% overshoot, 224ms settle, computed); handle 16 → 28dp on press | M3C |
| **Slider, while dragging** | Apple | "contents should stay attached to the gesture. One-to-one tracking is extremely important" | AP-F |
| | Emil `apple-design` | "update the UI 1:1 with the pointer the whole way through"; respect the grab offset | ES-A |
| | Radix Themes, Base UI demos | no transition on thumb or range | RT, BU |
| | shadcn | thumb transitions `color, box-shadow` only (a hover/focus ring of 4px) | SH |
| | M3 | value follows the pointer; the thumb **halves its width (4 → 2dp) at once** on press or drag, no animation | M3C |
| | Vaul (drag analogue) | sets `transition: 'none'` on drag start; past the bound, resistance `8·(ln(v+1) − 2)` | VA |
| | Rauno | the drag shouldn't cancel when the finger leaves the slider while still pressed | RF |
| Checkbox / radio mark | [P1] consensus | instant to ≈100ms in quiet systems; M3 350ms from 0.6 | P1 |
| Icon swap (state change) | Sonner | promise icon: opacity 0 + `scale(0.8)` → 1, `300ms ease` | SO |

Read: **nobody eases a slider thumb or fill behind the pointer.** Every source tracks 1:1 and transitions only the
thumb's paint (ring, colour). A track click jumps instantly in Radix, shadcn and M3. Moving indicators run 100–250ms on
a symmetric in-out curve or a critically damped spring.

## 4. Content changes

| Change | Who | Values | Src |
|---|---|---|---|
| **Tab / step panels** | Base UI `animated-panels` | panels share one grid cell (`grid-area: 1 / 1`); `opacity 175ms ease`, `transform 350ms cubic-bezier(0.22, 1, 0.36, 1)`; enter from `translateX(±50%)`, leave to `∓50%` by `data-activation-direction`; **the translate sits inside `prefers-reduced-motion: no-preference`, so reduced motion keeps the fade** | BU |
| Wizard steps | Motion tutorial | `initial {opacity:0, x:20}` → `{opacity:1, x:0}`, `exit {opacity:0, x:-20}`; ease-out enter, ease-in exit; `mode="wait"` for "multi-step wizards or onboarding flows" | MO-W |
| `wait` cost | userinterface-wiki | "Mode 'wait' nearly doubles animation duration": halve each half (0.3 → 0.15s) | UIW |
| Container height | userinterface-wiki | `duration: 0.2, delay: 0.05`, so the size "feels like it's catching up to the content" | UIW |
| Step flows | Family | trays change height so progress is visible; "We fly instead of teleport"; persistent parts stay put and don't duplicate; "Continue" morphs into "Confirm" through shared letters | FAM |
| Crossfade seam | Emil | add `filter: blur(2px)` + `opacity: 0.7` mid-swap, 200ms ease; keep blur under 20px | ES-E |
| List stagger | Emil | 30–80ms between items; recipe: 8px rise, 300ms ease-out, 50ms steps; "never block interaction" | ES-E, ES-R |
| | userinterface-wiki | "Stagger delays must not exceed 50ms per item" (`staggerChildren: 0.03`) | UIW |
| | bencho | 60–80ms, 8–10px, 620ms | BEN |
| Numbers | NumberFlow | digits roll: transform 900ms on a spring `linear()`, opacity 450ms ease-out; `respectMotionPreference: true` → **no animation** under reduced motion | NF |
| | Family | button counts update as wallets are added; commas shift as an amount is typed | FAM |
| **Theme / setting change** | Radix website, shadcn | `next-themes` with `disableTransitionOnChange` (light/dark flips with no transitions) | NT |
| | Rauno; Paco | "Switching themes should not trigger transitions"; inject `* { transition: none }` around the flip | P2 |
| | CSS View Transitions (if a crossfade is wanted) | UA default `::view-transition-group(*) { animation-duration: 0.25s }`; old fades out, new fades in, `mix-blend-mode: plus-lighter` | VT |
| | Radix Themes playground, Linear theme picker, Figma | not measured: the playground has no captured crossfade, and the others need a signed-in app | — |

## 5. Curves and springs

From [P2], not repeated: SwiftUI `.smooth`, `.snappy`, `.interactiveSpring` and `Animation.default` (0.55 / 1.0); Motion
defaults; M3 Expressive springs; `linear()` generation.

| Spring | k / ζ | t50 | 1% settle | 0.1% settle | Overshoot | Src |
|---|---|---|---|---|---|---|
| M3 standard **fast spatial** (default `MotionScheme` is `standard()`) | 1400 / 0.9 | 42ms | 137ms | 224ms | 0.15% | M3C (computed) |
| M3 standard default spatial | 700 / 0.9 | 60 | 194 | 317 | 0.15% | M3C (computed) |
| M3 standard fast effects | 3800 / 1.0 | 27 | 108 | 150 | 0 | M3C (computed) |
| M3 standard default effects (button press shape) | 1600 / 1.0 | 42 | 166 | 231 | 0 | M3C (computed) |
| SwiftUI `.interactiveSpring` | 1755 / 0.85 | 37 | 107 | 209 | 0.63% | P2 (computed) |
| SwiftUI `.smooth` at duration 0.3 | 439 / 1.0 | 80 | 317 | 441 | 0 | (computed) |

Each as CSS `linear()` (computed, about 240 characters; run over the 0.1% settle as the duration):

- M3 fast spatial, **224ms**:
  `linear(0, 0.01 1.8%, 0.037 3.6%, 0.077 5.4%, 0.125 7.1%, 0.179 8.9%, 0.466 17.9%, 0.569 21.4%, 0.658 25%, 0.734 28.6%, 0.796 32.1%, 0.847 35.7%, 0.887 39.3%, 0.918 42.9%, 0.951 48.2%, 0.973 53.6%, 0.986 58.9%, 0.996 66.1%, 1 73.2%, 1)`
- M3 default effects, **231ms**:
  `linear(0, 0.011 1.7%, 0.041 3.4%, 0.083 5.2%, 0.134 6.9%, 0.363 13.8%, 0.472 17.2%, 0.568 20.7%, 0.652 24.1%, 0.722 27.6%, 0.779 31%, 0.826 34.5%, 0.864 37.9%, 0.894 41.4%, 0.928 46.6%, 0.951 51.7%, 0.971 58.6%, 0.983 65.5%, 0.992 74.1%, 1)`

| Curve | Progress at 10 / 20 / 30 / 50% of time (computed) | Who |
|---|---|---|
| `(0.22, 1, 0.36, 1)` (easings.net easeOutQuint) | 0.40 / 0.67 / 0.83 / 0.96 | bencho rise; Base UI panels and toast [BU, P1] |
| `(0.23, 1, 0.32, 1)` | 0.40 / 0.68 / 0.84 / 0.97 | Emil's UI ease-out, Linear's ease-out-quint [P2] |
| `(0.16, 1, 0.3, 1)` (Area `ease-out` today) | 0.49 / 0.75 / 0.88 / 0.97 | ChatGPT, Radix [P1] |
| `(0.25, 0.46, 0.45, 0.94)` (ease-out-quad) | — | Linear's press and hover, 160ms [LIN-M] |

Read: bencho's curve and Emil's are the same shape, a little gentler at the start than Area's expo-out: 40% of travel in
the first tenth against 49%. That gentler start is most of what makes it read "quiet". Apple's WWDC18 advice still
holds: "start with 100% damping"; add overshoot only to reward momentum (80% for swipe-to-dismiss) **[AP-F]**.

## 6. Reduced motion

| Keeps fades | Removes everything |
|---|---|
| Apple App Store criteria: if motion carries meaning, "don't remove the animation entirely… a dissolve, highlight fade, or color shift"; decorative motion may stop [AP-RM]. HIG: replace x/y/z transitions with fades [P2] | Sonner: `transition: none; animation: none` [P2] |
| Emil: "fewer and gentler… not zero"; recipe `transition: opacity 200ms ease; transform: none` [ES-S, ES-A] | NumberFlow: no animation [NF] |
| Motion `reducedMotion="user"`: transform and layout animations disabled; "opacity and backgroundColor will persist" [MO-RM] | Radix Themes: animations gated behind `no-preference` [P1] |
| Base UI panels: translate gated, opacity 175ms kept [BU] | Fluent, Primer: 0.01ms / none [P1] |
| bencho: 160ms fades [BEN] | Area today: every duration 0 (`docs/MOTION.md`) |

## 7. Motion checklists worth adopting

| Source | What it adds | Src |
|---|---|---|
| **emilkowalski/skill** (15 skills: `animate`, `review-animations`, `apple-design`, `emil-design-eng`, `improve-animations`, `animation-vocabulary`…) | frequency table (100+/day: none; tens/day: drastically reduce; rare: may delight); Before / After / Why review tables; the review checklist (no `transition: all`, never `scale(0)`, no ease-in on UI, origin-aware popovers, hover behind a media query, transitions not keyframes for rapid triggers, exit faster than enter, 30–80ms stagger); `apple-design` adds pointer-down feedback, 1:1 drag with grab offset, velocity handoff, rubber-banding, reduced motion as cross-fades | ES-E, ES-S, ES-A |
| **raphaelsalaja/userinterface-wiki** (152 rules as a Claude skill) | press/hover 120–180ms; small state 180–260ms; ≤300ms for user-initiated; stagger ≤50ms; `wait` doubles duration; "Similar elements must use identical timing values"; shorten the duration before changing the curve; balanced springs (500 / 30) | UIW |
| Vercel Web Interface Guidelines, Rauno's interfaces | [P2]: transform/opacity only, interruptible, correct origin, hover under `(hover: hover)`, menus used hundreds of times a day don't animate in | P2 |

Worth folding into `docs/MOTION.md` "Checking a component": the frequency table, "identical timing for similar
elements", "shorten before re-curving", and "never animate keyboard-initiated actions".

---

## Proposed Subtle package

Values for an opt-in **Subtle** motion package that sits beside today's defaults. Where the sources split, the quieter
value wins. Every value ends at identity, so Crispness holds.

**Curves**

| Token (proposed) | Value | Use | From |
|---|---|---|---|
| `ease-subtle` | `cubic-bezier(0.22, 1, 0.36, 1)` | enters, plates, panels, release | BEN, BU; ≈ Emil/Linear `(0.23, 1, 0.32, 1)` |
| `ease-press` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | press-in only | LIN-M |
| `ease-move` | keep `(0.65, 0, 0.35, 1)`; under `@supports (transition-timing-function: linear(0, 1))` the M3 fast-spatial `linear()` above at 224ms | indicators, switch thumb | P1, M3C |

**Press scale** (`:active` on pointer press only; release on the same element's 160ms)

| Target | Scale | ≈ px a side | From |
|---|---|---|---|
| Icon button, chip, `size-sm` button | 0.96 | 0.5–1.5 | BEN, RF |
| `size-md` button | 0.97 | 1–1.5 | LIN-M, ES-E, CK |
| `size-lg` button, segmented item | 0.975 | 1.5 | between 0.97 and RC-M's 0.98 |
| Tile, card (≤ 240px) | 0.98 | ≤ 2.4 | RC-M |
| Full-width row, list item, wide card | 0.985 | ≈ 2 | BEN |
| Not scaled | inputs, switch (keeps its 2px stretch), checkbox, radio, slider thumb, tabs, `aria-haspopup` / open menu triggers, disabled, keyboard activation | — | SH, LIN-M, RC-M, ES-S |

Timing: press-in **90ms** `ease-press` (BEN; Raycast 100; Emil `apple-design` 100); release **160ms** `ease-subtle`
(Linear 160, Emil 160). Gate the scale on pointer presses (`:active:not(:focus-visible)`; verify in Electron, because
Space on a focused button also matches `:active`).

**Hover plate**

| Where | In | Out | Scale from | From |
|---|---|---|---|---|
| Standalone ghost / icon buttons, segmented items | opacity 160ms `ease-subtle` | 160ms | 0.96 (≤ 40px), 0.98 (wider) | BEN, AP-P (plate grows in) |
| Dense rows (menu, list, tree, command, nav) | opacity 90ms | 150ms | none | Emil frequency; Linear 0 / 150; Primer 80, Atlassian 50 [P1] |
| Keyboard-moved highlight | instant | instant | none | CK, ES-S |
| Icons on hover | colour only; **no 1.04 scale** | | | Crispness (MOTION.md) |

All hover motion goes under `@media (hover: hover) and (pointer: fine)` [ES-S]. A press during the fade cuts straight
to the pressed state.

**Indicators**

- Segmented, tabs, switch thumb: one moving element on `ease-move`, **180ms** (Radix 100–140, Base UI 150, Primer 200
  [P1, RT, BU]). Text colour changes on the same clock.
- Slider: thumb and fill track **1:1, `transition: none` while dragging**. A track click and keyboard steps jump
  instantly. Only the thumb's ring or colour fades, 120ms (AP-F, ES-A, RT, SH, M3C, VA).
- Checkbox / radio marks: opacity + scale 0.8 → 1, **120ms** `ease-subtle`; off 90ms (P1 consensus; Sonner icon swap
  0.8).

**Step transition (Setup, wizards, tab panels)**

- Stack outgoing and incoming panels in one grid cell, not `wait` (BU; UIW).
- Incoming: opacity 0 → 1 over **200ms** `ease`, translateX **16px** → 0 over **360ms** `ease-subtle`, from the side of
  travel. Outgoing: opacity → 0 over **120ms**, translateX −8px (BU 175 / 350ms; MO-W 20px; the move stays quiet: not
  BU's 50%).
- Height change: **240ms** `ease-subtle`, 40ms after the swap (UIW 200 + 50).
- Focus moves to the new step's heading at once; nothing waits on the animation.

**Enter rise and stagger** (first appearance only, never on scroll or filter)

- Page or region: opacity + translateY **8px**, **620ms** `ease-subtle`, **60ms** between groups (BEN).
- Items inside a component (results, cards): the same rise at **360ms**, **30ms** apart, total spread ≤ 240ms; items
  past the cap arrive together (UIW ≤ 50; ES 30–80).

**Values and settings**

- Numbers: `tabular-nums`. A value the person is dragging or typing updates at once. A value the system changes
  crossfades its changed digits over 160ms with a 4px roll in the direction of change (NF, FAM; shortened from NF's
  900ms to stay quiet).
- Light/dark and every Inspector setting: **instant**, keeping `data-area-switching` (NT, RF, Paco). A preview drawing
  inside a choice card may crossfade over **200ms** (VT's 250 default, shortened). This one is optional.

**Tooltip**: open delay **420ms** (BEN; Radix 700, Base UI 600 [P2]), 300ms skip window, fade 120ms, no scale.

**Reduced motion**: keep opacity and colour on **160ms** `ease` (BEN, AP-RM, ES-A, MO-RM, BU). Drop every translate and
scale: press, plate, rise, step slide, popover zoom. Indicators jump while their colour fades. Loops stop as today. This
changes MOTION.md's open question to "keep fades".

---

## Sources

| Key | Source | Pin / date |
|---|---|---|
| P1, P2 | `docs/research/motion-2026-10-07/design-systems.md`, `packages-and-craft.md` | 2026-10-07 |
| BEN | bencho.dev, measured by the owner's session | 2026-10-24 |
| LIN-M | linear.app stylesheets: `.S36ykG_variant-*:not([disabled]):active { transform: scale(0.97) }`; `.S36ykG_variant { transition-property: border, background-color, color, box-shadow, opacity, filter, transform }` computing to `0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94)`; `.m-yS4G_trigger:active { transform: none }` | measured 2026-10-24 |
| RC-M | raycast.com: `.Fa7Cva_submit:active`, `._8v4Aaq_cardWrapper:has(:active)`, link `:active { transform: scale(0.98) }`; `._3dJGfa_button` transition `background-image, background-color, box-shadow 0.2s ease; transform 0.1s ease-in-out` | measured 2026-10-24 |
| GE-M | vercel.com/geist/button and /geist/tabs (Button class list and computed transition; Tabs: no transitions) | measured 2026-10-24 |
| RT | [radix-ui/themes `1faff10`](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components): `_internal/base-button.css` (`:active` colour only, L161–427), `card.css` L109–137, `switch.css` L40–60, `segmented-control.css` L2–149, `slider.css`, `progress.css` L38 | |
| SH | [shadcn-ui/ui `617134d`](https://github.com/shadcn-ui/ui/tree/617134d5810bba521803b3ed787190bacbb80b35/apps/v4/registry): `styles/style-vega.css` L146 (`.cn-button … active:not-aria-[haspopup]:translate-y-px`; same in the other seven styles), L1241 (`.cn-slider-thumb … transition-[color,box-shadow]`); `bases/base/ui/button.tsx` L6 `transition-all` | |
| BU | [mui/base-ui `c1294ab`](https://github.com/mui/base-ui/tree/c1294abd3c7ab19fa0fb980373af732315b8a5be/docs/src/app/(docs)/react/components): `tabs/demos/animated-panels/css-modules/index.module.css` L76–80 (indicator), L111–163 (panels); `slider/demos/*` (no transitions) | |
| VA | [emilkowalski/vaul `3e97aac`](https://github.com/emilkowalski/vaul/blob/3e97aac6a38e4481bade71d7233ed6002e80f9b0/src/index.tsx#L395-L404) (`transition: 'none'` on drag); `src/helpers.ts` L90–92 (`dampenValue`) | |
| SO | [emilkowalski/sonner `8e4662b`](https://github.com/emilkowalski/sonner/blob/8e4662b39255120b62138312058f5d77c0139a5e/src/styles.css#L159-L164) promise icon | |
| NF | [barvian/number-flow `c5906cf`](https://github.com/barvian/number-flow/blob/c5906cf35c86583e756a6b91e043291c10b416e0/packages/number-flow/src/lite.ts#L69-L80) defaults; L180–190 reduced motion | |
| M3C | [androidx `53bc2d6`](https://github.com/androidx/androidx/tree/53bc2d6eef5ae5438d07f0071dc6f698428df978/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3), `compose/material3/…/material3/`: `Button.kt` L253–260; `tokens/ButtonSmallTokens.kt` L27–46; `tokens/SwitchTokens.kt` (Pressed 28, Selected 24, Unselected 16dp); `Switch.kt` L188; `tokens/SliderTokens.kt` L94–95, L128–129; `Slider.kt` L2757–2766; `MaterialTheme.kt` L181; `tokens/StandardMotionTokens.kt` L20–31 | androidx-main, 2026-10-24 |
| ES-E | [emilkowalski/skill `2d22863`](https://github.com/emilkowalski/skill/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/emil-design-eng/SKILL.md) L66–75 (frequency), L199–213 (press), L290–317 (blur), L587–600 (asymmetry), L603–635 (stagger), L658–674 (checklist) | |
| ES-A | same repo, `skills/apple-design/SKILL.md` L32–40, L44–48, L86, L207–219 | |
| ES-S / ES-R | same repo, `skills/review-animations/STANDARDS.md`; `skills/animate/SKILL.md` and `RECIPES.md` (tabs clip-path 250ms, stagger 50ms / 300ms / 8px, accordion 200ms) | |
| UIW | [raphaelsalaja/userinterface-wiki `256a954`](https://github.com/raphaelsalaja/userinterface-wiki/tree/256a954080c8bcf1b1ceb1e2a4079d1f24cf593a/skills/rules): `duration-press-hover.md`, `duration-small-state.md`, `physics-no-excessive-stagger.md`, `mode-wait-doubles-duration.md`, `container-transition-delay.md`, `timing-consistent.md`, `duration-shorten-before-curve.md`, `spring-params-balanced.md` | |
| MO-G / MO-W / MO-RM | [motion.dev/docs/react-gestures](https://motion.dev/docs/react-gestures); [tutorials/react-animate-presence-modes](https://motion.dev/tutorials/react-animate-presence-modes); [docs/react-motion-config](https://motion.dev/docs/react-motion-config) | read 2026-10-24 |
| AP-F | Apple, WWDC18 "Designing Fluid Interfaces", [session 803](https://developer.apple.com/videos/play/wwdc2018/803/) (transcript) | |
| AP-P | Apple HIG, [Pointing devices](https://developer.apple.com/design/human-interface-guidelines/pointing-devices) (highlight, lift, hover effects); WWDC20 10640 | |
| AP-RM | Apple, [Reduced Motion evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria) | |
| AP-G | Apple, [`Glass.interactive(_:)`](https://developer.apple.com/documentation/swiftui/glass/interactive(_:)) (abstract only; no values published) | |
| RF | [rauno.me/craft/interaction-design](https://rauno.me/craft/interaction-design); interfaces README via [P2] | |
| FAM | Benji Taylor, [Family Values](https://benji.org/family-values) (qualitative, no numbers) | |
| CK | cmdk website via [P2] | |
| NT | [radix-ui/website `402e749`](https://github.com/radix-ui/website/blob/402e749613ab2e7ab7139c65b0029842b0360f07/components/theme-provider.tsx) and shadcn `apps/v4/components/theme-provider.tsx` (`disableTransitionOnChange`) | |
| VT | [CSS View Transitions Level 1](https://www.w3.org/TR/css-view-transitions-1/), UA stylesheet | |

Not found or not measured: Linear's and Figma's in-app theme pickers and Linear's app press (signed-in apps), Apple's
segmented-control and switch timings (unpublished), Liquid Glass press values, and Family's numbers.
