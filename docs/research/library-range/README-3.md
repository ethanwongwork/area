# Library range catalogue — run 3

Research worktree: `astra/library-range-3`. Base (`git rev-parse HEAD` before research):
`c585f8c5f38705a7efa79bf05148a8c6989b142a`.

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
52. [EasingCurveEditor](easing-curve-editor.md)
53. [ShortcutRecorder](shortcut-recorder.md)
54. [Toggletip](toggletip.md)
55. [MessageActions](message-actions.md)
56. [ThinkingDisclosure](thinking-disclosure.md)
57. [SourceChip / citation pill](source-chip.md)
58. [AttachmentCard](attachment-card.md)
59. [VoiceInput](voice-input.md)
60. [EmojiPicker / IconPicker](emoji-picker.md)
61. [Callout](callout.md)
62. [ToggleBlock](toggle-block.md)
63. [PeoplePicker](people-picker.md)
64. [Reactions](reactions.md)
65. [CommentThread](comment-thread.md)
66. [FloatingFormatBar](floating-format-bar.md)
67. [DatabaseCard](database-card.md)
68. [PropertyValue](property-value.md)
69. [ColorArea](color-area.md)
70. [ColorSlider](color-slider.md)
71. [EyedropperButton](eyedropper-button.md)
72. [ScrubbableAngle / dial](scrubbable-angle.md)
73. [ZoomControl](zoom-control.md)
74. [LayerRow badges](layer-row-badges.md)
75. [ConstraintsPicker](constraints-picker.md)
76. [UnitField](unit-field.md)
77. [FontPicker](font-picker.md)
78. [VariableChip](variable-chip.md)
79. [KeyboardShortcut overlay](keyboard-shortcuts.md)

## Scope decisions

Source inventory: [COMPONENTS.md at the base commit](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L122-L215).
Built-family exclusion source: [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749).

Excluded existing families, including aliases: Combobox/Autocomplete, Calendar,
Breadcrumbs/Breadcrumb, Tree/TreeView, ContextMenu, CommandPalette, HoverCard,
Message, PromptSuggestions, ModelPicker, ScrollToLatest, AvatarGroup and range Slider.
Custom Select and overlay/submenu behavior stay with the existing Select/Menu/Popover/
Tooltip/Dialog families covered by the other runs. ColorPicker paints stay with that
family; GradientEditor is retained because the inventory separately names its editing job.

Retained named extensions such as Banner, circular Progress, MessageActions,
ColorArea and ColorSlider are catalogued as **extension/composition candidates**, not
claims that Area has no corresponding rendering. The same rule applies to UnitField,
ToggleButtonGroup and Splitter. Their standalone names are absent from the manifest.
Their proposals must explicitly decide reuse versus a new primitive.
Count is outside the three requested inventory sections and is not in this run.
Duplicate mentions and slash aliases share one file. Editable text includes InlineEditableTitle.

`docs/BRIEF.md` is absent from the base. Read-only fallback used:
`/Users/ethanwong/Desktop/area/.claude/worktrees/astra-6-usage-tasks-17a367/docs/BRIEF.md`
(checked 2026-09-28). Layers 2–3 and Library guide proposals; no changes to that checkout.

## Evidence and counting

Research in progress. Public documentation and public source only. No screenshots,
logged-in products, owner browser, geometry measurements or private source.
