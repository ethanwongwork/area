# Theming

Customize the whole library through shared settings, then use semantic/component tokens
for specific roles. Components do not need separate light/dark variants.

## Shared settings

The registry in `packages/tokens/src/axes/registry.ts` defines eleven axes:

- `theme`: light or dark color polarity.
- `neutral`: neutral, cool or warm neutral colors.
- `accent`: configurable chromatic accent; blue is the default (owner, 2026-09-29; was indigo). The focus ring follows it.
- `action`: neutral or accent, the colour of committing actions (solid Buttons). Neutral is the default.
- `selection`: neutral or accent, the colour of state (checked, on, selected, current, filled). Neutral is the default.
- `type`: the base interface text size, `12` to `16` (default `14`; [research](research/ui-size-scale-2026-10-12.md), owner 2026-10-12). One number sets every type role: UI text at the base, small text two under it (never under 10), reading text and surface titles two over it, small-text tracking, the icon stroke, the check box and toggle (4 inside the UI line; a toggle 4 taller) and icons (the 20 cut at 16). It also bounds density: Compact up to 14, Comfortable from 13.
- `density`: `28` (Compact), `32` (default) or `36` (Comfortable), the room around text, named by the medium Button's height at type 14 (one number since 2026-10-14, [research](research/density-2026-10-14.md); was `compact` / `default` / `comfortable`). `emit/base.ts` derives every control height (`control-*`: the tier's text line plus 2 x its room, never under 24; Default at type 14 gives 24 / 28 / 32 / 40 / 48), rows (`ui-row`), icon gaps (`gap-*`, `gap-row`), layout steps (`ui-stack`, `ui-cluster`), surface insets (`inset-surface-sm/md`) and the text-label marks (`mark-label-*`) from the level and the type size. Spacing keeps each level's ratio of space to type as a step in halves, published as `ui-dense` (1 at Compact 12, 0 at Default 14, negative above), which component insets are written against. Static marks `mark-sm/md/lg` (16 / 20 / 24: Presence, ColorSwatch, the Indicator count) hold. Control side padding has no token: inset.css derives it from the height (owner 2026-10-02). Surface corners cap at 1.5 x the surface inset, so compact surfaces stay shallow at the roundest radius settings.
- `ui` (shorthand, not an axis): `compact` is type 12 with density 28, `default` type 14 with 32; an explicit `type` or `density` wins. Corners stay a cross-axis derivation: the radius axis publishes a corner per pixel of height, the type and density the heights, and `emit/base.ts` derives `radius-control-*`, `radius-small` and `radius-row` from them ([compact pass](research/compact-pass-2026-10-01.md)).
- `radius`: one corner setting, `0` (Sharp), `2`, `4`, `6`, `8` (default), `10`, `12`, `14` or
  `pill`: one number, the medium Button's corner, that everything scales off (owner, 2026-10-03; replaces the named families and
  the roundness offset). Owns `radius-factor` (corner per pixel of height: setting ÷ 32, 0.5 at
  Pill), `radius-min` (2, 0 at Sharp), `radius-surface` (0, 2, 4, 8, 12, 16, 20, 24, 24) and
  `radius-concentric` (0 at Sharp). `emit/base.ts` derives `radius-control-*` from the control
  heights, `radius-row`, `radius-small`, `radius-container`, `radius-step`, `radius-floor`
  (min(4, setting)), and `radius-list-row` / `radius-list` for floating lists (rows no rounder
  than a medium Button and a pill only at Pill; the list is rows + 4). See `docs/research/radius-audit-2026-10-03.md` and `roundness.html`.
- `data-area-pills` (not an axis: a set, `axes/pills.ts`): the components that draw a pill instead
  of the radius corner, as a space-separated list on any element (`Theme pills={[...]}` in React).
  Shapes: `button`, `field`, `segmented`, `chip`, `badge`, `count`, `switch`, `avatar`. No attribute:
  chip, badge, count, switch and avatar are pills. A scope with the attribute lists exactly its
  pills (`""` makes every one follow the radius). Each sets `--area-pill-<id>` (0 / 1), which the
  component adds as `flag × radius-full`, so concentric parts follow. Instance props override it
  (`pill`, Avatar's `shape`).
- `surface`: one number, the decorative frame's width in px: `1` (Default) or `0` (Borderless)
  (`axes/surface.ts`, 2026-10-14; was `outlined` / `borderless`). Sets `border-width` and `shadow-edge`:
  transparent at 1, and at 0 ChatGPT's frameless-menu edge (a 1px-blur shadow at 62% black, plus a 1px-blur
  20% white line inside it in dark), which every framed surface lists first in its `box-shadow`, so no
  surface loses its edge at Elevation 0 or in dark; `shadow-edge-filter` is the same edge as a drop-shadow, for the
  Popover arrow. Required edges (`stroke-width`) and focus stay.
