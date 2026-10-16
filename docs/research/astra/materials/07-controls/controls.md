# Proposed control contract

**Everything in this document is an authored proposal.** The input vocabulary and constraints are pinned in [E01](evidence.md#e01-research-inputs), with current implementation limits in [E02–E08](evidence.md#e02-registry-contract). Units, validation domains and neutral identities below define an API, not calibrated defaults or measured browser limits. “Global” means inherited within the nearest material scope, not a document-global registry or a mutation of component state.

## Control organization

Expose a recipe selector, an absorption cap, then grouped controls for lighting, body, edge, relief/cast, emission, texture and reflection. An advanced layer editor addresses named layers within those groups. Do not expose the taxonomy's twenty-five names as a mutually exclusive set: grain can accompany glass; gradient stroke can accompany paper. A compiled profile combines channels and declares permitted role recipes. Task 13 can choose shipping names; this report uses `none` for identity and `frosted` as a hypothetical profile in examples.

Use these proposed identifiers:

- `M(x)` = Material input `--area-material-<x>`.
- `S(x)` = Surface input `--area-surface-<x>`.
- `P(x)` = unregistered derived output `--area-paint-<x>`, emitted only by shared derivation code.
- Role keys: `page`, `container`, `floating-surface`, `raised-control`, `recessed-field-track`, `thumb-knob`, `indicator-fill`, `divider`, `edge`, `glyph`, `text`, `scrim`.

Role keys normalize task 04's labels for identifiers; they do not change their meaning. Separate **requested** values from **effective** values in an editor. A request suppressed by a dense-reading guard remains inspectable with a reason, such as “backdrop blur owned by enclosing Popover.” Never present a control as effective merely because its CSS property exists.

## Global controls and token mapping

<!-- task19-superseded 07-controls/controls.md ## Global -->
> **Superseded policy — D2, D3, D9, D16 (owner, 2026-10-11):** Material sits beside Surface; recipe structure switches with inherited 0/1 gate tokens. Surface shadows require a pixel-identical split into adjustable parts, including Tooltip/Toolbar literal exceptions. Selector-switched recipes alone are not nested-scope safe. Ordinal caps and provisional control ranges are not limits. Numeric per-role strength multipliers and bounds must be calibrated to the board and contrast-tested at extremes; that work is pending tasks 20–22. Figma Glass parameter names govern the next API. Light angle is 0 at top, clockwise; the historical 0-at-right angle convention below is superseded, not silently reinterpreted. Material does not change geometry, typography or foreground ink. Multi-axis choices are bundles, not a material axis. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

The table is a proposed control-to-leaf contract. `*` below means a named compiled layer or role, not a literal CSS token. Structural choices compile to static rules; CSS variables are numeric/paint inputs, not an imaginary runtime `if` language. Option B moves these Material inputs into Surface's optical namespace without changing their semantics.

| Control / layer-model channel | Proposed API and units | Input / owner | Resolution and limits |
| --- | --- | --- | --- |
| Light angle / `illumination.key` | `light.angleDeg`, finite degrees, normalized modulo 360 | `M(light-angle)` | One shared key azimuth; proposed convention 0 points right, 90 down in screen coordinates. It points **toward** the light. Cast displacement points away. No automatic RTL mirroring of a physical light. |
| Light height / `illumination.key` | `light.heightDeg`, 0…90 degrees above surface | `M(light-height)` | 0 is grazing, 90 normal to plane. This is elevation angle, not CSS height or a point light's world-space distance. A finite artistic model, not native/physical optics. |
| Ambient / `illumination` | `light.ambient`, normalized 0…1 coefficient | `M(light-ambient)` | Controls intrinsic shade contrast; does not lighten page tokens or semantic ink. Reflection and emission remain separate sources. |
| Local depth / `spatial.relief` | `relief.profile: flush\|convex\|concave`; `relief.depthPx >= 0` | `M(relief-depth)` plus compiled profile | Models body rim/inset, without moving layout, changing radius, hit area, z-index or task 04 relationship. Sign comes from profile, not a negative depth. |
| Cast lift / `shading.cast` | `surfaceControls.liftGain >= 0` | `S(lift-gain)` | Scales permitted shadow displacement. Does not create a tier on a part with no cast. Default compatibility identity is 1. This is distinct from relief depth and DOM stacking. |
| Cast light coupling | `surfaceControls.direction: source\|key` | Surface structure plus `S(cast-key-weight)` as 0/1 | Source preserves existing per-lobe offsets; key opts into common illumination. Never infer a physical angle from old shadow strings. |
| Shadow softness | `surfaceControls.softnessGain >= 0`; `relief.softnessPx >= 0` | `S(softness-gain)`; `M(relief-softness)` | Cast gain acts on each source lobe's blur; intrinsic softness acts on inset modeling. Zero blur remains zero unless that named layer is explicitly edited. Do not blur text/content. |
| Shadow spread | `surfaceControls.spreadDeltaPx`, signed; `relief.spreadPx`, signed | `S(spread-delta)`; `M(relief-spread)` | Add spread per eligible cast lobe or inset layer. Keep contact/ring masks separate; a ring drawn with box-shadow is an edge and ignores cast controls. Clipping/geometry caps may constrain requests. |
| Shadow strength | `surfaceControls.strengthGain >= 0`; `relief.strength` 0…1 | `S(strength-gain)`; `M(relief-strength)` | Scale existing cast alpha and clamp the result to 0…1; do not replace Theme's shadow ink. Inset shading separately mixes local body/semantic shade endpoints. Flat remains disabled even for nonzero gain. |
| Glow strength / `emission` | `glow.strength` 0…1 | `M(glow-strength)` | Alpha/energy envelope of optional halo; the opaque semantic core is separate. Zero removes the halo, not selection/focus/status. No global text glow. |
| Glow colour source | `glow.source: context\|action\|selection\|tone\|decorative`; optional explicit color pair for decorative | Compiled source selector, `M(glow-custom-light/dark)` for literal colors | `context` follows the receiver's semantic source. `tone` resolves the receiver's declared tone, not global accent. Explicit colors only for nonsemantic decoration. Derive `P(glow-*)` locally; never overwrite `fg-*` or `*-solid`. |
| Glow shape | `glow.placement: inner\|outer\|both`; `glow.spreadPx`, `glow.softnessPx >= 0` | Compiled masks; `M(glow-spread/softness)` | Emission follows emitter shape, not the light's azimuth. Supplementary bloom must not change quantitative fill extent or cover required marks. |
| Gradient kind and target / `body.paints`, `edges`, `reflection`, `emission` | Named layer with target and kind `linear\|radial\|conic\|mesh` | Compiled recipe structure | A body gradient and gradient stroke have independent layer IDs. A gradient is not necessarily reflection. Mesh is an advanced declared asset/control-point recipe, not a linear gradient with extra stops. |
| Gradient stops | `gradients[layer].stops[]`: stable ID, position, color source, alpha | `M(gradient-<layer>-stop-<id>-position/alpha/custom-light/custom-dark)` plus source selector | Linear/radial positions 0…100%; conic positions 0…360deg. Nondecreasing order; equal positions allowed for hard stops. Resolve semantic stop colors at the painted receiver. Atomic replacement of a stop list; never array-index deep merge. Runtime structural editing limit is specified in architecture. |
| Gradient angle / coordinates | `gradients[layer].angleDeg`; radial center/radii; conic origin; mesh points | `M(gradient-<layer>-angle/center-x/center-y/...)` | Angle uses CSS gradient convention in exported CSS; distinct from key-light convention. Recipe must explicitly opt into light-following orientation with a documented conversion. Radial/mesh controls cannot be reduced to one angle. |
| Stroke mode / `edges` | `stroke: {coverage, paint, profile}`; coverage `none\|all\|top\|logical-start\|custom-mask`; paint `solid\|gradient`; profile `plain\|double-rim\|bevel` | Material structure; decorative base width remains `--area-border-width` (Surface) | These are independent fields: a top-only gradient bevel is expressible. “Off” removes optional decoration only. Required focus/state/control edges remain. A logical-start mask mirrors in RTL; physical top and light do not. |
| Stroke opacity | `stroke.opacity` 0…1; per-edge layer alpha | `M(edge-opacity)` and `M(edge-<id>-opacity)` | Multiply only decorative edge paint alpha. Width is Surface-owned; advanced edge layer weight can distribute that permitted width rather than enlarge layout borders. Any extra exterior ring is explicit decoration with a clip, not a shadow loophole. |
| Fill transparency / `body.transmission` | `body.transparency` 0…1; each paint also has alpha | `M(body-transparency)`; `M(body-<id>-alpha)` | Proposed transparency is backdrop participation, with effective body opacity `1 - transparency` only for the simple tint layer. Opaque underpaints remain opaque. Never emit element `opacity` to implement it. Readability guards can force an opaque body. |
| Blur / `filters` | `backdrop.blurPx >= 0`; optional per-layer `filters[id].blurPx` | `M(backdrop-blur)`; `M(filter-<id>-blur)` | Backdrop scattering and layer softness are separate; no universal `filter: blur()` on component root. Shadow and glow use their own controls above. One acquisition owner; fallback opaque when unsuitable/unverified. |
| Backdrop source / mapping | `backdrop.source: none\|local`; `mapping: unchanged\|declared-lens` | Compiled capability metadata; named lens parameters if supported | No promise to sample OS wallpaper or native glass optics. Lens displacement controls belong to its declared backend/recipe and safe fallback, not the blur knob. |
| Grain / `texture` | `grain.strength` 0…1, `grain.scalePx > 0`, integer seed, named source/blend/clip | `M(grain-strength/scale/seed)`; compiled texture descriptor | Static by default. Seed is a deterministic asset/generator input, not a claim CSS can synthesize randomness from a custom property. One phase per shared surface; keep reading regions clear. |
| Gloss / `reflection` | `gloss.strength` 0…1; `gloss.extent` 0…1 of receiver; `gloss.softnessPx >= 0`; mask, source `key\|environment\|authored` | `M(gloss-strength/extent/softness)`; compiled mask/source | Gloss is reflected highlight strength/shape, not fill alpha. Keep authored bands/environment reflection independent of key light unless opted in. Zero removes reflection but keeps body and required edge. |
| Absorption / role policy | `amount: none\|trace\|quiet\|full` | Policy field, compiled channel gates | Ordinal cap only. Do not emit numeric “amount × opacity/blur.” Full selects all eligible channels of a calibrated recipe, not unrestricted maximum settings. |

For compound shadows, gradients, edges and highlights, the advanced editor addresses **named layers**, with per-layer offset, spread, blur, alpha, source, mask and blend where the backend supports them. The global knobs provide coherent changes; they must not erase the distinct lobes or cause the zero-blur ring in board items 5/6 to become a blurred cast. Those annotations test representational completeness, not defaults. [Board provenance](https://github.com/ethanwongwork/area/blob/33e8ee40fc3aa86295920b77baef4771e1f86064/docs/research/astra/materials/README.md#L82-L92).

### Validation and calibration

Reject nonfinite numbers, unknown keys/roles/layers/sources, malformed color pairs and out-of-domain values. Reject negative blur or nonpositive texture scale. Alpha endpoints 0 and 1, gain identity 1 and additive identity 0 are proposed mathematical identities. Do not impose guessed “safe” blur/depth maxima: profile metadata must declare calibrated bounds after testing. Until then the profile is research-only. Normalize angles; validate monotonic stop positions. Custom decorative colors need both light/dark values or an explicit “same in both” choice. Preserve `light-dark(...)` at consumption rather than computing one mode in JS.

Use separate input and effective records. Clamp *derived* alpha and reduce channels under guards; reject invalid *authored* inputs rather than silently rewriting them. A cast-strength request can be retained while its effective cast is disabled under Flat. Return diagnostics for incompatible recipe/role combinations. An opaque fallback must retain semantic ink, state and required edges. No dynamic contrast guarantee is inferred from a source color.

New controls must not change typography, corner/pill settings, density, state semantics or motion settings. The existing constraints motivating this separation are [E03](evidence.md#e03-derivation-and-registrations) and [E05](evidence.md#e05-elevation-semantic-paint-and-hard-constraints). This task adds no animation control; changing a static key-light angle does not authorize motion on hover.

## Per-role overrides

<!-- task19-superseded 07-controls/controls.md ## Per-role -->
> **Superseded policy — D1, D3, D6, D13, D14 (owner, 2026-10-11):** Area’s calm no-cast/Trace-only expression is the None default, not a material ceiling. Contrast, focus, fixed hover ink and semantic meaning remain hard limits. Ordinal caps and provisional control ranges are not limits. Numeric per-role strength multipliers and bounds must be calibrated to the board and contrast-tested at extremes; that work is pending tasks 20–22. The current vocabulary has 13 roles including row-plate; 04/05 now cover 101 contracts. Historical 12-role/78-contract counts below describe their original snapshot only. No automatic effects on glyphs or small text; display text and button labels may explicitly opt in. A curated duotone pilot is later work. Performance rules must follow measured workloads, not universal no-row-blur/static-only caps. Owner names a 60Hz minimum device; a later rerun includes Firefox. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

Proposed syntax: `material.roles[role]` narrows optical controls, while `surfaceControls.roles[role]` tunes an **already permitted** cast. A role override can lower amount, change permitted channel parameters or select a quieter compiled recipe. It cannot raise a family/nesting/accessibility cap, grant missing paint, convert intrinsic media to recolorable glyphs or change task 04 depth. Key light stays shared within a scope; changing it requires a nested scope, not twelve contradictory role lights.

The twelve rows below operationalize task 05's [baseline role limits and guards](evidence.md#e01-research-inputs). Caps are inherited proposals, not measured percentages.

### page

Allow scene body paints, gradient coordinates and static grain outside reading masks. No self-cast or self-backdrop blur. No general transparency on the page: only a declared scene host can supply a meaningful background. Keep dark page semantics; no gloss overlay across long content. Role override can remove scene decoration, not lift the page or change the theme.

### container

Allow body tint/transparency on a real painted shell, perimeter edge/gloss and limited grain; dense/large body at most Trace and perimeter at most Quiet. Layout-only wrappers take None and ignore optical overrides. Surface adjustment applies only where the bound part already consumes a container cast; it cannot make TableWrapper or an arbitrary layout div a Card. Shared bodies own a single backdrop/texture phase.

### floating-surface

Allow guarded backdrop blur/transparency, edge, gloss, body gradient and Surface float tuning. Normal reading overlays Quiet; sparse receivers can request Full; Tooltip remains Trace. Arrow uses the shell's resolved body/coordinates and has no independent blur, grain or cast. Role-level cast override cannot flatten distinctions between Tooltip, Toolbar and ordinary float recipes without an explicit source migration.

### raised-control

Allow Quiet body/perimeter/local relief for sparse actions, Trace for repeated toolbar/row actions. Restrict gloss away from labels. No new cast: the role name does not override Button's no-shadow rule. Decorative stroke opacity cannot remove identification or focus. Joined controls share shell paint and preserve their seam.

### recessed-field-track

Allow Trace local inset depth/softness, quiet edge and body tint; opaque editing/reading center. Quiet relief only on a deliberately modeled well with adequate perimeter. No independent glass inside a glass parent; no cast from a recess. Preserve field focus/invalid halos as state paint, unaffected by the general glow-strength control.

### thumb-knob

Allow Quiet convex relief, edge, gloss and permitted Surface shadow-1 tuning; Full only a sparse explicitly designated larger receiver. No control changes travel, track length, handle size or focus clip. Share parent key light; invert local concave/convex modeling rather than invent a second light. Selected fill remains a separate receiver.

### indicator-fill

Semantic or literal-data core stays None for additional material. Only separate supplementary rim/halo at Trace; glow source follows its actual tone/selection context. No custom gradient/transparency on quantitative core, hue ramps or color swatches. Never blur or extend the actual filled extent to simulate depth. A requested source override may apply to a decorative scene emitter, not to semantic status ink.

### divider

At most Trace local edge/engraving with one continuous structural line. No glow network, backdrop blur, cast or grain. Keep container seam hierarchy. Strength controls cannot erase the baseline required rule; the material layer can only add or remove its supplementary modeling.

### edge

Allow decorative coverage/paint/profile and alpha, within existing geometry; Quiet normally, Full only for an explicitly eligible primary gradient-stroke receiver. Required state/focus edges bypass the material recipe. Do not independently repaint a body's perimeter twice because both shell and edge map records refer to it. Surface owns decorative width; a material edge profile distributes it and retains the clip.

### glyph

Functional glyphs and intrinsic images remain None. An explicitly decorative sparse symbol may request Trace local reflection/engraving/emission, preserving its source silhouette. No automatic tint of photos, native icon-box changes or light-driven shifts of strokes. Optical overrides do not recolor semantic action/status icons.

### text

Ordinary labels, values, prose and code remain None; overrides cannot introduce text blur/glow/shadow. Trace content decoration only for explicit large, short display inscription metadata. Even there, readable ink remains separate and fixed on hover. No global font/weight/size/tracking control belongs in Material.

### scrim

None for additional material. Preserve functional occlusion/fade. Reject material blur/grain/gloss/body override on this role; a shell's glass does not convert the modal scrim to another glass pane. Existing scrim strength is a separate readability/modal policy, not Material's fill transparency.

## Resolution, resets and nested receivers

<!-- task19-superseded 07-controls/controls.md ## Resolution -->
> **Superseded policy — D2, D3 (owner, 2026-10-11):** Material sits beside Surface; recipe structure switches with inherited 0/1 gate tokens. Surface shadows require a pixel-identical split into adjustable parts, including Tooltip/Toolbar literal exceptions. Selector-switched recipes alone are not nested-scope safe. Ordinal caps and provisional control ranges are not limits. Numeric per-role strength multipliers and bounds must be calibrated to the board and contrast-tested at extremes; that work is pending tasks 20–22. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

Proposed order:

1. Resolve effective preset and its explicit control patch at the theme scope. Validate inputs.
2. Resolve actual painted part, role, semantic source, existing Surface tier and shared-shell owner from the future bindings. Never infer this from tag name or DOM depth.
3. Apply role request, then the strictest style/role, family, nesting and accessibility caps. Prohibited channels remain off even if their requested scalar is high.
4. Resolve structural choices; coalesce body, edge, backdrop, cast, emission and texture owners. Preserve required state paint outside decoration.
5. Derive local semantic paints and geometry; select opaque/no-effect fallback where needed. Effective output never changes depth relationship, hit geometry or focus ownership.

**Glass in glass:** outer panel owns acquisition; child field/reading region becomes opaque/Trace. A separate opened Popover is a new optical group, with its actual composed backdrop; it can fall back opaque independently. **Recess in raised:** local cavity and handle share one light; the well shades against immediate parent body, not repeatedly darkened root tokens. **Flat plus clay:** reject full external extrusion or reduce to body/inset/rim cues. **Dense repetition:** use one shell coordinate/texture phase; do not restart a gloss band per Table row, Calendar day or Message.

These preserve task 05's decisions. Their current component motivation is [InputGroup and DatePicker composition](evidence.md#e08-parts-local-tone-and-shared-shells). The architecture report specifies exact API reset and CSS scope behavior; this resolution is a proposed compiler contract, not an implemented renderer.
