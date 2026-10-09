# Accessibility assessment for every style

**Status: authored risk analysis and fallback proposals, not measured pass/fail results.**

All 25 entries inherit the [worst-case method](method.md), [four preference policies and role fallbacks](fallbacks.md), and [test requirements](tests.md). C means the more/less/custom handling defined in that policy, not permission to lower text/indicator floors. A no-op for a purely opaque/static layer still requires checking optional layers combined with it. The pinned definition establishes the ingredients; each risk/fallback below is an inference or recommendation.

Public standards/preferences were checked 2026-10-08; Area snapshot and provenance are in the [evidence ledger](evidence.md). Required text, focus and marks always survive removal of optional paint.

## flat

**Flat.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L9-L19).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Check plain ink against every actual solid/state plate; flat does not imply high contrast. |
| SC 1.4.11 — required information | A low-difference plate may need a solid mark or boundary; text-identified controls can retain decorative faint edges. |
| Focus and adversarial scene | Independent focus against page and selected fill; test same-color plate/ground and all active states. |
| T — reduced transparency | Already opaque recipes unchanged; any optional alpha plate becomes its opaque semantic counterpart. |
| C — contrast preferences | Use qualified ink/required cues, suppress decorative color variation. |
| F — forced colors | System fills, marks and focus; do not assume absence of shadows already makes every mark safe. |
| M — reduced motion | No intrinsic material animation; stop added transitions that express decorative travel. |

## paper

**Material / paper.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L20-L30).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Evaluate paper tint plus any texture and folded/raised highlight beneath letters; reserve a calm reading plane. |
| SC 1.4.11 — required information | Paper elevation shadow is not an identifying field or selected-state mark. |
| Focus and adversarial scene | Test focus crossing paper edge, adjoining page and fold shadow; include paper on a nearly matching page. |
| T — reduced transparency | Keep opaque sheet; remove transmitted underlay if a mixed recipe adds one. |
| C — contrast preferences | Plain sheet and qualified boundaries; remove grain/fold contrast behind reading. |
| F — forced colors | System sheet and real required edges; shadow disappearance must not erase grouping or state. |
| M — reduced motion | Static sheet; stop fold/lighting/parallax effects if supplied. |

## transparency

**Transparency.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L31-L41).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Compose both background and alpha ink over the full backdrop domain; test the interior-luminance collision. |
| SC 1.4.11 — required information | A translucent rim or fill needs evaluation against its actual neighbor, not its nominal source color. |
| Focus and adversarial scene | Use qualified opaque focus/backing; test moving and nested backdrops on both sides of the indicator. |
| T — reduced transparency | Opaque semantic body; never whole-element opacity. |
| C — contrast preferences | Opaque calm ground and solid required marks. |
| F — forced colors | System body/ink/outline; no alpha-only state differentiation. |
| M — reduced motion | Stop animated opacity; retaining static alpha still requires the transparency contrast proof. |

## glassmorphism

**Glassmorphism.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L42-L52).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Blurred scene plus tint is the ground; uniform matching patches survive blur. Put dense content on an opaque well. |
| SC 1.4.11 — required information | Transparent glass perimeter cannot alone guarantee identification over arbitrary scenes. |
| Focus and adversarial scene | Focus independent of bright rim; adversarial scrolling image edges and another glass panel behind it. |
| T — reduced transparency | Opaque panel, no backdrop filter; retaining clear fill after removing blur is not the fallback. |
| C — contrast preferences | Solid reading surface, required edge and no competing reflection. |
| F — forced colors | System panel and real boundary/focus; remove optical pseudo-elements and image textures. |
| M — reduced motion | Stop backdrop parallax/light tracking; static glass still needs its contrast domain. |

## acrylic

**Acrylic (Fluent).** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L53-L63).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Evaluate tint, blur and noise together; native fallback behavior is not inherited by a CSS imitation. |
| SC 1.4.11 — required information | Noise or frosting cannot replace a required control/selection cue. |
| Focus and adversarial scene | Test focus beside noise and a high-frequency scene; verify fallback when blur is unavailable. |
| T — reduced transparency | Opaque semantic fallback and remove scene acquisition/noise over reading. |
| C — contrast preferences | Calm opaque body and strong required marks; disable noisy/scattered decoration. |
| F — forced colors | System solid body and edges; no blanket forced-color opt-out. |
| M — reduced motion | Stop noise evolution and illumination tracking; keep controls responsive. |

## mica

