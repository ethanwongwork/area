# All forty component flows

This census covers each named atlas component once. Recipe IDs refer to [flow.md](flow.md). Roles are Area vocabulary used analytically; OpenGlass exposes selectors, not these role records. **Control coverage is per painted part/state**, not a claim that every field affects an entire component.

Every CSS recipe entry also inherits the shared definitions/remap [packages/recipes/src/liquid.source.css:41–165](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L41-L165) [packages/recipes/src/liquid.source.css:249–297](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L249-L297). All CSS fallback notes are read against [packages/recipes/src/liquid.source.css:1155–1351](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1155-L1351) and the base motion/forced rules [packages/recipes/src/styles.css:1701–1803](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1701-L1803). G shell fallbacks additionally use [packages/renderers/src/css.ts:212–255](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/renderers/src/css.ts#L212-L255). These common pins apply to every entry; the row pins specify its particular paint.

No row is certified for arbitrary-backdrop contrast. Text uses the palette/material ink path; the contrast and fallback limitations in [findings.md](findings.md#f07--contrast-is-a-palette-check-not-a-composited-glass-guarantee) apply throughout. In-flow rows inherit DOM look variables; portalled rows copy recorded provider tokens.

## 01 — Button

**Recipe:** B. **Parts/roles:** raised-control; edge; glyph; text.

Secondary follows B; primary keeps fixed accent gradient/casts and filters the whole button on hover. Quiet has no backdrop filter; danger uses semantic danger accent inherited from base CSS. No tint control on its white body.

**Fallback / nesting:** CSS recipe fallback; fixed primary/danger paint remains outside generic fill replacement.

[packages/recipes/src/index.tsx:178–223](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/index.tsx#L178-L223) [packages/recipes/src/liquid.source.css:303–425](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L303-L425) [packages/recipes/src/styles.css:30–143](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L30-L143)

## 02 — IconButton

**Recipe:** B. **Parts/roles:** raised-control; edge; glyph.

Delegates to Button; quiet by default. Its icon is content inside the label slot, not a separate refractive role.

**Fallback / nesting:** Same variant/fallback limits as Button.

[packages/recipes/src/index.tsx:229–247](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/index.tsx#L229-L247) [packages/recipes/src/liquid.source.css:303–425](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L303-L425) [packages/recipes/src/styles.css:145–158](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L145-L158)

## 03 — SegmentedControl

**Recipe:** W/I. **Parts/roles:** recessed-field-track; thumb-knob; text; edge.

Fixed well and thumb alpha; shared filter/rim/lift; moving indicator receives measured geometry. Hover of unselected labels changes ink.

**Fallback / nesting:** Opaque well/thumb substitutions; forced selection retains Highlight/HighlightText; indicator motion shortened.

[packages/recipes/src/index.tsx:264–300](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/index.tsx#L264-L300) [packages/recipes/src/liquid.source.css:452–519](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L452-L519) [packages/recipes/src/styles.css:160–195](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L160-L195)

## 04 — Switch

**Recipe:** K. **Parts/roles:** recessed-field-track; thumb-knob; indicator-fill; text.

Native hidden checkbox owns state. White knob, fixed casts and selected accent bypass GlassLook. Press adds fixed translucent lens/filter.

**Fallback / nesting:** Rest well resolves opaque; pressed hard-coded lens survives reduced transparency. Reduced motion removes active scale but keeps state position.

[packages/recipes/src/index.tsx:308–366](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/index.tsx#L308-L366) [packages/recipes/src/liquid.source.css:569–626](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L569-L626) [packages/recipes/src/styles.css:197–274](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L197-L274)

## 05 — Slider

**Recipe:** K. **Parts/roles:** recessed-field-track; thumb-knob; indicator-fill; text.

Native range; exact value fill, fixed knob, fixed active lens. Main optical parts do not consume Look controls.

**Fallback / nesting:** Well substitutes; active thumb alpha and pseudo-element transition are not in shared fallback overrides.

[packages/recipes/src/index.tsx:373–421](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/index.tsx#L373-L421) [packages/recipes/src/liquid.source.css:633–721](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L633-L721) [packages/recipes/src/styles.css:276–303](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L276-L303)

## 06 — Toolbar

**Recipe:** G+B. **Parts/roles:** container; raised-control; edge; glyph; text.

Glass regular shell plus caller children; quiet buttons are locally quiet. Shell consumes all Look fields; no child ownership policy enforces quiet variants.

**Fallback / nesting:** Glass runtime fallback for shell, CSS fallback separately for children.

[packages/recipes/src/index.tsx:429–453](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/index.tsx#L429-L453) [packages/recipes/src/liquid.source.css:731–749](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L731-L749) [packages/recipes/src/styles.css:305–319](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L305-L319)

## 07 — Dock

**Recipe:** G+B. **Parts/roles:** container; raised-control; edge; glyph; text.

Glass regular nav shell; child buttons retain their own recipe and hover translation/scale.

**Fallback / nesting:** Glass shell fallback; explicit motion off removes dock hover transform, OS reduced-motion path mainly shortens transitions.

[packages/recipes/src/index.tsx:460–481](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/index.tsx#L460-L481) [packages/recipes/src/liquid.source.css:731–756](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L731-L756) [packages/recipes/src/styles.css:305–324](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L305-L324)

## 08 — Tabs

**Recipe:** W/I. **Parts/roles:** recessed-field-track; thumb-knob; text; container.

Fixed well/selection plate with shared filter/rim/lift; panel is content, not another automatic glass sheet.

**Fallback / nesting:** Opaque plate/well; fallback selected-button paint before indicator ready; forced selected ink/marker retained.

[packages/recipes/src/index.tsx:498–600](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/index.tsx#L498-L600) [packages/recipes/src/liquid.source.css:452–483](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L452-L483) [packages/recipes/src/liquid.source.css:522–563](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L522-L563) [packages/recipes/src/styles.css:326–364](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L326-L364)

## 09 — Menu

**Recipe:** G. **Parts/roles:** floating-surface; raised-control; text; edge.

DisclosureSurface portals a Glass frosted shell with copied provider tokens. Trigger is caller content; rows consume local hover fill without independent blur.

**Fallback / nesting:** Glass shell fallback; portal cannot retain unrecorded CSS look inheritance.

[packages/recipes/src/index.tsx:912–925](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/index.tsx#L912-L925) [packages/recipes/src/liquid.source.css:760–780](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L760-L780) [packages/recipes/src/styles.css:366–404](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L366-L404) [packages/recipes/src/index.tsx:617–821](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/index.tsx#L617-L821)

## 10 — MenuItem

**Recipe:** row. **Parts/roles:** raised-control; text; glyph.

Transparent command row; hover uses Look opacity through fill-hover; destructive ink is semantic. No own lens/blur/cast/ring.

**Fallback / nesting:** Hover fill substitutes; depends on containing menu for readable ground. Inherits whichever portal scope is actually emitted.

[packages/recipes/src/index.tsx:930–958](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/index.tsx#L930-L958) [packages/recipes/src/liquid.source.css:771–780](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L771-L780) [packages/recipes/src/styles.css:406–421](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L406-L421)

## 11 — Popover

**Recipe:** G. **Parts/roles:** floating-surface; container; text; edge.

Same portalled Glass frosted shell as Menu; content has dialog role and may contain independently painted children.

**Fallback / nesting:** Glass fallback and recorded-token portal limitation; no automatic nesting cap.

[packages/recipes/src/index.tsx:963–977](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/index.tsx#L963-L977) [packages/recipes/src/liquid.source.css:760–764](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L760-L764) [packages/recipes/src/styles.css:366–399](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L366-L399) [packages/recipes/src/styles.css:423–427](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L423-L427) [packages/recipes/src/index.tsx:617–821](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/index.tsx#L617-L821)

## 12 — Tooltip

**Recipe:** F. **Parts/roles:** floating-surface; text; edge.

Inline wrapper and bubble, not a portal; sheet, rim/lift and heavy blur. All Look fields through shared body/ring/filter/lift.

**Fallback / nesting:** CSS opaque sheet/no heavy blur; forced-color real edge; remains subject to ancestor clipping.

[packages/recipes/src/index.tsx:984–1010](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/index.tsx#L984-L1010) [packages/recipes/src/liquid.source.css:791–803](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L791-L803) [packages/recipes/src/styles.css:429–474](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L429-L474)

## 13 — MediaControls

**Recipe:** B+K. **Parts/roles:** container; raised-control; recessed-field-track; thumb-knob; indicator-fill; glyph; text.

Quiet IconButtons plus native seek range and time output; container is not a Glass surface. K paint is fixed; buttons receive B subset.

**Fallback / nesting:** Combined quiet-button/range fallbacks; no automatic WebGL media surface.

[packages/recipes/src/index.tsx:1055–1117](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/index.tsx#L1055-L1117) [packages/recipes/src/liquid.source.css:633–725](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L633-L725) [packages/recipes/src/styles.css:476–498](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L476-L498)

## 14 — Badge

**Recipe:** D. **Parts/roles:** indicator-fill; text; edge.

Neutral body uses opacity fill; control filter, lensing and ring. Tone variants keep fixed semantic fill/ink and an additional tone inset. No generic tint or shared cast.

**Fallback / nesting:** Control blur disabled in reduced transparency; semantic fixed-alpha body bypasses fill substitution.

[packages/recipes/src/atlas.tsx:37–40](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L37-L40) [packages/recipes/src/liquid.source.css:979–996](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L979-L996) [packages/recipes/src/styles.css:559–596](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L559-L596)

## 15 — Avatar

**Recipe:** D. **Parts/roles:** glyph; edge.

Image or initials on fixed radial/accent body. Shared lensing/lift/ring respond; no backdrop blur, tint or opacity body control.

**Fallback / nesting:** No normal blur to remove; forced mode removes ring. Intrinsic image is not transformed into a new material.

[packages/recipes/src/atlas.tsx:47–72](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L47-L72) [packages/recipes/src/liquid.source.css:999–1002](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L999-L1002) [packages/recipes/src/styles.css:598–632](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L598-L632)

## 16 — AvatarGroup

**Recipe:** D. **Parts/roles:** container; glyph; edge.

Layout grouping only; child Avatars carry D recipe. Fixed canvas outline and overlap, hover lift; no new group shell.

**Fallback / nesting:** Child fallback; reduced motion suppresses transition but can leave instantaneous hover offset.

[packages/recipes/src/atlas.tsx:73–76](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L73-L76) [packages/recipes/src/liquid.source.css:1005–1011](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1005-L1011) [packages/recipes/src/styles.css:634–652](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L634-L652)

## 17 — Card

**Recipe:** S. **Parts/roles:** container; edge; text; divider.

Surface tint/gradient, rim/bloom/lift/filter; optional interactive hover uses high lift and transform. Footer uses hairline, labels use semantic ink.

**Fallback / nesting:** CSS opaque surface and removed background image; children remain independent paint consumers.

[packages/recipes/src/atlas.tsx:85–130](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L85-L130) [packages/recipes/src/liquid.source.css:810–855](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L810-L855) [packages/recipes/src/styles.css:654–720](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L654-L720)

## 18 — Stat

**Recipe:** text. **Parts/roles:** text; indicator-fill.

No optical shell. Label/value/change are semantic type/tone; liquid adjusts tracking. No direct GlassLook field affects its own body.

**Fallback / nesting:** Depends on host readability; no extra optical layer to fall back.

[packages/recipes/src/atlas.tsx:138–147](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L138-L147) [packages/recipes/src/liquid.source.css:916–917](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L916-L917) [packages/recipes/src/styles.css:722–745](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L722-L745)

## 19 — Progress

**Recipe:** data. **Parts/roles:** recessed-field-track; indicator-fill; text.

Native progress with fixed well and accent gradient/glow; dimensions/value remain native. GlassLook does not tune the value gradient/glow.

**Fallback / nesting:** Well substitution does not remove fixed optional fill glow; browser-specific pseudo-element declarations differ.

[packages/recipes/src/atlas.tsx:154–168](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L154-L168) [packages/recipes/src/liquid.source.css:1014–1031](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1014-L1031) [packages/recipes/src/styles.css:747–799](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L747-L799)

## 20 — Meter

**Recipe:** data. **Parts/roles:** recessed-field-track; indicator-fill; text.

Native meter receives well on host; platform internals and thresholds own the value presentation. No custom Look-driven fill recipe.

**Fallback / nesting:** Well token fallback is not evidence of identical native meter appearance across engines.

[packages/recipes/src/atlas.tsx:179–207](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L179-L207) [packages/recipes/src/liquid.source.css:1014–1017](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1014-L1017) [packages/recipes/src/styles.css:768–778](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L768-L778) [packages/recipes/src/styles.css:801–814](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L801-L814)

## 21 — Spinner

**Recipe:** data. **Parts/roles:** indicator-fill; text.

Fixed border ring, accent top, semantic status text. No Look-controlled blur/cast.

**Fallback / nesting:** Base reduced-motion and explicit off slow rotation to 1.6s rather than remove it; this is its explicit status policy.

[packages/recipes/src/atlas.tsx:208–220](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L208-L220) [packages/recipes/src/liquid.source.css:1038–1041](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1038-L1041) [packages/recipes/src/styles.css:816–834](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L816-L834)

## 22 — Skeleton

**Recipe:** data. **Parts/roles:** indicator-fill.

Fixed well body and animated fixed-alpha shimmer; no Look controls on its own paint.

**Fallback / nesting:** Opaque well; base reduced-motion/off removes shimmer animation.

[packages/recipes/src/atlas.tsx:221–235](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L221-L235) [packages/recipes/src/liquid.source.css:1033–1034](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1033-L1034) [packages/recipes/src/styles.css:836–860](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L836-L860)

## 23 — Alert

**Recipe:** feedback. **Parts/roles:** container; indicator-fill; text; raised-control; edge.

Fixed semantic translucent body and signal glow; shared rim/lift/control filter and conic edge. Dismiss action has semantic hover fill.

**Fallback / nesting:** Shared blur stops; fixed tone body/glow does not become an opaque surface via fill replacement.

[packages/recipes/src/atlas.tsx:242–270](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L242-L270) [packages/recipes/src/liquid.source.css:897–913](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L897-L913) [packages/recipes/src/styles.css:862–908](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L862-L908)

## 24 — Banner

**Recipe:** feedback. **Parts/roles:** container; indicator-fill; text; raised-control; edge.

Fixed accent-alpha body and flare; shared rim/lift/control filter/ring. Caller action can be another independent B recipe.

**Fallback / nesting:** Shared blur stops; accent body/flare remain outside generic opaque-fill substitutions.

[packages/recipes/src/atlas.tsx:278–322](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L278-L322) [packages/recipes/src/liquid.source.css:897–913](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L897-L913) [packages/recipes/src/styles.css:910–945](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L910-L945)

## 25 — Breadcrumbs

**Recipe:** text. **Parts/roles:** text; glyph.

Semantic links/current text and slash separators; no material shell. Hover changes ink.

**Fallback / nesting:** Host must provide readable ground; no per-crumb optical effect or Look control.

[packages/recipes/src/atlas.tsx:328–352](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L328-L352) [packages/recipes/src/styles.css:947–975](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L947-L975)

## 26 — Pagination

**Recipe:** W/I. **Parts/roles:** recessed-field-track; raised-control; thumb-knob; text; edge.

Well/filter group; fixed-alpha selected page body with rim/lift/ring. Unselected hover uses fill-hover and changes ink.

**Fallback / nesting:** Opaque well/thumb and forced selected pair; ordinary text retains host dependency.

[packages/recipes/src/atlas.tsx:381–425](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L381-L425) [packages/recipes/src/liquid.source.css:452–462](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L452-L462) [packages/recipes/src/liquid.source.css:1044–1057](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1044-L1057) [packages/recipes/src/styles.css:977–1011](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L977-L1011)

## 27 — Accordion

**Recipe:** S. **Parts/roles:** container; divider; raised-control; glyph; text; edge.

Whole accordion gets surface recipe; sections use hairlines, header buttons/content stay plain. No separate blur per row.

**Fallback / nesting:** Opaque shared surface/image removal; existing expand glyph/content motion receives base fallback.

[packages/recipes/src/atlas.tsx:432–496](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L432-L496) [packages/recipes/src/liquid.source.css:810–821](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L810-L821) [packages/recipes/src/liquid.source.css:858–870](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L858-L870) [packages/recipes/src/styles.css:1013–1065](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1013-L1065)

## 28 — Dialog

**Recipe:** F+B. **Parts/roles:** floating-surface; scrim; raised-control; edge; text.

Overlay helper portals tokens. Fixed scrim filter plus heavy shell; built-in trigger uses B; close uses fill/lensing/ring. Close ring lacks local positioning (F01).

**Fallback / nesting:** Opaque sheet/heavy filter removal; scrim fixed blur survives transparency preference; portal record limitation.

[packages/recipes/src/atlas.tsx:748–751](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L748-L751) [packages/recipes/src/liquid.source.css:922–935](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L922-L935) [packages/recipes/src/liquid.source.css:960–973](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L960-L973) [packages/recipes/src/styles.css:1067–1179](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1067-L1179) [packages/recipes/src/atlas.tsx:575–746](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L575-L746)

## 29 — Drawer

**Recipe:** F+B. **Parts/roles:** floating-surface; scrim; raised-control; edge; text.

Same Overlay helper and close-ring defect, with edge-mounted geometry/slide animation. All Look fields reach sheet, not scrim.

**Fallback / nesting:** Same sheet/scrim/portal limits as Dialog; reduced-motion removes entrance animation.

[packages/recipes/src/atlas.tsx:752–755](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L752-L755) [packages/recipes/src/liquid.source.css:922–973](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L922-L973) [packages/recipes/src/styles.css:1067–1179](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1067-L1179) [packages/recipes/src/atlas.tsx:575–746](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L575-L746)

## 30 — Toast

**Recipe:** S+B. **Parts/roles:** floating-surface; indicator-fill; raised-control; text; edge.

Sheet/high lift/heavy filter; fixed success-mark glow; built-in restore uses B. Standalone Toast is inline; ToastProvider supplies optional portal viewport.

**Fallback / nesting:** Opaque sheet, removed image/heavy filter; fixed status glow remains. Provider portal copies recorded tokens only.

[packages/recipes/src/atlas.tsx:767–891](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L767-L891) [packages/recipes/src/liquid.source.css:873–894](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L873-L894) [packages/recipes/src/styles.css:1181–1250](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1181-L1250) [packages/recipes/src/atlas.tsx:918–986](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L918-L986)

## 31 — Checkbox

**Recipe:** E. **Parts/roles:** recessed-field-track; indicator-fill; glyph; text.

Native checkbox plus visible well/check. Checked accent relief/glow is fixed; ordinary Look fields do not tune the mark.

**Fallback / nesting:** Opaque well; forced checked system pair and unchecked glyph suppression; independent native focus outline.

[packages/recipes/src/atlas.tsx:1003–1032](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L1003-L1032) [packages/recipes/src/liquid.source.css:1104–1128](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1104-L1128) [packages/recipes/src/styles.css:1252–1326](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1252-L1326)

## 32 — RadioGroup

**Recipe:** E. **Parts/roles:** container; recessed-field-track; indicator-fill; text.

Native grouped radios with well and selected thick accent border. Selected cast is fixed; no per-role Look patch.

**Fallback / nesting:** Opaque well and system/native behavior; source does not prove all forced-color radio outcomes.

[packages/recipes/src/atlas.tsx:1051–1106](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L1051-L1106) [packages/recipes/src/liquid.source.css:1104–1114](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1104-L1114) [packages/recipes/src/liquid.source.css:1130–1137](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1130-L1137) [packages/recipes/src/styles.css:1277–1353](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1277-L1353)

## 33 — Select

**Recipe:** E. **Parts/roles:** recessed-field-track; glyph; text.

Custom well shell around native select, chevron; explicit colorScheme. Rest fixed, focus fill consumes opacity; OS popup is not glass recipe.

**Fallback / nesting:** Opaque well; focus follows CSS; native popup requires platform check, not inferred optical coverage.

[packages/recipes/src/atlas.tsx:1118–1146](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L1118-L1146) [packages/recipes/src/liquid.source.css:1069–1094](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1069-L1094) [packages/recipes/src/styles.css:1355–1378](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1355-L1378) [packages/recipes/src/styles.css:1413–1442](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1413-L1442)

## 34 — TextField

**Recipe:** E. **Parts/roles:** recessed-field-track; text; edge.

Fixed well; focus opacity fill and focus shadow, semantic invalid halo/message. No independent blur or general tint.

**Fallback / nesting:** Opaque well/fill substitutions; forced-color focus needs special review because ordinary outline is zero and visible cue is box-shadow.

[packages/recipes/src/atlas.tsx:1153–1185](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L1153-L1185) [packages/recipes/src/liquid.source.css:1069–1100](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1069-L1100) [packages/recipes/src/styles.css:1355–1411](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1355-L1411)

## 35 — Textarea

**Recipe:** E. **Parts/roles:** recessed-field-track; text; edge.

Same E focus/error chain as TextField, native resize and multiline content. No new blur across prose.

**Fallback / nesting:** Same fallback limits as TextField; native resize internals are not Look-controlled.

[packages/recipes/src/atlas.tsx:1192–1224](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L1192-L1224) [packages/recipes/src/liquid.source.css:1069–1100](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1069-L1100) [packages/recipes/src/styles.css:1355–1411](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1355-L1411)

## 36 — SearchField

**Recipe:** E. **Parts/roles:** recessed-field-track; glyph; text; raised-control.

Capsule well, search glyph, native input and clear action. Focus fill consumes opacity; action hover may use control-hover.

**Fallback / nesting:** Opaque well/focus fill; clear action semantics preserved; no glass filter in the field recipe.

[packages/recipes/src/atlas.tsx:1233–1275](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L1233-L1275) [packages/recipes/src/liquid.source.css:1069–1094](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1069-L1094) [packages/recipes/src/styles.css:1444–1478](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1444-L1478)

## 37 — NumberField

**Recipe:** E. **Parts/roles:** recessed-field-track; raised-control; text.

Shared well around step buttons and numeric value; focus-within fill/halo. No independent Button glass on its plain step buttons.

**Fallback / nesting:** Opaque well/focus fill; native constraints remain separate from optics.

[packages/recipes/src/atlas.tsx:1286–1369](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L1286-L1369) [packages/recipes/src/liquid.source.css:1069–1094](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1069-L1094) [packages/recipes/src/styles.css:1480–1521](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1480-L1521)

## 38 — Stepper

**Recipe:** text. **Parts/roles:** indicator-fill; raised-control; text.

Ordered steps with native buttons, semantic current/completed accent disks and control-fill upcoming disks. No Look lens/blur/cast; upcoming disk fill can inherit opacity through control remapping.

**Fallback / nesting:** Upcoming fill substitution; current/completed marks retain semantic/forced-system cues.

[packages/recipes/src/atlas.tsx:1376–1413](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L1376-L1413) [packages/recipes/src/styles.css:1523–1606](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1523-L1606)

## 39 — ToggleButton

**Recipe:** B. **Parts/roles:** raised-control; indicator-fill; glyph; text; edge.

B shell/filter/rim; pressed body switches to semantic accent and ink, independent of tint. Does not run Button pointer handler.

**Fallback / nesting:** CSS fill fallback and forced selected pair; fixed press paint not generic tint.

[packages/recipes/src/atlas.tsx:1421–1453](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L1421-L1453) [packages/recipes/src/liquid.source.css:303–344](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L303-L344) [packages/recipes/src/liquid.source.css:1060–1062](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1060-L1062) [packages/recipes/src/styles.css:1608–1628](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1608-L1628)

## 40 — FileDropzone

**Recipe:** E. **Parts/roles:** recessed-field-track; indicator-fill; glyph; text.

Fieldset well plus native file input, glyph and live result. Drag/focus uses fixed 12% accent body, not Look opacity.

**Fallback / nesting:** Opaque rest well; fixed drag/focus alpha bypasses substitution. File behavior is separate from material.

[packages/recipes/src/atlas.tsx:1465–1612](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/atlas.tsx#L1465-L1612) [packages/recipes/src/liquid.source.css:1140–1148](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/liquid.source.css#L1140-L1148) [packages/recipes/src/styles.css:1630–1693](https://github.com/moekoelueker/open-glass-ui/blob/4943bbfd5611fe211cccf4b50c384345468d635b/packages/recipes/src/styles.css#L1630-L1693)
