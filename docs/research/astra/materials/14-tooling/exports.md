# Export contracts and missing information

**Recommendation:** retain Area JSON as the editable source. Export typed values and compiled rendering separately, always accompanied by a machine-readable loss manifest. None of the targets supplies Area's role, nesting, Surface-eligibility and accessibility policy by itself. This is an architectural inference from the following evidence, not a claim that those tools cannot draw attractive materials.

All public sources below were checked **2026-10-10**, listed in [evidence.md](evidence.md). “Exact” below means a field can be represented, not a promise of pixel-identical rasterization. “Snapshot” means a value was evaluated for a named context, losing the live derivation. “Sidecar” means Area retains information separately that the target does not interpret. “Approximate” requires an explicit transformation and review. Never call a sidecar a natively supported material.

## DTCG / the requested W3C design-token format

The inspected latest published version is **2025.10**, dated 2025-10-28: a **Final Community Group Report, not a W3C Recommendation/Standard**. Use that version, not an unspecified “W3C JSON.” [D01/D03](evidence.md#public-sources).

Its `shadow` carries color, offsetX/Y, blur, spread and optional `inset`; a value can contain multiple lobes. `gradient` carries colors and normalized stop positions, but no angle, kind, coordinate system, interpolation or paint target. `border` carries color, width and stroke style, not a gradient paint or corner geometry. Dimensions are typed value/unit objects; colors use the color-module representation. References and `$extensions` exist; preserving metadata does not make it portable rendering behavior. [D01 §§8–9](https://www.designtokens.org/TR/2025.10/format/).

**Proposed adapter:** generate typed leaves and faithful composites only. Use separate light/dark/context token sets, optionally selected by the 2025.10 Resolver's sets/modifiers/resolution order. Mode selection is not a `light-dark()` formula inside a color value. The Resolver selects/combines data; Area still computes semantic source colors and guard outcomes before projection. [D02](https://www.designtokens.org/TR/2025.10/resolver/).

Specific export decisions:

- Keep cast, relief, emission and edge-ring tokens separately named, even when each can be serialized as shadow geometry. A zero-offset ring is not newly permitted elevation. Preserve lobe order; don't reference a whole list where a single lobe is required. Flag unresolved or ambiguous array references instead of guessing flattening.
- Normalize Area percent stop positions to the target's unit interval. Store angle/kind/interpolation/target and stable stop IDs in the Area sidecar. A core-only importer can use the stops but must report missing geometry; it cannot default every gradient to a vertical body fill and call that round-trip success.
- Export a gradient stroke as a gradient ramp plus width leaf and a sidecar edge recipe. Never put a gradient object into `border.color`. Solid border composites remain useful independently of the material.
- Numeric blur, light or grain inputs can be number/dimension tokens, but those leaves do not define acquisition, key-light interpretation or texture generation. There is no complete standardized material/filter/role type in the inspected format.
- Keep required rendering semantics in the canonical document. Optional namespaced extensions can carry provenance or a link/hash to it; a proprietary required extension is an Area-specific profile, not generic interoperability. Never invent `$type: "material"`, `glass`, or `string` and claim core conformance.
- Do not serialize unevaluated CSS `var()`, `color-mix()` or a full gradient string as a DTCG color. Export symbolic aliases only where their typed target is resolvable in that bundle; otherwise select a declared context, emit a snapshot and record the lost derivation.

The [small DTCG fixture](examples/projection.tokens.json) exercises a layered inner/outer shadow, solid border and stop ramp. All fixture dimensions/colors are authored test data, not adopted Area values. Its [sidecar/loss record](examples/projection.loss.json) states what the core file leaves out. It is a structural example, not a complete material export or an official conformance certificate.

## Tokens Studio

Tokens Studio documents both legacy and DTCG-prefixed formats, while still noting additional type support as future work. Its shadow documentation describes `boxShadow` compatibility differences and multiple inner/drop lobes; gradients are CSS-like color values and the documented Figma export supports linear gradients. Treat these as an adapter profile, not proof that changing `value` to `$value` makes a final-2025.10 file work. [T01](https://docs.tokens.studio/manage-settings/token-format), [T02](https://docs.tokens.studio/manage-tokens/token-types/box-shadow), [T03](https://docs.tokens.studio/manage-tokens/token-types/color/gradient).

**Proposed adapter:** pin plugin and transform versions at implementation time; advertise a tested Tokens Studio dialect separately from DTCG 2025.10. Emit token sets for base leaves and each selected mode; keep dependency sets active/reference-only as appropriate when exporting styles. Preserve stable Area path-to-token-name mapping and collision checks. Apply dedicated shadow field conversion (`offsetX/Y` versus `x/y`, `inset` versus shadow kind), rather than a blanket property rename. Separate an unsupported full recipe from the supported tokens.

Box shadows and gradients can become effect/paint styles referencing compatible leaf variables. A border is applied to node properties; it does not become a universal reusable border-plus-geometry style. The docs warn that independently applying different side colors changes the whole node's stroke color. `Other` can retain unusual decisions but does not visually apply them. [T04](https://docs.tokens.studio/manage-tokens/token-types/border), [T05](https://docs.tokens.studio/manage-tokens/token-types/other), [T07](https://docs.tokens.studio/figma/export/styles-variable-references).

**Missing or conditional:** Area guards, layer ownership, automatic fallback, dynamic derived colors, general mesh/refraction shaders and complete CSS masks remain sidecar/compiler work. Linear gradient import does not imply radial/conic/mesh export. A plugin's ability to store an `Other` value is not evidence of a working Figma effect. Mode/variable availability and destination plans need capability checks, not hardcoded universal limits. The plugin's skipped-variable guide still says four Figma variable types; use the newer Figma API union below for native capability, and test which types this plugin actually supports. [T06](https://docs.tokens.studio/figma/export/variables-skipped), [F01](https://developers.figma.com/docs/plugins/api/VariableResolvedDataType/).

No Tokens Studio installation/import was performed here. The fixture includes a separate legacy-style illustrative projection, and does not claim current plugin acceptance. A real adapter must import, export and compare both values and variable bindings in a disposable test file before declaring support.

## Figma: variables, styles and geometry are different targets

Current public API documentation lists **BOOLEAN, COLOR, EASING, FLOAT, STRING and TIMING** resolved variable types. None is a shadow, gradient, border or whole material composite. Collections provide modes; supported fields can reference variables. [F01](https://developers.figma.com/docs/plugins/api/VariableResolvedDataType/), [F08](https://developers.figma.com/docs/plugins/api/VariableCollection/).

**Variables proposal:** export semantic color leaves and scalar controls that the destination can bind. Use explicit logical mode names with a map to Figma collection/mode IDs; never persist file-local IDs as portable token names. Unitful dimensions need a declared conversion (CSS px for the initial adapter; rem needs a declared base). Preserve source units in metadata. Numbers stored as FLOATs do not automatically drive a property: binding support is separate from storage support. Avoid a giant Cartesian mode set spanning material × theme × density × state. Prefer independent collections where bindings are separable; otherwise generated style variants or plugin reapplication must state the dependency.

Shadow radius, color, spread and x/y offsets and blur radius are bindable effect fields. For gradient stops, the documented bindable field is color; angle/transform and stop position are not included in that field union. [F02](https://developers.figma.com/docs/plugins/api/VariableBindableEffectField/), [F03](https://developers.figma.com/docs/plugins/api/VariableBindableColorStopField/). Therefore changing the light-angle variable needs Area recomputation of shadow offsets and reflected geometry; it is not a native constraint expression. A gradient-position variable requires plugin-driven paint reconstruction or a baked style variant.

**Styles proposal:** paint styles carry paint lists; effect styles carry effect lists. Paints include linear, radial, angular and diamond gradients with transforms/stops. A paint style can be applied to a stroke but does not own its width, radius or the role of that edge. A full material needs a component/template or plugin-applied node recipe plus those styles and variables. [F04](https://developers.figma.com/docs/plugins/api/Paint/), [F06](https://developers.figma.com/docs/plugins/api/EffectStyle/), [F07](https://developers.figma.com/docs/plugins/api/PaintStyle/).

Figma currently documents shadows, normal/progressive blur, beta noise/texture/glass and shader effects. **Do not claim Figma cannot express glass or grain.** Its Glass controls include specular light, refraction, depth, dispersion and frost radius; noise, texture and glass explicitly lack variable binding. Shadow spread also has node/clip restrictions. Those facts support native visual authoring, not CSS-equivalent numeric conversion. [F05](https://developers.figma.com/docs/plugins/api/Effect/).

**Missing or conditional:** Figma's native optics do not implement Area's browser backdrop roots, CSS pseudo-element masks, media-query fallbacks, semantic scope re-emission or role policy. A native glass preview is an approximation unless a calibrated mapping exists; never copy Area light angle/depth/blur into similarly named Figma fields and call it exact. Noise seed/algorithm and refraction graphs also need explicit mapping. CSS conic and Figma angular geometry require an adapter; there is no native mesh-gradient member in the inspected GradientPaint union. Shader/image alternatives retain a different editability contract.

Recommended Figma outputs: leaf variables; named light/dark paint and effect styles; a node recipe manifest describing masks/overlays/geometry; and the Area source document for re-editing. Where style topology differs between modes, generate explicit variants and let the importer select/reapply them—don't claim a collection mode switches an arbitrary effect list. Raster fallback is optional, labelled flattened appearance with no parameter editing. Do not bake text/focus into an image or present a picture as an accessible interactive component.

No signed-in Figma changes were made. API capability is evidence; renderer parity, actual plugin support and plan-specific availability remain unverified. Public documentation and Tokens Studio docs are not perfectly synchronized; keep this distinction in the UI's export report.

## Tailwind

Current docs use CSS-first `@theme` namespaces, including shadow/inset-shadow/drop-shadow/blur; `@theme inline` supports aliases to other variables. Custom `@utility` rules can add behavior. Those mechanisms expose CSS, not an automatic role-aware material engine. [W01](https://tailwindcss.com/docs/theme), [W02](https://tailwindcss.com/docs/box-shadow), [W03](https://tailwindcss.com/docs/adding-custom-styles).

**Recommended adapter:** keep the full generated Area scoped CSS as the renderer, with a small Tailwind integration for opt-in scope controls and existing semantic aliases. A material-selection class must activate the complete compiled profile and derivation boundary. Setting a single blur custom property without the matching boundary does not implement a material. Do not ship `glass` as a uniform class that adds the same shadow and blur to every family.

Illustrative alias only, not a shipping export:

```css
/* An optional semantic alias for a permitted source cast, not a material role binding. */
@theme inline {
  --shadow-area-float: var(--area-shadow-float);
}
/* The Area renderer still owns role eligibility, boundaries and all effect composition. */
```

Use this alias only on an explicitly eligible independent receiver. Avoid applying shadow utilities to an Area component that already consumes its own Surface recipe: a later utility can replace its composed shadow/focus paint. Filter `drop-shadow()` follows rendered alpha; it is not the same renderer as box-shadow and is not a fallback for inset/spread semantics. Required focus remains independently owned. State variants must not recolor foreground on hover or defeat accessibility gates.

**Missing:** Tailwind theme tokens/classes carry no portable role graph, global light solver, named-layer editor, nesting or loss semantics. Raw utilities lose Area intent and editability unless the canonical JSON is retained. Publish generated CSS and integration metadata together. Target the installed Tailwind major explicitly; a v3 config export would be a separate tested adapter rather than these CSS-first directives pasted into a config object. Dynamic class discovery, layer order and nested-scope behavior need acceptance tests in the consuming build.

## Plain CSS

CSS can describe layered/inset box shadows, gradients with geometry, borders and clips; backdrop-filter has its own acquisition behavior. It still requires structure, semantic input bindings and the appropriate backdrop. [C01](https://www.w3.org/TR/css-backgrounds-3/#box-shadow), [C02](https://www.w3.org/TR/css-images-3/#gradients), [C03](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter).

**Recommended export:** a scoped CSS bundle from the future shared compiler, input variables, required assets, a binding/integration manifest and Area JSON. The bundle contains complete preset neutral resets, role/part selectors, pseudo-element ownership, scope re-emission, nested optical-owner guards, browser feature fallbacks, preference rules and state composition. Keep token namespaces disjoint; raw Material inputs do not write `--area-fg-*`, Surface width or radius. Derived paint remains unregistered. No standalone `:root` dump can replace the painted-part context that 07 requires.

Offer a distinct **static snapshot** mode only for a selected receiver, named theme/state/size and declared backdrop. It loses live scope derivation and cannot be reapplied universally. CSS values can stay editable as variables, but reverse-engineering them will not recover light ownership, role limits or stable layer IDs. Assets such as grain/filter definitions need deterministic identifiers and an export manifest; don't reference a transient local URL. Media-query fallbacks stay in the bundle instead of being flattened to the current machine's preference.

**Missing:** CSS has no standardized material interchange schema, provenance graph or owner-approval record, and native Liquid Glass/Mica optics are not guaranteed by a web filter stack. Browser-dependent support and visual differences remain; retain source JSON and fallback declarations rather than call a CSS export universally lossless.

## Target loss matrix

This matrix is a proposed adapter policy synthesized from the sources above. “Leaves” means useful individual data, not the complete behavior.

| Material information | DTCG 2025.10 core | Tokens Studio documented plugin path | Figma native | Tailwind adapter | Plain CSS renderer |
| --- | --- | --- | --- | --- | --- |
| Solid colors and dimensional leaves | Typed values/aliases | Supported types, dialect conversion | Variables/bindings where supported | CSS variables | Variables/values |
| Multiple outer/inner shadow lobes | Composite geometry | Composite → effect style | Effect list; eligible leaf bindings | CSS composition needs care | Box-shadow lists |
| Gradient stop colors/positions | Ramp data | Linear CSS-like value | Paint stops; color binding | CSS/custom utility | Gradient function |
| Gradient angle/kind/interpolation | Sidecar | Linear subset; verify interpolation | Transform/kind; no general equivalence | CSS rule | CSS rule/support limits |
| Solid border | Composite; no contour | Node application | Paint + separate node geometry | Utility or Area binding | Border + geometry |
| Gradient stroke/double rim | Sidecar recipe | Partial, not one native material | Node paints/overlays/masks | Custom compiled rules | Mask/background technique |
| Transmission/backdrop blur | Leaves only | Leaves/limited application | Paint alpha + blur; compare rendering | Custom role guard + CSS | Scoped filter + fallback |
| Grain/refraction/native glass | No full graph | Other/sidecar, no assumed renderer | Native effects/shaders; non-equivalent parameters | Custom renderer/assets | Backend/assets; some effects approximate |
| Shared light and derived semantic sources | Evaluated snapshots or sidecar | Some refs/math, not Area solver | Leaf bindings; plugin recomputation | Area compiler required | Area compiler required |
| Role caps/nesting/state/preference policy | Sidecar | Sidecar | Plugin/template, no browser parity | Area renderer required | Compiled rules and bindings |
| Reopen exact editable Area draft | No, core alone | No, target alone | No, target alone | No, CSS alone | No, CSS alone |

Every export report should have one record per projected source path: target path(s), status, reason, transform/version, source/context hash, and whether import can reconstruct it. A loss notice must say what is missing and whether the supplied sidecar can restore it. Block required unsupported behavior unless the user chooses a defined fallback; permit optional suppressed decoration with a visible report. Do not silently discard fields because the target parses the remaining JSON.
