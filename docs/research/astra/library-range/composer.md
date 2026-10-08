# Composer — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Compose text with nearby submission and supporting actions. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L23)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (composition): `layout`: `minimal`, `textarea`, `advanced` [Untitled UI 1](https://www.untitledui.com/react/components/messaging)

  Only message-action composer examples are included; message display patterns belong to the M–Z run.

- **React Aria / Spectrum 2** (composition): `size`: `S`, `M`; `variant`: `balanced`, `prominent`, `subtle`; `isGenerating`: `false`, `true` [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/ai-components.md)

  AI Components documentation, PromptField section. Does not imply the consumer receives an AI backend or upload service.

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- PromptField / `isGenerating`: `false`, `true`. [API](https://react-spectrum.adobe.com/ai-components.md)

- PromptField / `size`: `M`, `S`. [API](https://react-spectrum.adobe.com/ai-components.md)

- PromptField / `variant`: `balanced`, `prominent`, `subtle`. [API](https://react-spectrum.adobe.com/ai-components.md)

- Attachment / `density`: `compact`, `regular`, `spacious`. [API](https://react-spectrum.adobe.com/ai-components.md)

- Attachment / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ai-components.md)

- Attachment / `isInvalid`: `false`, `true`. [API](https://react-spectrum.adobe.com/ai-components.md)

- Attachment / `size`: `L`, `M`, `S`, `XL`, `XS`. [API](https://react-spectrum.adobe.com/ai-components.md)

- Attachment / `variant`: `primary`, `quiet`, `secondary`, `tertiary`. [API](https://react-spectrum.adobe.com/ai-components.md)

- AttachmentPreview / `loading`: `eager`, `lazy`. [API](https://react-spectrum.adobe.com/ai-components.md)

- AttachFileMenuItem / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ai-components.md)

- AttachFileMenuItem / `shouldCloseOnSelect`: `false`, `true`. [API](https://react-spectrum.adobe.com/ai-components.md)

- InsertTextMenuItem / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ai-components.md)

- InsertTextMenuItem / `shouldCloseOnSelect`: `false`, `true`. [API](https://react-spectrum.adobe.com/ai-components.md)

- InsertTokenMenuItem / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ai-components.md)

- InsertTokenMenuItem / `shouldCloseOnSelect`: `false`, `true`. [API](https://react-spectrum.adobe.com/ai-components.md)

- CommandMenuItem / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ai-components.md)

- CommandMenuItem / `shouldCloseOnSelect`: `false`, `true`. [API](https://react-spectrum.adobe.com/ai-components.md)

- PromptFieldVoiceButton / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ai-components.md)

</details>

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json)

  General text-field guidance; no rich chat composer or joined-control component is asserted.

## Structural alternatives

- **Untitled UI** (composition): send action; attachment action; shortcut hint. [Untitled UI 1](https://www.untitledui.com/react/components/messaging)

- **React Aria / Spectrum 2** (composition): prompt token editor; suggestions; attachment list; attachment preview; toolbar; insert text/token menu; file action; voice action; submit action; AI disclaimer. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/ai-components.md)

- **Apple HIG** (guidance): text field; label; placeholder. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json)

## Interaction patterns

- **Untitled UI** (composition): Submission-key contract not found in public example text. [Untitled UI 1](https://www.untitledui.com/react/components/messaging)

- **React Aria / Spectrum 2** (composition): controlled prompt and attachments; submit; stop generation; remove attachment; voice error/toggle callbacks. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/ai-components.md)

- **Apple HIG** (guidance): entry; focus next/previous. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json)

## Area today

Inline/stacked layouts; leading/trailing actions; extras; footer; disabled/busy; automatic textarea growth. submitPill changes send-button shape and concentric shell corners. Enter submits by default; Shift+Enter inserts a newline; disabling submitOnEnter leaves Ctrl/Meta+Enter submission. IME composition is guarded and blank/busy submissions are suppressed. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L7), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L23), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L51), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L66), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/react/src/components/Composer.tsx#L6)

No built-in attachment lifecycle, voice recording, mention/token editor, generating/stop controller or asynchronous submission transaction. Leading/trailing action slots and a mode slot compose controls; the footer is internal anatomy, not a general footer-content prop. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L188), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L1)

- **composer manifest:** `layout` = `inline`, `stacked`; runtime states: `disabled`, `busy`. [packages/styles/src/manifest.ts:188](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L188)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Inline and stacked layouts** — layer 3; **1 systems**; Area **yes**; **retain**. Existing layouts; public UUI examples use minimal/textarea/advanced labels. Evidence: [Untitled UI](https://www.untitledui.com/react/components/messaging). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L1)

- **Prominent/subtle treatments** — layer 2; **1 systems**; Area **not-found**; **consider**. Add a treatment axis only if distinct use cases justify it. Evidence: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/ai-components.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L1)

- **Generating state with stop action** — layer 3; **1 systems**; Area **partial**; **add**. Busy exists; no generation/stop lifecycle controller. Evidence: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/ai-components.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L1)

- **Attachments with preview/removal** — layer 3; **1 systems**; Area **partial**; **add**. Extras can host UI; upload and removal lifecycle is not implemented. Evidence: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/ai-components.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L1)

- **Mention/token editing and suggestions** — layer 3; **1 systems**; Area **not-found**; **consider**. Separate rich editor scope from ordinary textarea composition. Evidence: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/ai-components.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L1)

- **Voice input action** — layer 3; **1 systems**; Area **partial**; **consider**. Action slots exist; recording/recognition behavior does not. Evidence: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/ai-components.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L1)

- **Disclaimer/footer content** — layer 3; **1 systems**; Area **partial**; **retain**. A stacked internal footer exists, but no public freeform disclaimer/footer-content slot. Evidence: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/ai-components.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — composition

- [component/source](https://www.untitledui.com/react/components/messaging) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — composition

- [component/source](https://react-spectrum.adobe.com/ai-components.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Scope: current App Home web components; retired React component names are not substituted.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:188 — composer](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L188)

- [docs/specs/composer.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L1)

- [docs/specs/composer.md:7 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L7)

- [docs/specs/composer.md:23 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L23)

- [docs/specs/composer.md:51 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L51)

- [docs/specs/composer.md:66 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/composer.md#L66)

- [packages/react/src/components/Composer.tsx:6 — React API and behavior](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/react/src/components/Composer.tsx#L6)
