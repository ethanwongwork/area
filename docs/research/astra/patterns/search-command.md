# Search and command

Checked 2026-09-28. [Method, status meanings and priorities](README.md).

These are proposed Area recipes informed by the cited public examples and guidance. Anatomy is the proposed reading order; variations are candidates to offer, not a claim that every source implements them. Responsive behavior is an Area recommendation unless a source observation explicitly says otherwise. No dimensions are inferred from images.

Component availability is pinned to `18b86465d542f620d532fee351c4f28d50c8ac3a`. `recipe` means reusable packaging is absent but the baseline is composable; `partial` and `missing` identify additional shared behavior or adapters. Native headings, paragraphs, links, lists, forms and layout CSS remain valid building blocks.

<a id="search-results"></a>
## Search results with facets

**Purpose.** Find content across a collection and narrow ambiguous results.

**Anatomy, in order (proposal).**

1. Search heading and query
2. Scope and facet controls
3. Result count and applied filters
4. Results with contextual snippets
5. Pagination or no-result guidance

**Required components → Area families.**

- Input: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L143); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/input.md#L245).
- Combobox: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L501); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/combobox.md#L405).
- Chip: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L291); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/chip.md#L213).
- Count: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L336); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/README-3.md#L105). The range survey explicitly excludes Count; its current availability is established by the pinned main manifest and spec.
- Checkbox: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L224); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/checkbox.md#L315).
- Card: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L520); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/card.md#L235).
- Badge: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L316); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/badge.md#L181).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Skeleton: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L398); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/skeleton.md#L46).
- SearchField recipe → Input, Button, Kbd: **recipe**. Input supports native search entry. No specialized clear/shortcut/search lifecycle wrapper found. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L114); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/search-field.md#L97).
- Pagination recipe → Button, Select, Input: **recipe**. No named Pagination export found. Compose page links/buttons and summary text; query state and loading remain application-owned. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L124); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/pagination.md#L119).
- EmptyState recipe → Card, Button: **recipe**. No named EmptyState export found. Headings, explanation and a useful action are composable. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L133); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/empty-state.md#L100).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Global search.
- Collection-local search.
- Facets with immediate or applied updates.

**Extra requirements for expanded variants.**

- MultiSelect / TagPicker — **partial**. Single-value Combobox and removable Chips exist; a combined multi-value focus, selection and async collection contract is not found. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/multi-select.md#L240).
- Drawer / Sheet — **partial**. Dialog and Panel exist; no dedicated edge-sheet presentation and responsive modality contract found. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/drawer.md#L139).

**Responsive proposal.** Move long facets into a separate filter view while leaving the active query and filter count visible. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Search ranking, async requests and result highlighting are app-owned. Combobox has a bounded selection contract; rich multi-value async filters are extra work.

**Source observations.**

- [Carbon — Search](https://carbondesignsystem.com/patterns/search-pattern/) (guidance; checked 2026-09-28). Search guidance covers scoped discovery and results; a search surface is distinct from its data retrieval service.
- [Carbon — Filtering](https://carbondesignsystem.com/patterns/filtering/) (guidance; checked 2026-09-28). Separates single and multiple selection, categories, instant and applied filters; active filters need a visible indication and a reset path.

<a id="command-surface"></a>
## Command palette

**Purpose.** Find and run available commands without traversing navigation.

**Anatomy, in order (proposal).**

1. Keyboard or button trigger
2. Query field
3. Grouped command results
4. Shortcut hints
5. Empty result and keyboard guidance

**Required components → Area families.**

- CommandPalette: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L492); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/command-palette.md#L153).
- Kbd: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L670); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/kbd.md#L103).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Global actions.
- Context-specific commands.
- Recent commands ahead of search results.

**Responsive proposal.** Keep results and query in a viewport-fitting modal; preserve a reachable dismissal control and avoid hiding active options behind the keyboard. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** CommandPalette is built. Command definitions, permissions, history and application shortcut registration remain recipe logic; nested command workflows are not assumed.

**Source observations.**

- [Untitled UI — Command menus](https://www.untitledui.com/react/components/command-menus) (public-examples; checked 2026-09-28). Command search examples support grouped discovery of actions.
