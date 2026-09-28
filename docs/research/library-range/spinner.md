# Spinner — library range

Baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Indicates an action in progress with no known duration. [Area manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L399-L405).

Boundary: One rotating shape; sm/md/lg, neutral/accent. Labeled spinners announce status; unlabeled ones are decorative and the host announces busy state. Bars/dots and overlay ownership are not public variants. [Area spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/spinner.md#L1).

## Variant axes

- **Untitled UI** (component): style: line-simple, line-spinner, dot-circle. [Source](https://www.untitledui.com/react/components/loading-indicators) (checked 2026-09-28).
- **Radix Themes** (component): size: 1, 2, 3. [Source](https://www.radix-ui.com/themes/docs/components/spinner) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): size: S, M, L; static-color: white, black, auto. [Source](https://react-spectrum.adobe.com/ProgressCircle) (checked 2026-09-28).
- **Primer** (component): size: small, medium, large. [Source](https://primer.style/product/components/spinner/) (checked 2026-09-28).
- **Carbon** (component): size: small, large. [Source](https://carbondesignsystem.com/components/loading/usage/) (checked 2026-09-28).
- **Mantine** (component): type: oval, bars, dots; size: xs, sm, md, lg, xl. [Source](https://mantine.dev/core/loader) (checked 2026-09-28).
- **Ant Design** (component): size: small, default, large. [Source](https://ant.design/components/spin) (checked 2026-09-28).
- **Chakra/Ark** (component): size: inherit, xs, sm, md, lg, xl. [Source](https://chakra-ui.com/docs/components/spinner) (checked 2026-09-28).
- **Atlassian** (component): size: xsmall, small, medium, large, xlarge. [Source](https://atlassian.design/components/spinner/examples) (checked 2026-09-28).
- **Polaris** (component): size: base, large, large-100. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/spinner) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (component): label, inline. [Source](https://www.untitledui.com/react/components/loading-indicators) (checked 2026-09-28).
- **shadcn/ui** (component): inline, label. [Source](https://ui.shadcn.com/docs/components/spinner) (checked 2026-09-28).
- **Radix Themes** (component): inline, replace-children. [Source](https://www.radix-ui.com/themes/docs/components/spinner) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): circular. [Source](https://react-spectrum.adobe.com/ProgressCircle) (checked 2026-09-28).
- **Fluent 2** (component): label, region-centered. [Source](https://fluent2.microsoft.design/components/web/react/core/spinner/usage) (checked 2026-09-28).
- **Primer** (component): circular. [Source](https://primer.style/product/components/spinner/) (checked 2026-09-28).
- **Carbon** (component): circular, overlay. [Source](https://carbondesignsystem.com/components/loading/usage/) (checked 2026-09-28).
- **Material 3** (component): circular. [Source](https://developer.android.com/develop/ui/compose/components/progress) (checked 2026-09-28).
- **Mantine** (component): inline. [Source](https://mantine.dev/core/loader) (checked 2026-09-28).
- **Ant Design** (component): label, overlay, fullscreen. [Source](https://ant.design/components/spin) (checked 2026-09-28).
- **Chakra/Ark** (component): label, overlay. [Source](https://chakra-ui.com/docs/components/spinner) (checked 2026-09-28).
- **Atlassian** (component): inline. [Source](https://atlassian.design/components/spinner/examples) (checked 2026-09-28).
- **Polaris** (component): inline, region-centered. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/spinner) (checked 2026-09-28).
- **Apple HIG** (guidance): circular. [Source](https://developer.apple.com/design/human-interface-guidelines/progress-indicators) (checked 2026-09-28).

## Interaction patterns

- **Untitled UI** (component): indeterminate. [Source](https://www.untitledui.com/react/components/loading-indicators) (checked 2026-09-28).
- **shadcn/ui** (component): indeterminate, custom-icon. [Source](https://ui.shadcn.com/docs/components/spinner) (checked 2026-09-28).
- **Radix Themes** (component): indeterminate, preserve-layout. [Source](https://www.radix-ui.com/themes/docs/components/spinner) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): indeterminate. [Source](https://react-spectrum.adobe.com/ProgressCircle) (checked 2026-09-28).
- **Fluent 2** (component): indeterminate, status-announcement. [Source](https://fluent2.microsoft.design/components/web/react/core/spinner/usage) (checked 2026-09-28).
- **Primer** (component): indeterminate. [Source](https://primer.style/product/components/spinner/) (checked 2026-09-28).
- **Carbon** (component): indeterminate, block-interaction. [Source](https://carbondesignsystem.com/components/loading/usage/) (checked 2026-09-28).
- **Material 3** (component): indeterminate. [Source](https://developer.android.com/develop/ui/compose/components/progress) (checked 2026-09-28).
- **Mantine** (component): indeterminate, custom-loader. [Source](https://mantine.dev/core/loader) (checked 2026-09-28).
- **Ant Design** (component): indeterminate, delayed-display, determinate-percent. [Source](https://ant.design/components/spin) (checked 2026-09-28).
- **Chakra/Ark** (component): indeterminate. [Source](https://chakra-ui.com/docs/components/spinner) (checked 2026-09-28).
- **Atlassian** (component): indeterminate, delayed-display. [Source](https://atlassian.design/components/spinner/examples) (checked 2026-09-28).
- **Polaris** (component): indeterminate, status-announcement. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/spinner) (checked 2026-09-28).
- **Apple HIG** (guidance): indeterminate. [Source](https://developer.apple.com/design/human-interface-guidelines/progress-indicators) (checked 2026-09-28).

## Area today

One rotating shape; sm/md/lg, neutral/accent. Labeled spinners announce status; unlabeled ones are decorative and the host announces busy state. Bars/dots and overlay ownership are not public variants. [Baseline spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/spinner.md#L1).

- Exact manifest axes: size = sm, md, lg; tone = neutral, accent. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L399-L405).
- Boolean modifiers: none declared. Runtime state hooks: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L399-L405).
- Slots: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L399-L405).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **not found**: `interaction:block-interaction`, `interaction:custom-icon`, `interaction:custom-loader`, `interaction:delayed-display`, `interaction:determinate-percent`, `interaction:preserve-layout`, `size:base`, `size:default`, `size:inherit`, `size:large-100`, `size:xl`, `size:xlarge`, `size:xs`, `size:xsmall`, `structure:fullscreen`, `structure:overlay`, `structure:replace-children`, `style:dot-circle`, `style:line-simple`, `style:line-spinner`, `type:bars`, `type:dots`, `type:oval`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L399-L405); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/spinner.md#L1-L124).
- **composition**: `structure:label`, `structure:region-centered`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L399-L405); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/spinner.md#L1-L124).
- **yes**: `interaction:indeterminate`, `interaction:status-announcement`, `size:lg`, `size:md`, `size:sm`, `structure:circular`, `structure:inline`, `tone:accent`, `tone:neutral`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L399-L405); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/spinner.md#L1-L124).
- **equivalent tier / geometry not asserted**: `size:1`, `size:2`, `size:3`, `size:L`, `size:M`, `size:S`, `size:large`, `size:medium`, `size:small`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L399-L405); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/spinner.md#L1-L124).
- **system-level / not this exact option**: `static-color:auto`, `static-color:black`, `static-color:white`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L399-L405); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/spinner.md#L1-L124).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 2 direct systems. Direct: Chakra/Ark, Mantine. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L399-L405), [2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/spinner.md#L1).
  - Individual options: `size:sm` (2 direct; Area: yes); `size:md` (2 direct; Area: yes); `size:lg` (2 direct; Area: yes); `tone:neutral` (0 direct; Area: yes); `tone:accent` (0 direct; Area: yes).
- **Layer 2 · Arc, dots and bars** — 2 direct systems. Direct: Mantine, Untitled UI. Offer a small shape vocabulary that works in the same loading slot. Evidence: [1](https://mantine.dev/core/loader), [2](https://www.untitledui.com/react/components/loading-indicators).
  - Individual options: `type:oval` (1 direct; Area: not found); `type:dots` (1 direct; Area: not found); `type:bars` (1 direct; Area: not found); `style:dot-circle` (1 direct; Area: not found).
- **Layer 3 · Inline, labeled region and overlay compositions** — 10 direct systems. Direct: Ant Design, Atlassian, Carbon, Chakra/Ark, Fluent 2, Mantine, Polaris, Radix Themes, Untitled UI, shadcn/ui. Blocking overlay behavior belongs to a host recipe, not the glyph. Evidence: [1](https://ant.design/components/spin), [2](https://atlassian.design/components/spinner/examples), [3](https://carbondesignsystem.com/components/loading/usage/), [4](https://chakra-ui.com/docs/components/spinner), [5](https://fluent2.microsoft.design/components/web/react/core/spinner/usage), [6](https://mantine.dev/core/loader), [7](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/spinner), [8](https://ui.shadcn.com/docs/components/spinner), [9](https://www.radix-ui.com/themes/docs/components/spinner), [10](https://www.untitledui.com/react/components/loading-indicators).
  - Individual options: `structure:inline` (6 direct; Area: yes); `structure:label` (5 direct; Area: composition); `structure:overlay` (3 direct; Area: not found).

## Sources

- Area: [manifest, lines 399–405](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L399-L405); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/spinner.md#L1). All Area judgments refer to starting commit `c585f8c5f38705a7efa79bf05148a8c6989b142a`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: spinner, loading, loader, indeterminate progress circle. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/loading-indicators); checked 2026-09-28.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/spinner); checked 2026-09-28.
- **Radix Themes**: [source 1](https://www.radix-ui.com/themes/docs/components/spinner); checked 2026-09-28.
- **Base UI — not found**: checked [catalogue](https://base-ui.com/react/overview/quick-start) on 2026-09-28 for spinner, loading, loader, indeterminate progress circle. No independently verified option recorded; see the audit for lookup limitations.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/ProgressCircle); checked 2026-09-28.
- **Fluent 2**: [source 1](https://fluent2.microsoft.design/components/web/react/core/spinner/usage); checked 2026-09-28.
- **Primer**: [source 1](https://primer.style/product/components/spinner/); checked 2026-09-28.
- **Carbon**: [source 1](https://carbondesignsystem.com/components/loading/usage/); checked 2026-09-28.
- **Material 3**: [source 1](https://developer.android.com/develop/ui/compose/components/progress); checked 2026-09-28.
- **Mantine**: [source 1](https://mantine.dev/core/loader); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/spin); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/spinner); checked 2026-09-28.
- **Atlassian**: [source 1](https://atlassian.design/components/spinner/examples); checked 2026-09-28.
- **Polaris**: [source 1](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/spinner); checked 2026-09-28.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for spinner, loading, loader, indeterminate progress circle. No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG**: [source 1](https://developer.apple.com/design/human-interface-guidelines/progress-indicators); checked 2026-09-28.
  - Readable official data: [documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/progress-indicators.json). Platform guidance is counted separately.
