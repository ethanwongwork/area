# Absorption and nesting policy

**Status: authored research proposal, not measured presets or owner approval.** All amounts below are ordinal design limits. They are not opacity, blur, luminance, CSS multipliers, percentage coverage, accessibility thresholds or performance measurements. Exact values remain unset until measured and reviewed. The policy uses task 01's [record and layer fields](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/layer-model.md#L17-L46), task 03's [construction crosswalk](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L5-L24), and task 04's [role/context interpretation](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/04-role-map/README.md#L22-L48).

## How much material a part takes

<!-- task19-superseded 05-absorption/policy.md ## -->
> **Superseded policy — D1, D2, D3, D6, D7, D10, D11, D12, D13, D14, D16 (owner, 2026-10-11):** Area’s calm no-cast/Trace-only expression is the None default, not a material ceiling. Contrast, focus, fixed hover ink and semantic meaning remain hard limits. Material sits beside Surface; recipe structure switches with inherited 0/1 gate tokens. Surface shadows require a pixel-identical split into adjustable parts, including Tooltip/Toolbar literal exceptions. Selector-switched recipes alone are not nested-scope safe. Ordinal caps and provisional control ranges are not limits. Numeric per-role strength multipliers and bounds must be calibrated to the board and contrast-tested at extremes; that work is pending tasks 20–22. The current vocabulary has 13 roles including row-plate; 04/05 now cover 101 contracts. Historical 12-role/78-contract counts below describe their original snapshot only. Floating shells assume arbitrary backdrops; failing edges use opaque F0. App-level transparency reduction sits beside the OS query. Forced colors explicitly sets opaque Canvas and backdrop-filter:none. The dark page may take tint/texture only within a fixed distance of #020202 (neutral 975); a numeric bound is not yet calibrated. Inner rims keep the radius floor at every setting except Sharp. Historical max(0, outer-inset) examples and tabulated square inner rims are retained but superseded. Cutout rings and fixed-color fades become real transparent gaps through masks; separately required occlusion and contrast paint remain functional. No automatic effects on glyphs or small text; display text and button labels may explicitly opt in. A curated duotone pilot is later work. Performance rules must follow measured workloads, not universal no-row-blur/static-only caps. Owner names a 60Hz minimum device; a later rerun includes Firefox. Material does not change geometry, typography or foreground ink. Multi-axis choices are bundles, not a material axis. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

The [300-cell matrix](recipes.md) gives each style/role an upper level and names its participating layer channels. An unlisted channel receives no additional style effect. The existing semantic body, ink, state and required boundaries remain even when the level is **None**.

| Level | What is admitted | What it does not authorize |
| --- | --- | --- |
| None | Existing functional paint only. For strict Flat, explicitly remove optional modeling while retaining functional paint. | Hiding a part, fading its label, removing status/focus, or inheriting decoration from the parent. |
| Trace | A subordinate local cue: a near-uniform body tint, narrow rim, shallow local relief **or** sparse static texture/halo if that row permits it. Choose one dominant cue; it must not make the part compete with its host. | New independent blur/lensing, an extra cast shadow, a glossy band through small text, or several stacked cues just because each is individually weak. |
| Quiet | Restrained role-specific body plus a contained edge/modeling treatment. A pane may use its one backdrop operation when explicitly listed. Keep a uniform reading region and suppress optional texture/reflection through dense copy. | Every possible effect at once, repeated local backdrop acquisition, inflated geometry, or strong light/dark contrast used as decoration under text. |
| Full | The named style's defining **eligible** channels on a sparse focal receiver, such as an independent shell or handle. Required geometry, Surface and semantic limits still apply. | Maximum slider values, unrestricted opacity reduction, native-platform parity, bypassing family guards, or automatically turning every child into another full material. |

These levels have a strict order, **None < Trace < Quiet < Full**, but there is no arithmetic distance between them. Reducing Quiet to Trace means removing secondary channels before merely lowering their alpha. For example, Quiet glass on a control reduces to an opaque/tinted plate or rim at Trace, not a tiny expensive blur behind each control. Grain at Trace retains one subtle static texture only where blank body area exists; it does not grain text or field values.

