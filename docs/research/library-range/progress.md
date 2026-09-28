# Progress — library range

Baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Shows how far along a task is. [Area manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L407-L414).

Boundary: Linear determinate or indeterminate progress, sm/md/lg rail tiers, neutral/accent. Label and numeric output are composed outside the component. No circular, segmented or semantic error/success API. [Area spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/progress.md#L1).

## Variant axes

- **Radix Themes** (component): variant: classic, surface, soft; size: 1, 2, 3; radius: none, small, medium, large, full; contrast: normal, high. [Source](https://www.radix-ui.com/themes/docs/components/progress) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): size: S, M, L, XL; label-position: top, side; static-color: white, black, auto. [Source](https://react-spectrum.adobe.com/ProgressBar) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): size: S, M, L; static-color: white, black, auto. [Source](https://react-spectrum.adobe.com/ProgressCircle) (checked 2026-09-28).
- **Primer** (component): size: small, default, large. [Source](https://primer.style/product/components/progress-bar/) (checked 2026-09-28).
- **Carbon** (component): size: small, big; state: active, error. [Source](https://carbondesignsystem.com/components/progress-bar/usage/) (checked 2026-09-28).
- **Mantine** (component): size: xs, sm, md, lg, xl. [Source](https://mantine.dev/core/progress) (checked 2026-09-28).
- **Ant Design** (component): type: line, circle, dashboard; size: small, default; status: success, exception, normal, active; cap: round, butt, square. [Source](https://ant.design/components/progress) (checked 2026-09-28).
- **Chakra/Ark** (component): variant: outline, subtle; size: xs, sm, md, lg, xl; shape: square, rounded, full. [Source](https://chakra-ui.com/docs/components/progress) (checked 2026-09-28).
- **Chakra/Ark** (component): size: xs, sm, md, lg, xl. [Source](https://chakra-ui.com/docs/components/progress-circle) (checked 2026-09-28).
- **Atlassian** (component): appearance: default, inverse; state: determinate, indeterminate. [Source](https://atlassian.design/components/progress-bar/examples) (checked 2026-09-28).
- **Polaris** (component): tone: info, success, warning, critical, auto, neutral, caution. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/progress) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (component): linear, circular, semicircular, value-label. [Source](https://www.untitledui.com/react/components/progress-indicators) (checked 2026-09-28).
- **shadcn/ui** (component): linear. [Source](https://ui.shadcn.com/docs/components/progress) (checked 2026-09-28).
- **Radix Themes** (component): linear. [Source](https://www.radix-ui.com/themes/docs/components/progress) (checked 2026-09-28).
- **Base UI** (component): linear, value-label. [Source](https://base-ui.com/react/components/progress) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): linear, value-label. [Source](https://react-spectrum.adobe.com/ProgressBar) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): circular. [Source](https://react-spectrum.adobe.com/ProgressCircle) (checked 2026-09-28).
- **Fluent 2** (component): linear, label, helper-error. [Source](https://fluent2.microsoft.design/components/web/react/core/progressbar/usage) (checked 2026-09-28).
- **Primer** (component): linear, segmented-track. [Source](https://primer.style/product/components/progress-bar/) (checked 2026-09-28).
- **Carbon** (component): linear, label, helper-error. [Source](https://carbondesignsystem.com/components/progress-bar/usage/) (checked 2026-09-28).
- **Material 3** (component): linear, circular. [Source](https://developer.android.com/develop/ui/compose/components/progress) (checked 2026-09-28).
- **Mantine** (component): linear, segmented-track, value-label. [Source](https://mantine.dev/core/progress) (checked 2026-09-28).
- **Mantine** (component): circular, segmented-track, center-label. [Source](https://mantine.dev/core/ring-progress) (checked 2026-09-28).
- **Ant Design** (component): linear, circular, semicircular, segmented-track, value-label. [Source](https://ant.design/components/progress) (checked 2026-09-28).
- **Chakra/Ark** (component): linear, value-label. [Source](https://chakra-ui.com/docs/components/progress) (checked 2026-09-28).
- **Chakra/Ark** (component): circular, center-label. [Source](https://chakra-ui.com/docs/components/progress-circle) (checked 2026-09-28).
- **Atlassian** (component): linear. [Source](https://atlassian.design/components/progress-bar/examples) (checked 2026-09-28).
- **Polaris** (component): linear. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/progress) (checked 2026-09-28).
- **Apple HIG** (guidance): linear, circular. [Source](https://developer.apple.com/design/human-interface-guidelines/progress-indicators) (checked 2026-09-28).

## Interaction patterns

- **Untitled UI** (component): determinate. [Source](https://www.untitledui.com/react/components/progress-indicators) (checked 2026-09-28).
- **shadcn/ui** (component): determinate. [Source](https://ui.shadcn.com/docs/components/progress) (checked 2026-09-28).
- **Radix Themes** (component): determinate, indeterminate, estimated-duration. [Source](https://www.radix-ui.com/themes/docs/components/progress) (checked 2026-09-28).
- **Base UI** (component): determinate, indeterminate. [Source](https://base-ui.com/react/components/progress) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): determinate, indeterminate, locale-format. [Source](https://react-spectrum.adobe.com/ProgressBar) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): determinate, indeterminate. [Source](https://react-spectrum.adobe.com/ProgressCircle) (checked 2026-09-28).
- **Fluent 2** (component): determinate, indeterminate, error, success. [Source](https://fluent2.microsoft.design/components/web/react/core/progressbar/usage) (checked 2026-09-28).
- **Primer** (component): determinate. [Source](https://primer.style/product/components/progress-bar/) (checked 2026-09-28).
- **Carbon** (component): determinate, indeterminate. [Source](https://carbondesignsystem.com/components/progress-bar/usage/) (checked 2026-09-28).
- **Material 3** (component): determinate, indeterminate. [Source](https://developer.android.com/develop/ui/compose/components/progress) (checked 2026-09-28).
- **Mantine** (component): determinate, striped, animated-stripes. [Source](https://mantine.dev/core/progress) (checked 2026-09-28).
- **Mantine** (component): determinate. [Source](https://mantine.dev/core/ring-progress) (checked 2026-09-28).
- **Ant Design** (component): determinate, gradient-fill, success-segment. [Source](https://ant.design/components/progress) (checked 2026-09-28).
- **Chakra/Ark** (component): determinate, indeterminate, striped, animated-stripes. [Source](https://chakra-ui.com/docs/components/progress) (checked 2026-09-28).
- **Chakra/Ark** (component): determinate, indeterminate. [Source](https://chakra-ui.com/docs/components/progress-circle) (checked 2026-09-28).
- **Atlassian** (component): determinate, indeterminate. [Source](https://atlassian.design/components/progress-bar/examples) (checked 2026-09-28).
- **Polaris** (component): determinate, indeterminate. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/progress) (checked 2026-09-28).
- **Apple HIG** (guidance): determinate, indeterminate. [Source](https://developer.apple.com/design/human-interface-guidelines/progress-indicators) (checked 2026-09-28).

## Area today

Linear determinate or indeterminate progress, sm/md/lg rail tiers, neutral/accent. Label and numeric output are composed outside the component. No circular, segmented or semantic error/success API. [Baseline spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/progress.md#L1).

- Exact manifest axes: size = sm, md, lg; tone = neutral, accent. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L407-L414).
- Boolean modifiers: none declared. Runtime state hooks: indeterminate. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L407-L414).
- Slots: bar. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L407-L414).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `interaction:determinate`, `interaction:indeterminate`, `size:lg`, `size:md`, `size:sm`, `state:indeterminate`, `structure:linear`, `tone:accent`, `tone:neutral`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L407-L414); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/progress.md#L1-L130).
- **not found**: `appearance:default`, `appearance:inverse`, `cap:butt`, `cap:round`, `cap:square`, `interaction:animated-stripes`, `interaction:error`, `interaction:estimated-duration`, `interaction:gradient-fill`, `interaction:locale-format`, `interaction:striped`, `interaction:success`, `interaction:success-segment`, `label-position:side`, `label-position:top`, `shape:full`, `shape:rounded`, `shape:square`, `size:XL`, `size:big`, `size:default`, `size:xl`, `size:xs`, `state:active`, `state:determinate`, `state:error`, `status:active`, `status:exception`, `status:normal`, `status:success`, `structure:center-label`, `structure:circular`, `structure:helper-error`, `structure:segmented-track`, `structure:semicircular`, `tone:auto`, `tone:caution`, `tone:critical`, `tone:info`, `tone:success`, `tone:warning`, `type:circle`, `type:dashboard`, `type:line`, `variant:classic`, `variant:outline`, `variant:soft`, `variant:subtle`, `variant:surface`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L407-L414); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/progress.md#L1-L130).
- **composition**: `structure:label`, `structure:value-label`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L407-L414); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/progress.md#L1-L130).
- **equivalent tier / geometry not asserted**: `size:1`, `size:2`, `size:3`, `size:L`, `size:M`, `size:S`, `size:large`, `size:small`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L407-L414); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/progress.md#L1-L130).
- **system-level / not this exact option**: `contrast:high`, `contrast:normal`, `radius:full`, `radius:large`, `radius:medium`, `radius:none`, `radius:small`, `static-color:auto`, `static-color:black`, `static-color:white`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L407-L414); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/progress.md#L1-L130).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 3 direct systems. Direct: Chakra/Ark, Mantine, Polaris. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L407-L414), [2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/progress.md#L1).
  - Individual options: `size:sm` (2 direct; Area: yes); `size:md` (2 direct; Area: yes); `size:lg` (2 direct; Area: yes); `tone:neutral` (1 direct; Area: yes); `tone:accent` (0 direct; Area: yes).
- **Layer 3 · Circular progress with center label** — 6 direct systems; 1 guidance systems. Direct: Ant Design, Chakra/Ark, Mantine, Material 3, React Aria / Spectrum 2, Untitled UI. The largest missing anatomy; keep it distinct from indeterminate Spinner. Evidence: [1](https://ant.design/components/progress), [2](https://chakra-ui.com/docs/components/progress-circle), [3](https://developer.android.com/develop/ui/compose/components/progress), [4](https://developer.apple.com/design/human-interface-guidelines/progress-indicators), [5](https://mantine.dev/core/ring-progress), [6](https://react-spectrum.adobe.com/ProgressCircle), [7](https://www.untitledui.com/react/components/progress-indicators).
  - Individual options: `structure:circular` (6 direct; Area: not found); `structure:center-label` (2 direct; Area: not found).
- **Layer 3 · Segmented linear or circular track** — 3 direct systems. Direct: Ant Design, Mantine, Primer. Useful for categorized totals. Each segment needs accessible meaning rather than color alone. Evidence: [1](https://ant.design/components/progress), [2](https://mantine.dev/core/progress), [3](https://mantine.dev/core/ring-progress), [4](https://primer.style/product/components/progress-bar/).
  - Individual options: `structure:segmented-track` (3 direct; Area: not found).
- **Layer 2 · Semantic success/error/warning tones** — 3 direct systems. Direct: Ant Design, Fluent 2, Polaris. Separate task outcome from determinate/indeterminate mode. Evidence: [1](https://ant.design/components/progress), [2](https://fluent2.microsoft.design/components/web/react/core/progressbar/usage), [3](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/progress).
  - Individual options: `tone:success` (1 direct; Area: not found); `tone:warning` (1 direct; Area: not found); `tone:critical` (1 direct; Area: not found); `status:success` (1 direct; Area: not found); `status:exception` (1 direct; Area: not found); `interaction:error` (1 direct; Area: not found); `interaction:success` (1 direct; Area: not found).

## Sources

- Area: [manifest, lines 407–414](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L407-L414); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/progress.md#L1). All Area judgments refer to starting commit `c585f8c5f38705a7efa79bf05148a8c6989b142a`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: progress, progress bar, progress circle (exclude step indicators). The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/progress-indicators); checked 2026-09-28.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/progress); checked 2026-09-28.
- **Radix Themes**: [source 1](https://www.radix-ui.com/themes/docs/components/progress); checked 2026-09-28.
- **Base UI**: [source 1](https://base-ui.com/react/components/progress); checked 2026-09-28.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/ProgressBar), [source 2](https://react-spectrum.adobe.com/ProgressCircle); checked 2026-09-28.
- **Fluent 2**: [source 1](https://fluent2.microsoft.design/components/web/react/core/progressbar/usage); checked 2026-09-28.
- **Primer**: [source 1](https://primer.style/product/components/progress-bar/); checked 2026-09-28.
- **Carbon**: [source 1](https://carbondesignsystem.com/components/progress-bar/usage/); checked 2026-09-28.
- **Material 3**: [source 1](https://developer.android.com/develop/ui/compose/components/progress); checked 2026-09-28.
- **Mantine**: [source 1](https://mantine.dev/core/progress), [source 2](https://mantine.dev/core/ring-progress); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/progress); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/progress), [source 2](https://chakra-ui.com/docs/components/progress-circle); checked 2026-09-28.
- **Atlassian**: [source 1](https://atlassian.design/components/progress-bar/examples); checked 2026-09-28.
- **Polaris**: [source 1](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/progress); checked 2026-09-28.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for progress, progress bar, progress circle (exclude step indicators). No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG**: [source 1](https://developer.apple.com/design/human-interface-guidelines/progress-indicators); checked 2026-09-28.
  - Readable official data: [documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/progress-indicators.json). Platform guidance is counted separately.
