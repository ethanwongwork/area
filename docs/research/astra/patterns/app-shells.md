# App shells

Checked 2026-09-28. [Method, status meanings and priorities](README.md).

These are proposed Area recipes informed by the cited public examples and guidance. Anatomy is the proposed reading order; variations are candidates to offer, not a claim that every source implements them. Responsive behavior is an Area recommendation unless a source observation explicitly says otherwise. No dimensions are inferred from images.

Component availability is pinned to `18b86465d542f620d532fee351c4f28d50c8ac3a`. `recipe` means reusable packaging is absent but the baseline is composable; `partial` and `missing` identify additional shared behavior or adapters. Native headings, paragraphs, links, lists, forms and layout CSS remain valid building blocks.

<a id="sidebar-shell"></a>
## Sidebar application shell

**Purpose.** Keep global destinations and account context visible while a workspace changes.

**Anatomy, in order (proposal).**

1. Identity and workspace switch
2. Primary grouped navigation
3. Page heading and actions
4. Main workspace
5. Secondary help and account controls

**Required components → Area families.**

- Nav: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L652); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/nav.md#L56).
- Menu: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L558); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/menu.md#L61).
- Avatar: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L368); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/avatar.md#L173).
- Indicator: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L329); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/indicator.md#L147).
- Count: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L336); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/README-3.md#L105). The range survey explicitly excludes Count; its current availability is established by the pinned main manifest and spec.
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Breadcrumb: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L172); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/breadcrumb.md#L145).
- Separator: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L389); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/separator.md#L48).
- Panel: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L424); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/panel.md#L43).
- Sidebar recipe → Nav, Menu, Button: **recipe**. No named Sidebar export found. Compose Nav and ordinary landmarks; route/collapse persistence is recipe work. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L131); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/sidebar.md#L135).
- PageHeader recipe → Breadcrumb, Button, Badge: **recipe**. No named PageHeader export found. Compose a semantic heading, context and actions. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L131); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/page-header.md#L91).
- Responsive layout recipe → Panel, Card, Separator: **recipe**. No responsive layout family found. Native CSS and landmarks can implement each proposed arrangement; no breakpoint is prescribed here. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L131); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/responsive-layout.md#L111).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Expanded labeled sidebar.
- Collapsible icon rail (shadcn example; Fluent Nav disallows this).
- Inset content versus flush workspace.

**Extra requirements for expanded variants.**

- Drawer / Sheet — **partial**. Dialog and Panel exist; no dedicated edge-sheet presentation and responsive modality contract found. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/drawer.md#L139).

**Responsive proposal.** Replace the persistent sidebar with a named navigation disclosure or a separate navigation view; keep the active destination and return focus. A Drawer variant needs the separate gap below. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** The recipe owns routes, selected destination and open state. Compose ordinary landmarks and links; Nav is not a router.

**Source observations.**

- [shadcn — Blocks](https://ui.shadcn.com/blocks) (public-code-example; checked 2026-09-28). Featured examples include dashboard-01 (sidebar, summary cards, chart and table) and collapsible/sidebar submenu layouts.
- [Fluent — Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage) (component-guidance; checked 2026-09-28). Navigation sits beside content and becomes an overlay at narrow widths; this Nav explicitly does not support an icon-only layout.
- [Apple HIG — Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars) (platform-guidance; checked 2026-09-28). Sidebars consume space; support hiding and adaptive navigation while keeping the hierarchy understandable. Read via [official documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/sidebars.json).
- [Primer — Navigation](https://primer.style/product/ui-patterns/navigation/) (guidance; checked 2026-09-28). Navigation guidance complements layout guidance; use the responsive sidebar section for narrow navigation.

<a id="topnav-shell"></a>
## Top navigation application shell

**Purpose.** Give a shallow destination hierarchy a broad content canvas.

**Anatomy, in order (proposal).**

1. Brand and global navigation
2. Search and account actions
3. Local navigation
4. Page heading
5. Main content
6. Footer links

**Required components → Area families.**

- Nav: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L652); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/nav.md#L56).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Menu: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L558); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/menu.md#L61).
- Avatar: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L368); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/avatar.md#L173).
- Tabs: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L593); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/tabs.md#L64).
- Breadcrumb: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L172); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/breadcrumb.md#L145).
- Separator: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L389); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/separator.md#L48).
- PageHeader recipe → Breadcrumb, Button, Badge: **recipe**. No named PageHeader export found. Compose a semantic heading, context and actions. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L131); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/page-header.md#L91).
- Responsive layout recipe → Panel, Card, Separator: **recipe**. No responsive layout family found. Native CSS and landmarks can implement each proposed arrangement; no breakpoint is prescribed here. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L131); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/responsive-layout.md#L111).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Global links only.
- Global links plus local tabs.
- Header navigation with a contextual side pane.

**Extra requirements for expanded variants.**

- Drawer / Sheet — **partial**. Dialog and Panel exist; no dedicated edge-sheet presentation and responsive modality contract found. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/drawer.md#L139).

**Responsive proposal.** Allow local navigation to scroll or disclose overflow; move global links behind a labeled trigger before labels collide. Preserve navigation order. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Use Nav for routes and Tabs only for same-page panels. Overflow and route state belong to the recipe.

**Source observations.**

