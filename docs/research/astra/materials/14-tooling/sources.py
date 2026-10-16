"""Sources read 2026-10-10; facts live in report, no remote content copied."""
AREA='3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e'
RESEARCH='3a9a1b61e748741e9bc5e578b536ad978d3b1986'
CHECKED='2026-10-10'
AREA_SOURCES=[
 ('A01','Gallery control registry','apps/docs/src/gallery/controls.ts',1,39),
 ('A02','Canvas mutation and persistence','apps/docs/src/gallery/chrome.tsx',201,263),
 ('A03','Theme API and portal context','packages/react/src/components/Theme.tsx',8,33),
 ('A04','Existing JSON output schema','packages/tokens/src/emit/json.ts',25,79),
 ('A05','Scope derivations','packages/tokens/src/emit/css.ts',164,174),
 ('A06','Current part/variant manifest','packages/styles/src/manifest.ts',1,31),
 ('A07','Surface token ownership','packages/tokens/src/axes/surface.ts',15,81),
 ('A08','Contrast and fixed hover foreground','docs/CONTRAST.md',7,76)]
PUBLIC=[
 ('D01','DTCG published format 2025.10','https://www.designtokens.org/TR/2025.10/format/','Status; sections 5.2.3, 8, 9.4, 9.6, 9.7. Published 2025-10-28; identifies itself as latest published version.'),
 ('D02','DTCG resolver 2025.10','https://www.designtokens.org/TR/2025.10/resolver/','Sets, modifiers, contexts and resolutionOrder; not CSS runtime material evaluation.'),
 ('D03','DTCG project','https://www.designtokens.org/','Publication cross-check; target a named published version, not a moving editor draft.'),
 ('T01','Tokens Studio format selector','https://docs.tokens.studio/manage-settings/token-format','DTCG-prefix mode and remaining future type support; do not equate prefix conversion with complete 2025.10 compatibility.'),
 ('T02','Tokens Studio shadows','https://docs.tokens.studio/manage-tokens/token-types/box-shadow','Multiple inner/drop lobes, Effect Styles, documented boxShadow versus shadow differences.'),
 ('T03','Tokens Studio gradients','https://docs.tokens.studio/manage-tokens/token-types/color/gradient','CSS-like color values; linear export limit and style references.'),
 ('T04','Tokens Studio border','https://docs.tokens.studio/manage-tokens/token-types/border','Composite node application and independent-side color limitation.'),
 ('T05','Tokens Studio Other','https://docs.tokens.studio/manage-tokens/token-types/other','Stores nonstandard decisions but does not visually apply them.'),
 ('T06','Tokens Studio skipped variables','https://docs.tokens.studio/figma/export/variables-skipped','Composite/gradient values skipped as whole variables; modes subject to plan. Four-type wording differs from current Figma API.'),
 ('T07','Tokens Studio styles with references','https://docs.tokens.studio/figma/export/styles-variable-references','Leaf variables can remain referenced by supported styles.'),
 ('F01','Figma variable types','https://developers.figma.com/docs/plugins/api/VariableResolvedDataType/','Current documented union includes BOOLEAN, COLOR, EASING, FLOAT, STRING, TIMING.'),
 ('F02','Figma effect fields','https://developers.figma.com/docs/plugins/api/VariableBindableEffectField/','Shadow radius/color/spread/offsetX/offsetY and blur radius binding.'),
 ('F03','Figma gradient stop binding','https://developers.figma.com/docs/plugins/api/VariableBindableColorStopField/','Color is the documented bindable stop field.'),
 ('F04','Figma paint','https://developers.figma.com/docs/plugins/api/Paint/','Gradient kinds, transforms and stops; solid alpha is paint opacity.'),
 ('F05','Figma effects','https://developers.figma.com/docs/plugins/api/Effect/','Shadow geometry, progressive blur, beta noise/texture/glass, shader effect; no variable binding on noise/texture/glass.'),
 ('F06','Figma effect styles','https://developers.figma.com/docs/plugins/api/EffectStyle/','An effect list and supported variable references.'),
 ('F07','Figma paint styles','https://developers.figma.com/docs/plugins/api/PaintStyle/','Paint list for fills/strokes; not a complete border or component material.'),
 ('F08','Figma variable collections','https://developers.figma.com/docs/plugins/api/VariableCollection/','Modes and IDs; adapter must map logical names to destination identifiers.'),
 ('W01','Tailwind theme variables','https://tailwindcss.com/docs/theme','Current CSS-first theme namespaces and @theme inline variable references.'),
 ('W02','Tailwind shadows','https://tailwindcss.com/docs/box-shadow','Box/inset shadows and utility composition; distinct from filter drop-shadow.'),
 ('W03','Tailwind custom utilities','https://tailwindcss.com/docs/adding-custom-styles','@utility and variants; not an Area guard/part compiler.'),
 ('C01','CSS backgrounds and borders','https://www.w3.org/TR/css-backgrounds-3/#box-shadow','Layered/inset box shadows and rounded background/border painting.'),
 ('C02','CSS images gradients','https://www.w3.org/TR/css-images-3/#gradients','Gradient geometry is part of the rendering syntax.'),
 ('C03','MDN backdrop-filter','https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter','Backdrop acquisition differs from element blur; transparent body and backdrop-root context matter.')]
