# Verification record — 2026-10-08

## Source and package checks

`refresh-compat.py` reproduced 17 MDN BCD files and 12 Can I use feature files from the commits in the README. Each source file has a saved SHA-256; selected BCD features retain the original support notes and source line. Three Can I use MDN-bridge links are marked as shared provenance rather than independent feature records. `verify.py` checks local references, explicit control labels and unique IDs, per-file size, absence of public Area-token definitions or CSS registrations, and Area citation line ranges at the declared main commit. `verify.py --fetch` additionally checks the source hashes against the immutable raw files. Results were passing before commit. JavaScript passed `node --check lab.js`; Git whitespace validation passed.

No Area build or component checks were run: no production code, token source, spec, status, theme setting or generated build output changed.

## Actual local-browser observations

Served only this topic at `http://127.0.0.1:8765/` and inspected all three pages in the **Codex in-app browser**, using its ordinary 764 × 788 CSS-pixel viewport. This is a local rendering observation, **not a named-release Chrome, Safari or Firefox certification**. Full-page screenshots were inspected during the session; raw screenshots and logs are not committed. Source-reported versions remain in [compatibility.md](compatibility.md).

| Check | Observed result |
| --- | --- |
| Layer lab in light and dark | Rendered gradients, cast/inset effects, grain, glow, text relief and squircle enhancement. Dark page is near-black; teaching highlights are intentionally exaggerated. |
| Glass/edge page | Body text remained sharp over blurred stripes. The masked ring kept a translucent centre; the double background had an opaque centre. Border-image visibly retained square image corners. |
| Owned SVG scene | Right-hand grid/circle/rectangle artwork visibly displaced; left-hand reference and labels stayed undistorted. |
| Initial glass computed properties | `backdrop-filter: blur(14px) saturate(1.2)`; pseudo mask composite `exclude, exclude`; SVG scale `22`. |
| Keyboard slider updates | End on blur and SVG sliders updated their visible outputs to `36px` and `60`; SVG displacement attribute became `60`. |
| Simplify effects | Glass backdrop became `none`; body became opaque `rgb(255, 255, 255)`; decorative ring pseudo became `display:none`; SVG presentation filter became `none`. |
| Nested scope colours, light mode | Parent body `rgb(255, 255, 255)` / ink `rgb(32, 37, 48)`; child body `rgb(25, 36, 33)` / ink `rgb(237, 248, 239)`. Parent mixed tint `color(srgb 0.262745 0.368627 0.847059 / 0.22)`; child tint `color(srgb 0.521569 0.862745 0.682353 / 0.22)`. |
| Relative colour sample | Distinct computed OKLCH values: parent `oklch(0.572671 0.189038 269.458)` and child `oklch(0.866808 0.107309 159.73)`. These are observed demo outputs, not Area palette values. |
| Nested scopes, dark mode | Parent changed to body `rgb(23, 25, 31)` / ink `rgb(244, 245, 250)`; child retained its separate body and ink. |
| Hover ink | Parent action matched `:hover` and retained `rgb(32, 37, 48)`, its resting semantic ink. |
| Keyboard focus | Tab from parent action skipped the disabled button and reached the nested action; `:focus-visible` was true with a visible `rgb(133, 220, 174) solid 3px` outline. |
| Zero radius | Home on Radius produced `0px` and the enhanced shape rendered square. |
| Layout / diagnostics | No horizontal document overflow on inspected glass/scopes states; the gallery wrapped naturally at the default viewport. Scopes page returned no warning/error logs when inspected. |

The badge parsed backdrop blur, mask-composite, corner-shape, color-mix and relative colour syntax successfully in this browser. That was not used to infer cross-engine rendering, lens correctness or accessibility.

## Repeat the visual checks

1. Start the local server from the README and open `index.html`. Inspect every tile at the initial settings; select Dark and inspect again. Change gradient angle and radius. The angle is a paint control, not a live recalculation of every shadow vector.
2. Open `glass.html`. Observe stripes through the masked ring's centre and their absence beneath the opaque double-background centre. Inspect square border-image corners at nonzero radius. Move blur between zero and its maximum; compare sharp versus softened backdrop detail without blurred text.
3. Move body opacity through its range. Low opacity deliberately exposes potential readability failure: it is a research control, not a contrast-approved preset. Move SVG displacement from zero to maximum and compare the owned art. Select Simplify effects and verify opaque glass plus unchanged artwork.
4. Open `scopes.html`. Compare parent/child body, tint and relative-colour samples in both modes. Tab through links and controls, then enabled actions; disabled action must not receive focus. Compare the enabled actions' computed `color` at rest and hover. Set Radius to zero and back.
5. In each target browser, repeat at narrow and wide widths, zoomed text, forced colours/high contrast, reduced motion/transparency, adverse backdrops, real nested Area scopes and multiple stacked filtered surfaces before any production adoption. Keep those results separate from this lab's checks.

## Explicitly unverified

- Actual Safari and Firefox rendering; named-version Chrome execution; old prefix/partial-support versions. The compatibility table is documentary evidence only.
- Arbitrary HTML backdrop refraction using SVG URL filters; native Liquid Glass parity; OS wallpaper/behind-window material sources.
- Real Area styles and paired `light-dark()` values, every component/role, runtime Area theme restyle behavior and full axis combinations. The standalone demos intentionally supply local fallback colours.
- Forced-colour rendering, assistive technology, low-alpha text contrast across all scenes, narrow-device/touch behavior, reduced-transparency OS preference detection and all zoom levels. Fallback CSS and keyboard observations do not complete these checks.
- GPU/memory/frame costs, different display scale factors, SVG grain rasterization differences, screenshots as pixel-regression baselines, and combined masked-ring plus squircle geometry across engines.

These limits remain research gaps rather than component “Unverified:” spec edits or owner-approval changes.