- [Primer — Layout](https://primer.style/product/getting-started/foundations/layout/) (guidance; checked 2026-09-28). Defines header, content, supporting panes and footer; narrow list-detail views can become separate pages, auxiliary panes can become sheets, and summaries can stack.
- [Untitled UI — Settings with header navigation](https://www.untitledui.com/react/components/settings-pages-02) (public-examples; checked 2026-09-28). Offers a horizontal app-header alternative for the settings page collection.

<a id="split-pane-editor"></a>
## Split-pane document workspace

**Purpose.** Keep a document outline beside the active document or preview.

**Anatomy, in order (proposal).**

1. Document heading and save status
2. Command toolbar
3. Outline or resource pane
4. Editing or preview pane
5. Contextual status

**Required components → Area families.**

- TreeView: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L180); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/tree-view.md#L45).
- Toolbar: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L76); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/toolbar.md#L42).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Panel: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L424); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/panel.md#L43).
- Tabs: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L593); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/tabs.md#L64).
- CodeBlock: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L641); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/code-block.md#L89).
- Badge: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L316); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/badge.md#L181).
- General Splitter → Panel: **partial**. Panel already has keyboard/pointer resizing. A general coordinated multi-pane splitter is not found; do not rebuild Panel resizing. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L131); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/splitter.md#L98).
- Code editor integration → CodeBlock, Toolbar, Textarea: **missing**. No syntax-aware editing engine found. CodeBlock is display and Textarea is native text entry. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L136); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/code-editor.md#L29).
- Responsive layout recipe → Panel, Card, Separator: **recipe**. No responsive layout family found. Native CSS and landmarks can implement each proposed arrangement; no breakpoint is prescribed here. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L131); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/responsive-layout.md#L111).

**What Area lacks for this baseline.** General Splitter; Code editor integration. Existing controls cover only the reuses listed above.

**Common variations to catalogue.**

- Source and preview.
- Outline and rich document.
- List and selected document.

**Extra requirements for expanded variants.**

- Rich-text editor integration — **missing**. No rich-document editing engine found; formatting surfaces do not provide schema, selection or undo. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/rich-text-editor.md#L58).

**Responsive proposal.** Show the active document on narrow screens and open the outline as a separate view; retain selection and edits when the pane returns. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** This editing version needs an editor adapter and coordinated pane behavior. A read-only CodeBlock preview is a smaller recipe, not an editor.

**Source observations.**

- [Primer — Layout](https://primer.style/product/getting-started/foundations/layout/) (guidance; checked 2026-09-28). Defines header, content, supporting panes and footer; narrow list-detail views can become separate pages, auxiliary panes can become sheets, and summaries can stack.
- [Material — Canonical layouts (official Android guidance)](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) (platform-guidance; checked 2026-09-28). Material-derived list-detail, feed and supporting-pane layouts preserve state as panes change visibility; editor tools and document comments are supporting-pane examples.
- [Carbon — Text toolbar](https://carbondesignsystem.com/patterns/text-toolbar-pattern/) (guidance; checked 2026-09-28). Formatting commands can be grouped into text toolbars; this guidance does not supply a document editing engine.

<a id="ide-workspace"></a>
## IDE-like workspace

**Purpose.** Coordinate project hierarchy, documents, tools and feedback around a focused editing task.

**Anatomy, in order (proposal).**

1. Workspace command bar
2. Project tree
3. Open-document navigation
4. Editor and preview
5. Supporting inspector
6. Problems or output region

**Required components → Area families.**

- Toolbar: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L76); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/toolbar.md#L42).
- TreeView: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L180); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/tree-view.md#L45).
- Tabs: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L593); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/tabs.md#L64).
- Panel: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L424); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/panel.md#L43).
- CommandPalette: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L492); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/command-palette.md#L153).
- ContextMenu: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L484); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/context-menu.md#L253).
- Kbd: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L670); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/kbd.md#L103).
- CodeBlock: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L641); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/code-block.md#L89).
- Badge: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L316); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/badge.md#L181).
- General Splitter → Panel: **partial**. Panel already has keyboard/pointer resizing. A general coordinated multi-pane splitter is not found; do not rebuild Panel resizing. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L131); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/splitter.md#L98).
- Code editor integration → CodeBlock, Toolbar, Textarea: **missing**. No syntax-aware editing engine found. CodeBlock is display and Textarea is native text entry. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L136); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/code-editor.md#L29).
- Responsive layout recipe → Panel, Card, Separator: **recipe**. No responsive layout family found. Native CSS and landmarks can implement each proposed arrangement; no breakpoint is prescribed here. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L131); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/responsive-layout.md#L111).

**What Area lacks for this baseline.** General Splitter; Code editor integration. Existing controls cover only the reuses listed above.

**Common variations to catalogue.**

- Document plus inspector.
- Document plus output.
- Multiple document groups (new docking contract).

**Extra requirements for expanded variants.**

- Dockable inspector — **missing**. No docking, detach/reattach or pane-persistence engine found. Existing Panel is useful anatomy. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/dockable-inspector.md#L84).

**Responsive proposal.** Use one primary workspace at a time; expose project, output and inspector as explicit destinations. Do not shrink every pane into the same narrow viewport. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Proposed Area composition from supporting-pane guidance; a full IDE template was not found in these inspected pages. Docking, terminals and editor sessions are separate product work.

**Source observations.**

- [Material — Canonical layouts (official Android guidance)](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) (platform-guidance; checked 2026-09-28). Material-derived list-detail, feed and supporting-pane layouts preserve state as panes change visibility; editor tools and document comments are supporting-pane examples.
- [Apple HIG — Panels](https://developer.apple.com/design/human-interface-guidelines/panels) (platform-guidance; checked 2026-09-28). Inspector content follows the selection; panels or split panes can expose adjustments. This is native platform guidance, not a web component contract. Read via [official documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/panels.json).
- [Primer — Layout](https://primer.style/product/getting-started/foundations/layout/) (guidance; checked 2026-09-28). Defines header, content, supporting panes and footer; narrow list-detail views can become separate pages, auxiliary panes can become sheets, and summaries can stack.
