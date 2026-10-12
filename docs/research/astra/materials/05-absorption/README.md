**Question:** How should every style from task 01 paint every material role from task 04, how much should each role absorb, and where do family context and nesting require limits?

**Answer:** **25 styles × 13 roles = 325 cells** now cover all **101 contracts** at current main. The D6 `row-plate` cells share state/focus responsibilities across rows and hover plates. There are **23 context guards**, including all six missing review guards and a new diagnostic/data-extent guard; 100 contracts need at least one. Drawer is modal by default. Surface owns the shadow token namespace but does not yet own every literal component shadow. Historical ordinal ceilings remain visible and are **superseded by D1/D3/D14**; numeric strengths await calibration, not invented here.

**Snapshot:** 2026-10-11; Area `9036ed9293beb7a867bdf637ee768c7a46a9901a`. Current anatomy input is sibling 04's hashed role-map at the same task-19 revision. Older taxonomy/technique citations retain their immutable research input. Proposals and owner decisions are distinguished from measured/current paint.

<!-- task19-changes -->
## Changes after review — 2026-10-11

Task 19 corrections, with the reason from [Corrections for Astra and D1–D16](../REVIEW.md). Older Answer/Snapshot passages below retain their original date and findings unless explicitly refreshed; the changes here and decision callouts govern subsequent work.

- **C08 — Review reason:** Anatomy and role coverage must follow refreshed 04. **Change:** Expanded 25 styles to 13 roles (325 cells), all 101 contracts and 23 shared guards. Strength multipliers are explicitly uncalibrated, not fabricated numbers. Files: [recipes.py](recipes.py), [recipes.md](recipes.md), [absorption.json](absorption.json), [family-exceptions.md](family-exceptions.md). Decisions: D1, D3, D6, D14.
- **C09 — Review reason:** Drawer is modal by default. **Change:** Corrected Drawer default context and its scrim/opaque fallback responsibilities from current React/spec sources. Files: [guards.py](guards.py), [family-exceptions.md](family-exceptions.md), [policy.md](policy.md). Decisions: D7.
- **C10 — Review reason:** Surface does not own every existing literal shadow. **Change:** Separated namespace ownership from actual component paint; pinned Toolbar/Tooltip literal shadows and recorded D2 migration as later work. Files: [policy.md](policy.md), [guards.py](guards.py). Decisions: D2.
- **C11 — Review reason:** Six guards were missing. **Change:** Added cutout rings, fixed-colour fades, translucent washes, list focus via row plate, solid emphasis fills and once-only disabled group opacity; mapped current source parts/families. Added diagnostic/data-extent guard for newer contracts. Files: [guards.py](guards.py), [family-exceptions.md](family-exceptions.md). Decisions: D6, D7, D12, D16.

Full change ledger and verification: [19-corrections](../19-corrections/README.md).
<!-- /task19-changes -->

## Evidence and deliverables

- [Style-by-role recipes](recipes.md): amount overview followed by thirteen concrete role treatments for each of the 25 styles. Each style points to its pinned task 01 definition and task 03 technique sections; recipes themselves are explicitly authored proposals.
- [Absorption and nesting policy](policy.md): operational amount definitions, role limits, precedence, fifteen nesting cases, channel-combination rules, and seven worked resolutions using the same common rules.
- [Family exceptions and full coverage ledger](family-exceptions.md): all 101 contracts, the applicable context guards, why the role alone does not resolve them, and source lines for the affected current parts. These are reusable limits, not 101 different material recipes.
- [absorption.json](absorption.json): the same 325 cells, 23 guards, family ledger, source pins and immutable input checksums. Under 1 MB.
- [build.py](build.py): deterministic generator and validator, using [authored recipes](recipes.py) and [guard definitions](guards.py). It reads historical taxonomy/techniques with `git show` and the refreshed sibling 04 role map by content hash and writes only this topic's generated files.

A source pin proves the existing style definition, technique, part or constraint; it does **not** prove the recommended amount is a vendor constant or that the proposal passes a visual test. No unknown native acrylic/Liquid Glass shader numbers, CSS performance budgets or approved Area preset values are filled in by inference.

## Main decisions

<!-- task19-superseded 05-absorption/README.md ## Main decisions -->
> **Superseded policy — D1, D3, D6, D14 (owner, 2026-10-11):** Area’s calm no-cast/Trace-only expression is the None default, not a material ceiling. Contrast, focus, fixed hover ink and semantic meaning remain hard limits. Ordinal caps and provisional control ranges are not limits. Numeric per-role strength multipliers and bounds must be calibrated to the board and contrast-tested at extremes; that work is pending tasks 20–22. The current vocabulary has 13 roles including row-plate; 04/05 now cover 101 contracts. Historical 12-role/78-contract counts below describe their original snapshot only. Performance rules must follow measured workloads, not universal no-row-blur/static-only caps. Owner names a 60Hz minimum device; a later rerun includes Firefox. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

**Absorption is not opacity.** A Trace glass control retains a quiet tint or rim while dropping its independent blur; it is not a Full glass recipe rendered at a tiny overall opacity. A None text role keeps readable ink and removes extra treatment. The distinction follows task 01's separation of [body, content and target-specific filters](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/layer-model.md#L25-L46), and task 03's [body-alpha versus group-opacity boundary](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L135-L148). The four absorption levels are new **proposed policy**, not a replacement layer taxonomy.

**Text-dense families constrain the recipe, not merely its strength.** Table rows keep flat state plates; CodeBlock keeps an unchanged code reading ground and semantic syntax/diff rails; Message keeps prose clear; Calendar preserves connected range fills and separate markers; Slider preserves exact track, fill and thumb geometry. Their [current parts and the resulting shared guards](family-exceptions.md) are pinned individually. A stronger material can remain on an eligible surrounding shell without entering those protected regions.

