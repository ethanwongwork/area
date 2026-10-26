# Brand palette: build plan (2026-10-26)

The owner's picks on the review page ([Area Brand Palette](https://claude.ai/artifact/XtMRqfuwvyT6BMKnba7quU), read
2026-10-26, no notes):

| Decision | Pick |
|---|---|
| How a brand colour is entered | An exact colour, its hue, chroma and lightness shown and editable |
| How many brand colours | Up to three: primary, secondary, tertiary |
| Which shade the buttons use | The readable shade nearest the brand |
| Status colours | Harmonised with the brand |
| Greys | Leaning slightly toward the brand hue |
| Supporting palette | Eight colours, a light and a deep tone each |
| Brand surfaces | A tinted page and a deep brand ground |

Ground rule (owner): Area's palette stays the default. With no brand set, every token, every pixel and every contrast
result is what ships today; brand generation is an opt-in layer.

## The shape of the change

Today every colour is a preset computed at build time (eleven families, 72 hues × 8 strengths × 14 shades, emitted as
CSS). An exact brand colour is any of 16 million, so its family and roles cannot be presets. The solver has to run where
the brand is chosen:

- **Runtime**, in the app and in any React product: `@area/tokens/brand` exports `brandTokens(brand, theme)`, the
  solver, the palette and the contrast functions (the palette is 52 KB; the solver is pure functions). The React `Theme`
  takes a `brand` prop and paints the scope with the result.
- **Build time**, for CSS-only products: `area-tokens brand --primary #00b65c --secondary … > brand.css` writes the same
  tokens as a `[data-area-brand]` scope.

Both run the same code, so the contrast guarantee holds for any colour: the solver only ever picks shades that clear
their label's contract, and the gate samples brands to prove it (phase 1).

## Phases

Each phase ends green (`npm run build`, `npm test`, the contrast report, the React suites) and is checked in the app,
light and dark. Phases 1 and 2 change nothing visible; the owner reviews after 3, 4 and 5.

### 1. The engine (`packages/tokens`) — done 2026-10-26

Built as planned, with three findings:
- Roles were kept out of the shared role list: the accent's indicator is chosen against every role's tints, so adding
  roles there would have moved today's indicator. `resolveWithRoles` swaps role scales in; with none, `resolveTheme` is
  unchanged (proved token for token, and in the app: 571,054 computed values, light and dark, identical).
