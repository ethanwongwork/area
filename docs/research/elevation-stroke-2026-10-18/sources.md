# Shadows and strokes: recipes, contrast, parameters (research, 2026-10-18)

Companion to `docs/research/elevation-2026-10-14.md`. All values were read from source on 2026-10-18.
Hex alphas are converted to percent (`#0000001f` = 12%). Notation is `x y blur spread colour`. "ring" means
`0 0 0 Npx`, "inset ring" means `inset 0 0 0 Npx`, and "lip" means a hard `0 1px 0`.

## Sources (pinned)

| System | Source | Version / commit |
|---|---|---|
| Radix Themes | github.com/radix-ui/themes `packages/radix-ui-themes/src/styles/tokens/shadow.css`, `components/_internal/base-card.css`, `base-button.css`; alpha scales from `@radix-ui/colors` | themes @1faff10, colors 3.0.0 |
| Tailwind v4 | unpkg `tailwindcss/theme.css`, `dist/lib.js` | 4.3.3 |
| Primer | unpkg `@primer/primitives/dist/css/functional/themes/{light,dark,light-high-contrast,dark-high-contrast}.css`, `size/border.css` | 11.10.0 |
| shadcn/ui | `apps/v4/registry/new-york-v4/ui/*.tsx`, `apps/v4/app/globals.css` | @daaf156 |
| Polaris | unpkg `@shopify/polaris-tokens/dist/css/styles.css` | 9.4.2 |
| Atlassian | unpkg `@atlaskit/tokens/dist/esm/artifacts/themes/*.js`, `tokens-raw/*` | 20.6.1 |
| Material 3 | material-web `elevation/internal/_elevation.scss`, `tokens/versions/latest/sass/_md-comp-*.scss`; material-color-utilities `typescript/dynamiccolor/color_spec_2021.ts` | material-web @60c3e53, MCU @dd62982 |
| Fluent 2 (web) | fluentui `packages/tokens/src/alias/highContrastColor.ts`, `global/strokeWidths.ts`, `react-components/*/use*Styles.styles.ts` | @f02cfa8 |
| Fluent 2 (WinUI 3) | microsoft-ui-xaml `controls/dev/CommonStyles/Common_themeresources_any.xaml` | @2a08ab9 |
| Geist (Vercel) | live CSS from vercel.com/geist/materials (`_next/static/immutable/chunks/26m9pll27sgli.css`, `2w5uwfm252rr8.css`, `39s0xqqmdc-71.css`) | fetched 2026-10-18 |
| Linear | live CSS from linear.app (static.linear.app `_next/static/css/*.css`). This is the marketing site, not the product app. | fetched 2026-10-18 |
| Stripe | live CSS from stripe.com (`--hds-*` tokens). This is the marketing site; the Dashboard is not public. | fetched 2026-10-18 |
| Raycast, Resend | live CSS from raycast.com and resend.com | fetched 2026-10-18 |
| Clerk | github.com/clerk/javascript `packages/ui/src/foundations/shadows.ts`, `borders.ts` | @85dec02 |
| Ant Design | `components/theme/util/alias.ts`, `components/card/style/index.ts` | @13d7b16 |
| Apple | developer.apple.com docs JSON (CALayer, NSShadow, SwiftUI `shadow(color:radius:x:y:)`, UIScreen.scale); NSColor read locally on macOS 27.2 (26B5101f) with a Swift script; support.apple.com/guide/mac-help/unac089 | — |
| CSS specs | css-color-adjust-1 §3.1 (forced colours); css-values-4, "snap a length as a line width" | — |
| Generators | joshwcomeau.com/css/designing-shadows, /shadow-palette; tobiasahlin.com/blog/layered-smooth-box-shadows; smoothshadows.com `app.js` (live); shadows.brumm.af `static/js/main.0740e207.chunk.js` (Wayback, 2024-01-12, now offline); github.com/jaukia/supershad `src/index.ts` @f1f476d; Figma plugin API `Effect`; Framer property controls | — |

---

## 1. Layered recipes by role

### Radix Themes (light, `:where(.radix-themes)`; alphas resolved)

Light: `gray-a2` 2.4%, `gray-a3` 5.9%, `gray-a5` 12.2%, `gray-a7` 19.2%. `black-a1` 5%, `a2` 10%, `a3` 15%, `a5` 30%.
Where `color-mix` is supported, every outer 1px ring is `color-mix(in oklab, gray-aN, gray-N 25%)`, which is
slightly opaque.

