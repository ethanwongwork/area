# Maintenance

## Verification

From the repository root, with dependencies installed (`npm ci`):

```sh
npm test
npm run build
npm run lint:manifest
npm run build:docs
node packages/tokens/src/contrast/report.ts
npm run typecheck
```

The build checks axis integrity and CSS/manifest parity. The docs build also renders
all examples and runs the dogfood audit. Contrast is enforced by Vitest, not by `build`.
There is no general ESLint script; manifest parity and the docs audit are the existing
lint checks. The docs MJS/TSX pipeline is bundled and rendered, but has no separate tsc task.

For runtime checks, use `npm run dev`, open the site, follow component links, and change
inspector controls. Rebuild and refresh after source edits; the server has no watcher.
The generated `packages/tokens/dist/fixture/axes.html` also exposes `window.areaSweep()`
for browser inspection of axis presets.

## Generated and vendored files

Keep generated icon files checked in: the docs builder imports them directly.
Regenerate from any working directory using the path to `apps/docs/scripts/gen-icons.mjs`.
The generator resolves its source package through Node and its outputs relative to itself.
Changing the Fluent dependency or Area sources requires regeneration and visual review.
Do not hand-edit the generated TSX, catalog, markup helpers or SVG sprites.

Keep both `apps/docs/assets/area-icons/` and `area-icons-filled/`: they are inputs,
not duplicate output. Likewise, the Regular and Filled sprites intentionally share IDs
with different geometry. `navigation.css` and `nav.css` also serve different components;
both are imported by the stylesheet entrypoint.

`dist/`, `.cache/`, `node_modules/`, logs and OS metadata remain ignored.
There are no checked-in environment templates or CI workflows.

## Known limitations inherited from before migration

- `@area/tokens` declares a root export to `src/index.ts`, but that file does not exist.
  Current workspaces use its CSS/JSON exports or direct source imports. A public root API
  needs a deliberate contract; this cleanup does not invent one.
- Four documented contrast waivers remain, with expiration checks. Consult
  `packages/tokens/src/contrast/exceptions.ts`; do not hide or remove them to claim a pass.
- Some old source comments retain historical measurements or old names. The current
  token tables, manifest and passing checks take precedence over historical prose.
- The input invalid-focus ring uses its own recipe, as recorded by the previous handoff.
  Revisit it when changing focus geometry; it was not changed by this migration.
- The [contrast-policy proposal](../archive/plans/contrast-policy.md) is a historical research
  snapshot, not an active ninth axis. It must be remeasured and explicitly scoped before work.
- Figma utilities are archived. Their usefulness to external Figma documents cannot be
  established from this repository; no current sync workflow is wired to the application.

## Session continuity

Start with [the handoff](../.Codex/HANDOFF.md); consult
[the journal](../.Codex/JOURNAL.md) for reasoning. Use the project checkpoint skill to
verify, commit, push and update both. Keep plans, rationale and current state in Git,
not only in a private assistant session. Historical snapshots are not active instructions.
