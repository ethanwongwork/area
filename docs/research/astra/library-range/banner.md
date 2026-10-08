# Banner

Current-main snapshot `7dae828e7af1daf9d26b663d34335121156606f7`: built and approved as Alert `layout="banner"`; `flush` is a separate boolean. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L532), [owner registry](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/apps/docs/src/component-status.mjs#L10).
## Job

Present a persistent page or section announcement.

Observed family coverage: **8 / 15 implementation systems** (7 with a component source; 1 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Built on current main as Alert layout="banner", with an independent flush boolean; owner approved. Retain this Alert extension rather than planning a new Banner primitive.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **Appearance**: `warning` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/banner/src/components/banner.tsx#lines-50)); `error` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/banner/src/components/banner.tsx#lines-50)); `announcement` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/banner/src/components/banner.tsx#lines-50)).
- **BannerVariant**: `critical` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L12)); `info` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L12)); `success` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L12)); `upsell` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L12)); `warning` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L12)).
- **appearance**: `Appearance` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/banner/src/components/banner.tsx#lines-75)).
- **hasFocus**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L857)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L857)).
- **open**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Guidebanner/Guidebanner.tsx#L71)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Guidebanner/Guidebanner.tsx#L71)).
- **shape**: `square` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-message-bar/library/src/components/MessageBar/MessageBar.types.ts#L42)); `rounded` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-message-bar/library/src/components/MessageBar/MessageBar.types.ts#L42)).
- **tone**: `info` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner)); `success` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner)); `warning` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner)); `critical` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner)); `auto` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner)).
- **variant**: `BannerVariant` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L80)); `outlined` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/alert/index.en-US.md#L47)); `filled` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/alert/index.en-US.md#L47)).

</details>

## Structural alternatives

- **Actions/stacking/collapsed content** — 2 observed implementation systems. [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage), [Primer](https://primer.style/product/components/banner/).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Stacking multiple message bars** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage).
- **With actions** — 1 system(s): [Primer](https://primer.style/product/components/banner/).
- **Banner.PrimaryAction** — 1 system(s): [Primer](https://primer.style/product/components/banner/).
- **Banner.SecondaryAction** — 1 system(s): [Primer](https://primer.style/product/components/banner/).
- **1. Inline** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/notification/usage/).
- **3. Actionable (inline and toast)** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/notification/usage/).
- **Action button** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/notification/usage/).
- **Inline** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/notification/usage/).
- **Inline formatting** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/notification/usage/).
- **Placement** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/notification/usage/).
- **Actionable** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/notification/usage/).
- **Actions** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/notification/usage/).
- **Interactions** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/notification/usage/).
- **Option 2: If you set non-essential cookies for users (with or without JavaScript)** — 1 system(s): [GOV.UK](https://design-system.service.gov.uk/components/cookie-banner/).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **bottomReflowSpacer**: `Slot&lt;'div'&gt;` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-message-bar/library/src/components/MessageBar/MessageBar.types.ts#L15)).
- **description**: `React.ReactNode` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L37)).
- **icon**: `Slot&lt;'div'&gt;` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-message-bar/library/src/components/MessageBar/MessageBar.types.ts#L6)); `React.ReactNode` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L48)).
- **leadingVisual**: `React.ReactNode` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L53)).
- **primaryAction**: `React.ReactNode` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L241)).
- **secondaryAction**: `React.ReactNode` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L242)).
- **subtitle**: `ReactNode` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L1313)).
- **title**: `React.ReactNode` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L75)).

</details>

## Interaction patterns

Fluent documents stacking, collapse and dismissal. Polaris provides dismissible banners and actions; GOV.UK separates notification and cookie-decision banners.

Evidence: [Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-message-bar/library/src/components/MessageBar/MessageBar.types.ts#L1-L58), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner), [GOV.UK](https://design-system.service.gov.uk/components/notification-banner/), [GOV.UK](https://design-system.service.gov.uk/components/cookie-banner/).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **actionsLayout**: `inline` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L90)); `stacked` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L90)); `default` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L90)).
- **banner**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/alert/index.en-US.md#L46)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/alert/index.en-US.md#L46)).
- **closeOnEscape**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L851)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L851)).
- **collapsible**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Guidebanner/Guidebanner.tsx#L47)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Guidebanner/Guidebanner.tsx#L47)).
- **dismissible**: `false` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner)); `true` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner)).
- **flush**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L95)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L95)).
- **hidden**: `false` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner)); `true` — 1 system ([Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner)).
- **hideCloseButton**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L862)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L862)).
- **hideTitle**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L42)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L42)).
- **inline**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L867)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L867)).
- **kind**: `error` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L872-L878)); `success` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L872-L878)); `warning` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L872-L878)); `warning-alt` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L872-L878)); `info` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L872-L878)); `info-square` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L872-L878)).
- **layout**: `default` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L85)); `compact` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L85)).
- **lowContrast**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L1296)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L1296)).
- **notificationType**: `toast` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L278)); `inline` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L278)); `actionable` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L174)).
- **politeness**: `assertive` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-message-bar/library/src/components/MessageBar/MessageBar.types.ts#L37)); `polite` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-message-bar/library/src/components/MessageBar/MessageBar.types.ts#L37)).
- **role**: `alert` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L648)); `log` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L648)); `status` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L648)).
- **showIcon**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/alert/index.en-US.md#L59)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/alert/index.en-US.md#L59)).
- **withLeftGutter**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Guidebanner/Guidebanner.tsx#L85)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Guidebanner/Guidebanner.tsx#L85)).

</details>

## Reuses in Area

[Alert](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L524), [Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Built on current main as Alert layout="banner", with an independent flush boolean; owner approved. Retain this Alert extension rather than planning a new Banner primitive.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 2 — Semantic intent and optional dismissal**: 3 observed systems. [Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L12), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage).
- **Layer 3 — Actions/stacking/collapsed content**: 2 observed systems. [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage), [Primer](https://primer.style/product/components/banner/).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Banner`; aliases appear in the JSON coverage record.

- **Untitled UI**: [alerts — component](https://www.untitledui.com/react/components/alerts).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: [callout — analogue](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/callout.props.tsx#L1-L21).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: [messagebar — component](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-message-bar/library/src/components/MessageBar/MessageBar.types.ts#L1-L58).
- **Primer**: [banner — component](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Banner/Banner.tsx#L1-L296).
- **Carbon**: [Notification — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Notification/Notification.tsx#L1-L300); [Guidebanner — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Guidebanner/Guidebanner.tsx#L1-L279).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [Alert — analogue](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Alert/Alert.tsx#L1-L185).
- **Ant Design**: [alert — recipe](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/alert/index.en-US.md#L1-L88).
- **Chakra/Ark**: [alert — analogue](https://www.chakra-ui.com/docs/components/alert).
- **Atlassian**: [banner — component](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/banner/README.md#lines-1:13).
- **Polaris**: [banner — component](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner).
- **GOV.UK**: [notification-banner — component](https://design-system.service.gov.uk/components/notification-banner/); [cookie-banner — component](https://design-system.service.gov.uk/components/cookie-banner/).
- **Apple HIG**: [alerts — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/alerts).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
