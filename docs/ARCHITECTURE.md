# Architecture

How Area is built in code, from a token to a tile in the app, and which files a component
touches. Commands and checks are in [Development](DEVELOPMENT.md); the rules the code
follows are in [Design system](DESIGN_SYSTEM.md).

```
packages/tokens  →  packages/styles  →  packages/react  →  apps/desktop
 settings, roles      framework-free CSS     components, behaviour    the app: gallery,
 and derivations      + the manifest         typed from the manifest  docs, Inspector
                                                         ↑
                      packages/icons  →  Glyph (generated into react)
```

Each package depends only on the ones to its left. CSS never depends on React, and React
contains no CSS. `apps/docs` is archived: the app no longer reads from it except for two
leftovers listed under [Loose ends](#loose-ends).

## Tokens (`packages/tokens`)

**Settings are axes.** Each axis (`src/axes/*.ts`) is a list of presets selected with
`data-area-<id>="<preset>"` on any element. Axes write only *leaf* tokens, usually a
single number: `--area-elevation: 3`, `--area-density-level: 0`, `--area-radius-factor`.
There are 30 axes in `src/axes/registry.ts`. Their meaning and values are documented in
[Theming](THEMING.md).

Two attributes look like axes but are not:

- `data-area-pills` (`axes/pills.ts`) is a set.
- `data-area-material*` (`axes/material.ts`) is a bundle of levers.

`data-area-contrast` (`standard` / `medium` / `more`) is an accessibility preference, and
`data-area-ui` is shorthand for type and density together.

**Derivations live in one place.** Anything that depends on more than one axis is a
`calc()` / `color-mix()` in `src/emit/base.ts`:

- control heights from type and density;
- corners from height and radius;
- the emphasis roles from neutral, accent and the action / selection switches;
- shadow roles from the depth levers;
- edges from the contrast level.

An axis never reaches into another axis's namespace.

**Integrity is enforced.** `assertAxisIntegrity` (`registry.ts`) fails the build when:

- two axes write the same property;
- presets set different keys;
- a token falls outside its axis's namespace;
- a value is empty or `NaN`.

**Colour.**

- `color/palette.json` is vendored and never edited.
- `color/curves.ts` holds the explicit adjustments and the light/dark `INVERSION`.
- `semantic/aliases.ts` maps each semantic role to a light/dark pair, emitted as
  `light-dark()`, so polarity resolves where the colour is used.
- `color/layers.ts` derives grounds, control fills, edges and inks live from the Layers
  settings.
- `color/brand.ts` builds a brand's families from exact colours (its own family, harmonised
  status families, the supporting palette); `semantic/brand.ts` resolves a brand theme
  (`resolveBrandTheme`) and the new roles (secondary, tertiary, `support-1`…`8`, brand
  surfaces). With no brand the theme is `resolveTheme`'s, token for token; brand families
  never enter `palette.json` (2026-10-26, docs/research/brand-palette-2026-10-26).
- `contrast/assertions.ts` is the gate: 243 pairings that `npm test` checks, with an empty
  exceptions list.

**Outputs** (`npm run build -w @area/tokens` → `dist/`):

