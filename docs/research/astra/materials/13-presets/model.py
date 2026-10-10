"""Authored task-13 proposals, not production tokens or measured preset values."""
from copy import deepcopy
AREA = '3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e'
RESEARCH = 'c0a97a34e6c76d97d025d19f79edac59ddadbf25'
ROLES = ['page','container','floating-surface','raised-control','recessed-field-track','thumb-knob','indicator-fill','divider','edge','glyph','text','scrim']
# All numbers in this file are authored starting hypotheses. Source comparisons are in evidence.md.
NEUTRAL = dict(amount='none', light=dict(angleDeg=225,heightDeg=45,ambient=.5),
 body=dict(source='receiver.body',transparency=0),backdrop=dict(source='none',mapping='unchanged',blurPx=0),
 relief=dict(profile='flush',depthPx=0,softnessPx=0,spreadPx=0,strength=0),
 glow=dict(source='context',strength=0,placement='outer',spreadPx=0,softnessPx=0),
 gradients={},stroke=dict(coverage='none',paint='solid',profile='plain',opacity=0),
 grain=dict(source='seeded-static-tile',strength=0,scalePx=1,seed=13,blend='source-over',clip='perimeter-excluding-content'),
 gloss=dict(source='key',strength=0,extent=.15,softnessPx=0,mask='perimeter-excluding-content'),
 surfaceControls=dict(direction='source',liftGain=1,softnessGain=1,spreadDeltaPx=0,strengthGain=1),
 content=dict(ink='receiver.ink',decoration='none'),filters=[])
