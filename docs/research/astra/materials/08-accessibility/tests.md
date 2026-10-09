# Additive contrast verification proposal

**Proposals only.** Source observations refer to Area `6f896789a5200bcbd34fe87de458e60ca82141d6`; exact pins are grouped in [A1–A8](evidence.md#area-sources). No production test, baseline or exception file is changed by this report.

## What exists and what it does not prove

| Existing source | Current behavior | Material extension needed |
| --- | --- | --- |
| `packages/tokens/src/contrast/assertions.ts` | Semantic text/state/focus pairings plus separately identified aesthetic stroke floors. | Preserve every assertion; attach new recipe/role/scene pairings with the correct requirement classification. A faint decorative edge's floor cannot certify a required glass field boundary. |
| `contrast/contrast.test.ts` | Rejects nonopaque hex pairs before testing; WCAG across shipped themes and APCA in dark. Includes a deliberate failure test. | Keep that guard. Add a separate compositor/scene suite rather than stripping alpha or passing unresolved tokens to the existing helper. |
| `contrast/exceptions.ts` and `report.ts` | No active exceptions at the snapshot; report retains worst values and separates waived results. | Add no material waivers. Aggregate by scene/role and preserve failures, unresolved coverage and browser/OS status separately. |
| `apps/docs/src/lab/contrast-checks.ts` | Parses RGB/sRGB alpha, composites foreground onto one opaque ground, walks past translucent ancestor backgrounds; checks representative fields/marks/focus/clipping. | New resolved scene oracle must account for alpha backgrounds, gradients, images, filters and masks. Do not silently expand the meaning of its existing “pass.” |
| `packages/styles/src/forced-colors.css`, component-local rules | Existing system-color mark/edge/focus paths, some targeted `forced-color-adjust: none`. | Exercise real material layer removal; preserve every existing mark path; add explicit removal of decorative URL/SVG assets and new optical paths. |
| `emit/css.ts` and motion consumers | Scoped derivation and OS contrast/motion paths. | Material preference caps must re-derive at local boundaries and cancel any future JS/SVG effects, not only durations. |

This is a bounded source review, not a new measured production regression finding. The browser fixture is useful for its current opaque specimens; its opaque-ancestor helper is insufficient as a future glass validator.

## Proposed layers of tests

### 1. Keep the current token gate intact

Retain `npm test` and `node packages/tokens/src/contrast/report.ts` as required for any eventual token/color/focus change. Keep WCAG thresholds, dark APCA floors, palette values, shipped-theme coverage and active-exception reporting. Preserve APCA as supplementary policy, not a replacement conformance calculation. Existing disabled-label floors also remain even where WCAG exemptions apply; loading/read-only content must not be mislabeled inactive just to skip it. [Current verification/limits](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/CONTRAST.md#L66-L76), [gate](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/contrast/contrast.test.ts#L21-L91).

Keep existing focus APCA assertions where present; do not substitute the generic non-text APCA value or remove a supplementary floor because a material is difficult to tune. A consumer's arbitrary color overrides are not covered by preset results.

### 2. Add analytical material-scene tests

Proposed modules under the contrast package (future implementation): a typed scene descriptor, a declared-space compositor, and `material-contrast.test.ts`. Feed them the calibrated recipes and task 04 binding metadata, not duplicated hand-picked test colors.

Require:

- Explicit semantic foreground/core, alpha, ordered paints, interpolation/compositing space, filter/mask support, parent/backdrop domain and requirement class.
- Raw floating-point ratios for pass/fail; format only for display. APCA uses actual text/ground composition, preserving the existing policy. If its implementation needs channel quantization, retain and report that transformation rather than pretending the WCAG calculation used the same rounded inputs.
- Analytic bounds for supported simple domains. Unknown blend/filter/gamut/geometry returns `unresolved`, not an opaque approximation and not a skipped passing assertion.
- Minimum over actual valid positions, scenes, states and control domains. Test interpolation interiors and allowed parameter combinations; setting every control to its maximum is not guaranteed to be the worst case.
- Scope re-resolution: root dark → glass → nested accent/tone, compact, more/standard, control-only marker and portal reproduction. Use local semantic sources and leave derived/paired colors unregistered.

Positive controls: known opaque passing pair; matching generated identity recipe leaves existing paint unchanged; qualified opaque fallback passes after an intentionally hostile backdrop. Negative controls: alpha zero with no opaque backing, equal-luminance interior gradient, the endpoint counterexample, pale shadow-only required mark, invisible focus, missing system-color selection mark. The research [experiments](experiments.py) provide two reproducible negatives to port; they are not the production suite.

### 3. Add browser material fixtures without shrinking opaque coverage

Extend or supplement `contrast.html`'s source fixture and `runPaintChecks` with a separate controlled optical stage. Because the docs handoff reports archived lab routes, verify the actual reachable fixture route in the tested build rather than assuming the historical URL still renders the lab. [Current handoff L21–32](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/.Codex/HANDOFF.md#L21-L32).

Generate actual part bindings and context cases from the material schema; do not paint all 25 styles on a root Button and call the library covered. At minimum include:

| Fixture | Failure it must catch |
| --- | --- |
| Glass Panel containing Table and CodeBlock | Descendant alpha/blur duplication, noisy reading ground, syntax and thin row-rule loss. |
| DatePicker Popover with plain Calendar | Double shell optics, disconnected range/today cues, focus on day/toolbar across body boundaries. |
| Message list plus Composer/field | Lensing through prose, label/placeholder contrast, simultaneous focus+invalid. |
| Slider/SliderRange and Switch | Missing thumb/track contrast, glow changing apparent fill extent, native pseudo-element differences. |
| Button/Tag/Chip/Segmented in a toolbar | Dense repeated gloss, selected mark disappearing, low-boundary outline misclassification. |
| Popover/Menu/Tooltip/Dialog and their arrows/scrims | Required marks lost with cast removal, clipping at glass masks, focus obscuration, shared-shell ownership. |
| Literal ColorPicker/Swatch and intrinsic media | Blanket system/material recoloring destroying the information being shown. |

Each style has a specific hostile scene in [styles.md](styles.md). Exercise all supported **style-role applications**, not just one representative per style. A role with no permitted material still needs an invariance check: selecting a strong recipe must not decorate code ink, scrims or nonpaint targets. Finite scene coverage is an enumerated regression suite, not a universal conformance assertion.

Use the controlled paint procedure in [method.md](method.md), actual keyboard focus, screenshots for geometry and the repository capture helper for supported computed measurements. Unsupported alpha/gradient/filter formats must abort a claimed result with a diagnostic. Do not let `parseFloat` of an unknown color or missing pixel region become zero and accidentally pass.

### 4. Preference combinations and interaction

Test each supported preference alone and jointly: T+C, T+M, C+F, F+M and all reductions together; both enabling and disabling them while a control is focused, an overlay is open and a decorative animation is running. Include no-preference/default and unsupported query/optical feature paths. `more`, `less`, `custom` and explicit app settings need distinct cases.

Check effective rendered outputs rather than only media-query booleans: opaque fallback has no scene acquisition, functional scrim remains sensible, background URL noise is removed where required, focus/state marks survive, JS/RAF and SVG effects stop, no state/value/geometry is reset. Test that a nested author's inline `glow`/`blur` request cannot defeat effective user reduction. Because current `standard` contrast scope behavior differs from the proposed material policy, add explicit before/after expectations for any approved policy change.

### 5. A failure record that can be reviewed

Proposed required fields:

```text
snapshot, recipe ID/version, style, role, part, shared-shell owner
axis selections, material/Surface inputs, state, preference inputs/effective mode
browser/version, OS, viewport, scale/zoom, interpolation/compositing space
backdrop ID/domain, crop/frame/seed, nested layers and masks
criterion or Area-policy assertion, cue/ink source, local ground, coordinates
required floor, unrounded minimum, APCA when applicable
coverage: proved-bounded | sampled | unresolved | not-executed
status: pass-within-stated-domain | fail | blocked
artifact/capture reference, fallback selected, fallback result
```

A ratio-only summary loses the reason a glass specimen passed. A fallback result is reported alongside the rejected optical path, not used to erase its failure. CI for supported shipping profiles fails on a below-floor result, absent required cue, unsupported claimed path or unresolved required coverage. Exploratory unsupported recipes remain explicitly blocked/unshipped; they do not inflate passing counts. No threshold waiver is added to make an attractive style green.

## Exact manual execution plan

These are proposed steps for later implementation, **not tests performed here**.

1. Build the pinned/reviewed candidate, run the unchanged token tests and report, then open the reachable material fixture in a visible browser. Record build SHA, OS/browser version, viewport, zoom and scale. Use the app's test preference controls/emulation first; changing the owner's OS settings requires authorization.
2. For each recipe/role binding, select light and dark, default and compact, supported semantic/tone/emphasis states and declared control bounds. Cycle the listed synthetic backdrop scenes, allowed image crops, intermediate-luminance collision and nested glass. Record worst location and coverage. Restore state between cases.
3. Enter via Tab and Shift+Tab, then use the component's real arrow/Space/Enter interactions. Open overlays, select a value, set invalid state through the fixture and keep focus visible. Scroll past sticky content, resize/crop, and inspect corners/clip edges. Confirm marks remain when optional glow/shadow is set to zero. Check AA visibility/obscuration independently of optional AAA area/change metrics.
4. In Chromium, Firefox and Safari environments available to the tester, record actual support and emulation capability; do not infer one engine's result from another. Exercise reduced-transparency, all contrast values, forced-colors and reduced-motion through available emulation. Unknown/unavailable emulation is logged unexecuted, not a match to no-preference. Emulation checks CSS response only.
5. With authorized OS changes or a dedicated test machine, verify native preference propagation. MDN points to macOS Accessibility → Display → Reduce transparency, iOS Accessibility → Display & Text Size → Reduce Transparency, and Windows Personalization → Colors → Transparency effects. Toggle back to the original state after testing. Separately use Windows native contrast themes with both light and dark/custom palettes, actual keyboard interactions and screenshots. [MDN preference mapping](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency). Log exact settings tested rather than asserting every palette passes.
6. Check CSS optical fallback by disabling the relevant supported feature in the fixture, removing a texture/lens asset and loading the unsupported-backend path. Confirm opaque fallback and required marks, not an empty or clearer pane. Test preference changes mid-animation and inspect running animations/RAF ownership.
7. With VoiceOver/Safari and a Windows screen reader/browser combination on available test systems, verify that effect fallback has not hidden meaningful content, duplicated labels, changed focus order or removed selected/invalid/loading announcements. This checks semantics preservation, not visual contrast. User testing for glare, strain or low-vision readability is additional evidence; numerical contrast alone cannot supply it.

A local repository/browser is sufficient for deterministic calculations, controlled fixtures and supported emulation. Native preference propagation/Windows contrast themes need those environments; screen-reader checks need assistive technology and interaction. None requires signing into target products. A research-only script cannot close those execution gaps.