**Nesting needs explicit ownership.** A field group already removes child field chrome, and DatePicker already uses a plain Calendar inside Popover. The recommended material rule is to preserve those boundaries: one shared shell, then independently legible local parts. [InputGroup](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L57-L92), [DatePicker](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/DatePicker.tsx#L119-L140). Glass-in-glass is therefore not permission for a new blur/alpha stack on every nested container. Recess-in-raised shares a light rig but gives the well a local concave profile; its thumb can remain locally convex.

**Some named styles cannot survive every constraint unchanged.** Classic neumorphic external light/dark lobes conflict with Area's in-flow no-shadow and dark-halo rules; native Mica acquisition and Apple lensing are not provided by the cookbook's ordinary web primitives; skeuomorphism still needs a declared physical referent. The matrix labels these constrained translations or gaps rather than promising native or historical fidelity. [Existing elevation policy](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/DESIGN_SYSTEM.md#L156-L165), [dark policy](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/DESIGN_SYSTEM.md#L272-L278), [cookbook acquisition/refraction limits](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L135-L165).

The context split is also consistent with Area's source baseline: inspector tools, conversation surfaces and content/navigation use different product references. That supports preserving their different reading and interaction jobs; it does not supply numerical material amounts. [BASELINE context policy](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/research/BASELINE.md#L9-L19).

## Validation and reproduction

```sh
python3 docs/research/astra/materials/05-absorption/build.py --check
```

Requires Python 3, Git and the two pinned commits already fetched; no network or package installation. Omit `--check` to regenerate. The validator checks exact style/role coverage against task 01/04, layer and amount enums, all guard part/family references, every family in the input map, source line bounds, local links, deterministic generated output and the per-file 1 MB cap. Input content hashes make the inherited evidence snapshot explicit. It does not execute a CSS renderer or validate proposed numerical values—none are assigned here.

The inputs are immutable on purpose. A future update must review current anatomy, source pins and recipe constraints before changing the input commits; it must not relabel old proposals as verified new behavior. Browser compatibility, rendered contrast, assistive technology and frame-time remain the later tasks' work.

## Proposals

<!-- task19-superseded 05-absorption/README.md ## Proposals -->
> **Superseded policy — D1, D2, D3, D6, D14 (owner, 2026-10-11):** Area’s calm no-cast/Trace-only expression is the None default, not a material ceiling. Contrast, focus, fixed hover ink and semantic meaning remain hard limits. Material sits beside Surface; recipe structure switches with inherited 0/1 gate tokens. Surface shadows require a pixel-identical split into adjustable parts, including Tooltip/Toolbar literal exceptions. Selector-switched recipes alone are not nested-scope safe. Ordinal caps and provisional control ranges are not limits. Numeric per-role strength multipliers and bounds must be calibrated to the board and contrast-tested at extremes; that work is pending tasks 20–22. The current vocabulary has 13 roles including row-plate; 04/05 now cover 101 contracts. Historical 12-role/78-contract counts below describe their original snapshot only. Performance rules must follow measured workloads, not universal no-row-blur/static-only caps. Owner names a 60Hz minimum device; a later rerun includes Firefox. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

1. **Adopt the amount scale and guard precedence for subsequent research.** Alternative: apply one visual preset uniformly to every role. Recommendation: keep the common role recipe and lower/suppress specific channels in dense, semantic or shared contexts; the pinned anatomy shows why a universal application would duplicate paint or change meaning.
2. **Keep future optical controls beside Surface, not in competition with it.** Surface remains the single owner of border width and cast-elevation tokens; this work adds no axis or public token. Local body/reflection/texture/emission inputs would be derived with semantic context, re-emitted at scope boundaries and left unregistered when derived/paired. [Surface ownership](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/surface.ts#L21-L81), [namespace and derivation rule](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/DESIGN_SYSTEM.md#L24-L27).
3. **Calibrate numbers after selecting role/context pairs.** Start with the worked examples in the policy, then test actual body/ink/edge paint, theme scopes and nesting. Keep current contrast floors and fixed hover ink. [Contrast requirements](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/CONTRAST.md#L7-L17), [state and focus requirements](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/CONTRAST.md#L32-L64).

## Open questions

<!-- task19-superseded 05-absorption/README.md ## Open questions -->
> **Superseded policy — D1, D2, D3 (owner, 2026-10-11):** Area’s calm no-cast/Trace-only expression is the None default, not a material ceiling. Contrast, focus, fixed hover ink and semantic meaning remain hard limits. Material sits beside Surface; recipe structure switches with inherited 0/1 gate tokens. Surface shadows require a pixel-identical split into adjustable parts, including Tooltip/Toolbar literal exceptions. Selector-switched recipes alone are not nested-scope safe. Ordinal caps and provisional control ranges are not limits. Numeric per-role strength multipliers and bounds must be calibrated to the board and contrast-tested at extremes; that work is pending tasks 20–22. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

- Which style/role pairs should receive owner review and numeric calibration first? The policy deliberately does not treat an ordinal cap as a tested opacity or shadow range.
- Is a constrained neumorphic/clay translation acceptable while existing elevation and corner policy stay fixed, or should a later task propose an explicit contract change?
- Which content metadata should distinguish a reading plane, literal color/quantitative signal, shared shell and rare display inscription? These guards name responsibilities, not new required DOM attributes.
- Which supported optical implementation and fallback can satisfy each selected style in real nested layouts? Task 03's known limitations remain; this report neither expands browser support nor measures performance.