- `elevation`: one number, `0` (Flat) to `8`, `3` by default: the Menu's shadow strength in percent,
  as `radius` is the medium Button's corner (`axes/elevation.ts`, owner 2026-10-14;
  [research](research/elevation-2026-10-14.md)). It scales five roles that components name:
  `shadow-control` (raised thumbs and plates), `shadow-resting` (Card, Panel, Board card, Composer),
  `shadow-tooltip`, `shadow-float` (everything over the page) and `shadow-modal` (Dialog, Drawer,
  Command palette). Geometry is fixed per role (Fluent 2's tiers); the step sets the alpha (key
  `n × weight` %, ambient half, dark doubled). The ladder `shadow-1`…`4` (control, resting, float,
  modal) is for apps. Every role is two layers at every step; step 0 is `0 0 0 0 transparent`, never
  `none`, so a role stays valid inside a component's own shadow list.
- `motion`: one number, `0` (None) to `300` in steps of 30, `210` by default: the Menu's open in
  milliseconds (`duration-base`), as `elevation` is the Menu's shadow (`axes/motion.ts`, owner
  2026-10-14). Every duration scales from it in thirds: `fast` 2/3, `base` 1, `moderate` 4/3,
  `slow` 5/3, so 210 gives 140 / 210 / 280 / 350 (ChatGPT's popover opens in 220), 150 gives
  100 / 150 / 200 / 250 (the old Subtle) and 240 gives 160 / 240 / 320 /
  400 (the old Expressive within 10ms). `instant` stays 0 and the easings are fixed. `0` and
  `prefers-reduced-motion` make every duration 0. Replaces the None, Subtle and Expressive presets.

Keep the name `accent`: it is the system-selected chromatic role and may represent a
product brand. Components never ask for it with a variant. They paint one of two emphasis
roles, and `action` and `selection` decide whether each role is neutral or the accent
(owner, 2026-09-29):

| `action` | `selection` | Result |
|---|---|---|
| neutral | neutral | Everything neutral (default) |
| accent | accent | Everything in the accent |
| accent | neutral | Accent leads: coloured actions, calm controls |
| neutral | accent | Neutral leads: neutral actions, coloured state |

System tokens outside the axes (audit S21b, owner 2026-09-30): `opacity-disabled` (0.5, a
whole disabled control; fields use their own disabled paint) and `scrim` (the modal backdrop:
13% black light, `bg-overlay` dark; derived, so a themed subtree re-derives it).

Parked tokens (audit S21b): defined but read by no component, kept until the token phase
decides, because several are public seams or come from `palette.json`. Not a promise of use.

- Alpha ramps `accent-a*`, `cool-a*`, `warm-a*` and their `-contrast`; `accent-border-strong`.
- Tone extras: `fg-*-strong`, `*-border-subtle`, `fg-caution-vivid`, `fg-action`,
  `fill-toggle` / `-hover`.
- Type: `display-sm/lg-*`, `title-sm/md-*`, `text-xs-tracking`.
- Tiers no component uses: `control-xl`, `gap-` `xs` / `xl`, `icon-xl`,
  `radius-control-xl`; `radius-nested` (components compute their concentric radius).
- Motion: `ease-in` and the deprecated `ease-spring`. Elevation's ladder `shadow-1`…`4` is for apps; components name roles.
- Seams: `badge-bg`, `badge-fg`, `badge-tracking-wide`.
- The `z-*` layer scale (0–80). Component stacking is local (−2…2 inside a component) and
  every floating surface is in the top layer, so no component reads it; it stays for apps.

`custom` (Switch) means a per-instance colour outside both roles. Semantic tones (info,
success, warning, caution, danger, discovery) carry meaning and keep their colour in
every combination. See DESIGN_SYSTEM.md, "Emphasis roles", for what each role paints.

Use `data-area-<axis>` on any ancestor. Missing settings inherit; explicit settings form
a local boundary. `data-area-contrast="more"` is a separate accessibility preference;
`standard` resets it locally. Without a root override, contrast follows the OS preference. The app's Inspector
offers it on the Canvas as Contrast: System (no attribute), Standard, More.

```html
<section data-area-theme="dark" data-area-accent="teal" data-area-type="13" data-area-density="28">
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

Switching `data-area-theme` at runtime: because a pair's text is identical in both themes,
Chromium can keep a cached painted colour on some descendants after `color-scheme` flips
(seen 2026-10-01: Nav, Menu and Tabs labels kept the light ink until the next restyle).
Force one synchronous restyle after the switch, as the docs Customize panel does:
`root.style.display = "none"; void root.offsetHeight; root.style.display = "";`. Nothing
paints in between, so there is no flash. Setting the theme before first paint needs nothing.

Geometric derivations are re-emitted on scope-bearing elements. A derived property that
is resolved only at the root can freeze the wrong density/radius inputs for descendants.
A theme scope selects tokens, not layout or component behavior. Custom HTML must consume
the appropriate foreground/background/type roles itself.

## React scopes

`Theme`, `useTheme` and `AxisSelection` are public exports from `@area/react`.

```tsx
<Theme value={{ theme: "dark", accent: "teal", action: "accent" }}>
  <Button>Save</Button>
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
notes are in Git history (the `archive/` folder, removed after commit `2f90f2d`); the current
registry and public types are authoritative.

The color scope model requires CSS `light-dark()` and `color-scheme`; there is no legacy
color-injection fallback. Scope fixtures exercise nested resets and portals. A passing
scope matrix does not prove component behavior, forced colors, screen-reader support or
all browsers. Use `scopes.html` and the relevant checks in [Development](DEVELOPMENT.md).
