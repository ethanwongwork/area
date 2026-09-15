# Architecture

Area lets consumers tune theme, neutral, brand, typography, density, radius, surface,
and motion using inherited `data-area-*` attributes. The documentation site is both
the component catalog and a consumer of the same system.

## Build flow

1. `packages/tokens/src/build.ts` checks axis integrity and emits CSS, JSON, declarations,
   DOM-free configuration JavaScript/types, and a self-contained browser fixture into `packages/tokens/dist/`.
2. `packages/styles/scripts/build.mjs` follows CSS imports, respecting package exports,
   and bundles them into `packages/styles/dist/area.css`. The parity script checks
   component selectors against `src/manifest.ts`.
3. `packages/react` exports TypeScript source. Its build is intentionally a no-op;
   consumers need a TS/TSX-capable bundler. Variant helpers read the styles manifest.
4. `apps/docs/scripts/render.mjs` bundles the demo registry with esbuild and renders it
   with React's server renderer. Snippets are extracted from the same demo files.
5. `apps/docs/scripts/build.mjs` combines demos, page metadata, token JSON and the shared
   layout into static HTML, then copies CSS and assets to `apps/docs/dist/`.
   `check-dogfood.mjs` audits the rendered site and stylesheet.

`npm run build` covers steps 1–3. `npm run build:docs` covers all five. `npm test`
separately runs Vitest, including contrast assertions and waiver expiration checks.
There is no checked-in CI workflow or automatic publish gate.

## Source boundaries

- **Palette and semantics:** `color/palette.json` is the vendored input;
  `color/scale.ts` measures solid fills, foregrounds and strokes. `color/curves.ts`
  holds hue/trim adjustments and semantic inversion. `semantic/resolve.ts` resolves
  themes and defines the shipped test matrix.
- **Axis composition:** `axes/registry.ts` owns registration and collision checks.
  `emit/base.ts` owns primitives and geometric derivations. `emit/colors.ts` pairs light/dark
  colors; `emit/css.ts` emits them without crossing axis ownership. `color-scheme` selects
  polarity at consumption. Both polarity maps and transformed maps are validated.
- **Scope configuration:** `emit/config.ts` generates `@area/tokens/config` from the registry.
  React `Theme` / `useTheme` merge contextual selections and recreate attributes at portals.
  They do not infer host DOM attributes; see [THEMING.md](THEMING.md).
- **Components:** CSS lives only in styles. React wrappers supply markup, native
  attributes and composition. The manifest is a variant contract, not a code generator
  for every wrapper or stylesheet.
- **Docs:** `src/pages.mjs` and `src/practices.mjs` describe component pages;
  `src/registry.tsx` registers demos. `scripts/layout.mjs` contains styles and delegated
  browser handlers. Inspector controls declare `data-axis` and `data-value` so one
  handler can synchronize the persistent rail and customizer.
- **Icons:** `gen-icons.mjs` reads Fluent's installed SVG package plus both Area
  directories. Generated TSX, markup helpers, catalog and sprites are checked in
  because the docs build consumes them directly. They are not disposable clutter.

## Runtime

The docs are static HTML with browser-side interaction and local storage for preferences.
`serve.mjs` serves only `apps/docs/dist/` on port 4321 (`PORT` overrides it).
The development server watches sources and builds into a disposable docs cache directory.
After the build and dogfood audit pass, it reads an immutable snapshot and swaps the live
preview in one operation. Failed builds preserve the prior snapshot. A development-only
revision endpoint reloads open pages after successful publication. The static server reads
the built `dist` once; restart that server after rebuilding.

`apps/docs/src/lab/` supplies the System lab: server-rendered Area components hydrated from
the same React tree, six representative profiles, and in-page regression assertions. It
has no separate component styling overrides. Its layout CSS joins the dogfood audit.
The theme-boundary page adds a pure-resolver oracle for CSS inheritance, native scheme,
shadow and React portal checks. The full site builds 40 pages and 65 catalog demos.
There is no application backend, database, required secret, or environment template.
Geist fonts load from a pinned jsDelivr URL; the system font preset remains available.

## Historical material

The root-level prototype was superseded when the workspace system was introduced.
[Archive guide](../archive/playground/README.md) explains its files.
Do not mix its `ds-*` classes, palette, DM fonts or `.is-*` state conventions into Area.
Detailed current design rules are in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

## Audit boundary

The [system audit](SYSTEM_AUDIT.md) distinguishes intended architecture from verified
behavior. E02 repaired independently nested colors and light resets, with Chromium and
Safari evidence; Gecko validation remains pending. Namespace checks alone do not prove
DOM scope correctness.
React wrappers include presentation-only composite widgets and handwritten prop unions.
[ROADMAP.md](ROADMAP.md) defines the completion checks for those boundaries.
