"""Render authored proposals with pinned Area links; numbers are proposal seeds unless labelled measured."""
from pathlib import Path
import json,sys
H=Path(__file__).resolve().parent
A='https://github.com/ethanwongwork/area/blob/4ea50618cf19e8737b607c9f983f64dd310d921d/'
R='https://github.com/ethanwongwork/area/blob/0169fb7b6d85a910a24a684f9b5b3b537a735956/'
def save(name,s):
 text=s.replace('{A}',A).replace('{R}',R).strip()+'\n'
 if '--check' in sys.argv:assert (H/name).read_text()==text,name
 else:(H/name).write_text(text)
save('README.md','''
**Question:** How should Area add the Material axis, scoped controls and recipe gates while preserving Surface pixels, independent geometry/type/ink, and correct portal inheritance?

**Answer:** Propose `material=none|glass|tactile|soft`, default None, with three inherited 0/1 recipe gates and disjoint input/role namespaces. Re-derive paint at scope boundaries and receivers; carry resolved controls in React context. The local Chromium experiment passes eight nested-scope cases and 64 Surface split comparisons with identical pixels and computed shadows. Four correct gate-off techniques leave zero changed pixels; four counterexamples show why numeric zero alone is insufficient. Preserve Tooltip/Toolbar under Flat during migration. Figma's verified API uses `radius` for Frost; no `frost` or `splay` field appears in the checked GLASS interface. Control ranges/defaults are proposals pending D3 calibration, not approved limits.

**Snapshot:** checked 2026-10-12, America/Los_Angeles. Area `origin/main` **4ea50618cf19e8737b607c9f983f64dd310d921d**; research **0169fb7b6d85a910a24a684f9b5b3b537a735956**. Read the [brief](../README.md), [D1–D16]({R}docs/research/astra/materials/REVIEW.md#L120-L154), all files under `packages/tokens/src/axes/`, [base.ts]({A}packages/tokens/src/emit/base.ts#L1-L384), [css.ts]({A}packages/tokens/src/emit/css.ts#L1-L198), and [THEMING.md]({A}docs/THEMING.md#L1-L151). [Source ledger](source-ledger.json) pins hashes. No packages changed.

## Evidence and proposals

- [Axis, gates, colors and roles](axis-design.md): ownership, emission points, row-plate, inner rims and explicit text effects. [axis.json](axis.json) is the proposed complete numeric token map; [namespace audit](namespace-audit.json) runs the **actual pinned registry** against it.
- [Controls and Theme contract](controls-and-theme.md): typed names, units, bounds, every preset default, reset rules and the pills counterexample. [Type proposal](api-proposal.ts), [control data](controls.json) and [resolver model](model.mjs).
- [Surface split](surface-split.md): every existing lobe, migration of Tooltip/Toolbar, and a scoped adjustment path. [surface-parts.json](surface-parts.json) records original strings and their decompositions.
- [Figma verification](figma-glass.md): public plugin API documentation checked today, with a separate UI label/API name mapping.
- [CSS demo](demo.html), [browser evidence](browser-results.json), [verification](verification.md). Serve this folder locally; opening it via `file:` will not load its JSON fixture reliably.

## Recommendation

Keep Material beside Surface; use arithmetic gates for optional shadow/background paint and separate noninteractive optical layers for filter effects. Keep host content filters untouched, including in None. Ship the Surface decomposition first with a whole-gallery identity gate, then calibrated presets, then continuous controls. The local tests establish the proposed mechanisms, not whole-Area identity or final material appearance.

## Reproduce

Use Node 24 with Area's installed `apca-w3` dependency (at its lockfile version), plus Playwright and pngjs for the browser experiment. `AREA_DEPENDENCIES` points to the checkout holding Area's dependencies; `BROWSER_DEPENDENCIES` points to the directory holding the browser tools' package.json. No install or package build is performed by these scripts.

```sh
node --disable-warning=ExperimentalWarning docs/research/astra/materials/21-axis-design/build.mjs --check
python3 -B docs/research/astra/materials/21-axis-design/write-report.py --check
python3 -B docs/research/astra/materials/21-axis-design/check.py
node docs/research/astra/materials/21-axis-design/verify-browser.mjs
python3 -m http.server 8771 --bind 127.0.0.1 --directory docs/research/astra/materials/21-axis-design
```

Set `BROWSER_EXECUTABLE` to an installed Chromium executable if Playwright has no bundled browser. Read `browser-results.json` for this run's engine/version; raw screenshots stay ignored in `.capture/`. `build.mjs` imports pinned source through an in-memory Git loader; it neither edits packages nor checks out copies of source. Omit `--check` to regenerate data. `write-report.py` regenerates the readable proposals.

## Open questions

D3's board-based calibration and D14's owner-named minimum device remain outstanding. This report deliberately labels the generous draft bounds as **development envelopes**, not safety guarantees. Figma's API documentation does not define the light-angle origin or length units; Area's clockwise/top convention is D9, and CSS radius mapping is an approximation. Refraction/dispersion remain disabled pending D8. Native forced colors, AT, Safari/Firefox, full React portal execution and the full-gallery Surface migration remain future acceptance work.
''')
save('axis-design.md','''
# Material axis and emission contract — proposal

## Ownership and preset structure

`id: "material"`, label Material, `defaultPreset: "none"`, attribute `data-area-material`, presets **none, glass, tactile, soft**. This follows D2/D4; it does not bring back Paper/Aero/Glow/Prism as launch materials. [REVIEW.md:124–132]({R}docs/research/astra/materials/REVIEW.md#L124-L132).

Material owns three prefixes: `--area-material-gate-`, `--area-material-input-`, `--area-material-role-`. Base derivation alone writes `--area-material-paint-`; presets and React never write that derived prefix. Surface adds `--area-surface-part-` and exact `--area-shadow-tooltip:` / `--area-shadow-toolbar:` claims. The theme's `--area-shadow-color` remains theme-owned: **do not broaden Surface to `--area-shadow-`**. Type's `--area-text-`/`--area-display-` are also already taken. [color.ts:104–137]({A}packages/tokens/src/axes/color.ts#L104-L137), [type-size.ts:73–83]({A}packages/tokens/src/axes/type-size.ts#L73-L83), [surface.ts:21–26]({A}packages/tokens/src/axes/surface.ts#L21-L26).

[namespace-audit.json](namespace-audit.json) lists **all ten actual registered axes** and their expanded namespaces. `build.mjs` imports the immutable registry and passes Material plus the Surface namespace extension to its real integrity checker. It also confirms a broad shadow-prefix collision is rejected. Every preset writes the same complete keys, so a Glass child clears inherited Tactile/Soft values. Pills and legacy ui are not extra axes. [registry.ts:21–32]({A}packages/tokens/src/axes/registry.ts#L21-L32), [registry.ts:76–115]({A}packages/tokens/src/axes/registry.ts#L76-L115), [THEMING.md:15–33]({A}docs/THEMING.md#L15-L33).

Three mutually exclusive recipe gates are `--area-material-gate-glass`, `-tactile`, `-soft`. None is `(0,0,0)`, Glass `(1,0,0)`, Tactile `(0,1,0)`, Soft `(0,0,1)`. They are discrete: never interpolate them or accept a fractional gate from Theme. Optical strengths are separate continuous inputs. A new per-role multiplier does not control a semantic fill, focus ring, selected mark or text opacity. The action/selection precedent is one inherited 0/1 input with derived colors, not ancestor selectors repainting every descendant. [emphasis.ts:13–29]({A}packages/tokens/src/axes/emphasis.ts#L13-L29), [base.ts:90–108]({A}packages/tokens/src/emit/base.ts#L90-L108).

The proposed numeric map also includes one-hot source/stroke selectors and eight fixed gradient slots. Unused slots have zero alpha; stop count and ordered offsets are validated before emission. Preset maps are theme-invariant. Dark/light color pairs are derived separately, so a theme change cannot change a control's geometry. All color sources are semantic names, never literal preset hexes.

## Numeric zero is not CSS `none`

In [demo.css](demo.css), each receiver re-derives its paint from inherited gate leaves. Each named scope declares **every** recipe gate. The nested child therefore cannot retain a parent's raised-shadow recipe through a higher-specificity ancestor selector. The nested experiment also compares each receiver's computed paint with its isolated scope after removing ancestor preset attributes.

Use a fixed shadow-list slot with its color alpha multiplied by its gate; multiplying blur alone leaves a sharp shadow, and multiplying only offsets leaves the shadow in place. Give every gradient stop an alpha gate; multiplying the gradient angle or stop positions does not remove its fill. Zero-alpha shadows/gradients remain computed list entries but draw nothing in the experiment. That is **paint absence**, not syntax absence.

A filter is different. `brightness(0)` makes ink black; `blur(0)` is a non-none filter and is not a safe identity operation. The checked Chromium changed 50 pixels in light and 57 in dark with `blur(0)` versus `none`. Filter a dedicated optical pseudo/child behind content, gate that layer's opacity, and keep it `pointer-events:none` and out of accessibility. Its content must contain only effect paint, never labels/icons/children. The fixture's zero-opacity filter and backdrop-filter layers match literal removal exactly. See [browser-results.json](browser-results.json). Residual filter computation and stacking still exist; this experiment does **not** prove zero GPU cost or absence of a compositing layer.

Recommendation: numeric gates are the portable paint selector; optional optical nodes may be omitted by a renderer that knows the **resolved** scope. A CSS-only implementation must still render correctly when those nodes exist with opacity zero. Do not require JS merely to select a preset. Do not put filter, backdrop-filter, opacity, isolation, transform or clip changes on an existing content ancestor as the gate: that risks descendants, stacking and nested None. Any new isolation/wrapper in a real component needs task 20's identity proof; the fixture uses identical geometry in both references. Literal `filter:none` remains the off rule for any path that writes a content filter.

## Derivation and scope re-emission

In a future `emit/base.ts`, add `materialDerivations()` to `derivedTokens()`. Input leaves hold angles, lengths, ratios, source switches and per-role strengths. Derived paint holds resolved colors, shadow vectors, gradient stops and optional-layer alphas. In `emit/css.ts`, add Material via AXES and include `[data-area-material-controls]` in re-emission; preserve every existing axis/preference boundary. Recompute actual role paint on the receiver where component tone/state/size slots become known. Never inherit a fully baked receiver recipe from an ancestor.

Current `emitTokens()` emits all defaults at root; `emitAxes()` validates preset output and then re-emits derived values at attributes. `@property` is deliberately leaf-only. Do not register paired colors, shadow strings, gradients, role recipes or derived lengths; no new registrations are needed for the prototype. [css.ts:80–106]({A}packages/tokens/src/emit/css.ts#L80-L106), [css.ts:145–184]({A}packages/tokens/src/emit/css.ts#L145-L184), [base.ts:357–384]({A}packages/tokens/src/emit/base.ts#L357-L384).

Changing only a control value must also recompute: Theme emits a control-boundary marker even when no axis ID changes. For CSS-only consumers, declare the marker with the primitive override. Re-emit at theme, accent, neutral, material, Surface, contrast, type and density boundaries, not only Material boundaries. Receiver-local derivation catches component tone changes that are not Theme axes.

## Decorative color derivation (D5)

Proposed endpoint set: neutral → `fg-default`; accent → `fg-accent`; tone → `fg-<tone>` for info/success/warning/caution/danger/discovery. These are **inputs to decoration**, not permission to assign a new foreground. Example derived base seed: `color-mix(in srgb, var(--area-bg-surface) 92%, var(--area-fg-accent) 8%)`; the percentages are proposal seeds, not measured Area values. A serialized one-hot source selector chooses endpoints with nested `color-mix()` just as action/selection does; the selected endpoint then mixes toward a canonical ground. The data file's source switches are total and validated, so no invalid all-zero source choice reaches CSS.

Generate `--area-material-paint-tint`, `-highlight`, `-shade`, `-glow`, `-stop-1`…`-stop-8` from those endpoints, strengths and current ground. Keep source light/dark pairs until a real color property consumes them. Decorative shadow/rim ink can use the existing neutral ramp and theme-owned `shadow-color`; do not overwrite either. No literal hex palette in Material, no CSS `color`/SVG ink reassignment, and no scaling Action/Selection or invalid/focus paint by material strength. D5 governs **new material decoration**; the pixel-identical Surface migration preserves existing literal colors before any separately approved color change. [REVIEW.md:133]({R}docs/research/astra/materials/REVIEW.md#L133-L133), [base.ts:143–162]({A}packages/tokens/src/emit/base.ts#L143-L162), [THEMING.md:84–92]({A}docs/THEMING.md#L84-L92).

## Row-plate is a role, not another Button

The thirteen serialized IDs in `model.mjs` normalize task 04's spaces and slashes to hyphens: `floating surface` → `floating-surface`, `raised control` → `raised-control`, `recessed field/track` → `recessed-field-track`, `thumb/knob` → `thumb-knob`, `indicator/fill` → `indicator-fill`; the other names are unchanged. This is a serialization mapping, not a new role taxonomy. [04 role vocabulary]({R}docs/research/astra/materials/04-role-map/role-map.json#L10-L24). They include **row-plate** for Menu, Nav, Tree, Table, Select, Command palette and Calendar days, per D6. D16 leaves their spacing, geometry and semantic ink intact. [REVIEW.md:134–135]({R}docs/research/astra/materials/REVIEW.md#L134-L135), [REVIEW.md:153–154]({R}docs/research/astra/materials/REVIEW.md#L153-L154).

A row adapter identifies the existing plate's paint bounds, rest/hover/focus/selected state and ground. Material may add tint, inset relief or a highlight to that plate; it must preserve selection precedence, connected range bands, virtualized-row geometry, full-width table joins and focus. Table paints cells and flush-side extensions; a new per-cell outer shadow would create seams. Calendar's range band and selected endpoint are distinct semantic paints, not independent embossed buttons. [navigation.css:197–215]({A}packages/styles/src/components/navigation.css#L197-L215), [navigation.css:263–270]({A}packages/styles/src/components/navigation.css#L263-L270), [surface.css:1149–1166]({A}packages/styles/src/components/surface.css#L1149-L1166), [calendar.css:89–121]({A}packages/styles/src/components/calendar.css#L89-L121).

Draft strengths: None 0; Glass .25; Tactile .4; Soft .55. These are adjustable prototype defaults, **not permanent caps**. The multiplier affects added decoration only; a selected row remains selected at strength 0. In dense lists, start without per-row backdrop acquisition; that is a proposed performance default pending D14 measurement, not a prohibition. Keep the whole-row plate within the existing row geometry and reuse the parent's already-acquired glass when appropriate.

## Inner rims (D11, D16)

Use the receiver's actual outer shape, not a new Material radius. For uniform corners the inner curve is `max(var(--area-radius-floor), calc(var(--_material-outer-radius) - var(--_material-rim-inset)))`. The adapter supplies the true radius/inset, counting the existing border once. At Sharp the floor is 0; a square outer radius stays square. An explicit pill override remains a pill even at Sharp: D16 prevents Material from undoing the separate pills setting. For elliptical/per-corner radii apply the inset to each radius pair and the element's existing clipping geometry; do not assume one scalar fits all shapes. Suppress a decorative rim when no physical interior remains rather than changing the component's size.

The current radius axis publishes the minimum/concentric inputs and base derives `radius-floor=min(4px,radius-step)`. Card's existing media radius already floors the subtraction. D11 makes that rule binding for new inner rims. [radius.ts:17–18]({A}packages/tokens/src/axes/radius.ts#L17-L18), [base.ts:328–353]({A}packages/tokens/src/emit/base.ts#L328-L353), [surface.css:79–85]({A}packages/styles/src/components/surface.css#L79-L85), [REVIEW.md:145]({R}docs/research/astra/materials/REVIEW.md#L145-L145).

## Text effects are an explicit instance opt-in

Propose `materialEffect="none" | "engraved" | "embossed" | "glow"` **only** for display Text and Button's label slot; default none. Do not add a Theme switch that decorates all labels or SVGs. The adapter paints an extra shadow/highlight around unchanged ink and type, only on the opted-in text node. It never filters the Button ancestor or changes glyph strokes. Reject/no-op with a development warning on ordinary body/small text; changing to Material None suppresses the extra effect even if the instance prop remains. No duotone or gradient-ink API in this launch proposal. [REVIEW.md:147–154]({R}docs/research/astra/materials/REVIEW.md#L147-L154).

Opt-in is not a contrast waiver. A button label may be small, so its effect must pass worst-case paint/focus checks at its real size and be removed under the relevant preference fallback. D13 permits the opt-in; D16 still owns the ink/type boundary. Fallback must retain native text rather than replacing it with pseudo text or hiding it with transparent fill.
''')
save('figma-glass.md','''
# Figma GLASS: verified public API, checked 2026-10-12

The canonical page is [Figma Plugin API — Effect / GlassEffect](https://developers.figma.com/docs/plugins/api/Effect/#glasseffect), not a separate `/GlassEffect/` page. It lists these fields: `type: 'GLASS'`, `visible`, `lightIntensity`, `lightAngle`, `refraction`, `depth`, `dispersion`, `radius`, and optional `boundVariables`.

The documented numeric constraints are 0–1 for lightIntensity/refraction/dispersion and at least 1 for depth. lightAngle uses degrees. **radius** controls Frost. The page does not state length units, maxima for depth/radius, default values, or the angle's origin/direction. It labels the effect beta and says variable binding is unsupported. No `frost` or `splay` property appears in this checked interface. [API documentation](https://developers.figma.com/docs/plugins/api/Effect/#glasseffect), checked 2026-10-12. The public [official typings](https://github.com/figma/plugin-typings/blob/master/plugin-api.d.ts) agree on these names; that moving URL is corroboration, not a SHA pin. GitHub's commit API returned HTTP 403, so no typings commit is claimed.

## Area mapping — proposal, not Figma equivalence

Use labels **Light angle, Light intensity, Refraction, Depth, Dispersion, Frost**. Keep their verified field spellings in the public control data: shared `lightAngle` plus `glass.lightIntensity`, `.refraction`, `.depth`, `.dispersion`, `.radius`. An eventual Figma exporter combines the shared angle with the glass object; it must not serialize `frost`, `splay`, Area's shadow controls or `lightHeight` into GLASS.

Area defines light angle **0° at the top, clockwise** because D9 says so; this is not asserted as a Figma API promise. Thus 90° means light from the right, 180° bottom, 270° left. Cast displacement points away from it: `x=-d*sin(angle)`, `y=d*cos(angle)`, with `d=opticalDepth*cos(lightHeight)` for this proposed projection. Highlights point toward the light. [D9]({R}docs/research/astra/materials/REVIEW.md#L143-L143). Figma import/export needs an explicit verified orientation adapter rather than assuming the same convention.

Frost is approximated by CSS `backdrop-filter:blur(radius)` on the optical backing layer. That is a renderer approximation, not a promise of matching Figma's kernel or pixels. Glass depth is a reserved refraction control, **not** Area's raised/recessed `opticalDepth` and not layout thickness. D8 launches frost plus rim; refraction and dispersion are retained as zero-valued reserved fields and rejected when nonzero until the later enhancement exists. `glass.depth` can be stored but has no first-release visual effect. Do not silently present disabled controls as functioning. [D8]({R}docs/research/astra/materials/REVIEW.md#L141-L142).

Use Figma's constraints as import validation where explicit. Area's additional units, defaults and finite caps appear in controls.json as development proposals. Any UI property found in a different Figma surface requires its own verified schema/version before export; do not invent a plugin property based on a label or third-party tutorial.
''')
save('controls-and-theme.md','''
# Typed controls and Theme — proposal

The public interface sketch is [api-proposal.ts](api-proposal.ts). It extends the existing `Theme.value` with `material`; **do not add a second competing preset prop**. `materialControls` carries a versioned patch, and `materialEffect` is an instance opt-in only on supported text slots. D2/D3 put Material beside Surface with typed continuous controls after presets. D16 forbids geometry/type/ink changes inside Material. [REVIEW.md:124–130]({R}docs/research/astra/materials/REVIEW.md#L124-L130), [REVIEW.md:153–154]({R}docs/research/astra/materials/REVIEW.md#L153-L154).

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

The following values are **proposed development envelopes and starter defaults**, not Figma defaults, Area measurements, contrast guarantees, device budgets or binding D3 caps. D3 requires calibration against the board and contrast tests at the extremes before shipping. Broad draft ranges allow expression; a renderer must still choose a safe fallback for an unsafe combination. No existing contrast floor changes. D14 supplies no calibrated blur/layer budget yet. [REVIEW.md:128–130]({R}docs/research/astra/materials/REVIEW.md#L128-L130), [REVIEW.md:149–150]({R}docs/research/astra/materials/REVIEW.md#L149-L150).

{CONTROL_LIST}

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

Today Theme stores only `AxisSelection` in its context. It merges axes and emits a complete attribute map. `pills` is a separate prop: its attribute is written on that div, but the set is never put into the context. Therefore descendants in the same DOM inherit pill flags, while a new `<Theme>` in a portal receives the axes but cannot reconstruct a custom pills set from that context. `useTheme()` also does not return pills. [Theme.tsx:5–32]({A}packages/react/src/components/Theme.tsx#L5-L32), [THEMING.md:115–124]({A}docs/THEMING.md#L115-L124).

Propose an internal `ResolvedThemeScope` containing `{axes, materialControls, surfaceControls, pills}`. Keep `useTheme()` backward-compatible as the axis-only public return; expose a separate internal scope hook/bridge for portal hosts. Resolve Material once, store the full validated result and provenance, and serialize all effective primitive leaves at every React Theme boundary. A portal bridge consumes this context and writes the same attributes and numeric controls on its new DOM root. **It must not run the ordinary explicit-preset reset algorithm on the resolved snapshot**, or the portal will lose its parent's custom values. A user-authored Theme inside that bridge can then intentionally reset.

For pills, normalize omitted→inherited effective set, `[]`→empty set, provided list→validated exact set, and emit that resolved set at a portal root. This is a proposed repair bundled with scope plumbing, not an assertion that current pills already cross portals. Existing `pillsAttribute()` validates allowed names and `themeAttributes()` knows only axes. [config.ts:38–49]({A}packages/tokens/src/emit/config.ts#L38-L49).

Context does not automatically paint a portal. Use the internal bridge for every portaled overlay; adding Material to context without re-emitting CSS is incomplete. Native top-layer promotion retains DOM ancestry, whereas an actual React portal changes it; distinguish them in tests. A portal entering a raw CSS-only host still needs the host's theme snapshot explicitly, as current docs require. Never infer that React context has read arbitrary DOM attributes. [THEMING.md:119–126]({A}docs/THEMING.md#L119-L126).

## Emission order and required implementation tests

Resolve axes → detect Material/Surface reset boundaries → validate current patches → produce complete primitive leaves → serialize attrs/inline leaves → re-derive base paint → consume receiver tone/state/size. Generate config types/defaults from the registry, and control types/bounds from one schema; do not maintain unrelated React and JSON vocabularies. Today's config emitter already derives `AxisSelection` from registry presets. [config.ts:54–74]({A}packages/tokens/src/emit/config.ts#L54-L74).

Acceptance must include preset switches while mounted, same-preset reset, deletion of controls, local mode/accent changes, raw DOM scopes, portal bridges, two nested portals, pills empty/custom sets, server/client hydration and absence of stale inline keys. Add bounds/enum/unknown-key tests to the real public validator. The model and CSS fixture here cover only the explicitly recorded subset. Full-gallery None identity and material contrast/fallback tests from task 20 remain separate gates.
'''.replace('{CONTROL_LIST}','\n'.join('- `'+name+'`: '+str(b['min'])+'…'+str(b['max'])+' '+b['unit']+'; defaults **None / Glass / Tactile / Soft** = '+ ' / '.join(str(json.loads((H/'controls.json').read_text())['seeds'][p][name]) for p in ['none','glass','tactile','soft'])+('. Reserved/deferred; see Figma mapping.' if b.get('deferred') else '.') for name,b in json.loads((H/'controls.json').read_text())['bounds'].items())))
save('surface-split.md','''
# Surface decomposition — pixel-identical first

## What is being split

Keep the existing four Surface IDs, default Outlined, border-width, shadow-1…4, Card halo and floating lift. Extract each lobe into **x, y, blur, spread, color** leaves plus a fixed inset/outset recipe tag; preserve lobe order. A missing blur/spread becomes explicit zero only if the computed and pixel comparison agrees. Never collapse inset and outset lobes, substitute drop-shadow, change rounding, or flatten a theme pair. [surface.ts:15–82]({A}packages/tokens/src/axes/surface.ts#L15-L82).

[surface-parts.json](surface-parts.json) is the complete proposed split: **32 recipes = 4 Surface presets × 8 consumers** (four ladder slots, Card, float, Tooltip, Toolbar). It contains the original literal string, each part, token map and recomposed expression. The source strings are loaded from pinned Area, not retyped from an image. Token names are `--area-surface-part-<consumer>-<lobe>-x/y/blur/spread/color`; the exact composed aliases remain `--area-shadow-1`…`4`, `-card`, `-float`, plus proposed `-tooltip` and `-toolbar`. These additional names are collision-checked with the real registry. [surface-axis-proposal.json](surface-axis-proposal.json) supplies a complete total token map for each Surface preset: Flat carries dormant Outlined part values but retains literal `none` for its original six aliases. Every preset therefore has the same key set, including dormant leaves; the actual registry accepts the complete proposed maps.

Examples retained exactly: Outlined shadow-1 has x 0, y .5px, blur 1px, spread −.5px and theme-owned shadow-color. Card retains its two 3% black light-mode lobes and transparent dark lobes. Float retains 20px/24px and 5px/8px geometry with its half-strength second lobe. These are existing values, not Material defaults. [surface.ts:15–18]({A}packages/tokens/src/axes/surface.ts#L15-L18), [surface.ts:43–54]({A}packages/tokens/src/axes/surface.ts#L43-L54).

## Move the two literal exceptions without changing Flat

Tooltip currently has a 0/4/12/−2 cast using shadow-color followed by an inset dark-only 5% white ring at **stroke-width**. Toolbar's surface variant has a dark decorative inset ring at **border-width**, then a .5px/18% halo, 3px/8px/10% cast and 1px/3px/10% cast. Toolbar plain remains `none`. Preserve those distinctions, colors, implicit zero spreads and ordering. [surface.css:1395–1400]({A}packages/styles/src/components/surface.css#L1395-L1400), [toolbar.css:8–10]({A}packages/styles/src/components/toolbar.css#L8-L10), [toolbar.css:27–35]({A}packages/styles/src/components/toolbar.css#L27-L35).

Future component edits would replace only those two declarations with `var(--area-shadow-tooltip)` and `var(--area-shadow-toolbar)`. Every Surface preset initially supplies their **same existing recipes**. Flat's existing six token shadows stay literal `none`, but Tooltip and surface Toolbar stay drawn because that is today's output. Making Flat remove these exceptions is a separate visible policy change; doing it inside D2's migration would contradict pixel identity. Elevated still sets border-width 0, so only Toolbar's decorative inset ring changes with it; Tooltip's required-width inset stays at stroke-width. D2 asks for relocation and adjustable structure, not a silent exception cleanup. [D2]({R}docs/research/astra/materials/REVIEW.md#L124-L127).

## Make the parts adjustable without freezing nested controls

Recommendation: Surface owns all base lobe leaves, recipe topology and legacy alias names. Material may **read** the Surface defaults when choosing its extra relief, but cannot write Surface's namespace. New Material shadow controls apply to added material casts; changing the existing baseline elevation is an explicitly separate Surface control action. None thus adds no paint, while still respecting a deliberately customized Surface.

For a later `surfaceControls` proposal, address a specific consumer and lobe, with typed signed CSS-pixel x/y/spread, nonnegative blur and a bounded alpha multiplier; do not expose arbitrary shadow CSS strings. Defaults are exactly the per-preset leaves in the data file, alpha multiplier 1. Proposed development bounds: x/y/spread −128…128px, blur 0…128px, multiplier 0…2; validate resulting alpha in 0…1. These are uncalibrated envelopes, not current Area API. Inset/outset, lobe count and semantic color ownership are structural, not numeric knobs. Required inset rings do not become optional alpha-controlled decoration.

A custom property substitutes referenced variables at its declaration site. Merely moving the old string to root and changing a part on a child freezes the old alias. Use one `surfaceRecipes(preset)` composer for each total preset map, and **re-emit the appropriate recipe at every scope that overrides Surface parts**. React's resolved scope knows the effective Surface preset and must stamp it plus all effective part overrides on that scope. A CSS-only Surface-parts override must name `data-area-surface="<effective preset>"` at the same boundary; unsupported naked leaf overrides are not promised. Current preset emission then selects the exact topology (including literal `none`) while local leaves resolve there. Material-only parameters never mutate inherited Surface leaves.

Retain color pairs until consumption, and include relevant cross-axis color derivation boundaries. On a portal bridge, serialize the effective Surface parts as well as the preset; otherwise the full attribute map will restore defaults and lose custom parts. A later generalized CSS-only raw-part API would need additional receiver-local composition or a proven conditional mechanism; don't claim ordinary inherited string aliases already provide it. [css.ts:44–51]({A}packages/tokens/src/emit/css.ts#L44-L51), [css.ts:145–184]({A}packages/tokens/src/emit/css.ts#L145-L184), [THEMING.md:84–104]({A}docs/THEMING.md#L84-L104).

## What the local experiment proves

`build.mjs` decomposes all originals; `verify-browser.mjs` puts the original and recomposed recipe on the **same box at the same position**, in each mode, using light-dark pairs and the selected border width. All **64 comparisons have zero changed pixels and identical computed box-shadow strings** on Chromium 155.0.4283.45. Flat retains `none` for the original six roles. [browser-results.json](browser-results.json).

This establishes identity of these literal decompositions on the fixture. It does not establish identity of edited Area components, reparented DOM, focus states, nested overrides, CSS bundling, native widgets or another engine. Before touching production, follow [task 20's full-gallery protocol](../20-limits-and-none/none-and-proof.md), rerun unchanged contrast tests, and add Surface-part scope/portal tests. No package edits or existing tests were made here.
''')
save('verification.md','''
# Executed verification and remaining boundary

Source: Area **4ea50618cf19e8737b607c9f983f64dd310d921d**. Run date 2026-10-12. Engine **Chromium 155.0.4283.45** via installed Edge, headless macOS, viewport 1200×1100, DPR 1. Full environment, input hashes and computed results are in [browser-results.json](browser-results.json). The script serves only this folder and closes its own browser/server.

## Results

- **8 nested cases:** None → Tactile → Glass → explicit None, each in light and dark. Expected gate vectors, host filter none, optical-layer opacity and computed paint matched the same scope with its ancestor preset attributes removed.
- **8 successful gate-off comparisons:** alpha-gated shadow, every-stop-alpha gradient, isolated filter paint with opacity zero, and isolated backdrop-filter paint with opacity zero; each in light/dark. Each off state has **0 changed pixels** versus literal removal. Every on state differs, so these are not blank fixtures.
- **8 deliberate failing cases:** zeroing only inset blur, gradient angle, brightness, or blur on the content element. They remain distinguishable from literal off. In particular `blur(0px)` changes **50 light / 57 dark pixels** in this fixture; that is a local rendering observation, not a universal pixel count or root-cause diagnosis.
- **64 Surface comparisons:** every 32 original/split recipe pair in both modes has **0 changed pixels**, and computed box-shadow strings agree. Token-valued spread in Tooltip/Toolbar stays a length, not a color.
- The pinned registry accepts the proposed Material plus Surface namespace additions and rejects an intentionally broad shadow namespace. The data resolver checks control inheritance, preset resets, serialized remount and invalid values. It is not React runtime or a real portal.

Inspected the rendered full demo screenshot for nested scope labels, reset appearance and comparison controls. Raw screenshots are ignored under `.capture/`; no personal content or product captures are included.

## Interpretation

This is a bounded mechanism proof on authored diagnostic boxes. Colors/dimensions in demo.css are fixture inputs, not adopted Area recipes; the prototype imports no production CSS and does not claim to render calibrated Glass/Tactile/Soft. The separate Surface fixture uses the actual pinned shadow strings and a diagnostic canonical ground/edge.

A zero-alpha computed shadow or gradient can remain in the property list without drawing. Likewise, an opacity-zero filtered pseudo can retain filter/compositor state. Do not turn pixel absence into a performance claim. For real None, leave the content's filter/stacking/geometry alone and prove any added optical wrapper is inert. Reduced-transparency and forced-colors must explicitly remove acquisition and supply the approved opaque fallback; this prototype does not implement those production policies.

Not executed: full gallery, production package build/test suite, React portal integration, native Windows forced colors, assistive technology, Safari, Firefox, full role/preset contrast or performance budgets. These remain implementation acceptance work. Current tests were not weakened or changed.
''')
print('PASS: authored proposals match.' if '--check' in sys.argv else 'Wrote proposal reports.')
