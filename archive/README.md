# Archive

Historical material is retained for lookup and provenance. It is not the current build
workflow, completion status, design authority or authorization to implement a plan.
Start with the root [README](../README.md) and the five active guides in `docs/`.

## What is here

- `docs/audit-pack/`: benchmark source extracts, pinned versions, construction tables,
  broad capability inventories and the retired audit procedure.
- `docs/component-audits/`: historical component reports, including reports that called
  components complete before owner acceptance. Current completion is in
  [`component-status.mjs`](../apps/docs/src/component-status.mjs).
- `docs/batches/`, `docs/research/`, `docs/color-proposal/`: measurements, screenshots,
  proposals and development snapshots. Captured results describe their recorded version.
- Other `docs/*.md`: prior roadmaps, architecture/design narratives and migration reports.
- `guidance/`: superseded root instructions, audit skills, checkpoint instructions and
  the duplicated optical-inset rule. Archived skills are not active instructions.
- `playground/`, `history/`, `plans/`, `NAMING.md`: material already archived before this cleanup.

The audit pack is useful as a reference library: it can answer where a measurement came
from or suggest a missing capability. Its mandatory multi-system comparisons, duplicated
repo map, staged approval gates and exhaustive reports imposed too much overhead for
ordinary component work. They are retired, not required reading.

## Find a specific measurement

```sh
npm run reference:lookup -- slider
npm run reference:lookup -- badge --full --sys flu
npm run reference:lookup -- --find toggle
```

Default ripgrep searches skip this archive via `.rgignore`. Search prose explicitly with
`rg --no-ignore "pattern" archive/docs/`.

Lookup reads local evidence without a network fetch. Start with
[the evidence index](docs/audit-pack/evidence/INDEX.md) and
[source pins](docs/audit-pack/evidence/PINS.md). Extracted source may omit selectors or
reset context; read the complete relevant source before inferring geometry. Do not treat
an old proposal or source excerpt as a current rendered result.

To deliberately refresh the optional corpus, from the repository root:

```sh
(cd archive/docs/audit-pack/tools/audit-evidence && ./fetch.sh && python3 extract.py && python3 lookup.py --reindex)
```

`fetch.sh --latest` additionally updates pins. Source caches stay ignored under `.cache/`.
Refreshing is not a prerequisite for a component change or normal build.

## Cleanup record — 2026-09-19

Preserved all existing documentation and source evidence here, including the uncommitted
Slider proposal and Badge notes from this session. Active docs were reduced from 1,682
tracked files (61 Markdown documents) to five guides. Old root guidance was copied before
rewriting; the two audit skills and duplicated editor rule were retired. Checkpoint is
now a short, optional session-saving skill.

The library packages, manifest, tests, palette, public API, live docs, icon inputs and
build tooling remain. The live inset baseline moved to `tests/fixtures/inset-before.css`
so normal builds do not read archived reports. Its archived copy is retained as evidence.
Local Markdown links were rebased where files moved. Commands in historical narratives
may still describe the old checkout; use this guide for current lookup instructions.

This is organizational simplification, not claimed disk reclamation: the approximately
284 MB of ignored benchmark source caches and the source extracts remain recoverable.
