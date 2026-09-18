# Area

A design system you tune along seven axes.

```bash
npm ci
npm run build
npm run dev -w @area/docs     # http://localhost:4321
```

## What it is

Most design systems give you one look and a theme toggle. Area is built so that the look
itself is a set of **independent dimensions** — eight of them — each retuned with a single
data attribute, at any depth in the tree:

```html
<html data-area-theme="dark" data-area-accent="teal" data-area-ui="compact" data-area-radius="xl">
```

| Axis | Attribute | Presets | Owns |
|---|---|---|---|
| Theme | `data-area-theme` | `light`, `dark` | which rung each semantic slot reads |
| Neutral | `data-area-neutral` | `neutral`, `cool`, `warm` | the grey the interface is built from |
| Accent | `data-area-accent` | 11 hues, default `indigo` | fills, links, focus ring |
| UI scale | `data-area-ui` | `compact`, `default` | curated reading/UI type, control heights, gutters, icons, and gaps |
| Radius | `data-area-radius` | `0`, `2`, `4`, `6`, `8`, `10`, `12`, `pill` | corner geometry |
| Surface | `data-area-surface` | `flat`, `outlined`, `raised`, `elevated` | stroke weight and elevation |
| Motion | `data-area-motion` | `none`, `subtle`, `expressive` | durations and easings |

Components consume only semantic tokens, so changing an axis reflows the whole system
without touching a single component. Because custom properties inherit, a subtree carries
its own values — `<aside data-area-ui="compact">` gets the complete compact package and
correctly re-derived corner radii, not just smaller boxes.

### Why axes rather than themes

Seven axes is a substantial configuration space, which is not a thing anyone can test. It
is testable here because of one rule the build enforces: **no two axes may write the same
custom property.** Each axis owns a disjoint namespace, so seven independent checks replace
the cross-product. Where two axes genuinely interact — a corner radius has to be capped
against the control height it lands on — the dependent axis emits a *unitless multiplier*
and the relationship is written once, in `calc()`, rather than in either axis.

## How it fits together

```
packages/tokens    the palette, the axes, the token emitter, the contrast gate
       │           → CSS custom properties + tokens.json + a typed .d.ts
       ▼
packages/styles    component CSS, one file per component, framework-free
       │           ← both sides generated from src/manifest.ts
       ▼
packages/react     React components. Contains no CSS, by construction.
       │
       ▼
apps/docs          the site, built from the system it documents
```

**Colour.** `packages/tokens/src/color/palette.json` is the Area palette vendored
verbatim — 14 families × 23 rungs, each rung anchored to a contrast wall rather than to a
lightness. The exported lightness and chroma anchors stay fixed. `HUE_ROTATION` tunes hue;
`CHROMA_TRIM` evens the light end, while the gamut-bounded `DARK_CHROMA_LIFT` takes only
available readable/dark-end headroom without changing lightness or hue. Never edit a hex.

**Semantics.** A numbered rung is never referenced from component CSS. `INVERSION` maps
slots to rungs once, per theme, and components read `--area-bg-surface`,
`--area-fg-muted`, `--area-accent-solid` and so on. Dark mode is the same ramp read from the
other end — `--area-blue-500` is byte-identical in both themes; only the rung each slot
reads changes.

**Components.** A variant sets local `--_*` properties and the base rule is the only place
that consumes them, so a variant is three lines and a new tone is a copy-paste. State lives
on `data-*` attributes, not classes, so the CSS works with plain HTML and with headless
primitives unchanged.

## Guarantees

These guarantees are covered by tests, build audits, and the review conventions in
[AGENTS.md](AGENTS.md). Run the full verification sequence below; the build alone does not run tests.

- **The colour maths is proven, not assumed.** OKLab conversions are checked against
  `colorjs.io` to 1e-12 per channel across both gamuts, and the gamut mapper matches the
  CSS Color 4 reference to a fifth of a JND.
- **Contrast is a test gate.** 308 passing WCAG/APCA groups across 66 color themes,
  with no active token waivers. V01 defaults to soft control edges with documented non-text
  contrast shortfalls; the increased-contrast preference passes the rendered indicator matrix.
  Token passes do not certify the default soft appearance. Native forced-colors and full release
  accessibility checks remain pending. See [the contrast contract](docs/CONTRAST.md).
- **Axes cannot collide.** The registry throws if two axes write one property.
- **CSS variants are checked against a shared manifest.** Variant helpers and the parity audit use one manifest per component
  (36 of them), checked in both directions: a declared variant with no selector fails, and
  so does a selector no manifest declares.
- **A size tier means the same thing everywhere.** `--sm` is 28px on a button, an input, a
  select, a slider, a chip and a segmented control alike.
- **The documentation cannot lie.** Every preview is the real component rendered with
  `react-dom/server`; every snippet is that demo's own source text.
- **The documentation is built from the system.** An audit fails the build on a raw length,
  colour or font size in the docs stylesheet, on a docs rule that silently loses to the
  component layer, and on an inline style carrying a literal.

## Packages

- **`@area/tokens`** — the vendored palette, the seven axes, the emitters (CSS, JSON, a
  typed `.d.ts`, a browser fixture) and the contrast gate.
