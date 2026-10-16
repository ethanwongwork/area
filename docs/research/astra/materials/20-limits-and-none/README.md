**Question:** Which rules remain hard limits for every material, which restraint becomes None's defaults, and how can None be proven pixel-identical to current Area?

**Answer:** There are **22 material-facing hard-limit records**, each with current rule/test evidence and its missing coverage. Contrast, focus, fixed hover ink, semantics, preferences and geometry/type/ink separation remain hard requirements. Shadowless controls, plain labels and quiet containers are None defaults, with D13 still prohibiting automatic small-text/glyph decoration. **None means no added material paint while preserving all existing Area paint**, including Surface and literal shadow exceptions. A two-build gallery comparison across Light/Dark × Default/Compact, with computed styles and exact pixel diffs, is the proposed proof. No production None implementation or pixel-identity pass is claimed.

**Snapshot:** checked **2026-10-12**, America/Los_Angeles. Area `origin/main` **d455567e5b264a768f42dc853476f1622ed6dd9f**; research/review **dbd57a9067e3d927b2bfb7a061db074eeaf48db9**. Read the [brief](../README.md), [review and decisions](../REVIEW.md), current AGENTS/README/handoff, and [CONTRAST.md:1–80](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/CONTRAST.md#L1-L80). Source pins use the current main SHA, not task 19's older inventory snapshot.

## Evidence and deliverables

- [Hard limits](hard-limits.md): 22 records with the rule, enforcement today, missing material-specific test and immutable file:line citations. [hard-limits.json](hard-limits.json) carries the same records.
- [None's restraint defaults](defaults.md): the three requested defaults, their actual CSS/docs/test evidence, and exceptions that None must preserve.
- [None definition and proof protocol](none-and-proof.md): baseline/candidate builds, exact app specimen enumeration, mode/density/state/preference matrix, nested resets, computed styles and zero-pixel-difference acceptance.
- [Source search](source-search.json) and [source pins](source-pins.json): reproducible bounded absence searches and immutable input hashes/ranges. “Not found” does not mean a browser verification passed.

## Findings that change the test plan

The production contrast gate measures opaque semantic tokens and explicitly rejects alpha without compositing. Strong indicator endpoints have 3:1 checks, but the standard quiet appearance has documented shortfalls. Do not turn “keep current tests” into a claim that every material or baseline edge conforms. [contrast.test.ts:21–29](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/contrast/contrast.test.ts#L21-L29), [CONTRAST.md:13–17](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/CONTRAST.md#L13-L17).

The app is now the source of truth. Its component gallery enumerates app-owned specimens, lazily mounts families and excludes some verification fixtures; testing an archived gallery or the initial All viewport would miss coverage. [README.md:20–34](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/README.md#L20-L34), [components.tsx:41–56](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/apps/desktop/src/pages/components.tsx#L41-L56), [components.tsx:133–145](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/apps/desktop/src/pages/components.tsx#L133-L145), [specimens.mjs:1010–1019](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/apps/desktop/src/content/specimens.mjs#L1010-L1019).

Current main separates **type** from **density**, with Compact, Default and Comfortable choices. The required four Light/Dark × Default/Compact contexts remain the minimum; the protocol also includes Comfortable and preserves the app's type-13 Compact chrome. An old `data-area-ui`-only plan is insufficient for this snapshot. [controls.ts:25–40](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/apps/desktop/src/gallery/controls.ts#L25-L40), [app-scale.ts:1–6](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/apps/desktop/src/app-scale.ts#L1-L6).

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