**Mica.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L64-L74).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | An opaque foundation reduces local backdrop uncertainty, but tint/texture and any adaptation still need ink checks. |
| SC 1.4.11 — required information | Persistent surface identity is distinct from the required mark of its controls. |
| Focus and adversarial scene | Test focus on tinted foundation and child overlays; include every allowed wallpaper-derived tint if implemented. |
| T — reduced transparency | Use stable opaque semantic foundation; no wallpaper sampling dependency. |
| C — contrast preferences | Plain foundation, qualified required cues; do not lift near-black page merely to simulate depth. |
| F — forced colors | User system ground/content colors, real required marks. |
| M — reduced motion | Freeze optional environment/tint transitions; no automatic parallax. |

## liquid-glass

**Liquid Glass (Apple, 2025).** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L75-L85).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Refraction can move a hostile source patch under text; native adaptive ink behavior cannot be assumed or copied as hover recoloring. |
| SC 1.4.11 — required information | Dynamic lens/rim is supplementary; preserve solid semantic mark or qualified boundary. |
| Focus and adversarial scene | Test focus under maximum supported displacement and elastic states; separate ring from lens clip. |
| T — reduced transparency | Opaque no-lens shell with readable contents; native frosted behavior is not a numeric web preset. |
| C — contrast preferences | Plain opaque reading ground and solid cue, suppress lens/specular competition. |
| F — forced colors | System surface/marks, disable SVG displacement/backdrop optics explicitly. |
| M — reduced motion | Stop elastic deformation, refraction motion and tracking; immediate state feedback remains. |

## neumorphism

**Neumorphism.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L86-L96).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Labels require their own ink contrast, independent of pale relief. |
| SC 1.4.11 — required information | Same-color body and weak lobes can fail when they alone identify field/track/state; source-palette bounds are in method.md. |
| Focus and adversarial scene | Use a real focus indicator distinct from permanent raised/pressed shading; test flattened shadows and selected+focus. |
| T — reduced transparency | Keep opaque body; reduction does not fix weak relief boundaries on its own. |
| C — contrast preferences | Add qualified actual boundary/mark and simplify relief, retaining readable labels. |
| F — forced colors | Real system border/selection/focus replaces vanished shadows. |
| M — reduced motion | Stop animated lighting/extrusion; preserve explicit persistent state rather than shadow direction alone. |

## claymorphism

**Claymorphism.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L97-L107).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Broad bright/dark modeling can cross label strokes; keep a plain central reading ground. |
| SC 1.4.11 — required information | Soft extrusion may look raised without supplying a required distinct shape. |
| Focus and adversarial scene | Focus outside clay lobes and clips; test low-boundary pastel body and dark-mode profile. |
| T — reduced transparency | Opaque body; remove any translucent jelly coating in a combined recipe. |
| C — contrast preferences | Simplify bevel/lobes, use solid required cue and readable center. |
| F — forced colors | System body with real edge/mark; no shadow-dependent silhouette. |
| M — reduced motion | Stop squash/bounce/light travel; shape and hit area remain stable. |

## skeuomorphism

**Skeuomorphism.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L108-L118).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Physical textures/engraved text require actual local paint checks, not assumed real-world readability. |
| SC 1.4.11 — required information | A familiar object metaphor does not qualify weak state/track cues. |
| Focus and adversarial scene | Focus must be visible independently of texture/engraving; test every functional region and asset failure. |
| T — reduced transparency | Opaque reading/control grounds; remove transmitted glass portions while retaining meaning. |
| C — contrast preferences | Simplify texture and modeling; preserve label, required shape and state. |
| F — forced colors | Replace decorative material images with system paint; meaningful content images retain alternatives. |
| M — reduced motion | Stop decorative mechanical motion/parallax; retain immediate functional state and announcements. |

## aqua

**Aqua.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L119-L129).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Gloss bands and saturated body gradients can reverse local contrast; inspect the whole label footprint. |
| SC 1.4.11 — required information | Bright rim is not a reliable selected/pressed cue; retain explicit semantic core. |
| Focus and adversarial scene | Focus separate from glossy halo; test the highlight crossing text and selected fill. |
| T — reduced transparency | Opaque body; remove watery/transmitted layers in combined recipes. |
| C — contrast preferences | Flat qualified body/label and solid required marks; remove gloss band. |
| F — forced colors | System controls/marks, no gradient/shadow-only distinctions. |
| M — reduced motion | Stop moving highlights, watery deformation and throbbing emphasis. |

## frutiger-aero

**Frutiger Aero.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L130-L140).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Scenic imagery plus glossy overlays increases background variation; give UI reading an opaque ground. |
| SC 1.4.11 — required information | Decorative landscape/glass depth cannot supply control or chart semantics. |
| Focus and adversarial scene | Test focus over scenery and gloss, cropped backgrounds and image-load failure. |
| T — reduced transparency | Opaque widgets/reading regions; keep scenery outside those receivers if appropriate. |
| C — contrast preferences | Calm required UI; remove scenic/gradient competition under text. |
| F — forced colors | System UI; hide decorative scenery but retain meaningful media and alternatives. |
| M — reduced motion | Stop drifting scenes, animated highlights and parallax. |

