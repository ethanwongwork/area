# ToggleButtonGroup

## Job

Group pressed command buttons or choose a mutually exclusive mode.

Observed family coverage: **10 / 15 implementation systems** (9 with a component source; 1 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Reuse ButtonGroup and Segmented; add the missing selection contract instead of another track renderer.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **MantineSize**: `xs` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `sm` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `md` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `lg` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `xl` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)).
- **disabled**: `false` — 4 systems ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/toggle-group/ToggleGroup.tsx#L174), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SegmentedControl/SegmentedControl.tsx#L77), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.en-US.md#L67), [Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control)); `true` — 4 systems ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/toggle-group/ToggleGroup.tsx#L174), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SegmentedControl/SegmentedControl.tsx#L77), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.en-US.md#L67), [Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control)).
- **invalid**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control)).
- **isDisabled**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/ToggleButtonGroup.tsx#L42)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/ToggleButtonGroup.tsx#L42)).
- **isEmphasized**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/ToggleButtonGroup.tsx#L37)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/ToggleButtonGroup.tsx#L37)).
- **radius**: `MantineRadius` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SegmentedControl/SegmentedControl.tsx#L92)).
- **readOnly**: `false` — 2 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SegmentedControl/SegmentedControl.tsx#L104), [Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control)); `true` — 2 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SegmentedControl/SegmentedControl.tsx#L104), [Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control)).
- **shape**: `default` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.tsx#L84)); `round` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.tsx#L84)).
- **size**: `1` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/segmented-control.props.tsx#L5)); `2` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/segmented-control.props.tsx#L5)); `3` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/segmented-control.props.tsx#L5)); `small` — 2 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-toolbar/library/src/components/Toolbar/Toolbar.types.ts#L26), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.en-US.md#L56)); `medium` — 2 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-toolbar/library/src/components/Toolbar/Toolbar.types.ts#L26), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.en-US.md#L56)); `large` — 2 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-toolbar/library/src/components/Toolbar/Toolbar.types.ts#L26), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.en-US.md#L56)); `sm` — 2 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContentSwitcher/ContentSwitcher.tsx#L72), [Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control)); `md` — 2 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContentSwitcher/ContentSwitcher.tsx#L72), [Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control)); `lg` — 2 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContentSwitcher/ContentSwitcher.tsx#L72), [Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control)); `MantineSize | (string & {})` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SegmentedControl/SegmentedControl.tsx#L89)); `SizeType` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.tsx#L79)); `xs` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control)).
- **variant**: `surface` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/segmented-control.props.tsx#L6)); `classic` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/segmented-control.props.tsx#L6)).

</details>

## Structural alternatives

