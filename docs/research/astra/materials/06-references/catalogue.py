"""Curated factual extracts. Role/style/board mappings are Astra interpretations."""
DATE='2026-10-08'
AREA='6f896789a5200bcbd34fe87de458e60ca82141d6'
RESEARCH='a5c56e600f5124b8c618950747fd17bfeab60665'
SOURCES={}
def repo(k,lib,path,a,b,needle):
 SOURCES[k]={'kind':'repository','library':lib,'path':path,'start':a,'end':b,'needle':needle,'checked':DATE}
 return k
def web(k,url,locator):
 SOURCES[k]={'kind':'public page','url':url,'locator':locator,'checked':DATE}
 return k
def L(channel,value,*evidence):return {'channel':channel,'value':value,'evidence':list(evidence)}
REFS=[]
def R(id,title,styles,roles,scope,layers,limits,kind='exact source recipe'):
 REFS.append(dict(id=id,title=title,styles=styles.split(','),roles=roles.split(','),scope=scope,layers=layers,limits=limits,kind=kind,checked=DATE))
repo('flat-base','flat','app/styles/modules/buttons.scss',8,29,'border: none;')
repo('flat-variant','flat','app/styles/modules/buttons.scss',65,70,'$brand-secondary')
repo('flat-paint','flat','app/styles/mixins/buttons.scss',1,16,'background-color: $background;')
repo('flat-palette','flat','app/styles/_variables.scss',10,48,'#1abc9c')
repo('flat-radius','flat','app/styles/_variables.scss',140,143,'4px')
repo('flat-ink','flat','app/styles/_variables.scss',215,220,'$btn-default-color:')
R('R01','Designmodo Flat UI: primary button','flat','raised control,text','Resting .btn.btn-primary; no .btn-embossed modifier.',[
 L('body.paints[]','#1ABC9C opaque solid; alias brand-secondary → turquoise.','flat-variant','flat-paint','flat-palette'),
 L('edges[] / geometry','border:none; radius 4px; padding 10px 15px.','flat-base','flat-radius'),
 L('content.ink','white: btn-default-color → inverse → white.','flat-ink','flat-palette'),
 L('adaptation','Active base explicitly removes box-shadow; plain base/variant has no gloss or texture declaration.','flat-base','flat-paint')],
 'Flat visual role classification is inferred from the shown recipe. This is historical Flat UI, not a claim that its entire stylesheet is flat or that focus removal is acceptable for Area. Geometry and ink are reference values, not Area defaults.')
repo('card-base','material','packages/mdc-card/_mixins.scss',310,320,'elevation(1')
repo('card-color','material','packages/mdc-theme/_theme-color.scss',145,148,'$surface: #fff')
repo('card-shape-ref','material','packages/mdc-card/_variables.scss',31,37,'$shape-radius: medium')
repo('card-shape','material','packages/mdc-shape/_shape.scss',34,44,'$medium-component-radius: 4px')
repo('elevation-alpha','material','packages/mdc-elevation/_elevation-theme.scss',39,47,'$umbra-opacity: 0.2')
repo('elevation-penumbra','material','packages/mdc-elevation/_elevation-theme.scss',72,76,"1: '0px 1px 1px 0px'")
repo('elevation-ambient','material','packages/mdc-elevation/_elevation-theme.scss',100,104,"1: '0px 1px 3px 0px'")
R('R02','Google MDC Web: paper card at elevation 1','paper,drop-shadow','container','Legacy MDC card, default Sass theme; not M3 Expressive.',[
 L('body.paints[] / geometry','surface = #FFF; medium shape radius = 4px.','card-base','card-color','card-shape-ref','card-shape'),
 L('shading.cast[]','Black lobes in umbra/penumbra/ambient order: (x,y,blur,spread) = (0,2,1,-1)px at .20; (0,1,1,0)px at .14; (0,1,3,0)px at .12. Expanded from elevation 1 maps.','card-base','elevation-alpha','elevation-penumbra','elevation-ambient')],
 'No paper grain or specular layer is declared in this selected card recipe. Shadow-map expansion is arithmetic/source resolution, not a browser measurement. Card content styles remain separate.')
