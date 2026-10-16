# Method and reproducibility

Checked 2026-10-09. These are **synthetic local measurements**, not signed-in product captures or approved Area recipes. The authored inputs are in [bench.js](bench.js), [bench.css](bench.css) and [index.html](index.html); each saved run pins their SHA-256 hashes. The benchmark records its own timing, not values inferred from screenshots.

## What is measured

`requestAnimationFrame` timestamps yield inter-callback frame intervals. Each trial records sample count, mean, p50, p95, p99, maximum, intervals longer than 1.5 times that repetition’s empty-stage cadence, >33.34ms and >50ms. A separate timer surrounds the JS mutation callback. This timer excludes deferred style, layout, paint, raster, composition and GPU work. Long-task observations, when supported, are supplementary main-thread evidence; absence is not GPU evidence. [MDN rAF](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame), [MDN long tasks](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming), checked 2026-10-09.

The report calls these **frame intervals/cadence**, not GPU frame duration, actual presentation rate, input latency or a count of unique displayed frames. A compositor can keep presenting while main-thread rAF is late; rAF can also run without proving that every visual update reached the screen. The >1.5-period metric is a **slow-interval proxy**, not a measured dropped-frame count. The same limitation applies to the transform comparison.

126 cases × three seeded shuffled repetitions = 378 trials per browser. A repetition starts with a 1,500ms empty-stage cadence calibration. Each case mounts its DOM, warms for at least 350ms, then samples for at least 1,500ms. One first timestamp establishes the window; intervals start on the following callback. Values are calculated by sorting samples and selecting floor((n−1)q); no interpolation. Cases are interleaved, not sorted from easiest to hardest. All original trial summaries, including invalid ones if any, remain in the JSON. Setup, warmup and result writes are outside the sample window; their indirect garbage-collection/thermal effects cannot be excluded. Three short repetitions characterize this run’s spread, not statistical confidence across devices. Very slow cases can have only a handful of intervals per trial, making tail quantiles coarse; the ledger also reports interval counts.

The page checks foreground visibility and focus every callback, and invalidates a trial on a resize during that trial. Start requires the whole stage to fit in the viewport. The analyzer also rejects trials whose repetition calibration was invalid. Because visibility/focus are sampled at callbacks rather than event-latched, a loss and recovery between callbacks can escape these flags. The page cannot detect every occluding window, power transition, thermal change or background workload. Repeat on an idle machine before release decisions; do not silently discard slow but valid trials.

## Fixed geometry and workload

The CSS stage is 840×480, with a 1px boundary and an overflow scroller. Rows are 32px high on a 40px pitch; at most 13 intersect the 478px inner viewport. All 200, 500 or 1,000 rows exist in the DOM, with no virtualization or `content-visibility`. Offscreen raster culling is left to the browser. **1,000 rows does not mean 1,000 simultaneously painted rows.** The fixture does not measure mount time, initial memory, full-list rasterization or a thousand open cards.

Scroll is scripted at 360 CSS px/s. Repetitions begin at the top, near the middle and near the end; sample phase continues the warmup trajectory. This gives reproducible positions but does not reproduce the browser’s asynchronous wheel/touch momentum pipeline. Paint animation uses a 1Hz sinusoid, updates CSS/SVG values from rAF, and leaves scrolling stationary. Shadow/grain/stroke values inherit from the list; blur values are assigned to each pane. Mutation overhead therefore belongs to each technique’s measured implementation. It is not a shader-only comparison.

| Family | Independent variables | Static scroll case | Animated paint case / limits |
| --- | --- | --- | --- |
| Backdrop blur | Radius 0, 4, 12, 24, 48px × 1, 4, 16, 64 panes | Fixed overlay panes sample moving patterned rows and their text | Radius varies from half to full input; 0px retains the same elements and `blur(0px)` pipeline rather than removing filtering entirely |
| Layered shadows | 0–6 layers × 200, 500, 1,000 rows | Entire list receives the same static shadow list | Inherited alpha .12–.30; y offsets 1–6px, blur list 2/4/8/12/16/24px, spread −1px. Layer count and maximum extent grow together; this is cumulative stacking, not an isolated equal-blur layer-count experiment |
| SVG refraction approximation | Displacement scale 0 or 24 × 1, 4, 16 owned SVG panes | Overlay artwork stays stationary while content behind scrolls; this tests cached filter composition, not fresh backdrop refraction | Scale animates 0–24. Two-octave turbulence at .025/.04, seed 7; R/G map channels, sRGB; filter bounds −10%/120%. Zero case omits the filter. Only owned art is displaced |
| Grain | None, cached SVG-image tile, generated raster tile, live inline turbulence × 200/1,000 rows | Static grain on each row | Cached image backgrounds shift 0–32px; live turbulence frequency varies .6–.8. Noise tile 96×96; SVG three octaves, seed 7; raster is seeded grayscale PRNG, **not pixel-identical** to SVG; overlay alpha .16 |
| Gradient strokes | Solid, opaque double background, masked pseudo-element × 200/1,000 rows | Static edge | Angle varies 90–180deg; solid baseline also updates the unused angle. One 1px edge, radius 8px; stops #a8f0e2/#9690ff/#647895. Mask uses exclude with prefixed xor fallback. Opaque base retained in this cost fixture |
| Transform comparison | Blur radius 0/24px × 1/64 panes | No scroll | CSS translateX 0–8px, 1,200ms alternating ease-in-out, constant blur. Distinct from animating blur radius; compositing eligibility is not traced |

