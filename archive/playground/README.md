# Archived playground

Historical reference only. This bundle was imported in commit `c35ac15` and has no
connection to the current npm workspaces, build, tests or docs server. The migration
moved these files without changing their contents or internal relative layout.
Its embedded instructions describe the old system and must not govern current Area work.

## Contents and classifications

- **`index.html` — ARCHIVE.** Self-contained `ds-*` playground using DM fonts and the old
  palette. Its useful design history remains available here and in Git.
- **`figma-sync.js` — ARCHIVE.** Figma-console utility that creates palette variables,
  light/dark semantic aliases, numeric tokens, text styles and effect styles. It mirrors
  this playground's hardcoded ramps, not current Area token JSON. Its text-style phase
  deletes all existing local text styles before recreating them, despite the old header's
  claim that rerunning is safe. Do not run it on a current Figma document as an Area exporter.
- **`figma-reassign-styles.js` — ARCHIVE.** Companion one-off that walks the current
  Figma page, skips already-styled/mixed/empty text, and matches remaining text to local
  styles by family, size and weight. It assumes DM Sans/DM Mono and expects sync to have
  created styles first. Matching logic may be useful for a future explicit migration.
- **`.cursor/rules/*.mdc` — ARCHIVE.** Old specification, history and table conventions.
  Their original paths are retained here for cross-reference, outside the active root
  Cursor rules directory. Fixed lengths, Phosphor icons, old type roles and component
  registration steps conflict with today's token and React architecture.
- **`prompts/composer-component.md` — ARCHIVE.** Instructions for adding a component to
  this single-file playground. It is not an active Area implementation plan.

Neither Figma utility is necessary for the current application. No package script,
import, build configuration or test invokes either; only the old material references
them. Current Area has no replacement Figma sync workflow: it was deliberately dropped.
Whether a separate personal Figma document still needs these utilities is unknown,
which is why their logic is preserved rather than deleted.