web('glass','https://codepen.io/qrolic/pen/wvMxJXG','CSS .main-content, .box-inner, .box-inner:hover and .about')
R('R03','Qrolic: frosted card plus transparent child','transparency,glassmorphism','container','Public CodePen CSS, resting card and nested .about strip.',[
 L('backdrop.source / filters[]','Photo on .main-content (cover, center); .box-inner backdrop blur 5px.','glass'),
 L('body.paints[] / geometry','Card white alpha .5, radius 15px, width 400px, padding 30px. Child .about white alpha .3, radius 10px, padding 10px; no additional blur in its own rule.','glass'),
 L('emission[] / adaptation','Hover adds 0 0 20px white alpha .5 box-shadow.','glass')],
 'Exact CSS values, not proof of contrast or browser rendering. No border is declared in the selected card rule. The nested strip demonstrates transmission without a second backdrop filter. Its hover halo is not part of the resting stack.')
repo('acrylic-dark','fluent','controls/dev/Materials/Acrylic/AcrylicBrush_themeresources.xaml',42,48,'TintOpacity="0.15"')
repo('acrylic-light','fluent','controls/dev/Materials/Acrylic/AcrylicBrush_themeresources.xaml',94,100,'TintLuminosityOpacity="0.85"')
repo('acrylic-constants','fluent','controls/dev/Materials/Acrylic/AcrylicBrush.h',64,67,'sc_blurRadius = 30.0f')
repo('acrylic-graph','fluent','controls/dev/Materials/Acrylic/AcrylicBrush.cpp',493,548,'noiseOpacityEffect->Opacity(sc_noiseOpacity)')
repo('acrylic-blend','fluent','controls/dev/Materials/Acrylic/AcrylicBrush.cpp',389,414,'colorBlendEffect->Mode')
web('acrylic-doc','https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic','Acrylic material and usability guidance')
R('R04','Microsoft WinUI: in-app Acrylic default brush','acrylic,grain','floating surface','AcrylicInAppFillColorDefaultBrush, Light and Default/dark dictionaries; normal nonopaque path.',[
 L('body.paints[] / fallbacks','Light: tint #FCFCFC, TintOpacity 0.0, TintLuminosityOpacity .85, fallback #F9F9F9. Dark: tint #2C2C2C, TintOpacity .15, TintLuminosityOpacity .96, fallback #2C2C2C.','acrylic-light','acrylic-dark'),
 L('backdrop.source / filters[]','Backdrop composited over opaque fallback; native GaussianBlur BlurAmount = 30.0 with Hard border mode, then luminosity and tint blend. Native units/algorithm are retained; not asserted equal to CSS blur(30px).','acrylic-constants','acrylic-graph','acrylic-blend'),
 L('texture[]','Wrapped noise brush, opacity .02, source-over after tint.','acrylic-constants','acrylic-graph')],
 'The inspected nonopaque path uses luminosity blending; do not append the unused saturation/exclusion constants from the header as if they were active layers. Noise bitmap pixels, host shape, stroke, shadow and content typography are not specified by this brush extract. Acrylic is a platform recipe, not just white-alpha CSS.',kind='native recipe, host geometry separate')
repo('mica-dark','fluent','controls/dev/CommonStyles/Common_themeresources_any.xaml',59,75,'#202020')
repo('mica-light','fluent','controls/dev/CommonStyles/Common_themeresources_any.xaml',263,279,'#F3F3F3')
repo('mica-controller','fluent','controls/dev/Materials/MicaBackdrop/MicaBackdrop.cpp',8,20,'newController.Kind(Kind())')
web('mica-doc','https://learn.microsoft.com/en-us/windows/apps/design/style/mica','App layering with Mica; usability/fallbacks')
R('R05','Microsoft Mica: foundation and content-layer resources','mica','page,container','Mica base, light/dark fallback and recommended content overlay; active optics only partially published here.',[
 L('backdrop.source / body.transmission','Opaque system foundation informed by wallpaper/theme; XAML delegates to MicaController.','mica-doc','mica-controller'),
 L('fallbacks','SolidBackgroundFillColorBase: light #F3F3F3, dark #202020. BaseAlt: light #DADADA, dark #0A0A0A. These are fallback resources, not measured active Mica colors.','mica-light','mica-dark','mica-doc'),
 L('body.paints[]','Separate content layer LayerFillColorDefault: light XAML #80FFFFFF; dark XAML #4C3A3A3A. XAML is #AARRGGBB, so alpha is exactly 128/255 and 76/255 respectively.','mica-light','mica-dark','mica-doc')],
 'Not found: a complete active Mica blur/tint/noise stack in the official Mica guide, inspected XAML adapter or public WindowsAppSDK tree at the locked SHA. Do not relabel Acrylic numbers as Mica. Source resources cover fallback/overlay only.',kind='partial native recipe')