Pane geometry is 96×52px, with an 8-column grid, 6px gaps, 8px stage inset, 1px edge and 8px radius. All 64 fit inside the stage. Their nominal combined border-box area is 319,488 CSS px²; the filtered region, blur sampling extents, clipping and actual GPU allocation differ. Count and area rise together; this is not an equal-area fragmentation experiment. Do not extrapolate a successful small pane to a full-screen blur, nested backdrop roots or overlapping lenses.

“Cached” image in the fixture descriptions means one preloaded/reused image URL; raster-cache reuse inside either renderer was not traced or established.

Task 03 supplies the mechanisms, not these stress values: [shadow/glow techniques](https://github.com/ethanwongwork/area/blob/c3d6664e56570e1fbf4ef530ccc172934806127c/docs/research/astra/materials/03-css-cookbook/cookbook.md#L32-L67), [grain](https://github.com/ethanwongwork/area/blob/c3d6664e56570e1fbf4ef530ccc172934806127c/docs/research/astra/materials/03-css-cookbook/cookbook.md#L81-L91), [rounded strokes](https://github.com/ethanwongwork/area/blob/c3d6664e56570e1fbf4ef530ccc172934806127c/docs/research/astra/materials/03-css-cookbook/cookbook.md#L106-L133), [blur and owned-art displacement](https://github.com/ethanwongwork/area/blob/c3d6664e56570e1fbf4ef530ccc172934806127c/docs/research/astra/materials/03-css-cookbook/cookbook.md#L135-L165). This experiment does not establish portable arbitrary-HTML `backdrop-filter:url(...)`, native Liquid Glass, or a new browser compatibility floor.

## Re-run

From the repository root, with Python 3 and a local browser; no package installation:

```sh
python3 docs/research/astra/materials/11-performance/serve.py
```

1. Open a new visible tab at `http://127.0.0.1:8766/index.html`. Keep existing user tabs untouched. Use a unique lowercase run label; a reused label overwrites that local aggregate file.
2. Ensure the entire stage fits. Click **Preview heavy effects** repeatedly to inspect blur, distorted owned artwork, live grain and masked strokes. Hard reload if a fixture was edited. Parser acceptance alone is not proof of rendered effects.
3. Click **Run full suite**; leave the tab visible and focused for about twelve minutes. Do not scroll the outer page, resize, open DevTools, capture screenshots or run other graphics tests during measurement. Use **Stop** to abort. Aborted files remain evidence but are not accepted as complete runs.
4. After Complete, repeat sequentially in the other browser with a different label. Record actual application version, OS, hardware, viewport/DPR, power mode and other background work. Do not silently change the owner’s settings to improve results.
5. The loopback server writes trial aggregates to `results/<label>.json` after each trial. It accepts only bounded JSON at `/save` and never sends data to an external server. No raw frame log or personal screenshot is committed.
6. Generate/recheck the tables, then open `results.html` on the same server for a filterable view:

```sh
python3 docs/research/astra/materials/11-performance/analyze.py
python3 docs/research/astra/materials/11-performance/analyze.py --check
node --check docs/research/astra/materials/11-performance/bench.js
```

Do not edit the three hashed fixture files after recording evidence. A new recipe requires new measurements, not merely fresh checksums. The analyzer reads all `results/*.json`, requires complete 378-trial runs with unique case/repetition pairs, verifies fixture hashes and sample windows, and regenerates all case summaries. It does not certify GPU behavior or contrast.

## What the budget does not claim

No paint/compositor trace, GPU timing, power draw, memory profile, low-end device, Firefox, mobile, nested/overlapping blur, giant single blurred surface, inset-shadow stack, independent glow stack, grain blend-mode comparison or full application workload was measured. No direct comparison of transition crossfading versus dynamic shadow geometry was run. The finite budgets in [budgets.md](budgets.md) are conservative **proposals**, not newly discovered universal CSS limits. A rAF result below one frame period is a cadence ceiling: it cannot show how much unused rendering headroom remains.
