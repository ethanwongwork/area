# ListBox

## Job

Select values from an always-visible option collection.

Observed family coverage: **7 / 15 implementation systems** (5 with a component source; 2 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Own focus, selection and typeahead independently of a popup; reuse it in MultiSelect and TransferList.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **HeadingVariants**: `large` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Heading.tsx#L13)); `medium` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Heading.tsx#L13)); `small` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Heading.tsx#L13)).
- **MantineSize**: `xs` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `sm` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `md` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `lg` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `xl` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)).
- **appearance**: `filled-darker` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts#L22)); `filled-lighter` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts#L22)); `outline` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts#L22)); `underline` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts#L22)).
- **colorPalette**: `gray` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `red` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `orange` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `yellow` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `green` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `teal` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `blue` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `cyan` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `purple` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `pink` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **disabled**: `false` — 4 systems ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/trigger/SelectTrigger.tsx#L265), [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ListBox/ListBox.tsx#L45), [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox), [Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts#L141)); `true` — 4 systems ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/trigger/SelectTrigger.tsx#L265), [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ListBox/ListBox.tsx#L45), [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox), [Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts#L141)).
- **invalid**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ListBox/ListBox.tsx#L50)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ListBox/ListBox.tsx#L50)).
- **isDisabled**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/ListBox.tsx#L527)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/ListBox.tsx#L527)).
- **isDropTarget**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/ListBox.tsx#L688)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/ListBox.tsx#L688)).
- **isFocusVisible**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/ListBox.tsx#L129)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/ListBox.tsx#L129)).
- **isFocused**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/ListBox.tsx#L123)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/ListBox.tsx#L123)).
- **isLoading**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/ListBox.tsx#L739)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/ListBox.tsx#L739)).
- **isOpen**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ListBox/ListBox.tsx#L65)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ListBox/ListBox.tsx#L65)).
- **open**: `false` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/root/SelectRoot.tsx#L664)); `true` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/root/SelectRoot.tsx#L664)).
- **readOnly**: `false` — 2 systems ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/trigger/SelectTrigger.tsx#L244), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Combobox/Combobox.tsx#L84)); `true` — 2 systems ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/trigger/SelectTrigger.tsx#L244), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Combobox/Combobox.tsx#L84)).
- **selected**: `false` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/item-indicator/SelectItemIndicator.tsx#L32)); `true` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/item-indicator/SelectItemIndicator.tsx#L32)).
- **selectionVariant**: `ActionListProps['selectionVariant'] | false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Group.tsx#L67)).
- **size**: `HeadingVariants` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Heading.tsx#L16)); `ListBoxSize` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ListBox/ListBox.tsx#L79)); `MantineSize | (string & {})` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Combobox/Combobox.tsx#L75)); `small` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts#L82)); `medium` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts#L82)); `large` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts#L82)).
- **variant**: `inline` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Description.tsx#L15)); `block` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Description.tsx#L15)); `filled` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Group.tsx#L135)); `subtle` — 2 systems ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Group.tsx#L135), [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `solid` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `plain` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).

</details>

## Structural alternatives

- **Grouped options with descriptions** — 3 observed implementation systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox), [Primer](https://primer.style/product/components/action-list/), [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/select/page.mdx#L197).
- **Horizontal or grid option collection** — 2 observed implementation systems. [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/ListBox.mdx#L280), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L85).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Asynchronous loading** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/ListBox.mdx#L147).
- **Empty state** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/ListBox.mdx#L230).
- **Positioning** — 1 system(s): [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/select/page.mdx#L57).
- **Typed wrapper component** — 1 system(s): [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/select/page.mdx#L75).
- **Multiple selection** — 2 system(s): [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/select/page.mdx#L180), [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Grouped** — 2 system(s): [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/select/page.mdx#L197), [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Icon** — 1 system(s): [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/select/page.mdx#L278).
- **Positioner** — 1 system(s): [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/select/page.mdx#L290).
- **Group** — 1 system(s): [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/select/page.mdx#L318).
- **GroupLabel** — 1 system(s): [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/select/page.mdx#L322).
- **ActionList** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **Items with leading and trailing content** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **Items with trailing actions** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **Items with dividers** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **Items with inline descriptions** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **Items with block descriptions** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **With a danger item** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **With an inactive item** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **With a loading item** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **With a disabled item** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **Single-select** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **Multi-select** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **Grouping items with a heading** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **Grouping items with a divider** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **ActionList.Item** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **ActionList.Heading** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **ActionList.LinkItem** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **ActionList.LeadingVisual** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **ActionList.TrailingVisual** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **ActionList.TrailingAction** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **ActionList.Description** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **ActionList.GroupHeading** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **ActionList.Group** — 1 system(s): [Primer](https://primer.style/product/components/action-list/).
- **Options groups** — 1 system(s): [Mantine](https://mantine.dev/core/combobox/).
- **Scrollable list with ScrollArea** — 1 system(s): [Mantine](https://mantine.dev/core/combobox/).
- **Without dropdown** — 1 system(s): [Mantine](https://mantine.dev/core/combobox/).
- **Disabled Item** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Multiple** — 1 system(s): [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L59).
- **Grouping** — 1 system(s): [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L65).
- **Horizontal** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Grid Layout** — 1 system(s): [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L85).
- **With Store** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **With Checkmark** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **With Icon** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **With Description** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **With Input** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **With Popover** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **With Dialog** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Image Explorer** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Emoji Grid** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **ItemGroup** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **ItemGroupLabel** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **alignItemWithTrigger**: `false` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/positioner/SelectPositioner.tsx#L260)); `true` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/positioner/SelectPositioner.tsx#L260)).
- **heading**: `ReactNode` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria/src/listbox/useListBoxSection.ts#L19)).
- **headingWrapElement**: `div` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Group.tsx#L133)); `li` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Group.tsx#L133)).
- **invalidText**: `React.ReactNode` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ListBox/ListBox.tsx#L55)).
- **label**: `ReactNode` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria/src/listbox/useListBox.ts#L61)); `React.ReactNode` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/root/SelectRoot.tsx#L704)).
- **orientation**: `Orientation` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/ListBox.tsx#L193)); `Orientation | undefined` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/separator/SelectSeparator.tsx#L11)); `horizontal` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `vertical` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **placeholder**: `React.ReactNode` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/value/SelectValue.tsx#L101)).
- **shouldFocusWrap**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria/src/listbox/useListBox.ts#L42)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria/src/listbox/useListBox.ts#L42)).
- **warnText**: `React.ReactNode` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ListBox/ListBox.tsx#L95)).

</details>

## Interaction patterns

React Aria documents selection, layouts and drag/drop. Ark supports extended selection and keyboard priority; interactive row actions require a grid-style list contract.

Evidence: [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/ListBox.tsx#L1-L27), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L1-L155).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **autoHighlight**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **clearable**: `false` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts#L27)); `true` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts#L27)).
- **deselectable**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **direction**: `up` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/scroll-arrow/SelectScrollArrow.tsx#L176)); `down` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/scroll-arrow/SelectScrollArrow.tsx#L176)).
- **disableAutoFocus**: `false` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts#L44)); `true` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts#L44)).
- **disallowSelectAll**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **dropdownOpened**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Combobox/Combobox.types.ts#L68)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Combobox/Combobox.types.ts#L68)).
- **escapeKeyBehavior**: `clearSelection` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria/src/listbox/useListBox.ts#L55)); `none` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria/src/listbox/useListBox.ts#L55)).
- **floatingHeight**: `viewport` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Combobox/Combobox.types.ts#L104)).
- **highlightItemOnHover**: `false` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/root/SelectRoot.tsx#L644)); `true` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/root/SelectRoot.tsx#L644)).
- **highlightOnHover**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **inlinePopup**: `false` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts#L50)); `true` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts#L50)).
- **keepMounted**: `false` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/scroll-up-arrow/SelectScrollUpArrow.tsx#L29)); `true` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/scroll-up-arrow/SelectScrollUpArrow.tsx#L29)).
- **keyboardPriority**: `caret` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `navigate` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **layout**: `stack` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/ListBox.tsx#L186)); `grid` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/ListBox.tsx#L186)).
- **light**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ListBox/ListBox.tsx#L74)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ListBox/ListBox.tsx#L74)).
- **loopFocus**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **modal**: `false` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/root/SelectRoot.tsx#L673)); `true` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/root/SelectRoot.tsx#L673)).
- **multiselect**: `false` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/Selection.types.ts#L17)); `true` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/utils/Selection.types.ts#L17)).
- **required**: `false` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/root/SelectRoot.tsx#L623)); `true` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/select/root/SelectRoot.tsx#L623)).
- **resetSelectionOnOptionHover**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Combobox/Combobox.tsx#L81)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Combobox/Combobox.tsx#L81)).
- **selectFirstOptionOnChange**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Combobox/Combobox.types.ts#L80)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Combobox/Combobox.types.ts#L80)).
- **selectFirstOptionOnDropdownOpen**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Combobox/Combobox.types.ts#L83)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Combobox/Combobox.types.ts#L83)).
- **selectOnHighlight**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **selectionBehavior**: `SelectionBehavior` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria/src/listbox/useListBox.ts#L63)).
- **selectionMode**: `SelectionMode` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **shouldFocusOnHover**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria/src/listbox/useListBox.ts#L67)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria/src/listbox/useListBox.ts#L67)).
- **shouldSelectOnPressUp**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria/src/listbox/useListBox.ts#L65)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria/src/listbox/useListBox.ts#L65)).
- **truncate**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Description.tsx#L22)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Description.tsx#L22)).
- **type**: `string` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/LinkItem.tsx#L19)); `ListBoxType` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ListBox/ListBox.tsx#L85)).
- **typeahead**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **visuallyHidden**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Heading.tsx#L17)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Heading.tsx#L17)).
- **warn**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ListBox/ListBox.tsx#L90)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ListBox/ListBox.tsx#L90)).
- **withScrollArea**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Combobox/Combobox.types.ts#L98)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Combobox/Combobox.types.ts#L98)).

</details>

## Reuses in Area

[Checkbox](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L224), [Chip](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L291). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Own focus, selection and typeahead independently of a popup; reuse it in MultiSelect and TransferList.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 2 — Single/multiple and extended selection**: 2 observed systems. [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/ListBox.mdx#L23), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L72).
- **Layer 3 — Grouped options with descriptions**: 3 observed systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox), [Primer](https://primer.style/product/components/action-list/), [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/select/page.mdx#L197).
- **Layer 3 — Horizontal or grid option collection**: 2 observed systems. [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/ListBox.mdx#L280), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L85).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `ListBox`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: [select — recipe](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/select/page.mdx#L1-L300).
- **React Aria / Spectrum 2**: [ListBox — component](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/ListBox.tsx#L1-L27).
- **Fluent 2**: [@Listbox — component](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/components/Listbox/Listbox.types.ts#L1-L66).
- **Primer**: [action-list — recipe](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/ActionListContainerContext.tsx#L1-L21).
- **Carbon**: [ListBox — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ListBox/ListBox.tsx#L1-L241).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [Combobox — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Combobox/Combobox.tsx#L1-L300).
- **Ant Design**: [select — analogue](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/select/index.en-US.md#L1-L246).
- **Chakra/Ark**: [listbox — component](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L1-L155).
- **Atlassian**: **not found** for this job in the reviewed [catalogue](https://atlassian.design/components) and [pinned source inventory](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [lists-and-tables — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
