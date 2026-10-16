"""Curated compatibility rules. Status is a proposal about one receiver, not CSS support."""
REASONS = {
 'same':('C','Use one instance of the same recipe; merge named layers rather than duplicate paint.'),
 'flat-depth':('X','Strict flat modeling excludes relief, cast, lensing, gloss or emission. Use another receiver or relax the flat intent explicitly.'),
 'body-model':('X','These complete body models demand incompatible opaque/transmitting or flat/volume assumptions on one receiver. Choose one body; the other can style a separate child.'),
 'acquire':('K','One acquisition/blur/tint graph only. Coalesce overlapping glass layers; do not stack two backdrop filters or claim native equivalence.'),
 'native':('K','Native Mica/Liquid Glass behavior is only partially sourced and not a portable CSS preset. Keep a verified opaque/web fallback; independent receiver only where acquisition differs.'),
 'body-field':('K','Both affect the body color field. Declare one base and one masked overlay with explicit order/interpolation; do not blindly multiply complete fills.'),
 'volume':('K','Pick one signed relief profile and one key light; a concavity and convexity can coexist only on separate local regions.'),
 'emission':('K','Resolve to one named inner/outer emission graph with a readable semantic core. Do not sum repeated halos or use bloom as focus.'),
 'content':('K','Letterpress is restricted to a separate reviewed display inscription. Functional glyph/text remains plain; never stack reflected and emitted type by default.'),
 'texture':('K','Use one static texture owner/seed and keep reading regions clear. Existing Acrylic noise is edited, not doubled.'),
 'edge':('K','Use one perimeter owner and contour, preserve required edges, and fit decorative gradient/bevel inside the available rim.'),
 'cast':('K','Only the receiver\'s existing Surface cast is allowed; merge source lobes once. Flat and inflow controls still have no cast.'),
 'referent':('K','The physical/historical language needs a coherent referent and role scope. A primitive alone does not reproduce the entire visual language.'),
 'separate':('C','Channels are distinct and can coexist on an eligible receiver under shared light, contrast and role caps; this is not a certification of arbitrary parameter values.')}
BODIES={'paper','glassmorphism','acrylic','mica','liquid-glass','neumorphism','claymorphism'}
OPTICAL={'transparency','glassmorphism','acrylic','liquid-glass'}
VOLUME={'neumorphism','claymorphism','inner-shadow','bevel-emboss'}
FIELDS={'linear-gradient','radial-gradient','conic-gradient','mesh-gradient'}
EMIT={'glow-neon','inner-glow','outer-glow'}
LANG={'skeuomorphism','aqua','frutiger-aero'}
FLAT_EXCLUDES=VOLUME|EMIT|{'drop-shadow','liquid-glass','glassmorphism','acrylic','aqua','frutiger-aero','letterpress'}

def reason(a,b):
 s={a,b}
 if a==b:return 'same'
 if 'flat' in s and s & FLAT_EXCLUDES:return 'flat-depth'
 if (s & {'paper','mica'}) and (s & OPTICAL):return 'body-model'
 if (s & {'neumorphism','claymorphism'}) and (s & OPTICAL):return 'body-model'
 if len(s&OPTICAL)==2:return 'acquire'
 if s&{'mica','liquid-glass'}:return 'native'
 if 'letterpress' in s:return 'content'
 if 'grain' in s:return 'texture'
 if len(s&EMIT)==2:return 'emission'
 if 'gradient-stroke' in s:return 'edge'
 if 'drop-shadow' in s:return 'cast'
 if len(s&VOLUME)==2:return 'volume'
 if (s&FIELDS) and (s&(BODIES|FIELDS|LANG)):return 'body-field'
 if s&LANG:return 'referent'
 if s&EMIT:return 'emission'
 if s&VOLUME:return 'volume'
 return 'separate'
# Every preset pair has a specific owner/composition decision, not a generic global merge.
PRESET_PAIRS = [
 ('paper','glass','K','Glass outer shell, opaque Paper reading island; no transparency on the paper plane.'),
 ('paper','acrylic','K','Acrylic popup perimeter and opaque Paper content; separate acquisition from the reading plane.'),
 ('paper','soft','K','Paper content with Soft handle/perimeter; do not give every sheet a modeled convex face.'),
 ('paper','tactile','C','Paper reading body with a Tactile action or handle; keep bevel away from copy.'),
 ('paper','aero','K','Paper content within sparse Aero chrome; gloss cannot cross the reading plane.'),
 ('paper','glow','K','Paper content with isolated Glow indicator/edge; no glowing prose or grid lines.'),
 ('paper','prism','C','Paper body and one Prism perimeter share geometry; retain the structural edge.'),
 ('glass','acrylic','X','Choose one shell acquisition recipe. Acrylic may replace Glass; stacking both doubles blur/tint/noise ownership.'),
 ('glass','soft','X','Same-body transmitted glass and same-color opaque soft relief conflict. Use opaque Soft child handles inside a Glass shell instead.'),
 ('glass','tactile','K','Glass shell with opaque Tactile controls; one light, no independently transparent bevel body.'),
 ('glass','aero','K','Choose Glass acquisition and one Aero perimeter reflection; omit Aero body-reflection where it impairs transmission/reading.'),
 ('glass','glow','K','One Glass shell plus bounded external Glow edge, after backdrop contrast checks; no glow at focus/error boundary.'),
 ('glass','prism','C','Glass body plus transparent-center Prism mask; replace the Glass edge, do not add a second perimeter.'),
 ('acrylic','soft','X','Same-body opaque soft volume conflicts with Acrylic transmission. Keep the Soft knob as an independent opaque receiver.'),
 ('acrylic','tactile','K','Acrylic popup and opaque Tactile control/handle; remove grain from control inset/text regions.'),
 ('acrylic','aero','X','Two complete shell recipes compete for body tint/reflection. Use separate chrome/content receivers or choose one shell.'),
 ('acrylic','glow','K','One Acrylic shell with sparse semantic Glow core outside its reading region; retain only one noise plane.'),
 ('acrylic','prism','K','Replace the Acrylic decorative edge with Prism; keep required boundary and confirm visibility through noise/tint.'),
 ('soft','tactile','X','Broad soft relief and crisp molded bevel are competing edge profiles. Choose one at a part boundary.'),
 ('soft','aero','X','Soft matte volume and strong gloss band compete on the same small body. Separate roles or choose a dominant finish.'),
 ('soft','glow','K','Soft body with a separate semantic LED-like emitter; no external white relief shadow relabeled as glow.'),
 ('soft','prism','K','Soft body with one restrained colored rim, replacing its bevel edge if space is insufficient.'),
 ('tactile','aero','K','Tactile relief plus one Aero top reflection on a sparse control; share one bevel and keep it clear of labels.'),
 ('tactile','glow','C','Tactile housing with a distinct Glow indicator, like the board console description; no luminous structural grooves.'),
 ('tactile','prism','K','Choose a gradient paint for the existing Tactile rim, not an extra border layer.'),
 ('aero','glow','K','Aero reflection and Glow emission are different channels; keep one subordinate, omit both near dense copy/focus.'),
 ('aero','prism','K','One Aero body reflection and one Prism edge; remove duplicate Aero edge gradient.'),
 ('glow','prism','K','Choose either a sharp Prism gradient edge or a context-colored Glow emitter as primary. Do not infer a multicolor halo from one semantic source.')]
