# Theming

Customize the whole library through shared settings, then use semantic/component tokens
for specific roles. Components do not need separate light/dark variants.

## Shared settings

The registry in `packages/tokens/src/axes/registry.ts` defines seven axes:

- `theme`: light or dark color polarity.
- `neutral`: neutral, cool or warm neutral colors.
- `accent`: configurable chromatic accent; indigo is the default.
- `ui`: default or compact, combining typography, control sizes, icons, gaps and padding.
- `radius`: sharp, subtle, soft, standard, round, rotund or pill.
- `surface`: flat, outlined, raised or elevated.
- `motion`: none, subtle or expressive.

Use `data-area-<axis>` on any ancestor. Missing settings inherit; explicit settings form
a local boundary. `data-area-contrast="more"` is a separate accessibility preference;
`standard` resets it locally. Without a root override, contrast follows the OS preference.

```html
<section data-area-theme="dark" data-area-accent="teal" data-area-ui="compact">
  <!-- Components inherit this scope. -->
</section>
```

## CSS inheritance

Every axis owns disjoint custom-property namespaces. Changing light/dark preserves the
inherited accent and neutral. Attribute order must not change the result; removing a
selection restores inheritance. Invalid CSS attribute values select no preset.

Semantic colors preserve their light/dark pair until consumed by a real CSS color
property. `color-scheme` chooses the polarity at that element, including native controls.
Do not register those pairs with `@property`, which could resolve and freeze them early.
A computed custom property can contain `light-dark(...)`; measure painted `color`,
`background-color`, border or shadow when checking actual color.

Geometric derivations are re-emitted on scope-bearing elements. A derived property that
is resolved only at the root can freeze the wrong density/radius inputs for descendants.
A theme scope selects tokens, not layout or component behavior. Custom HTML must consume
the appropriate foreground/background/type roles itself.

## React scopes

`Theme`, `useTheme` and `AxisSelection` are public exports from `@area/react`.

```tsx
<Theme value={{ theme: "dark", accent: "teal" }}>
  <Button tone="accent">Save</Button>
</Theme>
```

`Theme.value` is partial; omitted values inherit from the nearest React Theme, with
registry defaults at the root. Unknown axes/presets are rejected. Theme renders a div,
forwards its ref and ordinary attributes, and emits the complete effective selection.
Use `value` rather than raw axis attributes to configure that component.

`useTheme()` returns the effective React selection. Context crosses React portals; CSS
inheritance does not. Wrap portal content in another Theme to recreate the scope at its
new DOM location. Theme does not manage overlay focus, positioning or dismissal.

React context does not infer arbitrary host DOM attributes. When mounting into a CSS-only
themed host, pass that host's selection into the root Theme explicitly.

## Custom values and configuration

Use stable semantic CSS custom properties for role changes, and documented component
roles for local customization. Do not depend on private `--_*` slots. Consumers must
verify contrast and geometry for their overrides; preset checks cannot certify arbitrary
custom themes. Add reusable roles to the token package rather than duplicating literals
across components. See [Design system](DESIGN_SYSTEM.md).

`@area/tokens/config` exports registry-derived `AXIS_PRESETS`, `DEFAULT_AXES`, `mergeAxes`
and `themeAttributes` without importing React, browser globals or palette math. Use these
helpers when consumers need validated configuration and a complete attribute map.
Build the packages before importing them from a fresh checkout.

## Compatibility and verification

Saved docs preferences migrate older `brand` to `accent` and old type/density choices
to the current UI scale. Legacy axis names are not new public API. Historical migration
notes are retained in the archive; the current registry and public types are authoritative.

The color scope model requires CSS `light-dark()` and `color-scheme`; there is no legacy
color-injection fallback. Scope fixtures exercise nested resets and portals. A passing
scope matrix does not prove component behavior, forced colors, screen-reader support or
all browsers. Use `scopes.html` and the relevant checks in [Development](DEVELOPMENT.md).
