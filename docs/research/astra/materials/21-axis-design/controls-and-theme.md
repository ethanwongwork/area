# Typed controls and Theme — proposal

The public interface sketch is [api-proposal.ts](api-proposal.ts). It extends the existing `Theme.value` with `material`; **do not add a second competing preset prop**. `materialControls` carries a versioned patch, and `materialEffect` is an instance opt-in only on supported text slots. D2/D3 put Material beside Surface with typed continuous controls after presets. D16 forbids geometry/type/ink changes inside Material. [REVIEW.md:124–130](https://github.com/ethanwongwork/area/blob/0169fb7b6d85a910a24a684f9b5b3b537a735956/docs/research/astra/materials/REVIEW.md#L124-L130), [REVIEW.md:153–154](https://github.com/ethanwongwork/area/blob/0169fb7b6d85a910a24a684f9b5b3b537a735956/docs/research/astra/materials/REVIEW.md#L153-L154).

```tsx
<Theme value={{ material: 'tactile' }}>
  <Theme value={{ material: 'glass' }} materialControls={{
    for: 'glass',
    lightAngle: materialNumber('lightAngle', 0),
    glass: { radius: materialNumber('glass.radius', 12) },
    roleStrength: { 'row-plate': materialNumber('roleStrength', 0.25) }
  }}>
    <Button materialEffect="engraved">Save</Button>
  </Theme>
</Theme>
```

This syntax is illustrative; it does not compile against today's Theme. The standalone type file is a proposal, not a package export. It type-checks in isolation with `tsc --noEmit --strict --skipLibCheck --target es2022 api-proposal.ts`; this does not claim compatibility with today's React package. Branded numbers prevent mixing checked units; the constructor must validate finite numbers and reject out-of-range values at runtime. A TypeScript `number` or a branded cast alone is not a bound. Preset IDs, source enums, stop order/count and role IDs also require runtime validation. Raw CSS overrides cannot be fully constrained by TypeScript and remain an explicitly unvalidated escape hatch.

## Numeric controls: units, bounds and complete defaults

The following values are **proposed development envelopes and starter defaults**, not Figma defaults, Area measurements, contrast guarantees, device budgets or binding D3 caps. D3 requires calibration against the board and contrast tests at the extremes before shipping. Broad draft ranges allow expression; a renderer must still choose a safe fallback for an unsafe combination. No existing contrast floor changes. D14 supplies no calibrated blur/layer budget yet. [REVIEW.md:128–130](https://github.com/ethanwongwork/area/blob/0169fb7b6d85a910a24a684f9b5b3b537a735956/docs/research/astra/materials/REVIEW.md#L128-L130), [REVIEW.md:149–150](https://github.com/ethanwongwork/area/blob/0169fb7b6d85a910a24a684f9b5b3b537a735956/docs/research/astra/materials/REVIEW.md#L149-L150).

- `lightAngle`: 0…360 deg; defaults **None / Glass / Tactile / Soft** = 315 / 315 / 315 / 315.
- `lightHeight`: 0…90 deg; defaults **None / Glass / Tactile / Soft** = 45 / 45 / 45 / 45.
- `opticalDepth`: 0…24 px; defaults **None / Glass / Tactile / Soft** = 0 / 6 / 6 / 4.
- `shadowSoftness`: 0…96 px; defaults **None / Glass / Tactile / Soft** = 0 / 12 / 12 / 18.
- `shadowSpread`: -32…32 px; defaults **None / Glass / Tactile / Soft** = 0 / 0 / 0 / 0.
- `shadowStrength`: 0…2 ratio; defaults **None / Glass / Tactile / Soft** = 0 / 1 / 1 / 0.7.
- `glowStrength`: 0…1 ratio; defaults **None / Glass / Tactile / Soft** = 0 / 0 / 0 / 0.
- `gradientAngle`: 0…360 deg; defaults **None / Glass / Tactile / Soft** = 180 / 180 / 180 / 180.
- `strokeOpacity`: 0…1 ratio; defaults **None / Glass / Tactile / Soft** = 0 / 0.25 / 0.25 / 0.25.
- `fillOpacity`: 0…1 ratio; defaults **None / Glass / Tactile / Soft** = 1 / 0.72 / 1 / 1.
- `grain`: 0…1 ratio; defaults **None / Glass / Tactile / Soft** = 0 / 0 / 0.04 / 0.
- `gloss`: 0…1 ratio; defaults **None / Glass / Tactile / Soft** = 0 / 0.45 / 0.65 / 0.
- `glass.lightIntensity`: 0…1 ratio; defaults **None / Glass / Tactile / Soft** = 0.35 / 0.35 / 0.35 / 0.35.
- `glass.refraction`: 0…1 ratio; defaults **None / Glass / Tactile / Soft** = 0 / 0 / 0 / 0. Reserved/deferred; see Figma mapping.
- `glass.depth`: 1…128 Area px; Figma docs do not specify units; defaults **None / Glass / Tactile / Soft** = 24 / 24 / 24 / 24. Reserved/deferred; see Figma mapping.
- `glass.dispersion`: 0…1 ratio; defaults **None / Glass / Tactile / Soft** = 0 / 0 / 0 / 0. Reserved/deferred; see Figma mapping.
- `glass.radius`: 0…64 Area CSS px (Frost); defaults **None / Glass / Tactile / Soft** = 0 / 12 / 0 / 0.

Defaults are the same numeric inputs in light and dark. Color derivation changes polarity. `fillOpacity` increases opacity (decreases transparency), avoiding an ambiguous “transparency” slider whose direction differs by renderer. `opticalDepth` is relief/cast distance, not layout displacement; `glass.depth` is reserved lens depth. `shadowSoftness` names the CSS blur radius; there is no second blur synonym for the glass Frost radius. `lightAngle` is shared with Glass rather than duplicated as `glass.lightAngle`.

None's dormant inputs do not repaint anything: all recipe gates are zero and it adds no material paint. It preserves Surface, focus, masks and semantic state. Setting a Material control cannot turn None on. Selecting another preset resets the complete Material input set before applying a matching local patch.

## Non-numeric controls and roles

- `colorSource` and `glowColorSource`: neutral, accent, info, success, warning, caution, danger or discovery; defaults neutral and accent. No arbitrary hex/RGB field. The serializer emits a complete one-hot set of `--area-material-input-color-<source>` / `-glow-color-<source>` leaves. Base owns the resulting colors.
- `strokeMode`: none, solid, gradient, top or double. Defaults None→none, other presets→solid. These are **decorative overlay strokes**, never a change to border width, required-edge geometry or the Shape axis. It emits a complete one-hot `--area-material-input-stroke-<mode>` set.
- `gradientStops`: 2–8 ordered records `{offset,source,alpha}`. Offsets and alpha are finite 0–1, equal offsets are allowed for hard transitions. Array replacement is atomic, never merged by index. Default records: neutral at 0 with alpha 0, accent at 1 with alpha 0. Unused slots through 8 remain zero-alpha at offset 1. These defaults add no optional gradient finish. Each fixed slot emits offset, alpha and source-gate leaves; the base emitter derives the stop color.
- `roleStrength`: numeric multipliers 0–2 per canonical role, changing **extra decorative paint only**. None has all zero. Other presets: page .15; row-plate Glass .25 / Tactile .4 / Soft .55; container, floating-surface, raised-control, recessed-field-track, thumb-knob, glyph and text 1; indicator-fill, divider, edge and scrim 0. Text/glyph strength is dormant without an allowed instance opt-in; glyph effects have no launch opt-in at all. Values on semantic roles never attenuate existing semantic paint. `roleStrength.text=0` suppresses an opted-in effect without fading text.

The role strengths are default calibration seeds, not maximums. The multiplier cannot bypass row-state guards, small-text opt-in rules, required edges or safety fallbacks. Per-role overrides of every optical primitive are deferred until numeric strength calibration establishes a useful minimal API; this proposal's per-role override is strength.

## Reset and propagation rules

1. Root omission selects None and its defaults. Omission inside Theme inherits the complete resolved Material state, including controls and role strengths.
2. An explicit `value.material` is a **new preset boundary**, even when equal to the parent ID. Start with that preset's complete defaults; discard inherited controls, sources, stops and strengths. Then apply the local matching patch.
3. `materialControls={{for:'glass', ...}}` applies only when the effective preset is glass. Changing the preset while a stale glass patch remains discards that entire patch, emits a development diagnostic and uses the new defaults. It must not retain a stale inline blur. An intentionally supplied matching patch remains controlled input.
4. `materialControls="preset"` restores the effective preset's defaults without changing the preset. Removing the control prop restores inheritance if no explicit preset is present; with an explicit preset it restores that preset's defaults. There is no hidden “last controls for this preset” cache.
5. Partial nested objects merge field-by-field **only after** the reset/inheritance decision. Stop arrays replace atomically. Invalid supplied values throw before serialization; unsupported refraction/dispersion values are rejected rather than displayed as functioning.
6. Scope removal removes the full set of previously emitted owned inline leaves; no obsolete properties survive a rerender. A CSS-only helper must do the same before changing the material attribute. A raw DOM author changing attributes while leaving conflicting inline declarations has explicitly overridden the preset and does not get an implicit JS reset.

[model.mjs](model.mjs) is an executable **data resolver model**, not a Theme implementation. Its public-prop adapter normalizes nested Glass fields to the flat control ledger, applies the for-tag guard, and resolves a full state. [resolver-results.json](resolver-results.json) checks inheritance, explicit same-preset reset, nested None, stale patches, bounds and serialized remounts. It does not claim an actual React portal test.

## Context and portals: do not repeat pills

Today Theme stores only `AxisSelection` in its context. It merges axes and emits a complete attribute map. `pills` is a separate prop: its attribute is written on that div, but the set is never put into the context. Therefore descendants in the same DOM inherit pill flags, while a new `<Theme>` in a portal receives the axes but cannot reconstruct a custom pills set from that context. `useTheme()` also does not return pills. [Theme.tsx:5–32](https://github.com/ethanwongwork/area/blob/4ea50618cf19e8737b607c9f983f64dd310d921d/packages/react/src/components/Theme.tsx#L5-L32), [THEMING.md:115–124](https://github.com/ethanwongwork/area/blob/4ea50618cf19e8737b607c9f983f64dd310d921d/docs/THEMING.md#L115-L124).

Propose an internal `ResolvedThemeScope` containing `{axes, materialControls, surfaceControls, pills}`. Keep `useTheme()` backward-compatible as the axis-only public return; expose a separate internal scope hook/bridge for portal hosts. Resolve Material once, store the full validated result and provenance, and serialize all effective primitive leaves at every React Theme boundary. A portal bridge consumes this context and writes the same attributes and numeric controls on its new DOM root. **It must not run the ordinary explicit-preset reset algorithm on the resolved snapshot**, or the portal will lose its parent's custom values. A user-authored Theme inside that bridge can then intentionally reset.

For pills, normalize omitted→inherited effective set, `[]`→empty set, provided list→validated exact set, and emit that resolved set at a portal root. This is a proposed repair bundled with scope plumbing, not an assertion that current pills already cross portals. Existing `pillsAttribute()` validates allowed names and `themeAttributes()` knows only axes. [config.ts:38–49](https://github.com/ethanwongwork/area/blob/4ea50618cf19e8737b607c9f983f64dd310d921d/packages/tokens/src/emit/config.ts#L38-L49).

Context does not automatically paint a portal. Use the internal bridge for every portaled overlay; adding Material to context without re-emitting CSS is incomplete. Native top-layer promotion retains DOM ancestry, whereas an actual React portal changes it; distinguish them in tests. A portal entering a raw CSS-only host still needs the host's theme snapshot explicitly, as current docs require. Never infer that React context has read arbitrary DOM attributes. [THEMING.md:119–126](https://github.com/ethanwongwork/area/blob/4ea50618cf19e8737b607c9f983f64dd310d921d/docs/THEMING.md#L119-L126).

## Emission order and required implementation tests

Resolve axes → detect Material/Surface reset boundaries → validate current patches → produce complete primitive leaves → serialize attrs/inline leaves → re-derive base paint → consume receiver tone/state/size. Generate config types/defaults from the registry, and control types/bounds from one schema; do not maintain unrelated React and JSON vocabularies. Today's config emitter already derives `AxisSelection` from registry presets. [config.ts:54–74](https://github.com/ethanwongwork/area/blob/4ea50618cf19e8737b607c9f983f64dd310d921d/packages/tokens/src/emit/config.ts#L54-L74).

Acceptance must include preset switches while mounted, same-preset reset, deletion of controls, local mode/accent changes, raw DOM scopes, portal bridges, two nested portals, pills empty/custom sets, server/client hydration and absence of stale inline keys. Add bounds/enum/unknown-key tests to the real public validator. The model and CSS fixture here cover only the explicitly recorded subset. Full-gallery None identity and material contrast/fallback tests from task 20 remain separate gates.
