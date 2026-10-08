# MenuBar

## Job

Expose persistent desktop-style command menus.

Observed family coverage: **4 / 15 implementation systems** (3 with a component source; 1 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Extend Menu behavior through a horizontal command strip; do not duplicate menu items.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **disabled**: `false` — 2 systems ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/menubar/Menubar.tsx#L155), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L101)); `true` — 2 systems ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/menubar/Menubar.tsx#L155), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L101)).

</details>

## Structural alternatives

- **Persistent strip with nested menus** — 3 observed implementation systems. [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/menubar.mdx#L63), [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/menubar/page.mdx#L1), [Mantine](https://mantine.dev/core/menubar/).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Composition** — 2 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/menubar.mdx#L91), [Mantine](https://mantine.dev/core/menubar/).
- **With Icons** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/menubar.mdx#L149).
- **Position** — 1 system(s): [Mantine](https://mantine.dev/core/menubar/).
- **Keyboard interactions** — 1 system(s): [Mantine](https://mantine.dev/core/menubar/).
- **MenuItemGroupType** — 1 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L111).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **orientation**: `MenuRoot.Orientation | undefined` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/menubar/Menubar.tsx#L160)).
- **position**: `FloatingPosition` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Menubar/Menubar.tsx#L54)).

</details>

## Interaction patterns

Base UI and Mantine document menubar keyboard behavior and shared menu composition. Preserve focus movement across menus and dismissal back to the invoking trigger.

Evidence: [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/menubar/page.mdx#L1-L79), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Menubar/Menubar.tsx#L1-L300).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **forceSubMenuRender**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L55)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L55)).
- **inlineCollapsed**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L56)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L56)).
- **loop**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Menubar/Menubar.tsx#L51)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Menubar/Menubar.tsx#L51)).
- **loopFocus**: `false` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/menubar/Menubar.tsx#L166)); `true` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/menubar/Menubar.tsx#L166)).
- **modal**: `false` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/menubar/Menubar.tsx#L150)); `true` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/menubar/Menubar.tsx#L150)).
- **mode**: `vertical` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L59)); `horizontal` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L59)); `inline` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L59)).
- **multiple**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L60)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L60)).
- **selectable**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L63)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L63)).
- **theme**: `light` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L107)); `dark` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L107)).
- **trigger**: `click` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Menubar/Menubar.tsx#L48)); `hover` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Menubar/Menubar.tsx#L48)).
- **triggerSubMenuAction**: `hover` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L70)); `click` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L70)).

</details>

## Reuses in Area

[Menu](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L549), [Toolbar](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L76). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Extend Menu behavior through a horizontal command strip; do not duplicate menu items.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Persistent strip with nested menus**: 3 observed systems. [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/menubar.mdx#L63), [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/menubar/page.mdx#L1), [Mantine](https://mantine.dev/core/menubar/).
- **Layer 2 — Keyboard focus looping**: 2 observed systems. [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/menubar/Menubar.tsx#L166), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Menubar/Menubar.tsx#L51).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `MenuBar`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: [menubar — component](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/menubar.mdx#L1-L161).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: [menubar — component](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/menubar/page.mdx#L1-L79).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: **not found** for this job in the reviewed [catalogue](https://primer.style/product/components/) and [pinned source inventory](https://github.com/primer/react/tree/a89299ae77e8f444599f94d7e9ca368c17be3f9a).
- **Carbon**: **not found** for this job in the reviewed [catalogue](https://carbondesignsystem.com/components/overview/components/) and [pinned source inventory](https://github.com/carbon-design-system/carbon/tree/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [Menubar — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Menubar/Menubar.tsx#L1-L300).
- **Ant Design**: [menu — recipe](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L1-L165).
- **Chakra/Ark**: **not found** for this job in the reviewed [catalogue](https://www.chakra-ui.com/docs/components/concepts/overview) and [pinned source inventory](https://github.com/chakra-ui/ark/tree/b561e95d20d6bd0e75cdc08e762e881628b110f7).
- **Atlassian**: **not found** for this job in the reviewed [catalogue](https://atlassian.design/components) and [pinned source inventory](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [menus — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/menus).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
