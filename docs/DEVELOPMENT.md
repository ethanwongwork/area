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
| Tokens, colour, focus, state paint | `npm test` (includes the cross-setting sweeps in `packages/tokens/src/sweeps/`) and `node packages/tokens/src/contrast/report.ts` (exits non-zero on a failure). Never lower a floor or add a waiver to pass |
| Package exports | `npm run test:consumer` after a build |
| Icons | The `area-icon-construction` skill's gate; `npm run test:icons` |
| App chat code | `npm run test:desktop` |
| Output (`packages/output`), or anything it reads (axes, component CSS, React sources) | `npm run test:output` (after a build), `npm run typecheck`; `npm run fidelity -w @area/output` after a change to the axes, base or component CSS (the written CSS must paint exactly what Area paints; `AREA_SYSTEM_FILE=<system.json>` adds a saved system) |

Behaviour (keys, focus, pointer, typeahead, forms, modals, hit targets): build, then `npm run test:behaviour` (or `-- menu|list|forms|modal|hit`). Suites drive real components in headless Edge with real input; `gap("<plan item>", …)` marks a known gap and fails once it is fixed: unmark it in the same change. See tests/behaviour/README.md.

Rendered lengths, corners, marks, header bars, the dark floating edge and the gallery's tiles: build the app, then `npm run check:rendered` (see Rendered checks below).

**Full sweep before a pull request:** `npm run build && npm run typecheck && npm test && npm run test:contracts && node --test packages/react/tests/*.test.mjs && npm run test:desktop && npm run check:playgrounds -w @area/desktop && npm run check:docs -w @area/desktop && npm run check:app-css -w @area/desktop`.

## Continuous integration

`.github/workflows/ci.yml` runs on every pull request and on `main` (Ubuntu, Node 24) as two jobs side by side, and the browser and output jobs below.
**Cross-setting sweeps** (`packages/tokens/src/sweeps/`, part of `npm test`, about 25 s). `colour.test.ts` crosses
mode × neutral × four accents × Accent strength × Status colours × Tone contrast × Tone tint × ground and Layers (the
default and the extremes), 5,400 combinations. It checks every declared pairing at its floor (APCA in dark), tone
strokes and hue icons on every ground, state plates apart by the Layers gate's hover step, and stroke groups against
1.2. `geometry.test.ts` crosses Type × Density × Corner × Stroke width × Focus ring × Selected stroke × Contrast,
36,450 combinations. Today's misses are listed in `known-failures.ts`, each with its finding in
`docs/research/system-status-2026-11-18/README.md`, as a defect or a decision. A new failure fails the run, and so
does a listed one that no longer fails: delete its entry in the change that fixes it. Never widen an entry or lower a
floor to pass. `SWEEP_REPORT=1 npx vitest run src/sweeps` (in `packages/tokens`) prints each entry as measured.

**Token, axis and contrast tests** (`npm ci`, then `npm test`; about 20 minutes, since its sweeps cover every
setting position; its own job since 2026-11-15, when it outgrew the shared 30-minute limit). **checks** (about
fifteen minutes, most of it the build) runs:

1. `npm ci`;
2. `build`, which lints every icon;
3. `typecheck`;
4. `test:contracts`;
5. `test:icons`;
6. the React suites;
7. the desktop app's tests (`test:desktop`; since 2026-11-07);
8. the desktop build with `check:playgrounds`, `check:docs` and `check:app-css`;
9. `test:consumer`;
10. a check that the build left tracked files unchanged.

