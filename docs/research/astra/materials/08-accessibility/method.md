# Standards, worst-case backdrop method and focus

Public sources checked 2026-10-08. Requirements are identified below; the verification procedure and stricter fallback choices are **proposed Area policy**, not additional WCAG success criteria. No style has been browser-certified by this report.

## Applicable requirements

**SC 1.4.3, AA:** ordinary text needs 4.5:1; qualifying large text needs 3:1. Large means at least 18pt, or 14pt bold, subject to the standard's definition. Inactive controls, incidental/decorative text and logotypes have exceptions; small labels and placeholders are ordinary text. Compare underlying foreground/background paint, not anti-aliased edge pixels; do not round a below-threshold result into a pass. Area's small UI text must not be reclassified as “large” to rescue a material. [Understanding 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

**SC 1.4.11, AA:** visual information needed to identify controls/states and meaningful graphical objects needs 3:1 against adjacent colors, with inactive, unmodified user-agent and essential-graphic exceptions as specified. A text-identified Button need not acquire a 3:1 decorative outline merely because it is a Button. An empty field boundary, selected mark or Slider thumb may be the required cue. State-to-state color difference is not itself this criterion's comparison; identify the required cue in each state and its neighbors. [Understanding 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

**Area policy remains stricter in places.** Its supplementary dark APCA gate and decorative stroke floors retain their current purpose and thresholds. The soft standard presentation is not asserted universally conforming by `docs/CONTRAST.md`; stronger endpoints passing in `more` do not retroactively certify the standard presentation. A new material's required information cannot be tested against a decorative floor. No palette mutation, threshold reduction, exception or hover-ink change is proposed. [Area sources A1–A4](evidence.md#area-sources).

**Default compliance cannot depend on discovering a preference toggle.** For any material advertised as meeting these criteria, its default supported presentation must satisfy the applicable requirements too. An opaque alternative is a useful fallback, not a blanket excuse for an unchecked default.

## Proposed worst-case procedure

### 1. Define the domain before saying “worst”

For each recipe/role/part, record its immutable source, actual painted receiver, semantic foreground, body/filter/edge/highlight/glow/texture layers, parent group, required cue, supported backgrounds and allowed control ranges. Include default/compact, light/dark, neutral/accent/tone, state combinations, preference modes, nested scopes, browser and viewport. A single screenshot establishes only one scene.

Backdrop domains can be: a finite set of opaque Area semantic colors; a constrained gradient; a fixed image at specified crops; or arbitrary changing content/video. Required-cue location matters: text background is behind the letters, a Slider mark may be adjacent to its track, and an outer focus outline sees the scene outside the component. Identify the information-bearing region before collecting pixels. Use task 04's actual parts and task 05's shared-shell bindings rather than treating every component as one rectangle. [Research inputs](evidence.md#research-inputs).

### 2. Compose the actual layers

For ordinary source-over with opaque backing, in a **declared compositing color space**, compute each channel as `C = alpha * source + (1 - alpha) * backing`. Apply the real ordering, filters, blend modes, clipping and group opacity. Only then convert the final foreground/background colors to the relative luminances used by `(Llighter + .05) / (Ldarker + .05)`. Do not interpolate contrast ratios or mix luminance directly in place of composing color channels. [Source-over model](https://www.w3.org/TR/compositing-1/#simplealphacompositing), [Area's luminance formula](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/color/contrast.ts#L25-L40).

For text with alpha, compose the foreground over that local resolved ground; parent group opacity may affect both and must be accounted for separately. No “nearest opaque ancestor” shortcut through translucent paint. `background-color` alone omits gradient/image layers and backdrop filtering. Wide-gamut/interpolation/filter paths not supported by the analytic resolver need a browser oracle or an explicit unresolved result; silently coercing them to hex is not a solution.

### 3. Locate the minimum, not an average

**Translucency:** include black/white, saturated colors, intermediate grays and a backdrop whose composed luminance approaches the foreground's. For a bounded source-over model, derive a conservative output-color/luminance interval. If the foreground lies outside the interval, the nearest endpoint in luminance gives the conservative worst contrast. If it lies inside, the conservative bound is 1:1; prove that the reachable set excludes the collision or use fallback. Blur alone does not prevent a uniform backdrop from being an adversarial scene.

**Gradients:** evaluate the rendered field across the text/required-cue footprint, including interpolated interiors, coincident stops, radial centers, conic seams, mesh patches, alpha stops and supported crops/sizes. Use analytic extrema where the model permits them, and adaptive sampling near low-contrast regions otherwise. Stop colors alone are insufficient. A finite grid is sampled evidence, not a proof over arbitrary positions/interpolation spaces. An uncovered interval or unknown error bound remains unresolved.

**Images, glass and refraction:** include high-frequency edges, large near-ink patches, saturated patches, scrolling content, changed image crops, loading/failure backgrounds, nested surfaces and every supported frame/state. Hold reproducible frames for regression. Lensing changes which source region lands behind a glyph; use the actual mapping and its whole allowed displacement domain. Where video, arbitrary user content or environment sampling makes the domain unbounded, place an opaque qualified reading ground under text/required marks. A list of pretty photos is not a universal proof.

**Low boundaries:** analyze the cue that identifies the part, not every decorative pixel. If the only cue is a shaded contour, verify enough of that contour remains perceptible; a tiny high-contrast shadow tip does not demonstrate a usable complete indicator. For a solid required ring, test the relevant local adjoining surfaces. Use a solid additional boundary where fading/gradient sections cannot reliably convey the required shape. [G209 boundary technique](https://www.w3.org/WAI/WCAG22/Techniques/general/G209.html).

W3C's text-background techniques support maintaining contrast locally behind letters; they do not require an irrelevant remote image pixel to contrast with text. The proposed finite-image test records the actual glyph footprint, while the arbitrary-layout test conservatively covers every place text could occupy. [G18](https://www.w3.org/WAI/WCAG22/Techniques/general/G18), [F83](https://www.w3.org/WAI/WCAG22/Techniques/failures/F83).

### 4. Use a controlled browser oracle

Proposed fixture process: render the real receiver and backdrop at known viewport, zoom, device scale, color profile and state; obtain computed ink and exact material inputs; create a fixture-controlled pass that hides only ink while retaining layout and optical layers to recover the background field. Do not hide an entire translucent parent, remove a pseudo-element that contributes light, or use screenshots of antialiased glyph edges as the text color. If removing ink changes backdrop feedback, blending or filters, the method is invalid for that recipe; use a renderer-specific probe or declare unresolved.

Compare each sampled local ground with the corresponding un-antialiased ink/core color (or an accurately composed translucent ink), retain the minimum and coordinates, and record sample coverage separately from any analytic proof. For focus/edges use masks of the actual required solid cue, excluding antialias fringes without shrinking away genuinely thin or missing regions. Use screenshots for geometry, clipping and visual review; record numeric values from controlled computation/capture, never estimate color from an image by eye. This is a proposed testing method, not an already implemented Area capture capability.

## Why endpoints alone are insufficient

[experiments.py](experiments.py) supplies an authored counterexample under normal encoded-sRGB source-over: opaque `#767676` text over white tint alpha **0.01**. Against a black backdrop contrast is **4.55280798126249:1**; against white **4.542224959605253:1**. Both meet the ordinary text threshold. An intermediate uniform backdrop with each encoded channel **0.4573182808476926** produces exactly the text color after tinting: **1:1**. See [raw analytical results](experiments.json).

These are synthetic numbers demonstrating a test failure mode, not suggested transparency values or browser measurements. They also explain why “test only darkest and lightest” needs a same-polarity/monotonicity argument. For known dark ink below all reachable ground luminances, a proven minimum-luminance ground is sufficient; do not generalize that shortcut to mixed-polarity fields.

## Focus visibility on glass and glow

**Standards:** SC 2.4.7 (AA) requires a visible keyboard-focus indication. SC 2.4.11 (AA) requires that author-created content not entirely hide the focused component. SC 2.4.13 (AAA) additionally specifies indicator area at least that of a 2 CSS px perimeter and 3:1 contrast change at the same pixels between focused/unfocused states, subject to its exceptions. Keep that optional AAA test separate from AA adjacent-color tests; a generic “2px ring” does not prove all three criteria. [Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html), [Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html).

**Proposed Area material rule:** preserve its existing opaque focus edge/outline and geometry; decorative bloom, inset shine and glass rim cannot be the only focus indication. Test focus against the actual glass interior or outside backdrop according to placement. If the chosen focus color cannot be bounded against that scene, provide a qualified solid backing/separator band or opaque surface; a two-color ring is a candidate to verify, not an automatic pass. Keep invalid and selected cues simultaneously. Glow-strength zero must not remove a field's functional focus/invalid halo. [Area focus contract](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/CONTRAST.md#L42-L53).

Tab through real controls with open overlays, clipped/rounded shells, scrolling/sticky content and nested portals. Confirm material masks and filters do not clip the indicator, move it below a pane or make focus look identical to permanent neon. Put decorative effects on a separate clipped receiver while preserving focus painting outside it. Freezing an animation must retain a visible focus state.

## Neumorphism: a bounded failure, not a blanket verdict

The public Neumorphism.io default uses body `#E0E0E0`, dark lobe `#BEBEBE`, light lobe `#FFFFFF`, and this analytical case places it on a matching `#E0E0E0` surrounding surface. Source defaults and generation are pinned in [N1](evidence.md#public-standards-and-platform-sources). Analytical ratios from [experiments.json](experiments.json) are body-to-ground **1:1**, dark-lobe/body **1.408000241964898:1**, and light-lobe/body **1.320083534140116:1**. Even the extreme palette pair is only **1.858677935483161:1**.

**Inference:** in a normal-blend composition restricted to that grayscale palette, blurred mixtures cannot produce a required 3:1 cue. A field/track whose presence or selected state relies solely on these pale lobes therefore needs another sufficient cue. This is not a rendered audit of the generator app, and says nothing about an added dark label, explicit border or different settings. Reversing shadow direction for press is not a substitute for a persistent semantic mark. A text-identified button can retain low-contrast decorative relief while its label/focus meet the applicable requirements.

There is a second, independent failure path: forced colors removes box/text shadows, so shadow-only affordances can disappear. MDN's own forced-colors example replaces a paired shadow treatment with a real border. [Forced-colors example](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors). Proposed fallback: ordinary opaque body, actual required edge/mark and separate focus; keep optional relief only where it survives preference and role caps. Never classify required shape as decorative to excuse its disappearance.

## Task 19 interpolation correction

Declare the compositing model instead of relying on a browser gradient default. For this series' checker contract, gradients use **premultiplied sRGB interpolation**: `linear-gradient(180deg in srgb, …)`, `radial-gradient(in srgb, …)` or `conic-gradient(in srgb, …)`. Serialized stops carry `interpolation: "srgb"`. Interpolate premultiplied stop channels and alpha, then composite the result with the translucent body and backdrop before converting the final sRGB color to linear luminance for contrast. Do not interpolate luminance or compare just endpoint colors. A CSS gradient in Oklab must use an Oklab-capable sampler instead; it is not covered by this sRGB calculation. [CSS Images 4 color interpolation](https://drafts.csswg.org/css-images-4/#color-interpolation-method), checked 2026-10-11. Existing numerical experiments retain their documented inputs and findings.
