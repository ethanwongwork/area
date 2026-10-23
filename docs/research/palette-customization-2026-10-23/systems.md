# Palette customisation: how existing systems do it

Research notes, 2026-10-23. Every claim cites the page or source file it was read from on that date. "Source" means code read directly from the repository or the published package. Where a primary page could not be fetched (403 / JS-only), the note says so and names the fallback.

## Sources

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

---

## 1. Radix Themes and Radix Colors custom generator

**a. Chooses**
- Themes: `accentColor` (26 named scales, default `indigo`), `grayColor` (6 grays: gray, mauve, slate, sage, olive, sand; default `auto`), `appearance` (`inherit`/`light`/`dark`), `panelBackground` (`solid`/`translucent`, default translucent); also `radius`, `scaling` [1][2].
- Custom generator: three colours, `accent`, `gray`, `background`, plus the appearance (light or dark) [6].

**b. Derived**
- `grayColor="auto"` maps each accent to a gray by family (e.g. red/pink/purple/violet → mauve; blue/indigo/sky/cyan → slate; teal/green/mint → sage; grass/lime → olive; yellow/amber/orange/brown/gold/bronze → sand) [3].
- Every scale has 12 steps with fixed roles: 1–2 app backgrounds, 3–5 component bg normal/hover/pressed, 6–8 borders (8 also focus rings), 9 solid (highest chroma), 10 solid hover, 11 low-contrast text, 12 high-contrast text [4].
- Functional tokens `surface`, `indicator`, `track`, `contrast` [1].
- Generator [6]:
  - Finds the two nearest built-in Radix scales to the input (ΔE OK) and mixes them in a ratio found by triangle geometry. Then it sets **every step's hue to the input hue** and scales chroma by input/base ratio, capped at 1.5× input chroma.
  - Re-curves step lightness so step 1 starts at the background's L, using a Bezier easing (separate light/dark easings).
  - Step 9 = the exact input colour unless it is within ΔE OK 25 of step 1, in which case it keeps the template's step 9.
  - Step 10 (hover) = L − 0.03/(L+0.1) and chroma ×0.93 when L > 0.4, else lighter; then takes hue and chroma from the closest in-scale colour.
  - Text steps 11–12 have their chroma capped at max(step 8, step 9 chroma).
  - Alpha variants of every step are solved against the background, in both sRGB hex and P3; accent surface = step 2 at 80% (light) / 50% (dark).
  - Pure black or white accent → reuses the gray scale.

**c. Contrast**
- Steps 11 and 12 are guaranteed Lc 60 and Lc 90 APCA on step 2 of the same scale [4].
- Most step 9s take white text; Sky, Mint, Lime, Yellow, Amber are designed for dark text [4].
- Generator: text on step 9 is white unless |APCA(white, step 9)| < 40, in which case it is `oklch(0.25, max(0.08·C, 0.04), H)` [6]. No other runtime contrast check exists. The guarantees come from the hand-tuned template scales whose lightness the generator reuses.

**d. Light/dark**
- Every colour has separate hand-tuned light and dark scales [1].
- The generator uses the dark template scales when appearance is dark, and the user must generate dark CSS separately and paste it after the light overrides [1][5].

**e. Colour space**
- OKLCH via colorjs.io for all maths; output in hex (sRGB) plus `oklch()`/`color(display-p3)` wide-gamut strings [6].

**f. Tricks**
- A background-colour input moves the whole lightness curve (works for off-white/cream grounds).
- "Snap to nearest hand-made scale, then re-hue" keeps the hand-tuned chroma curve.
- Exact-input step 9.
- Near-ground guard (ΔE < 25).
- Alpha steps solved per background [6].

## 2. Material 3 dynamic colour (material-color-utilities, Theme Builder)

**a. Chooses**
- One source/seed colour (or image), a **variant** (Monochrome, Neutral, TonalSpot, Vibrant, Expressive, Fidelity, Content, Rainbow, FruitSalad, CMF) [12], `isDark`, and `contrastLevel` from −1 to 1 (0 standard, 0.5 medium, 1 high) [9][11].
- Theme Builder adds overrides for Primary, Secondary, Tertiary, Neutral key colours, custom ("extended") colours with a Harmonize option, and "Color Match" for brand fidelity [17].

