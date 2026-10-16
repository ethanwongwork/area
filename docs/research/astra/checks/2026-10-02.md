# Check report — 2026-10-02

Audited commit: [`0aa0a5224804f1d2a2fb0be0cea79e8f599736bc`](https://github.com/ethanwongwork/area/commit/0aa0a5224804f1d2a2fb0be0cea79e8f599736bc). Branch: `codex/check-report`, created from fetched `origin/main`. Date uses America/Los_Angeles.

Scope: the ten commands explicitly requested by the owner, each run twice. The baseline is [the handoff Checks paragraph](https://github.com/ethanwongwork/area/blob/0aa0a5224804f1d2a2fb0be0cea79e8f599736bc/.Codex/HANDOFF.md#L139-L142) and [Development daily and targeted checks](https://github.com/ethanwongwork/area/blob/0aa0a5224804f1d2a2fb0be0cea79e8f599736bc/docs/DEVELOPMENT.md#L24-L65); command definitions are pinned in [package.json](https://github.com/ethanwongwork/area/blob/0aa0a5224804f1d2a2fb0be0cea79e8f599736bc/package.json#L11-L36). Other targeted Development commands were not separately added to the requested list.

Environment: macOS arm64, Node v26.7.0, npm 11.19.0 (measured with `node`, `npm --version`). Dependencies installed from the lockfile with `npm ci --no-audit --no-fund`. The isolated worktree began without generated docs or a watcher. No source fixes or changes to protected files were made.

Method: two complete sequential passes in table order, continuing after failures. Generated outputs were retained between passes; each pass included its scheduled package and docs builds. Wall times were measured using Node `performance.now()` around each command subprocess and rounded to milliseconds, including npm startup and output capture. PASS means exit code 0; FAIL means nonzero. Counts below come directly from test summaries, not inferred coverage. Non-test checks do not emit a test total.

Local raw stdout/stderr: `/private/tmp/area-check-report-2026-10-02/<run>-<id>.log`; exact timestamps, exit codes and unrounded durations: `/private/tmp/area-check-report-2026-10-02/results.json`; runner: `/private/tmp/area-check-report-2026-10-02/run.mjs`. These are temporary evidence, excluded from the PR. Run IDs in row order: `build`, `typecheck`, `test`, `react`, `contracts`, `consumer`, `icons`, `manifest`, `docs`, `audit-page`. Failure output is preserved below.

| Check | Run 1 | Wall time | Run 2 | Wall time | Test counts vs handoff |
| --- | --- | ---: | --- | ---: | --- |
| `npm run build` | PASS (0) | 2.222 s | PASS (0) | 2.154 s | Both: No test total emitted; no handoff count |
| `npm run typecheck` | PASS (0) | 5.698 s | PASS (0) | 5.784 s | Both: No test total emitted; no handoff count |
| `npm test` | PASS (0) | 9.306 s | PASS (0) | 8.909 s | Both: 19590 passed; handoff 19,590 (matches) |
| `node --test packages/react/tests/*.test.mjs` | FAIL (1) | 0.334 s | PASS (0) | 0.354 s | Run 1: 210 total (208 passed, 2 failed); handoff 205 (+5 total). Run 2: 210 total (210 passed, 0 failed); handoff 205 (+5 total) |
| `npm run test:contracts` | PASS (0) | 0.153 s | PASS (0) | 0.159 s | Both: 14 passed; no handoff count |
| `npm run test:consumer` | PASS (0) | 1.760 s | PASS (0) | 1.818 s | Both: No test total emitted; no handoff count |
| `npm run lint:icons` | PASS (0) | 66.108 s | PASS (0) | 69.795 s | Both: No test total emitted; no handoff count |
| `npm run lint:manifest` | PASS (0) | 0.378 s | PASS (0) | 0.358 s | Both: No test total emitted; no handoff count |
| `npm run build:docs` | PASS (0) | 4.399 s | PASS (0) | 4.397 s | Both: No test total emitted; no handoff count |
| `npm run audit:page -- --check` | PASS (0) | 0.114 s | PASS (0) | 0.116 s | Both: No test total emitted; no handoff count |

## Failure and differing result

The first React run failed because the fresh checkout had no `apps/docs/dist/gallery-components.html`. The Badge and Indicator tests read that generated file directly. The scheduled `npm run build:docs` completed later in pass 1; the second React run then passed with no source changes. This is an observed check-order/artifact dependency, not evidence of unexplained nondeterministic flakiness. No additional rebuilds or retries were inserted beyond the requested two passes.

Pinned reads: [Badge test](https://github.com/ethanwongwork/area/blob/0aa0a5224804f1d2a2fb0be0cea79e8f599736bc/packages/react/tests/badge.test.mjs#L47-L50) and [Indicator test](https://github.com/ethanwongwork/area/blob/0aa0a5224804f1d2a2fb0be0cea79e8f599736bc/packages/react/tests/indicator.test.mjs#L52-L54). [Root build scripts](https://github.com/ethanwongwork/area/blob/0aa0a5224804f1d2a2fb0be0cea79e8f599736bc/package.json#L12-L13) show that `build` does not build docs, while `build:docs` does.

Run 1 failure output, verbatim from `1-react.log`:

```text
✖ failing tests:

test at packages/react/tests/badge.test.mjs:47:1
✖ Badge gallery splits the complete matrix into one specimen per tile (6.598583ms)
  Error: ENOENT: no such file or directory, open '/Users/ethanwong/.codex/worktrees/check-report/area/apps/docs/dist/gallery-components.html'
      at readFileSync (node:fs:539:20)
      at TestContext.<anonymous> (file:///Users/ethanwong/.codex/worktrees/check-report/area/packages/react/tests/badge.test.mjs:50:17)
      at async Test.run (node:internal/test_runner/test:1404:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:969:7) {
    errno: -2,
    code: 'ENOENT',
    syscall: 'open',
    path: '/Users/ethanwong/.codex/worktrees/check-report/area/apps/docs/dist/gallery-components.html'
  }

test at packages/react/tests/indicator.test.mjs:52:1
✖ gallery presents exactly one indicator variant per specimen (0.491ms)
  Error: ENOENT: no such file or directory, open '/Users/ethanwong/.codex/worktrees/check-report/area/apps/docs/dist/gallery-components.html'
      at readFileSync (node:fs:539:20)
      at TestContext.<anonymous> (file:///Users/ethanwong/.codex/worktrees/check-report/area/packages/react/tests/indicator.test.mjs:54:17)
      at async Test.run (node:internal/test_runner/test:1404:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:969:7) {
    errno: -2,
    code: 'ENOENT',
    syscall: 'open',
    path: '/Users/ethanwong/.codex/worktrees/check-report/area/apps/docs/dist/gallery-components.html'
  }
```

Run 2 summary from `2-react.log`:

```text
ℹ tests 210
ℹ suites 0
ℹ pass 210
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 317.073833
```

## Owner proposals (not applied)

- Document `npm run build:docs` as a prerequisite for the full React suite in a fresh checkout, or arrange for that check to generate its gallery fixture before reading it.
- Refresh the handoff React test count from 205 to the measured 210. This is documentation drift, separate from the missing-artifact failures.

No fixes were applied. The report is the only tracked change; build output, caches, dependencies and raw logs are excluded.
