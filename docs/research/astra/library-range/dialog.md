# Dialog — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Present a focused task or decision above the page. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L22)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (component): `layout`: `stacked-left`, `horizontal`; `intent`: `default`, `warning`, `destructive` [Untitled UI 1](https://www.untitledui.com/react/components/modals)

  Public recipes also include date picker, image crop, calendar event, AI assistant and integrations. The FAQ conflates outside dismissal and Escape; do not assume one flag controls both.

- **shadcn/ui** (component): `alertDialogSize`: `default`, `sm` [shadcn/ui 1](https://ui.shadcn.com/docs/components/dialog.md), [shadcn/ui 2](https://ui.shadcn.com/docs/components/alert-dialog.md)

<details>

<summary>shadcn/ui: additional/source-part API enum inventory</summary>

- size / `size`: `default`, `sm`. [API](https://ui.shadcn.com/docs/components/alert-dialog.md)

</details>

- **Radix Themes** (component): `size`: `1`, `2`, `3`, `4`; `align`: `start`, `center` [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/dialog), [Radix Themes 2](https://www.radix-ui.com/themes/docs/components/alert-dialog)

<details>

<summary>Radix Themes: additional/source-part API enum inventory</summary>

- `align`: `start`, `center`. [API](https://www.radix-ui.com/themes/docs/components/dialog)

- `align`: `start`, `center`. [API](https://www.radix-ui.com/themes/docs/components/alert-dialog)

</details>

- **Base UI** (headless): `modal`: `true`, `false`, `trap-focus`; `disablePointerDismissal`: `false`, `true` [Base UI 1](https://base-ui.com/react/components/dialog.md), [Base UI 2](https://base-ui.com/react/components/alert-dialog.md)

<details>

<summary>Base UI: additional/source-part API enum inventory</summary>

- Root / `open`: `false`, `true`. [API](https://base-ui.com/react/components/dialog.md)

- Root / `disablePointerDismissal`: `false`, `true`. [API](https://base-ui.com/react/components/dialog.md)

- Root / `modal`: `false`, `true`, `trap-focus`. [API](https://base-ui.com/react/components/dialog.md)

- Handle / `isOpen`: `false`, `true`. [API](https://base-ui.com/react/components/dialog.md)

- Root / `open`: `false`, `true`. [API](https://base-ui.com/react/components/alert-dialog.md)

- Handle / `isOpen`: `false`, `true`. [API](https://base-ui.com/react/components/alert-dialog.md)

</details>

- **React Aria / Spectrum 2** (component): `size`: `S`, `M`, `L`, `XL`; `role`: `dialog`, `alertdialog`; `alertVariant`: `confirmation`, `destructive`, `error`, `information`, `warning`; `fullscreenVariant`: `fullscreen`, `fullscreenTakeover`; `isDismissible`: `false`, `true`; `isKeyboardDismissDisabled`: `false`, `true`; `autoFocusButton`: `cancel`, `primary`, `secondary` [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/Dialog.md)

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- Dialog / `isDismissible`: `false`, `true`. [API](https://react-spectrum.adobe.com/Dialog.md)

- Dialog / `isKeyboardDismissDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/Dialog.md)

- Dialog / `size`: `L`, `M`, `S`, `XL`. [API](https://react-spectrum.adobe.com/Dialog.md)

- AlertDialog / `autoFocusButton`: `cancel`, `primary`, `secondary`. [API](https://react-spectrum.adobe.com/Dialog.md)

- AlertDialog / `isPrimaryActionDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/Dialog.md)

- AlertDialog / `isSecondaryActionDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/Dialog.md)

- AlertDialog / `size`: `L`, `M`, `S`. [API](https://react-spectrum.adobe.com/Dialog.md)

- AlertDialog / `variant`: `confirmation`, `destructive`, `error`, `information`, `warning`. [API](https://react-spectrum.adobe.com/Dialog.md)

- FullscreenDialog / `isKeyboardDismissDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/Dialog.md)

- FullscreenDialog / `variant`: `fullscreen`, `fullscreenTakeover`. [API](https://react-spectrum.adobe.com/Dialog.md)

- CustomDialog / `isDismissible`: `false`, `true`. [API](https://react-spectrum.adobe.com/Dialog.md)

- CustomDialog / `isKeyboardDismissDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/Dialog.md)

- CustomDialog / `size`: `fullscreen`, `fullscreenTakeover`, `L`, `M`, `S`. [API](https://react-spectrum.adobe.com/Dialog.md)

- DialogTrigger / `isOpen`: `false`, `true`. [API](https://react-spectrum.adobe.com/Dialog.md)

</details>

- **Fluent 2** (component): `modalType`: `modal`, `non-modal`, `alert` [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/dialog/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-dialog/library/src/components/Dialog/Dialog.types.ts)

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `type`: `escapeKeyDown`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-dialog/library/src/components/Dialog/Dialog.types.ts)

- `open`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-dialog/library/src/components/Dialog/Dialog.types.ts)

- `type`: `backdropClick`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-dialog/library/src/components/Dialog/Dialog.types.ts)

- `type`: `triggerClick`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-dialog/library/src/components/Dialog/Dialog.types.ts)

- `inertTrapFocus`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-dialog/library/src/components/Dialog/Dialog.types.ts)

- `unmountOnClose`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-dialog/library/src/components/Dialog/Dialog.types.ts)

</details>

- **Primer** (component): `width`: `small`, `medium`, `large`, `xlarge`, `custom`; `height`: `small`, `large`, `auto`; `position`: `center`, `left`, `right`; `headerAlign`: `top`, `center`, `bottom` [Primer 1](https://primer.style/product/components/dialog)

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `align`: `top`, `center`, `bottom`. [API](https://primer.style/product/components/dialog)

- `autoFocus`: `false`, `true`. [API](https://primer.style/product/components/dialog)

</details>

- **Carbon** (component): `kind`: `passive`, `transactional`, `danger`, `acknowledgment`, `progress` [Carbon 1](https://carbondesignsystem.com/components/modal/usage)

- **Material 3** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Dialog.md)

- **Mantine** (component): `centered`: `false`, `true`; `fullScreen`: `false`, `true`; `withCloseButton`: `false`, `true`; `closeOnClickOutside`: `false`, `true`; `closeOnEscape`: `false`, `true`; `trapFocus`: `false`, `true`; `returnFocus`: `false`, `true`; `size`: `xs`, `sm`, `md`, `lg`, `xl`, `custom` [Mantine 1](https://mantine.dev/llms/core-modal.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `closeOnClickOutside`: `false`, `true`. [API](https://mantine.dev/llms/core-modal.md)

- Props / `closeOnEscape`: `false`, `true`. [API](https://mantine.dev/llms/core-modal.md)

- Props / `fullScreen`: `false`, `true`. [API](https://mantine.dev/llms/core-modal.md)

- Props / `returnFocus`: `false`, `true`. [API](https://mantine.dev/llms/core-modal.md)

- Props / `trapFocus`: `false`, `true`. [API](https://mantine.dev/llms/core-modal.md)

- Props / `withCloseButton`: `false`, `true`. [API](https://mantine.dev/llms/core-modal.md)

- Props / `withOverlay`: `false`, `true`. [API](https://mantine.dev/llms/core-modal.md)

- Props / `withinPortal`: `false`, `true`. [API](https://mantine.dev/llms/core-modal.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (component): `centered`: `false`, `true`; `keyboard`: `false`, `true`; `closable`: `false`, `true`; `confirmLoading`: `false`, `true`; `loading`: `false`, `true` [Ant Design 1](https://ant.design/components/modal)

- **Chakra/Ark** (component): `placement`: `center`, `top`, `bottom`; `size`: `xs`, `sm`, `md`, `lg`, `xl`, `cover`, `full`; `modal`: `false`, `true`; `closeOnInteractOutside`: `false`, `true` [Chakra/Ark 1](https://chakra-ui.com/docs/components/dialog)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `closeOnInteractOutside`: `false`, `true`. [API](https://chakra-ui.com/docs/components/dialog)

- `modal`: `false`, `true`. [API](https://chakra-ui.com/docs/components/dialog)

- `trapFocus`: `false`, `true`. [API](https://chakra-ui.com/docs/components/dialog)

- `unmountOnExit`: `false`, `true`. [API](https://chakra-ui.com/docs/components/dialog)

- `placement`: `center`, `top`, `bottom`. [API](https://chakra-ui.com/docs/components/dialog)

- `size`: `xs`, `sm`, `md`, `lg`, `xl`, `cover`, `full`. [API](https://chakra-ui.com/docs/components/dialog)

- `open`: `false`, `true`. [API](https://chakra-ui.com/docs/components/dialog)

- `restoreFocus`: `false`, `true`. [API](https://chakra-ui.com/docs/components/dialog)

</details>

- **Atlassian** (component): `appearance`: `default`, `warning`, `danger` [Atlassian 1](https://atlassian.design/components/modal-dialog/examples)

- **Polaris** (component): `size`: `small`, `small-100`, `base`, `large`, `large-100`; `padding`: `base`, `none` [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal.md)

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/sheets.json), [Apple HIG 2](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/alerts.json)

## Structural alternatives

- **Untitled UI** (component): title and body; close action; form; invite; verification; media and carousel; payment; plan; file upload; settings; editor. [Untitled UI 1](https://www.untitledui.com/react/components/modals)

- **shadcn/ui** (component): custom close; no close; sticky footer; scrollable body; media; destructive confirmation. [shadcn/ui 1](https://ui.shadcn.com/docs/components/dialog.md), [shadcn/ui 2](https://ui.shadcn.com/docs/components/alert-dialog.md)

- **Radix Themes** (component): title; description; close; inset content; separate alert action and cancel. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/dialog), [Radix Themes 2](https://www.radix-ui.com/themes/docs/components/alert-dialog)

- **Base UI** (headless): trigger; backdrop; popup; title; description; close; nested dialogs; alert dialog. [Base UI 1](https://base-ui.com/react/components/dialog.md), [Base UI 2](https://base-ui.com/react/components/alert-dialog.md)

- **React Aria / Spectrum 2** (component): standard; alert; fullscreen; custom; header; footer; container for dynamic content. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/Dialog.md)

- **Fluent 2** (component): header; body; footer; persistent header/footer with scrolling body; form. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/dialog/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-dialog/library/src/components/Dialog/Dialog.types.ts)

- **Primer** (component): subtitle; footer buttons; scroll body; responsive bottom sheet; fullscreen. [Primer 1](https://primer.style/product/components/dialog)

- **Carbon** (component): header; body; footer; fullwidth content; loading; validation. [Carbon 1](https://carbondesignsystem.com/components/modal/usage)

- **Material 3** (component): title; supporting text; positive/negative/neutral actions; single-choice list; multi-choice list; custom content. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Dialog.md)

- **Mantine** (component): header; body; scroll area; stacked modals; custom overlay. [Mantine 1](https://mantine.dev/llms/core-modal.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): title; footer; custom close; async confirmation; custom width; draggable recipe. [Ant Design 1](https://ant.design/components/modal)

- **Chakra/Ark** (component): responsive size; multiple triggers; nested dialogs; inside scroll; outside scroll; outside close button; alert dialog. [Chakra/Ark 1](https://chakra-ui.com/docs/components/dialog)

- **Atlassian** (component): width variants; fullscreen; header; footer; scrolling; form. [Atlassian 1](https://atlassian.design/components/modal-dialog/examples)

- **Polaris** (component): heading; body; primary action; secondary actions. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal.md)

- **Apple HIG** (guidance): alert; sheet; close/cancel/done/back actions. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/sheets.json), [Apple HIG 2](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/alerts.json)

## Interaction patterns

- **Untitled UI** (component): controlled open; focus trapping; Escape dismissal. [Untitled UI 1](https://www.untitledui.com/react/components/modals)

- **shadcn/ui** (component): modal dismissal; separate alert-dialog contract. [shadcn/ui 1](https://ui.shadcn.com/docs/components/dialog.md), [shadcn/ui 2](https://ui.shadcn.com/docs/components/alert-dialog.md)

- **Radix Themes** (component): Dialog and AlertDialog primitives supply distinct dismissal contracts. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/dialog), [Radix Themes 2](https://www.radix-ui.com/themes/docs/components/alert-dialog)

- **Base UI** (headless): focus management; outside-pointer dismissal policy; controlled open. [Base UI 1](https://base-ui.com/react/components/dialog.md), [Base UI 2](https://base-ui.com/react/components/alert-dialog.md)

- **React Aria / Spectrum 2** (component): focus trap; initial focus policy; independent Escape and outside-dismiss policies. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/Dialog.md)

- **Fluent 2** (component): modal traps focus; non-modal preserves background interaction; alert requires explicit decision; focus return. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/dialog/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-dialog/library/src/components/Dialog/Dialog.types.ts)

- **Primer** (component): initial focus; focus return; dismiss. [Primer 1](https://primer.style/product/components/dialog)

- **Carbon** (component): focus management; confirm; dismiss. [Carbon 1](https://carbondesignsystem.com/components/modal/usage)

- **Material 3** (component): confirmation; selection; dismiss. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Dialog.md)

- **Mantine** (component): focus trap; initial focus; return focus; dismiss policies. [Mantine 1](https://mantine.dev/llms/core-modal.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): Escape policy; async OK; controlled visibility; destroy-on-hidden. [Ant Design 1](https://ant.design/components/modal)

- **Chakra/Ark** (component): initial focus; Escape and outside-dismiss policy; non-modal option. [Chakra/Ark 1](https://chakra-ui.com/docs/components/dialog)

- **Atlassian** (component): focus management; focus return; dismiss. [Atlassian 1](https://atlassian.design/components/modal-dialog/examples)

- **Polaris** (component): show/hide/toggle; before/after events. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal.md)

- **Apple HIG** (guidance): modality varies by platform; explicit decision; dismiss. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/sheets.json), [Apple HIG 2](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/alerts.json)

## Area today

Header/body/footer, optional close and scrolling. With trigger: native modal dialog, inert background, focus trap, Escape/outside dismissal and focus restoration. Without trigger: presentation surface only. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L8), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L22), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L28), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L88), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L128)

No size/fullscreen axis, non-modal contract, explicit alert-dialog role/decision policy or independent dismissal flags documented. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L532), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L1)

**Owner boundary:** Undivided footer is an owner choice; broadening presentation must not imply adding divider paint. [decision 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L8)

- **dialog manifest:** no design-time variant enum. [packages/styles/src/manifest.ts:532](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L532)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Standard versus explicit alert decision** — layer 3; **7 systems**; Area **partial**; **add**. Native modal exists; explicit alert-dialog role and dismissal policy are absent. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/dialog.md), [Radix Themes](https://www.radix-ui.com/themes/docs/components/dialog), [Base UI](https://base-ui.com/react/components/dialog.md), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Dialog.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/dialog/usage), [Chakra/Ark](https://chakra-ui.com/docs/components/dialog), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Dialog.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L1)

- **Non-modal presentation** — layer 3; **3 systems**; Area **not-found**; **consider**. Current no-trigger surface is not a functioning non-modal dialog. Evidence: [Base UI](https://base-ui.com/react/components/dialog.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/dialog/usage), [Chakra/Ark](https://chakra-ui.com/docs/components/dialog). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L1)

- **Size/fullscreen presets** — layer 2; **5 systems**; Area **not-found**; **add**. Add documented responsive sizing separate from paint. Evidence: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Dialog.md), [Primer](https://primer.style/product/components/dialog), [Mantine](https://mantine.dev/llms/core-modal.md), [Chakra/Ark](https://chakra-ui.com/docs/components/dialog), [Atlassian](https://atlassian.design/components/modal-dialog/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L1)

- **Independent Escape/outside dismissal** — layer 3; **4 systems**; Area **not-found**; **add**. Current native modal handles both; explicit policy is missing. Evidence: [Base UI](https://base-ui.com/react/components/dialog.md), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Dialog.md), [Mantine](https://mantine.dev/llms/core-modal.md), [Chakra/Ark](https://chakra-ui.com/docs/components/dialog). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L1)

- **Persistent header/footer with scrolling body** — layer 3; **6 systems**; Area **yes**; **retain**. Existing slots and scrolling. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/dialog.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/dialog/usage), [Primer](https://primer.style/product/components/dialog), [Mantine](https://mantine.dev/llms/core-modal.md), [Chakra/Ark](https://chakra-ui.com/docs/components/dialog), [Atlassian](https://atlassian.design/components/modal-dialog/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L1)

- **Async confirmation/loading** — layer 3; **2 systems**; Area **partial**; **consider**. Consumer actions can show loading; no confirm transaction engine. Evidence: [Carbon](https://carbondesignsystem.com/components/modal/usage), [Ant Design](https://ant.design/components/modal). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L1)

- **Responsive sheet placement** — layer 3; **2 systems**; Area **not-found**; **consider**. Treat sheet layout and dialog modality as separate decisions. Evidence: [Primer](https://primer.style/product/components/dialog), [Chakra/Ark](https://chakra-ui.com/docs/components/dialog). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — component

- [component/source](https://www.untitledui.com/react/components/modals) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/dialog.md) — read; checked 2026-09-28.

- [component/source](https://ui.shadcn.com/docs/components/alert-dialog.md) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — component

- [component/source](https://www.radix-ui.com/themes/docs/components/dialog) — read; checked 2026-09-28.

- [component/source](https://www.radix-ui.com/themes/docs/components/alert-dialog) — read; checked 2026-09-28.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — headless

- [component/source](https://base-ui.com/react/components/dialog.md) — read; checked 2026-09-28.

- [component/source](https://base-ui.com/react/components/alert-dialog.md) — read; checked 2026-09-28.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — component

- [component/source](https://react-aria.adobe.com/Dialog) — not found or unusable response; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/Dialog.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — component

- [component/source](https://fluent2.microsoft.design/components/web/react/core/dialog/usage) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-dialog/library/src/components/Dialog/Dialog.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — component

- [component/source](https://primer.style/product/components/dialog) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — component

- [component/source](https://carbondesignsystem.com/components/modal/usage) — read; checked 2026-09-28.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — component

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [component/source](https://m3.material.io/components/dialogs/overview) — not found or unusable response; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Dialog.md) — read; checked 2026-09-28.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/core-modal.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — component

- [component/source](https://ant.design/components/modal) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/dialog) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — component

- [component/source](https://atlassian.design/components/modal-dialog/examples) — read; checked 2026-09-28.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — component

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/sheets.json) — read; checked 2026-09-28.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/alerts.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:532 — dialog](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L532)

- [docs/specs/dialog.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L1)

- [docs/specs/dialog.md:8 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L8)

- [docs/specs/dialog.md:22 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L22)

- [docs/specs/dialog.md:28 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L28)

- [docs/specs/dialog.md:88 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L88)

- [docs/specs/dialog.md:128 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/dialog.md#L128)
