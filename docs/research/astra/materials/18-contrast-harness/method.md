# Composed paint and the continuous search

This is an **authored numerical method** implementing the bounded case proposed by [08 method](../08-accessibility/method.md). [Evidence](evidence.md) pins the source constraints and standards. It does not infer the geometry of a DOM tree.

## Defined input and output

One probe supplies constant **opaque** ink/cue RGB, a solid body and its alpha, zero or one linear gradient with strictly increasing stops, and an opaque backdrop whose encoded sRGB channels vary independently in a closed box. The preset run uses `[0,1]³`, the whole sRGB cube. Composition and interpolation are explicitly in encoded **sRGB**, matching the task-13 gradient proposal; WCAG linearization happens only after composition. There is no conversion to grayscale before composition.

The body is source-over the backdrop. Gradient stop colors are alpha-premultiplied, interpolated in sRGB, and composited over that result. For a normalized segment position `t`:

```text
body(B) = bodyAlpha × bodyRGB + (1 − bodyAlpha) × B
A(t) = (1 − t) × alpha0 + t × alpha1
P(t) = (1 − t) × alpha0 × color0 + t × alpha1 × color1
ground(B,t) = P(t) + (1 − A(t)) × body(B)
contrast = (max(Link, Lground) + .05) / (min(Link, Lground) + .05)
```

No contrast ratios or luminances are interpolated. A transparent red stop contributes zero premultiplied red. Fully opaque targets retain their exact semantic source; any requested foreground alpha is rejected rather than treated as opaque. The return record includes status, unrounded internal ratio, encoded backdrop/ground triples, gradient position, search method and sample count. JSON is rounded to twelve decimals **after** status determination; CSS swatches and hex approximations never decide the result.

## Why endpoints alone do not suffice

At a fixed gradient position, source-over with nonnegative alpha is monotone in each backdrop channel. The minimum possible ground luminance is at the box’s lower RGB corner, and maximum at its upper corner. That does **not** mean those corners minimize contrast: when ink luminance lies between them an interior backdrop can erase the signal.

Within a premultiplied sRGB gradient segment, each composed channel at either corner is affine in `t`. WCAG’s channel transfer is monotone and piecewise convex. The solver splits at every channel’s `.04045` transfer knee, evaluates both sides of those joins and segment boundaries, and bisects any interior derivative zero. This locates the low-corner minimum and high-corner maximum, including gradient interiors. It also handles multiple strictly ordered stops, one segment at a time. Hard/coincident stops are explicitly unsupported.

If ink luminance lies outside a segment’s reachable luminance interval, its closest bound gives the minimum ratio. If it lies inside, a path interpolating from the minimizing low-corner/position to the maximizing high-corner/position supplies an interior collision; bisection finds a witness. The result records the actual sampled ratio there, not a forced literal 1. A uniform grayscale is enough to witness the full-cube collision on that path; this is a consequence of monotone channel bounds and continuity, **not an assumption that all images are gray**. For a nonuniform RGB box, the path may be colored.

Before refinement the engine samples 17 positions × 17 points along the box diagonal per segment, plus every RGB box vertex at every stop. These are regression/sanity witnesses, not the reason a conditional model PASS is justified. Tests independently compare the continuous result with a dense colored RGB grid. The grid spacing, 64 bisections, and 1e−8 boundary guard are authored numerical choices, not visual measurements or accessibility tolerances.

Double precision is not a machine-checked interval proof. The standard sRGB piecewise constants have a tiny rounded join; both sides are retained. A ratio within 1e−8 of its floor returns **UNRESOLVED**, never rounds up. The named preset results are well away from this boundary. A claim needing a formally verified bound should use interval arithmetic and a renderer oracle, not relabel this prototype’s arithmetic as certified.

## Which paint the preset adapter samples

Read [coverage.md](coverage.md) with [build.py](build.py). The concrete sources come from Area’s pinned token resolver, and requested transmission/gradients come from task 13’s actual JSON:

1. **Requested shell:** body alpha is `1 − transparency`; the body-reflection gradient is sampled across its full footprint. Sampling ink there deliberately bypasses the reading mask. This is a negative probe of raw paint, not a claim that task 13 authorizes labels under reflection.
2. **Guarded:** text and information-bearing marks sit on the receiver’s opaque baseline; required edges still compare against the transmitting inside strip (including an eligible body reflection) and an opaque page outside. The worst adjacency wins. Edge/cue paint itself is never attenuated.
3. **F0:** the owner uses its existing opaque body and no Material gradient/transmission. The semantic ink/edge remains identical. Outer adjacency remains the declared page.
4. **Outside-scene negative control:** remove the outer page backing and compare every required edge against the full backdrop cube. This is independent of the inside recipe. A matching-luminance interior scene reaches approximately 1:1. It is stored separately, never hidden inside the passing F0 count.

Dense Code/Table grounds, page, functional indicators, inverted tooltip/toast grounds, and ghost-host grounds keep their fixed body bindings in all three scenarios. Focus/invalid comparisons suppress reflected body overlays as task 13 requires. Rest/hover/active paints are those in the source assertions; no ink adjustment rescues a failure.

**Comparison-strip assumption:** the authored fixture excludes decorative relief lobes, gloss, grain, decorative gradient rims, casts and emission from the ink footprint and the immediate ground strip against which a required cue is compared. The transmitting body and eligible body-reflection gradient are the only variable paints in that strip. Task 13 asks for exclusion masks but does not define their clearances. This prototype does not prove that existing CSS supplies this strip. Where decoration overlaps the adjacency, or the mask is unknown, the **rendered recipe remains UNVERIFIED** and requires a richer scene/UNRESOLVED or F0. A dark shadow or bright glint is never credited as a required edge.

A uniform backdrop survives blur unchanged. For this pointwise unrestricted RGB-domain test a normalized blur cannot escape the cube and cannot remove the uniform adversary; the listed 5px/12px radii therefore supply no contrast credit. No spatial blur implementation, image crop or refraction field was measured. Gradient angle changes where a position occurs, but full `[0,1]` coverage includes every allowed position; this test does not assert where a glyph actually lands.

## Regressions and failure policy

- Task 08: `#767676` ink, white fill alpha .01. Black/white endpoint ratios exceed 4.5; backdrop channel **.4573182808476926** composes to the ink and reaches 1:1.
- An opaque red-to-green sRGB gradient behind black text: both stop ratios exceed 4.5 but an interior mixture falls below 4.5. This catches “only sample stops.”
- Alpha-premultiplied transparent red→opaque blue, two-layer source-over order, narrow multi-stop intervals, a nonuniform RGB backdrop box, known black/white, exact-threshold rejection, unsupported input, and an independent colored grid.

[Tests](test_paint.py) contain the exact inputs. `check_scene.py` rejects unsupported keys, spaces/blends, alpha ink, invalid bounds and hard stops with UNRESOLVED and exit 2. The preset adapter rejects filters/refraction it does not implement. It does not silently downgrade to an opaque passing interpretation. An explicit F0 result is a separate scenario and cannot overwrite the failure.

This prototype checks WCAG numerical floors only. The existing token suite’s dark APCA, aesthetic floors and exception policy remain a separate unchanged gate; their presence does not authorize omitting them from a future production release.
