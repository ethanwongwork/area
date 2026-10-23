# Palette customization: research and brainstorm (2026-10-23)

Owner, 2026-10-23: "the ideal scenario is we provide some pre composed palettes of colors and users can select accent
colors and warmth/coolness of neutrals. but also want to open up the possibility of a user creating a completely custom
palette based on what they like. for example, what if someone wants a darker navy color as the button color, or they want
their surfaces/page/window colors to be lighter butter yellow. additionally, they want the yellow to be a specific hue and
chroma that the current palette doesnt have. i just want you to do research on this and brainstorm how to make this
customizeable without being too complicated."

Research and thinking only: nothing here is built, and no token, axis or component changed. Measurements were run with
the repository's own colour code (`color/oklab.ts`, `color/gamut.ts`, `color/contrast.ts`) against `palette.json` at
`origin/main` 6af47581; the scripts are short and repeated in [Appendix: measurements](#appendix-measurements).

## Summary

- **Area is already most of the way there.** The page and every gray (page, layers, fills, edges, text) are live CSS
  formulas of a few numbers: Ground (lightness), Tint hue and Tint strength, per mode. A page-colour field in Setup
  already turns any colour into those numbers. What is missing is the same for the **accent**, which today is one of
  11 fixed ramps read from `palette.json`, and enough tint range for a **butter-yellow** page.
- **The palette is simpler than it looks.** Every chromatic family sits at 97–100% of the most chroma sRGB can show at
  every step, and its lightness ladder depends only on hue (two groups: the white-label hues red, blue, indigo, purple,
  pink around L 0.58 at step 500; the black-label hues orange to cyan around L 0.66). So any accent can be written as
  **hue + strength** (how much of the available chroma it takes), and a generator that reads a family's own steps at its hue and
  interpolates the ladder between families leaves the 11 named accents exactly as they are. `palette.json` stays verbatim.
- **Proposed model: four levels, each a shortcut to the one below, never a separate system.**
  1. **Start from** a row of composed palettes. Picking one writes the settings below; it is not stored as a setting.
  2. **Accent and neutral temperature**: the 11 accents plus a custom swatch, and Neutral / Cool / Warm plus a custom
     swatch. What most people touch.
  3. **Role colours**: page colour (exists), card tone (exists), the button's depth (new: *Solid*), Action and Selection
     (exist). Covers "a darker navy button" and "a butter-yellow page".
  4. **Exact colour**: a colour field or OKLCH numbers for the accent and the page, snapped to the settings' grid, which
     is finer than the eye can tell apart.
- **Everything else stays derived** and is never a choice: hover and pressed steps, tints, strokes, inks, the label
  colour on a fill, the focus and selected rung, translucent twins, the dark counterpart (at Auto) and every contrast
  floor. A pick that cannot pass is snapped to the nearest that does, and the field says so.
- **New settings, at most four**: *Accent hue* and *Accent strength* (the 11 accents become named points on them),
  *Solid* per mode (which step a filled button sits on). Plus a wider Tint range. The visible default stays four
  controls in Setup's Color step.
- **Validated by the survey** (section 3): Linear's three inputs (base, accent, contrast) [32], Radix's background input
  and exact step 9 [6], Material's per-mode tones [10] and Atlassian's exact brand step [34] each match one part; none
  of them both keeps every option and proves every option, which Area's grid-plus-gate does.
- **Open questions** at the end: whether composed palettes may have names, whether Action may take a second colour,
  P3, and where a custom accent is generated (build, app or both).

## 1. How colour works in Area today

### Two engines

| | Ramps (accent, tones, tags) | Layers (page and grays) |
|---|---|---|
| Source | `palette.json`: 15 families × 23 steps (25 … 975), vendored verbatim, refined only through the tables in `color/curves.ts` (hue rotation, chroma trim, dark-end lift and cap) | Three numbers per mode: Ground (`ground-light` 100…90, `ground-dark` 0, 8, 12…24), Layers (0, 2, 4, 6, 8) and Card tone, plus Tint hue (0…355 in 5°), Tint strength (`tint-light`, `tint-dark`, 0…8 × 0.005 chroma) and Text tint |
| Where it is computed | Build time, in TypeScript: `color/scale.ts` picks the solid step (`chooseSolid`: from the most chromatic step toward the ink until the label clears), its hover, the label colour by measurement, tints, strokes, inks and translucent twins; `semantic/aliases.ts` picks the indicator step (the lightest from 500 that keeps 3:1 and APCA 45 on every ground, fill and tone tint) | Live CSS (`color/layers.ts` `layerCss()`), re-derived on any element that sets a value, with the same formulas in TS for the tests |
| Shipped as | One preset per accent: 60 custom properties per mode, about 4 KB for both modes (`accent-50` … `accent-975`, alphas, `accent-solid`, `-solid-hover`, `-indicator`, `-surface*`, `-border*`, `fg-accent*`, `fg-on-accent`) | Numbers on the scope; colours derived in `calc()` / `oklch()` |
| Custom value today | No: 11 named hues only | Yes: any hue in 5°, strength to 0.04, any ground step; Setup's **Page colour** field snaps a picked colour to Ground, Tint and hue (`apps/desktop/src/page-colour.ts`) |

### The colour settings today (Inspector › Color, 16)

Mode · Neutral (Neutral, Cool, Warm) · Tint hue · Light tint · Dark tint · Text tint · Accent (11) · Light ground · Dark
ground · Light layers · Dark layers · Light card tone · Dark card tone · Action (Neutral, Accent) · Selection (Neutral,
Accent) · Contrast (System, 0…8).

Action and Selection decide every use of the accent (`emit/base.ts` mixes each role from its neutral endpoint to the
accent by a 0/1 switch): Action paints solid Buttons and what is built on them; Selection paints state marks, selected
edges, the focus ring and selected text. Status colours (danger, success, warning, info, caution, discovery) and tag
colours are their own scales and never follow the accent.

### What is guaranteed, and how

- **Text and inks are solved, not picked.** Body and muted ink are solved for lightness against the deepest ground
  they sit on, pressed by the press room; with a tint they move 0.25 × strength away from the ground (`INK_MARGIN`), which
  passes every hue to 0.08 chroma in both modes (`docs/research/custom-neutral-2026-10-22/`).
- **Every option is tested, not sampled.** `layers.test.ts` loops every ground × Layers step × card tone × fill setting,
  every tint hue × strength × text share, and every accent × neutral's hued inks on every light page.
- **The accent's roles are chosen by contrast walls.** The solid step carries its label at AA; the indicator step clears
  3:1 and APCA 45 on every ground and every tone tint; tonal ink clears 4.5:1.
- **A setting is a grid, not a free value.** Because each option is a discrete value, the gate can prove all of them.
  This is the property a custom palette must keep.

### Measured facts that shape the proposal

**The palette is at the gamut edge everywhere** (relative chroma = chroma ÷ the most sRGB shows at that lightness and
hue):

| Family | Hue | L at 100 | L at 500 | L at 800 | Chroma at 500 | Relative at 150 / 500 / 800 |
|---|---|---|---|---|---|---|
| red | 18 | 0.932 | 0.592 | 0.292 | 0.234 | 1.00 / 0.99 / 1.00 |
| orange | 53 | 0.952 | 0.684 | 0.325 | 0.175 | 0.96 / 1.00 / 0.96 |
| yellow | 83 | 0.948 | 0.672 | 0.320 | 0.138 | 1.00 / 1.00 / 0.99 |
| lime | 127 | 0.951 | 0.654 | 0.316 | 0.170 | 0.66 / 1.00 / 1.00 |
| green | 150 | 0.950 | 0.645 | 0.311 | 0.177 | 1.00 / 1.00 / 1.00 |
| teal | 183 | 0.949 | 0.654 | 0.314 | 0.117 | 1.00 / 1.00 / 0.97 |
| cyan | 224 | 0.945 | 0.656 | 0.317 | 0.123 | 1.00 / 1.00 / 0.99 |
| blue | 259 | 0.930 | 0.569 | 0.285 | 0.221 | 0.95 / 1.00 / 1.00 |
| indigo | 276 | 0.930 | 0.576 | 0.289 | 0.233 | 0.95 / 0.99 / 1.00 |
| purple | 296 | 0.934 | 0.585 | 0.293 | 0.234 | 0.97 / 0.91 / 1.00 |
| pink | 358 | 0.934 | 0.591 | 0.298 | 0.234 | 0.97 / 0.97 / 0.99 |

(Lime's light end is trimmed on purpose: `CHROMA_TRIM`.) Two consequences:

1. A "yellow with a chroma the palette doesn't have" can only be **less** chroma (a butter, a mustard, an ochre) or
   another hue, never more. Strength (0–100% of the room) describes every such colour.
2. The lightness ladder depends on hue in a smooth, two-group way, so it can be **interpolated by hue** between the
   two nearest families. At a family's own hue and full strength that interpolation is the family.

**Area once generated its ramps** from a hue (gamut cusp, a fraction of the reachable chroma at each lightness) before
the vendored palette replaced it (`04e7d26b`). The proposal reuses the idea but anchors it to the palette's own ladder
rather than a formula, so the 11 named accents do not move.

## 2. The owner's two examples, measured

**A butter-yellow page.** Hue is about 98 in every butter yellow measured; chroma 0.03–0.08, more than Tint's top step
(0.04). Text reads on all of them (body #0d0d0d 16.8–18.7:1, muted #646464 5.1–5.7:1).

| Colour | L | Chroma | Hue | Most sRGB shows here | Tint steps needed (0.005 each) |
|---|---|---|---|---|---|
| #fffbe6 | 0.986 | 0.028 | 98 | 0.028 | 6 |
| #fff8d6 | 0.976 | 0.045 | 98 | 0.045 | 9 |
| #fdf6d3 | 0.970 | 0.046 | 98 | 0.057 | 9 |
| #fbf3c8 | 0.960 | 0.056 | 99 | 0.079 | 11 |
| #fff4b8 | 0.962 | 0.077 | 99 | 0.077 | 15 |
| #f8efc4 | 0.948 | 0.057 | 98 | 0.094 | 11 |

The room sRGB has for a tint depends heavily on hue at page lightness:

| Page L | Yellow (95°) | Blue (250°) | Red (25°) |
|---|---|---|---|
| 0.99 | 0.016 | 0.005 | 0.005 |
| 0.97 | 0.048 | 0.015 | 0.015 |
| 0.95 | 0.080 | 0.025 | 0.025 |
| 0.90 | 0.158 | 0.050 | 0.052 |

So Tint's 0.04 cap (chosen because it is what every hue can show from a 95 page down) is right for blue and wrong for
yellow: yellow has three times the room. The ink rule was already swept to 0.08 on every hue and passes
(`custom-neutral-2026-10-22/sweep-margin-0.25.json`). Widening Tint to 16 steps (0.08) is proven for text; above a hue's
room the browser clips, so those steps would look identical (see [Risks](#9-risks)).

Drawn with Area's own Layers model (`layerTokens`), the page each colour snaps to today and with Tint widened to 16, as
ΔE_OK from the colour asked for (a just-noticeable difference is about 0.02):

| Asked | Today (Tint ≤ 8) | Tint ≤ 16 | Muted on page / card, Tint ≤ 16 |
|---|---|---|---|
| #fffbe6 | 0.016 (Ground 99, Tint 6) | 0.016 | 6.2 / 6.3 |
| #fff8d6 | 0.012 (98, 8) | 0.009 (98, 9) | 6.3 / 6.6 |
| #fdf6d3 | 0.007 (97, 8) | 0.003 (97, 9) | 6.3 / 6.8 |
| #fbf3c8 | 0.017 (96, 8) | 0.002 (96, 11) | 6.4 / 7.1 |
| #fff4b8 | **0.038** (96, 8) | 0.003 (96, 15) | 6.5 / 7.2 |
| #f8efc4 | 0.016 (95, 8) | 0.003 (95, 11) | 6.4 / 7.1 |

So today's snapping is already close for most butters, near the edge for several, and visibly off for the most
saturated; the wider Tint brings five within 0.009. The palest (#fffbe6) stays at 0.016 for another reason: the tint
fades to none over the last 0.024 L before white (`CAST_FADE`), so a 99 page keeps only 42% of its tint. sRGB's own room
already reaches zero at white, so the fade could be left to the gamut (open question 8).

**A darker navy button.** Navy is already in the palette: blue 700 #013c8d, 750 #003075, 800 #00265f. Today the accent's
solid is chosen (blue 500, #006df5) and cannot be moved. Every navy measured carries white at 10–15:1. In dark mode the
solid is the same step as light ("an accent colour does not move when the lights go out"), and a navy fill on the
near-black page is 1.3–2.0:1 against it: legible as a button only by its label. So a navy button needs **which step the
solid sits on** as a choice, per mode, with dark's Auto staying where today's solver puts it.

| Navy | L | Chroma | Hue | White label | Against the dark page #020202 |
|---|---|---|---|---|---|
| #1f3a68 | 0.353 | 0.087 | 260 | 11.3:1 | 1.84:1 |
| #1e3a8a | 0.379 | 0.138 | 266 | 10.4:1 | 2.00:1 |
| #003075 (blue 750) | 0.329 | 0.128 | 259 | 12.5:1 | 1.66:1 |
| #00265f (blue 800) | 0.285 | 0.110 | 259 | 14.6:1 | 1.43:1 |

#1f3a68 is hue 260 at 59% of the chroma sRGB has at its lightness (0.087 of 0.147): a custom navy is hue + strength +
depth, and its nearest generated step is 750 (#1c345d).

## 3. How other systems do it

Read 2026-10-23, mostly from source code (generators, packages, registries); every row below cites the sources table by
number. Full per-system notes (what is chosen, derived, how contrast and dark are handled, colour space, tricks) are in
[`systems.md`](systems.md). Gaps: ChatGPT's help page and Discord's article refused automated fetches (bot check, not
bypassed), so their options come from search-index text and a secondary site; uicolors.app is closed source and
undocumented beyond its inputs and API output.

### At a glance

| System | What the person chooses | What is derived | How contrast holds | Light and dark | Space |
|---|---|---|---|---|---|
| Radix Themes + custom generator [1–6] | Accent (26), gray (6 or `auto`, paired by accent family), appearance; the generator takes accent, gray **and background** | 12 steps with fixed roles; nearest two built-in scales mixed, re-hued to the input, chroma ≤ 1.5× input; step 1 starts at the background's lightness; step 9 = the exact input; hover by formula; alphas solved per background | From the hand-tuned template scales; steps 11/12 APCA Lc 60/90 on step 2; label white unless APCA < 40 | Separate hand-tuned dark scales; generated dark is a second run | OKLCH |
| Material 3 [7–17] | One seed colour, a variant (TonalSpot, Vibrant, Fidelity …), contrast −1…1; Theme Builder adds key-colour overrides and custom colours | Six tonal palettes (hue + chroma); every role is a tone; states are opacity layers (8/10/10/16%) | Tone difference: 40 → 3:1, 50 → 4.5:1; each role has a contrast curve per level (onPrimary 4.5 / 7 / 11 / 21) | Same palettes, different tones per role (primary T40 / T80) | HCT |
| Tailwind v4 [18–20] | Override `@theme` variables | Nothing | None stated; lightness not matched across hues (yellow-500 L 0.795, blue-500 0.623) | Author's job | OKLCH |
| shadcn/ui, tweakcn [21–25] | Base colour (7) × accent (17); tweakcn: every token | Nothing: a theme is a merge of two hand-written token sets | Hand-picked per hue, no check | Hand-written `:root` and `.dark` | OKLCH |
| Apple [26–31] | App: one AccentColor (any/dark/high-contrast variants); user (macOS 26): accent, highlight, glass tint | Control rendering from the tint; dimming under modals | Authored increased-contrast variants | Authored variants | sRGB / P3 |
| Linear [32–33] | **Base colour, accent, contrast** (replaced 98 variables per theme) | Every surface, text, icon, control and elevation by operations on the three | The contrast input; high-contrast themes from the same generator | One generator for both | LCH |
| Atlassian [34–37] | One brand colour | 10-step ramp at fixed WCAG ratios to white (two ratio tables: dark hues, light hues); nearest step replaced by the exact brand hex; ~25 tokens; hover/pressed the next steps | Ratio-defined steps plus a post-hoc checker that nudges failing tokens a step | Mirror (dark index = 9 − light); a user reports the brand shifting | HCT, WCAG 2 |
| Primer [38–41] | A theme (14: light, dark, dimmed, high contrast, colour-blind) | Functional tokens with per-theme overrides | Step roles (text 9+, borders 7–8); high contrast 7:1 | Neutrals inverted; separate themes | HSLuv (Prism) |
| Leonardo [42–44] | Key colours, **target contrast ratios**, one background; theme lightness, contrast multiplier, saturation | Each colour searched to hit its ratio on the background | Contrast is the input (WCAG 2 or APCA) | Lower the background lightness; everything regenerates to the same ratios | LCH, CAM02 … |
| Huetone [45] | Every cell's L, C, H in a hue × tone grid | Equalise lightness down a column, hue across a row; push into sRGB | APCA shown | Separate palettes | LCH / OKLCH |
| tints.dev [46] | One hex, its stop (or auto: the nearest lightness), hue shift per step | 50…950 with lightness interpolated through the input; input stop exact | None | None | HSLuv / HSL |
| uicolors.app [47] | One hex, harmony settings | 50…950, the input at 500 in the API example | Undocumented | Undocumented | Undocumented |
| Figma [48–51] | UI: light, dark, system, enhanced contrast (no accent). Variables: one value per mode | Nothing; modes inherit down the tree | None | Authored modes | sRGB / P3 |
| ChatGPT [52] | One accent from about 5–7 fixed choices | — | — | — | — |
| Notion [53] | Mode and high contrast; no accent | — | — | — | — |
| Slack, Discord [54–55] | Per-element swatches (Slack); up to five gradient colours (Discord Nitro) | — | — | — | — |
| Open Props [56] | Hue, hue rotation per step, chroma multiplier | A 16-step ramp at fixed lightness per step | — | Surfaces map to the other end of the gray | OKLCH |
| Reasonable Colors [57] | — (a fixed set) | 24 hues × 6 shades | **Shade difference**: 2 → 3:1, 3 → 4.5:1, 4 → 7:1, across any hues | — | LCH |
| Harmonizer [58] | Hues, levels with a target contrast each, backgrounds, gamut | Each cell solved to its contrast; "even" mode gives every hue the most chroma all hues can reach at that level | Contrast-locked levels (APCA or WCAG) | Two backgrounds; "themes don't mirror" | OKLCH |

### Sources

| # | System | URL | What it documents |
|---|---|---|---|
| 1 | Radix Themes | https://www.radix-ui.com/themes/docs/theme/color | 26 accents, 6 grays, step roles, panelBackground, custom-palette guidance |
| 2 | Radix Themes | https://www.radix-ui.com/themes/docs/components/theme | Theme props, values, defaults |
| 3 | Radix Themes | https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/helpers/get-matching-gray-color.ts | `grayColor="auto"` accent→gray pairing table |
| 4 | Radix Colors | https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale | 12-step roles, APCA guarantees for steps 11/12 |
| 5 | Radix Colors | https://www.radix-ui.com/colors/docs/overview/custom-palettes | Custom generator outputs (steps, alpha, P3), dark via appearance toggle |
| 6 | Radix Colors | https://github.com/radix-ui/website/blob/main/components/generate-radix-colors.tsx | Generator source (accent, gray, background → 12 steps) |
| 7 | Material 3 | https://github.com/material-foundation/material-color-utilities/blob/main/concepts/color_spaces.md | HCT definition, gamut handling |
| 8 | Material 3 | https://github.com/material-foundation/material-color-utilities/blob/main/concepts/contrast_for_accessibility.md | Tone-difference contrast guarantee, contrast levels |
| 9 | Material 3 | https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/dynamic_scheme.ts | Variants' palette hue/chroma, contrastLevel −1…1 |
| 10 | Material 3 | https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/color_spec_2021.ts | Role tones and contrast curves |
| 11 | Material 3 | https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/contrast_curve.ts | ContrastCurve (low/normal/medium/high) |
| 12 | Material 3 | https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/variant.ts | Variant enum |
| 13 | Material 3 | https://github.com/material-foundation/material-color-utilities/blob/main/typescript/blend/blend.ts | `harmonize` |
| 14 | Material 3 | https://github.com/material-foundation/material-color-utilities/blob/main/typescript/utils/theme_utils.ts | `customColor` (custom colour → 4 roles ×2 modes) |
| 15 | Material 3 | https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dislike/dislike_analyzer.ts | Dark yellow-green "disliked" fix |
| 16 | Material 3 | https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StateTokens.kt | State-layer opacities |
| 17 | Material 3 | https://github.com/material-foundation/material-theme-builder | Theme Builder inputs/outputs |
| 18 | Tailwind v4 | https://tailwindcss.com/docs/colors | OKLCH palette, 11 steps, `@theme` customisation |
| 19 | Tailwind v4 | https://tailwindcss.com/blog/tailwindcss-v4 | rgb→oklch move, "balance kept as v3" |
| 20 | Tailwind v4 | https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/theme.css | Actual OKLCH values |
| 21 | shadcn/ui | https://ui.shadcn.com/docs/theming | Token list, bg/foreground convention, base colours, `.dark` |
| 22 | shadcn/ui | https://ui.shadcn.com/docs/tailwind-v4 | HSL→OKLCH, `@theme inline`, revised dark colours |
| 23 | shadcn/ui | https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/themes.ts | Base-colour and accent theme values |
| 24 | shadcn/ui | https://github.com/shadcn-ui/ui/blob/main/apps/v4/app/(app)/(create)/lib/merge-theme.ts | base × accent merge |
| 25 | tweakcn | https://tweakcn.com/editor/theme ; https://github.com/jnsahaj/tweakcn | Per-token shadcn theme editor |
| 26 | Apple | https://developer.apple.com/design/human-interface-guidelines/color | Dynamic colours, increased contrast, app accent on macOS, Liquid Glass colour |
| 27 | Apple | https://developer.apple.com/documentation/xcode/specifying-your-apps-color-scheme | AccentColor asset, light/dark/high-contrast variants |
| 28 | Apple | https://developer.apple.com/documentation/swiftui/view/tint(_:)-93mfq | `.tint` vs accent |
| 29 | Apple | https://developer.apple.com/documentation/swiftui/color/accentcolor | accentColor, macOS Multicolor rule |
| 30 | Apple | https://developer.apple.com/documentation/uikit/uiview/tintcolor | tintColor inheritance, dimmed |
| 31 | Apple | https://support.apple.com/guide/mac-help/mchlp1225/mac | macOS 26 Appearance pane (accent, highlight, Liquid Glass slider, icon style) |
| 32 | Linear | https://linear.app/now/how-we-redesigned-the-linear-ui | Base + accent + contrast; LCH |
| 33 | Linear | https://linear.app/docs/account-preferences | Presets, custom themes, linear.style |
| 34 | Atlassian | https://unpkg.com/@atlaskit/tokens@20.7.0/dist/esm/utils/generate-colors.js | Brand colour → 10-step ramp by contrast ratio (HCT) |
| 35 | Atlassian | https://unpkg.com/@atlaskit/tokens@20.7.0/dist/esm/utils/generate-token-map.js | Ramp index → tokens, states, dark "rule of symmetry" |
| 36 | Atlassian | https://unpkg.com/@atlaskit/tokens@20.7.0/dist/esm/utils/additional-contrast-checker.js | Post-hoc contrast nudges |
| 37 | Atlassian | https://unpkg.com/@atlaskit/tokens@20.7.0/dist/esm/get-custom-theme-styles.js | `UNSAFE_themeOptions.brandColor` entry point |
| 38 | Primer | https://primer.style/product/getting-started/foundations/color-usage/ | Base/functional tokens, inverted neutral scales, HC targets |
| 39 | Primer | https://github.com/primer/primitives/blob/main/scripts/themes.config.ts | Theme list |
| 40 | Primer | https://github.com/primer/primitives/blob/main/src/tokens/functional/color/bgColor.json5 | Per-theme overrides mechanism |
| 41 | Primer Prism | https://github.blog/news-insights/product-news/accelerating-github-theme-creation-with-color-tooling/ ; https://github.com/primer/prism | HSLuv, shared lightness curves, WCAG checks |
| 42 | Leonardo | https://github.com/adobe/leonardo/blob/main/packages/contrast-colors/README.md | API: key colours, ratios, background, lightness, contrast, saturation |
| 43 | Leonardo | https://github.com/adobe/leonardo/blob/main/packages/contrast-colors/lib/theme.js ; .../lib/utils.js | `formula` wcag2/wcag3 (APCA), contrast multiplier |
| 44 | Leonardo | https://leonardocolor.io/theme.html | Web tool controls |
| 45 | Huetone | https://github.com/ardov/huetone (src/shared/colorFuncs/colorModels.ts, src/store/palette/actions.ts, src/components/Header/ColorActions.tsx, src/components/Help.tsx) | LCH/OKLCH grid editor, APCA, equalise, push-into-RGB |
| 46 | tints.dev | https://github.com/SimeonGriggs/tints.dev/blob/main/app/lib/createSwatches.ts ; .../helpers.ts ; .../constants.ts | Single-hex → 50–950 algorithm |
| 47 | uicolors.app | https://uicolors.app/create ; https://uicolors.app/api | Generator UI, API output |
| 48 | Figma | https://help.figma.com/hc/en-us/articles/5576781786647-Change-themes-in-Figma | UI theme, enhanced contrast |
| 49 | Figma | https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables | Modes, Auto inheritance |
| 50 | Figma | https://help.figma.com/hc/en-us/articles/36346281624471-Extend-a-variable-collection | Extended collections (multi-brand) |
| 51 | Figma Slides | https://help.figma.com/hc/en-us/articles/26621828788631-Find-and-use-slide-deck-templates | Template styles, "Remix template colors" (search-result summary only) |
| 52 | ChatGPT | https://help.openai.com/en/articles/11958281-updating-your-visual-experience-on-chatgpt ; https://pureinfotech.com/change-chatgpt-accent-color/ | Accent colour options (official page 403 to fetch; see note) |
| 53 | Notion | https://www.notion.com/help/account-settings | Appearance + high contrast; no accent |
| 54 | Slack | https://slack.com/help/articles/205166337-Change-your-Slack-theme | Custom theme, window gradient, darker sidebars |
| 55 | Discord | https://discord.com/blog/bring-your-vibe-to-discord-with-new-themes-in-nitro | Default + Nitro themes, up to 5-colour custom |
| 56 | Open Props | https://open-props.style/#colors ; https://github.com/argyleink/open-props/blob/main/src/props.palette.css | Hue/chroma/rotate-driven OKLCH palette |
| 57 | Reasonable Colors | https://reasonable.work/colors/ | Contrast-by-shade-difference guarantee |
| 58 | Harmonizer | https://evilmartians.com/opensource/harmonizer ; https://github.com/evilmartians/harmonizer/blob/main/packages/core/src/utils/colors/calculateColors.ts ; .../maxCommonChroma.ts | Contrast-locked levels, even chroma across hues |
| 59 | Evil Martians | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl | HSL vs OKLCH, gamut clipping, LCH blue shift |
| 60 | Atlassian | https://community.developer.atlassian.com/t/is-there-a-way-to-keep-brand-color-same-in-dark-llight-in-atlaskit/81376 | A user reports the brand colour shifting in dark mode |

## 4. Lessons for Area

What the survey says, and where Area already stands:

1. **The choice people make is tiny; the derivation is large.** Linear went from 98 variables to three (base, accent,
   contrast) [32]; Material from one seed [9]; Atlassian from one brand colour [34]; ChatGPT offers 5–7 accents [52], Notion
   none [53]. Area's equivalent of Linear's three is **page colour + accent colour + Contrast**, which is what Level 2–4
   below put first. Area already has the third and most of the first.
2. **Same lightness is not same look; ladders depend on hue.** Tailwind's yellow-500 is 0.17 L lighter than its blue-500
   [20]; Radix gives five hues dark labels [4]; Atlassian keeps two ratio tables, one for light hues and one for dark [34].
   Area's palette does the same with two groups (the table in section 1), so a generated accent must take its ladder from
   its hue, not from one shared curve.
3. **Lock steps to contrast where it matters, not everywhere.** Contrast-locked systems (Leonardo, Harmonizer,
   Reasonable Colors) guarantee every hue [42][57][58] but turn yellows olive at a blue's lightness. Area's mix is already
   the right one: the palette's steps are wall-anchored (500 carries its label), and the roles that must pass (solid,
   indicator, inks) are solved per family by contrast walks.
4. **The ground is an input.** The better generators take the background (Radix bends its whole ladder to it [6];
   Leonardo regenerates on it [42]; Harmonizer takes two [58]). Area's Layers model already derives every gray and ink
   from the ground, and darkens hued inks per page. The gap is that the hued-ink check runs on untinted pages only.
5. **Keep the exact colour visible, derive the rest.** Radix puts the input at step 9 [6], Atlassian swaps it into the
   nearest step [34], tints.dev keeps the input stop [46]. Area can do this by snapping: the picked colour's lightness
   chooses the Solid step, and the grid is finer than the eye (section 5, Level 4), so the person sees their colour.
6. **Out-of-gamut chroma is reduced at constant lightness and hue, not clipped** (clipping turns hue) [7][45][59]. Area's
   `gamutMap` already does this for ramps; a strength above a hue's room must be mapped the same way, and a Tint step above
   the room should say it clips.
7. **Dark is re-derived, not mirrored.** Material picks other tones [10]; Radix ships separate dark scales [1]; Atlassian's
   mirror makes users complain that the brand colour moves [35][60]. Area's rule (the solid keeps its step; every other
   role is re-chosen; the page near black) is the good half of both, and a per-mode Solid with Auto keeps it.
8. **States are derived.** Every system that guarantees anything derives hover and pressed (opacity layers [16], next
   steps [4][35]). Area derives them too (`FILL_STEPS`, solid hover), so a custom colour adds no state choices.
9. **Neutral warmth is a separate, small choice, often paired to the accent.** Radix auto-pairs gray to accent family [3];
   Material's neutrals carry the seed hue at low chroma [9]; Linear limits how much the accent tints the chrome [32]. Area's
   Neutral / Cool / Warm and Tint are this; an *Auto* pairing (the tint follows the accent's hue) would be a value of Tint
   hue, not a new control.
10. **Per-role overrides are where systems break.** shadcn, tweakcn and Figma let any token be set with no derivation and
    no check [23][25][50]; Atlassian checks afterwards and nudges [36]. The guarded pattern is: override the role, then
    re-derive its on-colour and states and check them on its ground. Area's Level 3 only exposes roles whose derivations
    already exist (page, cards, solid), never a raw token.
11. **Contrast as a control works when roles are defined by contrast.** Material −1…1 [11], Linear's slider [32], Leonardo's
    multiplier [43]. Area's Contrast 0…8 is this already, and stays the accessibility layer apart from colour choice.

## 5. The proposed model

Four levels. Each level is a shortcut that writes the settings of the level below it, as Setup's Page colour field
already does, so there is one model and one set of settings underneath, and the gate proves that set. A person stops at
whichever level gives them what they want.

### Level 1: Start from a composed palette

Linear's presets [33], ChatGPT's accents [52] and Radix's paired grays [3] are this level.

A row of 6–10 swatch cards, each showing its page, card, accent and text together, in the mode being edited. Picking one
writes Accent hue and strength, Neutral or Tint, Ground and Card tone for both modes. It is **not a setting**: nothing
stores "palette = X", the Inspector shows the settings it wrote, and changing any of them simply leaves the palette.

This is how the owner's "pre composed palettes" fit the rule against named looks: a palette is a starting point that
disappears into the independent controls, like a colour field that snaps, never a package that owns values. Candidates
(each is just values): white + blue (the default), white + neutral (Action and Selection Neutral), warm 98 + orange,
cool 99 + indigo, butter 97 + navy, sage 97 + green, near-black + blue (dark), black + teal (dark). Whether they carry
names or are shown as swatches only is an open question.

### Level 2: Accent and neutral temperature (the default view)

- **Accent**: the 11 swatches as now, plus a **custom** swatch that opens Level 4. Behind it, the accent becomes two
  numbers:
  - *Accent hue*: 0…359 (1° steps; or 5°, see below). The 11 names are labelled points (blue = 259, red = 18 …).
  - *Accent strength*: how much of the hue's available chroma it takes, 100% (the palette) down to about 30% (dusty,
    muted). 5 or 8 steps.
- **Neutral temperature**: Neutral / Cool / Warm as now, plus a custom swatch that opens Tint hue and strength (which
  exist). Unchanged except the wider Tint range below. One possible extra value of Tint hue: *Accent* (the grays lean
  toward the accent's hue), as Radix pairs gray to accent [3] and Material's neutrals carry the seed hue [9].

### Level 3: Role colours

The roles a person might want to colour are the roles Area already has. No new role is needed for either example:

| What they want | The role | Setting |
|---|---|---|
| A butter-yellow page | Page | Page colour (exists) → Ground, Tint hue, Tint strength per mode; Tint widened to 0.08 |
| Cards lighter or darker than the page | Cards | Card tone (exists) |
| Coloured buttons, or calm ones | Action | Action: Neutral / Accent (exists) |
| Coloured state and focus, or calm | Selection | Selection: Neutral / Accent (exists) |
| A darker navy button | The accent's solid | **Solid** (new), per mode: Auto (today's solver) or a step, 400 … 850 |
| Warmer or cooler text | Ink | Text tint (exists) |

*Solid* moves `accent-solid` and everything built on it (its hover is the next step toward the ink; its label is
measured). It does not move the indicator step (focus ring, selected edge), which is solved to be the most vivid step
that reads, nor the tints. Light and dark are chosen apart; dark's Auto is the light step (today's behaviour) unless that
step fails the dark checks.

**Not proposed: a second chromatic colour** (a navy button with an orange selection). Material's secondary and tertiary
[9] and Slack's per-element pickers [54] show it exists, but it doubles the accent's surface and the owner's model has one chosen
colour plus neutral. Listed as an open question.

### Level 4: An exact colour

A colour field (hex, or OKLCH L C h) for the accent and for each mode's page, as Page colour does today:

- **Accent**: the picked colour splits into hue → Accent hue, chroma ÷ the room at its lightness and hue → Accent
  strength, lightness → the nearest step → Solid (light). The field then shows what it snapped to ("Hue 262°, strength
  65%, solid 750").
- **Page**: unchanged (lightness → Ground, chroma → Tint strength, hue → Tint hue), with the wider Tint range.

**Snapping is invisible at these grids.** Half a 5° hue step at chroma 0.234 (the most vivid accent) is ΔE_OK 0.010; at
a page's 0.05 it is 0.002. A just-noticeable difference in OKLab is about 0.02 (the JND CSS Color 4's gamut mapping uses,
https://www.w3.org/TR/css-color-4/#gamut-mapping). Half a 0.005 tint step is 0.0025. So "the
exact hue and chroma" is met by a grid that the gate can prove, which keeps the property that every option is tested.
1° accent steps cost nothing if the accent is generated at runtime; 5° keeps the 72-value grid Tint hue uses.

### What the person sees

| Where | Controls |
|---|---|
| Setup › Color (default) | Start from (palettes) · Accent (11 + custom) · Neutral (3 + custom) · Page colour |
| Setup › Color, after "custom" or "Fine-tune" | Accent hue, Accent strength, Solid · Tint hue, Tint strength, Text tint · Ground, Card tone, Layers · Action, Selection |
| Setup › Dark mode | Page colour (dark) · Solid (dark), Tint (dark), Ground (dark), Card tone (dark), Layers (dark) |
| Inspector › Color | Every setting, as now |

Four controls by default; every option still exists and still shows its effect, as the owner asked ("keep every option",
"few independent controls").

## 6. What stays derived

None of these is ever a choice; each is computed from the picks by the code that computes it today, so a custom colour
inherits the same guarantees as a named one:

| Derived | From | Rule (today's code) |
|---|---|---|
| The accent's 23 steps | Accent hue, strength | Lightness interpolated by hue between the two nearest palette families; chroma = strength × the room at that lightness and hue (`maxChromaAt`); dark-end lift and cap from `curves.ts`. At a named hue and 100% it reads that family's own steps, so the 11 accents never move |
| Solid (at Auto) and its hover | The steps | `chooseSolid`: from the most chromatic step toward the ink until the label clears |
| The label on a fill (white or black) | The solid | Measured (`StepContrast`), with the glyph-wall hues taking black as now |
| The indicator step (focus ring, selected edge) | The steps | `indicatorLevel`: lightest from 500 with 3:1 and APCA 45 on every ground, fill and tone tint |
| Tints (`accent-surface*`), strokes, tonal and vivid inks | The steps | The tonal block's slots in `INVERSION`; tonal strokes as measured blends of ink and surface |
| Translucent twins (`accent-a*`) | The steps, each page | `solveAlpha` |
| Page, layers, fills, edges, body and muted ink | Ground, Tint, Layers, Card tone | `layerCss()`, live; inks solved against the deepest ground and moved by `INK_MARGIN` |
| Hover, selected, pressed | Fill settings | `FILL_STEPS`, built on each other, press room |
| Every Contrast level | Contrast | Mixes toward the 3:1 stroke and the ink, as now |
| The dark counterpart | The light picks | At Auto: same hue and strength, dark's own solver; Ground, Tint, Card tone, Layers per mode as now |

## 7. How a custom colour never breaks the contrast tests

1. **Grids, not free values.** Accent hue (72 or 360) × strength (5–8) × Solid (Auto + ~10) × 2 modes, and Tint to 16
   steps, are all finite. The gate extends its existing loops (every accent × neutral; every hue × strength) over them.
   Nothing is sampled, and no floor or waiver changes.
2. **Solvers, not picks, choose the roles that must pass.** A person picks hue, strength and (optionally) Solid; the
   label colour, the indicator step, inks and edges are solved. The only pick that can fail is Solid: a step whose
   label cannot clear AA, or (dark) a step the gate rejects. Those steps are shown as unavailable with the reason
   ("label 3.9:1"), never silently allowed.
3. **Snapping states what happened.** A picked colour snaps to the nearest passing grid point and the field says what
   it became, as Page colour does today.
4. **The custom path is the same code as the named path.** The 11 accents become 11 points of the generator, so there
   is one ramp function, one set of solvers and one gate.

## 8. Light and dark

- **Hue is one for both modes** (identity), as Tint hue is today.
- **Strength, Solid, Ground, Tint strength, Card tone and Layers are per mode**, each with Auto where a derivation
  exists, so a person can set light and leave dark to follow, or decide dark apart in Setup's Dark mode step.
- **Dark is re-derived, not inverted**: the dark ramp keeps its own lift and cap; dark's solid defaults to light's step
  only while it passes there; the page stays as close to black as the owner wants (Ground 8 by default).

## 9. Risks

- **Clipped tint steps look identical.** With Tint to 0.08, blue has room for only 0.010 on a 98 page; steps 3–16 would
  all draw the same colour. Options: keep absolute chroma steps and mark the ones that clip at the current ground and
  hue ("same as 2 here"); or make strength relative to the room (every step visible on every hue, but a number means a
  different chroma per hue). Recommended: absolute, marked, because a number then always means the same chroma and the
  gate stays simple.
- **Accent inks on a strongly tinted page.** The hued-ink check (`layers.test.ts`, "inks with a hue follow the ground")
  runs on untinted pages; a 0.08 yellow page with a blue link is unproven. The gate must add tinted grounds before the
  wider Tint ships.
- **A custom accent near a status hue** (a red near danger, an amber near warning) can be mistaken for it. Red is already
  an accent, so this is a warning in the field, not a block.
- **Low strengths blur into the neutrals.** A 30% accent's tints approach the Warm and Cool casts; the indicator step
  still has to clear 3:1, so the solver walks darker. Where the floor sits is a measurement for the build.
- **Cost.** Each accent is 60 properties per mode (~4 KB both modes). 72 hues × 8 strengths shipped as CSS presets would
  be ~2.3 MB, too much; a runtime generator (`@area/tokens` exporting the ramp function the build uses, the app and
  `Theme` writing the 60 properties inline, "Copy CSS" for CSS-only users) is small. The layers are already live, so only
  the accent needs this. See open question 4.
- **Two sources of the same look.** A composed palette and the settings it wrote can drift if palettes are ever edited;
  since a palette is only a shortcut, editing one never changes a saved theme. Saved themes store settings, never a
  palette id.

## 10. Open questions for the owner

1. **Palette names.** May composed palettes have names ("Butter", "Harbour"), or only show as swatches and the values
   they set? Names help people talk about them; the "no named looks" rule argues for values only.
2. **A second chromatic colour.** Should Action be able to take its own colour (a navy button with a blue selection or
   an orange one), as Material's secondary [9] and shadcn's separate `secondary` [23] allow? The proposal says no: one accent, with
   Solid for depth.
3. **Accent hue grid.** 5° (the Tint hue grid, 72 values) or 1° (360)? Both are below what the eye can tell apart at
   page chroma; at full accent chroma 5° is about half a just-noticeable difference.
4. **Where a custom accent is generated.** At build time for the 11 named points only, and at runtime (app and `Theme`)
   for custom ones, with Copy CSS? Or all at runtime?
5. **Wide gamut.** The palette is sRGB. A P3 accent (more vivid greens and reds on Apple screens) would be a separate
   setting or a later step; not proposed now.
6. **Tint above the room.** Mark clipped Tint steps, or make Tint relative to the room?
7. **Solid in dark.** Should dark's Auto follow light's Solid (today's rule) or always take the dark solver's own step?
8. **The fade toward white.** Keep `CAST_FADE` (a 99 page keeps 42% of its tint), or let sRGB's room alone limit it?

The review page asks these with options and saves the owner's picks: https://claude.ai/artifact/83P9VvdR3MvnmJcn2qSdBa
(collection `decisions`, one document per question).

## Appendix: measurements

Run with `node` (type stripping) from the worktree; each imports the repository's colour code.

- Butter yellows and navy: `oklab.ts` `rgbToOklab`/`labToLch`, `gamut.ts` `maxChromaAt(L, h, SRGB)`, `contrast.ts`
  `wcagContrastHex` and `apcaMagnitude`.
- Relative chroma per family: `palette.json` steps 150, 500, 800; chroma ÷ `maxChromaAt` at the step's own L and hue.
- Accent size: `ACCENT_AXIS.presets` (blue): 60 tokens per mode, about 3.9 KB as JSON.
- Other systems: [`systems.md`](systems.md), the full per-system notes behind section 3, with the same source numbers.

## Built (2026-10-23)

Owner, after the research: "lets say a user wants to choose like 2-3 colors overall ... balance flexibility and
customization with accessibility, design aesthetic, and visual consistency", then "explore and build this and implement it",
choosing base + accent + depth for now (no separate button colour), and: "they are presented in the beginning with the
choice between neutral, to warmer, to cooler, or even a color tint/multicolor theme, and selecting any of the options will
allow further customization further in".

| Piece | Where | Notes |
|---|---|---|
| Accent at any hue | `color/generate.ts`, `axes/color.ts` | 72 hue presets beside the 11 named; the named paint exactly as before (2,106 painted pixels compared with the previous build, every accent in both modes and every role built on it) |
| Accent strength | `axes/accent.ts`, `emit/base.ts` | Not chroma at a held lightness (that moved blue 500's label 0.3:1 and broke the solved steps from 90%): an OKLab mix toward the gray of the colour's own luminance, hue exact, WCAG within 0.09:1. The tonal and indicator solvers walk at every strength |
| Light solid, Dark solid | `axes/accent.ts`, `scale.ts solidAt` | Steps 400–850 clamped toward the label's side; dark's Auto is the solver's own step (question 7) |
| Tint to 16, Tint hue Accent | `axes/tint.ts`, `color/layers.ts` | A tint is held inside its hue's sRGB room (`tintRoom`), not clipped: clipping painted a blue tint cyan and tipped control edges under 3:1 on red pages from Tint 12. The fade toward white stays (question 8) |
| Hued inks on tinted pages | `color/layers.ts HUED_INK_MARGIN`, `scale.ts` | Inks darken as for a page 0.25 × its tint darker; tonal inks stay under `TONAL_Y`. Found by the new tinted-page test: a red tint at 8 on a 92 page (an option before this work) left danger's vivid ink at 4.3:1 |
| Gate | `contrast/accents.test.ts`, `layers.test.ts` | Every accent × strength × Solid step × neutral × mode (about a million measurements); inks of every accent on every tinted page; CSS and model agree to the channel (measured in the browser) |
| Setup | `theme-setup.tsx`, `page-colour.ts` | Greys as one first choice (Neutral, Warmer, Cooler, Tinted, Accent), each opening only its refinements; accent swatches, every hue behind More hues, and an accent colour field that snaps (#1F3A68 → hue 255°, strength 80, Light solid 800, ΔE 0.014) |

Answered by the build: question 3 (5° hues, the Tint grid), 4 (static presets in `axes.css`, about 790 KB, 80 KB gzipped,
since the CSS emitter ships no runtime code), 6 (absolute steps, held at the room), 7 (dark's Auto is its own step), 8 (fade
kept). Still open: 1 (palette names, Level 1 is not built), 2 (a separate button colour, deferred by the owner), 5 (P3).
