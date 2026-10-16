# Per-style dark, density and radius proposals

**All translations and scaling prescriptions here are authored proposals.** Style identities follow task 01, not new definitions. Each subsection links its taxonomy entry; the [evidence ledger](evidence.md) supplies Apple, Fluent, M3 and current Area constraints. No new opacity, shadow or highlight default is asserted.

All rows inherit [D/N/G/S/E/H/W/B/R](rules.md). G supplies sm/md/lg and compact ratios from each painted part; S holds role-owned cast; E/H/W distinguish halo, reflection and functional edge. A material can have “none” in a channel: combining layers does not make that channel mandatory.

## Every radius setting

<!-- task19-superseded 09-dark-density/styles.md ## Every radius -->
> **Superseded policy — D11 (owner, 2026-10-11):** Inner rims keep the radius floor at every setting except Sharp. Historical max(0, outer-inset) examples and tabulated square inner rims are retained but superseded. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

This matrix explicitly covers every style × every setting. It selects a painting strategy; exact current radii for both densities and all sizes are in [geometry](geometry.md). “If fit/clear” means fitting between the actual outer contour and content exclusion zone, not an assumed size-class threshold. At small corners the optional inner contour may become square or be omitted. At all other settings use the same offset equation; larger corner labels do not increase opacity, blur or stroke width. Pill entries describe control capsules; containers use their finite surface radius. Pill overrides/intrinsic circles use their resulting contour even under Sharp.

