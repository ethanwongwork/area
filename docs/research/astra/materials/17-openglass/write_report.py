"""Render the curated, source-pinned OpenGlass audit. No network or production writes."""
from pathlib import Path
import hashlib, json, re, subprocess
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[4]
OG='4943bbfd5611fe211cccf4b50c384345468d635b'
AREA='eaa9222ebf98f7c260f9e0dd448940523003d4d3'
RESEARCH='ce84e32725f4e9321c77b4a75eb142a1c565674c'
OGBASE=f'https://github.com/moekoelueker/open-glass-ui/blob/{OG}/'
ABASE=f'https://github.com/ethanwongwork/area/blob/{AREA}/'
RBASE=f'https://github.com/ethanwongwork/area/blob/{RESEARCH}/'
ALIASES={'l':'packages/recipes/src/liquid.source.css','b':'packages/recipes/src/styles.css','i':'packages/recipes/src/index.tsx','a':'packages/recipes/src/atlas.tsx','look':'packages/core/src/look.ts','theme':'packages/react/src/theme.tsx','glass':'packages/react/src/glass.tsx','css':'packages/renderers/src/css.ts','palette':'packages/core/src/theme.ts','cap':'packages/renderers/src/capabilities.ts','provider':'packages/react/src/provider.tsx'}
refs=[]
def ref(owner,path,start,end):
    if owner=='og': path=ALIASES.get(path,path)
    if owner=='research': path='docs/research/astra/materials/'+path
    sha={'og':OG,'area':AREA,'research':RESEARCH}[owner]
    url={'og':OGBASE,'area':ABASE,'research':RBASE}[owner]+path+f'#L{start}-L{end}'
    r={'owner':owner,'commit':sha,'path':path,'start':int(start),'end':int(end),'url':url}
    if r not in refs: refs.append(r)
    return f'[{path}:{start}–{end}]({url})'
def pins(s):
    return re.sub(r'\{(og|area|research):([^:}]+):(\d+)-(\d+)\}',lambda m:ref(*m.groups()),s)
