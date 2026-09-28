# Breadcrumb — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Show linked ancestors and the current location. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L16)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (component): `treatment`: `text`, `text-with-line`, `button`; `separator`: `chevron`, `slash` [Untitled UI 1](https://www.untitledui.com/react/components/breadcrumbs)

- **shadcn/ui** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [shadcn/ui 1](https://ui.shadcn.com/docs/components/breadcrumb.md)

- **React Aria / Spectrum 2** (component): `size`: `M`, `L`; `isDisabled`: `false`, `true` [React Aria / Spectrum 2 1](https://react-aria.adobe.com/Breadcrumbs.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/Breadcrumbs.md)

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- Breadcrumbs / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/Breadcrumbs.md)

- Breadcrumbs / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/Breadcrumbs.md)

- Breadcrumbs / `size`: `L`, `M`. [API](https://react-spectrum.adobe.com/Breadcrumbs.md)

</details>

- **Fluent 2** (component): `size`: `small`, `medium`, `large`; `focusMode`: `arrow`, `tab` [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/breadcrumb/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-breadcrumb/library/src/components/Breadcrumb/Breadcrumb.types.ts)

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `focusMode`: `arrow`, `tab`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-breadcrumb/library/src/components/Breadcrumb/Breadcrumb.types.ts)

- `size`: `small`, `medium`, `large`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-breadcrumb/library/src/components/Breadcrumb/Breadcrumb.types.ts)

</details>

