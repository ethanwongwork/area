# Component contract drift

**Question:** Which component contracts disagree across specs, styles, manifest, React and demos, and which earlier findings remain on current main?

**Answer:** The [2026-10-07 recheck](2026-10-07.md) revisits all 40 earlier mismatches: 1 fixed, 37 still open and 2 changed. It adds 8 findings for the new or changed families and corner setting. No component or approval changes were made.

**Snapshot:** `origin/main` `4c1854202a8e109479d5b83ef24a8325231da056`, checked 2026-10-07 (America/Los_Angeles). Every current source citation is pinned in the dated report.

**Updated 2026-10-07:** added a new dated recheck, preserving the [2026-10-02 baseline](2026-10-02.md). The recheck distinguishes restored pill behavior from the obsolete ignored-prop diagnosis and includes Tag, Disclosure and the corner setting.

## Evidence

- [2026-10-07 findings and proposals](2026-10-07.md)
- [2026-10-07 machine-readable classifications](2026-10-07.json)
- [2026-10-02 baseline](2026-10-02.md)

## Open questions

See the dated report for the unresolved locale/week-start policy and documentation choices. Findings are static research, not owner approval.

## Reproduce

Run `python3 docs/research/astra/drift/recheck.py`. It reads the pinned Git objects and regenerates the current dated report and JSON. Classifications are reviewed judgments, not automatically inferred fixes.
