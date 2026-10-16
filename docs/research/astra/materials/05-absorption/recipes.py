"""Authored research proposals, not measurements, native vendor recipes or approved Area values.
Each section has exactly twelve rows in task 04's role vocabulary.
role | absorption (N/T/Q/F) | changed layer channels | treatment
"""
ROLES={'P':'page','C':'container','F':'floating surface','R':'raised control','I':'recessed field/track','K':'thumb/knob','S':'indicator/fill','D':'divider','E':'edge','G':'glyph','T':'text','X':'scrim'}
LEVELS={'N':'None','T':'Trace','Q':'Quiet','F':'Full'}
CHANNELS={'B':'body.paints','A':'body.transmission','V':'backdrop.source','W':'backdrop.mapping','F':'filters','E':'edges','H':'reflection','I':'shading.inset','S':'shading.cast','M':'emission','N':'texture','T':'content.ink','C':'content.decoration','D':'spatial.relief','L':'illumination'}
RECIPES='''
[flat]
P|N|B|Uniform opaque page; remove decorative spatial variation.
C|N|B|Single neutral backing when one exists; layout wrappers remain unpainted.
F|N|B,E|Opaque surface and required separation edge; strict-flat mode requests Surface Flat, never secretly adds lift.
R|N|B|Existing action/selection fill; no gloss, bevel or added cast.
I|N|B|Uniform readable receptacle; identification edge stays intact, no modeled cavity.
K|N|B,E|Solid distinguishable handle and edge; shape/position carry movement without relief.
S|N|B|Preserve semantic fill, selected marks and visible extent; no decorative modulation.
D|N|E|Keep existing solid structural rule.
E|N|E|Solid required boundary/focus; no decorative rim.
G|N|T|Plain semantic glyph ink; intrinsic media unchanged.
T|N|T|Plain readable ink, including placeholders and code.
X|N|B|Preserve functional scrim; flat does not remove modal occlusion.
[paper]
P|T|B|Opaque ground sheet; no compulsory grain or shadow on the page itself.
C|Q|B,S|Opaque sheet backing; cast only for an already elevated receiver under Surface policy.
F|F|B,S,E|Opaque independent sheet with one permitted cast and separation edge; keep interior matte.
R|T|B,E|Matte command paint; no new cast on in-flow controls merely to suggest paper.
I|T|B,E|Quiet inset-color region or outlined opening; do not invent a carved paper cavity.
K|Q|B,S|Opaque small handle; retain only its existing permitted lift.
S|T|B|Printed semantic color/mark; keep progress extent exact and sample colors literal.
D|T|E|Single ink rule, no engraving or double shadow.
E|T|E|Quiet solid sheet boundary; focus remains separate.
G|N|T|Printed glyph ink; no paper texture inside glyphs.
T|N|T|Printed readable ink without text shadow.
X|N|B|Existing neutral modal veil, independent of paper shade.
[transparency]
P|N|B|Retain opaque scene ground; there is no useful lower page receiver to expose by default.
C|Q|B,A,V|Translucent body only over an identified stable scene; increase opacity beneath dense content.
F|Q|B,A,V,E|Translucent shell with bounded backdrop participation; use an opaque reading well when the scene is busy.
R|T|B,A|Near-opaque control body; preserve local state differences, no group opacity.
I|N|B|Opaque editable well and rail ground; text-entry contrast wins over seeing through.
K|T|B,A,E|Light body transmission only where the handle remains distinct over every track position.
S|N|B|Preserve semantic opacity and extent; never make progress or status less definite to match the shell.
D|N|E|Keep structural rule independent of ancestor body alpha.
E|T|E|Optional alpha on decorative rim only; required boundaries remain independently visible.
G|N|T|Opaque semantic glyph; intrinsic media retains authored alpha only.
T|N|T|Opaque ink; transmission never applies to the content group.
X|N|B|Preserve the existing scrim's functional alpha; do not multiply it by material transmission.
[glassmorphism]
P|N|B|Keep opaque source scene; do not frost the entire root as its own backdrop.
C|Q|B,A,V,F,E|One frosted pane body with restrained rim; inner text region resolves to a calm ground.
F|F|B,A,V,F,E,H,S|Main glass receiver: frost/tint plus restrained optical rim, existing float cast only; suppress gloss across text.
R|T|B,E|Tinted near-opaque plate or small rim; borrow the pane's character without a new blur per control.
I|T|B,E|Opaque/near-opaque well with quiet edge; no live blur behind editable ink or scale marks.
K|Q|B,E,H,S|Small glass-like solid handle, local highlight and existing lift; default does not reacquire backdrop.
S|T|E|Retain solid semantic core; at most a decorative enclosing rim, never a tinted color sample.
D|T|E|Single subdued seam integrated with pane; no duplicate bright/dark grooves.
E|Q|E,H|Gradient/alpha rim on the existing silhouette; independent required focus outside it.
G|N|T|Crisp unfiltered glyphs and unchanged media.
T|N|T|Unfiltered semantic ink over a validated reading ground.
X|N|B|Existing scrim, not another frost pane.
[acrylic]
P|N|B|Opaque neutral scene foundation; do not claim behind-window acrylic from webpage pixels.
C|T|B|Tint-related opaque backing by default; reserve the full translucent brush for appropriate overlay context.
F|F|B,A,V,F,N|Local-source acrylic approximation: backdrop treatment, tint/blend and static fine texture; one receiver per surface.
R|T|B|Quiet opaque tint belonging to the same family; no per-button blur/noise stack.
I|N|B|Opaque reading/editing well; semantic edge and input ink unchanged.
K|T|B,E|Solid tinted handle with existing separation; no noise that erodes its small outline.
S|N|B|Preserve semantic cores and literal color data.
D|T|E|Subdued seam through the tinted shell; no luminous separator.
E|T|E|Quiet existing rim; no invented glass lens or bevel required by this recipe.
G|N|T|Unfiltered semantic glyph; no noise mask on ink.
T|N|T|Readable opaque ink; exclude texture from text decoration.
X|N|B|Functional neutral scrim; never a second full acrylic layer.
[mica]
P|F|B|Opaque, stable theme-informed scene tint; an explicit owned reference can inform it, never live transparency.
C|Q|B|Opaque tonal relation to the foundation; no repeated wallpaper sampling in each container.
F|T|B,E|Opaque surface from the same tone family plus existing floating separation; Mica does not require live blur.
R|T|B|Solid local body tint only; action/tone ownership remains authoritative.
I|T|B|Uniform opaque well against the foundation; no wallpaper detail beneath input text.
K|T|B|Opaque handle body; retain existing lift, add no Mica-specific lens.
S|N|B|Existing semantic paint and literal values.
D|T|E|Single tonal seam between opaque layers.
E|T|E|Preserve ordinary component boundaries; no gloss rim inferred.
G|N|T|Plain semantic ink, no wallpaper modulation.
T|N|T|Plain ink on stable opaque ground.
X|N|B|Existing modal veil; no wallpaper-tinted full-screen material layer.
[liquid-glass]
P|N|B|Opaque content scene; reserve the material vocabulary for navigation/controls above it.
C|T|B|Calm content backing; persistent reading containers do not become independently refracting lenses.
F|F|B,A,V,W,F,E,H,S|Isolated navigation/overlay lens with bounded rim reflection and optional owned-source mapping; opaque fallback mandatory.
R|Q|B,E,H|Compact glass-like plate and reflection outside label area; no automatic lensing of live page content.
I|T|B,E|Stable reading well with restrained rim; no warping under caret, value or marks.
K|F|B,A,V,W,F,E,H,S|Small optical handle with coherent highlight; owned-source lensing is optional and separately gated, never applied to its label.
S|T|E|Keep semantic core/extent solid; allow a local optical rim only when it cannot imply a changed value.
D|T|E|Quiet seam; no morphing/refraction on structural rules.
E|Q|E,H|Optical silhouette/reflective rim; keep focus and invalid edges independently legible.
G|N|T|Crisp semantic glyph; native adaptive ink is not copied into hover recoloring.
T|N|T|Stable Area ink; solve backdrop legibility through the body, not text filtering or automatic foreground animation.
X|N|B|Functional neutral dimming; do not label a blurred scrim native Liquid Glass.
[neumorphism]
P|T|B|Opaque shared ground establishes relief reference; dark mode keeps near-black policy.
C|Q|B,I,H,D|Same-ground local modeling on real painted container only; large reading regions stay flat.
F|Q|B,E,S|Independent overlay separation takes precedence over same-ground illusion; permitted Surface lift, no extra light outer lobe.
R|Q|B,I,H,D|Low intrinsic relief and opposite highlight/shade; in-flow cast remains off, which deliberately softens the classic effect.
I|Q|B,I,H,D|Shallow cavity relative to immediate parent; shade only near perimeter, keep readable center uniform.
K|F|B,I,H,S,D|Convex same-ground handle with clear edge and allowed thumb lift; never identify it by shading alone.
S|T|B|Solid semantic core over quiet relief; no relief per tick or progress pixel.
D|T|E,I|Optional shallow engraved seam; replace rather than add a second structural rule.
E|Q|E,H,I|Modeled local rim with a separate required boundary; do not confuse soft shading with focus.
G|N|T|Plain glyph ink, not automatically embossed with the body.
T|N|T|Plain text; small labels must not acquire doubled relief edges.
X|N|B|Neutral scrim separates the floating layer; no embossed full-screen veil.
[claymorphism]
P|T|B|Opaque calm stage; page itself is not a balloon.
C|Q|B,I,H,D|Broad soft inner modeling at perimeter of painted shell, quiet center; existing corners stay unchanged.
F|Q|B,I,H,S,D|Soft opaque body plus one allowed float cast; contain doming away from dense copy.
R|Q|B,I,H,D|Colored modeled plate preserving action/tone; no inflated geometry, layout growth or new in-flow shadow.
I|T|B,I|Quiet shallow well; avoid puffing input surfaces into competing buttons.
K|F|B,I,H,S,D|Convex handle is the strongest local modeling receiver; retain exact travel geometry and allowed lift.
S|T|B|Flat solid semantic fill inside body; no domed progress bands or changing swatch values.
D|T|E|Simple seam; clay modeling does not turn every rule into a tube.
E|Q|E,H,I|Soft modeled edge constrained to existing silhouette; required boundary stays crisp.
G|N|T|Plain glyphs or preserved media, no inflated stroke treatment.
T|N|T|Plain semantic ink on a uniform center.
X|N|B|Existing scrim; no colored clay fog.
[skeuomorphism]
P|Q|B,N|Choose one declared physical scene/referent; keep its texture outside reading regions. Without a referent use plain ground.
C|Q|B,E,I,H,N|Choose a referent-consistent housing or sheet, with texture/relief limited to its perimeter; do not mix unrelated objects by family.
F|Q|B,E,S|Separate panel of the same declared scene; normal overlay semantics and permitted elevation remain.
R|Q|B,E,I,H,D|Translate command plate as a key or switch face only when that metaphor fits interaction; never invent hardware behavior.
I|Q|B,I,D|Readable inset well in the same housing; printed scales and values stay unmodeled.
K|F|B,E,I,H,S,D|Knob/handle can carry the strongest declared object cue; no change to range or hit geometry.
S|T|B|Printed or luminous semantic mark selected by the referent; no arbitrary new status vocabulary.
D|T|E|A seam belonging to the housing, not a decorative fastener on every row.
E|Q|E,H,I|Consistent edge profile and light rig; do not combine wood, chrome and rubber rims accidentally.
G|T|C|Optional simple inscription cue on sparse decorative glyphs; action icons remain recognizable and data/media unchanged.
T|N|T|Plain UI ink; optional display inscription requires a separate content-specific exception.
X|N|B|Functional neutral veil; do not simulate a physical curtain by default.
[aqua]
P|T|B|Calm opaque ground; no imposed historical wallpaper or stripes.
C|T|B,E|Neutral content body and quiet outline; reserve conspicuous luminosity for controls/chrome.
F|Q|B,E,H,S|Subtle luminous shell rim with normal float separation; avoid a gloss stripe crossing copy.
R|Q|B,H,E|Luminous vertical body ramp and contained gloss on eligible command plates; retain action color and current corners.
I|T|B,E|Uniform light/dark well with restrained edge; no candy stripe behind typing.
K|F|B,H,E,S|Small luminous rounded handle is the strongest receiver; geometry still comes from Area.
S|T|B,H|Semantic fill can take a restrained highlight only when it does not distort state or quantitative extent.
D|T|E|Quiet single rule; no gloss tube.
E|Q|E,H|Narrow luminous rim on decorative boundary; focus is not the rim.
G|N|T|Crisp glyphs, no mandatory historical icon replacement.
T|N|T|Plain Area typography, not a claim to reproduce historical Aqua text rendering.
X|N|B|Existing neutral scrim.
[frutiger-aero]
P|Q|B|Owned atmospheric gradient/imagery may frame the scene; keep reading regions on calm opaque ground.
C|T|B,E|Near-opaque content sheet related to scene colors; do not turn each card into an illustration.
F|Q|B,A,V,F,E,H|Restrained glass-like chrome around a stable reading center; acquire one identified local backdrop only.
R|Q|B,H,E|Selective glossy plate in existing action/tone family, without adding new illustrative symbols.
I|T|B,E|Uniform opaque well; no sky/cloud imagery behind values.
K|Q|B,H,E,S|Glossy small handle with existing lift; no photographic texture at thumb scale.
S|T|E|Preserve literal core and meaning; optional outline links it to scene, not a new rainbow palette.
D|T|E|Quiet structural seam.
E|Q|E,H|Glossy rim limited to actual boundary, not halo around every row.
G|N|T|Keep existing glyph geometry and media; the role recipe does not supply a replacement icon language.
T|N|T|Plain Area ink/type; humanist historical art direction is outside this paint proposal.
X|N|B|Neutral functional scrim, not atmospheric imagery.
[glow-neon]
P|T|B|Quiet opaque stage; no full-page bloom or compulsory black override of theme.
C|T|E|At most a restrained boundary cue on a sparse shell; no ambient glow carpet behind copy.
F|Q|E,M|Local rim emission around an otherwise stable shell; preserve ordinary float cast and independent required border.
R|T|E,M|Sparse command outline may emit gently; baseline fill and label stay stable across hover.
I|N|B|Opaque nonemissive well/track; avoid luminous troughs around every field.
K|Q|E,M|Small handle rim/core can emit with bounded halo; position and required edge remain exact.
S|Q|M|Selected/status core emits in its existing semantic color; halo is supplementary, not value extent or selection proof.
D|N|E|Keep a plain rule; repeated glowing separators create competing luminous regions.
E|Q|E,M|One decorative luminous rim, distinct from focus; do not reuse focus color as persistent decoration.
G|T|C,M|Optional sparse decorative symbol bloom; action/status core remains plain, media excluded.
T|N|T|Plain reading text; glowing display lettering is not the default role recipe.
X|N|B|Neutral scrim does not radiate.
[linear-gradient]
P|Q|B|Broad low-frequency linear field; keep text-bearing zone contrast stable.
C|T|B|Near-uniform tonal ramp on painted backing, not on layout wrappers.
F|Q|B|Subtle shell ramp with calm center; preserve float shadow independently.
R|Q|B|Semantic-tone ramp on an eligible plate; no abrupt stop under a label.
I|T|B|Near-uniform well; no apparent fill level created by the decorative ramp.
K|Q|B|Compact tonal ramp can suggest body form, but direction is not automatically the lighting rig.
S|T|B|Only a semantic-preserving tonal variation on non-data fills; never alter literal swatches or imply a quantitative gradient scale.
D|N|E|Solid rule; gradient strokes require the separate edge recipe.
E|N|E|Keep baseline edge; a body gradient does not prescribe its perimeter.
G|N|T|Solid semantic glyph ink.
T|N|T|Solid ink, never gradient-clipped UI text by inheritance.
X|N|B|Existing scrim; local readability fades retain their functional masks.
[radial-gradient]
P|Q|B|Broad scene lobe away from long reading columns; no moving hotspot.
C|T|B|Very broad tonal lobe, quiet center; no spotlight centered on every container.
F|Q|B|Off-content shell lobe; do not imply emission without an emission channel.
R|T|B|Small restrained body variation only where ink contrast remains uniform enough.
I|N|B|Uniform well/track, no false focus spotlight under values.
K|Q|B|Local body highlight field can describe curvature; not a separate bloom.
S|T|B|Tonal variation only for non-quantitative cores; progress and literal color data stay solid.
D|N|E|Keep the plain structural line.
E|N|E|No rim added by a body-paint primitive.
G|N|T|Solid glyph ink and intrinsic media unchanged.
T|N|T|Plain semantic text.
X|N|B|Retain functional scrim mask; no decorative radial dimming replacing modal coverage.
[conic-gradient]
P|T|B|Optional broad angular field outside reading regions; visible seam must not cross content.
C|N|B|Plain backing; angular bands are too directional for a default reading surface.
F|T|B|Small peripheral angular accent only; keep main reading body uniform.
R|T|B|Very restrained angular modulation on a sparse command face; disable when seam or hue implies state.
I|N|B|Plain receptacle; never suggest a dial scale in an ordinary field/track.
K|Q|B|A restrained brushed/dial-like face may use angular paint; logical travel does not rotate with decorative stops.
S|N|B|Preserve exact semantic fill; color wheels/quantitative arcs already own their angular encoding.
D|N|E|Solid structural rule.
E|T|E|Only an explicitly combined gradient-stroke recipe may clip angular paint to a decorative perimeter.
G|N|T|Plain semantic glyph.
T|N|T|Plain text; no angular color field in letters.
X|N|B|Existing uniform or functional scrim.
[mesh-gradient]
P|Q|B|One low-frequency owned mesh/declared multi-radial approximation, with a calm reading region.
C|T|B|Tiny tonal variation inherited from scene palette; do not restart colorful mesh per repeated card.
F|T|B|Peripheral color variation only, opaque calm body beneath dense content.
R|T|B|At most a near-uniform sampled tonal patch; no independently complex control mesh.
I|N|B|Uniform well/rail.
K|T|B|A sampled solid/near-uniform tone ties handle to scene without losing its outline.
S|N|B|Semantic and literal-data fill unaffected.
D|N|E|Plain structural rule.
E|N|E|Plain boundary; mesh body does not imply multicolored edges.
G|N|T|Solid glyph or unchanged media.
T|N|T|Solid semantic ink, not mesh-filled text.
X|N|B|Functional neutral scrim; no mesh fog layer.
[gradient-stroke]
P|N|B|Page has no decorative perimeter by default.
C|T|E|Subtle gradient on an existing decorative perimeter, no extra border width or new box.
F|Q|E,H|One gradient rim on shell silhouette; optional light interpretation shares the rig.
R|T|E|Restrained perimeter modulation; required identification remains solid and independent.
I|T|E|Quiet outer boundary only; invalid/focus colors cannot be diluted into a multicolor rim.
K|Q|E,H|Small handle rim may carry light/dark variation; retain separate required edge.
S|T|E|Optional enclosing rim outside semantic core; no false progress expansion.
D|T|E|Low-contrast modulation along one existing seam; keep the entire needed separator visible.
E|F|E,H|This is the principal receiver: fit gradient to existing edge mask; one rim owner, not an added body fill.
G|N|T|Do not turn glyph strokes into gradient material edges.
T|N|T|Plain text, no outline gradient inherited.
X|N|B|No gradient perimeter around a scrim.
[inner-shadow]
P|N|B|No viewport-sized cavity.
C|T|I,D|Shallow perimeter occlusion only when a real well is intended; otherwise keep body plain.
F|N|B|Do not make a floating panel look recessed into its host; its local field children can carry inset relief.
R|T|I,D|Optional pressed/local face inset, never added as selection's only signal or animated geometry.
I|Q|I,D|Principal cavity receiver: shade immediate inner perimeter, preserve a uniform reading/measurement center.
K|T|I,D|Only local face modeling; handle still reads above its track, not as a hole.
S|N|B|Keep semantic fill extent exact, no dark inset swallowing small status marks.
D|T|I,E|Optional engraved seam replaces equivalent divider decoration; no second rule.
E|T|I,E|Inset boundary occlusion only; required focus/invalid edge remains separate.
G|N|T|No automatic inset glyph treatment; letterpress is a separate recipe.
T|N|T|Plain text.
X|N|B|No inset shadow on full-screen occlusion.
[inner-glow]
P|N|B|No viewport glow frame.
C|T|M|Faint interior rim on sparse shell, excluded from reading well.
F|Q|M|Contained luminous rim inside overlay silhouette; center stays stable and nonemissive.
R|T|M|Optional quiet interior rim; never resembles the active/focus state at rest.
I|N|B|No glowing editing well by default.
K|Q|M|Small interior luminous ring distinct from track and value core.
S|T|M|Only inside the semantic core without reducing its minimum visible area.
D|N|E|Plain rule; narrow dividers have no useful interior glow area.
E|Q|M,E|Inset luminous boundary; keep required edge crisp and independently colored.
G|N|T|No glow eating into small glyph strokes.
T|N|T|Plain text; interior glyph effects need a separate large-display treatment.
X|N|B|No luminous scrim edge.
[outer-glow]
P|N|B|Page itself is not an emitter.
C|T|M|Sparse shell halo only if a receiving gap exists; dense containers suppress it.
F|Q|M|One bounded external halo around shell, not an alternative elevation/focus system.
R|T|M|Sparse command halo only; repeated rows/toolbar controls suppress shared overlapping bloom.
I|N|B|No halo around every editing well or rail.
K|Q|M|Small local handle halo, clipped away from adjacent labels and kept separate from value extent.
S|Q|M|Bounded halo around existing semantic core; core stays visible in no-effect fallback.
D|N|E|No glowing separator network.
E|T|M,E|Supplementary halo outside decorative rim; never replace required perimeter/focus.
G|T|C,M|Sparse decorative glyph only; no status/readability dependence on glow, no media alteration.
T|N|T|Plain reading ink.
X|N|B|Scrim remains nonemissive.
[drop-shadow]
P|N|B|No page cast onto itself.
C|T|S|Only an existing elevated container consumes its Surface cast; layout/flush containers remain shadowless.
F|F|S|Use the single existing float/tooltip/toolbar cast policy; no second material shadow ladder.
R|N|B|In-flow command plates keep current no-shadow policy.
I|N|B|No external cast on fields or rails.
K|Q|S|Existing thumb lift only, bounded by parent track/context.
S|N|B|Status/progress fill does not cast a quantitative-looking second silhouette.
D|N|E|No separator shadow.
E|N|E|Spread-only rings stay edge paint; do not reinterpret every edge as cast elevation.
G|N|T|No automatic glyph drop shadow; irregular decorative artwork needs separate owned-art review.
T|N|T|No cast text shadow inherited from a surface.
X|N|B|Scrim has no receiving-surface shadow.
[bevel-emboss]
P|N|B|No modeled frame around the page.
C|T|H,I,D|Shallow local edge profile on a painted shell, calm broad center.
F|T|H,I,E|Subtle rim modeling only; shell retains floating relationship instead of looking pressed into host.
R|Q|H,I,D|Raised face profile constrained to current silhouette; no added cast or hit-size growth.
I|Q|H,I,D|Invert local profile for a recess while retaining the same scene light; readable center unchanged.
K|F|H,I,E,D|Convex handle rim is strongest receiver; keep value marker and focus separate.
S|T|H,I|Only non-data cores may take trace profile; preserve exact outline and semantic center.
D|T|H,I,E|Restrained incised seam replaces one divider; never stack another dark/light pair on the same edge.
E|Q|H,I,E,D|Principal profile boundary: explicit raised/recessed intent and one coherent light rig.
G|T|C|Only sparse decorative glyph relief; UI/action symbols stay plain by default.
T|N|T|No automatic embossed small type; letterpress owns any explicit inscription exception.
X|N|B|No beveled scrim.
[letterpress]
P|N|B|Leave scene paint unchanged; letterpress is an inscription treatment, not page grain.
C|N|B|Leave backing unchanged; it only supplies the local receiving color.
F|N|B|No whole-panel relief or shadow implied by inscription.
R|N|B|Control body unaffected; labels use text policy below, not a body inset.
I|N|B|Editable well and live value remain unaffected.
K|N|B|Handle body unaffected; no automatic engraved value mark.
S|N|B|Semantic status/progress core unaffected.
D|N|E|Do not convert a divider into letterpress lettering.
E|N|E|Keep body boundaries independent of glyph contours.
G|T|C,D|Optional debossed cue on a sparse decorative inscription; actual glyph ink/shape remains legible.
T|T|C,D|Trace only for explicitly designated large, short display inscription; all UI, dense, editable and code text is None.
X|N|B|Scrim unchanged.
[grain]
P|Q|N|One stable fine texture phase on the scene; keep readable regions uniform enough, dark ground remains near-black.
C|T|N|Static surface microtexture below content, not a new seed per nested/repeated item.
F|T|N|One restrained texture layer clipped to shell; no new noise plane in each row.
R|T|N|Optional sparse-body texture only if the plate has usable blank area; dense controls suppress it.
I|N|B|No grain beneath editable values or scale marks.
K|T|N|At most trace body texture on a sufficiently clear handle, not on its value core/edge.
S|N|B|No noise inside semantic cores, progress extents or literal color samples.
D|N|E|No textured structural rule.
E|N|E|Required and decorative edges remain crisp.
G|N|T|Do not perforate glyph ink or modify intrinsic media.
T|N|T|No grain mask or animated noise on text.
X|N|B|Scrim remains functionally smooth, not a second texture layer.
'''
TECHNIQUES={
'flat':['T01','T07'],'paper':['T01','T02'],'transparency':['T08','T11'],'glassmorphism':['T08','T04','T07'],'acrylic':['T08','T01','T05'],'mica':['T01'],'liquid-glass':['T08','T09','T04','T07'],
'neumorphism':['T02','T04','T12'],'claymorphism':['T02','T04','T10'],'skeuomorphism':['T01','T02','T04','T05','T06'],'aqua':['T01','T04','T07'],'frutiger-aero':['T01','T04','T08'],'glow-neon':['T03','T06'],
'linear-gradient':['T01'],'radial-gradient':['T01'],'conic-gradient':['T01','T07'],'mesh-gradient':['T01'],'gradient-stroke':['T07'],'inner-shadow':['T02'],'inner-glow':['T03'],'outer-glow':['T03'],'drop-shadow':['T02'],'bevel-emboss':['T02','T04','T07'],'letterpress':['T06'],'grain':['T05']}
LIMITS={
'flat':'Strict-flat suppresses optional modeled relief; it does not erase required focus, state or scrims. Pair with Surface Flat; otherwise call the result flat-inspired, not strict flat.',
'paper':'Paper here is the opaque sheet model from 01, not a full Material Design component system. Grain is not automatic. Surface can remove all cast while body remains paper-like.',
'acrylic':'Native exclusion/tint/noise structure motivates the proposal; native constants, OS source acquisition and performance/adaptation parity are not supplied. Web result is a local-source approximation.',
'mica':'Opaque theme/owned-reference approximation only. Ordinary CSS in 03 does not supply OS wallpaper acquisition. Never substitute live backdrop blur and call it Mica.',
'liquid-glass':'Web translation, not Apple parity. Keep Area hover ink fixed; native environmental adaptation/morphing is not implemented. Owned-source displacement is optional, and arbitrary-page lensing remains unverified in 03.',
'neumorphism':'Classic paired external light/dark lobes conflict with current in-flow no-shadow and dark-halo policy. This proposal uses constrained intrinsic modeling; full classic extrusion needs a later explicit Surface contract decision.',
'claymorphism':'Keep Area corner/size geometry. Full inflated geometry and extra cast would require a separate approved geometry/elevation change; this is a constrained paint translation.',
'skeuomorphism':'Under-specified until a referent is chosen. The matrix supplies common responsibilities, not a universal physical-object recipe. Missing referent resolves to plain, not invented textures.',
'aqua':'Aqua-inspired paint, not historical reproduction. Exact native gloss geometry was not specified in 01; all proposed ramps/rims here are authored synthesis, no platform constants.',
'frutiger-aero':'Paint subset of a broader art direction; do not silently change fonts, imagery, icons or behavior to claim the full historical language.',
'mesh-gradient':'Use an explicitly owned mesh asset or label a multi-radial approximation honestly, following 03; no native CSS mesh function is assumed.',
'letterpress':'Text Trace is a conditional exception, not a blanket text-role default. Lack of a designated display-inscription context resolves to None; actual offsets/readability remain unmeasured.',
}

