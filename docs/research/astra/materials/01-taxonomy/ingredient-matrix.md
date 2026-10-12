# Ingredient matrix

All 25 entries use the same 12 fields. The matrix is split into three views of the same rows for readability; it is one dataset, not three separate taxonomies.

Author synthesis of cited examples, not measured values or universal requirements. — means not intrinsic, not prohibited. Optional means composable, not vendor-required. Not specified/found is a bounded evidence gap.

Blur identifies **what is softened**: backdrop, shadow, bloom or texture. Smooth gradient interpolation is not a blur operation. Translucency applies to the body unless the cell specifies an effect. Stroke model describes decorative edges; required interaction edges are independent.

Each row links to its definition and evidence. Public sources checked **2026-10-07**. No cell is a measured size, opacity, shader constant or rendering guarantee.

## Body and boundary

| Style | Fill | Translucency | Blur | Stroke Model |
| --- | --- | --- | --- | --- |
| [Flat](catalogue.md#flat) | Uniform color | Optional | — | Optional outline |
| [Material / paper](catalogue.md#paper) | Opaque sheet | None in this model | Shadow only | Optional edge |
| [Transparency](catalogue.md#transparency) | Any alpha paint | Defining | — | Independent |
| [Glassmorphism](catalogue.md#glassmorphism) | Tint or low-alpha gradient | Defining | Backdrop | Optional translucent/gradient rim |
| [Acrylic (Fluent)](catalogue.md#acrylic) | Luminosity blend + tint | Defining; opaque fallback | Backdrop | Control-dependent |
| [Mica](catalogue.md#mica) | Opaque wallpaper-informed tint | None | No live backdrop blur | Separate component edge |
| [Liquid Glass (Apple, 2025)](catalogue.md#liquid-glass) | Adaptive tint | Regular / Clear | Scattering; adaptive | Optical silhouette; not plain stroke |
| [Neumorphism](catalogue.md#neumorphism) | Matches surrounding body | Usually opaque | Shading softness | Shading-defined edge |
| [Claymorphism](catalogue.md#claymorphism) | Independent colored body | Usually opaque | Soft shading | Soft modeled edge |
| [Skeuomorphism](catalogue.md#skeuomorphism) | Object-dependent | Object-dependent | Object-dependent | Object-dependent |
| [Aqua](catalogue.md#aqua) | Luminous body | Some controls/windows | Not specified | Not specified |
| [Frutiger Aero](catalogue.md#frutiger-aero) | Gloss + imagery | Often glass motifs | Optional atmospheric softness | Varies |
| [Glow / neon](catalogue.md#glow-neon) | Bright core mark | Not required | Bloom | Luminous path/core |
| [Gradient fill — linear](catalogue.md#linear-gradient) | Linear stop field | Per-stop alpha optional | — | Independent |
| [Gradient fill — radial](catalogue.md#radial-gradient) | Radial stop field | Per-stop alpha optional | — | Independent |
| [Gradient fill — conic](catalogue.md#conic-gradient) | Angular stop field | Per-stop alpha optional | — | Independent |
| [Gradient fill — mesh](catalogue.md#mesh-gradient) | Control-point/patch field | Implementation-dependent | Smooth interpolation, not blur | Independent |
| [Gradient stroke](catalogue.md#gradient-stroke) | Independent | Stroke alpha optional | — | Gradient outline |
| [Inner shadow](catalogue.md#inner-shadow) | Independent | Effect alpha | Effect softness | Independent |
| [Inner glow](catalogue.md#inner-glow) | Independent | Effect alpha | Effect softness | Independent |
| [Outer glow](catalogue.md#outer-glow) | Independent core | Effect alpha | Effect softness | Independent |
| [Drop shadow](catalogue.md#drop-shadow) | Independent | Effect alpha | Effect softness | Ring possible |
| [Bevel / emboss](catalogue.md#bevel-emboss) | Independent | Independent | Shading softness | Modeled rim |
| [Letterpress](catalogue.md#letterpress) | Surface plus ink | Independent | Fine text shading | Glyph contour |
| [Grain](catalogue.md#grain) | Texture overlay or modulation | Texture alpha optional | Not required | Independent |

## Light and shading

| Style | Highlight | Inner Shadow | Drop Shadow | Glow |
| --- | --- | --- | --- | --- |
| [Flat](catalogue.md#flat) | — (strict flat) | — | — (strict flat) | — |
| [Material / paper](catalogue.md#paper) | — | — | Layer separation | — |
| [Transparency](catalogue.md#transparency) | — | — | — | — |
| [Glassmorphism](catalogue.md#glassmorphism) | Optional rim | Optional | Optional | Optional |
| [Acrylic (Fluent)](catalogue.md#acrylic) | — | — | Control-dependent | — |
| [Mica](catalogue.md#mica) | — | — | Window-dependent | — |
| [Liquid Glass (Apple, 2025)](catalogue.md#liquid-glass) | Environment-responsive | Not separately specified | Adaptive | Interaction illumination |
| [Neumorphism](catalogue.md#neumorphism) | Light counterpart | Recessed variant | Dark/light relief pair | — |
| [Claymorphism](catalogue.md#claymorphism) | Inner light lobe | Inner dark lobe | Soft external | — |
| [Skeuomorphism](catalogue.md#skeuomorphism) | Object-dependent | Object-dependent | Object-dependent | Object-dependent |
| [Aqua](catalogue.md#aqua) | Luminous finish; inferred gloss | Not specified | Not specified | Luminous appearance; not proven bloom |
| [Frutiger Aero](catalogue.md#frutiger-aero) | Reflective gloss | Optional modeling | Optional modeling | Optional aurora/light |
| [Glow / neon](catalogue.md#glow-neon) | Core brightness; not reflection | — | Optional scene grounding | Defining |
| [Gradient fill — linear](catalogue.md#linear-gradient) | Only if used as shading | — | — | — |
| [Gradient fill — radial](catalogue.md#radial-gradient) | Possible use | — | — | Possible use |
| [Gradient fill — conic](catalogue.md#conic-gradient) | Possible use | — | — | — |
| [Gradient fill — mesh](catalogue.md#mesh-gradient) | Possible modeled use | — | — | — |
| [Gradient stroke](catalogue.md#gradient-stroke) | Optional inference | — | — | — |
| [Inner shadow](catalogue.md#inner-shadow) | Independent | Defining | — | — |
| [Inner glow](catalogue.md#inner-glow) | Possible use | — | — | Inside |
| [Outer glow](catalogue.md#outer-glow) | — | — | — | Outside |
| [Drop shadow](catalogue.md#drop-shadow) | — | — | Defining | — |
| [Bevel / emboss](catalogue.md#bevel-emboss) | Light-facing edge | Dark counterpart possible | Independent | — |
| [Letterpress](catalogue.md#letterpress) | Lower lit edge in demo | Impression shading | Not required | — |
| [Grain](catalogue.md#grain) | Independent | — | — | — |

## Texture, content and spatial model

| Style | Grain | Text Treatment | Depth | Light Direction |
| --- | --- | --- | --- | --- |
| [Flat](catalogue.md#flat) | — | Plain | Planar | None |
| [Material / paper](catalogue.md#paper) | Optional literal-paper texture | Printed/plain | Stacked planes | Coherent cast light; angle unspecified |
| [Transparency](catalogue.md#transparency) | — | Independent; avoid assuming group alpha | No depth implied | None |
| [Glassmorphism](catalogue.md#glassmorphism) | Optional | Legible overlay | Separate pane (inference) | No canonical direction |
| [Acrylic (Fluent)](catalogue.md#acrylic) | Recipe layer | Foreground overlay | Transient/overlapping surface | Not specified |
| [Mica](catalogue.md#mica) | Not found as required layer | Foreground overlay | Window foundation | Not specified |
| [Liquid Glass (Apple, 2025)](catalogue.md#liquid-glass) | Not specified | Adaptive ink | Floating navigation | Environment/device/interaction |
| [Neumorphism](catalogue.md#neumorphism) | Optional | Typically plain overlay | Low extrusion or recess | Opposed light/dark pair |
| [Claymorphism](catalogue.md#claymorphism) | — | Plain overlay | Bulging volume | Top-left in worked example |
| [Skeuomorphism](catalogue.md#skeuomorphism) | Object-dependent | Metaphor-dependent | Object-dependent | Scene-dependent |
| [Aqua](catalogue.md#aqua) | — | System labels; decoration unspecified | Layered windows/control volume (inference) | Not specified |
| [Frutiger Aero](catalogue.md#frutiger-aero) | Not defining | Humanist type vocabulary | Mixed illustrative depth | Scene-dependent |
| [Glow / neon](catalogue.md#glow-neon) | — | May glow selectively | Emission; depth independent | From emitting geometry |
| [Gradient fill — linear](catalogue.md#linear-gradient) | — | Independent | None intrinsic | Gradient axis; not necessarily light |
| [Gradient fill — radial](catalogue.md#radial-gradient) | — | Independent | None intrinsic | Center/radii; not necessarily light |
| [Gradient fill — conic](catalogue.md#conic-gradient) | — | Independent | None intrinsic | Angular origin; not necessarily light |
| [Gradient fill — mesh](catalogue.md#mesh-gradient) | — | Independent | None intrinsic | Multiple local color regions |
| [Gradient stroke](catalogue.md#gradient-stroke) | — | Independent | None intrinsic | Paint-defined |
| [Inner shadow](catalogue.md#inner-shadow) | — | Independent | Often recessed | Offset-dependent |
| [Inner glow](catalogue.md#inner-glow) | — | Independent | None intrinsic | Boundary/center |
| [Outer glow](catalogue.md#outer-glow) | — | Optional glowing glyph | None intrinsic | Around emitter |
| [Drop shadow](catalogue.md#drop-shadow) | — | Independent | Cast lift or edge | Offset-dependent |
| [Bevel / emboss](catalogue.md#bevel-emboss) | — | Can shape glyph relief | Raised or recessed | Shared light angle/altitude |
| [Letterpress](catalogue.md#letterpress) | Optional paper texture | Debossed glyph | Recessed inscription | Consistent opposed edges |
| [Grain](catalogue.md#grain) | Defining | Usually separate from glyphs (proposal) | No geometric depth implied | None unless lighting modulates it |