**How to choose a numeric value later:** take the selected style/role cell, apply all masks/caps, then measure the remaining body/edge/ink against the actual adjacent scene. Increase opacity or simplify before changing ink. Evaluate the actual composited result, as Area requires for translucent halos and syntax grounds. This report supplies no invented native opacity, shadow or glow constants. [Contrast contract](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/CONTRAST.md#L7-L17), [painted ground and fixed ink](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/CONTRAST.md#L32-L53).

## Baseline role limits

These cross-style rules accompany every cell. They are proposed policy, motivated by the existing role decomposition; the cell may be **more** restrictive.

| Role | Default interpretation of amount and coverage |
| --- | --- |
| page | One scene-scale body; no shadow or blur of itself. Decorative variation stays out of long reading regions. |
| container | Confirm that it actually paints. Large/dense body at most Trace; its perimeter at most Quiet. Layout-only groups take None. |
| floating surface | Quiet for normal reading overlays; Full only a sparse explicit optical receiver. Tooltip is Trace. One shell owns backdrop/cast; arrow continues it. |
| raised control | Quiet for a sparse ordinary action, Trace in repeated rows/toolbars. Name does not grant elevation; existing in-flow no-shadow rule remains. |
| recessed field/track | Trace for everyday editing/scale backgrounds, opaque and calm. Quiet local relief only where a deliberately modeled well has adequate blank perimeter. |
| thumb/knob | Quiet for normal small handles, Full only an explicitly chosen sparse larger receiver. Existing travel/shape/core and Surface lift remain authoritative. |
| indicator/fill | Preserve the semantic core and literal data at None. A separate enclosing rim or supplementary halo can be Trace; it cannot change perceived extent. |
| divider | Trace at most, and often None beyond baseline. Keep one continuous structural line; never a repeated glowing network. |
| edge | Quiet decorative boundary at most in ordinary UI. Full in the gradient-stroke cell means this is that primitive's primary receiver, still bounded by contextual caps. Required edges are outside the amount scale. |
| glyph | Plain action/status ink and intrinsic media at None. Trace decoration only for an explicitly designated sparse decorative symbol. |
| text | None for all UI labels, paragraphs, captions, editable values and code. Letterpress's Trace cell is restricted to explicitly designated large short display inscription; absent that metadata, use None. |
| scrim | None **additional material**. Preserve existing functional occlusion/fade; never layer a new glass/noise effect onto it just to match the shell. |

A Full primitive does not turn off safeguards. Conversely, None must not remove a functional gradient: ColorPicker hue/alpha, Calendar selection bridges and CodeBlock's readability fade retain their semantic paint. Current parts and their ownership are pinned in task 04 and the [exception evidence](family-exceptions.md).

## Resolution order

1. Resolve the task 04 part and composition binding. A co-classed root aliases its donor; a layout host or `paint: none` receives no material body. Resolve the actual native painted part where applicable.
2. Preserve body/ink/tone, required identification and state semantics. Required focus, invalid and selection are independent of optional material. Do not use the material's theme accent indiscriminately.
3. Select the style/role cell. Keep its explicit layer intent: an inset shadow used as a fill is not a cavity; a border used as a selected marker is not a decorative seam.
4. Apply role limits, [family/context guards](family-exceptions.md), nesting rules below, accessibility simplification and the owner's requested amount. The lowest permitted level wins. Channel prohibitions win even when the level is nonzero.
5. Resolve each optical channel's owner and receiver; merge compatible contributions, do not append duplicates. Choose the body paint, edge model, relief profile, texture phase and backdrop source deliberately.
6. Preserve `spatial.relationship` from task 04. A recipe may propose local `spatial.relief` without changing layout, stack order, control height, corner setting, hit target or logical travel. No cast beyond Surface's existing policy.
7. Re-derive optical colors from the **local** semantic inputs at each relevant theme/axis scope, leaving derived and paired colors unregistered. Unsupported, unsuitable or unverified optical paths resolve to readable solid/opaque paint and existing required marks.

This order is a proposal, not an implemented compiler. Area's existing reasons for these constraints are its [disjoint namespaces and derivation rule](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/DESIGN_SYSTEM.md#L20-L27), [elevation/edge hierarchy](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/DESIGN_SYSTEM.md#L156-L182), and [state/forced-color contract](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/CONTRAST.md#L55-L64).

## Nesting rules

Here an **optical group** means a proposed collection of painted parts sharing one intended backdrop acquisition/body treatment and one outer shell. It is an analysis concept, not a new DOM/CSS feature. Do not assume an ancestor's blurred pixels or unresolved color expressions are automatically available as a child material input. Task 03 separates [backdrop acquisition](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L135-L148) from [local color derivation](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L178-L196).

| Parent → child context | Proposed compositing decision | Amount / depth consequence |
| --- | --- | --- |
| Glass → glass within the same panel | Outer shell acquires the backdrop. Child uses opaque/near-opaque tint or a quiet rim; suppress its independent blur/lens/noise stack. Do not keep multiplying alpha along a long ancestry. | Child at most Trace unless it is a genuinely distinct overlay. Child retains its existing flush/raised role, not another floating plane. |
| Glass panel → separate opened glass Popover/Menu | The new overlay is a new optical group, using the actual available composed backdrop—not a fictional pristine source behind every ancestor. Preserve clear shell separation. If layered optical behavior cannot be verified, make the child opaque. | Reading overlay Quiet; no simultaneous Full-on-Full assumption. Same semantic ink and functional scrim rules. |
| Glass → editable field/code/table reading well | Use an opaque calm reading ground inside the pane. Keep the exterior pane character at its boundary. | Well body Trace/None by guard; no second blur, no refraction through values. |
| Opaque raised housing → recessed field/track | Recess is relative to immediate housing body. Share its key light, use local inward occlusion, and keep the center stable. Do not darken every descendant recursively. | Track/well remains flush in structure; proposed local cavity changes relief only. No external cast from the recess. |
| Recessed track → raised thumb/knob | Handle has its own body/edge and permitted `shadow-1`; it receives the same light rig but opposite convex profile. Track's selected fill stays flat and exact. | Quiet normal thumb; no change to travel or hit box. Preserve focus outside decorative clipping. |
| Raised container → raised child | Parent cast falls on its parent; child cast, if already permitted, falls on the immediate receiving surface. Inner joined controls do not inherit every ancestor's shadow list. | Prefer Trace child plate. Surface policy decides whether any cast is allowed; stack depth is not inferred by adding blur radii. |
| Flat Surface → neumorphic/clay/drop-shadow recipe | Do not add a substitute external relief/shadow to bypass Flat. Keep allowed body/inset/rim cues, or mark the requested full extrusion incompatible. | Constrained approximation or plain fallback; no claim that the classic extruded recipe survives unchanged. |
| Mica-like foundation → glass overlay | Stable opaque foundation remains opaque. Only overlay is a new local-source optical group; never expose imagined OS wallpaper through it. | Quiet overlay by default; foundation tint does not authorize a wallpaper sampler. |
| Shared InputGroup / joined controls → segments | Outer composition owns body/edge; use documented internal seam once. Child donor shell is suppressed, not reapplied by its material role. | Segments Trace at most, no local cast/filter. Recess belongs to the group if chosen. |
| Shell → arrow / attached edge | Continue the same body's coordinates, tint and edge profile across the join. Arrow has no separate backdrop, shadow or grain phase. Avoid a doubled seam at the attachment. | Arrow flush to shell; its floating-surface role does not make it a second floating plane. |
| Textured/gradient surface → repeated rows/tiles | One stable texture/paint coordinate space on shell; do not restart a strong pattern or new seed on every row. State plates mask or supersede it locally. | Row Trace/None; dense reading region opaque. No repeating highlight stripes competing with text. |
| Dark host → modeled child | Preserve near-black ground and existing dark surface hierarchy. Use low-contrast intrinsic cues; avoid white outer relief lobes or automatic light-mode shadow inversion. | Reduce modeled channels before lifting page luminance. Dark Card halo remains off. |
| Portal/top-layer surface → nested theme | Supply the intended local theme/material inputs explicitly, then re-derive. Do not assume the trigger's ancestor scope will match its overlay's rendered ancestry. | Same role and guarded amount, locally correct semantic paint; scope behavior needs later implementation tests. |
| Media → scrim → text/controls | Preserve media pixels, use the existing functional scrim for readability, then plain ink/controls. Do not tint the media through the glyph role. | Scrim takes no extra material; text None; actions Trace. |
| Modal shell → scrim → page | Scrim is a separate functional receiver behind the shell, not a full-material parent of the dialog content. Do not compound blur/grain on page, scrim and panel. | One scrim per actual modal boundary; modeless surfaces do not acquire one. |

All nesting entries are proposed decisions. Concrete existing reasons are [plain Calendar in DatePicker](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/DatePicker.tsx#L119-L140), [stripped InputGroup child chrome](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L57-L92), [Popover arrow/body](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1018-L1032), [SliderRange shared rail](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L108-L146), and [near-black/dark-halo policy](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/DESIGN_SYSTEM.md#L272-L278). No nesting frame-time or cross-browser guarantee was measured.

## Combining styles without accumulating paint

The entries in 01 are not mutually exclusive presets. Paper can combine with grain, glass with a gradient rim, and a semantic indicator with glow. Resolve by channel:

| Channel | Composition policy |
| --- | --- |
| `body.paints`, transmission, backdrop source/mapping | Select an ordered body recipe and one acquisition owner per optical group. A second style explicitly replaces/adds a paint with a named mask; it does not silently multiply group opacity or duplicate the scene. |
| `edges`, reflection | One perimeter owner. Gradient stroke modifies that owner's paint; bevel changes its local profile. Required focus/state edges stay separate. Do not append another full border just because two styles mention rims. |
| `shading.inset`, `spatial.relief` | Choose convex, concave or flush intent per local part; resolve contradictory profiles before rendering. A recessed field in a raised parent is valid because the receivers differ. |
| `shading.cast` | One existing Surface policy. Drop-shadow recipe selects that policy's receiver; it does not add a second ladder or bypass `none`. |
| `emission` | Name the semantic/decorative emitter and bound its halo. Neon plus outer-glow describes one emission treatment, not two independent blooms. Focus remains independent. |
| `texture` | One intentional pattern/seed/phase per shared physical surface. Acrylic plus grain refines the same texture layer; do not double the noise. |
| `content.ink`, decoration | Semantic ink always retained. The strictest content guard wins; letterpress plus neon is not an automatic stacked treatment for small UI text. |
| `illumination`, adaptation | Share one key-light convention across modeled parent/child parts. Reflections and emission are separate inputs. No automatic reflective animation, changed hover ink or motion beyond existing policy. |

## Worked resolutions from the common rules

These are **applications of the role recipe and guards**, not independent family styles.

| Requested look and context | Resolution |
| --- | --- |
| Glassmorphism Table inside a glass Panel | Outer Panel is one Quiet glass group. TableWrapper/reading ground stays opaque and flush; rows use None beyond existing flat state plates; text None; structural rules unchanged. No blur per row. |
| Grain + paper CodeBlock | Optional shell/frame texture is Trace outside the code well; code background and syntax/diff/target paint remain unchanged; no grain across glyphs. Surface alone decides outer cast. |
| Aqua Calendar inside DatePicker | Popover owns the Quiet shell. Plain Calendar adds no shell; days capped Trace with no gloss band across numbers; connected range/today/marker semantics win. Navigation buttons may take Trace perimeter/body cue. |
| Neumorphic Slider in raised Panel | Panel's existing elevation stays; rail receives at most Trace local cavity cue, selected fill exact; thumb Quiet convex cue plus permitted lift. No extra bright outer lobe on dark ground. |
| Liquid-glass Message list with Composer | Conversation guard removes lensing/reflection from prose/bubble/input. A separate toolbar or model menu can retain a guarded optical shell; message actions remain Trace and text None. |
| Neon status Indicator beside a label | Opaque semantic core plus at most Trace supplementary halo where space permits; label None. Forced colors removes decorative glow but retains the status mark. |
| Letterpress dense inspector | All labels/values are ordinary UI text, so Trace inscription cell resolves to None. A separately designated large short display inscription could be reviewed later. |

## Fallback and verification boundary

The calm fallback is the **existing Area semantic paint**, required edges and supported native parts, with optional material channels removed. A translucency failure chooses opaque body before removing a required edge; a texture/halo/lens failure removes the effect, not its semantic core. Preserve force-color state rules and motion meaning; an opaque/no-effect result can be intentional absorption, not a rendering error. Task 03's [support and verification limitations](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/README.md#L3-L19) remain in force and are not refreshed by this report.

Task 05 does not specify production numbers or claim these proposals pass rendered contrast/performance. Later checks need worst-case backdrop and nesting, light/dark and compact/default, selected+focus+invalid combinations, native fallback, long text/code, clipped bloom and actual keyboard focus. Task 08 owns accessibility verification; 09 dark/density tuning; 11 performance; 12 glyph/text treatment. Nothing here weakens current contrast tests or makes a component owner-approved.

## Task 19: corrected defaults and ownership

Drawer is **modal by default**, with `modal=false` for modeless presentation. [API and default](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/react/src/components/Drawer.tsx#L20-L55). The scrim is functional paint; an absorption cap must not remove it.

Surface owns its declared shadow token namespace; it does **not** own every current CSS shadow. Tooltip's literal shadow and Toolbar's surface shadow remain exceptions; D2 brings them under Surface through a pixel-identical refactor. The refreshed guard table also treats BoardCard's literal stack as existing paint, not an assertion of universal Surface ownership. [Surface namespace](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/tokens/src/axes/surface.ts#L21-L39), [BoardCard](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/board.css#L114-L128). No package changes are made here.

D6 state plates are single receivers: preserve required hover/keyboard/selection paint before optional material. D3's numeric role multiplier is explicitly `null`/pending in the research records. None/Trace/Quiet/Full labels below/elsewhere are historical proposals; they no longer block board items 3, 5, 6 or 16 by policy. Hard contrast/focus/semantic checks still apply.

The current literal exceptions are pinned at [Toolbar shadow](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/toolbar.css#L31-L36) and [Tooltip shadow](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1380-L1389). D2 authorizes their later migration; this research changes neither.
