# Architecture options and recommendation

**Status: proposals only.** Proposed token/API names below do not exist at the audited snapshot. [Evidence](evidence.md) distinguishes current source from authored choices. Neither option changes component approval, adds production CSS or adopts new optical defaults.

## Option A — Material beside Surface (recommended)

<!-- task19-superseded 07-controls/architecture.md ## Option A -->
> **Superseded policy — D2 (owner, 2026-10-11):** Material sits beside Surface; recipe structure switches with inherited 0/1 gate tokens. Surface shadows require a pixel-identical split into adjustable parts, including Tooltip/Toolbar literal exceptions. Selector-switched recipes alone are not nested-scope safe. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

Add `material` to the axis registry, selecting a **compiled role recipe profile**, initially with an identity `none` profile. Material owns optical inputs; Surface continues to decide decorative width and allowed cast recipes. Extend Surface's input representation to expose independent cast controls. Do not make Material write Surface properties. The editor may display these controls together while dispatching them to their respective owners.

Conceptual example: `value={{ surface: 'flat', material: 'frosted' }}` requests glass body/edge optics and no cast shadow. `frosted` is a proposed name, not a shipping preset. A field or Table row still receives only its permitted role recipe. The same Material selection can coexist with a different Surface selection without duplicating the optical profile.

### Single-writer ledger

| Proposed owner | Writes | Reads / does not own |
| --- | --- | --- |
| Theme / neutral / accent / action / selection (existing) | Their current color and emphasis inputs, including Theme's `--area-shadow-color` | No material effect parameter. Preserve semantic tones, action vs selection and paired colors. |
| Surface axis (extended) | Existing `--area-border-width`; new `--area-surface-` leaves for source cast geometry, enable gates, gains and role-specific cast adjustments | Reads no Material values in preset definitions. No `--area-shadow-color` write. After decomposition it stops directly writing the six public shadow lists. |
| Material axis (new) | `--area-material-` leaves: illumination, optics, intrinsic relief, decorative edge paint, emission, grain and reflection; finite role/layer inputs | No `--area-border-width`, `--area-shadow-*`, `--area-fg-*`, radius, size, state or motion writes. No external relief shadow outside Surface. |
| Shared emitter in `emit/base.ts` | Existing public `--area-shadow-1`…`4`, `--area-shadow-card`, `--area-shadow-float` **after their sole-writer migration**; new `--area-paint-` derived role/context outputs | Combines Surface/Material inputs with semantic colors and local context. Output namespaces are reserved to the emitter, not claimed by either axis. |
| Generated part binding / component paint rule | Private local bindings for body/tone, mask, role and existing tier; consumes shared derived declarations on the actual painted receiver | Does not create another public axis. Does not copy one complete recipe onto each component root. Required state/ink paint stays independently owned. |

