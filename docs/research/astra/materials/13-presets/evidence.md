# Evidence and source transfers

Area snapshot **3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e**. Research input **c0a97a34e6c76d97d025d19f79edac59ddadbf25**. Read brief and tasks **01–10** at that immutable research commit. Task 06 source checks retain **2026-10-08**; this task does not relabel them as a new exhaustive upstream audit. [reference-inputs.json](reference-inputs.json) carries the selected exact records and source pins.

## Current Area constraints

- [Namespace/derivation](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/docs/DESIGN_SYSTEM.md#L20-L27).
- [Elevation eligibility](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/docs/DESIGN_SYSTEM.md#L156-L165).
- [Near-black and dark Card](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/docs/DESIGN_SYSTEM.md#L272-L278).
- [Surface presets](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/packages/tokens/src/axes/surface.ts#L15-L81).
- [Ink, focus, state and tests](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/docs/CONTRAST.md#L7-L76).
- [State clocks](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/docs/MOTION.md#L40-L63).
- [Reduced motion](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/docs/MOTION.md#L85-L90).

## Series inputs

- [01-taxonomy](https://github.com/ethanwongwork/area/tree/c0a97a34e6c76d97d025d19f79edac59ddadbf25/docs/research/astra/materials/01-taxonomy): read README and relevant layer/control/role/policy/reference records. README content SHA-256 is stored in presets.json.
- [02-prior-art](https://github.com/ethanwongwork/area/tree/c0a97a34e6c76d97d025d19f79edac59ddadbf25/docs/research/astra/materials/02-prior-art): read README and relevant layer/control/role/policy/reference records. README content SHA-256 is stored in presets.json.
- [03-css-cookbook](https://github.com/ethanwongwork/area/tree/c0a97a34e6c76d97d025d19f79edac59ddadbf25/docs/research/astra/materials/03-css-cookbook): read README and relevant layer/control/role/policy/reference records. README content SHA-256 is stored in presets.json.
- [04-role-map](https://github.com/ethanwongwork/area/tree/c0a97a34e6c76d97d025d19f79edac59ddadbf25/docs/research/astra/materials/04-role-map): read README and relevant layer/control/role/policy/reference records. README content SHA-256 is stored in presets.json.
- [05-absorption](https://github.com/ethanwongwork/area/tree/c0a97a34e6c76d97d025d19f79edac59ddadbf25/docs/research/astra/materials/05-absorption): read README and relevant layer/control/role/policy/reference records. README content SHA-256 is stored in presets.json.
- [06-references](https://github.com/ethanwongwork/area/tree/c0a97a34e6c76d97d025d19f79edac59ddadbf25/docs/research/astra/materials/06-references): read README and relevant layer/control/role/policy/reference records. README content SHA-256 is stored in presets.json.
- [07-controls](https://github.com/ethanwongwork/area/tree/c0a97a34e6c76d97d025d19f79edac59ddadbf25/docs/research/astra/materials/07-controls): read README and relevant layer/control/role/policy/reference records. README content SHA-256 is stored in presets.json.
- [08-accessibility](https://github.com/ethanwongwork/area/tree/c0a97a34e6c76d97d025d19f79edac59ddadbf25/docs/research/astra/materials/08-accessibility): read README and relevant layer/control/role/policy/reference records. README content SHA-256 is stored in presets.json.
- [09-dark-density](https://github.com/ethanwongwork/area/tree/c0a97a34e6c76d97d025d19f79edac59ddadbf25/docs/research/astra/materials/09-dark-density): read README and relevant layer/control/role/policy/reference records. README content SHA-256 is stored in presets.json.
- [10-states](https://github.com/ethanwongwork/area/tree/c0a97a34e6c76d97d025d19f79edac59ddadbf25/docs/research/astra/materials/10-states): read README and relevant layer/control/role/policy/reference records. README content SHA-256 is stored in presets.json.

## Task 06 reference records

Each exact value below belongs to its external specimen. The preset tables use authored adaptations unless a transfer note explicitly says a scalar is retained. Light/dark roles not present in a reference are new design proposals. No screenshot sampling or estimation.

<a id="r01"></a>
### R01 — Designmodo Flat UI: primary button

Scope: Resting .btn.btn-primary; no .btn-embossed modifier.

- **body.paints[]:** #1ABC9C opaque solid; alias brand-secondary → turquoise. [flat-variant](https://github.com/designmodo/Flat-UI/blob/cead40a83b12b678e278fd63dcbb06eb0a6520f4/app/styles/modules/buttons.scss#L65-L70), [flat-paint](https://github.com/designmodo/Flat-UI/blob/cead40a83b12b678e278fd63dcbb06eb0a6520f4/app/styles/mixins/buttons.scss#L1-L16), [flat-palette](https://github.com/designmodo/Flat-UI/blob/cead40a83b12b678e278fd63dcbb06eb0a6520f4/app/styles/_variables.scss#L10-L48)
- **edges[] / geometry:** border:none; radius 4px; padding 10px 15px. [flat-base](https://github.com/designmodo/Flat-UI/blob/cead40a83b12b678e278fd63dcbb06eb0a6520f4/app/styles/modules/buttons.scss#L8-L29), [flat-radius](https://github.com/designmodo/Flat-UI/blob/cead40a83b12b678e278fd63dcbb06eb0a6520f4/app/styles/_variables.scss#L140-L143)
- **content.ink:** white: btn-default-color → inverse → white. [flat-ink](https://github.com/designmodo/Flat-UI/blob/cead40a83b12b678e278fd63dcbb06eb0a6520f4/app/styles/_variables.scss#L215-L220), [flat-palette](https://github.com/designmodo/Flat-UI/blob/cead40a83b12b678e278fd63dcbb06eb0a6520f4/app/styles/_variables.scss#L10-L48)
- **adaptation:** Active base explicitly removes box-shadow; plain base/variant has no gloss or texture declaration. [flat-base](https://github.com/designmodo/Flat-UI/blob/cead40a83b12b678e278fd63dcbb06eb0a6520f4/app/styles/modules/buttons.scss#L8-L29), [flat-paint](https://github.com/designmodo/Flat-UI/blob/cead40a83b12b678e278fd63dcbb06eb0a6520f4/app/styles/mixins/buttons.scss#L1-L16)

**Limit:** Flat visual role classification is inferred from the shown recipe. This is historical Flat UI, not a claim that its entire stylesheet is flat or that focus removal is acceptable for Area. Geometry and ink are reference values, not Area defaults.

<a id="r02"></a>
### R02 — Google MDC Web: paper card at elevation 1

Scope: Legacy MDC card, default Sass theme; not M3 Expressive.

- **body.paints[] / geometry:** surface = #FFF; medium shape radius = 4px. [card-base](https://github.com/material-components/material-components-web/blob/6ceadb81df508ac08ab007c52c4d3dc1d811cc15/packages/mdc-card/_mixins.scss#L310-L320), [card-color](https://github.com/material-components/material-components-web/blob/6ceadb81df508ac08ab007c52c4d3dc1d811cc15/packages/mdc-theme/_theme-color.scss#L145-L148), [card-shape-ref](https://github.com/material-components/material-components-web/blob/6ceadb81df508ac08ab007c52c4d3dc1d811cc15/packages/mdc-card/_variables.scss#L31-L37), [card-shape](https://github.com/material-components/material-components-web/blob/6ceadb81df508ac08ab007c52c4d3dc1d811cc15/packages/mdc-shape/_shape.scss#L34-L44)
- **shading.cast[]:** Black lobes in umbra/penumbra/ambient order: (x,y,blur,spread) = (0,2,1,-1)px at .20; (0,1,1,0)px at .14; (0,1,3,0)px at .12. Expanded from elevation 1 maps. [card-base](https://github.com/material-components/material-components-web/blob/6ceadb81df508ac08ab007c52c4d3dc1d811cc15/packages/mdc-card/_mixins.scss#L310-L320), [elevation-alpha](https://github.com/material-components/material-components-web/blob/6ceadb81df508ac08ab007c52c4d3dc1d811cc15/packages/mdc-elevation/_elevation-theme.scss#L39-L47), [elevation-penumbra](https://github.com/material-components/material-components-web/blob/6ceadb81df508ac08ab007c52c4d3dc1d811cc15/packages/mdc-elevation/_elevation-theme.scss#L72-L76), [elevation-ambient](https://github.com/material-components/material-components-web/blob/6ceadb81df508ac08ab007c52c4d3dc1d811cc15/packages/mdc-elevation/_elevation-theme.scss#L100-L104), [elevation-compose](https://github.com/material-components/material-components-web/blob/6ceadb81df508ac08ab007c52c4d3dc1d811cc15/packages/mdc-elevation/_elevation-theme.scss#L182-L196)

**Limit:** No paper grain or specular layer is declared in this selected card recipe. Shadow-map expansion is arithmetic/source resolution, not a browser measurement. Card content styles remain separate.

<a id="r03"></a>
### R03 — Qrolic: frosted card plus transparent child

Scope: Public CodePen CSS, resting card and nested .about strip.

- **backdrop.source / filters[]:** Photo on .main-content (cover, center); .box-inner backdrop blur 5px. [glass](https://codepen.io/qrolic/pen/wvMxJXG)
- **body.paints[] / geometry:** Card white alpha .5, radius 15px, width 400px, padding 30px. Child .about white alpha .3, radius 10px, padding 10px; no additional blur in its own rule. [glass](https://codepen.io/qrolic/pen/wvMxJXG)
- **emission[] / adaptation:** Hover adds 0 0 20px white alpha .5 box-shadow. [glass](https://codepen.io/qrolic/pen/wvMxJXG)

**Limit:** Exact CSS values, not proof of contrast or browser rendering. No border is declared in the selected card rule. The nested strip demonstrates transmission without a second backdrop filter. Its hover halo is not part of the resting stack.

<a id="r04"></a>
### R04 — Microsoft WinUI: in-app Acrylic default brush

Scope: AcrylicInAppFillColorDefaultBrush, Light and Default/dark dictionaries; normal nonopaque path.

- **body.paints[] / fallbacks:** Light: tint #FCFCFC, TintOpacity 0.0, TintLuminosityOpacity .85, fallback #F9F9F9. Dark: tint #2C2C2C, TintOpacity .15, TintLuminosityOpacity .96, fallback #2C2C2C. [acrylic-light](https://github.com/microsoft/microsoft-ui-xaml/blob/901ffc065a1f3a1122bbfe6d222eb80a471f28a6/controls/dev/Materials/Acrylic/AcrylicBrush_themeresources.xaml#L94-L100), [acrylic-dark](https://github.com/microsoft/microsoft-ui-xaml/blob/901ffc065a1f3a1122bbfe6d222eb80a471f28a6/controls/dev/Materials/Acrylic/AcrylicBrush_themeresources.xaml#L42-L48)
- **backdrop.source / filters[]:** Backdrop composited over opaque fallback; native GaussianBlur BlurAmount = 30.0 with Hard border mode, then luminosity and tint blend. Native units/algorithm are retained; not asserted equal to CSS blur(30px). [acrylic-constants](https://github.com/microsoft/microsoft-ui-xaml/blob/901ffc065a1f3a1122bbfe6d222eb80a471f28a6/controls/dev/Materials/Acrylic/AcrylicBrush.h#L64-L67), [acrylic-graph](https://github.com/microsoft/microsoft-ui-xaml/blob/901ffc065a1f3a1122bbfe6d222eb80a471f28a6/controls/dev/Materials/Acrylic/AcrylicBrush.cpp#L493-L548), [acrylic-blend](https://github.com/microsoft/microsoft-ui-xaml/blob/901ffc065a1f3a1122bbfe6d222eb80a471f28a6/controls/dev/Materials/Acrylic/AcrylicBrush.cpp#L389-L414)
- **texture[]:** Wrapped noise brush, opacity .02, source-over after tint. [acrylic-constants](https://github.com/microsoft/microsoft-ui-xaml/blob/901ffc065a1f3a1122bbfe6d222eb80a471f28a6/controls/dev/Materials/Acrylic/AcrylicBrush.h#L64-L67), [acrylic-graph](https://github.com/microsoft/microsoft-ui-xaml/blob/901ffc065a1f3a1122bbfe6d222eb80a471f28a6/controls/dev/Materials/Acrylic/AcrylicBrush.cpp#L493-L548)

**Limit:** The inspected nonopaque path uses luminosity blending; do not append the unused saturation/exclusion constants from the header as if they were active layers. Noise bitmap pixels, host shape, stroke, shadow and content typography are not specified by this brush extract. Acrylic is a platform recipe, not just white-alpha CSS.

<a id="r08"></a>
### R08 — Neumorphism.io: raised and pressed source presets

Scope: Unmodified #e0e0e0 default, light-source 1; compare shape 0 and shape 1.

- **body.paints[] / geometry:** Solid #E0E0E0; radius 50px; distance 20px; blur 60px; color difference .15; gradient disabled in shape 0. [neu-default](https://github.com/adamgiebl/neumorphism/blob/8ab93a6bea6493cc464d45a334b5fb7a90d34308/src/Configuration.js#L11-L23), [neu-output](https://github.com/adamgiebl/neumorphism/blob/8ab93a6bea6493cc464d45a334b5fb7a90d34308/src/Configuration.js#L160-L176)
- **shading.cast[]:** Raised: 20px 20px 60px #BEBEBE, −20px −20px 60px #FFF. Colors calculated by channel rounding/clamping: 224×.85→190 and 224×1.15→255. Omitted spread is zero by CSS syntax. [neu-colors](https://github.com/adamgiebl/neumorphism/blob/8ab93a6bea6493cc464d45a334b5fb7a90d34308/src/Configuration.js#L89-L104), [neu-math](https://github.com/adamgiebl/neumorphism/blob/8ab93a6bea6493cc464d45a334b5fb7a90d34308/src/utils.js#L1-L19), [neu-output](https://github.com/adamgiebl/neumorphism/blob/8ab93a6bea6493cc464d45a334b5fb7a90d34308/src/Configuration.js#L160-L176)
- **shading.inset[]:** Pressed shape 1 prefixes those same two lobes with inset; body remains solid. [neu-output](https://github.com/adamgiebl/neumorphism/blob/8ab93a6bea6493cc464d45a334b5fb7a90d34308/src/Configuration.js#L160-L176)

**Limit:** A generator specimen, not a complete control/state system. Source-size initialization can change with viewport; no fixed specimen width is inferred. Input blur 60 is distinct from the distance handler’s later blur=distance×2. Top-left lighting is an interpretation of the paired offsets.

<a id="r09"></a>
### R09 — Adrian Bece clay.css: default utility

Scope: Published defaults before application-specific overrides.

- **body.paints[] / geometry:** rgba(0,0,0,.005), radius 32px. The near-transparent default is literal; do not replace it with an invented pastel. [clay-default](https://github.com/codeAdrian/clay.css/blob/30dfeb9d75a6f5d081d5199fa47a74015f78e8e0/src/clay.scss#L1-L29)
- **shading.cast[]:** 8px 8px 16px 0 black alpha .25. [clay-default](https://github.com/codeAdrian/clay.css/blob/30dfeb9d75a6f5d081d5199fa47a74015f78e8e0/src/clay.scss#L1-L29)
- **shading.inset[] / reflection[]:** Inset dark lobe −8px −8px 16px 0 black .25; inset light lobe 8px 8px 16px 0 white .2, after the cast lobe. [clay-default](https://github.com/codeAdrian/clay.css/blob/30dfeb9d75a6f5d081d5199fa47a74015f78e8e0/src/clay.scss#L1-L29)

**Limit:** Class defaults demonstrate inflated modeling but leave the host fill/ink/context to the application. Roles are possible hosts, not claims of supplied family coverage. Not an accessibility endorsement.

<a id="r10"></a>
### R10 — 98.css: crisp mechanical bevel and pressed well

Scope: Resting/pressed button plus scrollbar thumb.

- **body.paints[] / geometry:** #C0C0C0 button, radius 0; scrollbar thumb #DFDFDF. [98-palette](https://github.com/jdan/98.css/blob/b1d7a907371bbe523d6f64e3af97f714fdbd6d6a/style.css#L8-L14), [98-button](https://github.com/jdan/98.css/blob/b1d7a907371bbe523d6f64e3af97f714fdbd6d6a/style.css#L146-L158), [98-thumb](https://github.com/jdan/98.css/blob/b1d7a907371bbe523d6f64e3af97f714fdbd6d6a/style.css#L829-L832)
- **edges[] / reflection[]:** Raised edge uses inset offsets (−1,−1) #0A0A0A; (1,1) #FFF; (−2,−2) #808080; (2,2) #DFDFDF, all CSS px, omitted blur/spread zero. [98-palette](https://github.com/jdan/98.css/blob/b1d7a907371bbe523d6f64e3af97f714fdbd6d6a/style.css#L8-L14), [98-bevel](https://github.com/jdan/98.css/blob/b1d7a907371bbe523d6f64e3af97f714fdbd6d6a/style.css#L50-L59), [98-button](https://github.com/jdan/98.css/blob/b1d7a907371bbe523d6f64e3af97f714fdbd6d6a/style.css#L146-L158)
- **shading.inset[] / adaptation:** Pressed swaps to (−1,−1) #FFF; (1,1) #0A0A0A; (−2,−2) #DFDFDF; (2,2) #808080. [98-bevel](https://github.com/jdan/98.css/blob/b1d7a907371bbe523d6f64e3af97f714fdbd6d6a/style.css#L50-L59), [98-press](https://github.com/jdan/98.css/blob/b1d7a907371bbe523d6f64e3af97f714fdbd6d6a/style.css#L174-L179)

**Limit:** The offset shadows paint a bevel/edge, not a soft floating cast shadow. Historical Windows controls are a technical analogue for physical relief, not the owner’s car-console or terminal icon.

<a id="r11"></a>
### R11 — theldoria: CSS Aqua-style gloss band

Scope: Blue .button.color3; author’s Sass/Compass recipe.

- **body.paints[] / reflection[]:** Blue base #2963BD; over it white-alpha .2 through 50%, white-alpha 0 from 50.01%. Source uses Compass linear-gradient without an explicit angle. [aqua](https://codepen.io/theldoria/pen/XWmExZ)
- **edges[] / geometry:** Inset zero-offset/zero-blur 2px white .2 ring; radius 3px; padding 15px 30px. [aqua](https://codepen.io/theldoria/pen/XWmExZ)
- **content.ink / content.decoration[]:** White ink; text-shadow 0 1px 0 black .5. [aqua](https://codepen.io/theldoria/pen/XWmExZ)

**Limit:** A published Aqua-inspired interpretation, not Apple’s historical values. Hover changes whole-element opacity to .9; that behavior is not recommended for Area. Gloss-stop values are exact, but a flat-edged sample is not a match for board pill geometry.

<a id="r12"></a>
### R12 — 7.css: Aero window and glowing window control

Scope: Regular .window (not .window.glass); separate close-button hover layer.

- **body.paints[] / reflection[]:** Window base #4580C4; lateral gradient white #FFFFFF66 → black #0000001A → white #FFFFFF33. Additional vertical shine: transparent 20%, #FFFFFFB3 40%, transparent 41%. [aero-window-vars](https://github.com/khang-nd/7.css/blob/76d29abe7e76598fc521e707933f9ffa1b320259/gui/_window.scss#L1-L6), [aero-control-vars](https://github.com/khang-nd/7.css/blob/76d29abe7e76598fc521e707933f9ffa1b320259/gui/_window.scss#L37-L45), [aero-window](https://github.com/khang-nd/7.css/blob/76d29abe7e76598fc521e707933f9ffa1b320259/gui/_window.scss#L48-L68)
- **edges[] / shading.cast[] / geometry:** Window border 1px #000000B3, radius 6px; outer 2px 2px 10px 1px same black; inset ring 0 0 0 1px #FFFA; pseudo-element inset ring #FFFD. [aero-window-vars](https://github.com/khang-nd/7.css/blob/76d29abe7e76598fc521e707933f9ffa1b320259/gui/_window.scss#L1-L6), [aero-window](https://github.com/khang-nd/7.css/blob/76d29abe7e76598fc521e707933f9ffa1b320259/gui/_window.scss#L48-L68)
- **reflection[] / emission[]:** Control gloss #FFFFFF80 → #FFFFFF4D 45% → #0000001A 50% → #0000001A 75% → #FFFFFF80; close hover adds glow 0 0 7px 3px #E68E75. [aero-control-vars](https://github.com/khang-nd/7.css/blob/76d29abe7e76598fc521e707933f9ffa1b320259/gui/_window.scss#L37-L45), [aero-close](https://github.com/khang-nd/7.css/blob/76d29abe7e76598fc521e707933f9ffa1b320259/gui/_window.scss#L441-L450)

**Limit:** Windows Aero CSS is a useful facet of the broader Frutiger Aero language; it does not establish the imagery/typography of that whole aesthetic. The hover close control also has bitmap glyph and radial paints; the glow is a selected layer, not a full close-button recipe. Eight-digit CSS hex is #RRGGBBAA, unlike XAML.

<a id="r13"></a>
### R13 — Codeible: neon button, inner bloom and outer halo

Scope: Resting .neon-btn, with separate floor-reflection pseudo-element.

- **body.paints[] / edges[]:** Fill rgb(100,61,136); border .25em rgb(217,176,255); radius 1em; padding 1em 3em. [neon](https://codepen.io/Codeible/pen/abwvMdz)
- **emission[]:** Outer lobes 0 0 1em .25em rgb(217,176,255), 0 0 4em 1em rgba(191,123,255,.781); inner lobe inset 0 0 .75em .25em rgb(217,176,255). [neon](https://codepen.io/Codeible/pen/abwvMdz)
- **content.ink / content.decoration[]:** Ink rgb(217,176,255), size 1.5rem; glyph bloom 0 0 .5em same color. [neon](https://codepen.io/Codeible/pen/abwvMdz)
- **reflection[]:** ::after uses spread color, blur 2em, opacity .7; top 120%, full host width/height; perspective(1.5em) rotateX(35deg) scale(1,.6). [neon](https://codepen.io/Codeible/pen/abwvMdz)

**Limit:** All lengths retain em/rem units, not guessed px. Hover/focus changes ink and fill and expands a lobe; this report selects rest only. Area would retain fixed hover ink and separate required focus. A luminous border is not an elevation shadow.

<a id="r15"></a>
### R15 — Adi Purdila: multi-radial mesh approximation and grain

Scope: Noisy Gradients Mesh — Method 2; radial stacking, not a geometric mesh.

- **body.paints[]:** Front-to-back radial layers, each color at 0 fading to transparent 50%: at (40%,20%) hsla(28,100%,74%,1); (80%,0%) hsla(189,100%,56%,1); (0%,50%) hsla(355,85%,93%,1); (80%,50%) hsla(340,100%,76%,1); (0%,100%) hsla(22,100%,77%,1); (80%,100%) hsla(242,100%,70%,1); (0%,0%) hsla(343,100%,76%,1). [mesh-noise](https://codepen.io/adipurdila/pen/rNGLYrd)
- **texture[]:** body::before black input with SVG fractalNoise, baseFrequency 6.29, numOctaves 6, stitchTiles=stitch. Both full-size pseudo-elements use z-index −1 and mix-blend-mode:color. [mesh-noise](https://codepen.io/adipurdila/pen/rNGLYrd)

**Limit:** Author labels it mesh, but it is overlapping radial gradients. Source background-image:#ffe699 is invalid CSS and is not counted as a solid base. Seed/texture opacity are not explicitly declared. Composition depends on the surrounding page; fine-noise suitability at Area density is unverified.

<a id="r17"></a>
### R17 — Temani Afif: rounded gradient edge

Scope: Two-background alternative, plus transparent-interior mask alternative.

- **edges[] / body.paints[]:** Border 10px transparent, radius 25px; white conic fill clipped to padding-box, linear #FF4E50→#40C0CB clipped to border-box. Source does not explicitly write an angle. [gradient-edge](https://css-tip.com/border-gradient/)
- **edges[] / body.transmission:** Transparent-interior alternative: absolute ::before inset 0, padding 10px, same linear gradient, inherited radius; exclude content-box via two conic mask layers. [gradient-edge](https://css-tip.com/border-gradient/)

**Limit:** These are distinct alternatives, not stacked techniques. The white-center recipe is opaque. The page now also shows background-clip:border-area; this report selects the established fallback recipes and does not inherit its live browser-support claim.

<a id="r19"></a>
### R19 — Owner board 5: annotated Reject button

Scope: Owner’s transcribed annotation; original public URL and attached image unavailable.

- **body.paints[]:** #E3E3E3 alpha .80. [board5](https://github.com/ethanwongwork/area/blob/a5c56e600f5124b8c618950747fd17bfeab60665/docs/research/astra/materials/README.md#L82-L86)
- **edges[]:** Linear stroke #FDFDFD alpha 1 at 0% → #F1F1F1 alpha 0 at 100%; separate outer ring black .16, x0 y0 blur0 spread1. [board5](https://github.com/ethanwongwork/area/blob/a5c56e600f5124b8c618950747fd17bfeab60665/docs/research/astra/materials/README.md#L82-L86)
- **shading.cast[]:** Black .10, x0 y2 blur4 spread0. [board5](https://github.com/ethanwongwork/area/blob/a5c56e600f5124b8c618950747fd17bfeab60665/docs/research/astra/materials/README.md#L82-L86)

**Limit:** No gradient angle, stroke width, corner, dimensions or text styling is specified. Board lengths are recorded as printed annotation units, not independently measured CSS px. Ring and soft cast remain separate. This is owner evidence, not an independently located public reference.

<a id="r20"></a>
### R20 — Owner board 6: annotated dark Button Label

Scope: Owner’s transcribed annotation; original public URL and attached image unavailable.

- **body.paints[]:** Opaque #1D1F23 below a white-alpha gradient 0→.15. [board6](https://github.com/ethanwongwork/area/blob/a5c56e600f5124b8c618950747fd17bfeab60665/docs/research/astra/materials/README.md#L87-L92)
- **edges[]:** Top-only white .15 stroke, 1.5px; separate black alpha1 ring, x0 y0 blur0 spread1.5. [board6](https://github.com/ethanwongwork/area/blob/a5c56e600f5124b8c618950747fd17bfeab60665/docs/research/astra/materials/README.md#L87-L92)
- **shading.cast[]:** Black .20, x0 y4 blur7 spread0. [board6](https://github.com/ethanwongwork/area/blob/a5c56e600f5124b8c618950747fd17bfeab60665/docs/research/astra/materials/README.md#L87-L92)
- **content.ink / content.decoration[]:** White alpha1; text shadow black .40, x0 y4 blur4, annotated spread0. CSS text-shadow has no spread parameter. [board6](https://github.com/ethanwongwork/area/blob/a5c56e600f5124b8c618950747fd17bfeab60665/docs/research/astra/materials/README.md#L87-L92)

**Limit:** Angle, gradient stop positions, corner and dimensions are unspecified. No backdrop translucency follows from the top paint: the base is opaque. Non-stroke lengths remain printed annotation units. This text shadow is not evidence of letterpress.

## Public checks on 2026-10-09

- [Microsoft Acrylic guidance](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic): avoid stacked Acrylic planes; provide solid fallbacks and check text after tint changes. Its general historical graph is not substituted for R04’s pinned active WinUI code path.
- [W3C CSS Backgrounds and Borders](https://www.w3.org/TR/css-backgrounds-3/#box-shadow): shadows, borders and rounded clipping are separate operations.
- [Temani Afif gradient-edge technique](https://css-tip.com/border-gradient/): opaque-center double background and transparent-center mask are alternatives. The live newer border-area technique does not change our selected fallback path.

## Not found / not adopted

No complete native Liquid Glass or active Mica numeric recipe was found in task 06’s inspected sources. Neither is marketed as a matching preset here. No original board images/public URLs are available; R19/R20 remain owner transcriptions. No evidence in 01–10 calibrates all-role dark/compact material numbers: the explicit seeds in model.py are new proposals. No source demonstrates these complete eight Area presets; the role translation and compatibility judgments are this task’s synthesis.
