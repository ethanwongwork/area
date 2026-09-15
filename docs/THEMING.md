# Theme scopes

Implemented in E02. [Measured results and visual comparison](batches/E02/README.md).

## CSS contract

Each `data-area-*` attribute selects one axis. An omitted attribute inherits its closest
selection. An explicit theme boundary changes light/dark polarity while preserving the
inherited neutral and accent. Removing an attribute restores inheritance; setting theme,
neutral and accent in a different order produces the same result. Invalid CSS attribute
values select no preset.

Each semantic color retains its light/dark pair until a real CSS color property consumes
it. `color-scheme` selects polarity at that element, including for native controls. This
also keeps inherited shadow recipes responsive to a new theme boundary. The theme axis
owns its fixed tones and shadow color; it does not write neutral or accent tokens.

Unregistered custom properties may now return a `light-dark(...)` expression from
`getComputedStyle(...).getPropertyValue(...)`. That string is not the painted color.
Measure a real `color`, `background-color`, `border-color` or shadow on an element consuming
the token. The lab and axis fixture do this. Do not register paired colors with `@property`:
resolving a color at its declaration would freeze its polarity before it is inherited.

A scope selects tokens; components consume them. It is not a Card, a surface, or a blanket
restyling of arbitrary HTML. Custom content must consume the appropriate semantic foreground,
background and type tokens as the existing components do.

## React contract

`Theme`, `useTheme` and `AxisSelection` are exported from `@area/react`.

- `Theme.value` is a partial selection of the eight current axis IDs: `theme`, `neutral`,
  `accent`, `type`, `density`, `radius`, `surface`, `motion`.
- Omitted or undefined values inherit from the nearest **React Theme**. The root starts at
  registry defaults. Passing an invalid axis or preset is a runtime error as well as a type error.
- `Theme` renders a div, forwards its ref and ordinary HTML attributes, and writes the
  complete effective selection as data attributes. Raw axis attributes cannot override its
  configuration silently. Use `value` to change an axis.
- `useTheme()` returns the frozen effective React selection. Changes propagate through
  React context, including across portals.
- Inside `createPortal`, wrap the content in another `Theme`. React context crosses the
  portal but CSS DOM inheritance does not; the inner Theme recreates the complete scope at
  the destination. It does not implement overlay behavior or focus management.

React context does **not** infer arbitrary DOM attributes outside the React provider tree.
When introducing a React root inside a CSS-only themed host, pass the same complete host
selection to its root Theme. Do not expect a raw `data-area-neutral` between two React Theme
components to update their context. The independent CSS-attribute path remains supported.

E04 standardizes the public axis ID as `accent`. Typography retains `type`. The docs migrate
saved preferences without resetting other valid choices; see [API migration](API_MIGRATION.md).

Executable examples: [nested theme demo](../apps/docs/src/demos/theme.tsx), rendered with its
own source snippet on the docs Axes page; [portal and live updates](../apps/docs/src/lab/react-scopes.tsx).

## DOM-free configuration

`@area/tokens/config` exports `AXIS_PRESETS`, `DEFAULT_AXES`, `mergeAxes` and `themeAttributes`,
with generated declarations. They come from the axis registry, not a second hand-maintained
preset list. `mergeAxes` validates and combines selections; `themeAttributes` materializes a
full attribute map. These helpers import no palette, React, DOM globals or browser APIs.

Run the package build before typechecking or packing from a fresh checkout. The token root
and config subpath export the same compiled helpers. All public package imports are covered
by the isolated packed-consumer fixture. Theme has an explicit client boundary; Node SSR is
verified, while RSC framework integration remains a release check.

## Ownership checks

The registry checks both light and dark maps for extra/missing keys, invalid values,
namespace violations and conflicting owners. A namespace ending in `:` means one exact
property; other entries are prefixes. Overlapping claims across axes fail validation even
before a property happens to collide. Neutral semantic names are exact claims; Surface owns
its four shadow recipes, while Theme owns the shadow color.

The CSS emitter validates transformed token maps too. Pairing colors or adding an emitter
branch cannot bypass key and ownership checks. Geometric derived tokens retain their existing
re-emission rules on axis-bearing elements.

## Browser requirements and verification limits

This implementation requires the color form of `light-dark()` and `color-scheme`. The feature
shipped in [Chrome 123](https://developer.chrome.com/blog/new-in-chrome-123),
[Safari 17.5](https://webkit.org/blog/15383/webkit-features-in-safari-17-5/) and
[Firefox 120](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/120). These are
feature availability references, not a claim that the entire Area library has been tested
at each historical minimum version. The selection mechanism follows
[CSS Color 5](https://drafts.csswg.org/css-color-5/#light-dark).

There is no legacy fallback or client-side color injection. Browsers without this feature
are unsupported by the new scope contract; the scope harness reports that explicitly.

E02's local matrix passed in Chromium and Safari 27.0. Firefox/Gecko is not installed and
was not run. OS preference, forced colors, screen-reader behavior and full component
accessibility remain distinct release checks. Passing scoped color resolution does not
establish overall accessibility. E03 subsequently resolves the 165 contrast failures; behavior
issues and release validation remain in the roadmap. See [CONTRAST.md](CONTRAST.md).