web('apple-glass','https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views','Apply and configure Liquid Glass effects; Combine multiple views with Liquid Glass containers; Markdown version read')
web('apple-resources','https://developer.apple.com/design/resources/','Official UI kits and Icon Composer listings')
web('apple-hig','https://developer.apple.com/design/human-interface-guidelines/materials','Liquid Glass variants regular/clear')
R('R06','Apple Liquid Glass: official custom-view API recipe','liquid-glass','raised control,floating surface','Official API examples, not reconstructed native renderer constants.',[
 L('body.paints[] / backdrop.mapping','glassEffect() uses regular Glass within a Capsule. Example alternatives: rect(cornerRadius:16.0) and regular.tint(.orange).interactive(). Orange is the SwiftUI Color constant; no RGB was published in this sample.','apple-glass'),
 L('adaptation / geometry','GlassEffectContainer(spacing:40.0) with HStack(spacing:40.0) is one published combination example; a separate union example uses 20.0. These are example layout values, not universal material constants.','apple-glass'),
 L('fallbacks / evidence','HIG names regular and clear variants. Official design-resource kits are linked in the access ledger.','apple-hig','apple-resources')],
 'Not found: native blur kernel, index of refraction, tint alpha, rim gradient stops or cast-shadow numbers in the inspected HIG/API/design-resource pages. Values above are exact API inputs only. No third-party CSS recipe below is presented as Apple’s implementation.',kind='partial native API recipe')
repo('liquid-default','liquid','src/index.tsx',268,284,'blurAmount = 0.0625')
repo('liquid-backdrop','liquid','src/index.tsx',190,210,'blurAmount * 32')
repo('liquid-disp','liquid','src/index.tsx',69,115,'aberrationIntensity * 0.05')
repo('liquid-content','liquid','src/index.tsx',217,237,'500 20px/1 system-ui')
repo('liquid-edge','liquid','src/index.tsx',511,558,'padding: "1.5px"')
R('R07','rdev/liquid-glass-react: inspectable refraction approximation','liquid-glass,gradient-stroke,radial-gradient','raised control,edge,text','Default exported props, standard mode, overLight=false, mouseOffset=(0,0), resting state.',[
 L('filters[] / backdrop.mapping','blurAmount .0625; CSS backdrop blur = 4 + .0625×32 = 6px; saturation 140%. displacementScale 70, aberrationIntensity 2: R/G/B scales -70/-77/-84, channels R/B; post-channel Gaussian stdDeviation max(.1,.5−2×.1)=.3. Calculated from source.','liquid-default','liquid-backdrop','liquid-disp'),
 L('shading.cast[] / geometry','Host shadow 0 12px 40px black alpha .25; corner radius 999px; padding 24px 32px.','liquid-default','liquid-backdrop'),
 L('edges[] / reflection[]','Two excluded-content masks, each padding 1.5px. At zero mouse offset both gradients are 135deg, white alpha 0/.12/.4/0 at 0/33/66/100% for the screen layer (opacity .2), and 0/.32/.6/0 for the overlay layer. Each has inset 0 0 0 .5px white .5; inset 0 1px 3px white .25; outer 0 1px 4px black .35.','liquid-edge'),
 L('content.decoration[]','Content wrapper font 500 20px/1 system-ui; text shadow 0 2px 12px black .4.','liquid-content')],
 'This is a third-party approximation, not Apple source. Native fidelity and runtime/browser portability were not tested. The excerpt bypasses URL filtering on Firefox. Displacement map assets/generation remain dependencies; numeric parameters alone do not reproduce their pixels. Radial hover layers elsewhere in the file are outside this resting stack.',kind='third-party approximation')
