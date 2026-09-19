# Codex migration — 2026-09-14

## Scope and audit

The repository was inspected before source cleanup: manifests and lockfile, README,
agent instructions, hidden Claude/Cursor configuration, history and handoff, source and
build entrypoints, component/axis contracts, tests, documentation generation, icon inputs
and outputs, Figma utilities, and the old playground. Reference searches included hidden
files, package scripts, imports, configuration and documentation. No environment examples
or checked-in CI workflows were present. Dependencies were already installed.

`git fetch origin` confirmed local `main` matched GitHub at `ea01810` before changes.
The pre-existing untracked `AGENTS.md` and `.agents/skills/checkpoint/SKILL.md` were the
beginnings of a Codex migration: AGENTS duplicated CLAUDE with only handoff paths changed,
and the destination `.Codex/` directory did not exist.

## Codex migration and AGENTS.md

Replaced the 508-line duplicated instruction file with a short orientation guide covering
project purpose, repository map, real commands, essential invariants, component/token
conventions, testing and session continuity. Detailed rationale lives in
[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), with separate [architecture](ARCHITECTURE.md) and
[maintenance](MAINTENANCE.md) guides. The existing Codex checkpoint skill was retained.

## Claude artifacts

- **Migrated:** `CLAUDE.md` knowledge into AGENTS and DESIGN_SYSTEM; `.claude/JOURNAL.md`
  into `.Codex/JOURNAL.md`; session continuity into `.Codex/HANDOFF.md`.
- **Archived:** original `.claude/HANDOFF.md` at
  `archive/history/2026-09-14-claude-handoff.md`, explicitly labeled historical.
- **Preserved research:** the exact external plan referenced by the handoff was copied
  into `archive/plans/contrast-policy.md`, with a status note explaining its stale
  measurements and unapproved scope. No other private session history was imported.
- **Removed:** redundant root CLAUDE, duplicate Claude checkpoint skill and Claude launch
  configuration. The launch configuration only ran the documented docs npm command.
- **Retained as history:** Claude names inside historical records, rather than pretending
  those records were written during this migration. No active workflow depends on `.claude/`.

## Figma files

Both scripts are **ARCHIVED**, with the old playground, under `archive/playground/`.
No current package, build, test or runtime references them.

- **Figma Sync:** emits old hardcoded palette and numeric variables, semantic aliases,
  DM text styles and effects. It does not consume current Area token output. Its style
  phase deletes and recreates local text styles, so its “safe to re-run” header is misleading.
- **Figma Reassign Styles:** walks current-page text nodes and assigns nearby local styles
  using family/size/weight scoring. It depends on styles created by Sync and assumes DM fonts.

Neither function is needed by the current application. Figma integration was deliberately
dropped; there is no active replacement exporter. External personal Figma-document needs
remain unknown, so both scripts and their reusable logic are preserved, not destroyed.
See [the archive guide](../playground/README.md).

## Files removed

These are actual deletions, distinct from moves; all were tracked and recoverable in Git:

- `CLAUDE.md`: duplicate instructions, migrated into the new guidance hierarchy.
- `.claude/skills/checkpoint/SKILL.md`: duplicate of the retained Codex-adapted skill.
- `.claude/launch.json`: agent-specific wrapper around the existing docs dev command.
- `.cursor/hooks.json` and `.cursor/hooks/refresh-preview.sh`: hook only touched two
  nonexistent `ds-builder` paths; no current watcher or package uses that workflow.
- `packages/styles/scripts/demo.mjs`: unreferenced hand-written Button demo page,
  superseded by the real React demos and generated Button documentation. It was not
  invoked by a package script, build, test, import or documentation link.

## Files moved and organization

Moved byte-for-byte into `archive/playground/`, preserving internal relative paths:

- Root `index.html`, `figma-sync.js`, and `figma-reassign-styles.js`.
- `prompts/composer-component.md`.
- `.cursor/rules/design-system-spec.mdc`, `design-system-history.mdc`, and
  `table-conventions.mdc`.