PRESETS = [
 dict(id='paper',name='Paper',refs=['R02','R01'],styles=['paper','flat'],intent='Opaque, matte reading planes; hierarchy comes from existing surfaces, edges and permitted casts.',difference='MDC supplies a paper-card precedent; its white fill, 4px radius and three shadow lobes are not copied over Area.',light='Neutral paper planes, quiet structural rules and unchanged dark ink.',dark='Near-black page with existing raised planes; no invented white paper wash or dark Card halo.',roles=['plain','matte','matte','plain','plain','matte','plain','plain','matte-edge','plain','plain','plain'],states=['Existing body hover only.','Existing active body only.','No optional selected decoration.']),
 dict(id='glass',name='Glass',refs=['R03','R17'],styles=['glassmorphism','transparency','gradient-stroke'],intent='A clear frosted perimeter around opaque reading islands, using a single local backdrop owner.',difference='R03 publishes 5px blur and .5 white fill. Only its 5px blur is retained as a trial input; proposed tint alpha .82/.92 and rims are adaptations.',light='A pale transmitting shell; dark ink is protected by opaque content islands.',dark='A near-black page; dark shell tint transmits less, with a narrow light rim.',roles=['plain','glass-shell','glass-shell','glass-control','well','glass-thumb','plain','plain','glass-edge','plain','plain','plain'],states=['Strengthen the existing body/edge; do not change tint transparency or blur.','Suppress the optional glint; use active body.','Keep semantic selection; no extra glass on the mark.']),
 dict(id='acrylic',name='Acrylic',refs=['R04','R03'],styles=['acrylic','grain','transparency'],intent='A muted translucent transient shell with one static fine-noise layer and opaque content.',difference='An Acrylic-inspired CSS proposal, not native WinUI: 12px CSS blur is authored, not a conversion of native BlurAmount 30. Grain .02 is a trial opacity, not the original noise bitmap.',light='Milky neutral shell with faint static grain outside reading regions.',dark='Dense neutral shell tint and subdued grain; the page stays near-black.',roles=['plain','matte','acrylic-shell','matte','well','matte','plain','plain','matte-edge','plain','plain','plain'],states=['Existing state plates; texture stays static.','Existing active plate; no new recess animation.','Selected/open tint remains semantic, not the acrylic tint.']),
 dict(id='soft',name='Soft',refs=['R08','R09'],styles=['neumorphism','claymorphism','inner-shadow'],intent='Soft local convex/concave modeling while preserving explicit required boundaries.',difference='Constrained neumorphic/clay translation. Reject R08 external 20px lobes and R09 control cast; only local inset/edge cues survive Area elevation rules.',light='Shallow opposing light/shade modeling on opaque bodies.',dark='Lower modeling strength and a local upper rim; no white external shadow or dark Card halo.',roles=['plain','soft-shell','soft-shell','soft-control','soft-well','soft-thumb','plain','soft-rule','soft-edge','plain','plain','plain'],states=['Existing hover body and unchanged local relief.','Switch convex control to shallow concave profile; keep geometry.','Keep the chosen semantic body and mark; no shadow-only checked state.']),
 dict(id='tactile',name='Tactile',refs=['R10','R19','R20'],styles=['skeuomorphism','bevel-emboss','inner-shadow'],intent='Crisp molded edges and recessed wells inspired by mechanical controls, without retro typography or geometry.',difference='98.css edge offsets motivate paired rims, but its 0px radius, palette and controls are not imported. Board casts/text shadows remain source evidence, not adopted button paint.',light='Opaque body with a compact bevel and a quiet upper edge.',dark='Opaque dark body, a restrained lighter top and a stronger identifying edge supplied by Area.',roles=['plain','tactile-shell','tactile-shell','tactile-control','tactile-well','tactile-thumb','plain','tactile-rule','tactile-edge','plain','plain','plain'],states=['Use existing hover body; keep the light rig still.','Reverse the control bevel locally, without translating text or adding a cast.','Retain existing selected inset/mark; decoration cannot replace it.']),
 dict(id='aero',name='Aero',refs=['R11','R12'],styles=['aqua','frutiger-aero','linear-gradient'],intent='Glossy perimeter and upper-body reflections on sparse shells and actions, with calm inner content.',difference='Aqua/Aero-inspired chrome, not the entire historical visual language. R11/R12 gloss bands are narrowed away from labels; their radii, blue base, hover opacity and text shadows are rejected.',light='Small light reflections over semantic neutral/action bodies.',dark='Dimmer upper reflection over dark bodies; preserve semantic tone and near-black page.',roles=['plain','aero-shell','aero-shell','aero-control','well','aero-thumb','plain','plain','aero-edge','plain','plain','plain'],states=['Existing hover body; stable band and fixed ink.','Remove optional gloss and body-reflection bands for press; retain active body.','Semantic selected body remains separate from reflected highlight.']),
 dict(id='glow',name='Glow',refs=['R13','R12'],styles=['glow-neon','inner-glow','outer-glow'],intent='Sparse perimeter emission and supplementary status bloom around independently readable cores.',difference='R13 em-scale lobes and text bloom are not transferred to small controls. Trial CSS-pixel halos are authored and suppressed in dense rows and around focus/error.',light='Low-strength context-colored perimeter emission; required edges do the identification.',dark='A slightly stronger bounded halo on sparse emitters, with opaque readable cores.',roles=['plain','glow-shell','glow-shell','glow-control','plain','glow-thumb','glow-indicator','plain','glow-edge','plain','plain','plain'],states=['Optional halo stays at its resting value; existing state edge changes.','Suppress the halo; active body remains immediate.','Optional static context halo may accompany an existing selected/status mark; never change core geometry.']),
 dict(id='prism',name='Prism',refs=['R17','R15'],styles=['gradient-stroke','linear-gradient','radial-gradient'],intent='A single restrained gradient perimeter, with an optional sparse page scene kept out of reading grounds.',difference='R17 supplies opaque and transparent edge techniques. Its 10px border and source colors are not defaults. R15 motivates an optional scene only; the default has no mesh/noise or animated gradient.',light='A low-alpha decorative cool/warm edge around neutral opaque bodies.',dark='A somewhat stronger colored edge without lifting the page or coloring the ink.',roles=['plain','prism-shell','prism-shell','prism-control','plain','prism-thumb','plain','plain','prism-edge','plain','plain','plain'],states=['Existing state edge/body only; gradient stops stay fixed.','Hide optional gradient edge; active body and required edge remain.','Keep selection colors; do not recolor a progress/range core with the gradient.'])
]
NOTES = {
 'page':'Keep existing page body (near-black in dark); no self-cast, blur, transmitted page, or inherited scene. Optional artwork is a separate declared scene, off by default.',
 'container':'Only an actual painted shell; layout wrappers stay unpainted. Dense body is opaque Trace; perimeter can be Quiet. Respect Card/Panel or no-cast binding.',
 'floating-surface':'Quiet shell, one acquisition and one existing cast owner. Tooltip reduces to Trace and its own opaque recipe. Arrow continues shell with no separate effects.',
 'raised-control':'Quiet only for sparse actions, Trace for repeated actions; no external cast. Transparent/ghost/row controls keep their existing lack of body until state paints it.',
 'recessed-field-track':'Trace, opaque editing/reading center. Only local cavity; focus/invalid are separate. Track and well geometry unchanged.',
 'thumb-knob':'Quiet local convex cue, original dimensions/travel, Surface shadow-1 only where already bound; no independent backdrop.',
 'indicator-fill':'Semantic/literal core unchanged and opaque as already specified. Trace optional halo only outside truthful data geometry and with clearance; none on literal color data.',
 'divider':'Existing structural line stays. Trace supplementary relief only; no cast, grain or glow network.',
 'edge':'This is the owner shell perimeter reference, not a second edge pass. Required control/focus/invalid edges bypass Material. Surface decorative width may disable this edge.',
 'glyph':'None; plain semantic ink, intrinsic media unchanged. No filters, gradients, glow or engraving inherited from the host.',
 'text':'None; keep font metrics, readable ink, syntax and value paint. No letterpress, blur, glow or global transparency.',
 'scrim':'None added material; retain existing functional occlusion/local fade and modal behavior. No independent blur, grain, gloss or new alpha.'}