Current ownership and code constraints: [registry](evidence.md#e02-registry-contract), [Surface/Theme ink](evidence.md#e04-surface-and-shadow-ink), [base derivations](evidence.md#e03-derivation-and-registrations).

The migration needs an **emitter-wide integrity check**, beyond today's inter-axis check: no key may be emitted by both an axis map and derived outputs; no axis may claim the reserved `--area-paint-` prefix. Retire Surface's exact `--area-shadow-1:`… claims when their values move to base derivation. Surface still owns their *policy*, through its new leaves; base is their sole *CSS declaration generator*. Do not leave old axis assignments plus competing derived assignments and rely on cascade order.

A proposed Surface lobe leaf family is `--area-surface-cast-<tier>-<lobe>-{x,y,blur,spread,alpha,enabled}`. Source colors that differ from Theme ink, such as the Card-specific pair, retain an explicit source descriptor and separate literal color leaves. Per-role Surface input prefixes are `--area-surface-role-<role>-*`; Material role inputs are `--area-material-role-<role>-*`. Every axis preset emits a complete, identical leaf set. A missing layer gets a disabled gate and neutral placeholder values, not missing keys that inherit a previous preset. Reserve those input prefixes narrowly enough that future unrelated tokens cannot accidentally share them.

**Role fallback:** serialize each optional role override as a presence flag plus a raw value. Resolve “use the global control” at the painted part through the shared derivation generator; do not declare `--role-value: var(--global-value)` once at root and inherit its already-resolved result. A cleared role override resets its presence flag. Recipe-specific role limits are separate policy gates, not defaults that prevent a later global input from taking effect. Apply the same distinction to named-layer overrides.

**Important cost:** the current shadows are complete strings. Do not parse arbitrary `box-shadow` text at runtime to extract blur/spread. Decompose the authored definitions once into typed source records, preserving order, exact offsets, colors, dark Card suppression and Flat `none`. Generate both base leaves and final lists from those records. Keep exact legacy public token names for consumers. Tooltip/Toolbar's source-specific recipes require explicit review before global cast knobs can honestly cover them; do not silently replace their recipes with `shadow-float`. [Current source and exceptions](evidence.md#e04-surface-and-shadow-ink), [elevation](evidence.md#e05-elevation-semantic-paint-and-hard-constraints).

### Trade-offs

- Independent optical and elevation selection avoids a Cartesian preset catalogue. Existing Surface names and semantic colors retain their meaning; material-off is a clear compatibility target.
- New inputs and derived outputs add schema/compiler complexity. Role/part binding and guard resolution remain necessary; a new axis alone does not apply material correctly.
- Source-cast decomposition is an explicit migration, with a regression burden. Cross-axis illumination must be opt-in for existing cast geometry; otherwise introducing Material would rotate approved shadows.
- Strict Surface behavior intentionally limits classic clay/neumorphic external lobes. The UI must show the suppressed channels rather than promise the full historical look.
- Variable-length recipes need compilation and a bounded schema; they do not fit unlimited runtime objects in the current flat AxisSelection API.

## Option B — Expand Surface into a combined style axis

<!-- task19-superseded 07-controls/architecture.md ## Option B -->
> **Superseded policy — D2 (owner, 2026-10-11):** Material sits beside Surface; recipe structure switches with inherited 0/1 gate tokens. Surface shadows require a pixel-identical split into adjustable parts, including Tooltip/Toolbar literal exceptions. Selector-switched recipes alone are not nested-scope safe. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

Keep one `surface` selection and make each preset a composite profile: elevation policy plus material role recipes. Preserve existing `flat`, `outlined`, `raised`, `elevated` as compatibility profiles with optical decoration disabled. Add profiles such as hypothetical `frosted-flat` and `frosted-outlined`; the names are examples, not recommendations for shipping presets.

Surface is the sole axis owner of `--area-surface-` optical, light and cast inputs plus existing decorative width. No Material axis or `--area-material-` namespace. The same emitter owns `--area-paint-` outputs and the migrated public shadow lists; existing color/shape/state owners stay unchanged. Optical controls route under `surfaceControls.optics`, and role overrides under `surfaceControls.roles[role].optics/cast`. Base derivation and scope re-emission work exactly as in Option A, but there is no material preset attribute.

Proposed React shape:

```tsx
// Proposal only; currently rejected as an unknown preset / unsupported prop.
<Theme
  value={{ surface: 'frosted-flat' }}
  surfaceControls={{ optics: { amount: 'quiet', backdrop: { blurPx: draft.blurPx } } }}
/>
```

**Trade-offs:** one selection is convenient for curated complete looks, and all visual-shell parameters have one axis owner. But a consumer wanting to change elevation alone must pick another composite profile or apply a separate sub-policy. Each optical profile repeats elevation combinations, unless Surface gains an internal two-dimensional selector—which is effectively Option A hidden inside one axis and would also require changing the current preset-string API. The word “Flat” risks ambiguity between absence of cast and absence of all modeling; retain its existing no-cast definition explicitly.

Continuous parameters, semantic guards, arbitrary CSS scopes, portal context and part bindings still require the same new infrastructure. This option does **not** save that work. Migrating saved Surface preferences and generated unions needs a compatibility map; default old selections must remain identical. It is reasonable if the product intends a small curated set of inseparable looks. It is less suitable for the brief's independently adjustable combinations.

## Recommendation

<!-- task19-superseded 07-controls/architecture.md ## Recommendation -->
> **Superseded policy — D2 (owner, 2026-10-11):** Material sits beside Surface; recipe structure switches with inherited 0/1 gate tokens. Surface shadows require a pixel-identical split into adjustable parts, including Tooltip/Toolbar literal exceptions. Selector-switched recipes alone are not nested-scope safe. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

Choose **Option A**. The brief explicitly asks for independently adjustable layer ingredients while preserving Surface, color, emphasis and scope invariants. [Brief](evidence.md#e01-research-inputs). Keeping illumination/optics in Material and cast eligibility/width in Surface provides a clear ownership boundary. Shared derivation expresses the intentional interaction without duplicate writers. This recommendation is an architectural inference from those constraints, not a performance measurement or approved API decision.

Do not replace Surface wholesale with a new `material` axis and discard the old names: that would force avoidable migration of existing shadow/width consumers and saved selections. A future complete theme preset can bundle several axes at a higher configuration layer, without changing their ownership.

## What derives in emit/base.ts

<!-- task19-superseded 07-controls/architecture.md ## What derives -->
> **Superseded policy — D2, D9 (owner, 2026-10-11):** Material sits beside Surface; recipe structure switches with inherited 0/1 gate tokens. Surface shadows require a pixel-identical split into adjustable parts, including Tooltip/Toolbar literal exceptions. Selector-switched recipes alone are not nested-scope safe. Figma Glass parameter names govern the next API. Light angle is 0 at top, clockwise; the historical 0-at-right angle convention below is superseded, not silently reinterpreted. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

Proposed division of work:

| Input or result | Proposed location / responsibility |
| --- | --- |
| Named recipe topology, layer IDs, source selectors, role guards, shared-shell bindings | Build-time recipe/binding compiler. Validate once; compile selectors and complete leaf schemas. Topology is not numerical CSS algebra. |
| Raw Material / Surface leaf values | Their respective axis presets and validated local overrides; no theme-specific derived color strings inside Material preset maps. |
| Paired semantic endpoint selection; tint/reflection/shade/glow/gradient-stop colors | Shared derivation functions in `emit/base.ts`, instantiated at the actual semantic context boundary. Preserve color pairs until painting. |
| Light vectors and relief/cast offset relationships; gains and alpha limits | Shared functions in `emit/base.ts`, with raw Surface geometry and Material illumination as inputs. |
| Role-specific channel eligibility and minimum ordinal cap | Recipe compiler/policy resolver; produces static channel gates and alternate recipes. Never a CSS numeric average of caps. |
| Final gradient, inset, cast, emission, edge and texture paint expressions | Shared base derivation generator, reused by role bindings; leaves remain adjustable. Backend-specific texture/lens assets come from the declared profile compiler. |
| Radius, hit area, control size, text and required state | Existing owners. Bind clips to the existing shape; no material-derived radius/size/foreground. |

### Illustrative equations, not visual defaults

A proposed finite light model, using the control conventions in `controls.md`:

```text
u = (cos(angle), sin(angle))                       # toward key light
k = cos(height)                                  # finite artistic grazing factor
keyCastOffset = -u * permittedLiftPx * k
castOffset = sourceOffset * liftGain              # direction=source
           OR keyCastOffset * liftGain            # direction=key
castBlur = sourceBlur * softnessGain
castSpread = sourceSpread + spreadDelta
castAlpha = clamp(sourceAlpha * strengthGain, 0, 1)
```

Here `permittedLiftPx` is a declared source lobe length, not a measured physical distance or a CSS stacking value. `sourceAlpha` means the effective alpha of the selected local color, including its theme polarity and any lobe multiplier; do not count alpha twice when a source color already contains it. The implementation must retain that color/alpha relationship as an expression until the relevant scope consumes it. Per-lobe controls can replace that lobe's base values before gains. Inset/gloss profiles use the same key vector with their own masks; conical/radial/color gradients and glow do not automatically follow it. The equations describe a proposed generator contract. Backend support and rendering must be validated later; this task does not claim a tested CSS implementation of the math.

Flat and forbidden receivers select the literal `none` path rather than just emitting transparent shadows. Identity Surface gains preserve approved source recipes; source direction is the compatibility mode. A zero-strength effect is disabled; dark Card remains disabled despite nonzero strength gain. Material `none` disables optional optics without zeroing source Surface shadows.

Proposed local color expression, with alpha a unitless scalar:

```css
/* Generated from emit/base.ts on the painted receiver, not only :root. */
--area-paint-glow-color: color-mix(
  in srgb,
  var(--_material-context-color) calc(var(--area-material-glow-strength) * 100%),
  transparent
);
```

This demonstrates alpha derivation only. A role-specific strength first resolves from its global value/override and cap. `--_material-context-color` is a proposed **private binding on the same painted receiver**, selected from existing semantic context; it is not a public consumer hook or something inherited from an arbitrary root. A danger Button binds danger context, a selected mark selection context, a neutral ordinary surface its body/edge context. A literal data core receives no such recoloring. Current component tone slots motivate this extra local step. [E08](evidence.md#e08-parts-local-tone-and-shared-shells).

Do not use `@property` on the derived output or either member of a paired color. Keep all new control leaves unregistered initially; add a numeric leaf registration only if later animation/parsing evidence justifies it, with the existing scoping tests. Literal color leaves, semantic expressions and serialized paint lists stay unregistered. The current color-pair helper pairs color values; passing an entire shadow/gradient string through `light-dark()` would require a different, valid representation. Pair the constituent colors, then build the paint. [E03](evidence.md#e03-derivation-and-registrations).

## Scope re-emission and local binding

<!-- task19-superseded 07-controls/architecture.md ## Scope -->
> **Superseded policy — D2 (owner, 2026-10-11):** Material sits beside Surface; recipe structure switches with inherited 0/1 gate tokens. Surface shadows require a pixel-identical split into adjustable parts, including Tooltip/Toolbar literal exceptions. Selector-switched recipes alone are not nested-scope safe. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

Current `emit/css.ts` re-derives on registry axis attributes and contrast. Adding Material to the registry covers its **preset selector**, but does not cover a control-only element. [E06](evidence.md#e06-css-scope-emission). Propose an explicit `data-area-material-scope` marker for scalar/role override boundaries; it does not select or reset a preset. Surface-only control overrides also add this shared optical derivation marker.

Re-emit the relevant derived groups at:

1. Root defaults and every existing axis/contrast boundary, including theme, neutral, accent, action, selection, ui, radius, Surface and Material.
2. Every `data-area-material-scope`, including pure CSS overrides with no changed preset ID.
3. Each actual painted role/semantic boundary from the generated bindings, so local tone and role overrides participate before final paint resolves. Reuse one derivation generator from `emit/base.ts`; do not hand-copy formulas per component.
4. A portal destination Theme boundary with the complete effective axis and control context. A top-layer element that stays in its DOM ancestry is not automatically a portal; follow its real ancestry.
5. Accessibility fallback rules at the affected receiver. Media-query fallback can suppress optional channels while retaining required paint; it must not be undone by inline requested values. Gate the effective output separately from those inputs.

**CSS-only example, proposed:**

```css
[data-area-material-scope].quiet-pane {
  --area-material-backdrop-blur: var(--app-reviewed-pane-blur);
  --area-material-role-floating-surface-gloss-strength: 0;
}
```

This requires an already-selected compiled recipe and a registered application value. It declares raw inputs at the same element where derived expressions are re-emitted. A bare inline custom-property change deeper in the tree without a boundary remains unsupported for ancestor-derived outputs; document the marker requirement. Scope inheritance does not freeze computed colors in a JS snapshot.

Part bindings must name the actual receiver, including pseudo-elements and native parts; alias a shared donor shell; carry semantic source and existing cast tier; and mark nonpaint targets. Propose a separate typed companion binding manifest keyed by the existing component/part IDs, validated against `packages/styles/src/manifest.ts`. This avoids turning research's part list into hundreds of required DOM attributes and allows pseudo-element rules. Resolve conditional variants/states and composition bindings explicitly. The existing manifest has no such fields. [E08](evidence.md#e08-parts-local-tone-and-shared-shells).

Family-context exceptions are policy guards, not CSS recipes named `table-glass` or `calendar-clay`. One guard can suppress backdrop on reading grounds across Table, CodeBlock, Message and Calendar; Slider preserves track/fill geometry while its thumb remains an eligible independent receiver. Shared-shell/nesting ownership comes from these bindings and explicit host context, not from guessing ancestor styles in JS. Prior decisions: [task 05](evidence.md#e01-research-inputs).

## React Theme and non-React configuration

<!-- task19-superseded 07-controls/architecture.md ## React -->
> **Superseded policy — D2, D3, D9, D16 (owner, 2026-10-11):** Material sits beside Surface; recipe structure switches with inherited 0/1 gate tokens. Surface shadows require a pixel-identical split into adjustable parts, including Tooltip/Toolbar literal exceptions. Selector-switched recipes alone are not nested-scope safe. Ordinal caps and provisional control ranges are not limits. Numeric per-role strength multipliers and bounds must be calibrated to the board and contrast-tested at extremes; that work is pending tasks 20–22. Figma Glass parameter names govern the next API. Light angle is 0 at top, clockwise; the historical 0-at-right angle convention below is superseded, not silently reinterpreted. Material does not change geometry, typography or foreground ink. Multi-axis choices are bundles, not a material axis. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

### Proposed API surface (Option A)

Keep `Theme.value` as preset selections, generated from the registry. Add typed configuration **props beside it**, rather than putting objects or numbers into `AxisSelection`:

```tsx
// Proposal sketch; these props/profiles do not exist today.
<Theme
  value={{ theme: 'dark', surface: 'outlined', material: 'frosted' }}
  material={{
    amount: 'quiet',
    light: { angleDeg: draft.lightAngleDeg, heightDeg: draft.lightHeightDeg },
    body: { transparency: draft.transparency },
    backdrop: { blurPx: draft.blurPx },
    gloss: { strength: draft.glossStrength },
    roles: {
      'floating-surface': { gloss: { strength: 0 } },
      'recessed-field-track': { amount: 'trace' },
      text: { amount: 'none' },
    },
  }}
  surfaceControls={{
    softnessGain: draft.castSoftnessGain,
    spreadDeltaPx: draft.castSpreadPx,
    strengthGain: draft.castStrengthGain,
  }}
>
  {children}
</Theme>
```

`draft.*` values are deliberately unspecified calibration inputs. This is documentation, not a runnable component change. Add generated `MaterialControls`, `SurfaceControls`, `MaterialRole` and profile/layer ID types. Unknown roles, parameters or incompatible source choices should fail validation. Unions can restrict fields for `text`/`scrim` and profiles; runtime validation handles data loaded from JSON.

Preserve `useTheme(): Readonly<AxisSelection>` for existing callers. Add a proposed `useMaterial()` returning the resolved recipe selection and immutable effective **configuration** (inputs, roles, diagnostics), not a claim to read final painted CSS. Internally Theme context can carry `{axes, materialConfig, surfaceConfig}` while retaining the old hook's return shape. DOM-free helpers in the config package should validate/merge/serialize the same data for CSS-only and server-rendered consumers; extend generated types rather than hand-maintain conflicting unions. Current configuration generation/Theme behavior: [E07](evidence.md#e07-react-and-configuration).

### Precise inheritance and reset proposal

| Case | Proposed behavior |
| --- | --- |
| `material` / `surfaceControls` omitted | Inherit the parent configuration for that owner. Root starts from profile/Surface defaults. |
| Patch object with omitted field | Inherit that field; merge named records recursively. Validate unknown keys. Do not mutate parent. |
| `material={null}` | Clear inherited material-control patches and role overrides; use the current effective Material profile's defaults. This does not select `none`. |
| Leaf `null` in a patch | Reset that leaf to the current profile's default, bypassing a parent's custom override. Distinguish it from `undefined` inheritance. |
| Explicitly different `value.material` | Start that material from the new profile defaults, clear inherited material patches, then apply the local patch. Otherwise old glass settings can leak into paper. Same-ID selection retains inheritance. |
| `value.material='none'` | Select identity optics. Surface and required paint remain. Requested role settings cannot re-enable channels absent from the identity profile. |
| Changed `value.surface` | Reset Surface-control patches to that preset's defaults, then apply local `surfaceControls`; Material inputs remain inherited. |
| Role record omitted | Inherit role request; it still goes through all guards. `roles[role]=null` resets to this profile's role default. |
| Ordered layer/stop array supplied | Atomic replacement by stable layer IDs; never index-wise deep merge. Shape must fit the compiled profile schema. |
| `pills`, radius, motion, ordinary HTML props | Preserve existing contracts; this proposal does not silently fold them into Material or repair unrelated inheritance behavior. |

An editor may offer “keep overrides when changing recipe,” but it must make that an explicit operation: validate compatible fields and construct the new patch deliberately. A React remount or portal must not be mistaken for a user-triggered preset change. Track profile identity and resolved patch provenance in context; copying the same profile at a portal retains its inputs.

Theme renders the complete effective axis selection as today, plus the marker and serialized raw control leaves needed to recreate effective control context. Inline values take precedence over preset leaves, while effective guard outputs remain separately generated. Serialize resets explicitly where CSS inheritance would otherwise retain a parent override. Merge user `style` carefully: reject duplicate public control leaves supplied both through typed props and raw style, with a diagnostic, instead of relying on spread order. Raw DOM attributes outside Theme still require explicit configuration bridging into React.

For portals, an empty nested `<Theme>` at the destination inherits complete React context and re-emits it. The current implementation carries only axes; it must be extended to carry role patches, structural profile identity and raw control leaves too. This does not make Theme responsible for focus, positioning, dismissal or overlay state. Native top-layer ancestry and true React portal relocation should both be tested.

### Structural recipe / variable-length control boundary

<!-- task19-superseded 07-controls/architecture.md ### Structural recipe -->
> **Superseded policy — D2 (owner, 2026-10-11):** Material sits beside Surface; recipe structure switches with inherited 0/1 gate tokens. Surface shadows require a pixel-identical split into adjustable parts, including Tooltip/Toolbar literal exceptions. Selector-switched recipes alone are not nested-scope safe. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

The existing axis schema uses a fixed flat token set; it does not interpret a nested gradient object. [E02](evidence.md#e02-registry-contract). Proposed handling:

- Register recipe topology at build time. Its descriptor declares named body/edge/glow/gloss/texture layers, stop slots, coordinate types, masks, roles, source selectors and fallbacks.
- Generate a finite union of slots across registered profiles; all axis presets emit the same keys. Inactive slots get explicit disabled flags and valid inert placeholders. Token names come from trusted profile/layer IDs, not arbitrary user strings.
- Runtime Theme edits existing stop positions, colors, alpha and angle through those leaves. It may enable a previously declared spare stop or replace its ordered list within that profile's declared capacity. Adding a new layer/stop beyond the compiled capacity requires compiling/registering a revised profile. State this limit in the editor.
- Do not serialize an ancestor-level `linear-gradient(var(--semantic-color), ...)` into one inheritable raw list and assume descendant tone changes will re-evaluate it. Emit the gradient's derivation at each painted context from its scalar/source inputs.
- Mesh assets, grain seeds and SVG lens topology are compiled assets/descriptors. Runtime numeric controls can tune declared supported parameters; a new noise asset, mesh topology or shader graph requires export/compilation. No generic arbitrary URL, CSS or shader string is accepted through the typed controls.
- All profile shapes, slot capacities and numerical calibration bounds must be explicit and inspected. This report chooses no unsupported maximum layer/stop count or memory/performance budget. Task 14 can specify authoring/export ergonomics; task 11 must measure rendering cost.

This preserves static generated styles and bounded types, at the cost of less freedom than an unlimited runtime paint editor. An alternative runtime stylesheet compiler would allow arbitrary structure but expands serialization, SSR, CSP, caching and validation responsibilities. It is not recommended as the initial Theme contract and is not implied by adding a new axis.

## Proposed implementation sequence and acceptance criteria

No step below is performed by this research task.

1. **Schema/ownership first.** Add recipe/control and role-binding schemas, reserved output namespaces and complete-preset checks. Invalid keys/values/source types fail before CSS generation. Verify all task 04 mapped targets/aliases, including nonpaint and conditional parts, are either bound or explicitly deferred; do not claim all-family coverage from one Button demo.
2. **Compatibility before optics.** Decompose Surface cast data into source leaves. With identity gains/source direction/material-none, compare existing final shadow values and representative rendered Button, Card, Panel, thumb, Tooltip, Toolbar and overlay paint. Flat emits none, dark Card stays off, required edges persist. Consumer overrides of existing public shadow tokens need regression tests and documented scope precedence.
3. **Derivation fixtures.** Test theme→material→accent, material→theme→ui, control-only nested boundaries, removal/reset, local danger/selection, explicit custom paired colors and profile changes. Inspect actual painted colors/gradients, not only unresolved custom-property text. Require namespace checks over both axes and derived outputs.
4. **Role/context fixtures.** Glass Panel with Table/CodeBlock, DatePicker's plain Calendar inside Popover, Message with Composer, shared InputGroup and Slider rail/thumb. High requested blur/gloss must be visibly suppressed where guarded; unrelated text and functional marks remain unchanged. Verify glass-in-glass and recess-in-raised rules at actual receivers.
5. **React/config tests.** SSR and client produce identical attributes/leaves; unknown inputs reject; immutable patches merge/reset as specified; old useTheme callers work; portal wrappers reproduce recipe/control context; CSS-only host bridging is explicit. Test profile schema capacity and stop-list replacement, not just scalar setters.
6. **Visual/accessibility/performance calibration.** Run the existing contrast gates without waivers plus rendered combinations, focus+selected+invalid, forced colors, supported browser paths, compact/default and near-black. Test unknown/dynamic backdrop fallback and motion preferences. Measure cost before publishing effect budgets. Tasks 08–12 own deeper investigation; passing schema tests does not confer visual or owner approval.

The current token-change verification requirement is [CONTRAST A L66–70](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/CONTRAST.md#L66-L70). These future checks supplement it rather than weaken it. Proposed default optical values remain unresolved until reference-backed calibration and owner review.
