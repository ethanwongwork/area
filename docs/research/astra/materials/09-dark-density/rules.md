# Dark, density and geometry contract

Everything marked **proposal** below is an authored policy to test, not a captured value. Observed values are linked in the [ledger](evidence.md). The rule identifiers are shared by every row in [styles](styles.md).

## Dark translation

<!-- task19-superseded 09-dark-density/rules.md ## Dark -->
> **Superseded policy — D1, D10 (owner, 2026-10-11):** Area’s calm no-cast/Trace-only expression is the None default, not a material ceiling. Contrast, focus, fixed hover ink and semantic meaning remain hard limits. The dark page may take tint/texture only within a fixed distance of #020202 (neutral 975); a numeric bound is not yet calibrated. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

**D — proposal:** retain `bg-page` at the theme's near-black neutral role. Distinguish a foreground body with its existing semantic surface/control fill and edge before increasing decorative effects. Use a lighter *local top* only when the recipe models a lit body; a top highlight and a uniformly brighter plane serve different purposes. Cast shadows remain dark. A rim is reflected light; glow is emission; neither is a replacement color for `shadow-color`. Keep key-light direction coherent across convex and concave relief, with the recess reversing the lit/shaded edge relationship. Ambient fill, reflection and self-emission are separate channels under task 01.

Apple's brighter elevated backgrounds, Fluent's retained dark casts and M3's paired surface roles support that hierarchy, not a requirement to brighten every raised object. [Public evidence](evidence.md#public-dark-and-shape-guidance). A selected solid, warning, error or inverse surface keeps its own semantic ink/body pairing. No global white wash, forced desaturation of meaning-bearing tones, foreground changes on hover, or monotonic white addition for every nested child. [Area policy](evidence.md#area-dark-and-ownership-constraints).

**N — proposal:** enforce task 05's absorption and nesting caps before size scaling. Text-dense container bodies take Trace treatment, with Quiet perimeter at most; repeated rows/controls reduce to Trace. These are ordinal permissions, not opacity factors. A floating shell owns one backdrop acquisition and one permitted Surface cast; a nested child uses an opaque/tonal body or a rim instead of acquiring glass again. Recessed-in-raised keeps local cavity modeling without another floating cast. Pages, semantic glyph/text cores, data fills and scrims do not inherit panel gloss or glow. [Absorption input](../05-absorption/README.md).

## Scaling policy

<!-- task19-superseded 09-dark-density/rules.md ## Scaling -->
> **Superseded policy — D1, D3, D14 (owner, 2026-10-11):** Area’s calm no-cast/Trace-only expression is the None default, not a material ceiling. Contrast, focus, fixed hover ink and semantic meaning remain hard limits. Ordinal caps and provisional control ranges are not limits. Numeric per-role strength multipliers and bounds must be calibrated to the board and contrast-tested at extremes; that work is pending tasks 20–22. Performance rules must follow measured workloads, not universal no-row-blur/static-only caps. Owner names a 60Hz minimum device; a later rerun includes Firefox. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