repo('neu-default','neumorphism','src/Configuration.js',11,23,'defaultColor =')
repo('neu-colors','neumorphism','src/Configuration.js',89,104,'angle = 145')
repo('neu-output','neumorphism','src/Configuration.js',160,176,'boxShadowPosition = shape === 1')
repo('neu-math','neumorphism','src/utils.js',1,19,'c + c * lum')
R('R08','Neumorphism.io: raised and pressed source presets','neumorphism,inner-shadow','raised control,recessed field/track','Unmodified #e0e0e0 default, light-source 1; compare shape 0 and shape 1.',[
 L('body.paints[] / geometry','Solid #E0E0E0; radius 50px; distance 20px; blur 60px; color difference .15; gradient disabled in shape 0.','neu-default','neu-output'),
 L('shading.cast[]','Raised: 20px 20px 60px #BEBEBE, −20px −20px 60px #FFF. Colors calculated by channel rounding/clamping: 224×.85→190 and 224×1.15→255. Omitted spread is zero by CSS syntax.','neu-colors','neu-math','neu-output'),
 L('shading.inset[]','Pressed shape 1 prefixes those same two lobes with inset; body remains solid.','neu-output')],
 'A generator specimen, not a complete control/state system. Source-size initialization can change with viewport; no fixed specimen width is inferred. Input blur 60 is distinct from the distance handler’s later blur=distance×2. Top-left lighting is an interpretation of the paired offsets.')
repo('clay-default','clay','src/clay.scss',1,29,'$default-shadow-outset:')
R('R09','Adrian Bece clay.css: default utility','claymorphism','container,raised control','Published defaults before application-specific overrides.',[
 L('body.paints[] / geometry','rgba(0,0,0,.005), radius 32px. The near-transparent default is literal; do not replace it with an invented pastel.','clay-default'),
 L('shading.cast[]','8px 8px 16px 0 black alpha .25.','clay-default'),
 L('shading.inset[] / reflection[]','Inset dark lobe −8px −8px 16px 0 black .25; inset light lobe 8px 8px 16px 0 white .2, after the cast lobe.','clay-default')],
 'Class defaults demonstrate inflated modeling but leave the host fill/ink/context to the application. Roles are possible hosts, not claims of supplied family coverage. Not an accessibility endorsement.')
repo('98-palette','98css','style.css',8,14,'--surface: #c0c0c0')
repo('98-bevel','98css','style.css',50,59,'--border-raised-outer:')
repo('98-button','98css','style.css',146,158,'background: var(--surface)')
repo('98-press','98css','style.css',174,179,'var(--border-sunken-outer)')
repo('98-thumb','98css','style.css',829,832,'--button-face')
R('R10','98.css: crisp mechanical bevel and pressed well','skeuomorphism,bevel-emboss,inner-shadow','raised control,recessed field/track,thumb/knob,edge','Resting/pressed button plus scrollbar thumb.',[
 L('body.paints[] / geometry','#C0C0C0 button, radius 0; scrollbar thumb #DFDFDF.','98-palette','98-button','98-thumb'),
 L('edges[] / reflection[]','Raised edge uses inset offsets (−1,−1) #0A0A0A; (1,1) #FFF; (−2,−2) #808080; (2,2) #DFDFDF, all CSS px, omitted blur/spread zero.','98-palette','98-bevel','98-button'),
 L('shading.inset[] / adaptation','Pressed swaps to (−1,−1) #FFF; (1,1) #0A0A0A; (−2,−2) #DFDFDF; (2,2) #808080.','98-bevel','98-press')],
 'The offset shadows paint a bevel/edge, not a soft floating cast shadow. Historical Windows controls are a technical analogue for physical relief, not the owner’s car-console or terminal icon.')
web('aqua','https://codepen.io/theldoria/pen/XWmExZ','SCSS $r/$g/$b/$y, $gradientFilters and .button')
R('R11','theldoria: CSS Aqua-style gloss band','aqua,linear-gradient','raised control,edge,text','Blue .button.color3; author’s Sass/Compass recipe.',[
 L('body.paints[] / reflection[]','Blue base #2963BD; over it white-alpha .2 through 50%, white-alpha 0 from 50.01%. Source uses Compass linear-gradient without an explicit angle.','aqua'),
 L('edges[] / geometry','Inset zero-offset/zero-blur 2px white .2 ring; radius 3px; padding 15px 30px.','aqua'),
 L('content.ink / content.decoration[]','White ink; text-shadow 0 1px 0 black .5.','aqua')],
 'A published Aqua-inspired interpretation, not Apple’s historical values. Hover changes whole-element opacity to .9; that behavior is not recommended for Area. Gloss-stop values are exact, but a flat-edged sample is not a match for board pill geometry.',kind='historical-style analogue')
