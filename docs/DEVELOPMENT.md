# Development

Commands, checks and how to verify work. How the code is organized is in
[Architecture](ARCHITECTURE.md).

Use Node 22.18+, 24.x or 26+ and npm workspaces. Each worktree needs its own install:
`npm ci`.

## Daily commands

```sh
npm run build          # tokens → styles (parity, token refs) → react → icons
npm run dev            # the desktop app in Electron, reloading on change
npm run preview        # the same, plus the app in a browser at http://localhost:4400
npm run typecheck      # every workspace
npm test               # token math, axes and the contrast gate
```

- **What `dev` and `preview` do.**
  - They bundle `apps/desktop/src/main.tsx` into `apps/desktop/dist`.
  - Starting either closes every other Area dev window, including another worktree's.
  - A renderer change reloads the window and the browser page.
  - A change under `apps/desktop/electron` restarts the window.
  - A change under `packages/<name>/src` rebuilds that package and the ones after it.
- **Browser only.** `npm run preview -w @area/desktop -- --no-electron` serves the browser
  without a window. Pass `PORT=4421` to use another port.
- **Icons are not watched.** After regenerating icons, run `npm run build -w @area/icons`.
- **`build` runs no tests.** Build before typechecking a fresh checkout: the app and tests
  read the compiled packages.
- **One full build at a time.** Don't run a full build against the running watcher, which
  may replace declarations mid-typecheck. Stop `dev` first and restart it after.

## Checks by change

| Change | Run |
|---|---|
| Any | `git diff --check`; look at the result in the app |
| Docs and skills only | Read every link you touched; nothing else |
| Documentation entries (`content/documentation/`) | `npm run check:docs -w @area/desktop` |
| App content, demos, tiles | `npm run build -w @area/desktop`, `npm run check:playgrounds -w @area/desktop`, `npm run typecheck` |
| App CSS (`apps/desktop/src/studio.css`, `src/styles/`) | `npm run check:app-css -w @area/desktop` (rule 13: no app rule restyles an Area component) |
| Component CSS, manifest, React | `npm run build` (parity and token refs run in the styles build), `npm run typecheck`, `node --test packages/react/tests/<family>.test.mjs` and `cohesion.test.mjs`, `npm run check:docs -w @area/desktop`, then the app |
| Tokens, colour, focus, state paint | `npm test` and `node packages/tokens/src/contrast/report.ts` (exits non-zero on a failure). Never lower a floor or add a waiver to pass |
| Package exports | `npm run test:consumer` after a build |
| Icons | The `area-icon-construction` skill's gate; `npm run test:icons` |
| App chat code | `npm run test:desktop` |
| Output (`packages/output`), or anything it reads (axes, component CSS, React sources) | `npm run test:output` (after a build), `npm run typecheck`; `npm run fidelity -w @area/output` after a change to the axes, base or component CSS (the written CSS must paint exactly what Area paints; `AREA_SYSTEM_FILE=<system.json>` adds a saved system) |

**Full sweep before a pull request:** `npm run build && npm run typecheck && npm test && npm run test:contracts && node --test packages/react/tests/*.test.mjs && npm run test:desktop && npm run check:playgrounds -w @area/desktop && npm run check:docs -w @area/desktop && npm run check:app-css -w @area/desktop`.

## Continuous integration

`.github/workflows/ci.yml` runs on every pull request and on `main` (Ubuntu, Node 24,
about ten minutes, most of it the icon build). It runs:

1. `npm ci`;
2. `build`, which lints every icon;
3. `typecheck`;
4. `npm test`;
5. `test:contracts`;
6. `test:icons`;
7. the React suites;
8. the desktop app's tests (`test:desktop`; since 2026-11-07);
9. the desktop build with `check:playgrounds`, `check:docs` and `check:app-css`;
10. `test:consumer`;
11. a check that the build left tracked files unchanged.

It skips the Electron binary and checks nothing in a browser. Preview, rendered contrast,
forced colours and a 1x display still need a session. `npm ci` refuses a lockfile that
disagrees with a workspace's `package.json`; run `npm install` and commit the lockfile.

## Verifying in the app

The app is the source of truth, so every visible change is judged there.

