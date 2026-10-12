# CSS cookbook: the task 01 layer model

**Research only; checked 2026-10-08.** Technique IDs below map to the twelve matrix fields and the additional backdrop/adaptation fields in the [task 01 layer model](../01-taxonomy/layer-model.md). All snippet lengths, stops, alphas, seeds and colours are **authored teaching values**, not captured product measurements, native implementation constants or proposed Area defaults. Code executes in [lab.css](lab.css), [lab.js](lab.js), [grain.svg](grain.svg) and the three HTML pages. Browser numbers come from [compatibility.md](compatibility.md); its C identifiers provide dated MDN and Can I use links for each technique.

## Coverage contract

| Task 01 channel | CSS mechanism / technique | How an Area consumer would read it |
| --- | --- | --- |
| Fill / `body.paints[]` | T01 ordered backgrounds: solid, linear, radial, conic, multi-radial approximation | Read `--area-bg-surface` or the part's existing body role; decorative stops derive locally from semantic inputs |
| Translucency / `body.transmission` | T08 body alpha; T11 alpha derivation | Mix the body with transparent; never reduce the entire control's opacity to simulate transmission |
| Blur / target-specific `filters[]` | T08 backdrop-filter; T02 shadow blur; T03 emission falloff; T09 image filter | Private target-specific scalar inputs; no single global blur applied to content |
| Stroke model / `edges[]` | T07 solid, clipped double background, masked ring, top-only and double rim | Surface remains owner of `--area-border-width`; required edges use existing edge roles independently |
| Highlight / `reflection[]` | T04 pseudo-element gradient; T07 rim | Read body/edge context, derive reflected paint; do not recolour semantic ink |
| Inner shadow / `shading.inset[]` | T02 inset shadow list and bevel | Private relief paint from local body/shadow context; separate from cast elevation |
| Drop shadow / `shading.cast[]` | T02 outer shadow list; optional alpha-silhouette filter | Consume the appropriate `--area-shadow-card` / `--area-shadow-float` on a separate receiver wrapper |
| Glow / `emission[]` | T03 inset/outset shadow or glyph-local text shadow | Read the component's existing tone/action/selection colour; derive halo alpha separately |
| Grain / `texture[]` | T05 deterministic SVG/image layer | Private texture intensity/scale/seed; opacity on the decorative layer only |
| Text / `content.ink`, decoration | T06 semantic foreground plus text-shadow | Keep `--area-fg-default`, existing tone ink, or input text role; decoration never replaces readable ink |
| Depth / relationship and relief | T02 plus T12 role recipe; not z-index | Existing Surface cast policy plus separately described intrinsic profile |
| Light direction / `illumination` | T12 coordinated shadow vectors and T04 highlight positions | New private/proposed optical inputs beside Surface, not a second elevation namespace |
| Backdrop source / mapping | T08 acquisition; T09 displacement | Explicitly identify local owned art versus arbitrary page/window/wallpaper source |
| Adaptation / fallbacks | T10 shape fallback; T11 guarded colour syntax; opaque/solid/no-effect recipes | Theme, density, semantic state and contrast remain independent inputs |

Area names and architectural rules in this table are pinned in [area-integration.md](area-integration.md). The mapping itself is **Astra's proposed implementation decomposition**.

## T01 — body paints: solid, linear, radial, conic and mesh-like

CSS backgrounds form an ordered paint stack; the first image is nearest the viewer. Use a plain semantic background beneath optional gradients. Linear paint models a ramp, radial paint a localized lobe, and conic paint an angular sweep. MDN lists linear, radial and conic gradient families; no native mesh primitive was found there. The lab stacks radial paints and explicitly calls that a mesh-like approximation, not an editable mesh. [MDN multiple backgrounds](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Backgrounds_and_borders/Using_multiple_backgrounds), [gradient types](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient), checked 2026-10-08.

```css
.body { background: var(--area-bg-surface, white); }
.linear { background-image: linear-gradient(135deg, var(--_a), var(--_b)); }
.radial { background-image: radial-gradient(ellipse at 25% 20%, var(--_a), var(--_b)); }
.conic { background-image: conic-gradient(from 30deg, var(--_a), var(--_b), var(--_a)); }
.mesh-like { background-image:
  radial-gradient(ellipse at 10% 10%, var(--_a), transparent 65%),
  radial-gradient(ellipse at 90% 20%, var(--_b), transparent 65%); }
```

