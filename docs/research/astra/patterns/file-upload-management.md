# File upload and management

Checked 2026-09-28. [Method, status meanings and priorities](README.md).

These are proposed Area recipes informed by the cited public examples and guidance. Anatomy is the proposed reading order; variations are candidates to offer, not a claim that every source implements them. Responsive behavior is an Area recommendation unless a source observation explicitly says otherwise. No dimensions are inferred from images.

Component availability is pinned to `18b86465d542f620d532fee351c4f28d50c8ac3a`. `recipe` means reusable packaging is absent but the baseline is composable; `partial` and `missing` identify additional shared behavior or adapters. Native headings, paragraphs, links, lists, forms and layout CSS remain valid building blocks.

<a id="upload-queue"></a>
## File upload and transfer queue

**Purpose.** Choose files, understand validation and follow each transfer to completion.

**Anatomy, in order (proposal).**

1. Upload task heading
2. File picker and optional drop area
3. Requirements and help
4. Per-file queue
5. Progress, retry, remove and cancel
6. Completion

**Required components → Area families.**

- Field: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L133); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/field.md#L245).
- Input: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L143); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/input.md#L245).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Card: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L520); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/card.md#L235).
- Progress: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L415); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/progress.md#L67).
- Spinner: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L407); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/spinner.md#L58).
- Alert: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L532); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/alert.md#L189).
- FileUpload / DropZone → Input, Button, Progress, Alert: **missing**. Native file selection can use Input, but a reusable drop zone, file validation and per-file lifecycle contract are not found. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L115); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/file-upload.md#L142).
- AttachmentCard recipe → Card, Progress, Button: **recipe**. No standalone AttachmentCard found. File identity/progress can compose existing controls; actual upload is a separate dependency. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L182); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/attachment-card.md#L64).

**What Area lacks for this baseline.** FileUpload / DropZone. Existing controls cover only the reuses listed above.

**Common variations to catalogue.**

- Single file.
- Multiple queued files.
- Inline attachment upload.

**Responsive proposal.** Keep a conventional file-picker action available; wrap names and put progress below identity instead of compressing all status into one row. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** File validation, transfer cancellation, resumability and server acceptance are additional contracts. Drag-and-drop must not be the sole entry method.

**Source observations.**

- [GOV.UK — File upload](https://design-system.service.gov.uk/components/file-upload/) (component-guidance; checked 2026-09-28). Labeled file selection with help and error treatment is the foundation of a file-submission flow.
- [Untitled UI — File uploaders](https://www.untitledui.com/react/components/file-uploaders) (public-examples; checked 2026-09-28). File selection/drop areas and file-state rows offer the visual basis for an upload queue.

<a id="file-browser"></a>
## File and folder manager

**Purpose.** Find, organize and act on files without losing folder context.

**Anatomy, in order (proposal).**

1. Folder hierarchy
2. Path and current folder
3. Search, sorting and view choice
4. File rows or tiles
5. Selection and context actions
6. Details or preview

**Required components → Area families.**

- TreeView: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L180); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/tree-view.md#L45).
- Breadcrumb: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L172); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/breadcrumb.md#L145).
- Input: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L143); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/input.md#L245).
- Segmented: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L621); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/segmented.md#L55).
- Table: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L603); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/table.md#L60).
- Card: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L520); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/card.md#L235).
- Checkbox: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L224); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/checkbox.md#L315).
- Menu: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L558); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/menu.md#L61).
- ContextMenu: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L484); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/context-menu.md#L253).
- Badge: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L316); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/badge.md#L181).
- Selectable List → Checkbox, Avatar, Button: **partial**. Native lists, links and checkboxes are composable; no managed selectable collection/ListBox family found. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L127); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/selectable-list.md#L164).
- Pagination recipe → Button, Select, Input: **recipe**. No named Pagination export found. Compose page links/buttons and summary text; query state and loading remain application-owned. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L124); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/pagination.md#L119).
- Media preview integration → Dialog, Button, Panel: **missing**. No general file/media preview engine found. Native images and text can be composed; arbitrary document preview and zoom require an adapter. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L136); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/media-preview.md#L68).

**What Area lacks for this baseline.** Selectable List; Media preview integration. Existing controls cover only the reuses listed above.

**Common variations to catalogue.**

- Table view.
- Thumbnail grid.
- Folder tree plus details.
- Preview side pane.

**Extra requirements for expanded variants.**

- FileUpload / DropZone — **missing**. Native file selection can use Input, but a reusable drop zone, file validation and per-file lifecycle contract are not found. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/file-upload.md#L142).
- General Splitter — **partial**. Panel already has keyboard/pointer resizing. A general coordinated multi-pane splitter is not found; do not rebuild Panel resizing. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/splitter.md#L98).

**Responsive proposal.** Navigate folders and preview as separate narrow views; keep path and selection when returning to the list. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Proposed Area file-manager composition; no complete file-manager template was found in these pages. File operations, thumbnail generation and authorization are product work.

**Source observations.**

- [Material — Canonical layouts (official Android guidance)](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) (platform-guidance; checked 2026-09-28). Material-derived list-detail, feed and supporting-pane layouts preserve state as panes change visibility; editor tools and document comments are supporting-pane examples.
- [Polaris — Resource list](https://shopify.dev/docs/api/app-home/latest/patterns/compositions/resource-list) (composition; checked 2026-09-28). A collection of same-type resources is presented as repeatable rows.
- [Untitled UI — File uploaders](https://www.untitledui.com/react/components/file-uploaders) (public-examples; checked 2026-09-28). File selection/drop areas and file-state rows offer the visual basis for an upload queue.

<a id="file-preview"></a>
## File preview and metadata

**Purpose.** Inspect a file before opening, downloading or sharing it.

**Anatomy, in order (proposal).**

1. File name and type
2. Preview surface
3. Preview navigation or zoom
4. Metadata
5. Download/share actions
6. Close or return

**Required components → Area families.**

- Dialog: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L541); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/dialog.md#L257).
- Panel: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L424); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/panel.md#L43).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Toolbar: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L76); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/toolbar.md#L42).
- Badge: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L316); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/badge.md#L181).
- Code: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L632); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/code.md#L95).
- Media preview integration → Dialog, Button, Panel: **missing**. No general file/media preview engine found. Native images and text can be composed; arbitrary document preview and zoom require an adapter. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L136); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/media-preview.md#L68).
- DescriptionList recipe → Badge, Code: **recipe**. No dedicated DescriptionList found. Use native dl/dt/dd and existing value controls. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L133); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/description-list.md#L72).

**What Area lacks for this baseline.** Media preview integration. Existing controls cover only the reuses listed above.

**Common variations to catalogue.**

- Image preview.
- Document preview.
- Unsupported-type fallback.

**Responsive proposal.** Let the preview use available width and move metadata below it; maintain obvious close/back controls while zoomed. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Proposed supporting-pane adaptation. Rendering arbitrary file types, zoom and download authorization require adapters; Dialog alone does not preview files.

**Source observations.**

- [Material — Canonical layouts (official Android guidance)](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) (platform-guidance; checked 2026-09-28). Material-derived list-detail, feed and supporting-pane layouts preserve state as panes change visibility; editor tools and document comments are supporting-pane examples.
- [Fluent — Drawer usage](https://fluent2.microsoft.design/components/web/react/core/drawer/usage) (component-guidance; checked 2026-09-28). Inline and overlay drawers differ; drawers provide supplemental context or short related tasks, with local status feedback.
