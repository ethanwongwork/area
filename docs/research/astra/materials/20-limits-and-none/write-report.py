"""Render the hand-authored report with immutable source links."""
from pathlib import Path
import sys
H=Path(__file__).resolve().parent
A='https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/'
R='https://github.com/ethanwongwork/area/blob/dbd57a9067e3d927b2bfb7a061db074eeaf48db9/'
def save(name,s):
 text=s.replace('{A}',A).replace('{R}',R).strip()+'\n'
 if '--check' in sys.argv: assert (H/name).read_text()==text,name
 else: (H/name).write_text(text)
save('defaults.md','''
# Restraint that belongs to None

D1 moves the earlier no-shadow/no-label-effects/Trace-container ceiling into None's defaults. It does not relax contrast, focus, fixed hover ink, semantics or preference fallbacks. D13 adds the more specific rule: **no automatic** decoration of glyphs or small text, with explicit opt-in for display and button labels. D16 keeps the content ink and geometry owned by other axes even when an optical text treatment is opted into. [REVIEW.md:120–123]({R}docs/research/astra/materials/REVIEW.md#L120-L123), [REVIEW.md:147–154]({R}docs/research/astra/materials/REVIEW.md#L147-L154).

## N1 — In-flow controls have no resting cast

**Encoded today:** DESIGN_SYSTEM explicitly says in-flow fields/controls have no shadow and reserves shadow-1 for raised thumbs. Button starts `--_shadow:none` and documents no shadow on any variant. Input's resting shell and soft variant explicitly use `box-shadow:none`. The compiled-CSS cohesion test demands shadowless fields. [DESIGN_SYSTEM.md:159–168]({A}docs/DESIGN_SYSTEM.md#L159-L168), [button.css:49–56]({A}packages/styles/src/components/button.css#L49-L56), [button.css:319–325]({A}packages/styles/src/components/button.css#L319-L325), [input.css:43–66]({A}packages/styles/src/components/input.css#L43-L66), [cohesion.test.mjs:82–90]({A}packages/react/tests/cohesion.test.mjs#L82-L90).

**None contract:** keep those existing declarations and behavior. Do not replace every `box-shadow` with none: field focus halos, raised thumbs, Card, docked Panel, floats and literal exceptions already have paint. Preserve current selectors, including focus and autofill paths, and the selected Surface preset.

**Other materials:** D1 permits a control's decorative relief/cast; required focus must remain independent. The existing shadowless-field test should remain a baseline/None check when implementation arrives. Add material-specific cases rather than deleting it or keeping an unconditional scan that makes D1 impossible. No test is changed in this report.

## N2 — Plain labels and glyphs by default

**Encoded today:** body text sets semantic foreground/font metrics; Field labels set type and `fg-default`; Button consumes its resolved foreground. These are positive examples of plain semantic text. There is **no global `text-shadow:none` rule or all-label no-effects test found** in the scanned production sources. The source search finds no `text-shadow:` declarations in packages/styles/src, packages/tokens/src or packages/react/src at this SHA. That is an absence observation, not a cascade guarantee for consumer CSS. [base.css:5–14]({A}packages/styles/src/base.css#L5-L14), [field.css:20–28]({A}packages/styles/src/components/field.css#L20-L28), [button.css:89–98]({A}packages/styles/src/components/button.css#L89-L98), [source-search.json](source-search.json).

**None contract:** add no text/gloss/glow/engraving/gradient-glyph treatment and preserve original computed ink, SVG geometry and text shaping. Do not add a blanket `filter:none`, `text-shadow:none` or `background-image:none` reset to every descendant: that can erase an existing functional effect or an explicit consumer style. For example ColorPicker's band edge already has a functional drop-shadow filter. [color.css:374]({A}packages/styles/src/components/color.css#L374-L374).

**Other materials:** automatic host-wide effects that leak onto ordinary text/glyphs are still barred by D13. An explicit display/button-label treatment may add optical effect paint around unchanged ink; it must not rewrite foreground, type size/weight or glyph geometry. A label gradient that replaces the semantic ink is not admitted solely by calling it a material. Duotone needs the later pilot. A separate ink/type bundle is subject to D16, not a loophole in Material.

## N3 — Quiet containers, not a universal Trace cap

**Encoded today:** Surface describes restrained close shadows; Card consumes a faint measured halo, removes its halo in dark, and paints an opaque surface ground. In current main, Elevated Card restores its dark edge with an outline when Surface removes the decorative frame. Those details are part of today's identity. [surface.ts:1–18]({A}packages/tokens/src/axes/surface.ts#L1-L18), [surface.css:65–74]({A}packages/styles/src/components/surface.css#L65-L74), [surface.css:100–111]({A}packages/styles/src/components/surface.css#L100-L111).

There is **no production Material amount or numeric Trace cap found**. The blanket “containers at most Trace” was research policy, now explicitly superseded. It is not a literal Area CSS setting. The binding review names the mistake; task 19 preserves the old proposals with decision callouts. [REVIEW.md:17–36]({R}docs/research/astra/materials/REVIEW.md#L17-L36), [19-corrections/README.md](../19-corrections/README.md).

**None contract:** preserve each existing container's actual fill/alpha, border, shadow, nested body and state wash, rather than flattening everything to a new uniform quiet container. Some container-role records are layout-only; None does not invent a painted box around them. The role map is context, not a CSS reset list.

**Other materials:** D1 allows stronger shells, including rich containers, while content contrast and semantic states remain hard limits. Numeric absorption strengths await calibration under D3. Do not reinstate no-blur-on-rows or a shadow-layer ceiling as an accessibility law; D14 requires measured performance policy.

## Existing exceptions must remain visible in None

None is independent of Surface, including Flat, Outlined, Raised and Elevated. The Surface axis defaults to Outlined; Flat currently removes token elevation but does not remove all literal component shadows. Toolbar's bar has a literal multi-layer recipe, and Tooltip has a smaller literal shadow. None must preserve these too until a separately proven pixel-identical D2 migration changes their ownership. It must not confuse None with Surface Flat, Motion None or opacity zero. [surface.ts:21–82]({A}packages/tokens/src/axes/surface.ts#L21-L82), [toolbar.css:20–35]({A}packages/styles/src/components/toolbar.css#L20-L35), [surface.css:1395–1401]({A}packages/styles/src/components/surface.css#L1395-L1401), [REVIEW.md:124–127]({R}docs/research/astra/materials/REVIEW.md#L124-L127).
''')
save('none-and-proof.md','''
# None: identity contract and proof protocol

This is a proposed acceptance protocol, **not a completed pixel comparison**. No production Material axis or selector is present in the pinned packages. Adding an unused `data-area-material="none"` attribute today would prove only that an unknown attribute does nothing. [source-search.json](source-search.json). D4 makes None the default and D2 requires a pixel-identical Surface refactor first. [REVIEW.md:124–132]({R}docs/research/astra/materials/REVIEW.md#L124-L132).

## Definition

For a fixed component tree, content, state, viewport, browser, fonts, theme/neutral/accent/action/selection, type, density, radius/pills, Surface, motion and preferences, **the candidate with Material omitted at the root or explicitly None renders the same pixels and has the same geometry, ink, accessibility and behavior as Area at `d455567e5b264a768f42dc853476f1622ed6dd9f`**. This pins “today”; it is not a moving comparison against whichever branch happens to be checked out.

None contributes **zero additional material paint**, not zero total paint. Existing borders, shadows, focus halos, fills, gradients, masks, intrinsic images, semantic filters, disabled alpha, transitions and consumer overrides remain exactly as before. It does not force an opaque fill on every receiver, set all shadows to none, change the Surface axis, register colors, remove existing pseudo-elements or change wrapper layout. New internal gates may have neutral values; emitted effective paint must be unchanged.

Root omission resolves to None. In a future material subtree, omission inherits the parent's selection; **explicit None resets that subtree's material recipe and optional material controls**. Merely omitting declarations is insufficient if parent gates/effects inherit. D2's gated implementation must ensure a nested None does not inherit new gloss, grain, text effects or blur. A non-None child inside None works independently. Current Theme already merges omitted axes and establishes portal boundaries, while CSS re-derives cross-axis values at local attributes. [Theme.tsx:8–32]({A}packages/react/src/components/Theme.tsx#L8-L32), [css.ts:173–184]({A}packages/tokens/src/emit/css.ts#L173-L184).

A nested None cannot undo the scene behind it. If a transparent baseline component sits on an ancestor's glass, it still sees that ancestor. Compare that nested child with the **baseline child on the same ancestor ground**. Do not demand that disabling a child's material erases the parent's material, and do not apply ancestor filters to a shared subtree in a way that makes the reset impossible.

D13's opt-in label effects are off in None. D16 means a reset changes neither type nor semantic ink; a multi-axis bundle may select another density or Surface only as a separately declared change. [REVIEW.md:147–154]({R}docs/research/astra/materials/REVIEW.md#L147-L154).

## 1. Pin two genuinely independent builds

A is unmodified Area at the SHA above. B is the future Material implementation at a recorded candidate SHA, including any Surface decomposition. Record source SHA, lockfile, CSS/JS asset hashes, browser/Electron build, OS, graphics backend, fonts with hashes, viewport, DPR, zoom, locale/timezone and preference state. Compare A and B with the **same pinned gallery content** so an unrelated new demo, name or font update cannot be mistaken for a material difference. Record separate changes to candidate gallery content rather than silently accepting a different inventory.

Keep builds and generated captures in an isolated ignored harness area; source for any eventual harness belongs in this research folder until implementation is authorized. No build or production harness is added by task 20. The app is now the source of truth; use the app or its same-app browser preview, not the archived docs gallery. The current preview command can close another dev window, so a later runner must serve isolated prebuilt outputs or use the documented no-Electron path without disrupting a running owner session. [README.md:18–34]({A}README.md#L18-L34), [DEVELOPMENT.md:43–49]({A}docs/DEVELOPMENT.md#L43-L49).

## 2. Enumerate the app's actual specimens

Build the expected list from `COMPONENT_PAGES.filter(f => !f.docsOnly)`, `componentSpecimens(f, name => name in DEMOS)` and the **actual imported registry**, then use the same IDs, ordering, wrappers and demo components as `tilesOf`/`Demo`. Key cases by `family.slug/specimen.id`, not a displayed label or DOM index. Fail on missing/duplicate demos, fallback error tiles or mismatched source/DOM inventory. Do not hardcode task 19's 101 contracts or 773 parts: those are a different snapshot and a different unit from gallery families/tiles. [components.tsx:17–25]({A}apps/desktop/src/pages/components.tsx#L17-L25), [components.tsx:41–71]({A}apps/desktop/src/pages/components.tsx#L41-L71).

The All canvas lazily mounts family sections. Traverse every family and await its actual specimens; an initial screenshot of All misses offscreen families. `componentSpecimens` also excludes verification/theme/stress/RTL fixtures: enumerate the rendered gallery exactly, **then add** those excluded fixtures as explicit verification cases rather than pretending gallery coverage includes them. Keep a coverage ledger of rendered, missing, unsupported and state-not-applicable cases. [components.tsx:133–145]({A}apps/desktop/src/pages/components.tsx#L133-L145), [specimens.mjs:1010–1019]({A}apps/desktop/src/content/specimens.mjs#L1010-L1019).

## 3. Execute the mode/density matrix without confusing type with density

Minimum: every specimen in **Light/Default, Light/Compact, Dark/Default, Dark/Compact**, at fixed type 14, radius/pill defaults and matching Surface/neutral/accent/action/selection. Use current `data-area-density`, not an old `data-area-ui` assumption. Latest main separates type and density and also offers Comfortable. Add Light/Comfortable and Dark/Comfortable as current-axis regression cases; add type 13/Compact for app chrome and its preserved scope. Verify the computed effective density and heights: type bounds can clamp density, so distinct attributes alone are not coverage. [controls.ts:25–40]({A}apps/desktop/src/gallery/controls.ts#L25-L40), [density.ts:1–20]({A}packages/tokens/src/axes/density.ts#L1-L20), [app-scale.ts:1–6]({A}apps/desktop/src/app-scale.ts#L1-L6).

For each minimum context run B twice: root Material omitted and explicit None. Add all four Surface presets (especially Flat and Elevated), every radius including Sharp/pill, relevant tone/action/selection variants and CSS/plain-HTML versus React scopes. Include root None → inherited None; material parent → explicit None; None parent → material child; theme/contrast/density override inside None; and a portal overlay with the same resolved Theme. Cross-axis cases are an extension of the minimum, not an excuse to skip any gallery specimen in the core matrix.

App controls change Canvas axes only; app chrome stays compact. Capture both the specimen and a whole-app frame so an accidental inherited reset of Titlebar/Sidebar/Inspector is caught. [canvas-settings.tsx:1–5]({A}apps/desktop/src/canvas-settings.tsx#L1-L5), [tile.tsx:65–87]({A}apps/desktop/src/tile.tsx#L65-L87).

## 4. Stabilize state and sampling

Await hydration, `document.fonts.ready`, decoded images and complete fitting. The app's fit uses CSS zoom and measures natural size; compare the fitted gallery at identical zoom **and** a native 1× specimen view. Do not add a test-only scale that hides geometry differences. [components.tsx:120–130]({A}apps/desktop/src/pages/components.tsx#L120-L130), [fit.ts:4–21]({A}apps/desktop/src/gallery/fit.ts#L4-L21).

Fix date, clock, random seeds, timezone/locale and image fixtures in both builds. Do not mask a changing Calendar or loading indicator out of the comparison. For a normal-motion loop, pause both animations at the same sampled times through the test runner and compare animation metadata; separately exercise transitions at matched start/intermediate/end times. Also run actual reduced motion and verify its stopped/static state. Do not globally set `animation:none` and call normal-motion identity proved. Hide only the test pointer/caret consistently if required, with that exclusion recorded; no component region gets a silent pixel mask.

Capture rest, real pointer hover, held press, keyboard focus-visible, selected/checked/indeterminate, open, disabled, read-only, loading and invalid wherever supported. Include selected+hover, selected+focus and invalid+focus. Exercise real interactions; adding a data attribute alone cannot prove native focus or popover behavior. Open overlays must be captured with their top-layer/backdrop/portal context and clip extents, not just the closed trigger or a tile-local crop. Compare state transitions and target/focus behavior as well as settled paint. [CONTRAST.md:44–79]({A}docs/CONTRAST.md#L44-L79).

## 5. Compare resolved styles and geometry

For every matched DOM element and painted pseudo-element (`::before`, `::after`, `::marker`, `::placeholder`, `::backdrop` where applicable), record:

- Border/content rects, client/scroll dimensions, box sizing, logical padding/margins/gaps, border widths, radii/corner shape, outlines/offsets, clipping/overflow, transform/translate/scale/rotate, zoom and containment/stacking properties.
- Resolved foreground/background layers and their sizing/position/blend, border/outline colors, complete ordered box/text shadows, opacity, filter/backdrop-filter, mask/clip paths, SVG fill/stroke/stroke-width/vector-effect and all effect-bearing pseudo content.
- Font family, loaded face, size, weight, style, line height, spacing, font features/variation axes, text decoration, text-box trimming, text content/wrapping and range rectangles. Record input values, placeholders and selection state.
- Display/visibility, pointer-events, native appearance, forced-color-adjust, color-scheme and transition/animation properties; stable accessible roles/names/states, tab order and focused element.

Compare all standard computed properties, plus explicit geometry/text/SVG observations; the list above is a required checklist, not an allowlist that can hide an unexpected new property. Stable semantic DOM paths are required when IDs differ between identical React builds. Normalize only generated ID references consistently; never normalize away user-visible text, dimensional changes or color values. Keep original strings alongside any parsed equivalence representation.

Do not compare raw `--area-*` strings as the color verdict: paired `light-dark()` expressions and renamed decomposition tokens can differ while actual paint is equal. Conversely, equal token strings do not prove the backdrop or gradient is equal. Inspect real consuming properties and rendered pixels. Internal neutral gate variables may legitimately be added; any new painted node or pseudo must be proven visually and behaviorally inert in None. [THEMING.md:84–99]({A}docs/THEMING.md#L84-L99), [colors.test.ts:15–23]({A}packages/tokens/src/emit/colors.test.ts#L15-L23).

Computed styles alone miss rasterization, SVG filter outputs, image pixels, native widget internals and composited scene effects. They provide diagnosis; the screenshot comparison supplies the pixel claim.

## 6. Pixel diff with an honest pass criterion

Use the same renderer/OS/DPR/font stack for each A/B pair. Capture each tile with sufficient surrounding ground for shadows and glows, plus a viewport shot for clipping/overlays. Decode images and compare RGBA pixels, not PNG file hashes (metadata/compression may differ). At the pinned environment, None's target is **zero changed pixels and zero geometry/content-ink differences**. This zero is the proposed identity acceptance criterion, not an inferred WCAG threshold.

Repeat A against A and B against B first. If either is nondeterministic, report the unstable case and fix its clock/assets/animation setup; do not raise a global percentage tolerance until B “passes.” A diagnostic perceptual diff may help localize a failure but cannot be called pixel-identical. Store the changed-pixel count, maximum channel delta, changed bounding box, old/new/diff images, computed-property deltas and environment metadata keyed to the exact case. Large/raw captures stay ignored, with a compact reviewed ledger under 1 MB per file.

Add negative controls: introduce a one-pixel border/offset change, a small text-color change, a single grain pseudo, a child that leaks a parent material gate, and a disabled-alpha duplication in a disposable test fixture. The checker must fail each, not merely pass the identity case. Restore fixtures before the real run. No production code or existing tests are modified for this research.

## 7. Preferences and nested reset acceptance

Repeat targeted cases for explicit standard/more contrast, OS contrast fallback, reduced motion, app transparency reduction, OS transparency reduction and forced colors, including their nested scopes/portals. Forced-colors screenshot emulation is useful but does not replace native Windows execution; browsers and unsupported-query paths get separate results. Cross-engine comparisons are **A versus B within each engine**, never Chromium pixels versus Safari pixels.

For explicit None inside another material, the test fixture supplies the same ancestor scene in both references and varies only the child's material contribution. Compare local paint and interactions while retaining the parent scene. A missing nested reset test is a release gap even if root None passes all gallery tiles.

## 8. Interpret the result narrowly

A gallery identity pass proves the covered cases at the pinned environment; it does not prove every consumer composition, every animation frame or full accessibility. A pixel-identical None can preserve the documented standard soft-border shortfalls. Keep them visible; do not silently “fix” them inside None, weaken the contrast gate, or label the identity result a WCAG pass. Independently run the unchanged token/contrast gates and the new material composed-paint/fallback checks. A baseline accessibility failure is tracked separately and cannot be waived by image equality. [CONTRAST.md:13–17]({A}docs/CONTRAST.md#L13-L17), [CONTRAST.md:68–79]({A}docs/CONTRAST.md#L68-L79).

The current schema has no Material axis, so **all candidate None identity results are pending**. Task 20 supplies the definition, evidence and acceptance method; implementation, new gallery adapters and execution belong to later authorized work.
''')
save('README.md','''
**Question:** Which rules remain hard limits for every material, which restraint becomes None's defaults, and how can None be proven pixel-identical to current Area?

**Answer:** There are **22 material-facing hard-limit records**, each with current rule/test evidence and its missing coverage. Contrast, focus, fixed hover ink, semantics, preferences and geometry/type/ink separation remain hard requirements. Shadowless controls, plain labels and quiet containers are None defaults, with D13 still prohibiting automatic small-text/glyph decoration. **None means no added material paint while preserving all existing Area paint**, including Surface and literal shadow exceptions. A two-build gallery comparison across Light/Dark × Default/Compact, with computed styles and exact pixel diffs, is the proposed proof. No production None implementation or pixel-identity pass is claimed.

**Snapshot:** checked **2026-10-12**, America/Los_Angeles. Area `origin/main` **d455567e5b264a768f42dc853476f1622ed6dd9f**; research/review **dbd57a9067e3d927b2bfb7a061db074eeaf48db9**. Read the [brief](../README.md), [review and decisions](../REVIEW.md), current AGENTS/README/handoff, and [CONTRAST.md:1–80]({A}docs/CONTRAST.md#L1-L80). Source pins use the current main SHA, not task 19's older inventory snapshot.

## Evidence and deliverables

- [Hard limits](hard-limits.md): 22 records with the rule, enforcement today, missing material-specific test and immutable file:line citations. [hard-limits.json](hard-limits.json) carries the same records.
- [None's restraint defaults](defaults.md): the three requested defaults, their actual CSS/docs/test evidence, and exceptions that None must preserve.
- [None definition and proof protocol](none-and-proof.md): baseline/candidate builds, exact app specimen enumeration, mode/density/state/preference matrix, nested resets, computed styles and zero-pixel-difference acceptance.
- [Source search](source-search.json) and [source pins](source-pins.json): reproducible bounded absence searches and immutable input hashes/ranges. “Not found” does not mean a browser verification passed.

## Findings that change the test plan

The production contrast gate measures opaque semantic tokens and explicitly rejects alpha without compositing. Strong indicator endpoints have 3:1 checks, but the standard quiet appearance has documented shortfalls. Do not turn “keep current tests” into a claim that every material or baseline edge conforms. [contrast.test.ts:21–29]({A}packages/tokens/src/contrast/contrast.test.ts#L21-L29), [CONTRAST.md:13–17]({A}docs/CONTRAST.md#L13-L17).

The app is now the source of truth. Its component gallery enumerates app-owned specimens, lazily mounts families and excludes some verification fixtures; testing an archived gallery or the initial All viewport would miss coverage. [README.md:20–34]({A}README.md#L20-L34), [components.tsx:41–56]({A}apps/desktop/src/pages/components.tsx#L41-L56), [components.tsx:133–145]({A}apps/desktop/src/pages/components.tsx#L133-L145), [specimens.mjs:1010–1019]({A}apps/desktop/src/content/specimens.mjs#L1010-L1019).

Current main separates **type** from **density**, with Compact, Default and Comfortable choices. The required four Light/Dark × Default/Compact contexts remain the minimum; the protocol also includes Comfortable and preserves the app's type-13 Compact chrome. An old `data-area-ui`-only plan is insufficient for this snapshot. [controls.ts:25–40]({A}apps/desktop/src/gallery/controls.ts#L25-L40), [app-scale.ts:1–6]({A}apps/desktop/src/app-scale.ts#L1-L6).

## Verification and reproduction

This is source research and a proof specification. No package build, production test run, browser comparison or assistive-technology session was needed or claimed. Source-range validation and deterministic report checks run locally; existing contrast tests are unchanged. Reproduce from a checkout with the pinned commits fetched:

```sh
python3 -B docs/research/astra/materials/20-limits-and-none/build.py --check
python3 -B docs/research/astra/materials/20-limits-and-none/write-report.py --check
python3 -B docs/research/astra/materials/20-limits-and-none/check.py
```

Omit `--check` to regenerate the hard-limit data, source scans and hash ledger; `write-report.py` regenerates the authored entry/defaults/protocol documents. These scripts only write this folder. The intended future optical run and its pass/fail evidence are specified in the protocol, not faked with an unused None attribute.

## Proposals

Adopt None as the output-identity baseline and retain the current no-shadow checks as baseline/None checks when Material arrives. Add rendered composition, preference, nested-reset and opt-in tests beside the existing token/semantic tests. Keep hard limits independent from optional optical intensity, and keep D2's Surface migration pixel-identical before calibrating expressive presets.

## Open questions

- D10 specifies a bounded near-black distance but no metric/number; D3 strength limits and D14 minimum-device performance limits still need calibration/owner input. This report does not invent them.
- The production Material API, transparency preference resolution and same-app A/B runner do not yet exist. The identity proof must execute against the real implementation, including nested scopes and portals, before a pass is reported.
- Standard soft-edge shortfalls and native Windows/AT/cross-engine gaps remain separately tracked; None identity is neither their repair nor a waiver.
''')
print('PASS: authored report is deterministic.' if '--check' in sys.argv else 'Wrote README, defaults and None proof protocol.')
