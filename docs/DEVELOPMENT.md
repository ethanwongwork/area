# Development

Use Node 22.18+, 24.x, or 26+ and npm workspaces. Install with `npm ci`.

## Architecture

The dependency order is tokens → styles → React → docs. Keep these four boundaries;
a smaller folder count would not justify coupling CSS to React or docs to token internals.

- `packages/tokens/src/`: palette math, semantic resolution, axis registry and emitters.
  The build validates namespace ownership and emits CSS, JSON, config helpers and types.
- `packages/styles/src/`: framework-free component CSS plus `manifest.ts`. Build bundles
  the stylesheet, checks selector/manifest parity, and checks that every `var(--area-*)`
  names a defined token or carries a fallback (`scripts/check-token-refs.mjs`).
- `packages/react/src/`: markup, native behavior, composition and typed variant helpers.
  `scripts/build-modules.mjs` emits ESM and declarations without bundling away boundaries.
- `apps/desktop/`: the app and the source of truth. `src/content/` holds the component content
  (`pages.mjs`), owner-confirmed status (`component-status.mjs`), specimens and their names, the demo
  registry and every demo; `src/gallery/` the tile fit and the Canvas controls.
- `apps/docs/`: the archived site, not a source of truth. Its build (`render.mjs`, `build.mjs`) still
  reads the app's content and demos. Area's icon pipeline is in `packages/icons`; the old Fluent map
  (`scripts/gen-icons.mjs` and its outputs) is still here.

The site has no application backend, database or required secrets. Geist fonts currently
load from a pinned external URL; custom consumers may supply their own font tokens.

## Daily commands

```sh
npm run dev            # the desktop app (Electron), reloading on change
npm run preview        # the same, plus the app in a browser at http://localhost:4400
npm run dev:docs       # the archived docs site at http://localhost:4321
npm run build          # tokens, styles/manifest, React JS + declarations
npm run build:docs     # package build, static site, docs audit
npm run typecheck      # packages, demos and browser lab
npm test               # token math, axes and contrast
```

`build` does not run tests. Build before typechecking a fresh checkout because docs
resolve the compiled React declarations. Do not run competing full builds against the
watcher: it may replace declarations during typecheck. Stop the dev process first when
running the full verification sequence, then restart it for preview.

The desktop app (`apps/desktop`) bundles `src/main.tsx` with esbuild into `apps/desktop/dist` and
copies `area.css` beside it. The Electron window always shows the checkout that started it:
starting `dev` or `preview` closes any other Area dev window (another worktree's included), a
renderer rebuild reloads the window and the browser page, a change under `apps/desktop/electron`
restarts the window, and a change under `packages/<name>/src` rebuilds that package and the ones
after it (tokens → styles → react). Icons are not watched; run `npm run build -w @area/icons`
after regenerating them. `preview -- --no-electron` serves the browser alone.

The archived docs site's development server watches source changes, builds into an ignored staging directory
and swaps in a successful immutable snapshot. A failed build retains the prior preview.
Restart after editing server/watcher code. `PORT=4322 npm run dev:docs` chooses another port.
`npm run build:docs` writes `apps/docs/dist`; the static server must restart to read a new
snapshot. Completion status is source data under `apps/desktop/src/content`.

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
npm run lint:manifest   # manifest parity and token references
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

Area's own icons (`packages/icons/sources/`) have their own tools in `packages/icons/scripts/`; the
process is the `area-icon-construction` skill's quick path.

```sh
npm run icons:find -- brain "paper plane"          # does Area have it already?
npm run icons:geometry                             # fillets, cuts, lobes, gaps (prints usage)
node packages/icons/scripts/generate.mjs --only a,b   # lint just these icons in a second
npm run icons:batch -- batch.json                  # record a batch everywhere it belongs
npm run icons:sheet -- compare out.png batch-43    # Area beside Fluent, outline and filled
npm run icons:pilot                                # full lint (about 3 minutes) and generate
npm run icons:refs -- fetch                        # Lucide, Phosphor, Hugeicons, Material metadata into .cache
npm run icons:keywords                             # rebuild sources/keywords.json (after a generate)
```

Do not commit `dist/`, `.cache/`, `node_modules/`, test output or logs. Source checkouts
cloned for research go in the ignored `.cache/sources/<system>@<sha>/`.

## Research captures

`apps/docs/public/area-capture.js` measures an element's layer tree (geometry, insets from
parent and shell, computed styles, text cap/baseline, SVG viewBox and ink, pseudo-elements
and readable declared rules). The gallery loads it; on other pages, run its full text in
the browser. Captures are saved under `docs/research/captures/<slug>/` and compared with:

```sh
npm run capture:compare -- docs/research/captures/indicator/*.json
node scripts/validate-badge.mjs   # every Badge gallery capture against docs/specs/badge.md
```

The workflow is in [Building a component](COMPONENT_ADAPTATION.md#capture-protocol).
Read each capture before committing it: redaction is on by default off localhost, but
committed captures must not contain personal content.

## Package contract and remaining release work

Only `dist` is packed. Public imports use compiled ESM and `.js` relative references.
CSS is imported separately. Token root/config exports are DOM-free; style manifest and
React variants are explicit entry points. Source paths are private.

The consumer check packs local tarballs, tests export targets and strict NodeNext types,
renders without a DOM, and bundles browser JS/CSS with tree-shaking. It does not publish
or test an external registry installation. React peer-version and RSC framework coverage
still need explicit verification; do not infer either from a passing Node render.

Existing limitations include incomplete composite-widget behavior and motion-none
coverage. Native Windows forced colors, assistive technology, touch behavior and
cross-engine execution remain release validation work.
The standard soft-border presentation has documented contrast shortfalls; see
[Contrast](CONTRAST.md). Completion means owner acceptance of a family, not universal
accessibility certification or permission to publish a package.

## Keeping documentation small

The active docs are the guides linked from the root README. Keep current contracts in
them, exact APIs in source/live pages, each component's evidence and decisions in its
spec, and history in Git and the journal. Do not create a new plan, report or skill for
routine component work. Update `.Codex/HANDOFF.md` after
substantial work; append concise decisions to the journal when useful. Neither a report
nor a session summary can overrule the completion registry or the owner's latest request.
