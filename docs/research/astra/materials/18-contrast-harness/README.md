**Question:** Can a separate prototype find the worst text and required-edge contrast after composing material fill, gradient and a continuous backdrop range, and what happens to task 13’s eight presets in light and dark?

**Answer:** The prototype checks **433 bound text/indicator pairs per preset and mode**, covering all **213 text/required-indicator assertions** in the pinned Area contract and all **12 material roles** (including aliases and explicit N/A roles).
Across **6,928 probes per scenario**, the raw shell model has **29 text failures and 3 required-edge failures**, all in light Glass/Acrylic.
Opaque reading islands remove the text failures; **3 edge failures remain**: Glass container/float **2.4851:1**, Acrylic float **2.8827:1**, against a **3:1** floor over black.
The opaque F0 model passes all 6,928 bound probes; the other six presets and every dark preset pass these local WCAG probes.
An exterior required edge facing arbitrary unbacked content still reaches **1:1** at an interior backdrop, in every preset.
The search also reproduces task 08’s endpoint trap and a gradient-interior failure; it does not rely on black/white or gradient stops alone.
These are conditional numerical results for **neutral/blue**, not rendered conformance, a dark APCA pass, or approval to ship.

**Snapshot:** checked **2026-10-11**, after `git fetch origin`. Area `origin/main`: [`6a4307756ce06ddd008c0bc9d866f297fda9e8fd`](https://github.com/ethanwongwork/area/tree/6a4307756ce06ddd008c0bc9d866f297fda9e8fd); materials brief, task 08 and task 13 presets: research [`cf058e2b09670682a5e33a177b930af48bcdb511`](https://github.com/ethanwongwork/area/tree/cf058e2b09670682a5e33a177b930af48bcdb511/docs/research/astra/materials). The exporter resolves the pinned source rather than the current checkout. [Evidence ledger](evidence.md). No earlier folder, package or existing contrast test was edited.

## Evidence and deliverables

- [Interactive report](index.html): preset, mode, target and scenario controls, all twelve roles, every underlying pair, and the actual worst-case backdrop/composed-ground swatches. Serve it over HTTP as below.
- [Readable preset × role matrix](results.md), [CSV](results.csv), [summary](summary.json), [failures](failures.json). The row witness has the lowest **ratio / required threshold**, so mixed text/non-text floors are compared honestly.
- [Coverage and exact bindings](coverage.md), [bindings.json](bindings.json): all source assertions accounted for, including the 30 intentionally excluded aesthetic/disabled assertions. Body, tonal, placeholder, code, inverse and state pairings are included. Host bindings are authored fixtures, not claims about every component part.
- [Method and model boundary](method.md): composition, interpolation, continuous search, adjacency and unresolved inputs.
- [paint.py](paint.py), [check_scene.py](check_scene.py), [test_paint.py](test_paint.py): dependency-free checker, scene CLI and adversarial tests.
- [Frozen inputs](inputs.json), [exporter](capture-inputs.mjs), [report generator](build.py). Each `results-<preset>-<mode>.json` indexes [measurements.json](measurements.json); its fixture IDs resolve through `bindings.json`. No rounding is used for verdicts. Each JSON is below 1 MB.

The **requested** scenario deliberately probes the shell without its reading island; it diagnoses why the guard matters and is not a faithful full-component rendering. **Guarded** restores the opaque reading footprint but still tests required edges beside the transmitting shell. **F0** removes Material paint at the owner and preserves its opaque baseline. None silently repairs the reported failure. Decorative rims are never substituted for required boundaries.

## Findings

The light sources resolved from the pinned token code are `bg-surface = #ffffff`, `fg-muted = fg-placeholder = #666666`, and `stroke-control = #838383`. Glass’s authored 18% transmission makes a white shell over black `rgb(209.1,209.1,209.1)`; Acrylic’s 12% makes it `rgb(224.4,224.4,224.4)`. `stroke-control` then reaches **2.485083** and **2.882717**, respectively. Black is the minimizing backdrop for these particular presets; the checker searched the interior as well. [Source and reproduction](evidence.md#evidence-for-the-failures).

The 29 unguarded text failures comprise 20 Glass host-pair failures and 9 Acrylic failures. The darkest contrast is `fg-danger` on the transmitting shell: **3.689188** for Glass and **4.279488** for Acrylic. Repeated host roles are counted as separate probes, not distinct token defects. All 257 text and 5 mark bindings per mode pass once their reading/semantic core guard applies. [Every failure](failures.json); [per-preset results](results.md).

The exterior scene experiment is separate from the page-backed matrix: each of the 171 required-edge bindings per preset/mode can meet a backdrop with matching luminance. This is a **2,736-probe negative control**, including focus. Painting an opaque inside cannot fix the outside neighbor. F0 only supplies a passing local matrix when its outer neighbor is also the declared opaque page; it is not a cure for an unbacked exterior outline.

## Proposals

**Recommend:** retain the reading-island requirement and promote a failed required-edge comparison to the complete F0 owner recipe, as task 13 already proposes. If retaining a transmitting perimeter is necessary, bind an explicitly opaque required-cue backing/collar and verify both sides; this prototype does not invent its geometry or approve an alpha cap.

**Alternative:** constrain the supported backdrop domain and re-run `check_scene.py` with those channel bounds. That can admit more transmission, but the consumer must enforce the restriction for every image, crop, animation and nested scope. A more saturated edge or a stronger glow is not an automatic repair.

Existing token WCAG/APCA assertions, thresholds, exception policy and tests remain unchanged. This standalone WCAG result must be an **additional** record, never replace the dark APCA gate or the existing aesthetic tests. No source assertion was weakened to make a preset pass.

## Re-run and validation

From the repository root, using Python 3.10+:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s docs/research/astra/materials/18-contrast-harness -p 'test_*.py' -v
PYTHONDONTWRITEBYTECODE=1 python3 docs/research/astra/materials/18-contrast-harness/build.py --check
PYTHONDONTWRITEBYTECODE=1 python3 docs/research/astra/materials/18-contrast-harness/check.py
python3 -m http.server 8771 --bind 127.0.0.1 --directory docs/research/astra/materials/18-contrast-harness
```

Open `http://127.0.0.1:8771/`. To regenerate results omit `--check`. `build.py --check --gate` intentionally exits **1** for the retained requested-paint failures; normal report generation exits 0 because it successfully reports them, not because all probes pass.

To check a new explicit scene, run `check_scene.py --example` into a JSON file **in this folder**, then `check_scene.py <file>`. It exits 0 for model PASS, 1 for FAIL, 2 for UNRESOLVED/invalid input. No CSS or screenshot colors are guessed. RGB bounds are encoded sRGB [0,1]; stop positions are [0,1].

Refreshing the frozen token input requires Node with TypeScript support and Area’s installed dependencies, plus the two pinned Git objects:

```sh
node docs/research/astra/materials/18-contrast-harness/capture-inputs.mjs --deps-root /absolute/path/to/area --check
```

The exporter writes only this folder’s ignored `.cache`, imports token code from the exact SHA and verifies the task-13 JSON hash. Normal checking uses committed `inputs.json` and needs no Node dependencies or network. No dependency, build output or source cache is committed. [Verification record](verification.md).

## Open questions

- Actual component masks/cue adjacency, parent scopes and geometry are **unverified**. The fixture excludes optional relief, gloss, grain, gradient rims and halos from the comparison strip; a component that cannot enforce that must return UNRESOLVED or use F0. Task 13 gives no numeric mask clearance; none is invented here.
- The default neutral/blue selection is covered, not the full neutral × accent cross-product or custom consumer colors. Current semantic token assertions do not inventory all literal component colors or every part/state; that larger rendered audit remains separate.
- The dark APCA gate is preserved but **not executed by this numerical WCAG prototype**. APCA floors are retained in the binding data for a future composed extension. No local PASS is a combined WCAG/APCA verdict.
- Browser quantization, wide gamut, non-sRGB interpolation, parent opacity, multiple variable gradients, SVG refraction, hard stops and actual blur/image crops are outside this engine. Unsupported scene fields/paint modes fail closed. OS preferences, forced colors, assistive technology and perceptual legibility were not tested.