- **Horizontal or vertical command group** — 2 observed implementation systems. [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/registry/bases/aria/ui/toggle-group.tsx#L38), [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria/src/button/useToggleButtonGroup.ts#L32).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Composition** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/toggle-group.mdx#L69).
- **Outline** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/toggle-group.mdx#L79).
- **Vertical** — 2 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/toggle-group.mdx#L97), [Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control).
- **Disabled** — 3 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/toggle-group.mdx#L103), [Mantine](https://mantine.dev/core/segmented-control/), [Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control).
- **Multiple** — 2 system(s): [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/toggle-group/page.mdx#L25), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/toggle-group.mdx#L36).
- **ToggleButtonGroup** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/ToggleButtonGroup.mdx#L134).
- **ToggleGroupState** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/ToggleButtonGroup/useToggleButtonGroup.mdx#L57).
- **AriaToggleButtonGroupProps** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/ToggleButtonGroup/useToggleButtonGroup.mdx#L61).
- **ToggleButtonGroupAria** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/ToggleButtonGroup/useToggleButtonGroup.mdx#L65).
- **AriaToggleButtonGroupItemProps** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/ToggleButtonGroup/useToggleButtonGroup.mdx#L69).
- **Create logical groupings** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/toolbar/usage).
- **Identify multiple toolbars** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/toolbar/usage).
- **Icons as button labels** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/toolbar/usage).
- **Binary actions** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/content-switcher/usage/).
- **Icon width** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/content-switcher/usage/).
- **Aligning to the grid** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/content-switcher/usage/).
- **Placement** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/content-switcher/usage/).
- **Interactions** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/content-switcher/usage/).
- **Content switcher with icons** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/content-switcher/usage/).
- **readOnly** — 1 system(s): [Mantine](https://mantine.dev/core/segmented-control/).
- **SegmentGroupItems** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control).
- **Disabled Item** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control).
- **Icon** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control).
- **Card** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control).
- **With Tooltip** — 1 system(s): [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/toggle-group.mdx#L42).
- **Variants of button groups** — 1 system(s): [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ButtonGroup.md#L103).
- **Button group examples** — 1 system(s): [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ButtonGroup.md#L114).
- **Connected button group examples** — 1 system(s): [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ButtonGroup.md#L166).
- **Making button groups adaptive** — 1 system(s): [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ButtonGroup.md#L221).
- **Overflow mode - wrap** — 1 system(s): [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ButtonGroup.md#L395).
- **Customizing button groups** — 1 system(s): [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ButtonGroup.md#L439).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **fullWidth**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SegmentedControl/SegmentedControl.tsx#L83)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SegmentedControl/SegmentedControl.tsx#L83)).
- **orientation**: `Orientation | undefined` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/toggle-group/ToggleGroup.tsx#L178)); `Orientation` — 2 systems ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria/src/button/useToggleButtonGroup.ts#L32), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.tsx#L81)); `vertical` — 3 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SegmentedControl/SegmentedControl.tsx#L101), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.en-US.md#L55), [Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control)); `horizontal` — 3 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SegmentedControl/SegmentedControl.tsx#L101), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.en-US.md#L55), [Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control)).

</details>

## Interaction patterns

Base UI and React Aria support single/multiple pressed sets. Radix Themes SegmentedControl is a single-choice analogue within the family, not evidence of multiple selection.

Evidence: [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/toggle-group/page.mdx#L1-L52), [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/ToggleButtonGroup.mdx#L1-L93), [Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/segmented-control.props.tsx#L1-L19).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **block**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.tsx#L77)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.tsx#L77)).
- **light**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContentSwitcher/ContentSwitcher.tsx#L46)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContentSwitcher/ContentSwitcher.tsx#L46)).
- **loopFocus**: `false` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/toggle-group/ToggleGroup.tsx#L184)); `true` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/toggle-group/ToggleGroup.tsx#L184)).
- **lowContrast**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContentSwitcher/ContentSwitcher.tsx#L51)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContentSwitcher/ContentSwitcher.tsx#L51)).
- **multiple**: `false` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/toggle-group/ToggleGroup.tsx#L191)); `true` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/toggle-group/ToggleGroup.tsx#L191)).
- **required**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/segmented-control)).
- **selectionMode**: `automatic` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContentSwitcher/ContentSwitcher.tsx#L67)); `manual` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContentSwitcher/ContentSwitcher.tsx#L67)).
- **vertical**: `false` — 2 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-toolbar/library/src/components/Toolbar/Toolbar.types.ts#L32), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.tsx#L80)); `true` — 2 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-toolbar/library/src/components/Toolbar/Toolbar.types.ts#L32), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.tsx#L80)).
- **withItemsBorders**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SegmentedControl/SegmentedControl.tsx#L110)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SegmentedControl/SegmentedControl.tsx#L110)).

</details>

## Reuses in Area

[ButtonGroup](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L59), [Segmented](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L612). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Reuse ButtonGroup and Segmented; add the missing selection contract instead of another track renderer.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 2 — Single or multiple pressed values**: 3 observed systems. [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/toggle-group/ToggleGroup.tsx#L142), [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/ToggleButtonGroup.mdx#L14), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/toggle-group.mdx#L36).
- **Layer 3 — Horizontal or vertical command group**: 2 observed systems. [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/registry/bases/aria/ui/toggle-group.tsx#L38), [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria/src/button/useToggleButtonGroup.ts#L32).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `ToggleButtonGroup`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: [toggle-group — component](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/toggle-group.mdx#L1-L135).
- **Radix Themes**: [segmented-control — component](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/segmented-control.props.tsx#L1-L19).
- **Base UI**: [toggle-group — component](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/toggle-group/page.mdx#L1-L52).
- **React Aria / Spectrum 2**: [ToggleButtonGroup — component](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/ToggleButtonGroup.mdx#L1-L93).
- **Fluent 2**: [toolbar — recipe](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-toolbar/library/src/components/Toolbar/Toolbar.types.ts#L1-L91).
- **Primer**: **not found** for this job in the reviewed [catalogue](https://primer.style/product/components/) and [pinned source inventory](https://github.com/primer/react/tree/a89299ae77e8f444599f94d7e9ca368c17be3f9a).
- **Carbon**: [ContentSwitcher — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContentSwitcher/ContentSwitcher.tsx#L1-L260).
- **Material 3**: [button — component](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/lib/java/com/google/android/material/button/MaterialButton.java#L1-L300).
- **Mantine**: [SegmentedControl — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SegmentedControl/SegmentedControl.tsx#L1-L300).
- **Ant Design**: [segmented — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/segmented/index.en-US.md#L1-L80).
- **Chakra/Ark**: [segmented-control — component](https://www.chakra-ui.com/docs/components/segmented-control); [@toggle-group — component](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/toggle-group.mdx#L1-L63).
- **Atlassian**: **not found** for this job in the reviewed [catalogue](https://atlassian.design/components) and [pinned source inventory](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [toolbars — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/toolbars).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