**b. Derived**
- Six tonal palettes (primary, secondary, tertiary, neutral, neutral-variant, error). Each is a hue+chroma pair from which any tone 0–100 can be drawn [9].
- Variant sets each palette's hue/chroma. For example, TonalSpot: primary chroma 36, secondary 16, tertiary hue +60° chroma 24, neutral 6 (2021 spec). Vibrant primary chroma 200 (i.e. max), Neutral primary 12, Monochrome 0, Fidelity/Content primary = source chroma, Expressive primary hue +240° [9][10].
- Roles are tones on a palette. Light/dark examples: primary T40/T80, onPrimary T100/T20, primaryContainer T90/T30, onSurface T10/T90, outline T50/T60, outlineVariant T80/T30. Surface containers move with contrast level [10].
- Fidelity/Content put the source colour in primaryContainer at its own tone [10].
- Hover/focus/pressed/dragged are not separate colours. They are state layers of the content colour at 8% / 10% / 10% / 16% opacity [16].
- Custom colour → `color`, `onColor`, `colorContainer`, `onColorContainer` at tones 40/100/90/10 (light) and 80/20/30/90 (dark), optionally harmonised first [14].

**c. Contrast**
- Contrast is guaranteed by tone: "a difference of 40 in tone guarantees a WCAG contrast ratio ≥ 3.0; a difference of 50 … ≥ 4.5" [8].
- Each role declares a background and a `ContrastCurve(low, normal, medium, high)`. Examples: onPrimary on primary 4.5/7/11/21, primary on surface 3/4.5/7/7, outline 1.5/3/4.5/7 [10][11].
- Default = AA (4.5:1 text, 3:1 required non-text); medium exceeds AA; high = AAA (7:1 text, 4.5:1 non-text) [8].
- `ToneDeltaPair` keeps e.g. primary and primaryContainer ≥10 tones apart [10].

**d. Light/dark**
- Derived from the same palettes by picking different tones (mirrored role tables, not inverted colours) [10].

**e. Colour space**
- HCT. Hue and chroma come from CAM16, tone is L* from CIELAB. Out-of-gamut colours keep tone and reduce chroma until displayable [7].

**f. Tricks**
- `harmonize` rotates a custom colour's hue toward the source by min(½·difference, 15°), keeping chroma and tone [13].
- `DislikeAnalyzer` lifts dark yellow-greens (hue 90–111, chroma > 16, tone < 65) to tone 70, because they are "universally disliked" [15].
- Chroma requests above gamut (e.g. 200) are safe because the solver clamps chroma at constant tone [7][9].

## 3. Tailwind CSS v4 default palette

**a. Chooses**
- Nothing at runtime. Authors override `--color-*` variables in `@theme`, remove families with `--color-lime-*: initial`, or remove all with `--color-*: initial` and define their own. `@theme inline` references other variables [18].

**b. Derived**
- Nothing. Each of 26 families has 11 hand-set steps (50…950) [18]. Utilities are generated from whatever variables exist [18].

**c. Contrast**
- No stated guarantee [18].
- The values are not lightness-locked across hues. yellow-500 is `oklch(79.5% 0.184 86.047)` while blue-500 is `oklch(62.3% 0.214 259.815)`, and red-500 is L 63.7% [20].

**d. Light/dark**
- One palette. Dark mode is the author's job (`dark:` variant). No dark palette [18].

**e. Colour space**
- OKLCH (moved from rgb "to make the colors more vivid" using the wider gamut). "We've tried to keep the balance between all the colors the same as it was in v3" [19].

**f. Tricks**
- Hue drifts across steps within a family. Yellow runs from hue 102.2 at 50 to 53.8 at 950 (darker yellows turn orange/brown); amber 95.3 → 45.6 [20].
- Grays carry slight hue: gray ≈ 248–264 (cool), stone ≈ 49–106 (warm), neutral chroma 0 [20].

## 4. shadcn/ui themes (and tweakcn)

