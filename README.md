# Area

A design system you tune along eight axes.

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
<html data-area-theme="dark" data-area-brand="teal" data-area-density="compact" data-area-radius="12">
```

| Axis | Attribute | Presets | Owns |
|---|---|---|---|
| Theme | `data-area-theme` | `light`, `dark` | which rung each semantic slot reads |
| Neutral | `data-area-neutral` | `neutral`, `cool`, `warm` | the grey the interface is built from |
| Brand | `data-area-brand` | 11 hues, default `indigo` | fills, links, focus ring |
| Typography | `data-area-type` | `geist`, `geist-compact`, `geist-large`, `system` | families and the size / leading / tracking ramp |
| Density | `data-area-density` | `compact`, `default` | control heights, gutters, icons, gaps |
| Radius | `data-area-radius` | `0`, `2`, `4`, `6`, `8`, `10`, `12`, `pill` | corner geometry |
| Surface | `data-area-surface` | `flat`, `outlined`, `raised`, `elevated` | stroke weight and elevation |
| Motion | `data-area-motion` | `none`, `subtle`, `expressive` | durations and easings |

Components consume only semantic tokens, so changing an axis reflows the whole system
without touching a single component. Because custom properties inherit, a subtree carries
its own values — `<aside data-area-density="compact">` gets shorter controls *and*
correctly re-derived corner radii, not just smaller boxes.

### Why axes rather than themes

Eight axes is roughly ten thousand combinations, which is not a thing anyone can test. It
is testable here because of one rule the build enforces: **no two axes may write the same
custom property.** Each axis owns a disjoint namespace, so eight independent checks replace
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
lightness. The exported lightness and chroma anchors stay fixed. `HUE_ROTATION` tunes hue, with
one narrow chroma adjustment at the light end (`CHROMA_TRIM`) where the palette's
per-family anchoring leaves families visibly uneven against each other. Never edit a hex.

**Semantics.** A numbered rung is never referenced from component CSS. `INVERSION` maps
slots to rungs once, per theme, and components read `--area-bg-surface`,
`--area-fg-muted`, `--area-brand-solid` and so on. Dark mode is the same ramp read from the
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
- **Contrast is a test gate.** 176 assertions across 66 shipped themes, under WCAG 2.2
  always and APCA as a hard gate in dark themes, because the WCAG 2.x formula overstates
  contrast near black. Four exceptions are waived — each measured, recorded with its
  number, and counted separately rather than folded into the pass count.
- **Axes cannot collide.** The registry throws if two axes write one property.
- **The CSS and the React API cannot drift.** Variant helpers and the parity audit use one manifest per component
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

- **`@area/tokens`** — the vendored palette, the eight axes, the emitters (CSS, JSON, a
  typed `.d.ts`, a browser fixture) and the contrast gate.
- **`@area/styles`** — component CSS. Framework-agnostic; works without React.
- **`@area/react`** — React components, generated variant props, no CSS.
- **`apps/docs`** — the site: 38 pages, every demo rendered from real components, and an
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

The dev command builds docs once and starts a static server. After editing sources, run
`npm run build:docs` and refresh the preview. `PORT=4322 npm run dev` uses a different port.
No environment secrets are needed. The docs use externally hosted Geist fonts.

- [AGENTS.md](AGENTS.md): orientation, commands and essential rules.
- [Architecture](docs/ARCHITECTURE.md): source boundaries and build flow.
- [Design system](docs/DESIGN_SYSTEM.md): detailed conventions and rationale.
- [Maintenance](docs/MAINTENANCE.md): checks, regeneration and known limitations.
- [Current handoff](.Codex/HANDOFF.md) and [journal](.Codex/JOURNAL.md): session state and decisions.
- [Migration report](docs/MIGRATION.md): cleanup evidence and validation.
- [Archived playground](archive/playground/README.md): old prototype and Figma utilities;
  these are separate from the current application.