Four more jobs run when CSS, tokens, React, icons, the app, the checks or the lockfile change
(a `changes` job reads the pull request's paths; on `main` and a manual run they always run):
**behaviour** (`npm run build`, then `test:behaviour` in headless Edge), **rendered**
(`check:rendered` at the defaults, every family), **rendered-corners** (the corners' fast subset)
and **output** (`test:output`, then `area init`, `area build` and `area check` on the starter
system: a file that keeps to the system passes, one with a literal colour fails; the repository
holds no system the app saved). They install Microsoft Edge (stable) and skip the Electron
binary. Preview, rendered contrast, forced colours and a 1x display still need a session. `npm ci` refuses a lockfile that
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

## Rendered checks

`npm run check:rendered` renders the Components Overview from the built app
(`apps/desktop/dist`) at the shipped defaults, light and dark, measures every tile, and
asserts the rule tables in `scripts/rendered/rules/*.mjs` (plan F1,
`docs/research/system-evaluation-2026-11-11/`). Lengths come from the DOM in CSS px;
only the dark floating edge reads pixels. It never gates on picture diffs.

- **When.** After a change to component CSS, tokens or settings that moves a rendered
  length, a corner, a mark, a header bar or a dark edge, and after gallery or demo
  changes; before a pull request that touches any of them. Build the app first
  (`npm run build -w @area/desktop`, in the build lock when sessions share a tree).
- **How long.** About 5 minutes for the capture on an idle machine, 14 with other browsers and builds running (125 families, both themes side by side),
  then seconds for the rules. `-- --reuse` re-checks the last capture without a browser.
- **What it opens.** Its own static server on a free port over a copy of `dist`, and a
  headless Edge (or Chrome; `AREA_RENDERED_BROWSER` names another) per theme, in fresh
  profiles that are deleted afterwards. It never touches an open Area window. Output goes
  to `.cache/rendered/` (ignored by git); PNGs never go in the repository.
- **True scale.** Everything is measured at zoom 100% with every tile's stage at `scale:
  1`. The gallery shrinks a specimen wider than a whole row to fit its card, so a family
  with a shrunk stage is measured in a wider window, widened until every stage is at 1.
  A capture fails, naming the tile, if any measured stage is at another scale.
- **Two kinds of rule.** An assert rule (cap centring, extent, visible at rest, tile
  names, wrap tiles) fails on a violation that `scripts/rendered/known-failures.json` does
  not list, and on a listed one that no longer fails. Each entry names the plan item that
  will fix it. When a fix lands, delete its lines or run `-- --reuse --prune-known`. A
  snapshot rule (header bars, marks, corners, dark floating edge) fails when any recorded
  value changes.
- **Updating a snapshot deliberately.** Only when the change is the intended one: run
  `npm run check:rendered -- --reuse --update <rule id>` (for example `marks`), review
  the diff of `scripts/rendered/snapshots/<rule id>.json`, and say why in the commit.
  Never update a snapshot or a known failure to make an unintended change pass.
- **Other settings.** `npm run check:rendered -- --set type=16 --set density=36` (repeatable;
  ids and values are the registry's, `packages/tokens` config, so build first). An unknown
  setting or value fails before a browser opens, and a value the page did not apply (no
  element carries `data-area-<axis>` with it) fails after it opens: the app drops values it
  doesn't know without a word. `-- --corner <id>` runs a named corner of
  `scripts/rendered/corners.json`; `-- --families a,b,c` or `-- --fast` (the corners file's
  subset: overlays, marks, rows, controls) captures only those families. At any settings
  other than the defaults the snapshot rules (header bars, marks, corners) are skipped with
  a note, since a setting is meant to move them, and the assert rules (cap centring, dark
  floating edge, tile names, wrap tiles, extent, visible at rest), which are invariants,
  run against that corner's baseline, `scripts/rendered/known-failures/<corner id>.json`
  (an unnamed set of settings gets an id from its pairs). The defaults keep
  `known-failures.json` and `snapshots/`. Record a corner's baseline with `-- --corner <id>
  --reuse --seed-known` only after reading every violation, and give each entry a note:
  a component defect (with the plan item) or a rule still to be scaled. On a family subset
  only those families' known failures and per-family snapshot values are compared (marks,
  one table across families, is skipped).
- **Tolerances that follow the settings.** Cap centring skips a box taller than the large
  control (more than one line of controls by design); that limit is the page's own
  `var(--area-control-lg)` where the specimens are drawn plus 2 px (40 at type 13 /
  density 32, 50 at type 16 / density 36), read per family by `measure-page.js` (`scale`).
  The 0.1 px centring tolerance itself is fixed (an open owner question). No other rule's
  constant depends on type or density: the edge zone (2 CSS px), the extent tolerance
  (0.5 px) and the text rules are not lengths of a control.
- **The corners.** `npm run check:rendered:corners` runs every corner one after another,
  light and dark: defaults; type 12 + density 28 + radius 0; type 16 + density 36 + pill;
  surface 2 + stroke 8 + bold focus ring + selected stroke 3; surface 0 + stroke 0 +
  elevation 0; the grounds (light 90 with flat layers, dark 24 with layers 100); accent
  yellow at 30% on buttons and selection; tone contrast 2.5 + tone tint 160. Every family
  is about 5 minutes a corner on an idle machine, so about 40 minutes for all.
  `npm run check:rendered:corners:fast` (or `-- --fast`) runs the subset, about a minute a
  corner (100–160 s measured with other work running; 14.7 min for all eight on
  2026-11-19), for routine use; `-- --only a,b`, `-- --skip defaults`. The corner
  baselines were first recorded from the fast subset, so a full corner run reports the
  other families' violations as new until they are read and recorded.
- **One capture at a time.** Captures side by side starve the machine (families went from
  6–15 s to 100–200 s each on 2026-11-18), so a capture takes a lock
  (`.cache/rendered/capture.lock`) and a second one fails at once, naming the first. Don't
  run a capture beside the token suite or another session's browsers either; run long
  ones in the background with a log, and say how long they will take first.
- **One family for a review page.** `npm run capture:rendered -- <slug> …` writes
  `.cache/rendered/capture/<slug>/light.png`, `dark.png` and the measures (`--theme dark`,
  `--no-png`, `--set type=12 --set density=28` for Compact). Families whose tiles are cut
  by their cards are laid out one card per row, or in a wider window. Then
  `node scripts/rendered/merge.mjs` writes `measure.json` and `index.json`,
  `node scripts/rendered/open.mjs <slug>[/<tile>]` captures overlays open, and
  `node scripts/rendered/sheets.mjs` writes contact sheets.
- **In CI** (since 2026-11-19, untested on the runner when written): the `rendered` job runs
  `check:rendered` at the defaults over every family, and `rendered-corners` runs
  `check:rendered:corners -- --fast --skip defaults`, each after the packages and desktop
  build, with Microsoft Edge installed from its stable channel (`AREA_RENDERED_BROWSER`).
  Headless Chromium on Linux may differ from macOS Edge by a subpixel in text
  rasterisation, which is why the tolerances are in CSS px from the DOM; a baseline that
  differs only on the runner is a finding about the runner, not a reason to widen a rule.
- **Edge only as a guest.** Every launcher (`scripts/rendered/cdp-lib.mjs`,
  `tests/behaviour/harness.mjs`) starts Edge with `--guest --disable-features=msImplicitSignin`
  in a fresh profile; without them Edge signs the profile into the owner's account.
  `cdp-lib.mjs` refuses to launch without them. Anything new that starts Edge does the same.

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
