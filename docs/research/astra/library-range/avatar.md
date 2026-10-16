# Avatar — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Identify a person or entity in a small visual slot. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L17)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (component): `size`: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`; `status`: `online`, `offline`; `border`: `false`, `true`; `verified`: `false`, `true` [Untitled UI 1](https://www.untitledui.com/react/components/avatars)

- **shadcn/ui** (component): `size`: `default`, `sm`, `lg` [shadcn/ui 1](https://ui.shadcn.com/docs/components/avatar.md)

<details>

<summary>shadcn/ui: additional/source-part API enum inventory</summary>

- Avatar / `size`: `default`, `sm`, `lg`. [API](https://ui.shadcn.com/docs/components/avatar.md)

</details>

- **Radix Themes** (component): `size`: `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`; `variant`: `solid`, `soft`; `radius`: `none`, `small`, `medium`, `large`, `full`; `highContrast`: `false`, `true` [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/avatar), [Radix Themes 2](https://raw.githubusercontent.com/radix-ui/themes/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/avatar.props.tsx)

<details>

<summary>Radix Themes: additional/source-part API enum inventory</summary>

- `variant`: `solid`, `soft`. [API](https://www.radix-ui.com/themes/docs/components/avatar)

- `highContrast`: `false`, `true`. [API](https://www.radix-ui.com/themes/docs/components/avatar)

- `radius`: `none`, `small`, `medium`, `large`, `full`. [API](https://www.radix-ui.com/themes/docs/components/avatar)

</details>

- **Base UI** (headless): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Base UI 1](https://base-ui.com/react/components/avatar.md)

- **React Aria / Spectrum 2** (component): `isOverBackground`: `false`, `true` [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/Avatar.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/AvatarGroup.md)

  Spectrum 2 Avatar and AvatarGroup; sizes are supplied by their API/styles.

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- API / `isOverBackground`: `false`, `true`. [API](https://react-spectrum.adobe.com/Avatar.md)

</details>

- **Fluent 2** (component): `active`: `active`, `inactive`, `unset`; `activeAppearance`: `ring`, `shadow`, `ring-shadow`; `color`: `neutral`, `brand`, `colorful`, `named-color`; `groupLayout`: `spread`, `stack`, `pie` [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/avatar/usage), [Fluent 2 2](https://fluent2.microsoft.design/components/web/react/core/avatargroup/usage), [Fluent 2 3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-avatar/library/src/components/Avatar/Avatar.types.ts), [Fluent 2 4](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-avatar/library/src/components/AvatarGroup/AvatarGroup.types.ts)

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `activeAppearance`: `ring`, `shadow`, `ring-shadow`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-avatar/library/src/components/Avatar/Avatar.types.ts)

- `color`: `neutral`, `brand`, `colorful`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-avatar/library/src/components/Avatar/Avatar.types.ts)

</details>

- **Primer** (component): `square`: `false`, `true`; `groupAlign`: `left`, `right`; `disableExpand`: `false`, `true`; `stackVariant`: `cascade`, `stack`; `stackShape`: `circle`, `square`; `size`: `number`, `responsive-map` [Primer 1](https://primer.style/product/components/avatar), [Primer 2](https://primer.style/product/components/avatar-stack)

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `alignRight`: `false`, `true`. [API](https://primer.style/product/components/avatar-stack)

- `disableExpand`: `false`, `true`. [API](https://primer.style/product/components/avatar-stack)

- `variant`: `cascade`, `stack`. [API](https://primer.style/product/components/avatar-stack)

- `shape`: `circle`, `square`. [API](https://primer.style/product/components/avatar-stack)

</details>

- **Mantine** (component): `color`: `theme-color`, `CSS-color`, `initials`; `variant`: `filled`, `light`, `gradient`, `outline`, `transparent`, `default`, `white`; `size`: `xs`, `sm`, `md`, `lg`, `xl`; `radius`: `xs`, `sm`, `md`, `lg`, `xl`, `custom-key-or-number` [Mantine 1](https://mantine.dev/llms/core-avatar.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Avatar/Avatar.tsx), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `autoContrast`: `false`, `true`. [API](https://mantine.dev/llms/core-avatar.md)

- Props / `color`: `initials`. [API](https://mantine.dev/llms/core-avatar.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (component): `shape`: `circle`, `square`; `size`: `small`, `medium`, `large`, `number`, `responsive-map` [Ant Design 1](https://ant.design/components/avatar)

- **Chakra/Ark** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Chakra/Ark 1](https://chakra-ui.com/docs/components/avatar)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `size`: `full`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. [API](https://chakra-ui.com/docs/components/avatar)

- `variant`: `solid`, `subtle`, `outline`. [API](https://chakra-ui.com/docs/components/avatar)

- `shape`: `square`, `rounded`, `full`. [API](https://chakra-ui.com/docs/components/avatar)

</details>

- **Atlassian** (component): `appearance`: `circle`, `hexagon`, `square`; `size`: `xxsmall`, `small`, `medium`, `large`, `xlarge`, `xxlarge`; `presence`: `busy`, `focus`, `offline`, `online`; `status`: `approved`, `declined`, `locked`, `warning`; `groupAppearance`: `stack`, `grid` [Atlassian 1](https://atlassian.design/components/avatar/examples), [Atlassian 2](https://atlassian.design/components/avatar-group/examples)

  xsmall is labelled legacy in the inspected examples.

- **Polaris** (component): `size`: `small`, `small-200`, `small-100`, `base`, `large`, `large-100`, `large-200` [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/avatar.md)

## Structural alternatives

- **Untitled UI** (component): image; initials; placeholder icon; custom fallback; company badge; name and email label group; stacked group with add action; profile photo. [Untitled UI 1](https://www.untitledui.com/react/components/avatars)

- **shadcn/ui** (component): image; fallback; badge; avatar group; overflow count. [shadcn/ui 1](https://ui.shadcn.com/docs/components/avatar.md)

- **Radix Themes** (component): image; fallback text; fallback icon. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/avatar), [Radix Themes 2](https://raw.githubusercontent.com/radix-ui/themes/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/avatar.props.tsx)

- **Base UI** (headless): image; fallback; stacking; lazy-loaded image. [Base UI 1](https://base-ui.com/react/components/avatar.md)

- **React Aria / Spectrum 2** (component): image; avatar group. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/Avatar.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/AvatarGroup.md)

- **Fluent 2** (component): image; initials; icon; presence badge; overflow group. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/avatar/usage), [Fluent 2 2](https://fluent2.microsoft.design/components/web/react/core/avatargroup/usage), [Fluent 2 3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-avatar/library/src/components/Avatar/Avatar.types.ts), [Fluent 2 4](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-avatar/library/src/components/AvatarGroup/AvatarGroup.types.ts)

- **Primer** (component): image; stack; overflow. [Primer 1](https://primer.style/product/components/avatar), [Primer 2](https://primer.style/product/components/avatar-stack)

- **Mantine** (component): image; initials; custom placeholder; overlapping group. [Mantine 1](https://mantine.dev/llms/core-avatar.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Avatar/Avatar.tsx), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): image; icon; letter; group overflow. [Ant Design 1](https://ant.design/components/avatar)

- **Chakra/Ark** (component): image; fallback; initials; avatar group; overflow; badge. [Chakra/Ark 1](https://chakra-ui.com/docs/components/avatar)

- **Atlassian** (component): image; fallback; presence; status; group; overflow; tooltip. [Atlassian 1](https://atlassian.design/components/avatar/examples), [Atlassian 2](https://atlassian.design/components/avatar-group/examples)

- **Polaris** (component): image; initials. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/avatar.md)

## Interaction patterns

- **Untitled UI** (component): image-error fallback. [Untitled UI 1](https://www.untitledui.com/react/components/avatars)

- **shadcn/ui** (component): image fallback. [shadcn/ui 1](https://ui.shadcn.com/docs/components/avatar.md)

- **Radix Themes** (component): image loading fallback. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/avatar), [Radix Themes 2](https://raw.githubusercontent.com/radix-ui/themes/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/avatar.props.tsx)

- **Base UI** (headless): image loading status; fallback delay. [Base UI 1](https://base-ui.com/react/components/avatar.md)

- **React Aria / Spectrum 2** (component): accessible entity image. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/Avatar.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/AvatarGroup.md)

- **Fluent 2** (component): active participant announcement; fallback initials. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/avatar/usage), [Fluent 2 2](https://fluent2.microsoft.design/components/web/react/core/avatargroup/usage), [Fluent 2 3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-avatar/library/src/components/Avatar/Avatar.types.ts), [Fluent 2 4](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-avatar/library/src/components/AvatarGroup/AvatarGroup.types.ts)

- **Primer** (component): stack expansion on hover. [Primer 1](https://primer.style/product/components/avatar), [Primer 2](https://primer.style/product/components/avatar-stack)

- **Mantine** (component): deterministic initials color; image fallback. [Mantine 1](https://mantine.dev/llms/core-avatar.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Avatar/Avatar.tsx), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): image error fallback; letter auto-fit. [Ant Design 1](https://ant.design/components/avatar)

- **Chakra/Ark** (component): image loading fallback. [Chakra/Ark 1](https://chakra-ui.com/docs/components/avatar)

- **Atlassian** (component): disabled; overflow activation. [Atlassian 1](https://atlassian.design/components/avatar/examples), [Atlassian 2](https://atlassian.design/components/avatar-group/examples)

- **Polaris** (component): load/error events. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/avatar.md)

## Area today

Circle/square; sm/md/lg; neutral/accent/inverse; image, icon or initials; active ring; stacked AvatarGroup with overflow. Presence and counts compose Indicator. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L8), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L17), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L24), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L82), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L116)

No dedicated persona row, pie/grid group, stack hover expansion or separate treatment axis documented. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L361), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L374), [baseline 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L1)

- **avatar manifest:** `size` = `sm`, `md`, `lg`; `shape` = `circle`, `square`; `tone` = `neutral`, `accent`, `inverse`; boolean modifiers: `active`. [packages/styles/src/manifest.ts:361](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L361)

- **avatarGroup manifest:** no design-time variant enum. [packages/styles/src/manifest.ts:374](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L374)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Circle and square shapes** — layer 2; **5 systems**; Area **yes**; **retain**. Both shapes exist. Evidence: [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/avatar/usage), [Primer](https://primer.style/product/components/avatar), [Ant Design](https://ant.design/components/avatar), [Atlassian](https://atlassian.design/components/avatar/examples), [Chakra/Ark](https://chakra-ui.com/docs/components/avatar). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L1)

- **Soft and solid placeholder treatments** — layer 2; **2 systems**; Area **partial**; **consider**. Current tones and fallback paint are not a separate treatment axis. Evidence: [Radix Themes](https://www.radix-ui.com/themes/docs/components/avatar), [Chakra/Ark](https://chakra-ui.com/docs/components/avatar). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L1)

- **Expanded size ladder** — layer 2; **9 systems**; Area **partial**; **consider**. Area has sm/md/lg; use density and content needs to decide extra tiers. Evidence: [Untitled UI](https://www.untitledui.com/react/components/avatars), [Radix Themes](https://www.radix-ui.com/themes/docs/components/avatar), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/avatar/usage), [Primer](https://primer.style/product/components/avatar), [Mantine](https://mantine.dev/llms/core-avatar.md), [Ant Design](https://ant.design/components/avatar), [Chakra/Ark](https://chakra-ui.com/docs/components/avatar), [Atlassian](https://atlassian.design/components/avatar/examples), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/avatar.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L1)

- **Image, initials and icon fallback** — layer 3; **8 systems**; Area **yes**; **retain**. Current fallback chain covers these. Evidence: [Untitled UI](https://www.untitledui.com/react/components/avatars), [shadcn/ui](https://ui.shadcn.com/docs/components/avatar.md), [Radix Themes](https://www.radix-ui.com/themes/docs/components/avatar), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Avatar.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/avatar/usage), [Mantine](https://mantine.dev/llms/core-avatar.md), [Chakra/Ark](https://chakra-ui.com/docs/components/avatar), [Ant Design](https://ant.design/components/avatar). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L1)

- **Attached presence/status** — layer 3; **4 systems**; Area **yes**; **retain**. Compose Indicator rather than duplicate status paint. Evidence: [Untitled UI](https://www.untitledui.com/react/components/avatars), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/avatar/usage), [Atlassian](https://atlassian.design/components/avatar/examples), [Chakra/Ark](https://chakra-ui.com/docs/components/avatar). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L1)

- **Stacked group with overflow** — layer 3; **7 systems**; Area **yes**; **retain**. AvatarGroup already provides stack and overflow. Evidence: [Untitled UI](https://www.untitledui.com/react/components/avatars), [shadcn/ui](https://ui.shadcn.com/docs/components/avatar.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/avatar/usage), [Mantine](https://mantine.dev/llms/core-avatar.md), [Ant Design](https://ant.design/components/avatar), [Chakra/Ark](https://chakra-ui.com/docs/components/avatar), [Atlassian](https://atlassian.design/components/avatar/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L1)

- **Persona row with name and metadata** — layer 3; **2 systems**; Area **partial**; **add**. Can compose today; no named persona layout contract. Evidence: [Untitled UI](https://www.untitledui.com/react/components/avatars), [Chakra/Ark](https://chakra-ui.com/docs/components/avatar). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L1)

- **Grid or pie group layout** — layer 3; **2 systems**; Area **not-found**; **consider**. Current group is stacked. Evidence: [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/avatar/usage), [Atlassian](https://atlassian.design/components/avatar/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L1)

- **Expand stack on hover** — layer 3; **1 systems**; Area **not-found**; **consider**. Also require keyboard and touch access if adopted. Evidence: [Primer](https://primer.style/product/components/avatar). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — component

- [component/source](https://www.untitledui.com/react/components/avatars) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/avatar.md) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — component

- [component/source](https://www.radix-ui.com/themes/docs/components/avatar) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/radix-ui/themes/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/avatar.props.tsx) — read; checked 2026-09-28.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — headless

- [component/source](https://base-ui.com/react/components/avatar.md) — read; checked 2026-09-28.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — component

- [component/source](https://react-spectrum.adobe.com/Avatar.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/AvatarGroup.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — component

- [component/source](https://fluent2.microsoft.design/components/web/react/core/avatar/usage) — read; checked 2026-09-28.

- [component/source](https://fluent2.microsoft.design/components/web/react/core/avatargroup/usage) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-avatar/library/src/components/Avatar/Avatar.types.ts) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-avatar/library/src/components/AvatarGroup/AvatarGroup.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — component

- [component/source](https://primer.style/product/components/avatar) — read; checked 2026-09-28.

- [component/source](https://primer.style/product/components/avatar-stack) — read; checked 2026-09-28.

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

- [component/source](https://mantine.dev/llms/core-avatar.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Avatar/Avatar.tsx) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — component

- [component/source](https://ant.design/components/avatar) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/avatar) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — component

- [component/source](https://atlassian.design/components/avatar/examples) — read; checked 2026-09-28.

- [component/source](https://atlassian.design/components/avatar-group/examples) — read; checked 2026-09-28.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — component

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/avatar.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:361 — avatar](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L361)

- [packages/styles/src/manifest.ts:374 — avatarGroup](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L374)

- [docs/specs/avatar.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L1)

- [docs/specs/avatar.md:8 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L8)

- [docs/specs/avatar.md:17 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L17)

- [docs/specs/avatar.md:24 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L24)

- [docs/specs/avatar.md:82 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L82)

- [docs/specs/avatar.md:116 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/avatar.md#L116)