repo('aero-window-vars','7css','gui/_window.scss',1,6,'--w7-w-bg: #4580c4')
repo('aero-control-vars','7css','gui/_window.scss',37,45,'--w7-wct-bg:')
repo('aero-window','7css','gui/_window.scss',48,68,'2px 2px 10px 1px')
repo('aero-close','7css','gui/_window.scss',441,450,'0 0 7px 3px #e68e75')
R('R12','7.css: Aero window and glowing window control','frutiger-aero,linear-gradient,outer-glow','floating surface,raised control,edge','Regular .window (not .window.glass); separate close-button hover layer.',[
 L('body.paints[] / reflection[]','Window base #4580C4; lateral gradient white #FFFFFF66 → black #0000001A → white #FFFFFF33. Additional vertical shine: transparent 20%, #FFFFFFB3 40%, transparent 41%.','aero-window-vars','aero-control-vars','aero-window'),
 L('edges[] / shading.cast[] / geometry','Window border 1px #000000B3, radius 6px; outer 2px 2px 10px 1px same black; inset ring 0 0 0 1px #FFFA; pseudo-element inset ring #FFFD.','aero-window-vars','aero-window'),
 L('reflection[] / emission[]','Control gloss #FFFFFF80 → #FFFFFF4D 45% → #0000001A 50% → #0000001A 75% → #FFFFFF80; close hover adds glow 0 0 7px 3px #E68E75.','aero-control-vars','aero-close')],
 'Windows Aero CSS is a useful facet of the broader Frutiger Aero language; it does not establish the imagery/typography of that whole aesthetic. The hover close control also has bitmap glyph and radial paints; the glow is a selected layer, not a full close-button recipe. Eight-digit CSS hex is #RRGGBBAA, unlike XAML.',kind='historical-style analogue')
web('neon','https://codepen.io/Codeible/pen/abwvMdz','CSS custom colors, second .neon-btn rule and ::after')
R('R13','Codeible: neon button, inner bloom and outer halo','glow-neon,inner-glow,outer-glow','raised control,edge,text','Resting .neon-btn, with separate floor-reflection pseudo-element.',[
 L('body.paints[] / edges[]','Fill rgb(100,61,136); border .25em rgb(217,176,255); radius 1em; padding 1em 3em.','neon'),
 L('emission[]','Outer lobes 0 0 1em .25em rgb(217,176,255), 0 0 4em 1em rgba(191,123,255,.781); inner lobe inset 0 0 .75em .25em rgb(217,176,255).','neon'),
 L('content.ink / content.decoration[]','Ink rgb(217,176,255), size 1.5rem; glyph bloom 0 0 .5em same color.','neon'),
 L('reflection[]','::after uses spread color, blur 2em, opacity .7; top 120%, full host width/height; perspective(1.5em) rotateX(35deg) scale(1,.6).','neon')],
 'All lengths retain em/rem units, not guessed px. Hover/focus changes ink and fill and expands a lobe; this report selects rest only. Area would retain fixed hover ink and separate required focus. A luminous border is not an elevation shadow.')
web('ring','https://nikitahl.com/circle-progress-bar-css','Conic gradient section, static .progress-bar example; published 2023-01-27')
R('R14','Nikita Hlopov: conic progress ring with radial cutout paint','conic-gradient,radial-gradient','indicator/fill','Static 75% example, before the animation section.',[
 L('body.paints[]','Top radial paint: closest-side, white 79%, transparent 80%–100%; under it conic hotpink 75%, pink 0 (hard boundary after stop fixup).','ring'),
 L('geometry','100px × 100px; radius 50%.','ring')],
 'This is a white center overpaint, not a transparent hole. Does not reproduce board 7’s round cap or glossy spherical knob. The article’s older browser-support statements and visibility:hidden accessibility suggestion are not adopted; only the static paint recipe is evidence.')