**a. Chooses**
- A **base colour** (Neutral, Stone, Zinc, Mauve, Olive, Mist, Taupe) via `tailwind.baseColor` [21]. A **theme/accent** from 17 hues (amber, blue, cyan, emerald, fuchsia, green, indigo, lime, orange, pink, purple, red, rose, sky, teal, violet, yellow) [23]. Radius.
- tweakcn exposes every token individually: Primary, Secondary, Accent, Base, Card, Popover, Muted, Destructive, Border/Input/Ring, Chart 1–5, Sidebar ×8, plus Typography/Other tabs, a "Generate" tab, presets, import/share/code export [25].

**b. Derived**
- Nothing is computed. A theme is `{...baseColor.cssVars, ...accentTheme.cssVars}` for light and dark separately [24].
- An accent theme only overrides `primary`, `primary-foreground`, `secondary(-foreground)`, `chart-1…5`, `sidebar-primary(-foreground)` [23].
- Hover/pressed come from component classes (e.g. opacity), not tokens [21].

**c. Contrast**
- Hand-picked per hue. Yellow light primary `oklch(0.852 0.199 91.936)` takes dark foreground `oklch(0.421 0.095 57.708)`. Amber's dark-mode primary drops to L 0.473 to keep a light foreground [23]. No automatic check.

**d. Light/dark**
- Separate hand-written `:root` and `.dark` values per token [21]. In March 2025 the dark palette was "revised for better accessibility" [22].

**e. Colour space**
- OKLCH since the Tailwind v4 move ("HSL colors are now converted to OKLCH") [22].

**f. Tricks**
- Naming convention: surface token + `-foreground` pair [21].
- Dark borders are translucent white (`oklch(1 0 0 / 10%)`, input 15%) so they work on any dark ground [23].

## 5. Apple: accent and tint

**a. Chooses**
- App: one **AccentColor** colour set (Global Accent Color Name build setting) with optional Any/Dark and High Contrast variants [27].
- Per view: `.tint(_:)` (any ShapeStyle) [28]; UIKit `tintColor` [30].
- User (macOS 26): Appearance Light/Dark/Auto; accent **Color**; **Text highlight color**; Liquid Glass slider from clear to heaviest tint; Icon & widget style Default/Dark/Clear/Tinted; folder colour; "Tint window background with wallpaper color" [31].

**b. Derived**
- The system derives control rendering from the tint. For example, macOS `.bordered` buttons don't tint their background but `.borderedProminent` do, and macOS doesn't tint labels while other platforms do [28].
- `tintAdjustmentMode = .dimmed` automatically dims the tint [30].
- Dynamic system colours "automatically adapt to both light and dark contexts" and are "semantically defined by its purpose" [26].
- Prominent buttons put the accent on the Liquid Glass background [26].

**c. Contrast**
- System colours ship light, dark and increased-contrast variants. Custom colours should supply "an increased contrast option for each variant" [26]. No algorithmic guarantee for custom colours.

**d. Light/dark**
- Separate authored variants per appearance, and per increased contrast [26][27].

**e. Colour space**
- sRGB / Display P3 assets [26].

**f. Tricks**
- On macOS the user's accent replaces the app's accent unless the user picks **Multicolor** [26][29].
- `.tint` is "always respected" (meant to carry meaning) whereas the accent "can be overridden by user preference" [28].
- Fixed-colour sidebar icons are not overridden [26].
- HIG: "Refrain from adding color to the background of multiple controls"; on colourful content prefer monochrome bars [26].

## 6. Linear theme generator

**a. Chooses**
- Three variables: "base color, accent color, and contrast" (previously 98 per theme) [32]. Presets or a custom theme; light/dark/system [33].

**b. Derived**
- "Core variables, plus operations applied to them" generate aliases for surfaces, text, icons and controls, including elevations (background, panels, dialogs, modals) [32].
- The chrome colour's contribution was limited "to achieve a more neutral look" [32].

**c. Contrast**
- A contrast input defines "how contrasty a theme should be". The same input yields high-contrast themes automatically [32]. Formulas are not published.

**d. Light/dark**
- The same generator produces the main light and dark themes [32].

**e. Colour space**
- LCH instead of the earlier HSL, because same-lightness colours look equally light [32].

