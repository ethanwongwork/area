/**
 * @area/react
 *
 * Contains no CSS, by construction. Import the stylesheet separately:
 *
 *   import "@area/styles/area.css";
 *
 * Keeping the two packages physically separate is what stops the React API and the
 * stylesheet drifting: React cannot add a style, so it cannot add one the CSS does not
 * know about.
 */
export { Button, type ButtonProps } from "./components/Button.tsx";
export { ButtonGroup, type ButtonGroupProps } from "./components/ButtonGroup.tsx";
export { SplitButton, type SplitButtonProps } from "./components/SplitButton.tsx";
export { CHANGE_STATUSES, CHANGE_MARK, changeStatus, type ChangeStatus, type ChangeStatusInput } from "./components/change-status.ts";
export { announce, clearAnnouncements, useAnnouncement, ANNOUNCE_DELAY_MS, ANNOUNCE_CLEAR_MS, type AnnounceOptions, type AnnouncePoliteness } from "./components/announce.ts";
export { Toaster, useToaster, type ToasterProps, type ToasterApi, type ToastOptions } from "./components/Toaster.tsx";
export { SliderRange, type SliderRangeProps, type SliderRangeValue } from "./components/SliderRange.tsx";
export { Input, InputAction, type InputProps, type InputActionProps } from "./components/Input.tsx";
export { NumberField, type NumberFieldProps } from "./components/NumberField.tsx";
export { InputGroup, InputGroupText, type InputGroupProps, type InputGroupTextProps } from "./components/InputGroup.tsx";
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis, type BreadcrumbProps, type BreadcrumbEllipsisProps, type BreadcrumbSeparatorProps } from "./components/Breadcrumb.tsx";
export { Toolbar, ToolbarItem, ToolbarGroup, ToolbarSeparator, ToolbarOverflow, type ToolbarProps, type ToolbarItemProps, type ToolbarGroupProps, type ToolbarOverflowProps } from "./components/Toolbar.tsx";
export { AlignmentPicker, ALIGNMENT_POSITIONS, type AlignmentPickerProps, type AlignmentPosition } from "./components/AlignmentPicker.tsx";
export { ColorSwatch, type ColorSwatchProps } from "./components/ColorSwatch.tsx";
export { ColorSwatchPicker, type ColorSwatchPickerProps, type ColorSwatchOption } from "./components/ColorSwatchPicker.tsx";
export { ColorField, normalizeHexColor, type ColorFieldProps } from "./components/ColorField.tsx";
export { ModelPicker, type ModelPickerProps, type ModelOption } from "./components/ModelPicker.tsx";
export { ScrollToLatest, type ScrollToLatestProps } from "./components/ScrollToLatest.tsx";
export { Message, MessageActions, MessageGroup, type MessageProps, type MessageActionsProps, type MessageGroupProps, type MessageStatus } from "./components/Message.tsx";
export { PromptSuggestions, type PromptSuggestionsProps, type PromptSuggestion } from "./components/PromptSuggestions.tsx";
export { HoverCard, type HoverCardProps } from "./components/HoverCard.tsx";
export { ContextMenu, type ContextMenuProps } from "./components/ContextMenu.tsx";
export { CommandPalette, type CommandPaletteProps, type CommandItem } from "./components/CommandPalette.tsx";
export { highlightMatch } from "./components/highlight.tsx";
export { Combobox, type ComboboxProps, type ComboboxOption } from "./components/Combobox.tsx";
export { CustomSelect, type CustomSelectProps, type CustomSelectOption } from "./components/CustomSelect.tsx";
export { Tag, type TagProps, type TagColor, type TagTone } from "./components/Tag.tsx";
export { TagPicker, type TagPickerProps, type TagOption } from "./components/TagPicker.tsx";
export { DatePicker, type DatePickerProps } from "./components/DatePicker.tsx";
export { ConfirmDialog, type ConfirmDialogProps } from "./components/ConfirmDialog.tsx";
export { Drawer, type DrawerProps } from "./components/Drawer.tsx";
export { BoxField, type BoxFieldProps, type BoxValue } from "./components/BoxField.tsx";
export { PropertyList, PropertyListItem, type PropertyListProps, type PropertyListItemProps } from "./components/PropertyList.tsx";
export { TreeView, type TreeViewProps, type TreeViewNode, type TreeViewStatus } from "./components/TreeView.tsx";
export { FileUpload, FileUploadList, FileUploadItem, fileMatchesAccept, formatFileSize, type FileUploadProps, type FileUploadItemProps, type FileRejection } from "./components/FileUpload.tsx";
export { Meter, METER_SEGMENT_LIMIT, type MeterProps, type MeterSegment } from "./components/Meter.tsx";
export { SearchField, type SearchFieldProps } from "./components/SearchField.tsx";
export { Board, BoardColumn, BoardCard, type BoardColumnProps, type BoardCardProps } from "./components/Board.tsx";
export { ZoomControl, type ZoomControlProps } from "./components/ZoomControl.tsx";
export { Citation, citationVariants, type CitationProps } from "./components/Citation.tsx";
export { DateRangePicker, type DateRangePickerProps, type DateRangePreset } from "./components/DateRangePicker.tsx";
export { ShortcutList, ShortcutListItem, type ShortcutListProps, type ShortcutListItemProps } from "./components/ShortcutList.tsx";
export { BoxModel, type BoxModelProps, type BoxSides, type BoxCorners } from "./components/BoxModel.tsx";
export { TokenRow, type TokenRowProps } from "./components/TokenRow.tsx";
export { CopyButton, CopyStatus, useCopy, COPY_FEEDBACK_MS, type CopyButtonProps, type CopyState, type CopyValue } from "./components/CopyButton.tsx";
export { ListBox, ListBoxItem, ListBoxSection, type ListBoxProps, type ListBoxItemProps, type ListBoxSectionProps } from "./components/ListBox.tsx";
export { Titlebar, SectionHeading, type TitlebarProps, type SectionHeadingProps } from "./components/AppShell.tsx";
export { PageHeader, type PageHeaderProps } from "./components/PageHeader.tsx";
export { SelectionBar, selectionCountLabel, type SelectionBarProps } from "./components/SelectionBar.tsx";
export { Mention, withMentions, type MentionKind, type MentionProps, type MentionToken } from "./components/Mention.tsx";
export { Splitter, type SplitterEvent, type SplitterProps } from "./components/Splitter.tsx";
export { Chart, ChartNumber, chartTicks, type ChartDatum, type ChartKind, type ChartNumberProps, type ChartProps, type ChartSeries, type ChartView } from "./components/Chart.tsx";
export { SettingRow, SettingsGroup, type SettingRowProps, type SettingsGroupProps } from "./components/SettingRow.tsx";
export { FilterBar, FilterBarItem, FilterBarAdd, type FilterBarProps, type FilterBarItemProps, type FilterBarAddProps } from "./components/FilterBar.tsx";
export { AssetRow, type AssetRowProps } from "./components/AssetRow.tsx";
export { Folder, type FolderProps } from "./components/Folder.tsx";
export { FilePage, type FilePageProps } from "./components/FilePage.tsx";
export { FileImage, type FileImageProps } from "./components/FileImage.tsx";
export { FileTile, FileGrid, FileGridItem, type FileTileProps, type FileGridProps, type FileGridItemProps } from "./components/FileTile.tsx";
export { AssetCard, AssetGrid, AssetGridItem, type AssetCardProps, type AssetGridProps, type AssetGridItemProps } from "./components/AssetCard.tsx";
export { DesignCard, placeDesign, type DesignCardProps, type DesignLayout, type DesignFocus, type DesignPlacement } from "./components/DesignCard.tsx";
export { Surface, type SurfaceProps } from "./components/Surface.tsx";
export { Stack, type StackProps } from "./components/Stack.tsx";
export { PreviewFrame, type PreviewFrameProps } from "./components/PreviewFrame.tsx";
export { PasswordField, type PasswordFieldProps } from "./components/PasswordField.tsx";
export { OTPField, type OTPFieldProps } from "./components/OTPField.tsx";
export { TimeField, type TimeFieldProps } from "./components/TimeField.tsx";
export { Stepper, StepperStep, type StepperProps, type StepperStepProps, type StepStatus } from "./components/Stepper.tsx";
export { EditableText, type EditableTextProps } from "./components/EditableText.tsx";
export { Timeline, TimelineItem, type TimelineProps, type TimelineItemProps } from "./components/Timeline.tsx";
export { DescriptionList, DescriptionListItem, type DescriptionListProps, type DescriptionListItemProps } from "./components/DescriptionList.tsx";
export { ToggleGroup, ToggleGroupItem, type ToggleGroupProps, type ToggleGroupItemProps } from "./components/ToggleGroup.tsx";
export { EmptyState, type EmptyStateProps } from "./components/EmptyState.tsx";
export { ScrollArea, type ScrollAreaProps } from "./components/ScrollArea.tsx";
export { Link, linkVariants, type LinkProps } from "./components/Link.tsx";
export { Toggletip, type ToggletipProps } from "./components/Toggletip.tsx";
export { Pagination, paginationRange, type PaginationProps, type PaginationLabels, type PaginationItem } from "./components/Pagination.tsx";
export { Composer, ComposerAttach, ComposerMic, ComposerNote, type ComposerAttachProps, type ComposerMicProps, type ComposerProps } from "./components/Composer.tsx";
export { Field, Label, type FieldProps, type LabelProps } from "./components/Field.tsx";
export {
  Nav,
  NavGroup,
  NavItem,
  NavSeparator,
  type NavProps,
  type NavGroupProps,
  type NavItemProps,
} from "./components/Nav.tsx";
export * from "./components/primitives.tsx";
export { computePosition } from "./components/overlay.ts";
export type { OverlayAlign, OverlaySide, Position, PositionOptions } from "./components/overlay.ts";
export * from "./components/forms.tsx";
export * from "./variants.ts";

