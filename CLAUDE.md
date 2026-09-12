# Area — working conventions

Area is a design system tuned along eight axes. Read this before changing anything in
`packages/`.

## The invariants

These are not preferences. Each one is enforced by a check that fails the build, and each
was arrived at by a specific failure — breaking one silently reintroduces that failure.

**Axes own disjoint custom-property namespaces.** No two axes may write the same property.
`packages/tokens/src/axes/registry.ts` throws otherwise. This is the only reason eight axes
are testable: it reduces ~10,000 combinations to eight independent checks. Where axes
genuinely interact — radius depends on control height — the dependent axis emits a unitless
multiplier and the relationship is written once, in `calc()`, in `emit/base.ts`.

**Derived tokens are never `@property`-registered.** A registered `<length>` computes at its
declaration site, so `--area-radius-control` would freeze at `:root`'s value and stop
responding to a nested `data-area-density`. The height changes, the radius does not, and
nothing in the source looks wrong. Register leaf tokens only.

**Derived tokens are re-emitted on every axis-bearing element.** A custom property is
substituted where it is declared and then inherits already-resolved, so a derivation on
`:root` bakes in `:root`'s inputs. The `[data-area-density], [data-area-radius], ...`
selector block in `emit/css.ts` is what makes subtree scoping correct.

**Every number in component CSS traces to a token.** A literal pixel value is a bug unless
it is a hairline (`1px`) or a mask geometry. If a value is not on a ramp, derive it with
`calc()` from values that are — or change the ramp.

**Contrast is a build gate.** `packages/tokens/src/contrast/` asserts every pairing a
component can render, across all 72 shipped themes, under WCAG 2.2 always and APCA as a
hard gate in dark themes. To change a colour, change the curve in `color/curves.ts` and let
the gate tell you what broke; `contrast/report.ts` groups failures by assertion.

**The CSS and the React API cannot drift.** Both derive from `packages/styles/src/manifest.ts`.
`check-manifest-parity.mjs` fails if a declared variant has no selector, or a selector
exists that was never declared. Add the manifest entry in the same commit as the CSS.

**Documentation cannot lie.** Every docs preview is the real component rendered with
`react-dom/server`; every snippet is that demo's own source text. Never hand-write a code
sample.

**The documentation is built from the system.** `apps/docs/scripts/check-dogfood.mjs`
fails the build on a raw length, colour or font size in the docs stylesheet, and on any
inline style carrying a literal beyond a demo's own framing width. Five site-layout values
are allowlisted by name, each with a stated reason. If the docs need something the system
does not have, add it to the system.

**Docs CSS must never target an `.area-*` class.** `DOCS_CSS` lives in `area.base`, which
the cascade resolves *before* `area.components` — so such a rule silently does nothing.
The audit catches it. The fix is always a documented variant on the component
(`--inline`, `--flush`, `--wrap`), never an override.

## Component CSS shape

Follow `packages/styles/src/components/button.css`. Three rules:

- A variant sets local `--_*` properties. The base rule is the only place that consumes
  them, so a variant is three lines and a new tone is a copy-paste.
- A size tier sets nothing but tier tokens, all of which come from the density axis. No
  size block should ever contain a pixel value.
- Foreground does not change on hover — only background and border. A label that shifts
  colour under the cursor reads as a different control, and it makes contrast
  unverifiable, because the pair being measured stops being the pair being rendered.

State goes on `data-*` attributes, not classes, so the CSS works with plain HTML and with
headless primitives unchanged.

## Type

Weight is orthogonal to role. A role sets size, leading and tracking; it never sets
weight. That is what makes large text at a regular weight possible — a 20px paragraph
rather than a 20px heading — which a ramp with weight baked into the role cannot express.

Two weights only: regular 400, strong 550 (600 on the system preset, whose platform fonts
ship discrete weights). Material's `emphasized` scale is the same idea with a second full
ramp instead of one token; it is a uniform one-step increase on the variable weight axis,
400→500 for large roles and 500→600 for small. 550 sits between those, which only works
because Geist is variable.

Names are relative (xs..xl), unlike spacing and radius, because the type axis rescales the
whole ramp — `--area-text-14` would become a lie the moment someone picked the compact
preset. Spacing does not rescale, so there the pixel value is the honest name.

## Tones

Nine, following OpenAI's vocabulary: primary, secondary, accent, info, success, warning,
caution, danger, discovery. `primary` and `secondary` are neutral rather than brand — a
near-black button is the strongest call to action a neutral palette can make, and it stays
strongest whatever the accent axis is set to.

A tone repoints nine slots; a variant decides which it reads. Nine tones and four variants
is thirteen CSS blocks, not thirty-six, and adding a tone costs one block. Never write a
`.area-button--{tone}.area-button--{variant}` pair.

Three warm roles is more than hue separation alone can carry — danger to warning is 30
degrees, short of the 50 that keeps two tones from reading as one signal. They stay
distinguishable on lightness instead (orange L 0.77, yellow L 0.91). That is the cost of
eight tones and it is recorded in `color/presets.ts` rather than left to be rediscovered.

## Documentation sections

Every foundation section is built with `tokenSection()` in `apps/docs/scripts/layout.mjs`:
a heading, one sentence, and a table/grid pair generated from **one** list of rows. The
table is how you read values and compare a column; the grid is how you judge a scale by
eye and gives each entry room to show the thing itself. Because both views read the same
row objects, they cannot describe different data.

The segmented control sits at the left, above the content. Token names render as
`.area-token` chips, with a swatch where the token resolves to a colour.

Do not hand-write a `<table>` in the docs. Use `tokenSection()`, or `table()` for a
one-off that has no useful grid form.

## Reference style

Tables, code containers and segmented controls carry the original playground's visual
language deliberately: a fully ruled grid in a clipped rounded container; a code block
with a toolbar above it on a surface one step quieter than the page; a segmented track
whose radius is `inner + inset` with an inset ring rather than a border. The shapes are
the original's, the density and tokens are the current system's.

## Concentric corners

An inner radius is its container's radius less the container's padding. Applied per
component, because the inset differs per component — a menu pads 6px, a card pads 16px, so
no single shared token is correct. This is why a menu item is 6px inside a 12px panel,
which is where OpenAI (12 − 6) and Notion (10 − 4) both independently land.

## Verifying

```
npm test -w @area/tokens          # colour maths, gamut mapper, scales, contrast gate
npm run build                     # axis integrity, tokens, styles, parity
npm run lint:manifest -w @area/styles
npm run dev -w @area/docs         # docs at http://localhost:4321
node packages/tokens/src/color/preview.ts light   # ANSI swatches, for tuning curves
node packages/tokens/src/contrast/report.ts       # gate failures grouped by assertion
```

`packages/tokens/dist/fixture/axes.html` exposes `window.areaSweep()`, which flips every
preset of every axis and returns the computed values. That is how axis orthogonality is
checked in a real browser.

## What is not here

The previous system (`index.html`, `figma-sync.js`) is superseded. Its design rationale is
preserved in git at commit `c35ac15`. Figma sync was dropped deliberately.
