**Question:** How should Area add the Material axis, scoped controls and recipe gates while preserving Surface pixels, independent geometry/type/ink, and correct portal inheritance?

**Answer:** Propose `material=none|glass|tactile|soft`, default None, with three inherited 0/1 recipe gates and disjoint input/role namespaces. Re-derive paint at scope boundaries and receivers; carry resolved controls in React context. The local Chromium experiment passes eight nested-scope cases and 64 Surface split comparisons with identical pixels and computed shadows. Four correct gate-off techniques leave zero changed pixels; four counterexamples show why numeric zero alone is insufficient. Preserve Tooltip/Toolbar under Flat during migration. Figma's verified API uses `radius` for Frost; no `frost` or `splay` field appears in the checked GLASS interface. Control ranges/defaults are proposals pending D3 calibration, not approved limits.

**Snapshot:** checked 2026-10-12, America/Los_Angeles. Area `origin/main` **4ea50618cf19e8737b607c9f983f64dd310d921d**; research **0169fb7b6d85a910a24a684f9b5b3b537a735956**. Read the [brief](../README.md), [D1–D16](https://github.com/ethanwongwork/area/blob/0169fb7b6d85a910a24a684f9b5b3b537a735956/docs/research/astra/materials/REVIEW.md#L120-L154), all files under `packages/tokens/src/axes/`, [base.ts](https://github.com/ethanwongwork/area/blob/4ea50618cf19e8737b607c9f983f64dd310d921d/packages/tokens/src/emit/base.ts#L1-L384), [css.ts](https://github.com/ethanwongwork/area/blob/4ea50618cf19e8737b607c9f983f64dd310d921d/packages/tokens/src/emit/css.ts#L1-L198), and [THEMING.md](https://github.com/ethanwongwork/area/blob/4ea50618cf19e8737b607c9f983f64dd310d921d/docs/THEMING.md#L1-L151). [Source ledger](source-ledger.json) pins hashes. No packages changed.

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
