# Popover — library range

Baseline `7dae828e7af1daf9d26b663d34335121156606f7` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Floats rich, interactive content next to the element that opened it. [Area manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L549-L556).

Boundary: Four sides, optional arrow, header/body/footer/media. Trigger mode adds native nonmodal popover behavior; without a trigger it is a static surface. Modal focus trapping is not an established Popover option. [Area spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/popover.md#L1).

## Variant axes

- **shadcn/ui** (component): side: top, right, bottom, left. [Source](https://ui.shadcn.com/docs/components/popover) (checked 2026-09-28).
- **Radix Themes** (component): size: 1, 2, 3, 4. [Source](https://www.radix-ui.com/themes/docs/components/popover) (checked 2026-09-28).
- **Base UI** (component): modal: true, false, trap-focus; side: top, right, bottom, left. [Source](https://base-ui.com/react/components/popover) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): size: S, M, L; placement: top, bottom, left, right. [Source](https://react-spectrum.adobe.com/Popover) (checked 2026-09-28).
- **Carbon** (component): tip: none, caret. [Source](https://carbondesignsystem.com/components/popover/usage/) (checked 2026-09-28).
- **Mantine** (component): position: top, bottom, left, right. [Source](https://mantine.dev/core/popover) (checked 2026-09-28).
- **Ant Design** (component): trigger: hover, focus, click, contextMenu; placement: top, topLeft, topRight, bottom, bottomLeft, bottomRight, left, leftTop, leftBottom, right, rightTop, rightBottom. [Source](https://ant.design/components/popover) (checked 2026-09-28).
- **Chakra/Ark** (component): size: xs, sm, md, lg; modal: true, false. [Source](https://chakra-ui.com/docs/components/popover) (checked 2026-09-28).
- **Atlassian** (component): placement: top, bottom, left, right. [Source](https://atlassian.design/components/popup/examples) (checked 2026-09-28).

## Structural alternatives

- **shadcn/ui** (component): title-description, fields. [Source](https://ui.shadcn.com/docs/components/popover) (checked 2026-09-28).
- **Radix Themes** (component): title-description, fields, close-button. [Source](https://www.radix-ui.com/themes/docs/components/popover) (checked 2026-09-28).
- **Base UI** (component): arrow, title-description, close-button, detached-triggers. [Source](https://base-ui.com/react/components/popover) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): arrow, hide-arrow, title-description, fields. [Source](https://react-spectrum.adobe.com/Popover) (checked 2026-09-28).
- **Fluent 2** (component): arrow, title-description, fields. [Source](https://fluent2.microsoft.design/components/web/react/core/popover/usage) (checked 2026-09-28).
- **Primer** (component): title-description. [Source](https://primer.style/product/components/popover/) (checked 2026-09-28).
- **Carbon** (component): arrow, hide-arrow, header, footer, scrollable-body. [Source](https://carbondesignsystem.com/components/popover/usage/) (checked 2026-09-28).
- **Mantine** (component): arrow, fields, close-button. [Source](https://mantine.dev/core/popover) (checked 2026-09-28).
- **Ant Design** (component): arrow, title-description. [Source](https://ant.design/components/popover) (checked 2026-09-28).
- **Chakra/Ark** (component): arrow, header, body, footer, close-button. [Source](https://chakra-ui.com/docs/components/popover) (checked 2026-09-28).
- **Atlassian** (component): custom-trigger. [Source](https://atlassian.design/components/popup/examples) (checked 2026-09-28).
- **Polaris** (component): fields, custom-trigger. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/popover) (checked 2026-09-28).
- **Apple HIG** (guidance): arrow, close-button. [Source](https://developer.apple.com/design/human-interface-guidelines/popovers) (checked 2026-09-28).

## Interaction patterns

- **click-open**: [shadcn/ui](https://ui.shadcn.com/docs/components/popover), [Radix Themes](https://www.radix-ui.com/themes/docs/components/popover), [Base UI](https://base-ui.com/react/components/popover), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/popover/usage), [Mantine](https://mantine.dev/core/popover), [Chakra/Ark](https://chakra-ui.com/docs/components/popover), [Atlassian](https://atlassian.design/components/popup/examples), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/popover) (checked 2026-09-28).
- **escape-dismiss**: [shadcn/ui](https://ui.shadcn.com/docs/components/popover), [Radix Themes](https://www.radix-ui.com/themes/docs/components/popover), [Base UI](https://base-ui.com/react/components/popover), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Popover), [Mantine](https://mantine.dev/core/popover), [Chakra/Ark](https://chakra-ui.com/docs/components/popover), [Atlassian](https://atlassian.design/components/popup/examples) (checked 2026-09-28).
- **hover-open**: [Base UI](https://base-ui.com/react/components/popover) (checked 2026-09-28).
- **outside-dismiss**: [Base UI](https://base-ui.com/react/components/popover), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Popover), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/popover/usage), [Mantine](https://mantine.dev/core/popover), [Chakra/Ark](https://chakra-ui.com/docs/components/popover), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/popovers) (checked 2026-09-28).
- **collision-handling**: [Base UI](https://base-ui.com/react/components/popover), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Popover), [Carbon](https://carbondesignsystem.com/components/popover/usage/), [Mantine](https://mantine.dev/core/popover), [Ant Design](https://ant.design/components/popover) (checked 2026-09-28).
- **focus-return**: [Base UI](https://base-ui.com/react/components/popover), [Chakra/Ark](https://chakra-ui.com/docs/components/popover) (checked 2026-09-28).
- **focus-trap**: [Mantine](https://mantine.dev/core/popover), [Atlassian](https://atlassian.design/components/popup/examples) (checked 2026-09-28).
- **controlled-open**: [Ant Design](https://ant.design/components/popover) (checked 2026-09-28).
- **adaptive-presentation**: [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/popovers) (checked 2026-09-28).

## Area today

Four sides, optional arrow, header/body/footer/media. Trigger mode adds native nonmodal popover behavior; without a trigger it is a static surface. Modal focus trapping is not an established Popover option. [Baseline spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/popover.md#L1).

- Exact manifest axes: side = top, right, bottom, left. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L549-L556).
- Boolean modifiers: arrow. Runtime state hooks: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L549-L556).
- Slots: header, title, description, body, footer, media, arrow, arrow-edge. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L549-L556).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `interaction:click-open`, `interaction:collision-handling`, `interaction:escape-dismiss`, `interaction:focus-return`, `interaction:outside-dismiss`, `placement:bottom`, `placement:left`, `placement:right`, `placement:top`, `side:bottom`, `side:left`, `side:right`, `side:top`, `structure:arrow`, `structure:body`, `structure:close-button`, `structure:footer`, `structure:header`, `structure:hide-arrow`, `structure:title-description`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L549-L556); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/popover.md#L1-L169).
- **composition**: `structure:fields`, `structure:scrollable-body`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L549-L556); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/popover.md#L1-L169).
- **not found**: `interaction:adaptive-presentation`, `interaction:controlled-open`, `interaction:focus-trap`, `interaction:hover-open`, `modal:false`, `modal:trap-focus`, `modal:true`, `placement:bottomLeft`, `placement:bottomRight`, `placement:leftBottom`, `placement:leftTop`, `placement:rightBottom`, `placement:rightTop`, `placement:topLeft`, `placement:topRight`, `position:bottom`, `position:left`, `position:right`, `position:top`, `size:1`, `size:2`, `size:3`, `size:4`, `size:L`, `size:M`, `size:S`, `size:lg`, `size:md`, `size:sm`, `size:xs`, `structure:custom-trigger`, `structure:detached-triggers`, `tip:caret`, `tip:none`, `trigger:click`, `trigger:contextMenu`, `trigger:focus`, `trigger:hover`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L549-L556); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/popover.md#L1-L169).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 2 direct systems. Direct: Base UI, shadcn/ui. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L549-L556), [2](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/popover.md#L1).
  - Individual options: `side:top` (2 direct; Area: yes); `side:right` (2 direct; Area: yes); `side:bottom` (2 direct; Area: yes); `side:left` (2 direct; Area: yes).
- **Layer 2 · A small set of surface sizes** — 3 direct systems. Direct: Chakra/Ark, Radix Themes, React Aria / Spectrum 2. Offer predictable padding/content width choices without turning every width into a named variant. Evidence: [1](https://chakra-ui.com/docs/components/popover), [2](https://react-spectrum.adobe.com/Popover), [3](https://www.radix-ui.com/themes/docs/components/popover).
  - Individual options: `size:1` (1 direct; Area: not found); `size:2` (1 direct; Area: not found); `size:3` (1 direct; Area: not found); `size:4` (1 direct; Area: not found); `size:S` (1 direct; Area: not found); `size:M` (1 direct; Area: not found); `size:L` (1 direct; Area: not found); `size:xs` (1 direct; Area: not found); `size:sm` (1 direct; Area: not found); `size:md` (1 direct; Area: not found); `size:lg` (1 direct; Area: not found).
- **Layer 3 · Header/body/footer with optional arrow** — 7 direct systems; 1 guidance systems. Direct: Ant Design, Base UI, Carbon, Chakra/Ark, Fluent 2, Mantine, React Aria / Spectrum 2. Retain current slots and make scrollable-body versus fixed footer explicit. Evidence: [1](https://ant.design/components/popover), [2](https://base-ui.com/react/components/popover), [3](https://carbondesignsystem.com/components/popover/usage/), [4](https://chakra-ui.com/docs/components/popover), [5](https://developer.apple.com/design/human-interface-guidelines/popovers), [6](https://fluent2.microsoft.design/components/web/react/core/popover/usage), [7](https://mantine.dev/core/popover), [8](https://react-spectrum.adobe.com/Popover).
  - Individual options: `structure:header` (2 direct; Area: yes); `structure:footer` (2 direct; Area: yes); `structure:arrow` (7 direct; Area: yes); `structure:hide-arrow` (2 direct; Area: yes).
- **Layer 2 · Nonmodal, trapped-focus and modal behavior are distinct** — 2 direct systems. Direct: Base UI, Chakra/Ark. Keep Area nonmodal by default; a modal option needs a deliberate accessibility contract. Evidence: [1](https://base-ui.com/react/components/popover), [2](https://chakra-ui.com/docs/components/popover).
  - Individual options: `modal:false` (2 direct; Area: not found); `modal:trap-focus` (1 direct; Area: not found); `modal:true` (2 direct; Area: not found).

## Sources

- Area: [manifest, lines 549–556](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L549-L556); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/popover.md#L1). All Area judgments refer to starting commit `7dae828e7af1daf9d26b663d34335121156606f7`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: popover, popup, anchored overlay. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI — not found**: checked [catalogue](https://www.untitledui.com/react/components) on 2026-09-28 for popover, popup, anchored overlay. No independently verified option recorded; see the audit for lookup limitations.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/popover); checked 2026-09-28.
- **Radix Themes**: [source 1](https://www.radix-ui.com/themes/docs/components/popover); checked 2026-09-28.
- **Base UI**: [source 1](https://base-ui.com/react/components/popover); checked 2026-09-28.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/Popover); checked 2026-09-28.
- **Fluent 2**: [source 1](https://fluent2.microsoft.design/components/web/react/core/popover/usage); checked 2026-09-28.
- **Primer**: [source 1](https://primer.style/product/components/popover/); checked 2026-09-28.
- **Carbon**: [source 1](https://carbondesignsystem.com/components/popover/usage/); checked 2026-09-28.
- **Material 3 — not found**: checked [catalogue](https://m3.material.io/components) on 2026-09-28 for popover, popup, anchored overlay. No independently verified option recorded; see the audit for lookup limitations.
- **Mantine**: [source 1](https://mantine.dev/core/popover); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/popover); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/popover); checked 2026-09-28.
- **Atlassian**: [source 1](https://atlassian.design/components/popup/examples); checked 2026-09-28.
- **Polaris**: [source 1](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/popover); checked 2026-09-28.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for popover, popup, anchored overlay. No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG**: [source 1](https://developer.apple.com/design/human-interface-guidelines/popovers); checked 2026-09-28.
  - Readable official data: [documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/popovers.json). Platform guidance is counted separately.

Not found at option level (therefore omitted from counts): shadcn/ui: outside-dismiss, focus-return; Radix Themes: outside-dismiss; React Aria / Spectrum 2: focus-return; Primer: close-button; Atlassian: outside-dismiss; Polaris: escape-dismiss, outside-dismiss. Looked in the corresponding component pages linked above; these omissions are evidence limits, not assertions of absent behavior.