export { Theme, useTheme, type ThemeProps, type AxisSelection, type PillShape } from "./components/Theme.tsx";

export { Badge, type BadgeProps } from "./components/Badge.tsx";
export { BadgeGroup, type BadgeGroupProps } from "./components/BadgeGroup.tsx";
export { Indicator, IndicatorAnchor, type IndicatorProps, type IndicatorAnchorProps } from "./components/Indicator.tsx";
export { Count, type CountProps } from "./components/Count.tsx";
export { AccordionItem, Accordion, type AccordionItemProps, type AccordionProps } from "./components/Accordion.tsx";
export { Step, StepGroup, Reasoning, type StepProps, type StepGroupProps, type ReasoningProps, type StepRunStatus } from "./components/Step.tsx";
export { EditSummary, EditSummaryFile, Diff, type EditSummaryProps, type EditSummaryFileProps, type EditFileState, type EditFileStatus, type DiffProps, type DiffHunk, type DiffLine } from "./components/EditSummary.tsx";
export { Approval, type ApprovalProps, type ApprovalOption } from "./components/Approval.tsx";
export { Plan, type PlanProps, type PlanItem } from "./components/Plan.tsx";
export { TurnNotice, type TurnNoticeProps, type TurnNoticeStatus } from "./components/TurnNotice.tsx";
export { Attachment, ComposerMenu, Queue, Timestamp, formatTimestamp, TIMESTAMP_GAP, type AttachmentProps, type AttachmentStatus, type ComposerMenuProps, type ComposerMenuItem, type ComposerMenuGroup, type QueueProps, type QueueItem, type TimestampProps } from "./components/ComposerParts.tsx";

