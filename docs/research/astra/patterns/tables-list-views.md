# Tables and list views

Checked 2026-09-28. [Method, status meanings and priorities](README.md).

These are proposed Area recipes informed by the cited public examples and guidance. Anatomy is the proposed reading order; variations are candidates to offer, not a claim that every source implements them. Responsive behavior is an Area recommendation unless a source observation explicitly says otherwise. No dimensions are inferred from images.

Component availability is pinned to `18b86465d542f620d532fee351c4f28d50c8ac3a`. `recipe` means reusable packaging is absent but the baseline is composable; `partial` and `missing` identify additional shared behavior or adapters. Native headings, paragraphs, links, lists, forms and layout CSS remain valid building blocks.

<a id="resource-table"></a>
## Filterable resource table

**Purpose.** Find records, compare their attributes and act on a chosen set.

**Anatomy, in order (proposal).**

1. Collection title and count
2. Search, filters and sort
3. Applied filters
4. Selectable rows and row actions
5. Bulk-action bar
6. Pagination and result count

**Required components → Area families.**

- Table: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L603); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/table.md#L60).
- Input: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L143); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/input.md#L245).
- Combobox: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L501); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/combobox.md#L405).
- Chip: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L291); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/chip.md#L213).
- Checkbox: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L224); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/checkbox.md#L315).
- Badge: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L316); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/badge.md#L181).
- Count: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L336); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/README-3.md#L105). The range survey explicitly excludes Count; its current availability is established by the pinned main manifest and spec.
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Menu: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L558); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/menu.md#L61).
- Toolbar: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L76); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/toolbar.md#L42).
- Skeleton: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L398); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/skeleton.md#L46).
- SearchField recipe → Input, Button, Kbd: **recipe**. Input supports native search entry. No specialized clear/shortcut/search lifecycle wrapper found. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L114); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/search-field.md#L97).
- Pagination recipe → Button, Select, Input: **recipe**. No named Pagination export found. Compose page links/buttons and summary text; query state and loading remain application-owned. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L124); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/pagination.md#L119).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Instant versus applied filters.
- Single versus multiple sort keys.
- Bulk selection of this page versus all results.

**Extra requirements for expanded variants.**

- MultiSelect / TagPicker — **partial**. Single-value Combobox and removable Chips exist; a combined multi-value focus, selection and async collection contract is not found. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/multi-select.md#L240).
- Drawer / Sheet — **partial**. Dialog and Panel exist; no dedicated edge-sheet presentation and responsive modality contract found. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/drawer.md#L139).
- DataGrid — **missing**. Table explicitly has no keyboard-grid or virtualization engine; editable/resizable grid behavior needs an adapter. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/data-grid.md#L223).

**Responsive proposal.** Keep native table relationships in a labeled scroll region; move secondary filters into a separate disclosure. A stacked row view needs explicit label repetition. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Table supplies native markup and presentation. Filtering, stable sorting, page state, selection scope and bulk execution are app logic; virtualized cell editing requires DataGrid.

**Source observations.**

- [Polaris — Index table](https://shopify.dev/docs/api/app-home/latest/patterns/compositions/index-table) (composition; checked 2026-09-28). Resource collection composition with search, filters, sort and bulk actions.
- [Carbon — Data table usage](https://carbondesignsystem.com/components/data-table/usage/) (component-guidance; checked 2026-09-28). Table compositions include toolbar search, sorting, selection, batch actions and pagination.
- [Carbon — Filtering](https://carbondesignsystem.com/patterns/filtering/) (guidance; checked 2026-09-28). Separates single and multiple selection, categories, instant and applied filters; active filters need a visible indication and a reset path.

<a id="resource-list"></a>
## Selectable resource list

**Purpose.** Scan same-type objects whose identity matters more than column comparison.

**Anatomy, in order (proposal).**

1. List heading and count
2. Query and view controls
3. Identity, metadata and status rows
4. Row or bulk actions
5. Continuation controls

**Required components → Area families.**

- Avatar: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L368); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/avatar.md#L173).
- Indicator: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L329); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/indicator.md#L147).
- Badge: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L316); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/badge.md#L181).
- Checkbox: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L224); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/checkbox.md#L315).
- Input: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L143); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/input.md#L245).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Menu: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L558); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/menu.md#L61).
- Count: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L336); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/README-3.md#L105). The range survey explicitly excludes Count; its current availability is established by the pinned main manifest and spec.
- Separator: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L389); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/separator.md#L48).
- Selectable List → Checkbox, Avatar, Button: **partial**. Native lists, links and checkboxes are composable; no managed selectable collection/ListBox family found. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L127); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/selectable-list.md#L164).
- Pagination recipe → Button, Select, Input: **recipe**. No named Pagination export found. Compose page links/buttons and summary text; query state and loading remain application-owned. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L124); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/pagination.md#L119).

**What Area lacks for this baseline.** Selectable List. Existing controls cover only the reuses listed above.

**Common variations to catalogue.**

- Simple links.
- Checkbox multi-selection.
- Rich rows with preview and status.

