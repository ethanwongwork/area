**Question:** How do OpenGlass UI's shared GlassLook controls reach its forty components, where do its recipes and safety paths break, and what does Area's proposed model add?

**Answer:** OpenGlass is a substantial implemented precedent: shared optical controls, distinct wells/handles/sheets, and forty React recipes—not just a glass generator.
Its latest commit remains `4943bbf`, the task 02 pin. All forty are traced below, including parts that deliberately ignore GlassLook.
The main gaps are incomplete control coverage, inherited-look loss through portals, incomplete transparency/motion fallbacks, and contrast checks that do not qualify arbitrary glass backdrops.
A concrete rendering defect lets a dialog close button's decorative ring stretch across the panel.
Area adds explicit part roles, absorption/context caps, independent Surface ownership and stricter effective-paint safeguards; these material features remain proposals, not a shipped advantage.
The pinned packages built; all 137 upstream unit tests passed; the local atlas rendered all forty entries and its dialog opened and dismissed.

**Snapshot:** checked **2026-10-10** (America/Los_Angeles). OpenGlass default `main`/HEAD: `4943bbfd5611fe211cccf4b50c384345468d635b` (commit 2026-09-29T13:57:49-07:00). Area `origin/main`: `eaa9222ebf98f7c260f9e0dd448940523003d4d3`. Research inputs: `ce84e32725f4e9321c77b4a75eb142a1c565674c`. Fetched origin before reading the research instructions. Read the materials brief and task 02 before this audit. Repository facts below use commit-pinned source lines only; local execution is recorded separately, never used to estimate paint values. [Source lock](source-lock.json).

## Evidence

- [Value flow and per-role recipes](flow.md): every GlassLook input, both paint paths, renderer boundaries and nesting.
- [All forty components](components.md), also [components.json](components.json): anatomy, consumed controls, fixed treatments, fallback and nesting caveats with JSX/CSS pins.
- [Strengths and breaks](findings.md): source-derived counterexamples, fallback coverage and the exact limits of contrast evidence.
- [Area comparison](area-comparison.md): implemented Area facts versus unreviewed material proposals, including inconsistencies already found in task 15.
- [Local rendering and verification](verification.md): reproducible commands, executed checks and untested paths. Screenshot is demonstration only.

The count comes from the actual atlas and its source test, not an inferred package export count: [tests/e2e/component-atlas.spec.ts:26–40](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/tests/e2e/component-atlas.spec.ts#L26-L40). Glass, providers, filter definitions and ToastProvider are supporting APIs, not extra entries in this forty-component census. Every entry has its declaration and paint sources in the inventory. “Roles” in this report are an analytical crosswalk to Area, not a claim that OpenGlass exposes Area's role API.

Task 02 already corrected the brief's uniqueness hypothesis; this report deepens that finding at the same upstream pin. [docs/research/astra/materials/02-prior-art/README.md:1–28](https://github.com/ethanwongwork/area/blob/ce84e32725f4e9321c77b4a75eb142a1c565674c/docs/research/astra/materials/02-prior-art/README.md#L1-L28)

## Proposals

**Recommended:** use OpenGlass as a source-level reference and a set of adversarial cases for Area's implementation plan. Preserve its separation of quiet menu rows, wells, handles and overlay shells, but route Area paint through explicit receiver/cap/fallback resolution. Do not import its button casts, animated lens thumbs, geometry changes or whole-control hover filters wholesale. The precise differences and source pairs are in [area-comparison.md](area-comparison.md).

**Alternative:** adapt its recipes as a separate opt-in visual language. This would be quicker for a glass demonstration, but would require an explicit exception to Area's current elevation, hover-ink and geometry contracts; it would not implement the full materials series. Neither option is adopted here.

## Open questions

- Should Area require atomic preset resets or preserve compatible patches on a recipe change? Task 07 proposes explicit provenance; task 15 found that task 13's complete role records do not yet encode it. Do not copy either schema without resolving that conflict.
- Which explicit overlay/scene contexts may acquire a backdrop? OpenGlass's local per-element treatments do not provide Area's proposed ownership budget.
- Source review is not a full accessibility certification. Arbitrary backdrop contrast, forced-colors on an actual Windows setup, assistive technology, Safari/Firefox and every state combination were not executed here.
- No upstream issue, fix, package change or pull request was made. Earlier materials folders are unchanged.

## Reproduce

Run `python3 docs/research/astra/materials/17-openglass/write_report.py` to render the curated audit, then `python3 docs/research/astra/materials/17-openglass/check.py`. Both locate paths relative to themselves. The validator checks forty distinct entries, source-line bounds and exact source hashes when the ignored clone is present. See [verification.md](verification.md) for clone/build/demo commands. Generated JSON files stay below 1 MB.