- **Primer** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Primer 1](https://primer.style/product/components/breadcrumbs)

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `overflow`: `wrap`, `menu`, `menu-with-root`. [API](https://primer.style/product/components/breadcrumbs)

- `selected`: `false`, `true`. [API](https://primer.style/product/components/breadcrumbs)

</details>

- **Carbon** (component): `size`: `small`, `medium` [Carbon 1](https://carbondesignsystem.com/components/breadcrumb/usage)

- **Mantine** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Mantine 1](https://mantine.dev/llms/core-breadcrumbs.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Ant Design 1](https://ant.design/components/breadcrumb)

- **Chakra/Ark** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Chakra/Ark 1](https://chakra-ui.com/docs/components/breadcrumb)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `variant`: `underline`, `plain`. [API](https://chakra-ui.com/docs/components/breadcrumb)

- `size`: `sm`, `md`, `lg`. [API](https://chakra-ui.com/docs/components/breadcrumb)

</details>

- **Atlassian** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Atlassian 1](https://atlassian.design/components/breadcrumbs/examples)

- **GOV.UK** (component): `inverse`: `false`, `true`; `collapseOnMobile`: `false`, `true` [GOV.UK 1](https://design-system.service.gov.uk/components/breadcrumbs)

- **Apple HIG** (guidance): `style`: `standard`, `pop-up` [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/path-controls.json)

  Path controls are macOS conventions.

## Structural alternatives

- **Untitled UI** (component): collapsed path; account button. [Untitled UI 1](https://www.untitledui.com/react/components/breadcrumbs)

- **shadcn/ui** (component): custom separator; dropdown; collapsed ellipsis; responsive trail; link composition. [shadcn/ui 1](https://ui.shadcn.com/docs/components/breadcrumb.md)

- **React Aria / Spectrum 2** (component): overflow menu; root item; current item. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/Breadcrumbs.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/Breadcrumbs.md)

- **Fluent 2** (component): separator; overflow menu. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/breadcrumb/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-breadcrumb/library/src/components/Breadcrumb/Breadcrumb.types.ts)

- **Primer** (component): linked trail; current item. [Primer 1](https://primer.style/product/components/breadcrumbs)

- **Carbon** (component): linked trail; overflow; truncation. [Carbon 1](https://carbondesignsystem.com/components/breadcrumb/usage)

- **Mantine** (component): custom separator; separator spacing. [Mantine 1](https://mantine.dev/llms/core-breadcrumbs.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): custom separator; dropdown; route items; custom item renderer. [Ant Design 1](https://ant.design/components/breadcrumb)

- **Chakra/Ark** (component): custom separator; ellipsis; menu overflow; icon. [Chakra/Ark 1](https://chakra-ui.com/docs/components/breadcrumb)

- **Atlassian** (component): collapsed trail; icons before/after; max items; truncation. [Atlassian 1](https://atlassian.design/components/breadcrumbs/examples)

- **GOV.UK** (component): linked trail; current item; mobile collapse. [GOV.UK 1](https://design-system.service.gov.uk/components/breadcrumbs)

- **Apple HIG** (guidance): path icons and names; collapsed names; pop-up hierarchy. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/path-controls.json)

## Interaction patterns

- **Untitled UI** (component): linked ancestors. [Untitled UI 1](https://www.untitledui.com/react/components/breadcrumbs)

- **shadcn/ui** (component): navigate ancestors; overflow menu. [shadcn/ui 1](https://ui.shadcn.com/docs/components/breadcrumb.md)

- **React Aria / Spectrum 2** (component): links; responsive overflow. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/Breadcrumbs.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/Breadcrumbs.md)

- **Fluent 2** (component): arrow navigation or individual tab stops. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/breadcrumb/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-breadcrumb/library/src/components/Breadcrumb/Breadcrumb.types.ts)

- **Primer** (component): navigation. [Primer 1](https://primer.style/product/components/breadcrumbs)

- **Carbon** (component): navigation. [Carbon 1](https://carbondesignsystem.com/components/breadcrumb/usage)

- **Mantine** (component): child links. [Mantine 1](https://mantine.dev/llms/core-breadcrumbs.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): navigation. [Ant Design 1](https://ant.design/components/breadcrumb)

- **Chakra/Ark** (component): linked trail. [Chakra/Ark 1](https://chakra-ui.com/docs/components/breadcrumb)

- **Atlassian** (component): expand overflow; controlled expansion. [Atlassian 1](https://atlassian.design/components/breadcrumbs/examples)

- **GOV.UK** (component): navigation. [GOV.UK 1](https://design-system.service.gov.uk/components/breadcrumbs)

- **Apple HIG** (guidance): navigation; editable path drag/drop. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/path-controls.json)

## Area today

Text trail, icons and a collapsed ellipsis marker; current location uses page semantics. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L7), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L16), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L21), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L65), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L85)

The collapsed marker is decorative: there is no implemented overflow menu. No alternate separator or button treatment. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L172), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L1)

**Owner boundary:** Owner chose chevrons and text; slash separator, button treatment and a line container were excluded. [decision 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L7)

- **breadcrumb manifest:** no design-time variant enum. [packages/styles/src/manifest.ts:172](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L172)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Custom separator** — layer 2; **4 systems**; Area **owner-decision**; **owner**. Area intentionally uses a chevron; slash/custom is optional reconsideration. Evidence: [Untitled UI](https://www.untitledui.com/react/components/breadcrumbs), [shadcn/ui](https://ui.shadcn.com/docs/components/breadcrumb.md), [Mantine](https://mantine.dev/llms/core-breadcrumbs.md), [Ant Design](https://ant.design/components/breadcrumb). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L1)

- **Button-style ancestors** — layer 2; **1 systems**; Area **owner-decision**; **owner**. Text-only treatment is the current decision. Evidence: [Untitled UI](https://www.untitledui.com/react/components/breadcrumbs). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L1)

- **Linked ancestors and current item** — layer 3; **9 systems**; Area **yes**; **retain**. Existing semantic trail. Evidence: [Untitled UI](https://www.untitledui.com/react/components/breadcrumbs), [shadcn/ui](https://ui.shadcn.com/docs/components/breadcrumb.md), [Primer](https://primer.style/product/components/breadcrumbs), [Carbon](https://carbondesignsystem.com/components/breadcrumb/usage), [Mantine](https://mantine.dev/llms/core-breadcrumbs.md), [Ant Design](https://ant.design/components/breadcrumb), [Chakra/Ark](https://chakra-ui.com/docs/components/breadcrumb), [Atlassian](https://atlassian.design/components/breadcrumbs/examples), [GOV.UK](https://design-system.service.gov.uk/components/breadcrumbs). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L1)

- **Icons beside ancestors** — layer 3; **3 systems**; Area **yes**; **retain**. Existing icon composition. Evidence: [Untitled UI](https://www.untitledui.com/react/components/breadcrumbs), [Chakra/Ark](https://chakra-ui.com/docs/components/breadcrumb), [Atlassian](https://atlassian.design/components/breadcrumbs/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L1)

- **Working overflow disclosure** — layer 3; **6 systems**; Area **partial**; **add**. Current ellipsis is decorative; add a real menu/disclosure contract. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/breadcrumb.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/breadcrumb/usage), [Carbon](https://carbondesignsystem.com/components/breadcrumb/usage), [Ant Design](https://ant.design/components/breadcrumb), [Chakra/Ark](https://chakra-ui.com/docs/components/breadcrumb), [Atlassian](https://atlassian.design/components/breadcrumbs/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L1)

- **Responsive collapse** — layer 3; **2 systems**; Area **not-found**; **add**. No documented mobile collapse policy. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/breadcrumb.md), [GOV.UK](https://design-system.service.gov.uk/components/breadcrumbs). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L1)

- **Truncated long labels** — layer 3; **2 systems**; Area **partial**; **consider**. Need an explicit overflow/reveal contract beyond text layout. Evidence: [Carbon](https://carbondesignsystem.com/components/breadcrumb/usage), [Atlassian](https://atlassian.design/components/breadcrumbs/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — component

- [component/source](https://www.untitledui.com/react/components/breadcrumbs) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/breadcrumb.md) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — component

- [component/source](https://react-aria.adobe.com/Breadcrumbs.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/Breadcrumbs.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — component

- [component/source](https://fluent2.microsoft.design/components/web/react/core/breadcrumb/usage) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-breadcrumb/library/src/components/Breadcrumb/Breadcrumb.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — component

- [component/source](https://primer.style/product/components/breadcrumbs) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — component

- [component/source](https://carbondesignsystem.com/components/breadcrumb/usage) — read; checked 2026-09-28.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/core-breadcrumbs.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — component

- [component/source](https://ant.design/components/breadcrumb) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/breadcrumb) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — component

- [component/source](https://atlassian.design/components/breadcrumbs/examples) — read; checked 2026-09-28.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Scope: current App Home web components; retired React component names are not substituted.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — component

- [component/source](https://design-system.service.gov.uk/components/breadcrumbs) — read; checked 2026-09-28.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/path-controls.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:172 — breadcrumb](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L172)

- [docs/specs/breadcrumb.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L1)

- [docs/specs/breadcrumb.md:7 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L7)

- [docs/specs/breadcrumb.md:16 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L16)

- [docs/specs/breadcrumb.md:21 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L21)

- [docs/specs/breadcrumb.md:65 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L65)

- [docs/specs/breadcrumb.md:85 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/breadcrumb.md#L85)
