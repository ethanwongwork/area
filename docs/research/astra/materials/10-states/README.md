**Question:** How should all 25 material styles express hover, press, focus-visible, selected/checked, open, disabled and invalid while keeping hover foreground fixed and contrast intact, including motion and reduced-motion fallback?

**Answer:** Keep semantic state and required cues independent of optional material, then let each style add a bounded body, rim, relief or emission response.
The report covers **175 style–state recipes**, plus normal and reduced-motion behavior for every style, under task 05's role caps and family guards.
Selection and open are persistent context; press and hover choose one transient treatment rather than accumulating translucent washes. Focus and invalid cues remain visible alongside them.
Foreground stays fixed on hover within each persistent state; selected ink may use its appropriate semantic pairing without becoming hover-dependent.
Apple, Fluent and M3 supply useful precedents, but their bounce, foreground-token changes, fades and ripples are not copied over Area's existing contracts.
Use immediate hover/press/focus feedback and existing component motion; reduced motion shows final state immediately with no optical movement or loop.
Disabled suppresses interaction effects without hiding checked values or conflating read-only/loading; invalid retains readable content and error context.
These are proposals with pinned evidence, not calibrated material values, rendered contrast passes or owner approval.

**Snapshot:** checked **2026-10-09** (America/Los_Angeles), after `git fetch origin`. Area `origin/main`: [`6f896789a5200bcbd34fe87de458e60ca82141d6`](https://github.com/ethanwongwork/area/tree/6f896789a5200bcbd34fe87de458e60ca82141d6). Research/brief/task-05 input: [`2097df6d80ef9a0ca6a7f7e6f4db946e6749db01`](https://github.com/ethanwongwork/area/tree/2097df6d80ef9a0ca6a7f7e6f4db946e6749db01/docs/research/astra/materials). Public guidance: Apple HIG/WWDC25, Fluent 2, M3 states; checked 2026-10-09. Fluent React Button implementation pinned to `8abb0781d7d8bdb5e7bccaad16a6e4ba7efaf1aa`. Current Area files were read through Git at the pinned main commit. No target-product capture, production modification or new visual measurement.

## Evidence and report

- [Evidence ledger](evidence.md): primary public guidance, pinned Fluent source and Area state/motion/contrast rules. Vendor mechanisms and intentional Area differences are explicit.
- [Composition and motion policy](policy.md): all seven states, coexistence/priority, role limits, timing, reduced-motion behavior and additive verification plan.
- [Per-style recipes](states.md): all 25 styles × seven states, plus normal and reduced motion. [Machine-readable equivalent](states.json).
- [Authored recipes](recipes.py), [generator](build.py), [validator](check.py): reproducible coverage and document integrity; no production renderer.

Every recipe is an **authored proposal**. Citation pins establish existing constraints or precedents, not proof that the recipe passes contrast. Existing Area timing values are identified as such; no new opacity, glow gain, press depth or shadow geometry is presented as measured. The task 01 layer model and task 05 None/Trace/Quiet/Full limits are retained. [Input provenance](evidence.md#research-inputs).

Not every state applies to every part. Static pages, glyphs, scrims and containers do not acquire hover/press simply because a style has such a row. The seven-state matrix describes how eligible parts respond; the component still owns native behavior, state semantics and focus. Required semantic marks, invalid context and focus survive with material disabled.

## Proposals

**Option A — recommended:** compose persistent semantic state, one competing transient body treatment and independent required focus/invalid/selection cues. Apply role/context caps before material paint, and keep optics within Area's existing motion clocks. This lets gloss, glow, grain or lensing disappear without losing operability or meaning. Use the current local token derivation/scope pattern; keep Material beside Surface and derived colors unregistered. [Composition contract](policy.md#resolution-and-coexistence).

**Option B:** let each material define its own state machine, foreground response, transition timing and shadow ladder. It offers more stylistic freedom but conflicts with fixed hover ink, Surface ownership, focus behavior and predictable timing across mixed families. Reject it for this series. Vendor examples show alternatives, not a reason to weaken Area's rules.

Calibrate the recommended recipes on actual role receivers next: a repeated toolbar, an invalid editable field, selected+focused Calendar days, a Switch/Slider and an opened nested overlay. Do not adopt illustrative vendor opacity/duration values without actual Area scene checks.

## Reproduce and validation

From the repository root:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 docs/research/astra/materials/10-states/build.py
PYTHONDONTWRITEBYTECODE=1 python3 docs/research/astra/materials/10-states/check.py
```

Scripts locate the root from their own path and read immutable Git inputs. The validator checks exact taxonomy/state coverage, nonempty motion/fallback fields, deterministic generated output, line bounds, local links, report shape and the 1 MB per-file cap. This is research integrity, not browser conformance. Production tests are not run for this documentation-only task; [future acceptance checks](policy.md#contrast-and-verification-plan) preserve existing contrast tests and add actual scene/transition checks.

## Open questions

- **Not found:** measured Area material hover/press relief, glow, reflection or tint values for these 25 styles. Looked in the brief, task 05, current state/motion sources and cited public guidance. Recipes need visual calibration; no shader or animation constants are invented.
- **Not found:** universal M3 reduced-motion timing in the inspected states guidance and focused site search. Area's zero-duration fallback is sourced from its own policy.
- Which proposed local relief changes remain perceptible at Trace after dense-family and near-black constraints? A classic neumorphic or liquid-glass effect may simplify substantially.
- Should Area later allow short fades under reduced motion? `docs/MOTION.md` leaves that question open; this task keeps current zero-duration behavior.
- Can a proposed crossfade remain contrasted through every intermediate composition and interruption? Until tested, prefer immediate validated paint or opaque fallback.
- Current Area standard soft indicators and disabled dimming are not certified by this report. Native Windows forced colors, screen-reader behavior and cross-browser material rendering remain unverified; no existing gate is weakened.
