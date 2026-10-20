# Theming

Customize the whole library through shared settings, then semantic and component tokens
for specific roles. Components have no light, dark, compact or brand variants: a setting
on any ancestor changes every component inside it. The rules every setting follows are in
[Design system › Settings](DESIGN_SYSTEM.md#settings); how the build emits them is in
[Architecture](ARCHITECTURE.md#tokens-packagestokens).

## Settings

Each is `data-area-<id>` on any element (in React, a `Theme` value). Missing settings
inherit; an explicit setting starts a local scope. The registry
(`packages/tokens/src/axes/registry.ts`) defines 23 axes. Most are one number named after
what it measures.

**Colour**

| Setting | Values (default) | What it sets |
|---|---|---|
| `theme` | `light` (default), `dark` | Colour polarity and `color-scheme`, including native controls |
| `neutral` | `neutral` (default), `cool`, `warm` | The grey cast of every neutral role |
| `accent` | 11 hues, `blue` (default) | The chosen colour. The focus ring and `stroke-selected` follow it |
| `action` | `neutral` (default), `accent` | Whether committing actions (solid Buttons) paint the accent |
| `selection` | `neutral` (default), `accent` | Whether state marks (checked, on, selected, current, filled) paint the accent |
| `ground-light` | `100` (White, default) … `90` | The light page's OKLCH lightness, in 1% steps |
| `ground-dark` | `0` (Black), `8` (default, #020202), `12` … `24` | The dark page's lightness |
| `layers-light`, `layers-dark` | `0` (Flat) … `8`, `4` (default) | How far raised layers (cards, menus) and recessed ones (sidebars, wells) sit from the page, and control fills from their ground |

The action and selection settings combine:

| action | selection | Result |
|---|---|---|
| neutral | neutral | Everything neutral (default) |
| accent | accent | Everything in the accent |
| accent | neutral | Coloured actions, calm controls |
| neutral | accent | Neutral actions, coloured state |

Semantic tones (info, success, warning, caution, danger, discovery) keep their colour in
every combination. `custom` (Switch's `--area-switch-color`) is a per-instance colour
outside both roles.

**Size and shape**

| Setting | Values (default) | What it sets |
|---|---|---|
| `type` | `12` … `16`, `14` (default) | The base UI text size. Every type role follows: small text is 2 under (never under 10), reading text and titles 2 over. Also the icon stroke, the check box and toggle size, and which densities are allowed (Compact up to 14, Comfortable from 13). |
| `density` | `28` (Compact), `32` (default), `36` (Comfortable) | The room around text, named by the medium Button's height at type 14. It sets control heights (the text line plus twice the room, never under 24), rows, gaps, layout steps and surface insets. |
| `radius` | `0` (Sharp), `2`, `4`, `6`, `8` (default), `10`, `12`, `14`, `pill` | The medium Button's corner. Every corner derives from it ([Size and shape](DESIGN_SYSTEM.md#size-and-shape)) |

- `data-area-ui` is shorthand, not an axis: `compact` is type 12 with density 28,
  `default` is type 14 with 32. An explicit `type` or `density` on the same element wins.
- `ui-dense` is the spacing step that each density level keeps against the type size: 1 at
  Compact 12, 0 at Default 14, negative above. Component insets are written against it.
- Control side padding has no token: `inset.css` derives it from the height.
- `data-area-pills` is a set, not an axis (`axes/pills.ts`). It is a space-separated list of
  the shapes that draw a pill: `button`, `field`, `segmented`, `chip`, `badge`, `count`,
  `switch`, `avatar`.
  - With no attribute, chip, badge, count, switch and avatar are pills.
  - `""` makes every one of them follow the radius.
  - Instance props override it (`pill`, Avatar's `shape`).

**Edge and depth** (`axes/surface.ts`, `axes/elevation.ts`, `axes/depth.ts`)

Ten controls, each with one effect and no named looks. `DEPTH_LEVERS` in
`@area/tokens/config` lists them in the Inspector's order. The app shows them under two
headings, **Stroke** and **Shadow**:

| Setting | Inspector label | Values (default) | What it sets |
|---|---|---|---|
| `surface` | Stroke › Width | `0` (Flat), `0.5`, `1` (default), `1.5`, `2` px | The frame of cards, panels and floating surfaces (`frame-width`, read as `border-width`) |
| `stroke` | Stroke › Strength | `0` (None) … `8`, `4` (default) | How dark every stroke is, its distance from its ground |
| `shadow-rest` | Stroke › Rest shadow | `0` (None, default) … `8` | `shadow-edge`, a subtle edge round the same surfaces, with the line or instead of it |
| `elevation` | Shadow › Floating | `0` (Flat) … `8`, `3` (default) | The Menu's shadow strength in percent: tooltip, float, modal and lift roles |
| `shadow-resting` | Shadow › Resting | `0` … `8`, `3` (default) | Cards, panels and raised thumbs at rest |
| `shadow-field` | Shadow › Fields | `0` (default) … `8` | Outline fields, select triggers, outline and soft Buttons. Soft fields stay flat |
| `shadow-size` | Shadow › Size | `0` … `8`, `4` (default) | How far every shadow reaches (offset and blur × n/4) |
| `shadow-softness` | Shadow › Softness | `0` (Crisp) … `8` (Smooth), `2` (default) | The number of layers and how tightly they sit |
| `shadow-light` | Shadow › Light | `0` (Flat, default) … `4` | A lip under each lifted edge and a highlight inside its top |
| `shadow-color` | Shadow › Colour | `black` (default), `warm`, `cool` | The light theme's shadow tint. Dark stays black |

- Light always comes from the top, and dark shadows are twice the light alpha.
- Under any raised contrast level, `border-width` is at least 1px, so Flat brings its frame
  back. The soft edge is drawn only while no frame is.
- The ladder `shadow-1` … `4` is for apps. Components name roles.

**Motion**

| Setting | Values (default) | What it sets |
|---|---|---|
| `motion` | `0` (None) … `300` in steps of 30, `210` (default) | The Menu's open in milliseconds. Every duration is a third-multiple of it ([Motion](MOTION.md)) |

`0` and `prefers-reduced-motion` make every duration 0 and stop every loop.

**Not axes**

- `data-area-contrast`: `standard`, `medium` or `more` (`--area-contrast-more` 0, 0.5, 1).
  With no attribute it follows the OS `prefers-contrast`. The Inspector offers System
  (default), Standard, Medium and More ([Contrast](CONTRAST.md)).
- `data-area-material` (`axes/material.ts`, `styles/material.css`):
  - a bundle (`none`, `glass`, `tactile`, `jelly`, `soft`, `aero`, `glow`);
  - per-lever overrides `data-area-material-<lever>` (light angle, gradient, sheen,
    transparency, frost, stroke, inner shadow, softness, catch-light, emboss, contact, glow,
    grain, page glow);
  - switches and stroke styles.

  Materials paint only inside an element that has the attribute. They paint over a part's
  Layers fill, never change size, type or ink, and add no outer lift beyond a contact shadow.
  The bundles are named presets; the owner's "no named looks" rule makes their future an
  open question.
- `data-area-ground="raised" | "recessed" | "page"`: marks a product's own region, so the
  control fills inside it step from that ground (`styles/layers.css`).

```html
<section data-area-theme="dark" data-area-accent="teal" data-area-type="13" data-area-density="28">
  <!-- Components inherit this scope. -->
</section>
```

## CSS inheritance

- **Independence.** Every axis owns disjoint custom-property namespaces. Switching light and
  dark keeps the inherited accent and neutral. Attribute order never changes the result,
  removing a setting restores inheritance, and an invalid value selects no preset.
- **Colour pairs.** Semantic colours stay as their light/dark pair until a real CSS colour
  property consumes them; `color-scheme` picks the polarity at that element. A computed
  custom property can contain `light-dark(…)`, so to check a colour, measure the painted
  `color`, `background-color`, border or shadow.
- **Switching theme at runtime.** Chromium can keep a cached colour on some descendants after
  `color-scheme` flips. Force one synchronous restyle after the switch:
  `root.style.display = "none"; void root.offsetHeight; root.style.display = "";`. Nothing
  paints in between. The app also sets `data-area-switching` for one frame so nothing
  animates. Setting the theme before first paint needs neither.
- **Re-emission.** Derived values are re-emitted on every element that carries a setting.
  A derivation resolved only at the root would freeze the wrong inputs for descendants.
- **Tokens, not layout.** A scope selects tokens, not layout or component behaviour. Custom
  HTML must consume the right foreground, background and type roles itself.

## React scopes

`Theme`, `useTheme` and `AxisSelection` are exported from `@area/react`.

```tsx
<Theme value={{ theme: "dark", accent: "teal", action: "accent" }}>
  <Button>Save</Button>
</Theme>
```

- `Theme.value` is partial. Omitted values inherit from the nearest Theme, with the
  registry defaults at the root. Unknown axes or values throw.
- Theme renders a div, forwards its ref and attributes, and writes every effective
  `data-area-*`. It does not set contrast or material attributes.
- `useTheme()` returns the effective selection.
- Context crosses React portals, but CSS inheritance does not. Wrap portal content in
  another Theme to recreate the scope where it mounts.
- Theme does not manage overlay focus, positioning or dismissal.
- When mounting into a host themed by CSS alone, pass that host's selection to the root
  Theme explicitly.
- `@area/tokens/config` exports `AXIS_PRESETS`, `DEFAULT_AXES`, `mergeAxes` and
  `themeAttributes` without React or browser globals, for validated configuration
  anywhere.

## Custom values

- **Use the public layers.** Override stable semantic properties for role changes, and
  documented component roles for local changes. Never depend on private `--_*` slots.
- **Verify your own overrides.** Consumers check contrast and geometry for them; the preset
  checks cannot certify arbitrary custom themes.
- **Share reusable roles.** A reusable role belongs in the token package, not duplicated as
  literals across components ([Governance](GOVERNANCE.md#5-keep-it-lean)).

## System tokens outside the axes

- `opacity-disabled`: 0.5, a whole disabled control. Fields use their own disabled paint.
- `scrim`: the modal backdrop, 13% black in light and `bg-overlay` in dark. It is derived,
  so a themed subtree re-derives it.

### Parked tokens

Defined but read by no component, kept until the token phase decides. Several are public
seams or come from `palette.json`. A parked token is not a promise of use.

- Alpha ramps: `accent-a*`, `cool-a*`, `warm-a*` and their `-contrast`; `accent-border-strong`.
- Tone extras: `fg-*-strong`, `*-border-subtle`, `fg-caution-vivid`, `fg-action`, `fill-toggle` / `-hover`.
- Type: `display-sm/lg-*`, `title-sm/md-*`, `text-xs-tracking`.
- Tiers no component uses: `control-xl`, `gap-xs` / `-xl`, `icon-xl`, `radius-control-xl`,
  `radius-nested`.
- Motion: `ease-in` and the deprecated `ease-spring`.
- Seams: `badge-bg`, `badge-fg`, `badge-tracking-wide`.
- The `z-*` layer scale (0–80), for apps. Components stack locally, and floating surfaces
  use the top layer.

## Limits

- **Required browser features.** The colour scope model requires CSS `light-dark()` and
  `color-scheme`; there is no fallback.
- **Saved settings migrate.** The app restores older saved Canvas settings: the `ui`
  shorthand as type and density, density saved by name as its number, one Layers value as
  both themes. Values that are no longer an option are dropped (`restoreCanvas` in
  `studio.tsx`). Legacy names are not public API.
- **What the checks don't prove.** A passing scope check does not prove component behaviour,
  forced colours, screen-reader support or every browser.
