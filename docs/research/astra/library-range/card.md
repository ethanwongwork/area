# Card — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Group related content and optional actions as a coherent unit. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L34)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (adjacent): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Untitled UI 1](https://www.untitledui.com/react/components/card-headers)

  Card headers are documented recipes; a general card API was not found here.

- **shadcn/ui** (component): `size`: `default`, `sm` [shadcn/ui 1](https://ui.shadcn.com/docs/components/card.md)

<details>

<summary>shadcn/ui: additional/source-part API enum inventory</summary>

- Card / `size`: `default`, `sm`. [API](https://ui.shadcn.com/docs/components/card.md)

</details>

- **Radix Themes** (component): `size`: `1`, `2`, `3`, `4`, `5`; `variant`: `surface`, `classic`, `ghost` [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/card)

<details>

<summary>Radix Themes: additional/source-part API enum inventory</summary>

- `variant`: `surface`, `classic`, `ghost`. [API](https://www.radix-ui.com/themes/docs/components/card)

</details>

- **React Aria / Spectrum 2** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/Card.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/CardView.md)

  CardView behaviors belong to a collection composition, not every Card instance.

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- Card / `allowsArrowNavigation`: `false`, `true`. [API](https://react-spectrum.adobe.com/Card.md)

- Card / `density`: `compact`, `regular`, `spacious`. [API](https://react-spectrum.adobe.com/Card.md)

- Card / `focusMode`: `child`, `row`. [API](https://react-spectrum.adobe.com/Card.md)

- Card / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/Card.md)

- Card / `size`: `L`, `M`, `S`, `XL`, `XS`. [API](https://react-spectrum.adobe.com/Card.md)

- Card / `variant`: `primary`, `quiet`, `secondary`, `tertiary`. [API](https://react-spectrum.adobe.com/Card.md)

- AssetCard / `allowsArrowNavigation`: `false`, `true`. [API](https://react-spectrum.adobe.com/Card.md)

- AssetCard / `focusMode`: `child`, `row`. [API](https://react-spectrum.adobe.com/Card.md)

- AssetCard / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/Card.md)

- AssetCard / `size`: `L`, `M`, `S`, `XL`, `XS`. [API](https://react-spectrum.adobe.com/Card.md)

- AssetCard / `variant`: `primary`, `quiet`, `secondary`, `tertiary`. [API](https://react-spectrum.adobe.com/Card.md)

- UserCard / `allowsArrowNavigation`: `false`, `true`. [API](https://react-spectrum.adobe.com/Card.md)

- UserCard / `focusMode`: `child`, `row`. [API](https://react-spectrum.adobe.com/Card.md)

- UserCard / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/Card.md)

- UserCard / `size`: `L`, `M`, `S`, `XL`, `XS`. [API](https://react-spectrum.adobe.com/Card.md)

- UserCard / `variant`: `primary`, `secondary`, `tertiary`. [API](https://react-spectrum.adobe.com/Card.md)

- ProductCard / `allowsArrowNavigation`: `false`, `true`. [API](https://react-spectrum.adobe.com/Card.md)

- ProductCard / `focusMode`: `child`, `row`. [API](https://react-spectrum.adobe.com/Card.md)

- ProductCard / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/Card.md)

- ProductCard / `size`: `L`, `M`, `S`, `XL`, `XS`. [API](https://react-spectrum.adobe.com/Card.md)

- ProductCard / `variant`: `primary`, `secondary`, `tertiary`. [API](https://react-spectrum.adobe.com/Card.md)

- CardView / `autoFocus`: `false`, `true`. [API](https://react-spectrum.adobe.com/CardView.md)

- CardView / `density`: `compact`, `regular`, `spacious`. [API](https://react-spectrum.adobe.com/CardView.md)

- CardView / `disallowEmptySelection`: `false`, `true`. [API](https://react-spectrum.adobe.com/CardView.md)

- CardView / `selectedKeys`: `all`. [API](https://react-spectrum.adobe.com/CardView.md)

- CardView / `selectionStyle`: `checkbox`, `highlight`. [API](https://react-spectrum.adobe.com/CardView.md)

- CardView / `shouldSelectOnPressUp`: `false`, `true`. [API](https://react-spectrum.adobe.com/CardView.md)

- CardView / `size`: `L`, `M`, `S`, `XL`, `XS`. [API](https://react-spectrum.adobe.com/CardView.md)

- CardView / `variant`: `primary`, `quiet`, `secondary`, `tertiary`. [API](https://react-spectrum.adobe.com/CardView.md)

</details>

- **Fluent 2** (component): `appearance`: `filled`, `filled-alternative`, `outline`, `subtle`; `focusMode`: `off`, `no-tab`, `tab-exit`, `tab-only`; `orientation`: `horizontal`, `vertical`; `size`: `small`, `medium`, `large`; `selected`: `false`, `true`; `disabled`: `false`, `true` [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/card/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-card/library/src/components/Card/Card.types.ts)

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `selected`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-card/library/src/components/Card/Card.types.ts)

- `appearance`: `filled`, `filled-alternative`, `outline`, `subtle`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-card/library/src/components/Card/Card.types.ts)

- `focusMode`: `off`, `no-tab`, `tab-exit`, `tab-only`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-card/library/src/components/Card/Card.types.ts)

- `orientation`: `horizontal`, `vertical`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-card/library/src/components/Card/Card.types.ts)

- `size`: `small`, `medium`, `large`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-card/library/src/components/Card/Card.types.ts)

- `disabled`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-card/library/src/components/Card/Card.types.ts)

</details>

- **Primer** (component): `layout`: `default`, `compact`; `padding`: `none`, `condensed`, `normal`; `borderRadius`: `medium`, `large`; `as`: `div`, `section` [Primer 1](https://primer.style/product/components/card)

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `borderRadius`: `medium`, `large`. [API](https://primer.style/product/components/card)

</details>

- **Carbon** (component): `kind`: `base`, `clickable`, `selectable`, `expandable`; `selection`: `single`, `multiple` [Carbon 1](https://carbondesignsystem.com/components/tile/usage)

- **Material 3** (component): `style`: `elevated`, `filled`, `outlined`; `checkable`: `false`, `true`; `dragged`: `false`, `true` [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Card.md)

  Docs explicitly say checking and dragging behavior is not implemented automatically: callbacks/gesture handling must be added. Drag state is not a drag engine.

- **Mantine** (component): `orientation`: `horizontal`, `vertical`; `withBorder`: `false`, `true` [Mantine 1](https://mantine.dev/llms/core-card.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `orientation`: `horizontal`, `vertical`. [API](https://mantine.dev/llms/core-card.md)

- Props / `withBorder`: `false`, `true`. [API](https://mantine.dev/llms/core-card.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (component): `size`: `default`, `small`; `variant`: `outlined`, `borderless`; `type`: `inner`; `hoverable`: `false`, `true`; `loading`: `false`, `true` [Ant Design 1](https://ant.design/components/card)

- **Chakra/Ark** (component): `variant`: `elevated`, `outline`, `subtle`; `size`: `sm`, `md`, `lg` [Chakra/Ark 1](https://chakra-ui.com/docs/components/card)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `variant`: `elevated`, `outline`, `subtle`. [API](https://chakra-ui.com/docs/components/card)

</details>

- **Polaris** (adjacent): `padding`: `base`, `none` [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section.md)

  Current App Home Section is documented; no claim of parity with retired Polaris React Card.

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/collections.json)

  Collections guidance is adjacent, not a named web Card API.

## Structural alternatives

- **Untitled UI** (adjacent): header with badge; header with avatar and badge. [Untitled UI 1](https://www.untitledui.com/react/components/card-headers)

- **shadcn/ui** (component): header; title; description; action; content; footer; image. [shadcn/ui 1](https://ui.shadcn.com/docs/components/card.md)

- **Radix Themes** (component): inset media; free content; asChild link or button. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/card)

- **React Aria / Spectrum 2** (component): image; preview; title; description; context menu; selection checkbox; CardView collection. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/Card.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/CardView.md)

- **Fluent 2** (component): preview; header; footer; floating action; selection checkbox. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/card/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-card/library/src/components/Card/Card.types.ts)

- **Primer** (component): icon; image; heading; description; metadata; action; list of cards; custom content. [Primer 1](https://primer.style/product/components/card)

- **Carbon** (component): tile; embedded controls; expandable content; AI label. [Carbon 1](https://carbondesignsystem.com/components/tile/usage)

- **Material 3** (component): media; title; supporting text; actions; checked icon. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Card.md)

- **Mantine** (component): Card.Section media; inherited section padding; linked card. [Mantine 1](https://mantine.dev/llms/core-card.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): cover; metadata; avatar; extra action; footer actions; grid; tabs; inner card. [Ant Design 1](https://ant.design/components/card)

- **Chakra/Ark** (component): header; body; footer; media; horizontal card; avatar; form. [Chakra/Ark 1](https://chakra-ui.com/docs/components/card)

- **Polaris** (adjacent): section heading; subheading; graphic; accessory; primary/secondary actions; supplemental metadata; fullbleed children. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section.md)

- **Apple HIG** (guidance): collection items; grid/list content. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/collections.json)

## Interaction patterns

- **Untitled UI** (adjacent): No whole-card behavior found. [Untitled UI 1](https://www.untitledui.com/react/components/card-headers)

- **shadcn/ui** (component): card itself is structural. [shadcn/ui 1](https://ui.shadcn.com/docs/components/card.md)

- **Radix Themes** (component): interactive hover and focus when asChild. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/card)

- **React Aria / Spectrum 2** (component): navigation; single or multiple selection; virtualized collection. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/Card.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/CardView.md)

- **Fluent 2** (component): interactive or selectable; focus mode controls embedded actions. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/card/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-card/library/src/components/Card/Card.types.ts)

- **Primer** (component): section heading association. [Primer 1](https://primer.style/product/components/card)

- **Carbon** (component): activation; selection; expansion. [Carbon 1](https://carbondesignsystem.com/components/tile/usage)

- **Material 3** (component): activation; selection state; drag state. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Card.md)

- **Mantine** (component): polymorphic link or container. [Mantine 1](https://mantine.dev/llms/core-card.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): hover affordance; loading skeleton; tab change. [Ant Design 1](https://ant.design/components/card)

- **Chakra/Ark** (component): structural container. [Chakra/Ark 1](https://chakra-ui.com/docs/components/card)

- **Polaris** (adjacent): semantic heading hierarchy. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section.md)

- **Apple HIG** (guidance): selection; contextual actions. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/collections.json)

## Area today

Vertical/horizontal/compact/immersive; sm/md/lg; inset/bleed media; header, actions, footer, well, list, carousel and overlay recipes. Whole-card link and separate actions are supported; hover actions reveal on focus/touch. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L8), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L34), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L40), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L128), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L168)

No dedicated elevated/outlined treatment axis, selected-card state, collection keyboard engine or drag implementation. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L512), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L1)

- **card manifest:** `layout` = `vertical`, `horizontal`, `compact`, `immersive`; `size` = `sm`, `md`, `lg`. [packages/styles/src/manifest.ts:512](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L512)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Elevated/filled/outlined treatments** — layer 2; **4 systems**; Area **partial**; **consider**. Current card layout and surface do not expose a dedicated treatment axis. Evidence: [Radix Themes](https://www.radix-ui.com/themes/docs/components/card), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/card/usage), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Card.md), [Chakra/Ark](https://chakra-ui.com/docs/components/card). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L1)

- **Compact size/layout** — layer 2; **3 systems**; Area **yes**; **retain**. Existing compact layout and size scale. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/card.md), [Primer](https://primer.style/product/components/card), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/card/usage). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L1)

- **Horizontal media/content layout** — layer 3; **3 systems**; Area **yes**; **retain**. Existing horizontal variant. Evidence: [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/card/usage), [Mantine](https://mantine.dev/llms/core-card.md), [Chakra/Ark](https://chakra-ui.com/docs/components/card). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L1)

- **Image, title, description and actions** — layer 3; **8 systems**; Area **yes**; **retain**. Existing slots and media rules. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/card.md), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Card.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/card/usage), [Primer](https://primer.style/product/components/card), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Card.md), [Mantine](https://mantine.dev/llms/core-card.md), [Chakra/Ark](https://chakra-ui.com/docs/components/card), [Ant Design](https://ant.design/components/card). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L1)

- **Selectable card collection** — layer 3; **3 systems**; Area **not-found**; **add**. Needs collection focus and selection semantics, not just a border. Evidence: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Card.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/card/usage), [Carbon](https://carbondesignsystem.com/components/tile/usage). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L1)

- **Expandable content tile** — layer 3; **1 systems**; Area **partial**; **consider**. Existing body slots do not establish an expandable-card contract. Evidence: [Carbon](https://carbondesignsystem.com/components/tile/usage). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L1)

- **Whole-card navigation with inner actions** — layer 3; **2 systems**; Area **yes**; **retain**. Existing stretched link and separate action handling. Evidence: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Card.md), [Radix Themes](https://www.radix-ui.com/themes/docs/components/card). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L1)

- **Loading skeleton** — layer 2; **1 systems**; Area **partial**; **consider**. Skeleton can compose; no Card loading state contract. Evidence: [Ant Design](https://ant.design/components/card). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L1)

- **Drag visual state** — layer 2; **1 systems**; Area **not-found**; **consider**. Keep visual dragged state separate from an actual drag engine. Evidence: [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Card.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — adjacent

- [component/source](https://www.untitledui.com/react/components/card-headers) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/card.md) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — component

- [component/source](https://www.radix-ui.com/themes/docs/components/card) — read; checked 2026-09-28.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — component

- [component/source](https://react-spectrum.adobe.com/Card.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/CardView.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — component

- [component/source](https://fluent2.microsoft.design/components/web/react/core/card/usage) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-card/library/src/components/Card/Card.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — component

- [component/source](https://primer.style/product/components/card) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — component

- [component/source](https://carbondesignsystem.com/components/tile/usage) — read; checked 2026-09-28.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — component

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [component/source](https://m3.material.io/components/cards/overview) — not found or unusable response; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Card.md) — read; checked 2026-09-28.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/core-card.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — component

- [component/source](https://ant.design/components/card) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/card) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — adjacent

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/collections.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:512 — card](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L512)

- [docs/specs/card.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L1)

- [docs/specs/card.md:8 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L8)

- [docs/specs/card.md:34 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L34)

- [docs/specs/card.md:40 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L40)

- [docs/specs/card.md:128 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L128)

- [docs/specs/card.md:168 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/card.md#L168)
