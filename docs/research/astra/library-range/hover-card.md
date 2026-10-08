# Hover Card — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Show supplemental preview information on hover or focus. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L12)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **shadcn/ui** (component): `side`: `top`, `right`, `bottom`, `left` [shadcn/ui 1](https://ui.shadcn.com/docs/components/hover-card.md)

- **Radix Themes** (component): `size`: `1`, `2`, `3` [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/hover-card)

- **Base UI** (headless): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Base UI 1](https://base-ui.com/react/components/preview-card.md)

<details>

<summary>Base UI: additional/source-part API enum inventory</summary>

- Root / `open`: `false`, `true`. [API](https://base-ui.com/react/components/preview-card.md)

- Positioner / `disableAnchorTracking`: `false`, `true`. [API](https://base-ui.com/react/components/preview-card.md)

- Handle / `isOpen`: `false`, `true`. [API](https://base-ui.com/react/components/preview-card.md)

</details>

- **Mantine** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Mantine 1](https://mantine.dev/llms/core-hover-card.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

  Docs warn that hover cards are inaccessible with keyboard; essential content must remain available elsewhere.

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `closeOnClickOutside`: `false`, `true`. [API](https://mantine.dev/llms/core-hover-card.md)

- Props / `closeOnEscape`: `false`, `true`. [API](https://mantine.dev/llms/core-hover-card.md)

- Props / `disabled`: `false`, `true`. [API](https://mantine.dev/llms/core-hover-card.md)

- Props / `hideDetached`: `false`, `true`. [API](https://mantine.dev/llms/core-hover-card.md)

- Props / `returnFocus`: `false`, `true`. [API](https://mantine.dev/llms/core-hover-card.md)

- Props / `trapFocus`: `false`, `true`. [API](https://mantine.dev/llms/core-hover-card.md)

- Props / `withArrow`: `false`, `true`. [API](https://mantine.dev/llms/core-hover-card.md)

- Props / `withOverlay`: `false`, `true`. [API](https://mantine.dev/llms/core-hover-card.md)

- Props / `withRoles`: `false`, `true`. [API](https://mantine.dev/llms/core-hover-card.md)

- Props / `withinPortal`: `false`, `true`. [API](https://mantine.dev/llms/core-hover-card.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (adjacent): `trigger`: `hover`, `focus`, `click` [Ant Design 1](https://ant.design/components/popover)

  Popover supplies an adjacent interactive-popup pattern, not a dedicated HoverCard.

- **Chakra/Ark** (component): `size`: `xs`, `sm`, `md`, `lg`; `disabled`: `false`, `true` [Chakra/Ark 1](https://chakra-ui.com/docs/components/hover-card)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `size`: `xs`, `sm`, `md`, `lg`. [API](https://chakra-ui.com/docs/components/hover-card)

- `disabled`: `false`, `true`. [API](https://chakra-ui.com/docs/components/hover-card)

- `open`: `false`, `true`. [API](https://chakra-ui.com/docs/components/hover-card)

- `unmountOnExit`: `false`, `true`. [API](https://chakra-ui.com/docs/components/hover-card)

</details>

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/popovers.json)

  Popover is broader than a hover-only preview; no delay numeric value inferred.

## Structural alternatives

- **shadcn/ui** (component): trigger; content. [shadcn/ui 1](https://ui.shadcn.com/docs/components/hover-card.md)

- **Radix Themes** (component): trigger; content; inset media. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/hover-card)

- **Base UI** (headless): trigger; positioner; popup; arrow; portal. [Base UI 1](https://base-ui.com/react/components/preview-card.md)

- **Mantine** (component): target; dropdown; arrow; group. [Mantine 1](https://mantine.dev/llms/core-hover-card.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (adjacent): title; content; arrow; placement. [Ant Design 1](https://ant.design/components/popover)

- **Chakra/Ark** (component): arrow; multiple triggers; placement. [Chakra/Ark 1](https://chakra-ui.com/docs/components/hover-card)

- **Apple HIG** (guidance): popover; transient contextual content. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/popovers.json)

## Interaction patterns

- **shadcn/ui** (component): configurable opening and closing delay; hover preview. [shadcn/ui 1](https://ui.shadcn.com/docs/components/hover-card.md)

- **Radix Themes** (component): inherits HoverCard primitive behavior. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/hover-card)

- **Base UI** (headless): hover preview; open and close delays; collision positioning. [Base UI 1](https://base-ui.com/react/components/preview-card.md)

- **Mantine** (component): open and close delay; hover content. [Mantine 1](https://mantine.dev/llms/core-hover-card.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (adjacent): hover/focus/click popup; controlled open. [Ant Design 1](https://ant.design/components/popover)

- **Chakra/Ark** (component): open/close delays; supplemental hover content. [Chakra/Ark 1](https://chakra-ui.com/docs/components/hover-card)

- **Apple HIG** (guidance): outside dismissal; remain for multiple selections; save on close. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/popovers.json)

## Area today

Four-side Popover placement; person/page/source previews; delayed hover and focus-visible opening; Escape/blur closes. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L7), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L12), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L19), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L34)

No interactive-only content contract, coordinated hover group or explicit touch activation recipe. Screen-reader users must already receive essential information outside the preview. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L468), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L1)

**Owner boundary:** This is supplemental content, not a place to hide unique actions. [decision 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L7)

- **hoverCard manifest:** no design-time variant enum. [packages/styles/src/manifest.ts:468](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L468)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Four-side placement** — layer 2; **3 systems**; Area **yes**; **retain**. Existing Popover positioning. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/hover-card.md), [Radix Themes](https://www.radix-ui.com/themes/docs/components/hover-card), [Chakra/Ark](https://chakra-ui.com/docs/components/hover-card). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L1)

- **Open and close delays** — layer 3; **5 systems**; Area **yes**; **retain**. Existing delayed preview behavior. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/hover-card.md), [Radix Themes](https://www.radix-ui.com/themes/docs/components/hover-card), [Base UI](https://base-ui.com/react/components/preview-card.md), [Mantine](https://mantine.dev/llms/core-hover-card.md), [Chakra/Ark](https://chakra-ui.com/docs/components/hover-card). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L1)

- **Rich person/page preview** — layer 3; **4 systems**; Area **yes**; **retain**. Existing recipes. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/hover-card.md), [Radix Themes](https://www.radix-ui.com/themes/docs/components/hover-card), [Base UI](https://base-ui.com/react/components/preview-card.md), [Chakra/Ark](https://chakra-ui.com/docs/components/hover-card). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L1)

- **Coordinated hover group** — layer 3; **1 systems**; Area **not-found**; **consider**. Shared delay improves scanning; keep content supplemental. Evidence: [Mantine](https://mantine.dev/llms/core-hover-card.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L1)

- **Click/touch activation** — layer 3; **0 systems**; Area **not-applicable**; **consider**. Use Popover for interactive content; adjacent guidance is not HoverCard parity. Evidence: [Ant Design [excluded: adjacent]](https://ant.design/components/popover), [Apple HIG [excluded: guidance]](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/popovers.json). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/hover-card.md) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — component

- [component/source](https://www.radix-ui.com/themes/docs/components/hover-card) — read; checked 2026-09-28.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — headless

- [component/source](https://base-ui.com/react/components/preview-card.md) — read; checked 2026-09-28.

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

### Carbon — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/core-hover-card.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — adjacent

- [component/source](https://ant.design/components/popover) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/hover-card) — read; checked 2026-09-28.

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

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/popovers.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:468 — hoverCard](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L468)

- [docs/specs/hover-card.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L1)

- [docs/specs/hover-card.md:7 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L7)

- [docs/specs/hover-card.md:12 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L12)

- [docs/specs/hover-card.md:19 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L19)

- [docs/specs/hover-card.md:34 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/hover-card.md#L34)
