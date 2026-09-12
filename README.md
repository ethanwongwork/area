# Area

A design system you tune along eight axes.

```
npm install
npm run build
npm run dev -w @area/docs     # http://localhost:4321
```

## What it is

Area is built around **axes** — independent dimensions you retune with a single data
attribute:

```html
<html data-area-theme="dark" data-area-accent="violet" data-area-density="compact">
```

| Axis | Presets | Owns |
|---|---|---|
| `theme` | light, dark | every scale's ramp, the fixed tones, shadow colour |
| `neutral` | gray, slate, sand | the grey the interface is built from |
| `accent` | 12 hues | fills, links, focus ring |
| `type` | geist, geist-compact, geist-large, system | families and the size/leading/tracking ramp |
| `density` | compact, default, comfortable, spacious | control heights, gutters, icons, gaps |
| `radius` | sharp, subtle, default, rounded, soft, pill | corner geometry |
| `surface` | flat, outlined, raised, elevated | stroke weight and elevation |
| `motion` | none, subtle, expressive | durations and easings |

Components consume only semantic tokens, so changing an axis reflows the whole system
without touching a single component. Because custom properties inherit, a subtree can
carry its own axis values — `<aside data-area-density="compact">` gets shorter controls
*and* correctly re-derived corner radii.

## Defaults

Not taste. Measured from shipped code:

| | Area | Primer | OpenAI | Vercel | shadcn | Notion |
|---|---|---|---|---|---|---|
| Control height | **32** | 32 | 32 | 40 | 36 | 28–32 |
| Control radius | **6** | 6 | 6–8 | 6 | 8 | 6 |
| Container radius | **12** | 12 | 12 | 8–12 | 10–14 | 10 |
| Control text | **14/20** | 14/21 | 14/20 | 14/20 | 14/20 | 14/16.8 |
| Inline icon | **16** | 16 | 18 | — | 16 | 20 |
| Spacing base | **4** | 4 | 4 | 4 | 4 | 2 |

## Packages

- **`@area/tokens`** — the OKLCH scale generator, the axis registry, and the CSS emitter.
  Twelve steps per scale with a fixed role per step, peak chroma placed at each hue's own
  gamut cusp, hue drift calibrated against measured palettes, and gamut mapping per
  CSS Color 4 §14.
- **`@area/styles`** — component CSS. Framework-agnostic; works without React.
- **`@area/react`** — React components. Contains no CSS, by construction.
- **`apps/docs`** — the documentation site.

## Guarantees

- **The colour maths is proven, not assumed.** OKLab conversions are checked against
  `colorjs.io` to 1e-12 across 25,704 samples per gamut, and the gamut mapper matches the
  CSS Color 4 reference to a fifth of a JND.
- **Contrast is a build gate.** ~124 assertions across 72 theme combinations, under WCAG
  2.2 always and APCA as a hard gate in dark themes — because the WCAG 2.x formula
  overstates contrast near black.
- **The CSS and the React API cannot drift.** Both are generated from one manifest per
  component, checked in both directions.
- **The documentation cannot lie.** Every preview is the real component rendered; every
  snippet is that demo's own source.

See [CLAUDE.md](CLAUDE.md) for the working conventions.
