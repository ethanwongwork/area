# Link

## Job

Navigate with inline text, standalone text or an icon-supported label.

Observed family coverage: **11 / 15 implementation systems** (10 with a component source; 1 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Use native anchor behavior and shared text roles; avoid a second Button implementation.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **appearance**: `default` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-link/library/src/components/Link/Link.types.ts#L17)); `subtle` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-link/library/src/components/Link/Link.types.ts#L17)).
- **autoSize**: `boolean | { minRows: number, maxRows: number }` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L148)).
- **colorPalette**: `gray` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/link)); `red` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/link)); `orange` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/link)); `yellow` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/link)); `green` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/link)); `teal` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/link)); `blue` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/link)); `cyan` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/link)); `purple` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/link)); `pink` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/link)).
- **disabled**: `false` — 3 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-link/library/src/components/Link/Link.types.ts#L23), [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Link/Link.tsx#L37), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L87)); `true` — 3 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-link/library/src/components/Link/Link.types.ts#L23), [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Link/Link.tsx#L37), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L87)).
- **disabledFocusable**: `false` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-link/library/src/components/Link/Link.types.ts#L30)); `true` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-link/library/src/components/Link/Link.types.ts#L30)).
- **expanded**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L187)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L187)).
- **isDisabled**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Link.tsx#L87)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Link.tsx#L87)).
- **isFocusVisible**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Link.tsx#L81)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Link.tsx#L81)).
- **isFocused**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Link.tsx#L75)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Link.tsx#L75)).
- **isHovered**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Link.tsx#L63)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Link.tsx#L63)).
- **isQuiet**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Link.tsx#L40)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Link.tsx#L40)).
- **isStandalone**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Link.tsx#L38)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Link.tsx#L38)).
- **size**: `1` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/link.props.tsx#L11)); `2` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/link.props.tsx#L11)); `3` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/link.props.tsx#L11)); `4` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/link.props.tsx#L11)); `5` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/link.props.tsx#L11)); `6` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/link.props.tsx#L11)); `7` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/link.props.tsx#L11)); `8` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/link.props.tsx#L11)); `9` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/link.props.tsx#L11)); `sm` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Link/Link.tsx#L57)); `md` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Link/Link.tsx#L57)); `lg` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Link/Link.tsx#L57)).
- **tone**: `critical` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/actions/link)); `auto` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/actions/link)); `neutral` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/actions/link)).
- **underline**: `auto` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/link.props.tsx#L12)); `always` — 2 systems ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/link.props.tsx#L12), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Anchor/Anchor.tsx#L12)); `hover` — 2 systems ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/link.props.tsx#L12), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Anchor/Anchor.tsx#L12)); `none` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/link.props.tsx#L12)); `not-hover` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Anchor/Anchor.tsx#L12)); `never` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Anchor/Anchor.tsx#L12)).
- **variant**: `primary` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Link.tsx#L34)); `secondary` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Link.tsx#L34)); `underline` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/link)); `plain` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/link)).

</details>

## Structural alternatives

- **Inline, standalone and icon-supported links** — 2 observed implementation systems. [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/link/usage), [Carbon](https://carbondesignsystem.com/components/link/usage/).
- **Back and skip navigation recipes** — 1 observed implementation systems. [GOV.UK](https://design-system.service.gov.uk/components/back-link/), [GOV.UK](https://design-system.service.gov.uk/components/skip-link/).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Truncate** — 1 system(s): [Radix Themes](https://www.radix-ui.com/themes/docs/components/link).
- **Inline links** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/link/usage).
- **Default vs. subtle links** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/link/usage).
- **Icons in links** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/link/usage).
- **Make it short, descriptive, and actionable** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/link/usage).
- **Inline with text** — 1 system(s): [Primer](https://primer.style/product/components/link/).
- **Placement** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/link/usage/).
- **Icon indicator** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/link/usage/).
- **Interactions** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/link/usage/).
- **Inline link** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/link/usage/).
- **Links that trigger actions** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/link/usage/).
- **Link grouping** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/link/usage/).
- **actions** — 1 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L98).
- **editable** — 1 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L128).
- **Within Text** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/link).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **placement**: `start` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L106)); `end` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L106)).
- **rows**: `number` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L188)).

</details>

## Interaction patterns

React Aria documents router integration and disabled links. Fluent and Carbon distinguish inline versus standalone use; destinations and link names remain meaningful.

Evidence: [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/Link.mdx#L1-L35), [Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-link/library/src/components/Link/Link.types.ts#L1-L53), [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Link/Link.tsx#L1-L212).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **code**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L84)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L84)).
- **delete**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L86)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L86)).
- **editing**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L149)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L149)).
- **ellipsis**: `expandable` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L48)); `rows` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L48)); `onExpand` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L48)).
- **expandable**: `collapsible` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L186)).
- **format**: `text/plain` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L121)); `text/html` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L121)).
- **inline**: `false` — 3 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-link/library/src/components/Link/Link.types.ts#L36), [Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Link/Link.tsx#L15), [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Link/Link.tsx#L47)); `true` — 3 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-link/library/src/components/Link/Link.types.ts#L36), [Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Link/Link.tsx#L15), [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Link/Link.tsx#L47)).
- **italic**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L90)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L90)).
- **keyboard**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L50)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L50)).
- **mark**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L91)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L91)).
- **muted**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Link/Link.tsx#L13)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Link/Link.tsx#L13)).
- **staticColor**: `white` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Link.tsx#L36)); `black` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Link.tsx#L36)); `auto` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Link.tsx#L36)).
- **strong**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L92)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L92)).
- **target**: `auto` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/actions/link)); `_blank` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/actions/link)); `_self` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/actions/link)); `_parent` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/actions/link)); `_top` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/actions/link)).
- **triggerType**: `Array&lt;icon|text&gt;` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L156)).
- **visited**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Link/Link.tsx#L67)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Link/Link.tsx#L67)).

</details>

## Reuses in Area

[Code](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L623), [Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Use native anchor behavior and shared text roles; avoid a second Button implementation.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 2 — Underline policy**: 3 observed systems. [Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/link.props.tsx#L12), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Anchor/Anchor.tsx#L12), [Chakra/Ark](https://www.chakra-ui.com/docs/components/link).
- **Layer 3 — Inline, standalone and icon-supported links**: 2 observed systems. [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/link/usage), [Carbon](https://carbondesignsystem.com/components/link/usage/).
- **Layer 3 — Back and skip navigation recipes**: 1 observed systems. [GOV.UK](https://design-system.service.gov.uk/components/back-link/), [GOV.UK](https://design-system.service.gov.uk/components/skip-link/).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Link`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: [link — component](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/link.props.tsx#L1-L34).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: [Link — component](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/Link.mdx#L1-L35).
- **Fluent 2**: [link — component](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-link/library/src/components/Link/Link.types.ts#L1-L53).
- **Primer**: [link — component](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Link/Link.tsx#L1-L60).
- **Carbon**: [Link — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Link/Link.tsx#L1-L212).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [Anchor — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Anchor/Anchor.tsx#L1-L56).
- **Ant Design**: [typography — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L1-L202).
- **Chakra/Ark**: [link — component](https://www.chakra-ui.com/docs/components/link).
- **Atlassian**: [link — component](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/link/README.md#lines-1:13).
- **Polaris**: [link — component](https://shopify.dev/docs/api/app-home/latest/web-components/actions/link).
- **GOV.UK**: [back-link — recipe](https://design-system.service.gov.uk/components/back-link/); [skip-link — recipe](https://design-system.service.gov.uk/components/skip-link/).
- **Apple HIG**: [menus — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/menus).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
