# Selectable List

## Job

Present selectable rows that may also contain independent actions.

Observed family coverage: **7 / 15 implementation systems** (7 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Use a distinct collection contract when a row has nested controls; compose Avatar and Checkbox slots.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **HeadingVariants**: `large` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Heading.tsx#L13)); `medium` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Heading.tsx#L13)); `small` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Heading.tsx#L13)).
- **colorPalette**: `gray` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `red` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `orange` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `yellow` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `green` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `teal` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `blue` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `cyan` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `purple` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `pink` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **disabled**: `false` — 2 systems ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list)); `true` — 2 systems ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list)).
- **isCondensed**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/StructuredList/StructuredList.tsx#L54)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/StructuredList/StructuredList.tsx#L54)).
- **isDisabled**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L507)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L507)).
- **isDropTarget**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L761)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L761)).
- **isFlush**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/StructuredList/StructuredList.tsx#L59)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/StructuredList/StructuredList.tsx#L59)).
- **isFocusVisible**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L136)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L136)).
- **isFocused**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L130)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L130)).
- **isInset**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContainedList/ContainedList.tsx#L46)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContainedList/ContainedList.tsx#L46)).
- **isLoading**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L840)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L840)).
- **selected**: `false` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list)); `true` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list)).
- **selectionVariant**: `ActionListProps['selectionVariant'] | false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Group.tsx#L67)).
- **size**: `HeadingVariants` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Heading.tsx#L16)); `sm` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContainedList/ContainedList.tsx#L61)); `md` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContainedList/ContainedList.tsx#L61)); `lg` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContainedList/ContainedList.tsx#L61)); `xl` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContainedList/ContainedList.tsx#L61)).
- **variant**: `inline` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Description.tsx#L15)); `block` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Description.tsx#L15)); `filled` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Group.tsx#L135)); `subtle` — 2 systems ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Group.tsx#L135), [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `on-page` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContainedList/ContainedList.tsx#L19)); `disclosed` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContainedList/ContainedList.tsx#L19)); `solid` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `plain` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).

</details>

## Structural alternatives

- **Row selection versus nested row actions** — 2 observed implementation systems. [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/list/usage), [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList.mdx#L588).
- **Inline actions and grouped rows** — 2 observed implementation systems. [Carbon](https://carbondesignsystem.com/components/contained-list/usage/), [Primer](https://primer.style/product/components/action-list/).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Asynchronous loading** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList.mdx#L364).
- **Empty state** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList.mdx#L525).
- **Selection and actions** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList.mdx#L588).
- **GridList** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList.mdx#L1060).
- **GridListSection** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList.mdx#L1064).
- **GridListHeader** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList.mdx#L1068).
- **GridListItem** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList.mdx#L1072).
- **GridListLoadMoreItem** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList.mdx#L1076).
- **AriaGridListProps** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList/useGridList.mdx#L111).
- **GridListAria** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList/useGridList.mdx#L115).
- **AriaGridListItemOptions** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList/useGridList.mdx#L119).
- **GridListItemAria** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList/useGridList.mdx#L123).
- **Single action** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/list/usage).
- **Multiple actions** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/list/usage).
- **Selection as primary action** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/list/usage).
- **Selection as secondary action** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/list/usage).
- **Structure and placement** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/list/usage).
- **list, listbox, and grid roles** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/list/usage).
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
- **Column header titles** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/structured-list/usage/).
- **Selectable** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/structured-list/usage/).
- **Interactions** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/structured-list/usage/).
- **Contained list** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/contained-list/usage/).
- **Placement** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/contained-list/usage/).
- **Inline actions** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/contained-list/usage/).
- **Non-interactive icons** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/contained-list/usage/).
- **Disabled Item** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Multiple** — 1 system(s): [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L59).
- **Grouping** — 1 system(s): [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L65).
- **Horizontal** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Grid Layout** — 1 system(s): [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L85).
- **With Store** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Grouped** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Multiple Selection** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
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
- **Anchor to Add a single-select choice listAdd a single-select choice list** — 1 system(s): [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **action**: `ReactNode` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContainedList/ContainedList.tsx#L31)).
- **headingWrapElement**: `div` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Group.tsx#L133)); `li` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Group.tsx#L133)).
- **label**: `string | ReactNode` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContainedList/ContainedList.tsx#L56)).
- **noWrap**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/StructuredList/StructuredList.tsx#L533)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/StructuredList/StructuredList.tsx#L533)).
- **orientation**: `Orientation` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L206)); `horizontal` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `vertical` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).

</details>

## Interaction patterns

Fluent distinguishes selection as primary versus secondary action and list/listbox/grid roles. React Aria GridList supports row actions, selection and drag/drop.

Evidence: [Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-list/library/src/components/List/List.types.ts#L1-L53), [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList.mdx#L1-L300).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **ListNavigationMode**: `items` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-list/library/src/components/List/List.types.ts#L22)); `composite` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-list/library/src/components/List/List.types.ts#L22)).
- **UNSTABLE_focusOnEntry**: `first` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L213)); `last` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L213)).
- **allowsArrowNavigation**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L523)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L523)).
- **autoHighlight**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **deselectable**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **disallowSelectAll**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **disallowTypeAhead**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L180)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L180)).
- **focusMode**: `child` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L517)); `row` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L517)).
- **head**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/StructuredList/StructuredList.tsx#L528)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/StructuredList/StructuredList.tsx#L528)).
- **highlightOnHover**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **keyboardPriority**: `caret` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `navigate` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **layout**: `stack` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L199)); `grid` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L199)).
- **loopFocus**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **multiple**: `false` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list)); `true` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list)).
- **navigationMode**: `ListNavigationMode` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-list/library/src/components/List/List.types.ts#L28)).
- **selectOnHighlight**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **selection**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/StructuredList/StructuredList.tsx#L271)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/StructuredList/StructuredList.tsx#L271)).
- **selectionBehavior**: `SelectionBehavior` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/GridList.tsx#L186)).
- **selectionMode**: `SelectionMode` — 2 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-list/library/src/components/List/List.types.ts#L29), [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **truncate**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Description.tsx#L22)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Description.tsx#L22)).
- **type**: `string` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/LinkItem.tsx#L19)).
- **typeahead**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **visuallyHidden**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Heading.tsx#L17)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/Heading.tsx#L17)).

</details>

## Reuses in Area

[Checkbox](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L224), [Radio](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L242), [Avatar](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L361). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Use a distinct collection contract when a row has nested controls; compose Avatar and Checkbox slots.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Row selection versus nested row actions**: 2 observed systems. [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/list/usage), [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList.mdx#L588).
- **Layer 3 — Inline actions and grouped rows**: 2 observed systems. [Carbon](https://carbondesignsystem.com/components/contained-list/usage/), [Primer](https://primer.style/product/components/action-list/).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Selectable List`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: [GridList — component](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/GridList.mdx#L1-L300).
- **Fluent 2**: [list — component](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-list/library/src/components/List/List.types.ts#L1-L53).
- **Primer**: [action-list — component](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ActionList/ActionListContainerContext.tsx#L1-L21).
- **Carbon**: [StructuredList — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/StructuredList/StructuredList.tsx#L1-L300); [ContainedList — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ContainedList/ContainedList.tsx#L1-L173).
- **Material 3**: [listitem — component](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/lib/java/com/google/android/material/listitem/ListItemCardView.java#L1-L161).
- **Mantine**: [List — analogue](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/List/List.tsx#L1-L150).
- **Ant Design**: [list — analogue](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/list/index.en-US.md#L1-L128).
- **Chakra/Ark**: [listbox — component](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L1-L155).
- **Atlassian**: **not found** for this job in the reviewed [catalogue](https://atlassian.design/components) and [pinned source inventory](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651).
- **Polaris**: [choice-list — component](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [lists-and-tables — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