| Token | Used by | Layers |
|---|---|---|
| shadow-1 (recessed) | TextField, TextArea, Checkbox, Radio, Switch track, Slider track, Progress | inset ring 1px gray-a5 (12%); inset 0 1.5 2 0 gray-a2 (2.4%); inset 0 1.5 2 0 black-a2 (10%) |
| shadow-2 (resting) | Classic Card, Segmented thumb | ring 1px gray-a3 (6%); ring 0.5px black-a1 (5%); 0 1 1 0 gray-a2 (2.4%); 0 2 1 −1 black-a1 (5%); 0 1 3 0 black-a1 (5%) |
| shadow-3 (raised) | Classic Card hover (approximately) | ring 1px gray-a3; 0 2 3 −2 gray-a3 (6%); 0 3 12 −4 black-a2 (10%); 0 4 16 −8 black-a2 (10%) |
| shadow-4 | HoverCard | ring 1px gray-a3; 0 8 40 0 black-a1 (5%); 0 12 32 −16 gray-a3 (6%) |
| shadow-5 (floating) | Popover, Select, DropdownMenu, ContextMenu | ring 1px gray-a3; 0 12 60 0 black-a3 (15%); 0 12 32 −16 gray-a5 (12%) |
| shadow-6 (modal) | Dialog, AlertDialog | ring 1px gray-a3; 0 12 60 0 black-a3 (15%); 0 16 64 0 gray-a2 (2.4%); 0 16 36 −20 gray-a7 (19%) |

Dark (`.dark`; `gray-a6` is white 17%, `gray-a3` is white 7%, `gray-a4` is white 10.6%):

- **shadow-1.** inset 0 −1 1 0 gray-a3; inset ring gray-a3; inset 0 3 4 0 black-a5 (30%); inset ring gray-a4. This adds a
  bottom inner highlight and a top inner shade.
- **shadow-2.** ring 1px gray-a6 (white 17%); ring 0.5px black-a3; 0 1 1 0 black-a6 (40%); 0 2 1 −1 black-a6; 0 1 3 0 black-a5.
- **shadow-5.** ring gray-a6; 0 12 60 0 black-a5 (30%); 0 12 32 −16 black-a7 (50%).
- **shadow-6.** ring gray-a6; 0 12 60 black-a4; 0 16 64 black-a6; 0 16 36 −20 black-a11 (90%).

In dark, the ring turns into a light edge and the shadow alphas go up 3 to 5 times.

Radix **Classic button** (light): `inset ring 1px gray-a4; inset 0 −2 1 gray-a3` on top, and
`inset 0 4 2 −2 white-a9 (70%); inset 0 2 1 −1 white-a9` on the bottom. A `::after` adds
`inset 0 2 3 −1 white-a4`, with a gradient `black-a1 → transparent → white-a2`. That is a full bevel with a
lower inner shade and a top white highlight. Radix also uses `outline: 2px solid focus-8; outline-offset: 2px` for focus.

### Geist (Vercel), live CSS

| Token | Light | Dark |
|---|---|---|
| border-base | ring 1px #00000014 (8%) | ring 1px #ffffff25 (14.5%) |
| border-inset | inset ring 1px 8% | inset ring 1px white 10% |
| background-border | ring 1px `--ds-background-200` (opaque page colour), listed *after* border-base so it sits beneath it | same |
| 2xs | 0 1 1 4% | 0 1 1 16% |
| xs | 0 1 2 4% | 0 1 2 16% |
| small | 0 2 2 4% | 0 1 2 16% |
| medium | 0 2 2 4%, 0 8 8 −8 4% | 0 2 2 32%, 0 8 8 −8 16% |
| large | 0 2 2 4%, 0 8 16 −4 4% | — |
| tooltip | border-base, 0 1 1 2%, 0 4 8 4%, background-border | — |
| menu | border-base, 0 1 1 2%, 0 4 8 −4 4%, 0 16 24 −8 6%, background-border | — |
| modal | border-base, 0 1 1 2%, 0 8 16 −4 4%, 0 24 32 −8 6%, background-border | — |
| modal-elevated | ring 1px 8%, 0 32 72 −12 6%, 0 8 32 −12 8%, 0 8 24 −12 12% | ring gray-alpha-400 (white 14%) + same shadows |

Geist's material classes are `.material-base` (`shadow-border`, 6px radius), `-small`/`-medium`/`-large`
(border plus shadow, 6/12/12px), `-tooltip` (6px), `-menu` (12px), `-modal` (12px) and `-fullscreen` (16px).
The trick worth noting: the translucent 8% ring is stacked over an opaque 1px ring in the page background
colour. The edge therefore reads the same over any content behind the element, which a lone translucent ring does not.
The light shadows are tiny (2–6% per layer, with negative spreads). Dark multiplies the alphas by 4–8.

### Primer 11.10.0

