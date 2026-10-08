# Sourced catalogue

Read with the [shared layer model](layer-model.md) and [ingredient matrix](ingredient-matrix.md).

All public sources checked **2026-10-07**. Definitions paraphrase their sources; matrix decompositions and classifications are Astra’s synthesis. Examples are source illustrations, documented effects or historical products, not new captures or measured presets.

The requested “gradient fill” is one paint family with four separately indexed constructions below: linear, radial, conic and mesh. Mesh is not an assertion of a native CSS gradient function. A gradient stroke is the same kind of paint assigned to an edge mask.

<a id="flat"></a>
## Flat

**Kind:** visual language.

A deliberately planar treatment that suppresses realistic surface modeling. Strict flat omits gloss and simulated relief; the related flat 2.0 vocabulary admits restrained depth cues. Neither names a substance.

**Canonical reference:** Windows 8 Metro and the flat examples in NN/g’s article; use the article’s flat 2.0 comparison to delimit the term.

**Evidence:** [Nielsen Norman Group — Flat Design: Its Origins, Its Problems, and Why Flat 2.0 Is Better](https://www.nngroup.com/articles/flat-design/) (checked 2026-10-07).

<a id="paper"></a>
## Material / paper

**Kind:** material recipe + design language.

Google’s original Material uses paper as a model for layered surfaces, cast shadows and meaningful motion. Here “paper” means that opaque sheet-like recipe, not every generation or feature of Google Material Design.

**Canonical reference:** Material 1’s paper prototypes described by Christian Robertson; the documented layer/shadow experiments are the reference, rather than a guessed paper texture.

**Evidence:** [Google Design — Material Eras, Material 1](https://design.google/library/material-design-eras) (checked 2026-10-07).

<a id="transparency"></a>
## Transparency

**Kind:** optical property.

A compositing property: content behind a foreground contributes to the result according to alpha. It does not by itself imply blur, reflection, refraction or glass. Distinguish a partially transparent paint from opacity applied to an entire group.

**Canonical reference:** W3C’s source-over compositing diagrams, isolating foreground alpha from the backdrop.

**Evidence:** [W3C — Compositing and Blending Level 1, simple alpha compositing](https://www.w3.org/TR/compositing-1/#simplealphacompositing) (checked 2026-10-07).

<a id="glassmorphism"></a>
## Glassmorphism

**Kind:** material recipe umbrella.

A frosted-glass aesthetic combining a see-through surface with a softened backdrop. Malewicz’s examples vary tint/gradient alpha, blur, edges and optional noise; the name does not designate one physical or platform implementation.

**Canonical reference:** The author’s four frosted card recipes and their border variations, including dark treatments.

**Evidence:** [Michał Malewicz — Glassmorphism in 2021](https://hype4.academy/articles/design/glassmorphism-in-2021) (checked 2026-10-07).

<a id="acrylic"></a>
## Acrylic (Fluent)

**Kind:** vendor material recipe.

Microsoft’s translucent brush combines a backdrop, blur, an exclusion blend, tint and noise. Background acrylic samples behind the app; in-app acrylic samples within it. Microsoft supplies opaque fallbacks under conditions such as transparency being disabled.

**Canonical reference:** WinUI MenuFlyout, open ComboBox and AutoSuggestBox surfaces in Microsoft’s Acrylic guide.

**Evidence:** [Microsoft — Acrylic material](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic) (checked 2026-10-07).

<a id="mica"></a>
## Mica

**Kind:** vendor material recipe.

An opaque Windows foundation material influenced by the theme and desktop wallpaper, sampled once. It is not a live see-through pane. Mica Alt strengthens the wallpaper influence for uses such as tabbed title bars.

**Canonical reference:** Microsoft’s Mica window/title-bar and NavigationView examples; long-lived app foundations, including Settings.

**Evidence:** [Microsoft — Mica material](https://learn.microsoft.com/en-us/windows/apps/design/style/mica) (checked 2026-10-07).

<a id="liquid-glass"></a>
## Liquid Glass (Apple, 2025)

**Kind:** vendor material + behavior system.

Apple’s material joins lensing/refraction, responsive motion, highlights and adaptive separation. Regular adapts to content; Clear is more transparent and needs dimming for legibility. A blurred translucent card alone does not reproduce these behaviors.

**Canonical reference:** WWDC25’s toolbar-to-menu transition, floating sidebars and glass controls. Treat these as the native reference, not evidence of a complete CSS reproduction.

**Evidence:** [Apple — Meet Liquid Glass, WWDC25 session 219](https://developer.apple.com/videos/play/wwdc2025/219/) (checked 2026-10-07).

<a id="neumorphism"></a>
## Neumorphism

**Kind:** material recipe.

Objects appear extruded from, or pressed into, the same surface. Similar body/background colors plus opposed light and dark shading give soft relief; an independent floating card is a different cue.

**Canonical reference:** Alex Plyuto’s soft UI example reproduced in Malewicz’s article, and its illustrated inset pressed-state treatment. These are design demonstrations, not a platform component standard.

**Evidence:** [Michał Malewicz — Neumorphism in User Interfaces](https://hype4.academy/articles/design/neumorphism-in-user-interfaces) (checked 2026-10-07).

<a id="claymorphism"></a>
## Claymorphism

**Kind:** material recipe.

Inflated, rounded objects modeled with light and dark inner shading plus an external shadow. Unlike the same-surface neumorphic recipe, their color can stand apart from the ground.

**Canonical reference:** Malewicz’s inflated cards/buttons and construction sequence. The rounded, domed volume is characteristic; it is not a requirement to simulate granular sculpting clay.

**Evidence:** [Michał Malewicz — Claymorphism in User Interfaces](https://hype4.academy/articles/design/claymorphism-in-user-interfaces) (checked 2026-10-07).

<a id="skeuomorphism"></a>
## Skeuomorphism

**Kind:** metaphor / visual language.

A design retains recognizable ornamental features of a real-world predecessor to communicate what it is or does. It can use many materials; realism or a shadow alone does not establish that metaphor.

**Canonical reference:** The Kindle Fire wooden bookshelf shown by NN/g: shelves describe a real object used to organize books.

**Evidence:** [Nielsen Norman Group — Flat Design: Its Origins, Its Problems, and Why Flat 2.0 Is Better](https://www.nngroup.com/articles/flat-design/) (checked 2026-10-07).

<a id="aqua"></a>
## Aqua

**Kind:** historical visual language.

Apple’s original Mac OS X interface, announced in 2000, foregrounded luminous, semi-transparent controls and fluid interaction. Use the name for the historical language, not as a synonym for arbitrary glass.

**Canonical reference:** The launch announcement’s buttons, scrollbars, windows, Dock and Finder. Exact gloss geometry is not specified there.

**Evidence:** [Apple — Apple Unveils Mac OS X, January 5, 2000](https://www.apple.com/newsroom/2000/01/05Apple-Unveils-Mac-OS-X/) (checked 2026-10-07).

<a id="frutiger-aero"></a>
## Frutiger Aero

**Kind:** retrospective visual language.

CARI’s retrospective category joins glossy digital imagery, glass, natural imagery and humanist typography. It is an art-direction bundle rather than a single material or a synonym for Windows Aero.

**Canonical reference:** CARI’s curated archive and linked Asadal Design Mall case study; Microsoft’s archived Aero icon examples provide a vendor-authored example of the reflective icon vocabulary.

**Evidence:** [Consumer Aesthetics Research Institute — Frutiger Aero](https://cari.institute/aesthetics/frutiger-aero), [Microsoft — Icons (Windows 7 UX Guide)](https://learn.microsoft.com/en-us/windows/win32/uxguide/vis-icons) (checked 2026-10-07).

<a id="glow-neon"></a>
## Glow / neon

**Kind:** emissive style recipe.

A luminous mark is given surrounding bloom so it reads as a light source. This is a style assembled from a core mark and glow effects; the surrounding surface need not itself be emissive.

**Canonical reference:** Erica Larson’s Adobe tutorial wraps a magenta neon triangle around a wrist using outer and inner glow plus masking.

**Evidence:** [Adobe — How to create a neon effect in Photoshop](https://www.adobe.com/creativecloud/photography/discover/neon-effect.html) (checked 2026-10-07).

<a id="linear-gradient"></a>
## Gradient fill — linear

**Kind:** paint primitive.

Color stops vary along a straight gradient axis. The result can shade a surface, but its colors and direction need not describe lighting.

**Canonical reference:** CSS Images 3’s linear-gradient figures and stop-placement examples.

**Evidence:** [W3C — CSS Images Level 3, Gradients](https://www.w3.org/TR/css-images-3/#gradients) (checked 2026-10-07).

<a id="radial-gradient"></a>
## Gradient fill — radial

**Kind:** paint primitive.

Color varies outward through circles or ellipses from a center. A radial fill can suggest a highlight or halo without being either physically.

**Canonical reference:** CSS Images 3’s circular/elliptical radial-gradient figures.

**Evidence:** [W3C — CSS Images Level 3, Gradients](https://www.w3.org/TR/css-images-3/#gradients) (checked 2026-10-07).

<a id="conic-gradient"></a>
## Gradient fill — conic

**Kind:** paint primitive.

Color varies by angle around a center. This angular field differs from the outward progression of a radial gradient.

**Canonical reference:** CSS Images 4’s color-wheel and conic-gradient examples.

**Evidence:** [W3C — CSS Images Level 4, Conic Gradients](https://www.w3.org/TR/css-images-4/#conic-gradients) (checked 2026-10-07).

<a id="mesh-gradient"></a>
## Gradient fill — mesh

**Kind:** paint primitive.

A network of mesh points and patches distributes color in multiple directions. A mesh is not just another stop list on one axis; similar-looking freeform gradients should identify their actual construction.

**Canonical reference:** Adobe Illustrator’s multicolored ellipse and its editable mesh diagram.

**Evidence:** [Adobe Illustrator — Mesh objects overview](https://helpx.adobe.com/illustrator/desktop/paint-and-fill/create-and-edit-meshes/mesh-objects-overview.html) (checked 2026-10-07).

<a id="gradient-stroke"></a>
## Gradient stroke

**Kind:** edge paint primitive.

A gradient paints an outline instead of the interior. It can imply a lit edge, but that interpretation is optional.

**Canonical reference:** Photoshop’s documented Stroke effect with Gradient as its fill type.

**Evidence:** [Adobe Photoshop — Layer style effects and options overview](https://helpx.adobe.com/ca/photoshop/desktop/create-manage-layers/apply-layer-effects/layer-style-effects-and-options-overview.html) (checked 2026-10-07).

<a id="inner-shadow"></a>
## Inner shadow

**Kind:** shading primitive.

An inset shadow is clipped within the subject; a dark edge commonly suggests a cavity. The geometry and interpretation are separate.

**Canonical reference:** CSS Backgrounds’ inset box-shadow examples.

**Evidence:** [W3C — CSS Backgrounds and Borders Level 3, box-shadow](https://www.w3.org/TR/css-backgrounds-3/#box-shadow) (checked 2026-10-07).

<a id="inner-glow"></a>
## Inner glow

**Kind:** shading/emission primitive.

Glow is drawn inside the subject boundary. Its name describes location, not proof that the object emits light.

**Canonical reference:** Photoshop’s Inner Glow layer effect.

**Evidence:** [Adobe Photoshop — Layer style effects and options overview](https://helpx.adobe.com/ca/photoshop/desktop/create-manage-layers/apply-layer-effects/layer-style-effects-and-options-overview.html) (checked 2026-10-07).

<a id="outer-glow"></a>
## Outer glow

**Kind:** emission/halo primitive.

A softened luminous halo extends outside the subject. This can decorate a mark without establishing cast-shadow depth.

**Canonical reference:** The outer-glow stage of Adobe’s neon triangle tutorial.

**Evidence:** [Adobe — How to create a neon effect in Photoshop](https://www.adobe.com/creativecloud/photography/discover/neon-effect.html) (checked 2026-10-07).

<a id="drop-shadow"></a>
## Drop shadow

**Kind:** shading primitive.

An external shadow projects the subject’s silhouette. Offset, spread and softness shape it; a zero-blur expanded silhouette can instead serve as a ring.

**Canonical reference:** CSS Backgrounds’ outer box-shadow diagrams.

**Evidence:** [W3C — CSS Backgrounds and Borders Level 3, box-shadow](https://www.w3.org/TR/css-backgrounds-3/#box-shadow) (checked 2026-10-07).

<a id="bevel-emboss"></a>
## Bevel / emboss

**Kind:** relief primitive.

Highlights and shadows model an edge or relief. Bevel describes the edge profile; emboss gives a raised impression, with inverted/debossed treatments suggesting a recess.

**Canonical reference:** Photoshop’s Bevel & Emboss effect and its style/light controls.

**Evidence:** [Adobe Photoshop — Layer style effects and options overview](https://helpx.adobe.com/ca/photoshop/desktop/create-manage-layers/apply-layer-effects/layer-style-effects-and-options-overview.html) (checked 2026-10-07).

<a id="letterpress"></a>
## Letterpress

**Kind:** text/glyph relief recipe.

A screen simulation of an impression pressed into a surface. Dark interior shading with a displaced lighter edge can make text read as debossed; ordinary offset text shadow alone is not sufficient evidence of that intent.

**Canonical reference:** José Olarte’s Fireworks-to-CSS worked text demonstrations. This is simulated impression, not a claim about every physical letterpress printing process.

**Evidence:** [José Olarte — Simulating the Letterpress: From Live Filters in Fireworks to CSS Code](https://www.smashingmagazine.com/2012/07/letterpress-effect-fireworks-css/) (checked 2026-10-07).

<a id="grain"></a>
## Grain

**Kind:** microtexture primitive.

Fine spatial variation applied as texture. Photoshop’s Grain exposes amount, size and roughness; procedural noise is another construction, not evidence that all grain shares one distribution.

**Canonical reference:** Photoshop’s Grain adjustment workflow; W3C feTurbulence illustrations show a procedural alternative.

**Evidence:** [Adobe Photoshop — Enhance texture with Grain](https://helpx.adobe.com/photoshop/desktop/create-manage-layers/color-adjustment-fill-layers/enhance-texture-with-grain.html), [W3C — Filter Effects Level 1, feTurbulence](https://www.w3.org/TR/filter-effects-1/#feTurbulenceElement) (checked 2026-10-07).
