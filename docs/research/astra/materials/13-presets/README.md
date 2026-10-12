**Question:** Which named material presets should Area consider, how does each paint every role in light and dark using task 07's controls, and which styles can combine without competing for the same paint?

**Answer:** Propose eight: **Paper, Glass, Acrylic, Soft, Tactile, Aero, Glow and Prism**.
Each has twelve explicit role recipes in both modes: 192 complete requested control records.
Text, glyphs, reading planes and truthful data cores stay calm; decorative layers belong to eligible shells, rims or isolated emitters.
Surface keeps cast eligibility; Material adds optical treatment without inventing control shadows or changing geometry.
The recipes adapt fourteen references from 06; their numeric seeds are authored proposals, not measured vendor defaults.
A full 25-style matrix gives 300 pair decisions and reasons; a separate eight-preset matrix gives all 28 combinations.
Start owner review with Paper, Glass and Tactile, then test the other five against the same contrast and density gates.

**Snapshot:** Checked **2026-10-09**. Area `origin/main`: **3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e**. Research inputs: **c0a97a34e6c76d97d025d19f79edac59ddadbf25** on `origin/astra/research`. Read the [brief](../README.md) and **01–10** before composing presets; immutable input links and README hashes are in [evidence.md](evidence.md) and [presets.json](presets.json). Task 06 source values retain their original **2026-10-08** check date; this task's three public documentation checks are separately dated. No production implementation, native-material parity, visual approval or contrast pass is claimed.


<!-- task19-changes -->
## Changes after review — 2026-10-11

Task 19 corrections, with the reason from [Corrections for Astra and D1–D16](../REVIEW.md). Older Answer/Snapshot passages below retain their original date and findings unless explicitly refreshed; the changes here and decision callouts govern subsequent work.

- **C19 — Review reason:** Paper faded existing borders to 14%/22%. **Change:** Set its existing stroke opacity to 1 in light/dark; Paper remains deferred for a real opaque material rebuild, not promoted by this fix. Files: [model.py](model.py), [presets.json](presets.json), [presets.md](presets.md). Decisions: D4.
- **C20 — Review reason:** None identity/default was missing. **Change:** Added None with identity:true and emitsMaterialDeclarations:false. There are now nine records, with None/Glass/Tactile/Soft identified as the first set. Files: [model.py](model.py), [presets.json](presets.json). Decisions: D4.
- **C21 — Review reason:** Prism colours were literal inventions and ignored accent. **Change:** Replaced custom hex stops with accent/neutral-derived sources; retained the old numeric seeds as uncalibrated proposals. Files: [model.py](model.py), [presets.json](presets.json). Decisions: D5.
- **C22 — Review reason:** Glass container violated the old container cap. **Change:** Made its sparse painted-shell binding explicit and marked the global Trace ceiling superseded by D1/D3; dense reading grounds remain opaque. Added D7 arbitrary-backdrop/failing-edge F0 requirements. Files: [model.py](model.py), [presets.json](presets.json), [presets.md](presets.md). Decisions: D1, D3, D7.
- **C23 — Review reason:** D6 adds a role and D3 supersedes ordinal cap enforcement. **Change:** Expanded all nine records to 13 roles in both modes; added plain row-plate records and uncalibrated numeric-strength markers. Marked old angle, cast, geometry and cap policy superseded instead of pretending it implements D2/D3/D9. Files: [model.py](model.py), [contract.md](contract.md), [presets.json](presets.json), [combinations.md](combinations.md). Decisions: D1, D2, D3, D6, D9, D11, D13, D14, D16.

Full change ledger and verification: [19-corrections](../19-corrections/README.md).
<!-- /task19-changes -->

## Evidence

Start with [the role tables](presets.md), then [the shared contract](contract.md) for exact defaults, layer order, context reduction, nesting, density, corner geometry, states and fallbacks. [The source ledger](evidence.md) preserves exact reference values, source pins, transfer limits and the current Area constraints. [Reference data](reference-inputs.json) copies the fourteen selected 06 records without guessing missing values. A source's colors, sizes or blur are evidence for that specimen, not permission to transplant its complete treatment into Area.

