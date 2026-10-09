# All styles: state expression

**Authored proposals, not captured vendor recipes or approved Area presets.** Each style has all seven requested states plus normal/reduced motion. The [shared policy](policy.md) is mandatory: apply states only to eligible interactive parts, preserve fixed hover ink, keep required cues independent, and use task 05 absorption caps. “Depth” below is local painted relief unless an existing Surface role already owns a cast. None of these rows changes layout, focus behavior, native semantics or corner geometry.

The [evidence ledger](evidence.md) cites Apple, Fluent and M3 precedents and pins current Area behavior. Those precedents do not prove the authored recipes or supply unmeasured opacity/blur/shadow defaults. [Task 09](../09-dark-density/README.md) governs dark, compact and geometry limits; [task 08](../08-accessibility/README.md) governs scene contrast/fallbacks.

## Coverage

| Style | State cells | Motion |
| --- | --- | --- |
| [Flat](#flat) | All seven | Normal + reduced |
| [Material / paper](#paper) | All seven | Normal + reduced |
| [Transparency](#transparency) | All seven | Normal + reduced |
| [Glassmorphism](#glassmorphism) | All seven | Normal + reduced |
| [Acrylic (Fluent)](#acrylic) | All seven | Normal + reduced |
| [Mica](#mica) | All seven | Normal + reduced |
| [Liquid Glass (Apple, 2025)](#liquid-glass) | All seven | Normal + reduced |
| [Neumorphism](#neumorphism) | All seven | Normal + reduced |
| [Claymorphism](#claymorphism) | All seven | Normal + reduced |
| [Skeuomorphism](#skeuomorphism) | All seven | Normal + reduced |
| [Aqua](#aqua) | All seven | Normal + reduced |
| [Frutiger Aero](#frutiger-aero) | All seven | Normal + reduced |
| [Glow / neon](#glow-neon) | All seven | Normal + reduced |
| [Gradient fill — linear](#linear-gradient) | All seven | Normal + reduced |
| [Gradient fill — radial](#radial-gradient) | All seven | Normal + reduced |
| [Gradient fill — conic](#conic-gradient) | All seven | Normal + reduced |
| [Gradient fill — mesh](#mesh-gradient) | All seven | Normal + reduced |
| [Gradient stroke](#gradient-stroke) | All seven | Normal + reduced |
| [Inner shadow](#inner-shadow) | All seven | Normal + reduced |
| [Inner glow](#inner-glow) | All seven | Normal + reduced |
| [Outer glow](#outer-glow) | All seven | Normal + reduced |
| [Drop shadow](#drop-shadow) | All seven | Normal + reduced |
| [Bevel / emboss](#bevel-emboss) | All seven | Normal + reduced |
| [Letterpress](#letterpress) | All seven | Normal + reduced |
| [Grain](#grain) | All seven | Normal + reduced |

<a id="flat"></a>
## Flat

Style identity: [task 01](../01-taxonomy/catalogue.md#flat). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Use the existing flat hover plate/edge; add no relief, gloss or glow. |
| Press | Use the active body plate immediately, without depth or scale change. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. No optional modeling is present; retain functional plates and boundaries. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Use the persistent selection plate and actual check/dot/position/underline; no shadow-only selection. |
| Open | Keep the supported expanded-trigger plate and expose the actual new content. Strict-flat composition needs a compatible Surface preset. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. No optional modeling is present; retain functional plates and boundaries. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. No optional modeling is present; retain functional plates and boundaries. |
| Motion | Only existing color leave and component-owned marks/presentation; no optical motion. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="paper"></a>
## Material / paper

Style identity: [task 01](../01-taxonomy/catalogue.md#paper). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Use a modest semantic body tint or clearer edge. Keep the sheet at its existing elevation. |
| Press | Change the active plate; an eligible local contact shade may look shallower without moving the sheet or adding a cast. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Paper contact seams and any sheet reflection must yield to required cues. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Stable selection tint and mark; an optional quiet inset seam is subordinate to the actual selected cue. |
| Open | New eligible overlay reads as another sheet under existing Surface depth. Trigger remains engaged only where supported. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Paper contact seams and any sheet reflection must yield to required cues. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Paper contact seams and any sheet reflection must yield to required cues. |
| Motion | Crossfade a precomputed contact treatment only on release; no lifting, folding or curling paper. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="transparency"></a>
## Transparency

Style identity: [task 01](../01-taxonomy/catalogue.md#transparency). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Change the semantic tint behind content while keeping its legibility floor; do not make the whole control more transparent. |
| Press | Use a stronger validated active tint or opaque plate, not increased exposure of arbitrary backdrop. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Variable backdrop beneath a required edge requires an opaque local guard or calm fallback. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Use a stable selection tint plus a real mark; the selected body may need an opaque reading region. |
| Open | Open actual content with its own eligible shell; transparency does not by itself add depth or create a modal scrim. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Variable backdrop beneath a required edge requires an opaque local guard or calm fallback. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Variable backdrop beneath a required edge requires an opaque local guard or calm fallback. |
| Motion | Only validated body-paint changes; no opacity animation applied to the entire control and label. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="glassmorphism"></a>
## Glassmorphism

Style identity: [task 01](../01-taxonomy/catalogue.md#glassmorphism). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Clarify the rim or add a quiet semantic tint; keep label ink and backdrop blur constant. |
| Press | Use a contained active plate and a less prominent static reflection; do not wobble the pane. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Glass reflection and backdrop variation must be masked away from required cues. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Stable selected tint/opaque core with a mark; gloss never substitutes for a checked state. |
| Open | One new popup glass shell owns its backdrop/cast; nested reading wells remain calm and avoid a second blur. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Glass reflection and backdrop variation must be masked away from required cues. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Glass reflection and backdrop variation must be masked away from required cues. |
| Motion | No animated blur or lensing. Optional reflection paint fades only on release; opening uses the component clock. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="acrylic"></a>
## Acrylic (Fluent)

Style identity: [task 01](../01-taxonomy/catalogue.md#acrylic). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Change the semantic tint/edge of the interactive receiver; keep the frosted texture and blur stationary. |
| Press | Use an active tint, with no extra grain or transparency excursion. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Acrylic noise and diffuse rim must not interfere with semantic edges or small text. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Use the selection plane and mark above the stable acrylic body; keep repeated rows flat. |
| Open | New shell may carry one eligible frosted body; do not reapply acquisition to every menu item. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Acrylic noise and diffuse rim must not interfere with semantic edges or small text. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Acrylic noise and diffuse rim must not interfere with semantic edges or small text. |
| Motion | Hold blur and grain seed/frequency; no material-specific shimmer or animated frosted transition. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="mica"></a>
## Mica

Style identity: [task 01](../01-taxonomy/catalogue.md#mica). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Keep the foundation stationary; actionable children receive their own quiet state plate. |
| Press | Use the child active plate; the whole Mica-like window does not sink or brighten. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Environmental tint must not recolor focus/invalid/selection semantics. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Persistent selected child plane and mark, independent of environmental tint. |
| Open | Keep the base opaque; the opened surface resolves its own role and material rather than revealing imagined wallpaper. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Environmental tint must not recolor focus/invalid/selection semantics. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Environmental tint must not recolor focus/invalid/selection semantics. |
| Motion | No wallpaper parallax or material resampling animation; only existing child and surface motion. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="liquid-glass"></a>
## Liquid Glass (Apple, 2025)

Style identity: [task 01](../01-taxonomy/catalogue.md#liquid-glass). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Use a static stronger contour or tint, without tracking the pointer or refracting functional ink. |
| Press | Use a contained press plate and discrete reflection/relief paint change. No default bounce or whole-control squish. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Refraction, specular color and rim masks must yield to the independent functional cue. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Stable tint/mark or actual thumb position; stop any interaction-only optical accent after release. |
| Open | Present one eligible glass shell using Area overlay motion. Do not introduce a native-style trigger morph or duplicate lens stack. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Refraction, specular color and rim masks must yield to the independent functional cue. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Refraction, specular color and rim masks must yield to the independent functional cue. |
| Motion | No animated displacement, bouncing or light sweep. This is a constrained Area translation of the cited Apple precedent. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="neumorphism"></a>
## Neumorphism

Style identity: [task 01](../01-taxonomy/catalogue.md#neumorphism). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Clarify an existing light-facing rim or body tint; do not lift every control with external paired lobes. |
| Press | Swap to a shallow concave shade/edge profile where space permits; required boundary and actual geometry stay fixed. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Soft light/dark lobes are insufficient identification or focus boundaries and must be suppressed near them. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Keep a persistent selection mark/tint; a latched-looking recess may supplement it but cannot be the sole selected cue. |
| Open | Expanded content gets its real container/overlay relationship; keep the trigger engagement separate from permanent selection. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Soft light/dark lobes are insufficient identification or focus boundaries and must be suppressed near them. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Soft light/dark lobes are insufficient identification or focus boundaries and must be suppressed near them. |
| Motion | Instant local relief swap; optional precomputed shade release fade. No physical depression, spring or external lobe under Flat. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="claymorphism"></a>
## Claymorphism

Style identity: [task 01](../01-taxonomy/catalogue.md#claymorphism). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Clarify the semantic body or edge while keeping the soft crown static. |
| Press | Flatten the painted crown and strengthen local inset shade without squashing the body or changing corner geometry. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Broad crown highlights and plush shading must be kept away from required cue geometry. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Stable selection fill and real mark; do not rely on a puffed-up volume change. |
| Open | New shell keeps its role depth; no inflatable opening or thick clay treatment across reading rows. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Broad crown highlights and plush shading must be kept away from required cue geometry. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Broad crown highlights and plush shading must be kept away from required cue geometry. |
| Motion | No elastic deformation; instant crown-state swap and bounded release crossfade only. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="skeuomorphism"></a>
## Skeuomorphism

Style identity: [task 01](../01-taxonomy/catalogue.md#skeuomorphism). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Use the declared substance finish: matte keys take tint/edge, glossy keys a static reflection change; no universal spotlight. |
| Press | A physical-looking depression may be painted as local relief, with unchanged layout and immediate active feedback. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Physical seams, textures and inscriptions must not conceal the functional state core. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Use a real latched/on mark or thumb position plus semantic tint. Physical realism cannot obscure state. |
| Open | Follow the actual control relationship, not a fictitious hinged object or drawer animation for every material. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Physical seams, textures and inscriptions must not conceal the functional state core. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Physical seams, textures and inscriptions must not conceal the functional state core. |
| Motion | No new mechanical travel or sound/haptic assumption. Specific substance still needs calibration; Area timing governs. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="aqua"></a>
## Aqua

Style identity: [task 01](../01-taxonomy/catalogue.md#aqua). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Use the semantic hover tint and a restrained static gloss change outside the label region. |
| Press | Subdue the gloss crown or swap to shallow inset modeling; retain crisp active plate and stable geometry. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Gloss bands and double rims must not cross or compete with focus/error boundaries. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Stable tinted body plus selected mark; a bright gel appearance alone does not establish checked state. |
| Open | Keep engaged trigger paint and an eligible glossy shell; its content rows remain restrained. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Gloss bands and double rims must not cross or compete with focus/error boundaries. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Gloss bands and double rims must not cross or compete with focus/error boundaries. |
| Motion | No sweeping gloss, pulse or bouncing gel. Instant state paint, optional release crossfade. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="frutiger-aero"></a>
## Frutiger Aero

Style identity: [task 01](../01-taxonomy/catalogue.md#frutiger-aero). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Use one tint or rim change on the eligible action, not moving imagery or a new environment-wide glow. |
| Press | Flatten the static gloss cue and apply active tint; no wet ripple or floating tile jump. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Bright scenic fields, glossy discs and halos yield to functional state paint. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Stable selected core/mark; environmental imagery remains decorative and cannot communicate selection alone. |
| Open | Open an ordinary eligible shell; reduce scenic texture/reflection around dense content. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Bright scenic fields, glossy discs and halos yield to functional state paint. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Bright scenic fields, glossy discs and halos yield to functional state paint. |
| Motion | No scenic pan, water shimmer or orbiting highlight. Existing Area presentation and mark motion only. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="glow-neon"></a>
## Glow / neon

Style identity: [task 01](../01-taxonomy/catalogue.md#glow-neon). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Keep emitter ink fixed; a bounded supplemental halo or semantic body tint can clarify hover without brightening glyphs. |
| Press | Contract/suppress the optional halo or switch its static extent and use active body tint. Never flash the core. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Decorative bloom must leave a distinct crisp focus/invalid/selected core. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Steady semantic core/mark with optional steady bounded emission; on state must survive glow removal. |
| Open | Keep one engaged trigger cue; opened shell does not automatically become another glowing outline. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Decorative bloom must leave a distinct crisp focus/invalid/selected core. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Decorative bloom must leave a distinct crisp focus/invalid/selected core. |
| Motion | No flicker, breathing or pulses. Optional halo-layer opacity release fade only, within contrast-safe bounds. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="linear-gradient"></a>
## Gradient fill — linear

Style identity: [task 01](../01-taxonomy/catalogue.md#linear-gradient). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Use a semantic hover plate or validated stop-color variant beneath fixed ink; hold angle and stop positions. |
| Press | Use a stronger active plate; optional lighting gradient becomes flatter without flipping the whole palette. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Varying gradient luminance must not erase a required cue at any position. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Selection plate/mark takes precedence over decorative stops; selection hue remains semantic. |
| Open | Present content normally; carry the shell gradient only where its role permits, not across every row. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Varying gradient luminance must not erase a required cue at any position. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Varying gradient luminance must not erase a required cue at any position. |
| Motion | No traveling stops or angle animation. Prefer instant validated paint or a tested precomputed release crossfade. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="radial-gradient"></a>
## Gradient fill — radial

Style identity: [task 01](../01-taxonomy/catalogue.md#radial-gradient). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Change the tint/edge while keeping the decorative light spot fixed; no pointer-following hotspot. |
| Press | Subdue a crown-like spot or use the active plate, without moving the spot through text. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. The radial bright/dark field must not interrupt the functional contour. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Persistent semantic mark/plate; a brighter radial center is not a checked indicator. |
| Open | Use a stable radial field on an eligible shell; no expanding radial reveal beneath text. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. The radial bright/dark field must not interrupt the functional contour. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. The radial bright/dark field must not interrupt the functional contour. |
| Motion | Hold origin and extent; no expanding bloom or roaming spot. Only tested paint release transitions. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="conic-gradient"></a>
## Gradient fill — conic

Style identity: [task 01](../01-taxonomy/catalogue.md#conic-gradient). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Use a separate hover plate or perimeter; keep angular stops and seam stationary. |
| Press | Apply active tint; do not spin the field as press feedback. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. The conic seam and changing perimeter colors must be masked behind required state cues. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Preserve real selection and quantitative data geometry; decorative hue angle is not the selected value. |
| Open | Open actual content without rotating the conic field or attaching it to popup travel. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. The conic seam and changing perimeter colors must be masked behind required state cues. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. The conic seam and changing perimeter colors must be masked behind required state cues. |
| Motion | No rotation, sweep or seam migration for interaction; static fields and existing component motion only. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="mesh-gradient"></a>
## Gradient fill — mesh

Style identity: [task 01](../01-taxonomy/catalogue.md#mesh-gradient). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Use a quiet semantic plate over a stable mesh, with no control-point drift. |
| Press | Apply a validated active plane or calm the mesh; do not pull color islands toward the pointer. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Multiple local bright regions must not obscure required cues or change apparent ink. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Use a stable semantic selection region and mark, preserving a quiet text ground. |
| Open | One eligible shell mesh; reading regions stay opaque/calm instead of inheriting animated color fields. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Multiple local bright regions must not obscure required cues or change apparent ink. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Multiple local bright regions must not obscure required cues or change apparent ink. |
| Motion | No mesh morph, ambient animation or control-point interpolation. Use validated static states. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="gradient-stroke"></a>
## Gradient stroke

Style identity: [task 01](../01-taxonomy/catalogue.md#gradient-stroke). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Change the optional rim paint within the existing contour, with fixed width and fixed ink. |
| Press | Subdue the lit rim or use active tint; do not rotate the perimeter gradient or shrink the body. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Decorative fading/multicolor stroke is never the only focus or invalid boundary. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Keep a stable semantic selected edge/mark independent of the decorative gradient stroke. |
| Open | Keep the eligible expanded-trigger cue and paint a single shell perimeter; attached arrow shares it. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Decorative fading/multicolor stroke is never the only focus or invalid boundary. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Decorative fading/multicolor stroke is never the only focus or invalid boundary. |
| Motion | No perimeter chase. Static rim variants can crossfade on release if required edges stay stable. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="inner-shadow"></a>
## Inner shadow

Style identity: [task 01](../01-taxonomy/catalogue.md#inner-shadow). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Clarify the edge/body; keep cavity shading outside readable content. |
| Press | Use a deeper-looking static inset treatment within the existing geometry, plus active tint. No external cast from a recess. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Inset darkness must not swallow a mark, error border or focus cue. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Persistent selection cue remains distinct from the well; chosen does not simply mean darker. |
| Open | Engaged trigger may retain an active well; popup still has its own actual surface relationship. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Inset darkness must not swallow a mark, error border or focus cue. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Inset darkness must not swallow a mark, error border or focus cue. |
| Motion | No blur-radius tween. Instant inset paint swap; optional precomputed release fade. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="inner-glow"></a>
## Inner glow

Style identity: [task 01](../01-taxonomy/catalogue.md#inner-glow). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Use bounded interior emission or tint below fixed ink, without washing over content. |
| Press | Tighten or suppress the interior halo and apply active tint, rather than a flash. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Interior light must remain separate from the sharp focus/error/selection cue. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Steady selected core/mark with optional subordinate inner emission. |
| Open | Keep trigger engagement; do not fill every opened row with inner light. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Interior light must remain separate from the sharp focus/error/selection cue. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Interior light must remain separate from the sharp focus/error/selection cue. |
| Motion | No breathing glow. Change a precomputed halo state immediately; release can fade if contrast remains safe. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="outer-glow"></a>
## Outer glow

Style identity: [task 01](../01-taxonomy/catalogue.md#outer-glow). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Use a bounded supplemental halo around an unchanged semantic core; preserve neighboring text clearance. |
| Press | Use active tint and a static contracted or removed halo, never a pulse. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Outward bloom must not merge with focus or obscure adjacent invalid/selected signals. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Steady selected core/mark; glow is supplementary and may be absent in compact or dense scenes. |
| Open | One engagement cue; new overlay follows its own role and does not duplicate the trigger bloom. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Outward bloom must not merge with focus or obscure adjacent invalid/selected signals. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Outward bloom must not merge with focus or obscure adjacent invalid/selected signals. |
| Motion | No loop or halo radius animation; optional static-layer release crossfade only. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="drop-shadow"></a>
## Drop shadow

Style identity: [task 01](../01-taxonomy/catalogue.md#drop-shadow). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Keep current role cast and use the semantic hover plate/edge; no automatic hover elevation ladder. |
| Press | Use active tint. Any proposal to reduce an existing permitted cast must be separately calibrated; no new inflow shadow. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Dark cast is not a required boundary, especially on near-black surfaces. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Selection mark/plate persists independently of cast; shadow distance is not selection. |
| Open | Existing Surface assigns the new overlay cast; open trigger paint and panel depth are separate. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Dark cast is not a required boundary, especially on near-black surfaces. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Dark cast is not a required boundary, especially on near-black surfaces. |
| Motion | No lifting/lowering animation added. Existing surface enter/exit moves static shadow with its shell. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="bevel-emboss"></a>
## Bevel / emboss

Style identity: [task 01](../01-taxonomy/catalogue.md#bevel-emboss). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Clarify the light-facing edge or semantic tint without moving the light source. |
| Press | Swap convex to shallower/concave local edge shading where permitted, with unchanged content and outline. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Light/dark bevel bands must not double or mask required contours. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Stable mark/tint plus optional latched bevel profile; maintain a non-relief signal. |
| Open | Engaged trigger keeps its local profile; overlay has one own perimeter and unchanged depth contract. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Light/dark bevel bands must not double or mask required contours. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Light/dark bevel bands must not double or mask required contours. |
| Motion | Instant relief-polarity change; no moving light rig, bevel width tween or physical depression. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="letterpress"></a>
## Letterpress

Style identity: [task 01](../01-taxonomy/catalogue.md#letterpress). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Functional UI labels take None decoration: use their containing receiver hover plate and unchanged ink. |
| Press | Use the control active plate; do not offset, darken or blur label ink to mimic pressing. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Inscription text-shadow is not a focus, disabled or invalid semantic cue. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Use the semantic mark/plate; a newly engraved word is not a selected indicator. |
| Open | Open content normally; display inscription decoration, when explicitly opted in, stays stationary. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Inscription text-shadow is not a focus, disabled or invalid semantic cue. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Inscription text-shadow is not a focus, disabled or invalid semantic cue. |
| Motion | No glyph displacement or text-shadow animation. Rare display inscription stays static through interaction. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Remove optional optical movement without removing state meaning. |

<a id="grain"></a>
## Grain

Style identity: [task 01](../01-taxonomy/catalogue.md#grain). Role absorption: [task 05](../05-absorption/recipes.md). All state/transition prescriptions below are proposals constrained by the shared policy.

| State | Proposed expression |
| --- | --- |
| Hover | Keep noise seed/frequency stationary and add the receiver hover plate; remove texture under dense labels. |
| Press | Apply the active plate; no grain burst, distortion or opacity flicker. |
| Focus-visible | Immediate existing focus indicator, unclipped and independent of material. Grain is suppressed around functional contours and reading regions. Keep field focus-within/invalid-focus behavior where applicable. |
| Selected / checked | Persistent mark/selection plate supersedes grain; texture density cannot stand for checked state. |
| Open | One stable shell texture phase; new content follows normal presentation, not a noise dissolve. |
| Disabled | Use existing disabled paint once; suppress hover/press material response and optional animated/emissive attraction. Preserve checked value and a focus indicator if deliberately focusable. Grain is suppressed around functional contours and reading regions. |
| Invalid | Keep danger edge/status message and invalid semantics; value ink stays readable. Suppress competing decoration, preserve selection and the existing invalid-focus geometry. Grain is suppressed around functional contours and reading regions. |
| Motion | No reseeding, shimmer or moving noise. Existing component motion carries static texture only. |
| Reduced motion | All durations resolve to zero under None or reduced motion, including nested Expressive scopes. Show the same final body, mark, open geometry and required cues immediately; no material loop, interpolation or delayed input. Hold the noise field static. |