**G — proposed local geometry scale:** for an explicitly calibrated recipe with painted reference height `H_ref`, scale local relief offset, local inset-shadow blur/spread, decorative glow extent and highlight-band depth by `q = H_painted / H_ref`. Preserve signs of signed spreads. Do not scale opacity, light angle, semantic colors or cast lift by this factor. Compute q once from final geometry; do not apply an additional “compact multiplier”. For control recipes calibrated at default md 32, the following factors are derived from [Area tiers](evidence.md#density-and-geometry-inputs):

| Density | sm | md | lg |
| --- | --- | --- | --- |
| Default painted height | 28 | 32 | 40 |
| Compact painted height | 24 | 28 | 32 |
| Default q relative to 32 | 0.875 | 1 | 1.25 |
| Compact q relative to 32 | 0.75 | 0.875 | 1 |
| Compact/default at same size | 6/7 | 7/8 | 4/5 |

Those factors are an evaluation rule, not evidence that 32 is the right calibration for every family. A surface, Slider thumb, Switch track, glyph and letterform have different reference boxes. Switch track q relative to its md 20 is 0.8/1/1.2 at both densities; short thumb q relative to md 16 is 0.75/1/1.25. Slider thumb q relative to md 16 is 1/1/1.25 at both densities. Mark-label q relative to default md 20 is 0.8/1/1.2, compact 0.8/0.8/1. These are arithmetic consequences of the pinned dimensions, not new sizes. Read actual painted geometry for shells, multiline bodies and nested parts rather than assuming a size class names their height.

**S — proposal, shadows:** external cast is role/Surface-owned; a compact Menu is still a floating Menu. Hold `shadow-float` and container cast recipes across density/size unless separately calibrated for a different elevation role. G applies only to modeled *local* relief. Current inflow Button/Input do not gain a cast merely because a style includes “raised”. Flat forbids external relief lobes as well as ordinary drop shadows; reduce to inset/edge treatment or mark the combination incompatible. Dark Card's absent halo stays absent. [Surface evidence](evidence.md#area-dark-and-ownership-constraints).

**E — proposal, emission:** scale optional halo reach using G only for a local emitter, and cap it by actual adjacent-content clearance. Keep the sharp semantic core opaque and independently contrasted. In compact layouts with no inter-row gap, remove the halo or restrict it inside the owning shell; do not blur neighboring text. Never increase glow opacity to compensate for reducing its radius. Large sparse display emissions can have their own calibrated reference, not the control q.

**H — proposal, highlights:** scale soft highlight-band depth/offset using G; anchor direction to the lighting model or explicit reflection field. Hard edge glints follow W, not fractional G. Narrow bands must stay outside the label/content zone. When a rounded end leaves too little straight top, wrap the glint along the contour or remove it; don't stretch a rectangular white stripe across rounded corners. Larger size creates space, not automatic permission for extra layers. Compact first drops secondary reflections and keeps one readable plane.

**W — proposal, strokes:** preserve Area's required stroke/focus widths at sm/md/lg and both densities; required focus is not a material strength knob. Keep decorative width under Surface ownership. G may change bevel depth or the spacing between decorative contours, but not silently multiply all 1px strokes by 0.75. If the contours cannot fit between boundary and content, remove the optional inner rim. Do not merge the material edge and focus ring merely because their colors match. Fractions are allowed only when specifically calibrated; test at actual device scale and zoom rather than asserting that a fractional CSS pixel is always sharper or always wrong.

**B — proposal, body/filter/texture:** choose dark semantic stops first. Keep gradient stop fractions and angle unless the lighting purpose calls for a shape-relative field; percentages change physical extent with the body automatically. Backdrop blur describes the backdrop scene, not the control hit height, so hold it across density initially. Re-test legibility rather than making compact glass more transparent. Grain is a spatial texture with its own frequency calibration, not an image stretched per control; lower its contrast/coverage near small text. No filter on inherited text. [Layer model](../01-taxonomy/layer-model.md), [accessibility method](../08-accessibility/method.md).

## Concentric geometry

<!-- task19-superseded 09-dark-density/rules.md ## Concentric -->
> **Superseded policy — D11 (owner, 2026-10-11):** Inner rims keep the radius floor at every setting except Sharp. Historical max(0, outer-inset) examples and tabulated square inner rims are retained but superseded. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

**R — observed geometry plus proposed painting contract:** use the actual used boundary of the role, not the corner-setting label as a literal radius. [All nine settings](geometry.md) show Area's current calculations. Compact controls can repeat a radius across adjacent settings because Area rounds down to even pixels; materials must accept these plateaus. Container corners hold, while list corners have their own cap. These are circular CSS corners, not a claim of continuous-curvature squircles.

For a uniformly rounded rectangular body wide enough not to constrain its height, normalize the outer radius to the used value `R` after CSS overlap reduction. A same-body inner rim offset by uniform distance `d` uses `max(0, R-d)`. Its box shrinks by `2d` in each dimension. This is the CSS border/padding contour model, supported by [CSS §4.2 and §4.5](evidence.md#public-dark-and-shape-guidance), not an exact parallel-curve theorem for arbitrary ellipses. Mixed corner radii and unequal insets need each corner/axis and side recomputed; use native border/background clipping where possible.

A declared `9999px` pill sentinel is not its physical radius. For width ≥ height, use `H/2`; the inner contour then has `(H-2d)/2` until it collapses. A circle uses its actual diameter. For narrower/unequal boxes let CSS normalize all corners, including mixed corners, before building a separate effect path. Native background-clip avoids independently normalizing two mismatched paths. An outer decorative contour on a rounded path may be designed with `R+d`, but this is not a claim that CSS outline or shadow-spread algorithms always equal that equation. At Sharp use square/miter joins for the explicit contour; don't add a rounded halo corner simply by using `R+d`.

Same-body rims do **not** inherit `radius-floor`. For example, a 2px outer corner and 2px inset produce a zero inner radius. Independent nested Button/Input/Segmented children deliberately have their own optical floor, so they need not be exactly concentric at low settings. Keep their functional geometry and make each child's material rims concentric to *that child*. Don't change the child's shape to make a decorative rim work. [Nested geometry sources](evidence.md#density-and-geometry-inputs).

Pill flags can override Sharp. Intrinsically circular Slider thumbs and pill rails likewise remain round. The nine-setting table assumes flags off for control bodies; every recipe must branch on the resulting used shape, not the setting string. Default pill Switch/Badge can therefore use the Pill contour at any setting. Surface remains finite at Pill; a large panel does not become a capsule. These exceptions are in [Area source](evidence.md#density-and-geometry-inputs).

For a double rim: assign one outer body contour; offset the second contour inward; clip highlight and inset shade to their respective contours; count the layout border once. A top-only highlight is a masked segment of that contour, including the curved shoulders. It is not a full border independently rounded inside a crop. Prefer the rounded double-background or mask methods in [task 03](../03-css-cookbook/README.md). If a proposed bevel is deeper than the available inset, simplify rather than painting through content. A squircle experiment would require one shared outer/inner path model and browser fallback; task 09 does not introduce `corner-shape` into Area.

Joined Table rows, Calendar range middles, split controls and grouped cells use the aggregate boundary and existing join geometry. Paint outer rims once; internal separators stay straight where the parts meet. A gradient stroke across a range cannot turn every date cell into a detached pill. Floating arrows and shells share one body treatment. These are proposed application rules under task 05's family guards, supported by [Fluent joined-shape guidance](evidence.md#public-dark-and-shape-guidance).

## Proposed acceptance checks

<!-- task19-superseded 09-dark-density/rules.md ## Proposed -->
> **Superseded policy — D11 (owner, 2026-10-11):** Inner rims keep the radius floor at every setting except Sharp. Historical max(0, outer-inset) examples and tabulated square inner rims are retained but superseded. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

1. Check every style on near-black page, raised surface, solid tone and floating-over-floating scenes. Include dark neutral casts, long labels, dense Table/Code/Calendar, Slider and Switch. Preserve semantic colors and hover foreground.
2. For every style run all nine radius settings × both UI densities × sm/md/lg wherever that family actually exposes those sizes. Include pill flags on/off, intrinsically round marks, nested child floors and connected selections; do not fabricate unsupported variants.
3. Inspect at representative device scales/zoom: no doubled border layout, cropped focus, corner seams, angular breaks on pills, bright crowded halos or highlight intrusion into text. These are proposed experiments, not performed visual checks.
4. Apply task 08's worst-case backdrop/gradient contrast and preference fallbacks without lowering any gates. A decorative rim is never proof of required boundary contrast. Keep text, focus and meaning-bearing indicator cores independent of lighting controls.
5. In a future implementation derive Material × Theme × UI × Radius × Surface combinations in `emit/base.ts`, re-emit on scopes and painted-part geometry boundaries, and keep derived colors unregistered. Material sits beside Surface as proposed in task 07; Surface remains the sole owner of its border-width and shadow namespace. No token or React API is changed by this report.
