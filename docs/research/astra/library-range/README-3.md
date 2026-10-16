# Library range catalogue — run 3

Research worktree: `astra/library-range-3`. Snapshot of commit
`c585f8c5f38705a7efa79bf05148a8c6989b142a`.

Thirteen evidence-free family stubs are consolidated in [no-evidence.md](no-evidence.md); full lookup coverage remains in the index.

## Exact scope

1. [SearchField](search-field.md)
2. [PasswordField](password-field.md)
3. [MultiSelect](multi-select.md)
4. [TagPicker](tag-picker.md)
5. [Editable text / InlineEditableTitle](editable-text.md)
6. [OTP input](otp-input.md)
7. [FileUpload / DropZone](file-upload.md)
8. [Form validation / Error summary](form-validation.md)
9. [DateField](date-field.md)
10. [DatePicker](date-picker.md)
11. [DateRangePicker](date-range-picker.md)
12. [TimeField](time-field.md)
13. [Duration input](duration-input.md)
14. [Link](link.md)
15. [Pagination](pagination.md)
16. [Stepper](stepper.md)
17. [MenuBar](menubar.md)
18. [ListBox](listbox.md)
19. [Selectable List](selectable-list.md)
20. [TreeSelect / Cascader](tree-select.md)
21. [TransferList](transfer-list.md)
22. [Rating](rating.md)
23. [ToggleButtonGroup](toggle-button-group.md)
24. [Drag / reorder handles](drag-handle.md)
25. [Accordion / Disclosure](accordion.md)
26. [Drawer / Sheet](drawer.md)
27. [AlertDialog](alert-dialog.md)
28. [Resizable / Splitter](splitter.md)
29. [ScrollArea](scroll-area.md)
30. [Responsive layout primitives](responsive-layout.md)
31. [PageHeader](page-header.md)
32. [Sidebar](sidebar.md)
33. [Application shell](app-shell.md)
34. [Dockable inspector](dockable-inspector.md)
35. [DescriptionList](description-list.md)
36. [Stat](stat.md)
37. [Timeline](timeline.md)
38. [EmptyState](empty-state.md)
39. [Result / ErrorState](result.md)
40. [Banner](banner.md)
41. [Meter](meter.md)
42. [Circular Progress](circular-progress.md)
43. [Live notification queue](notification-queue.md)
44. [DataGrid](data-grid.md)
45. [TreeGrid](tree-grid.md)
46. [Image / media preview](media-preview.md)
47. [Carousel](carousel.md)
48. [Rich text editor integration](rich-text-editor.md)
49. [Code editor integration](code-editor.md)
50. [Chart integrations](charts.md)
51. [GradientEditor](gradient-editor.md)
52. [EasingCurveEditor](no-evidence.md#easing-curve-editor)
53. [ShortcutRecorder](no-evidence.md#shortcut-recorder)
54. [Toggletip](toggletip.md)
55. [MessageActions](message-actions.md)
56. [ThinkingDisclosure](no-evidence.md#thinking-disclosure)
57. [SourceChip / citation pill](no-evidence.md#source-chip)
58. [AttachmentCard](attachment-card.md)
59. [VoiceInput](no-evidence.md#voice-input)
60. [EmojiPicker / IconPicker](emoji-picker.md)
61. [Callout](callout.md)
62. [ToggleBlock](toggle-block.md)
63. [PeoplePicker](people-picker.md)
64. [Reactions](reactions.md)
65. [CommentThread](comment-thread.md)
66. [FloatingFormatBar](floating-format-bar.md)
67. [DatabaseCard](no-evidence.md#database-card)
68. [PropertyValue](no-evidence.md#property-value)
69. [ColorArea](color-area.md)
70. [ColorSlider](color-slider.md)
71. [EyedropperButton](eyedropper-button.md)
72. [ScrubbableAngle / dial](scrubbable-angle.md)
73. [ZoomControl](no-evidence.md#zoom-control)
74. [LayerRow badges](no-evidence.md#layer-row-badges)
75. [ConstraintsPicker](no-evidence.md#constraints-picker)
76. [UnitField](unit-field.md)
77. [FontPicker](no-evidence.md#font-picker)
78. [VariableChip](no-evidence.md#variable-chip)
79. [KeyboardShortcut overlay](no-evidence.md#keyboard-shortcuts)

## Scope decisions

Source inventory: [COMPONENTS.md at the base commit](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215).
Built-family exclusion source: [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749).

Excluded existing families, including aliases: Combobox/Autocomplete, Calendar,
Breadcrumbs/Breadcrumb, Tree/TreeView, ContextMenu, CommandPalette, HoverCard,
Message, PromptSuggestions, ModelPicker, ScrollToLatest, AvatarGroup and range Slider.
Custom Select and overlay/submenu behavior stay with the existing Select/Menu/Popover/
Tooltip/Dialog families covered by the other runs. ColorPicker paints stay with that
family; GradientEditor is retained because the inventory separately names its editing job.

Banner is now built and approved as Alert layout="banner" (current-main review 7dae828e7af1daf9d26b663d34335121156606f7).
Retained named extensions such as circular Progress, MessageActions,
ColorArea and ColorSlider are catalogued as **extension/composition candidates**, not
claims that Area has no corresponding rendering. The same rule applies to UnitField,
ToggleButtonGroup and Splitter. Their standalone names are absent from the manifest.
Their proposals must explicitly decide reuse versus a new primitive.
Count is outside the three requested inventory sections and is not in this run.
Duplicate mentions and slash aliases share one file. Editable text includes InlineEditableTitle.

`docs/BRIEF.md` is absent from the base. Read-only fallback used:
`.claude/worktrees/astra-6-usage-tasks-17a367/docs/BRIEF.md`
(checked 2026-09-28). Layers 2–3 and Library guide proposals; no changes to that checkout.

## Evidence and counting

Checked 2026-09-28. Public documentation and public source only. No screenshots,
logged-in products, owner browser, geometry measurements or private source.

Each family checks all 16 requested systems. The denominator is 15 implementation
systems; Apple HIG is platform guidance and is never counted as a shipped library.
React Aria / Spectrum 2 and Chakra/Ark each count once. Radix Themes is distinct
from Radix Primitives. Current Polaris web-component pages are used where the old
Polaris React catalogue redirects. [Catalogue URLs](systems-3.json) and
[retrieval metadata](checked-pages-3.json) record the checked locations and failures.

**Observed availability is not a stable-release audit.** Counts mean a component
source or first-party functional recipe was found at the linked public page/pinned
commit. They are lower bounds on this reviewed corpus. Source branches can contain
preview, compatibility or platform-extension packages. Component and recipe-only
counts are shown separately. Internal components, static mockups, analogues and
HIG guidance do not enter family counts. A failed URL or absent named declaration
means **not found at that location**, never proof that the ecosystem lacks it.

Material evidence is the official Android implementation plus its component guides;
platform-native choices are not promises of a React API. Untitled public examples
include paid-library presentation, while its free source is used when available.
Carbon Callout carries a source-stage stability caveat, Fluent chart evidence uses
v9, and Atlassian chart evidence is the Forge extension. See the linked family notes
and [lookup audit](lookup-audit-3.md) before treating those as direct dependencies.

Native options preserve exact axis names, literal values and declaring owners in
[index-3.json](index-3.json). Identical spelling across systems does not imply equal
geometry or behavior. Named/open types stay unresolved rather than inventing an enum.
Boolean states are runtime/configuration choices. Documentation headings are labelled
examples, not independently verified complete interactions. The complete extracted
API ledger is supporting evidence, not a promise to implement every upstream prop.

Proposed categories group related alternatives for an owner decision. Their count
means a system documents **at least one** alternative in that category; it does not
mean every member is supported by every system. Exact leaf-option support is indexed
separately. Zero-count proposals cite analogues and explicitly need an Area contract.
Reuse and build priorities are design judgments. Density and mode remain system-wide;
layer 2 is local variation and layer 3 is anatomy/composition. Avoid a Cartesian product
of all upstream choices.

The deliverable contains **79 families**, **6363 linked option/example/category records**,
**147 proposed range categories** and **435 source units**. These are computed
from the committed JSON, not market-share estimates. Evidence-backed family pages have the seven requested
sections; 13 deferred families share no-evidence.md. Every retained option has evidence, and all existing reuses resolve in the pinned Area manifest.

## Build-order proposal

Prioritize common jobs and their prerequisites, then narrower reusable families,
then engine integrations; unresolved product contracts come last. Common means
observed in at least six implementation systems, an editorial cutoff for this plan.
A prerequisite inherits its most widely supported dependent's priority, so DateField
can unlock DatePicker and ListBox can unlock MultiSelect before unrelated work.
Within each phase, order available families by this dependency priority, then their
own coverage. Prerequisites always come first and can lift a dependent to a later
phase. This is a recommendation, not an externally sourced score. The machine-readable order is [build-order-3.json](build-order-3.json).
Counts include functional recipes as described above; follow each family link for
its component/recipe split, system names, variants and citations.

### Already built on current main

1. [Banner](banner.md) — **8/15**; built; reuse Alert, Button.

### Common jobs and enabling primitives

2. [AlertDialog](alert-dialog.md) — **13/15**; recipe; reuse Dialog, Button.
3. [Accordion / Disclosure](accordion.md) — **11/15**; primitive; reuse Button, Panel.
4. [Drawer / Sheet](drawer.md) — **11/15**; recipe; reuse Dialog, Panel, Button.
5. [Link](link.md) — **11/15**; primitive; reuse Code, Button.
6. [DateField](date-field.md) — **6/15**; primitive; reuse Field, Input.
7. [DatePicker](date-picker.md) — **11/15**; recipe; reuse Calendar, Popover, Input, Field; new prerequisites: DateField.
8. [ToggleButtonGroup](toggle-button-group.md) — **10/15**; recipe; reuse ButtonGroup, Segmented.
9. [ListBox](listbox.md) — **7/15**; primitive; reuse Checkbox, Chip.
10. [MultiSelect](multi-select.md) — **10/15**; primitive; reuse Combobox, Chip, Checkbox, Popover; new prerequisites: ListBox.
11. [DateRangePicker](date-range-picker.md) — **9/15**; recipe; reuse Calendar, Popover, Input, Field; new prerequisites: DatePicker.
12. [FileUpload / DropZone](file-upload.md) — **9/15**; primitive; reuse Input, Button, Progress, Alert.
13. [Form validation / Error summary](form-validation.md) — **9/15**; primitive; reuse Field, Input, Alert, Button.
14. [Pagination](pagination.md) — **9/15**; recipe; reuse Button, Select, Input.
15. [Sidebar](sidebar.md) — **9/15**; recipe; reuse Nav, Button, Menu.
16. [EmptyState](empty-state.md) — **8/15**; recipe; reuse Button, Card.
17. [Live notification queue](notification-queue.md) — **8/15**; primitive; reuse Toast.
18. [TagPicker](tag-picker.md) — **8/15**; recipe; reuse Combobox, Chip, Popover; new prerequisites: MultiSelect.
19. [TimeField](time-field.md) — **8/15**; primitive; reuse Field, Input, NumberField.
20. [Responsive layout primitives](responsive-layout.md) — **7/15**; primitive; reuse Panel, Card, Separator.
21. [Selectable List](selectable-list.md) — **7/15**; primitive; reuse Checkbox, Radio, Avatar; new prerequisites: ListBox.
22. [PageHeader](page-header.md) — **5/15**; recipe; reuse Breadcrumb, Button, Input.
23. [Application shell](app-shell.md) — **8/15**; recipe; reuse Nav, Panel, Toolbar; new prerequisites: Sidebar, PageHeader, Responsive layout primitives.
24. [Carousel](carousel.md) — **7/15**; primitive; reuse Card, Button.
25. [Circular Progress](circular-progress.md) — **6/15**; recipe; reuse Progress, Spinner.
26. [OTP input](otp-input.md) — **6/15**; primitive; reuse Input, Field.
27. [PasswordField](password-field.md) — **6/15**; recipe; reuse Input, Field, Button.
28. [Resizable / Splitter](splitter.md) — **6/15**; primitive; reuse Panel.
29. [ScrollArea](scroll-area.md) — **6/15**; primitive; reuse Panel.
30. [SearchField](search-field.md) — **6/15**; recipe; reuse Input, Field, Button, Kbd.
31. [Stepper](stepper.md) — **6/15**; primitive; reuse Button, Progress.

### Narrower reusable families and compositions

32. [DescriptionList](description-list.md) — **5/15**; primitive; reuse Code, Badge.
33. [Rating](rating.md) — **5/15**; primitive; reuse RadioGroup, Button.
34. [Timeline](timeline.md) — **5/15**; recipe; reuse Avatar, Badge, Separator.
35. [ToggleBlock](toggle-block.md) — **5/15**; recipe; reuse Panel, Button; new prerequisites: Accordion / Disclosure.
36. [Callout](callout.md) — **4/15**; recipe; reuse Alert, Code.
37. [ColorArea](color-area.md) — **4/15**; recipe; reuse ColorPicker.
38. [ColorSlider](color-slider.md) — **4/15**; recipe; reuse ColorPicker, Slider.
39. [Editable text / InlineEditableTitle](editable-text.md) — **4/15**; primitive; reuse Input, Field, Button.
40. [MenuBar](menubar.md) — **4/15**; recipe; reuse Menu, Toolbar.
41. [PeoplePicker](people-picker.md) — **4/15**; recipe; reuse Combobox, Avatar, Chip; new prerequisites: TagPicker.
42. [Result / ErrorState](result.md) — **4/15**; recipe; reuse Alert, Button.
43. [Stat](stat.md) — **4/15**; recipe; reuse Card, Progress.
44. [Toggletip](toggletip.md) — **4/15**; recipe; reuse Popover, Button.
45. [UnitField](unit-field.md) — **4/15**; recipe; reuse NumberField, InputGroup, Select.
46. [EmojiPicker / IconPicker](emoji-picker.md) — **3/15**; recipe; reuse Combobox, Popover, Tabs, Button; new prerequisites: ListBox.
47. [Meter](meter.md) — **3/15**; primitive; reuse Progress.
48. [TransferList](transfer-list.md) — **3/15**; recipe; reuse Checkbox, Input, Button; new prerequisites: ListBox.
49. [AttachmentCard](attachment-card.md) — **2/15**; recipe; reuse Card, Progress, Button; new prerequisites: FileUpload / DropZone.
50. [CommentThread](comment-thread.md) — **2/15**; recipe; reuse Avatar, Composer, Message, Button.
51. [EyedropperButton](eyedropper-button.md) — **2/15**; recipe; reuse Button, ColorPicker.
52. [GradientEditor](gradient-editor.md) — **2/15**; recipe; reuse ColorPicker, ColorSwatch, Slider; new prerequisites: ColorArea, ColorSlider.
53. [MessageActions](message-actions.md) — **2/15**; recipe; reuse Message, Button, Toolbar.
54. [Reactions](reactions.md) — **2/15**; recipe; reuse Chip, Button; new prerequisites: EmojiPicker / IconPicker.
55. [ScrubbableAngle / dial](scrubbable-angle.md) — **2/15**; primitive; reuse NumberField, Slider.
56. [TreeSelect / Cascader](tree-select.md) — **2/15**; recipe; reuse TreeView, Combobox, Popover, Chip; new prerequisites: ListBox.
57. [Duration input](duration-input.md) — **1/15**; recipe; reuse NumberField, InputGroup, Field; new prerequisites: TimeField.

### Adapters and engine-dependent work

58. [Chart integrations](charts.md) — **8/15**; adapter; reuse Tooltip, Card.
59. [DataGrid](data-grid.md) — **8/15**; adapter; reuse Table, Checkbox, Input, Menu; new prerequisites: Selectable List.
60. [Rich text editor integration](rich-text-editor.md) — **4/15**; adapter; reuse Toolbar, Menu, Popover.
61. [Drag / reorder handles](drag-handle.md) — **3/15**; adapter; reuse PropertyList, Button.
62. [FloatingFormatBar](floating-format-bar.md) — **3/15**; recipe; reuse Toolbar, Popover; new prerequisites: Rich text editor integration.
63. [Image / media preview](media-preview.md) — **3/15**; adapter; reuse Dialog, Button.
64. [TreeGrid](tree-grid.md) — **3/15**; adapter; reuse Table, TreeView; new prerequisites: DataGrid.
65. [Dockable inspector](dockable-inspector.md) — **2/15**; adapter; reuse Panel, PropertyList, Toolbar; new prerequisites: Resizable / Splitter, Application shell.

### Owner contract and evidence needed

66. [Code editor integration](code-editor.md) — **0/15**; defer; reuse CodeBlock, Toolbar.
67. [ConstraintsPicker](no-evidence.md#constraints-picker) — **0/15**; recipe; reuse CheckboxGroup, AlignmentPicker.
68. [EasingCurveEditor](no-evidence.md#easing-curve-editor) — **0/15**; defer; reuse NumberField, InputGroup.
69. [FontPicker](no-evidence.md#font-picker) — **0/15**; adapter; reuse Combobox, Select; new prerequisites: ListBox.
70. [KeyboardShortcut overlay](no-evidence.md#keyboard-shortcuts) — **0/15**; recipe; reuse Dialog, Kbd; new prerequisites: DescriptionList.
71. [LayerRow badges](no-evidence.md#layer-row-badges) — **0/15**; recipe; reuse TreeView, Badge.
72. [PropertyValue](no-evidence.md#property-value) — **0/15**; adapter; reuse Field, Input, Badge, Avatar, Checkbox; new prerequisites: UnitField, PeoplePicker, DateField.
73. [DatabaseCard](no-evidence.md#database-card) — **0/15**; recipe; reuse Card, Badge, Avatar; new prerequisites: PropertyValue.
74. [ShortcutRecorder](no-evidence.md#shortcut-recorder) — **0/15**; defer; reuse Kbd, Input, Button.
75. [SourceChip / citation pill](no-evidence.md#source-chip) — **0/15**; recipe; reuse Chip, HoverCard.
76. [ThinkingDisclosure](no-evidence.md#thinking-disclosure) — **0/15**; recipe; reuse Message, Panel, Spinner; new prerequisites: Accordion / Disclosure.
77. [VariableChip](no-evidence.md#variable-chip) — **0/15**; recipe; reuse Chip, Code, Tooltip.
78. [VoiceInput](no-evidence.md#voice-input) — **0/15**; defer; reuse Button, Progress, Composer.
79. [ZoomControl](no-evidence.md#zoom-control) — **0/15**; recipe; reuse NumberField, Menu, Button.

## Owner decisions

- Which named extensions should become exported families versus documented recipes?
  Banner, circular Progress, UnitField, ColorArea/Slider and MessageActions already
  reuse substantial existing Area anatomy; this research does not authorize rebuilding it.
- Should range include preview/compatibility/platform-specific evidence, or should a
  later implementation pass require a stable React release before selecting an upstream?
- Which engines and contracts should govern editors, charts, drag/drop, virtualized
  grids and voice capture? Their visual wrappers do not supply those behaviors.
- Are product-specific controls with no dedicated implementation evidence worth building
  now? ConstraintsPicker, VariableChip and related inspector jobs need owner-defined
  semantics before detailed component specifications.

## Reproduction and validation

`source-pins-3.json` gives immutable repository commits and local cache paths. Clone
public repositories into those ignored paths, checking out each exact SHA. Sparse
checkouts must include the file paths named by `source-ledger-3.json`; a complete
checkout is also sufficient. No source clone or raw page cache belongs in the PR.

From this worktree, after the already-authorized `npm ci`:

```sh
python3 docs/research/astra/library-range/collect-3.py
python3 docs/research/astra/library-range/inventory-3.py
python3 docs/research/astra/library-range/render-3.py
python3 docs/research/astra/library-range/validate-3.py
```

The collector replays the checked URL list. Live pages can change; their checked date
and text digest describe this research run, not future retrievals. Pinned source links
remain reproducible. `finalize-3.py` updates the build order and README from reviewed
inputs and the local retrieval caches; run it only when intentionally revising evidence.
The committed scope, notes, mappings and range proposals are editorial inputs.
The extractor uses TypeScript already in the repository; no dependencies were added.

Checks: `npm ci`, `npm run build`, `npm run build:docs`, research validation and
`git diff --check`. No product files changed, so no component visual behavior is claimed
or owner completion status changed. The research Markdown is not a new docs-site route.

## DONE

- [x] Exact unbuilt-family scope recorded against the pinned manifest and requested inventory sections.
- [x] Every family has a file in the requested section order.
- [x] Every family records checks against all requested systems, including bounded not-found results.
- [x] Every indexed option and proposed range category has at least one evidence link.
- [x] Existing Area reuse, option support counts and dependency-aware build order are recorded.
- [x] No values measured from screenshots; no logged-in products used.
- [x] Research-only changes on `astra/library-range-3`; no shared component or icon edits.