web('mesh-noise','https://codepen.io/adipurdila/pen/rNGLYrd','HTML noiseFilter and CSS body::before/body::after')
R('R15','Adi Purdila: multi-radial mesh approximation and grain','mesh-gradient,radial-gradient,grain','page','Noisy Gradients Mesh — Method 2; radial stacking, not a geometric mesh.',[
 L('body.paints[]','Front-to-back radial layers, each color at 0 fading to transparent 50%: at (40%,20%) hsla(28,100%,74%,1); (80%,0%) hsla(189,100%,56%,1); (0%,50%) hsla(355,85%,93%,1); (80%,50%) hsla(340,100%,76%,1); (0%,100%) hsla(22,100%,77%,1); (80%,100%) hsla(242,100%,70%,1); (0%,0%) hsla(343,100%,76%,1).','mesh-noise'),
 L('texture[]','body::before black input with SVG fractalNoise, baseFrequency 6.29, numOctaves 6, stitchTiles=stitch. Both full-size pseudo-elements use z-index −1 and mix-blend-mode:color.','mesh-noise')],
 'Author labels it mesh, but it is overlapping radial gradients. Source background-image:#ffe699 is invalid CSS and is not counted as a solid base. Seed/texture opacity are not explicitly declared. Composition depends on the surrounding page; fine-noise suitability at Area density is unverified.',kind='mesh approximation / exact primitive values')
web('mesh-native','https://developer.apple.com/documentation/swiftui/meshgradient','Overview 3×3 sample; Markdown version read')
R('R16','Apple SwiftUI: actual mesh geometry sample','mesh-gradient','page,container','Published 3×3 MeshGradient sample.',[
 L('body.paints[]','width=3,height=3; row-major points (0,0),(.5,0),(1,0); (0,.5),(.5,.5),(1,.5); (0,1),(.5,1),(1,1). Colors in the same order: .red,.purple,.indigo; .orange,.white,.blue; .yellow,.green,.mint.','mesh-native'),
 L('body.paints[] / evidence','Mesh patches interpolate vertex colors; this is actual mesh geometry, unlike R15. Color constants are retained literally; their resolved RGB values were not published in the example.','mesh-native')],
 'Exact point geometry and symbolic Color inputs, not a CSS export or a fully resolved RGB recipe. The example does not explicitly supply Bezier handles, color space, clipping geometry, strokes or shadows.',kind='native sample with symbolic colors')
web('gradient-edge','https://css-tip.com/border-gradient/','Two-background-layer alternative and pseudo-element mask alternative; page date 2024-07-10')
R('R17','Temani Afif: rounded gradient edge','gradient-stroke','edge','Two-background alternative, plus transparent-interior mask alternative.',[
 L('edges[] / body.paints[]','Border 10px transparent, radius 25px; white conic fill clipped to padding-box, linear #FF4E50→#40C0CB clipped to border-box. Source does not explicitly write an angle.','gradient-edge'),
 L('edges[] / body.transmission','Transparent-interior alternative: absolute ::before inset 0, padding 10px, same linear gradient, inherited radius; exclude content-box via two conic mask layers.','gradient-edge')],
 'These are distinct alternatives, not stacked techniques. The white-center recipe is opaque. The page now also shows background-clip:border-area; this report selects the established fallback recipes and does not inherit its live browser-support claim.')
web('letterpress','https://codepen.io/ChristyWang/pen/Jobaba?anon=true&view=pen','CSS body and h2')
R('R18','Christy Wang: letterpress display text','letterpress','text','Public h2 specimen.',[
 L('body.paints[]','Page #474747.','letterpress'),
 L('content.ink / content.decoration[]','Ink #222; text-shadow 0px 2px 3px #555; 70px Tahoma, Helvetica, Arial, Sans-Serif.','letterpress')],
 'Single lighter offset lobe is a published recessed-type cue. This large display specimen does not justify the same shadow on small control labels. No glyph geometry is inferred from the screenshot.')
