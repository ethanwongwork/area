# Verification · 2026-10-11

## Numerical and artifact checks

The standalone unit suite passed **10 tests**: known opaque ratios; task-08 interior backdrop trap; gradient-interior failure with passing stops; premultiplied alpha; colored RGB-box witness; narrow multi-stop interval; unsupported inputs; no threshold rounding; source-over ordering; and comparison against an independent dense colored grid across 12 deterministic random scenes. [Test source](test_paint.py).

`capture-inputs.mjs --check` reproduces both frozen modes and all 243 source assertions from the pinned Git source, with the pinned APCA dependency version. `build.py --check` reproduces the result files. `check.py` checks all 213 included assertions plus the 30 exclusions, all role/mode/preset records, source-line bounds, local links, JSON sizes, witness ratios, the outside-scene collisions, and that the optional gate exits 1 for the retained failures. These are distinct from Area’s production tests, which were not changed or invoked.

The recorded totals are 6,896 PASS / 32 FAIL for requested paint; 6,925 PASS / 3 FAIL for guarded paint; 6,928 PASS / 0 FAIL for F0. The separate 2,736 exterior-scene probes all fail at approximately 1:1. Aliases are not additional unique probes. All result files stay below the 1 MB per-JSON limit.

## Local browser report inspection

Served only on `127.0.0.1:8771`, inspected in the **Codex in-app browser**. This checks the report UI, **not Area component paint** or a browser pixel oracle:

- Default Glass/light/guarded: **431 pass, 2 fail**; container and floating surface show **2.485083:1**, black backdrop and `rgb(209.1,209.1,209.1)` composed ground.
- Glass/light/F0: **433 pass, 0 fail**.
- Glass/light/raw shell/text: **411 pass, 22 fail** across all targets; selected text witness **3.689188:1**. The target selector changes the matrix, while the overall status deliberately counts all 433 probes.
- Acrylic/light/guarded, floating surface selected: **432 pass, 1 fail**, **2.882717:1**, ground `rgb(224.4,224.4,224.4)`.
- Acrylic/dark: **433 pass, 0 fail**. The table contains all twelve role rows and keeps N/A explicit.
- Source link resolves to the exact assertion block URL. Error/warning log inspection returned no entries. Preset/mode/scenario/target controls and role selection all updated their displayed witness.

[Full-page preview](report-preview.png) records the final Glass/light/guarded view. No visual color value was estimated from this screenshot; all quoted numeric fields come from model records and visible UI text. No personal/product data appears in it.

## Not verified

Actual Area mask clearance, rasterization, focus geometry, component states, nesting, OS preference handling, dark APCA, other theme selections, browser color management, Safari/Firefox, native forced colors and assistive technology. The model limitations and conditional pass boundary remain in [method.md](method.md) and the [README](README.md).
