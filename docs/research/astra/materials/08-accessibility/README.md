**Question:** How should each material style preserve text, required indicators and focus across complex backdrops and accessibility preferences, and how should Area extend its contrast tests without weakening them?

**Answer:** All **25 styles** need role- and context-specific checks; a style name is neither a contrast pass nor an automatic failure.
Measure the composed paint behind text and beside required indicators over the supported backdrop domain—not the nominal tint, average image or gradient stops alone.
Black/white backdrop checks alone can miss an interior failure; an included analytical example passes both endpoints but reaches **1:1** inside the range.
Keep focus independent of glass/glow, and retain opaque semantic cores and required boundaries when decorative layers disappear.
Apply reduced-transparency, contrast, forced-colors and reduced-motion policies to every style, with explicit fallbacks for all **12 roles**.
The published neumorphism preset examined here cannot supply a required 3:1 boundary through its pale body/shadows alone; this does not condemn every neumorphic control.
Preserve Area's existing WCAG/APCA gates and add composited-paint, focus, preference, scope and fallback coverage; unresolved optical cases must not count as passes.
These are research proposals and analytical results, not browser conformance results or owner approval.

**Snapshot:** checked **2026-10-08** (America/Los_Angeles), after `git fetch origin`. Area `origin/main`: [`6f896789a5200bcbd34fe87de458e60ca82141d6`](https://github.com/ethanwongwork/area/tree/6f896789a5200bcbd34fe87de458e60ca82141d6). Research inputs: [`666bdcefb602e371da81f4dd30f6f7061f61f482`](https://github.com/ethanwongwork/area/tree/666bdcefb602e371da81f4dd30f6f7061f61f482/docs/research/astra/materials), including the brief, taxonomy, role map, absorption policy, references and controls proposal. Read `docs/CONTRAST.md` first with the brief. Standards and browser-documentation URLs were checked on this date; they are documentation evidence, not execution evidence. No product settings, production files or component approvals changed.

## Evidence and deliverables

- [Standards and worst-case method](method.md): WCAG scope, compositing, gradients, focus and a bounded numerical neumorphism case.
- [Every style](styles.md), [styles.json](styles.json) and its [generator](build.py): separate text/non-text and focus risks, adversarial scenes, and all four preference paths for each of the 25 taxonomy entries.
- [Preference and role fallback policy](fallbacks.md): preference precedence, unsupported-feature handling and all twelve role fallbacks.
- [Contrast-test extension](tests.md): current source gaps, proposed additive gates, failure records and exact manual checks.
- [Evidence ledger](evidence.md): pinned Area source, prior research and dated public sources.
- [experiments.py](experiments.py), [experiments.json](experiments.json): reproducible analytical counterexample and source-palette bounds. These do not render components.

All style risk assessments, fallback mappings, testing algorithms and API changes are **authored proposals/inferences**, grounded in the cited model and standards. Required contrast thresholds are sourced; no new “safe blur,” alpha or glow settings are guessed. The endpoint example's inputs are synthetic, not an Area preset. Source-palette ratios are computed from the published generator values, not read from a screenshot.

## Proposals

**Recommend:** preserve the existing token suite, add an independently reported composited-paint gate, and require opaque/solid semantic fallback where a material's supported scene cannot be bounded or verified. Keep required indicators outside decorative channels and provide an application-level reduce-transparency choice because the media feature has limited support. [Current gates and preference evidence](evidence.md).

**Alternative:** restrict initial material presets to opaque reading grounds and decorate only eligible perimeters/shells. This reduces the verification domain but still needs focus, state and preference tests. Shipping unconstrained glass over arbitrary content after checking one screenshot is not a defensible contrast guarantee.

## Validation and limits

```sh
python3 docs/research/astra/materials/08-accessibility/experiments.py --check
python3 docs/research/astra/materials/08-accessibility/build.py --check
python3 docs/research/astra/materials/08-accessibility/check.py
```

The scripts verify the analytical results, source-line bounds, local links, exact taxonomy/role coverage and document size. They require only Python 3 and fetched Git commits. They do not run Area's production contrast suite or a browser. Native Windows forced colors, OS preference propagation, browser paint, assistive technology and user readability remain **unverified in this task**. No captures or external personal data are included.

## Open questions

- Which calibrated profiles and bounded scenes should be admitted first? Task 07 controls do not yet specify an approved numerical domain.
- Will Area adopt the proposed rule that authored material overrides cannot defeat a user's reduction preferences? Current contrast `standard` scopes can reset the OS-derived setting; the report labels the proposed stronger material policy separately.
- Should the optional WCAG 2.2 AAA focus-appearance target become Area policy? It is not mislabeled as the AA minimum here.
- Who will execute the native OS/browser and assistive-technology checks? Passing analytic/token checks will not close those evidence gaps.
