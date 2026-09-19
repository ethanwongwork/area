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
npm run test:contracts
npm run test:consumer
npm run test:preview
```

The build checks axis integrity and CSS/manifest parity. The docs build also renders
all examples and runs the dogfood audit. Contrast is enforced by Vitest, not by `build`.
There is no general ESLint script; manifest parity and the docs audit are the existing
lint checks. The docs MJS/TSX pipeline is bundled and rendered; all demos and the hydrated lab also have a tsc task.

For runtime checks, use `npm run dev`, open the site, follow component links, and change
inspector controls. The dev server watches source edits, publishes only successful builds, and reloads the
browser. Restart it after editing the watcher/server itself. Use the System lab for the
repeatable six-profile baseline; see [E01](batches/E01/README.md) for commands and limits.
The generated `packages/tokens/dist/fixture/axes.html` also exposes `window.areaSweep()`
for browser inspection of axis presets.

The V04 `inset.html` fixture compares rendered optical edges, first-line alignment and
same-tier icon/text/gap sizes across 32 profiles. Click **Run geometry checks**; the
result is also available as `window.insetResults`. Repeat at 390px and inspect
`gallery.html`. `inset-before.html` uses the frozen pre-V04 CSS for comparison.
See [V04](batches/V04/README.md) for captured results and platform limits.

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

- E04 repairs public exports with compiled ESM and declarations. Run the build first, then
  `test:consumer`; see [API migration and troubleshooting](API_MIGRATION.md).
- E03 removes the four syntax waiver groups through readable color selection. No active
  exception remains. Preserve explicit reporting if a future exception is proposed.
- Some old source comments retain historical measurements or old names. The current
  token tables, manifest and passing checks take precedence over historical prose.
- E03 replaces the invalid-input halo with the shared opaque focus outline while preserving
  its danger border. Required edges and focus survive every Surface preset.
- The [contrast-policy proposal](../plans/contrast-policy.md) is a historical research
  snapshot, not an active ninth axis. It must be remeasured and explicitly scoped before work.
- Figma utilities are archived. Their usefulness to external Figma documents cannot be
  established from this repository; no current sync workflow is wired to the application.

## Session continuity

Start with [the handoff](../../.Codex/HANDOFF.md); consult
[the journal](../../.Codex/JOURNAL.md) for reasoning. Use the project checkpoint skill to
verify, commit, push and update both. Keep plans, rationale and current state in Git,
not only in a private assistant session. Historical snapshots are not active instructions.

## Current status — E04

[The dated audit](SYSTEM_AUDIT.md) preserves the original failures. E02 repairs nested color
scope/reset. E03 passes 16,316 token tests and 308 contrast groups with zero waivers, and adds
rendered contrast evidence. Build/typecheck/parity/docs checks pass. The contrast report now
exits nonzero on an unwaived failure; build alone still does not run the token gate.

Remaining defects include motion-none animation, composite widget behavior, slider keyboard
fill. E04 verifies the packed API, native state selectors, strict declarations, SSR and
browser bundling. RSC framework integration and the React 18 peer range remain unverified.
Safari revalidation of E03 was unavailable
because the host Mac was locked; Gecko and native Windows forced-colors were not tested.
See [ROADMAP.md](ROADMAP.md) and [the E04 report](batches/E04/README.md). Do not infer a complete
accessibility or release-readiness claim from passing token and local fixture checks.