| Token | Light | Dark | Light HC | Dark HC |
|---|---|---|---|---|
| shadow-inset | inset 0 1 0 0 #1f2328 4% | inset 0 1 0 0 #010409 24% | same as light | same as dark |
| resting-xsmall | 0 1 1 0 #1f2328 5% | 0 1 1 0 #010409 80% | 0 1 1 0 #010409 5% | dark |
| resting-small (buttons, interactive) | 0 1 1 0 4%, 0 1 2 0 3% | 0 1 1 0 60%, 0 1 3 0 60% | ≈ light | dark |
| resting-medium (cards) | 0 1 1 0 #25292e 10%, 0 3 6 0 12% | 0 1 1 0 40%, 0 3 6 0 80% | light | dark |
| floating-small (dropdowns, tooltips) | ring 1px #d1d9e0 **25%**, 0 6 12 −3 4%, 0 6 18 0 12% | ring 1px #3d444d (opaque), 0 6 12 −3 40%, 0 6 18 0 40% | ring #454c54 25% | ring #b7bdc8 |
| floating-medium (popovers, menus) | ring #d1d9e0 **0%**, 0 8 16 −4 8%, 0 4 32 −4 8%, 0 24 48 −12 8%, 0 48 96 −24 8% | ring #3d444d; same geometry at 40% | ring #454c54 (opaque) | ring #b7bdc8 |
| floating-large (dialogs) | ring 0%, 0 40 80 0 24% | ring #3d444d, 0 24 48 0 #010409 (100%) | ring #454c54 | ring #b7bdc8 |
| floating-xlarge (sheets) | ring 0%, 0 56 112 0 32% | ring, 0 32 64 0 100% | ring #454c54 | ring #b7bdc8 |
| button-default-shadow-resting (lip) | 0 1 0 0 #1f2328 4% | none | 0 1 0 0 #010409 4% | none |
| button-primary-shadow-selected | inset 0 1 0 0 #002d11 30% | none | inset 0 1 0 0 #00230b 30% | — |

Primer always keeps a ring slot (`0 0 0 1px`) in floating shadows, even at 0% alpha in light. That keeps the
layer count stable, so the HC themes and dark mode can switch the ring on by changing a colour.

### Tailwind v4.3.3 `theme.css`

| Token | Value |
|---|---|
| shadow-2xs | 0 1px 0 5% (lip) |
| shadow-xs | 0 1 2 0 5% |
| shadow-sm | 0 1 3 0 10%, 0 1 2 −1 10% |
| shadow-md | 0 4 6 −1 10%, 0 2 4 −2 10% |
| shadow-lg | 0 10 15 −3 10%, 0 4 6 −4 10% |
| shadow-xl | 0 20 25 −5 10%, 0 8 10 −6 10% |
| shadow-2xl | 0 25 50 −12 25% |
| inset-shadow-2xs / xs / sm | inset 0 1 5% / inset 0 1 1 5% / inset 0 2 4 5% |
| ring / ring-N | `0 0 0 1px` (default is now 1px; it was 3px in v3) / `0 0 0 Npx`, colour `--tw-ring-color` (defaults to currentColor) |
| inset-ring / inset-ring-N | `inset 0 0 0 1px` / `Npx` |

The composed `box-shadow` is fixed, in this order: `var(--tw-inset-shadow), var(--tw-inset-ring-shadow),
var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)` (from `dist/lib.js`). Every layer of a
`shadow-*` value is rewritten to `var(--tw-shadow-color, <original>)`. An opacity modifier (`shadow-lg/20`)
sets `--tw-shadow-alpha` and replaces each layer's alpha. Colour and alpha are therefore separable from geometry.

### shadcn/ui new-york-v4

| Component | Classes (shadow and stroke) | Resolved |
|---|---|---|
| Card | `rounded-xl border shadow-sm` | 1px `--border` oklch(0.922 0 0) + `0 1 3 0 10%, 0 1 2 −1 10%` |
| Input, Select trigger | `border border-input shadow-xs`; focus `border-ring ring-[3px] ring-ring/50` | 1px `--input` (= border) + `0 1 2 0 5%`; focus ring 3px at 50% of oklch(0.708 0 0) |
| Button outline | `border bg-background shadow-xs hover:bg-accent` | border + 0 1 2 5%; hover changes only the background |
| Popover, DropdownMenu, Select content | `rounded-md border shadow-md` | border + `0 4 6 −1 10%, 0 2 4 −2 10%` |
| Submenu, Dialog | `border shadow-lg` | border + `0 10 15 −3 10%, 0 4 6 −4 10%` |
| Tabs active | `data-[state=active]:shadow-sm`; dark uses `border-input` instead | — |
| Dark tokens | `--border: oklch(1 0 0 / 10%)`, `--input: oklch(1 0 0 / 15%)` | Light strokes are opaque grey; dark strokes are translucent white |

### Polaris tokens 9.4.2 (`:root, .p-theme-light`)

| Token | Value |
|---|---|
| shadow-100 | 0 1 0 0 rgba(26,26,26,.07) (lip) |
| shadow-200 | 0 3 1 −1 7% |
| shadow-300 | 0 4 6 −2 20% |
| shadow-400 | 0 8 16 −4 22% |
| shadow-500 | 0 12 20 −8 24% |
| shadow-600 | 0 20 20 −8 28% |
| shadow-bevel-100 (Card via ShadowBevel) | inset 1 0 0 0 black 13% (left), inset −1 0 0 0 13% (right), inset 0 −1 0 0 17% (bottom), inset 0 1 0 0 rgba(204,204,204,.5) (top). An "inside stroke" whose sides vary in tone. |
| shadow-border-inset | inset ring 1px 8% |
| shadow-button | inset 0 −1 0 0 #b5b5b5 (bottom inner lip), inset ring 1px 10%, inset 0 0.5 0 1.5 #FFF (top highlight) |
| shadow-button-hover | inset 0 1 #EBEBEB, inset ±1 0 #EBEBEB, inset 0 −1 #CCC |
| shadow-button-inset (pressed) | inset −1 0 1 0 12%, inset 1 0 1 0 12%, inset 0 2 1 0 20% |
| shadow-button-primary | inset 0 −1 0 1 black 80%, inset ring 1px #303030, inset 0 0.5 0 1.5 white 25% |
| shadow-inset-100 / -200 | inset 0 1 2 15%, inset 0 1 1 15% / inset 0 2 1 20%, inset ±1 0 1 12% |
| dark-experimental bevel-100 | sides and bottom rgba(204,204,204,.08); top .16. In dark the edges turn into light lines. |
| light-mobile theme | shadow-100 and bevel-100 are `none`; buttons become a flat inset ring 1px `--p-color-border` |
| border widths | `0165` = 0.04125rem = **0.66px**, `025` 1px, `050` 2px, `100` 4px |