| File | Holds |
|---|---|
| `css/properties.css` | `@property` registrations, for leaf tokens only. Derived tokens and colour pairs are never registered, or inheritance would freeze them. |
| `css/tokens.css` | Every default under `:where(:root)` in `@layer area.tokens` |
| `css/axes.css` | One rule per preset in `@layer area.axes`. Each derived token is re-stated on every element that carries an axis attribute feeding one of its inputs, because a custom property resolves where it is declared (`emit/rederive.ts`, since 2026-10-25: one rule per set of attributes, so an element restates a token at most once). A derived token that reads or is a token some stylesheet or inline style overrides (`OVERRIDABLE`) is re-stated at every axis attribute, as all were before. |
| `tokens.json`, `tokens.d.ts` | The token table and types (the app's Foundations › Color reads the JSON) |
| `config.js` | `AXIS_PRESETS`, `DEFAULT_AXES`, `mergeAxes`, `themeAttributes`, `DEPTH_LEVERS`, `MATERIAL_*`: DOM-free helpers the app's Inspector and React's `Theme` use |
| `brand.js`, `brand.d.ts` | `@area/tokens/brand` (2026-10-26): `brandDeclarations`, `brandCss`, `brandInfo`, bundled by esbuild from `src/brand-entry.ts` with the derivations a brand restates embedded as data (`emit/brand-derived.ts`), so it never loads the axes. The build prints its size: 205.7 kB minified, 29.8 kB gzipped |
| `cli.js` | The `area-tokens` command: `area-tokens brand --primary <hex> [--secondary] [--tertiary] [--status] [--selector] > brand.css` |

## Styles (`packages/styles`)

`src/index.css` declares the layer order once:
`area.reset, area.tokens, area.axes, area.base, area.components, area.utilities, area.overrides`.
Unlayered consumer CSS beats all of them. It imports the tokens' CSS, then these shared
files:

| File | Job |
|---|---|
| `reset.css`, `fonts.css`, `base.css` | Reset, Geist (pinned), body type, `::selection`, Glyph stroke widths, `data-area-switching` (no transitions while a setting changes), `.area-sr-only` |
| `layers.css` | Every component that paints a ground (raised, recessed or page) points the control-fill tokens at it, so a field on a Card fills from the Card and a button on a recessed head plates from the head; `cohesion.test.mjs` fails an undeclared ground |
| `inset.css` | The shared inset contract: `--_inset-start/end` from box height, border and cap height for Button, Input, Menu item, Badge and others |
| `material.css` | Material paints, active only under `[data-area-material]`. They fill `--_m-layers` and never replace a component's shadow. |
| `forced-colors.css` | System colours for required edges, selection and focus under `forced-colors: active` |

After those come the 99 component files in `src/components/`, all in
`@layer area.components`. Some files hold several blocks (`surface.css`: Card, Alert,
Dialog, Popover, Menu, Tooltip, Toast; `display.css`, `choice.css`, `color.css`,
`navigation.css`).

### The component CSS pattern

From `components/count.css`, the smallest complete example:

```css
@layer area.components {
  .area-count {
    /* 1. Private slots with defaults (the md tier, the plain variant). */
    --_count-height: var(--area-mark-label-md);
    --_count-ink: var(--area-fg-muted);
    --_count-plate: transparent;
    --_count-weight: var(--area-weight-regular);
    /* 2. One base rule consumes the slots: geometry, paint, type. */
    block-size: var(--_count-height);
    background: var(--_count-plate);
    color: var(--_count-ink);
    font-weight: var(--_count-weight);
    /* Shape: the radius setting's corner for this height, plus the pills flag. */
    border-radius: calc(max(var(--area-radius-min),
      round(down, calc(var(--_count-height) * var(--area-radius-factor)), 2px))
      + var(--_count-pill) * var(--area-radius-full));
  }
  /* 3. Modifiers only re-point slots. */
  .area-count--sm   { --_count-height: var(--area-mark-label-sm); }
  .area-count--soft { --_count-plate: var(--area-bg-mark); --_count-weight: var(--area-weight-strong); }
}
```

The rules:

- **Slots.** Private custom properties are `--_<component>-<slot>` or `--_<slot>`, and
  nothing outside the file reads them.
- **One base rule.** Only the base rule paints. Variant, tone and size modifiers re-point
  slots. Size rules set tier tokens only.
- **Literal measured values** carry `/* spec */` and cite the spec. Otherwise every
  `var(--area-*)` names a defined token or carries a fallback for a public hook.
- **States.**
  - Native or ARIA first (`:disabled`, `[aria-expanded="true"]`), then documented `data-*`
    hooks (`[data-selected]`, `[data-highlighted]`).
  - Pointer hover sits inside `@media (hover: hover)`.
  - Hover and press change the plate, edge or shadow, never `color`.
- **Logical properties** (`inline-size`, `padding-inline`) so direction follows the scope.

### The manifest

`src/manifest.ts` declares every block once; there are 138 blocks:

```ts
export const count = {
  block: "area-count",
  description: "Shows how many items the element it sits in holds, beside that element's label.",
  variants: { variant: ["plain", "soft"], size: ["sm", "md"] },
  booleans: ["pill", "rounded"],
  elements: ["label"],
  defaults: { variant: "plain", size: "md" },
} as const satisfies ComponentManifest;
```

Fields:

- `variants`: each value becomes `.block--value`;
- `booleans`: `.block--flag`;
- `elements`: `.block__part`;
- `elementModifiers`: modifiers on a part;
- `states`: each must have a component-scoped selector;
- `stateAttributes`: native or ARIA exceptions to `data-<state>`;
- `defaults`: what the base rule renders.

The styles build runs two checks:

- `scripts/check-manifest-parity.mjs` fails on any declared modifier, element or state
  without a selector, and on any `.block--*` or `.block__*` selector that is not declared.
- `scripts/check-token-refs.mjs` fails on any undefined `var(--area-*)`.

## React (`packages/react`)

`src/variants.ts` turns each manifest into a typed class builder:

```ts
export const countVariants = createVariants(manifests.count);
// countVariants({ variant: "soft", size: "sm" }, className)
//   → "area-count area-count--soft area-count--sm <className>"
```

It throws on an unknown option or value, so a typo fails loudly. `VariantProps<typeof
MANIFESTS.count>` types the props from the same object.

A component file (`src/components/Count.tsx`):

```tsx
export interface CountProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The number shown. */          count: number;
  variant?: CountVariants["variant"]; size?: CountVariants["size"];
  /** Unset: follows the theme's pills list. */ pill?: boolean;
}
export const Count = forwardRef<HTMLSpanElement, CountProps>(function Count(
  { count, variant, size, pill, className, ...rest }, ref) {
  return <span ref={ref} {...rest}
    className={countVariants({ variant, size, pill: pill === true, rounded: pill === false }, className)}>…</span>;
});
```

The contract:

- `forwardRef` to the native element.
- Props extend that element's native attributes, and `...rest` is forwarded.
- Variant props come from the manifest types.
- Every prop has JSDoc, which the app's API tab shows.
- State goes to native or ARIA attributes first and `data-*` hooks second.
- Behaviour names follow the [vocabulary](GOVERNANCE.md#4-one-vocabulary).

Shared behaviour:

- `components/overlay.ts`: `computePosition`, `useAnchoredPosition`, `useNativePopover`,
  `useHoverIntent`.
- `Overlays.tsx`: anchored Popover, Menu, Tooltip, Toggletip, with the shared offsets and
  delays.
- `Theme` / `useTheme`: a scope from `mergeAxes` + `themeAttributes`.
- `Glyph.tsx`: draws Area icons from the generated `glyphs.ts`.

**Tests** (`packages/react/tests/*.test.mjs`, `node:test`, against `dist/`, so build first):

- one file per family for markup, ARIA, ref and prop forwarding;
- `cohesion.test.mjs` parses `area.css` and enforces the cross-family rules: hover never
  changes ink, one row plate ladder, every surface on its elevation role, required lines on
  `stroke-width`, every loop stops through the motion axis, and the rest;
- `tone.test.mjs`: no component offers an accent tone.

## Icons (`packages/icons`)

- `sources/*.svg` are the drawings (16px grid; `sources/12`, `sources/10` for small cuts).
- `scripts/generate.mjs` lints the construction rules and generates the package. A full run
  (`npm run icons:pilot`) also writes the tracked `packages/react/src/components/glyphs.ts`
  and `status-marks.ts`, which is how components get icons without depending on
  `@area/icons`.
- The app imports `@area/icons` directly. Process: the `area-icon-construction` skill.

## The app (`apps/desktop`)

`scripts/renderer.mjs` bundles `src/main.tsx` with esbuild and copies `area.css`. It
provides two virtual modules:

- `virtual:demo-snippets`: the source text of every `export const GalleryX = () => (…)` in
  `src/content/demos/*.tsx`, so a tile and its code sample are the same function;
- `virtual:component-sources`: specs, component CSS, React sources and their `*Props`
  JSDoc, which feed the family's Documentation, API, Code and Spec tabs.

**Content** (`src/content/`):

| File | Holds |
|---|---|
| `pages.mjs` | `COMPONENT_PAGES`: one entry per family (slug, name, manifest, imports, `api` rows, `examples` with notes). 116 families. |
| `demos/<family>.tsx` | The demos, one exported function each, unique names across files |
| `registry.tsx` | Imports every demo module into `DEMOS` (a duplicate name throws) |
| `specimens.mjs` | `GALLERY_SPECIMENS`: each family's tiles, one variant per tile; without an entry, `Gallery<Name>` or the first example |
| `specimen-names.mjs` | Tile names (`size-sm`, `tone-danger`, `state-disabled`) and their groups (Default, Variants, Tones, Sizes, Layout, Content, States, Behavior, Templates) |
| `documentation.mjs` | Each family's usage: when to use something else, do and don't, parts, states, keyboard, ARIA |
| `component-status.mjs` | Owner-confirmed status: `COMPLETE_COMPONENTS`, `REVIEW_COMPONENTS`, approval batches |
| `playgrounds.tsx` | Interactive controls for some families, checked against their snippets by `check:playgrounds` |

**Regions.**

- `src/places.ts` names every place (`#brand/area/components/…`, `#library/…`, `#labs/…`) and
  redirects the old tabs' links; `src/studio.tsx` holds the open tabs, their history and the
  Titlebar; `src/app-nav.tsx` the Sidebar's nav, the tabs and the takeover; `src/search-palette.tsx`
  the ⌘K search.
- `src/pages/*.tsx` fill the Sidebar (a page's own list), Canvas and Inspector for each place.
- The Inspector's Theme view writes `data-area-*` from `src/gallery/controls.ts` onto the
  Canvas only. The app chrome stays at type 13, Compact (`src/app-scale.ts`).
- `src/gallery/fit.ts` scales each tile's specimen to its card; it never upscales.

## Adding a component: the files

The order that keeps every check green. `<slug>` is kebab-case (`count`); `<name>` is the
manifest's camelCase key (`count`); `<Name>` the React export (`Count`).

1. **Spec**: `docs/specs/<slug>.md` from [the template](specs/TEMPLATE.md): job,
   variants, sources, anatomy, decisions ([Building a component](COMPONENT_ADAPTATION.md)).
2. **CSS**:
   - `packages/styles/src/components/<slug>.css` in `@layer area.components`;
   - import it in `src/index.css`;
   - if it paints a ground (`bg-surface`, `bg-code`, `bg-subtle`, `bg-page`) under
     controls, list it with that ground in `layers.css` (enforced by `cohesion.test.mjs`,
     "every painted ground is declared"); if it is an inset participant, a material part
     or needs a forced-colours repair, add it to `inset.css`, `material.css` or
     `forced-colors.css`.
3. **Manifest**: `export const <name> = {…} as const satisfies ComponentManifest` in
   `manifest.ts`, and add it to `MANIFESTS`.
4. **React**:
   - `export const <name>Variants = createVariants(manifests.<name>)` in `variants.ts`;
   - `src/components/<Name>.tsx`;
   - export it from `src/index.ts`.
5. **Tests**: `packages/react/tests/<slug>.test.mjs`. Extend `cohesion.test.mjs` when the
   component paints a shared role in a new way.
6. **Demos**:
   - `apps/desktop/src/content/demos/<slug>.tsx`, one `export const Gallery<Name>… = () => (…)`
     per tile;
   - import the module in `registry.tsx`.
7. **Family**:
   - a `COMPONENT_PAGES` entry in `pages.mjs`;
   - tiles in `specimens.mjs` (`default`, then `variant-*`, `tone-*`, `size-*`, `state-*`);
   - usage in `documentation.mjs` (the `area-component-docs` skill).
8. **Status**:
   - add the slug to `REVIEW_COMPONENTS` and to an `APPROVAL_BATCHES` entry in
     `component-status.mjs`;
   - only the owner moves it to `COMPLETE_COMPONENTS`.
9. **Inventory**: add it to [Components](COMPONENTS.md).

Then build, test and look at it in the app ([Development](DEVELOPMENT.md#checks-by-change)).

## Loose ends

Known debt, recorded so nobody builds on it:

- **`apps/desktop` → `apps/docs`.**
  - `demos/icons.tsx` imports `apps/docs/src/pilot-icons.tsx` and the Fluent map. It is
    bundled only by the docs, but it is typechecked with the app.
  - `renderer.mjs` copies `apps/docs/public/images`.
  - The capture script lives at `apps/docs/public/area-capture.js`, and the app does not
    load it.
- **Docs-only exports.** These are read only by the archived docs: `registry.tsx` `SOURCES`,
  `RECENT_COMPONENTS` and `REVIEW_BATCHES`, and `demoWrapper`'s `data-*-demo` attributes.
- **Manifests without a `*Variants` helper.** 25 manifests have none (Card, Dialog,
  Kbd, Code, Titlebar, Board…), so their React files write class strings by hand. Add the
  helper when the family is next touched.
- **Two prop sources.** Prop tables are written by hand in `pages.mjs` `api` and also read
  from JSDoc. JSDoc is the one to keep current.