- **`@area/styles`** — component CSS. Framework-agnostic; works without React.
- **`@area/react`** — React components, generated variant props, no CSS.
- **`apps/docs`** — the site: 41 pages, every demo rendered from real components, and an
  icon browser over 1,739 marks.

## Verifying

```bash
npm test -w @area/tokens          # colour maths, gamut mapper, scales, contrast gate
npm run build                     # axis integrity, tokens, styles, manifest parity
npm run build:docs                # pages, dogfood audit
npm run typecheck
npm run dev -w @area/docs         # http://localhost:4321

node packages/tokens/src/color/preview.ts light   # ANSI swatches, for tuning curves
node packages/tokens/src/contrast/report.ts       # gate failures grouped by assertion
```

`packages/tokens/dist/fixture/axes.html` exposes `window.areaSweep()`, which flips every
preset of every axis and returns the computed values — that is how axis orthogonality is
checked in a real browser rather than asserted.

## Development and project knowledge

Use Node 22.18+ on the 22.x line, 24.x, or 26+ (see `package.json`). The scripts execute
TypeScript directly in Node; Node 20 is not supported by this workflow or installed Vitest.
Dependencies are locked by `package-lock.json`; use `npm ci` for a fresh checkout.

The dev command watches token, style, React and docs sources, rebuilds the packages and
validates the docs, then reloads the browser. Failed builds keep the last successful
preview available; errors appear in the terminal. `PORT=4322 npm run dev` uses another
loopback port. Restart the command after changing the watcher/server itself.

The [System lab](http://localhost:4321/lab.html) compares real, hydrated components in six
representative profiles. Select **Run browser checks** for individual regression results.
See [E01 baseline and visual comparison](docs/batches/E01/README.md) for current failures,
keyboard reproductions, screenshots and limits. `npm run test:preview` tests the rebuild
queue/server; `npm run test:consumer` checks packed exports and raw Node imports, and
currently exits nonzero for known package defects. Neither command replaces `npm test`.
No environment secrets are needed. The docs use externally hosted Geist fonts.

- [AGENTS.md](AGENTS.md): orientation, commands and essential rules.
- [Architecture](docs/ARCHITECTURE.md): source boundaries and build flow.
- [Design system](docs/DESIGN_SYSTEM.md): detailed conventions and rationale.
- [Maintenance](docs/MAINTENANCE.md): checks, regeneration and known limitations.
- [Current handoff](.Codex/HANDOFF.md) and [journal](.Codex/JOURNAL.md): session state and decisions.
- [Migration report](docs/MIGRATION.md): cleanup evidence and validation.
- [Archived playground](archive/playground/README.md): old prototype and Figma utilities;
  these are separate from the current application.

## Current audit and completion plan

The [system audit](docs/SYSTEM_AUDIT.md) records measured gaps, axis priorities, customization
options and research. The [roadmap](docs/ROADMAP.md) defines a first release and its acceptance
checks. The current stroke trial is intentionally recorded as a red test state; do not
interpret a successful build as release readiness.

The [implementation plan](docs/IMPLEMENTATION_PLAN.md) is the detailed execution order, with
12 work packages, design directions, migration rules and verification gates.

### Theme boundaries

Nested CSS selections and the React `Theme` / `useTheme` API follow the
[scope contract](docs/THEMING.md). Generated, DOM-free configuration helpers are available
at `@area/tokens/config`. See [E02 results and matched visuals](docs/batches/E02/README.md)
and the [live theme-boundary lab](http://localhost:4321/scopes.html).

E03 adds [the stroke and contrast report](docs/batches/E03/README.md) and a
[live control comparison](http://localhost:4321/contrast.html).

## Public packages

Area ships compiled ESM and declarations. Import CSS separately. See the
[API migration and consumer guide](docs/API_MIGRATION.md) for entry points, renamed tokens,
saved-settings migration, build requirements and verification limits.

`npm run test:contracts` checks selector ownership and preference migration. After building,
`npm run test:consumer` verifies actual local tarballs, strict types, SSR, browser bundling
and CSS/tree-shaking in isolation.


### Quiet visual direction

[V01 research, decisions and before/after captures](docs/batches/V01/README.md) document the
soft presentation. Open [the compact workspace](http://localhost:4321/workbench.html) to try
filters, card/list views, themes, density and the increased-contrast preference.

[V02 visual refinements and gallery](docs/batches/V02/README.md) soften tonal outlines and all
shadow tiers, with the palette preserved. Open the [component gallery](http://localhost:4321/gallery.html)
for 32 alphabetical component families, useful variants and dedicated documentation links.

[V03 native control refinements](docs/batches/V03/README.md) add a 32×20px default Switch,
fixed selected/unselected Checkbox and Radio geometry, Primer-style keyboard chords, shared
neutral focus treatment for editable fields and a two-point shadow-opacity correction. The
palette and V02 shadow geometry remain unchanged.

[V04 optical insets and first-line alignment](docs/batches/V04/README.md) standardizes
text, icon, swatch and nested-backplate placement. Multiline icons align with the first
text line, and named control tiers share icon/text/gap sizes. Open the
[inset specimen](http://localhost:4321/inset.html) to compare before/after and run geometry checks.
