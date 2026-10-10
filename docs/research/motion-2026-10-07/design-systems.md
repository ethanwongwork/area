# Motion in published design systems (2026-10-07)

Source research for Area's interaction motion. Every number below is read from a token file,
component source or computed style, and carries a source key (for example `[FL2]`) that
resolves in **Sources** at the end. GitHub links are pinned to the commit read on 2026-10-07.
Product values (ChatGPT, Notion, Figma, Linear, Raycast, Vercel) were read in the browser from
public pages with `getComputedStyle`, `transitionrun` events and stylesheet walks. They are
marked *(measured)*. Nothing was clicked that changes data.

Area today (from `crispness-and-current-state.md`, Part C): `subtle` preset is instant 0,
fast 100, base 150, slow 250; `ease-out` = `cubic-bezier(0.16, 1, 0.3, 1)`, `ease-in` =
`(0.7, 0, 0.84, 0)`, `ease-in-out` = `(0.65, 0, 0.35, 1)`, `ease-spring` =
`(0.34, 1.56, 0.64, 1)` (`packages/tokens/src/axes/motion.ts`).

---

## 1. Duration and easing tokens, per system

| System | Durations (exact) | Easings (exact) | Source |
|---|---|---|---|
| **Material 3** | short1 50, short2 100, short3 150, short4 200; medium1 250, medium2 300, medium3 350, medium4 400; long1 450, long2 500, long3 550, long4 600; extra-long1 700, extra-long2 800, extra-long3 900, extra-long4 1000 ms | standard `(0.2, 0, 0, 1)`; standard-accelerate `(0.3, 0, 1, 1)`; standard-decelerate `(0, 0, 0, 1)`; emphasized-accelerate `(0.3, 0, 0.8, 0.15)`; emphasized-decelerate `(0.05, 0.7, 0.1, 1)`; emphasized is a two-segment path, so the token falls back to standard in CSS and material-web's JS uses `(.3, 0, 0, 1)`; legacy `(0.4, 0, 0.2, 1)`, legacy-accelerate `(0.4, 0, 1, 1)`, legacy-decelerate `(0, 0, 0.2, 1)`; linear | [M1] [M2] |
| **M3 Expressive springs** | Springs, not durations. **Standard scheme:** spatial fast 1400/0.9, default 700/0.9, slow 300/0.9; effects fast 3800/1.0, default 1600/1.0, slow 800/1.0 (stiffness/damping ratio). **Expressive scheme:** spatial fast 800/0.6, default 380/0.8, slow 200/0.8; effects same as standard | Spatial springs may overshoot (damping < 1); effects springs (colour, opacity) are critically damped (1.0) | [M1] [M3] [M4] |
| **Fluent 2** | UltraFast 50, Faster 100, Fast 150, Normal 200, Gentle 250, Slow 300, Slower 400, UltraSlow 500 ms | AccelerateMax `(0.9, 0.1, 1, 0.2)`; AccelerateMid `(1, 0, 1, 1)`; AccelerateMin `(0.8, 0, 0.78, 1)`; DecelerateMax `(0.1, 0.9, 0.2, 1)`; DecelerateMid `(0, 0, 0, 1)`; DecelerateMin `(0.33, 0, 0.1, 1)`; EasyEaseMax `(0.8, 0, 0.2, 1)`; EasyEase `(0.33, 0, 0.67, 1)`; Linear `(0, 0, 1, 1)` | [FL1] [FL2] |
| **IBM Carbon** | fast-01 70, fast-02 110, moderate-01 150, moderate-02 240, slow-01 400, slow-02 700 ms | standard productive `(0.2, 0, 0.38, 0.9)` / expressive `(0.4, 0.14, 0.3, 1)`; entrance productive `(0, 0, 0.38, 0.9)` / expressive `(0, 0, 0.3, 1)`; exit productive `(0.2, 0, 1, 0.9)` / expressive `(0.4, 0.14, 1, 1)`. Named surfaces: disclosure = moderate-01 + entrance productive; contextual (tooltip/popover) = fast-02 + entrance expressive; expand = moderate-02 + standard productive; invoke (modal/menu) = moderate-02 + standard expressive | [C1] [C2] |
| **Atlassian** (tokens 20.3.0, `motion` theme) | xxshort 50, xshort 100, short 150, medium 200, long 250, xlong 400, xxlong 600, instant 0 ms. Legacy `@atlaskit/motion` 9.3.0: small 100, medium 350, large 700, step 25 | out-practical `(0.4, 1, 0.6, 1)`; in-practical `(0.6, 0, 0.8, 0.6)`; out-bold `(0, 0.4, 0, 1)`; inout-bold `(0.4, 0, 0, 1)`; spring = `linear(…)` with ~2.4% overshoot. Legacy: easeInOut `(0.15, 1, 0.3, 1)`, easeOut `(0.2, 0, 0, 1)`, easeIn `(0.8, 0, 0, 0.8)` | [A1] [A2] |
| **Shopify Polaris** (repo archived) | 0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 5000 ms | ease `(0.25, 0.1, 0.25, 1)`; ease-in `(0.42, 0, 1, 1)`; ease-out `(0.19, 0.91, 0.38, 1)`; ease-in-out `(0.42, 0, 0.58, 1)`; linear. Keyframes: fade-in; appear-above/below = translateY(±`space-100`) + opacity 0; spin = 1turn; bounce; pulse | [P1] |
| **GitHub Primer** primitives | base 0, 50, 100, 200, 300 … 1000 ms. Functional: micro 100 (hover, focus), short 200 (toggle, expand), medium 300 (modal, dropdown, tooltip), long 500. The token file states a rule: keep UI at 300ms or less, never over 500 | base ease `(0.25, 0.1, 0.25, 1)`, easeIn `(0.7, 0.1, 0.75, 0.9)`, easeOut `(0.3, 0.8, 0.6, 1)`, easeInOut `(0.6, 0, 0.2, 1)`. Functional: hover = ease, enter = easeOut, exit = easeIn, move = easeInOut. Composites: hover = micro + hover; stateChange = short + move; enter = medium + enter; exit = short + exit | [PR1] [PR2] |
| **Adobe Spectrum** (`@spectrum-css/tokens` 16.0.2) | 0 = 0, 100 = 130, 200 = 160, 300 = 190, 400 = 220, 500 = 250, 600 = 300, 700 = 350, 800 = 400, 900 = 450, 1000 = 500, 2000 = 1000, 4000 = 2000, 6000 = 3000 ms | ease-in-out `(0.45, 0, 0.4, 1)`; ease-in `(0.5, 0, 1, 1)`; ease-out `(0, 0, 0.4, 1)`; linear | [S1] |
| **Salesforce SLDS** | instantly 0s, immediately 0.05s, quickly 0.1s, promptly 0.2s, slowly 0.4s, paused 3.2s | No easing tokens; components use `linear` and literal curves | [SF1] |
| **Apple HIG / SwiftUI** | No duration scale. SwiftUI `.default` (iOS 17+) is a spring with response 0.55, dampingFraction 1.0, blendDuration 0; before iOS 17 it was easeInOut | HIG: add motion purposefully; keep feedback brief and precise; avoid motion on frequent interactions; let people cancel motion; never make motion the only signal | [AP1] [AP2] |
| **Tailwind v4** (shadcn's base) | default transition 150ms; spin 1s; pulse 2s; ping 1s | default `(0.4, 0, 0.2, 1)`; ease-in `(0.4, 0, 1, 1)`; ease-out `(0, 0, 0.2, 1)`; ease-in-out `(0.4, 0, 0.2, 1)` | [T1] |
| **tw-animate-css** (shadcn) | `animate-in`/`animate-out` default 150ms; accordion/collapsible down/up 200ms | animate-in/out default `ease`; accordion `ease-out`; spacing unit 0.25rem so `slide-in-from-top-2` = 8px; `zoom-in-95` = scale 0.95 | [T2] [T1] |
| **Radix Themes** | No tokens; literal 40, 100, 120, 140, 160, 200 ms in component CSS | Overlays `(0.16, 1, 0.3, 1)` (expo-out), both ways; movement `(0.445, 0.05, 0.55, 0.95)` / `(0.45, 0.05, 0.55, 0.95)` (sine in-out) | [R1] |
| **Base UI** (demo CSS) | Literal 100, 150, 450, 500 ms | `ease-out` for popups, `ease-in-out` for indicators, drawer `(0.32, 0.72, 0, 1)`, toast `(0.22, 1, 0.36, 1)` | [B1] |
| **Headless UI** (docs examples) | Menu 200; Transition examples 300, enter 100 / leave 300 | `ease-out` (menu), `ease-in` (fade) | [H1] [H2] |
| **Vercel Geist** *(measured)* | No published token page. vercel.com/geist ships `--ds-motion-popover-duration: .2s`, `--ds-motion-overlay-duration: .3s`, `--ds-motion-overlay-scale: .96`, Tailwind default 150ms | `--ds-motion-timing-swift: cubic-bezier(.175, .885, .32, 1.1)` (small overshoot); Tailwind curves. Vercel's Web Interface Guidelines: honour reduced motion, animate only `transform`/`opacity`, make animations interruptible, set the transform origin at the physical start, never `transition: all` | [V1] [V2] |
| **ChatGPT** *(measured, logged-out web bundle)* | Popover enter 220ms, exit 140ms; dialog 160ms; buttons and links 0s | `(0.16, 1, 0.3, 1)` both ways (the same curve as Radix Themes and Area's `ease-out`); also `(0.2, 0, 0, 1)`, `(0.2, 0.8, 0.2, 1)` for sheets | [O1] |
| **Notion** *(measured, public-site shell CSS)* | Row and button hover `background 20ms ease-in`; other rules 100, 160, 200, 220, 500 ms | `ease-in`, `ease-out`, `ease-in-out`; `(0.16, 1, 0.3, 1)` 340ms; `(0.32, 0.72, 0, 1)` 500ms | [N1] |
| **Figma** *(measured, community pages)* | `--duration-sm .1s`, `--duration-md .2s`, `--duration-lg .4s`, `--duration-none 0ms`; tooltip transition 0.2s; dropdown 0.25s | `--btn-animation-ease-in-out: cubic-bezier(.65, 0, .35, 1)` (the same as Area's `ease-in-out`) | [FG1] |
| **Linear** *(measured, linear.app)* | `--speed-highlightFadeIn: 0s`, `--speed-highlightFadeOut: .15s`, `--speed-quickTransition: .1s`, `--speed-regularTransition: .25s` | A full Penner set, e.g. ease-out-quint `(.23, 1, .32, 1)`, ease-out-expo `(.19, 1, .22, 1)`, ease-in-out-cubic `(.645, .045, .355, 1)` | [L1] |
| **Raycast** *(measured, marketing site only)* | Mostly 200 and 300 ms | Mostly `ease`; a `--spring-1` `linear()` spring; `(0.34, 1.56, 0.64, 1)` overshoot ×3 | [RC1] |

---

## 2. Component interactions by system

Cell format: **duration · curve · transform**. "—" means the system does not specify it or has
no such component. "none" means it is specified as instant. Exits are shown after a slash.

### 2a. Hover, press, focus and selection controls

| Interaction | Material 3 | Fluent 2 | Carbon | Atlassian | Polaris | Primer | Spectrum | Radix Themes | shadcn / Tailwind | Base UI | Target products *(measured)* |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Hover colour** | State layer 15ms linear on and off [M5] | Button 100 (Faster) · EasyEase · bg, border, colour [FL3] | Button 70 (fast-01) · entrance productive [C3]; menu row 70 · standard productive [C4] | Button 150 · out-practical; **list item 50** · out-practical [A1] | — | Button 80 · `(0.65, 0, 0.35, 1)` [PR3] | Button 130 · ease-in-out [S2] | **none** (buttons and menu items have no transition); card hover 120, active 40 [R2] | `transition-all` → 150 · `(0.4, 0, 0.2, 1)` [T1] [SH1] | — | ChatGPT **0s** on all 79 buttons and links [O1]; Notion **20ms ease-in** [N1]; Linear **0s in / 150ms out** [L1]; Figma community 150 [FG1] |
| **Press (`:active`)** | Ripple grows 450 · standard; min press 225; press fade-in 105, fade-out 375 linear [M5] | Same 100 transition as hover [FL3] | Same as hover [C3] | 150 · out-practical [A1] | Button translateY 1px [P2] | Same 80 [PR3] | Same 130 [S2] | **none**; cards 40ms [R2] | Same 150 [T1] | — | ChatGPT 0s [O1] |
| **Focus ring** | Animated: grows to active width over 25% of 600 (long4), shrinks over 75% · emphasized [M6] | Snaps (no transition on the focus outline) [FL3] | Outline in the button transition (70) [C3] | Inputs: box-shadow 150 · out-practical [A1] | Checkbox box-shadow 100 · ease-out [P3] | — | Button box-shadow 130 [S2] | — | Ring is box-shadow under `transition-all`/`[color,box-shadow]`, so 150 [SH1] | — | — |
| **Checkbox** | Box and icon scale 0.6→1: in 350 · emphasized-decelerate, out 150 · emphasized-accelerate; opacity 50 [M7] | none [FL4] | Check scale 0→1 (no duration found in the stylesheet) [C5] | Selection colours 150 · out-practical [A1] | Border 100 · ease-out; icon opacity+transform 150 · ease-out [P3] | Mark in 80 · `(0.65, 0, 0.35, 1)` after an 80 delay; out 80; border 80 [PR4] | Colour 130 · ease-in-out [S3] | none [R1] | Indicator `transition-none` [SH1] | none [B1] | — |
| **Radio** | Dot scale 0→1 300 · emphasized-decelerate; fill 50 linear [M8] | Dot scale 0.625 (static) [FL4] | — | 150 [A1] | — | — | — | none | — | — | — |
| **Switch** | Handle margin 300 · `(0.175, 0.885, 0.32, 1.275)` (overshoot); handle size 250 · standard; track 67 linear [M9] | Thumb translateX 200 (Normal) · EasyEase; track colour 200 [FL5] | Thumb transform and track 70 (fast-01) · exit productive [C6] | 150 [A1] | — | Thumb and track 80 · `(0.5, 1, 0.89, 1)` [PR5] | Colour 160 · ease-in-out [S4] | Thumb transform 140 · `(0.45, 0.05, 0.55, 0.95)`; track 120–160 [R3] | `transition-transform` / `transition-all` 150 [SH1] | Thumb translate 150 · ease; track 150 · ease [B1] | — |
| **Tabs indicator** | Slides 250 · emphasized (translateX + scale) [M10] | Slides 300 (Slow) · DecelerateMax (translateX + scaleX) [FL6] | none (colour/border 70) [C7] | Fades + 8px slide: in 150 · out-bold, out 100 · in-practical [A1] | — | — | Slides 130 · ease-in-out [S5] | — | Underline variant: opacity only, no slide [SH1] | Slides 150 · ease-in-out (translate + width) [B1] | Notion `inset-inline-start 160ms ease-out` + width (component not confirmed) [N1] |
| **Segmented thumb** | — | — | — | — | — | Knob `inset` 200 · easeInOut `(0.6, 0, 0.2, 1)` [PR6] | — | Slides 100 · `(0.445, 0.05, 0.55, 0.95)` [R4] | — | — | — |

### 2b. Overlays

| Interaction | Material 3 | Fluent 2 | Carbon | Atlassian | Polaris | Primer | Spectrum | Radix Themes | shadcn / Tailwind | Base UI | Target products *(measured)* |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Tooltip delay** (open / close) | — | 250 / 250 [FL7] | 100 / 300 [C8] | 300 / — [A3] | Appears after 100; close 150 [P4] | short **50** (default) / medium 400 / long 1200 [PR7] | 1500 / 500 cooldown [S6] | Radix Primitives: 700, skip 300 [R5] | 0 [SH1] | 600 [B2] | — |
| **Tooltip motion** | — | none [FL7] | — | Popup tokens (below) | 50 · ease-out · appear-above/below (translateY ∓ space-100) [P4] | Fade 100 · ease-in [PR7] | 130 · ease-in-out · translate 4px (`spacing-75`) [S7] | 140 · expo-out · translate 4px + scale 0.97 [R6] | 150 · ease · fade + scale 0.95 + 8px slide [SH1] [T2] | 100 · ease-out · scale 0.98 [B1] | Figma tooltip 200 [FG1] |
| **Popover / menu / select enter** | Menu 500 · emphasized, height reveal, items stagger 250 [M11] | Menu and popover 400 (Slower) · DecelerateMid · fade + 10px slide from trigger side [FL8] | invoke: 240 · standard expressive [C2] | popup: **150 · out-practical · 8px slide + fade** [A1] | 100 · ease · translateY −5px [P5] | Overlay fade 200 · `(0.33, 1, 0.68, 1)` [PR8] | 130 · ease-in-out · 8px (`spacing-100`) [S8] | **160 · expo-out · translate 4px + scale 0.97** [R6] | New York v4: 150 · ease · fade + **zoom 0.95 + 8px**; newer styles (nova, luma, vega, mira): **100** [SH1] [SH2] | **100 · ease-out · scale 0.98** [B1] | **ChatGPT 220 · expo-out · scale 0.86 + fade, origin at trigger** [O1]; Geist popover 200 · swift [V1] |
| **Popover / menu exit** | 150 · emphasized-accelerate [M11] | **none** (unmounts at once) [FL8] | — | **100 · in-practical · 4px + fade** [A1] | 100 opacity [P5] | — | Same 130 [S8] | **100 · expo-out**, same transform [R6] | Same duration, reversed [SH1] | Same 100 [B1] | **ChatGPT 140 · expo-out · to scale 0.86** [O1] |
| **Transform origin** | Top edge (height reveal) [M11] | Trigger side (positioning vars) [FL8] | — | — | — | — | — | `--radix-*-transform-origin` (trigger) [R6] | `origin-(--radix-…-transform-origin)` [SH1] | `var(--transform-origin)` [B1] | ChatGPT at the trigger (for example `48px −30px`) [O1] |
| **Dialog enter** | 500 · emphasized · translateY −50px→0; scrim 500 [M12] | **250 (Gentle) · DecelerateMid · scale 0.85→1** + fade [FL9] | **240 · entrance expressive · translateY −24px** + fade [C9] | **250 · inout-bold · scale 0.95** [A1] | 200 · ease · translateY 200px [P6] | **200 · `(0.33, 1, 0.68, 1)` · scale 0.5→1** [PR9] | 250 · ease-out · 20px translate, after 160 delay [S9] | **200 · expo-out · translateY 5px + scale 0.97** [R7] | v4: 200 · zoom 0.95 + fade; newer styles 100 [SH1] [SH2] | **100 · ease-out · scale 0.98** [B1] | ChatGPT 160 · ease · scale 0.98 (desktop) / translateY 100% (mobile) [O1]; Geist overlay 300 · swift · 0.96 [V1]; Headless 300 · ease-out · 0.95 [H2] |
| **Dialog exit** | 150 · emphasized-accelerate · to −50px [M12] | 250 · AccelerateMin [FL9] | 240 · exit expressive [C9] | 200 · in-practical · to 0.95 [A1] | 200 [P6] | — | 130 [S9] | **100 · expo-out · to scale 0.99** [R7] | Same as enter [SH1] | Same 100 [B1] | ChatGPT 160 [O1] |
| **Scrim** | Fades with the dialog [M12] | 250 · EasyEase fade [FL9] | 240 [C9] | Blanket in 250 · inout-bold, out 200 · in-practical [A1] | Backdrop fade 200 [P7] | 200 · `(0.33, 1, 0.68, 1)` [PR9] | In 300 · ease-out, out 190 · ease-in after 160 delay [S10] | In 200 / out 160 · expo-out [R7] | Fade, same duration as content [SH1] | 150 [B1] | — |
| **Drawer / sheet** | — | Overlay and inline drawer: small 250, medium 300, large 400, full 500; in DecelerateMid, out AccelerateMin; translate ±100% + fade + shadow; backdrop linear [FL10] | — | Panel/sidenav **in 250, out 200 · out-bold · translateX 100%**; content fade in 150, out 50 [A1] | — | Side sheet 250 · `(0.33, 1, 0.68, 1)` · translateX ∓100%; bottom sheet slideUp 250 [PR9] | — | — | v4: in 500, out 300 · ease-in-out · translate 100%; newer (base): **200 · ease-in-out · 40px + fade**; overlay 150 [SH1] [SH3] | **450 · `(0.32, 0.72, 0, 1)`** · translateX; swipe exit = swipe strength × 400 [B1] | ChatGPT mobile sheet translateY(100%), easing `(0.2, 0.8, 0.2, 1)` [O1]; Notion opacity 500 · `(0.32, 0.72, 0, 1)` [N1]; Headless 300 [H2] |
| **Toast** | — | `CollapseDelayed`: size 200, opacity 400, stagger 200; exit opacity 400 then size [FL11] | moderate-02 (240) is documented for toast [C1] | Flag in 250 · out-bold · slide from −50% + fade; out 200 · in-practical · −15%; reposition 250 · inout-bold [A1] | 400 · ease-out · translateY 150px, stacked scale 0.9ⁿ; exit ease-in [P8] | — | — | — | Sonner: 400 · ease (transform, opacity, height); lifetime 4000; gap 14; swipe threshold 45px; unmount after 200 [SO1] | 500 · `(0.22, 1, 0.36, 1)` · translateY 150% + stacked scale 1 − 0.1·index; height 150 [B1] | — |

### 2c. Disclosure and progress

| Interaction | Material 3 | Fluent 2 | Carbon | Atlassian | Polaris | Primer | Spectrum | Radix Themes | shadcn / Tailwind | Base UI | Target products *(measured)* |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Accordion / collapsible height** | — | Collapse: **200 (Normal) · EasyEaseMax**, max-height + fade; snappy 150, relaxed 400 [FL12] | disclosure surface **150 · entrance productive**; accordion content 110 [C2] [C10] | Grid-column keyframes 0.8fr→1fr (labels) [A1] | max-height **150 · ease-in-out** (prop default); CSS fallback 100 · ease-out [P9] | — | — | — | **200 · ease-out** (accordion-down/up) [T2] | **150 · ease-out** height [B1] | ChatGPT transitions `grid-template-rows` (component not confirmed) [O1] |
| **Chevron rotate** | — | — | 110 [C10] | — | — | — | — | — | 200 `transition-transform` [SH1] | 100 · ease-out [B1] | — |
| **Skeleton** | — | Wave 3s · ease-in-out translateX; pulse 1s (opacity 1→0.4→1) [FL13] | 3000 · ease-in-out [C11] | — | — | — | — | Pulse 1000 · alternate-reverse (bg gray-a3↔a4) [R8] | `animate-pulse` 2s · `(0.4, 0, 0.6, 1)` (opacity 0.5 at 50%) [T1] | — | Notion shimmer 1s linear [N1] |
| **Spinner** | — | 1.5s linear (1.8s tail) [FL14] | 690ms linear [C12] | — | 500ms linear [P10] | 1000ms linear [PR10] | 1s linear [S11] | 800ms (leaf fade) [R9] | `animate-spin` 1s linear [T1] | — | Notion 1.2s linear [N1] |
| **Progress (determinate)** | 250 · `(0.4, 0, 0.6, 1)` transform [M13] | — | 110 · standard productive (scaleX) [C13] | — | ease, scaleX [P11] | — | — | transform 120 [R10] | `transition-all` 150 [SH1] | — | — |
| **Progress (indeterminate)** | 2s linear [M13] | 3000 linear translate −100%→300% [FL15] | 1400 linear [C13] | — | — | Shimmer 1s [PR11] | — | 5s / 2.5s cycles [R10] | — | — | — |

---

## 3. Consensus

1. **Small overlays enter in 100–160ms.** Atlassian 150, Radix 160 (tooltip 140), Base UI 100,
   shadcn 150 (newer styles 100), Spectrum 130, Polaris 100. Only Fluent (400) and M3 (500
   with stagger) go longer, and Fluent has no exit at all.
2. **Exits are shorter than entrances, about 0.6–0.7×.** Atlassian popup 150→100, modal
   250→200; Radix popper 160→100, dialog 200→100; ChatGPT 220→140; M3 menu 500→150, dialog
   500→150; Spectrum scrim 300→190.
3. **Entrances decelerate.** Every system uses an ease-out family curve to enter: M3
   emphasized-decelerate, Fluent DecelerateMid/Max, Carbon entrance, Atlassian out-practical and
   out-bold, Primer easeOut, Spectrum ease-out, and Radix and ChatGPT `(0.16, 1, 0.3, 1)`.
4. **Overlays scale from 0.95–0.98, never from 0.** Popovers: shadcn 0.95, Radix 0.97, Base UI
   0.98, Geist 0.96. Dialogs: Atlassian 0.95, Radix 0.97, ChatGPT 0.98, Base UI 0.98. The
   systems that translate instead keep the distance small: 4px (Radix, Spectrum tooltip), 5px
   (Polaris), 8px (Atlassian, Spectrum, shadcn), 10px (Fluent).
5. **Transform origin comes from the trigger** for anchored surfaces (Radix, shadcn, Base UI,
   Fluent's slide direction, ChatGPT). Modals scale from the centre.
6. **Hover colour lasts 0–150ms, and the product apps sit at the instant end.** ChatGPT 0,
   Notion 20ms, Linear 0 in / 150 out, Atlassian list items 50, M3 state layer 15, Carbon 70,
   Primer 80, Fluent 100.
7. **On-screen movement (thumbs, indicators) uses symmetric ease-in-out in 100–200ms.** Radix
   switch 140 and segmented 100 (sine in-out); Base UI tabs 150 ease-in-out; Primer segmented 200
   easeInOut; Spectrum tabs 130 ease-in-out; Fluent switch 200 EasyEase.
8. **Disclosure height is 150–200ms ease-out** (Base UI 150, Carbon 150, Polaris 150, Fluent 200,
   shadcn 200).
9. **Checkbox and radio marks are instant or at most about 100ms** in the quiet systems (Radix,
   shadcn, Base UI, Fluent: none; Primer 80; Polaris 100–150). Only M3 animates them visibly
   (350, scale from 0.6).
10. **Spinners turn once per 0.8–1.5s, linear.** Skeletons pulse or shimmer on 1–3s cycles.
11. **Reduced motion is honoured everywhere.** Fluent and Primer drop to 0.01ms or none; Radix
    wraps its animations in `prefers-reduced-motion: no-preference`; Polaris sets `animation:
    none`; Fluent's progress bar switches to an opacity pulse.

## 4. Outliers

- **Material 3** is long and expressive: 500ms menus and dialogs, a 600ms animated focus ring,
  a 450ms ripple, and an overshooting switch handle `(0.175, 0.885, 0.32, 1.275)`. Its Expressive
  springs (fast spatial damping 0.6) bounce on purpose. This is not Area's character.
- **Fluent 2** gives menus and popovers 400ms and no exit (they unmount at once). Its dialog
  starts at scale 0.85, and drawer duration grows with size (250–500).
- **Primer's dialog** scales from **0.5**. Its default tooltip delay is only **50ms**.
- **Spectrum's tooltip delay is 1500ms**, the longest here. Its modal waits 160ms before
  entering.
- **ChatGPT's popover scale (0.86)** is the largest scale delta of any source. It works because
  the origin sits on the trigger, so the surface grows out of the button.
- **Radix Themes** gives buttons and menu rows no hover transition at all, while ChatGPT and
  Linear show hover-in instantly. Most libraries ease hover over 100–150ms.
- **Linear splits hover**: highlight in 0s, out 150ms.
- **Notion's hover background lasts 20ms ease-in**, which is effectively instant but avoids a
  hard one-frame flash.
- **Toasts run long and soft**: Sonner 400 ease, Base UI 500, Polaris 400. Atlassian's flag
  (250 in / 200 out) is the restrained exception.
- **Overshoot** appears only in M3 (switch), Geist (`swift`, y2 = 1.1), Atlassian's spring token
  (avatar hover only) and Raycast's marketing site.

---

## 5. Recommended Area mapping

This keeps Area's existing namespaces (`--area-duration-*`, `--area-ease-*`) and the `subtle`
preset values. The token names are proposals. Area's `ease-out` `(0.16, 1, 0.3, 1)` is
already exactly the curve Radix Themes and ChatGPT ship, and its `ease-in-out`
`(0.65, 0, 0.35, 1)` equals Figma's button curve and Primer's button curve, so both stay.

### 5.1 Tokens (`subtle` preset)

| Token | Value | Evidence |
|---|---|---|
| `--area-duration-instant` | 0ms | ChatGPT hover 0s [O1]; Linear highlight-in 0s [L1]; Radix buttons none [R2] |
| `--area-duration-fast` | 100ms | Popup exit (Atlassian 100 [A1], Radix 100 [R6]); hover-out; Fluent Faster [FL1]; Linear quick 100 [L1]; Figma `--duration-sm` [FG1] |
| `--area-duration-base` | 150ms | Popup enter (Atlassian 150 [A1], Radix 140–160 [R6], shadcn 150 [T2]); disclosure (Base UI and Carbon 150 [B1] [C2]); thumbs and indicators (Base UI 150 [B1], Radix 140 [R3]) |
| **`--area-duration-moderate`** *(new)* | 200ms | Dialog enter (Radix 200 [R7], Primer 200 [PR9], Polaris 200 [P6]); dialog and panel exit (Atlassian 200 [A1]); Figma `--duration-md` [FG1]; Geist popover 200 [V1] |
| `--area-duration-slow` | 250ms | Drawer and toast enter (Atlassian panel and flag 250 [A1], Fluent small drawer 250 [FL10], Primer side sheet 250 [PR9]) |
| `--area-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` (unchanged) | Radix Themes [R6], ChatGPT [O1] |
| `--area-ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` (unchanged) | Figma [FG1], Primer button [PR3] |
| `--area-ease-in` | change to `cubic-bezier(0.4, 0, 1, 1)` | The current `(0.7, 0, 0.84, 0)` is an expo-in and reads as a pause and then a snap. `(0.4, 0, 1, 1)` is Tailwind ease-in [T1], M3 legacy-accelerate [M1] and Spectrum ease-in [S1] within 0.1. Use it only for surfaces that leave the screen. |
| `--area-ease-spring` | keep, but restrict to the Indicator anchor | No quiet system overshoots on controls (consensus 9, outliers). |

Two exit rules follow from consensus 2: **exit duration = one step below the entrance**
(base→fast, moderate→fast, slow→moderate), and **anchored surfaces exit on the same
`ease-out`**. Radix and ChatGPT both do this, and an accelerate curve on a 100ms fade reads as
lag. Panels that leave the viewport (Drawer, Toast) exit on `ease-in`, following Fluent,
Atlassian and M3.

### 5.2 Component interactions

| Area interaction | Enter / on | Exit / off | Curve | Transform | Evidence |
|---|---|---|---|---|---|
| Button, Chip, Tag, field hover colour | fast 100 | fast 100 | ease-out | — | Fluent 100 [FL3], Primer 80 [PR3] |
| Menu item, list row, tree row, command row, nav item hover | **instant 0** | fast 100 | ease-out | — | ChatGPT 0 [O1], Linear 0/150 [L1], Notion 20ms [N1], Atlassian list item 50 [A1] |
| `:active` press | **instant 0** | fast 100 | ease-out | — | The press must land on the frame it happens (Radix none [R2], ChatGPT 0 [O1]). Fixes Part C item 5. |
| Focus ring (outline and box-shadow halo) | **instant 0** | instant 0 | — | — | Fluent snaps [FL3]. Primer puts focus in the 100ms micro tier [PR2], but keyboard focus should not lag behind the key. Only M3 animates it [M6]. |
| Checkbox / Radio mark | fast 100 | fast 100 | ease-out | opacity, plus scale **0.8→1** (not from 0) | Primer 80 [PR4], Polaris 100–150 [P3]; M3 starts at 0.6 [M7]. Drop the spring. |
| Switch thumb + track | base 150 (both, same duration) | base 150 | ease-in-out | `translate` (not `inset-inline-start`); track `background-color` and `border-color` together | Base UI 150 [B1], Radix 140 sine in-out [R3], Fluent 200 [FL5] |
| Tabs indicator, Segmented thumb | base 150 | — | ease-in-out | translateX + width (or `scale`) on a single shared indicator | Base UI 150 ease-in-out [B1], Radix 100 [R4], Spectrum 130 [S5], Primer 200 [PR6] |
| Tooltip | delay **600** open, 0 for follow-ons within 300ms; fade fast 100 | instant 0 (or fast 100 on hover-out) | ease-out | opacity; optional scale 0.98 | Base UI 600 [B2], Radix 700/300 [R5], Fluent 250 [FL7]; follow-ons instant (Radix skip [R5]) |
| Popover, Menu, Select, Combobox, Hover card | base 150 | fast 100 | ease-out both ways | opacity + scale **0.97** (keep) from the trigger origin; optional 4px translate away from the trigger | Radix 160/100, 0.97 + 4px [R6]; Atlassian 150/100, 8px [A1]; Base UI 0.98 [B1] |
| Context menu | base 150 | fast 100 | ease-out | scale 0.97 from the **pointer corner** | Origin consensus 5 (Radix, Base UI, ChatGPT) |
| Dialog, Confirm dialog, Command palette | moderate 200 | fast 100 (Radix) to base 150 | ease-out | opacity + scale 0.97 from centre | Radix 200/100, 0.97 [R7]; ChatGPT 0.98 [O1]; Atlassian 250/200, 0.95 [A1] |
| Scrim | moderate 200 | base 150 | ease-out (or linear) | opacity | Radix 200/160 [R7], Base UI 150 [B1], Fluent linear [FL10] |
| Drawer / Sheet | slow 250 | moderate 200 | in ease-out, out ease-in | translate ±100% (or 40px + fade for a light sheet) | Atlassian 250/200 [A1], Fluent 250 small [FL10], shadcn 200 + 40px [SH3] |
| Toast | slow 250 | moderate 200 | in ease-out, out ease-in | translateY from the edge + fade; stack reflow slow 250 ease-out | Atlassian flag 250/200, reposition 250 [A1]; Sonner and Base UI use 400–500, which is too soft for Area [SO1] [B1] |
| Accordion / Collapsible height | base 150 | base 150 | ease-out | `grid-template-rows: 0fr→1fr` (or `interpolate-size`) + content fade | Base UI 150 ease-out [B1], Carbon 150 [C2], Polaris 150 [P9] |
| Chevrons (accordion, tree, nav, split button) | fast 100 | fast 100 | ease-out | `rotate` | Base UI 100 [B1]; one value for every chevron (Part C item 1) |
| Skeleton | 2s cycle (pulse) or 1.5–3s (shimmer) | — | ease-in-out (pulse) / linear (shimmer) | opacity or background-position | Tailwind pulse 2s [T1], Radix 1s alternate [R8], Fluent and Carbon 3s [FL13] [C11] |
| Spinner | 1s per turn (0.8–1s) | — | linear | rotate | Tailwind 1s [T1], Primer 1s [PR10], Radix 0.8s [R9] |
| Progress determinate | base 150 | — | ease-out | `scale` (x) from `inline-start` | Radix 120 [R10], Carbon 110 [C13], M3 250 [M13] |
| Progress indeterminate | 1.5–2s cycle | — | linear | translate | M3 2s [M13], Carbon 1.4s [C13] |
| Reduced motion | Durations → 0 for movement, keep ≤ fast opacity fades | | | | Fluent 0.01ms [FL3]; Radix `no-preference` gate [R6] |

---

## Sources

Pinned commits (read 2026-10-07): fluentui `d254a2d24f`, carbon `c64b5787cb`, polaris
`3f7954ae42`, primer/primitives `f48bc063f7`, primer/react `89aca513b1`, shadcn-ui/ui
`97ddbf4274`, tw-animate-css `1fc30d2b5a`, base-ui `aeba3eb9f4`, salesforce-ux/design-system
`b380143b88`, tailwindcss `fa81d697fe`, sonner `8e4662b392`, androidx `4d7ed92cd9`,
radix-ui/primitives `c71610373b`, react-spectrum `d3b2bd2fc7`, material-web `703aed25b9`,
radix-ui/themes `1faff10ac2`.

**Material 3**
- [M1] Tokens: https://github.com/material-components/material-web/blob/703aed25b9/tokens/versions/latest/sass/_md-sys-motion.scss (docs: https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)
- [M2] JS easing constants: https://github.com/material-components/material-web/blob/703aed25b9/internal/motion/animation.ts
- [M3] Expressive springs: https://github.com/androidx/androidx/blob/4d7ed92cd9/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt
- [M4] Standard springs: https://github.com/androidx/androidx/blob/4d7ed92cd9/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StandardMotionTokens.kt
- [M5] Ripple: https://github.com/material-components/material-web/blob/703aed25b9/ripple/internal/_ripple.scss (L67, L78, L90) and `ripple/internal/ripple.ts` (L17–18, L88)
- [M6] Focus ring: `focus/internal/_focus-ring.scss` (L44–46); duration = long4 in `tokens/_md-comp-focus-ring.scss` L48
- [M7] Checkbox: `checkbox/internal/_checkbox.scss` L126–147
- [M8] Radio: `radio/internal/_radio.scss` L117–141
- [M9] Switch: `switch/internal/_handle.scss` L25, L54–56; `_track.scss` L35–37
- [M10] Tabs indicator: `tabs/internal/tab.ts` L152–153
- [M11] Menu: `menu/internal/menu.ts` L704–742 (open), L813–867 (close)
- [M12] Dialog: `dialog/internal/animations.ts` L52–158
- [M13] Linear progress: `progress/internal/_linear-progress.scss` L28–31

**Fluent 2** (https://github.com/microsoft/fluentui/blob/d254a2d24f/packages/…)
- [FL1] `tokens/src/global/durations.ts`
- [FL2] `tokens/src/global/curves.ts` (docs: https://fluent2.microsoft.design/motion)
- [FL3] `react-components/react-button/library/src/components/Button/useButtonStyles.styles.ts` L71–78
- [FL4] `react-components/react-checkbox/…/useCheckboxStyles.styles.ts`, `react-radio/…/useRadioStyles.styles.ts` L182 (no transitions)
- [FL5] `react-components/react-switch/library/src/components/Switch/useSwitchStyles.styles.ts` L58–80
- [FL6] `react-components/react-tabs/library/src/components/Tab/useTabAnimatedIndicator.styles.ts` L25–27
- [FL7] `react-components/react-tooltip/library/src/components/Tooltip/useTooltipBase.tsx` L56–57 (no motion in `useTooltipStyles.styles.ts`)
- [FL8] `react-components/react-menu/library/src/components/Menu/MenuSurfaceMotion.ts`; `react-popover/…/PopoverSurfaceMotion.ts` (distance 10, "no exit animation")
- [FL9] `react-components/react-dialog/library/src/components/DialogSurfaceMotion.ts`, `DialogBackdropMotion.ts`; `react-motion-components-preview/…/Fade/Fade.ts` (FadeRelaxed = Gentle)
- [FL10] `react-components/react-drawer/library/src/shared/drawerMotions.ts`
- [FL11] `react-components/react-toast/library/src/components/ToastContainer/renderToastContainer.tsx`; `react-motion-components-preview/…/Collapse/Collapse.ts` (CollapseDelayed)
- [FL12] `react-components/react-motion-components-preview/library/src/components/Collapse/Collapse.ts`; Accordion uses it (`react-accordion/…/useAccordionPanel.ts` L36)
- [FL13] `react-components/react-skeleton/library/src/components/SkeletonItem/useSkeletonItemStyles.styles.ts` L12–72
- [FL14] `react-components/react-spinner/library/src/components/Spinner/useSpinnerStyles.styles.ts` L58–94
- [FL15] `react-components/react-progress/library/src/components/ProgressBar/progressBarMotions.ts`

**IBM Carbon** (https://github.com/carbon-design-system/carbon/blob/c64b5787cb/packages/…)
- [C1] `motion/src/dtcg/motion.json` (docs: https://carbondesignsystem.com/elements/motion/overview/)
- [C2] `motion/src/dtcg/surfaces.json`, `motion/docs/surfaces.md`
- [C3] `styles/scss/components/button/_mixins.scss` L73–77
- [C4] `styles/scss/components/menu/_menu.scss` L91
- [C5] `styles/scss/components/checkbox/_checkbox.scss` L139–175
- [C6] `styles/scss/components/toggle/_toggle.scss` L65–76
- [C7] `styles/scss/components/tabs/_tabs.scss` L339–376
- [C8] `react/src/components/Tooltip/Tooltip.tsx` L126–127
- [C9] `styles/scss/components/modal/_modal.scss` L502–600
- [C10] `styles/scss/components/accordion/_accordion.scss` L166, L197
- [C11] `styles/scss/utilities/_skeleton.scss` L55
- [C12] `styles/scss/components/loading/_animation.scss` L13
- [C13] `styles/scss/components/progress-bar/_progress-bar.scss` L75–96

**Atlassian**
- [A1] `@atlaskit/tokens` 20.3.0, motion theme: https://unpkg.com/@atlaskit/tokens@20.3.0/dist/esm/artifacts/themes/atlassian-motion.js (token names in `dist/esm/artifacts/token-names.js`; docs: https://atlassian.design/foundations/motion)
- [A2] `@atlaskit/motion` 9.3.0: https://unpkg.com/@atlaskit/motion@9.3.0/dist/esm/utils/durations.js, `…/curves.js`
- [A3] `@atlaskit/tooltip` 24.4.0: https://unpkg.com/@atlaskit/tooltip@24.4.0/dist/esm/tooltip.js L103

**Shopify Polaris** (archived; https://github.com/Shopify/polaris/blob/3f7954ae42/…)
- [P1] `polaris-tokens/src/themes/base/motion.ts` (docs: https://polaris-react.shopify.com/tokens/motion)
- [P2] `polaris-react/src/components/Button/Button.module.css` L339
- [P3] `polaris-react/src/components/Checkbox/Checkbox.module.css` L9–11, L63–64, L161–162
- [P4] `polaris-react/src/components/Tooltip/components/TooltipOverlay/TooltipOverlay.module.css` L67–77; `Tooltip/Tooltip.tsx` L72
- [P5] `polaris-react/src/components/Popover/Popover.module.css` L5–40
- [P6] `polaris-react/src/components/Modal/components/Dialog/Dialog.module.css` L92–107
- [P7] `polaris-react/src/components/Backdrop/Backdrop.module.css` L11
- [P8] `polaris-react/src/components/Frame/components/ToastManager/ToastManager.module.css` L6–42; `ToastManager.tsx` L61–129
- [P9] `polaris-react/src/components/Collapsible/Collapsible.tsx` L33; `Collapsible.module.css` L6–8
- [P10] `polaris-react/src/components/Spinner/Spinner.module.css` L2
- [P11] `polaris-react/src/components/ProgressBar/ProgressBar.module.css` L72

**GitHub Primer**
- [PR1] https://github.com/primer/primitives/blob/f48bc063f7/src/tokens/base/motion/timing.json5 and `easing.json5`
- [PR2] https://github.com/primer/primitives/blob/f48bc063f7/src/tokens/functional/motion/motion.json5
- [PR3] https://github.com/primer/react/blob/89aca513b1/packages/react/src/Button/ButtonBase.module.css L20–33
- [PR4] `packages/react/src/Checkbox/Checkbox.module.css` L4–65
- [PR5] `packages/react/src/ToggleSwitch/ToggleSwitch.module.css` L2–3
- [PR6] `packages/react/src/SegmentedControl/SegmentedControl.module.css` L127
- [PR7] `packages/react/src/TooltipV2/Tooltip.tsx` L96–100; `TooltipV2/Tooltip.module.css` L2–121
- [PR8] `packages/react/src/Overlay/Overlay.module.css` L1–9, L236
- [PR9] `packages/react/src/Dialog/Dialog.module.css` L14–70, L169–282
- [PR10] `packages/react/src/Spinner/Spinner.module.css` L12
- [PR11] `packages/react/src/ProgressBar/ProgressBar.module.css` L1–26

**Adobe Spectrum**
- [S1] https://unpkg.com/@spectrum-css/tokens@16.0.2/dist/index.css (`--spectrum-animation-*`; docs: https://spectrum.adobe.com/page/motion/)
- [S2] https://unpkg.com/@spectrum-css/button@14.2.0/dist/index.css
- [S3] https://unpkg.com/@spectrum-css/checkbox@10.2.0/dist/index.css
- [S4] https://unpkg.com/@spectrum-css/switch@6.2.0/dist/index.css
- [S5] https://unpkg.com/@spectrum-css/tabs@6.2.0/dist/index.css
- [S6] https://github.com/adobe/react-spectrum/blob/d3b2bd2fc7/packages/react-stately/src/tooltip/useTooltipTriggerState.ts L53–54
- [S7] https://unpkg.com/@spectrum-css/tooltip@7.2.0/dist/index.css (distance `spacing-75` = 4px)
- [S8] https://unpkg.com/@spectrum-css/popover@8.3.0/dist/index.css (distance `spacing-100` = 8px)
- [S9] https://unpkg.com/@spectrum-css/modal@7.2.0/dist/index.css (entry distance 20px/25px in tokens)
- [S10] https://unpkg.com/@spectrum-css/underlay@6.2.0/dist/index.css
- [S11] https://unpkg.com/@spectrum-css/progresscircle@5.2.0/dist/index.css

**Salesforce, Apple, Tailwind, shadcn, Radix, Base UI, Headless UI, Sonner**
- [SF1] https://github.com/salesforce-ux/design-system/blob/b380143b88/design-tokens/aliases/duration.yml; modal `ui/components/modals/base/_index.scss` L16–39 (0.1s linear); toggle `ui/components/checkbox-toggle/base/_index.scss` L38, L166 (0.2s `(0.75, 0, 0.08, 1)`); spinner 1000ms
- [AP1] https://developer.apple.com/design/human-interface-guidelines/motion
- [AP2] https://developer.apple.com/documentation/swiftui/animation/default
- [T1] https://github.com/tailwindlabs/tailwindcss/blob/fa81d697fe/packages/tailwindcss/theme.css L325, L434–461, L492–493
- [T2] https://github.com/Wombosvideo/tw-animate-css/blob/1fc30d2b5a/src/tw-animate.css L160–195, L342–451
- [SH1] https://github.com/shadcn-ui/ui/tree/97ddbf4274/apps/v4/registry/new-york-v4/ui (dialog, dropdown-menu, popover, tooltip, sheet, accordion, switch, checkbox, tabs, skeleton, select, progress, spinner `.tsx`)
- [SH2] https://github.com/shadcn-ui/ui/blob/97ddbf4274/apps/v4/registry/styles/style-nova.css (`.cn-popover-content`, `.cn-dropdown-menu-content`, `.cn-dialog-content`, `.cn-select-content`: `duration-100`); luma, vega and mira match
- [SH3] https://github.com/shadcn-ui/ui/blob/97ddbf4274/apps/v4/registry/bases/base/ui/sheet.tsx (2.5rem translate, overlay 150); `style-nova.css` L1085–1086 (200 ease-in-out)
- [R1] https://github.com/radix-ui/themes/tree/1faff10ac2/packages/radix-ui-themes/src/components
- [R2] same: `card.css` L109–137, `_internal/base-button.css` (no transition)
- [R3] `switch.css` L40–56, L83–84
- [R4] `segmented-control.css` L2, L148–149
- [R5] https://github.com/radix-ui/primitives/blob/c71610373b/packages/react/tooltip/src/tooltip.tsx L31, L71–72
- [R6] `animations.css` L19–36, L88–140; `tooltip.css` L9–10
- [R7] `_internal/base-dialog.css` L95–137
- [R8] `skeleton.css` L5, L48–55
- [R9] `spinner.css` L2
- [R10] `progress.css` L38–59
- [B1] https://github.com/mui/base-ui/tree/aeba3eb9f4/docs/src/app/(docs)/react/components — `<component>/demos/hero/css-modules/index.module.css` for menu, select, tooltip, dialog, drawer, toast, collapsible, tabs, switch; popover `demos/detached-triggers-full`
- [B2] https://github.com/mui/base-ui/blob/aeba3eb9f4/packages/react/src/tooltip/utils/constants.ts (600); `popover/utils/constants.ts` (300 hover open)
- [H1] https://headlessui.com/react/menu ("Adding transitions")
- [H2] https://headlessui.com/react/transition
- [SO1] https://github.com/emilkowalski/sonner/blob/8e4662b392/src/styles.css L51–202; `src/index.tsx` L22–43

**Products** *(measured 2026-10-07 in the desktop app's browser pane; public pages only)*
- [O1] https://chatgpt.com/ logged out (`unauth-mweb` StyleX bundle). Model-menu popover: enter `opacity, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)`, `@starting-style { opacity: 0; transform: scale(0.86) }`, origin at the trigger; exit read from `transitionrun`: 140ms, same curve, to scale(0.86). `<dialog>`: `opacity 0.16s, transform 0.16s`, desktop `@starting-style` scale(0.98), mobile translateY(100%). All 79 buttons and links: `transition: all 0s`. The logged-in app may differ.
- [N1] https://notion.notion.site/ (public-site app shell, `_assets/main-0c0561606a3046fc.css`). Computed `background 0.02s ease-in` on `role=button`; rule list from atomic classes, so mapping to components is not confirmed.
- [FG1] https://www.figma.com/community (`community-*.min.css`). The editor itself was not inspected.
- [L1] https://linear.app/ root custom properties (marketing site; the app was not inspected).
- [RC1] https://www.raycast.com/ (marketing site; the desktop app is native and cannot be inspected).
- [V1] https://vercel.com/geist/introduction (`--ds-motion-*` custom properties)
- [V2] https://vercel.com/design/guidelines (Animation section)

## Not verified

- Notion's and Figma's in-app menus, tooltips and dialogs were not opened logged in. The values
  above come from public shells and community pages, and the component mapping for Notion's
  atomic rules is not confirmed. A logged-in capture with `area-capture.js` would settle the
  target-product rows.
- ChatGPT values are from the logged-out web bundle. The tooltip (`popover="hint"`) had no
  transition at rest, and its open animation was not triggered.
- Carbon's checkbox scale has no duration in the stylesheet that was read. M3 and Fluent publish
  no tooltip delay in the sources read.
- Geist has no official motion token page. Third-party "Geist token" lists that appear in
  search results are not used here.