repo('board5','area-research','docs/research/astra/materials/README.md',82,86,'Fill: #E3E3E3 at 80%.')
repo('board6','area-research','docs/research/astra/materials/README.md',87,92,'Text: #FFF 100%')
R('R19','Owner board 5: annotated Reject button','transparency,gradient-stroke,drop-shadow','raised control,edge','Owner’s transcribed annotation; original public URL and attached image unavailable.',[
 L('body.paints[]','#E3E3E3 alpha .80.','board5'),
 L('edges[]','Linear stroke #FDFDFD alpha 1 at 0% → #F1F1F1 alpha 0 at 100%; separate outer ring black .16, x0 y0 blur0 spread1.','board5'),
 L('shading.cast[]','Black .10, x0 y2 blur4 spread0.','board5')],
 'No gradient angle, stroke width, corner, dimensions or text styling is specified. Board lengths are recorded as printed annotation units, not independently measured CSS px. Ring and soft cast remain separate. This is owner evidence, not an independently located public reference.',kind='owner-supplied annotation')
R('R20','Owner board 6: annotated dark Button Label','linear-gradient,drop-shadow','raised control,edge,text','Owner’s transcribed annotation; original public URL and attached image unavailable.',[
 L('body.paints[]','Opaque #1D1F23 below a white-alpha gradient 0→.15.','board6'),
 L('edges[]','Top-only white .15 stroke, 1.5px; separate black alpha1 ring, x0 y0 blur0 spread1.5.','board6'),
 L('shading.cast[]','Black .20, x0 y4 blur7 spread0.','board6'),
 L('content.ink / content.decoration[]','White alpha1; text shadow black .40, x0 y4 blur4, annotated spread0. CSS text-shadow has no spread parameter.','board6')],
 'Angle, gradient stop positions, corner and dimensions are unspecified. No backdrop translucency follows from the top paint: the base is opaque. Non-stroke lengths remain printed annotation units. This text shadow is not evidence of letterpress.',kind='owner-supplied annotation')
