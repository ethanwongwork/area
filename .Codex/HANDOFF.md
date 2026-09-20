# Handoff — 2026-09-19

**Branch:** `main`.

## Current work

Design visually first, then tokenize. Do not assume every family needs S/M/L: Slider’s
small/medium/large tiers are supported and medium remains the default, while UI scale owns
product-wide density. Gallery sections collapse natively and persist; customization floats
over content with an icon-only collapsed state.

Slider’s inset property-row experiment is removed. The gallery shows its neutral default,
accent opt-in, label/value-above-track composition, fractional and marked discrete steps,
range with numeric inputs, vertical layout, controlled behavior, disabled state and
without-readout composition. Its thumb uses a surface ring with a centered fill-color dot.
The gallery keeps themed specimen surfaces in dark mode and uses a subtle red-50 edge/title
for unrefined status instead of replacing the surface.

Input, Select, Checkbox, Radio, Slider, Chip, Avatar and Segmented no longer expose token-
ramp-only xs/xl sizes; their public families are sm/md/lg with md as default. UI scale
owns system-wide density. Internal ramps remain available to specialized layout/content
roles such as Panel and Kbd. Consumer fixtures and inset fixtures were updated.

Input and Field received a confirmation pass without rebuilding their existing work.
Input `validationStatus="error"` now sets native `aria-invalid`; InputAction merges an
external `aria-describedby` with its tooltip. Seven focused tests cover Input variants,
native semantics, loading, action descriptions and Field relationships/propagation. Their
gallery coverage was expanded. The owner accepted Slider, Input and Field on 2026-09-19;
the completion registry, README and component workflow status now record that decision.

Active docs are five guides linked from README. Read AGENTS.md and the relevant guide,
not the old audit process. All previous docs/evidence are preserved under `archive/docs`;
old audit skills and the duplicate optical rule are under `archive/guidance`. Default
ripgrep searches exclude the archive; `npm run reference:lookup -- <component>` still works.
Normal builds do not read historical reports. Inset baseline: `tests/fixtures/inset-before.css`.
The lone active checkpoint skill is short and optional; a handoff does not authorize push.

## Next

Select the next unrefined family from `docs/COMPONENTS.md`. The documented workflow treats
public system documentation as a functional baseline and keeps concise observations from
non-public systems as suggestions—not automatic variants.

## Verification

Passed: docs/package build (46 pages, 420 demos), typecheck, 6 Slider tests and 7
Input/Field tests. Browser verification confirmed marked step indicators, numeric range
inputs, vertical layout and the completed gallery status for Slider, Input and Field.
Input's 22 specimens including focus tooltip and native invalid semantics; Field's 13
specimens and label/description/error relationships; and themed gallery surfaces in dark
compact mode. Slider form reset is implemented but lacks an automated browser test.

Avoid concurrent package builds/typecheck while the dev watcher rebuilds declarations.
Cross-engine, native forced-colors, assistive-technology and release limitations remain
in docs/DEVELOPMENT.md. Passing local checks does not mark unrefined components complete.
