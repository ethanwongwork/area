**Question:** Which global and per-role material controls should Area expose, how should they map to tokens, derivation and React scopes, and should they extend Surface or form a new axis?

**Answer:** Recommend a **Material axis beside Surface**, with typed controls and role recipes rather than one uniform effect on every component.
Material owns body transmission, illumination, intrinsic relief, reflection, decorative edge paint, emission and texture; Surface retains decorative width and permitted cast elevation.
The controls cover light angle/height, separate relief and lift, shadow softness/spread/strength, glow source/strength, gradient stops/angle, stroke structure/opacity, transparency, targeted blur, grain and gloss.
All twelve roles have explicit override limits; None/Trace/Quiet/Full remain ordinal caps, never opacity multipliers.
Derive semantic paints and Surface/material interactions in `emit/base.ts`, re-emitting at axis, control and painted-part boundaries; register no derived or paired colors.
Extend Theme with separate typed material and Surface control props, explicit reset semantics and portal propagation.
An expanded Surface axis is viable but couples elevation selection to optical recipes; the separate-axis option better preserves Area's existing contracts.
These are proposals, with no calibrated new defaults, production implementation or approval claim.

**Snapshot:** checked **2026-10-08** (America/Los_Angeles), after `git fetch origin`. Area `origin/main`: [`6f896789a5200bcbd34fe87de458e60ca82141d6`](https://github.com/ethanwongwork/area/tree/6f896789a5200bcbd34fe87de458e60ca82141d6). Brief and tasks 01, 04 and 05 read at research commit [`33e8ee40fc3aa86295920b77baef4771e1f86064`](https://github.com/ethanwongwork/area/tree/33e8ee40fc3aa86295920b77baef4771e1f86064/docs/research/astra/materials). Task 04/05's implementation snapshot matches this Area snapshot. Evidence comes from the axis registry, schema, emitters, Theme, manifest, component CSS and repository design/contrast policies. Production files were read with `git show` at the pinned commit, not from the research checkout's older production tree. No new browser or product measurements.

## Evidence and reading order

1. [Evidence ledger](evidence.md): immutable source lines, including current API limits and scope behavior.
2. [Control contract](controls.md): global controls, units and validation, all twelve role overrides, resolution and nesting.
3. [Architecture options](architecture.md): two alternatives, ownership ledger, derivation, scope handling, proposed React API, migration and future acceptance checks.

The starting model is task 01's channels, task 04's part/depth assignments and task 05's absorption/guard rules, not a new taxonomy. [Research inputs](evidence.md#e01-research-inputs). Every new API, token spelling, formula, unit convention and validation rule below is **authored proposal**. Numeric identities such as zero effect, unit gain or normalized alpha endpoints describe that proposed API; they are not measured Area material settings. Public reference values from task 06 would need calibration before becoming presets.

Current Area emits complete Surface shadow strings, validates identical token keys for all presets, and only accepts preset IDs in `Theme.value`. Those facts make shadow decomposition, structural recipe compilation and typed continuous controls explicit engineering work—not capabilities that become available merely by adding `data-area-material`. [Surface](evidence.md#e04-surface-and-shadow-ink), [registry](evidence.md#e02-registry-contract), [Theme](evidence.md#e07-react-and-configuration).

## Proposals

Choose **Option A**, a new Material axis with a small compatible extension of Surface's input model. Preserve the existing semantic colors, radius, density, emphasis and required edges. Keep current rendering when material is off. The global editor can group controls by visible effect while routing each control to its sole token owner; editor organization need not create a conflicting axis namespace.

Choose **Option B**, an expanded Surface axis, only if the owner wants optical recipe and elevation to be one inseparable preset selection. It avoids adding an axis but requires composite profiles and makes an independent “Flat elevation, glass body” selection more cumbersome. Both options need role bindings and optical validation; neither makes the remaining materials tasks unnecessary.

## Validation and limits

```sh
python3 docs/research/astra/materials/07-controls/check.py
```

The read-only check verifies local document links, every immutable citation's file and line bounds, required control coverage, all twelve role headings, both architecture options, and the per-file size limit. It does not validate a proposed renderer or guarantee contrast, performance or browser support. No production tests were run because no production code changed. Future implementation checks are specified in the architecture report.

## Open questions

- Which optical profiles should be calibrated first? No new pixel ranges, gloss defaults or arbitrary maximum blur are selected here.
- Are restrained, constrained translations of neumorphism/clay acceptable under Surface's current elevation and dark-halo rules? Full external lobes would require a separately approved policy change.
- Should changing a Material preset preserve user overrides? This report recommends clearing that material's override patch, with an explicit preserve operation for an editor.
- What recipe complexity budget should the compiler permit? This proposal supports a declared finite slot schema and build-time profile registration; it does not promise arbitrary runtime mesh/shader authoring through Theme.
