**Question:** How should every style from task 01 paint every material role from task 04, how much should each role absorb, and where do family context and nesting require limits?

**Answer:** The proposal supplies **300 style–role recipes: all 25 styles × all 12 roles**.
Each cell names layer-model channels and a **None / Trace / Quiet / Full** absorption cap; these are operational design limits, not invented opacity or blur measurements.
Dense reading, editing, code and literal color data remain calm; stronger material character belongs to selected shells and handles rather than every descendant.
**16 shared context guards** account for the exceptions across all **78 reviewed manifest contracts**, including Table rows, CodeBlock, Message, Calendar days and Slider.
Nesting rules give shared glass one backdrop owner, preserve a real overlay as a separate surface, and make recessed wells relative to their immediate raised parent.
Surface retains elevation ownership; required state paint and semantic ink win over decoration. All recipes remain unreviewed research.

**Snapshot:** checked **2026-10-08** (America/Los_Angeles), after `git fetch origin`. Area `origin/main`: [`6f896789a5200bcbd34fe87de458e60ca82141d6`](https://github.com/ethanwongwork/area/tree/6f896789a5200bcbd34fe87de458e60ca82141d6). Research input: [`79f76ea0557d201777c29de1a8626c20bbc67575`](https://github.com/ethanwongwork/area/tree/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials), containing the brief and tasks 01, 03 and 04. Task 04 uses this same Area snapshot. Task 03's older Area/browser evidence is retained as historical technique research; this report re-pins the relevant current Area constraints and does not assert an updated browser-support survey. No production changes, new product captures, rendering measurements or owner approval.

## Evidence and deliverables

- [Style-by-role recipes](recipes.md): amount overview followed by twelve concrete role treatments for each of the 25 styles. Each style points to its pinned task 01 definition and task 03 technique sections; recipes themselves are explicitly authored proposals.
- [Absorption and nesting policy](policy.md): operational amount definitions, role limits, precedence, fifteen nesting cases, channel-combination rules, and seven worked resolutions using the same common rules.
- [Family exceptions and full coverage ledger](family-exceptions.md): all 78 contracts, the applicable context guards, why the role alone does not resolve them, and source lines for the affected current parts. These are reusable limits, not 78 different material recipes.
- [absorption.json](absorption.json): the same 300 cells, 16 guards, family ledger, source pins and immutable input checksums. Under 1 MB.
- [build.py](build.py): deterministic generator and validator, using [authored recipes](recipes.py) and [guard definitions](guards.py). It reads prior research with `git show` at the input commit and writes only this topic's generated files.

A source pin proves the existing style definition, technique, part or constraint; it does **not** prove the recommended amount is a vendor constant or that the proposal passes a visual test. No unknown native acrylic/Liquid Glass shader numbers, CSS performance budgets or approved Area preset values are filled in by inference.

## Main decisions

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

1. **Adopt the amount scale and guard precedence for subsequent research.** Alternative: apply one visual preset uniformly to every role. Recommendation: keep the common role recipe and lower/suppress specific channels in dense, semantic or shared contexts; the pinned anatomy shows why a universal application would duplicate paint or change meaning.
2. **Keep future optical controls beside Surface, not in competition with it.** Surface remains the single owner of border width and cast-elevation tokens; this work adds no axis or public token. Local body/reflection/texture/emission inputs would be derived with semantic context, re-emitted at scope boundaries and left unregistered when derived/paired. [Surface ownership](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/surface.ts#L21-L81), [namespace and derivation rule](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/DESIGN_SYSTEM.md#L24-L27).
3. **Calibrate numbers after selecting role/context pairs.** Start with the worked examples in the policy, then test actual body/ink/edge paint, theme scopes and nesting. Keep current contrast floors and fixed hover ink. [Contrast requirements](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/CONTRAST.md#L7-L17), [state and focus requirements](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/CONTRAST.md#L32-L64).

## Open questions

- Which style/role pairs should receive owner review and numeric calibration first? The policy deliberately does not treat an ordinal cap as a tested opacity or shadow range.
- Is a constrained neumorphic/clay translation acceptable while existing elevation and corner policy stay fixed, or should a later task propose an explicit contract change?
- Which content metadata should distinguish a reading plane, literal color/quantitative signal, shared shell and rare display inscription? These guards name responsibilities, not new required DOM attributes.
- Which supported optical implementation and fallback can satisfy each selected style in real nested layouts? Task 03's known limitations remain; this report neither expands browser support nor measures performance.
