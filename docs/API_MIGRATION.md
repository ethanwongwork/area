# E04 public API migration

Area 0.0.0 is an unpublished workspace. The known consumers searched before this migration
are the docs generator, React demos, browser lab, token tests and packed-consumer fixture.
No external consumer was found in this checkout; external repositories are not audited.
Historical batch reports and research preserve the vocabulary used when they were written.

## Naming

- `brand` → `accent`: axis selection, `data-area-accent`, tone, semantic token names,
  resolver input and generated configuration. For example, `--area-brand-solid` becomes
  `--area-accent-solid` and `--area-fg-brand` becomes `--area-fg-accent`.
- `primary` tone → `neutral`; emphasis remains `solid`, `soft`, `outline` or `ghost`.
- `--area-bg-primary-solid` → `--area-neutral-solid`, its hover token follows the same
  pattern, and `--area-fg-on-primary` → `--area-fg-on-neutral`. Values are unchanged.
- The docs migrate saved `area-docs-axes.brand` to `accent` once, preserving other valid
  selections. An existing `accent` selection takes precedence. Retired API aliases are
  removed; invalid new API selections produce errors rather than silently falling back.

Package exports and exact component contract changes are recorded below when verified.

## Component contracts

- Select and Slider expose all five existing CSS tiers (`xs` through `xl`); Chip gains `lg`
  and `xl`; Panel gains `xs`. Checkbox/Radio remain `sm`–`lg`; Switch remains `xs`–`lg`.
  Prop unions index literal manifest data rather than maintaining another size list.
- Nav accepts `tone="accent"` and now emits the matching CSS class. Its unmodified defaults
  remain vertical and neutral. The old implementation emitted an accent class while CSS
  expected the retired name, leaving its colored current-item variant ineffective.
- Menu exposes its existing `layout="inline"` and `selection="marker"` CSS variants.
- CodeBlock removes the unsupported `title` toolbar prop and the nonexistent toolbar/title
  classes. Use a surrounding caption or labelled region for a name. `actions` uses the existing
  top-right action slot; `layout` exposes `flush` and `wrap`.
- Helper boolean keys are camelCase (`fullWidth`, `bareBar`, `swatchOnly`). Retired kebab-case
  helper inputs and unknown options/values throw. Raw CSS modifier classes stay kebab-case.
- `createVariants().element()` and `stateAttributes()` reject unknown names. The state
  adapter emits native `disabled` for Select, Textarea and Segmented items, and `aria-invalid`
  for Select. Apply it to the state-bearing element. Native attributes remain essential for
  native behavior; a visual data flag alone does not disable a button or move keyboard focus.
- Select, Textarea, Checkbox, Radio and Switch live in `components/forms.tsx`; all retain
  root exports. This batch leaves composite behavior in place for E05–E07.

## Package entry points

- `@area/tokens` and `@area/tokens/config`: the same lightweight, DOM-free registry-derived
  configuration helpers and axis types. The root deliberately does not expose private
  palette/resolver/build internals. JSON and CSS subpaths remain available.
- `@area/tokens/types`: type-only `AreaToken`, preset unions and `AreaAxisAttributes`.
- `@area/styles` / `@area/styles/area.css`: bundled CSS, with no remaining CSS imports.
- `@area/styles/manifest`: compiled manifest JavaScript and declarations.
- `@area/react`: compiled components and helpers; `@area/react/variants`: React-free helpers;
  `@area/react/theme`: explicit Theme/useTheme entry point. CSS is always imported separately.

Only `dist` is packed. Source import paths are private. JavaScript and declarations use `.js`
relative references, so a consumer does not need to transpile TypeScript inside node_modules.
ESM is the supported distribution format; no dedicated CommonJS build is claimed.

React is a required peer. React DOM belongs to the rendering application and is not imported
by the current library runtime. Token color mathematics and stylesheet generation dependencies
are development dependencies, rather than unnecessary runtime installations.

`Theme.tsx` alone declares `use client`, and compilation preserves it. Other modules retain
server-compatible markup and do not access DOM globals at import/render time. Interactive
handlers still require an application client boundary. Node SSR and browser bundling are
verified; an actual RSC framework integration and the React 18 peer range remain release
matrix items. The current clean-consumer run uses installed React 19.

## Consumer troubleshooting and verification

Run `npm run build` before using a fresh checkout. Public workspace imports intentionally
resolve compiled output too; editing source requires a rebuild. `npm run dev` watches package,
site and shared build-script sources and rebuilds them in dependency order. Stop the watcher
before running a competing full package build; its own build queue is serialized.

Run `npm run test:consumer` after the build. It packs and extracts the three actual tarballs
into a temporary directory, copies installed peers/tools there, checks every concrete export
target, compiles positive/negative strict NodeNext fixtures, renders on the server with no DOM,
and bundles a browser entry plus CSS. No Area workspace links or registry download are used.
It also checks helper/component tree-shaking and the preserved Theme directive. This verifies
local distribution artifacts; it does not publish packages or test a registry installation.
