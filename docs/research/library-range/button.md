# Button — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Execute or toggle an action. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L29)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (component): `color`: `primary`, `secondary`, `tertiary`, `primary-destructive`, `secondary-destructive`, `tertiary-destructive`, `link-gray`, `link-color`, `link-destructive`; `size`: `xs`, `sm`, `md`, `lg`, `xl`; `isLoading`: `false`, `true`; `isDisabled`: `false`, `true`; `showTextWhileLoading`: `false`, `true` [Untitled UI 1](https://www.untitledui.com/react/components/buttons)

- **shadcn/ui** (component): `variant`: `default`, `outline`, `ghost`, `destructive`, `secondary`, `link`; `size`: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg` [shadcn/ui 1](https://ui.shadcn.com/docs/components/button.md)

<details>

<summary>shadcn/ui: additional/source-part API enum inventory</summary>

- Button / `variant`: `default`, `outline`, `ghost`, `destructive`, `secondary`, `link`. [API](https://ui.shadcn.com/docs/components/button.md)

- Button / `size`: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`. [API](https://ui.shadcn.com/docs/components/button.md)

</details>

- **Radix Themes** (component): `size`: `1`, `2`, `3`, `4`; `variant`: `classic`, `solid`, `soft`, `surface`, `outline`, `ghost`; `radius`: `none`, `small`, `medium`, `large`, `full`; `highContrast`: `false`, `true`; `loading`: `false`, `true` [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/button), [Radix Themes 2](https://www.radix-ui.com/themes/docs/components/icon-button)

<details>

<summary>Radix Themes: additional/source-part API enum inventory</summary>

- `highContrast`: `false`, `true`. [API](https://www.radix-ui.com/themes/docs/components/button)

- `radius`: `none`, `small`, `medium`, `large`, `full`. [API](https://www.radix-ui.com/themes/docs/components/button)

- `loading`: `false`, `true`. [API](https://www.radix-ui.com/themes/docs/components/button)

- `highContrast`: `false`, `true`. [API](https://www.radix-ui.com/themes/docs/components/icon-button)

- `radius`: `none`, `small`, `medium`, `large`, `full`. [API](https://www.radix-ui.com/themes/docs/components/icon-button)

- `loading`: `false`, `true`. [API](https://www.radix-ui.com/themes/docs/components/icon-button)

</details>

- **Base UI** (headless): `disabled`: `false`, `true`; `focusableWhenDisabled`: `false`, `true` [Base UI 1](https://base-ui.com/react/components/button.md)

<details>

<summary>Base UI: additional/source-part API enum inventory</summary>

- Button / `focusableWhenDisabled`: `false`, `true`. [API](https://base-ui.com/react/components/button.md)

</details>

- **React Aria / Spectrum 2** (component): `fillStyle`: `fill`, `outline`; `isQuiet`: `false`, `true`; `isEmphasized`: `false`, `true`; `isPending`: `false`, `true`; `isDisabled`: `false`, `true`; `isSelected`: `false`, `true` [React Aria / Spectrum 2 1](https://react-aria.adobe.com/Button.md), [React Aria / Spectrum 2 2](https://react-aria.adobe.com/ToggleButton.md), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/Button.md), [React Aria / Spectrum 2 4](https://react-spectrum.adobe.com/ActionButton.md), [React Aria / Spectrum 2 5](https://react-spectrum.adobe.com/ToggleButton.md)

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- API / `autoFocus`: `false`, `true`. [API](https://react-aria.adobe.com/Button.md)

- API / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/Button.md)

- API / `isPending`: `false`, `true`. [API](https://react-aria.adobe.com/Button.md)

- API / `preventFocusOnPress`: `false`, `true`. [API](https://react-aria.adobe.com/Button.md)

- API / `type`: `button`, `reset`, `submit`. [API](https://react-aria.adobe.com/Button.md)

- API / `autoFocus`: `false`, `true`. [API](https://react-aria.adobe.com/ToggleButton.md)

- API / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/ToggleButton.md)

- API / `isSelected`: `false`, `true`. [API](https://react-aria.adobe.com/ToggleButton.md)

- API / `preventFocusOnPress`: `false`, `true`. [API](https://react-aria.adobe.com/ToggleButton.md)

- Button / `autoFocus`: `false`, `true`. [API](https://react-spectrum.adobe.com/Button.md)

- Button / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/Button.md)

- Button / `isPending`: `false`, `true`. [API](https://react-spectrum.adobe.com/Button.md)

- Button / `preventFocusOnPress`: `false`, `true`. [API](https://react-spectrum.adobe.com/Button.md)

- Button / `size`: `L`, `M`, `S`, `XL`. [API](https://react-spectrum.adobe.com/Button.md)

- Button / `staticColor`: `auto`, `black`, `white`. [API](https://react-spectrum.adobe.com/Button.md)

- Button / `type`: `button`, `reset`, `submit`. [API](https://react-spectrum.adobe.com/Button.md)

- Button / `variant`: `accent`, `genai`, `negative`, `premium`, `primary`, `secondary`. [API](https://react-spectrum.adobe.com/Button.md)

- ActionButton / `autoFocus`: `false`, `true`. [API](https://react-spectrum.adobe.com/ActionButton.md)

- ActionButton / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ActionButton.md)

- ActionButton / `isPending`: `false`, `true`. [API](https://react-spectrum.adobe.com/ActionButton.md)

- ActionButton / `isQuiet`: `false`, `true`. [API](https://react-spectrum.adobe.com/ActionButton.md)

- ActionButton / `preventFocusOnPress`: `false`, `true`. [API](https://react-spectrum.adobe.com/ActionButton.md)

- ActionButton / `size`: `L`, `M`, `S`, `XL`, `XS`. [API](https://react-spectrum.adobe.com/ActionButton.md)

- ActionButton / `staticColor`: `auto`, `black`, `white`. [API](https://react-spectrum.adobe.com/ActionButton.md)

- ActionButton / `type`: `button`, `reset`, `submit`. [API](https://react-spectrum.adobe.com/ActionButton.md)

- ToggleButton / `autoFocus`: `false`, `true`. [API](https://react-spectrum.adobe.com/ToggleButton.md)

- ToggleButton / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ToggleButton.md)

- ToggleButton / `isEmphasized`: `false`, `true`. [API](https://react-spectrum.adobe.com/ToggleButton.md)

- ToggleButton / `isQuiet`: `false`, `true`. [API](https://react-spectrum.adobe.com/ToggleButton.md)

- ToggleButton / `isSelected`: `false`, `true`. [API](https://react-spectrum.adobe.com/ToggleButton.md)

- ToggleButton / `preventFocusOnPress`: `false`, `true`. [API](https://react-spectrum.adobe.com/ToggleButton.md)

- ToggleButton / `size`: `L`, `M`, `S`, `XL`, `XS`. [API](https://react-spectrum.adobe.com/ToggleButton.md)

- ToggleButton / `staticColor`: `auto`, `black`, `white`. [API](https://react-spectrum.adobe.com/ToggleButton.md)

</details>

- **Fluent 2** (component): `appearance`: `secondary`, `primary`, `outline`, `subtle`, `transparent`; `shape`: `rounded`, `circular`, `square`; `iconPosition`: `before`, `after`; `disabledFocusable`: `false`, `true`; `disabled`: `false`, `true`; `size`: `small`, `medium`, `large` [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/button/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/Button/Button.types.ts), [Fluent 2 3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/ToggleButton/ToggleButton.types.ts), [Fluent 2 4](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/CompoundButton/CompoundButton.types.ts)

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `appearance`: `secondary`, `primary`, `outline`, `subtle`, `transparent`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/Button/Button.types.ts)

- `disabledFocusable`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/Button/Button.types.ts)

- `disabled`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/Button/Button.types.ts)

- `iconPosition`: `before`, `after`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/Button/Button.types.ts)

- `shape`: `rounded`, `circular`, `square`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/Button/Button.types.ts)

- `checked`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/ToggleButton/ToggleButton.types.ts)

- `isAccessible`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/ToggleButton/ToggleButton.types.ts)

</details>

- **Primer** (component): `variant`: `default`, `primary`, `danger`, `invisible`, `link`; `size`: `small`, `medium`, `large`; `alignContent`: `start`, `center`; `loading`: `false`, `true`; `inactive`: `false`, `true` [Primer 1](https://primer.style/product/components/button), [Primer 2](https://primer.style/product/components/icon-button)

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `alignContent`: `start`, `center`. [API](https://primer.style/product/components/button)

- `loading`: `false`, `true`. [API](https://primer.style/product/components/button)

- `size`: `small`, `medium`, `large`. [API](https://primer.style/product/components/button)

- `variant`: `default`, `primary`, `danger`, `invisible`, `link`. [API](https://primer.style/product/components/button)

- `labelWrap`: `false`, `true`. [API](https://primer.style/product/components/button)

- `disabled`: `false`, `true`. [API](https://primer.style/product/components/button)

- `variant`: `default`, `primary`, `danger`, `invisible`, `link`. [API](https://primer.style/product/components/icon-button)

- `size`: `small`, `medium`, `large`. [API](https://primer.style/product/components/icon-button)

</details>

- **Carbon** (component): `kind`: `primary`, `secondary`, `tertiary`, `ghost`, `danger`; `layout`: `fixed`, `fluid`; `size`: `extra-small`, `small`, `medium`, `large-productive`, `large-expressive`, `extra-large`, `2XL` [Carbon 1](https://carbondesignsystem.com/components/button/usage)

- **Material 3** (component): `style`: `elevated`, `filled`, `filled-tonal`, `outlined`, `text`; `iconStyle`: `standard`, `filled`, `filled-tonal`, `outlined`; `shape`: `round`, `square`; `size`: `extra-small`, `small`, `medium`, `large`, `extra-large`; `iconWidth`: `narrow`, `default`, `wide`; `checkable`: `false`, `true` [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/CommonButton.md), [Material 3 2](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/IconButton.md)

  Pinned Material Components Android docs, including M3 Expressive; these are platform implementations, not an assertion of parity across every Material SDK.

- **Mantine** (component): `orientation`: `horizontal`, `vertical`; `disabled`: `false`, `true`; `loading`: `false`, `true`; `fullWidth`: `false`, `true`; `variant`: `filled`, `light`, `outline`, `transparent`, `white`, `subtle`, `default`, `gradient`; `size`: `xs`, `sm`, `md`, `lg`, `xl`, `compact-xs`, `compact-sm`, `compact-md`, `compact-lg`, `compact-xl`; `radius`: `xs`, `sm`, `md`, `lg`, `xl`, `custom-key-or-number` [Mantine 1](https://mantine.dev/llms/core-button.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Button/Button.tsx), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `autoContrast`: `false`, `true`. [API](https://mantine.dev/llms/core-button.md)

- Props / `disabled`: `false`, `true`. [API](https://mantine.dev/llms/core-button.md)

- Props / `fullWidth`: `false`, `true`. [API](https://mantine.dev/llms/core-button.md)

- Props / `loading`: `false`, `true`. [API](https://mantine.dev/llms/core-button.md)

- Props / `orientation`: `horizontal`, `vertical`. [API](https://mantine.dev/llms/core-button.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (component): `variant`: `outlined`, `dashed`, `solid`, `filled`, `text`, `link`; `type`: `primary`, `dashed`, `link`, `text`, `default`; `color`: `default`, `primary`, `danger`, `preset`; `shape`: `default`, `circle`, `round`; `size`: `small`, `medium`, `large`; `block`: `false`, `true`; `ghost`: `false`, `true`; `loading`: `false`, `true`; `disabled`: `false`, `true` [Ant Design 1](https://ant.design/components/button)

- **Chakra/Ark** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Chakra/Ark 1](https://chakra-ui.com/docs/components/button)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `colorPalette`: `gray`, `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `cyan`, `purple`, `pink`. [API](https://chakra-ui.com/docs/components/button)

- `size`: `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. [API](https://chakra-ui.com/docs/components/button)

- `variant`: `solid`, `subtle`, `surface`, `outline`, `ghost`, `plain`. [API](https://chakra-ui.com/docs/components/button)

- `loading`: `false`, `true`. [API](https://chakra-ui.com/docs/components/button)

</details>

- **Atlassian** (component): `appearance`: `default`, `primary`, `subtle`, `warning`, `danger`, `discovery`, `rovo`; `spacing`: `default`, `compact`; `shouldFitContainer`: `false`, `true` [Atlassian 1](https://atlassian.design/components/button/examples)

- **Polaris** (component): `variant`: `auto`, `primary`, `secondary`, `tertiary`; `tone`: `critical`, `auto`, `neutral`; `inlineSize`: `auto`, `fill`, `fit-content`; `type`: `button`, `reset`, `submit`; `disabled`: `false`, `true`; `loading`: `false`, `true` [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button.md)

- **GOV.UK** (component): `style`: `default`, `secondary`, `warning`; `disabled`: `false`, `true`; `preventDoubleClick`: `false`, `true` [GOV.UK 1](https://design-system.service.gov.uk/components/button)

- **Apple HIG** (guidance): `role`: `normal`, `primary`, `cancel`, `destructive`; `content`: `symbol`, `text`, `both` [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/buttons.json)

  Platform conventions, not web prop enums. Use prominence rather than unequal sizes to distinguish adjacent actions; macOS-specific button types and watchOS layouts do not imply cross-platform parity.

## Structural alternatives

- **Untitled UI** (component): text; leading icon; trailing icon; icon-only; anchor via href. [Untitled UI 1](https://www.untitledui.com/react/components/buttons)

- **shadcn/ui** (component): leading icon; trailing icon; icon-only; rounded recipe; spinner; anchor. [shadcn/ui 1](https://ui.shadcn.com/docs/components/button.md)

- **Radix Themes** (component): text; icon with text; IconButton; asChild link. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/button), [Radix Themes 2](https://www.radix-ui.com/themes/docs/components/icon-button)

- **Base UI** (headless): button; link rendering; loading example. [Base UI 1](https://base-ui.com/react/components/button.md)

- **React Aria / Spectrum 2** (component): Button; ActionButton; ToggleButton; LinkButton. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/Button.md), [React Aria / Spectrum 2 2](https://react-aria.adobe.com/ToggleButton.md), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/Button.md), [React Aria / Spectrum 2 4](https://react-spectrum.adobe.com/ActionButton.md), [React Aria / Spectrum 2 5](https://react-spectrum.adobe.com/ToggleButton.md)

- **Fluent 2** (component): text; icon-only; CompoundButton secondary text; ToggleButton. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/button/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/Button/Button.types.ts), [Fluent 2 3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/ToggleButton/ToggleButton.types.ts), [Fluent 2 4](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/CompoundButton/CompoundButton.types.ts)

- **Primer** (component): leading visual; trailing visual; trailing action; icon-only; shortcut hint. [Primer 1](https://primer.style/product/components/button), [Primer 2](https://primer.style/product/components/icon-button)

- **Carbon** (component): text; icon; icon-only; loading; hanging alignment. [Carbon 1](https://carbondesignsystem.com/components/button/usage)

- **Material 3** (component): label; leading icon; icon-only; toggle icon. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/CommonButton.md), [Material 3 2](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/IconButton.md)

- **Mantine** (component): left section; right section; section alignment; compact sizes; joined group; group section. [Mantine 1](https://mantine.dev/llms/core-button.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Button/Button.tsx), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): icon; icon position; link. [Ant Design 1](https://ant.design/components/button)

- **Chakra/Ark** (component): text; icon; loading spinner; spinner placement; group; attached buttons. [Chakra/Ark 1](https://chakra-ui.com/docs/components/button)

- **Atlassian** (component): before/after icons; icon-only; loading; truncation. [Atlassian 1](https://atlassian.design/components/button/examples)

- **Polaris** (component): label; icon; link; target overlay command. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button.md)

- **GOV.UK** (component): text; start button arrow; link styled as button; button group. [GOV.UK 1](https://design-system.service.gov.uk/components/button)

- **Apple HIG** (guidance): label; symbol; image; macOS push button; flexible-height push button; square icon button; help button; image button; watchOS full-width primary action. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/buttons.json)

## Interaction patterns

- **Untitled UI** (component): loading suppresses repeat activation; button or link semantics. [Untitled UI 1](https://www.untitledui.com/react/components/buttons)

- **shadcn/ui** (component): disabled while spinner is shown; native button or link. [shadcn/ui 1](https://ui.shadcn.com/docs/components/button.md)

- **Radix Themes** (component): loading; native button behavior. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/button), [Radix Themes 2](https://www.radix-ui.com/themes/docs/components/icon-button)

- **Base UI** (headless): native button semantics; disabled focusability. [Base UI 1](https://base-ui.com/react/components/button.md)

- **React Aria / Spectrum 2** (component): press events across devices; pending retains focusability; toggle selection. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/Button.md), [React Aria / Spectrum 2 2](https://react-aria.adobe.com/ToggleButton.md), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/Button.md), [React Aria / Spectrum 2 4](https://react-spectrum.adobe.com/ActionButton.md), [React Aria / Spectrum 2 5](https://react-spectrum.adobe.com/ToggleButton.md)

- **Fluent 2** (component): toggle checked; disabled-focusable explanation. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/button/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/Button/Button.types.ts), [Fluent 2 3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/ToggleButton/ToggleButton.types.ts), [Fluent 2 4](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/CompoundButton/CompoundButton.types.ts)

- **Primer** (component): loading announcement; disabled; shortcut activation. [Primer 1](https://primer.style/product/components/button), [Primer 2](https://primer.style/product/components/icon-button)

- **Carbon** (component): disabled; loading. [Carbon 1](https://carbondesignsystem.com/components/button/usage)

- **Material 3** (component): press; toggle; disabled. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/CommonButton.md), [Material 3 2](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/IconButton.md)

- **Mantine** (component): loading; disabled button versus disabled link behavior. [Mantine 1](https://mantine.dev/llms/core-button.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Button/Button.tsx), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): loading with delay; native action or navigation. [Ant Design 1](https://ant.design/components/button)

- **Chakra/Ark** (component): disabled; loading. [Chakra/Ark 1](https://chakra-ui.com/docs/components/button)

- **Atlassian** (component): selected; disabled; loading. [Atlassian 1](https://atlassian.design/components/button/examples)

- **Polaris** (component): loading; disabled; show/hide/toggle target. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button.md)

- **GOV.UK** (component): submit; double-click prevention. [GOV.UK 1](https://design-system.service.gov.uk/components/button)

- **Apple HIG** (guidance): press state; Return activates primary; loading indicator with optional replacement label; macOS spring loading. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/buttons.json)

## Area today

Solid/soft/outline/ghost; eight semantic tones; sm/md/lg; pill, full width, start/end alignment, icon-only, leading/trailing icon and shortcut. Disabled/loading/selected states. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L9), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L29), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L35), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L221), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L247)

No compound secondary-description button; loading presentation is not a separate layout axis. Navigation belongs to links. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L1)

**Owner boundary:** No extra local sizes were requested; compact density is system-wide. Keep independent action versus mutually exclusive mode selection distinct. [decision 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L9)

- **button manifest:** `variant` = `solid`, `soft`, `outline`, `ghost`; `tone` = `neutral`, `accent`, `info`, `success`, `warning`, `caution`, `danger`, `discovery`; `size` = `sm`, `md`, `lg`; `align` = `align-start`, `align-end`; boolean modifiers: `full-width`, `icon-only`, `pill`; runtime states: `disabled`, `loading`, `selected`. [packages/styles/src/manifest.ts:35](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Filled/soft/outline/ghost treatments** — layer 2; **4 systems**; Area **yes**; **retain**. Existing four treatments cover hierarchy; labels differ by system. Evidence: [Radix Themes](https://www.radix-ui.com/themes/docs/components/button), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/button/usage), [Chakra/Ark](https://chakra-ui.com/docs/components/button), [Ant Design](https://ant.design/components/button). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L1)

- **Semantic destructive action** — layer 2; **7 systems**; Area **yes**; **retain**. Existing danger tone. Evidence: [Untitled UI](https://www.untitledui.com/react/components/buttons), [Primer](https://primer.style/product/components/button), [Carbon](https://carbondesignsystem.com/components/button/usage), [Ant Design](https://ant.design/components/button), [Atlassian](https://atlassian.design/components/button/examples), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button.md), [GOV.UK](https://design-system.service.gov.uk/components/button). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L1)

- **Pill and ordinary shape** — layer 2; **3 systems**; Area **yes**; **retain**. Existing pill boolean plus normal shape. Evidence: [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/button/usage), [Ant Design](https://ant.design/components/button), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/CommonButton.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L1)

- **Extra local size tiers** — layer 2; **6 systems**; Area **owner-decision**; **owner**. Existing owner decision prefers system compact density over new sizes. Evidence: [Untitled UI](https://www.untitledui.com/react/components/buttons), [shadcn/ui](https://ui.shadcn.com/docs/components/button.md), [Radix Themes](https://www.radix-ui.com/themes/docs/components/button), [Mantine](https://mantine.dev/llms/core-button.md), [Chakra/Ark](https://chakra-ui.com/docs/components/button), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/CommonButton.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L1)

- **Icon-only and leading/trailing icon** — layer 3; **10 systems**; Area **yes**; **retain**. Existing icon slots and iconOnly. Evidence: [Untitled UI](https://www.untitledui.com/react/components/buttons), [shadcn/ui](https://ui.shadcn.com/docs/components/button.md), [Radix Themes](https://www.radix-ui.com/themes/docs/components/button), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/button/usage), [Primer](https://primer.style/product/components/button), [Mantine](https://mantine.dev/llms/core-button.md), [Chakra/Ark](https://chakra-ui.com/docs/components/button), [Ant Design](https://ant.design/components/button), [Atlassian](https://atlassian.design/components/button/examples), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L1)

- **Loading with preserved text/spinner policy** — layer 3; **4 systems**; Area **partial**; **add**. Loading exists; choose explicit spinner placement and text-preservation policy. Evidence: [Untitled UI](https://www.untitledui.com/react/components/buttons), [Mantine](https://mantine.dev/llms/core-button.md), [Chakra/Ark](https://chakra-ui.com/docs/components/button), [Ant Design](https://ant.design/components/button). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L1)

- **Compound secondary description** — layer 3; **1 systems**; Area **not-found**; **consider**. Adds new anatomy, not a size or tone variant. Evidence: [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/button/usage). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L1)

- **Shortcut hint** — layer 3; **1 systems**; Area **yes**; **retain**. Existing Kbd composition. Evidence: [Primer](https://primer.style/product/components/button). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L1)

- **Focusable disabled explanation** — layer 3; **2 systems**; Area **not-found**; **consider**. Separate aria-disabled policy from native disabled; verify behavior before offering it. Evidence: [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/button/usage), [Base UI](https://base-ui.com/react/components/button.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — component

- [component/source](https://www.untitledui.com/react/components/buttons) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/button.md) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — component

- [component/source](https://www.radix-ui.com/themes/docs/components/button) — read; checked 2026-09-28.

- [component/source](https://www.radix-ui.com/themes/docs/components/icon-button) — read; checked 2026-09-28.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — headless

- [component/source](https://base-ui.com/react/components/button.md) — read; checked 2026-09-28.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — component

- [component/source](https://react-aria.adobe.com/Button.md) — read; checked 2026-09-28.

- [component/source](https://react-aria.adobe.com/ToggleButton.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/Button.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/ActionButton.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/ToggleButton.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — component

- [component/source](https://fluent2.microsoft.design/components/web/react/core/button/usage) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/Button/Button.types.ts) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/ToggleButton/ToggleButton.types.ts) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/CompoundButton/CompoundButton.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — component

- [component/source](https://primer.style/product/components/button) — read; checked 2026-09-28.

- [component/source](https://primer.style/product/components/icon-button) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — component

- [component/source](https://carbondesignsystem.com/components/button/usage) — read; checked 2026-09-28.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — component

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [component/source](https://m3.material.io/components/buttons/overview) — not found or unusable response; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/CommonButton.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/IconButton.md) — read; checked 2026-09-28.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/core-button.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Button/Button.tsx) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — component

- [component/source](https://ant.design/components/button) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/button) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — component

- [component/source](https://atlassian.design/components/button/examples) — read; checked 2026-09-28.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — component

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — component

- [component/source](https://design-system.service.gov.uk/components/button) — read; checked 2026-09-28.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/buttons.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:35 — button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35)

- [docs/specs/button.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L1)

- [docs/specs/button.md:9 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L9)

- [docs/specs/button.md:29 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L29)

- [docs/specs/button.md:35 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L35)

- [docs/specs/button.md:221 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L221)

- [docs/specs/button.md:247 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button.md#L247)
