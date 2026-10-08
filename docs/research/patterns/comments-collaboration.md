# Comments and collaboration

Checked 2026-09-28. [Method, status meanings and priorities](README.md).

These are proposed Area recipes informed by the cited public examples and guidance. Anatomy is the proposed reading order; variations are candidates to offer, not a claim that every source implements them. Responsive behavior is an Area recommendation unless a source observation explicitly says otherwise. No dimensions are inferred from images.

Component availability is pinned to `18b86465d542f620d532fee351c4f28d50c8ac3a`. `recipe` means reusable packaging is absent but the baseline is composable; `partial` and `missing` identify additional shared behavior or adapters. Native headings, paragraphs, links, lists, forms and layout CSS remain valid building blocks.

<a id="comment-thread"></a>
## Comment thread

**Purpose.** Discuss a specific object with attributable replies and visible actions.

**Anatomy, in order (proposal).**

1. Thread context
2. Author, time and edited status
3. Comment body
4. Reply/edit actions
5. Replies
6. Reply composer and submit feedback

**Required components → Area families.**

- Avatar: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L368); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/avatar.md#L173).
- Message: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L459); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/message.md#L33).
- Composer: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L188); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/composer.md#L83).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Menu: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L558); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/menu.md#L61).
- Badge: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L316); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/badge.md#L181).
- Separator: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L389); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/separator.md#L48).
- CommentThread recipe → Avatar, Message, Composer, Button: **recipe**. No standalone CommentThread found. Message, Avatar and Composer provide much of its anatomy; nesting and persistence remain recipe/app work. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L189); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/comment-thread.md#L75).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Flat replies.
- Nested replies.
- Resolved thread.
- Saving or failed reply.

**Extra requirements for expanded variants.**

- Reactions recipe — **recipe**. No named Reactions family found; fixed reaction choices can compose Chips/Buttons. A full emoji picker is additional scope. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/reactions.md#L64).
- PeoplePicker — **partial**. Basic single-person choice can use Combobox. Rich multi-person identity, invitation and async result contracts are not found. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/people-picker.md#L124).

**Responsive proposal.** Limit visual indentation on narrow screens while preserving reply relationships through text and controls. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Recipe reuses Message anatomy without claiming it implements threading. Persistence, permissions, resolution and optimistic rollback belong to the application.

**Source observations.**

- [Atlassian — Comment examples](https://atlassian.design/components/comment/examples) (component-examples; checked 2026-09-28). Author/avatar, time, edited marker, body and actions; examples include nested replies and saving feedback.
- [Untitled UI — Messaging](https://www.untitledui.com/react/components/messaging) (public-examples; checked 2026-09-28). Public examples name minimal, textarea and advanced message actions, reactions and image messages.

<a id="share-access"></a>
## Sharing and access management

**Purpose.** Review who has access and invite another person with a clear role.

**Anatomy, in order (proposal).**

1. Object and sharing scope
2. Invitee entry
3. Role choice
4. Existing access list
5. General link access
6. Copy or save feedback

**Required components → Area families.**

- Dialog: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L541); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/dialog.md#L257).
- Combobox: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L501); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/combobox.md#L405).
- Avatar: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L368); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/avatar.md#L173).
- Chip: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L291); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/chip.md#L213).
- Select: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L213); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/select.md#L74).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Menu: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L558); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/menu.md#L61).
- Alert: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L532); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/alert.md#L189).
- Toast: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L585); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/toast.md#L62).
- PeoplePicker → Combobox, Avatar, Chip: **partial**. Basic single-person choice can use Combobox. Rich multi-person identity, invitation and async result contracts are not found. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L188); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/people-picker.md#L124).

**What Area lacks for this baseline.** PeoplePicker. Existing controls cover only the reuses listed above.

**Common variations to catalogue.**

- Single-person invitation.
- Team access list.
- Link sharing.
- Role change or removal.

**Extra requirements for expanded variants.**

- MultiSelect / TagPicker — **partial**. Single-value Combobox and removable Chips exist; a combined multi-value focus, selection and async collection contract is not found. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/multi-select.md#L240).

**Responsive proposal.** Stack invitee entry and role controls; show long identities fully and use a full-page view if the access list becomes the main task. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Proposed access-management composition from team settings and restricted-comment examples. Permission enforcement and invite delivery are server responsibilities; rich multi-person picking remains partial.

**Source observations.**

- [Untitled UI — Settings page examples](https://www.untitledui.com/react/components/settings-pages) (public-examples; checked 2026-09-28). Public catalogue labels profile, team, password, appearance, billing, notifications and integrations pages; paid source was not accessed.
- [Atlassian — Comment examples](https://atlassian.design/components/comment/examples) (component-examples; checked 2026-09-28). Author/avatar, time, edited marker, body and actions; examples include nested replies and saving feedback.

<a id="review-comments"></a>
## Document review with comments

**Purpose.** Keep feedback connected to the content being reviewed.

**Anatomy, in order (proposal).**

1. Document heading and status
2. Main document
3. Comment anchors or selection
4. Supporting thread list
5. Active reply composer
6. Resolve or navigate actions

**Required components → Area families.**

- Panel: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L424); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/panel.md#L43).
- Avatar: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L368); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/avatar.md#L173).
- Message: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L459); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/message.md#L33).
- Composer: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L188); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/composer.md#L83).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Badge: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L316); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/badge.md#L181).
- CommentThread recipe → Avatar, Message, Composer, Button: **recipe**. No standalone CommentThread found. Message, Avatar and Composer provide much of its anatomy; nesting and persistence remain recipe/app work. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L189); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/comment-thread.md#L75).
- Responsive layout recipe → Panel, Card, Separator: **recipe**. No responsive layout family found. Native CSS and landmarks can implement each proposed arrangement; no breakpoint is prescribed here. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L131); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/responsive-layout.md#L111).
- Rich-text editor integration → Toolbar, Menu, Popover: **missing**. No rich-document editing engine found; formatting surfaces do not provide schema, selection or undo. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L136); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/rich-text-editor.md#L58).

**What Area lacks for this baseline.** Rich-text editor integration. Existing controls cover only the reuses listed above.

**Common variations to catalogue.**

- Side-by-side review.
- Inline thread.
- Focused comment with document context.

**Extra requirements for expanded variants.**

- General Splitter — **partial**. Panel already has keyboard/pointer resizing. A general coordinated multi-pane splitter is not found; do not rebuild Panel resizing. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/splitter.md#L98).
- Drawer / Sheet — **partial**. Dialog and Panel exist; no dedicated edge-sheet presentation and responsive modality contract found. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/drawer.md#L139).

**Responsive proposal.** Toggle between document and active thread, preserving its anchor and selection; do not hide the only way back to the document. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Anchoring comments to changing content and merging edits require editor/model integration. Static example anchors do not establish live collaboration.

**Source observations.**

- [Material — Canonical layouts (official Android guidance)](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) (platform-guidance; checked 2026-09-28). Material-derived list-detail, feed and supporting-pane layouts preserve state as panes change visibility; editor tools and document comments are supporting-pane examples.
- [Atlassian — Comment examples](https://atlassian.design/components/comment/examples) (component-examples; checked 2026-09-28). Author/avatar, time, edited marker, body and actions; examples include nested replies and saving feedback.
