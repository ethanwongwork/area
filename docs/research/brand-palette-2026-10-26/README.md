# Brand palette (proposal, 2026-10-26)

The owner's question, with nine brand-sheet references (Ejendom's greens and Sandstone, the "Brand main colour" cards,
coloured folders, NSW brochure grids, Nuevo Tokyo's greydients, Deep Aqua, the Brazilian Ipê sheet, a pastel brand
strip): "can an entire color palette be created/generated based on the input/choice of 1 specific color … i want to
think about color as something a user chooses for their design system not just for ui but also for their brand." And:
"keep the current palette for area's default."

Status: proposal for the owner's review. Nothing here ships; `generate.ts` is a research prototype.

## What Area does today

- **One palette.** Fourteen families (`packages/tokens/src/color/palette.json`), 23 rungs each, read and never written.
- **Roles, not swatches.** Components paint roles: accent (selection, focus, accent actions), neutral and the Layers
  grounds, six status roles (danger red, warning orange, caution yellow, success green, info blue, discovery purple) and
  three tag tones (pink, gray, brown). Component CSS names a raw rung about ten times (alert and toast icons); the rest is
  roles.
- **One accent from one choice.** Accent is one of the eleven families or any hue in 5° steps (`color/generate.ts`
  interpolates the two neighbouring families' ladders), then Saturation (100 to 30) and Shade (200 to 850, the label
  flipping black or white, 2026-10-25). The solver (`color/scale.ts`) derives every accent paint and the contrast gate
  checks every hue × saturation × shade × label tint.
- **Greys** lean toward any hue (Tint colour and Amount). **Status colours** are fixed, or quieted to the accent's
  Saturation (Status colours: Match). Their hues never move.

What it cannot do: take an exact brand colour; carry more than one brand colour; let status or tag colours take the
brand's character; offer a categorical palette (tags, avatars, charts, events, folders, illustrations); or give a brand
surface (a tinted page, a deep brand ground).

## How other systems generate from one colour

| System | Input | Output | Notes |
|---|---|---|---|
| Material 3 ([Material Color Utilities](https://docsearch.algolia.com/mcp/docs/repo/material-foundation/material-color-utilities)) | One seed (HCT) | Primary, secondary, tertiary, neutral, neutral-variant and error tonal palettes, mapped to roles | Scheme variants decide how much of the seed survives: TonalSpot (default) quiets it, Fidelity keeps it exact ([mcu-scheme](https://docs.rs/mcu-scheme)). |
| Material harmonize ([Blend.harmonize](https://api.flutter.dev/flutter/package-material_color_utilities_blend_blend/Blend/harmonize.html)) | A custom colour and the seed | The colour's hue turned toward the seed | Rotation is half the difference, at most 15°; Android harmonizes error colours with primary by default ([HarmonizedColorsOptions](https://developer.android.com/reference/com/google/android/material/color/HarmonizedColorsOptions?authuser=0)). |
| Radix ([custom palettes](https://www.radix-ui.com/colors/docs/overview/custom-palettes)) | An accent and a gray (hex) | Two 12-step scales with alpha and wide-gamut variants | Contrast holds against a reasonable background; Radix advises adding custom scales beside its own rather than editing them. |
| Adobe Leonardo ([API](https://leonardocolor.io/api.html)) | Key colours and target contrast ratios | One colour per ratio against a shared background | Hue and chroma kept, lightness solved; a target can be impossible for a hue. |
| Carbon ([data visualization palettes](https://carbondesignsystem.com/data-visualization/color-palettes/)) | Curated | 14 categorical colours in a fixed order | Ordered so neighbours contrast. |
| Tableau 10 ([design notes](https://www.tableau.com/blog/colors-upgrade-tableau-10-56782)) | Curated in CIELAB | Categorical sets | Varied hue and lightness, not one lightness for all. |

## The prototype (`generate.ts`)

Run `node --experimental-strip-types docs/research/brand-palette-2026-10-26/generate.ts`. It registers brand families in
memory beside the palette, points the roles at them and resolves both modes with Area's own solver, then runs every
contrast assertion (`contrast/assertions.ts`). Four brands from the references, plus Area's default as the baseline.

- **Exact family.** The brand colour's hue family from `generatedFamily`, the nearest rung moved onto the brand colour,
  the lightness offset tapering to nothing at the ladder's ends, and every rung's chroma scaled by the brand's
  *character* (its share of the sRGB room against the palette's at that hue and rung). The brand colour is on the ladder
  exactly.
- **The button.** Most brand colours are mid-tones that carry neither black nor white at Area's button-label contract
  (4.6:1 and APCA Lc 61): #667FFF, #00B65C, #4D80E6 and #A785FE do not; #E5E12D carries black, #587989 and #47585C white.
  Area's solver takes the most vivid readable shade, which for GO Green is a neon #00F67E. The prototype instead takes the
  Shade step that *looks* closest to the brand (OKLab distance) and carries a label: #4B5BFE white for #667FFF, #00D16B
  black for #00B65C, #E5E12D itself for Ipê, #346DE3 white for #4D80E6. The exact brand colour stays available for
  everything that is not a label's ground (charts, illustration, brand surfaces, 3:1 marks).
- **Harmonised status.** Each status family's hue turned toward the brand by half the difference, at most 15°
  (Material's rule), at the brand's character but never under 45% of the palette's, so a status stays legible as itself.
- **Supporting palette.** Eight hues stepped round the wheel from the brand, at its character, each a light (200) and a
  deep (700) tone with the label that reads on it.
- **Surfaces.** The brand family's 25 and 50 as page tints, 900 and 950 as a deep brand ground.

Result: every example passes every contrast assertion in light and dark, with harmonised and with fixed status colours.

## Open decisions (the review page)

1. How a brand colour is entered (an exact colour, sliders, or both).
2. How many brand colours (primary; plus secondary; up to three).
3. Which shade the buttons use (nearest readable, the most vivid readable, or exact where it reads).
4. Status colours (Area's fixed, harmonised, or quieted only).
5. Greys (plain or leaning toward the brand).
6. A supporting palette (none, 8 or 12 colours) and where it paints.
7. Brand surfaces (none, or a tinted page and a deep ground).

Area's default palette stays as it ships in every option: brand generation is an opt-in layer on top of it.
