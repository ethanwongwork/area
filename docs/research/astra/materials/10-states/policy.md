# State composition and motion policy

**Authored proposal.** Apply this contract to every style in [states.md](states.md), then task 05's role/context/nesting limits. Material response supplements native state and semantic paint; it does not implement input behavior. [Evidence](evidence.md) separates source facts from these proposals.

## State ownership

<!-- task19-superseded 10-states/policy.md ## State ownership -->
> **Superseded policy — D6, D7, D12 (owner, 2026-10-11):** The current vocabulary has 13 roles including row-plate; 04/05 now cover 101 contracts. Historical 12-role/78-contract counts below describe their original snapshot only. Floating shells assume arbitrary backdrops; failing edges use opaque F0. App-level transparency reduction sits beside the OS query. Forced colors explicitly sets opaque Canvas and backdrop-filter:none. Cutout rings and fixed-color fades become real transparent gaps through masks; separately required occlusion and contrast paint remain functional. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

| State | Functional signal retained | Permitted material expression | Boundary |
| --- | --- | --- | --- |
| Hover | Existing eligible hover body/edge, unchanged foreground | Quiet tint, static stronger rim, bounded halo or changed reflection *paint* | Only interactive receivers; respect hover-capable input. No compulsory motion, elevation increase, text filter, sticky touch hover or page-wide response. |
| Press | Immediate active body; actual pressed input behavior | Static shallow relief change, subdued gloss, stronger local tint or contracted halo | Temporary physical press is not persistent `aria-pressed` toggle selection. No default body scale/translate or new cast. Cancellation returns to the correct selected/open/rest base. |
| Focus-visible | Current keyboard indicator, native focus and its geometry | Calm nearby decoration so the indicator remains distinct | Immediate and independent of hover, press, selection, invalid and glow; not a sheen or bloom. Field `focus-within` remains where the component uses it. |
| Selected/checked | Persistent selection fill plus appropriate check, dot, thumb position, underline or other existing cue and native/ARIA state | Stable tint/rim, static inset/convex treatment, bounded supplemental emission | Selection may legitimately choose a different paired ink, but **hovering that selected state must keep its ink fixed**. Do not recolor all selected parts to a material accent. Mixed state keeps its own mark. |
| Open | Actual expanded/open semantics, trigger relation and surfaced content | Retained active trigger plate where supported; one new eligible shell, not cumulative glow | Open does not mean selected. Disclosure is inflow expansion; Popover is a new surface; Dialog has its own modal scrim. Their depth and timing differ. |
| Disabled | Native disabled or intentionally focusable `aria-disabled` semantics; existing selected value remains readable | Remove interactive gloss/halo response and use existing disabled paint once | CSS does not disable a control. Native disabled and `aria-disabled` have different focus/activation responsibilities. Read-only and loading are separate; suppressing every `aria-disabled` focus ring would break deliberately focusable unavailable controls. |
| Invalid | Validation status, danger edge/context, associated message and semantics | Calm decoration near error edge; optional static danger treatment only when it cannot be confused with selection | No shake, pulse or transient-only red flash. Keep value text readable; error must persist with focus and selection. Use the field's existing invalid focus recipe instead of inventing another overlapping ring. |