| Preset | Reference basis in 06 | What transfers; what is deliberately changed |
| --- | --- | --- |
| Paper | R01 Flat UI; R02 Material Components Web | Opaque matte reading plane, edge and permitted cast hierarchy. No imported radius, white paint or three-lobe card recipe. R02 is legacy MDC Web, not an M3 claim. |
| Glass | R03 CSS glass card; R17 gradient borders | One local acquisition and a transparent-center edge technique. R03's 5px CSS blur is retained only as a trial input; source .5 white fill is replaced by proposed mode-specific dense tint and opaque reading islands. |
| Acrylic | R04 pinned WinUI active source; R03 web specimen | Muted transient shell, tint, static fine grain and opaque fallback. Proposed 12px CSS blur does not equal native BlurAmount 30; the new noise tile is not WinUI's bitmap. |
| Soft | R08 neumorphism generator; R09 clay.css | Opposing local convex/concave cues. No unsupported external control casts; explicit required edges remain. This is a constrained translation, not full neumorphic fidelity. |
| Tactile | R10 98.css; R19/R20 board annotations | Paired crisp rims and recessed wells. No retro font/geometry, broad label shadow or new button cast. Board 5/6 are owner transcriptions, not public source files. |
| Aero | R11 Aqua specimen; R12 7.css | Gloss/reflection distinction and compact upper/perimeter bands. No imported blue palette, image language or opacity-on-hover; no claim to reproduce all of Frutiger Aero. |
| Glow | R13 neon specimen; R12 7.css | Supplementary context-colored emission, kept separate from semantic core/reflection. Large em-based halos and luminous labels are rejected for small/dense roles. |
| Prism | R17 gradient borders; R15 multi-radial scene | Named gradient edge with explicit stop pairs. Default page scene is off; a stack of radials is not claimed to be a true mesh. |

These choices deliberately omit a named Liquid Glass or Mica match: the inspected evidence in 06 did not expose enough native parameters for that promise. Letterpress, glow text and engraved functional glyphs are also off in all eight presets. They are not required to make a material coherent across roles.

The [combination report](combinations.md) covers **all 25 taxonomy styles**, including primitives not enabled by these defaults. Each of the 300 unordered pairs has a reason key and source-reference IDs in [compatibility.json](compatibility.json); those IDs resolve to the full [06 catalogue](../06-references/catalogue.md). C means compatible under shared guards, K conditional on explicit ownership/region, X conflicting complete requests on one receiver. This is a design judgment, not CSS support data or a prohibition on placing different materials in separate nested receivers.

## Proposals

**Recommended option: eight guarded presets on a separate Material axis.** Keep task 07 option A: Material inputs, Surface cast/width ownership, and unregistered shared paint derivation. Each selection replaces a complete control object; every individual permitted control remains adjustable. Use complete role requests plus the strictest effective cap, rather than letting all descendants inherit the global shell treatment. The [contract](contract.md) specifies this resolution. The role table is complete even where the right material response is None.

**Alternative: four broader families with finish modifiers.** Paper, Glass, Soft and Tactile could be the primary choices, with Acrylic as a Glass acquisition/texture profile and Aero/Glow/Prism as finishes. That reduces the initial picker, but the user must then understand legal combinations, competing edge ownership and why a modifier disappears on some roles. The eight named starting points expose those decisions directly while retaining the same underlying controls. Neither option needs eight parallel component implementations.

Review in this order, as a proposal rather than a shipping commitment:

1. **Paper** as the identity/opaque reference, **Glass** to exercise acquisition and nested reading islands, and **Tactile** to exercise role depth and concentric rims.
2. **Prism** and **Soft** for edge allocation, small-control legibility and explicit boundary checks.
3. **Acrylic**, **Aero** and **Glow** for texture, reflected/emitted light separation, backdrop and dense-context suppression.

The board gives useful review targets, not measurements: Glass relates to 2/12/13; Tactile to 3/7–11/16; Glow to 1/4/8/14; Aero to 16/17; Prism to portions of 3/15. Only 5 and 6 supply transcribed numbers. The proposal does not claim coverage of the board's refraction, filled/glass icon geometry, engraved small labels or full illustrated scenes. Task 06's coverage ledger remains authoritative for what evidence was actually found.

## Reproduce and checks

From the repository root:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 docs/research/astra/materials/13-presets/build.py --check
```

Omit `--check` to regenerate the six derived reports/data files from `model.py`, `combinations.py` and the pinned research inputs. README and contract are authored explanatory documents. The script resolves the repository relative to itself and writes only to this folder. It checks complete twelve-role light/dark coverage, all unordered compatibility pairs, control domains, forbidden channels, source-reference IDs, deterministic outputs and the under-1-MB limit. These are report integrity checks, not rendering or contrast tests. No product or implementation tests are changed.

## Open questions

- The numeric light/dark seeds have not been calibrated visually. Which reference-grounded preset should the owner review first? The recommendation above does not confer approval.
- Current component bindings do not yet supply all the proposed content-exclusion masks and optical ownership. F0 is required where those cannot be expressed; implementation would need separate reviewed work.
- Tiny/fractional double rims may collapse at compact sizes or particular display scales. Keep the single-rim fallback; no extra width or glyph nudging is justified by this report.
- Backdrop-dependent contrast is unverified for all transmitting proposals. Keep current contrast tests and add composed worst-case tests from 08; no seed is a universal safe alpha or blur budget.
- Native Liquid Glass/Mica exact optics and original board images remain unavailable in the inspected inputs. Do not relabel the CSS proposals as native reproductions.