## glow-neon

**Glow / neon.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L141-L151).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Keep an opaque readable ink core; halo brightness is not the letter color. |
| SC 1.4.11 — required information | Opaque status/graphic core must remain identifiable when glow is removed. |
| Focus and adversarial scene | Focus cannot be another indistinguishable bloom; test dense neighboring glows and brightest allowed halo. |
| T — reduced transparency | Make any tinted translucent housing opaque; halo is emission, not backdrop transmission. |
| C — contrast preferences | Suppress decorative bloom, retain qualified core and separate focus. |
| F — forced colors | System core/real marks; no shadows as sole status or focus. |
| M — reduced motion | Stop pulsing/flicker and traveling light; retain static truthful status. |

## linear-gradient

**Gradient fill — linear.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L152-L162).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Search all interpolated positions beneath ink, not just stops; include alpha and declared interpolation space. |
| SC 1.4.11 — required information | Required fill/mark checks follow the weakest meaningful region, not average hue. |
| Focus and adversarial scene | Independent solid focus; test angle changes and a narrow matching-luminance band crossing text. |
| T — reduced transparency | Opaque backing or opaque validated gradient; remove transmission without discarding functional color data. |
| C — contrast preferences | Plain semantic reading ground; simplify decorative gradient if it competes. |
| F — forced colors | Replace decorative gradient with system paint; preserve information using marks/labels. |
| M — reduced motion | Stop stop-position/color cycling and background-position travel. |

## radial-gradient

**Gradient fill — radial.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L163-L173).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Inspect center, rings and off-center glyph positions at each supported size. |
| SC 1.4.11 — required information | A bright center/dim edge may leave required extent unclear; retain solid cue. |
| Focus and adversarial scene | Focus outside bloom; test center/radius changes and edge hotspots. |
| T — reduced transparency | Opaque backing; keep only a qualified nontransmitting field. |
| C — contrast preferences | Remove decorative hotspot under content; retain semantic fill/mark. |
| F — forced colors | System paint/required shape replaces decorative gradient. |
| M — reduced motion | Stop breathing radius and moving center; retain static meaning. |

## conic-gradient

**Gradient fill — conic.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L174-L184).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Inspect wedge interiors and seam beneath text at all allowed angles; stop endpoints are insufficient. |
| SC 1.4.11 — required information | For meaningful wedges/rings, preserve adjoining-part identification and labels separately from decoration. |
| Focus and adversarial scene | Independent focus; test seam and similar-luminance adjacent wedges. |
| T — reduced transparency | Opaque ground; preserve functional chart information with qualified cues. |
| C — contrast preferences | Simplify decorative sweep; add required outline/labels where sectors need distinction. |
| F — forced colors | System markers/labels or equivalent accessible graphic; do not erase quantitative content. |
| M — reduced motion | Stop decorative rotation; keep progress value truthful and static. |

## mesh-gradient

**Gradient fill — mesh.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L185-L195).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Interior extrema need full-field/renderer evidence; control-point colors alone do not bound the text ground. |
| SC 1.4.11 — required information | Complex patches may hide required shape; use independent solid cue. |
| Focus and adversarial scene | Focus on qualified backing; test interior patches, crops and supported deformation extremes. |
| T — reduced transparency | Opaque reading plane; no arbitrary scene through mesh alpha. |
| C — contrast preferences | Plain body beneath UI; retain mesh only in nonessential decoration. |
| F — forced colors | System UI; suppress decorative mesh assets explicitly if URL-based. |
| M — reduced motion | Stop mesh drift and point animation. |

## gradient-stroke

**Gradient stroke.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L196-L206).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Text is checked against body, including any rim/gloss crossing its footprint. |
| SC 1.4.11 — required information | A fading or hue-varying contour cannot be assumed sufficient; provide solid required edge separate from decorative stroke. |
| Focus and adversarial scene | Focus uses independent solid paint; test transparent rim segment, corner and narrow size. |
| T — reduced transparency | Opaque reading body; decorative stroke alpha is not itself a transparent pane. |
| C — contrast preferences | Replace required fading contour with solid cue; decorative rim can be removed. |
| F — forced colors | Real system border/outline, not a gradient mask. |
| M — reduced motion | Stop rotating/chasing stroke; keyboard focus remains steady. |

## inner-shadow