# D6: row plates are a distinct receiver. These are layer proposals, not calibrated limits.
ROLES['W']='row-plate'
ROW_RECIPES={
 'flat':('B','Uniform semantic state plate; no added modeling.'),
 'paper':('B,E','Opaque paper state backing with an optional subordinate edge; keep focus plate continuous.'),
 'transparency':('B,A','Transmit through the plate only after composing hover/selected/focus paint against the actual host.'),
 'glassmorphism':('B,A,H,E','Inherit host frost acquisition; optional transmitted tint and rim on state plate, not a second glass pane by default.'),
 'acrylic':('B,A,N','Host owns backdrop/noise acquisition; row uses shared tint, with opaque state fallback.'),
 'mica':('B','Use a locally opaque tonal state plate; do not invent another desktop acquisition per row.'),
 'liquid-glass':('B,H,E','Frost/rim baseline; shared light and state plate, with D8 refraction deferred.'),
 'neumorphism':('B,I,H','Optional shallow inset/convex cue accompanies a independently legible state plate; shadow cannot be the only boundary.'),
 'claymorphism':('B,I,H','Soft modeled state plate; retain parent geometry and opaque readable state ground.'),
 'skeuomorphism':('B,I,H','Declared physical row insert may model relief; preserve semantic focus and reading ground.'),
 'aqua':('B,H,E','Optional gloss/rim on the row perimeter, with continuous state backing beneath text.'),
 'frutiger-aero':('B,H,E','Host carries scenic/glassy identity; optional row tint and gloss stay subordinate to selected/focus plate.'),
 'glow-neon':('B,M,E','Legible core state plate first; optional bounded perimeter emission never replaces focus.'),
 'linear-gradient':('B','Sample the full state-plate gradient domain behind text; derive stops from theme.'),
 'radial-gradient':('B','Radial state-plate tint, full interpolation-domain contrast checked; no glyph recoloring.'),
 'conic-gradient':('B','Conic variation is optional perimeter treatment; preserve a continuous readable state core.'),
 'mesh-gradient':('B','Host may supply mesh scene; row foreground is tested over the entire composed plate range.'),
 'gradient-stroke':('E','Optional theme-derived perimeter gradient; required focus/state paint remains separate.'),
 'inner-shadow':('I','Optional cavity cue beneath content; do not erase keyboard row plate.'),
 'inner-glow':('M','Optional inward emission with readable center and independent focus plate.'),
 'outer-glow':('M','Optional external emission only where adjacent content remains legible; numeric budget awaits calibration.'),
 'drop-shadow':('S','Optional row cast is an expressiveness choice, not prohibited by current None defaults; measure repetition cost.'),
 'bevel-emboss':('I,H,E','Optional lit/shaded rim with D11 radius floor; row state remains continuous.'),
 'letterpress':('B','Keep ordinary row labels plain under D13; explicit opt-in button/display text is a separate content treatment.'),
 'grain':('N','Prefer sharing host texture; evaluate composited text/state visibility and measured workload before per-row grain.')}
# Preserve the original twelve cells as historical proposals; append one D6 cell to each style.
sections=RECIPES.strip().split('[');out=[]
for section in sections:
 if not section:continue
 key,body=section.split(']',1);channels,rule=ROW_RECIPES[key]
 out.append('['+key+']'+body.rstrip()+'\nW|T|'+channels+'|'+rule+'\n')
RECIPES=''.join(out)
