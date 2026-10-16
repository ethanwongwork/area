**Question:** Which existing systems supply materials, visual styles and adjustable controls, and does any open-source system already provide Area’s proposed material layer across components?

**Answer:** The broad “no open-source system does this” hypothesis is contradicted by OpenGlass UI’s shared glass controls and role-specific component recipes.
It is the closest direct precedent; daisyUI and Radix Themes supply narrower shared optical controls, while tweakcn exposes detailed theme/shadow editing.
Native Apple/visionOS and Fluent provide strong role-based material systems but constrain their optical parameters and platform scope.
Most other surveyed libraries provide semantic themes, elevation or recipe infrastructure rather than a shipped material abstraction.
No full match to the brief’s multi-material breadth and complete independently adjustable ingredient set was found within this survey.
Area’s plausible distinction is the breadth and separation of those controls, not inventing component-wide materials.

**Snapshot:** checked **2026-10-08**, America/Los_Angeles. Area `origin/main`: [`4c1854202a8e109479d5b83ef24a8325231da056`](https://github.com/ethanwongwork/area/tree/4c1854202a8e109479d5b83ef24a8325231da056); research base `2fff2b9427e550f4d6c623f65d2b1779033e04a2`. Read the unchanged [brief](../README.md) and task 01’s [layer model](../01-taxonomy/layer-model.md). Evidence: [27 survey entries](survey.md), [repository snapshots](source-lock.json) and [source integrity records](source-integrity.json). Docs use public URL + access date; public implementation links use full SHA + lines. Proprietary native internals are explicitly unavailable rather than assigned invented source pins.

<!-- task19-changes -->
## Changes after review — 2026-10-11

Task 19 corrections, with the reason from [Corrections for Astra and D1–D16](../REVIEW.md). Older Answer/Snapshot passages below retain their original date and findings unless explicitly refreshed; the changes here and decision callouts govern subsequent work.

- **C02 — Review reason:** Missing Figma Glass, Open Props, AuraGlass and liquid-glass prior art; OpenGlass scale was not weighed. **Change:** Added four source-pinned entries (27 total) and OpenGlass creation/listed-contributor metadata; bounded the verdict to the inspected implementations. Files: [survey.json](survey.json), [survey.md](survey.md), [source-lock.json](source-lock.json), [source-integrity.json](source-integrity.json), [verify.py](verify.py). Decisions: D15.

Full change ledger and verification: [19-corrections](../19-corrections/README.md).
<!-- /task19-changes -->

## How the hypothesis was tested

The tests below are **research criteria inferred from the brief**, not industry standards:

1. A supplied material recipe describes optical treatment beyond just palette, radius or typography.
2. A shared selection/parameter boundary reaches a component catalogue, with role-specific absorption rather than one background pasted on each element.
3. Parameters remain editable: body/stroke opacity, blur, highlights/light, shadows, glow, gradient structure and grain where applicable.
4. Source is available under a license permitting reuse; public marketing/docs alone do not establish an open implementation.
5. The broader Area brief also asks for materially different families and disjoint control ownership, preserving geometry, semantic emphasis, accessibility and theme context.

“All components” means the supported catalogue of the system under review, not every possible UI element. A material system can deliberately keep text plain and a field opaque. It does not need to put blur on each node. This survey checks API contracts and representative consumers, not every component/state in every library. An exact universal coverage claim remains unverified.

The [survey](survey.md) covers Apple HIG/Liquid Glass, visionOS, Fluent 2, Material 3, M3 Expressive, Radix Themes, shadcn/create, tweakcn, Chakra, Mantine, HeroUI, Park UI, Carbon, Spectrum, Polaris, Vercel Geist/community Geist UI, 98.css, 7.css, XP.css, NES.css, daisyUI, glass/neumorphism generators and OpenGlass UI. The latter two library additions test the hypothesis against plausible counterexamples rather than only mainstream color-theme systems.

## Closest matches and what is actually shared

These judgments synthesize the source-backed entries; links identify each evidence trail.

| Candidate | Shared selection | Adjustable optics | Role-aware component behavior | Remaining gap |
| --- | --- | --- | --- | --- |
| [OpenGlass UI](survey.md#openglass) | Nested design/theme/look boundaries | Blur, tint/opacity, saturation/brightness, rim/highlight, light angle/spread, lensing cue, shadow multiplier | Actual control, track/thumb, input and surface recipes | Glass-focused; no complete independent gradient/grain/shadow geometry schema; exact catalogue/state coverage untested |
| [daisyUI](survey.md#daisyui) | Themes plus opt-in glass class | Depth/noise in component recipes; blur/alpha/reflection controls in glass utility | Theme-aware components, but glass utility is an applied effect | No general role material resolver found |
| [Radix Themes](survey.md#radix) | Theme panelBackground | Panel alpha and backdrop blur through CSS tokens | Separate panel, field and overlay roles | One panel-material axis, not a complete optical system |
| [tweakcn](survey.md#tweakcn) | Generated light/dark tokens | Shadow color, alpha, offsets, blur/spread; ordinary theme knobs | Existing token consumers inherit output | Editor does not supply new optical layers/role recipes |
| [7.css](survey.md#7css) | Historical stylesheet and component variables | Glass-window paint, edges and shading | Distinct window/control treatments | One bundled visual language; component-specific knobs |
| [Apple / visionOS / Fluent](survey.md#apple) | Native material APIs and role policies | Semantic choices plus selective tint/behavior controls | Strong native context adaptation | Platform-specific implementations; no open, unrestricted all-material parameter contract |

The common baseline among the remaining systems is still useful: semantic foreground/background roles, elevation levels, component recipes and scoped themes. That is infrastructure on which a material layer can be built. It should not be represented as a supplied material layer unless actual material controls and consumers are present.

## Important version and interpretation boundaries

- **HeroUI:** the inspected v3 migration guide removes several v2 blur/shadow/radius props. The survey records both generations instead of describing v2 examples as current.
- **Polaris:** the source repository describes its React implementation as deprecated and its license as restricted to Shopify interoperability. The current Web Components overview is not interchangeable with the old React customization API.
- **Geist:** Vercel’s own guide really calls role presets “Materials.” The separate community Geist UI repository provides open theme interfaces; it is not Vercel’s internal source.
- **M3 Expressive:** expressive motion, shape and color defaults are supported by source; the name does not establish glass/refraction parameters.
- **Generators:** the Hype4 generator’s “refraction” label accompanies exported CSS without a displacement stage. Record the operation, not just its UI label.

Each boundary is documented with dated docs and pinned implementation lines in the corresponding [survey entry](survey.md).

## Proposals for Area

<!-- task19-superseded 02-prior-art/README.md ## Proposals -->
> **Superseded policy — D15 (owner, 2026-10-11):** Internal positioning is “the broadest multi-material layer with separable controls”; no public claim until it ships. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

**Positioning options:** claim a new material-layer category; claim a broader cross-material implementation of an existing idea; or postpone positioning until role/parameter coverage is tested. **Recommendation:** the second, with the third as a release gate. OpenGlass is concrete prior art, so an unqualified first-of-its-kind claim would be unsupported.

**Architecture options:** replace Surface, expand Surface to own all optics, or keep new optical inputs beside Surface. **Recommendation:** keep task 01’s third option for now. Surface already owns decorative width and elevation under [surface.ts lines 21–40](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/packages/tokens/src/axes/surface.ts#L21-L40); disjoint namespaces and scope derivations remain required by [DESIGN_SYSTEM lines 20–27](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/DESIGN_SYSTEM.md#L20-L27). OpenGlass demonstrates propagation and role absorption worth studying, but copying its coupled font/shape/motion changes would conflict with the brief’s separation goals.

**Next evidence:** use [BASELINE](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/BASELINE.md#L1-L25) and existing [Button](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/button.md#L1-L7), [Slider](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/slider.md#L1-L8) and floating-surface evidence to test absorption. Compare one material across those roles before promising catalogue-wide behavior. No component/spec/token changes or approvals are made by this research.

## Open questions and limitations

- **Not found:** a complete multi-family, fully parameterized match within the listed docs, theme schemas and representative recipes. This bounded result cannot prove absence across the entire open-source ecosystem.
- **Unverified:** all-component/all-state propagation, portal/nested-scope behavior and accessibility in the closest candidates. Source demonstrates implementations, not successful browser/assistive-technology execution by Astra.
- Apple HIG’s plain URL returned a JavaScript shell; its indexed public documentation and WWDC/API pages supplied readable evidence. Material’s public design pages also returned shells, so Android’s public APIs and Compose source anchor those claims. Carbon/Park hosted documentation attempts failed; their pinned modules were read instead. Spectrum’s old color-system URL returned 404; the current background-layers page was used.
- AndroidX’s recursive repository tree was truncated; the exact material3 paths were fetched directly. No whole-repository negative claim relies on that tree.
- OpenGlass documentation has inconsistent release labels: THEMING says 0.4.0 while LIMITATIONS still says 0.1.0. The commit pin, not an inferred published-package version, defines this survey. No independent performance/contrast certification is implied.
- Which subset of optical knobs is worth exposing, and how far can different materials preserve Area’s near-black theme and required edges? Tasks 03 and 07–11 must answer those separately.

## Reproduce

`read-sources.py` reads public snapshots with GitHub CLI and downloads selected files into a disposable `.source-cache/` inside this topic. `source-lock.json` freezes repository commits. `source-integrity.json` records SHA-256 and line counts for inspected files; it does not vendor their content. `survey.json` is the authored survey data; `verify.py` checks local references, coverage and pinned source ranges, and regenerates the Markdown with `--render`.

```sh
python3 docs/research/astra/materials/02-prior-art/verify.py
python3 docs/research/astra/materials/02-prior-art/verify.py --fetch
```

The optional fetch verifies immutable upstream file hashes and needs network access; default validation is offline. Use `read-sources.py catalogue` only for a deliberate refresh, because it resolves new heads; then update dates and claims. Scripts resolve paths relative to themselves. Caches, upstream clones and raw logs are not committed. No component builds are necessary for this research-only change.

## Verdict

<!-- task19-superseded 02-prior-art/README.md ## Verdict -->
> **Superseded policy — D15 (owner, 2026-10-11):** Internal positioning is “the broadest multi-material layer with separable controls”; no public claim until it ships. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

**Yes, there is open-source prior art for a shared adjustable material treatment across a component system.** OpenGlass UI’s MIT license, public GlassLook inputs, provider propagation and distinct Button/Switch/Input consumers directly establish that narrower claim: see the [pinned evidence](survey.md#openglass). It is the nearest match found, with daisyUI, Radix Themes and tweakcn covering useful subsets.

**No complete match to the full Area brief was found in this bounded survey.** OpenGlass concentrates on glass and lacks the brief’s complete independently adjustable multi-material ingredient model; the other candidates fall short on parameter breadth, supplied role mapping, openness or platform portability. The evidence supports “broader, more separable materials across roles” as an Area research opportunity. It does not support “nobody has built a material layer.”

## Current verdict after task 19

The added [AuraGlass](survey.md#auraglass) provider is another concrete glass system with shared transparency/contrast controls and semantic component tokens; OpenGlass is not the only direct precedent. [Open Props](survey.md#open-props) supplies reusable parameterized shadow and noise ingredients, [Figma Glass](survey.md#figma-glass) supplies an editable effect contract, and [Liquid Glass Web](survey.md#liquid-glass-web) supplies a browser renderer. None of the inspected APIs demonstrates the brief's complete multi-material, per-role, separately adjustable layer model. This is a bounded source comparison, not a claim that none exists anywhere. OpenGlass's one listed contributor and July 2026 repository creation date reduce the evidence for maturity, not the existence of its implementation. D15 therefore governs positioning: internal breadth/separation only; no public superiority claim before shipping.
