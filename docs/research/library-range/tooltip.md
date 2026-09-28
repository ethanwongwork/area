# Tooltip — library range

Baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Names a control on hover or focus. [Area manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L567-L574).

Boundary: Four sides, optional arrow, inverse text surface. Trigger adds delayed hover, immediate keyboard focus and dismissal. Noninteractive by contract; rich interactive help belongs to Popover, even when another system names it a tooltip. [Area spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/tooltip.md#L1).

## Variant axes

- **Untitled UI** (component): placement: top, bottom, left, right. [Source](https://www.untitledui.com/react/components/tooltips) (checked 2026-09-28).
- **shadcn/ui** (component): side: top, right, bottom, left. [Source](https://ui.shadcn.com/docs/components/tooltip) (checked 2026-09-28).
- **Base UI** (component): state: disabled. [Source](https://base-ui.com/react/components/tooltip) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): trigger: hover, focus; state: disabled. [Source](https://react-spectrum.adobe.com/Tooltip) (checked 2026-09-28).
- **Primer** (component): direction: n, s, e, w, ne, nw, se, sw. [Source](https://primer.style/product/components/tooltip/) (checked 2026-09-28).
- **Material 3** (component): type: plain, rich. [Source](https://developer.android.com/develop/ui/compose/components/tooltip) (checked 2026-09-28).
- **Mantine** (component): position: top, bottom, left, right; arrow-position: center, side, merge. [Source](https://mantine.dev/core/tooltip) (checked 2026-09-28).
- **Ant Design** (component): trigger: hover, focus, click, contextMenu; placement: top, topLeft, topRight, bottom, bottomLeft, bottomRight, left, leftTop, leftBottom, right, rightTop, rightBottom. [Source](https://ant.design/components/tooltip) (checked 2026-09-28).
- **Chakra/Ark** (component): state: disabled. [Source](https://chakra-ui.com/docs/components/tooltip) (checked 2026-09-28).
- **Atlassian** (component): position: top, right, bottom, left, mouse. [Source](https://atlassian.design/components/tooltip/examples) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (component): arrow, description. [Source](https://www.untitledui.com/react/components/tooltips) (checked 2026-09-28).
- **shadcn/ui** (component): arrow. [Source](https://ui.shadcn.com/docs/components/tooltip) (checked 2026-09-28).
- **Radix Themes** (component): text. [Source](https://www.radix-ui.com/themes/docs/components/tooltip) (checked 2026-09-28).
- **Base UI** (component): arrow, detached-triggers. [Source](https://base-ui.com/react/components/tooltip) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): text. [Source](https://react-spectrum.adobe.com/Tooltip) (checked 2026-09-28).
- **Fluent 2** (component): arrow, text. [Source](https://fluent2.microsoft.design/components/web/react/core/tooltip/usage) (checked 2026-09-28).
- **Primer** (component): text. [Source](https://primer.style/product/components/tooltip/) (checked 2026-09-28).
- **Carbon** (component): text, definition-term. [Source](https://carbondesignsystem.com/components/tooltip/usage/) (checked 2026-09-28).
- **Material 3** (component): text, title-description, actions. [Source](https://developer.android.com/develop/ui/compose/components/tooltip) (checked 2026-09-28).
- **Mantine** (component): arrow, multiline. [Source](https://mantine.dev/core/tooltip) (checked 2026-09-28).
- **Ant Design** (component): arrow. [Source](https://ant.design/components/tooltip) (checked 2026-09-28).
- **Chakra/Ark** (component): arrow. [Source](https://chakra-ui.com/docs/components/tooltip) (checked 2026-09-28).
- **Atlassian** (component): text. [Source](https://atlassian.design/components/tooltip/examples) (checked 2026-09-28).
- **Polaris** (component): text, definition-term. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/tooltip) (checked 2026-09-28).

## Interaction patterns

- **Untitled UI** (component): hover-focus. [Source](https://www.untitledui.com/react/components/tooltips) (checked 2026-09-28).
- **shadcn/ui** (component): hover-focus, delay. [Source](https://ui.shadcn.com/docs/components/tooltip) (checked 2026-09-28).
- **Radix Themes** (component): hover-focus. [Source](https://www.radix-ui.com/themes/docs/components/tooltip) (checked 2026-09-28).
- **Base UI** (component): hover-focus, delay, escape-dismiss, skip-touch. [Source](https://base-ui.com/react/components/tooltip) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): hover-focus, delay. [Source](https://react-spectrum.adobe.com/Tooltip) (checked 2026-09-28).
- **Fluent 2** (component): hover-focus, blur-dismiss. [Source](https://fluent2.microsoft.design/components/web/react/core/tooltip/usage) (checked 2026-09-28).
- **Primer** (component): hover-focus. [Source](https://primer.style/product/components/tooltip/) (checked 2026-09-28).
- **Carbon** (component): hover-focus. [Source](https://carbondesignsystem.com/components/tooltip/usage/) (checked 2026-09-28).
- **Material 3** (component): hover-focus, long-press. [Source](https://developer.android.com/develop/ui/compose/components/tooltip) (checked 2026-09-28).
- **Mantine** (component): hover-focus, delay, follow-pointer, group-delay. [Source](https://mantine.dev/core/tooltip) (checked 2026-09-28).
- **Ant Design** (component): collision-handling, controlled-open. [Source](https://ant.design/components/tooltip) (checked 2026-09-28).
- **Chakra/Ark** (component): hover-focus, delay, interactive-content. [Source](https://chakra-ui.com/docs/components/tooltip) (checked 2026-09-28).
- **Atlassian** (component): hover-focus, delay, follow-pointer. [Source](https://atlassian.design/components/tooltip/examples) (checked 2026-09-28).
- **Polaris** (component): hover-focus. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/tooltip) (checked 2026-09-28).

## Area today

Four sides, optional arrow, inverse text surface. Trigger adds delayed hover, immediate keyboard focus and dismissal. Noninteractive by contract; rich interactive help belongs to Popover, even when another system names it a tooltip. [Baseline spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/tooltip.md#L1).

- Exact manifest axes: side = top, right, bottom, left. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L567-L574).
- Boolean modifiers: arrow. Runtime state hooks: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L567-L574).
- Slots: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L567-L574).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `interaction:blur-dismiss`, `interaction:delay`, `interaction:escape-dismiss`, `interaction:hover-focus`, `placement:bottom`, `placement:left`, `placement:right`, `placement:top`, `side:bottom`, `side:left`, `side:right`, `side:top`, `structure:arrow`, `structure:text`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L567-L574); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/tooltip.md#L1-L154).
- **composition**: `structure:description`, `structure:multiline`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L567-L574); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/tooltip.md#L1-L154).
- **not found**: `arrow-position:center`, `arrow-position:merge`, `arrow-position:side`, `direction:e`, `direction:n`, `direction:ne`, `direction:nw`, `direction:s`, `direction:se`, `direction:sw`, `direction:w`, `interaction:collision-handling`, `interaction:controlled-open`, `interaction:follow-pointer`, `interaction:group-delay`, `interaction:interactive-content`, `interaction:long-press`, `interaction:skip-touch`, `placement:bottomLeft`, `placement:bottomRight`, `placement:leftBottom`, `placement:leftTop`, `placement:rightBottom`, `placement:rightTop`, `placement:topLeft`, `placement:topRight`, `position:bottom`, `position:left`, `position:mouse`, `position:right`, `position:top`, `state:disabled`, `structure:actions`, `structure:definition-term`, `structure:detached-triggers`, `structure:title-description`, `trigger:click`, `trigger:contextMenu`, `trigger:focus`, `trigger:hover`, `type:plain`, `type:rich`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L567-L574); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/tooltip.md#L1-L154).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 1 direct systems. Direct: shadcn/ui. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L567-L574), [2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/tooltip.md#L1).
  - Individual options: `side:top` (1 direct; Area: yes); `side:right` (1 direct; Area: yes); `side:bottom` (1 direct; Area: yes); `side:left` (1 direct; Area: yes).
- **Layer 3 · Plain text, description and multiline** — 10 direct systems. Direct: Atlassian, Carbon, Fluent 2, Mantine, Material 3, Polaris, Primer, Radix Themes, React Aria / Spectrum 2, Untitled UI. Retain a noninteractive Tooltip. Material’s rich tooltip belongs to Area Popover when it has actions. Evidence: [1](https://atlassian.design/components/tooltip/examples), [2](https://carbondesignsystem.com/components/tooltip/usage/), [3](https://developer.android.com/develop/ui/compose/components/tooltip), [4](https://fluent2.microsoft.design/components/web/react/core/tooltip/usage), [5](https://mantine.dev/core/tooltip), [6](https://primer.style/product/components/tooltip/), [7](https://react-spectrum.adobe.com/Tooltip), [8](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/tooltip), [9](https://www.radix-ui.com/themes/docs/components/tooltip), [10](https://www.untitledui.com/react/components/tooltips).
  - Individual options: `structure:text` (8 direct; Area: yes); `structure:description` (1 direct; Area: composition); `structure:multiline` (1 direct; Area: composition).
- **Layer 2 · Placement, arrow and delay grouping** — 9 direct systems. Direct: Ant Design, Atlassian, Base UI, Chakra/Ark, Fluent 2, Mantine, React Aria / Spectrum 2, Untitled UI, shadcn/ui. Make shared timing predictable; avoid treating follow-pointer as the default. Evidence: [1](https://ant.design/components/tooltip), [2](https://atlassian.design/components/tooltip/examples), [3](https://base-ui.com/react/components/tooltip), [4](https://chakra-ui.com/docs/components/tooltip), [5](https://fluent2.microsoft.design/components/web/react/core/tooltip/usage), [6](https://mantine.dev/core/tooltip), [7](https://react-spectrum.adobe.com/Tooltip), [8](https://ui.shadcn.com/docs/components/tooltip), [9](https://www.untitledui.com/react/components/tooltips).
  - Individual options: `structure:arrow` (7 direct; Area: yes); `interaction:group-delay` (1 direct; Area: not found); `interaction:delay` (6 direct; Area: yes).

## Sources

- Area: [manifest, lines 567–574](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L567-L574); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/tooltip.md#L1). All Area judgments refer to starting commit `c585f8c5f38705a7efa79bf05148a8c6989b142a`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: tooltip, definition tooltip (interactive rich tooltip is adjacent). The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/tooltips); checked 2026-09-28.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/tooltip); checked 2026-09-28.
- **Radix Themes**: [source 1](https://www.radix-ui.com/themes/docs/components/tooltip); checked 2026-09-28.
- **Base UI**: [source 1](https://base-ui.com/react/components/tooltip); checked 2026-09-28.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/Tooltip); checked 2026-09-28.
- **Fluent 2**: [source 1](https://fluent2.microsoft.design/components/web/react/core/tooltip/usage); checked 2026-09-28.
- **Primer**: [source 1](https://primer.style/product/components/tooltip/); checked 2026-09-28.
- **Carbon**: [source 1](https://carbondesignsystem.com/components/tooltip/usage/); checked 2026-09-28.
- **Material 3**: [source 1](https://developer.android.com/develop/ui/compose/components/tooltip); checked 2026-09-28.
- **Mantine**: [source 1](https://mantine.dev/core/tooltip); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/tooltip); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/tooltip); checked 2026-09-28.
- **Atlassian**: [source 1](https://atlassian.design/components/tooltip/examples); checked 2026-09-28.
- **Polaris**: [source 1](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/tooltip); checked 2026-09-28.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for tooltip, definition tooltip (interactive rich tooltip is adjacent). No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG — not found**: checked [catalogue](https://developer.apple.com/design/human-interface-guidelines/components) on 2026-09-28 for tooltip, definition tooltip (interactive rich tooltip is adjacent). No independently verified option recorded; see the audit for lookup limitations.

Not found at option level (therefore omitted from counts): React Aria / Spectrum 2: escape-dismiss. Looked in the corresponding component pages linked above; these omissions are evidence limits, not assertions of absent behavior.
