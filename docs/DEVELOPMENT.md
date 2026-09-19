# Development

Use Node 22.18+, 24.x, or 26+ and npm workspaces. Install with `npm ci`.

## Architecture

The dependency order is tokens → styles → React → docs. Keep these four boundaries;
a smaller folder count would not justify coupling CSS to React or docs to token internals.

- `packages/tokens/src/`: palette math, semantic resolution, axis registry and emitters.
  The build validates namespace ownership and emits CSS, JSON, config helpers and types.
- `packages/styles/src/`: framework-free component CSS plus `manifest.ts`. Build bundles
  the stylesheet and checks selector/manifest parity.
- `packages/react/src/`: markup, native behavior, composition and typed variant helpers.
  `scripts/build-modules.mjs` emits ESM and declarations without bundling away boundaries.
- `apps/docs/src/`: page metadata, practices, real demos and hydrated browser fixtures.
  `render.mjs` renders demos and extracts their own source; `build.mjs` makes static pages.
  The docs audit checks shared-component usage and disallows undocumented raw styling.

The site has no application backend, database or required secrets. Geist fonts currently
load from a pinned external URL; custom consumers may supply their own font tokens.

## Daily commands

```sh
npm run dev            # live preview at http://localhost:4321
npm run build          # tokens, styles/manifest, React JS + declarations
npm run build:docs     # package build, static site, docs audit
npm run typecheck      # packages, demos and browser lab
npm test               # token math, axes and contrast
```

`build` does not run tests. Build before typechecking a fresh checkout because docs
resolve the compiled React declarations. Do not run competing full builds against the
watcher: it may replace declarations during typecheck. Stop the dev process first when
running the full verification sequence, then restart it for preview.

The development server watches source changes, builds into an ignored staging directory
and swaps in a successful immutable snapshot. A failed build retains the prior preview.
Restart after editing server/watcher code. `PORT=4322 npm run dev` chooses another port.
`npm run build:docs` writes `apps/docs/dist`; the static server must restart to read a new
snapshot. Completion status is source data under `apps/docs/src`, so the watcher sees it.

## Checks by change

- **Docs/content/gallery:** docs build/audit, typecheck when TSX changes, inspect the pages.
- **CSS/manifest/React:** docs build (includes parity), typecheck, relevant component tests,
  and browser behavior/geometry checks for affected cases.
- **Tokens/color/focus/state painting:** also run `npm test` and
  `node packages/tokens/src/contrast/report.ts`; never lower floors to obtain a pass.
- **Packaging/exports:** also run `npm run test:consumer` after build.
- **Preview/server:** run `npm run test:preview` and restart/inspect the live preview.

Targeted checks:

```sh
npm run lint:manifest
npm run audit
npm run test:badge
npm run test:switch
npm run test:contracts
npm run test:consumer
npm run test:preview
git diff --check
```

Browser fixtures include `lab.html` (interaction), `scopes.html` (theme inheritance),
`contrast.html` (rendered paint), `inset.html` (optical geometry), and `switch-audit.html`
(Switch checks). Use the relevant fixture rather than all of them for every copy edit.
The frozen inset comparison stylesheet is `tests/fixtures/inset-before.css`; historical
reports are not build dependencies. See the gallery at desktop/narrow widths and both
UI scales/themes when visual changes warrant it.

## Files to keep and regenerate

Keep the manifest, package tests, consumer fixture, lockfile, browser checks and useful
build scripts. They enforce the library's quality rather than documenting a process.

Keep `apps/docs/assets/area-icons/` and `area-icons-filled/` as vendored inputs, and the
checked-in generated sprites, `src/icons.tsx`, `scripts/icons.generated.mjs` and
`scripts/icons.catalog.mjs` as build inputs. Regenerate with:

```sh
node apps/docs/scripts/gen-icons.mjs
```

Do not commit `dist/`, `.cache/`, `node_modules/`, test output or logs. Old benchmark
source checkouts remain ignored even inside the archive. Optional archived lookup:

```sh
npm run reference:lookup -- slider
npm run reference:lookup -- badge --full --sys flu
```

No network fetch is needed for lookup. Refresh commands and historical source pins are
in [the archive guide](../archive/README.md); they are not part of normal development.

## Package contract and remaining release work

Only `dist` is packed. Public imports use compiled ESM and `.js` relative references.
CSS is imported separately. Token root/config exports are DOM-free; style manifest and
React variants are explicit entry points. Source paths are private.

The consumer check packs local tarballs, tests export targets and strict NodeNext types,
renders without a DOM, and bundles browser JS/CSS with tree-shaking. It does not publish
or test an external registry installation. React peer-version and RSC framework coverage
still need explicit verification; do not infer either from a passing Node render.

Existing limitations include incomplete composite-widget behavior, Slider uncontrolled
fill synchronization and motion-none coverage. Native Windows forced colors, assistive
technology, touch behavior and cross-engine execution remain release validation work.
The standard soft-border presentation has documented contrast shortfalls; see
[Contrast](CONTRAST.md). Completion means owner acceptance of a family, not universal
accessibility certification or permission to publish a package.

## Keeping documentation small

The active docs are five guides linked from the root README. Keep current contracts here,
exact APIs in source/live pages, and historical evidence in `archive/`. Do not create a
new plan/report/skill for routine component work. Update `.Codex/HANDOFF.md` after
substantial work; append concise decisions to the journal when useful. Neither a report
nor a session summary can overrule the completion registry or the owner's latest request.
