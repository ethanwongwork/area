# 27 · Material levers

**Question (owner, 2026-10-17):** "maybe we can separate into different customization points, like adding a gradient
fill, gradient stroke? or adding an inner shadow, or transparency? maybe a radial gradient option? maybe breaking down
materials into the individual levers is better for control, similar to how surface is created with a bunch of
different controls for lightness, contrast, layers, and neutrality."

**Answer:** yes, and it fits Area better than presets. Materials split into thirteen levers in four groups, the way
Figma groups a layer's fills, strokes and effects. Each lever is one number from 0 (off) to 8, like Elevation and
Layers. Most also take a set of parts they apply to, like the Pills setting. One light angle drives every
direction. Glass, Tactile, Soft, Aero and Glow become saved lever values (bundles), not separate code. Every lever
works on the Layers tone, so the Layers settings still hold underneath.

**Page:** https://claude.ai/artifact/BpDuXHDq1vo2Rv5vKdhUB3 (saved in collection `levers`, doc `picks`).

## The levers

| Group | Lever | 0–8 means | Switches | Applies to (default) | Basis |
| --- | --- | --- | --- | --- | --- |
| Light | Light angle | 0–345° in 15° steps, 0 = top, clockwise | | everything | D9 |
| Fill | Gradient | tone-on-tone span: lighter toward the light, darker away; 8 = white 45% / black 22% (dark 24% / 45%) | Linear · Radial; Colour: tone or Accent | Controls | Figma fill types; D5 for colour |
| Fill | Sheen | a specular wash on the lit half; 8 = white 70% (dark 22%) | Soft · Band (hard stop at the midline, Aqua R11) | Controls | R11, R12 |
| Fill | Transparency | the part's Layers tone loses alpha; 8 = the reading floor (light 0.56, dark 0.62) | | Overlays | 22-calibration floors |
| Fill | Frost | backdrop blur, 4px a step (8 = 32px), saturate +12% a step | | Overlays | R03, R04, R07; Figma Background blur |
| Stroke | Stroke | strength of the decorative stroke; 4 = the board's buttons | Solid ring · Lit edge · Gradient · Double rim (several at once) | Controls, Surfaces, Overlays | R17, R19, R20; Figma strokes |
| Effects | Inner shadow | convex controls (lit edge in, shade out) and concave wells (shade in, catch-light out) | | Controls, Wells | R08 pressed, R10; Figma Inner shadow |
| Effects | Inner shadow softness | blur 0 (crisp, Tactile) to 6px (soft, Soft) | | with Inner shadow | R08 vs R10 |
| Effects | Emboss | an outer light and dark pair; the part rises from the ground (neumorphism) | | Controls, Surfaces | R08 |
| Effects | Contact shadow | shadow under raised controls; 4 = board 5 (0 2 4 10%) and board 6 in dark (0 4 7 20%) | | Controls | R19, R20 |
| Effects | Glow | accent light from solid actions and on-states; 8 = 20px blur, accent 88% | | solid actions, on switches | R12, R13 |
| Page | Grain | fractal noise over the page, 1.5% a step | | Page | R04 (Acrylic 2%), R15 |
| Page | Page glow | an accent wash on the page toward the light, 4% a step | | Page | Board 14; D10 limits it in dark |

**Targets** are Controls (buttons, segmented thumb, switch and slider thumbs), Wells (fields, switch and segmented
tracks, progress, slider track), Surfaces (cards) and Overlays (menus, popovers, toasts). The page is its own group.

## The materials as lever values

| Material | Levers | Switches |
| --- | --- | --- |
| None | all 0 | |
| Glass | transparency 6 and frost 6 on Surfaces and Overlays, stroke 4, sheen 3 | Lit edge |
| Tactile | stroke 4, inner shadow 4 (crisp), contact 4, grain 3 | Solid ring + Lit edge |
| Soft | emboss 4, inner shadow 4 on Wells at softness 8, light 315° | (also sets Layers: ground 95 / 24, contrast 0) |
| Aero | gradient 5, sheen 6, stroke 4, glow 2 | Band, Accent, Lit edge |
| Glow | glow 6, page glow 5, gradient 3, stroke 3 | Radial, Accent, Gradient stroke |

