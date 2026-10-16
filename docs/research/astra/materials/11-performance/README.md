**Question:** What does local Chromium and Safari frame cadence show about backdrop blur, layered shadows, SVG refraction, grain and gradient strokes while scrolling or animating, and what material budget should each role receive?

**Answer:** Across **756 trials (741 valid)** on this M5 Pro, Chromium’s dense blur and animated shadow stacks reached roughly **25–33ms p95**, while Safari’s animated live grain reached **139–161ms p95**. Static scrolling, animation and browser choice materially change the result. Recommend **no independent blur on rows, one backdrop owner per overlay group, static optical parameters and reused raster grain**. The report budgets all twelve roles; these are proposals grounded in local frame-cadence measurements, not universal GPU-cost limits.

<!-- task19-superseded 11-performance/README.md **Answer:** -->
> **Superseded policy — D1, D3, D14 (owner, 2026-10-11):** Area’s calm no-cast/Trace-only expression is the None default, not a material ceiling. Contrast, focus, fixed hover ink and semantic meaning remain hard limits. Ordinal caps and provisional control ranges are not limits. Numeric per-role strength multipliers and bounds must be calibrated to the board and contrast-tested at extremes; that work is pending tasks 20–22. Performance rules must follow measured workloads, not universal no-row-blur/static-only caps. Owner names a 60Hz minimum device; a later rerun includes Firefox. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

