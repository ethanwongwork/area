# Alert — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Communicate contextual feedback without leaving the current content. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L24)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (component): `tone`: `default`, `brand`, `gray`, `error`, `warning`, `success` [Untitled UI 1](https://www.untitledui.com/react/components/alerts)

  Public example labels are visible; implementation behind Get the code was not accessed.

- **shadcn/ui** (component): `variant`: `default`, `destructive` [shadcn/ui 1](https://ui.shadcn.com/docs/components/alert.md)

<details>

<summary>shadcn/ui: additional/source-part API enum inventory</summary>

- Alert / `variant`: `default`, `destructive`. [API](https://ui.shadcn.com/docs/components/alert.md)

</details>

- **Radix Themes** (component): `size`: `1`, `2`, `3`; `variant`: `soft`, `surface`, `outline`; `highContrast`: `false`, `true` [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/callout)

<details>

<summary>Radix Themes: additional/source-part API enum inventory</summary>

- `variant`: `soft`, `surface`, `outline`. [API](https://www.radix-ui.com/themes/docs/components/callout)

- `highContrast`: `false`, `true`. [API](https://www.radix-ui.com/themes/docs/components/callout)

</details>

- **React Aria / Spectrum 2** (component): `variant`: `informative`, `negative`, `neutral`, `notice`, `positive`; `fillStyle`: `boldFill`, `border`, `subtleFill`; `autoFocus`: `false`, `true` [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/InlineAlert.md)

  Styled values are Spectrum 2 InlineAlert; React Aria is headless.

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- InlineAlert / `autoFocus`: `false`, `true`. [API](https://react-spectrum.adobe.com/InlineAlert.md)

- InlineAlert / `variant`: `informative`, `negative`, `neutral`, `notice`, `positive`. [API](https://react-spectrum.adobe.com/InlineAlert.md)

</details>

- **Fluent 2** (component): `shape`: `square`, `rounded`; `politeness`: `assertive`, `polite` [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-message-bar/library/src/components/MessageBar/MessageBar.types.ts)

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `shape`: `square`, `rounded`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-message-bar/library/src/components/MessageBar/MessageBar.types.ts)

</details>

- **Primer** (component): `bannerVariant`: `critical`, `info`, `success`, `upsell`, `warning`; `inlineVariant`: `critical`, `warning`, `success`, `unavailable`; `inlineSize`: `small`, `medium` [Primer 1](https://primer.style/product/components/banner), [Primer 2](https://primer.style/product/components/inline-message)

  InlineMessage is experimental. Its prose/examples say unavailable, but API table misspells unvailable; size prose says default, API says medium.

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `hideTitle`: `false`, `true`. [API](https://primer.style/product/components/banner)

- `variant`: `critical`, `info`, `success`, `upsell`, `warning`. [API](https://primer.style/product/components/banner)

- `size`: `small`, `medium`. [API](https://primer.style/product/components/inline-message)

- `variant Required`: `critical`, `success`, `unvailable`, `warning`. [API](https://primer.style/product/components/inline-message)

</details>

- **Carbon** (component): `kind`: `inline`, `toast`, `actionable`, `callout`; `contrast`: `high`, `low` [Carbon 1](https://carbondesignsystem.com/components/notification/usage)

- **Mantine** (component): `withCloseButton`: `false`, `true`; `variant`: `filled`, `light`, `outline`, `default`, `transparent`, `white`; `radius`: `xs`, `sm`, `md`, `lg`, `xl`, `custom-key-or-number` [Mantine 1](https://mantine.dev/llms/core-alert.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Alert/Alert.tsx), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `autoContrast`: `false`, `true`. [API](https://mantine.dev/llms/core-alert.md)

- Props / `withCloseButton`: `false`, `true`. [API](https://mantine.dev/llms/core-alert.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (component): `variant`: `outlined`, `filled`; `type`: `success`, `info`, `warning`, `error`; `closable`: `false`, `true`; `showIcon`: `false`, `true`; `banner`: `false`, `true` [Ant Design 1](https://ant.design/components/alert)

- **Chakra/Ark** (component): `status`: `info`, `warning`, `success`, `error`, `neutral`; `variant`: `subtle`, `surface`, `outline`, `solid`; `size`: `sm`, `md`, `lg` [Chakra/Ark 1](https://chakra-ui.com/docs/components/alert)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `status`: `info`, `warning`, `success`, `error`, `neutral`. [API](https://chakra-ui.com/docs/components/alert)

- `variant`: `subtle`, `surface`, `outline`, `solid`. [API](https://chakra-ui.com/docs/components/alert)

- `size`: `sm`, `md`, `lg`. [API](https://chakra-ui.com/docs/components/alert)

</details>

- **Atlassian** (component): `bannerAppearance`: `warning`, `error`, `announcement`; `sectionAppearance`: `information`, `warning`, `success`, `error`, `discovery` [Atlassian 1](https://atlassian.design/components/banner/examples), [Atlassian 2](https://atlassian.design/components/section-message/examples)

- **Polaris** (component): `tone`: `info`, `success`, `warning`, `critical`, `auto`; `dismissible`: `false`, `true` [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner.md)

- **GOV.UK** (component): `type`: `default`, `success`; `disableAutoFocus`: `false`, `true` [GOV.UK 1](https://design-system.service.gov.uk/components/notification-banner)

  Notification banner is not used for field validation; error message/summary are separate patterns.

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/alerts.json)

  Apple alert is modal, adjacent to Area in-place Alert. See Dialog for the comparable family.

## Structural alternatives

- **Untitled UI** (component): floating; full-width. [Untitled UI 1](https://www.untitledui.com/react/components/alerts)

- **shadcn/ui** (component): title; description; icon; action. [shadcn/ui 1](https://ui.shadcn.com/docs/components/alert.md)

- **Radix Themes** (component): icon and text; inline link. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/callout)

- **React Aria / Spectrum 2** (component): heading; content. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/InlineAlert.md)

- **Fluent 2** (component): message icon; title; body; actions; dismiss; single-line reflow; multiline. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-message-bar/library/src/components/MessageBar/MessageBar.types.ts)

- **Primer** (component): title; hidden title; description; actions; dismiss; inline message. [Primer 1](https://primer.style/product/components/banner), [Primer 2](https://primer.style/product/components/inline-message)

- **Carbon** (component): icon; title; body; action; dismiss; overflow. [Carbon 1](https://carbondesignsystem.com/components/notification/usage)

- **Mantine** (component): title; body; icon; close. [Mantine 1](https://mantine.dev/llms/core-alert.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Alert/Alert.tsx), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): title; description; icon; action; custom close; banner. [Ant Design 1](https://ant.design/components/alert)

- **Chakra/Ark** (component): title; description; icon; close; action. [Chakra/Ark 1](https://chakra-ui.com/docs/components/alert)

- **Atlassian** (component): banner; section message; title; actions; dismiss; truncation. [Atlassian 1](https://atlassian.design/components/banner/examples), [Atlassian 2](https://atlassian.design/components/section-message/examples)

- **Polaris** (component): heading; content; secondary actions. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner.md)

- **GOV.UK** (component): title; heading; body; link. [GOV.UK 1](https://design-system.service.gov.uk/components/notification-banner)

- **Apple HIG** (guidance): blocking alert; title; message; actions. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/alerts.json)

## Interaction patterns

- **Untitled UI** (component): Dismissal contract not found in public example text. [Untitled UI 1](https://www.untitledui.com/react/components/alerts)

- **shadcn/ui** (component): in-place feedback. [shadcn/ui 1](https://ui.shadcn.com/docs/components/alert.md)

- **Radix Themes** (component): optional alert role. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/callout)

- **React Aria / Spectrum 2** (component): optional focus on insertion. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/InlineAlert.md)

- **Fluent 2** (component): dismissal; live announcement. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-message-bar/library/src/components/MessageBar/MessageBar.types.ts)

- **Primer** (component): dismissal; status announcement. [Primer 1](https://primer.style/product/components/banner), [Primer 2](https://primer.style/product/components/inline-message)

- **Carbon** (component): status announcement; dismissal. [Carbon 1](https://carbondesignsystem.com/components/notification/usage)

- **Mantine** (component): onClose callback. [Mantine 1](https://mantine.dev/llms/core-alert.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Alert/Alert.tsx), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): dismiss animation; error boundary. [Ant Design 1](https://ant.design/components/alert)

- **Chakra/Ark** (component): in-place status. [Chakra/Ark 1](https://chakra-ui.com/docs/components/alert)

- **Atlassian** (component): dismissal; status information. [Atlassian 1](https://atlassian.design/components/banner/examples), [Atlassian 2](https://atlassian.design/components/section-message/examples)

- **Polaris** (component): dismiss; hidden state. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner.md)

- **GOV.UK** (component): region by default; success alert takes focus unless disabled. [GOV.UK 1](https://design-system.service.gov.uk/components/notification-banner)

- **Apple HIG** (guidance): explicit decision. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/alerts.json)

## Area today

Current-main update (`7dae828e7af1daf9d26b663d34335121156606f7`): Alert includes `layout="banner"` alongside single-line and multiline. `flush` is a separate boolean for edge-to-edge placement, not a layout value. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L532).

Semantic tones; icon, title, description, links, actions and optional dismissal; single-line and multiline layouts. Parent owns removal; status role normally, alert role for danger. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L8), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L24), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L31), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L107), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L141)

No independent treatment/size axis is registered. Toast and blocking dialog are separate families. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L524), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L1)

**Owner boundary:** Solid emphasis was explicitly excluded; reopening it requires an owner choice. [decision 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L8)

- **alert manifest:** `tone` = `neutral`, `accent`, `info`, `danger`, `warning`, `success`; `layout` = `single-line`, `multiline`. [packages/styles/src/manifest.ts:524](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L524)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Semantic status tones** — layer 2; **12 systems**; Area **yes**; **retain**. Preserve the existing semantic tone axis. Evidence: [Untitled UI](https://www.untitledui.com/react/components/alerts), [shadcn/ui](https://ui.shadcn.com/docs/components/alert.md), [Radix Themes](https://www.radix-ui.com/themes/docs/components/callout), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/InlineAlert.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage), [Primer](https://primer.style/product/components/banner), [Carbon](https://carbondesignsystem.com/components/notification/usage), [Chakra/Ark](https://chakra-ui.com/docs/components/alert), [Ant Design](https://ant.design/components/alert), [Atlassian](https://atlassian.design/components/banner/examples), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner.md), [GOV.UK](https://design-system.service.gov.uk/components/notification-banner). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L1)

- **Outlined treatment** — layer 2; **2 systems**; Area **not-found**; **consider**. Not a registered Alert treatment today. Evidence: [Chakra/Ark](https://chakra-ui.com/docs/components/alert), [Ant Design](https://ant.design/components/alert). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L1)

- **Solid/high-contrast treatment** — layer 2; **3 systems**; Area **owner-decision**; **owner**. Spec excludes solid emphasis. Evidence: [Radix Themes](https://www.radix-ui.com/themes/docs/components/callout), [Chakra/Ark](https://chakra-ui.com/docs/components/alert), [Carbon](https://carbondesignsystem.com/components/notification/usage). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L1)

- **Compact size tier** — layer 2; **3 systems**; Area **not-found**; **consider**. Choose through system density before adding a local size. Evidence: [Radix Themes](https://www.radix-ui.com/themes/docs/components/callout), [Primer](https://primer.style/product/components/banner), [Chakra/Ark](https://chakra-ui.com/docs/components/alert). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L1)

- **Title, body and leading icon** — layer 3; **10 systems**; Area **yes**; **retain**. Existing slots cover this anatomy. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/alert.md), [Radix Themes](https://www.radix-ui.com/themes/docs/components/callout), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/InlineAlert.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage), [Primer](https://primer.style/product/components/banner), [Mantine](https://mantine.dev/llms/core-alert.md), [Chakra/Ark](https://chakra-ui.com/docs/components/alert), [Ant Design](https://ant.design/components/alert), [Atlassian](https://atlassian.design/components/banner/examples), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L1)

- **Inline actions** — layer 3; **8 systems**; Area **yes**; **retain**. Existing actions slot. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/alert.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage), [Primer](https://primer.style/product/components/banner), [Carbon](https://carbondesignsystem.com/components/notification/usage), [Chakra/Ark](https://chakra-ui.com/docs/components/alert), [Ant Design](https://ant.design/components/alert), [Atlassian](https://atlassian.design/components/banner/examples), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L1)

- **Dismissible feedback** — layer 3; **8 systems**; Area **yes**; **retain**. Removal stays parent controlled. Evidence: [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage), [Primer](https://primer.style/product/components/banner), [Carbon](https://carbondesignsystem.com/components/notification/usage), [Mantine](https://mantine.dev/llms/core-alert.md), [Chakra/Ark](https://chakra-ui.com/docs/components/alert), [Ant Design](https://ant.design/components/alert), [Atlassian](https://atlassian.design/components/banner/examples), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L1)

- **Full-width page banner recipe** — layer 3; **5 systems**; Area **yes**; **retain**. Built as Alert `layout="banner"` with independent `flush`; application-specific focus policy remains separate. Evidence: [Untitled UI](https://www.untitledui.com/react/components/alerts), [Carbon](https://carbondesignsystem.com/components/notification/usage), [Ant Design](https://ant.design/components/alert), [Atlassian](https://atlassian.design/components/banner/examples), [GOV.UK](https://design-system.service.gov.uk/components/notification-banner). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — component

- [component/source](https://www.untitledui.com/react/components/alerts) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/alert.md) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — component

- [component/source](https://www.radix-ui.com/themes/docs/components/callout) — read; checked 2026-09-28.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — component

- [component/source](https://react-spectrum.adobe.com/InlineAlert.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — component

- [component/source](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-message-bar/library/src/components/MessageBar/MessageBar.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — component

- [component/source](https://primer.style/product/components/banner) — read; checked 2026-09-28.

- [component/source](https://primer.style/product/components/inline-message) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — component

- [component/source](https://carbondesignsystem.com/components/notification/usage) — read; checked 2026-09-28.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [component/source](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Banner.md) — read; checked 2026-09-28.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/core-alert.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Alert/Alert.tsx) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — component

- [component/source](https://ant.design/components/alert) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/alert) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — component

- [component/source](https://atlassian.design/components/banner/examples) — read; checked 2026-09-28.

- [component/source](https://atlassian.design/components/section-message/examples) — read; checked 2026-09-28.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — component

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — component

- [component/source](https://design-system.service.gov.uk/components/notification-banner) — read; checked 2026-09-28.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/alerts.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:524 — alert](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L524)

- [docs/specs/alert.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L1)

- [docs/specs/alert.md:8 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L8)

- [docs/specs/alert.md:24 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L24)

- [docs/specs/alert.md:31 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L31)

- [docs/specs/alert.md:107 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L107)

- [docs/specs/alert.md:141 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/alert.md#L141)