Tactile at these values is the 23 specimen's Tactile: the board's printed ring, lit edge and contact shadow.

## Prior art (checked 2026-10-16; sources in the session's research agent report, summarised)

| Tool or system | Levers it exposes | Scope | What Area takes from it |
| --- | --- | --- | --- |
| Figma | Fills (solid, linear, radial, angular, diamond, image), each with opacity; strokes as paints (gradient strokes allowed) with one position and weight; effects: drop shadow and inner shadow (up to 8 each), layer blur, background blur (uniform or progressive), noise (mono, duo, multi; size, density), texture, glass (light angle and intensity, refraction, depth, dispersion, frost) | One layer | The grouping (Fill, Stroke, Effects), the fixed paint order (blur and noise above strokes, then inner shadow, fills, drop shadow, background blur at the bottom) and the Glass names (D9) |
| daisyUI 5 | `--depth` and `--noise`, unitless multipliers read by 14 and 8 components (button: darker border, two drop shadows, inset white highlight, text shadow; noise: a grain tile) | Every component | The closest precedent for a system-wide material lever. But every theme sets them to 0 or 1, one lever bundles border, shadow, highlight and text effect, and there is no glass or gradient |
| Radix Themes | `panelBackground`: solid or translucent (64px blur), default translucent | Panels | Transparency as one setting |
| shadcn/create | `menuColor`: default, inverted, translucent variants | Menus only | Transparency scoped to a target (Area's Overlays default) |
| HeroUI Pro Glass theme | blur intensity (overlays 50 light / 75 dark), tint, fallback colour | Every surface, field and overlay | A global glass layer with an opaque fallback |
| tweakcn | shadow colour, opacity, blur, spread, offsets; one set generates the whole ladder | Theme | Elevation already works this way |
| Apple | Material thickness ultraThin to ultraThick (named); Glass regular, clear, identity, tint, interactive | One view | Thickness as steps; Area uses 0–8 |
| Fluent | Acrylic tint colour, tint opacity, luminosity opacity, fallback colour | One brush | A fallback per material |
| Open Props, Mantine, Chakra | shadow and inner-shadow ladders, gradient presets, noise filters; Chakra adds a dark-mode inset rim to every shadow | Tokens | Dark needs its own rim (Area's dark Borderless edge) |

**What none of them does:** separate each paint into its own continuous setting with a target set and one shared light.
daisyUI comes closest and is binary. That is the gap Area's levers fill.

**CSS (MDN browser-compat-data 8.1.6; the app's Electron is Chromium 152):**
- Relative colour, `color-mix()` and `backdrop-filter` work everywhere Area supports.
- `light-dark()` now takes images in Chrome 150, Firefox 150 and Safari 27, but still not numbers. Levers still need a numeric dark flag.
- Gradient borders on rounded parts use `background-clip: border-area` (Chrome 150, Safari 18.2, not Firefox), which keeps a translucent interior clear. Elsewhere they fall back to border-box, or need a masked pseudo-element.
- `corner-shape: superellipse()` (board item 7) is Chrome 139+, experimental.
- Animating a lever needs it registered with `@property`. That fits Area's rule: register inputs, never derived colours.

## Why levers fit Area

- **The same shape as Layers.** Layers turned "light theme / dark theme" into ground, contrast and cast. Levers turn
  "Glass / Tactile" into fill, stroke and effects. A preset becomes a starting point you can move away from, as the
  Layers page's bundles did.
- **One owner per paint.** Layers owns tone, Elevation lift, Surface the frame width, and each lever one extra paint.
  This keeps axes disjoint, which the registry already requires.
- **Combinations come free.** A tactile stroke on a glass card, or a radial gradient on soft controls, needs no new
  preset.
- **It matches the tools.** Figma stacks fills, strokes and effects on every layer. Designers already think in these
  levers.

## Contrast and safety

- **Transparency** stops at the reading floor (body text 4.5:1 over any backdrop). Muted text needs more (0.90 light,
  0.73 dark; `22-calibration/floors.mjs`).
- **Gradient on text-bearing parts** (`caps.mjs`). At the default Layers settings, body text holds 4.5:1 at every
  gradient step in both themes. Muted text on a light card holds only up to **3**; dark holds to 8. So a card gradient
  in light either caps at 3 or Layers solves muted ink for the gradient's dark end, as it already does for hovered
  rows.
- **Reduced transparency** and the page's opaque switch zero transparency and frost. **Forced colours** remove every
  lever image and blur (D7).
- **Glyphs and text** take no lever (D13); label relief stays an opt-in per component.

## Built into Area (2026-10-17)

Material is now a real setting, testable in the app: Examples → Analytics dashboard, Inspector → **Material**.
- **Tokens** (`packages/tokens/src/axes/material.ts`): the 14 levers (0–8; light angle 0–345°), six one-of switches,
  the stroke styles (a set, as Pills), seven bundles (None, Glass, Tactile, Jelly, Soft, Aero, Glow, from the levers
  page) and the part-group targets of 29-scope. Not a registry axis (Pills isn't either): `data-area-material="glass"`,
  then `data-area-material-<lever>="5"` or `-<switch>="radial"` or `-stroke-style="ring lit"` over it. The paints are
  derived live and re-derived wherever a material or the accent is set. `@area/tokens/config` exports the levers,
  switches and bundles for pickers. Test: `material.test.ts`.
- **Receivers** (`packages/styles/src/material.css`): everything is scoped under `[data-area-material]`, so with no
  attribute nothing changes. Part groups as 29-scope; pressed flips to recessed, disabled drops it, a focused field
  shows its halo alone, forced colours and reduced transparency switch it off. Gradient stroke and frost use style
  queries (Chromium). A product's own chrome marks `data-area-chrome`, names `--area-chrome-fill` and paints
  `--area-chrome-bg`; its page lays `--area-material-page` over its ground.
- **App** (`apps/desktop/src/material.ts`, `canvas-settings.tsx`): a Material select loads a bundle (Soft also sets its
  Layers: ground 95 / 24, contrast 0); each lever after it shows the bundle's value by name; a lever's switches show
  while it is on. Saved per viewer.
- **Changed from the prototype:** dark uses the same geometry with the dark alphas (as Elevation; CSS has no numeric
  theme flag), so the dark ring is 1px not 1.5px and the dark contact shadow keeps the light offsets. Grain is mono
  noise (no blend mode on a background layer) at 1.2% opacity a step; a first port at 3% read too strong.
- **Checked in the browser pane:** Tactile, Jelly, Aero, Glow, Soft in light; Glass in dark with a menu open (frost,
  rim, see-through card at 0.715). Not checked: every family under every bundle, a contrast sweep with materials on,
  hover and press by eye, Firefox and Safari.

## How it was built (prototype)

`gen-levers.mjs` writes `levers.css`. For each target group it derives, on the scope:
- a strength per lever (`lever / 8 x target gate`);
- one image list (linear and radial gradient, soft and band sheen);
- one gradient-stroke image;
- one shadow list (ring, lit edge, double rim, inner pair, emboss pair).

Receivers paint those over their own Layers fill:
- The fill is a layer with alpha, so transparency, the hover wash and the gradient stroke compose.
- The frame turns transparent only in gradient-stroke mode, where a frame-coloured layer and the gradient replace it.
- Shapes and styles are 0/1 gates multiplied into alphas, so every value is a number and nested scopes re-derive.

`build.mjs` builds the page from the 23 specimen markup; `caps.mjs` computes the gradient caps.

Checked in headless Edge: the gradient stroke and frame clip to `border-area`, so a see-through card stays clear inside; every receiver paints (no shadow list or background resolves to `none`), and the script
parses. Not checked: Safari and Firefox, phone width by eye, forced colours, OS reduced transparency, performance of
frost on many parts (D14).

## Open

- One value per lever, or light and dark values as Layers has?
- Targets per lever (as here) or one target set per material?
- Contact shadow as a material lever or an Elevation role for controls?
- A second gradient colour (a hue other than accent) or mesh gradients need a colour source D5 doesn't yet allow.
- Muted text on light card gradients: cap at 3, or let Layers solve for it.
