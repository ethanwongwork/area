# Table — library range

Baseline `7dae828e7af1daf9d26b663d34335121156606f7` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Presents rows of structured data. [Area manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L603-L611).

Boundary: Semantic table, sm/md/lg cell insets, interactive/striped/columnDividers and numeric/fit cells. Sorting, selection, empty and loading are compositions. No grid keyboard, resizing, editing or virtualization engine. [Area spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/table.md#L1).

## Variant axes

- **Untitled UI** (example): size: sm, md; state: empty, error, offline. [Source](https://www.untitledui.com/react/components/tables) (checked 2026-09-28).
- **Radix Themes** (component): variant: surface, ghost; size: 1, 2, 3. [Source](https://www.radix-ui.com/themes/docs/components/table) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): density: compact, regular, spacious; overflow: wrap, truncate; quiet: false, true; selection: none, single, multiple; selection-style: checkbox, highlight. [Source](https://react-spectrum.adobe.com/TableView) (checked 2026-09-28).
- **Fluent 2** (component): size: extra-small, small, medium; native-elements: true, false. [Source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-table/library/src/components/Table/Table.types.ts) (checked 2026-09-28).
- **Primer** (component): cell-padding: condensed, normal, spacious. [Source](https://primer.style/product/components/data-table/) (checked 2026-09-28).
- **Carbon** (component): size: extra-small, small, medium, large, extra-large. [Source](https://carbondesignsystem.com/components/data-table/usage/) (checked 2026-09-28).
- **Mantine** (component): variant: default, vertical; stripe: odd, even. [Source](https://mantine.dev/core/table) (checked 2026-09-28).
- **Ant Design** (component): size: small, medium, large; state: loading. [Source](https://ant.design/components/table) (checked 2026-09-28).
- **Chakra/Ark** (component): variant: line, outline; size: sm, md, lg; stripe: false, true. [Source](https://chakra-ui.com/docs/components/table) (checked 2026-09-28).
- **Atlassian** (component): state: loading, empty. [Source](https://atlassian.design/components/dynamic-table/examples) (checked 2026-09-28).
- **Polaris** (component): variant: auto, list; state: loading. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/table) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (example): header, footer, checkbox-column, avatars, row-actions. [Source](https://www.untitledui.com/react/components/tables) (checked 2026-09-28).
- **shadcn/ui** (component): header, footer, caption, horizontal-scroll. [Source](https://ui.shadcn.com/docs/components/table) (checked 2026-09-28).
- **shadcn/ui** (recipe): checkbox-column, pagination, column-menu. [Source](https://ui.shadcn.com/docs/components/data-table) (checked 2026-09-28).
- **Radix Themes** (component): header, row-header. [Source](https://www.radix-ui.com/themes/docs/components/table) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): checkbox-column, nested-rows, resizable-columns, row-actions. [Source](https://react-spectrum.adobe.com/TableView) (checked 2026-09-28).
- **Primer** (component): header, row-actions, pagination. [Source](https://primer.style/product/components/data-table/) (checked 2026-09-28).
- **Carbon** (component): header, checkbox-column, radio-column, expandable-rows, batch-toolbar, pagination. [Source](https://carbondesignsystem.com/components/data-table/usage/) (checked 2026-09-28).
- **Mantine** (component): header, footer, caption, horizontal-scroll, sticky-header, checkbox-column, column-borders. [Source](https://mantine.dev/core/table) (checked 2026-09-28).
- **Ant Design** (component): header, footer, expandable-rows, nested-rows, checkbox-column, radio-column, fixed-columns, sticky-header, summary, pagination. [Source](https://ant.design/components/table) (checked 2026-09-28).
- **Chakra/Ark** (component): header, footer, caption, horizontal-scroll, sticky-header, fixed-columns, checkbox-column. [Source](https://chakra-ui.com/docs/components/table) (checked 2026-09-28).
- **Atlassian** (component): pagination, row-actions. [Source](https://atlassian.design/components/dynamic-table/examples) (checked 2026-09-28).
- **Polaris** (component): responsive-list, pagination. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/table) (checked 2026-09-28).
- **GOV.UK** (component): caption, row-header, numeric-cells. [Source](https://design-system.service.gov.uk/components/table/) (checked 2026-09-28).
- **Apple HIG** (guidance): row-actions, columns. [Source](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables) (checked 2026-09-28).

## Interaction patterns

- **row-selection**: [Untitled UI](https://www.untitledui.com/react/components/tables), [shadcn/ui](https://ui.shadcn.com/docs/components/data-table), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/TableView), [Primer](https://primer.style/product/components/data-table/), [Carbon](https://carbondesignsystem.com/components/data-table/usage/), [Mantine](https://mantine.dev/core/table), [Ant Design](https://ant.design/components/table), [Chakra/Ark](https://chakra-ui.com/docs/components/table), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables) (checked 2026-09-28).
- **pagination**: [Untitled UI](https://www.untitledui.com/react/components/tables) (checked 2026-09-28).
- **semantic-table**: [shadcn/ui](https://ui.shadcn.com/docs/components/table), [Radix Themes](https://www.radix-ui.com/themes/docs/components/table), [Mantine](https://mantine.dev/core/table), [Chakra/Ark](https://chakra-ui.com/docs/components/table), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/table), [GOV.UK](https://design-system.service.gov.uk/components/table/), [Fluent 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-table/library/src/components/Table/Table.types.ts) (checked 2026-09-28).
- **sort**: [shadcn/ui](https://ui.shadcn.com/docs/components/data-table), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/TableView), [Primer](https://primer.style/product/components/data-table/), [Carbon](https://carbondesignsystem.com/components/data-table/usage/), [Ant Design](https://ant.design/components/table), [Atlassian](https://atlassian.design/components/dynamic-table/examples), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables), [Fluent 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-table/library/src/components/Table/Table.types.ts) (checked 2026-09-28).
- **search-filter**: [shadcn/ui](https://ui.shadcn.com/docs/components/data-table), [Carbon](https://carbondesignsystem.com/components/data-table/usage/), [Ant Design](https://ant.design/components/table) (checked 2026-09-28).
- **column-visibility**: [shadcn/ui](https://ui.shadcn.com/docs/components/data-table) (checked 2026-09-28).
- **drag-reorder**: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/TableView), [Atlassian](https://atlassian.design/components/dynamic-table/examples) (checked 2026-09-28).
- **async-loading**: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/TableView) (checked 2026-09-28).
- **keyboard-grid**: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/TableView) (checked 2026-09-28).
- **virtualization-recipe**: [Mantine](https://mantine.dev/core/table) (checked 2026-09-28).
- **virtualization**: [Ant Design](https://ant.design/components/table) (checked 2026-09-28).
- **editable-cells-recipe**: [Ant Design](https://ant.design/components/table) (checked 2026-09-28).
- **drag-reorder-recipe**: [Ant Design](https://ant.design/components/table) (checked 2026-09-28).

## Area today

Semantic table, sm/md/lg cell insets, interactive/striped/columnDividers and numeric/fit cells. Sorting, selection, empty and loading are compositions. No grid keyboard, resizing, editing or virtualization engine. [Baseline spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/table.md#L1).

- Exact manifest axes: size = sm, md, lg. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L603-L611).
- Boolean modifiers: interactive, striped, column-dividers. Runtime state hooks: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L603-L611).
- Slots: cell. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L603-L611).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `interaction:semantic-table`, `size:lg`, `size:md`, `size:sm`, `stripe:even`, `structure:caption`, `structure:column-borders`, `structure:footer`, `structure:header`, `structure:horizontal-scroll`, `structure:numeric-cells`, `structure:row-header`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L603-L611); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/table.md#L1-L183).
- **not found**: `cell-padding:condensed`, `cell-padding:normal`, `cell-padding:spacious`, `interaction:async-loading`, `interaction:column-visibility`, `interaction:drag-reorder`, `interaction:drag-reorder-recipe`, `interaction:editable-cells-recipe`, `interaction:keyboard-grid`, `interaction:pagination`, `interaction:search-filter`, `interaction:virtualization`, `interaction:virtualization-recipe`, `native-elements:false`, `native-elements:true`, `overflow:truncate`, `overflow:wrap`, `quiet:false`, `quiet:true`, `selection-style:checkbox`, `selection-style:highlight`, `selection:multiple`, `selection:none`, `selection:single`, `size:extra-large`, `size:extra-small`, `state:empty`, `state:error`, `state:loading`, `state:offline`, `stripe:false`, `stripe:odd`, `stripe:true`, `structure:avatars`, `structure:batch-toolbar`, `structure:column-menu`, `structure:columns`, `structure:expandable-rows`, `structure:fixed-columns`, `structure:nested-rows`, `structure:pagination`, `structure:radio-column`, `structure:resizable-columns`, `structure:responsive-list`, `structure:sticky-header`, `structure:summary`, `variant:auto`, `variant:default`, `variant:ghost`, `variant:line`, `variant:list`, `variant:outline`, `variant:surface`, `variant:vertical`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L603-L611); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/table.md#L1-L183).
- **composition**: `interaction:row-selection`, `interaction:sort`, `structure:checkbox-column`, `structure:row-actions`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L603-L611); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/table.md#L1-L183).
- **equivalent tier / geometry not asserted**: `size:1`, `size:2`, `size:3`, `size:large`, `size:medium`, `size:small`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L603-L611); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/table.md#L1-L183).
- **system-level / not this exact option**: `density:compact`, `density:regular`, `density:spacious`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L603-L611); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/table.md#L1-L183).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 2 direct systems. Direct: Chakra/Ark, Untitled UI. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L603-L611), [2](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/table.md#L1).
  - Individual options: `size:sm` (2 direct; Area: yes); `size:md` (2 direct; Area: yes); `size:lg` (1 direct; Area: yes).
- **Layer 3 · Sticky header and responsive list presentation** — 4 direct systems. Direct: Ant Design, Chakra/Ark, Mantine, Polaris. Useful range beyond scrolling; the list transformation needs an accessible reading-order contract. Evidence: [1](https://ant.design/components/table), [2](https://chakra-ui.com/docs/components/table), [3](https://mantine.dev/core/table), [4](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/table).
  - Individual options: `structure:sticky-header` (3 direct; Area: not found); `structure:responsive-list` (1 direct; Area: not found).
- **Layer 3 · Expandable detail rows and batch-action toolbar** — 2 direct systems. Direct: Ant Design, Carbon. Keep table semantics and compose the toolbar; distinguish nested rows from full TreeGrid. Evidence: [1](https://ant.design/components/table), [2](https://carbondesignsystem.com/components/data-table/usage/).
  - Individual options: `structure:expandable-rows` (2 direct; Area: not found); `structure:batch-toolbar` (1 direct; Area: not found).
- **Layer 2 · Plain versus contained outline surface** — 2 direct systems. Direct: Chakra/Ark, Radix Themes. Separate container treatment from stripes, row state and cell density. Evidence: [1](https://chakra-ui.com/docs/components/table), [2](https://www.radix-ui.com/themes/docs/components/table).
  - Individual options: `variant:ghost` (1 direct; Area: not found); `variant:surface` (1 direct; Area: not found); `variant:line` (1 direct; Area: not found); `variant:outline` (1 direct; Area: not found).
- **Layer 3 · DataGrid tier as a separate future job** — 2 direct systems. Direct: Ant Design, React Aria / Spectrum 2. Do not imply these are already Table variants; align with the backlog session. Evidence: [1](https://ant.design/components/table), [2](https://react-spectrum.adobe.com/TableView).
  - Individual options: `interaction:keyboard-grid` (1 direct; Area: not found); `structure:resizable-columns` (1 direct; Area: not found); `interaction:virtualization` (1 direct; Area: not found).

## Sources

- Area: [manifest, lines 603–611](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L603-L611); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/table.md#L1). All Area judgments refer to starting commit `7dae828e7af1daf9d26b663d34335121156606f7`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: table, data table, table view (grid features are a separate tier). The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/tables); checked 2026-09-28.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/data-table), [source 2](https://ui.shadcn.com/docs/components/table); checked 2026-09-28.
- **Radix Themes**: [source 1](https://www.radix-ui.com/themes/docs/components/table); checked 2026-09-28.
- **Base UI — not found**: checked [catalogue](https://base-ui.com/react/overview/quick-start) on 2026-09-28 for table, data table, table view (grid features are a separate tier). No independently verified option recorded; see the audit for lookup limitations.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/TableView); checked 2026-09-28.
- **Fluent 2**: [source 1](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-table/library/src/components/Table/Table.types.ts); checked 2026-09-28.
- **Primer**: [source 1](https://primer.style/product/components/data-table/); checked 2026-09-28.
- **Carbon**: [source 1](https://carbondesignsystem.com/components/data-table/usage/); checked 2026-09-28.
- **Material 3 — not found**: checked [catalogue](https://m3.material.io/components) on 2026-09-28 for table, data table, table view (grid features are a separate tier). No independently verified option recorded; see the audit for lookup limitations.
- **Mantine**: [source 1](https://mantine.dev/core/table); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/table); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/table); checked 2026-09-28.
- **Atlassian**: [source 1](https://atlassian.design/components/dynamic-table/examples); checked 2026-09-28.
- **Polaris**: [source 1](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/table); checked 2026-09-28.
- **GOV.UK**: [source 1](https://design-system.service.gov.uk/components/table/); checked 2026-09-28.
- **Apple HIG**: [source 1](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables); checked 2026-09-28.
  - Readable official data: [documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/lists-and-tables.json). Platform guidance is counted separately.

Not found at option level (therefore omitted from counts): Untitled UI: sort; Mantine: sort. Looked in the corresponding component pages linked above; these omissions are evidence limits, not assertions of absent behavior.
