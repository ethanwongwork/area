# Preset records after task 19

> **Task 19 / D4–D7:** None is the identity default; Glass/Tactile/Soft are first-set candidates. Paper is deferred for a real opaque rebuild; its existing stroke no longer fades to 14%/22%. Prism stops derive from accent/neutral. Glass container is explicitly a sparse painted shell; D1/D3 supersede the old global cap. Required failing glass edges use F0. Numeric strengths remain uncalibrated.

> **Superseded — D1, D2, D3, D9, D11, D13, D14, D16:** historical caps, no-cast rules, angle convention and fixed geometry/Surface prescriptions below are preserved as proposals, not current requirements. First-set calibration and nested 0/1 gates are future tasks.

**Authored complete specifications, not measured or shipping presets.** Every row resolves from the neutral control contract in [contract.md](contract.md); unlisted optional channels are explicitly off. All thirteen roles and both modes are expanded without inheritance in [presets.json](presets.json). Numeric seeds are proposals; source values and intentional differences are recorded in [evidence.md](evidence.md).

Each preset has a shared light at 225° toward the upper-left, height 45°, ambient .5. Cast controls remain source direction, lift/softness/strength gains 1, spread delta 0. These are authored compatibility/lighting choices. The following rows override the preset global profile, which is the floating-surface profile. Roles never inherit that full profile accidentally. Semantic ink and Surface policy survive every row.

## None (`none`)

D4 default identity: emit no material overrides; retain existing Area body, edge, Surface shadow, ink and state paint.

**References:** . **Transfer:** Identity contract, not an imported visual reference. Neutral controls mean no emitted override, not removal of existing shadows/borders.

**Light:** Existing Area light unchanged. **Dark:** Existing Area dark unchanged.

| Role / cap | Light requested recipe | Dark requested recipe | Cast / context |
| --- | --- | --- | --- |
| page / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | none. Keep existing page body (near-black in dark); no self-cast, blur, transmitted page, or inherited scene. Optional artwork is a separate declared scene, off by default. |
| container / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | existing-bound-source-only; dark Card remains none. Only an actual painted shell; layout wrappers stay unpainted. Dense body is opaque Trace; perimeter can be Quiet. Respect Card/Panel or no-cast binding. |
| floating-surface / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | existing-bound-float-or-exception-source. Quiet shell, one acquisition and one existing cast owner. Tooltip reduces to Trace and its own opaque recipe. Arrow continues shell with no separate effects. |
| raised-control / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | none. Quiet only for sparse actions, Trace for repeated actions; no external cast. Transparent/ghost/row controls keep their existing lack of body until state paints it. |
| recessed-field-track / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | none. Trace, opaque editing/reading center. Only local cavity; focus/invalid are separate. Track and well geometry unchanged. |
| thumb-knob / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | existing-bound-shadow-1-only. Quiet local convex cue, original dimensions/travel, Surface shadow-1 only where already bound; no independent backdrop. |
| indicator-fill / none | body `receiver.semantic-or-literal-core`; transparency 0 | body `receiver.semantic-or-literal-core`; transparency 0 | none. Semantic/literal core unchanged and opaque as already specified. Trace optional halo only outside truthful data geometry and with clearance; none on literal color data. |
| divider / none | body `none`; transparency 0 | body `none`; transparency 0 | none. Existing structural line stays. Trace supplementary relief only; no cast, grain or glow network. |
| edge / none | body `none`; transparency 0 | body `none`; transparency 0 | none. This is the owner shell perimeter reference, not a second edge pass. Required control/focus/invalid edges bypass Material. Surface decorative width may disable this edge. |
| glyph / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; plain semantic ink, intrinsic media unchanged. No filters, gradients, glow or engraving inherited from the host. |
| text / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; keep font metrics, readable ink, syntax and value paint. No letterpress, blur, glow or global transparency. |
| scrim / none | body `receiver.functional-occlusion`; transparency 0 | body `receiver.functional-occlusion`; transparency 0 | none. None added material; retain existing functional occlusion/local fade and modal behavior. No independent blur, grain, gloss or new alpha. |
| row-plate / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | pending-D3-calibration; required state plate unchanged. D6: semantic hover/focus/selected plate remains intact. This preset adds no row decoration until numeric role strengths are calibrated; see 05 for style-layer intent. |

**States (only on eligible receivers):**
- **hover:** Existing hover and fixed foreground unchanged.
- **press:** Existing pressed paint unchanged.
- **focus-visible:** Keep required focus; remove optional glow, gloss and reflected body overlays on the focused receiver.
- **selected-checked:** Existing selection/checked paint unchanged.
- **open:** Resolve the opened receiver independently, one shell; preserve actual expanded state.
- **disabled:** Use existing disabled paint once and opaque body; remove optional glow/gloss/relief/grain/gradients/strokes, keep selected value.
- **invalid:** Keep danger context and combined invalid-focus geometry; suppress optional glow/gloss, reflected body overlays and decorative edge gradient.

**Fallback:** F0 from the shared contract in both modes; fixed hover ink, no optical motion, no per-row blur, no new geometry. See the shared density/radius and state rules for the effective recipe.

## Paper (`paper`)

Opaque, matte reading planes; hierarchy comes from existing surfaces, edges and permitted casts.