- **Run the app from the worktree you changed.**
  - Before starting, check who owns the port: `lsof -iTCP:4400 -sTCP:LISTEN`, and the
    process's working directory.
  - Another session's server may hold it. Then use `PORT=<free> npm run preview -w
    @area/desktop -- --no-electron`, or a static build: `npm run build -w @area/desktop`
    and serve `apps/desktop/dist` (the `desktop-dist` launch config, port 4410).
- **When the work is done, leave one window.**
  - Quit every Area Electron and relaunch it from the finished worktree, so the owner never
    judges a stale window.
  - A `dev.mjs` left running by an earlier session respawns its window, so stop it too.
- **Check light and dark at the app's scale**, then the extremes of every setting the
  change touches (Inspector › Theme).
- **A hidden browser pane stops painting.** Transitions don't advance, and focus and
  `requestAnimationFrame` don't run.
  - Read values with `transition: none` injected.
  - Or measure in headless Edge over the DevTools protocol: inject the capture script,
    set each tile's stage to `scale: 1`, and capture in the same task.
- **Capture script.** The app does not load `apps/docs/public/area-capture.js`, and its
  CSP (`script-src 'self'`) blocks `eval` and injected `<script>` tags. Pass the script's
  full text as the browser tool's JavaScript instead: that runs through DevTools, outside
  the page's CSP. Fetching it from the dev server returns the app's page, not the script.

## Icons

Area's icons have their own tools in `packages/icons/scripts`; the process is the
`area-icon-construction` skill.

```sh
npm run icons:find -- brain "paper plane"             # does Area have it already?
npm run icons:geometry                                # fillets, cuts, lobes, gaps (prints usage)
node packages/icons/scripts/generate.mjs --only a,b   # lint just these icons in a second
npm run icons:batch -- batch.json                     # record a batch everywhere it belongs
npm run icons:sheet -- compare out.png batch-43       # Area beside Fluent, outline and filled
npm run icons:pilot                                   # full lint (a few minutes) and generate
npm run icons:refs -- fetch                           # Lucide, Phosphor, Hugeicons metadata into .cache
npm run icons:keywords                                # rebuild sources/keywords.json (after a generate)
```

The old Fluent map (`apps/docs/scripts/gen-icons.mjs` and its outputs) still feeds the
archived docs and the Iconography demo. Keep its vendored inputs; never hand-edit generated
assets.

## Research captures

`apps/docs/public/area-capture.js` measures an element's layer tree: geometry, insets from
parent and shell, computed styles, text cap and baseline, SVG viewBox and ink,
pseudo-elements and readable declared rules. Captures go in
`docs/research/captures/<slug>/` and are compared with:

```sh
npm run capture:compare -- docs/research/captures/indicator/*.json
```

The workflow is in [Building a component](COMPONENT_ADAPTATION.md#capture-protocol).
Redaction is on by default off localhost, but read each capture before committing it:
committed captures must not contain personal content.

## Files to keep and not commit

- **Keep** the manifest, package tests, consumer fixture, lockfile, checks and build
  scripts. They enforce quality rather than describe a process.
- **Don't commit** `dist/`, `.cache/`, `node_modules/`, test output, logs, or captures that
  hold personal content. Research checkouts go in the ignored `.cache/sources/<system>@<sha>/`.

## The archived docs site

`apps/docs` is archived and is not a source of truth. Don't extend it or check work there.
Some of the system still runs through it until the move finishes ([Architecture › Loose
ends](ARCHITECTURE.md#loose-ends)):

- the capture script;
- the component review page generator (`apps/docs/scripts/component-review.mjs`);
- the Fluent icon map;
- `axis-preferences.test.mjs` in `test:contracts`;
- its own typecheck.

`npm run dev:docs`, `build:docs`, `audit` and `test:preview` still exist for that code.

## Release boundary

- **The packages are unpublished.** They are local ESM workspaces. Only `dist` is packed,
  public imports use compiled ESM, CSS is imported separately, and source paths are private.
- **What the consumer check covers.** It packs local tarballs, tests export targets and
  strict NodeNext types, renders without a DOM, and bundles browser JS and CSS. It does not
  test a registry install, React peer versions or RSC frameworks.
- **Still to verify before a release:**
  - native Windows forced colours;
  - assistive technology;
  - touch;
  - cross-engine behaviour;
  - the soft-border contrast shortfalls ([Contrast](CONTRAST.md)).
- **Completion is not certification.** It means the owner accepted a family, not that the
  library is accessible everywhere or ready to publish.

## Keeping documentation small

Where each fact lives is in [Governance › Where each fact lives](GOVERNANCE.md#7-where-each-fact-lives).

- Don't create a new plan, report or skill for routine component work.
- Update `.Codex/HANDOFF.md` after substantial work. Its "Current state" stays short, and
  history goes below it.
- A report or session summary never overrules the status registry or the owner's latest
  request.