### Atlassian @atlaskit/tokens 20.6.1

| Token | Light | Dark | Light increased contrast | Dark increased contrast |
|---|---|---|---|---|
| shadow.raised (cards) | 0 1 1 #1E1F21 25%, 0 0 1 #1E1F21 31% | ring 1px transparent, 0 1 1 #010404 50%, 0 0 1 50% | inset ring 1px #1E1F21 50% (raw token also lists 0 0 1 31%) | inset ring 1px #E9F0FB 50% |
| shadow.overlay (menus, modals, dragged cards) | 0 8 12 15%, 0 0 1 31% | ring 1px #BDBDBD 12%, 0 8 12 36%, 0 0 1 1 50% | inset ring 1px 50% | inset ring 1px white-blue 50% |
| shadow.overflow (scroll edge) | 0 0 8 16%, 0 0 1 12% | 0 0 12 56%, 0 0 1 50% | 0 0 8 16% (the perimeter layer is dropped) | 0 0 12 56% |
| border | #0B120E 14% | #E3E4F2 12% | #E9F0FB 36% (as published; looks like a source mapping error, `DarkNeutral500A` in a light theme) | same |
| border.input | #8C8F97 | #7E8188 | #505258 | #A9ABAF |

Atlassian's token schema stores each shadow as a list of `{offset {x, y}, radius, spread, color, opacity, inset}`.
Colour and opacity are separate fields.

### Material 3 (material-web)

Two pseudo-elements: the key layer (`::before`, `opacity: 0.3`) and the ambient layer (`::after`, `opacity: 0.15`).
Both use `--md-sys-color-shadow` (black). The geometry is computed from `--_level` with `clamp()`.

| Level | Key (y blur spread) @30% | Ambient (y blur spread) @15% |
|---|---|---|
| 0 | 0 0 0 | 0 0 0 |
| 1 | 1 2 0 | 1 3 1 |
| 2 | 1 2 0 | 2 6 2 |
| 3 | 1 3 0 | 4 8 3 |
| 4 | 2 3 0 | 6 10 4 |
| 5 | 4 4 0 | 8 12 6 |

M3 key/ambient is the inverse of Fluent: the *ambient* layer carries the offset and positive spread, and the
key layer stays tight. Tonal elevation now uses surface-container roles instead of a tint overlay. Neutral tones,
light/dark, per contrast level (normal / medium / high):

| Role | Light | Dark |
|---|---|---|
| lowest | 100 | 4 / 2 / 0 |
| low | 96 / 96 / 95 | 10 / 11 / 12 |
| container | 94 / 92 / 90 | 12 / 16 / 20 |
| high | 92 / 88 / 85 | 17 / 21 / 25 |
| highest | 90 / 84 / 80 | 22 / 26 / 30 |

### Fluent 2

- **Web.** `shadowN` is `0 0 2 ambient, 0 N/2 N key` (ambient becomes `0 0 8` at 28/64). Light key/ambient
  are 14%/12%; dark are 28%/24%. Surfaces (MenuPopover, PopoverSurface, DialogSurface) get
  `border: 1px solid colorTransparentStroke`, which is transparent normally and CanvasText in high contrast. Card
  draws its border on `::after` so a preview image can sit under it.
- **WinUI 3 (Windows 11 native).** Controls have no drop shadow at rest. They get a gradient border
  (`ControlElevationBorderBrush`, absolute 0→3px).
  - Light: the brush is flipped (`ScaleY=-1`), so the bottom ~1px is `ControlStrokeColorSecondary` #29000000
    (16%) and the rest is `ControlStrokeColorDefault` #0F000000 (6%). That is a darker bottom lip.
  - Dark: not flipped, so the *top* ~1px is #18FFFFFF (9.4%) and the rest #12FFFFFF (7%). That is a top inner highlight.
  - Accent buttons: `ControlStrokeColorOnAccentSecondary` is #66000000 (40%) in light and #23000000 in dark, at
    the bottom, over #14FFFFFF.
  - Flyouts: `SurfaceStrokeColorFlyout` is #0F000000 in light and #33000000 in dark. Cards: `CardStrokeColorDefault`
    is #0F000000 in light and #19000000 in dark.

### Linear (linear.app marketing CSS)