**Snapshot:** checked **2026-10-09** (America/Los_Angeles), after `git fetch origin`. Area `origin/main`: [`6f896789a5200bcbd34fe87de458e60ca82141d6`](https://github.com/ethanwongwork/area/tree/6f896789a5200bcbd34fe87de458e60ca82141d6). Research input: [`c3d6664e56570e1fbf4ef530ccc172934806127c`](https://github.com/ethanwongwork/area/tree/c3d6664e56570e1fbf4ef530ccc172934806127c/docs/research/astra/materials). Read the full brief and task 03 first; task 04’s roles and task 05’s absorption/nesting inform the budget. Status **unreviewed**, research only; no production changes or approval claims.

<!-- task19-changes -->
## Changes after review — 2026-10-11

Task 19 corrections, with the reason from [Corrections for Astra and D1–D16](../REVIEW.md). Older Answer/Snapshot passages below retain their original date and findings unless explicitly refreshed; the changes here and decision callouts govern subsequent work.

- **C17 — Review reason:** Universal no-row-blur/static-only budgets did not follow the measurements. **Change:** Kept benchmark measurements unchanged; restated measured risk cases (64 panes, animated 5–6-shadow stacks, Safari animated live grain). Marked old role caps superseded; owner minimum 60Hz device and Firefox rerun remain pending. Files: [budgets.md](budgets.md). Decisions: D1, D3, D6, D14.

Full change ledger and verification: [19-corrections](../19-corrections/README.md).
<!-- /task19-changes -->

## Evidence and deliverables

- [Complete case ledger](results.md): 126 recipes per browser, usable repetition counts, median p50/p95, p95 ranges, paired baseline differences, slow-interval proxies and JS callback p95.
- [Filterable result page](results.html): select browser, technique and workload; reads the same [summary.json](summary.json), with no independent calculations of raw timing.
- [Verification record](verification.md): actual rendering checks, evidence exclusions and explicit gaps.
- [Method](method.md): exact authored stress inputs, geometry, timing, baselines, rendering limits and reproduction steps.
- [Role budgets](budgets.md): all twelve roles, dense-family exceptions, nesting and two policy options.
- [Benchmark page](index.html), [static case inspector](fixtures.html) using the same mount function, [CSS](bench.css), [harness](bench.js), [loopback server](serve.py), [analyzer](analyze.py), [environment record](environment.json).
- Aggregate evidence: [Chromium/Edge](results/edge.json) and [Safari](results/safari.json). Each run records the fixture hashes, actual UA, viewport/DPR, renderer where exposed, calibrated cadence, seeded case order and every trial summary. These are locally measured aggregates; no raw frame logs or personal screenshots are committed.

The values in the fixtures are authored stress settings, not Area presets or values measured from a target product. Role recommendations use the shared layer model: body/backdrop acquisition, shading, texture, edge/reflection, emission and readable content remain distinct. The performance suite measures particular implementations of five channels, not all combinations of all 25 named styles.

## Findings

<!-- task19-superseded 11-performance/README.md ## Findings -->
> **Superseded policy — D1, D3, D14 (owner, 2026-10-11):** Area’s calm no-cast/Trace-only expression is the None default, not a material ceiling. Contrast, focus, fixed hover ink and semantic meaning remain hard limits. Ordinal caps and provisional control ranges are not limits. Numeric per-role strength multipliers and bounds must be calibrated to the board and contrast-tested at extremes; that work is pending tasks 20–22. Performance rules must follow measured workloads, not universal no-row-blur/static-only caps. Owner names a 60Hz minimum device; a later rerun includes Firefox. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

**Environment and validity.** The local host was an Apple M5 Pro with 24 GiB physical memory, macOS 27.2; installed Edge 154.0.4258.62 and Safari 27.2. The actual run environments are recorded separately: Edge viewport 1504×766, Safari 1472×793, both DPR 2 and the same 840×480 test stage. All three empty-stage cadence medians were 8.3ms in Edge and 17ms in Safari. Do not rank the browsers by raw p95 alone: they operated at different callback cadences and timestamp granularities. [Environment](environment.json), [Edge evidence](results/edge.json), [Safari evidence](results/safari.json).

Edge finished 378 trials: **363 valid**, with fifteen focus-loss trials retained but excluded. Every case still has at least two valid repetitions (111 cases have three; fifteen have two). Safari finished **378/378 valid**. All six cadence calibrations were valid. Source files, seeds and case recipes matched; the [analyzer](analyze.py) verifies their hashes and all expected case/repetition pairs.

**Selected results below are measured milliseconds**, median of valid per-trial p95s. Δ is the median **paired** difference against the zero-effect/solid baseline in the same repetition, not the difference of two independently aggregated medians. Thus displayed medians need not subtract to the displayed Δ. Full p50/p95 ranges, usable/paired counts, interval counts and slow percentages are in the [complete ledger](results.md); the table is a reading guide, not a browser ranking.

| Case | Workload | Chromium p95 / paired Δ | Safari p95 / paired Δ |
| --- | --- | ---: | ---: |
| c022 | 12px blur × 64 panes; scroll | 25.00 / +12.10 | 18.00 / +0.00 |
| c030 | 24px blur × 64 panes; scroll | 25.20 / +16.00 | 18.00 / +0.00 |
| c031 | 24px blur × 64 panes; animate radius | 25.05 / +15.85 | 18.00 / +0.00 |
| c125 | 24px blur × 64 panes; transform | 25.20 / +16.20 | 18.00 / +0.00 |
| c080 | 6 shadows × 1,000 rows; scroll | 9.00 / -0.30 | 18.00 / +0.00 |
| c081 | 6 shadows × 1,000 rows; animate alpha | 33.40 / +23.30 | 18.00 / +0.00 |
| c093 | 24-scale refraction × 16 panes; animate scale | 9.30 / +0.20 | 18.00 / +0.00 |
| c101 | SVG-image grain × 1,000 rows; animate position | 9.40 / +0.30 | 31.00 / +13.00 |
| c105 | Raster grain × 1,000 rows; animate position | 9.40 / +0.25 | 18.00 / +0.00 |
| c107 | Live grain × 200 rows; animate frequency | 9.10 / +0.10 | 161.00 / +142.00 |
| c109 | Live grain × 1,000 rows; animate frequency | 9.30 / +0.00 | 139.00 / +121.00 |
| c117 | Double-background stroke × 1,000 rows; animate angle | 9.10 / -0.20 | 18.00 / +0.00 |
| c121 | Masked stroke × 1,000 rows; animate angle | 9.30 / +0.10 | 18.00 / +0.00 |

**Blur scales badly with this pane grid in Chromium.** At 24px and 64 panes, scroll p95 was 25.20ms versus the 0px case’s 9.20ms, with every sampled valid interval above 1.5× calibrated cadence. Radius animation and transforming the still-blurred panes also stayed around 25ms. A single 12px pane remained at 8.90ms p95, but count and filtered area grow together here. These observations support sharing blur ownership; they do not establish a safe maximum number of arbitrary-size panes. Safari’s corresponding scroll/transform cases stayed around its 18ms case baseline; the run cannot show spare headroom below that cadence. Evidence: c006/c016/c022/c030/c031/c123/c125 in the ledger.

**Shadows need a static/animated distinction.** Chromium’s six-layer stacks on 200/500/1,000 rows had scroll p95s of 9.20/9.10/9.00ms, but alpha animation rose to 25.40/25.20/33.40ms. The 1,000-row animated case ranged 17.60–33.50ms across repetitions; the cost is not a deterministic linear function of row count. Safari’s same animated cases were 18ms. Only about thirteen rows intersect the viewport; the result does not say that painting a thousand visible six-shadow surfaces is cheap. Evidence: c076–c081; all 0–6 layers at all three counts are retained in the ledger.

**Grain implementation is decisive in Safari.** Live frequency animation on 200/1,000 rows produced median p95s of 161/139ms, compared with roughly 18ms baselines. Those cases contributed only 30/37 valid frame intervals across three trials, so tail percentiles are coarse, but the stalling is unambiguous. Moving a reused SVG-image grain tile at 1,000 rows produced 31ms; the generated raster tile stayed at 18ms. Chromium’s corresponding live cases stayed near baseline; its moved image/raster cases had modest slow-interval proxies (5.10%/4.03%) even when median p95 was only 9.40ms. Do not infer a universal ranking from one metric or claim identical visual output: the raster noise and SVG turbulence have different pixels. Evidence: c097/c101/c105/c107/c109.

**Owned-SVG displacement and gradient edges were bounded here.** The 16-pane animated displacement case was 9.30ms p95 in Chromium and 18ms in Safari, with paired deltas 0.20/0ms. Double-background and masked gradient strokes also had small p95 deltas, but Chromium’s animated 1,000-row mask still had a 4.63% slow-interval proxy. These tiny owned-art surfaces and clipped lists do not validate live HTML backdrop refraction, large masks or deeply nested materials. Evidence: c093/c113/c117/c121.

**Interpretation:** use the browser disagreement to choose conservative shared fallbacks, not to detect a brand and enable an unlimited effect. The proposed role budgets suppress repeated filters, preserve semantic paint and leave required focus/contrast independent. No paint/GPU trace was captured, so a delay is attributed to the tested end-to-end recipe—not to a claimed isolated shader, paint or compositor stage.

## Reproduction and verification

```sh
python3 docs/research/astra/materials/11-performance/serve.py
```

Open a **new visible** local browser tab at `http://127.0.0.1:8766/index.html`, preview the effects, then start the suite. Run each browser sequentially and keep the test tab focused. It takes about twelve minutes per browser. After both runs:

```sh
python3 docs/research/astra/materials/11-performance/analyze.py
python3 docs/research/astra/materials/11-performance/analyze.py --check
node --check docs/research/astra/materials/11-performance/bench.js
```

The [method](method.md#re-run) gives complete steps and caveats. A fixture edit requires new measurements; the analyzer will reject changed hashes. No production build or contrast test was needed because no production paint was changed. These checks validate the research artifact, not the proposed material’s accessibility or owner acceptance.

## Proposals

<!-- task19-superseded 11-performance/README.md ## Proposals -->
> **Superseded policy — D1, D3, D14 (owner, 2026-10-11):** Area’s calm no-cast/Trace-only expression is the None default, not a material ceiling. Contrast, focus, fixed hover ink and semantic meaning remain hard limits. Ordinal caps and provisional control ranges are not limits. Numeric per-role strength multipliers and bounds must be calibrated to the board and contrast-tested at extremes; that work is pending tasks 20–22. Performance rules must follow measured workloads, not universal no-row-blur/static-only caps. Owner names a 60Hz minimum device; a later rerun includes Firefox. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

1. **Use structural role caps first.** Zero independent backdrop blur on list/Table/Menu/Calendar rows; one owner per eligible glass group; keep text, glyphs and semantic fills outside decorative filters. The [twelve-role table](budgets.md#default-caps) states the numerical starting points and exceptions.
2. **Keep optical parameters static during interaction.** Use existing semantic state and shell motion. Compare actual production overlays before admitting animated blur, shadow stacks, grain frequency or displacement. Transform/opacity is a starting preference, not proof that a blurred layer is compositor-only. [Chrome animation guidance](https://web.dev/articles/animations-guide#animate_at_the_composite_stage), checked 2026-10-09.
3. **Preserve Surface and contrast ownership.** A material budget does not add shadows to in-flow controls or rewrite Toolbar’s existing special recipe. Required focus, boundaries and semantic state are never sacrificed to hit a timing number. [Area elevation](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/DESIGN_SYSTEM.md#L156-L165), [contrast/state](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/CONTRAST.md#L32-L64).
4. **Defer automatic quality switching.** The alternative could react to slower hardware, but a rAF probe cannot distinguish material cost from unrelated load. Explicit reviewed fallbacks are the more predictable starting point; [trade-offs and a proposed release gate](budgets.md#release-gate-proposal) are separate from observed measurements.

## Open questions

- What are Area’s minimum target hardware and 60Hz/120Hz goals? One modern Apple laptop cannot establish a universal budget.
- How do large single panes, overlapping/nested blur, real menus/dialogs, native touch/wheel scrolling and application work change the results? Fixed small-pane grids and scripted scroll do not answer those questions.
- What do GPU/compositor traces, memory and power measurements show? rAF cadence does not isolate those costs or certify actual displayed frames.
- Does cached grain remain favorable with the intended blend mode, texture scale and image content? The generated raster and SVG noise here are not visually identical inputs.
- Which numerical role caps should the owner accept? They remain conservative authored proposals, with accessibility and reduced-preference fallbacks taking precedence.