- A near-grey brand colour (#B2A99D) cannot reach the tinted outline's chroma minimum: `semantic/stroke.ts` now keeps the
  contrast floor and drops the chroma minimum only when the ink cannot supply it (the palette's inks never reach this).
- Supporting tones at fixed rungs failed APCA in dark (black on 300 measured Lc 49): each tone now moves toward its
  label's side until it clears 4.5:1 and Lc 60.
- A brand resolves in about 40ms per mode: fine for a setting, above a 16ms drag frame (phase 2 measures and memoises).

- `color/brand.ts`, from the prototype (`generate.ts`):
  - `brandFamily(hex)`: an exact colour on Area's ladder: its hue's generated family, the nearest rung moved onto it,
    the lightness offset tapering to the ends, chroma at the brand's character.
  - `harmonisedFamily(role, brand)`: a status family turned toward the primary by half the hue difference, at most 15°,
    at the primary's character, never below 45% of the palette's.
  - `supportingPalette(brand, 8)`: hues stepped from the primary, at its character; light (200) and deep (700) tones,
    each with the label that reads on it.
  - `brandSurfaces(family)`: the family's 25 and 50 (page tint) and 900 and 950 (deep ground), with their inks.
- `buildScale(spec, theme, family?)`: takes a family object, so brand families never enter `palette.json` or the shared
  scale cache.
- **Nearest readable shade** as the brand's Auto: the Shade step that looks most like the brand colour (OKLab ΔE) among
  those that land on themselves, label flipping as Shade does (2026-10-25). Shade and Saturation keep working over it.
- `resolveBrandTheme({ theme, brand, …settings })`: today's `resolveTheme` with the accent role on the primary family,
  the status roles harmonised, and the new roles below. With no brand it must return today's tokens exactly.
- **New roles and tokens** (`semantic/aliases.ts`; every one also defined with no brand, from Area's palette):
  - `secondary-*` and `tertiary-*`: the accent's tonal block (solid, hover, surface, ink, stroke, indicator, label).
    With no brand: unset roles fall back to the accent, so nothing changes.
  - `support-1-light` … `support-8-deep` with their `fg-on-support-*`. With no brand: eight of the palette's own
    families at 200 and 700 (red, orange, yellow, green, teal, blue, purple, pink).
  - `bg-brand-page`, `bg-brand-ground`, `fg-on-brand-ground`, with no brand the page and the inverse ground.
- **Gate** (`contrast/brand.test.ts`): every assertion, light and dark, on the four reference brands and a seeded sample
  of 500 brand colours spread over hue, chroma and lightness (all three slots, each with Shade and Saturation at their
  ends). Plus an equivalence test: `resolveBrandTheme` with no brand equals `resolveTheme`, token for token.

### 2. Runtime and CSS output — done 2026-10-26

Built as planned. `semantic/inputs.ts` holds the accent and tone inputs for both the axes and a brand (the refactor left
every token output byte-identical); `emit/brand.ts` writes a brand's inputs and literals, and `emit/brand-derived.ts`
works out at build time the 374 derivations a brand restates (Tint hue's Accent value reads the accent, so the Layers
model is among them). In the app, a brand's CSS painted all 21 compared tokens exactly as the resolver computes them, in
light and dark, at the defaults and at Saturation 30 with Shade 750. Measured: `brand.js` 205.7 kB minified, 29.8 kB
gzipped; import 3ms; a new brand about 60ms (the first about 170ms), cached after; about 600 declarations (155 kB).
React's `Theme` takes the declarations, not the colours, so a product without a brand pays nothing. Phase 3 should apply a
dragged colour on release or rest, as the Inspector's bars do.

- Export `@area/tokens/brand` (the solver and palette; a size budget in the build).
- `emitBrandCss(brand)` and the `area-tokens brand` command: a `[data-area-brand="…"]` block of the role tokens, light
  and dark as `light-dark()` pairs as today, so Shade, Saturation, Label tint and Contrast keep deriving in CSS.
- React: `Theme brand={{ primary, secondary?, tertiary? }}` computes the tokens once per brand (memoised) and writes them
  as the scope's custom properties; `useTheme()` reports the brand.
- Re-derivation (`emit/rederive.ts`): the brand's tokens are inputs set outside the axes, so they join `OVERRIDABLE`.
- Measure: generation time per brand (target well under 16ms, so a picker drag stays smooth) and the bundle cost.

### 3. The setting and its controls (`apps/desktop`) — done 2026-10-26

Built as planned, with these findings and departures:

- **Where.** A Brand section just before Accent (not above the page settings): the palette or your own colours, then the
  accent's Shade, Saturation and Label tint, which apply to either. `src/brand-settings.tsx`, state in `src/brand.ts`.
- **Each colour** is a soft Color field (exact hex, applied on Enter or blur) with a picker beside it in a Popover (Color
  picker, plain, Spectrum and Sliders, OKLCH, eyedropper). A drag lands when the pointer lifts, holds still 300ms, or
  the picker closes; checked in headless Edge, the Canvas kept its colour through a six-step drag and took the new one
  on release. Secondary and Tertiary start as Add; added, each starts a third and two thirds round the wheel from the
  primary, and the picker's head has Remove. Under Primary, the button it draws ("Buttons use #00D16B, its nearest
  shade a black label reads on").
- **Accent with Brand on** keeps Shade (its swatch and steps read from the brand's declarations; the brand's own shade
  reads "Brand"), Saturation and Label tint; the colour menu and Hue go.
- **Status hues**: Brand's (harmonised, the default) or Area's; Area's leaves the Status colours setting to choose fixed
  or Match.
- **Greys are not switched on with the brand.** Greys' Tint colour → Accent already leans every grey toward the
  primary (the tint reads the accent's hue, which the brand writes); turning Brand on does not change another setting,
  so turning it off leaves nothing to undo.
- **Saved** under its own key (`brand`, validated by `restoreBrand`), not in the canvas settings, so the defaults
  session's `CANVAS_DEFAULTS` and `restoreCanvas` are untouched. Setup and the Theme tab don't show it yet.
- **Specimens only** (after PR #164, the app at Area's defaults): the holders that take the Inspector's settings
  (`src/specimen-scope.tsx`) carry `data-area-brand`, and the brand's one rule (`brandCss`, in the axes layer) sits in the
  document's head while Brand is on. The Canvas's body, cards, titles and the chrome keep Area's palette. Painted values
  match the engine exactly (accent, danger, success, support-1), light and dark, after a reload; with Brand on, a tile's
  view paints #00D16B for #00B65C while the body beside it keeps #006DF5.

Planned:


- A **Brand** group at the top of the Inspector's colour settings: Off (Area's palette, the default) or On, then
  Primary, Secondary and Tertiary, each an exact colour picker (Area's Color picker, hex field plus hue, chroma and
  lightness), Secondary and Tertiary optional.
- With Brand on, Accent's colour menu gives way to Primary; Shade and Saturation stay under it. Status colours default
  to Harmonised (Area's fixed and Match remain choices); Greys default to leaning toward the primary (today's Tint, set
  from it); Surfaces on.
- Saved values are colours, not preset ids: `restoreCanvas` keeps and validates them; Setup and the Theme tab read the
  same group (the registry's `SETTING_GROUPS` stays the single source of names).
- Coordinate with the defaults session: the app's own chrome stays at Area's defaults, so a brand paints the Canvas.

### 4. Components that use the new roles

Intake each one (`area-component-intake`); none is a new component.

- **Tag**: categorical tones `1` to `8` on the existing `tone` axis, from the supporting palette.
- **Avatar**: a `tone` per person from the supporting palette, chosen by a stable hash of the name, for initials.
- **Calendar**: event markers from the supporting palette.
- **Folder**: a colour from the supporting palette (the folder grid reference).
- **Grounds**: `data-area-ground="brand"` and `"brand-deep"` on Layers, so Surface, Card and Panel can sit on the brand
  page tint or the deep brand ground, their edges and inks following (Layers' edge shift).
- **Secondary and tertiary**: where they paint is open (below).
- The status roles need no component change: they are the same tokens, harmonised.

### 5. Docs and review

- THEMING.md (a Brand section and rows), DESIGN_SYSTEM.md (colour rules: one accent for interaction, brand colours
  for expression), CONTRAST.md (the sampled brand gate), the specs of every family that gained a tone.
- A review page with every family before and after at the four reference brands, light and dark (the
  `area-foundation-change` sweep).

## Decisions still open

1. **Where secondary and tertiary paint.** Recommendation: interaction stays on the primary (one accent keeps the UI
   clear, as every target product does); secondary and tertiary are expressive: chart series 1 to 3, tag tones,
   illustration, brand surfaces, and a `secondary` tone on Button, Badge and Tag for a second emphasis. Alternative:
   Material's split, where secondary paints quieter selected states (chips, filters) and tertiary contrasting accents.
2. **Tag tones.** Recommendation: add categorical tones `1` to `8` and keep pink, gray and brown as named tones. The
   alternative replaces the three named tag tones with the supporting palette under a brand.
3. **Harmonising the tag tones.** Recommendation: no; pink, gray and brown stay fixed, since the supporting palette is
   already the brand's categorical set.

## Risks

- **Bundle size**: the solver at runtime. Mitigation: a separate entry, loaded only by products that set a brand.
- **Arbitrary input**: a near-grey or a near-white brand colour gives a weak family. The picker shows when a colour is
  too grey or too light to drive the accent and suggests the nearest that can; the gate's sample includes such colours.
- **Scope**: three brand colours and new roles touch many families. Phases 1 and 2 are invisible; each later phase
  lands and is reviewed on its own.
