# TreeView — library range

Baseline `7dae828e7af1daf9d26b663d34335121156606f7` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Navigates or selects items in an expandable hierarchy. [Area manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L180-L186).

Boundary: Navigation and checkbox modes; flat DOM with ARIA levels, counts/status, row actions and disabled skipping. Controlled/initial expansion and current item; no general multiselect modifier contract, lazy data, drag, filtering or virtualization in the spec. [Area spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/tree-view.md#L1).

## Variant axes

- **Untitled UI** (component): size: sm, md; selection: single, multiple. [Source](https://www.untitledui.com/react/components/tree-views) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): selection: none, single, multiple; selection-style: highlight, checkbox; disabled-behavior: selection, all. [Source](https://react-spectrum.adobe.com/TreeView) (checked 2026-09-28).
- **Fluent 2** (component): selection: none, single, multiple. [Source](https://fluent2.microsoft.design/components/web/react/core/tree/usage) (checked 2026-09-28).
- **Carbon** (component): size: xs, sm. [Source](https://carbondesignsystem.com/components/tree-view/usage/) (checked 2026-09-28).
- **Mantine** (component): selection: single, multiple. [Source](https://mantine.dev/core/tree) (checked 2026-09-28).
- **Ant Design** (component): selection: single, multiple; state: disabled. [Source](https://ant.design/components/tree) (checked 2026-09-28).
- **Chakra/Ark** (component): variant: subtle, solid; size: xs, sm, md; selection: single, multiple; state: disabled. [Source](https://chakra-ui.com/docs/components/tree-view) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (component): icons, connector-lines. [Source](https://www.untitledui.com/react/components/tree-views) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): icons, descriptions, row-actions, checkboxes. [Source](https://react-spectrum.adobe.com/TreeView) (checked 2026-09-28).
- **Fluent 2** (component): icons, avatars, row-actions, checkboxes. [Source](https://fluent2.microsoft.design/components/web/react/core/tree/usage) (checked 2026-09-28).
- **Primer** (component): icons, row-actions, trailing-content. [Source](https://primer.style/product/components/tree-view/) (checked 2026-09-28).
- **Carbon** (component): icons. [Source](https://carbondesignsystem.com/components/tree-view/usage/) (checked 2026-09-28).
- **Mantine** (component): icons, checkboxes, row-actions. [Source](https://mantine.dev/core/tree) (checked 2026-09-28).
- **Ant Design** (component): icons, checkboxes, connector-lines, full-width-row. [Source](https://ant.design/components/tree) (checked 2026-09-28).
- **Chakra/Ark** (component): icons, checkboxes. [Source](https://chakra-ui.com/docs/components/tree-view) (checked 2026-09-28).
- **Apple HIG** (guidance): icons, columns. [Source](https://developer.apple.com/design/human-interface-guidelines/outline-views) (checked 2026-09-28).

## Interaction patterns

- **collapse-expand**: [Untitled UI](https://www.untitledui.com/react/components/tree-views), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/TreeView), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/tree/usage), [Primer](https://primer.style/product/components/tree-view/), [Carbon](https://carbondesignsystem.com/components/tree-view/usage/), [Mantine](https://mantine.dev/core/tree), [Ant Design](https://ant.design/components/tree), [Chakra/Ark](https://chakra-ui.com/docs/components/tree-view), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/outline-views) (checked 2026-09-28).
- **multiple-selection**: [Untitled UI](https://www.untitledui.com/react/components/tree-views), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/TreeView), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/tree/usage), [Mantine](https://mantine.dev/core/tree), [Ant Design](https://ant.design/components/tree), [Chakra/Ark](https://chakra-ui.com/docs/components/tree-view) (checked 2026-09-28).
- **drag-reorder**: [Untitled UI](https://www.untitledui.com/react/components/tree-views), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/TreeView), [Mantine](https://mantine.dev/core/tree), [Ant Design](https://ant.design/components/tree) (checked 2026-09-28).
- **async-loading**: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/TreeView), [Primer](https://primer.style/product/components/tree-view/), [Mantine](https://mantine.dev/core/tree), [Ant Design](https://ant.design/components/tree), [Chakra/Ark](https://chakra-ui.com/docs/components/tree-view) (checked 2026-09-28).
- **typeahead**: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/TreeView), [Primer](https://primer.style/product/components/tree-view/), [Chakra/Ark](https://chakra-ui.com/docs/components/tree-view) (checked 2026-09-28).
- **arrow-navigation**: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/TreeView), [Primer](https://primer.style/product/components/tree-view/), [Carbon](https://carbondesignsystem.com/components/tree-view/usage/) (checked 2026-09-28).
- **search-filter**: [Mantine](https://mantine.dev/core/tree), [Ant Design](https://ant.design/components/tree) (checked 2026-09-28).
- **checkbox-cascade**: [Mantine](https://mantine.dev/core/tree), [Ant Design](https://ant.design/components/tree) (checked 2026-09-28).
- **virtualization**: [Ant Design](https://ant.design/components/tree) (checked 2026-09-28).
- **keyboard-navigation**: [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/outline-views) (checked 2026-09-28).

## Area today

Navigation and checkbox modes; flat DOM with ARIA levels, counts/status, row actions and disabled skipping. Controlled/initial expansion and current item; no general multiselect modifier contract, lazy data, drag, filtering or virtualization in the spec. [Baseline spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/tree-view.md#L1).

- Exact manifest axes: selectionMode = navigation, checkbox. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L180-L186).
- Boolean modifiers: none declared. Runtime state hooks: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L180-L186).
- Slots: chevron, check, icon, label, trailing, actions. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L180-L186).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **not found**: `disabled-behavior:all`, `disabled-behavior:selection`, `interaction:async-loading`, `interaction:checkbox-cascade`, `interaction:drag-reorder`, `interaction:keyboard-navigation`, `interaction:search-filter`, `interaction:virtualization`, `selection-style:checkbox`, `selection-style:highlight`, `selection:none`, `selection:single`, `size:md`, `size:sm`, `size:xs`, `structure:avatars`, `structure:columns`, `structure:connector-lines`, `structure:descriptions`, `structure:full-width-row`, `variant:solid`, `variant:subtle`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L180-L186); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/tree-view.md#L1-L164).
- **partial**: `selection:multiple`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L180-L186); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/tree-view.md#L1-L164).
- **yes**: `interaction:arrow-navigation`, `interaction:collapse-expand`, `interaction:multiple-selection`, `interaction:typeahead`, `selectionMode:checkbox`, `selectionMode:navigation`, `state:disabled`, `structure:checkboxes`, `structure:icons`, `structure:row-actions`, `structure:trailing-content`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L180-L186); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/tree-view.md#L1-L164).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 0 direct systems. Direct: none verified as a direct implementation/example. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L180-L186), [2](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/tree-view.md#L1).
  - Individual options: `selectionMode:navigation` (0 direct; Area: yes); `selectionMode:checkbox` (0 direct; Area: yes).
- **Layer 2 · Separate checkbox and modifier-key selection modes** — 6 direct systems. Direct: Ant Design, Chakra/Ark, Fluent 2, Mantine, React Aria / Spectrum 2, Untitled UI. Existing checkbox mode is not proof of shift/range-selection support. Evidence: [1](https://ant.design/components/tree), [2](https://chakra-ui.com/docs/components/tree-view), [3](https://fluent2.microsoft.design/components/web/react/core/tree/usage), [4](https://mantine.dev/core/tree), [5](https://react-spectrum.adobe.com/TreeView), [6](https://www.untitledui.com/react/components/tree-views).
  - Individual options: `selection:multiple` (6 direct; Area: partial); `structure:checkboxes` (5 direct; Area: yes).
- **Layer 2 · Lazy children, loading and failure recovery** — 5 direct systems. Direct: Ant Design, Chakra/Ark, Mantine, Primer, React Aria / Spectrum 2. Define loading ownership and focus stability before adding virtualized trees. Evidence: [1](https://ant.design/components/tree), [2](https://chakra-ui.com/docs/components/tree-view), [3](https://mantine.dev/core/tree), [4](https://primer.style/product/components/tree-view/), [5](https://react-spectrum.adobe.com/TreeView).
  - Individual options: `interaction:async-loading` (5 direct; Area: not found).
- **Layer 3 · Drag handles and keyboard-equivalent reordering** — 4 direct systems. Direct: Ant Design, Mantine, React Aria / Spectrum 2, Untitled UI. Build on PropertyList’s accessibility contract, extended to hierarchy and drop targets. Evidence: [1](https://ant.design/components/tree), [2](https://mantine.dev/core/tree), [3](https://react-spectrum.adobe.com/TreeView), [4](https://www.untitledui.com/react/components/tree-views).
  - Individual options: `interaction:drag-reorder` (4 direct; Area: not found).
- **Layer 3 · Connector lines and rich identity rows** — 4 direct systems. Direct: Ant Design, Fluent 2, React Aria / Spectrum 2, Untitled UI. Offer optional row anatomy without changing indent semantics. Evidence: [1](https://ant.design/components/tree), [2](https://fluent2.microsoft.design/components/web/react/core/tree/usage), [3](https://react-spectrum.adobe.com/TreeView), [4](https://www.untitledui.com/react/components/tree-views).
  - Individual options: `structure:connector-lines` (2 direct; Area: not found); `structure:avatars` (1 direct; Area: not found); `structure:descriptions` (1 direct; Area: not found).

## Sources

- Area: [manifest, lines 180–186](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L180-L186); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/tree-view.md#L1). All Area judgments refer to starting commit `7dae828e7af1daf9d26b663d34335121156606f7`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: tree view, tree, outline view. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/tree-views); checked 2026-09-28.
- **shadcn/ui — not found**: checked [catalogue](https://ui.shadcn.com/docs/components) on 2026-09-28 for tree view, tree, outline view. No independently verified option recorded; see the audit for lookup limitations.
- **Radix Themes — not found**: checked [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) on 2026-09-28 for tree view, tree, outline view. No independently verified option recorded; see the audit for lookup limitations.
- **Base UI — not found**: checked [catalogue](https://base-ui.com/react/overview/quick-start) on 2026-09-28 for tree view, tree, outline view. No independently verified option recorded; see the audit for lookup limitations.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/TreeView); checked 2026-09-28.
- **Fluent 2**: [source 1](https://fluent2.microsoft.design/components/web/react/core/tree/usage); checked 2026-09-28.
- **Primer**: [source 1](https://primer.style/product/components/tree-view/); checked 2026-09-28.
- **Carbon**: [source 1](https://carbondesignsystem.com/components/tree-view/usage/); checked 2026-09-28.
- **Material 3 — not found**: checked [catalogue](https://m3.material.io/components) on 2026-09-28 for tree view, tree, outline view. No independently verified option recorded; see the audit for lookup limitations.
- **Mantine**: [source 1](https://mantine.dev/core/tree); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/tree); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/tree-view); checked 2026-09-28.
- **Atlassian — not found**: checked [catalogue](https://atlassian.design/components) on 2026-09-28 for tree view, tree, outline view. No independently verified option recorded; see the audit for lookup limitations.
- **Polaris — not found**: checked [catalogue](https://shopify.dev/docs/api/app-home/latest/web-components) on 2026-09-28 for tree view, tree, outline view. No independently verified option recorded; see the audit for lookup limitations.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for tree view, tree, outline view. No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG**: [source 1](https://developer.apple.com/design/human-interface-guidelines/outline-views); checked 2026-09-28.
  - Readable official data: [documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/outline-views.json). Platform guidance is counted separately.

Not found at option level (therefore omitted from counts): Untitled UI: row-actions; Fluent 2: arrow-navigation; Chakra/Ark: arrow-navigation. Looked in the corresponding component pages linked above; these omissions are evidence limits, not assertions of absent behavior.