**f. Tricks**
- One generator for built-in and user themes. Themes shareable; 70+ community themes at linear.style [33].

## 7. Atlassian custom brand theme and GitHub Primer

### Atlassian (`@atlaskit/tokens` 20.7.0)

**a. Chooses**
- One `brandColor` hex via `setGlobalTheme({ UNSAFE_themeOptions: { brandColor } })`, plus colour mode [37].

**b. Derived** [34][35]
- A 10-step ramp at fixed WCAG contrast ratios against white. "Low-luminance" hues use 1.12…14.25 and "high-luminance" hues use 1.08…12.6; the hue's class is decided by the luminance of HSL(h, 100%, 60%) < 0.4.
- Each step = HCT(brand hue, brand chroma, tone = `Contrast.darker(100, ratio)`).
- The nearest ramp step is **replaced by the exact brand colour**.
- About 25 tokens are mapped to ramp indices: text/icon/border brand, bg brand subtlest/bold/boldest each with hovered/pressed, selected, link, chart.
- If brand-on-white contrast ≥ 4.5 the brand is used as bold bg and text, and hover/pressed are the next darker steps. Otherwise bold bg = step 6, hover 7, pressed 8.

**c. Contrast**
- Ramp built from target ratios [34].
- Edge cases shift text one step darker, e.g. contrast 4.8–5.4 at index 6 [35].
- `additionalContrastChecker` tests listed token pairs and moves tokens one ramp step (darker in light mode, lighter in dark) when contrast ≤ the desired value [36].

