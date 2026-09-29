# Patterns and screens catalogue

Layer 4 research · checked **2026-09-28** · branch `astra/patterns`.

Snapshot of commit **`18b86465d542f620d532fee351c4f28d50c8ac3a`**. This is the fetched `origin/main` used to create the isolated worktree. Findings stay pinned here even if main or another working branch advances.

The catalogue contains **52 patterns across 18 requested categories**, grounded in **51 cited public reference pages**. Counts are computed from [coverage.json](coverage.json). All entries contain purpose, ordered anatomy, Area mappings, gaps, variations, responsive recommendations and dated sources.

## Scope and evidence

The brief puts screens, flows and layouts in layer 4. It was absent from main, so the user-specified `docs/BRIEF.md` in the `astra-6-usage-tasks-17a367` worktree was read only (2026-09-28; customization model lines 109–123). That working-file fallback is a scope input, not evidence for today’s component availability.

Area evidence uses [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L27), the pinned manifest/React exports and the [owner registry](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/apps/docs/src/component-status.mjs#L6). Each component record has exact pinned file/line links. The three range branches were read without checkout:

- `origin/astra/library-range-1` at `e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a`: [README-1](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/README-1.md#L1).
- `origin/astra/library-range-2` at `969d91e60b1cd565d12aa84e0c8ee7162f9a501c`: [README-2](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/README-2.md#L1).
- `origin/astra/library-range-3` at `7435813c947188664c665dc59f5fa0ffc5de4e8c`: [README-3](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/README-3.md#L1).

The range surveys use an earlier Area base. Current executable declarations take precedence over stale backlog wording: Combobox, CommandPalette, ContextMenu, HoverCard and the conversation families are built; Count and Alert’s banner layout are present. Panel resizing and PanelSection collapse must not be counted as entirely absent. The per-family evidence and separate capability entries in coverage.json record these distinctions.

Anatomy, dependency selection and responsive behavior are **Area design proposals** drawn from references, not claims of a shared upstream implementation. “Common” names recognizable alternatives in this reviewed corpus; no market-prevalence count is claimed. No measurements, breakpoints, paid source or logged-in product use is included.

## Categories

- [App shells](app-shells.md) — 4 patterns.
- [Settings](settings.md) — 4 patterns.
- [Onboarding and empty states](onboarding-empty-states.md) — 3 patterns.
- [Sign-in and account](sign-in-account.md) — 3 patterns.
- [Forms and multi-step flows](forms-flows.md) — 3 patterns.
- [Tables and list views](tables-list-views.md) — 4 patterns.
- [Dashboards](dashboards.md) — 2 patterns.
- [Detail pages](detail-pages.md) — 2 patterns.
- [Inbox and notifications](inbox-notifications.md) — 3 patterns.
- [Search and command](search-command.md) — 2 patterns.
- [Chat and AI assistant](chat-ai-assistant.md) — 2 patterns.
- [Document editor](document-editor.md) — 2 patterns.
- [Design-tool inspector](design-tool-inspector.md) — 3 patterns.
- [Billing and plans](billing-plans.md) — 3 patterns.
- [Errors and system states](errors-system-states.md) — 3 patterns.
- [File upload and management](file-upload-management.md) — 3 patterns.
- [Comments and collaboration](comments-collaboration.md) — 3 patterns.
- [Marketing](marketing.md) — 3 patterns.

## Twenty showcase patterns

These editorial selections expose **58 distinct built Area families** across their required mappings. They favor current controls and varied composition; this is not a mathematical optimum or a statement that all screens already work. Fixtures can demonstrate layout and states, but each page identifies the runtime work still needed. Optional variants do not contribute to the family count.

1. [Sidebar application shell](app-shells.md#sidebar-shell) — Exercises navigation, identity, counts and contextual actions in one frame. Baseline uses existing families and recipe composition.
2. [File and folder manager](file-upload-management.md#file-browser) — Brings hierarchy, path navigation, view switching and context menus into one resource workspace. Shared contract still needed: Selectable List, Media preview integration.
3. [Profile and account settings](settings.md#profile-settings) — Combines labeled text entry, identity and save feedback. Shared contract still needed: Form validation and error summary.
4. [Appearance and preference settings](settings.md#preference-settings) — Shows choices, previews and system-level customization controls. Baseline uses existing families and recipe composition.
5. [Connected accounts and integrations](settings.md#integration-settings) — Combines connection status, actions and modal confirmation with identity. Shared contract still needed: AlertDialog contract.
6. [Setup checklist](onboarding-empty-states.md#setup-checklist) — Combines progress, collapsible sections and task actions. Baseline uses existing families and recipe composition.
7. [Marketing hero and entry](marketing.md#hero) — Uses navigation, announcement badges, actions and content cards in a marketing composition. Baseline uses existing families and recipe composition.
8. [Sign-in entry](sign-in-account.md#sign-in) — Tests native fields, actions and error/wait states in a compact flow. Baseline uses existing families and recipe composition.
9. [Create or edit resource form](forms-flows.md#resource-form) — Uses the broadest field set, including numbers, suggestions and inline Calendar. Shared contract still needed: Form validation and error summary.
10. [Filterable resource table](tables-list-views.md#resource-table) — Shows dense data, filters, selection, menus and loading in context. Baseline uses existing families and recipe composition.
11. [Resource gallery and list switch](tables-list-views.md#resource-cards) — Compares card and row compositions with the same content. Baseline uses existing families and recipe composition.
12. [Operational summary dashboard](dashboards.md#summary-dashboard) — Combines status, progress, summary cards and an actionable table without a chart dependency. Baseline uses existing families and recipe composition.
13. [Resource detail and metadata](detail-pages.md#resource-detail) — Shows hierarchy, split actions, tabs, metadata and contextual identity. Baseline uses existing families and recipe composition.
14. [Notification center](inbox-notifications.md#notification-center) — Combines counts, unread markers and repeated content in a contained surface. Baseline uses existing families and recipe composition.
15. [Command palette](search-command.md#command-surface) — Demonstrates the existing command and keyboard-hint families. Baseline uses existing families and recipe composition.
16. [AI assistant conversation](chat-ai-assistant.md#assistant-thread) — Exercises conversation-specific families, code output and response actions. Baseline uses existing families and recipe composition.
17. [Markdown edit and preview](document-editor.md#markdown-workspace) — Contrasts multiline editing and a fixture preview with toolbar controls. Baseline uses existing families and recipe composition.
18. [Layout and geometry inspector](design-tool-inspector.md#layout-inspector) — Demonstrates paired numeric fields, linked box values and spatial alignment. Baseline uses existing families and recipe composition.
19. [Fill, stroke and effects inspector](design-tool-inspector.md#paint-inspector) — Exercises the color family and ordered property rows together. Baseline uses existing families and recipe composition.
20. [Plan comparison and selection](billing-plans.md#plan-comparison) — Shows selectable plans, comparison content and period switching. Baseline uses existing families and recipe composition.

Built families elsewhere in this catalogue but outside that selection: none.

## Missing capabilities with the broadest reach

Counts below are **direct dependency incidence in this catalogue**, not third-party popularity or estimates of implementation effort. Required and optional variants are separate. Adding one dependency can leave other gaps. “Sole shared gap” excludes recipe packaging and backend/runtime work; it does not mean a complete app becomes ready. Full pattern ID lists are in `coverage.json → priorities`.

- **Form validation and error summary** (partial; behavior): 6 required patterns, 0 optional variants; sole shared gap for 5. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/form-validation.md#L99).
- **Selectable List** (partial; behavior): 3 required patterns, 1 optional variants; sole shared gap for 2. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/selectable-list.md#L164).
- **General Splitter** (partial; behavior): 2 required patterns, 5 optional variants; sole shared gap for 0. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/splitter.md#L98).
- **Code editor integration** (missing; adapter): 2 required patterns, 1 optional variants; sole shared gap for 0. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/code-editor.md#L29).
- **Rich-text editor integration** (missing; adapter): 2 required patterns, 1 optional variants; sole shared gap for 1. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/rich-text-editor.md#L58).
- **Media preview integration** (missing; adapter): 2 required patterns, 0 optional variants; sole shared gap for 1. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/media-preview.md#L68).
- **FileUpload / DropZone** (missing; primitive): 1 required patterns, 3 optional variants; sole shared gap for 1. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/file-upload.md#L142).
- **Chart integration** (missing; adapter): 1 required patterns, 1 optional variants; sole shared gap for 0. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/charts.md#L179).
- **DataGrid** (missing; adapter): 1 required patterns, 1 optional variants; sole shared gap for 1. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/data-grid.md#L223).
- **Live notification queue** (missing; behavior): 1 required patterns, 1 optional variants; sole shared gap for 1. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/notification-queue.md#L90).
- **PeoplePicker** (partial; behavior): 1 required patterns, 1 optional variants; sole shared gap for 1. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/people-picker.md#L124).
- **AlertDialog contract** (partial; behavior): 1 required patterns, 0 optional variants; sole shared gap for 1. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/alert-dialog.md#L180).
- **DateRangePicker** (partial; behavior): 1 required patterns, 0 optional variants; sole shared gap for 0. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/date-range-picker.md#L181).
- **FloatingFormatBar** (partial; adapter): 1 required patterns, 0 optional variants; sole shared gap for 0. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/floating-format-bar.md#L48).
- **FontPicker** (partial; adapter): 1 required patterns, 0 optional variants; sole shared gap for 1. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/font-picker.md#L29).
- **OTP input** (missing; primitive): 1 required patterns, 0 optional variants; sole shared gap for 1. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/otp-input.md#L79).
- **Payment-provider entry adapter** (missing; external-integration): 1 required patterns, 0 optional variants; sole shared gap for 0. [Range evidence](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/README-1.md#L1).
- **Drawer / Sheet** (partial; behavior): 0 required patterns, 8 optional variants; sole shared gap for 0. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/drawer.md#L139).
- **MultiSelect / TagPicker** (partial; behavior): 0 required patterns, 3 optional variants; sole shared gap for 0. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/multi-select.md#L240).
- **Dockable inspector** (missing; adapter): 0 required patterns, 2 optional variants; sole shared gap for 0. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/dockable-inspector.md#L84).
- **DatePicker** (partial; behavior): 0 required patterns, 1 optional variants; sole shared gap for 0. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/date-picker.md#L198).
- **GradientEditor** (partial; behavior): 0 required patterns, 1 optional variants; sole shared gap for 0. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/gradient-editor.md#L60).
- **TreeGrid** (missing; adapter): 0 required patterns, 1 optional variants; sole shared gap for 0. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/tree-grid.md#L99).

Suggested order is an editorial decision: establish shared form-error handling and collection selection; add upload and responsive sheet contracts; then choose grid, chart and editor adapters according to the screens the owner actually wants. Preserve working Panel resizing, Calendar range selection and single-value Combobox while extending their surrounding contracts. Do not implement every gap solely to increase a count.

### Recipes that improve breadth without another primitive

These entries have no independent family export in the checked scope. Their basic version can be authored with existing components and semantic HTML; they are packaging opportunities rather than mandatory new primitives.

- **Responsive layout recipe**: 9 required patterns, 0 optional variants. Reuse Panel, Card, Separator. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/responsive-layout.md#L111).
- **Pagination recipe**: 7 required patterns, 0 optional variants. Reuse Button, Select, Input. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/pagination.md#L119).
- **Accordion / Disclosure recipe**: 3 required patterns, 0 optional variants. Reuse Panel, Button. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/accordion.md#L134).
- **CommentThread recipe**: 3 required patterns, 0 optional variants. Reuse Avatar, Message, Composer, Button. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/comment-thread.md#L75).
- **DescriptionList recipe**: 3 required patterns, 0 optional variants. Reuse Badge, Code. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/description-list.md#L72).
- **EmptyState recipe**: 3 required patterns, 0 optional variants. Reuse Card, Button. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/empty-state.md#L100).
- **Result / ErrorState recipe**: 3 required patterns, 0 optional variants. Reuse Alert, Card, Button. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/result.md#L60).
- **Stat recipe**: 3 required patterns, 0 optional variants. Reuse Card, Progress, Badge. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/stat.md#L75).
- **PasswordField recipe**: 2 required patterns, 1 optional variants. Reuse Input, Field, Button. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/password-field.md#L113).
- **PageHeader recipe**: 2 required patterns, 0 optional variants. Reuse Breadcrumb, Button, Badge. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/page-header.md#L91).
- **SearchField recipe**: 2 required patterns, 0 optional variants. Reuse Input, Button, Kbd. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/search-field.md#L97).
- **AttachmentCard recipe**: 1 required patterns, 1 optional variants. Reuse Card, Progress, Button. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/attachment-card.md#L64).
- **Editable title / text**: 1 required patterns, 1 optional variants. Reuse Input, Field, Button. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/editable-text.md#L97).
- **Sidebar recipe**: 1 required patterns, 0 optional variants. Reuse Nav, Menu, Button. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/sidebar.md#L135).
- **SourceChip recipe**: 1 required patterns, 0 optional variants. Reuse Chip, HoverCard. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/source-chip.md#L29).
- **Stepper recipe**: 1 required patterns, 0 optional variants. Reuse Progress, Button, Badge. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/stepper.md#L101).
- **Timeline recipe**: 1 required patterns, 0 optional variants. Reuse Avatar, Badge, Separator. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/timeline.md#L83).
- **ConstraintsPicker recipe**: 0 required patterns, 1 optional variants. Reuse Checkbox, AlignmentPicker. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/constraints-picker.md#L29).
- **Reactions recipe**: 0 required patterns, 1 optional variants. Reuse Chip, Button, Popover. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/reactions.md#L64).
- **ThinkingDisclosure recipe**: 0 required patterns, 1 optional variants. Reuse Panel, Message, Spinner. [Range evidence](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/thinking-disclosure.md#L29).

## How to read coverage.json

- `patterns[id].required_components` maps each requirement to an Area status and family IDs. `optional_components` applies only to expanded variants. These are not all independently installed packages.
- `components[id]` supplies labels, status rationale, owner status, pinned inventory/manifest/spec evidence and the pinned range cross-check. `area_families` on a non-built capability means candidate reuses, not proof of that capability.
- `built` means the family exists at the baseline. `complete` and `review` are copied separately from the owner registry, never conferred here.
- `recipe` means composable anatomy without a named exported family. `partial` means missing shared behavior despite usable anatomy. `missing` means the named primitive/manager/adapter was not found in the cited inventory, exports and range corpus.
- Plain headings, text, landmarks, links, images, lists and form markup do not need invented Area families. Domain logic, services, routing, permissions and persistence are recorded in the behavior boundary rather than counted as component gaps.

## Public reference coverage and lookup limits

- **Primer**: [Primer — Layout](https://primer.style/product/getting-started/foundations/layout/); [Primer — Navigation](https://primer.style/product/ui-patterns/navigation/); [Primer — Feature onboarding](https://primer.style/product/ui-patterns/feature-onboarding/); [Primer — Empty states](https://primer.style/product/ui-patterns/empty-states/); [Primer — Degraded experiences](https://primer.style/product/ui-patterns/degraded-experiences/); [Primer — Loading](https://primer.style/product/ui-patterns/loading/).
- **Carbon**: [Carbon — Filtering](https://carbondesignsystem.com/patterns/filtering/); [Carbon — Login](https://carbondesignsystem.com/patterns/login-pattern/); [Carbon — Notifications](https://carbondesignsystem.com/patterns/notification-pattern/); [Carbon — Search](https://carbondesignsystem.com/patterns/search-pattern/); [Carbon — Text toolbar](https://carbondesignsystem.com/patterns/text-toolbar-pattern/); [Carbon — Data table usage](https://carbondesignsystem.com/components/data-table/usage/).
- **Polaris**: [Polaris — Settings template](https://shopify.dev/docs/api/app-home/latest/patterns/templates/settings); [Polaris — Homepage template](https://shopify.dev/docs/api/app-home/latest/patterns/templates/homepage); [Polaris — Details template](https://shopify.dev/docs/api/app-home/latest/patterns/templates/details); [Polaris — Index table](https://shopify.dev/docs/api/app-home/latest/patterns/compositions/index-table); [Polaris — Resource list](https://shopify.dev/docs/api/app-home/latest/patterns/compositions/resource-list); [Polaris — Setup guide](https://shopify.dev/docs/api/app-home/latest/patterns/compositions/setup-guide); [Polaris — Account connection](https://shopify.dev/docs/api/app-home/latest/patterns/compositions/account-connection).
- **Atlassian**: [Atlassian — Form examples](https://atlassian.design/components/form/examples); [Atlassian — Comment examples](https://atlassian.design/components/comment/examples); [Atlassian — AI interaction guidelines](https://atlassian.design/rovo-ui/ai-interaction-guidelines).
- **GOV.UK**: [GOV.UK — Question pages](https://design-system.service.gov.uk/patterns/question-pages/); [GOV.UK — Check answers](https://design-system.service.gov.uk/patterns/check-answers/); [GOV.UK — Recover from validation errors](https://design-system.service.gov.uk/patterns/validation/); [GOV.UK — Confirmation pages](https://design-system.service.gov.uk/patterns/confirmation-pages/); [GOV.UK — Create accounts](https://design-system.service.gov.uk/patterns/create-accounts/); [GOV.UK — Confirm an email address](https://design-system.service.gov.uk/patterns/confirm-an-email-address/); [GOV.UK — Service unavailable pages](https://design-system.service.gov.uk/patterns/service-unavailable-pages/); [GOV.UK — Page not found pages](https://design-system.service.gov.uk/patterns/page-not-found-pages/); [GOV.UK — File upload](https://design-system.service.gov.uk/components/file-upload/).
- **Fluent**: [Fluent — Layout](https://fluent2.microsoft.design/layout); [Fluent — Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage); [Fluent — Drawer usage](https://fluent2.microsoft.design/components/web/react/core/drawer/usage).
- **Material**: [Material — Canonical layouts (official Android guidance)](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts).
- **Apple HIG**: [Apple HIG — Panels](https://developer.apple.com/design/human-interface-guidelines/panels); [Apple HIG — Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars); [Apple HIG — Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding).
- **Untitled UI**: [Untitled UI — Settings page examples](https://www.untitledui.com/react/components/settings-pages); [Untitled UI — Settings with header navigation](https://www.untitledui.com/react/components/settings-pages-02); [Untitled UI — Billing settings example 12](https://www.untitledui.com/react/components/settings-pages/settings-12); [Untitled UI — Billing settings example 14](https://www.untitledui.com/react/components/settings-pages/settings-14); [Untitled UI — Messaging](https://www.untitledui.com/react/components/messaging); [Untitled UI — File uploaders](https://www.untitledui.com/react/components/file-uploaders); [Untitled UI — Command menus](https://www.untitledui.com/react/components/command-menus); [Untitled UI — Text editors](https://www.untitledui.com/react/components/text-editors); [Untitled UI — Hero header sections](https://www.untitledui.com/react/marketing/hero-header-sections); [Untitled UI — Pricing sections](https://www.untitledui.com/react/marketing/pricing-sections); [Untitled UI — FAQ sections](https://www.untitledui.com/react/marketing/faq-sections); [Untitled UI — Accordion FAQ example](https://www.untitledui.com/react/marketing/faq-sections/faq-accordion-02-brand).
- **shadcn**: [shadcn — Blocks](https://ui.shadcn.com/blocks); [shadcn — Login blocks](https://ui.shadcn.com/blocks/login).

All source URLs were checked on 2026-09-28. [source-checks.json](source-checks.json) records final URL, HTTP result and content hash. HTTP success alone does not prove the authored finding. [Lookup notes](lookup-notes.md) records moved, unavailable or script-only entry points and bounded not-found results. Public Untitled UI descriptions do not verify paid code or behavior. Material and Apple references are platform guidance, not React implementation promises.

## Owner questions

1. Which showcase screens should be built first, and which should remain fixture-only explorations?
2. Should Sidebar, PageHeader, EmptyState, Pagination and Accordion be named library recipes, exported families, or both?
3. Which shared behaviors belong to Area: aggregate form validation, selectable collections, upload lifecycle and Toast queueing?
4. Which engines should back charts, data grids and rich/code editors? These choices should precede claims of complete screen functionality.
5. Should the first inspector and assistant examples stay within today’s controls, or include new gradients, attachments, docking and advanced collection behavior?

## Reproduction and checks

No dependencies were added. `npm ci` and `npm run build` passed in the isolated worktree before research. Research files are not docs-site routes; no component or gallery UI is changed and no preview server is needed. `npm run build:docs` also passed, including manifest parity and the docs audit. The catalogue validator passed for all categories, mappings, pinned source lines, links and computed priorities. Final whitespace and push/PR results are recorded in the draft PR.

```sh
PYTHONDONTWRITEBYTECODE=1 python3 docs/research/patterns/render.py
PYTHONDONTWRITEBYTECODE=1 python3 docs/research/patterns/validate.py
git diff --check
```

The renderer reads Area and range files with `git show` at the fixed commits above. Reproduction requires those objects to be fetched. `catalogue.py`, `area.py` and `sources.py` are the authored inputs. Run `check_sources.py` only when deliberately refreshing URL retrieval metadata; it uses the Python standard library and does not retain page bodies. Source links can change after the checked date; pinned Area evidence remains reproducible.

## DONE

- [x] Every requested category is covered.
- [x] Every pattern links a dated public source and records purpose, anatomy, required Area families, gaps, variations and responsive behavior.
- [x] Area availability is cross-checked against all three pinned range branches and the pinned main baseline.
- [x] coverage.json maps patterns to requirements and Area status, with computed gap reach.
- [x] Twenty showcase patterns and the broadest missing capabilities are identified.
- [x] Only docs/research/patterns is changed; no component, icon, guide, handoff or completion-registry edits.
- [x] No logged-in products, owner browser, new dependencies or personal captures were used.
- [x] Pattern recommendations do not confer component completion or authorize their implementation.
