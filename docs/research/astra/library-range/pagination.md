# Pagination

## Job

Move through a bounded set of result pages or a sequence of content pages.

Observed family coverage: **9 / 15 implementation systems** (9 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Compose Buttons/Link plus optional page-size control; keep page index and total in product state.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **currentPageSize**: `number` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Pagination/Pagination.tsx#L130)).
- **disabled**: `false` — 2 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L97), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L51)); `true` — 2 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L97), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L51)).
- **isActive**: `false` — 2 systems ([shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/registry/bases/aria/ui/pagination.tsx#L40), [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L156)); `true` — 2 systems ([shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/registry/bases/aria/ui/pagination.tsx#L40), [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L156)).
- **isBrand**: `false` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination-dot.tsx#L11)); `true` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination-dot.tsx#L11)).
- **isDisabled**: `false` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination-base.tsx#L198)); `true` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination-base.tsx#L198)).
- **isLastPage**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Pagination/Pagination.tsx#L70)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Pagination/Pagination.tsx#L70)).
- **isSelected**: `false` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination-base.tsx#L274)); `true` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination-base.tsx#L274)).
- **pageSize**: `number` — 3 systems ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination.tsx#L371), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L54), [Chakra/Ark](https://www.chakra-ui.com/docs/components/pagination)).
- **pageSizeInputDisabled**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Pagination/Pagination.tsx#L145)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Pagination/Pagination.tsx#L145)).
- **pageSizeOptions**: `number\[]` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L55)).
- **pageSizes**: `Array&lt;number | PaginationPageSize&gt;` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Pagination/Pagination.tsx#L150)).
- **showSizeChanger**: `boolean | SelectProps` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L59)).
- **size**: `md` — 2 systems ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination-line.tsx#L9), [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L340)); `lg` — 2 systems ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination-line.tsx#L9), [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L340)); `xs` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Pagination/Pagination.tsx#L166)); `sm` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L340)); `large` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L63)); `medium` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L63)); `small` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L63)).
- **totalBoundaryShowSizeChanger**: `number` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L66)).

</details>

## Structural alternatives

- **Numbered pages or previous/next only** — 3 observed implementation systems. [Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Pagination/Pagination.tsx#L42), [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/pagination.mdx#L104), [GOV.UK](https://design-system.service.gov.uk/components/pagination/).
- **Page-size and page-jump controls** — 2 observed implementation systems. [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Pagination/Pagination.tsx#L249), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L58).
- **Attached or aligned controls** — 2 observed implementation systems. [Untitled UI](https://www.untitledui.com/react/components/pagination), [Chakra/Ark](https://www.chakra-ui.com/docs/components/pagination).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Pagination components** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/pagination).
- **Pagination example** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/pagination).
- **Pagination examples** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/pagination).
- **Card default** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/pagination).
- **Card minimal right aligned** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/pagination).
- **Card minimal center aligned** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/pagination).
- **Card minimal left aligned** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/pagination).
- **Button group right aligned** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/pagination).
- **Button group center aligned** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/pagination).
- **Button group left aligned** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/pagination).
- **Card advanced** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/pagination).
- **Card advanced center** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/pagination).
- **Pagination dot** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/pagination).
- **Pagination line** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/pagination).
- **Composition** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/pagination.mdx#L87).
- **Icons Only** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/pagination.mdx#L110).
- **Pagination** — 5 system(s): [Primer](https://primer.style/product/components/pagination/), [Carbon](https://carbondesignsystem.com/components/pagination/usage/), [Mantine](https://mantine.dev/core/pagination/), [Chakra/Ark](https://www.chakra-ui.com/docs/components/pagination), [GOV.UK](https://design-system.service.gov.uk/components/pagination/).
- **Anatomy of pagination** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/pagination/usage/).
- **Anatomy of pagination nav** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/pagination/usage/).
- **Data table size pairings** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/pagination/usage/).
- **Placement** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/pagination/usage/).
- **Placing pagination with data table** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/pagination/usage/).
- **Placing pagination nav on a page** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/pagination/usage/).
- **Interactions** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/pagination/usage/).
- **Pagination nav** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/pagination/usage/).
- **Example with chunked content** — 1 system(s): [Mantine](https://mantine.dev/core/pagination/).
- **Change icons** — 1 system(s): [Mantine](https://mantine.dev/core/pagination/).
- **use-pagination hook** — 1 system(s): [Mantine](https://mantine.dev/core/pagination/).
- **Page Range** — 1 system(s): [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/pagination.mdx#L62).
- **PaginationItems** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/pagination).
- **Compact** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/pagination).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **TooltipAlignment**: `start` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L24)); `center` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L24)); `end` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L24)).
- **TooltipPosition**: `top` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L25)); `right` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L25)); `bottom` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L25)); `left` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L25)).
- **align**: `left` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination.tsx#L315)); `center` — 2 systems ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination.tsx#L373), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L45)); `right` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination.tsx#L315)); `space-between` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination.tsx#L373)); `start` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L45)); `end` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L45)).
- **tooltipAlignment**: `TooltipAlignment` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L346)).
- **tooltipPosition**: `TooltipPosition` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L352)).