The old rules describe `ds-*`, DM fonts, Phosphor icons and fixed token ramps. Moving them
out of the active root rules directory prevents conflicting instructions while preserving
all reasoning. Archived instructions are explicitly non-authoritative.

Current application directories remain in place. Generated icon sources and both sprites,
original Area SVGs, the token fixture emitter, and all active tests were retained.
No new dependencies or product architecture were introduced.

## Documentation and portability fixes

- README now links to Codex guidance and documents rebuild/refresh behavior.
- Corrected old 144-theme prose to 66, green's actual +14 rotation, removed toolbar prose,
  radius defaults (8px control/14px container), and flat radius with a height cap.
- Clarified actual Button tone API names (`primary`/`brand`) versus historical
  neutral/accent terminology, without renaming the working API.
- Corrected claims that the production build automatically runs contrast tests: tests
  must run separately. No CI/publish enforcement was added or claimed.
- Icon generator paths now resolve from its own module and installed Fluent package,
  rather than a specific Desktop checkout. Regeneration from `/tmp` is byte-identical.
- Node engine metadata now reflects native TS execution and Vitest compatibility:
  `^22.18.0 || ^24.0.0 || >=26.0.0`. Lockfile metadata matches; dependency versions did not change.

## Validation

Before and after cleanup, the same existing checks passed:

- **Tests:** 8,678 passing across 6 test files.
- **Typecheck:** all three package tsc tasks pass. Docs has no separate tsc task.
- **Build:** token emission, axis integrity and stylesheet build pass; React is source-only.
- **Lint:** manifest parity passes for 36 components; docs dogfood audit passes.
- **Docs production build:** 38 pages, 64 demos, all 36 components represented.
- **Contrast report:** 172 passing assertions across 66 themes; 0 failures and 4 existing waivers.
- **Links/assets:** all 3,545 local references across 38 built pages resolve, including HTML anchors.
- **Archive:** all 7 moved legacy files match their original Git bytes.
- **Icon regeneration:** run from `/tmp`; no changes to generated assets.
- **Runtime:** preview opens; Button and Iconography render; inspector opens and theme and
  compact-density controls update correctly; dark compact rendering inspected visually.

The initial server attempt was blocked by sandbox networking. Once permitted, port 4321
was already occupied by the existing working docs server, which was reused. This was not
an application build failure.

## Remaining uncertainties and inherited limitations

No baseline test, lint, typecheck or production-build failures were found.
The token package's root export points to missing `src/index.ts`; existing workspaces use
other exports or direct source imports. It remains documented for a deliberate API decision.
There is no standalone docs typecheck or checked-in CI, and existing contrast waivers remain.
Some historical source comments still contain older measurements. The contrast-policy plan
is preserved but not implemented, and external uses of the Figma utilities remain unknown.
See [maintenance](MAINTENANCE.md) for the ongoing list.

## Follow-up — Area naming and decorative strokes

At the user's request, current palette metadata, custom icon directories, source labels,
generated identifiers, comments and current documentation now use Area. Previous names
and research snapshots are preserved in `archive/history/` and `archive/plans/`;
[the archived naming audit](../NAMING.md) records the inventory and exceptions.
Fluent's literal shape and venue glyph names remain upstream vocabulary.

The new `--area-border-decorative` token maps to neutral 50 (`#f7f7f7`) in light themes
and neutral 800 (`#282828`) in dark themes. Panels, cards, dialogs, popovers, menus,
table rules, navigation dividers, code containers and docs preview edges use it.
Interactive control outlines, focus rings and their contrast thresholds remain unchanged.

Follow-up validation: 8,876 passing tests; 176 passing contrast assertions across 66 themes,
4 existing waivers, no failures; typechecks and 36-component parity pass; 38 pages and
64 demos build with a clean docs audit. Both icon sprites preserve their original geometry,
and every palette color value is unchanged. The browser confirms the new light border
color and the Area source filter returns 29 icons with valid Filled sprite references.

The migration commits are local. Automatic approval review blocked pushing to origin/main
pending explicit user authorization; no remote update was made.