**References:** [R02](evidence.md#r02), [R01](evidence.md#r01). **Transfer:** MDC supplies a paper-card precedent; its white fill, 4px radius and three shadow lobes are not copied over Area.

**Light:** Neutral paper planes, quiet structural rules and unchanged dark ink. **Dark:** Near-black page with existing raised planes; no invented white paper wash or dark Card halo.

| Role / cap | Light requested recipe | Dark requested recipe | Cast / context |
| --- | --- | --- | --- |
| page / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | none. Keep existing page body (near-black in dark); no self-cast, blur, transmitted page, or inherited scene. Optional artwork is a separate declared scene, off by default. |
| container / trace | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 1 | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 1 | existing-bound-source-only; dark Card remains none. Only an actual painted shell; layout wrappers stay unpainted. Dense body is opaque Trace; perimeter can be Quiet. Respect Card/Panel or no-cast binding. |
| floating-surface / trace | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 1 | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 1 | existing-bound-float-or-exception-source. Quiet shell, one acquisition and one existing cast owner. Tooltip reduces to Trace and its own opaque recipe. Arrow continues shell with no separate effects. |
| raised-control / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | none. Quiet only for sparse actions, Trace for repeated actions; no external cast. Transparent/ghost/row controls keep their existing lack of body until state paints it. |
| recessed-field-track / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | none. Trace, opaque editing/reading center. Only local cavity; focus/invalid are separate. Track and well geometry unchanged. |
| thumb-knob / trace | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 1 | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 1 | existing-bound-shadow-1-only. Quiet local convex cue, original dimensions/travel, Surface shadow-1 only where already bound; no independent backdrop. |
| indicator-fill / none | body `receiver.semantic-or-literal-core`; transparency 0 | body `receiver.semantic-or-literal-core`; transparency 0 | none. Semantic/literal core unchanged and opaque as already specified. Trace optional halo only outside truthful data geometry and with clearance; none on literal color data. |
| divider / none | body `none`; transparency 0 | body `none`; transparency 0 | none. Existing structural line stays. Trace supplementary relief only; no cast, grain or glow network. |
| edge / trace | body `none`; transparency 0; edge all/solid/plain, opacity 1 | body `none`; transparency 0; edge all/solid/plain, opacity 1 | none. This is the owner shell perimeter reference, not a second edge pass. Required control/focus/invalid edges bypass Material. Surface decorative width may disable this edge. |
| glyph / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; plain semantic ink, intrinsic media unchanged. No filters, gradients, glow or engraving inherited from the host. |
| text / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; keep font metrics, readable ink, syntax and value paint. No letterpress, blur, glow or global transparency. |
| scrim / none | body `receiver.functional-occlusion`; transparency 0 | body `receiver.functional-occlusion`; transparency 0 | none. None added material; retain existing functional occlusion/local fade and modal behavior. No independent blur, grain, gloss or new alpha. |
| row-plate / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | pending-D3-calibration; required state plate unchanged. D6: semantic hover/focus/selected plate remains intact. This preset adds no row decoration until numeric role strengths are calibrated; see 05 for style-layer intent. |

**States (only on eligible receivers):**
- **hover:** Existing body hover only.
- **press:** Existing active body only.
- **focus-visible:** Keep required focus; remove optional glow, gloss and reflected body overlays on the focused receiver.
- **selected-checked:** No optional selected decoration.
- **open:** Resolve the opened receiver independently, one shell; preserve actual expanded state.
- **disabled:** Use existing disabled paint once and opaque body; remove optional glow/gloss/relief/grain/gradients/strokes, keep selected value.
- **invalid:** Keep danger context and combined invalid-focus geometry; suppress optional glow/gloss, reflected body overlays and decorative edge gradient.

**Fallback:** F0 from the shared contract in both modes; fixed hover ink, no optical motion, no per-row blur, no new geometry. See the shared density/radius and state rules for the effective recipe.

## Glass (`glass`)

A clear frosted perimeter around opaque reading islands, using a single local backdrop owner.

**References:** [R03](evidence.md#r03), [R17](evidence.md#r17). **Transfer:** R03 publishes 5px blur and .5 white fill. Only its 5px blur is retained as a trial input; proposed tint alpha .82/.92 and rims are adaptations.

**Light:** A pale transmitting shell; dark ink is protected by opaque content islands. **Dark:** A near-black page; dark shell tint transmits less, with a narrow light rim.

| Role / cap | Light requested recipe | Dark requested recipe | Cast / context |
| --- | --- | --- | --- |
| page / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | none. Keep existing page body (near-black in dark); no self-cast, blur, transmitted page, or inherited scene. Optional artwork is a separate declared scene, off by default. |
| container / quiet | body `receiver.body`; transparency 0.18; local blur 5px; edge all/gradient/plain, opacity 0.14; key gloss strength/extent 0.1/0.15, softness 0px; edge: linear 180° sRGB [0% highlight-white α0.12 → 100% highlight-white α0] | body `receiver.body`; transparency 0.08; local blur 5px; edge all/gradient/plain, opacity 0.22; key gloss strength/extent 0.06/0.15, softness 0px; edge: linear 180° sRGB [0% highlight-white α0.08 → 100% highlight-white α0] | existing-bound-source-only; dark Card remains none. D1/D3 supersede the old Trace-only container ceiling. This historical shell recipe is now explicitly sparse-painted-shell-only; dense reading subplanes stay opaque. Numeric per-role strength is pending calibration; not approved for every container. |
| floating-surface / quiet | body `receiver.body`; transparency 0.18; local blur 5px; edge all/gradient/plain, opacity 0.14; key gloss strength/extent 0.1/0.15, softness 0px; edge: linear 180° sRGB [0% highlight-white α0.12 → 100% highlight-white α0] | body `receiver.body`; transparency 0.08; local blur 5px; edge all/gradient/plain, opacity 0.22; key gloss strength/extent 0.06/0.15, softness 0px; edge: linear 180° sRGB [0% highlight-white α0.08 → 100% highlight-white α0] | existing-bound-float-or-exception-source. D7: arbitrary backdrop; failing required edges take opaque F0. App/OS transparency reduction and forced-colors disable acquisition and require opaque grounds. |
| raised-control / trace | body `receiver.body`; transparency 0; edge all/gradient/plain, opacity 0.14; edge: linear 180° sRGB [0% highlight-white α0.12 → 100% highlight-white α0] | body `receiver.body`; transparency 0; edge all/gradient/plain, opacity 0.22; edge: linear 180° sRGB [0% highlight-white α0.08 → 100% highlight-white α0] | none. Quiet only for sparse actions, Trace for repeated actions; no external cast. Transparent/ghost/row controls keep their existing lack of body until state paints it. |
| recessed-field-track / trace | body `receiver.body`; transparency 0; concave relief depth/softness/spread 0.5/1/0px, strength 0.1 | body `receiver.body`; transparency 0; concave relief depth/softness/spread 0.5/1/0px, strength 0.08 | none. Trace, opaque editing/reading center. Only local cavity; focus/invalid are separate. Track and well geometry unchanged. |
| thumb-knob / quiet | body `receiver.body`; transparency 0; edge all/gradient/plain, opacity 0.14; key gloss strength/extent 0.1/0.15, softness 0px; edge: linear 180° sRGB [0% highlight-white α0.12 → 100% highlight-white α0] | body `receiver.body`; transparency 0; edge all/gradient/plain, opacity 0.22; key gloss strength/extent 0.06/0.15, softness 0px; edge: linear 180° sRGB [0% highlight-white α0.08 → 100% highlight-white α0] | existing-bound-shadow-1-only. Quiet local convex cue, original dimensions/travel, Surface shadow-1 only where already bound; no independent backdrop. |
| indicator-fill / none | body `receiver.semantic-or-literal-core`; transparency 0 | body `receiver.semantic-or-literal-core`; transparency 0 | none. Semantic/literal core unchanged and opaque as already specified. Trace optional halo only outside truthful data geometry and with clearance; none on literal color data. |
| divider / none | body `none`; transparency 0 | body `none`; transparency 0 | none. Existing structural line stays. Trace supplementary relief only; no cast, grain or glow network. |
| edge / quiet | body `none`; transparency 0; edge all/gradient/plain, opacity 0.14; edge: linear 180° sRGB [0% highlight-white α0.12 → 100% highlight-white α0] | body `none`; transparency 0; edge all/gradient/plain, opacity 0.22; edge: linear 180° sRGB [0% highlight-white α0.08 → 100% highlight-white α0] | none. This is the owner shell perimeter reference, not a second edge pass. Required control/focus/invalid edges bypass Material. Surface decorative width may disable this edge. |
| glyph / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; plain semantic ink, intrinsic media unchanged. No filters, gradients, glow or engraving inherited from the host. |
| text / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; keep font metrics, readable ink, syntax and value paint. No letterpress, blur, glow or global transparency. |
| scrim / none | body `receiver.functional-occlusion`; transparency 0 | body `receiver.functional-occlusion`; transparency 0 | none. None added material; retain existing functional occlusion/local fade and modal behavior. No independent blur, grain, gloss or new alpha. |
| row-plate / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | pending-D3-calibration; required state plate unchanged. D6: semantic hover/focus/selected plate remains intact. This preset adds no row decoration until numeric role strengths are calibrated; see 05 for style-layer intent. |

**States (only on eligible receivers):**
- **hover:** Strengthen the existing body/edge; do not change tint transparency or blur.
- **press:** Suppress the optional glint; use active body.
- **focus-visible:** Keep required focus; remove optional glow, gloss and reflected body overlays on the focused receiver.
- **selected-checked:** Keep semantic selection; no extra glass on the mark.
- **open:** Resolve the opened receiver independently, one shell; preserve actual expanded state.
- **disabled:** Use existing disabled paint once and opaque body; remove optional glow/gloss/relief/grain/gradients/strokes, keep selected value.
- **invalid:** Keep danger context and combined invalid-focus geometry; suppress optional glow/gloss, reflected body overlays and decorative edge gradient.

**Fallback:** F0 from the shared contract in both modes; fixed hover ink, no optical motion, no per-row blur, no new geometry. See the shared density/radius and state rules for the effective recipe.

## Acrylic (`acrylic`)

A muted translucent transient shell with one static fine-noise layer and opaque content.

**References:** [R04](evidence.md#r04), [R03](evidence.md#r03). **Transfer:** An Acrylic-inspired CSS proposal, not native WinUI: 12px CSS blur is authored, not a conversion of native BlurAmount 30. Grain .02 is a trial opacity, not the original noise bitmap.

**Light:** Milky neutral shell with faint static grain outside reading regions. **Dark:** Dense neutral shell tint and subdued grain; the page stays near-black.

| Role / cap | Light requested recipe | Dark requested recipe | Cast / context |
| --- | --- | --- | --- |
| page / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | none. Keep existing page body (near-black in dark); no self-cast, blur, transmitted page, or inherited scene. Optional artwork is a separate declared scene, off by default. |
| container / trace | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 1 | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 1 | existing-bound-source-only; dark Card remains none. Only an actual painted shell; layout wrappers stay unpainted. Dense body is opaque Trace; perimeter can be Quiet. Respect Card/Panel or no-cast binding. |
| floating-surface / quiet | body `receiver.body`; transparency 0.12; local blur 12px; edge all/solid/plain, opacity 0.14; static grain strength 0.02, scale 1px, seed 13 | body `receiver.body`; transparency 0.04; local blur 12px; edge all/solid/plain, opacity 0.22; static grain strength 0.01, scale 1px, seed 13 | existing-bound-float-or-exception-source. Quiet shell, one acquisition and one existing cast owner. Tooltip reduces to Trace and its own opaque recipe. Arrow continues shell with no separate effects. |
| raised-control / trace | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 1 | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 1 | none. Quiet only for sparse actions, Trace for repeated actions; no external cast. Transparent/ghost/row controls keep their existing lack of body until state paints it. |
| recessed-field-track / trace | body `receiver.body`; transparency 0; concave relief depth/softness/spread 0.5/1/0px, strength 0.1 | body `receiver.body`; transparency 0; concave relief depth/softness/spread 0.5/1/0px, strength 0.08 | none. Trace, opaque editing/reading center. Only local cavity; focus/invalid are separate. Track and well geometry unchanged. |
| thumb-knob / trace | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 1 | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 1 | existing-bound-shadow-1-only. Quiet local convex cue, original dimensions/travel, Surface shadow-1 only where already bound; no independent backdrop. |
| indicator-fill / none | body `receiver.semantic-or-literal-core`; transparency 0 | body `receiver.semantic-or-literal-core`; transparency 0 | none. Semantic/literal core unchanged and opaque as already specified. Trace optional halo only outside truthful data geometry and with clearance; none on literal color data. |
| divider / none | body `none`; transparency 0 | body `none`; transparency 0 | none. Existing structural line stays. Trace supplementary relief only; no cast, grain or glow network. |
| edge / trace | body `none`; transparency 0; edge all/solid/plain, opacity 1 | body `none`; transparency 0; edge all/solid/plain, opacity 1 | none. This is the owner shell perimeter reference, not a second edge pass. Required control/focus/invalid edges bypass Material. Surface decorative width may disable this edge. |
| glyph / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; plain semantic ink, intrinsic media unchanged. No filters, gradients, glow or engraving inherited from the host. |
| text / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; keep font metrics, readable ink, syntax and value paint. No letterpress, blur, glow or global transparency. |
| scrim / none | body `receiver.functional-occlusion`; transparency 0 | body `receiver.functional-occlusion`; transparency 0 | none. None added material; retain existing functional occlusion/local fade and modal behavior. No independent blur, grain, gloss or new alpha. |
| row-plate / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | pending-D3-calibration; required state plate unchanged. D6: semantic hover/focus/selected plate remains intact. This preset adds no row decoration until numeric role strengths are calibrated; see 05 for style-layer intent. |

**States (only on eligible receivers):**
- **hover:** Existing state plates; texture stays static.
- **press:** Existing active plate; no new recess animation.
- **focus-visible:** Keep required focus; remove optional glow, gloss and reflected body overlays on the focused receiver.
- **selected-checked:** Selected/open tint remains semantic, not the acrylic tint.
- **open:** Resolve the opened receiver independently, one shell; preserve actual expanded state.
- **disabled:** Use existing disabled paint once and opaque body; remove optional glow/gloss/relief/grain/gradients/strokes, keep selected value.
- **invalid:** Keep danger context and combined invalid-focus geometry; suppress optional glow/gloss, reflected body overlays and decorative edge gradient.

**Fallback:** F0 from the shared contract in both modes; fixed hover ink, no optical motion, no per-row blur, no new geometry. See the shared density/radius and state rules for the effective recipe.

## Soft (`soft`)

Soft local convex/concave modeling while preserving explicit required boundaries.

**References:** [R08](evidence.md#r08), [R09](evidence.md#r09). **Transfer:** Constrained neumorphic/clay translation. Reject R08 external 20px lobes and R09 control cast; only local inset/edge cues survive Area elevation rules.

**Light:** Shallow opposing light/shade modeling on opaque bodies. **Dark:** Lower modeling strength and a local upper rim; no white external shadow or dark Card halo.

| Role / cap | Light requested recipe | Dark requested recipe | Cast / context |
| --- | --- | --- | --- |
| page / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | none. Keep existing page body (near-black in dark); no self-cast, blur, transmitted page, or inherited scene. Optional artwork is a separate declared scene, off by default. |
| container / quiet | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/2/0px, strength 0.12; edge all/solid/bevel, opacity 0.14; key gloss strength/extent 0.1/0.15, softness 1px | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/2/0px, strength 0.08; edge all/solid/bevel, opacity 0.22; key gloss strength/extent 0.06/0.15, softness 1px | existing-bound-source-only; dark Card remains none. Only an actual painted shell; layout wrappers stay unpainted. Dense body is opaque Trace; perimeter can be Quiet. Respect Card/Panel or no-cast binding. |
| floating-surface / quiet | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/2/0px, strength 0.12; edge all/solid/bevel, opacity 0.14; key gloss strength/extent 0.1/0.15, softness 1px | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/2/0px, strength 0.08; edge all/solid/bevel, opacity 0.22; key gloss strength/extent 0.06/0.15, softness 1px | existing-bound-float-or-exception-source. Quiet shell, one acquisition and one existing cast owner. Tooltip reduces to Trace and its own opaque recipe. Arrow continues shell with no separate effects. |
| raised-control / quiet | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/2/0px, strength 0.12; edge all/solid/bevel, opacity 0.14; key gloss strength/extent 0.1/0.15, softness 1px | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/2/0px, strength 0.08; edge all/solid/bevel, opacity 0.22; key gloss strength/extent 0.06/0.15, softness 1px | none. Quiet only for sparse actions, Trace for repeated actions; no external cast. Transparent/ghost/row controls keep their existing lack of body until state paints it. |
| recessed-field-track / trace | body `receiver.body`; transparency 0; concave relief depth/softness/spread 0.5/1/0px, strength 0.1 | body `receiver.body`; transparency 0; concave relief depth/softness/spread 0.5/1/0px, strength 0.08 | none. Trace, opaque editing/reading center. Only local cavity; focus/invalid are separate. Track and well geometry unchanged. |
| thumb-knob / quiet | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/2/0px, strength 0.12; edge all/solid/bevel, opacity 0.14; key gloss strength/extent 0.1/0.15, softness 1px | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/2/0px, strength 0.08; edge all/solid/bevel, opacity 0.22; key gloss strength/extent 0.06/0.15, softness 1px | existing-bound-shadow-1-only. Quiet local convex cue, original dimensions/travel, Surface shadow-1 only where already bound; no independent backdrop. |
| indicator-fill / none | body `receiver.semantic-or-literal-core`; transparency 0 | body `receiver.semantic-or-literal-core`; transparency 0 | none. Semantic/literal core unchanged and opaque as already specified. Trace optional halo only outside truthful data geometry and with clearance; none on literal color data. |
| divider / trace | body `none`; transparency 0; convex relief depth/softness/spread 0.5/2/0px, strength 0.12 | body `none`; transparency 0; convex relief depth/softness/spread 0.5/2/0px, strength 0.08 | none. Existing structural line stays. Trace supplementary relief only; no cast, grain or glow network. |
| edge / trace | body `none`; transparency 0; convex relief depth/softness/spread 0.5/2/0px, strength 0.12; edge all/solid/bevel, opacity 0.14 | body `none`; transparency 0; convex relief depth/softness/spread 0.5/2/0px, strength 0.08; edge all/solid/bevel, opacity 0.22 | none. This is the owner shell perimeter reference, not a second edge pass. Required control/focus/invalid edges bypass Material. Surface decorative width may disable this edge. |
| glyph / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; plain semantic ink, intrinsic media unchanged. No filters, gradients, glow or engraving inherited from the host. |
| text / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; keep font metrics, readable ink, syntax and value paint. No letterpress, blur, glow or global transparency. |
| scrim / none | body `receiver.functional-occlusion`; transparency 0 | body `receiver.functional-occlusion`; transparency 0 | none. None added material; retain existing functional occlusion/local fade and modal behavior. No independent blur, grain, gloss or new alpha. |
| row-plate / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | pending-D3-calibration; required state plate unchanged. D6: semantic hover/focus/selected plate remains intact. This preset adds no row decoration until numeric role strengths are calibrated; see 05 for style-layer intent. |

**States (only on eligible receivers):**
- **hover:** Existing hover body and unchanged local relief.
- **press:** Switch convex control to shallow concave profile; keep geometry.
- **focus-visible:** Keep required focus; remove optional glow, gloss and reflected body overlays on the focused receiver.
- **selected-checked:** Keep the chosen semantic body and mark; no shadow-only checked state.
- **open:** Resolve the opened receiver independently, one shell; preserve actual expanded state.
- **disabled:** Use existing disabled paint once and opaque body; remove optional glow/gloss/relief/grain/gradients/strokes, keep selected value.
- **invalid:** Keep danger context and combined invalid-focus geometry; suppress optional glow/gloss, reflected body overlays and decorative edge gradient.

**Fallback:** F0 from the shared contract in both modes; fixed hover ink, no optical motion, no per-row blur, no new geometry. See the shared density/radius and state rules for the effective recipe.

## Tactile (`tactile`)

Crisp molded edges and recessed wells inspired by mechanical controls, without retro typography or geometry.

**References:** [R10](evidence.md#r10), [R19](evidence.md#r19), [R20](evidence.md#r20). **Transfer:** 98.css edge offsets motivate paired rims, but its 0px radius, palette and controls are not imported. Board casts/text shadows remain source evidence, not adopted button paint.

**Light:** Opaque body with a compact bevel and a quiet upper edge. **Dark:** Opaque dark body, a restrained lighter top and a stronger identifying edge supplied by Area.

| Role / cap | Light requested recipe | Dark requested recipe | Cast / context |
| --- | --- | --- | --- |
| page / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | none. Keep existing page body (near-black in dark); no self-cast, blur, transmitted page, or inherited scene. Optional artwork is a separate declared scene, off by default. |
| container / quiet | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/0/0px, strength 0.16; edge all/solid/double-rim, opacity 0.14; key gloss strength/extent 0.14/0.1, softness 0px | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/0/0px, strength 0.1; edge all/solid/double-rim, opacity 0.22; key gloss strength/extent 0.08/0.1, softness 0px | existing-bound-source-only; dark Card remains none. Only an actual painted shell; layout wrappers stay unpainted. Dense body is opaque Trace; perimeter can be Quiet. Respect Card/Panel or no-cast binding. |
| floating-surface / quiet | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/0/0px, strength 0.16; edge all/solid/double-rim, opacity 0.14; key gloss strength/extent 0.14/0.1, softness 0px | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/0/0px, strength 0.1; edge all/solid/double-rim, opacity 0.22; key gloss strength/extent 0.08/0.1, softness 0px | existing-bound-float-or-exception-source. Quiet shell, one acquisition and one existing cast owner. Tooltip reduces to Trace and its own opaque recipe. Arrow continues shell with no separate effects. |
| raised-control / quiet | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/0/0px, strength 0.16; edge all/solid/double-rim, opacity 0.14; key gloss strength/extent 0.14/0.1, softness 0px | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/0/0px, strength 0.1; edge all/solid/double-rim, opacity 0.22; key gloss strength/extent 0.08/0.1, softness 0px | none. Quiet only for sparse actions, Trace for repeated actions; no external cast. Transparent/ghost/row controls keep their existing lack of body until state paints it. |
| recessed-field-track / trace | body `receiver.body`; transparency 0; concave relief depth/softness/spread 0.5/0/0px, strength 0.1 | body `receiver.body`; transparency 0; concave relief depth/softness/spread 0.5/0/0px, strength 0.08 | none. Trace, opaque editing/reading center. Only local cavity; focus/invalid are separate. Track and well geometry unchanged. |
| thumb-knob / quiet | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/0/0px, strength 0.16; edge all/solid/double-rim, opacity 0.14; key gloss strength/extent 0.14/0.1, softness 0px | body `receiver.body`; transparency 0; convex relief depth/softness/spread 1/0/0px, strength 0.1; edge all/solid/double-rim, opacity 0.22; key gloss strength/extent 0.08/0.1, softness 0px | existing-bound-shadow-1-only. Quiet local convex cue, original dimensions/travel, Surface shadow-1 only where already bound; no independent backdrop. |
| indicator-fill / none | body `receiver.semantic-or-literal-core`; transparency 0 | body `receiver.semantic-or-literal-core`; transparency 0 | none. Semantic/literal core unchanged and opaque as already specified. Trace optional halo only outside truthful data geometry and with clearance; none on literal color data. |
| divider / trace | body `none`; transparency 0; convex relief depth/softness/spread 0.5/0/0px, strength 0.16 | body `none`; transparency 0; convex relief depth/softness/spread 0.5/0/0px, strength 0.1 | none. Existing structural line stays. Trace supplementary relief only; no cast, grain or glow network. |
| edge / trace | body `none`; transparency 0; convex relief depth/softness/spread 0.5/0/0px, strength 0.16; edge all/solid/double-rim, opacity 0.14 | body `none`; transparency 0; convex relief depth/softness/spread 0.5/0/0px, strength 0.1; edge all/solid/double-rim, opacity 0.22 | none. This is the owner shell perimeter reference, not a second edge pass. Required control/focus/invalid edges bypass Material. Surface decorative width may disable this edge. |
| glyph / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; plain semantic ink, intrinsic media unchanged. No filters, gradients, glow or engraving inherited from the host. |
| text / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; keep font metrics, readable ink, syntax and value paint. No letterpress, blur, glow or global transparency. |
| scrim / none | body `receiver.functional-occlusion`; transparency 0 | body `receiver.functional-occlusion`; transparency 0 | none. None added material; retain existing functional occlusion/local fade and modal behavior. No independent blur, grain, gloss or new alpha. |
| row-plate / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | pending-D3-calibration; required state plate unchanged. D6: semantic hover/focus/selected plate remains intact. This preset adds no row decoration until numeric role strengths are calibrated; see 05 for style-layer intent. |

**States (only on eligible receivers):**
- **hover:** Use existing hover body; keep the light rig still.
- **press:** Reverse the control bevel locally, without translating text or adding a cast.
- **focus-visible:** Keep required focus; remove optional glow, gloss and reflected body overlays on the focused receiver.
- **selected-checked:** Retain existing selected inset/mark; decoration cannot replace it.
- **open:** Resolve the opened receiver independently, one shell; preserve actual expanded state.
- **disabled:** Use existing disabled paint once and opaque body; remove optional glow/gloss/relief/grain/gradients/strokes, keep selected value.
- **invalid:** Keep danger context and combined invalid-focus geometry; suppress optional glow/gloss, reflected body overlays and decorative edge gradient.

**Fallback:** F0 from the shared contract in both modes; fixed hover ink, no optical motion, no per-row blur, no new geometry. See the shared density/radius and state rules for the effective recipe.

## Aero (`aero`)

Glossy perimeter and upper-body reflections on sparse shells and actions, with calm inner content.

**References:** [R11](evidence.md#r11), [R12](evidence.md#r12). **Transfer:** Aqua/Aero-inspired chrome, not the entire historical visual language. R11/R12 gloss bands are narrowed away from labels; their radii, blue base, hover opacity and text shadows are rejected.

**Light:** Small light reflections over semantic neutral/action bodies. **Dark:** Dimmer upper reflection over dark bodies; preserve semantic tone and near-black page.

| Role / cap | Light requested recipe | Dark requested recipe | Cast / context |
| --- | --- | --- | --- |
| page / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | none. Keep existing page body (near-black in dark); no self-cast, blur, transmitted page, or inherited scene. Optional artwork is a separate declared scene, off by default. |
| container / quiet | body `receiver.body`; transparency 0; edge all/gradient/double-rim, opacity 0.14; authored gloss strength/extent 0.18/0.25, softness 1px; edge: linear 180° sRGB [0% highlight-white α0.12 → 100% highlight-white α0]; body-reflection: linear 180° sRGB [0% highlight-white α0.12 → 100% highlight-white α0] | body `receiver.body`; transparency 0; edge all/gradient/double-rim, opacity 0.22; authored gloss strength/extent 0.1/0.25, softness 1px; edge: linear 180° sRGB [0% highlight-white α0.08 → 100% highlight-white α0]; body-reflection: linear 180° sRGB [0% highlight-white α0.08 → 100% highlight-white α0] | existing-bound-source-only; dark Card remains none. Only an actual painted shell; layout wrappers stay unpainted. Dense body is opaque Trace; perimeter can be Quiet. Respect Card/Panel or no-cast binding. |
| floating-surface / quiet | body `receiver.body`; transparency 0; edge all/gradient/double-rim, opacity 0.14; authored gloss strength/extent 0.18/0.25, softness 1px; edge: linear 180° sRGB [0% highlight-white α0.12 → 100% highlight-white α0]; body-reflection: linear 180° sRGB [0% highlight-white α0.12 → 100% highlight-white α0] | body `receiver.body`; transparency 0; edge all/gradient/double-rim, opacity 0.22; authored gloss strength/extent 0.1/0.25, softness 1px; edge: linear 180° sRGB [0% highlight-white α0.08 → 100% highlight-white α0]; body-reflection: linear 180° sRGB [0% highlight-white α0.08 → 100% highlight-white α0] | existing-bound-float-or-exception-source. Quiet shell, one acquisition and one existing cast owner. Tooltip reduces to Trace and its own opaque recipe. Arrow continues shell with no separate effects. |
| raised-control / trace | body `receiver.body`; transparency 0; edge all/gradient/double-rim, opacity 0.14; edge: linear 180° sRGB [0% highlight-white α0.12 → 100% highlight-white α0] | body `receiver.body`; transparency 0; edge all/gradient/double-rim, opacity 0.22; edge: linear 180° sRGB [0% highlight-white α0.08 → 100% highlight-white α0] | none. Quiet only for sparse actions, Trace for repeated actions; no external cast. Transparent/ghost/row controls keep their existing lack of body until state paints it. |
| recessed-field-track / trace | body `receiver.body`; transparency 0; concave relief depth/softness/spread 0.5/1/0px, strength 0.1 | body `receiver.body`; transparency 0; concave relief depth/softness/spread 0.5/1/0px, strength 0.08 | none. Trace, opaque editing/reading center. Only local cavity; focus/invalid are separate. Track and well geometry unchanged. |
| thumb-knob / quiet | body `receiver.body`; transparency 0; edge all/gradient/double-rim, opacity 0.14; authored gloss strength/extent 0.18/0.25, softness 1px; edge: linear 180° sRGB [0% highlight-white α0.12 → 100% highlight-white α0]; body-reflection: linear 180° sRGB [0% highlight-white α0.12 → 100% highlight-white α0] | body `receiver.body`; transparency 0; edge all/gradient/double-rim, opacity 0.22; authored gloss strength/extent 0.1/0.25, softness 1px; edge: linear 180° sRGB [0% highlight-white α0.08 → 100% highlight-white α0]; body-reflection: linear 180° sRGB [0% highlight-white α0.08 → 100% highlight-white α0] | existing-bound-shadow-1-only. Quiet local convex cue, original dimensions/travel, Surface shadow-1 only where already bound; no independent backdrop. |
| indicator-fill / none | body `receiver.semantic-or-literal-core`; transparency 0 | body `receiver.semantic-or-literal-core`; transparency 0 | none. Semantic/literal core unchanged and opaque as already specified. Trace optional halo only outside truthful data geometry and with clearance; none on literal color data. |
| divider / none | body `none`; transparency 0 | body `none`; transparency 0 | none. Existing structural line stays. Trace supplementary relief only; no cast, grain or glow network. |
| edge / quiet | body `none`; transparency 0; edge all/gradient/double-rim, opacity 0.14; edge: linear 180° sRGB [0% highlight-white α0.12 → 100% highlight-white α0] | body `none`; transparency 0; edge all/gradient/double-rim, opacity 0.22; edge: linear 180° sRGB [0% highlight-white α0.08 → 100% highlight-white α0] | none. This is the owner shell perimeter reference, not a second edge pass. Required control/focus/invalid edges bypass Material. Surface decorative width may disable this edge. |
| glyph / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; plain semantic ink, intrinsic media unchanged. No filters, gradients, glow or engraving inherited from the host. |
| text / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; keep font metrics, readable ink, syntax and value paint. No letterpress, blur, glow or global transparency. |
| scrim / none | body `receiver.functional-occlusion`; transparency 0 | body `receiver.functional-occlusion`; transparency 0 | none. None added material; retain existing functional occlusion/local fade and modal behavior. No independent blur, grain, gloss or new alpha. |
| row-plate / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | pending-D3-calibration; required state plate unchanged. D6: semantic hover/focus/selected plate remains intact. This preset adds no row decoration until numeric role strengths are calibrated; see 05 for style-layer intent. |

**States (only on eligible receivers):**
- **hover:** Existing hover body; stable band and fixed ink.
- **press:** Remove optional gloss and body-reflection bands for press; retain active body.
- **focus-visible:** Keep required focus; remove optional glow, gloss and reflected body overlays on the focused receiver.
- **selected-checked:** Semantic selected body remains separate from reflected highlight.
- **open:** Resolve the opened receiver independently, one shell; preserve actual expanded state.
- **disabled:** Use existing disabled paint once and opaque body; remove optional glow/gloss/relief/grain/gradients/strokes, keep selected value.
- **invalid:** Keep danger context and combined invalid-focus geometry; suppress optional glow/gloss, reflected body overlays and decorative edge gradient.

**Fallback:** F0 from the shared contract in both modes; fixed hover ink, no optical motion, no per-row blur, no new geometry. See the shared density/radius and state rules for the effective recipe.

## Glow (`glow`)

Sparse perimeter emission and supplementary status bloom around independently readable cores.

**References:** [R13](evidence.md#r13), [R12](evidence.md#r12). **Transfer:** R13 em-scale lobes and text bloom are not transferred to small controls. Trial CSS-pixel halos are authored and suppressed in dense rows and around focus/error.

**Light:** Low-strength context-colored perimeter emission; required edges do the identification. **Dark:** A slightly stronger bounded halo on sparse emitters, with opaque readable cores.

| Role / cap | Light requested recipe | Dark requested recipe | Cast / context |
| --- | --- | --- | --- |
| page / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | none. Keep existing page body (near-black in dark); no self-cast, blur, transmitted page, or inherited scene. Optional artwork is a separate declared scene, off by default. |
| container / quiet | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 0.14; context outer glow strength 0.08, softness/spread 4/0px | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 0.22; context outer glow strength 0.16, softness/spread 4/0px | existing-bound-source-only; dark Card remains none. Only an actual painted shell; layout wrappers stay unpainted. Dense body is opaque Trace; perimeter can be Quiet. Respect Card/Panel or no-cast binding. |
| floating-surface / quiet | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 0.14; context outer glow strength 0.08, softness/spread 4/0px | body `receiver.body`; transparency 0; edge all/solid/plain, opacity 0.22; context outer glow strength 0.16, softness/spread 4/0px | existing-bound-float-or-exception-source. Quiet shell, one acquisition and one existing cast owner. Tooltip reduces to Trace and its own opaque recipe. Arrow continues shell with no separate effects. |
| raised-control / trace | body `receiver.body`; transparency 0; context outer glow strength 0.08, softness/spread 2/0px | body `receiver.body`; transparency 0; context outer glow strength 0.16, softness/spread 2/0px | none. Quiet only for sparse actions, Trace for repeated actions; no external cast. Transparent/ghost/row controls keep their existing lack of body until state paints it. |
| recessed-field-track / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | none. Trace, opaque editing/reading center. Only local cavity; focus/invalid are separate. Track and well geometry unchanged. |
| thumb-knob / trace | body `receiver.body`; transparency 0; context outer glow strength 0.08, softness/spread 2/0px | body `receiver.body`; transparency 0; context outer glow strength 0.16, softness/spread 2/0px | existing-bound-shadow-1-only. Quiet local convex cue, original dimensions/travel, Surface shadow-1 only where already bound; no independent backdrop. |
| indicator-fill / trace | body `receiver.semantic-or-literal-core`; transparency 0; context outer glow strength 0.08, softness/spread 2/0px | body `receiver.semantic-or-literal-core`; transparency 0; context outer glow strength 0.16, softness/spread 2/0px | none. Semantic/literal core unchanged and opaque as already specified. Trace optional halo only outside truthful data geometry and with clearance; none on literal color data. |
| divider / none | body `none`; transparency 0 | body `none`; transparency 0 | none. Existing structural line stays. Trace supplementary relief only; no cast, grain or glow network. |
| edge / quiet | body `none`; transparency 0; edge all/solid/plain, opacity 0.14; context outer glow strength 0.08, softness/spread 4/0px | body `none`; transparency 0; edge all/solid/plain, opacity 0.22; context outer glow strength 0.16, softness/spread 4/0px | none. This is the owner shell perimeter reference, not a second edge pass. Required control/focus/invalid edges bypass Material. Surface decorative width may disable this edge. |
| glyph / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; plain semantic ink, intrinsic media unchanged. No filters, gradients, glow or engraving inherited from the host. |
| text / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; keep font metrics, readable ink, syntax and value paint. No letterpress, blur, glow or global transparency. |
| scrim / none | body `receiver.functional-occlusion`; transparency 0 | body `receiver.functional-occlusion`; transparency 0 | none. None added material; retain existing functional occlusion/local fade and modal behavior. No independent blur, grain, gloss or new alpha. |
| row-plate / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | pending-D3-calibration; required state plate unchanged. D6: semantic hover/focus/selected plate remains intact. This preset adds no row decoration until numeric role strengths are calibrated; see 05 for style-layer intent. |

**States (only on eligible receivers):**
- **hover:** Optional halo stays at its resting value; existing state edge changes.
- **press:** Suppress the halo; active body remains immediate.
- **focus-visible:** Keep required focus; remove optional glow, gloss and reflected body overlays on the focused receiver.
- **selected-checked:** Optional static context halo may accompany an existing selected/status mark; never change core geometry.
- **open:** Resolve the opened receiver independently, one shell; preserve actual expanded state.
- **disabled:** Use existing disabled paint once and opaque body; remove optional glow/gloss/relief/grain/gradients/strokes, keep selected value.
- **invalid:** Keep danger context and combined invalid-focus geometry; suppress optional glow/gloss, reflected body overlays and decorative edge gradient.

**Fallback:** F0 from the shared contract in both modes; fixed hover ink, no optical motion, no per-row blur, no new geometry. See the shared density/radius and state rules for the effective recipe.

## Prism (`prism`)

A single restrained gradient perimeter, with an optional sparse page scene kept out of reading grounds.

**References:** [R17](evidence.md#r17), [R15](evidence.md#r15). **Transfer:** R17 supplies opaque and transparent edge techniques. Its 10px border and source colors are not defaults. R15 motivates an optional scene only; the default has no mesh/noise or animated gradient.

**Light:** A low-alpha decorative cool/warm edge around neutral opaque bodies. **Dark:** A somewhat stronger colored edge without lifting the page or coloring the ink.

| Role / cap | Light requested recipe | Dark requested recipe | Cast / context |
| --- | --- | --- | --- |
| page / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | none. Keep existing page body (near-black in dark); no self-cast, blur, transmitted page, or inherited scene. Optional artwork is a separate declared scene, off by default. |
| container / quiet | body `receiver.body`; transparency 0; edge all/gradient/plain, opacity 1; edge: linear 135° sRGB [0% accent α0.16 → 100% neutral α0.16] | body `receiver.body`; transparency 0; edge all/gradient/plain, opacity 1; edge: linear 135° sRGB [0% accent α0.22 → 100% neutral α0.22] | existing-bound-source-only; dark Card remains none. Only an actual painted shell; layout wrappers stay unpainted. Dense body is opaque Trace; perimeter can be Quiet. Respect Card/Panel or no-cast binding. |
| floating-surface / quiet | body `receiver.body`; transparency 0; edge all/gradient/plain, opacity 1; edge: linear 135° sRGB [0% accent α0.16 → 100% neutral α0.16] | body `receiver.body`; transparency 0; edge all/gradient/plain, opacity 1; edge: linear 135° sRGB [0% accent α0.22 → 100% neutral α0.22] | existing-bound-float-or-exception-source. Quiet shell, one acquisition and one existing cast owner. Tooltip reduces to Trace and its own opaque recipe. Arrow continues shell with no separate effects. |
| raised-control / trace | body `receiver.body`; transparency 0; edge all/gradient/plain, opacity 1; edge: linear 135° sRGB [0% accent α0.16 → 100% neutral α0.16] | body `receiver.body`; transparency 0; edge all/gradient/plain, opacity 1; edge: linear 135° sRGB [0% accent α0.22 → 100% neutral α0.22] | none. Quiet only for sparse actions, Trace for repeated actions; no external cast. Transparent/ghost/row controls keep their existing lack of body until state paints it. |
| recessed-field-track / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | none. Trace, opaque editing/reading center. Only local cavity; focus/invalid are separate. Track and well geometry unchanged. |
| thumb-knob / quiet | body `receiver.body`; transparency 0; edge all/gradient/plain, opacity 1; edge: linear 135° sRGB [0% accent α0.16 → 100% neutral α0.16] | body `receiver.body`; transparency 0; edge all/gradient/plain, opacity 1; edge: linear 135° sRGB [0% accent α0.22 → 100% neutral α0.22] | existing-bound-shadow-1-only. Quiet local convex cue, original dimensions/travel, Surface shadow-1 only where already bound; no independent backdrop. |
| indicator-fill / none | body `receiver.semantic-or-literal-core`; transparency 0 | body `receiver.semantic-or-literal-core`; transparency 0 | none. Semantic/literal core unchanged and opaque as already specified. Trace optional halo only outside truthful data geometry and with clearance; none on literal color data. |
| divider / none | body `none`; transparency 0 | body `none`; transparency 0 | none. Existing structural line stays. Trace supplementary relief only; no cast, grain or glow network. |
| edge / quiet | body `none`; transparency 0; edge all/gradient/plain, opacity 1; edge: linear 135° sRGB [0% accent α0.16 → 100% neutral α0.16] | body `none`; transparency 0; edge all/gradient/plain, opacity 1; edge: linear 135° sRGB [0% accent α0.22 → 100% neutral α0.22] | none. This is the owner shell perimeter reference, not a second edge pass. Required control/focus/invalid edges bypass Material. Surface decorative width may disable this edge. |
| glyph / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; plain semantic ink, intrinsic media unchanged. No filters, gradients, glow or engraving inherited from the host. |
| text / none | body `none`; transparency 0 | body `none`; transparency 0 | none. None; keep font metrics, readable ink, syntax and value paint. No letterpress, blur, glow or global transparency. |
| scrim / none | body `receiver.functional-occlusion`; transparency 0 | body `receiver.functional-occlusion`; transparency 0 | none. None added material; retain existing functional occlusion/local fade and modal behavior. No independent blur, grain, gloss or new alpha. |
| row-plate / none | body `receiver.body`; transparency 0 | body `receiver.body`; transparency 0 | pending-D3-calibration; required state plate unchanged. D6: semantic hover/focus/selected plate remains intact. This preset adds no row decoration until numeric role strengths are calibrated; see 05 for style-layer intent. |

**States (only on eligible receivers):**
- **hover:** Existing state edge/body only; gradient stops stay fixed.
- **press:** Hide optional gradient edge; active body and required edge remain.
- **focus-visible:** Keep required focus; remove optional glow, gloss and reflected body overlays on the focused receiver.
- **selected-checked:** Keep selection colors; do not recolor a progress/range core with the gradient.
- **open:** Resolve the opened receiver independently, one shell; preserve actual expanded state.
- **disabled:** Use existing disabled paint once and opaque body; remove optional glow/gloss/relief/grain/gradients/strokes, keep selected value.
- **invalid:** Keep danger context and combined invalid-focus geometry; suppress optional glow/gloss, reflected body overlays and decorative edge gradient.

**Fallback:** F0 from the shared contract in both modes; fixed hover ink, no optical motion, no per-row blur, no new geometry. See the shared density/radius and state rules for the effective recipe.