</details>

## Interaction patterns

GOV.UK distinguishes content-page navigation from item-page navigation. Carbon and Ant expose page-size selection; Mantine documents URL synchronization.

Evidence: [GOV.UK](https://design-system.service.gov.uk/components/pagination/), [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Pagination/Pagination.tsx#L1-L300), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Pagination/Pagination.tsx#L1-L201).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **direction**: `prev` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination-base.tsx#L202)); `next` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination-base.tsx#L202)); `forward` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L92)); `backward` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L92)).
- **disableOverflow**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L315)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L315)).
- **framed**: `false` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination-line.tsx#L11)); `true` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination-line.tsx#L11)).
- **hideOnSinglePage**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L52)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L52)).
- **hideWithOnePage**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Pagination/Pagination.tsx#L62)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Pagination/Pagination.tsx#L62)).
- **loop**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L325)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L325)).
- **pageInputDisabled**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Pagination/Pagination.tsx#L106)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Pagination/Pagination.tsx#L106)).
- **pagesUnknown**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Pagination/Pagination.tsx#L161)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Pagination/Pagination.tsx#L161)).
- **responsive**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L56)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L56)).
- **showLessItems**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L57)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L57)).
- **showTitle**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L60)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L60)).
- **withControls**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Pagination/Pagination.tsx#L38)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Pagination/Pagination.tsx#L38)).
- **withEdges**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Pagination/Pagination.tsx#L35)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Pagination/Pagination.tsx#L35)).
- **withPages**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Pagination/Pagination.tsx#L65)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Pagination/Pagination.tsx#L65)).

</details>

## Reuses in Area

[Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35), [Select](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L213), [Input](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L143). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Compose Buttons/Link plus optional page-size control; keep page index and total in product state.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Numbered pages or previous/next only**: 3 observed systems. [Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Pagination/Pagination.tsx#L42), [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/pagination.mdx#L104), [GOV.UK](https://design-system.service.gov.uk/components/pagination/).
- **Layer 3 — Page-size and page-jump controls**: 2 observed systems. [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Pagination/Pagination.tsx#L249), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L58).
- **Layer 3 — Attached or aligned controls**: 2 observed systems. [Untitled UI](https://www.untitledui.com/react/components/pagination), [Chakra/Ark](https://www.chakra-ui.com/docs/components/pagination).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Pagination`; aliases appear in the JSON coverage record.

- **Untitled UI**: [pagination — component](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/pagination/pagination-base.tsx#L1-L300).
- **shadcn/ui**: [pagination — component](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/pagination.mdx#L1-L210).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: [pagination — component](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Pagination/Pagination.tsx#L1-L168).
- **Carbon**: [Pagination — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Pagination/Pagination.tsx#L1-L300); [PaginationNav — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PaginationNav/PaginationNav.tsx#L1-L300).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [Pagination — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Pagination/Pagination.tsx#L1-L201).
- **Ant Design**: [pagination — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/pagination/index.en-US.md#L1-L76).
- **Chakra/Ark**: [pagination — component](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/pagination.mdx#L1-L94).
- **Atlassian**: [pagination — component](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/pagination/README.md#lines-1:14).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: [pagination — component](https://design-system.service.gov.uk/components/pagination/).
- **Apple HIG**: [page-controls — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/page-controls).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