| Token | Light | Dark |
|---|---|---|
| shadow-tiny | 0 1 1 0 9% | — |
| shadow-low | 0 1 4 −1 9% | 0 2 4 10% |
| shadow-medium | 0 3 12 9% | 0 4 24 20% |
| shadow-high | 0 7 24 6% | 0 7 32 35% |
| shadow-stack-low | inset 0 −1 1 0 11% (bottom inner shade), 0 8 2 0 0%, 0 5 2 0 1%, 0 3 2 0 4%, 0 1 1 0 7%, 0 0 1 0 8% | the same stack without the inset layer |
| borders | primary #e9e8ea, secondary #e4e2e4, tertiary #dcdbdd, translucent 5%, translucent-strong 8% | primary #23252a, secondary #34343a, tertiary #3e3e44, translucent white 5% / 8% |

The `:root` default sets every shadow to `none`; themes switch them on. The product app's tokens are not public.

### Stripe (stripe.com `--hds-*`)

Each tier is two layers (top = large and soft, bottom = tight), and **every layer field is its own variable**
(`--hds-shadow-md-top-offset-x/-offset-y/-blur/-spread` and `--hds-color-shadow-md-top`). The colours are
tinted blue rather than black:

| Tier | Top layer | Bottom layer |
|---|---|---|
| xs | 0 2 10 0 rgba(0,55,112,.06) | 0 1 4 0 rgba(0,59,137,.04) |
| sm | 0 5 14 0 .08 | 0 2 8 0 .05 |
| md | 0 6 22 0 .10 | 0 4 8 0 .02 |
| lg | 0 15 40 −2 .10 | 0 5 20 −2 .04 |
| xl | 0 20 80 −16 .14 | 0 10 60 −16 .06 |

### Raycast, Resend, Clerk

- **Raycast** (raycast.com, dark-first) has no shadow tokens. Its most frequent `box-shadow` is the inner top
  highlight `inset 0 1px #ffffff1a` (17 uses). Controls use `inset 0 1px #ffffff0d, 0 0 0 1px #ffffff40–80,
  inset 0 −1px #0003`: top highlight, outer light ring, bottom inner shade.
- **Resend** has Tailwind defaults plus `--shadow-button: 0 0 4 #ffffff0f, 0 1 14 #ffffff1f, 0 3 32 #ffffff2e`,
  a white glow on dark.
- **Clerk** (`createShadowSet(shadowColor = '#000')`). The single colour input is `--clerk-color-shadow`, and the alphas are fixed:
  - button: inset 0 1 1 0 white 7%, 0 2 3 0 20%, 0 1 1 0 24%
  - outlineButton: 0 2 3 −1 8%, 0 1 0 0 2%
  - card and menu: 0 5 15 0 8%, 0 15 35 −5 20%
  - cardContent: 0 0 2 0 8%, 0 1 2 0 6%
  - actionCard: 0 1 4 0 12%, 0 4 8 0 12%
  - switch: 0 2 2 −1 6%, ring 1px 6%, 0 4 4 −2 6%
  - segmented: 0 1 2 0 8%
  - badge: 0 2 0 −1 4%
  - focus ring: 0 0 0 4px
  - Border widths are 1px and 2px.

### Ant Design (@13d7b16)

| Token | Value |
|---|---|
| boxShadow / boxShadowSecondary | 0 6 16 0 8%, 0 3 6 −4 12%, 0 9 28 8 5% |
| boxShadowTertiary | 0 1 2 0 5%, 0 1 6 −1 3%, 0 2 4 0 3% |
| boxShadowCard (hoverable Card on hover) | 0 1 2 −2 16%, 0 3 6 0 12%, 0 5 12 4 9% |

### Apple

- **No published shadow numbers.** A capture with `area-capture.js` is not possible because the
  menus, popovers and windows are native. The APIs show which parameters Apple exposes:
  - CALayer: `shadowColor` (opaque black), `shadowOpacity` (default **0**), `shadowRadius` (default 3), `shadowOffset` (default (0, −3)), `shadowPath`.
  - NSShadow: `shadowOffset`, `shadowBlurRadius`, `shadowColor`.
  - SwiftUI: `.shadow(color:radius:x:y:)`. The default colour is "a semi-transparent black". There is no spread anywhere.
- **NSColor, read locally on macOS 27.2.**
  - Aqua: `separatorColor` rgba(0,0,0,.10), `gridColor` #E6E6E6, `quaternaryLabelColor` 9.8%, `quaternarySystemFill` 2.7%.
  - DarkAqua: `separatorColor` white 12%, `gridColor` #1A1A1A.
  - The accessibility high-contrast appearances returned identical values. They probably resolve only with the
    system setting on, so this is unverified.
- **Hairline.** UIKit: 1 point = `UIScreen.scale` pixels (2 or 3), so a hairline is `1 / scale` pt.
  SwiftUI exposes `EnvironmentValues.pixelLength`.
- **The 0.5px border on menus and popovers** in macOS 11+ is commonly observed (one device pixel on Retina).
  Apple has not published it, so it needs a pixel capture.

---

## 2. Shadows and strokes under increased contrast