def write(name,s): (HERE/name).write_text(pins(s.strip())+'\n')
write('README.md','''
**Question:** How do OpenGlass UI's shared GlassLook controls reach its forty components, where do its recipes and safety paths break, and what does Area's proposed model add?

**Answer:** OpenGlass is a substantial implemented precedent: shared optical controls, distinct wells/handles/sheets, and forty React recipes—not just a glass generator.
Its latest commit remains `4943bbf`, the task 02 pin. All forty are traced below, including parts that deliberately ignore GlassLook.
The main gaps are incomplete control coverage, inherited-look loss through portals, incomplete transparency/motion fallbacks, and contrast checks that do not qualify arbitrary glass backdrops.
A concrete rendering defect lets a dialog close button's decorative ring stretch across the panel.
Area adds explicit part roles, absorption/context caps, independent Surface ownership and stricter effective-paint safeguards; these material features remain proposals, not a shipped advantage.
The pinned packages built; all 137 upstream unit tests passed; the local atlas rendered all forty entries and its dialog opened and dismissed.

**Snapshot:** checked **2026-10-10** (America/Los_Angeles). OpenGlass default `main`/HEAD: `4943bbfd5611fe211cccf4b50c384345468d635b` (commit 2026-09-29T13:57:49-07:00). Area `origin/main`: `eaa9222ebf98f7c260f9e0dd448940523003d4d3`. Research inputs: `ce84e32725f4e9321c77b4a75eb142a1c565674c`. Fetched origin before reading the research instructions. Read the materials brief and task 02 before this audit. Repository facts below use commit-pinned source lines only; local execution is recorded separately, never used to estimate paint values. [Source lock](source-lock.json).

## Evidence

- [Value flow and per-role recipes](flow.md): every GlassLook input, both paint paths, renderer boundaries and nesting.
- [All forty components](components.md), also [components.json](components.json): anatomy, consumed controls, fixed treatments, fallback and nesting caveats with JSX/CSS pins.
- [Strengths and breaks](findings.md): source-derived counterexamples, fallback coverage and the exact limits of contrast evidence.
- [Area comparison](area-comparison.md): implemented Area facts versus unreviewed material proposals, including inconsistencies already found in task 15.
- [Local rendering and verification](verification.md): reproducible commands, executed checks and untested paths. Screenshot is demonstration only.

The count comes from the actual atlas and its source test, not an inferred package export count: {og:tests/e2e/component-atlas.spec.ts:26-40}. Glass, providers, filter definitions and ToastProvider are supporting APIs, not extra entries in this forty-component census. Every entry has its declaration and paint sources in the inventory. “Roles” in this report are an analytical crosswalk to Area, not a claim that OpenGlass exposes Area's role API.

Task 02 already corrected the brief's uniqueness hypothesis; this report deepens that finding at the same upstream pin. {research:02-prior-art/README.md:1-28}

## Proposals

**Recommended:** use OpenGlass as a source-level reference and a set of adversarial cases for Area's implementation plan. Preserve its separation of quiet menu rows, wells, handles and overlay shells, but route Area paint through explicit receiver/cap/fallback resolution. Do not import its button casts, animated lens thumbs, geometry changes or whole-control hover filters wholesale. The precise differences and source pairs are in [area-comparison.md](area-comparison.md).

**Alternative:** adapt its recipes as a separate opt-in visual language. This would be quicker for a glass demonstration, but would require an explicit exception to Area's current elevation, hover-ink and geometry contracts; it would not implement the full materials series. Neither option is adopted here.

## Open questions

- Should Area require atomic preset resets or preserve compatible patches on a recipe change? Task 07 proposes explicit provenance; task 15 found that task 13's complete role records do not yet encode it. Do not copy either schema without resolving that conflict.
- Which explicit overlay/scene contexts may acquire a backdrop? OpenGlass's local per-element treatments do not provide Area's proposed ownership budget.
- Source review is not a full accessibility certification. Arbitrary backdrop contrast, forced-colors on an actual Windows setup, assistive technology, Safari/Firefox and every state combination were not executed here.
- No upstream issue, fix, package change or pull request was made. Earlier materials folders are unchanged.

## Reproduce

Run `python3 docs/research/astra/materials/17-openglass/write_report.py` to render the curated audit, then `python3 docs/research/astra/materials/17-openglass/check.py`. Both locate paths relative to themselves. The validator checks forty distinct entries, source-line bounds and exact source hashes when the ignored clone is present. See [verification.md](verification.md) for clone/build/demo commands. Generated JSON files stay below 1 MB.
''')
write('flow.md','''
# GlassLook: value flow and role recipes

All OpenGlass links pin `4943bbfd5611fe211cccf4b50c384345468d635b`. Role labels are this audit's synthesis. Reading a property is not evidence that every state or every family reacts to it.

## Four different selections

1. **Design** is `liquid` versus `classic`. The provider defaults to liquid and chooses a soft radius when none is explicit. It also creates a fresh palette from its own inputs. {og:theme:67-106}
2. **Material** is `clear`, `regular` or `frosted`, a physical/optical record with thickness, IOR, dispersion, edge strength, bevel and frost. These are not the GlassLook presets. {og:packages/core/src/materials.ts:4-44}
3. **GlassLook** is a sparse object or one of five sparse presets: `liquid`, `frosted`, `clear`, `smoked`, `lensed`. Liquid is the empty object; a preset is not a complete reset. {og:look:41-101}
4. **Palette** supplies semantic ink, accent, focus and radii. GlassLook is not an input to its contrast calculation. {og:palette:189-241}

## From input to paint

`theme.glass` → `createGlassLookTokens` → `--ogui-glass-*` on the provider → inherited CSS inputs → derived `--ogui-lg-*` at liquid design/tone boundaries → component selectors. Look tokens are sparse; computed color variables are not registered with @property in these definitions. Liquid registers only its numeric animated glint. Provider style wins locally; its React token record only copies style overrides for keys already in that record. {og:theme:108-148} {og:look:104-155} {og:l:18-22} {og:l:41-165}

The second path is `Glass`: material preset + optional optics → `createCssMaterialTokens` → inline background/border/shadow/ink/backdrop-filter. `look` adds local CSS inputs after those tokens; caller `style` wins last. Glass marks itself with design and tone, allowing local derived CSS to be emitted again. Toolbar, Dock and Menu/Popover shells take this path; the other recipe roots are ordinary DOM styled through recipe CSS. {og:glass:73-121} {og:glass:150-162} {og:css:300-309} {og:i:429-481} {og:i:793-817}

The generated `liquid.css` is imported with base `styles.css`. Its generator inserts classic-scope guards into the authored `liquid.source.css`; this report cites the authored definitions and the guard algorithm rather than pretending the authored sheet is loaded directly. {og:i:24-25} {og:scripts/generate-liquid-css.mjs:21-86}

## Each control, its domain and actual receiver

- **blur:** multiplier clamped 0…4; affects recipe filter tiers of 12px controls, 24px surfaces, 36px sheets/tooltips. Glass has separate base radii: clear 3px, regular 14px, frosted 30px; frost overrides interpolate. Zero blur still leaves saturation/brightness in the filter chain. {og:look:85-94} {og:l:76-84} {og:l:139-147} {og:css:34-60} {og:css:142-157} {og:css:169-209}
- **opacity:** 0…3 multiplier, not element opacity and not a global transparency percentage. Dark recipe fill/rest/hover/active alphas are .1/.16/.22; light .52/.7/.82. Surface tint is 42% dark/52% light; sheet 62%, capped at 100%. Wells, thumbs, scrim and several semantic fills have independent fixed alpha. {og:look:85-94} {og:l:43-51} {og:l:85-102} {og:l:110-118} {og:l:148-164}
- **tint:** string or dark/light pair. Used by surface/sheet and Glass material background, not ordinary white recipe fills, wells or knob bodies. Mode-specific tint takes precedence over generic tint. Input rejects declaration delimiters, not low-contrast colors. {og:look:13-18} {og:look:139-155} {og:l:85-96} {og:l:148-159} {og:css:169-187}
- **saturation:** 0…3 multiplier. Recipe tiers start at 1.8; Glass material tiers use 1.9/1.85/1.7 for clear/regular/frosted. This is backdrop saturation, not semantic accent intensity. {og:look:85-94} {og:l:76-84} {og:css:142-157} {og:css:201-208}
- **brightness:** .3…2 multiplier. Recipe control/sheet/surface baselines are .66/.6/.56 dark and 1.1/1.06/1.08 light. The Glass path has different per-material baselines. It does not recalculate foreground. {og:look:85-94} {og:l:76-84} {og:l:139-147} {og:css:142-157}
- **rim:** 0…2, scales edge alpha, directional specular alpha and directional inner bloom. It does not scale the separate lensing band or fixed well/knob shadows, despite the API comment saying zero removes the edge. {og:look:23-24} {og:look:85-94} {og:l:48-69} {og:l:97-100}
- **highlight:** 0…2, scales conic specular/counter-reflection only. Zero leaves the hairline, lensing and bloom. It is not a switch for the button's pointer glint or a Card's separate gradient. {og:look:25-26} {og:l:54-69} {og:l:303-328} {og:l:810-821}
- **lightAngle:** finite degrees normalized modulo 360; default 340deg, with 0 at top and 90 at right. It aims the ring and bloom. Cast shadows keep their vertical offsets; this is not a unified physical light rig. {og:look:27-28} {og:look:62-63} {og:look:119-127} {og:l:67-75} {og:l:207-217}
- **lightSpread:** clamp 0…170deg; default 110deg. Zero is encoded as 1deg plus highlight=0 to suppress a sliver. Narrowing spread is not changing softness or rim width. {og:look:29-32} {og:look:62-63} {og:look:128-137} {og:l:207-217}
- **lensing:** 0…3 multiplier; scales the blur radius and alpha of an inset luminous band (14px in recipe CSS, 16px in Glass), not a displacement shader. {og:look:33-34} {og:look:85-94} {og:l:64-65} {og:l:128-129} {og:css:188-200}
- **shadow:** 0…3, scales alpha of shared lift lobes, not their offset/blur/spread. Recipe lift is `0 1px 2px` plus `0 6px 18px -6px`; high lift is `0 2px 4px` plus `0 24px 64px -12px`, with distinct light/dark alpha. Primary Button, knob, checked choice and indicator glows can bypass this multiplier. {og:look:35-36} {og:look:85-94} {og:l:70-75} {og:l:133-138} {og:l:381-385} {og:l:99-100} {og:l:1121-1132}

No independent controls for cast geometry, relief depth, gradient stop lists, grain, arbitrary edge coverage or role patches appear in the complete GlassLook interface. CSS `--ogui-glass-rim-width` exists with a 1px default, but is not a typed GlassLook field. No numerical performance safety bound is inferred from these input clamps. {og:look:8-59} {og:l:205-206}

## Shared role recipes

These recipe IDs connect the forty entries to exact sources. They are descriptive audit names, not exported APIs.

**G — material shell (container/floating surface).** Glass emits tinted body, material-dependent filter and a four-lobe stack: directed bloom, inner lensing, contact cast, distant cast. Shared conic mask ring is CSS. clear/regular/frosted preserve different optical baselines; all eleven look inputs can affect the liquid result across the inline stack and ring. Classic material tokens do not consume the look multipliers, and recipe liquid rules are excluded by design. {og:css:142-209} {og:css:212-297} {og:l:179-227}

**B — raised control.** Ordinary Button/overlay trigger/restore/ToggleButton: white transmission fill, pointer glint, inner lensing + bloom + two lift lobes, control-tier filter, mask ring. Primary replaces body/shadow with accent-specific constants; quiet removes filter/shadow and shows rim on hover. B consumes opacity, blur/saturation/brightness, rim/highlight/angle/spread, lensing and shadow; not generic tint. Full variant caveats stay in the census. {og:l:303-425}

**W/I — recessed track with selection plate.** Segmented, Tabs and Pagination use fixed well and well-shadow, control-tier filter, then a fixed-alpha raised selection plate with lensing/bloom/lift/ring. The measured animated plate for Segmented/Tabs has a pre-measurement selected-button fallback. Fixed well/thumb bodies do not take opacity/tint; hover plates and child actions may. {og:l:452-519} {og:l:522-563} {og:l:1044-1062}

**K — switch/range knob.** Fixed well/track, semantic selected fill, opaque white handle and fixed knob shadows. Press changes to a translucent enlarged lens; Switch adds a hard-coded 1px blur/saturation/brightness filter. These parts are not controlled by the eleven look fields in ordinary rest paint. This is intentional specialization but is not complete global adjustability. {og:l:569-725}

**S — content surface.** Card/Accordion share surface tint, a directional gradient, rim/bloom/lift and surface-tier filter. Toast swaps to sheet tint, high lift and heavy filter. These shells consume all eleven fields through body/filter/ring/shadow. Labels and content use semantic ink; children do not automatically suppress their own effects. {og:l:810-880} {og:b:654-720}

**F — floating sheet.** Dialog/Drawer use sheet, high lift, rim/bloom and heavy filter; Tooltip uses sheet, rim/lift and heavy filter. Scrim is separate fixed alpha plus fixed 10px blur and 1.3 saturation. Close control has fill/lensing/ring. Ring and sheet channels cover all eleven look fields; scrim does not. {og:l:791-803} {og:l:922-973}

**E — editing/choice well.** TextField/Textarea/Select/SearchField/NumberField use fixed well/shadow at rest; focus changes body to adjustable fill and adds an independent focus ring/halo. Checkbox/RadioGroup have fixed wells and fixed accent-selected relief. FileDropzone uses well then a fixed semantic tint on drag/focus. Main editing shells consume opacity on focus, not global tint/blur/lensing/shadow. This is a useful reading-role distinction, although fixed transparent wells are not guaranteed opaque. {og:l:1069-1148}

**D — identity/status/content.** Badge uses control fill/rim/filter, with fixed tone fill for semantic variants. Avatar uses a fixed radial/accent body plus shared rim/lift. Stat/Breadcrumbs/Stepper are mainly semantic text/marks; Progress/Meter are data fill and fixed well; Spinner/Skeleton fixed status treatment. Their fixed paint is not a missing GlassLook wire by itself; it is a narrower control promise. Every exact part and override appears in the census. {og:l:979-1041} {og:b:559-652} {og:b:722-860} {og:b:947-975} {og:b:1523-1606}

The census uses four narrower IDs alongside D: **row** is the unfiltered MenuItem hover plate; **feedback** is Alert/Banner with fixed semantic body/signal and shared rim/lift/filter; **text** is Stat/Breadcrumbs/Stepper with semantic text/marks rather than a glass shell; **data** is Progress/Meter/Spinner/Skeleton with fixed/native status paint. These IDs only classify the source above and in each census row. {og:l:771-780} {og:l:897-917} {og:l:1014-1041} {og:b:1523-1606}

**Page and scrim are distinct.** The palette provides page/background and canvas colors independently of GlassLook; a page backdrop is consumer content. Scrim uses its own fixed recipe. OpenGlass does not assign explicit relative-depth records or a twelve-role enum to these parts. Area's page/container/float/control/well/knob/indicator/divider/edge/glyph/text/scrim mapping is analytical, not inferred upstream metadata. {og:palette:189-241} {og:l:922-935} {og:look:8-59}

**Edge, divider, glyph, text.** The conic ring is separate from semantic outlines; separators use hairline; most glyphs inherit current ink, native choice/progress state stays separate. There is no explicit role resolver. Material-muted is mixed toward primary ink in Glass and again by recipe remapping; this is a fixed heuristic, not a worst-backdrop contrast solve. {og:l:179-227} {og:l:249-297} {og:css:162-167} {og:i:1029-1053}

## Nesting and renderer boundaries

A local Glass look establishes a new marked CSS boundary, while arbitrary local variables on a Button can miss already-resolved ancestor `--ogui-lg-*` values. Use provider/Glass boundaries for derivation; do not infer a per-component Look prop from arbitrary HTML style support. The public Button props and implementation expose no such typed prop. {og:theme:108-148} {og:glass:110-162} {og:l:41-165} {og:i:162-223}

Nested providers independently construct palette/appearance/design; only absent CSS look leaves inherit. This creates a mixed model of React replacement and CSS inheritance. Menu/Popover, Dialog/Drawer and ToastProvider portal copies are intentional and useful, but copy **recorded tokens**, not the entire effective cascade. Concrete counterexamples are in findings F02–F03. {og:theme:67-148} {og:i:793-817} {og:a:685-743} {og:a:951-958}

Quiet menu rows avoid a filter each, and fields are wells. But a Card containing a secondary Button has both the surface-tier and control-tier declarations; Dialog combines scrim blur, shell blur and potentially blurred children. No ownership/context cap is consulted by those selectors. Whether a browser reuses compositor work is not determined by this source audit. {og:l:303-319} {og:l:766-780} {og:l:810-821} {og:l:922-935}

`selectRenderer` is CSS-first and forces CSS for reduced transparency/forced colors. Explicit SVG support checks element availability; it is not proof of backdrop URL rendering. Glass uses `filter: url(...)` for an explicitly supplied non-CSS filterId. SDF filters consume SourceGraphic, and the WebGL surface accepts a supplied media source and lens records. GlassLook.lensing does not enter those maps or shader uniforms. Do not describe all forty components as refractive WebGL lenses. {og:cap:108-139} {og:glass:83-120} {og:packages/react/src/filters.tsx:26-33} {og:packages/react/src/filters.tsx:56-136} {og:packages/react/src/filters.tsx:179-195} {og:packages/react/src/webgl-surface.tsx:14-32} {og:packages/react/src/webgl-surface.tsx:142-155}
''')
# Every row is curated from the declarations and both stylesheets. Shared policy pins
# are repeated in the generated inventory so rows remain independently traceable.
rows=[
('Button','i',178,223,'B','raised-control; edge; glyph; text',[(303,425)],[(30,143)],'Secondary follows B; primary keeps fixed accent gradient/casts and filters the whole button on hover. Quiet has no backdrop filter; danger uses semantic danger accent inherited from base CSS. No tint control on its white body.','CSS recipe fallback; fixed primary/danger paint remains outside generic fill replacement.'),
('IconButton','i',229,247,'B','raised-control; edge; glyph',[(303,425)],[(145,161)],'Delegates to Button; quiet by default. Its icon is content inside the label slot, not a separate refractive role.','Same variant/fallback limits as Button.'),
('SegmentedControl','i',264,300,'W/I','recessed-field-track; thumb-knob; text; edge',[(452,519)],[(163,215)],'Fixed well and thumb alpha; shared filter/rim/lift; moving indicator receives measured geometry. Hover of unselected labels changes ink.','Opaque well/thumb substitutions; forced selection retains Highlight/HighlightText; indicator motion shortened.'),
('Switch','i',308,366,'K','recessed-field-track; thumb-knob; indicator-fill; text',[(569,626)],[(217,294)],'Native hidden checkbox owns state. White knob, fixed casts and selected accent bypass GlassLook. Press adds fixed translucent lens/filter.','Rest well resolves opaque; pressed hard-coded lens survives reduced transparency. Reduced motion removes active scale but keeps state position.'),
('Slider','i',373,421,'K','recessed-field-track; thumb-knob; indicator-fill; text',[(633,721)],[(296,348)],'Native range; exact value fill, fixed knob, fixed active lens. Main optical parts do not consume Look controls.','Well substitutes; active thumb alpha and pseudo-element transition are not in shared fallback overrides.'),
('Toolbar','i',429,453,'G+B','container; raised-control; edge; glyph; text',[(731,749)],[(350,365)],'Glass regular shell plus caller children; quiet buttons are locally quiet. Shell consumes all Look fields; no child ownership policy enforces quiet variants.','Glass runtime fallback for shell, CSS fallback separately for children.'),
('Dock','i',460,481,'G+B','container; raised-control; edge; glyph; text',[(731,756)],[(367,378)],'Glass regular nav shell; child buttons retain their own recipe and hover translation/scale.','Glass shell fallback; explicit motion off removes dock hover transform, OS reduced-motion path mainly shortens transitions.'),
('Tabs','i',498,600,'W/I','recessed-field-track; thumb-knob; text; container',[(452,483),(522,563)],[(380,417)],'Fixed well/selection plate with shared filter/rim/lift; panel is content, not another automatic glass sheet.','Opaque plate/well; fallback selected-button paint before indicator ready; forced selected ink/marker retained.'),
('Menu','i',912,925,'G','floating-surface; raised-control; text; edge',[(760,780)],[(419,455)],'DisclosureSurface portals a Glass frosted shell with copied provider tokens. Trigger is caller content; rows consume local hover fill without independent blur.','Glass shell fallback; portal cannot retain unrecorded CSS look inheritance.'),
('MenuItem','i',930,958,'row','raised-control; text; glyph',[(771,780)],[(457,481)],'Transparent command row; hover uses Look opacity through fill-hover; destructive ink is semantic. No own lens/blur/cast/ring.','Hover fill substitutes; depends on containing menu for readable ground. Inherits whichever portal scope is actually emitted.'),
('Popover','i',963,977,'G','floating-surface; container; text; edge',[(760,764)],[(419,455),(483,487)],'Same portalled Glass frosted shell as Menu; content has dialog role and may contain independently painted children.','Glass fallback and recorded-token portal limitation; no automatic nesting cap.'),
('Tooltip','i',984,1010,'F','floating-surface; text; edge',[(791,803)],[(489,528)],'Inline wrapper and bubble, not a portal; sheet, rim/lift and heavy blur. All Look fields through shared body/ring/filter/lift.','CSS opaque sheet/no heavy blur; forced-color real edge; remains subject to ancestor clipping.'),
('MediaControls','i',1055,1117,'B+K','container; raised-control; recessed-field-track; thumb-knob; indicator-fill; glyph; text',[(633,725)],[(530,550)],'Quiet IconButtons plus native seek range and time output; container is not a Glass surface. K paint is fixed; buttons receive B subset.','Combined quiet-button/range fallbacks; no automatic WebGL media surface.'),
('Badge','a',37,40,'D','indicator-fill; text; edge',[(979,996)],[(568,606)],'Neutral body uses opacity fill; control filter, lensing and ring. Tone variants keep fixed semantic fill/ink and an additional tone inset. No generic tint or shared cast.','Control blur disabled in reduced transparency; semantic fixed-alpha body bypasses fill substitution.'),
('Avatar','a',47,72,'D','glyph; edge',[(999,1002)],[(608,642)],'Image or initials on fixed radial/accent body. Shared lensing/lift/ring respond; no backdrop blur, tint or opacity body control.','No normal blur to remove; forced mode removes ring. Intrinsic image is not transformed into a new material.'),
('AvatarGroup','a',73,76,'D','container; glyph; edge',[(1005,1011)],[(644,662)],'Layout grouping only; child Avatars carry D recipe. Fixed canvas outline and overlap, hover lift; no new group shell.','Child fallback; reduced motion suppresses transition but can leave instantaneous hover offset.'),
('Card','a',85,130,'S','container; edge; text; divider',[(810,855)],[(664,725)],'Surface tint/gradient, rim/bloom/lift/filter; optional interactive hover uses high lift and transform. Footer uses hairline, labels use semantic ink.','CSS opaque surface and removed background image; children remain independent paint consumers.'),
('Stat','a',138,147,'text','text; indicator-fill',[(916,917)],[(727,753)],'No optical shell. Label/value/change are semantic type/tone; liquid adjusts tracking. No direct GlassLook field affects its own body.','Depends on host readability; no extra optical layer to fall back.'),
('Progress','a',154,168,'data','recessed-field-track; indicator-fill; text',[(1014,1031)],[(755,806)],'Native progress with fixed well and accent gradient/glow; dimensions/value remain native. GlassLook does not tune the value gradient/glow.','Well substitution does not remove fixed optional fill glow; browser-specific pseudo-element declarations differ.'),
('Meter','a',179,207,'data','recessed-field-track; indicator-fill; text',[(1014,1017)],[(774,784),(808,823)],'Native meter receives well on host; platform internals and thresholds own the value presentation. No custom Look-driven fill recipe.','Well token fallback is not evidence of identical native meter appearance across engines.'),
('Spinner','a',208,220,'data','indicator-fill; text',[(1038,1041)],[(825,841)],'Fixed border ring, accent top, semantic status text. No Look-controlled blur/cast.','Base reduced-motion and explicit off slow rotation to 1.6s rather than remove it; this is its explicit status policy.'),
('Skeleton','a',221,235,'data','indicator-fill',[(1033,1034)],[(843,869)],'Fixed well body and animated fixed-alpha shimmer; no Look controls on its own paint.','Opaque well; base reduced-motion/off removes shimmer animation.'),
('Alert','a',242,270,'feedback','container; indicator-fill; text; raised-control; edge',[(897,913)],[(871,918)],'Fixed semantic translucent body and signal glow; shared rim/lift/control filter and conic edge. Dismiss action has semantic hover fill.','Shared blur stops; fixed tone body/glow does not become an opaque surface via fill replacement.'),
('Banner','a',278,322,'feedback','container; indicator-fill; text; raised-control; edge',[(897,913)],[(920,952)],'Fixed accent-alpha body and flare; shared rim/lift/control filter/ring. Caller action can be another independent B recipe.','Shared blur stops; accent body/flare remain outside generic opaque-fill substitutions.'),
('Breadcrumbs','a',328,352,'text','text; glyph',[],[(954,981)],'Semantic links/current text and slash separators; no material shell. Hover changes ink.','Host must provide readable ground; no per-crumb optical effect or Look control.'),
('Pagination','a',381,425,'W/I','recessed-field-track; raised-control; thumb-knob; text; edge',[(452,462),(1044,1057)],[(983,1020)],'Well/filter group; fixed-alpha selected page body with rim/lift/ring. Unselected hover uses fill-hover and changes ink.','Opaque well/thumb and forced selected pair; ordinary text retains host dependency.'),
('Accordion','a',432,496,'S','container; divider; raised-control; glyph; text; edge',[(810,821),(858,870)],[(1022,1073)],'Whole accordion gets surface recipe; sections use hairlines, header buttons/content stay plain. No separate blur per row.','Opaque shared surface/image removal; existing expand glyph/content motion receives base fallback.'),
('Dialog','a',748,751,'F+B','floating-surface; scrim; raised-control; edge; text',[(922,935),(960,973)],[(1083,1179)],'Overlay helper portals tokens. Fixed scrim filter plus heavy shell; built-in trigger uses B; close uses fill/lensing/ring. Close ring lacks local positioning (F01).','Opaque sheet/heavy filter removal; scrim fixed blur survives transparency preference; portal record limitation.'),
('Drawer','a',752,755,'F+B','floating-surface; scrim; raised-control; edge; text',[(922,973)],[(1083,1179)],'Same Overlay helper and close-ring defect, with edge-mounted geometry/slide animation. All Look fields reach sheet, not scrim.','Same sheet/scrim/portal limits as Dialog; reduced-motion removes entrance animation.'),
('Toast','a',767,891,'S+B','floating-surface; indicator-fill; raised-control; text; edge',[(873,894)],[(1181,1247)],'Sheet/high lift/heavy filter; fixed success-mark glow; built-in restore uses B. Standalone Toast is inline; ToastProvider supplies optional portal viewport.','Opaque sheet, removed image/heavy filter; fixed status glow remains. Provider portal copies recorded tokens only.'),
('Checkbox','a',1003,1032,'E','recessed-field-track; indicator-fill; glyph; text',[(1104,1128)],[(1251,1326)],'Native checkbox plus visible well/check. Checked accent relief/glow is fixed; ordinary Look fields do not tune the mark.','Opaque well; forced checked system pair and unchecked glyph suppression; independent native focus outline.'),
('RadioGroup','a',1051,1106,'E','container; recessed-field-track; indicator-fill; text',[(1104,1114),(1130,1137)],[(1277,1353)],'Native grouped radios with well and selected thick accent border. Selected cast is fixed; no per-role Look patch.','Opaque well and system/native behavior; source does not prove all forced-color radio outcomes.'),
('Select','a',1118,1146,'E','recessed-field-track; glyph; text',[(1069,1094)],[(1355,1435)],'Custom well shell around native select, chevron; explicit colorScheme. Rest fixed, focus fill consumes opacity; OS popup is not glass recipe.','Opaque well; focus follows CSS; native popup requires platform check, not inferred optical coverage.'),
('TextField','a',1153,1185,'E','recessed-field-track; text; edge',[(1069,1100)],[(1355,1411)],'Fixed well; focus opacity fill and focus shadow, semantic invalid halo/message. No independent blur or general tint.','Opaque well/fill substitutions; forced-color focus needs special review because ordinary outline is zero and visible cue is box-shadow.'),
('Textarea','a',1192,1224,'E','recessed-field-track; text; edge',[(1069,1100)],[(1355,1411)],'Same E focus/error chain as TextField, native resize and multiline content. No new blur across prose.','Same fallback limits as TextField; native resize internals are not Look-controlled.'),
('SearchField','a',1233,1275,'E','recessed-field-track; glyph; text; raised-control',[(1069,1094)],[(1437,1486)],'Capsule well, search glyph, native input and clear action. Focus fill consumes opacity; action hover may use control-hover.','Opaque well/focus fill; clear action semantics preserved; no glass filter in the field recipe.'),
('NumberField','a',1286,1369,'E','recessed-field-track; raised-control; text',[(1069,1094)],[(1488,1542)],'Shared well around step buttons and numeric value; focus-within fill/halo. No independent Button glass on its plain step buttons.','Opaque well/focus fill; native constraints remain separate from optics.'),
('Stepper','a',1376,1413,'text','indicator-fill; raised-control; text',[],[(1544,1577)],'Ordered steps with native buttons, semantic current/completed accent disks and control-fill upcoming disks. No Look lens/blur/cast; upcoming disk fill can inherit opacity through control remapping.','Upcoming fill substitution; current/completed marks retain semantic/forced-system cues.'),
('ToggleButton','a',1421,1453,'B','raised-control; indicator-fill; glyph; text; edge',[(303,344),(1060,1062)],[(1579,1635)],'B shell/filter/rim; pressed body switches to semantic accent and ink, independent of tint. Does not run Button pointer handler.','CSS fill fallback and forced selected pair; fixed press paint not generic tint.'),
('FileDropzone','a',1465,1612,'E','recessed-field-track; indicator-fill; glyph; text',[(1140,1148)],[(1637,1699)],'Fieldset well plus native file input, glyph and live result. Drag/focus uses fixed 12% accent body, not Look opacity.','Opaque rest well; fixed drag/focus alpha bypasses substitution. File behavior is separate from material.'),
]
base_ranges={'Button': [(30, 143)], 'IconButton': [(145, 158)], 'SegmentedControl': [(160, 195)], 'Switch': [(197, 274)], 'Slider': [(276, 303)], 'Toolbar': [(305, 319)], 'Dock': [(305, 324)], 'Tabs': [(326, 364)], 'Menu': [(366, 404)], 'MenuItem': [(406, 421)], 'Popover': [(366, 399), (423, 427)], 'Tooltip': [(429, 474)], 'MediaControls': [(476, 498)], 'Badge': [(559, 596)], 'Avatar': [(598, 632)], 'AvatarGroup': [(634, 652)], 'Card': [(654, 720)], 'Stat': [(722, 745)], 'Progress': [(747, 799)], 'Meter': [(768, 778), (801, 814)], 'Spinner': [(816, 834)], 'Skeleton': [(836, 860)], 'Alert': [(862, 908)], 'Banner': [(910, 945)], 'Breadcrumbs': [(947, 975)], 'Pagination': [(977, 1011)], 'Accordion': [(1013, 1065)], 'Dialog': [(1067, 1179)], 'Drawer': [(1067, 1179)], 'Toast': [(1181, 1250)], 'Checkbox': [(1252, 1326)], 'RadioGroup': [(1277, 1353)], 'Select': [(1355, 1378), (1413, 1442)], 'TextField': [(1355, 1411)], 'Textarea': [(1355, 1411)], 'SearchField': [(1444, 1478)], 'NumberField': [(1480, 1521)], 'Stepper': [(1523, 1606)], 'ToggleButton': [(1608, 1628)], 'FileDropzone': [(1630, 1693)]}
rows=[r[:7]+(base_ranges[r[0]],)+r[8:] for r in rows]
assert len(rows)==40
records=[]
md=['# All forty component flows\n','This census covers each named atlas component once. Recipe IDs refer to [flow.md](flow.md). Roles are Area vocabulary used analytically; OpenGlass exposes selectors, not these role records. **Control coverage is per painted part/state**, not a claim that every field affects an entire component.\n',
'Every CSS recipe entry also inherits the shared definitions/remap '+ref('og','l',41,165)+' '+ref('og','l',249,297)+'. All CSS fallback notes are read against '+ref('og','l',1155,1351)+' and the base motion/forced rules '+ref('og','b',1701,1803)+'. G shell fallbacks additionally use '+ref('og','css',212,255)+'. These common pins apply to every entry; the row pins specify its particular paint.\n',
'No row is certified for arbitrary-backdrop contrast. Text uses the palette/material ink path; the contrast and fallback limitations in [findings.md](findings.md#f07--contrast-is-a-palette-check-not-a-composited-glass-guarantee) apply throughout. In-flow rows inherit DOM look variables; portalled rows copy recorded provider tokens.\n']
for n,(name,file,start,end,recipe,roles,lr,br,flow,fallback) in enumerate(rows,1):
    src=[{'file':ALIASES[file],'start':start,'end':end}]+[{'file':ALIASES['l'],'start':a,'end':b} for a,b in lr]+[{'file':ALIASES['b'],'start':a,'end':b} for a,b in br]
    if name in ('Menu','Popover'): src += [{'file':ALIASES['i'],'start':617,'end':821}]
    if name in ('Dialog','Drawer'): src += [{'file':ALIASES['a'],'start':575,'end':746}]
    if name=='Toast': src += [{'file':ALIASES['a'],'start':918,'end':986}]
    citations=' '.join(ref('og',r['file'],r['start'],r['end']) for r in src)
    records.append({'component':name,'recipe_ids':recipe.split('+'),'roles':roles.split('; '),'flow':flow,'fallback_and_nesting':fallback,'sources':[dict(r,commit=OG,url=OGBASE+r['file']+f"#L{r['start']}-L{r['end']}") for r in src]})
    md += [f'## {n:02d} — {name}\n',f'**Recipe:** {recipe}. **Parts/roles:** {roles}.\n',flow+'\n',f'**Fallback / nesting:** {fallback}\n',citations+'\n']
