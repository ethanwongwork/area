**Question:** How could an Area material builder work in the docs gallery, and what can a material retain or lose when shared as JSON or exported to DTCG, Tokens Studio, Figma, Tailwind and plain CSS?

**Answer:** Make the gallery a live editor for task 07's typed controls, with independent before/after stages and visible requested-versus-effective values.
Keep a versioned **Area preset JSON** as the editable source; export target-specific projections with an explicit loss report.
The current published **DTCG 2025.10** format supports layered/inset shadow and solid border composites, but its gradient carries stops without rendering geometry.
Tokens Studio's documented dialect and Figma export path require their own tested adapter; DTCG-prefixed keys alone do not establish full compatibility.
Figma supports leaf variables, paint/effect styles and native glass/noise effects, but those native effects lack variable binding and are not equivalent to Area's web recipes.
Tailwind should expose the shared Area renderer through scoped controls; plain CSS needs the generated bindings, assets and fallbacks as well as variables.
No target alone preserves the complete role, nesting, semantic derivation and accessibility policy. Retain the source document and name every approximation.

**Snapshot:** **2026-10-10**, after `git fetch origin`. Area `origin/main`: **3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e**. Research input: **3a9a1b61e748741e9bc5e578b536ad978d3b1986**. Read the [brief](../README.md) and [07 controls/architecture](../07-controls/README.md) first. Area claims are pinned to source lines in [evidence.md](evidence.md); public specifications and official tool documentation were checked on this date. DTCG is a W3C Community Group report, not a W3C Recommendation. No product settings, Figma documents or production files were changed.


<!-- task19-changes -->
## Changes after review — 2026-10-11

Task 19 corrections, with the reason from [Corrections for Astra and D1–D16](../REVIEW.md). Older Answer/Snapshot passages below retain their original date and findings unless explicitly refreshed; the changes here and decision callouts govern subsequent work.

- **C24 — Review reason:** Old builder/export examples inherit the earlier role, angle and selector contracts. **Change:** Marked affected sections and frozen schema/examples superseded by D2/D3/D6/D9/D16; kept valid format findings and old round-trip fixtures intact. Files: [builder.md](builder.md), [acceptance.md](acceptance.md), [exports.md](exports.md). Decisions: D2, D3, D4, D6, D9, D16.

Full change ledger and verification: [19-corrections](../19-corrections/README.md).
<!-- /task19-changes -->

## Evidence

- [Builder proposal](builder.md): gallery flow, all control groups, before/after isolation, diagnostics, state inspection, saving and sharing.
- [Export contracts](exports.md): current composite types, per-format mappings and omissions, Figma variables versus styles versus geometry, and a cross-target loss matrix.
- [Evidence ledger](evidence.md) and [source index](sources.json): Area commit-line pins, immutable research inputs, dated official references, conflicting documentation and access limits.
- [Acceptance plan](acceptance.md): the future tests required before calling an adapter or builder supported.

The existing gallery isolates theme settings to its canvas and stores string selections. Its JSON token output is an Area-specific base/derived/axes schema, not DTCG. Its Theme and part manifest do not yet supply the proposed continuous-control/role-binding API. Extending that machinery is explicit implementation work. [A01–A06](evidence.md#area-snapshot).

Public documentation has an important version mismatch: Figma's current API lists six resolved variable types, including EASING and TIMING, while Tokens Studio's skipped-export page still describes four. The report separates native Figma capabilities from the plugin's documented path instead of assuming they advance together. Native glass/noise support also does not imply variable-driven native material controls. [F01/F05/T06](evidence.md#public-sources).

## Proposals

**Option A — source document plus export adapters (recommended).** A typed Area draft retains layer IDs, source selectors, mode/role rules, overrides and dependency revisions. Preview and CSS generation share one compiler/resolver. Target adapters emit the supported fields and a loss manifest. This preserves editability and exposes the semantic information that generic composites cannot carry. The cost is a versioned schema, migrations, capability profiles and per-target acceptance tests.

**Option B — token document as the only source.** Put material-specific controls and policy in proprietary DTCG extensions, using standard composites wherever possible. This is convenient for a token-first pipeline, but a generic importer will still lack the material renderer. Essential semantics in extensions make the result an Area-specific token profile and create a larger round-trip compatibility burden. Do not advertise this as a universally interoperable material format.

Start with canonical JSON download/import, scoped CSS and the gallery's independent comparison stages. Add DTCG projection with the sidecar; then test Tokens Studio and Figma adapters against explicitly recorded versions. Tailwind is a packaging integration with the CSS renderer, not another material implementation. Hosted short links and native-glass calibration can follow separately.

### Illustrative artifacts

- [material.area.json](examples/material.area.json): one portable requested recipe snapshot (Glass from 13), both modes/all roles, revision/hash and a patch disabling optional popup glint. It is a proposal envelope, not a current Theme config.
- [projection-input.json](examples/projection-input.json): a separate authored serialization fixture. Its arbitrary dimensions/colors do not come from a computed Glass rendering and are not Area design defaults.
- [projection.tokens.json](examples/projection.tokens.json): DTCG-shaped shadow, gradient, border and dimension projection of that fixture.
- [projection.tokens-studio-legacy.json](examples/projection.tokens-studio-legacy.json): corresponding illustrative legacy dialect; no plugin-import success is claimed.
- [projection.loss.json](examples/projection.loss.json): field-preservation, conversion and sidecar records, including gradient geometry, acquisition/fallback and Area policy.

No runnable gallery or production exporter was built. The request is a tooling proposal; these small data examples make the interchange contract reviewable without pretending that a renderer or integration already exists.

## Validation

```sh
PYTHONDONTWRITEBYTECODE=1 python3 docs/research/astra/materials/14-tooling/build.py --check
```

Omit `--check` to regenerate the fixtures and evidence files. The script finds the repository relative to itself, reads immutable inputs, and writes only within this topic. It validates Area source-line bounds, complete light/dark role snapshots, JSON/hash round-trip integrity, shadow/border/gradient field preservation, loss coverage, deterministic outputs, local links, Python syntax and files below 1 MB. It is deliberately a limited structural check, not an official DTCG validator or target-tool/rendering test. Existing production tests are unchanged.

## Open questions

- Which installed Tokens Studio/Figma versions should the future adapter certify? Current public documentation does not prove a successful import into the owner's environment.
- Should an initial Figma export offer native glass as an explicitly approximate variant, or restrict itself to the simpler matched web layer stack? No numeric equivalence was found.
- Which compiled profile topologies and control bounds will be approved? Task 13's values remain uncalibrated proposals; the builder must not promote them to validated defaults.
- What schema migration and transport budgets should a production importer enforce? The examples define the structure, not a production parser or a universal link-length limit.
- Current role bindings, control-only scope derivation and optical masks remain future implementation work. Until those exist, a gallery cannot honestly preview all these controls across every family.

## Status of the machine-readable examples after D6/D9

The schema, example payloads and round-trip results in this folder intentionally remain the original 12-role, eight-preset control contract. Their original successful serialization findings still hold. **Superseded — D2, D3, D6, D9, D16:** these frozen examples are not a current Theme API, 13-role schema or Figma-angle adapter. The later v2 export task must version the schema and migrate the payload explicitly; this correction does not silently reinterpret stored angles or recompute old hashes.