Source anchors: [Area state/focus semantics](evidence.md#area-state-semantics-and-paint), [M3 combined states](evidence.md#material-3), [Apple focus/toggle guidance](evidence.md#apple), [Fluent toggle/disabled behavior](evidence.md#fluent). This table defines Area proposals; it is not a cross-platform vendor behavior guarantee.

## Resolution and coexistence

1. Resolve actual native/ARIA state and the painted part from task 04. Map existing component hooks; there is no claim that every family exposes all seven states. A static glyph, page or scrim does not become a button. A field's shell may reflect its input state without becoming a separately focusable element.
2. Resolve persistent body and semantic ink from selection/checked, tone and emphasis. Resolve invalid context and unavailable/read-only/loading behavior separately. One boolean must not erase the others.
3. Select one transient interaction treatment for the same body channel: **press over hover over rest**, while enabled. An open menu trigger can retain its existing active plate; a selected toggle keeps its selected base. This priority is for competing body paint, not for removing focus or an error edge. Do not stack hover + press + open translucent washes and accidentally triple the tint.
4. Apply the role recipe, lowest absorption cap and family guard. If Quiet becomes Trace, remove secondary channels rather than multiplying the whole control's opacity. Preserve Surface ownership, dark hierarchy, fixed geometry and near-black page from task 09. Optional press “depth” means changed local shading, not a new stacking/elevation relationship.
5. Compose required cues: selected mark, invalid edge/context and focus-visible remain independently perceivable. Where the component intentionally uses a combined invalid-focus treatment, keep its geometry and danger tone. Focus is never encoded solely by a material glow or by making the object look higher.
6. Apply disabled suppression to hover/press effects, but do not reset checked/open values merely for appearance. If an open control becomes disabled, the component must decide whether to close the surface and where focus goes; the renderer must reflect the actual state, not hide the popup visually while it remains operable.
7. Apply accessibility/unsupported-effect fallback, then validate the *composited result*. Resolve scope/portal inputs locally. A disabled group opacity that already exists is not a license for another opacity multiplier on its material/text descendants.

Native checked controls, `aria-checked` where role-appropriate, `aria-selected` for selectable patterns, `aria-pressed` for toggles and `aria-expanded` for expandable controls are different semantic contracts. Reuse existing component behavior rather than substituting generic state attributes. `[data-selected]` and similar CSS hooks do not themselves expose accessible semantics. These are implementation boundaries for a future renderer, not changes made here.

## Role and family limits inherited from 05

<!-- task19-superseded 10-states/policy.md ## Role and family -->
> **Superseded policy — D1, D3, D6, D13, D14 (owner, 2026-10-11):** Area’s calm no-cast/Trace-only expression is the None default, not a material ceiling. Contrast, focus, fixed hover ink and semantic meaning remain hard limits. Ordinal caps and provisional control ranges are not limits. Numeric per-role strength multipliers and bounds must be calibrated to the board and contrast-tested at extremes; that work is pending tasks 20–22. The current vocabulary has 13 roles including row-plate; 04/05 now cover 101 contracts. Historical 12-role/78-contract counts below describe their original snapshot only. No automatic effects on glyphs or small text; display text and button labels may explicitly opt in. A curated duotone pilot is later work. Performance rules must follow measured workloads, not universal no-row-blur/static-only caps. Owner names a 60Hz minimum device; a later rerun includes Firefox. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

| Receiver/context | State material budget |
| --- | --- |
| Page, layout-only container, scrim | No hover/press material response. Functional modal scrim follows opening, with no extra glass/grain. |
| Reading container / floating surface | State lives on actionable descendants; shell may express opening or established selection only when the component supports it. One backdrop/cast owner; arrow continues shell. |
| Raised control | Quiet sparse / Trace repeated. Use body or perimeter feedback; role name does not authorize a hover lift. |
| Recessed field/track | Trace. Stable opaque reading/scale center; state edge and semantic fill remain separate from cavity shade. |
| Thumb/knob | Quiet bounded local modeling. Keep actual travel/core; existing Switch motion/stretch remains component-owned. |
| Indicator/fill | Opaque semantic core unchanged; optional Trace halo outside the data geometry. Selected range length cannot expand because glow looks wider. |
| Divider / edge | Divider remains structural; only the eligible receiver's edge changes. Never light an entire grid because one cell is hovered. Required edges are outside absorption caps. |
| Glyph / text | None for functional ink; no animated text shadow, refracting label or hover hue. Rare display inscription is a separate opt-in, not inherited UI styling. |
| Table / CodeBlock / Message | Flat row plates, preserved code/syntax and calm prose; no per-cell or per-message lens/gloss. State at the relevant action, selected row or field. |
| Calendar / Slider | Preserve today/range endpoints, connected selection and exact track/fill; hover is not committed selection. Keyboard focus stays visible with range/checked/invalid state. |
| InputGroup / DatePicker / joined controls | Shared shell/state boundary; do not restore child chrome. Open DatePicker gives Popover a shell while plain Calendar stays plain. |

These limits are the [05 policy](../05-absorption/policy.md) and [family guards](../05-absorption/family-exceptions.md) applied to state. Per-style entries cannot raise the caps. Materials remain beside Surface under [07's proposed architecture](../07-controls/architecture.md); this report introduces no second shadow owner or public state-token namespace.

## Motion contract

<!-- task19-superseded 10-states/policy.md ## Motion -->
> **Superseded policy — D14 (owner, 2026-10-11):** Performance rules must follow measured workloads, not universal no-row-blur/static-only caps. Owner names a 60Hz minimum device; a later rerun includes Firefox. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

The following timing is **existing Area policy**, not measured new material tuning. [MOTION source](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/MOTION.md#L13-L64) and [axis source](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/motion.ts#L27-L71).

| Change | Timing and proposed material treatment | Reduced motion / None |
| --- | --- | --- |
| Hover arrival / press arrival | Instant state paint. Any proposed relief/highlight difference switches immediately; no delayed feedback or pointer-following spotlight. | Same final state immediately. |
| Hover/press leave | `duration-fast` with `ease-out`: Subtle 100ms, Expressive 150ms. Crossfade optional precomputed decoration layers instead of sweeping a highlight or animating blur/displacement. | Zero-duration final paint; no crossfade. |
| Focus-visible in/out | Instant, including invalid+focus. Decorative layers cannot delay or clip it. | Identical immediate indicator. |
| Selected/checked body | Instant arrival, fast release per current recipe; do not wait for optical animation to update semantic state. | Instant final body/mark. |
| Existing small check/dot/chevron | Keep component's `fast` mark/rotation recipe; no additional material tween on the glyph. Existing Select chevrons remain still where specified. | Final mark/chevron immediately. |
| Existing Switch thumb / moving indicator | Existing `base` (150/250ms Subtle/Expressive) and `ease-in-out`. Attached material moves with that part as one rigid treatment; no independent dragging halo. Only components with moving indicators get this motion. | Final position immediately; no stretch interpolation or residue. |
| Open/close anchored surface | Existing `base` enter, `fast` exit with `ease-out`; body effects are static within that presentation. No animated backdrop blur, lensing, grain seed or new trigger-to-panel morph. | Fully open/closed layout immediately; preserve focus placement/restoration and DOM semantics. |
| Dialog, Drawer, Disclosure | Use their existing role recipes, not the anchored-surface clock. Dialog moderate/base, Drawer slow/moderate, accordion slow/moderate; the current source defines scale/translate/height details. Material adds no travel. | Final geometry immediately; do not wait on transition-end to unlock input or clean up. |
| Disabled / invalid arrival and clearance | Proposed general rule: immediate arrival; invalid clearance may use fast paint leave only if readability holds. Input already follows immediate arrival/fast leave. Disabled remains inoperable from the state change, not animation completion. | Instant final state and semantics. |
| Decorative loops | None: no shimmer, pulse, flicker, rotating conic, traveling grain or breathing glow as hover/checked/error. Existing progress motion is not a material effect. | Stop existing loops under Area policy; retain progress/status meaning and text. |

**No bouncing or new press scaling.** Apple glass and M3 ripple are cited precedents, not permission to override Area motion. Changing apparent depth through an instantaneous local shade swap is a proposed new material cue; it does not imply approved shadow dimensions or an animated physical depression. Surface casts retain their permitted role, and Flat never gets an external relief lobe.

**Interpolation matters:** a fixed foreground at both endpoints can still lose contrast during a body crossfade, and gradient/refraction states can expose different backdrop samples. Test the path, interrupted reversal and final frames. If the path cannot be bounded safely, switch immediately between validated opaque states. Precomputed paint crossfades are a proposed technique, not a guarantee of compositor-only performance; task 11 owns measurement. Do not interpolate gradient angles, stops, blur radii or SVG displacement merely because a property can animate.

**Preference precedence:** current CSS applies `prefers-reduced-motion: reduce` to root and every local motion scope. A local Expressive preset must not escape it. Task 08's reduced-transparency, increased-contrast and forced-colors fallbacks are independent: suppressing motion does not automatically make glass opaque, and making it opaque does not remove focus/state. [Emitter evidence](evidence.md#area-motion-and-derivation). Material controls may reduce motion further, never re-enable it. An Apple-style short fade in reduced mode remains an explicitly open Area policy question, not this report's adopted behavior.

## Contrast and verification plan

All these are **proposed checks**, not performed browser or assistive-technology results. Preserve existing token gates and add scene checks from [08's method](../08-accessibility/method.md); normal labels retain 4.5:1, required state/focus boundaries remain independently tested, dark APCA stays supplementary. Existing disabled dimming is not reported as a 4.5:1 pass. Inactive controls have distinct WCAG treatment; read-only/loading/help/error content must not inherit a disabled exemption. Material adds no further readability loss and preserves the unavailable value and explanation.

1. Test all 25 styles × seven applicable states on representative controls and role receivers, plus material-off/Flat. Exercise native pointer and keyboard interaction; don't validate only by forcing pseudo-classes. Check touch without hover and cancellation of an uncommitted press.
2. Test selected+hover, selected+press, selected+focus, invalid+focus, invalid+hover, open+focus, open+selected and disabled+checked. Include mixed checkbox, read-only field and loading button as negative controls. Remove all material layers and verify meaningful state remains.
3. Compare computed foreground for rest→hover, selected→selected+hover, invalid→invalid+hover and open→open+hover. No text/glyph opacity, brightness/filter or ancestor compositing trick may change apparent hover ink. If two persistent states legitimately change semantic ink, compare hover within each state rather than enforcing one ink across all states.
4. Verify actual composited text/body and required edge/adjacent paint in light/dark, neutral casts, compact/default and corner extremes. For translucent/gradient bodies include worst-case backdrops and all color-field positions from task 08, not only a white/black endpoint pair. Sample intermediate and interrupted transition frames too.
5. Check focus outside clipped material masks and beneath/over neighboring overlays. Invalid field focus follows its current danger-toned geometry; selected marks and error explanation remain. Force system colors and verify real marks/invalid/focus survive without shadow/glow.
6. Open/close twice rapidly using pointer and keyboard. Keep semantics, input and focus synchronous with component behavior; don't gate on animation completion. Inspect final rects/transforms and active animations. Reduce Motion and local None resolve to final static paint, including inside a locally Expressive subtree.
7. Validate disabled native and focusable ARIA-disabled separately: no action occurs; disabled checked remains checked; focusable unavailable controls still show keyboard location. CSS alone is not evidence of interaction blocking. Run real accessibility and browser checks before any implementation is accepted.

No new production tests are added by this research. A future change must run the [unchanged contrast gate](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/CONTRAST.md#L66-L76) plus these material scene checks; no waiver, lowered threshold or altered baseline is proposed.

## Task 19: row focus and disabled composition

D6 adds `row-plate` for the visible keyboard or active-descendant plate as well as hover. Do not replace a Menu/Command/Select focus plate with an optional rim or suppress it with a decorative cap. [Current Menu state selectors](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1138-L1156) are indexed precisely by the refreshed task 04 `menu.item` sources.

Disabled groups already own `--area-opacity-disabled`. Apply that attenuation once, after resolving child decoration; where a group fades, children reset their disabled opacity to avoid multiplying it. Materials retain this state ownership instead of introducing a second fill-only or content opacity. [ToggleGroup](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/toggle-group.css#L65-L70). Existing state/semantic meaning and fixed hover ink remain hard requirements under D1; the earlier blanket no-effects rules are superseded.
