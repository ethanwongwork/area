# Evidence ledger

Checked **2026-10-10** (America/Los_Angeles). Area **3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e**; research **3a9a1b61e748741e9bc5e578b536ad978d3b1986**. Public URLs are dated documentation observations, not claims about a locally installed plugin version. No signed-in product writes or target-tool imports.

## Area snapshot

- **A01 — Gallery control registry:** [apps/docs/src/gallery/controls.ts:1–39](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/apps/docs/src/gallery/controls.ts#L1-L39).
- **A02 — Canvas mutation and persistence:** [apps/docs/src/gallery/chrome.tsx:201–263](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/apps/docs/src/gallery/chrome.tsx#L201-L263).
- **A03 — Theme API and portal context:** [packages/react/src/components/Theme.tsx:8–33](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/packages/react/src/components/Theme.tsx#L8-L33).
- **A04 — Existing JSON output schema:** [packages/tokens/src/emit/json.ts:25–79](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/packages/tokens/src/emit/json.ts#L25-L79).
- **A05 — Scope derivations:** [packages/tokens/src/emit/css.ts:164–174](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/packages/tokens/src/emit/css.ts#L164-L174).
- **A06 — Current part/variant manifest:** [packages/styles/src/manifest.ts:1–31](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/packages/styles/src/manifest.ts#L1-L31).
- **A07 — Surface token ownership:** [packages/tokens/src/axes/surface.ts:15–81](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/packages/tokens/src/axes/surface.ts#L15-L81).
- **A08 — Contrast and fixed hover foreground:** [docs/CONTRAST.md:7–76](https://github.com/ethanwongwork/area/blob/3bcc6a93b93f73aa6bef410dbe88d93b0caddb7e/docs/CONTRAST.md#L7-L76).

## Research inputs

- [README.md](https://github.com/ethanwongwork/area/blob/3a9a1b61e748741e9bc5e578b536ad978d3b1986/docs/research/astra/materials/README.md#L1-L139) — 977a7bac83ceafad68f4cf435d119fd418690aa4e758b9d16e55fe589a433d04 (content SHA-256).
- [07-controls/README.md](https://github.com/ethanwongwork/area/blob/3a9a1b61e748741e9bc5e578b536ad978d3b1986/docs/research/astra/materials/07-controls/README.md#L1-L43) — 5b6f75e68a46798cf1dbf6ba9c813570d919255f0106b60b4d8271bd5bbf5764 (content SHA-256).
- [07-controls/controls.md](https://github.com/ethanwongwork/area/blob/3a9a1b61e748741e9bc5e578b536ad978d3b1986/docs/research/astra/materials/07-controls/controls.md#L1-L124) — 32d5ecf899c2983ec326e3065f63daa2c84a38337af98df1185d6668c41fd681 (content SHA-256).
- [07-controls/architecture.md](https://github.com/ethanwongwork/area/blob/3a9a1b61e748741e9bc5e578b536ad978d3b1986/docs/research/astra/materials/07-controls/architecture.md#L1-L221) — f59beb016974d84508f27b92db3713988e439bdd7abefd0813a24567586daa4f (content SHA-256).
- [13-presets/contract.md](https://github.com/ethanwongwork/area/blob/3a9a1b61e748741e9bc5e578b536ad978d3b1986/docs/research/astra/materials/13-presets/contract.md#L1-L82) — 6441a20d05e54408182811922e36a84c38ab9d579d9025370be5e65a8a34d228 (content SHA-256).

## Public sources

Every entry checked **2026-10-10**. The source notes identify what was read; export policies and the builder design are authored proposals.

- **D01 — [DTCG published format 2025.10](https://www.designtokens.org/TR/2025.10/format/):** Status; sections 5.2.3, 8, 9.4, 9.6, 9.7. Published 2025-10-28; identifies itself as latest published version.
- **D02 — [DTCG resolver 2025.10](https://www.designtokens.org/TR/2025.10/resolver/):** Sets, modifiers, contexts and resolutionOrder; not CSS runtime material evaluation.
- **D03 — [DTCG project](https://www.designtokens.org/):** Publication cross-check; target a named published version, not a moving editor draft.
- **T01 — [Tokens Studio format selector](https://docs.tokens.studio/manage-settings/token-format):** DTCG-prefix mode and remaining future type support; do not equate prefix conversion with complete 2025.10 compatibility.
- **T02 — [Tokens Studio shadows](https://docs.tokens.studio/manage-tokens/token-types/box-shadow):** Multiple inner/drop lobes, Effect Styles, documented boxShadow versus shadow differences.
- **T03 — [Tokens Studio gradients](https://docs.tokens.studio/manage-tokens/token-types/color/gradient):** CSS-like color values; linear export limit and style references.
- **T04 — [Tokens Studio border](https://docs.tokens.studio/manage-tokens/token-types/border):** Composite node application and independent-side color limitation.
- **T05 — [Tokens Studio Other](https://docs.tokens.studio/manage-tokens/token-types/other):** Stores nonstandard decisions but does not visually apply them.
- **T06 — [Tokens Studio skipped variables](https://docs.tokens.studio/figma/export/variables-skipped):** Composite/gradient values skipped as whole variables; modes subject to plan. Four-type wording differs from current Figma API.
- **T07 — [Tokens Studio styles with references](https://docs.tokens.studio/figma/export/styles-variable-references):** Leaf variables can remain referenced by supported styles.
- **F01 — [Figma variable types](https://developers.figma.com/docs/plugins/api/VariableResolvedDataType/):** Current documented union includes BOOLEAN, COLOR, EASING, FLOAT, STRING, TIMING.
- **F02 — [Figma effect fields](https://developers.figma.com/docs/plugins/api/VariableBindableEffectField/):** Shadow radius/color/spread/offsetX/offsetY and blur radius binding.
- **F03 — [Figma gradient stop binding](https://developers.figma.com/docs/plugins/api/VariableBindableColorStopField/):** Color is the documented bindable stop field.
- **F04 — [Figma paint](https://developers.figma.com/docs/plugins/api/Paint/):** Gradient kinds, transforms and stops; solid alpha is paint opacity.
- **F05 — [Figma effects](https://developers.figma.com/docs/plugins/api/Effect/):** Shadow geometry, progressive blur, beta noise/texture/glass, shader effect; no variable binding on noise/texture/glass.
- **F06 — [Figma effect styles](https://developers.figma.com/docs/plugins/api/EffectStyle/):** An effect list and supported variable references.
- **F07 — [Figma paint styles](https://developers.figma.com/docs/plugins/api/PaintStyle/):** Paint list for fills/strokes; not a complete border or component material.
- **F08 — [Figma variable collections](https://developers.figma.com/docs/plugins/api/VariableCollection/):** Modes and IDs; adapter must map logical names to destination identifiers.
- **W01 — [Tailwind theme variables](https://tailwindcss.com/docs/theme):** Current CSS-first theme namespaces and @theme inline variable references.
- **W02 — [Tailwind shadows](https://tailwindcss.com/docs/box-shadow):** Box/inset shadows and utility composition; distinct from filter drop-shadow.
- **W03 — [Tailwind custom utilities](https://tailwindcss.com/docs/adding-custom-styles):** @utility and variants; not an Area guard/part compiler.
- **C01 — [CSS backgrounds and borders](https://www.w3.org/TR/css-backgrounds-3/#box-shadow):** Layered/inset box shadows and rounded background/border painting.
- **C02 — [CSS images gradients](https://www.w3.org/TR/css-images-3/#gradients):** Gradient geometry is part of the rendering syntax.
- **C03 — [MDN backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter):** Backdrop acquisition differs from element blur; transparent body and backdrop-root context matter.

## Limits and conflicting documentation

- DTCG latest-publication check used the project landing page and the published Format header. `/TR/` itself was unavailable through the web tool; no claim that an uninspected editor draft is normative.
- Figma public API currently lists EASING/TIMING in addition to the familiar four types. Tokens Studio’s skipped-variables page still describes four. This report uses Figma for native capability and the plugin docs for its documented export path; installed compatibility is not inferred.
- Figma API source-SHA retrieval via the shell was unavailable because network name resolution was restricted. Dated official API pages support the claims instead. No unpublished source pin is fabricated.
- No full native-material-to-CSS parameter equivalence was found in the inspected Figma effects, DTCG format, or Tokens Studio type documentation. Similar field names are not evidence of identical rendering.
- No installed Tokens Studio/Figma round trip, Tailwind build, material compiler, or gallery UI was run. Example checks test report and serialization integrity only.