(HERE/'components.md').write_text('\n'.join(md))
(HERE/'components.json').write_text(json.dumps({'schema':1,'checked':'2026-10-10','upstream_commit':OG,'scope':'forty atlas components; audit role crosswalk, not upstream role API','common_sources':[r for r in refs if r['owner']=='og' and r['path'] in (ALIASES['l'],ALIASES['css'],ALIASES['palette'],ALIASES['theme'],ALIASES['cap'],ALIASES['provider'])],'components':records},indent=2)+'\n')
# Remaining prose is maintained in .in files during authoring and included in generation.
for path in sorted(HERE.glob('*.md.in')):
    write(path.name[:-3],path.read_text())
lock={'checked':'2026-10-10','open_glass_ui':{'repository':'https://github.com/moekoelueker/open-glass-ui','branch':'main','commit':OG,'commit_date':'2026-09-29T13:57:49-07:00'},'area_main':AREA,'research_inputs':RESEARCH,'citations':refs}
cache=HERE/'.source-cache'
if cache.exists():
    assert subprocess.check_output(['git','-C',str(cache),'rev-parse','HEAD'],text=True).strip()==OG
    paths=sorted({r['path'] for r in refs if r['owner']=='og'})
    lock['source_files']=[{'path':p,'sha256':hashlib.sha256((cache/p).read_bytes()).hexdigest(),'lines':len((cache/p).read_text().splitlines())} for p in paths]
else:
    old=json.loads((HERE/'source-lock.json').read_text())
    lock['source_files']=old['source_files']
(HERE/'source-lock.json').write_text(json.dumps(lock,indent=2)+'\n')
print(f'Rendered {len(records)} components; {len(refs)} unique pinned ranges.')
