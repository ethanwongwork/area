# Motion research: animation packages and practitioner craft

Date: 2026-10-07. Research only; no Area code changed.

How the values were collected: library values come from the source code at a pinned commit
(cloned, then read), not from memory or blog summaries. Where the docs and the source disagree,
both are given and the source wins. Apple values come from the SwiftUI `.swiftinterface` shipped
in the macOS 26.5 SDK, which holds the preset bodies in full, and from Apple's documentation JSON.
Practitioner rules are quoted from their own sites or repositories. Derived numbers (damping ratio,
settle time, curve progress, bezier fit error) were computed with the closed-form
damped-oscillator solution and cubic-bezier sampling. They are marked **(computed)**, and the
method is in the appendix.

Pinned sources:

| Key | Source | Pin |
| --- | --- | --- |
| MO | motiondivision/motion (v14.0.0 workspace) | [`55eb6bb`](https://github.com/motiondivision/motion/tree/55eb6bbd5f861785592992b6b8bed2cf81fe9103), 2026-10-05 |
| RS | pmndrs/react-spring (11.0.0-beta.1) | [`ea91c9d`](https://github.com/pmndrs/react-spring/tree/ea91c9d3415b519e085a0bf39b7d0bb6492e1929) |
| GS | greensock/GSAP (3.15.0) | [`13e2b79`](https://github.com/greensock/GSAP/blob/13e2b790546426a1a2e0e9b409f3f8dc6d6611f2/src/gsap-core.js) |
| EN | ai/easings.net (`src/easings.yml`) | [`d2563f0`](https://github.com/ai/easings.net/blob/d2563f0d32a511b5556774b838ec35c3a841b15d/src/easings.yml) |
| SUI | SwiftUICore.swiftinterface, MacOSX26.5.sdk (`/Library/Developer/CommandLineTools/SDKs/MacOSX26.5.sdk/System/Library/Frameworks/SwiftUICore.framework/.../arm64e-apple-macos.swiftinterface`) | lines 3186–3206, 13067–13127 |
| VA | emilkowalski/vaul | [`3e97aac`](https://github.com/emilkowalski/vaul/tree/3e97aac6a38e4481bade71d7233ed6002e80f9b0) |
| SO | emilkowalski/sonner | [`8e4662b`](https://github.com/emilkowalski/sonner/tree/8e4662b39255120b62138312058f5d77c0139a5e) |
| ES | emilkowalski/skill (Emil's published animation standards) | [`e8a175d`](https://github.com/emilkowalski/skill/tree/e8a175de22ae1e49370fc144c1f3bb9aeedf988d) |
| CK | pacocoursey/cmdk (website themes) | [`dd2250e`](https://github.com/pacocoursey/cmdk/tree/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3) |
| RF | raunofreiberg/interfaces (interfaces.rauno.me) | [`81f523a`](https://github.com/raunofreiberg/interfaces/blob/81f523a5b469ba1ea877fef262588f3b4b65d31f/README.md) |
| WIG | vercel-labs/web-interface-guidelines | [`434b7f9`](https://github.com/vercel-labs/web-interface-guidelines/tree/434b7f91364665f2f733b310ec54809bf8f37937) |
| LIN | linear.app stylesheets, fetched 2026-10-07 (`static.linear.app/web/_next/static/css/Dop5ZgCE.css`, `layout.C0PJmvhY.css`) | marketing site, not the app |
| LEG | jakearchibald/linear-easing-generator | [`17e22b8`](https://github.com/jakearchibald/linear-easing-generator/tree/17e22b88db2a94e6a798610ce406a04c7f9b8d27) |
| RX | radix-ui/primitives tooltip | [`c716103`](https://github.com/radix-ui/primitives/blob/c71610373b6aa17de24f5c7484ced5108160f12b/packages/react/tooltip/src/tooltip.tsx#L31-L72) |
| BUI | mui/base-ui tooltip constants | [`aeba3eb`](https://github.com/mui/base-ui/blob/aeba3eb9f4613424c1a66f767bb20d25233306b6/packages/react/src/tooltip/utils/constants.ts) |

---

## 1. Motion (motion.dev, formerly Framer Motion)

### Default transition per value kind

`getDefaultTransition` ([MO default-transitions.ts L4–48](https://github.com/motiondivision/motion/blob/55eb6bbd5f861785592992b6b8bed2cf81fe9103/packages/motion-dom/src/animation/utils/default-transitions.ts#L4-L48)):

| Value kind | Type | Params (source) | ζ | Settles to 1% / 0.1% | Overshoot | Link |
| --- | --- | --- | --- | --- | --- | --- |
| Transform `x`, `y`, `rotate`… | spring | stiffness 500, damping 25, restSpeed 10 | 0.559 (computed) | 382 / 561 ms (computed) | 12.0% (computed) | L4–9 |
| `scale*`, target ≠ 0 | spring | stiffness 550, damping 30, restSpeed 10 | 0.640 (computed) | 273 / 441 ms | 7.3% | L11–18 |
| `scale*`, target 0 | spring | stiffness 550, damping 2·√550 ≈ 46.9 (critical) | 1.000 | 283 / 394 ms | 0 | L16 |
| Everything else (opacity, colour, filter…) | tween | `ease: [0.25, 0.1, 0.35, 1]`, duration 0.3 s ("a slightly shallower version of the default browser easing curve") | n/a | 300 ms | 0 | L25–33 |
| More than 2 keyframes | keyframes | duration 0.8 s | n/a | 800 ms | n/a | L20–23 |

### Spring generator defaults

[MO spring.ts L21–46](https://github.com/motiondivision/motion/blob/55eb6bbd5f861785592992b6b8bed2cf81fe9103/packages/motion-dom/src/animation/generators/spring.ts#L21-L46):

| Parameter | Source value | Docs ([motion.dev/docs/react-transitions](https://motion.dev/docs/react-transitions)) |
| --- | --- | --- |
| stiffness / damping / mass | 100 / 10 / 1.0 (ζ 0.5, 16.3% overshoot, settles 1% in 878 ms, computed) | damping 10, mass 1 |
| duration (time-defined) | 800 ms | — |
| bounce | 0.3 | **0.25**. The docs and the source disagree. |
| visualDuration | 0.3 s | "the time… the animation will take to visually appear to reach its target" |
| restSpeed | 2 (default) / 0.01 (granular, when \|delta\| < 5) | 0.1 |
| restDelta | 0.5 (default) / 0.005 (granular) | 0.01 |
| bounce → damping ratio | `ζ = 1 − bounce` for bounce ≥ 0; `1/(1+bounce)` below 0. Comments say this maps "as SwiftUI does" (L48–56) | |
| visualDuration → stiffness | `ω₀ = 2π / (1.2 · visualDuration)`, `k = ω₀²`, `c = 2ζ√k` (L249–257). So visualDuration 0.3 equals an Apple `response` of 0.36 s. | |

The defaults resolve like this (computed): `spring(0.3, 0.3)` gives k 304.6, c 24.4, ζ 0.70,
4.6% overshoot and a 1% settle at 377 ms. With the docs' bounce of 0.25, ζ is 0.75, overshoot 2.8%
and the 1% settle is 378 ms.

**Interruption:** "Time-defined springs ignore inherited velocity" ([L313–320](https://github.com/motiondivision/motion/blob/55eb6bbd5f861785592992b6b8bed2cf81fe9103/packages/motion-dom/src/animation/generators/spring.ts#L313-L320)).
In Motion 14, a spring set with `duration`, `bounce` or `visualDuration` does **not** carry velocity
into a retarget. Only physics springs (stiffness, damping, mass) do.

### Named easings

| Name | Definition (MO) | cubic-bezier used when hardware-accelerated (WAAPI) | Link |
| --- | --- | --- | --- |
| easeIn | `cubicBezier(0.42, 0, 1, 1)` | `ease-in` | [ease.ts L3](https://github.com/motiondivision/motion/blob/55eb6bbd5f861785592992b6b8bed2cf81fe9103/packages/motion-utils/src/easing/ease.ts#L3-L5) |
| easeOut | `cubicBezier(0, 0, 0.58, 1)` | `ease-out` | ease.ts L4 |
| easeInOut | `cubicBezier(0.42, 0, 0.58, 1)` | `ease-in-out` | ease.ts L5 |
| circIn | `1 − sin(acos p)` | `cubic-bezier(0, 0.65, 0.55, 1)` | [circ.ts](https://github.com/motiondivision/motion/blob/55eb6bbd5f861785592992b6b8bed2cf81fe9103/packages/motion-utils/src/easing/circ.ts), [supported.ts L9](https://github.com/motiondivision/motion/blob/55eb6bbd5f861785592992b6b8bed2cf81fe9103/packages/motion-dom/src/animation/waapi/easing/supported.ts#L9-L12) |
| circOut | reverse of circIn | `cubic-bezier(0.55, 0, 1, 0.45)` | supported.ts L10 |
| backIn | reverse of backOut | `cubic-bezier(0.31, 0.01, 0.66, -0.59)` | [back.ts](https://github.com/motiondivision/motion/blob/55eb6bbd5f861785592992b6b8bed2cf81fe9103/packages/motion-utils/src/easing/back.ts), supported.ts L11 |
| backOut | `cubicBezier(0.33, 1.53, 0.69, 0.99)`, peak 1.084 at 60% of time (computed) | same | back.ts, supported.ts L12 |
| anticipate | `p<0.5 ? 0.5·backIn(2p) : 0.5·(2 − 2^(−10(2p−1)))` | none. Sampled to `linear()` | [anticipate.ts](https://github.com/motiondivision/motion/blob/55eb6bbd5f861785592992b6b8bed2cf81fe9103/packages/motion-utils/src/easing/anticipate.ts) |

Finding: the WAAPI strings for circ are mirrored relative to Motion's own JS functions. JS
`circOut` starts fast, but the WAAPI `circOut` string `(0.55, 0, 1, 0.45)` starts slow; it is
easings.net's `easeInCirc`. The unit test pins this mapping. Don't copy Motion's circ strings
into CSS.

Function easings without a bezier are converted to `linear()` by sampling every 10 ms with no
simplification ([linear.ts](https://github.com/motiondivision/motion/blob/55eb6bbd5f861785592992b6b8bed2cf81fe9103/packages/motion-dom/src/animation/waapi/utils/linear.ts)).
Without `linear()` support they fall back to `ease-out` ([map-easing.ts](https://github.com/motiondivision/motion/blob/55eb6bbd5f861785592992b6b8bed2cf81fe9103/packages/motion-dom/src/animation/waapi/easing/map-easing.ts)).

### Layout animation default

`defaultLayoutTransition = { duration: 0.45, ease: [0.4, 0, 0.1, 1] }`
([create-projection-node.ts L2436–2439](https://github.com/motiondivision/motion/blob/55eb6bbd5f861785592992b6b8bed2cf81fe9103/packages/motion-dom/src/projection/node/create-projection-node.ts#L2436-L2439)).
That is a 450 ms asymmetric ease-in-out: 50% of travel at 31% of the time, 90% at 60% (computed).

---

## 2. React Spring and GSAP

### React Spring presets

[RS constants.ts L1–9](https://github.com/pmndrs/react-spring/blob/ea91c9d3415b519e085a0bf39b7d0bb6492e1929/packages/core/src/constants.ts#L1-L9).
mass defaults to 1 ([AnimationConfig.ts L5–11](https://github.com/pmndrs/react-spring/blob/ea91c9d3415b519e085a0bf39b7d0bb6492e1929/packages/core/src/AnimationConfig.ts#L5-L11)).
All columns after friction are computed.

| Preset | tension | friction | ζ | 1% settle | 0.1% settle | Overshoot | t to 90% |
| --- | --- | --- | --- | --- | --- | --- | --- |
| default | 170 | 26 | 0.997 | 505 ms | 701 ms | 0 | 298 ms |
| gentle | 120 | 14 | 0.639 | 584 ms | 942 ms | 7.4% | 224 ms |
| wobbly | 180 | 12 | 0.447 | 653 ms | 1136 ms | 20.8% | 151 ms |
| stiff | 210 | 20 | 0.690 | 452 ms | 713 ms | 5.0% | 180 ms |
| slow | 280 | 60 | 1.793 | 922 ms | 1373 ms | 0 | 471 ms |
| molasses | 280 | 120 | 3.586 | 1943 ms | 2910 ms | 0 | 976 ms |

None has a cubic-bezier equivalent while it overshoots. The critically damped `default` fits a
bezier to about 1.3% of travel (see §5).

### GSAP eases

GSAP's defaults are `duration: .5` ([gsap-core.js L17–21](https://github.com/greensock/GSAP/blob/13e2b790546426a1a2e0e9b409f3f8dc6d6611f2/src/gsap-core.js#L17-L21))
and ease `quad.out` (= `power1.out`) ([L1092](https://github.com/greensock/GSAP/blob/13e2b790546426a1a2e0e9b409f3f8dc6d6611f2/src/gsap-core.js#L1092)).
The power names alias the Penner polynomials: Linear = Power0, Quad = Power1, Cubic = Power2,
Quart = Power3, Quint = Strong = Power4 ([L1066–1069](https://github.com/greensock/GSAP/blob/13e2b790546426a1a2e0e9b409f3f8dc6d6611f2/src/gsap-core.js#L1066-L1069)).
Back overshoot defaults to 1.70158 ([L1046](https://github.com/greensock/GSAP/blob/13e2b790546426a1a2e0e9b409f3f8dc6d6611f2/src/gsap-core.js#L1046)).
GSAP's Expo is a blend, not pure 2^x ([L1079](https://github.com/greensock/GSAP/blob/13e2b790546426a1a2e0e9b409f3f8dc6d6611f2/src/gsap-core.js#L1079)).
GSAP publishes no cubic-bezier values.

The `.out` bezier equivalents below come from two published sets: easings.net ([EN](https://github.com/ai/easings.net/blob/d2563f0d32a511b5556774b838ec35c3a841b15d/src/easings.yml))
and the set defined in Linear's CSS (LIN). The max error against the true polynomial and the
progress figures are computed.

| GSAP | Polynomial | easings.net bezier (max err) | Linear CSS bezier (max err) | Progress at 10% of time / t50 / t90 (easings.net) |
| --- | --- | --- | --- | --- |
| power1.out | quad | `(0.5, 1, 0.89, 1)` (0.2%) | `(.25, .46, .45, .94)` (2.5%) | — |
| power2.out | cubic | `(0.33, 1, 0.68, 1)` (0.3%) | `(.215, .61, .355, 1)` (2.2%) | 27% / 21% / 54% |
| power3.out | quart | `(0.25, 1, 0.5, 1)` (0.6%) | `(.165, .84, .44, 1)` (4.4%) | 35% / 16% / 44% |
| power4.out | quint | `(0.22, 1, 0.36, 1)` (1.1%) | `(.23, 1, .32, 1)` (1.7%) | 40% / 13% / 36% (Linear's) |
| expo.out | 1−2^(−10p) | `(0.16, 1, 0.3, 1)` (1.2%) | `(.19, 1, .22, 1)` (3.7%) | 49% / 10% / 33% |
| circ.out | √(1−(p−1)²) | `(0, 0.55, 0.45, 1)` (0.2%) | `(.075, .82, .165, 1)` (19.2%: a different curve) | — |
| back.out(1.70158) | overshoot | `(0.34, 1.56, 0.64, 1)` (0.5%), peak 1.098 | — | — |
| power1–4.inOut | | quad `(0.45,0,0.55,1)`, cubic `(0.65,0,0.35,1)`, quart `(0.76,0,0.24,1)`, quint `(0.83,0,0.17,1)` | quart `(.77,0,.175,1)`, quint `(.86,0,.07,1)` | — |

---

## 3. Apple

### SwiftUI presets

From the SDK interface (SUI). `Animation.spring(duration:bounce:)` forwards to
`spring(response: duration, dampingFraction: springDampingFraction(bounce:))`. That function returns
`1 − min(bounce, 1)` for bounce > 0, 1 at 0, and `1/(bounce+1)` below 0 (SUI L13067–13084, L13091–13096).
Stiffness k = (2π/duration)² and damping c = 4πζ/duration at mass 1. The `k`, `c` and settle
columns are computed.

| Preset | Definition in source | duration (response) | bounce | ζ | k / c | 1% settle | Overshoot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `.smooth` | `spring(duration: 0.5, bounce: extraBounce)` (SUI L13113) | 0.5 s | 0 | 1.0 | 157.9 / 25.1 | 528 ms | 0 |
| `.snappy` | `spring(duration: 0.5, bounce: 0.15 + extraBounce)` (L13119) | 0.5 s | 0.15 | 0.85 | 157.9 / 21.4 | 355 ms | 0.6% |
| `.bouncy` | `spring(duration: 0.5, bounce: 0.3 + extraBounce)` (L13125) | 0.5 s | 0.3 | 0.70 | 157.9 / 17.6 | 523 ms | 4.6% |
| `.interactiveSpring` | `spring(duration: 0.15, bounce: 0.15, blendDuration: 0.25)` (L13105–13108) | 0.15 s | 0.15 | 0.85 | 1754.6 / 71.2 | 107 ms | 0.6% |
| `.interactiveSpring(response:…)` (legacy) | defaults response 0.15, dampingFraction 0.86, blend 0.25 (L13101) | 0.15 s | ≈0.14 | 0.86 | | | |
| `.spring` (legacy) | response 0.5, dampingFraction 0.825 (L13097) | 0.5 s | 0.175 | 0.825 | 157.9 / 20.7 | 459 ms | 1.0% |
| `Spring(duration:bounce:)` | `init(duration = 0.5, bounce = 0.0)` (SUI L3109; [docs](https://developer.apple.com/documentation/swiftui/spring/init(duration:bounce:))) | 0.5 s | 0 | 1.0 | | 528 ms | 0 |
| `Animation.default` (iOS 17+) | "spring with response 0.55, dampingFraction 1.0, blendDuration 0" ([docs](https://developer.apple.com/documentation/swiftui/animation/default)). Before iOS 17 the default was a timing curve. | 0.55 s | 0 | 1.0 | 130.5 / 22.9 | 581 ms | 0 |

Apple's "duration" is a perceptual duration, chosen to be predictable. The settling duration is
longer ([WWDC23 "Animate with springs"](https://developer.apple.com/videos/play/wwdc2023/10158/)).
Apple also says: "we made a smooth spring the new default when you use a bare withAnimation"
([WWDC23 "Explore SwiftUI animation"](https://developer.apple.com/videos/play/wwdc2023/10156/)).
Springs merge into a running animation and preserve velocity; timing curves combine additively
(same session).

### UIKit and Core Animation

| Item | Value | Link |
| --- | --- | --- |
| `UIView.AnimationCurve.easeInOut` | "This is the default curve for most animations" | [docs](https://developer.apple.com/documentation/uikit/uiview/animationcurve/easeinout) |
| `CAMediaTimingFunctionName.easeInEaseOut` | `cubic-bezier(0.42, 0, 0.58, 1)` | [docs](https://developer.apple.com/documentation/quartzcore/camediatimingfunctionname/easeineaseout) |
| `CAMediaTimingFunctionName.default` | `cubic-bezier(0.25, 0.1, 0.25, 1.0)`, matches "most system animations" (= CSS `ease`) | [docs](https://developer.apple.com/documentation/quartzcore/camediatimingfunctionname/default) |
| `UIView.animate(springDuration:bounce:…)` (iOS 17) | springDuration 0.5, bounce 0.0 | [docs](https://developer.apple.com/documentation/uikit/uiview/animate(springduration:bounce:initialspringvelocity:delay:options:animations:completion:)) |

### HIG motion guidance

From [HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion), paraphrased:

- Add motion purposefully.
- Make motion optional.
- "Aim for brevity and precision in feedback animations."
- "In apps, generally avoid adding motion to UI interactions that occur frequently."
- "Let people cancel motion… don't make people wait for an animation to complete."

From [HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility):
under Reduce Motion, reduce "zooming, scaling, and peripheral motion" and replace "transitions in
x-, y-, and z-axes with fades".

---

## 4. Practitioners

### Emil Kowalski

| Item | Value | Link |
| --- | --- | --- |
| Strong ease-out "for UI" | `cubic-bezier(0.23, 1, 0.32, 1)` | [ES animate/SKILL.md L115](https://github.com/emilkowalski/skill/blob/e8a175de22ae1e49370fc144c1f3bb9aeedf988d/skills/animate/SKILL.md#L115-L117) |
| Strong ease-in-out "for on-screen movement" | `cubic-bezier(0.77, 0, 0.175, 1)` | same, L116 |
| iOS-like drawer curve (from Ionic) | `cubic-bezier(0.32, 0.72, 0, 1)` | same, L117; [Building a drawer](https://emilkowal.ski/ui/building-a-drawer-component) |
| Easing by situation | enter/exit → ease-out; move/morph → ease-in-out; hover/colour → `ease`; constant → linear; "Never `ease-in` on UI" | [ES SKILL.md L102–110](https://github.com/emilkowalski/skill/blob/e8a175de22ae1e49370fc144c1f3bb9aeedf988d/skills/animate/SKILL.md#L102-L110) |
| Durations | press 100–160 ms; tooltips and small popovers 125–200; dropdowns and selects 150–250; modals and drawers 200–500; "UI animations stay under 300ms" | [ES SKILL.md L124–132](https://github.com/emilkowalski/skill/blob/e8a175de22ae1e49370fc144c1f3bb9aeedf988d/skills/animate/SKILL.md#L124-L132) |
| Exit vs enter | "Exit animations can be ~20% faster than entrance" | [Agents with Taste](https://emilkowal.ski/ui/agents-with-taste) |
| Press scale | `scale(0.97)` on `:active`, `transition: transform 160ms ease-out`, subtle range 0.95–0.98 | [ES STANDARDS.md L59](https://github.com/emilkowalski/skill/blob/e8a175de22ae1e49370fc144c1f3bb9aeedf988d/skills/review-animations/STANDARDS.md#L59); [7 tips](https://emilkowal.ski/ui/7-practical-animation-tips) |
| Enter scale | never `scale(0)`; start at 0.9–0.97 plus opacity 0 (7 tips example: 0.93) | ES SKILL.md L86 |
| Origin | popovers, menus and tooltips scale from the trigger (`var(--transform-origin)`); "Modals are exempt" | ES SKILL.md L87 |
| Frequency | 100+ times a day: "No animation. Ever."; tens of times a day (hover, list navigation): "Remove or drastically reduce"; "Never animate keyboard-initiated actions" | [ES STANDARDS.md L7–14](https://github.com/emilkowalski/skill/blob/e8a175de22ae1e49370fc144c1f3bb9aeedf988d/skills/review-animations/STANDARDS.md#L7-L14); [You don't need animations](https://emilkowal.ski/ui/you-dont-need-animations) |
| Tooltips | first one delayed, later ones `transition-duration: 0ms` | [7 tips](https://emilkowal.ski/ui/7-practical-animation-tips) |
| Springs | `{type:"spring", duration:0.5, bounce:0.2}`; bounce 0.1–0.3, "avoid bounce in most UI", keep it for drag-to-dismiss | [ES SKILL.md L137–141](https://github.com/emilkowalski/skill/blob/e8a175de22ae1e49370fc144c1f3bb9aeedf988d/skills/animate/SKILL.md#L137-L141) |
| Interruption | "Transitions, not keyframes, for anything triggered rapidly… Transitions retarget from the current value; keyframes restart from zero" | ES SKILL.md L143–147; [Building a toast](https://emilkowal.ski/ui/building-a-toast-component) |
| Stagger | 30–80 ms between items | ES STANDARDS.md L151 |
| Reduced motion | "fewer and gentler animations, not zero — keep transitions that aid comprehension, remove movement/position changes" | [ES STANDARDS.md L162–176](https://github.com/emilkowalski/skill/blob/e8a175de22ae1e49370fc144c1f3bb9aeedf988d/skills/review-animations/STANDARDS.md#L162-L176) |

**Vaul** (drawer): `TRANSITIONS = { DURATION: 0.5, EASE: [0.32, 0.72, 0, 1] }`, `VELOCITY_THRESHOLD 0.4`,
`CLOSE_THRESHOLD 0.25` ([VA constants.ts L1–8](https://github.com/emilkowalski/vaul/blob/3e97aac6a38e4481bade71d7233ed6002e80f9b0/src/constants.ts#L1-L8)).
CSS: `transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)`, and the overlay fades over the
same 0.5 s ([style.css L1–6, L86](https://github.com/emilkowalski/vaul/blob/3e97aac6a38e4481bade71d7233ed6002e80f9b0/src/style.css#L1-L6)).
Vaul has no `prefers-reduced-motion` rule. Progress for this curve (computed): 27% at 10% of the
time, t50 16%, t90 37%. Linear's site also uses this curve at 0.5–0.7 s for large transforms (LIN).

**Sonner** (toast) ([SO styles.css](https://github.com/emilkowalski/sonner/blob/8e4662b39255120b62138312058f5d77c0139a5e/src/styles.css)):

- Toaster: `transform 400ms ease` (L51).
- Toast: `transform 400ms, opacity 400ms, height 400ms, box-shadow 200ms` (L89). No timing
  function is given, so it is `ease`.
- Removed toast that is not at the front: `transform 500ms, opacity 200ms` (L342).
- Swipe-out: 200 ms ease-out (L361–362).
- `TIME_BEFORE_UNMOUNT 200`, `TOAST_LIFETIME 4000`, `GAP 14`, 3 visible
  ([index.tsx L22–43](https://github.com/emilkowalski/sonner/blob/8e4662b39255120b62138312058f5d77c0139a5e/src/index.tsx#L22-L43)).
- Stacked toasts scale by `1 − 0.05·index`.
- Reduced motion: `transition: none; animation: none` (L708–714).

Emil says Sonner is deliberately "slightly slower, `ease` rather than `ease-out`, to feel elegant"
(ES STANDARDS.md L187).

### Rauno Freiberg

From the Web Interface Guidelines, [RF README L34–45](https://github.com/raunofreiberg/interfaces/blob/81f523a5b469ba1ea877fef262588f3b4b65d31f/README.md#L34-L45), [interfaces.rauno.me](https://interfaces.rauno.me/):

- "Switching themes should not trigger transitions and animations on elements"
- "Animation duration should not be more than 200ms for interactions to feel immediate"
- Proportional values: "Don't animate dialog scale in from 0 → 1, fade opacity and scale from
  ~0.8". "Don't scale buttons on press from 1 → 0.8, but ~0.96, ~0.9, or so".
- Frequent, low-novelty actions avoid extra animation: opening a right-click menu, adding or
  deleting list items, hovering trivial buttons. Footnote: the macOS right-click menu "only
  animates out, not in".
- Dropdown menus open on `mousedown`, not `click`.
- Hover states only under `@media (hover: hover)`.

From ["Invisible details of interaction design"](https://rauno.me/craft/interaction-design):

- Model interactions on real-world properties such as interruptibility and momentum.
- Command menus and context menus that are used hundreds of times a day appear without animation.
- Keyboard input is "less visceral", so it needs less animation.

### Vercel Web Interface Guidelines

[WIG AGENTS.md L66–78](https://github.com/vercel-labs/web-interface-guidelines/blob/434b7f91364665f2f733b310ec54809bf8f37937/AGENTS.md#L66-L78), [README L36–49](https://github.com/vercel-labs/web-interface-guidelines/blob/434b7f91364665f2f733b310ec54809bf8f37937/README.md#L36-L49):

- MUST honour `prefers-reduced-motion`.
- Prefer CSS > WAAPI > JS.
- Animate `transform` and `opacity` only. NEVER animate layout properties. NEVER `transition: all`.
- Animate only to clarify cause and effect.
- "Choose easing to match the change (size/distance/trigger)".
- MUST be interruptible and input-driven.
- MUST set a correct `transform-origin`.
- SVG transforms go on a `<g>` with `transform-box: fill-box`.
- Tooltips: "Delay first tooltip; subsequent peers instant" (AGENTS.md L55).
- Loading states: show-delay ~150–300 ms and a minimum visible time ~300–500 ms (README L16).

### Linear (published CSS, marketing site)

Tokens (LIN):

- `--speed-highlightFadeIn: 0s`, `--speed-highlightFadeOut: .15s`.
- `--speed-quickTransition: .1s`, `--speed-regularTransition: .25s`.
- An ease set including `--ease-out-quad: (.25,.46,.45,.94)`, `--ease-out-quint: (.23,1,.32,1)`
  and `--ease-in-out-quart: (.77,0,.175,1)`.

In use:

- `var(--ease-out-quad)` appears 74 times.
- The commonest transition is `background/color/filter .16s var(--ease-out-quad)`.
- Height and width use `.22s`.
- Large transforms use `.5s`/`.7s cubic-bezier(.32,.72,0,1)`.

The hover tokens are asymmetric: highlight appears instantly and fades out over 150 ms.
This is the marketing site; the app was not inspected.

### Paco Coursey (cmdk)

From the cmdk website themes (CK):

- Items: `transition: all 150ms ease; transition-property: none`. The keyboard highlight moves
  instantly, and only `:active` animates `background`
  ([vercel.scss L66–81](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/website/styles/cmdk/vercel.scss#L66-L81)).
- List height: `100ms ease` (L100–101).
- Site buttons: `150ms`, `scale(0.97)` on `:active`
  ([index.module.scss L106–126](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/website/styles/index.module.scss#L106-L126)).
- The Vercel theme "bounces" the palette to `scale(0.96)` for 100 ms on Enter/Backspace
  ([vercel.tsx L34–63](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/website/components/cmdk/vercel.tsx#L34-L63)).

Paco's [disable-theme-transitions](https://paco.me/writing/disable-theme-transitions) injects
`* { transition: none !important }` and forces a style flush with `getComputedStyle` around the
theme flip. next-themes ships this as `disableTransitionOnChange`.

### Josh Comeau

From [CSS transitions](https://www.joshwcomeau.com/animation/css-transitions/):

- Action-driven asymmetry: hover enter 125 ms, exit 450 ms ("enter… quick and snappy… exit… relaxed").
- Modals: `ease-out` on enter, **`ease-in` on exit**, with the exit quicker.

From [linear()](https://www.joshwcomeau.com/animation/linear-timing-function/):

- 11 points are "not enough" for a spring; about 50 are "much more convincing".
- A spring can't run forever, so it needs a fixed duration.
- An interrupted `linear()` spring loses velocity and "feels unnatural".
- 3 springs of 75+ points added ~1.3 kB of CSS.
- Use an `@supports` fallback.
- "80/20 rule": most transitions use tokens; keep springs for specific cases.

### Jhey Tompkins

[The path to awesome CSS easing with linear()](https://www.smashingmagazine.com/2023/09/path-css-easing-linear-function/):
set the easing as a custom property, with a bezier fallback swapped for `linear()` inside
`@supports (animation-timing-function: linear(0, 1))`.

### Tooltip timing in libraries

- Radix: `DEFAULT_DELAY_DURATION = 700`, `skipDelayDuration = 300` ([RX L31, L71–72](https://github.com/radix-ui/primitives/blob/c71610373b6aa17de24f5c7484ced5108160f12b/packages/react/tooltip/src/tooltip.tsx#L31-L72)).
- Base UI: `OPEN_DELAY = 600` ([BUI](https://github.com/mui/base-ui/blob/aeba3eb9f4613424c1a66f767bb20d25233306b6/packages/react/src/tooltip/utils/constants.ts)).

---

## 5. CSS springs with `linear()`

**How to generate one.** Sample the spring's closed-form solution over its settling time, then
simplify the points:

- Jake Archibald and Adam Argyle's generator simplifies with Ramer–Douglas–Peucker at tolerance
  0.0017 and rounds to 3 decimals by default ([LEG useURLState.ts L53–54](https://github.com/jakearchibald/linear-easing-generator/blob/17e22b88db2a94e6a798610ce406a04c7f9b8d27/src/shared/App/useURLState.ts#L53-L54); [useOptimizedPoints.ts](https://github.com/jakearchibald/linear-easing-generator/blob/17e22b88db2a94e6a798610ce406a04c7f9b8d27/src/shared/App/useOptimizedPoints.ts); [tool](https://linear-easing-generator.netlify.app/)).
- Motion samples every 10 ms with no simplification (§1).

I ran that algorithm with those defaults (computed). Both springs below use duration 0.3:

- Bounce 0 (ζ 1, settles to 0.1% in 441 ms): **19 stops, 222 characters**.
  `linear(0, 0.005 1.1%, 0.019 2.3%, 0.067 4.5%, 0.168 8%, 0.466 17%, 0.563 20.5%, 0.646 23.9%, 0.716 27.3%, 0.774 30.7%, 0.822 34.1%, 0.86 37.5%, 0.899 42%, 0.928 46.6%, 0.953 52.3%, 0.972 59.1%, 0.984 65.9%, 0.991 73.9%, 1)`
  over 441 ms.
- Bounce 0.15 (the `.snappy` shape): 19 stops, peak 1.006 (0.6% overshoot).

**Accuracy against a cubic-bezier (computed).** Fit by minimax over 61 samples:

- Bounce 0, over the 0.1% settle: `cubic-bezier(0.225, 0.292, 0.067, 1.099)` is within **1.3% of
  travel**. Over the 1% settle the error is 1.1%.
- Bounce 0.15: within 1.0% over the 1% settle, and 2.3% over the 0.1% settle.

For Area's distances these errors are below a pixel. A 0.97 → 1 scale on a 240 px menu moves
7 px, so 1.3% is about 0.1 px. A non-bouncing spring therefore buys nothing in CSS that a bezier
can't give. Overshoot under about 1% is also invisible. A bounce becomes visible at about
bounce 0.3 (4.6%, SwiftUI `.bouncy`).

**What `linear()` can't do:**

- It is a fixed-duration timing function, so on interruption the CSS transition retargets from
  the current value at zero velocity (Josh Comeau).
- Preserving velocity is the reason Apple gives for springs (WWDC23 10156), and only a JS physics
  spring delivers it. Even Motion drops velocity for time-defined springs (§1).

**Performance.** `linear()` is an ordinary timing function, so the animation stays on the
compositor for `transform` and `opacity`. The cost is only bytes: about 220 characters per spring
here, and ~1.3 kB for three 75-point springs per Josh.

**Browser support** ([web-features linear-easing](https://github.com/web-platform-dx/web-features/blob/main/features/linear-easing.yml); [MDN BCD](https://github.com/mdn/browser-compat-data/blob/main/css/types/easing-function.json)):

- Chrome/Edge 113, Firefox 112, Safari 17.2.
- Baseline low 2023-12-11, **Baseline widely available since 2026-06-11**.
- A fallback is now only needed for browsers more than ~30 months old.

**Related platform features Area already relies on or might use:**

| Feature | Versions | Baseline |
| --- | --- | --- |
| `@starting-style` | Chrome 117, Firefox 129, Safari 17.5 | low, 2024-08-06 |
| `transition-behavior: allow-discrete` | Chrome 117, Firefox 129, Safari 17.4 | low, 2024-08-06 |
| `overlay` | Chrome 117 only | not Baseline |
| `interpolate-size` / `calc-size()` (animating to `height: auto`) | Chrome 129 only | not Baseline |
| `grid-template-rows` animation (the 0fr → 1fr accordion technique) | Chrome 107, Firefox 66, Safari 16 | high since 2025-04-27 |
| View transitions (same-document) | Chrome 111, Firefox 144, Safari 18 | low, 2025-10-14 |

Sources: [web-features](https://github.com/web-platform-dx/web-features/tree/main/features).
`overlay` is the only way to keep a popover or dialog in the top layer through its exit
transition. Without it, other browsers end the exit at once.

---

## Rules practitioners agree on

1. **Animate `transform` and `opacity` only.** No layout properties, never `transition: all`.
   Sources: WIG, Emil (ES SKILL.md §4), Josh. Emil makes two exceptions: `clip-path` and
   accordion `height`.
2. **Keep UI motion short.** Rauno: ≤ 200 ms "for interactions to feel immediate". Emil: under
   300 ms. Linear: quick 100, regular 250, hover 160 (LIN). cmdk: 100–150. HIG: "brevity and
   precision".
3. **Frequent or keyboard-driven actions don't animate.** Emil ("Never animate keyboard-initiated
   actions"), Rauno (command and context menus instant, "low novelty"), HIG ("avoid adding motion
   to UI interactions that occur frequently"), cmdk (item highlight `transition-property: none`).
4. **Enter with a fast start (ease-out family); never use plain `ease-in` on entering UI.**
   Emil, Josh (enter), Motion (default tween and layout curves both decelerate), Linear (74 uses
   of ease-out-quad).
5. **Never scale from 0.** Start near 1, with the amount proportional to size. Rauno: dialogs
   ~0.8, buttons ~0.96–0.9. Emil: 0.9–0.97, press 0.97 (0.95–0.98). cmdk: 0.97 / 0.96.
6. **Origin-aware popovers.** Scale from the trigger; modals stay centred. Emil, WIG
   ("transform-origin… where it 'physically' should").
7. **Interruptible.** Use CSS transitions, not keyframes, for anything a user can re-trigger, and
   let people cancel. Emil, WIG, HIG ("Let people cancel motion"), Rauno.
8. **Exit is faster than enter, or absent.** Emil (~20% faster), Josh (modal exit quicker), Rauno
   (macOS menus animate only out), Linear (highlight in 0 s, out 150 ms). Sonner's 200 ms swipe-out
   against a 400 ms enter fits the pattern.
9. **First tooltip delayed, peers instant.** WIG, Emil, Radix (`skipDelayDuration` 300).
10. **Honour reduced motion.** WIG (MUST), Emil, HIG, Sonner. See below for what "honour" means.
11. **Don't animate theme switches.** Rauno, Paco (next-themes).
12. **Little or no bounce in product UI.** Emil ("avoid bounce in most UI"). Apple's default is
    `.smooth` (bounce 0). Motion's own value defaults are critically damped for scale-to-0 and
    the tween for colour.

## Where they disagree

| Topic | Positions |
| --- | --- |
| Exit easing | Emil: exits use ease-out too, never ease-in. Josh: modal exit uses ease-in. Apple: one spring for both directions. |
| Hover easing | Emil: `ease`. Linear: ease-out-quad at 160 ms, or 0 s in / 150 ms out. Josh: 125 ms in / 450 ms out. Rauno: trivial hovers shouldn't animate. |
| Default curve strength | Emil: built-ins "too weak", use quint `(0.23,1,0.32,1)`. Motion: shallow `(0.25,0.1,0.35,1)` for tweens. Sonner: plain `ease`. Apple CA default is `ease`. |
| On-screen movement | Emil: strong symmetric in-out `(0.77,0,0.175,1)`, which reaches only 1% at 10% of the time (computed). Motion layout: asymmetric `(0.4,0,0.1,1)` at 450 ms, which reaches 50% at 31% of the time. |
| Dialog start scale | Rauno: ~0.8. Emil: 0.9–0.97. Area today: 0.97. |
| Keyboard feedback | Emil: never animate keyboard actions. cmdk's Vercel theme bounces the palette to 0.96 on Enter/Backspace (press feedback, not a surface entrance). |
| Reduced motion | Sonner: remove everything. WIG: "reduced variant or disable". Emil's standards and Apple HIG: keep fades and remove movement and scaling. |
| Springs | Apple: springs are the default; velocity preservation is why. Emil: springs for gestures and interruptible motion only. Josh: 80/20, tokens first. Motion 14's own time-defined springs ignore inherited velocity. |
| Drawer timing | Vaul: 500 ms to mimic iOS sheets. Emil's table: 200–500. Rauno: ≤ 200 for interactions. |
| Tooltip delay | Radix 700, Base UI 600. Area today: 500. |

---

## Recommendation for Area

Area's character is quiet, compact and content-first, so motion should confirm cause and effect
and then get out of the way. Area currently has these motion tokens
(`packages/tokens/src/axes/motion.ts`):

- `ease-out (0.16,1,0.3,1)` (easings.net expo)
- `ease-in (0.7,0,0.84,0)`
- `ease-in-out (0.65,0,0.35,1)`
- `ease-spring (0.34,1.56,0.64,1)` (back.out)
- durations 0 / 100 / 150 / 250

The recommendation keeps the duration tokens and changes the curves.

### Easings (4 tokens)

| Token | Value | Use | Basis |
| --- | --- | --- | --- |
| `--area-ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Everything entering or leaving: overlays, toasts, state changes, colour, press | Emil's UI ease-out (ES L115), also defined by Linear (LIN). Performs almost the same as the current expo (t90 36% vs 33%, computed) but starts a little less abruptly (40% vs 49% of travel in the first tenth, computed) and has two practitioner sources instead of none. |
| `--area-ease-in-out` | `cubic-bezier(0.4, 0, 0.1, 1)` | Movement of something already on screen: accordion height, tab or segmented indicator, switch thumb | Motion's layout default ([MO L2436–2439](https://github.com/motiondivision/motion/blob/55eb6bbd5f861785592992b6b8bed2cf81fe9103/packages/motion-dom/src/projection/node/create-projection-node.ts#L2436-L2439)). At Area's 150–250 ms it reaches half travel at 31% of the time; Emil's quart and Area's current cubic reach it at 48–50% (computed). That slow start reads as lag at short durations, which is the reason Emil gives against ease-in. |
| `--area-ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | Large surfaces sliding from an edge: drawer, sheet | Vaul / Ionic (VA, ES L117), also used by Linear for large transforms (LIN). |
| `linear` | `linear` | Spinners, progress, indeterminate loops | Emil's "constant motion" (ES L107). |

Retire from component use:

- `--area-ease-in`: "Never `ease-in` on UI" (Emil). Exits use ease-out at a shorter duration.
- `--area-ease-spring`: a 9.8% overshoot (computed), now used only on the checkbox mark
  (`choice.css` L179), which conflicts with the quiet character (Emil, Apple `.smooth` default).

### Duration scale (ms) by interaction

The existing tokens are kept: `instant 0`, `fast 100`, `base 150`, `slow 250`. "Expressive" stays
about 1.5× (150 / 250 / 400).

| Interaction | Enter | Exit | Easing | Basis |
| --- | --- | --- | --- | --- |
| Hover background/colour (pointer only, `@media (hover: hover)`) | **0** | **150** | ease-out | Linear `highlightFadeIn 0s` / `highlightFadeOut .15s` (LIN); Josh's fast-in/slow-out asymmetry; Rauno and Emil: trivial hovers shouldn't animate in. Before adopting, verify against captured ChatGPT, Notion and Figma hover transitions (`area-capture.js`); this report did not measure the target products. |
| Press colour | 0 | 100 | ease-out | Press feedback "as soon as possible" (Emil 7 tips); 100 = Linear quickTransition. |
| Press scale | **none by default** | — | — | Emil 0.97 at 160 ms and cmdk 0.97 are both from more expressive products. If the owner wants it, use 0.98 (top of Emil's 0.95–0.98 range, proportional for 24–32 px controls per Rauno) over 100 ms. |
| Small state: checkbox mark, radio dot, chevron rotate | 100 | 100 | ease-out (no overshoot) | Emil press 100–160; Linear quick 100; SwiftUI `interactiveSpring` settles to 1% in 107 ms (computed). |
| Switch thumb, segmented/tab indicator (short travel) | 150 | 150 | ease-in-out (Motion layout) | Emil press 100–160; Rauno ≤ 200. Area's thumb now uses 250. |
| Popover / menu / select (pointer-opened) | **150**: opacity plus scale 0.97 from the trigger origin | **100**: opacity only | ease-out | Emil tooltips and popovers 125–200, dropdowns 150–250; exit faster (Emil ~20%; Rauno: menus animate out). 0.97 is inside Emil's 0.9–0.97 range and is Area's current value. |
| Menu, command palette or popover opened **by keyboard**; context menu | **0** | 100 (fade) | ease-out | Emil "never animate keyboard-initiated actions"; Rauno (context menus, command menus); HIG frequency guidance. |
| Tooltip | 100 (fade, no scale), after a 500–700 delay; 0 delay and 0 animation within 300 of a previous one | 0–100 | ease-out | Delay: Radix 700, Base UI 600, Area now 500 (pick within this range from the captured references). Skip window: Radix 300. Instant peers: WIG, Emil. |
| Dialog | **200**: opacity plus scale 0.97, centred origin | **150** | ease-out | Emil modals 200–500, origin exemption; Rauno ≤ 200. 150 = about 25% faster (Emil ~20%). Area is 150/150 now. |
| Drawer / side panel | **250** translate from the edge, scrim fades | **200** | ease-drawer | Emil 200–500; Linear regular 250. Vaul's 500 copies iOS touch sheets and is too slow for a compact pointer UI. |
| Toast | **250** translate from its edge plus fade, same edge on the way out | **150** | ease-out | Emil "Exit the way it entered" (ES L147); under 300 (Emil). Sonner's 400 `ease` is consciously "slightly slower… elegant", which is not Area's register. Stack reflow 250. |
| Layout: accordion height, panel resize, list reflow | **250** | **200** | ease-in-out (Motion layout) | Linear height/width .22 s; Emil allows `height` only for accordions. Use the `grid-template-rows: 0fr → 1fr` technique (Baseline high); `interpolate-size` is Chrome-only. |
| Theme switch | 0 (suppress all transitions during the flip) | — | — | Rauno; Paco / next-themes. |
| Stagger (rare, first-run only) | 30–50 between items | — | — | Emil 30–80; the low end suits compact UI. |

**Reduced motion.** Keep opacity fades at `fast` (100 ms) and remove every translate and scale.
Under `prefers-reduced-motion`, start scale 1 and translate 0. This follows Apple HIG ("replacing
transitions in x-, y-, and z-axes with fades") and Emil ("fewer and gentler… not zero"). It
departs from Area's current design, where reduced motion resolves to the `none` preset (all 0 ms).
The owner should decide whether `none` remains a separate, explicit user choice.

### Springs

**Don't ship `linear()` spring tokens.**

- At bounce 0, a spring and a cubic-bezier differ by ≤ 1.3% of travel (computed), which is
  sub-pixel at Area's distances.
- A bounce only becomes visible at about 0.3 (4.6% overshoot), and that conflicts with the quiet
  character.
- `linear()` can't carry velocity across an interruption, which is the one thing springs add.

`linear()` is Baseline widely available as of 2026-06-11, so support is not the obstacle; the
benefit is missing.

**Exception, if gesture-driven components arrive** (drawer drag release, slider thumb throw): use
a JS physics spring, not a time-defined one, so velocity carries over. Start from SwiftUI's
`interactiveSpring` shape: stiffness ≈ 1755, damping ≈ 71, mass 1 (ζ 0.85, 1% settle 107 ms,
computed from SUI L13105–13108). In Motion, pass stiffness and damping, because duration, bounce
and visualDuration springs drop velocity ([MO L313–320](https://github.com/motiondivision/motion/blob/55eb6bbd5f861785592992b6b8bed2cf81fe9103/packages/motion-dom/src/animation/generators/spring.ts#L313-L320)).

---

## Appendix: method for computed values

- **Spring position from rest:** x(t) = 1 − e^(−ζω₀t)(cos ω_d t + ζω₀/ω_d · sin ω_d t) for
  ζ < 1, with the critically damped and overdamped forms otherwise. ω₀ = √(k/m) and ζ = c/(2√(km)).
- **Settle time:** the last time |1 − x| exceeds 1% or 0.1%, sampled every 0.5 ms.
- **Bezier progress:** solved by bisection on x(s).
- **Fit errors:** maximum absolute difference over 61–401 samples.
- **Bezier fits:** multi-start coordinate descent minimising maximum error.
- **`linear()` strings:** Ramer–Douglas–Peucker at 0.0017 over 5 ms samples, values rounded to 3
  decimals (LEG defaults).
- Scripts lived in the session scratchpad and are not committed.
