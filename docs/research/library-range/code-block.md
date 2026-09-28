# Code Block — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Display preformatted code with optional navigation and utility actions. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L22)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (component): `lineNumbers`: `on`, `off` [Untitled UI 1](https://www.untitledui.com/react/components/code-snippets)

- **Carbon** (component): `kind`: `single-line`, `multiline`; `modifier`: `default`, `light` [Carbon 1](https://carbondesignsystem.com/components/code-snippet/usage)

- **Mantine** (component): `withCopyButton`: `false`, `true`; `withExpandButton`: `false`, `true`; `withLineNumbers`: `false`, `true`; `withFirstLineIndentation`: `false`, `true` [Mantine 1](https://mantine.dev/llms/core-code.md), [Mantine 2](https://mantine.dev/llms/x-code-highlight.md), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `withBorder`: `false`, `true`. [API](https://mantine.dev/llms/core-code.md)

- Props / `withCopyButton`: `false`, `true`. [API](https://mantine.dev/llms/core-code.md)

- Props / `withExpandButton`: `false`, `true`. [API](https://mantine.dev/llms/core-code.md)

- Props / `withFirstLineIndentation`: `false`, `true`. [API](https://mantine.dev/llms/core-code.md)

- Props / `withLineNumbers`: `false`, `true`. [API](https://mantine.dev/llms/core-code.md)

- Props / `withBorder`: `false`, `true`. [API](https://mantine.dev/llms/x-code-highlight.md)

- Props / `withCopyButton`: `false`, `true`. [API](https://mantine.dev/llms/x-code-highlight.md)

- Props / `withExpandButton`: `false`, `true`. [API](https://mantine.dev/llms/x-code-highlight.md)

- Props / `withFirstLineIndentation`: `false`, `true`. [API](https://mantine.dev/llms/x-code-highlight.md)

- Props / `withLineNumbers`: `false`, `true`. [API](https://mantine.dev/llms/x-code-highlight.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Chakra/Ark** (component): `variant`: `solid`, `subtle`, `outline`, `surface`, `plain`; `size`: `xs`, `sm`, `md`, `lg` [Chakra/Ark 1](https://chakra-ui.com/docs/components/code-block)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `variant`: `solid`, `subtle`, `outline`, `surface`, `plain`. [API](https://chakra-ui.com/docs/components/code-block)

- `size`: `xs`, `sm`, `md`, `lg`. [API](https://chakra-ui.com/docs/components/code-block)

</details>

- **Atlassian** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Atlassian 1](https://atlassian.design/components/code/code-block/examples)

## Structural alternatives

- **Untitled UI** (component): show-more collapse; language tabs; syntax highlighting with Shiki. [Untitled UI 1](https://www.untitledui.com/react/components/code-snippets)

- **Carbon** (component): copy; show more; horizontal scroll; vertical scroll. [Carbon 1](https://carbondesignsystem.com/components/code-snippet/usage)

- **Mantine** (component): syntax adapter; file tabs; file icons; expandable code; custom controls. [Mantine 1](https://mantine.dev/llms/core-code.md), [Mantine 2](https://mantine.dev/llms/x-code-highlight.md), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Chakra/Ark** (component): title; copy action; line numbers; line highlight; line focus; diff; max-lines collapse; language switcher; floating copy; tabs; wrap. [Chakra/Ark 1](https://chakra-ui.com/docs/components/code-block)

- **Atlassian** (component): language highlighting; line numbers; line highlight; line wrap. [Atlassian 1](https://atlassian.design/components/code/code-block/examples)

## Interaction patterns

- **Untitled UI** (component): expand sample; switch language. [Untitled UI 1](https://www.untitledui.com/react/components/code-snippets)

- **Carbon** (component): copy; expand/collapse. [Carbon 1](https://carbondesignsystem.com/components/code-snippet/usage)

- **Mantine** (component): copy; switch tabs; lazy language loading; Shiki or highlight.js adapter. [Mantine 1](https://mantine.dev/llms/core-code.md), [Mantine 2](https://mantine.dev/llms/x-code-highlight.md), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Chakra/Ark** (component): copy; tab synchronization; Shiki/highlight.js adapters. [Chakra/Ark 1](https://chakra-ui.com/docs/components/code-block)

- **Atlassian** (component): passive display; line wrapping. [Atlassian 1](https://atlassian.design/components/code/code-block/examples)

## Area today

Filename/language/no header; language selector or tabs; line numbers; highlighted/added/removed lines; line links; wrap; collapse; flush. Copy and keyboard tab switching. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L8), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L22), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L29), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L90), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L123)

No syntax engine bundled; highlighted HTML can be supplied. Copy failure is not announced in the current documented behavior. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L632), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L1)

- **codeBlock manifest:** no design-time variant enum; boolean modifiers: `flush`, `wrap`, `unnumbered`; runtime states: `collapsed`. [packages/styles/src/manifest.ts:632](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L632)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Optional line numbers** — layer 2; **4 systems**; Area **yes**; **retain**. Existing numbered/unnumbered layout. Evidence: [Untitled UI](https://www.untitledui.com/react/components/code-snippets), [Mantine](https://mantine.dev/llms/core-code.md), [Chakra/Ark](https://chakra-ui.com/docs/components/code-block), [Atlassian](https://atlassian.design/components/code/code-block/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L1)

- **Wrap versus horizontal scroll** — layer 2; **3 systems**; Area **yes**; **retain**. Existing wrap behavior. Evidence: [Carbon](https://carbondesignsystem.com/components/code-snippet/usage), [Chakra/Ark](https://chakra-ui.com/docs/components/code-block), [Atlassian](https://atlassian.design/components/code/code-block/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L1)

- **File/language tabs** — layer 3; **3 systems**; Area **yes**; **retain**. Existing tabs and language selector. Evidence: [Untitled UI](https://www.untitledui.com/react/components/code-snippets), [Mantine](https://mantine.dev/llms/core-code.md), [Chakra/Ark](https://chakra-ui.com/docs/components/code-block). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L1)

- **Copy action** — layer 3; **3 systems**; Area **yes**; **retain**. Keep success feedback and address failure announcement separately. Evidence: [Carbon](https://carbondesignsystem.com/components/code-snippet/usage), [Mantine](https://mantine.dev/llms/core-code.md), [Chakra/Ark](https://chakra-ui.com/docs/components/code-block). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L1)

- **Expand/collapse long code** — layer 3; **4 systems**; Area **yes**; **retain**. Existing collapse. Evidence: [Untitled UI](https://www.untitledui.com/react/components/code-snippets), [Carbon](https://carbondesignsystem.com/components/code-snippet/usage), [Mantine](https://mantine.dev/llms/core-code.md), [Chakra/Ark](https://chakra-ui.com/docs/components/code-block). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L1)

- **Highlighted and diff lines** — layer 3; **1 systems**; Area **yes**; **retain**. Existing highlight/add/remove states. Evidence: [Chakra/Ark](https://chakra-ui.com/docs/components/code-block). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L1)

- **Bundled syntax adapter** — layer 3; **4 systems**; Area **partial**; **consider**. Area accepts pre-highlighted HTML; a bundled adapter would add dependency/runtime scope. Evidence: [Untitled UI](https://www.untitledui.com/react/components/code-snippets), [Mantine](https://mantine.dev/llms/core-code.md), [Chakra/Ark](https://chakra-ui.com/docs/components/code-block), [Atlassian](https://atlassian.design/components/code/code-block/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L1)

- **Stable line links** — layer 3; **0 systems**; Area **yes**; **retain**. Existing Area feature; no verified peer counted in this scan. Evidence: [Area basis 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L632); no verified equivalent counted in this scan. [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — component

- [component/source](https://www.untitledui.com/react/components/code-snippets) — read; checked 2026-09-28.

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

### React Aria / Spectrum 2 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — component

- [component/source](https://carbondesignsystem.com/components/code-snippet/usage) — read; checked 2026-09-28.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/core-code.md) — read; checked 2026-09-28.

- [component/source](https://mantine.dev/llms/x-code-highlight.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/code-block) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — component

- [component/source](https://atlassian.design/components/code/code-block/examples) — read; checked 2026-09-28.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Scope: current App Home web components; retired React component names are not substituted.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:632 — codeBlock](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L632)

- [docs/specs/code-block.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L1)

- [docs/specs/code-block.md:8 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L8)

- [docs/specs/code-block.md:22 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L22)

- [docs/specs/code-block.md:29 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L29)

- [docs/specs/code-block.md:90 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L90)

- [docs/specs/code-block.md:123 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code-block.md#L123)
