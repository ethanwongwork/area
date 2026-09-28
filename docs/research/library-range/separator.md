# Separator — library range

Baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Divides related groups of content. [Area manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L382-L389).

Boundary: Horizontal/vertical rule, spacing none/normal and optional inset. Always renders separator semantics in the documented API; no labeled, dashed or dotted variant. [Area spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/separator.md#L1).

## Variant axes

- **shadcn/ui** (component): orientation: horizontal, vertical. [Source](https://ui.shadcn.com/docs/components/separator) (checked 2026-09-28).
- **Radix Themes** (component): orientation: horizontal, vertical; size: 1, 2, 3, 4. [Source](https://www.radix-ui.com/themes/docs/components/separator) (checked 2026-09-28).
- **Base UI** (component): orientation: horizontal, vertical. [Source](https://base-ui.com/react/components/separator) (checked 2026-09-28).
- **React Aria / Spectrum 2** (primitive): orientation: horizontal, vertical. [Source](https://react-aria.adobe.com/Separator) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): size: S, M, L. [Source](https://react-spectrum.adobe.com/Divider) (checked 2026-09-28).
- **Fluent 2** (component): inset: false, true. [Source](https://fluent2.microsoft.design/components/web/react/core/divider/usage) (checked 2026-09-28).
- **Material 3** (component): orientation: horizontal, vertical. [Source](https://developer.android.com/develop/ui/compose/components/divider) (checked 2026-09-28).
- **Mantine** (component): variant: solid, dashed, dotted; size: xs, sm, md, lg, xl; orientation: horizontal, vertical; label-position: left, center, right. [Source](https://mantine.dev/core/divider) (checked 2026-09-28).
- **Ant Design** (component): variant: solid, dashed, dotted; orientation: horizontal, vertical; title-placement: start, center, end. [Source](https://ant.design/components/divider) (checked 2026-09-28).
- **Chakra/Ark** (component): variant: solid, dashed, dotted; size: xs, sm, md, lg; orientation: horizontal, vertical. [Source](https://chakra-ui.com/docs/components/separator) (checked 2026-09-28).
- **Polaris** (component): direction: inline, block; color: base, strong. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/divider) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (example): text-label, icon, button, avatar. [Source](https://www.untitledui.com/react/components/content-dividers) (checked 2026-09-28).
- **Fluent 2** (component): text-label, icon. [Source](https://fluent2.microsoft.design/components/web/react/core/divider/usage) (checked 2026-09-28).
- **Material 3** (component): inset. [Source](https://developer.android.com/develop/ui/compose/components/divider) (checked 2026-09-28).
- **Mantine** (component): text-label, icon. [Source](https://mantine.dev/core/divider) (checked 2026-09-28).
- **Ant Design** (component): text-label. [Source](https://ant.design/components/divider) (checked 2026-09-28).
- **Chakra/Ark** (component): text-label. [Source](https://chakra-ui.com/docs/components/separator) (checked 2026-09-28).

## Interaction patterns

- **shadcn/ui** (component): semantic-or-decorative. [Source](https://ui.shadcn.com/docs/components/separator) (checked 2026-09-28).
- **Radix Themes** (component): semantic-or-decorative. [Source](https://www.radix-ui.com/themes/docs/components/separator) (checked 2026-09-28).
- **Base UI** (component): semantic-separator. [Source](https://base-ui.com/react/components/separator) (checked 2026-09-28).
- **React Aria / Spectrum 2** (primitive): semantic-separator. [Source](https://react-aria.adobe.com/Separator) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): semantic-separator. [Source](https://react-spectrum.adobe.com/Divider) (checked 2026-09-28).
- **Fluent 2** (component): semantic-or-decorative. [Source](https://fluent2.microsoft.design/components/web/react/core/divider/usage) (checked 2026-09-28).
- **Material 3** (component): semantic-separator. [Source](https://developer.android.com/develop/ui/compose/components/divider) (checked 2026-09-28).
- **Mantine** (component): semantic-separator. [Source](https://mantine.dev/core/divider) (checked 2026-09-28).
- **Ant Design** (component): semantic-separator. [Source](https://ant.design/components/divider) (checked 2026-09-28).
- **Chakra/Ark** (component): semantic-or-decorative. [Source](https://chakra-ui.com/docs/components/separator) (checked 2026-09-28).
- **Polaris** (component): semantic-separator. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/divider) (checked 2026-09-28).

## Area today

Horizontal/vertical rule, spacing none/normal and optional inset. Always renders separator semantics in the documented API; no labeled, dashed or dotted variant. [Baseline spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/separator.md#L1).

- Exact manifest axes: orientation = horizontal, vertical; spacing = none, normal. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L382-L389).
- Boolean modifiers: inset. Runtime state hooks: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L382-L389).
- Slots: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L382-L389).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **not found**: `direction:block`, `direction:inline`, `inset:false`, `inset:true`, `label-position:center`, `label-position:left`, `label-position:right`, `size:1`, `size:2`, `size:3`, `size:4`, `size:L`, `size:M`, `size:S`, `size:lg`, `size:md`, `size:sm`, `size:xl`, `size:xs`, `structure:avatar`, `structure:button`, `structure:icon`, `structure:text-label`, `title-placement:center`, `title-placement:end`, `title-placement:start`, `variant:dashed`, `variant:dotted`, `variant:solid`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L382-L389); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/separator.md#L1-L137).
- **yes**: `interaction:semantic-separator`, `orientation:horizontal`, `orientation:vertical`, `spacing:none`, `spacing:normal`, `structure:inset`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L382-L389); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/separator.md#L1-L137).
- **partial**: `interaction:semantic-or-decorative`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L382-L389); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/separator.md#L1-L137).
- **system-level / not this exact option**: `color:base`, `color:strong`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L382-L389); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/separator.md#L1-L137).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 7 direct systems; 1 supporting/adjacent systems. Direct: Ant Design, Base UI, Chakra/Ark, Mantine, Material 3, Radix Themes, shadcn/ui. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L382-L389), [2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/separator.md#L1).
  - Individual options: `orientation:horizontal` (7 direct; Area: yes); `orientation:vertical` (7 direct; Area: yes); `spacing:none` (0 direct; Area: yes); `spacing:normal` (0 direct; Area: yes).
- **Layer 3 · Labeled and icon separators** — 5 direct systems. Direct: Ant Design, Chakra/Ark, Fluent 2, Mantine, Untitled UI. Content-bearing rules need a deliberate anatomy and decorative/semantic policy. Evidence: [1](https://ant.design/components/divider), [2](https://chakra-ui.com/docs/components/separator), [3](https://fluent2.microsoft.design/components/web/react/core/divider/usage), [4](https://mantine.dev/core/divider), [5](https://www.untitledui.com/react/components/content-dividers).
  - Individual options: `structure:text-label` (5 direct; Area: not found); `structure:icon` (3 direct; Area: not found).
- **Layer 2 · Solid, dashed and dotted strokes** — 3 direct systems. Direct: Ant Design, Chakra/Ark, Mantine. Optional low-cost range; default remains the shared divider role. Evidence: [1](https://ant.design/components/divider), [2](https://chakra-ui.com/docs/components/separator), [3](https://mantine.dev/core/divider).
  - Individual options: `variant:solid` (3 direct; Area: not found); `variant:dashed` (3 direct; Area: not found); `variant:dotted` (3 direct; Area: not found).

## Sources

- Area: [manifest, lines 382–389](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L382-L389); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/separator.md#L1). All Area judgments refer to starting commit `c585f8c5f38705a7efa79bf05148a8c6989b142a`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: separator, divider, content divider. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/content-dividers); checked 2026-09-28.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/separator); checked 2026-09-28.
- **Radix Themes**: [source 1](https://www.radix-ui.com/themes/docs/components/separator); checked 2026-09-28.
- **Base UI**: [source 1](https://base-ui.com/react/components/separator); checked 2026-09-28.
- **React Aria / Spectrum 2**: [source 1](https://react-aria.adobe.com/Separator), [source 2](https://react-spectrum.adobe.com/Divider); checked 2026-09-28.
- **Fluent 2**: [source 1](https://fluent2.microsoft.design/components/web/react/core/divider/usage); checked 2026-09-28.
- **Primer — not found**: checked [catalogue](https://primer.style/product/components/) on 2026-09-28 for separator, divider, content divider. No independently verified option recorded; see the audit for lookup limitations.
- **Carbon — not found**: checked [catalogue](https://carbondesignsystem.com/components/overview/components/) on 2026-09-28 for separator, divider, content divider. No independently verified option recorded; see the audit for lookup limitations.
- **Material 3**: [source 1](https://developer.android.com/develop/ui/compose/components/divider); checked 2026-09-28.
- **Mantine**: [source 1](https://mantine.dev/core/divider); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/divider); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/separator); checked 2026-09-28.
- **Atlassian — not found**: checked [catalogue](https://atlassian.design/components) on 2026-09-28 for separator, divider, content divider. No independently verified option recorded; see the audit for lookup limitations.
- **Polaris**: [source 1](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/divider); checked 2026-09-28.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for separator, divider, content divider. No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG — not found**: checked [catalogue](https://developer.apple.com/design/human-interface-guidelines/components) on 2026-09-28 for separator, divider, content divider. No independently verified option recorded; see the audit for lookup limitations.