repo('elevation-compose','material','packages/mdc-elevation/_elevation-theme.scss',182,196,'$umbra-color: rgba')
REFS[1]['layers'][1]['evidence'].append('elevation-compose')
REFS[6]['styles'].remove('radial-gradient')
BOARD=[
 (1,69,72,'Partial layer analogues',['R11','R12','R13','R18'],'Gloss bands, control glow and engraved-text cues have numeric sources. No exact metallic tray, traffic-light disks or three-color spill recipe found.'),
 (2,73,75,'Partial layer analogues',['R03','R04','R02'],'Frosted container plus separate opaque/quiet card is supported. Sky artwork, diagram-node stroke, Global-tab tint and complete composition are not matched.'),
 (3,76,78,'Partial layer analogues',['R10','R18','R03'],'Crisp double bevel, text relief and frosted panel primitives are inspectable. No exact light pill, concentric double rim or frosted yellow/blue calendar-icon recipe found.'),
 (4,79,81,'Partial layer analogues',['R13','R20'],'Outer emission and top-edge/cast layers are documented. R20 is owner evidence, not public corroboration. Exact blue hue, split divider and translucent plus disk remain unknown.'),
 (5,82,86,'Owner annotation preserved; public match not found',['R19','R17','R02'],'Every printed fill/edge/cast value is retained in R19. R17 and R02 explain mechanisms only; they do not independently validate this button. Angle, stroke width, radius and dimensions are unspecified.'),
 (6,87,92,'Owner annotation preserved; public match not found',['R20','R11','R02'],'Every printed paint/top stroke/ring/cast/text value is retained in R20. Public recipes supply only analogous layers. Gradient angle/stops and geometry remain unspecified.'),
 (7,93,94,'Partial layer analogue; main object gap',['R14','R17'],'Conic/radial ring and gradient rim are inspectable. No exact black sphere knob, round cap or squircle geometry source found; a radial cutout is not a radial specular sphere highlight.'),
 (8,95,97,'Partial layer analogues',['R10','R13','R15'],'Bevel, luminous emission and procedural grain have values. No exact car-console housing, curved rocker, green LED or matte key stack found.'),
 (9,98,99,'Partial layer analogues',['R08','R17','R18'],'Pressed well, gradient rim and text relief are supported. No exact terminal glyph, app-icon squircle or complete dark icon recipe found.'),
 (10,100,101,'Partial layer analogues',['R08','R11'],'Inset track model and gloss-band paint can be studied separately. These sources are not a dark Segmented control; active thumb geometry, light direction and state ink remain unmatched.'),
 (11,102,104,'Partial layer analogues',['R08','R10','R15'],'Recess, opposed edge lines and grain mechanisms are available. Exact orange/brown toggle, divider dimensions and noise strength are not found. Board label-color change is not an Area state proposal.'),
 (12,105,107,'Platform guidance plus approximation',['R06','R07','R04'],'Apple identifies the native material/API; rdev supplies numeric web lensing/rim parameters; Acrylic supplies a separate native frost recipe. None validates the board’s selected white disk, menu separators or native optical constants. Official Apple Figma kit is in the access ledger.'),
 (13,108,109,'Partial layer analogue',['R03'],'Exact white-alpha/frosted card without a declared rest stroke. Its 5px blur and 15px radius are its own values, not measurements of the board’s “heavy” blur/“large” radius. Chart ink and photo are unverified.'),
 (14,110,111,'Partial layer analogues',['R13','R15','R07'],'Glow, radial paint and glass control mechanisms are available. No exact navy/purple edge-glow sheet or combined paint stack found.'),
 (15,112,113,'Partial layer analogues',['R07','R17','R15'],'Inspectable displacement, gradient edge and grain parameters exist separately. Exact thumb warp/map, yellow-blue track and complete toggle are not found; Apple fidelity is not implied.'),
 (16,114,116,'Partial layer analogues',['R11','R10','R02'],'Gloss band, bevel and cast shadow provide source values. No exact green jelly shading, bottom inner rim, tray geometry or icon color found. Aqua gloss is not a physically specified jelly material.'),
 (17,117,118,'Partial layer analogues',['R11','R12','R01'],'Aqua gloss, Aero chrome and flat paint cover visual ingredients. Glass disc, exact blue tile and gray neighboring tiles are not matched; Frutiger Aero is broader than a CSS gradient.')
]
for n,a,b,*_ in BOARD:repo('board-'+str(n),'area-research','docs/research/astra/materials/README.md',a,b,'')
STYLE_NOTES={
 'flat':'R01 is a specific flat button, not a universal ban on every stylesheet shadow.',
 'paper':'R02 is legacy Google MDC Web; no paper fiber is implied.',
 'transparency':'R03 separates child body alpha from blur; R19 is owner-only evidence.',
 'glassmorphism':'R03 is an inspectable CSS frost recipe.',
 'acrylic':'R04 is native WinUI code, with host geometry and noise asset separate.',
 'mica':'Partial: exact fallback/overlay values; active optical constants not found.',
 'liquid-glass':'Partial native API evidence (R06), numeric third-party approximation (R07); no complete Apple optical recipe.',
 'neumorphism':'R08 has source-resolved colors and paired raised/pressed lobes.',
 'claymorphism':'R09 preserves the library’s near-transparent default rather than inventing a pastel.',
 'skeuomorphism':'R10 provides mechanical relief, not all real-object metaphors.',
 'aqua':'R11 is an author’s CSS interpretation, not Apple source.',
 'frutiger-aero':'R12 covers Aero chrome; broader cultural imagery is not a numeric material.',
 'glow-neon':'R13 separates inner emission, outer emission and text bloom.',
 'linear-gradient':'R11/R12 public values; R20 owner-only annotation has unspecified angle/stops.',
 'radial-gradient':'R14 supplies a radial overpaint; R15 supplies decorative color blobs.',
 'conic-gradient':'R14 static percentage indicator, not a complete accessible widget.',
 'mesh-gradient':'R15 is a radial approximation; R16 is true mesh geometry with symbolic native colors.',
 'gradient-stroke':'R17 publishes both opaque-center and transparent-center alternatives.',
 'inner-shadow':'R08 pressed relief and R10 crisp bevel model different edge profiles.',
 'inner-glow':'R13 inset emission, distinct from black occlusion.',
 'outer-glow':'R13 emission and R12 selected hover glow.',
 'drop-shadow':'R02 supplies independent umbra/penumbra/ambient lobes; R19/R20 preserve board annotations.',
 'bevel-emboss':'R10 crisp opposed edge pairs.',
 'letterpress':'R18 is display typography, not small-text guidance.',
 'grain':'R15 procedural SVG values; R04 bitmap-noise opacity without bitmap reproduction.'
}
