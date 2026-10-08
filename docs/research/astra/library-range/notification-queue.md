# Live notification queue

## Job

Manage several transient status messages over time.

Observed family coverage: **8 / 15 implementation systems** (8 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Keep Toast rendering; add a queue/manager with update, dismiss, placement and visible-limit policies.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **AppearanceTypes**: `error` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/src/types.tsx#lines-19)); `info` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/src/types.tsx#lines-19)); `success` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/src/types.tsx#lines-19)); `warning` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/src/types.tsx#lines-19)); `normal` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/src/types.tsx#lines-19)).
- **appearance**: `BackgroundAppearanceContextValue` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-toast/library/src/components/Toast/Toast.types.ts#L17)); `AppearanceTypes` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/src/types.tsx#lines-47)).
- **expanded**: `false` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/toast/viewport/ToastViewport.tsx#L287)); `true` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/toast/viewport/ToastViewport.tsx#L287)).
- **isFocusVisible**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Toast.tsx#L214)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Toast.tsx#L214)).
- **isFocused**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Toast.tsx#L208)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Toast.tsx#L208)).
- **isHovered**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Toast.tsx#L61)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Toast.tsx#L61)).
- **open**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/NotificationsPanel/NotificationsPanel.tsx#L255)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/NotificationsPanel/NotificationsPanel.tsx#L255)).

</details>

## Structural alternatives

- **Stacked or overlapping viewport** — 2 observed implementation systems. [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/toast/page.mdx#L73), [Chakra/Ark](https://www.chakra-ui.com/docs/components/toast).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Action** — 3 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/toast.mdx#L115), [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/toast/page.mdx#L309), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/toast.mdx#L77).
- **Custom position** — 1 system(s): [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/toast/page.mdx#L222).
- **Undo action** — 1 system(s): [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/toast/page.mdx#L233).
- **Positioner** — 1 system(s): [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/toast/page.mdx#L317).
- **Actions** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/Toast.mdx#L52).
- **Keep location predictable** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/toast/usage).
- **Placement** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/toast).
- **With Action** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/toast).
- **ActionTrigger** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/toast).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **NotificationPlacements**: `top` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L10-L17)); `topLeft` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L10-L17)); `topRight` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L10-L17)); `bottom` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L10-L17)); `bottomLeft` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L10-L17)); `bottomRight` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L10-L17)).
- **ToastPlacement**: `'top' | 'top end' | 'bottom' | 'bottom end'` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Toast.tsx#L48)).
- **actions**: `React.ReactNode` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L61)).
- **align**: `start` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Toast.tsx#L506)); `center` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Toast.tsx#L506)); `end` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Toast.tsx#L506)).
- **btn**: `React.ReactNode` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L60)).
- **closeIcon**: `React.ReactNode` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L75)).
- **description**: `React.ReactNode` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L58)); `ReactNode` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/src/types.tsx#lines-51)).
- **icon**: `React.ReactNode` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L67)); `ReactNode` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/src/types.tsx#lines-58)).
- **message**: `React.ReactNode` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L56)).
- **placement**: `ToastPlacement` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Toast.tsx#L58)); `top` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Toast.tsx#L505)); `bottom` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Toast.tsx#L505)); `string` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/index.en-US.md#L127)); `NotificationPlacement` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L68)).
- **title**: `React.ReactNode` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L57)); `ReactNode` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/src/types.tsx#lines-62)).

</details>

## Interaction patterns

Base UI documents promise, deduplication and stacking. React Aria covers dismissal and announcements; Chakra exposes pause/play and maximum-visible controls.

Evidence: [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/toast/page.mdx#L1-L300), [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/Toast.mdx#L1-L137), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/toast.mdx#L1-L230).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **IconType**: `success` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L21)); `info` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L21)); `error` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L21)); `warning` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L21)).
- **doNotDisturbDefaultToggled**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/NotificationsPanel/NotificationsPanel.tsx#L156)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/NotificationsPanel/NotificationsPanel.tsx#L156)).
- **headingLevel**: `1` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/src/types.tsx#lines-98)); `2` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/src/types.tsx#lines-98)); `3` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/src/types.tsx#lines-98)); `4` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/src/types.tsx#lines-98)); `5` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/src/types.tsx#lines-98)); `6` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/src/types.tsx#lines-98)).
- **pauseOnHover**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L66)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L66)).
- **reduceMotion**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Toast.tsx#L507)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Toast.tsx#L507)).
- **role**: `alert` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L81)); `status` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L81)).
- **rtl**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/index.en-US.md#L130)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/index.en-US.md#L130)).
- **showProgress**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L65)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L65)).
- **swipeDirection**: `up` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/toast/root/ToastRoot.tsx#L554-L555)); `down` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/toast/root/ToastRoot.tsx#L554-L555)); `left` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/toast/root/ToastRoot.tsx#L554-L555)); `right` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/toast/root/ToastRoot.tsx#L554-L555)).
- **type**: `IconType` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/interface.ts#L73)).

</details>

## Reuses in Area

[Toast](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L576). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Keep Toast rendering; add a queue/manager with update, dismiss, placement and visible-limit policies.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 2 — Visible limit/timeout/pause policy**: 3 observed systems. [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/toast.mdx#L90), [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/toast/provider/ToastProvider.tsx#L70), [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/Toast.mdx#L75).
- **Layer 3 — Stacked or overlapping viewport**: 2 observed systems. [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/toast/page.mdx#L73), [Chakra/Ark](https://www.chakra-ui.com/docs/components/toast).
- **Layer 2 — Promise/update and deduplication**: 3 observed systems. [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/toast/page.mdx#L260), [Chakra/Ark](https://www.chakra-ui.com/docs/components/toast), [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/toast.mdx#L131).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Live notification queue`; aliases appear in the JSON coverage record.

- **Untitled UI**: [notifications — analogue](https://www.untitledui.com/react/components/notifications).
- **shadcn/ui**: [toast — component](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/toast.mdx#L1-L142).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: [toast — component](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/toast/page.mdx#L1-L300).
- **React Aria / Spectrum 2**: [Toast — component](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/Toast.mdx#L1-L137).
- **Fluent 2**: [toast — component](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-toast/library/src/components/Toast/Toast.types.ts#L1-L36).
- **Primer**: **not found** for this job in the reviewed [catalogue](https://primer.style/product/components/) and [pinned source inventory](https://github.com/primer/react/tree/a89299ae77e8f444599f94d7e9ca368c17be3f9a).
- **Carbon**: [NotificationsPanel — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/NotificationsPanel/NotificationsPanel.tsx#L1-L300).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [Notification — analogue](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Notification/Notification.tsx#L1-L171).
- **Ant Design**: [notification — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/notification/index.en-US.md#L1-L193).
- **Chakra/Ark**: [toast — component](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/toast.mdx#L1-L230).
- **Atlassian**: [flag — component](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/flag/README.md#lines-1:14).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [live-activities — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/live-activities).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