**Support:** C12–C14; optional `in oklch` / interpolation-space syntax adds C20. **Pitfalls / fallback:** repeat the first stop at the conic seam; check the whole ink-bearing region, not one endpoint. Transparency exposes lower paints. A stop named “highlight” does not establish a lighting rig. Author a solid readable fallback and add each optional syntax in a feature query. In Area, keep semantic tone distinct from decorative chroma; a colourful page background does not authorize changing a danger indicator's meaning. The lab's fixed pastel fills demonstrate mechanism only and intentionally do not act as dark-mode presets.

## T02 — cast shadow, inner shadow, bevel and depth

A comma-separated `box-shadow` list supports separate contact and ambient lobes; earlier entries paint above later ones. `inset` places modeling inside the padding edge, behind content. Radius affects the shadow silhouette. Shadow paint does not reserve layout space. These properties explain both soft raised relief and recessed wells without requiring an image. [MDN box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow), checked 2026-10-08.

```css
.cast { box-shadow: 0 2px 3px var(--_shade), 0 14px 24px -12px var(--_shade); }
.recess { box-shadow: inset 3px 4px 9px var(--_shade), inset -1px -1px 1px var(--_light); }
.bevel { box-shadow: inset 2px 2px 1px var(--_light), inset -2px -2px 2px var(--_shade); }
```

**Support:** C01. An optional `filter:drop-shadow(...)` follows rendered alpha, useful for a nonrectangular decorative glyph; it is not a box-shadow replacement and offers neither inset nor spread. C08; [MDN drop-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/filter-function/drop-shadow), checked 2026-10-08.

**Pitfalls / fallback:** ancestor clipping can cut external paint; leave space between specimens. A soft white outer lobe on black reads as emitted light instead of restrained elevation; task 09 must tune it. Do not combine `var(--area-shadow-card)` blindly with an inset list: Flat can resolve to `none`, and `none, inset ...` is invalid. The lab demonstrates a cast wrapper and inset child. `z-index` governs overlap, not perceived physical depth. For Area, use Surface's chosen cast shadow unchanged; adding another outer “relief” shadow would bypass Flat and needs an explicit design decision. Drop the relief for incompatible pairings rather than inventing a second ladder.

## T03 — inner and outer glow

Use zero-offset inset shadows for an interior emissive rim; zero-offset outset shadows for an external halo; separate tight and broad lobes for falloff. `text-shadow` confines a halo to glyphs. These are authored recipes from the primitives in T02/T06, not new CSS glow properties.

```css
.inner { box-shadow: inset 0 0 22px 3px var(--_halo); }
.outer { box-shadow: 0 0 12px 1px var(--_halo), 0 0 28px 7px var(--_halo); }
```

