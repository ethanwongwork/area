# Prior-art survey

All documentation and source snapshots checked **2026-10-08**. Source links pin full commit SHAs and one-based line ranges. “Not found” is bounded to the named APIs, documents and source files; it is not a claim that arbitrary custom CSS is impossible. No vendor accessibility/performance claims were independently tested.

<a id="apple"></a>
## Apple HIG materials and Liquid Glass

**Category:** Native platform material system.

**Controls:** Standard content materials use thickness categories; Liquid Glass exposes Regular/Clear, shape, tint, interactive behavior and grouping. UIKit exposes tintColor and isInteractive; SwiftUI exposes glassEffect and GlassEffectContainer. These are constrained semantic APIs, not raw blur/refraction/shadow sliders.

**Propagation:** HIG distinguishes content materials from glass navigation/control surfaces. The native system adapts the optical treatment to context and interaction.

**Limit / interpretation:** A proprietary runtime with developer APIs. Not found: public shader source or a user-editable arbitrary material family applied throughout the entire component catalogue.

**Documentation:** [HIG materials](https://developer.apple.com/design/human-interface-guidelines/materials?changes=l_6); [WWDC25 UIKit controls](https://developer.apple.com/videos/play/wwdc2025/284/); [WWDC25 SwiftUI](https://developer.apple.com/videos/play/wwdc2025/323/) (checked 2026-10-08).

<a id="visionos"></a>
## visionOS

**Category:** Native spatial material system.

**Controls:** System window glass is unmodifiable. Thin, regular and thick materials serve interactive elements, section backgrounds and distinct darker regions. glassBackgroundEffect accepts shape/display mode; feathered effects expose padding and soft-edge radius.

**Propagation:** Glass responds to physical/virtual surroundings; the HIG does not define a separate visionOS Dark Mode. Vibrancy helps foreground content remain legible.

**Limit / interpretation:** Strong role-specific absorption, deliberately limited optical knobs; no public source implementing the native glass compositor was found. Do not equate this window material with a CSS frosted card.

**Documentation:** [HIG visionOS materials](https://developer.apple.com/design/human-interface-guidelines/materials?changes=l_6); [GlassBackgroundEffect API](https://developer.apple.com/documentation/swiftui/glassbackgroundeffect?changes=_2) (checked 2026-10-08).

<a id="fluent"></a>
## Fluent 2: solid, Acrylic, Mica, Smoke

**Category:** Platform materials + tokenized components.

**Controls:** AcrylicBrush exposes TintColor, TintOpacity, TintLuminosityOpacity, TintTransitionDuration and AlwaysUseFallback. Fluent describes solid, translucent Acrylic, wallpaper-informed opaque Mica and translucent-black Smoke. Smoke dims the interface beneath modal surfaces; it is not a blur material.

**Propagation:** Roles differ: Acrylic is for transient surfaces, Mica for window foundations, Smoke for blocking overlays. The WinUI brush is usable source/API; Fluent web themes must not be assumed to provide every Windows compositor feature.

**Limit / interpretation:** Closest native role vocabulary, but not a general material-family switch across every control. Mica and Acrylic have platform-specific acquisition/fallback behavior. No shared glass/paper/clay parameter schema found in the inspected brush API and Fluent guide.

**Documentation:** [Fluent material guide](https://fluent2.microsoft.design/material); [Acrylic](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic); [Mica](https://learn.microsoft.com/en-us/windows/apps/design/style/mica) (checked 2026-10-08).

**Pinned source:** [fluent: controls/dev/Materials/Acrylic/AcrylicBrush.idl L9–29](https://github.com/microsoft/microsoft-ui-xaml/blob/901ffc065a1f3a1122bbfe6d222eb80a471f28a6/controls/dev/Materials/Acrylic/AcrylicBrush.idl#L9-L29).

<a id="m3"></a>
## Material 3

**Category:** Theme + tonal and shadow elevation.

**Controls:** Compose MaterialTheme takes colorScheme, shapes, typography and motionScheme. Surface separates color, contentColor, shape, border, tonalElevation and shadowElevation. Tonal elevation accumulates with ancestor surfaces and changes the surface tint; shadow elevation does not change z-order.

**Propagation:** Components consume theme defaults and Surface provides parent-relative elevation/color behavior. Tonal elevation is color composition, not backdrop translucency.

**Limit / interpretation:** A substantial open implementation of one design language. Not found: interchangeable physical materials or controls for shared grain, directional gloss and refraction in these APIs.

**Documentation:** [M2→M3 tonal elevation](https://developer.android.com/develop/ui/compose/designsystems/material2-material3) (checked 2026-10-08).

**Pinned source:** [material: compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Surface.kt L64–123](https://github.com/androidx/androidx/blob/0f80bf7a8635fc07c5525f26952f1eb28709d98b/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Surface.kt#L64-L123); [material: compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MaterialTheme.kt L85–104](https://github.com/androidx/androidx/blob/0f80bf7a8635fc07c5525f26952f1eb28709d98b/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MaterialTheme.kt#L85-L104).

<a id="m3-expressive"></a>
## Material 3 Expressive

**Category:** Expressive theme defaults.

**Controls:** MaterialExpressiveTheme exposes colorScheme, motionScheme, shapes and typography, with expressive color/motion defaults. Button and Checkbox use defaults from this boundary.

**Propagation:** It changes defaults and supports nested MaterialTheme overrides; it is broader than a palette change but does not add a physical-material selector to the inspected API.

**Limit / interpretation:** Do not infer blur, glass or adjustable lighting from the name Expressive. Its tonal/shadow foundations remain separate concepts.

**Documentation:** [MaterialExpressiveTheme API](https://developer.android.com/reference/kotlin/androidx/compose/material3/MaterialExpressiveTheme.composable) (checked 2026-10-08).

**Pinned source:** [material: compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MaterialTheme.kt L215–268](https://github.com/androidx/androidx/blob/0f80bf7a8635fc07c5525f26952f1eb28709d98b/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MaterialTheme.kt#L215-L268).

<a id="radix"></a>
## Radix Themes

**Category:** Theme boundary with a panel-material switch.

**Controls:** Theme exposes appearance, accentColor, grayColor, radius, scaling, hasBackground and panelBackground. The latter selects solid/translucent panel paint and none/blur(64px) in the pinned CSS. CSS-variable overrides can change those defaults.

**Propagation:** Panel, form-surface and overlay colors have distinct tokens. This is a real shared optical switch for a surface role, not only color branding.

**Limit / interpretation:** Narrower than a full material layer: the inspected API offers no shared light direction, grain, inner relief or refraction knobs; panel translucency does not mean every component becomes glass.

**Documentation:** [Theme API](https://www.radix-ui.com/themes/docs/components/theme); [color and panels](https://www.radix-ui.com/themes/docs/theme/color) (checked 2026-10-08).

**Pinned source:** [radix: packages/radix-ui-themes/src/components/theme.props.tsx L7–70](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/theme.props.tsx#L7-L70); [radix: packages/radix-ui-themes/src/styles/tokens/color.css L126–134](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/styles/tokens/color.css#L126-L134).

<a id="shadcn"></a>
## shadcn/ui and shadcn/create

**Category:** Distributed component source + style/theme presets.

**Controls:** Semantic background/foreground, card, popover, action, border, chart/sidebar and radius tokens; create previews color, radius, fonts and icons. The pinned style registry includes Vega, Nova, Maia, Lyra, Mira and Luma, with different spacing/shape descriptions.

**Propagation:** Generated/copied source consumes CSS variables and style-specific recipes. A named style can affect more than the palette.

**Limit / interpretation:** No shared optical parameter schema found in the inspected theming contract/style registry. Luma’s “luminous” description alone is not evidence of configurable refraction or a role material system.

**Documentation:** [Theming](https://ui.shadcn.com/docs/theming) (checked 2026-10-08).

**Pinned source:** [shadcn: apps/v4/content/docs/(root)/theming.mdx L8–37](https://github.com/shadcn-ui/ui/blob/97ddbf4274ed09d02aa7fd34375f2cf1e48cbbf0/apps/v4/content/docs/%28root%29/theming.mdx#L8-L37); [shadcn: apps/v4/registry/styles.tsx L1–120](https://github.com/shadcn-ui/ui/blob/97ddbf4274ed09d02aa7fd34375f2cf1e48cbbf0/apps/v4/registry/styles.tsx#L1-L120).

<a id="tweakcn"></a>
## tweakcn and comparable theme generators

**Category:** Visual token editor.

**Controls:** The schema exposes semantic colors, font families, radius, letter spacing, spacing and shadow color, opacity, blur, spread, x/y offsets. The shadow generator derives a size ladder from those inputs. shadcn/create and daisyUI’s theme generator are additional examples of editing a known token contract.

**Propagation:** Changes reach components that consume the generated theme tokens; generators do not automatically add missing effect layers to copied component markup.

**Limit / interpretation:** Much closer on adjustable shadows than a color-only editor, but no shared grain/refraction/specular-role contract found in the inspected schema. User-written CSS can add these; that is authoring a new system, not a shipped feature.

**Documentation:** [tweakcn repository](https://github.com/jnsahaj/tweakcn); [shadcn/create](https://ui.shadcn.com/create); [daisyUI themes](https://daisyui.com/docs/themes/) (checked 2026-10-08).

**Pinned source:** [tweakcn: types/theme.ts L50–68](https://github.com/jnsahaj/tweakcn/blob/a3b47b37cba97dd637de517aab52c45ec0f83456/types/theme.ts#L50-L68); [tweakcn: utils/shadows.ts L6–31](https://github.com/jnsahaj/tweakcn/blob/a3b47b37cba97dd637de517aab52c45ec0f83456/utils/shadows.ts#L6-L31).

<a id="chakra"></a>
## Chakra UI

**Category:** Token + recipe/slot-recipe engine.

**Controls:** Theme configuration exposes tokens, semanticTokens, layerStyles, recipes and slotRecipes. Shadows can be mode-dependent; layer styles can package backgrounds, borders, filters and shadows. Button variants consume semantic colorPalette roles.

**Propagation:** A capable framework for building a material system, with component slots and conditions, rather than a supplied family of physical-material recipes.

**Limit / interpretation:** Not found: a default global glass/paper/clay material contract in the inspected theming configuration, shadow tokens and Button recipe. Custom recipes remain possible.

**Documentation:** [Theming architecture](https://chakra-ui.com/docs/theming/overview) (checked 2026-10-08).

**Pinned source:** [chakra: packages/react/src/theme/semantic-tokens/shadows.ts L1–15](https://github.com/chakra-ui/chakra-ui/blob/f799e4d478d31fdae1311fad6c6de7cca47b9d3e/packages/react/src/theme/semantic-tokens/shadows.ts#L1-L15); [chakra: packages/react/src/theme/recipes/button.ts L115–138](https://github.com/chakra-ui/chakra-ui/blob/f799e4d478d31fdae1311fad6c6de7cca47b9d3e/packages/react/src/theme/recipes/button.ts#L115-L138).

<a id="mantine"></a>
## Mantine

**Category:** Theme object + component Styles API.

**Controls:** Theme includes colors/primaryColor, radius/defaultRadius, shadows, defaultGradient, components overrides and other extension data. Paper consumes a body color, radius and shadow rather than a physical paper simulation.

**Propagation:** Shared tokens propagate where components support them; the theme type explicitly bounds shadows and gradients to consumers of those props.

**Limit / interpretation:** No material selector or uniform optical controls found in the inspected theme interface. A custom material can be authored through component styles, but that requires the role mapping the owner wants supplied.

**Documentation:** [Theme object](https://mantine.dev/theming/theme-object/) (checked 2026-10-08).

**Pinned source:** [mantine: packages/@mantine/core/src/core/MantineProvider/theme.types.ts L85–135](https://github.com/mantinedev/mantine/blob/f0e2bc6d28b0f0b8aaefb5b859937bf77f539df7/packages/%40mantine/core/src/core/MantineProvider/theme.types.ts#L85-L135); [mantine: packages/@mantine/core/src/components/Paper/Paper.module.css L1–15](https://github.com/mantinedev/mantine/blob/f0e2bc6d28b0f0b8aaefb5b859937bf77f539df7/packages/%40mantine/core/src/components/Paper/Paper.module.css#L1-L15).

<a id="heroui"></a>
## HeroUI

**Category:** CSS-first semantic theme; version matters.

**Controls:** Current v3 separates surface, overlay and field tokens and provides CSS variable overrides. The Card migration guide explicitly removes v2 shadow/radius/isBlurred/isFooterBlurred props in favor of utilities; v3 Card has transparent/default/secondary/tertiary variants.

**Propagation:** Component-local blur in v2 is not evidence of a global material system. The current source uses semantic surface categories with component CSS.

**Limit / interpretation:** No all-component optical switch found in the inspected v3 theme and migration contract. Record v2 examples as historical; do not claim their props are the current API.

**Documentation:** [v3 styling migration](https://heroui.com/en/docs/react/migration/styling) (checked 2026-10-08).

**Pinned source:** [heroui: packages/styles/themes/default/variables.css L21–78](https://github.com/heroui-inc/heroui/blob/83b92dfccf847856d277504fed64d954c2dd9066/packages/styles/themes/default/variables.css#L21-L78); [heroui: apps/docs/content/docs/en/react/migration/(components)/card.mdx L65–82](https://github.com/heroui-inc/heroui/blob/83b92dfccf847856d277504fed64d954c2dd9066/apps/docs/content/docs/en/react/migration/%28components%29/card.mdx#L65-L82).

<a id="park"></a>
## Park UI

**Category:** Panda preset + component recipes.

**Controls:** The preset imports semantic colors, shadows, layerStyles and recipes. Button variants include solid, surface, subtle and outline; their parts consume semantic colorPalette roles.

**Propagation:** A shared visual system with extensible recipe infrastructure, but “surface” is a variant name rather than a transmissive-material model.

**Limit / interpretation:** Not found: a supplied material-family selector or global blur/grain/light parameters in the preset and Button source. Hosted theming URLs were unavailable in this run; the pinned source is the evidence.

**Documentation:** Public preset source below (docs URLs attempted: /docs/theme/overview and /docs/overview/theming). (checked 2026-10-08).

**Pinned source:** [park: packages/preset/src/index.ts L1–14](https://github.com/cschroeter/park-ui/blob/102769cc91a9d36753dbc5893c74b7954b495efe/packages/preset/src/index.ts#L1-L14); [park: packages/preset/src/recipes/button.ts L32–78](https://github.com/cschroeter/park-ui/blob/102769cc91a9d36753dbc5893c74b7954b495efe/packages/preset/src/recipes/button.ts#L32-L78).

<a id="carbon"></a>
## Carbon layers

**Category:** Contextual semantic layer tokens.

**Controls:** Layer sets map layer, layer-hover, layer-accent and field roles to ordered theme values. The emitter selects a level and writes the corresponding CSS custom properties.

**Propagation:** The reusable idea is contextual depth: descendants can use semantic roles instead of choosing absolute colors for every nesting level.

**Limit / interpretation:** A layer is an interface-background level, not glass/paper/neumorphic substance. No light/blur/grain/refraction controls found in the inspected layer module. Hosted pages failed to load; source is authoritative for this entry.

**Documentation:** Pinned layer module below; attempted Carbon layer/color usage docs were unavailable. (checked 2026-10-08).

**Pinned source:** [carbon: packages/styles/scss/layer/_layer-sets.scss L11–60](https://github.com/carbon-design-system/carbon/blob/35f38f48eefaf499bfd110c43577321c2e76cca5/packages/styles/scss/layer/_layer-sets.scss#L11-L60); [carbon: packages/styles/scss/layer/_layer-tokens.scss L13–19](https://github.com/carbon-design-system/carbon/blob/35f38f48eefaf499bfd110c43577321c2e76cca5/packages/styles/scss/layer/_layer-tokens.scss#L13-L19).

<a id="spectrum"></a>
## Spectrum and React Spectrum / S2

**Category:** Contextual backgrounds + provider theme.

**Controls:** Spectrum distinguishes editing/browsing background layers and elevated surfaces. The older React Spectrum Provider accepts theme, colorScheme and scale; S2 Provider offers light/dark and base/layer-1/layer-2 backgrounds with style-macro input.

**Propagation:** Semantic hierarchy and foreground/background roles propagate through providers. This is purposeful layering without a general optical-material API.

**Limit / interpretation:** Not found: global transmissive/reflective controls in the inspected Provider interfaces. Keep Spectrum guidance, S1 theme customization and S2 style APIs distinct.

**Documentation:** [Background layers](https://spectrum.adobe.com/foundations/color/background-layers) (checked 2026-10-08).

**Pinned source:** [spectrum: packages/@adobe/react-spectrum/src/provider/Provider.tsx L38–64](https://github.com/adobe/react-spectrum/blob/2691598d3efcdaf6f49f29ad1a44bbc1741765a3/packages/%40adobe/react-spectrum/src/provider/Provider.tsx#L38-L64); [spectrum: packages/@react-spectrum/s2/src/Provider.tsx L31–54](https://github.com/adobe/react-spectrum/blob/2691598d3efcdaf6f49f29ad1a44bbc1741765a3/packages/%40react-spectrum/s2/src/Provider.tsx#L31-L54).

<a id="polaris"></a>
## Polaris

**Category:** Shopify visual contract; historical React source.

**Controls:** Historical React Box exposes background, border color/style/radius and shadow from Polaris token types. The repository says React is deprecated in favor of Polaris Web Components.

**Propagation:** The current web-component documentation is a different delivery surface; old React source cannot establish its full current customization contract.

**Limit / interpretation:** No shared optical material layer found in the inspected Box/token contract or current overview. The repository’s custom license restricts usage to Shopify interoperability, so public source should not automatically be counted as unrestricted open-source prior art.

**Documentation:** [Current web components](https://shopify.dev/docs/api/app-home/latest/web-components) (checked 2026-10-08).

**Pinned source:** [polaris: polaris-react/src/components/Box/Box.tsx L1–55](https://github.com/Shopify/polaris/blob/3f7954ae42fabf26d63cee68c23ceebfd7ef0972/polaris-react/src/components/Box/Box.tsx#L1-L55); [polaris: README.md L10–15](https://github.com/Shopify/polaris/blob/3f7954ae42fabf26d63cee68c23ceebfd7ef0972/README.md#L10-L15); [polaris: README.md L74–78](https://github.com/Shopify/polaris/blob/3f7954ae42fabf26d63cee68c23ceebfd7ef0972/README.md#L74-L78).

<a id="geist"></a>
## Geist: Vercel guidance vs community Geist UI

**Category:** Role-based surface presets; separate implementations.

**Controls:** Vercel calls its bundled radii/fills/strokes/shadows “Materials”: base/small/medium/large and tooltip/menu/modal/fullscreen. The separate community Geist UI theme has palette, layout/radius, expressiveness shadow sizes and portalOpacity.

**Propagation:** Vercel’s presets select chrome by elevation role. Community Geist UI exposes theme customization, but it is not proof of Vercel’s internal component implementation.

**Limit / interpretation:** Vercel compositor/component source not found in the consulted public guide. Neither the guide nor the community theme interface supplies a multi-material optical-control contract.

**Documentation:** [Vercel materials](https://vercel.com/geist/materials); [Vercel colors](https://vercel.com/geist/colors) (checked 2026-10-08).

**Pinned source:** [geist: components/themes/presets/index.ts L42–95](https://github.com/geist-org/geist-ui/blob/6894bfdf12bca17ae292617cf2b69c63731fd5d4/components/themes/presets/index.ts#L42-L95).

<a id="98css"></a>
## 98.css

**Category:** Historical visual-language stylesheet.

**Controls:** CSS variables expose surface, button highlight/face/shadow, frame colors and spacing; bevel-like edges are implemented by component rules.

**Propagation:** A coherent Windows-98-style treatment across the library’s supported controls. It is meaningful component-wide style prior art.

**Limit / interpretation:** The supplied vocabulary is one historical theme, not independently adjustable physical material layers. No shared optical model for changing it into glass/paper/clay was found.

**Documentation:** Source stylesheet and project documentation at the pinned revision. (checked 2026-10-08).

**Pinned source:** [98css: style.css L8–24](https://github.com/jdan/98.css/blob/b1d7a907371bbe523d6f64e3af97f714fdbd6d6a/style.css#L8-L24).

<a id="7css"></a>
## 7.css

**Category:** Windows-7-style CSS with glass windows.

**Controls:** Variables name component/property/state; window recipes include glass gradients, tint, border, radii, shadow and control highlight treatments.

**Propagation:** It distinguishes window glass from the rest of the interface rather than smearing one glass effect across everything.

**Limit / interpretation:** Strong example of role-specific visual language, but its knobs are window/component variables. No independent system-wide physical-material family abstraction found in those modules.

**Documentation:** Source variables and window recipe below. (checked 2026-10-08).

**Pinned source:** [7css: gui/_variables.scss L1–14](https://github.com/khang-nd/7.css/blob/76d29abe7e76598fc521e707933f9ffa1b320259/gui/_variables.scss#L1-L14); [7css: gui/_window.scss L1–51](https://github.com/khang-nd/7.css/blob/76d29abe7e76598fc521e707933f9ffa1b320259/gui/_window.scss#L1-L51).

<a id="xpcss"></a>
## XP.css

**Category:** Historical theme stylesheets.

**Controls:** The tree includes XP and 98 theme sources. The XP Button recipe directly specifies gradients, border, radius and inset hover/focus shading.

**Propagation:** Whole-theme CSS gives a recognizable control language with state-specific painting.

**Limit / interpretation:** Most optical values in the inspected Button recipe are literal authored values, not adjustable shared optical parameters. Theme replacement differs from independently tuning a reusable material layer.

**Documentation:** Source theme recipe below. (checked 2026-10-08).

**Pinned source:** [xpcss: themes/XP/_buttons.scss L1–43](https://github.com/botoxparty/XP.css/blob/376f42eb274361939eaad3b0943204c053ad26c4/themes/XP/_buttons.scss#L1-L43).

<a id="nes"></a>
## NES.css (additional style library)

**Category:** Pixel-art visual language.

**Controls:** Sass button mixins accept colors and shadow ink; pseudo-elements implement hard inset relief and state reversal.

**Propagation:** A coherent themed component vocabulary using author-time mixins.

**Limit / interpretation:** The sampled controls demonstrate a fixed pixel-art language, not a runtime multi-material compositor.

**Documentation:** Source button mixin below. (checked 2026-10-08).

**Pinned source:** [nes: scss/elements/buttons.scss L1–32](https://github.com/nostalgic-css/NES.css/blob/b1cc9944aae3274461c747d7ad1cab31df45e78c/scss/elements/buttons.scss#L1-L32).

<a id="daisyui"></a>
## daisyUI (additional close candidate)

**Category:** Theme tokens + optical utility.

**Controls:** Theme variables include role radii/sizes, border, depth and noise. Button consumes depth for edge/shadow/text effects and noise for texture. The glass utility exposes blur, opacity and reflection-angle/opacity inputs.

**Propagation:** Shared theme parameters reach multiple components, while .glass is an opt-in treatment. This is more material-aware than a color-only theme system.

**Limit / interpretation:** Close partial match, but the inspected glass utility is not a full role-specific material family mapping. No general separate controls for refraction, grain statistics or an arbitrary gradient/lighting stack found in these contracts.

**Documentation:** [Themes and generator](https://daisyui.com/docs/themes/) (checked 2026-10-08).

**Pinned source:** [daisyui: packages/daisyui/src/themes/light.css L22–29](https://github.com/saadeghi/daisyui/blob/9adbeaa259816be46b98bf497a09cd2ab127e3cf/packages/daisyui/src/themes/light.css#L22-L29); [daisyui: packages/daisyui/src/components/button.css L31–56](https://github.com/saadeghi/daisyui/blob/9adbeaa259816be46b98bf497a09cd2ab127e3cf/packages/daisyui/src/components/button.css#L31-L56); [daisyui: packages/daisyui/src/utilities/glass.css L1–18](https://github.com/saadeghi/daisyui/blob/9adbeaa259816be46b98bf497a09cd2ab127e3cf/packages/daisyui/src/utilities/glass.css#L1-L18).

<a id="generators"></a>
## Glass and neumorphism generators

**Category:** Single-object effect authoring.

**Controls:** The Hype4 glass tool exposes blur, “refraction” and depth; its displayed CSS uses alpha, backdrop blur, shadows and highlight pseudo-elements, not a displacement filter. Neumorphism.io’s source has color, size, radius, distance, blur, shape and intensity-related state.

**Propagation:** Useful ways to expose effect parameters and export a recipe for one preview object. A control label is not evidence of its physical simulation.

**Limit / interpretation:** No component catalogue, role absorption or shared runtime theme contract is established by these generators. Hype4 source/license was not found on its public tool page.

**Documentation:** [Glass generator](https://hype4.academy/tools/glassmorphism-generator); [Neumorphism.io](https://neumorphism.io/) (checked 2026-10-08).

**Pinned source:** [neumorphism: src/Configuration.js L11–23](https://github.com/adamgiebl/neumorphism/blob/8ab93a6bea6493cc464d45a334b5fb7a90d34308/src/Configuration.js#L11-L23).

<a id="openglass"></a>
## OpenGlass UI — strongest counterexample

**Category:** Shared, parameterized glass system.

**Controls:** Public GlassLook controls include blur, opacity, tint, saturation, brightness, rim, highlight, lightAngle, lightSpread, lensing and shadow. Presets include liquid/frosted/clear/smoked/lensed; design switches between liquid and classic. Controls become CSS variables at nested provider boundaries.

**Propagation:** MIT-licensed implementation. The recipe stylesheet remaps a broad component catalogue and gives buttons optical layers, Switch separate track/thumb treatments, and inputs recessed wells. This is implemented role absorption, not just a marketing claim.

**Limit / interpretation:** Glass-focused, not the brief’s whole material taxonomy. The public look interface lacks independent gradient-stop, grain and full shadow-geometry controls. Some geometry and type are bundled into the visual language. Lensing in the CSS look is an edge cue; the docs distinguish actual refraction renderers.

**Documentation:** Pinned documentation and actual consumers below. (checked 2026-10-08).

**Pinned source:** [openglass: LICENSE L1–13](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/LICENSE#L1-L13); [openglass: packages/core/src/look.ts L8–43](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/core/src/look.ts#L8-L43); [openglass: docs/THEMING.md L97–162](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/docs/THEMING.md#L97-L162); [openglass: packages/recipes/src/liquid.source.css L249–297](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L249-L297); [openglass: packages/recipes/src/liquid.source.css L303–328](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L303-L328); [openglass: packages/recipes/src/liquid.source.css L574–599](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L574-L599); [openglass: packages/recipes/src/liquid.source.css L1066–1094](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1066-L1094).