**Inner shadow.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L207-L217).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Inset shading changes the ground behind edge-near text; test its maximum supported extent. |
| SC 1.4.11 — required information | An inset primitive may actually implement a fill/marker; classify intent before disabling it. |
| Focus and adversarial scene | Focus distinct from inset groove; test small fields where shading reaches values. |
| T — reduced transparency | Opaque well; keep only qualified local shading if allowed. |
| C — contrast preferences | Remove decorative cavity, preserve real required boundary and functional marker. |
| F — forced colors | Replace shadow-implemented marks with actual system shapes/rails before removing decoration. |
| M — reduced motion | Stop moving/changing cavity; value/state paint stays stable. |

## inner-glow

**Inner glow.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L218-L228).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Bright interior emission can wash out ink; test glow encroaching on the label. |
| SC 1.4.11 — required information | Preserve opaque boundary/core; faint interior glow is supplementary. |
| Focus and adversarial scene | Focus distinct from permanently luminous inset; test combined invalid/selected states. |
| T — reduced transparency | Opaque body; no change required for emission alone if local contrast is proven. |
| C — contrast preferences | Suppress inset bloom and keep qualified body/core. |
| F — forced colors | System required marks; no shadow-based glow dependence. |
| M — reduced motion | Stop breathing/flickering emission; keep static signal. |

## outer-glow

**Outer glow.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L229-L239).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Test neighboring text too: an outer halo may change its background. |
| SC 1.4.11 — required information | Halo cannot expand a quantitative fill or stand in for an opaque status mark. |
| Focus and adversarial scene | Separate solid focus from existing glow; test overlapping neighbors and clips. |
| T — reduced transparency | Opaque hosting surface when needed; glow remains a separate channel. |
| C — contrast preferences | Remove bloom, retain semantic emitter and focus. |
| F — forced colors | System mark/focus; remove optional shadow/filter emission. |
| M — reduced motion | Stop pulses and traveling bloom; preserve a stable emitter. |

## drop-shadow

**Drop shadow.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L240-L250).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Inspect text on the shadow receiver as well as inside the casting object. |
| SC 1.4.11 — required information | Cast is optional depth unless explicitly the sole cue; required control/state information must survive its removal. |
| Focus and adversarial scene | Focus not part of cast list; test clipping, stacked shadows and Flat Surface. |
| T — reduced transparency | Use opaque body if combined with transmission; cast itself is not body transparency. |
| C — contrast preferences | Simplify cast, preserve required edge/mark and receiver readability. |
| F — forced colors | Real system edge if needed after shadow loss. |
| M — reduced motion | Stop floating/lift animation; retain established Surface eligibility. |

## bevel-emboss

**Bevel / emboss.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L251-L261).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Lit/shaded facets under content may approach its luminance; keep ordinary UI ink plain. |
| SC 1.4.11 — required information | Relief direction alone must not carry required selected/pressed state. |
| Focus and adversarial scene | Solid separate focus; test light-angle changes and the darkest/lightest facet. |
| T — reduced transparency | Opaque body; optional facet modeling still needs local checks. |
| C — contrast preferences | Flatten modeling where necessary; retain actual required shape/mark. |
| F — forced colors | System body/edge/state instead of vanished bevel shadows/gradients. |
| M — reduced motion | Stop light-angle/facet animation; persistent state remains explicit. |

## letterpress

**Letterpress.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L262-L272).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Evaluate actual ink core against local ground; thin highlight/shadow is not a blanket contrast rescue. |
| SC 1.4.11 — required information | A glyph used as an icon has non-text duties; debossed decoration cannot replace its solid meaningful core. |
| Focus and adversarial scene | Focus belongs to the interactive control, not its engraved label; test smallest allowed inscription. |
| T — reduced transparency | Opaque qualified ground; keep body and content alpha separate. |
| C — contrast preferences | Plain readable text; ordinary UI already disallows this decoration under task 05. |
| F — forced colors | System ink, no text-shadow dependency. |
| M — reduced motion | Stop shifting engraving/light effects; readable characters persist. |

## grain

**Grain.** [Pinned definition and ingredients](https://github.com/ethanwongwork/area/blob/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials/01-taxonomy/catalogue.md#L273-L282).

| Check | Proposed assessment / fallback |
| --- | --- |
| SC 1.4.3 — text | Noise extrema, scale and placement matter beneath letters; a mean gray or average image is insufficient. |
| SC 1.4.11 — required information | Texture must not hide thin required marks or imply false states. |
| Focus and adversarial scene | Focus has a quiet backing; test maximum supported grain strength and worst seed/phase. |
| T — reduced transparency | Opaque body; remove texture over reading if it still impairs contrast. |
| C — contrast preferences | Disable decorative noise on UI reading/required cues. |
| F — forced colors | Explicitly disable decorative URL/SVG noise; system marks remain. |
| M — reduced motion | Freeze/remove animated noise; choose a qualified static fallback rather than an arbitrary frame. |
