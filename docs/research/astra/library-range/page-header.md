# PageHeader

## Job

Group page identity, context, navigation and actions.

Observed family coverage: **5 / 15 implementation systems** (5 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Compose Breadcrumb, title/description and action slots; avoid a separate control behavior.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **hasBorder**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/PageHeader/PageHeader.tsx#L48)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/PageHeader/PageHeader.tsx#L48)).
- **inlineSize**: `small` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page)); `base` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page)); `large` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page)).
- **variant**: `subtitle` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/PageHeader/PageHeader.tsx#L276)); `medium` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/PageHeader/PageHeader.tsx#L276)); `large` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/PageHeader/PageHeader.tsx#L276)).

</details>

## Structural alternatives

- **Title/description and actions** — 3 observed implementation systems. [Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/PageHeader/PageHeader.tsx#L86), [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/page-header/src/PageHeader/index.tsx#lines-18), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page).
- **Breadcrumb/context and navigation regions** — 1 observed implementation systems. [Primer](https://primer.style/product/components/page-header/), [Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/PageHeader/PageHeader.tsx#L87).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Page header components** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/page-headers).
- **Page header example** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/page-headers).
- **Page header examples** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/page-headers).
- **Avatar** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/page-headers).
- **Banner avatar** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/page-headers).
- **Banner avatar centered** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/page-headers).
- **PageHeader** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **With a description** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **add-pageheader-docs** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **With actions** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **With UnderlineNav in the navigation slot** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **With leading and trailing visuals** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **With leading and trailing actions** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **PageHeader.ContextArea** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **PageHeader.ParentLink** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **PageHeader.ContextBar** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **PageHeader.ContextAreaActions** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **PageHeader.TitleArea** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **PageHeader.LeadingAction** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **PageHeader.LeadingVisual** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **PageHeader.Title** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **PageHeader.TrailingVisual** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **PageHeader.TrailingAction** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **PageHeader.Actions** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **PageHeader.Breadcrumbs** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **PageHeader.Description** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **PageHeader.Navigation** — 1 system(s): [Primer](https://primer.style/product/components/page-header/).
- **Anchor to Organize content with sectionsOrganize content with sections** — 1 system(s): [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page).
- **Anchor to Add page actionsAdd page actions** — 1 system(s): [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page).
- **Anchor to Edit page with all slotsEdit page with all slots** — 1 system(s): [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **fullWidthGrid**: `xl` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PageHeader/PageHeader.tsx#L86)).

</details>

## Interaction patterns

Primer explicitly exposes context, title, breadcrumbs, description and navigation areas. Polaris exposes page actions; keyboard behavior comes from composed links/buttons.

Evidence: [Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/PageHeader/PageHeader.tsx#L1-L300), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **disableTitleStyles**: `false` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/page-header/src/PageHeader/index.tsx#lines-34)); `true` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/page-header/src/PageHeader/index.tsx#lines-34)).
- **narrowGrid**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PageHeader/PageHeader.tsx#L90)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PageHeader/PageHeader.tsx#L90)).
- **truncateTitle**: `false` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/page-header/src/PageHeader/index.tsx#lines-42)); `true` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/page-header/src/PageHeader/index.tsx#lines-42)).

</details>

## Reuses in Area

[Breadcrumb](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L172), [Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35), [Input](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L143). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Compose Breadcrumb, title/description and action slots; avoid a separate control behavior.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Title/description and actions**: 3 observed systems. [Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/PageHeader/PageHeader.tsx#L86), [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/page-header/src/PageHeader/index.tsx#lines-18), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page).
- **Layer 3 — Breadcrumb/context and navigation regions**: 1 observed systems. [Primer](https://primer.style/product/components/page-header/), [Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/PageHeader/PageHeader.tsx#L87).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `PageHeader`; aliases appear in the JSON coverage record.

- **Untitled UI**: [page-headers — component](https://www.untitledui.com/react/components/page-headers).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: [page-header — component](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/PageHeader/PageHeader.tsx#L1-L300).
- **Carbon**: [PageHeader — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/PageHeader/PageHeader.tsx#L1-L300).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: **not found** for this job in the reviewed [catalogue](https://mantine.dev/core/package/) and [pinned source inventory](https://github.com/mantinedev/mantine/tree/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4).
- **Ant Design**: [layout — analogue](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L1-L139).
- **Chakra/Ark**: **not found** for this job in the reviewed [catalogue](https://www.chakra-ui.com/docs/components/concepts/overview) and [pinned source inventory](https://github.com/chakra-ui/ark/tree/b561e95d20d6bd0e75cdc08e762e881628b110f7).
- **Atlassian**: [page-header — component](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/page-header/README.md#lines-1:15).
- **Polaris**: [page — component](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [toolbars — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/toolbars).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
