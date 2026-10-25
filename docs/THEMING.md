# Theming

Customize the whole library through shared settings, then semantic and component tokens
for specific roles. Components have no light, dark, compact or brand variants: a setting
on any ancestor changes every component inside it. The rules every setting follows are in
[Design system › Settings](DESIGN_SYSTEM.md#settings); how the build emits them is in
[Architecture](ARCHITECTURE.md#tokens-packagestokens).

## Settings

Each is `data-area-<id>` on any element (in React, a `Theme` value). Missing settings
inherit; an explicit setting starts a local scope. The registry
(`packages/tokens/src/axes/registry.ts`) defines 44 axes. Most are one number named after
what it measures.

The registry is also the source of every setting's name and place (owner, 2026-10-19: "i want the axises to be the
source of truth"). `SETTING_GROUPS` puts each axis and the two scoped settings (Contrast, Pills) under one heading
(Page, Accent, Where it paints, Size, Shape, Stroke, Shadow, States, Effects; in palette order since 2026-10-24) in order; each axis's `label` is its whole name (Mode, Stroke width,
Floating shadow …), and `settingLabel` drops the heading's word under its heading (Width, Floating …). The app's
Inspector and Theme tab both read them from `@area/tokens/config`. A preset's `label` is its value, with a range's
named end in brackets ("0 (Flat)", "100 (White)", "8 (Smooth)"); no label carries "(Default)" (owner, 2026-10-20).
`defaultPreset` alone says which is the default, and the Theme tab marks it.

**How the Inspector shows them** (owner, 2026-10-24, docs/research/theme-review-2026-10-23/controls-plan.md): an ordered
setting is a bar, Slider's field variant, with its name and its value inside, dragged from any point; named choices are a
Segmented; a setting with an Auto, System or Accent beside its range shows those with Custom, and the bar under them while
Custom is on. Values read in their unit (60%, 8px, 210ms, 215°, White), never a step number; the registry's preset ids are
unchanged, so saved settings and attributes still read. Mode pairs show the one for the mode the app is in.

**Colour**

| Setting | Values (default) | What it sets |
|---|---|---|
| `theme` | `light` (default), `dark` | Colour polarity and `color-scheme`, including native controls |
| `neutral` | `neutral` (default), `cool`, `warm` | The grey cast of every neutral role |
| `accent` | The palette's 11 (`blue`, default) or any hue `0` … `355` in 5° steps | The chosen colour. State marks, selected edges, the focus ring and selected text take it while Selection is Accent; solid actions while Action is Accent. A hue draws the palette's ladder between its two nearest families (`color/generate.ts`), so at a family's own hue the result is the family, and every solved step (solid, indicator, tonal ink) is solved again for it |
| `accent-strength` | `100` (Full, default) … `30` (Dusty) in tens, one for both modes | How much of its own colour the accent keeps: every accent colour mixes in OKLab toward the gray of its own luminance, so hue holds and contrast stays within 0.09:1; the solvers walk at every strength, so each step clears at each (docs/research/palette-customization-2026-10-23) |
| `label-tint` | `0` (None, default) … `4` (Full), one for both modes | How much of the accent's hue the label on an accent solid takes: a quarter a step from its measured black or white toward the most coloured rung that still clears 4.6:1 and APCA 61 on the Solid step's fill and hover at every strength (`tintedLabel`, scale.ts). A navy button at 2 has a pale blue label; on a bright fill no rung clears and the label stays white |
| `status-colours` | `fixed` (default), `match` | Danger, warning, caution, success, info and discovery as the palette draws them, or quieted to the Accent strength by the same mix, so a dusty palette has dusty statuses. Their hues never move, and tag colours (pink, gray, brown) stay |
| `solid-light`, `solid-dark` | `auto` (default: the accent's own solid) or `400` … `850` | The accent step solid fills (accent Buttons, checked marks) sit on, per mode: a navy button is blue at 750. A step whose label cannot clear moves toward the label's side to the first that can, so no step fails; the label keeps the hue's own colour. Dark's Auto stays the solver's own step whatever light picks (a navy fill measures 1.66:1 on the near-black page) |
| `action` | `neutral` (default), `accent` | Whether committing actions (solid Buttons) paint the accent |
| `selection` | `neutral`, `accent` (default since 2026-10-22) | Whether state marks (checked, on, selected, current, filled), selected edges (Card, Asset card, choice cards), the focus ring and selected text paint the accent. With Action, Neutral here gives an entirely neutral look. One setting, so a selected card and the mark inside it are always one colour (docs/research/selection-colour-2026-10-22) |
| `ground-light` | `100` (White, default) … `90` | The light page's OKLCH lightness, in 1% steps |
| `ground-dark` | `0` (Black), `8` (default, #020202), `12` … `24` | The dark page's lightness |
| `tint-hue` | `auto` (default: the Neutral setting's own hue), `accent` (the accent's hue), `0` … `355` in 5° steps | The hue the grays lean toward, one for both modes |
| `tint-light`, `tint-dark` | `auto` (default: Neutral's strength), `0` (None) … `16`, each step 0.005 of OKLCH chroma (to 16 since 2026-10-23, for a butter-yellow page) | How strongly the grays take the hue, per mode. A step past what sRGB can show at a hue and lightness is held at that room (`tintRoom`, two slopes under the gamut), not clipped, so steps past it draw the same colour; clipping moved luminance and hue (a blue tint at 8 on a 97 page painted cyan). Every hue at every strength clears the Layers gate (`layers.test.ts`, "every tint is usable") |
| `ink-tint` | `0` (None) … `4` (Full) in quarters, `2` (default) | How much of the tint body and muted text take. Text also moves 0.25 × the strength away from its ground, so it keeps 4.5:1 on every hue (`INK_MARGIN`, docs/research/custom-neutral-2026-10-22/) |
| `card-tone-light`, `card-tone-dark` | `auto` (default: each container's own tone, a Card raised, an Asset card recessed), `-4` (darker) … `0` (the page) … `+4` (lighter), a light step 0.012 L, a dark one 0.03 | Cards and asset cards against the page, per mode; their controls step from it and text is solved against the darkest (light) or lightest (dark) card, so every step reads (`layers.test.ts`, "every card tone is usable"). Menus, popovers and dialogs stay raised |
| `layers-light`, `layers-dark` | `0` (Flat), `2`, `4` (default), `6`, `8` (five steps since 2026-10-22; was every whole number) | How far raised layers (cards, menus) and recessed ones (sidebars, wells) sit from the page, and control fills from their ground |

The action and selection settings combine:

| action | selection | Result |
|---|---|---|
| neutral | neutral | Everything neutral (default) |
| accent | accent | Everything in the accent |
| accent | neutral | Coloured actions, calm controls |
| neutral | accent | Neutral actions, coloured state |

Semantic tones (info, success, warning, caution, danger, discovery) keep their colour in
every combination, at every accent hue and strength.

**Any palette, from a few colours** (2026-10-23, docs/research/palette-customization-2026-10-23). A palette is two
colours, optionally three: a **page** (Ground and Tint: the page and every gray), an **accent** (Accent, Accent strength,
Solid), and Action and Selection deciding where the accent paints. The Theme tab's Setup asks the greys as one first choice
(Neutral, Warmer, Cooler, Tinted, Accent), each opening only the settings that refine it, and offers a colour field for the
page and one for the accent; each snaps to the settings that draw it nearest and says what it chose. A pick is an input,
never a token value: every role (hover, press, tints, strokes, ink, the label on a fill, the focus rung, the dark
counterpart) is solved from the settings, so a custom colour has the guarantees a named one has. A separate button colour
(a third chromatic colour) is not offered; Solid makes buttons deeper or lighter in the accent's own hue. `custom` (Switch's `--area-switch-color`) is a per-instance colour
outside both roles.

**Size and shape**

| Setting | Values (default) | What it sets |
|---|---|---|
| `type` | `12` … `16`, `14` (default) | The base UI text size. Every type role follows: small text is 2 under (never under 10), reading text and titles 2 over. Also the icon stroke, the check box and toggle size, and which densities are allowed (Compact up to 14, Comfortable from 13). |
| `density` | `28` (Compact), `32` (default), `36` (Comfortable) | The room around text, named by the medium Button's height at type 14. It sets control heights (the text line plus twice the room, never under 24), rows (the text line plus twice the room, never under 5 a side: 28 at type 13 Compact, owner 2026-10-22), gaps, layout steps and surface insets. |
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

Eleven controls, each with one effect and no named looks. `DEPTH_LEVERS` in
`@area/tokens/config` lists them in the Inspector's order, with the state settings below. The app shows them under two
headings, **Stroke** and **Shadow**, and the states under **States**:

| Setting | Inspector label | Values (default) | What it sets |
|---|---|---|---|
| `surface` | Stroke › Width | `0` (Flat), `0.5`, `1` (default), `1.5`, `2` px | The frame of cards, panels and floating surfaces (`frame-width`, read as `border-width`) |
| `stroke` | Stroke › Edge contrast | `0` (None) … `8` in half steps (since 2026-10-22), `4` (default) | How dark every stroke is, its distance from its ground; a style, where Contrast is the accessibility layer |
| `shadow-rest` | Shadow › Edge | `0` (None, default) … `8` | `shadow-edge`, a subtle edge round the same surfaces, with the line or instead of it |
| `elevation` | Shadow › Floating | `0` (Flat) … `8`, `3` (default) | The Menu's shadow strength in percent: tooltip, float and modal roles |
| `shadow-resting` | Shadow › Resting | `0` … `8`, `3` (default) | Cards, panels and raised thumbs at rest: one tight layer, `0 1px 2px -1px`, 8% at 3 (ChatGPT's sm) |
| `shadow-hover` | States › Hover lift | `0` … `8`, `3` (default) | A hovered card or tile's lift (`shadow-lift`): `0 2px 4px -1px`, 8% at 3 (ChatGPT's md). At 0 the hover steps the edge instead |
| `shadow-field` | Shadow › Fields | `0` (default) … `8` | Outline fields, select triggers, outline and soft Buttons. Soft fields stay flat |
| `shadow-size` | Shadow › Reach | `0` … `8`, `4` (default) | How far every shadow reaches (offset and blur × n/4) |
| `shadow-softness` | Shadow › Softness | `0` (Crisp) … `8` (Smooth), `2` (default) | The number of layers and how tightly they sit |
| `shadow-light` | Shadow › Light | `0` (Flat, default) … `4` | A lip under each lifted edge and a highlight inside its top |
| `shadow-color` | Shadow › Colour | `black` (default), `warm`, `cool` | The light theme's shadow tint. Dark stays black |

- Light always comes from the top, and dark shadows are twice the light alpha.
- Resting and lift are one tight layer each (negative spread, owner 2026-10-21: "faint, low spread shadows"); Softness
  shapes the floating roles only.
- Every role is the same nine slots at every setting (a lip, the dark rim, six soft layers, a highlight), transparent
  where unused, never `none`. The dark rim (owner, 2026-10-19: "make the shadow settings visible in dark mode") is
  `0 0 0 1px` white at the role's own strength × 2, at most 16%, transparent in light, so shadows read on the
  near-black page.
- Under any raised contrast level, `border-width` is at least 1px, so Flat brings its frame
  back. The soft edge is drawn only while no frame is.
- The ladder `shadow-1` … `4` is for apps. Components name roles.

**Interaction states** (`axes/states.ts`, `axes/depth.ts`; owner, 2026-10-21)

The owner's picks on the state page are the defaults; every other option branches from them. The selected edge
(`stroke-selected`) and the focus ring (`focus-color`) are Selection roles (2026-10-22): the accent's indicator rung
(`accent-indicator`: the lightest step of the accent that keeps 3:1 on every ground, fill and tinted surface, #0160d9
light, #79aeff dark for blue) at Selection Accent, the default, and the neutral solid (#282828 / #f3f3f3) at Neutral.
Selected and focus share a colour and differ by placement: the selected edge inside, the focus ring on or outside.

| Setting | Inspector label | Values (default) | What it sets |
|---|---|---|---|
| `stroke-hover` | States › Hover edge | `0` (None) … `4`, `2` (default) | How far a control's edge darkens under the pointer (`edge-control-hover`), equal steps |
| `selected-stroke` | States › Selected edge | `1`, `2` (default), `3` px | A selected card's, tile's or choice card's edge, drawn inside (`selected-width`) |
| `focus-ring` | States › Focus ring | `hug` (default), `gap`, `halo`, `inset`, `bold` | Where the keyboard ring sits: `focus-width`, `focus-offset` (controls), `focus-gap` (containers and text) and the fields' ring, recolour and halo switches |
| `fill-hover` | States › Hover fill | `1` … `4`, `2` (default) | The hover plate under rows and ghost controls, opaque and translucent (`bg-component-hover`, `bg-hover`) |
| `fill-selected` | States › Selected fill | `0` (Same as hover) … `4`, `1` (default) | How far past hover the selected plate sits (`bg-component-active`, `bg-active`) |
| `fill-pressed` | States › Pressed fill | `1` … `4`, `4` (default) | Quarters of the way from selected to the firmest press: 12% toward the ink in light (ChatGPT's), 14% in dark, stopped where muted text keeps 4.6:1, which is always at least the press room past selected |
| `danger-hover` | States › Danger hover | `tint` (default), `neutral` | A destructive row's hover, highlight and pressed plate (Menu, Context menu): the row's own plate turned to the danger hue at the same lightness, or the grey plate every row takes (`row-danger-tint`, 1 or 0) |
| `selected-tint` | States › Selected tint | `none` (default), `tint`, `neutral` | A selected container's fill under its stroke: nothing, the accent's faint surface (half strength in dark), or the row's selected wash (`selected-tint`) |

- Hover, selected and pressed are built on each other, so their order holds at every combination (`color/layers.ts`
  `FILL_STEPS`, checked against the CSS in `layers.test.ts`). Inks are solved against the deepest ground's selected fill
  pressed by the press room (`PRESS_ROOM`, 2026-10-23: 0.012 L in light, 0.04 in dark, the smallest steps Area ships
  that read), so a press shows on every ground: it had equalled selected on recessed surfaces in light at Layers 4 to 8
  and on raised ones in dark from 16 + 8. At the defaults muted text is #646464 (was #666666) and the page's firmest press
  L 0.913 (was 0.925). A rule, not a setting: a press that cannot show is not a viable look.
- The dark translucent washes (`bg-hover`, `bg-active`, `bg-pressed`, for plates over a ground a component can't know)
  stop where muted text still reads: hover at 18.3%, selected at 20.3%, pressed at 22% (`DARK_WASH`, emit/base.ts), so
  selected stays a step past hover and every press shows at every Fill setting (2026-10-24); Hover 3 and 4 share the stop.
- Contrast More still lifts the hover edge to its 3:1 stroke, and a field's ring always draws under it.

**Motion**

| Setting | Values (default) | What it sets |
|---|---|---|
| `motion` | `0` (None) … `300` in steps of 30, `210` (default) | The Menu's open in milliseconds. Every duration is a third-multiple of it ([Motion](MOTION.md)) |
| `easing` | `standard` (default), `snappy`, `gentle`, `spring` | The shape of every transition (`--area-ease-*`, owned by Easing since 2026-10-19). Spring overshoots on enters and moves, never on exits ([Motion](MOTION.md)) |

`0` and `prefers-reduced-motion` make every duration 0 and stop every loop.

**Not axes**

- `data-area-contrast`: `0` (Standard) … `8` (More), `--area-contrast-more` an eighth a level (nine levels since
  2026-10-22); `standard`, `medium` and `more` stay as aliases of 0, 4 and 8. With no attribute it follows the OS
  `prefers-contrast`. The Inspector offers System (default) and the nine levels ([Contrast](CONTRAST.md)). It is the
  accessibility layer, apart from Stroke strength (a style): it pulls every edge toward the 3:1 stroke, adds boundaries
  where the soft style has none (frames at Stroke width 0, soft fields and buttons, the Switch thumb), puts the focus
  ring on fields, and follows the OS.
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
- **Grounds survive a scope.** A setting scope inside a region (a sidebar, a card, a menu, a `data-area-ground`) keeps
  that region's control fills: each ground re-points them on the setting scopes inside it, the nearest ground winning
  (`styles/layers.css`, 2026-10-23).
- **Tokens, not layout.** A scope selects tokens, not layout or component behaviour. Custom
  HTML must consume the right foreground, background and type roles itself.
- **Text restarts at a Type scope.** An element below the page root that carries `data-area-type` sets its text to
  the body role (`text-md` size, leading and tracking) of its own Type (`base.css`), so text set straight in it follows
  that scope instead of keeping the size inherited from above. Components keep their own roles; a product whose page
  uses another body role sets it again on its own scopes.

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
  `color-scheme`, and the accent's paint relative colour syntax (`color(from …)`, `oklch(from …)`; Chrome 119, Safari
  18, Firefox 128) inside `color-mix()`, and `@scope` (Chrome 118, Safari 17.4, Firefox 146) so a setting scope inside a
  region keeps the region's control fills; there is no fallback.
- **Size.** Each accent preset writes 60 colours per mode plus its Solid steps; the 72 hues bring `axes.css` to about
  790 KB (about 80 KB gzipped).
- **Saved settings migrate.** The app restores older saved Canvas settings: the `ui`
  shorthand as type and density, density saved by name as its number, one Layers value as
  both themes. Values that are no longer an option are dropped (`restoreCanvas` in
  `studio.tsx`). Legacy names are not public API.
- **What the checks don't prove.** A passing scope check does not prove component behaviour,
  forced colours, screen-reader support or every browser.
