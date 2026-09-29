# Skeleton — library range

Baseline `7dae828e7af1daf9d26b663d34335121156606f7` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Stands in for content that has not loaded. [Area manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L398-L405).

Boundary: Shapes are block (default), text and circle. Boolean static disables shimmer; wrap preserves child layout and makes the placeholder subtree inert. Multiline text uses lines. Placeholders are aria-hidden; the host owns busy announcements. [Area spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/skeleton.md#L1).

## Variant axes

- **Fluent 2** (component): animation: wave, pulse. [Source](https://fluent2.microsoft.design/components/web/react/core/skeleton/usage) (checked 2026-09-28).
- **Primer** (component): shape: circle, square. [Source](https://primer.style/product/components/skeleton-avatar/) (checked 2026-09-28).
- **Primer** (component): text-size: display, titleLarge, titleMedium, titleSmall, bodyLarge, bodyMedium, bodySmall, subtitle. [Source](https://primer.style/product/components/skeleton-text/) (checked 2026-09-28).
- **Mantine** (component): animation: on, off. [Source](https://mantine.dev/core/skeleton) (checked 2026-09-28).
- **Ant Design** (component): shape: circle, square, round; size: small, default, large. [Source](https://ant.design/components/skeleton) (checked 2026-09-28).
- **Chakra/Ark** (component): variant: pulse, shine, none. [Source](https://chakra-ui.com/docs/components/skeleton) (checked 2026-09-28).

## Structural alternatives

- **shadcn/ui** (component): text, circle, rectangle, card-composition. [Source](https://ui.shadcn.com/docs/components/skeleton) (checked 2026-09-28).
- **Radix Themes** (component): text, replace-children. [Source](https://www.radix-ui.com/themes/docs/components/skeleton) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): text, image, icon, replace-children. [Source](https://react-spectrum.adobe.com/Skeleton) (checked 2026-09-28).
- **Fluent 2** (component): content-layout. [Source](https://fluent2.microsoft.design/components/web/react/core/skeleton/usage) (checked 2026-09-28).
- **Primer** (component): rectangle. [Source](https://primer.style/product/components/skeleton-box/) (checked 2026-09-28).
- **Primer** (component): avatar. [Source](https://primer.style/product/components/skeleton-avatar/) (checked 2026-09-28).
- **Primer** (component): text, multiline. [Source](https://primer.style/product/components/skeleton-text/) (checked 2026-09-28).
- **Mantine** (component): circle, rectangle, replace-children. [Source](https://mantine.dev/core/skeleton) (checked 2026-09-28).
- **Ant Design** (component): avatar, paragraph, title, button, input, image. [Source](https://ant.design/components/skeleton) (checked 2026-09-28).
- **Chakra/Ark** (component): circle, text, replace-children. [Source](https://chakra-ui.com/docs/components/skeleton) (checked 2026-09-28).
- **Atlassian** (component): rectangle. [Source](https://atlassian.design/components/skeleton/examples) (checked 2026-09-28).

## Interaction patterns

- **loading-placeholder**: [shadcn/ui](https://ui.shadcn.com/docs/components/skeleton), [Radix Themes](https://www.radix-ui.com/themes/docs/components/skeleton), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/skeleton/usage), [Primer](https://primer.style/product/components/skeleton-box/), [Mantine](https://mantine.dev/core/skeleton), [Ant Design](https://ant.design/components/skeleton), [Chakra/Ark](https://chakra-ui.com/docs/components/skeleton), [Atlassian](https://atlassian.design/components/skeleton/examples) (checked 2026-09-28).
- **preserve-layout**: [Radix Themes](https://www.radix-ui.com/themes/docs/components/skeleton), [Mantine](https://mantine.dev/core/skeleton) (checked 2026-09-28).
- **disable-children**: [Radix Themes](https://www.radix-ui.com/themes/docs/components/skeleton), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Skeleton) (checked 2026-09-28).
- **shimmer**: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Skeleton) (checked 2026-09-28).
- **synchronized-animation**: [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/skeleton/usage) (checked 2026-09-28).
- **pulse**: [Ant Design](https://ant.design/components/skeleton) (checked 2026-09-28).
- **fade-in**: [Chakra/Ark](https://chakra-ui.com/docs/components/skeleton) (checked 2026-09-28).

## Area today

Shapes are block (default), text and circle. Boolean static disables shimmer; wrap preserves child layout and makes the placeholder subtree inert. Multiline text uses lines. Placeholders are aria-hidden; the host owns busy announcements. [Baseline spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/skeleton.md#L1).

- Exact manifest axes: shape = block, text, circle. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L398-L405).
- Boolean modifiers: static, wrap. Runtime state hooks: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L398-L405).
- Slots: lines. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L398-L405).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `animation:off`, `animation:on`, `interaction:disable-children`, `interaction:loading-placeholder`, `interaction:preserve-layout`, `interaction:shimmer`, `shape:block`, `shape:circle`, `shape:text`, `structure:circle`, `structure:multiline`, `structure:rectangle`, `structure:replace-children`, `structure:text`, `variant:none`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L398-L405); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/skeleton.md#L1-L171).
- **composition**: `structure:card-composition`, `structure:content-layout`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L398-L405); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/skeleton.md#L1-L171).
- **not found**: `animation:pulse`, `animation:wave`, `interaction:fade-in`, `interaction:pulse`, `interaction:synchronized-animation`, `shape:round`, `shape:square`, `size:default`, `size:large`, `size:small`, `structure:avatar`, `structure:button`, `structure:icon`, `structure:image`, `structure:input`, `structure:paragraph`, `structure:title`, `text-size:bodyLarge`, `text-size:bodyMedium`, `text-size:bodySmall`, `text-size:display`, `text-size:subtitle`, `text-size:titleLarge`, `text-size:titleMedium`, `text-size:titleSmall`, `variant:pulse`, `variant:shine`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L398-L405); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/skeleton.md#L1-L171).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 2 direct systems. Direct: Ant Design, Primer. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L398-L405), [2](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/skeleton.md#L1).
  - Individual options: `shape:block` (0 direct; Area: yes); `shape:text` (0 direct; Area: yes); `shape:circle` (2 direct; Area: yes).
- **Layer 2 · Pulse, shimmer/wave and static** — 3 direct systems. Direct: Chakra/Ark, Fluent 2, Mantine. Connect all animation choices to reduced-motion policy. Evidence: [1](https://chakra-ui.com/docs/components/skeleton), [2](https://fluent2.microsoft.design/components/web/react/core/skeleton/usage), [3](https://mantine.dev/core/skeleton).
  - Individual options: `animation:wave` (1 direct; Area: not found); `animation:pulse` (1 direct; Area: not found); `variant:pulse` (1 direct; Area: not found); `variant:shine` (1 direct; Area: not found); `variant:none` (1 direct; Area: yes); `animation:off` (1 direct; Area: yes).
- **Layer 3 · Layout-preserving content wrapper** — 4 direct systems. Direct: Chakra/Ark, Mantine, Radix Themes, React Aria / Spectrum 2. Useful when layout is already known; disable hidden interactive descendants. Evidence: [1](https://chakra-ui.com/docs/components/skeleton), [2](https://mantine.dev/core/skeleton), [3](https://react-spectrum.adobe.com/Skeleton), [4](https://www.radix-ui.com/themes/docs/components/skeleton).
  - Individual options: `structure:replace-children` (4 direct; Area: yes); `interaction:preserve-layout` (2 direct; Area: yes).
- **Layer 3 · Multiline text and avatar presets** — 2 direct systems. Direct: Ant Design, Primer. Reuse the actual typography and avatar geometry rather than invent new fixed dimensions. Evidence: [1](https://ant.design/components/skeleton), [2](https://primer.style/product/components/skeleton-avatar/), [3](https://primer.style/product/components/skeleton-text/).
  - Individual options: `structure:multiline` (1 direct; Area: yes); `structure:avatar` (2 direct; Area: not found).

## Sources

- Area: [manifest, lines 398–405](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L398-L405); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/skeleton.md#L1). All Area judgments refer to starting commit `7dae828e7af1daf9d26b663d34335121156606f7`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: skeleton, skeleton box, skeleton text, placeholder. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI — not found**: checked [catalogue](https://www.untitledui.com/react/components) on 2026-09-28 for skeleton, skeleton box, skeleton text, placeholder. No independently verified option recorded; see the audit for lookup limitations.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/skeleton); checked 2026-09-28.
- **Radix Themes**: [source 1](https://www.radix-ui.com/themes/docs/components/skeleton); checked 2026-09-28.
- **Base UI — not found**: checked [catalogue](https://base-ui.com/react/overview/quick-start) on 2026-09-28 for skeleton, skeleton box, skeleton text, placeholder. No independently verified option recorded; see the audit for lookup limitations.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/Skeleton); checked 2026-09-28.
- **Fluent 2**: [source 1](https://fluent2.microsoft.design/components/web/react/core/skeleton/usage); checked 2026-09-28.
- **Primer**: [source 1](https://primer.style/product/components/skeleton-avatar/), [source 2](https://primer.style/product/components/skeleton-box/), [source 3](https://primer.style/product/components/skeleton-text/); checked 2026-09-28.
- **Carbon — not found**: checked [catalogue](https://carbondesignsystem.com/components/overview/components/) on 2026-09-28 for skeleton, skeleton box, skeleton text, placeholder. No independently verified option recorded; see the audit for lookup limitations.
- **Material 3 — not found**: checked [catalogue](https://m3.material.io/components) on 2026-09-28 for skeleton, skeleton box, skeleton text, placeholder. No independently verified option recorded; see the audit for lookup limitations.
- **Mantine**: [source 1](https://mantine.dev/core/skeleton); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/skeleton); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/skeleton); checked 2026-09-28.
- **Atlassian**: [source 1](https://atlassian.design/components/skeleton/examples); checked 2026-09-28.
- **Polaris — not found**: checked [catalogue](https://shopify.dev/docs/api/app-home/latest/web-components) on 2026-09-28 for skeleton, skeleton box, skeleton text, placeholder. No independently verified option recorded; see the audit for lookup limitations.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for skeleton, skeleton box, skeleton text, placeholder. No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG — not found**: checked [catalogue](https://developer.apple.com/design/human-interface-guidelines/components) on 2026-09-28 for skeleton, skeleton box, skeleton text, placeholder. No independently verified option recorded; see the audit for lookup limitations.