export { ColorPicker, hexToHsv, hsvToHex, type ColorPickerProps, type ColorModel, type ColorView, type ColorGamut, type OklchValue } from "./components/ColorPicker.tsx";
export { AREA_COLOR_GRID } from "./components/color-grid.ts";
export { Calendar, type CalendarProps, type CalendarRange } from "./components/Calendar.tsx";

export { Presence, type PresenceProps } from "./components/Presence.tsx";
export { ReferenceList, ReferenceListItem, referenceListVariants, type ReferenceListProps, type ReferenceListItemProps } from "./components/ReferenceList.tsx";
export { TableOfContents, tableOfContentsVariants, type TableOfContentsProps, type TableOfContentsItem } from "./components/TableOfContents.tsx";
export { Figure, figureVariants, type FigureProps } from "./components/Figure.tsx";
export { InlineList, inlineListVariants, type InlineListProps } from "./components/InlineList.tsx";
export { Abbreviation, abbreviationVariants, type AbbreviationProps } from "./components/Abbreviation.tsx";
export { Hatnote, hatnoteVariants } from "./components/Hatnote.tsx";
export { LinkGroups, LinkGroup, linkGroupsVariants, type LinkGroupsProps, type LinkGroupProps } from "./components/LinkGroups.tsx";
export { VideoPlayer, videoPlayerVariants, type VideoPlayerProps } from "./components/VideoPlayer.tsx";