**d. Light/dark**
- Dark is derived "using rule of symmetry": dark index = 9 − light index [35].
- A forum user reports the brand colour shifts lighter in dark mode and asks how to keep it constant (no answer seen) [forum: https://community.developer.atlassian.com/t/is-there-a-way-to-keep-brand-color-same-in-dark-llight-in-atlaskit/81376].

**e. Colour space**
- HCT (Material's utilities) for the ramp, WCAG 2 ratios for checks [34].

**f. Tricks**
- Contrast-ratio-defined steps.
- Two ratio tables by hue luminance class (yellows vs blues).
- Exact brand substitution.
- Index-shift fixes [34][35][36].

### GitHub Primer

**a. Chooses**
- End users pick a theme. Primer ships light, light-high-contrast, light-protanopia-deuteranopia (+HC), light-tritanopia (+HC), dark, dark-dimmed (+HC), dark-high-contrast, dark-protanopia-deuteranopia (+HC), dark-tritanopia (+HC) [39].

**b. Derived**
- Base scales feed functional tokens. Each functional token has a default plus per-theme overrides (e.g. `bgColor.default` = neutral 0, `dark` = neutral 1, `dark-dimmed` = neutral 3) [40].
- Semantic colours have fg/muted/emphasis variants [38].

**c. Contrast**
- Neutral step roles: 0–5 backgrounds, 7–8 borders, 9–10 text. Step 9 is the minimum for text on 0–4, step 10 on 5–6, step 8 for control borders on muted.
- High-contrast themes shift roles (bg 2–7, border 10, text 11–13) with "a minimum of 7:1 for most text and interactive elements" [38].
- Prism checks pairs with WCAG 2 [41].

**d. Light/dark**
- Neutral scales are inverted between modes (light runs white→black, dark black→white), so themes share functional tokens "without custom overrides" [38].

**e. Colour space**
- Prism used HSLuv for perceptually uniform lightness [41].

**f. Tricks**
- One lightness curve shared across all hue scales; lightness/contrast first, hue/saturation later.
- Hue shifted per step by hand (blue tints toward green, shades toward purple), described as "more of an art than a science" [41]. Prism is archived/experimental [41].

## 8. Adobe Leonardo

**a. Chooses**
- Per colour: `colorKeys` (one or more key colours), interpolation `colorspace`, target `ratios` (array or named object), `smooth`.
- Per theme: one `BackgroundColor`, `lightness` 0–100 (of the background), `contrast` multiplier (default 1), `saturation` 0–100, `output` format, and `formula` `wcag2` or `wcag3` (APCA) [42][43].
- Web tool: Lightness, Contrast and Saturation sliders, background colour, contrast formula (Relative Luminance / APCA), analysis colour space, output format [44].

**b. Derived**
- For each target ratio, the colour along the key-colour lightness scale that meets it against the current background. Ratios are names, e.g. `blue--largeText: 3` [42].

**c. Contrast**
- Contrast is the input. Colours are searched to hit the ratio (output "slightly higher" than target) [42].
- The contrast multiplier scales all ratios [43].
- Negative ratios produce colours lighter/darker than the background [42].

**d. Light/dark**
- "Adaptive": change `lightness` of the background and every colour is regenerated to the same ratios. Dark mode is a lightness value, not a second palette [42][43].
- APCA sign flips by background lightness [43].

**e. Colour space**
- Interpolation in LCH, LAB, CAM02, HSL, HSLuv, HSV or RGB; outputs include HEX, RGB, HSL, HSV, HSLuv, LAB, LCH, CAM02 [42].

**f. Tricks**
- Several key colours define a hue path, so hue can shift across lightness.
- Global saturation slider.
- Ratios-as-names gives role-stable tokens [42].

## 9. Huetone (Alexey Ardov)

**a. Chooses**
- A grid of hues × tones. Each cell is edited by L, C, H with keys (L/C/H + arrows). Rows and columns can be added, duplicated and reordered. Colours can be pasted in any format [45].

**b. Derived**
- New hue rows start as a gray lightness ramp.
- "Current luminance to column" and "current hue to row" equalise one axis across the grid [45].

**c. Contrast**
- APCA, credited as the WCAG 3 working draft [45]. The README states the aim: "accessible color systems with predictable contrast ratios" [45].

**d. Light/dark**
- Theme button for the app. Presets include separate Radix light and dark palettes, so dark is a separate palette [45].

**e. Colour space**
- CIE LCH (C 0–134) or OKLCH (C 0–0.33), switchable [45].

**f. Tricks**
- "Not all LCH colors are displayable in RGB color space. This button will tweak all LCH values to be displayable" (push into sRGB).
- Hold B for a grayscale preview.
- Presets from Ant, GitHub, IBM, Stripe, Tailwind, USWDS and others.
- Export to Figma Tokens and CSS [45].

## 10. tints.dev

**a. Chooses**
- One hex. Its stop (default 500, or auto, or any 50–950). Hue tweak `h`, saturation tweak `s`, `lMin`/`lMax` (defaults 0/100), and colour mode `perceived` (default) or `linear`. Output in oklch, hex, p-3 or hsl [46].

**b. Derived** [46]
- The stops 50…950 plus virtual 0 and 1000.
- Lightness is linearly interpolated from `lMax` at 0 to the input's lightness at its stop, then to `lMin` at 1000. Lightness means HSLuv L in perceived mode, HSL L in linear mode.
- Hue shifts by `|steps from input| × h`. Saturation increases away from the input.
- The input stop keeps the exact hex.

**c. Contrast**
- None [46].

**d. Light/dark**
- None [46].

**e. Colour space**
- HSLuv (perceived) or HSL (linear) internally, via chroma-js and hsluv [46].

**f. Tricks**
- "Auto" stop picks the stop whose lightness (HSL L or relative luminance) is closest to the input's, using a baseline palette built from #1E70F6 [46].
- Hue-rotate-per-step slider.

## 11. uicolors.app

**a. Chooses**
- A hex (or HSL), "Color harmony settings" (auto), plus Brand / Neutral / Status tabs for secondary, neutral and status scales. Component previews include shadcn/ui [47].

**b. Derived**
- An 11-shade 50–950 scale with a generated name. The API returns hex + HSL per shade. In the API example the input appears unchanged as 500 [47].

**c–f.**
- The algorithm (shade placement, hue shift, colour space) is not publicly documented. It is closed source, and neither page explains it [47]. Treat any claim beyond this as unverified.

## 12. Figma (UI theme, Variables/modes, Slides)

**a. Chooses**
- Figma's own UI: Light, Dark or System, plus enhanced contrast mode, auto-enabled when the OS has increased contrast. Device-specific; no accent colour [48].
- Variables: collections with modes, one value per variable per mode, e.g. light/dark, high-contrast, colour-blind themes [49].
- Extended collections (Enterprise): a parent collection extended once per brand, with overrides [50].
- Slides: template colour styles editable via "Edit template style"; "Remix template colors" cycles combinations (search-result summary; page not fetched in full) [51].

**b. Derived**
- No colour derivation. Objects default to mode **Auto** and inherit the parent container's mode up the tree, falling back to the collection default [49].
- Extensions inherit every non-overridden parent value [50].

**c. Contrast**
- No automatic checks in variables [49][50].

**d. Light/dark**
- Authored as separate modes [49]. The UI theme does not change canvas colours of new pages [48].

**e. Colour space**
- sRGB or Display P3 document profile (see Harmonizer [58]).

**f. Tricks**
- Inherited mode per container lets one subtree show dark inside a light page [49].
- Extended collections: you cannot add variables or modes in an extension. Colour and opacity override as one unit, so later parent changes may not reach the extension [50].

## Optional extras

- **ChatGPT.**
  - The official OpenAI help page returned 403 to every fetch attempt (bot check, not bypassed).
  - Search-index text of that page: under Settings → General → Accent color, options Default, Blue, Green, Yellow, Pink, Orange, Purple, Black (a neutral may show as Black or White, availability varies), synced to the account [52].
  - Pureinfotech (secondary) lists blue, green, yellow, pink, orange + Default (gray) [52].
  - So: one accent choice from a small fixed set, no custom hex.
- **Notion.** Appearance: Use system / Light / Dark, applying to all workspaces. High contrast: Use system / Standard / High contrast, which "increases contrast across text, icons, and borders", per device, desktop/web only. No accent or theme colour [53].
- **Slack.**
  - Preset themes or a Custom theme: "For each element, select a swatch from the color picker". Element list not given on the page.
  - "Window gradient" option; "Darker sidebars" contrast option for light-sidebar themes.
  - Dark mode separate; themes shareable/importable [54].
- **Discord.** Four default themes (Light, Ash, Dark, Onyx) with a Dark Sidebar option for Light. Nitro: 28 colour themes, and a custom theme mixing "up to FIVE colors" (desktop only) [55]. The help article (403) is reported via search to add gradient direction and colour-intensity sliders (unverified).
- **Open Props.**
  - One OKLCH ramp `--color-1…16` driven by `--palette-hue`, `--palette-hue-rotate-by` (per-step hue rotation) and `--palette-chroma` (a multiplier on fixed per-step chroma).
  - Lightness is fixed per step, from 98% down to 10% [56].
  - Dark mode maps surfaces to the other end of the gray ramp (e.g. `--surface-1-dark: var(--gray-12)`) [56].
- **Reasonable Colors.**
  - 24 hues 15° apart in LCH plus gray, 6 shades each.
  - Shade-number difference guarantees contrast across any colour sets: 2 → ≥3:1, 3 → ≥4.5:1, 4 → ≥7:1 [57].
- **Evil Martians Harmonizer.**
  - Inputs: hues (angles), levels with a target contrast each (APCA default, or WCAG), background colours, optional per-level chroma cap, colour space P3/sRGB [58].
  - Each cell is solved with apcach to hit the level's contrast against the background [58].
  - In "even" chroma mode, each level's chroma is the **maximum chroma every hue can reach at that contrast** (`maxCommonChroma` takes the minimum over hues), so all hues look equally saturated. Otherwise each hue gets its own max [58].
  - Two backgrounds (left/right) can apply to different level ranges, e.g. light and dark grounds [58].
  - Names the problem "Themes don't mirror" [58].

---

## General lessons

1. **Same lightness value ≠ same look in HSL. Even in perceptual spaces, hues differ in where their chroma lives.**
   - HSL lightness "is not consistent across hue axes" [59].
   - Linear moved from HSL to LCH for this reason [32]. Primer used HSLuv [41]; Radix, Tailwind, shadcn and Harmonizer use OKLCH [6][18][22][58].
   - Hand-tuned palettes do not lock lightness across hues. Tailwind yellow-500 is L 79.5% vs blue-500 62.3% [20]. Radix makes yellow/amber/lime/mint/sky step 9 take dark text [4]. Atlassian uses a separate, lower ratio table for high-luminance hues [34].
   - Systems that do lock lightness or contrast per step (Reasonable Colors, Harmonizer, Leonardo, Atlassian's ramp) get cross-hue contrast guarantees. A yellow at a blue's lightness becomes dark olive/brown [57][58][42][34].
2. **Dark yellows go muddy; tools special-case them.**
   - Material lifts dark yellow-greens to tone 70 [15].
   - Tailwind rotates yellow's hue toward orange as it darkens (102° → 54°) [20]. Primer hand-shifts hue per step [41]. tints.dev and Open Props expose a per-step hue-rotate control [46][56].
3. **Out-of-gamut chroma must be reduced at constant lightness/hue, not clipped.**
   - Browser clipping "could change a color's hue". Reducing chroma keeps hue [59]. HCT does this by design ("keeps the tone, and reduces chroma") [7]. Huetone has an explicit "push into RGB" action [45].
   - Harmonizer's even mode takes the lowest common max chroma per level [58]. Radix caps generated chroma at 1.5× input [6].
4. **Dark mode is not an inversion.**
   - Material picks different tones per role (primary T40 → T80, onPrimary T100 → T20) [10].
   - Radix ships separate hand-tuned dark scales [1]. shadcn hand-writes `.dark` and had to revise its dark palette for accessibility [22].
   - Atlassian's mirrored "9 − index" is the closest to inversion, and users notice the brand colour shifting [35].
   - Primer inverts the neutral scale, but only neutrals [38]. Harmonizer names the issue "Themes don't mirror" [58].
5. **The ground colour is an input in the better generators.**
   - Radix (background input bends the lightness curve, alpha steps solved per ground) [6]. Leonardo (background + lightness, adaptive) [42]. Harmonizer (two grounds) [58].
   - Without it, a very light or tinted ground (cream, butter yellow) or a near-black ground breaks accent-text contrast. Radix guards the case where the accent is within ΔE 25 of the ground [6].
6. **Keep the person's exact colour somewhere visible, and derive the rest around it.**
   - Radix step 9 = input [6]. Atlassian replaces the nearest ramp step with the brand hex [34]. tints.dev keeps the input stop exact [46]. Material Fidelity/Content place the source in primaryContainer [10].
   - Then text-on-colour is chosen by a contrast test: Radix APCA < 40 → dark text [6]; Atlassian branches on brand-on-white ≥ 4.5 [35]; Material uses ContrastCurve [10].
7. **Contrast as a user-facing control works when roles are defined by contrast targets.**
   - Material −1…1 with per-role curves [11]. Linear's contrast slider [32]. Leonardo's contrast multiplier [43]. Primer/Notion/Figma/Apple high-contrast as a separate mode or toggle [38][53][48][26].
8. **States are usually derived, not chosen.**
   - Material uses state-layer opacity, 8/10/10/16% [16]. Radix uses a fixed step 3/4/5 and 9/10, with a generated hover formula [4][6]. Atlassian uses the next ramp indices [35]. Apple derives from the tint, and dims it under modals [28][30].
9. **Neutral warmth is a separate, small choice paired to the accent.**
   - Radix 6 grays auto-paired by accent family [3]. shadcn 7 base colours [21]. Tailwind slate/gray/zinc/neutral/stone (+ taupe/mauve/mist/olive) [18].
   - Material's neutral palette inherits the source hue at chroma 2–12 depending on variant [9]. Linear limits how much the accent tints neutral chrome [32].
10. **Per-role override layers exist but are unguarded.**
    - shadcn/tweakcn let any token be set by hand with no derivation or contrast check [23][25]. Figma extended collections override per brand [50]. Material Theme Builder lets core colours override the source [17]. Atlassian runs a post-hoc checker that nudges tokens [36].
    - The guarded pattern is: override a role → re-derive its on-colour and states → check against its declared background.
11. **Consumer apps keep the choice tiny.** ChatGPT offers about 5–7 fixed accents [52]. Notion offers no accent, only mode + high contrast [53]. macOS offers accent + highlight + glass tint [31]. Discord gives up to 5 gradient colours (Nitro) [55], and Slack gives per-element pickers [54].