**Responsive proposal.** Wrap metadata under the item title and preserve a single primary target; move secondary actions to a named menu. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** An ordinary list with links and checkboxes is composable now. A reusable selectable collection with managed keyboard focus remains a gap.

**Source observations.**

- [Polaris — Resource list](https://shopify.dev/docs/api/app-home/latest/patterns/compositions/resource-list) (composition; checked 2026-09-28). A collection of same-type resources is presented as repeatable rows.
- [Carbon — Filtering](https://carbondesignsystem.com/patterns/filtering/) (guidance; checked 2026-09-28). Separates single and multiple selection, categories, instant and applied filters; active filters need a visible indication and a reset path.

<a id="resource-cards"></a>
## Resource gallery and list switch

**Purpose.** Browse visual resources while retaining search and filtering.

**Anatomy, in order (proposal).**

1. Collection heading
2. Query, filters and view switch
3. Repeated cards or rows
4. Item metadata and actions
5. Empty state or continuation

**Required components → Area families.**

- Card: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L520); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/card.md#L235).
- Avatar: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L368); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/avatar.md#L173).
- Badge: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L316); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/badge.md#L181).
- Chip: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L291); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/chip.md#L213).
- Input: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L143); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/input.md#L245).
- Segmented: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L621); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/segmented.md#L55).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Menu: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L558); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/menu.md#L61).
- Skeleton: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L398); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/skeleton.md#L46).
- EmptyState recipe → Card, Button: **recipe**. No named EmptyState export found. Headings, explanation and a useful action are composable. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L133); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/empty-state.md#L100).
- Pagination recipe → Button, Select, Input: **recipe**. No named Pagination export found. Compose page links/buttons and summary text; query state and loading remain application-owned. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L124); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/pagination.md#L119).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Cards.
- Compact rows.
- Featured item with secondary grid.

**Extra requirements for expanded variants.**

- Selectable List — **partial**. Native lists, links and checkboxes are composable; no managed selectable collection/ListBox family found. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/selectable-list.md#L164).

**Responsive proposal.** Reduce columns as space narrows; keep the same resource order and query when switching views. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Proposed Area adaptation of feed and resource-list guidance. Card selection across a collection is extra behavior; ordinary links work for a read-only showcase.

**Source observations.**

- [Material — Canonical layouts (official Android guidance)](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) (platform-guidance; checked 2026-09-28). Material-derived list-detail, feed and supporting-pane layouts preserve state as panes change visibility; editor tools and document comments are supporting-pane examples.
- [Polaris — Resource list](https://shopify.dev/docs/api/app-home/latest/patterns/compositions/resource-list) (composition; checked 2026-09-28). A collection of same-type resources is presented as repeatable rows.

<a id="editable-grid"></a>
## Editable data workspace

**Purpose.** Edit structured values in place across a substantial dataset.

**Anatomy, in order (proposal).**

1. Dataset heading
2. Saved views and filters
3. Column headings and controls
4. Editable cell grid
5. Selection actions
6. Paging or loading status

**Required components → Area families.**

- Table: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L603); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/table.md#L60).
- Field: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L133); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/field.md#L245).
- Input: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L143); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/input.md#L245).
- NumberField: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L153); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/number-field.md#L48).
- Checkbox: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L224); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/checkbox.md#L315).
- Select: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L213); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/select.md#L74).
- Menu: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L558); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/menu.md#L61).
- Toolbar: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L76); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/toolbar.md#L42).
- DataGrid → Table, Checkbox, Input, Menu: **missing**. Table explicitly has no keyboard-grid or virtualization engine; editable/resizable grid behavior needs an adapter. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L134); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/data-grid.md#L223).
- Pagination recipe → Button, Select, Input: **recipe**. No named Pagination export found. Compose page links/buttons and summary text; query state and loading remain application-owned. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L124); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/pagination.md#L119).

**What Area lacks for this baseline.** DataGrid. Existing controls cover only the reuses listed above.

**Common variations to catalogue.**

- Read-only grid.
- Spreadsheet editing.
- Hierarchical tree grid (additional contract).

**Extra requirements for expanded variants.**

- TreeGrid — **missing**. No hierarchical grid contract found. Table and TreeView are not interchangeable with a TreeGrid. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/tree-grid.md#L99).

**Responsive proposal.** Retain a scrollable grid with a visible active-cell position; offer record-level editing as a narrow-screen alternative. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** The advanced editing/grid variant is an Area proposal extending collection examples. Table is not a keyboard grid, resizing or virtualization engine; select an adapter before implementation.

**Source observations.**

- [Carbon — Data table usage](https://carbondesignsystem.com/components/data-table/usage/) (component-guidance; checked 2026-09-28). Table compositions include toolbar search, sorting, selection, batch actions and pagination.
- [Polaris — Index table](https://shopify.dev/docs/api/app-home/latest/patterns/compositions/index-table) (composition; checked 2026-09-28). Resource collection composition with search, filters, sort and bulk actions.
