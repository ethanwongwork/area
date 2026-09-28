# Slider — library range

Baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Picks a value from an ordered range. [Area manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L277-L289).

Boundary: Native range-based slider; sm/md/lg, neutral/accent, inline/top label, vertical orientation, readout and marks. Range with inputs is documented as a composition; see the Area status on that option rather than inferring a general arbitrary-thumb engine. [Area spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/slider.md#L1).

## Variant axes

- **shadcn/ui** (component): orientation: horizontal, vertical; state: disabled. [Source](https://ui.shadcn.com/docs/components/slider) (checked 2026-09-28).
- **Radix Themes** (component): variant: surface, classic, soft; size: 1, 2, 3; radius: none, small, medium, large, full; contrast: normal, high. [Source](https://www.radix-ui.com/themes/docs/components/slider) (checked 2026-09-28).
- **Base UI** (component): orientation: horizontal, vertical; thumb-alignment: center, edge, edge-client-only; collision: push, swap, none; state: disabled. [Source](https://base-ui.com/react/components/slider) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): size: S, M, L, XL; track-style: thin, thick; thumb-style: default, precise; label-position: top, side; emphasis: default, emphasized; state: disabled. [Source](https://react-spectrum.adobe.com/Slider) (checked 2026-09-28).
- **Fluent 2** (component): orientation: horizontal, vertical. [Source](https://fluent2.microsoft.design/components/web/react/core/slider/usage) (checked 2026-09-28).
- **Carbon** (component): state: disabled, read-only, error, warning, skeleton. [Source](https://carbondesignsystem.com/components/slider/usage/) (checked 2026-09-28).
- **Material 3** (component): state: disabled. [Source](https://developer.android.com/develop/ui/compose/components/slider) (checked 2026-09-28).
- **Mantine** (component): orientation: horizontal, vertical; size: xs, sm, md, lg, xl; state: disabled. [Source](https://mantine.dev/core/slider) (checked 2026-09-28).
- **Ant Design** (component): orientation: horizontal, vertical; state: disabled; tooltip: auto, always, never. [Source](https://ant.design/components/slider) (checked 2026-09-28).
- **Chakra/Ark** (component): variant: outline, solid; size: sm, md, lg; orientation: horizontal, vertical; collision: push, swap, none; state: disabled. [Source](https://chakra-ui.com/docs/components/slider) (checked 2026-09-28).
- **Atlassian** (component): state: disabled. [Source](https://atlassian.design/components/range/examples) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (component): single-thumb, range-thumbs, value-label. [Source](https://www.untitledui.com/react/components/sliders) (checked 2026-09-28).
- **shadcn/ui** (component): single-thumb, range-thumbs. [Source](https://ui.shadcn.com/docs/components/slider) (checked 2026-09-28).
- **Radix Themes** (component): single-thumb, range-thumbs. [Source](https://www.radix-ui.com/themes/docs/components/slider) (checked 2026-09-28).
- **Base UI** (component): single-thumb, range-thumbs. [Source](https://base-ui.com/react/components/slider) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): single-thumb, range-thumbs, value-label. [Source](https://react-spectrum.adobe.com/Slider) (checked 2026-09-28).
- **Fluent 2** (component): single-thumb, step-marks, value-tooltip. [Source](https://fluent2.microsoft.design/components/web/react/core/slider/usage) (checked 2026-09-28).
- **Carbon** (component): single-thumb, range-thumbs, number-input, min-max-labels. [Source](https://carbondesignsystem.com/components/slider/usage/) (checked 2026-09-28).
- **Material 3** (component): single-thumb, range-thumbs, step-marks. [Source](https://developer.android.com/develop/ui/compose/components/slider) (checked 2026-09-28).
- **Mantine** (component): single-thumb, range-thumbs, step-marks, value-tooltip, thumb-icon. [Source](https://mantine.dev/core/slider) (checked 2026-09-28).
- **Ant Design** (component): single-thumb, range-thumbs, step-marks, value-tooltip. [Source](https://ant.design/components/slider) (checked 2026-09-28).
- **Chakra/Ark** (component): single-thumb, range-thumbs, step-marks, value-tooltip. [Source](https://chakra-ui.com/docs/components/slider) (checked 2026-09-28).
- **Atlassian** (component): single-thumb. [Source](https://atlassian.design/components/range/examples) (checked 2026-09-28).
- **Apple HIG** (guidance): single-thumb, step-marks, min-max-labels. [Source](https://developer.apple.com/design/human-interface-guidelines/sliders) (checked 2026-09-28).

## Interaction patterns

- **Untitled UI** (component): pointer-drag. [Source](https://www.untitledui.com/react/components/sliders) (checked 2026-09-28).
- **shadcn/ui** (component): pointer-drag, keyboard-step. [Source](https://ui.shadcn.com/docs/components/slider) (checked 2026-09-28).
- **Radix Themes** (component): pointer-drag, keyboard-step. [Source](https://www.radix-ui.com/themes/docs/components/slider) (checked 2026-09-28).
- **Base UI** (component): pointer-drag, keyboard-step, change-and-commit, min-max-step. [Source](https://base-ui.com/react/components/slider) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): pointer-drag, keyboard-step, locale-format. [Source](https://react-spectrum.adobe.com/Slider) (checked 2026-09-28).
- **Fluent 2** (component): pointer-drag, keyboard-step, track-click. [Source](https://fluent2.microsoft.design/components/web/react/core/slider/usage) (checked 2026-09-28).
- **Carbon** (component): pointer-drag, keyboard-step. [Source](https://carbondesignsystem.com/components/slider/usage/) (checked 2026-09-28).
- **Material 3** (component): pointer-drag, min-max-step. [Source](https://developer.android.com/develop/ui/compose/components/slider) (checked 2026-09-28).
- **Mantine** (component): pointer-drag, keyboard-step, change-and-commit, marks-only, custom-domain. [Source](https://mantine.dev/core/slider) (checked 2026-09-28).
- **Ant Design** (component): pointer-drag, keyboard-step, editable-thumbs, draggable-range, reverse. [Source](https://ant.design/components/slider) (checked 2026-09-28).
- **Chakra/Ark** (component): pointer-drag, keyboard-step, change-and-commit. [Source](https://chakra-ui.com/docs/components/slider) (checked 2026-09-28).
- **Atlassian** (component): pointer-drag, min-max-step. [Source](https://atlassian.design/components/range/examples) (checked 2026-09-28).
- **Apple HIG** (guidance): pointer-drag, continuous-or-discrete. [Source](https://developer.apple.com/design/human-interface-guidelines/sliders) (checked 2026-09-28).

## Area today

Native range-based slider; sm/md/lg, neutral/accent, inline/top label, vertical orientation, readout and marks. Range with inputs is documented as a composition; see the Area status on that option rather than inferring a general arbitrary-thumb engine. [Baseline spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/slider.md#L1).

- Exact manifest axes: tone = neutral, accent; size = sm, md, lg; labelPosition = top; orientation = vertical. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L277-L289).
- Boolean modifiers: none declared. Runtime state hooks: disabled, hover, focus-visible. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L277-L289).
- Slots: label, control, value, marks. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L277-L289).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `interaction:keyboard-step`, `interaction:min-max-step`, `interaction:pointer-drag`, `labelPosition:top`, `orientation:horizontal`, `orientation:vertical`, `size:lg`, `size:md`, `size:sm`, `state:disabled`, `structure:single-thumb`, `structure:step-marks`, `structure:value-label`, `tone:accent`, `tone:neutral`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L277-L289); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/slider.md#L1-L158).
- **composition**: `structure:min-max-labels`, `structure:number-input`, `structure:range-thumbs`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L277-L289); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/slider.md#L1-L158).
- **not found**: `collision:none`, `collision:push`, `collision:swap`, `interaction:change-and-commit`, `interaction:continuous-or-discrete`, `interaction:custom-domain`, `interaction:draggable-range`, `interaction:editable-thumbs`, `interaction:locale-format`, `interaction:marks-only`, `interaction:reverse`, `interaction:track-click`, `label-position:side`, `label-position:top`, `size:XL`, `size:xl`, `size:xs`, `state:error`, `state:read-only`, `state:skeleton`, `state:warning`, `structure:thumb-icon`, `structure:value-tooltip`, `thumb-alignment:center`, `thumb-alignment:edge`, `thumb-alignment:edge-client-only`, `thumb-style:default`, `thumb-style:precise`, `tooltip:always`, `tooltip:auto`, `tooltip:never`, `track-style:thick`, `track-style:thin`, `variant:classic`, `variant:outline`, `variant:soft`, `variant:solid`, `variant:surface`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L277-L289); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/slider.md#L1-L158).
- **equivalent tier / geometry not asserted**: `size:1`, `size:2`, `size:3`, `size:L`, `size:M`, `size:S`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L277-L289); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/slider.md#L1-L158).
- **system-level / not this exact option**: `contrast:high`, `contrast:normal`, `radius:full`, `radius:large`, `radius:medium`, `radius:none`, `radius:small`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L277-L289); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/slider.md#L1-L158).
- **equivalent concept / source styling differs**: `emphasis:default`, `emphasis:emphasized`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L277-L289); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/slider.md#L1-L158).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 6 direct systems. Direct: Ant Design, Base UI, Chakra/Ark, Fluent 2, Mantine, shadcn/ui. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L277-L289), [2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/slider.md#L1).
  - Individual options: `tone:neutral` (0 direct; Area: yes); `tone:accent` (0 direct; Area: yes); `size:sm` (2 direct; Area: yes); `size:md` (2 direct; Area: yes); `size:lg` (2 direct; Area: yes); `labelPosition:top` (0 direct; Area: yes); `orientation:vertical` (6 direct; Area: yes).
- **Layer 3 · Single/range thumbs and paired number inputs** — 12 direct systems; 1 guidance systems. Direct: Ant Design, Atlassian, Base UI, Carbon, Chakra/Ark, Fluent 2, Mantine, Material 3, Radix Themes, React Aria / Spectrum 2, Untitled UI, shadcn/ui. Clarify whether the range recipe becomes a first-class contract before adding more thumbs. Evidence: [1](https://ant.design/components/slider), [2](https://atlassian.design/components/range/examples), [3](https://base-ui.com/react/components/slider), [4](https://carbondesignsystem.com/components/slider/usage/), [5](https://chakra-ui.com/docs/components/slider), [6](https://developer.android.com/develop/ui/compose/components/slider), [7](https://developer.apple.com/design/human-interface-guidelines/sliders), [8](https://fluent2.microsoft.design/components/web/react/core/slider/usage), [9](https://mantine.dev/core/slider), [10](https://react-spectrum.adobe.com/Slider), [11](https://ui.shadcn.com/docs/components/slider), [12](https://www.radix-ui.com/themes/docs/components/slider), [13](https://www.untitledui.com/react/components/sliders).
  - Individual options: `structure:single-thumb` (12 direct; Area: yes); `structure:range-thumbs` (10 direct; Area: composition); `structure:number-input` (1 direct; Area: composition).
- **Layer 3 · Step marks and transient/always-visible value labels** — 7 direct systems; 1 guidance systems. Direct: Ant Design, Chakra/Ark, Fluent 2, Mantine, Material 3, React Aria / Spectrum 2, Untitled UI. Keep formatting, marks and precise numeric entry separate. Evidence: [1](https://ant.design/components/slider), [2](https://chakra-ui.com/docs/components/slider), [3](https://developer.android.com/develop/ui/compose/components/slider), [4](https://developer.apple.com/design/human-interface-guidelines/sliders), [5](https://fluent2.microsoft.design/components/web/react/core/slider/usage), [6](https://mantine.dev/core/slider), [7](https://react-spectrum.adobe.com/Slider), [8](https://www.untitledui.com/react/components/sliders).
  - Individual options: `structure:step-marks` (5 direct; Area: yes); `structure:value-tooltip` (4 direct; Area: not found); `structure:value-label` (2 direct; Area: yes).
- **Layer 2 · Explicit range-thumb collision policy** — 2 direct systems. Direct: Base UI, Chakra/Ark. Only if Area adopts a custom range engine; these policies are not visual aliases. Evidence: [1](https://base-ui.com/react/components/slider), [2](https://chakra-ui.com/docs/components/slider).
  - Individual options: `collision:push` (2 direct; Area: not found); `collision:swap` (2 direct; Area: not found); `collision:none` (2 direct; Area: not found).

## Sources

- Area: [manifest, lines 277–289](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L277-L289); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/slider.md#L1). All Area judgments refer to starting commit `c585f8c5f38705a7efa79bf05148a8c6989b142a`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: slider, range slider, range. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/sliders); checked 2026-09-28.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/slider); checked 2026-09-28.
- **Radix Themes**: [source 1](https://www.radix-ui.com/themes/docs/components/slider); checked 2026-09-28.
- **Base UI**: [source 1](https://base-ui.com/react/components/slider); checked 2026-09-28.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/Slider); checked 2026-09-28.
- **Fluent 2**: [source 1](https://fluent2.microsoft.design/components/web/react/core/slider/usage); checked 2026-09-28.
- **Primer — not found**: checked [catalogue](https://primer.style/product/components/) on 2026-09-28 for slider, range slider, range. No independently verified option recorded; see the audit for lookup limitations.
- **Carbon**: [source 1](https://carbondesignsystem.com/components/slider/usage/); checked 2026-09-28.
- **Material 3**: [source 1](https://developer.android.com/develop/ui/compose/components/slider); checked 2026-09-28.
- **Mantine**: [source 1](https://mantine.dev/core/slider); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/slider); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/slider); checked 2026-09-28.
- **Atlassian**: [source 1](https://atlassian.design/components/range/examples); checked 2026-09-28.
- **Polaris — not found**: checked [catalogue](https://shopify.dev/docs/api/app-home/latest/web-components) on 2026-09-28 for slider, range slider, range. No independently verified option recorded; see the audit for lookup limitations.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for slider, range slider, range. No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG**: [source 1](https://developer.apple.com/design/human-interface-guidelines/sliders); checked 2026-09-28.
  - Readable official data: [documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/sliders.json). Platform guidance is counted separately.
