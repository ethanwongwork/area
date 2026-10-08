# EyedropperButton

## Job

Sample a color from outside the picker when the platform supports it.

Observed family coverage: **2 / 15 implementation systems** (1 with a component source; 1 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Offer an optional ColorPicker action with an explicit unavailable state and manual-entry fallback.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **InputVariant**: `default` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L80)); `filled` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L80)); `unstyled` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L80)).
- **colorPalette**: `gray` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `red` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `orange` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `yellow` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `green` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `teal` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `blue` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `cyan` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `purple` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `pink` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **disabled**: `false` — 2 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L132), [Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `true` — 2 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L132), [Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **inputSize**: `string` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L147)).
- **invalid**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **loading**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L162)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L162)).
- **loadingPosition**: `left` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L165)); `right` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L165)).
- **open**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **radius**: `MantineRadius` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L129)).
- **readOnly**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **size**: `MantineSize | (string & {})` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L135)); `MantineFontSize` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/InputWrapper/InputWrapper.tsx#L108)); `2xs` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `xs` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `sm` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `md` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `lg` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `xl` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `2xl` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **variant**: `outline` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `subtle` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).

</details>

## Structural alternatives

- **Optional eyedropper action** — 2 observed implementation systems. [Mantine](https://mantine.dev/core/color-input/), [Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Loading state** — 1 system(s): [Mantine](https://mantine.dev/core/color-input/).
- **Preserve invalid input** — 1 system(s): [Mantine](https://mantine.dev/core/color-input/).
- **With swatches** — 1 system(s): [Mantine](https://mantine.dev/core/color-input/).
- **Change eye dropper icon** — 1 system(s): [Mantine](https://mantine.dev/core/color-input/).
- **Disabled state** — 1 system(s): [Mantine](https://mantine.dev/core/color-input/).
- **Read only** — 1 system(s): [Mantine](https://mantine.dev/core/color-input/).
- **Disabled** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker).
- **Inline** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker).
- **ReadOnly** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **description**: `React.ReactNode` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/InputWrapper/InputWrapper.tsx#L64)).
- **error**: `React.ReactNode` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/InputWrapper/InputWrapper.tsx#L67)).
- **eyeDropperIcon**: `React.ReactNode` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ColorInput/ColorInput.tsx#L68)).
- **inputWrapperOrder**: `label` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/InputWrapper/InputWrapper.tsx#L94)); `input` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/InputWrapper/InputWrapper.tsx#L94)); `description` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/InputWrapper/InputWrapper.tsx#L94)); `error` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/InputWrapper/InputWrapper.tsx#L94)).
- **label**: `React.ReactNode` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/InputWrapper/InputWrapper.tsx#L61)).
- **leftSection**: `React.ReactNode` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L102)).
- **rightSection**: `React.ReactNode` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L114)).
- **success**: `React.ReactNode` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/InputWrapper/InputWrapper.tsx#L70)).
- **wrapperProps**: `WrapperProps` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L196)).

</details>

## Interaction patterns

Mantine ColorInput and Ark ColorPicker expose eyedropper controls. Browser support and user-activation requirements must be checked when implementing the adapter.

Evidence: [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ColorInput/ColorInput.tsx#L1-L300), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/color-picker.mdx#L1-L142).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **closeOnColorSwatchClick**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ColorInput/ColorInput.tsx#L71)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ColorInput/ColorInput.tsx#L71)).
- **closeOnSelect**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **disallowInput**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ColorInput/ColorInput.tsx#L53)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ColorInput/ColorInput.tsx#L53)).
- **fixOnBlur**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ColorInput/ColorInput.tsx#L56)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ColorInput/ColorInput.tsx#L56)).
- **hideMode**: `HideMode` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **immediate**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **inline**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **lazyMount**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **multiline**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L187)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L187)).
- **openAutoFocus**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **pointer**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L138)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L138)).
- **present**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **required**: `false` — 2 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/InputWrapper/InputWrapper.tsx#L73), [Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `true` — 2 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/InputWrapper/InputWrapper.tsx#L73), [Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **skipAnimationOnMount**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **unmountOnExit**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker)).
- **withAria**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L193)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L193)).
- **withAsterisk**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/InputWrapper/InputWrapper.tsx#L76)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/InputWrapper/InputWrapper.tsx#L76)).
- **withErrorStyles**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L141)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L141)).
- **withEyeDropper**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ColorInput/ColorInput.tsx#L65)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ColorInput/ColorInput.tsx#L65)).
- **withPreview**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ColorInput/ColorInput.tsx#L62)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ColorInput/ColorInput.tsx#L62)).
- **withSuccessStyles**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L144)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx#L144)).

</details>

## Reuses in Area

[Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35), [ColorPicker](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L94). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Offer an optional ColorPicker action with an explicit unavailable state and manual-entry fallback.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Optional eyedropper action**: 2 observed systems. [Mantine](https://mantine.dev/core/color-input/), [Chakra/Ark](https://www.chakra-ui.com/docs/components/color-picker).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `EyedropperButton`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: [ColorPicker — analogue](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/ColorPicker.mdx#L1-L190).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: **not found** for this job in the reviewed [catalogue](https://primer.style/product/components/) and [pinned source inventory](https://github.com/primer/react/tree/a89299ae77e8f444599f94d7e9ca368c17be3f9a).
- **Carbon**: **not found** for this job in the reviewed [catalogue](https://carbondesignsystem.com/components/overview/components/) and [pinned source inventory](https://github.com/carbon-design-system/carbon/tree/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [ColorInput — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ColorInput/ColorInput.tsx#L1-L300).
- **Ant Design**: **not found** for this job in the reviewed [catalogue](https://ant.design/components/overview/) and [pinned source inventory](https://github.com/ant-design/ant-design/tree/7ad64087106acd078dcc7d91a4adfdf38f5ce172).
- **Chakra/Ark**: [color-picker — recipe](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/color-picker.mdx#L1-L142).
- **Atlassian**: **not found** for this job in the reviewed [catalogue](https://atlassian.design/components) and [pinned source inventory](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [color-wells — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/color-wells).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