| Style | Sharp (0) | 2 | 4 | 6 | 8 | 10 | 12 | 14 | Pill |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [Flat](#flat) | square clip | tight clip | rounded clip | rounded clip | rounded clip | curved-end clip | curved-end clip | curved-end clip | capsule clip |
| [Material / paper](#paper) | square plane | single edge | single edge | offset rim if fit | offset rim if fit | wrap rim | wrap rim | wrap rim | cap-following rim |
| [Transparency](#transparency) | square clip | tight clip | rounded clip | rounded clip | rounded clip | curved-end clip | curved-end clip | curved-end clip | capsule clip |
| [Glassmorphism](#glassmorphism) | square glass mask | single glass rim | single glass rim | concentric if fit | concentric if fit | wrap reflection | wrap reflection | wrap reflection | capsule reflection |
| [Acrylic (Fluent)](#acrylic) | square glass mask | single glass rim | single glass rim | concentric if fit | concentric if fit | wrap reflection | wrap reflection | wrap reflection | capsule reflection |
| [Mica](#mica) | square plane | single edge | single edge | offset rim if fit | offset rim if fit | wrap rim | wrap rim | wrap rim | cap-following rim |
| [Liquid Glass (Apple, 2025)](#liquid-glass) | square glass mask | single glass rim | single glass rim | concentric if fit | concentric if fit | wrap reflection | wrap reflection | wrap reflection | capsule reflection |
| [Neumorphism](#neumorphism) | planar relief | reduce relief | reduce relief | fit local relief | fit local relief | curved crown | curved crown | curved crown | capsule crown |
| [Claymorphism](#claymorphism) | planar relief | reduce relief | reduce relief | fit local relief | fit local relief | curved crown | curved crown | curved crown | capsule crown |
| [Skeuomorphism](#skeuomorphism) | square plane | single edge | single edge | offset rim if fit | offset rim if fit | wrap rim | wrap rim | wrap rim | cap-following rim |
| [Aqua](#aqua) | rectangular gloss clip | one glint | one glint | band if clear | band if clear | wrap gloss ends | wrap gloss ends | wrap gloss ends | wrap capsule gloss |
| [Frutiger Aero](#frutiger-aero) | rectangular gloss clip | one glint | one glint | band if clear | band if clear | wrap gloss ends | wrap gloss ends | wrap gloss ends | wrap capsule gloss |
| [Glow / neon](#glow-neon) | mitered path | single contour | offset if fit | offset if fit | offset if fit | shared curve | shared curve | shared curve | capsule contour |
| [Gradient fill — linear](#linear-gradient) | square clip | tight clip | rounded clip | rounded clip | rounded clip | curved-end clip | curved-end clip | curved-end clip | capsule clip |
| [Gradient fill — radial](#radial-gradient) | square clip | tight clip | rounded clip | rounded clip | rounded clip | curved-end clip | curved-end clip | curved-end clip | capsule clip |
| [Gradient fill — conic](#conic-gradient) | square clip | tight clip | rounded clip | rounded clip | rounded clip | curved-end clip | curved-end clip | curved-end clip | capsule clip |
| [Gradient fill — mesh](#mesh-gradient) | square clip | tight clip | rounded clip | rounded clip | rounded clip | curved-end clip | curved-end clip | curved-end clip | capsule clip |
| [Gradient stroke](#gradient-stroke) | mitered path | single contour | offset if fit | offset if fit | offset if fit | shared curve | shared curve | shared curve | capsule contour |
| [Inner shadow](#inner-shadow) | mitered path | single contour | offset if fit | offset if fit | offset if fit | shared curve | shared curve | shared curve | capsule contour |
| [Inner glow](#inner-glow) | mitered path | single contour | offset if fit | offset if fit | offset if fit | shared curve | shared curve | shared curve | capsule contour |
| [Outer glow](#outer-glow) | mitered path | single contour | offset if fit | offset if fit | offset if fit | shared curve | shared curve | shared curve | capsule contour |
| [Drop shadow](#drop-shadow) | square plane | single edge | single edge | offset rim if fit | offset rim if fit | wrap rim | wrap rim | wrap rim | cap-following rim |
| [Bevel / emboss](#bevel-emboss) | mitered path | single contour | offset if fit | offset if fit | offset if fit | shared curve | shared curve | shared curve | capsule contour |
| [Letterpress](#letterpress) | body independent | body independent | body independent | body independent | body independent | body independent | body independent | body independent | body independent |
| [Grain](#grain) | square texture clip | tight texture clip | rounded texture clip | rounded texture clip | rounded texture clip | curved-end clip | curved-end clip | curved-end clip | capsule texture clip |

For ink, body-independent means the surrounding body still follows its own radius; the letter contour does not change with the Radius axis. For soft/plush recipes, Sharp deliberately sacrifices roundness-dependent character rather than ignoring the chosen geometry. A conic field uses the plain clipping profile: angular color position is independent of the corner setting. Same-body double rims use R; independent nested children keep their own optical floors.

<a id="flat"></a>
## Flat

Identity: [task 01 — Flat](../01-taxonomy/catalogue.md#flat). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Keep the semantic near-black page and opaque role-separated planes. No simulated top-light gradient: hierarchy comes from fill, ink and functional boundaries.

**Shadows / sm–md–lg:** None for strict flat. Selecting the taxonomy style does not silently override an independently configured floating Surface; strict-flat composition must select a compatible Surface.

**Glows / sm–md–lg:** None.

**Highlights / sm–md–lg:** None.

**Strokes / sm–md–lg:** W: semantic/required edges hold; ordinary decorative edges obey Surface.

**Compact and size limits:** No extra layer to shrink. Keep contrast and stroke widths; only Area geometry changes.

<a id="paper"></a>
## Material / paper

Identity: [task 01 — Material / paper](../01-taxonomy/catalogue.md#paper). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Use a dark opaque sheet with a distinguishable foreground plane. A quiet top edge can suggest thickness; do not make the entire page grey to rescue an invisible shadow.

**Shadows / sm–md–lg:** S: keep permitted dark cast by role; omit Card halo. Local sheet contact modeling follows G only if calibrated.

**Glows / sm–md–lg:** None; reflected edge is not emission.

**Highlights / sm–md–lg:** H: restrained edge reflection, not a glossy band.

**Strokes / sm–md–lg:** W: a stable edge supplies separation where cast vanishes.

**Compact and size limits:** Drop secondary contact shading in repeated rows. A compact popover keeps floating depth; sm has less perimeter budget than lg.

<a id="transparency"></a>
## Transparency

Identity: [task 01 — Transparency](../01-taxonomy/catalogue.md#transparency). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Use dark semantic tint over the actual backdrop with a protected content plane. A flat black backdrop may reveal no transmission; accept that rather than inventing ambient light.

**Shadows / sm–md–lg:** S: only a separately elevated role casts; transparency alone gives no height.

**Glows / sm–md–lg:** None.

**Highlights / sm–md–lg:** None by default; adding reflection changes the layered composition.

**Strokes / sm–md–lg:** W: retain an independent readable boundary when identification requires it.

**Compact and size limits:** B holds backdrop treatment; compact does not lower opacity. Simplify to an opaque tonal plane where dense contents cannot tolerate variation.

<a id="glassmorphism"></a>
## Glassmorphism

Identity: [task 01 — Glassmorphism](../01-taxonomy/catalogue.md#glassmorphism). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Use dark tint plus backdrop scattering, a restrained lit rim and an opaque or protected content region. A pale rim separates glass from near-black without a white body wash.

**Shadows / sm–md–lg:** S: one shell cast; G for a small optional inset edge shadow.

**Glows / sm–md–lg:** None unless emission is explicitly composed; a rim stays sharp.

**Highlights / sm–md–lg:** H: shorten or reduce reflection coverage near labels; soft band dimensions follow painted height.

**Strokes / sm–md–lg:** W: rim clipped to actual glass contour; required edge survives transparency.

**Compact and size limits:** B holds backdrop blur. Compact removes secondary reflections before changing body opacity; sm uses a single rim when double geometry cannot fit.

<a id="acrylic"></a>
## Acrylic (Fluent)

Identity: [task 01 — Acrylic (Fluent)](../01-taxonomy/catalogue.md#acrylic). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Adapt the task-01 acrylic layer stack to a darker tint/luminosity treatment with fine texture and readable tonal plane. Keep light confined to an edge, not a luminous haze across all contents. This is an Area translation, not native Fluent parity.

**Shadows / sm–md–lg:** S: shell cast belongs to floating role, not each nested acrylic child.

**Glows / sm–md–lg:** None.

**Highlights / sm–md–lg:** H: matte/frosted response; no compulsory glossy reflection.

**Strokes / sm–md–lg:** W: modest contour contrast and separate functional boundary.

**Compact and size limits:** B holds blur/texture frequency; compact lowers texture prominence around text. G only scales local edge modeling, not scene blur.

<a id="mica"></a>
## Mica

Identity: [task 01 — Mica](../01-taxonomy/catalogue.md#mica). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Use a stable dark, substantially opaque base with a restrained environmental tint and differentiated foreground planes. Do not turn a background material into clear glass to show an empty black backdrop.

**Shadows / sm–md–lg:** S: only a role requiring lift casts; no per-row elevation.

**Glows / sm–md–lg:** None.

**Highlights / sm–md–lg:** No mandatory specular band; any added reflection is a separate finish.

**Strokes / sm–md–lg:** W: local pane edge may carry hierarchy without a broad halo.

**Compact and size limits:** Hold environmental treatment as density changes. Dense content remains calm and opaque; material scale follows its containing plane, not every child size.

<a id="liquid-glass"></a>
## Liquid Glass (Apple, 2025)

Identity: [task 01 — Liquid Glass (Apple, 2025)](../01-taxonomy/catalogue.md#liquid-glass). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Keep a controlled dark body/readable core while rim reflections and any backdrop displacement describe the boundary. On flat near-black, refraction can be visually absent; do not compensate with a universal neon halo. A CSS experiment is not Apple renderer equivalence.

**Shadows / sm–md–lg:** S for permitted cast; avoid dark-smear stacking around nested glass.

**Glows / sm–md–lg:** No default emission; reflected spectral color is not a glow source.

**Highlights / sm–md–lg:** H: shape-following specular reflection; displacement amplitude, if used, needs its own G-calibrated painted body and content exclusion.

**Strokes / sm–md–lg:** W: shared contour for reflection/refraction mask and fallback edge.

**Compact and size limits:** Remove displacement and extra reflection lobes first for small/dense bodies; retain opaque semantic core. B does not scale backdrop blur from hit-target height.

<a id="neumorphism"></a>
## Neumorphism

Identity: [task 01 — Neumorphism](../01-taxonomy/catalogue.md#neumorphism). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Near-black removes room for the dark relief lobe. Model a local lighter top/rim against a distinct body, retain a dark contact side if useful, and add the required boundary. Equal light/dark external lobes are not a contrast solution.

**Shadows / sm–md–lg:** S disallows external lobes under Flat; G scales permitted local relief. Do not brighten the page just to display a shadow.

**Glows / sm–md–lg:** None; the light lobe is modeled reflection, not emission.

**Highlights / sm–md–lg:** H: one directional lit bevel or top plane, restrained around text.

**Strokes / sm–md–lg:** W: explicit identification edge where needed, independent of soft relief.

**Compact and size limits:** Sm and compact simplify to inset/edge modeling when paired lobes invade neighbors; lg can retain more relief only within absorption caps.

<a id="claymorphism"></a>
## Claymorphism

Identity: [task 01 — Claymorphism](../01-taxonomy/catalogue.md#claymorphism). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Use an opaque dark body with a soft lighter crown and a readable perimeter. Preserve local volume without converting the whole object to pale plastic.

**Shadows / sm–md–lg:** S for cast, G for rounded inset shading; no extra external lobe under Flat.

**Glows / sm–md–lg:** None by default.

**Highlights / sm–md–lg:** H: soft crown scales to painted body; keep its bright area off small text.

**Strokes / sm–md–lg:** W: readable core contour plus optional soft edge modeling.

**Compact and size limits:** Compact reduces crown coverage and drops secondary inset layers. Sm may lose the plush effect; do not secretly increase its radius to keep it.

<a id="skeuomorphism"></a>
## Skeuomorphism

Identity: [task 01 — Skeuomorphism](../01-taxonomy/catalogue.md#skeuomorphism). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Translate the chosen substance, not just the light screenshot: dark metal/rubber/wood need different body paints but share legible ink, local light direction and a near-black surrounding page.

**Shadows / sm–md–lg:** S for cast; G for explicit local relief only. Texture is not elevation.

**Glows / sm–md–lg:** E only for genuinely luminous indicators in the composition.

**Highlights / sm–md–lg:** H follows the chosen finish; matte controls do not inherit chrome gloss.

**Strokes / sm–md–lg:** W: physical-looking perimeter cannot replace required semantic boundary.

**Compact and size limits:** Remove tiny seams, deep grooves and texture contrast before shrinking functional strokes. This umbrella style needs a specific substance preset to calibrate any numbers.

<a id="aqua"></a>
## Aqua

Identity: [task 01 — Aqua](../01-taxonomy/catalogue.md#aqua). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Use a dark colored gel/plastic body, subdued glossy upper reflection and a coherent rim. A light-theme white gloss band cannot simply be pasted above pale dark-mode text.

**Shadows / sm–md–lg:** S for allowed cast; G for body concavity/contact modeling.

**Glows / sm–md–lg:** No automatic bloom; compose E only for a deliberate luminous accent.

**Highlights / sm–md–lg:** H: band depth follows painted height, with label exclusion and wrap at the ends.

**Strokes / sm–md–lg:** W: simplify double rims to one when clearance is insufficient.

**Compact and size limits:** Compact/sm use one gloss cue; lg may support a separated lower rim subject to the same caps, never automatic added brightness.

<a id="frutiger-aero"></a>
## Frutiger Aero

Identity: [task 01 — Frutiger Aero](../01-taxonomy/catalogue.md#frutiger-aero). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Darken the environmental/body palette while retaining a selective glass/gloss accent. Keep imagery and sky-like brightness outside dense functional content; preserve the near-black page.

**Shadows / sm–md–lg:** S only at allowed surface relationships.

**Glows / sm–md–lg:** E only for intentional luminous accents; not a general colored haze.

**Highlights / sm–md–lg:** H: isolated specular band or disc reflection, not repeated on every Table cell.

**Strokes / sm–md–lg:** W: one coherent outer silhouette for each semantic body.

**Compact and size limits:** Compact collapses imagery, gloss and texture to a tonal body plus one cue. This is an aesthetic family, so a specific composition remains necessary for calibration.

<a id="glow-neon"></a>
## Glow / neon

Identity: [task 01 — Glow / neon](../01-taxonomy/catalogue.md#glow-neon). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Retain a crisp semantic emitter over the dark page and place a restrained colored halo outside or inside it. Brightness belongs to the emitter, not every container. Keep text labels unglowed unless separately approved display lettering.

**Shadows / sm–md–lg:** S only if a separate raised body exists; glow does not imply elevation.

**Glows / sm–md–lg:** E: G scales local halo reach, not core opacity; cap to adjacent content clearance.

**Highlights / sm–md–lg:** No obligatory key-light highlight; emission is independent of light angle.

**Strokes / sm–md–lg:** W: sharp core/boundary remains independent of blurred halo and focus.

**Compact and size limits:** Sm/compact shorten or remove outward halo first. Lg does not get a stronger core merely because its box is taller.

<a id="linear-gradient"></a>
## Gradient fill — linear

Identity: [task 01 — Gradient fill — linear](../01-taxonomy/catalogue.md#linear-gradient). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Derive a dark semantic stop set. Use a lighter top only if the gradient models lighting; decorative color ramps need not follow the key light. Evaluate the full field beneath ink.

**Shadows / sm–md–lg:** None inherent; S governs any composed cast.

**Glows / sm–md–lg:** None inherent.

**Highlights / sm–md–lg:** B keeps normalized stops; H applies only when the fill intentionally acts as a reflection or modeled top.

**Strokes / sm–md–lg:** W independent of fill gradient; do not use its bright endpoint as the sole boundary.

**Compact and size limits:** B lets stop positions scale with the body; narrow contrast excursion or remove the ramp in dense text. No extra layer just because size becomes lg.

<a id="radial-gradient"></a>
## Gradient fill — radial

Identity: [task 01 — Gradient fill — radial](../01-taxonomy/catalogue.md#radial-gradient). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Use a dark field with a controlled local brighter region. A radial fill is not an external glow; keep its bright center away from vulnerable text or change the paired ink plan.

**Shadows / sm–md–lg:** None inherent; S when composed.

**Glows / sm–md–lg:** Only E if separately painted outside the body.

**Highlights / sm–md–lg:** B scales a body-relative field; H if it models a crown. A scene-relative light spot can instead keep its own reference.

**Strokes / sm–md–lg:** W independent perimeter; the radial field must not erase one side of it.

**Compact and size limits:** Sm/compact keep one restrained spot or a flat plane; hold contrast across the entire radial transition, not endpoints alone.

<a id="conic-gradient"></a>
## Gradient fill — conic

Identity: [task 01 — Gradient fill — conic](../01-taxonomy/catalogue.md#conic-gradient). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Use dark-compatible color stops with a controlled seam. Do not pass a decorative conic rotation off as a physical light source or repaint semantic progress data.

**Shadows / sm–md–lg:** None inherent; S when composed.

**Glows / sm–md–lg:** None inherent; E only for explicit emission.

**Highlights / sm–md–lg:** B holds angular stops; no compulsory top highlight.

**Strokes / sm–md–lg:** W independent contour; a gradient-stroke composition has its own row below.

**Compact and size limits:** Compact reduces contrast or removes the decorative conic field if the seam/center crowds text. G does not change angular stops with size.

<a id="mesh-gradient"></a>
## Gradient fill — mesh

Identity: [task 01 — Gradient fill — mesh](../01-taxonomy/catalogue.md#mesh-gradient). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Use a bounded dark multicolor field with local bright regions kept behind non-text space. A near-black page stays a semantic page rather than a full-screen luminous mesh.

**Shadows / sm–md–lg:** None inherent; S when composed.

**Glows / sm–md–lg:** None inherent; luminous-looking fill is still body paint.

**Highlights / sm–md–lg:** B scales normalized control points; any reflection is a separate H layer.

**Strokes / sm–md–lg:** W independent contour, evaluated against varying perimeter colors.

**Compact and size limits:** Sm/compact remove secondary color islands or reduce to an opaque tonal fill; larger surfaces may keep the mesh away from dense content, not increase all amplitudes.

<a id="gradient-stroke"></a>
## Gradient stroke

Identity: [task 01 — Gradient stroke](../01-taxonomy/catalogue.md#gradient-stroke). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Keep a dark body and a directionally brighter rim, with a separate stable identification edge when the gradient fades. Distinguish decorative hue travel from lit-edge shading.

**Shadows / sm–md–lg:** S only for an independently elevated body.

**Glows / sm–md–lg:** None unless E is separately composed.

**Highlights / sm–md–lg:** H if the stroke models a lit edge; otherwise keep its authored angle.

**Strokes / sm–md–lg:** W: width holds; gradient runs inside the same offset contour. Do not multiply both width and alpha by q.

**Compact and size limits:** Compact/sm reduce stops or use one rim, retaining the functional edge. Lg gains no thicker functional boundary automatically.

<a id="inner-shadow"></a>
## Inner shadow

Identity: [task 01 — Inner shadow](../01-taxonomy/catalogue.md#inner-shadow). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Use a readable dark cavity and a subtle opposite lit lip; an all-black well on near-black cannot show the shadow. Preserve the field body rather than forcing a white halo.

**Shadows / sm–md–lg:** G scales inset offset, blur and spread, with sign preserved; S still governs any separate outer cast.

**Glows / sm–md–lg:** None.

**Highlights / sm–md–lg:** H: optional light lip opposite the shaded recess side.

**Strokes / sm–md–lg:** W: boundary stays explicit where needed; inset shade is not its substitute.

**Compact and size limits:** Compact/sm tighten the cavity band and remove it before it touches text. Tracks use their actual thin painted rail as reference, not the row height.

<a id="inner-glow"></a>
## Inner glow

Identity: [task 01 — Inner glow](../01-taxonomy/catalogue.md#inner-glow). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Keep the glow inside a dark body and below crisp content. A brighter interior edge may describe emission or reflection; record which, rather than calling every light rim glow.

**Shadows / sm–md–lg:** None inherent; S when composed.

**Glows / sm–md–lg:** E for emission, G for inset glow reach; cap away from ink.

**Highlights / sm–md–lg:** H only if the effect is reclassified as reflection, not an additional automatic layer.

**Strokes / sm–md–lg:** W: maintain independent required edge and focus.

**Compact and size limits:** Sm/compact narrow or drop the luminous interior band; do not turn a recessed field into an evenly bright fill just to preserve glow strength.

<a id="outer-glow"></a>
## Outer glow

Identity: [task 01 — Outer glow](../01-taxonomy/catalogue.md#outer-glow). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Keep a crisp source silhouette, a restrained halo and the dark page. Do not tint all surrounding text or let adjacent controls merge into one luminous cluster.

**Shadows / sm–md–lg:** None inherent; emission is not cast depth.

**Glows / sm–md–lg:** E: local halo extent follows G with clearance cap; opacity does not scale up.

**Highlights / sm–md–lg:** None inherent; emission does not require a directional top.

**Strokes / sm–md–lg:** W: semantic core and focus independent of halo.

**Compact and size limits:** Compact repeated controls remove external glow when clearance vanishes; lg may have more room but does not gain intensity automatically.

<a id="drop-shadow"></a>
## Drop shadow

Identity: [task 01 — Drop shadow](../01-taxonomy/catalogue.md#drop-shadow). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Retain dark cast where the receiving plane lets it read. Add a separate semantic edge or lighter body plane when it does not; do not invert the cast to white.

**Shadows / sm–md–lg:** S: current role casts hold across size/density; local sculpting is a different layer governed by G.

**Glows / sm–md–lg:** None.

**Highlights / sm–md–lg:** None inherent; any added rim/top is a separate reflection layer.

**Strokes / sm–md–lg:** W supplies necessary distinction where dark cast is ineffective.

**Compact and size limits:** A compact floating list keeps floating depth; dense rows do not each gain casts. Shadow choice follows role, not sm/md/lg names.

<a id="bevel-emboss"></a>
## Bevel / emboss

Identity: [task 01 — Bevel / emboss](../01-taxonomy/catalogue.md#bevel-emboss). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Use a light-facing rim/top and a restrained dark-facing edge around a dark body. Reverse relief polarity for a recess without reversing the semantic state or recoloring its ink.

**Shadows / sm–md–lg:** G for local shaded bevel; S for any external cast.

**Glows / sm–md–lg:** None.

**Highlights / sm–md–lg:** H: directional edge widths/depth follow the actual contour and local normal; avoid double-bright rounded corners.

**Strokes / sm–md–lg:** W: bevel depth may scale, required stroke does not. Shared rim path prevents nested corner drift.

**Compact and size limits:** Compact/sm collapse multi-step bevels to one light/dark edge pair or one semantic edge if they cannot fit.

<a id="letterpress"></a>
## Letterpress

Identity: [task 01 — Letterpress](../01-taxonomy/catalogue.md#letterpress). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Keep readable light semantic ink on dark surfaces; any inscription effect uses a tiny offset rim/shade outside the ink, not dark low-contrast text chosen for realism.

**Shadows / sm–md–lg:** No body cast inherent; content decoration is not Surface elevation.

**Glows / sm–md–lg:** None.

**Highlights / sm–md–lg:** Content decoration follows glyph/letter scale, never the surrounding control q.

**Strokes / sm–md–lg:** Functional glyph strokes stay intact; no body rim implied.

**Compact and size limits:** Use none on normal dense labels/code. Optional display lettering scales from actual font geometry and drops the relief when small; larger control size alone never enables it.

<a id="grain"></a>
## Grain

Identity: [task 01 — Grain](../01-taxonomy/catalogue.md#grain). Radius strategy: the nine cells above plus R; exact numbers come from the geometry matrix, not this prose.

**Near-black translation (D/N):** Use low-prominence texture on the dark body, preserving the near-black page and an untextured legible content plane. Grain changes texture, not geometric depth.

**Shadows / sm–md–lg:** None inherent; S when composed.

**Glows / sm–md–lg:** None.

**Highlights / sm–md–lg:** None inherent.

**Strokes / sm–md–lg:** W remains independent; texture does not establish a boundary.

**Compact and size limits:** B holds calibrated spatial frequency rather than stretching noise per component; compact/sm reduce coverage or remove grain around text. Lg does not automatically increase contrast.
