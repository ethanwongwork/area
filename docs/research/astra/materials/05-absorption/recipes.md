# Style × role absorption recipes

**All 300 cells are authored proposals, not captured recipes or native platform constants.** Read [amounts, resolution and nesting](policy.md) first. None removes added style, not required paint. Explicit family/context limits in [the exception ledger](family-exceptions.md) override the amount and channels here. Each row changes only the named layer channels; semantic ink, existing state and required boundaries are protected in every row.

The source links establish the style vocabulary, available techniques and their limitations. They do not empirically validate these proposed role assignments or amounts. Definitions/public-source access dates remain those in task 01; no external compatibility update is claimed.

## Coverage and amount overview

N = None · T = Trace · Q = Quiet · F = Full. These are ordinal caps, never opacity percentages.

| Style | page | container | floating surface | raised control | recessed field/track | thumb/knob | indicator/fill | divider | edge | glyph | text | scrim |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [Flat](#flat) | N | N | N | N | N | N | N | N | N | N | N | N |
| [Material / paper](#paper) | T | Q | F | T | T | Q | T | T | T | N | N | N |
| [Transparency](#transparency) | N | Q | Q | T | N | T | N | N | T | N | N | N |
| [Glassmorphism](#glassmorphism) | N | Q | F | T | T | Q | T | T | Q | N | N | N |
| [Acrylic (Fluent)](#acrylic) | N | T | F | T | N | T | N | T | T | N | N | N |
| [Mica](#mica) | F | Q | T | T | T | T | N | T | T | N | N | N |
| [Liquid Glass (Apple, 2025)](#liquid-glass) | N | T | F | Q | T | F | T | T | Q | N | N | N |
| [Neumorphism](#neumorphism) | T | Q | Q | Q | Q | F | T | T | Q | N | N | N |
| [Claymorphism](#claymorphism) | T | Q | Q | Q | T | F | T | T | Q | N | N | N |
| [Skeuomorphism](#skeuomorphism) | Q | Q | Q | Q | Q | F | T | T | Q | T | N | N |
| [Aqua](#aqua) | T | T | Q | Q | T | F | T | T | Q | N | N | N |
| [Frutiger Aero](#frutiger-aero) | Q | T | Q | Q | T | Q | T | T | Q | N | N | N |
| [Glow / neon](#glow-neon) | T | T | Q | T | N | Q | Q | N | Q | T | N | N |
| [Gradient fill — linear](#linear-gradient) | Q | T | Q | Q | T | Q | T | N | N | N | N | N |
| [Gradient fill — radial](#radial-gradient) | Q | T | Q | T | N | Q | T | N | N | N | N | N |
| [Gradient fill — conic](#conic-gradient) | T | N | T | T | N | Q | N | N | T | N | N | N |
| [Gradient fill — mesh](#mesh-gradient) | Q | T | T | T | N | T | N | N | N | N | N | N |
| [Gradient stroke](#gradient-stroke) | N | T | Q | T | T | Q | T | T | F | N | N | N |
| [Inner shadow](#inner-shadow) | N | T | N | T | Q | T | N | T | T | N | N | N |
| [Inner glow](#inner-glow) | N | T | Q | T | N | Q | T | N | Q | N | N | N |
| [Outer glow](#outer-glow) | N | T | Q | T | N | Q | Q | N | T | T | N | N |
| [Drop shadow](#drop-shadow) | N | T | F | N | N | Q | N | N | N | N | N | N |
| [Bevel / emboss](#bevel-emboss) | N | T | T | Q | Q | F | T | T | Q | T | N | N |
| [Letterpress](#letterpress) | N | N | N | N | N | N | N | N | N | T | T | N |
| [Grain](#grain) | Q | T | T | T | N | T | N | N | N | N | N | N |

## Layer channel names

Use the exact fields from 01. `filters` must name its target (backdrop, body, emission or texture); no row filters the content group. `spatial.relief` is local modeling, while task 04’s parent relationship remains unchanged. `illumination` is a shared rig when modeling is used, not an instruction to rotate every gradient or halo.

<a id="flat"></a>
## Flat

**Kind:** visual language. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L9-L19).
**Construction basis:** [T01](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L26-L41), [T07](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L106-L134). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Strict-flat suppresses optional modeled relief; it does not erase required focus, state or scrims. Pair with Surface Flat; otherwise call the result flat-inspired, not strict flat.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | None | `body.paints` | Uniform opaque page; remove decorative spatial variation. |
| container | None | `body.paints` | Single neutral backing when one exists; layout wrappers remain unpainted. |
| floating surface | None | `body.paints`, `edges` | Opaque surface and required separation edge; strict-flat mode requests Surface Flat, never secretly adds lift. |
| raised control | None | `body.paints` | Existing action/selection fill; no gloss, bevel or added cast. |
| recessed field/track | None | `body.paints` | Uniform readable receptacle; identification edge stays intact, no modeled cavity. |
| thumb/knob | None | `body.paints`, `edges` | Solid distinguishable handle and edge; shape/position carry movement without relief. |
| indicator/fill | None | `body.paints` | Preserve semantic fill, selected marks and visible extent; no decorative modulation. |
| divider | None | `edges` | Keep existing solid structural rule. |
| edge | None | `edges` | Solid required boundary/focus; no decorative rim. |
| glyph | None | `content.ink` | Plain semantic glyph ink; intrinsic media unchanged. |
| text | None | `content.ink` | Plain readable ink, including placeholders and code. |
| scrim | None | `body.paints` | Preserve functional scrim; flat does not remove modal occlusion. |

<a id="paper"></a>
## Material / paper

**Kind:** material recipe + design language. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L20-L30).
**Construction basis:** [T01](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L26-L41), [T02](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L42-L55). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Paper here is the opaque sheet model from 01, not a full Material Design component system. Grain is not automatic. Surface can remove all cast while body remains paper-like.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | Trace | `body.paints` | Opaque ground sheet; no compulsory grain or shadow on the page itself. |
| container | Quiet | `body.paints`, `shading.cast` | Opaque sheet backing; cast only for an already elevated receiver under Surface policy. |
| floating surface | Full | `body.paints`, `shading.cast`, `edges` | Opaque independent sheet with one permitted cast and separation edge; keep interior matte. |
| raised control | Trace | `body.paints`, `edges` | Matte command paint; no new cast on in-flow controls merely to suggest paper. |
| recessed field/track | Trace | `body.paints`, `edges` | Quiet inset-color region or outlined opening; do not invent a carved paper cavity. |
| thumb/knob | Quiet | `body.paints`, `shading.cast` | Opaque small handle; retain only its existing permitted lift. |
| indicator/fill | Trace | `body.paints` | Printed semantic color/mark; keep progress extent exact and sample colors literal. |
| divider | Trace | `edges` | Single ink rule, no engraving or double shadow. |
| edge | Trace | `edges` | Quiet solid sheet boundary; focus remains separate. |
| glyph | None | `content.ink` | Printed glyph ink; no paper texture inside glyphs. |
| text | None | `content.ink` | Printed readable ink without text shadow. |
| scrim | None | `body.paints` | Existing neutral modal veil, independent of paper shade. |

<a id="transparency"></a>
## Transparency

**Kind:** optical property. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L31-L41).
**Construction basis:** [T08](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L135-L149), [T11](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L178-L197). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Proposed role translation of the named layer only. Preserve semantic paint, current geometry and Surface; remove optional treatment when a guard or fallback requires it.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | None | `body.paints` | Retain opaque scene ground; there is no useful lower page receiver to expose by default. |
| container | Quiet | `body.paints`, `body.transmission`, `backdrop.source` | Translucent body only over an identified stable scene; increase opacity beneath dense content. |
| floating surface | Quiet | `body.paints`, `body.transmission`, `backdrop.source`, `edges` | Translucent shell with bounded backdrop participation; use an opaque reading well when the scene is busy. |
| raised control | Trace | `body.paints`, `body.transmission` | Near-opaque control body; preserve local state differences, no group opacity. |
| recessed field/track | None | `body.paints` | Opaque editable well and rail ground; text-entry contrast wins over seeing through. |
| thumb/knob | Trace | `body.paints`, `body.transmission`, `edges` | Light body transmission only where the handle remains distinct over every track position. |
| indicator/fill | None | `body.paints` | Preserve semantic opacity and extent; never make progress or status less definite to match the shell. |
| divider | None | `edges` | Keep structural rule independent of ancestor body alpha. |
| edge | Trace | `edges` | Optional alpha on decorative rim only; required boundaries remain independently visible. |
| glyph | None | `content.ink` | Opaque semantic glyph; intrinsic media retains authored alpha only. |
| text | None | `content.ink` | Opaque ink; transmission never applies to the content group. |
| scrim | None | `body.paints` | Preserve the existing scrim's functional alpha; do not multiply it by material transmission. |

<a id="glassmorphism"></a>
## Glassmorphism

**Kind:** material recipe umbrella. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L42-L52).
**Construction basis:** [T08](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L135-L149), [T04](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L67-L80), [T07](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L106-L134). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Proposed role translation of the named layer only. Preserve semantic paint, current geometry and Surface; remove optional treatment when a guard or fallback requires it.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | None | `body.paints` | Keep opaque source scene; do not frost the entire root as its own backdrop. |
| container | Quiet | `body.paints`, `body.transmission`, `backdrop.source`, `filters`, `edges` | One frosted pane body with restrained rim; inner text region resolves to a calm ground. |
| floating surface | Full | `body.paints`, `body.transmission`, `backdrop.source`, `filters`, `edges`, `reflection`, `shading.cast` | Main glass receiver: frost/tint plus restrained optical rim, existing float cast only; suppress gloss across text. |
| raised control | Trace | `body.paints`, `edges` | Tinted near-opaque plate or small rim; borrow the pane's character without a new blur per control. |
| recessed field/track | Trace | `body.paints`, `edges` | Opaque/near-opaque well with quiet edge; no live blur behind editable ink or scale marks. |
| thumb/knob | Quiet | `body.paints`, `edges`, `reflection`, `shading.cast` | Small glass-like solid handle, local highlight and existing lift; default does not reacquire backdrop. |
| indicator/fill | Trace | `edges` | Retain solid semantic core; at most a decorative enclosing rim, never a tinted color sample. |
| divider | Trace | `edges` | Single subdued seam integrated with pane; no duplicate bright/dark grooves. |
| edge | Quiet | `edges`, `reflection` | Gradient/alpha rim on the existing silhouette; independent required focus outside it. |
| glyph | None | `content.ink` | Crisp unfiltered glyphs and unchanged media. |
| text | None | `content.ink` | Unfiltered semantic ink over a validated reading ground. |
| scrim | None | `body.paints` | Existing scrim, not another frost pane. |

<a id="acrylic"></a>
## Acrylic (Fluent)

**Kind:** vendor material recipe. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L53-L63).
**Construction basis:** [T08](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L135-L149), [T01](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L26-L41), [T05](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L81-L92). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Native exclusion/tint/noise structure motivates the proposal; native constants, OS source acquisition and performance/adaptation parity are not supplied. Web result is a local-source approximation.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | None | `body.paints` | Opaque neutral scene foundation; do not claim behind-window acrylic from webpage pixels. |
| container | Trace | `body.paints` | Tint-related opaque backing by default; reserve the full translucent brush for appropriate overlay context. |
| floating surface | Full | `body.paints`, `body.transmission`, `backdrop.source`, `filters`, `texture` | Local-source acrylic approximation: backdrop treatment, tint/blend and static fine texture; one receiver per surface. |
| raised control | Trace | `body.paints` | Quiet opaque tint belonging to the same family; no per-button blur/noise stack. |
| recessed field/track | None | `body.paints` | Opaque reading/editing well; semantic edge and input ink unchanged. |
| thumb/knob | Trace | `body.paints`, `edges` | Solid tinted handle with existing separation; no noise that erodes its small outline. |
| indicator/fill | None | `body.paints` | Preserve semantic cores and literal color data. |
| divider | Trace | `edges` | Subdued seam through the tinted shell; no luminous separator. |
| edge | Trace | `edges` | Quiet existing rim; no invented glass lens or bevel required by this recipe. |
| glyph | None | `content.ink` | Unfiltered semantic glyph; no noise mask on ink. |
| text | None | `content.ink` | Readable opaque ink; exclude texture from text decoration. |
| scrim | None | `body.paints` | Functional neutral scrim; never a second full acrylic layer. |

<a id="mica"></a>
## Mica

**Kind:** vendor material recipe. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L64-L74).
**Construction basis:** [T01](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L26-L41). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Opaque theme/owned-reference approximation only. Ordinary CSS in 03 does not supply OS wallpaper acquisition. Never substitute live backdrop blur and call it Mica.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | Full | `body.paints` | Opaque, stable theme-informed scene tint; an explicit owned reference can inform it, never live transparency. |
| container | Quiet | `body.paints` | Opaque tonal relation to the foundation; no repeated wallpaper sampling in each container. |
| floating surface | Trace | `body.paints`, `edges` | Opaque surface from the same tone family plus existing floating separation; Mica does not require live blur. |
| raised control | Trace | `body.paints` | Solid local body tint only; action/tone ownership remains authoritative. |
| recessed field/track | Trace | `body.paints` | Uniform opaque well against the foundation; no wallpaper detail beneath input text. |
| thumb/knob | Trace | `body.paints` | Opaque handle body; retain existing lift, add no Mica-specific lens. |
| indicator/fill | None | `body.paints` | Existing semantic paint and literal values. |
| divider | Trace | `edges` | Single tonal seam between opaque layers. |
| edge | Trace | `edges` | Preserve ordinary component boundaries; no gloss rim inferred. |
| glyph | None | `content.ink` | Plain semantic ink, no wallpaper modulation. |
| text | None | `content.ink` | Plain ink on stable opaque ground. |
| scrim | None | `body.paints` | Existing modal veil; no wallpaper-tinted full-screen material layer. |

<a id="liquid-glass"></a>
## Liquid Glass (Apple, 2025)

**Kind:** vendor material + behavior system. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L75-L85).
**Construction basis:** [T08](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L135-L149), [T09](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L150-L166), [T04](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L67-L80), [T07](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L106-L134). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Web translation, not Apple parity. Keep Area hover ink fixed; native environmental adaptation/morphing is not implemented. Owned-source displacement is optional, and arbitrary-page lensing remains unverified in 03.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | None | `body.paints` | Opaque content scene; reserve the material vocabulary for navigation/controls above it. |
| container | Trace | `body.paints` | Calm content backing; persistent reading containers do not become independently refracting lenses. |
| floating surface | Full | `body.paints`, `body.transmission`, `backdrop.source`, `backdrop.mapping`, `filters`, `edges`, `reflection`, `shading.cast` | Isolated navigation/overlay lens with bounded rim reflection and optional owned-source mapping; opaque fallback mandatory. |
| raised control | Quiet | `body.paints`, `edges`, `reflection` | Compact glass-like plate and reflection outside label area; no automatic lensing of live page content. |
| recessed field/track | Trace | `body.paints`, `edges` | Stable reading well with restrained rim; no warping under caret, value or marks. |
| thumb/knob | Full | `body.paints`, `body.transmission`, `backdrop.source`, `backdrop.mapping`, `filters`, `edges`, `reflection`, `shading.cast` | Small optical handle with coherent highlight; owned-source lensing is optional and separately gated, never applied to its label. |
| indicator/fill | Trace | `edges` | Keep semantic core/extent solid; allow a local optical rim only when it cannot imply a changed value. |
| divider | Trace | `edges` | Quiet seam; no morphing/refraction on structural rules. |
| edge | Quiet | `edges`, `reflection` | Optical silhouette/reflective rim; keep focus and invalid edges independently legible. |
| glyph | None | `content.ink` | Crisp semantic glyph; native adaptive ink is not copied into hover recoloring. |
| text | None | `content.ink` | Stable Area ink; solve backdrop legibility through the body, not text filtering or automatic foreground animation. |
| scrim | None | `body.paints` | Functional neutral dimming; do not label a blurred scrim native Liquid Glass. |

<a id="neumorphism"></a>
## Neumorphism

**Kind:** material recipe. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L86-L96).
**Construction basis:** [T02](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L42-L55), [T04](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L67-L80), [T12](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L198-L203). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Classic paired external light/dark lobes conflict with current in-flow no-shadow and dark-halo policy. This proposal uses constrained intrinsic modeling; full classic extrusion needs a later explicit Surface contract decision.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | Trace | `body.paints` | Opaque shared ground establishes relief reference; dark mode keeps near-black policy. |
| container | Quiet | `body.paints`, `shading.inset`, `reflection`, `spatial.relief` | Same-ground local modeling on real painted container only; large reading regions stay flat. |
| floating surface | Quiet | `body.paints`, `edges`, `shading.cast` | Independent overlay separation takes precedence over same-ground illusion; permitted Surface lift, no extra light outer lobe. |
| raised control | Quiet | `body.paints`, `shading.inset`, `reflection`, `spatial.relief` | Low intrinsic relief and opposite highlight/shade; in-flow cast remains off, which deliberately softens the classic effect. |
| recessed field/track | Quiet | `body.paints`, `shading.inset`, `reflection`, `spatial.relief` | Shallow cavity relative to immediate parent; shade only near perimeter, keep readable center uniform. |
| thumb/knob | Full | `body.paints`, `shading.inset`, `reflection`, `shading.cast`, `spatial.relief` | Convex same-ground handle with clear edge and allowed thumb lift; never identify it by shading alone. |
| indicator/fill | Trace | `body.paints` | Solid semantic core over quiet relief; no relief per tick or progress pixel. |
| divider | Trace | `edges`, `shading.inset` | Optional shallow engraved seam; replace rather than add a second structural rule. |
| edge | Quiet | `edges`, `reflection`, `shading.inset` | Modeled local rim with a separate required boundary; do not confuse soft shading with focus. |
| glyph | None | `content.ink` | Plain glyph ink, not automatically embossed with the body. |
| text | None | `content.ink` | Plain text; small labels must not acquire doubled relief edges. |
| scrim | None | `body.paints` | Neutral scrim separates the floating layer; no embossed full-screen veil. |

<a id="claymorphism"></a>
## Claymorphism

**Kind:** material recipe. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L97-L107).
**Construction basis:** [T02](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L42-L55), [T04](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L67-L80), [T10](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L167-L177). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Keep Area corner/size geometry. Full inflated geometry and extra cast would require a separate approved geometry/elevation change; this is a constrained paint translation.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | Trace | `body.paints` | Opaque calm stage; page itself is not a balloon. |
| container | Quiet | `body.paints`, `shading.inset`, `reflection`, `spatial.relief` | Broad soft inner modeling at perimeter of painted shell, quiet center; existing corners stay unchanged. |
| floating surface | Quiet | `body.paints`, `shading.inset`, `reflection`, `shading.cast`, `spatial.relief` | Soft opaque body plus one allowed float cast; contain doming away from dense copy. |
| raised control | Quiet | `body.paints`, `shading.inset`, `reflection`, `spatial.relief` | Colored modeled plate preserving action/tone; no inflated geometry, layout growth or new in-flow shadow. |
| recessed field/track | Trace | `body.paints`, `shading.inset` | Quiet shallow well; avoid puffing input surfaces into competing buttons. |
| thumb/knob | Full | `body.paints`, `shading.inset`, `reflection`, `shading.cast`, `spatial.relief` | Convex handle is the strongest local modeling receiver; retain exact travel geometry and allowed lift. |
| indicator/fill | Trace | `body.paints` | Flat solid semantic fill inside body; no domed progress bands or changing swatch values. |
| divider | Trace | `edges` | Simple seam; clay modeling does not turn every rule into a tube. |
| edge | Quiet | `edges`, `reflection`, `shading.inset` | Soft modeled edge constrained to existing silhouette; required boundary stays crisp. |
| glyph | None | `content.ink` | Plain glyphs or preserved media, no inflated stroke treatment. |
| text | None | `content.ink` | Plain semantic ink on a uniform center. |
| scrim | None | `body.paints` | Existing scrim; no colored clay fog. |

<a id="skeuomorphism"></a>
## Skeuomorphism

**Kind:** metaphor / visual language. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L108-L118).
**Construction basis:** [T01](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L26-L41), [T02](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L42-L55), [T04](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L67-L80), [T05](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L81-L92), [T06](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L93-L105). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Under-specified until a referent is chosen. The matrix supplies common responsibilities, not a universal physical-object recipe. Missing referent resolves to plain, not invented textures.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | Quiet | `body.paints`, `texture` | Choose one declared physical scene/referent; keep its texture outside reading regions. Without a referent use plain ground. |
| container | Quiet | `body.paints`, `edges`, `shading.inset`, `reflection`, `texture` | Choose a referent-consistent housing or sheet, with texture/relief limited to its perimeter; do not mix unrelated objects by family. |
| floating surface | Quiet | `body.paints`, `edges`, `shading.cast` | Separate panel of the same declared scene; normal overlay semantics and permitted elevation remain. |
| raised control | Quiet | `body.paints`, `edges`, `shading.inset`, `reflection`, `spatial.relief` | Translate command plate as a key or switch face only when that metaphor fits interaction; never invent hardware behavior. |
| recessed field/track | Quiet | `body.paints`, `shading.inset`, `spatial.relief` | Readable inset well in the same housing; printed scales and values stay unmodeled. |
| thumb/knob | Full | `body.paints`, `edges`, `shading.inset`, `reflection`, `shading.cast`, `spatial.relief` | Knob/handle can carry the strongest declared object cue; no change to range or hit geometry. |
| indicator/fill | Trace | `body.paints` | Printed or luminous semantic mark selected by the referent; no arbitrary new status vocabulary. |
| divider | Trace | `edges` | A seam belonging to the housing, not a decorative fastener on every row. |
| edge | Quiet | `edges`, `reflection`, `shading.inset` | Consistent edge profile and light rig; do not combine wood, chrome and rubber rims accidentally. |
| glyph | Trace | `content.decoration` | Optional simple inscription cue on sparse decorative glyphs; action icons remain recognizable and data/media unchanged. |
| text | None | `content.ink` | Plain UI ink; optional display inscription requires a separate content-specific exception. |
| scrim | None | `body.paints` | Functional neutral veil; do not simulate a physical curtain by default. |

<a id="aqua"></a>
## Aqua

**Kind:** historical visual language. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L119-L129).
**Construction basis:** [T01](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L26-L41), [T04](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L67-L80), [T07](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L106-L134). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Aqua-inspired paint, not historical reproduction. Exact native gloss geometry was not specified in 01; all proposed ramps/rims here are authored synthesis, no platform constants.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | Trace | `body.paints` | Calm opaque ground; no imposed historical wallpaper or stripes. |
| container | Trace | `body.paints`, `edges` | Neutral content body and quiet outline; reserve conspicuous luminosity for controls/chrome. |
| floating surface | Quiet | `body.paints`, `edges`, `reflection`, `shading.cast` | Subtle luminous shell rim with normal float separation; avoid a gloss stripe crossing copy. |
| raised control | Quiet | `body.paints`, `reflection`, `edges` | Luminous vertical body ramp and contained gloss on eligible command plates; retain action color and current corners. |
| recessed field/track | Trace | `body.paints`, `edges` | Uniform light/dark well with restrained edge; no candy stripe behind typing. |
| thumb/knob | Full | `body.paints`, `reflection`, `edges`, `shading.cast` | Small luminous rounded handle is the strongest receiver; geometry still comes from Area. |
| indicator/fill | Trace | `body.paints`, `reflection` | Semantic fill can take a restrained highlight only when it does not distort state or quantitative extent. |
| divider | Trace | `edges` | Quiet single rule; no gloss tube. |
| edge | Quiet | `edges`, `reflection` | Narrow luminous rim on decorative boundary; focus is not the rim. |
| glyph | None | `content.ink` | Crisp glyphs, no mandatory historical icon replacement. |
| text | None | `content.ink` | Plain Area typography, not a claim to reproduce historical Aqua text rendering. |
| scrim | None | `body.paints` | Existing neutral scrim. |

<a id="frutiger-aero"></a>
## Frutiger Aero

**Kind:** retrospective visual language. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L130-L140).
**Construction basis:** [T01](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L26-L41), [T04](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L67-L80), [T08](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L135-L149). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Paint subset of a broader art direction; do not silently change fonts, imagery, icons or behavior to claim the full historical language.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | Quiet | `body.paints` | Owned atmospheric gradient/imagery may frame the scene; keep reading regions on calm opaque ground. |
| container | Trace | `body.paints`, `edges` | Near-opaque content sheet related to scene colors; do not turn each card into an illustration. |
| floating surface | Quiet | `body.paints`, `body.transmission`, `backdrop.source`, `filters`, `edges`, `reflection` | Restrained glass-like chrome around a stable reading center; acquire one identified local backdrop only. |
| raised control | Quiet | `body.paints`, `reflection`, `edges` | Selective glossy plate in existing action/tone family, without adding new illustrative symbols. |
| recessed field/track | Trace | `body.paints`, `edges` | Uniform opaque well; no sky/cloud imagery behind values. |
| thumb/knob | Quiet | `body.paints`, `reflection`, `edges`, `shading.cast` | Glossy small handle with existing lift; no photographic texture at thumb scale. |
| indicator/fill | Trace | `edges` | Preserve literal core and meaning; optional outline links it to scene, not a new rainbow palette. |
| divider | Trace | `edges` | Quiet structural seam. |
| edge | Quiet | `edges`, `reflection` | Glossy rim limited to actual boundary, not halo around every row. |
| glyph | None | `content.ink` | Keep existing glyph geometry and media; the role recipe does not supply a replacement icon language. |
| text | None | `content.ink` | Plain Area ink/type; humanist historical art direction is outside this paint proposal. |
| scrim | None | `body.paints` | Neutral functional scrim, not atmospheric imagery. |

<a id="glow-neon"></a>
## Glow / neon

**Kind:** emissive style recipe. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L141-L151).
**Construction basis:** [T03](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L56-L66), [T06](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L93-L105). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Proposed role translation of the named layer only. Preserve semantic paint, current geometry and Surface; remove optional treatment when a guard or fallback requires it.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | Trace | `body.paints` | Quiet opaque stage; no full-page bloom or compulsory black override of theme. |
| container | Trace | `edges` | At most a restrained boundary cue on a sparse shell; no ambient glow carpet behind copy. |
| floating surface | Quiet | `edges`, `emission` | Local rim emission around an otherwise stable shell; preserve ordinary float cast and independent required border. |
| raised control | Trace | `edges`, `emission` | Sparse command outline may emit gently; baseline fill and label stay stable across hover. |
| recessed field/track | None | `body.paints` | Opaque nonemissive well/track; avoid luminous troughs around every field. |
| thumb/knob | Quiet | `edges`, `emission` | Small handle rim/core can emit with bounded halo; position and required edge remain exact. |
| indicator/fill | Quiet | `emission` | Selected/status core emits in its existing semantic color; halo is supplementary, not value extent or selection proof. |
| divider | None | `edges` | Keep a plain rule; repeated glowing separators create competing luminous regions. |
| edge | Quiet | `edges`, `emission` | One decorative luminous rim, distinct from focus; do not reuse focus color as persistent decoration. |
| glyph | Trace | `content.decoration`, `emission` | Optional sparse decorative symbol bloom; action/status core remains plain, media excluded. |
| text | None | `content.ink` | Plain reading text; glowing display lettering is not the default role recipe. |
| scrim | None | `body.paints` | Neutral scrim does not radiate. |

<a id="linear-gradient"></a>
## Gradient fill — linear

**Kind:** paint primitive. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L152-L162).
**Construction basis:** [T01](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L26-L41). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Proposed role translation of the named layer only. Preserve semantic paint, current geometry and Surface; remove optional treatment when a guard or fallback requires it.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | Quiet | `body.paints` | Broad low-frequency linear field; keep text-bearing zone contrast stable. |
| container | Trace | `body.paints` | Near-uniform tonal ramp on painted backing, not on layout wrappers. |
| floating surface | Quiet | `body.paints` | Subtle shell ramp with calm center; preserve float shadow independently. |
| raised control | Quiet | `body.paints` | Semantic-tone ramp on an eligible plate; no abrupt stop under a label. |
| recessed field/track | Trace | `body.paints` | Near-uniform well; no apparent fill level created by the decorative ramp. |
| thumb/knob | Quiet | `body.paints` | Compact tonal ramp can suggest body form, but direction is not automatically the lighting rig. |
| indicator/fill | Trace | `body.paints` | Only a semantic-preserving tonal variation on non-data fills; never alter literal swatches or imply a quantitative gradient scale. |
| divider | None | `edges` | Solid rule; gradient strokes require the separate edge recipe. |
| edge | None | `edges` | Keep baseline edge; a body gradient does not prescribe its perimeter. |
| glyph | None | `content.ink` | Solid semantic glyph ink. |
| text | None | `content.ink` | Solid ink, never gradient-clipped UI text by inheritance. |
| scrim | None | `body.paints` | Existing scrim; local readability fades retain their functional masks. |

<a id="radial-gradient"></a>
## Gradient fill — radial

**Kind:** paint primitive. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L163-L173).
**Construction basis:** [T01](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L26-L41). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Proposed role translation of the named layer only. Preserve semantic paint, current geometry and Surface; remove optional treatment when a guard or fallback requires it.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | Quiet | `body.paints` | Broad scene lobe away from long reading columns; no moving hotspot. |
| container | Trace | `body.paints` | Very broad tonal lobe, quiet center; no spotlight centered on every container. |
| floating surface | Quiet | `body.paints` | Off-content shell lobe; do not imply emission without an emission channel. |
| raised control | Trace | `body.paints` | Small restrained body variation only where ink contrast remains uniform enough. |
| recessed field/track | None | `body.paints` | Uniform well/track, no false focus spotlight under values. |
| thumb/knob | Quiet | `body.paints` | Local body highlight field can describe curvature; not a separate bloom. |
| indicator/fill | Trace | `body.paints` | Tonal variation only for non-quantitative cores; progress and literal color data stay solid. |
| divider | None | `edges` | Keep the plain structural line. |
| edge | None | `edges` | No rim added by a body-paint primitive. |
| glyph | None | `content.ink` | Solid glyph ink and intrinsic media unchanged. |
| text | None | `content.ink` | Plain semantic text. |
| scrim | None | `body.paints` | Retain functional scrim mask; no decorative radial dimming replacing modal coverage. |

<a id="conic-gradient"></a>
## Gradient fill — conic

**Kind:** paint primitive. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L174-L184).
**Construction basis:** [T01](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L26-L41), [T07](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L106-L134). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Proposed role translation of the named layer only. Preserve semantic paint, current geometry and Surface; remove optional treatment when a guard or fallback requires it.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | Trace | `body.paints` | Optional broad angular field outside reading regions; visible seam must not cross content. |
| container | None | `body.paints` | Plain backing; angular bands are too directional for a default reading surface. |
| floating surface | Trace | `body.paints` | Small peripheral angular accent only; keep main reading body uniform. |
| raised control | Trace | `body.paints` | Very restrained angular modulation on a sparse command face; disable when seam or hue implies state. |
| recessed field/track | None | `body.paints` | Plain receptacle; never suggest a dial scale in an ordinary field/track. |
| thumb/knob | Quiet | `body.paints` | A restrained brushed/dial-like face may use angular paint; logical travel does not rotate with decorative stops. |
| indicator/fill | None | `body.paints` | Preserve exact semantic fill; color wheels/quantitative arcs already own their angular encoding. |
| divider | None | `edges` | Solid structural rule. |
| edge | Trace | `edges` | Only an explicitly combined gradient-stroke recipe may clip angular paint to a decorative perimeter. |
| glyph | None | `content.ink` | Plain semantic glyph. |
| text | None | `content.ink` | Plain text; no angular color field in letters. |
| scrim | None | `body.paints` | Existing uniform or functional scrim. |

<a id="mesh-gradient"></a>
## Gradient fill — mesh

**Kind:** paint primitive. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L185-L195).
**Construction basis:** [T01](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L26-L41). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Use an explicitly owned mesh asset or label a multi-radial approximation honestly, following 03; no native CSS mesh function is assumed.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | Quiet | `body.paints` | One low-frequency owned mesh/declared multi-radial approximation, with a calm reading region. |
| container | Trace | `body.paints` | Tiny tonal variation inherited from scene palette; do not restart colorful mesh per repeated card. |
| floating surface | Trace | `body.paints` | Peripheral color variation only, opaque calm body beneath dense content. |
| raised control | Trace | `body.paints` | At most a near-uniform sampled tonal patch; no independently complex control mesh. |
| recessed field/track | None | `body.paints` | Uniform well/rail. |
| thumb/knob | Trace | `body.paints` | A sampled solid/near-uniform tone ties handle to scene without losing its outline. |
| indicator/fill | None | `body.paints` | Semantic and literal-data fill unaffected. |
| divider | None | `edges` | Plain structural rule. |
| edge | None | `edges` | Plain boundary; mesh body does not imply multicolored edges. |
| glyph | None | `content.ink` | Solid glyph or unchanged media. |
| text | None | `content.ink` | Solid semantic ink, not mesh-filled text. |
| scrim | None | `body.paints` | Functional neutral scrim; no mesh fog layer. |

<a id="gradient-stroke"></a>
## Gradient stroke

**Kind:** edge paint primitive. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L196-L206).
**Construction basis:** [T07](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L106-L134). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Proposed role translation of the named layer only. Preserve semantic paint, current geometry and Surface; remove optional treatment when a guard or fallback requires it.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | None | `body.paints` | Page has no decorative perimeter by default. |
| container | Trace | `edges` | Subtle gradient on an existing decorative perimeter, no extra border width or new box. |
| floating surface | Quiet | `edges`, `reflection` | One gradient rim on shell silhouette; optional light interpretation shares the rig. |
| raised control | Trace | `edges` | Restrained perimeter modulation; required identification remains solid and independent. |
| recessed field/track | Trace | `edges` | Quiet outer boundary only; invalid/focus colors cannot be diluted into a multicolor rim. |
| thumb/knob | Quiet | `edges`, `reflection` | Small handle rim may carry light/dark variation; retain separate required edge. |
| indicator/fill | Trace | `edges` | Optional enclosing rim outside semantic core; no false progress expansion. |
| divider | Trace | `edges` | Low-contrast modulation along one existing seam; keep the entire needed separator visible. |
| edge | Full | `edges`, `reflection` | This is the principal receiver: fit gradient to existing edge mask; one rim owner, not an added body fill. |
| glyph | None | `content.ink` | Do not turn glyph strokes into gradient material edges. |
| text | None | `content.ink` | Plain text, no outline gradient inherited. |
| scrim | None | `body.paints` | No gradient perimeter around a scrim. |

<a id="inner-shadow"></a>
## Inner shadow

**Kind:** shading primitive. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L207-L217).
**Construction basis:** [T02](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L42-L55). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Proposed role translation of the named layer only. Preserve semantic paint, current geometry and Surface; remove optional treatment when a guard or fallback requires it.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | None | `body.paints` | No viewport-sized cavity. |
| container | Trace | `shading.inset`, `spatial.relief` | Shallow perimeter occlusion only when a real well is intended; otherwise keep body plain. |
| floating surface | None | `body.paints` | Do not make a floating panel look recessed into its host; its local field children can carry inset relief. |
| raised control | Trace | `shading.inset`, `spatial.relief` | Optional pressed/local face inset, never added as selection's only signal or animated geometry. |
| recessed field/track | Quiet | `shading.inset`, `spatial.relief` | Principal cavity receiver: shade immediate inner perimeter, preserve a uniform reading/measurement center. |
| thumb/knob | Trace | `shading.inset`, `spatial.relief` | Only local face modeling; handle still reads above its track, not as a hole. |
| indicator/fill | None | `body.paints` | Keep semantic fill extent exact, no dark inset swallowing small status marks. |
| divider | Trace | `shading.inset`, `edges` | Optional engraved seam replaces equivalent divider decoration; no second rule. |
| edge | Trace | `shading.inset`, `edges` | Inset boundary occlusion only; required focus/invalid edge remains separate. |
| glyph | None | `content.ink` | No automatic inset glyph treatment; letterpress is a separate recipe. |
| text | None | `content.ink` | Plain text. |
| scrim | None | `body.paints` | No inset shadow on full-screen occlusion. |

<a id="inner-glow"></a>
## Inner glow

**Kind:** shading/emission primitive. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L218-L228).
**Construction basis:** [T03](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L56-L66). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Proposed role translation of the named layer only. Preserve semantic paint, current geometry and Surface; remove optional treatment when a guard or fallback requires it.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | None | `body.paints` | No viewport glow frame. |
| container | Trace | `emission` | Faint interior rim on sparse shell, excluded from reading well. |
| floating surface | Quiet | `emission` | Contained luminous rim inside overlay silhouette; center stays stable and nonemissive. |
| raised control | Trace | `emission` | Optional quiet interior rim; never resembles the active/focus state at rest. |
| recessed field/track | None | `body.paints` | No glowing editing well by default. |
| thumb/knob | Quiet | `emission` | Small interior luminous ring distinct from track and value core. |
| indicator/fill | Trace | `emission` | Only inside the semantic core without reducing its minimum visible area. |
| divider | None | `edges` | Plain rule; narrow dividers have no useful interior glow area. |
| edge | Quiet | `emission`, `edges` | Inset luminous boundary; keep required edge crisp and independently colored. |
| glyph | None | `content.ink` | No glow eating into small glyph strokes. |
| text | None | `content.ink` | Plain text; interior glyph effects need a separate large-display treatment. |
| scrim | None | `body.paints` | No luminous scrim edge. |

<a id="outer-glow"></a>
## Outer glow

**Kind:** emission/halo primitive. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L229-L239).
**Construction basis:** [T03](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L56-L66). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Proposed role translation of the named layer only. Preserve semantic paint, current geometry and Surface; remove optional treatment when a guard or fallback requires it.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | None | `body.paints` | Page itself is not an emitter. |
| container | Trace | `emission` | Sparse shell halo only if a receiving gap exists; dense containers suppress it. |
| floating surface | Quiet | `emission` | One bounded external halo around shell, not an alternative elevation/focus system. |
| raised control | Trace | `emission` | Sparse command halo only; repeated rows/toolbar controls suppress shared overlapping bloom. |
| recessed field/track | None | `body.paints` | No halo around every editing well or rail. |
| thumb/knob | Quiet | `emission` | Small local handle halo, clipped away from adjacent labels and kept separate from value extent. |
| indicator/fill | Quiet | `emission` | Bounded halo around existing semantic core; core stays visible in no-effect fallback. |
| divider | None | `edges` | No glowing separator network. |
| edge | Trace | `emission`, `edges` | Supplementary halo outside decorative rim; never replace required perimeter/focus. |
| glyph | Trace | `content.decoration`, `emission` | Sparse decorative glyph only; no status/readability dependence on glow, no media alteration. |
| text | None | `content.ink` | Plain reading ink. |
| scrim | None | `body.paints` | Scrim remains nonemissive. |

<a id="drop-shadow"></a>
## Drop shadow

**Kind:** shading primitive. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L240-L250).
**Construction basis:** [T02](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L42-L55). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Proposed role translation of the named layer only. Preserve semantic paint, current geometry and Surface; remove optional treatment when a guard or fallback requires it.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | None | `body.paints` | No page cast onto itself. |
| container | Trace | `shading.cast` | Only an existing elevated container consumes its Surface cast; layout/flush containers remain shadowless. |
| floating surface | Full | `shading.cast` | Use the single existing float/tooltip/toolbar cast policy; no second material shadow ladder. |
| raised control | None | `body.paints` | In-flow command plates keep current no-shadow policy. |
| recessed field/track | None | `body.paints` | No external cast on fields or rails. |
| thumb/knob | Quiet | `shading.cast` | Existing thumb lift only, bounded by parent track/context. |
| indicator/fill | None | `body.paints` | Status/progress fill does not cast a quantitative-looking second silhouette. |
| divider | None | `edges` | No separator shadow. |
| edge | None | `edges` | Spread-only rings stay edge paint; do not reinterpret every edge as cast elevation. |
| glyph | None | `content.ink` | No automatic glyph drop shadow; irregular decorative artwork needs separate owned-art review. |
| text | None | `content.ink` | No cast text shadow inherited from a surface. |
| scrim | None | `body.paints` | Scrim has no receiving-surface shadow. |

<a id="bevel-emboss"></a>
## Bevel / emboss

**Kind:** relief primitive. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L251-L261).
**Construction basis:** [T02](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L42-L55), [T04](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L67-L80), [T07](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L106-L134). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Proposed role translation of the named layer only. Preserve semantic paint, current geometry and Surface; remove optional treatment when a guard or fallback requires it.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | None | `body.paints` | No modeled frame around the page. |
| container | Trace | `reflection`, `shading.inset`, `spatial.relief` | Shallow local edge profile on a painted shell, calm broad center. |
| floating surface | Trace | `reflection`, `shading.inset`, `edges` | Subtle rim modeling only; shell retains floating relationship instead of looking pressed into host. |
| raised control | Quiet | `reflection`, `shading.inset`, `spatial.relief` | Raised face profile constrained to current silhouette; no added cast or hit-size growth. |
| recessed field/track | Quiet | `reflection`, `shading.inset`, `spatial.relief` | Invert local profile for a recess while retaining the same scene light; readable center unchanged. |
| thumb/knob | Full | `reflection`, `shading.inset`, `edges`, `spatial.relief` | Convex handle rim is strongest receiver; keep value marker and focus separate. |
| indicator/fill | Trace | `reflection`, `shading.inset` | Only non-data cores may take trace profile; preserve exact outline and semantic center. |
| divider | Trace | `reflection`, `shading.inset`, `edges` | Restrained incised seam replaces one divider; never stack another dark/light pair on the same edge. |
| edge | Quiet | `reflection`, `shading.inset`, `edges`, `spatial.relief` | Principal profile boundary: explicit raised/recessed intent and one coherent light rig. |
| glyph | Trace | `content.decoration` | Only sparse decorative glyph relief; UI/action symbols stay plain by default. |
| text | None | `content.ink` | No automatic embossed small type; letterpress owns any explicit inscription exception. |
| scrim | None | `body.paints` | No beveled scrim. |

<a id="letterpress"></a>
## Letterpress

**Kind:** text/glyph relief recipe. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L262-L272).
**Construction basis:** [T06](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L93-L105). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Text Trace is a conditional exception, not a blanket text-role default. Lack of a designated display-inscription context resolves to None; actual offsets/readability remain unmeasured.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | None | `body.paints` | Leave scene paint unchanged; letterpress is an inscription treatment, not page grain. |
| container | None | `body.paints` | Leave backing unchanged; it only supplies the local receiving color. |
| floating surface | None | `body.paints` | No whole-panel relief or shadow implied by inscription. |
| raised control | None | `body.paints` | Control body unaffected; labels use text policy below, not a body inset. |
| recessed field/track | None | `body.paints` | Editable well and live value remain unaffected. |
| thumb/knob | None | `body.paints` | Handle body unaffected; no automatic engraved value mark. |
| indicator/fill | None | `body.paints` | Semantic status/progress core unaffected. |
| divider | None | `edges` | Do not convert a divider into letterpress lettering. |
| edge | None | `edges` | Keep body boundaries independent of glyph contours. |
| glyph | Trace | `content.decoration`, `spatial.relief` | Optional debossed cue on a sparse decorative inscription; actual glyph ink/shape remains legible. |
| text | Trace | `content.decoration`, `spatial.relief` | Trace only for explicitly designated large, short display inscription; all UI, dense, editable and code text is None. |
| scrim | None | `body.paints` | Scrim unchanged. |

<a id="grain"></a>
## Grain

**Kind:** microtexture primitive. **Definition evidence:** [task 01 pinned definition and original sources](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/01-taxonomy/catalogue.md#L273-L282).
**Construction basis:** [T05](https://github.com/ethanwongwork/area/blob/79f76ea0557d201777c29de1a8626c20bbc67575/docs/research/astra/materials/03-css-cookbook/cookbook.md#L81-L92). All are pinned task 03 technique sections, including fallback limits.

**Boundary:** Proposed role translation of the named layer only. Preserve semantic paint, current geometry and Surface; remove optional treatment when a guard or fallback requires it.

| Role | Amount cap | Layer channels | Proposed treatment |
| --- | --- | --- | --- |
| page | Quiet | `texture` | One stable fine texture phase on the scene; keep readable regions uniform enough, dark ground remains near-black. |
| container | Trace | `texture` | Static surface microtexture below content, not a new seed per nested/repeated item. |
| floating surface | Trace | `texture` | One restrained texture layer clipped to shell; no new noise plane in each row. |
| raised control | Trace | `texture` | Optional sparse-body texture only if the plate has usable blank area; dense controls suppress it. |
| recessed field/track | None | `body.paints` | No grain beneath editable values or scale marks. |
| thumb/knob | Trace | `texture` | At most trace body texture on a sufficiently clear handle, not on its value core/edge. |
| indicator/fill | None | `body.paints` | No noise inside semantic cores, progress extents or literal color samples. |
| divider | None | `edges` | No textured structural rule. |
| edge | None | `edges` | Required and decorative edges remain crisp. |
| glyph | None | `content.ink` | Do not perforate glyph ink or modify intrinsic media. |
| text | None | `content.ink` | No grain mask or animated noise on text. |
| scrim | None | `body.paints` | Scrim remains functionally smooth, not a second texture layer. |