| System | Shadows | Strokes |
|---|---|---|
| **CSS forced colours** (Windows contrast themes) | `box-shadow` and `text-shadow` compute to **none**; `background-image` without `url()` becomes none | `border-color` and `outline-color` are forced to system colours (alpha kept on backgrounds only). Transparent borders become visible. |
| **Fluent 2 web** HC theme | Tokens unchanged, but forced colours drop them | `colorTransparentStroke`, `colorNeutralStroke1` and `colorNeutralStrokeAccessible` → `CanvasText`. Surfaces carry `1px solid colorTransparentStroke` so that an edge appears when the shadow vanishes. Button focus uses `borderColor: ButtonText` under `forced-colors: active`. |
| **WinUI 3** HighContrast dictionary | — | Gradient elevation borders become a solid `SystemColorWindowTextColor` |
| **macOS Increase Contrast** | Not documented | Apple: "Increase the contrast of items on the screen (such as borders around buttons or boxes)". It draws borders on every button and delimits window areas. The separate "Reduce transparency" makes materials solid. "Show toolbar button shapes" adds a subtle border to toolbar buttons only. The web hook is `prefers-contrast: more`. |
| **Primer HC** | Shadows identical to the base theme | `borderColor-muted` and `-emphasis` collapse into `borderColor-default`, which darkens: #d1d9e0 → #454c54 in light, #3d444d → #b7bdc8 in dark. The overlay ring becomes opaque `borderColor-default`; floating-small keeps 25%. |
| **Atlassian increased contrast** | `shadow.raised` and `shadow.overlay` **replaced** by an inset 1px ring at 50%. The overflow shadow loses its perimeter layer. | `border.input` / `border.bold` darken (#8C8F97 → #505258 in light; #7E8188 → #A9ABAF in dark). The mode is set with `data-contrast-mode="more"`. |
| **Material 3** medium / high | Shadow unchanged (black, 30% / 15%) | `outline` is solved against the highest surface for contrast 1.5 / 3 / 4.5 / 7 (low / normal / medium / high). `outline-variant` uses 1 / 1 / 3 / 4.5. Surface containers move further apart (light `container` 94 → 92 → 90; dark `highest` 22 → 26 → 30), which strengthens tonal elevation. |
| **Polaris light-high-contrast (experimental)** | bevel-100 *adds* an outer lip `0 1 0 0 7%` | Bevel sides go to #CCC, bottom #999, top inner rgba(208,208,208,.4); `color-border` 227 → 138 grey |
| **Radix** | No contrast mode; a `highContrast` prop changes accent colours only | — |
| **Geist, Linear** | No `prefers-contrast` rules in the fetched CSS (Geist has 3 `forced-colors` rules) | — |

Patterns:

- Shadows are never strengthened for contrast.
- Systems either keep shadows and darken the strokes (Primer, M3, Polaris), or replace the shadow with a
  solid or 50% 1px ring (Atlassian, Windows forced colours, Fluent's transparent-border fallback).
- Muted and emphasis stroke tiers collapse into one darker tier (Primer).
- No system thickens the default stroke from 1px to 2px for contrast. Thickness changes are reserved for focus,
  selection and Windows HC focus visuals.

---

## 3. Stroke width and colour practice

| System | Widths | Default stroke colour | Light model | Dark model | Inside or outside |
|---|---|---|---|---|---|
| Apple | hairline = 1/scale pt (0.5pt @2x, 0.333pt @3x); `pixelLength` | separator black 10% | translucent black | translucent white 12% | n/a (native) |
| Polaris | **0.66px**, 1, 2, 4 | rgb(227) opaque; bevel 13–17% black | opaque and translucent | light lines 8–16% | inset shadows (bevel), so the stroke is inside and costs no layout |
| Radix | 1px ring plus an extra **0.5px** black-a1 ring (shadow-2) | gray-a3..a7 with 25% opaque grey mixed in | translucent, slightly opaque | white-a6 | outer ring (`0 0 0 1px`) for cards and floats, inset ring for fields |
| Geist | 1px | 8% black over an opaque background ring | translucent | white 14.5% | outer ring (shadow); `border-inset` for inside |
| Primer | 1, 2 (`thick`), 4 (`thicker`); `boxShadow-thin` = inset ring "to prevent layout shift" | #d1d9e0 (blue-tinted grey, opaque); muted 70% | opaque tinted | #3d444d opaque | `border` for controls; outer ring inside floating shadows |
| Fluent | 1, 2, 3, 4 | Stroke1 opaque grey; Card on `::after` | opaque | opaque | border or `::after` overlay; focus is an inset ring |
| WinUI | 1px gradient | 6% black plus a 16% bottom lip | translucent | 7% white plus a 9.4% top highlight | border (drawn inside) |
| shadcn | 1px; focus 3px ring at 50% | oklch(0.922 0 0) | opaque grey | white 10% (input 15%) | `border` (inside the box) plus an outer ring for focus |
| Tailwind | `ring` 1px default (3px in v3) | currentColor | — | — | ring = outer `box-shadow`, inset-ring = inner |
| Atlassian | 1px | #0B120E 14% (tinted) | translucent tinted | translucent | border; IC uses an inset ring |
| Linear | 1px | opaque #e9e8ea plus translucent 5%/8% | both | opaque plus white 5%/8% | border |
| Clerk | 1px, 2px | — | — | — | border; switch uses a 1px ring at 6% |

Notes:

- **CSS snapping.** `border-width` is rounded with "snap a length as a line width": a value between 0 and 1
  device pixel rounds *up* to 1 device pixel, and anything larger floors to whole device pixels. So 0.5px gives
  one device pixel on 2× and a full 1px on 1×. `box-shadow` spread is not snapped, so a 0.5px ring is
  antialiased (half-alpha) on 1× screens. Radix and Polaris rely on that.
- **Inside vs outside.**
  - `border` takes layout space and sits inside the box (`box-sizing: border-box`).
  - `box-shadow: inset 0 0 0 1px` draws inside with no layout cost, but it paints under the content.
  - `box-shadow: 0 0 0 1px` draws outside with no layout cost and follows the radius.
  - `outline` draws outside, does not follow the radius in old browsers, and is kept in forced colours.
  - `::after` with `inset: 0` draws over the content (Fluent Card).

---

## 4. Shadow editors and generators: parameters and formulas

| Tool | Exposed parameters | How one number becomes several layers |
|---|---|---|
| **Figma** effects | Drop shadow: X, Y, Blur (`radius`), Spread (rect, ellipse and clipped frames only), Color + opacity, blend mode, "Show behind transparent areas" (`showShadowBehindNode`). Inner shadow: the same without show-behind; positive spread *contracts*. Effects stack in a list. UI default 0 4 4 0 #000 25% (observed). Strokes: weight (per side), position Inside / Center / Outside. | none; layers are manual |
| **Framer** | `ControlType.BoxShadow`, a CSS string (example `0px 1px 2px 0px rgba(0,0,0,0.25)`); `ControlType.Border` with `borderWidth` or per side, `borderStyle` (solid / dashed / dotted / double), `borderColor` | none |
| **Atlassian tokens** | per layer `{x, y, radius, spread, color, opacity, inset}` | none |
| **Stripe hds** | per layer CSS variables for offset-x, offset-y, blur, spread, colour (2 layers per tier) | none |
| **Clerk** | one `colorShadow`; alphas fixed per role | none |
| **Tailwind** | geometry token, colour (`--tw-shadow-color`), alpha (`/N`) | none |
| **Tobias Ahlin** | layer count | Offsets and blurs double per layer (1, 2, 4, 8, 16) with offset = blur. Alpha is either uniform (0.12 × 5; 0.15 × 4; 0.11 × 6), decreasing ("sharp": 0.25 → 0.05) or increasing ("diffuse": 0.08 → 0.20). Lower the per-layer alpha as layers are added to keep the strength. |
| **Josh Comeau, "Designing beautiful shadows"** | elevation, light source, shadow colour | One light source for the page (above, slightly left). The x:y ratio is constant (1:2). As elevation rises, offset and blur grow and opacity *falls*. Shadow colour is `hsl(var(--shadow-color) / a)`, using the background hue with less saturation and lightness (background hsl(220 100% 80%) → shadow hsl(220 60% 50%)). Example five-layer stack: 1, 2, 4, 8, 16px, all at 0.075. |
| **Josh Comeau, Shadow Palette** | Oomph (0.5), Crispy (0.5), Resolution (0.75), Light position, Background colour, Tint shadow. Outputs low, medium and high. | Example (medium, 4 layers, equal alpha .36): `0.3 0.5 0.7`, `0.8 1.6 2 −0.8`, `2.1 4.1 5.2 −1.7`, `5 10 12.6 −2.5`. Here x = y/2, blur ≈ 1.26 y, spread grows negative toward −y/4, and the offsets grow roughly geometrically (×2.5). Layer count is set by Resolution and elevation (3 for low, 4 for medium, 8 for high). |
| **supershad** (open-source port of that approach) | xAngleDeg 10, yAngleDeg 30, resolution .5, crispness .5, useSpread, useStroke, baseElevation 200, elevations [.025, .1, .25, 1] | offset = elevation × tan(angle). Layer count steps with distance d: <10 → 2..3, <15 → 2..5, <25 → 3..5, else 3..10, picked by resolution. `maxOpacity = 0.8/(n+1.5)·(0.6+0.4c)`, `minOpacity = max·(1−0.5c)`. `maxBlur = (d+4)·(1−(0.5c−0.25))`. `maxSpread = −0.2·c·d`. Easing: offset bezier(0.5+0.5c, .1, .9, .7); blur and spread bezier(.7,.1,.9,.3). An optional 1px ring at 4% is appended. |
| **shadows.brumm.af** (archived 2024-01-12 build; site offline) | "Layers of shadows" (6, 1–10), "Final transparency" (.07), "Final horizontal / vertical distance" (100 / 100 px, 0–500), "Final blur strength" (80, 0–500), "Reduce spread" (0, −100–0), "Reverse alpha", and three editable bezier curves | For layer k = 1..n, t = k/n. Offset = bezier(.7,.1,.9,.3)(t) × final offset; blur = bezier(.7,.1,.9,.3)(t) × final blur; alpha = bezier(.1,.5,.9,.5)(t) × final alpha (reversed if inverted); spread is the same on every layer. |
| **smoothshadows.com** (live `app.js`) | Style Soft / Sharp / Linear, Opacity (.01–1, default .08), Blur (0–512, 24), Layered shadows (1–10, 5), Vertical distance (−512–512, 32), Horizontal distance (0), shadow / background / box colours (shadow rgb(3,7,18)) | t = ((i+1)/n)²; x, y and blur = t × final. Alpha: soft = (i+1)·A/n (grows), sharp = A − i·A/n (falls), linear = A. Presets are blur = distance = 4, 8, 16, 32 at .1 (tilted: x = y/2); large is 80/80/40 at .2. Default output: `0 1 1 .02, 0 5 4 .03, 0 12 9 .05, 0 20 15 .06, 0 32 24 .08`. |

Common structure across the generators:

1. One final layer (offset, blur, alpha) defines the shadow.
2. N layers interpolate from about 0 to that final layer.
3. Interpolation is ease-in (quadratic or bezier), so small layers bunch near the edge, which gives crispness, and the large ones carry the softness.
4. Alpha is split across layers: uniform, rising or falling.
5. Spread is negative and grows with distance, so the big layers do not show at the sides.
6. One light direction sets x:y.
7. The colour is a tint of the background, not black.

Material's and Fluent's formulas are the two-layer special case.

---

## 5. Rest vs hover (and pressed)

| System / component | Rest | Hover | Pressed |
|---|---|---|---|
| M3 elevated card / elevated button | L1 | L2 | L1 |
| M3 filled card, outlined card, filled button | L0 | L1 | L0 (dragged L3) |
| M3 FAB | L3 | L4 | L3 (lowered FAB: 1 → 2) |
| M3 menu / dialog | L2 / L3 | — | — |
| Fluent 2 Card filled | shadow4 | shadow8, background → Hover | background → Pressed |
| Fluent 2 Card outline | stroke1 | stroke1Hover | stroke1Pressed |
| Radix Classic Card | ≈ shadow-2 (ring gray-a3, 0 1 3) | ring gray-a4 mix; 0 1 1 1 5%, 0 2 1 −1 6%, 0 2 3 −2 5%, 0 3 12 −4 6%, 0 4 16 −8 5%. Bigger blurs and offsets, alpha about the same. Implemented as same-length lists with an inner/outer split so the transition interpolates. | gray-a4 lip layer (0 1 1 0 gray-a4) |
| Radix Surface Card | ring 1px gray-a5 | ring gray-a7 (the stroke darkens; no shadow) | gray-a6 |
| Radix Classic button | bevel (inset highlight + inner shade) | `::after` background → accent-10, gradient stronger | flat gradient |
| Ant Design hoverable Card | 1px border | border transparent + boxShadowCard (stroke swapped for shadow) | — |
| Polaris button | shadow-button (inset ring, bottom lip, top white) | shadow-button-hover (tones shift) | shadow-button-inset (top inner shade; pressed in) |
| Primer button | border + lip 0 1 0 4% | background and border colour only | background only |
| shadcn outline button / card | shadow-xs / shadow-sm | background only / none | — |
| Geist | material classes are static | — | — |

- **Translate on hover.** No surveyed design-system component translates on hover. Lift is expressed with
  shadow and background, and `translateY(-1..-2px)` is a marketing-site pattern.
- **Interpolation.** Lists should keep the same layer count across states so `box-shadow` interpolates (Radix
  notes this), or the hover shadow sits on a pseudo-element whose opacity is animated (Tobias Ahlin, "How to
  animate box-shadow with silky smooth performance").
- **What grows on hover.** Offset and blur grow (M3 L1 → L2 ambient 1/3/1 → 2/6/2; Fluent 2/4 → 4/8). Alpha
  per layer stays constant (M3, Fluent) or rises slightly (Radix).

---

## Implications for Area (observations, not decisions)

1. The common recipe is a **layer list with roles**: a ring (edge), an optional lip (hard 0 1 0), an optional
   inner highlight (inset 0 1 0 white) or inner shade, and 1 to N soft layers. Primer, Geist, Radix, Raycast and
   Polaris all mix these roles in one `box-shadow`.
2. **Keep a ring slot in every recipe.** Set it to 0% when off, as Primer does, so the Contrast and Surface axes can switch it on
   without changing layer counts. That is also what lets hover transitions interpolate.
3. **Geometry, colour and alpha are separable** (Tailwind's colour/alpha variables, Stripe's per-field variables,
   Atlassian's `{x, y, radius, spread, color, opacity, inset}`). A generator-style control would be: distance (final
   y), blur ratio, spread ratio (negative), layer count, alpha, alpha distribution (soft / sharp / uniform), light
   angle (x:y), tint. This matches smoothshadows.com and brumm.
4. **Contrast precedent:** keep shadows and darken or opacify the ring (Primer, M3), or replace the shadow with a
   50% inset ring (Atlassian). Forced colours removes all shadows, so every floating surface needs a real (transparent) border to fall back on (Fluent).
5. **Dark mode:** rings flip to light (white 7–17%), shadow alphas rise 3 to 8 times, lips become top highlights
   (WinUI, Polaris dark, Raycast).