CAST = {r:'none' for r in ROLES}
CAST.update({'container':'existing-bound-source-only; dark Card remains none','floating-surface':'existing-bound-float-or-exception-source','thumb-knob':'existing-bound-shadow-1-only'})

def edge(c, dark, kind='solid', profile='plain', strength=None):
 c['stroke'].update(coverage='all',paint=kind,profile=profile,opacity=strength if strength is not None else (.22 if dark else .14))

def gradient(c, target, dark, kind='reflection'):
 if kind=='prism':
  stops=[dict(id='cool',position=0,source='decorative',alpha=.22 if dark else .16,customLight='#3653A5',customDark='#90AEFF'),dict(id='warm',position=100,source='decorative',alpha=.22 if dark else .16,customLight='#873F83',customDark='#D5A6E8')]
 else:
  stops=[dict(id='top',position=0,source='highlight-white',alpha=.08 if dark else .12),dict(id='bottom',position=100,source='highlight-white',alpha=0)]
 c['gradients'][target]=dict(target=target,kind='linear',angleDeg=180 if kind!='prism' else 135,interpolation='srgb',stops=stops)

def profile(name,dark):
 c=deepcopy(NEUTRAL)
 if name=='plain': return c
 c['amount']='quiet'
 if name in ['matte','matte-edge']:
  edge(c,dark); c['amount']='trace';return c
 if name.startswith('glass'):
  edge(c,dark,'gradient');gradient(c,'edge',dark)
  c['gloss']['strength']=.06 if dark else .10
  if name=='glass-shell': c['body']['transparency']=.08 if dark else .18;c['backdrop'].update(source='local',blurPx=5)
  if name=='glass-control': c['amount']='trace';c['gloss']['strength']=0
 elif name=='acrylic-shell':
  edge(c,dark);c['body']['transparency']=.04 if dark else .12;c['backdrop'].update(source='local',blurPx=12);c['grain']['strength']=.01 if dark else .02
 elif name in ['well','soft-well','tactile-well']:
  c['amount']='trace';c['relief'].update(profile='concave',depthPx=.5,softnessPx=1 if name!='tactile-well' else 0,strength=.08 if dark else .10)
 elif name.startswith('soft'):
  edge(c,dark,'solid','bevel');c['relief'].update(profile='convex',depthPx=1,softnessPx=2,spreadPx=0,strength=.08 if dark else .12)
  c['gloss'].update(strength=.06 if dark else .10,softnessPx=1)
  if name in ['soft-rule','soft-edge']:c['amount']='trace';c['relief']['depthPx']=.5;c['gloss']['strength']=0
 elif name.startswith('tactile'):
  edge(c,dark,'solid','double-rim');c['relief'].update(profile='convex',depthPx=1,softnessPx=0,strength=.10 if dark else .16)
  c['gloss'].update(strength=.08 if dark else .14,extent=.10)
  if name in ['tactile-rule','tactile-edge']:c['amount']='trace';c['gloss']['strength']=0;c['relief']['depthPx']=.5
 elif name.startswith('aero'):
  edge(c,dark,'gradient','double-rim');gradient(c,'edge',dark);gradient(c,'body-reflection',dark)
  c['gloss'].update(source='authored',strength=.10 if dark else .18,extent=.25,softnessPx=1)
  if name=='aero-control': c['amount']='trace';c['gloss']['strength']=0;c['gradients'].pop('body-reflection')
 elif name.startswith('glow'):
  edge(c,dark);c['glow'].update(strength=.16 if dark else .08,softnessPx=4,spreadPx=0)
  if name in ['glow-control','glow-thumb','glow-indicator']:
   c['amount']='trace';c['glow']['softnessPx']=2;c['stroke'].update(coverage='none',opacity=0)
 elif name.startswith('prism'):
  edge(c,dark,'gradient',strength=1);gradient(c,'edge',dark,'prism')
  if name=='prism-control': c['amount']='trace'
 else:raise ValueError(name)
 return c

def resolved(p,role,dark):
 name=p['roles'][ROLES.index(role)];c=profile(name,dark)
 # Non-body roles must never add a second shell or gloss surface.
 if role=='edge':
  c['body']['source']='none';c['gloss']['strength']=0;c['gradients'].pop('body-reflection',None)
 if role=='divider': c['body']['source']='none';c['stroke']['coverage']='none';c['stroke']['opacity']=0
 if role=='indicator-fill': c['body']['source']='receiver.semantic-or-literal-core';c['stroke']['coverage']='none';c['stroke']['opacity']=0
 if role in ['glyph','text']:c['body']['source']='none'
 if role=='scrim':c['body']['source']='receiver.functional-occlusion'
 return dict(profile=name,controls=c,castEligibility=CAST[role],guard=NOTES[role],referenceHeightPx=32 if role=='raised-control' else 16 if role=='thumb-knob' else None,
   geometry='existing-used-shape; concentric-rims; no material radius',fallback='F0',provenance='authored-proposal; see preset source transfer record')