**Support:** C01; text emission adds C02. **Pitfalls / fallback:** glowing paint cannot replace an identification border, focus outline or readable foreground; clipping removes its exterior lobe. Keep the halo on its intended indicator/receiver, not every ancestor. Reduce or remove it in forced colours and opaque simplification. Read the existing Area tone or emphasis colour and derive halo alpha with T11; do not apply a new accent indiscriminately. Emission radiates from the mark and is independent of the key-light angle. See [task 01 illumination distinction](../01-taxonomy/layer-model.md#corrections-to-the-seed-vocabulary).

## T04 — specular bands, hotspots and rim highlights

Put reflection in a decorative `::before`/`::after` layer with empty content, inherited radius and `pointer-events:none`. Paint a linear band or radial hotspot; keep content on its own layer above it. Pseudo-elements need a suitable host; generated content is unsuitable for essential labels, and replaced controls may require a wrapper. [MDN ::before](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::before), checked 2026-10-08.

```css
.gloss { position: relative; }
.gloss::before { content: ""; position: absolute; inset: 1px;
  border-radius: inherit; pointer-events: none;
  background: linear-gradient(var(--_angle), var(--_reflection), transparent 48%); }
.gloss > .content { position: relative; z-index: 1; }
```

**Support:** C11+C12/C13; no blur primitive is required for a soft gradient. **Pitfalls / fallback:** one element only has these two pseudo-elements; grain, rim and gloss may need explicit decorative children rather than conflicting claims on the same pseudo. Remove only the decorative plane when unsupported or simplified. Do not place a filter over all content, clip the focus outline, or let a bright band erase contrast. In Area, reflect local body/environment inputs without changing foreground on hover. The example angle controls reflection paint; it does not automatically rotate the fixed shadow vectors in other specimens.

## T05 — grain from feTurbulence or an image

Generate deterministic noise with `feTurbulence`, set a seed, choose fractal noise versus turbulence, optionally desaturate it, and composite at low opacity on an independent plane. The shipped [grain.svg](grain.svg) is a same-origin reusable image whose filter generates its pixels. Its stitched tile avoids an arbitrary per-frame random source. Frequency, octave count and seed are explicit authored inputs. [MDN feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence), checked 2026-10-08.

```css
.grain::before { content: ""; position: absolute; inset: 1px;
  border-radius: inherit; pointer-events: none;
  background: url("grain.svg") repeat; background-size: 96px 96px; opacity: .18; }
```

**Support:** C10 for the SVG noise; optional `mix-blend-mode` adds C18. A licensed pre-rendered raster noise tile can replace SVG when deterministic raster cost is preferred; record its actual pixel scale, provenance and repeating pattern. No raster is downloaded here. **Pitfalls / fallback:** noise is not free contrast and must not obscure small text. External SVG images do not inherit the embedding document's CSS variables into their internals; keep token-controlled strength/scale on the wrapper, or deliberately parameterize an owned inline SVG. Avoid animated seeds and excessive octaves until task 11 measures cost. Use no texture as fallback. Area would read semantic body paint underneath and retain private grain intensity, size and blend inputs.

## T06 — letterpress, emboss and glowing ink

Pair a small light glyph offset with a dark offset to suggest a pressed edge; reverse the treatment to suggest relief. Keep the actual text colour readable. `text-shadow` accepts offsets and blur, but not a spread length or `inset`. It is a paint cue, not a carved-out glyph mask. [MDN text-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-shadow), checked 2026-10-08.

```css
.engraved { color: var(--area-fg-default, #202530);
  text-shadow: 0 1px 0 var(--_light), 0 -1px 0 var(--_shade); }
.luminous { color: var(--area-fg-default, #202530);
  text-shadow: 0 0 7px var(--_halo), 0 0 18px var(--_halo); }
```

**Support:** C02, explicitly requiring Safari 4 for the multi-shadow recipe. **Pitfalls / fallback:** high-contrast offsets can look like doubled text at small sizes; visual readability needs actual size/platform checks. Decorative shadow is not contrast evidence for the underlying ink. Preserve native text selection and accessible names. Remove decoration in forced colours. Area's existing text or input-ink role remains authoritative; the bright highlights in the lab are demonstrations, not approval of this treatment on small UI labels.

## T07 — gradient strokes around rounded corners

**Opaque body: double background.** Reserve border width once; put a solid-colour gradient in the padding box and the edge gradient in the border box. The top paint covers the lower gradient's centre. With a translucent top paint, the lower gradient shows through the middle, so this is not a transparent ring. [MDN background-clip](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/background-clip), checked 2026-10-08.

```css
.opaque-ring { border: 3px solid transparent; border-radius: var(--_radius);
  background: linear-gradient(var(--_body),var(--_body)) padding-box,
    linear-gradient(135deg,var(--_rim-a),var(--_rim-b)) border-box; }
```

**Translucent body: masked decorative ring.** Keep the body separate. A pseudo-element paints the edge gradient and subtracts the content-box mask from the outer mask using `exclude`. The masks affect only decoration; the content and required focus ring remain outside that operation. Standard `mask-composite` and prefixed `-webkit-mask-composite` have different keyword vocabularies; do not blindly substitute them. [MDN mask-composite](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-composite), checked 2026-10-08.

```css
.transparent-ring { position: relative; border: 3px solid var(--_edge);
  border-radius: var(--_radius); background: var(--_transmitted-body); }
@supports (mask-composite: exclude) {
  .transparent-ring { border-color: transparent; }
  .transparent-ring::after { content: ""; position: absolute; inset: -3px;
    padding: 3px; border-radius: inherit; pointer-events: none;
    background: linear-gradient(135deg,var(--_rim-a),var(--_rim-b));
    mask: linear-gradient(#000,#000) content-box,linear-gradient(#000,#000);
    mask-composite: exclude; }
}
```

**Border image limit.** `border-image` does not get rounded by `border-radius`; a gradient border image remains square at the image corners. The third specimen intentionally shows this failure. Use it for suitable straight/explicitly drawn border-image geometry, not as a rounded-ring shortcut. [MDN border-image, rounded borders](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-image#rounded_borders), checked 2026-10-08.

**Support:** C03/C05/C12 for double backgrounds; C06/C12 for the mask ring; C04/C12 for gradient border-image. **Pitfalls / fallback:** a top-only highlight can use a thin inset light shadow; a double rim uses two separately described light/dark edges. These visual cues do not establish control identification. In Area, the authored 3px demo border must be replaced by the component's documented geometry/Surface width; count its border once in the inset equation. Retain a real solid border when masking is unavailable, and a separate required focus/state edge in every case.

## T08 — translucency, backdrop blur and opaque fallback

A body with alpha participates in backdrop compositing while its text can remain opaque. `opacity` on the parent instead fades the whole group. `backdrop-filter` samples behind the element, whereas `filter:blur()` blurs the element's rendered content. Translucency must expose the sampled pixels for the effect to show. Ancestor opacity, filtering, masking and other backdrop-root triggers can limit what is sampled. [MDN backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter), [opacity](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/opacity), checked 2026-10-08.

```css
.frost { background: var(--_body); }
@supports ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))) {
  .frost { background: var(--_transmitted-body);
    -webkit-backdrop-filter: blur(var(--_backdrop-blur)) saturate(1.2);
    backdrop-filter: blur(var(--_backdrop-blur)) saturate(1.2); }
}
```

> **Correction / superseded D8 (2026-10-11):** Chromium supports SVG reference filters in `backdrop-filter`; Safari and Firefox do not provide the displacement path used here. The earlier lack of a local run remains a historical verification gap, not a browser-support verdict. Frost plus rim is the baseline. See [corrected support evidence](refraction-correction.md).

**Support:** C07; colour derivation adds C15. **Pitfalls / fallback:** author an opaque background first; render support cannot be established by a parser check. Keep blur scoped to the intended surface and avoid promising a frame budget without measurement. The lab's Simplify effects switch selects an opaque body and removes backdrop filtering. Contrast still needs checks over adverse backdrops, especially at the lowest alpha. Area body roles feed the tint; existing semantic ink/focus stay fixed. CSS cannot obtain native behind-window or OS wallpaper material inputs through this property; the source must be identified, and platform-equivalent Mica/Acrylic/Liquid Glass behavior is not established by a frosted webpage.

## T09 — refraction approximation with SVG displacement

<!-- task19-superseded 03-css-cookbook/cookbook.md ## T09 -->
> **Superseded policy — D8 (owner, 2026-10-11):** Frost plus rim is baseline; native SVG backdrop refraction is a later Chromium-only enhancement. A historical unverified run is not a support verdict. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

An SVG filter can use one image as a displacement map for another: select channels from the map and set a scale. The demo generates the map with turbulence and distorts only its owned grid/circle/rectangle artwork. A shaped map could model a lens-like edge; random turbulence is merely an obvious demonstration of image-space mapping. It is not a physically accurate glass surface. [MDN feDisplacementMap](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDisplacementMap), checked 2026-10-08.

```xml
<filter id="lens" x="-15%" y="-20%" width="130%" height="140%"
        color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency=".022 .035"
                numOctaves="2" seed="4" result="map"/>
  <feDisplacementMap in="SourceGraphic" in2="map" scale="22"
                     xChannelSelector="R" yChannelSelector="G"/>
</filter>
<g filter="url(#lens)"><!-- owned artwork only --></g>
```

> **Correction / superseded D8 (2026-10-11):** Chromium supports SVG reference filters in `backdrop-filter`; Safari and Firefox do not provide the displacement path used here. The earlier lack of a local run remains a historical verification gap, not a browser-support verdict. Frost plus rim is the baseline. See [corrected support evidence](refraction-correction.md).

**Support:** C09+C10 for these SVG elements. Do **not** infer portable `backdrop-filter:url(#lens)` support from them: acquisition of arbitrary HTML backdrop plus URL filtering is a different pipeline, unverified in Chrome, Safari and Firefox here. The owned-art demo uses an SVG presentation attribute; the distinct CSS `filter`-on-SVG BCD subfeature has different support. **Pitfalls / fallback:** enlarge the filter region to prevent clipping; record map colour space/channel meanings and scaling. Repeating an owned background under a clipped lens must stay aligned during scrolling, resize and transforms; duplicating arbitrary live DOM is not a general solution. Avoid filtering readable labels. Preserve the undisplaced artwork when simplified. Area tokens can tint the surrounding shell; displacement amount/map geometry would be new private optical inputs, not existing radius or Surface shadows repurposed.

## T10 — squircle corners with corner-shape

<!-- task19-superseded 03-css-cookbook/cookbook.md ## T10 -->
> **Superseded policy — D11 (owner, 2026-10-11):** Inner rims keep the radius floor at every setting except Sharp. Historical max(0, outer-inset) examples and tabulated square inner rims are retained but superseded. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

Apply `corner-shape:squircle` with a nonzero `border-radius`; otherwise there is no corner area to reshape. The native property describes a shared shape for backgrounds, borders, outlines and shadows. It is preferable to independently approximating each with a different SVG clip, once the target browser supports it. [MDN corner-shape](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape), checked 2026-10-08.

```css
.shape { border-radius: var(--_radius); }
@supports (corner-shape:squircle) { .shape { corner-shape:squircle; } }
```

**Support:** C17: Chrome 139; Safari and Firefox preview-only in the pinned data. C05 supplies the rounded fallback. **Pitfalls / fallback:** “squircle” does not prove equivalence to Apple's particular continuous-corner geometry. Inherited radius is not automatically inherited corner-shape on a pseudo-element; apply the same geometry deliberately when combining shape and layered decoration. The lab's squircle specimen is separate from its masked-ring specimen to avoid pretending this combined clip has been cross-engine tested. Area's actual corner policy, including size-derived role radius, stays authoritative; this research does not add or replace the corner setting.

## T11 — colour derivation without @property

Use `color-mix()` for interpolation and alpha scaling; relative colour syntax for channel edits such as a small lightness shift or replacement alpha. Mixing with transparent scales source alpha, while `/ .7` replaces it. Neither operation is contrast validation. A local `@supports` guard must test an actual colour declaration; an untyped custom property can otherwise accept unsupported token text, then invalidate the consuming declaration at computed-value time. A `var()` fallback does not catch every invalid colour expression. [MDN color-mix](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color-mix), [relative colours](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Colors/Using_relative_colors), [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties), [@supports](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@supports), checked 2026-10-08.

```css
/* Re-emit at EACH consuming scope; all names here are private and unregistered. */
.scope, .part { --_body:var(--area-bg-surface,white); --_tint:var(--_body); }
@supports (color:color-mix(in srgb,red,transparent)) {
  .scope, .part { --_tint:color-mix(in srgb,var(--_body) 70%,transparent); }
}
@supports (color:rgb(from red r g b / .7)) {
  .scope, .part { --_alpha-replaced:rgb(from var(--_body) r g b / .7); }
}
@supports (color:oklch(from red calc(l + .04) c h)) {
  .scope, .part { --_lighter:oklch(from var(--_body) calc(l + .04) c h); }
}
```

**Support:** C15/C16; paired Area colour inputs also use C19. **Pitfalls / fallback:** a derived custom property computed on the parent can inherit its resolved value; overriding the input only on a child does not retroactively recompute the parent's declaration. Re-declare derivations at each boundary or directly on the part, as in [scopes.html](scopes.html). Do not register derived or paired colours with `@property`; Area's reason and actual emission sites are pinned in [area-integration.md](area-integration.md). Preserve static semantic fallback paints, gamut/contrast checks and actual mode ownership. Do not recolour `color` on hover to compensate for a material's poor state paint.

## T12 — coordinate lighting and preserve interaction edges

A CSS shadow offset, gradient angle and radial centre are independent inputs. **Proposed recipe rule:** expose a key-light direction, then author corresponding highlight and opposite cast vectors; keep ambient lobes, environmental reflections and emission separate. If deriving x/y from an angle, compute them in a build/runtime recipe step or explicitly research CSS trigonometric support; the lab deliberately uses fixed offsets and does not imply trig support. Relief is an input to a role recipe, not a substitute for DOM stacking. This follows [task 01's illumination and depth corrections](../01-taxonomy/layer-model.md#corrections-to-the-seed-vocabulary).

**Support:** composed from C01/C12/C13; no independent CSS material-lighting engine is claimed. **Pitfalls / fallback:** do not force all glow to follow a directional light, invert every shadow automatically for dark mode, or replace the focus outline with a decorative rim. Disable decorative layers in forced colours and retain native/system-colour edges; then test keyboard focus, zoom and contrast. The supplied CSS has these fallback rules, but assistive technology and forced-colour rendering remain unverified. In Area, preserve the semantic state and focus contract pinned in [area-integration.md](area-integration.md), and keep density independent from the material recipe.

## Crosswalk back to all 25 task 01 entries

This is a **mechanism crosswalk**, not a claim that the combined snippets reproduce any native material or historical visual language. Source definitions and canonical examples remain in the [task 01 catalogue](../01-taxonomy/catalogue.md). Each T entry above carries the support IDs, token approach and fallback/pitfall notes.

| Entry from 01 | Construction path | Important boundary |
| --- | --- | --- |
| Flat | T01 solid + T07 required edge | Absence of modeled depth is a recipe choice |
| Material / paper | T01 opaque + T02 cast, optionally T05 | Not the complete Material Design behavior system |
| Transparency | T08 body alpha | No blur or refraction implied |
| Glassmorphism | T08 frost + T04/T07 rim | Web compositing, not native glass parity |
| Acrylic (Fluent) | T08 backdrop + T01 tint + T05 noise | Native source/adaptation rules remain separate |
| Mica | T01 tinted opaque body / owned image approximation | OS wallpaper sampling not supplied by ordinary CSS |
| Liquid Glass (Apple, 2025) | T08 + T09 owned-source mapping + T04/T07 | Dynamic native lensing/adaptation not reproduced |
| Neumorphism | T02 opposing relief + same-ground body | Flat policy and identification contrast may conflict |
| Claymorphism | T02 broad inset modeling + cast + T10 geometry | Geometry and tone need component-specific decisions |
| Skeuomorphism | T01/T02/T04/T05/T06 as the referent requires | CSS paint cannot supply the whole real-object metaphor |
| Aqua | T01 glossy ramp + T04 band + T02/T07 | Typography, geometry and interaction are also part of the language |
| Frutiger Aero | T01 gradients/owned imagery + T04 + T08 | An art direction, not one filter |
| Glow / neon | T03 emission + T06 ink | Preserve readable core and required edges |
| Linear gradient fill | T01/C12 | Stops and interpolation are separate inputs |
| Radial gradient fill | T01/C13 | Position and size belong to the paint |
| Conic gradient fill | T01/C14 | Seam and angular stop ordering |
| Mesh gradient fill | T01 multi-radial approximation | No native mesh implementation asserted |
| Gradient stroke | T07 | Opaque double background versus transparent mask |
| Inner shadow | T02 | Inset intent distinct from cast lift |
| Inner glow | T03 inset | Emission distinct from reflected edge |
| Outer glow | T03 outset | Clipping and nearby receivers |
| Drop shadow | T02 | Surface owns cast elevation |
| Bevel / emboss | T02 + T04/T07 | Opposed edge modeling, not automatic depth |
| Letterpress | T06 | Readable base ink stays intact |
| Grain | T05 | Seed, strength, scale and blend recorded independently |
